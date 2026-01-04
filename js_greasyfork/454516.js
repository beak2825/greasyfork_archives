// ==UserScript==
// @name         WK Katakana For On'yomi custom
// @include      https://www.wanikani.com/*
// @include      https://www.wanikani.com/*
// @description  A userscript for wanikani that transforms everything related to on'yomi into katakana.
// @run-at       document-end
// @grant        none
// @license      GPL v3.0
// @version 0.0.1.20221109110408
// @namespace https://greasyfork.org/users/981122
// @downloadURL https://update.greasyfork.org/scripts/454516/WK%20Katakana%20For%20On%27yomi%20custom.user.js
// @updateURL https://update.greasyfork.org/scripts/454516/WK%20Katakana%20For%20On%27yomi%20custom.meta.js
// ==/UserScript==

/*
* Kanji important reading (1: onyomi, 0: kunyomi)
* Saved localy, to update enter apiKey and use function on the bottom of the script
*/
var kanjiYomiPLEASANT = {"一":1,"二":1,"九":1,"七":1,"人":1,"入":1,"八":1,"力":1,"十":1,"三":1,"上":1,"下":1,"口":1,"大":1,"女":1,"山":1,"川":0,"工":1,"刀":1,"土":1,"千":1,"夕":0,"子":1,"小":1,"丁":1,"了":1,"又":0,"丸":0,"才":1,"中":1,"五":1,"六":1,"円":1,"天":1,"手":0,"文":1,"日":1,"月":1,"木":1,"水":1,"火":1,"犬":0,"王":1,"出":1,"四":1,"右":1,"左":1,"本":1,"正":1,"田":0,"玉":0,"白":1,"目":0,"立":1,"々":0,"氷":0,"虫":0,"石":1,"世":1,"主":1,"他":1,"代":1,"写":1,"去":1,"号":1,"平":1,"打":1,"申":0,"皿":0,"礼":1,"休":1,"先":1,"名":1,"字":1,"年":1,"早":1,"気":1,"百":1,"竹":0,"糸":0,"村":0,"耳":0,"男":1,"町":1,"花":0,"見":0,"貝":0,"赤":0,"足":1,"車":1,"不":1,"仕":1,"宝":1,"央":1,"亡":1,"化":1,"両":1,"地":1,"全":1,"向":1,"安":1,"州":1,"有":1,"曲":1,"次":1,"死":1,"羊":1,"血":1,"京":1,"国":1,"夜":1,"妹":1,"姉":1,"店":1,"明":1,"東":1,"歩":1,"画":1,"直":1,"知":1,"長":1,"前":1,"南":1,"室":1,"後":1,"思":1,"星":1,"海":1,"活":1,"科":1,"点":1,"茶":1,"食":1,"首":0,"私":1,"黄":0,"黒":1,"欠":1,"氏":1,"由":1,"札":1,"民":1,"辺":1,"付":0,"以":1,"失":1,"必":1,"未":1,"末":1,"校":1,"夏":0,"家":1,"弱":1,"時":1,"紙":0,"記":1,"高":1,"通":1,"強":1,"教":1,"理":1,"組":1,"船":1,"週":1,"雪":0,"魚":1,"鳥":1,"風":1,"青":1,"肉":1,"米":1,"兄":1,"皮":1,"交":1,"会":1,"光":1,"同":1,"回":1,"多":1,"当":1,"毎":1,"羽":0,"考":1,"自":1,"色":0,"行":1,"西":1,"何":0,"体":1,"作":1,"図":1,"声":0,"弟":1,"形":1,"来":1,"社":1,"角":1,"言":1,"走":1,"谷":0,"近":1,"里":0,"麦":0,"学":1,"林":0,"空":1,"金":1,"雨":0,"草":0,"音":1,"池":1,"反":1,"支":1,"住":1,"助":1,"君":1,"医":1,"対":1,"局":1,"投":1,"役":1,"決":1,"究":1,"身":1,"者":1,"研":1,"場":1,"朝":0,"番":1,"答":0,"絵":1,"買":0,"道":1,"間":1,"雲":0,"数":1,"話":1,"楽":1,"所":1,"森":0,"電":1,"馬":1,"万":1,"今":1,"元":1,"公":1,"内":1,"分":1,"切":1,"友":1,"午":1,"太":1,"少":1,"引":0,"心":1,"戸":0,"方":1,"牛":1,"父":0,"毛":1,"冬":0,"北":1,"半":1,"古":1,"台":1,"外":1,"市":1,"広":0,"母":0,"用":1,"矢":0,"生":1,"止":1,"落":1,"聞":1,"横":0,"進":1,"転":1,"農":1,"鉄":1,"葉":0,"最":1,"終":1,"習":1,"歌":1,"語":1,"読":0,"鳴":0,"線":1,"集":1,"飲":0,"業":1,"漢":1,"始":1,"起":0,"速":1,"配":1,"酒":1,"院":1,"路":1,"軽":0,"運":1,"開":1,"算":1,"頭":0,"調":1,"親":1,"顔":0,"病":1,"求":1,"新":1,"返":1,"定":1,"売":1,"事":1,"使":1,"具":1,"受":1,"和":1,"実":1,"服":1,"泳":0,"物":1,"苦":1,"表":1,"部":1,"乗":0,"客":1,"屋":0,"度":1,"界":1,"持":1,"発":1,"相":1,"県":1,"美":1,"負":1,"送":1,"重":1,"談":1,"要":1,"勝":1,"仮":1,"予":1,"保":1,"試":1,"験":1};
var kanjiYomiPAINFUL = {"建":1,"猫":0,"司":1,"夫":1,"飯":1,"勇":1,"単":1,"寺":0,"岩":0,"晴":0,"秋":0,"帰":0,"春":0,"昼":0,"計":1,"列":1,"区":1,"坂":0,"信":1,"式":1,"変":1,"昨":1,"毒":1,"法":1,"泣":0,"浅":0,"英":1,"紀":1,"軍":1,"築":1,"仏":1,"晩":1,"丈":1,"銀":1,"謝":1,"然":1,"養":1,"感":1,"橋":0,"詩":1,"題":1,"宿":1,"願":1,"駅":1,"器":1,"士":1,"課":1,"問":1,"整":1,"暗":1,"様":0,"福":1,"緑":0,"練":1,"館":1,"億":1,"料":1,"標":1,"殺":1,"熱":1,"賞":1,"選":1,"輪":1,"鏡":0,"情":1,"映":1,"疑":1,"皆":0,"想":1,"像":1,"干":1,"非":1,"無":1,"是":1,"結":1,"細":1,"悲":1,"薬":1,"原":1,"鼻":0,"側":0,"兵":1,"堂":1,"塩":0,"席":1,"敗":1,"梅":0,"因":1,"常":1,"識":1,"渉":1,"虚":1,"官":1,"察":1,"底":0,"愛":1,"署":1,"警":1,"恋":1,"覚":1,"説":1,"幻":1,"詳":1,"劇":1,"喜":1,"果":1,"栄":1,"舌":0,"続":1,"加":1,"節":1,"減":1,"順":1,"容":1,"布":1,"易":1,"若":0,"財":1,"詞":1,"昆":1,"閥":1,"歴":1,"冊":1,"宇":1,"宙":1,"忙":1,"履":1,"団":1,"暴":1,"混":1,"乱":1,"徒":1,"得":1,"改":1,"連":1,"善":1,"絡":1,"比":1,"史":1,"笛":1,"芸":1,"残":1,"卒":1,"完":1,"念":1,"望":1,"格":1,"能":1,"妥":1,"束":1,"雰":1,"松":0,"例":1,"協":1,"参":1,"周":1,"固":1,"囲":1,"季":1,"希":1,"折":1,"材":1,"約":1,"的":1,"基":1,"性":1,"技":1,"術":1,"骨":1,"頑":1,"証":1,"遠":1,"品":1,"笑":0,"留":1,"園":1,"曜":1,"書":1,"門":1,"取":1,"係":1,"典":1,"守":1,"幸":1,"急":1,"真":1,"箱":0,"荷":0,"面":1,"府":1,"治":1,"浴":1,"辞":1,"関":1,"政":1,"弁":1,"険":1,"危":1,"存":1,"専":1,"冒":1,"冗":1,"阪":1,"員":1,"階":1,"勉":1,"第":1,"都":1,"待":1,"深":1,"童":1,"庭":1,"旅":1,"根":1,"流":1,"消":1,"倍":1,"島":0,"祭":1,"章":1,"動":1,"商":1,"悪":1,"族":1,"球":1,"陽":1,"寒":0,"暑":0,"期":1,"植":1,"歯":0,"温":1,"港":1,"湯":0,"登":1,"着":1,"野":1,"短":1,"泉":1,"合":1,"息":1,"僕":1,"訓":1,"弓":1,"告":1,"種":1,"達":1,"類":1,"報":1,"等":1,"祈":1,"汽":1,"借":1,"焼":0,"忘":1,"座":1,"洗":1,"胸":0,"僧":1,"脳":1,"禅":1,"可":1,"許":1,"枚":1,"句":1,"静":1,"禁":1,"喫":1,"煙":1,"夢":1,"災":1,"産":1,"穴":0,"困":1,"機":1,"害":1,"率":1,"飛":1,"余":1,"難":1,"妨":1,"被":1,"裕":1,"尻":0,"震":1,"尾":1,"械":1,"確":1,"嫌":1,"個":1,"圧":1,"在":1,"倒":1,"臭":0,"厚":0,"妻":1,"議":1,"犯":1,"罪":1,"防":1,"論":1,"経":1,"成":1,"味":1,"低":1,"拾":0,"伝":1,"老":1,"位":1,"利":1,"努":1,"特":1,"放":1,"争":1,"仲":0,"共":1,"好":1,"初":1,"別":1,"労":1,"命":1,"岸":1,"昔":0,"波":1,"注":1,"育":1,"指":1,"洋":1,"神":1,"戦":1,"秒":1,"級":1,"追":0,"競":1,"良":1,"功":1,"便":1,"令":1,"働":1,"意":1};
var kanjiYomiDEATH = {"居":1,"補":1,"鮮":1,"限":1,"与":1,"含":1,"影":1,"況":1,"渡":0,"響":1,"票":1,"景":1,"抜":0,"訴":1,"訟":1,"逮":1,"候":1,"構":1,"模":1,"捕":1,"効":1,"属":1,"慣":1,"豊":1,"満":1,"肥":1,"巻":1,"捜":1,"絞":1,"隠":1,"輩":1,"掛":0,"替":0,"義":1,"敵":1,"済":1,"委":1,"挙":1,"制":1,"判":1,"務":1,"査":1,"総":1,"設":1,"資":1,"権":1,"件":1,"派":1,"岡":0,"素":1,"断":1,"評":1,"任":1,"批":1,"検":1,"審":1,"条":1,"責":1,"省":1,"税":1,"増":1,"解":1,"際":1,"認":1,"企":1,"鬼":1,"革":1,"俳":1,"裁":1,"呼":0,"収":1,"停":1,"職":1,"規":1,"護":1,"割":0,"崎":0,"演":1,"律":1,"師":1,"看":1,"準":1,"則":1,"導":1,"備":1,"幹":1,"張":1,"優":1,"沢":1,"宅":1,"施":1,"贅":1,"現":1,"乳":1,"城":0,"秀":1,"悩":0,"暇":1,"胃":1,"郎":1,"招":1,"段":1,"腹":1,"痛":1,"退":1,"屈":1,"織":1,"貸":0,"迷":1,"惑":1,"誘":1,"就":1,"症":1,"訪":1,"怒":1,"昇":1,"眠":1,"睡":1,"締":1,"迫":1,"靴":0,"濃":1,"端":1,"極":1,"健":1,"途":1,"康":1,"給":1,"雄":1,"娘":0,"乾":1,"監":1,"杯":1,"催":1,"促":1,"欧":1,"江":0,"請":1,"韓":1,"壊":1,"診":1,"閣":1,"僚":1,"積":1,"督":1,"略":1,"臣":1,"航":1,"寄":1,"板":1,"街":1,"宗":1,"緊":1,"宴":1,"恐":1,"怖":1,"添":1,"猛":1,"烈":1,"索":1,"詰":0,"祝":1,"担":1,"額":1,"製":1,"燃":1,"違":0,"輸":1,"届":0,"狭":0,"肩":0,"腕":0,"腰":0,"触":1,"視":1,"載":1,"層":1,"型":1,"庁":1,"差":1,"武":1,"管":1,"象":1,"量":1,"境":1,"環":1,"質":1,"述":1,"供":1,"展":1,"販":1,"株":0,"賀":1,"各":1,"誕":1,"罰":1,"脱":1,"過":1,"坊":1,"寝":0,"宮":0,"案":1,"置":1,"価":1,"費":1,"勢":1,"営":1,"示":1,"統":1,"領":1,"策":1,"藤":0,"副":1,"観":1,"値":1,"吸":1,"姿":1,"域":1,"応":1,"提":1,"援":1,"状":1,"態":1,"造":1,"授":1,"印":1,"創":1,"往":1,"復":1,"較":1,"筆":1,"鉛":1,"貯":1,"我":1,"故":1,"障":1,"従":1,"激":1,"刺":1,"励":1,"討":1,"郵":1,"針":1,"徴":1,"怪":1,"獣":1,"突":1,"菓":1,"河":1,"汗":0,"振":1,"豚":0,"再":1,"接":1,"独":1,"占":1,"巨":1,"妙":1,"麗":1,"並":1,"冷":1,"処":1,"逆":1,"庫":1,"児":1,"凍":1,"幼":1,"稚":1,"博":1,"奇":1,"清":1,"潔":1,"録":1,"修":1,"隊":1,"券":1,"婦":1,"微":1,"益":1,"移":1,"精":1,"程":1,"絶":1,"憲":1,"衆":1,"傘":0,"浜":0,"撃":1,"攻":1,"綺":1,"魅":1,"系":1,"渇":0,"婚":1,"遊":1,"旗":1,"照":1,"快":1,"版":1,"貧":1,"乏":1,"適":1,"預":1,"延":1,"翌":1,"覧":1,"懐":0,"押":0,"更":1,"浮":0,"枕":0,"漏":1,"符":1,"購":1,"越":1,"飾":1,"騒":1,"背":1,"撮":1,"盗":1};
var kanjiYomiHELL = {"齢":1,"需":1,"宜":0,"繰":0,"避":1,"妊":1,"娠":1,"致":1,"刊":1,"奏":1,"伴":1,"併":1,"傾":1,"却":1,"奥":0,"慮":1,"懸":1,"房":1,"扱":0,"抑":1,"択":1,"描":1,"盤":1,"緒":1,"称":1,"緩":0,"託":1,"賄":1,"賂":1,"贈":1,"逃":1,"還":1,"拒":1,"鈴":1,"邦":1,"阜":1,"岐":1,"雇":1,"隆":1,"控":0,"壁":0,"棋":1,"渋":1,"群":1,"片":0,"仙":1,"充":1,"免":1,"勧":1,"圏":1,"埋":0,"埼":0,"奪":0,"御":1,"慎":1,"甲":1,"枠":0,"斐":1,"祉":1,"稲":0,"謙":1,"譲":1,"躍":1,"銃":1,"鋼":1,"項":1,"堀":0,"隣":1,"顧":1,"駐":1,"駆":0,"唱":1,"柱":1,"孝":1,"俊":1,"兼":1,"吹":0,"剤":1,"巡":1,"戒":1,"排":1,"携":1,"鋭":1,"敏":1,"敷":0,"殿":1,"犠":1,"獲":1,"茂":1,"雅":1,"頻":1,"繁":1,"殖":1,"衝":1,"薄":1,"誉":1,"褒":1,"透":1,"孫":1,"富":1,"融":1,"離":1,"編":1,"華":1,"既":1,"普":1,"豪":1,"鑑":1,"除":1,"尋":1,"幾":0,"廊":1,"掃":1,"泥":1,"驚":1,"棒":1,"嘆":1,"倉":1,"巣":0,"救":1,"帯":1,"径":1,"散":1,"粉":1,"脈":1,"菜":1,"貨":1,"陸":1,"似":1,"墓":1,"均":1,"徳":1,"探":1,"偵":1,"甘":0,"将":1,"旧":1,"姓":1,"貿":1,"盟":1,"遺":1,"債":1,"伸":0,"及":1,"奈":1,"幅":0,"廃":1,"換":1,"摘":1,"核":1,"縄":1,"沖":0,"津":0,"献":1,"療":1,"継":1,"維":1,"伎":1,"舞":1,"踏":1,"般":1,"頼":1,"依":1,"諾":1,"鹿":0,"牙":1,"超":1,"兆":1,"抱":0,"跡":1,"戻":0,"跳":1,"昭":1,"漁":1,"償":1,"募":1,"刑":1,"執":1,"塁":1,"崩":1,"患":1,"抗":1,"抵":1,"旬":1,"爆":1,"湾":1,"弾":1,"聴":1,"遣":1,"闘":1,"香":1,"陣":1,"臨":1,"削":1,"契":1,"掲":1,"狙":1,"葬":1,"恵":1,"蔵":1,"簡":1,"閉":1,"誌":1,"窓":0,"否":1,"筋":1,"垂":1,"宣":1,"尊":1,"忠":1,"拡":1,"操":1,"敬":1,"灰":0,"熟":1,"異":1,"皇":1,"盛":1,"砂":1,"漠":1,"糖":1,"納":1,"肺":1,"著":1,"蒸":1,"装":1,"裏":0,"諸":1,"賃":1,"暮":1,"醤":1,"炎":1,"破":1,"杉":0,"熊":0,"酢":0,"獄":1,"銅":1,"遅":1,"測":1,"彫":1,"舎":1,"講":1,"滞":1,"介":1,"紹":1,"己":1,"厄":1,"亀":0,"互":1,"剣":1,"彼":0,"寿":1,"恥":0,"汁":1,"噌":1,"為":1,"酔":1,"鍋":0,"湖":1,"払":0,"油":1,"久":1,"卵":0,"込":0,"序":1,"志":1,"迎":1,"恩":1,"採":1,"桜":0,"永":1,"液":1,"眼":1,"祖":1,"績":1,"興":1,"衛":1,"複":1,"雑":1,"酸":1,"賛":1,"銭":1,"飼":0,"傷":1,"党":1,"厳":1,"捨":0,"密":1,"汚":1,"暖":1,"欲":1,"机":0,"秘":1,"訳":1,"染":1,"爪":0,"拝":1,"奴":1,"豆":1,"誤":1,"臓":1,"貴":1,"降":1,"丼":1,"吐":0,"隷":1,"芋":0,"縮":1,"純":1,"縦":0,"粋":1,"磁":1,"紅":1,"射":1,"幕":1,"薦":1,"揮":1,"推":1,"沿":1,"源":1,"勤":1,"歓":1,"承":1,"枝":1,"損":1,"刻":1,"腐":1,"聖":1};
var kanjiYomiPARADISE = {"握":1,"紛":1,"糾":1,"枢":1,"軸":1,"克":1,"双":1,"到":1,"哲":1,"喪":1,"堅":0,"括":1,"床":1,"弧":1,"挑":1,"掘":1,"揺":1,"揚":1,"斎":1,"析":1,"暫":1,"泊":1,"柄":0,"潟":0,"滑":1,"範":1,"焦":1,"綱":0,"網":1,"肝":1,"芝":0,"荒":0,"袋":0,"硬":1,"曇":0,"澄":1,"矛":1,"肌":0,"舟":0,"狩":0,"凶":1,"鐘":1,"塊":0,"頃":0,"脚":1,"魂":1,"井":1,"也":0,"呪":0,"嬢":1,"暦":1,"眺":1,"賭":0,"裸":1,"疲":1,"卓":1,"塾":1,"菌":1,"磨":0,"陰":1,"湿":1,"霊":1,"嫁":0,"稼":1,"溝":1,"狂":1,"滝":0,"翔":0,"墨":0,"鳩":0,"穏":1,"鈍":1,"魔":1,"寮":1,"棟":1,"盆":1,"吾":0,"斬":1,"寧":1,"椅":1,"歳":1,"涼":1,"猿":0,"瞳":1,"鍵":0,"零":1,"碁":1,"幽":1,"租":1,"泡":1,"癖":0,"鍛":1,"錬":1,"穂":0,"帝":1,"菊":1,"瞬":1,"誇":1,"庄":1,"阻":1,"俵":1,"黙":1,"綿":1,"架":1,"孔":1,"唇":0,"砕":1,"粘":1,"粧":1,"欺":1,"詐":1,"霧":0,"柳":1,"伊":1,"佐":1,"瞭":1,"尺":1,"哀":1,"塀":1,"如":1,"墜":1,"婆":1,"崖":1,"帽":1,"幣":1,"恨":1,"憎":1,"憩":1,"扇":1,"扉":1,"掌":1,"挿":1,"滴":1,"炊":1,"畳":1,"爽":0,"箸":0,"芯":1,"胴":1,"虹":0,"巾":1,"霜":0,"蚊":0,"騎":1,"帳":1,"蛇":0,"辱":1,"貼":0,"鉢":1,"闇":0,"隙":0,"飢":1,"餓":1,"畜":1,"迅":1,"蓄":1,"尽":1,"彩":1,"溶":1,"憶":1,"耐":1,"踊":0,"賢":1,"輝":1,"灯":1,"脅":1,"麻":1,"咲":0,"悔":1,"培":1,"脇":0,"遂":1,"塗":1,"班":1,"斜":1,"殴":1,"盾":1,"穫":1,"鶴":0,"淡":1,"紫":1,"駒":0,"抽":1,"誓":1,"悟":1,"拓":1,"拘":1,"礎":1,"刈":0,"剛":1,"唯":1,"尼":1,"壇":1,"概":1,"浸":1,"煮":0,"覆":1,"謀":1,"隔":1,"陶":1,"俗":1,"征":1,"陛":1,"桑":0,"潤":1,"珠":1,"衰":1,"劣":1,"奨":1,"勘":1,"妃":1,"邪":1,"搬":1,"墳":1,"彰":1,"駄":1,"廷":1,"訂":1,"壮":1,"漂":1,"鰐":0,"蟹":0,"簿":1,"晶":1,"軌":1,"涯":1,"巧":1,"峰":1,"唐":1,"鬱":1,"漫":1,"諮":1,"銘":1,"堰":0,"堤":1,"翻":1,"后":1,"奮":1,"仰":1,"亭":1,"伯":1,"偶":1,"淀":0,"把":1,"洞":1,"疫":1,"裂":1,"籍":1,"柔":1,"沈":1,"沼":0,"誰":0,"襲":1,"貢":1,"趣":1,"距":1,"朗":1,"即":1,"旨":1,"威":1,"筒":1,"珍":1,"露":1,"刷":1,"牧":1,"潮":1,"垣":0,"封":1,"岳":1,"慰":1,"懇":1,"懲":1,"摩":1,"擦":1,"斉":1,"撲":1,"滅":1,"泰":1,"炉":1,"滋":1,"琴":0,"至":1,"儀":1,"虎":0,"遜":1,"伺":0,"徹":1,"瀬":0,"措":1,"撤":1,"拠":1,"樹":1,"棄":1,"蛍":0,"蜂":0,"酎":1,"蜜":1,"墟":1,"潜":1,"艦":1,"拳":1,"炭":1,"畑":0,"仁":1,"包":1,"衣":1,"鉱":1,"誠":1,"郷":1,"侵":1,"偽":1,"雷":1,"辛":1,"粒":1,"丘":1,"娯":1,"斗":1,"謎":0,"朱":1,"塔":1,"髪":0,"砲":1,"寸":1,"竜":1,"縁":1,"翼":1,"吉":1,"刃":0,"忍":1,"桃":0,"侍":0,"俺":0,"叱":0,"梨":0,"匹":0,"釣":0,"叫":1,"笠":0,"嵐":0,"缶":1,"涙":1,"棚":0,"姫":0,"芽":0};
var kanjiYomiREALITY = {"軒":1,"媛":0,"玄":1,"偉":1,"頂":1,"召":1,"枯":1,"挟":0,"沸":1,"濯":1,"燥":1,"瓶":1,"肯":1,"耕":1,"脂":1,"膚":1,"軟":1,"郊":1,"隅":0,"隻":1,"邸":1,"渦":1,"郡":1,"釈":1,"肪":1,"喚":1,"貞":1,"苗":1,"慈":1,"襟":0,"蓮":1,"聡":1,"亮":1,"浦":0,"塚":0,"漸":0,"藻":1,"妄":1,"倹":1,"狐":0,"逝":1,"匿":1,"寡":1,"痢":1,"藍":0,"坑":1,"畔":1,"唄":0,"拷":1,"渓":1,"廉":1,"謹":1,"湧":1,"醜":1,"升":0,"殉":1,"煩":1,"劾":1,"桟":1,"婿":0,"慕":1,"罷":1,"矯":1,"囚":1,"某":1,"泌":1,"蛮":1,"庶":1,"鯨":1,"荘":1,"栽":1,"冠":1,"拐":1,"勲":1,"酬":1,"欄":1,"紋":1,"卸":0,"逸":1,"尚":1,"顕":1,"粛":1,"愚":1,"践":1,"呈":1,"疎":1,"疾":1,"謡":1,"鎌":0,"酷":1,"叙":1,"且":0,"痴":1,"呆":1,"哺":1,"悠":1,"傲":1,"茎":0,"阿":1,"杏":1,"茜":0,"栞":0,"伏":1,"鎮":1,"奉":1,"憂":1,"栃":0,"朴":1,"累":1,"惜":1,"佳":1,"悼":1,"該":1,"赴":1,"髄":1,"傍":1,"癒":1,"郭":1,"尿":1,"虜":1,"賓":1,"憾":1,"弥":0,"粗":1,"循":1,"脊":1,"凝":1,"昌":1,"旦":1,"愉":1,"栓":1,"抹":1,"之":0,"龍":1,"瑛":1,"遼":1,"那":1,"寂":1,"庸":1,"拍":1,"猶":1,"宰":1,"縫":1,"呉":1,"凡":1,"恭":0,"錯":1,"穀":1,"弊":1,"陵":1,"舶":1,"悦":1,"窮":1,"縛":1,"轄":1,"弦":1,"洪":1,"窒":1,"摂":1,"飽":1,"靖":0,"紳":1,"嘉":1,"搾":1,"蝶":1,"碑":1,"尉":1,"匠":1,"凛":1,"遥":0,"智":1,"柴":0,"瑠":1,"敢":1,"楓":1,"凹":1,"凸":1,"萌":1,"烏":0,"賊":1,"旋":1,"鼓":1,"腸":1,"槽":1,"伐":1,"堕":1,"漬":0,"坪":0,"紺":1,"羅":1,"峡":1,"俸":1,"醸":1,"弔":1,"乙":1,"衡":1,"遍":1,"款":1,"閲":1,"喝":1,"膜":1,"盲":1,"酵":1,"胎":1,"遮":1,"哉":0,"蒼":1,"准":1,"寛":1,"胞":1,"浄":1,"随":1,"稿":1,"丹":1,"壌":1,"舗":1,"騰":1,"緯":1,"艇":1,"披":1,"錦":0,"剰":1,"繊":1,"諭":1,"惨":1,"虐":1,"据":0,"徐":1,"搭":1,"蒙":1,"瓜":1,"鯉":0,"戴":1,"緋":1,"曙":0,"胡":1,"帥":1,"啓":1,"葵":0,"駿":1,"諒":1,"莉":1,"遇":1,"陥":1,"貫":1,"覇":1,"茨":0,"呂":1,"擁":1,"孤":1,"鎖":1,"賠":1,"噴":1,"祥":1,"牲":1,"唆":1,"秩":1,"膨":1,"芳":1,"恒":1,"倫":1,"陳":1,"須":1,"偏":1,"糧":1,"殊":1,"慢":1,"没":1,"怠":1,"遭":1,"惰":1,"猟":1,"乃":1,"颯":1,"綾":1,"隼":0,"輔":0,"硫":1,"赦":1,"窃":1,"慨":1,"戯":1,"扶":1,"濁":1,"奔":1,"肖":1,"朽":1,"享":1,"殻":1,"藩":1,"鶏":1,"媒":1,"嘱":1,"椎":1,"迭":1,"絹":1,"陪":1,"譜":1,"剖":1,"淑":1,"帆":1,"酌":1,"憤":1,"暁":0,"傑":1,"錠":1,"凌":0,"瑞":0,"菅":0,"璃":1,"漣":1,"吟":1,"侮":1,"鋳":1,"蔑":1,"胆":1,"浪":1,"禍":1,"酪":1,"憧":0,"亜":1,"慶":1,"梓":0,"汰":1,"沙":1,"忌":1,"遷":1,"拙":1,"篤":1,"峠":0,"叔":0,"雌":0,"堪":0,"崇":1,"甚":1,"漆":1,"岬":0,"紡":1,"礁":1,"屯":1,"姻":1,"睦":1,"擬":1,"閑":1,"曹":1,"卑":1,"詠":1};

