// ==UserScript==
// @name         繁簡自由切換(馴碼)
// @name:zh-CN   简繁自由切换(馴碼)
// @name:ja      简繁
// @name:en      Switch Traditional Chinese and Simplified Chinese
// @namespace    hoothin
// @version      2.0.1
// @description        任意轉換網頁中的簡體中文與繁體中文（默認簡體→繁體）
// @description:zh-CN  任意转换网页中的简体中文与繁体中文（默认繁体→简体）
// @description:ja     简繁中国語に変換
// @description:en     Just Switch Traditional Chinese and Simplified Chinese
// @author       hoothin
// @include      *
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=rixixi@sina.com&item_name=Greasy+Fork+donation
// @contributionAmount 1
// @downloadURL https://update.greasyfork.org/scripts/428018/%E7%B9%81%E7%B0%A1%E8%87%AA%E7%94%B1%E5%88%87%E6%8F%9B%28%E9%A6%B4%E7%A2%BC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428018/%E7%B9%81%E7%B0%A1%E8%87%AA%E7%94%B1%E5%88%87%E6%8F%9B%28%E9%A6%B4%E7%A2%BC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var auto=true;//是否自動切換至OS使用的默認語言
    var shortcutKey=119;//快捷鍵keyCode
    var lang = navigator.appName=="Netscape"?navigator.language:navigator.userLanguage;
    lang = lang.toLowerCase();
    var isSimple = (lang === "zh-cn" || lang === "zh-hans" || lang === "zh-sg" || lang === "zh-my");
    var action = 0;//1:noChange, 2:showSimplified, 3:showTraditional

    function stranText(txt){
        if(!txt)return "";
        if(action == 2){return simplized(txt);}
        else if(action == 3){return traditionalized(txt);}
    }

    function stranBody(pNode){
        var childs;
        if(pNode){
            childs=pNode.childNodes;
        }else{
            childs=document.documentElement.childNodes;
        }
        if(childs)
            for(var i=0;i<childs.length;i++){
                var child=childs.item(i);
                if(/BR|META|SCRIPT|HR|TEXTAREA/.test(child.tagName))continue;
                if(child.title){
                    let title=stranText(child.title);
                    if(child.title != title){
                        child.title=title;
                    }
                }
                if(child.alt){
                    let alt=stranText(child.alt);
                    if(child.alt != alt){
                        child.alt=alt;
                    }
                }
                if(child.tagName == "INPUT" && child.value !== "" && child.type != "text" && child.type != "search" && child.type != "hidden"){
                    let value=stranText(child.value);
                    if(child.value != value){
                        child.value=value;
                    }
                }else if(child.nodeType == 3){
                    let data=stranText(child.data);
                    if(child.data != data){
                        child.data=data;
                    }
                }else stranBody(child);
            }
    }

    var scStr='幺内匀戹呋户戸紥卋叺册悤巵戼敂丢亘氷卐咤姹曵汚纟伫兑别删刧呑吴呐吕囱壮夹妆挵歨歩毎决没灾秃见讠贝车坂并亚来仑崘儿两协呪姗届冈巗戋擡抺抛拕抝于昻昬东锨殁况争状珉珏籼纠芈羗卧虬轧钅长门䌶侣俣伣侠伡兖刭则刹劲却厍呙埯奂尸帅彦后恒斵旣暎旾昰栢桞栅杮汹烱为爲㻏粃纪纣约红纡纥纨纫苎订讣计贞贠负轨军钆钇闩韦韮页风飞饣伥俩俫仓个们伦㑈寃浄冻刬刚剥员呗吣喞娱孙宫屃岘岛峡师库弪径耻悦猂悮捝挟哵揑时晋书气浃凃湼泾渉涚乌狭狈亩皐疱盇眞纹纳纽纾纯纰纼纱纮纸级纷纭纴纺胁脇脉衇刍兹荆觃讯讧讨讦讱训讪讫讬记岂财贡轪轩轫郏钌钊钉钋针闪陉陕阵饤马斗閗㑔干伟㐽侧侦伪剐动务匦区叁参问哑唖启唡囵国垭执坣坚垩够娄妇娅宼将专屉崃岗峥岽巣帐带张强从徕惥慂怅慽戞挱扪扫抡㧏挜挣挂勑败叙敍斩昼杆楳栀条枭棃棁弃杀氢凉泪渌净沦滛渊涞浅烃牵狰现产毕异眦众䌷细绂绁绅纻绍绀绋绐绌终组䌹绊统鉢钵习胫唇脱庄茎荚苋处术衮规覔觅讹讶讼䜣诀讷讻访设许贫货贩贪贯责轭软迳这连壄钓钐钏钒钗钍钕钎闫闬闭阴陈陆顶顷饦鱼鸟麦㑇㚯䌺䌻㐷杰伧伞俻备凯剀创勋胜劳愽㖞唤丧乔单単哟围垴埚尧报场塲壶娲妫嬀寻岚帧帏几厕厠厢厩复闷恵恶恼恽恻惬嘅拣挿扬敭换掲挥㧑晳棊枨枣栋㭎栈栖梾桠钦欵残壳殻氩涣减沨涡测浑凑浈汤沩潙无煑犹琹珐画畲痉发盗硁硖砗砚税秆牕笔笋栰筞绗结絶绝绞络绚给绒绖丝绛肃胀肾胨华苌莱着虚视觇诉诃诊诂诋讵诈诒诏评诐诇诎诅词咏贮贳贰贵贬买贷贶费贴贻贸贺贲轷轸轱轴轵轺轲轶进邮郓乡䥺钯钫钘钭钠钝钤钣钑钞钮钧钙钬钛钪开闶闳闰闲间闵阳陧队阶云韧项顺顸须饨饪饫饬饭饮驭冯黄㤘乱偬传伛债伤倾偻仅佥势汇滙呛啬唝吗呜獋唢园圆块茔垲埘坞埙壸奥媪妈巯厦弑爱怆恺忾栗愠损揺摇捣揾抢晕晖煗旸会杨枫桢檝业极岁歳毁准沟温浉遡涢沧灭炼炜烟茕焕烦炀㶽爷狲犸狮珲玮玚当痹疴痖盏睁睐睾矴禄䅉棱禀枧笕䇲节粤绦绢绑绡绠绨绤绥䌼经羣羟义圣脶脑肿脚肠膓万莴蕚叶荭荮苇荤虏号蛱蜕蚬袅补装里诩询诣试诗诧诟诡诠诘话该详诜诙诖诔诛诓夸诚赀赂赁贿赅资贾贼迹轼较辂辁辀载轾农运过达违邹邬郧铌铈钶铃钴钹铍钰钚钸铀钿钾钜铊铉铇铋铂钷钳铆铅钺钩钲钼钽铳闸陨隽电顼颂颀颃预顽颁顿饴飤饲饱饰饳驮驰驯鱽凫鳬鸠黾皷䦶侨仆侥偾划勚匮厌懕哔叹喽呕啧尝唛图团尘堑垫寿梦伙奁夺妪嫰寝实宁对屡㟥嵝崭岖㡎帼帻币庼彻悫慤态惨惭慙恸惯怄悭戗戬掴掼搂抠抟掺畅杩栄荣榅桤构枪杠殒氲涤荥沪滞渗卤浒浐滚満满渔溇沤汉涟渍潄涨溆渐煴荧炝煕尔荦狱琐瑶玛玱疯疡痪疟皲尽监硕砀砜旤祸祯祎种称窝洼椾笺筝综緑绿绸绻绶维绹绾纲网缀䌽纶绺绮绽绰绫緜绵绲缁紧绯绪绱罚罸闻髈腽与莳涖莅苍荪盖蚀觋认诳诶诱诮语诫诬误诰诵诲説说赈赊宾赇赶赵輙辄挽辅轻辢遥逊递远铏铰铒铬铪银铜铚铣铨铢铭铫铦衔衘铑铷铱铟铵铥铕铯铐铞铖锍阂阁阀闺闽际韨颇领飐飑飒饺饸饼饷饵驲驳肮鱾鸤凤鸣鸢么麽斉齐㟆䌿䌾䞍䦷鲃价価仪侬亿侩俭凛剧刘刽刿剑㓥劢厉哗唠啸叽哓呒啴嘘咝喷坠堕坟妩娴婳娆婵娇审写宽层嵚崂峤峣帜厨厮庙厂庑废广弹征悳怂虑庆忧㤭怜愦惮愤悯怃挚捞挦撑挠挢掸拨抚扑揿搇敌数暂梿椠椁桨桩乐楽枞楼标枢㭤样欧殇殴毵牦浆颍泼溌洁㴋潜润浔溃滗涠浇涝涧热颎奖莹琏瘗疮癍皑皱盘确码䂵硙祃穷窑窰箧缍绬缃缄缂线缉缎缔缗缘缌编缓缅纬缑缈练缏缇駡骂罢翚腘肤䏝胶莲苁莼荜蒌蒋葱茑荫猬虾虱蜗卫冲裈襃緥袆觍诞谁课谇诽谊訚调谄谆谈诿请诤诹诼谅论谂谀诸竖竪猪赒赉赐赏赔赓贤卖売贱赋赕质账赌践辆辎辉辋辍辊辇辈轮辌适迁邓郑邻郸腌鋭锐销锑锉铝锒锌钡铤铗锋铻锊锓铘锄锃锔锇铓铺锆锂铽阃阆闾阅靓巩颌颉颏养饹饻饽馁饿馂饾馀驻驽驹驵驾骀驸驶駞驼驷闹鲀鲁鲂鱿䴓鸩鸨鸦麸歯齿傧俦侪侭幂剂哒哝哕嗳哙吨墙垦坛垱奋嫱嫒学导峄峃崄岙廪惫凭憇宪忆怿懔战戯挞挝捡拥掳择挡撡㧟担据晔昙晓桪树桦椫桡桥机椭横历歴㱮殚渑沢泽滪浍㳠浊浓炽烨灯炖烧烫焖独狯猃玑瓯瘆疭瘘卢眍䁖瞒砖碜碛䅟稣积頴颖窎窭窥筑筼笃筛萦缙缢缒绉缣缊缞缚缜缟缛县䓨翺腻饍兴舱荨蒇荞荬芸莸荛蒉荡芜萧芗蛳蚂萤绔袴裤觎亲谍谞谝诨谔谛谐谏谕谘讳谙谌讽谚谖诺谋谒谓谑猫䞐赖頼赗赪踊辑辏输辐办迟选遗辽邺郐锯钢锞录録锖锫锩铔锥锕锟锱铮锛锬锭锜钱锦锠锡锢错锰铼锝锪钔锗阊阉阎阏阍阈阌阇随险静䩄腼颐头颒颊颋颕颔颈頽颓频馄馃饯馅馆骈骇骃骆鲄鲆鲌鲉鲏鲐鲍鲋鲊鸰鸵鸳鸲鸮鸱鸪鸯鸭龙亀龟㨫䜧偿优储励咛吓哜嚔压嬷嫔婴尴尶屦嵘岭屿帮幇帱弥恳应応㤽恹戏戱击挤拟摈拧搁敛毙暧檩柽档桧槚检樯艢栉殓毡涩泶湿泞溁浕济済涛滥潍浜滨营灿烛烩㶶狝狞㺍获瑷珰环疗痨痫瘅瞆矫矶粦硗䃅硚禅穂筚箦篓糁粪粇缝缡缩纵缧䌸缦絷缕缥总绩緐绷缫缪耧联聪声耸胆脍脓脸临举擧艰蓣蕰荟蓟蔷荙莶荐亏䗖蝼螀蛰蟇蝈螨裢褛亵觊觏誊诌谎谜谧谡谤谦谥讲谢謡谣赚赙购赛趋跄辗舆辒毂辖辕迈还丑酝醖锤锚锴锳锅镀锷铡钖煅锻锽锸锲锘鍫锹锾键锶锺镁锿镅镃阒闱阔阕阑隐隶虽韩颗飓糇饧馇骎骏骋骍鲒鲘鲕䲟鲖鲔鲛鲑鲜鲓鸸鸹鸻䴕鸿鸽䴔鸺鸼点鼋斋斎龀䙌䦂丛噜啮垒圹婶彞怼懑掷扩撷摆擞撸㧰扰摅撵断梼槟柠㭴槛柜欤归殡溅泺滤滢涜渎㲿泻渖浏潴烬焘猎犷瓮疠疖睑础礼秾穑秽窜窍箪简篑簮箫粮缯织缮缭绕綉绣缋翘耢聩聂职脐膑旧萨䓕䓓荠蓝荩虮蝉蛲虫裥袯觐觞谟谪谬讴谨谩丰䝙赜贽赘跸蹒踪躯辘转辙迩邝医酱厘镑镕锁镉镈钨蓥镏铠锼镐镇镒镍镓镎阗阘闿阖阙闯双雏杂鸡离霡韪题頟额颚颜颙颛飔飏馉馎饩馏馊馌骓骔骒骑骐阋魉鲪鳘鲝鲧鲠鲩鲤鲨鲬鲫鹀鹃鹆鹁鹈騀鵞鹅鹄龁厐厣呖咙垆坏垄垅坜宠巄庐惩懒怀拢旷昿橹艪榈椟橼栎橱櫉槠橥㱩氇濒泸沥潇潆泷濑烁牍犊兽獭玺琼畴瘪碍礴祢祷稳穏筜签帘绳绘茧缳缲缴䍁绎罗罴腊舣艺药薬薮䓖蛏蚁蝇虿袄裣裆觑觯证谲讥谮识谯谭谱豮赟赠赞跷轿辚辞边酦铩镞镟链镆镙镠镝铿锵镗镘镛铲镜镖镂錾镚镪关陇难雾韬韫韵愿颡颠类飖飕馍馒馐馑骛骗骙䯄鲻鲯鲭鮝鲞鲷鲴鲱鲵鲲鲳鲸鲮鲰鮎鲇鲶鲺鹉鹌鹏鹐鹎鹊鹓鹍䴖鸫鹑鹒丽龂庞㗷䀥劝亸喾严嘤宝寳悬忏拦撄搀昽胧栌枥榇蘖栊潋澜炉献猕珑痒矿砺砾矾稆穞窦竞篮筹继缤缱䍀罂聍胪舰苈蔼蔺萚蕲芦苏蕴苹茏蛴蝾蚝褴觉触谵译议赡赢跶趸辫释铧镤䥽锈铙铴镣铹镦镡钟镫镢镨䦅锎锏镄䦃阚阓阐颟飃飘馓馈馔饥饶骞骘骝腾驺骚骟鳀鳊鳈鲗鳂䲠鲽鳇䲡鳅鲾鳆鳃鹋鹙鹕鹗鹖鹛鹜䴗鷀鹚咸党龅龃龆龄䶮㧐䎬䲝俪㑩傩啭嗫嚣属岿惧慑撺携擕摄斓榉桜樱栏歼沣滠烂牺貛璎疬癞眬砻䉤粝缬纩续缠藓蔹兰蜡蛎袜䙓览谴护诪誉赆贜赃赑踌跻跃轰辩镌镰镯镭铁镮铎铛镱阛闼鞒响颢顾飗飙飚飨骡蓦骜骖骠骢駈驱髅鳒鳑鳋鲥鳏䲢鳎鳐鳍鳁鸧莺鹟鹤鹠鹡鹘鹣鹢鹞䴘鹝鹾赍龇龈鳚傥俨冁呓啰娈孪峦巅巓弯攅攒摊权欢洒滩猡叠曡癣瘿瘾箓箨籁笼籴听聋舻蟏衬袭觌谫读谉赎赝踯跞踬蹰跹辔轹酂郦铸镬镔鉴鍳镲霁繮缰鞑颤骅骕骁骣骄脏鲢鳌鳓鲦鲣鲹鳗鳛鳔鳉鳙鳕鳖鹧鹥鸥鸷鹨鼹龊龉龚龛㘎䥾恋挛搅晒椤栾瓒痈窃缨纤臜蓠萝蛊变詟䜩雠轳逻逦锧镴铄镳镥靥颥显餍验惊驿体鲅鳟鱓鳝鳜鳞鲟鸶鹪鹔鹩鹫鹇鹬黪齑䍠嘱坝揽灏漤㳕瘫癫簖羁覊艳蚕谗让谰谶贑赣酿雳霭叇灵颦骤髌鬓魇鲼鲎鲙鳣鳡鳢鹰鹭鸴䴙鹯硷碱盐龋腭龌厅榄湾笾篱箩粜缵脔蛮观蹑蹿衅镧钥镵镶叆颅馋髋鲿鲚鳠鹱鹲黉鼍滦瞩趱躜酾镊镩鞯驴骥阄黡缆谠谳躏酽锣钻銮颞颧骧骦鳄鲈鸬黩䯅戆棂艶凿镋鹴鹦骊鹳骉鲡鹂鸾滟馕';
    var tcStr='么內勻厄夫戶戶扎世以冊匆卮卯叩丟亙冰卍吒奼曳污糹佇兌別刪劫吞吳吶呂囪壯夾妝弄步步每決沒災禿見訁貝車阪並亞來侖侖兒兩協咒姍屆岡岩戔抬抹拋拖拗於昂昏東杴歿況爭狀玟玨秈糾羋羌臥虯軋釒長門䊷侶俁俔俠俥兗剄則剎勁卻厙咼垵奐屍帥彥後恆斫既映春是柏柳柵柿洶炯為為玲秕紀紂約紅紆紇紈紉苧訂訃計貞貟負軌軍釓釔閂韋韭頁風飛飠倀倆倈倉個們倫倲冤凈凍剗剛剝員唄唚唧娛孫宮屓峴島峽師庫弳徑恥悅悍悞挩挾捌捏時晉書氣浹涂涅涇涉涗烏狹狽畝皋皰盍真紋納紐紓純紕紖紗紘紙級紛紜紝紡脅脅脈脈芻茲荊覎訊訌討訐訒訓訕訖託記豈財貢軑軒軔郟釕釗釘釙針閃陘陝陣飣馬鬥鬥㑯乾偉偑側偵偽剮動務匭區參參問啞啞啟啢圇國埡執堂堅堊夠婁婦婭寇將專屜崍崗崢崬巢帳帶張強從徠恿恿悵戚戛挲捫掃掄掆掗掙掛敕敗敘敘斬晝桿梅梔條梟梨梲棄殺氫涼淚淥淨淪淫淵淶淺烴牽猙現產畢異眥眾紬細紱紲紳紵紹紺紼紿絀終組絅絆統缽缽習脛脣脫莊莖莢莧處術袞規覓覓訛訝訟訢訣訥訩訪設許貧貨販貪貫責軛軟逕這連野釣釤釧釩釵釷釹釺閆閈閉陰陳陸頂頃飥魚鳥麥㑳㜄䋙䋚傌傑傖傘備備凱剴創勛勝勞博喎喚喪喬單單喲圍堖堝堯報場場壺媧媯媯尋嵐幀幃幾廁廁廂廄復悶惠惡惱惲惻愜慨揀插揚揚換揭揮撝晰棋棖棗棟棡棧棲棶椏欽款殘殼殼氬渙減渢渦測渾湊湞湯溈溈無煮猶琴琺畫畬痙發盜硜硤硨硯稅稈窗筆筍筏策絎結絕絕絞絡絢給絨絰絲絳肅脹腎腖華萇萊著虛視覘訴訶診詁詆詎詐詒詔評詖詗詘詛詞詠貯貰貳貴貶買貸貺費貼貽貿賀賁軤軫軲軸軹軺軻軼進郵鄆鄉釾鈀鈁鈃鈄鈉鈍鈐鈑鈒鈔鈕鈞鈣鈥鈦鈧開閌閎閏閑間閔陽隉隊階雲韌項順頇須飩飪飫飭飯飲馭馮黃㥮亂傯傳傴債傷傾僂僅僉勢匯匯嗆嗇嗊嗎嗚嗥嗩園圓塊塋塏塒塢塤壼奧媼媽巰廈弒愛愴愷愾慄慍損搖搖搗搵搶暈暉暖暘會楊楓楨楫業極歲歲毀準溝溫溮溯溳滄滅煉煒煙煢煥煩煬煱爺猻獁獅琿瑋瑒當痺痾瘂盞睜睞睪碇祿稏稜稟筧筧筴節粵絛絹綁綃綆綈綌綏綐經群羥義聖腡腦腫腳腸腸萬萵萼葉葒葤葦葷虜號蛺蛻蜆裊補裝里詡詢詣試詩詫詬詭詮詰話該詳詵詼詿誄誅誆誇誠貲賂賃賄賅資賈賊跡軾較輅輇輈載輊農運過達違鄒鄔鄖鈮鈰鈳鈴鈷鈸鈹鈺鈽鈽鈾鈿鉀鉅鉈鉉鉋鉍鉑鉕鉗鉚鉛鉞鉤鉦鉬鉭銃閘隕雋電頊頌頎頏預頑頒頓飴飼飼飽飾飿馱馳馴魛鳧鳧鳩黽鼓䦛僑僕僥僨劃勩匱厭厭嗶嘆嘍嘔嘖嘗嘜圖團塵塹墊壽夢夥奩奪嫗嫩寢實寧對屢嵾嶁嶄嶇幓幗幘幣廎徹愨愨態慘慚慚慟慣慪慳戧戩摑摜摟摳摶摻暢榪榮榮榲榿構槍槓殞氳滌滎滬滯滲滷滸滻滾滿滿漁漊漚漢漣漬漱漲漵漸熅熒熗熙爾犖獄瑣瑤瑪瑲瘋瘍瘓瘧皸盡監碩碭碸禍禍禎禕種稱窩窪箋箋箏綜綠綠綢綣綬維綯綰綱網綴綵綸綹綺綻綽綾綿綿緄緇緊緋緒緔罰罰聞膀膃與蒔蒞蒞蒼蓀蓋蝕覡認誑誒誘誚語誡誣誤誥誦誨說說賑賒賓賕趕趙輒輒輓輔輕辣遙遜遞遠鉶鉸鉺鉻鉿銀銅銍銑銓銖銘銚銛銜銜銠銣銥銦銨銩銪銫銬銱鋮鋶閡閣閥閨閩際韍頗領颭颮颯餃餄餅餉餌馹駁骯魢鳲鳳鳴鳶麼麼齊齊㠏䋹䋻䝼䦟䰾價價儀儂億儈儉凜劇劉劊劌劍劏勱厲嘩嘮嘯嘰嘵嘸嘽噓噝噴墜墮墳嫵嫻嫿嬈嬋嬌審寫寬層嶔嶗嶠嶢幟廚廝廟廠廡廢廣彈徵德慫慮慶憂憍憐憒憚憤憫憮摯撈撏撐撓撟撣撥撫撲撳撳敵數暫槤槧槨槳樁樂樂樅樓標樞樢樣歐殤毆毿氂漿潁潑潑潔潚潛潤潯潰潷潿澆澇澗熱熲獎瑩璉瘞瘡瘢皚皺盤確碼碽磑禡窮窯窯篋綞緓緗緘緙線緝緞締緡緣緦編緩緬緯緱緲練緶緹罵罵罷翬膕膚膞膠蓮蓯蓴蓽蔞蔣蔥蔦蔭蝟蝦蝨蝸衛衝褌褒褓褘覥誕誰課誶誹誼誾調諂諄談諉請諍諏諑諒論諗諛諸豎豎豬賙賚賜賞賠賡賢賣賣賤賦賧質賬賭踐輛輜輝輞輟輥輦輩輪輬適遷鄧鄭鄰鄲醃銳銳銷銻銼鋁鋃鋅鋇鋌鋏鋒鋙鋝鋟鋣鋤鋥鋦鋨鋩鋪鋯鋰鋱閫閬閭閱靚鞏頜頡頦養餎餏餑餒餓餕餖餘駐駑駒駔駕駘駙駛駝駝駟鬧魨魯魴魷鳾鴆鴇鴉麩齒齒儐儔儕儘冪劑噠噥噦噯噲噸墻墾壇壋奮嬙嬡學導嶧嶨嶮嶴廩憊憑憩憲憶懌懍戰戱撻撾撿擁擄擇擋操擓擔據曄曇曉樳樹樺樿橈橋機橢橫歷歷殨殫澠澤澤澦澮澾濁濃熾燁燈燉燒燙燜獨獪獫璣甌瘮瘲瘺盧瞘瞜瞞磚磣磧穇穌積穎穎窵窶窺築篔篤篩縈縉縊縋縐縑縕縗縛縝縞縟縣罃翱膩膳興艙蕁蕆蕎蕒蕓蕕蕘蕢蕩蕪蕭薌螄螞螢褲褲褲覦親諜諝諞諢諤諦諧諫諭諮諱諳諶諷諺諼諾謀謁謂謔貓賰賴賴賵赬踴輯輳輸輻辦遲選遺遼鄴鄶鋸鋼錁錄錄錆錇錈錏錐錒錕錙錚錛錟錠錡錢錦錩錫錮錯錳錸鍀鍃鍆鍺閶閹閻閼閽閾閿闍隨險靜靦靦頤頭頮頰頲頴頷頸頹頹頻餛餜餞餡館駢駭駰駱魺鮃鮊鮋鮍鮐鮑鮒鮓鴒鴕鴛鴝鴞鴟鴣鴦鴨龍龜龜㩜䜀償優儲勵嚀嚇嚌嚏壓嬤嬪嬰尷尷屨嶸嶺嶼幫幫幬彌懇應應懤懨戲戲擊擠擬擯擰擱斂斃曖檁檉檔檜檟檢檣檣櫛殮氈澀澩濕濘濚濜濟濟濤濫濰濱濱營燦燭燴燶獮獰獱獲璦璫環療癆癇癉瞶矯磯磷磽磾礄禪穗篳簀簍糝糞糠縫縭縮縱縲縳縵縶縷縹總績繁繃繅繆耬聯聰聲聳膽膾膿臉臨舉舉艱蕷薀薈薊薔薘薟薦虧螮螻螿蟄蟆蟈蟎褳褸褻覬覯謄謅謊謎謐謖謗謙謚講謝謠謠賺賻購賽趨蹌輾輿轀轂轄轅邁還醜醞醞錘錨鍇鍈鍋鍍鍔鍘鍚鍛鍛鍠鍤鍥鍩鍬鍬鍰鍵鍶鍾鎂鎄鎇鎡闃闈闊闋闌隱隸雖韓顆颶餱餳餷駸駿騁騂鮚鮜鮞鮣鮦鮪鮫鮭鮮鮳鴯鴰鴴鴷鴻鴿鵁鵂鵃點黿齋齋齔䙡䥇叢嚕嚙壘壙嬸彝懟懣擲擴擷擺擻擼擽擾攄攆斷檮檳檸檻檻櫃歟歸殯濺濼濾瀅瀆瀆瀇瀉瀋瀏瀦燼燾獵獷甕癘癤瞼礎禮穠穡穢竄竅簞簡簣簪簫糧繒織繕繚繞繡繡繢翹耮聵聶職臍臏舊薩薳薵薺藍藎蟣蟬蟯蟲襉襏覲觴謨謫謬謳謹謾豐貙賾贄贅蹕蹣蹤軀轆轉轍邇鄺醫醬釐鎊鎔鎖鎘鎛鎢鎣鎦鎧鎪鎬鎮鎰鎳鎵鎿闐闒闓闔闕闖雙雛雜雞離霢韙題額額顎顏顒顓颸颺餶餺餼餾餿饁騅騌騍騎騏鬩魎鮶鮸鮺鯀鯁鯇鯉鯊鯒鯽鵐鵑鵒鵓鵜鵝鵝鵝鵠齕龎厴嚦嚨壚壞壟壠壢寵巃廬懲懶懷攏曠曠櫓櫓櫚櫝櫞櫟櫥櫥櫧櫫殰氌瀕瀘瀝瀟瀠瀧瀨爍牘犢獸獺璽瓊疇癟礙礡禰禱穩穩簹簽簾繩繪繭繯繰繳繸繹羅羆臘艤藝藥藥藪藭蟶蟻蠅蠆襖襝襠覷觶證譎譏譖識譙譚譜豶贇贈贊蹺轎轔辭邊醱鎩鏃鏇鏈鏌鏍鏐鏑鏗鏘鏜鏝鏞鏟鏡鏢鏤鏨鏰鏹關隴難霧韜韞韻願顙顛類颻颼饃饅饈饉騖騙騤騧鯔鯕鯖鯗鯗鯛鯝鯡鯢鯤鯧鯨鯪鯫鯰鯰鯰鯴鵡鵪鵬鵮鵯鵲鵷鵾鶄鶇鶉鶊麗齗龐㘔䁻勸嚲嚳嚴嚶寶寶懸懺攔攖攙曨朧櫨櫪櫬櫱櫳瀲瀾爐獻獼瓏癢礦礪礫礬穭穭竇競籃籌繼繽繾繿罌聹臚艦藶藹藺蘀蘄蘆蘇蘊蘋蘢蠐蠑蠔襤覺觸譫譯議贍贏躂躉辮釋鏵鏷鏺鏽鐃鐋鐐鐒鐓鐔鐘鐙鐝鐠鐥鐦鐧鐨鐯闞闠闡顢飄飄饊饋饌饑饒騫騭騮騰騶騷騸鯷鯿鰁鰂鰃鰆鰈鰉鰌鰍鰏鰒鰓鶓鶖鶘鶚鶡鶥鶩鶪鶿鶿鹹黨齙齟齠齡龑㩳䎱䱽儷儸儺囀囁囂屬巋懼懾攛攜攜攝斕櫸櫻櫻欄殲灃灄爛犧獾瓔癧癩矓礱籔糲纈纊續纏蘚蘞蘭蠟蠣襪襬覽譴護譸譽贐贓贓贔躊躋躍轟辯鐫鐮鐲鐳鐵鐶鐸鐺鐿闤闥鞽響顥顧飀飆飈饗騾驀驁驂驃驄驅驅髏鰜鰟鰠鰣鰥鰧鰨鰩鰭鰮鶬鶯鶲鶴鶹鶺鶻鶼鷁鷂鷈鷊鹺齎齜齦䲁儻儼囅囈囉孌孿巒巔巔彎攢攢攤權歡灑灘玀疊疊癬癭癮籙籜籟籠糴聽聾艫蠨襯襲覿譾讀讅贖贗躑躒躓躕躚轡轢酇酈鑄鑊鑌鑒鑒鑔霽韁韁韃顫驊驌驍驏驕髒鰱鰲鰳鰷鰹鰺鰻鰼鰾鱂鱅鱈鱉鷓鷖鷗鷙鷚鼴齪齬龔龕㘚䥱戀攣攪曬欏欒瓚癰竊纓纖臢蘺蘿蠱變讋讌讎轤邏邐鑕鑞鑠鑣鑥靨顬顯饜驗驚驛體鱍鱒鱔鱔鱖鱗鱘鷥鷦鷫鷯鷲鷳鷸黲齏䍦囑壩攬灝灠灡癱癲籪羈羈艷蠶讒讓讕讖贛贛釀靂靄靆靈顰驟髕鬢魘鱝鱟鱠鱣鱤鱧鷹鷺鷽鷿鸇鹼鹼鹽齲齶齷廳欖灣籩籬籮糶纘臠蠻觀躡躥釁鑭鑰鑱鑲靉顱饞髖鱨鱭鱯鸌鸏黌鼉灤矚趲躦釃鑷鑹韉驢驥鬮黶纜讜讞躪釅鑼鑽鑾顳顴驤驦鱷鱸鸕黷䯀戇欞豔鑿钂鸘鸚驪鸛驫鱺鸝鸞灩饢';

    function traditionalized(orgStr){
        var str='', index, char;
        for(var i=0;i<orgStr.length;i++){
            char=orgStr.charAt(i);
            if(char.charCodeAt(0) > 10000){
                index=scStr.indexOf(char);
                if(index != -1)str+=tcStr.charAt(index);
                else str+=char;
            }
            else str+=char;
        }
        return str;
    }

    function simplized(orgStr){
        var str='', index, char;
        for(var i=0;i<orgStr.length;i++){
            char=orgStr.charAt(i);
            if(char.charCodeAt(0) > 10000){
                index=tcStr.indexOf(char);
                if(index != -1)str+=scStr.charAt(index);
                else str+=char;
            }
            else str+=char;
        }
        return str;
    }

    function setLanguage(){
        GM_setValue("action_" + location.hostname.toString().replace(/\./g,"_"), action);
        switch(action){
            case 1:
                alert("已於該網域禁用簡繁切換");
                location.reload();
                break;
            case 2:
                alert("已切换至简体中文");
                break;
            case 3:
                alert("已切換至繁體中文");
                break;
        }
        if(action > 1){
            stranBody();
        }
    }

    function switchLanguage(){
        if(isSimple){
            action--;
            action=action<1?3:action;
        }else{
            action++;
            action=action>3?1:action;
        }
        setLanguage();
    }

    var saveAction=GM_getValue("action_" + location.hostname.toString().replace(/\./g,"_"));
    action=saveAction?saveAction:(isSimple?2:3);
    if(auto && action > 1){
        setTimeout(function(){
            stranBody();
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            var observer = new MutationObserver(function(records){
                records.map(function(record) {
                    if(record.addedNodes){
                        [].forEach.call(record.addedNodes,function(item){
                            stranBody(item);
                        });
                    }
                });
            });
            var option = {
                'childList': true,
                'subtree': true
            };
            observer.observe(document.body, option);
        },50);
    }

    var curLang=isSimple;
    document.addEventListener("keydown", function(e) {
        if(e.keyCode == shortcutKey && e.ctrlKey) {
            if("TEXTAREA"==document.activeElement.tagName){
                document.activeElement.innerHTML=curLang?traditionalized(document.activeElement.innerHTML):simplized(document.activeElement.innerHTML);
                curLang=!curLang;
            }else if("INPUT"==document.activeElement.tagName){
                document.activeElement.value=curLang?traditionalized(document.activeElement.value):simplized(document.activeElement.value);
                curLang=!curLang;
            }else{
                action=action==2?3:2;
                setLanguage();
            }
        }
    });

    GM_registerMenuCommand("繁簡切換【Ctrl+F8】", switchLanguage);
})();