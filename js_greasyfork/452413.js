// ==UserScript==
// @name  convert ISO 3166-1 code to country names in i18n
// @name:ar  تحويل رمز ISO 3166-1 إلى أسماء البلدان في i18n
// @name:bg  преобразувайте код ISO 3166-1 в имена на държави в i18n
// @name:zh-CN  将 ISO 3166-1 代码转换为 i18n 中的国家/地区名称
// @name:zh-TW  將 ISO 3166-1 代碼轉換為 i18n 中的國家/地區名稱
// @name:cs  převeďte kód ISO 3166-1 na názvy zemí v i18n
// @name:da  konverter ISO 3166-1-kode til landenavne i i18n
// @name:nl  converteer ISO 3166-1-code naar landnamen in i18n
// @name:en  convert ISO 3166-1 code to country names in i18n
// @name:eo  konverti ISO 3166-1-kodon al landnomoj en i18n
// @name:fi  muuntaa ISO 3166-1-koodin maiden nimiksi i18n:ssä
// @name:fr  convertir le code ISO 3166-1 en noms de pays dans i18n
// @name:de  Konvertieren Sie den ISO 3166-1-Code in Ländernamen in i18n
// @name:el  μετατρέψτε τον κωδικό ISO 3166-1 σε ονόματα χωρών στο i18n
// @name:iw  המרת קוד ISO 3166-1 לשמות מדינות ב-i18n
// @name:hu  konvertálja az ISO 3166-1 kódot országnevekre az i18n-ben
// @name:id  konversi kode ISO 3166-1 ke nama negara di i18n
// @name:it  converti il codice ISO 3166-1 in nomi di paesi in i18n
// @name:ja  ISO 3166-1 コードを i18n の国名に変換する
// @name:ko  ISO 3166-1 코드를 i18n의 국가 이름으로 변환
// @name:pl  przekonwertować kod ISO 3166-1 na nazwy krajów w i18n
// @name:pt  converter o código ISO 3166-1 para nomes de países em i18n
// @name:ro  convertiți codul ISO 3166-1 în nume de țări în i18n
// @name:ru  преобразовать код ISO 3166-1 в названия стран в i18n
// @name:sr  претворити ИСО_3166-1 код у називе земаља у и18н
// @name:sk  previesť kód ISO 3166-1 na názvy krajín v i18n
// @name:es  convertir el código ISO 3166-1 a nombres de países en i18n
// @name:sv  konvertera ISO 3166-1-kod till landsnamn i i18n
// @name:th  แปลงรหัส ISO 3166-1 เป็นชื่อประเทศใน i18n
// @name:tr  ISO 3166-1 kodunu i18n'de ülke adlarına dönüştürün
// @name:uk  конвертувати код ISO 3166-1 у назви країн у i18n
// @name:ug  ISO 3166-1 كودىنى i18n دىكى دۆلەت نامىغا ئايلاندۇرۇڭ
// @name:vi  chuyển đổi mã ISO 3166-1 thành tên quốc gia trong i18n
// @namespace  sitebucket.net
// @icon  https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @version  0.1
// @author  sitebucket.net
// @match  *://*/*
// @license  Copyright sitebucket.net
// @supportURL  https://github.com/sitebucket/i18n-coutry-names/issues
// @description  convert ISO 3166-1 alpha-2 or alpha-3 or numeric contry/district code to country/district name in i18n
// @description:ar  تحويل ISO 3166-1 alpha-2 أو alpha-3 أو رمز كونتري / حي رقمي إلى اسم البلد / الحي في i18n
// @description:bg  конвертирайте ISO 3166-1 alpha-2 или alpha-3 или цифров код на държава/област в име на държава/област в i18n
// @description:zh-CN  将 ISO 3166-1 alpha-2 或 alpha-3 或数字国家/地区代码转换为 i18n 中的国家/地区名称
// @description:zh-TW  將 ISO 3166-1 alpha-2 或 alpha-3 或數字國家/地區代碼轉換為 i18n 中的國家/地區名稱
// @description:cs  převést ISO 3166-1 alpha-2 nebo alpha-3 nebo číselný kód země/okresu na název země/okresu v i18n
// @description:da  konverter ISO 3166-1 alpha-2 eller alpha-3 eller numerisk land/distriktskode til land/distriktsnavn i i18n
// @description:nl  converteer ISO 3166-1 alfa-2 of alfa-3 of numerieke land-/districtscode naar land-/districtsnaam in i18n
// @description:en  convert ISO 3166-1 alpha-2 or alpha-3 or numeric contry/district code to country/district name in i18n
// @description:eo  konverti ISO 3166-1 alfa-2 aŭ alfa-3 aŭ nombra lando/distrikta kodo al lando/distrikta nomo en i18n
// @description:fi  muuntaa ISO 3166-1 alpha-2 tai alfa-3 tai numeerinen kontry/piirikoodi maan/piirin nimeksi i18n:ssä
// @description:fr  convertir ISO 3166-1 alpha-2 ou alpha-3 ou code numérique de pays/district en nom de pays/district dans i18n
// @description:de  Konvertieren Sie ISO 3166-1 alpha-2 oder alpha-3 oder den numerischen Länder-/Bezirkscode in den Länder-/Bezirksnamen in i18n
// @description:el  μετατροπή ISO 3166-1 alpha-2 ή alpha-3 ή αριθμητικό κωδικό contry/περιοχής σε όνομα χώρας/περιοχής στο i18n
// @description:iw  המרת ISO 3166-1 אלפא-2 או אלפא-3 או קוד ארץ/מחוז מספרי לשם מדינה/מחוז ב-i18n
// @description:hu  az ISO 3166-1 alfa-2 vagy alfa-3 vagy numerikus ország/körzet kód átalakítása ország/körzet nevére az i18n-ben
// @description:id  konversi ISO 3166-1 alpha-2 atau alpha-3 atau kode contry/distrik numerik ke nama negara/distrik di i18n
// @description:it  converti ISO 3166-1 alpha-2 o alpha-3 o codice numerico del paese/distretto in nome del paese/distretto in i18n
// @description:ja  ISO 3166-1 alpha-2 または alpha-3 または数値の国/地区コードを i18n の国/地区名に変換します
// @description:ko  ISO 3166-1 alpha-2 또는 alpha-3 또는 숫자 국가/지역 코드를 i18n의 국가/지역 이름으로 변환
// @description:pl  przekonwertuj ISO 3166-1 alfa-2 lub alfa-3 lub numeryczny kod kraju/powiatu na nazwę kraju/powiatu w i18n
// @description:pt  converter ISO 3166-1 alfa-2 ou alfa-3 ou código numérico do contry/distrito para o nome do país/distrito em i18n
// @description:ro  convertiți ISO 3166-1 alpha-2 sau alpha-3 sau codul numeric de țară/district în numele țării/districtului în i18n
// @description:ru  преобразовать ISO 3166-1 alpha-2 или alpha-3 или числовой код страны/района в название страны/района в i18n
// @description:sr  претвори ИСО_3166-1 алфа-2 или алфа-3 или нумерички код земље/округа у назив земље/округа у и18н
// @description:sk  previesť ISO 3166-1 alpha-2 alebo alpha-3 alebo číselný kód krajiny/okresu na názov krajiny/okresu v i18n
// @description:es  convertir ISO 3166-1 alfa-2 o alfa-3 o código numérico de país/distrito a nombre de país/distrito en i18n
// @description:sv  konvertera ISO 3166-1 alfa-2 eller alfa-3 eller numerisk lands-/distriktskod till lands-/distriktsnamn i i18n
// @description:th  แปลง ISO 3166-1 alpha-2 หรือ alpha-3 หรือรหัส contry/เขตที่เป็นตัวเลขเป็นชื่อประเทศ/เขตใน i18n
// @description:tr  ISO 3166-1 alpha-2 veya alpha-3 veya sayısal ülke/bölge kodunu i18n'de ülke/bölge adına dönüştürün
// @description:uk  конвертувати ISO 3166-1 alpha-2 або alpha-3 або числовий код країни/району в назву країни/району в i18n
// @description:ug  ISO 3166-1 alpha-2 ياكى alfa-3 ياكى رەقەملىك كود / رايون كودىنى i18n دىكى دۆلەت / رايون نامىغا ئايلاندۇرۇش
// @description:vi  chuyển đổi ISO 3166-1 alpha-2 hoặc alpha-3 hoặc mã số liên bang / quận thành tên quốc gia / quận trong i18n
// ==/UserScript==
/* jslint esversion: 6 */
const lang2idx = {ar:0,bn:1,de:2,en:3,es:4,fr:5,hi:6,it:7,jp:8,ko:9,pt:10,ru:11,"zh-cn":12,"zh-hk":13,"zh-tw":14};
const a22idx = {AF:0,AX:1,AL:2,DZ:3,AS:4,AD:5,AO:6,AI:7,AQ:8,AG:9,AR:10,AM:11,AW:12,AU:13,AT:14,AZ:15,BS:16,BH:17,BD:18,BB:19,BY:20,BE:21,BZ:22,BJ:23,BM:24,BT:25,BO:26,BQ:27,BA:28,BW:29,BV:30,BR:31,IO:32,BN:33,BG:34,BF:35,BI:36,CV:37,KH:38,CM:39,CA:40,KY:41,CF:42,TD:43,CL:44,CN:45,CX:46,CC:47,CO:48,KM:49,CG:50,CD:51,CK:52,CR:53,CI:54,HR:55,CU:56,CW:57,CY:58,CZ:59,DK:60,DJ:61,DM:62,DO:63,EC:64,EG:65,SV:66,GQ:67,ER:68,EE:69,SZ:70,ET:71,FK:72,FO:73,FJ:74,FI:75,FR:76,GF:77,PF:78,TF:79,GA:80,GM:81,GE:82,DE:83,GH:84,GI:85,GR:86,GL:87,GD:88,GP:89,GU:90,GT:91,GG:92,GN:93,GW:94,GY:95,HT:96,HM:97,VA:98,HN:99,HK:100,HU:101,IS:102,IN:103,ID:104,IR:105,IQ:106,IE:107,IM:108,IL:109,IT:110,JM:111,JP:112,JE:113,JO:114,KZ:115,KE:116,KI:117,KP:118,KR:119,KW:120,KG:121,LA:122,LV:123,LB:124,LS:125,LR:126,LY:127,LI:128,LT:129,LU:130,MO:131,MG:132,MW:133,MY:134,MV:135,ML:136,MT:137,MH:138,MQ:139,MR:140,MU:141,YT:142,MX:143,FM:144,MD:145,MC:146,MN:147,ME:148,MS:149,MA:150,MZ:151,MM:152,NA:153,NR:154,NP:155,NL:156,NC:157,NZ:158,NI:159,NE:160,NG:161,NU:162,NF:163,MK:164,MP:165,NO:166,OM:167,PK:168,PW:169,PS:170,PA:171,PG:172,PY:173,PE:174,PH:175,PN:176,PL:177,PT:178,PR:179,QA:180,RE:181,RO:182,RU:183,RW:184,BL:185,SH:186,KN:187,LC:188,MF:189,PM:190,VC:191,WS:192,SM:193,ST:194,SA:195,SN:196,RS:197,SC:198,SL:199,SG:200,SX:201,SK:202,SI:203,SB:204,SO:205,ZA:206,GS:207,SS:208,ES:209,LK:210,SD:211,SR:212,SJ:213,SE:214,CH:215,SY:216,TW:217,TJ:218,TZ:219,TH:220,TL:221,TG:222,TK:223,TO:224,TT:225,TN:226,TR:227,TM:228,TC:229,TV:230,UG:231,UA:232,AE:233,GB:234,US:235,UM:236,UY:237,UZ:238,VU:239,VE:240,VN:241,VG:242,VI:243,WF:244,EH:245,YE:246,ZM:247,ZW:248};
const a32idx = {AFG:0,ALA:1,ALB:2,DZA:3,ASM:4,AND:5,AGO:6,AIA:7,ATA:8,ATG:9,ARG:10,ARM:11,ABW:12,AUS:13,AUT:14,AZE:15,BHS:16,BHR:17,BGD:18,BRB:19,BLR:20,BEL:21,BLZ:22,BEN:23,BMU:24,BTN:25,BOL:26,BES:27,BIH:28,BWA:29,BVT:30,BRA:31,IOT:32,BRN:33,BGR:34,BFA:35,BDI:36,CPV:37,KHM:38,CMR:39,CAN:40,CYM:41,CAF:42,TCD:43,CHL:44,CHN:45,CXR:46,CCK:47,COL:48,COM:49,COG:50,COD:51,COK:52,CRI:53,CIV:54,HRV:55,CUB:56,CUW:57,CYP:58,CZE:59,DNK:60,DJI:61,DMA:62,DOM:63,ECU:64,EGY:65,SLV:66,GNQ:67,ERI:68,EST:69,SWZ:70,ETH:71,FLK:72,FRO:73,FJI:74,FIN:75,FRA:76,GUF:77,PYF:78,ATF:79,GAB:80,GMB:81,GEO:82,DEU:83,GHA:84,GIB:85,GRC:86,GRL:87,GRD:88,GLP:89,GUM:90,GTM:91,GGY:92,GIN:93,GNB:94,GUY:95,HTI:96,HMD:97,VAT:98,HND:99,HKG:100,HUN:101,ISL:102,IND:103,IDN:104,IRN:105,IRQ:106,IRL:107,IMN:108,ISR:109,ITA:110,JAM:111,JPN:112,JEY:113,JOR:114,KAZ:115,KEN:116,KIR:117,PRK:118,KOR:119,KWT:120,KGZ:121,LAO:122,LVA:123,LBN:124,LSO:125,LBR:126,LBY:127,LIE:128,LTU:129,LUX:130,MAC:131,MDG:132,MWI:133,MYS:134,MDV:135,MLI:136,MLT:137,MHL:138,MTQ:139,MRT:140,MUS:141,MYT:142,MEX:143,FSM:144,MDA:145,MCO:146,MNG:147,MNE:148,MSR:149,MAR:150,MOZ:151,MMR:152,NAM:153,NRU:154,NPL:155,NLD:156,NCL:157,NZL:158,NIC:159,NER:160,NGA:161,NIU:162,NFK:163,MKD:164,MNP:165,NOR:166,OMN:167,PAK:168,PLW:169,PSE:170,PAN:171,PNG:172,PRY:173,PER:174,PHL:175,PCN:176,POL:177,PRT:178,PRI:179,QAT:180,REU:181,ROU:182,RUS:183,RWA:184,BLM:185,SHN:186,KNA:187,LCA:188,MAF:189,SPM:190,VCT:191,WSM:192,SMR:193,STP:194,SAU:195,SEN:196,SRB:197,SYC:198,SLE:199,SGP:200,SXM:201,SVK:202,SVN:203,SLB:204,SOM:205,ZAF:206,SGS:207,SSD:208,ESP:209,LKA:210,SDN:211,SUR:212,SJM:213,SWE:214,CHE:215,SYR:216,TWN:217,TJK:218,TZA:219,THA:220,TLS:221,TGO:222,TKL:223,TON:224,TTO:225,TUN:226,TUR:227,TKM:228,TCA:229,TUV:230,UGA:231,UKR:232,ARE:233,GBR:234,USA:235,UMI:236,URY:237,UZB:238,VUT:239,VEN:240,VNM:241,VGB:242,VIR:243,WLF:244,ESH:245,YEM:246,ZMB:247,ZWE:248};
const num2idx = {"004":0,"248":1,"008":2,"012":3,"016":4,"020":5,"024":6,"660":7,"010":8,"028":9,"032":10,"051":11,"533":12,"036":13,"040":14,"031":15,"044":16,"048":17,"050":18,"052":19,"112":20,"056":21,"084":22,"204":23,"060":24,"064":25,"068":26,"535":27,"070":28,"072":29,"074":30,"076":31,"086":32,"096":33,"100":34,"854":35,"108":36,"132":37,"116":38,"120":39,"124":40,"136":41,"140":42,"148":43,"152":44,"156":45,"162":46,"166":47,"170":48,"174":49,"178":50,"180":51,"184":52,"188":53,"384":54,"191":55,"192":56,"531":57,"196":58,"203":59,"208":60,"262":61,"212":62,"214":63,"218":64,"818":65,"222":66,"226":67,"232":68,"233":69,"748":70,"231":71,"238":72,"234":73,"242":74,"246":75,"250":76,"254":77,"258":78,"260":79,"266":80,"270":81,"268":82,"276":83,"288":84,"292":85,"300":86,"304":87,"308":88,"312":89,"316":90,"320":91,"831":92,"324":93,"624":94,"328":95,"332":96,"334":97,"336":98,"340":99,"344":100,"348":101,"352":102,"356":103,"360":104,"364":105,"368":106,"372":107,"833":108,"376":109,"380":110,"388":111,"392":112,"832":113,"400":114,"398":115,"404":116,"296":117,"408":118,"410":119,"414":120,"417":121,"418":122,"428":123,"422":124,"426":125,"430":126,"434":127,"438":128,"440":129,"442":130,"446":131,"450":132,"454":133,"458":134,"462":135,"466":136,"470":137,"584":138,"474":139,"478":140,"480":141,"175":142,"484":143,"583":144,"498":145,"492":146,"496":147,"499":148,"500":149,"504":150,"508":151,"104":152,"516":153,"520":154,"524":155,"528":156,"540":157,"554":158,"558":159,"562":160,"566":161,"570":162,"574":163,"807":164,"580":165,"578":166,"512":167,"586":168,"585":169,"275":170,"591":171,"598":172,"600":173,"604":174,"608":175,"612":176,"616":177,"620":178,"630":179,"634":180,"638":181,"642":182,"643":183,"646":184,"652":185,"654":186,"659":187,"662":188,"663":189,"666":190,"670":191,"882":192,"674":193,"678":194,"682":195,"686":196,"688":197,"690":198,"694":199,"702":200,"534":201,"703":202,"705":203,"090":204,"706":205,"710":206,"239":207,"728":208,"724":209,"144":210,"729":211,"740":212,"744":213,"752":214,"756":215,"760":216,"158":217,"762":218,"834":219,"764":220,"626":221,"768":222,"772":223,"776":224,"780":225,"788":226,"792":227,"795":228,"796":229,"798":230,"800":231,"804":232,"784":233,"826":234,"840":235,"581":236,"858":237,"860":238,"548":239,"862":240,"704":241,"092":242,"850":243,"876":244,"732":245,"887":246,"894":247,"716":248};
const idx2cs = [["أفغانستان","আফগানিস্তান","Afghanistan","Afghanistan","Afganistán","AFGHANISTAN","अफगानिस्तान","Afghanistan","アフガニスタン","아프가니스탄","Afeganistão","Афганистан","阿富汗","阿富汗","阿富汗","AF","AFG","004"],
["جزر أولاند","অলান্দ দ্বীপপুঞ্জ","Åland","Åland Islands","Åland","ÅLAND, ÎLES","","Isole Åland","オーランド諸島","올란드 제도","Aland, Ilhas","Аландские острова","奥兰","奧蘭","奧蘭","AX","ALA","248"],
["ألبانيا","আলবেনিয়া","Albanien","Albania","Albania","ALBANIE","अल्बानिया","Albania","アルバニア","알바니아","Albânia","Албания","阿尔巴尼亚","阿爾巴尼亞","阿爾巴尼亞","AL","ALB","008"],
["الجزائر","আলজেরিয়া","Algerien","Algeria","Argelia","ALGÉRIE","अल्जीरिया","Algeria","アルジェリア","알제리","Argélia","Алжир","阿尔及利亚","阿爾及利亞","阿爾及利亞","DZ","DZA","012"],
["ساموا الأمريكية","আমেরিকান সামোয়া","Amerikanisch-Samoa","American Samoa","Samoa Americana","SAMOA AMÉRICAINES","अमेरिकान सामोआ","Samoa Americane","アメリカ領サモア","아메리칸사모아","Samoa Americana","Американское Самоа","美属萨摩亚","美屬薩摩亞","美屬薩摩亞","AS","ASM","016"],
["أندورا","অ্যান্ডোরা","Andorra","Andorra","Andorra","ANDORRE","अंडोरा","Andorra","アンドラ","안도라","Andorra","Андорра","安道尔","安道爾","安道爾","AD","AND","020"],
["أنغولا","অ্যাঙ্গোলা","Angola","Angola","Angola","ANGOLA","अंगोला","Angola","アンゴラ","앙골라","Angola","Ангола","安哥拉","安哥拉","安哥拉","AO","AGO","024"],
["أنغويلا","অ্যাঙ্গুইলা","Anguilla","Anguilla","Anguila","ANGUILLA","अंग्विला","Anguilla","アンギラ","앵귈라","Anguila","Ангилья","安圭拉","安圭拉","安圭拉","AI","AIA","660"],
["القارة القطبية الجنوبية","অ্যান্টার্কটিকা","Antarktis (Sonderstatus durch Antarktisvertrag)","Antarctica","Antártida","ANTARCTIQUE","अंटार्टिका","Antartide","南極","남극","Antártida","Антарктика","南极洲","南極洲","南極洲","AQ","ATA","010"],
["أنتيغوا وباربودا","অ্যান্টিগুয়া ও বার্বুডা","Antigua und Barbuda","Antigua and Barbuda","Antigua y Barbuda","ANTIGUA-ET-BARBUDA","एंटीगुआ और बारबूडा","Antigua e Barbuda","アンティグア・バーブーダ","앤티가 바부다","Antígua e Barbuda","Антигуа и Барбуда","安提瓜和巴布达","安提瓜和巴布達","安地卡及巴布達","AG","ATG","028"],
["الأرجنتين","আর্জেন্টিনা","Argentinien","Argentina","Argentina","ARGENTINE","अर्जेंटिना","Argentina","アルゼンチン","아르헨티나","Argentina","Аргентина","阿根廷","阿根廷","阿根廷","AR","ARG","032"],
["أرمينيا","আর্মেনিয়া","Armenien","Armenia","Armenia","ARMÉNIE","अर्मेनिया","Armenia","アルメニア","아르메니아","Armênia","Армения","亚美尼亚","亞美尼亞","亞美尼亞","AM","ARM","051"],
["أروبا","আরুবা","Aruba","Aruba","Aruba","ARUBA","अरुबा","Aruba","アルバ","아루바","Aruba","Аруба","阿鲁巴","阿魯巴","阿魯巴","AW","ABW","533"],
["أستراليا","অস্ট্রেলিয়া","Australien","Australia","Australia","AUSTRALIE","आस्ट्रेलिया","Australia","オーストラリア","오스트레일리아","Austrália","Австралия","澳大利亚","澳大利亞","澳大利亞","AU","AUS","036"],
["النمسا","অস্ট্রিয়া","Österreich","Austria","Austria","AUTRICHE","आस्ट्रिया","Austria","オーストリア","오스트리아","Áustria","Австрия","奥地利","奧地利","奧地利","AT","AUT","040"],
["أذربيجان","আজারবাইজান","Aserbaidschan","Azerbaijan","Azerbaiyán","AZERBAÏDJAN","अजरबेजान","Azerbaigian","アゼルバイジャン","아제르바이잔","Azerbaijão","Азербайджан","阿塞拜疆","阿塞拜疆","亞塞拜然","AZ","AZE","031"],
["باهاماس","বাহামা দ্বীপপুঞ্জ","Bahamas","Bahamas","Bahamas","BAHAMAS","बहामास","Bahamas","バハマ","바하마","Bahamas","Багамские Острова","巴哈马","巴哈馬","巴哈馬","BS","BHS","044"],
["البحرين","বাহরাইন","Bahrain","Bahrain","Baréin","BAHREÏN","बहरीन","Bahrein","バーレーン","바레인","Barém","Бахрейн","巴林","巴林","巴林","BH","BHR","048"],
["بنغلاديش","বাংলাদেশ","Bangladesch","Bangladesh","Bangladés","BANGLADESH","बांग्लादेश","Bangladesh","バングラデシュ","방글라데시","Bangladexe","Бангладеш","孟加拉国","孟加拉","孟加拉","BD","BGD","050"],
["باربادوس","বার্বাডোস","Barbados","Barbados","Barbados","BARBADE","बार्बाडोस","Barbados","バルバドス","바베이도스","Barbados","Барбадос","巴巴多斯","巴巴多斯","巴貝多","BB","BRB","052"],
["بيلاروس","বেলারুশ","Belarus","Belarus","Bielorrusia","BÉLARUS","बेलारुस","Bielorussia","ベラルーシ","벨라루스","Bielorrússia","Белоруссия","白俄罗斯","白俄羅斯","白俄羅斯","BY","BLR","112"],
["بلجيكا","বেলজিয়াম","Belgien","Belgium","Bélgica","BELGIQUE","बेल्जियम","Belgio","ベルギー","벨기에","Bélgica","Бельгия","比利时","比利時","比利時","BE","BEL","056"],
["بليز","বেলিজ","Belize","Belize","Belice","BELIZE","बेलिजे","Belize","ベリーズ","벨리즈","Belize","Белиз","伯利兹","伯利茲","貝里斯","BZ","BLZ","084"],
["بنين","বেনিন","Benin","Benin","Benín","BÉNIN","बानिन","Benin","ベナン","베냉","Benim","Бенин","贝宁","貝寧","貝南","BJ","BEN","204"],
["برمودا","বারমুডা","Bermuda","Bermuda","Bermudas","BERMUDES","बर्मूडा","Bermuda","バミューダ","버뮤다","Bermudas","Бермуды","百慕大","百慕達","百慕達","BM","BMU","060"],
["بوتان","ভুটান","Bhutan","Bhutan","Bután","BHOUTAN","भूटान","Bhutan","ブータン","부탄","Butão","Бутан","不丹","不丹","不丹","BT","BTN","064"],
["بوليفيا","বলিভিয়া","Bolivien","Bolivia (Plurinational State of)","Bolivia","BOLIVIE, ÉTAT PLURINATIONAL DE","बोलिविया","Bolivia","ボリビア多民族国","볼리비아","Bolívia","Боливия","玻利维亚","玻利維亞","玻利維亞","BO","BOL","068"],
["الجزر الكاريبية الهولندية","ক্যারিবীয় নেদারল্যান্ডস","Bonaire, Saba, Sint Eustatius","Bonaire, Sint Eustatius and Saba","Bonaire, San Eustaquio y Saba","BONAIRE, SAINT-EUSTACHE ET SABA","","Isole BES","ボネール、シント・ユースタティウスおよびサバ","보네르섬","Bonaire, Santo Eustáquio e Saba","Бонайре, Синт-Эстатиус и Саба","荷兰加勒比区","荷蘭加勒比區","荷蘭加勒比區","BQ","BES","535"],
["البوسنة والهرسك","বসনিয়া ও হার্জেগোভিনা","Bosnien und Herzegowina","Bosnia and Herzegovina","Bosnia y Herzegovina","BOSNIE-HERZÉGOVINE","बोस्निया हर्जेगोविना","Bosnia ed Erzegovina","ボスニア・ヘルツェゴビナ","보스니아 헤르체고비나","Bósnia e Herzegovina","Босния и Герцеговина","波黑","波黑","波士尼亞與赫塞哥維納","BA","BIH","070"],
["بوتسوانا","বতসোয়ানা","Botswana","Botswana","Botsuana","BOTSWANA","बोत्सवाना","Botswana","ボツワナ","보츠와나","Botsuana","Ботсвана","博茨瓦纳","博茨瓦納","波札那","BW","BWA","072"],
["جزيرة بوفيه","বুভেট দ্বীপ","","Bouvet Island","Isla Bouvet","BOUVET, ÎLE","बाउवेट","Isola Bouvet","ブーベ島","부베섬","Bouvet, Ilha","Остров Буве","布韦岛","布韋島","布韋島","BV","BVT","074"],
["البرازيل","ব্রাজিল","Brasilien","Brazil","Brasil","BRÉSIL","ब्राजील","Brasile","ブラジル","브라질","Brasil","Бразилия","巴西","巴西","巴西","BR","BRA","076"],
["إقليم المحيط الهندي البريطاني","ব্রিটিশ ভারত মহাসাগরীয় অঞ্চল","Britisches Territorium im Indischen Ozean","British Indian Ocean Territory","Territorio Británico del Océano Índico","OCÉAN INDIEN, TERRITOIRE BRITANNIQUE DE L'","ब्रितानी हिंद महासागरीय क्षेत्र","Territorio britannico dell'Oceano Indiano","イギリス領インド洋地域","영국령 인도양 지역","Território Britânico do Oceano Índico","Британская территория в Индийском океане","英属印度洋领地","英屬印度洋領地","英屬印度洋領地","IO","IOT","086"],
["بروناي","ব্রুনাই","Brunei","Brunei Darussalam","Brunéi","BRUNÉI DARUSSALAM","ब्रुनेई","Brunei","ブルネイ・ダルサラーム","브루나이","Brunei","Бруней","文莱","汶萊","汶萊","BN","BRN","096"],
["بلغاريا","বুলগেরিয়া","Bulgarien","Bulgaria","Bulgaria","BULGARIE","बल्गारिया","Bulgaria","ブルガリア","불가리아","Bulgária","Болгария","保加利亚","保加利亞","保加利亞","BG","BGR","100"],
["بوركينا فاسو","বুর্কিনা ফাসো","Burkina Faso","Burkina Faso","Burkina Faso","BURKINA FASO","बुर्किना फासो","Burkina Faso","ブルキナファソ","부르키나파소","Burquina Fasso","Буркина-Фасо","布基纳法索","布基納法索","布吉納法索","BF","BFA","854"],
["بوروندي","বুরুন্ডি","Burundi","Burundi","Burundi","BURUNDI","बुरुंडी","Burundi","ブルンジ","부룬디","Burundi","Бурунди","布隆迪","布隆迪","蒲隆地","BI","BDI","108"],
["الرأس الأخضر","কেপ ভার্দ","Kap Verde (Cabo Verde)","Cabo Verde","Cabo Verde","CABO VERDE","केप वर्दे","Capo Verde","カーボベルデ","카보베르데","Cabo Verde","Кабо-Верде","佛得角","佛得角","維德角","CV","CPV","132"],
["كمبوديا","কম্বোডিয়া","Kambodscha","Cambodia","Camboya","CAMBODGE","कंबोडिया","Cambogia","カンボジア","캄보디아","Camboja","Камбоджа","柬埔寨","柬埔寨","柬埔寨","KH","KHM","116"],
["الكاميرون","ক্যামেরুন","Kamerun","Cameroon","Camerún","CAMEROUN","कैमरून","Camerun","カメルーン","카메룬","Camarões","Камерун","喀麦隆","喀麥隆","喀麥隆","CM","CMR","120"],
["كندا","কানাডা","Kanada","Canada","Canadá","CANADA","कनाडा","Canada","カナダ","캐나다","Canadá","Канада","加拿大","加拿大","加拿大","CA","CAN","124"],
["جزر كايمان","কেইম্যান দ্বীপপুঞ্জএস","Cayman Islands (Kaimaninseln)","Cayman Islands","Islas Caimán","CAÏMANES, ÎLES","केमैन आइसलैंड्स","Isole Cayman","ケイマン諸島","케이맨 제도","Caimã, Ilhas","Острова Кайман","开曼群岛","開曼群島","開曼群島","KY","CYM","136"],
["جمهورية أفريقيا الوسطى","মধ্য আফ্রিকান প্রজাতন্ত্র","Zentralafrikanische Republik","Central African Republic","República Centroafricana","CENTRAFRICAINE, RÉPUBLIQUE","सेंट्रल अफ्रीका गणतंत्र","Rep. Centrafricana","中央アフリカ共和国","중앙아프리카 공화국","Centro-Africana, República","ЦАР","中非","中非","中非","CF","CAF","140"],
["تشاد","চাদ","Tschad","Chad","Chad","TCHAD","चाड","Ciad","チャド","차드","Chade","Чад","乍得","乍得","查德","TD","TCD","148"],
["تشيلي","চিলি","Chile","Chile","Chile","CHILI","चिली","Cile","チリ","칠레","Chile","Чили","智利","智利","智利","CL","CHL","152"],
["الصين","গণচীন","Volksrepublik China","China","China","CHINE","चीन","Cina","中華人民共和国","중국","China","Китай (Китайская Народная Республика)","中国","中國","中國","CN","CHN","156"],
["جزيرة كريسماس","ক্রিস্টমাস দ্বীপ","Weihnachtsinsel","Christmas Island","Isla de Navidad","CHRISTMAS, ÎLE","क्रिसमस द्वीप","Isola di Natale","クリスマス島","크리스마스섬","Natal, Ilha do (Ilha Christmas)","Остров Рождества","圣诞岛","聖誕島","聖誕島","CX","CXR","162"],
["جزر كوكوس","কোকোস (কিলিং) দ্বীপপুঞ্জ","Kokosinseln","Cocos (Keeling) Islands","Islas Cocos","COCOS (KEELING), ÎLES","कोकोस (कीलिंग) द्वीप","Isole Cocos (Keeling)","ココス（キーリング）諸島","코코스 제도","Cocos, Ilhas","Кокосовые острова","科科斯（基林）群岛","科科斯（基林）群島","科科斯（基林）群島","CC","CCK","166"],
["كولومبيا","কলম্বিয়া","Kolumbien","Colombia","Colombia","COLOMBIE","कोलंबिया","Colombia","コロンビア","콜롬비아","Colômbia","Колумбия","哥伦比亚","哥倫比亞","哥倫比亞","CO","COL","170"],
["جزر القمر","কোমোরোস","Komoren","Comoros","Comoras","COMORES","कोमोरोस","Comore","コモロ","코모로","Comores","Коморы","科摩罗","科摩羅","葛摩","KM","COM","174"],
["جمهورية الكونغو","কঙ্গো প্রজাতন্ত্র","Republik Kongo (ehem. Kongo-Brazzaville)","Congo","República del Congo","CONGO","कांगो","Rep. del Congo","コンゴ共和国","콩고 공화국","Congo, República do","Республика Конго","刚果共和国","剛果共和國","剛果共和國","CG","COG","178"],
["جمهورية الكونغو الديمقراطية","গণতান্ত্রিক কঙ্গো প্রজাতন্ত্র","Demokratische Republik Kongo (ehem. Zaire)","Congo (Democratic Republic of the)","República Democrática del Congo","CONGO, RÉPUBLIQUE DÉMOCRATIQUE DU","","RD del Congo","コンゴ民主共和国","콩고 민주 공화국","Congo, República Democrática do (antigo Zaire)","ДР Конго","刚果民主共和国","剛果民主共和國","剛果民主共和國","CD","COD","180"],
["جزر كوك","কুক দ্বীপপুঞ্জ","Cookinseln","Cook Islands","Islas Cook","COOK, ÎLES","कुक द्वीप","Isole Cook","クック諸島","쿡 제도","Cook, Ilhas","Острова Кука","库克群岛","庫克群島","庫克群島","CK","COK","184"],
["كوستاريكا","কোস্টা রিকা","Costa Rica","Costa Rica","Costa Rica","COSTA RICA","कोस्टा रिका","Costa Rica","コスタリカ","코스타리카","Costa Rica","Коста-Рика","哥斯达黎加","哥斯達黎加","哥斯大黎加","CR","CRI","188"],
["ساحل العاج","কোত দিভোয়ার","Elfenbeinküste (Côte d’Ivoire)","Côte d'Ivoire","Costa de Marfil","CÔTE D’IVOIRE","आइवरी कोस्ट","Costa d'Avorio","コートジボワール","코트디부아르","Costa do Marfim","Кот-д’Ивуар","科特迪瓦","科特迪瓦","象牙海岸","CI","CIV","384"],
["كرواتيا","ক্রোয়েশিয়া","Kroatien","Croatia","Croacia","CROATIE","क्रोएशिया","Croazia","クロアチア","크로아티아","Croácia","Хорватия","克罗地亚","克羅地亞","克羅埃西亞","HR","HRV","191"],
["كوبا","কিউবা","Kuba","Cuba","Cuba","CUBA","क्यूबा","Cuba","キューバ","쿠바","Cuba","Куба","古巴","古巴","古巴","CU","CUB","192"],
["كوراساو","কুরাকাও","Curaçao","Curaçao","Curazao","CURAÇAO","","Curaçao","キュラソー","퀴라소","Curaçau","Кюрасао","库拉索","古拉索","古拉索","CW","CUW","531"],
["قبرص","সাইপ্রাস","Zypern","Cyprus","Chipre","CHYPRE","साइप्रस","Cipro","キプロス","키프로스","Chipre","Кипр","塞浦路斯","塞浦路斯","賽普勒斯","CY","CYP","196"],
["جمهورية التشيك","চেক প্রজাতন্ত্র","Tschechien","Czechia","República Checa","TCHÉQUIE","चेक","Rep. Ceca","チェコ","체코","Chéquia","Чехия","捷克","捷克","捷克","CZ","CZE","203"],
["الدنمارك","ডেনমার্ক","Dänemark","Denmark","Dinamarca","DANEMARK","डैनमार्क","Danimarca","デンマーク","덴마크","Dinamarca","Дания","丹麦","丹麥","丹麥","DK","DNK","208"],
["جيبوتي","জিবুতি","Dschibuti","Djibouti","Yibuti","DJIBOUTI","जिबॉती","Gibuti","ジブチ","지부티","Djibuti","Джибути","吉布提","吉布提","吉布地","DJ","DJI","262"],
["دومينيكا","ডোমিনিকা","Dominica","Dominica","Dominica","DOMINIQUE","डोमिनिक","Dominica","ドミニカ国","도미니카 연방","Dominica","Доминика","多米尼克","多米尼克","多米尼克","DM","DMA","212"],
["جمهورية الدومينيكان","ডোমিনিকান প্রজাতন্ত্র","Dominikanische Republik","Dominican Republic","República Dominicana","DOMINICAINE, RÉPUBLIQUE","डोमिनिक गणतंत्र","Rep. Dominicana","ドミニカ共和国","도미니카 공화국","Dominicana, República","Доминиканская Республика","多米尼加","多米尼加","多明尼加","DO","DOM","214"],
["الإكوادور","ইকুয়েডর","Ecuador","Ecuador","Ecuador","ÉQUATEUR","इक्वाडोर","Ecuador","エクアドル","에콰도르","Equador","Эквадор","厄瓜多尔","厄瓜多爾","厄瓜多","EC","ECU","218"],
["مصر","মিশর","Ägypten","Egypt","Egipto","ÉGYPTE","मिस्र","Egitto","エジプト","이집트","Egito","Египет","埃及","埃及","埃及","EG","EGY","818"],
["السلفادور","এল সালভাদোর","El Salvador","El Salvador","El Salvador","EL SALVADOR","सल्वाडोर","El Salvador","エルサルバドル","엘살바도르","El Salvador","Сальвадор","萨尔瓦多","薩爾瓦多","薩爾瓦多","SV","SLV","222"],
["غينيا الاستوائية","বিষুবীয় গিনি","Äquatorialguinea","Equatorial Guinea","Guinea Ecuatorial","GUINÉE ÉQUATORIALE","एक्वेटोरियल गिनी","Guinea Equatoriale","赤道ギニア","적도 기니","Guiné Equatorial","Экваториальная Гвинея","赤道几内亚","赤道幾內亞","赤道幾內亞","GQ","GNQ","226"],
["إريتريا","ইরিত্রিয়া","Eritrea","Eritrea","Eritrea","ÉRYTHRÉE","एरिट्रेया","Eritrea","エリトリア","에리트레아","Eritreia","Эритрея","厄立特里亚","厄立特里亞","厄利垂亞","ER","ERI","232"],
["إستونيا","এস্তোনিয়া","Estland","Estonia","Estonia","ESTONIE","एस्तोनिया","Estonia","エストニア","에스토니아","Estónia","Эстония","爱沙尼亚","愛沙尼亞","愛沙尼亞","EE","EST","233"],
["إسواتيني","সোয়াজিল্যান্ড","Eswatini","Eswatini","Suazilandia","ESWATINI","स्वाजीलैंड","eSwatini","エスワティニ","에스와티니","Essuatíni","Эсватини","斯威士兰","斯威士蘭","史瓦帝尼","SZ","SWZ","748"],
["إثيوبيا","ইথিওপিয়া","Äthiopien","Ethiopia","Etiopía","ÉTHIOPIE","इथियोपिया","Etiopia","エチオピア","에티오피아","Etiópia","Эфиопия","埃塞俄比亚","埃塞俄比亞","衣索比亞","ET","ETH","231"],
["جزر فوكلاند","ফক্‌ল্যান্ড দ্বীপপুঞ্জ","Falklandinseln","Falkland Islands (Malvinas)","Islas Malvinas","FALKLAND, ÎLES (MALVINAS)","फाकलैंड द्वीप समूह (मालविनास)","Isole Falkland","フォークランド（マルビナス）諸島","포클랜드 제도","Malvinas, Ilhas (Falkland)","Фолклендские острова","福克兰群岛","福克蘭群島","福克蘭群島","FK","FLK","238"],
["جزر فارو","ফারো দ্বীপপুঞ্জ","Färöer","Faroe Islands","Islas Feroe","FÉROÉ, ÎLES","फराओ द्वीप समूह","Fær Øer","フェロー諸島","페로 제도","Feroé, Ilhas","Фарерские острова","法罗群岛","法羅群島","法羅群島","FO","FRO","234"],
["فيجي","ফিজি","Fidschi","Fiji","Fiyi","FIDJI","फिजी","Figi","フィジー","피지","Fiji","Фиджи","斐济","斐濟","斐濟","FJ","FJI","242"],
["فنلندا","ফিনল্যান্ড","Finnland","Finland","Finlandia","FINLANDE","फिनलैंड","Finlandia","フィンランド","핀란드","Finlândia","Финляндия","芬兰","芬蘭","芬蘭","FI","FIN","246"],
["فرنسا","ফ্রান্স","Frankreich","France","Francia","FRANCE","फ्रांस","Francia","フランス","프랑스","França","Франция","法国","法國","法國","FR","FRA","250"],
["غويانا الفرنسية","ফরাসি গায়ানা","Französisch-Guayana","French Guiana","Guayana Francesa","GUYANE FRANÇAISE","फ्रेंच गुआना","Guyana francese","フランス領ギアナ","프랑스령 기아나","Guiana Francesa","Гвиана","法属圭亚那","法屬圭亞那","法屬圭亞那","GF","GUF","254"],
["بولينزيا الفرنسية","ফরাসি পলিনেশিয়া","Französisch-Polynesien","French Polynesia","Polinesia Francesa","POLYNÉSIE FRANÇAISE","फ्रैंच गुआना","Polinesia francese","フランス領ポリネシア","프랑스령 폴리네시아","Polinésia Francesa","Французская Полинезия","法属波利尼西亚","法屬波利尼西亞","法屬玻里尼西亞","PF","PYF","258"],
["أراض فرنسية جنوبية وأنتارتيكية","ফরাসি দক্ষিণাঞ্চলীয় অঞ্চলসমূহ","Französische Süd- und Antarktisgebiete","French Southern Territories","Tierras Australes y Antárticas Francesas","TERRES AUSTRALES FRANÇAISES","फ्रांसीसी दक्षिणी क्षेत्र","Terre australi e antartiche francesi","フランス領南方・南極地域","프랑스령 남방 및 남극 지역","Terras Austrais e Antárticas Francesas (TAAF)","Французские Южные и Антарктические территории","法属南部和南极领地","法屬南部和南極領地","法屬南部和南極領地","TF","ATF","260"],
["الغابون","গাবন","Gabun","Gabon","Gabón","GABON","गैबोन","Gabon","ガボン","가봉","Gabão","Габон","加蓬","加蓬","加彭","GA","GAB","266"],
["غامبيا","গাম্বিয়া","Gambia","Gambia","Gambia","GAMBIE","जांबिया","Gambia","ガンビア","감비아","Gâmbia","Гамбия","冈比亚","岡比亞","甘比亞","GM","GMB","270"],
["جورجيا","জর্জিয়া","Georgien","Georgia","Georgia","GÉORGIE","जॉर्जिया","Georgia","ジョージア","조지아","Geórgia","Грузия","格鲁吉亚","格魯吉亞","喬治亞","GE","GEO","268"],
["ألمانيا","জার্মানি","Deutschland","Germany","Alemania","ALLEMAGNE","जर्मनी","Germania","ドイツ","독일","Alemanha","Германия","德国","德國","德國","DE","DEU","276"],
["غانا","ঘানা","Ghana","Ghana","Ghana","GHANA","घाना","Ghana","ガーナ","가나","Gana","Гана","加纳","加納","加納","GH","GHA","288"],
["جبل طارق","জিব্রাল্টার","Gibraltar","Gibraltar","Gibraltar","GIBRALTAR","जिब्राल्टर","Gibilterra","ジブラルタル","지브롤터","Gibraltar","Гибралтар","直布罗陀","直布羅陀","直布羅陀","GI","GIB","292"],
["اليونان","গ্রিস","Griechenland","Greece","Grecia","GRÈCE","यूनान","Grecia","ギリシャ","그리스","Grécia","Греция","希腊","希臘","希臘","GR","GRC","300"],
["جرينلاند","গ্রিনল্যান্ড","Grönland","Greenland","Groenlandia","GROENLAND","ग्रीनलैंड","Groenlandia","グリーンランド","그린란드","Groenlândia","Гренландия","格陵兰","格陵蘭","格陵蘭","GL","GRL","304"],
["غرينادا","গ্রানাডা","Grenada","Grenada","Granada","GRENADE","ग्रेनेडा","Grenada","グレナダ","그레나다","Granada","Гренада","格林纳达","格林納達","格瑞那達","GD","GRD","308"],
["غوادلوب","গুয়াদলুপ","Guadeloupe","Guadeloupe","Guadalupe","GUADELOUPE","ग्वाडेलोप","Guadalupa","グアドループ","과들루프","Guadalupe","Гваделупа","瓜德罗普","瓜地洛普","瓜地洛普","GP","GLP","312"],
["غوام","গুয়াম","Guam","Guam","Guam","GUAM","ग्वाम","Guam","グアム","괌","Guam","Гуам","关岛","關島","關島","GU","GUM","316"],
["غواتيمالا","গুয়াতেমালা","Guatemala","Guatemala","Guatemala","GUATEMALA","ग्वाटेमाला","Guatemala","グアテマラ","과테말라","Guatemala","Гватемала","危地马拉","危地馬拉","瓜地馬拉","GT","GTM","320"],
["غيرنزي","গুয়ের্ঞ্জি","Guernsey (Kanalinsel)","Guernsey","Guernsey","GUERNESEY","ग्वेर्नसे","Guernsey","ガーンジー","건지섬","Guernsey","Гернси","根西","根西","根西","GG","GGY","831"],
["غينيا","গিনি","Guinea","Guinea","Guinea","GUINÉE","गिनी","Guinea","ギニア","기니","Guiné-Conacri","Гвинея","几内亚","幾內亞","幾內亞","GN","GIN","324"],
["غينيا بيساو","গিনি-বিসাউ","Guinea-Bissau","Guinea-Bissau","Guinea-Bisáu","GUINÉE-BISSAU","गिनी-बिसाउ","Guinea-Bissau","ギニアビサウ","기니비사우","Guiné-Bissau","Гвинея-Бисау","几内亚比绍","幾內亞比紹","幾內亞比索","GW","GNB","624"],
["غيانا","গায়ানা","Guyana","Guyana","Guyana","GUYANA","गुआना","Guyana","ガイアナ","가이아나","Guiana","Гайана","圭亚那","圭亞那","蓋亞那","GY","GUY","328"],
["هايتي","হাইতি","Haiti","Haiti","Haití","HAÏTI","हैती","Haiti","ハイチ","아이티","Haiti","Гаити","海地","海地","海地","HT","HTI","332"],
["جزيرة هيرد وجزر ماكدونالد","হার্ড দ্বীপ ও ম্যাকডোনাল্ড দ্বীপপুঞ্জ","Australien Heard und McDonaldinseln","Heard Island and McDonald Islands","Islas Heard y McDonald","HEARD ET MACDONALD, ÎLES","हर्ड एंड मैकडोनाल्ड द्वीपसमूह","Isole Heard e McDonald","ハード島とマクドナルド諸島","허드 맥도널드 제도","Heard e Ilhas McDonald, Ilha","Херд и Макдональд","赫德岛和麦克唐纳群岛","赫德島和麥克唐納群島","赫德島和麥克唐納群島","HM","HMD","334"],
["الفاتيكان","ভ্যাটিকান সিটি","Vatikanstadt","Holy See","Ciudad del Vaticano","SAINT-SIÈGE (ÉTAT DE LA CITÉ DU VATICAN)","वेटिकन","Città del Vaticano","バチカン市国","바티칸 시국","Vaticano","Ватикан","梵蒂冈","梵蒂岡","梵蒂岡","VA","VAT","336"],
["هندوراس","হন্ডুরাস","Honduras","Honduras","Honduras","HONDURAS","होंडुरास","Honduras","ホンジュラス","온두라스","Honduras","Гондурас","洪都拉斯","洪都拉斯","宏都拉斯","HN","HND","340"],
["هونغ كونغ","হংকং","Hongkong","Hong Kong","Hong Kong","HONG KONG","हांग कांग","Hong Kong","香港","홍콩","Hong Kong","Гонконг","香港","香港","香港","HK","HKG","344"],
["المجر","হাঙ্গেরি","Ungarn","Hungary","Hungría","HONGRIE","हंगरी","Ungheria","ハンガリー","헝가리","Hungria","Венгрия","匈牙利","匈牙利","匈牙利","HU","HUN","348"],
["آيسلندا","আইসল্যান্ড","Island","Iceland","Islandia","ISLANDE","आइसलैंड","Islanda","アイスランド","아이슬란드","Islândia","Исландия","冰岛","冰島","冰島","IS","ISL","352"],
["الهند","ভারত","Indien","India","India","INDE","भारत","India","インド","인도","Índia","Индия","印度","印度","印度","IN","IND","356"],
["إندونيسيا","ইন্দোনেশিয়া","Indonesien","Indonesia","Indonesia","INDONÉSIE","इंडोनेशिया","Indonesia","インドネシア","인도네시아","Indonésia","Индонезия","印度尼西亚","印度尼西亞","印度尼西亞","ID","IDN","360"],
["إيران","ইরান","Iran","Iran (Islamic Republic of)","Irán","IRAN, RÉPUBLIQUE ISLAMIQUE D'","ईरान","Iran","イラン・イスラム共和国","이란","Irã","Иран","伊朗","伊朗","伊朗","IR","IRN","364"],
["العراق","ইরাক","Irak","Iraq","Irak","IRAQ","इराक","Iraq","イラク","이라크","Iraque","Ирак","伊拉克","伊拉克","伊拉克","IQ","IRQ","368"],
["أيرلندا","প্রজাতন্ত্রী আয়ারল্যান্ড","Irland","Ireland","Irlanda","IRLANDE","आयरलैंड","Irlanda","アイルランド","아일랜드","Irlanda","Ирландия","爱尔兰","愛爾蘭","愛爾蘭","IE","IRL","372"],
["جزيرة مان","আইল অব ম্যান","Isle of Man","Isle of Man","Isla de Man","ÎLE DE MAN","आइसल ऑफ मैन","Isola di Man","マン島","맨섬","Man, Ilha de","Остров Мэн","马恩岛","萌島","曼島","IM","IMN","833"],
["إسرائيل","ইসরায়েল","Israel","Israel","Israel","ISRAËL","इजराइल","Israele","イスラエル","이스라엘","Israel","Израиль","以色列","以色列","以色列","IL","ISR","376"],
["إيطاليا","ইতালি","Italien","Italy","Italia","ITALIE","इटली","Italia","イタリア","이탈리아","Itália","Италия","意大利","意大利","義大利","IT","ITA","380"],
["جامايكا","জামাইকা","Jamaika","Jamaica","Jamaica","JAMAÏQUE","जमैका","Giamaica","ジャマイカ","자메이카","Jamaica","Ямайка","牙买加","牙買加","牙買加","JM","JAM","388"],
["اليابان","জাপান","Japan","Japan","Japón","JAPON","जापान","Giappone","日本","일본","Japão","Япония","日本","日本","日本","JP","JPN","392"],
["جيرزي","জার্সি","Jersey (Kanalinsel)","Jersey","Jersey","JERSEY","जर्सी","Jersey","ジャージー","저지섬","Jersey","Джерси","泽西","澤西","澤西","JE","JEY","832"],
["الأردن","জর্দান","Jordanien","Jordan","Jordania","JORDANIE","जॉर्डन","Giordania","ヨルダン","요르단","Jordânia","Иордания","约旦","約旦","約旦","JO","JOR","400"],
["كازاخستان","কাজাখস্তান","Kasachstan","Kazakhstan","Kazajistán","KAZAKHSTAN","कज़ाखिस्तान","Kazakistan","カザフスタン","카자흐스탄","Cazaquistão","Казахстан","哈萨克斯坦","哈薩克","哈薩克","KZ","KAZ","398"],
["كينيا","কেনিয়া","Kenia","Kenya","Kenia","KENYA","केन्या","Kenya","ケニア","케냐","Quênia","Кения","肯尼亚","肯雅","肯亞","KE","KEN","404"],
["كيريباتي","কিরিবাস","Kiribati","Kiribati","Kiribati","KIRIBATI","किरिबिती","Kiribati","キリバス","키리바시","Quiribáti","Кирибати","基里巴斯","基里巴斯","吉里巴斯","KI","KIR","296"],
["كوريا الشمالية","উত্তর কোরিয়া","Nordkorea","Korea (Democratic People's Republic of)","Corea del Norte","CORÉE, RÉPUBLIQUE POPULAIRE DÉMOCRATIQUE DE","उत्तर कोरिया","Corea del Nord","朝鮮民主主義人民共和国","조선민주주의인민공화국","Coreia, República Democrática da (Coreia do Norte)","КНДР (Корейская Народно-Демократическая Республика)","朝鲜","北韓","北韓","KP","PRK","408"],
["كوريا الجنوبية","দক্ষিণ কোরিয়া","Südkorea","Korea (Republic of)","Corea del Sur","CORÉE, RÉPUBLIQUE DE","दक्षिण कोरिया","Corea del Sud","大韓民国","대한민국","Coreia do Sul","Республика Корея","韩国","南韓","南韓","KR","KOR","410"],
["الكويت","কুয়েত","Kuwait","Kuwait","Kuwait","KOWEÏT","कुवैत","Kuwait","クウェート","쿠웨이트","Kuwait","Кувейт","科威特","科威特","科威特","KW","KWT","414"],
["قيرغيزستان","কির্গিজস্তান","Kirgisistan","Kyrgyzstan","Kirguistán","KIRGHIZISTAN","किर्जिस्तान","Kirghizistan","キルギス","키르기스스탄","Quirguistão","Киргизия","吉尔吉斯斯坦","吉爾吉斯","吉爾吉斯","KG","KGZ","417"],
["لاوس","লাওস","Laos","Lao People's Democratic Republic","Laos","LAO, RÉPUBLIQUE DÉMOCRATIQUE POPULAIRE","लाओस","Laos","ラオス人民民主共和国","라오스","Laos","Лаос","老挝","老撾","寮國","LA","LAO","418"],
["لاتفيا","লাতভিয়া","Lettland","Latvia","Letonia","LETTONIE","लात्विया","Lettonia","ラトビア","라트비아","Letônia","Латвия","拉脱维亚","拉脫維亞","拉脫維亞","LV","LVA","428"],
["لبنان","লেবানন","Libanon","Lebanon","Líbano","LIBAN","लेबनान","Libano","レバノン","레바논","Líbano","Ливан","黎巴嫩","黎巴嫩","黎巴嫩","LB","LBN","422"],
["ليسوتو","লেসোথো","Lesotho","Lesotho","Lesoto","LESOTHO","लेसोथो","Lesotho","レソト","레소토","Lesoto","Лесото","莱索托","萊索托","賴索托","LS","LSO","426"],
["ليبيريا","লাইবেরিয়া","Liberia","Liberia","Liberia","LIBÉRIA","लाइबेरिया","Liberia","リベリア","라이베리아","Libéria","Либерия","利比里亚","利比里亞","賴比瑞亞","LR","LBR","430"],
["ليبيا","লিবিয়া","Libyen","Libya","Libia","LIBYE","लीबिया","Libia","リビア","리비아","Líbia","Ливия","利比亚","利比亞","利比亞","LY","LBY","434"],
["ليختنشتاين","লিশটেনস্টাইন","Liechtenstein","Liechtenstein","Liechtenstein","LIECHTENSTEIN","लिक्टेनिस्टीन","Liechtenstein","リヒテンシュタイン","리히텐슈타인","Listenstaine","Лихтенштейн","列支敦士登","列支敦士登","列支敦斯登","LI","LIE","438"],
["ليتوانيا","লিথুয়ানিয়া","Litauen","Lithuania","Lituania","LITUANIE","लिथुआनिया","Lituania","リトアニア","리투아니아","Lituânia","Литва","立陶宛","立陶宛","立陶宛","LT","LTU","440"],
["لوكسمبورغ","লুক্সেমবুর্গ","Luxemburg","Luxembourg","Luxemburgo","LUXEMBOURG","लक्जमबर्ग","Lussemburgo","ルクセンブルク","룩셈부르크","Luxemburgo","Люксембург","卢森堡","盧森堡","盧森堡","LU","LUX","442"],
["ماكاو","ম্যাকাও","Macau","Macao","Macao","MACAO","मकाओ","Macao","マカオ","마카오","Macau","Макао","澳门","澳門","澳門","MO","MAC","446"],
["مدغشقر","মাদাগাস্কার","Madagaskar","Madagascar","Madagascar","MADAGASCAR","मैडागास्कर","Madagascar","マダガスカル","마다가스카르","Madagáscar","Мадагаскар","马达加斯加","馬達加斯加","馬達加斯加","MG","MDG","450"],
["مالاوي","মালাউই","Malawi","Malawi","Malaui","MALAWI","मालावी","Malawi","マラウイ","말라위","Maláui","Малави","马拉维","馬拉維","馬拉威","MW","MWI","454"],
["ماليزيا","মালয়েশিয়া","Malaysia","Malaysia","Malasia","MALAISIE","मलयेशिया","Malaysia","マレーシア","말레이시아","Malásia","Малайзия","马来西亚","馬來西亞","馬來西亞","MY","MYS","458"],
["جزر المالديف","মালদ্বীপ","Malediven","Maldives","Maldivas","MALDIVES","मालदीव","Maldive","モルディブ","몰디브","Maldivas","Мальдивы","马尔代夫","馬爾代夫","馬爾地夫","MV","MDV","462"],
["مالي","মালি","Mali","Mali","Malí","MALI","माली","Mali","マリ","말리","Mali","Мали","马里","馬里","馬利","ML","MLI","466"],
["مالطا","মাল্টা","Malta","Malta","Malta","MALTE","माल्टा","Malta","マルタ","몰타","Malta","Мальта","马耳他","馬爾他","馬爾他","MT","MLT","470"],
["جزر مارشال","মার্শাল দ্বীপপুঞ্জ","Marshallinseln","Marshall Islands","Islas Marshall","MARSHALL, ÎLES","मार्शल द्वीपसमूह","Isole Marshall","マーシャル諸島","마셜 제도","Marshall, Ilhas","Маршалловы Острова","马绍尔群岛","馬紹爾群島","馬紹爾群島","MH","MHL","584"],
["مارتينيك","মার্তিনিক","Martinique","Martinique","Martinica","MARTINIQUE","मार्टिनिक","Martinica","マルティニーク","마르티니크","Martinica","Мартиника","马提尼克","馬丁尼克","馬丁尼克","MQ","MTQ","474"],
["موريتانيا","মৌরিতানিয়া","Mauretanien","Mauritania","Mauritania","MAURITANIE","मॉरितानिया","Mauritania","モーリタニア","모리타니","Mauritânia","Мавритания","毛里塔尼亚","毛里塔尼亞","茅利塔尼亞","MR","MRT","478"],
["موريشيوس","মরিশাস","Mauritius","Mauritius","Mauricio","MAURICE","मारीशस","Mauritius","モーリシャス","모리셔스","Maurícia","Маврикий","毛里求斯","毛里裘斯","模里西斯","MU","MUS","480"],
["مايوت","মায়োত","Mayotte","Mayotte","Mayotte","MAYOTTE","मायोते","Mayotte","マヨット","마요트","Maiote","Майотта","马约特","馬約特","馬約特","YT","MYT","175"],
["المكسيك","মেক্সিকো","Mexiko","Mexico","México","MEXIQUE","मेक्सिको","Messico","メキシコ","멕시코","México","Мексика","墨西哥","墨西哥","墨西哥","MX","MEX","484"],
["ولايات ميكرونيسيا المتحدة","মাইক্রোনেশিয়া যুক্তরাজ্য","Mikronesien","Micronesia (Federated States of)","Micronesia","MICRONÉSIE, ÉTATS FÉDÉRÉS DE","माइक्रोनेशिया","Micronesia","ミクロネシア連邦","미크로네시아 연방","Micronésia, Estados Federados da","Микронезия","密克罗尼西亚联邦","密克羅尼西亞聯邦","密克羅尼西亞聯邦","FM","FSM","583"],
["مولدوفا","মলদোভা","Moldau (Moldawien)","Moldova (Republic of)","Moldavia","MOLDAVIE","मोलदोवा","Moldavia","モルドバ共和国","몰도바","Moldávia","Молдавия","摩尔多瓦","摩爾多瓦","摩爾多瓦","MD","MDA","498"],
["موناكو","মোনাকো","Monaco","Monaco","Mónaco","MONACO","मोनाको","Monaco","モナコ","모나코","Mônaco","Монако","摩纳哥","摩納哥","摩納哥","MC","MCO","492"],
["منغوليا","মঙ্গোলিয়া","Mongolei","Mongolia","Mongolia","MONGOLIE","मंगोलिया","Mongolia","モンゴル","몽골","Mongólia","Монголия","蒙古","蒙古","蒙古","MN","MNG","496"],
["الجبل الأسود","মন্টিনিগ্রো","Montenegro","Montenegro","Montenegro","MONTÉNÉGRO","मोंटेनेग्रो","Montenegro","モンテネグロ","몬테네그로","Montenegro","Черногория","黑山","黑山","蒙特內哥羅","ME","MNE","499"],
["مونتسرات","মন্টসেরাট","Montserrat","Montserrat","Montserrat","MONTSERRAT","मोंटसेराट","Montserrat","モントセラト","몬트세랫","Monserrate","Монтсеррат","蒙特塞拉特","蒙特塞拉特","蒙特塞拉特","MS","MSR","500"],
["المغرب","মরোক্কো","Marokko","Morocco","Marruecos","MAROC","मोरक्को","Marocco","モロッコ","모로코","Marrocos","Марокко","摩洛哥","摩洛哥","摩洛哥","MA","MAR","504"],
["موزمبيق","মোজাম্বিক","Mosambik","Mozambique","Mozambique","MOZAMBIQUE","मोजांबिक","Mozambico","モザンビーク","모잠비크","Moçambique","Мозамбик","莫桑比克","莫桑比克","莫三比克","MZ","MOZ","508"],
["ميانمار","মায়ানমার","Myanmar (Burma)","Myanmar","Birmania","MYANMAR","म्यामांर (बर्मा)","Birmania","ミャンマー","미얀마","Mianmar (antiga Birmânia)","Мьянма","缅甸","緬甸","緬甸","MM","MMR","104"],
["ناميبيا","নামিবিয়া","Namibia","Namibia","Namibia","NAMIBIE","नामीबिया","Namibia","ナミビア","나미비아","Namíbia","Намибия","纳米比亚","納米比亞","納米比亞","NA","NAM","516"],
["ناورو","নাউরু","Nauru","Nauru","Nauru","NAURU","नाउरू","Nauru","ナウル","나우루","Nauru","Науру","瑙鲁","瑙魯","諾魯","NR","NRU","520"],
["نيبال","নেপাল","Nepal","Nepal","Nepal","NÉPAL","नेपाल","Nepal","ネパール","네팔","Nepal","Непал","尼泊尔","尼泊爾","尼泊爾","NP","NPL","524"],
["هولندا","নেদারল্যান্ডস","Niederlande","Netherlands","Países Bajos","PAYS-BAS","नीदरलैंड्स","Paesi Bassi","オランダ","네덜란드","Países Baixos (Holanda)","Нидерланды","荷兰","荷蘭","荷蘭","NL","NLD","528"],
["كاليدونيا الجديدة","নুভেল কালেদোনির ভাষা","Neukaledonien","New Caledonia","Nueva Caledonia","NOUVELLE-CALÉDONIE","न्यू कैलेडोनिया","Nuova Caledonia","ニューカレドニア","누벨칼레도니","Nova Caledônia","Новая Каледония","新喀里多尼亚","新喀里多尼亞","新喀里多尼亞","NC","NCL","540"],
["نيوزيلندا","নিউজিল্যান্ড","Neuseeland","New Zealand","Nueva Zelanda","NOUVELLE-ZÉLANDE","न्यूजीलैंड","Nuova Zelanda","ニュージーランド","뉴질랜드","Nova Zelândia (Aotearoa)","Новая Зеландия","新西兰","新西蘭","紐西蘭","NZ","NZL","554"],
["نيكاراغوا","নিকারাগুয়া","Nicaragua","Nicaragua","Nicaragua","NICARAGUA","निकारागुआ","Nicaragua","ニカラグア","니카라과","Nicarágua","Никарагуа","尼加拉瓜","尼加拉瓜","尼加拉瓜","NI","NIC","558"],
["النيجر","নাইজার","Niger","Niger","Níger","NIGER","नाइजर","Niger","ニジェール","니제르","Níger","Нигер","尼日尔","尼日爾","尼日","NE","NER","562"],
["نيجيريا","নাইজেরিয়া","Nigeria","Nigeria","Nigeria","NIGÉRIA","नाइजीरिया","Nigeria","ナイジェリア","나이지리아","Nigéria","Нигерия","尼日利亚","尼日利亞","奈及利亞","NG","NGA","566"],
["نييوي","নিউয়ে","Niue","Niue","Niue","NIUÉ","नियू","Niue","ニウエ","니우에","Niue","Ниуэ","纽埃","紐埃","紐埃","NU","NIU","570"],
["جزيرة نورفولك","নরফুক ভাষা","Norfolkinsel","Norfolk Island","Isla Norfolk","NORFOLK, ÎLE","नोरफॉक द्वीप","Isola Norfolk","ノーフォーク島","노퍽섬","Norfolque, Ilha","Остров Норфолк","诺福克岛","諾福克島","諾福克島","NF","NFK","574"],
["مقدونيا","ম্যাসেডোনিয়া প্রজাতন্ত্র","Nordmazedonien","North Macedonia","Macedonia del Norte","RÉPUBLIQUE DE MACÉDOINE","मकदूनिया","Macedonia del Nord","北マケドニア","북마케도니아","Macedônia do Norte","Северная Македония","北马其顿","北馬其頓","北馬其頓","MK","MKD","807"],
["جزر ماريانا الشمالية","উত্তরাঞ্চলীয় মারিয়ানা দ্বীপপুঞ্জ","Nördliche Marianen","Northern Mariana Islands","Islas Marianas del Norte","MARIANNES DU NORD, ÎLES","उत्तर मैरिना द्वीपसमूह","Isole Marianne Settentrionali","北マリアナ諸島","북마리아나 제도","Marianas Setentrionais","Северные Марианские Острова","北马里亚纳群岛","北馬利安納群島","北馬利安納群島","MP","MNP","580"],
["النرويج","নরওয়ে","Norwegen","Norway","Noruega","NORVÈGE","नॉर्वे","Norvegia","ノルウェー","노르웨이","Noruega","Норвегия","挪威","挪威","挪威","NO","NOR","578"],
["عمان","ওমান","Oman","Oman","Omán","OMAN","ओमान","Oman","オマーン","오만","Omã","Оман","阿曼","阿曼","阿曼","OM","OMN","512"],
["باكستان","পাকিস্তান","Pakistan","Pakistan","Pakistán","PAKISTAN","पाकिस्तान","Pakistan","パキスタン","파키스탄","Paquistão","Пакистан","巴基斯坦","巴基斯坦","巴基斯坦","PK","PAK","586"],
["بالاو","পালাউ","Palau","Palau","Palaos","PALAOS","पलाउ","Palau","パラオ","팔라우","Palau","Палау","帕劳","帕勞","帛琉","PW","PLW","585"],
["فلسطين","ফিলিস্তিন","Palästina","Palestine, State of","Palestina","ÉTAT DE PALESTINE","","Palestina","パレスチナ","팔레스타인","Palestina","Государство Палестина","巴勒斯坦","巴勒斯坦","巴勒斯坦","PS","PSE","275"],
["بنما","পানামা","Panama","Panama","Panamá","PANAMA","पनामा","Panama","パナマ","파나마","Panamá","Панама","巴拿马","巴拿馬","巴拿馬","PA","PAN","591"],
["بابوا غينيا الجديدة","পাপুয়া নিউগিনি","Papua-Neuguinea","Papua New Guinea","Papúa Nueva Guinea","PAPOUASIE-NOUVELLE-GUINÉE","पापुआ न्यू गिनी","Papua Nuova Guinea","パプアニューギニア","파푸아뉴기니","Papua-Nova Guiné","Папуа — Новая Гвинея","巴布亚新几内亚","巴布亞新幾內亞","巴布亞紐幾內亞","PG","PNG","598"],
["باراغواي","প্যারাগুয়ে","Paraguay","Paraguay","Paraguay","PARAGUAY","पराग्वे","Paraguay","パラグアイ","파라과이","Paraguai","Парагвай","巴拉圭","巴拉圭","巴拉圭","PY","PRY","600"],
["بيرو","পেরু","Peru","Peru","Perú","PÉROU","पेरू","Perù","ペルー","페루","Peru","Перу","秘鲁","秘魯","秘魯","PE","PER","604"],
["الفلبين","ফিলিপাইন","Philippinen","Philippines","Filipinas","PHILIPPINES","फिलीपींस","Filippine","フィリピン","필리핀","Filipinas","Филиппины","菲律宾","菲律賓","菲律賓","PH","PHL","608"],
["جزر بيتكيرن","পিটকেয়ার্ন","Pitcairninseln","Pitcairn","Islas Pitcairn","PITCAIRN","पिटकैर्न द्वीपसमूह","Isole Pitcairn","ピトケアン","핏케언 제도","Pitcairn","Острова Питкэрн","皮特凯恩群岛","皮特凱恩群島","皮特凱恩群島","PN","PCN","612"],
["بولندا","পোল্যান্ড","Polen","Poland","Polonia","POLOGNE","पोलैंड","Polonia","ポーランド","폴란드","Polônia","Польша","波兰","波蘭","波蘭","PL","POL","616"],
["البرتغال","পর্তুগাল","Portugal","Portugal","Portugal","PORTUGAL","पुर्तगाल","Portogallo","ポルトガル","포르투갈","Portugal","Португалия","葡萄牙","葡萄牙","葡萄牙","PT","PRT","620"],
["بورتوريكو","পুয়ের্তো রিকো","Puerto Rico","Puerto Rico","Puerto Rico","PORTO RICO","पुएर्तो रिको","Porto Rico","プエルトリコ","푸에르토리코","Porto Rico","Пуэрто-Рико","波多黎各","波多黎各","波多黎各","PR","PRI","630"],
["قطر","কাতার","Katar","Qatar","Catar","QATAR","क़तार","Qatar","カタール","카타르","Catar","Катар","卡塔尔","卡塔爾","卡達","QA","QAT","634"],
["لا ريونيون","রিইউনিওন","Réunion","Réunion","Reunión","RÉUNION","रीयूनियन","La Riunione","レユニオン","레위니옹","Reunião","Реюньон","留尼汪","留尼汪","留尼旺","RE","REU","638"],
["رومانيا","রোমানিয়া","Rumänien","Romania","Rumania","ROUMANIE","रोमानिया","Romania","ルーマニア","루마니아","Romênia","Румыния","罗马尼亚","羅馬尼亞","羅馬尼亞","RO","ROU","642"],
["روسيا","রাশিয়া","Russland","Russian Federation","Rusia","RUSSIE, FÉDÉRATION DE","रूस","Russia","ロシア連邦","러시아","Rússia","Россия","俄罗斯","俄羅斯","俄羅斯","RU","RUS","643"],
["رواندا","রুয়ান্ডা","Ruanda","Rwanda","Ruanda","RWANDA","रवांडा","Ruanda","ルワンダ","르완다","Ruanda","Руанда","卢旺达","盧旺達","盧安達","RW","RWA","646"],
["سان بارتيلمي","সেইন্ট বার্তলেমি","Saint-Barthélemy Saint-Barthélemy","Saint Barthélemy","San Bartolomé","SAINT-BARTHÉLEMY","","Saint-Barthélemy","サン・バルテルミー","생바르텔레미","São Bartolomeu","Сен-Бартелеми","圣巴泰勒米","聖巴瑟米","聖巴瑟米","BL","BLM","652"],
["سانت هيلانة وأسينشين وتريستان دا كونا","সেন্ট হেলেনা, অ্যাসেনশন ও ত্রিস্তান দা কুনহা","St. Helena, Ascension und Tristan da Cunha","Saint Helena, Ascension and Tristan da Cunha","Santa Elena, Ascensión y Tristán de Acuña","SAINTE-HÉLÈNE, ASCENSION ET TRISTAN DA CUNHA","सेंट हेलेना","Sant'Elena, Ascensione e Tristan da Cunha","セントヘレナ・アセンションおよびトリスタンダクーニャ","세인트헬레나","Santa Helena","Острова Святой Елены, Вознесения и Тристан-да-Кунья","圣赫勒拿、阿森松和特里斯坦-达库尼亚","聖赫勒拿、阿森松和特里斯坦-達庫尼亞","聖赫倫那、阿森松和特里斯坦-達庫尼亞","SH","SHN","654"],
["سانت كيتس ونيفيس","সেন্ট কিট্‌স ও নেভিস","St. Kitts und Nevis","Saint Kitts and Nevis","San Cristóbal y Nieves","SAINT-KITTS-ET-NEVIS","सेंट किट्स एंड नेविस","Saint Kitts e Nevis","セントクリストファー・ネイビス","세인트키츠 네비스","São Cristóvão e Neves","Сент-Китс и Невис","圣基茨和尼维斯","聖吉斯納域斯","聖克里斯多福及尼維斯","KN","KNA","659"],
["سانت لوسيا","সেন্ট লুসিয়া","St. Lucia","Saint Lucia","Santa Lucía","SAINTE-LUCIE","सेंट लुसिया","Saint Lucia","セントルシア","세인트루시아","Santa Lúcia","Сент-Люсия","圣卢西亚","聖盧西亞","聖露西亞","LC","LCA","662"],
["تجمع سان مارتين","সেন্ট মার্টিন (ফরাসি অংশ)","Saint-Martin (französischer Teil)","Saint Martin (French part)","San Martín","SAINT-MARTIN (PARTIE FRANÇAISE)","","Saint-Martin","サン・マルタン（フランス領）","생마르탱","São Martinho (França)","Сен-Мартен","法属圣马丁","法屬聖馬丁","法屬聖馬丁","MF","MAF","663"],
["سان بيير وميكلون","সাঁ পিয়ের ও মিক‌লোঁ","Saint-Pierre und Miquelon","Saint Pierre and Miquelon","San Pedro y Miquelón","SAINT-PIERRE-ET-MIQUELON","सेंट पिएरे एंड मिक्वेलॉन","Saint-Pierre e Miquelon","サンピエール島・ミクロン島","생피에르 미클롱","São Pedro e Miquelão","Сен-Пьер и Микелон","圣皮埃尔和密克隆","聖皮埃與密克隆群島","聖皮埃與密克隆群島","PM","SPM","666"],
["سانت فينسنت والغرينادين","সেন্ট ভিনসেন্ট ও গ্রেনাডাইন দ্বীপপুঞ্জ","St. Vincent und die Grenadinen","Saint Vincent and the Grenadines","San Vicente y las Granadinas","SAINT-VINCENT-ET-LES-GRENADINES","सेंट विंसेंट एंड द ग्रेनेंडाइन्स","Saint Vincent e Grenadine","セントビンセントおよびグレナディーン諸島","세인트빈센트 그레나딘","São Vicente e Granadinas","Сент-Винсент и Гренадины","圣文森特和格林纳丁斯","聖文森特和格林納丁斯","聖文森及格瑞那丁","VC","VCT","670"],
["ساموا","সামোয়া","Samoa","Samoa","Samoa","SAMOA","पश्चिमी सामोआ","Samoa","サモア","사모아","Samoa (Samoa Ocidental)","Самоа","萨摩亚","薩摩亞","薩摩亞","WS","WSM","882"],
["سان مارينو","সান মারিনো","San Marino","San Marino","San Marino","SAINT-MARIN","सैन मारिनो","San Marino","サンマリノ","산마리노","San Marino","Сан-Марино","圣马力诺","聖馬力諾","聖馬利諾","SM","SMR","674"],
["ساو تومي وبرينسيب","সাঁউ তুমি ও প্রিন্সিপি","São Tomé und Príncipe","Sao Tome and Principe","Santo Tomé y Príncipe","SAO TOMÉ-ET-PRINCIPE","साओ टॉम एंड प्रिंसिपी","São Tomé e Príncipe","サントメ・プリンシペ","상투메 프린시페","São Tomé e Príncipe","Сан-Томе и Принсипи","圣多美和普林西比","聖多美和普林西比","聖多美普林西比","ST","STP","678"],
["السعودية","সৌদি আরব","Saudi-Arabien","Saudi Arabia","Arabia Saudita","ARABIE SAOUDITE","सऊदी अरब","Arabia Saudita","サウジアラビア","사우디아라비아","Arábia Saudita","Саудовская Аравия","沙特阿拉伯","沙特阿拉伯","沙烏地阿拉伯","SA","SAU","682"],
["السنغال","সেনেগাল","Senegal","Senegal","Senegal","SÉNÉGAL","सेनेगल","Senegal","セネガル","세네갈","Senegal","Сенегал","塞内加尔","塞內加爾","塞內加爾","SN","SEN","686"],
["صربيا","সার্বিয়া","Serbien","Serbia","Serbia","SERBIE","सर्बिया","Serbia","セルビア","세르비아","Sérvia","Сербия","塞尔维亚","塞爾維亞","塞爾維亞","RS","SRB","688"],
["سيشل","সেশেল","Seychellen","Seychelles","Seychelles","SEYCHELLES","सेशेल्स","Seychelles","セーシェル","세이셸","Seicheles","Сейшельские Острова","塞舌尔","塞舌爾","塞席爾","SC","SYC","690"],
["سيراليون","সিয়েরা লিওন","Sierra Leone","Sierra Leone","Sierra Leona","SIERRA LEONE","सियारा लिओन","Sierra Leone","シエラレオネ","시에라리온","Serra Leoa","Сьерра-Леоне","塞拉利昂","塞拉利昂","獅子山","SL","SLE","694"],
["سنغافورة","সিঙ্গাপুর","Singapur","Singapore","Singapur","SINGAPOUR","सिंगापुर","Singapore","シンガポール","싱가포르","Singapura","Сингапур","新加坡","新加坡","新加坡","SG","SGP","702"],
["سينت مارتن","সিন্ট মার্টেন (ওলন্দাজ অংশ)","Sint Maarten","Sint Maarten (Dutch part)","San Martín","SAINT-MARTIN (PARTIE NÉERLANDAISE)","","Sint Maarten","シント・マールテン（オランダ領）","신트마르턴","São Martinho (Países Baixos)","Синт-Мартен","荷属圣马丁","荷屬聖馬丁","荷屬聖馬丁","SX","SXM","534"],
["سلوفاكيا","স্লোভাকিয়া","Slowakei","Slovakia","Eslovaquia","SLOVAQUIE","स्लोवाकिया","Slovacchia","スロバキア","슬로바키아","Eslováquia","Словакия","斯洛伐克","斯洛伐克","斯洛伐克","SK","SVK","703"],
["سلوفينيا","স্লোভেনিয়া","Slowenien","Slovenia","Eslovenia","SLOVÉNIE","स्लोवानिया","Slovenia","スロベニア","슬로베니아","Eslovênia","Словения","斯洛文尼亚","斯洛文尼亞","斯洛維尼亞","SI","SVN","705"],
["جزر سليمان","সলোমন দ্বীপপুঞ্জ","Salomonen","Solomon Islands","Islas Salomón","SALOMON, ÎLES","सोलोमन द्वीपसमूह","Isole Salomone","ソロモン諸島","솔로몬 제도","Salomão, Ilhas","Соломоновы Острова","所罗门群岛","所羅門群島","索羅門群島","SB","SLB","090"],
["الصومال","সোমালিয়া","Somalia","Somalia","Somalia","SOMALIE","सोमालिया","Somalia","ソマリア","소말리아","Somália","Сомали","索马里","索馬里","索馬利亞","SO","SOM","706"],
["جنوب أفريقيا","দক্ষিণ আফ্রিকা","Südafrika","South Africa","Sudáfrica","AFRIQUE DU SUD","दक्षिण अफ्रीका","Sudafrica","南アフリカ","남아프리카 공화국","África do Sul","ЮАР","南非","南非","南非","ZA","ZAF","710"],
["جورجيا الجنوبية وجزر ساندويتش الجنوبية","দক্ষিণ জর্জিয়া ও দক্ষিণ স্যান্ডউইচ দ্বীপপুঞ্জ","Südgeorgien und die Südlichen Sandwichinseln","South Georgia and the South Sandwich Islands","Islas Georgias del Sur y Sandwich del Sur","GÉORGIE DU SUD ET LES ÎLES SANDWICH DU SUD","दक्षिण जॉर्जिया और दक्षिण सैंडविच द्वीप समूह","Georgia del Sud e Isole Sandwich Australi","サウスジョージア・サウスサンドウィッチ諸島","사우스조지아 사우스샌드위치 제도","Geórgia do Sul e Sanduíche do Sul, Ilhas","Южная Георгия и Южные Сандвичевы Острова","南乔治亚和南桑威奇群岛","南喬治亞和南桑威奇群島","南喬治亞和南桑威奇群島","GS","SGS","239"],
["جنوب السودان","দক্ষিণ সুদান","Südsudan","South Sudan","Sudán del Sur","SOUDAN DU SUD","","Sudan del Sud","南スーダン","남수단","Sudão do Sul","Южный Судан","南苏丹","南蘇丹","南蘇丹","SS","SSD","728"],
["إسبانيا","স্পেন","Spanien","Spain","España","ESPAGNE","स्पेन","Spagna","スペイン","스페인","Espanha","Испания","西班牙","西班牙","西班牙","ES","ESP","724"],
["سريلانكا","শ্রীলঙ্কা","Sri Lanka","Sri Lanka","Sri Lanka","SRI LANKA","श्री लंका","Sri Lanka","スリランカ","스리랑카","Seri Lanca","Шри-Ланка","斯里兰卡","斯里蘭卡","斯里蘭卡","LK","LKA","144"],
["السودان","সুদান","Sudan","Sudan","Sudán","SOUDAN","सूडान","Sudan","スーダン","수단","Sudão","Судан","苏丹","蘇丹","蘇丹","SD","SDN","729"],
["سورينام","সুরিনাম","Suriname","Suriname","Surinam","SURINAME","सूरीनाम","Suriname","スリナム","수리남","Suriname","Суринам","苏里南","蘇里南","蘇利南","SR","SUR","740"],
["سفالبارد ويان ماين","স্বালবার্ড ও জান মায়েন","Spitzbergen und Jan Mayen","Svalbard and Jan Mayen","Svalbard y Jan Mayen","SVALBARD ET ÎLE JAN MAYEN","स्यालबार्ड (स्यालबार्ड एंड जन मावेम)","Svalbard e Jan Mayen","スヴァールバル諸島およびヤンマイエン島","스발바르 얀마옌","Esvalbarde e Jan Mayen","Шпицберген и Ян-Майен","斯瓦尔巴和扬马延","斯瓦爾巴和揚馬延","斯瓦爾巴和揚馬延","SJ","SJM","744"],
["السويد","সুইডেন","Schweden","Sweden","Suecia","SUÈDE","स्वीडन","Svezia","スウェーデン","스웨덴","Suécia","Швеция","瑞典","瑞典","瑞典","SE","SWE","752"],
["سويسرا","সুইজারল্যান্ড","Schweiz (Confoederatio Helvetica)","Switzerland","Suiza","SUISSE","स्विट्जरलैंड","Svizzera","スイス","스위스","Suíça","Швейцария","瑞士","瑞士","瑞士","CH","CHE","756"],
["سوريا","সিরিয়া","Syrien","Syrian Arab Republic","Siria","SYRIENNE, RÉPUBLIQUE ARABE","सीरिया","Siria","シリア・アラブ共和国","시리아","Síria","Сирия","叙利亚","敘利亞","敘利亞","SY","SYR","760"],
["تايوان","তাইওয়ান, চীনের প্রদেশ","Taiwan","Taiwan, Province of China","Taiwán (República de China)","TAÏWAN","ताइवान","Taiwan","台湾 （ 中華民国 ）","타이완","Taiwan","Китайская Республика","中国台湾省","中國台灣省","中國台灣省","TW","TWN","158"],
["طاجيكستان","তাজিকিস্তান","Tadschikistan","Tajikistan","Tayikistán","TADJIKISTAN","तज़ाकिस्तान","Tagikistan","タジキスタン","타지키스탄","Tajiquistão","Таджикистан","塔吉克斯坦","塔吉克","塔吉克","TJ","TJK","762"],
["تنزانيا","তানজানিয়া","Tansania","Tanzania, United Republic of","Tanzania","TANZANIE, RÉPUBLIQUE UNIE DE","तंजानिया","Tanzania","タンザニア","탄자니아","Tanzânia","Танзания","坦桑尼亚","坦桑尼亞","坦尚尼亞","TZ","TZA","834"],
["تايلاند","থাইল্যান্ড","Thailand","Thailand","Tailandia","THAÏLANDE","थाईलैंड","Thailandia","タイ","태국","Tailândia","Таиланд","泰国","泰國","泰國","TH","THA","764"],
["تيمور الشرقية","পূর্ব তিমুর","Osttimor (Timor-Leste)","Timor-Leste","Timor Oriental","TIMOR-LESTE","पूर्वी तिमोर","Timor Est","東ティモール","동티모르","Timor-Leste","Восточный Тимор","东帝汶","東帝汶","東帝汶","TL","TLS","626"],
["توغو","টোগো","Togo","Togo","Togo","TOGO","टोगो","Togo","トーゴ","토고","Togo","Того","多哥","多哥","多哥","TG","TGO","768"],
["توكيلاو","টোকেলাউ","Tokelau","Tokelau","Tokelau","TOKELAU","टोकेलू","Tokelau","トケラウ","토켈라우","Toquelau","Токелау","托克劳","托克勞","托克勞","TK","TKL","772"],
["تونغا","টোঙ্গা","Tonga","Tonga","Tonga","TONGA","टोंगा","Tonga","トンガ","통가","Tonga","Тонга","汤加","湯加","東加","TO","TON","776"],
["ترينيداد وتوباغو","ত্রিনিদাদ ও টোবাগো","Trinidad und Tobago","Trinidad and Tobago","Trinidad y Tobago","TRINITÉ-ET-TOBAGO","ट्रिनिडाड एंड टोबैगो","Trinidad e Tobago","トリニダード・トバゴ","트리니다드 토바고","Trindade e Tobago","Тринидад и Тобаго","特立尼达和多巴哥","特立尼達和多巴哥","千里達及托巴哥","TT","TTO","780"],
["تونس","তিউনিসিয়া","Tunesien","Tunisia","Túnez","TUNISIE","ट्यूनीशिया","Tunisia","チュニジア","튀니지","Tunísia","Тунис","突尼斯","突尼西亞","突尼西亞","TN","TUN","788"],
["تركيا","তুরস্ক","Türkei","Turkey","Turquía","TÜRKİYE1","तुर्की","Turchia","トルコ","튀르키예","Turquia","Турция","土耳其","土耳其","土耳其","TR","TUR","792"],
["تركمانستان","তুর্কমেনিস্তান","Turkmenistan","Turkmenistan","Turkmenistán","TURKMÉNISTAN","तुर्कमेनिस्तान","Turkmenistan","トルクメニスタン","투르크메니스탄","Turcomenistão","Туркмения","土库曼斯坦","土庫曼","土庫曼","TM","TKM","795"],
["جزر توركس وكايكوس","টার্কস্‌ ও কেইকোস দ্বীপপুঞ্জ","Turks- und Caicosinseln","Turks and Caicos Islands","Islas Turcas y Caicos","TURKS ET CAÏQUES, ÎLES","तुर्क एंड कैकोस द्वीपसमूह","Turks e Caicos","タークス・カイコス諸島","터크스 케이커스 제도","Turcas e Caicos","Теркс и Кайкос","特克斯和凯科斯群岛","特克斯與凱科斯群島","特克斯與凱科斯群島","TC","TCA","796"],
["توفالو","টুভালু","Tuvalu","Tuvalu","Tuvalu","TUVALU","तुवालू","Tuvalu","ツバル","투발루","Tuvalu","Тувалу","图瓦卢","圖瓦盧","吐瓦魯","TV","TUV","798"],
["أوغندا","উগান্ডা","Uganda","Uganda","Uganda","OUGANDA","उगांडा","Uganda","ウガンダ","우간다","Uganda","Уганда","乌干达","烏干達","烏干達","UG","UGA","800"],
["أوكرانيا","ইউক্রেন","Ukraine","Ukraine","Ucrania","UKRAINE","उक्रेन","Ucraina","ウクライナ","우크라이나","Ucrânia","Украина","乌克兰","烏克蘭","烏克蘭","UA","UKR","804"],
["الإمارات العربية المتحدة","সংযুক্ত আরব আমিরাত","Vereinigte Arabische Emirate","United Arab Emirates","Emiratos Árabes Unidos","ÉMIRATS ARABES UNIS","संयुक्त अरब अमीरात","Emirati Arabi Uniti","アラブ首長国連邦","아랍에미리트","Emirados Árabes Unidos","ОАЭ","阿联酋","阿聯酋","阿聯","AE","ARE","784"],
["المملكة المتحدة","যুক্তরাজ্য","Vereinigtes Königreich (Großbritannien und Nordirland)","United Kingdom of Great Britain and Northern Ireland","Reino Unido","ROYAUME-UNI","ग्रेट ब्रिटेन","Regno Unito","イギリス","영국","Reino Unido da Grã-Bretanha e Irlanda do Norte","Великобритания","英国","英國","英國","GB","GBR","826"],
["الولايات المتحدة","মার্কিন যুক্তরাষ্ট্র","Vereinigte Staaten","United States of America","Estados Unidos","ÉTATS-UNIS","यूएसए (संयुक्त राज्य अमेरिका)","Stati Uniti","アメリカ合衆国","미국","Estados Unidos","США","美国","美國","美國","US","USA","840"],
["جزر الولايات المتحدة الصغيرة النائية","মার্কিন যুক্তরাষ্ট্রের ক্ষুদ্র পার্শ্ববর্তী দ্বীপপুঞ্জ","Vereinigte Staaten United States Minor Outlying Islands","United States Minor Outlying Islands","Islas Ultramarinas Menores de los Estados Unidos","ÎLES MINEURES ÉLOIGNÉES DES ÉTATS-UNIS","यूएस माइनर आउटलाइंग द्वीपसमूह","Isole minori esterne degli Stati Uniti","合衆国領有小離島","미국령 군소 제도","Menores Distantes dos Estados Unidos, Ilhas","Внешние малые острова США","美国本土外小岛屿","美國本土外小島嶼","美國本土外小島嶼","UM","UMI","581"],
["الأوروغواي","উরুগুয়ে","Uruguay","Uruguay","Uruguay","URUGUAY","उरुग्वे","Uruguay","ウルグアイ","우루과이","Uruguai","Уругвай","乌拉圭","烏拉圭","烏拉圭","UY","URY","858"],
["أوزبكستان","উজবেকিস্তান","Usbekistan","Uzbekistan","Uzbekistán","OUZBÉKISTAN","उजबेकिस्तान","Uzbekistan","ウズベキスタン","우즈베키스탄","Usbequistão","Узбекистан","乌兹别克斯坦","烏茲別克","烏茲別克","UZ","UZB","860"],
["فانواتو","ভানুয়াটু","Vanuatu","Vanuatu","Vanuatu","VANUATU","वनातू","Vanuatu","バヌアツ","바누아투","Vanuatu","Вануату","瓦努阿图","瓦努阿圖","萬那杜","VU","VUT","548"],
["فنزويلا","ভেনেজুয়েলা","Venezuela","Venezuela (Bolivarian Republic of)","Venezuela","VENEZUELA, RÉPUBLIQUE BOLIVARIENNE DU","वेनेजुएला","Venezuela","ベネズエラ・ボリバル共和国","베네수엘라","Venezuela","Венесуэла","委内瑞拉","委內瑞拉","委內瑞拉","VE","VEN","862"],
["فيتنام","ভিয়েতনাম","Vietnam","Viet Nam","Vietnam","VIET NAM","विएतनाम","Vietnam","ベトナム","베트남","Vietnã","Вьетнам","越南","越南","越南","VN","VNM","704"],
["جزر العذراء البريطانية","ব্রিটিশ ভার্জিন দ্বীপপুঞ্জ","Britische Jungferninseln","Virgin Islands (British)","Islas Vírgenes Británicas","ÎLES VIERGES BRITANNIQUES","ब्रितानी वर्जिन द्वीपसमूह","Isole Vergini britanniche","イギリス領ヴァージン諸島","영국령 버진아일랜드","Virgens Britânicas, Ilhas","Виргинские Острова (Великобритания)","英属维尔京群岛","英屬維爾京群島","英屬維京群島","VG","VGB","092"],
["جزر العذراء الأمريكية","মার্কিন যুক্তরাষ্ট্র ভার্জিন দ্বীপপুঞ্জ","Amerikanische Jungferninseln","Virgin Islands (U.S.)","Islas Vírgenes de los Estados Unidos","ÎLES VIERGES DES ÉTATS-UNIS","अमेरिकी वर्जिन द्वीपसमूह","Isole Vergini americane","アメリカ領ヴァージン諸島","미국령 버진아일랜드","Virgens Americanas, Ilhas","Виргинские Острова (США)","美属维尔京群岛","美屬維爾京群島","美屬維京群島","VI","VIR","850"],
["واليس وفوتونا","ওয়ালিস ও ফুটুনা","Wallis und Futuna","Wallis and Futuna","Wallis y Futuna","WALLIS-ET-FUTUNA","वालीज एंड फुटुना","Wallis e Futuna","ウォリス・フツナ","왈리스 푸투나","Wallis e Futuna","Уоллис и Футуна","瓦利斯和富图纳","瓦利斯和富圖那","瓦利斯和富圖那","WF","WLF","876"],
["الصحراء الغربية","পশ্চিম সাহারা","Westsahara","Western Sahara","República Árabe Saharaui Democrática","SAHARA OCCIDENTAL","पश्चिमी सहारा","Sahara Occidentale","西サハラ","서사하라","Saara Ocidental","САДР","西撒哈拉","西撒哈拉","西撒哈拉","EH","ESH","732"],
["اليمن","ইয়েমেন","Jemen","Yemen","Yemen","YÉMEN","यमन","Yemen","イエメン","예멘","Iémen","Йемен","也门","也門","葉門","YE","YEM","887"],
["زامبيا","জাম্বিয়া","Sambia","Zambia","Zambia","ZAMBIE","जांबिया","Zambia","ザンビア","잠비아","Zâmbia","Замбия","赞比亚","贊比亞","尚比亞","ZM","ZMB","894"],
["زيمبابوي","জিম্বাবুয়ে","Simbabwe","Zimbabwe","Zimbabue","ZIMBABWE","ज़िम्बाब्वे","Zimbabwe","ジンバブエ","짐바브웨","Zimbábue","Зимбабве","津巴布韦","津巴布韋","辛巴威","ZW","ZWE","716"]];
function convertlang(lang) {
    lang = lang.toLowerCase();
    if (lang === "zh-mo") lang = "zh-hk";
    if (lang === "zh-my") lang = "zh-cn";
    if (lang === "zh-sg") lang = "zh-cn";
    if (lang.includes("-") && ["ar", "de", "en", "es", "fr", "it", "pt", "ru"].includes(lang.split("-")[0])) lang = lang.split("-")[0];
    return lang;
}
function code2country(code, dict, lang, codes) {
    code = code.toUpperCase();
    lang = convertlang(lang);
    if (dict[code] === undefined) return "";
    if (lang2idx[lang] === undefined) lang = "en";
    let cs = idx2cs[dict[code]];
    let cidx = lang2idx[lang];
    let cn = cs[cidx] === "" ? cs[3] : cs[cidx];
    return codes ? [cn].concat(cs.slice(15, 18)) : cn;
}
function a22country(a2, lang="en", codes=false) {
    return code2country(a2, a22idx, lang, codes);
}
function a32country(a3, lang="en", codes=false) {
    return code2country(a3, a32idx, lang, codes);
}
function num2country(num, lang="en", codes=false) {
    num = "000" + num.toString();
    num = num.substr(num.length - 3, 3);
    return code2country(num, num2idx, lang, codes);
}