/*
* Used for switching between hira and kata (vice versa)
*/
var hiraToKata = {"め": "メ", "む": "ム", "ゃ": "ャ", "も": "モ", "ゅ": "ュ", "や": "ヤ", "ょ": "ョ", "ゆ": "ユ", "ら": "ラ", "よ": "ヨ", "る": "ル", "り": "リ", "ろ": "ロ", "れ": "レ", "わ": "ワ", "ん": "ン", "を": "ヲ", "あ": "ア", "い": "イ", "う": "ウ", "え": "エ", "か": "カ", "お": "オ", "き": "キ", "が": "ガ", "く": "ク", "ぎ": "ギ", "け": "ケ", "ぐ": "グ", "こ": "コ", "げ": "ゲ", "さ": "サ", "ご": "ゴ", "し": "シ", "ざ": "ザ", "す": "ス", "じ": "ジ", "せ": "セ", "ず": "ズ", "そ": "ソ", "ぜ": "ゼ", "た": "タ", "ぞ": "ゾ", "ち": "チ", "だ": "ダ", "っ": "ッ", "ぢ": "ヂ", "づ": "ヅ", "つ": "ツ", "で": "デ", "て": "テ", "ど": "ド", "と": "ト", "に": "ニ", "な": "ナ", "ね": "ネ", "ぬ": "ヌ", "は": "ハ", "の": "ノ", "ぱ": "パ", "ば": "バ", "び": "ビ", "ひ": "ヒ", "ふ": "フ", "ぴ": "ピ", "ぷ": "プ", "ぶ": "ブ", "べ": "ベ", "へ": "ヘ", "ほ": "ホ", "ぺ": "ペ", "ぽ": "ポ", "ぼ": "ボ", "み": "ミ", "ま": "マ"};
var kataToHira = {"メ": "め", "ム": "む", "ャ": "ゃ", "モ": "も", "ュ": "ゅ", "ヤ": "や", "ョ": "ょ", "ユ": "ゆ", "ラ": "ら", "ヨ": "よ", "ル": "る", "リ": "り", "ロ": "ろ", "レ": "れ", "ワ": "わ", "ン": "ん", "ヲ": "を", "ア": "あ", "イ": "い", "ウ": "う", "エ": "え", "カ": "か", "オ": "お", "キ": "き", "ガ": "が", "ク": "く", "ギ": "ぎ", "ケ": "け", "グ": "ぐ", "コ": "こ", "ゲ": "げ", "サ": "さ", "ゴ": "ご", "シ": "し", "ザ": "ざ", "ス": "す", "ジ": "じ", "セ": "せ", "ズ": "ず", "ソ": "そ", "ゼ": "ぜ", "タ": "た", "ゾ": "ぞ", "チ": "ち", "ダ": "だ", "ッ": "っ", "ヂ": "ぢ", "ヅ": "づ", "ツ": "つ", "デ": "で", "テ": "て", "ド": "ど", "ト": "と", "ニ": "に", "ナ": "な", "ネ": "ね", "ヌ": "ぬ", "ハ": "は", "ノ": "の", "パ": "ぱ", "バ": "ば", "ビ": "び", "ヒ": "ひ", "フ": "ふ", "ピ": "ぴ", "プ": "ぷ", "ブ": "ぶ", "ベ": "べ", "ヘ": "へ", "ホ": "ほ", "ペ": "ぺ", "ポ": "ぽ", "ボ": "ぼ", "ミ": "み", "マ": "ま"};

