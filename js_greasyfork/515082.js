// ==UserScript==
// @name         KomgaPatcher (fixed by AI)
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Komga comic server metadata patcher
// @author       You
// @include      replace_to_your_url
// @icon         https://komga.org/img/logo.svg
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515082/KomgaPatcher%20%28fixed%20by%20AI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515082/KomgaPatcher%20%28fixed%20by%20AI%29.meta.js
// ==/UserScript==

//✔ 01.Loop page -> All Div nodes [Komga, Get]
//✔ 02.Div nodes -> plus two buttons : -> { sync All, sync info } [Komga, Dom]
//✔ 03.Div node -> Book id [Komga, Get]
//✔ 04.Book id -> { bookInfo, bookList } [Komga, Get]
//✔ 05.Book info -> Book name [Komga, Re/Manual✔]
//✔ 06.Book name -> Search Book List -> First Book [Pressx, Get]
//✔ 07.First Book -> Info {Name, Author, Publisher, Status, Description, Tags, Language}, Covers [Pressx, Get]
//✔ 08.Covers -> Blob File
//✔ 09.Update Series Info [Komga, Patch]
//✔ 10.Update Series Cover [Komga, Post]
//✔ 11.Update Book Info {Name Author} [Komga, Patch]
//✔ 12.Update Book Cover [Komga, Post]

'use strict'
// 添加loading关键帧
$('head').append(`
  <style>
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
`)
const maxReqBooks = 500
const sourceLabels = ['bof', 'btv']
const btvUrl = 'https://bangumi.tv'
const bofUrl = 'https://bookof.moe'
const tagLabels =
  '架空,搞笑,热血,运动,恋爱,轻改,后宫,校园,少年,少女,英雄,青春,友情,治愈,邪道,战斗,魔法,科幻,冒险,推理,悬疑,侦探,竞技,体育,励志,职场,社会,史诗,历史,战争,机战,末世,意识流,宗教,神鬼,妹控,奇幻,异界,轮回,穿越,重生,恐怖,短篇,反转,萌系,百合,日常,旅行，异世界,偶像,转生,伦理,黑暗,亲情,家庭,暴力,复仇,血腥,兄妹,生命,哲学,废土,致郁,性转,兄控,颜艺,感动,地下城,篮球,足球,棒球,网球,排球,高尔夫,保龄球,滑板,滑雪,滑冰,射击,赛车,赛马,拳击,摔跤,格斗,武术,游泳,健身,骑行,登山,攀岩,射箭,钓鱼,烹饪,麻将,围棋,象棋,桥牌,扑克,美食,魔术,占卜,跳舞,唱歌,乐器,绘画,书法,摄影,雕塑,篆刻,陶艺,服装,舞蹈,戏剧,电影,成长,童年,反套路,犯罪,校园霸凌,校园欺凌,外星人,色气,自然主义,将棋,工口,武士,超能力,游戏,街机,梦想,怪物,冷战,社会主义,摇滚,音乐,环保,猎奇,民俗,幽默,僵尸,动物,农业,生活,心理,生存,短篇集,师生,卖肉,'
const publisherMappings = {
  '[bili]': {
    language: 'zh-hans',
    publisher: 'Bilibili',
  },
  '[Bilibili]': {
    language: 'zh-hans',
    publisher: 'Bilibili',
  },
  '[B漫]': {
    language: 'zh-hans',
    publisher: 'Bilibili',
  },
  '[东立]': {
    language: 'zh-hant',
    publisher: '东立',
  },
  '[东贩]': {
    language: 'zh-hant',
    publisher: '东贩',
  },
  '[台湾东贩]': {
    language: 'zh-hant',
    publisher: '东贩',
  },
  '[玉皇朝]': {
    language: 'zh-hant',
    publisher: '东贩',
  },
  '[天下]': {
    language: 'zh-hant',
    publisher: '天下',
  },
  '[青文]': {
    language: 'zh-hant',
    publisher: '青文',
  },
  '[尖端]': {
    language: 'zh-hant',
    publisher: '尖端',
  },
}
const equalLabels = ['治愈,治癒', '校园欺凌,校园霸凌', '轻改,轻小说改', '工口,色气,卖肉']
const defaultHeaders = {
  'content-type': 'application/json;charset=UTF-8',
}
const btnStyle = {
  position: 'absolute',
  bottom: '10px',
  'border-radius': '50%',
  'background-color': 'orange',
  border: 'none',
  color: '#efefef',
  'font-size': '14px',
  'font-weight': 'bold',
  'z-index': '10',
  opacity: '0',
  'pointer-events': 'none', // 禁止按钮接收鼠标事件
  transition: 'opacity 0.2s ease-in-out',
}
const maskStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  'background-color': 'white',
  opacity: 0.9,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
}
const selPanelStyle = {
  // 居中显示，大小为400px x 400px
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  height: '566px',
  // 背景色为麦色，边框为1px的灰色实线
  backgroundColor: '#f5f5dc',
  border: '1px solid #ccc',
  // 阴影效果
  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  // 格栅显示，每个格栅居中，一行最多显示三个按钮，多了就换行
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  alignItems: 'center',
  justifyContent: 'center',
  // 显示在屏幕上方
  zIndex: '100',
}
const selPanelBtnStyle = {
  // 按钮样式
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'auto',
  height: '160px',
  margin: '10px',
  textAlign: 'center',
  backgroundColor: '#4CAF50',
  color: 'white',
  borderRadius: '10px',
  padding: '4px 8px',
  border: 'none',
  overflow: 'hidden',
}
const $msgBoxes = $('<div>').attr('id', 'msg-boxes').css({
  // 子元素上下排列，水平居中，间距为 10px
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '10px',
  // 消息框队列居于页面右上角
  position: 'fixed',
  top: '40px',
  right: 0,
  width: '500px',
  height: 'auto',
  'z-index': '100',
})

