// ==UserScript==
// @name			Gay Harem Codex
// @namespace		haremheroes.com
// @description		Adding things here and there in Harem Heroes game.
// @version			0.07.4
// @match			https://nutaku.haremheroes.com/*
// @match			https://eroges.hentaiheroes.com/*
// @match			https://thrix.hentaiheroes.com/*
// @match			https://www.hentaiheroes.com/*
// @match			https://www.gayharem.com/*
// @match			https://test.hentaiheroes.com/*
// @run-at			document-end
// @grant			none
// @author			Raphael Updated by 1121
// @downloadURL https://update.greasyfork.org/scripts/376488/Gay%20Harem%20Codex.user.js
// @updateURL https://update.greasyfork.org/scripts/376488/Gay%20Harem%20Codex.meta.js
// ==/UserScript==

/* ==================
      localStorage
   ==================
	- lsMarket				(updated each time you enter the Market / click buttons in Market)
		.buyable
			.potion.Nb		= number of buyable books
			.potion.Xp		= total xp of buyable books
			.potion.Value	= cost of buyable books
			.gift.Nb		= number of owned gifts
			.gift.Xp		= total affection of buyable gifts
			.gift.Value		= cost of buyable gifts
		.stocks
			.armor.Nb		= number of owned equipments
			.booster.Nb		= number of owned boosters
			.potion.Nb		= number of owned books
			.potion.Xp		= total xp you can give to your girls
			.gift.Nb		= number of owned gifts
			.gift.Xp		= total affection you can give to your girls
		.restock
			.herolvl		= hero level before restock
			.time			= next market restock time
   ================== */

var $ = window.jQuery;
var lang = "en";
if($('html')[0].lang == "en"){
    lang = "en";
}else if($('html')[0].lang == "es_ES"){
    lang = "es";
}
else if($('html')[0].lang == "de_DE"){
    //    lang = "de";
}
else if($('html')[0].lang == "fr"){
    lang = "fr";
}
else if($('html')[0].lang == "it_IT"){
    //    lang = "it";
}

