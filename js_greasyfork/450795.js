// ==UserScript==
// @name         Bus Fav
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Bus Fav For Me
// @author       Opeee
// @include      *://*javbus.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javbus.com
// @license      MIT

// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.4/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9

// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_info

//0914
//初川みなみ,岬ななみ,明里つむぎ,夢乃あいか,七沢みあ,神菜美まい,桃乃木かな,梓ヒカリ,橋本ありな,橋本れいか,白川ゆず,本庄鈴,高坂ニナ,楓カレン,橘萌々香,九重かんな,吉高寧々,加美杏奈,水川スミレ,葵,小野夕子,葵つかさ,七海ティナ,青空ひかり,七瀬アリス,七瀬いおり,三上悠亜,水卜さくら,松下紗栄子,桃谷エリカ,藤森里穂,望月あられ,夏木りん,小野六花,相沢みなみ,篠田ゆう,奥田咲,安西ひかり,愛乃なみ,愛音まりあ,並木優,保坂えり,北条麻妃,本田岬,波多野結衣,川村まや,まやちゃん,蒼井そら,大場ゆい,竹内美羽,大橋未久,東凛,JULIA,佳苗るか,酒井ももか,吉沢明歩,滝澤ローラ,水咲ローラ,立花瑠莉,立花美涼,立花里子,蓮実クレ,里美ゆりあ,林ゆな,藍沢潤,麻倉憂,麻生希,麻里梨夏,成海うるみ,渚うるみ,前田かおり,秋吉みなみ,Rio,柚木ティナ,さくらみゆき,上原亜衣,山岸逢花,松島かえで,松嶋友里恵,森沢かな,水戸かな,上原瑞穂,天使もえ,桐嶋りの,森明音,小島みなみ,希咲あや,希島あいり,希崎ジェシカ,希志あいの,西川ゆい,西野あこ,雨宮琴音,香澄はるか,篠田あゆみ,ゆうき美羽,伊東ちなみ,柚月ひまわり,さとう遥希,中田結衣,佐々木あき,今井沙月,佐々波綾,真白愛梨,つばさ舞,森下園花
//107SDHS-028,200GANA-894,201NAPK-003,230OREC-902,253KAKU-211,253KAKU-212,259LUXU-1493,259LUXU-748,259LUXU-801,300MAAN-452,300MAAN-468,300MAAN-708,300NTK-648,374IMGN-030,483SGK-069,529STCV-050,534IND-024,ABP-001,ABP-032,ABP-041,ABP-085,ABP-119,ABP-123,ABP-129,ABP-138,ABP-145,ABP-147,ABP-152,ABP-157,ABP-159,ABP-168,ABP-171,ABP-178,ABP-180,ABP-192,ABP-205,ABP-219,ABP-231,ABP-373,ABP-408,ABP-454,ABP-666,ABP-671,ABP-687,ABP-725,ABP-836,ABP-853,ABP-893,ABS-130,ABS-131,ABS-170,ABS-188,ABS-194,ABS-208,ABS-212,ABS-219,ADN-023,ADN-031,ADN-100,ADN-106,ADN-110,ADN-115,ADN-118,ADN-129,ADN-138,ADN-140,ADN-144,ADN-147,ADN-148,ADN-151,ADN-157,ADN-158,ADN-162,ADN-165,ADN-166,ADN-179,ADN-187,ADN-188,ADN-198,ADN-202,ADN-203,ADN-210,ADN-211,ADN-216,ADN-219,ADN-222,ADN-223,ADN-230,ADN-243,ADN-248,ADN-251,ADN-256,ADN-262,ADN-267,ADN-277,ADN-296,ADN-298,ADN-302,ADN-314,ADN-328,ADN-341,ADN-343,ADN-347,ADN-353,ADN-361,ADN-366,ADN-375,ADN-381,ADN-400,AIKB-010,ALDN-029,AP-019,AP-029,APAK-200,APAK-214,APNS-259,APNS-278,AQSH-006,ATFB-311,ATFB-318,ATID-126,ATID-274,ATID-284,ATID-298,ATID-315,ATID-318,ATID-323,ATID-327,ATID-355,ATID-368,ATID-379,ATID-394,ATID-397,ATID-399,ATID-401,ATID-412,ATID-421,ATID-431,ATID-440,ATID-447,ATID-456,ATID-489,ATID-495,ATID-521,ATID-522,ATVR-005,ATVR-007,ATVR-024,ATVR-026,AUKG-169,AVOP-001,AVOP-303,AVSA-161,BAEM-004,BAGBD-055,BAGBD-068,BANK-058,BEB-016,BF-220,BF-310,BF-342,BF-366,BF-382,BF-479,BF-522,BF-524,BF-528,BF-534,BF-537,BF-540,BF-542,BF-549,BF-557,BF-567,BF-593,BIST-007,BONU-020,BTHA-033,BUG-003,BUG-018,CAND-165,CAWD-027,CAWD-238,CAWD-241,CEMD-105,CEMD-116,CESD-360,CESD-554,CESD-857,CHN-031,CJOD-052,CJOD-055,CJOD-080,CJOD-124,CJOD-146,CJOD-149,CJOD-175,CJOD-183,CJOD-205,CJOD-214,CJOD-300,CJOD-332,CLUB-468,CLUB-625,CMD-008,CMI-128,CRS-018,CRS-026,CSCT-004,CSCT-005,CWM-219,CWPBD-131,CWPBD-138,DART-001,DASD-353,DASD-439,DASD-610,DASD-732,DASD-758,DASD-774,DASD-791,DASD-835,DASD-888,DASD-895,DASD-905,DASD-921,DASD-923,DASD-924,DASD-938,DASD-963,DAVJ-355,DDK-111,DDOB-100,DDT-599,DIGI-164,DJSK-016,DLDSS-007,DLDSS-012,DLDSS-039,DLDSS-044,DMOW-178,DMOW-192,DPMI-020,DV-516,DVAJ-193,DVAJ-219,DVAJ-262,DVAJ-396,DVAJ-466,DVDES-786,EBOD-187,EBOD-370,ECB-125,EDRG-006,EDRG-016,EKAI-010,EKDV-250,EKDV-277,EKDV-295,EKDV-509,EKDV-522,EMP-001,EMP-003,ETQR-034,ETQR-035,EYAN-041,FC2-10438,FC2-11123,FSDSS-042,FSDSS-055,FSDSS-069,FSDSS-070,FSDSS-077,FSDSS-078,FSDSS-083,FSDSS-084,FSDSS-098,FSDSS-099,FSDSS-102,FSDSS-108,FSDSS-111,FSDSS-114,FSDSS-116,FSDSS-121,FSDSS-127,FSDSS-164,FSDSS-194,FSDSS-209,FSDSS-223,FSDSS-226,FSDSS-232,FSDSS-242,FSDSS-249,FSDSS-258,FSDSS-259,FSDSS-260,FSDSS-268,FSDSS-272,FSDSS-273,FSDSS-274,FSDSS-275,FSDSS-288,FSDSS-289,FSDSS-290,FSDSS-304,FSDSS-305,FSDSS-320,FSDSS-321,FSDSS-335,FSDSS-351,FSDSS-365,FSDSS-376,FSDSS-377,FSDSS-393,FSDSS-408,FSDSS-421,FSET-356,FSET-357,FSET-536,FSET-752,GAOR-090,GHKR-34,GHKR-44,GNAX-063,GTJ-059,GTJ-069,GTRP-001,GVG-078,GVG-247,GVG-426,GVG-437,GVG-495,GVG-570,GVG-615,GVG-694,GVH-351,HBAD-162,HBAD-202,HBAD-265,HBAD-328,HBAD-402,HJMO-481,HMN-160,HMNF-076,HMPD-10007,HMPD-10045,HND-112,HND-115,HND-394,HND-400,HND-414,HND-423,HND-428,HND-429,HND-448,HND-470,HND-482,HND-509,HND-522,HND-589,HND-602,HND-673,HND-686,HND-934,HND-961,HND-978,HND-990,HNDB-062,HNDB-064,HNDS-021,HNDS-054,HNDS-072,HODV-20557,HODV-20819,HODV-20828,HODV-21025,HODV-21049,HODV-21056,HODV-21631,HODV-21638,HTHD-184,HXAD-007,IDBD-765,IENE-531,IENE-555,IENE-571,IENF-184,INCT-010,IPIT-005,IPIT-007,IPIT-010,IPIT-013,IPTD-611,IPTD-666,IPTD-707,IPTD-775,IPTD-787,IPTD-789,IPTD-799,IPTD-800,IPTD-811,IPTD-812,IPTD-813,IPTD-853,IPTD-974,IPTD-981,IPTD-999,IPX-004,IPX-005,IPX-021,IPX-022,IPX-035,IPX-037,IPX-038,IPX-039,IPX-051,IPX-052,IPX-053,IPX-056,IPX-065,IPX-069,IPX-071,IPX-072,IPX-077,IPX-084,IPX-086,IPX-087,IPX-098,IPX-099,IPX-101,IPX-104,IPX-113,IPX-114,IPX-115,IPX-122,IPX-128,IPX-129,IPX-133,IPX-137,IPX-142,IPX-143,IPX-158,IPX-164,IPX-175,IPX-176,IPX-182,IPX-191,IPX-192,IPX-202,IPX-204,IPX-205,IPX-216,IPX-217,IPX-228,IPX-229,IPX-243,IPX-247,IPX-252,IPX-258,IPX-259,IPX-268,IPX-273,IPX-274,IPX-280,IPX-285,IPX-287,IPX-293,IPX-298,IPX-308,IPX-309,IPX-316,IPX-322,IPX-327,IPX-328,IPX-337,IPX-340,IPX-343,IPX-344,IPX-354,IPX-356,IPX-358,IPX-359,IPX-360,IPX-368,IPX-370,IPX-372,IPX-373,IPX-374,IPX-381,IPX-385,IPX-388,IPX-389,IPX-400,IPX-403,IPX-404,IPX-416,IPX-418,IPX-419,IPX-429,IPX-430,IPX-432,IPX-439,IPX-442,IPX-443,IPX-448,IPX-453,IPX-456,IPX-457,IPX-461,IPX-463,IPX-470,IPX-471,IPX-473,IPX-477,IPX-480,IPX-486,IPX-488,IPX-489,IPX-492,IPX-493,IPX-499,IPX-504,IPX-506,IPX-507,IPX-512,IPX-513,IPX-518,IPX-523,IPX-525,IPX-527,IPX-530,IPX-536,IPX-539,IPX-540,IPX-543,IPX-548,IPX-549,IPX-551,IPX-554,IPX-555,IPX-562,IPX-565,IPX-568,IPX-569,IPX-578,IPX-582,IPX-585,IPX-586,IPX-587,IPX-588,IPX-594,IPX-595,IPX-598,IPX-601,IPX-602,IPX-610,IPX-614,IPX-617,IPX-618,IPX-619,IPX-620,IPX-625,IPX-629,IPX-632,IPX-633,IPX-639,IPX-643,IPX-646,IPX-647,IPX-649,IPX-656,IPX-660,IPX-662,IPX-664,IPX-666,IPX-671,IPX-675,IPX-678,IPX-680,IPX-687,IPX-691,IPX-694,IPX-695,IPX-697,IPX-698,IPX-704,IPX-708,IPX-711,IPX-712,IPX-714,IPX-716,IPX-722,IPX-726,IPX-729,IPX-730,IPX-732,IPX-733,IPX-734,IPX-740,IPX-744,IPX-747,IPX-748,IPX-750,IPX-751,IPX-756,IPX-757,IPX-760,IPX-763,IPX-764,IPX-770,IPX-774,IPX-778,IPX-781,IPX-782,IPX-789,IPX-792,IPX-795,IPX-798,IPX-799,IPX-805,IPX-809,IPX-810,IPX-811,IPX-813,IPX-816,IPX-817,IPX-819,IPX-825,IPX-829,IPX-833,IPX-836,IPX-837,IPX-844,IPX-848,IPX-850,IPX-852,IPX-855,IPX-857,IPX-865,IPX-873,IPX-879,IPX-882,IPX-885,IPX-889,IPX-904,IPX-911,IPX-914,IPX-915,IPX-917,IPX-919,IPX-920,IPX-922,IPZ-009,IPZ-023,IPZ-061,IPZ-082,IPZ-127,IPZ-131,IPZ-139,IPZ-146,IPZ-158,IPZ-213,IPZ-215,IPZ-223,IPZ-289,IPZ-314,IPZ-323,IPZ-343,IPZ-380,IPZ-389,IPZ-441,IPZ-457,IPZ-462,IPZ-464,IPZ-480,IPZ-485,IPZ-489,IPZ-515,IPZ-529,IPZ-542,IPZ-545,IPZ-574,IPZ-588,IPZ-602,IPZ-628,IPZ-634,IPZ-637,IPZ-653,IPZ-667,IPZ-672,IPZ-689,IPZ-703,IPZ-718,IPZ-735,IPZ-754,IPZ-773,IPZ-789,IPZ-802,IPZ-809,IPZ-824,IPZ-837,IPZ-855,IPZ-884,IPZ-891,IPZ-904,IPZ-910,IPZ-914,IPZ-921,IPZ-933,IPZ-937,IPZ-949,IPZ-950,IPZ-954,IPZ-967,IPZ-971,IPZ-985,IPZ-986,ISRD-009,JBD-240,JUC-860,JUC-943,JUFD-440,JUFD-467,JUFD-489,JUFD-527,JUFD-588,JUFD-612,JUFD-662,JUFD-840,JUFD-854,JUFD-994,JUFE-112,JUFE-286,JUFE-320,JUFE-329,JUL-001,JUL-019,JUL-025,JUL-050,JUL-106,JUL-107,JUL-138,JUL-154,JUL-179,JUL-227,JUL-245,JUL-276,JUL-289,JUL-291,JUL-306,JUL-331,JUL-363,JUL-366,JUL-393,JUL-398,JUL-428,JUL-433,JUL-454,JUL-463,JUL-466,JUL-489,JUL-490,JUL-499,JUL-524,JUL-561,JUL-562,JUL-601,JUL-607,JUL-618,JUL-625,JUL-634,JUL-647,JUL-661,JUL-663,JUL-669,JUL-706,JUL-709,JUL-729,JUL-731,JUL-769,JUL-795,JUL-821,JUL-879,JUL-918,JUL-948,JUL-960,JUL-980,JUQ-013,JUQ-019,JUQ-033,JUQ-047,JUQ-051,JUX-261,JUX-386,JUX-467,JUX-496,JUX-518,JUX-556,JUX-580,JUX-603,JUX-612,JUX-650,JUX-671,JUX-790,JUX-827,JUX-853,JUX-883,JUX-950,JUX-961,JUX-997,JUY-015,JUY-125,JUY-260,JUY-285,JUY-288,JUY-296,JUY-316,JUY-323,JUY-348,JUY-355,JUY-378,JUY-383,JUY-384,JUY-410,JUY-438,JUY-466,JUY-487,JUY-507,JUY-527,JUY-535,JUY-554,JUY-648,JUY-676,JUY-726,JUY-765,JUY-794,JUY-881,JUY-914,JUY-937,JWAZ-005,KIR-058,KIRE-004,KIRE-007,KIRE-011,KMHR-012,KMHR-015,KMHR-018,KMHR-069,KRAY-016,LADYA-009,LAF-44,LAFBD-88,LD-012,LNP-002,LULU-065,LULU-101,LXVS-036,LZDZ-005,MAS-095,MCB-20,MDB-877,MDS-707,MDTM-306,MDTM-363,MDVHJ-043,MDYD-831,MDYD-983,MESS-025,MEYD-040,MEYD-248,MEYD-280,MEYD-283,MEYD-284,MEYD-286,MEYD-288,MEYD-302,MEYD-308,MEYD-313,MEYD-333,MEYD-336,MEYD-439,MEYD-463,MEYD-487,MEYD-491,MEYD-514,MEYD-651,MEYD-664,MEYD-677,MEYD-678,MEYD-687,MEYD-706,MEYD-709,MEYD-712,MIAA-052,MIAA-092,MIAA-136,MIAA-202,MIAA-369,MIAA-475,MIAA-548,MIAD-665,MIAD-711,MIAD-741,MIAD-752,MIAD-986,MIAD-987,MIAE-022,MIAE-036,MIAE-048,MIAE-062,MIAE-075,MIAE-092,MIAE-094,MIAE-106,MIAE-117,MIAE-121,MIAE-122,MIAE-135,MIAE-136,MIAE-141,MIAE-147,MIAE-227,MIAE-271,MIDD-791,MIDD-888,MIDD-918,MIDD-961,MIDE-007,MIDE-020,MIDE-074,MIDE-128,MIDE-145,MIDE-180,MIDE-218,MIDE-225,MIDE-248,MIDE-282,MIDE-291,MIDE-302,MIDE-326,MIDE-350,MIDE-353,MIDE-382,MIDE-391,MIDE-392,MIDE-401,MIDE-412,MIDE-418,MIDE-422,MIDE-434,MIDE-442,MIDE-443,MIDE-458,MIDE-461,MIDE-464,MIDE-475,MIDE-477,MIDE-484,MIDE-486,MIDE-488,MIDE-493,MIDE-495,MIDE-498,MIDE-503,MIDE-508,MIDE-513,MIDE-519,MIDE-520,MIDE-525,MIDE-530,MIDE-535,MIDE-537,MIDE-539,MIDE-543,MIDE-544,MIDE-548,MIDE-553,MIDE-557,MIDE-564,MIDE-570,MIDE-571,MIDE-578,MIDE-586,MIDE-587,MIDE-595,MIDE-596,MIDE-599,MIDE-600,MIDE-605,MIDE-609,MIDE-614,MIDE-618,MIDE-623,MIDE-633,MIDE-634,MIDE-637,MIDE-642,MIDE-646,MIDE-650,MIDE-657,MIDE-658,MIDE-664,MIDE-667,MIDE-673,MIDE-674,MIDE-681,MIDE-690,MIDE-691,MIDE-697,MIDE-702,MIDE-705,MIDE-707,MIDE-711,MIDE-715,MIDE-720,MIDE-725,MIDE-735,MIDE-743,MIDE-748,MIDE-760,MIDE-766,MIDE-770,MIDE-773,MIDE-784,MIDE-786,MIDE-794,MIDE-797,MIDE-799,MIDE-800,MIDE-807,MIDE-817,MIDE-819,MIDE-821,MIDE-823,MIDE-831,MIDE-833,MIDE-834,MIDE-841,MIDE-845,MIDE-855,MIDE-859,MIDE-865,MIDE-869,MIDE-870,MIDE-878,MIDE-884,MIDE-891,MIDE-896,MIDE-897,MIDE-909,MIDE-918,MIDE-923,MIDE-924,MIDE-938,MIDE-939,MIDE-948,MIDE-949,MIDE-950,MIDE-959,MIDE-960,MIDE-970,MIDE-983,MIDV-002,MIDV-018,MIDV-032,MIDV-036,MIDV-049,MIDV-053,MIDV-068,MIDV-069,MIDV-072,MIDV-086,MIDV-087,MIDV-091,MIDV-104,MIDV-109,MIDV-130,MIDV-131,MIDV-152,MIDV-153,MIDV-174,MIGD-761,MILK-133,MIMK-045,MIMK-051,MIMK-053,MIMK-061,MIMK-079,MIMK-082,MIMK-085,MIMK-093,MIRD-177,MKBD-S95,MKMP-168,MKMP-315,MKMP-321,MKMP-326,MKMP-330,MKMP-335,MKMP-340,MKMP-344,MKMP-347,MKMP-351,MKMP-357,MKMP-362,MKMP-463,MKMP-470,MKON-070,MLW-2044,MMKZ-038,MMNA-008,MMTK-001,MOND-227,MRSS-062,MRSS-124,MRXD-068,MUDR-034,MUDR-092,MUDR-153,MUDR-186,MVSD-185,MVSD-316,MVSD-326,MVSD-330,MVSD-415,MVSD-465,MXBD-077,MXBD-097,MXBD-112,MXBD-139,MXBD-142,MXBD-229,MXGR-153,MXGS-204,MXGS-293,MXGS-324,MXGS-365,MXGS-371,MXGS-431,MXGS-694,MXGS-910,MYBA-044,NACR-146,NAPK-003,NGOD-020,NGOD-166,NKKD-216,NKKD-249,NSFS-056,NSFS-071,NTRD-019,NTRD-052,OAE-099,OAE-110,OAE-119,OAE-122,OAE-143,OAE-144,OAE-151,OAE-176,OAE-191,OAE-197,ODFR-008,OFJE-267,OFJE-319,OFKU-198,OKAD-314,OKP-042,OKSN-118,OKSN-140,OKSN-230,OKSN-292,ONED-356,ONEZ-129,ONEZ-136,ONEZ-141,ONSD-654,PFES-005,PFES-009,PFES-012,PFES-022,PGD-691,PGD-770,PGD-773,PGD-809,PGD-825,PGD-850,PGD-919,PGD-952,PGD-957,PPMNB-115,PPPD-340,PPPD-531,PPPD-575,PPPD-577,PPPD-626,PPPD-631,PPPD-682,PPPD-795,PPPD-989,PRBY-012,PRED-001,PRED-010,PRED-015,PRED-036,PRED-051,PRED-054,PRED-096,PRED-133,PRED-179,PRED-193,PRED-198,PRED-220,PRED-226,PRED-237,PRED-246,PRED-250,PRED-254,PRED-256,PRED-265,PRED-271,PRED-277,PRED-280,PRED-285,PRED-291,PRED-298,PRED-304,PRED-305,PRED-319,PRED-320,PRED-321,PRED-331,PRED-332,PRED-333,PRED-334,PRED-339,PRED-349,PRED-351,PRED-360,PRED-372,PRED-376,PRED-381,PRED-388,PRED-395,PRED-397,PRTD-011,PRTD-025,PT-110,RBD-312,RBD-406,RBD-573,RBD-583,RBD-772,RBD-776,RBD-805,RBD-826,RBD-827,RBD-867,RBD-916,RBD-917,RBD-931,RBD-951,RBD-960,RBD-972,RBD-974,RBD-978,RBK-002,RBK-036,RBK-046,RCT-515,RCT-562,RCTD-106,RDT-261,REAL-622,REAL-656,REAL-672,REBD-422,REBD-450,REBD-497,REBD-515,REBD-597,REBD-625,REBD-636,REBDB-159,REBDB-194,REBDB-260,REBDB-271,REBDB-324,REBDB-340,RHJ-024,RHJ-244,RKI-454,RKI-480,RKI-618,ROYD-009,ROYD-071,ROYD-072,S2M-007,S2M-034,SAME-008,SAME-016,SAN-035,SDDE-625,SDDE-634,SDMM-028,SDMT-831,SDMU-679,SDMU-716,SDMU-963,SDSI-004,SDSI-008,SDSI-012,SDSI-016,SDSI-019,SDSI-040,SERO-0098,SGA-001,SGA-002,SGA-004,SGLA-001,SHKD-389,SHKD-512,SHKD-608,SHKD-713,SHKD-737,SHKD-744,SHKD-761,SHKD-801,SHKD-808,SHKD-819,SHKD-821,SHKD-836,SHKD-856,SHKD-857,SHKD-869,SHKD-883,SHKD-888,SHKD-924,SHKD-950,SHKD-974,SHKD-976,SHM-048,SIRO-4674,SKMJ-215,SMA-681,SMBD-140,SNIS-113,SNIS-131,SNIS-151,SNIS-162,SNIS-168,SNIS-170,SNIS-186,SNIS-188,SNIS-208,SNIS-228,SNIS-246,SNIS-247,SNIS-268,SNIS-276,SNIS-289,SNIS-301,SNIS-310,SNIS-330,SNIS-371,SNIS-394,SNIS-406,SNIS-441,SNIS-477,SNIS-495,SNIS-530,SNIS-614,SNIS-625,SNIS-632,SNIS-636,SNIS-648,SNIS-653,SNIS-657,SNIS-662,SNIS-665,SNIS-675,SNIS-679,SNIS-696,SNIS-714,SNIS-716,SNIS-735,SNIS-755,SNIS-759,SNIS-778,SNIS-782,SNIS-786,SNIS-803,SNIS-825,SNIS-830,SNIS-833,SNIS-842,SNIS-850,SNIS-854,SNIS-872,SNIS-877,SNIS-896,SNIS-909,SNIS-919,SNIS-920,SNIS-923,SNIS-929,SNIS-937,SNIS-940,SNIS-946,SNIS-960,SNIS-964,SNIS-970,SNIS-983,SNIS-986,SNIS-992,SNIS-999,SOE-087,SOE-107,SOE-117,SOE-121,SOE-138,SOE-160,SOE-178,SOE-195,SOE-210,SOE-454,SOE-490,SOE-523,SOE-539,SOE-556,SOE-557,SOE-570,SOE-616,SOE-644,SOE-667,SOE-726,SOE-744,SOE-798,SOE-813,SOE-854,SOE-859,SOE-867,SOE-880,SOE-898,SOE-936,SORA-149,SPRD-1178,SPRD-1445,SPRD-1474,SPRD-1484,SPRD-1489,SPRD-613,SPRD-690,SREX-005,SRS-022,SSIS-013,SSIS-014,SSIS-038,SSIS-052,SSIS-062,SSIS-063,SSIS-064,SSIS-088,SSIS-117,SSIS-118,SSIS-144,SSIS-146,SSIS-181,SSIS-182,SSIS-183,SSIS-213,SSIS-241,SSIS-243,SSIS-270,SSIS-283,SSIS-301,SSIS-313,SSIS-338,SSIS-353,SSIS-365,SSIS-380,SSIS-392,SSIS-407,SSIS-419,SSIS-463,SSIS-465,SSIS-469,SSIS-477,SSIS-509,SSNI-005,SSNI-009,SSNI-011,SSNI-014,SSNI-036,SSNI-048,SSNI-050,SSNI-056,SSNI-065,SSNI-067,SSNI-073,SSNI-077,SSNI-081,SSNI-088,SSNI-096,SSNI-106,SSNI-122,SSNI-132,SSNI-143,SSNI-152,SSNI-157,SSNI-182,SSNI-205,SSNI-208,SSNI-209,SSNI-221,SSNI-223,SSNI-224,SSNI-229,SSNI-233,SSNI-254,SSNI-258,SSNI-279,SSNI-284,SSNI-301,SSNI-305,SSNI-326,SSNI-344,SSNI-348,SSNI-368,SSNI-369,SSNI-380,SSNI-388,SSNI-392,SSNI-399,SSNI-400,SSNI-402,SSNI-409,SSNI-413,SSNI-420,SSNI-424,SSNI-432,SSNI-436,SSNI-444,SSNI-452,SSNI-454,SSNI-456,SSNI-466,SSNI-473,SSNI-476,SSNI-484,SSNI-485,SSNI-493,SSNI-495,SSNI-497,SSNI-498,SSNI-516,SSNI-518,SSNI-520,SSNI-521,SSNI-529,SSNI-530,SSNI-531,SSNI-542,SSNI-545,SSNI-546,SSNI-566,SSNI-567,SSNI-568,SSNI-569,SSNI-579,SSNI-589,SSNI-593,SSNI-606,SSNI-618,SSNI-620,SSNI-621,SSNI-644,SSNI-645,SSNI-646,SSNI-647,SSNI-659,SSNI-674,SSNI-675,SSNI-677,SSNI-703,SSNI-704,SSNI-706,SSNI-716,SSNI-730,SSNI-733,SSNI-756,SSNI-757,SSNI-758,SSNI-780,SSNI-802,SSNI-803,SSNI-804,SSNI-845,SSNI-865,SSNI-866,SSNI-888,SSNI-889,SSNI-905,SSNI-916,SSNI-917,SSNI-918,SSNI-939,SSNI-940,SSNI-948,SSNI-963,SSNI-964,SSNI-987,SSNI-989,SSPD-137,SSPD-142,SSPD-144,SSPD-147,SSPD-149,SSPD-150,SSPD-152,SSPD-154,SSPD-155,SSPD-156,SSPD-157,SSR-077,STAR-660,STAR-862,STAR-888,STAR-933,STAR-948,STAR-963,STAR-980,STAR-994,STARS-006,STARS-017,STARS-029,STARS-038,STARS-046,STARS-050,STARS-065,STARS-078,STARS-084,STARS-095,STARS-110,STARS-125,STARS-141,STARS-156,STARS-157,STARS-164,STARS-171,STARS-178,STARS-187,STARS-202,STARS-207,STARS-210,STARS-217,STARS-230,STARS-242,STARS-247,STARS-253,STARS-265,STARS-293,STARS-303,STARS-309,STARS-322,STARS-326,STARS-330,STARS-345,STARS-351,STARS-353,STARS-368,STARS-372,STARS-388,STARS-389,STARS-400,STARS-418,STARS-430,STARS-435,STARS-439,STARS-450,STARS-468,STARS-490,STARS-516,STARS-527,STARS-566,STARS-570,STARS-591,STARS-618,STARS-647,SUPA-245,SUPD-077,SUPD-135,SW-294,SW-515,SW-537,SW-555,T28-287,T28-513,TAAK-007,TAAK-017,TAD-018,TAMA-028,TEM-056,TERA-007,THS-006,TIKB-019,TKI-066,TPPN-033,TPPN-038,TPPN-055,TT-041,TYOD-237,TYOD-280,UFD-003,UFD-068,UMD-639,UMD-754,URE-070,URE-076,VAGU-221,VAGU-233,VAL-009,VEC-124,VEMA-043,VEMA-176,VENU-633,VENU-649,VENU-779,VENX-108,VICD-372,VICD-377,WAAA-060,WAAA-068,WANZ-193,WANZ-282,WANZ-314,WANZ-348,WANZ-377,WANZ-502,WANZ-552,WANZ-577,WANZ-599,WANZ-630,WANZ-633,WANZ-661,WANZ-692,WANZ-693,WANZ-711,WANZ-716,WANZ-730,WANZ-804,WANZ-869,WANZ-878,WANZ-958,WNZ-402,WNZ-429,WSS-213,XMOM-039,XRW-139,XRW-301,XRW-318,XRW-492,XV-724,XV-800,XV-851,XVSR-217,XVSR-274,XVSR-339,XVSR-506,YMDD-218,YMDD-266,ZEX-201,ZOZO-105,ZSD-74,ZUKO-042,ZUKO-046,JUQ-082,JUL-985,IPX-937,IPX-934,IPX-931,IPX-928,ADN-416,SSIS-494,SSIS-421,SSIS-520,SSIS-448,SSIS-287,SSIS-211,SSIS-116,SSIS-037,STARS-708,STARS-676
// @downloadURL https://update.greasyfork.org/scripts/450795/Bus%20Fav.user.js
// @updateURL https://update.greasyfork.org/scripts/450795/Bus%20Fav.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function clog(e){
        console.log('[BF]',e);
    }


    let avid = '';

    // 瀑布流状态：1：开启、0：关闭
    let waterfallScrollStatus = GM_getValue('scroll_status', 1);

    if (GM_getValue('bt_girls', undefined) === undefined) {
        GM_setValue('bt_girls', '');
    }
    if (GM_getValue('bt_movies', undefined) === undefined) {
        GM_setValue('bt_movies', '');
    }
    if (GM_getValue('bt_views', undefined) === undefined) {
        GM_setValue('bt_views', '');
    }


    GM_addStyle(`
	  .tm-setting {display: flex;align-items: center;justify-content: space-between;}
      #bt_girls,#bt_movies{width:100%;height:250px;}
      .tm-checkbox {width: 16px;height: 16px;}
    `);
    GM_registerMenuCommand('设置', () => {
        let scroll_true = '';
        if (GM_getValue('scroll_status', 1) !== 0){
            GM_setValue('scroll_status', 1);
            scroll_true = "checked";
        }

        let dom = `<div class="">
          <div class=""><div>已关注</div><textarea id="bt_girls" >${GM_getValue('bt_girls')}</textarea></div>
          <div class=""><div>已下载</div><textarea id="bt_movies" >${GM_getValue('bt_movies')}</textarea></div>
          <div class=""><div>已阅读</div><textarea id="bt_views" >${GM_getValue('bt_views').length}</textarea></div>
          <div class="tm-setting"><div>开启瀑布流</div><input type="checkbox" id="scroll_true" ${scroll_true} class="tm-checkbox"></div>
        </div>`;
        let $dom = $(dom);
        Swal.fire({
            title: '脚本设置',
            html: $dom[0],
            confirmButtonText: '保存',
            width:'600px'
        }).then((result) => {
            if (result.value){
                if($('#scroll_true')[0].checked){
                    GM_setValue('scroll_status', 1);
                }
                else{
                    GM_setValue('scroll_status', 0);
                }
                GM_setValue('bt_girls', $('#bt_girls').val());
                GM_setValue('bt_movies', $('#bt_movies').val());
                history.go(0);
            }
        })
    });

    // 瀑布流脚本使用类
    class Lock {
        constructor(d = false) {
            this.locked = d;
        }
        lock() {
            this.locked = true;
        }
        unlock() {
            this.locked = false;
        }
    }

    var thirdparty = {
        // 瀑布流脚本
        waterfallScrollInit: function () {
            var w = new thirdparty.waterfall({});
            // javbus.com、avmo.pw、avso.pw
            var $pages = $('div#waterfall div.item');
            if ($pages.length) {
                $pages[0].parentElement.parentElement.id = "waterfall_h";
                // javbus.com
                if ($("footer:contains('JavBus')").length) {
                    w = new thirdparty.waterfall({
                        next: 'a#next',
                        item: 'div#waterfall div.item',
                        cont: '.masonry',
                        pagi: '.pagination-lg',
                    });
                }
            }


            w.setSecondCallback(function (cont, elems) {
                if (location.pathname.includes('/star/') && elems) {
                    cont.append(elems.slice(1));
                } else {
                    cont.append(elems);
                }
            });

            w.setThirdCallback(function (elems) {
            });

            w.setFourthCallback(function (elems) {



                if(((/(JavBus|AVMOO|AVSOX)/g).test(document.title) || $("footer:contains('JavBus')").length) && elems) {
                    if(location.pathname.search('/actresses|/&mdl=favor&sort=4') < 0){//排除actresses页面
                        GM_addStyle(`
                            .movie_tag_text{width:57px;text-align:center;float:left;}
                            .girl_tag_yes{padding:3px;line-height:1;background:rgba(0,0,255,.5);color:#fff;position:absolute;top:0;left:0;z-index:999;}
                            .movie_title{font-size:10px;line-height:1;}
                            .photo-frame{margin:5px!important}
                            .photo-info{border:none;background-color:transparent;padding:0 5px!important;}
                        `);
                        // 处理列表文字内容排版
                        for (let i = 0; i < elems.length; i++) {
                            //$(elems[i]).css("height","385px");
                            if($(elems[i]).find("div.avatar-box").length > 0) continue;
                            let spanEle = $(elems[i]).find("div.photo-info span")[0];
                            let tags = $(spanEle).html().substr($(spanEle).html().indexOf("<br>") + 4);
                            let title = $(spanEle).html().substr(0,$(spanEle).html().indexOf("<br>"));

                            let bgc='#fff';


                            if(title.substr(-1)=='…'){
                                bgc='#AACBE9';
                            }

                            let girls = GM_getValue('bt_girls').split(',');
                            let girlTag = '';
                            girls.forEach(x=>{
                                if(title.indexOf(x)>=0){
                                    girlTag='<div class="girl_tag_yes">'+x+'</div>';
                                    bgc='#ffd993';
                                }
                            })
                            let movies = GM_getValue('bt_movies').split(',');
                            movies.forEach(x=>{
                                if(tags.indexOf(x)>=0){
                                    bgc='#96c167';
                                }
                            })
                            $(elems[i]).find('.movie-box').prepend(girlTag);
                            $(elems[i]).find('.movie-box').css("background",bgc);
                            $(spanEle).html('<div class="movie_title">'+ tags + '</div><div class="movie_title">' + title+ "</div>");
                        }
                    }
                }
            });

            if((/(JavBus|AVMOO|AVSOX)/g).test(document.title) || $("footer:contains('JavBus')").length) {
                // javbus.com、avmo.pw、avso.pw 样式
                GM_addStyle(`
                    #waterfall_h {height: initial !important;width: initial !important;flex-direction: row;flex-wrap: wrap;margin: 5px 15px !important;}
                    #waterfall_h .item {position: relative !important;top: initial !important;left: initial !important;float: left;}
                    #waterfall_h .movie-box img {position: absolute; top: -200px; bottom: -200px; left: -200px; right: -200px; margin: auto}
                    #waterfall_h .movie-box .photo-frame {position: relative;} #waterfall_h .avatar-box .photo-info p {margin: 0 0 2px;}
                    #waterfall_h .avatar-box .photo-info {line-height: 15px; padding: 6px;height: 220px;}
                    #waterfall_h .avatar-box .photo-frame {margin: 10px;text-align: center;}
                    #waterfall_h .avatar-box.text-center {height: 195px;}//actresses页面
                `);

                if($('#waterfall').length == 0 && location.pathname.search(/search/) > 0
                   && location.pathname.search(/uncensored/) < 1){
                    window.location.href = $('li[role="presentation"]:eq(1) a').attr("href");
                }

                if(location.pathname.includes('/uncensored') || (/(AVSOX)/g).test(document.title)){
                    GM_addStyle(`#waterfall_h .movie-box {width: 354px;} #waterfall_h .movie-box .photo-info {height: 105px;}`);
                }
                else {
                    GM_addStyle(`#waterfall_h .movie-box {width: 151px;margin:2px 1px!important;box-shadow:none;} #waterfall_h .movie-box .photo-info {height: 145px;}`);
                    GM_addStyle(`#waterfall_h .avatar-box {width: 151px;margin:1px!important;box-shadow:none;} `);
                }
            }
        },
        // 瀑布流脚本
        waterfall: (function () {
            function waterfall(selectorcfg = {}) {
                this.lock = new Lock();
                this.baseURI = this.getBaseURI();
                this.selector = {
                    next: 'a.next',
                    item: '',
                    cont: '#waterfall', //container
                    pagi: '.pagination',
                };
                Object.assign(this.selector, selectorcfg);
                this.pagegen = this.fetchSync(location.href);
                this.anchor = $(this.selector.pagi)[0];
                this._count = 0;
                this._1func = function (cont, elems) {
                    cont.empty().append(elems);
                };
                this._2func = function (cont, elems) {
                };
                this._3func = function (elems) {
                };
                if ($(this.selector.item).length) {
                    // 开启关闭瀑布流判断
                    if(waterfallScrollStatus > 0) {
                        document.addEventListener('scroll', this.scroll.bind(this));
                        document.addEventListener('wheel', this.wheel.bind(this));
                    }
                    this.appendElems(this._1func);
                }
            }

            waterfall.prototype.getBaseURI = function () {
                let _ = location;
                return `${_.protocol}//${_.hostname}${(_.port && `:${_.port}`)}`;
            };
            waterfall.prototype.getNextURL = function (href) {
                let a = document.createElement('a');
                a.href = href;
                return `${this.baseURI}${a.pathname}${a.search}`;
            };
            // 瀑布流脚本
            waterfall.prototype.fetchURL = function (url) {
                console.log(`fetchUrl = ${url}`);
                const fetchwithcookie = fetch(url, {credentials: 'same-origin'});
                return fetchwithcookie.then(response => response.text())
                    .then(html => new DOMParser().parseFromString(html, 'text/html'))
                    .then(doc => {
                    let $doc = $(doc);
                    let href = $doc.find(this.selector.next).attr('href');
                    let nextURL = href ? this.getNextURL(href) : undefined;
                    let elems = $doc.find(this.selector.item);
                    for(const elem of elems) {
                        const links = elem.getElementsByTagName('a');
                        for(const link of links) {
                            link.target = "_blank";
                        }
                    }
                    return {
                        nextURL,
                        elems
                    };
                });
            };
            // 瀑布流脚本
            waterfall.prototype.fetchSync = function* (urli) {
                let url = urli;
                do {
                    yield new Promise((resolve, reject) => {
                        if (this.lock.locked) {
                            reject();
                        }
                        else {
                            this.lock.lock();
                            resolve();
                        }
                    }).then(() => {
                        return this.fetchURL(url).then(info => {
                            url = info.nextURL;
                            return info.elems;
                        })
                        ;
                    }).then(elems => {
                        this.lock.unlock();
                        return elems;
                    }).catch((err) => {
                        // Locked!
                    }
                            )
                    ;
                } while (url);
            };
            // 瀑布流脚本
            waterfall.prototype.appendElems = function () {
                let nextpage = this.pagegen.next();
                if (!nextpage.done) {
                    nextpage.value.then(elems => {
                        const cb = (this._count === 0) ? this._1func : this._2func;
                        cb($(this.selector.cont), elems);
                        this._count += 1;
                        // hobby mod script
                        this._3func(elems);
                        this._4func(elems);
                    })
                    ;
                }
                return nextpage.done;
            };
            // 瀑布流脚本
            waterfall.prototype.end = function () {
                document.removeEventListener('scroll', this.scroll.bind(this));
                document.removeEventListener('wheel', this.wheel.bind(this));
                let $end = $(`<h1>The End</h1>`);
                $(this.anchor).replaceWith($end);
            };
            waterfall.prototype.reachBottom = function (elem, limit) {
                return (elem.getBoundingClientRect().top - $(window).height()) < limit;
            };
            waterfall.prototype.scroll = function () {
                if (this.reachBottom(this.anchor, 500) && this.appendElems(this._2func)) {
                    this.end();
                }
            };
            waterfall.prototype.wheel = function () {
                if (this.reachBottom(this.anchor, 1000) && this.appendElems(this._2func)) {
                    this.end();
                }
            };
            waterfall.prototype.setFirstCallback = function (f) {
                this._1func = f;
            };
            waterfall.prototype.setSecondCallback = function (f) {
                this._2func = f;
            };
            waterfall.prototype.setThirdCallback = function (f) {
                this._3func = f;
            };
            waterfall.prototype.setFourthCallback = function (f) {
                this._4func = f;
            };
            return waterfall;
        })(),

    };

    function movie(){
        GM_addStyle(`
          .bf-movie{cursor: pointer;padding: 3px 4px 3px 2px;border: 1px solid #FEBE00;border-radius: 3px;margin-right:20px;}
          .bf-movie.true{color:#CC0000;background:#FEBE00;}
          .bf-movie.false{color:#FEBE00;background:#fff;}
        `);

        $('.info p').first().append(`<span class="glyphicon glyphicon-ok bf-movie" data-avid="${avid}"></span>`);
        let movies = GM_getValue('bt_movies').split(',');

        let mi = movies.findIndex(m=>m==avid);
        if(mi>=0){
            $('.bf-movie').addClass('true');
        }else{
            $('.bf-movie').addClass('false');
        }

        $('.bf-movie').bind('click',function(e){
            let id = e.currentTarget.dataset.avid;
            movies = GM_getValue('bt_movies').split(',');

            if($(this).hasClass('true')){
                clog('remove movie');
                movies.splice(mi,1);
                $(this).removeClass('true').addClass('false');
            }else{
                clog('save movie');
                movies.push(id);
                movies = Array.from(new Set(movies));

                $(this).removeClass('false').addClass('true');
            }
            GM_setValue('bt_movies',movies.join(','));
        });
    }

    function girl(){
        GM_addStyle(`
          .bf-girl{cursor: pointer;padding: 3px 4px 3px 2px;border: 1px solid #FEBE00;border-radius: 3px;margin-right:5px;}
          .bf-girl-info{cursor: pointer;padding: 3px;border: 1px solid #FEBE00;border-radius: 3px;margin-right:60px;}
          .bf-girl.true, .bf-girl-info.false{color:#CC0000;background:#FEBE00;}
          .bf-girl.false{color:#FEBE00;background:#fff;}
          .info .genre {margin-right:0px!important;}
        `);

        let status = false;
        let eles = $('.info p').last().find('.genre');

        let girls = GM_getValue('bt_girls').split(',');

        for(let i=0;i<=eles.length;i++){
            let girl = eles.eq(i).text().trim();

            eles.eq(i).after(`<span class="glyphicon glyphicon-eye-open bf-girl-info false" data-girl="${girl}"></span>`);

            let gi = girls.findIndex(g=>girl.indexOf(g)>=0);
            if(gi>=0){
                eles.eq(i).after(`<span class="glyphicon glyphicon-ok bf-girl true" data-girl="${girl}"></span>`);
            }else{
                eles.eq(i).after(`<span class="glyphicon glyphicon-ok bf-girl false" data-girl="${girl}"></span>`);
            }

        }

        $('.bf-girl').bind('click',function(e){
            let girl = e.currentTarget.dataset.girl;
            girls = GM_getValue('bt_girls').split(',');
            let gi = girls.findIndex(g=>girl.indexOf(g)>=0);

            if(gi>0){
                clog('remove girl');
                girls.splice(gi,1);
                $(this).removeClass('true').addClass('false');
            }else{
                clog('save girl');
                girls.push(girl);
                girls = Array.from(new Set(girls));

                $(this).removeClass('false').addClass('true');
            }
            GM_setValue('bt_girls',girls.join(','));
        });


        $('.bf-girl-info').bind('click',function(e){
            let girl = e.currentTarget.dataset.girl;
            let url = `https://missav.com/actresses/${girl}`;
            GM_openInTab(url);
        });
    }

    function mainOuter(){
        console.log('[BF] mainOuter Running');

        GM_addStyle(`
          .container-fluid{margin:0!important;}
          .footer{display:none;}
        `);

        thirdparty.waterfallScrollInit();
    }

    function mainInner(){
        console.log('[BF] mainInner Running');

        avid = $('.info .header')[0].nextElementSibling.textContent;
        console.log('[BF] avid ',avid);

        GM_addStyle(`
          .container {width: 100%;float: left;background: #eee;}
          .col-md-3 {float: left;max-width: 260px;}
          .col-md-9 {width: inherit;}
          .footer{display:none;}
        `);

        $('#genre-toggle').hide();
        $('#star-toggle').hide();
        $('.starfav').hide();
        $('.favicon').hide();

        movie();
        girl();


    }


    if($('.info .header')[0]){
        mainInner();
    }else{
        mainOuter();
    }





})();