// ************************************** 工具相关 **************************************
//<editor-fold desc="工具相关">
// 简繁转换
function s2t(cc) {
  let str = '',
    ss = jtpy(),
    tt = ftpy()
  for (let i = 0; i < cc.length; i++) {
    let c = cc.charAt(i)
    if (c.charCodeAt(0) > 10000 && ss.indexOf(c) !== -1) str += tt.charAt(ss.indexOf(c))
    else str += c
  }
  return str
}
function t2s(cc) {
  let str = '',
    ss = jtpy(),
    tt = ftpy()
  for (let i = 0; i < cc.length; i++) {
    let c = cc.charAt(i)
    if (c.charCodeAt(0) > 10000 && tt.indexOf(c) !== -1) str += ss.charAt(tt.indexOf(c))
    else str += c
  }
  return str
}
function jtpy() {
  return '皑蔼碍爱翱袄奥坝罢摆败颁办绊帮绑镑谤剥饱宝报鲍辈贝钡狈备惫绷笔毕毙闭边编贬变辩辫鳖瘪濒滨宾摈饼拨钵铂驳卜补参蚕残惭惨灿苍舱仓沧厕侧册测层诧搀掺蝉馋谗缠铲产阐颤场尝长偿肠厂畅钞车彻尘陈衬撑称惩诚骋痴迟驰耻齿炽冲虫宠畴踌筹绸丑橱厨锄雏础储触处传疮闯创锤纯绰辞词赐聪葱囱从丛凑窜错达带贷担单郸掸胆惮诞弹当挡党荡档捣岛祷导盗灯邓敌涤递缔点垫电淀钓调迭谍叠钉顶锭订东动栋冻斗犊独读赌镀锻断缎兑队对吨顿钝夺鹅额讹恶饿儿尔饵贰发罚阀珐矾钒烦范贩饭访纺飞废费纷坟奋愤粪丰枫锋风疯冯缝讽凤肤辐抚辅赋复负讣妇缚该钙盖干赶秆赣冈刚钢纲岗皋镐搁鸽阁铬个给龚宫巩贡钩沟构购够蛊顾剐关观馆惯贯广规硅归龟闺轨诡柜贵刽辊滚锅国过骇韩汉阂鹤贺横轰鸿红后壶护沪户哗华画划话怀坏欢环还缓换唤痪焕涣黄谎挥辉毁贿秽会烩汇讳诲绘荤浑伙获货祸击机积饥讥鸡绩缉极辑级挤几蓟剂济计记际继纪夹荚颊贾钾价驾歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧浆蒋桨奖讲酱胶浇骄娇搅铰矫侥脚饺缴绞轿较秸阶节茎惊经颈静镜径痉竞净纠厩旧驹举据锯惧剧鹃绢杰洁结诫届紧锦仅谨进晋烬尽劲荆觉决诀绝钧军骏开凯颗壳课垦恳抠库裤夸块侩宽矿旷况亏岿窥馈溃扩阔蜡腊莱来赖蓝栏拦篮阑兰澜谰揽览懒缆烂滥捞劳涝乐镭垒类泪篱离里鲤礼丽厉励砾历沥隶俩联莲连镰怜涟帘敛脸链恋炼练粮凉两辆谅疗辽镣猎临邻鳞凛赁龄铃凌灵岭领馏刘龙聋咙笼垄拢陇楼娄搂篓芦卢颅庐炉掳卤虏鲁赂禄录陆驴吕铝侣屡缕虑滤绿峦挛孪滦乱抡轮伦仑沦纶论萝罗逻锣箩骡骆络妈玛码蚂马骂吗买麦卖迈脉瞒馒蛮满谩猫锚铆贸么霉没镁门闷们锰梦谜弥觅绵缅庙灭悯闽鸣铭谬谋亩钠纳难挠脑恼闹馁腻撵捻酿鸟聂啮镊镍柠狞宁拧泞钮纽脓浓农疟诺欧鸥殴呕沤盘庞国爱赔喷鹏骗飘频贫苹凭评泼颇扑铺朴谱脐齐骑岂启气弃讫牵扦钎铅迁签谦钱钳潜浅谴堑枪呛墙蔷强抢锹桥乔侨翘窍窃钦亲轻氢倾顷请庆琼穷趋区躯驱龋颧权劝却鹊让饶扰绕热韧认纫荣绒软锐闰润洒萨鳃赛伞丧骚扫涩杀纱筛晒闪陕赡缮伤赏烧绍赊摄慑设绅审婶肾渗声绳胜圣师狮湿诗尸时蚀实识驶势释饰视试寿兽枢输书赎属术树竖数帅双谁税顺说硕烁丝饲耸怂颂讼诵擞苏诉肃虽绥岁孙损笋缩琐锁獭挞抬摊贪瘫滩坛谭谈叹汤烫涛绦腾誊锑题体屉条贴铁厅听烃铜统头图涂团颓蜕脱鸵驮驼椭洼袜弯湾顽万网韦违围为潍维苇伟伪纬谓卫温闻纹稳问瓮挝蜗涡窝呜钨乌诬无芜吴坞雾务误锡牺袭习铣戏细虾辖峡侠狭厦锨鲜纤咸贤衔闲显险现献县馅羡宪线厢镶乡详响项萧销晓啸蝎协挟携胁谐写泻谢锌衅兴汹锈绣虚嘘须许绪续轩悬选癣绚学勋询寻驯训讯逊压鸦鸭哑亚讶阉烟盐严颜阎艳厌砚彦谚验鸯杨扬疡阳痒养样瑶摇尧遥窑谣药爷页业叶医铱颐遗仪彝蚁艺亿忆义诣议谊译异绎荫阴银饮樱婴鹰应缨莹萤营荧蝇颖哟拥佣痈踊咏涌优忧邮铀犹游诱舆鱼渔娱与屿语吁御狱誉预驭鸳渊辕园员圆缘远愿约跃钥岳粤悦阅云郧匀陨运蕴酝晕韵杂灾载攒暂赞赃脏凿枣灶责择则泽贼赠扎札轧铡闸诈斋债毡盏斩辗崭栈战绽张涨帐账胀赵蛰辙锗这贞针侦诊镇阵挣睁狰帧郑证织职执纸挚掷帜质钟终种肿众诌轴皱昼骤猪诸诛烛瞩嘱贮铸筑驻专砖转赚桩庄装妆壮状锥赘坠缀谆浊兹资渍踪综总纵邹诅组钻致钟么为只凶准启板里雳余链泄'
}
function ftpy() {
  return '皚藹礙愛翺襖奧壩罷擺敗頒辦絆幫綁鎊謗剝飽寶報鮑輩貝鋇狽備憊繃筆畢斃閉邊編貶變辯辮鼈癟瀕濱賓擯餅撥缽鉑駁蔔補參蠶殘慚慘燦蒼艙倉滄廁側冊測層詫攙摻蟬饞讒纏鏟産闡顫場嘗長償腸廠暢鈔車徹塵陳襯撐稱懲誠騁癡遲馳恥齒熾沖蟲寵疇躊籌綢醜櫥廚鋤雛礎儲觸處傳瘡闖創錘純綽辭詞賜聰蔥囪從叢湊竄錯達帶貸擔單鄲撣膽憚誕彈當擋黨蕩檔搗島禱導盜燈鄧敵滌遞締點墊電澱釣調叠諜疊釘頂錠訂東動棟凍鬥犢獨讀賭鍍鍛斷緞兌隊對噸頓鈍奪鵝額訛惡餓兒爾餌貳發罰閥琺礬釩煩範販飯訪紡飛廢費紛墳奮憤糞豐楓鋒風瘋馮縫諷鳳膚輻撫輔賦複負訃婦縛該鈣蓋幹趕稈贛岡剛鋼綱崗臯鎬擱鴿閣鉻個給龔宮鞏貢鈎溝構購夠蠱顧剮關觀館慣貫廣規矽歸龜閨軌詭櫃貴劊輥滾鍋國過駭韓漢閡鶴賀橫轟鴻紅後壺護滬戶嘩華畫劃話懷壞歡環還緩換喚瘓煥渙黃謊揮輝毀賄穢會燴彙諱誨繪葷渾夥獲貨禍擊機積饑譏雞績緝極輯級擠幾薊劑濟計記際繼紀夾莢頰賈鉀價駕殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗漿蔣槳獎講醬膠澆驕嬌攪鉸矯僥腳餃繳絞轎較稭階節莖驚經頸靜鏡徑痙競淨糾廄舊駒舉據鋸懼劇鵑絹傑潔結誡屆緊錦僅謹進晉燼盡勁荊覺決訣絕鈞軍駿開凱顆殼課墾懇摳庫褲誇塊儈寬礦曠況虧巋窺饋潰擴闊蠟臘萊來賴藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫撈勞澇樂鐳壘類淚籬離裏鯉禮麗厲勵礫曆瀝隸倆聯蓮連鐮憐漣簾斂臉鏈戀煉練糧涼兩輛諒療遼鐐獵臨鄰鱗凜賃齡鈴淩靈嶺領餾劉龍聾嚨籠壟攏隴樓婁摟簍蘆盧顱廬爐擄鹵虜魯賂祿錄陸驢呂鋁侶屢縷慮濾綠巒攣孿灤亂掄輪倫侖淪綸論蘿羅邏鑼籮騾駱絡媽瑪碼螞馬罵嗎買麥賣邁脈瞞饅蠻滿謾貓錨鉚貿麽黴沒鎂門悶們錳夢謎彌覓綿緬廟滅憫閩鳴銘謬謀畝鈉納難撓腦惱鬧餒膩攆撚釀鳥聶齧鑷鎳檸獰甯擰濘鈕紐膿濃農瘧諾歐鷗毆嘔漚盤龐國愛賠噴鵬騙飄頻貧蘋憑評潑頗撲鋪樸譜臍齊騎豈啓氣棄訖牽扡釺鉛遷簽謙錢鉗潛淺譴塹槍嗆牆薔強搶鍬橋喬僑翹竅竊欽親輕氫傾頃請慶瓊窮趨區軀驅齲顴權勸卻鵲讓饒擾繞熱韌認紉榮絨軟銳閏潤灑薩鰓賽傘喪騷掃澀殺紗篩曬閃陝贍繕傷賞燒紹賒攝懾設紳審嬸腎滲聲繩勝聖師獅濕詩屍時蝕實識駛勢釋飾視試壽獸樞輸書贖屬術樹豎數帥雙誰稅順說碩爍絲飼聳慫頌訟誦擻蘇訴肅雖綏歲孫損筍縮瑣鎖獺撻擡攤貪癱灘壇譚談歎湯燙濤縧騰謄銻題體屜條貼鐵廳聽烴銅統頭圖塗團頹蛻脫鴕馱駝橢窪襪彎灣頑萬網韋違圍爲濰維葦偉僞緯謂衛溫聞紋穩問甕撾蝸渦窩嗚鎢烏誣無蕪吳塢霧務誤錫犧襲習銑戲細蝦轄峽俠狹廈鍁鮮纖鹹賢銜閑顯險現獻縣餡羨憲線廂鑲鄉詳響項蕭銷曉嘯蠍協挾攜脅諧寫瀉謝鋅釁興洶鏽繡虛噓須許緒續軒懸選癬絢學勳詢尋馴訓訊遜壓鴉鴨啞亞訝閹煙鹽嚴顔閻豔厭硯彥諺驗鴦楊揚瘍陽癢養樣瑤搖堯遙窯謠藥爺頁業葉醫銥頤遺儀彜蟻藝億憶義詣議誼譯異繹蔭陰銀飲櫻嬰鷹應纓瑩螢營熒蠅穎喲擁傭癰踴詠湧優憂郵鈾猶遊誘輿魚漁娛與嶼語籲禦獄譽預馭鴛淵轅園員圓緣遠願約躍鑰嶽粵悅閱雲鄖勻隕運蘊醞暈韻雜災載攢暫贊贓髒鑿棗竈責擇則澤賊贈紮劄軋鍘閘詐齋債氈盞斬輾嶄棧戰綻張漲帳賬脹趙蟄轍鍺這貞針偵診鎮陣掙睜猙幀鄭證織職執紙摯擲幟質鍾終種腫衆謅軸皺晝驟豬諸誅燭矚囑貯鑄築駐專磚轉賺樁莊裝妝壯狀錐贅墜綴諄濁茲資漬蹤綜總縱鄒詛組鑽緻鐘麼為隻兇準啟闆裡靂餘鍊洩'
}