//alert($('html')[0].lang);
//lang = "et";
var GIRLS_EXP_LEVELS = [];
GIRLS_EXP_LEVELS.starting = [10, 21, 32, 43, 54, 65, 76, 87, 98, 109, 120, 131, 142, 154, 166, 178, 190, 202, 214, 226, 238, 250, 262, 274, 286, 299, 312, 325, 338, 351, 364, 377, 390, 403, 416, 429, 443, 457, 471, 485, 499, 513, 527, 541, 555, 569, 584, 599, 614, 629, 644, 659, 674, 689, 704, 720, 736, 752, 768, 784, 800, 816, 832, 849, 866, 883, 900, 917, 934, 951, 968, 985, 1003, 1021, 1039, 1057, 1075, 1093, 1111, 1130, 1149, 1168, 1187, 1206, 1225, 1244, 1264, 1284, 1304, 1324, 1344, 1364, 1384, 1405, 1426, 1447, 1468, 1489, 1510, 1531, 1553, 1575, 1597, 1619, 1641, 1663, 1686, 1709, 1732, 1755, 1778, 1801, 1825, 1849, 1873, 1897, 1921, 1945, 1970, 1995, 2020, 2045, 2070, 2096, 2122, 2148, 2174, 2200, 2227, 2254, 2281, 2308, 2335, 2363, 2391, 2419, 2447, 2475, 2504, 2533, 2562, 2591, 2620, 2650, 2680, 2710, 2740, 2770, 2801, 2832, 2863, 2894, 2926, 2958, 2990, 3022, 3055, 3088, 3121, 3154, 3188, 3222, 3256, 3290, 3325, 3360, 3395, 3430, 3466, 3502, 3538, 3574, 3611, 3648, 3685, 3722, 3760, 3798, 3836, 3875, 3914, 3953, 3992, 4032, 4072, 4112, 4153, 4194, 4235, 4277, 4319, 4361, 4403, 4446, 4489, 4532, 4576, 4620, 4664, 4709, 4754, 4799, 4845, 4891, 4937, 4984, 5031, 5078, 5126, 5174, 5223, 5272, 5321, 5371, 5421, 5471, 5522, 5573, 5624, 5676, 5728, 5781, 5834, 5887, 5941, 5995, 6050, 6105, 6160, 6216, 6272, 6329, 6386, 6444, 6502, 6560, 6619, 6678, 6738, 6798, 6859, 6920, 6981, 7043, 7105, 7168, 7231, 7295, 7359, 7424, 7489, 7555, 7621, 7688, 7755, 7823, 7891, 7960, 8029, 8099, 8169, 8240, 8311, 8383, 8455, 8528, 8601, 8675, 8750, 8825, 8901, 8977, 9054, 9131, 9209, 9288, 9367, 9447, 9527, 9608, 9690, 9772, 9855, 9938, 10022, 10107, 10192, 10278, 10365, 10452, 10540, 10628, 10717, 10807, 10897, 10988, 11080, 11172, 11265, 11359, 11454, 11549, 11645, 11742, 11839, 11937, 12036, 12136, 12236, 12337, 12439, 12542, 12645, 12749, 12854, 12960, 13067, 13174, 13282, 13391, 13501, 13612, 13723, 13835, 13948, 14062, 14177, 14293, 14409, 14526, 14644, 14763, 14883, 15004, 15126, 15249, 15373, 15498, 15623, 15749, 15876, 16004, 16133, 16263, 16394, 16526, 16659, 16793, 16928, 17064, 17201, 17339, 17478, 17618, 17759, 17901, 18044, 18189, 18335, 18482, 18630, 18779, 18929, 19080, 19232, 19385, 19540, 19696, 19853, 20011, 20170, 20330, 20492, 20655, 20819, 20984, 21151, 21319, 21488, 21658, 21830, 22003, 22177, 22352, 22529, 22707, 22886, 23067, 23249, 23432, 23617, 23803, 23991, 24180, 24370, 24562, 24755, 24950, 25146, 25344];
GIRLS_EXP_LEVELS.common = [10, 21, 32, 43, 54, 65, 76, 87, 98, 109, 120, 131, 142, 154, 166, 178, 190, 202, 214, 226, 238, 250, 262, 274, 286, 299, 312, 325, 338, 351, 364, 377, 390, 403, 416, 429, 443, 457, 471, 485, 499, 513, 527, 541, 555, 569, 584, 599, 614, 629, 644, 659, 674, 689, 704, 720, 736, 752, 768, 784, 800, 816, 832, 849, 866, 883, 900, 917, 934, 951, 968, 985, 1003, 1021, 1039, 1057, 1075, 1093, 1111, 1130, 1149, 1168, 1187, 1206, 1225, 1244, 1264, 1284, 1304, 1324, 1344, 1364, 1384, 1405, 1426, 1447, 1468, 1489, 1510, 1531, 1553, 1575, 1597, 1619, 1641, 1663, 1686, 1709, 1732, 1755, 1778, 1801, 1825, 1849, 1873, 1897, 1921, 1945, 1970, 1995, 2020, 2045, 2070, 2096, 2122, 2148, 2174, 2200, 2227, 2254, 2281, 2308, 2335, 2363, 2391, 2419, 2447, 2475, 2504, 2533, 2562, 2591, 2620, 2650, 2680, 2710, 2740, 2770, 2801, 2832, 2863, 2894, 2926, 2958, 2990, 3022, 3055, 3088, 3121, 3154, 3188, 3222, 3256, 3290, 3325, 3360, 3395, 3430, 3466, 3502, 3538, 3574, 3611, 3648, 3685, 3722, 3760, 3798, 3836, 3875, 3914, 3953, 3992, 4032, 4072, 4112, 4153, 4194, 4235, 4277, 4319, 4361, 4403, 4446, 4489, 4532, 4576, 4620, 4664, 4709, 4754, 4799, 4845, 4891, 4937, 4984, 5031, 5078, 5126, 5174, 5223, 5272, 5321, 5371, 5421, 5471, 5522, 5573, 5624, 5676, 5728, 5781, 5834, 5887, 5941, 5995, 6050, 6105, 6160, 6216, 6272, 6329, 6386, 6444, 6502, 6560, 6619, 6678, 6738, 6798, 6859, 6920, 6981, 7043, 7105, 7168, 7231, 7295, 7359, 7424, 7489, 7555, 7621, 7688, 7755, 7823, 7891, 7960, 8029, 8099, 8169, 8240, 8311, 8383, 8455, 8528, 8601, 8675, 8750, 8825, 8901, 8977, 9054, 9131, 9209, 9288, 9367, 9447, 9527, 9608, 9690, 9772, 9855, 9938, 10022, 10107, 10192, 10278, 10365, 10452, 10540, 10628, 10717, 10807, 10897, 10988, 11080, 11172, 11265, 11359, 11454, 11549, 11645, 11742, 11839, 11937, 12036, 12136, 12236, 12337, 12439, 12542, 12645, 12749, 12854, 12960, 13067, 13174, 13282, 13391, 13501, 13612, 13723, 13835, 13948, 14062, 14177, 14293, 14409, 14526, 14644, 14763, 14883, 15004, 15126, 15249, 15373, 15498, 15623, 15749, 15876, 16004, 16133, 16263, 16394, 16526, 16659, 16793, 16928, 17064, 17201, 17339, 17478, 17618, 17759, 17901, 18044, 18189, 18335, 18482, 18630, 18779, 18929, 19080, 19232, 19385, 19540, 19696, 19853, 20011, 20170, 20330, 20492, 20655, 20819, 20984, 21151, 21319, 21488, 21658, 21830, 22003, 22177, 22352, 22529, 22707, 22886, 23067, 23249, 23432, 23617, 23803, 23991, 24180, 24370, 24562, 24755, 24950, 25146, 25344];
GIRLS_EXP_LEVELS.rare = [12, 25, 38, 51, 64, 77, 90, 103, 116, 129, 142, 156, 170, 184, 198, 212, 226, 240, 254, 268, 282, 297, 312, 327, 342, 357, 372, 387, 402, 417, 433, 449, 465, 481, 497, 513, 529, 545, 561, 578, 595, 612, 629, 646, 663, 680, 697, 715, 733, 751, 769, 787, 805, 823, 841, 860, 879, 898, 917, 936, 955, 974, 994, 1014, 1034, 1054, 1074, 1094, 1114, 1135, 1156, 1177, 1198, 1219, 1240, 1262, 1284, 1306, 1328, 1350, 1372, 1394, 1417, 1440, 1463, 1486, 1509, 1532, 1556, 1580, 1604, 1628, 1652, 1677, 1702, 1727, 1752, 1777, 1802, 1828, 1854, 1880, 1906, 1932, 1959, 1986, 2013, 2040, 2067, 2095, 2123, 2151, 2179, 2207, 2236, 2265, 2294, 2323, 2352, 2382, 2412, 2442, 2472, 2503, 2534, 2565, 2596, 2627, 2659, 2691, 2723, 2755, 2788, 2821, 2854, 2887, 2921, 2955, 2989, 3023, 3058, 3093, 3128, 3163, 3199, 3235, 3271, 3307, 3344, 3381, 3418, 3456, 3494, 3532, 3570, 3609, 3648, 3687, 3727, 3767, 3807, 3847, 3888, 3929, 3970, 4012, 4054, 4096, 4139, 4182, 4225, 4269, 4313, 4357, 4402, 4447, 4492, 4538, 4584, 4630, 4677, 4724, 4771, 4819, 4867, 4915, 4964, 5013, 5062, 5112, 5162, 5213, 5264, 5315, 5367, 5419, 5471, 5524, 5577, 5631, 5685, 5739, 5794, 5849, 5905, 5961, 6017, 6074, 6131, 6189, 6247, 6306, 6365, 6424, 6484, 6544, 6605, 6666, 6728, 6790, 6853, 6916, 6980, 7044, 7108, 7173, 7238, 7304, 7370, 7437, 7504, 7572, 7640, 7709, 7778, 7848, 7918, 7989, 8061, 8133, 8206, 8279, 8353, 8427, 8502, 8577, 8653, 8729, 8806, 8884, 8962, 9041, 9120, 9200, 9281, 9362, 9444, 9526, 9609, 9693, 9777, 9862, 9947, 10033, 10120, 10207, 10295, 10384, 10473, 10563, 10654, 10745, 10837, 10930, 11023, 11117, 11212, 11308, 11404, 11501, 11599, 11697, 11796, 11896, 11997, 12098, 12200, 12303, 12407, 12511, 12616, 12722, 12829, 12937, 13045, 13154, 13264, 13375, 13487, 13600, 13713, 13827, 13942, 14058, 14175, 14293, 14412, 14531, 14651, 14772, 14894, 15017, 15141, 15266, 15392, 15519, 15647, 15776, 15906, 16037, 16169, 16302, 16436, 16571, 16707, 16844, 16982, 17121, 17261, 17402, 17544, 17687, 17831, 17976, 18122, 18269, 18417, 18566, 18716, 18868, 19021, 19175, 19330, 19486, 19643, 19802, 19962, 20123, 20285, 20448, 20613, 20779, 20946, 21114, 21284, 21455, 21627, 21800, 21975, 22151, 22328, 22507, 22687, 22868, 23051, 23235, 23420, 23607, 23795, 23985, 24176, 24368, 24562, 24757, 24954, 25152, 25352, 25553, 25756, 25960, 26166, 26373, 26582, 26792, 27004, 27218, 27433, 27650, 27868, 28088, 28310, 28533, 28758, 28985, 29213, 29443, 29675, 29909, 30144, 30381];
GIRLS_EXP_LEVELS.epic = [14, 29, 44, 59, 74, 89, 104, 119, 134, 149, 165, 181, 197, 213, 229, 245, 261, 277, 294, 311, 328, 345, 362, 379, 396, 413, 431, 449, 467, 485, 503, 521, 539, 557, 576, 595, 614, 633, 652, 671, 690, 710, 730, 750, 770, 790, 810, 830, 851, 872, 893, 914, 935, 956, 977, 999, 1021, 1043, 1065, 1087, 1109, 1132, 1155, 1178, 1201, 1224, 1247, 1271, 1295, 1319, 1343, 1367, 1391, 1416, 1441, 1466, 1491, 1516, 1542, 1568, 1594, 1620, 1646, 1673, 1700, 1727, 1754, 1781, 1809, 1837, 1865, 1893, 1921, 1950, 1979, 2008, 2037, 2066, 2096, 2126, 2156, 2186, 2217, 2248, 2279, 2310, 2341, 2373, 2405, 2437, 2469, 2502, 2535, 2568, 2601, 2635, 2669, 2703, 2737, 2772, 2807, 2842, 2877, 2913, 2949, 2985, 3021, 3058, 3095, 3132, 3169, 3207, 3245, 3283, 3322, 3361, 3400, 3439, 3479, 3519, 3559, 3600, 3641, 3682, 3724, 3766, 3808, 3850, 3893, 3936, 3979, 4023, 4067, 4111, 4156, 4201, 4246, 4292, 4338, 4384, 4431, 4478, 4525, 4573, 4621, 4670, 4719, 4768, 4818, 4868, 4918, 4969, 5020, 5071, 5123, 5175, 5228, 5281, 5334, 5388, 5442, 5497, 5552, 5607, 5663, 5719, 5776, 5833, 5891, 5949, 6007, 6066, 6125, 6185, 6245, 6306, 6367, 6429, 6491, 6553, 6616, 6679, 6743, 6807, 6872, 6937, 7003, 7069, 7136, 7203, 7271, 7339, 7408, 7477, 7547, 7617, 7688, 7759, 7831, 7903, 7976, 8049, 8123, 8198, 8273, 8349, 8425, 8502, 8579, 8657, 8736, 8815, 8895, 8975, 9056, 9138, 9220, 9303, 9386, 9470, 9555, 9640, 9726, 9813, 9900, 9988, 10076, 10165, 10255, 10345, 10436, 10528, 10621, 10714, 10808, 10903, 10998, 11094, 11191, 11288, 11386, 11485, 11585, 11685, 11786, 11888, 11991, 12094, 12198, 12303, 12409, 12516, 12623, 12731, 12840, 12950, 13061, 13172, 13284, 13397, 13511, 13626, 13742, 13859, 13976, 14094, 14213, 14333, 14454, 14576, 14699, 14823, 14948, 15074, 15200, 15327, 15455, 15584, 15714, 15845, 15977, 16110, 16244, 16379, 16515, 16652, 16790, 16929, 17069, 17210, 17352, 17496, 17641, 17787, 17934, 18082, 18231, 18381, 18532, 18684, 18837, 18992, 19148, 19305, 19463, 19622, 19782, 19944, 20107, 20271, 20436, 20603, 20771, 20940, 21110, 21282, 21455, 21629, 21804, 21981, 22159, 22338, 22519, 22701, 22884, 23069, 23255, 23443, 23632, 23822, 24014, 24207, 24402, 24598, 24796, 24995, 25196, 25398, 25602, 25807, 26014, 26222, 26432, 26643, 26856, 27071, 27287, 27505, 27724, 27945, 28168, 28392, 28618, 28846, 29075, 29306, 29539, 29774, 30010, 30248, 30488, 30730, 30974, 31219, 31466, 31715, 31966, 32219, 32474, 32731, 32990, 33250, 33512, 33776, 34042, 34310, 34580, 34852, 35126, 35402];
GIRLS_EXP_LEVELS.legendary = [16, 33, 50, 67, 84, 101, 118, 135, 152, 170, 188, 206, 224, 242, 260, 278, 297, 316, 335, 354, 373, 392, 411, 431, 451, 471, 491, 511, 531, 551, 572, 593, 614, 635, 656, 677, 698, 720, 742, 764, 786, 808, 830, 853, 876, 899, 922, 945, 968, 992, 1016, 1040, 1064, 1088, 1112, 1137, 1162, 1187, 1212, 1237, 1263, 1289, 1315, 1341, 1367, 1394, 1421, 1448, 1475, 1502, 1529, 1557, 1585, 1613, 1641, 1670, 1699, 1728, 1757, 1786, 1816, 1846, 1876, 1906, 1936, 1967, 1998, 2029, 2060, 2092, 2124, 2156, 2188, 2221, 2254, 2287, 2320, 2354, 2388, 2422, 2456, 2491, 2526, 2561, 2596, 2632, 2668, 2704, 2740, 2777, 2814, 2851, 2888, 2926, 2964, 3002, 3041, 3080, 3119, 3158, 3198, 3238, 3278, 3319, 3360, 3401, 3443, 3485, 3527, 3569, 3612, 3655, 3698, 3742, 3786, 3830, 3875, 3920, 3965, 4011, 4057, 4103, 4150, 4197, 4244, 4292, 4340, 4388, 4437, 4486, 4536, 4586, 4636, 4687, 4738, 4789, 4841, 4893, 4946, 4999, 5052, 5106, 5160, 5215, 5270, 5325, 5381, 5437, 5494, 5551, 5608, 5666, 5724, 5783, 5842, 5902, 5962, 6023, 6084, 6145, 6207, 6269, 6332, 6395, 6459, 6523, 6588, 6653, 6719, 6785, 6852, 6919, 6987, 7055, 7124, 7193, 7263, 7333, 7404, 7475, 7547, 7619, 7692, 7765, 7839, 7914, 7989, 8065, 8141, 8218, 8295, 8373, 8451, 8530, 8610, 8690, 8771, 8852, 8934, 9017, 9100, 9184, 9269, 9354, 9440, 9526, 9613, 9701, 9789, 9878, 9968, 10058, 10149, 10241, 10333, 10426, 10520, 10615, 10710, 10806, 10903, 11000, 11098, 11197, 11297, 11397, 11498, 11600, 11703, 11806, 11910, 12015, 12121, 12227, 12334, 12442, 12551, 12661, 12771, 12882, 12994, 13107, 13221, 13336, 13452, 13568, 13685, 13803, 13922, 14042, 14163, 14285, 14408, 14532, 14656, 14781, 14907, 15034, 15162, 15291, 15421, 15552, 15684, 15817, 15951, 16086, 16222, 16359, 16497, 16636, 16776, 16917, 17059, 17202, 17346, 17492, 17639, 17787, 17936, 18086, 18237, 18389, 18542, 18696, 18852, 19009, 19167, 19326, 19486, 19648, 19811, 19975, 20140, 20306, 20474, 20643, 20813, 20984, 21157, 21331, 21506, 21683, 21861, 22040, 22221, 22403, 22586, 22771, 22957, 23144, 23333, 23523, 23715, 23908, 24103, 24299, 24496, 24695, 24895, 25097, 25300, 25505, 25712, 25920, 26130, 26341, 26554, 26768, 26984, 27202, 27421, 27642, 27865, 28089, 28315, 28543, 28772, 29003, 29236, 29470, 29706, 29944, 30184, 30426, 30669, 30914, 31161, 31410, 31661, 31914, 32168, 32424, 32682, 32942, 33204, 33468, 33734, 34002, 34272, 34544, 34818, 35094, 35372, 35652, 35934, 36219, 36506, 36795, 37086, 37379, 37674, 37972, 38272, 38574, 38878, 39185, 39494, 39805, 40119, 40435];

