// ==UserScript==
// @name         Use Hidden Shopkeepers
// @description  View and access shopkeeper options that neopets.com has hidden
// @version      2025.01.31
// @license      GNU GPLv3
// @match        https://www.neopets.com/select_shopkeeper.phtml*
// @author       Posterboy
// @namespace    https://www.youtube.com/@Neo_PosterBoy
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512565/Use%20Hidden%20Shopkeepers.user.js
// @updateURL https://update.greasyfork.org/scripts/512565/Use%20Hidden%20Shopkeepers.meta.js
// ==/UserScript==

// Updated version of script found at https://github.com/unoriginality786/Neopets-Userscripts/blob/main/Use%20Hidden%20Shopkeepers

(function() {
    'use strict';

    // Define categories and their images
    const categories = {
        Faeries: [

            { src: 'https://images.neopets.com/new_shopkeepers/29.gif', value: '29' },
            { src: 'https://images.neopets.com/new_shopkeepers/122.gif', value: '122' },
            { src: 'https://images.neopets.com/new_shopkeepers/199.gif', value: '199' },
            { src: 'https://images.neopets.com/new_shopkeepers/202.gif', value: '202' },
            { src: 'https://images.neopets.com/new_shopkeepers/203.gif', value: '203' },
            { src: 'https://images.neopets.com/new_shopkeepers/204.gif', value: '204' },
            { src: 'https://images.neopets.com/new_shopkeepers/206.gif', value: '206' },
            { src: 'https://images.neopets.com/new_shopkeepers/207.gif', value: '207' },
            { src: 'https://images.neopets.com/new_shopkeepers/318.gif', value: '318' },
            { src: 'https://images.neopets.com/new_shopkeepers/319.gif', value: '319' },
            { src: 'https://images.neopets.com/new_shopkeepers/320.gif', value: '320' },
            { src: 'https://images.neopets.com/new_shopkeepers/321.gif', value: '321' },
            { src: 'https://images.neopets.com/new_shopkeepers/322.gif', value: '322' },
            { src: 'https://images.neopets.com/new_shopkeepers/323.gif', value: '323' },
            { src: 'https://images.neopets.com/new_shopkeepers/330.gif', value: '330' },
            { src: 'https://images.neopets.com/new_shopkeepers/333.gif', value: '333' },
            { src: 'https://images.neopets.com/new_shopkeepers/334.gif', value: '334' },
            { src: 'https://images.neopets.com/new_shopkeepers/336.gif', value: '336' },
            { src: 'https://images.neopets.com/new_shopkeepers/847.gif', value: '847' },
            { src: 'https://images.neopets.com/new_shopkeepers/848.gif', value: '848' },
            { src: 'https://images.neopets.com/new_shopkeepers/849.gif', value: '849' },
            { src: 'https://images.neopets.com/new_shopkeepers/887.gif', value: '887' },
            { src: 'https://images.neopets.com/new_shopkeepers/888.gif', value: '888' },
            { src: 'https://images.neopets.com/new_shopkeepers/889.gif', value: '889' },
            { src: 'https://images.neopets.com/new_shopkeepers/890.gif', value: '890' },
            { src: 'https://images.neopets.com/new_shopkeepers/891.gif', value: '891' },
            { src: 'https://images.neopets.com/new_shopkeepers/892.gif', value: '892' },
            { src: 'https://images.neopets.com/new_shopkeepers/893.gif', value: '893' },
            { src: 'https://images.neopets.com/new_shopkeepers/894.gif', value: '894' },
            { src: 'https://images.neopets.com/new_shopkeepers/895.gif', value: '895' },
            { src: 'https://images.neopets.com/new_shopkeepers/903.gif', value: '903' },
            { src: 'https://images.neopets.com/new_shopkeepers/904.gif', value: '904' },
            { src: 'https://images.neopets.com/new_shopkeepers/905.gif', value: '905' },
            { src: 'https://images.neopets.com/new_shopkeepers/914.gif', value: '914' },
            { src: 'https://images.neopets.com/new_shopkeepers/915.gif', value: '915' },
            { src: 'https://images.neopets.com/new_shopkeepers/916.gif', value: '916' },
            { src: 'https://images.neopets.com/new_shopkeepers/933.gif', value: '933' },
            { src: 'https://images.neopets.com/new_shopkeepers/934.gif', value: '934' },
            { src: 'https://images.neopets.com/new_shopkeepers/935.gif', value: '935' },
            { src: 'https://images.neopets.com/new_shopkeepers/936.gif', value: '936' },
            { src: 'https://images.neopets.com/new_shopkeepers/950.gif', value: '950' },
            { src: 'https://images.neopets.com/new_shopkeepers/997.gif', value: '997' },
            { src: 'https://images.neopets.com/new_shopkeepers/998.gif', value: '998' },
            { src: 'https://images.neopets.com/new_shopkeepers/999.gif', value: '999' },
            { src: 'https://images.neopets.com/new_shopkeepers/1000.gif', value: '1000' },
            { src: 'https://images.neopets.com/new_shopkeepers/1012.gif', value: '1012' },
            { src: 'https://images.neopets.com/new_shopkeepers/1017.gif', value: '1017' },
            { src: 'https://images.neopets.com/new_shopkeepers/1018.gif', value: '1018' },
            { src: 'https://images.neopets.com/new_shopkeepers/1019.gif', value: '1019' },
            { src: 'https://images.neopets.com/new_shopkeepers/1020.gif', value: '1020' },
            { src: 'https://images.neopets.com/new_shopkeepers/1128.gif', value: '1128' },
            { src: 'https://images.neopets.com/new_shopkeepers/1129.gif', value: '1129' },
            { src: 'https://images.neopets.com/new_shopkeepers/1130.gif', value: '1130' },
            { src: 'https://images.neopets.com/new_shopkeepers/1131.gif', value: '1131' },
            { src: 'https://images.neopets.com/new_shopkeepers/1222.gif', value: '1222' },
            { src: 'https://images.neopets.com/new_shopkeepers/1224.gif', value: '1224' },
            { src: 'https://images.neopets.com/new_shopkeepers/1254.gif', value: '1254' },
            { src: 'https://images.neopets.com/new_shopkeepers/1307.gif', value: '1307' },
            { src: 'https://images.neopets.com/new_shopkeepers/1308.gif', value: '1308' },
            { src: 'https://images.neopets.com/new_shopkeepers/1309.gif', value: '1309' },
            { src: 'https://images.neopets.com/new_shopkeepers/1432.gif', value: '1432' },
            { src: 'https://images.neopets.com/new_shopkeepers/1433.gif', value: '1433' },
            { src: 'https://images.neopets.com/new_shopkeepers/1434.gif', value: '1434' },
            { src: 'https://images.neopets.com/new_shopkeepers/1435.gif', value: '1435' },
            { src: 'https://images.neopets.com/new_shopkeepers/1498.gif', value: '1498' },
            { src: 'https://images.neopets.com/new_shopkeepers/1499.gif', value: '1499' },
            { src: 'https://images.neopets.com/new_shopkeepers/1500.gif', value: '1500' },
            { src: 'https://images.neopets.com/new_shopkeepers/1530.gif', value: '1530' },
            { src: 'https://images.neopets.com/new_shopkeepers/1531.gif', value: '1531' },
            { src: 'https://images.neopets.com/new_shopkeepers/1532.gif', value: '1532' },
            { src: 'https://images.neopets.com/new_shopkeepers/2130.gif', value: '2130' },
            { src: 'https://images.neopets.com/new_shopkeepers/2131.gif', value: '2131' }
        ],
        Petpets: [
            { src: 'https://images.neopets.com/new_shopkeepers/224.gif', value: '224' },
            { src: 'https://images.neopets.com/new_shopkeepers/630.gif', value: '630' },
            { src: 'https://images.neopets.com/new_shopkeepers/631.gif', value: '631' },
            { src: 'https://images.neopets.com/new_shopkeepers/632.gif', value: '632' },
            { src: 'https://images.neopets.com/new_shopkeepers/633.gif', value: '633' },
            { src: 'https://images.neopets.com/new_shopkeepers/638.gif', value: '638' },
            { src: 'https://images.neopets.com/new_shopkeepers/639.gif', value: '639' },
            { src: 'https://images.neopets.com/new_shopkeepers/640.gif', value: '640' },
            { src: 'https://images.neopets.com/new_shopkeepers/641.gif', value: '641' },
            { src: 'https://images.neopets.com/new_shopkeepers/743.gif', value: '743' },
            { src: 'https://images.neopets.com/new_shopkeepers/744.gif', value: '744' },
            { src: 'https://images.neopets.com/new_shopkeepers/745.gif', value: '745' },
            { src: 'https://images.neopets.com/new_shopkeepers/749.gif', value: '749' },
            { src: 'https://images.neopets.com/new_shopkeepers/812.gif', value: '812' },
            { src: 'https://images.neopets.com/new_shopkeepers/813.gif', value: '813' },
            { src: 'https://images.neopets.com/new_shopkeepers/814.gif', value: '814' },
            { src: 'https://images.neopets.com/new_shopkeepers/815.gif', value: '815' },
            { src: 'https://images.neopets.com/new_shopkeepers/819.gif', value: '819' },
            { src: 'https://images.neopets.com/new_shopkeepers/820.gif', value: '820' },
            { src: 'https://images.neopets.com/new_shopkeepers/821.gif', value: '821' },
            { src: 'https://images.neopets.com/new_shopkeepers/822.gif', value: '822' },
            { src: 'https://images.neopets.com/new_shopkeepers/861.gif', value: '861' },
            { src: 'https://images.neopets.com/new_shopkeepers/911.gif', value: '911' },
            { src: 'https://images.neopets.com/new_shopkeepers/912.gif', value: '912' },
            { src: 'https://images.neopets.com/new_shopkeepers/913.gif', value: '913' },
            { src: 'https://images.neopets.com/new_shopkeepers/937.gif', value: '937' },
            { src: 'https://images.neopets.com/new_shopkeepers/938.gif', value: '938' },
            { src: 'https://images.neopets.com/new_shopkeepers/939.gif', value: '939' },
            { src: 'https://images.neopets.com/new_shopkeepers/940.gif', value: '940' },
            { src: 'https://images.neopets.com/new_shopkeepers/941.gif', value: '941' },
            { src: 'https://images.neopets.com/new_shopkeepers/942.gif', value: '942' },
            { src: 'https://images.neopets.com/new_shopkeepers/946.gif', value: '946' },
            { src: 'https://images.neopets.com/new_shopkeepers/947.gif', value: '947' },
            { src: 'https://images.neopets.com/new_shopkeepers/948.gif', value: '948' },
            { src: 'https://images.neopets.com/new_shopkeepers/949.gif', value: '949' },
            { src: 'https://images.neopets.com/new_shopkeepers/1533.gif', value: '1533' },
            { src: 'https://images.neopets.com/new_shopkeepers/1848.gif', value: '1848' },
            { src: 'https://images.neopets.com/new_shopkeepers/1849.gif', value: '1849' },
            { src: 'https://images.neopets.com/new_shopkeepers/1850.gif', value: '1850' },
            { src: 'https://images.neopets.com/new_shopkeepers/1871.gif', value: '1871' },
            { src: 'https://images.neopets.com/new_shopkeepers/1872.gif', value: '1872' },
            { src: 'https://images.neopets.com/new_shopkeepers/1873.gif', value: '1873' },
            { src: 'https://images.neopets.com/new_shopkeepers/1874.gif', value: '1874' },
            { src: 'https://images.neopets.com/new_shopkeepers/1883.gif', value: '1883' },
            { src: 'https://images.neopets.com/new_shopkeepers/1884.gif', value: '1884' },
            { src: 'https://images.neopets.com/new_shopkeepers/1885.gif', value: '1885' },
            { src: 'https://images.neopets.com/new_shopkeepers/1886.gif', value: '1886' },
            { src: 'https://images.neopets.com/new_shopkeepers/1891.gif', value: '1891' },
            { src: 'https://images.neopets.com/new_shopkeepers/1892.gif', value: '1892' },
            { src: 'https://images.neopets.com/new_shopkeepers/1893.gif', value: '1893' },
            { src: 'https://images.neopets.com/new_shopkeepers/1894.gif', value: '1894' },
            { src: 'https://images.neopets.com/new_shopkeepers/1955.gif', value: '1955' },
            { src: 'https://images.neopets.com/new_shopkeepers/1967.gif', value: '1967' },
            { src: 'https://images.neopets.com/new_shopkeepers/2048.gif', value: '2048' },
            { src: 'https://images.neopets.com/new_shopkeepers/2049.gif', value: '2049' },
            { src: 'https://images.neopets.com/new_shopkeepers/2068.gif', value: '2068' },
            { src: 'https://images.neopets.com/new_shopkeepers/2069.gif', value: '2069' },
            { src: 'https://images.neopets.com/new_shopkeepers/2070.gif', value: '2070' },
            { src: 'https://images.neopets.com/new_shopkeepers/2071.gif', value: '2071' },
            { src: 'https://images.neopets.com/new_shopkeepers/2089.gif', value: '2089' },
            { src: 'https://images.neopets.com/new_shopkeepers/2090.gif', value: '2090' },
            { src: 'https://images.neopets.com/new_shopkeepers/2091.gif', value: '2091' },
            { src: 'https://images.neopets.com/new_shopkeepers/2114.gif', value: '2114' },
            { src: 'https://images.neopets.com/new_shopkeepers/2115.gif', value: '2115' },
            { src: 'https://images.neopets.com/new_shopkeepers/2154.gif', value: '2154' },
            { src: 'https://images.neopets.com/new_shopkeepers/2155.gif', value: '2155' },
            { src: 'https://images.neopets.com/new_shopkeepers/2157.gif', value: '2157' },
            { src: 'https://images.neopets.com/new_shopkeepers/2164.gif', value: '2164' },
            { src: 'https://images.neopets.com/new_shopkeepers/2165.gif', value: '2165' },
            { src: 'https://images.neopets.com/new_shopkeepers/2168.gif', value: '2168' },
            { src: 'https://images.neopets.com/new_shopkeepers/2169.gif', value: '2169' },
            { src: 'https://images.neopets.com/new_shopkeepers/2180.gif', value: '2180' },
            { src: 'https://images.neopets.com/new_shopkeepers/2181.gif', value: '2181' },
            { src: 'https://images.neopets.com/new_shopkeepers/2186.gif', value: '2186' },
            { src: 'https://images.neopets.com/new_shopkeepers/2187.gif', value: '2187' },
            { src: 'https://images.neopets.com/new_shopkeepers/2188.gif', value: '2188' },
            { src: 'https://images.neopets.com/new_shopkeepers/2190.gif', value: '2190' },
            { src: 'https://images.neopets.com/new_shopkeepers/2191.gif', value: '2191' },
            { src: 'https://images.neopets.com/new_shopkeepers/2194.gif', value: '2194' },
            { src: 'https://images.neopets.com/new_shopkeepers/2196.gif', value: '2196' },
            { src: 'https://images.neopets.com/new_shopkeepers/2197.gif', value: '2197' },
            { src: 'https://images.neopets.com/new_shopkeepers/2202.gif', value: '2202' },
            { src: 'https://images.neopets.com/new_shopkeepers/2203.gif', value: '2203' },
            { src: 'https://images.neopets.com/new_shopkeepers/2206.gif', value: '2206' },
            { src: 'https://images.neopets.com/new_shopkeepers/2207.gif', value: '2207' },
            { src: 'https://images.neopets.com/new_shopkeepers/2212.gif', value: '2212' },
            { src: 'https://images.neopets.com/new_shopkeepers/2213.gif', value: '2213' },
            { src: 'https://images.neopets.com/new_shopkeepers/2214.gif', value: '2214' },
            { src: 'https://images.neopets.com/new_shopkeepers/2215.gif', value: '2215' },
            { src: 'https://images.neopets.com/new_shopkeepers/2218.gif', value: '2218' },
            { src: 'https://images.neopets.com/new_shopkeepers/2221.gif', value: '2221' },
            { src: 'https://images.neopets.com/new_shopkeepers/2222.gif', value: '2222' },
            { src: 'https://images.neopets.com/new_shopkeepers/2226.gif', value: '2226' },
            { src: 'https://images.neopets.com/new_shopkeepers/2227.gif', value: '2227' },
            { src: 'https://images.neopets.com/new_shopkeepers/2229.gif', value: '2229' },
            { src: 'https://images.neopets.com/new_shopkeepers/2230.gif', value: '2230' },
            { src: 'https://images.neopets.com/new_shopkeepers/2231.gif', value: '2231' },
            { src: 'https://images.neopets.com/new_shopkeepers/2235.gif', value: '2235' },
            { src: 'https://images.neopets.com/new_shopkeepers/2236.gif', value: '2236' },
            { src: 'https://images.neopets.com/new_shopkeepers/2244.gif', value: '2244' },
            { src: 'https://images.neopets.com/new_shopkeepers/2245.gif', value: '2245' },
            { src: 'https://images.neopets.com/new_shopkeepers/2246.gif', value: '2246' },
            { src: 'https://images.neopets.com/new_shopkeepers/2253.gif', value: '2253' },
            { src: 'https://images.neopets.com/new_shopkeepers/2255.gif', value: '2255' },
            { src: 'https://images.neopets.com/new_shopkeepers/2268.gif', value: '2268' }
        ],
        Petpets2: [
            { src: 'https://images.neopets.com/new_shopkeepers/1025.gif', value: '1025' },
            { src: 'https://images.neopets.com/new_shopkeepers/1029.gif', value: '1029' },
            { src: 'https://images.neopets.com/new_shopkeepers/1030.gif', value: '1030' },
            { src: 'https://images.neopets.com/new_shopkeepers/1031.gif', value: '1031' },
            { src: 'https://images.neopets.com/new_shopkeepers/1040.gif', value: '1040' },
            { src: 'https://images.neopets.com/new_shopkeepers/1041.gif', value: '1041' },
            { src: 'https://images.neopets.com/new_shopkeepers/1042.gif', value: '1042' },
            { src: 'https://images.neopets.com/new_shopkeepers/1043.gif', value: '1043' },
            { src: 'https://images.neopets.com/new_shopkeepers/1070.gif', value: '1070' },
            { src: 'https://images.neopets.com/new_shopkeepers/1071.gif', value: '1071' },
            { src: 'https://images.neopets.com/new_shopkeepers/1072.gif', value: '1072' },
            { src: 'https://images.neopets.com/new_shopkeepers/1073.gif', value: '1073' },
            { src: 'https://images.neopets.com/new_shopkeepers/1074.gif', value: '1074' },
            { src: 'https://images.neopets.com/new_shopkeepers/1075.gif', value: '1075' },
            { src: 'https://images.neopets.com/new_shopkeepers/1076.gif', value: '1076' },
            { src: 'https://images.neopets.com/new_shopkeepers/1100.gif', value: '1100' },
            { src: 'https://images.neopets.com/new_shopkeepers/1101.gif', value: '1101' },
            { src: 'https://images.neopets.com/new_shopkeepers/1102.gif', value: '1102' },
            { src: 'https://images.neopets.com/new_shopkeepers/1153.gif', value: '1153' },
            { src: 'https://images.neopets.com/new_shopkeepers/1154.gif', value: '1154' },
            { src: 'https://images.neopets.com/new_shopkeepers/1155.gif', value: '1155' },
            { src: 'https://images.neopets.com/new_shopkeepers/1160.gif', value: '1160' },
            { src: 'https://images.neopets.com/new_shopkeepers/1161.gif', value: '1161' },
            { src: 'https://images.neopets.com/new_shopkeepers/1162.gif', value: '1162' },
            { src: 'https://images.neopets.com/new_shopkeepers/1174.gif', value: '1174' },
            { src: 'https://images.neopets.com/new_shopkeepers/1175.gif', value: '1175' },
            { src: 'https://images.neopets.com/new_shopkeepers/1176.gif', value: '1176' },
            { src: 'https://images.neopets.com/new_shopkeepers/1200.gif', value: '1200' },
            { src: 'https://images.neopets.com/new_shopkeepers/1201.gif', value: '1201' },
            { src: 'https://images.neopets.com/new_shopkeepers/1202.gif', value: '1202' },
            { src: 'https://images.neopets.com/new_shopkeepers/1219.gif', value: '1219' },
            { src: 'https://images.neopets.com/new_shopkeepers/1220.gif', value: '1220' },
            { src: 'https://images.neopets.com/new_shopkeepers/1221.gif', value: '1221' },
            { src: 'https://images.neopets.com/new_shopkeepers/1229.gif', value: '1229' },
            { src: 'https://images.neopets.com/new_shopkeepers/1230.gif', value: '1230' },
            { src: 'https://images.neopets.com/new_shopkeepers/1231.gif', value: '1231' },
            { src: 'https://images.neopets.com/new_shopkeepers/1281.gif', value: '1281' },
            { src: 'https://images.neopets.com/new_shopkeepers/1282.gif', value: '1282' },
            { src: 'https://images.neopets.com/new_shopkeepers/1283.gif', value: '1283' },
            { src: 'https://images.neopets.com/new_shopkeepers/1284.gif', value: '1284' },
            { src: 'https://images.neopets.com/new_shopkeepers/1314.gif', value: '1314' },
            { src: 'https://images.neopets.com/new_shopkeepers/1316.gif', value: '1316' },
            { src: 'https://images.neopets.com/new_shopkeepers/1317.gif', value: '1317' },
            { src: 'https://images.neopets.com/new_shopkeepers/1330.gif', value: '1330' },
            { src: 'https://images.neopets.com/new_shopkeepers/1331.gif', value: '1331' },
            { src: 'https://images.neopets.com/new_shopkeepers/1332.gif', value: '1332' },
            { src: 'https://images.neopets.com/new_shopkeepers/1333.gif', value: '1333' },
            { src: 'https://images.neopets.com/new_shopkeepers/1334.gif', value: '1334' },
            { src: 'https://images.neopets.com/new_shopkeepers/1359.gif', value: '1359' },
            { src: 'https://images.neopets.com/new_shopkeepers/1360.gif', value: '1360' },
            { src: 'https://images.neopets.com/new_shopkeepers/1361.gif', value: '1361' },
            { src: 'https://images.neopets.com/new_shopkeepers/1362.gif', value: '1362' },
            { src: 'https://images.neopets.com/new_shopkeepers/1371.gif', value: '1371' },
            { src: 'https://images.neopets.com/new_shopkeepers/1372.gif', value: '1372' },
            { src: 'https://images.neopets.com/new_shopkeepers/1373.gif', value: '1373' },
            { src: 'https://images.neopets.com/new_shopkeepers/1386.gif', value: '1386' },
            { src: 'https://images.neopets.com/new_shopkeepers/1387.gif', value: '1387' },
            { src: 'https://images.neopets.com/new_shopkeepers/1388.gif', value: '1388' },
            { src: 'https://images.neopets.com/new_shopkeepers/1389.gif', value: '1389' },
            { src: 'https://images.neopets.com/new_shopkeepers/1406.gif', value: '1406' },
            { src: 'https://images.neopets.com/new_shopkeepers/1407.gif', value: '1407' },
            { src: 'https://images.neopets.com/new_shopkeepers/1408.gif', value: '1408' },
            { src: 'https://images.neopets.com/new_shopkeepers/1409.gif', value: '1409' },
            { src: 'https://images.neopets.com/new_shopkeepers/1456.gif', value: '1456' },
            { src: 'https://images.neopets.com/new_shopkeepers/1457.gif', value: '1457' },
            { src: 'https://images.neopets.com/new_shopkeepers/1458.gif', value: '1458' },
            { src: 'https://images.neopets.com/new_shopkeepers/1468.gif', value: '1468' },
            { src: 'https://images.neopets.com/new_shopkeepers/1469.gif', value: '1469' },
            { src: 'https://images.neopets.com/new_shopkeepers/1470.gif', value: '1470' },
            { src: 'https://images.neopets.com/new_shopkeepers/1487.gif', value: '1487' },
            { src: 'https://images.neopets.com/new_shopkeepers/1490.gif', value: '1490' },
            { src: 'https://images.neopets.com/new_shopkeepers/1491.gif', value: '1491' },
            { src: 'https://images.neopets.com/new_shopkeepers/1492.gif', value: '1492' },
            { src: 'https://images.neopets.com/new_shopkeepers/1493.gif', value: '1493' },
            { src: 'https://images.neopets.com/new_shopkeepers/1505.gif', value: '1505' },
            { src: 'https://images.neopets.com/new_shopkeepers/1506.gif', value: '1506' },
            { src: 'https://images.neopets.com/new_shopkeepers/1507.gif', value: '1507' },
            { src: 'https://images.neopets.com/new_shopkeepers/1511.gif', value: '1511' },
            { src: 'https://images.neopets.com/new_shopkeepers/1512.gif', value: '1512' },
            { src: 'https://images.neopets.com/new_shopkeepers/1513.gif', value: '1513' },
            { src: 'https://images.neopets.com/new_shopkeepers/1514.gif', value: '1514' },
            { src: 'https://images.neopets.com/new_shopkeepers/1519.gif', value: '1519' },
            { src: 'https://images.neopets.com/new_shopkeepers/1520.gif', value: '1520' },
            { src: 'https://images.neopets.com/new_shopkeepers/1521.gif', value: '1521' },
            { src: 'https://images.neopets.com/new_shopkeepers/1534.gif', value: '1534' },
            { src: 'https://images.neopets.com/new_shopkeepers/1535.gif', value: '1535' },
            { src: 'https://images.neopets.com/new_shopkeepers/1542.gif', value: '1542' },
            { src: 'https://images.neopets.com/new_shopkeepers/1565.gif', value: '1565' },
            { src: 'https://images.neopets.com/new_shopkeepers/1566.gif', value: '1566' },
            { src: 'https://images.neopets.com/new_shopkeepers/1567.gif', value: '1567' },
            { src: 'https://images.neopets.com/new_shopkeepers/1568.gif', value: '1568' },
            { src: 'https://images.neopets.com/new_shopkeepers/1597.gif', value: '1597' },
            { src: 'https://images.neopets.com/new_shopkeepers/1600.gif', value: '1600' },
            { src: 'https://images.neopets.com/new_shopkeepers/1646.gif', value: '1646' },
            { src: 'https://images.neopets.com/new_shopkeepers/1668.gif', value: '1668' },
            { src: 'https://images.neopets.com/new_shopkeepers/1686.gif', value: '1686' },
            { src: 'https://images.neopets.com/new_shopkeepers/1757.gif', value: '1757' },
            { src: 'https://images.neopets.com/new_shopkeepers/1784.gif', value: '1784' },
            { src: 'https://images.neopets.com/new_shopkeepers/1785.gif', value: '1785' },
            { src: 'https://images.neopets.com/new_shopkeepers/1786.gif', value: '1786' },
            { src: 'https://images.neopets.com/new_shopkeepers/1806.gif', value: '1806' },
            { src: 'https://images.neopets.com/new_shopkeepers/1816.gif', value: '1816' },
            { src: 'https://images.neopets.com/new_shopkeepers/1817.gif', value: '1817' },
            { src: 'https://images.neopets.com/new_shopkeepers/1818.gif', value: '1818' },
            { src: 'https://images.neopets.com/new_shopkeepers/1847.gif', value: '1847' },
        ],
        Other: [
            { src: 'https://images.neopets.com/new_shopkeepers/36.gif', value:   '36' },
            { src: 'https://images.neopets.com/new_shopkeepers/41.gif', value:   '41' },
            { src: 'https://images.neopets.com/new_shopkeepers/89.gif', value:   '89' },
            { src: 'https://images.neopets.com/new_shopkeepers/139.gif', value:  '139' },
            { src: 'https://images.neopets.com/new_shopkeepers/154.gif', value:  '154' },
            { src: 'https://images.neopets.com/new_shopkeepers/156.gif', value:  '156' },
            { src: 'https://images.neopets.com/new_shopkeepers/159.gif', value:  '159' },
            { src: 'https://images.neopets.com/new_shopkeepers/163.gif', value:  '163' },
            { src: 'https://images.neopets.com/new_shopkeepers/164.gif', value:  '164' },
            { src: 'https://images.neopets.com/new_shopkeepers/167.gif', value:  '167' },
            { src: 'https://images.neopets.com/new_shopkeepers/168.gif', value:  '168' },
            { src: 'https://images.neopets.com/new_shopkeepers/172.gif', value:  '172' },
            { src: 'https://images.neopets.com/new_shopkeepers/175.gif', value:  '175' },
            { src: 'https://images.neopets.com/new_shopkeepers/179.gif', value:  '179' },
            { src: 'https://images.neopets.com/new_shopkeepers/185.gif', value:  '185' },
            { src: 'https://images.neopets.com/new_shopkeepers/174.gif', value:  '174' },
            { src: 'https://images.neopets.com/new_shopkeepers/225.gif', value:  '225' },
            { src: 'https://images.neopets.com/new_shopkeepers/701.gif', value:  '701' },
            { src: 'https://images.neopets.com/new_shopkeepers/702.gif', value:  '702' },
            { src: 'https://images.neopets.com/new_shopkeepers/703.gif', value:  '703' },
            { src: 'https://images.neopets.com/new_shopkeepers/803.gif', value:  '803' },
            { src: 'https://images.neopets.com/new_shopkeepers/982.gif', value:  '982' },
            { src: 'https://images.neopets.com/new_shopkeepers/983.gif', value:  '983' },
            { src: 'https://images.neopets.com/new_shopkeepers/984.gif', value:  '984' },
            { src: 'https://images.neopets.com/new_shopkeepers/1107.gif', value: '1107' },
            { src: 'https://images.neopets.com/new_shopkeepers/1108.gif', value: '1108' },
            { src: 'https://images.neopets.com/new_shopkeepers/1109.gif', value: '1109' },
            { src: 'https://images.neopets.com/new_shopkeepers/1141.gif', value: '1141' },
            { src: 'https://images.neopets.com/new_shopkeepers/1142.gif', value: '1142' },
            { src: 'https://images.neopets.com/new_shopkeepers/1143.gif', value: '1143' },
            { src: 'https://images.neopets.com/new_shopkeepers/1144.gif', value: '1144' },
            { src: 'https://images.neopets.com/new_shopkeepers/1739.gif', value: '1739' },
            { src: 'https://images.neopets.com/new_shopkeepers/1740.gif', value: '1740' },
            { src: 'https://images.neopets.com/new_shopkeepers/1855.gif', value: '1855' },
            { src: 'https://images.neopets.com/new_shopkeepers/1857.gif', value: '1857' },
            { src: 'https://images.neopets.com/new_shopkeepers/1858.gif', value: '1858' },
            { src: 'https://images.neopets.com/new_shopkeepers/2044.gif', value: '2044' },
            { src: 'https://images.neopets.com/new_shopkeepers/2045.gif', value: '2045' },
            { src: 'https://images.neopets.com/new_shopkeepers/2046.gif', value: '2046' },
            { src: 'https://images.neopets.com/new_shopkeepers/2047.gif', value: '2047' },
            { src: 'https://images.neopets.com/new_shopkeepers/2241.gif', value: '2241' },
            { src: 'https://images.neopets.com/new_shopkeepers/2242.gif', value: '2242' },
            { src: 'https://images.neopets.com/new_shopkeepers/2247.gif', value: '2247' },
            { src: 'https://images.neopets.com/new_shopkeepers/2248.gif', value: '2248' },
            { src: 'https://images.neopets.com/new_shopkeepers/2249.gif', value: '2249' },
            { src: 'https://images.neopets.com/new_shopkeepers/2259.gif', value: '2259' },
            { src: 'https://images.neopets.com/new_shopkeepers/2303.gif', value: '2303' }
        ]
    };

    // Create the modal
    const createModal = () => {
        const modal = document.createElement('div');
        modal.id = 'shopkeeperModal';
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.left = '50%';
        modal.style.top = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.zIndex = '1000';
        modal.style.maxHeight = '80%';
        modal.style.overflowY = 'auto';

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.onclick = () => { modal.style.display = 'none'; };

        modal.appendChild(closeButton);
        document.body.appendChild(modal);
        return modal;
    };

    const modal = createModal();

    // Function to load images into the modal
    window.loadImagesInModal = (images) => {
        while (modal.children.length > 1) {
            modal.removeChild(modal.lastChild);
        }

        const imgContainer = document.createElement('div');
        imgContainer.style.display = 'grid';
        imgContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        imgContainer.style.gap = '10px';

        images.forEach(image => {
            const imgLink = document.createElement('a');
            imgLink.href = 'javascript:void(0)';

            // Create the radio button and append it to the form
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'selected_sk';
            radioInput.id = `radio_${image.value}`;
            radioInput.value = image.value;
            document.select_form.appendChild(radioInput);

            imgLink.onclick = () => {
                radioInput.checked = true;
                document.select_form.submit();
            };

            const imgElement = document.createElement('img');
            imgElement.src = image.src;
            imgElement.width = 150;
            imgElement.height = 150;
            imgElement.border = 0;

            imgLink.appendChild(imgElement);
            imgContainer.appendChild(imgLink);
        });

        modal.appendChild(imgContainer);
        modal.style.display = 'block';
    };

    // Add Category Buttons
    const addCategories = () => {
        const categoryList = document.createElement('ul');
        for (const [key, value] of Object.entries(categories)) {
            const li = document.createElement('li');
            li.innerHTML = `<b><a href='javascript:void(0)' onclick='loadImagesInModal(categories.${key})'>${key.charAt(0).toUpperCase() + key.slice(1)}</a></b>`;
            categoryList.appendChild(li);
        }

        const existingCategories = document.querySelector('form[name="select_form"] > table > tbody > tr:nth-child(2)');
        existingCategories.parentNode.insertBefore(categoryList, existingCategories.nextSibling);
    };

    // Expose categories to the global scope for the modal and initialize categories
    window.categories = categories;
    addCategories();
})();