// 将字符串每个单词首字母大写
function capitalize(str) {
  return str.replace(/\b[a-z]/g, (char) => char.toUpperCase())
}

//</editor-fold>

// ************************************** Dom加载 **************************************
//<editor-fold desc="Dom加载">
// 局部Loading效果
function partLoadingStart($dom) {
  const $imageDiv = $dom.find('div.v-image').first()
  const loadingWidth = $imageDiv.width()
  const loadingHeight = $imageDiv.height()
  const diameter = Math.min(loadingWidth, loadingHeight) / 2
  const $loadMask = $('<div class="loadMask"></div>').css({
    ...maskStyle,
    width: loadingWidth,
    height: loadingHeight,
    opacity: 0.6,
  })
  const $loading = $('<div></div>').css({
    width: diameter,
    height: diameter,
    'border-radius': '50%',
    border: '5px solid #f3f3f3',
    'border-top': '5px solid #3498db',
    animation: 'spin 1s linear infinite',
  })
  $loadMask.append($loading)
  $dom.append($loadMask)
}
function partLoadingEnd($dom) {
  $dom.find('.loadMask').remove()
}
// 消息提示
function loadMessage() {
  let msgBoxesIntervalId = setInterval(function () {
    let $app = $('div#app')
    if ($app.length !== 0) {
      // 添加消息框队列
      $app.append($msgBoxes)
      clearInterval(msgBoxesIntervalId)
    }
  }, 200)
}
function showMessage(msgContent, msgType = 'success', duration = 5000) {
  // 根据msgType确定消息框的背景色和文字颜色，msgType选项有'success'、'warning'、'error'、'info'，默认为success
  let msgBgColor
  switch (msgType) {
    case 'success':
      msgBgColor = '#4CAF50'
      break
    case 'warning':
      msgBgColor = '#ff9800'
      break
    case 'error':
      msgBgColor = '#f44336'
      break
    case 'info':
      msgBgColor = '#2196F3'
      break
    default:
      msgBgColor = '#4CAF50'
      break
  }
  let $msgTxt = $('<span>').attr('class', 'message').css({
    // 文字居中
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'left',
    // 文字样式
    fontSize: '18px',
    // 文字颜色为成功提示背景色的反色
    color: '#3c3c3c',
    // 超出的文字显示为省略号
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  })
  $msgTxt.text(msgContent)
  let $msgBox = $('<div>').attr('class', 'message-box').append($msgTxt).css({
    height: '46px',
    width: '360px',
    right: '-10px',
    transform: 'translateX(100%)',
    backgroundColor: msgBgColor,
    border: '1px solid #ccc',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    padding: '10px',
    zIndex: '9999',
    transition: 'transform 0.5s ease-out',
    // 子元素上下居中，水平靠左
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  })
  // 将消息框元素添加到消息框队列中，后入的排在上面
  $msgBoxes.prepend($msgBox)
  // 为提示框元素添加 CSS 样式
  $msgBox.css({
    transform: 'translateX(-10%)',
  })
  setTimeout(() => {
    $msgBox.css({
      transform: 'translateX(100%)',
    })
    $msgBox.remove()
  }, duration)
}
// 加载搜索按钮
function loadSearchBtn($dom, komgaSeriesId) {
  const width = $dom.width()
  const btnDia = width / 5
  let $syncInfo = $('<button></button>').attr('komgaSeriesId', komgaSeriesId)
  let $syncAll = $('<button></button>').attr('komgaSeriesId', komgaSeriesId)
  btnStyle.width = btnDia
  btnStyle.height = btnDia
  $syncAll.css({ ...btnStyle, right: '10px' })
  $syncAll.append('<i aria-hidden="true" class="v-icon mdi mdi-face-recognition"></i>')
  $syncInfo.css({ ...btnStyle, right: btnDia + 20 + 'px' })
  $syncInfo.append('<i aria-hidden="true" class="v-icon mdi mdi-comment-bookmark-outline"></i>')
  $syncAll.on('mouseenter', function () {
    $syncAll.css('background-color', 'yellow')
    $syncAll.css('color', '#3c3c3c')
  })
  $syncAll.on('mouseleave', function () {
    $syncAll.css('background-color', 'orange')
    $syncAll.css('color', '#efefef')
  })
  $syncInfo.on('mouseenter', function () {
    $syncInfo.css('background-color', 'yellow')
    $syncInfo.css('color', '#3c3c3c')
  })
  $syncInfo.on('mouseleave', function () {
    $syncInfo.css('background-color', 'orange')
    $syncInfo.css('color', '#efefef')
  })
  // 只更新meta
  $syncInfo.on('click', async () => {
    await handleSearchClick(komgaSeriesId, 'meta', $dom)
  })
  // 更新meta + cover
  $syncAll.on('click', async () => {
    await handleSearchClick(komgaSeriesId, 'all', $dom)
  })

  $dom.append($syncAll)
  $dom.append($syncInfo)
  $dom.on('mouseenter', function () {
    $syncAll.css('opacity', '1')
    $syncInfo.css('opacity', '1')
    $syncAll.css('pointer-events', 'auto')
    $syncInfo.css('pointer-events', 'auto')
  })

  $dom.on('mouseleave', function () {
    $syncAll.css('opacity', '0')
    $syncInfo.css('opacity', '0')
    $syncAll.css('pointer-events', 'none')
    $syncInfo.css('pointer-events', 'none')
  })
}