var texts = [];
texts.fr = {
    navigate:"Déplace-toi",
    current:"actuelle",
    locked:"bloquée",
    unlock_it:"débloque-la!",
    scene:"scène",
    harem:"Harem",
    bottom:"bas",
    or:"ou",
    total:"total",
    affection:"affection",
    harem_stats:"Stats du harem",
    haremettes:"haremettes",
    hardcore:"Hardcore",
    charm:"Charme",
    know_how:"Savoir-faire",
    unlocked_scenes:"scènes débloquées",
    money_incomes:"Revenus",
    per_hour:"par heure",
    when_all_collectable:"quand tout est disponible",
    required_to_unlock:"Requis pour débloquer la scène",
    my_stocks:"Mes stocks",
    top:"haut",
    equipments:"équipements",
    boosters:"boosters",
    books:"livres",
    gifts:"cadeaux",
    currently_buyable:"Stock disponible au marché",
    visit_the:'Visite le <a href="../shop.html">marché</a> first.',
    not_combatible:"Votre navigateur n'est pas compatible.",
    or_level:"ou niveau",
    restock:"Restock",
    wiki:"Page wiki de ",
    she_is_your:"Elle est ta", //He_is_your:"Il est ton',
    evolution_costs:"Ses couts d'évolution sont",
    world:"Monde ",
    villain:" troll",
    fight_villain:"Combats un troll",
    you_own:"Tu possèdes",
    you_can_give:"Tu peux donner un total de",
    you_can_sell:"Tu peux tout vendre pour",
    Xp:"Xp",
    stat_points_need:"Nombre de points requis pour max",
    money_need:"Argent demandé pour max",
    money_spent:"Argent dépensé dans le marché",
    bought_points:"Points achetés au marché",
    equipment_points:"Points donnés par ton équipement",
    points_from_level:"Points donnés par ton niveau",
    quick_list:"Liste rapide",
    required_to_get_max_level:"Requis pour obtenir toutes les filles au niveau maximum",
    starter:"Fille de départ",
    common:"Commun",
    rare:"Rare",
    epic:"Épique",
    legendary:"Légendaire"
};
texts.es = {
    navigate:"Navegar",
    current:"actual",
    locked:"bloqueado",
    unlock_it:"desbloquealo!",
    scene:"escena",
    harem:"Harén",
    bottom:"Fondo",
    or:"o",
    total:"Total",
    affection:"afecto",
    harem_stats:"Estatus del Harén",
    haremettes:"haremettes",
    hardcore:"Folladas",
    charm:"Encanto",
    know_how:"Saber-hacer",
    unlocked_scenes:"escenas desbloqueadas",
    money_incomes:"Ingreso de dinero",
    per_hour:"por hora",
    when_all_collectable:"cuando todo es coleccionable",
    required_to_unlock:"Requerido para desbloquear todas las escenas bloqueadas",
    my_stocks:"Mi Stock",
    top:"Tope",
    equipments:"equipamiento",
    boosters:"potenciadores",
    books:"libros",
    gifts:"regalos",
    currently_buyable:"Stocks Comprables Actualmente",
    visit_the:'Visita el <a href="../shop.html">Mercado</a> primero.',
    not_combatible:"Tu navegador no es compatible.",
    or_level:"o nivel",
    restock:"Restock",
    wiki:"wiki",
    she_is_your:"Ella es tu",
    evolution_costs:"Sus costo de evolucion son",
    world:"Mundo ",
    villain:" villano",
    fight_villain:"Pelear un villano",
    you_own:"Tienes",
    you_can_give:"Puedes dar un total de",
    you_can_sell:"Puedes vender todo por",
    Xp:"Xp",
    stat_points_need:"Puntos de estatus necesarios para maximo",
    money_need:"Dinero necesario para maximo",
    money_spent:"Dinero usado en el mercado",
    bought_points:"Puntos comprados del mercado",
    equipment_points:"Puntos de estatus de equipamiento",
    points_from_level:"Puntos de estatus de nivel",
    quick_list:"Lista Rapida",
    required_to_get_max_level:"Requerido para obtener el máximo nivel de todas las chicas"
};

texts.en = {
    navigate:"Navigate",
    current:"current",
    locked:"locked",
    unlock_it:"unlock it!",
    scene:"scene",
    harem:"Harem",
    bottom:"Bottom",
    or:"or",
    total:"Total",
    affection:"affection",
    harem_stats:"Harem Stats",
    haremettes:"haremettes",
    hardcore:"Hardcore",
    charm:"Charm",
    know_how:"Know-how",
    unlocked_scenes:"unlocked scenes",
    money_incomes:"Money income", //Sluimer: Spelling fix.
    per_hour:"per hour",
    when_all_collectable:"when all collectable",
    required_to_unlock:"Required to upgrade all haremettes", //Sluimer: Looks better.
    my_stocks:"My stock", //Sluimer: Spelling fix.
    top:"Top",
    equipments:"equipments",
    boosters:"boosters",
    books:"books",
    gifts:"gifts",
    currently_buyable:"Currently buyable stock", //Sluimer: Spelling fix.
    visit_the:'Visit the <a href="../shop.html">Market</a> first.',
    not_combatible:"Your webbrowser is not compatible.",
    or_level:"or level",
    restock:"Restock",
    wiki:"'s wiki page",
    she_is_your:"She is your",
    evolution_costs:"Upgrade costs are", //Sluimer: Translation fix.
    world:"World ",
    villain:" villain",
    fight_villain:"Fight a villain",
    you_own:"You own",
    you_can_give:"You can give a total of",
    you_can_sell:"You can sell everything for",
    Xp:"XP", //Sluimer: Looks better.
    stat_points_need:"Stat points need to max",
    money_need:"Money need to max",
    money_spent:"Money spent in market",
    bought_points:"Bought points from market",
    equipment_points:"Equipments stat points",
    points_from_level:"Stat points from level",
    quick_list:"Quick list",
    required_to_get_max_level:"Required to level all haremettes", //Sluimer: Grammar fix.
    starter:"Starter",
    common:"Common",
    rare:"Rare",
    epic:"Epic",
    legendary:"Legendary"
};
texts.et = {
    navigate:"Navigeeri",
    current:"praegune",
    locked:"lukus",
    unlock_it:"ava!",
    scene:"stseen",
    harem:"Naase haaremisse",
    bottom:"Alla",
    or:"või",
    total:"Kokku",
    affection:"kiinduvust",
    harem_stats:"Haaremi näitajad",
    haremettes:"haaremi naist",
    hardcore:"Hardcore",
    charm:"Sarm",
    know_how:"Teadmisi",
    unlocked_scenes:"avatud stseene",
    money_incomes:"Sissetulek",
    per_hour:"tunnis",
    when_all_collectable:"kui kõik valmis",
    required_to_unlock:"Maksumus, et avada stseenid",
    my_stocks:"Minu laoseis",
    top:"Üles",
    equipments:"eset",
    boosters:"boonust",
    books:"raamatut",
    gifts:"kingitust",
    currently_buyable:"Praegu ostetavad",
    visit_the:'Külasta <a href="../shop.html">turgu</a> kõigepealt.',
    not_combatible:"Sinu brauser ei ühildu.",
    or_level:"või level",
    restock:"Lao uuendus",
    wiki:" wiki",
    she_is_your:"Ta on sinu",
    evolution_costs:"Tema evolutsiooni maksumused",
    world:"Maailma",
    villain:"boss",
    fight_villain:"Võitle bossiga",
    you_own:"Sul on",
    you_can_give:"Sa saad lisada kokku",
    you_can_sell:"Sa saad müügiga teenida",
    Xp:"Xp",
    stat_points_need:"Oskuse punkte maksimumini",
    money_need:"Raha maksimumini",
    money_spent:"Raha kulunud oskuspunktidele",
    bought_points:"Ostetud oskuse punkte",
    equipment_points:"Esemete oskuse punktid",
    points_from_level:"Oskuse punkte levelist",
    quick_list:"Sorteeritud nimekiri",
    required_to_get_max_level:"Vajalik, et saada kõik tüdrukud maksimum levelini"
};
var CurrentPage = window.location.pathname;

