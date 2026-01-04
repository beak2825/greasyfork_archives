// ==UserScript==
// @name         F Titans Toolbar
// @namespace    GF-Fear3d
// @version      1.34
// @description  Enables various cheats in Fap Titans. Creates a toolbar at the bottom of the screen.
// @author       Fear3d
// @match        https://faptitans.com/*
// @run-at		 document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412399/F%20Titans%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/412399/F%20Titans%20Toolbar.meta.js
// ==/UserScript==

const ftBuild = 807;

if (window.SCRIPT_SRC[1] == 'https://cdn.faptitans.com/s1/__' + ftBuild + '/conf.js')
	window.SCRIPT_SRC = ['https://cdn.faptitans.com/s1/__' + ftBuild + '/vendor.js', 'https://fear3d.github.io/FT-Mod/conf.js', 'https://fear3d.github.io/FT-Mod/app.js'];

var isBusy = false;
var doReplaceAvatars = false;

var aHeroes = [
	{name: "Akira Hitsujikai", id: 1, skills: [1000101, 1000102, 1000103, 1000104, 1000105, 1000106, 1000107, 1000108]},
	{name: "Eiko Nousagi", id: 2, skills: [1000201, 1000202, 1000203, 1000204, 1000205, 1000206, 1000207, 1000208]},
	{name: "Zettai Bowcon", id: 100499, skills: [11049901, 11049902, 11049903, 11049904, 11049905, 11049906, 11049907, 11049908]},
	{name: "Hoshi Asashin", id: 3, skills: [1000301, 1000302, 1000303, 1000304, 1000305, 1000306, 1000307, 1000308]},
	{name: "Yukari Tenshi", id: 100500, skills: [11050001, 11050002, 11050003, 11050004, 11050005, 11050006, 11050007, 11050008]},
	{name: "Izumi Yosei", id: 4, skills: [1000401, 1000402, 1000403, 1000404, 1000405, 1000406, 1000407, 1000408]},
	{name: "Moe Kasa", id: 5, skills: [1000501, 1000502, 1000503, 1000504, 1000505, 1000506, 1000507, 1000508]},
	{name: "Ino Yuu", id: 100501, skills: [11050101, 11050102, 11050103, 11050104, 11050105, 11050106, 11050107, 11050108]},
	{name: "Shizuka Neko", id: 6, skills: [1000601, 1000602, 1000603, 1000604, 1000605, 1000606, 1000607, 1000608]},
	{name: "Aika Erufu", id: 7, skills: [1000701, 1000702, 1000703, 1000704, 1000705, 1000706, 1000707, 1000708]},
	{name: "Madoka Kaito", id: 8, skills: [1000801, 1000802, 1000803, 1000804, 1000805, 1000806, 1000807, 1000808]},
	{name: "Atsuko Tarisuto", id: 9, skills: [1000901, 1000902, 1000903, 1000904, 1000905, 1000906, 1000907, 1000908]},
	{name: "Hana Hekishoku", id: 10, skills: [1001001, 1001002, 1001003, 1001004, 1001005, 1001006, 1001007, 1001008]},
	{name: "Shun Soresha", id: 11, skills: [1001101, 1001102, 1001103, 1001104, 1001105, 1001106, 1001107, 1001108]},
	{name: "Okawa Egao", id: 100502, skills: [11050201, 11050202, 11050203, 11050204, 11050205, 11050206, 11050207, 11050208]},
	{name: "Akemi Inma", id: 12, skills: [1001201, 1001202, 1001203, 1001204, 1001205, 1001206, 1001207, 1001208]},
	{name: "Kaori Offredi", id: 13, skills: [1001301, 1001302, 1001303, 1001304, 1001305, 1001306, 1001307, 1001308]},
	{name: "Mariko Kikaibaka", id: 14, skills: [1001401, 1001402, 1001403, 1001404, 1001405, 1001406, 1001407, 1001408]},
	{name: "Naomi Kensei", id: 15, skills: [1001501, 1001502, 1001503, 1001504, 1001505, 1001506, 1001507, 1001508]},
	{name: "Yashida Hiroe", id: 100703, skills: [11070301, 11070302, 11070303, 11070304, 11070305, 11070306, 11070307, 11070308]},
	{name: "Fumiko Hariuddo", id: 16, skills: [1001601, 1001602, 1001603, 1001604, 1001605, 1001606, 1001607, 1001608]},
	{name: "Kamiko Furuto", id: 17, skills: [1001701, 1001702, 1001703, 1001704, 1001705, 1001706, 1001707, 1001708]},
	{name: "Mana Kakitateru", id: 18, skills: [1001801, 1001802, 1001803, 1001804, 1001805, 1001806, 1001807, 1001808]},
	{name: "Ichioka Rei", id: 100701, skills: [11070101, 11070102, 11070103, 11070104, 11070105, 11070106, 11070107, 11070108]},
	{name: "Mi Hyo", id: 19, skills: [1001901, 1001902, 1001903, 1001904, 1001905, 1001906, 1001907, 1001908]},
	{name: "Rika Mahojo", id: 20, skills: [1002001, 1002002, 1002003, 1002004, 1002005, 1002006, 1002007, 1002008]},
	{name: "Sango Yudoku", id: 21, skills: [1002101, 1002102, 1002103, 1002104, 1002105, 1002106, 1002107, 1002108]},
	{name: "Sawano Yusuke", id: 100503, skills: [11050301, 11050302, 11050303, 11050304, 11050305, 11050306, 11050307, 11050308]},
	{name: "Takaro Kaminoken", id: 22, skills: [1002201, 1002202, 1002203, 1002204, 1002205, 1002206, 1002207, 1002208]},
	{name: "Ume Shinpu", id: 23, skills: [1002301, 1002302, 1002303, 1002304, 1002305, 1002306, 1002307, 1002308]},
	{name: "Amaya Karasu", id: 24, skills: [1002401, 1002402, 1002403, 1002404, 1002405, 1002406, 1002407, 1002408]},
	{name: "Chiasa Saike", id: 25, skills: [1002501, 1002502, 1002503, 1002504, 1002505, 1002506, 1002507, 1002508]},
	{name: "Sada Ayaka", id: 1007021, skills: [101702101, 101702102, 101702103, 101702104, 101702105, 101702106, 101702107, 101702108]},
	{name: "Kotobuki Isamu", id: 100702, skills: [11070201, 11070202, 11070203, 11070204, 11070205, 11070206, 11070207, 11070208]},
	{name: "Eri Bado", id: 26, skills: [1002601, 1002602, 1002603, 1002604, 1002605, 1002606, 1002607, 1002608]},
	{name: "Gina Kaizoku", id: 27, skills: [1002701, 1002702, 1002703, 1002704, 1002705, 1002706, 1002707, 1002708]},
	{name: "Bunko Shinpuru", id: 28, skills: [1002801, 1002802, 1002803, 1002804, 1002805, 1002806, 1002807, 1002808]},
	{name: "Haru Kajiya", id: 29, skills: [1002901, 1002902, 1002903, 1002904, 1002905, 1002906, 1002907, 1002908]},
	{name: "Azumi Uchubito", id: 30, skills: [1003001, 1003002, 1003003, 1003004, 1003005, 1003006, 1003007, 1003008]},
	{name: "Bloody Lady", id: 100498, skills: [11049801, 11049802, 11049803, 11049804, 11049805, 11049806, 11049807, 11049808]},
	{name: "Momo Sakuru", id: 31, skills: [1003101, 1003102, 1003103, 1003104, 1003105, 1003106, 1003107, 1003108]},
	{name: "Morimoto Raku", id: 100504, skills: [11050401, 11050402, 11050403, 11050404, 11050405, 11050406, 11050407, 11050408]},
	{name: "Maki Tsuinteru", id: 32, skills: [1003201, 1003202, 1003203, 1003204, 1003205, 1003206, 1003207, 1003208]},
	{name: "Takata Arei", id: 101503, skills: [11150301, 11150302, 11150303, 11150304, 11150305, 11150306, 11150307, 11150308]},
	{name: "Ren Buzoku", id: 33, skills: [1003301, 1003302, 1003303, 1003304, 1003305, 1003306, 1003307, 1003308]},
	{name: "Shika Kakikomi", id: 34, skills: [1003401, 1003402, 1003403, 1003404, 1003405, 1003406, 1003407, 1003408]},
	{name: "Yukiko Hikogatana", id: 35, skills: [1003501, 1003502, 1003503, 1003504, 1003505, 1003506, 1003507, 1003508]},
	{name: "Foxy", id: 100497, skills: [11049701, 11049702, 11049703, 11049704, 11049705, 11049706, 11049707, 11049708]},
	{name: "Marika Tosigawa", id: 36, skills: [1003601, 1003602, 1003603, 1003604, 1003605, 1003606, 1003607, 1003608]},
	{name: "Murayama Naora", id: 37, skills: [1003701, 1003702, 1003703, 1003704, 1003705, 1003706, 1003707, 1003708]},
	{name: "Ogata Wayoko", id: 38, skills: [1003801, 1003802, 1003803, 1003804, 1003805, 1003806, 1003807, 1003808]},
	{name: "Enomoto Runa", id: 39, skills: [1003901, 1003902, 1003903, 1003904, 1003905, 1003906, 1003907, 1003908]},
	{name: "Kono Fukuko", id: 100601, skills: [11060101, 11060102, 11060103, 11060104, 11060105, 11060106, 11060107, 11060108]},
	{name: "Satiri Aisiko", id: 100802, skills: [11080201, 11080202, 11080203, 11080204, 11080205, 11080206, 11080207, 11080208]},
	{name: "Utsunomiya Iwa", id: 101501, skills: [11150101, 11150102, 11150103, 11150104, 11150105, 11150106, 11150107, 11150108]},
	{name: "Taka Usagi", id: 910001, skills: [92000101, 92000102, 92000103, 92000104, 92000105, 92000106, 92000107, 92000108]},
	{name: "Kirua Iwahara", id: 777001, skills: [78700101, 78700102, 78700103, 78700104, 78700105, 78700106, 78700107, 78700108]},
	{name: "Yetina Ogrika", id: 101506, skills: [11150601, 11150602, 11150603, 11150604, 11150605, 11150606, 11150607, 11150608]},
	{name: "Kon Mikazuki", id: 100505, skills: [11050501, 11050502, 11050503, 11050504, 11050505, 11050506, 11050507, 11050508]},
	{name: "Kuro Kubomi", id: 800001, skills: [81000101, 81000102, 81000103, 81000104, 81000105, 81000106, 81000107, 81000108]},
	{name: "Sawami Nakai", id: 920001, skills: [93000101, 93000102, 93000103, 93000104, 93000105, 93000106, 93000107, 93000108]},
	{name: "Rena Ishige", id: 777002, skills: [78700201, 78700202, 78700203, 78700204, 78700205, 78700206, 78700207, 78700208]},
	{name: "Nekoto Hiroka", id: 930001, skills: [94000101, 94000102, 94000103, 94000104, 94000105, 94000106, 94000107, 94000108]},
	{name: "Shime Muika", id: 100602, skills: [11060201, 11060202, 11060203, 11060204, 11060205, 11060206, 11060207, 11060208]},
	//{name: "Teruya Sora", id: 1007022, skills: [101702201, 101702202, 101702203, 101702204, 101702205, 101702206, 101702207, 101702208]},
	{name: "Shion Homma", id: 100803, skills: [11080301, 11080302, 11080303, 11080304, 11080305, 11080306, 11080307, 11080308]},
	{name: "Hokora Joda", id: 777004, skills: [78700401, 78700402, 78700403, 78700404, 78700405, 78700406, 78700407, 78700408]},
	{name: "Chio and Noriko", id: 101502, skills: [11150201, 11150202, 11150203, 11150204, 11150205, 11150206, 11150207, 11150208]},
	{name: "Shimon Enden", id: 777005, skills: [78700501, 78700502, 78700503, 78700504, 78700505, 78700506, 78700507, 78700508]},
	{name: "Otomi Yoshino", id: 940001, skills: [95000101, 95000102, 95000103, 95000104, 95000105, 95000106, 95000107, 95000108]},
	{name: "Waitu Lekka", id: 100496, skills: [11049601, 11049602, 11049603, 11049604, 11049605, 11049606, 11049607, 11049608]},
	{name: "Sharky", id: 100801, skills: [11080101, 11080102, 11080103, 11080104, 11080105, 11080106, 11080107, 11080108]},
	{name: "Zerin Tagami", id: 100804, skills: [11080401, 11080402, 11080403, 11080404, 11080405, 11080406, 11080407, 11080408]},
	{name: "Bambi Inamoto", id: 777006, skills: [78700601, 78700602, 78700603, 78700604, 78700605, 78700606, 78700607, 78700608]},
	{name: "Nenet Hota", id: 100705, skills: [11070501, 11070502, 11070503, 11070504, 11070505, 11070506, 11070507, 11070508]},
	{name: "Kazane Kawazu", id: 100706, skills: [11070601, 11070602, 11070603, 11070604, 11070605, 11070606, 11070607, 11070608]},
	{name: "Yazawa Utako", id: 101504, skills: [11150401, 11150402, 11150403, 11150404, 11150405, 11150406, 11150407, 11150408]},
	{name: "Tamaki Hirai", id: 100707, skills: [11070701, 11070702, 11070703, 11070704, 11070705, 11070706, 11070707, 11070708]},
	{name: "Oruka Kikuchi", id: 100708, skills: [11070801, 11070802, 11070803, 11070804, 11070805, 11070806, 11070807, 11070808]},
	{name: "Ryoumi Nosaka", id: 100510, skills: [11051001, 11051002, 11051003, 11051004, 11051005, 11051006, 11051007, 11051008]},
	{name: "Nanato Konuma", id: 100511, skills: [11051101, 11051102, 11051103, 11051104, 11051105, 11051106, 11051107, 11051108]},
	{name: "Yoshimura Bachiko", id: 100704, skills: [11070401, 11070402, 11070403, 11070404, 11070405, 11070406, 11070407, 11070408]},
	{name: "Amaya Shikichi", id: 1106081, skills: [111608101, 111608102, 111608103, 111608104, 111608105, 111608106, 111608107, 111608108]},
	{name: "Aon Satomi", id: 100512, skills: [11051201, 11051202, 11051203, 11051204, 11051205, 11051206, 11051207, 11051208]},
	{name: "Toto Shiina", id: 100513, skills: [11051301, 11051302, 11051303, 11051304, 11051305, 11051306, 11051307, 11051308]},
	{name: "Sui Yamazato", id: 100514, skills: [11051401, 11051402, 11051403, 11051404, 11051405, 11051406, 11051407, 11051408]},
	{name: "Ichigo Tamano", id: 777008, skills: [78700801, 78700802, 78700803, 78700804, 78700805, 78700806, 78700807, 78700808]},
	{name: "Ozawa Kiyoshi", id: 100603, skills: [11060301, 11060302, 11060303, 11060304, 11060305, 11060306, 11060307, 11060308]},
	{name: "Miho Tsukui", id: 100516, skills: [11051601, 11051602, 11051603, 11051604, 11051605, 11051606, 11051607, 11051608]},
	{name: "Namino Okura", id: 100517, skills: [11051701, 11051702, 11051703, 11051704, 11051705, 11051706, 11051707, 11051708]},
	{name: "Maia Takanashi", id: 100518, skills: [11051801, 11051802, 11051803, 11051804, 11051805, 11051806, 11051807, 11051808]},
	{name: "Misato Seibu", id: 100519, skills: [11051901, 11051902, 11051903, 11051904, 11051905, 11051906, 11051907, 11051908]},
	{name: "Yuki-onna", id: 101505, skills: [11150501, 11150502, 11150503, 11150504, 11150505, 11150506, 11150507, 11150508]},
	{name: "Nerina Inai", id: 100520, skills: [11052001, 11052002, 11052003, 11052004, 11052005, 11052006, 11052007, 11052008]},
	{name: "Koma Kitano", id: 100521, skills: [11052101, 11052102, 11052103, 11052104, 11052105, 11052106, 11052107, 11052108]},
	{name: "Yamane Oya", id: 100522, skills: [11052201, 11052202, 11052203, 11052204, 11052205, 11052206, 11052207, 11052208]},
	{name: "Hata Saji", id: 100523, skills: [11052301, 11052302, 11052303, 11052304, 11052305, 11052306, 11052307, 11052308]},
	{name: "Ai Suga", id: 100515, skills: [11051501, 11051502, 11051503, 11051504, 11051505, 11051506, 11051507, 11051508]},
	{name: "Lia'nyah", id: 100524, skills: [11052401, 11052402, 11052403, 11052404, 11052405, 11052406, 11052407, 11052408]},
	{name: "Miura Arisu", id: 100525, skills: [11052501, 11052502, 11052503, 11052504, 11052505, 11052506, 11052507, 11052508]},
	{name: "Murayama Fumiko", id: 100526, skills: [11052601, 11052602, 11052603, 11052604, 11052605, 11052606, 11052607, 11052608]},
	{name: "Mihara Masako", id: 100527, skills: [11052701, 11052702, 11052703, 11052704, 11052705, 11052706, 11052707, 11052708]},
	{name: "Osada Ayako", id: 100528, skills: [11052801, 11052802, 11052803, 11052804, 11052805, 11052806, 11052807, 11052808]},
	{name: "Hirata Riko", id: 100529, skills: [11052901, 11052902, 11052903, 11052904, 11052905, 11052906, 11052907, 11052908]},
	{name: "Kagawa Ran", id: 100530, skills: [11053001, 11053002, 11053003, 11053004, 11053005, 11053006, 11053007, 11053008]},
	{name: "Ishimoto Yuka", id: 100531, skills: [11053101, 11053102, 11053103, 11053104, 11053105, 11053106, 11053107, 11053108]},
	{name: "Shimabukuro Hana", id: 100532, skills: [11053201, 11053202, 11053203, 11053204, 11053205, 11053206, 11053207, 11053208]},
	{name: "Ishihara Naoki", id: 100533, skills: [11053301, 11053302, 11053303, 11053304, 11053305, 11053306, 11053307, 11053308]},
	{name: "Mura Masa", id: 100534, skills: [11053401, 11053402, 11053403, 11053404, 11053405, 11053406, 11053407, 11053408]},
	{name: "Fujii Haru", id: 100535, skills: [11053501, 11053502, 11053503, 11053504, 11053505, 11053506, 11053507, 11053508]},
	{name: "Horiuchi Nori", id: 100536, skills: [11053601, 11053602, 11053603, 11053604, 11053605, 11053606, 11053607, 11053608]},
	{name: "Seo Sakura", id: 100537, skills: [11053701, 11053702, 11053703, 11053704, 11053705, 11053706, 11053707, 11053708]},
	{name: "Oki Shigeko", id: 100538, skills: [11053801, 11053802, 11053803, 11053804, 11053805, 11053806, 11053807, 11053808]},
	{name: "Arai Hana", id: 100539, skills: [11053901, 11053902, 11053903, 11053904, 11053905, 11053906, 11053907, 11053908]},
	{name: "Sone Aya", id: 100540, skills: [11054001, 11054002, 11054003, 11054004, 11054005, 11054006, 11054007, 11054008]},
	{name: "Soda Masami", id: 100541, skills: [11054101, 11054102, 11054103, 11054104, 11054105, 11054106, 11054107, 11054108]},
	{name: "Asato Kin", id: 100542, skills: [11054201, 11054202, 11054203, 11054204, 11054205, 11054206, 11054207, 11054208]},
	{name: "Kawano Shizuka", id: 100543, skills: [11054301, 11054302, 11054303, 11054304, 11054305, 11054306, 11054307, 11054308]},
	{name: "Sadow Aiko", id: 100544, skills: [11054401, 11054402, 11054403, 11054404, 11054405, 11054406, 11054407, 11054408]},
	{name: "Adachi Hisoka", id: 100545, skills: [11054501, 11054502, 11054503, 11054504, 11054505, 11054506, 11054507, 11054508]},
	{name: "Yamane Kyou", id: 100546, skills: [11054601, 11054602, 11054603, 11054604, 11054605, 11054606, 11054607, 11054608]},
	{name: "Saeki Chika", id: 100547, skills: [11054701, 11054702, 11054703, 11054704, 11054705, 11054706, 11054707, 11054708]},
	{name: "Okura Toshika", id: 100548, skills: [11054801, 11054802, 11054803, 11054804, 11054805, 11054806, 11054807, 11054808]},
	{name: "Ida Akane", id: 100549, skills: [11054901, 11054902, 11054903, 11054904, 11054905, 11054906, 11054907, 11054908]},
	{name: "Tanji Rei", id: 100550, skills: [11055001, 11055002, 11055003, 11055004, 11055005, 11055006, 11055007, 11055008]},
	{name: "Hirayama Sango", id: 100551, skills: [11055101, 11055102, 11055103, 11055104, 11055105, 11055106, 11055107, 11055108]},
	{name: "Tamaki Naoki", id: 100552, skills: [11055201, 11055202, 11055203, 11055204, 11055205, 11055206, 11055207, 11055208]},
	{name: "Ohara Azumi", id: 100553, skills: [11055301, 11055302, 11055303, 11055304, 11055305, 11055306, 11055307, 11055308]},
	{name: "Kinoshita Bunko", id: 100554, skills: [11055401, 11055402, 11055403, 11055404, 11055405, 11055406, 11055407, 11055408]},
	{name: "Saiki Nana", id: 100555, skills: [11055501, 11055502, 11055503, 11055504, 11055505, 11055506, 11055507, 11055508]},
	{name: "Kamei Yuko", id: 100556, skills: [11055601, 11055602, 11055603, 11055604, 11055605, 11055606, 11055607, 11055608]},
	{name: "Tsutsui Kin", id: 100557, skills: [11055701, 11055702, 11055703, 11055704, 11055705, 11055706, 11055707, 11055708]},
	{name: "Takenaka Mi", id: 100558, skills: [11055801, 11055802, 11055803, 11055804, 11055805, 11055806, 11055807, 11055808]},
	{name: "Hirata Kazue", id: 100559, skills: [11055901, 11055902, 11055903, 11055904, 11055905, 11055906, 11055907, 11055908]},
	{name: "Onaga Kyo", id: 100560, skills: [11056001, 11056002, 11056003, 11056004, 11056005, 11056006, 11056007, 11056008]},
	{name: "Domen Ai", id: 100561, skills: [11056101, 11056102, 11056103, 11056104, 11056105, 11056106, 11056107, 11056108]},
	{name: "Hirata Kazue", id: 100559, skills: [11055901, 11055902, 11055903, 11055904, 11055905, 11055906, 11055907, 11055908]},
	{name: "Onaga Kyo", id: 100560, skills: [11056001, 11056002, 11056003, 11056004, 11056005, 11056006, 11056007, 11056008]},
	{name: "Domen Ai", id: 100561, skills: [11056101, 11056102, 11056103, 11056104, 11056105, 11056106, 11056107, 11056108]},
	{name: "Noya Moriko", id: 100562, skills: [11056201, 11056202, 11056203, 11056204, 11056205, 11056206, 11056207, 11056208]},
	{name: "Ushioda Romi", id: 100604, skills: [11060401, 11060402, 11060403, 11060404, 11060405, 11060406, 11060407, 11060408]},
	{name: "Namba Kayo", id: 100563, skills: [11056301, 11056302, 11056303, 11056304, 11056305, 11056306, 11056307, 11056308]},
	{name: "Asato Mana", id: 100564, skills: [11056401, 11056402, 11056403, 11056404, 11056405, 11056406, 11056407, 11056408]},
	{name: "Higashi Asuka", id: 100565, skills: [11056501, 11056502, 11056503, 11056504, 11056505, 11056506, 11056507, 11056508]},
	{name: "Shintani Mi", id: 100566, skills: [11056601, 11056602, 11056603, 11056604, 11056605, 11056606, 11056607, 11056608]},
	{name: "Okane Haru", id: 100567, skills: [11056701, 11056702, 11056703, 11056704, 11056705, 11056706, 11056707, 11056708]},
	{name: "Tokuda Moe", id: 100568, skills: [11056801, 11056802, 11056803, 11056804, 11056805, 11056806, 11056807, 11056808]},
	{name: "Kibe Kame", id: 100569, skills: [11056901, 11056902, 11056903, 11056904, 11056905, 11056906, 11056907, 11056908]},
	{name: "Ozaki Amaya", id: 100570, skills: [11057001, 11057002, 11057003, 11057004, 11057005, 11057006, 11057007, 11057008]},
	{name: "Sumida Aiko", id: 100571, skills: [11057101, 11057102, 11057103, 11057104, 11057105, 11057106, 11057107, 11057108]},
	{name: "Harada Suzume", id: 100572, skills: [11057201, 11057202, 11057203, 11057204, 11057205, 11057206, 11057207, 11057208]},
	{name: "Yasutake Tamiko", id: 100573, skills: [11057301, 11057302, 11057303, 11057304, 11057305, 11057306, 11057307, 11057308]},
	{name: "Suda Rei", id: 100574, skills: [11057401, 11057402, 11057403, 11057404, 11057405, 11057406, 11057407, 11057408]},
	{name: "Kimoto Gina", id: 100575, skills: [11057501, 11057502, 11057503, 11057504, 11057505, 11057506, 11057507, 11057508]},
	{name: "Maeda Riko", id: 100576, skills: [11057601, 11057602, 11057603, 11057604, 11057605, 11057606, 11057607, 11057608]},
	{name: "Kawasaki Mariko", id: 100577, skills: [11057701, 11057702, 11057703, 11057704, 11057705, 11057706, 11057707, 11057708]},
	{name: "Sada Kazuko", id: 100578, skills: [11057801, 11057802, 11057803, 11057804, 11057805, 11057806, 11057807, 11057808]},
	{name: "Ishikawa Miho", id: 111666, skills: [12166601, 12166602, 12166603, 12166604, 12166605, 12166606, 12166607, 12166608]},
	{name: "Izumi Teruko", id: 100579, skills: [11057901, 11057902, 11057903, 11057904, 11057905, 11057906, 11057907, 11057908]},
	{name: "Kawata Hoshi", id: 100580, skills: [11058001, 11058002, 11058003, 11058004, 11058005, 11058006, 11058007, 11058008]},
	{name: "Kamei Mana", id: 1005801, skills: [101580101, 101580102, 101580103, 101580104, 101580105, 101580106, 101580107, 101580108]},
	{name: "Hase Yasuko", id: 100581, skills: [11058101, 11058102, 11058103, 11058104, 11058105, 11058106, 11058107, 11058108]},
	{name: "Kataoka Ayako", id: 100582, skills: [11058201, 11058202, 11058203, 11058204, 11058205, 11058206, 11058207, 11058208]},
	{name: "Otani Kyo", id: 100583, skills: [11058301, 11058302, 11058303, 11058304, 11058305, 11058306, 11058307, 11058308]},
	{name: "Harada Nobuko", id: 100584, skills: [11058401, 11058402, 11058403, 11058404, 11058405, 11058406, 11058407, 11058408]},
	{name: "Hamasaki Aimi", id: 100585, skills: [11058501, 11058502, 11058503, 11058504, 11058505, 11058506, 11058507, 11058508]},
	{name: "Tamanaha Aiko", id: 100586, skills: [11058601, 11058602, 11058603, 11058604, 11058605, 11058606, 11058607, 11058608]},
	{name: "Sugai Usagi", id: 100587, skills: [11058701, 11058702, 11058703, 11058704, 11058705, 11058706, 11058707, 11058708]},
	{name: "Tajima Nana", id: 100588, skills: [11058801, 11058802, 11058803, 11058804, 11058805, 11058806, 11058807, 11058808]},
	{name: "Kure Kiku", id: 100589, skills: [11058901, 11058902, 11058903, 11058904, 11058905, 11058906, 11058907, 11058908]},
	{name: "Mase Amaya", id: 100590, skills: [11059001, 11059002, 11059003, 11059004, 11059005, 11059006, 11059007, 11059008]},
	{name: "Omura Gina", id: 100591, skills: [11059101, 11059102, 11059103, 11059104, 11059105, 11059106, 11059107, 11059108]},
	{name: "Nishiyama Hana", id: 100592, skills: [11059201, 11059202, 11059203, 11059204, 11059205, 11059206, 11059207, 11059208]},
	{name: "Kurata Chieko", id: 100593, skills: [11059301, 11059302, 11059303, 11059304, 11059305, 11059306, 11059307, 11059308]},
	{name: "Ouchi Nori", id: 100594, skills: [11059401, 11059402, 11059403, 11059404, 11059405, 11059406, 11059407, 11059408]},
	{name: "Konishi Aimi", id: 100595, skills: [11059501, 11059502, 11059503, 11059504, 11059505, 11059506, 11059507, 11059508]},
	{name: "Kaya Teruko", id: 100596, skills: [11059601, 11059602, 11059603, 11059604, 11059605, 11059606, 11059607, 11059608]},
	//{name: "Oshiro Teruko", id: 100597, skills: [11059701, 11059702, 11059703, 11059704, 11059705, 11059706, 11059707, 11059708]},
	{name: "Ayumi Hayashi", id: 100598, skills: [11059801, 11059802, 11059803, 11059804, 11059805, 11059806, 11059807, 11059808]},
	//{name: "Maruyama Aya", id: 100599, skills: [11059901, 11059902, 11059903, 11059904, 11059905, 11059906, 11059907, 11059908]},
	{name: "Shima Kiku", id: 100600, skills: [11060001, 11060002, 11060003, 11060004, 11060005, 11060006, 11060007, 11060008]},
	//{name: "Domen Minori", id: 110601, skills: [12060101, 12060102, 12060103, 12060104, 12060105, 12060106, 12060107, 12060108]},
	{name: "Uratsu Mitsunami", id: 110602, skills: [12060201, 12060202, 12060203, 12060204, 12060205, 12060206, 12060207, 12060208]}
	//{name: "Sumida Okichi", id: 110603, skills: [12060301, 12060302, 12060303, 12060304, 12060305, 12060306, 12060307, 12060308]}, // DPS All
	//{name: "Arimaki Honozumi", id: 110604, skills: [12060401, 12060402, 12060403, 12060404, 12060405, 12060406, 12060407, 12060408]},
	//{name: "Miki Tomiju", id: 110605, skills: [12060501, 12060502, 12060503, 12060504, 12060505, 12060506, 12060507, 12060508]},
	//{name: "Izumi Akemi", id: 110606, skills: [12060601, 12060602, 12060603, 12060604, 12060605, 12060606, 12060607, 12060608]},
	//{name: "Aoki Sayuri", id: 110607, skills: [12060701, 12060702, 12060703, 12060704, 12060705, 12060706, 12060707, 12060708]},
	//{name: "Kase Rika", id: 110608, skills: [12060801, 12060802, 12060803, 12060804, 12060805, 12060806, 12060807, 12060808]},
	//{name: "Anno Kayo", id: 110609, skills: [12060901, 12060902, 12060903, 12060904, 12060905, 12060906, 12060907, 12060908]},
	//{name: "Ikeda Natsuko", id: 110610, skills: [12061001, 12061002, 12061003, 12061004, 12061005, 12061006, 12061007, 12061008]},
	//{name: "Isa Hanako", id: 110611, skills: [12061101, 12061102, 12061103, 12061104, 12061105, 12061106, 12061107, 12061108]},
	//{name: "Iseri Yoshi", id: 110612, skills: [12061201, 12061202, 12061203, 12061204, 12061205, 12061206, 12061207, 12061208]},
	//{name: "Sama Shiori", id: 110613, skills: [12061301, 12061302, 12061303, 12061304, 12061305, 12061306, 12061307, 12061308]},
];