async function selectSeriesTitle(komgaSeriesId, $dom) {
  const oriTitle = await getKomgaOriTitle(komgaSeriesId)
  let oriTitlesTemp = oriTitle.replace(/^\[|\]$/g, '') // 去掉开头和结尾的方括号
  let oriTitles = oriTitlesTemp.split(/\[|\]/).filter(Boolean) // 使用 filter() 方法过滤空字符串
  let komgaSeriesTitles = oriTitles.length >= 2 ? [oriTitles[0], oriTitles[1]] : [oriTitles[0]]
  let authorTitle = komgaSeriesTitles.shift().split('×')
  komgaSeriesTitles = [...authorTitle, ...komgaSeriesTitles]
  komgaSeriesTitles = komgaSeriesTitles.map((t) =>
    t2s(t.split(' ')[0].split('(')[0].split('（')[0].split('_')[0].split('~')[0].split('♂')[0].split('♀')[0].trim()),
  )
  // remove special characters, such as ":", "：", "!", "！"
  const selTitles = komgaSeriesTitles.map((t) => t.replace(/[:：!！]/g, ''))
  const $selTitlePanel = $('<div></div>').css({ ...selPanelStyle })
  selTitles.forEach((title) => {
    let $selTitleBtn = $('<button></button>').text(title).css(selPanelBtnStyle)
    $selTitleBtn.on('click', async function () {
      $selTitlePanel.remove()
      showMessage('正在查找《' + title + '》', 'info', 1000)
      const searchType = localStorage.getItem(`STY-${komgaSeriesId}`)
      let seriesListRes = await fetchBookByName(title, searchType)
      let seriesIdRes = 0
      if (seriesListRes.length > 0) {
        //如果大于8个，只取前8个
        if (seriesListRes.length > 8) seriesListRes = seriesListRes.slice(0, 8)
        // 添加最后一个书名为“取消”的按钮，作者为“”
        seriesListRes.push({ id: -1, title: '取消', author: '' })
        // create a temporary element to choose a book from seriesListRes
        // an element above screen has the count of seriesListRes choices button, with title and author
        const $selBookPanel = $('<div></div>').css({ ...selPanelStyle })
        //根据searchedBooks的长度，创建相应数量的按钮
        seriesListRes.forEach((series) => {
          const $selBookBtn = $('<button></button>')
            .append('<div>' + series.title + '</divs>')
            .append('<div>' + series.author + '</div>')
            .attr('resSeriesId', series.id)
            .css({ ...selPanelBtnStyle })
          if (series.cover) {
            $selBookBtn.css({
              'background-image': 'url(' + series.cover + ')',
              'background-size': 'cover',
              'background-position': 'center',
              'background-repeat': 'no-repeat',
              'text-shadow': '1px 1px 1px #000000',
              'font-weight': 'bold',
            })
          }
          $selBookBtn.on('click', function () {
            // 点击按钮后，将seriesId赋值给seriesId变量转换为数字，关闭临时元素
            seriesIdRes = parseInt($(this).attr('resSeriesId'))
            if (series.id !== -1) {
              partLoadingStart($dom)
            }
            $selBookPanel.remove()
          })
          $selBookPanel.append($selBookBtn)
        })

        $selBookPanel.appendTo('body')
      } else {
        seriesIdRes = -2
      }
      const bookSelIntervalId = setInterval(async function () {
        if (seriesIdRes === -1) {
          showMessage('检索《' + title + '》已取消', 'warning')
          clearInterval(bookSelIntervalId)
        } else if (seriesIdRes === -2) {
          showMessage('检索《' + title + '》未找到', 'error', 4000)
          clearInterval(bookSelIntervalId)
        } else if (seriesIdRes > 0) {
          clearInterval(bookSelIntervalId)
          await fetchBookByUrl(komgaSeriesId, seriesIdRes, '', searchType)
          partLoadingEnd($dom)
        }
      }, 500)
    })
    $selTitlePanel.append($selTitleBtn)
  })
  $selTitlePanel.appendTo('body')
}
//</editor-fold>

// ************************************** 事件处理 **************************************
//<editor-fold desc="事件处理">
async function handleSearchClick(komgaSeriesId, type, $dom) {
  localStorage.setItem(`SID-${komgaSeriesId}`, type)
  await search(komgaSeriesId, $dom)
}
//</editor-fold>

// ************************************** 数据处理 **************************************
//<editor-fold desc="数据处理">
async function filterSeriesMeta(komgaSeriesId, seriesMeta) {
  const komgaMeta = await getKomgaSeriesMeta(komgaSeriesId)
  // remove duplicate links by label
  seriesMeta.links = [...komgaMeta.links, ...seriesMeta.links]
  seriesMeta.links = seriesMeta.links.filter(
    (link, index, self) => self.findIndex((t) => t.label === link.label) === index,
  )
  let newTags = [...komgaMeta.tags, ...seriesMeta.tags].map((t) => t2s(t))
  // remove duplicate tags which means same label
  newTags = newTags.map((t) => {
    const matchingLabel = equalLabels.find((labels) => {
      const labelArr = labels.split(',')
      return labelArr.includes(t)
    });

    if (matchingLabel) {
      const labelArr = matchingLabel.split(',')
      return labelArr[0]
    } else {
      return t
    }
  }).filter(Boolean)
  // remove duplicate tags
  seriesMeta.tags = Array.from(new Set(newTags))

  seriesMeta.alternateTitles = [...komgaMeta.alternateTitles, ...seriesMeta.alternateTitles]
  // alternateTitles重新排序，label为原名的排在前面
  seriesMeta.alternateTitles.sort((a, b) => {
    if (a.label === '原名') return -1
    else if (b.label === '别名') return 1
    else return 0
  })
  // remove duplicate alternateTitles which has same title attribute
  seriesMeta.alternateTitles = seriesMeta.alternateTitles.filter(
    (altTitle, index, self) => self.findIndex((t) => t.title.toLowerCase() === altTitle.title.toLowerCase()) === index,
  )

  // 移除锁住禁止编辑项
  // FOOL: continue语句只能在循环语句（如 for、while、do-while）中使用, 因此使用for in替换Object.keys
  // FOOL: for in loop obj, for of loop array
  for (const keyName in seriesMeta) {
    if (komgaMeta[keyName + 'Lock']) {
      // if (keyName === 'title') continue
      delete seriesMeta[keyName]
      delete seriesMeta[keyName + 'Lock']
    }
  }

  const oriTitle = await getKomgaOriTitle(komgaSeriesId)
  const simOriTitle = t2s(oriTitle)

  for (const tag in publisherMappings) {
    if (simOriTitle.includes(tag)) {
      const mapping = publisherMappings[tag]
      seriesMeta.language = mapping.language
      seriesMeta.languageLock = true
      seriesMeta.publisher = mapping.publisher
      seriesMeta.publisherLock = true
      seriesMeta.readingDirection = 'LEFT_TO_RIGHT'
      seriesMeta.readingDirectionLock = true
      break
    }
  }
  return seriesMeta
}
//</editor-fold>

// ************************************** API封装 **************************************
//<editor-fold desc="基本请求封装">
// 日志控制
const DEBUG = {
  enabled: false, // 总开关
  log: function(...args) {
    if (this.enabled) console.log(...args);
  },
  error: function(...args) {
    if (this.enabled) console.error(...args);
  }
};