// css define
var sheet = (function() {
    var style = document.createElement('style');
    document.head.appendChild(style);
    return style.sheet;
})();

// verify localstorage
var lsAvailable = (lsTest() === true) ? 'yes' : 'no';

FightATroll();														// added everywhere
if (CurrentPage.indexOf('shop') != -1) ModifyMarket();				// Current page: Market
else if (CurrentPage.indexOf('harem') != -1) ModifyHarem();			// Current page: Harem
else if (CurrentPage.indexOf('quest') != -1) ModifyScenes();		// Current page: Haremettes' Scenes


/* ======================
	 Fight A Troll Menu
   ====================== */

function FightATroll() {
    // Some pages don't carry the Hero data - skip the menu in this case by Hollo
    if (typeof Hero == 'undefined') {
        return;
    }
    // Trolls' database
    var Trolls = ['Dark Lord', 'Ninja Spy', 'Gruntt', 'Edwarda', 'Donatien', 'Silvanus', 'Bremen', 'Finalmecia', 'Roko Senseï', 'Karole']; //Sluimer: Looks better.

    // get current world of player
    var CurrentWorld = Hero.infos.questing.id_world - 1,
        TrollName = '',
        TrollsMenu = '';

    // generate troll list
    for (var i = 0; i < CurrentWorld; i++) {
        if (typeof Trolls[i] !== typeof undefined && Trolls[i] !== false) {
            TrollName = Trolls[i];
        } else TrollName = texts[lang].world + ' ' + (i+1) + ' ' + texts[lang].villain;
        TrollsMenu += '<a href="/battle.html?id_troll=' + (i+1) + '">' + TrollName + '</a><br />';
    }

    // display: 'Fight a troll' menu
    $('#contains_all > header').children('[type=energy_fight]').append('<div id="FightTroll">' + texts[lang].fight_villain + '<span class="Arrow"></span><div class="TrollsMenu">' + TrollsMenu + '</div></div>');
    fightTrollCss();
}


/* ==========
	 Market
   ========== */

function ModifyMarket() {
    var loc2 = $('.hero_stats').children();
    loc2.each(function() {
        var stat = $(this).attr("hero");
        if(stat == "carac1" || stat == "carac2" || stat == "carac3"){
            $(this).append('<span class="CustomStats"></span><div id="CustomStats' + stat +'" class="StatsTooltip"></div>');
        }
    });

    updateStats();

    function updateStats(){
        var loc2 = $('.hero_stats').children();
        var last_cost = 0,
            levelPoints = 0,
            levelMoney = 0,
            level = Hero.infos.level;
        if(level <=25){
            levelPoints = level *40;
        } else {
            levelPoints = 1000 + (level-25)*19;
        }
        levelMoney = calculateTotalPrice(levelPoints);
        loc2.each(function() {
            var stat = $(this).attr("hero");
            $(".CustomStats").html('');
            if(stat == "carac1" || stat == "carac2" || stat == "carac3"){
                var currentStatPoints = Hero.infos[stat],
                    remainingPoints = levelPoints - currentStatPoints,
                    currentMoney = calculateTotalPrice(currentStatPoints),
                    remainingMoney = levelMoney - currentMoney,
                    skillPoints = Hero.infos.caracs[stat],
                    itemPoints = Hero.infos.items[stat],
                    boughtPoints = Hero.infos[stat];
                skillPoints = skillPoints - itemPoints - boughtPoints;


                $("#CustomStats" + stat).html(
                    "<b>" + texts[lang].stat_points_need + ":</b> " + NbCommas(remainingPoints) + "<br />" +
                    "<b>" + texts[lang].money_need + ": </b>" + NbCommas(remainingMoney) + "<br />" +
                    "<b>" + texts[lang].money_spent + ": </b>" + NbCommas(currentMoney) + "<br /><br />" +
                    "<b>" + texts[lang].bought_points + ": </b>" + NbCommas(boughtPoints) + "<br />" +
                    "<b>" + texts[lang].equipment_points + ": </b>" + NbCommas(itemPoints) + "<br />" +
                    "<b>" + texts[lang].points_from_level + ": </b>" + NbCommas(skillPoints) + "<br />"
                );
            }
        });
    }

    function calculateTotalPrice(points){
        var last_price = calculateStatPrice(points);
        var price = 0;
        if(points < 2001) {
            price = (5+last_price)/2*(points);
        } else if(points < 4001){
            price = 4012005+(4009+last_price)/2*(points-2001);
        }else if(points < 6001){
            price = 20026005+(12011+last_price)/2*(points-4001);
        }else if(points < 8001){
            price = 56042005+(24013+last_price)/2*(points-6001);
        }else if(points < 10001){
            price = 120060005+(40015+last_price)/2*(points-8001);
        }
        return price;
    }

    function calculateStatPrice(points){
        var cost = 0;
        if(points < 2001){
            cost = 3 + points * 2;
        }else if(points < 4001){
            cost = 4005+(points-2001)*4;
        }else if(points < 6001){
            cost = 12005+(points-4001)*6;
        }else if(points < 8001){
            cost = 24005+(points-6001)*8;
        }else if(points < 10001){
            cost = 40005+(points-8001)*10;
        }
        return cost;
    }


    var lsMarket = {};
    lsMarket.buyable = {};
    lsMarket.stocks = {};
    lsMarket.restock = {};

    setTimeout( function() {
        // save time of restock
        var restocktime = 0;
        var time = $('#shop > .shop_count > span').text();
        if(time.indexOf("h") > -1){
            restocktime = parseInt(time.substring(0, time.indexOf("h")))*3600;
            time = time.substring(time.indexOf("h")+1);
        }
        if(time.indexOf("m") > -1){
            restocktime += parseInt(time.substring(0, time.indexOf("m")))*60;
            time = time.substring(time.indexOf("h")+1);
        }
        if(time.indexOf("s") > -1){
            restocktime += parseInt(time.substring(0, time.indexOf("s")));
        }
        /*       var RestockTimer = $('#shop > .shop_count > span').text().split(':'),
            s = 0, m = 1;
        // convert HH:MM:SS or MM:SS or SS to seconds
        while (RestockTimer.length > 0) {
            s += m * parseInt(RestockTimer.pop(), 10);
            m *= 60;
        }
 */
        lsMarket.restock.herolvl = Hero.infos.level;
        lsMarket.restock.time = (new Date()).getTime() + restocktime*1000;

        // first load
        get_buyableStocks('potion');
        get_buyableStocks('gift');
        equipments_shop(0);
        boosters_shop(0);
        books_shop(0);
        gifts_shop(0);
    }, 500 );


    // catch click on Buy, Restock, Equip/Offer or Sell > update tooltip after 500ms
    var timer;
    $('#shop > button, #inventory > button').click(function() {
        var clickedButton = $(this).attr('rel'),
            opened_shop = $('#shop').children('.selected');
        clearTimeout(timer); // kill previous update
        timer = setTimeout( function() {
            if (opened_shop.hasClass('armor')) {
                equipments_shop(1);
            } else if (opened_shop.hasClass('booster')) {
                boosters_shop(1);
            } else if (opened_shop.hasClass('potion')) {
                if (clickedButton == 'buy' || clickedButton == 'shop_reload') get_buyableStocks('potion');
                books_shop(1);
            } else if (opened_shop.hasClass('gift')) {
                if (clickedButton == 'buy' || clickedButton == 'shop_reload') get_buyableStocks('gift');
                gifts_shop(1);
            }
        }, 500 );
    });

    function get_buyableStocks(loc_class) {
        // initialize
        var itemsNb = 0,
            itemsXp = 0,
            itemsPrice = 0,
            loc = $('#shop').children('.' + loc_class);
        // get stats
        loc.find('.slot').each(function() {
            if ($(this).hasClass('empty')) return false;
            var item = $(this).data('d');
            itemsNb++;
            itemsXp += parseInt(item.value, 10);
            itemsPrice += parseInt(item.price, 10);
        });
        // save
        lsMarket.buyable[loc_class] = {'Nb':itemsNb, 'Xp':itemsXp, 'Value':itemsPrice};
    }

    function equipments_shop(update) {
        tt_create(update, 'armor', 'EquipmentsTooltip', 'equipments', '');
    }
    function boosters_shop(update) {
        tt_create(update, 'booster', 'BoostersTooltip', 'boosters', '');
    }
    function books_shop(update) {
        tt_create(update, 'potion', 'BooksTooltip', 'books', 'Xp');
    }
    function gifts_shop(update) {
        tt_create(update, 'gift', 'GiftsTooltip', 'gifts', 'affection');
    }

    // create/update tooltip & save to localstorage
    function tt_create(update, loc_class, tt_class, itemName, itemUnit) {
        // initialize
        var itemsNb = 0,
            itemsXp = (itemUnit === '') ? -1 : 0,
            itemsSell = 0,
            loc = $('#inventory').children('.' + loc_class);

        // get stats
        loc.find('.slot').each(function() {
            if ($(this).hasClass('empty')) return false;
            var item = $(this).data('d'),
                Nb = parseInt(item.count, 10);
            itemsNb += Nb;
            itemsSell += Nb * parseInt(item.price_sell, 10);
            if (itemsXp != -1) itemsXp += Nb * parseInt(item.value, 10);
        });

        var tooltip = texts[lang].you_own + ' <b>' + NbCommas(itemsNb) + '</b> ' + texts[lang][itemName] + '.<br />' +
            (itemsXp == -1 ? '' : texts[lang].you_can_give + ' <b>' + NbCommas(itemsXp) + '</b> ' + texts[lang][itemUnit] + '.<br />') +
            texts[lang].you_can_sell + ' <b>' + NbCommas(itemsSell) + '</b> <span class="imgMoney"></span>.';

        // save to localstorage
        lsMarket.stocks[loc_class] = (loc_class == 'potion' || loc_class == 'gift') ? {'Nb':itemsNb, 'Xp':itemsXp} : {'Nb':itemsNb};
        localStorage.setItem('lsMarket', JSON.stringify(lsMarket));

        // create or update tooltip
        if (update === 0) {
            loc.prepend('<span class="CustomTT"></span><div class="' + tt_class + '">' + tooltip + '</div>');
        } else {
            loc.children('.' + tt_class).html(tooltip);
        }
    }
    $('plus').on('click', function (event) {
        var stat = "carac" + $(this).attr("for_carac");
        Hero.infos[stat]++;
        timer = setTimeout( function() {
            updateStats();
        }, 400 );


    });
    marketCss();
}


