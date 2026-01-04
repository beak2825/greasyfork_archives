// ==UserScript==
// @name         Azusa Torrent Helper
// @author       Beer
// @thanks       开发过程中参考了PTer Torrent Checker，感谢原作者！
// @version      0.1.12
// @description  Assist with checking torrents for Azusa.
// @require      https://cdn.staticfile.org/jquery/1.7.1/jquery.min.js
// @match        https://azusa.ru/details.php?id=*
// @exclude      https://azusa.ru/details.php?id=*startcomments
// @match        https://www.azusa.wiki/details.php?id=*
// @exclude      https://www.azusa.wiki/details.php?id=*startcomments
// @icon         https://azusa.wiki/favicon.ico
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/users/942532-beer
// @downloadURL https://update.greasyfork.org/scripts/451454/Azusa%20Torrent%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/451454/Azusa%20Torrent%20Helper.meta.js
// ==/UserScript==
(() => {

    // 不审核已审状态的种子
    var noVerified = false;

    // 查重时显示的数量
    var showNum = 5;

    // 出版社/汉化组
    var publishers = ['尖端', '東販', '东贩', '東立', '东立', '長鴻', '长鸿', '大然', '角川', '青文', '文傳', '文传', '文化传信', '文化傳信', '玉皇朝', '尚禾', 'bookwalker', 'bili', '永润', '远东文化', '力群', '艾尼克斯', '正文社', '苍社',
                      'HobbyJapan', 'MF文庫J', 'MEDIA FACTORY', '富士見書房', '少年ブック', '远流出版', 'HJ文库',
                  '汉化', '动漫之家', '大汉', '时报', '原動力', '原动力', '德间书店', 'KADOKAWA', '小学馆', '小學館', '講談社', '讲谈社', '白泉社', '集英社', '時報', '时报',
                  '墮落的猴子', 'HMM', '惡之華', '恶之华', 'C.C', '喵爪斯基', 'aaa874160', 'Techa', 'LYC', 'Sean0345', '幽幽', 'zsliming', 'yukiking', 'pupi92002', 'SilentMist', 'a09070811', 'milianaisu', 'hanako', 'hmml',
                  '天下', '螢火蟲', '萤火虫', '未來數位', '未來数位', '中华漫画论坛扫漫组', '中漫',
                  '破解提取', '去DRM', '劫持输出', '自购' ]

    /* utils */

    // 获取文件列表
    async function getFileList(url) {
        let prom = new Promise( function(resolve, reject) {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    resolve(response);
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
        let XMLResponse = await prom;
        let response = XMLResponse.response;
        $(response).find('.rowfollow').each(function () {
            if($(this).index() == 0) {
                tr.filelist.push($(this).text());
            }
        });
    }

    /* 简体繁体转换 */
    function JTPYStr()
    {
        return '皑蔼碍爱翱袄奥坝罢摆败颁办绊帮绑镑谤剥饱宝报鲍辈贝钡狈备惫绷笔毕毙闭边编贬变辩辫鳖瘪濒滨宾摈饼拨钵铂驳卜补参蚕残惭惨灿苍舱仓沧厕侧册测层诧搀掺蝉馋谗缠铲产阐颤场尝长偿肠厂畅钞车彻尘陈衬撑称惩诚骋痴迟驰耻齿炽冲虫宠畴踌筹绸丑橱厨锄雏础储触处传疮闯创锤纯绰辞词赐聪葱囱从丛凑窜错达带贷担单郸掸胆惮诞弹当挡党荡档捣岛祷导盗灯邓敌涤递缔点垫电淀钓调迭谍叠钉顶锭订东动栋冻斗犊独读赌镀锻断缎兑队对吨顿钝夺鹅额讹恶饿儿尔饵贰发罚阀珐矾钒烦范贩饭访纺飞废费纷坟奋愤粪丰枫锋风疯冯缝讽凤肤辐抚辅赋复负讣妇缚该钙盖干赶秆赣冈刚钢纲岗皋镐搁鸽阁铬个给龚宫巩贡钩沟构购够蛊顾剐关观馆惯贯广规硅归龟闺轨诡柜贵刽辊滚锅国过骇韩汉阂鹤贺横轰鸿红后壶护沪户哗华画划话怀坏欢环还缓换唤痪焕涣黄谎挥辉毁贿秽会烩汇讳诲绘荤浑伙获货祸击机积饥讥鸡绩缉极辑级挤几蓟剂济计记际继纪夹荚颊贾钾价驾歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧浆蒋桨奖讲酱胶浇骄娇搅铰矫侥脚饺缴绞轿较秸阶节茎惊经颈静镜径痉竞净纠厩旧驹举据锯惧剧鹃绢杰洁结诫届紧锦仅谨进晋烬尽劲荆觉决诀绝钧军骏开凯颗壳课垦恳抠库裤夸块侩宽矿旷况亏岿窥馈溃扩阔蜡腊莱来赖蓝栏拦篮阑兰澜谰揽览懒缆烂滥捞劳涝乐镭垒类泪篱离里鲤礼丽厉励砾历沥隶俩联莲连镰怜涟帘敛脸链恋炼练粮凉两辆谅疗辽镣猎临邻鳞凛赁龄铃凌灵岭领馏刘龙聋咙笼垄拢陇楼娄搂篓芦卢颅庐炉掳卤虏鲁赂禄录陆驴吕铝侣屡缕虑滤绿峦挛孪滦乱抡轮伦仑沦纶论萝罗逻锣箩骡骆络妈玛码蚂马骂吗买麦卖迈脉瞒馒蛮满谩猫锚铆贸么霉没镁门闷们锰梦谜弥觅绵缅庙灭悯闽鸣铭谬谋亩钠纳难挠脑恼闹馁腻撵捻酿鸟聂啮镊镍柠狞宁拧泞钮纽脓浓农疟诺欧鸥殴呕沤盘庞国爱赔喷鹏骗飘频贫苹凭评泼颇扑铺朴谱脐齐骑岂启气弃讫牵扦钎铅迁签谦钱钳潜浅谴堑枪呛墙蔷强抢锹桥乔侨翘窍窃钦亲轻氢倾顷请庆琼穷趋区躯驱龋颧权劝却鹊让饶扰绕热韧认纫荣绒软锐闰润洒萨鳃赛伞丧骚扫涩杀纱筛晒闪陕赡缮伤赏烧绍赊摄慑设绅审婶肾渗声绳胜圣师狮湿诗尸时蚀实识驶势释饰视试寿兽枢输书赎属术树竖数帅双谁税顺说硕烁丝饲耸怂颂讼诵擞苏诉肃虽绥岁孙损笋缩琐锁獭挞抬摊贪瘫滩坛谭谈叹汤烫涛绦腾誊锑题体屉条贴铁厅听烃铜统头图涂团颓蜕脱鸵驮驼椭洼袜弯湾顽万网韦违围为潍维苇伟伪纬谓卫温闻纹稳问瓮挝蜗涡窝呜钨乌诬无芜吴坞雾务误锡牺袭习铣戏细虾辖峡侠狭厦锨鲜纤咸贤衔闲显险现献县馅羡宪线厢镶乡详响项萧销晓啸蝎协挟携胁谐写泻谢锌衅兴汹锈绣虚嘘须许绪续轩悬选癣绚学勋询寻驯训讯逊压鸦鸭哑亚讶阉烟盐严颜阎艳厌砚彦谚验鸯杨扬疡阳痒养样瑶摇尧遥窑谣药爷页业叶医铱颐遗仪彝蚁艺亿忆义诣议谊译异绎荫阴银饮樱婴鹰应缨莹萤营荧蝇颖哟拥佣痈踊咏涌优忧邮铀犹游诱舆鱼渔娱与屿语吁御狱誉预驭鸳渊辕园员圆缘远愿约跃钥岳粤悦阅云郧匀陨运蕴酝晕韵杂灾载攒暂赞赃脏凿枣灶责择则泽贼赠扎札轧铡闸诈斋债毡盏斩辗崭栈战绽张涨帐账胀赵蛰辙锗这贞针侦诊镇阵挣睁狰帧郑证织职执纸挚掷帜质钟终种肿众诌轴皱昼骤猪诸诛烛瞩嘱贮铸筑驻专砖转赚桩庄装妆壮状锥赘坠缀谆浊兹资渍踪综总纵邹诅组钻致钟么为只凶准启板里雳余链泄';
    }

    function FTPYStr()
    {
        return '皚藹礙愛翺襖奧壩罷擺敗頒辦絆幫綁鎊謗剝飽寶報鮑輩貝鋇狽備憊繃筆畢斃閉邊編貶變辯辮鼈癟瀕濱賓擯餅撥缽鉑駁蔔補參蠶殘慚慘燦蒼艙倉滄廁側冊測層詫攙摻蟬饞讒纏鏟産闡顫場嘗長償腸廠暢鈔車徹塵陳襯撐稱懲誠騁癡遲馳恥齒熾沖蟲寵疇躊籌綢醜櫥廚鋤雛礎儲觸處傳瘡闖創錘純綽辭詞賜聰蔥囪從叢湊竄錯達帶貸擔單鄲撣膽憚誕彈當擋黨蕩檔搗島禱導盜燈鄧敵滌遞締點墊電澱釣調叠諜疊釘頂錠訂東動棟凍鬥犢獨讀賭鍍鍛斷緞兌隊對噸頓鈍奪鵝額訛惡餓兒爾餌貳發罰閥琺礬釩煩範販飯訪紡飛廢費紛墳奮憤糞豐楓鋒風瘋馮縫諷鳳膚輻撫輔賦複負訃婦縛該鈣蓋幹趕稈贛岡剛鋼綱崗臯鎬擱鴿閣鉻個給龔宮鞏貢鈎溝構購夠蠱顧剮關觀館慣貫廣規矽歸龜閨軌詭櫃貴劊輥滾鍋國過駭韓漢閡鶴賀橫轟鴻紅後壺護滬戶嘩華畫劃話懷壞歡環還緩換喚瘓煥渙黃謊揮輝毀賄穢會燴彙諱誨繪葷渾夥獲貨禍擊機積饑譏雞績緝極輯級擠幾薊劑濟計記際繼紀夾莢頰賈鉀價駕殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗漿蔣槳獎講醬膠澆驕嬌攪鉸矯僥腳餃繳絞轎較稭階節莖驚經頸靜鏡徑痙競淨糾廄舊駒舉據鋸懼劇鵑絹傑潔結誡屆緊錦僅謹進晉燼盡勁荊覺決訣絕鈞軍駿開凱顆殼課墾懇摳庫褲誇塊儈寬礦曠況虧巋窺饋潰擴闊蠟臘萊來賴藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫撈勞澇樂鐳壘類淚籬離裏鯉禮麗厲勵礫曆瀝隸倆聯蓮連鐮憐漣簾斂臉鏈戀煉練糧涼兩輛諒療遼鐐獵臨鄰鱗凜賃齡鈴淩靈嶺領餾劉龍聾嚨籠壟攏隴樓婁摟簍蘆盧顱廬爐擄鹵虜魯賂祿錄陸驢呂鋁侶屢縷慮濾綠巒攣孿灤亂掄輪倫侖淪綸論蘿羅邏鑼籮騾駱絡媽瑪碼螞馬罵嗎買麥賣邁脈瞞饅蠻滿謾貓錨鉚貿麽黴沒鎂門悶們錳夢謎彌覓綿緬廟滅憫閩鳴銘謬謀畝鈉納難撓腦惱鬧餒膩攆撚釀鳥聶齧鑷鎳檸獰甯擰濘鈕紐膿濃農瘧諾歐鷗毆嘔漚盤龐國愛賠噴鵬騙飄頻貧蘋憑評潑頗撲鋪樸譜臍齊騎豈啓氣棄訖牽扡釺鉛遷簽謙錢鉗潛淺譴塹槍嗆牆薔強搶鍬橋喬僑翹竅竊欽親輕氫傾頃請慶瓊窮趨區軀驅齲顴權勸卻鵲讓饒擾繞熱韌認紉榮絨軟銳閏潤灑薩鰓賽傘喪騷掃澀殺紗篩曬閃陝贍繕傷賞燒紹賒攝懾設紳審嬸腎滲聲繩勝聖師獅濕詩屍時蝕實識駛勢釋飾視試壽獸樞輸書贖屬術樹豎數帥雙誰稅順說碩爍絲飼聳慫頌訟誦擻蘇訴肅雖綏歲孫損筍縮瑣鎖獺撻擡攤貪癱灘壇譚談歎湯燙濤縧騰謄銻題體屜條貼鐵廳聽烴銅統頭圖塗團頹蛻脫鴕馱駝橢窪襪彎灣頑萬網韋違圍爲濰維葦偉僞緯謂衛溫聞紋穩問甕撾蝸渦窩嗚鎢烏誣無蕪吳塢霧務誤錫犧襲習銑戲細蝦轄峽俠狹廈鍁鮮纖鹹賢銜閑顯險現獻縣餡羨憲線廂鑲鄉詳響項蕭銷曉嘯蠍協挾攜脅諧寫瀉謝鋅釁興洶鏽繡虛噓須許緒續軒懸選癬絢學勳詢尋馴訓訊遜壓鴉鴨啞亞訝閹煙鹽嚴顔閻豔厭硯彥諺驗鴦楊揚瘍陽癢養樣瑤搖堯遙窯謠藥爺頁業葉醫銥頤遺儀彜蟻藝億憶義詣議誼譯異繹蔭陰銀飲櫻嬰鷹應纓瑩螢營熒蠅穎喲擁傭癰踴詠湧優憂郵鈾猶遊誘輿魚漁娛與嶼語籲禦獄譽預馭鴛淵轅園員圓緣遠願約躍鑰嶽粵悅閱雲鄖勻隕運蘊醞暈韻雜災載攢暫贊贓髒鑿棗竈責擇則澤賊贈紮劄軋鍘閘詐齋債氈盞斬輾嶄棧戰綻張漲帳賬脹趙蟄轍鍺這貞針偵診鎮陣掙睜猙幀鄭證織職執紙摯擲幟質鍾終種腫衆謅軸皺晝驟豬諸誅燭矚囑貯鑄築駐專磚轉賺樁莊裝妝壯狀錐贅墜綴諄濁茲資漬蹤綜總縱鄒詛組鑽緻鐘麼為隻兇準啟闆裡靂餘鍊洩';
    }

    function Traditionalized(cc){
        var str='',ss=JTPYStr(),tt=FTPYStr();
        for(var i=0;i<cc.length;i++)
        {
            if(cc.charCodeAt(i)>10000&&ss.indexOf(cc.charAt(i))!=-1)str+=tt.charAt(ss.indexOf(cc.charAt(i)));
            else str+=cc.charAt(i);
        }
        return str;
    }

    function Simplized(cc){
        var str='',ss=JTPYStr(),tt=FTPYStr();
        for(var i=0;i<cc.length;i++)
        {
            if(cc.charCodeAt(i)>10000&&tt.indexOf(cc.charAt(i))!=-1)str+=ss.charAt(tt.indexOf(cc.charAt(i)));
            else str+=cc.charAt(i);
        }
        return str;
    }

    // 获取可能重复项
    async function getSearchTable() {
        if(tr.name) {
            let name = tr.name.replaceAll(/(^\s+|\s+$)/g, '');
            name = name + '+' + Traditionalized(name) + '+' + Simplized(name);
            name = name.replaceAll(/\s+/g, '+');
            let nameFields = name.split('+');
            let newNameFields = [];
            for(let i = 0; i < nameFields.length; i++) {
                if(!nameFields[i].match(/^\d+$/g)) {
                    newNameFields.push(nameFields[i]);
                }
            }
            if(newNameFields.length) {
                name = newNameFields.join('+');
            }
            var catDict = { 'Music': '409', 'Comic':'402', 'Light Novel':'403', 'Game':'404', 'CG':'407' }
            let url = ''
            if(tr.type in catDict) {
                url = 'https://www.azusa.wiki/torrents.php?cat' + catDict[tr.type] + '=1&incldead=1&spstate=0&inclbookmarked=0&approval_status=&search=' + name + '&search_area=0&search_mode=1';
            }
            else {
                url = 'https://www.azusa.wiki/torrents.php?incldead=1&spstate=0&inclbookmarked=0&approval_status=&search=' + name + '&search_area=0&search_mode=1';
            }
            console.log(url);
            let prom = new Promise( function(resolve, reject) {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: url,
                    onload: function (response) {
                        resolve(response);
                    },
                    onerror: function (error) {
                        reject(error);
                    }
                });
            });
            let XMLResponse = await prom;
            let response = XMLResponse.response;
            let $table = $(response).find('.torrents');
            if($table.length) {
                let findSelf = 0;
                if($table.length) {
                    $table.children().children('tr').each(function () {
                        if($(this).index() > showNum + findSelf - 1) {
                            $(this).remove();
                        }
                        else if($(this).find('td:eq(2)>a:eq(0)').attr('href').indexOf('id=' + tr.id + '&') != -1) {
                            $(this).remove();
                            findSelf = 1;
                        }
                    });
                }
                else {
                    $(response).find('h2').each(function() {
                        if($(this).text().indexOf('搜索结果') != -1) {
                            tr.$searchTable = $(this).closest('table');
                        }
                    });
                }
            }
            else {
                $table = $(response).find('h2').closest('table');
            }
            tr.searchTable = $table;
        }
    }
    async function waitInfoLoad() {
        await Promise.all([getFileList(tr.filelistUrl), getSearchTable()]);
    }

    // 种子信息
    var tr = {
        url:"",
        id: "",
        $titleNode: "",
        title:"",
        fields:"",
        name:"",
        subTitle: "",
        torrentTitle: "",
        type: "",
        size: "",
        download: "",
        $descr: null,
        descr:"",
        $imgs: null,
        filelistUrl: "",
        filelist: [],
        searchTable: null
    };

    tr.url = window.location.href;
    tr.id = /id=\d+/.exec(tr.url).pop().split('=')[1];
    tr.filelistUrl = "/viewfilelist.php?id=" + tr.id
    tr.$titleNode = $("#top");
    tr.$titleNode.contents().each(function () {
        if(this.nodeName == '#text') {
            tr.title += $(this).text();
        }
    });
    tr.status = $(tr.titleNode).find('span[title="未审"]');
    tr.fields = tr.title.match(/\[.*?\]/g);
    let $table = $('#kdescr').closest('table');
    let $rows = $table.find("tr").each(function () {
        let rowhead = $(this).find('td')[0]
        let content = $(this).find('td')[1]
        if($(rowhead).text() == '下载') {
            tr.torrentTitle = $(this).find("a:eq(0)").text();
        }
        else if($(rowhead).text() == '副标题') {
            tr.subTitle = $(content).text();
        }
        else if($(rowhead).text() == '基本信息') {
            let size_type = $(content).text();
            tr.size = size_type.match(/\d+(\.\d+)?\s*(TB|GB|MB|KB|B)/g)[0];
            tr.type = size_type.match(/(Comic|Game|Light Novel|CG|Music)/g)[0];
        }
    });
    tr.name = tr.title;
    if(tr.fields) {
        if(tr.type == 'Comic') {
            tr.name = tr.fields[0].substring(1, tr.fields[0].length-1);
        }
        else if(tr.type == 'Music') {
            if(tr.fields.length >= 4) {
                if( ((tr.fields[0] == '[EAC]') || (tr.fields[0] == '[XLD]')) && tr.fields[2] == '[合集]') {
                    tr.name = tr.fields[2] + tr.fields[3];
                }
                else if(tr.fields.length >=5) {
                    tr.name = tr.fields[3] + tr.fields[4];
                }
                else {
                    tr.name = tr.fields[3];
                }
            }
        }
    }
    tr.name = tr.name.replaceAll(/\[|\]|\(|\)/g, ' ');
    tr.download = $('.dt_download').parent().attr('href');
    tr.$descr = $('#kdescr');
    tr.descr = tr.$descr.text();
    tr.$imgs = tr.$descr.find('img');

    // 检查结果样式
    GM_addStyle(`
#checkerContainer {
  background-color: rgb(237, 171, 119);
  width: 940px;
  border: 1px solid;
}
#checkerDiv {

}
.tipRed {
  color: rgb(150, 30, 30);
  display: block;
}
.tipGreen {
  color: green;
  display: none;
}
.tipYellow {
  color: rgb(184, 134, 11);
  display: block;
}
.tipNum {
  color: white;
}
.button {
    background-color: white;
    border: none;
    margin: 4px 2px;
}
`);

    async function check() {
        let checkerContainer = document.createElement('div');
        checkerContainer.id = 'checkerContainer';
        tr.$titleNode.after(checkerContainer);

        let checkerDiv = document.createElement('div');
        checkerDiv.id = 'checkerDiv';
        document.getElementById('checkerContainer').appendChild(checkerDiv);
        let tipRed = 0, tipGreen = 0, tipYellow = 0, tipAll = 0, tipInfo = [];

        // 检查规则
        // 1 Music检测
        if(tr.type == 'Music') {
            let valid = true;
            // 1.1 Music类资源标题检查
            // 1.1.1 标题必须以[]分割各部分
            if(!tr.fields) {
                valid = false;
                tipRed += 1;
                tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.1.1 标题必须以[]分割各部分 【严重错误，取消后续检查】"});
            }
            else {
                tipGreen += 1;
                console.log("检查通过：1.1.1 标题必须以[]分割各部分");
            }
            tipAll += 1;

            // 1.1.2 标题至少包括Hi-Res/EAC/XLD/WEB标签、发售日期、专辑类型、专辑名、文件类型共5部分，Hi-Res还应包括音质，共6部分
            if(valid) {
                if(tr.fields[0].match(/^\[Hi\-Res\]$/i)) {
                    if(tr.fields.length < 6) {
                        valid = false;
                        tipRed += 1;
                        tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.1.2 标题至少包括Hi-Res/EAC/XLD/WEB标签、发售日期、专辑类型、专辑名、文件类型共5部分，Hi-Res还应包括音质，共6部分 【严重错误，取消后续检查】"});
                    }
                    else {
                        tipGreen += 1;
                        console.log("检查通过：1.1.2 标题至少包括Hi-Res/EAC/XLD/WEB标签、发售日期、专辑类型、专辑名、文件类型共5部分，Hi-Res还应包括音质，共6部分");
                    }
                }
                else {
                    if(tr.fields.length < 5) {
                        valid = false;
                        tipRed += 1;
                        tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.1.2 标题至少包括Hi-Res/EAC/XLD/WEB标签、发售日期、专辑类型、专辑名、文件类型共5部分，Hi-Res还应包括音质，共6部分 【严重错误，取消后续检查】"});
                    }
                    else {
                        tipGreen += 1;
                        console.log("检查通过：1.1.2 标题至少包括Hi-Res/EAC/XLD/WEB标签、发售日期、专辑类型、专辑名、文件类型共5部分，Hi-Res还应包括音质，共6部分");
                    }
                }
                tipAll += 1;
            }

            if(valid) {
                // 1.1.3 第一个标签必须为EAC XLD WEB 或 Hi-Res
                if(tr.fields[0].match(/^\[(EAC|XLD|WEB|Hi\-Res)\]$/i)) {
                    tipGreen += 1;
                    console.log("检查通过：1.1.3 第一个标签必须为EAC XLD WEB 或 Hi-Res");
                }
                else {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.1.3 第一个标签不为EAC XLD WEB 或 Hi-Res"});
                }
                tipAll += 1;

                // 1.1.4 EAC/XLD第二个标签必须为发售日期（6位数字）或合集，WEB/Hi-Res第二个标签必须为发售日期（6位数字）
                if(tr.fields[0].match(/^\[(EAC|XLD)\]$/i)) {
                    if( (tr.fields.length>=2) && ( (tr.fields[1] == '[合集]') || tr.fields[1].match(/\[\d{6}\]/g) ) ) {
                        tipGreen += 1;
                        console.log("检查通过：1.1.4 EAC/XLD第二个标签必须为发售日期（6位数字）或合集，WEB/Hi-Res第二个标签必须为发售日期（6位数字）");
                    }
                    else {
                        tipRed += 1;
                        tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.1.4 EAC/XLD第二个标签必须为发售日期（6位数字）或合集，WEB/Hi-Res第二个标签必须为发售日期（6位数字）【严重错误，后续检查可能有误】"});
                    }
                }
                else if(tr.fields[0].match(/^\[(WEB|Hi\-Res)\]$/i)) {
                    if( (tr.fields.length>=2) && tr.fields[1].match(/\[\d{6}\]/g) ) {
                        tipGreen += 1;
                        console.log("检查通过：1.1.4 EAC/XLD第二个标签必须为发售日期（6位数字）或合集，WEB/Hi-Res第二个标签必须为发售日期（6位数字）");
                    }
                    else {
                        tipRed += 1;
                        tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.1.4 EAC/XLD第二个标签必须为发售日期（6位数字）或合集，WEB/Hi-Res第二个标签必须为发售日期（6位数字）【严重错误，后续检查可能有误】"});
                    }
                }
                tipAll += 1;


                // 1.1.5 EAC/XLD合集，最后一个标签必须为专辑数量
                if(tr.fields[0].match(/^\[(EAC|XLD)\]$/i)) {
                    if( (tr.fields.length>=2) && (tr.fields[1] == '[合集]') ) {
                        if(tr.fields[tr.fields.length-1].match(/\[\d+张\]/g)) {
                            tipGreen += 1;
                            console.log("检查通过：1.1.5 EAC/XLD合集，最后一个标签必须为专辑数量");
                        }
                        else {
                            tipRed += 1;
                            tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.1.5 EAC/XLD合集，最后一个标签必须为专辑数量"});
                        }
                        tipAll += 1;
                    }
                }

                // 1.1.6 非合集的第三个标签必须为专辑类型，同人专辑必须写明所在展会届数
                if(tr.fields[1] != '[合集]') {
                    if(tr.subTitle.indexOf('同人') == -1) {
                        if( (tr.fields.length>=3) && tr.fields[2].match(/\[(OST|ALBUM|SINGLE|DRAMA)\]/g)) {
                            tipGreen += 1;
                            console.log("检查通过：1.1.6 非合集的第三个标签必须为专辑类型，同人专辑必须写明所在展会届数");
                        }
                        else {
                            tipYellow += 1;
                            tipInfo.push({ class:'tipYellow', color: 'yellow', info: "警告: 1.1.6 非合集的第三个标签必须为专辑类型，同人专辑必须写明所在展会届数"});
                        }
                    }
                    else {
                        if( (tr.fields.length>=3) && tr.fields[2].match(/\d+/g)) {
                            tipGreen += 1;
                            console.log("检查通过：1.1.6 非合集的第三个标签必须为专辑类型，同人专辑必须写明所在展会届数");
                        }
                        else {
                            tipYellow += 1;
                            tipInfo.push({ class:'tipYellow', color: 'yellow', info: "警告: 1.1.6 非合集的第三个标签必须为专辑类型，同人专辑必须写明所在展会届数"});
                        }
                    }
                    tipAll += 1;
                }

                // 1.1.7 专辑名中若有一些常见的用日文片假名表示的英语单词，需使用英语词汇表示
                if( (tr.fields.length>=5) && tr.fields[4].match(/(アレンジ|アルバム|アナログ|ブックレット|ブック|カード|キャラクター|コレクター|コミック|デバイス|ドラマ|エピソード|イラスト|イラストレーション|ジャケット|レーベル|ポスト|オーケストラ|オリジナル|ロンド|サウンドトラック|スペシャル|ショート|ショートエピソード)/g)) {
                    tipYellow += 1;
                    tipInfo.push({ class:'tipYellow', color: 'yellow', info: "警告: 1.1.7 专辑名中若有一些常见的用日文片假名表示的英语单词，需使用英语词汇表示"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过：1.1.7 专辑名中若有一些常见的用日文片假名表示的英语单词，需使用英语词汇表示");
                }
                tipAll += 1;

                // 1.1.8 Hi-Res倒数第二个标签应为音质，包含bit和khz的信息
                if(tr.fields[0].match(/^\[Hi\-Res\]$/i)) {
                    if( (tr.fields.length>=2) && tr.fields[tr.fields.length-2].match(/\d+\s*bit/gi) && tr.fields[tr.fields.length-2].match(/\d+(\.\d+)?\s*khz/gi)) {
                        tipGreen += 1;
                        console.log("检查通过：1.1.8 Hi-Res倒数第二个标签应为音质，包含bit和khz的信息");
                    }
                    else {
                        tipRed += 1;
                        tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.1.8 Hi-Res倒数第二个标签应为音质，包含bit和khz的信息"});
                    }
                    tipAll += 1;
                }

                // 1.1.9 最后一个标签应当为文件类型，包含所有文件类型
                let status = true;
                for(let i = 0; i < tr.filelist.length; i++) {
                    let extension_list = tr.filelist[i].match(/\.\w+?$/)
                    if(extension_list) {
                        let extension = extension_list[0].substring(1);
                        //let extRe = new RegExp("(\\[|\\+)\\s*log\\s*(\\+|\\])", "i");
                        let extRe = new RegExp("(\\[|\\+)\\s*" + extension + "\\s*(\\+|\\])", "i");
                        if(!tr.fields[tr.fields.length-1].match(extRe)) {
                            status = false;
                        }
                    }
                    else {
                        status = false;
                    }
                }
                if(status) {
                    tipGreen += 1;
                    console.log("检查通过：1.1.9 最后一个标签应当为文件类型，包含所有文件类型");
                }
                else {
                    tipYellow += 1;
                    tipInfo.push({ class:'tipYellow', color: 'yellow', info: "警告: 1.1.9 最后一个标签应当为文件类型，包含所有文件类型"});
                }
                tipAll += 1;
            }

            if(valid) {
                // 1.2 Music类别资源一般检查
                /*// 1.2.1 副标题中必须存在'转自' '自抓' '自购' '转载'之一
                if(!tr.subTitle.match(/转自|自抓|自购|转载/g)) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.2.1 副标题中必须存在'转自' '自抓' '自购' '转载'之一"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过：1.2.1 副标题中必须存在'转自' '自抓' '自购' '转载'之一");
                }
                tipAll += 1;*/

                // 1.2.2 由EAC/XLD抓取的专辑，2007年以后发行的，除合集外，文件中必须有.log扩展名的文件
                if(tr.fields[0].match(/^\[(EAC|XLD)\]$/i) && ( (tr.fields.length < 2) || (tr.fields[1] != '[合集]') ) ) {
                    let status = false;
                    let year = 7;
                    if(tr.fields.length >= 2) {
                        let year_list = tr.fields[1].match(/\d+/g);
                        if(year_list) {
                            let year = year_list[0];
                        }
                    }
                    if( (year < 50) && (year > 6) ) {
                        for(let i = 0; i < tr.filelist.length; i++) {
                            let file = tr.filelist[i];
                            if(file.match(/\.log$/i)) {
                                status = true;
                            }
                        }
                    }
                    if(!status) {
                        tipRed += 1;
                        tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.2.2 由EAC/XLD抓取的专辑，2007年以后发行的，文件中必须有.log扩展名的文件"});
                    }
                    else {
                        tipGreen += 1;
                        console.log("检查通过：1.2.2 由EAC/XLD抓取的专辑，2007年以后发行的，文件中必须有.log扩展名的文件");
                    }
                    tipAll += 1;
                }

                // 1.2.3 不接受任何形式的有损压缩格式，包括mp3 wma aac aa3 ogg
                let status = true;
                for(let i = 0; i < tr.filelist.length; i++) {
                    let file = tr.filelist[i];
                    if(file.match(/\.(mp3|wma|aac|aa3|ogg)$/i)) {
                        status = false;
                        break;
                    }
                }
                if(!status) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.2.3 不接受任何形式的有损压缩格式，包括mp3 wma aac aa3 ogg"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过：1.2.3 不接受任何形式的有损压缩格式，包括mp3 wma aac aa3 ogg");
                }
                tipAll += 1;

                // 1.2.4 由EAC/XLD抓取的专辑，需要设置光驱偏移。（通过检查描述中是否有offset关键字来判断）
                if(tr.fields[0].match(/^\[(EAC|XLD)\]$/i)) {
                    let status = false;
                    if(tr.descr.match(/offset/gi)) {
                        status = true;
                    }
                    if(!status) {
                        tipYellow += 1;
                        tipInfo.push({ class:'tipYellow', color: 'yellow', info: "警告: 1.2.4 由EAC/XLD抓取的专辑，需要设置光驱偏移。（描述中未检测到offset关键字）"});
                    }
                    else {
                        tipGreen += 1;
                        console.log("检查通过：1.2.4 由EAC/XLD抓取的专辑，需要设置光驱偏移。（通过检查描述中是否有offset关键字来判断）");
                    }
                    tipAll += 1;
                }

                // 1.2.5 建议音乐资源内有PNG、BMP、TIFF格式的扫图/封面
                status = false;
                for(let i = 0; i < tr.filelist.length; i++) {
                    let file = tr.filelist[i];
                    if(file.match(/\.(png|bmp|tiff)$/i)) {
                        status = true;
                        break;
                    }
                }
                if(!status) {
                    tipYellow += 1;
                    tipInfo.push({ class:'tipYellow', color: 'yellow', info: "警告: 1.2.5 音乐资源内没有有PNG、BMP、TIFF格式的扫图/封面"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过：1.2.5 建议音乐资源内有PNG、BMP、TIFF格式的扫图/封面");
                }
                tipAll += 1;

                // 1.2.6 除WEB和自购的Hi-Res外，建议音乐资源内提供CUE文件
                if( !tr.fields[0].match(/^\[WEB\]$/i) && ( !tr.fields[0].match(/^\[Hi\-Res\]$/i) || (tr.subTitle.indexOf('自购') == -1) ) ) {
                    status = false;
                    for(let i = 0; i < tr.filelist.length; i++) {
                        let file = tr.filelist[i];
                        if(file.match(/\.cue$/i)) {
                            status = true;
                            break;
                        }
                    }
                    if(!status) {
                        tipYellow += 1;
                        tipInfo.push({ class:'tipYellow', color: 'yellow', info: "警告: 1.2.6 非自购的Hi-Res，且音乐资源内没有提供CUE文件"});
                    }
                    else {
                        tipGreen += 1;
                        console.log("检查通过：1.2.6 除自购的Hi-Res外，建议音乐资源内提供CUE文件");
                    }
                    tipAll += 1;
                }

                // 1.2.7 若为压缩包形式（rar zip 7z），要求列出压缩包内文件列表（通过检查描述中是否有'filename'或'文件名'关键字来判断）
                status = false;
                for(let i = 0; i < tr.filelist.length; i++) {
                    let file = tr.filelist[i];
                    if(file.match(/\.(zip|rar|7z)/i)) {
                        status = true;
                        break;
                    }
                }
                if(status) {
                    if(tr.descr.match(/(filename|文件名)/gi)) {
                        tipGreen += 1;
                        console.log("检查通过：1.2.7 若为压缩包形式（rar zip 7z），要求列出压缩包内文件列表（通过检查描述中是否有'filename'或'文件名'关键字来判断）");
                    }
                    else {
                        tipRed += 1;
                        tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.2.7 若为压缩包形式（rar zip 7z），要求列出压缩包内文件列表（描述中未检测到'filename'或'文件名'关键字）"});
                    }
                    tipAll += 1;
                }

                // 1.3 音乐资源介绍格式检查
                // 1.3.1 应包含封面图片
                if(tr.$imgs) {
                    tipGreen += 1;
                    console.log("检查通过：1.3.1 应包含封面图片");
                }
                else {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.3.1 应包含封面图片"});
                }
                tipAll += 1;

                // 1.3.2 应包含介绍内容
                if(tr.descr) {
                    tipGreen += 1;
                    console.log("检查通过：1.3.2 应包含介绍内容");
                }
                else {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 1.3.2 应包含介绍内容"});
                }
                tipAll += 1;
            }
        }
        /* 2 Comic & 3 Light Novel */
        else if( (tr.type == 'Comic') || (tr.type == 'Light Novel') ) {
            /* 2.1 标题检查 */
            // 2.1.1 标题必须以[]分割各部分
            let valid = true;
            if(!tr.fields) {
                valid = false;
                tipRed += 1;
                tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.1.1 标题必须以[]分割各部分 【严重错误，后续检查可能有错误】"});
            }
            else {
                tipGreen += 1;
                console.log("检查通过：2.1.1 标题必须以[]分割各部分");
            }
            tipAll += 1;

            // 2.1.2 标题至少包含名称、作者、卷数三部分
            if(valid) {
                if(tr.fields.length < 3) {
                    valid = false;
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.1.2 标题至少包含名称、作者、卷数三部分"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过：2.1.2 标题至少包含名称、作者、卷数三部分");
                }
                tipAll += 1;
            }

            // 2.1.3 标题最后一个标签应该标明卷数
            if(tr.fields && tr.fields[tr.fields.length-1].match(/(((Vol|chap)\.\d+(\s*\-\s*(Vol|chap)\.\d+)?)|(全(\d|零|一|二|三|四|五|六|七|八|九|十|百|千)+(卷|话))|(\d+(\s*\-\s*\d+)?(卷|话))|(chap\s*\d+(\s*\-\s*\d+)?))/i)) {
                tipGreen += 1;
                console.log("检查通过：2.1.3 标题最后一个标签应该标明卷数");
            }
            else {
                tipRed += 1;
                tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.1.3 标题最后一个标签应该标明卷数"});
            }
            tipAll += 1;

            /* 2.2 副标题检查 */
            // 2.2.1 副标题建议以|分割各部分
            if(tr.subTitle.split('|').length <= 1) {
                tipYellow += 1;
                tipInfo.push({ class:'tipYellow', color: 'yellow', info: "警告: 2.2.1 副标题建议以|分割各部分"});
            }
            else {
                tipGreen += 1;
                console.log("检查通过：2.2.1 副标题建议以|分割各部分");
            }
            tipAll += 1;

            // 2.2.3 副标题建议标明完结、未完、连载
            if(tr.subTitle.match(/完结|未完|连载|完結|連載/g)) {
                tipGreen += 1;
                console.log("检查通过：2.2.3 副标题建议标明完结、未完、连载");
            }
            else {
                tipYellow += 1;
                tipInfo.push({ class:'tipYellow', color: 'yellow', info: "警告: 2.2.3 副标题建议标明完结、未完、连载"});
            }
            tipAll += 1;

            if(tr.type == 'Comic') {
                // 2.2.4 副标题建议标明出版社/汉化组
                let status = false;
                for(let i = 0; i < publishers.length; i++) {
                    let pubRe = new RegExp(publishers[i], "i");
                    if(tr.subTitle.match(pubRe)) {
                        status = true;
                        break;
                    }
                }
                if(status) {
                    tipGreen += 1;
                    console.log("检查通过：2.2.4 副标题建议标明出版社/汉化组");
                }
                else {
                    tipYellow += 1;
                    tipInfo.push({ class:'tipYellow', color: 'yellow', info: "警告: 2.2.4 副标题建议标明出版社/汉化组"});
                }
                tipAll += 1;


                // 2.3 漫画的图片文件以卷为单位形成压缩包，压缩包格式为rar、cbr、zip、cbz之一（检测文件名应都符合***Vol.xx**.zip格式)
                status = true;
                for(let i = 0; i < tr.filelist.length; i++) {
                    let file = tr.filelist[i];
                    if(!file.match(/(((Vol|chap)(_|\.| )?\d+)|(\d+(话|卷|_|\.))).*(zip|rar|cbz|cbr)$/i)) {
                        if(!file.match(/^(\d+|最终|番外|附录|附件).*(zip|rar|cbz|cbr)$/i)) {
                            status = false;
                            break;
                        }
                    }
                }
                if(status) {
                    tipGreen += 1;
                    console.log("检查通过：2.3 图片文件以卷为单位形成压缩包，压缩包格式为rar、cbr、zip、cbz之一（检测文件名应都符合***Vol.xx**.zip格式)");
                }
                else {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.3 图片文件以卷为单位形成压缩包，压缩包格式为rar、cbr、zip、cbz之一（检测文件名应都符合***Vol.xx**.zip格式)"});
                }
                tipAll += 1;
            }
            else {
                // 2.4 轻小说不能为txt格式
                let status = true;
                for(let i = 0; i < tr.filelist.length; i++) {
                    let file = tr.filelist[i];
                    if(file.match(/\.txt$/i)) {
                        status = false;
                        break;
                    }
                }
                if(status) {
                    tipGreen += 1;
                    console.log("检查通过：2.4 轻小说不能为txt格式");
                }
                else {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.4 轻小说不能为txt格式"});
                }
                tipAll += 1;
            }

            // 2.4 介绍格式检查
            // 2.4.1 至少包含一张图片, 如果副标题或介绍中检测到扫图、自购关键词，则要求至少两张
            if(!tr.$imgs) {
                tipRed += 1;
                tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.4.1 至少包含一张图片, 如果副标题或介绍中检测到扫图、自购关键词，则要求至少两张"});
            }
            else if((tr.subTitle+tr.descr).match(/自购|自購|扫图/g)) {
                if(tr.$imgs.length < 2) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.4.1 至少包含一张图片, 如果副标题或介绍中检测到扫图、自购关键词，则要求至少两张"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过：2.4.1 至少包含一张图片, 如果副标题或介绍中检测到扫图、自购关键词，则要求至少两张");
                }
            }
            else {
                if(tr.$imgs.length < 1) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 2.4.1 至少包含一张图片, 如果副标题或介绍中检测到扫图、自购关键词，则要求至少两张"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过：2.4.1 至少包含一张图片, 如果副标题或介绍中检测到扫图、自购关键词，则要求至少两张");
                }
            }
            tipAll += 1;
        }
        // 5 Game
        else if(tr.type == 'Game') {
            /* 3.1 标题检查 */
            // 3.1.1 标题必须以[]分割各部分
            let valid = true;
            if(!tr.fields) {
                valid = false;
                tipRed += 1;
                tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 3.1.1 标题必须以[]分割各部分 【严重错误，后续检查可能有错误】"});
            }
            else {
                tipGreen += 1;
                console.log("检查通过：3.1.1 标题必须以[]分割各部分");
            }
            tipAll += 1;

            // 3.1.2 标题至少包含原名和开发公司两部分
            if(valid) {
                if(tr.fields.length < 2) {
                    valid = false;
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 3.1.2 标题至少包含原名和开发公司两部分"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过：3.1.2 标题至少包含原名和开发公司两部分");
                }
                tipAll += 1;
            }
        }
        // 4 CG
        else if(tr.type == 'CG') {
            /* 4.1 标题检查 */
            // 4.1.1 标题必须以[]分割各部分
            let valid = true;
            if(!tr.fields) {
                valid = false;
                tipRed += 1;
                tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 4.1.1 标题必须以[]分割各部分 【严重错误，后续检查可能有错误】"});
            }
            else {
                tipGreen += 1;
                console.log("检查通过：4.1.1 标题必须以[]分割各部分");
            }
            tipAll += 1;

            // 4.1.2 标题至少包含名字和作者/出版社两部分
            if(valid) {
                if(tr.fields.length < 2) {
                    valid = false;
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: "错误: 4.1.2 标题至少包含名字和作者/出版社两部分"});
                }
                else {
                    tipGreen += 1;
                    console.log("检查通过：4.1.2 标题至少包含名字和作者/出版社两部分");
                }
                tipAll += 1;
            }
        }

        // 统计数字点击事件
        function clickRed() {
            let redArr = document.getElementsByClassName('tipRed');
            for (let i = 0; i < redArr.length; i++) {
                if (redArr[i].style.display == 'none') {
                    redArr[i].style.display = 'block';
                } else {
                    redArr[i].style.display = 'none';
                }
            }
        }

        function clickYellow() {
            let yellowArr = document.getElementsByClassName('tipYellow');
            for (let i = 0; i < yellowArr.length; i++) {
                if (yellowArr[i].style.display == 'none') {
                    yellowArr[i].style.display = 'block';
                } else {
                    yellowArr[i].style.display = 'none';
                }
            }
        }

