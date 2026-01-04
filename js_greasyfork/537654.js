// ==UserScript==
// @name         Kanji Counter
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Displays statistics of known kanji on JPDB's wall of kanji page
// @author       Sacus
// @match        https://jpdb.io/labs/wall-of-kanji
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537654/Kanji%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/537654/Kanji%20Counter.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

(function () {
	'use strict';

	// Dictionary mapping kanji to their grade level
	const jouyou = {"一": "1","右": "1","雨": "1","円": "1","王": "1","音": "1","下": "1","火": "1","花": "1","貝": "1","学": "1","気": "1","九": "1","休": "1","玉": "1","金": "1","空": "1","月": "1","犬": "1","見": "1","五": "1","口": "1","校": "1","左": "1","三": "1","山": "1","子": "1","四": "1","糸": "1","字": "1","耳": "1","七": "1","車": "1","手": "1","十": "1","出": "1","女": "1","小": "1","上": "1","森": "1","人": "1","水": "1","正": "1","生": "1","青": "1","夕": "1","石": "1","赤": "1","千": "1","川": "1","先": "1","早": "1","草": "1","足": "1","村": "1","大": "1","男": "1","竹": "1","中": "1","虫": "1","町": "1","天": "1","田": "1","土": "1","二": "1","日": "1","入": "1","年": "1","白": "1","八": "1","百": "1","文": "1","木": "1","本": "1","名": "1","目": "1","立": "1","力": "1","林": "1","六": "1","引": "2","羽": "2","雲": "2","園": "2","遠": "2","何": "2","科": "2","夏": "2","家": "2","歌": "2","画": "2","回": "2","会": "2","海": "2","絵": "2","外": "2","角": "2","楽": "2","活": "2","間": "2","丸": "2","岩": "2","顔": "2","汽": "2","記": "2","帰": "2","弓": "2","牛": "2","魚": "2","京": "2","強": "2","教": "2","近": "2","兄": "2","形": "2","計": "2","元": "2","言": "2","原": "2","戸": "2","古": "2","午": "2","後": "2","語": "2","工": "2","公": "2","広": "2","交": "2","光": "2","考": "2","行": "2","高": "2","黄": "2","合": "2","谷": "2","国": "2","黒": "2","今": "2","才": "2","細": "2","作": "2","算": "2","止": "2","市": "2","矢": "2","姉": "2","思": "2","紙": "2","寺": "2","自": "2","時": "2","室": "2","社": "2","弱": "2","首": "2","秋": "2","週": "2","春": "2","書": "2","少": "2","場": "2","色": "2","食": "2","心": "2","新": "2","親": "2","図": "2","数": "2","西": "2","声": "2","星": "2","晴": "2","切": "2","雪": "2","船": "2","線": "2","前": "2","組": "2","走": "2","多": "2","太": "2","体": "2","台": "2","地": "2","池": "2","知": "2","茶": "2","昼": "2","長": "2","鳥": "2","朝": "2","直": "2","通": "2","弟": "2","店": "2","点": "2","電": "2","刀": "2","冬": "2","当": "2","東": "2","答": "2","頭": "2","同": "2","道": "2","読": "2","内": "2","南": "2","肉": "2","馬": "2","売": "2","買": "2","麦": "2","半": "2","番": "2","父": "2","風": "2","分": "2","聞": "2","米": "2","歩": "2","母": "2","方": "2","北": "2","毎": "2","妹": "2","万": "2","明": "2","鳴": "2","毛": "2","門": "2","夜": "2","野": "2","友": "2","用": "2","曜": "2","来": "2","里": "2","理": "2","話": "2","悪": "3","安": "3","暗": "3","医": "3","委": "3","意": "3","育": "3","員": "3","院": "3","飲": "3","運": "3","泳": "3","駅": "3","央": "3","横": "3","屋": "3","温": "3","化": "3","荷": "3","界": "3","開": "3","階": "3","寒": "3","感": "3","漢": "3","館": "3","岸": "3","起": "3","期": "3","客": "3","究": "3","急": "3","級": "3","宮": "3","球": "3","去": "3","橋": "3","業": "3","曲": "3","局": "3","銀": "3","区": "3","苦": "3","具": "3","君": "3","係": "3","軽": "3","血": "3","決": "3","研": "3","県": "3","庫": "3","湖": "3","向": "3","幸": "3","港": "3","号": "3","根": "3","祭": "3","皿": "3","仕": "3","死": "3","使": "3","始": "3","指": "3","歯": "3","詩": "3","次": "3","事": "3","持": "3","式": "3","実": "3","写": "3","者": "3","主": "3","守": "3","取": "3","酒": "3","受": "3","州": "3","拾": "3","終": "3","習": "3","集": "3","住": "3","重": "3","宿": "3","所": "3","暑": "3","助": "3","昭": "3","消": "3","商": "3","章": "3","勝": "3","乗": "3","植": "3","申": "3","身": "3","神": "3","真": "3","深": "3","進": "3","世": "3","整": "3","昔": "3","全": "3","相": "3","送": "3","想": "3","息": "3","速": "3","族": "3","他": "3","打": "3","対": "3","待": "3","代": "3","第": "3","題": "3","炭": "3","短": "3","談": "3","着": "3","注": "3","柱": "3","丁": "3","帳": "3","調": "3","追": "3","定": "3","庭": "3","笛": "3","鉄": "3","転": "3","都": "3","度": "3","投": "3","豆": "3","島": "3","湯": "3","登": "3","等": "3","動": "3","童": "3","農": "3","波": "3","配": "3","倍": "3","箱": "3","畑": "3","発": "3","反": "3","坂": "3","板": "3","皮": "3","悲": "3","美": "3","鼻": "3","筆": "3","氷": "3","表": "3","秒": "3","病": "3","品": "3","負": "3","部": "3","服": "3","福": "3","物": "3","平": "3","返": "3","勉": "3","放": "3","味": "3","命": "3","面": "3","問": "3","役": "3","薬": "3","由": "3","油": "3","有": "3","遊": "3","予": "3","羊": "3","洋": "3","葉": "3","陽": "3","様": "3","落": "3","流": "3","旅": "3","両": "3","緑": "3","礼": "3","列": "3","練": "3","路": "3","和": "3","愛": "4","案": "4","以": "4","衣": "4","位": "4","茨 [5]": "4","印": "4","英": "4","栄": "4","媛": "4","塩": "4","岡": "4","億": "4","加": "4","果": "4","貨": "4","課": "4","芽": "4","賀": "4","改": "4","械": "4","害": "4","街": "4","各": "4","覚": "4","潟": "4","完": "4","官": "4","管": "4","関": "4","観": "4","願": "4","岐": "4","希": "4","季": "4","旗": "4","器": "4","機": "4","議": "4","求": "4","泣": "4","給": "4","挙": "4","漁": "4","共": "4","協": "4","鏡": "4","競": "4","極": "4","熊": "4","訓": "4","軍": "4","郡": "4","群": "4","径": "4","景": "4","芸": "4","欠": "4","結": "4","建": "4","健": "4","験": "4","固": "4","功": "4","好": "4","香": "4","候": "4","康": "4","佐": "4","差": "4","菜": "4","最": "4","埼": "4","材": "4","崎": "4","昨": "4","札": "4","刷": "4","察": "4","参": "4","産": "4","散": "4","残": "4","氏": "4","司": "4","試": "4","児": "4","治": "4","滋": "4","辞": "4","鹿": "4","失": "4","借": "4","種": "4","周": "4","祝": "4","順": "4","初": "4","松": "4","笑": "4","唱": "4","焼": "4","照": "4","城": "4","縄": "4","臣": "4","信": "4","井": "4","成": "4","省": "4","清": "4","静": "4","席": "4","積": "4","折": "4","節": "4","説": "4","浅": "4","戦": "4","選": "4","然": "4","争": "4","倉": "4","巣": "4","束": "4","側": "4","続": "4","卒": "4","孫": "4","帯": "4","隊": "4","達": "4","単": "4","置": "4","仲": "4","沖": "4","兆": "4","低": "4","底": "4","的": "4","典": "4","伝": "4","徒": "4","努": "4","灯": "4","働": "4","特": "4","徳": "4","栃 [5]": "4","奈": "4","梨": "4","熱": "4","念": "4","敗": "4","梅": "4","博": "4","阪": "4","飯": "4","飛": "4","必": "4","票": "4","標": "4","不": "4","夫": "4","付": "4","府": "4","阜": "4","富": "4","副": "4","兵": "4","別": "4","辺": "4","変": "4","便": "4","包": "4","法": "4","望": "4","牧": "4","末": "4","満": "4","未": "4","民": "4","無": "4","約": "4","勇": "4","要": "4","養": "4","浴": "4","利": "4","陸": "4","良": "4","料": "4","量": "4","輪": "4","類": "4","令": "4","冷": "4","例": "4","連": "4","老": "4","労": "4","録": "4","圧": "5","囲": "5","移": "5","因": "5","永": "5","営": "5","衛": "5","易": "5","益": "5","液": "5","演": "5","応": "5","往": "5","桜": "5","可": "5","仮": "5","価": "5","河": "5","過": "5","快": "5","解": "5","格": "5","確": "5","額": "5","刊": "5","幹": "5","慣": "5","眼": "5","紀": "5","基": "5","寄": "5","規": "5","喜": "5","技": "5","義": "5","逆": "5","久": "5","旧": "5","救": "5","居": "5","許": "5","境": "5","均": "5","禁": "5","句": "5","型": "5","経": "5","潔": "5","件": "5","険": "5","検": "5","限": "5","現": "5","減": "5","故": "5","個": "5","護": "5","効": "5","厚": "5","耕": "5","航": "5","鉱": "5","構": "5","興": "5","講": "5","告": "5","混": "5","査": "5","再": "5","災": "5","妻": "5","採": "5","際": "5","在": "5","財": "5","罪": "5","殺": "5","雑": "5","酸": "5","賛": "5","士": "5","支": "5","史": "5","志": "5","枝": "5","師": "5","資": "5","飼": "5","示": "5","似": "5","識": "5","質": "5","舎": "5","謝": "5","授": "5","修": "5","述": "5","術": "5","準": "5","序": "5","招": "5","証": "5","象": "5","賞": "5","条": "5","状": "5","常": "5","情": "5","織": "5","職": "5","制": "5","性": "5","政": "5","勢": "5","精": "5","製": "5","税": "5","責": "5","績": "5","接": "5","設": "5","絶": "5","祖": "5","素": "5","総": "5","造": "5","像": "5","増": "5","則": "5","測": "5","属": "5","率": "5","損": "5","貸": "5","態": "5","団": "5","断": "5","築": "5","貯": "5","張": "5","停": "5","提": "5","程": "5","適": "5","統": "5","堂": "5","銅": "5","導": "5","得": "5","毒": "5","独": "5","任": "5","燃": "5","能": "5","破": "5","犯": "5","判": "5","版": "5","比": "5","肥": "5","非": "5","費": "5","備": "5","評": "5","貧": "5","布": "5","婦": "5","武": "5","復": "5","複": "5","仏": "5","粉": "5","編": "5","弁": "5","保": "5","墓": "5","報": "5","豊": "5","防": "5","貿": "5","暴": "5","脈": "5","務": "5","夢": "5","迷": "5","綿": "5","輸": "5","余": "5","容": "5","略": "5","留": "5","領": "5","歴": "5","胃": "6","異": "6","遺": "6","域": "6","宇": "6","映": "6","延": "6","沿": "6","恩": "6","我": "6","灰": "6","拡": "6","革": "6","閣": "6","割": "6","株": "6","干": "6","巻": "6","看": "6","簡": "6","危": "6","机": "6","揮": "6","貴": "6","疑": "6","吸": "6","供": "6","胸": "6","郷": "6","勤": "6","筋": "6","系": "6","敬": "6","警": "6","劇": "6","激": "6","穴": "6","券": "6","絹": "6","権": "6","憲": "6","源": "6","厳": "6","己": "6","呼": "6","誤": "6","后": "6","孝": "6","皇": "6","紅": "6","降": "6","鋼": "6","刻": "6","穀": "6","骨": "6","困": "6","砂": "6","座": "6","済": "6","裁": "6","策": "6","冊": "6","蚕": "6","至": "6","私": "6","姿": "6","視": "6","詞": "6","誌": "6","磁": "6","射": "6","捨": "6","尺": "6","若": "6","樹": "6","収": "6","宗": "6","就": "6","衆": "6","従": "6","縦": "6","縮": "6","熟": "6","純": "6","処": "6","署": "6","諸": "6","除": "6","承": "6","将": "6","傷": "6","障": "6","蒸": "6","針": "6","仁": "6","垂": "6","推": "6","寸": "6","盛": "6","聖": "6","誠": "6","舌": "6","宣": "6","専": "6","泉": "6","洗": "6","染": "6","銭": "6","善": "6","奏": "6","窓": "6","創": "6","装": "6","層": "6","操": "6","蔵": "6","臓": "6","存": "6","尊": "6","退": "6","宅": "6","担": "6","探": "6","誕": "6","段": "6","暖": "6","値": "6","宙": "6","忠": "6","著": "6","庁": "6","頂": "6","腸": "6","潮": "6","賃": "6","痛": "6","敵": "6","展": "6","討": "6","党": "6","糖": "6","届": "6","難": "6","乳": "6","認": "6","納": "6","脳": "6","派": "6","拝": "6","背": "6","肺": "6","俳": "6","班": "6","晩": "6","否": "6","批": "6","秘": "6","俵": "6","腹": "6","奮": "6","並": "6","陛": "6","閉": "6","片": "6","補": "6","暮": "6","宝": "6","訪": "6","亡": "6","忘": "6","棒": "6","枚": "6","幕": "6","密": "6","盟": "6","模": "6","訳": "6","郵": "6","優": "6","預": "6","幼": "6","欲": "6","翌": "6","乱": "6","卵": "6","覧": "6","裏": "6","律": "6","臨": "6","朗": "6","論": "6","亜": "S","哀": "S","挨": "S","曖": "S","握": "S","扱": "S","宛": "S","嵐": "S","依": "S","威": "S","為": "S","畏": "S","尉": "S","萎": "S","偉": "S","椅": "S","彙": "S","違": "S","維": "S","慰": "S","緯": "S","壱": "S","逸": "S","芋": "S","咽": "S","姻": "S","淫 [7]": "S","陰": "S","隠": "S","韻": "S","唄": "S","鬱": "S","畝": "S","浦": "S","詠": "S","影": "S","鋭": "S","疫": "S","悦": "S","越": "S","謁": "S","閲": "S","炎": "S","怨": "S","宴": "S","援": "S","煙": "S","猿": "S","鉛": "S","縁": "S","艶": "S","汚": "S","凹": "S","押": "S","旺": "S","欧": "S","殴": "S","翁": "S","奥": "S","憶": "S","臆": "S","虞": "S","乙": "S","俺": "S","卸": "S","穏": "S","佳": "S","苛": "S","架": "S","華": "S","菓": "S","渦": "S","嫁": "S","暇": "S","禍": "S","靴": "S","寡": "S","箇": "S","稼": "S","蚊": "S","牙 [5]": "S","瓦": "S","雅": "S","餓": "S","介": "S","戒": "S","怪": "S","拐": "S","悔": "S","皆": "S","塊": "S","楷": "S","潰": "S","壊": "S","懐": "S","諧": "S","劾": "S","崖": "S","涯": "S","慨": "S","蓋": "S","該": "S","概": "S","骸": "S","垣": "S","柿": "S","核": "S","殻": "S","郭": "S","較": "S","隔": "S","獲": "S","嚇": "S","穫": "S","岳": "S","顎": "S","掛": "S","括": "S","喝": "S","渇": "S","葛 [7]": "S","滑": "S","褐": "S","轄": "S","且": "S","釜": "S","鎌": "S","刈": "S","甘": "S","汗": "S","缶": "S","肝": "S","冠": "S","陥": "S","乾": "S","勘": "S","患": "S","貫": "S","喚": "S","堪": "S","換": "S","敢": "S","棺": "S","款": "S","閑": "S","勧": "S","寛": "S","歓": "S","監": "S","緩": "S","憾": "S","還": "S","環": "S","韓 [5]": "S","艦": "S","鑑": "S","含": "S","玩": "S","頑": "S","企": "S","伎": "S","忌": "S","奇": "S","祈": "S","軌": "S","既": "S","飢": "S","鬼": "S","亀": "S","幾": "S","棋": "S","棄": "S","毀": "S","畿": "S","輝": "S","騎": "S","宜": "S","偽": "S","欺": "S","儀": "S","戯": "S","擬": "S","犠": "S","菊": "S","吉": "S","喫": "S","詰": "S","却": "S","脚": "S","虐": "S","及": "S","丘": "S","朽": "S","臼": "S","糾": "S","嗅": "S","窮": "S","巨": "S","拒": "S","拠": "S","虚": "S","距": "S","御": "S","凶": "S","叫": "S","狂": "S","享": "S","況": "S","峡": "S","挟": "S","狭": "S","恐": "S","恭": "S","脅": "S","矯": "S","響": "S","驚": "S","仰": "S","暁": "S","凝": "S","巾": "S","斤": "S","菌": "S","琴": "S","僅 [7]": "S","緊": "S","錦": "S","謹": "S","襟": "S","吟": "S","駆": "S","惧": "S","愚": "S","偶": "S","遇": "S","隅": "S","串": "S","屈": "S","掘": "S","窟": "S","繰": "S","勲": "S","薫": "S","刑": "S","茎": "S","契": "S","恵": "S","啓": "S","掲": "S","渓": "S","蛍": "S","傾": "S","携": "S","継": "S","詣": "S","慶": "S","憬": "S","稽": "S","憩": "S","鶏": "S","迎": "S","鯨": "S","隙": "S","撃": "S","桁": "S","傑": "S","肩": "S","倹": "S","兼": "S","剣": "S","拳": "S","軒": "S","圏": "S","堅": "S","嫌": "S","献": "S","遣": "S","賢": "S","謙": "S","鍵": "S","繭": "S","顕": "S","懸": "S","幻": "S","玄": "S","弦": "S","舷": "S","股": "S","虎": "S","孤": "S","弧": "S","枯": "S","雇": "S","誇": "S","鼓": "S","錮": "S","顧": "S","互": "S","呉": "S","娯": "S","悟": "S","碁": "S","勾": "S","孔": "S","巧": "S","甲": "S","江": "S","坑": "S","抗": "S","攻": "S","更": "S","拘": "S","肯": "S","侯": "S","恒": "S","洪": "S","荒": "S","郊": "S","貢": "S","控": "S","梗": "S","喉": "S","慌": "S","硬": "S","絞": "S","項": "S","溝": "S","綱": "S","酵": "S","稿": "S","衡": "S","購": "S","乞": "S","拷": "S","剛": "S","傲": "S","豪": "S","克": "S","酷": "S","獄": "S","駒": "S","込": "S","頃": "S","昆": "S","恨": "S","婚": "S","痕": "S","紺": "S","魂": "S","墾": "S","懇": "S","沙": "S","唆": "S","詐": "S","鎖": "S","挫": "S","采": "S","砕": "S","宰": "S","栽": "S","彩": "S","斎": "S","債": "S","催": "S","塞": "S","歳": "S","載": "S","剤": "S","削": "S","柵": "S","索": "S","酢": "S","搾": "S","錯": "S","咲": "S","刹": "S","拶": "S","撮": "S","擦": "S","桟": "S","惨": "S","傘": "S","斬": "S","暫": "S","旨": "S","伺": "S","刺": "S","祉": "S","肢": "S","施": "S","恣": "S","脂": "S","紫": "S","嗣": "S","雌": "S","摯": "S","賜": "S","諮": "S","侍": "S","慈": "S","餌 [8]": "S","璽": "S","軸": "S","𠮟 [5]": "S","疾": "S","執": "S","湿": "S","嫉": "S","漆": "S","芝": "S","赦": "S","斜": "S","煮": "S","遮": "S","邪": "S","蛇": "S","酌": "S","釈": "S","爵": "S","寂": "S","朱": "S","狩": "S","殊": "S","珠": "S","腫": "S","趣": "S","寿": "S","呪": "S","需": "S","儒": "S","囚": "S","舟": "S","秀": "S","臭": "S","袖": "S","羞": "S","愁": "S","酬": "S","醜": "S","蹴": "S","襲": "S","汁": "S","充": "S","柔": "S","渋": "S","銃": "S","獣": "S","叔": "S","淑": "S","粛": "S","塾": "S","俊": "S","瞬": "S","旬": "S","巡": "S","盾": "S","准": "S","殉": "S","循": "S","潤": "S","遵": "S","庶": "S","緒": "S","如": "S","叙": "S","徐": "S","升": "S","召": "S","匠": "S","床": "S","抄": "S","肖": "S","尚": "S","昇": "S","沼": "S","宵": "S","症": "S","祥": "S","称": "S","渉": "S","紹": "S","訟": "S","掌": "S","晶": "S","焦": "S","硝": "S","粧": "S","詔": "S","奨": "S","詳": "S","彰": "S","憧": "S","衝": "S","償": "S","礁": "S","鐘": "S","丈": "S","冗": "S","浄": "S","剰": "S","畳": "S","壌": "S","嬢": "S","錠": "S","譲": "S","醸": "S","拭": "S","殖": "S","飾": "S","触": "S","嘱": "S","辱": "S","尻": "S","伸": "S","芯": "S","辛": "S","侵": "S","津": "S","唇": "S","娠": "S","振": "S","浸": "S","紳": "S","診": "S","寝": "S","慎": "S","審": "S","震": "S","薪": "S","刃": "S","尽": "S","迅": "S","甚": "S","陣": "S","尋": "S","腎": "S","須": "S","吹": "S","炊": "S","帥": "S","粋": "S","衰": "S","酔": "S","遂": "S","睡": "S","穂": "S","随": "S","髄": "S","枢": "S","崇": "S","据": "S","杉": "S","裾": "S","瀬": "S","是": "S","姓": "S","征": "S","斉": "S","牲": "S","凄": "S","逝": "S","婿": "S","誓": "S","請": "S","醒": "S","斥": "S","析": "S","脊": "S","隻": "S","惜": "S","戚": "S","跡": "S","籍": "S","拙": "S","窃": "S","摂": "S","仙": "S","占": "S","扇": "S","栓": "S","旋": "S","煎 [7]": "S","羨": "S","腺": "S","詮 [7]": "S","践": "S","箋": "S","潜": "S","遷": "S","薦": "S","繊": "S","鮮": "S","禅": "S","漸": "S","膳": "S","繕": "S","狙": "S","阻": "S","租": "S","措": "S","粗": "S","疎": "S","訴": "S","塑": "S","遡 [8]": "S","礎": "S","双": "S","壮": "S","荘": "S","捜": "S","挿": "S","桑": "S","掃": "S","曹": "S","曽": "S","爽": "S","喪": "S","痩": "S","葬": "S","僧": "S","遭": "S","槽": "S","踪": "S","燥": "S","霜": "S","騒": "S","藻": "S","憎": "S","贈": "S","即": "S","促": "S","捉": "S","俗": "S","賊": "S","遜 [8]": "S","汰": "S","妥": "S","唾": "S","堕": "S","惰": "S","駄": "S","耐": "S","怠": "S","胎": "S","泰": "S","堆": "S","袋": "S","逮": "S","替": "S","滞": "S","戴": "S","滝": "S","択": "S","沢": "S","卓": "S","拓": "S","託": "S","濯": "S","諾": "S","濁": "S","但": "S","脱": "S","奪": "S","棚": "S","誰": "S","丹": "S","旦": "S","胆": "S","淡": "S","嘆": "S","端": "S","綻": "S","鍛": "S","弾": "S","壇": "S","恥": "S","致": "S","遅": "S","痴": "S","稚": "S","緻": "S","畜": "S","逐": "S","蓄": "S","秩": "S","窒": "S","嫡": "S","抽": "S","衷": "S","酎": "S","鋳": "S","駐": "S","弔": "S","挑": "S","彫": "S","眺": "S","釣": "S","貼": "S","超": "S","跳": "S","徴": "S","嘲 [7]": "S","澄": "S","聴": "S","懲": "S","勅": "S","捗 [7]": "S","沈": "S","珍": "S","朕": "S","陳": "S","鎮": "S","椎": "S","墜": "S","塚": "S","漬": "S","坪": "S","爪": "S","鶴": "S","呈": "S","廷": "S","抵": "S","邸": "S","亭": "S","貞": "S","帝": "S","訂": "S","逓": "S","偵": "S","堤": "S","艇": "S","締": "S","諦": "S","泥": "S","摘": "S","滴": "S","溺 [7]": "S","迭": "S","哲": "S","徹": "S","撤": "S","添": "S","塡 [7]": "S","殿": "S","斗": "S","吐": "S","妬": "S","途": "S","渡": "S","塗": "S","賭 [7]": "S","奴": "S","怒": "S","到": "S","逃": "S","倒": "S","凍": "S","唐": "S","桃": "S","透": "S","悼": "S","盗": "S","陶": "S","塔": "S","搭": "S","棟": "S","痘": "S","筒": "S","稲": "S","踏": "S","謄": "S","藤": "S","闘": "S","騰": "S","洞": "S","胴": "S","瞳": "S","峠": "S","匿": "S","督": "S","篤": "S","凸": "S","突": "S","屯": "S","豚": "S","頓": "S","貪": "S","鈍": "S","曇": "S","丼": "S","那": "S","謎 [8]": "S","鍋": "S","軟": "S","尼": "S","弐": "S","匂": "S","虹": "S","尿": "S","妊": "S","忍": "S","寧": "S","捻": "S","粘": "S","悩": "S","濃": "S","把": "S","覇": "S","婆": "S","罵": "S","杯": "S","排": "S","廃": "S","輩": "S","培": "S","陪": "S","媒": "S","賠": "S","伯": "S","拍": "S","泊": "S","迫": "S","剝 [7]": "S","舶": "S","薄": "S","漠": "S","縛": "S","爆": "S","箸 [7]": "S","肌": "S","鉢": "S","髪": "S","伐": "S","抜": "S","罰": "S","閥": "S","氾": "S","帆": "S","汎": "S","伴": "S","畔": "S","般": "S","販": "S","斑": "S","搬": "S","煩": "S","頒": "S","範": "S","繁": "S","藩": "S","蛮": "S","盤": "S","妃": "S","彼": "S","披": "S","卑": "S","疲": "S","被": "S","扉": "S","碑": "S","罷": "S","避": "S","尾": "S","眉": "S","微": "S","膝": "S","肘": "S","匹": "S","泌": "S","姫": "S","漂": "S","苗": "S","描": "S","猫": "S","浜": "S","賓": "S","頻": "S","敏": "S","瓶": "S","扶": "S","怖": "S","附": "S","訃": "S","赴": "S","浮": "S","符": "S","普": "S","腐": "S","敷": "S","膚": "S","賦": "S","譜": "S","侮": "S","舞": "S","封": "S","伏": "S","幅": "S","覆": "S","払": "S","沸": "S","紛": "S","雰": "S","噴": "S","墳": "S","憤": "S","丙": "S","併": "S","柄": "S","塀": "S","幣": "S","弊": "S","蔽 [7]": "S","餅 [8]": "S","壁": "S","璧": "S","癖": "S","蔑": "S","偏": "S","遍": "S","哺": "S","捕": "S","舗": "S","募": "S","慕": "S","簿": "S","芳": "S","邦": "S","奉": "S","抱": "S","泡": "S","胞": "S","俸": "S","倣": "S","峰": "S","砲": "S","崩": "S","蜂": "S","飽": "S","褒": "S","縫": "S","乏": "S","忙": "S","坊": "S","妨": "S","房": "S","肪": "S","某": "S","冒": "S","剖": "S","紡": "S","傍": "S","帽": "S","貌": "S","膨": "S","謀": "S","頰 [7]": "S","朴": "S","睦": "S","僕": "S","墨": "S","撲": "S","没": "S","勃": "S","堀": "S","奔": "S","翻": "S","凡": "S","盆": "S","麻": "S","摩": "S","磨": "S","魔": "S","昧": "S","埋": "S","膜": "S","枕": "S","又": "S","抹": "S","慢": "S","漫": "S","魅": "S","岬": "S","蜜": "S","妙": "S","眠": "S","矛": "S","霧": "S","娘": "S","冥": "S","銘": "S","滅": "S","免": "S","麺": "S","茂": "S","妄": "S","盲": "S","耗": "S","猛": "S","網": "S","黙": "S","紋": "S","冶": "S","弥": "S","厄": "S","躍": "S","闇": "S","喩": "S","愉": "S","諭": "S","癒": "S","唯": "S","幽": "S","悠": "S","湧": "S","猶": "S","裕": "S","雄": "S","誘": "S","憂": "S","融": "S","与": "S","誉": "S","妖": "S","庸": "S","揚": "S","揺": "S","溶": "S","腰": "S","瘍": "S","踊": "S","窯": "S","擁": "S","謡": "S","抑": "S","沃": "S","翼": "S","拉": "S","裸": "S","羅": "S","雷": "S","頼": "S","絡": "S","酪": "S","辣": "S","濫": "S","藍": "S","欄": "S","吏": "S","痢": "S","履": "S","璃": "S","離": "S","慄": "S","柳": "S","竜": "S","粒": "S","隆": "S","硫": "S","侶": "S","虜": "S","慮": "S","了": "S","涼": "S","猟": "S","陵": "S","僚": "S","寮": "S","療": "S","瞭": "S","糧": "S","厘": "S","倫": "S","隣": "S","瑠": "S","涙": "S","累": "S","塁": "S","励": "S","戻": "S","鈴": "S","零": "S","霊": "S","隷": "S","齢": "S","麗": "S","暦": "S","劣": "S","烈": "S","裂": "S","恋": "S","廉": "S","錬": "S","呂": "S","炉": "S","賂": "S","露": "S","弄": "S","郎": "S","浪": "S","廊": "S","楼": "S","漏": "S","籠": "S","麓": "S","賄": "S","脇": "S","惑": "S","枠": "S","湾": "S","腕": "S"};

 // Constants and configuration
 const GRADE_LEVELS = ["1", "2", "3", "4", "5", "6", "S"]; // S = Secondary school
 const NOT_JOUYOU = "Not jouyou";
 const TOTAL_KEY = "Total";
 const VIEW_MODES = {
     SEPARATE: 'separate',
     CUMULATIVE: 'cumulative'
 };
 let currentViewMode = VIEW_MODES.SEPARATE;

	// DOM elements
	const knownKanjiElements = document.querySelectorAll('.wall-of-kanji > div:not([style="background-color: #dd4444"])');

	// Find the header element to place our stats below
	let headerElement;
	for (const element of document.querySelectorAll('h5')) {
		if (element.textContent.includes('Wall of kanji')) {
			headerElement = element;
			break;
		}
	}

	// Initialize counters
	const learnedCount = Object.fromEntries([...GRADE_LEVELS, NOT_JOUYOU].map(level => [level, 0]));
	const totalCount = Object.fromEntries(GRADE_LEVELS.map(level => [level, 0]));
	const completionRatio = Object.fromEntries([...GRADE_LEVELS, TOTAL_KEY].map(level => [level, 0]));

	// Extract learned kanji from the page
	const learnedKanji = Array.from(knownKanjiElements, element => element.firstChild.textContent.trim());

	// Count total kanji by grade level
	Object.entries(jouyou).forEach(([kanji, level]) => {
		totalCount[level]++;
	});

	// Count learned kanji by grade level
	learnedKanji.forEach(kanji => {
		const level = jouyou[kanji];
		learnedCount[level || NOT_JOUYOU]++;
	});

	// Calculate completion ratio for each grade level
	Object.keys(learnedCount).forEach(key => {
		completionRatio[key] = totalCount[key] ? Math.round((learnedCount[key] / totalCount[key]) * 100) / 100 : 0;
	});

	// Calculate total jouyou kanji and overall completion ratio
	const totalJouyouKanji = Object.values(totalCount).reduce((sum, val) => sum + val, 0);
	completionRatio.Total = Math.round((learnedKanji.length - learnedCount[NOT_JOUYOU]) / totalJouyouKanji * 100) / 100;

	// Calculate cumulative counts and ratios
	const cumulativeLearnedCount = { ...learnedCount };
	const cumulativeCompletionRatio = { ...completionRatio };

	// Calculate cumulative values for each grade level
	for (let i = 1; i < GRADE_LEVELS.length; i++) {
		const currentGrade = GRADE_LEVELS[i];
		const previousGrade = GRADE_LEVELS[i - 1];
		cumulativeLearnedCount[currentGrade] += cumulativeLearnedCount[previousGrade];

		// Calculate the cumulative total count for this grade level
		let cumulativeTotalCount = 0;
		for (let j = 0; j <= i; j++) {
			cumulativeTotalCount += totalCount[GRADE_LEVELS[j]];
		}

		// Calculate the cumulative completion ratio
		cumulativeCompletionRatio[currentGrade] = cumulativeTotalCount ? 
			Math.round((cumulativeLearnedCount[currentGrade] / cumulativeTotalCount) * 100) / 100 : 0;
	}

	// Create stats display
	const statsDisplayStyles = {
		margin: '10px',
		fontSize: '1.2em',
		fontWeight: 'bold',
		padding: '0',
		borderRadius: '5px',
	};

	const statsDisplay = document.createElement('div');
	Object.assign(statsDisplay.style, statsDisplayStyles);

	// Format percentage with one decimal place
	const formatPercentage = (ratio) => (ratio * 100).toFixed(1);

	// Grade level display names
	const gradeNames = {
		"1": "First grade",
		"2": "Second grade",
		"3": "Third grade",
		"4": "Fourth grade",
		"5": "Fifth grade",
		"6": "Sixth grade",
		"S": "Secondary school",
		[NOT_JOUYOU]: "Non-Jouyou"
	};

	// Get the wall of kanji container and store original kanji elements
	const wallOfKanjiContainer = document.querySelector('.wall-of-kanji');
	const allKanjiElements = Array.from(wallOfKanjiContainer.children);

	// Map to store kanji elements by grade level
	const kanjiByGrade = Object.fromEntries([...GRADE_LEVELS, NOT_JOUYOU].map(level => [level, []]));

	// Categorize each kanji element by grade level
	allKanjiElements.forEach(element => {
		const kanji = element.firstChild?.textContent?.trim();
		if (kanji) {
			const level = jouyou[kanji] || NOT_JOUYOU;
			kanjiByGrade[level].push(element);
		}
	});

	// Track expanded state for each grade level in separate mode
	const expandedGrades = {};

	// Function to create table with expandable rows for separate mode
	const createTableWithFolders = (tableContainerElement, viewMode) => {
		const data = viewMode === VIEW_MODES.CUMULATIVE ? 
			{ counts: cumulativeLearnedCount, ratios: cumulativeCompletionRatio } : 
			{ counts: learnedCount, ratios: completionRatio };

		const table = document.createElement('table');
		table.style.cssText = 'width: 100%; border-collapse: collapse; margin-bottom: 10px;';

		// Create header
		const thead = document.createElement('thead');
		thead.innerHTML = `
			<tr>
				<th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Grade</th>
				<th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Count</th>
				<th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Percentage</th>
			</tr>
		`;
		table.appendChild(thead);

		const tbody = document.createElement('tbody');

		// Add rows for each grade level
		[...GRADE_LEVELS, NOT_JOUYOU].forEach(grade => {
			// Skip Non-Jouyou if count is 0
			if (grade === NOT_JOUYOU && data.counts[grade] === 0) return;

			const row = document.createElement('tr');
			row.dataset.grade = grade;

			// In separate mode, make rows clickable (except Total Jouyou)
			if (viewMode === VIEW_MODES.SEPARATE) {
				row.style.cursor = 'pointer';
				row.style.userSelect = 'none';
			}

			const isExpanded = expandedGrades[grade] || false;
			const arrow = viewMode === VIEW_MODES.SEPARATE ? (isExpanded ? '▼ ' : '▶ ') : '';

			row.innerHTML = `
				<td style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">${arrow}${gradeNames[grade]}</td>
				<td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${data.counts[grade]}</td>
				<td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${grade === NOT_JOUYOU ? '-' : formatPercentage(data.ratios[grade]) + '%'}</td>
			`;

			tbody.appendChild(row);

			// In separate mode, add click handler and kanji row if expanded
			if (viewMode === VIEW_MODES.SEPARATE) {
				row.addEventListener('click', () => {
					expandedGrades[grade] = !expandedGrades[grade];
					updateDisplay();
				});



				// If expanded, add a row with the kanji
				if (isExpanded && kanjiByGrade[grade].length > 0) {
					const kanjiRow = document.createElement('tr');
					kanjiRow.dataset.kanjiRow = grade;
					const kanjiCell = document.createElement('td');
					kanjiCell.colSpan = 3;
					kanjiCell.style.cssText = 'padding: 10px; border-bottom: 1px solid #ddd;';

					// Create a container for the kanji elements
					const kanjiContainer = document.createElement('div');
					kanjiContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 5px;';

					// Clone kanji elements to display in the table
					kanjiByGrade[grade].forEach(element => {
						const clone = element.cloneNode(true);
						kanjiContainer.appendChild(clone);
					});

					kanjiCell.appendChild(kanjiContainer);
					kanjiRow.appendChild(kanjiCell);
					tbody.appendChild(kanjiRow);
				}
			}
		});

		// Add total row (only for grade levels, not Non-Jouyou)
		const totalRow = document.createElement('tr');
		totalRow.style.fontWeight = 'bold';
		totalRow.innerHTML = `
			<td style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Total Jouyou</td>
			<td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${learnedKanji.length - learnedCount[NOT_JOUYOU]}</td>
			<td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${formatPercentage(completionRatio.Total)}%</td>
		`;
		tbody.appendChild(totalRow);

		table.appendChild(tbody);

		// Clear container and add table
		tableContainerElement.replaceChildren(table);
	};

	// Create tab-like view mode toggle
	const createViewToggle = () => {
		const tabContainer = document.createElement('div');
		tabContainer.style.marginBottom = '0';
		tabContainer.style.display = 'flex';

		// Style for the tab container
		tabContainer.style.borderBottom = '1px solid #ccc';
		tabContainer.style.width = '100%';

		const createTab = (text, mode) => {
			const tab = document.createElement('div');
			tab.textContent = text;
			tab.style.padding = '8px 15px';
			tab.style.cursor = 'pointer';
			tab.style.borderTopLeftRadius = '5px';
			tab.style.borderTopRightRadius = '5px';
			tab.style.marginRight = '2px';

			// Set initial tab styles based on active state
			if (currentViewMode === mode) {
				tab.style.borderTop = '1px solid #ccc';
				tab.style.borderLeft = '1px solid #ccc';
				tab.style.borderRight = '1px solid #ccc';
				tab.style.borderBottom = '1px solid #fff';
				tab.style.marginBottom = '-1px';
				tab.style.fontWeight = 'bold';
			} else {
				tab.style.border = '1px solid #ccc';
				tab.style.borderBottom = '1px solid #ccc';
			}

			tab.addEventListener('click', () => {
				if (currentViewMode !== mode) {
					currentViewMode = mode;
					updateDisplay();
				}
			});

			return tab;
		};

		const separateTab = createTab('Separate', VIEW_MODES.SEPARATE);
		const cumulativeTab = createTab('Cumulative', VIEW_MODES.CUMULATIVE);

		tabContainer.appendChild(separateTab);
		tabContainer.appendChild(cumulativeTab);

		return tabContainer;
	};

	// Function to update the display based on the current view mode
	const updateDisplay = () => {
		// Update the table content
		const tableContainerElement = statsDisplay.querySelector('.table-container');
		createTableWithFolders(tableContainerElement, currentViewMode);

		// Update tab styles
		const tabs = statsDisplay.querySelectorAll('div > div');
		tabs.forEach(tab => {
			const isActive = (tab.textContent.toLowerCase() === currentViewMode);

			if (isActive) {
				tab.style.borderTop = '1px solid #ccc';
				tab.style.borderLeft = '1px solid #ccc';
				tab.style.borderRight = '1px solid #ccc';
				tab.style.borderBottom = '1px solid #fff';
				tab.style.marginBottom = '-1px';
				tab.style.fontWeight = 'bold';
			} else {
				tab.style.border = '1px solid #ccc';
				tab.style.borderBottom = '1px solid #ccc';
				tab.style.marginBottom = '0';
				tab.style.fontWeight = 'normal';
			}
		});
	};

	// Build the HTML content
	statsDisplay.innerHTML = `
		<p style="margin: 0 0 10px 0; font-size: 1.1em; padding: 0 5px;">Learned Kanji Statistics:</p>
	`;

	// Add the view toggle buttons
	statsDisplay.appendChild(createViewToggle());

	// Add the table container
	const tableContainer = document.createElement('div');
	tableContainer.className = 'table-container';
	tableContainer.style.border = '1px solid #ccc';
	tableContainer.style.borderTop = 'none';
	tableContainer.style.padding = '15px';
	tableContainer.style.borderBottomLeftRadius = '5px';
	tableContainer.style.borderBottomRightRadius = '5px';
	statsDisplay.appendChild(tableContainer);

	// Initialize the display
	updateDisplay();

	// Insert the stats display after the header
	headerElement.insertAdjacentElement('afterend', statsDisplay);

})();