// locators, for ease of maintenance
var lessonKanjiTypeLocatorCompatibility='#supplement-kan-reading-type';
var lessonReadingMnemonicLocatorCompatibility='#supplement-kan-reading-mne span';
var lessonSidebarLocatorCompatibility='#supplement-kan-reading > div:nth-child(1) > div:nth-child(1) span';

var reviewItemInfoDropDownSidebarLocator ='#item-info-reading > span';
var reviewItemInfoDropDownReadingLocator ='#item-info-reading-mnemonic span:lang(ja)';

var observationSelectorLesson='#supplement-nav';
// none of these felt reliable during development, so we listen to everything that's available when the script runs
var observationSelectorReview1='#item-info-col2';
var observationSelectorReview2='#all-info';
var observationSelectorReview3='#item-info-col1';
var observationSelectorReview4='#item-info';


if (/dashboard/.test(document.URL) || document.URL == "http://www.wanikani.com/" || document.URL == "https://www.wanikani.com/") // Homepage
{
    var replacePopup = function()
    {
        if ( isOnyomiAll($(this).text()) == 1) $(this).attr(('data-original-title'), convertToKata($(this).attr('data-original-title')) );
    };
    $('.lattice-single-character a[data-original-title]').each(replacePopup);

    // this is for scripts who modify the homescreen after the page finished loading
    $('.kanji-progress .lattice-single-character .small-caps > span').bind("DOMSubtreeModified",function(){
        $('.kanji-progress .lattice-single-character a[data-original-title]').each(replacePopup);
    });

}
else if (/\/lattice\/kanji/.test(document.URL)) // Lattice
{
    var replacePopup = function()
    {
        if ( isOnyomiAll($(this).text()) == 1) $(this).attr(('data-original-title'), convertToKata($(this).attr('data-original-title')) );
    };
    $('.lattice-single-character a[data-original-title]').each(replacePopup);

}
else if (/\/kanji\//.test(document.URL)) // Kanji detail page
{
    // ORIGINAL
    //    var replaceReading = function() {
    //    if ($(this).children('h3').text() == "On’yomi")
    //    {
    //        $(this).children('p').text(convertToKata($(this).children('p').text()));
    //    }
    //};
    //$('.span4').each(replaceReading);

    console.log("DEBUG: trying ", document.URL)

    var onYomidebugItem = document.getElementsByClassName("subject-readings__reading-title")

    console.log("On'Yomi: ", onYomidebugItem[0])

    var onYomiReaingParentItem = document.getElementsByClassName("subject-readings__reading subject-readings__reading--primary")

    console.log("On'Yomi PARENT: ", onYomiReaingParentItem[0])

    var readingsParent = document.getElementsByClassName("subject-readings")
    console.log("Readings PARENT: ", readingsParent[0])

    var onYomiReadingChild = document.getElementsByClassName("subject-readings__reading-items")
    console.log("Readings CHILD: ", onYomiReadingChild[0])
    console.log("The actual reading: ", onYomiReadingChild[0].textContent)

    var toKatakana = convertToKata(onYomiReadingChild[0].textContent)

    console.log("Katakana conversion: ", toKatakana)

    onYomiReadingChild[0].textContent = toKatakana

    //$('.subject-readings').each(replaceReading);
    //$('.subject-readings').each(replaceReading);

    //--------- Visually Similar Kanji ---------//
    //var replaceSimilar = function() {
    //    if (isOnyomiAll($(this).find('.character').text()) == 1) $(this).find('li').eq(0).text(convertToKata($(this).find('li').eq(0).text()));
    //};
    //$('.character-grid__items').find('a').each(replaceSimilar);
}
else if (/\/kanji\?difficult/.test(document.URL) || document.URL == "https://www.wanikani.com/kanji") // Big kanji page based on difficulty
{
    var n = document.URL.lastIndexOf('=');
    var difficulty = document.URL.substring(n + 1);

    var replaceLevelPortion = function() {
        $(this).find('.character-item').each(replaceReading);
    };

    var replaceReading = function() {
        if (isOnyomi($(this).find('.character').text().replace(/\s/g,''), difficulty)) $(this).find('li').eq(0).text(convertToKata($(this).find('li').eq(0).text()));
    };
    $('.character-grid__items').each(replaceLevelPortion);
}
else if (/\/radicals\//.test(document.URL) || /\/vocabulary\//.test(document.URL)) // Radical and Vocabulary page
{
    //--------- Found In and Utilized Kanji ---------//
    var replaceReading = function() {
        if (isOnyomiAll($(this).find('.character').text()) == 1) $(this).find('li').eq(0).text(convertToKata($(this).find('li').eq(0).text()));
    };
    $('.character-grid__items').find('a').each(replaceReading);
}
else if (/\/level\//.test(document.URL)) // Level page
{

    var n = document.URL.lastIndexOf('/');
    var level = document.URL.substring(n + 1);


    console.log("DEBUG: Level", level, "page.")

    var characterGrid = document.getElementsByClassName("character-grid")

    console.log("DEBUG: Character grid", characterGrid)

    var kanjiGrid = characterGrid[1]

    console.log("DEBUG: Kanji grid", kanjiGrid)

    var KanjiInnerGrid = kanjiGrid.getElementsByClassName("character-grid__items")

    console.log("DEBUG: Kanji inner grid", KanjiInnerGrid)


    // <li class="character-grid__item character-grid__item--kanji">
    var kanjiChildren = kanjiGrid.getElementsByClassName("character-grid__item character-grid__item--kanji")

    console.log("DEBUG: Kanji inner grid children", kanjiChildren)

    // iterate over li.character-grid__item.character-grid__item--kanji
    for (let i = 0; i < kanjiChildren.length; ++i)
    {
        //console.log("Iteration over item ", i, "which is:", kanjiChildren[i])

        // a.character-item.character-item--kanji
        var lastChild = kanjiChildren[i].lastChild

        //console.log("And the last child of ", i, " is:", kanjiChildren[i].lastChild)

        var kanjiChild = lastChild.children[0]
        var readingChild = lastChild.children[1].firstChild.nextSibling

        //console.log("Kanji attempt: ", kanjiChild)
        console.log("Kanji: ", kanjiChild.innerText, " is OnYomi? ", isOnyomi(kanjiChild.innerText, level))

        //console.log("Reading attempt: ", readingChild)
        //console.log("Reading attempt text only: ", readingChild.textContent)

        var toKatakanaLevelPage = convertToKata(readingChild.textContent)

        //console.log("Reading attempt as Katakana: ", toKatakana)


        if (isOnyomi( kanjiChild.innerText, level))
        {
            readingChild.textContent = toKatakanaLevelPage
        }

        //console.log("Child ", i , " kanji grid item is: ", kanjiChildren[i].getElementsByClassName("character-grid__item character-grid__item--kanji"[0]))


        //console.log("Child ", i , " reading is: ", kanjiChildren[i].getElementsByClassName("character-item__info-reading"[0]))
    }

    // <li class="character-item__info-reading" lang="ja">          せき      </li>


    //var replaceReading = function() {
    //    if (isOnyomi($(this).children('.character').text().replace(/\s/g,''), level))
    //    {
    //        $(this).find('li').eq(0).text(convertToKata($(this).find('li').eq(0).text()));
    //    }
    //};
    //$('.character-grid__items').eq(1).find('a').each(replaceReading);
}
else if (/review\/session/.test(document.URL) || /extra_study/.test(document.URL)) // Review page
{
    answerChecker.oldIsAsciiPresentKM = answerChecker.isAsciiPresent;
    answerChecker.isAsciiPresent = function(e) {
        // this is for trailing N to ン
        if(e[e.length-1] === 'N') {
            e = e.substr(0, e.length-1) + 'ン' + e.substr(e.length);
        }
        return answerChecker.oldIsAsciiPresentKM(e);
    };

    answerChecker.oldEvaluateKM = answerChecker.evaluate;
    answerChecker.evaluate = function(e,t) {
        //console.log($.jStorage.get('currentItem'));
        // this is for trailing N to ン
        if(e === "reading" && t[t.length-1] === 'N') {
            t = t.substr(0, t.length-1) + 'ン' + t.substr(t.length);
        }
        if(isOnyomiReview()) {
            // this is for the "WaniKani is looking for the onyomi reading" function
            for (var i = 0; i < $.jStorage.get('currentItem').kun.length; i++) {
                $.jStorage.get('currentItem').kun[i] = convertToKata($.jStorage.get('currentItem').kun[i]);
            }
            for (var i = 0; i < $.jStorage.get('currentItem').on.length; i++) {
                $.jStorage.get('currentItem').on[i] = convertToKata($.jStorage.get('currentItem').on[i]);
            }
        }
        //console.log($.jStorage.get('currentItem'));
        return answerChecker.oldEvaluateKM(e,t);
    };

     $('#user-response').on('input', function() {
        if(isOnyomiReview()) {
            var input = $(this).val();
            input = input.toUpperCase();
            // must manually convert "N " into correct kana
            if (input.substr(input.length-2, input.length-1) === "N ") {
                input = input.substr(0, input.length-2) + 'ン' + input.substr(input.length);
            }
            input = convertToKata(input);
            this.value = input;
        }
    });

    function replaceInItemInfoDropDown() {
        if(isOnyomiItem()) {
            $(reviewItemInfoDropDownSidebarLocator).text(convertToKata($(reviewItemInfoDropDownSidebarLocator).text()));
            // we don't have an exact selector for the kana in the reading mnemonic body, instead we fetch all spans with japanese lang
            var japaneseSpans = $(reviewItemInfoDropDownReadingLocator);
            for (var i = 0; i < japaneseSpans.length; i++) {
                for (var j = 0; j < $.jStorage.get('currentItem').on.length; j++) {
                    // Change the text if the text or the converted text matches one of the correct answers for the current item.
                    if($.jStorage.get('currentItem').on[j] == japaneseSpans.eq(i).text() || $.jStorage.get('currentItem').on[j] == convertToKata(japaneseSpans.eq(i).text())) {
                        japaneseSpans.eq(i).text(convertToKata(japaneseSpans.eq(i).text()));
                    }
                }
            }
        }
    }
    observeDOM()( $(observationSelectorReview1)[0] ,replaceInItemInfoDropDown);
    observeDOM()( $(observationSelectorReview2)[0] ,replaceInItemInfoDropDown);
    observeDOM()( $(observationSelectorReview3)[0] ,replaceInItemInfoDropDown);
    observeDOM()( $(observationSelectorReview4)[0] ,replaceInItemInfoDropDown);

    // change last 10 items
    var last10Change = function () {
        if(isOnyomiAll($(this).find('li').eq(0).text())){
            $(this).find('li').eq(1).text(convertToKata($(this).find('li').eq(1).text()));
        }
    };
    var observeMe = $('#last-items-list')[0];
    observeDOM()( observeMe ,function() {
        $('#last-items-list .kanji').each(last10Change);
    });
}
else if (/review/.test(document.URL)) // Review info page at the beginning and the end of a review
{
    var observeMe = $('#reviews-summary')[0];
    observeDOM()( observeMe ,function() {
        var e = $('.kanji .hover');
        if(e.length !== 0 && isOnyomiAll(e.prev('a').eq(0).text())) {
            var onyomiNode = e.find('ul').find('li').eq(1);
            onyomiNode.text(convertToKata(onyomiNode.text()));
        }
    });
}
else if (/lesson\/session/.test(document.URL)) // Lesson and lesson test page
{
    //--------- Lesson Part ---------//
    var whenLessonSlides = function () {
        // Kanji info
        var type= $(lessonKanjiTypeLocatorCompatibility).text();
        if(type.match("on.yomi")) {
            var container = $(lessonReadingMnemonicLocatorCompatibility);
            for(var i=0; i < container.length; i++)
                {
                        container.eq(i).text(convertToKata(container.eq(i).text()));
                }
            container = $(lessonSidebarLocatorCompatibility);
            for(i=0; i < container.length; i++)
                {
                        container.eq(i).text(convertToKata(container.eq(i).text()));
                }
        }
        // Vocable breakdown info

        $("#supplement-voc-breakdown").find('.kanji').each(replaceBreakdown);
    };
    var replaceBreakdown = function () {
        if(isOnyomiAll($(this).text())) {
            $(this).attr("title", convertToKata($(this).attr('title')));
        }
    };
    $(observationSelectorLesson).click(whenLessonSlides);

    //--------- Test Part ---------//
    answerChecker.oldIsNonKanaPresentKM = answerChecker.isNonKanaPresent;
    answerChecker.isNonKanaPresent = function(e) {
        // this is for trailing N to ン
        if(e[e.length-1] === 'N') {
            e = e.substr(0, e.length-1) + 'ン' + e.substr(e.length);
        }
        return answerChecker.oldIsNonKanaPresentKM(e);
    };

    answerChecker.oldEvaluateKM = answerChecker.evaluate;
    answerChecker.evaluate = function(e,t,r) {
        //console.log($.jStorage.get('l/currentQuizItem'));
        // this is for trailing N to ン
        if(e === "reading" && t[t.length-1] === 'N') {
            t = t.substr(0, t.length-1) + 'ン' + t.substr(t.length);
        }
        if(isOnyomiLesson()) {
            // this is for the "WaniKani is looking for the onyomi reading" function
            for (var i = 0; i < $.jStorage.get('l/currentQuizItem').kun.length; i++) {
                $.jStorage.get('l/currentQuizItem').kun[i] = convertToKata($.jStorage.get('l/currentQuizItem').kun[i]);
            }
            for (var i = 0; i < $.jStorage.get('l/currentQuizItem').on.length; i++) {
                $.jStorage.get('l/currentQuizItem').on[i] = convertToKata($.jStorage.get('l/currentQuizItem').on[i]);
            }
        }
        return answerChecker.oldEvaluateKM(e,t,r);
    };

    $('#user-response').on('input', function() {
        if(isOnyomiLesson()) {
            var input = $(this).val();
            input = input.toUpperCase();
            // must manually convert "N " into correct kana
            if (input.substr(input.length-2, input.length-1) === "N ") {
                input = input.substr(0, input.length-2) + 'ン' + input.substr(input.length);
            }
            input = convertToKata(input);
            this.value = input;
        }
    });

    function replaceInItemInfoDropDown() {
        if(isOnyomiLesson()) {
            $(reviewItemInfoDropDownSidebarLocator).text(convertToKata($(reviewItemInfoDropDownSidebarLocator).text()));
            $(reviewItemInfoDropDownReadingLocator).text(convertToKata($(reviewItemInfoDropDownReadingLocator).text()));
        }
    }

    var observeMe = $(observationSelectorReview)[0];
    observeDOM()( observeMe ,replaceInItemInfoDropDown);

}else if (/lesson/.test(document.URL)) // Lesson info page at the beginning and the end of a run
{
    var observeMe = $('#kanji')[0];
    observeDOM()( observeMe ,function() {
        var e = $('.kanji .hover');
        if(e.length !== 0 && isOnyomiAll(e.prev('a').eq(0).text())) {
            var onyomiNode = e.find('ul').find('li').eq(1);
            onyomiNode.text(convertToKata(onyomiNode.text()));
        }
    });
}

// Search result
if( /dashboard/.test(document.URL) || document.URL == "http://www.wanikani.com/" || document.URL == "https://www.wanikani.com/" || /\/level/.test(document.URL) ||
   /\/lattice/.test(document.URL) || /\/radicals/.test(document.URL) || /\/kanji/.test(document.URL) || /\/vocabulary/.test(document.URL) ||
   /\/community/.test(document.URL) || /\/chat/.test(document.URL) || /\/account/.test(document.URL) ) {
    var searchChange = function() {
        if(isOnyomiAll($(this).find('span').text())) {
            $(this).find('li').eq(0).text(convertToKata($(this).find('li').eq(0).text()));
        }
    };
    var observeMe = $('.search-results')[0];
    observeDOM()( observeMe ,function() {
        $('.search-results #kanji-').each(searchChange);
    });
}



//-- Helper functions for transforming kata <-> hira --//
function isOnyomiReview() {

    var objCurItem = $.jStorage.get("currentItem");
    var strQuestionType = $.jStorage.get("questionType");
    if ("kan" in objCurItem) {
        // Kanji
        if (strQuestionType === "reading") {
            if(objCurItem.emph === "onyomi") {
                return true;
            }
        }
    }
    return false;
}

function isOnyomiLesson() {

    var objCurItem = $.jStorage.get("l/currentQuizItem");
    var strQuestionType = $.jStorage.get("l/questionType");

    if ("kan" in objCurItem)
    {
        // Kanji
        if (strQuestionType === "reading") {
            if(objCurItem.emph === "onyomi"){
                return true;
            }
        }
    }
    return false;
}

function isOnyomiItem() {
     var objCurItem =$.jStorage.get("currentItem");
     if (objCurItem == null) {
         objCurItem = $.jStorage.get("l/currentQuizItem");
     }
    if ("kan" in objCurItem)
    {
        // Kanji
            if(objCurItem.emph === "onyomi"){
                return true;
            }
    }
    return false;
}


function isOnyomi(kanji, level)
{
    switch(level.toUpperCase()) {
        case 'PLEASANT': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': case '10':
            return kanjiYomiPLEASANT[kanji];
        case 'PAINFUL': case '11': case '12': case '13': case '14': case '15': case '16': case '17': case '18': case '19': case '20':
            return kanjiYomiPAINFUL[kanji];
        case 'DEATH': case '21': case '22': case '23': case '24': case '25': case '26': case '27': case '28': case '29': case '30':
            return kanjiYomiDEATH[kanji];
        case 'HELL': case '31': case '32': case '33': case '34': case '35': case '36': case '37': case '38': case '39': case '40':
            return kanjiYomiHELL[kanji];
        case 'PARADISE': case '41': case '42': case '43': case '44': case '45': case '46': case '47': case '48': case '49': case '50':
            return kanjiYomiPARADISE[kanji];
        case 'REALITY': case '51': case '52': case '53': case '54': case '55': case '56': case '57': case '58': case '59': case '60':
            return kanjiYomiREALITY[kanji];
        default:
            return 0;
    }
}
function isOnyomiAll(kanji)
{
    console.log("Testing for onyomi reading", kanji);
    if(kanjiYomiPLEASANT[kanji]) return 1;
    if(kanjiYomiPAINFUL[kanji]) return 1;
    if(kanjiYomiDEATH[kanji]) return 1;
    if(kanjiYomiHELL[kanji]) return 1;
    if(kanjiYomiPARADISE[kanji]) return 1;
    if(kanjiYomiREALITY[kanji]) return 1;
    return 0;

}
function convertToKata(chain)
{

    console.log("Trying to convert to katakana: ", chain)
    chain = chain.trim();
    for (var i = 0, c = chain.length; i < c; i++)
    {
        chain = replaceAt(chain, i, hiraToKata[chain[i]] || chain[i]);
    }

    console.log("Result of conversion: ", chain)

    return chain;
}

function convertToHira(chain)
{
    chain = chain.trim();
    for (var i = 0, c = chain.length; i < c; i++)
    {
        chain = replaceAt(chain, i, kataToHira[chain[i]] || chain[i]);
    }
    return chain;
}

function replaceAt(s, n, t)
{
    return s.substring(0, n) + t + s.substring(n + 1);
}

/*
* Wait for elements to appear
* call with observeDom()(observNode, callbackFunction);
* from stackoverflow: http://stackoverflow.com/a/14570614
*/
function observeDOM() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;
    return function(obj, callback){
        if( MutationObserver ) {
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer) {
                if( mutations[0].addedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            if (obj) {
            obs.observe( obj, {childList:true, subtree:true });
            } else {
                console.trace('Unable to observe changes in DOM for katakana madness');
            }
        }
        else if( eventListenerSupported ) {
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };
}