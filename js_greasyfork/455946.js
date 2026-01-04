// ==UserScript==
// @name         typical90-direct-editorial-link
// @namespace    https://github.com/hotarunx
// @version      1.0.1
// @description  競プロ典型 90 問に解説リンク（Twitter）を追加する
// @author       hotarunx
// @license      MIT
// @supportURL   https://github.com/hotarunx/typical90-direct-editorial-link/issues
// @match        https://atcoder.jp/contests/typical90/tasks/*
// @exclude      https://atcoder.jp/contests/typical90/tasks/*/*
// @downloadURL https://update.greasyfork.org/scripts/455946/typical90-direct-editorial-link.user.js
// @updateURL https://update.greasyfork.org/scripts/455946/typical90-direct-editorial-link.meta.js
// ==/UserScript==
const problems = [
    "https://twitter.com/e869120/status/1376665578513989633",
    "https://twitter.com/e869120/status/1377027868518064129",
    "https://twitter.com/e869120/status/1377391097836544001",
    "https://twitter.com/e869120/status/1377752658149175299",
    "https://twitter.com/e869120/status/1378115289649348611",
    "https://twitter.com/e869120/status/1378840212449595393",
    "https://twitter.com/e869120/status/1379202843622576130",
    "https://twitter.com/e869120/status/1379565222541680644",
    "https://twitter.com/e869120/status/1379927227739987972",
    "https://twitter.com/e869120/status/1380290146340245505",
    "https://twitter.com/e869120/status/1380652465834532865",
    "https://twitter.com/e869120/status/1381376542836596737",
    "https://twitter.com/e869120/status/1381739128291614720",
    "https://twitter.com/e869120/status/1382101716066127872",
    "https://twitter.com/e869120/status/1382478816627478530",
    "https://twitter.com/e869120/status/1382827276673306624",
    "https://twitter.com/e869120/status/1383189464650981378",
    "https://twitter.com/e869120/status/1383913627325853696",
    "https://twitter.com/e869120/status/1384276005330690049",
    "https://twitter.com/e869120/status/1384638694162780166",
    "https://twitter.com/e869120/status/1385001057512693762",
    "https://twitter.com/e869120/status/1385363292739104775",
    "https://twitter.com/e869120/status/1385725481920520193",
    "https://twitter.com/e869120/status/1386449961072553990",
    "https://twitter.com/e869120/status/1386814047081746432",
    "https://twitter.com/e869120/status/1387175538544975872",
    "https://twitter.com/e869120/status/1387538790017769474",
    "https://twitter.com/e869120/status/1387901052683386880",
    "https://twitter.com/e869120/status/1388262816101007363",
    "https://twitter.com/e869120/status/1388987881977389059",
    "https://twitter.com/e869120/status/1389349360866009090",
    "https://twitter.com/e869120/status/1389711962213261316",
    "https://twitter.com/e869120/status/1390074137192767489",
    "https://twitter.com/e869120/status/1390436977808351234",
    "https://twitter.com/e869120/status/1390798852299448322",
    "https://twitter.com/e869120/status/1391523624897499136",
    "https://twitter.com/e869120/status/1391886390091075586",
    "https://twitter.com/e869120/status/1392248540882116610",
    "https://twitter.com/e869120/status/1392612322410057729",
    "https://twitter.com/e869120/status/1392974101061378049",
    "https://twitter.com/e869120/status/1393336369540341760",
    "https://twitter.com/e869120/status/1394062245181595653",
    "https://twitter.com/e869120/status/1394423616805097477",
    "https://twitter.com/e869120/status/1394787605099601923",
    "https://twitter.com/e869120/status/1395148057730187265",
    "https://twitter.com/e869120/status/1395510657634619394",
    "https://twitter.com/e869120/status/1395873457259225091",
    "https://twitter.com/e869120/status/1396597231248044040",
    "https://twitter.com/e869120/status/1396960059796582400",
    "https://twitter.com/e869120/status/1397322487554199553",
    "https://twitter.com/e869120/status/1397684795560259586",
    "https://twitter.com/e869120/status/1398046858933538819",
    "https://twitter.com/e869120/status/1398409831044632576",
    "https://twitter.com/e869120/status/1399135833425203200",
    "https://twitter.com/e869120/status/1399496993014116352",
    "https://twitter.com/e869120/status/1399859200046505984",
    "https://twitter.com/e869120/status/1400221404109230082",
    "https://twitter.com/e869120/status/1400584377902399490",
    "https://twitter.com/e869120/status/1400947432440008704",
    "https://twitter.com/e869120/status/1401670952857964545",
    "https://twitter.com/e869120/status/1402034055734980608",
    "https://twitter.com/e869120/status/1402395219287371779",
    "https://twitter.com/e869120/status/1402758934268571648",
    "https://twitter.com/e869120/status/1403121388773249024",
    "https://twitter.com/e869120/status/1403483256234799105",
    "https://twitter.com/e869120/status/1404207052084244481",
    "https://twitter.com/e869120/status/1404571956700008448",
    "https://twitter.com/e869120/status/1404931743820357633",
    "https://twitter.com/e869120/status/1405298187384999938",
    "https://twitter.com/e869120/status/1405659999179722754",
    "https://twitter.com/e869120/status/1406020809492090882",
    "https://twitter.com/e869120/status/1406743672603901953",
    "https://twitter.com/e869120/status/1407109731546636289",
    "https://twitter.com/e869120/status/1407510677934149635",
    "https://twitter.com/e869120/status/1407833847413178372",
    "https://twitter.com/e869120/status/1408195203538690048",
    "https://twitter.com/e869120/status/1408599656209080322",
    "https://twitter.com/e869120/status/1409280796548997122",
    "https://twitter.com/e869120/status/1409644684561944579",
    "https://twitter.com/e869120/status/1410007233262276612",
    "https://twitter.com/e869120/status/1410368312760934404",
    "https://twitter.com/e869120/status/1410732179743657986",
    "https://twitter.com/e869120/status/1411094412319330305",
    "https://twitter.com/e869120/status/1411817107336007687",
    "https://twitter.com/e869120/status/1412179495868534784",
    "https://twitter.com/e869120/status/1412541885160189952",
    "https://twitter.com/e869120/status/1412904274900754441",
    "https://twitter.com/e869120/status/1413266660862009348",
    "https://twitter.com/e869120/status/1413629046282280963",
    "https://twitter.com/e869120/status/1414011564458348548",
];
const editorials = [
    "https://twitter.com/e869120/status/1377027868518064129",
    "https://twitter.com/e869120/status/1377391097836544001",
    "https://twitter.com/e869120/status/1377752658149175299",
    "https://twitter.com/e869120/status/1378115289649348611",
    "https://twitter.com/e869120/status/1378527948563615746",
    "https://twitter.com/e869120/status/1379202843622576130",
    "https://twitter.com/e869120/status/1379565222541680644",
    "https://twitter.com/e869120/status/1379927227739987972",
    "https://twitter.com/e869120/status/1380290146340245505",
    "https://twitter.com/e869120/status/1380652465834532865",
    "https://twitter.com/e869120/status/1381064464049401856",
    "https://twitter.com/e869120/status/1381739128291614720",
    "https://twitter.com/e869120/status/1382101716066127872",
    "https://twitter.com/e869120/status/1382478816627478530",
    "https://twitter.com/e869120/status/1382827276673306624",
    "https://twitter.com/e869120/status/1383189464650981378",
    "https://twitter.com/e869120/status/1383635232134287360",
    "https://twitter.com/e869120/status/1384276005330690049",
    "https://twitter.com/e869120/status/1384638694162780166",
    "https://twitter.com/e869120/status/1385001057512693762",
    "https://twitter.com/e869120/status/1385363292739104775",
    "https://twitter.com/e869120/status/1385725481920520193",
    "https://twitter.com/e869120/status/1386138990361726978",
    "https://twitter.com/e869120/status/1386814047081746432",
    "https://twitter.com/e869120/status/1387175538544975872",
    "https://twitter.com/e869120/status/1387538790017769474",
    "https://twitter.com/e869120/status/1387901052683386880",
    "https://twitter.com/e869120/status/1388262816101007363",
    "https://twitter.com/e869120/status/1388674962823663619",
    "https://twitter.com/e869120/status/1389349360866009090",
    "https://twitter.com/e869120/status/1389711962213261316",
    "https://twitter.com/e869120/status/1390074137192767489",
    "https://twitter.com/e869120/status/1390436977808351234",
    "https://twitter.com/e869120/status/1390798852299448322",
    "https://twitter.com/e869120/status/1391218516129312768",
    "https://twitter.com/e869120/status/1391886390091075586",
    "https://twitter.com/e869120/status/1392248540882116610",
    "https://twitter.com/e869120/status/1392612322410057729",
    "https://twitter.com/e869120/status/1392974101061378049",
    "https://twitter.com/e869120/status/1393336369540341760",
    "https://twitter.com/e869120/status/1393753066331992065",
    "https://twitter.com/e869120/status/1394423616805097477",
    "https://twitter.com/e869120/status/1394787605099601923",
    "https://twitter.com/e869120/status/1395148057730187265",
    "https://twitter.com/e869120/status/1395510657634619394",
    "https://twitter.com/e869120/status/1395873457259225091",
    "https://twitter.com/e869120/status/1396289540222906368",
    "https://twitter.com/e869120/status/1396960059796582400",
    "https://twitter.com/e869120/status/1397322487554199553",
    "https://twitter.com/e869120/status/1397684795560259586",
    "https://twitter.com/e869120/status/1398046858933538819",
    "https://twitter.com/e869120/status/1398409831044632576",
    "https://twitter.com/e869120/status/1398827248698810369",
    "https://twitter.com/e869120/status/1399496993014116352",
    "https://twitter.com/e869120/status/1399859200046505984",
    "https://twitter.com/e869120/status/1400221404109230082",
    "https://twitter.com/e869120/status/1400584377902399490",
    "https://twitter.com/e869120/status/1400947432440008704",
    "https://twitter.com/e869120/status/1401357950686429193",
    "https://twitter.com/e869120/status/1402034055734980608",
    "https://twitter.com/e869120/status/1402395219287371779",
    "https://twitter.com/e869120/status/1402758934268571648",
    "https://twitter.com/e869120/status/1403121388773249024",
    "https://twitter.com/e869120/status/1403483256234799105",
    "https://twitter.com/e869120/status/1403901094007173120",
    "https://twitter.com/e869120/status/1404571956700008448",
    "https://twitter.com/e869120/status/1404931743820357633",
    "https://twitter.com/e869120/status/1405298187384999938",
    "https://twitter.com/e869120/status/1405659999179722754",
    "https://twitter.com/e869120/status/1406020809492090882",
    "https://twitter.com/e869120/status/1406429317249126402",
    "https://twitter.com/e869120/status/1407109731546636289",
    "https://twitter.com/e869120/status/1407510677934149635",
    "https://twitter.com/e869120/status/1407833847413178372",
    "https://twitter.com/e869120/status/1408195203538690048",
    "https://twitter.com/e869120/status/1408599656209080322",
    "https://twitter.com/e869120/status/1408978156137025545",
    "https://twitter.com/e869120/status/1409644684561944579",
    "https://twitter.com/e869120/status/1410007233262276612",
    "https://twitter.com/e869120/status/1410368312760934404",
    "https://twitter.com/e869120/status/1410732179743657986",
    "https://twitter.com/e869120/status/1411094412319330305",
    "https://twitter.com/e869120/status/1411508237522767873",
    "https://twitter.com/e869120/status/1412179495868534784",
    "https://twitter.com/e869120/status/1412541885160189952",
    "https://twitter.com/e869120/status/1412904274900754441",
    "https://twitter.com/e869120/status/1413266660862009348",
    "https://twitter.com/e869120/status/1413629046282280963",
    "https://twitter.com/e869120/status/1413991433153912832",
    "https://twitter.com/e869120/status/1414166071594999811",
];
const codes = [
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/001.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/002.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/003.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/004.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/005-03.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/006.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/007.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/008.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/009.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/010.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/011-03.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/012.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/013.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/014.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/015.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/016.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/017-03.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/018.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/019.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/020.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/021.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/022.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/023-04b.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/024.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/025.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/026.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/027.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/028.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/029-03.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/030.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/031.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/032.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/033.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/034.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/035-04.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/036.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/037.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/038.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/039.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/040.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/041-03.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/042.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/043.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/044.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/045.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/046.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/047-02.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/048.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/049.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/050.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/051.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/052.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/053-04.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/054.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/055.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/056.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/057.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/058.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/059-02.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/060.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/061-02.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/062.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/063.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/064.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/065-03.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/066a.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/067.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/068b.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/069.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/070.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/071-03.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/072.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/073.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/074.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/075.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/076.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/077-04b.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/078.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/079.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/080a.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/081.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/082a.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/083-02a.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/084-02.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/085.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/086.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/087.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/088.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/089-05.cpp",
    "https://github.com/E869120/kyopro_educational_90/blob/main/sol/090-07b.cpp",
];
const problemsApi = [
    {
        contest_id: "typical90",
        id: "typical90_a",
        name: "Yokan Party（★4）",
        problem_index: "001",
        title: "001. Yokan Party（★4）",
    },
    {
        contest_id: "typical90",
        id: "typical90_aa",
        name: "Sign Up Requests （★2）",
        problem_index: "027",
        title: "027. Sign Up Requests （★2）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ab",
        name: "Cluttered Paper（★4）",
        problem_index: "028",
        title: "028. Cluttered Paper（★4）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ac",
        name: "Long Bricks（★5）",
        problem_index: "029",
        title: "029. Long Bricks（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ad",
        name: "K Factors（★5）",
        problem_index: "030",
        title: "030. K Factors（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ae",
        name: "VS AtCoder（★6）",
        problem_index: "031",
        title: "031. VS AtCoder（★6）",
    },
    {
        contest_id: "typical90",
        id: "typical90_af",
        name: "AtCoder Ekiden（★3）",
        problem_index: "032",
        title: "032. AtCoder Ekiden（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ag",
        name: "Not Too Bright（★2）",
        problem_index: "033",
        title: "033. Not Too Bright（★2）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ah",
        name: "There are few types of elements（★4）",
        problem_index: "034",
        title: "034. There are few types of elements（★4）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ai",
        name: "Preserve Connectivity（★7）",
        problem_index: "035",
        title: "035. Preserve Connectivity（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_aj",
        name: "Max Manhattan Distance（★5）",
        problem_index: "036",
        title: "036. Max Manhattan Distance（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ak",
        name: "Don't Leave the Spice（★5）",
        problem_index: "037",
        title: "037. Don't Leave the Spice（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_al",
        name: "Large LCM（★3）",
        problem_index: "038",
        title: "038. Large LCM（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_am",
        name: "Tree Distance（★5）",
        problem_index: "039",
        title: "039. Tree Distance（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_an",
        name: "Get More Money（★7）",
        problem_index: "040",
        title: "040. Get More Money（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ao",
        name: "Piles in AtCoder Farm（★7）",
        problem_index: "041",
        title: "041. Piles in AtCoder Farm（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ap",
        name: "Multiple of 9（★4）",
        problem_index: "042",
        title: "042. Multiple of 9（★4）",
    },
    {
        contest_id: "typical90",
        id: "typical90_aq",
        name: "Maze Challenge with Lack of Sleep（★4）",
        problem_index: "043",
        title: "043. Maze Challenge with Lack of Sleep（★4）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ar",
        name: "Shift and Swapping（★3）",
        problem_index: "044",
        title: "044. Shift and Swapping（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_as",
        name: "Simple Grouping（★6）",
        problem_index: "045",
        title: "045. Simple Grouping（★6）",
    },
    {
        contest_id: "typical90",
        id: "typical90_at",
        name: "I Love 46（★3）",
        problem_index: "046",
        title: "046. I Love 46（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_au",
        name: "Monochromatic Diagonal（★7）",
        problem_index: "047",
        title: "047. Monochromatic Diagonal（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_av",
        name: "I will not drop out（★3）",
        problem_index: "048",
        title: "048. I will not drop out（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_aw",
        name: "Flip Digits 2（★6）",
        problem_index: "049",
        title: "049. Flip Digits 2（★6）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ax",
        name: "Stair Jump（★3）",
        problem_index: "050",
        title: "050. Stair Jump（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ay",
        name: "Typical Shop（★5）",
        problem_index: "051",
        title: "051. Typical Shop（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_az",
        name: "Dice Product（★3）",
        problem_index: "052",
        title: "052. Dice Product（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_b",
        name: "Encyclopedia of Parentheses（★3）",
        problem_index: "002",
        title: "002. Encyclopedia of Parentheses（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ba",
        name: "Discrete Dowsing（★7）",
        problem_index: "053",
        title: "053. Discrete Dowsing（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bb",
        name: "Takahashi Number（★6）",
        problem_index: "054",
        title: "054. Takahashi Number（★6）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bc",
        name: "Select 5（★2）",
        problem_index: "055",
        title: "055. Select 5（★2）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bd",
        name: "Lucky Bag（★5）",
        problem_index: "056",
        title: "056. Lucky Bag（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_be",
        name: "Flip Flap（★6）",
        problem_index: "057",
        title: "057. Flip Flap（★6）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bf",
        name: "Original Calculator（★4）",
        problem_index: "058",
        title: "058. Original Calculator（★4）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bg",
        name: "Many Graph Queries（★7）",
        problem_index: "059",
        title: "059. Many Graph Queries（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bh",
        name: "Chimera（★5）",
        problem_index: "060",
        title: "060. Chimera（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bi",
        name: "Deck（★2）",
        problem_index: "061",
        title: "061. Deck（★2）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bj",
        name: "Paint All（★6）",
        problem_index: "062",
        title: "062. Paint All（★6）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bk",
        name: "Monochromatic Subgrid（★4）",
        problem_index: "063",
        title: "063. Monochromatic Subgrid（★4）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bl",
        name: "Uplift（★3）",
        problem_index: "064",
        title: "064. Uplift（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bm",
        name: "RGB Balls 2（★7）",
        problem_index: "065",
        title: "065. RGB Balls 2（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bn",
        name: "Various Arrays（★5）",
        problem_index: "066",
        title: "066. Various Arrays（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bo",
        name: "Base 8 to 9（★2）",
        problem_index: "067",
        title: "067. Base 8 to 9（★2）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bp",
        name: "Paired Information（★5）",
        problem_index: "068",
        title: "068. Paired Information（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bq",
        name: "Colorful Blocks 2（★3）",
        problem_index: "069",
        title: "069. Colorful Blocks 2（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_br",
        name: "Plant Planning（★4）",
        problem_index: "070",
        title: "070. Plant Planning（★4）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bs",
        name: "Fuzzy Priority（★7）",
        problem_index: "071",
        title: "071. Fuzzy Priority（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bt",
        name: "Loop Railway Plan（★4）",
        problem_index: "072",
        title: "072. Loop Railway Plan（★4）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bu",
        name: "We Need Both a and b（★5）",
        problem_index: "073",
        title: "073. We Need Both a and b（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bv",
        name: "ABC String 2（★6）",
        problem_index: "074",
        title: "074. ABC String 2（★6）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bw",
        name: "Magic For Balls（★3）",
        problem_index: "075",
        title: "075. Magic For Balls（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bx",
        name: "Cake Cut（★3）",
        problem_index: "076",
        title: "076. Cake Cut（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_by",
        name: "Planes on a 2D Plane（★7）",
        problem_index: "077",
        title: "077. Planes on a 2D Plane（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_bz",
        name: "Easy Graph Problem（★2）",
        problem_index: "078",
        title: "078. Easy Graph Problem（★2）",
    },
    {
        contest_id: "typical90",
        id: "typical90_c",
        name: "Longest Circular Road（★4）",
        problem_index: "003",
        title: "003. Longest Circular Road（★4）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ca",
        name: "Two by Two（★3）",
        problem_index: "079",
        title: "079. Two by Two（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_cb",
        name: "Let's Share Bit（★6）",
        problem_index: "080",
        title: "080. Let's Share Bit（★6）",
    },
    {
        contest_id: "typical90",
        id: "typical90_cc",
        name: "Friendly Group（★5）",
        problem_index: "081",
        title: "081. Friendly Group（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_cd",
        name: "Counting Numbers（★3）",
        problem_index: "082",
        title: "082. Counting Numbers（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ce",
        name: "Colorful Graph（★6）",
        problem_index: "083",
        title: "083. Colorful Graph（★6）",
    },
    {
        contest_id: "typical90",
        id: "typical90_cf",
        name: "There are two types of characters（★3）",
        problem_index: "084",
        title: "084. There are two types of characters（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_cg",
        name: "Multiplication 085（★4）",
        problem_index: "085",
        title: "085. Multiplication 085（★4）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ch",
        name: "Snuke's Favorite Arrays（★5）",
        problem_index: "086",
        title: "086. Snuke's Favorite Arrays（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ci",
        name: "Chokudai's Demand（★5）",
        problem_index: "087",
        title: "087. Chokudai's Demand（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_cj",
        name: "Similar but Different Ways（★6）",
        problem_index: "088",
        title: "088. Similar but Different Ways（★6）",
    },
    {
        contest_id: "typical90",
        id: "typical90_ck",
        name: "Partitions and Inversions（★7）",
        problem_index: "089",
        title: "089. Partitions and Inversions（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_cl",
        name: "Tenkei90's Last Problem（★7）",
        problem_index: "090",
        title: "090. Tenkei90's Last Problem（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_d",
        name: "Cross Sum（★2）",
        problem_index: "004",
        title: "004. Cross Sum（★2）",
    },
    {
        contest_id: "typical90",
        id: "typical90_e",
        name: "Restricted Digits（★7）",
        problem_index: "005",
        title: "005. Restricted Digits（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_f",
        name: "Smallest Subsequence（★5）",
        problem_index: "006",
        title: "006. Smallest Subsequence（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_g",
        name: "CP Classes（★3）",
        problem_index: "007",
        title: "007. CP Classes（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_h",
        name: "AtCounter（★4）",
        problem_index: "008",
        title: "008. AtCounter（★4）",
    },
    {
        contest_id: "typical90",
        id: "typical90_i",
        name: "Three Point Angle（★6）",
        problem_index: "009",
        title: "009. Three Point Angle（★6）",
    },
    {
        contest_id: "typical90",
        id: "typical90_j",
        name: "Score Sum Queries（★2）",
        problem_index: "010",
        title: "010. Score Sum Queries（★2）",
    },
    {
        contest_id: "typical90",
        id: "typical90_k",
        name: "Gravy Jobs（★6）",
        problem_index: "011",
        title: "011. Gravy Jobs（★6）",
    },
    {
        contest_id: "typical90",
        id: "typical90_l",
        name: "Red Painting（★4）",
        problem_index: "012",
        title: "012. Red Painting（★4）",
    },
    {
        contest_id: "typical90",
        id: "typical90_m",
        name: "Passing（★5）",
        problem_index: "013",
        title: "013. Passing（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_n",
        name: "We Used to Sing a Song Together（★3）",
        problem_index: "014",
        title: "014. We Used to Sing a Song Together（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_o",
        name: "Don't be too close（★6）",
        problem_index: "015",
        title: "015. Don't be too close（★6）",
    },
    {
        contest_id: "typical90",
        id: "typical90_p",
        name: "Minimum Coins（★3）",
        problem_index: "016",
        title: "016. Minimum Coins（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_q",
        name: "Crossing Segments（★7）",
        problem_index: "017",
        title: "017. Crossing Segments（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_r",
        name: "Statue of Chokudai（★3）",
        problem_index: "018",
        title: "018. Statue of Chokudai（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_s",
        name: "Pick Two（★6）",
        problem_index: "019",
        title: "019. Pick Two（★6）",
    },
    {
        contest_id: "typical90",
        id: "typical90_t",
        name: "Log Inequality（★3）",
        problem_index: "020",
        title: "020. Log Inequality（★3）",
    },
    {
        contest_id: "typical90",
        id: "typical90_u",
        name: "Come Back in One Piece（★5）",
        problem_index: "021",
        title: "021. Come Back in One Piece（★5）",
    },
    {
        contest_id: "typical90",
        id: "typical90_v",
        name: "Cubic Cake（★2）",
        problem_index: "022",
        title: "022. Cubic Cake（★2）",
    },
    {
        contest_id: "typical90",
        id: "typical90_w",
        name: "Avoid War（★7）",
        problem_index: "023",
        title: "023. Avoid War（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_x",
        name: "Select +／- One（★2）",
        problem_index: "024",
        title: "024. Select +／- One（★2）",
    },
    {
        contest_id: "typical90",
        id: "typical90_y",
        name: "Digit Product Equation（★7）",
        problem_index: "025",
        title: "025. Digit Product Equation（★7）",
    },
    {
        contest_id: "typical90",
        id: "typical90_z",
        name: "Independent Set on a Tree（★4）",
        problem_index: "026",
        title: "026. Independent Set on a Tree（★4）",
    },
];