/* =========
	 Harem
   ========= */

function ModifyHarem() {
    var stats = [];
    var girlsList = [];
    var haremRight = $('#harem_right');
    // initialize
    stats.girls = 0;
    stats.hourlyMoney = 0;
    stats.allCollect = 0;
    stats.unlockedScenes = 0;
    stats.allScenes = 0;
    stats.rarities = { starting:0, common:0, rare:0, epic:0, legendary:0 };
    stats.caracs = { 1:0, 2:0, 3:0 };
    stats.stars = {affection:0, money:0, kobans:0};
    stats.xp = 0;
    stats.affection = 0;
    stats.money = 0;
    stats.kobans = 0;

    var EvoReq = [];

    var starting = [];
    starting.push({ affection:90, money:36000, kobans:36, taffection:90, tmoney:36000, tkobans:36});
    starting.push({ affection:225, money:90000, kobans:60, taffection:315, tmoney:126000, tkobans:96});
    starting.push({ affection:563, money:225000, kobans:114, taffection:878, tmoney:351000, tkobans:210});
    starting.push({ affection:1125, money:450000, kobans:180, taffection:2003, tmoney:801000, tkobans:390});
    starting.push({ affection:2250, money:900000, kobans:300, taffection:4253, tmoney:1701000, tkobans:690});
    EvoReq.starting = starting;

    var commonGirls = [];
    commonGirls.push({ affection:180, money:72000, kobans:72, taffection:180, tmoney:72000, tkobans:72});
    commonGirls.push({ affection:450, money:180000, kobans:120, taffection:630, tmoney:252000, tkobans:192});
    commonGirls.push({ affection:1125, money:450000, kobans:228, taffection:1755, tmoney:702000, tkobans:420});
    commonGirls.push({ affection:2250, money:900000, kobans:360, taffection:4005, tmoney:1602000, tkobans:780});
    commonGirls.push({ affection:4500, money:1800000, kobans:600, taffection:8505, tmoney:3402000, tkobans:1380});
    EvoReq.common = commonGirls;

    var rareGirls = [];
    rareGirls.push({ affection:540, money:216000, kobans:216, taffection:540, tmoney:216000, tkobans:216});
    rareGirls.push({ affection:1350, money:540000, kobans:360, taffection:1890, tmoney:756000, tkobans:576});
    rareGirls.push({ affection:3375, money:1350000, kobans:678, taffection:5265, tmoney:2106000, tkobans:1254});
    rareGirls.push({ affection:6750, money:2700000, kobans:1080, taffection:12015, tmoney:4806000, tkobans:2334});
    rareGirls.push({ affection:13500, money:5400000, kobans:1800, taffection:25515, tmoney:10206000, tkobans:4134});
    EvoReq.rare = rareGirls;

    var epicGirls = [];
    epicGirls.push({ affection:1260, money:504000, kobans:504, taffection:1260, tmoney:504000, tkobans:504});
    epicGirls.push({ affection:3150, money:1260000, kobans:840, taffection:4410, tmoney:1764000, tkobans:1344});
    epicGirls.push({ affection:7875, money:3150000, kobans:1578, taffection:12285, tmoney:4914000, tkobans:2922});
    epicGirls.push({ affection:15750, money:6300000, kobans:2520, taffection:28035, tmoney:11214000, tkobans:5442});
    epicGirls.push({ affection:31500, money:12600000, kobans:4200, taffection:59535, tmoney:23814000, tkobans:9642});
    EvoReq.epic = epicGirls;

    var legendGirls = [];
    legendGirls.push({ affection:1800, money:720000, kobans:720, taffection:1800, tmoney:720000, tkobans:720});
    legendGirls.push({ affection:4500, money:1800000, kobans:1200, taffection:6300, tmoney:2520000, tkobans:1920});
    legendGirls.push({ affection:11250, money:4500000, kobans:2250, taffection:17550, tmoney:7020000, tkobans:4170});
    legendGirls.push({ affection:22500, money:9000000, kobans:3600, taffection:40050, tmoney:16020000, tkobans:7770});
    legendGirls.push({ affection:45000, money:18000000, kobans:6000, taffection:85050, tmoney:34020000, tkobans:13770});
    EvoReq.legendary = legendGirls;


    for (var id in girlsDataList) {
        var girl = jQuery.extend(true, {}, girlsDataList[id]);
        if(girl.own){
            stats.allCollect += girl.salary;
            stats.rarities[girl.rarity]++;
            stats.caracs[girl.class]++;
            stats.girls++;
            stats.hourlyMoney += Math.round(girl.salary_per_hour);
            stats.unlockedScenes += girl.graded;
            stats.allScenes += parseInt(girl.nb_grades);
            var nbgrades =parseInt(girl.nb_grades);
            if(girl.graded != nbgrades){
                stats.affection += EvoReq[girl.rarity][nbgrades-1].taffection - girl.Affection.cur;
                var currentLevelMoney = 0,
                    currentLevelKobans = 0;
                if(girl.graded != 0){
                    currentLevelMoney = EvoReq[girl.rarity][girl.graded-1].tmoney,
                        currentLevelKobans = EvoReq[girl.rarity][girl.graded-1].tkobans;
                }
                stats.money += EvoReq[girl.rarity][nbgrades -1].tmoney - currentLevelMoney;
                if(hh_nutaku){
                    stats.kobans += Math.ceil((EvoReq[girl.rarity][nbgrades -1].tkobans - currentLevelKobans)/6);
                }
                else {
                    stats.kobans += EvoReq[girl.rarity][nbgrades -1].tkobans - currentLevelKobans;
                }
            }

            var expToMax = (GIRLS_EXP_LEVELS[girl.rarity][Hero.infos.level-2] - girl.Xp.cur);
            if(expToMax < 0) expToMax =0;
            stats.xp += expToMax;
        }
    }
    // Market stocks
    try {
        var lsMarket = JSON.parse(localStorage.getItem('lsMarket')),
            d = new Date(lsMarket.restock.time),
            RestockInfo;

        // buyable stocks
        if (new Date() > lsMarket.restock.time || Hero.infos.level > lsMarket.restock.herolvl) {

            RestockInfo = '> The <a href="../shop.html">Market</a> restocked since your last visit.';
        } else {
            var	marketBookTxt = lsMarket.buyable.potion.Nb + ' ' + texts[lang].books + ' (' + NbCommas(lsMarket.buyable.potion.Xp) + ' XP)', //Sluimer: Looks better.
                marketGiftTxt = lsMarket.buyable.gift.Nb + ' ' + texts[lang].gifts + ' (' + NbCommas(lsMarket.buyable.gift.Xp) + ' affection)'; //Sluimer: Looks better.
            RestockInfo = '- ' + marketBookTxt + ' = ' + NbCommas(lsMarket.buyable.potion.Value) + ' <span class="imgMoney"></span>' //Sluimer: Replaced small image with big image
                + '<br />- ' + marketGiftTxt + ' = ' + NbCommas(lsMarket.buyable.gift.Value) + ' <span class="imgMoney"></span>' //Sluimer: Replaced small image with big image
                + '<br /><font style="color:gray;">' + texts[lang].restock + ': ' + d.toLocaleString() + ' (' + texts[lang].or_level + ' ' + (Hero.infos.level+1) + ')</font>';
        }

        // my stocks
        var myArmorTxt = NbCommas(lsMarket.stocks.armor.Nb) + (lsMarket.stocks.armor.Nb > 99 ? '+ ' : ' ') + ' ' + texts[lang].equipments,
            myBoosterTxt = NbCommas(lsMarket.stocks.booster.Nb) + ' ' + texts[lang].boosters,
            myBookTxt = NbCommas(lsMarket.stocks.potion.Nb) + ' ' + texts[lang].books + ' (' + NbCommas(lsMarket.stocks.potion.Xp) + ' XP)', //Sluimer: Fixed 'XP'.
            myGiftTxt = NbCommas(lsMarket.stocks.gift.Nb) + ' ' + texts[lang].gifts + ' (' + NbCommas(lsMarket.stocks.gift.Xp) + ' affection)', //Sluimer: Fixed 'affection'.
            MarketStocks = '- ' + myArmorTxt + ', ' + myBoosterTxt
        + '<br />- ' + myBookTxt
        + '<br />- ' + myGiftTxt
        + '<span class="subTitle">' + texts[lang].currently_buyable + ':</span>'
        + RestockInfo;
    } catch(e) {
        MarketStocks = (lsAvailable == 'yes') ? '> ' + texts[lang].visit_the : '> ' + texts[lang].not_combatible;
    }

	var numberOne = stats.rarities.starting + stats.rarities.common; //Sluimer: To combine Starter and Common girls.

    var StatsString = '<div class="StatsContent"><span class="Title">' + texts[lang].harem_stats + ':</span>' +
        '<span class="subTitle" style="margin-top:-10px;">' + stats.girls + ' ' + texts[lang].haremettes +':</span>' +
        '- ' + stats.caracs[1] + ' ' + texts[lang].hardcore + ', ' + stats.caracs[2] + ' ' + texts[lang].charm + ', ' + stats.caracs[3] + ' ' + texts[lang].know_how + '' + '<br />- '
    + numberOne + ' ' + texts[lang].common + ', ' + stats.rarities.rare + ' ' + texts[lang].rare + ', ' + stats.rarities.epic + ' ' + texts[lang].epic + ', ' + stats.rarities.legendary + ' ' + texts[lang].legendary + ' ' + '<br />- ' //Sluimer: To combine Starter and Common girls.
    + document.getElementsByClassName('focus_text')[0].innerHTML + '/' + NbCommas(Hero.infos.level*stats.girls) + ' harem level (' + NbCommas(Hero.infos.level*stats.girls-document.getElementsByClassName('focus_text')[0].innerHTML.replace(/,/g, '')) + ' to go)<br />- '
    + stats.unlockedScenes + '/' + stats.allScenes + ' ' + texts[lang].unlocked_scenes + ' (' + NbCommas(stats.allScenes-stats.unlockedScenes) + ' to go)'
    + '<span class="subTitle">' + texts[lang].money_incomes + ':</span>'
    + '~' + NbCommas(stats.hourlyMoney) + ' <span class="imgMoney"></span> ' + texts[lang].per_hour //Sluimer: Replaced small image with big image.
    + '<br />' + NbCommas(stats.allCollect) + ' <span class="imgMoney"></span> ' + texts[lang].when_all_collectable //Sluimer: Replaced small image with big image.
    + '<span class="subTitle">' + texts[lang].required_to_unlock + ':</span>'
    + addPriceRow('', stats.affection, stats.money, stats.kobans)
    + '<span class="subTitle">' + texts[lang].required_to_get_max_level + ':</span>' //fdfdf
    + NbCommas(stats.xp) + ' XP (' + NbCommas(stats.xp*200) + ' <span class="imgMoney"></span>)'+ ' <br />' //Sluimer: Fixed 'XP', added a space and removed the trailing comma.
    + '<span class="subTitle">' + texts[lang].my_stocks + ':</span>'
    + MarketStocks
    + '</div>';

    // add custom bar buttons/links & quick list div & stats div
    $('#harem_left').append('<div id="CustomBar">'
                            + '<img f="stats" src="https://i.harem-battle.club/images/2018/08/14/uyC.png">' //Sluimer: Fixed the stupid icon and it's now hosted on the HH wiki. :)
                            + '</div>'
                            + '<div id="TabsContainer">' + StatsString + '</div>');

    // cache
    var TabsContainer = $('#TabsContainer');
    var Stats = TabsContainer.children('.StatsContent');

    // catch clicks
    $('body').click(function(e) {
        var clickOn = e.target.getAttribute('f');
        switch (clickOn) {
                // on quick list button
            case 'stats':
                toggleTabs(Stats);
                break;
                // on a girl in quick list
            default:
                var clickedContainer = $(e.target).closest('[id]').attr('id');
                if (clickedContainer == 'TabsContainer') return;
                TabsContainer.fadeOut(400);
        }
    });

    // tabs switching animations
    function toggleTabs(tabIn) {
        if (TabsContainer.css('display') == 'block') {


            setTimeout( function(){ tabIn.fadeIn(300); }, 205 );

            TabsContainer.fadeOut(400);

        } else {

            tabIn.toggle(true);
            TabsContainer.fadeIn(400);
        }
    }

    haremCss();

    function addPriceRow(rowName, affection, money, kobans){
        return '<b>' + rowName + //Sluimer: Removed the leading ': '.
            NbCommas(affection) + ' ' + texts[lang].affection + ' (' + NbCommas(affection*417) + ' <span class="imgMoney"></span>) and '+ //Sluimer: Added a space and replaced comma with 'and'.
            NbCommas(money) + ' <span class="imgMoney"></span> ' + texts[lang].or + ' '+
            NbCommas(kobans) + ' <span class="imgKobans"></span><br />';
    }

	function addPriceRowGirl(rowName, affection, money, kobans){
        return '<b>' + rowName + ':</b> ' +
            NbCommas(affection) + ' ' + texts[lang].affection + ' (' + NbCommas(affection*417) + ' <span class="imgMoney"></span>) and '+ //Sluimer: Added a space and replaced comma with 'and'.
            NbCommas(money) + ' <span class="imgMoney"></span> ' + texts[lang].or + ' '+
            NbCommas(kobans) + ' <span class="imgKobans"></span><br />';
    } //Duplicated original function for girl's price info.

    $( ".girls_list div[id_girl]" ).click(function() {
        updateInfo();
    });

    updateInfo();


    function updateInfo(){
        setTimeout(function (){
            haremRight.children('[girl]').each( function() {
                var girl = girlsDataList[$(this).attr('girl')];
                // display: wiki link
                //        var title = $(this).find('.hh_title').val();
                if(!girl.own){
                    if(HH_UNIVERSE == "gay"){
                        $(this).find('p').after('<div class="WikiLinkDialogbox"><a href="https://harem-battle.club/wiki/Gay-Harem/GH:' + girl.Name + '" target="_blank"> ' + girl.Name + texts[lang].wiki + ' </a></div>');
                    }else if(lang == "fr"){
                        $(this).find('p').after('<div class="WikiLinkDialogbox"><a href="http://hentaiheroes.wikidot.com/' + girl.Name + '" target="_blank"> ' + texts[lang].wiki + girl.Name + ' </a></div>');
                    }else{
                        $(this).find('p').after('<div class="WikiLinkDialogbox"><a href="https://harem-battle.club/wiki/Harem-Heroes/HH:' + girl.Name + '" target="_blank"> ' + girl.Name + texts[lang].wiki + ' </a></div>');
                    }
                }
                if(girl.own){
                    if(HH_UNIVERSE == "gay"){
                        $(this).find('h3').after('<div class="WikiLink"><a href="https://harem-battle.club/wiki/Gay-Harem/GH:' + girl.Name + '" target="_blank"> ' + girl.Name + texts[lang].wiki + ' </a></div>');
                    }else if(lang == "fr"){
                        $(this).find('h3').after('<div class="WikiLink"><a href="http://hentaiheroes.wikidot.com/' + girl.Name + '" target="_blank"> ' + texts[lang].wiki + girl.Name + ' </a></div>');
                    }else{
                        $(this).find('h3').after('<div class="WikiLink"><a href="https://harem-battle.club/wiki/Harem-Heroes/HH:' + girl.Name + '" target="_blank"> ' + girl.Name + texts[lang].wiki + ' </a></div>');
                    }
                }
                var j = 0,
                    FirstLockedScene = 1,
                    AffectionTT = texts[lang].evolution_costs + ':<br />',
                    ScenesLink = '',
                    girl_quests = $(this).find('.girl_quests');
                girl_quests.find('g').each( function() {

                    j++;
                    var aff=0, money = 0, kobans=0;
                    var currentLevelMoney = 0,
                        currentLevelKobans = 0;
                    if(girl.graded != 0){
                        currentLevelMoney = EvoReq[girl.rarity][girl.graded-1].tmoney,
                            currentLevelKobans = EvoReq[girl.rarity][girl.graded-1].tkobans;
                    }
                    if(girl.graded >= j){
                    } else if( (girl.graded +1) ==j &&  girl.Affection.level == j){
                        money = EvoReq[girl.rarity][j -1].tmoney - currentLevelMoney;
                        if(hh_nutaku){
                            kobans = Math.ceil((EvoReq[girl.rarity][j -1].tkobans - currentLevelKobans)/6);
                        }
                        else {
                            kobans = EvoReq[girl.rarity][j -1].tkobans - currentLevelKobans;
                        }
                    } else{
                        aff = EvoReq[girl.rarity][j-1].taffection - girl.Affection.cur;
                        money = EvoReq[girl.rarity][j -1].tmoney - currentLevelMoney;
                        if(hh_nutaku){
                            kobans = Math.ceil((EvoReq[girl.rarity][j -1].tkobans - currentLevelKobans)/6);
                        }
                        else {
                            kobans = EvoReq[girl.rarity][j -1].tkobans - currentLevelKobans;
                        }
                    }
                    AffectionTT += addPriceRowGirl(j + '</b><span class="imgStar"></span>', aff, money, kobans); //Sluimer: Now using the Girl-specific price row.
                    ScenesLink += (ScenesLink === '') ? 'hh_scenes=' : ',';
                    var SceneHref = $(this).parent().attr('href');
                    if ($(this).hasClass('grey') || $(this).hasClass('green')) {
                        if (FirstLockedScene === 0) {
                            ScenesLink += '0';
                        } else {
                            FirstLockedScene = 0;
                            var XpLeft = girl_quests.parent().parent().children('.girl_exp_left');
                            var isUpgradable = girl_quests.parent().children('.green_text_button');
                            ScenesLink += (isUpgradable.length) ? '0.' + isUpgradable.attr('href').substr(7) : '0';
                        }
                    } else {
                        var attrHref = $(this).parent().attr('href');
                        if (typeof attrHref != 'undefined') {
                            ScenesLink += attrHref.substr(7);
                        }
                    }
                });
                // change scene links
                girl_quests.children('a').each(function() {
                    var attr = $(this).attr('href');
                    if (typeof attr !== typeof undefined && attr !== false) {
                        $(this).attr('href', attr + '?' + ScenesLink);
                    }
                });
                ScenesLink = '';

                //           AffectionTT += addPriceRow(texts[lang].total, Taffection, Tmoney, Tkobans);

                // display: Affection costs tooltip
                girl_quests.parent().children('h4').prepend('<span class="CustomTT"></span><div class="AffectionTooltip">' + AffectionTT + '</div>');

            });
        }, 50);
    }

}