function asyncReq(url, send_type, data_ry = {}, headers = defaultHeaders) {
  return new Promise((resolve, reject) => {
    try {
      DEBUG.log('Original Data:', data_ry);

      // 初始化基本请求选项
      const requestOptions = {
        method: send_type,
        headers: {
          ...headers,
          'Accept': 'application/json, text/plain, */*',
          'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true,
        timeout: 30000,
        anonymous: false,
        nocache: true,
        onload: function(response) {
          DEBUG.log('Response Status:', response.status);
          DEBUG.log('Response Text:', response.responseText);

          if (response.status >= 200 && response.status < 300) {
            resolve(response.responseText);
          } else {
            reject(new Error(`HTTP ${response.status}: ${response.statusText || '请求失败'} - ${response.responseText}`));
          }
        },
        onerror: function(error) {
          DEBUG.error('Request failed:', error);
          reject(new Error('Network Error: ' + (error.message || '网络请求失败')));
        },
        ontimeout: function() {
          reject(new Error('Request Timeout: 请求超时'));
        }
      };

      // 处理 URL 参数
      if (send_type.toUpperCase() === 'GET' && Object.keys(data_ry).length > 0) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(data_ry)) {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        }
        url = `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
      }
      requestOptions.url = url;

      // 处理请求体
      if (send_type.toUpperCase() !== 'GET' && data_ry) {
        if (data_ry instanceof FormData) {
          // FormData 处理
          requestOptions.data = data_ry;
          // 对于 FormData，不设置 Content-Type，让浏览器自动处理
          delete requestOptions.headers['Content-Type'];
        } else if (typeof data_ry === 'string') {
          try {
            // 尝试解析 JSON 字符串
            JSON.parse(data_ry);
            requestOptions.data = data_ry;
            requestOptions.headers['Content-Type'] = 'application/json;charset=UTF-8';
          } catch (e) {
            // 如果不是 JSON 字符串，直接使用
            requestOptions.data = data_ry;
          }
        } else if (Object.keys(data_ry).length > 0) {
          // 对象序列化
          requestOptions.data = JSON.stringify(data_ry);
          requestOptions.headers['Content-Type'] = 'application/json;charset=UTF-8';
        }
      }

      DEBUG.log('Final Request Options:', {
        ...requestOptions,
        data: requestOptions.data instanceof FormData
          ? '[FormData]'
          : (typeof requestOptions.data === 'string'
              ? (requestOptions.headers['Content-Type']?.includes('json')
                  ? JSON.parse(requestOptions.data)
                  : requestOptions.data)
              : requestOptions.data)
      });

      GM_xmlhttpRequest(requestOptions);
    } catch (error) {
      DEBUG.error('Request setup failed:', error);
      reject(new Error('Request Setup Error: ' + error.message));
    }
  });
}


// 使用方法：
// 开启调试日志
// DEBUG.enabled = true;

// 关闭调试日志
// DEBUG.enabled = false;


//</editor-fold>

//<editor-fold desc="API封装-系列">
//Komga系列Api
//Komga Api:获取系列所有信息
async function getKomgaSeriesData(komgaSeriesId) {
  const seriesUrl = location.origin + '/api/v1/series/' + komgaSeriesId
  const seriesResStr = await asyncReq(seriesUrl, 'GET')
  return JSON.parse(seriesResStr)
}
//Komga Api:获取系列meta信息
async function getKomgaSeriesMeta(komgaSeriesId) {
  const seriesData = await getKomgaSeriesData(komgaSeriesId)
  return seriesData.metadata
}
//Komga Api:获取系列原名
async function getKomgaOriTitle(komgaSeriesId) {
  const seriesData = await getKomgaSeriesData(komgaSeriesId)
  return seriesData.name
}
//Komga Api:更新系列信息
async function updateKomgaSeriesMeta(komgaSeriesId, komgaSeriesName, komgaSeriesMeta) {
  // 更新书籍总信息, api是api/v1/series/moeSeriesId/metadata, 方法是PATCH，body是json格式
  const bookMetaUrl = location.origin + '/api/v1/series/' + komgaSeriesId + '/metadata'
  try {
    asyncReq(bookMetaUrl, 'PATCH', JSON.stringify(komgaSeriesMeta))
    showMessage(`《${komgaSeriesName}》系列信息已更新`, 'success', 1500)
  } catch (e) {
    showMessage('《' + komgaSeriesMeta.title + '》系列信息更新失败', 'error', 5000)
  }
}
//Komga Api:更新系列封面
async function updateKomgaSeriesCover(komgaSeriesId, komgaSeriesName, imgUrl) {
  await cleanKomgaSeriesCover(komgaSeriesId, komgaSeriesName)
  GM_xmlhttpRequest({
    method: 'GET',
    url: imgUrl,
    responseType: 'blob',
    onload: async function (res) {
      let updateSeriesCoverUrl = location.origin + '/api/v1/series/' + komgaSeriesId + '/thumbnails'
      const seriesCoverFormdata = new FormData()
      const seriesCoverFile = new File([res.response], 'cover.png', { type: 'image/png' })
      seriesCoverFormdata.append('file', seriesCoverFile, 'cover.png')
      seriesCoverFormdata.append('selected', true)
      try {
        // 这儿的headers为{}很重要，否则无法自动识别为multipart/form-data
        await asyncReq(updateSeriesCoverUrl, 'POST', seriesCoverFormdata, {})
        showMessage('《' + komgaSeriesName + '》系列封面已更新', 'success', 500)
      } catch (e) {
        showMessage('《' + komgaSeriesName + '》系列封面更新失败', 'error', 5000)
      }
    },
  })
}
//Komga Api:获取系列所有封面
async function getKomgaSeriesCovers(komgaSeriesId) {
  let allSeriesCoverUrl = location.origin + '/api/v1/series/' + komgaSeriesId + '/thumbnails'
  return await asyncReq(allSeriesCoverUrl, 'GET')
}
//Komga Api:清理系列封面
async function cleanKomgaSeriesCover(komgaSeriesId, komgaSeriesName) {
  const cleanSeriesCoverUrl = location.origin + '/api/v1/series/' + komgaSeriesId + '/thumbnails/'
  const thumbsStr = await getKomgaSeriesCovers(komgaSeriesId)
  const thumbs = JSON.parse(thumbsStr)
  // filter thumbs which type is 'USER_UPLOADED', selected is false
  const thumbsToClean = thumbs?.filter((thumb) => thumb.type === 'USER_UPLOADED' && thumb.selected === false) || []
  for (const thumb of thumbsToClean) {
    try {
      await asyncReq(cleanSeriesCoverUrl + thumb.id, 'DELETE')
      showMessage('《' + komgaSeriesName + '》系列封面已清理', 'success', 500)
    } catch (e) {
      showMessage('《' + komgaSeriesName + '》系列封面清理失败', 'error', 5000)
    }
  }
}
//</editor-fold>

//<editor-fold desc="API封装-话卷">
//Komga卷Api
//Komga Api:更新书籍封面
async function updateKomgaBookCover(book, komgaSeriesName, imgUrl) {
  GM_xmlhttpRequest({
    method: 'GET',
    url: imgUrl,
    responseType: 'blob',
    onload: async function (res) {
      // 更新书籍每一卷的封面，api是api/v1/books/moeSeriesId/thumbnails，方法是POST，body是formdata格式
      let updateBookCoverUrl = location.origin + '/api/v1/books/' + book.id + '/thumbnails'
      let bookCoverFormdata = new FormData()
      let bookCoverName = 'book' + book.id + '.png'
      let bookCoverFile = new File([res.response], bookCoverName, { type: 'image/png' })
      bookCoverFormdata.append('file', bookCoverFile, bookCoverName)
      bookCoverFormdata.append('selected', 'true')
      try {
        // 修改这里：移除默认的 content-type，让浏览器自动设置
        await asyncReq(updateBookCoverUrl, 'POST', bookCoverFormdata, {
          'Content-Type': undefined // 显式移除 content-type，让浏览器自动处理
        })
        showMessage('《' + komgaSeriesName + '》第' + book.number + '卷封面已更新', 'success', 500)
      } catch (e) {
        console.error('Cover update error:', e) // 添加错误日志以便调试
        showMessage('《' + komgaSeriesName + '》第' + book.number + '卷封面更新失败', 'error', 5000)
      }
    },
    onerror: function(e) { // 添加错误处理
      console.error('Image fetch error:', e)
      showMessage('《' + komgaSeriesName + '》第' + book.number + '卷图片获取失败', 'error', 5000)
    }
  })
}

//Komga Api:获取系列下所有书籍
async function getKomgaSeriesBooks(komgaSeriesId) {
  let seriesBookUrl =
    location.origin +
    '/api/v1/series/' +
    komgaSeriesId +
    '/books?page=0&size=' +
    maxReqBooks +
    '&sort=metadata.numberSort%2Casc'

  const seriesBookRes = await asyncReq(seriesBookUrl, 'GET')
  return JSON.parse(seriesBookRes)
}
//Komga Api:更新书籍信息
async function updateKomgaBookMeta(book, komgaSeriesName, bookMeta) {
  try {
    // 更新书籍每一卷的信息，api是api/v1/books/moeSeriesId/metadata，方法是PATCH，body是json格式
    await asyncReq(location.origin + '/api/v1/books/' + book.id + '/metadata', 'PATCH', JSON.stringify(bookMeta))
    showMessage('《' + komgaSeriesName + '》第' + book.number + '卷信息已更新', 'success', 1500)
  } catch (e) {
    showMessage('《' + komgaSeriesName + '》第' + book.number + '卷信息更新失败', 'error', 5000)
  }
}
//Komga Api:更新书籍信息
async function updateKomgaBookAll(seriesBooks, seriesName, bookAuthors, bookCoverUrls) {
  if (seriesBooks.numberOfElements >= maxReqBooks) {
    showMessage(`《${seriesName}》卷数量大于${maxReqBooks}，已取消`, 'warning', 15000)
    return
  }
  await seriesBooks.content.map(async (book, idx) => {
    if (bookAuthors && bookAuthors.length > 0) {
      let bookMeta = {
        title: '卷 ' + book.metadata.number.toString().padStart(2, '0'),
        authors: bookAuthors,
      }
      // 更新书籍信息
      await updateKomgaBookMeta(book, seriesName, bookMeta)
    }
    // 更新书籍封面
    if (bookCoverUrls && bookCoverUrls.length > 0) await updateKomgaBookCover(book, seriesName, bookCoverUrls[idx])
    else showMessage('《' + seriesName + '》第' + book.number + '卷更新完成', 'success', 500)
    // time sleep 1.5s
    setTimeout(() => {}, 1500)
  }),
    showMessage('《' + seriesName + '》更新完成', 'success', 5000)
}
//Komga Api:更新书籍作者
function ifUpdateBookAuthors(seriesBooks, bookAuthors) {
  const seriesBooksContent = seriesBooks.content
  const lastBook = seriesBooksContent[seriesBooksContent.length - 1]
  const lastBookTitle = lastBook.metadata.title

  if (lastBookTitle.length > 16 || lastBookTitle.includes('[')) {
    return true
  }

  if (lastBookTitle.includes('篇') || lastBookTitle.includes('集') || lastBookTitle.includes('公式') || lastBookTitle.includes('番外') || lastBookTitle.includes('档案')) {
    return false
  }

  // if lastBookTitle length is greater than 6 or lastBookTitle contain 'Vol' or 'vol', then fetch all book cover
  if (lastBookTitle.length > 6 || lastBookTitle.includes('Vol') || lastBookTitle.includes('vol')) {
    // 获取书籍每一卷的信息，更新卷作者
    if (bookAuthors && bookAuthors.length > 0) {
      return true
    }
  }
  return false
}
//</editor-fold>

// ************************************* 第三方请求 *************************************
//<editor-fold desc="第三方请求">
async function fetchBookByName(seriesName, source) {
  source = source.toLowerCase()
  switch (source) {
    case 'btv':
      return await fetchBtvBookByName(seriesName)
    case 'bof':
      return await fetchMoeBookByName(seriesName)
    default:
      return await fetchBtvBookByName(seriesName)
  }
}
async function fetchBtvBookByName(seriesName) {
  const searchRes = await asyncReq(`${btvUrl}/subject_search/${seriesName}?cat=1`, 'GET')
  const resEle = document.createElement('div')
  resEle.innerHTML = searchRes.toString()
  const resList = resEle.querySelector('ul#browserItemList')
  let resItems = resList.querySelectorAll('li.item')
  resItems = resItems.length > 8 ? Array.from(resItems).slice(0, 8) : resItems
  const resArr = []
  for (let i = 0; i < resItems.length; i++) {
    const resItem = resItems[i]
    const resTitle = resItem.querySelector('a.l').innerText
    const resUrl = resItem.querySelector('a.l').href
    const resCoverUrl = resItem.querySelector('img')?.src
    const resInfo = resItem.querySelector('p.info').innerText.split('/')
    const resAuthor = resInfo.length < 2 ? resInfo[0].trim() : resInfo[1].trim()
    const resId = resUrl.match(/subject\/(\d+)/)[1]
    resArr.push({ id: resId, title: resTitle, author: resAuthor, cover: resCoverUrl })
  }
  return resArr
}
async function fetchMoeBookByName(seriesName) {
  const moeSeriesName = s2t(seriesName)
  const searchRes = await asyncReq(`${bofUrl}/data_list.php?s=${moeSeriesName}&p=1`, 'GET')
  const idxRe = /datainfo-B=[^,]+,(\d+),(.*),(.*),\d+-\d+-\d+/
  const scriptArr = searchRes.split('<script>')
  return scriptArr
    .map((script) => {
      const aResult = script.match(idxRe)
      if (aResult) {
        const [_, id, title, author] = aResult
        return { id, title, author }
      }
    })
    .filter(Boolean)
}

async function fetchBookByUrl(komgaSeriesId, reqSeriesId, reqSeriesUrl = '', source = 'btv') {
  source = source.toLowerCase()
  switch (source) {
    case 'btv':
      await fetchBtvBookByUrl(komgaSeriesId, reqSeriesId, reqSeriesUrl)
      break
    case 'bof':
      await fetchMoeBookByUrl(komgaSeriesId, reqSeriesId, reqSeriesUrl)
      break
    default:
      await fetchBtvBookByUrl(komgaSeriesId, reqSeriesId, reqSeriesUrl)
      break
  }
}
async function fetchBtvBookCover(bookUrl, bookRes) {
  const seriesRes = bookRes ? bookRes : await asyncReq(bookUrl, 'GET')
  const resEle = document.createElement('div')
  resEle.innerHTML = seriesRes.toString()
  const infoEle = resEle.querySelector('div#bangumiInfo')
  return infoEle.querySelector('img.cover')?.src
}
async function fetchBtvBookByUrl(komgaSeriesId, reqSeriesId, reqSeriesUrl = '') {
  const btvSeriesUrl = reqSeriesUrl === '' ? `${btvUrl}/subject/${reqSeriesId}` : reqSeriesUrl
  // 访问https://bangumi.tv/subject/reqSeriesId，获取书籍信息
  const seriesRes = await asyncReq(btvSeriesUrl, 'GET')
  // Create a temporary element to parse the HTML content
  const resEle = document.createElement('div')
  resEle.innerHTML = seriesRes.toString()

  let seriesTags = []
  const oriSeriesName = resEle.querySelector('h1.nameSingle > a').innerText.trim()
  const infoEle = resEle.querySelector('div#bangumiInfo')
  const infoBars = infoEle.querySelectorAll('li')
  const resSummary = resEle.querySelector('div#subject_summary')?.innerText
  const tagLinksEle = resEle.querySelectorAll('div.subject_tag_section > div.inner > a')
  const bookLinksEle = resEle.querySelectorAll('ul.browserCoverSmall > li > a')
  // FOOL: 这里tagLinksEle是NodeList，不是数组，不能直接使用map，不能pop，需要转换成Array
  for (const tagLink of tagLinksEle) {
    if (tagLink === tagLinksEle[tagLinksEle.length - 1]) break
    const tagTitle = tagLink.querySelector('span').textContent
    const tagCount = parseInt(tagLink.querySelector('small').textContent)
    seriesTags.push({ name: tagTitle, count: tagCount })
  }
  // get max tag count
  const maxTagCount = Math.max(...seriesTags.map((tag) => tag.count))
  let thresholdTagCount
  switch (maxTagCount) {
    case maxTagCount > 200:
      thresholdTagCount = 35
      break
    case maxTagCount > 125:
      thresholdTagCount = 25
      break
    case maxTagCount > 60:
      thresholdTagCount = 15
      break
    case maxTagCount > 30:
      thresholdTagCount = 10
      break
    case maxTagCount > 10:
      thresholdTagCount = 5
      break
    default:
      thresholdTagCount = 3
      break
  }
  // filter tags which count is greater than thresholdTagCount
  seriesTags = seriesTags.filter((tag) => tag.count > thresholdTagCount)
  // filter tags which name is in tagLabels and equalLabels
  seriesTags = seriesTags.filter((tag) => tagLabels.includes(tag.name + ','))
  seriesTags = seriesTags.map((tag) => tag.name)
  let resAuthors = []
  let seriesMeta = {
    title: '',
    titleLock: true,
    titleSort: '',
    titleSortLock: true,
    tags: seriesTags,
    links: [{ label: 'Btv', url: btvSeriesUrl }],
    publisher: '',
    totalBookCount: '',
    summary: resSummary || '',
    summaryLock: true,
  }
  let seriesOtherNames = []
  let seriesName = ''
  infoBars.forEach((infoBar) => {
    const infoBarText = infoBar.innerText
    if (infoBarText.includes('中文名:')) {
      seriesMeta.title = infoBarText.split(':')[1].trim()
      seriesName = seriesMeta.title
    } else if (infoBarText.includes('册数:')) {
      seriesMeta.totalBookCount = infoBarText.split(':')[1].trim()
      seriesMeta.totalBookCount = seriesMeta.totalBookCount.match(/\d+/)[0]
    } else if (infoBarText.includes('出版社:')) {
      seriesMeta.publisher = infoBarText.split(':')[1].split('、')[0].trim()
      seriesMeta.publisher = t2s(seriesMeta.publisher)
    } else if (infoBarText.includes('作者:')) {
      const writer = infoBarText.split(':')[1].trim().split('、')
      if (writer.length > 0) {
        resAuthors.push(...writer.map((a) => ({ name: a, role: 'writer' })))
      }
    } else if (infoBarText.includes('原作:')) {
      const writer = infoBarText.split(':')[1].trim().split('、')
      if (writer.length > 0) {
        resAuthors.push(...writer.map((a) => ({ name: a, role: 'writer' })))
      }
    } else if (infoBarText.includes('铅稿:')) {
      const penciller = infoBarText.split(':')[1].trim().split('、')
      if (penciller.length > 0) {
        resAuthors.push(...penciller.map((a) => ({ name: a, role: 'penciller' })))
      }
    } else if (infoBarText.includes('作画:')) {
      const inker = infoBarText.split(':')[1].trim().split('、')
      if (inker.length > 0) {
        resAuthors.push(...inker.map((a) => ({ name: a, role: 'inker' })))
      }
    } else if (infoBarText.includes('上色:')) {
      const colorist = infoBarText.split(':')[1].trim().split('、')
      if (colorist.length > 0) {
        resAuthors.push(...colorist.map((a) => ({ name: a, role: 'colorist' })))
      }
    } else if (infoBarText.includes('别名:')) {
      seriesOtherNames.push(infoBarText.split(':')[1].trim())
    } else if (infoBarText.includes('结束:')) {
      const endDate = infoBarText.split(':')[1].trim()
      if (t2s(endDate).includes('休刊')) {
        seriesMeta.status = 'HIATUS'
      } else if (t2s(endDate).includes('连载')) {
        seriesMeta.status = 'ONGOING'
      } else if (/\d{4}-\d{2}-\d{2}/.test(endDate)) {
        seriesMeta.status = 'ENDED'
      } else if (/\d{4}年/.test(endDate)) {
        seriesMeta.status = 'ENDED'
      } else {
        showMessage(`未知的结束日期格式: ${endDate}`, 'error')
      }
    }
  })
  seriesMeta.title = seriesMeta.title ? seriesMeta.title : oriSeriesName
  seriesMeta.titleSort = seriesMeta.title ? seriesMeta.title : oriSeriesName
  seriesMeta.alternateTitles = [
    { label: '原名', title: capitalize(oriSeriesName) },
    ...seriesOtherNames.map((name) => ({ label: '别名', title: capitalize(name) })),
  ]
  // filter out seriesMeta which value is empty
  seriesMeta = await filterSeriesMeta(komgaSeriesId, seriesMeta)
  seriesMeta = Object.fromEntries(Object.entries(seriesMeta).filter(([_, v]) => v !== ''))
  await updateKomgaSeriesMeta(komgaSeriesId, seriesName, seriesMeta)

  const fetchSeriesType = localStorage.getItem(`SID-${komgaSeriesId}`)
  const seriesBooks = await getKomgaSeriesBooks(komgaSeriesId)
  if (fetchSeriesType === 'all') {
    const resCoverUrl = await fetchBtvBookCover(btvSeriesUrl, seriesRes)
    await updateKomgaSeriesCover(komgaSeriesId, seriesName, resCoverUrl)
    let bookCoversUrls = []
    // get books url from bookLinksEle
    for (const bookLinkEle of bookLinksEle) {
      // FOOL: 这里要用.getAttribute('href')，不能用.href，a.getAttribute('href')返回字符串，而a.href则返回一个Location对象
      // 1.如果 href 属性值是一个绝对 URL 地址（例如 http://example.com/path），则直接返回该地址。
      // 2.如果 href 属性值是一个相对 URL 地址（例如 /path 或 ../path），则将其解析为相对于当前文档的绝对 URL 地址，并返回该地址。
      // 3.如果 href 属性值是一个空字符串或者未定义，则返回当前文档的绝对 URL 地址。
      // 4.如果 href 属性值是一个 JavaScript 代码片段（例如 javascript:void(0)），则返回 undefined。
      const bookUrl = bookLinkEle.getAttribute('href')
      const bookCoverUrl = await fetchBtvBookCover(`${btvUrl}${bookUrl}`)
      bookCoversUrls.push(bookCoverUrl)
    }
    bookCoversUrls.filter(Boolean)
    const bookAuthors = ifUpdateBookAuthors(seriesBooks, resAuthors) ? resAuthors : []
    await updateKomgaBookAll(seriesBooks, seriesName, bookAuthors, bookCoversUrls)
  } else {
    if (ifUpdateBookAuthors(seriesBooks, resAuthors)) await updateKomgaBookAll(seriesBooks, seriesName, resAuthors)
  }
  showMessage('《' + seriesName + '》更新完成', 'success', 5000)
}
async function fetchMoeBookByUrl(komgaSeriesId, reqSeriesId, reqSeriesUrl = '') {
  const moeSeriesUrl = reqSeriesUrl === '' ? `${bofUrl}/b/${reqSeriesId}.htm` : reqSeriesUrl
  const moeSeriesId = moeSeriesUrl.match(/https:\/\/bookof\.moe\/b\/(.*?)\.htm/)[1]
  // 访问https://bookof.moe/b/moeSeriesId.htm，获取书籍信息
  const seriesRes = await asyncReq(moeSeriesUrl, 'GET')
  // Create a temporary element to parse the HTML content
  const resEle = document.createElement('div')
  resEle.innerHTML = seriesRes.toString()
  // 从innerHTML检索 window.iframe_action.location.href = "https://bookof.moe/data_vol.php?h=1690304697VX1093110127896b7584f"; 中的href
  const bookCoverUrl = resEle
    .querySelector('script')
    .textContent.match(/window\.iframe_action\.location\.href = "(.*?)"/)[1]
  // Find the <td> element with the class name "author"
  const mainEle = resEle.querySelector('td.author')
  const r18Img = mainEle.querySelector('img#logo_r18')
  const isR18 = r18Img.style.display !== 'none'

  // Extract the values using regular expressions
  const seriesOriName = mainEle.querySelector('.name_main').textContent
  const seriesName = t2s(seriesOriName)
  const seriesDesc = resEle.querySelector('div#div_desctext').textContent
  seriesDesc.replace(/[\r\n]/g, '').replace(/\【.*?\】$/, '')

  const seriesNameStr = mainEle.querySelector('.name_subt')?.textContent
  const seriesNameArr = seriesNameStr ? seriesNameStr.match(/\(([^)]+)\)\s*(.*)/) : []
  const seriesEngName = seriesNameArr?.length > 0 ? seriesNameArr[1] : null
  const author = mainEle.querySelector('a[href^="https://bookof.moe/s/AUT"]').textContent.split(' ').filter(Boolean)
  // author ['name'] to authors [{name: 'name', role: 'writer'}]
  const authors = author.map((a) => ({ name: a, role: 'writer' }))
  const infoEle = mainEle.querySelectorAll('.name_subt')[1]
  // const publicationYear = infoEle.textContent.match(/最後出版：(.*?)\s/)[1].trim()
  const status = t2s(infoEle.textContent.match(/狀態：(.*?)\s/)[1].trim())
  let seriesStatusCode
  switch (status) {
    case '连载':
      seriesStatusCode = 'ONGOING'
      break
    case '完结':
      seriesStatusCode = 'ENDED'
      break
    case '停更':
      seriesStatusCode = 'HIATUS'
      break
    case '放弃':
      seriesStatusCode = 'ABANDONED'
      break
    default:
      seriesStatusCode = ''
  }
  const seriesTagsStr = infoEle.textContent.match(/分類：(.*?)\n/)[1]
  const seriesTags = seriesTagsStr
    .split(' ')
    .filter(Boolean)
    .map((t) => t2s(t))

  // 根据location.origin和document.cookie，更新书籍信息
  let seriesMeta = {
    title: seriesName,
    titleSort: seriesName,
    status: seriesStatusCode,
    alternateTitles: [
      { label: '别名', title: seriesEngName },
      { label: '别名', title: s2t(seriesName) },
    ],
    links: [
      { label: 'Bof', url: moeSeriesUrl },
      { label: 'Mox', url: `https://kox.moe/c/${moeSeriesId}.htm` },
    ],
    tags: seriesTags,
    ageRating: isR18 ? '18' : '',
    summary: seriesDesc,
  }
  seriesMeta = await filterSeriesMeta(komgaSeriesId, seriesMeta)
  await updateKomgaSeriesMeta(komgaSeriesId, seriesName, seriesMeta)

  const seriesBooks = await getKomgaSeriesBooks(komgaSeriesId)
  // get komga series id from local storage
  const fetchSeriesType = localStorage.getItem(`SID-${komgaSeriesId}`)
  // if fetchSeriesType is 'all', then fetch all book cover, else pass
  if (fetchSeriesType === 'all') {
    const coverRes = await asyncReq(bookCoverUrl, 'GET')
    // 获取封面URL列表
    let bookCoverUrls = coverRes.match(/datainfo-V=\d+,[^,]+,[^,]+,[^,]+,([^,]+),[^,]+/g)
    if (bookCoverUrls.length > 0) {
      bookCoverUrls = bookCoverUrls.map((url) => url.match(/datainfo-V=\d+,[^,]+,[^,]+,[^,]+,([^,]+),[^,]+/)[1])
      showMessage('《' + seriesName + '》封面已获取', 'success', 500)
      await updateKomgaSeriesCover(komgaSeriesId, seriesName, bookCoverUrls[0])
      const bookAuthors = ifUpdateBookAuthors(seriesBooks, authors) ? authors : []
      await updateKomgaBookAll(seriesBooks, seriesName, bookAuthors, bookCoverUrls)
    } else {
      showMessage('《' + seriesName + '》封面获取失败', 'error', 5000)
    }
  } else {
    if (ifUpdateBookAuthors(seriesBooks, authors)) {
      await updateKomgaBookAll(seriesBooks, seriesName, authors)
    }
  }
  showMessage('《' + seriesName + '》更新完成', 'success', 5000)
}
//</editor-fold>

async function search(komgaSeriesId, $dom) {
  if (!komgaSeriesId) {
    showMessage('请先选择一个系列', 'error', 5000)
    return
  }
  const komgaMeta = await getKomgaSeriesMeta(komgaSeriesId)
  const komgaMetaLinks = komgaMeta.links
  const $selSourcePanel = $('<div></div>').css({ ...selPanelStyle })
  // filter out sourceLabels value is not in sourceTypes
  sourceLabels.forEach((label) => {
    const $selSourceBtn = $('<button></button>')
      .append('<div>' + label + '</div>')
      .attr('sourceLabel', label)
      .css({ ...selPanelBtnStyle })
    $selSourceBtn.on('click', async function () {
      const sourceLabel = $(this).attr('sourceLabel').toLowerCase()
      const linkObj = komgaMetaLinks.find((url) => url.label.toLowerCase() === sourceLabel)
      localStorage.setItem(`STY-${komgaSeriesId}`, sourceLabel)
      if (linkObj) {
        partLoadingStart($dom)
        $selSourcePanel.remove()
        await fetchBookByUrl(komgaSeriesId, 0, linkObj.url, sourceLabel)
        partLoadingEnd($dom)
      } else {
        $selSourcePanel.remove()
        await selectSeriesTitle(komgaSeriesId, $dom)
      }
    })
    $selSourcePanel.append($selSourceBtn)
  })
  const $cancelBtn = $('<button></button>')
    .append('<div> 取消 </div>')
    .css({ ...selPanelBtnStyle })
    .on('click', function () {
      $selSourcePanel.remove()
    })
  $selSourcePanel.append($cancelBtn)
  $selSourcePanel.appendTo('body')
}

function main() {
  $(document).ready(function () {
    loadMessage()
    const curHref = location.href.replace(/%2F/g, '/')
    const listPageRegex = /\/(startup\?redirect=)?\/?libraries\/.*\/series$/
    let isListPage = curHref.match(listPageRegex)
    const detailPageRegex = /\/(startup\?redirect=)?\/?series\/.*/
    let isDetailPage = curHref.match(detailPageRegex)
    if (isListPage) {
      console.log('Now is a list page.')
      let $bookContainers = $('div.my-2.mx-2')
      let domIntervalId = setInterval(function () {
        if ($bookContainers.length === 0) {
          $bookContainers = $('div.my-2.mx-2')
        } else {
          $bookContainers.each(function () {
            const $book = $(this)
            const $linkDiv = $book.find('a').first()
            const komgaOriTitle = $linkDiv.children('div').first().attr('title')
            $book.attr('komgaOriTitle', komgaOriTitle)
            const href = $linkDiv.attr('href')
            const komgaSeriesId = href.match(/\/series\/(\w+)/)[1]
            loadSearchBtn($book, komgaSeriesId)
          })
          clearInterval(domIntervalId)
        }
      }, 100)
    } else if (isDetailPage) {
      console.log('Now is a detail page.')
      let $book = $('div.container > div > div > div.v-card')
      let domIntervalId = setInterval(function () {
        if ($book.length === 0) {
          $book = $('div.container > div > div > div.v-card')
        } else {
          const komgaSeriesId = curHref.match(/\/series\/(\w+)/)[1]
          const komgaOriTitle = document.body.querySelector('span.text-h5').innerText
          $book.attr('komgaOriTitle', komgaOriTitle)
          loadSearchBtn($book, komgaSeriesId)
          clearInterval(domIntervalId)
        }
      }, 100)
    } else {
      console.log('Now is a irrelevant page.')
    }
  })
}

const _wr = function (type) {
  const orig = history[type]
  return function () {
    const rv = orig.apply(this, arguments)
    const e = new Event(type)
    e.arguments = arguments
    window.dispatchEvent(e)
    return rv
  }
}
history.pushState = _wr('pushState')
window.addEventListener('pushState', () => {
  main()
})