/*        function clickGreen() {
            let greenArr = document.getElementsByClassName('tipGreen');
            for (let i = 0; i < greenArr.length; i++) {
                if (greenArr[i].style.display == 'block') {
                    greenArr[i].style.display = 'none';
                } else {
                    greenArr[i].style.display = 'block';
                }
            }
        }*/

        // 统计数字
        if(tipRed) {
            checkerContainer.innerHTML = '<div id="checkerClick"><h1 class="tipNum">检查结果：<font color="red">错误</font></h1></div>';
            checkerContainer.style.border = 'red';
        }
        else if(tipYellow) {
            checkerContainer.innerHTML = '<div id="checkerClick"><h1 class="tipNum">检查结果：<font color="yellow">警告</font></h1></div>';
            checkerContainer.style.border = 'yellow';
        }
        else {
            checkerContainer.innerHTML = '<div id="checkerClick"><h1 class="tipNum">检查结果：<font color="green">通过</font></h1></div>';
            checkerContainer.style.border = 'green';
        }
        let checkerNum = document.createElement('div');
        checkerNum.id = 'checkerNum';
        document.getElementById('checkerClick').appendChild(checkerNum);
        var checkLog = '<h1 class="tipNum">总计: <span style="color:blue;">' + tipAll +
            '</span> &nbsp; <span id="clickRed" style="cursor:pointer;">错误: <span style="color:red;">' + tipRed +
            '</span></span> &nbsp; <span id="clickYellow" style="cursor:pointer;">警告: <span style="color:yellow;">' + tipYellow +
            '</span></span> &nbsp; <span id="clickGreen" style="cursor:pointer;">通过: <span style="color:green;">' + tipGreen + '</span></span></h1>';
        for(let i = 0; i < tipInfo.length; i++) {
            checkLog += '<h1 class="' + tipInfo[i].class + '"><font  color="' + tipInfo[i].color + '">' + tipInfo[i].info + '</font></h1>';
        }
        checkerNum.innerHTML = checkLog;
        document.getElementById('clickRed').onclick = clickRed;
        document.getElementById('clickYellow').onclick = clickYellow;
        //document.getElementById('clickGreen').onclick = clickGreen;
        if(tr.searchTable) {
            $(checkerContainer).after(tr.searchTable);
            tr.searchTable.after($('<br>'));
        }
    }

    async function checkGo() {
        if(!noVerified || tr.status.length) {
            await waitInfoLoad();
            await check();
        }
    }
    checkGo();

})();