/* ==========
	 Scenes
   ========== */

function ModifyScenes() {
    // parse GET hh_scenes variable
    var currentScene = CurrentPage.substr(7),
        hh_scenesParams = new URL(window.location.href).searchParams.get('hh_scenes'),
        hh_scenes = hh_scenesParams.split(','),
        len = hh_scenes.length;

    // no scenes, less than 3 or more than 5 (human manipulation)
    if (!len || len < 3 || len > 5) {
        return false;
    } else {
        var ScenesNavigate = '<div class="Scenes" style="display:block;">' + texts[lang].navigate + ':<br/>',
            SceneLink = '';

        for (var i = 0; i < len; i++ ) {
            // string format certification
            if (/^(0\.)?[0-9]{1,5}$/.test(hh_scenes[i]) === true) {
                if (hh_scenes[i] == currentScene) {
                    SceneLink = '<span class="current">' + texts[lang].current + '</span>';
                } else if (hh_scenes[i] == '0') {
                    SceneLink = '<span class="locked">' + texts[lang].locked + '</span>';
                } else if (parseInt(hh_scenes[i], 10) < 1) {
                    SceneLink = '<a href="/quest/' + hh_scenes[i].substr(2) + '">' + texts[lang].unlock_it + '!</a>';
                } else {
                    SceneLink = '<a href="/quest/' + hh_scenes[i] + '?hh_scenes=' + hh_scenesParams + '">' + texts[lang].scene + '</a>';
                }
                ScenesNavigate += (i+1) + '<span class="imgStar"></span> ' + SceneLink + '<br />';
            }
            // string error: doesn't match (human manipulation)
            else return false;
        }
        ScenesNavigate += '<span class="backToHarem">< <a href="' + $('#breadcrumbs').children('a').eq(2).attr('href') + '">' + texts[lang].harem + '</a></span></div>';

        // insert navigate interface
        $('#controls').append(ScenesNavigate);
    }

    scenesCss();
}

