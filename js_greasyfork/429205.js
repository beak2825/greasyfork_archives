// ==UserScript==
// @name         哔哩哔哩番剧出差助手
// @namespace    bilibili_abroad_assistant
// @version      2.4.7
// @description  为动态页面增加显示哔哩哔哩番剧出差动态功能
// @author       溶酶菌
// @match        *://t.bilibili.com
// @match        *://t.bilibili.com/?*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/429205/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%95%AA%E5%89%A7%E5%87%BA%E5%B7%AE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/429205/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%95%AA%E5%89%A7%E5%87%BA%E5%B7%AE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
  'use strict';
  let loaded = false // 是否已加载
  function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23];
    var uuid = s.join("");
    return uuid;
  }
  let searchParams = {
    ps: 12,
    pn: 1,
    keyword: ''
  }
  let showBtn = () => document.querySelector('#show-abroad')
  let hideBtn = () => document.querySelector('#hide-abroad')
  let refreshBtn = () => document.querySelector('#refresh-abroad')
  let backtop = () => {
    let btbtn = document.querySelector(".bili-backtop") || document.querySelector(".back-top")
    btbtn && btbtn.click()
  }
  let centerPanel = () => document.querySelector("#app > div.bili-dyn-home--member > main")
  let cardList = () => document.querySelectorAll("#app > div.bili-dyn-home--member > main > section")
  let left = () => document.querySelector("#app > div.bili-dyn-home--member > aside.left")
  let dynamicsPanel = () => document.querySelector('#dynamics-panel')
  let keywordInput = () => document.querySelector('.space_input')
  let cubeList = () => document.querySelector('.cube-list')
  let bePager = () => document.querySelector('.be-pager')
  let dateFormat = (fmt, date) => {
    let ret;
    const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
    };
    return fmt;
  }
  let s2t = (text) => { // 简体转繁体
    let zh_s = '锕皑蔼碍爱嗳嫒瑷暧霭谙铵鹌肮袄奥媪骜鳌坝罢钯摆败呗颁办绊钣帮绑镑谤剥饱宝报鲍鸨龅辈贝钡狈备惫鹎贲锛绷笔毕毙币闭荜哔滗铋筚跸边编贬变辩辫苄缏笾标骠飑飙镖镳鳔鳖别瘪濒滨宾摈傧缤槟殡膑镔髌鬓饼禀拨钵铂驳饽钹鹁补钸财参蚕残惭惨灿骖黪苍舱仓沧厕侧册测恻层诧锸侪钗搀掺蝉馋谗缠铲产阐颤冁谄谶蒇忏婵骣觇禅镡场尝长偿肠厂畅伥苌怅阊鲳钞车彻砗尘陈衬伧谌榇碜龀撑称惩诚骋枨柽铖铛痴迟驰耻齿炽饬鸱冲冲虫宠铳畴踌筹绸俦帱雠橱厨锄雏础储触处刍绌蹰传钏疮闯创怆锤缍纯鹑绰辍龊辞词赐鹚聪葱囱从丛苁骢枞凑辏蹿窜撺错锉鹾达哒鞑带贷骀绐担单郸掸胆惮诞弹殚赕瘅箪当挡党荡档谠砀裆捣岛祷导盗焘灯邓镫敌涤递缔籴诋谛绨觌镝颠点垫电巅钿癫钓调铫鲷谍叠鲽钉顶锭订铤丢铥东动栋冻岽鸫窦犊独读赌镀渎椟牍笃黩锻断缎簖兑队对怼镦吨顿钝炖趸夺堕铎鹅额讹恶饿谔垩阏轭锇锷鹗颚颛鳄诶儿尔饵贰迩铒鸸鲕发罚阀珐矾钒烦贩饭访纺钫鲂飞诽废费绯镄鲱纷坟奋愤粪偾丰枫锋风疯冯缝讽凤沣肤辐抚辅赋复负讣妇缚凫驸绂绋赙麸鲋鳆钆该钙盖赅杆赶秆赣尴擀绀冈刚钢纲岗戆镐睾诰缟锆搁鸽阁铬个纥镉颍给亘赓绠鲠龚宫巩贡钩沟苟构购够诟缑觏蛊顾诂毂钴锢鸪鹄鹘剐挂鸹掴关观馆惯贯诖掼鹳鳏广犷规归龟闺轨诡贵刽匦刿妫桧鲑鳜辊滚衮绲鲧锅国过埚呙帼椁蝈铪骇韩汉阚绗颉号灏颢阂鹤贺诃阖蛎横轰鸿红黉讧荭闳鲎壶护沪户浒鹕哗华画划话骅桦铧怀坏欢环还缓换唤痪焕涣奂缳锾鲩黄谎鳇挥辉毁贿秽会烩汇讳诲绘诙荟哕浍缋珲晖荤浑诨馄阍获货祸钬镬击机积饥迹讥鸡绩缉极辑级挤几蓟剂济计记际继纪讦诘荠叽哜骥玑觊齑矶羁虿跻霁鲚鲫夹荚颊贾钾价驾郏浃铗镓蛲歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧谏缣戋戬睑鹣笕鲣鞯将浆蒋桨奖讲酱绛缰胶浇骄娇搅铰矫侥脚饺缴绞轿较挢峤鹪鲛阶节洁结诫届疖颌鲒紧锦仅谨进晋烬尽劲荆茎卺荩馑缙赆觐鲸惊经颈静镜径痉竞净刭泾迳弪胫靓纠厩旧阄鸠鹫驹举据锯惧剧讵屦榉飓钜锔窭龃鹃绢锩镌隽觉决绝谲珏钧军骏皲开凯剀垲忾恺铠锴龛闶钪铐颗壳课骒缂轲钶锞颔垦恳龈铿抠库裤喾块侩郐哙脍宽狯髋矿旷况诓诳邝圹纩贶亏岿窥馈溃匮蒉愦聩篑阃锟鲲扩阔蛴蜡腊莱来赖崃徕涞濑赉睐铼癞籁蓝栏拦篮阑兰澜谰揽览懒缆烂滥岚榄斓镧褴琅阆锒捞劳涝唠崂铑铹痨乐鳓镭垒类泪诔缧篱狸离鲤礼丽厉励砾历沥隶俪郦坜苈莅蓠呖逦骊缡枥栎轹砺锂鹂疠粝跞雳鲡鳢俩联莲连镰怜涟帘敛脸链恋炼练蔹奁潋琏殓裢裣鲢粮凉两辆谅魉疗辽镣缭钌鹩猎临邻鳞凛赁蔺廪檩辚躏龄铃灵岭领绫棂蛏鲮馏刘浏骝绺镏鹨龙聋咙笼垄拢陇茏泷珑栊胧砻楼娄搂篓偻蒌喽嵝镂瘘耧蝼髅芦卢颅庐炉掳卤虏鲁赂禄录陆垆撸噜闾泸渌栌橹轳辂辘氇胪鸬鹭舻鲈峦挛孪滦乱脔娈栾鸾銮抡轮伦仑沦纶论囵萝罗逻锣箩骡骆络荦猡泺椤脶镙驴吕铝侣屡缕虑滤绿榈褛锊呒妈玛码蚂马骂吗唛嬷杩买麦卖迈脉劢瞒馒蛮满谩缦镘颡鳗猫锚铆贸麽没镁门闷们扪焖懑钔锰梦眯谜弥觅幂芈谧猕祢绵缅渑腼黾庙缈缪灭悯闽闵缗鸣铭谬谟蓦馍殁镆谋亩钼呐钠纳难挠脑恼闹铙讷馁内拟腻铌鲵撵辇鲶酿鸟茑袅聂啮镊镍陧蘖嗫颟蹑柠狞宁拧泞苎咛聍钮纽脓浓农侬哝驽钕诺傩疟欧鸥殴呕沤讴怄瓯盘蹒庞抛疱赔辔喷鹏纰罴铍骗谝骈飘缥频贫嫔苹凭评泼颇钋扑铺朴谱镤镨栖脐齐骑岂启气弃讫蕲骐绮桤碛颀颃鳍牵钎铅迁签谦钱钳潜浅谴堑佥荨悭骞缱椠钤枪呛墙蔷强抢嫱樯戗炝锖锵镪羟跄锹桥乔侨翘窍诮谯荞缲硗跷窃惬锲箧钦亲寝锓轻氢倾顷请庆揿鲭琼穷茕蛱巯赇虮鳅趋区躯驱龋诎岖阒觑鸲颧权劝诠绻辁铨却鹊确阕阙悫让饶扰绕荛娆桡热韧认纫饪轫荣绒嵘蝾缛铷颦软锐蚬闰润洒萨飒鳃赛伞毵糁丧骚扫缫涩啬铯穑杀刹纱铩鲨筛晒酾删闪陕赡缮讪姗骟钐鳝墒伤赏垧殇觞烧绍赊摄慑设厍滠畲绅审婶肾渗诜谂渖声绳胜师狮湿诗时蚀实识驶势适释饰视试谥埘莳弑轼贳铈鲥寿兽绶枢输书赎属术树竖数摅纾帅闩双谁税顺说硕烁铄丝饲厮驷缌锶鸶耸怂颂讼诵擞薮馊飕锼苏诉肃谡稣虽随绥岁谇孙损笋荪狲缩琐锁唢睃獭挞闼铊鳎台态钛鲐摊贪瘫滩坛谭谈叹昙钽锬顸汤烫傥饧铴镗涛绦讨韬铽腾誊锑题体屉缇鹈阗条粜龆鲦贴铁厅听烃铜统恸头钭秃图钍团抟颓蜕饨脱鸵驮驼椭箨鼍袜娲腽弯湾顽万纨绾网辋韦违围为潍维苇伟伪纬谓卫诿帏闱沩涠玮韪炜鲔温闻纹稳问阌瓮挝蜗涡窝卧莴龌呜钨乌诬无芜吴坞雾务误邬庑怃妩骛鹉鹜锡牺袭习铣戏细饩阋玺觋虾辖峡侠狭厦吓硖鲜纤贤衔闲显险现献县馅羡宪线苋莶藓岘猃娴鹇痫蚝籼跹厢镶乡详响项芗饷骧缃飨萧嚣销晓啸哓潇骁绡枭箫协挟携胁谐写泻谢亵撷绁缬锌衅兴陉荥凶汹锈绣馐鸺虚嘘须许叙绪续诩顼轩悬选癣绚谖铉镟学谑泶鳕勋询寻驯训讯逊埙浔鲟压鸦鸭哑亚讶垭娅桠氩阉烟盐严岩颜阎艳厌砚彦谚验厣赝俨兖谳恹闫酽魇餍鼹鸯杨扬疡阳痒养样炀瑶摇尧遥窑谣药轺鹞鳐爷页业叶靥谒邺晔烨医铱颐遗仪蚁艺亿忆义诣议谊译异绎诒呓峄饴怿驿缢轶贻钇镒镱瘗舣荫阴银饮隐铟瘾樱婴鹰应缨莹萤营荧蝇赢颖茔莺萦蓥撄嘤滢潆璎鹦瘿颏罂哟拥佣痈踊咏镛优忧邮铀犹诱莸铕鱿舆鱼渔娱与屿语狱誉预驭伛俣谀谕蓣嵛饫阈妪纡觎欤钰鹆鹬龉鸳渊辕园员圆缘远橼鸢鼋约跃钥粤悦阅钺郧匀陨运蕴酝晕韵郓芸恽愠纭韫殒氲杂灾载攒暂赞瓒趱錾赃脏驵凿枣责择则泽赜啧帻箦贼谮赠综缯轧铡闸栅诈斋债毡盏斩辗崭栈战绽谵张涨帐账胀赵诏钊蛰辙锗这谪辄鹧贞针侦诊镇阵浈缜桢轸赈祯鸩挣睁狰争帧症郑证诤峥钲铮筝织职执纸挚掷帜质滞骘栉栀轵轾贽鸷蛳絷踬踯觯钟终种肿众锺诌轴皱昼骤纣绉猪诸诛烛瞩嘱贮铸驻伫槠铢专砖转赚啭馔颞桩庄装妆壮状锥赘坠缀骓缒谆准着浊诼镯兹资渍谘缁辎赀眦锱龇鲻踪总纵偬邹诹驺鲰诅组镞钻缵躜鳟翱并卜沉丑淀迭斗范干皋硅柜后伙秸杰诀夸里凌么霉捻凄扦圣尸抬涂洼喂污锨咸蝎彝涌游吁御愿岳云灶扎札筑于志注凋讠谫郄勐凼坂垅垴埯埝苘荬荮莜莼菰藁揸吒吣咔咝咴噘噼嚯幞岙嵴彷徼犸狍馀馇馓馕愣憷懔丬溆滟溷漤潴澹甯纟绔绱珉枧桊桉槔橥轱轷赍肷胨飚煳煅熘愍淼砜磙眍钚钷铘铞锃锍锎锏锘锝锪锫锿镅镎镢镥镩镲稆鹋鹛鹱疬疴痖癯裥襁耢颥螨麴鲅鲆鲇鲞鲴鲺鲼鳊鳋鳘鳙鞒鞴齄';
    let zh_t = '錒皚藹礙愛噯嬡璦曖靄諳銨鵪骯襖奧媼驁鰲壩罷鈀擺敗唄頒辦絆鈑幫綁鎊謗剝飽寶報鮑鴇齙輩貝鋇狽備憊鵯賁錛繃筆畢斃幣閉蓽嗶潷鉍篳蹕邊編貶變辯辮芐緶籩標驃颮飆鏢鑣鰾鱉別癟瀕濱賓擯儐繽檳殯臏鑌髕鬢餅稟撥缽鉑駁餑鈸鵓補鈽財參蠶殘慚慘燦驂黲蒼艙倉滄廁側冊測惻層詫鍤儕釵攙摻蟬饞讒纏鏟產闡顫囅諂讖蕆懺嬋驏覘禪鐔場嘗長償腸廠暢倀萇悵閶鯧鈔車徹硨塵陳襯傖諶櫬磣齔撐稱懲誠騁棖檉鋮鐺癡遲馳恥齒熾飭鴟沖衝蟲寵銃疇躊籌綢儔幬讎櫥廚鋤雛礎儲觸處芻絀躕傳釧瘡闖創愴錘綞純鶉綽輟齪辭詞賜鶿聰蔥囪從叢蓯驄樅湊輳躥竄攛錯銼鹺達噠韃帶貸駘紿擔單鄲撣膽憚誕彈殫賧癉簞當擋黨蕩檔讜碭襠搗島禱導盜燾燈鄧鐙敵滌遞締糴詆諦綈覿鏑顛點墊電巔鈿癲釣調銚鯛諜疊鰈釘頂錠訂鋌丟銩東動棟凍崠鶇竇犢獨讀賭鍍瀆櫝牘篤黷鍛斷緞籪兌隊對懟鐓噸頓鈍燉躉奪墮鐸鵝額訛惡餓諤堊閼軛鋨鍔鶚顎顓鱷誒兒爾餌貳邇鉺鴯鮞發罰閥琺礬釩煩販飯訪紡鈁魴飛誹廢費緋鐨鯡紛墳奮憤糞僨豐楓鋒風瘋馮縫諷鳳灃膚輻撫輔賦復負訃婦縛鳧駙紱紼賻麩鮒鰒釓該鈣蓋賅桿趕稈贛尷搟紺岡剛鋼綱崗戇鎬睪誥縞鋯擱鴿閣鉻個紇鎘潁給亙賡綆鯁龔宮鞏貢鉤溝茍構購夠詬緱覯蠱顧詁轂鈷錮鴣鵠鶻剮掛鴰摑關觀館慣貫詿摜鸛鰥廣獷規歸龜閨軌詭貴劊匭劌媯檜鮭鱖輥滾袞緄鯀鍋國過堝咼幗槨蟈鉿駭韓漢闞絎頡號灝顥閡鶴賀訶闔蠣橫轟鴻紅黌訌葒閎鱟壺護滬戶滸鶘嘩華畫劃話驊樺鏵懷壞歡環還緩換喚瘓煥渙奐繯鍰鯇黃謊鰉揮輝毀賄穢會燴匯諱誨繪詼薈噦澮繢琿暉葷渾諢餛閽獲貨禍鈥鑊擊機積饑跡譏雞績緝極輯級擠幾薊劑濟計記際繼紀訐詰薺嘰嚌驥璣覬齏磯羈蠆躋霽鱭鯽夾莢頰賈鉀價駕郟浹鋏鎵蟯殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗諫縑戔戩瞼鶼筧鰹韉將漿蔣槳獎講醬絳韁膠澆驕嬌攪鉸矯僥腳餃繳絞轎較撟嶠鷦鮫階節潔結誡屆癤頜鮚緊錦僅謹進晉燼盡勁荊莖巹藎饉縉贐覲鯨驚經頸靜鏡徑痙競凈剄涇逕弳脛靚糾廄舊鬮鳩鷲駒舉據鋸懼劇詎屨櫸颶鉅鋦窶齟鵑絹錈鐫雋覺決絕譎玨鈞軍駿皸開凱剴塏愾愷鎧鍇龕閌鈧銬顆殼課騍緙軻鈳錁頷墾懇齦鏗摳庫褲嚳塊儈鄶噲膾寬獪髖礦曠況誆誑鄺壙纊貺虧巋窺饋潰匱蕢憒聵簣閫錕鯤擴闊蠐蠟臘萊來賴崍徠淶瀨賚睞錸癩籟藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫嵐欖斕鑭襤瑯閬鋃撈勞澇嘮嶗銠鐒癆樂鰳鐳壘類淚誄縲籬貍離鯉禮麗厲勵礫歷瀝隸儷酈壢藶蒞蘺嚦邐驪縭櫪櫟轢礪鋰鸝癘糲躒靂鱺鱧倆聯蓮連鐮憐漣簾斂臉鏈戀煉練蘞奩瀲璉殮褳襝鰱糧涼兩輛諒魎療遼鐐繚釕鷯獵臨鄰鱗凜賃藺廩檁轔躪齡鈴靈嶺領綾欞蟶鯪餾劉瀏騮綹鎦鷚龍聾嚨籠壟攏隴蘢瀧瓏櫳朧礱樓婁摟簍僂蔞嘍嶁鏤瘺耬螻髏蘆盧顱廬爐擄鹵虜魯賂祿錄陸壚擼嚕閭瀘淥櫨櫓轤輅轆氌臚鸕鷺艫鱸巒攣孿灤亂臠孌欒鸞鑾掄輪倫侖淪綸論圇蘿羅邏鑼籮騾駱絡犖玀濼欏腡鏍驢呂鋁侶屢縷慮濾綠櫚褸鋝嘸媽瑪碼螞馬罵嗎嘜嬤榪買麥賣邁脈勱瞞饅蠻滿謾縵鏝顙鰻貓錨鉚貿麼沒鎂門悶們捫燜懣鍆錳夢瞇謎彌覓冪羋謐獼禰綿緬澠靦黽廟緲繆滅憫閩閔緡鳴銘謬謨驀饃歿鏌謀畝鉬吶鈉納難撓腦惱鬧鐃訥餒內擬膩鈮鯢攆輦鯰釀鳥蔦裊聶嚙鑷鎳隉蘗囁顢躡檸獰寧擰濘苧嚀聹鈕紐膿濃農儂噥駑釹諾儺瘧歐鷗毆嘔漚謳慪甌盤蹣龐拋皰賠轡噴鵬紕羆鈹騙諞駢飄縹頻貧嬪蘋憑評潑頗釙撲鋪樸譜鏷鐠棲臍齊騎豈啟氣棄訖蘄騏綺榿磧頎頏鰭牽釬鉛遷簽謙錢鉗潛淺譴塹僉蕁慳騫繾槧鈐槍嗆墻薔強搶嬙檣戧熗錆鏘鏹羥蹌鍬橋喬僑翹竅誚譙蕎繰磽蹺竊愜鍥篋欽親寢鋟輕氫傾頃請慶撳鯖瓊窮煢蛺巰賕蟣鰍趨區軀驅齲詘嶇闃覷鴝顴權勸詮綣輇銓卻鵲確闋闕愨讓饒擾繞蕘嬈橈熱韌認紉飪軔榮絨嶸蠑縟銣顰軟銳蜆閏潤灑薩颯鰓賽傘毿糝喪騷掃繅澀嗇銫穡殺剎紗鎩鯊篩曬釃刪閃陜贍繕訕姍騸釤鱔墑傷賞坰殤觴燒紹賒攝懾設厙灄畬紳審嬸腎滲詵諗瀋聲繩勝師獅濕詩時蝕實識駛勢適釋飾視試謚塒蒔弒軾貰鈰鰣壽獸綬樞輸書贖屬術樹豎數攄紓帥閂雙誰稅順說碩爍鑠絲飼廝駟緦鍶鷥聳慫頌訟誦擻藪餿颼鎪蘇訴肅謖穌雖隨綏歲誶孫損筍蓀猻縮瑣鎖嗩脧獺撻闥鉈鰨臺態鈦鮐攤貪癱灘壇譚談嘆曇鉭錟頇湯燙儻餳鐋鏜濤絳討韜鋱騰謄銻題體屜緹鵜闐條糶齠鰷貼鐵廳聽烴銅統慟頭鈄禿圖釷團摶頹蛻飩脫鴕馱駝橢籜鼉襪媧膃彎灣頑萬紈綰網輞韋違圍為濰維葦偉偽緯謂衛諉幃闈溈潿瑋韙煒鮪溫聞紋穩問閿甕撾蝸渦窩臥萵齷嗚鎢烏誣無蕪吳塢霧務誤鄔廡憮嫵騖鵡鶩錫犧襲習銑戲細餼鬩璽覡蝦轄峽俠狹廈嚇硤鮮纖賢銜閑顯險現獻縣餡羨憲線莧薟蘚峴獫嫻鷴癇蠔秈躚廂鑲鄉詳響項薌餉驤緗饗蕭囂銷曉嘯嘵瀟驍綃梟簫協挾攜脅諧寫瀉謝褻擷紲纈鋅釁興陘滎兇洶銹繡饈鵂虛噓須許敘緒續詡頊軒懸選癬絢諼鉉鏇學謔澩鱈勛詢尋馴訓訊遜塤潯鱘壓鴉鴨啞亞訝埡婭椏氬閹煙鹽嚴巖顏閻艷厭硯彥諺驗厴贗儼兗讞懨閆釅魘饜鼴鴦楊揚瘍陽癢養樣煬瑤搖堯遙窯謠藥軺鷂鰩爺頁業葉靨謁鄴曄燁醫銥頤遺儀蟻藝億憶義詣議誼譯異繹詒囈嶧飴懌驛縊軼貽釔鎰鐿瘞艤蔭陰銀飲隱銦癮櫻嬰鷹應纓瑩螢營熒蠅贏穎塋鶯縈鎣攖嚶瀅瀠瓔鸚癭頦罌喲擁傭癰踴詠鏞優憂郵鈾猶誘蕕銪魷輿魚漁娛與嶼語獄譽預馭傴俁諛諭蕷崳飫閾嫗紆覦歟鈺鵒鷸齬鴛淵轅園員圓緣遠櫞鳶黿約躍鑰粵悅閱鉞鄖勻隕運蘊醞暈韻鄆蕓惲慍紜韞殞氳雜災載攢暫贊瓚趲鏨贓臟駔鑿棗責擇則澤賾嘖幘簀賊譖贈綜繒軋鍘閘柵詐齋債氈盞斬輾嶄棧戰綻譫張漲帳賬脹趙詔釗蟄轍鍺這謫輒鷓貞針偵診鎮陣湞縝楨軫賑禎鴆掙睜猙爭幀癥鄭證諍崢鉦錚箏織職執紙摯擲幟質滯騭櫛梔軹輊贄鷙螄縶躓躑觶鐘終種腫眾鍾謅軸皺晝驟紂縐豬諸誅燭矚囑貯鑄駐佇櫧銖專磚轉賺囀饌顳樁莊裝妝壯狀錐贅墜綴騅縋諄準著濁諑鐲茲資漬諮緇輜貲眥錙齜鯔蹤總縱傯鄒諏騶鯫詛組鏃鉆纘躦鱒翺並蔔沈醜澱叠鬥範幹臯矽櫃後夥稭傑訣誇裏淩麽黴撚淒扡聖屍擡塗窪餵汙鍁鹹蠍彜湧遊籲禦願嶽雲竈紮劄築於誌註雕訁譾郤猛氹阪壟堖垵墊檾蕒葤蓧蒓菇槁摣咤唚哢噝噅撅劈謔襆嶴脊仿僥獁麅餘餷饊饢楞怵懍爿漵灩混濫瀦淡寧糸絝緔瑉梘棬案橰櫫軲軤賫膁腖飈糊煆溜湣渺碸滾瞘鈈鉕鋣銱鋥鋶鐦鐧鍩鍀鍃錇鎄鎇鎿鐝鑥鑹鑔穭鶓鶥鸌癧屙瘂臒襇繈耮顬蟎麯鮁鮃鮎鯗鯝鯴鱝鯿鰠鰵鱅鞽韝齇';
    if(!text) {
      return ''
    }
    let str =  ''
    for(let i = 0;i < text.length; i++){
          let index = zh_s.indexOf(text[i])
          str += index < 0 ? text[i] : zh_t.charAt(index);
      }
    return str;
  }
  let setLoading = (ld, msg = '正在加载...', actionDom) => {
    if (ld) {
      setLoading(false)
      let loadingPanel = document.createElement('div')
      loadingPanel.setAttribute('id', 'loading-panel')
      loadingPanel.classList.add('loading')
      loadingPanel.innerHTML = `<span>${msg}</span>`
      dynamicsPanel().append(loadingPanel)
      actionDom && loadingPanel.append(actionDom)
    } else {
      let pnl = document.querySelector('#loading-panel')
      pnl && pnl.remove()
    }
  }
  let loadData = function () {
    setLoading(true)
    let { ps, pn, keyword } = searchParams
    keyword = s2t(keyword) || ''
    // 旧 API https://api.bilibili.com/x/space/arc/search?mid=11783021&ps=${ps}&tid=0&pn=${pn}&keyword=${keyword}&order=pubdate&jsonp=jsonp
    fetch(`https://api.bilibili.com/x/space/wbi/arc/search?mid=11783021&ps=${ps}&tid=0&pn=${pn}&keyword=${keyword}&order=pubdate&platform=web&web_location=1550101&order_avoided=true&w_rid=${uuid()}&wts=${Math.floor(Date.now() / 1000)}`, {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.text())
      .then(res => {
        const reg = /\{.*}(?<data>\{.*\})/
        const match = res.match(reg)
        const data = !!match ? JSON.parse(match.groups.data) : JSON.parse(res)
        try {
          if (data.code !== 0) {
            switch(data.code) {
              case -403:
                throw new Error(`服务受限，建议使用港澳台地区代理后,访问<a style="color: #fb7299" href="https://space.bilibili.com/11783021/video" target="_blank">番剧出差主页</a>，或`)
              default:
                throw new Error(`请求错误，请重试（错误信息：${res}`)
            }
          }
          setLoading(false)
          cubeList()?.remove()
          bePager()?.remove()
          let { tlist, vlist } = data.data.list
          let { pn, count } = data.data.page
          let listDom = document.createElement('ul')
          listDom.classList.add('cube-list')
          if (!vlist.length) {
            return
          }
          vlist.forEach(item => {
            let timestamp = new Date(item.created * 1e3) // s -> ms
            let itemDom = document.createElement('li')
            itemDom.classList.add('small-item')
            itemDom.innerHTML = `<a href="//www.bilibili.com/video/${item.bvid}" target="_blank" class="cover">
                <img src="${item.pic}@380w_240h_100Q_1c.webp"
                    alt="${item.title}">
                <span class="length">${item.length}</span>
            </a>
            <a href="//www.bilibili.com/video/${item.bvid}" target="_blank" title="${item.title}"
                class="title">${item.title}</a>
            <div class="meta"><span class="play"><i class="icon"></i>${item.play}
                </span>
                <span class="time" title="${dateFormat('YYYY-mm-dd HH:MM:SS', timestamp)}">
                    <i class="icon"></i>${dateFormat('mm-dd HH:MM', timestamp)}
                </span>
            </div>`
            listDom.append(itemDom)
          })
          dynamicsPanel().append(listDom)
          dynamicsPanel().append(getPageBar(pn, count))
        } catch (error) {
          console.error(error)
          setLoading(false)
          const action = document.createElement('div')
          action.onclick = loadData
          action.style.cursor = 'pointer'
          action.style.color = '#fb7299'
          action.innerHTML = '点击重试'
          setLoading(true, error.message, action)
        }
      });
  }

  let getPageBar = (pn, count) => {
    let pageBarDom = document.createElement('ul')
    pageBarDom.classList.add('be-pager')

    let totalPage = Math.floor(count / searchParams.ps)
    let prePage = pn > 1 ? pn - 1 : undefined
    let nextPage = pn < totalPage ? pn + 1 : undefined
    let pageCurDom = document.createElement('li')
    let pageNextDom = document.createElement('li')
    let pageTotalDom = document.createElement('span')
    let pageElevatorDom = document.createElement('span')

    let firstPageDom = document.createElement('li')
    firstPageDom.classList.add('be-pager-prev')
    firstPageDom.innerHTML = `<a>首页</a>`
    firstPageDom.onclick = () => {
      searchParams.pn = 1
      loadData()
    }
    pageBarDom.append(firstPageDom)

    if (pn > 1) {
      let pagePrev = document.createElement('li')
      pagePrev.classList.add('be-pager-item')
      pagePrev.innerHTML = `<a>${prePage}</a>`
      pagePrev.onclick = () => {
        if (prePage) {
        searchParams.pn = prePage
        loadData(prePage)
        }
      }
      pageBarDom.append(pagePrev)
    }

    pageCurDom.classList.add('be-pager-item')
    pageCurDom.classList.add('be-pager-item-active')
    pageCurDom.innerHTML = `<a>${pn}</a>`
    pageBarDom.append(pageCurDom)

    if (pn < totalPage) {
      pageNextDom.classList.add('be-pager-item')
      pageNextDom.innerHTML = `<a>${nextPage}</a>`
      pageNextDom.onclick = () => {
        if (nextPage) {
        searchParams.pn = nextPage
        loadData()
        }
      }
      pageBarDom.append(pageNextDom)
    }

    let lastPageDom = document.createElement('li')
    lastPageDom.classList.add('be-pager-next')
    lastPageDom.innerHTML = `<a>末页</a>`
    lastPageDom.onclick = () => {
      searchParams.pn = totalPage
      loadData()
    }
    pageBarDom.append(lastPageDom)

    pageTotalDom.classList.add('be-pager-total')
    pageTotalDom.innerHTML = ` 共 ${totalPage} 页，</span>`
    pageBarDom.append(pageTotalDom)

    pageElevatorDom.classList.add('be-pager-options-elevator')

    let span = document.createElement('span')
    span.innerText = '跳转至'
    pageElevatorDom.append(span)
    let spaceInput = document.createElement('input')
    spaceInput.classList.add('space_input')
    spaceInput.setAttribute('type', 'num')
    spaceInput.onkeydown = function (event) {
      if (event.key === 'Enter') {
        let value = Number(spaceInput.value)
        if (!isNaN(value)) {
          if (value > totalPage) {
            spaceInput.value = totalPage
            value = totalPage
          }
          searchParams.pn = value
          loadData()
        }
      }
    }
    pageElevatorDom.append(spaceInput)
    span = document.createElement('span')
    span.innerText = '页'
    pageElevatorDom.append(span)
    pageBarDom.append(pageElevatorDom)
    return pageBarDom
  }

  let start = () => {
    if (!centerPanel()) {
      return
    }
    let panel = document.createElement('div')
    panel.id = 'dynamics-panel'
    panel.style.display = 'none'
    panel.style.backgroundColor = '#FFF'
    centerPanel().append(panel)

    const listHeader = document.createElement('div')
    listHeader.classList.add('list-header')
    listHeader.innerHTML = `<div class="g-search search-container"><input type="text" placeholder="搜索视频" class="space_input"><span class="icon search-btn"></span></div>`
    panel.append(listHeader)
    panel.querySelector('.search-btn').onclick = () => {
      // console.log(keywordInput().value)
      searchParams.keyword = keywordInput().value
      searchParams.pn = 1
      loadData()
    }
    panel.querySelector('.space_input').onchange = (e) => {
      searchParams.keyword = e.value
    }
    panel.querySelector('.space_input').onkeydown = (e) => {
      if (e.key === 'Enter') {
        searchParams.pn = 1
        searchParams.keyword = e.target.value
        loadData()
      }
    }

    let actionbar = document.createElement('div')
    actionbar.innerHTML =
      `<div style="margin-top: 8px;border-radius: 4px;position: sticky;top: 8px;background: #FFF;padding: 16px;display: flex;">
        <a title="个人空间（需要代理）" href="https://space.bilibili.com/11783021/video" target="_blank" class="avatar" style="box-shadow: 0 0 0 1px #f25d8e;border-radius: 22px;height: 38px;width:38px;background-size: 38px 38px;background-image: url(&quot;https://i0.hdslb.com/bfs/face/9f10323503739e676857f06f5e4f5eb323e9f3f2.jpg@96w_96h_100Q_1c.webp&quot;);"></a>
        <div style="margin-left: 11px;">
          <div style="font-size: 14px" title="个人空间（需要代理）"><a href="https://space.bilibili.com/11783021/video" target="_blank">哔哩哔哩番剧出差</a></div>
          <div style="margin-top: 4px;font-size: 12px;color: #00b5e5">
            <span id="show-abroad" style="cursor: pointer;">显示</span>
            <span id="hide-abroad" style="cursor: pointer;display: none">隐藏</span>
            <span id="refresh-abroad" style="cursor: pointer;display: none;margin-left: 1em">刷新</span>
            <a style="cursor: pointer;margin-left: 1em" href="https://space.bilibili.com/11783021/video" target="_blank" title="个人空间(港澳台代理)">主页(港澳台代理)</a>
          </div>
        </div>
    </div>`

    // let sticky = left().querySelector('.sticky')
    // if(!sticky) {
    //   sticky = document.createElement('section')
    //   sticky.classList.add("sticky")
    //   left().append(sticky)
    // }
    // sticky.append(actionbar)
    left().querySelector("section").append(actionbar)

    let toggleMode = (show = true) => {
      showBtn().style.display = show ? 'none' : 'inline'
      hideBtn().style.display = show ? 'inline' : 'none'
      refreshBtn().style.display = show ? 'inline' : 'none'
      cardList().forEach(item => {
        item.style.display = show ? 'none' : 'block'
      })
      dynamicsPanel().style.display = show ? 'block' : 'none'
      backtop()
    }

    showBtn().onclick = () => {
      toggleMode(true)
      if (!loaded) {
        loadData()
        loaded = true
      }
    }
    hideBtn().onclick = () => {
      toggleMode(false)
    }
    refreshBtn().onclick = () => {
      loadData()
      backtop()
    }

  }

  let sleep = function (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  // 延迟执行，否则可能找不到对应的DOM
  sleep(500).then(() => {
    console.log('哔哩哔哩番剧出差助手运行')
    start()
  })

  //========================================= css
  GM_addStyle(`#dynamics-panel{position:relative;padding:20px;min-height:270px;font-size:14px}#dynamics-panel .list-header{padding:0 10px 10px;display:flex;flex-direction:row-reverse}#dynamics-panel .list-header .g-search{position:relative;display:inline-block;width:134px;height:30px;vertical-align:middle}#dynamics-panel .list-header .g-search input{position:absolute;height:30px;width:134px;padding:0 29px 0 10px;line-height:30px;color:#222;font-size:12px;border:1px solid #ccd0d7;border-radius:15px;box-shadow:none;box-sizing:border-box;outline:none}#dynamics-panel .list-header .g-search .search-btn{position:absolute;right:8px;top:0;width:18px;height:30px;background-position:-1111px -81px;cursor:pointer}#dynamics-panel #loading-panel{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,.8);color:#00a1d6;text-align:center;display:flex;justify-content:center;align-items:center}#dynamics-panel .icon{vertical-align:middle;background-repeat:no-repeat;background-image:url(//s1.hdslb.com/bfs/static/jinkela/space/assets/icons.png)}#dynamics-panel a{color:inherit;text-decoration:none;transition:color .2s ease,background-color .2s ease}#dynamics-panel .i-watchlater{display:none;position:absolute;right:6px;bottom:4px;width:22px;height:22px;z-index:5;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABT0lEQVQ4je3VMYrCQBTG8b/DWASLNKJgJ1hY2sloZeF2gkeYW+wZvIVXsLBJY5UdtLJLk17EIghCwChukWRxFzSaaLdfMwm8/EgemTclgOl02gEmwAAoky8RsAA+tdbrUoJ+AVZO8G9CoCeJ39Sq1+sopbBtO5e23+8xxrDdbi1gIog/vxAKYNs2Sqn0diBIenoP9X2fIAgyccv66WZZZBXvdjtc18UYkwlfJxM+n8+/1pfBefMPPw4LEZcEQcBqteJ0Or0GrlartFotLpcLnucxm83YbDbFYSEE/X6f4XBIpVLhcDjgOA6u63I8HvPDaRqNBuPxmHa7DcS7cT6f36yXj8IAUkq63S7NZpPlcomUtx9/Ck5Tq9UYjUZ3a976u0UQz9OiCcMwvYwk8XHyYYxBKXU9+p5Grybg4m1Hk9Bar4Ee4JC0JWeixOhprdffE/1yRW/TLMYAAAAASUVORK5CYII=) no-repeat}#dynamics-panel .be-tags-container{position:absolute;top:4px;right:4px}#dynamics-panel .be-tags-container .tag.new-tag{background-color:#42a0c4}#dynamics-panel .be-tags-container .tag{display:inline-block;padding:0 4px;font-size:10px;color:#fff;text-align:center;line-height:14px;border-radius:2px;margin-left:4px}#dynamics-panel .cube-list{display:flex;font-size:12px;flex-wrap:wrap;justify-content:space-between;width:100%;box-sizing:border-box;padding:0}#dynamics-panel .cube-list .clearfix{display:block}#dynamics-panel .cube-list .small-item{display:inline-block;width:200px;position:relative;margin:0 0 3px;padding:10px;cursor:pointer}#dynamics-panel .cube-list .small-item .length{background:#111;background:rgba(0,0,0,.5);border-radius:5px 0 0 0;color:#fff;line-height:20px;transition:top .2s ease;padding:0 6px;position:absolute;right:0;bottom:0}#dynamics-panel .cube-list .small-item .cover{background:url(//s1.hdslb.com/bfs/static/jinkela/space/assets/video-placeholder.png) 50%;background-size:cover;border-radius:4px;display:block;width:200px;height:125px;overflow:hidden;position:relative}#dynamics-panel .cube-list .small-item img{border-radius:4px;display:block;width:200px;height:125px}#dynamics-panel .cube-list .small-item .title{display:block;line-height:20px;height:38px;margin-top:6px;overflow:hidden}#dynamics-panel .cube-list .small-item .meta{color:#999;white-space:nowrap;font-size:0;margin-top:6px;height:14px;line-height:14px;display:flex;justify-content:space-between}#dynamics-panel .cube-list .small-item .meta>span{display:inline-block;white-space:nowrap;height:14px;line-height:14px;font-size:12px;overflow:hidden}#dynamics-panel .cube-list .small-item .meta>span .icon{width:16px;height:14px;vertical-align:sub}#dynamics-panel .cube-list .small-item .play .icon{background-position:-280px -25px;display:inline-block}#dynamics-panel .cube-list .small-item .time .icon{background-position:-280px -474px;display:inline-block}#dynamics-panel .cube-list a:hover{color:#00a1d6}#dynamics-panel .cube-list a,#dynamics-panel .cube-list abbr,#dynamics-panel .cube-list acronym,#dynamics-panel .cube-list address,#dynamics-panel .cube-list applet,#dynamics-panel .cube-list article,#dynamics-panel .cube-list aside,#dynamics-panel .cube-list audio,#dynamics-panel .cube-list b,#dynamics-panel .cube-list big,#dynamics-panel .cube-list blockquote,#dynamics-panel .cube-list body,#dynamics-panel .cube-list canvas,#dynamics-panel .cube-list caption,#dynamics-panel .cube-list center,#dynamics-panel .cube-list cite,#dynamics-panel .cube-list code,#dynamics-panel .cube-list dd,#dynamics-panel .cube-list del,#dynamics-panel .cube-list details,#dynamics-panel .cube-list dfn,#dynamics-panel .cube-list div,#dynamics-panel .cube-list dl,#dynamics-panel .cube-list dt,#dynamics-panel .cube-list em,#dynamics-panel .cube-list embed,#dynamics-panel .cube-list fieldset,#dynamics-panel .cube-list figcaption,#dynamics-panel .cube-list figure,#dynamics-panel .cube-list footer,#dynamics-panel .cube-list form,#dynamics-panel .cube-list h1,#dynamics-panel .cube-list h2,#dynamics-panel .cube-list h3,#dynamics-panel .cube-list h4,#dynamics-panel .cube-list h5,#dynamics-panel .cube-list h6,#dynamics-panel .cube-list header,#dynamics-panel .cube-list hgroup,#dynamics-panel .cube-list html,#dynamics-panel .cube-list i,#dynamics-panel .cube-list iframe,#dynamics-panel .cube-list img,#dynamics-panel .cube-list ins,#dynamics-panel .cube-list kbd,#dynamics-panel .cube-list label,#dynamics-panel .cube-list legend,#dynamics-panel .cube-list li,#dynamics-panel .cube-list mark,#dynamics-panel .cube-list menu,#dynamics-panel .cube-list nav,#dynamics-panel .cube-list object,#dynamics-panel .cube-list ol,#dynamics-panel .cube-list output,#dynamics-panel .cube-list p,#dynamics-panel .cube-list pre,#dynamics-panel .cube-list q,#dynamics-panel .cube-list ruby,#dynamics-panel .cube-list s,#dynamics-panel .cube-list samp,#dynamics-panel .cube-list section,#dynamics-panel .cube-list small,#dynamics-panel .cube-list span,#dynamics-panel .cube-list strike,#dynamics-panel .cube-list strong,#dynamics-panel .cube-list sub,#dynamics-panel .cube-list summary,#dynamics-panel .cube-list sup,#dynamics-panel .cube-list table,#dynamics-panel .cube-list tbody,#dynamics-panel .cube-list td,#dynamics-panel .cube-list tfoot,#dynamics-panel .cube-list th,#dynamics-panel .cube-list thead,#dynamics-panel .cube-list time,#dynamics-panel .cube-list tr,#dynamics-panel .cube-list tt,#dynamics-panel .cube-list u,#dynamics-panel .cube-list ul,#dynamics-panel .cube-list var,#dynamics-panel .cube-list video{margin:0;padding:0;border:0;vertical-align:baseline;word-break:break-word}#dynamics-panel .be-pager{-webkit-user-select:none;-moz-user-select:none;user-select:none;padding:15px 0;text-align:center}#dynamics-panel .be-pager-disabled{display:none}#dynamics-panel .be-pager-next,#dynamics-panel .be-pager-prev{padding:0 14px;border:1px solid #d7dde4;border-radius:4px;background-color:#fff}#dynamics-panel .be-pager-item{display:inline-block;line-height:38px;padding:0 15px;margin-right:4px;text-align:center;list-style:none;background-color:#fff;-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:pointer;font-family:Arial;font-size:14px;border:1px solid #d7dde4;border-radius:4px;transition:all .2s ease-in-out}#dynamics-panel .be-pager-item-jump-next,#dynamics-panel .be-pager-item-jump-prev,#dynamics-panel .be-pager-next,#dynamics-panel .be-pager-prev{display:inline-block;font-size:14px;line-height:38px;list-style:none;text-align:center;cursor:pointer;color:#666;font-family:Arial;transition:all .2s ease-in-out}#dynamics-panel .be-pager-next,#dynamics-panel .be-pager-prev{padding:0 14px;border:1px solid #d7dde4;border-radius:4px;background-color:#fff}#dynamics-panel .be-pager-prev{margin-right:8px}#dynamics-panel .be-pager-item a{text-decoration:none;color:#657180}#dynamics-panel .be-pager-item-active{background-color:#00a1d6;border-color:#00a1d6}#dynamics-panel .be-pager-item-active:hover a,#dynamics-panel .be-pager-item-active a{color:#fff}#dynamics-panel .be-pager-item-active:hover a,#dynamics-panel .be-pager-item-active a{color:#fff}#dynamics-panel .be-pager-total{display:inline-block;height:32px;line-height:32px;margin-left:30px;color:#99a2aa}#dynamics-panel .be-pager-options-elevator{display:inline-block;height:32px;line-height:32px;color:#99a2aa}#dynamics-panel .be-pager-options-elevator input{border-radius:4px;margin:0 8px;width:50px;outline:none}#dynamics-panel .space_input{line-height:28px;height:28px;padding:0 10px;transition:all .3s ease;vertical-align:top;border:1px solid #ccd0d7;border-radius:0}`)
})();