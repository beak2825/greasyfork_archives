// @name              无剑Mud辅助
// ==UserScript==
// @name:zh-TW        無劍Mud輔助
// @description       无剑Mud辅助，由在线版移植而来，順便《略改》
// @description:zh-TW 無劍Mud輔助，由在線版移植而來，順便《略改》q
// @namespace         http://tampermonkey.net/
// @version           9.9.8
// @dev_version       998
// @iconURL           http://res.yytou.cn/lunjian_tw/img/icon1.png
// @author            九
// @match             http://121.40.177.24:8001/*
// @match             http://110.42.64.223:8021/*
// @match             http://121.40.177.24:8041/*
// @match             http://121.40.177.24:8061/*
// @match             http://110.42.64.223:8081/*
// @match             http://121.40.177.24:8101/*
// @match             http://121.40.177.24:8102/*
// @match             http://swordman-s1.btmud.com/*
// @match             http://swordman-inter.btmud.com/*
// @grant             unsafeWindow
// @grant             GM_info
// @grant             GM_setClipboard
// @grant             GM_xmlhttpRequest
// @grant             GM_openInTab
// @connect           greasyfork.org
// @connect           update.greasyfork.org
// @run-at            document-end
// @compatible        Chrome >= 80
// @compatible        Edge >= 80
// @compatible        Firefox PC >= 74
// @compatible        Opera >= 67
// @compatible        Safari MacOS >= 13.1
// @compatible        Firefox Android >= 79
// @compatible        Opera Android >= 57
// @compatible        Safari iOS >= 13.4
// @compatible        WebView Android >= 80
// @require https://update.greasyfork.org/scripts/445697/1244619/Greasy%20Fork%20API.js
// @downloadURL https://update.greasyfork.org/scripts/490959/%E5%8F%B0%E6%9C%8D%E6%97%A0%E5%89%91Mud%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/490959/%E5%8F%B0%E6%9C%8D%E6%97%A0%E5%89%91Mud%E8%BE%85%E5%8A%A9.meta.js
// @license MIT
// ==/UserScript==

"use strict";

if (document.domain == "orchin.cn") {
  var params = new URLSearchParams(location.href.split("?")[1]);
  var host = params.get("ws_host");
  params["delete"]("ws_host");
  location.replace("http://" + host + "?" + params.toString());
}

if (window.gameAuth == undefined) {

  var auth = location.search.split("?");
  if (auth.length > 0) {
    window.gameAuth = auth[1];
  } else {
    window.gameAuth = auth[0];
  }
}

function JTPYStr()
{
	return "只采仆锕皑蔼碍爱嗳嫒瑷暧霭谙铵鹌肮袄奥媪骜鳌坝罢钯摆败呗颁办绊钣帮绑镑谤剥饱宝报鲍鸨龅辈贝钡狈备惫鹎贲锛绷笔毕毙币闭荜哔滗铋筚跸边编贬变辩辫苄缏笾标骠飑飙镖镳鳔鳖别瘪濒滨宾摈傧缤槟殡膑镔髌鬓饼禀拨钵铂驳饽钹鹁补钸财参蚕残惭惨灿骖黪苍舱仓沧厕侧册测恻层诧锸侪钗搀掺蝉馋谗缠铲产阐颤冁谄谶蒇忏婵骣觇禅镡场尝长偿肠厂畅伥苌怅阊鲳钞车彻砗尘陈衬伧谌榇碜龀撑称惩诚骋枨柽铖铛痴迟驰耻齿炽饬鸱冲冲虫宠铳畴踌筹绸俦帱雠橱厨锄雏础储触处刍绌蹰传钏疮闯创怆锤缍纯鹑绰辍龊辞词赐鹚聪葱囱从丛苁骢枞凑辏蹿窜撺错锉鹾达哒鞑带贷骀绐担单郸掸胆惮诞弹殚赕瘅箪当挡党荡档谠砀裆捣岛祷导盗焘灯邓镫敌涤递缔籴诋谛绨觌镝颠点垫电巅钿癫钓调铫鲷谍叠鲽钉顶锭订铤丢铥东动栋冻岽鸫窦犊独读赌镀渎椟牍笃黩锻断缎簖兑队对怼镦吨顿钝炖趸夺堕铎鹅额讹恶饿谔垩阏轭锇锷鹗颚颛鳄诶儿尔饵贰迩铒鸸鲕罚阀珐矾钒烦贩饭访纺钫鲂飞诽废费绯镄鲱纷坟奋愤粪偾丰枫锋风疯冯缝讽凤沣肤辐抚辅赋负讣妇缚凫驸绂绋赙麸鲋鳆钆该钙盖赅杆赶秆赣尴擀绀冈刚钢纲岗戆镐睾诰缟锆搁鸽阁铬个纥镉颍给亘赓绠鲠龚宫巩贡钩沟苟构购够诟缑觏蛊顾诂毂钴锢鸪鹄鹘剐挂鸹掴关观馆惯贯诖掼鹳鳏广犷规归龟闺轨诡贵刽匦刿妫桧鲑鳜辊滚衮绲鲧锅国过埚呙帼椁蝈铪骇韩汉阚绗颉号灏颢阂鹤贺诃阖蛎横轰鸿红黉讧荭闳鲎壶护沪户浒鹕哗华画划话骅桦铧怀坏欢环还缓换唤痪焕涣奂缳锾鲩黄谎鳇挥辉毁贿秽会烩汇讳诲绘诙荟哕浍缋珲晖荤浑诨馄阍获货祸钬镬击机积饥迹讥鸡绩缉极辑级挤几蓟剂济计记际继纪讦诘荠叽哜骥玑觊齑矶羁虿跻霁鲚鲫夹荚颊贾钾价驾郏浃铗镓蛲歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧谏缣戋戬睑鹣笕鲣鞯将浆蒋桨奖讲酱绛缰胶浇骄娇搅铰矫侥脚饺缴绞轿较挢峤鹪鲛阶节洁结诫届疖颌鲒紧锦仅谨进晋烬尽劲荆茎卺荩馑缙赆觐鲸惊经颈静镜径痉竞净刭泾迳弪胫靓纠厩旧阄鸠鹫驹举据锯惧剧讵屦榉飓钜锔窭龃鹃绢锩镌隽觉决绝谲珏钧军骏皲开凯剀垲忾恺铠锴龛闶钪铐颗壳课骒缂轲钶锞颔垦恳龈铿抠库裤喾块侩郐哙脍宽狯髋矿旷况诓诳邝圹纩贶亏岿窥馈溃匮蒉愦聩篑阃锟鲲扩阔蛴蜡腊莱来赖崃徕涞濑赉睐铼癞籁蓝栏拦篮阑兰澜谰揽览懒缆烂滥岚榄斓镧褴琅阆锒捞劳涝唠崂铑铹痨乐鳓镭垒类泪诔缧篱狸离鲤礼丽厉励砾历沥隶俪郦坜苈莅蓠呖逦骊缡枥栎轹砺锂鹂疠粝跞雳鲡鳢俩联莲连镰怜涟帘敛脸链恋炼练蔹奁潋琏殓裢裣鲢粮凉两辆谅魉疗辽镣缭钌鹩猎临邻鳞凛赁蔺廪檩辚躏龄铃灵岭领绫棂蛏鲮馏刘浏骝绺镏鹨龙聋咙笼垄拢陇茏泷珑栊胧砻楼娄搂篓偻蒌喽嵝镂瘘耧蝼髅芦卢颅庐炉掳卤虏鲁赂禄录陆垆撸噜闾泸渌栌橹轳辂辘氇胪鸬鹭舻鲈峦挛孪滦乱脔娈栾鸾銮抡轮伦仑沦纶论囵萝罗逻锣箩骡骆络荦猡泺椤脶镙驴吕铝侣屡缕虑滤绿榈褛锊呒妈玛码蚂马骂吗唛嬷杩买麦卖迈脉劢瞒馒蛮满谩缦镘颡鳗猫锚铆贸麽没镁门闷们扪焖懑钔锰梦眯谜弥觅幂芈谧猕祢绵缅渑腼黾庙缈缪灭悯闽闵缗鸣铭谬谟蓦馍殁镆谋亩钼呐钠纳难挠脑恼闹铙讷馁内拟腻铌鲵撵辇鲶酿鸟茑袅聂啮镊镍陧蘖嗫颟蹑柠狞宁拧泞苎咛聍钮纽脓浓农侬哝驽钕诺傩疟欧鸥殴呕沤讴怄瓯盘蹒庞抛疱赔辔喷鹏纰罴铍骗谝骈飘缥频贫嫔苹凭评泼颇钋扑铺朴谱镤镨栖脐齐骑岂启气弃讫蕲骐绮桤碛颀颃鳍牵钎铅迁签谦钱钳潜浅谴堑佥荨悭骞缱椠钤枪呛墙蔷强抢嫱樯戗炝锖锵镪羟跄锹桥乔侨翘窍诮谯荞缲硗跷窃惬锲箧钦亲寝锓轻氢倾顷请庆揿鲭琼穷茕蛱巯赇虮鳅趋区躯驱龋诎岖阒觑鸲颧权劝诠绻辁铨却鹊确阕阙悫让饶扰绕荛娆桡热韧认纫饪轫荣绒嵘蝾缛铷颦软锐蚬闰润洒萨飒鳃赛伞毵糁丧骚扫缫涩啬铯穑杀刹纱铩鲨筛晒酾删闪陕赡缮讪姗骟钐鳝墒伤赏垧殇觞烧绍赊摄慑设厍滠畲绅审婶肾渗诜谂渖声绳胜师狮湿诗时蚀实识驶势适释饰视试谥埘莳弑轼贳铈鲥寿兽绶枢输书赎属术树竖数摅纾帅闩双谁税顺说硕烁铄丝饲厮驷缌锶鸶耸怂颂讼诵擞薮馊飕锼苏诉肃谡稣虽随绥岁谇孙损笋荪狲缩琐锁唢睃獭挞闼铊鳎态钛鲐摊贪瘫滩坛谭谈叹昙钽锬顸汤烫傥饧铴镗涛绦讨韬铽腾誊锑题体屉缇鹈阗条粜龆鲦贴铁厅听烃铜统恸头钭秃图钍团抟颓蜕饨脱鸵驮驼椭箨鼍袜娲腽弯湾顽万纨绾网辋韦违围为潍维苇伟伪纬谓卫诿帏闱沩涠玮韪炜鲔温闻纹稳问阌瓮挝蜗涡窝卧莴龌呜钨乌诬无芜吴坞雾务误邬庑怃妩骛鹉鹜锡牺袭习铣戏细饩阋玺觋虾辖峡侠狭厦吓硖鲜纤贤衔显险现献县馅羡宪线苋莶藓岘猃娴鹇痫蚝籼跹厢镶乡详响项芗饷骧缃飨萧嚣销晓啸哓潇骁绡枭箫协挟携胁谐写泻谢亵撷绁缬锌衅兴陉荥凶汹锈绣馐鸺虚嘘须许叙绪续诩顼轩悬选癣绚谖铉镟学谑泶鳕勋询寻驯训讯逊埙浔鲟压鸦鸭哑亚讶垭娅桠氩阉烟盐严岩颜阎艳厌砚彦谚验厣赝俨兖谳恹闫酽魇餍鼹鸯杨扬疡阳痒养样炀瑶摇尧遥窑谣药轺鹞鳐爷页业叶靥谒邺晔烨医铱颐遗仪蚁艺亿忆义诣议谊译异绎诒呓峄饴怿驿缢轶贻钇镒镱瘗舣荫阴银饮隐铟瘾樱婴鹰应缨莹萤营荧蝇赢颖茔莺萦蓥撄嘤滢潆璎鹦瘿颏罂哟拥佣痈踊咏镛优忧邮铀犹诱莸铕鱿舆鱼渔娱与屿语狱誉预驭伛俣谀谕蓣嵛饫阈妪纡觎欤钰鹆鹬龉鸳渊辕园员圆缘远橼鸢鼋约跃钥粤悦阅钺郧匀陨运蕴酝晕韵郓芸恽愠纭韫殒氲杂灾载攒暂瓒趱錾赃脏驵凿枣责择则泽赜啧帻箦贼谮赠综缯轧铡闸栅诈斋债毡盏斩辗崭栈战绽谵张涨帐账胀赵诏钊蛰辙锗这谪辄鹧贞针侦诊镇阵浈缜桢轸赈祯鸩挣睁狰争帧症郑证诤峥钲铮筝织职执纸挚掷帜质滞骘栉栀轵轾贽鸷蛳絷踬踯觯钟终种肿众锺诌轴皱昼骤纣绉猪诸诛烛瞩嘱贮铸驻伫槠铢专砖转赚啭馔颞桩庄装妆壮状锥赘坠缀骓缒谆准着浊诼镯兹资渍谘缁辎赀眦锱龇鲻踪总纵偬邹诹驺鲰诅组镞钻缵躜鳟翱并沉丑淀迭斗范干皋硅柜后伙秸杰诀夸凌么霉捻凄扦圣尸抬涂洼汙锨咸蝎彝涌游吁御愿云灶扎札筑于凋讠谫凼坂垅垴埯埝苘荬荮莜莼菰藁揸吒吣咔咝咴噘噼嚯幞岙嵴彷徼犸狍馀馇馓馕愣憷懔丬溆滟潴纟绔绱珉枧桊槔橥轱轷赍肷胨飚煳煅熘愍淼砜磙眍钚钷铘铞锃锍锎锏锘锝锪锫锿镅镎镢镥镩镲稆鹋鹛鹱疬疴痖癯裥襁耢颥螨麴鲅鲆鲇鲞鲴鲺鲼鳊鳋鳘鳙鞒鞴齄么复赞发发松松闲闲瞆"
}

function FTPYStr()
{
	return "隻採僕錒皚藹礙愛噯嬡璦曖靄諳銨鵪骯襖奧媼驁鰲壩罷鈀擺敗唄頒辦絆鈑幫綁鎊謗剝飽寶報鮑鴇齙輩貝鋇狽備憊鵯賁錛繃筆畢斃幣閉蓽嗶潷鉍篳蹕邊編貶變辯辮芐緶籩標驃颮飆鏢鑣鰾鱉別癟瀕濱賓擯儐繽檳殯臏鑌髕鬢餅稟撥缽鉑駁餑鈸鵓補鈽財參蠶殘慚慘燦驂黲蒼艙倉滄廁側冊測惻層詫鍤儕釵攙摻蟬饞讒纏鏟產闡顫囅諂讖蕆懺嬋驏覘禪鐔場嘗長償腸廠暢倀萇悵閶鯧鈔車徹硨塵陳襯傖諶櫬磣齔撐稱懲誠騁棖檉鋮鐺癡遲馳恥齒熾飭鴟沖衝蟲寵銃疇躊籌綢儔幬讎櫥廚鋤雛礎儲觸處芻絀躕傳釧瘡闖創愴錘綞純鶉綽輟齪辭詞賜鶿聰蔥囪從叢蓯驄樅湊輳躥竄攛錯銼鹺達噠韃帶貸駘紿擔單鄲撣膽憚誕彈殫賧癉簞當擋黨蕩檔讜碭襠搗島禱導盜燾燈鄧鐙敵滌遞締糴詆諦綈覿鏑顛點墊電巔鈿癲釣調銚鯛諜疊鰈釘頂錠訂鋌丟銩東動棟凍崠鶇竇犢獨讀賭鍍瀆櫝牘篤黷鍛斷緞籪兌隊對懟鐓噸頓鈍燉躉奪墮鐸鵝額訛惡餓諤堊閼軛鋨鍔鶚顎顓鱷誒兒爾餌貳邇鉺鴯鮞罰閥琺礬釩煩販飯訪紡鈁魴飛誹廢費緋鐨鯡紛墳奮憤糞僨豐楓鋒風瘋馮縫諷鳳灃膚輻撫輔賦負訃婦縛鳧駙紱紼賻麩鮒鰒釓該鈣蓋賅桿趕稈贛尷搟紺岡剛鋼綱崗戇鎬睪誥縞鋯擱鴿閣鉻個紇鎘潁給亙賡綆鯁龔宮鞏貢鉤溝茍構購夠詬緱覯蠱顧詁轂鈷錮鴣鵠鶻剮掛鴰摑關觀館慣貫詿摜鸛鰥廣獷規歸龜閨軌詭貴劊匭劌媯檜鮭鱖輥滾袞緄鯀鍋國過堝咼幗槨蟈鉿駭韓漢闞絎頡號灝顥閡鶴賀訶闔蠣橫轟鴻紅黌訌葒閎鱟壺護滬戶滸鶘嘩華畫劃話驊樺鏵懷壞歡環還緩換喚瘓煥渙奐繯鍰鯇黃謊鰉揮輝毀賄穢會燴匯諱誨繪詼薈噦澮繢琿暉葷渾諢餛閽獲貨禍鈥鑊擊機積饑跡譏雞績緝極輯級擠幾薊劑濟計記際繼紀訐詰薺嘰嚌驥璣覬齏磯羈蠆躋霽鱭鯽夾莢頰賈鉀價駕郟浹鋏鎵蟯殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗諫縑戔戩瞼鶼筧鰹韉將漿蔣槳獎講醬絳韁膠澆驕嬌攪鉸矯僥腳餃繳絞轎較撟嶠鷦鮫階節潔結誡屆癤頜鮚緊錦僅謹進晉燼盡勁荊莖巹藎饉縉贐覲鯨驚經頸靜鏡徑痙競凈剄涇逕弳脛靚糾廄舊鬮鳩鷲駒舉據鋸懼劇詎屨櫸颶鉅鋦窶齟鵑絹錈鐫雋覺決絕譎玨鈞軍駿皸開凱剴塏愾愷鎧鍇龕閌鈧銬顆殼課騍緙軻鈳錁頷墾懇齦鏗摳庫褲嚳塊儈鄶噲膾寬獪髖礦曠況誆誑鄺壙纊貺虧巋窺饋潰匱蕢憒聵簣閫錕鯤擴闊蠐蠟臘萊來賴崍徠淶瀨賚睞錸癩籟藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫嵐欖斕鑭襤瑯閬鋃撈勞澇嘮嶗銠鐒癆樂鰳鐳壘類淚誄縲籬貍離鯉禮麗厲勵礫歷瀝隸儷酈壢藶蒞蘺嚦邐驪縭櫪櫟轢礪鋰鸝癘糲躒靂鱺鱧倆聯蓮連鐮憐漣簾斂臉鏈戀煉練蘞奩瀲璉殮褳襝鰱糧涼兩輛諒魎療遼鐐繚釕鷯獵臨鄰鱗凜賃藺廩檁轔躪齡鈴靈嶺領綾欞蟶鯪餾劉瀏騮綹鎦鷚龍聾嚨籠壟攏隴蘢瀧瓏櫳朧礱樓婁摟簍僂蔞嘍嶁鏤瘺耬螻髏蘆盧顱廬爐擄鹵虜魯賂祿錄陸壚擼嚕閭瀘淥櫨櫓轤輅轆氌臚鸕鷺艫鱸巒攣孿灤亂臠孌欒鸞鑾掄輪倫崙淪綸論圇蘿羅邏鑼籮騾駱絡犖玀濼欏腡鏍驢呂鋁侶屢縷慮濾綠櫚褸鋝嘸媽瑪碼螞馬罵嗎嘜嬤榪買麥賣邁脈勱瞞饅蠻滿謾縵鏝顙鰻貓錨鉚貿麼沒鎂門悶們捫燜懣鍆錳夢瞇謎彌覓冪羋謐獼禰綿緬澠靦黽廟緲繆滅憫閩閔緡鳴銘謬謨驀饃歿鏌謀畝鉬吶鈉納難撓腦惱鬧鐃訥餒內擬膩鈮鯢攆輦鯰釀鳥蔦裊聶嚙鑷鎳隉蘗囁顢躡檸獰寧擰濘苧嚀聹鈕紐膿濃農儂噥駑釹諾儺瘧歐鷗毆嘔漚謳慪甌盤蹣龐拋皰賠轡噴鵬紕羆鈹騙諞駢飄縹頻貧嬪蘋憑評潑頗釙撲鋪樸譜鏷鐠棲臍齊騎豈啟氣棄訖蘄騏綺榿磧頎頏鰭牽釬鉛遷簽謙錢鉗潛淺譴塹僉蕁慳騫繾槧鈐槍嗆墻薔強搶嬙檣戧熗錆鏘鏹羥蹌鍬橋喬僑翹竅誚譙蕎繰磽蹺竊愜鍥篋欽親寢鋟輕氫傾頃請慶撳鯖瓊窮煢蛺巰賕蟣鰍趨區軀驅齲詘嶇闃覷鴝顴權勸詮綣輇銓卻鵲確闋闕愨讓饒擾繞蕘嬈橈熱韌認紉飪軔榮絨嶸蠑縟銣顰軟銳蜆閏潤灑薩颯鰓賽傘毿糝喪騷掃繅澀嗇銫穡殺剎紗鎩鯊篩曬釃刪閃陜贍繕訕姍騸釤鱔墑傷賞坰殤觴燒紹賒攝懾設厙灄畬紳審嬸腎滲詵諗瀋聲繩勝師獅濕詩時蝕實識駛勢適釋飾視試謚塒蒔弒軾貰鈰鰣壽獸綬樞輸書贖屬術樹豎數攄紓帥閂雙誰稅順說碩爍鑠絲飼廝駟緦鍶鷥聳慫頌訟誦擻藪餿颼鎪蘇訴肅謖穌雖隨綏歲誶孫損筍蓀猻縮瑣鎖嗩脧獺撻闥鉈鰨態鈦鮐攤貪癱灘壇譚談嘆曇鉭錟頇湯燙儻餳鐋鏜濤絳討韜鋱騰謄銻題體屜緹鵜闐條糶齠鰷貼鐵廳聽烴銅統慟頭鈄禿圖釷團摶頹蛻飩脫鴕馱駝橢籜鼉襪媧膃彎灣頑萬紈綰網輞韋違圍為濰維葦偉偽緯謂衛諉幃闈溈潿瑋韙煒鮪溫聞紋穩問閿甕撾蝸渦窩臥萵齷嗚鎢烏誣無蕪吳塢霧務誤鄔廡憮嫵騖鵡鶩錫犧襲習銑戲細餼鬩璽覡蝦轄峽俠狹廈嚇硤鮮纖賢銜顯險現獻縣餡羨憲線莧薟蘚峴獫嫻鷴癇蠔秈躚廂鑲鄉詳響項薌餉驤緗饗蕭囂銷曉嘯嘵瀟驍綃梟簫協挾攜脅諧寫瀉謝褻擷紲纈鋅釁興陘滎兇洶銹繡饈鵂虛噓須許敘緒續詡頊軒懸選癬絢諼鉉鏇學謔澩鱈勳詢尋馴訓訊遜塤潯鱘壓鴉鴨啞亞訝埡婭椏氬閹煙鹽嚴巖顏閻艷厭硯彥諺驗厴贗儼兗讞懨閆釅魘饜鼴鴦楊揚瘍陽癢養樣煬瑤搖堯遙窯謠藥軺鷂鰩爺頁業葉靨謁鄴曄燁醫銥頤遺儀蟻藝億憶義詣議誼譯異繹詒囈嶧飴懌驛縊軼貽釔鎰鐿瘞艤蔭陰銀飲隱銦癮櫻嬰鷹應纓瑩螢營熒蠅贏穎塋鶯縈鎣攖嚶瀅瀠瓔鸚癭頦罌喲擁傭癰踴詠鏞優憂郵鈾猶誘蕕銪魷輿魚漁娛與嶼語獄譽預馭傴俁諛諭蕷崳飫閾嫗紆覦歟鈺鵒鷸齬鴛淵轅園員圓緣遠櫞鳶黿約躍鑰粵悅閱鉞鄖勻隕運蘊醞暈韻鄆蕓惲慍紜韞殞氳雜災載攢暫瓚趲鏨贓臟駔鑿棗責擇則澤賾嘖幘簀賊譖贈綜繒軋鍘閘柵詐齋債氈盞斬輾嶄棧戰綻譫張漲帳賬脹趙詔釗蟄轍鍺這謫輒鷓貞針偵診鎮陣湞縝楨軫賑禎鴆掙睜猙爭幀癥鄭證諍崢鉦錚箏織職執紙摯擲幟質滯騭櫛梔軹輊贄鷙螄縶躓躑觶鐘終種腫眾鍾謅軸皺晝驟紂縐豬諸誅燭矚囑貯鑄駐佇櫧銖專磚轉賺囀饌顳樁莊裝妝壯狀錐贅墜綴騅縋諄準著濁諑鐲茲資漬諮緇輜貲眥錙齜鯔蹤總縱傯鄒諏騶鯫詛組鏃鉆纘躦鱒翺並沈醜澱叠鬥範幹臯矽櫃後夥稭傑訣誇淩麽黴撚淒扡聖屍擡塗窪污鍁鹹蠍彜湧遊籲禦願雲竈紮劄築於雕訁譾氹阪壟堖垵墊檾蕒葤蓧蒓菇槁摣咤唚哢噝噅撅劈謔襆嶴脊仿僥獁麅餘餷饊饢楞怵懍爿漵灩瀦糸絝緔瑉梘棬橰櫫軲軤賫膁腖飈糊煆溜湣渺碸滾瞘鈈鉕鋣銱鋥鋶鐦鐧鍩鍀鍃錇鎄鎇鎿鐝鑥鑹鑔穭鶓鶥鸌癧屙瘂臒襇繈耮顬蟎麯鮁鮃鮎鯗鯝鯴鱝鯿鰠鰵鱅鞽韝齇麽覆讚發髮松鬆閒閑瞶"
}

function Traditionalized(cc)
{
	var str = '';
	var ss = JTPYStr();
	var tt = FTPYStr();

	for(var i = 0 ; i < cc.length ; i++ )
	{
		if( cc.charCodeAt(i) > 10000 && ss.indexOf( cc.charAt(i) ) != -1 )
			str += tt.charAt( ss.indexOf( cc.charAt(i) ) );
  		else
  			str += cc.charAt(i);
	}
	return str;
}

function Simplized(cc){
	var str = '';
	var ss = JTPYStr();
	var tt = FTPYStr();

	for( var i=0 ; i < cc.length ; i++)
	{
		if( cc.charCodeAt(i) > 10000 && tt.indexOf( cc.charAt(i) ) != -1 )
			str += ss.charAt( tt.indexOf( cc.charAt(i) ) );
  		else
  			str += cc.charAt(i);
	}
	return str;
}


function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}


function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function Log(text) {
  if (Array.isArray(arr)) return arr;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function check_time(p) {
  return FormatDate(new Date(new Date()), p)
}

function checkTime() {
  return FormatDate(new Date(new Date()), "hh:mm")
}

function checkDay() {
  return FormatDate(new Date(new Date() - 6 * 3600 * 1000), "yyyyMMdd")
}

function checkWeek(w) {
  return w == ["日", "一", "二", "三", "四", "五", "六"][new Date().getDay()] ? true : false;
}

function FormatDate(date, fmt) { //author: meizz
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function F() { };
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e2) {
          throw _e2;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e3) {
      didErr = true;
      err = _e3;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

// 取消屏蔽
var KEYWORD_PATTERNS = g_gmain.KEYWORD_PATTERNS;
g_gmain.KEYWORD_PATTERNS = [];

$(() => {
  function init() {
    GreasyFork.getScriptData("491806").then(data => {
      PLU.version = data.version;

      const dataFile = localStorage.getItem('dataFile');
      PLU.YFUI = YFUI;
      PLU.UTIL = UTIL;
      PLU.YFD = eval(dataFile);

      /*document.addEventListener('DOMContentLoaded', function() {
        firebase.initializeApp({
          apiKey: "AIzaSyAeqSOIkfyUS7ab_9ypBuO5MQi2qOXf_80",
          authDomain: "wujian-mud.firebaseapp.com",
          projectId: "wujian-mud",
          storageBucket: "wujian-mud.appspot.com",
          messagingSenderId: "629715186973",
          appId: "1:629715186973:web:2b0164d707ef1a8cdbddf4",
          measurementId: "G-PBN09DKL9Q"
        });

        window.firestore = firebase.firestore();
        var app = window.firebase.initializeApp(firebaseConfig);
        var db = window.firebase.firestore();
      });*/

      let waitGameSI = setInterval(() => {
        if (g_obj_map && g_obj_map.get("msg_attrs")) {
          clearInterval(waitGameSI);
          PLU.init();
        }
      }, 500);
    })
  }





  // 本地化
  function _(c, t) {
    var i18n = unsafeWindow.g_version_tw ? "tw" : "cn";
    if (i18n == "cn" && c) return c;
    return t;
  }

  class Base64 {
    constructor() {
      let Encoder = new TextEncoder();
      let Decoder = new TextDecoder();
      this.encode = (s) => btoa(Array.from(Encoder.encode(s), (x) => String.fromCodePoint(x)).join(""));
      this.decode = (s) => Decoder.decode(Uint8Array.from(atob(s), (m) => m.codePointAt(0)));
    }
  }

  function MiGongNavi() {
    return {
      Append: function (name, cmd) {
        if ($("#out #MiGongNaviPanel").length == 0 && $("#out table").length > 1) {
          $("#out table:eq(1)").after('<div id="MiGongNaviPanel"><div>' + _('马车', '馬車') + '：</div></div>')
        } else if ($("#out #MiGongNaviPanel").length == 0 && $("#out table").length == 1) {
          $("#out button:eq(2)").prev().prev().replaceWith('<div id="MiGongNaviPanel"><div>' + _('马车', '馬車') + '：</div></div>')
        }
        // button.setAttribute("onClick", 'go("' + arr[i].way + '")');
        $("#out #MiGongNaviPanel").append('<button type="button" cellpadding="0" cellspacing="0" onclick="PLU.execActions(\'' + cmd + '\')" class="cmd_click3"><font style="color:yellow">' + name + "</font></button>")
      },
      Before: function (name, cmd, br) {
        if (br) {
          $("#out .out .cmd_click3:first").before('<button type="button" cellpadding="0" cellspacing="0" onclick="PLU.execActions(\'' + cmd + '\')" class="cmd_click3"><font style="color:yellow">' + name + "</font></button>").before("<br>");
        } else {
          $("#out .out .cmd_click3:first").before('<button type="button" cellpadding="0" cellspacing="0" onclick="PLU.execActions(\'' + cmd + '\')" class="cmd_click3"><font style="color:yellow">' + name + "</font></button>");
        }
      },
      Clear: function () {
        $("#out #MiGongNaviPanel").remove()
      }
    }
  }
  //=================================================================================
  // UTIL模組
  //=================================================================================
  unsafeWindow.PLU = {
    version: GM_info.script.version,
    patch: "patch_98",
    accId: null,
    nickName: null,
    battleData: null,
    MPFZ: {},
    TODO: [], //待辦列表
    STO: {},
    SIT: {},
    ONOFF: {},
    STATUS: {
      inBattle: 0,
      isBusy: 0,
      battleCureOn: 0,
      battleArrayOn: 0,
    },
    CACHE: {
      autoDZ: 1,
      autoHYC: 1,
      auto9H: 1,
      autoLX: 1,
      autoBF: 1,
      autoB6: 1,
      autoB5F: 1,
      autoAFK: 0,
      autoAccept: 1,
      develop: 0,
      puzzleTimeOut: 60,
      isMVP: 0,
      openClan: 0,
      fb12_broadcast: 0,
    },
    battlingSkills: {
      skillInit: false,
      skillInited: false,
      ultrapos: 1,
      play_ultra: false,
      data: [{
        Enable: false,
        Pos: 1,
        Key: "playskill 1",
        Name: "",
        Xdz: 0,
      }, {
        Enable: false,
        Pos: 2,
        Key: "playskill 2",
        Name: "",
        Xdz: 0,
      }, {
        Enable: false,
        Pos: 3,
        Key: "playskill 3",
        Name: "",
        Xdz: 0,
      }, {
        Enable: false,
        Pos: 4,
        Key: "playskill 4",
        Name: "",
        Xdz: 0,
      }, {
        Enable: false,
        Pos: 5,
        Key: "playskill 5",
        Name: "",
        Xdz: 0,
      }, {
        Enable: false,
        Pos: 6,
        Key: "playskill 6",
        Name: "",
        Xdz: 0,
      }],
      xdz: -1,
			force: -1,
      clear: function() {
        this.skillInit = false;
        this.skillInited = false;
        this.xdz = -1;
				this.force = -1;
      },
      init: function() {
        if (!this.skillInit) return
        var bInfo = PLU.getBattleInfo();
        if (!bInfo) return;
        for (var i = this.data.length - 1; i > -1; i--) {
          this.data[i].Enable = false;
        }
        this.xdz = parseInt(bInfo.get(PLU.battleMyHead + "_xdz" + PLU.battleMyPos));
        this.force = parseInt(bInfo.get(PLU.battleMyHead + "_force" + PLU.battleMyPos));
        for (var i = 0; i < 6; i++) {
          var btn = g_obj_map.get("skill_button" + (i + 1));
          if (!btn) continue;
          this.data[i].Enable = true;
          this.data[i].Name = PLU.dispatchChineseMsg(btn.get("name"));
          this.data[i].Xdz = parseInt(btn.get("xdz"));
        }
        this.skillInited = true;
      },
      play: function(name, ultra) {
        if (!name) return;
        if (!this.skillInit) return
        if (!this.skillInited) {
          this.init();
        }

        // Log("skills", this.xdz, this.data);
        // 只能顺序查找，因为当技能不全时，后面的会出假技能
        var skill = null;
        for (var i = 0; i < this.data.length; i++) {
          var sk = this.data[i];
          if (!sk) continue;
          if (!sk.Enable) continue;
          if (!sk.Name.match(name)) continue
          if (sk.Xdz > this.xdz) continue  // 气不足
          skill = sk;
          // 标记其他技能为不可用
          this.data[i].Enable = false;
          break;
        }
        if (!skill) {
          console.log("Invalid Skill:", name);
          return false;
        }
        // Log("Play Skill:", name);
        if (ultra) {
					if (this.force < 20) return
					this.xdz -= skill.Xdz;
					clickButton(skill.Key);
					return true;
				} 
				this.xdz -= skill.Xdz;
				clickButton(skill.Key);
				return true;
      },
      ready: function() {
        this.init();
      },
      useAny: function(skillNames) {
        var namesLen = skillNames.length;
        if (namesLen == 0) {
          return false
        }
        for (var i = 0; i < namesLen; i++) {
          if (this.play(skillNames[i]), false) {
            return true
          }
        }
      },
      useAll: function(skillNames, ultra) {
        var namesLen = skillNames.length;
        if (namesLen == 0) {
          return false
        }
        if (ultra) {
          for (var u = 0; u <= ultra.length; u++) {
            this.play(ultra[u], true)
          }
        }
        for (var i = 0; i <= namesLen; i++) {
          this.play(skillNames[i], false)
        }
      },
    },
    FLK: null,
    TMP: { autotask: false, iBatchAskModel: 0 },
    logHtml: "",
    chatHtml: "",
    signInMaps: null,
    //================================================================================================
    init() {
      this.accId = UTIL.getAccId();
      this.areaId = UTIL.getAreaId();
      this.actionStop = false;
      this.FzBusy = false;
			this.orioN = false;
      this.dwQ = false;
      this.sWG = false;
      this.inOwen = false;
      this.CH_stop = false;
      this.lastSite = null;
      this.lastSite_map = null;
			this.keepK4 = 0;
			this.keepK5 = 0;
			this.K5head = false;
      this.musicStep = 1;
      this.developerMode =
        (UTIL.getMem("CACHE") && JSON.parse(UTIL.getMem("CACHE")).developer) || ["8429379(1)", "8432668(1)", "8432667(1)", "8432616(1)", "8045490(102)"].includes(this.accId);
      this.kakaMode =
        (UTIL.getMem("CACHE") && JSON.parse(UTIL.getMem("CACHE")).developer) || ["8227139(1)", "8230885(1)", "8230807(1)"].includes(this.accId);
      if (this.developerMode) {
        this.GM_info = GM_info;
        UTIL.addSysListener("developer", (b, type, subtype, msg) => {
          if (type && type == "attrs_changed") return;
          if (type && type == "channel" && subtype == "rumor") return;
          console.log(b);
        });
      }
      this.LoopKill = false;
      this.inBattleView = false;
      this.inBattleFight = false;
      this.failToBattleEventKind = -1;
      this.toBattleFightEventKind = 0;
      this.toBattleKillEventKind = 1;
      this.inBattleEventKind = 2;
      this.battleListener = {};
      this.battleTrigger = null;
      this.battleTriggerData = null; // new Map();
      this.battleCureTimes = 0;
      this.stun = false;
      this.stunInterval = null;
      this.loopKillsInterval = null;

      this.battleMyIdx = 0;
      this.battleMyPos = "0";
      this.battleMyHead = "";
      this.battleMyVal = "";

      this.askNpcTaskListenerIdx = 0;
      this.autoXHon = false;
      this.first_click = false;
      this.goTime_out = null;
      this.watch_dance = 0;
      this.fb12_receiveOn = 0;
      this.fb12_receiveNum = 0;
      this.fb12_car = [];

      this.initMenu();
      this.initTickTime();
      this.initStorage();
      this.initHistory();
      this.initSocketMsgEvent();
      this.initVersion();

      if (g_gmain.is_fighting) {
        PLU.inBattleView = true;
        PLU.inBattleFight = true;
        if (PLU.inBattleFight) {
          if (!PLU.battlingSkills.skillInit) {
            PLU.battlingSkills.skillInit = true;
            var bInfo = PLU.getBattleInfo();
            if (!bInfo) return;
            var xdz = bInfo.get(PLU.battleMyHead + "_xdz" + PLU.battleMyPos);
            PLU.battlingSkills.xdz = xdz;
            if (!PLU.battlingSkills.xdz) {
              console.log("init xdz:", bInfo, PLU.battleMyHead + "_xdz" + PLU.battleMyPos, xdz, msg, PLU.battlingSkills)
            }
            // 完成初始战斗时发一个气值事件以便触发战斗
            PLU.inBattleEvent(PLU.battleTriggerData);
          }
        } else {
          PLU.battlingSkills.clear();
        }
      };


      addEventListener("keydown", (key) => {
        if (key.altKey || key.ctrlKey || key.metaKey || key.shiftKey) return; // 不考慮組合鍵
        if (document.activeElement && document.activeElement.tagName == "INPUT") return;
        switch (key.keyCode) {
          case 81: // q
            clickButton("nw");
            break;
          case 87: // w
            clickButton("n");
            break;
          case 69: // e
            clickButton("ne");
            break;
          case 65: // a
            clickButton("w");
            break;
          case 83: // s
            clickButton("s");
            break;
          case 68: // d
            clickButton("e");
            break;
          case 90: // z
            clickButton("sw");
            break;
          case 67: // c
            clickButton("se");
            break;
          case 66:
            // B
            clickButton("items");
            break;
          case 75:
            // k
            clickButton("skills");
            break;
          case 86:
            // v
            clickButton("vip");
            break;
        }
      });
    },
    /*addData: async function addData(key, value) {
      try {
        await window.firestore.collection(key).add(value);
        console.log("Data added successfully!");
      } catch (error) {
        console.error("Error adding data: ", error);
      }
    },
    getData: async function getData(key) {
      try {
        var querySnapshot = await window.firestore.collection(key).get();
        querySnapshot.forEach(doc => {
          console.log(doc.id, " => ", doc.data());
        });
      } catch (error) {
        console.error("Error getting data: ", error);
      }
    },*/
    compress(uncompressed) {
      var dictionary = {};
      var dictSize = 256;
      for (var i = 0; i < 256; i++) {
          dictionary[String.fromCharCode(i)] = i;
      }
      var w = "";
      var result = [];
      for (var i = 0; i < uncompressed.length; i++) {
          var c = uncompressed.charAt(i);
          var wc = w + c;
          if (dictionary.hasOwnProperty(wc)) {
              w = wc;
          } else {
              result.push(dictionary[w]);
              dictionary[wc] = dictSize++;
              w = String(c);
          }
      }
      if (w !== "") {
          result.push(dictionary[w]);
      }
      return result;
    },
    decompress(compressed) {
      var dictionary = {};
      var dictSize = 256;
      for (var i = 0; i < 256; i++) {
          dictionary[i] = String.fromCharCode(i);
      }
      var w = String.fromCharCode(compressed[0]);
      var result = w;
      for (var i = 1; i < compressed.length; i++) {
          var entry = compressed[i];
          var entryStr;
          if (dictionary.hasOwnProperty(entry)) {
              entryStr = dictionary[entry];
          } else if (entry === dictSize) {
              entryStr = w + w.charAt(0);
          } else {
              throw new Error("Bad compressed entry at index " + i);
          }
          result += entryStr;
          dictionary[dictSize++] = w + entryStr.charAt(0);
          w = entryStr;
      }
      return result;
    },
    resetBattleEvent() {
      // 退出正式戰鬥
      PLU.inBattleView = false;
      PLU.inBattleFight = false;
      PLU.STATUS.inBattle = 0;
      PLU.battleCureTimes = 0;
      clearInterval(PLU.battleTrigger);
      PLU.battleTrigger = null;
    },
    getIndexRoomNpc(idx, names, anyOne, newOne) {
      var roomInfo = g_obj_map.get("msg_room");
      if (!roomInfo) return null;
      var npcInfo = roomInfo.get("npc" + idx)
      if (!npcInfo) return null;
      var attrs = npcInfo.split(",");
      var dispName = PLU.dispatchMsg(attrs[1]);
      // 跳过白名NPC
      if (!anyOne && attrs[1] == dispName) return null;
      for (var i = 0; i < names.length; i++) {
        if (!dispName.match(names[i])) continue;
        return {
          key: "npc" + idx,
          code: attrs[0],
          name: attrs[1],
          dispName: dispName,
          inputIdx: i,
        };
      }
      return null;
    },
    matchRoomNpc(names, anyOne, newOne) {
      var roomInfo = g_obj_map.get("msg_room");
      if (!roomInfo) return null;
      var result = null;
      if (newOne) {
        for (var i = roomInfo.elements.length - 1; i > -1; i--) {
          result = PLU.getIndexRoomNpc(i, names, anyOne, newOne);
          if (!result) continue;
          return result;
        }
      } else {
        for (var i = 0; i < roomInfo.elements.length; i++) {
          result = PLU.getIndexRoomNpc(i, names, anyOne, newOne);
          if (!result) continue;
          return result;
        }
      }
      return null;
    },
    getBattleInfo() {
      var vsInfo = g_obj_map.get("msg_vs_info");
      if (!vsInfo) {
        vsInfo = new Map();
      }
      // key like : vs1_pos4
      if (vsInfo.elements.length > PLU.battleMyIdx &&
        vsInfo.elements[PLU.battleMyIdx].value == PLU.battleMyVal &&
        vsInfo.elements[PLU.battleMyIdx].key == PLU.battleMyHead + "_pos" + PLU.battleMyPos) {
        // 已初始化完成
        return vsInfo
      }

      // 首次进入战场时初始化数据,  提取出我方的数据
      for (var i = vsInfo.elements.length - 1; i > -1; i--) {
        var val = vsInfo.elements[i].value + "";
        if (!val || val.indexOf(PLU.accId) < 0) continue;
        // key like : vs1_pos4
        PLU.battleMyIdx = i;
        PLU.battleMyPos = vsInfo.elements[i].key.charAt(7);
        PLU.battleMyHead = vsInfo.elements[i].key.substring(0, 3);
        PLU.battleMyVal = val;
        break;
      }
      return vsInfo;
    },
    getBattleUidByTxt(txt) {
      var info = PLU.getBattleInfo();
      for (var i = info.elements.length - 1; i > -1; i--) {
        if (info.elements[i].key.indexOf("name") < 0) continue;
        var val = PLU.dispatchMsg(info.elements[i].value);
        if (txt.indexOf(val) < 0) continue;
        // found user
        return info.get(info.elements[i].key.replace("name", "pos"))
      }

      // 未找到时默认是自己放的
      return PLU.accId
    },
    getBattlePosByUid(uid) {
      // 若是觀戰，以觀戰id進行識別
      if (uid == PLU.accId && PLU.inBattleView) {
        var watchId = bInfo.get("is_watcher");
        if (!watchId) uid = watchId
      }
      var info = PLU.getBattleInfo();
      for (var i = info.elements.length - 1; i > -1; i--) {
        // key like : vs1_pos4
        var val = info.elements[i].value + "";
        if (val.indexOf(uid) < 0) continue;
        var head = info.elements[i].key.substring(0, 3);
        var pos = info.elements[i].key.charAt(7);
        var allName = PLU.dispatchMsg(info.get(head + "_name" + pos));
        var name = allName;
        var names = allName.split("]");
        if (names && names.length > 1) {
          name = names[1];
        }

        return {
          head: head,
          pos: pos,
          allName: allName,
          name: name,
          friend: head == PLU.battleMyHead,
        }
      }
      return null;
    },
    inBattleEvent(b, type, subtype, msg) {
      if (!b) return;

      if (b instanceof Map) {
        if (!type) type = b.get("type");
        if (!subtype) subtype = b.get("subtype");
      } else {
        if (!type) type = b["type"];
        if (!subtype) subtype = b["subtype"];
      }


      if (PLU.battleTrigger == null) {

        PLU.battleTriggerData = {
          'type': 'vs',
          'subtype': 'sec_timer'
        }


        PLU.battleTrigger = setInterval(function() {
          if (PLU.battlingSkills.xdz < 10) return;
          PLU.inBattleEvent(PLU.battleTriggerData);
        }, 1000)
      }

      switch (subtype) {
        case "vs_info":
          // 初始化
          if (b.containsKey("is_watcher")) {
            PLU.inBattleView = true;
            PLU.inBattleFight = false;
            PLU.STATUS.inBattle = 2;
            break;
          }
          PLU.inBattleFight = true;
          PLU.STATUS.inBattle = 1;
          break;
        case "sec_timer":
          break;
        case "add_xdz":
          PLU.inBattleEvent(PLU.battleTriggerData);
          break;
        case "text":
          break;
        case "playskill":
          if (PLU.stun) PLU.stun = false;
          break;
        case "out_watch":
          PLU.resetBattleEvent();
          break;
        case "combat_result":
          PLU.resetBattleEvent();
          break;
        default:
          // console.log(b.get("type"), b.get("subtype"), b);
          break;
      }

      for (var key in PLU.battleListener) {
        PLU.battleListener[key](b, type, subtype, msg, PLU.inBattleEventKind);
      }
      if (!PLU.stun && PLU.stunInterval) {
        clearInterval(PLU.stunInterval);
      }
      if (PLU.STATUS.battleCureOn && PLU.doAutoCure(b, type, subtype, msg)) return
      if (PLU.STATUS.battleArrayOn && PLU.doAttack(b, type, subtype, msg)) return
      if (msg !== undefined && PLU.dispatchChineseMsg(msg).indexOf(_("头昏目眩", "頭昏目眩")) >= 0 && !PLU.stun) {
        PLU.stun = true;
        PLU.stunInterval = setInterval(() => {
          PLU.battlingSkills.skillInit = true;
          PLU.battlingSkills.skillInited = false;
          PLU.useAllSkills(PLU.TMP.autoPerform_skills);
        }, 1000)
        return
      }
      return;
    },
    inBattle() {
      return PLU.inBattleView || PLU.inBattleFight;
    },
    dispatchMsg(msg) {
      return msg.replace(/\[[0-9;]*[mG]/g, "");
    },
    dispatchChineseMsg(msg) {
      return msg.replace(/[^\u4e00-\u9fa5\s]/g, "");
    },
    //================================================================================================
    initVersion() {
      this.nickName = g_obj_map.get("msg_attrs").get("name");
      if (g_obj_map.get("msg_attrs").get("title").includes("入室")) {
        this.familyData = PLU.YFD.masterList.slice(0, 32).find(function (e) {
           return e["in"] == g_obj_map.get("msg_attrs").get("family_name");
        });
      } else {
        this.familyData = {w: _("无", "無"), in: g_obj_map.get("msg_attrs").get("family_name")}
      }
      var mvp = ""
      if (UTIL.checkMVP()) var mvp = _("(专属功能已开启)", "(專屬功能已開啟)");
      this.userAreaName = "[" + String(PLU.areaId) + _("区]", "區]");
      this.FLYUP = false;
      if (g_obj_map.get("msg_attrs").get("lxzl") !== "0" && g_obj_map.get("msg_attrs").get("zfxp") !== "0") this.FLYUP = true;
      YFUI.writeToOut(
        `<span style='color:yellow;'>
        +===========================+
        ${_("脚本名称: 无剑Mud辅助", "腳本名稱：無劍Mud輔助")}
        ${_("脚本开发", "腳本開發")}：燕飞,東方鳴,懒人,九
        ${_("脚本版本：", "腳本版本：")}v.${this.version} (${this.patch})
        ${_("当前角色：", "當前角色：")}${this.nickName}${this.userAreaName}${mvp}
        ${_("门派|流派: ", "門派|流派: ")}${this.familyData.in}|${this.familyData.w}
        角 色 ID ：${this.accId}
        +===========================+</span>`,
      );
      var last_update = PLU.getCache("last_update") || "";
      if (last_update !== PLU.version) {
        PLU.setCache("last_update", PLU.version);
        YFUI.showPop({
          title: "公告" + PLU.version,
          text: _(`尊敬的各位玩家：<br>
									我们向您宣布一个重要的消息。<br>
                  为了优化脚本使用，我们准备进行完最后一次更新后，停止后续更新计划<br>
									并准备专心编写新的脚本<br>
                  我们理解这对于依赖脚本的玩家来说可能是一个挑战和失望。<br>
                  我们感谢您一直以来对我们脚本的支持与信任。<br>
                  再次感谢您的理解与支持。<br>
                  `,
                  `尊敬的各位玩家：<br>
									我們向您宣佈一個重要的消息。<br>
                  為了優化腳本使用，我們準備進行完最後一次更新後，停止後續更新計畫<br>
									並準備專心編寫新的腳本<br>
                  我們理解這對於依賴腳本的玩家來說可能是一個挑戰和失望。<br>
                  我們感謝您一直以來對我們腳本的支持與信任。<br>
                  再次感謝您的理解與支持。<br>
									`),
          okText: _("确定", "確定"),
          onOk() { }
        });
      }
      var playerName = this.removeColorCode(this.nickName); //窗口標題
      document.title = playerName;
      YFUI.writeToOut("<span style='color:#FFF;'>" + _("监听设定", "監聽設定") + ":</span>");
      let autosets = "";
      if (PLU.getCache("autoDZ") == 1) autosets += _("连续打坐，", "連續打坐, ");
      if (PLU.getCache("autoHYC") == 1) autosets += _("连续睡床，", "連續睡床, ");
      if (PLU.getCache("auto9H") == 1) autosets += _("持续九花，", "持續九花,");
      if (PLU.getCache("autoAFK") == 1) autosets += _("持续挂机，", "持續掛機, ");
      if (PLU.getCache("autoLX") == 1) autosets += _("连续练习，", "連續練習, ");
      if (PLU.getCache("autoBF") == 1) autosets += _("加入帮四，", "加入幫四, ");
      if (PLU.getCache("autoB6") == 1) autosets += _("加入帮六，", "加入幫六, ");
      if (PLU.getCache("autoB5F") == 1) autosets += _("帮五跟杀，", "幫五跟殺, ");
      if (PLU.getCache("autoAccept") == 1) autosets += _("自动批准，", "自動批准, ");
      if (PLU.getCache("listenPuzzle") == 1) autosets += _("暴击谜题，", "暴擊謎題, ");
      YFUI.writeToOut("<span style='color:#CFF;'>" + autosets + "</span>");
      if (PLU.getCache("autoTP") == 1) {
        YFUI.writeToOut("<span style='color:#CFF;'>" + _("自动突破", "自動突破") + ": <span style='color:#FF9;'>" + PLU.getCache("autoTP_keys") + "</span></span>");
      }
      if (PLU.getCache("listenQL") == 1) {
        YFUI.writeToOut("<span style='color:#CFF;'>" + _("自动青龙", "自動青龍") + ": <span style='color:#FF9;'>" + PLU.getCache("listenQL_keys") + "</span></span>");
      }
      if (PLU.getCache("listenKFQL") == 1) {
        YFUI.writeToOut("<span style='color:#CFF;'>" + _("广场青龙", "廣場青龍") + ": <span style='color:#FF9;'>" + PLU.getCache("listenKFQL_keys") + "</span></span>");
      }
      if (PLU.getCache("listenTF") == 1) {
        YFUI.writeToOut("<span style='color:#CFF;'>" + _("自动逃犯", "自動逃犯") + ": <span style='color:#FF9;'>" + PLU.getCache("listenTF_keys") + "</span></span>");
      }
      if (!g_gmain.is_fighting) {
        PLU.getSkillsList((allSkills, tupoSkills) => {
          if (tupoSkills.length > 0) {
            YFUI.writeToOut("<span style='color:white;'>突破中技能:</span>");
            let topos = "";
            tupoSkills.forEach((sk, i) => {
              topos += "<span style='color:#CCF;min-width:100px;display:inline-block;'>" + (i + 1) + " : " + sk.name + "</span>";
            });
            YFUI.writeToOut("<span style='color:#CCF;'> " + topos + "</span>");
            YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
          } else {
            YFUI.writeToOut("<span style='color:white;'>突破中技能: " + _("无", "無") + "</span>");
            YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
          }
          let lxSkill = g_obj_map.get("msg_attrs")?.get("practice_skill") || 0;
          if (lxSkill) {
            let sk = allSkills.find((s) => s.key == lxSkill);
            if (sk) {
              YFUI.writeToOut(
                "<span style='color:white;'>" + _("练习中的技能", "練習中技能") + ": <span style='color:#F0F;'>" + sk.name + "</span> (" + sk.level + ")</span>",
              );
              YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
            }
          } else {
            YFUI.writeToOut("<span style='color:white;'>" + _("练习中的技能：无", "練習中技能：無") + "</span>");
            YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
          }
        });
      }
    },
    removeColorCode(name) {
      //去除角色名的彩色代碼
      return name.replace(/\[[0-9;]*[mG]/g, "");
    },
    //================================================================================================
    initSocketMsgEvent() {
      if (!gSocketMsg) {
        console.log("%c%s", "background:#C33;color:#FFF;", " ERROR:Not found gSocketMsg!! ");
        return;
      }
      var miGongNavi = new MiGongNavi();
      window.oldgSocketMsg2 = gSocketMsg2;
      gSocketMsg2.old_show_room = gSocketMsg2.show_room;
      gSocketMsg2.show_room = function () {
        gSocketMsg2.old_show_room();
        miGongNavi.Clear();
        switch (g_obj_map.get("msg_room").get("map_id")) {
          case "mojiajiguancheng":
            if (g_obj_map.get("msg_room").get("short") == _("墨攻御阵", "墨攻禦陣") && g_obj_map.get("msg_room").get("south") == _("云海山谷", "雲海山谷")) {
              miGongNavi.Append(_("机关城", "機關城"), "w;n;e;e;nw;w;ne;se;n;nw");
            }
            if (g_obj_map.get("msg_room").get("short") == _("变化道", "變化道") && g_obj_map.get("msg_room").get("west") == _("神龙山", "神龍山")) {
              miGongNavi.Append("石板大道", "n;e;s;e;n;nw;e;nw");
              miGongNavi.Append(_("盘龙湖", "盤龍湖"), "s;e;s;ne;s;sw;nw;s;se;s");
            }
            if (g_obj_map.get("msg_room").get("short") == _("变化道", "變化道") && g_obj_map.get("msg_room").get("northwest") == "石板大道") {
              miGongNavi.Append(_("神龙山", "神龍山"), "e;se;s;w");
            }
            if (g_obj_map.get("msg_room").get("short") == _("变化道", "變化道") && g_obj_map.get("msg_room").get("south") == _("盘龙湖", "盤龍湖")) {
              miGongNavi.Append(_("神龙山", "神龍山"), "nw;w;ne;n;w");
            }
            break;
          case "miaojiang":
            if (g_obj_map.get("msg_room").get("obj_p") == "4583") {
              miGongNavi.Append(_("江边小路", "江邊小路"), "sw;e;e;sw;se;sw");
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "4540") {
              miGongNavi.Append(_("噬生沼泽", "噬生沼澤"), "s;s;e;n;n;e");
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "4600") {
              miGongNavi.Append("上山小路", "s;e;ne;s;sw;e;e;ne");
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "4568") {
              miGongNavi.Append(_("澜沧江南岸", "瀾滄江南岸"), "event_1_41385370;e;ne;nw;e;sw;se;s;ne;e;e;n;nw");
            }
            break;
          case "xiakedao":
            if (g_obj_map.get("msg_room").get("obj_p") == "4018") {
              miGongNavi.Append("平原平地", "e;s;s;s");
              miGongNavi.Append(_("养心居", "養心居"), "e;e;e;e");
              miGongNavi.Append("石壁", "e;s;n;e;s");
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "3987") {
              miGongNavi.Append("土路", "n;w;w;w;s;w");
              miGongNavi.Append(_("养心居", "養心居"), "n;n;e;e");
              miGongNavi.Append("石壁", "n;w;n;e;s");
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "4028") {
              miGongNavi.Append("平原平地", "w;s;s;s;s");
              miGongNavi.Append("土路", "w;w;w;w;s;w");
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "3998") {
              miGongNavi.Append("平原平地", "n;e;s;s");
              miGongNavi.Append("土路", "n;w;w;s;w");
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "3994") {
              miGongNavi.Append("山頂", "n;n;n;e;ne;nw");
              miGongNavi.Append("摩天崖", "n;e;e;ne");
              miGongNavi.Append("木屋", "n;n;n;w;w");
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "3992") {
              miGongNavi.Append(_("后山山路", "後山山路"), "se;s;s;s");
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "3980") {
              miGongNavi.Append(_("后山山路", "後山山路"), "sw;s;s;s");
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "3982") {
              miGongNavi.Append(_("后山山路", "後山山路"), "e;s;s;s");
            }
            break;
          case "binghuo":
            if (g_obj_map.get("msg_room").get("obj_p") == "3931") {
              miGongNavi.Append("彩虹瀑布", "nw;s;s;s;s;s;s;e");
              miGongNavi.Append(_("雪松林海深处", "雪松林海深處"), "nw;s;s;s;s;s;s;w;w;n;e;n;w;w;s");
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "3881") {
              miGongNavi.Append(_("雪松林海深处", "雪松林海深處"), "w;w;w;n;e;n;w;w;s");
              miGongNavi.Append(_("雪原温泉", "雪原溫泉"), "w;n;e;e;n;se");
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "3930") {
              miGongNavi.Append("彩虹瀑布", "n;n;s;s;s;s;e");
              miGongNavi.Append(_("雪原温泉", "雪原溫泉"), "n;n;s;s;s;s;n;e;e;n;se");
            }
            break;
          case "wudang":
            if (g_obj_map.get("msg_room").get("short") == "山谷通道" && g_obj_map.get("msg_room").get("south") == "山谷口") {
              miGongNavi.Append(_("环山之地", "環山之地"), "sw;nw;w;ne");
            }
            break;
          case "baituo":
            if (g_obj_map.get("msg_room").get("short") == "密林" && g_obj_map.get("msg_room").get("north") == _("山庄大门", "山莊大門")) {
              miGongNavi.Append("正堂", "sw;s;ne;e;s;s");
            }
            if (g_obj_map.get("msg_room").get("short") == "戈壁" && g_obj_map.get("msg_room").get("north") == "戈壁") {
              miGongNavi.Append("天山", "jh 39");
            }
            break;
          case "tianshan":
            if (g_obj_map.get("msg_room").get("short") == "官道" && g_obj_map.get("msg_room").get("northeast") == "官道") {
              miGongNavi.Append(_("星星峡", "星星峽"), "ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939");
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "4448") {
              miGongNavi.Append(_("大漠深处", "大漠深處"), "s;s;sw;n;nw;e;sw");
            }
            if (g_obj_map.get("msg_room").get("short") == "雪谷" && g_obj_map.get("msg_room").get("southeast") == "雪谷") {
              miGongNavi.Append(_("失足岩", "失足巖"), "se;s;e;n;ne;nw;event_1_58460791");
              miGongNavi.Append(_("星星峡", "星星峽"), "se;s;e;n;ne;nw;ne;nw;event_1_17801939");
            }
            break;
          case "luoyang":
            if (g_obj_map.get("msg_room").get("obj_p") == "112") {
              miGongNavi.Append(_("五鼠广场", "五鼠廣場"), "n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n");
              miGongNavi.Append(_("矿场入口", "礦場入口"), "#10 n;#4 w;");
            }
            if (g_obj_map.get("msg_room").get("short") == _("晶源矿洞一层", "晶源礦洞一層")) {
              miGongNavi.Before(_("高级挖矿", "高級挖礦"), "eval_PLU.digOre2();", true);
              miGongNavi.Before(_("普通挖矿", "普通挖礦"), "eval_PLU.digOre1();");
              miGongNavi.Append(_("矿洞隐秘", "礦洞隱秘"), "items use obj_jykdym;kill luoyang_jykg;");
            }
            if (g_obj_map.get("msg_room").get("short") == _("晶源矿洞二层", "晶源礦洞二層")) {
              miGongNavi.Before(_("挖晶源矿", "挖晶源礦"), "eval_PLU.digOre3();", true);
            }
            break;
          case "huashancunzhizhan":
            if (g_obj_map.get("msg_room").get("short") == _("华山村基地", "華山村基地")) {
              miGongNavi.Append(_("自动跨四", "自動跨四"), "eval_PLU.KuaFu4()");
              miGongNavi.Append("升破厄印", "eval_PLU.upKF4w()");
              miGongNavi.Append("往上打", "eval_PLU.cK4D()");
            }
            if (g_obj_map.get("msg_room").get("short") == _("晶源秘境一层", "晶源秘境一層")) {
              miGongNavi.Append(_("矿石数量", "礦石數量"), "eval_PLU.checkOre()");
              miGongNavi.Append(_("杀怪", "殺怪"), "eval_PLU.cK4A()");
            }
            if (g_obj_map.get("msg_room").get("short") == _("晶源秘境二层", "晶源秘境二層")) {
              miGongNavi.Append(_("矿石数量", "礦石數量"), "eval_PLU.checkOre()");
              miGongNavi.Append(_("杀怪", "殺怪"), "eval_PLU.cK4B()");
            }
            if (g_obj_map.get("msg_room").get("short") == _("晶源秘境三层", "晶源秘境三層")) {
              miGongNavi.Append(_("矿石数量", "礦石數量"), "eval_PLU.checkOre()");
              miGongNavi.Append(_("杀怪", "殺怪"), "eval_PLU.cK4C()");
            }
            break;
          case "qiaoyin":
            if (g_obj_map.get("msg_room").get("short") == _("落脚点", "落腳點")) {
              miGongNavi.Append(_("自动跨五", "自動跨五"), "eval_PLU.KuaFu5()");
            }
            if (g_obj_map.get("msg_room").get("short") == _("乔阴矿坑", "喬陰礦坑")) {
              miGongNavi.Append(_("矿石数量", "礦石數量"), "eval_PLU.checkOre()");
              miGongNavi.Append(_("杀怪", "殺怪"), "eval_PLU.cK5B()");
            }
            if (g_obj_map.get("msg_room").get("short") == _("乔阴深处", "喬陰深處")) {
              miGongNavi.Append(_("矿石数量", "礦石數量"), "eval_PLU.checkOre()");
              miGongNavi.Append(_("杀怪", "殺怪"), "eval_PLU.cK5C()");
            }
            break;
          case "kuafu":
            miGongNavi.Append(_("监听散修", "監聽散修"), "eval_PLU.sansan();")
						miGongNavi.Append(_("一键跨四", "一鍵跨四"), "eval_PLU.cK4S()");
						miGongNavi.Append(_("一键跨五", "一鍵跨五"), "eval_PLU.cK5S()");
            break; 
          case "shenshousenlin":
            if (g_obj_map.get("msg_room").get("short") == _("幽荧殿", "幽熒殿")) {
              miGongNavi.Append(_("开始", "開始"), "ak;s;w;w;w;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s;ka;")
            }
            break;
          case "baidicheng":
            if (g_obj_map.get("msg_room").get("short") == _("岸边路", "岸邊路") && g_obj_map.get("msg_room").get("southeast") == _("岸边路", "岸邊路")) {
              miGongNavi.Append(_("璇玑宫", "璇璣宮"), "se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;event_1_91914705");
            }
            break;
          case "haiyunge":
            if (g_obj_map.get("msg_room").get("short") == _("海运镇", "海運鎮") && g_obj_map.get("msg_room").get("north") == _("海运镇", "海運鎮")) {
              miGongNavi.Append(_("雪山山脚", "雪山山腳"), "n;n;n;n;w;n;nw;n;n;ne;n;n;e;n;n;n;n;e;n;n;n;n;n;w;w;n;n;n;n;n;n;e;e;e;e;e;e;s;e;e;ne;ne;e;se;se;se");
            }
            break;
          case "snow":
            if (g_obj_map.get("msg_room").get("obj_p") == "18") {
              miGongNavi.Before(_('抽奖', '抽獎'), "eval_PLU.toChoujiang();", true);
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "47") {
              miGongNavi.Append(_("兑换刻刀", "兌換刻刀"), "event_1_58404606");
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "4") {
              miGongNavi.Before(_("秘境监听", "秘境監聽"), "eval_PLU.autoMijing();", true);
            }
            if (g_obj_map.get("msg_room").get("obj_p") == "49") {
              miGongNavi.Append(_("西海之渊", "西海之淵"), "items use obj_xhzycsf;");
            }
            break;
          case "changbaishan":
            if (g_obj_map.get("msg_room").get("short") == "天池") {
              miGongNavi.Append(_("血魂破阵", "血魂破陣"), "items use obj_xhlhpzf;kill changbaishan_cbs_dxt;event_1_49503190;");
            }
						if (g_obj_map.get("msg_room").get("short") == _("圣湖", "聖湖")) {
              miGongNavi.Append(_("自动枫林", "自動楓林"), "eval_PLU.go_orion()");
            }
            break;
          case "nanzhaoguo":
            if (g_obj_map.get("msg_room").get("short") == _("忘忧酒馆", "忘憂酒館")) {
              miGongNavi.Append(_("南诏医馆", "南詔醫館"), "n;#7 w;s;");
              miGongNavi.Append(_("元帅府", "元帥府"), "n;#5 w;#8 s;w;n;");
              miGongNavi.Append(_("容宝斋", "容寶齋"), "n;#5 w;#10 s;w;w;n;");
              miGongNavi.Append(_("兽苑", "獸苑"), "n;#5 e;#8 n;w;w;n;n;");
            }
            break;
          case "tangmen":
            if (g_obj_map.get("msg_room").get("obj_p") == "1372") {
              miGongNavi.Append(_("七杀剑阁", "七殺劍閣"), "sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;");
            }
            if (g_obj_map.get("msg_room").get("short") == _("七杀剑阁", "七殺劍閣")) {
              miGongNavi.Append("製作九花", "eval_PLU.nineflower()");
            }
            break;
          case "murong":
            if (g_obj_map.get("msg_room").get("obj_p") == "3197") {
              miGongNavi.Append(_("孔府大门", "孔府大門"), "n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e")
            }
            break;
          case "huajie":
            if (g_obj_map.get("msg_room").get("short") == _("藏娇阁", "藏嬌閣")) {
              miGongNavi.Append(_("观舞", "觀舞"), "event_1_5392021 go")
            }
            if (g_obj_map.get("msg_room").get("short") == _("沁芳阁", "沁芳閣")) {
              miGongNavi.Append(_("观舞", "觀舞"), "event_1_48561012 go")
            }
            if (g_obj_map.get("msg_room").get("short") == _("凝香阁", "凝香閣")) {
              miGongNavi.Append(_("观舞", "觀舞"), "event_1_29896809 go")
            }
            break;
          case "ymsz_qianyuan":
            if (g_obj_map.get("msg_room").get("short") == _("幽冥山庄前院", "幽冥山莊前院")) {
              miGongNavi.Append(_("开始", "開始"), "ak;e;e;n;s;s;n;e;e;ne;sw;#3 s;e;ka;")
            }
            break;
          case "ymsz_huayuan":
            if (g_obj_map.get("msg_room").get("short") == _("幽冥山庄花园", "幽冥山莊花園")) {
              miGongNavi.Append(_("开始", "開始"), "ak;e;e;ne;nw;se;ne;ne;sw;se;se;e;w;sw;sw;se;nw;sw;sw;ka;")
            }
            break;
          case "ymsz_houyuan":
            if (g_obj_map.get("msg_room").get("short") == _("幽冥山庄后院", "幽冥山莊後院")) {
              miGongNavi.Append(_("开始", "開始"), "ak;se;se;s;w;e;e;w;#3 s;w;e;e;s;n;e;e;n;s;e;e;n;ka;")
            }
            break;
          case "bajieshendian":
            if (g_obj_map.get("msg_room").get("short") == "初心之地") {
              miGongNavi.Append(_("开始", "開始"), "ak;n;s;ne;sw;e;w;se;nw;s;n;sw;ne;w;e;nw;nw;se;se;n;n;s;s;ne;ne;sw;sw;e;e;w;w;se;se;nw;nw;s;s;n;n;sw;sw;ne;ne;w;w;=2000;ka;=200;event_1_68529291;")
            }
            break;;
          case "taohua":
            if (g_obj_map.get("msg_room").get("obj_p") == "3073") {
              miGongNavi.Append(_("巨石阵", "巨石陣"), "event_1_84563112;s;sw;s;w;n;nw;w;sw;nw;n")
            }
            break;
          };
          // 地圖對齊
          if (g_obj_map.get("msg_room").get("type") == "jh" && g_obj_map.get("msg_room").get("subtype") == "info") {
            $("#out .out table:eq(1)").closest("table").attr("id", "centertr");
            let textAndColors = [];
            let combinedText = '  ';
            var spantext = $("#centertr").prevUntil("hr")
            if (spantext.length > 1) {
              spantext.each((index, element) =>  {
                const sText = $(element).text();
                const sColor = $(element).css('color');
                textAndColors.push({text: sText, color: sColor});
                combinedText += `<span style="color: ${sColor}">${sText}</span>`;
                $(element).remove();
              });
              $("#out .out").html($("#out .out").html().replace("&nbsp;&nbsp;&nbsp;", ""));
            } else if (spantext.length == 1) {
              spantext.first().remove();
              $("#out .out").html($("#out .out").html().replace("&nbsp;&nbsp;&nbsp;" + g_obj_map.get("msg_room").get("long"), ""));
              combinedText = "&nbsp;&nbsp;&nbsp" + g_obj_map.get("msg_room").get("long");
            }
            const $newDiv = $('<div>').html(combinedText).css({
              'overflow-y': 'scroll',
              'overflow-x': 'hidden',
              'height': '80px',
            });

            if (spantext.length != 0) {
              $('#centertr').before($newDiv);
              var centertr = $("#out .out table:eq(1) td:has(.cmd_click_room)").parent("tr");
              if (centertr.prev().length == 0) {
                centertr.before("<tr><td></td><td></td><td></td></tr>")
              }
              if (centertr.next().length == 0) {
                centertr.after("<tr><td></td><td></td><td></td></tr>")
              }
              $("#out .out table:eq(1) td").css({
                "width": $(".cmd_click_room").width(),
                "height": $(".cmd_click_room").height()
              })
              return;
            }
          }
        };
      gSocketMsg2.old_show_items = gSocketMsg2.show_items;
      gSocketMsg2.show_items = function (b) {
        gSocketMsg2.old_show_items(b);
        $(".out table:eq(1) tbody:eq(0) td:eq(0)").css("vertical-align", "top");
        var cangkuclone = $(".out table:eq(1) table:eq(1) tr[onclick]").clone();
        cangkuclone = cangkuclone.sort(function (a, b) {
          return ansi_up.ansi_to_text($(a).text()) > ansi_up.ansi_to_text($(b).text()) ? 1 : -1
        });
        $(".out table:eq(1) table:eq(1) tr[onclick]").remove();
        $(".out table:eq(1) table:eq(1)").prepend(cangkuclone);

        // var baoclone = $(".out table:eq(1) table:eq(0) tr[onclick]").clone();
        // baoclone = baoclone.sort(function (a, b) {
        //     return ansi_up.ansi_to_text($(a).text()) > ansi_up.ansi_to_text($(b).text()) ? 1 : -1
        // });
        // $(".out table:eq(1) table:eq(0) tr[onclick]").remove();
        // $(".out table:eq(1) table:eq(0)").prepend(baoclone);

        if ($("#items-div #items-zhengli1").length == 0) {
          $("#out .out table:first").after("<div id='items-div'><button id='items-zhengli1' class='cmd_click3'><span class='out2'>整理背包</span></button><button id='items_search' class='cmd_click3'><span class='out2'>" + _("物品搜寻", "物品搜尋") + "</span></button><button id='fast_items' class='cmd_click3'><span class='out2'>快捷操作</span></button><button id='fastc_item' class='cmd_click3'><span class='out2'>快捷道具</span></button></div>");
          $("#items-div #items-zhengli1").off("click").on("click",
            function () {
              // 入庫
              let iId = 1,
                storeList = [],
                put_itemList = [],
                sell_itemList = [],
                split_itemList = [];
               // 出售
              let sell_val = PLU.getCache("sellItemNames") ||
              _("破烂衣服,水草,木盾,铁盾,藤甲盾,青铜盾,鞶革,军袍,麻带,破披风,长斗篷,牛皮带,锦缎腰带,丝质披风,匕首,铁甲,重甲,精铁甲,逆钩匕,银丝甲,梅花匕,软甲衣,羊角匕,金刚杖,白蟒鞭,天寒项链,天寒手镯,新月棍,天寒戒,天寒帽,天寒鞋,金弹子,拜月掌套,疯魔杖,星河剑,金狮盾,白玉腰束,天寒匕,无心匕,生死符,血屠刀,貂皮斗篷,红色长衫,船篙,全真道袍,钢杖,草帽,铁戒,斩空刀,竹剑,布衣,单刀,铁项链,桃符纸,绣花针,锦衣,水烟阁司事帽,阿拉伯弯刀,桃木剑,铁手镯,长剑,丝绸衣,长斗篷",
              "破爛衣服,水草,木盾,鐵盾,藤甲盾,青銅盾,鞶革,軍袍,麻帶,破披風,長斗篷,牛皮帶,錦緞腰帶,絲質披風,匕首,鐵甲,重甲,精鐵甲,逆鉤匕,銀絲甲,梅花匕,軟甲衣,羊角匕,金剛杖,白蟒鞭,天寒項鏈,天寒手鐲,新月棍,天寒戒,天寒帽,天寒鞋,金彈子,拜月掌套,瘋魔杖,星河劍,金獅盾,白玉腰束,天寒匕,無心匕,生死符,血屠刀,貂皮鬥篷,紅色長衫,船篙,全真道袍,鋼杖,草帽,鐵戒,斬空刀,竹劍,布衣,單刀,鐵項鏈,桃符紙,繡花針,錦衣,水煙閣司事帽,阿拉伯彎刀,桃木劍,鐵手鐲,長劍,絲綢衣,長鬥篷");
              let sell_str = $.trim(sell_val);
              let sell_keysList = sell_str.split(",");
              // 分解
              let split_val = PLU.getCache("splitItemNames") ||
              _("玄武盾,破军盾,金丝宝甲衣,夜行披风,羊毛斗篷,残雪戒,残雪项链,残雪手镯,残雪鞋,金丝甲,宝玉甲,月光宝甲,虎皮腰带,沧海护腰,红光匕,毒龙鞭,玉清棍,霹雳掌套", "玄武盾,破軍盾,金絲寶甲衣,夜行披風,羊毛斗篷,殘雪戒,殘雪項鏈,殘雪手鐲,殘雪鞋,金絲甲,寶玉甲,月光寶甲,虎皮腰帶,滄海護腰,紅光匕,毒龍鞭,玉清棍,霹靂掌套");
              let split_str = $.trim(split_val);
              let split_keysList = split_str.split(",");
              let itemsTimeOut = setTimeout(() => {
                UTIL.delSysListener("listItems");
              }, 5000);
              UTIL.addSysListener("listItems", function (b, type, subtype, msg) {
                if (type != "items") return;
                UTIL.delSysListener("listItems");
                clearTimeout(itemsTimeOut);
                while (b.get("stores" + iId)) {
                  let it = UTIL.filterMsg(b.get("stores" + iId)).split(",");
                  if (it && it.length > 3) {
                    let s = it[0].split('/').pop();
                    storeList.push(it[1]);
                  }
                  iId++;
                }
                iId = 1;
                while (b.get("items" + iId)) {
                  let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
                  if (it && it.length > 4 && it[3] == "0" && storeList.includes(it[1])) {
                    put_itemList.push({
                      key: it[0],
                      name: it[1],
                      num: Number(it[2]),
                    });
                  } else if (it && it.length > 4 && it[3] == "0" && sell_keysList.includes(it[1])) {
                    sell_itemList.push({
                      key: it[0],
                      name: it[1],
                      num: Number(it[2]),
                    });
                  } else if (it && it.length > 4 && it[3] == "0" && split_keysList.includes(it[1])) {
                    split_itemList.push({
                      key: it[0],
                      name: it[1],
                      num: Number(it[2]),
                    });
                  }
                  iId++;
                }
                PLU.loopSortItems(put_itemList, sell_itemList, split_itemList);
              });
            clickButton("items", 0);
            });
          $("#items-div #fast_items").off("click").on("click",
            function () {
              var htm = "<div>";
              var itemList = [
                { name: _("取一级玉石", "取一級玉石"), key: "items get_store /obj/yushi/dixisui1;items get_store /obj/yushi/donghaibi1;items get_store /obj/yushi/jiutianluo1;items get_store /obj/yushi/juzimo1;items get_store /obj/yushi/kunlunyin1;items get_store /obj/yushi/longtingpo1;items get_store /obj/yushi/xuanyuanlie1;" },
                { name: _("取天神宝石", "取天神寶石"), key: "items get_store /obj/baoshi/lvbaoshi8;items get_store /obj/baoshi/hongbaoshi8;items get_store /obj/baoshi/lanbaoshi8;items get_store /obj/baoshi/huangbaoshi8;items get_store /obj/baoshi/zishuijing8;" },
                { name: _("使用保险卡", "使用保險卡"), key: "eval_PLU.ddcard()" },
                { name: "批量吃荔枝", key: "eval_PLU.eatlizhi()" },
              ];
              itemList.forEach(function (t, ti) {
                if (ti % 4 == 0) htm += "<div>";
                htm += '<button onclick="PLU.execActions(&quot;' + t.key + '&quot;)" style="width:23%;margin:2px 1%;padding:3px;">' + t.name + "</button>";
                if (ti % 4 == 3) htm += "</div>";
              });
              htm += '</div>';
              YFUI.showPop({
                title: "快捷操作",
                text: htm,
                width: "382px",
                okText: _("关闭", "關閉"),
                onOk() { }
              })
            });
          $("#items-div #items_search").off("click").on("click",
            function () {
                PLU.item_search();
            });
          $("#items-div #fastc_item").off("click").on("click",
            function () {
              PLU.itemc_page(1);
            });
          $("#items-div #wine_make1").off("click").on("click",
            function () {
              PLU.execActions("event_1_20635853");
            });
          $("#items-div #wine_make2").off("click").on("click",
            function () {
              PLU.execActions("event_1_85652966");
            });
          $("#items-div #wine_make3").off("click").on("click",
            function () {
              PLU.execActions("event_1_62174415");
            });
          $("#items-div #items-huangjin").off("click").on("click",
            function () {
              PLU.openXiang(_("黄金宝箱", "黃金寶箱"), _("黄金钥匙", "黃金鑰匙"));
            });
          $("#items-div #items-bojin").off("click").on("click",
            function () {
              PLU.openXiang(_("铂金宝箱", "鉑金寶箱"), _("铂金钥匙", "鉑金鑰匙"));
            });
          $("#items-div #items-yaoyu").off("click").on("click",
            function () {
              PLU.openXiang(_("曜玉宝箱", "曜玉寶箱"), _("曜玉钥匙", "曜玉鑰匙"));
            });
          $("#items-div #items-chili").off("click").on("click",
            function () {
              PLU.openXiang(_("赤璃宝箱", "赤璃寶箱"), _("赤璃钥匙", "赤璃鑰匙"));
            });
          }
      };
      gSocketMsg2.old_show_item_info = gSocketMsg2.show_item_info;
      gSocketMsg2.show_item_info = function () {
        gSocketMsg2.old_show_item_info();
        var item = g_obj_map.get("msg_item");
        var foundsplit = false;
        var founduse = false;
        var foundhecheng = false;
        var foundhechengys = false;
        var foundsellall = false;
        var foundmoke = false;
        if (item) {
          for (var i = 1; i <= item.size(); i++) {
            if (item.containsKey("cmd" + i) && item.get("cmd" + i).indexOf("client_prompt items splite") == 0) {
                foundsplit = true;
                continue
            }
            if (item.containsKey("cmd" + i) && item.get("cmd" + i).indexOf("items use") == 0 && !item.containsValue("use_all")) {
                founduse = true;
                continue
            }
            if (item.containsKey("cmd" + i) && item.get("cmd" + i).indexOf("moke ") >= 0) {
                foundmoke = true;
                continue
            }
          }
          if (foundmoke) {
            if ($("#out .out table:last tr:last td").length == 4) {
              $("#out .out table:last").append('<tr algin="center"></tr>')
            }
            $("#out .out table:last tr:last").append('<td align="center"><button id="foundmoke" type="button" class="cmd_click2">全部<br>摩刻</button></td>')
          }
          if (foundsplit) {
            if ($("#out .out table:last tr:last td").length == 4) {
              $("#out .out table:last").append('<tr algin="center"></tr>')
            }
            $("#out .out table:last tr:last").append('<td align="center"><button id="foundsplit" type="button" class="cmd_click2">全部<br>分解</button></td>')
          }
          if (founduse) {
            if ($("#out .out table:last tr:last td").length == 4) {
              $("#out .out table:last").append('<tr algin="center"></tr>')
            }
            $("#out .out table:last tr:last").append('<td align="center"><button id="founduse" type="button" class="cmd_click2">全部<br>使用</button></td>')
          }
          $("#foundmoke").off("click").on("click",
            function () {
              let id = item.get("id");
              let amount = item.get("amount");
              PLU.execActions("#" + amount + ' ' + "moke " + id + ";");
            });
          $("#foundsplit").off("click").on("click",
            function () {
              let id = item.get("id");
              let amount = item.get("amount");
              let cmds = "";
              if (amount > 100) {
                var useTimes = amount / 100;
                var useLeast = amount % 100;
                useTimes = parseInt(useTimes);
                for (var i = 0; i < useTimes; i++) {
                  cmds += ('items splite ' + id + '_N_100;');
                }
                if (useLeast > 0) {
                  cmds += ('items splite ' + id + '_N_' + useLeast + ";");
                }
              } else {
                cmds += ('items splite ' + id + '_N_' + amount + ";");
              }
              PLU.execActions(cmds);
            });
          $("#founduse").off("click").on("click",
            function () {
              let id = item.get("id");
              let amount = item.get("amount");
              let useLeast = amount % 1000;
              PLU.execActions('items use ' + id + '_N_' + amount);
              let listenItemNoticeTimeOut = setTimeout(() => {
                UTIL.delSysListener("listenItemNotice");
              }, 5000);
              UTIL.addSysListener("listenItemNotice", function (b, type, subtype, msg) {
                if (type != "notice") return;
                let msgTxt = UTIL.filterMsg(msg);
                UTIL.delSysListener("listenItemNotice");
                clearTimeout(listenItemNoticeTimeOut);
                if (msgTxt.match("不能一次使用多")) {
                  PLU.fastExec("#" + String(amount) + " items use " + id + ";Log?使用完成", function () {
                  });
                } else {
                  if (amount > 1000) {
                    let useTimes = amount / 1000;
                    useTimes = parseInt(useTimes);
                    if (useTimes > 0) {
                      PLU.fastExec("#" + useTimes + " items use " + id + "_N_1000;");
                    };
                  }
                }
              });
              clickButton("items", 0);
            });
         }
      }
      gSocketMsg2.old_show_skill_info = gSocketMsg2.show_skill_info;
      gSocketMsg2.show_skill_info = function () {
        gSocketMsg2.old_show_skill_info();
        var item = g_obj_map.get("msg_skill");
        var foundlearn = false;
        var foundchuaimo = false;
        var foundtupo = false;
        if (item) {
          for (var i = 1; i <= item.size(); i++) {
            if (item.containsKey("cmd" + i) && item.get("cmd" + i).indexOf("tupo") == 0) {
              foundtupo = true;
              continue
            }
          }
          if (foundtupo) {
            if ($("#out .out table:last tr:last td").length == 4) {
              $("#out .out table:last").append('<tr algin="center"></tr>')
            }
            if (item.get('tupo_p')) {
              var tpp = 0;
            } else {
              var tpp = item.get('tupo_p');
            }
            var count = Math.ceil((item.get('tupo_max_p') - tpp) / 5)
            $("#out .out table:last tr:last").append('<td align="center"><button type="button" onclick="PLU.tupoSkill(\'' + item.get("id") + ',' + count + '\')" class="cmd_click2">' + _('一键', '一鍵') + '<br>突破</button></td>')
          }
        };
      };
      gSocketMsg.YFBackupDispatchMsg = gSocketMsg.dispatchMessage;
      gSocketMsg.dispatchMessage = (b) => {
        gSocketMsg.YFBackupDispatchMsg(b);
        let type = b.get("type");
        let subtype = b.get("subtype");
        let msg = b.get("msg");
        UTIL.sysDispatchMsg(b, type, subtype, msg);
      };
      gSocketMsg.change_skill_button = function (m, is_del) {
        var m_vs_info = g_obj_map.get("msg_vs_info"),
          m2 = g_obj_map.get("msg_attrs");
        if (!m_vs_info || !m2) return 0;
        if (is_del) {
          g_obj_map.remove("skill_button" + is_del);
          return 1;
        }
        var id = this.get_combat_user_id();
        if (id != m.get("uid")) return 0;
        var pos = parseInt(m.get("pos"));
        if (pos <= 0 || pos > this._skill_btn_cnt) return 0;
        g_obj_map.put("skill_button" + pos, m);
        this.refresh_skill_button();
      };
      PLU.initListeners();
      if (unsafeWindow.clickButton) {
        PLU.Base64 = new Base64();
        var proxy_clickButton = unsafeWindow.clickButton;
        unsafeWindow.clickButton = function () {
          let args = arguments;
          if (PLU.developerMode) {
            console.log(args);
          }
          // 指令录制
          if (
            PLU.TMP.cmds &&
            !g_gmain.is_fighting &&
            ["attrs", "none", "jh", "fb", "prev_combat", "home_prompt", "jhselect", "fbselect", "send_chat"].indexOf(args[0]) < 0 &&
            args[0].indexOf("look_npc ") &&
            !args[0].match(/^(jh|fb)go /) &&
            args[0].indexOf("go_chat")
          ) {
            if (
              args[0].indexOf("go southeast.") == 0 ||
              args[0].indexOf("go southwest.") == 0 ||
              args[0].indexOf("go northeast.") == 0 ||
              args[0].indexOf("go northwest.") == 0
            )
              PLU.TMP.cmds.push(args[0][3] + args[0][8]);
            else if (args[0].indexOf("go east.") == 0 || args[0].indexOf("go west.") == 0 || args[0].indexOf("go south.") == 0 || args[0].indexOf("go north.") == 0)
              PLU.TMP.cmds.push(args[0][3]);
            else PLU.TMP.cmds.push(args[0]);
          }
          if (args[0].indexOf("ask ") == 0) {
            UTIL.addSysListener("ask", (b, type, subtype, msg) => {
              if ((type == "jh" && subtype == "info") || UTIL.inHome()) {
                UTIL.delSysListener("ask");
              }
              if (type != "main_msg" || msg.indexOf(_("嗯，相遇即是缘，你是练武奇才，我送点东西给你吧。", "嗯，相遇即是緣，你是練武奇才，我送點東西給你吧。")) == -1) return;
              proxy_clickButton(args[0]);
              UTIL.delSysListener("ask");
            });
            setTimeout(() => {
              UTIL.delSysListener("ask");
            }, 500);
            proxy_clickButton(args[0]);
          }
          // 解除聊天屏蔽，對非腳本玩家可用
          else if (PLU.developerMode && args[0].indexOf("chat ") == 0) {
            let msg = args[0].substring(5);
            for (var PATTERN of KEYWORD_PATTERNS) msg = msg.replace(PATTERN, (s) => Array.from(s).join("\f"));
            proxy_clickButton("chat " + msg);
          }
          // 解除四海商店限制
          else if ((args[0].indexOf("reclaim recl ") == 0 || args[0].indexOf("reclaim buy ") == 0) && !args[0].match(" page ")) {
            var cmd = args[0].match(/^reclaim (recl|buy) (\d+) (go )?(.+)$/);
            if (cmd[1]) {
              var n = Number(cmd[2]);
              switch (cmd[1]) {
                case "recl":
                  for (; n > 50000; n -= 50000) {
                    setTimeout(function() {
                      proxy_clickButton("reclaim recl 50000 go ".concat(cmd[4]), 1);
                    }, 400);
                  }
                  proxy_clickButton("reclaim recl ".concat(n, " go ").concat(cmd[4]), 1);
                  break;
                case "buy":
                  for (; n > 50000; n -= 50000) {
                    setTimeout(function() {
                      proxy_clickButton("reclaim buy 50000 go ".concat(cmd[4]), 1);
                    }, 400);
                  }
                  proxy_clickButton("reclaim buy ".concat(n, " go ").concat(cmd[4]), 1);
                  break;
              }
            }
          } else {
            proxy_clickButton(...args);
          }
          if (PLU.TMP.leaderTeamSync) {
            PLU.commandTeam(args);
          }
        };
      }
    },
    eatlizhi() {
      let xcmd = "";
      PLU.getAllItems(function (list) {
        var item1 = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match("糯米糍荔枝");
        });
        var item2 = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("三月红荔枝", "三月紅荔枝"));
        });
        var item3 = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match("妃子笑荔枝");
        });
        var item4 = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("白糖罂荔枝", "白糖罌荔枝"));
        });
        var item5 = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match("桂味荔枝");
        });
        if (item1) {
          PLU.loopSlowClick(`items use ${item1.key}`, "0", item1.num, _(300, 10), true);
        }
        if (item2) {
          PLU.loopSlowClick(`items use ${item2.key}`, "0", item2.num, _(300, 10), true);
        }
        if (item3) {
          PLU.loopSlowClick(`items use ${item3.key}`, "0", item3.num, _(300, 10), true);
        }
        if (item4) {
          PLU.loopSlowClick(`items use ${item4.key}`, "0", item4.num, _(300, 10), true);
        }
        if (item5) {
          PLU.loopSlowClick(`items use ${item5.key}`, "0", item5.num, _(300, 10), true);
        }
      });
    },
    ddcard() {
      PLU.getAllItems(function (list) {
        var item = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("保险卡", "保險卡"));
        });
        if (item) {
          PLU.setCache("autoClickNum", item.num);
          PLU.loopSlowClick("items use obj_baoxianka", "0", item.num, _(300, 10), true);
        }
      });
    },
    item_search(val) {
      var htm = "<div>";
      if (val) {
        val.forEach(function (t2, ta) {
          if (ta % 2 == 0) htm += "<div>";
          if (!t2.store) htm += '<button onclick="PLU.execActions(&quot;items info ' + t2.key + ';&quot;)" style="color:#00F;width:48%;text-align:left;margin:2px 1%;padding:3px;">' + t2.name + "</button>";
          else htm += '<button onclick="PLU.execActions(&quot;items get_store ' + t2.key + ';items_info?' + t2.name + ';&quot;)" style="color:#F00;width:48%;text-align:left;margin:2px 1%;padding:3px;">' + t2.name + "</button>";
          if (ta % 2 == 1) htm += "</div>";
        });
      }
      YFUI.showInput({
        title: _("物品搜寻", "物品搜尋"),
        text:  _("输入要寻找的物品名称", "輸入要尋找的物品名稱"),
        texta: htm,
        width: "320px",
        onOk(val) {
          if (val == "") return
          let sea = [];
          PLU.getAllItems(function (list) {
            list.forEach(function (t, ti) {
              var items = !!PLU.dispatchChineseMsg(list[ti].name).match(val);
              if (!items) return
              sea.push({ name: list[ti].name.replace(/\s/g, ""), key: list[ti].key , store: list[ti].store});
            });
            PLU.item_search(sea);
          });
        },
        onNo() { }
      })
    },
    itemc_page(idx) {
      var htm = "<div>";
      if (idx) {
        var itemList = [
          { name: _("南瓜蛊", "南瓜蠱"), item: _("南瓜蛊", "南瓜蠱"), key: "tianlongsi_nanguagu", color: "#FA0" },
          { name: "三湘盟主令", item: "三湘盟主令", key: "tianlongsi_sanxiangmenmgzhuling", color: "#FA0" },
          { name: _("茉莉汤", "茉莉湯"), item: _("茉莉汤", "茉莉湯"), key: "obj_molitang", color: "#000" },
          { name: "元宵", item: "元宵", key: "obj_yuanxiao", color: "#000" },
          { name: "九花玉露丸", item: "九花玉露丸", key: "obj_jiuhuayulouwan", color: "#00F" },
          { name: _("巧果儿", "巧果兒"), item: ("巧果儿", "巧果兒"), key: "obj_qiaoguoer", color: "#F00" },
          { name: _("兰陵美酒", "蘭陵美酒"), item: _("兰陵美酒", "蘭陵美酒"), key: "obj_lanlingmeijiu", color: "#F00" },
          { name: _("冰糖葫芦", "冰糖葫蘆"), item: _("冰糖葫芦", "冰糖葫蘆"), key: "obj_bingtanghulu", color: "#F00" },
          { name: _("天机传送阵", "天機傳送陣"), item: _("天机宗遗址传送阵", "天機宗遺址傳送陣"), exec: "event_1_46270566;event_1_78043456;", color: "#000" },
          { name: _("天机宗主令", "天機宗主令"), item: _("天机宗主令", "天機宗主令"), exec: "items info obj_tjzzl", color: "#000" },
          { name: _("四海祖庭", "四海祖庭"), item: _("四海祖庭传送阵", "四海祖庭傳送陣"), exec: "shop buy shop17;items use yinlufeng libao;event_1_32263145;event_1_36342493", color: "#000" },
          { name: _("千里江山图", "千里江山圖"), item: _("千里江山图", "千裡江山圖"), key: "obj_qianlitu", color: "#FC0" },
          { name: _("冰激凌火锅", "冰激淩火鍋"), item: _("冰激凌火锅", "冰激淩火鍋"), key: "obj_bingjilinghuoguo1", color: "#000" },
        ];
        let ta = 0;
        PLU.getAllItems(function (list) {
          itemList.forEach(function (t, ti) {
            var items = list.find(function (it) {
              return !!PLU.dispatchChineseMsg(it.name).match(t.item);
            });
            if (!items) return
            if (ta % 4 == 0) htm += "<div>";
            if (t.key) htm += '<button onclick="PLU.execActions(&quot;items use ' + t.key + ';&quot;)" style="color:' + t.color + ';width:23%;margin:2px 1%;padding:3px;">' + t.name + "</button>";
            else if (t.exec) htm += '<button onclick="PLU.execActions(&quot;' + t.exec + ';&quot;)" style="color:' + t.color + ';width:23%;margin:2px 1%;padding:3px;">' + t.name + "</button>";
            if (ta % 4 == 3) htm += "</div>";
            ta++;
          });
          htm += '</div><button onclick="PLU.execActions(&quot;items use tianlongsi_nanguagu;items use tianlongsi_sanxiangmenmgzhuling;items use obj_molitang;items use obj_yuanxiao;items use obj_jiuhuayulouwan;items use obj_qiaoguoer;items use obj_lanlingmeijiu;items use obj_bingtanghulu;&quot;)" style="cursor:pointer;position:absolute;left:15px;bottom:10px;">' + _("一键", "一鍵") + '使用</button>';
          YFUI.showPop({
            title: "道具快捷使用",
            text: htm,
            width: "382px",
            okText: _("关闭", "關閉"),
            noText: _("配方页", "配方頁"),
            onOk() { },
            onNo() { PLU.itemc_page(0) }
          });

        });
      } else {
        var itemList = [
          { name: "汾酒", key: "event_1_20635853", color: "#FA0" },
          { name: _("茉莉花韵酒", "茉莉花韻酒"), key: "event_1_85652966;items use obj_lhyj;", color: "#FA0" },
          { name: "九花醉月酒", key: "event_1_62174415;items use obj_jhjyj;", color: "#F00" },
          { name: _("春龙茶", "春龍茶"), key: "event_1_73217753;", color: "#F00" },
          { name: _("玄波鲤鲫羹", "玄波鯉鯽羹"), key: "event_1_81217602;", color: "#00F" },
          { name: "培元丹", key: "event_1_8942366;", color: "#00F" },
          { name: "中品凰魄丹", key: "event_1_73547753;", color: "#00F" },
        ];
        itemList.forEach(function (t, ti) {
          if (ti % 4 == 0) htm += "<div>";
          htm += '<button onclick="PLU.execActions(&quot;' + t.key + '&quot;)" style="color:' + t.color + ';width:23%;margin:2px 1%;padding:3px;">' + t.name + "</button>";
          if (ti % 4 == 3) htm += "</div>";
        });
        htm += '</div>';
        YFUI.showPop({
          title: "配方快捷使用",
          text: htm,
          width: "382px",
          okText: _("关闭", "關閉"),
          noText: _("道具页", "道具頁"),
          onOk() { },
          onNo() { PLU.itemc_page(1) }
        });
      }
    },
    tupoSkill(text) {
      var itemArr = text.split(',');
      var id = itemArr[0];
      PLU.execActions(`enable ${id};tupo go,${id};`)
      UTIL.addSysListener("tupo", function(b, type, subtype, msg) {
        if (type !== "notice") return
        if (msg.match(_("突破丹，开始突破", "突破丹，開始突破"))) {
          let m = msg.match(/你使用(\d+)枚突破丹/);
          UTIL.delSysListener("tupo");
          let tupo_num = Math.ceil(Number(m[1]) / 5);
          PLU.execActions(`#${tupo_num} event_1_66830905 ${id} go;`);
        }
      });
    },
    //================================================================================================
    initMenu() {
      YFUI.init();
      YFUI.addBtn({
        id: "ro",
        text: _("▲隐", "▲隱"),
        style: {
          width: "30px",
          opacity: ".6",
          background: "#333",
          color: "#FFF",
          border: "1px solid #CCC",
          borderRadius: "8px 0 0 0",
        },
        onclick($btn) {
          $("#pluginMenus").toggle();
          $("#pluginMenus").is(":hidden") ? $btn.text(_("▼显", "▼顯")) : $btn.text(_("▲隐", "▲隱"));
          $(".menu").hide();
        },
      });
      YFUI.addBtnGroup({ id: "pluginMenus" });
      //Paths
      let PathsArray = [];
      PathsArray.push({
        id: "bt_home",
        groupId: "pluginMenus",
        text: _("首页", "首頁"),
        style: { background: "#FFFF99", padding: "5px 2px", width: "40px" },
        onclick(e) {
          $(".menu").hide();
          PLU.STATUS.isBusy = false;
          clickButton("home", 1);
        },
      });
      let citysArray = PLU.YFD.cityList.map(function (c, i) {
        return {
          id: "bt_jh_" + (i + 1),
          text: c,
          extend: "jh " + (i + 1)
        };
      });
      PathsArray.push({
        id: "bt_citys",
        text: _("地图", "地圖"),
        style: {
          background: "#FFE",
          width: "40px",
          padding: "5px 2px"
        },
        menuStyle: {
          width: "240px",
          "margin-top": "-25px"
        },
        children: citysArray
      });
      let qlArray = PLU.YFD.qlList.map((p, i) => {
        return {
          id: "bt_ql_" + (i + 1),
          text: p.n,
          extend: { func: () => PLU.execActions(PLU.minPath(PLU.queryRoomPath(), p.v)) },
          style: { "background-color": "#CFF" },
        };
      });
      if (PLU.developerMode)
        qlArray.push({
          id: "bt_ql_xunluo",
          text: _("巡逻", "巡邏"),
          extend: { func: PLU.qlxl },
          style: { "background-color": "#CFF" },
        });
      PathsArray.push({
        id: "bt_qls",
        text: _("青龙", "青龍"),
        style: { background: "#DFF", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "160px", "margin-top": "-50px" },
        children: qlArray,
      });

      let mjArray = PLU.YFD.mjList.map((p, i) => {
        return {
          id: "bt_mj_" + (i + 1),
          text: p.n,
          extend: p.v,
          style: { "background-color": "#EFD" },
        };
      });
      PathsArray.push({
        id: "bt_mjs",
        text: "秘境",
        style: { background: "#EFD", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "160px", "margin-top": "-75px" },
        children: mjArray,
      });
      PLU.autoChushi = () => {
        let family = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("family_name");
        let master = PLU.YFD.masterList.slice(0, 32).find((e) => e.in == family);
        if (master == undefined) return;
        let npc = PLU.queryNpc("^" + master.npc.slice(-1)[0] + "$", true);
        if (!npc.length) return;
        let way = npc[0].way;
        //PLU.ONOFF["bt_kg_teamSync"] = 0;
        PLU.execActions(way, () => {
          let npc = UTIL.findRoomNpcReg("^" + master.npc.slice(-1)[0] + "$");
          if (!npc) return;
          let key = npc.key;
          PLU.execActions("apprentice " + key, () => {
            PLU.autoFight({
              targetKey: key,
              fightKind: "fight",
              autoSkill: "multi",
              onEnd() {
                PLU.execActions("chushi " + key, () => {
                  if (family == _("铁雪山庄", "鐵雪山莊")) PLU.execActions("chushi resort_master");
                });
              },
              onFail() {
                PLU.autoFight({
                  targetKey: key,
                  fightKind: "chushi",
                  autoSkill: "multi",
                  onEnd() {
                    PLU.execActions("chushi " + key);
                  },
                });
              },
            });
          });
        });
      };
      let masterArray = PLU.YFD.masterList.map((p, i) => {
        if (i == 32)
          return {
            id: "bt_master_33",
            text: p.n,
            extend: p.v,
            style: {
              "background-color": "#FBB",
              width: "88px",
              padding: "5px 2px",
            },
          };
        else if (i == 33) 
          return {
            id: "bt_master_34",
            text: p.n,
            style: {
              "background-color": "#FBB",
              width: "88px",
              padding: "5px 2px",
            },
            children: [{
              id: "bt_master_34_1",
              text: _("镜星府", "鏡星府"),
              extend: "eval_PLU.baiHJS(1, 0)",
              style: {
                "background-color": "#FCF",
                padding: "5px 2px",
              }
            }, {
              id: "bt_master_34_2",
              text: "碧落城",
              extend: "eval_PLU.baiHJS(2, 0)",
              style: {
                "background-color": "#CFF",
                padding: "5px 2px",
              }
            },{
              id: "bt_master_34_3",
              text: _("荣威镖局", "榮威鏢局"),
              extend: "eval_PLU.baiHJS(3, 0)",
              style: {
                "background-color": "#FFC",
                padding: "5px 2px",
              },
            }],
          };
        let colr = i < 10 ? "#FCF" : i < 20 ? "#CFF" : "#FFC";
        return {
          id: "bt_master_" + (i + 1),
          text: p.n,
          children: (() => {
            if (!PLU.developerMode) return [];
            return [
              {
                id: "bt_master_" + (i + 1) + "_0",
                text: "拜入" + p.n,
                extend: {
                  func: () => send_prompt(_("是否确定要加入", " 是否確定要加入") + p.in + "\n\n\n\n", "home apprentice " + p.in, _("确定", "確定"), 0),
                },
                style: { "background-color": colr },
              },
            ];
          })().concat(
            p.npc.map((name, j) => {
              return {
                id: "bt_master_" + (i + 1) + "_" + (j + 1),
                text: name.split("@").slice(-1)[0],
                extend: PLU.queryNpc(name + "道", true)[0].way,
                style: { "background-color": colr },
              };
            }),
          ),
          style: {
            "background-color": colr,
            width: "40px",
            padding: "5px 2px",
          },
          menuStyle: (function () {
            if (i & 1) return { right: "101px", width: "160px" };
            return { width: "160px" };
          })(),
        };
      });
      PathsArray.push({
        id: "bt_masters",
        text: _("师门", "師門"),
        style: { background: "#FCF", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "96px", "margin-top": "-125px" },
        children: masterArray,
      });

      let dailyArray = PLU.YFD.dailyList.map((p, i) => {
        let colr = i < 4 ? "#FFDDDD" : i < 10 ? "#FFC" : i < 24 ? "#FCF" : "#CFF";
        return {
          id: "bt_daily_" + (i + 1),
          text: p.n,
          extend: p.v,
          style: { "background-color": colr },
        };
      });
      PathsArray.push({
        id: "bt_daily",
        text: "日常",
        style: { background: "#FED", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "160px", "margin-top": "-125px" },
        children: dailyArray,
      });

      let usualArray = PLU.YFD.usualList.map((p, i) => {
        let sty = p.style || { "background-color": "#CDF" };
        return {
          id: "bt_usual_" + (i + 1),
          text: p.n,
          extend: p.v,
          style: sty,
        };
      });
      PathsArray.push({
        id: "bt_usual",
        text: "常用",
        style: { background: "#CDF", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "160px", "margin-top": "-150px" },
        children: usualArray,
      });

      let cts = [],
        libCity = PLU.YFD.mapsLib.Npc.filter((e) => {
          if (!cts.includes(e.jh)) {
            cts.push(e.jh);
            return true;
          }
          return false;
        }).map((e) => e.jh);
      let queryJHMenu = libCity.map((c, i) => {
        return {
          id: "bt_queryjh_" + (i + 1),
          text: c,
          style: {
            width: "50px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            fontSize: "12px",
          },
          extend: { func: PLU.queryJHMenu, param: c },
        };
      });
      let queryArray = [
        {
          id: "bt_queryJHList",
          text: _("章节", "章節"),
          children: queryJHMenu,
          style: { width: "40px", "background-color": "#9ED" },
          menuStyle: { width: "180px", "margin-top": "-180px" },
        },
        {
          id: "bt_queryHistory",
          text: _("历史", "歷史"),
          style: { width: "40px", "background-color": "#FDD" },
          extend: { func: PLU.toQueryHistory },
        },
        {
          id: "bt_queryNpc",
          text: _("寻人", "尋人"),
          style: { width: "40px", "background-color": "#FDD" },
          extend: { func: PLU.toQueryNpc },
        },
        {
          id: "bt_pathNpc",
          text: _("扫图", "掃圖"),
          style: { width: "40px", "background-color": "#FE9" },
          extend: { func: PLU.toPathNpc },
        },
      ];
      PathsArray.push({
        id: "bt_query",
        text: "查找",
        style: { background: "#9ED", width: "40px", padding: "5px 2px" },
        menuStyle: { "margin-top": "-30px" },
        children: queryArray,
      });
      PathsArray.push({
        id: "bt_goHome2",
        text: "洞府",
        style: { background: "#FFFF99", width: "40px", padding: "5px 2px" },
        menuStyle: { "margin-top": "-30px" },
        onclick(e) {
          $(".menu").hide();
          clickButton("event_1_23611724", 1);
        },
      });
      YFUI.addMenu({
        id: "m_paths",
        groupId: "pluginMenus",
        text: _("导航", "導航"),
        style: { background: "#CCFFFF", width: "40px", padding: "5px 2px" },
        multiCol: true,
        menuStyle: { width: "80px", "margin-top": "-25px" },
        children: PathsArray,
        onclick($btn, $box) {
          if ($btn.$extend) {
            $(".menu").hide();
            if ($btn.$extend.func) {
              if ($btn.$extend.param) $btn.$extend.func($btn, $btn.$extend.param);
              else $btn.$extend.func($btn);
              return;
            } else if ($btn.$extend && $btn.text() == _("天龙闲钓", "天龍閒釣") || $btn.text() == _("天龙采茶", "天龍采茶")) {
              let ct = "";
              PLU.execActions("team");
              UTIL.addSysListener("team", function(b, type, subtype, msg){
                if (type !== "team") return
                UTIL.delSysListener("team");
                if (b.get("is_member_of") == undefined) ct = "team create;";
                PLU.execActions(ct + $btn.$extend);
              });
              return
            }
            PLU.execActions($btn.$extend, () => {
              if ($btn.text() == "去哈日") PLU.goHaRi();
              if ($btn.text() == "杭界山") PLU.goHJS();
            });
            // clickButton($btn.$extend)
          }
        },
      });
      let somethingArray = [];
      somethingArray.push({
        id: "bt_autoTeach",
        text: _("游侠技能", "遊俠技能"),
        extend: { func: PLU.toAutoTeach },
        style: { background: "#BFF" },
      });
      somethingArray.push({
        id: "bt_autoUpgrade",
        text: _("升级游侠", "升級遊俠"),
        extend: { func: PLU.toAutoUpgrade },
        style: { background: "#BFF" },
      });
      somethingArray.push({
        id: "hr_null2",
        text: "",
        style: { display: "none" },
        boxStyle: { display: "block", height: "5px" },
      });
      somethingArray.push({
        id: "bt_autoLearn",
        text: _("一键学习", "一鍵學習"),
        extend: { func: PLU.toAutoLearn },
        style: { background: "#FBF" },
      });
      somethingArray.push({
        id: "bt_autoChuaiMo",
        text: _("自动揣摩", "自動揣摩"),
        extend: { func: PLU.toAutoChuaiMo },
        style: { background: "#FBF" },
      });
      somethingArray.push({
        id: "hr_null2",
        text: "",
        style: { display: "none" },
        boxStyle: { display: "block", height: "5px" },
      });
      somethingArray.push({
        id: "bt_loopScript",
        text: _("循环执行", "循環執行"),
        extend: { func: PLU.toLoopScript },
        style: { background: "#FBB" },
      });
      somethingArray.push({
        id: "bt_loopKillByN",
        text: _("计数击杀", "計數擊殺"),
        extend: { func: PLU.toLoopKillByN },
        style: { background: "#FBB" },
      });
      somethingArray.push({
        id: "bt_waitCDKill",
        text: _("倒计时杀", "倒計時殺"),
        extend: { func: PLU.toWaitCDKill },
        style: { background: "#FBB" },
      });

      somethingArray.push({
        id: "bt_loopKillName",
        text: _("名字连杀", "名字連殺"),
        extend: { func: PLU.toLoopKillName },
        style: { background: "#FBB" },
      });
      somethingArray.push({
        id: "bt_loopClick",
        text: _("自动点击", "自動點擊"),
        extend: { func: PLU.toLoopClick },
        style: { background: "#FBB" },
      });
      somethingArray.push({
        id: "bt_loopSlowClick",
        text: _("慢速点击", "慢速點擊"),
        extend: { func: PLU.toLoopSlowClick },
        style: { background: "#FBB" },
      });
      somethingArray.push({
        id: "bt_record",
        text: _("自动练习", "自動練習"),
        extend: { func: PLU.toAutoLianXi },
        style: { background: "#FBB" },
      });
      somethingArray.push({
        id: "bt_record",
        text: _("指令录制", "指令錄製"),
        extend: { func: PLU.toRecord },
        style: { background: "#FBB" },
      });
      somethingArray.push({
        id: "hr_null2",
        text: "",
        style: { display: "none" },
        boxStyle: { display: "block", height: "5px" },
      });
      somethingArray.push({
        id: "bt_sellLaji",
        text: _("出售设定", "出售設定"),
        extend: { func: PLU.toSellLaji },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "bt_splitItem",
        text: _("分解设定", "分解設定"),
        extend: { func: PLU.toSplitItem },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "bt_putStore",
        text: _("批量入库", "批量入庫"),
        extend: { func: PLU.toPutStore },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "bt_autoUse",
        text: "批量使用",
        extend: { func: PLU.toAutoUse },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "bt_combineGem",
        text: _("合成宝石", "合成寶石"),
        extend: { func: PLU.openCombineGem },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "bt_autoMasterGem",
        text: _("一键合天神", "一鍵合天神"),
        extend: { func: PLU.autoMasterGem },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "hr_null2",
        text: "",
        style: { display: "none" },
        boxStyle: { display: "block", height: "5px" },
      });
      somethingArray.push({
        id: "bt_Sha",
        text: _("刷怪相关", "刷怪相關"),
        style: { background: "#FED" },
        menuStyle: { "margin-top": "-25px" },
        children: [
          {
            id: "bt_autoDT",
            text: "爬塔",
            extend: { func: PLU.autoDT },
            style: { background: "#FED" },
          },
          {
            id: "bt_autoDL",
            text: _("爬楼", "爬樓"),
            extend: { func: PLU.autoDL },
            style: { background: "#FED" },
          },
          {
            id: "bt_autoXTL",
            text: _("刷玄铁令", "刷玄鐵令"),
            extend: { func: PLU.autoXTL },
            style: { background: "#FED" },
          },
          {
            id: "bt_autoERG",
            text: _("刷恶人谷", "刷惡人谷"),
            extend: { func: PLU.autoERG },
            style: { background: "#FED" },
          },
          {
            id: "bt_autoCH",
            text: "刷斥侯",
            extend: { func: PLU.autoCH },
            style: { background: "#FED" },
          },
        ],
      });
      somethingArray.push({
        id: "bt_autoXH",
        text: _("自动悬红", "自動懸紅"),
        extend: { func: PLU.autoXH },
        style: { background: "#FED" },
      });
      somethingArray.push({
        id: "hr_null2",
        text: "",
        style: { display: "none" },
        boxStyle: { display: "block", height: "5px" },
      });
      somethingArray.push({
        id: "bt_Moke",
        text: _("摹刻相关", "摹刻相關"),
        style: { background: "#EFD" },
        menuStyle: { "margin-top": "-25px" },
        children: [
          {
            id: "bt_autoMoke",
            text: _("一键摹刻", "一鍵摹刻"),
            extend: { func: PLU.toAutoMoke },
            style: { background: "#EFD" },
          },
          {
            id: "bt_autoBuyDao",
            text: _("补充刻刀", "補充刻刀"),
            extend: { func: PLU.autoBuyDao },
            style: { background: "#EFD" },
          },
        ],
      });
      somethingArray.push({
        id: "bt_loopReadBase",
        text: _("读技能书", "讀技能書"),
        extend: { func: PLU.toLoopReadBase },
        style: { background: "#EFD" },
      });
      somethingArray.push({
        id: "bt_autoGetKey",
        text: _("监听掉落", "監聽掉落"),
        extend: { func: PLU.toAutoGetKey },
        style: { background: "#FBF" },
      });
      somethingArray.push({
        id: "bt_autoKillZYY",
        text: "刷祝玉妍",
        extend: { func: PLU.toAutoKillZYY },
        style: { background: "#FBF" },
      });
      somethingArray.push({
        id: "bt_checkMaterial",
        text: _("快捷购买", "快捷購買"),
        style: { background: "#DEF" },
        menuStyle: { "margin-top": "-25px" },
        children: [
          {
            id: "bt_autoJHYL",
            text: "九花原料",
            extend: { func: PLU.buyJHYL },
            style: { background: "#DEF" },
          }, {
            id: "bt_autoChangeFish",
            text: _("兑换渔获", "兌換漁獲"),
            extend: { func: PLU.autoChangeFish },
            style: { background: "#DEF" },
          }, {
            id: "bt_openFudi",
            text: _("升13剑", "升13劍"),
            extend: { func: PLU.lelup_13sword },
            style: { background: "#DEF" },
          }
        ],
      });
      somethingArray.push({
        id: "bt_checkYouxia",
        text: _("技能检查", "技能檢查"),
        extend: { func: PLU.checkYouxia },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "bt_searchFamilyQS",
        text: _("搜师门任务", "搜師門任務"),
        extend: { func: PLU.toSearchFamilyQS },
        style: { background: "#BBF" },
      });
      somethingArray.push({
        id: "bt_searchBangQS",
        text: _("搜帮派任务", "搜幫派任務"),
        extend: { func: PLU.toSearchBangQS },
        style: { background: "#BBF" },
      });
      // somethingArray.push({id:"bt_autoFB11", text:"自動本11", extend:{func:PLU.toAutoFB11}, style:{background:"#FC9"}})
      YFUI.addMenu({
        id: "m_autoDoSomething",
        groupId: "pluginMenus",
        text: _("自动", "自動"),
        style: { width: "40px" },
        multiCol: true,
        menuStyle: { width: "160px", "margin-top": "-61px" },
        children: somethingArray,
        onclick($btn, $box) {
          if ($btn.$extend) {
            $(".menu").hide();
            $btn.$extend.func($btn);
          }
        },
      });
      //listens
      let listensArray = [];
      listensArray.push({
        id: "bt_autoBF",
        text: _("自动帮四", "自動幫四"),
        extend: { key: "autoBF" },
        style: { background: "#EDC" },
      });
      listensArray.push({
        id: "bt_autoB6",
        text: _("自动帮六", "自動幫六"),
        extend: { key: "autoB6" },
        style: { background: "#ECD" },
      });
      listensArray.push({
        id: "bt_autoB5F",
        text: _("帮五跟杀", "幫五跟殺"),
        extend: { key: "autoB5F" },
        style: { background: "#CEF" },
      });
      listensArray.push({
        id: "bt_autoDZ",
        text: _("持续打坐", "持續打坐"),
        extend: { key: "autoDZ" },
        style: { background: "#CEC" },
      });
      listensArray.push({
        id: "bt_autoHYC",
        text: _("持续睡床", "持續睡床"),
        extend: { key: "autoHYC" },
        style: { background: "#CEC" },
      });
      listensArray.push({
        id: "bt_auto9H",
        text: _("持续九花", "持續九花"),
        extend: { key: "auto9H" },
        style: { background: "#CEC" },
      });
      listensArray.push({
        id: "bt_autoLX",
        text: _("持续练习", "持續練習"),
        extend: { key: "autoLX" },
        style: { background: "#CEC" },
      });
      listensArray.push({
        id: "bt_autoTP",
        text: _("持续突破", "持續突破"),
        extend: { key: "autoTP" },
        style: { background: "#CEC" },
      });
      listensArray.push({
        id: "bt_autoQuitTeam",
        text: _("进塔离队", "進塔離隊"),
        extend: { key: "autoQuitTeam" },
        style: { background: "#EEF" },
      });
      listensArray.push({
        id: "bt_autoSignIn",
        text: _("定时签到", "定時簽到"),
        extend: { key: "autoSignIn" },
        style: { background: "#BEF" },
      });
      listensArray.push({
        id: "bt_autoAFK",
        text: _("持续挂机", "持續掛機"),
        extend: { key: "autoAFK" },
        style: { background: "#EEF" },
      });
      listensArray.push({
        id: "bt_autoConnect",
        text: _("自动重连", "自動重連"),
        extend: { key: "autoConnect" },
        style: { background: "#FED" },
      });
      listensArray.push({
        id: "hr_listen",
        text: "",
        style: { width: "160px", opacity: 0 },
        boxStyle: { "font-size": 0 },
      });
      listensArray.push({
        id: "bt_listenQL",
        text: _("本服青龙", "本服青龍"),
        extend: { key: "listenQL" },
      });
      listensArray.push({
        id: "bt_listenKFQL",
        text: _("跨服青龙", "跨服青龍"),
        extend: { key: "listenKFQL" },
      });
      listensArray.push({
        id: "bt_listenYX",
        text: "遊俠",
        extend: { key: "listenYX" },
      });
      listensArray.push({
        id: "bt_listenTF",
        text: "夜魔逃犯",
        extend: { key: "listenTF" },
      });
      listensArray.push({
        id: "bt_autoFZ",
        text: _("监听纷争", "監聽紛爭"),
        extend: { func: PLU.autoFZ },
        style: { background: "#EEEEFF" },
      });
      listensArray.push({
        id: "bt_listenChat",
        text: _("闲聊", "閒聊"),
        extend: { key: "listenChat" },
      });
      YFUI.addMenu({
        id: "m_listens",
        groupId: "pluginMenus",
        text: _("监听", "監聽"),
        style: { background: "#DDFFDD", width: "40px" },
        multiCol: true,
        menuStyle: { width: "160px", "margin-top": "-25px" },
        children: listensArray,
        onclick($btn, $box) {
          if ($btn.$extend && $btn.$extend.func) {
            $(".menu").hide();
            $btn.$extend.func($btn);
          } else if ($btn.$extend) {
            PLU.setListen($btn, $btn.$extend.key)
          }
        },
      });

      //fightset
      let fightSetsArray = [];
      fightSetsArray.push({
        id: "bt_enableSkills",
        text: _("技 能 组", "技 能 組"),
        style: { background: "#FBE" },
        menuStyle: { "margin-top": "-25px" },
        children: [
          {
            id: "bt_enableSkill1",
            text: _("技能组1", "技能組1"),
            extend: { key: "enable1" },
          },
          {
            id: "bt_enableSkill2",
            text: _("技能组2", "技能組2"),
            extend: { key: "enable2" },
          },
          {
            id: "bt_enableSkill3",
            text: _("技能组3", "技能組3"),
            extend: { key: "enable3" },
          },
        ],
      });
      fightSetsArray.push({
        id: "bt_wearEquip",
        text: _("装备切换", "裝備切換"),
        style: { background: "#FEB" },
        children: [{
          id: "bt_wearEquip1",
          text: _("装备组1", "裝備組1"),
          extend: {
            key: "equip1"
          },
          canSet: true
        }, {
          id: "bt_wearEquip2",
          text: _("装备组2", "裝備組2"),
          extend: {
            key: "equip2"
          },
          canSet: true
        }]
      });
      fightSetsArray.push({
        id: "bt_followKill",
        text: _("跟杀设置", "跟殺設置"),
        extend: { key: "followKill" },
        style: { background: "#FCC" },
      });
      fightSetsArray.push({
        id: "bt_autoCure",
        text: _("血蓝设置", "血藍設置"),
        extend: { key: "autoCure" },
        style: { background: "#CCF" },
      });
      fightSetsArray.push({
        id: "bt_autoPerform",
        text: _("技能设置", "技能設置"),
        extend: { key: "autoPerform" },
        style: { background: "#CFC" },
      });
      fightSetsArray.push({
        id: "hr_dlus",
        text: "",
        style: { width: "240px", opacity: 0 },
      });
			fightSetsArray.push({
				id: "bt_zbjianshen",
				text: _("剑神套", "劍神套"),
				extend: { key: "zbjianshentao" },
				style: { background: "#FEB" },
			});
      fightSetsArray.push({
				id: "bt_zbchuidiao",
				text: _("垂钓套", "垂釣套"),
				extend: { key: "zbchuidiaotao" },
				style: { background: "#FBE" },
			});
      fightSetsArray.push({
				id: "bt_zbxianzhe",
				text: _("贤者套", "賢者套"),
				extend: { key: "zbxianzhetao" },
				style: { background: "#CCF" },
			});
      YFUI.addMenu({
        id: "m_fightsets",
        groupId: "pluginMenus",
        text: _("战斗", "戰鬥"),
        style: { background: "#FFDDDD", width: "40px" },
        //multiCol: true,
        menuStyle: { width: "80px", "margin-top": "-50px" },
        children: fightSetsArray,
        onclick($btn, $box, BtnMode) {
          if ($btn.$extend) {
            if ($btn.$extend.key && PLU.getCache($btn.$extend.key) == 0) $(".menu").hide();
            if ($btn.$extend.key.match("enable")) return PLU.setSkillGroup($btn.$extend.key.substr(-1));
            if ($btn.$extend.key.match("equip")) {
              let equipKey = "equip_" + $btn.$extend.key.substr(-1) + "_keys";
              let equipsStr = PLU.getCache(equipKey);
              $(".menu").hide();
              if (equipsStr && BtnMode != "setting") {
                return PLU.wearEquip(equipsStr);
              }
              return PLU.setWearEquip($btn.$extend.key.substr(-1));
            }
            if ($btn.$extend.key == "zbjianshentao") return PLU.zbjianshen($btn, $btn.$extend.key);
            if ($btn.$extend.key == "zbchuidiaotao") return PLU.zbchuidiao($btn, $btn.$extend.key);
            if ($btn.$extend.key == "zbxianzhetao") return PLU.zbxianzhe($btn, $btn.$extend.key);
            if ($btn.$extend.key == "followKill") return PLU.setFightSets($btn, $btn.$extend.key);
            if ($btn.$extend.key == "autoCure") return PLU.setAutoCure($btn, $btn.$extend.key);
            if ($btn.$extend.key == "autoPerform") return PLU.setAutoPerform($btn, $btn.$extend.key);
          }
        },
      });
      // puzzle
      let puzzleArray = [];
      puzzleArray.push({
        id: "bt_puzzle_Key",
        text: _("外传7", "外傳7"),
        children: [{
          id: "bt_sword_quest_front",
          text: "外7前置",
          extend: {
            func: PLU.sword_quest_front
          },
        }, {
          id: "bt_sword_quest_1",
          text: "外7卷一",
          extend: {
            func: PLU.sword_quest_1
          },
        }, {
          id: "bt_sword_quest_2",
          text: "外7卷二",
          extend: {
            func: PLU.sword_quest_2
          },
        }],
      });
      YFUI.addMenu({
        id: "m_puzzle",
        groupId: "pluginMenus",
        text: _("攻略", "攻略"),
        style: { background: "#CCC", width: "40px" },
        menuStyle: { "margin-top": "-75px" },
        children: puzzleArray,
        onclick($btn, $box) {
          if ($btn.$extend) {
            $(".menu").hide();
            $btn.$extend.func($btn);
          }
        },
      });
      //Sign
      let signArray = [];
      signArray.push({
        id: "bt_autoAskQixia",
        text: _("自动问奇侠", "自動問奇俠"),
        extend: { func: PLU.toAutoAskQixia },
      });
      signArray.push({
        id: "bt_autoVisitQixia",
        text: _("亲近奇侠", "親近奇俠"),
        style: { background: "#CFC" },
        extend: { func: PLU.toAutoVisitQixia },
      });
      signArray.push({
        id: "hr_dlus",
        text: "",
        style: { width: "240px", opacity: 0 },
      });
      signArray.push({
        id: "bt_ricrw",
        text: "日常周常",
        extend: {
          key: "ricrw"
        },
        style: {
          background: "#FBE"
        }
      });
      signArray.push({
        id: "bt_sign",
        text: _("一键签到", "一鍵簽到"),
        extend: { key: "signIn" },
        style: { background: "#CCFFFF" },
      });
      YFUI.addMenu({
        id: "m_signs",
        groupId: "pluginMenus",
        text: _("签到", "簽到"),
        style: { background: "#DDFFFF", width: "40px" },
        menuStyle: { "margin-top": "-92px" },
        children: signArray,
        onclick($btn, $box) {
          if ($btn.$extend) {
            if ($btn.$extend.key == "signIn") {
              $(".menu").hide();
              return PLU.toSignIn();
            } else if ($btn.$extend.key == "ricrw") {
              $(".menu").hide();
              return PLU.toricrw();
            } else if ($btn.$extend.key == "autoricrw") {
              return PLU.setListen($btn, $btn.$extend.key);
            } else if ($btn.$extend.key == "autoSignIn") {
              return PLU.setListen($btn, $btn.$extend.key);
            } else {
              $(".menu").hide();
              $btn.$extend.func($btn);
            }
          }
        },
      });
      //sys
      let sysArray = [];
      sysArray.push({
        id: "bt_openTeam",
        text: _("开队伍", "開隊伍"),
        children: [{
          id: "bt_openTeam1",
          text: _("加入队伍", "加入隊伍"),
          extend: {
            func: PLU.asJirudw
          },
          style: {
            background: "#DEF"
          },
        }, {
          id: "bt_openTeam2",
          text: _("退出队伍", "退出隊伍"),
          extend: "team quit",
        }, {
          id: "bt_openTeam3",
          text: _("重开队伍", "重開隊伍"),
          extend: "team create",
          style: {
            background: "#00ff00"
          },
        }, {
          id: "bt_autoAccept",
          text: _("自动批准", "自動批准"),
          extend: { key: "autoAccept" },
          style: {
            background: "#CEF"
          },
        }, {
          id: "bt_autoInK4",
          text: _("跨服进本", "跨服進本"),
          extend: { key: "autoInK4" },
          style: {
            background: "#CEF"
          },
        }]
      });
      sysArray.push({
        id: "bt_openFudi",
        text: _("开府邸", "開府邸"),
        extend: "fudi",
      });
      sysArray.push({
        id: "bt_openShop",
        text: _("开商城", "開商城"),
        extend: "shop",
      });
      sysArray.push({
        id: "bt_openJFShop",
        text: _("积分商城", "積分商城"),
        extend: "shop xf_shop",
      });
      sysArray.push({
        id: "bt_open4HShop",
        text: _("四海商店", "四海商店"),
        children: [
          {
            id: "bt_open4HShop1",
            text: "回收",
            extend: "reclaim recl",
          },
          {
            id: "bt_open4HShop2",
            text: _("兑换", "兌換"),
            extend: "reclaim buy",
          },
        ],
      });
      sysArray.push({
        id: "bt_clanShop",
        text: _("帮派商店	", "幫會商店"),
        extend: "clan;clan_shop",
      });
      sysArray.push({
        id: "bt_clanShop",
        text: _("浣花剑阵", "浣花劍陣"),
        extend: "hhjz;"
      });
      sysArray.push({
        id: "bt_huanpf",
        text: _("换皮肤", "換皮膚"),
        extend: {
          func: PLU.huanpf
        },
        style: {
          background: "#DEF"
        }
      });
      sysArray.push({
        id: "bt_fb12_broadcast",
        text: _("本12领奖", "本12領獎"),
        extend: { func: PLU.fb12_broadcast },
        style: { background: "#CEF" },
      });
      sysArray.push({
        id: "bt_goKuafu",
        text: "去跨服",
        onclick(e) {
          $(".menu").hide();
          clickButton("change_server world", 1);
        },
      });
      sysArray.push({
        id: "hr_sys",
        text: "",
        style: { width: "160px", opacity: 0 },
        boxStyle: { "font-size": 0 },
      });
      sysArray.push({
        id: "bt_openzbei",
        text: _("装备兑换", "裝備兌換"),
        style: {
          background: "#DEF"
        },
        children: [{
          id: "bt_openzbei1",
          text: _("购买斩龙", "購買斬龍"),
          extend: { func: PLU.buyzl10 },
        }, {
          id: "bt_openzbei2",
          text: _("兑换胤天", "兌換胤天"),
          extend: { func: PLU.dhyt11 },
        }, {
          id: "bt_openzbei3",
          text: _("兑换皇天", "兌換皇天"),
          extend: { func: PLU.dhht12 },
        }, {
          id: "bt_openzbei8",
          text: _("兑换冰材", "兌換冰材"),
          extend: { func: PLU.dhbingy },
        }, {
          id: "bt_openzbei4",
          text: "打造冰月",
          extend: { func: PLU.dzbingy },
        }, {
          id: "bt_openzbei5",
          text: _("兑换剑神", "兌換劍神"),
          extend: { func: PLU.dhjians },
          style: {  background: "#FEB" },
        }, {
          id: "bt_openzbei6",
          text: _("兑换垂钓", "兌換垂釣"),
          extend: { func: PLU.dhchuid },
          style: {  background: "#FBE" },
        }, {
          id: "bt_openzbei7",
          text: _("兑换贤者", "兌換賢者"),
          extend: { func: PLU.dhzxianz },
          style: {  background: "#CCF" },
        }]
      });
      sysArray.push({
        id: "bt_cleartask",
        text: _("清谜题", "清謎題"),
        extend: "auto_tasks cancel",
      });
      sysArray.push({
        id: "bt_openfscail",
        text: _("取飞升材料", "取飛升材料"),
        style: { background: "#DEF"},
        children: [{
          id: "bt_openfscail1",
          text: "金身材料",
          extend: "items get_store /obj/book/neigongxinfamiji;items get_store /obj/shop/jiuzhuanshendan;items get_store /obj/book/jiuyinxuanbingjiancanye;items get_store /obj/shop/wulingchangye;items get_store /obj/shop/wulingchangye;items get_store /obj/baoshi/huangbaoshi8;items get_store /obj/med/jinengtianshu;items info obj_lzjsj;"
        }, {
          id: "bt_openfscail2",
          text: _("龙爪材料", "龍爪材料"),
          extend: "items get_store /obj/book/pujigedoumiji;items get_store /obj/shop/jiuzhuanshendan;items get_store /obj/book/tianshanfeijiancanye;items get_store /obj/shop/wulingchangye;items get_store /obj/baoshi/lanbaoshi8;items get_store /obj/med/jinengtianshu;items info obj_zlzs;"
        }, {
          id: "bt_openfscail3",
          text: _("湿剑材料", "濕劍材料"),
          extend: "items get_store /obj/book/jibenjianfamiji;items get_store /obj/shop/jiuzhuanshendan;items get_store /obj/book/baifashenjiancanye;items get_store /obj/shop/wulingchangye;items get_store /obj/baoshi/zishuijing8;items get_store /obj/med/jinengtianshu;items info obj_shjj;"
        }, {
            id: "bt_openfscail4",
            text: _("强身材料", "強身材料"),
            extend: "items get_store /obj/book/neigongxinfamiji;items get_store /obj/shop/jiuzhuanshendan;items get_store /obj/book/xiaoyunlongtengjiancanye;items get_store /obj/shop/wulingchangye;items get_store /obj/baoshi/hongbaoshi8;items get_store /obj/med/jinengtianshu;items info obj_lsqss;"
        }, {
            id: "bt_openfscail5",
            text: _("万剑材料", "萬劍材料"),
            extend: "items get_store /obj/yushi/dixisui1;items get_store /obj/yushi/donghaibi1;items get_store /obj/yushi/jiutianluo1;items get_store /obj/yushi/juzimo1;items get_store /obj/yushi/kunlunyin1;items get_store /obj/yushi/longtingpo1;items get_store /obj/yushi/xuanyuanlie1;items get_store /obj/baoshi/hongbaoshi8;items get_store /obj/baoshi/lvbaoshi8;items get_store /obj/baoshi/huangbaoshi8;items get_store /obj/shop/wjgz_miji;items info obj_wjgz_miji;"
        }, {
            id: "bt_openfscail6",
            text: _("如来材料", "如來材料"),
            extend: "items get_store /obj/yushi/dixisui1;items get_store /obj/yushi/donghaibi1;items get_store /obj/yushi/jiutianluo1;items get_store /obj/yushi/juzimo1;items get_store /obj/yushi/kunlunyin1;items get_store /obj/yushi/longtingpo1;items get_store /obj/yushi/xuanyuanlie1;items get_store /obj/baoshi/hongbaoshi8;items get_store /obj/baoshi/lvbaoshi8;items get_store /obj/baoshi/huangbaoshi8;items get_store /obj/shop/rlzj_miji;items info obj_rlzj_miji;"
        }, {
            id: "bt_openfscail7",
            text: "仙步材料",
            extend: "items get_store /obj/yushi/dixisui1;items get_store /obj/yushi/donghaibi1;items get_store /obj/yushi/jiutianluo1;items get_store /obj/yushi/juzimo1;items get_store /obj/yushi/kunlunyin1;items get_store /obj/yushi/longtingpo1;items get_store /obj/yushi/xuanyuanlie1;items get_store /obj/baoshi/hongbaoshi8;items get_store /obj/baoshi/lvbaoshi8;items get_store /obj/baoshi/huangbaoshi8;items get_store /obj/shop/zydsb_miji;items info obj_zydsb_miji;"
        }]
      });
      sysArray.push({
        id: "bt_task",
        text: _("谜题列表", "謎題列表"),
        extend: "task_quest"
      });
      sysArray.push({
        id: "bt_intervene",
        text: _("杀隐藏怪", "殺隱藏怪"),
        extend: { func: PLU.intervene },
      });
      sysArray.push({
        id: "bt_openQixia",
        text: _("奇侠列表", "奇俠列表"),
        extend: "open jhqx",
      });
      sysArray.push({
        id: "hr_sys",
        text: "",
        style: { width: "160px", opacity: 0 },
        boxStyle: { "font-size": 0 },
      });
      sysArray.push({
        id: "bt_set_profile",
        text: _("个人设置", "個人設置"),
        style: { background: "#EEEEFF"},
        children: [{
          id: "bt_isMVP",
          text: _("专属称号", "專屬稱號"),
          style: { background: "#EDC"},
          extend: { key: "isMVP" }
        }, {
          id: "bt_rankUpdate",
          text: _("称号判定", "稱號判定"),
          style: { background: "#EDC"},
          extend: { func: PLU.rankUpdate }
        }, {
          id: "bt_openClan",
          text: _("定时开帮本", "定時開幫本"),
          style: { background: "#EDC"},
          extend: { func: PLU.openClan }
        }, {
          id: "bt_baoset",
          text: _("探宝设定", "探寶設定"),
          style: { background: "#EDC"},
          extend: { func: PLU.baoset }
        }, {
          id: "bt_shilianta",
          text: _("试炼塔设定", "試煉塔設定"),
          style: { background: "#EDC"},
          extend: { func: PLU.shilianta }
        }]
      });
      sysArray.push({
        id: "bt_log",
        text: "消息日志",
        extend: { func: PLU.showLog },
        style: { background: "#99CC00" },
      });
      sysArray.push({
        id: "bt_upset",
        text: _("备份设置", "備份設置"),
        extend: { func: PLU.backupSetting },
        style: { background: "#FFAAAA" },
      });
      sysArray.push({
        id: "bt_dlset",
        text: _("载入设置", "載入設置"),
        extend: { func: PLU.loadSetting },
        style: { background: "#FFCC00" },
      });
      YFUI.addMenu({
        id: "m_sys",
        groupId: "pluginMenus",
        text: "工具",
        multiCol: true,
        style: { background: "#FFFFDD", width: "40px" },
        menuStyle: { width: "160px", "margin-top": "-117px" },
        children: sysArray,
        onclick($btn, $box) {
          if ($btn.$extend) {
            if ($btn.$extend && $btn.$extend.key) {
              PLU.setListen($btn, $btn.$extend.key)
            } else if ($btn.$extend && $btn.$extend.func) {
              $(".menu").hide();
              $btn.$extend.func($btn);
              return
            } else if ($btn.$extend) {
              $(".menu").hide();
              PLU.execActions($btn.$extend);
            }
          }
        },
      });
      //================================================================================
      //  活動
      //================================================================================
      // let activeArray=[]
      // activeArray.push({id:"bt_goShop1", text:"去小二", extend:"jh 1;"})
      // activeArray.push({id:"bt_buyItem1", text:"買四樣", extend:"#21 buy_npc_item go 0;#21 buy_npc_item go 1;#21 buy_npc_item go 2;#21 buy_npc_item go 3;"})
      // activeArray.push({id:"bt_goShop2", text:"去掌櫃", extend:"jh 5;n;n;n;w", style:{background:"#FDD"}})
      // activeArray.push({id:"bt_buyItem2", text:"買紅粉", extend:"#6 buy_npc_item go 0;", style:{background:"#FDD"}})
      // activeArray.push({id:"bt_goShop3", text:"去小販", extend:"jh 2;n;n;n;n;e", style:{background:"#DEF"}})
      // activeArray.push({id:"bt_buyItem3", text:"買黃粉", extend:"#6 event_1_17045611 go 0;", style:{background:"#DEF"}})
      // activeArray.push({id:"bt_goShop4", text:"去峨眉", extend:"jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w", style:{background:"#EFE"}})
      // activeArray.push({id:"bt_buyItem4", text:"買藍粉", extend:"#6 event_1_39153184 go 0;", style:{background:"#EFE"}})
      // activeArray.push({id:"bt_goAll", text:"一鍵買材料", extend:"jh 1;#21 buy_npc_item go 0;#21 buy_npc_item go 1;#21 buy_npc_item go 2;#21 buy_npc_item go 3;jh 5;n;n;n;w;#6 buy_npc_item go 0;jh 2;n;n;n;n;e;#6 event_1_17045611 go 0;jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;#6 event_1_39153184 go 0;", style:{background:"#9F9"}})
      // activeArray.push({id:"bt_goShoot", text:"去放煙花", extend:"jh 2;n;n;n;", style:{background:"#FD9"}})
      // // activeArray.push({id:"bt_n", text:"", style:{opacity:0}})
      // // activeArray.push({id:"hr_sys", text:"", style:{width:"160px",opacity:0}, boxStyle:{"font-size":0}})
      // activeArray.push({id:"bt_goShoot1", text:"一鍵璀璨", extend:"#5 event_1_99582507;#15 event_1_48376442;", style:{background:"#F9D"}})
      // activeArray.push({id:"bt_goShoot2", text:"一鍵四款", extend:"#5 event_1_74166959;#5 event_1_10053782;#5 event_1_25918230;#5 event_1_48376442;", style:{background:"#D9F"}})

      // YFUI.addMenu({
      //     id: "m_active",
      //     groupId:"pluginMenus",
      //     text: "元宵",
      //     multiCol: true,
      //     style:{"background":"#FFFF55","width":"40px","margin-top":"25px"},
      //     menuStyle: {width: "160px","margin-top":"-22px"},
      //     children: activeArray,
      //     onclick($btn,$box){
      //         if($btn.$extend && $btn.$extend.func){
      //             //$(".menu").hide()
      //             $btn.$extend.func($btn)
      //}else if($btn.$extend){
      //             //$(".menu").hide()
      // 			PLU.execActions($btn.$extend,()=>{
      // 				YFUI.writeToOut("<span style='color:#FFF;'>========== OK ==========</span>")
      // 			})
      // 		}
      //}
      //})
      //================================================================================
      //================================================================================

      let gh = parseInt($("#page").height() * $("#page").height() * 0.00025);
      YFUI.addBtn({
        id: "bt_col_null",
        groupId: "pluginMenus",
        text: "",
        style: {
          background: "transparent",
          height: gh + "px",
          width: "0px",
          visibility: "hidden",
        },
        boxStyle: { "pointer-events": "none" },
      });
      //戰鬥按鈕
      YFUI.addBtn({
        id: "bt_kg_autoEscape",
        groupId: "pluginMenus",
        text: "逃跑",
        style: { background: "#DDCCEE", height: "20px", width: "40px" },
        // boxStyle:{"margin-bottom":"15px"},
        onclick($btn) {
          let btnFlag = PLU.setBtnRed($btn);
          if (btnFlag) {
            PLU.autoEscape({
              onEnd() {
                PLU.setBtnRed($btn);
              },
            });
          } else UTIL.delSysListener("onAutoEscape");
        },
      });
      YFUI.addBtn({
        id: "bt_kg_loopKill",
        groupId: "pluginMenus",
        text: _("循环杀", "循環殺"),
        style: { background: "#EECCCC", height: "20px", width: "40px" },
        // boxStyle:{"margin-bottom":"15px"},
        onclick($btn) {
          PLU.toLoopKill($btn);
        },
      });
      YFUI.addBtn({
        id: "bt_kg_teamSync",
        groupId: "pluginMenus",
        text: "同步",
        style: { background: "#DDCCEE", height: "20px", width: "40px" },
        boxStyle: { "margin-bottom": "15px" },
        onclick($btn) {
          PLU.toggleTeamSync($btn);
        },
      });
      YFUI.addBtn({
        id: "bt_kg_followKill",
        groupId: "pluginMenus",
        text: _("跟杀", "跟殺"),
        style: { background: "#FFDDDD", height: "25px", width: "40px" },
        onclick($btn) {
          PLU.toggleFollowKill($btn, "followKill");
        },
      });
      YFUI.addBtn({
        id: "bt_kg_autoCure",
        groupId: "pluginMenus",
        text: _("血蓝", "血藍"),
        style: { background: "#CCCCFF", height: "25px", width: "40px" },
        onclick($btn) {
          PLU.toggleAutoCure($btn, "autoCure");
        },
      });
      YFUI.addBtn({
        id: "bt_kg_autoPerform",
        groupId: "pluginMenus",
        text: _("连招", "連招"),
        style: { background: "#FFCCFF", height: "25px", width: "40px" },
        onclick($btn) {
          PLU.toggleAutoPerform($btn, "autoPerform");
        },
      });
      //monitor
      let momaxW = $("#page").width() - $("#out").width() > 4 && $("#out").width() > 634 ? 475 : Math.floor($("#out").width() * 0.75);
      let leftSty = $("#page").width() - $("#out").width() > 4 && $("#page").width() > 634 ? "79px" : "12%";
      YFUI.addBtnGroup({
        id: "topMonitor",
        style: {
          position: "fixed",
          top: 0,
          left: leftSty,
          width: "75%",
          height: "15px",
          maxWidth: momaxW + "px",
          lineHeight: "1.2",
          fontSize: "11px",
          textAlign: "left",
          color: "#FF9",
          background: "rgba(0,0,0,0)",
          display: "none",
        },
      });
    },
    //================================================================================================
    getCache(key) {
      return PLU.CACHE[key] ?? "";
    },
    //================================================================================================
    setCache(key, val) {
      PLU.CACHE[key] = val;
      UTIL.setMem("CACHE", JSON.stringify(PLU.CACHE));
      return val;
    },
    //================================================================================================
    initStorage() {
      if (!UTIL.getMem("CACHE")) UTIL.setMem("CACHE", JSON.stringify(PLU.CACHE));
      let caObj,
        ca = UTIL.getMem("CACHE");
      try {
        caObj = JSON.parse(ca);
      } catch (err) { }
      if (caObj) {
        PLU.CACHE = caObj;
        let listen = [
          "listenPuzzle",
          "listenChat",
          "listenQL",
          "listenTF",
          "listenKFQL",
          "listenYX",
          "autoDZ",
          "autoHYC",
          "auto9H",
          "autoAFK",
          "autoTP",
          "autoLX",
          "autoBF",
          "autoB5F",
          "autoB6",
          "autoConnect",
          "autoSignIn",
          "autoQuitTeam",
          "autoFZ",
          "autoAccept",
          "autoInK4",
          "isMVP",
          "openClan",
          "fb12_broadcast",
        ];
        for (var i = 0, len = listen.length; i < len; i++) {
          if (PLU.getCache(listen[i]) == 1) PLU.setListen($("#btn_bt_" + listen[i]), listen[i], 1);
        }
        if (PLU.getCache("listenPuzzle") == 0) {
          PLU.TMP.autotask = false;
        }
        if (PLU.getCache("followKill") == 1) {
          PLU.toggleFollowKill($("#btn_bt_kg_followKill"), "followKill", 1);
        }
        if (PLU.getCache("autoCure") == 1) {
          PLU.toggleAutoCure($("#btn_bt_kg_autoCure"), "autoCure", 1);
        }
        if (PLU.getCache("autoPerform") >= 1) {
          PLU.toggleAutoPerform($("#btn_bt_kg_autoPerform"), "autoPerform", PLU.getCache("autoPerform"));
        }
      }
    },
    //================================================================================================
    initHistory() {
      //---------------------
      document.addEventListener("addLog", PLU.updateShowLog);
      document.addEventListener("addChat", PLU.updateShowChat);
      //---------------------
      let hisArr = [],
        hstr = UTIL.getMem("HISTORY"),
        nowTs = null,
        newArr = null;
      if (hstr)
        try {
          hisArr = JSON.parse(hstr);
        } catch (err) { }
      if (hisArr && hisArr.length) {
        nowTs = new Date().getTime();
        newArr = hisArr.filter((h) => {
          UTIL.log(Object.assign({}, h, { isHistory: true }));
          if (nowTs - h.time > 43200000) return false;
          return true;
        });
        UTIL.logHistory = newArr;
        UTIL.setMem("HISTORY", JSON.stringify(newArr));
      }
      PLU.MPFZ = UTIL.getMem("MPFZ") ? JSON.parse(UTIL.getMem("MPFZ")) : {};
    },
    //================================================================================================
    initListeners() {
      //監聽戰鬥消息
      UTIL.addSysListener("listenAllFight", (b, type, subtype, msg) => {
        if (type == "notice" && subtype == "notify_fail") {
          for (var key in PLU.battleListener) {
            PLU.battleListener[key](b, type, subtype, msg, failToBattleEventKind);
          }
          return;
        }
        if (type == "vs") {
          switch (subtype) {
            case "vs_info":
              if (b.containsKey("is_watcher")) {
                PLU.STATUS.inBattle = 2;
                PLU.inBattleView = true;
                break;
              }
              PLU.STATUS.inBattle = 1;
              PLU.inBattleFight = true;
              break;
            case "text":
              if (PLU.inBattleFight) {
                if (!PLU.battlingSkills.skillInit) {
                  PLU.battlingSkills.skillInit = true;
                  var bInfo = PLU.getBattleInfo();
                  if (!bInfo) return;
                  var xdz = bInfo.get(PLU.battleMyHead + "_xdz" + PLU.battleMyPos);
                  PLU.battlingSkills.xdz = xdz;
                  if (!PLU.battlingSkills.xdz) {
                    console.log("init xdz:", bInfo, PLU.battleMyHead + "_xdz" + PLU.battleMyPos, xdz, msg, PLU.battlingSkills)
                  }
                  // 完成初始战斗时发一个气值事件以便触发战斗
                  PLU.inBattleEvent(PLU.battleTriggerData);
                }
              } else {
                PLU.battlingSkills.clear();
              }
          break;
            case "next_skill":
            case "ready_skill":
              if (b.get("uid").indexOf(PLU.accId) < 0) {
                break;
              }
              PLU.battlingSkills.ready();
              break;
            case "add_xdz":
              PLU.battlingSkills.xdz = parseInt(b.get("xdz"));
              break;
            case "out_watch":
              PLU.inBattleView = false;
              PLU.inBattleFight = false;
              PLU.STATUS.inBattle = 0;
              PLU.battlingSkills.clear();
              break;
            case "combat_result":
              PLU.inBattleView = false;
              PLU.inBattleFight = false;
              PLU.STATUS.inBattle = 0;
              PLU.battlingSkills.clear();
              if (b.get("fail_uid").includes(PLU.accId.split("(")[0])) {
                if ("KuaFu4" in UTIL.sysListeners) UTIL.delSysListener("KuaFu4")
                if ("KuaFu5" in UTIL.sysListeners) UTIL.delSysListener("KuaFu5")
                if ("KuaFu4_kill" in UTIL.sysListeners) UTIL.delSysListener("KuaFu4_kill")
                if ("KuaFu5_kill" in UTIL.sysListeners) UTIL.delSysListener("KuaFu5_kill")
              }
              break;
            default:
              break;
          }
          PLU.inBattleEvent(b, type, subtype, msg);
        }
      });
      //監聽場景消息
      UTIL.addSysListener("listenNotice", (b, type, subtype, msg) => {
        if (type != "notice" && type != "main_msg") return;
        if (msg.match(_(/闲聊|告诉|队伍/, /閒聊|告訴|隊伍/))) return;
        let msgTxt = UTIL.filterMsg(msg);
        if (msgTxt.match(_("你打坐完毕", "你打坐完畢")) && PLU.getCache("autoDZ") == 1) {
        if (UTIL.inHome()) clickButton("exercise", 0);
          else
            PLU.TODO.push({
              type: "cmds",
              cmds: "exercise",
              timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
            });
        } else if (msgTxt.match(_("你今天在线不足一小时", "你今天在線不足一小時"))) {
          setTimeout(() => {PLU.ddGo()}, 3600000);
        } else if ((msgTxt.match(_("你从寒玉床上爬起", "你從寒玉床上爬起")) || msgTxt.match(_("你从地髓石乳中出来", "你從地髓石乳中出來"))) && PLU.getCache("autoHYC") == 1) {
          if (UTIL.inHome()) PLU.execActions("golook_room;sleep_hanyuchuang;home");
          else
            PLU.TODO.push({
              type: "cmds",
              cmds: "golook_room;sleep_hanyuchuang;home",
              timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
            });
        } else if ((msgTxt.match("你停止了修炼。")) && PLU.getCache("autoHYC") == 1) {
          if (UTIL.inHome()) PLU.execActions("xls practice;");
          else
            PLU.TODO.push({
              type: "cmds",
              cmds: "xls practice;",
              timeout: new Date().getTime() + 8 * 60 * 60 * 1000
            });
        } else if (msgTxt.match(_("你中了【黑蛭异毒】", "你中了【黑蛭異毒】"))) {
          PLU.execActions("items info obj_zuixianwan");
          UTIL.addSysListener("obj_zuixianwan", function (b, type, subtype, msg) {
            if (type == "notice" && subtype == "notify_fail" && msg.indexOf(_("你的背包里没有这个物品", "你的背包裡沒有這個物品")) == 0) {
              UTIL.delSysListener("obj_zuixianwan");
              PLU.execActions("jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;#7 w;s;#10 event_1_49250604;home;");
            } else if (type == "items" && subtype == "info" && UTIL.filterMsg(b.get("name")) == _("醉仙灵芙丸", "醉仙靈芙丸")) {
              PLU.execActions("items use obj_zuixianwan");
            }
          });
        /*} else if (msgTxt.match(_("突破丹，开始突破", "突破丹，開始突破"))) {
          PLU.execActions("")*/
        } else if (msgTxt.match(_("开始观舞了，请不要离开此处", "開始觀舞了，請不要離開此處"))) {
          PLU.setCache("dance_day", checkDay());
          PLU.watch_dance = 0;
        } else if (msgTxt.match(_("【观舞中】", "【觀舞中】"))) {
          PLU.watch_dance++;
          if (PLU.watch_dance >= 50) {
            setTimeout(function() {
              let lastAFK_place = PLU.getCache("lastAFK_place") || "home;";
              PLU.execActions("log?" + _("观舞结束;", "觀舞結束;") + lastAFK_place);
            }, 200);
          }
        } else if (msgTxt.match(_("你被踢出了观舞台", "你被踢出了觀舞台"))) {
          let lastAFK_place = PLU.getCache("lastAFK_place") || "home;";
          PLU.execActions("log?" + _("观舞结束;", "觀舞結束;") + lastAFK_place);
        } else if (msgTxt.match(_("你没有茶篓，无法采茶", "你沒有茶簍，無法采茶")) || msgTxt.match(_("采茶需要茶篓", "採茶需要茶簍"))) {
          //采茶完成
          if (PLU.getCache("autoAFK") == 1) {
            var attr = g_obj_map.get("msg_attrs");
            if (attr.get("yuanbao") >= PLU.getCache("autoAFK_key") + 50) PLU.execActions("shop buy shop47_N_10;diaoyu;"); else setTimeout(function () {
              PLU.fishing();
            }, 1000);
          }
        } else if (msgTxt.match(_("你今天采得太多了，明天再来吧", "你今天採得太多了，明天再來吧")) || msgTxt.match(_("太多人在钓鱼了", "太多人在釣魚了"))) {
          PLU.fishing();
        } else if (msgTxt.match(_("太多人在采茶了", "太多人在採茶了"))) {
          PLU.teaing();
        } else if (msgTxt.match(_("你今天使用九花玉露丸次数已经达到上限了", "你今天使用九花玉露丸次數已經達到上限了"))) {
          YFUI.writeToOut("<span style='color:yellow;'>" + _("九花玉露丸次数已达到上限!取消监听九花玉露丸", "九花玉露丸次數已達到上限!取消監聽九花玉露丸") + "...</span>");
          PLU.setListen($("#btn_bt_auto9H"), "auto9H", 0);
        } else if (msgTxt.match("九花玉露丸效果：") && PLU.getCache("auto9H") == 1) {
          PLU.execActions("items use obj_jiuhuayulouwan");
        } else if (msgTxt.match(/你的(.*)成功向前突破了/) && PLU.getCache("autoTP") == 1) {
          if (UTIL.inHome()) PLU.toToPo();
          else {
            let checktp = PLU.TODO.find((e) => e.cmds == "toToPo");
            if (!checktp)
              PLU.TODO.push({
                type: "func",
                cmds: "toToPo",
                timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
              });
          }
        } else if (msgTxt.match(_("本届比武大会第一名", "本屆比武大會第一名"))) {
          let swords_day = PLU.getCache("swords_day") || "";
          if (swords_day == checkDay()) return
          if (UTIL.inHome()) clickButton("swords get_drop go;home;", 0); else PLU.TODO.push({
            type: "cmds",
            cmds: "swords get_drop go;home;",
            timeout: new Date().getTime() + 8 * 60 * 60 * 1000
          });
          PLU.getCache("swords_day", checkDay());
        } else if ((msgTxt.match(_("你现在正突破", "你現在正突破")) && msgTxt.match(_("同时突破", "同時突破"))) || msgTxt.match("此次突破需要")) {
          //突破失敗
          PLU.TMP.stopToPo = true;
        } else if (msgTxt.match(_("青龙会组织：", "青龍會組織："))) {
          //本服青龍
          let l = msgTxt.match(_(/青龙会组织：(.*)正在\003href;0;([\w\d\s]+)\003(.*)\0030\003施展力量，本会愿出(.*)的战利品奖励给本场战斗的最终获胜者。/, /青龍會組織：(.*)正在\003href;0;([\w\d\s]+)\003(.*)\0030\003施展力量，本會願出(.*)的戰利品獎勵給本場戰鬥的最終獲勝者。/));
          if (l && l.length > 3) {
            UTIL.log({
              msg: _("【青龙】", "【青龍】") + l[3].padStart(5) + " - " + l[1].padEnd(4) + _("  奖品:", "  獎品:") + l[4],
              type: "QL",
              time: new Date().getTime(),
            });
            if (PLU.getCache("listenQL") == 1) {
              let keysStr = PLU.getCache("listenQL_keys")
                .split("|")[1]
                .split(",")
                .map((e) => (e == "*" ? ".*" : e.replace("*", "\\*")))
                .join("|");
              let reg = new RegExp(keysStr);
              if (l[4].match(reg) && UTIL.inHome()) {
                PLU.goQinglong(l[1], l[3], PLU.getCache("listenQL_keys").split("|")[0], false);
              }
            }
          }
        } else if (msgTxt.match(_("对你悄声道：你现在去", "對你悄聲道：你現在去")) && !PLU.TMP.autoQixiaMijing) {
          //奇俠說秘境
          let l = msgTxt.match(_(/(.*)对你悄声道：你现在去(.*)，应当会有发现/, /(.*)對你悄聲道：你現在去(.*)，應當會有發現/));
          if (l && l.length > 2) {
            let placeData = PLU.YFD.mjList.find((e) => e.n == l[2]);
            if (placeData) {
              YFUI.writeToOut(
                "<span>" + _("奇侠秘境", "奇俠秘境") + ": <a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.execActions(\"" +
                placeData.v +
                "\")'>" +
                placeData.n +
                "</a></span>",
              );
              YFUI.showPop({
                title: _("奇侠秘境", "奇俠秘境"),
                text: "秘境：" + placeData.n,
                okText: "去秘境",
                onOk() {
                  PLU.execActions(placeData.v + ";find_task_road secret;", () => {
                    YFUI.writeToOut(
                      "<span>:: <a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='clickButton(\"open jhqx\", 0)'>" + _("奇侠列表", "奇俠列表") + "</a></span>",
                    );
                  });
									UTIL.addSysListener("find_task_roadNotice", function (b, type, subtype, msg) {
										if (type == "jh" && subtype == "info" && b.get("no_map")) {
											let mapid = b.get("map_id");
											let shortName = b.get("short");
											YFUI.writeToOut("<span style='color:#FFF;'>--" + _("地图ID:", "地圖ID:") + mapid + "--</span>");
											if (mapid == "public") {
												UTIL.delSysListener("find_task_roadNotice");
												PLU.execActions("secret_op1;")
											} else {
												let ss = g_obj_map.get("msg_room").elements.find((e) => e.value == _("仔细搜索", "仔細搜索"));
												if (ss) {
													UTIL.delSysListener("find_task_roadNotice");
													let cmd_ss = g_obj_map.get("msg_room").get(ss.key.split("_")[0]);
													PLU.execActions(cmd_ss + ";;", () => {
														let wb = g_obj_map.get("msg_room").elements.find((e) => e.value.indexOf(_("秘境挖宝", "秘境挖寶")) >= 0);
														if (wb) {
															PLU.execActions("mijing_wb;;");
														}
													});
												}
											}
										}
									})
                },
                onNo() { },
              });
            }
          }
        } else if (msgTxt.match(_("你赢了这场宝藏秘图之战！", "你贏了這場寶藏秘圖之戰！"))) {
          PLU.execActions("clan bzmt puzz");
        } else if (msgTxt.match(_("开启了帮派副本", "開啟了幫派副本"))) {
          if (PLU.getCache("autoBF") == 1) {
            //幫四開啟
            let ll = msg.match(_(/开启了帮派副本.*十月围城.*【(.*)】/, /開啟了幫派副本.*十月圍城.*【(.*)】/));
            if (ll) {
              let n = "一二三".indexOf(ll[1]);
              UTIL.log({
                msg: _("【帮四】帮四(", "【幫四】幫四(") + ll[1] + _(")开启 ", ")開啟 "),
                type: "BF",
                time: new Date().getTime(),
              });
              if (n >= 0) {
                if (!g_gmain.is_fighting) {
                  PLU.toBangFour(n + 1);
                } else {
                  let checktodo = PLU.TODO.find((e) => e.cmds == "toBangFour");
                  if (!checktodo)
                    PLU.TODO.push({
                      type: "func",
                      cmds: "toBangFour",
                      param: [n + 1],
                      timeout: new Date().getTime() + 5 * 60 * 1000,
                    });
                }
              }
            }
          }
          if (PLU.getCache("autoB6") == 1) {
            //幫六開啟
            let ls = msg.match(_(/开启了帮派副本.*蛮荒七神寨.*/, /開啟了幫派副本.*蠻荒七神寨.*/));
            if (ls) {
              if (!g_gmain.is_fighting) {
                PLU.toBangSix();
              } else {
                let checktodo = PLU.TODO.find((e) => e.cmds == "toBangSix");
                if (!checktodo)
                  PLU.TODO.push({
                    type: "func",
                    cmds: "toBangSix",
                    param: [""],
                    timeout: new Date().getTime() + 5 * 60 * 1000,
                  });
              }
            }
          }
        } else if (msgTxt.match(_("十月围城】帮派副本胜利", "十月圍城】幫派副本勝利"))) {
          //幫四完成
          PLU.STO.bangFourTo && clearTimeout(PLU.STO.bangFourTo);
          if (!g_gmain.is_fighting) {
            setTimeout(() => {
              PLU.execActions("home;");
            }, 2000);
          }
        } else if (msgTxt.match(_("蛮荒七神寨】帮派副本胜利", "蠻荒七神寨】幫派副本勝利"))) {
          //幫六完成
          PLU.STO.bangSixTo && clearTimeout(PLU.STO.bangSixTo);
          if (!g_gmain.is_fighting) {
            setTimeout(() => {
              PLU.execActions("home;");
            }, 2000);
          }
        } else if (msgTxt.match(_("你今天进入此副本的次数已达到上限了", "你今天進入此副本的次數已達到上限了"))) {
          //幫四六無法進入
          PLU.STO.bangFourTo && clearTimeout(PLU.STO.bangFourTo);
          PLU.STO.bangSixTo && clearTimeout(PLU.STO.bangSixTo);
          UTIL.log({
            msg: " !!副本超量!!",
            type: "TIPS",
            time: new Date().getTime(),
          });
        } else if (msgTxt.match(_(/你已进入帮派副本\*\*可汗金帐\*\*/, /你已進入幫派副本\*\*可汗金帳\*\*/)) && PLU.getCache("autoB5F") == 1) {
          //幫五進入
          PLU.inBangFiveEvent();
        } else if (msgTxt.match(_("成功消灭了守将府内的所有敌人", "成功消滅了守將府內的所有敵人"))) {
          //幫二完成
          let l = msgTxt.match(_(/守城成功】(.*)成功消灭了守将府内的所有敌人，帮派副本完成/, /守城成功】(.*)成功消滅了守將府內的所有敵人，幫派副本完成/));
          if (l && l.length > 1 && !g_gmain.is_fighting) {
            setTimeout(() => {
              PLU.execActions("home;");
            }, 3000);
          }
        } else if (msgTxt.match(_("你没有精良鱼饵，无法钓鱼", "你沒有精良魚餌，無法釣魚"))) {
          //釣魚完成
          if (!UTIL.inHome() && !g_gmain.is_fighting) {
            if (PLU.getCache("autoAFK") == 1) {
              let attr = g_obj_map.get("msg_attrs");
              if (attr.get("yuanbao") >= PLU.getCache("autoAFK_key") + 50) PLU.execActions("shop buy shop48_N_10;diaoyu;");
              else
                setTimeout(() => {
                  PLU.setCache("autoAFK", 0);
                  PLU.execActions("home;");
                }, 1000);
            }
          } else
            setTimeout(() => {
              PLU.setCache("autoAFK", 0);
              PLU.execActions("home;");
            }, 1000);
        }
    });

      //監聽頻道消息
      UTIL.addSysListener("listenChannel", (b, type, subtype, msg) => {
        if (type != "channel" || subtype != "sys") return;
        let msgTxt = UTIL.filterMsg(msg);
        //本服逃犯
        if (msgTxt.match(_("慌不择路", "慌不擇路")) && msgTxt.indexOf("跨服") < 0) {
          var l = msgTxt.match(_(/系统】([\u4e00-\u9fa5|\*]+).*慌不择路，逃往了(.*)-\003href;0;([\w\d\s]+)\003([\u4e00-\u9fa5]+)/, /系統】([\u4e00-\u9fa5|\*]+).*慌不擇路，逃往了(.*)-\003href;0;([\w\d\s]+)\003([\u4e00-\u9fa5]+)/));
          if (l && l.length > 4) {
            UTIL.log({
              msg: "【逃犯】" + l[2] + "-" + l[4] + " : " + l[1],
              type: "TF",
              time: new Date().getTime(),
            });
            var TFgo = false;
            if (UTIL.inHome()) {
              TFgo = true;
            } else if (g_obj_map.get("msg_room").get("short") == _("后山茶园", "後山茶園")) {
              TFgo = true;
            } else if (g_obj_map.get("msg_room").get("short") == "桃溪") {
              TFgo = true;
            }
            if (PLU.getCache("listenTF") == 1 && TFgo) {
              if (!PLU.TMP.lis_TF_list) {
                PLU.splitTFParam();
              }
              if (PLU.TMP.lis_TF_list.includes(l[1])) {
                let idx = PLU.TMP.lis_TF_list.findIndex((k) => k == l[1]);
                if (idx >= 0) {
                  let gb = Number(PLU.getCache("listenTF_keys").split("|")[0]) || 0;
                  PLU.goTaofan(l[1], l[2], l[3], gb, PLU.TMP.lis_TF_force[idx]);
                }
              }
            }
          }
        } else if (msgTxt.match(_("跨服时空", "跨服時空"))) {
          let l = msgTxt.match(_(/跨服：(.*)逃到了跨服时空(.*)之中，青龙会组织悬赏(.*)惩治恶人，众位英雄快来诛杀。/, /跨服：(.*)逃到了跨服時空(.*)之中，青龍會組織懸賞(.*)懲治惡人，眾位英雄快來誅殺。/));
          if (l && l.length > 3) {
            UTIL.log({
              msg: _("【跨服青龙】", "【跨服青龍】") + l[2] + " - " + l[1].padEnd(8) + _("  奖品:", "  獎品:") + l[3],
              type: "KFQL",
              time: new Date().getTime(),
            });
            if (PLU.getCache("listenKFQL") == 1) {
              let keysStr = PLU.getCache("listenKFQL_keys")
                .split("|")[1]
                .split(",")
                .map((e) => (e == "*" ? ".*" : e.replace("*", "\\*")))
                .join("|");
              let reg = new RegExp(keysStr);
              if (PLU.developerMode && l[3].match(reg) && UTIL.inHome()) {
                UTIL.addSysListener("KuaFu", (b, type, subtype, msg) => {
                  if (b.get("map_id") == "kuafu") {
                    UTIL.delSysListener("KuaFu");
                    PLU.goQinglong(l[1], l[2], PLU.getCache("listenKFQL_keys").split("|")[0], true);
                  }
                });
                setTimeout(() => {
                  clickButton("change_server world;");
                }, 500);
              }
            }
          }
        }
        //江湖紛爭
        else if (msgTxt.match(_("江湖纷争", "江湖紛爭"))) {
          let fz = msgTxt.match(
            _(/【江湖纷争】：(.*)(门派|流派)的(.*)剑客伤害同门，欺师灭组，判师而出，却有(.*)坚持此种另有别情而强行庇护，两派纷争在(.*)-(.*)一触即发，江湖同门速速支援！/, /【江湖紛爭】：(.*)(門派|流派)的(.*)劍客傷害同門，欺師滅組，判師而出，卻有(.*)堅持此種另有別情而強行庇護，兩派紛爭在(.*)-(.*)一觸即發，江湖同門速速支援！/),
          );
          if (!fz) return;
          let ro = fz[3];
          let pl = fz[5] + "-" + fz[6];
          let vs = fz[1] + " VS " + fz[4];
          let tp = fz[2];
          let logType = tp == _("门派", "門派") ? "MPFZ" : "LPFZ";
          UTIL.log({
            msg: "【" + tp + _("之争】 ", "之爭】 ") + ro + _("  地点:[", "  地點:[") + pl + "]  " + vs,
            type: logType,
            time: new Date().getTime(),
          });
          let fzlist = PLU.getCache("Fz_list") || "";
          let FZ_day = PLU.getCache("FZ_day") || "";
          if (tp == _("门派", "門派")) {
            let nowTime = new Date().getTime();
            for (let k in PLU.MPFZ) {
              if (k < nowTime) delete PLU.MPFZ[k];
            }
            let extime = new Date().getTime() + 1560000;
            if (fz[1].split('、').includes(PLU.familyData.in) && fz[4].split('、').includes(PLU.familyData.in)) {
              PLU.MPFZ[extime] = { n: ro, p: pl, v: vs, t: new Date().getTime() };
              UTIL.setMem("MPFZ", JSON.stringify(PLU.MPFZ));
            }
            if (!PLU.getCache("autoFZ") || FZ_day == checkDay() || PLU.FzBusy) return
            if (!PLU.fixJhName(fz[1]).split('、').includes(PLU.familyData.in) && !PLU.fixJhName(fz[4]).split('、').includes(PLU.familyData.in)) return
            if (!fzlist.split(',').includes(fz[3])) return
            if (UTIL.inHome()) {
              PLU.setCache("lastAFK_place", "home;");
            } else if (g_obj_map.get("msg_room").get("short") == _("后山茶园", "後山茶園")) {
              PLU.setCache("lastAFK_place", "rank go 232;s;s;s;e;ne;e;ne;ne;diaoyu;");
            } else if (g_obj_map.get("msg_room").get("short") == "桃溪") {
              if (["8137847(1)", "8171749(1)"].includes(PLU.accId)) {
                PLU.setCache("lastAFK_place", "rank go 232;s;s;s;s;s;s;sw;se;sw;se;diaoyu;")
              } else {
                PLU.setCache("lastAFK_place", "rank go 232;s;s;s;s;s;s;diaoyu;");
              }
            } else {
              return
            }
            let mapStr = fz[5],
            npcStr = fz[3];
            if (PLU.fixJhName(fz[1]).split('、').includes(PLU.familyData.in)) {
              switch (npcStr) {
                case _("顾惜朝", "顧惜朝"):
                  npcStr = "戚少商"
                  break
                case _("荆无命", "荊無命"):
                  npcStr = _("阿飞", "阿飛")
                  break
                case _("风际中", "風際中"):
                  npcStr = _("陈近南", "陳近南")
                  break
                case _("杨肃观", "楊肅觀"):
                  npcStr = _("卢云", "盧雲")
                  break
              }
            }
            let jhName = PLU.fixJhName(mapStr);
            if (jhName == "茅山") return
            let jhMap = PLU.YFD.mapsLib.Map.find((e) => e.name == jhName);
            if (!jhMap) {
              return YFUI.writeToOut("<span style='color:#F66;'>---无地图数据---</span>");
            } else {
              PLU.FzBusy = true;
              var ways = jhMap.way.split(";");
              PLU.goFindFZ({
                paths: ways,
                idx: 0,
                objectNPC: npcStr
              });
            }
          } else if (tp == "流派") {
            if (!PLU.getCache("autoFZ") || FZ_day == checkDay() || PLU.FzBusy) return
            if (!PLU.fixJhName(fz[1]).split('、').includes(PLU.familyData.w) && !PLU.fixJhName(fz[4]).split('、').includes(PLU.familyData.w)) return
            if (!fzlist.split(',').includes(fz[3])) return
            if (UTIL.inHome()) {
              PLU.setCache("lastAFK_place", "home;");
            } else if (g_obj_map.get("msg_room").get("short") == _("后山茶园", "後山茶園")) {
              PLU.setCache("lastAFK_place", "rank go 232;s;s;s;e;ne;e;ne;ne;diaoyu;");
            } else if (g_obj_map.get("msg_room").get("short") == "桃溪") {
              if (["8137847(1)", "8171749(1)"].includes(PLU.accId)) {
                PLU.setCache("lastAFK_place", "rank go 232;s;s;s;s;s;s;sw;se;sw;se;diaoyu;")
              } else {
                PLU.setCache("lastAFK_place", "rank go 232;s;s;s;s;s;s;diaoyu;");
              }
            } else {
              return
            }
            let mapStr = fz[5],
            npcStr = fz[3];
            if (PLU.fixJhName(fz[1]).split('、').includes(PLU.familyData.w)) {
              switch (npcStr) {
                case _("顾惜朝", "顧惜朝"):
                  npcStr = "戚少商"
                  break
                case _("荆无命", "荊無命"):
                  npcStr = _("阿飞", "阿飛")
                  break
                case _("风际中", "風際中"):
                  npcStr = _("陈近南", "陳近南")
                  break
                case _("杨肃观", "楊肅觀"):
                  npcStr = _("卢云", "盧雲")
                  break
              }
            }
            let jhName = PLU.fixJhName(mapStr);
            if (jhName == "茅山") return
            let jhMap = PLU.YFD.mapsLib.Map.find((e) => e.name == jhName);
            if (!jhMap) {
              return YFUI.writeToOut("<span style='color:#F66;'>---无地图数据---</span>");
            } else {
              PLU.FzBusy = true;
              var ways = jhMap.way.split(";");
              PLU.goFindFZ({
                paths: ways,
                idx: 0,
                objectNPC: npcStr
              });
            }
          }
        }
        //遊俠
        else if (msgTxt.match(_("出来闯盪江湖了", "出來闖盪江湖了"))) {
          let yx = msgTxt.match(_(/【系统】游侠会：听说(.*)出来闯盪江湖了，目前正在前往(.*)的路上/, /【系統】遊俠會：聽說(.*)出來闖盪江湖了，目前正在前往(.*)的路上/));
          if (!yx) return;
          let yn = $.trim(yx[1]);
          let yp = yx[2];
          let yr = "";
          PLU.YFD.youxiaList.forEach((g) => {
            if (g.v.includes(yn)) yr = g.n;
          });
          UTIL.log({
            msg: _("【游侠-", "【遊俠-") + yr + "】 " + yn + _("  地点:[", "  地點:[") + yp + "]  ",
            type: "YX",
            time: new Date().getTime(),
          });
          if (PLU.getCache("listenYX") == 1 && UTIL.inHome()) {
            if (!PLU.TMP.listenYX_list) {
              PLU.TMP.listenYX_list = PLU.getCache("listenYX_keys").split(",");
            }
            if (PLU.TMP.listenYX_list && PLU.TMP.listenYX_list.includes(yn)) {
              let jhName = PLU.fixJhName(yp);
              let jhMap = PLU.YFD.mapsLib.Map.find((e) => e.name == jhName);
              if (!jhMap) return;
              else {
                let ways = jhMap.way.split(";");
                PLU.goFindYouxia({ paths: ways, idx: 0, objectNPC: yn });
              }
            }
          }
        }
        //監聽觀舞
        else if (msgTxt.match(_("各位大侠请知晓了", "各位大俠請知曉了"))) {
          let gw = msgTxt.match(_(/【系统】【醉梦销魂】：各位大侠请知晓了，我醉梦楼的(.*)仙子此刻心情大好，小舞一曲以飨同好。座位有限，请速速前来。/, /【系統】【醉夢銷魂】：各位大俠請知曉了，我醉夢樓的(.*)仙子此刻心情大好，小舞一曲以饗同好。座位有限，請速速前來。/));
          if (!gw) return;
          let lastday = PLU.getCache("dance_day") || "0";
          if (lastday == checkDay()) return;
          if (new Date().getHours() < 6) return;
          let gn = $.trim(gw[1]);
          UTIL.log({
            msg: _("【醉梦楼观舞】", "【醉夢樓觀舞】") + " " + gn,
            type: "gw",
            time: new Date().getTime(),
          });
        }
      });
      //監聽場景
      UTIL.addSysListener("listenRoomInfo", (b, type, subtype, msg) => {
        if (type == "prompt" && msg.indexOf("想要加入你的") >= 0 && PLU.getCache("autoAccept") == 1) {
          PLU.execActions(b.get("cmd1"));
          PLU.execActions("prev;prev");
        }
        if (type == "main_msg" && msg.indexOf(_(`进入了**血战乔阴**副本`, `**血戰喬陰**副本`)) >= 0 && PLU.getCache("autoInK4") && !PLU.dispatchChineseMsg(msg).includes(PLU.dispatchChineseMsg(PLU.nickName))) {
          if (!PLU.getCache("K5_in")) {
            PLU.setCache("K5_in", true);
            PLU.execActions("fb 5");
						UTIL.addSysListener("K5sy", function (b, type, subtype, msg) {
							if (type != "main_msg" || !msg.match(_(/\003href;0;team\003【队伍】\0030\003/, /\003href;0;team\003【隊伍】\0030\003/))) return;
							if (PLU.K5head) return
							var l = msg.match(_(/\003href;0;team\003【队伍】.*href;0;score (.*)\003(.*)\0030\003：(.*)/, /\003href;0;team\003【隊伍】.*href;0;score (.*)\003(.*)\0030\003：(.*)/));
							if (l && l[3] == "ready") {
								PLU.execActions("#10 n");
							} else if (l && l[3].includes("kill")) {
								PLU.execActions(l[3].replace(/\$/g, " "));
							}
						});
          }
        }
        if (type == "jh" && subtype == "info" && b.get("map_id") !== "qiaoyin" && PLU.getCache("autoInK4") && PLU.getCache("K5_in")) {
          PLU.setCache("K5_in", false);
        }
        if (type == "main_msg" && msg.indexOf(_(`进入了**华山村之战**副本`, `進入了**華山村之戰**副本`)) >= 0 && PLU.getCache("autoInK4") && !PLU.dispatchChineseMsg(msg).includes(PLU.dispatchChineseMsg(PLU.nickName))) {
          if (!PLU.getCache("K4_in")) {
            PLU.setCache("K4_in", true);
            PLU.execActions("fb 4");
          }
        }
        if (type == "jh" && subtype == "info" && b.get("map_id") !== "huashancunzhizhan" && PLU.getCache("autoInK4") && PLU.getCache("K4_in")) {
          PLU.setCache("K4_in", false);
        }
        if (type == "notice" && subtype == "notify_fail" && msg.indexOf(_("必须杀完所有的怪物才可以打开宝箱", "必須殺完所有的怪物才可以打開寶箱")) >= 0) {
          PLU.execActions("ak;;ka;;event_1_68529291;");
        }
        if (type == "notice" && msg.indexOf(_("完成子关卡*八戒神殿*获得武林名望值x50", "完成子關卡*八戒神殿*獲得武林名望值x50")) >= 0) {
          var mapNamefb = UTIL.filterMsg(g_obj_map.get("msg_room").get("short"));
          if (mapNamefb.match(/本源之心/)) {
            setTimeout(function () {
              PLU.execActions("home;");
            }, 2500);
          }
        }
        if ((type == "home" && subtype == "index" && PLU.getCache("fb12_broadcast") == 1) || (type == "jh" && subtype == "info" && b.get("short") !== _("幽厄邪宗据点", "幽厄邪宗據點") && PLU.getCache("fb12_broadcast") == 1)) {
          console.log(b);
          PLU.setListen($("#btn_bt_fb12_broadcast"), "fb12_broadcast", 0);
          return
        }
        if (type !== "jh") return;
        if (type == "jh" && subtype == "info" && b.containsKey("short")) {
          PLU.lastSite = UTIL.filterMsg(b.get("short"));
          if (b.containsKey("map_id")) PLU.lastSite_map = UTIL.filterMsg(b.get("map_id"));
        }
        //奇俠加按鈕
        $("#out .out>button.cmd_click3").each((i, e) => {
          if (PLU.YFD.qixiaList.includes(e.innerText)) {
            let snpc = e.outerHTML.match(/clickButton\('look_npc (\w+)'/i);
            if (snpc && snpc.length >= 2) {
              $(e).css({ position: "relative" });
              let $btnAsk = $(
                '<span style="position:absolute;display:inline-block;left:0;top:0;padding:3% 5%;text-align:center;background:#39F;color:#fff;border-radius:3px;font-size:1.2em;">' + _('问', '問') + '<span>',
              );
              let $btnGold = $(
                '<span style="position:absolute;display:inline-block;right:0;bottom:0;padding:3% 5%;text-align:center;background:#F93;color:#fff;border-radius:3px;font-size:1.2em;">金<span>',
              );
              $(e).append($btnAsk);
              $(e).append($btnGold);
              $btnAsk.click((e) => {
                e.stopPropagation();
                PLU.execActions("ask " + snpc[1] + ";");
              });
              $btnGold.click((e) => {
                e.stopPropagation();
                let ename = snpc[1].split("_")[0];
                PLU.execActions("auto_zsjd20_" + ename + ";golook_room");
              });
            }
          }
        });
        if (type == "jh" && subtype == "new_item" && PLU.getCache("autoMijing")) {
          let namesw = PLU.dispatchChineseMsg(b.get("name"));
          let namerq = PLU.getCache("autoMijing_key") || _("*法海,地龙", "*飢影,鐘馗");
          namerq = namerq.split(",");
          for (let ii = 0; ii < namerq.length; ii++) {
            if (namesw.includes(namerq[ii].replace("*", ""))) {
              var roomInfo = g_obj_map.get("msg_room");
              for (var i = 1; i <= roomInfo.size(); i++) {
                if (roomInfo.containsKey("cmd" + i) && UTIL.filterMsg(roomInfo.get("cmd" + i + "_name").replace(/ /g, "")).includes(_("领取", "領取"))) {
                  var receive = roomInfo.get("cmd" + i);
                } else if (roomInfo.containsKey("cmd" + i) && UTIL.filterMsg(roomInfo.get("cmd" + i + "_name").replace(/ /g, "")).includes(_("离开", "離開"))) {
                  var leave = roomInfo.get("cmd" + i);
                } else if (roomInfo.get("cmd" + i + "_name") == undefined) {
                  break
                }
              }
              if (namerq[ii].charAt(0) == "*") PLU.execActions(leave);
              else PLU.execActions(`${receive};${leave};`);
              break
            }
          }
        }
        //監聽入隊靈鷲和塔
        if (type == "jh" && subtype == "info" && PLU.getCache("autoQuitTeam") == 1) {
          let sn = g_obj_map.get("msg_room").get("short");
          if (
            sn.match(_(/灵鹫宫(\D+)层/, /靈鷲宮(\D+)層/)) ||
            sn.match(_(/拱辰楼(\D+)层/, /拱辰樓(\D+)層/)) ||
            sn.match(_(/陈异叔(\D+)层/, /陳異叔(\D+)層/)) ||
            sn.match(_(/无为寺(\D+)层/, /無為寺(\D+)層/)) ||
            sn.match(_(/一品堂(\D+)层/, /一品堂(\D+)層/)) ||
            sn.match(_(/名将堂(\D+)层/, /名將堂(\D+)層/)) ||
            sn.match(_(/魔皇殿(\D+)层/, /魔皇殿(\D+)層/)) ||
            sn.match(_(/藏典塔(\D+)层/, /藏典塔(\D+)層/)) ||
            sn.match(_(/无相楼(\D+)层/, /無相樓(\D+)層/)) ||
            sn.match(_(/葬剑谷(\D+)层/, /葬劍谷(\D+)層/)) ||
            sn.match(_(/霹雳堂(\D+)层/, /霹靂堂(\D+)層/)) ||
            sn.match(_(/铸剑洞(\D+)层/, /鑄劍洞(\D+)層/)) ||
            sn.match(_(/剑楼(\D+)层/, /劍樓(\D+)層/)) ||
            sn.match(_(/红螺寺(\D+)层/, /紅螺寺(\D+)層/)) ||
            sn.match(_(/通天塔(\D+)层/, /通天塔(\D+)層/))
          ) {
            //退出隊伍
            let quitTeamPrevTimeOut = setTimeout(() => {
              UTIL.delSysListener("quitTeamPrev");
            }, 5000);
            UTIL.addSysListener("quitTeamPrev", (b, type, subtype, msg) => {
              if (type == "team" && subtype == "info") {
                UTIL.delSysListener("quitTeamPrev");
                clearTimeout(quitTeamPrevTimeOut);
                clickButton("prev");
              }
            });
            clickButton("team create");
          } else if (sn.match(_(/幽厄邪宗据点/, /幽厄邪宗據點/))) {
            if (UTIL.roomHasNpc(_("幽厄外门弟子", "幽厄外門弟子")) || UTIL.roomHasNpc(_("幽厄外门执事", "幽厄外門執事"))) return
            let quitTeamPrevTimeOut = setTimeout(() => {
              UTIL.delSysListener("quitTeamPrev");
            }, 5000);
            UTIL.addSysListener("quitTeamPrev", (b, type, subtype, msg) => {
              if (type == "team" && subtype == "info") {
                UTIL.delSysListener("quitTeamPrev");
                clearTimeout(quitTeamPrevTimeOut);
                clickButton("prev");
              }
            });
            PLU.execActions("=1000;event_1_14070916;team create;", () => {
              if (UTIL.checkMVP() && PLU.fb12_receiveOn) {
                PLU.fb12_car.shift();
                if (PLU.fb12_car.length >= 1) {
                  PLU.execActions(`team join ${PLU.fb12_car[0]}`);
                  return
                } else if (PLU.fb12_car.length == 0) {
                  UTIL.delSysListener("fb12_reward");
                  PLU.fb12_receiveOn = 0;
                  PLU.setListen($("#btn_bt_autoQuitTeam"), "autoQuitTeam", 0);
                  return
                }
              } else if (!UTIL.checkMVP() && PLU.fb12_receiveOn) {
                PLU.fb12_receiveOn = 0;
                PLU.setListen($("#btn_bt_autoQuitTeam"), "autoQuitTeam", 0);
                return
              }
            });
          }
        }
        //刷新後恢復監聽幫五
        if (type == "jh" && subtype == "info" && PLU.TMP.listenBangFive == undefined) {
          let roomName = UTIL.filterMsg(g_obj_map.get("msg_room").get("short"));
          if (roomName.match(_(/蒙古高原|成吉思汗的金帐/, /蒙古高原|成吉思汗的金帳/))) {
            PLU.inBangFiveEvent();
          } else {
            PLU.TMP.listenBangFive = false;
          }
        }
      });
      // 監聽私聊
      UTIL.addSysListener("key", (b, type, subtype, msg) => {
        if (type != "channel" || subtype != "tell") return;
        if (PLU.fb12_receiveOn == 1 && decodeURI(msg.replace(/#/g, '%')).indexOf("本12：") >= 0) {
          let tet = PLU.dispatchMsg(decodeURI(msg.replace(/#/g, '%')).split('本12：')[1]).split('\n')[0];
          PLU.setCache("autoQuitTeam", 1);
          PLU.fb12_receiveNum++;
          if (UTIL.checkMVP()) {
            PLU.fb12_car.push(tet);
            if (PLU.fb12_receiveNum == 1) {
              PLU.execActions(`team join ${PLU.fb12_car[0]};`)
              UTIL.addSysListener("fb12_reward", function(b, type, subtype, msg) {
                if (type !== "notice") return
                if (PLU.fb12_receiveOn && msg.match(_("你被批准加入", "你被批準加入"))) {
                  PLU.execActions("fb 12;");
                }
              });
              return
            }
          } else {
            PLU.setCache("fb12", tet);
            if (PLU.fb12_receiveNum == 1) {
              PLU.execActions(`team join ${PLU.getCache("fb12")};`)
              UTIL.addSysListener("fb12_reward", function(b, type, subtype, msg) {
                if (type !== "notice") return
                if (PLU.fb12_receiveOn && msg.match(_("你被批准加入", "你被批準加入"))) {
                  PLU.execActions("fb 12;");
                }
              });
              return
            }
          }
        } else if (msg.indexOf(_("队长本12：", "隊長本12：")) >= 0) {
          let tet = PLU.dispatchMsg(msg.split('本12：')[1]).split('\n')[0];
          if (PLU.dispatchMsg(msg.split('本12：')[0]).match(_("你告诉", "你告訴"))) return
          PLU.execActions(`home;team create;team join u${tet};fb 12;event_1_14070916;fb 12;items use obj_cdyxyj;`, () => {
            PLU.setListen($("#btn_bt_fb12_broadcast"), "fb12_broadcast", 1);
            PLU.setListen($("#btn_bt_autoAccept"), "autoAccept", 1);
            PLU.execActions(_(`log?成功开启本12车`, `log?成功開啟本12車`));
          });
        }
      });
      // 監聽閒聊
      UTIL.addSysListener("listenChat", (b, type, subtype, msg) => {
        if (type != "channel" || subtype != "chat") return;
        /** UNICODE 15.0
         * CJK Radicals Supplement 2E80–2EFF
         * CJK Unified Ideographs (Han) 4E00–9FFF
         * CJK Extension A 3400-4DBF
         * CJK Extension B 20000–2A6DF
         * CJK Extension C 2A700–2B739
         * CJK Extension D 2B740–2B81D
         * CJK Extension E 2B820–2CEA1
         * CJK Extension F 2CEB0–2EBE0
         * CJK Extension G 30000–3134A
         * CJK Extension H 31350–323AF
         */
        msg = msg.replace("\f", "");
        let text = msg.match(/^[^：]+：.*?([\u2E80-\u2EFF\u3400-\u4DBF\u4E00-\u9FFF\-，”'!！]+道：.+)\x1B\[2;37;0m/);
        if (text) {
          text = text[1];
          if (text.match(_(/柴绍|李秀宁|大鹳淜洲/, /柴紹|李秀寧|大鸛淜洲/))) {
            /**
             * 李秀寧昨天撿到了我幾十輛銀子
             * 李秀寧鬼鬼祟祟的叫人生疑
             * 李秀寧竟對我橫眉瞪眼的
             * 竟然吃了李秀寧的虧
             * 李秀寧竟敢得罪我
             * 被李秀寧搶走了
             * 李秀寧好大膽
             * 想找李秀寧
             * 藏在了(天龍寺-)?大鸛淜洲
             * 想要一件天羅紫芳衣
             */
            UTIL.log({
              msg: _("【谜题-天命丹】", "【謎題-天命丹】") + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(_(/阴九幽|潜龙|谷底石室/, /陰九幽|潛龍|谷底石室/))) {
            UTIL.log({
              msg: _("【谜题-鬼杀剑】", "【謎題-鬼殺劍】") + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(_(/打坐老僧|牟尼楼|牟尼洞/, /打坐老僧|牟尼樓|牟尼洞/))) {
            UTIL.log({
              msg: _("【谜题-700级读书识字】", "【謎題-700級讀書識字】") + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(_(/本恆禅师|无相堂/, /本恆禪師|無相堂/))) {
            UTIL.log({
              msg: _("【谜题-木棉袈裟】", "【謎題-木棉袈裟】") + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match((/天罗紫芳衣/, /天羅紫芳衣/))) {
            UTIL.log({
              msg: _("【谜题-天命丹】", "【謎題-天命丹】") + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(_(/鬼杀剑|金凤翅盔/, /鬼殺劍|金鳳翅盔/))) {
            UTIL.log({
              msg: _("【谜题-鬼杀剑】", "【謎題-鬼殺劍】") + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/麻布僧衣/)) {
            UTIL.log({
              msg: _("【谜题-700级读书识字】", "【謎題-700級讀書識字】") + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(_(/追风棍|木棉袈裟/, /追風棍|木棉袈裟/))) {
            UTIL.log({
              msg: _("【谜题-木棉袈裟】", "【謎題-木棉袈裟】") + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          }
        }
        let text2 = msg.match(/[^：]+：(.+)\x1B\[2;37;0m/)[1];
        if (PLU.getCache("listenChat") == 1 && text2 != _("哈哈，我也来闯盪江湖啦！", "哈哈，我也來闖盪江湖啦！") && text2 != "哈哈，我去也……") YFUI.writeToOut(msg);
        let text3 = msg.match(/^[^：]+：(.+道)：(.+)\x1B\[2;37;0m/);
        if (text3) var tmp = PLU.queryNpc(text3[1], true);
        else {
          let text3 = msg.match(_(/^[^：]+：(.+)的谜题\x1B\[2;37;0m/, /^[^：]+：(.+)的謎題\x1B\[2;37;0m/));
          if (text3) var tmp = PLU.queryNpc(text3[1] + "道", true);
        }
        if (PLU.getCache("fb12_broadcast") == 1 && decodeURI(msg.replace(/#/g, '%')).indexOf("本12：") >= 0) {
          if (UTIL.inHome()) return PLU.setListen($("#btn_bt_fb12_broadcast"), "fb12_broadcast", 0);
          if (g_obj_map.get("msg_room").get("short") !== _("幽厄邪宗据点", "幽厄邪宗據點")) return PLU.setListen($("#btn_bt_fb12_broadcast"), "fb12_broadcast", 0);
          let uid = PLU.dispatchMsg(decodeURI(msg.replace(/#/g, '%')).split('本12：')[1]).split('\n')[0];
          PLU.execActions(`tell u${uid} 本12:u${PLU.accId};`);
        };
        if (PLU.kakaMode && msg.match("開卡卡")) {
          PLU.execActions("team create;fb 12;", () => {
            PLU.setBtnRed($("#btn_bt_kg_loopKill"), 1);
            PLU.LoopKill = true;
            PLU.loopKillsInterval = setInterval(function() { PLU.loopKills(PLU.getCache("lookKillKeys")) }, 500);
          })
        }
        if (PLU.kakaMode && msg.match("關卡卡")) {
          PLU.setBtnRed($("#btn_bt_kg_loopKill"), 0);
          PLU.LoopKill = false;
          PLU.execActions("home;")
        }
        if (tmp && tmp.length && PLU.getCache("listenPuzzle") == 1) {
          PLU.TMP.autotask = true;
          for (var npc of tmp) {
            PLU.TODO.push({
              type: "func",
              cmds: "execActions",
              param: [
                npc.way,
                (code, name) => {
                  let npcObj = UTIL.findRoomNpc(name, 0, 1);
                  if (npcObj) PLU.execActions("ask " + npcObj.key);
                },
                npc.name_new ?? npc.name_tw ?? npc.name,
              ],
              timeout: new Date().getTime() + 15 * 60 * 1000,
            });
          }
        }
      });
      //監聽練習
      UTIL.addSysListener("listenPractice", (b, type, subtype, msg) => {
        if (type == "practice" && subtype == "stop_practice" && PLU.getCache("autoLX") == 1) {
          let skillId = b.get("sid"),
            lxcmds = "enable " + skillId + ";practice " + skillId;
          if (UTIL.inHome() || PLU.lastSite == "桃溪" || PLU.lastSite == _("后山茶园", "後山茶園") || PLU.lastSite == _("幽厄邪宗据点", "幽厄邪宗據點")) PLU.execActions(lxcmds);
          else
            PLU.TODO.push({
              type: "cmds",
              cmds: lxcmds,
              timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
            });
        } else if (type == "notice" && subtype == "notify_fail" && PLU.dispatchChineseMsg(msg).match(_("练习已经不能提高了", "練習已經不能提高了"))) {
          if (UTIL.inHome() || PLU.lastSite == "桃溪" || PLU.lastSite == _("后山茶园", "後山茶園") || PLU.lastSite == _("幽厄邪宗据点", "幽厄邪宗據點")) PLU.execActions("eval_PLU.autoLianXi()");
          else
            PLU.TODO.push({
              type: "cmds",
              cmds: "eval_PLU.autoLianXi()",
              timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
            });
        }
      });
      //監聽劍陣
      UTIL.addSysListener("listenJianzhen", (b, type, subtype, msg) => {
        if (type != "notice") return;
        if (msg.indexOf(_("阵升级完毕！", "陣升級完畢！")) < 0) return;
        let msgTxt = UTIL.filterMsg(msg);
        if (msgTxt.match(_(/(.*)阵升级完毕！成功升级到/, /(.*)陣升級完畢！成功升級到/))) {
          setTimeout(() => {
            let jzcmds = "hhjz xiulian go;;;hhjz speedup go;";
            let room = g_obj_map.get("msg_room")?.get("short");
            if (room == _("桃溪", "桃溪") || room == _("后山茶园", "後山茶園") || UTIL.inHome()) PLU.execActions(jzcmds);
            else
              PLU.TODO.push({
                type: "cmds",
                cmds: jzcmds,
                timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
              });
          }, 8000);
        }
      });
      //監聽跟殺
      UTIL.addSysListener("listenFightKill", (b, type, subtype, msg) => {
        if (type != "main_msg" || !msg) return;
        if (msg.indexOf(_("对著", "對著")) < 0) return;
        if (PLU.getCache("followKill") != 1) return;
        let msgTxt = UTIL.filterMsg(msg);
        var matchKill = msgTxt.match(_(/(.*)对著(.*)喝道：「(.*)！今日不是你死就是我活！」/, /(.*)對著(.*)喝道：「(.*)！今日不是你死就是我活！」/));
        if (matchKill && $.trim(matchKill[1]) != "你" && $.trim(matchKill[2]) != "你" && !g_gmain.is_fighting) {
          PLU.toCheckFollowKill($.trim(matchKill[1]), $.trim(matchKill[2]), "kill", msgTxt);
          return;
        }
        var matchFight = msgTxt.match(_(/(.*)对著(.*)说道：(.*)，领教(.*)的高招！/, /(.*)對著(.*)說道：(.*)，領教(.*)的高招！/));
        if (matchFight && $.trim(matchFight[1]) != "你" && $.trim(matchFight[2]) != "你" && !g_gmain.is_fighting) {
          PLU.toCheckFollowKill($.trim(matchFight[1]), $.trim(matchFight[2]), "fight", msgTxt);
          return;
        }
      });
      //test
      UTIL.addSysListener("testListener", (b, type, subtype, msg) => {
        if (type == "g_login" && subtype == "login_ret" && msg == "1") {
          YFUI.writeToOut("<span style='color:#FFF;background:#F00;'>[" + UTIL.getNow() + _("] 断线重连了 </span>", "] 斷線重連了 </span>"));
        }
      });
      UTIL.addSysListener("disconnect", (b, type, subtype, msg) => {
        if (type == "disconnect" && subtype == "change") {
          console.log("%c%s", "color:#F00", ">>>>>>>sock disconnected");
          //sock && sock.close(); sock = 0
          if (PLU.getCache("autoConnect") == 1) {
            let recTime = Number(PLU.getCache("autoConnect_keys"));
            if (recTime) g_gmain.g_delay_connect = recTime;
          }
        }
      });
      unsafeWindow.sock.on("telnet_connected", () => {
        console.log("%c%s", "color:#0F0", ">>>>>>>sock connected");
      });
      UTIL.addSysListener("YXSkillsListener", (b, type, subtype, msg) => {
        if (type != "show_html_page") return;
        if (msg.indexOf(_("须传授技能", "須傳授技能")) < 0) return;
        let list = msg.match(/\x1B\[1;36m(\d+)\/(\d+)[\s\S]{1,200}(fudi juxian up_skill .* 10)/g);
        let outList = null;
        if (list && list.length) {
          outList = list.map((s) => {
            let r = s.match(/\x1B\[1;36m(\d+)\/(\d+)[\s\S]{1,200}(fudi juxian up_skill .* 10)/);
            return { lvl: r[1], max: r[2], cmd: r[3] + "0" };
          });
        }
        PLU.TMP.CUR_YX_SKILLS = outList;
        let matchNameLine = msg.match(/<span class="out2">([\s\S]+)<\/span><span class="out2">/);
        let npcNameLine = matchNameLine ? UTIL.filterMsg(matchNameLine[1]) : "";
        let dg = npcNameLine.match(_(/(\d+)级/, /(\d+)級/))[1];
        PLU.TMP.CUR_YX_LEVEL = Number(dg);
        let nn = msg.match(/fudi juxian upgrade (\S+) 1/)[1];
        PLU.TMP.CUR_YX_ENG = nn;
        let matchNameLine2 = msg.match(/自研技能([\s\S]+)<span class="out3">([\s\S]+?)◆([\s\S]+?) /);
        let skn = matchNameLine2 ? UTIL.filterMsg(matchNameLine2[3]) : "";
        PLU.TMP.CUR_YX_SKN = skn;
      });
      UTIL.addSysListener("masterSkillsListener", (b, type, subtype, msg) => {
        if (type != "master_skills" || subtype != "list") return;
        let masterSkills = PLU.parseSkills(b);

        PLU.TMP.MASTER_ID = b.get("id");
        PLU.TMP.MASTER_SKILLS = masterSkills;
      });
    },
    //================================================================================================
    initTickTime() {
      setInterval(() => {
        let nowDate = new Date();
        let nowTime = nowDate.getTime();
        if (PLU.TODO.length > 0 && !PLU.STATUS.isBusy && UTIL.inHome()) {
          //待辦
          let ctd = PLU.TODO.shift();
          if (nowDate.getTime() < ctd.timeout) {
            if (ctd.type == "cmds") {
              PLU.execActions(ctd.cmds);
            } else if (ctd.type == "func") {
              if (ctd.param) PLU[ctd.cmds](...ctd.param);
              else PLU[ctd.cmds]();
            }
          }
        }
        if ($("#topMonitor").text() != "") $("#topMonitor").empty();
        let bi = 0;
        for (let k in PLU.MPFZ) {
          if (k < nowTime) delete PLU.MPFZ[k];
          else {
            let f = PLU.MPFZ[k];
            let dt = Math.floor((k - nowTime) / 1000);
            let flo = bi % 2 == 1 ? "float:right;text-align:right;" : "";
            $("#topMonitor").append(
              `<div title="${f.v}" style="display:inline-block;width:40%;${flo}">${f.n.substr(0, 1)} <span style="color:#9CF;">[${f.p
              }]</span> <span style="color:#DDD;">${dt}</span></div>`,
            );
            bi++;
          }
        }
        if (checkTime() == "06:02" && PLU.getCache("listenTF_b") && PLU.getCache("listenTF_day") !== checkDay()) {
          PLU.setCache("listenTF_day", checkDay())
          PLU.setListen($("#btn_bt_listenTF"), "listenTF", 1);
        }
        if (PLU.getCache("sort_rcrwsdj_day") !== checkDay()) {
          let tm = checkTime().split(":");
          if (Number(tm[0]) == 6 && Number(tm[1]) >= 20 || Number(tm[0]) >= 7) {
						var yuanbao = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("yuanbao");
						var yuanbao_score = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("yuanbao_score");
            if (Number(yuanbao_score) >= 10) {
              PLU.execActions(`save?sort_rcrwsdj_day?${checkDay()};shop score_buy sc_shop2;items use obj_rcrwsdj_gj;`);
              return
            }
						if (Number(yuanbao) < 100000) {
							PLU.execActions(`save?sort_rcrwsdj_day?${checkDay()};`);
							return
						}
            PLU.execActions(`save?sort_rcrwsdj_day?${checkDay()};shop buy shop1;items use obj_rcrwsdj;`);
          }
        }
        if (PLU.ONOFF["btn_bt_waitCDKill"] && PLU.TMP.DATA_MPFZ) PLU.toCheckAndWaitCDKill(nowTime);
        let sword_day = PLU.getCache("sword_day") || "0";
        if (checkWeek("三") && sword_day !== checkDay()) {
          let tm = checkTime().split(":");
          if (Number(tm[0]) == 6 && Number(tm[1]) >= 20 || Number(tm[0]) >= 7) {
            PLU.setCache("sword_day", checkDay());
            if (UTIL.inHome()) {
              PLU.execActions(`save?sword_day?${checkDay()};swords report go;home;`);
            } else if (g_obj_map.get("msg_room").get("short") == _("后山茶园", "後山茶園") || g_obj_map.get("msg_room").get("short") == "桃溪") {
              let ct = "";
              let path = null;
              PLU.execActions(`save?sword_day?${checkDay()};home;swords report go;team;`);
              UTIL.addSysListener("team", function(b, type, subtype, msg){
                if (type !== "team") return
                UTIL.delSysListener("team");
                if (b.get("is_member_of") == undefined) ct = "team create;";
                if (g_obj_map.get("msg_room").get("short") == _("后山茶园", "後山茶園")) PLU.teaing();
                else if (g_obj_map.get("msg_room").get("short") == "桃溪") PLU.fishing();
              });
            } else {
              PLU.TODO.push({
                type: "cmds",
                cmds: `save?sword_day?${checkDay()};swords report go;home;`,
                timeout: new Date().getTime() + 8 * 60 * 60 * 1000
              });
            }
          }
        }
        let autoSignInTime = PLU.getCache("autoSignInTime");
        let autoSignIn = PLU.getCache("autoSignIn");
        let autoSignInDay = PLU.getCache("autoSignInDay") || "0";
        if (checkTime() == autoSignInTime && autoSignIn == 1 && autoSignInDay !== checkDay()) {
          if (!this.signInMaps) this.initSignInMaps();
					if (!this.rcrenwu) this.initrichangrenwu();
          let checkeds = PLU.getCache("signInArray").split(",");
          PLU.setCache("auto9H", 1);
          PLU.setCache("autoSignInDay", checkDay());
          if (PLU.getCache("autoSignInWeek") && checkWeek(PLU.getCache("autoSignInWeek"))) PLU.sWG = true;
          PLU.execActions("team create;", () => { PLU.goSign(checkeds) });
        }
        let openClan = PLU.getCache("openClan") || 0;
        let openClanDay = PLU.getCache("openClanDay") || "0";
        if (openClan && checkTime() == "06:30" &&  openClanDay !== checkDay()) {
          PLU.setCache("openClanDay", checkDay());
          let openClan_setting = PLU.getCache("openClan_setting");
          let openClan_cmd = "";
          for (let key in openClan_setting) {
            if (!checkWeek(key.charAt(0))) continue
            if (key.substring(2) == _("神兽森林", "神獸森林") && openClan_setting[key]) openClan_cmd += "clan fb open shenshousenlin;";
            if (key.substring(2) == _("大雪满弓刀", "大雪滿弓刀") && openClan_setting[key]) openClan_cmd += "clan fb open daxuemangongdao;";
            if (key.substring(2) == _("龙武炼魔阁", "龍武煉魔閣") && openClan_setting[key]) openClan_cmd += "clan fb open longwulianmoge;";
            if (key.substring(2) == _("可汗金帐一", "可汗金帳一") && openClan_setting[key]) openClan_cmd += "clan fb open_go2 kehanjinzhang;";
            if (key.substring(2) == _("可汗金帐二", "可汗金帳二") && openClan_setting[key]) openClan_cmd += "clan fb open_go2 kehanjinzhang2;";
          }
          PLU.execActions("clan bzmt select go 1;" + openClan_cmd);
        }
      }, 1000);
    },
    //================================================================================================
    toSignIn() {
      if (!this.signInMaps) this.initSignInMaps();
      if (!this.rcrenwu) this.initrichangrenwu();
      let ckeds = PLU.getCache("signInArray")?.split(",") || this.signInMaps.map((e, i) => i);
      let isMVP = UTIL.checkMVP();
      let rank_list = PLU.getCache("rank_list").split(',') || [];
      let itemscheck_list = [];
      let htm = '<div style="display:flex;flex-direction:row;flex-wrap: wrap;justify-content: space-between;width: 100%;align-content: flex-start;line-height:2;">';
      this.signInMaps.forEach((e, i) => {
        if (!e.items) return
        else
          PLU.getAllItems(function (list) {
            var items = list.find(function (it) {
              return !!PLU.dispatchChineseMsg(it.name).match(e.items);
            });
            if (items) itemscheck_list.push(e.items);
          });
      });
      let ck1 = "",
        ck2 = "";
      if (PLU.getCache("dailyQ_stat")) ck1 = " checked" ;
      if (PLU.getCache("afterSign_stat")) ck2 = " checked" ;
      this.signInMaps.forEach((e, i) => {
        if (e.v && !isMVP) return
        if (e.p && isMVP) return
        if (e.rank && !rank_list.includes(e.rank)) return
        if (e.items && !itemscheck_list.includes(e.items)) return
        if (!e.n) htm += '<span style="width:105px;">&nbsp;</span>';
        else
          htm += `<span><button class="signInBtn" data-sid="${i}" style="font-size:12px;padding:1px 2px;cursor:pointer;">GO</button>
            <label data-id="${i}" style="font-size:13px;margin:0 3px 5px 0;">${e.n}<input style="display: inline-block; vertical-align: middle;" type="checkbox" name="signInId" value="${i}"
             ${ckeds.includes(i + "") || e.f ? "checked" : ""} ${e.f ? "disabled" : ""} /></label></span>`;
      });
      htm += '</div><button class="signInAll" style="cursor:pointer;position:absolute;left:15px;bottom:10px;text-align:left;">' + _('全选', '全選') + '</button>';
      htm += '<span><button class="signInBtn" data-sid="W" style="display: inline-block; vertical-align: middle; font-size:12px; padding:1px 2px; cursor:pointer;">GO</button><label> 日常:<input style="display: inline-block; vertical-align: middle;" type="checkbox" id="dailyQ" name="dailyQ" value="1"' + ck1 + '/></label></span>',
      htm += '<span><button class="signInBtn" data-sid="Q" style="display: inline-block; vertical-align: middle; font-size:12px; padding:1px 2px; cursor:pointer;">GO</button><label> 周常:<input style="display: inline-block; vertical-align: middle;" type="checkbox" id="weekQ" name="weekQ" value="1"/></label></span>',
      htm += '<span><label> ' + _('结束后采茶', '結束後採茶') + ':<input style="display: inline-block; vertical-align: middle;" type="checkbox" id="afterSign" name="afterSign" value="1"' + ck2 + '/></label></span>',
      YFUI.showPop({
        title: _("签到", "簽到"),
        text: htm,
        width: "360px",
        okText: _("一键签到", "一鍵簽到"),
        onOk(e) {
          let dailyQ = $("#dailyQ").is(":checked");
          PLU.setCache("dailyQ_stat", dailyQ);
          let weekQ = $("#weekQ").is(":checked");
          if (weekQ) PLU.sWG = true;
          let afterSign = $("#afterSign").is(":checked");
          PLU.setCache("afterSign_stat", afterSign);
          let checkeds = [];
          let checkedsave = [];
          e.find('input[name="signInId"]:checked').each((i, b) => {
            checkeds.push(b.value);
            checkedsave.push(b.value);
          });
          PLU.setCache("auto9H", 1);
          PLU.setCache("signInArray", checkeds.join(","));
          PLU.execActions("team create;", () => { PLU.goSign(checkeds) });
        },
        onNo() { },
        afterOpen($el) {
          $el.find(".signInBtn").click((e) => {
            let btnSid = $(e.currentTarget).attr("data-sid");
            let cjst = [];
            if (btnSid == "W") {
              cjst = cjst.concat(PLU.getCache("signInArrayrc_W").split(","));
              PLU.goSign(cjst, true);
            } else if (btnSid == "Q") {
              cjst = cjst.concat(PLU.getCache("signInArrayrc_Q").split(","));
              PLU.goSign(cjst, true);
            } else {
              PLU.goSign(btnSid);
            }
          });
          $el.find(".signInAll").click((e) => {
            $el.find('input[name="signInId"]').each(function () {
              $(this).prop("checked", true);
            });
          });
        },
      });
    },
    //================================================================================================
    toricrw() {
      var _PLU$getCache2;
      if (!this.rcrenwu) this.initrichangrenwu();
      var ckeds = ((_PLU$getCache2 = PLU.getCache("signInArrayrc")) === null || _PLU$getCache2 === void 0 ? void 0 : _PLU$getCache2.split(",")) || this.rcrenwu.map(function (e, i) {
        return i;
      });
      let isMVP = UTIL.checkMVP();
      var htm = '<div style="display:flex;flex-direction:row;flex-wrap: wrap;justify-content: space-between;width: 100%;align-content: flex-start;line-height:2;">';
      this.rcrenwu.forEach(function (e, i) {
        if (e.v) { if (!isMVP) return}
        if (e.p) { if (isMVP) return}
        if (e.w || e.h) return
        if (!e.n) htm += '<span style="width:105.17px;">&nbsp;</span>'; else htm += '<span><button class="signInBtn" data-sid="'.concat(i, '" style="font-size:12px;padding:1px 2px;cursor:pointer;">GO</button>\n            <label data-id="').concat(i, '" style="font-size:13px;margin:0 3px 5px 0;">').concat(e.n, '<input type="checkbox" name="signInIdW" value="').concat(i, '"\n             ').concat(ckeds.includes(i + "") || e.f ? "checked" : "", " ").concat(e.f ? "disabled" : "", " /></label></span>");
      });

      htm += `<div style="width: 330px; height: 22px; padding: 10px 0;"><span style="display: inline-block; height: 100%; margin-left: 0; font-weight: 700;">洞府日常</span></div>`
      this.rcrenwu.forEach(function (e, i) {
        if (e.v) { if (!isMVP) return}
        if (e.p) { if (isMVP) return}
        if (!e.h) return
        if (!e.n) htm += '<span style="width:105px;">&nbsp;</span>'; else htm += '<span><button class="signInBtn" data-sid="'.concat(i, '" style="font-size:12px;padding:1px 2px;cursor:pointer;">GO</button>\n            <label data-id="').concat(i, '" style="font-size:13px;margin:0 3px 5px 0;">').concat(e.n, '<input type="checkbox" name="signInIdW" value="').concat(i, '"\n             ').concat(ckeds.includes(i + "") || e.f ? "checked" : "", " ").concat(e.f ? "disabled" : "", " /></label></span>");
      });

      htm += `<div style="width: 330px; height: 22px; padding: 10px 0;"><span style="display: inline-block; height: 100%; margin-left: 0; font-weight: 700;">周常${_("任务","任務")}</span></div>`
      this.rcrenwu.forEach(function (e, i) {
        if (e.v) { if (!isMVP) return}
        if (e.p) { if (isMVP) return}
        if (!e.w) return
        if (!e.n) htm += '<span style="width:105px;">&nbsp;</span>'; else htm += '<span><button class="signInBtn" data-sid="'.concat(i, '" style="font-size:12px;padding:1px 2px;cursor:pointer;">GO</button>\n            <label data-id="').concat(i, '" style="font-size:13px;margin:0 3px 5px 0;">').concat(e.n, '<input type="checkbox" name="signInIdQ" value="').concat(i, '"\n             ').concat(ckeds.includes(i + "") || e.f ? "checked" : "", " ").concat(e.f ? "disabled" : "", " /></label></span>");
      });
      
      htm += '</div><button class="signInAll" style="cursor:pointer;position:absolute;left:15px;bottom:10px;">' + _('全选', '全選') + '</button>';
      YFUI.showPop({
        title: _("日常任务", "日常任務"),
        text: htm,
        width: "360px",
        okText: _("设定完成", "設定完成"),
        onOk: function onOk(e) {
          let checkedsW = [];
          e.find('input[name="signInIdW"]:checked').each(function (i, b) {
            checkedsW.push(b.value);
          });
          PLU.setCache("signInArrayrc_W", checkedsW.join(","));
          let checkedsQ = [];
          e.find('input[name="signInIdQ"]:checked').each(function (i, b) {
            checkedsQ.push(b.value);
          });
          PLU.setCache("signInArrayrc_Q", checkedsQ.join(","));
          PLU.setCache("signInArrayrc", checkedsW.concat(checkedsQ).join(","));
        },
        onNo: function onNo() { },
        afterOpen: function afterOpen($el) {
          $el.find(".signInBtn").click(function (e) {
            var btnSid = $(e.currentTarget).attr("data-sid");
            PLU.goSign(btnSid, true);
          });
          $el.find(".signInAll").click(function (e) {
            $el.find('input[name="signInIdW"]').each(function () {
              $(this).prop("checked", true);
            });
          });
          $el.find(".signInAll").click(function (e) {
            $el.find('input[name="signInIdQ"]').each(function () {
              $(this).prop("checked", true);
            });
          });
        }
      });
    },
    //================================================================================================
    autoSwords(callback) {
      UTIL.addSysListener("sword", (b, type, subtype, msg) => {
        if (type != "notice" || msg.indexOf(_("试剑", "試劍")) == -1) return;
        if (msg.indexOf("5/5") > 0 || !msg.indexOf(_("你今天试剑次数已达限额", "你今天試劍次數已達限額"))) {
          UTIL.delSysListener("sword");
          callback && callback();
        } else PLU.execActions("swords fight_test go");
      });
      PLU.execActions("swords;swords select_member heimuya_dfbb;swords select_member qingcheng_mudaoren;swords select_member tangmen_madam;swords fight_test go");
    },
    //================================================================================================
    autoGetVipReward(callback) {
      let acts = "";
      let vipInfo = g_obj_map.get("msg_vip");
      if (vipInfo.get("get_vip_drops") == 0) acts += "vip drops;";
      if (vipInfo.get("finish_sort") % 1000 < 5) acts += "#5 vip finish_sort;";
      if (vipInfo.get("finish_dig") % 1000 < 10) acts += "#10 vip finish_dig;";
      if (vipInfo.get("finish_diaoyu") % 1000 < 10) acts += "#10 vip finish_diaoyu;";
      if (vipInfo.get("do_task_num") % 1000 < 10) acts += "#10 vip finish_big_task;";
      if (vipInfo.get("family_quest_count") % 1000 < 25) acts += "#25 vip finish_family;";
      if (g_obj_map.get("msg_clan_view") && vipInfo.get("clan_quest_count") % 1000 < 20) acts += "#20 vip finish_clan;";
      if (vipInfo.get("saodang_fb_1")?.split(",")[2] || 0 % 1000 < 2) acts += "#2 vip finish_fb dulongzhai;";
      if (vipInfo.get("saodang_fb_2")?.split(",")[2] || 0 % 1000 < 2) acts += "#2 vip finish_fb junying;";
      if (vipInfo.get("saodang_fb_3")?.split(",")[2] || 0 % 1000 < 2) acts += "#2 vip finish_fb beidou;";
      if (vipInfo.get("saodang_fb_4")?.split(",")[2] || 0 % 1000 < 2) acts += "#2 vip finish_fb youling;";
      if (vipInfo.get("saodang_fb_5")?.split(",")[2] || 0 % 1000 < 1) acts += "vip finish_fb siyu;";
      if (vipInfo.get("saodang_fb_6")?.split(",")[2] || 0 % 1000 < 1) acts += "vip finish_fb changleweiyang;";
      if (vipInfo.get("saodang_fb_7")?.split(",")[2] || 0 % 1000 < 1) acts += "vip finish_fb heishuihuangling;";
      if (vipInfo.get("saodang_fb_8")?.split(",")[2] || 0 % 1000 < 1) acts += "vip finish_fb jiandangfenglingdu;";
      if (vipInfo.get("saodang_fb_9")?.split(",")[2] || 0 % 1000 < 1) acts += "vip finish_fb tianshanlongxue;";
      if (vipInfo.get("saodang_fb_10")?.split(",")[2] || 0 % 1000 < 1) acts += "vip finish_fb sizhanguangmingding;";
      acts += "home;";
      PLU.execActions(acts, () => {
        callback && callback();
      });
    },
    autoShaodan(callback) {
      let acts = "";
      let vipInfo = g_obj_map.get("msg_vip");
      let isVip = vipInfo.get("vip_tm") > 0;
      let isMVP = UTIL.checkMVP();
      if (vipInfo.get("saodang_fb_1")?.split(",")[2] || 0 % 1000 < 2) {
        if (isMVP) acts += "#2 vip finish_fb dulongzhai;";
        if (isVip) acts += "#2 vip finish_fb dulongzhai;";
        else
          acts +=
            _("team create;fb 1;;kill?独龙寨土匪;n;;kill?独龙寨土匪;n;;kill?独龙寨土匪;n;;kill?独龙寨土匪;n;;kill?傅一镖;", "team create;fb 1;;kill?獨龍寨土匪;n;;kill?獨龍寨土匪;n;;kill?獨龍寨土匪;n;;kill?獨龍寨土匪;n;;kill?傅一鏢;") +
            _("team create;fb 1;;kill?独龙寨土匪;n;;kill?独龙寨土匪;n;;kill?独龙寨土匪;n;;kill?独龙寨土匪;n;;kill?傅一镖;", "team create;fb 1;;kill?獨龍寨土匪;n;;kill?獨龍寨土匪;n;;kill?獨龍寨土匪;n;;kill?獨龍寨土匪;n;;kill?傅一鏢;");
      }
      if (vipInfo.get("saodang_fb_2")?.split(",")[2] || 0 % 1000 < 2)
        if (isMVP) acts += "#2 vip finish_fb junying;";
        if (isVip) acts += "#2 vip finish_fb junying;";
        else
          acts +=
            _("team create;fb 2;;kill?护卫;;kill?小兵;;kill?小兵;e;n;event_1_48728674;fb 2;e;s;event_1_41361248;fb 2;e;e;;kill?护卫;event_1_43484736;;kill?护卫;@赫造基的尸体;@严廷殷的尸体;", "team create;fb 2;;kill?護衛;;kill?小兵;;kill?小兵;e;n;event_1_48728674;fb 2;e;s;event_1_41361248;fb 2;e;e;;kill?護衛;event_1_43484736;;kill?護衛;@赫造基的屍體;@嚴廷殷的屍體;") +
            _("team create;fb 2;;kill?护卫;;kill?小兵;;kill?小兵;e;n;event_1_48728674;fb 2;e;s;event_1_41361248;fb 2;e;e;;kill?护卫;event_1_43484736;;kill?护卫;", "team create;fb 2;;kill?護衛;;kill?小兵;;kill?小兵;e;n;event_1_48728674;fb 2;e;s;event_1_41361248;fb 2;e;e;;kill?護衛;event_1_43484736;;kill?護衛;");
      if (vipInfo.get("saodang_fb_3")?.split(",")[2] || 0 % 1000 < 2) {
        if (isMVP) acts += "#2 vip finish_fb beidou;";
        if (isVip) acts += "#2 vip finish_fb beidou;";
        else
          acts +=
            _("team create;fb 3;w;;kill?天璇剑客;e;s;;kill?玉衡剑客;n;e;;kill?瑶光剑客;event_1_9777898;;kill?天枢剑客;@天枢剑客的尸体;", "team create;fb 3;w;;kill?天璇劍客;e;s;;kill?玉衡劍客;n;e;;kill?瑤光劍客;event_1_9777898;;kill?天樞劍客;@天樞劍客的屍體;") +
            _("team create;fb 3;w;;kill?天璇剑客;e;s;;kill?玉衡剑客;n;e;;kill?瑶光剑客;event_1_9777898;;kill?天枢剑客;", "team create;fb 3;w;;kill?天璇劍客;e;s;;kill?玉衡劍客;n;e;;kill?瑤光劍客;event_1_9777898;;kill?天樞劍客;");
      }
      if (vipInfo.get("saodang_fb_4")?.split(",")[2] || 0 % 1000 < 2) {
        if (isMVP) acts += "#2 vip finish_fb youling;";
        if (isVip) acts += "#2 vip finish_fb youling;";
        else
          acts +=
            _("team create;fb 4;n;;kill?翻云刀神;n;;kill?织冰女侠;n;;kill?覆雨剑神;n;;kill?排云狂神;n;;kill?九天老祖;", "team create;fb 4;n;;kill?翻雲刀神;n;;kill?織冰女俠;n;;kill?覆雨劍神;n;;kill?排雲狂神;n;;kill?九天老祖;") +
            _("team create;fb 4;n;;kill?翻云刀神;n;;kill?织冰女侠;n;;kill?覆雨剑神;n;;kill?排云狂神;n;;kill?九天老祖;", "team create;fb 4;n;;kill?翻雲刀神;n;;kill?織冰女俠;n;;kill?覆雨劍神;n;;kill?排雲狂神;n;;kill?九天老祖;");
      }
      if (vipInfo.get("saodang_fb_5")?.split(",")[2] || 0 % 1000 < 1) {
        if (isMVP) acts += "#2 vip finish_fb siyu;";
        if (isVip) acts += "vip finish_fb siyu;";
        else
          acts +=
            _("team create;fb 5;event_1_26662342;;kill?勾陈教香主;se;;kill?勾陈教掌教;nw;nw;event_1_15727082;;kill?紫薇教香主;nw;;kill?紫薇教掌教;se;se;event_1_12238479;;kill?长生教香主;sw;;kill?长生教掌教;ne;ne;event_1_889199;;kill?后土教香主;ne;;kill?后土教掌教;sw;sw;;;;;;;event_1_77337496;;kill?后土真人;", "team create;fb 5;event_1_26662342;;kill?勾陳教香主;se;;kill?勾陳教掌教;nw;nw;event_1_15727082;;kill?紫薇教香主;nw;;kill?紫薇教掌教;se;se;event_1_12238479;;kill?長生教香主;sw;;kill?長生教掌教;ne;ne;event_1_889199;;kill?後土教香主;ne;;kill?後土教掌教;sw;sw;;;;;;;event_1_77337496;;kill?後土真人;");
      }
      if (vipInfo.get("saodang_fb_6")?.split(",")[2] || 0 % 1000 < 1) {
        if (isMVP) acts += "#2 vip finish_fb changleweiyang;";
        if (isVip) acts += "vip finish_fb changleweiyang;";
        else
          acts +=
            _("team create;fb 6;event_1_94101353;;kill?黄门丞;event_1_8221898;;kill?少府卿;event_1_18437151;;kill?羽林卫;event_1_74386803;;kill?舞乐令;event_1_39816829;event_1_92691681;event_1_19998221;event_1_62689078;;kill?羽林中郎将;event_1_85127800;;ask changleweiyang_jiangzuodajiang;event_1_39026868;;kill?大司马;s;;kill?未央公主;", "team create;fb 6;event_1_94101353;;kill?黃門丞;event_1_8221898;;kill?少府卿;event_1_18437151;;kill?羽林衛;event_1_74386803;;kill?舞樂令;event_1_39816829;event_1_92691681;event_1_19998221;event_1_62689078;;kill?羽林中郎將;event_1_85127800;;ask changleweiyang_jiangzuodajiang;event_1_39026868;;kill?大司馬;s;;kill?未央公主;");
      }
      if (vipInfo.get("saodang_fb_7")?.split(",")[2] || 0 % 1000 < 1)
        if (isMVP) acts += "#2 vip finish_fb heishuihuangling;";
        if (isVip) acts += "vip finish_fb heishuihuangling;";
        else
          acts +=
            _("team create;fb 7;event_1_20980858;;kill?断龙斧卫;fb 7;event_1_81463220;;kill?金锤力士;fb 7;event_1_5770640;;kill?重甲矛士;fb 7;event_1_56340108;;kill?大夏神箭;event_1_21387224;s;;kill?金锤虎将;event_1_94902320;", "team create;fb 7;event_1_20980858;;kill?斷龍斧衛;fb 7;event_1_81463220;;kill?金錘力士;fb 7;event_1_5770640;;kill?重甲矛士;fb 7;event_1_56340108;;kill?大夏神箭;event_1_21387224;s;;kill?金錘虎將;event_1_94902320;");
      if (vipInfo.get("saodang_fb_8")?.split(",")[2] || 0 % 1000 < 1)
        if (isMVP) acts += "#2 vip finish_fb jiandangfenglingdu;";
        if (isVip) acts += "vip finish_fb jiandangfenglingdu;";
        else
          acts +=
            _("team create;fb 8;n;;kill?夜伤;n;;kill?百里伤;fb 8;e;;kill?夜幽女;e;;kill?千夜女使;fb 8;w;kill?夜杀;w;;kill?烛夜长老;fb 8;s;;kill?夜刺;s;;kill?千夜刺将;event_1_28034211;;kill?风陵总管;event_1_17257217;", "team create;fb 8;n;;kill?夜傷;n;;kill?百裡傷;fb 8;e;;kill?夜幽女;e;;kill?千夜女使;fb 8;w;kill?夜殺;w;;kill?燭夜長老;fb 8;s;;kill?夜刺;s;;kill?千夜刺將;event_1_28034211;;kill?風陵總管;event_1_17257217;");
      if (vipInfo.get("saodang_fb_9")?.split(",")[2] || 0 % 1000 < 1)
        if (isMVP) acts += "#2 vip finish_fb tianshanlongxue;";
        if (isVip) acts += "vip finish_fb tianshanlongxue;";
        else acts += _("team create;fb 9;;kill?剑影;n;;kill?剑浪;n;;kill?剑豹;n;;kill?剑蟒;n;;kill?剑飞;n;;kill?剑神;", "team create;fb 9;;kill?劍影;n;;kill?劍浪;n;;kill?劍豹;n;;kill?劍蟒;n;;kill?劍飛;n;;kill?劍神;");
      if (vipInfo.get("saodang_fb_10")?.split(",")[2] || 0 % 1000 < 1)
        if (isMVP) acts += "#2 vip finish_fb sizhanguangmingding;";
        if (isVip) acts += "vip finish_fb sizhanguangmingding;";
      if (vipInfo.get("saodang_fb_11")?.split(",")[2] || 0 % 1000 < 1)
        if (isMVP) acts += "#2 vip finish_fb bajieshendian;";
        if (isVip) acts += "vip finish_fb bajieshendian;";
      acts += "home;";
      PLU.execActions(acts, () => {
        callback && callback();
      });
    },
    //================================================================================================
    getClanInfo(callback) {
      let openClanTimeout = setTimeout(() => {
        UTIL.delSysListener("listenOpenClan");
        callback && callback(0);
      }, 5000);
      UTIL.addSysListener("listenOpenClan", (b, type, subtype, msg) => {
        if (type == "clan") {
          UTIL.delSysListener("listenOpenClan");
          clearTimeout(openClanTimeout);
          clickButton("prev");
          //console.log(g_obj_map.get("msg_clan_view"))
          callback && callback(1);
        }
      });
      clickButton("clan");
    },
    getVipInfo(callback) {
      let openVipTimeout = setTimeout(() => {
        UTIL.delSysListener("listenOpenVip");
        callback && callback(0);
      }, 5000);
      UTIL.addSysListener("listenOpenVip", (b, type, subtype, msg) => {
        if (type == "vip") {
          UTIL.delSysListener("listenOpenVip");
          clearTimeout(openVipTimeout);
          clickButton("prev");
          // console.log(g_obj_map.get("msg_vip"))
          callback && callback(1);
        }
      });
      clickButton("vip");
    },
    //================================================================================================
    goSign(param, rcrenwu) {
      if (!param) {
        PLU.dwQ = false;
        return YFUI.writeToOut("<span style='color:#FFF;'>--" + _("结束", "結束") + "--</span>");
      } else if (param.length == 0) {
        let cjst = [];
        if (PLU.getCache("dailyQ_stat") && PLU.getCache("signInArrayrc_W") !== "") cjst = cjst.concat(PLU.getCache("signInArrayrc_W").split(","));
        if (PLU.sWG && PLU.getCache("signInArrayrc_Q") !== "") cjst = cjst.concat(PLU.getCache("signInArrayrc_Q").split(","));
        if (cjst.length > 0 && !PLU.dwQ) {
          PLU.dwQ = true;
          PLU.execActions("home;");
          PLU.goSign(cjst, true);
          return
        }
        PLU.dwQ = false;
        PLU.sWG = false;
        if (PLU.getCache("afterSign_stat")) {
          PLU.execActions("rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s;event_1_38117343;event_1_19342640;");
          UTIL.addSysListener("tea", function (b, type, subtype, msg) {
            if (type !== "notice") return 
            if (msg.match(_("你获得：", "你獲得："))) {
							setTimeout(() => {PLU.execActions("event_1_19342640;")}, 200);
            } else if (msg.match(_("当前采茶次数少于5次", "當前採茶次數少於5次")) || msg.match(_("需要【茶经下卷】达到2000级", "需要【茶經下卷】達到2000級"))) {
              UTIL.delSysListener("tea");
              YFUI.writeToOut("<span style='color:#FFF;'>--" + _("签到结束", "簽到結束") + "--</span>");
              PLU.execActions("home;", PLU.fishing());
            }
          });
          return
        }
        YFUI.writeToOut("<span style='color:#FFF;'>--" + _("签到结束", "簽到結束") + "--</span>");
        return
      }
      if (PLU.getCache("signInArrayrc_W") == undefined || PLU.getCache("signInArrayrc_Q") == undefined) return YFUI.writeToOut("<span style='color:#FFF;'>--" + _("请先完成日常周常设定", "請先完成日常周常設定") + "--</span>");
      if (PLU.getCache("getDT") == undefined || PLU.getCache("getDT") == "") PLU.setCache("getDT", "拱辰13");
      if (PLU.getCache("DTday") == undefined) PLU.setCache("DTday", "");
      let sid = null;
      if (_typeof(param) == "object") {
        sid = param.shift();
      } else {
        sid = param;
        param = null;
      }
      let isMVP = UTIL.checkMVP();
      var signD = (rcrenwu ? PLU.rcrenwu : PLU.signInMaps)[sid];
      if (signD.c != undefined) {
        if (signD.c()) {
          if (signD.fn) {
            signD.fn(function () {
              console.log("fn,c: " + signD.n);
              PLU.goSign(param, rcrenwu);
            });
          } else if (isMVP && signD.goV) {
            PLU.execActions(signD.goV, function () {
              console.log("goV,c: " + signD.n);
              PLU.goSign(param, rcrenwu);
            });
          } else if (signD.go) {
            PLU.execActions(signD.go, function () {
              console.log("go,c: " + signD.n);
              PLU.goSign(param, rcrenwu);
            });
          }
        } else {
          console.log("c: " + signD.n);
          PLU.goSign(param, rcrenwu);
        }
      } else {
        if (signD.fn) {
          signD.fn(function () {
            console.log("fn: " + signD.n);
            PLU.goSign(param, rcrenwu);
          });
        } else if (isMVP && signD.goV) {
          PLU.execActions(signD.goV, function () {
            console.log("goV: " + signD.n);
            PLU.goSign(param, rcrenwu);
          });
        } else if (signD.go) {
          PLU.execActions(signD.go, function () {
            console.log("go: " + signD.n);
            PLU.goSign(param, rcrenwu);
          });
        }
      }
    },
    //================================================================================================
    initSignInMaps() {
      let _this = this;
      this.getVipInfo((b) => {
        _this.getClanInfo((a) => { });
      });
      this.signInMaps = [{
        n: _("扬州签到", "揚州簽到"),
        go: "jh 5;n;w;event_1_3144437;event_1_85439674;e;n;n;w;look_npc yangzhou_yangzhou4;sign7;home;"
      }, {
        n: _("每日礼包", "每日禮包"),
        go: "jh 1;event_1_57222966;event_1_48246976;event_1_85373703;home;fudi houshan fetch;fudi juxian mpay;fudi juxian fetch_zhuguo;home;swords report go;"
      }, {
        n: _("潜龙礼包", "潛龍禮包"),
        go: "jh 1;event_1_16472313;event_1_38436482;w;event_1_26383297;event_1_21318613;#3 w;n;event_1_85166127;s;w;n;event_1_66563556;home;"
      }, {
        n: _("分享奖励", "分享獎勵"),
        go: "share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;share_ok 7;home;"
      }, {
        n: _("南诏投资", "南詔投資"),
        go: "jh 54;#4 nw;#2 w;#4 n;#2 e;n;#2 e;event_1_62143505 go;;;event_1_62143505 get;event_1_63750325 get;home;"
      }, {
        n: _("消费积分", "消費積分"),
        go: "jh 1;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;event_1_29721519;event_1_60133236;home;"
      }, {
        n: "打坐睡床",
        go: "home;exercise stop;exercise;golook_room;sleep_hanyuchuang;fudi shennong fetch;home;"
      }, {
        n: _("买引路蜂", "買引路蜂"),
        go: "shop money_buy mny_shop2_N_10;home;vip;"
      }, {
        n: _("领取工资", "領取工資"),
        go: "home;work click maikuli;work click duancha;work click dalie;work click baobiao;work click maiyi;work click xuncheng;work click datufei;work click dalei;work click kangjijinbin;work click zhidaodiying;work click dantiaoqunmen;work click shenshanxiulian;work click jianmenlipai;work click dubawulin;work click youlijianghu;work click yibangmaoxiang;work click zhengzhanzhongyuan;work click taofamanyi;public_op3;home;"
      }, {
        n: _("爬楼奖励", "爬樓獎勵"),
        go: "home;cangjian get_all;xueyin_shenbinggu blade get_all;xueyin_shenbinggu unarmed get_all;xueyin_shenbinggu throwing get_all;xueyin_shenbinggu spear get_all;xueyin_shenbinggu hammer get_all;xueyin_shenbinggu axe get_all;xueyin_shenbinggu whip get_all;xueyin_shenbinggu stick get_all;xueyin_shenbinggu staff get_all;home;"
      }, {
        n: _("领取矿镐", "領取礦鎬"),
        fn: PLU.DailyOres
      }, {
        n: "天池泡澡",
        fn: PLU.Owen
      }, {
        n: _("抄录经文", "抄錄經文"),
        fn: PLU.buyBookss
      }, {
        n: _("帮会上香", "幫會上香"),
        c: function c() {
          return !!g_obj_map.get("msg_clan_view");
        },
        go: "home;#20 clan incense yx;#20 clan incense jx;#5 clan incense cx;home;"
      }, {
        n: _("会员福利", "會員福利"),
        c: function c() {
          return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("get_vip_drops") == 0;
        },
        go: "vip drops;home;"
      }, {
        n: _("会员暴击", "會員暴擊"),
        c: function c() {
          return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("do_task_num") % 1000 < 10;
        },
        fn: PLU.saodbj
      }, {
        n: _("会员师门", "會員師門"),
        c: function c() {
          return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("family_quest_count") % 1000 < 25;
        },
        fn: PLU.saodsm
      }, {
        n: _("会员帮派", "會員幫派"),
        c: function c() {
          return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_clan_view") && g_obj_map.get("msg_vip").get("clan_quest_count") % 1000 < 20;
        },
        go: "clan buy 103;clan buy 104;items use obj_clan_daodang4;items use obj_clan_daodang6;#20 vip finish_clan;clan fb go_saodang shenshousenlin;clan fb go_saodang longwulianmoge;",
        goV: "#3 clan buy 103;#3 clan buy 104;#3 items use obj_clan_daodang4;#3 items use obj_clan_daodang6;#20 vip finish_clan;#3 clan fb go_saodang shenshousenlin;#3 clan fb go_saodang daxuemangongdao;#3 clan fb go_saodang longwulianmoge;#3 clan fb go_saodang kehanjinzhang2;#3 clan fb go_saodang kehanjinzhang;"
      }, {
        n: _("扫荡副本", "掃盪副本"),
        fn: PLU.autoShaodan
      }, {
        n: _("打小龙人", "打小龍人"),
        fn: PLU.saoxlr
      }, {
        n: _("玄铁采矿", "玄鐵采礦"),
        go: "jh 26;w;w;n;e;e;event_1_18075497;w;w;n;event_1_14435995;home;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;home;"
      }, {
        n: "求教阿不",
        go: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;w;w;event_1_57281457;event_1_10395181;;home;"
      }, {
        n: _("绝情鳄鱼", "絕情鱷魚"),
        go: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n;event_1_97487911;home;"
      }, {
        n: "少林渡劫",
        go: "jh 13;e;s;s;w;w;w;;event_1_38874360;kill shaolin_dufengshenshi;home;"
      }, {
        n: "明教毒魔",
        go: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287;;kill?九幽毒魔;;home;"
      }, {
        n: _("论剑试剑", "論劍試劍"),
        fn: PLU.autoSwords
      }, {
        n: _("唐门冰月", "唐門冰月"),
        fn: PLU.autoBingyue
      }, {
        n: _("华山祭酒", "華山祭酒"),
        fn : PLU.wine
      },{
        n: _("雪亭抽奖", "雪亭抽獎"),
        fn: PLU.choujiang
      },{
        n: _("双儿转盘", "雙兒轉盤"),
        fn: PLU.wheelring
      },{
        n: _("自动爬塔", "自動爬塔"),
        c: function c() {
          return PLU.getCache("DTday") !== checkDay();
        },
        fn: PLU.goDT
      }, {
        n: _("龙辰礼包", "龍辰禮包"),
        fn: PLU.longchen
      },{
        n: _("打试炼塔", "打試煉塔"),
        fn: PLU.longnine
      },{
        n: _("自动答题", "自動答題"),
        fn: PLU.loopAnswerQues
      }, {
        n: _("庆典礼包", "慶典禮包"),
        go: "jh 5;#2 n;e;event_1_4888998;jh 8;w;nw;#4 n;w;event_1_96215258;event_1_47757861;event_1_29261227;event_1_85960573;jh 1;#5 w;n;event_1_4790942;home;"
      }, {
        n: "",
        go: "home;"
      }, {
        n: "",
        go: "home;"
      }, {
        n: "",
        go: "home;"
      }];
    },
    lian(callback) {
      PLU.execActions("event_1_23611724;#2 n;event_1_67918762;event_1_73151334;home;", callback);
    },
    music(callback) {
      let step = 1;
      let musicTimeout = null;
      PLU.execActions("event_1_23611724;#4 w;event_1_91626116;");
      UTIL.addSysListener("music", function (b, type, subtype, msg) {
        if (type != "notice" && type != "main_msg") return;
        console.log(step);
        if (step == 1 && UTIL.filterMsg(msg).match(_("你从演奏中获得感悟", "你從演奏中獲得感悟"))) {
          setTimeout(function () { PLU.execActions("event_1_91626116;") }, 200)
          return
        } else if (step == 2 && UTIL.filterMsg(msg).match(_("你从演奏中获得感悟", "你從演奏中獲得感悟"))) {
          clearTimeout(musicTimeout);
          setTimeout(function () { PLU.execActions("event_1_91585558;") }, 200)
          return
        } else if (UTIL.filterMsg(msg).match(_("每天演奏次数上限为", "每天演奏次數上限為"))) {
          if (step < 2) {
            step++;
            setTimeout(function () { PLU.execActions("event_1_91585558;") }, 200)
            musicTimeout = setTimeout(function() {
              UTIL.delSysListener("music");
              PLU.execActions("home;", callback);
            }, 3000)
            return
          }
          clearTimeout(musicTimeout);
          UTIL.delSysListener("music");
          PLU.execActions("home;", callback);
        }
      });
    },
    dan(callback) {
      PLU.execActions("event_1_23611724;#3 e;event_1_30977903 go 1;");
      UTIL.addSysListener("dan", function (b, type, subtype, msg) {
        if (type != "notice" && type != "main_msg") return;
        if (UTIL.filterMsg(msg).match(_("你背包何首乌不足", "你背包何首烏不足")) || UTIL.filterMsg(msg).match(_("你的背包里没有: 何首乌", "你的背包裡沒有: 何首烏"))) {
          setTimeout(function () { PLU.execActions("event_1_30977903 go 2;") }, 200)
        } else if (UTIL.filterMsg(msg).match(_("你背包两百年何首乌不足", "你背包兩百年何首烏不足")) || UTIL.filterMsg(msg).match(_("你的背包里没有: 两百年何首乌", "你的背包裡沒有: 兩百年何首烏")) || UTIL.filterMsg(msg).match(_("你背包灵晶碎片不足", "你背包靈晶碎片不足")) || UTIL.filterMsg(msg).match(_("五行炼丹术需要达到", "五行煉丹術需要達到"))) {
          UTIL.delSysListener("dan");
          PLU.execActions("home;", callback);
        } else if (UTIL.filterMsg(msg).match(_("你消耗：", "你消耗："))) {
          if (UTIL.filterMsg(msg).match(_("何首乌", "何首烏"))) {
            setTimeout(function () { PLU.execActions("event_1_30977903 go 1;") }, 200)
          } else if (UTIL.filterMsg(msg).match(_("两百年何首乌", "兩百年何首烏"))) {
            setTimeout(function () { PLU.execActions("event_1_30977903 go 2;") }, 200)
          }
        }
      });
    },
    choujiang(callback) {
      PLU.execActions("jh 1;go_choujiang 10;");
      UTIL.addSysListener("listenChoujiang", function (b, type, subtype, msg,) {
        if (type != "notice") return;
        if (msg.indexOf(_("今天的抽奖次数已经用完", "今天的抽獎次數已經用完")) >= 0 ||
        msg.indexOf(_("你身上没有抽奖券", "你身上沒有抽獎券")) >= 0 ||
        msg.indexOf(_("没有足够的抽奖券", "沒有足夠的抽獎券")) >= 0) {
          UTIL.delSysListener("listenChoujiang");
          PLU.execActions("home;", callback);
        } else if (msg.indexOf(_("抽奖10次额外获得", "抽獎10次額外獲得")) >= 0) {
          setTimeout(function () { PLU.execActions("go_choujiang 10;") }, 200)
        }
      });
    },
    wheelring(callback) {//幸運大轉盤
      PLU.execActions("jh 5;n;n;e;event_1_90665830");
      UTIL.addSysListener("wheelring", function (b, type, subtype, msg,) {
        if (type !== "notice") return
        if (msg.indexOf(_("你获得：", "你獲得：")) >= 0) {
          PLU.execActions("event_1_90665830");
        } else if (msg.indexOf(_("每天只可抽奖", "每天隻可抽獎")) >= 0 || msg.indexOf(_("需要：抽奖券", "需要：抽獎券")) >= 0) {
          UTIL.delSysListener("wheelring");
          PLU.execActions("home;", callback);
        }
      });
    },
    longchen(callback) {//龍辰
      PLU.execActions("items info obj_jinyuhufusuipian;");
      var fup = false;
      UTIL.addSysListener("longchen", function (b, type, subtype, msg,) {
        if (type == "items" && subtype == "info" && UTIL.filterMsg(b.get("name")) == "金玉虎符碎片") {
          var hufu_piece = parseInt(b.get("amount")) || 0;
          if (hufu_piece >= 10) {
            hufu_piece = Math.floor(hufu_piece / 10);
            PLU.fastExec("#" + hufu_piece + " event_1_56364978;items info obj_hufu;")
            return
          } else {
            PLU.execActions("items info obj_hufu;");
            return
          }
        } else if (type == "items" && subtype == "info" && UTIL.filterMsg(b.get("name")) == "金玉虎符") {
          PLU.execActions("jh 1;e;#3 n;n;w;event_1_90287255 go 10;event_1_49251725");
        } else if (type == "notice" && msg.indexOf(_("你获得：", "你獲得：")) >= 0) {
          setTimeout(function () { PLU.execActions("event_1_49251725"); }, 200)
        } else if (!fup && type == "notice" && subtype == "notify_fail" && msg.indexOf(_("你的背包里没有这个物品", "你的背包裡沒有這個物品")) >= 0) {
          fup = true;
          PLU.execActions("items info obj_hufu;");
        } else if (fup && type == "notice" && subtype == "notify_fail" && msg.indexOf(_("你的背包里没有这个物品", "你的背包裡沒有這個物品")) >= 0) {
          UTIL.delSysListener("longchen");
          PLU.execActions("home;log?" + _("没有虎符", "沒有虎符"), callback);
        } else if (type == "notice" && subtype == "notify_fail" && msg.indexOf(_("你今天兑换达到上限", "你今天兌換達到上限")) >= 0) {
          UTIL.delSysListener("longchen");
          callback();
        }
      });
    },
    longnine(callback) {//龍九
      if (UTIL.inHome() || g_obj_map.get("msg_room").get("map_id") !== "longshenyiji") {
        var str = "jh 1;e;#3 n;n;w;event_1_90287255 go 10;"
      } else {
        var str = "";
      }
      if (!PLU.FLYUP) {
        PLU.execActions("log?" + _("尚未飞升", "尚未飛升") + ";home;", callback);
      } else {
        let shilianta_setting = PLU.getCache("shilianta_setting") || _("试练9", "試練9");
        if (shilianta_setting.substring(0, 2) == _("试练", "試練")) {
          PLU.execActions(str + "#6 s;#4 w;event_1_70321649;=500;kill longshenyiji_slt9;event_1_18779795;home;", callback);
        } else if (shilianta_setting.substring(0, 2) == _("练气", "練氣")) {
          let scripts = null;
          let po = shilianta_setting.substring(2);
          let pon = Number(po);
          switch (po) {
            case "1":
              scripts = "event_1_54874754"
              break
            case "2":
              scripts = "event_1_65824476"
              break
            case "3":
              scripts = "event_1_45337755"
              break
            case "4":
              scripts = "event_1_68018756"
              break
            case "5":
              scripts = "event_1_19419646"
              break
            case "6":
              scripts = "event_1_22764382"
              break
            case "7":
              scripts = "event_1_70954978"
              break
            case "8":
              scripts = "event_1_17604766"
              break
            case "9":
              scripts = "event_1_568482"
              break
            case "10":
              scripts = "event_1_48029783"
              break
          }
          let t = 0;
          let gof = function(p) {
            if (t >= 10) {
              p--;
              if (p <= 0) {
                PLU.execActions("home;", callback);
                return
              }
              switch (p) {
                case 1:
                  scripts = "event_1_54874754"
                  break
                case 2:
                  scripts = "event_1_65824476"
                  break
                case 3:
                  scripts = "event_1_45337755"
                  break
                case 4:
                  scripts = "event_1_68018756"
                  break
                case 5:
                  scripts = "event_1_19419646"
                  break
                case 6:
                  scripts = "event_1_22764382"
                  break
                case 7:
                  scripts = "event_1_70954978"
                  break
              }
              t = 0;
            }
            PLU.autoFight({
              targetCommand: scripts,
              onFail() {
                PLU.execActions("home;", callback);
              },
              onWin() {
                PLU.execActions("home;", callback);
              },
              onLose() {
                t++;
                gof(p);
              }
            });
          }
          PLU.execActions(str + "#6 s;#5 w;", () => {
            gof(pon);
          })
        } else {
          PLU.execActions("home;", callback);
        }
      }
    },
    loopScriptLian(scripts, times, interval, callback) {
      times--;
      PLU.execActions(scripts, function () {
        if (times <= 0) {
          PLU.STO.loopScTo && clearTimeout(PLU.STO.loopScTo) && delete PLU.STO.loopScTo;
          PLU.execActions("home;", callback);
          return;
        } else {
          PLU.STO.loopScTo = setTimeout(function () {
            PLU.loopScriptLian(scripts, times, interval, callback);
          }, interval * 1000);
        }
      });
    },
    wine(callback) {//祭酒
      PLU.execActions("items info obj_fenjiu;");
      UTIL.addSysListener("wine", function (b, type, subtype, msg,) {
        if (type == "items" && subtype == "info" && UTIL.filterMsg(b.get("name")) == "汾酒") {
          PLU.execActions("jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n;n;event_1_355715;");
        } else if (type == "notice" && subtype == "notify_fail" && msg.match(_("你的背包里没有这个物品", "你的背包裡沒有這個物品")) || (type === "notice" && msg.match(_("你没有：", "你沒有：")))) {
          UTIL.delSysListener("wine");
          PLU.execActions("home;log?" + "汾酒不足", callback);
        } else if (type === "notice" && msg.match(_("你获得：", "你獲得："))) {
          setTimeout(function () { PLU.execActions("event_1_355715;") }, 200);
        } else if (type === "notice" && msg.match("你今天已祭酒！")) {
          UTIL.delSysListener("wine");
          PLU.execActions("home;", callback);
        }
      });
    },
    saoxlr(callback) {//刷小龍人
      PLU.execActions("items get_store /obj/shop/meiguihua;");
      PLU.getAllItems(function (list) {
        var item = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match("玫瑰花");
        });
        if (item) {
          if (item.num < 200) {
            PLU.execActions("#".concat(Math.ceil((200 - item.num) / 100), " shop buy shop29_N_10;jh 2;event_1_69287816;kill snow_xiaolongren"))
          } else {
            PLU.execActions("jh 2;event_1_69287816;kill snow_xiaolongren");
          }
        } else {
          PLU.execActions("#3 shop buy shop29_N_10;jh 2;event_1_69287816;kill snow_xiaolongren");
        }
      });
      UTIL.addSysListener("saoxlr", function (b, type, subtype, msg) {
        if (type !== "jh" && type !== "notice") return
        if (type == "jh" && subtype == "new_item") {
          if (PLU.dispatchChineseMsg(b.get("name")) == _("小龙人的尸体", "小龍人的屍體")) {
            PLU.execActions("kill snow_xiaolongren");
          }
        }
        if (type == "notice" && UTIL.filterMsg(msg).match(_("你今天挑战太多了", "你今天挑戰太多了"))) {
          UTIL.delSysListener("saoxlr");
          PLU.execActions("home", callback);
        } else if (type == "notice" && UTIL.filterMsg(msg).match(_("这儿没有这个人", "這兒沒有這個人"))) {
          UTIL.delSysListener("saoxlr");
          PLU.execActions("home", callback);
        }
      });
    },
    saodsm(callback) {//掃盪VIP師門
      PLU.execActions("items get_store /obj/shop/shimenling;items info obj_shimenling;");
      UTIL.addSysListener("saodsm", function (b, type, subtype, msg) {
        if ((type === "items" && subtype === "info" && UTIL.filterMsg(b.get("name")) === _("师门令", "師門令")) || (type === "notice" && subtype === "notify_fail" && msg.indexOf(_("你的仓库里没有这个物品", "你的倉庫裡沒有這個物品")) === 0)) {
            PLU.execActions("items use obj_shimenling;");
        } else if ((type === "notice" && msg.indexOf(_("使用师门令成功，师门任务次数+", "使用師門令成功，師門任務次數+")) !== -1)) {
          setTimeout(function () {
            PLU.execActions("items use obj_shimenling;");
          }, 200);
        } else if (type == "notice" && subtype == "notify_fail" && msg.indexOf(_("你的背包里没有这个物品", "你的背包裡沒有這個物品")) >= 0) {
          setTimeout(function () {
            PLU.execActions("vip finish_family;");
          }, 200);
        } else if ((type === "notice" && subtype === "notify_fail" && msg.indexOf(_("你目前不能使用师门令", "你目前不能使用師門令")) !== -1)) {
          setTimeout(function () {
            PLU.execActions("vip finish_family;");
          }, 200);
        } else if ((type === "notice" && msg.indexOf(_("本源无上心经残页x1", "本源無上心經殘頁x1")) !== -1)) {
          setTimeout(function () {
            PLU.execActions("vip finish_family;");
          }, 200);
        } else if ((type === "notice" && subtype === "notify_fail" && msg.indexOf(_("今日师门任务已做完。", "今日師門任務已做完。")) !== -1)) {
          UTIL.delSysListener("saodsm");
          PLU.execActions(_("log?完成VIP师门;", "log?完成VIP師門;"), callback);
        }
      });
    },
    saodbjst(callback) {//吃石頭點暴擊
      PLU.execActions("event_1_69809751;event_1_88152825;items info obj_mitiling;");
      UTIL.addSysListener("saodbjst", function (b, type, subtype, msg) {
        if ((type === "items" && subtype === "info" && UTIL.filterMsg(b.get("name")) === _("谜题令", "謎題令"))) {
          PLU.execActions("items use obj_mitiling;");
        } else if ((type === "notice" && msg.indexOf(_("使用谜题令成功，可使用谜题卡次数+", "使用謎題令成功，可使用謎題卡次數+")) !== -1)) {
          setTimeout(function () {
            PLU.execActions("items use obj_mitiling;");
          }, 200);
        } else if ((type === "notice" && subtype === "notify_fail" && msg.indexOf(_("你目前不能使用\x1B[1;32m谜题令", "你目前不能使用\x1B[1;32m謎題令")) !== -1)) {
          setTimeout(function () {
            PLU.execActions("vip buy_task;vip finish_big_task;");
          }, 200);
        } else if ((type === "main_msg" && msg.indexOf(_("恭喜你，额外获得", "恭喜你，額外獲得")) !== -1)) {
          setTimeout(function () {
            PLU.execActions("vip buy_task;vip finish_big_task;");
          }, 200);
        } else if (type == "notice" && subtype == "notify_fail" && msg.indexOf(_("你的背包里没有这个物品", "你的背包裡沒有這個物品")) >= 0) {
          setTimeout(function () {
            PLU.execActions("vip buy_task;vip finish_big_task;");
          }, 200);
        } else if ((type === "notice" && msg.indexOf(_("今日谜题任务已做完。", "今日謎題任務已做完。")) !== -1)) {
          UTIL.delSysListener("saodbjst");
          PLU.execActions(_("log?完成兩次VIP暴击扫荡;", "log?完成兩次VIP暴擊掃盪;"), callback);
        }
      });
    },
    saodbj(callback) {
      let cmd = "";
      PLU.getAllItems(function (list) {
        var item = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("嵇琴阮啸", "嵇琴阮嘯"));
        });
        var eq = list.find(function (it) {
          return it.equipped && (!!PLU.dispatchChineseMsg(it.name).match(_("谪剑仙", "謫劍仙")) || !!PLU.dispatchChineseMsg(it.name).match(_("渔溪柳翁", "漁溪柳翁")));
        });
        if (eq) cmd += `remove ${eq.key};`
        if (item) {
          PLU.getAllItems(function (list) {
            list.forEach(function (t, ti) {
              var items = list[ti].equipped && (!!PLU.dispatchChineseMsg(list[ti].name).match(_("垂钓者", "垂釣者")) || !!PLU.dispatchChineseMsg(list[ti].name).match(_("剑神", "劍神")));
              if (!items) return
              if (items) cmd += `remove ${list[ti].key};` 
            });
            PLU.execActions(`${cmd}wear ${item.key};items get_store /obj/shop/mitiling;items info obj_mitiling;`);
          });
        } else {
          PLU.getAllItems(function (list) {
            list.forEach(function (t, ti) {
              var items = !list[ti].equipped && !!PLU.dispatchChineseMsg(list[ti].name).match(_("隐居贤者", "隱居賢者"));
              if (!items) return
              if (items) cmd += `wear ${list[ti].key};` 
            });
            PLU.execActions(cmd + "items get_store /obj/shop/mitiling;items info obj_mitiling;");
          });
        }
      });
      var ling = false;
      UTIL.addSysListener("saodbj", function (b, type, subtype, msg) {
        if ((type === "items" && subtype === "info" && UTIL.filterMsg(b.get("name")) === _("谜题令", "謎題令"))) {
          PLU.execActions("items use obj_mitiling;");
        } else if ((type === "notice" && msg.indexOf(_("使用谜题令成功，可使用谜题卡次数+", "使用謎題令成功，可使用謎題卡次數+")) !== -1)) {
          ling = true;
          setTimeout(function () {
            PLU.execActions("items use obj_mitiling;");
          }, 200);
        } else if (type == "notice" && subtype == "notify_fail" && msg.indexOf(_("你的背包里没有这个物品", "你的背包裡沒有這個物品")) >= 0) {
          setTimeout(function () {
            PLU.execActions("vip buy_task;vip finish_big_task;");
          }, 200);
        } else if (type == "notice" && subtype == "notify_fail" && msg.indexOf(_("使用立即完成暴击谜题，每天不能超过10次", "使用立即完成暴擊謎題，每天不能超過10次")) >= 0) {
          UTIL.delSysListener("saodbj");
          PLU.execActions("#5 vip finish_task;home;", callback);
        } else if ((type === "notice" && subtype === "notify_fail" && msg.indexOf(_("你目前不能使用\x1B[1;32m谜题令", "你目前不能使用\x1B[1;32m謎題令")) !== -1)) {
          setTimeout(function () {
            PLU.execActions("vip finish_big_task;");
          }, 200);
        } else if ((type === "main_msg" && msg.indexOf(_("恭喜你，额外获得", "恭喜你，額外獲得")) !== -1)) {
          setTimeout(function () {
            PLU.execActions("vip buy_task;vip finish_big_task;");
          }, 200);
        } else if (type === "notice" && msg.indexOf(_("今日谜题任务已做完。", "今日謎題任務已做完。")) !== -1) {
          UTIL.delSysListener("saodbj");
          PLU.execActions("items info obj_myhss");
          UTIL.addSysListener("saodbjstItem", function (b, type, subtype, msg) {
            if (ling && type === "items" && subtype === "info" && UTIL.filterMsg(b.get("name")) === _("谜影回溯石", "謎影回溯石")) {
              UTIL.delSysListener("saodbjstItem");
              PLU.saodbjst(callback);
            } else if (type == "notice" && subtype == "notify_fail" && msg.indexOf(_("你的背包里没有这个物品", "你的背包裡沒有這個物品")) == 0) {
              UTIL.delSysListener("saodbjstItem");
              PLU.execActions(_("log?完成VIP暴击扫荡;", "log?完成VIP暴擊掃盪;"), callback);
            }
          });
        }
      });
    },
    DailyOres(callback) {
      let tbcmd = null;
      let baoset_setting = Number(PLU.getCache("baoset_setting")) || 1;
      if (baoset_setting == 1) {
        var Xpath = "jh 2;#10 n;#2 w;event_1_85264690;#2 w;event_1_37287831;"
      } else if (baoset_setting == 2) {
        var Xpath = "jh 2;#10 n;#2 w;event_1_85264690;jh 55;e;ne;n;w;n;e;se;n;n;#6 w;n;e;n;w;w;s;w;w;s;w;n;ne;n;n;e;s;e;n;nw;w;n;e;n;w;n;ne;nw;nw;ne;e;e;n;w;ne;event_1_53145897;"
      }
      PLU.getAllItems(function (list) {
        var item1 = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("探宝镐", "探寶鎬"));
        });
        var item2 = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("探宝罗盘", "探寶羅盤"));
        });
        if (item1) {
          tbcmd = "event_1_49475184;";
        } else if (item2) {
          tbcmd = "event_1_29838003;";
        } 
        if (tbcmd && baoset_setting == 1) {
          PLU.inOwen = false;
          PLU.execActions(Xpath + tbcmd, callback);
        } else if (tbcmd && baoset_setting == 2) {
          PLU.inOwen = true;
          PLU.execActions(Xpath + tbcmd, callback);
        } else {
          PLU.inOwen = false;
          PLU.execActions("jh 2;#10 n;#2 w;event_1_85264690;home;", callback);
        }
      });
    },
    Owen(callback) {
      if (PLU.inOwen) {
        PLU.execActions("event_1_16427201")
        setTimeout(()=> {
          if (PLU.lastSite == "天池") {
            UTIL.delSysListener("Owen");
            PLU.inOwen = false;
            callback();
          }
        }, 1000)
      } else {
        PLU.execActions("jh 55;e;ne;n;w;n;e;se;n;n;#6 w;n;e;n;w;w;s;w;w;s;w;n;ne;n;n;e;s;e;n;nw;w;n;e;n;w;n;ne;nw;nw;ne;e;e;n;w;ne;event_1_53145897;event_1_16427201;")
      }
      UTIL.addSysListener("Owen", function (b, type, subtype, msg) {
        if (type !== "notice") return
        if (msg.match("今日浸泡完成") || msg.match(_("今天已下潜过", "今天已下潛過"))) {
          UTIL.delSysListener("Owen");
          PLU.inOwen = false;
          callback();
        }
      });
    },
    buyBookss(callback) {
      PLU.execActions("jh 55;e;ne;n;w;n;e;se;n;n;#3 w;n;n;w;n;e;e;s;s;e;#5 n;event_1_21205386;")
      UTIL.addSysListener("buyBookss", function (b, type, subtype, msg) {
        if (type !== "notice") return
        if (msg.match("每天限制") || msg.match(_("数量不足", "數量不足"))) {
          UTIL.delSysListener("buyBookss");
          PLU.execActions("home;", callback);
        } else if (msg.match(_("你获得：妙法莲华经残页", "你獲得：妙法蓮華經殘頁"))) {
          PLU.execActions("event_1_21205386;")
        }
      });
    },
    buyzl10() {//買斬龍套
      var ybjifen = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("xf_score");
      YFUI.writeToOut("<span style='color:#7FFF00;'>" + _("当前消费积分: ", "當前消費積分: ").concat(ybjifen || "未知", "</span>"));
      YFUI.showPop({
        title: _("买斩龙套", "買斬龍套"),
        text: _("请先确认你有足够的消费积分，购买斩龙套需要49.2W积分，不够请取消。", "請先確認你有足夠的消費積分，購買斬龍套需要49.2W積分，不夠請取消。"),
        onOk: function onOk(val) {
          setTimeout(function () {
            PLU.fastExec("shop xf_buy xf_shop51;shop xf_buy xf_shop52;shop xf_buy xf_shop48;shop xf_buy xf_shop47;shop xf_buy xf_shop46;shop xf_buy xf_shop44;shop xf_buy xf_shop43;moke equip_armor10;moke equip_boots10;moke equip_finger10;moke equip_head10;moke equip_neck10;moke equip_wrists10;moke equip_waist10;");
          }, 400);
        },
        onNo: function onNo() { }
      });
    },
    dhyt11() {//兌換胤天套
      YFUI.showPop({
        title: _("兑换胤天", "兌換胤天"),
        text: _("请先确认你有足够的11阶装备碎片，不够请取消，游四海那里直接兑换5000再来。", "請先確認你有足夠的11階裝備碎片，不夠請取消，遊四海那里直接兌換5000再來。"),
        onOk: function onOk(val) {
          setTimeout(function () {
            PLU.fastExec("items get_store /obj/quest/hat_suipian11;items get_store /obj/quest/waist_suipian11;items get_store /obj/quest/shield_suipian11;items get_store /obj/quest/blade_suipian11;items get_store /obj/quest/sword_suipian11;items get_store /obj/quest/unarmed_suipian11;items get_store /obj/quest/throwing_suipian11;items get_store /obj/quest/staff_suipian11;items get_store /obj/quest/stick_suipian11;items get_store /obj/quest/whip_suipian11;items get_store /obj/quest/axe_suipian11;items get_store /obj/quest/necklace_suipian11;items get_store /obj/quest/hammer_suipian11;items get_store /obj/quest/spear_suipian11;items get_store /obj/quest/wrists_suipian11;items get_store /obj/quest/finger_suipian11;items get_store /obj/quest/boots_suipian11;items get_store /obj/quest/cloth_suipian11;items get_store /obj/quest/armor_suipian11;items get_store /obj/quest/dagger_suipian11;items get_store /obj/quest/surcoat_suipian11;jh 1;e;n;n;w;#40 event_1_58404606;"+
            "jh 3;s;e;n;duihuan_mieshen_go gift1;duihuan_mieshen_go gift10;duihuan_mieshen_go gift2;duihuan_mieshen_go gift3;duihuan_mieshen_go gift4;duihuan_mieshen_go gift5;duihuan_mieshen_go gift7;moke equip_armor11;moke equip_boots11;moke equip_finger11;moke equip_wrists11;moke equip_neck11;moke equip_waist11;moke equip_head11;");
          }, 400);
        },
        onNo: function onNo() { }
      });
    },
    dhht12() {//兌換皇天套
      YFUI.showPop({
        title: _("换12阶装备", "換12階裝備"),
        text: _("请先确认你有足够的12阶装备碎片，不够请取消，游四海那里直接兑换5000再来。", "請先確認你有足夠的12階裝備碎片，不夠請取消，遊四海那里直接兌換5000再來。"),
        onOk: function onOk(val) {
          setTimeout(function () {
            PLU.fastExec("items get_store /obj/shop/dog_liquan;items get_store /obj/quest/hat_suipian12;items get_store /obj/quest/waist_suipian12;items get_store /obj/quest/shield_suipian12;items get_store /obj/quest/blade_suipian12;items get_store /obj/quest/sword_suipian12;items get_store /obj/quest/unarmed_suipian12;items get_store /obj/quest/throwing_suipian12;items get_store /obj/quest/staff_suipian12;items get_store /obj/quest/stick_suipian12;items get_store /obj/quest/whip_suipian12;items get_store /obj/quest/axe_suipian12;items get_store /obj/quest/necklace_suipian12;items get_store /obj/quest/hammer_suipian12;items get_store /obj/quest/spear_suipian12;items get_store /obj/quest/wrists_suipian12;items get_store /obj/quest/finger_suipian12;items get_store /obj/quest/boots_suipian12;items get_store /obj/quest/cloth_suipian12;items get_store /obj/quest/armor_suipian12;items get_store /obj/quest/dagger_suipian12;items get_store /obj/quest/surcoat_suipian12;"+
            "jh 3;s;e;n;duihuan_eq12_go gift1;duihuan_eq12_go gift10;duihuan_eq12_go gift2;duihuan_eq12_go gift3;duihuan_eq12_go gift4;duihuan_eq12_go gift5;duihuan_eq12_go gift7;moke equip_armor12;moke equip_boots12;moke equip_finger12;moke equip_wrists12;moke equip_neck12;moke equip_waist12;moke equip_head12;");
          }, 400);
        },
        onNo: function onNo() { }
      });
    },
    dhbingy() {//兌換冰月材料
      PLU.execActions("reclaim buy;");
      UTIL.addSysListener("dhbingy", function (b, type, subtype, msg) {
        if (type != "show_html_page") return;
        var sp = msg.match(/你有四海商票\[1;32mx(\d+)\[2;37;0m/);
        //YFUI.writeToOut("<span style='color:#7FFF00;'>".concat(sp || "未知", "</span>"));
      });
      YFUI.showPop({
        title: _("兑换冰月材料", "兌換冰月材料"),
        text: _("需要762万四海商票，不够请取消，游四海那里兑换点天神再来。<br>\n    <span>材料需要：700长生石，1400冰月羽。<br>\n    <span>材料足够的请取消，直接打造。", "需要762萬四海商票，不夠請取消，遊四海那里兌換點天神再來。<br>\n    <span>材料需要：700長生石，1400冰月羽。<br>\n    <span>材料足夠的請取消，直接打造。"),
        onOk: function onOk(val) {
          setTimeout(function () {
            PLU.execActions("reclaim buy 10 700;reclaim buy 11 1400;");
          }, 200);
        },
        onNo: function onNo() { }
      });
    },
    dzbingy() {//打造冰月套
      YFUI.showPop({
        title: "打造冰月",
        text: _("请先确认你有冰月材料，不够请取消，点击兑换冰月材料再来。", "請先確認你有冰月材料，不夠請取消，點擊兌換冰月材料再來。"),
        onOk: function onOk(val) {
          setTimeout(function () {
            PLU.fastExec("wear equip_moke_head12;wear equip_moke_waist12;wear equip_moke_neck12;wear equip_moke_wrists12;wear equip_moke_finger12;wear equip_moke_boots12;wear equip_moke_armor12;jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se;by_upgrade 1 equip_moke_waist12;by_upgrade 1 equip_moke_wrists12;by_upgrade 1 equip_moke_neck12;by_upgrade 1 equip_moke_head12;by_upgrade 1 equip_moke_armor12;by_upgrade 1 equip_moke_finger12;wear equip_by_neck12;wear equip_by_wrists12;wear equip_by_waist12;jh 14;w;n;n;n;n;#100 by_upgrade 2 equip_by_waist12;#100 by_upgrade 2 equip_by_wrists12;#100 by_upgrade 2 equip_by_neck12;jh 26;w;w;w;w;w;n;#100 by_upgrade 3 equip_by_waist12;#100 by_upgrade 3 equip_by_wrists12;#100 by_upgrade 3 equip_by_neck12;"+
            "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se;by_upgrade 1 equip_moke_head12;by_upgrade 1 equip_moke_armor12;by_upgrade 1 equip_moke_finger12;by_upgrade 1 equip_moke_boots12;wear equip_by_boots12;wear equip_by_finger12;wear equip_by_armor12;wear equip_by_head12;jh 14;w;n;n;n;n;#100 by_upgrade 2 equip_by_head12;#100 by_upgrade 2 equip_by_armor12;#100 by_upgrade 2 equip_by_finger12;#100 by_upgrade 2 equip_by_boots12;jh 26;w;w;w;w;w;n;#100 by_upgrade 3 equip_by_head12;#100 by_upgrade 3 equip_by_armor12;#100 by_upgrade 3 equip_by_finger12;#100 by_upgrade 3 equip_by_boots12;remove equip_by_boots12;remove equip_by_finger12;remove equip_by_armor12;remove equip_by_head12;remove equip_by_neck12;remove equip_by_waist12;remove equip_by_wrists12;#100 by_upgrade 3 equip_by_surcoat11;#100 by_upgrade 3 equip_by_yupei12;");
          }, 200);
        },
        onNo: function onNo() { }
      });
    },
    dhjians() {//兌換劍神套
      YFUI.showPop({
        title: _("兑换剑神套", "兌換劍神套"),
        text: _("请装备好材料再点确认。", "請裝備好材料再點確認。"),
        onOk: function onOk(val) {
          setTimeout(function () {
            PLU.fastExec("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;items upgrade_13shoushi go 0;items upgrade_13shoushi go 1;items upgrade_13shoushi go 2;items upgrade_13shoushi go 3;items upgrade_13shoushi go 4;items upgrade_13shoushi go 5;items upgrade_13shoushi go 6;home;");
          }, 200);
        },
        onNo: function onNo() { }
      });
    },
    dhchuid() {//兌換垂釣套
      YFUI.showPop({
        title: _("兑换垂钓套", "兌換垂釣套"),
        text: _("请装备好材料再点确认。", "請裝備好材料再點確認。"),
        onOk: function onOk(val) {
          setTimeout(function () {
            PLU.fastExec("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;items upgrade_13shoushi go 7;items upgrade_13shoushi go 8;items upgrade_13shoushi go 9;items upgrade_13shoushi go 10;items upgrade_13shoushi go 11;items upgrade_13shoushi go 12;items upgrade_13shoushi go 13;home;");
          }, 200);
        },
        onNo: function onNo() { }
      });
    },
    dhzxianz() {//兌換賢者套
      YFUI.showPop({
        title: _("兑换贤者套", "兌換賢者套"),
        text: _("请装备好材料再点确认。", "請裝備好材料再點確認。"),
        onOk: function onOk(val) {
          setTimeout(function () {
            PLU.fastExec("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;items upgrade_13shoushi go 14;items upgrade_13shoushi go 15;items upgrade_13shoushi go 16;items upgrade_13shoushi go 17;items upgrade_13shoushi go 18;items upgrade_13shoushi go 19;items upgrade_13shoushi go 20;home;");
          }, 200);
        },
      onNo: function onNo() { }
      });
    },
    fb12_receive($btn) {//本12領獎
      PLU.execActions("fb")
      UTIL.addSysListener("fblist", function(b, type, subtype, msg) {
        if (type !== "fb") return
        UTIL.delSysListener("fblist");
        var fbList = PLU.getMaxFbList(b);
        if (fbList < 12) {
          PLU.execActions(_(`log?请先将进度推进到副本12再来`, `log?請先將進度推進到副本12再來`))
          return
        }
        PLU.fb12_receiveOn = 1;
        PLU.fb12_receiveNum = 0;
        PLU.fb12_car = [];
        let cmsg = encodeURI("本12：" + PLU.accId).replace(/%/g, '#');
        PLU.execActions(`team create;chat ${cmsg};`);
      });
    },
    fb12_broadcast($btn) {//本12相關
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.setListen($btn, "fb12_broadcast", 0);
        return
      }
      if (UTIL.inHome() || g_obj_map.get("msg_room").get("short") !== _("幽厄邪宗据点", "幽厄邪宗據點")) {
        PLU.setListen($btn, "fb12_broadcast", 0);
        PLU.fb12_receive();
        return 
      }
      if (UTIL.roomHasNpc(_("幽厄外门弟子", "幽厄外門弟子")) || UTIL.roomHasNpc(_("幽厄外门执事", "幽厄外門執事"))) {
        PLU.setListen($btn, "fb12_broadcast", 0);
        YFUI.writeToOut(_("请先清理完怪再点开启!", "請先清理完怪再點開啟!"));
        return
      }
      PLU.setListen($btn, "fb12_broadcast", 1);
      PLU.setListen($("#btn_bt_autoAccept"), "autoAccept", 1);
      PLU.execActions(_(`log?成功开启本12车`, `log?成功開啟本12車`));
    },
    initrichangrenwu() {
      var _this = this;
      this.getVipInfo(function (b) {
        _this.getClanInfo(function (a) { });
      });
      this.rcrenwu = [
        //{ n: "副本十一", fn: PLU.killFB11 },
        {
          n: _("四大绝杀", "四大絕殺"),
          go: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;e;n;n;n;n;n;w;w;n;n;n;n;n;n;n;n;vs:event_1_33144912;"
        }, {
          n: "十八木人",
          go: "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;event_1_91914705;e;e;e;vs:event_1_85950082;"
        }, {
          n: _("阎王十殿", "閻王十殿"),
          go: "rank go 223;nw;event_1_42827171;=200;kill yanwangshidian_zhuanlunwang;event_1_45876452;"
        }, {
          n: _("格斗五十", "格鬥五十"),
          fn: PLU.gedou50
        }, {
          n: _("讨天命丹", "討天命丹"),
          fn: PLU.askTianmd
        }, {
          n: _("南诏宝斋", "南詔寶齋"),
          fn: PLU.rongbaoz
        }, {
          n: _("南诏奏乐", "南詔奏樂"),
          w: true,
          fn: PLU.nanzzouy
        }, {
          n: _("南诏问诊", "南詔問診"),
          w: true,
          fn: PLU.nanzwenz
        }, {
          n: _("武庙祭祀", "武廟祭祀"),
          w: true,
          go: "jh 5;n;n;n;n;n;n;w;event_1_69751810;event_1_43899943 go 7;"
        }, {
          n: _("修补长城", "修補長城"),
          w: true,
          go: "rank go 311;s;s;sw;se;se;se;e;se;se;sw;sw;=500;event_1_71928780;"
        }, {
          n: _("西夏灵鹫", "西夏靈鷲"),
          w: true,
          go: "rank go 311;event_1_57364318;=500;ak;;ka;=500;event_1_86741439;"
        }, {
          n: "西夏哈日",
          w: true,
          fn: PLU.goHaRi
        }, {
          n: "西夏九翼",
          w: true,
          fn: PLU.ninewings
        }, {
          n: _("洞府修练", "洞府修練"),
          h: true,
          fn: PLU.lian
        }, {
          n: _("洞府弹琴", "洞府彈琴"),
          h: true,
          fn: PLU.music
        }, {
          n: _("洞府炼丹", "洞府煉丹"),
          h: true,
          fn: PLU.dan
        }, {
          n: "",
          go: "home;"
        },
      ];
    },
    lelup_13sword() {
      let xtext = null;
      let xcmd = null;
      PLU.getAllItems(function (list) {
        var items = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("如意随行剑", "如意隨行劍"));
        });
        var m1 = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("神兵源质", "神兵源質"));
        });
        var m2 = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("天神的紫宝石", "天神的紫寶石"));
        });
        var m3 = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("天神的蓝宝石", "天神的藍寶石"));
        });
        if (items) {
          if (items.name.includes(_("尸狗", "屍狗"))) {
            xtext = _(`检测到 如意 随行 剑【尸狗】，是否前去兑换?(材料需准备好)<br>材料需求如下:<br>3万神兵源质、20万天神紫宝石、20万天神蓝宝石`,`檢測到 如意 隨行 劍【屍狗】，是否前去兌換?(材料需準備好)<br>材料需求如下:<br>3萬神兵源質、20萬天神紫寶石、20萬天神藍寶石`);
            xcmd = "unwield obj_ryxxj1;event_1_30943029 go 2;wield obj_ryxxj2;";
          } else if (items.name.includes("伏矢")) {
            xtext = _(`检测到 如意 随行 剑【伏矢】，是否前去兑换?(材料需准备好)<br>材料需求如下:<br>4万神兵源质、25万天神紫宝石、25万天神蓝宝石`,`檢測到 如意 隨行 劍【伏矢】，是否前去兌換?(材料需準備好)<br>材料需求如下:<br>4萬神兵源質、25萬天神紫寶石、25萬天神藍寶石`);
            xcmd = "unwield obj_ryxxj2;event_1_30943029 go 3;wield obj_ryxxj3;";
          } else if (items.name.includes(_("雀阴", "雀陰"))) {
            xtext = _(`检测到 如意 随行 剑【雀阴】，是否前去兑换?(材料需准备好)<br>材料需求如下:<br>5万神兵源质、30万天神紫宝石、30万天神蓝宝石`,`檢測到 如意 隨行 劍【雀陰】，是否前去兌換?(材料需準備好)<br>材料需求如下:<br>5萬神兵源質、30萬天神紫寶石、30萬天神藍寶石`);
            xcmd = "unwield obj_ryxxj3;event_1_30943029 go 4;wield obj_ryxxj4;";
          } else if (items.name.includes(_("吞贼", "吞賊"))) {
            xtext = _(`检测到 如意 随行 剑【吞贼】，是否前去兑换?(材料需准备好)<br>材料需求如下:<br>6万神兵源质、40万天神紫宝石、40万天神蓝宝石`,`檢測到 如意 隨行 劍【吞賊】，是否前去兌換?(材料需準備好)<br>材料需求如下:<br>6萬神兵源質、40萬天神紫寶石、40萬天神藍寶石`);
            xcmd = "unwield obj_ryxxj4;event_1_30943029 go 5;wield obj_ryxxj5;";
          } else if (items.name.includes( "非毒")) {
            xtext = _(`检测到 如意 随行 剑【非毒】，是否前去兑换?(材料需准备好)<br>材料需求如下:<br>8万神兵源质、60万天神紫宝石、60万天神蓝宝石`,`檢測到 如意 隨行 劍【非毒】，是否前去兌換?(材料需準備好)<br>材料需求如下:<br>8萬神兵源質、60萬天神紫寶石、60萬天神藍寶石`);
            xcmd = "unwield obj_ryxxj5;event_1_30943029 go 6;wield obj_ryxxj6;";
          } else if (items.name.includes(_("除秽", "除穢"))) {
            xtext = _(`检测到 如意 随行 剑【除秽】，是否前去兑换?(材料需准备好)<br>材料需求如下:<br>10万神兵源质、80万天神紫宝石、80万天神蓝宝石`,`檢測到 如意 隨行 劍【除穢】，是否前去兌換?(材料需準備好)<br>材料需求如下:<br>10萬神兵源質、80萬天神紫寶石、80萬天神藍寶石`);
            xcmd = "unwield obj_ryxxj6;event_1_30943029 go 7;wield obj_ryxxj7;";
          } else if (items.name.includes("臭肺")) {
            xtext = _(`检测到 如意 随行 剑【臭肺】，是否前去兑换?(材料需准备好)<br>材料需求如下:<br>15万神兵源质、100万天神紫宝石、100万天神蓝宝石`,`檢測到 如意 隨行 劍【臭肺】，是否前去兌換?(材料需準備好)<br>材料需求如下:<br>15萬神兵源質、100萬天神紫寶石、100萬天神藍寶石`);
            xcmd = "unwield obj_ryxxj7;event_1_30943029 go 8;wield obj_ryxxj8;";
          } else if (items.name.includes("人魂")) {
            xtext = _(`检测到 如意 随行 剑【人魂】，是否前去兑换?(材料需准备好)<br>材料需求如下:<br>20万神兵源质、120万天神紫宝石、120万天神蓝宝石`,`檢測到 如意 隨行 劍【人魂】，是否前去兌換?(材料需準備好)<br>材料需求如下:<br>20萬神兵源質、120萬天神紫寶石、120萬天神藍寶石`);
            xcmd = "unwield obj_ryxxj8;event_1_30943029 go 9;wield obj_ryxxj9;";
          } else if (items.name.includes("地魂")) {
            xtext = _(`检测到 如意 随行 剑【地魂】，是否前去兑换?(材料需准备好)<br>材料需求如下:<br>25万神兵源质、150万天神紫宝石、150万天神蓝宝石`,`檢測到 如意 隨行 劍【地魂】，是否前去兌換?(材料需準備好)<br>材料需求如下:<br>25萬神兵源質、150萬天神紫寶石、150萬天神藍寶石`);
            xcmd = "unwield obj_ryxxj9;event_1_30943029 go 10;wield obj_ryxxj10;";
          } else {
            xtext = _(`检测到 如意 随行 剑，是否前去兑换?(材料需准备好)<br>材料需求如下:<br>2万神兵源质、15万天神紫宝石、15万天神蓝宝石`,`檢測到 如意 隨行 劍，是否前去兌換?(材料需準備好)<br>材料需求如下:<br>2萬神兵源質、15萬天神紫寶石、15萬天神藍寶石`);
            xcmd = "unwield obj_ryxxj;event_1_30943029 go 1;wield obj_ryxxj1;";
          }

        } else {
          xtext = _(`未检测到13级剑，是否前去兑换?(材料需准备好)<br>材料需求如下:<br>12级兵器每样各一件（不能有神兵属性并下掉宝石）<br>2万神兵源质、10万天神紫宝石、10万天神蓝宝石`,`未檢測到13級劍，是否前去兌換?(材料需準備好)<br>材料需求如下:<br>12級兵器每樣各一件（不能有神兵屬性並下掉寶石）<br>1萬神兵源質、10萬天神紫寶石、10萬天神藍寶石`);
          xcmd = "event_1_10278681 go;";
        }
        YFUI.showPop({
          title: _("如意随行剑", "如意隨行劍"),
          text: xtext + _(`<br>目前持有材料:<br>神兵源质：${m1.num}<br>天神紫宝石：${m2.num}<br>天神蓝宝石：${m3.num}`, `<br>目前持有材料:<br>神兵源質：${m1.num}<br>天神紫寶石：${m2.num}<br>天神藍寶石：${m3.num}`),
          onOk: function onOk() {
            PLU.execActions("jh 1;e;n;n;n;n;w;event_1_90287255 go 10;#4 s;#3 w;#4 n;" + xcmd)
          },
          onNo: function onNo() { }
        });
      });
    },
    sansan(ui) {
      if (ui) {
        YFUI.showPop({
          title: _("监听散修", "監聽散修"),
          text: _("点击后停止监听!!", "點擊後停止監聽!!"),
          okText: _("停止监听", "停止監聽"),
          onOk(val) {
            UTIL.delSysListener("sansan");
            clickButton("escape");
            return
          },
        });
        return
      }
      clickButton("golook_room");
      YFUI.showInput({
        title: _("监听散修", "監聽散修"),
        text: _("输入监听血量后，点击要监听的怪!!", "輸入監聽血量後，點擊要監聽的怪!!"),
        value: PLU.getCache("sansan") || "50000",
        onOk(val) {
          PLU.setCache("sansan", val);
          setTimeout((o) => {
            $(document).one("click", (o) => {
              let snpc = $(o.target)
                .closest("button")[0]
                .outerHTML.match(/clickButton\('look_npc (\w+)'/i);
              if (snpc && snpc.length >= 2) {
                PLU.execActions("watch_vs " + snpc[1]);
                PLU.sansan(true);
                let san_int = setInterval(function() {
                  if ((check_time("mm") == "00" || check_time("mm") == "30") && (Number(check_time("ss")) >= 40 && Number(check_time("ss")) < 46)) {
                    UTIL.delSysListener("sansan");
                    clearInterval(san_int);
                    clickButton("escape");
                    if (g_obj_map.get("msg_vs_info").get("vs1_kee1") < g_obj_map.get("msg_vs_info").get("vs2_kee1")) {
                      PLU.execActions("kill " + g_obj_map.get("msg_vs_info").get("vs1_pos1"));
                    } else {
                      PLU.execActions("kill " + g_obj_map.get("msg_vs_info").get("vs2_pos1"));
                    }
                    YFUI.showPop({
                      title: _("监听散修", "監聽散修"),
                      text: _("点击后停止监听!!", "點擊後停止監聽!!"),
                      okText: _("停止监听", "停止監聽"),
                      autoOk: 1,
                      onOk(val) {},
                    });
                    return
                  }
                }, 1000)
                UTIL.addSysListener("sansan", function(b, type, subtype, msg) {
                  if (type !== "vs" && subtype !== "attack") return
                  if (b.get("rid") !== snpc[1]) return
                  if (Number(b.get("kee")) > Number(val)) return
                  UTIL.delSysListener("sansan");
                  clearInterval(san_int);
                  clickButton("escape");
                  PLU.execActions("kill " + snpc[1]);
                  YFUI.showPop({
                    title: _("监听散修", "監聽散修"),
                    text: _("点击后停止监听!!", "點擊後停止監聽!!"),
                    okText: _("停止监听", "停止監聽"),
                    autoOk: 1,
                    onOk(val) {},
                  });
                });
              }
            });
          }, 500);
        },
      });
    },
    go_orion() {
      let htm = _("自动枫林副本<br>使用前请先完成以下设定:<br>[1] 循环杀需加上设定: 枫林<br>[例1] 烛盈,钟馗,枫林<br>[可选] 如队员只想挂着可开启队伍同步功能(队长也需打开同步才有用!)", "自動楓林副本<br>使用前請先完成以下設定:<br>[1] 循環殺需加上設定: 楓林<br>[例1] 燭盈,鐘馗,楓林<br>[可選] 如隊員只想掛著可開啟隊伍同步功能(隊長也需打開同步才有用!)");
      YFUI.showPop({
        title: _("自动枫林", "自動楓林"),
        text: htm,
        okText: _("开始", "開始"),
        onOk(val) {
					PLU.orioN = true;
					PLU.orion();
        },
        onNo() {}
      });
    },
		orion() {
			let boxx = 0;
			let kk = 0;
      let sb = 0;
      let gb = 0;
      let pb = 0;
      let yb = 0;
      let hb = 0;
			PLU.execActions("event_1_94197730;#2 e;");
      var c_box = function(n) {
        switch (PLU.dispatchChineseMsg(n)) {
          case _("白银炼气宝箱", "白銀煉氣寶箱"):
            sb++
            break
          case _("黄金炼气宝箱", "黃金煉氣寶箱"):
            gb++
            break
          case _("铂金炼气宝箱", "鉑金煉氣寶箱"):
            pb++
            break
          case _("曜玉炼气宝箱", "曜玉煉氣寶箱"):
            yb++
            break
          case _("赤璃炼气宝箱", "赤璃煉氣寶箱"):
            hb++
            break
        }
      }
			UTIL.addSysListener("orion", function(b, type, subtype, msg) {
        if (type !== "jh") return
        if (subtype !== "info" && subtype !== "new_item") return
				if (subtype == "new_item" && !boxx) {
          if (b.get("name").includes(_("枫林", "楓林"))) {
						boxx = 1;
						kk++;
						PLU.execActions("=400;#3 n;")
					}
					return
        } else if (subtype == "info" && boxx == 1) {
					for (var i = 1; i <= b.size(); i++) {
						if (b.containsKey("cmd" + i) && UTIL.filterMsg(b.get("cmd" + i + "_name").replace(/ /g, "")).includes(_("宝箱", "寶箱"))) {
              c_box(b.get("cmd" + i + "_name").replace(/ /g, ""));
							var receive1 = b.get("cmd" + i);
							if (receive1) {
								boxx = 2;
								PLU.execActions(`${receive1};=400;#6 s;`);
							}
							break
						}
					}
					return
        } else if (subtype == "info" && boxx == 2) {
					for (var i = 1; i <= b.size(); i++) {
						if (b.containsKey("cmd" + i) && UTIL.filterMsg(b.get("cmd" + i + "_name").replace(/ /g, "")).includes(_("宝箱", "寶箱"))) {
              c_box(b.get("cmd" + i + "_name").replace(/ /g, ""));
							var receive2 = b.get("cmd" + i);
							if (receive2) {
								boxx = 4;
								if (kk >= 5) {
									PLU.orioN = false;
									UTIL.delSysListener("orion");
                    PLU.execActions(`${receive2};=200;#3 n;e;`, () => {
                    PLU.execActions("team chat " + _("获得白银炼气宝箱: ", "獲得白銀煉氣寶箱: ") + sb);
                    PLU.execActions("team chat " + _("获得黄金炼气宝箱: ", "獲得黃金煉氣寶箱: ") + gb);
                    PLU.execActions("team chat " + _("获得铂金炼气宝箱: ", "獲得鉑金煉氣寶箱: ") + pb);
                    PLU.execActions("team chat " + _("获得曜玉炼气宝箱: ", "獲得曜玉煉氣寶箱: ") + yb);
                    PLU.execActions("team chat " + _("获得赤璃炼气宝箱: ", "獲得赤璃煉氣寶箱: ") + hb);
										PLU.orionStep();
									});
									return
								}
								PLU.execActions(`${receive2};=200;#3 n;e;`, () => {
									boxx = 0;
									PLU.execActions("=400;e;")
								});
							}
							break
						}
					}
					return
        }
      });
		},
		orionStep() {
			setTimeout(() => { PLU.execActions("event_1_82484182;event_1_54237209") }, 400);
			//PLU.execActions("event_1_82484182;event_1_54237209");
			UTIL.addSysListener("orion", function(b, type, subtype, msg) {
        if (type !== "notice") return
				if (msg.match(_("你血气不足", "你血氣不足")) || msg.match(_("你今日登梯次数达到", "你今日登梯次數達到"))) {
					UTIL.delSysListener("orion");
				} else if (msg.match(_("你获得", "你獲得"))) {
					setTimeout(() => { PLU.execActions("event_1_54237209") }, 400);
				}
      })
		},
    upKF4w() {
      let xcmd = "";
      PLU.getAllItems(function (list) {
        var items = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("诛邪破厄印", "誅邪破厄印"));
        });
        var ore = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("晶源矿石", "晶源礦石"));
        });
        if (items) {
          if (items.name.includes("九品") && ore.num >= 20) {
            xcmd = "remove obj_zxpey_9;event_1_84164212 go 2;wear obj_zxpey_8";
          } else if (items.name.includes("八品")&& ore.num >= 50) {
            xcmd = "remove obj_zxpey_8;event_1_84164212 go 3;wear obj_zxpey_7";
          } else if (items.name.includes("七品")&& ore.num >= 120) {
            xcmd = "remove obj_zxpey_7;event_1_84164212 go 4;wear obj_zxpey_6";
          } else if (items.name.includes("六品")&& ore.num >= 300) {
            xcmd = "remove obj_zxpey_6;event_1_84164212 go 5;wear obj_zxpey_5";
          } else if (items.name.includes("五品")&& ore.num >= 500) {
            xcmd = "remove obj_zxpey_5;event_1_84164212 go 6;wear obj_zxpey_4";
          } else if (items.name.includes("四品")&& ore.num >= 1000) {
            xcmd = "remove obj_zxpey_4;event_1_84164212 go 7;wear obj_zxpey_3";
          } else if (items.name.includes("三品")&& ore.num >= 2000) {
            xcmd = "remove obj_zxpey_3;event_1_84164212 go 8;wear obj_zxpey_2";
          } else if (items.name.includes("二品")&& ore.num >= 4000) {
            xcmd = "remove obj_zxpey_2;event_1_84164212 go 9;wear obj_zxpey_1";
          } else if (items.name.includes("一品")) {
            xcmd = "remove obj_zxpey_1;event_1_79495741;wear obj_zxpey_sp";
          } else {
						xcmd = "event_1_16965947;event_1_84164212 go 1;wear obj_zxpey_9";
					}
          PLU.execActions(xcmd);
        } else {
          if (ore.num >= 10) xcmd = "event_1_84164212 go 1;wear obj_zxpey_9";
          PLU.execActions(xcmd);
        }
      });
    },
    checkOre() {
      PLU.getAllItems(function (list) {
        var items = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("晶源矿石", "晶源礦石"));
        });
        if (items) PLU.execActions("log?" + _("矿石数量：","礦石數量：") + items.num);
      });
    },
    cK5S() {
      YFUI.showInput({
        title: "一鍵跨五",
        text: _("请输入要刷的轮次并组好队伍!<br>", "請輸入要刷的輪次並組好隊伍!<br>"),
        value: PLU.getCache("getK5") || "2",
        onOk: function onOk(val) {
          if (!$.trim(val)) return;
          var str = $.trim(val);
          PLU.setCache("getK5", str);
          PLU.keepK5 = Number(str);
					PLU.execActions("team");
					UTIL.addSysListener("team", function(b, type, subtype, msg) {
						if (type !== "team") return
						UTIL.delSysListener("team");
						PLU.setCache("K5_st", 1);
						PLU.KuaFu5(true)
						for (i = 1;i <= Number(b.get("member_num"));i++) {
							if (b.get(`member${i}`).split(',')[0].includes(PLU.accId)) {
								var pos = i;
							}
						}
            PLU.setCache("K5_in", true);
						PLU.execActions("fb 5;event_1_16965947", () => {
							PLU.KuaFu5_go(pos);
						});
					});
        },
        onNo: function onNo() { },
      });
    },
    cK4S() {
      YFUI.showInput({
        title: "一鍵跨四",
        text: _("请输入要刷的轮次并组好队伍!<br>如未设定过跨俟相关设定请先手动进副本设定过一次再使用此功能", "請輸入要刷的輪次並組好隊伍!<br>如未設定過跨俟相關設定請先手動進副本設定過一次再使用此功能"),
        value: PLU.getCache("getK4") || "3",
        onOk: function onOk(val) {
          if (!$.trim(val)) return;
          var str = $.trim(val);
          PLU.setCache("getK4", str);
          PLU.keepK4 = Number(str);
					PLU.execActions("team");
					UTIL.addSysListener("team", function(b, type, subtype, msg) {
						if (type !== "team") return
						UTIL.delSysListener("team");
						PLU.setCache("K4_st", 1);
						PLU.KuaFu4(true)
						for (i = 1;i <= Number(b.get("member_num"));i++) {
							if (b.get(`member${i}`).split(',')[0].includes(PLU.accId)) {
								var pos = i;
							}
						}
            PLU.setCache("K4_in", true);
						PLU.execActions("fb 4;event_1_16965947", () => {
							PLU.KuaFu4_go(pos);
						});
					});
        },
        onNo: function onNo() { },
      });
    },
    cK4A() {
      PLU.execActions("kill huashancunzhizhan_jyycsw")
    },
    cK4B() {
      PLU.setCache("K4_st", 1);
      PLU.KuaFu4(true)
      PLU.execActions("kill huashancunzhizhan_jyecsw")
    },
    cK4C() {
      PLU.setCache("K4_st", 1);
      PLU.KuaFu4(true)
      PLU.execActions("kill huashancunzhizhan_jyscsw")
    },
    cK4D() {
      PLU.setCache("K4_st", 1);
      PLU.KuaFu4(true)
      PLU.execActions("#3 n;", () => {
        PLU.KuaFu4_kill()
      })
    },
    cK5B() {
      PLU.setCache("K5_st", 1);
      PLU.KuaFu5(true)
      PLU.execActions("kill huashancunzhizhan_jyecsw")
    },
    cK5C() {
      PLU.setCache("K5_st", 1);
      PLU.KuaFu5(true)
      PLU.execActions("kill huashancunzhizhan_jyscsw")
    },
    KuaFu5(st) {
      if (st) {
        YFUI.showPop({
          title: _("自动跨五", "自動跨五"),
          text: _("自动杀怪挖矿升级到神品后停止", "自動殺怪挖礦升級到神品後停止"),
          okText: _("暂停", "暫停"),
          onOk(val) {
            PLU.setCache("K5_st", 0);
            if (PLU.STATUS.isBusy) PLU.actionStop = true;
          }
        });
        return
      }
      let ck = "";
      let htm = _("自动杀怪挖矿升级到神品后停止", "自動殺怪挖礦升級到神品後停止");
      YFUI.showPop({
        title: _("自动跨四", "自動跨四"),
        text: htm,
        okText: _("开始", "開始"),
        onOk(val) {
          PLU.execActions("team");
          UTIL.addSysListener("team", function(b, type, subtype, msg) {
            if (type !== "team") return
            UTIL.delSysListener("team");
            PLU.setCache("K5_st", 1);
            PLU.KuaFu5(true)
            for (i = 1;i <= Number(b.get("member_num"));i++) {
              if (b.get(`member${i}`).split(',')[0].includes(PLU.accId)) {
                var pos = i;
              }
            }
            PLU.execActions("event_1_16965947", () => {
              PLU.KuaFu5_go(pos);
            });
          });
        },
        onNo() {}
      });
    },
    KuaFu5_go(pos) {
      UTIL.delSysListener("KuaFu5");
      let ore = 0;
      let steps = 1;
      let needOre = 0;
      let xcmd = "";
      let goup = false;
      let def = false;
      let toDef = false;
      let pos1 = "";
      let pos2 = "";
      let pos3 = "";
      let ggo = false;
      let s_path = "n;n;#4 w;";
      let e_path = "#4 e;s;s;";
      let ps = "event_1_84164212";
      switch (pos) {
        case 2:
          pos1 = "s;";
          pos2 = "n;";
          break
        case 3:
          pos1 = "n;";
          pos2 = "s;";
          break
        case 4:
          pos1 = "s;s;";
          pos2 = "n;n;";
          break
        default:
          break
      }
      PLU.getAllItems(function (list) {
        var items = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("诛邪破厄印点化笔", "誅邪破厄印點化筆"));
        });
        if (items) {
          steps = 6;
          PLU.execActions(`event_1_84164212 go 1;event_1_84164212 go 2;event_1_84164212 go 3;event_1_84164212 go 4;event_1_84164212 go 5;wear obj_zxpey_5;${s_path}${pos1}kill huashancunzhizhan_jyscsw;`);
        } else {
          PLU.execActions(`${s_path}${pos1}kill huashancunzhizhan_jyscsw;`);
        }
        UTIL.addSysListener("KuaFu5", function(b, type, subtype, msg) {
          if (type !== "notice") return
          if (!PLU.getCache("K5_st")) return
          if (UTIL.filterMsg(msg).indexOf(_("你获得：晶源矿石", "你獲得：晶源礦石")) >= 0) {
            switch (steps) {
              case 1:
                needOre = 10;
                xcmd = `${ps} go 1;wear obj_zxpey_9;${pos3}`
                break
              case 2:
                needOre = 20;
                xcmd = `remove obj_zxpey_9;${ps} go 2;${pos3}wear obj_zxpey_8;`
                break
              case 3:
                needOre = 50;
                xcmd = `remove obj_zxpey_8;${ps} go 3;${pos3}wear obj_zxpey_7;`
                break
              case 4:
                needOre = 120; 
                xcmd = `remove obj_zxpey_7;${ps} go 4;${pos3}wear obj_zxpey_6;`
                break
              case 5:
                needOre = 300; 
                xcmd = `remove obj_zxpey_6;${ps} go 5;${pos3}wear obj_zxpey_5;`
                break
              case 6:
                needOre = 500;
                xcmd = `remove obj_zxpey_5;${ps} go 6;${pos3}wear obj_zxpey_4;`
                break
              case 7:
                needOre = 1000;
                def = true;
                xcmd = `remove obj_zxpey_4;${ps} go 7;${pos3}wear obj_zxpey_3;`
                break
              case 8:
                needOre = 2000;
                xcmd = `remove obj_zxpey_3;${ps} go 8;${pos3}wear obj_zxpey_2;`
                break
              case 9:
                needOre = 4000; 
                xcmd = `remove obj_zxpey_2;${ps} go 9;${pos3}event_1_79495741;wear obj_zxpey_sp;`
                break
              default:
                break
            }
            PLU.getAllItems(function (list) {
              var items = list.find(function (it) {
                return !!PLU.dispatchChineseMsg(it.name).match(_("晶源矿石", "晶源礦石"));
              });
              if (items) {
                ore = items.num;
              } else {
                ore = 0;
              }
              if (ore >= needOre && !goup) {
                goup = true;
                PLU.execActions(`${pos2}${e_path}${xcmd}`, () => {
                  PLU.getAllItems(function (list) {
                    var wea = list.find(function (it) {
                      return !!PLU.dispatchChineseMsg(it.name).match(_("诛邪破厄印", "誅邪破厄印"));
                    });
                    if (wea && PLU.dispatchChineseMsg(wea.name).match("神品")) {
                      UTIL.delSysListener("KuaFu5");
                      goup = false;
                      PLU.execActions(`#4 n;`, () => {
												PLU.KuaFu5_kill();
											})
                      return
                    }
                    goup = false;
                    steps++;
                    PLU.execActions(`${s_path}${pos1}kill huashancunzhizhan_jyscsw;`);
                  });
                });
              } else {
                PLU.execActions("kill huashancunzhizhan_jyscsw;");
              }
            });
            return
          }
        })
      });
    },
    KuaFu5_kill() {
      UTIL.delSysListener("KuaFu5");
      UTIL.delSysListener("KuaFu5_kill");
      UTIL.delSysListener("K5sy");
      PLU.execActions("n;");
			let cc = 1;
			let cp = "north";
			let cd = "n";
			PLU.K5head = true;
      UTIL.addSysListener("KuaFu5_kill", function(b, type, subtype, msg) {
        if (type !== "jh" && type !== "notice" && type !== "vs") return
        if (type == "vs" && subtype !== "combat_result") return
        if (!PLU.getCache("K5_st")) return
				switch (cc) {
					case 1:
						cd = "team chat ready;#5 n;#3 w;";
						break
					case 2:
						cd = "#3 e;#5 n;";
						break
					case 3:
						cd = "#5 s;#3 e;";
						break
					case 4:
						cd = "#3 w;";
						break
					default:
						break
				}
        if (type == "jh" && subtype == "info" && b.get("map_id") !== "qiaoyin") {
          console.log("離開副本，已停止監聽");
          UTIL.delSysListener("KuaFu5_kill");
					PLU.K5head = false;
					PLU.keepK5--;
					if (PLU.keepK5 > 0) {
						PLU.execActions("team");
						UTIL.addSysListener("team", function(b, type, subtype, msg) {
							if (type !== "team") return
							UTIL.delSysListener("team");
							PLU.setCache("K5_st", 1);
							PLU.setCache("K5_in", true);
							PLU.KuaFu5(true)
							for (i = 1;i <= Number(b.get("member_num"));i++) {
								if (b.get(`member${i}`).split(',')[0].includes(PLU.accId)) {
									var pos = i;
								}
							}
							PLU.execActions("=2000;fb 5;event_1_16965947", () => {
								PLU.KuaFu5_go(pos);
							});
						});
					}
          return
        } else if (type == "jh" && subtype == "info" && b.get("map_id") == "qiaoyin") {
          if (b.get("npc1") == undefined) return
					if (cc == 5) {
						var target = b.get("npc1").split(",")[0];
						PLU.execActions(`team chat kill$${target};kill ${target};`);
						return
					}
          var target = b.get("npc1").split(",")[0];
          PLU.execActions("kill " + target);
        } else if (type == "vs" && subtype == "combat_result") {
          PLU.execActions(cd);
					cc++;
          return
        }
      })
    },
    KuaFu4(st) {
      if (st) {
        YFUI.showPop({
          title: _("自动跨四", "自動跨四"),
          text: _("暂停副本后若要继续请确定角色处于指定位置<br>矿洞二层、矿洞三层 -> 点击杀怪按钮<br>华山村基地 -> 自行兑换完破厄印后点击往上打按钮", "暫停副本後若要繼續請確定角色處於指定位置<br>礦洞二層、礦洞三層 -> 點擊殺怪按鈕<br>華山村基地 -> 自行兌換完破厄印後點擊往上打按鈕"),
          okText: _("暂停", "暫停"),
          onOk(val) {
            PLU.setCache("K4_st", 0);
            if (PLU.STATUS.isBusy) PLU.actionStop = true;
          }
        });
        return
      }
      let ck = "";
      let htm = _("自动跨服副本4<br>使用前请先完成副本相关设定!", "自動跨服副本4<br>使用前請先完成副本相關設定!");
      YFUI.showPop({
        title: _("自动跨四", "自動跨四"),
        text: htm,
        okText: _("开始", "開始"),
        noText: _("设定", "設定"),
        onOk(val) {
          if (PLU.getCache("K4_start") == "" || PLU.getCache("K4_go") == "" || PLU.getCache("K4_end") == "") {
            PLU.execActions(`Log?${_("请先完成跨四副本设定!", "請先完成跨四副本設定!")}`)
            return
          }
          PLU.execActions("team");
          UTIL.addSysListener("team", function(b, type, subtype, msg) {
            if (type !== "team") return
            UTIL.delSysListener("team");
            PLU.setCache("K4_st", 1);
            PLU.KuaFu4(true)
            for (i = 1;i <= Number(b.get("member_num"));i++) {
              if (b.get(`member${i}`).split(',')[0].includes(PLU.accId)) {
                var pos = i;
              }
            }
            PLU.execActions("event_1_16965947", () => {
              PLU.KuaFu4_go(pos);
            });
          });
        },
        onNo() {
          let K4_start = PLU.getCache("K4_start") || _("无纪录", "無紀錄");
          let K4_go = PLU.getCache("K4_go") || _("无纪录", "無紀錄");
          let K4_end = PLU.getCache("K4_end") || _("无纪录", "無紀錄");
          YFUI.showPop({
            title: _("自动跨四设定", "自動跨四設定"),
            text: _(`\<已储存设定\><br>开始层数: ${K4_start}<br>几品进入下一层: ${K4_go}<br>几品结束刷矿石: ${K4_end}<br><br><div><span style="font-size:18px;line-height:2;">开始层数: </span><select id="K4_start" class="select">
                <option value="一层">一层</option>
                <option value="二层">二层</option>
                <option value="三层">三层</option>
              </select></div><div><span style="font-size:18px;line-height:2;">几品进入下一层: </span><select id="K4_go" class="select">
                <option value="二品">二品</option>
                <option value="三品">三品</option>
                <option value="四品">四品</option>
                <option value="五品">五品</option>
                <option value="六品">六品</option>
                <option value="七品">七品</option>
              </select></div><div><span style="font-size:18px;line-height:2;">几品结束刷矿石: </span><select id="K4_end" class="select">
                <option value="神品">神品</option>
                <option value="一品">一品</option>
                <option value="二品">二品</option>
                <option value="三品">三品</option>
                <option value="四品">四品</option>
                <option value="五品">五品</option>
              </select></div>`, 
              `\<已儲存設定\><br>開始層數: ${K4_start}<br>幾品進入下一層: ${K4_go}<br>幾品結束刷礦石: ${K4_end}<br><br><div><span style="font-size:18px;line-height:2;">開始層數: </span><select id="K4_start" class="select">
                <option value="一層">一層</option>
                <option value="二層">二層</option>
                <option value="三層">三層</option>
              </select></div><div><span style="font-size:18px;line-height:2;">幾品進入下一層: </span><select id="K4_go" class="select">
                <option value="二品">二品</option>
                <option value="三品">三品</option>
                <option value="四品">四品</option>
                <option value="五品">五品</option>
                <option value="六品">六品</option>
                <option value="七品">七品</option>
              </select></div><div><span style="font-size:18px;line-height:2;">幾品結束刷礦石: </span><select id="K4_end" class="select">
                <option value="神品">神品</option>
                <option value="二品">二品</option>
                <option value="三品">三品</option>
                <option value="四品">四品</option>
                <option value="五品">五品</option>
              </select></div>`),
            okText: _("设定完成", "設定完成"),
            onOk(val) {
              let K4_start = $("#K4_start").val();
              let K4_go = $("#K4_go").val();
              let K4_end = $("#K4_end").val();
              PLU.setCache("K4_start", K4_start);
              PLU.setCache("K4_go", K4_go);
              PLU.setCache("K4_end", K4_end);
              PLU.KuaFu4();
            },
            onNo() {
              PLU.KuaFu4();
            }
          });
        }
      });
    },
    KuaFu4_kill() {
      UTIL.delSysListener("KuaFu4");
      UTIL.delSysListener("KuaFu4_kill");
      PLU.execActions("n;")
      UTIL.addSysListener("KuaFu4_kill", function(b, type, subtype, msg) {
        if (type !== "jh" && type !== "notice" && type !== "vs") return
        if (type == "vs" && subtype !== "combat_result") return
        if (!PLU.getCache("K4_st")) return
        if (type == "jh" && subtype == "info" && b.get("map_id") !== "huashancunzhizhan") {
          console.log("離開副本，已停止監聽");
          UTIL.delSysListener("KuaFu4_kill");
					PLU.keepK4--;
					if (PLU.keepK4 > 0) {
						PLU.execActions("team");
						UTIL.addSysListener("team", function(b, type, subtype, msg) {
							if (type !== "team") return
							UTIL.delSysListener("team");
							PLU.setCache("K4_st", 1);
							PLU.KuaFu4(true)
							for (i = 1;i <= Number(b.get("member_num"));i++) {
								if (b.get(`member${i}`).split(',')[0].includes(PLU.accId)) {
									var pos = i;
								}
							}
							PLU.execActions("=2000;fb 4;event_1_16965947", () => {
								PLU.KuaFu4_go(pos);
							});
						});
					}
          return
        } else if (type == "jh" && subtype == "info" && b.get("map_id") == "huashancunzhizhan") {
          if (b.get("npc1") == undefined) {
            PLU.execActions("n");
            return
          }
          var target = b.get("npc1").split(",")[0];
          PLU.execActions("kill " + target);
        } else if (type == "vs" && subtype == "combat_result") {
          if (g_obj_map.get("msg_room").get("north") == undefined) return
          PLU.execActions("n");
          return
        }
      })
    },
    KuaFu4_go(pos) {
      UTIL.delSysListener("KuaFu4");
      UTIL.delSysListener("KuaFu4_kill");
      let ore = 0;
      let steps = 1;
      let needOre = 0;
      let xcmd = "";
      let goup = false;
      let def = false;
      let toDef = false;
      let pos1 = "";
      let pos2 = "";
      let pos3 = "";
      let ps1 = "event_1_97471675";
      let ps2 = "event_1_12508004";
      let ps3 = "event_1_60815987";
      let ggo = false;
      let s_path = "";
      let e_path = "";
      let tgt = "";
      let ps = "";
      switch (pos) {
        case 2:
          pos1 = "s;";
          pos2 = "n;";
          ps1 = "event_1_10497940";
          ps2 = "event_1_58839171";
          ps3 = "event_1_49663343";
          break
        case 3:
          pos1 = "n;";
          pos2 = "s;";
          ps1 = "event_1_7734417";
          ps2 = "event_1_7010053";
          ps3 = "event_1_90355553";
          break
        case 4:
          pos1 = "n;n;";
          pos2 = "s;s;";
          ps1 = "s;event_1_7734417";
          ps2 = "event_1_42012959";
          ps3 = "event_1_41681510";
          pos3 = "n;";
          break
        default:
          break
      }
      PLU.getAllItems(function (list) {
        var items = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("诛邪破厄印点化笔", "誅邪破厄印點化筆"));
        });
        let K4_start = PLU.getCache("K4_start");
        let K4_go = PLU.getCache("K4_go");
        let K4_end = PLU.getCache("K4_end");
        switch (K4_start) {
          case _("一层", "一層"):
            s_path = "#2 w;"
            e_path = "#2 e;"
            tgt = "kill huashancunzhizhan_jyycsw"
            ps = ps1
            break
          case _("二层", "二層"):
            s_path = "#4 w;"
            e_path = "#4 e;"
            tgt = "kill huashancunzhizhan_jyecsw;"
            ps = ps2
            break
          case _("三层", "三層"):
            s_path = "#6 w;"
            e_path = "#6 e;"
            tgt = "kill huashancunzhizhan_jyscsw;"
            ps = ps3
            break
          default:
            break
        }
        if (items) {
          steps = 6;
          PLU.execActions(`event_1_84164212 go 1;event_1_84164212 go 2;event_1_84164212 go 3;event_1_84164212 go 4;event_1_84164212 go 5;wear obj_zxpey_5;${s_path}${pos1}${tgt}`);
        } else {
          PLU.execActions(`${s_path}${pos1}${tgt}`);
        }
        UTIL.addSysListener("KuaFu4", function(b, type, subtype, msg) {
          if (type !== "notice") return
          if (!PLU.getCache("K4_st")) return
          if (UTIL.filterMsg(msg).indexOf(_("守卫指挥使被攻击", "守衛指揮使被攻擊")) >= 0) {
            if (g_obj_map.get("msg_attrs").get("zfxp") )
            toDef = true
            return
          }
          if (UTIL.filterMsg(msg).indexOf(_("你获得：晶源矿石", "你獲得：晶源礦石")) >= 0) {
            switch (steps) {
              case 1:
                needOre = 10;
                xcmd = `${ps} go 1;wear obj_zxpey_9;${pos3}`
                break
              case 2:
                needOre = 20;
                xcmd = `remove obj_zxpey_9;${ps} go 2;${pos3}wear obj_zxpey_8;`
                break
              case 3:
                needOre = 50;
                xcmd = `remove obj_zxpey_8;${ps} go 3;${pos3}wear obj_zxpey_7;`
                break
              case 4:
                needOre = 120; 
                xcmd = `remove obj_zxpey_7;${ps} go 4;${pos3}wear obj_zxpey_6;`
                break
              case 5:
                needOre = 300; 
                xcmd = `remove obj_zxpey_6;${ps} go 5;${pos3}wear obj_zxpey_5;`
                break
              case 6:
                needOre = 500;
                xcmd = `remove obj_zxpey_5;${ps} go 6;${pos3}wear obj_zxpey_4;`
                break
              case 7:
                needOre = 1000;
                def = true;
                xcmd = `remove obj_zxpey_4;${ps} go 7;${pos3}wear obj_zxpey_3;`
                break
              case 8:
                needOre = 2000;
                xcmd = `remove obj_zxpey_3;${ps} go 8;${pos3}wear obj_zxpey_2;`
                break
              case 9:
                needOre = 4000; 
                xcmd = `remove obj_zxpey_2;${ps} go 9;${pos3}event_1_79495741;wear obj_zxpey_sp;`
                break
              default:
                break
            }
            PLU.getAllItems(function (list) {
              var items = list.find(function (it) {
                return !!PLU.dispatchChineseMsg(it.name).match(_("晶源矿石", "晶源礦石"));
              });
              if (items) {
                ore = items.num;
              } else {
                ore = 0;
              }
              if (ore >= needOre && !goup) {
                goup = true;
                PLU.execActions(xcmd, () => {
                  PLU.getAllItems(function (list) {
                    var wea = list.find(function (it) {
                      return !!PLU.dispatchChineseMsg(it.name).match(_("诛邪破厄印", "誅邪破厄印"));
                    });
                    if (wea && PLU.dispatchChineseMsg(wea.name).match(K4_go) && !ggo) {
                      ggo = true;
                      switch (K4_start) {
                        case _("一层", "一層"):
                          s_path = "#4 w;"
                          e_path = "#4 e;"
                          tgt = "kill huashancunzhizhan_jyecsw"
                          ps = ps2
                          pos3 = "";
                          break
                        case _("二层", "二層") || _("三层", "三層"):
                          s_path = "#6 w;"
                          e_path = "#6 e;"
                          tgt = "kill huashancunzhizhan_jyscsw;"
                          ps = ps3
                          break
                        default:
                          break
                      }
                      goup = false;
                      steps++;
                      PLU.execActions(`${pos2}#2 w;${pos1}${tgt}`)
                      return
                    }
                    if (wea && PLU.dispatchChineseMsg(wea.name).match(K4_end)) {
                      UTIL.delSysListener("KuaFu4");
                      goup = false;
                      PLU.execActions(`${pos2}${e_path}#3 n;`, () => {
                        PLU.KuaFu4_kill();
                      })
                      return
                    }
                    goup = false;
                    steps++;
                    PLU.execActions(tgt);
                  });
                });
              } else {
                if (toDef && def) {
                  toDef = false
                  PLU.execActions(`${pos2}#6 e;kill huashancunzhizhan_yexz;${s_path}${pos1}${tgt}`)
                  return
                }
                PLU.execActions(tgt);
              }
            });
            return
          }
        })
      });
    },
    ddGo() {
      if (UTIL.inHome())
        PLU.execActions("jh 1;event_1_85373703;event_1_45018293;home");
      else if (g_obj_map.get("msg_room").get("short") == _("后山茶园", "後山茶園"))
        PLU.execActions("jh 1;event_1_85373703;event_1_45018293;home;eval_PLU.teaing()");
      else if (g_obj_map.get("msg_room").get("short") == "桃溪")
        PLU.execActions("jh 1;event_1_85373703;event_1_45018293;home;eval_PLU.fishing()");
      else
        setTimeout(() => {
          PLU.TODO.push({
            type: "cmds",
            cmds: "jh 1;event_1_85373703;event_1_45018293;home",
            timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
          });
        }, 3600000);
    },
    teaing() {
      let ct = "";
      let path = ["rank go 234;#3 s;e;ne;e;ne;ne", "e", "e", "e"];;
      PLU.execActions("team");
      UTIL.addSysListener("team", function(b, type, subtype, msg){
        if (type !== "team") return
        UTIL.delSysListener("team");
        if (b.get("is_member_of") == undefined) ct = "team create;";
        PLU.execActions(ct + path.slice(0, Math.floor(Math.random() * path.length) + 1).join(";") + ";diaoyu;")
      });
    },
    fishing() {
      let ct = "";
      let path = ["rank go 233;#6 s", "sw", "se", "sw", "se;s", "s"];
      PLU.execActions("team");
      UTIL.addSysListener("team", function(b, type, subtype, msg){
        if (type !== "team") return
        UTIL.delSysListener("team");
        if (b.get("is_member_of") == undefined) ct = "team create;";
        if (["8137847(1)", "8171749(1)"].includes(PLU.accId)) {
          PLU.execActions(ct + "rank go 232;#6 s;sw;se;sw;se;eval_PLU.zbchuidiao();diaoyu");
        } else {
          PLU.execActions(ct + path.slice(0, Math.floor(Math.random() * path.length) + 1).join(";") + ";eval_PLU.zbchuidiao();diaoyu")
        }
      });
    },
    nineflower() {
      PLU.execActions("event_1_17623364 pf2;");
      UTIL.addSysListener("nineflower", function(b, type, subtype, msg) {
        if (type !== "notice") return
        if (PLU.dispatchChineseMsg(msg).match(_("成功兑换获得九花玉露丸", "成功兌換獲得九花玉露丸"))) {
          setTimeout(()=> { PLU.execActions("event_1_17623364 pf2;") }, _(200, 10));
        } else if (PLU.dispatchChineseMsg(msg).match(_("数量不足", "數量不足"))) {
          UTIL.delSysListener("nineflower");
          PLU.execActions("home;log?完成");
        }
      });
    },
    ninewings(callback) {
      PLU.getAllItems(function (list) {
        var items = list.find(function (it) {
          return it.equipped && !!PLU.dispatchChineseMsg(it.name).match(_("如意随行剑", "如意隨行劍"));
        });
        if (items) {
          PLU.execActions("rank go 311;s;s;sw;team quit;vs:event_1_21449960;team create;home;", callback)
        } else {
          PLU.execActions("rank go 311;s;s;sw;team quit;log?" + _("自己换脱装备打吧;", "自己換脫裝備打吧;"))
        }
      });
    },
    loopAnswerQues(callback) {
      let setAnswerTimeout = function () {
        PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
        PLU.STO.ansTo = setTimeout(() => {
          UTIL.delSysListener("onAnswerQuestions");
          YFUI.writeToOut("<span style='color:#FFF;'>--" + _("答案超时", "答案超時") + "！--</span>");
        }, 5000);
      };
      UTIL.addSysListener("onAnswerQuestions", function (b, type, subtype, msg) {
        if (type == "notice" && msg.indexOf(_("每日武林知识问答次数已经达到限额", "每日武林知識問答次數已經達到限額")) > -1) {
          UTIL.delSysListener("onAnswerQuestions");
          PLU.execActions("home;")
          if (callback) callback();
          PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
          return;
        }
        if (type != "show_html_page") return;
        var qs = msg.split("\n");
        if (!qs) return;
        if (qs[0].indexOf(_("知识问答第", "知識問答第")) < 0) return;
        setAnswerTimeout();
        var qus = "";
        for (var i = 1; i < qs.length; i++) {
          qus = $.trim(UTIL.filterMsg(qs[i]));
          if (qus.length > 0) break;
        }
        if (qus.indexOf(_("回答正确", "回答正確")) >= 0) {
          clickButton("question");
          return;
        }
        if (qus.indexOf(_("回答错误", "回答錯誤")) >= 0) {
          console.log(qus);
          YFUI.writeToOut("<span style='color:#FFF;'>--答案錯誤：" + qus + "--</span>");
          return;
        }
        var answer = PLU.getAnswer2Question(qus.replace(/ /g, ""));
        console.log(qus + " " + answer);
        if (answer == null) {
          UTIL.delSysListener("onAnswerQuestions");
          PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
          PLU.setBtnRed($btn, 0);
          YFUI.writeToOut("<span style='color:#FFF;'>--未找到答案：" + qus + "--</span>");
          return;
        }
        setTimeout(() => {
          clickButton("question " + answer);
        }, 300);
      });
      setAnswerTimeout();
      if (!UTIL.inHome()) PLU.execActions("home;question")
      else clickButton("question");
    },
    //================================================================================================
    getAnswer2Question(localQuestion) {
      var answer = PLU.YFD.QuestAnsLibs[localQuestion];
      if (answer) return answer;
      var halfQuestion = localQuestion.substring(localQuestion.length / 2);
      for (var quest in PLU.YFD.QuestAnsLibs) {
        if (quest.indexOf(halfQuestion) == 0) {
          return PLU.YFD.QuestAnsLibs[quest];
        }
      }
      return null;
    },
    //================================================================================================
    autoBingyue(callback) {
      PLU.execActions("jh 14;w;n;n;n;n;event_1_32682066;;;", () => {
        setTimeout(() => {
          PLU.killBingYue(() => {
            PLU.execActions("home;", callback);
          });
        });
      });
    },
    //================================================================================================
    killBingYue(endCallback) {
      if (parseInt(PLU.getCache("autoPerform")) < 1) {
        PLU.toggleAutoPerform($("#btn_bt_kg_autoPerform"), "autoPerform", 1);
      }
      let tryKill = function (kname, cb, er) {
        PLU.autoFight({
          targetName: kname,
          fightKind: "kill",
          onFail() {
            er && er();
          },
          onEnd() {
            cb && cb();
          },
        });
      };
      PLU.execActions("event_1_48044005;;;;", () => {
        tryKill(
          _("冰麟兽", "冰麟獸"),
          () => {
            PLU.execActions("event_1_95129086;;;;", () => {
              tryKill(
                _("玄武机关兽", "玄武機關獸"),
                () => {
                  PLU.execActions("event_1_17623983;event_1_41741346;;;;", () => {
                    tryKill(
                      _("九幽魔灵", "九幽魔靈"),
                      () => {
                        PLU.execActions("s;;;;", () => {
                          tryKill(
                            "冰月仙人",
                            () => {
                              endCallback && endCallback();
                            },
                            () => {
                              endCallback && endCallback();
                            },
                          );
                        });
                      },
                      () => {
                        endCallback && endCallback();
                      },
                    );
                  });
                },
                () => {
                  endCallback && endCallback();
                },
              );
            });
          },
          () => {
            endCallback && endCallback();
          },
        );
      });
    },
    //================================================================================================
    autoXTL() {
      PLU.execActions("team");
      UTIL.addSysListener("team", function(b, type, subtype, msg) {
        if (type !== "team") return
        UTIL.delSysListener("team");
        if (b.get("is_member_of") == undefined) ct = "team create;";
      });
      let LHYD = false;
      function goLHYD() {
        PLU.execActions(PLU.path4FHMJ() + "event_1_52732806");
      }
      function goSY() {
        PLU.execActions(PLU.path4FHMJ() + "event_1_64526228");
      }
      goLHYD();
      UTIL.addSysListener("killXTL", function(b, type, subtype, msg) {
        if (type !== "notice" && type !== "main_msg") return
        if (!LHYD && msg.indexOf("你消耗了金") >= 0) {
          PLU.execActions("kill langhuanyudong_qixing;kill langhuanyudong_benkuangxiao;sw;kill murong_tuboguoshi;" + _("get?吐蕃国师的尸体;", "get?吐蕃國師的屍體;") + "ne;n;event_1_96023188;w;event_1_39972900;w;event_1_92817399;w;event_1_91110342;s;event_1_74276536;se;event_1_14726005;se;se;", () => {
            let sd = g_obj_map.get("msg_room").elements.find((e) => e.value.indexOf(_("扫荡", "掃盪")) >= 0);
            if (sd) {
              let cmd_sd = g_obj_map.get("msg_room").get(sd.key.split("_")[0]);
              PLU.doSaoDang("langhuanyudong", cmd_sd, () => {
                goLHYD();
              });
            }
          })
        } else if (!LHYD && msg.indexOf("明天再") >= 0) {
          LHYD = true;
          PLU.execActions("event_1_64526228");
        } else if (LHYD && msg.indexOf("你消耗了金") >= 0) {
          PLU.execActions("kill shanya_muzhaoxue;kill shanya_qiongduwu;kill shanya_yuanzhenheshang;w;event_1_61179401;n;event_1_93134350;n;event_1_60227051;n;event_1_66986009;kill mingjiao_mengmianrentoumu;" + _("get?蒙面人头目的尸体;", "get?蒙面人頭目的屍體;") + "n;event_1_53067175;n;event_1_58530809;w;event_1_86449371;event_1_66983665;", () => {
            let sd = g_obj_map.get("msg_room").elements.find((e) => e.value.indexOf(_("扫荡", "掃盪")) >= 0);
            if (sd) {
              let cmd_sd = g_obj_map.get("msg_room").get(sd.key.split("_")[0]);
              PLU.doSaoDang("shanya", cmd_sd, () => {
                goSY();
              });
            }
          })
        } else if (LHYD && msg.indexOf("明天再") >= 0) {
          UTIL.delSysListener("killXTL");
          PLU.execActions("home;Log?" + _("刷玄铁令结束", "刷玄鐵令結束"));
          return
        }
      });
    },
    autoCH($btn) {
      var btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_autoCH").text(`刷斥侯`);
        PLU.CH_stop = true;
        return;
      }
			PLU.getAllItems(function (list) {
				var items = list.find(function (it) {
					return !!PLU.dispatchChineseMsg(it.name).match(_("幽厄斥候据点传送符", "幽厄斥候據點傳送符"));
				});
				if (!items) {
					PLU.execActions("log?" + _("你没有传送符!", "你沒有傳送符!"));
					return
				}
				YFUI.showInput({
					title: _("幽厄斥候据点传送符数量:", "幽厄斥候據點傳送符數量:") + items.num,
					text: _("请输入要刷的类型编号和轮次(每轮四隻)并自备好足够数量的九阴石刻!<br>[1]幽厄斥侯<br>[2]幽厄森林<br>[例]1|4(刷4轮幽厄斥侯)<br>[注意]如果是刷幽厄森林不需要自己合成传送符!", "請輸入要刷的類型編號和輪次(每輪四隻)並自備好足夠數量的九陰石刻!<br>[1]幽厄斥侯<br>[2]幽厄森林<br>[例]1|4(刷4輪幽厄斥侯)<br>[注意]如果是刷幽厄森林不需要自己合成傳送符!"),
					value: PLU.getCache("getCH") || "1|1",
					onOk: function onOk(val) {
						if (!$.trim(val)) return;
						var str = $.trim(val);
						PLU.setCache("getCH", str);
						PLU.killCH((err) => {
							PLU.CH_stop = false;
							$("#btn_bt_autoCH").text(`刷斥侯`);
							PLU.setBtnRed($("#btn_bt_autoCH"), 0);
							PLU.execActions("home;log?完成");
							return
						});
					},
					onNo: function onNo() { },
				});
			});
    },
    autoDL($btn) {
      PLU.execActions("home;cangjian;");
      YFUI.showPop({
        title: _("爬楼", "爬樓"),
        text: _("请选择要打的楼<br>请先装备好对应种类武器并设定好对应种类的技能!", "請選擇要打的樓<br>請先裝備好對應種類武器並設定好對應種類的技能!"),
        onOk: function onOk(val) {
          var roomInfo = g_obj_map.get("msg_cangjianlou");
          let lou = parseInt(roomInfo.get("p")) + 1;
          let lou_max = 30;
          let lou_cmd = "xueyin_shenbinggu " + roomInfo.get("lou_type") + " ";
          if (roomInfo.get("lou_type") == "cangjian") {
            lou_cmd = "cangjian ";
            lou_max = 100;
          } else if (["blade", "unarmed", "throwing"].includes(roomInfo.get("lou_type"))) {
            lou_max = 50;
          }
          if (lou > lou_max) return PLU.execActions("Log?" + _("爬楼结束", "爬樓結束"));
          function killDL(lou) {
            PLU.autoFight({
              targetCommand: lou_cmd + "kill " + String(lou),
              onWin: function onWin() {
                lou++;
                if (lou > lou_max) return PLU.execActions(lou_cmd + "get_all;Log?" + _("爬楼结束", "爬樓結束"));
                killDL(lou);
              },
              onLose: function onLose() {
                return PLU.execActions("Log?" + _("爬楼结束", "爬樓結束"));
              }
            });
          }
          killDL(lou);
        },
        onNo: function onNo() { },
      });

    },
    autoDT($btn) {
      let DTday = PLU.getCache("DTday") || _("无纪录", "無紀錄")
      let getDT_before = PLU.getCache("getDT_before") || _("无纪录", "無紀錄")
      YFUI.showInput({
        title: "爬塔",
        text: _("请输入目前的爬塔进度<br>上次爬塔纪录: " + DTday + "(" + getDT_before + ")<br>[格式] 塔名前两个字+层数<br>[例1] 红螺4<br> [例2] 名将3", "請輸入目前的爬塔進度<br>上次爬塔紀錄: " + DTday + "(" + getDT_before + ")<br>[格式] 塔名前兩個字+層數<br>[例1] 紅螺4<br> [例2] 名將3"),
        value: PLU.getCache("getDT") || "通天1",
        onOk: function onOk(val) {
          if (!$.trim(val)) return;
          var str = $.trim(val);
          PLU.setCache("getDT", str);
          PLU.execActions("team create;", () => { PLU.goDT() });
        },
        onNo: function onNo() { },
      });

    },
    goDT(callback) {
      var str = PLU.getCache("getDT");
      var matches = str.match(/^(\D+)(\d+)$/);
      if (matches) {
        var tower = matches[1];
        var ifloor = parseInt(matches[2]);
        let floor = null;
        switch (ifloor) {
          case 1:
            floor = "一"
            break
          case 2:
            floor = "二"
            break
          case 3:
            floor = "三"
            break
          case 4:
            floor = "四"
            break
          case 5:
            floor = "五"
            break
          case 6:
            floor = "六"
            break
          case 7:
            floor = "七"
            break
          case 8:
            floor = "八"
            break
          case 9:
            floor = "九"
            break
          case 10:
            floor = "十"
            break
          case 11:
            floor = "十一"
            break
          case 12:
            floor = "十二"
            break
          case 13:
            floor = "十三"
            break
          case 14:
            floor = "十四"
            break
          case 15:
            floor = "十五"
            break
        }
        let mfloor = "";
        switch (tower) {
          case "通天":
            PLU.execActions("rank go 193");
            mfloor = 9;
            break
          case _("红螺", "紅螺"):
            PLU.execActions("rank go 194");
            mfloor = 9;
            break
          case "越女":
            PLU.execActions("rank go 204");
            mfloor = 9;
            break
          case _("铸剑", "鑄劍"):
            PLU.execActions("rank go 210");
            mfloor = 9;
            break
          case _("霹雳", "霹靂"):
            PLU.execActions("rank go 222");
            mfloor = 9;
            break
          case _("葬剑", "葬劍"):
            PLU.execActions("rank go 223");
            mfloor = 15;
            break
          case _("无相", "無相"):
            PLU.execActions("rank go 231");
            mfloor = 9;
            break
          case "藏典":
            PLU.execActions("rank go 232");
            mfloor = 9;
            break
          case "魔皇":
            PLU.execActions("rank go 236");
            mfloor = 9;
            break
          case _("名将", "名將"):
            PLU.execActions("rank go 262");
            mfloor = 10;
            break
          case "一品":
            PLU.execActions("rank go 296");
            mfloor = 9;
            break
          case _("无为", "無為"):
            PLU.execActions("jh 54;#4 nw;#2 w;#8 n;#2 ne;#2 nw;#6 n;");
            mfloor = 7;
            break
          case "石棺":
            PLU.execActions("jh 54;#4 nw;#2 w;#8 n;#2 nw;w;nw;#2 n;w;#2 n;");
            mfloor = 10;
            break
          case "拱辰":
            PLU.execActions("jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;#3 w;n;");
            mfloor = 13;
            break
          default:
            break
        }
        UTIL.addSysListener("autoDT", function(b, type, subtype, msg) {
          if (type !== "jh" && subtype !== "info") return
          if (!b.get("short").includes(tower)) return
          UTIL.delSysListener("autoDT");
          for (var i = 1; i <= b.size(); i++) {
            if (b.containsKey("cmd" + i) && UTIL.filterMsg(b.get("cmd" + i + "_name").replace(/ /g, "")) == floor + _("层", "層")) {
              var acs = b.get("cmd" + i);
              PLU.execActions(`${acs};`);
              break
            } else if (b.get("cmd" + i + "_name") == undefined) {
              break
            }
          }
          UTIL.addSysListener("goDT", function(b, type, subtype, msg) {
            if (type !== "jh" && subtype !== "info") return
            let npcID = b.get("npc1").split(",")[0]
            if (!npcID) return
            UTIL.delSysListener("goDT");
            for (var i = 1; i <= b.size(); i++) {
              if (b.containsKey("cmd" + i) && UTIL.filterMsg(b.get("cmd" + i + "_name")).indexOf(_("领取", "領取")) >= 0) {
                var receive = b.get("cmd" + i);
                PLU.execActions(`=1000;kill ${npcID};${receive};home;`, () => {
                  PLU.setCache("getDT_before", tower + ifloor);
                  ifloor++;
                  if (ifloor > mfloor) {
                    if (tower == "拱辰") {
											PLU.setCache("DTday", checkDay());
											PLU.execActions("log?爬塔完成", callback);
											return
										}
										ifloor = 1;
                    switch (tower) {
                      case "通天":
                        tower = _("红螺", "紅螺");
                        break
                      case _("红螺", "紅螺"):
                        tower = "越女";
                        break
                      case "越女":
                        tower = _("铸剑", "鑄劍");
                        break
                      case _("铸剑", "鑄劍"):
                        tower = _("霹雳", "霹靂");
                        break
                      case _("霹雳", "霹靂"):
                        tower = _("葬剑", "葬劍");
                        break
                      case _("葬剑", "葬劍"):
                        if (g_obj_map.get("msg_attrs").get("gender") == "男性") tower = _("无相", "無相");
                        else if (g_obj_map.get("msg_attrs").get("gender") == "女性") tower = "藏典";
                        break
                      case _("无相", "無相"):
                        tower = "魔皇";
                        break
                      case "藏典":
                        tower = "魔皇";
                        break
                      case "魔皇":
                        tower = _("名将", "名將");
                        break
                      case _("名将", "名將"):
                        tower = "一品";
                        break
                      case "一品":
                        tower = _("无为", "無為");
                        break
                      case _("无为", "無為"):
                        tower = "石棺";
                        break
                      case "石棺":
                        tower = "拱辰";
                        break
                      default:
                        break
                    }
                  }
                  PLU.setCache("DTday", checkDay());
                  PLU.setCache("getDT", tower + ifloor);
                  PLU.execActions("log?爬塔完成", callback);
                });
                break
              }
            }
          });
        });
      } else {
        PLU.execActions("log?" + _("格式错误!", "格式錯誤!"));
      }
    },
    getMaxJhList() {
      var jhList = g_obj_map.get("msg_jh_list");
      if (!jhList) return 0

      var max = 0;
      for (var key of jhList.keys()) {
        if (key.indexOf("finish") < 0) continue
        var val = jhList.get(key);
        if (val != "2") continue;
        var proc = parseInt(key.split("finish")[1]);
        if (proc > max) max = proc;
      }
      return (max + 1)
    },
    getMaxFbList(fbList) {
      if (!fbList) return 0

      var max = 0;
      for (var key of fbList.keys()) {
        if (key.indexOf("finish") < 0) continue
        var val = fbList.get(key);
        if (val != "2") continue;
        var proc = parseInt(key.split("finish")[1]);
        if (proc > max) max = proc;
      }
      return (max + 1)
    },
    autoXH($btn) {
      var btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_autoXH").text(_("自动悬红", "自動懸紅"));
        PLU.setCache("autoXH", 0);
        PLU.autoXHon = false;
        return;
      }
      $("#btn_bt_autoXH").text(_("停止悬红", "停止懸紅"));
      PLU.setCache("autoXH", 1);
      PLU.execActions("items get_store /obj/shop/xuankongling");
      PLU.autoXHon = true;
      PLU.toautoXH();
    },
    toautoXH() {
      PLU.execActions("jh 1;w;=500;event_1_40923067;");
      UTIL.addSysListener("autoXH", function (b, type, subtype, msg) {
        if (!PLU.autoXHon) return
        if (subtype == "notify_fail" && msg.indexOf(_("系统更新中", "系統更新中")) > -1) {
          setTimeout(() => { PLU.execActions("event_1_40923067"); }, 500)
          return
        }
        if (!(type == "main_msg" || type == "notice")) return;
        if (msg.indexOf(_("你的任务超时", "你的任務超時")) >= 0 || msg.indexOf(_("领取", "領取")) >= 0 || msg.indexOf(_("你还没有接到", "你還沒有接到")) >= 0) {
          setTimeout(() => { clickButton("event_1_40923067"); }, 500)
          return
        } else if (msg.indexOf(_("增加了10次【江湖悬红榜】任务次数", "增加了10次【江湖懸紅榜】任務次數")) >= 0) {
         PLU.setCache("XHday", checkDay());
         setTimeout(() => { PLU.toautoXH(); }, 500)
          return;
        } else if (msg.indexOf(_("你今天江湖悬红榜任务数量已经达到上限", "你今天江湖懸紅榜任務數量已經達到上限")) >= 0 || msg.indexOf(_("你当前不需要做悬红任务了", "你當前不需要做懸紅任務了")) >= 0) {
          var XHday = PLU.getCache("XHday") || "";
          if (XHday !== checkDay()) {
            PLU.getAllItems(function (list) {
              var items = list.find(function (it) {
                return !!PLU.dispatchChineseMsg(it.name).match(_("悬红令", "懸紅令"));
              });
              if (items) return PLU.execActions("items use obj_xuankongling;");
            });
            return
          }
          $("#btn_bt_autoXH").click();
          PLU.execActions("home;log?" + _("自动悬红结束", "自動懸紅結束"));
          return;
        }
        var arr = msg.split("』的『");
        if (arr.length < 2) return;
        var jh = PLU.fixJhName(arr[0].substring(arr[0].indexOf("『") + 1)).replace(/\[[0-9;]*[mG]/g, "");
        var xhDesc = arr[1].substring(0, arr[1].indexOf("』")).replace(/\[[0-9;]*[mG]/g, "");
        var npcLib = PLU.YFD.mapsLib.Npc;
        var findList = npcLib.filter(function (e) {
          if (e.jh == jh && PLU.dispatchChineseMsg(e.desc).indexOf(PLU.dispatchChineseMsg(xhDesc)) >= 0) return true;
          return false;
        });
        var targets = [];
        if (findList && findList.length > 0) {
          findList.forEach(function (e, index) {
            var str = [e.jh, e.loc, e.name].filter(function (s) {
              return !!s;
            }).join("-");
            targets.push({
              index: index,
              jh: e.jh,
              loc: e.loc,
              name: e.name,
              way: e.way,
              desc: e.desc,
            });
            YFUI.writeToOut("<span><a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.goNpcWay(\"" + str + '","' + e.way + "\")'>" + str + "</a> &nbsp;&nbsp;<a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.showNpcWay(\"" + str + '","' + e.way + "\")'>路径详情</a></span>");
          });
          YFUI.writeToOut("<span>----------</span>");
          var autoTargets = [];
          var target = null;
          for (var i = 0; i < targets.length; i++) {
            target = targets[i];
            var way = target.way;
            if (way && way.length > 0) {
              if (way.charAt(0) == "." || way.indexOf(_("靠谜题飞", "靠謎題飛")) >= 0) {
                setTimeout(() => { PLU.execActions("event_1_72202956 go;", () => { PLU.toautoXH(); }) }, 500)
                return
              }
              if (target.jh == jh) {
                autoTargets.push(targets[i]);
              }
            } else {
              setTimeout(() => { PLU.execActions("event_1_72202956 go;", () => { PLU.toautoXH(); }) }, 500)
              return
            }
          }
          UTIL.delSysListener("autoXH");
          PLU.autoXHF(0, autoTargets);
        } else {
          YFUI.writeToOut("<span style='color:#F66;'>查询不到相关数据</span>");
          setTimeout(() => { PLU.execActions("event_1_72202956 go", () => { PLU.toautoXH(); }) }, 500)

        }
      });
    },
    autoXHF(idx, targets) {

      if (!PLU.autoXHon) return

      if (!targets || targets.length == 0 || idx == targets.length) {
        return;
      }
      var target = targets[idx];
      var execWay = target.way;

      var targetNames = target.name.split(")");
      var targetName = targetNames[0];
      if (targetNames.length > 1) {
        targetName = targetNames[1];
      }

      var jhList = PLU.getMaxJhList();
      if (jhList) {
        var ways = execWay.split(";")[0];
        if (ways) {
          var jhInfo = ways.split("jh ");
          if (jhInfo.length > 1 && parseInt(jhInfo[1]) > jhList) {
            console.log("地图未开，请手动前往");
            return;
          }
        }
      }

      var tarid = null;
      if (!PLU.autoXHon) return
      var targetFound = false;
      PLU.execActions(execWay, function(code, msg) {
        setTimeout(function() {
          if (!PLU.autoXHon) return
          tarid = UTIL.findRoomNpcReg(targetName);
          if (tarid == null) {
            setTimeout(() => { PLU.execActions("jh 1;w;event_1_72202956 go", () => { PLU.toautoXH(); }) }, 500)
            return
          }
          PLU.execActions("ask " + tarid.key, () => {
            setTimeout(function() {
              if (!targetFound) PLU.autoXHF(idx + 1, targets);
            }, 3000)
          });
          UTIL.addSysListener("autoXHF", function (b, type, subtype, msg) {
            if (!PLU.autoXHon) return
            if (type == "vs" && subtype == "vs_info") {
              targetFound = true;
            }
            if (!msg) return
            if (msg.indexOf(_("无法走动", "無法走動")) >= 0 || msg.indexOf(_("没有这个方向", "沒有這個方向")) >= 0) {
              clearTimeout(PLU.goTime_out);
              UTIL.delSysListener("autoXHF");
              setTimeout(() => { PLU.execActions("jh 1;w;=500;event_1_40923067;=500;event_1_72202956 go", () => { PLU.toautoXH(); }) }, 1000)
              return
            }
            if (msg.indexOf(_("江湖悬红榜", "江湖懸紅榜")) >= 0 && msg.indexOf(_("任务已完成", "任務已完成")) >= 0) {
              clearTimeout(PLU.goTime_out);
              UTIL.delSysListener("autoXHF");
              setTimeout(() => { PLU.toautoXH(); }, 500)
              return
            }
          })
        }, 1500);
      });
    },
    sword_quest_front() {
      YFUI.showPop({
        title: _("外传7_前置", "外傳7_前置"),
        text: _(`1.副本11，拿玉缄青丝<br>2.需求物品：莲蓬100，黑枣冰糖葫芦，山楂冰糖葫芦各2（南诏小贩，需提前买一天一个）<br>3.3000次暴击谜题<br>4.侠客岛两岛主支线需完成<br>5.优昙仙露1000个<br>6.易容术1100级<br>7.油香麻熘手1000级7突`,
        `1.副本11，拿玉緘青絲<br>2.需求物品：蓮蓬100，黑棗冰糖葫蘆，山楂冰糖葫蘆各2（南詔小販，需提前買一天一個）<br>3.3000次暴擊謎題<br>4.俠客島兩島主支線需完成<br>5.優曇仙露1000個<br>6.易容術1100級<br>7.油香麻溜手1000級7突`),
        onOk() {},
        onNo() {},
      });
    },
    sword_quest_1() {
      YFUI.showPop({
        title: _("外传7_卷一", "外傳7_卷一"),
        text: _(`1.去西安，将玉绾青丝给云梦璃<br>2.去华山村，比试剑大师，之后多次对话云梦璃<br>3.去西安，对话程知节，对话云观海、雪初晴<br>4.去西安，对话云梦璃，场景输入：心魔处，继续对话云梦璃，等待24小时<br>5.去西安，对话云梦璃，老僕处探寻进战（160亿血）<br>6.战胜后给予老僕物品，对话奇呷-浪翻云，对话老僕，给浪翻云莲蓬100，等24小时<br>7.对话奇侠-浪翻云，对话西安-秦王，对话程知节<br>8.战胜翼国公（270万亿血），多次对话程知节，对话桃花岛-戚总兵<br>9.去南绍，对话西云书院杨慎，对话李元阳，对话杨慎<br>10.场景输入：此乃入世与出世之异，儒家重人，道家重道，儒讲究“仁”“礼”，道讲究“自然”“无为”。 院长若以朝廷为重，以皇帝为重，自然会做出正确的选择<br>11.对话杨慎，提示（杨慎陷入了沉思。。 “），等一小时<br>12.对话杨慎，获得 冲虚真经X1<br>13.对话阳明居士，等待22小时`,
        `1.去西安，將玉绾青絲給雲夢璃<br>2.去華山村，比試劍大師，之後多次對話雲夢璃<br>3.去西安，對話程知節，對話雲觀海、雪初晴<br>4.去西安，對話雲夢璃，場景輸入：心魔處，繼續對話雲夢璃，等待24小時<br>5.去西安，對話雲夢璃，老僕處探尋進戰（160億血）<br>6.戰勝後給予老僕物品，對話奇呷-浪翻雲，對話老僕，給浪翻雲蓮蓬100，等24小時<br>7.對話奇俠-浪翻雲，對話西安-秦王，對話程知節<br>8.戰勝翼國公（270萬億血），多次對話程知節，對話桃花島-戚總兵<br>9.去南紹，對話西雲書院楊慎，對話李元陽，對話楊慎<br>10.場景輸入：此乃入世與出世之異，儒家重人，道家重道，儒講究“仁”“禮”，道講究“自然”“無為”。 院長若以朝廷為重，以皇帝為重，自然會做出正確的選擇<br>11.對話楊慎，提示（楊慎陷入了沉思。。 “），等一小時<br>12.對話楊慎，獲得 沖虛真經X1<br>13.對話陽明居士，等待22小時`),
        onOk() {},
        onNo() {},
      });
    },
    sword_quest_2() {
      YFUI.showPop({
        title: _("外传7_卷二", "外傳7_卷二"),
        text: _(`1.对话阳明居士，给予冲虚真经x1，五雷斩鬼印章x1，五帝铜钱x1，北斗星君太极八卦剑x1，王母寿桃x10 （南诏西域商人处购买）<br>2.多次对话阳明居士，于场景输入"心魔处"，对话阳明居士<br>3.找谜题，飞心魔，对话心魔，比试心魔(需要脱掉所有装备，并且只能用拳系技能)<br>4.打赢后，对话阳明居士，给予硫磺x1(找谜题飞峨嵋隐图)，等待24小时<br>5.对话阳明居士，对话云梦璃，多次对话云观海（说到这云观海彷彿又回到了当时的岁月，陷入了沉思，我不忍打断 ），等一个小时<br>6.对话云观海，一直到生死未卜，然后场景输入"可有其线索？"<br>7.对话云观海，之后对话云梦璃，然后需要黑枣冰糖葫芦x2，山楂冰糖葫芦x2（南诏购买）<br>8.对话云梦璃，等24小时`,
        `1.對話陽明居士，給予沖虛真經x1，五雷斬鬼印章x1，五帝銅錢x1，北鬥星君太極八卦劍x1，王母壽桃x10 （南詔西域商人處購買）<br>2.多次對話陽明居士，於場景輸入"心魔處"，對話陽明居士<br>3.找謎題，飛心魔，對話心魔，比試心魔(需要脫掉所有裝備，並且只能用拳系技能)<br>4.打贏後，對話陽明居士，給予硫磺x1(找謎題飛峨嵋隱圖)，等待24小時<br>5.對話陽明居士，對話雲夢璃，多次對話雲觀海（說到這雲觀海仿彿又回到了當時的歲月，陷入了沉思，我不忍打斷 ），等一個小時<br>6.對話雲觀海，一直到生死未卜，然後場景輸入"可有其線索？"<br>7.對話雲觀海，之後對話雲夢璃，然後需要黑棗冰糖葫蘆x2，山楂冰糖葫蘆x2（南詔購買）<br>8.對話雲夢璃，等24小時`),
        onOk() {},
        onNo() {},
      });
    },
    path4FHMJ(endCallback) {
      PLU.execActions("jh");
      if (g_obj_map.get("msg_jh_list") && g_obj_map.get("msg_jh_list").get("finish43") == 0) {
        return "jh 1;e;n;n;n;n;w;event_1_90287255 go 6;e;s;sw;se;ne;se;s;";
      } else {
        return "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;";
      }
    },
    // 恶人谷
    killERG(endCallback) {
      var flag = false;
      PLU.execActions("rank go 236;", (f) => {
        if (!f) return endCallback && endCallback(1);
        PLU.execActions("nw;n;n;n;n;n;n;wait#kill tianlongsi_lidazui;" + _("get?李大嘴的尸体;", "get?李大嘴的屍體;"), (f2) => {
          if (!f2) return endCallback && endCallback(2);
          PLU.execActions("nw;nw;n;wait#kill tianlongsi_baikaixin;" + _("get?白开心的尸体", "get?白開心的屍體"), (f3) => {
            if (!f3) return endCallback && endCallback(3);
          });
        });
      });
    },
    // 斥侯
    killCH(endCallback) {
			let CHS = PLU.getCache("getCH").split("|");
			let CHwhere = CHS[0];
      let getCH = Number(CHS[1]);
      let CH = 0;
			let cht = null;
			let chi = null;
			let chn = null;
			switch (CHwhere) {
				case "1":
					cht = "snow_yech";
					chi = "items use obj_yech_csf;";
					chn = _("幽厄斥候据点传送符", "幽厄斥候據點傳送符");
					break
				case "2":
					cht = "youechihou_yexh";
					chi = "items use obj_yeslcsf;";
					chn = _("幽厄森林传送符", "幽厄森林傳送符");
					break
			}
      function tokillCH() {
        if (CH !== 0) {
          PLU.autoFight({
            targetKey: cht,
            fightKind: "kill",
            onFail(errCode) {
              if (errCode == 1) CH = 0;
              setTimeout((t) => {
                tokillCH();
              }, 500);
            },
            onLose() {
              setTimeout((t) => {
                tokillCH();
              }, 500);
            },
            onWin() {
              setTimeout((t) => {
                CH--;
                tokillCH();
              }, 500);
            },
          });
        } else if (CH == 0) {
          if (getCH <= 0 || PLU.CH_stop) return endCallback && endCallback(0);
          PLU.getAllItems(function (list) {
            var items = list.find(function (it) {
              return !!PLU.dispatchChineseMsg(it.name).match(chn);
            });
            if (!items) return endCallback && endCallback(0);
            PLU.execActions(chi, (f) => {
              $("#btn_bt_autoCH").text(`刷斥侯(${getCH})`);
              getCH--;
              CH = 4;
              if (!f) return endCallback && endCallback(1);
              PLU.autoFight({
                targetKey: cht,
                fightKind: "kill",
                onFail() {
                  setTimeout((t) => {
                    tokillCH();
                  }, 500);
                },
                onLose() {
                  setTimeout((t) => {
                    tokillCH();
                  }, 500);
                },
                onWin() {
                  setTimeout((t) => {
                    CH--;
                    tokillCH();
                  }, 500);
                },
              });
            });
          });
        }
      }
      if (getCH == 0) {
        PLU.getAllItems(function (list) {
          var items = list.find(function (it) {
            return !!PLU.dispatchChineseMsg(it.name).match(_("幽厄斥候据点传送符", "幽厄斥候據點傳送符"));
          });
          if (items) {
						if (CHwhere == "1") {
							getCH = items.num;
							tokillCH();
						} else if (CHwhere == "2") {
							getCH = Math.floor(items.num / 10);
							PLU.execActions(`team quit;#${getCH} event_1_63720890;home;`, () => {
								tokillCH();
							})
						}
          }
        });
      } else {
        if (CHwhere == "1") {
					tokillCH();
				} else if (CHwhere == "2") {
					PLU.execActions(`team quit;#${getCH} event_1_63720890;home;`, () => {
						tokillCH();
					})
				}
      }
    },
    buyJHYL() {
      UTIL.addSysListener("9HYL", (b, type, subtype, msg) => {
        if (type != "show_html_page") return;
        var sp = msg.match(/你有四海商票\u001b\[1;32mx(\d+)\u001b\[2;37;0m/);
        if (!sp) return;
        sp = sp[1];
        YFUI.showInput({
          title: _("购买九花玉露丸的材料", "購買九花玉露丸的材料"),
          text: _("四海商票数量: ", "四海商票數量: ") + sp + "<br>需要四海商票: 21750" + _("<br>购买次数:", "<br>購買次數:"),
          value: "",
          onOk(val) {
            if (sp < 21750 * Number(val)) return YFUI.writeToOut("<span style='color:#FF0;'>--你的商票不足" + 21750 * Number(val) + "--</span>");
            else
            PLU.execActions(
              `reclaim buy 27 go ${45 * Number(val)};` + // 矢車菊
              `reclaim buy 46 go ${45 * Number(val)};` + // 雪英
              `reclaim buy 45 go ${45 * Number(val)};` + // 忘憂草
              `reclaim buy 29 go ${15 * Number(val)};` + // 鳳凰木
              `reclaim buy 36 go ${5 * Number(val)};` +  // 洛神花
              `reclaim buy 31 go ${45 * Number(val)};` + // 君影草
              `reclaim buy 32 go ${45 * Number(val)};` + // 仙客來
              `reclaim buy 33 go ${15 * Number(val)};` + // 淩霄花
              `reclaim buy 34 go ${15 * Number(val)};` + // 夕霧草
              (UTIL.inHome() ? "go_lookroom" : "home"),
            );
            UTIL.delSysListener("9HYL");
          },
          onNo() {UTIL.delSysListener("9HYL")}
        });
      });
      PLU.execActions("reclaim recl");
    },
    autoChangeFish() {
      YFUI.showInput({
        title: _("兑换垂钓一夏礼盒", "兌換垂釣一夏禮盒"),
        text: _("输入要兑换的鱼种编号<br>1.锦鲤<br>2.银龙鱼<br>3.金龙鱼<br>4.白金龙鱼<br>5.雷龙鱼<br>6.血龙鱼<br>[例] 1,2,3,4", "輸入要兌換的魚種編號<br>1.錦鯉<br>2.銀龍魚<br>3.金龍魚<br>4.白金龍魚<br>5.雷龍魚<br>6.血龍魚<br>[例] 1,2,3,4"),
        onOk(val) {
          var fishlist = val.split(',');
          var nu = fishlist.length;
          var nc = "";
          fishlist.forEach((f) => {
            switch (f) {
              case "1":
                clickButton("items info tianlongsi_jinli");
                break
              case "2":
                clickButton("items info obj_yinlongyu");
                break
              case "3":
                clickButton("items info obj_jinlongyu");
                break
              case "4":
                clickButton("items info obj_baijinlongyu");
                break
              case "5":
                clickButton("items info obj_leilongyu");
                break
              case "6":
                clickButton("items info obj_xuelongyu");
                break
            }
          })
          UTIL.addSysListener("ChangeFish", (b, type, subtype, msg) => {
            if (type != "items") return;
            if (UTIL.filterMsg(b.get("name")) == _("锦鲤", "錦鯉")) {
              var tianlongsi_jinli = parseInt(b.get("amount")) || 0;
              nu--;
              if (tianlongsi_jinli > 10) {
                tianlongsi_jinli = Math.floor(tianlongsi_jinli / 100)
                nc += "#" + tianlongsi_jinli + " event_1_6795209 go 1;"
              }
            } else if (UTIL.filterMsg(b.get("name")) == _("银龙鱼", "銀龍魚")) {
              var obj_yinlongyu = Math.floor(parseInt(b.get("amount")) / 10) || 0;
              nu--;
              nc += "#" + obj_yinlongyu + " event_1_6795209 go 2;"
            } else if (UTIL.filterMsg(b.get("name")) == _("金龙鱼", "金龍魚")) {
              var obj_jinlongyu = Math.floor(parseInt(b.get("amount")) / 10) || 0;
              nu--;
              nc += "#" + obj_jinlongyu + " event_1_6795209 go 3;"
            } else if (UTIL.filterMsg(b.get("name")) == _("白金龙鱼", "白金龍魚")) {
              var obj_baijinlongyu = Math.floor(parseInt(b.get("amount")) / 10) || 0;
              nu--;
              nc += "#" + obj_baijinlongyu + " event_1_6795209 go 4;"
            } else if (UTIL.filterMsg(b.get("name")) == _("雷龙鱼", "雷龍魚")) {
              var obj_leilongyu = Math.floor(parseInt(b.get("amount")) / 10) || 0;
              nu--;
              nc += "#" + obj_leilongyu + " event_1_6795209 go 5;"
            } else if (UTIL.filterMsg(b.get("name")) == _("血龙鱼", "血龍魚")) {
              var obj_xuelongyu = Math.floor(parseInt(b.get("amount")) / 10) || 0;
              nu--;
              nc += "#" + obj_xuelongyu + " event_1_6795209 go 6;"
            }
            if (nu == 0) {
              UTIL.delSysListener("ChangeFish");
              PLU.execActions("jh 5;n;w;", () => {
                PLU.fastExec(nc, () => {
                  PLU.execActions("home;log?完成");
                })
              })
            }
          });
        },
        onNo() {UTIL.delSysListener("ChangeFish");}
      });
    },
    //============日常任務===================================================================
    tiejian() {
      //西涼鐵劍
      PLU.execActions("jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n;event_1_10117215;");
    },
    baiyuan() {
      //劍宮白猿
      PLU.execActions("rank go 204;e;s;s;s;s;s;s;s;s;w;w;n;n;n;n;nw;nw;nw;n;n;n;event_1_79113775;");
    },
    yanwang10() {
      //閻王十殿
      PLU.execActions("rank go 223;nw;event_1_42827171;kill?輪轉王;event_1_45876452;");
    },
    gedou50(callback) {
      // 格鬥五十
      var sjindi = 1;
      UTIL.addSysListener("gedou50", function (b, type, subtype, msg) {
        if (type == "notice") {
          var msgTxt = UTIL.filterMsg(msg);
          if (msgTxt.match("你抽到了")) {
            if (msgTxt.match(_(/此轮游戏结束/, /此輪遊戲結束/))) {
              PLU.execActions("event_1_36867949 get;event_1_36867949 pay;event_1_36867949 take;"); //拿錢走人再開
            }
            var sjindi = msgTxt.match(_(/奖池提升至(\d+)金锭/, /獎池提升至(\d+)金錠/));
            if (sjindi == null) return;
            var sjindiNumber = Number(sjindi[1]);
            if (sjindiNumber >= 30) {
              UTIL.delSysListener("gedou50");
              PLU.execActions("event_1_36867949 get;event_1_23520182;vs:event_1_70249808 go 50;home;", callback);
            } else {
              PLU.execActions("=300;event_1_36867949 take;"); //抽牌
            }
          } else if (msgTxt.match(_(/今天的游戏次数已达到上限了/, /今天的遊戲次數已達到上限了/))) {
            UTIL.delSysListener("gedou50");
            PLU.execActions("home;", callback);
          }
        }
      });
      PLU.execActions("rank go 195;event_1_36867949 pay;event_1_36867949 take;");
    },
    gongcheng13() {
      //拱辰13
      PLU.execActions("jh 1;e;#4 n;w;event_1_90287255 go 9;n;#3 w;n;event_1_63249896;kill nanzhaoguo_xunhuazheng;event_1_23639130;;");
    },
    rongbaoz(callback) {
      var _g_obj_map$get3;
      //容寶齋
      PLU.execActions("golook_room;");
      var curName = UTIL.filterMsg(((_g_obj_map$get3 = g_obj_map.get("msg_room")) === null || _g_obj_map$get3 === void 0 ? void 0 : _g_obj_map$get3.get("short")) || "");
      if (curName == _("拱辰楼十三层", "拱辰樓十三層")) {
        PLU.execActions("event_1_87723605;=500;s;w;w;#10 s;w;w;n;event_1_27429615;=500;", callback);
      } else {
        PLU.execActions("jh 1;e;#4 n;w;event_1_90287255 go 9;n;#5 w;#10 s;w;w;n;event_1_27429615;=500;", callback);
      }
    },
    nanzzouy(callback) {
      var _g_obj_map$get4;
      //南詔奏樂
      PLU.execActions("golook_room;");
      var curName = UTIL.filterMsg(((_g_obj_map$get4 = g_obj_map.get("msg_room")) === null || _g_obj_map$get4 === void 0 ? void 0 : _g_obj_map$get4.get("short")) || "");
      if (curName == _("容宝斋", "容寶齋")) {
        PLU.execActions("s;e;e;n;n;w;n;event_1_83706838;", callback);
      } else {
        PLU.execActions("jh 1;e;#4 n;w;event_1_90287255 go 9;n;#5 w;#8 s;w;n;event_1_83706838;;attrs;", callback);
      }
    },
    killtalin(callback) {
      var roomInfo = g_obj_map.get("msg_room")  || new Map();
      var curName = UTIL.filterMsg(roomInfo.get("short") || "");
      var act = "";
      if (curName == _("天龙塔林", "天龍塔林")) {
        if (roomInfo.get("southwest") == _("天龙塔林", "天龍塔林")) act = "sw";
        else if (roomInfo.get("southeast") == _("天龙塔林", "天龍塔林")) act = "se";
        else if (roomInfo.get("northeast") == _("天龙塔林", "天龍塔林")) act = "ne";
        else if (roomInfo.get("northwest") == _("天龙塔林", "天龍塔林")) act = "nw";
        if (act) PLU.execActions(act, function () {
          setTimeout(function () {
            PLU.killtalin(callback)
          }, 250);
        });
      } else if (curName == _("风花楼", "風花樓") || curName == _("双树楼", "雙樹樓") || curName == _("雪月楼", "雪月樓")) {
        setTimeout(function() {
          if (curName == _("风花楼", "風花樓")) {
            PLU.execActions("kill tianlongsi_benyinfangzhang ", callback);
          } else if (curName == _("双树楼", "雙樹樓")) {
            PLU.execActions("kill tianlongsi_kurongchanshi", callback);
          } else if (curName == _("雪月楼", "雪月樓")) {
            PLU.execActions("kill tianlongsi_baodingdi", callback);
          }
        }, 1000)
      } else {
        PLU.execActions("rank go 231;s;s;s;se;se;e;s;s;s;s;se;se;s;s;s;event_1_83417762;w;sw;s;s;", function () {
          setTimeout(function () {
            PLU.killtalin(callback);
          }, 250);
        });
      }
    },
    askTianmd(callback) {
      //討天命丹
      var countttmd = 0;
      PLU.execActions("rank go 236;nw;n;n;n;n;n;n;nw;nw;n;n;nw;nw;n;n;nw;ne;event_1_1996692;event_1_10567243", function () {
        UTIL.addSysListener("asktmd", function (b, type, subtype, msg) {
          if (type == "notice" && msg.startsWith("你得到天命丹x1")) {
            countttmd++;
            YFUI.writeToOut("<span style='color:yellow;'>=====" + _("获", "獲") + "得天命丹：" + countttmd + " 次=====</span>");
            if (countttmd >= 10) {
              UTIL.delSysListener("asktmd");
              YFUI.writeToOut("<span style='color:yellow;'>=====討天命丹完成=====</span>");
              PLU.execActions("golook_room;", function () {
                callback && callback();
              });
            }
          } else if (type == "main_msg" && msg.indexOf(_("柴绍", "柴紹")) >= 0) {
            PLU.execActions(";ask tianlongsi_chaishao;");
          }
        });
        PLU.execActions("ask tianlongsi_chaishao");
      });
    },
    //============周常任務===================================================================
    nanzwenz(callback) {
      var _g_obj_map$get6;
      // 南詔問診
      PLU.execActions("golook_room;");
      var curName = UTIL.filterMsg(((_g_obj_map$get6 = g_obj_map.get("msg_room")) === null || _g_obj_map$get6 === void 0 ? void 0 : _g_obj_map$get6.get("short")) || "");
      var addNanzwenzListener = function addNanzwenzListener() {
        PLU.execActions("event_1_27222525;");
        UTIL.addSysListener("nanzwenz", function (b, type, subtype, msg) {
          if (type !== "notice" && type !== "main_msg") return
          var msgTxt = UTIL.filterMsg(msg);
          if (msgTxt.match(_("问诊完成，获得", "問診完成，獲得")) || msgTxt.match(_("病人终于心满意足的回去了", "病人終於心滿意足的回去了")) || msgTxt.match(_("你完成了每周的问诊任务", "你完成了每週的問診任務"))) {
            UTIL.delSysListener("nanzwenz");
            PLU.execActions(_("log?完成问诊;", "log?完成問診;"), callback);
          }
        });
      };
      if (curName === _("元帅府", "元帥府")) {
        PLU.execActions("s;e;#8 n;w;w;s", addNanzwenzListener);
      } else {
        PLU.execActions("jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;#7 w;s;event_1_12050280;", addNanzwenzListener);
      }
    },
    piapiapia(callback) {
      PLU.execActions("rank go 233;#3 s;e;ne;event_1_66728795");
      UTIL.addSysListener("piapiapia", function(b, type, subtype, msg) {
        if (type !== "vs" && type !== "notice") return
        if (type == "notice" && (UTIL.filterMsg(msg).match(_("活跃度不足5万", "活躍度不足5萬")) || UTIL.filterMsg(msg).match(_("每天只能修练一次", "每天只能修練一次")))) {
          UTIL.delSysListener("piapiapia");
          setTimeout(callback, 500);
        } else if (type == "vs" && subtype == "vs_info") {
          UTIL.delSysListener("piapiapia");
          PLU.autoFight({
            targetCommand: "none",
            onFail: function onFail() {
              setTimeout(callback, 1000);
            },
            onEnd: function onEnd() {
              setTimeout(callback, 500);
            }
          });
        }
      })
    },
    //全殺了
    allkill(params) {
      var npcs = UTIL.getRoomAllNpc().filter(function (e) {
        return !(["金甲符兵", "玄陰符兵", "玄陰符兵"].indexOf(e.name) >= 0);
      });
      //let npcs = UTIL.getRoomAllNpc().filter(e=>!(UTIL.filterMsg(e.name).match(/(金甲|玄陰)符兵/)))
      //let npcs = UTIL.getRoomAllNpc()
      if (npcs.length) {
        PLU.autoFight({
          targetKey: npcs[0].key,
          onEnd: function onEnd() {
            setTimeout(function () {
              PLU.allkill(params);
            }, 500);
          }
        });
      } else {
        params.idx++;
        if (params.paths[params.idx] != "ka") {
          params.paths.splice(params.idx + 1, 0, "ak");
        } else {
          params.idx++;
        }
        setTimeout(function () {
          //PLU.allkill(params);
          PLU.actions(params);
        }, 400);
      }
    },
    checkFight(params) {
      setTimeout(function() {
        if (g_gmain.is_fighting) {
          PLU.checkFight(params);
        } else {
          PLU.actions(params);
        }
      }, 500);
    },
    //================================================================================================
    execActions(str, endcallback, params) {
      var acs = str
        .split(";")
        .map((e) => {
          let np = e.match(/^#(\d+)\s(.*)/);
          if (np) {
            let r = [];
            for (let i = 0; i < np[1]; i++) r.push(np[2]);
            return r;
          }
          return e;
        })
        .flat()
        .map((e) => {
          if (PLU.YFD.pathCmds[e]) return PLU.YFD.pathCmds[e] + "." + UTIL.rnd();
          return e;
        });
      PLU.actions({
        paths: acs,
        idx: 0,
        onPathsEnd() {
          PLU.STATUS.isBusy = false;
          endcallback && endcallback(true, params);
        },
        onPathsFail() {
          PLU.STATUS.isBusy = false;
          endcallback && endcallback(false, params);
        },
      });
    },
    //================================================================================================
    actions(params) {
      PLU.STATUS.isBusy = true;
      //params:{paths,idx,onPathsEnd,onPathsFail}
      if (params.idx >= params.paths.length) {
        return params.onPathsEnd && params.onPathsEnd();
      }
      if (PLU.actionStop) {
        PLU.actionStop = false
        return
      }
      let isKill = false;
      if (params.paths.includes("ak")) {
        isKill = true;
      }
      let curAct = params.paths[params.idx];
      if (PLU.getCache("translate") && PLU.getCache("translate") == 1) curAct = Traditionalized(curAct);
      else if (PLU.getCache("translate") && PLU.getCache("translate") == 2) curAct = Simplized(curAct)
      // 檢查是否在戰鬥中
      if (g_gmain.is_fighting) {
        PLU.checkFight(params);
        return;
      }
      //
      if (curAct == "zh" || curAct == "cn" || curAct == "off") {
        if (curAct == "zh") cs = 1;
        else if (curAct == "cn") cs = 2;
        else if (curAct == "off") cs = 0;
        PLU.setCache("translate", cs);
        params.idx++;
        PLU.actions(params);
        return;
      }
      // 等
      if (!curAct || curAct.startsWith("=")) {
        setTimeout(function () {
          params.idx++;
          PLU.actions(params);
        }, parseInt(curAct.substring(1)) || 250);
        return;
      }
      // 移動
      if (curAct.startsWith("go") && !isKill) {
        clickButton(curAct);
        PLU.goTime_out = setTimeout(function () {
          params.idx++;
          PLU.actions(params);
        }, _(500, 350));
        return;
      }
      // 存讀
      if (curAct.indexOf("save?") >= 0) {
        let ca = curAct.split('?');
        PLU.setCache(ca[1], ca[2]);
        params.idx++;
        PLU.actions(params);
        return;
      }
      // 物品
      if (curAct.indexOf("items_info?") >= 0) {
        let ca = curAct.split('?');
        PLU.getAllItems(function (list) {
          var items = list.find(function (it) {
            return !!PLU.dispatchChineseMsg(it.name).match(PLU.dispatchChineseMsg(ca[1]));
          });
          if (!items) return
          clickButton("items info " + items.key);
          return;
        });
      }
      if (curAct.indexOf("ak") > -1 && isKill) {
        PLU.allkill(params);
        return;
      }
      // 畫面通知-黃
      if (curAct.indexOf("log?") > -1) {
        YFUI.writeToOut("<span style='color:yellow;'>==" + curAct.substring(4) + "==</span>");
        params.idx++;
        PLU.actions(params);
        return;
      }
      // 畫面通知-白
      if (curAct.indexOf("Log?") > -1) {
        YFUI.writeToOut("<span style='color:white;'>==" + curAct.substring(4) + "==</span>");
        params.idx++;
        PLU.actions(params);
        return;
      }
      // 等待復活
      if (curAct.indexOf("wait#") > -1 || curAct.indexOf("wait ") > -1) {
        let npc = curAct.substring(curAct.indexOf(" ") + curAct.indexOf("?") + 2);
        if (UTIL.getRoomAllNpc().some((e) => e.name == npc || e.key == npc)) {
          if (params.paths[params.idx].indexOf("wait ") > -1) params.idx++;
          else params.paths[params.idx] = params.paths[params.idx].substring(5);
          PLU.actions(params);
        } else
          UTIL.addSysListener("wait", (b, type, subtype, msg) => {
            if (UTIL.inHome()) {
              UTIL.delSysListener("wait");
              params.idx = params.paths.length;
              PLU.actions(params);
            }
            if (type != "jh") return;
            if (subtype == "info") {
              UTIL.delSysListener("wait");
              params.idx = params.paths.length;
              PLU.actions(params);
            }
            if (subtype != "new_npc") return;
            if (b.get("id") == npc || b.get("name") == npc) {
              UTIL.delSysListener("wait");
              if (curAct.indexOf("wait ") > -1) params.idx++;
              else params.paths[params.idx] = params.paths[params.idx].substring(5);
              PLU.actions(params);
            }
          });
        return;
      }
      //對話
      if (curAct.indexOf("ask#") > -1) {
        if (curAct.indexOf("?") > -1) {
          var npc = UTIL.findRoomNpc(curAct.substring(curAct.indexOf("?") + 1), 0, 1)?.key;
        } else {
          var npc = curAct.substring(curAct.indexOf(" ") + 1);
        }
        npc && clickButton("ask " + npc);
        params.paths[params.idx] = params.paths[params.idx].substring(4);
        PLU.actions(params);
        return;
      }
      //去殺
      if (curAct.indexOf("kill?") > -1 || curAct.indexOf("kill ") > -1) {
        let kt = parseInt(PLU.getCache("autoPerform")) < 1 ? "multi" : "";
        if (curAct.indexOf("kill?") > -1) {
          let tga = curAct.indexOf("kill?") > -1 ? curAct.substring(5) : null;
          if (!UTIL.roomHasNpc(tga)) {
            setTimeout(() => {
              PLU.actions(params);
            }, 1000);
            return
          }
        };
        PLU.autoFight({
          targetName: curAct.indexOf("kill?") > -1 ? curAct.substring(5) : null,
          targetKey: curAct.indexOf("kill ") > -1 ? curAct.substring(5) : null,
          fightKind: "kill",
          autoSkill: kt,
          onFail(err) {
            setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 500);
          },
          onEnd() {
            setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 500);
          },
        });
        return;
      }
      //去比試
      if (curAct.indexOf("fight?") > -1 || curAct.indexOf("fight ") > -1) {
        let kt = parseInt(PLU.getCache("autoPerform")) < 1 ? "multi" : "";
        if (curAct.indexOf("fight?") > -1) {
          let tga = curAct.indexOf("fight?") > -1 ? curAct.substring(6) : null;
          if (!UTIL.roomHasNpc(tga)) {
            setTimeout(() => {
              PLU.actions(params);
            }, 1000);
            return
          }
        };
        PLU.autoFight({
          targetName: curAct.indexOf("fight?") > -1 ? curAct.substring(6) : null,
          targetKey: curAct.indexOf("fight ") > -1 ? curAct.substring(6) : null,
          fightKind: "fight",
          autoSkill: kt,
          onFail(err) {
            setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 500);
          },
          onEnd() {
            setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 500);
          },
        });
        return;
      }
      // 去摸屍體
      if (curAct.indexOf("get?") > -1) {
        UTIL.getItemFrom(curAct.substring(4));
        setTimeout(() => {
          params.idx++;
          PLU.actions(params);
        }, 500);
        return;
      }
      // 去摸屍體
      if (curAct.indexOf("@") > -1) {
        UTIL.getItemFrom(curAct.substring(1));
        setTimeout(() => {
          params.idx++;
          PLU.actions(params);
        }, 500);
        return;
      }
      // 叫船
      if (curAct.indexOf("yell!") > -1) {
        clickButton("yell");
        setTimeout(function () {
          params.idx++;
          PLU.actions(params);
        }, 350);
      } else if (curAct.indexOf("yell") > -1) {
        let yellBoatTimeout = setTimeout((e) => {
          clearTimeout(yellBoatTimeout);
          UTIL.delSysListener("goYellBoat");
          params.idx++;
          PLU.actions(params);
        }, 120000);
        UTIL.addSysListener("goYellBoat", function (b, type, subtype, msg) {
          if (type == "main_msg" && msg.indexOf(_("还没有达到这", "還沒有達到這")) > -1) {
            setTimeout(() => {
              clearTimeout(yellBoatTimeout);
              UTIL.delSysListener("goYellBoat");
              PLU.actions(params);
            }, 2000);
            return;
          }
          if (type == "notice" && msg.indexOf(_("这儿没有船可以喊", "這兒沒有船可以喊")) > -1) {
            setTimeout(() => {
              clearTimeout(yellBoatTimeout);
              UTIL.delSysListener("goYellBoat");
              params.idx++;
              PLU.actions(params);
            }, 500);
            return;
          }
          if (type != "jh" || subtype != "info") return;
          for (var key of b.keys()) {
            var val = b.get(key);
            if (val.indexOf("yell") < 0) continue;
            clearTimeout(yellBoatTimeout);
            UTIL.delSysListener("goYellBoat");
            params.idx++;
            PLU.actions(params);
            break;
          }
        });
        clickButton(curAct);
        return;
      }
      if (curAct.indexOf("vs:") > -1) {
        PLU.autoFight({
          targetCommand: curAct.substring(3) || "none",
          onFail: function onFail() {
            setTimeout(function () {
              params.idx++;
              PLU.actions(params);
            }, 500);
          },
          onEnd: function onEnd() {
            setTimeout(function () {
              params.idx++;
              PLU.actions(params);
            }, 500);
          }
        });
        return;
      }
      //函式
      if (curAct.indexOf("eval_") > -1) {
        eval(curAct.substring(5));
        setTimeout(() => {
          params.idx++;
          PLU.actions(params);
        }, 500);
        return;
      }
      //檢查地點重走
      if (curAct.indexOf("place?") > -1) {
        var pName = curAct.split(/[?:]/)[1];
        var backStep = curAct.split(/[?:]/)[2];
        // 未到達指定地，重新走
        if (pName != PLU.lastSite) {
          if (parseInt(backStep)) {
            //退后几步
            params.idx -= Number(backStep);
          } else if (backStep) {
            var _params$paths;
            (_params$paths = params.paths).slice.apply(_params$paths, [params.idx, 0].concat(_toConsumableArray(backStep.split(","))));
            console.debug(params);
          } else {
            params.idx = 0;
          }
          PLU.actions(params);
          return;
        }
        // 已到达指定地点，继续下一个
        params.idx++;
        PLU.actions(params);
        return;
      }

      //迷宫
      if (curAct.match(/^(.+):(.+\^.+)$/)) {
        let cmd = curAct.match(/^(.+):(.+\^.+)$/);
        PLU.execActions(PLU.YFD.mapsLib.Labyrinth[cmd[1]][cmd[2]], () => {
          params.idx++;
          PLU.actions(params);
        });
        return;
      }

      //稱號飛修正
      if (curAct.indexOf("rank go") > -1) {
        let m = curAct.match(/rank go (\d+)/);
        if (m && m[1]) {
          curAct = "rank go " + (Number(m[1]) + 1);
        }
      }

      //look,ask,
      if (curAct.match(/look|ask|get|buy|home|prev|moke|sort|share|sign|sleep|exercise|clan|work|chushi |vip |event_|lq_|wear |wield |remove |unwield/)) {
        if (curAct == "ask?lama_master") {
          UTIL.addSysListener("lama", (b, type, subtype, msg) => {
            if (type == "main_msg")
              if (msg.indexOf(_("葛伦师傅在幻境之中", "葛倫師傅在幻境之中")) == -1) clickButton("ask lama_master");
              else {
                params.idx++;
                PLU.actions(params);
                UTIL.delSysListener("lama");
              }
          });
          clickButton("ask lama_master");
        } else {
          clickButton(curAct);
          setTimeout(() => {
            params.idx++;
            PLU.actions(params);
          }, 300);
        }
        return;
      }

      if (curAct.indexOf("ak") > -1) {
        PLU.allkill(params);
        return;
      }

      //look,ask,
      if (curAct.match(/items use|items put_store|items get_store/)) {
        clickButton(curAct);
        setTimeout(() => {
          params.idx++;
          PLU.actions(params);
        }, 500);
        return;
      }

      if (curAct == "飛雪連天射白鹿，笑書神俠倚碧鴛。" || curAct == "飞雪连天射白鹿，笑书神侠倚碧鸳。") {
        if (PLU.developerMode) {
          PLU.setCache("developer", 0);
          YFUI.writeToOut("<span style='color:white;'>==已關閉開發者模式部分功能，刷新後關閉開發者模式全部功能==</span>");
          setTimeout(() => location.reload(), 300);
        } else {
          YFUI.showPop({
            title: "！！！警告！！！",
            text: _(
              "你将开启本脚本开发者模式<br>" +
              "开发者模式功能清单：<br>" +
              "浏览器控制台（F12）输出按键指令、变量g_obj_map的实时变化<br>" +
              "闲聊允许向非脚本玩家打印屏蔽词（屏蔽词不会转为“*”，单字、特殊字符除外）<br>" +
              "可在非首页、非师傅所在地拜入门派，包括未开图的隐藏门派（掌握空间法则（误））<br>" +
              "显示全自动暴击开关（掌握时间法则（延长寿命（<br>" +
              "<b>实验功能可能会导致封号，是否继续？</b>",
              "你將開啟本腳本開發者模式<br>" +
              "開發者模式功能清單：<br>" +
              "瀏覽器控制檯（F12）輸出按鍵指令、變量g_obj_map的實時變化<br>" +
              "閒聊允許向非腳本玩家打印屏蔽詞（屏蔽詞不會轉為“*”，單字、特殊字符除外）<br>" +
              "可在非首頁、非師傅所在地拜入門派，包括未開圖的隱藏門派（掌握空間法則（誤））<br>" +
              "顯示全自動暴擊開關（掌握時間法則（延長壽命（<br>" +
              "<b>實驗功能可能會導致封號，是否繼續？</b>",
            ),
            okText: _("继续", "繼續"),
            onOk() {
              PLU.setCache("developer", 1);
              location.reload();
            },
            onNo() {
              params.idx++;
              PLU.actions(params);
            },
          });
        }
        return;
      }

      //行動
      PLU.go({
        action: curAct,
        onEnd() {
          if (params.idx + 1 >= params.paths.length) {
            return params.onPathsEnd && params.onPathsEnd();
          }
          params.idx++;
          PLU.actions(params);
        },
        onFail(flag) {
          if (flag && PLU.inBattle()) {
            PLU.autoFight({
              onEnd() {
              targetCommand: "none",
                setTimeout(() => {
                  PLU.actions(params);
                }, 1000);
              },
            });
            return;
          } else if (flag) {
            if (PLU.STO.REGO) {
              clearTimeout(PLU.STO.REGO);
              PLU.STO.REGO = null;
            }
            PLU.STO.REGO = setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 1000);
          } else {
            params.onPathsFail && params.onPathsFail();
          }
        },
      });
    },
    //================================================================================================
    openXiang(obj, obj1) {
      var items = g_obj_map.get("msg_items").elements.filter(function (item) {
        return item.key.indexOf("items") > -1
      });
      var cmds = [];
      var itemId = null;
      var itemName = null;
      var itemNums = 0;
      var itemNums0 = 0;

      var itemId1 = null;
      var itemName1 = null;
      var itemNums1 = 0;

      for (var i = 0; i < items.length; i++) {
        var id = items[i].value.split(",")[0];
        var name = items[i].value.split(",")[1];
        var nums = items[i].value.split(",")[2];
        var txt = g_simul_efun.replaceControlCharBlank(
          name.replace(/\u0003.*?\u0003/g, "")
        );
        if (txt.indexOf(obj) != '-1') {
          itemId = id;
          itemName = txt;
          itemNums = nums;
          break;
        }
      }
      itemNums0 = itemNums;
      if (obj1) {
        for (var i = 0; i < items.length; i++) {
          var id = items[i].value.split(",")[0];
          var name = items[i].value.split(",")[1];
          var nums = items[i].value.split(",")[2];
          var txt = g_simul_efun.replaceControlCharBlank(
            name.replace(/\u0003.*?\u0003/g, "")
          );
          // console.log(id + '----' + txt)
          if (txt.indexOf(obj1) != '-1') {
            itemId1 = id;
            itemName1 = txt;
            itemNums1 = nums;
            break;
          }
        }
        if (itemNums1) {
          if (itemNums1 * 1 > itemNums * 1) {
            itemNums0 = itemNums;
          } else {
            itemNums0 = itemNums1;
          }
          PLU.openXiangCode(itemId, itemNums0)
        }
      } else {
        PLU.openXiangCode(itemId, itemNums0)
      }
      clickButton("items", 0);
    },
    openXiangCode(id, num) {
      console.log(id + '--' + num);
      PLU.execActions('items use ' + id + "_N_" + num);

      //clickButton(\'items use ' + item.get("id") + "_N_" + item.get("amount") + '\', 1)
      //clickButton('items use obj_yaoyubaoxiang', 0)
    },
    //================================================================================================
    go({ action, onEnd, onFail }) {
      if (!action) return onEnd && onEnd(false);
      let clearGoTimeout = function (timeoutKey) {
        clearTimeout(timeoutKey);
        timeoutKey = null;
        UTIL.delSysListener("goMove");
      };
      let goTimeout = setTimeout(function () {
        clearGoTimeout(goTimeout);
        onEnd && onEnd(false);
      }, 2000);
      UTIL.addSysListener("goMove", function (b, type, subtype, msg) {
        if (type == "notice" && subtype == "notify_fail") {
          if (msg.indexOf(_("你正忙着呢", "你正忙著呢")) > -1) {
            clearGoTimeout(goTimeout);
            return onFail && onFail(true);
          }
          if (
            msg.indexOf(_("无法走动", "無法走動")) > -1 ||
            msg.indexOf(_("没有这个方向", "沒有這個方向")) > -1 ||
            msg.indexOf(_("只有VIP才可以直接去往此地", "只有VIP才可以直接去往此地")) > -1 ||
            msg.indexOf(_("你什麽都没发觉", "你什麼都沒發覺")) > -1 ||
            msg.indexOf(_("就此钻入恐有辱墓主", "就此鑽入恐有辱墓主")) > -1 ||
            msg.indexOf(_("你虽知这松林内有乾坤，但并没发现任何线索", "你雖知這松林內有乾坤，但並沒發現任何線索")) > -1 ||
            msg.indexOf(_("此地图还未解锁，请先通关前面的地图。", "此地圖還未解鎖，請先通關前面的地圖。")) > -1
          ) {
            clearGoTimeout(goTimeout);
            return onFail && onFail(false, msg);
          }
        }
        if (type == "unknow_command" || (type == "jh" && subtype == "info")) {
          clearGoTimeout(goTimeout);
          setTimeout(function () {
            onEnd && onEnd(true);
          }, 200);
          return;
        }
      });
      clickButton(action);
    },
    //================================================================================================
    fastExec(str, endcallback) {
      var acs = str
        .split(";")
        .map((e) => {
          let np = e.match(/^#(\d+)\s(.*)/);
          if (np) {
            let r = [];
            for (let i = 0; i < np[1]; i++) r.push(np[2]);
            return r;
          }
          return e;
        })
        .flat()
        .map((e) => {
          if (PLU.YFD.pathCmds[e]) return PLU.YFD.pathCmds[e] + "." + UTIL.rnd();
          return e;
        });
      let fastFunc = (acts, idx) => {
        if (idx >= acts.length) {
          setTimeout(() => {
            endcallback && endcallback(true);
          }, 1000);
          return;
        }
        let curAct = acts[idx];
        if (!curAct) return fastFunc(acts, idx + 1);
        clickButton(curAct);
        setTimeout(() => {
          fastFunc(acts, idx + 1);
        }, _(400, 200));
        return;
      };
      fastFunc(acs, 0);
    },
    //================================================================================================
    selectSkills(skillName) {
      if (!PLU.battleData || !PLU.battleData.skills) return null;
      let keys = Object.keys(PLU.battleData.skills);
      if (skillName) {
        for (let i = 0; i < keys.length; i++) {
          let sk = PLU.battleData.skills[keys[i]];
          if (sk && sk.name && sk.name.match(skillName)) return sk;
        }
      } else {
        let n = Math.floor(keys.length * Math.random());
        return PLU.battleData.skills[keys[n]];
      }
      return null;
    },
    //================================================================================================
    autoFight(params) {
      let _params$fightKind, _params$targetCommand;
      if (PLU.STO.autoF) {
        clearTimeout(PLU.STO.autoF);
        PLU.STO.autoF = null;
      }
      if (!params.targetKey && !params.targetName && !params.targetCommand) {
        params.onFail && params.onFail(0);
        YFUI.writeToOut("<span style='color:#FFF;'>--" + _("战斗参数缺失", "戰鬥參數缺失") + "--</span>");
        return;
      }
      if (params.targetName && !params.targetKey) {
        let npcObj = UTIL.findRoomNpc(params.targetName, false, true);
        if (npcObj) {
          params.targetKey = npcObj.key;
        } else {
          params.onFail && params.onFail(1);
          YFUI.writeToOut("<span style='color:#FFF;'>--找不到NPC--</span>");
          return;
        }
      }
      let fightAct = (_params$fightKind = params.fightKind) !== null && _params$fightKind !== void 0 ? _params$fightKind : "kill";
      let performTime = 0;
      UTIL.addSysListener("onAutoFight", function (b, type, subtype, msg) {
        if (type == "vs" && subtype == "vs_info") {
          setTimeout(() => {
            if (params.autoSkill && PLU.battleData) PLU.battleData.autoSkill = params.autoSkill;
          }, 100);
          if (PLU.TMP.loopCheckFight) {
            clearInterval(PLU.TMP.loopCheckFight);
            PLU.TMP.loopCheckFight = null;
          }
          PLU.TMP.loopCheckFight = setInterval(() => {
            if (!g_gmain.is_fighting) {
              UTIL.delSysListener("onAutoFight");
              if (PLU.STO.autoF) {
                clearTimeout(PLU.STO.autoF);
                PLU.STO.autoF = null;
              }
              if (PLU.TMP.loopCheckFight) {
                clearInterval(PLU.TMP.loopCheckFight);
                PLU.TMP.loopCheckFight = null;
              }
              params.onEnd && params.onEnd();
            }
          }, 1000);
          params.onStart && params.onStart();
        } else if (type == "vs" && (subtype == "add_xdz" || subtype == "text" || subtype == "attack")) {
          let curTime = new Date().getTime();
          if (curTime - performTime < 500) return;
          performTime = curTime;
          let useSkill = null;
          if (params.autoSkill) {
            if (!PLU.battleData || PLU.battleData.xdz < 2) return;
            if (params.autoSkill == "item") {
              if (PLU.battleData.xdz >= 6) useSkill = { key: "playskill 7" };
              else useSkill = {};
            } else if (params.autoSkill == "dodge") {
              if (PLU.battleData.xdz > 9) useSkill = PLU.selectSkills(_(/乾坤大挪移|凌波微步|无影毒阵|九妙飞天术/, /乾坤大挪移|淩波微步|無影毒陣|九妙飛天術/));
            } else if (params.autoSkill == "multi") {
              if (PLU.battleData.xdz > 2) useSkill = PLU.selectSkills(_(/破军棍法|千影百伤棍|八荒功|月夜鬼萧|打狗棒法/, /破軍棍法|千影百傷棍|八荒功|月夜鬼蕭|打狗棒法/));
            } else if (params.autoSkill == "fast") {
              if (PLU.battleData.xdz >= 2) useSkill = PLU.selectSkills(_(/吸星大法|斗转星移|无影毒阵|空明拳|乾坤大挪移/, /吸星大法|斗轉星移|無影毒陣|空明拳|乾坤大挪移/));
            }
            if (!useSkill) {
              if (PLU.getCache("autoPerform") >= 1) {
                PLU.battleData.autoSkill = "";
                return;
              }
              if (params.autoSkill) PLU.battleData.autoSkill = "";
              useSkill = PLU.selectSkills();
            }
            if (params.onFighting) {
              let block = params.onFighting(useSkill);
              if (block) return;
            }
            useSkill && clickButton(useSkill.key, 0);
          } else {
            params.onFighting && params.onFighting();
          }
        } else if (type == "vs" && subtype == "combat_result") {
          performTime = 0;
          UTIL.delSysListener("onAutoFight");
          if (PLU.STO.autoF) {
            clearTimeout(PLU.STO.autoF);
            PLU.STO.autoF = null;
          }
          if (PLU.TMP.loopCheckFight) {
            clearInterval(PLU.TMP.loopCheckFight);
            PLU.TMP.loopCheckFight = null;
          }
          clickButton("prev_combat");
          if (b.get("win_uid").includes(PLU.accId)) params.onWin && params.onWin();
          if (b.get("fail_uid").includes(PLU.accId)) params.onLose && params.onLose();
          params.onEnd && params.onEnd();
        } else if (type == "notice" && subtype == "notify_fail") {
          let errCode = 0;
          if (msg.indexOf(_("没有这个人", "沒有這個人")) > -1) {
            errCode = 1;
          } else if (msg.indexOf(_("你正忙着呢", "你正忙著呢")) > -1) {
            errCode = 2;
          } else if (msg.indexOf(_("已经超量", "已經超量")) > -1) {
            errCode = 3;
          } else if (msg.indexOf(_("已达到上限", "已達到上限")) > -1) {
            errCode = 4;
          } else if (msg.indexOf("太多人了") > -1) {
            errCode = 5;
          } else if (msg.indexOf(_("不能战斗", "不能戰鬥")) > -1) {
            errCode = 6;
          } else if (msg.indexOf(_("你今天挑战太多了", "你今天挑戰太多了")) > -1) {
            errCode = 7;
          } else if (msg.indexOf(_("你今天已经杀生太多了", "你今天已經殺生太多了")) > -1) {
            errCode = 8;
          } else if (msg.indexOf(_("秒后才能攻击这个人", "秒後才能攻擊這個人")) > -1 || msg.indexOf(_("秒后才能加入这个战场", "秒後才能加入這個戰場")) > -1) {
            let sat = msg.match(_(/(\d+)秒后才能攻击这个人/, /(\d+)秒後才能攻擊這個人/)) || msg.match(_(/(\d+)秒后才能加入这个战场/, /(\d+)秒後才能加入這個戰場/));
            if (sat) errCode = "delay_" + sat[1];
            else errCode = 77;
          } else if (msg.indexOf(_("先观察一下", "先觀察一下")) > -1) {
            errCode = 88;
          } else {
            if (!PLU.STATUS.inBattle) {
              errCode = 99;
            }
          }
          UTIL.delSysListener("onAutoFight");
          if (PLU.STO.autoF) {
            clearTimeout(PLU.STO.autoF);
            PLU.STO.autoF = null;
          }
          if (PLU.TMP.loopCheckFight) {
            clearInterval(PLU.TMP.loopCheckFight);
            PLU.TMP.loopCheckFight = null;
          }
          params.onFail && params.onFail(errCode);
        }
      });
      PLU.STO.autoF = setTimeout(() => {
        PLU.STO.autoF = null;
        if (!g_gmain.is_fighting) {
          UTIL.delSysListener("onAutoFight");
          if (PLU.TMP.loopCheckFight) {
            clearInterval(PLU.TMP.loopCheckFight);
            PLU.TMP.loopCheckFight = null;
          }
          return params.onFail && params.onFail(100);
        }
      }, 300000);
      if (params.targetCommand != "none") {
        clickButton((_params$targetCommand = params.targetCommand) !== null && _params$targetCommand !== void 0 ? _params$targetCommand : fightAct + " " + params.targetKey, 0);
      }
    },
    //================================================================================================
    autoEscape(params) {
      if (!PLU.inBattle()) return params.onEnd && params.onEnd();
      let lastEscapeTime = new Date().getTime();
      UTIL.addSysListener("onAutoEscape", function (b, type, subtype, msg) {
        if (type == "vs" && subtype == "combat_result") {
          UTIL.delSysListener("onAutoEscape");
          clickButton("prev_combat");
          return params.onEnd && params.onEnd();
        } else if (type == "vs" && (subtype == "add_xdz" || subtype == "text" || subtype == "attack")) {
          let nt = new Date().getTime();
          if (nt - lastEscapeTime > 500) {
            lastEscapeTime = nt;
            clickButton("escape");
          }
        }
      });
    },
    //================================================================================================
    setBtnRed($btn, flag, sColr) {
      if (!PLU.ONOFF[$btn[0].id + "_color"]) {
        PLU.ONOFF[$btn[0].id + "_color"] = $btn.css("background-color");
        let carr = PLU.ONOFF[$btn[0].id + "_color"].split(/[\D\s]+/);
        carr.pop();
        carr.shift();
        if (carr[0] == carr[1] && carr[1] == carr[2]) {
          carr[1] = carr[1] - 32;
          carr[2] = carr[2] - 32;
        }
        let m = carr.reduce((a, b) => (Number(a) + Number(b)) / 2);
        let narr = carr.map((e) => {
          return Math.min(e - 96 + 4 * (e - m), 256);
        });
        PLU.ONOFF[$btn[0].id + "_colorDark"] = "rgb(" + narr.join(",") + ")";
      }
      if (flag == undefined) {
        if (PLU.ONOFF[$btn[0].id]) {
          PLU.ONOFF[$btn[0].id] = 0;
          $btn.css({
            background: PLU.ONOFF[$btn[0].id + "_color"],
            color: "#000",
          });
          return 0;
        } else {
          PLU.ONOFF[$btn[0].id] = 1;
          $btn.css({
            background: PLU.ONOFF[$btn[0].id + "_colorDark"],
            color: "#FFF",
          });
          return 1;
        }
      } else {
        PLU.ONOFF[$btn[0].id] = flag;
        let colr = sColr || PLU.ONOFF[$btn[0].id + "_color"],
          fcolr = "#000";
        if (flag) {
          colr = sColr || PLU.ONOFF[$btn[0].id + "_colorDark"];
          fcolr = "#FFF";
        }
        $btn.css({ background: colr, color: fcolr });
        return flag;
      }
    },
    getBtnRed($btn) {
      if (PLU.ONOFF[$btn[0].id]) return 1;
      return 0;
    },
    //================================================================================================
    toAutoChuaiMo($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.STATUS.isBusy = false;
        PLU.TMP.CMSkill = null;
        return;
      }
      YFUI.showPop({
        title: _("自动揣摩技能", "自動揣摩技能"),
        text: _("一键自动揣摩所有能揣摩的技能！(除了六阴追魂剑法)", "一鍵自動揣摩所有能揣摩的技能！(除了六陰追魂劍法)"),
        onOk() {
          PLU.autoChuaiMo();
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    toAutoLianXi($btn) {
      var btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.STATUS.isBusy = false;
        PLU.TMP.CMSkill = null;
        return;
      }
      YFUI.showPop({
        title: _("自动练习技能", "自動練習技能"),
        text: _("开启自动练习技能！(除了六阴剑、九阴爪、九阴刀)", "開啟自動練習技能！(除了六陰劍、九陰爪、九陰刀)"),
        onOk: function onOk() {
          PLU.autoLianXi();
        },
        onNo: function onNo() {
          PLU.setBtnRed($btn, 0);
        }
      });
    },
    autoLianXi(_autoLianXi) { // 定义函数
      function autoLianXi() {
        return _autoLianXi.apply(this, arguments);
      }
      autoLianXi.toString = function () {
        return _autoLianXi.toString();
      };
      PLU.STATUS.isBusy = true; // 设置状态为忙碌
      PLU.getSkillsList(function (allSkills, tupoSkills) {
        // 获取技能列表
        PLU.TMP.CANTLXS = PLU.TMP.CANTLXS || []; // 初始化无法练习的技能列表
        PLU.TMP.LXISkill = allSkills.find(function (skill) {
          return skill.level >= 200 && skill.level < 500 && !PLU.TMP.CANTLXS.includes(skill.name) && !_(["基本钩法", "基本戟法", "六阴追魂剑法", "天魔焚身", "纵意登仙步", "九阴噬骨刀"], ["基本鉤法", "基本戟法", "六陰追魂劍法", "天魔焚身", "縱意登仙步", "九陰噬骨刀"]).includes(skill.name) && ["attack", "recovery"].includes(skill.kind);
        });
        if (!PLU.TMP.LXISkill) {
          // 如果没有找到合适的技能
          PLU.STATUS.isBusy = false;
          return;
        }
        clickButton("enable " + PLU.TMP.LXISkill.key); // 启用找到的技能
        UTIL.addSysListener("listenLianXi", function (b, type, subtype, msg) {
          if (type === "notice") {
            if (msg.includes(_("练习已经不能提高了", "練習已經不能提高了")) || msg.includes(_("这项技能不能练习", "這項技能不能練習"))) {
              // 处理练习结束的情况
              UTIL.delSysListener("listenLianXi");
              if (msg.includes(_("这项技能不能练习", "這項技能不能練習"))) {
                PLU.TMP.CANTLXS.push(PLU.TMP.LXISkill.name);
              }
              clearTimeout(PLU.TMP.timer);
              PLU.STATUS.isBusy = false;
              PLU.TMP.LXISkill = null;
            } else if (msg.includes(_("你开始练习", "你開始練習"))) {
              // 如果正在练习其他技能
              UTIL.delSysListener("listenLianXi");
              YFUI.writeToOut("<span style='color:#FFF;'>--" + _("开始练习", "開始練習") + "--</span>");
              clearTimeout(PLU.TMP.timer);
              PLU.STATUS.isBusy = false;
              PLU.TMP.LXISkill = null;
            }
          }
        });
        clickButton("practice " + PLU.TMP.LXISkill.key, 100); // 开始练习技能
        PLU.TMP.timer = setTimeout(autoLianXi, 250); // 设置定时器，250毫秒后继续练习
      });
    },
    //================================================================================================
    toAutoGetKey($btn) {
      var btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        return;
      }
      YFUI.showInput({
        title: _("捡取物品", "撿取物品"),
        text: _("格式：捡取物品名称<br>", "格式：撿取物品名稱<br>"),
        value: PLU.getCache("getdaoju") || _("钥匙,天山雪莲", "鑰匙,天山雪蓮"),
        onOk: function onOk(val) {
          if (!$.trim(val)) return;
          var str = $.trim(val);
          PLU.setCache("getdaoju", str);
          PLU.AutoGetItem();
        },
        onNo: function onNo() {
          PLU.setBtnRed($btn, 0);
          UTIL.delSysListener("listgetdaoju");
        },
      });
    },//================================================================================================
    AutoGetItem() {
      var autogetNames = PLU.getCache("getdaoju") || _("钥匙,天山雪莲", "鑰匙,天山雪蓮");
      autogetNames = autogetNames.split(",");
      g_obj_map.get("msg_room").elements.forEach(function(element) {
        if (element.key.includes("item") && autogetNames.includes(element.value.split(",")[1])) clickButton("get " + element.value.split(",")[0]);
      });
      UTIL.addSysListener("listgetdaoju", function (b, type, subtype, msg) {
        if (type == "jh" && subtype == "new_item") {
          var namesw = b.get("name");
          for (var i = autogetNames.length - 1; i >= 0; i--) {
            if (namesw.indexOf(autogetNames[i]) > -1) {
              clickButton("get " + b.get("id"));
            }
          }
        }
      });
    },
    //================================================================================================
    toChoujiang() {
      PLU.getAllItems((list) => {
        let ChoujiangItems = list.find((it) => !!it.name.match(_("抽奖券", "抽獎券")));
        let ChoujiangNum = ChoujiangItems?.num || 0;
        let item1 = 0;
        let item2 = 0;
        let item3 = 0;
        let ChoujiangCount = 0;
        YFUI.showPop({
          title: _("一键抽奖", "一鍵抽獎"),
          text: ("当前抽奖卷数量: ", "當前抽獎卷數量: ") + ChoujiangNum,
          onOk() {
            PLU.execActions("go_choujiang 10");
            UTIL.addSysListener("listenChoujiang", function (b, type, subtype, msg) {
              if (type != "notice") return;
              if (msg.indexOf(_("今天的抽奖次数已经用完", "今天的抽獎次數已經用完")) >= 0 ||
              msg.indexOf(_("你身上没有抽奖券", "你身上沒有抽獎券")) >= 0 ||
              msg.indexOf(_("没有足够的抽奖券", "沒有足夠的抽獎券")) >= 0) {
                UTIL.delSysListener("listenChoujiang");
                YFUI.writeToOut("<span style='color:yellow;'>==" + _("抽奖结束", "抽獎結束") + "!==</span>");
                YFUI.writeToOut("<span style='color:lightgreen;'>" + _("本次抽奖次数: ", "本次抽獎次數: ") + ChoujiangCount + "</span>");
                YFUI.writeToOut("<span style='color:red;'>" + _("获得神秘鱼护: ", "獲得神秘魚護: ") + item1 + "</span>");
                YFUI.writeToOut("<span style='color:red;'>" + _("获得龙神试炼锦囊: ", "獲得龍神試煉錦囊: ") + item2 + "</span>");
                YFUI.writeToOut("<span style='color:red;'>" + _("获得龙神试炼福袋: ", "獲得龍神試煉福袋: ") + item3 + "</span>");
                YFUI.writeToOut("<span style='color:yellow;'>=============</span>");
              } else if (msg.indexOf(_("抽奖10次额外获得", "抽獎10次額外獲得")) >= 0) {
                ChoujiangCount += 10;
                setTimeout(function () { PLU.execActions("go_choujiang 10;") }, 200)
              } else if (msg.indexOf(_("没有足够的抽奖券", "沒有足夠的抽獎券")) >= 0) {
                ChoujiangCount++;
                setTimeout(function () { PPLU.execActions("#" + ChoujiangNum % 10 + " go_choujiang 1") }, 200)
              } else {
                let item = msg.match(_(/抽奖\((?:.*?)\)获得：(.*)x/, /抽獎\((?:.*?)\)獲得：(.*)x/))[1].match(/[\u4e00-\u9fa5\s]+/g).join('');
                switch (item.replace(/ /g, "")) {
                  case _("神秘渔护", "神秘漁護"):
                    item1++;
                    break
                  case _("龙神试炼锦囊", "龍神試煉錦囊"):
                    item2++;
                    break
                  case _("龙神试炼福袋", "龍神試煉福袋"):
                    item3++;
                    break
                  default:
                    break
                }
              }
            });
          },
          onNo() { }
        });
      });
    },
    //================================================================================================
    digOre1() {
      PLU.execActions("event_1_7731992;");
      UTIL.addSysListener("digOres", function (b, type, subtype, msg) {
        if (type === "notice" && msg.indexOf(_("你获得：", "你獲得：")) >= 0 && msg.indexOf(_("采矿心得x5", "採礦心得x5")) >= 0) {
          setTimeout(() => {PLU.execActions("event_1_7731992;")}, 200);
        } else if (type === "notice" && msg.indexOf(_("你没有破岩镐", "你沒有破岩鎬")) >= 0) {
          UTIL.delSysListener("digOres");
          setTimeout(() => {PLU.execActions("log?" + _("挖矿结束", "挖礦結束"))}, 200);
        }
      });
    },
    digOre2() {
      PLU.execActions("event_1_81989288;");
      UTIL.addSysListener("digOres", function (b, type, subtype, msg) {
        if (type === "notice" && msg.indexOf(_("你获得：", "你獲得：")) >= 0 && msg.indexOf(_("采矿心得x10", "採礦心得x10")) >= 0) {
          setTimeout(() => {PLU.execActions("event_1_81989288;")}, 200);
        } else if (type === "notice" && msg.indexOf(_("你没有高级破岩镐", "你沒有高級破岩鎬")) >= 0) {
          UTIL.delSysListener("digOres");
          setTimeout(() => {PLU.execActions("log?" + _("挖矿结束", "挖礦結束"))}, 200);
        }
      });
    },
    digOre3() {
      PLU.execActions("event_1_10447260;");
      UTIL.addSysListener("digOres", function (b, type, subtype, msg) {
        if (type === "notice" && msg.indexOf(_("你获得：", "你獲得：")) >= 0 && msg.indexOf(_("采矿心得x15", "採礦心得x15")) >= 0) {
          setTimeout(() => {PLU.execActions("event_1_10447260;")}, 200);
        } else if (type === "notice" && msg.indexOf(_("需求：高级破岩镐", "需求：高級破岩鎬")) >= 0) {
          UTIL.delSysListener("digOres");
          setTimeout(() => {PLU.execActions("log?" + _("挖矿结束", "挖礦結束"))}, 200);
        }
      });
    },
    huanpf() {
      //換皮膚
      YFUI.showInput({
        title: _("换皮肤", "換皮膚"),
        text: _('请输入你要选的皮肤，<br>\n              <span>1：极简之风<br>\n              <span style="color:#578DC9;">2：碧海奇侠<br>\n              <span style="color:#8F7D5C;">3：大漠飞鹰<br>\n              ', '請輸入你要選的皮膚，<br>\n              <span>1：極簡之風<br>\n              <span style="color:#578DC9;">2：碧海奇俠<br>\n              <span style="color:#8F7D5C;">3：大漠飛鷹<br>\n              '),
        value: "1",
        // 默認值為1
        onOk: function onOk(val) {
          PLU.execActions("skin_select ".concat(val)); // 使用輸入的值換皮膚
        },

        onNo: function onNo() { }
      });
    },
    zbjianshen() {
      //劍神套
      let cmd = "";
      PLU.getAllItems(function (list) {
        var item = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("谪剑仙", "謫劍仙"));
        });
        var eq = list.find(function (it) {
          return it.equipped && (!!PLU.dispatchChineseMsg(it.name).match(_("渔溪柳翁", "漁溪柳翁")) || !!PLU.dispatchChineseMsg(it.name).match(_("嵇琴阮啸", "嵇琴阮嘯")));
        });
        if (eq) cmd += `remove ${eq.key};`
        if (item) {
          PLU.getAllItems(function (list) {
            list.forEach(function (t, ti) {
              var items = list[ti].equipped && (!!PLU.dispatchChineseMsg(list[ti].name).match(_("垂钓者", "垂釣者")) || !!PLU.dispatchChineseMsg(list[ti].name).match(_("隐居贤者", "隱居賢者")));
              if (!items) return
              if (items) cmd += `remove ${list[ti].key};` 
            });
            PLU.execActions(`${cmd}wear ${item.key};`);
          });
        } else {
          PLU.getAllItems(function (list) {
            list.forEach(function (t, ti) {
              var items = !list[ti].equipped && !!PLU.dispatchChineseMsg(list[ti].name).match(_("剑神", "劍神"));
              if (!items) return
              if (items) cmd += `wear ${list[ti].key};` 
            });
            PLU.execActions(cmd);
          });
        }
      });
    },
    zbchuidiao() {
      //垂釣套
      let cmd = "";
      PLU.getAllItems(function (list) {
        var item = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("渔溪柳翁", "漁溪柳翁"));
        });
        var eq = list.find(function (it) {
          return it.equipped && (!!PLU.dispatchChineseMsg(it.name).match(_("谪剑仙", "謫劍仙")) || !!PLU.dispatchChineseMsg(it.name).match(_("嵇琴阮啸", "嵇琴阮嘯")));
        });
        if (eq) cmd += `remove ${eq.key};`
        if (item) {
          PLU.getAllItems(function (list) {
            list.forEach(function (t, ti) {
              var items = list[ti].equipped && (!!PLU.dispatchChineseMsg(list[ti].name).match(_("剑神", "劍神")) || !!PLU.dispatchChineseMsg(list[ti].name).match(_("隐居贤者", "隱居賢者")));
              if (!items) return
              if (items) cmd += `remove ${list[ti].key};` 
            });
            PLU.execActions(`${cmd}wear ${item.key};`);
          });
        } else {
          PLU.getAllItems(function (list) {
            list.forEach(function (t, ti) {
              var items = !list[ti].equipped && !!PLU.dispatchChineseMsg(list[ti].name).match(_("垂钓者", "垂釣者"));
              if (!items) return
              if (items) cmd += `wear ${list[ti].key};` 
            });
            PLU.execActions(cmd);
          });
        }
      });
    },
    zbxianzhe() {
      //賢者套
      let cmd = "";
      PLU.getAllItems(function (list) {
        var item = list.find(function (it) {
          return !!PLU.dispatchChineseMsg(it.name).match(_("嵇琴阮啸", "嵇琴阮嘯"));
        });
        var eq = list.find(function (it) {
          return it.equipped && (!!PLU.dispatchChineseMsg(it.name).match(_("谪剑仙", "謫劍仙")) || !!PLU.dispatchChineseMsg(it.name).match(_("渔溪柳翁", "漁溪柳翁")));
        });
        if (eq) cmd += `remove ${eq.key};`
        if (item) {
          PLU.getAllItems(function (list) {
            list.forEach(function (t, ti) {
              var items = list[ti].equipped && (!!PLU.dispatchChineseMsg(list[ti].name).match(_("垂钓者", "垂釣者")) || !!PLU.dispatchChineseMsg(list[ti].name).match(_("剑神", "劍神")));
              if (!items) return
              if (items) cmd += `remove ${list[ti].key};` 
            });
            PLU.execActions(`${cmd}wear ${item.key};`);
          });
        } else {
          PLU.getAllItems(function (list) {
            list.forEach(function (t, ti) {
              var items = !list[ti].equipped && !!PLU.dispatchChineseMsg(list[ti].name).match(_("隐居贤者", "隱居賢者"));
              if (!items) return
              if (items) cmd += `wear ${list[ti].key};` 
            });
            PLU.execActions(cmd);
          });
        }
      });
    },
    //================================================================================================
    asJirudw() {
      YFUI.showInput({
        title: _("队伍加入", "隊伍加入"),
        text: _("请输入你要加入队伍的角色ID： 比如：3070884(1)  4512928(1)", "請輸入你要加入隊伍的角色ID： 比如：3070884(1)  4512928(1)"),
        value: PLU.getCache("defaultValue") || "3070884(1)",
        onOk: function onOk(val) {
          PLU.setCache("defaultValue", val);
          PLU.execActions("team join u".concat(val)); // 加入隊伍
        },
        onNo: function onNo() { }
      });
    },
    //================================================================================================
    autoBuyDao($btn) {
      YFUI.showInput({
        title: _("补充玄铁刻刀", "補充玄鐵刻刀"),
        text: _("请输入要补充到背包内有多少玄铁刻刀!", "請輸入要補充到背包內有多少玄鐵刻刀!"),
        value: "100",
        // 默認值為100
        onOk: function onOk(val) {
          PLU.getAllItems((list) => {
            let daoItems = list.find((it) => !!it.name.match(_("玄铁刻刀", "玄鐵刻刀")));
            let daoNum = daoItems?.num || 0;
            let targetNum = Number(val) - daoNum;
            if (targetNum > 0) {
              if (g_obj_map.get("msg_room") && g_obj_map.get("msg_room").get("obj_p") == "47" ) {
                let buyDao_cmd = "#" + Math.floor(targetNum / 10) + " event_1_58404606;";
                buyDao_cmd += "#" + targetNum % 10 + " event_1_73534133;";
                PLU.execActions(buyDao_cmd);
              } else {
                let buyDao_cmd = "jh 1;e;n;n;w;#" + Math.floor(targetNum / 10) + " event_1_58404606;";
                buyDao_cmd += "#" + targetNum % 10 + " event_1_73534133;";
                PLU.execActions(buyDao_cmd);
              }
            }
          });
        },

        onNo: function onNo() { }
      });
    },
    toAutoMoke($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.STATUS.isBusy = false;
        return;
      }
      PLU.getAllItems((list) => {
        let daoItems = list.find((it) => !!it.name.match(_("玄铁刻刀", "玄鐵刻刀")));
        let daoNum = daoItems?.num || 0;
        let eqItems = list.filter((it) => !!(it.key.match(/(equip|weapon)_\S+([8-9]|[10-11])/) && !it.key.match("_moke_") && !it.key.match("_xinwu") && !it.key.match("_barcer") && !it.key.match("_beixin")));
        console.log(eqItems);
        let myNum = 0;
        eqItems &&
          eqItems.forEach((eq) => {
            myNum += eq.num;
          });
        YFUI.showPop({
          title: _("自动摹刻所有明月装备", "自動摹刻所有明月裝備"),
          text:
            _("一键自动摹刻所有明月装备！<br><span style='color:#F00;font-weight:bold;'>注意准备足够的刻刀!!!</span><br>当前玄铁刻刀数量 <span style='color:#F00;'>", "一鍵自動摹刻所有明月裝備！<br><span style='color:#F00;font-weight:bold;'>注意準備足夠的刻刀!!!</span><br>當前玄鐵刻刀數量 <span style='color:#F00;'>") +
            daoNum +
            _("</span><br>当前未摹刻明月装备数量 <span style='color:#F00;'>", "</span><br>當前未摹刻明月裝備數量 <span style='color:#F00;'>") +
            myNum +
            "</span>",
          onOk() {
            PLU.autoMoke(eqItems);
          },
          onNo() {
            PLU.setBtnRed($btn, 0);
          },
        });
      });
    },
    autoMoke(eqList) {
      if (!PLU.ONOFF["btn_bt_autoMoke"]) return YFUI.writeToOut("<span style='color:#F0F;'> ==" + _("摹刻暂停", "摹刻暫停") + "!== </span>");
      if (eqList && eqList.length > 0) {
        let eq = eqList.pop(),
          mokeCmds = "";
        mokeCmds;
        for (var i = 0; i < eq.num; i++) {
          mokeCmds += "moke " + eq.key + ";";
        }
        PLU.execActions(mokeCmds, () => PLU.autoMoke(eqList));
      } else {
        PLU.setBtnRed($("#btn_bt_autoMoke"), 0);
        YFUI.writeToOut("<span style='color:yellow;'> ==" + _("摹刻完毕", "摹刻完畢") + "!== </span>");
      }
    },
    //================================================================================================
    toAutoKillZYY($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        return UTIL.delSysListener("listenLoopKillZYY");
      }
      YFUI.showPop({
        title: _("自动去刷祝玉妍", "自動去刷祝玉妍"),
        text: _("自动去刷祝玉妍", "自動去刷祝玉妍") + "！<br><span style='color:#FFF;background:#F00;font-weight:bold;'>----- 注意: -----</span><br><span style='color:#F00;font-weight:bold;'>" + _("1、准备足够的邪帝舍利!!!<br>2、不要有队伍!!!<br>3、切记要打开自动技能阵!!!<br>4、要上足够的保险卡!!!</span>", "1、準備足夠的邪帝舍利!!!<br>2、不要有隊伍!!!<br>3、切記要打開自動技能陣!!!<br>4、要上足夠的保險卡!!!</span>"),
        onOk() {
          PLU.execActions("rank go 232;s;s;;;", () => {
            PLU.loopKillZYY();
          });
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
          UTIL.delSysListener("listenLoopKillZYY");
        },
      });
    },
    loopKillZYY() {
      UTIL.addSysListener("listenLoopKillZYY", function (b, type, subtype, msg) {
        if (type == "vs" && subtype == "combat_result") {
          if (!PLU.ONOFF["btn_bt_autoKillZYY"]) {
            PLU.execActions(";;;n;", () => {
              YFUI.writeToOut("<span style='color:yellow;'>=====" + _("刷祝玉妍结束", "刷祝玉妍結束") + "!!=====</span>");
              UTIL.delSysListener("listenLoopKillZYY");
            });
          } else {
            PLU.execActions(";;;n;s");
          }
        }
      });
      clickButton("s");
    },
    //================================================================================================
    checkYouxia($btn) {
      YFUI.showPop({
        title: _("检查入室游侠技能", "檢查入室遊俠技能"),
        text: _(`选择需要的对应技能:<br>
				<div style="font-size:15px;">
					<label style="display:inline-block;">内功:<input type="checkbox" name="chkskiyx" value="内功" checked/></label>&nbsp;
					<label style="display:inline-block;">轻功:<input type="checkbox" name="chkskiyx" value="轻功" checked/></label>&nbsp;
					<label style="display:inline-block;">剑法:<input type="checkbox" name="chkskiyx" value="剑法" checked/></label>&nbsp;
					<label style="display:inline-block;">掌法:<input type="checkbox" name="chkskiyx" value="掌法" checked/></label>&nbsp;
					<label style="display:inline-block;">刀法:<input type="checkbox" name="chkskiyx" value="刀法" checked/></label>&nbsp;
					<label style="display:inline-block;">暗器:<input type="checkbox" name="chkskiyx" value="暗器"/></label>&nbsp;
					<label style="display:inline-block;">鞭法:<input type="checkbox" name="chkskiyx" value="鞭法"/></label>&nbsp;
					<label style="display:inline-block;">枪法:<input type="checkbox" name="chkskiyx" value="枪法"/></label>&nbsp;
					<label style="display:inline-block;">锤法:<input type="checkbox" name="chkskiyx" value="锤法"/></label>&nbsp;
					<label style="display:inline-block;">斧法:<input type="checkbox" name="chkskiyx" value="斧法"/></label>
				</div>`,
        `選擇需要的對應技能:<br>
				<div style="font-size:15px;">
					<label style="display:inline-block;">內功:<input type="checkbox" name="chkskiyx" value="內功" checked/></label>&nbsp;
					<label style="display:inline-block;">輕功:<input type="checkbox" name="chkskiyx" value="輕功" checked/></label>&nbsp;
					<label style="display:inline-block;">劍法:<input type="checkbox" name="chkskiyx" value="劍法" checked/></label>&nbsp;
					<label style="display:inline-block;">掌法:<input type="checkbox" name="chkskiyx" value="掌法" checked/></label>&nbsp;
					<label style="display:inline-block;">刀法:<input type="checkbox" name="chkskiyx" value="刀法" checked/></label>&nbsp;
					<label style="display:inline-block;">暗器:<input type="checkbox" name="chkskiyx" value="暗器"/></label>&nbsp;
					<label style="display:inline-block;">鞭法:<input type="checkbox" name="chkskiyx" value="鞭法"/></label>&nbsp;
					<label style="display:inline-block;">槍法:<input type="checkbox" name="chkskiyx" value="槍法"/></label>&nbsp;
					<label style="display:inline-block;">錘法:<input type="checkbox" name="chkskiyx" value="錘法"/></label>&nbsp;
					<label style="display:inline-block;">斧法:<input type="checkbox" name="chkskiyx" value="斧法"/></label>
				</div>`),
        onOk() {
          let chks = $('input[name="chkskiyx"]:checked');
          let selects = [];
          PLU.TMP.chkTmpList = [];
          PLU.TMP.yxTmpList = [];
          $.each(chks, (i, e) => {
            selects.push(e.value);
          });
          PLU.getSkillsList((allSkills, tupoSkills) => {
            PLU.getYouxiaList((yxs) => {
              PLU.checkMySkills(allSkills, yxs, selects);
            });
          });
        },
        onNo() { },
      });
    },
    checkMySkills(mySkills, myYouxia, checkList) {
      // console.log(mySkills, myYouxia, checkList)
      let clstr = "";
      checkList.forEach((c) => (clstr += "【" + c[0] + "】"));
      YFUI.writeToOut("<span style='color:#FFF;'>--" + _("技能检测", "技能檢測") + " <span style='color:yellow;'>" + clstr + "</span>--</span>");
      checkList.forEach((cn) => {
        let carr = PLU.YFD.youxiaSkillMap.filter((r) => r.type == cn);
        carr.forEach((n) => {
          PLU.checkPreSKill(n, mySkills, myYouxia);
        });
      });
      if (PLU.TMP.chkTmpList.length == 0) {
        YFUI.writeToOut("<span style='color:yellow;'>" + _("检查的技能都准备好了", "檢查的技能都準備好了") + "!</span>");
      }
      console.log(PLU.TMP.yxTmpList);
    },
    checkPreSKill(node, mySkills, myYouxia) {
      let ms = mySkills.find((s) => s.name == node.skill);
      if (ms && !PLU.TMP.yxTmpList.some(item => item.key === ms.key && item.name === ms.name)) {
        PLU.TMP.yxTmpList.push({ "key": ms.key, "name": ms.name });
      }
      if (!ms && !PLU.TMP.chkTmpList.includes(node.skill)) {
        PLU.TMP.chkTmpList.push(node.skill);
        let clr = node.kind == _("宗师", "宗師") || node.kind == _("侠客", "俠客") ? "#E93" : "#36E";
        let htm = '<span style="color:' + clr + ';">【' + node.type[0] + "】" + node.skill + " ";
        // htm+= ms?'<span style="color:#3F3;display:inline-block;">('+ms.level+')</span>':'(缺)';
        htm += '<span style="color:#F00;display:inline-block;">(未學)</span>';
        let myx = myYouxia.find((y) => y.name.match(node.name));
        htm +=
          " - " +
          (myx
            ? '<span style="color:#3F3;display:inline-block;">' + myx.name + "[" + myx.level + "]</span>"
            : '<span style="color:#F36;display:inline-block;">需要：<span style="color:#FFF;background:' +
            clr +
            ';"> ' +
            node.kind +
            "-" +
            node.name +
            " </span></span>");
        htm += "</span>";
        YFUI.writeToOut(htm);
      }
      if (node.pre) {
        node.pre.forEach((n) => {
          PLU.checkPreSKill(n, mySkills, myYouxia);
        });
      }
    },
    getYouxiaList(callback) {
      UTIL.addSysListener("getYouxiaList", function (b, type, subtype, msg) {
        if (type != "fudi" && subtype != "juxian") return;
        UTIL.delSysListener("getYouxiaList");
        clickButton("prev");
        let youxias = [];
        for (var i = 0; i < 41; i++) {
          let str = b.get("yx" + i);
          if (str) {
            let attr = str.split(",");
            let ns = UTIL.filterMsg(attr[1]).split("】");
            let nam = ns.length > 1 ? ns[1] : ns[0];
            youxias.push({
              key: attr[0],
              name: nam,
              level: Number(attr[4]),
              kind: attr[3],
            });
          }
        }
        callback(youxias);
      });
      clickButton("fudi juxian");
    },
    //================================================================================================
    toAutoLearn($btn) {
      if (!PLU.TMP.MASTER_SKILLS) {
        return YFUI.showPop({
          title: _("缺少数据", "缺少數據"),
          text: _("需要打开师傅技能界面", "需要打開師傅技能界面"),
          // onOk(){
          //},
        });
      }
      // console.log(PLU.TMP.MASTER_ID, PLU.TMP.MASTER_SKILLS)
      let needSkills = [];
      PLU.getSkillsList((allSkills, tupoSkills) => {
        PLU.TMP.MASTER_SKILLS.forEach((ms) => {
          let sk = allSkills.find((s) => s.key == ms.key) || { level: 0 };
          if (sk.level < ms.level) {
            needSkills.push({
              key: ms.key,
              name: ms.name,
              lvl: ms.level - sk.level,
              cmd: "learn " + ms.key + " from " + PLU.TMP.MASTER_ID + " to 10",
            });
          }
        });
        //console.log(needSkills.map(e=>e.name))
        loopLearn(needSkills);
      });
      let curSkill = null;
      UTIL.addSysListener("loopLearnSkill", function (b, type, subtype, msg) {
        if (type == "notice" && msg.indexOf(_("不愿意教你", "不願意教你")) >= 0) {
          //UTIL.delSysListener("loopLearnSkill");
          if (curSkill) curSkill.lvl = -1;
        }
        return;
      });
      let loopLearn = function (list) {
        if (list.length > 0) {
          if (list[0].lvl > 0) {
            list[0].lvl -= 10;
            curSkill = list[0];
            clickButton(list[0].cmd);
          } else {
            list.shift();
          }
          setTimeout(() => {
            loopLearn(list);
          }, 200);
        } else {
          UTIL.delSysListener("loopLearnSkill");
          YFUI.writeToOut("<span style='color:#FFF;'>----" + _("自动学习结束,记得检查噢", "自動學習結束,記得檢查噢") + "!----</span>");
        }
      };
    },
    //================================================================================================
    autoChuaiMo() {
      if (!PLU.ONOFF["btn_bt_autoChuaiMo"]) return;
      PLU.STATUS.isBusy = true;
      if (!PLU.TMP.CMSkill) {
        PLU.getSkillsList((allSkills, tupoSkills) => {
          if (!PLU.TMP.CANTCMS) PLU.TMP.CANTCMS = [];
          PLU.TMP.CMSkill = allSkills.find(
            (e) =>
              e.level >= 500 &&
              e.level < 600 &&
              e.name != _("六阴追魂剑法", "六陰追魂劍法") &&
              (e.kind == "attack" || e.kind == "recovery" || e.kind == "force") &&
              !PLU.TMP.CANTCMS.includes(e.name),
          );
          if (!PLU.TMP.CMSkill) {
            PLU.STATUS.isBusy = false;
            PLU.TMP.CMSkill = null;
            PLU.setBtnRed($("#btn_bt_autoChuaiMo"), 0);
          } else {
            clickButton("enable " + PLU.TMP.CMSkill.key);
            UTIL.addSysListener("listenChuaiMo", function (b, type, subtype, msg) {
              if (type == "notice" && (msg.indexOf(_("揣摩最高等级为", "揣摩最高等級為")) >= 0 || msg.indexOf(_("这项技能不能揣摩", "這項技能不能揣摩")) >= 0)) {
                UTIL.delSysListener("listenChuaiMo");
                if (msg.indexOf(_("这项技能不能揣摩", "這項技能不能揣摩")) >= 0) {
                  PLU.TMP.CANTCMS.push(PLU.TMP.CMSkill.name);
                }
                YFUI.writeToOut("<span style='color:#FFF;'>--" + _("揣摩结束", "揣摩結束") + "--</span>");
                PLU.TMP.CMSkill = null;
              }
              return;
            });
          }
          PLU.autoChuaiMo();
        });
      } else {
        clickButton("chuaimo go," + PLU.TMP.CMSkill.key, 0);
        setTimeout((e) => {
          PLU.autoChuaiMo();
        }, 250);
      }
    },
    //================================================================================================
    toAutoTeach($btn) {
      var btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.STATUS.isBusy = false;
        PLU.TMP.TeachSkill = null;
        return;
      }
      YFUI.showPop({
        title: _("自动传授游侠技能", "自動傳授遊俠技能"),
        text: _("一键自动传授游侠技能！<b style='color:#F00;'>需要点开游侠技能界面,需要传授的技能不能为0级</b>", "一鍵自動傳授遊俠技能！<b style='color:#F00;'>需要點開遊俠技能界面,需要傳授的技能不能為0級</b>"),
        onOk: function onOk() {
          PLU.autoTeach();
        },
        onNo: function onNo() {
          PLU.setBtnRed($btn, 0);
        }
      });
    },
    //================================================================================================
    autoTeach() {
      if (!PLU.ONOFF["btn_bt_autoTeach"]) return;
      PLU.STATUS.isBusy = true;
      if (PLU.TMP.CUR_YX_SKILLS) {
        var ac = PLU.TMP.CUR_YX_SKILLS.find(function (e) {
          return Number(e.lvl) > 0 && Number(e.lvl) < Number(e.max);
        });
        if (ac) {
          clickButton(ac.cmd, 0);
          setTimeout(function (e) {
            PLU.autoTeach();
          }, 200);
        } else {
          YFUI.writeToOut(_("<span style='color:#FFF;'>--传授结束--</span>", "<span style='color:#FFF;'>--傳授結束--</span>"));
          PLU.STATUS.isBusy = false;
          PLU.setBtnRed($("#btn_bt_autoTeach"), 0);
        }
      } else {
        PLU.STATUS.isBusy = false;
        PLU.setBtnRed($("#btn_bt_autoTeach"), 0);
      }
    },
    //================================================================================================
    toAutoUpgrade($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.STATUS.isBusy = false;
        PLU.TMP.TeachSkill = null;
        return;
      }
      YFUI.showPop({
        title: _("自动升级游侠等级", "自動升級遊俠等級"),
        text: _("一键升级游侠等级！<b style='color:#F00;'>需要点开游侠技能界面</b>", "一鍵升級遊俠等級！<b style='color:#F00;'>需要點開遊俠技能界面</b>"),
        onOk() {
          PLU.autoUpgrade();
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    // 今天提升鳩摩智等級的次數已達到上限了。
    //不能提升阿朱的等級。
    //遊俠等級超過上限了。
    //================================================================================================
    autoUpgrade() {
      if (!PLU.ONOFF["btn_bt_autoUpgrade"]) return;
      PLU.STATUS.isBusy = true;
      if (PLU.TMP.CUR_YX_LEVEL && PLU.TMP.CUR_YX_SKILLS && PLU.TMP.CUR_YX_ENG) {
        if (PLU.TMP.CUR_YX_SKILLS.length > 4 && PLU.TMP.CUR_YX_LEVEL < 2000) {
          var canUpgrade = true;
          UTIL.addSysListener("listenAutoUpgrade", function (b, type, subtype, msg) {
            if (type == "notice" && (msg.indexOf(_("等级的次数已达到上限了", "等級的次數已達到上限了")) >= 0 || msg.indexOf("不能提升") >= 0 || msg.indexOf(_("等级超过上限了", "等級超過上限了")) >= 0)) {
              UTIL.delSysListener("listenAutoUpgrade");
              canUpgrade = false;
              PLU.STATUS.isBusy = false;
              YFUI.writeToOut("<span style='color:#FFF;'>--" + _("升级结束", "升級結束") + "--</span>");
              PLU.setBtnRed($("#btn_bt_autoUpgrade"), 0);
            }
            return;
          });
          clickButton("fudi juxian upgrade go " + PLU.TMP.CUR_YX_ENG + " 100");
          setTimeout((e) => {
            if (canUpgrade) PLU.autoUpgrade();
          }, 500);
        } else {
          YFUI.writeToOut("<span style='color:#FFF;'>--" + _("升级结束", "升級結束") + "--</span>");
          PLU.STATUS.isBusy = false;
          PLU.setBtnRed($("#btn_bt_autoUpgrade"), 0);
        }
      } else {
        PLU.STATUS.isBusy = false;
        PLU.setBtnRed($("#btn_bt_autoUpgrade"), 0);
      }
    },
    //================================================================================================
    toLoopKillByN($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopKillByN").text(_("计数击杀", "計數擊殺"));
        return;
      }
      clickButton("golook_room");
      YFUI.showInput({
        title: _("计数击杀", "計數擊殺"),
        text: _("输入数量，确定后单击怪!!(数量后带小数点为比试)(数量前带*为胜利后立即停止)", "輸入數量，確定後單擊怪!!(數量後帶小數點為比試)(數量前帶*為勝利後立即停止)"),
        value: PLU.getCache("lookKillNum") || 20,
        onOk(val) {
          if (!Number(val) && String(val).charAt(0) !== "*") return;
          setTimeout((o) => {
            $(document).one("click", (o) => {
              let snpc = $(o.target)
                .closest("button")[0]
                .outerHTML.match(/clickButton\('look_npc (\w+)'/i);
              if (snpc && snpc.length >= 2) {
                let uw = String(val).charAt(0) == "*" ? true : false;
                let kf = String(val).indexOf(".") > 0 ? "fight" : "kill";
                PLU.setCache("lookKillNum", String(val));
                if (String(val).charAt(0) == "*") val = val.substring(1);
                PLU.loopKillByN(snpc[1], parseInt(val), kf, uw);
              } else {
                PLU.setBtnRed($btn, 0);
              }
            });
          }, 500);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopKillByN(npcId, killN, killorfight, until_win) {
      if (until_win) {
        if (killN <= 0 || !PLU.ONOFF["btn_bt_loopKillByN"]) return;
        $("#btn_bt_loopKillByN").text("停(" + killN + ")");
        PLU.autoFight({
          targetKey: npcId,
          fightKind: killorfight,
          autoSkill: "fast",
          onFail() {
            setTimeout((t) => {
              PLU.loopKillByN(npcId, killN, killorfight, until_win);
            }, 500);
          },
          onWin() {
            PLU.setBtnRed($("#btn_bt_loopKillByN"), 0);
            $("#btn_bt_loopKillByN").text(_("计数击杀", "計數擊殺"));
            clickButton("home", 1);
            return;
          },
          onLose() {
            if (killN <= 1) {
              PLU.setBtnRed($("#btn_bt_loopKillByN"), 0);
              $("#btn_bt_loopKillByN").text(_("计数击杀", "計數擊殺"));
              clickButton("home", 1);
              return;
            } else {
              setTimeout((t) => {
                PLU.loopKillByN(npcId, killN - 1, killorfight, until_win);
              }, 500);
            }
          },
        });
      } else {
        if (killN <= 0 || !PLU.ONOFF["btn_bt_loopKillByN"]) return;
        $("#btn_bt_loopKillByN").text("停(" + killN + ")");
        PLU.autoFight({
          targetKey: npcId,
          fightKind: killorfight,
          autoSkill: "fast",
          onFail() {
            setTimeout((t) => {
              PLU.loopKillByN(npcId, killN, killorfight, until_win);
            }, 500);
          },
          onEnd() {
            if (killN <= 1) {
              PLU.setBtnRed($("#btn_bt_loopKillByN"), 0);
              $("#btn_bt_loopKillByN").text(_("计数击杀", "計數擊殺"));
              clickButton("home", 1);
              return;
            } else {
              setTimeout((t) => {
                PLU.loopKillByN(npcId, killN - 1, killorfight, until_win);
              }, 500);
            }
          },
        });
      }
    },
    //================================================================================================
    toLoopKillName($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopKillName").text(_("名字连杀", "名字連殺"));
        return;
      }
      YFUI.showInput({
        title: _("名字连杀", "名字連殺"),
        text: _(`格式：人物词组<br>
						次数：省略则默认依次循环战斗至胜利为止<br>
						人物词组：以英文逗号分割多个关键词<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">99|铁狼军,银狼军,金狼军,金狼将,十夫长,百夫长,千夫长</span><br>
						[例2] <span style="color:blue;">敖甲,敖乙</span>
						`,
        `格式：人物詞組<br>
						次數：省略則默認依次循環戰鬥至勝利為止<br>
						人物詞組：以英文逗號分割多個關鍵詞<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">99|鐵狼軍,銀狼軍,金狼軍,金狼將,十夫長,百夫長,千夫長</span><br>
						[例2] <span style="color:blue;">敖甲,敖乙</span>
						`),
        value: PLU.getCache("lookKillNames") || "敖甲,敖乙",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            times = -1,
            names = "",
            arr = str.split("|");
          if (arr.length > 1) {
            times = Number(arr[0]);
            names = arr[1];
          } else {
            names = arr[0];
          }
          PLU.setCache("lookKillNames", str);
          PLU.loopKillName(names, Number(times));
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopKillName(names, killN, errT) {
      if (killN !== -1 && killN <= 0 || !PLU.ONOFF["btn_bt_loopKillName"]) return;
      $("#btn_bt_loopKillName").text(_("停击杀(", "停擊殺(") + killN + ")");
      
      if (PLU.inBattle()) return;
			
			let ktype = "kill";
			if (names.charAt(0) == "*") {
				ktype = "fight";
				names = names.substring(1);
			}
      let namesArr = names.split(/[,，#]/);
      var roomInfo = g_obj_map.get("msg_room");
      if (!roomInfo) return;
      var npc = PLU.matchRoomNpc([namesArr[0]], true, false);
      if (npc) {
        if (killN == -1) {
          PLU.autoFight({
            targetKey: npc.code,
            fightKind: ktype,
            onFail() {
              setTimeout((t) => {
                if (namesArr.length <= 1) {
                  PLU.setBtnRed($("#btn_bt_loopKillName"), 0);
                  $("#btn_bt_loopKillName").text(_("名字连杀", "名字連殺"));
                  return;
                }
                if (namesArr.length > 1) namesArr.shift();
                PLU.loopKillName(namesArr.join(","), killN);
              }, 1000);
            },
            onLose() {
              setTimeout((t) => {
                PLU.loopKillName(names, killN);
              }, 1000);
            },
            onWin() {
              setTimeout((t) => {
                if (namesArr.length <= 1) {
                  PLU.setBtnRed($("#btn_bt_loopKillName"), 0);
                  $("#btn_bt_loopKillName").text(_("名字连杀", "名字連殺"));
                  return;
                }
                if (namesArr.length > 1) namesArr.shift();
                PLU.loopKillName(namesArr.join(","), killN);
              }, 1000);
            },
          });
        } else if (killN !== -1) {
          PLU.autoFight({
            targetKey: npc.code,
            fightKind: ktype,
            onFail() {
              setTimeout((t) => {
                PLU.loopKillName(names, killN);
              }, 1000);
            },
            onEnd() {
              if (killN <= 1) {
                PLU.setBtnRed($("#btn_bt_loopKillName"), 0);
                $("#btn_bt_loopKillName").text(_("名字连杀", "名字連殺"));
                return;
              } else {
                setTimeout((t) => {
                  PLU.loopKillName(names, killN - 1);
                }, 1000);
              }
            },
          });
        }
      } else {
				if (namesArr.length > 1) namesArr.shift();
				PLU.loopKillName(namesArr.join(","), killN);
      }
    },
    //================================================================================================
    toLoopKill($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.LoopKill = false;
        clearInterval(PLU.loopKillsInterval);
        return;
      }
      YFUI.showInput({
        title: _("循环杀", "循環殺"),
        text: _(`格式：名字词组<br>
						名字词组：以英文逗号分割多个关键词, <b style="color:red;">可模糊匹配!</b><br>
						<span style="color:red;">不需要战斗时建议关闭以节省性能!!</span><br>
						[例1] <span style="color:blue;">铁狼军,银狼军,金狼军,金狼将,十夫长,百夫长,千夫长,蛮荒铁,蛮荒银,蛮荒金,寨近卫,蛮荒近卫</span><br>
						`,
        `格式：名字詞組<br>
						名字詞組：以英文逗號分割多個關鍵詞, <b style="color:red;">可模糊匹配!</b><br>
						<span style="color:red;">不需要戰鬥時建議關閉以節省性能!!</span><br>
						[例1] <span style="color:blue;">鐵狼軍,銀狼軍,金狼軍,金狼將,十夫長,百夫長,千夫長,蠻荒鐵,蠻荒銀,蠻荒金,寨近衛,蠻荒近衛</span><br>
						`),
        type: "textarea",
        value: PLU.getCache("lookKillKeys") || _("怯薛军,蒙古突骑,草原枪骑,重装铁骑,狼军,狼将,夫长,蛮荒,近卫", "怯薛軍,蒙古突騎,草原槍騎,重裝鐵騎,狼軍,狼將,夫長,蠻荒,近衛"),
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            names = str.split(/[,，#]/);
          PLU.setCache("lookKillKeys", str);
          PLU.LoopKill = true;
          PLU.loopKillsInterval = setInterval(function() { PLU.loopKills(str) }, 500);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopKills(str) {
      if (!PLU.LoopKill) return;
      if (PLU.inBattle() && PLU.inBattleFight) return
      let names = str.split(/[,，#]/);
      var roomInfo = g_obj_map.get("msg_room");
      if (!roomInfo) return
      
      var npc = PLU.matchRoomNpc(names, true, false);
      if (!npc) return
      PLU.autoFight({
        targetKey: npc.code,
        fightKind: "kill"
      });
      return
    },
    //================================================================================================
    toLoopReadBase($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        // $("#btn_bt_loopReadBase").text('讀技能書')
        return;
      }
      YFUI.showInput({
        title: _("读书还神", "讀書還神"),
        text: _(`格式：比试NPC名称|基础秘籍名称<br>
						比试NPC名称：要比试进行回神的NPC名字<br>
						基础秘籍名称：基础秘籍名称关键词<br>
						<span style="color:red;">战斗必刷道具栏必须用还神丹</span><br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">地痞|基本剑法秘籍</span>
						`,
        `格式：比試NPC名稱|基礎秘籍名稱<br>
						比試NPC名稱：要比試進行回神的NPC名字<br>
						基礎秘籍名稱：基礎秘籍名稱關鍵詞<br>
						<span style="color:red;">戰鬥必刷道具欄必須用還神丹</span><br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">地痞|基本劍法秘籍</span>
						`),
        value: PLU.getCache("loopReadBase") || _("地痞|基本剑法秘籍", "地痞|基本劍法秘籍"),
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            npcName = "",
            bookName = "",
            arr = str.split("|");
          if (arr.length > 1) {
            npcName = arr[0];
            bookName = arr[1];
            PLU.setCache("loopReadBase", str);
            PLU.getAllItems((list) => {
              let bookItem = list.find((it) => !!it.name.match(bookName));
              let reN = Math.floor(g_obj_map.get("msg_attrs").get("max_shen_value") / 55) || 1;
              console.log(npcName, bookItem.key, reN);
              if (bookItem) {
                PLU.toggleAutoPerform($("#btn_bt_kg_autoPerform"), "autoPerform", 0);
                PLU.loopReadBase(npcName, bookItem.key, reN);
              }
            });
          } else {
            PLU.setBtnRed($btn, 0);
            return;
          }
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    loopReadBase(npcName, bookKey, reN) {
      //你使用了一本

      //你的神值不足：10以上。
      //你目前不能使用
      //使用技能等級為
      if (!PLU.ONOFF["btn_bt_loopReadBase"]) {
        UTIL.delSysListener("listenLoopReadBase");
        YFUI.writeToOut("<span style='color:#FFF;'>--" + _("读基本技能书停止", "讀基本技能書停止") + "--</span>");
        PLU.setBtnRed($("#btn_bt_loopReadBase"), 0);
        return;
      }
      UTIL.addSysListener("listenLoopReadBase", function (b, type, subtype, msg) {
        if (type == "main_msg" && msg.indexOf("你使用了一本") >= 0) {
          UTIL.delSysListener("listenLoopReadBase");
          setTimeout(() => {
            PLU.loopReadBase(npcName, bookKey, reN);
          }, 500);
        } else if (type == "notice" && msg.indexOf("你的神值不足") >= 0) {
          UTIL.delSysListener("listenLoopReadBase");
          setTimeout(() => {
            let refreshNumber = 0;
            PLU.autoFight({
              targetName: npcName,
              fightKind: "fight",
              autoSkill: "item",
              onStart() {
                console.log("start fight==");
              },
              onFighting(ps) {
                if (refreshNumber >= reN) return true;
                if (ps && ps.key == "playskill 7") {
                  refreshNumber++;
                  console.log(ps.key, refreshNumber, reN);
                  if (refreshNumber >= reN) {
                    PLU.autoEscape({});
                  }
                }
              },
              onFail(err) {
                console.log(err);
                setTimeout(() => {
                  PLU.loopReadBase(npcName, bookKey, reN);
                }, 1000);
              },
              onEnd(e) {
                setTimeout(() => {
                  PLU.loopReadBase(npcName, bookKey, reN);
                }, 1000);
              },
            });
          }, 500);
        } else if (type == "notice" && msg.indexOf(_("使用技能等级为", "使用技能等級為")) >= 0) {
          UTIL.delSysListener("listenLoopReadBase");
          YFUI.writeToOut("<span style='color:#FFF;'>--" + _("读基本技能书结束", "讀基本技能書結束") + "--</span>");
          PLU.setBtnRed($("#btn_bt_loopReadBase"), 0);
        } else if (type == "notice" && msg.indexOf(_("你的背包里没有这个物品", "你的背包裡沒有這個物品")) >= 0) {
          YFUI.writeToOut("<span style='color:#FFF;'>--" + _("读基本技能书结束", "讀基本技能書結束") + "--</span>");
          PLU.setBtnRed($("#btn_bt_loopReadBase"), 0);
        }
        return;
      });
      let cmds = "items use " + bookKey;
      PLU.execActions(cmds);
    },
    //================================================================================================
    toSearchFamilyQS($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      YFUI.showInput({
        title: _("搜索师门任务", "搜索師門任務"),
        text: _(`格式：任务包含的关键字,多个以英文逗号分隔<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">硫磺,黝黑山洞</span>
            [例2] <span style="color:blue;">茅山,</span>
						`,
            `格式：任務包含的關鍵字,多個以英文逗號分隔<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">硫磺,黝黑山洞</span>
            [例2] <span style="color:blue;">茅山,</span>
						`),
        value: PLU.getCache("searchFamilyQS") || "硫磺,黝黑山洞",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            arr = str.split(",");
          if (arr.length > 1) {
            PLU.setCache("searchFamilyQS", str);
            clickButton("family_quest", 0);
            PLU.TMP.master = g_obj_map?.get("msg_attrs")?.get("master_name");
            PLU.loopSearchFamilyQS(arr);
          } else {
            PLU.setBtnRed($btn, 0);
            return;
          }
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    loopSearchFamilyQS(keys, cmd) {
      if (!PLU.ONOFF["btn_bt_searchFamilyQS"]) {
        UTIL.delSysListener("listenLoopSearchFamilyQS");
        YFUI.writeToOut("<span style='color:#FFF;'>--停止搜索--</span>");
        PLU.setBtnRed($("#btn_bt_searchFamilyQS"), 0);
        return;
      }
      UTIL.addSysListener("listenLoopSearchFamilyQS", function (b, type, subtype, msg) {
        if (type == "main_msg") {
          if (msg.indexOf(`${PLU.TMP.master}一拂袖`) >= 0 || msg.indexOf(_("你现在没有师门任务。", "你現在沒有師門任務。")) >= 0) {
            UTIL.delSysListener("listenLoopSearchFamilyQS");
            setTimeout(() => {
              PLU.loopSearchFamilyQS(keys);
            }, 250);
          } else if (msg.indexOf(_("你现在的任务是", "你現在的任務是")) >= 0 || msg.indexOf(PLU.TMP.master) >= 0) {
            UTIL.delSysListener("listenLoopSearchFamilyQS");
            let qsStr = msg.replace(/\x03(0)?|href;0;|[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
            for (let i = 0; i < keys.length; i++) {
              let key = $.trim(keys[i]);
              if (key && qsStr.indexOf(key) >= 0) {
                YFUI.writeToOut("<span style='color:#FF0;'>========= " + _("结束搜索", "結束搜索") + " =========</span>");
                delete PLU.TMP.master;
                PLU.setBtnRed($("#btn_bt_searchFamilyQS"), 0);
                break;
              } else {
                setTimeout(() => {
                  PLU.loopSearchFamilyQS(keys, "family_quest cancel go");
                }, 250);
              }
            }
          }
        }
      });
      if (cmd) clickButton(cmd);
      else clickButton("family_quest", 0);
    },
    //================================================================================================
    toSearchBangQS($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      YFUI.showInput({
        title: _("搜索帮派任务", "搜索幫派任務"),
        text: _(`格式：任务包含的关键字,多个以英文逗号分隔<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">硫磺,黝黑山洞</span>
						`,
            `格式：任務包含的關鍵字,多個以英文逗號分隔<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">硫磺,黝黑山洞</span>
						`),
        value: PLU.getCache("searchBangQS") || "硫磺,黝黑山洞",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            arr = str.split(",");
          if (arr.length > 1) {
            PLU.setCache("searchBangQS", str);
            clickButton("clan scene", 0);
            PLU.loopSearchBangQS(arr);
          } else {
            PLU.setBtnRed($btn, 0);
            return;
          }
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    loopSearchBangQS(keys, cmd) {
      if (!PLU.ONOFF["btn_bt_searchBangQS"]) {
        UTIL.delSysListener("listenLoopSearchBangQS");
        YFUI.writeToOut("<span style='color:#FFF;'>--停止搜索--</span>");
        PLU.setBtnRed($("#btn_bt_searchBangQS"), 0);
        return;
      }
      UTIL.addSysListener("listenLoopSearchBangQS", function (b, type, subtype, msg) {
        if (type == "main_msg") {
          if (msg.indexOf(_("帮派使者一拂袖", "幫派使者一拂袖")) >= 0 || msg.indexOf(_("帮派使者：现在没有任务", "幫派使者：現在沒有任務")) >= 0) {
            UTIL.delSysListener("listenLoopSearchBangQS");
            setTimeout(() => {
              PLU.loopSearchBangQS(keys);
            }, 250);
          } else if (msg.indexOf(_("你现在的任务是", "你現在的任務是")) >= 0 || msg.indexOf(_("帮派使者：", "幫派使者：")) >= 0) {
            UTIL.delSysListener("listenLoopSearchBangQS");
            let qsStr = msg.replace(/\x03(0)?|href;0;|[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
            for (let i = 0; i < keys.length; i++) {
              let key = $.trim(keys[i]);
              if (key && qsStr.indexOf(key) >= 0) {
                YFUI.writeToOut("<span style='color:#FF0;'>========= " + _("结束搜索", "結束搜索") + " =========</span>");
                PLU.setBtnRed($("#btn_bt_searchBangQS"), 0);
                break;
              } else {
                setTimeout(() => {
                  PLU.loopSearchBangQS(keys, "clan cancel_task go");
                }, 250);
              }
            }
          }
        }
      });
      if (cmd) clickButton(cmd);
      else clickButton("clan task", 0);
    },
    //================================================================================================
    toLoopClick($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopClick").text(_("自动点击", "自動點擊"));
        return;
      }
      YFUI.showInput({
        title: _("自动点击", "自動點擊"),
        text: _("输入自动点击的次数，确定后点击要点按钮", "輸入自動點擊的次數，確定後點擊要點按鈕"),
        value: PLU.getCache("autoClickNum") || 20,
        onOk(val) {
          if (!Number(val)) return;
          setTimeout((o) => {
            $(document).one("click", (o) => {
              let snpc = $(o.target)
                .closest("button")[0]
                .outerHTML.match(/clickButton\([\'\"](.+)[\'\"](,\s*(\d+))*\)/i);
              if (snpc && snpc.length >= 2) {
                let param = snpc[3] ?? 0;
                PLU.setCache("autoClickNum", Number(val));
                PLU.loopClick(snpc[1], param, Number(val));
              } else {
                PLU.setBtnRed($btn, 0);
              }
            });
          }, 500);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopClick(btnCmd, param, clickNum) {
      if (!clickNum || clickNum < 1 || !PLU.ONOFF["btn_bt_loopClick"]) {
        PLU.setBtnRed($("#btn_bt_loopClick"), 0);
        $("#btn_bt_loopClick").text(_("连续点击", "連續點擊"));
        return;
      }
      $("#btn_bt_loopClick").text(_("停点击(", "停點擊(") + clickNum + ")");
      clickButton(btnCmd, param);
      clickNum--;
      setTimeout(() => {
        PLU.loopClick(btnCmd, param, clickNum);
      }, 250);
    },
    //================================================================================================
    loopSlowClick(btnCmd, param, clickNum, delay, ddcard) {
      if (!delay) delay = 1000;
      if (!clickNum || clickNum < 1 || (!PLU.ONOFF["btn_bt_loopSlowClick"] && !ddcard)) {
        PLU.setBtnRed($("#btn_bt_loopSlowClick"), 0);
        $("#btn_bt_loopSlowClick").text(_("慢速点击", "慢速點擊"));
        return;
      }
      $("#btn_bt_loopSlowClick").text("停(" + clickNum + ")");
      clickButton(btnCmd, param);
      clickNum--;
      setTimeout(() => {
        PLU.loopSlowClick(btnCmd, param, clickNum, delay, ddcard);
      }, delay);
    },
    //================================================================================================
    toLoopSlowClick($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopSlowClick").text(_("自动点击", "自動點擊"));
        return;
      }
      YFUI.showPop({
        title: _("自動点击", "自動點擊"),
        text: _(`输入自动点击的次数，输入点击速度，确定后点击游戏中要点的按钮<br>
						<div style='margin:10px 0;'>
							<span>速度(几秒一次): </span>
							<input id="slowClickSec" value="0.2" style="font-size:16px;height:30px;width:15%;"></input>
							<span>次数: </span>
							<input id="slowClickTimes" value="${PLU.getCache("autoClickNum") || 20}" style="font-size:16px;height:26px;width:40%;"></input>
						</div>`,
            `輸入自動點擊的次數，输入點擊速度，確定後點擊遊戲中要點的按鈕<br>
						<div style='margin:10px 0;'>
							<span>速度(幾秒一次): </span>
							<input id="slowClickSec" value="0.01" style="font-size:16px;height:30px;width:15%;"></input>
							<span>次數: </span>
							<input id="slowClickTimes" value="${PLU.getCache("autoClickNum") || 20}" style="font-size:16px;height:26px;width:40%;"></input>
						</div>`),
        onOk() {
          let times = Number($("#slowClickTimes").val()),
            delay = Number($("#slowClickSec").val());
          if (Number(times) <= 0 || Number(delay) <= 0) return;
          setTimeout((o) => {
            $(document).one("click", (o) => {
              let snpc = $(o.target)
                .closest("button")[0]
                .outerHTML.match(/clickButton\([\'\"](.+)[\'\"](,\s*(\d+))*\)/i);
              if (snpc && snpc.length >= 2) {
                let param = snpc[3] ?? 0;
                PLU.setCache("autoClickNum", times);
                PLU.loopSlowClick(snpc[1], param, times, delay * 1000);
              } else {
                PLU.setBtnRed($btn, 0);
              }
            });
          }, 500);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    toRecord($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (btnFlag) {
        PLU.TMP.cmds = [];
        $("#btn_record").text(_("停止录制", "停止錄製"));
        return;
      }
      let cmds = PLU.TMP.cmds;
      delete PLU.TMP.cmds;
      // 指令壓縮算法
      var count = 1;
      for (var index = 0; index < cmds.length; index++) {
        if (cmds[index] == cmds[index + 1]) {
          count++;
          continue;
        }
        if (count >= 2 + cmds[index].length == 1) {
          index -= count - 1;
          cmds.splice(index, count, "#" + count + " " + cmds[index]);
        }
        count = 1;
      }
      cmds = cmds
        .map((e) => {
          let res = e.match(/#\d+ ((jh|fb) \d+)/);
          return res ? res[1] : e;
        })
        .join(";");
      YFUI.showPop({
        title: _("指令详情", "指令詳情"),
        text: cmds,
        okText: _("复制", "複製"),
        onOk() {
          if (GM_setClipboard) GM_setClipboard(cmds);
          else YFUI.writeToOut("<span>" + _("权限不足", "權限不足") + "！</span>");
          $("#btn_record").text(_("指令录制", "指令錄製"));
        },
      });
    },
    //================================================================================================
    autoMasterGem($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_autoMasterGem").text(_("一键合天神", "一鍵合天神"));
        return;
      }
      let arr = [
      "碎裂的",
      _("裂开的", "裂開的"),
      _("无前缀", "無前綴"),
      _("无暇的", "無暇的"),
      "完美的",
      "君王的",
      "皇帝的"
      ];
      let sel1 = '<select id="startGemLvl" style="font-size:16px;height:30px;width:25%;">';
      arr.forEach((p, pi) => {
        sel1 += '<option value="' + pi + '" ' + (pi == 0 ? "selected" : "") + ">" + p + "</option>";
      });
      sel1 += "</select>";
      YFUI.showPop({
        title: _("一键合天神", "一鍵合天神"),
        text: _(`选择合成起始宝石等级，选择速度(请根据网速和游戏速度选择)，确定后自动向上合成所有<br>
						<div style='margin:10px 0;'>
							<span>起始等级: </span>${sel1}
							<span>速度(秒): </span>
							<select id="combineSec" style="font-size:16px;height:30px;width:15%;">
								<option selected>0.5</option>
								<option>1</option>
								<option>2</option>
								<option>3</option>
							</select>
						</div>`,
            `選擇合成起始寶石等級，選擇速度(請根據網速和遊戲速度選擇)，確定後自動向上合成所有<br>
						<div style='margin:10px 0;'>
							<span>起始等級: </span>${sel1}
							<span>速度(秒): </span>
							<select id="combineSec" style="font-size:16px;height:30px;width:15%;">
								<option selected>0.5</option>
								<option>1</option>
								<option>2</option>
								<option>3</option>
							</select>
						</div>`),
        width: "382px",
        okText: _("开始", "開始"),
        onOk() {
          let startLvl = Number($("#startGemLvl").val()),
            delay = Number($("#combineSec").val());
          PLU.autoCombineMasterGem(startLvl, delay * 1000);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    autoCombineMasterGem(startLvl, delay, gemCode, count) {
      if (!PLU.ONOFF["btn_bt_autoMasterGem"]) {
        PLU.setBtnRed($("#btn_bt_autoMasterGem"), 0);
        $("#btn_bt_autoMasterGem").text(_("一键合天神", "一鍵合天神"));
        YFUI.writeToOut("<span style='color:white;'>==" + _("停止合成宝石", "停止合成寶石") + "!==</span>");
        return;
      }
      if (!UTIL.sysListeners["listenCombineMasterGem"]) {
        UTIL.addSysListener("listenCombineMasterGem", function (b, type, subtype, msg) {
          if (type == "notice" && msg.indexOf(_("合成宝石需要", "合成寶石需要")) >= 0) {
            UTIL.delSysListener("listenCombineMasterGem");
            YFUI.writeToOut("<span style='color:#F00;'>--" + _("缺少银两, 合成结束", "缺少銀兩, 合成結束") + "--</span>");
            PLU.setBtnRed($("#btn_bt_autoMasterGem"), 0);
          }
          return;
        });
      }
      //合成寶石需要5萬銀兩。
      //沒有這麼多的完美的藍寶石
      if (!gemCode || count < 3) {
        PLU.getGemList((gemList) => {
          // console.log(gemList)
          let g = gemList.find((e) => e.key.indexOf("" + (startLvl + 1)) > 0 && e.num >= 3);
          if (g) {
            PLU.autoCombineMasterGem(startLvl, delay, g.key, g.num);
          } else {
            if (startLvl < 6) PLU.autoCombineMasterGem(startLvl + 1, delay);
            else {
              PLU.setBtnRed($("#btn_bt_autoMasterGem"), 0);
              YFUI.writeToOut("<span style='color:white;'>==" + _("合成宝石结束", "合成寶石結束") + "!==</span>");
            }
          }
        });
      } else {
        let cd = (delay / 4) | 250,
          n = 1;
        cd = cd > 250 ? cd : 250;
        if (count >= 30000) {
          n = 10000;
          cd = delay;
        } else if (count >= 15000) {
          n = 5000;
          cd = delay;
        } else if (count >= 9000) {
          n = 3000;
          cd = delay;
        } else if (count >= 3000) {
          n = 1000;
          cd = delay;
        } else if (count >= 300) {
          n = 100;
          cd = delay;
        } else if (count >= 150) {
          n = 50;
          cd = delay;
        } else if (count >= 90) {
          n = 30;
          cd = (delay / 2) | 0;
        } else if (count >= 30) {
          n = 10;
          cd = (delay / 3) | 0;
        }
        let cmd = "items hecheng " + gemCode + "_N_" + n + "";
        clickButton(cmd);
        setTimeout(() => {
          PLU.autoCombineMasterGem(startLvl, delay, gemCode, count - n * 3);
        }, cd);
      }
    },
    //================================================================================================
    toSellLaji($btn) {
      let defaultList =
      _("破烂衣服,水草,木盾,铁盾,藤甲盾,青铜盾,鞶革,军袍,麻带,破披风,长斗篷,牛皮带,锦缎腰带,丝质披风,逆钩匕,匕首,铁甲,重甲,精铁甲,银丝甲,梅花匕,软甲衣,羊角匕,金刚杖,白蟒鞭,天寒项链,天寒手镯,新月棍,天寒戒,天寒帽,天寒鞋,金弹子,拜月掌套,疯魔杖,星河剑,金狮盾,白玉腰束,天寒匕,无心匕,生死符,血屠刀,貂皮斗篷,红色长衫,船篙,全真道袍,钢杖,草帽,铁戒,斩空刀,竹剑,布衣,单刀,铁项链,桃符纸,绣花针,锦衣,水烟阁司事帽,阿拉伯弯刀,桃木剑,铁手镯,长剑,丝绸衣,长斗篷",
        "破爛衣服,水草,木盾,鐵盾,藤甲盾,青銅盾,鞶革,軍袍,麻帶,破披風,長斗篷,牛皮帶,錦緞腰帶,絲質披風,逆鉤匕,匕首,鐵甲,重甲,精鐵甲,銀絲甲,梅花匕,軟甲衣,羊角匕,金剛杖,白蟒鞭,天寒項鏈,天寒手鐲,新月棍,天寒戒,天寒帽,天寒鞋,金彈子,拜月掌套,瘋魔杖,星河劍,金獅盾,白玉腰束,天寒匕,無心匕,生死符,血屠刀,貂皮鬥篷,紅色長衫,船篙,全真道袍,鋼杖,草帽,鐵戒,斬空刀,竹劍,布衣,單刀,鐵項鏈,桃符紙,繡花針,錦衣,水煙閣司事帽,阿拉伯彎刀,桃木劍,鐵手鐲,長劍,絲綢衣,長鬥篷");
      YFUI.showInput({
        title: _("设定需要清理的垃圾", "設定需要清理的垃圾"),
        text: _(`格式：物品词组<br>
						物品词组：以英文逗号分割多个关键词<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">破烂衣服,水草,木盾,铁盾,藤甲盾,青铜盾,鞶革,军袍,麻带,破披风,长斗篷,牛皮带</span><br>
						`,
            `格式：物品詞組<br>
						物品詞組：以英文逗號分割多個關鍵詞<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">破爛衣服,水草,木盾,鐵盾,藤甲盾,青銅盾,鞶革,軍袍,麻帶,破披風,長斗篷,牛皮帶</span><br>
						`),
        value: PLU.getCache("sellItemNames") || defaultList,
        type: "textarea",
        height: "150px",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          if (PLU.getCache("translate") && PLU.getCache("translate") == 1) str = Traditionalized(str);
          else if (PLU.getCache("translate") && PLU.getCache("translate") == 2) str = Simplized(str);
          PLU.setCache("sellItemNames", str);
        },
        onNo() { },
      });
    },
    //================================================================================================
    loopSellItems(itemList, split_itemList) {
      if (itemList.length <= 0) {
        PLU.setBtnRed($("#btn_bt_sellLaji"), 0);
        YFUI.writeToOut("<span style='color:#F66;'>--" + _("无", "無") + "出售物件!--</span>");
        PLU.loopSplitItem(split_itemList);
        return
      }
      let ac = [];
      itemList.forEach((it) => {
        let ct = it.num;
        while (ct > 0) {
          if (ct >= 10000) {
            ac.push("items sell " + it.key + "_N_10000");
            ct -= 10000;
          } else if (ct >= 1000) {
            ac.push("items sell " + it.key + "_N_1000");
            ct -= 1000;
          } else if (ct >= 100) {
            ac.push("items sell " + it.key + "_N_100");
            ct -= 100;
          } else if (ct >= 50) {
            ac.push("items sell " + it.key + "_N_50");
            ct -= 50;
          } else if (ct >= 10) {
            ac.push("items sell " + it.key + "_N_10");
            ct -= 10;
          } else {
            ac.push("items sell " + it.key + "");
            ct -= 1;
          }
        }
      });
      let acs = ac.join(";");
      PLU.fastExec(acs, () => {
        PLU.setBtnRed($("#btn_bt_sellLaji"), 0);
        PLU.execActions("Log?出售完成", () => {
          PLU.loopSplitItem(split_itemList);
        });
      });
    },
    //================================================================================================
    toSplitItem($btn) {
      let defaultList =
        _("玄武盾,破军盾,金丝宝甲衣,夜行披风,羊毛斗篷,残雪戒,残雪项链,残雪手镯,残雪鞋,金丝甲,宝玉甲,月光宝甲,虎皮腰带,沧海护腰,红光匕,毒龙鞭,玉清棍,霹雳掌套",
        "玄武盾,破軍盾,金絲寶甲衣,夜行披風,羊毛斗篷,殘雪戒,殘雪項鏈,殘雪手鐲,殘雪鞋,金絲甲,寶玉甲,月光寶甲,虎皮腰帶,滄海護腰,紅光匕,毒龍鞭,玉清棍,霹靂掌套");
      YFUI.showInput({
        title: _("分解装备", "分解裝備"),
        text: _(`格式：物品词组<br>
						物品词组：以英文逗号分割多个关键词<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">玄武盾,破军盾,金丝宝甲衣,夜行披风,羊毛斗篷,残雪戒,残雪项链,残雪手镯,残雪鞋,金丝甲</span><br>
						`,
            `格式：物品詞組<br>
						物品詞組：以英文逗號分割多個關鍵詞<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">玄武盾,破軍盾,金絲寶甲衣,夜行披風,羊毛斗篷,殘雪戒,殘雪項鏈,殘雪手鐲,殘雪鞋,金絲甲</span><br>
						`),
        value: PLU.getCache("splitItemNames") || defaultList,
        type: "textarea",
        height: "150px",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          if (PLU.getCache("translate") && PLU.getCache("translate") == 1) str = Traditionalized(str);
          else if (PLU.getCache("translate") && PLU.getCache("translate") == 2) str = Simplized(str);
          PLU.setCache("splitItemNames", str);
        },
        onNo() { },
      });
    },
    //================================================================================================
    loopSplitItem(itemList) {
      if (itemList.length <= 0) {
        PLU.setBtnRed($("#btn_bt_splitItem"), 0);
        return YFUI.writeToOut("<span style='color:#F66;'>--" + _("无", "無") + "分解物件!--</span>");
      }
      let ac = [];
      itemList.forEach((it) => {
        let ct = it.num;
        while (ct > 0) {
          if (ct >= 100) {
            ac.push("items splite " + it.key + "_N_100");
            ct -= 100;
          } else if (ct >= 50) {
            ac.push("items splite " + it.key + "_N_50");
            ct -= 50;
          } else if (ct >= 10) {
            ac.push("items splite " + it.key + "_N_10");
            ct -= 10;
          } else {
            ac.push("items splite " + it.key + "");
            ct -= 1;
          }
        }
      });
      let acs = ac.join(";");
      PLU.fastExec(acs, () => {
        PLU.setBtnRed($("#btn_bt_splitItem"), 0);
        YFUI.writeToOut("<span style='color:white;'>==分解完成!==</span>");
      });
    },
    //================================================================================================
    toPutStore($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      let defaultList =
      _("树枝,碎片,璞玉,青玉,墨玉,白玉,秘籍木盒,锦袋,瑞雪针釦,武穆遗书,隐武竹笺,空识卷轴,技能书,开元宝票,霹雳弹,舞鸢尾,百宜雪梅",
      "樹枝,碎片,璞玉,青玉,墨玉,白玉,秘籍木盒,錦袋,瑞雪針釦,武穆遺書,隱武竹箋,空識卷軸,技能書,開元寶票,霹靂彈,舞鳶尾,百宜雪梅");
      YFUI.showInput({
        title: _("物品入库", "物品入庫"),
        text: _(`格式：物品词组<br>
						物品词组：以英文逗号分割多个关键词<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">${defaultList}</span><br>
						`,
            `格式：物品詞組<br>
						物品詞組：以英文逗號分割多個關鍵詞<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">${defaultList}</span><br>
						`),
        value: PLU.getCache("putStoreNames") || defaultList,
        type: "textarea",
        height: "150px",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          if (PLU.getCache("translate") && PLU.getCache("translate") == 1) str = Traditionalized(str);
          else if (PLU.getCache("translate") && PLU.getCache("translate") == 2) str = Simplized(str);
          PLU.setCache("putStoreNames", str);
          let keysList = str.split(",").join("|");
          let itemsTimeOut = setTimeout(() => {
            UTIL.delSysListener("listItems_ps");
          }, 5000);
          UTIL.addSysListener("listItems_ps", function (b, type, subtype, msg) {
            if (type != "items") return;
            UTIL.delSysListener("listItems_ps");
            clearTimeout(itemsTimeOut);
            clickButton("prev");
            let iId = 1,
              itemList = [];
            while (b.get("items" + iId)) {
              let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
              if (it && it.length > 4 && it[3] == "0" && it[1].match(keysList) && it[1] != _("青龙碎片", "青龍碎片") && it[1] != _("玄铁碎片", "玄鐵碎片"))
                itemList.push({
                  key: it[0],
                  name: it[1],
                  num: Number(it[2]),
                });
              iId++;
            }
            PLU.loopPutStore(itemList);
          });
          clickButton("items", 0);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopSortItems(put_itemList, sell_itemList, split_itemList) {
      if (put_itemList.length <= 0) {
        PLU.setBtnRed($("#btn_bt_putStore"), 0);
        YFUI.writeToOut("<span style='color:#F66;'>--" + _("无物件入库", "無物件入庫") + "!--</span>");
        PLU.loopSellItems(sell_itemList, split_itemList);
        return
      }
      let ac = [];
      put_itemList.forEach((it) => {
        ac.push("items put_store " + it.key + "");
      });
      PLU.fastExec(ac.join(";"), () => {
        PLU.setBtnRed($("#btn_bt_putStore"), 0);
        PLU.execActions("Log?" + _("入库完成", "入庫完成"), () => {
          PLU.loopSellItems(sell_itemList, split_itemList);
        });
      });
    },
    //================================================================================================
    loopPutStore(itemList) {
      if (itemList.length <= 0) {
        PLU.setBtnRed($("#btn_bt_putStore"), 0);
        return YFUI.writeToOut("<span style='color:#F66;'>--" + _("无物件入库", "無物件入庫") + "!--</span>");
      }
      let ac = [];
      itemList.forEach((it) => {
        ac.push("items put_store " + it.key + "");
      });
      PLU.fastExec(ac.join(";"), () => {
        PLU.setBtnRed($("#btn_bt_putStore"), 0);
        YFUI.writeToOut("<span style='color:white;'>==" + _("入库完成", "入庫完成") + "!==</span>");
      });
    },
    fuzzyMatch(str, target) {
      return target.includes(str);
    },
    //================================================================================================
    toAutoUse($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      let defaultList =
      _("*神秘宝箱,*修炼点锦袋,*蛮荒上古宝盒,*国庆特典礼盒,*周年庆特典礼盒,*元祖月饼礼盒,*风驰电掣散,*药罐,*金刚霸体丸,*玄冰寒露丸,*无尽真元丸,*碧波春水丹,*薄暮幽影丹,*地灵康复丸,*下品丹药炉,*血气罡天丹,*不动如山丹,*雪山冰蚕,*力贯九天丸,*神准一眼丸,*保险卡,*龙神试炼宝盒,*龙神试炼福袋,*龙神试炼锦囊,*龙神试炼礼包,*龙族赐福锦囊,*龙辰礼包,*甲辰年庆典礼包,*妃子笑荔枝,*糯米糍荔枝,*白糖罂荔枝,*桂味荔枝,*三月红荔枝,*莽古朱蛤,*红豆汤圆,*奇异果汤圆,*酒酿汤圆,*芝麻汤圆,*豆沙双黄月饼,*黄金奶油月饼,*神秘渔护,*高级幸运钓竿,*垂钓一夏百宝箱,*垂钓一夏玉匣,*暴击谜题玉匣,*暴击谜题百宝箱",
      "*神秘寶箱,*修煉點錦袋,*蠻荒上古寶盒,*國慶特典禮盒,*周年慶特典禮盒,*元祖月餅禮盒,*風馳電掣散,*藥罐,*金剛霸體丸,*玄冰寒露丸,*無盡真元丸,*碧波春水丹,*薄暮幽影丹,*地靈康復丸,*下品丹藥爐,*血氣罡天丹,*不動如山丹,*雪山冰蠶,*力貫九天丸,*神準一眼丸,*保險卡,*龍神試煉寶盒,*龍神試煉福袋,*龍神試煉錦囊,*龍神試煉禮包,*龍族賜福錦囊,*龍辰禮包,*甲辰年慶典禮包,*妃子笑荔枝,*糯米糍荔枝,*白糖罌荔枝,*桂味荔枝,*三月紅荔枝,*莽古朱蛤,*紅豆湯圓,*奇異果湯圓,*酒釀湯圓,*芝麻湯圓,*豆沙雙黃月餅,*黃金奶油月餅,*神秘漁護,*高級幸運釣竿,*垂釣一夏百寶箱,*垂釣一夏玉匣,*暴擊謎題玉匣,*暴擊謎題百寶箱");
      YFUI.showInput({
        title: "物品使用",
        text: _(`格式：物品词组<br>
						物品词组：以英文逗号分割多个关键词, 只能单个使用的物品前面加*星号<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">*神秘宝箱,*金刚霸体丸,*玄冰寒露丸,*无尽真元丸,*碧波春水丹,*风驰电掣散,*薄暮幽影丹,*地灵康複丸,*牛币,*欢庆贺卡</span><br>
						`,
            `格式：物品詞組<br>
						物品詞組：以英文逗號分割多個關鍵詞, 只能單個使用的物品前面加*星號<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">*神秘寶箱,*金剛霸體丸,*玄冰寒露丸,*無盡真元丸,*碧波春水丹,*風馳電掣散,*薄暮幽影丹,*地靈康複丸,*牛幣,*歡慶賀卡</span><br>
						`),
        value: PLU.getCache("autoUseNames") || defaultList,
        type: "textarea",
        height: "150px",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          if (PLU.getCache("translate") && PLU.getCache("translate") == 1) str = Traditionalized(str);
          else if (PLU.getCache("translate") && PLU.getCache("translate") == 2) str = Simplized(str);
          PLU.setCache("autoUseNames", str);
          let keysList = str.split(",");
          let keyList_M = [];
          let keyList_U = [];
          keysList.forEach(function(it1) {
            if (it1.charAt(0) == "*") {
              keyList_U.push(it1);
            } else {
              keyList_M.push(it1);
            }
          })
          let itemsTimeOut = setTimeout(() => {
            UTIL.delSysListener("listItems_au");
          }, 5000);
          UTIL.addSysListener("listItems_au", function (b, type, subtype, msg) {
            if (type != "items") return;
            UTIL.delSysListener("listItems_au");
            clearTimeout(itemsTimeOut);
            clickButton("prev");
            let iId = 1,
              itemList = [];
            while (b.get("items" + iId)) {
              let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
              var k = PLU.dispatchChineseMsg(it[1]).replace(/ /g, "");
              if (!k) continue;
              if (it && it.length > 4 && it[3] == "0") {
                if (keysList.includes(k)) itemList.push({
                  key: it[0],
                  name: it[1],
                  num: Number(it[2]),
                  multi: true
                });
                else if (keysList.includes("*" + k)) itemList.push({
                  key: it[0],
                  name: it[1],
                  num: Number(it[2]),
                  multi: false
                });
              }
              iId++;
            }
            PLU.loopAutoUse(itemList);
          });
          clickButton("items", 0);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopAutoUse(itemList, kp) {
      if (itemList.length <= 0 && !kp) {
        PLU.setBtnRed($("#btn_bt_autoUse"), 0);
        return YFUI.writeToOut("<span style='color:#F66;'>--" + _("无", "無") + "物件使用!--</span>");
      } else if (itemList.length <= 0 && kp) {
        PLU.setBtnRed($("#btn_bt_autoUse"), 0);
        return YFUI.writeToOut("<span style='color:white;'>--使用完成!--</span>");
      }
      let ac = [];
      itemList.forEach((it) => {
        let ct = it.num;
        while (ct > 0) {
          if (it.multi && ct >= 100) {
            ac.push("items use " + it.key + "_N_100");
            ct -= 100;
          } else if (it.multi && ct >= 50) {
            ac.push("items use " + it.key + "_N_50");
            ct -= 50;
          } else if (it.multi && ct >= 10) {
            ac.push("items use " + it.key + "_N_10");
            ct -= 10;
          } else {
            ac.push("items use " + it.key + "");
            ct -= 1;
          }
        }
      });
      PLU.fastExec(ac.join(";"), () => {
        let keysList = PLU.getCache("autoUseNames").split(",");
        let itemsTimeOut = setTimeout(() => {
          UTIL.delSysListener("listItems_au");
        }, 5000);
        UTIL.addSysListener("listItems_au", function (b, type, subtype, msg) {
          if (type != "items") return;
          UTIL.delSysListener("listItems_au");
          clearTimeout(itemsTimeOut);
          clickButton("prev");
          let iId = 1,
            itemList = [];
          while (b.get("items" + iId)) {
            let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
            var k = PLU.dispatchChineseMsg(it[1]);
            if (!k) continue;
            if (it && it.length > 4 && it[3] == "0") {
              if (keysList.includes(k)) itemList.push({
                key: it[0],
                name: it[1],
                num: Number(it[2]),
                multi: true
              });
              else if (keysList.includes("*" + k)) itemList.push({
                key: it[0],
                name: it[1],
                num: Number(it[2]),
                multi: false
              });
            }
            iId++;
          }
          PLU.loopAutoUse(itemList, true);
        });
        clickButton("items", 0);
      });
    },
    //================================================================================================
    toLoopScript($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopScript").text(_("循环执行", "循環執行"));
        PLU.STO.loopScTo && clearTimeout(PLU.STO.loopScTo) && delete PLU.STO.loopScTo;
        return;
      }
      YFUI.showInput({
        title: _("循环执行", "循環執行"),
        text: _(`格式：循环次数@时间间隔|执行指令<br>
						循环次数：省略则默认1次<br>
						时间间隔：省略则默认1(1秒)<br>
						执行指令：以分号分隔的指令<br>
						<span style="color:red;">例如</span><br>
						[例1] 3@5|jh 1;e;n;home;<br>
						[例2] jh 5;n;n;n;w;sign7;
						`,
            `格式：循環次數@時間間隔|執行指令<br>
						循環次數：省略則默認1次<br>
						時間間隔：省略則默認1(1秒)<br>
						執行指令：以分號分隔的指令<br>
						<span style="color:red;">例如</span><br>
						[例1] 3@5|jh 1;e;n;home;<br>
						[例2] jh 5;n;n;n;w;sign7;
						`),
        value: PLU.getCache("loopScript") || "home;",
        type: "textarea",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            scripts = "",
            times = 1,
            interval = 1,
            arr = str.split("|");
          if (arr.length > 1) {
            scripts = arr[1];
            if (arr[0].indexOf("@") >= 0) {
              times = Number(arr[0].split("@")[0]) || 1;
              interval = Number(arr[0].split("@")[1]) || 1;
            } else {
              times = Number(arr[0]) || 1;
            }
          } else {
            scripts = arr[0];
          }
          PLU.setCache("loopScript", str);
          PLU.loopScript(scripts, times, interval);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopScript(scripts, times, interval) {
      times--;
      $("#btn_bt_loopScript").text("停執行(" + times + ")");
      PLU.execActions(scripts, () => {
        if (times <= 0 || !PLU.ONOFF["btn_bt_loopScript"]) {
          PLU.setBtnRed($("#btn_bt_loopScript"), 0);
          $("#btn_bt_loopScript").text(_("循环执行", "循環執行"));
          PLU.STO.loopScTo && clearTimeout(PLU.STO.loopScTo) && delete PLU.STO.loopScTo;
          return;
        } else {
          PLU.STO.loopScTo = setTimeout(() => {
            PLU.loopScript(scripts, times, interval);
          }, interval * 1000);
        }
      });
    },
    //================================================================================================
    toAutoAskQixia($btn, autoTime) {
      if (g_gmain.is_fighting) return;
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      $(".menu").hide();
      YFUI.showPop({
        title: _("自动访问奇侠", "自動訪問奇俠"),
        text: _("自动对话所有有亲密度的奇侠<br>请在做完20次赞助金锭后再进行<br><b style='color:#F00;'>是否现在进行?</b>", "自動對話所有有親密度的奇俠<br>請在做完20次讚助金錠後再進行<br><b style='color:#F00;'>是否現在進行?</b>"),
        autoOk: autoTime ?? null,
        onOk() {
          let jhqxTimeOut = setTimeout(() => {
            UTIL.delSysListener("listQixia");
            PLU.setBtnRed($btn, 0);
          }, 5000);
          UTIL.addSysListener("listQixia", function (b, type, subtype, msg) {
            if (type != "show_html_page" || msg.indexOf(_("江湖奇侠成长信息", "江湖奇俠成長信息")) < 0) return;
            UTIL.delSysListener("listQixia");
            clearTimeout(jhqxTimeOut);
            let listHtml = msg;
            clickButton("prev");
            let str = "find_task_road qixia (\\d+)\x03(.{2,4})\x030\x03\\((\\d+)\\)(.{15,25}朱果)?.{30,50}" + _("已出师", "已出師"),
              rg1 = new RegExp(str, "g"),
              rg2 = new RegExp(str),
              visQxs = [];
            listHtml.match(rg1).forEach((e) => {
              let a = e.match(rg2);
              if (a)
                visQxs.push({
                  key: a[1],
                  name: a[2],
                  num: Number(a[3]),
                  link: "find_task_road qixia " + a[1],
                  fast: a[4] ? "open jhqx " + a[1] : null,
                });
            });
            visQxs = visQxs.sort((a, b) => {
              if (a.fast && b.num >= 25000) return -1;
              else return 2;
            });
            visQxs.reverse();
            PLU.toAskQixia(visQxs, 0);
          });
          clickButton("open jhqx", 0);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    toAskQixia(qxList, idx) {
      clickButton("home");
      if (idx >= qxList.length || !PLU.ONOFF["btn_bt_autoAskQixia"]) {
        PLU.setBtnRed($("#btn_bt_autoAskQixia"), 0);
        YFUI.writeToOut("<span style='color:#FFF;'>--" + _("奇侠访问结束", "奇俠訪問結束") + "!--</span>");
        return;
      }
      let qxObj = qxList[idx];
      if (qxObj.fast) {
        clickButton(qxObj.fast, 0);
        setTimeout(() => {
          PLU.toAskQixia(qxList, idx + 1);
        }, 500);
      } else {
        PLU.execActions(qxObj.link + ";golook_room;", () => {
          let objNpc = UTIL.findRoomNpc(qxObj.name, false, true);
          if (objNpc) {
            PLU.execActions("ask " + objNpc.key + ";ask " + objNpc.key + ";ask " + objNpc.key + ";ask " + objNpc.key + ";ask " + objNpc.key + ";golook_room;", () => {
              setTimeout(() => {
                PLU.toAskQixia(qxList, idx + 1);
              }, 500);
            });
          } else {
            YFUI.writeToOut("<span style='color:#FFF;'>--" + _("找不到奇侠:", "找不到奇俠:") + qxObj.name + "--</span>");
            setTimeout(() => {
              PLU.toAskQixia(qxList, idx + 1);
            }, 500);
          }
        });
      }
    },
    //================================================================================================
    getQixiaList(callback) {
      let jhQixiaTimeOut = setTimeout(() => {
        UTIL.delSysListener("getlistQixia");
      }, 5000);
      UTIL.addSysListener("getlistQixia", function (b, type, subtype, msg) {
        if (type != "show_html_page" || msg.indexOf(_("江湖奇侠成长信息", "江湖奇俠成長信息")) < 0) return;
        UTIL.delSysListener("getlistQixia");
        clearTimeout(jhQixiaTimeOut);
        window.ttttt = msg;
        let listHtml = msg.replace(/\x03(0)?|href;0;|[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
        clickButton("prev");
        let str =
          "find_task_road qixia (\\d+)(.{2,4})(\\((\\d*)\\))?(open jhqx \\d+朱果)?<\\/td><td.{20,35}>(.{1,10})<\\/td><td.{20,35}>(.{1,15})<\\/td><td .{20,40}" + _("领悟", "領悟") + "(.{2,10})<\\/td><\\/tr>";
        let rg1 = new RegExp(str, "g"),
          rg2 = new RegExp(str),
          qxList = [];
        listHtml.match(rg1).forEach((e) => {
          let a = e.match(rg2);
          if (a)
            qxList.push({
              index: a[1],
              name: a[2],
              num: Number(a[4]) || 0,
              link: "find_task_road qixia " + a[1],
              fast: a[5] ? "open jhqx " + a[1] : null,
              inJh: a[6] && a[6].indexOf("未出世") < 0 ? true : false,
            });
        });
        callback && callback(qxList);
      });
      clickButton("open jhqx", 0);
    },
    //================================================================================================
    toAutoVisitQixia($btn) {
      if (g_gmain.is_fighting) return;
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.TMP.autoQixiaMijing = false;
        return;
      }
      $(".menu").hide();
      clickButton("open jhqx", 0);
      let ckeds = PLU.getCache("visitQixiaArray")|| [false, false];
      let ck1 = "";
      let ck2 = "";
      ckeds.forEach(function(element, index) {
        if (index == 0 && element == true) {
          ck1 = " checked";
        } else if (index == 1 && element == true) {
          ck2 = " checked"
        }
      });
      YFUI.showInput({
        title: _("奇侠秘境", "奇俠秘境"),
        text:_(`请输入要提升亲密度的游侠的姓名<br>
                        格式：金锭数量|游侠姓名@目标友好度<br>
						金锭数量：给予1或5或15金锭，可省略则只对话<br>
						游侠姓名：只能输入一个游侠姓名<br>
						目标友好度：省略则以可学技能的友好度为目标<br>
						<span style="color:red;">例如</span><br>
						[例1] 15|风无痕 <span style="color:blue;">访问风无痕赠与15金锭</span><br>
						[例2] 火云邪神 <span style="color:blue;">访问火云邪神对话</span><br>
						[例2] 15|步惊鸿@30000 <span style="color:blue;">访问步惊鸿对话赠与15金锭到30000友好度</span><br>
						`,
          `請輸入要提升親密度的遊俠的姓名<br>
                        格式：金錠數量|遊俠姓名@目標友好度<br>
						金錠數量：給予1或5或15金錠，可省略則只對話<br>
						遊俠姓名：只能輸入一個遊俠姓名<br>
						目標友好度：省略則以可學技能的友好度為目標<br>
						<span style="color:red;">例如</span><br>
						[例1] 15|風無痕 <span style="color:blue;">訪問風無痕贈與15金錠</span><br>
						[例2] 火雲邪神 <span style="color:blue;">訪問火雲邪神對話</span><br>
						[例2] 15|步驚鴻@30000 <span style="color:blue;">訪問步驚鴻對話贈與15金錠到30000友好度</span><br>
						`) +

          '<div style="text-align:right;"><label>' + _('自动挖宝', '自動挖寶') + ':<input type="checkbox" id="if_auto_wb" name="awb" value="1"' + ck1 + '/></label><label>' + _('不要扫荡秘境', '不要掃盪秘境') + ':<input type="checkbox" id="if_auto_mj" name="noamj" value="1"' + ck2 + '/></label></div>',
        value: PLU.getCache("visitQixiaName") || _("15|风无痕@40000", "15|風無痕@40000"),
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            arr = str.split("|"),
            giveNum = 15,
            qxName = "",
            objectFN = 0;
          let ifAutoWb = $("#if_auto_wb").is(":checked");
          let ifAutoMj = $("#if_auto_mj").is(":checked");
          PLU.setCache("visitQixiaArray", [ifAutoWb, ifAutoMj]);
          if (arr.length > 1) {
            giveNum = Number(arr[0]) || 15;
            let nn = arr[1].split("@");
            qxName = nn[0].trim();
            if (nn.length > 1) objectFN = Number(nn[1]);
          } else {
            giveNum = 0;
            let nn = arr[0].split("@");
            qxName = nn[0].trim();
            if (nn.length > 1) objectFN = Number(nn[1]);
          }
          PLU.setCache("visitQixiaName", str);
          PLU.TMP.todayGetXT = 0;
          UTIL.delSysListener("listenVisitNotice");
          PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
          PLU.TMP.goingQixiaMijing = false;
          PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, (err) => {
            if (err) {
              if (err.code == 1) {
                PLU.setBtnRed($btn, 0);
                UTIL.delSysListener("listenVisitNotice");
                PLU.toAutoAskQixia($("#btn_bt_autoAskQixia"), 10);
                YFUI.writeToOut("<span style='color:yellow;'> " + _("今日一共获得玄铁令x", "今日一共獲得玄鐵令x") + PLU.TMP.todayGetXT + "</span>");
                UTIL.log({
                  msg: _(" 今日一共获得玄铁令x ", " 今日一共獲得玄鐵令x ") + PLU.TMP.todayGetXT + "  ",
                  type: "TIPS",
                  time: new Date().getTime(),
                });
              } else {
                YFUI.showPop({
                  title: "提示",
                  text: "<b style='color:#F00;'>" + err.msg + "</b>",
                  onOk() {
                    PLU.setBtnRed($btn, 0);
                    PLU.toAutoVisitQixia($btn);
                  },
                  onX() {
                    PLU.setBtnRed($btn, 0);
                  },
                });
              }
            }
          });
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
        onX() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback) {
      PLU.TMP.autoQixiaMijing = true;
      //發現
      PLU.getQixiaList((qxlist) => {
        let testDone = qxlist.find((e) => !!e.fast);
        if (testDone) {
          PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
          callback && callback({ code: 1, msg: _("今日奇侠友好度操作已经完毕", "今日奇俠友好度操作已經完畢") });
          return;
        }
        let qx = qxlist.find((e) => e.name == qxName);
        if (!qx) {
          callback && callback({ code: 2, msg: _("没有这个奇侠!", "沒有這個奇俠!") });
          return;
        }
        if (!qx.inJh) {
          callback && callback({ code: 3, msg: _("这个奇侠还没出师!", "這個奇俠還沒出師!") });
          return;
        }
        let objectFriendNum = objectFN ?? PLU.YFD.qixiaFriend.find((e) => e.name == qxName).skillFN;
        if (qx.num >= objectFriendNum) {
          callback && callback({ code: 4, msg: _("奇侠友好度已足够", "奇俠友好度已足夠") });
          return;
        }
        let listenVisitTimeout = function () {
          if (!PLU.TMP.goingQixiaMijing) PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
        };
        UTIL.delSysListener("listenVisitNotice");
        //監聽場景消息
        UTIL.addSysListener("listenVisitNotice", function (b, type, subtype, msg) {
          if (type == "jh" && subtype == "info" && b.get("no_map")) {
            let mapid = b.get("map_id");
            let shortName = b.get("short");
            YFUI.writeToOut("<span style='color:#FFF;'>--" + _("地图ID:", "地圖ID:") + mapid + "--</span>");
            if (mapid == "public") {
              PLU.execActions("secret_op1;", () => {
                PLU.TMP.goingQixiaMijing = false;
                PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
              });
            } else if (ifAutoMj) {
              UTIL.delSysListener("listenVisitNotice");
              PLU.setBtnRed($("#btn_bt_autoVisitQixia"), 0);
              YFUI.writeToOut("<span style='color:yellow;'> ===== " + _("进", "進") + "入了秘境! ===== </span>");
            } else {
              let ss = g_obj_map.get("msg_room").elements.find((e) => e.value == _("仔细搜索", "仔細搜索"));
              if (ss) {
                let cmd_ss = g_obj_map.get("msg_room").get(ss.key.split("_")[0]);
                PLU.execActions(cmd_ss + ";;", () => {
                  if (ifAutoWb) {
                    let wb = g_obj_map.get("msg_room").elements.find((e) => e.value.indexOf(_("秘境挖宝", "秘境挖寶")) >= 0);
                    if (wb) {
                      PLU.execActions("mijing_wb;;");
                    }
                  }

                  let sd = g_obj_map.get("msg_room").elements.find((e) => e.value.indexOf(_("扫荡", "掃盪")) >= 0);
                  if (sd) {
                    let cmd_sd = g_obj_map.get("msg_room").get(sd.key.split("_")[0]);
                      PLU.doSaoDang(mapid, cmd_sd, () => {
                        PLU.TMP.goingQixiaMijing = false;
                        PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                      });
                  } else if (shortName == _("无尽深渊", "無盡深淵")) {
                    PLU.goWuJinShenYuan(() => {
                      PLU.TMP.goingQixiaMijing = false;
                      PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                    });
                  } else {
                    UTIL.delSysListener("listenVisitNotice");
                    PLU.setBtnRed($("#btn_bt_autoVisitQixia"), 0);
                    YFUI.writeToOut("<span style='color:yellow;'> ===" + _("进入了未通关秘境","進入了未通關秘境") + "!=== </span>");
                  }
                });
              }
            }
            return
          }
          if (type != "notice" && type != "main_msg") return;
          let msgTxt = UTIL.filterMsg(msg);
          if (msgTxt.match(_("对你悄声道：你现在去", "對你悄聲道：你現在去"))) {
            //奇俠說秘境
            let l = msgTxt.match(_(/(.*)对你悄声道：你现在去(.*)，应当会有发现/, /(.*)對你悄聲道：你現在去(.*)，應當會有發現/));
            if (l && l.length > 2) {
              PLU.TMP.goingQixiaMijing = true;
              let placeData = PLU.YFD.mjList.find((e) => e.n == l[2]);
              if (placeData) {
                PLU.execActions(placeData.v + ";find_task_road secret;")
              }
              return
            }
          }
          let vis = msgTxt.match(_(/今日亲密度操作次数\((\d+)\/20\)/, /今日親密度操作次數\((\d+)\/20\)/));
          if (vis) {
            PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
            setTimeout(() => {
              if (!PLU.TMP.goingQixiaMijing) {
                PLU.STO.listenVisit = setTimeout(listenVisitTimeout, 4000);
                let objNpc = UTIL.findRoomNpc(qxName, false, true);
                if (objNpc) {
                  PLU.doVisitAction(objNpc.key, giveNum);
                } else {
                  YFUI.writeToOut("<span style='color:#FFF;'>--" + _("找不到奇侠", "找不到奇俠") + "!--</span>");
                  setTimeout(() => {
                    PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                  }, 500);
                }
              }
            }, 500);
            return;
          }
          if (msgTxt.match(_("今日做了太多关于亲密度的操作", "今日做了太多關於親密度的操作"))) {
            PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
            callback && callback({ code: 1, msg: _("今日奇侠友好度操作已经完毕", "今日奇俠友好度操作已經完畢") });
            return;
          }
          if (msgTxt.match(_(/今日奇侠赠送次数(\d+)\/(\d+)，.*赠送次数(\d+)\/(\d+)/, /今日奇俠贈送次數(\d+)\/(\d+)，.*贈送次數(\d+)\/(\d+)/))) {
            PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
            callback && callback({ code: 1, msg: _("今日奇侠友好度操作已经完毕", "今日奇俠友好度操作已經完畢") });
            return;
          }
          if (msgTxt.match(_("扫荡成功，获得：", "掃盪成功，獲得："))) {
            let xtnum = parseInt(msgTxt.split("、")[0].split(_("玄铁令x", "玄鐵令x"))[1]);
            if (xtnum) PLU.TMP.todayGetXT += xtnum;
            xtnum && YFUI.writeToOut("<span>--" + _("玄铁令+", "玄鐵令+") + xtnum + "--</span>");
            return;
          }
          if (msgTxt.match(_("你开始四处搜索……你找到了", "你開始四處搜索……你找到了"))) {
            let xtnum = parseInt(msgTxt.split("、")[0].split(_("玄铁令x", "玄鐵令x"))[1]);
            if (xtnum) PLU.TMP.todayGetXT += xtnum;
            xtnum && YFUI.writeToOut("<span>--" + _("玄铁令+", "玄鐵令+") + xtnum + "--</span>");
            return;
          }
        });
        PLU.execActions(qx.link + ";;", () => {
          let objNpc = UTIL.findRoomNpc(qxName, false, true);
          if (objNpc) {
            PLU.STO.listenVisit = setTimeout(listenVisitTimeout, 3000);
            PLU.doVisitAction(objNpc.key, giveNum);
          } else {
            YFUI.writeToOut("<span style='color:#FFF;'>--" + _("找不到奇侠:", "找不到奇俠:") + qxName + "--</span>");
            setTimeout(() => {
              PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
            }, 500);
          }
        });
      });
    },
    //================================================================================================
    doVisitAction(qxKey, giveNum) {
      if (giveNum == 0) {
        PLU.execActions("ask " + qxKey + ";");
      } else if (giveNum == 1) {
        PLU.execActions("auto_zsjd_" + qxKey.split("_")[0] + ";");
      } else if (giveNum == 5) {
        PLU.execActions("auto_zsjd5_" + qxKey.split("_")[0] + ";");
      } else {
        PLU.execActions("auto_zsjd20_" + qxKey.split("_")[0] + ";");
      }
    },
    //================================================================================================
    doSaoDang(mapid, cmd, callback) {
      UTIL.addSysListener("listenVisitSaodang", function (b, type, subtype, msg) {
        if (type != "prompt") return;
        let xtnum = parseInt(msg.split("、")[0].split(_("玄铁令x", "玄鐵令x"))[1]);
        if (["yaowanggu", "leichishan"].includes(mapid)) {
          if (xtnum < 5)
            return setTimeout(() => {
              clickButton(cmd);
            }, 300);
        } else if (["liandanshi", "lianhuashanmai", "qiaoyinxiaocun", "duzhanglin", "shanya", "langhuanyudong", "dixiamigong"].includes(mapid)) {
          if (xtnum < 3)
            return setTimeout(() => {
              clickButton(cmd);
            }, 300);
        }
        UTIL.delSysListener("listenVisitSaodang");
        PLU.execActions(cmd + " go;", () => {
          callback && callback();
        });
      });
      setTimeout(() => {
        clickButton(cmd);
      }, 300);
    },
    //================================================================================================
    goWuJinShenYuan(endcallback) {
      //無盡深淵
      let paths = "e;e;s;w;w;s;s;e;n;e;s;e;e;n;w;n;e;n;w".split(";");
      var sidx = 0;
      let gostep = function (pathArray, stepFunc) {
        let ca = pathArray[sidx];
        PLU.execActions(ca + "", () => {
          stepFunc && stepFunc();
          sidx++;
          if (sidx >= pathArray.length) {
            endcallback && endcallback();
          } else {
            setTimeout(() => {
              gostep(pathArray, stepFunc);
            }, 250);
          }
        });
      };
      gostep(paths, () => {
        let fc = g_obj_map.get("msg_room").elements.find((e) => e.value == "翻查");
        if (fc) {
          let cmd_fc = g_obj_map.get("msg_room").get(fc.key.split("_")[0]);
          PLU.execActions(cmd_fc + "");
        }
      });
    },
    //================================================================================================
    toWaitCDKill($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        return;
      }
      clickButton("golook_room");
      YFUI.showPop({
        title: _("倒计时叫杀门派纷争", "倒計時叫殺門派紛爭"),
        text: _("倒计时最后5秒叫杀最近结束时间的门派纷争!，确定后单击NPC<br>", "倒計時最後5秒叫殺最近結束時間的門派紛爭!，確定後單擊NPC<br>"),
        onOk() {
          setTimeout((o) => {
            $(document).one("click", (o) => {
              let npcbtn = $(o.target).closest("button");
              let snpc = npcbtn[0].outerHTML.match(/clickButton\('look_npc (\w+)'/i);
              if (snpc && snpc.length >= 2) {
                let nowTime = new Date().getTime(),
                  cMPFZ = null;
                for (let k in PLU.MPFZ) {
                  if (!cMPFZ || cMPFZ.t > PLU.MPFZ[k].t) cMPFZ = PLU.MPFZ[k];
                }
                if (cMPFZ) {
                  PLU.TMP.DATA_MPFZ = Object.assign({}, cMPFZ, {
                    killId: snpc[1],
                  });
                  YFUI.showPop({
                    title: _("倒计时叫杀门派纷争", "倒計時叫殺門派紛爭"),
                    text:
                      '<div style="line-height:2;">人物：' +
                      npcbtn.text() +
                      _("<br>地点：", "<br>地點：") +
                      PLU.TMP.DATA_MPFZ.p +
                      _("<br>对决：", "<br>對決：") +
                      PLU.mp2icon(PLU.TMP.DATA_MPFZ.v) +
                      "</div>",
                    okText: "好的",
                    onOk() { },
                    onNo() {
                      PLU.TMP.DATA_MPFZ = null;
                      PLU.setBtnRed($btn, 0);
                    },
                  });
                }
              } else {
                PLU.TMP.DATA_MPFZ = null;
                PLU.setBtnRed($btn, 0);
              }
            });
          }, 500);
        },
        onNo() {
          PLU.TMP.DATA_MPFZ = null;
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    mp2icon(mplist) {
      let htm = "",
        zfarr = mplist.split(" VS "),
        zarr = zfarr[0].split("、"),
        farr = zfarr[1].split("、");
      zarr.forEach((zm) => {
        htm += '<span style="display:inline-block;background:#F66;border-radius:2px;padding:0 2px;margin:1px;color:#FFF;">' + zm + "</span>";
      });
      htm += '<span style="color:#FFF;background:#F00;font-weight:bold;border-radius:50%;padding:2px;">VS</span>';
      farr.forEach((fm) => {
        htm += '<span style="display:inline-block;background:#66F;border-radius:2px;padding:0 2px;margin:1px;color:#FFF;">' + fm + "</span>";
      });
      return htm;
    },
    //================================================================================================
    toCheckAndWaitCDKill(nowTime) {
      let k = PLU.TMP.DATA_MPFZ.t + 1560000;
      let dt = Math.floor((k - nowTime) / 1000);
      if (dt == 5) {
        YFUI.writeToOut("<span style='color:#F99;'>--" + _("最后5秒,进入战斗", "最後5秒,進入戰鬥") + "!--</span>");
        //PLU.TMP.DATA_MPFZ = null
        //PLU.setBtnRed($btn,0)
        PLU.autoFight({
          targetKey: PLU.TMP.DATA_MPFZ.killId,
          fightKind: "kill",
          onFail() {
            PLU.TMP.DATA_MPFZ = null;
            PLU.setBtnRed($("#btn_bt_waitCDKill"), 0);
            PLU.execActions("home;")
          },
          onEnd() {
            PLU.TMP.DATA_MPFZ = null;
            PLU.setBtnRed($("#btn_bt_waitCDKill"), 0);
            PLU.execActions("home;")
          },
        });
      }
    },
    //================================================================================================
    setListen($btn, listenKey, stat) {
      let btnFlag = 0;
      if (stat != undefined) {
        btnFlag = PLU.setBtnRed($btn, stat);
        PLU.setCache(listenKey, stat);
        return;
      } else {
        btnFlag = PLU.setBtnRed($btn);
      }
      if (!btnFlag) {
        PLU.setCache(listenKey, 0);
        return;
      }
      if (listenKey == "listenQL") {
        //監聽青龍
        YFUI.showInput({
          title: _("监听本服青龙", "監聽本服青龍"),
          text: _(`格式：击杀类型|物品词组<br>
                            击杀类型：0杀守方(好人)，1杀攻方(坏人)。<br>
                            物品词组：以英文逗号分割多个关键词<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">0|斩龙,斩龙宝镯,碎片</span><br>
                            [例2] <span style="color:blue;">1|*</span>;
                            `,
                            `格式：擊殺類型|物品詞組<br>
                            擊殺類型：0殺守方(好人)，1殺攻方(壞人)。<br>
                            物品詞組：以英文逗號分割多個關鍵詞<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">0|斬龍,斬龍寶鐲,碎片</span><br>
                            [例2] <span style="color:blue;">1|*</span>;
                            `),
          value: PLU.getCache(listenKey + "_keys") || _("0|斩龙,开天宝棍,天罡掌套,龙皮至尊甲衣", "0|斬龍,開天寶棍,天罡掌套,龍皮至尊甲衣"),
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str || str.indexOf("|") < 0) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "listenTF") {
        //監聽夜魔
        YFUI.showInput({
          title: _("监听逃犯", "監聽逃犯"),
          text: _(`格式：击杀类型|逃犯词组<br>
                            击杀类型：0杀守方(逃犯)，1杀攻方(捕快)。<br>
                            逃犯词组：以英文逗号分割多个关键词<br>
                            <span style="color:#F00;">【新人】以#开头则等候他人开杀再进</span><br>
                            <span style="color:#933;">例如：</span><br>
                            [例1] <span style="color:blue;">0|夜魔*段老大,#夜魔*流寇</span>
                            `,
                            `格式：擊殺類型|逃犯詞組<br>
                            擊殺類型：0殺守方(逃犯)，1殺攻方(捕快)。<br>
                            逃犯詞組：以英文逗號分割多個關鍵詞<br>
                            <span style="color:#F00;">【新人】以#開頭則等候他人開殺再進</span><br>
                            <span style="color:#933;">例如：</span><br>
                            [例1] <span style="color:blue;">0|夜魔*段老大,#夜魔*流寇</span>
                            `),
          value: PLU.getCache(listenKey + "_keys") || _("0|夜魔*段老大,夜魔*二娘,#夜魔*嶽老三,#夜魔*云老四,#夜魔*流寇,#夜魔*恶棍,#夜魔*剧盗", "0|夜魔*段老大,夜魔*二娘,#夜魔*嶽老三,#夜魔*雲老四,#夜魔*流寇,#夜魔*惡棍,#夜魔*劇盜"),
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str || str.indexOf("|") < 0) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
            PLU.setCache("listenTF_b", 1);
            PLU.splitTFParam();
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
            PLU.setCache("listenTF_b", 0);
          },
        });
      } else if (listenKey == "listenKFQL") {
        //監聽廣場青龍
        YFUI.showInput({
          title: _("监听广场青龙", "監聽廣場青龍"),
          text: _(`格式：击杀类型|物品词组<br>
                            击杀类型：0杀守方(好人)，1杀攻方(坏人)。<br>
                            物品词组：以英文逗号分割多个关键词<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">0|斩龙,斩龙宝镯,碎片</span><br>
                            [例2] <span style="color:blue;">1|*</span>;
                            `,
                            `格式：擊殺類型|物品詞組<br>
                            擊殺類型：0殺守方(好人)，1殺攻方(壞人)。<br>
                            物品詞組：以英文逗號分割多個關鍵詞<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">0|斬龍,斬龍寶鐲,碎片</span><br>
                            [例2] <span style="color:blue;">1|*</span>;
                            `),
          value: PLU.getCache(listenKey + "_keys") || _("1|斩龙,开天宝棍,天罡掌套,龙皮至尊甲衣", "1|斬龍,開天寶棍,天罡掌套,龍皮至尊甲衣"),
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str || str.indexOf("|") < 0) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "listenYX") {
        //監聽遊俠
        YFUI.showInput({
          title: _("监听游侠", "監聽遊俠"),
          text: _(`格式：游侠词组<br>
                            游侠词组：以英文逗号分割多个关键词<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">王语嫣,厉工,金轮法王,虚夜月,云梦璃,叶孤城</span><br>
                            `,
                            `格式：遊俠詞組<br>
                            遊俠詞組：以英文逗號分割多個關鍵詞<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">王語嫣,厲工,金輪法王,虛夜月,雲夢璃,葉孤城</span><br>
                            `),
          value: PLU.getCache(listenKey + "_keys") || [].concat(...PLU.YFD.youxiaList.map((e) => e.v)).join(","),
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "autoTP") {
        //監聽突破
        YFUI.showInput({
          title: _("持续突破", "持續突破"),
          text: _(`请输入需要自动突破的技能，以英文逗号分割，自动突破将在当前全部突破完后才开始。<br>
                            以1|开头使用金刚舍利加速<br>
                            以2|开头使用通天丸加速<br>
                            以3|开头使用突破宝典加速<br>
                            以4|开头使用三生石加速(未开发)<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">千影百伤棍,1|排云掌法,2|无相金刚掌,3|九天龙吟剑法,独孤九剑</span>
                            `,
                            `請輸入需要自動突破的技能，以英文逗號分割，自動突破將在當前全部突破完後才開始。<br>
                            以1|開頭使用金剛舍利加速<br>
                            以2|開頭使用通天丸加速<br>
                            以3|開頭使用突破寶典加速<br>
                            以4|開頭使用三生石加速(未開發)<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">千影百傷棍,1|排雲掌法,2|無相金剛掌,3|九天龍吟劍法,獨孤九劍</span>
                            `),
          value: PLU.getCache(listenKey + "_keys") || _("1|千影百伤棍,1|排云掌法,1|不动明王诀", "1|千影百傷棍,1|排雲掌法,1|不動明王訣"),
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
            PLU.getSkillsList((allSkills, tupoSkills) => {
              if (tupoSkills.length == 0) {
                PLU.toToPo();
              }
            });
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "autoAFK") {
        var yuanbao = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("yuanbao");
        var yuanbaoStr = Math.floor(yuanbao).toString(); // 將元寶數量轉換為字符串
        var deductedYuanbao = yuanbaoStr.length >= 5 ? Number(yuanbaoStr.slice(-5)) : 0; // 取後5位數作為扣除的元寶數量
        var targetYuanbao = yuanbao - deductedYuanbao; // 計算保留的元寶數量
        YFUI.writeToOut("<span style='color:#7FFF00;'>" + _("当前元宝数量: ", "當前元寶數量: ").concat(yuanbao || "未知", "</span>"));
        if (PLU.getCache("autoCC_stat")) var ck1 = " checked";
        YFUI.showInput({
          title: _("持续挂机", "持續掛機"),
          text: _("请输入需要保留的元宝数，默认为去掉元宝后五位后取整", "請輸入需要保留的元寶數，默認為去掉元寶後五位後取整")
          + '<div style="text-align:left;"><label>采茶:<input type="checkbox" id="autoCC" name="cc" value="1"' + ck1 + '/></label></div>',
          value: targetYuanbao,
          // 默認值為元寶數量減去扣除的元寶數量
          onOk: function onOk(val) {
            var num = Number($.trim(val));
            PLU.setCache(listenKey + "_key", num);
            PLU.setCache(listenKey, 1);
            var room = g_obj_map.get("msg_room");
            if (room) room = room.get("short");
            let autoCC = $("#autoCC").is(":checked");
            PLU.setCache("autoCC_stat", autoCC);
            if (autoCC) {
              if (room !== _("后山茶园", "後山茶園") || UTIL.inHome()) {
                PLU.teaing();
              }
            } else {
              if (room !== "桃溪" || UTIL.inHome()) {
                PLU.fishing();
              }
            }
          },
        });
      } else if (listenKey == "autoConnect") {
        YFUI.showInput({
          title: _("自动重连", "自動重連"),
          text: _(`请输入断线后自动重连的时间，重连方式为到时间自动刷新页面。<br>单位为秒，0代表不自动重连。<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">60</span> 代表60秒后刷新页面
                            `,
                            `請輸入斷線後自動重連的時間，重連方式為到時間自動刷新頁面。<br>單位為秒，0代表不自動重連。<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">60</span> 代表60秒後刷新頁面
                            `),
          value: PLU.getCache(listenKey + "_keys") || "0",
          //type:"textarea",
          onOk(val) {
            let v = Number(val);
            if (val == "") return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", v);
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "autoSignIn") {
        let autoSignInTimeUI = PLU.getCache("autoSignInTime");
        let autoSignInWeekUI = PLU.getCache("autoSignInWeek") || "一";
        YFUI.showPop({
          title: _("定时一键签到", "定時一鍵簽到"),
          text: _(`请输入自动签到的时间。<br>
						<div><span style="font-size:18px;line-height:2;">每日: </span><input id="autoSignInTime" type="time" style="font-size:20px;border-radius:5px;margin:10px 0" value="${autoSignInTimeUI}"/></div>
						` + `<div><span style="font-size:18px;line-height:2;">周常: </span><select id="autoSignInWeek" class="select-day">
                <option value="一">星期一</option>
                <option value="二">星期二</option>
                <option value="三">星期三</option>
                <option value="四">星期四</option>
                <option value="五">星期五</option>
                <option value="六">星期六</option>
                <option value="日">星期日</option>
              </select></div>`,
                `請輸入自動簽到的時間。<br>
            <div><span style="font-size:18px;line-height:2;">每日: </span><input id="autoSignInTime" type="time" style="font-size:20px;border-radius:5px;margin:10px 0" value="${autoSignInTimeUI}"/></div>
						` + `<div><span style="font-size:18px;line-height:2;">周常: </span><select id="autoSignInWeek" class="select-day">
                <option value="一">星期一</option>
                <option value="二">星期二</option>
                <option value="三">星期三</option>
                <option value="四">星期四</option>
                <option value="五">星期五</option>
                <option value="六">星期六</option>
                <option value="日">星期日</option>
              </select></div>`),
          onOk(e) {
            let v = $.trim($("#autoSignInTime").val());
            let w = $("#autoSignInWeek").val();
            if (v == "" || w == "") return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey, 1);
            PLU.setCache("autoSignInTime", v);
            PLU.setCache("autoSignInWeek", w);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
          afterOpen() {
            $('#autoSignInWeek').val(autoSignInWeekUI);
          }
        });
      } else if (listenKey == "autoQuitTeam") {
        //進塔離隊
        YFUI.showPop({
          title: _("进塔自动离队", "進塔自動離隊"),
          text: _(`是否进塔自动离队?<br>`, `是否進塔自動離隊?<br>`),
          onOk() {
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else {
        PLU.setCache(listenKey, 1);
        return;
      }
    },
    //================================================================================================
    autoMijing() {
      YFUI.showInput({
        title: _("监听秘境", "監聽秘境"),
        text: _(`监听秘境Boss死亡时领奖并离开秘境<br>若不需要领奖只要退出，在前头加上*<br>支持多个Boss<br>[例1] *法海,地龙`, `監聽秘境Boss死亡時領獎並離開秘境<br>若不需要領獎只要退出，在前頭加上*<br>支援多個Boss<br>[例1] *法海,地龍`),
        value: PLU.getCache("autoMijing_key") || _("*法海,地龙", "*法海,地龍"),
        okText: _("确定监听", "確定監聽"),
        noText: _("取消监听", "取消監聽"),
        onOk(val) {
          PLU.setCache("autoMijing", 1);
          PLU.setCache("autoMijing_key", val);
        },
        onNo() {
          PLU.setCache("autoMijing", 0);
        },
      });
    },
    //================================================================================================
    splitTFParam() {
      let ltl = (PLU.getCache("listenTF_keys").split("|")[1] || "").split(",");
      PLU.TMP.lis_TF_list = [];
      PLU.TMP.lis_TF_force = [];
      ltl.map((e, i) => {
        if (e.charAt(0) == "#") {
          PLU.TMP.lis_TF_list.push(e.substring(1));
          PLU.TMP.lis_TF_force.push(0);
        } else {
          PLU.TMP.lis_TF_list.push(e);
          PLU.TMP.lis_TF_force.push(1);
        }
      });
    },
    //================================================================================================
    goQinglong(npcName, place, gb, kf) {
      let placeData = PLU.YFD.qlList.find((e) => e.n == place);
      if (kf || (UTIL.inHome() && placeData)) {
        PLU.execActions(placeData.v + ";golook_room", () => {
          let objNpc = UTIL.findRoomNpc(npcName, !Number(gb));
          if (objNpc) {
            PLU.killQinglong(objNpc.key, 0);
          } else {
            YFUI.writeToOut("<span style='color:#FFF;'>--" + _("寻找目标失败", "尋找目標失敗") + "!--</span>");
            PLU.execActions("golook_room;home");
          }
        });
      }
    },
    //================================================================================================
    killQinglong(npcId, tryNum) {
      PLU.autoFight({
        targetKey: npcId,
        fightKind: "kill",
        autoSkill: "random",
        onFail(errCode) {
          if (errCode >= 88 && tryNum < 100) {
            setTimeout(() => {
              PLU.killQinglong(npcId, tryNum + 1);
            }, 250);
            return;
          }
          YFUI.writeToOut("<span style='color:#FFF;'>--" + _("抢青龙失败", "搶青龍失敗") + "!--</span>");
          PLU.execActions("home;");
        },
        onEnd() {
          PLU.execActions("prev_combat;home;");
        },
      });
    },
    //================================================================================================
    goTaofan(npcName, npcPlace, flyLink, gb, force) {
      var TFgo = false;
      if (UTIL.inHome()) {
        PLU.setCache("lastAFK_place", "home;");
        TFgo = true;
      } else if (g_obj_map.get("msg_room").get("short") == _("后山茶园", "後山茶園")) {
        PLU.setCache("lastAFK_place", "rank go 232;s;s;s;e;ne;e;ne;ne;diaoyu;");
        TFgo = true;
      } else if (g_obj_map.get("msg_room").get("short") == "桃溪") {
        if (["8137847(1)", "8171749(1)"].includes(PLU.accId)) {
          PLU.setCache("lastAFK_place", "rank go 232;s;s;s;s;s;s;sw;se;sw;se;diaoyu;")
        } else {
          PLU.setCache("lastAFK_place", "rank go 232;s;s;s;s;s;s;diaoyu;");
        }
        TFgo = true;
      }
      if (TFgo) {
        let ctn = 0,
          gocmd = flyLink;
        PLU.YFD.cityList.forEach((e, i) => {
          if (e == npcPlace) ctn = i + 1;
        });
        if (ctn > 0) gocmd = "jh " + ctn;
        PLU.execActions(gocmd + ";golook_room;", (e) => {
          setTimeout((t) => {
            PLU.killTaofan(npcName, -Number(gb), force, 0);
          }, 1000);
        });
      }
    },
    //================================================================================================
    killTaofan(npcName, gb, force, tryCount) {
      console.debug(gb);
      let npcObj = UTIL.findRoomNpc(npcName, gb);
      let lastAFK_place = PLU.getCache("lastAFK_place") || "home;";
      if (npcObj) {
        if (force) {
          PLU.autoFight({
            targetKey: npcObj.key,
            fightKind: "kill",
            autoSkill: "random",
            onFail(errCode) {
              if (errCode == 4) {
                YFUI.writeToOut("<span style='color:#FFF;'>--" + _("已达到上限!取消逃犯监听", "已達到上限!取消逃犯監聽") + "!--</span>");
                PLU.setListen($("#btn_bt_listenTF"), "listenTF", 0);
                PLU.execActions(lastAFK_place);
              } else if (errCode > 1 && tryCount < 36) {
                setTimeout(() => {
                  PLU.killTaofan(npcName, gb, force, tryCount + 1);
                }, 500);
                return;
              }
              PLU.execActions("golook_room;");
            },
            onEnd() {
              PLU.execActions("prev_combat;" + lastAFK_place);
            },
          });
        } else {
          PLU.waitDaLaoKill({
            targetId: npcObj.key,
            onFail(ec) { },
            onOk() {
              PLU.autoFight({
                targetKey: npcObj.key,
                fightKind: "kill",
                autoSkill: "random",
                onFail(errCode) {
                  if (errCode == 4) {
                    YFUI.writeToOut("<span style='color:#FFF;'>--" + _("已达到上限!取消逃犯监听", "已達到上限!取消逃犯監聽") + "--</span>");
                    PLU.setListen($("#btn_bt_listenTF"), "listenTF", 0);
                    PLU.execActions(lastAFK_place);
                  } else YFUI.writeToOut("<span style='color:#FFF;'>--'ERR=" + errCode + "--</span>");
                  PLU.execActions("golook_room;");
                },
                onEnd() {
                  PLU.execActions("prev_combat;" + lastAFK_place);
                },
              });
            },
          });
        }
      } else {
        YFUI.writeToOut("<span style='color:#FFF;'>--找不到NPC!--</span>");
        if (tryCount < 4) {
          return setTimeout(() => {
            PLU.killTaofan(npcName, gb, force, tryCount + 1);
          }, 500);
        }
        PLU.execActions("golook_room;");
      }
    },
    //================================================================================================

    waitDaLaoKill({ targetId, onOk, onFail }) {
      let tryTimes = 0;
      UTIL.addSysListener("lookNpcWait", function (b, type, subtype, msg) {
        if (type == "notice" && subtype == "notify_fail" && msg.indexOf(_("没有这个人", "沒有這個人")) >= 0) {
          YFUI.writeToOut("<span style='color:#FFF;'>--" + _("目标已丢失" , "目標已丟失") + "!--</span>");
          UTIL.delSysListener("lookNpcWait");
          return onFail && onFail(1);
        }
        if (type == "look_npc") {
          let desc = UTIL.filterMsg(b.get("long"));
          let lookInfo = desc.match(_(/[他|她]正与 (\S*)([\S\s]*) 激烈争斗中/, /[他|她]正與 (\S*)([\S\s]*) 激烈爭鬥中/));
          if (lookInfo && lookInfo.length > 2 && $.trim(lookInfo[2]) != "") {
            YFUI.writeToOut("<span style='color:#9F9;'>--" + _("目标已被大佬攻击,可以跟进", "目標已被大佬攻擊,可以跟進") + "--</span>");
            UTIL.delSysListener("lookNpcWait");
            return onOk && onOk();
          }
          tryTimes++;
          if (tryTimes > 30) {
            UTIL.delSysListener("lookNpcWait");
            return onFail && onFail(30);
          } else {
            setTimeout(() => {
              clickButton("look_npc " + targetId);
            }, 500);
          }
        }
        //如提前進入戰鬥可能是因為殺氣, 逃跑後繼續
        if (type == "vs" && subtype == "vs_info" && b.get("vs2_pos1") != targetId) {
          PLU.autoEscape({
            onEnd() {
              setTimeout(() => {
                clickButton("look_npc " + targetId);
              }, 500);
            },
          });
        }
      });
      clickButton("look_npc " + targetId);
    },

    //================================================================================================
    fixJhName(name) {
      switch (name) {
        case _("白驼山", "白駝山"):
          return _("白驮山", "白馱山");
        case "黑木崖":
          return "魔教";
        case _("光明顶", "光明頂"):
          return "明教";
        case _("铁血大旗门", "鐵血大旗門"):
          return _("大旗门", "大旗門");
        case _("梅庄", "梅莊"):
          return _("寒梅庄", "寒梅莊");
      }
      return name;
    },
    //================================================================================================
    goFindFZ(params) {
      let lastAFK_place = PLU.getCache("lastAFK_place") || "home;";
      if (params.idx >= params.paths.length) {
        setTimeout(() => {
          PLU.FzBusy = false;
          PLU.execActions(lastAFK_place);
        }, 500);
        YFUI.writeToOut("<span style='color:#FFF;'>--" + _("找不到NPC!...已搜索完地图", "找不到NPC!...已搜索完地圖") + "--</span>");
        return;
      }
      let acs = [params.paths[params.idx]];
      PLU.actions({
        paths: acs,
        idx: 0,
        onPathsEnd() {
          setTimeout(() => {
            let npcObj = UTIL.findRoomNpc(params.objectNPC, false, true);
            if (npcObj) {
              PLU.killFZ(npcObj.key, 0);
            } else {
              params.idx++;
              PLU.goFindFZ(params);
            }
          }, 300);
        },
        onPathsFail() {
          setTimeout(() => {
            PLU.FzBusy = false;
            PLU.execActions(lastAFK_place);
          }, 500);
          YFUI.writeToOut("<span style='color:#FFF;'>--" + _("找不到NPC!...路径中断", "找不到NPC!...路徑中斷") + "--</span>");
          return;
        },
      });
    },
    //================================================================================================
    killFZ(npcId, tryNum) {
      let lastAFK_place = PLU.getCache("lastAFK_place") || "home;";
      PLU.autoFight({
        targetKey: npcId,
        fightKind: "kill",
        onFail(errCode) {
          if (String(errCode).indexOf("delay_") >= 0) {
            let mc = String(errCode).match(/delay_(\d+)/);
            if (mc) {
              let wtime = 500 + 1000 * Number(mc[1]);
              setTimeout(() => {
                PLU.killFZ(npcId, tryNum + 1);
              }, wtime);
              return;
            }
          } else if (errCode == 8) {
            PLU.FzBusy = false;
            PLU.setCache("FZ_day", checkDay());
            PLU.execActions(lastAFK_place);
            return;
          } else if (errCode >= 8 && tryNum < 44) {
            setTimeout(() => {
              PLU.killFZ(npcId, tryNum + 1);
            }, 1000);
            return;
          } else {
            PLU.FzBusy = false;
            PLU.execActions(lastAFK_place);
          }
        },
        onEnd() {
          PLU.FzBusy = false;
          PLU.execActions("prev_combat;" + lastAFK_place);
        }
      });
    },
    //================================================================================================
    goFindYouxia(params) {
      //{paths,idx,objectNPC}
      if (params.idx >= params.paths.length) {
        setTimeout(() => {
          PLU.execActions("home");
        }, 500);
        YFUI.writeToOut("<span style='color:#FFF;'>--" + _("找不到游侠!...已搜索完地图", "找不到遊俠!...已搜索完地圖") + "--</span>");
        return;
      }
      let acs = [params.paths[params.idx]];
      PLU.actions({
        paths: acs,
        idx: 0,
        onPathsEnd() {
          setTimeout(() => {
            let npcObj = UTIL.findRoomNpc(params.objectNPC, false, true);
            if (npcObj) {
              YFUI.writeToOut("<span style='color:#FFF;'>--" + _("游侠已找到", "遊俠已找到") + "--</span>");
              PLU.killYouXia(npcObj.key, 0);
            } else {
              params.idx++;
              PLU.goFindYouxia(params);
            }
          }, 300);
        },
        onPathsFail() {
          setTimeout(() => {
            PLU.execActions("home");
          }, 500);
          YFUI.writeToOut("<span style='color:#FFF;'>--" + _("找不到游侠!...路径中断", "找不到遊俠!...路徑中斷") + "--</span>");
          return;
        },
      });
    },
    //================================================================================================
    killYouXia(npcId, tryNum) {
      PLU.autoFight({
        targetKey: npcId,
        fightKind: "kill",
        autoSkill: "multi",
        onFail(errCode) {
          if (String(errCode).indexOf("delay_") >= 0) {
            let mc = String(errCode).match(/delay_(\d+)/);
            if (mc) {
              let wtime = 500 + 1000 * Number(mc[1]);
              PLU.execActions("follow_play " + npcId + ";");
              YFUI.writeToOut("<span style='color:#FFF;'>▶" + _("开始尝试做游侠跟班", "開始嘗試做遊俠跟班") + "!!</span>");
              setTimeout(() => {
                PLU.execActions("follow_play none", () => {
                  YFUI.writeToOut("<span style='color:#FFF;'>◼" + _("停止做游侠跟班!!准备开杀", "停止做遊俠跟班!!準備開殺") + "!!</span>");
                  PLU.killYouXia(npcId, tryNum + 1);
                });
              }, wtime);
              return;
            }
          } else if (errCode >= 88 && tryNum < 44) {
            setTimeout(() => {
              PLU.killYouXia(npcId, tryNum + 1);
            }, 1000);
            return;
          } else if (errCode == 1) {
            YFUI.writeToOut("<span style='color:#F99;'>--" + _("现场找不到游侠了", "現場找不到遊俠了") + "!--</span>");
          } else {
            YFUI.writeToOut("<span style='color:#F99;'>--" + _("攻击游侠失败", "攻擊遊俠失敗") + "!--</span>");
          }
          PLU.execActions("home;");
        },
        onEnd() {
          PLU.execActions("prev_combat;home;");
        },
      });
    },
    //================================================================================================
    getSkillsList(callback) {
      UTIL.addSysListener("getSkillsList", function (b, type, subtype, msg) {
        if (type != "skills" && subtype != "list") return;
        UTIL.delSysListener("getSkillsList");
        clickButton("prev");
        let all = [],
          tupo = [];
        all = PLU.parseSkills(b);
        all.forEach((skill) => {
          if (skill.state >= 4) {
            tupo.push(skill);
          }
        });
        callback(all, tupo);
      });
      clickButton("skills");
    },
    //================================================================================================
    parseSkills(b) {
      let allSkills = [];
      for (var i = b.elements.length - 1; i > -1; i--) {
        if (b.elements[i].key && b.elements[i].key.match(/skill(\d+)/)) {
          var attr = b.elements[i].value.split(",");
          var skill = {
            key: attr[0],
            name: $.trim(UTIL.filterMsg(attr[1])),
            level: Number(attr[2]),
            kind: attr[4],
            prepare: Number(attr[5]),
            state: Number(attr[6]),
            from: attr[7],
          };
          allSkills.push(skill);
        }
      }
      allSkills = allSkills.sort((a, b) => {
        if (a.kind == "known") return -1;
        else if (b.kind != "known" && a.from == _("基础武功", "基礎武功")) return -1;
        else if (b.kind != "known" && b.from != _("基础武功", "基礎武功") && a.kind == "force") return -1;
        else return 1;
      });
      return allSkills;
    },
    //================================================================================================
    toToPo() {
      setTimeout(function () {
        if (UTIL.inHome()) {
          PLU.getSkillsList((allSkills, tupoSkills) => {
            if (tupoSkills.length > 0) {
              if (PLU.STO.outSkillList) clearTimeout(PLU.STO.outSkillList);
              PLU.STO.outSkillList = setTimeout(() => {
                PLU.STO.outSkillList = null;
                if (!!$("#out_top").height() && $("#out_top .outtitle").text() == "我的技能") clickButton("home");
              }, 200);
              return;
            }
            let tpArr = PLU.getCache("autoTP_keys").split(",");
            let tpList = [];
            tpArr.forEach((s) => {
              let sk = {};
              let cs = s.match(/((\d)\|)?(.*)/);
              if (cs) {
                sk.name = cs[3];
                sk.sp = Number(cs[2]);
              } else {
                sk.name = s;
                sk.sp = 0;
              }
              let skobj = allSkills.find((e) => e.name.match(sk.name));
              if (skobj) tpList.push(Object.assign({}, skobj, sk));
            });
            PLU.TMP.stopToPo = false;
            PLU.toPo(tpList, 0);
          });
        }
      }, 500);
    },
    //================================================================================================
    toPo(tpList, skIdx) {
      if (skIdx < tpList.length && !PLU.TMP.stopToPo) {
        let acts = "enable " + tpList[skIdx].key + ";tupo go," + tpList[skIdx].key + ";";
        if (tpList[skIdx].sp == 1) acts += "tupo_speedup4_1 " + tpList[skIdx].key + " go;";
        else if (tpList[skIdx].sp == 2) acts += "tupo_speedup3_1 " + tpList[skIdx].key + " go;";
        else if (tpList[skIdx].sp == 3) acts += "tupo_up " + tpList[skIdx].key + " go;";
        else if (tpList[skIdx].sp == 4) acts += "items info obj_sanshengshi;event_1_66830905 " + tpList[skIdx].key + " go;";

        PLU.execActions(acts, () => {
          setTimeout(() => {
            if (PLU.STO.outSkillList) clearTimeout(PLU.STO.outSkillList);
            PLU.STO.outSkillList = null;
            PLU.toPo(tpList, skIdx + 1);
          }, 300);
        });
      } else {
        YFUI.writeToOut("<span style='color:yellow;'> ==" + _("突破完毕", "突破完畢") + "!== </span>");
        clickButton("home");
      }
    },
    //================================================================================================
    toBangFour(n) {
      UTIL.log({
        msg: _(" 进入帮四(", " 進入幫四(") + n + ") ",
        type: "TIPS",
        time: new Date().getTime(),
      });
      PLU.STO.bangFourTo && clearTimeout(PLU.STO.bangFourTo);
      PLU.STO.bangFourTo = setTimeout(function () {
        clickButton("home");
      }, 30 * 60 * 1000);
      clickButton("clan fb enter shiyueweiqiang-" + n, 0);
    },
    toBangSix() {
      UTIL.log({ msg: _(" 进入帮六 ", " 進入幫六 "), type: "TIPS", time: new Date().getTime() });
      PLU.STO.bangSixTo && clearTimeout(PLU.STO.bangSixTo);
      PLU.STO.bangSixTo = setTimeout(function () {
        clickButton("home");
      }, 30 * 60 * 1000);
      clickButton("clan fb enter manhuanqishenzhai", 0);
    },
    //================================================================================================
    inBangFiveEvent() {
      var moving = false;
      PLU.TMP.listenBangFive = true;
      UTIL.addSysListener("listenBangFive", function (b, type, subtype, msg) {
        if (!moving && type == "jh" && (subtype == "dest_npc" || subtype == "info")) {
          moving = true;
          let roomName = UTIL.filterMsg(g_obj_map.get("msg_room").get("short"));
          if (roomName.match(_(/蒙古高原|成吉思汗的金帐/, /蒙古高原|成吉思汗的金帳/)) && !UTIL.roomHasNpc()) {
            PLU.execActions(";;n;", () => {
              moving = false;
            });
          } else {
            moving = false;
          }
        }
        /*
        type:main_msg
        msg:你獲得：\x1B[34m三\x1B[2;37;0m\x1B[35m生\x1B[2;37;0m\x1B[31m石
         */

        if (type == "home" && subtype == "index") {
          UTIL.delSysListener("listenBangFive");
          YFUI.writeToOut("<span style='color:white;'> ==" + _("帮五完毕", "幫五完畢") + "!== </span>");
          PLU.execActions("golook_room;home");
        }
      });
    },
    intervene($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        UTIL.delSysListener("intervene");
        UTIL.delSysListener("score");
        return;
      }
      let Fight = function (b, num) {
        PLU.autoFight({
          targetKey: b.get("vs2_pos" + num),
          fightKind: "fight",
          onEnd() {
            UTIL.delSysListener("intervene");
            UTIL.delSysListener("score");
            PLU.setBtnRed($btn);
          },
          onFail() {
            PLU.autoFight({
              targetKey: b.get("vs2_pos" + num),
              onEnd() {
                UTIL.delSysListener("intervene");
                UTIL.delSysListener("score");
                PLU.setBtnRed($btn);
              },
              onFail() {
                if (num <= 7) {
                  Fight(++num);
                } else {
                  UTIL.delSysListener("intervene");
                  UTIL.delSysListener("score");
                }
              },
            });
          },
        });
      };
      UTIL.addSysListener("intervene", (b, type, subtype, msg) => {
        if (type == "vs" && subtype == "vs_info") {
          UTIL.delSysListener("intervene");
          UTIL.delSysListener("score");
          Fight(b, 1);
        }
      });
      UTIL.addSysListener("score", (b, type, subtype, msg) => {
        if (type == "score" && subtype == "user") {
          if (b.get("long").indexOf(_("激烈争斗中...", "激烈爭鬥中...")) == -1) {
            PLU.execActions("score " + b.get("id"));
            return;
          }
          UTIL.delSysListener("score");
          PLU.execActions("watch_vs " + b.get("id"));
        }
      });
      YFUI.showPop({
        title: _("杀隐藏怪", "殺隱藏怪"),
        text: _("自动观战，自动加入战斗<br>确认后，点开要跟的玩家页面", "自動觀戰，自動加入戰鬥<br>確認後，點開要跟的玩家頁面"),
        onNo() {
          UTIL.delSysListener("intervene");
          UTIL.delSysListener("score");
          PLU.setBtnRed($btn);
        },
      });
    },
    // 字符串相似度算法
    getSimilarity(str1, str2) {
      let sameNum = 0;
      for (let i = 0; i < str1.length; i++)
        for (let j = 0; j < str2.length; j++)
          if (str1[i] === str2[j]) {
            sameNum++;
            break;
          }
      let length = Math.max(str1.length, str2.length);
      return (sameNum / length) * 100 || 0;
    },
    npcDataUpdate() {
      var wayList = [...new Set(PLU.YFD.mapsLib.Npc.map((e) => e.way))];
      if (PLU.YFD.mapsLib.Npc_New[PLU.YFD.mapsLib.Npc_New.length - 1]) var i = wayList.indexOf(PLU.YFD.mapsLib.Npc_New[PLU.YFD.mapsLib.Npc_New.length - 1].way);
      else var i = 0;
      PLU.UTIL.addSysListener("look_npc", (b, type, subtype, msg) => {
        if (type != "look_npc") return;
        if (b.get("id").indexOf("bad_target_") == 0) return;
        if (b.get("id").indexOf("hero_") == 0) return;
        if (b.get("id").indexOf("eren_") == 0) return;
        if (b.get("id").indexOf("bukuai") == 0) return;
        if (PLU.YFD.qixiaList.includes(ansi_up.ansi_to_text(b.get("name")))) return;
        let roomInfo = g_obj_map.get("msg_room");
        let jh = PLU.YFD.cityId[roomInfo.get("map_id")] ?? roomInfo.get("map_id");
        let curName = UTIL.filterMsg(roomInfo.get("short") || "");
        PLU.YFD.mapsLib.Npc_New.push({
          jh: jh,
          loc: curName,
          name_new: ansi_up.ansi_to_text(b.get("name")),
          id: b.get("id") || "",
          desc: ansi_up.ansi_to_text(b.get("long")?.split("\n")[1]),
          way: wayList[i],
        });
      });

      func = () => {
        PLU.execActions(wayList[i], () => {
          for (var npc of PLU.UTIL.getRoomAllNpc()) PLU.execActions("look_npc " + npc.key);
          setTimeout(() => {
            i++;
            func();
          }, 1500);
        });
      };
      func();
    },
    //================================================================================================
    setAutoCure($btn, listenKey, stat) {
      if (listenKey == "autoCure") {
        //自動加血藍
        YFUI.showInput({
          title: _("自动加血加蓝", "自動加血加藍"),
          text: _(`格式：血百分比|加血技能,蓝百分比|加蓝技能，以英文逗号分割，每样只能设置一个技能。<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">50|道种心魔经,10|不动明王诀</span><br> 血低于50%自动加血,蓝低于10%自动加蓝<br>
                            [例2] <span style="color:blue;">30|紫血大法</span><br> 血低于30%自动加血技能,不自动加蓝<br>
                            `,
                            `格式：血百分比|加血技能,藍百分比|加藍技能，以英文逗號分割，每樣只能設置一個技能。<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">50|道種心魔經,10|不動明王訣</span><br> 血低於50%自動加血,藍低於10%自動加藍<br>
                            [例2] <span style="color:blue;">30|紫血大法</span><br> 血低於30%自動加血技能,不自動加藍<br>
                            `),
          value: PLU.getCache(listenKey + "_keys") || _("10|道种心魔经,10|不动明王诀", "10|道種心魔經,10|不動明王訣"),
          onOk(val) {
            let str = $.trim(val);
            PLU.setCache(listenKey + "_keys", str);
            PLU.splitCureSkills();
          },
          onNo() { },
        });
      }
    },
    toggleAutoCure($btn, listenKey, stat) {
      let btnFlag = 0;
      if (stat != undefined) {
        btnFlag = PLU.setBtnRed($btn, stat);
        PLU.setCache(listenKey, stat);
      } else {
        btnFlag = PLU.setBtnRed($btn);
      }
      if (!btnFlag) {
        PLU.setCache(listenKey, 0);
        PLU.STATUS.battleCureOn = 0;
        return
      } else {
        PLU.setCache(listenKey, 1);
        PLU.STATUS.battleCureOn = 1;
        setTimeout(() => {
          YFUI.writeToOut("<span style='color:yellow;'>" + _("自动血蓝: ", "自動血藍: ") + PLU.getCache(listenKey + "_keys") + " </span>");
        }, 100);
      }
    },
    //================================================================================================
    splitCureSkills() {
      let kf = (PLU.getCache("autoCure_keys") || "").split(",");
      PLU.TMP.autoCure_percent = "";
      PLU.TMP.autoCure_skills = "";
      PLU.TMP.autoCure_force_percent = "";
      PLU.TMP.autoCure_force_skills = "";
      if (kf.length > 0) {
        let acp = kf[0].split("|");
        PLU.TMP.autoCure_percent = Number(acp[0]) || 50;
        PLU.TMP.autoCure_skills = acp[1];
        if (kf.length > 1) {
          let acf = kf[1].split("|");
          PLU.TMP.autoCure_force_percent = Number(acf[0]) || 10;
          PLU.TMP.autoCure_force_skills = acf[1];
        }
      }
    },
    //================================================================================================
    autoCureByKills(skill, forcePercent) {
      if (PLU.battleData && PLU.battleData.xdz > 2) {
        let rg = new RegExp(skill);
        let useSkill = PLU.selectSkills(rg);
        if (useSkill) {
          clickButton(useSkill.key, 0);
          if (Number(forcePercent) > 1) PLU.battleData.cureTimes++;
        }
      }
    },
    //================================================================================================
    setAutoPerform($btn, listenKey, stat) {
      if (listenKey == "autoPerform") {
        //自動技能
        let skillsList = [];
        try {
          skillsList = JSON.parse(PLU.getCache(listenKey + "_keysList"));
        } catch (error) {
          skillsList = [_("6|千影百伤棍,九天龙吟剑法", "", "", "", "3|九天龙吟剑法", "6|千影百傷棍,九天龍吟劍法", "", "", "", "3|九天龍吟劍法")];
        }
        YFUI.showInput({
          title: _("自动技能", "自動技能"),
          text: _(`格式：触发气值|技能词组|功法技能，以英文逗号分割多个关键词。<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">9|千影百伤棍,九天龙吟剑法,排云掌法</span><br>
                            [例2] <span style="color:blue;">12|湿魂,九幽|火</span><br>
                            `,
                            `格式：觸發氣值|技能詞組|功法技能，以英文逗號分割多個關鍵詞。<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">9|千影百傷棍,九天龍吟劍法,排雲掌法</span><br>
                            [例2] <span style="color:blue;">12|濕魂,九幽|火</span><br>
                            `),
          value: skillsList,
          inputs: ["技能1", "技能2", "技能3", "技能4"],
          onOk(val) {
            PLU.setCache(listenKey + "_keysList", JSON.stringify(val));
            if (PLU.getCache(listenKey)) {
              PLU.setPerformSkill(PLU.getCache(listenKey));
            }
          },
          onNo() { },
        });
      }
    },
    toggleAutoPerform($btn, listenKey, stat) {
      let curIdx = Number(PLU.getCache(listenKey));
      if (stat != undefined) {
        if (stat > 0) {
          PLU.setBtnRed($btn, 1);
          PLU.setPerformSkill(stat);
        } else PLU.setBtnRed($btn, 0);
        $btn.text([_("连招", "連招"), "技一", "技二", "技三", "技四"][stat]);
        PLU.setCache(listenKey, stat);
        if (stat > 0) PLU.TMP.lastAutoPerformSet = stat;
      } else {
        let nowTime = Date.now();
        if (curIdx == 0 && nowTime - (PLU.TMP.lastClickAutoPerform || 0) < 350) {
          curIdx = PLU.TMP.lastAutoPerformSet || 1;
          curIdx++;
          if (curIdx > 4) curIdx = 1;
        } else {
          curIdx = curIdx == 0 ? PLU.TMP.lastAutoPerformSet || 1 : 0;
        }
        PLU.TMP.lastClickAutoPerform = nowTime;
        if (curIdx > 0) PLU.TMP.lastAutoPerformSet = curIdx;
        PLU.setCache(listenKey, curIdx);
        if (curIdx == 0) {
          PLU.setBtnRed($btn, 0);
          PLU.STATUS.battleArrayOn = 0;
          $btn.text(_("连招", "連招"));
        } else {
          PLU.setBtnRed($btn, 1);
          $btn.text([_("连招", "連招"), "技一", "技二", "技三", "技四"][curIdx]);
          PLU.setPerformSkill(curIdx);
        }
      }
    },
    setPerformSkill(idx) {
      let skillsList = [];
      idx = idx - 1;
      try {
        skillsList = JSON.parse(PLU.getCache("autoPerform_keysList"));
      } catch (error) {
        skillsList = [];
      }
      let str = skillsList[idx] || "";
      let aps = str.split("|");
      if (aps && aps.length >= 2) {
        PLU.TMP.autoPerform_xdz = Number(aps[0]);
        PLU.TMP.autoPerform_skills = aps[1].split(",");
        if (aps.length >= 3) PLU.TMP.UltraSkill = aps[2].split(","); else PLU.TMP.UltraSkill = null;
        PLU.STATUS.battleArrayOn = 1;
      } else {
        PLU.TMP.autoPerform_xdz = 0;
        PLU.TMP.autoPerform_skills = [];
        PLU.TMP.UltraSkill = null;
      }
      setTimeout(() => {
        let setCh = ["一", "二", "三", "四"][idx];
        YFUI.writeToOut(
          "<span style='color:yellow;'>" + _("自动技能[", "自動技能[") + setCh + "] : " + str + _(" </span><br><span style='color:white;'>** 双击自动技能按钮切换技能设置 **</span>", " </span><br><span style='color:white;'>** 雙擊自動技能按鈕切換技能設置 **</span>"),
        );
      }, 100);
    },
    //================================================================================================
    doAutoCure(b, type, subtype, msg) {
      if (!PLU.inBattleFight) {
        return;
      }
      // 只接收战场开始与气增长的信息
      if (subtype != "sec_timer") return false;
      var autoCureSkillCur = PLU.getCache("autoCure_keys");
      if (!autoCureSkillCur) {
        console.log("未配置治疗技能");
        return;
      }
      var autoCureSkillArr = autoCureSkillCur.split(",");
      var userInfo = g_obj_map.get("msg_attrs")
      var vsInfo = PLU.getBattleInfo()
      if (!vsInfo) return;
      var keeCurPer = 0;
      var forceCurPer = 0;
      var keeCur = parseInt(vsInfo.get(PLU.battleMyHead + "_kee" + PLU.battleMyPos)); // vs1_kee1
      var keeMax = parseInt(userInfo.get("max_kee")); // vs1_max_kee1
      keeCurPer = Math.floor(keeCur * 100 / keeMax);

      var forceCur = parseInt(vsInfo.get(PLU.battleMyHead + "_force" + PLU.battleMyPos)); // vs1_kee1
      var forceMax = parseInt(userInfo.get("max_force")); // vs1_max_kee1
      forceCurPer = Math.floor(forceCur * 100 / forceMax);

      if (keeCurPer == null) {
        console.log("cure_kee_percent:", keeCurPer, keeMax, PLU.battleMyHead, PLU.battleMyPos, keeCur);
      }
      if (forceCurPer == null) {
        console.log("cure_force_percent:", forceCurPer, forceMax, PLU.battleMyHead, PLU.battleMyPos, forceCur);
      }

      // 用户技能
      var skillCureName = autoCureSkillArr[0].split('|')[1];
      var curePer = parseInt(autoCureSkillArr[0].split('|')[0]);
      var skillForceName = autoCureSkillArr[1].split('|')[1];
      var forcePer = parseInt(autoCureSkillArr[1].split('|')[0]);
      console.log(skillCureName, curePer, skillForceName, forcePer);
      // 加血
      if (keeCurPer != null && keeCurPer <= curePer && (PLU.battleCureTimes < 3 || skillCureName == "紫血大法")) {
        PLU.battleCureTimes++;
        return PLU.useAnySkill([skillCureName]);
      }

      // 加蓝
      if (forceCurPer != null && forceCurPer <= forcePer) {
        console.log(skillForceName);
        return PLU.useAnySkill([skillForceName]);
      }
    },
    doAttack(b, type, subtype, msg) {
      if (!PLU.inBattleFight) {
        return false;
      }
      if (subtype != "sec_timer" && subtype != "vs_info" && subtype != "ready_skill") return false;
      var autoBattleSkillArr = [PLU.TMP.autoPerform_xdz, PLU.TMP.autoPerform_skills];
      // 未配置技能
      if (autoBattleSkillArr.length == 0) {
        console.log("未配置阵法技能");
        return false;
      }
      // 检查气的条件是否满足
      var needPower = parseInt(autoBattleSkillArr[0]);
      if (!needPower) {
        console.log("技能气值配置错误:" + autoBattleSkillArr.join("|"));
        return false;
      }
      var curPower = PLU.battlingSkills.xdz;
      if (!curPower && curPower!== 0) {
        console.log("系统气值错误:" + curPower, subtype);
        return false;
      } 
      if (curPower < needPower) return false;
      if (PLU.TMP.UltraSkill) {
        PLU.useAllSkills(autoBattleSkillArr[1], PLU.TMP.UltraSkill);
        return true;
      }
      PLU.useAllSkills(autoBattleSkillArr[1]);
      return true; // 正常调用
    },
    // 使用技能组
    useAllSkills(skill, ultra) {
      return PLU.battlingSkills.useAll(skill, ultra);
    },
    // 使用任一技能
    useAnySkill(skill) {
      return PLU.battlingSkills.useAny(skill);
    },
    //================================================================================================
    checkAutoPerform() {
      // if(PLU.battleData.autoSkill) return;
      if (!PLU.TMP.autoPerform_xdz) return;
      // if(!PLU.TMP.autoPerform_xdz){
      //     let aps = PLU.getCache("autoPerform_keys").split('|')
      //     PLU.TMP.autoPerform_xdz = Number(aps[0])
      //     PLU.TMP.autoPerform_skills = aps[1].split(',')
      //}
      if (PLU.battleData.xdz >= PLU.TMP.autoPerform_xdz) {
        if (PLU.TMP.autoPerform_skills && PLU.TMP.autoPerform_skills.length > 0) {
          PLU.TMP.autoPerform_skills.forEach((skn, idx) => {
            let useSkill = PLU.selectSkills(skn);
            if (useSkill) {
              setTimeout((e) => {
                clickButton(useSkill.key, 0);
              }, idx * 100);
            }
          });
        }
      }
    },
    //================================================================================================
    setFightSets($btn, listenKey, stat) {
      if (listenKey == "followKill") {
        //開跟殺
        YFUI.showInput({
          title: _("开跟杀", "開跟殺"),
          text: _(`格式：跟杀的人名词组，以英文逗号分割多个关键词，人名前带*为反跟杀。<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">步惊鸿,*醉汉</span><br> 步惊鸿攻击(杀or比试)谁我攻击谁；谁攻击醉汉我攻击谁<br>
                            `,
                            `格式：跟殺的人名詞組，以英文逗號分割多個關鍵詞，人名前帶*為反跟殺。<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">步驚鴻,*醉漢</span><br> 步驚鴻攻擊(殺or比試)誰我攻擊誰；誰攻擊醉漢我攻擊誰<br>
                            `),
          value: PLU.getCache(listenKey + "_keys") || _("☆,★,人", "風,豹,劍,門,豆,七,星,虎,影,貓"), // 顺序怎么随口怎么来 XD
          //type:"textarea",
          onOk(val) {
            let str = $.trim(val);
            PLU.setCache(listenKey + "_keys", str);
            PLU.splitFollowKillKeys();
          },
          onNo() { },
        });
      }
    },
    toggleFollowKill($btn, listenKey, stat) {
      let btnFlag = 0;
      if (stat != undefined) {
        btnFlag = PLU.setBtnRed($btn, stat);
        PLU.setCache(listenKey, stat);
      } else {
        btnFlag = PLU.setBtnRed($btn);
      }
      if (!btnFlag) {
        return PLU.setCache(listenKey, 0);
      } else {
        PLU.splitFollowKillKeys();
        PLU.setCache(listenKey, 1);
        setTimeout(() => {
          YFUI.writeToOut("<span style='color:yellow;'>" + _("自动跟杀: ", "自動跟殺: ") + PLU.getCache(listenKey + "_keys") + " </span>");
        }, 100);
      }
    },
    //================================================================================================
    splitFollowKillKeys() {
      let keystr = PLU.getCache("followKill_keys") || "";
      let keys = keystr.split(/[,，]/);
      PLU.FLK = {
        followList: [],
        defendList: [],
      };
      keys.forEach((e) => {
        if (!e) return;
        if (e.charAt(0) == "*") {
          PLU.FLK.defendList.push(e.substring(1));
        } else {
          PLU.FLK.followList.push(e);
        }
      });
    },
    //================================================================================================
    toCheckFollowKill(attacker, defender, fightType, msgText) {
      if (!PLU.FLK) PLU.splitFollowKillKeys();
      for (let i = 0; i < PLU.FLK.followList.length; i++) {
        let flname = PLU.FLK.followList[i];
        if (attacker.match(flname)) {
          PLU.autoFight({
            targetName: defender,
            fightKind: fightType,
            onFail() { },
            onEnd() { },
          });
          return;
        }
      }
      for (let i = 0; i < PLU.FLK.defendList.length; i++) {
        let dfname = PLU.FLK.defendList[i];
        if (defender.match(dfname)) {
          PLU.autoFight({
            targetName: attacker,
            fightKind: fightType,
            onFail() { },
            onEnd() { },
          });
          return;
        }
      }
    },
    //================================================================================================
    startSync($btn) {
      PLU.getTeamInfo((t) => {
        if (!t) PLU.setBtnRed($btn);
        else {
          YFUI.writeToOut("<span style='color:yellow;'>===" + _("队伍同步开始", "隊伍同步開始") + (t.is_leader ? ", <b style='color:#F00;'>" + _("我是队长", "我是隊長") + "</b>" : "") + " ===</span>");
          if (t.is_leader) {
            PLU.TMP.leaderTeamSync = true;
          } else {
            PLU.listenTeamSync(t.leaderId);
          }
        }
      });
    },
    toggleTeamSync($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (btnFlag) {
        PLU.TMP.teamSync = true;
        if (PLU.TMP.firstSync) PLU.startSync($btn);
        else {
          YFUI.showPop({
            title: _("队伍同步", "隊伍同步"),
            text: _("<b style='color:#F00;'>入队后再打开队伍同步!!</b><br>队长发布指令, 队员监听同步指令!", "<b style='color:#F00;'>入隊後再打開隊伍同步!!</b><br>隊長發布指令, 隊員監聽同步指令!"),
            okText: "同步",
            onOk(e) {
              PLU.TMP.firstSync = 1;
              PLU.startSync($btn);
            },
            onNo() {
              PLU.setBtnRed($btn);
            },
            onX() {
              PLU.setBtnRed($btn);
            },
          });
        }
      } else {
        PLU.TMP.teamSync = false;
        PLU.TMP.leaderTeamSync = false;
        UTIL.delSysListener("syncTeamChannel");
      }
    },
    //================================================================================================
    commandTeam(args) {
      if (!PLU.TMP.leaderTeamSync) return;
      if (!g_gmain.is_fighting && !args[0].match(/team chat|chat|send_chat|attr|watch\_vs/)) {
				if (PLU.orioN && args[0].match(/kill|prev/)) return
        var uid = PLU.accId.replace(/\(/g, "\\(").replace(/\)/g, "\\)");
        var cmdStr = args[0].replace(/\s/g, "$").replace(new RegExp(uid, 'g'), "'uid'");
        clickButton("team chat synCmd=" + cmdStr);
        clickButton("send_chat", 0);
      }
    },
    //================================================================================================
    listenTeamSync(leaderId) {
      UTIL.addSysListener("syncTeamChannel", function (b, type, subtype, msg) {
        if (type != "main_msg" || !msg.match(_(/\003href;0;team\003【队伍】\0030\003/, /\003href;0;team\003【隊伍】\0030\003/))) return;
        var l = msg.match(_(/\003href;0;team\003【队伍】.*href;0;score ([\w\(\)]+)\003(.*)\0030\003：(.*)/, /\003href;0;team\003【隊伍】.*href;0;score ([\w\(\)]+)\003(.*)\0030\003：(.*)/));
        if (l && l[1] == leaderId) {
          var synCmd = l[3].replace("synCmd=", "").replace("。", ".").replace(/\$/g, " ").replace(/，/g, ",").replace("'uid'", PLU.accId);
          clickButton(synCmd);
        }
      });
    },
    //================================================================================================
    getTeamInfo(callback) {
      UTIL.addSysListener("checkTeam", (b, type, subtype, msg) => {
        if (type != "team" && subtype != "info") return;
        UTIL.delSysListener("checkTeam");
        if (b.get("team_id")) {
          if (b.get("is_member_of") == "1") {
            callback &&
              callback({
                is_leader: parseInt(b.get("is_leader")),
                leaderId: b.get("member1").split(",")[0],
              });
          } else {
            callback && callback(0);
          }
        } else {
          callback && callback(0);
        }
        clickButton("prev");
      });
      clickButton("team");
    },
    //================================================================================================
    setSkillGroup(idx) {
      if (g_gmain.is_fighting) return;
      $(".menu").hide();
      let lsgTimeOut = setTimeout(() => {
        UTIL.delSysListener("loadSkillGroup");
      }, 5000);
      UTIL.addSysListener("loadSkillGroup", (b, type, subtype, msg) => {
        if (type != "enable" && subtype !== "list") return;
        UTIL.delSysListener("loadSkillGroup");
        clearTimeout(lsgTimeOut);
        clickButton("prev");
      });
      clickButton("enable mapped_skills restore go " + idx);
    },
    //================================================================================================
    setWearEquip(idx) {
      if (g_gmain.is_fighting) return;
      $(".menu").hide();
      let equipKey = "equip_" + idx + "_keys";
      YFUI.showInput({
        title: _("装备组-", "裝備組-") + idx,
        text: _(`格式：武器装备词组，以英文逗号分割多个关键词，<br>
						<span style="color:#D60;">武器名前必须带上*，入脉武器名前带**。<br>
						卸下武器名前带上#。</span><br>
                        <span style="color:red;">例如：</span><br>
                        [例1] <span style="color:blue;">剑神之铠,剑神之带,剑神之盔,剑神之镯,剑神之戒,剑神之靴,剑神之链</span><br>
                        [例2] <span style="color:blue;">隐居贤者之铠,隐居贤者之带,隐居贤者之盔,隐居贤者之镯,隐居贤者之戒,隐居贤者之靴,隐居贤者之链</span><br>
                        `,
                        `格式：武器裝備詞組，以英文逗號分割多個關鍵詞，<br>
						<span style="color:#D60;">武器名前必須帶上*，入脈武器名前帶**。<br>
						卸下武器名前帶上#。</span><br>
                        <span style="color:red;">例如：</span><br>
                        [例1] <span style="color:blue;">劍神之鎧,劍神之帶,劍神之盔,劍神之鐲,劍神之戒,劍神之靴,劍神之鏈</span><br>
                        [例2] <span style="color:blue;">隱居賢者之鎧,隱居賢者之帶,隱居賢者之盔,隱居賢者之鐲,隱居賢者之戒,隱居賢者之靴,隱居賢者之鏈</span><br>
                        `),
        value: PLU.getCache(equipKey) || "",
        type: "textarea",
        onOk(val) {
          let str = $.trim(val);
          if (!str) return;
          PLU.setCache(equipKey, str);
          PLU.wearEquip(str);
        },
        onNo() { },
      });
    },
    wearEquip(equipsStr) {
      PLU.getAllItems((list) => {
        let equips = equipsStr.split(","),
          equipCmds = "";
        let equipArr = equips.forEach((e) => {
          let eqObj = {};
          if (e.substr(0, 1) == "#") {
            eqObj = { type: -1, name: e.substr(1) };
          } else if (e.substr(0, 2) == "**") {
            eqObj = { type: 2, name: e.substr(2) };
          } else if (e.substr(0, 1) == "*") {
            eqObj = { type: 1, name: e.substr(1) };
          } else {
            eqObj = { type: 0, name: e };
          }
          let bagItem = list.find((it) => !!it.name.match(eqObj.name) && !it.name.match("碎片"));
          if (bagItem) {
            if (eqObj.type == -1) equipCmds += "unwield " + bagItem.key + ";";
            else if (eqObj.type == 2) equipCmds += "wield " + bagItem.key + " rumai;";
            else if (eqObj.type == 1) equipCmds += "wield " + bagItem.key + ";";
            else equipCmds += "wear " + bagItem.key + ";";
          }
        });
        PLU.execActions(equipCmds, () => {
          YFUI.writeToOut("<span style='color:yellow;'> ==" + _("装备完毕", "裝備完畢") + "!== </span>");
          if (g_gmain.is_fighting) gSocketMsg.go_combat();
        });
      });
    },
    //================================================================================================
    rankUpdate() {
      PLU.execActions("rank all");
      var rank_list = [];
      UTIL.addSysListener("rankUpdate", function(b, type, subtype, msg) {
        if (type != "rank") return;
        var maxPage = parseInt(b.get("max_page"));
        var sizePage = parseInt(b.get("page_size"));
        var curPage = parseInt(b.get("page"));
        var idx = sizePage * (curPage - 1);
        for (var n = b.elements.length - 1; n > -1; n--) {
          var value = b.elements[n].value.split(',');
          var rank_name = PLU.dispatchChineseMsg(value[0]);
          var isHave = Number(value[1]);
          if (!isHave) continue
          if (rank_list.includes(rank_name)) continue
          rank_list.push(rank_name)
        }
        if (curPage < maxPage) {
          PLU.execActions("rank all " + (curPage + 1));
        } else {
          UTIL.delSysListener("rankUpdate");
          PLU.execActions("prev;log?完成");
          PLU.setCache("rank_list", rank_list.join(','));
        }
      });
    },
    //================================================================================================
    openClan($btn) {
      var btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.setListen($btn, "openClan", 0);
        return;
      }
      YFUI.showTimeTable({
        title: _("定时开启帮派副本", "定時開啟幫派副本"),
        text: "固定早上6點半開啟幫本<br>請勾選要開啟的幫本",
        t: [
          _("神兽森林", "神獸森林"),
          _("大雪满弓刀", "大雪滿弓刀"),
          _("龙武炼魔阁", "龍武煉魔閣"),
          _("可汗金帐一", "可汗金帳一"),
          _("可汗金帐二", "可汗金帳二")
        ],
        times: 5,
        value: PLU.getCache("openClan_setting") || "",
        onOk(val) {
          PLU.setListen($btn, "openClan", 1);
          PLU.setCache("openClan_setting", val);
        },
        onNo() {
          PLU.setListen($btn, "openClan", 0);
        }
      });
    },
    //================================================================================================
    shilianta($btn) { //試煉塔設定
      var btnFlag = PLU.setBtnRed($btn);
      YFUI.showInput({
        title: _("探宝设定", "探寶設定"),
        text: _("设定龙神岛试练塔/练气塔日常<br>请输入对应地点和层数<br>试练塔仅支持第九层<br>[例1]试练9<br>[例2]练气5", "設定龍神島試練塔/練氣塔日常<br>請輸入對應地點和層數<br>試練塔僅支持第九層<br>[例1]試練9<br>[例2]練氣5"),
        value: PLU.getCache("shilianta_setting") || _("试练9", "試練9"),
        onOk(val) {
          PLU.setCache("shilianta_setting", val);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        }
      });
    },
    //================================================================================================
    baoset($btn) {
      var btnFlag = PLU.setBtnRed($btn);
      YFUI.showInput({
        title: _("探宝设定", "探寶設定"),
        text: _("设定探宝镐/探宝罗盘的探宝位置<br>请输入对应地点的数字<br>1.洛阳矿洞<br>2.长白山天池", "設定探寶鎬/探寶羅盤的探寶位置<br>請輸入對應地點的數字<br>1.洛陽礦洞<br>2.長白山天池"),
        value: PLU.getCache("baoset_setting") || "1",
        onOk(val) {
          PLU.setCache("baoset_setting", val);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        }
      });
    },
    //================================================================================================
    showLog() {
      if ($("#myTools_InfoPanel").length > 0) return $("#myTools_InfoPanel").remove();
      let $logPanel = YFUI.showInfoPanel({
        text: "",
        noText: "清空",
        onOpen() {
          $("#myTools_InfoPanel .infoPanel-wrap").html(PLU.logHtml);
          $("#myTools_InfoPanel .infoPanel-wrap").scrollTop($("#myTools_InfoPanel .infoPanel-wrap")[0].scrollHeight);
        },
        onNo() {
          PLU.logHtml = "";
          UTIL.logHistory = [];
          UTIL.setMem("HISTORY", JSON.stringify(this.logHistory));
          $("#myTools_InfoPanel .infoPanel-wrap").empty();
        },
        onClose() { },
      });
    },
    //================================================================================================
    updateShowLog(e) {
      let html = `<div style="${e.ext.style}">${UTIL.getNow(e.ext.time)} ${e.ext.msg}</div>`;
      PLU.logHtml += html;
      if ($("#myTools_InfoPanel").length < 1) return;
      $("#myTools_InfoPanel .infoPanel-wrap").append(html);
      $("#myTools_InfoPanel .infoPanel-wrap").scrollTop($("#myTools_InfoPanel .infoPanel-wrap")[0].scrollHeight);
    },
    //================================================================================================
    baiHJS(idx, process, learn) {
      if (learn) {
        var needSkills = [];
        PLU.getSkillsList(function (allSkills, tupoSkills) {
          PLU.TMP.MASTER_SKILLS.forEach(function (ms) {
            var sk = allSkills.find(function (s) {
              return s.key == ms.key;
            }) || {
              level: 0
            };
            if (sk.level < ms.level) {
              needSkills.push({
                key: ms.key,
                name: ms.name,
                lvl: ms.level - sk.level,
                cmd: "learn " + ms.key + " from " + PLU.TMP.MASTER_ID + " to 10"
              });
            }
          });
          //console.log(needSkills.map(e=>e.name))
          loopLearn(needSkills);
        });
        var curSkill = null;
        UTIL.addSysListener("loopLearnSkill", function (b, type, subtype, msg) {
          if (type == "notice" && msg.indexOf("不愿意教你") >= 0) {
            // UTIL.delSysListener("loopLearnSkill");
            if (curSkill) curSkill.lvl = -1;
          }
          return;
        });
        var loopLearn = function loopLearn(list) {
          if (list.length > 0) {
            if (list[0].lvl > 0) {
              list[0].lvl -= 10;
              curSkill = list[0];
              clickButton(list[0].cmd);
            } else {
              list.shift();
            }
            setTimeout(function () {
              loopLearn(list);
            }, 300);
          } else {
            UTIL.delSysListener("loopLearnSkill");
          }
        };
      }
      let family = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("family_name");
      let master = PLU.YFD.masterList.slice(0, 32).find((e) => e.in == family);
      if (master !== undefined) return PLU.execActions("log?" + _("请先出师", "請先出師"));
      if (process >= 5) {
        if (idx == 1) var npcID = "hangjieshan_huangxiaofu";
        else if (idx == 2) var npcID = "hangjieshan_huarong";
        else if (idx == 3) var npcID = "hangjieshan_xuguiyi";
        PLU.execActions(`prev;chushi ${npcID};chushi ${npcID};log?` + _("完成拜师", "完成拜師!"));
        return
      }
      PLU.execActions("jh 2;n;n;e;s;luoyang317_op1;go_hjs go;se;se;ne;w;n;", () => {
        PLU.goHJS(idx, process);
      });
    },
    //================================================================================================
    goHJS(idx, process) {
      let where = null;
      let master_list = [];
      switch (idx) {
        case 1:
          where = _("镜星府", "鏡星府");
          master_list.push(_("那罗", "那羅"));
          master_list.push("洪昭天");
          master_list.push("白一竹");
          master_list.push("裴若海");
          master_list.push(_("上官晓芙", "上官曉芙"));
          break
        case 2:
          where = "碧落城";
          master_list.push(_("铁术", "鐵術"));
          master_list.push(_("萧正兴", "蕭正興"));
          master_list.push(_("呼延铮", "呼延錚"));
          master_list.push(_("厉乘风", "厲乘風"));
          master_list.push(_("花落云", "花落雲"));
          break
        case 3:
          where = _("荣威镖局", "榮威鏢局");
          master_list.push(_("马万啸", "馬萬嘯"));
          master_list.push("高芝城");
          master_list.push("王世仲");
          master_list.push("辰川");
          master_list.push(_("墟归一", "墟歸一"));
          break
      }
      let npc = master_list[process];
      let roomInfo = g_obj_map.get("msg_room");
      let curName = UTIL.filterMsg(roomInfo.get("short") || "");
      let act = "";
      if (curName == _("青苔石阶", "青苔石階") && roomInfo.get("northwest") == _("青苔石阶", "青苔石階")) act = "nw";
      else if (curName == _("青苔石阶", "青苔石階") && roomInfo.get("northeast") == _("青苔石阶", "青苔石階")) act = "ne";
      else if (curName == _("青苔石阶", "青苔石階") && roomInfo.get("southwest") == _("青苔石阶", "青苔石階")) act = "sw";
      else if (curName == _("榆叶林", "榆葉林") && roomInfo.get("north") == _("榆叶林", "榆葉林")) act = "n";
      else if (curName == _("榆叶林", "榆葉林") && roomInfo.get("south") == _("榆叶林", "榆葉林")) act = "s";
      else if (curName == _("杭界大门", "杭界大門") && roomInfo.get("north") == _("青苔石阶", "青苔石階")) act = "n";
      else if (curName == "世外桃源" && where == _("镜星府", "鏡星府")) act = "=500;nw;=500";
      else if (curName == "世外桃源" && where == _("荣威镖局", "榮威鏢局")) act = "=500;ne;=500";
      else if (curName == "世外桃源" && where == "碧落城") act = "=500;s;=500";
      if (act)
        PLU.execActions(act, () => {
          roomInfo = g_obj_map.get("msg_room");
          curName = PLU.dispatchChineseMsg(roomInfo.get("short"));
          let npcObj = roomInfo.get("npc1");
          if (npcObj) {
            var npcID = npcObj.split(",")[0];
            var npcName = UTIL.filterMsg(npcObj.split(",")[1]);
            console.log("npc: " + npcObj);
          }
          console.log(curName);
          if (npc && curName == where) {
            console.log("抵達: " + curName);
            if (npcName != npc || !npcObj) {
              PLU.execActions("jh 2;n;n;e;s;luoyang317_op1;go_hjs go;se;se;ne;w;n;", () => {
                PLU.goHJS(idx, process);
              });
            } else if (npcObj && npcName == npc) {
              console.log("找到目標: " + npcName);
              PLU.execActions(`apprentice ${npcID};skills ${npcID};`, () => {
                var needSkills = [];
                PLU.getSkillsList(function (allSkills, tupoSkills) {
                  PLU.TMP.MASTER_SKILLS.forEach(function (ms) {
                    var sk = allSkills.find(function (s) {
                      return s.key == ms.key;
                    }) || {
                      level: 0
                    };
                    if (sk.level < ms.level) {
                      needSkills.push({
                        key: ms.key,
                        name: ms.name,
                        lvl: ms.level - sk.level,
                        cmd: "learn " + ms.key + " from " + PLU.TMP.MASTER_ID + " to 10"
                      });
                    }
                  });
                  //console.log(needSkills.map(e=>e.name))
                  loopLearn(needSkills);
                });
                var curSkill = null;
                UTIL.addSysListener("loopLearnSkill", function (b, type, subtype, msg) {
                  if (type == "notice" && msg.indexOf("不愿意教你") >= 0) {
                    // UTIL.delSysListener("loopLearnSkill");
                    if (curSkill) curSkill.lvl = -1;
                  }
                  return;
                });
                var loopLearn = function loopLearn(list) {
                  if (list.length > 0) {
                    if (list[0].lvl > 0) {
                      list[0].lvl -= 10;
                      curSkill = list[0];
                      clickButton(list[0].cmd);
                    } else {
                      list.shift();
                    }
                    setTimeout(function () {
                      loopLearn(list);
                    }, _(200, 400));
                  } else {
                    UTIL.delSysListener("loopLearnSkill");
                    process++;
                    PLU.baiHJS(idx, process, true);
                  }
                };
              });
            }
          } else if ([_("镜星府", "鏡星府"), "碧落城", _("荣威镖局", "榮威鏢局")].includes(curName) && curName !== where) {
            PLU.execActions("jh 2;n;n;e;s;luoyang317_op1;go_hjs go;se;se;ne;w;n;", () => {
              PLU.goHJS(idx, process);
            });
          } else {
            PLU.goHJS(idx, process);
          }
        });
    },
    //================================================================================================
    goHaRi(callback) {
      if (UTIL.inHome()) {
        PLU.execActions("rank go 263;e;s;w;w;s;sw;sw;sw;sw;nw;nw;n;nw;ne;", () => {
          PLU.goHaRi(callback);
        });
        return
      }
      let roomInfo = g_obj_map.get("msg_room");
      let curName = UTIL.filterMsg(roomInfo.get("short")) || "";
      let act = "";
      if (curName == _("沙漠迷宫", "沙漠迷宮")) {
        if (roomInfo.get("east") == _("沙漠迷宫", "沙漠迷宮")) act = "e";
        else if (roomInfo.get("north") == _("沙漠迷宫", "沙漠迷宮")) act = "n";
        else if (roomInfo.get("west") == _("沙漠迷宫", "沙漠迷宮")) act = "w";
        else if (roomInfo.get("south") == _("沙漠迷宫", "沙漠迷宮")) act = "s";
        if (act)
          PLU.execActions(act, () => {
            PLU.goHaRi(callback);
          });
      } else if (curName == "荒漠") {
        PLU.execActions("n;n;nw;n;ne;")
        UTIL.addSysListener("HaRi", function (b, type, subtype, msg) {
          if (type !== "jh" || subtype !== "info") return
          if (b.get("short") !== "黑水城") return
          UTIL.delSysListener("HaRi");
          if (!callback) return
          PLU.execActions("event_1_28045408;", callback);
        });
      } else {
        PLU.execActions("rank go 263;e;s;w;w;s;sw;sw;sw;sw;nw;nw;n;nw;ne;", () => {
          PLU.goHaRi(callback);
        });
      }
    },
    //================================================================================================
    queryJHMenu($btn, jhname) {
      let npcList = PLU.YFD.mapsLib.Npc.filter((e) => e.jh == jhname);
      npcList.forEach((e) => {
        let str = [e.jh, e.loc, e.name].filter((s) => !!s).join("-");
        YFUI.writeToOut(
          "<span><a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.goNpcWay(\"" +
          str +
          '","' +
          e.way +
          "\")'>" +
          str +
          "</a> &nbsp;&nbsp;<a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.showNpcWay(\"" +
          str +
          '","' +
          e.way +
          "\")'>" + _("路径详情", "路徑詳情") + "</a></span>",
        );
      });
      YFUI.writeToOut("<span>----------</span>");
    },
    //================================================================================================
    toQueryNpc() {
      YFUI.showInput({
        title: "查找NPC",
        text: _(
          "输入NPC名字或想查找的物品名称，可模糊匹配，支持<a target='_blank' href='https://www.runoob.com/regexp/regexp-syntax.html'>正则表达式</a>，同时支持简体（不包括地址名）和繁体<br>" +
          "正则表达式之外语法例子：<br>" +
          "[例1] 开封@毒蛇<br>" +
          "[例2] 星宿海@百龙山@毒蛇<br>" +
          "[例3] #桃花肚兜",
          "輸入NPC名字或想查找的物品名稱，可模糊匹配，支持<a target='_blank' href='https://zh.wikipedia.org/wiki/正則表達式'>正則表達式</a>，同時支持簡體和繁體<br>" +
          "正則表達式之外語法例子：<br>" +
          "[例1] 開封@毒蛇<br>" +
          "[例2] 星宿海@百龍山@毒蛇<br>" +
          "[例3] 桃花肚兜",
        ),
        value: PLU.getCache("prevSearchStr") || "^.?(男|女)[孩童]",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          PLU.setCache("prevSearchStr", str);
          PLU.queryNpc(str + "道");
        },
        onNo() { },
      });
    },
    // 查询房间路径
    queryRoomPath() {
      var _g_obj_map2;
      if (UTIL.inHome()) return;
      var jh = PLU.YFD.cityId[(_g_obj_map2 = g_obj_map) === null || _g_obj_map2 === void 0 || (_g_obj_map2 = _g_obj_map2.get("msg_room")) === null || _g_obj_map2 === void 0 ? void 0 : _g_obj_map2.get("map_id")];
      if (jh) {
        var _g_obj_map3, _PLU$queryNpc$;
        var room = ansi_up.ansi_to_text((_g_obj_map3 = g_obj_map) === null || _g_obj_map3 === void 0 || (_g_obj_map3 = _g_obj_map3.get("msg_room")) === null || _g_obj_map3 === void 0 ? void 0 : _g_obj_map3.get("short"));
        return (_PLU$queryNpc$ = PLU.queryNpc(jh + "@" + room + "@.*道", true)[0]) === null || _PLU$queryNpc$ === void 0 ? void 0 : _PLU$queryNpc$.way;
      }
    },
    // 链接两个路径终点
    linkPath(pathA, pathB) {
      if (!pathA) return pathB;
      let arrayA = pathA.split(";");
      let arrayB = pathB.split(";");
      let len = Math.min(arrayA.length, arrayB.length);
      for (var index = 0; index < len; index++) if (arrayA[index] != arrayB[index]) break;
      if (!index) return pathB;
      return arrayA
        .slice(index)
        .reverse()
        .map((e) => {
          let cmd = e.match(/^(#\d+ )?([ns]?[we]?)$/);
          if (cmd) {
            if (!cmd[1]) cmd[1] = "";
            if (cmd[2].indexOf("n") == 0) {
              var way = cmd[2].replace("n", "s");
            } else {
              var way = cmd[2].replace("s", "n");
            }
            if (way.indexOf("w") >= 0) {
              way = way.replace("w", "e");
            } else {
              way = way.replace("e", "w");
            }
            return cmd[1] + way;
          }
          // 迷宫反走
          cmd = e.match(/^(.+):(.+)\^(.+)$/);
          if (cmd) return cmd[1] + ":" + cmd[3] + "^" + cmd[2];
          return e;
        })
        .concat(arrayB.slice(index))
        .join(";");
    },
    // 最短路径
    minPath(pathA, pathB) {
      let linkPath = PLU.linkPath(pathA, pathB);
      if (linkPath == "" || linkPath == pathB) return linkPath;
      let a = linkPath.split(";");
      let len = a.length;
      for (var index = 0; index < len; index++) {
        let cmd = a[index].match(/^(.+):(.+\^.+)$/);
        if (cmd) a[index] = PLU.YFD.mapsLib.Labyrinth[cmd[1]][cmd[2]];
      }
      a = a.join(";").split(";");
      let b = pathB.split(";");
      len = b.length;
      for (var index = 0; index < len; index++) {
        let cmd = b[index].match(/^(.+):(.+\^.+)$/);
        if (cmd) b[index] = PLU.YFD.mapsLib.Labyrinth[cmd[1]][cmd[2]];
      }
      b = b.join(";").split(";");
      return a.length <= b.length ? linkPath : pathB;
    },
    //================================================================================================
    formatNpcData(text) {
      let npc = text.match(/^(.*)@(.*)@(.*)道$/);
      if (npc) {
        var jh = npc[1];
        var loc = npc[2];
        var name = "^" + npc[3] + "$";
      } else {
        npc = text.match(/^([^*-]*)[@*-](.*)道$/);
        if (npc) {
          if (npc[1] == _("茶圣", "茶聖") || npc[1] == _("青衣剑士", "青衣劍士")) {
            var name = "^" + npc[1] + "-" + npc[2] + "$";
          } else {
            var jh = npc[1];
            var name = "^" + npc[2] + "$";
          }
        } else {
          npc = text.match(/^(.*)道$/);
          if (npc) {
            var name = npc[1];
          } else {
            var name = text;
          }
        }
      }
      return [jh, loc, name];
    },
    queryNpc(name, quiet) {
      if (!name) return;
      var _PLU$formatNpcData = PLU.formatNpcData(name),
          _PLU$formatNpcData2 = _slicedToArray(_PLU$formatNpcData, 3),
          jh = _PLU$formatNpcData2[0],
          loc = _PLU$formatNpcData2[1],
          tmpName = _PLU$formatNpcData2[2];
      name = tmpName;
      var npcLib = PLU.YFD.mapsLib.Npc;
      npcLib = npcLib.concat(PLU.YFD.mapsLib.Item);
      var findList = npcLib.filter(function (e) {
        if (e.jh == jh && e.loc == loc && (e.name.match(name) || e.name_new && e.name_new.match(name))) return true;
        return false;
      });
      if (findList.length == 0) findList = npcLib.filter(function (e) {
        if ((e.jh == jh || !jh) && (e.name.match(name) || e.name_new && e.name_new.match(name))) return true;
        return false;
      });
      if (findList.length == 0) findList = npcLib.filter(function (e) {
        if (e.name.match(name) || e.name_new && e.name_new.match(name)) return true;
        return false;
      });
      var res = [];
      if (findList && findList.length > 0) {
        findList.forEach(function (e) {
          var str = [e.jh, e.loc, e.name].filter(function (s) {
            return !!s;
          }).join("-");
          if (!quiet) YFUI.writeToOut("<span><a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.goNpcWay(\"" + str + '","' + e.way + "\")'>" + str + '</a> &nbsp;&nbsp;<a style=\'text-decoration:underline;color:yellow;cursor:pointer;\' onclick=\'PLU.showNpcWay("' + str + '","' + e.way + '")\'>路徑詳情</a></span>');
          res.push(e);
        });
        if (!quiet) YFUI.writeToOut("<span>----------</span>");
      } else if (!quiet) {
        YFUI.writeToOut("<span style='color:#F66;'>查詢不到相關數據</span>");
      }
      return res;
    },
    //================================================================================================
    toPathNpc() {
      let defaultMapId = PLU.getCache("pathFindMap") || "1";
      let citys = PLU.YFD.cityList
        .map((c, i) => {
          let issel = i + 1 == defaultMapId ? "selected" : "";
          return '<option value="' + (i + 1) + '" ' + issel + ">" + c + "</option>";
        })
        .join("");
      YFUI.showPop({
        title: _("全图找NPC", "全圖找NPC"),
        text: _(`选择地图, 输入NPC名字，可模糊匹配<br>
				<div style='margin:10px 0;'>
					<span>地图: </span>
					<select id="pathFindMap" style="font-size:15px;height:32px;width:81%;border:1px solid #444;">
						${citys}
					</select>
				</div>
				<div style='margin:10px 0;'>
					<span>名字: </span>
					<input id="pathFindNpc" value="${PLU.getCache("pathFindNpc") || "小龙人"}" style="font-size:14px;height:26px;width:80%;border:1px solid #444;"></input>
				</div>`,
        `選擇地圖, 輸入NPC名字，可模糊匹配<br>
				<div style='margin:10px 0;'>
					<span>地圖: </span>
					<select id="pathFindMap" style="font-size:15px;height:32px;width:81%;border:1px solid #444;">
						${citys}
					</select>
				</div>
				<div style='margin:10px 0;'>
					<span>名字: </span>
					<input id="pathFindNpc" value="${PLU.getCache("pathFindNpc") || "小龍人"}" style="font-size:14px;height:26px;width:80%;border:1px solid #444;"></input>
				</div>`),
        onOk() {
          let mapStr = $.trim($("#pathFindMap").val()),
            npcStr = $.trim($("#pathFindNpc").val());
          if (!npcStr) return;
          PLU.setCache("pathFindMap", mapStr);
          PLU.setCache("pathFindNpc", npcStr);
          let jhMap = PLU.YFD.mapsLib.Map[parseInt(mapStr) - 1];
          if (!jhMap) {
            return YFUI.writeToOut("<span style='color:#F66;'>---" + _("无地图数据", "無地圖數據") + "---</span>");
          } else {
            let ways = jhMap.way.split(";");
            console.log({ paths: ways, idx: 0, objectNPC: npcStr });
            PLU.goPathFindNpc({ paths: ways, idx: 0, objectNPC: npcStr });
          }
        },
        onNo() { },
      });
    },
    goPathFindNpc(params) {
      //goFindYouxia
      if (params.idx >= params.paths.length) {
        setTimeout(() => {
          PLU.execActions("home");
        }, 100);
        YFUI.writeToOut("<span style='color:#FFF;'>--" + _("找不到目标NPC!...已搜索完地图", "找不到目標NPC!...已搜索完地圖") + "--</span>");
        return;
      }
      let acs = [params.paths[params.idx]];
      PLU.actions({
        paths: acs,
        idx: 0,
        onPathsEnd() {
          setTimeout(() => {
            let npcObj = UTIL.findRoomNpcReg(params.objectNPC);
            if (npcObj) {
              YFUI.writeToOut("<span style='color:#FFF;'>--" + _("目标NPC已找到", "目標NPC已找到") + "--</span>");
            } else {
              params.idx++;
              PLU.goPathFindNpc(params);
            }
          }, 100);
        },
        onPathsFail() {
          setTimeout(() => {
            PLU.execActions("home");
          }, 500);
          YFUI.writeToOut("<span style='color:#FFF;'>--" + _("找不到目标NPC!...路径中断", "找不到目標NPC!...路徑中斷") + "--</span>");
          return;
        },
      });
    },
    //================================================================================================
    toQueryMiTi() {
      let defaultMapId = PLU.getCache("pathFindMiTi") || "1";
      let citys = PLU.YFD.cityList
        .map((c, i) => {
          let issel = i + 1 == defaultMapId ? "selected" : "";
          return '<option value="' + (i + 1) + '" ' + issel + ">" + c + "</option>";
        })
        .join("");
      YFUI.showPop({
        title: _("全图找谜题", "全圖找謎題"),
        text: _(`选择地图, 输入关键词（人物，地点，物品）列表（英文逗号隔开）<br>可模糊匹配<br>
            <div style='margin:10px 0;'>
              <span>去哪找: </span>
              <select id="pathFindMap" style="font-size:15px;height:32px;width:81%;border:1px solid #444;">
                ${citys}
              </select>
            </div>
            <div style='margin:10px 0;'>
              <span>要找啥: </span>
              <input id="pathFindKeyword" value="${PLU.getCache("pathFindKeyword") || "柴绍,李秀宁,大鹳淜洲,天罗紫芳衣"
          }" style="font-size:14px;height:26px;width:80%;border:1px solid #444;"></input>
            </div>`,
            `選擇地圖, 輸入關鍵詞（人物，地點，物品）列表（英文逗號隔開）<br>可模糊匹配<br>
            <div style='margin:10px 0;'>
              <span>去哪找: </span>
              <select id="pathFindMap" style="font-size:15px;height:32px;width:81%;border:1px solid #444;">
                ${citys}
              </select>
            </div>
            <div style='margin:10px 0;'>
              <span>要找啥: </span>
              <input id="pathFindKeyword" value="${PLU.getCache("pathFindKeyword") || "柴紹,李秀寧,大鸛淜洲,天羅紫芳衣"
          }" style="font-size:14px;height:26px;width:80%;border:1px solid #444;"></input>
            </div>`),
        onOk() {
          let mapStr = $.trim($("#pathFindMap").val()),
            KeywordStr = $.trim($("#pathFindKeyword").val());
          if (!KeywordStr) return;
          PLU.setCache("pathFindMap", mapStr);
          PLU.setCache("pathFindKeyword", KeywordStr);
          let jhMap = PLU.YFD.mapsLib.Map[parseInt(mapStr) - 1];
          if (!jhMap) {
            return YFUI.writeToOut("<span style='color:#F66;'>---" + _("无地图数据", "無地圖數據") + "---</span>");
          } else {
            let ways = jhMap.way.split(";");
            console.log({ paths: ways, idx: 0, objectKeyword: KeywordStr });
            PLU.MiTiArray = [];
            PLU.goPathFindMiTi({
              paths: ways,
              idx: 0,
              objectKeyword: KeywordStr,
            });
          }
        },
        onNo() { },
      });
    },
    goPathFindMiTi(params) {
      //goFindYouxia
      if (params.idx >= params.paths.length) {
        setTimeout(() => {
          PLU.execActions("home");
        }, 100);
        YFUI.writeToOut("<span style='color:#FFF;'>--" + _("找不到目标谜题!...已搜索完地图", "找不到目標謎題!...已搜索完地圖") + "--</span>");
        return;
      }
      let acs = [params.paths[params.idx]];
      PLU.actions({
        paths: acs,
        idx: 0,
        onPathsEnd() {
          let npcArray = UTIL.getRoomAllNpc();
          UTIL.addSysListener("MiTi", (b, type, subtype, msg) => {
            if (type != "main_msg") return;
            if (msg.match(params.objectKeyword)) PLU.MiTiArray.push(msg);
          });
          for (var npc of npcArray) {
            PLU.execActions("auto_tasks cancel;ask " + npc.key);
          }
          UTIL.delSysListener("MiTi");
          if (PLU.MiTiArray.length) {
            YFUI.writeToOut("<span style='color:#FFF;'>--" + _("目标谜题已找到", "目標謎題已找到") + "--</span>");
            return;
          } else {
            setTimeout(() => {
              params.idx++;
              PLU.goPathFindMiTi(params);
            }, 500);
          }
        },
        onPathsFail() {
          setTimeout(() => {
            PLU.execActions("home");
          }, 500);
          YFUI.writeToOut("<span style='color:#FFF;'>--" + _("路径中断", "路徑中斷") + "--</span>");
          return;
        },
      });
    },
    //================================================================================================
    goNpcWay(desc, way) {
      let goList = PLU.getCache("prevQueryList") || [];
      let newList = goList.filter((e) => e.desc != desc);
      let len = newList.unshift({ desc: desc, way: way });
      if (len > 10) newList.length = 10;
      PLU.setCache("prevQueryList", newList);
      PLU.execActions(way);
    },

    //================================================================================================
    //================================================================================================
    showNpcWay(desc, way) {
      let text = "<span style='color:blue;background:rgba(255,255,244,0.8);padding:1px 10px;display:inline-block;word-break:break-all;'>" + way + "</span></br>";
      let way2 = PLU.linkPath(PLU.queryRoomPath(), way);
      let way3 = PLU.minPath(PLU.queryRoomPath(), way);
      if (way != way2) {
        text +=
          "<span style='color:blue;background:rgba(255,255,244,0.8);padding:1px 10px;display:inline-block;word-break:break-all;'>同图路径（？）：" +
          way2 +
          "</span></br>";
        text +=
          "<span style='color:blue;background:rgba(255,255,244,0.8);padding:1px 10px;display:inline-block;word-break:break-all;'>最短路径（？）：" +
          way3 +
          "</span></br>";
      }
      YFUI.showPop({
        title: _("路径详情：", "路徑詳情：") + desc,
        text: text,
        autoOk: 10,
        okText: _("关闭", "關閉"),
        noText: "前往",
        onOk() { },
        onNo() {
          PLU.goNpcWay(desc, way);
        },
      });
    },
    //================================================================================================
    toQueryHistory() {
      let prevList = PLU.getCache("prevQueryList") || [];
      if (prevList.length == 0) return YFUI.writeToOut("<span style='color:#F66;'>---" + _("无历史数据", "無歷史數據") + "---</span>");
      for (let i = prevList.length - 1; i >= 0; i--) {
        let e = prevList[i];
        YFUI.writeToOut(
          "<span><a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.goNpcWay(\"" +
          e.desc +
          '","' +
          e.way +
          "\")'>" +
          e.desc +
          "</a> &nbsp;&nbsp;<a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.showNpcWay(\"" +
          e.desc +
          '","' +
          e.way +
          "\")'>" + _("路径详情：", "路徑詳情：") + "</a></span>",
        );
      }
      YFUI.writeToOut("<span>----------</span>");
    },
    //================================================================================================
    showMPFZ($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#topMonitor").hide();
        $("#btn_bt_showMPFZ").text(_("纷争显示", "紛爭顯示"));
        PLU.setCache("showTopMonitor", 0);
        return;
      }
      $("#topMonitor").show();
      $("#btn_bt_showMPFZ").text(_("纷争隐藏", "紛爭隱藏"));
      PLU.setCache("showTopMonitor", 1);
    },
    //================================================================================================
    autoFZ($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.setListen($btn, "autoFZ", 0);
        return;
      }
      YFUI.showInput({
        title: _("监听纷争", "監聽紛爭"),
        text: _("请输入要监听的人的名字<br>[例1] 杨肃观<br>[例2] 风际中,荆无命,顾惜朝,杨肃观", "請輸入要監聽的人的名字<br>[例1] 楊肅觀<br>[例2] 風際中,荊無命,顧惜朝,楊肅觀"),
        value: PLU.getCache("Fz_list") || _("杨肃观", "楊肅觀"),
        onOk: function onOk(val) {
          if (!$.trim(val)) return;
          var str = $.trim(val);
          PLU.setCache("Fz_list", str);
          PLU.setListen($btn, "autoFZ", 1);
        },
        onNo: function onNo() {
          PLU.setListen($btn, "autoFZ", 0);
        },
      });
    },
    //================================================================================================
    openCombineGem() {
      let htm = "<div>";
      PLU.YFD.gemType.forEach((t, ti) => {
        htm += "<div>";
        PLU.YFD.gemPrefix.forEach((p, pi) => {
          if (pi > 2)
            htm +=
              '<button onclick="PLU.combineGem(' +
              ti +
              "," +
              pi +
              ')" style="color:' +
              t.color +
              ';width:18%;margin:2px 1%;padding:3px;">' +
              (p.substr(0, 2) + t.name.substr(0, 1)) +
              "</button>";
        });
        htm += "</div>";
      });
      htm += "</div>";
      htm += _(`<div style="margin:10px 0 0 3px;position:absolute;left:15px;bottom:10px;">每次连续合成最多 <input id="maxCombine" type="number" value="1" style="width:50px;height:25px;line-height:25px;" maxlength="3" min=1 max=9999 oninput="if(value.length>4)value=value.substr(0,4)"/> 颗宝石。</div>`, `<div style="margin:10px 0 0 3px;position:absolute;left:15px;bottom:10px;">每次連續合成最多 <input id="maxCombine" type="number" value="1" style="width:50px;height:25px;line-height:25px;" maxlength="3" min=1 max=9999 oninput="if(value.length>4)value=value.substr(0,4)"/> 顆寶石。</div>`);
      YFUI.showPop({
        title: _("合成宝石", "合成寶石"),
        text: htm,
        width: "382px",
        okText: _("关闭", "關閉"),
        onOk() { },
      });
    },
    //================================================================================================
    combineGem(type, grade) {
      if (PLU.TMP.combineTooFast) return YFUI.writeToOut("<span style='color:#F66;'>--" + _("点击不要太快", "點擊不要太快") + "!--</span>");
      PLU.TMP.combineTooFast = setTimeout(() => {
        PLU.TMP.combineTooFast = null;
      }, 600000);
      let targetNum = parseInt($("#maxCombine").val()) || 1;
      let getNum = 0;
      let countString = (combineNum, gemCode) => {
        let combineStr = "";
        if (combineNum % 3 != 0) return "";
        combineStr += "items hecheng " + gemCode + "_N_" + Math.floor(combineNum / 3) + ";";
        return combineStr;
      };
      let needGem = (gemGrade, needNum, gemList) => {
        if (gemGrade < 0) return null;
        let gemName = PLU.YFD.gemPrefix[gemGrade] + PLU.YFD.gemType[type].name;
        let gemCode = PLU.YFD.gemType[type].key + "" + (gemGrade + 1);
        let objGem = gemList.find((e) => e.name == gemName);
        let gemNum = objGem?.num ?? 0;
        if (gemNum >= needNum) {
          return countString(needNum, gemCode);
        } else {
          let dtNum = needNum - gemNum;
          let next = needGem(gemGrade - 1, 3 * dtNum, gemList);
          if (next) return next + countString(needNum, gemCode);
          return null;
        }
      };
      let countCombine = function (cb) {
        PLU.getGemList((gemList) => {
          let runStr = needGem(grade - 1, 3, gemList);
          if (runStr) {
            PLU.fastExec(runStr + "items", () => {
              YFUI.writeToOut("<span style='color:white;'>==" + _("合成宝石", "合成寶石") + "x1==</span>");
              getNum++;
              targetNum--;
              if (targetNum > 0) {
                countCombine(() => {
                  cb && cb(true);
                });
              } else {
                cb && cb(true);
              }
            });
          } else {
            YFUI.writeToOut("<span style='color:#F66;'>--" + _("没有足够的宝石", "沒有足夠的寶石") + "!--</span>");
            cb && cb(false);
          }
        });
      };
      countCombine((end) => {
        clearTimeout(PLU.TMP.combineTooFast);
        PLU.TMP.combineTooFast = null;
        YFUI.writeToOut("<span style='color:white;'>==" + ("合成宝石结束! 得到宝石x", "合成寶石結束! 得到寶石x") + getNum + "==</span>");
      });
    },
    //================================================================================================
    getGemList(callback) {
      let getItemsTimeOut = setTimeout(() => {
        UTIL.delSysListener("getListItems");
      }, 5000);
      UTIL.addSysListener("getListItems", (b, type, subtype, msg) => {
        if (type != "items" || subtype != "list") return;
        UTIL.delSysListener("getListItems");
        clearTimeout(getItemsTimeOut);
        //clickButton("prev");
        let iId = 1,
          itemList = [];
        while (b.get("items" + iId)) {
          let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
          if (it && it.length > 4 && it[3] == "0" && it[1].match(_("宝石", "寶石")))
            itemList.push({
              key: it[0],
              name: it[1],
              num: Number(it[2]),
            });
          iId++;
        }
        callback && callback(itemList);
      });
      clickButton("items", 0);
    },
    //================================================================================================
    getAllItems(callback) {
      let getItemsTimeOut = setTimeout(() => {
        UTIL.delSysListener("getListItems");
      }, 5000);
      UTIL.addSysListener("getListItems", (b, type, subtype, msg) => {
        if (type != "items" || subtype != "list") return;
        UTIL.delSysListener("getListItems");
        clearTimeout(getItemsTimeOut);
        clickButton("prev");
        let iId = 1,
          itemList = [];
        while (b.get("items" + iId) || b.get("stores" + iId)) {
          let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
          if (it && it.length > 4) {
            itemList.push({
              key: it[0],
              name: it[1],
              num: Number(it[2]),
              equipped: it[3] === "1",
              store: false,
            });
          }
          it = UTIL.filterMsg(b.get("stores" + iId)).split(",");
          if (it && it.length > 3) {
            itemList.push({
              key: it[0],
              name: it[1],
              num: Number(it[2]),
              store: true,
            });
          }
          iId++;
          console.log
        }
        callback && callback(itemList);
      });
      clickButton("items", 0);
    },

    //================================================================================================
    saveSetting(checkeds) {
      for (let psid in PLU.pSettingMaps) {
        let pSettingD = PLU.pSettingMaps[psid];
        let pms = (checkeds.includes(psid)) ? "true" : "false";
        PLU.setCache("pSetting_" + pSettingD.n, pms);
        console.log(PLU.getCache("pSetting_" + pSettingD.n))
      }
    },
    //================================================================================================
    backupSetting() {
      let config = {};
      config.GM = GM_info;
      config.GM.scriptMetaStr = undefined;
      config.GM.script.header = undefined;
      config.PLU = {};
      config.PLU.CACHE = UTIL.getMem("CACHE");
      config.PLU.HISTORY = UTIL.getMem("HISTORY");
      config.PLU.STATUS = PLU.STATUS;
      config.PLU.TMP = PLU.TMP;
      const reader = new FileReader();
      reader.readAsDataURL(new Blob([JSON.stringify(config)], { type: "application/json" }));
      reader.onload = (e) => {
        let a = document.createElement("a");
        a.download = _("无剑配置-", "無劍配置-") + PLU.accId + "-" + new Date().getTime() + ".json";
        a.style.display = "none";
        a.href = reader.result;
        a.click();
      };
    },
    //================================================================================================
    loadSetting() {
      let input = document.createElement("input");
      input.type = "file";
      input.id = "config";
      input.accept = "application/json";
      input.style.display = "none";
      input.onchange = () => {
        const reader = new FileReader();
        reader.readAsText(input.files[0]);
        reader.onload = (e) => {
          const config = JSON.parse(reader.result);
          UTIL.setMem("CACHE", config.PLU.CACHE);
          UTIL.setMem("HISTORY", config.PLU.HISTORY);
          PLU.initStorage();
          PLU.TMP = config.PLU.TMP;
          PLU.STATUS = config.PLU.STATUS;
          YFUI.writeToOut("<span style='color:yellow;'>==" + _("加载完成", "加載完成") + "==</span>");
        };
      };
      input.click();
    },
  };
  //=================================================================================
  // UTIL模塊
  //=================================================================================
  window.UTIL = {
    //================
    accId: null,
    areaId: 1,
    sysListeners: {},
    logHistory: [],
    //================
    getUrlParam(key) {
      let res = null,
        au = location.search.split("?"),
        sts = au[au.length - 1].split("&");
      sts.forEach((p) => {
        if (p.split("=").length > 1 && key == p.split("=")[0]) res = unescape(p.split("=")[1]);
      });
      return res;
    },
    getAccId() {
      this.accId = this.getUrlParam("id");
      return this.accId;
    },
    getAreaId() {
      this.areaId = this.accId.split('(')[1].replace(')', '');
      this.aid = null;
      if (this.areaId <= 20) this.aid = "1"; else if (this.areaId > 20 || this.areaId <= 40) this.aid = "2"; else if (this.areaId > 40 || this.areaId <= 60) this.aid = "3"; else if (this.areaId > 60 || this.areaId <= 80) this.aid = "4"; else if (this.areaId > 80 || this.areaId <= 100) this.aid = "5"; else if (this.areaId == 101) this.aid = "6"; else if (this.areaId == 102) this.aid = "7";

      return parseInt(this.aid);
    },
    setMem(key, data) {
      localStorage.setItem("PLU_" + this.accId + "_" + key, data);
    },
    getMem(key) {
      return localStorage.getItem("PLU_" + this.accId + "_" + key);
    },
    rnd() {
      return Math.floor(Math.random() * 1000000);
    },
    getuuid: function () {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    getNow(timestamp) {
      var date = timestamp ? new Date(timestamp) : new Date();
      var Y = date.getFullYear();
      var M = (date.getMonth() + 1 + "").padStart(2, "0");
      var D = (date.getDate() + "").padStart(2, "0");
      var h = (date.getHours() + "").padStart(2, "0");
      var m = (date.getMinutes() + "").padStart(2, "0");
      var s = (date.getSeconds() + "").padStart(2, "0");
      return M + "-" + D + " " + h + ":" + m + ":" + s;
    },
    log({ msg, type, time, isHistory }) {
      let style = "color:#333";
      if (type == "TF") {
        let co = msg.match("夜魔") ? "#F0F" : "#666";
        style = "color:" + co;
      } else if (type == "QL") {
        style = "color:#00F";
      } else if (type == "MPFZ") {
        style = "color:#F60";
      } else if (type == "LPFZ") {
        style = "color:#033";
      } else if (type == "KFQL") {
        style = "color:#F00;background:#FF9;";
      } else if (type == "YX") {
        let co2 = msg.match(_("宗师】", "宗師】")) ? "#00F" : msg.match(_("侠客】", "俠客】")) ? "#08F" : msg.match("魔尊】") ? "#F00" : msg.match("邪武】") ? "#F80" : "#999";
        style = "color:" + co2 + ";background:#CFC;";
      } else if (type == "BF") {
        style = "color:#FFF;background:#93C;";
      } else if (type == "TIPS") {
        style = "color:#29F";
      }
      //console.log('%c%s',style,this.getNow(time)+msg)
      if (!isHistory) {
        this.logHistory.push({ msg, type, time });
        this.setMem("HISTORY", JSON.stringify(this.logHistory));
      }
      let evt = new Event("addLog");
      evt.ext = { msg, type, time, style };
      document.dispatchEvent(evt);
    },
    filterMsg(s) {
      if (typeof s == "string") return s.replace(/[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
      return "";
    },
    sysDispatchMsg(b, type, subtype, msg) {
      for (var key in this.sysListeners) {
        this.sysListeners[key](b, type, subtype, msg);
      }
    },
    addSysListener(key, fn) {
      this.sysListeners[key] = fn;
    },
    delSysListener(key) {
      delete this.sysListeners[key];
    },
    findRoomNpc(npcName, gb, searchAll) {
      console.debug(npcName);
      let roomInfo = g_obj_map.get("msg_room");
      if (!roomInfo) return null;
      for (let i = roomInfo.elements.length - 1; i >= 0; i--) {
        let bNpc = this.getSpNpcByIdx(roomInfo, i, searchAll);
        if (bNpc && bNpc.name == npcName) {
          if (!gb) return bNpc;
          else {
            let gNpc = this.getSpNpcByIdx(roomInfo, i - gb);
            if (gNpc) return gNpc;
          }
        }
      }
      return null;
    },
    roomHasNpc() {
      let roomInfo = g_obj_map.get("msg_room");
      let res = false;
      if (!roomInfo) return null;
      for (let i = roomInfo.elements.length - 1; i >= 0; i--) {
        if (roomInfo.elements[i].key.match("npc")) {
          res = true;
          break;
        }
      }
      return res;
    },
    getRoomAllNpc() {
      let roomInfo = g_obj_map.get("msg_room");
      let res = [];
      if (!roomInfo) return res;
      for (let i = roomInfo.elements.length - 1; i >= 0; i--) {
        let npc = roomInfo.elements[i].key.match(/npc(\d+)/);
        if (npc) {
          let infoArr = roomInfo.elements[i].value.split(",");
          let name = this.filterMsg(infoArr[1]);
          res.push({ name: name, key: infoArr[0] });
        }
      }
      return res;
    },
    findRoomNpcReg(npcName) {
      let roomInfo = g_obj_map.get("msg_room");
      if (!roomInfo) return null;
      for (let i = roomInfo.elements.length - 1; i >= 0; i--) {
        let npc = roomInfo.elements[i].key.match(/npc(\d+)/);
        if (npc) {
          let infoArr = roomInfo.elements[i].value.split(",");
          let name = this.filterMsg(infoArr[1]);
          if (name.match(npcName)) return { name: name, key: infoArr[0] };
        }
      }
      return null;
    },
    getSpNpcByIdx(roomInfo, idx, searchAll) {
      let npcInfo = roomInfo.get("npc" + idx);
      if (npcInfo) {
        let infoArr = npcInfo.split(",");
        let name = this.filterMsg(infoArr[1]);
        if (searchAll) return { name: name, key: infoArr[0] };
        if (name != infoArr[1]) return { name: name, key: infoArr[0] };
      }
      return null;
    },
    getItemFrom(name) {
      if (g_gmain.is_fighting) return;
      var item = g_obj_map.get("msg_room")?.elements.find((it) => it.key.substring(0, 4) == "item" && it.value.indexOf(name) >= 0);
      if (item) {
        clickButton("get " + item.value.split(",")[0]);
      }
    },
    inHome() {
      return gSocketMsg._is_in_home;
    },
    checkMVP() {
      return PLU.getCache("isMVP") || 0;
    }
  };
  //=================================================================================
  // UI模塊
  //=================================================================================
  window.YFUI = {
    init() {
      let maxW = $("#out").width() > 634 ? 634 : $("#out").width();
      console.log($("#page").width(), $("#out").width());
      let rightStyle = $("#page").width() - $("#out").width() > 4 ? "left:" + (maxW - 76 + 4) + "px;" : "right:0;";
      this.$Panel = $(
        '<div id="WJPlug_Panel" style="pointer-events:none;position:absolute;z-index:9999;' +
        rightStyle +
        ';top:5.5%;font-size:12px;line-height:1.2;text-align:right;list-style:none;">',
      );
      $("body").append(this.$Panel);
    },
    addBtnGroup({ id, style }) {
      let $box = $('<div id="' + id + '" style="position:relative;"></div>');
      style && $box.css(style);
      this.$Panel.append($box);
      return $box;
    },
    addBtn({ id, groupId, text, onclick, style, boxStyle, extend, children, canSet }) {
      let $box = $('<div id="' + id + '" class="btn-box" style="position:relative;pointer-events:auto;"></div>');
      let $btn = $(
        '<button id="btn_' +
        id +
        '" style="padding:4px 2px;box-sizing:content-box;margin:1px 1px;border:1px solid #333;border-radius:4px;width:68px;">' +
        text +
        "</button>",
      );
      style && $btn.css(style);
      boxStyle && $box.css(boxStyle);
      $btn.$extend = extend;
      $btn.click((e) => {
        onclick && onclick($btn, $box);
      });
      $box.append($btn);
      if (children) $box.append($('<b style="position:absolute;left:1px;top:3px;font-size:12px;">≡</b>'));
      if (canSet) {
        let $setbtn = $(
          '<i style="position:absolute;right:-8px;top:2px;font-size:14px;background:#333;color:#fff;font-style:normal;;line-height:1;border:1px solid #CCC;border-radius:100%;padding:2px 6px;cursor:pointer;">S</i>',
        );
        $box.append($setbtn);
        $setbtn.click((e) => {
          onclick && onclick($btn, $box, "setting");
        });
      }
      groupId ? $("#" + groupId).append($box) : this.$Panel.append($box);
      $box.$button = $btn;
      return $box;
    },
    addMenu({ id, groupId, text, extend, style, menuStyle, multiCol, onclick, children }) {
      //{text,id,btnId}
      let $btnBox = this.addBtn({ id, groupId, text, extend, style, children }),
        _this = this;
      function addMenuToBtn({ btnId, $parent, list, menuStyle }) {
        let $listBox = $('<div id="menu_' + btnId + '" class="menu" style="position:absolute;top:0;right:' + $parent.width() + 'px;display:none;"></div>');
        $parent.append($listBox);
        list &&
          list.forEach((sub) => {
            let btnOpt = Object.assign({}, sub, { groupId: "menu_" + btnId });
            if (!btnOpt.onclick) {
              btnOpt.onclick = onclick;
            }
            if (multiCol) btnOpt.boxStyle = Object.assign({}, { display: "inline-block" }, btnOpt.boxStyle);
            let $subBtnBox = _this.addBtn(btnOpt);
            if (sub.children)
              $subBtnBox.$list = addMenuToBtn({
                btnId: sub.id,
                $parent: $subBtnBox,
                list: sub.children,
                menuStyle: sub.menuStyle,
              });
          });
        $parent.$button.click((e) => {
          $listBox.toggle().css({ right: $parent.width() + 5 });
          menuStyle && $listBox.css(menuStyle);
          $listBox.is(":visible") && $listBox.parent().siblings(".btn-box").find(".menu").hide();
          onclick && onclick($parent.$button, $parent);
        });
        return $listBox;
      }
      $btnBox.$list = addMenuToBtn({
        btnId: id,
        $parent: $btnBox,
        list: children,
        menuStyle: menuStyle,
      });
      return $btnBox;
    },
    showPop(params) {
      if ($("#myTools_popup").length) $("#myTools_popup").remove();
      params = params || {};
      let okText = params.okText || _("确定", "確定"),
        noText = params.noText || "取消",
        _this = this;
      _this.SI_autoOk && clearInterval(_this.SI_autoOk);
      _this.SI_autoOk = null;
      let ph = `<div style="z-index:9999;position:fixed;top: 40%;left:50%;width:100%;height:0;font-size:14px;" id="myTools_popup">
			<div class="popup-content" style="width:${params.width || "70%"
        };max-width:512px;background: rgba(255,255,255,.8);border:1px solid #999999;border-radius: 10px;transform: translate(-50%,-50%) scale(.1,.1);transition:all .1s;">
			<div style="padding: 10px 15px;"><span style="font-weight:700;">${params.title || ""
        }</span><span style="float:right;color:#666;cursor:pointer;" class="btncl">✖</span></div>
			<div style="padding: 0 15px;line-height:1.5;max-height:500px;overflow-y:auto;">${params.text || ""}</div>
			<div style="padding: 0 15px;line-height:1.5;max-height:500px;overflow-y:auto;">${params.texta || ""}</div>
      <div style="text-align:right;padding: 10px;">`;
      if (params.onNo) ph += `<button style="margin-right: 15px;padding: 5px 20px;border: 1px solid #000;border-radius:5px;" class="btnno">${noText}</button>`;
      ph += `<button style="padding: 5px 20px;background-color: #963;color:#FFF;border: 1px solid #000;border-radius: 5px;" class="btnok">${okText}</button>
			</div></div></div>`;
      let $ph = $(ph);
      if (params.fn) params.fn && params.fn();
      $("body").append($ph);
      setTimeout(() => {
        $ph.find(".popup-content").css({ transform: "translate(-50%,-50%) scale(1,1)" });
        params.afterOpen && params.afterOpen($ph);
      }, 100);
      if (params.autoOk) {
        let autoCloseN = Number(params.autoOk);
        $("#myTools_popup .btnok").text(okText + "(" + autoCloseN + "s)");
        _this.SI_autoOk = setInterval(() => {
          autoCloseN--;
          $("#myTools_popup .btnok").text(okText + "(" + autoCloseN + "s)");
          if (autoCloseN < 1) {
            $ph.find(".btnok").click();
          }
        }, 1000);
      } else if (params.autoNo) {
        let autoCloseN = Number(params.autoNo);
        $("#myTools_popup .btnno").text(noText + "(" + autoCloseN + "s)");
        _this.SI_autoOk = setInterval(() => {
          autoCloseN--;
          $("#myTools_popup .btnno").text(noText + "(" + autoCloseN + "s)");
          if (autoCloseN < 1) {
            $ph.find(".btnno").click();
          }
        }, 1000);
      }
      $ph.find(".btncl").click((e) => {
        _this.SI_autoOk && clearInterval(_this.SI_autoOk);
        params.onX && params.onX();
        $ph.remove();
      });
      $ph.find(".btnno").click((e) => {
        _this.SI_autoOk && clearInterval(_this.SI_autoOk);
        params.onNo && params.onNo();
        $ph.remove();
      });
      $ph.find(".btnok").click((e) => {
        _this.SI_autoOk && clearInterval(_this.SI_autoOk);
        params.onOk && params.onOk($ph);
        $ph.remove();
      });
    },
    showInput(params) {
      let popParams = Object.assign({}, params);
      let inpstyle = "font-size:14px;line-height:1.5;width:100%;padding:5px;border:1px solid #999;border-radius:5px;margin:5px 0;outline:none;box-sizing:border-box;";
      if (params.height) inpstyle = `font-size:14px;line-height:1.5;width:100%;height:${params.height};padding:5px;border:1px solid #999;border-radius:5px;margin:5px 0;outline:none;box-sizing:border-box;`;
      if (params.inputs && params.inputs.length > 1) {
        for (let i = 0; i < params.inputs.length; i++) {
          let val = params.value[i] || "";
          popParams.text += `<div><div style="width:20%;float:left;margin:5px 0;line-height:2;text-align:right;">${params.inputs[i]}: </div><div style="width:73%;margin-left:21%;">`;
          popParams.text +=
            params.type == "textarea"
              ? `<textarea id="myTools_popup_input_${i}" rows="4" style="${inpstyle}">${val}</textarea></div></div>`
              : `<input id="myTools_popup_input_${i}" type="text" value="${val}" style="${inpstyle}"/></div></div>`;
        }
        popParams.onOk = () => {
          let val = [];
          for (let i = 0; i < params.inputs.length; i++) {
            val.push($("#myTools_popup_input_" + i).val());
          }
          params.onOk(val);
        };
      } else {
        popParams.text +=
          params.type == "textarea"
            ? `<div><textarea id="myTools_popup_input" rows="4" style="${inpstyle}">${params.value || ""}</textarea></div>`
            : `<div><input id="myTools_popup_input" type="text" value="${params.value || ""}" style="${inpstyle}"/></div>`;
        popParams.onOk = () => {
          let val = $("#myTools_popup_input").val();
          params.onOk(val);
        };
      }
      this.showPop(popParams);
    },
    showInfoPanel(params) {
      if ($("#myTools_InfoPanel").length) $("#myTools_InfoPanel").remove();
      params = params || {};
      let okText = params.okText || _("关闭", "關閉"),
        noText = params.noText || "取消",
        _this = this;
      let $ph = $(`<div style="z-index:9900;position:fixed;top:10%;left:0;width:100%;height:0;font-size:12px;" id="myTools_InfoPanel">
			<div class="infoPanel-content" style="width:${params.width || "75%"
        };max-width:512px;height:620px;background: rgba(255,255,255,.9);border:1px solid #999;border-radius:0 10px 10px 0;transform: translate(-100%,0);transition:all .1s;">
				<div style="padding: 10px 15px;"><span style="font-weight:700;">${params.title || ""
        }</span><span style="float:right;color:#666;cursor:pointer;" class="btncl">✖</span></div>
				<div style="padding: 0 15px;line-height:1.5;height:550px;overflow-y:auto;" class="infoPanel-wrap">${params.text || ""}</div>
				<div style="text-align:right;padding: 10px;">
				<button style="padding: 5px 20px;background-color: #969;color:#FFF;border: 1px solid #000;border-radius: 5px;margin-right:25px;" class="btnno">${noText}</button>
				<button style="padding: 5px 20px;background-color: #963;color:#FFF;border: 1px solid #000;border-radius: 5px;" class="btnok">${okText}</button>
				</div>
			</div></div>`);
      $("body").append($ph);
      setTimeout(() => {
        $ph.find(".infoPanel-content").css({ transform: "translate(0,0)" });
        params.onOpen && params.onOpen();
      }, 100);
      $ph.find(".btncl").click((e) => {
        params.onClose && params.onClose();
        $ph.remove();
      });
      $ph.find(".btnok").click((e) => {
        params.onOk && params.onOk();
        params.onClose && params.onClose();
        $ph.remove();
      });
      $ph.find(".btnno").click((e) => {
        params.onNo && params.onNo();
      });
      return $ph;
    },
    showTimeTable(params) {
      var popParams = Object.assign({}, params);
      var inpstyle = "font-size:14px;line-height:1;padding:5px;border:1px solid #999;border-radius:5px;margin:5px 0;outline:none;box-sizing:border-box;";
      var daysOfWeek = ['一', '二', '三', '四', '五', '六', '日'];

      var aisb = daysOfWeek.length;
      if (popParams.times) aisb *= popParams.times;

      for (var i = 0; i < aisb; i++) {
        var val = '';
        var rowIndex = Math.floor(i / 7);

        if (i % 7 == 0) {
          popParams.text += '<div>';
          popParams.text += '<div style="display:flex;align-items:center;">';
          popParams.text += '<label style="margin-right:10px;text-align:left;width:80px;">' + popParams.t[rowIndex] + '</label></div>';
          popParams.text += '<div style="display:flex;align-items:center;">';
        }
        if (i % 7 == 4) {
          popParams.text += '</div>';
          popParams.text += '<div style="display:flex;align-items:center;">';
        }
        var checked = (params.value && params.value[daysOfWeek[i % 7] + '_' + popParams.t[rowIndex]]) ? 'checked' : '';
        popParams.text += '<label style="margin-right:10px;"><input type="checkbox" id="myTools_TimeTable_' + daysOfWeek[i % 7] + '_' + popParams.t[rowIndex] + '" ' + checked + '> ' + daysOfWeek[i % 7] + '</label>';

        if (i % 7 == 6 && popParams.times) popParams.text += '</div>';
      }
      popParams.text += '</div>';
      popParams.text += '</div><button class="TimeTableAll" style="cursor:pointer;position:absolute;left:15px;bottom:10px;">' + _('全选', '全選') + '</button>';

      popParams.onOk = function () {
        var val = {};
        for (var i = 0; i < daysOfWeek.length; i++) {
          for (var j = 0; j < popParams.times; j++) {
            val[daysOfWeek[i] + '_' + popParams.t[j]] = $("#myTools_TimeTable_" + daysOfWeek[i] + '_' + popParams.t[j]).is(':checked');
          }
        }
        params.onOk(val);
      };

      $(document).on('click', '.TimeTableAll', function() {
        $('input[type="checkbox"]').prop('checked', true);
      });

      this.showPop(popParams);
    },
    writeToOut(html) {
      var m = new unsafeWindow.Map();
      m.put("type", "main_msg");
      m.put("subtype", "html");
      m.put("msg", html);
      gSocketMsg.dispatchMessage(m);
    },
  };
  // 檢查本地緩存是否存在
  const database = _("491698", "491615")
  const data_language = _("dataFile_version_CN", "dataFile_version_TW")
	const data_Month = new Date().getMonth() + 1;
	const data_Date = new Date().getDate();
	const data_Uid = location.href.match(/\?id=(.*?)&time=/)[1];
	
	if (!localStorage.getItem('dataFile') || !localStorage.getItem(data_language)) {
		// 本地緩存不存在，從特定網址下載文件
		GreasyFork.getScriptData(database).then(data => {
			localStorage.setItem(data_language, data.version);
			GreasyFork.getScriptCode(database).then(data => {
				localStorage.setItem('dataFile', data);
				alert(_("脚本数据库更新完成\n当前版本: ", "腳本數據庫更新完成\n當前版本: ") + localStorage.getItem(data_language));
				location.reload();
			});
		});
	} else {
		GreasyFork.getScriptData(database).then(data => {
			if (localStorage.getItem(data_language) == data.version) {
				/*var firebaseAppScript = document.createElement('script');
				firebaseAppScript.type = 'module';
				firebaseAppScript.src = 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
				document.body.appendChild(firebaseAppScript);
				var firebaseAnalyticsScript = document.createElement('script');
				firebaseAnalyticsScript.type = 'module';
				firebaseAnalyticsScript.src = 'https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js';
				document.body.appendChild(firebaseAnalyticsScript);*/
				init();
			} else {
				GreasyFork.getScriptData(database).then(data => {
					localStorage.setItem(data_language, data.version);
					GreasyFork.getScriptCode(database).then(data => {
						localStorage.setItem('dataFile', data);
						alert(_("脚本数据库更新完成\n当前版本: ", "腳本數據庫更新完成\n當前版本: ") + localStorage.getItem(data_language));
						location.reload();
					});
				});
			}
		});
	}
});