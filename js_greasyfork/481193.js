// ==UserScript==
// @name         Kittymatic Job Library
// @namespace    http://tampermonkey.net/
// @version      1.0.1 [Internal]
// @description  Testing
// @author       LillaMilla, Ahnorac
// @grant        none
// ==/UserScript==

const libs = 
{
    "KittyJobList": [
        {
            "id": 1,
            "jobname": "swine",
            "baseexp": "46",
            "basemoney": "83",
            "maxluck": 75
        },
        {
            "id": 2,
            "jobname": "scarecrow",
            "baseexp": "72",
            "basemoney": "52",
            "maxluck": 102
        },
        {
            "id": 3,
            "jobname": "wanted",
            "baseexp": "72",
            "basemoney": "70",
            "maxluck": 75
        },
        {
            "id": 4,
            "jobname": "tabacco",
            "baseexp": "46",
            "basemoney": "110",
            "maxluck": 102
        },
        {
            "id": 5,
            "jobname": "cotton",
            "baseexp": "81",
            "basemoney": "52",
            "maxluck": 75
        },
        {
            "id": 6,
            "jobname": "sugar",
            "baseexp": "61",
            "basemoney": "102",
            "maxluck": 129
        },
        {
            "id": 7,
            "jobname": "angle",
            "baseexp": "46",
            "basemoney": "52",
            "maxluck": 156
        },
        {
            "id": 8,
            "jobname": "cereal",
            "baseexp": "96",
            "basemoney": "70",
            "maxluck": 102
        },
        {
            "id": 9,
            "jobname": "berry",
            "baseexp": "96",
            "basemoney": "70",
            "maxluck": 142
        },
        {
            "id": 10,
            "jobname": "sheeps",
            "baseexp": "89",
            "basemoney": "83",
            "maxluck": 75
        },
        {
            "id": 11,
            "jobname": "newspaper",
            "baseexp": "46",
            "basemoney": "110",
            "maxluck": 102
        },
        {
            "id": 12,
            "jobname": "cut",
            "baseexp": "102",
            "basemoney": "102",
            "maxluck": 115
        },
        {
            "id": 13,
            "jobname": "grinding",
            "baseexp": "102",
            "basemoney": "142",
            "maxluck": 75
        },
        {
            "id": 14,
            "jobname": "corn",
            "baseexp": "102",
            "basemoney": "93",
            "maxluck": 183
        },
        {
            "id": 15,
            "jobname": "beans",
            "baseexp": "102",
            "basemoney": "131",
            "maxluck": 129
        },
        {
            "id": 16,
            "jobname": "fort_guard",
            "baseexp": "114",
            "basemoney": "83",
            "maxluck": 102
        },
        {
            "id": 17,
            "jobname": "tanning",
            "baseexp": "141",
            "basemoney": "148",
            "maxluck": 142
        },
        {
            "id": 18,
            "jobname": "digging",
            "baseexp": "72",
            "basemoney": "142",
            "maxluck": 142
        },
        {
            "id": 19,
            "jobname": "grave",
            "baseexp": "128",
            "basemoney": "166",
            "maxluck": 372
        },
        {
            "id": 20,
            "jobname": "turkey",
            "baseexp": "137",
            "basemoney": "83",
            "maxluck": 169
        },
        {
            "id": 21,
            "jobname": "rail",
            "baseexp": "152",
            "basemoney": "137",
            "maxluck": 142
        },
        {
            "id": 22,
            "jobname": "cow",
            "baseexp": "149",
            "basemoney": "102",
            "maxluck": 75
        },
        {
            "id": 23,
            "jobname": "fence",
            "baseexp": "124",
            "basemoney": "118",
            "maxluck": 142
        },
        {
            "id": 24,
            "jobname": "saw",
            "baseexp": "128",
            "basemoney": "194",
            "maxluck": 156
        },
        {
            "id": 25,
            "jobname": "stone",
            "baseexp": "108",
            "basemoney": "171",
            "maxluck": 196
        },
        {
            "id": 26,
            "jobname": "straighten",
            "baseexp": "165",
            "basemoney": "125",
            "maxluck": 277
        },
        {
            "id": 27,
            "jobname": "wood",
            "baseexp": "89",
            "basemoney": "175",
            "maxluck": 102
        },
        {
            "id": 28,
            "jobname": "irrigation",
            "baseexp": "133",
            "basemoney": "118",
            "maxluck": 277
        },
        {
            "id": 29,
            "jobname": "brand",
            "baseexp": "175",
            "basemoney": "125",
            "maxluck": 75
        },
        {
            "id": 30,
            "jobname": "wire",
            "baseexp": "133",
            "basemoney": "171",
            "maxluck": 156
        },
        {
            "id": 31,
            "jobname": "dam",
            "baseexp": "152",
            "basemoney": "93",
            "maxluck": 196
        },
        {
            "id": 32,
            "jobname": "gems",
            "baseexp": "102",
            "basemoney": "201",
            "maxluck": 183
        },
        {
            "id": 33,
            "jobname": "claim",
            "baseexp": "81",
            "basemoney": "220",
            "maxluck": 129
        },
        {
            "id": 34,
            "jobname": "chuck_wagon",
            "baseexp": "169",
            "basemoney": "102",
            "maxluck": 642
        },
        {
            "id": 35,
            "jobname": "break_in",
            "baseexp": "194",
            "basemoney": "153",
            "maxluck": 210
        },
        {
            "id": 36,
            "jobname": "trade",
            "baseexp": "72",
            "basemoney": "162",
            "maxluck": 412
        },
        {
            "id": 37,
            "jobname": "mast",
            "baseexp": "175",
            "basemoney": "187",
            "maxluck": 115
        },
        {
            "id": 38,
            "jobname": "spring",
            "baseexp": "196",
            "basemoney": "131",
            "maxluck": 385
        },
        {
            "id": 39,
            "jobname": "beaver",
            "baseexp": "149",
            "basemoney": "223",
            "maxluck": 156
        },
        {
            "id": 40,
            "jobname": "coal",
            "baseexp": "137",
            "basemoney": "217",
            "maxluck": 75
        },
        {
            "id": 41,
            "jobname": "print",
            "baseexp": "159",
            "basemoney": "217",
            "maxluck": 142
        },
        {
            "id": 42,
            "jobname": "fishing",
            "baseexp": "169",
            "basemoney": "110",
            "maxluck": 385
        },
        {
            "id": 43,
            "jobname": "trainstation",
            "baseexp": "227",
            "basemoney": "148",
            "maxluck": 169
        },
        {
            "id": 44,
            "jobname": "windmeel",
            "baseexp": "219",
            "basemoney": "249",
            "maxluck": 156
        },
        {
            "id": 45,
            "jobname": "explore",
            "baseexp": "223",
            "basemoney": "52",
            "maxluck": 372
        },
        {
            "id": 46,
            "jobname": "float",
            "baseexp": "223",
            "basemoney": "194",
            "maxluck": 75
        },
        {
            "id": 47,
            "jobname": "bridge",
            "baseexp": "196",
            "basemoney": "171",
            "maxluck": 318
        },
        {
            "id": 48,
            "jobname": "springe",
            "baseexp": "223",
            "basemoney": "214",
            "maxluck": 75
        },
        {
            "id": 49,
            "jobname": "coffin",
            "baseexp": "108",
            "basemoney": "249",
            "maxluck": 277
        },
        {
            "id": 50,
            "jobname": "dynamite",
            "baseexp": "128",
            "basemoney": "194",
            "maxluck": 939
        },
        {
            "id": 51,
            "jobname": "coyote",
            "baseexp": "219",
            "basemoney": "162",
            "maxluck": 426
        },
        {
            "id": 52,
            "jobname": "buffalo",
            "baseexp": "255",
            "basemoney": "197",
            "maxluck": 75
        },
        {
            "id": 53,
            "jobname": "fort",
            "baseexp": "270",
            "basemoney": "225",
            "maxluck": 304
        },
        {
            "id": 54,
            "jobname": "indians",
            "baseexp": "137",
            "basemoney": "142",
            "maxluck": 925
        },
        {
            "id": 55,
            "jobname": "clearing",
            "baseexp": "108",
            "basemoney": "294",
            "maxluck": 196
        },
        {
            "id": 56,
            "jobname": "silver",
            "baseexp": "108",
            "basemoney": "320",
            "maxluck": 75
        },
        {
            "id": 57,
            "jobname": "diligence_guard",
            "baseexp": "280",
            "basemoney": "228",
            "maxluck": 682
        },
        {
            "id": 58,
            "jobname": "wolf",
            "baseexp": "257",
            "basemoney": "187",
            "maxluck": 277
        },
        {
            "id": 59,
            "jobname": "track",
            "baseexp": "252",
            "basemoney": "137",
            "maxluck": 480
        },
        {
            "id": 60,
            "jobname": "ox",
            "baseexp": "199",
            "basemoney": "298",
            "maxluck": 318
        },
        {
            "id": 61,
            "jobname": "guard",
            "baseexp": "201",
            "basemoney": "201",
            "maxluck": 588
        },
        {
            "id": 62,
            "jobname": "bible",
            "baseexp": "254",
            "basemoney": "102",
            "maxluck": 777
        },
        {
            "id": 63,
            "jobname": "ponyexpress",
            "baseexp": "229",
            "basemoney": "162",
            "maxluck": 763
        },
        {
            "id": 64,
            "jobname": "weapons",
            "baseexp": "201",
            "basemoney": "162",
            "maxluck": 1047
        },
        {
            "id": 65,
            "jobname": "dead",
            "baseexp": "137",
            "basemoney": "157",
            "maxluck": 1290
        },
        {
            "id": 66,
            "jobname": "grizzly",
            "baseexp": "281",
            "basemoney": "201",
            "maxluck": 547
        },
        {
            "id": 67,
            "jobname": "oil",
            "baseexp": "175",
            "basemoney": "332",
            "maxluck": 345
        },
        {
            "id": 68,
            "jobname": "treasure_hunting",
            "baseexp": "159",
            "basemoney": "183",
            "maxluck": 1195
        },
        {
            "id": 69,
            "jobname": "army",
            "baseexp": "278",
            "basemoney": "279",
            "maxluck": 304
        },
        {
            "id": 70,
            "jobname": "steal",
            "baseexp": "233",
            "basemoney": "264",
            "maxluck": 1074
        },
        {
            "id": 71,
            "jobname": "mercenary",
            "baseexp": "237",
            "basemoney": "347",
            "maxluck": 385
        },
        {
            "id": 72,
            "jobname": "bandits",
            "baseexp": "277",
            "basemoney": "210",
            "maxluck": 1222
        },
        {
            "id": 73,
            "jobname": "aggression",
            "baseexp": "180",
            "basemoney": "323",
            "maxluck": 1128
        },
        {
            "id": 74,
            "jobname": "diligence_aggression",
            "baseexp": "280",
            "basemoney": "228",
            "maxluck": 1357
        },
        {
            "id": 75,
            "jobname": "bounty",
            "baseexp": "194",
            "basemoney": "347",
            "maxluck": 1141
        },
        {
            "id": 76,
            "jobname": "captured",
            "baseexp": "267",
            "basemoney": "194",
            "maxluck": 1222
        },
        {
            "id": 77,
            "jobname": "train",
            "baseexp": "294",
            "basemoney": "303",
            "maxluck": 1317
        },
        {
            "id": 78,
            "jobname": "burglary",
            "baseexp": "199",
            "basemoney": "327",
            "maxluck": 1168
        },
        {
            "id": 79,
            "jobname": "quackery",
            "baseexp": "233",
            "basemoney": "300",
            "maxluck": 777
        },
        {
            "id": 80,
            "jobname": "peace",
            "baseexp": "266",
            "basemoney": "225",
            "maxluck": 1101
        },
        {
            "id": 82,
            "jobname": "ship",
            "baseexp": "201",
            "basemoney": "330",
            "maxluck": 277
        },
        {
            "id": 83,
            "jobname": "smuggle",
            "baseexp": "223",
            "basemoney": "294",
            "maxluck": 1195
        },
        {
            "id": 84,
            "jobname": "ranch",
            "baseexp": "254",
            "basemoney": "210",
            "maxluck": 304
        },
        {
            "id": 85,
            "jobname": "iron",
            "baseexp": "194",
            "basemoney": "273",
            "maxluck": 277
        },
        {
            "id": 86,
            "jobname": "agave",
            "baseexp": "217",
            "basemoney": "201",
            "maxluck": 237
        },
        {
            "id": 87,
            "jobname": "tomato",
            "baseexp": "128",
            "basemoney": "153",
            "maxluck": 169
        },
        {
            "id": 88,
            "jobname": "horseshoe",
            "baseexp": "183",
            "basemoney": "157",
            "maxluck": 196
        },
        {
            "id": 90,
            "jobname": "fire",
            "baseexp": "215",
            "basemoney": "162",
            "maxluck": 952
        },
        {
            "id": 91,
            "jobname": "orange",
            "baseexp": "175",
            "basemoney": "157",
            "maxluck": 210
        },
        {
            "id": 92,
            "jobname": "muck_out",
            "baseexp": "89",
            "basemoney": "93",
            "maxluck": 102
        },
        {
            "id": 93,
            "jobname": "shoes",
            "baseexp": "61",
            "basemoney": "83",
            "maxluck": 115
        },
        {
            "id": 94,
            "jobname": "socks_darn",
            "baseexp": "81",
            "basemoney": "52",
            "maxluck": 75
        },
        {
            "id": 95,
            "jobname": "potatoe",
            "baseexp": "239",
            "basemoney": "125",
            "maxluck": 142
        },
        {
            "id": 96,
            "jobname": "feed_animal",
            "baseexp": "252",
            "basemoney": "171",
            "maxluck": 210
        },
        {
            "id": 97,
            "jobname": "pumpkin",
            "baseexp": "223",
            "basemoney": "257",
            "maxluck": 210
        },
        {
            "id": 98,
            "jobname": "blueberries",
            "baseexp": "201",
            "basemoney": "273",
            "maxluck": 547
        },
        {
            "id": 99,
            "jobname": "plant_trees",
            "baseexp": "175",
            "basemoney": "228",
            "maxluck": 804
        },
        {
            "id": 100,
            "jobname": "gather_feathers",
            "baseexp": "169",
            "basemoney": "261",
            "maxluck": 885
        },
        {
            "id": 101,
            "jobname": "lotus_gathering",
            "baseexp": "223",
            "basemoney": "277",
            "maxluck": 547
        },
        {
            "id": 102,
            "jobname": "crab_hunting",
            "baseexp": "245",
            "basemoney": "303",
            "maxluck": 547
        },
        {
            "id": 103,
            "jobname": "teaching",
            "baseexp": "283",
            "basemoney": "277",
            "maxluck": 142
        },
        {
            "id": 104,
            "jobname": "sheriff_work",
            "baseexp": "278",
            "basemoney": "303",
            "maxluck": 831
        },
        {
            "id": 105,
            "jobname": "sulfur_gathering",
            "baseexp": "199",
            "basemoney": "320",
            "maxluck": 1128
        },
        {
            "id": 106,
            "jobname": "wildwater",
            "baseexp": "275",
            "basemoney": "334",
            "maxluck": 480
        },
        {
            "id": 107,
            "jobname": "gambler",
            "baseexp": "247",
            "basemoney": "303",
            "maxluck": 1006
        },
        {
            "id": 108,
            "jobname": "rattlesnake",
            "baseexp": "225",
            "basemoney": "313",
            "maxluck": 1033
        },
        {
            "id": 109,
            "jobname": "salpeter_gathering",
            "baseexp": "239",
            "basemoney": "294",
            "maxluck": 858
        },
        {
            "id": 110,
            "jobname": "horse_transport",
            "baseexp": "287",
            "basemoney": "301",
            "maxluck": 1006
        },
        {
            "id": 111,
            "jobname": "rodeo",
            "baseexp": "245",
            "basemoney": "320",
            "maxluck": 1006
        },
        {
            "id": 112,
            "jobname": "travelling_salesman",
            "baseexp": "225",
            "basemoney": "288",
            "maxluck": 1384
        },
        {
            "id": 113,
            "jobname": "con_artist",
            "baseexp": "297",
            "basemoney": "323",
            "maxluck": 547
        },
        {
            "id": 114,
            "jobname": "cougar",
            "baseexp": "297",
            "basemoney": "259",
            "maxluck": 601
        },
        {
            "id": 115,
            "jobname": "indigo_gathering",
            "baseexp": "274",
            "basemoney": "339",
            "maxluck": 466
        },
        {
            "id": 116,
            "jobname": "alcohol",
            "baseexp": "300",
            "basemoney": "316",
            "maxluck": 534
        },
        {
            "id": 117,
            "jobname": "lead_gathering",
            "baseexp": "272",
            "basemoney": "342",
            "maxluck": 372
        },
        {
            "id": 118,
            "jobname": "gem_gathering",
            "baseexp": "281",
            "basemoney": "345",
            "maxluck": 385
        },
        {
            "id": 119,
            "jobname": "mission",
            "baseexp": "287",
            "basemoney": "347",
            "maxluck": 804
        },
        {
            "id": 120,
            "jobname": "casino",
            "baseexp": "301",
            "basemoney": "323",
            "maxluck": 385
        },
        {
            "id": 121,
            "jobname": "marshall",
            "baseexp": "299",
            "basemoney": "339",
            "maxluck": 885
        },
        {
            "id": 122,
            "jobname": "shatter_gang",
            "baseexp": "269",
            "basemoney": "334",
            "maxluck": 1276
        },
        {
            "id": 123,
            "jobname": "bankrobbery",
            "baseexp": "290",
            "basemoney": "348",
            "maxluck": 480
        },
        {
            "id": 124,
            "jobname": "free_slaves",
            "baseexp": "303",
            "basemoney": "334",
            "maxluck": 453
        },
        {
            "id": 125,
            "jobname": "buffelo_bill",
            "baseexp": "304",
            "basemoney": "347",
            "maxluck": 952
        },
        {
            "id": 126,
            "jobname": "build_palisade",
            "baseexp": "261",
            "basemoney": "225",
            "maxluck": 345
        },
        {
            "id": 127,
            "jobname": "spearfishing",
            "baseexp": "46",
            "basemoney": "70",
            "maxluck": 102
        },
        {
            "id": 128,
            "jobname": "gather_spices",
            "baseexp": "61",
            "basemoney": "39",
            "maxluck": 75
        },
        {
            "id": 129,
            "jobname": "grind_coffee",
            "baseexp": "61",
            "basemoney": "70",
            "maxluck": 102
        },
        {
            "id": 130,
            "jobname": "lambs",
            "baseexp": "72",
            "basemoney": "70",
            "maxluck": 88
        },
        {
            "id": 131,
            "jobname": "trapper",
            "baseexp": "286",
            "basemoney": "334",
            "maxluck": 385
        },
        {
            "id": 132,
            "jobname": "play_piano",
            "baseexp": "300",
            "basemoney": "315",
            "maxluck": 358
        },
        {
            "id": 133,
            "jobname": "guide_greenhorns",
            "baseexp": "305",
            "basemoney": "322",
            "maxluck": 520
        },
        {
            "id": 134,
            "jobname": "construct_lazarett",
            "baseexp": "297",
            "basemoney": "318",
            "maxluck": 817
        },
        {
            "id": 135,
            "jobname": "translator",
            "baseexp": "305",
            "basemoney": "356",
            "maxluck": 534
        },
        {
            "id": 136,
            "jobname": "arm_wrestling",
            "baseexp": "303",
            "basemoney": "362",
            "maxluck": 1195
        },
        {
            "id": 137,
            "jobname": "harvest_pepper",
            "baseexp": "294",
            "basemoney": "347",
            "maxluck": 831
        },
        {
            "id": 138,
            "jobname": "grave_digger",
            "baseexp": "280",
            "basemoney": "325",
            "maxluck": 1303
        },
        {
            "id": 139,
            "jobname": "bodyguard",
            "baseexp": "313",
            "basemoney": "372",
            "maxluck": 1249
        },
        {
            "id": 140,
            "jobname": "melting_bullets",
            "baseexp": "310",
            "basemoney": "362",
            "maxluck": 979
        },
        {
            "id": 141,
            "jobname": "track_big_game",
            "baseexp": "343",
            "basemoney": "342",
            "maxluck": 1074
        },
        {
            "id": 142,
            "jobname": "embassador",
            "baseexp": "327",
            "basemoney": "375",
            "maxluck": 1182
        },
        {
            "id": 143,
            "jobname": "plan_reservat",
            "baseexp": "329",
            "basemoney": "363",
            "maxluck": 1168
        },
        {
            "id": 144,
            "jobname": "colonialize_areas",
            "baseexp": "331",
            "basemoney": "366",
            "maxluck": 1222
        },
        {
            "id": 145,
            "jobname": "gunslinger",
            "baseexp": "347",
            "basemoney": "360",
            "maxluck": 1182
        },
        {
            "id": 146,
            "jobname": "loge",
            "baseexp": "330",
            "basemoney": "369",
            "maxluck": 1195
        },
        {
            "id": 147,
            "jobname": "stage_performer",
            "baseexp": "345",
            "basemoney": "345",
            "maxluck": 979
        },
        {
            "id": 148,
            "jobname": "peace_officer",
            "baseexp": "329",
            "basemoney": "376",
            "maxluck": 844
        },
        {
            "id": 149,
            "jobname": "preacher",
            "baseexp": "342",
            "basemoney": "284",
            "maxluck": 1128
        },
        {
            "id": 150,
            "jobname": "build_settlement",
            "baseexp": "339",
            "basemoney": "348",
            "maxluck": 709
        },
        {
            "id": 151,
            "jobname": "recruit_soldiers",
            "baseexp": "351",
            "basemoney": "363",
            "maxluck": 844
        },
        {
            "id": 152,
            "jobname": "order_troops",
            "baseexp": "371",
            "basemoney": "342",
            "maxluck": 385
        },
        {
            "id": 153,
            "jobname": "hunt_aligators",
            "baseexp": "385",
            "basemoney": "345",
            "maxluck": 237
        },
        {
            "id": 154,
            "jobname": "destille_alkohol",
            "baseexp": "326",
            "basemoney": "385",
            "maxluck": 534
        },
        {
            "id": 155,
            "jobname": "trading_office",
            "baseexp": "294",
            "basemoney": "360",
            "maxluck": 1708
        },
        {
            "id": 156,
            "jobname": "craft_dynamite",
            "baseexp": "311",
            "basemoney": "389",
            "maxluck": 952
        },
        {
            "id": 157,
            "jobname": "lead_expedition",
            "baseexp": "343",
            "basemoney": "371",
            "maxluck": 1249
        },
        {
            "id": 158,
            "jobname": "work_wells_fargo",
            "baseexp": "331",
            "basemoney": "365",
            "maxluck": 1560
        },
        {
            "id": 159,
            "jobname": "work_pinkerton_agent",
            "baseexp": "356",
            "basemoney": "379",
            "maxluck": 831
        },
        {
            "id": 160,
            "jobname": "explore_west",
            "baseexp": "348",
            "basemoney": "374",
            "maxluck": 1560
        },
        {
            "id": 161,
            "jobname": "setting_traps",
            "baseexp": "348",
            "basemoney": "393",
            "maxluck": 1789
        },
        {
            "id": 162,
            "jobname": "picking_herbs",
            "baseexp": "326",
            "basemoney": "383",
            "maxluck": 979
        },
        {
            "id": 163,
            "jobname": "picking_carrots",
            "baseexp": "330",
            "basemoney": "376",
            "maxluck": 750
        },
        {
            "id": 164,
            "jobname": "reporter",
            "baseexp": "337",
            "basemoney": "387",
            "maxluck": 1155
        },
        {
            "id": 165,
            "jobname": "ticket_agent",
            "baseexp": "350",
            "basemoney": "381",
            "maxluck": 1087
        },
        {
            "id": 166,
            "jobname": "general_store",
            "baseexp": "344",
            "basemoney": "389",
            "maxluck": 1411
        },
        {
            "id": 167,
            "jobname": "tailor",
            "baseexp": "338",
            "basemoney": "393",
            "maxluck": 1249
        },
        {
            "id": 168,
            "jobname": "gunsmith",
            "baseexp": "346",
            "basemoney": "397",
            "maxluck": 1317
        },
        {
            "id": 169,
            "jobname": "office",
            "baseexp": "336",
            "basemoney": "387",
            "maxluck": 1411
        },
        {
            "id": 170,
            "jobname": "judge",
            "baseexp": "354",
            "basemoney": "383",
            "maxluck": 1573
        },
        {
            "id": 171,
            "jobname": "barber",
            "baseexp": "345",
            "basemoney": "401",
            "maxluck": 1384
        },
        {
            "id": 172,
            "jobname": "hunting_rabbits",
            "baseexp": "348",
            "basemoney": "397",
            "maxluck": 1222
        },
        {
            "id": 173,
            "jobname": "historian",
            "baseexp": "336",
            "basemoney": "383",
            "maxluck": 1560
        },
        {
            "id": 174,
            "jobname": "doctor",
            "baseexp": "347",
            "basemoney": "413",
            "maxluck": 1425
        },
        {
            "id": 175,
            "jobname": "stealing_cattle",
            "baseexp": "355",
            "basemoney": "410",
            "maxluck": 1128
        },
        {
            "id": 176,
            "jobname": "maple_tapping",
            "baseexp": "357",
            "basemoney": "375",
            "maxluck": 1101
        },
        {
            "id": 177,
            "jobname": "lawyer",
            "baseexp": "378",
            "basemoney": "410",
            "maxluck": 1263
        },
        {
            "id": 178,
            "jobname": "banker",
            "baseexp": "361",
            "basemoney": "423",
            "maxluck": 1290
        },
        {
            "id": 179,
            "jobname": "train_mechanic",
            "baseexp": "352",
            "basemoney": "436",
            "maxluck": 2100
        },
        {
            "id": 180,
            "jobname": "cook",
            "baseexp": "396",
            "basemoney": "383",
            "maxluck": 1394
        },
        {
            "id": 181,
            "jobname": "stealing_food_supplies",
            "baseexp": "389",
            "basemoney": "397",
            "maxluck": 1762
        },
        {
            "id": 182,
            "jobname": "selling_horses",
            "baseexp": "375",
            "basemoney": "425",
            "maxluck": 1128
        },
        {
            "id": 183,
            "jobname": "building_chests",
            "baseexp": "347",
            "basemoney": "422",
            "maxluck": 858
        },
        {
            "id": 184,
            "jobname": "nickel_mining",
            "baseexp": "373",
            "basemoney": "435",
            "maxluck": 1074
        },
        {
            "id": 185,
            "jobname": "bandit_leader",
            "baseexp": "398",
            "basemoney": "425",
            "maxluck": 2437
        },
        {
            "id": 186,
            "jobname": "stud_farmer",
            "baseexp": "367",
            "basemoney": "375",
            "maxluck": 1411
        },
        {
            "id": 187,
            "jobname": "bartender",
            "baseexp": "397",
            "basemoney": "411",
            "maxluck": 1897
        },
        {
            "id": 188,
            "jobname": "vet",
            "baseexp": "376",
            "basemoney": "394",
            "maxluck": 1074
        },
        {
            "id": 189,
            "jobname": "beekeeper",
            "baseexp": "393",
            "basemoney": "446",
            "maxluck": 709
        },
        {
            "id": 190,
            "jobname": "stealing_from_merchants",
            "baseexp": "377",
            "basemoney": "419",
            "maxluck": 2032
        },
        {
            "id": 191,
            "jobname": "picking_mushrooms",
            "baseexp": "358",
            "basemoney": "390",
            "maxluck": 1857
        },
        {
            "id": 192,
            "jobname": "build_teepees",
            "baseexp": "407",
            "basemoney": "399",
            "maxluck": 1101
        },
        {
            "id": 193,
            "jobname": "archaeologist",
            "baseexp": "353",
            "basemoney": "394",
            "maxluck": 2572
        },
        {
            "id": 194,
            "jobname": "building_boats",
            "baseexp": "385",
            "basemoney": "401",
            "maxluck": 1384
        },
        {
            "id": 195,
            "jobname": "ice_cutting",
            "baseexp": "375",
            "basemoney": "397",
            "maxluck": 979
        },
        {
            "id": 196,
            "jobname": "fur_trader",
            "baseexp": "395",
            "basemoney": "418",
            "maxluck": 1654
        },
        {
            "id": 197,
            "jobname": "make_campfire",
            "baseexp": "384",
            "basemoney": "410",
            "maxluck": 1209
        },
        {
            "id": 198,
            "jobname": "hunting_bulls",
            "baseexp": "343",
            "basemoney": "413",
            "maxluck": 1897
        },
        {
            "id": 199,
            "jobname": "rob_gold_digger",
            "baseexp": "398",
            "basemoney": "465",
            "maxluck": 2437
        },
        {
            "id": 200,
            "jobname": "cartographer",
            "baseexp": "400",
            "basemoney": "448",
            "maxluck": 1452
        },
        {
            "id": 201,
            "jobname": "hunting_antelopes",
            "baseexp": "409",
            "basemoney": "431",
            "maxluck": 1573
        },
        {
            "id": 202,
            "jobname": "rob_gun_salesman",
            "baseexp": "417",
            "basemoney": "454",
            "maxluck": 2505
        },
        {
            "id": 203,
            "jobname": "rain_dance",
            "baseexp": "390",
            "basemoney": "480",
            "maxluck": 1762
        },
        {
            "id": 204,
            "jobname": "coroner",
            "baseexp": "404",
            "basemoney": "470",
            "maxluck": 1965
        },
        {
            "id": 205,
            "jobname": "hunting_foxes",
            "baseexp": "417",
            "basemoney": "477",
            "maxluck": 2100
        }
    ]
}