// is localstorage available?
function lsTest() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch(e) {
        return false;
    }
}

// adds thousands commas
function NbCommas(x) {
    return x.toLocaleString();
    /*    if(lang == "fr" || lang == "es" || lang == "et"){
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
*/}

function fightTrollCss(){
    sheet.insertRule('#FightTroll {'
                     + 'position: absolute;'
                     + 'z-index: 99;'
                     + 'width: 60%;' //Sluimer
                     + 'left: 50px;' //Sluimer
                     + 'margin: 5px 0 0 13px;' //Sluimer
                     + 'border-radius: 8px 10px 10px 8px;' //Sluimer
                     + 'background: rgba(0,0,0,0.78);'
                     + 'box-shadow: 0 0 0 1px rgba(255,255,255,0.73);'
                     + 'font-size: 13px;' //Sluimer
                     + 'text-align: center; }');

    sheet.insertRule('#FightTroll > .Arrow {'
                     + 'float:right;'
                     + 'background-image: url("https://i.harem-battle.club/images/2017/09/19/Fmo.png");'
                     + 'background-size: 18px 18px;'
                     + 'background-repeat: no-repeat;'
                     + 'width: 18px;'
                     + 'height: 18px; }');

    sheet.insertRule('#FightTroll > .TrollsMenu {'
                     + 'position: absolute;'
                     + 'width: 88%;'
                     + 'margin-left:6px;'
                     + 'border-radius: 0px 0 8px 8px;'
                     + 'background: rgba(0,0,0,0.78);'
                     + 'line-height: 15px;'
                     + 'opacity: 0;'
                     + 'visibility: hidden;'
                     + 'transition: opacity 400ms, visibility 400ms; }');

    sheet.insertRule('#FightTroll:hover > .TrollsMenu {'
                     + 'opacity: 1;'
                     + 'visibility: visible; }');

    sheet.insertRule('#FightTroll a {'
                     + 'color: rgb(255, 255, 255);'
                     + 'text-decoration: none; }');

    sheet.insertRule('#FightTroll a:hover {'
                     + 'color: rgb(255, 247, 204);'
                     + 'text-decoration: underline; }');
}

function marketCss(){
    // -----------------
    //     CSS RULES
    // -----------------

    sheet.insertRule('#inventory .CustomTT {'
                     + 'float: right;'
                     + 'margin: 11px 1px 0 0;'
                     + 'background-image: url("https://i.harem-battle.club/images/2017/09/13/FPE.png");'
                     + 'background-size: 20px 20px;'
                     + 'width: 20px;'
                     + 'height: 20px; }');

    sheet.insertRule('#inventory .CustomTT:hover {'
                     + 'cursor: help; }');

    sheet.insertRule('#inventory .CustomTT:hover + div {'
                     + 'opacity: 1;'
                     + 'visibility: visible; }');

    sheet.insertRule('#inventory .EquipmentsTooltip, #inventory .BoostersTooltip, #inventory .BooksTooltip, #inventory .GiftsTooltip {'
                     + 'position: absolute;'
                     + 'z-index: 99;'
                     + 'width: 240px;'
                     + 'border: 1px solid rgb(162, 195, 215);'
                     + 'border-radius: 8px;'
                     + 'box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.1);'
                     + 'padding: 3px 7px 4px 7px;'
                     + 'background-color: #F2F2F2;'
                     + 'font: normal 10px/17px Tahoma, Helvetica, Arial, sans-serif;'
                     + 'color: #057;'
                     + 'opacity: 0;'
                     + 'visibility: hidden;'
                     + 'transition: opacity 400ms, visibility 400ms; }');

    sheet.insertRule('#inventory .EquipmentsTooltip, #inventory .BoostersTooltip {'
                     + 'margin: -33px 0 0 210px;'
                     + 'height: 43px; }');

    sheet.insertRule('#inventory .BooksTooltip, #inventory .GiftsTooltip {'
                     + 'margin: -50px 0 0 210px;'
                     + 'height: 60px; }');

    sheet.insertRule('#inventory .EquipmentsTooltip b, #inventory .BoostersTooltip b, #inventory .BooksTooltip b, #inventory .GiftsTooltip b {'
                     + 'font-weight:bold; }');

    sheet.insertRule('#inventory .imgMoney {'
                     + 'background-size: 12px 12px;'
                     + 'background-repeat: no-repeat;'
                     + 'width: 12px;'
                     + 'height: 14px;'
                     + 'vertical-align: text-bottom;'
                     + 'background-image: url("https://i.harem-battle.club/images/2017/01/07/0Gsvn.png");'
                     + 'display: inline-block; }');
    sheet.insertRule('.hero_stats .CustomStats:hover {'
                     + 'cursor: help; }');
    sheet.insertRule('.hero_stats .CustomStats {'
                     + 'float: right;'
                     + 'margin-left: -25px;'
                     + 'background-image: url("https://i.harem-battle.club/images/2017/09/13/FPE.png");'
                     + 'background-size: 18px 18px;'
                     + 'background-position: center;'
                     + 'background-repeat: no-repeat;'
                     + 'width: 18px;'
                     + 'height: 100%;'
                     + 'visibility: none; }');
    sheet.insertRule('.hero_stats .CustomStats:hover + div {' +
                     'opacity: 1;' +
                     'visibility: visible; }');

    sheet.insertRule('.hero_stats .StatsTooltip {'
                     + 'position: absolute;'
                     + 'z-index: 99;'
                     + 'margin: -130px 0 0 -28px;'
                     + 'width: 280px;'
                     + 'height: 127px;'
                     + 'border: 1px solid rgb(162, 195, 215);'
                     + 'border-radius: 8px;'
                     + 'box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.1);'
                     + 'padding: 3px 7px 4px 7px;'
                     + 'background-color: #F2F2F2;'
                     + 'font: normal 10px/17px Tahoma, Helvetica, Arial, sans-serif;;'
                     + 'text-align: left;'
                     + 'opacity: 0;'
                     + 'visibility: hidden;'
                     + 'transition: opacity 400ms, visibility 400ms; }');

    sheet.insertRule('.hero_stats .StatsTooltip b {'
                     + 'font-weight: bold; }');
}