// AtCoderの問題ページをパースする
/**
 * URLをパースする パラメータを消す \
 * 例: in:  https://atcoder.jp/contests/abc210?lang=en \
 * 例: out: (5)['https:', '', 'atcoder.jp', 'contests', 'abc210']
 */
const parseURL = (url) => {
    // 区切り文字`/`で分割する
    // ?以降の文字列を削除してパラメータを削除する
    return url.split("/").map((x) => x.replace(/\?.*/i, ""));
};
const URL = parseURL(window.location.href);
/**
 * 表セル要素から、前の要素のテキストが引数と一致する要素を探す
 * 個別の提出ページで使うことを想定
 * 例: searchSubmissionInfo(["問題", "Task"])
 */
const searchSubmissionInfo = (key) => {
    const tdTags = document.getElementsByTagName("td");
    const tdTagsArray = Array.prototype.slice.call(tdTags);
    return tdTagsArray.filter((elem) => {
        const prevElem = elem.previousElementSibling;
        const text = prevElem?.textContent;
        if (typeof text === "string")
            return key.includes(text);
        return false;
    })[0];
};
/** コンテストタイトル 例: AtCoder Beginner Contest 210 */
document.getElementsByClassName("contest-title")[0]?.textContent ?? "";
/** コンテストID 例: abc210 */
URL[4] ?? "";
/**
 * ページ種類 \
 * 基本的にコンテストIDの次のパス
 * ### 例外
 * 個別の問題: task
 * 個別の提出: submission
 * 個別の問題ページで解説ボタンを押すと遷移する個別の問題の解説一覧ページ: task_editorial
 */