// Declare bars
var chToolBar = window.top.document.createElement('div');
var progBar = document.createElement('div');
var progPerc = document.createElement('div');

function post(method, args) {

	method = 'data={"method":"' + method + '","args":{' + args.replace(/\b[a-zA-Z_][a-zA-Z0-9_]+\b/g, '"$&"') + '},"uniqueSid":"' + uniqueSid + '"}';

	var poster = new XMLHttpRequest();
	poster.open('POST', 'https://faptitans.com/api/', false);
	poster.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	poster.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	poster.setRequestHeader('X-CSRFToken', document.cookie.split('csrftoken=')[1].split(';')[0]);
	poster.send(method); console.log(method); console.log(poster.responseText); 
}

function sleep(ms) {
	console.log("Waiting " + ms + " milliseconds...");
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function trainSkills()
{
	let myPerc = 1;
	progPerc.style.display = 'block';

	for (let i = 0; i < aHeroes.length; i++) 
	{
		post('heroes.abilities.buy_all', `heroId:${aHeroes[i].id},_ids:[${aHeroes[i].skills[0]},${aHeroes[i].skills[1]},${aHeroes[i].skills[2]},${aHeroes[i].skills[3]},${aHeroes[i].skills[4]},${
			aHeroes[i].skills[5]},${aHeroes[i].skills[6]},${aHeroes[i].skills[7]}]`);

		if ((i + 1) % 5 == 0)
		{
			myPerc = (100 / aHeroes.length * i).toFixed(0) + '%';
			progPerc.style.width = myPerc;
			progPerc.innerHTML = myPerc;
			await sleep(2000);
		}
	}

	isBusy = false;
	progPerc.innerHTML = '';
	progPerc.style.width = '1%';
	progPerc.style.display = 'none';

	console.log("Finished training skills! Reload the game to see the results.");
	alert("Finished training skills! Reload the game to see the results.");
}

async function useSkills(times) {
	let myPerc = 1;
	progPerc.style.display = 'block';

	for (let i = 1; i <= times; i++)
	{
		post("skills.activate","_id:1,lastUsed:0");
		post("skills.activate","_id:2,lastUsed:0");
		post("skills.activate","_id:3,lastUsed:0");

		myPerc = (100 / times * i).toFixed(0);
		progPerc.style.width = myPerc + '%';

		await sleep(2000);
	}

	isBusy = false;
	progPerc.style.width = '1%';
	progPerc.style.display = 'none';

	console.log("Finished using skills.");
	alert("Finished using skills.");
}

async function doReborn(times) 
{
	let myPerc = 1;
	progPerc.style.display = 'block';

	for (let i = 1; i <= times; i++)
	{
		let request = new XMLHttpRequest;

		request.open('POST', 'api/', false);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		request.setRequestHeader('X-CSRFToken', document.cookie.split('csrftoken=')[1].split(';')[0]);
		request.send('data={"method":"battle.monsterKilled","args":{"gameTime":0,"clicks":{"__dec__":0,"val":"1e19999"},"reward":{"res":{"gold":{"__dec__":0,"val":"1e19999"}}}},"uniqueSid":"' + uniqueSid + '"}');
		await sleep(2000);
		post("heroes.buy","_id:1,level:1,source:list");
		post("heroes.buy","_id:1,level:200,source:list");
		post("heroes.buy","_id:1,level:200,source:list");
		post("heroes.buy","_id:1,level:200,source:list");
		post("heroes.buy","_id:1,level:200,source:list");
		await sleep(2000);
		post("heroes.buy","_id:1,level:200,source:list");
		post("heroes.buy","_id:1,level:200,source:list");
		post("heroes.buy","_id:1,level:200,source:list");
		post("heroes.buy","_id:1,level:200,source:list");
		post("heroes.buy","_id:1,level:200,source:list");
		await sleep(2000);
		post("heroes.buy","_id:1,level:200,source:list");
		await sleep(500);
		post("user.reborn","clearAll:true,isNew:true");

		myPerc = (100 / times * i).toFixed(0);
		progPerc.style.width = myPerc + '%';
		progPerc.innerHTML = i.toString();

		console.log(">>> Reborn: " + i + " <<<");
		await sleep(2000);
	}

	isBusy = false;
	progPerc.innerHTML = '';
	progPerc.style.width = '1%';
	progPerc.style.display = 'none';

	console.log("Finished doing reborns.");
	alert("Finished doing reborns.");
}

async function levelMase(times) 
{
	var myPerc = 1;
	progPerc.style.display = 'block';

	for (let i = 1; i <= times; i++)
	{
		post("heroes.buy","_id:100590,level:1000,source:list");
		post("heroes.buy","_id:100590,level:1000,source:list");
		post("heroes.buy","_id:100590,level:1000,source:list");
		post("heroes.buy","_id:100590,level:1000,source:list");
		post("heroes.buy","_id:100590,level:1000,source:list");

		myPerc = (100 / times * i).toFixed(0) + '%';
		progPerc.style.width = myPerc;
		progPerc.innerHTML = myPerc;

		await sleep(2000);
	}

	isBusy = false;
	progPerc.innerHTML = '';
	progPerc.style.width = '1%';
	progPerc.style.display = 'none';

	console.log("Finished leveling Mase Amaya. Reload the game to see the results.");
	alert("Finished leveling Mase Amaya " + (times * 5000) + " times. Reload game to see results.");
}

async function levelHeroes()
{
	let myPerc = 1;
	progPerc.style.display = 'block';

	for (let i = 0; i < aHeroes.length; i++) 
	{
		post("heroes.buy", "_id:" + aHeroes[i].id + ",level:1000,source:list");

		if ((i + 1) % 5 == 0)
		{
			myPerc = (100 / aHeroes.length * i).toFixed(0) + '%';
			progPerc.style.width = myPerc;
			progPerc.innerHTML = myPerc;
			await sleep(2000);
		}
	}

	isBusy = false;
	progPerc.innerHTML = '';
	progPerc.style.width = '1%';
	progPerc.style.display = 'none';

	console.log("Finished leveling heroes! Reload the game to see the results.");
	alert("Finished leveling heroes! Reload the game to see the results.");
}

function btnMaxGoldClick() {
	if (isBusy) {
		return;
	}

	var request=new XMLHttpRequest;

	request.open('POST', 'api/', false);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	request.setRequestHeader('X-CSRFToken', document.cookie.split('csrftoken=')[1].split(';')[0]);
	request.send('data={"method":"battle.monsterKilled","args":{"gameTime":0,"clicks":{"__dec__":0,"val":"10e99999"},"reward":{"res":{"gold":{"__dec__":0,"val":"10e99999"}}}},"uniqueSid":"' + uniqueSid + '"}');
	
	console.log("Gold added! Reload the game to see the results.");
	alert("Gold added! Reload the game to see the results.");
}

function btnModGoldClick() {
	if (isBusy) {
		return;
	}

	var request=new XMLHttpRequest;

	request.open('POST', 'api/', false);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	request.setRequestHeader('X-CSRFToken', document.cookie.split('csrftoken=')[1].split(';')[0]);
	request.send('data={"method":"battle.monsterKilled","args":{"gameTime":0,"clicks":{"__dec__":0,"val":"10e999"},"reward":{"res":{"gold":{"__dec__":0,"val":"10e999"}}}},"uniqueSid":"' + uniqueSid + '"}');
	
	console.log("Gold added! Reload the game to see the results.");
	alert("Gold added! Reload the game to see the results.");
}

function btnRebornClick() {
	if (isBusy) {
		return;
	}

	var numReborns = prompt("Enter number of reborns:", "100");

	if (numReborns)
	{
		isBusy = true;
		console.log("Starting reborns.");
		doReborn(parseInt(numReborns));
	}
}

function btnLevelMaseClick() {
	if (isBusy) {
		return;
	}

	var numLevels = prompt("Enter <number> x 5000 of levels (i.e. if you enter 3, it will level her 15000 times):", "2");

	if (numLevels)
	{
		isBusy = true;
		levelMase(parseInt(numLevels));
	}
}

function btnMassLevelClick() {
	if (isBusy) {
		return;
	}

	isBusy = true;
	console.log("Starting mass level.");
	levelHeroes();
}

function btnTrainClick() {
	if (isBusy) {
		return;
	}

	isBusy = true;
	console.log("Starting train all.");
	trainSkills();
}


function btnSkill10Click() {
	if (isBusy) {
		return;
	}

	isBusy = true;
	console.log("Starting skills.");
	useSkills(4);
}

function btnSkill20Click() {
	if (isBusy) {
		return;
	}

	isBusy = true;
	console.log("Starting skills.");
	useSkills(7);
}

function btnSkill30Click() {
	if (isBusy) {
		return;
	}

	isBusy = true;
	console.log("Starting skills.");
	useSkills(11);
}


// Create buttons for cheats
var btnMaxGold = document.createElement('button');
btnMaxGold.innerHTML = 'Max Gold';
btnMaxGold.setAttribute("style", "font-size:18px;");
btnMaxGold.onclick = function() { btnMaxGoldClick() };
chToolBar.appendChild(btnMaxGold);

var btnModGold = document.createElement('button');
btnModGold.innerHTML = 'Moderate Gold';
btnModGold.setAttribute("style", "font-size:18px;");
btnModGold.onclick = function() { btnModGoldClick() };
chToolBar.appendChild(btnModGold);

var btnReborn = document.createElement('button');
btnReborn.innerHTML = 'Reborn';
btnReborn.setAttribute("style", "font-size:18px;");
btnReborn.onclick = function() { btnRebornClick() };
chToolBar.appendChild(btnReborn);

var btnLevelMase = document.createElement('button');
btnLevelMase.innerHTML = 'Level Mase x5000';
btnLevelMase.setAttribute("style", "font-size:18px;");
btnLevelMase.onclick = function() { btnLevelMaseClick() };
chToolBar.appendChild(btnLevelMase);

var btnMassLevel = document.createElement('button');
btnMassLevel.innerHTML = 'Level All 1000x';
btnMassLevel.setAttribute("style", "font-size:18px;");
btnMassLevel.onclick = function() { btnMassLevelClick() };
chToolBar.appendChild(btnMassLevel);

var btnTrain = document.createElement('button');
btnTrain.innerHTML = 'Train All Skills';
btnTrain.setAttribute("style", "font-size:18px;");
btnTrain.onclick = function() { btnTrainClick() };
chToolBar.appendChild(btnTrain);

var btnSkill10 = document.createElement('button');
btnSkill10.innerHTML = 'Skills 10x';
btnSkill10.setAttribute("style", "font-size:18px;");
btnSkill10.onclick = function() { btnSkill10Click() };
chToolBar.appendChild(btnSkill10);

var btnSkill20 = document.createElement('button');
btnSkill20.innerHTML = 'Skills 20x';
btnSkill20.setAttribute("style", "font-size:18px;");
btnSkill20.onclick = function() { btnSkill20Click() };
chToolBar.appendChild(btnSkill20);

var btnSkill30 = document.createElement('button');
btnSkill30.innerHTML = 'Skills 30x';
btnSkill30.setAttribute("style", "font-size:18px;");
btnSkill30.onclick = function() { btnSkill30Click() };
chToolBar.appendChild(btnSkill30);

// Style progress bars
progBar.style.width = '100%';
progBar.style.backgroundColor = 'gray';
chToolBar.appendChild(progBar);

progPerc.style.width = '1%';
progPerc.style.height = '18px';
progPerc.style.backgroundColor = 'limegreen';
progPerc.style.color = 'black';
progPerc.style.display = 'none';
progBar.appendChild(progPerc);

// Style the toolbar
chToolBar.style.position = 'absolute';
chToolBar.style.bottom = '0';
chToolBar.style.textAlign = 'center';
chToolBar.style.width = '100%';
chToolBar.style.backgroundColor = 'black';
chToolBar.style.color = 'whitesmoke';
window.top.document.body.appendChild(chToolBar);

// Hide banner at bottom of page
/*var cpBannerCSS = document.createElement("style");
cpBannerCSS.type = "text/css";
cpBannerCSS.innerHTML = ".page-footer .cross-promo-bnr { display: none !important; }";
document.head.appendChild(cpBannerCSS);*/

// Hide entire footer
var pgFooterCSS = document.createElement("style");
pgFooterCSS.type = "text/css";
pgFooterCSS.innerHTML = "body .page-footer { display: none !important; }";
document.head.appendChild(pgFooterCSS);