function haremCss(){
    // -----------------
    //     CSS RULES
    // -----------------

    sheet.insertRule('#harem_left .HaremetteNb {'
                     + 'float: right;'
                     + 'line-height: 14px;'
                     + 'font-size: 12px; }');

    sheet.insertRule('#CustomBar {'
                     //                    + 'position: absolute;'
                     + 'z-index: 99;'
                     + 'width: 100%;'
                     + 'padding: 3px 10px 0 3px;'
                     + 'font: bold 10px Tahoma, Helvetica, Arial, sans-serif;'
                     + 'position: absolute; bottom: 3px; left: 0px; }');

    sheet.insertRule('#CustomBar img {'
                     + 'width: 20px;'
                     + 'height: 20px;'
                     + 'margin-right: 3px;'
                     + 'margin-bottom: 3px;' //Sluimer: Slightly better aligned the icon.
                     + 'opacity: 0.5; }');

    sheet.insertRule('#CustomBar img:hover {'
                     + 'opacity: 1;'
                     + 'cursor: pointer; }');

    sheet.insertRule('#CustomBar .TopBottomLinks {'
                     + 'float: right;'
                     + 'margin-top: 2px; }');

    sheet.insertRule('#CustomBar a, #TabsContainer a {'
                     + 'color: #008;'
                     + 'text-decoration: none; }');

    sheet.insertRule('#harem_right .WikiLink a {'
                     + 'color: #87CEFA;'
                     + 'text-decoration: none; }');

    sheet.insertRule('#CustomBar a:hover, #TabsContainer a:hover, #harem_right .WikiLink a:hover {'
                     + 'color: #B14;'
                     + 'text-decoration: underline; }');

    sheet.insertRule('#TabsContainer {'
                     //                     + 'position: absolute;'
                     + 'z-index: 99;'
                     + 'margin: -290px 0 0 -1px;'
                     + 'width: 240px;'
                     + 'height: 270px;'
                     + 'overflow-y: scroll;'
                     + 'box-sizing: content-box;'
                     + 'border: 1px solid rgb(156, 182, 213);'
                     + 'box-shadow: 1px -1px 1px 0px rgba(0,0,0,0.3);'
                     + 'font: normal 10px/16px Tahoma, Helvetica, Arial, sans-serif;'
                     + 'color: #000000;'
                     + 'background-color: #ffffff;'
                     + 'display: none; }');

    sheet.insertRule('#TabsContainer > div {'
                     + 'padding: 1px 0 8px 10px; }');

    sheet.insertRule('#TabsContainer .Title {'
                     + 'margin-left: -5px;'
                     + 'font: bold 12px/22px Tahoma, Helvetica, Arial, sans-serif;'
                     + 'color: #B14; }');

    sheet.insertRule('#TabsContainer .subTitle {'
                     + 'padding-top: 10px;;'
                     + 'font-weight: bold;'
                     + 'display: block; }');

    sheet.insertRule('#TabsContainer img {'
                     + 'width: 14px;'
                     + 'height: 14px;'
                     + 'vertical-align: text-bottom; }');

    sheet.insertRule('.StatsContent, #TabsContainer span, #TabsContainer img, #TabsContainer a, #TabsContainer b, #TabsContainer br {'
                     + 'box-sizing: content-box; }');

    sheet.insertRule('#harem_right .CustomTT {'
                     + 'float: right;'
                     + 'margin-left: -25px;'
                     + 'background-image: url("https://i.harem-battle.club/images/2017/09/13/FPE.png");'
                     + 'background-size: 18px 18px;'
                     + 'width: 18px;'
                     + 'height: 18px;'
                     + 'visibility: none; }');

    sheet.insertRule('#harem_right .CustomTT:hover {'
                     + 'cursor: help; }');

    sheet.insertRule('#harem_right .CustomTT:hover + div {'
                     + 'opacity: 1;'
                     + 'visibility: visible; }');

    sheet.insertRule('#harem_right .AffectionTooltip {'
                     + 'position: absolute;'
                     + 'z-index: 99;'
                     + 'margin: 0px 0 0 0;'
                     + 'width: 300px;' //Sluimer
                     + 'height: 110px;' //Sluimer
                     + 'border: 1px solid rgb(162, 195, 215);'
                     + 'border-radius: 8px;'
                     + 'box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.1);'
                     + 'padding: 3px 7px 4px 7px;'
                     + 'background-color: #F2F2F2;'
                     + 'color: #1E90FF;'
                     + 'font: normal 9px/17px Tahoma, Helvetica, Arial, sans-serif;;' //Sluimer
                     + 'text-align: left;'
                     + 'opacity: 0;'
                     + 'visibility: hidden;'
					 + 'text-shadow: none;' //Sluimer
                     + 'transition: opacity 400ms, visibility 400ms; }');

    sheet.insertRule('#collect_all_container {'
                     + 'margin-top: 0px !important; }');

    sheet.insertRule('#harem_right .AffectionTooltip b {'
                     + 'font-weight: bold; }');

    sheet.insertRule('#harem_right .WikiLink {'
                     //                    + 'float: right;'
                     //                    + 'margin: -13px 7px 0 0;'
                     + 'font-size: 12px; }');

    sheet.insertRule('#harem_right .WikiLinkDialogbox a {'
                     + 'text-decoration: none;'
                     + 'color: #24a0ff !important; }');

    sheet.insertRule('#harem_right .imgStar, #harem_right .imgMoney, #harem_right .imgKobans, #harem_left .imgStar, #harem_left .imgMoney, #harem_left .imgKobans  {'
                     + 'background-size: 10px 10px;'
                     + 'background-repeat: no-repeat;'
                     + 'width: 10px;'
                     + 'height: 14px;'
                     + 'display: inline-block; }');

    sheet.insertRule('#harem_right .imgStar, #harem_left .imgStar {'
                     + 'background-image: url("https://i.harem-battle.club/images/2016/12/29/R9HWCKEtD.png"); }');

    sheet.insertRule('#harem_right .imgMoney, #harem_left .imgMoney {'
                     + 'background-image: url("https://i.harem-battle.club/images/2017/01/07/0Gsvn.png"); }');

    sheet.insertRule('#harem_right .imgKobans, #harem_left .imgKobans {'
                     + 'background-image: url("https://i.harem-battle.club/images/2016/08/30/gNUo3XdY.png"); }');
}

function scenesCss(){
    // -----------------
    //     CSS RULES
    // -----------------

    sheet.insertRule('#controls .Scenes {'
                     + 'height:200px;'
                     + 'box-shadow: 3px 3px 0px 0px rgba(0,0,0,0.3);'
                     + 'background-color:#000000;'
                     + 'background: linear-gradient(to bottom, rgba(196,3,35,1) 0%,rgba(132,2,30,1) 51%,rgba(79,0,14,1) 100%);'
                     + 'text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4);'
                     + 'display: block !important; }');

    sheet.insertRule('#controls .current {'
                     + 'color: rgb(251, 255, 108); }');

    sheet.insertRule('#controls .locked {'
                     + 'color: rgb(150, 99, 99); }');

    sheet.insertRule('#controls .Scenes a {'
                     + 'color: rgb(233, 142, 228);'
                     + 'text-decoration: none; }');

    sheet.insertRule('#controls .Scenes a:hover {' +
                     'color: rgb(254, 202, 255);' +
                     'text-decoration: underline; }');

    sheet.insertRule('#controls .backToHarem {'
                     + 'position: absolute;'
                     + 'bottom: 0;'
                     + 'left: 0;'
                     + 'width: 100%; }');

    sheet.insertRule('#controls .imgStar {'
                     + 'background-image: url("https://i.harem-battle.club/images/2016/12/29/R9HWCKEtD.png");'
                     + 'background-size: 10px 10px;'
                     + 'background-repeat: no-repeat;'
                     + 'width: 10px;'
                     + 'height: 18px;'
                     + 'display: inline-block; }');
}