const pageType = (() => {
    if (URL.length < 6)
        return "";
    if (URL.length >= 7 && URL[5] === "submissions" && URL[6] !== "me")
        return "submission";
    if (URL.length >= 8 && URL[5] === "tasks" && URL[7] === "editorial")
        return "task_editorial";
    if (URL.length >= 7 && URL[5] === "tasks")
        return "task";
    return URL[5] ?? "";
})();
/** 問題ID 例: abc210_a */
const taskID = (() => {
    if (pageType === "task") {
        // 問題ページでは、URLから問題IDを取り出す
        return URL[6] ?? "";
    }
    if (pageType === "submission") {
        // 個別の提出ページでは、問題リンクのURLから問題IDを取り出す
        // 提出情報の問題のURLを取得する
        const taskCell = searchSubmissionInfo(["問題", "Task"]);
        if (!taskCell)
            return "";
        const taskLink = taskCell.getElementsByTagName("a")[0];
        if (!taskLink)
            return "";
        const taskUrl = parseURL(taskLink.href);
        const taskIDParsed = taskUrl[6] ?? "";
        return taskIDParsed;
    }
    return "";
})();
/** 問題名 例: A - Cabbages */
(() => {
    if (pageType === "task") {
        // 問題ページでは、h2から問題名を取り出す
        return (document
            .getElementsByClassName("h2")[0]
            ?.textContent?.trim()
            .replace(/\n.*/i, "") ?? "");
    }
    if (pageType === "submission") {
        // 個別の提出ページでは、問題リンクのテキストから問題名を取り出す
        // 提出情報の問題のテキストを取得する
        const taskCell = searchSubmissionInfo(["問題", "Task"]);
        if (!taskCell)
            return "";
        const taskLink = taskCell.getElementsByTagName("a")[0];
        if (!taskLink)
            return "";
        return taskLink.textContent ?? "";
    }
    return "";
})();
/** 提出ユーザー 例: machikane */
(() => {
    if (pageType !== "submission")
        return "";
    // 個別の提出ページのとき
    const userCell = searchSubmissionInfo(["ユーザ", "User"]);
    if (!userCell)
        return "";
    return userCell?.textContent?.trim() ?? "";
})();
/** 提出結果 例: AC */
(() => {
    if (pageType !== "submission")
        return "";
    // 個別の提出ページのとき
    const statusCell = searchSubmissionInfo(["結果", "Status"]);
    if (!statusCell)
        return "";
    return statusCell?.textContent?.trim() ?? "";
})();
/** 得点 例: 100 */
(() => {
    if (pageType !== "submission")
        return 0;
    // 個別の提出ページのとき
    const scoreCell = searchSubmissionInfo(["得点", "Score"]);
    if (!scoreCell)
        return 0;
    return parseInt(scoreCell?.textContent?.trim() ?? "0", 10);
})();

/**
 * 最初に実行される部分
 */
(() => {
    const h2 = document.getElementsByClassName("h2")[0];
    if (!h2)
        return;
    const index = Number(problemsApi.find((e) => e.id === taskID)?.problem_index) - 1;
    h2.insertAdjacentHTML("beforeend", `<a class="btn btn-info btn-sm" href="${problems[index] ?? "https://atcoder.jp/contests/typical90"}" target="_blank">問題</a>`);
    h2.insertAdjacentHTML("beforeend", `<a class="btn btn-info btn-sm" href="${editorials[index] ?? "https://atcoder.jp/contests/typical90"}" target="_blank">解説</a>`);
    h2.insertAdjacentHTML("beforeend", `<a class="btn btn-info btn-sm" href="${codes[index] ?? "https://atcoder.jp/contests/typical90"}" target="_blank">コード</a>`);
})();
