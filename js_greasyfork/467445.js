// ==UserScript==
// @name		League IVs Hunter 2
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @include	    https://nycpokemap.com*
// @include	    https://sydneypogomap.com*
// @include	    https://vanpokemap.com*
// @include	    https://sgpokemap.com*
// @include     https://londonpogomap.com*
// @exclude		https://nycpokemap.com/gym*
// @exclude		https://nycpokemap.com/quest*
// @exclude		https://sydneypogomap.com/gym*
// @exclude		https://sydneypogomap.com/quest*
// @exclude		https://vanpokemap.com/gym*
// @exclude		https://vanpokemap.com/quest*
// @exclude		https://sgpokemap.com/gym*
// @exclude		https://sgpokemap.com/quest*
// @exclude		https://londonpogomap.com/gym*
// @exclude		https://londonpogomap.com/quest*
// @grant		none
// @version		203
// @license		MIT
// @description         IVS FOR POGO
// @namespace           https://greasyfork.org/users/1014389
// @downloadURL https://update.greasyfork.org/scripts/467445/League%20IVs%20Hunter%202.user.js
// @updateURL https://update.greasyfork.org/scripts/467445/League%20IVs%20Hunter%202.meta.js
// ==/UserScript==


function indexOfPokemons(pokemon, pokemons) {
    if (!showPokemon(pokemon)) {
        return 0;
    } else {
        for (var i = 0; i < pokemons.length; ++i) {
            var currentPokemon = pokemons[i];
            if (pokemon.isEqual(currentPokemon)) {
                return i;
            }
        }
    }
    return -1;
}

function refreshPokemons() {

    var PokeInfo = [
        {ids:1,batk:118,bdef:111,bsta:128,batk2:198,bdef2:189,bsta2:190,league1:1,league2:1,league3:1,statp1:364.3,statp2:1821.7,statp3:3947.2,forms:0,genders:0},      //Bulba
        //{ids:4,batk:116,bdef:93,bsta:118,batk2:223,bdef2:173,bsta2:186,league1:1,league2:1,league3:1,statp1:347.2,statp2:1673.2,statp3:3624.8,forms:0,genders:0},       //Charmander
        //{ids:7,batk:94,bdef:121,bsta:127,batk2:171,bdef2:207,bsta2:188,league1:1,league2:0,league3:0,statp1:418.8,statp2:1998.2,statp3:4329.9,forms:0,genders:0},       //Squirtle
        {ids:13,batk:63,bdef:50,bsta:120,batk2:169,bdef2:130,bsta2:163,league1:0,league2:1,league3:0,statp1:0,statp2:1753.2,statp3:0,forms:0,genders:0},                //Weedle
        //{ids:18,batk:166,bdef:154,bsta:195,batk2:166,bdef2:154,bsta2:195,league1:0,league2:1,league3:0,statp1:0,statp2:1910.6,statp3:0,forms:0,genders:0},              //Pidgeot
        //{ids:27,batk:125,bdef:129,bsta:137,batk2:177,bdef2:195,bsta2:181,league1:1,league2:0,league3:0,statp1:371.9,statp2:0,statp3:0,forms:52,genders:0}, //Alolan Sandshrew
        //{ids:29,batk:86,bdef:89,bsta:146,batk2:180,bdef2:173,bsta2:207,league1:1,league2:1,league3:1,statp1:419.8,statp2:1910.6,statp3:4137.2,forms:0,genders:0},       //NidoranF
        {ids:31,batk:180,bdef:173,bsta:207,batk2:180,bdef2:173,bsta2:207,league1:0,league2:1,league3:1,statp1:0,statp2:1906.3,statp3:4128.5,forms:0,genders:0}, //Nidoqueen
        {ids:34,batk:204,bdef:156,bsta:191,batk2:204,bdef2:156,bsta2:191,league1:0,league2:1,league3:1,statp1:0,statp2:1714.7,statp3:3714.1,forms:0,genders:0}, //Nidoking
        {ids:35,batk:107,bdef:108,bsta:172,batk2:178,bdef2:162,bsta2:216,league1:0,league2:1,league3:1,statp1:0,statp2:1911.3,statp3:4136.4,forms:0,genders:0},         //Clefairy
        //{ids:37,batk:96,bdef:109,bsta:116,batk2:169,bdef2:190,bsta2:177,league1:0,league2:1,league3:0,statp1:393.8,statp2:1942.1,statp3:0,forms:0,genders:0},                //Vulpix
        //{ids:37,batk:96,bdef:109,bsta:116,batk2:170,bdef2:193,bsta2:177,league1:1,league2:0,league3:0,statp1:393.8,statp2:1943.3,statp3:0,forms:56,genders:0},          //Alolan Vulpix
        {ids:39,batk:80,bdef:41,bsta:251,batk2:156,bdef2:90,bsta2:295,league1:0,league2:1,league3:0,statp1:0,statp2:1935.6,statp3:0,forms:0,genders:0},                 //Jigglypuff
        {ids:41,batk:83,bdef:73,bsta:120,batk2:161,bdef2:150,bsta2:181,league1:1,league2:1,league3:0,statp1:393.4,statp2:1897.3,statp3:0,forms:0,genders:0},            //Zubat
        {ids:41,batk:83,bdef:73,bsta:120,batk2:194,bdef2:178,bsta2:198,league1:0,league2:1,league3:1,statp1:0,statp2:1832.7,statp3:3972.3,forms:0,genders:0},           //Crobat
        {ids:43,batk:131,bdef:112,bsta:128,batk2:0,bdef2:0,bsta2:0,league1:1,league2:0,league3:0,statp1:346.7,statp2:0,statp3:0,forms:0,genders:0},                     //Oddish
        {ids:52,batk:115,bdef:92,bsta:137,batk2:195,bdef2:162,bsta2:172,league1:1,league2:1,league3:1,statp1:359.9,statp2:1731.3,statp3:3732.6,forms:2335,genders:0},   //Meowth (Galarian)
        {ids:54,batk:122,bdef:95,bsta:137,batk2:191,bdef2:162,bsta2:190,league1:1,league2:1,league3:1,statp1:350.4,statp2:1784.9,statp3:3868.3,forms:0,genders:0},
        //{ids:56,batk:148,bdef:82,bsta:120,batk2:220,bdef2:178,bsta2:242,league1:1,league2:0,league3:0,statp1:300.2,statp2:1805.5,statp3:3896.7,forms:0,genders:0},      //Mankey
        {ids:58,batk:136,bdef:93,bsta:146,batk2:227,bdef2:166,bsta2:207,league1:1,league2:1,league3:1,statp1:336.6,statp2:1684.6,statp3:3649.7,forms:0,genders:0},      //Growlithe
        {ids:58,batk:142,bdef:92,bsta:155,batk2:232,bdef2:165,bsta2:216,league1:1,league2:1,league3:1,statp1:332.5,statp2:1680.1,statp3:3633.8,forms:2792,genders:0},   //Hisuian Growlithe
        //{ids:60,batk:101,bdef:82,bsta:120,batk2:182,bdef2:184,bsta2:207,league1:1,league2:1,league3:1,statp1:363.9,statp2:1928,statp3:4177,forms:0,genders:0},          //Poliwag
        //{ids:60,batk:101,bdef:82,bsta:120,batk2:174,bdef2:179,bsta2:207,league1:0,league2:1,league3:1,statp1:0,statp2:1960.3,statp3:4243.2,forms:0,genders:0},          //Politoed
        {ids:72,batk:97,bdef:149,bsta:120,batk2:166,bdef2:209,bsta2:190,league1:1,league2:1,league3:1,statp1:423.8,statp2:2038.3,statp3:4397.9,forms:0,genders:0},      //Tentacool
        //{ids:77,batk:170,bdef:127,bsta:137,batk2:207,bdef2:162,bsta2:163,league1:1,league2:1,league3:1,statp1:317.1,statp2:1658.6,statp3:3592.8,forms:0,genders:0},     //Ponyta
        //{ids:77,batk:170,bdef:127,bsta:137,batk2:207,bdef2:162,bsta2:163,league1:1,league2:1,league3:1,statp1:317.1,statp2:1658.6,statp3:3592.8,forms:2336,genders:0},  //Galarian Ponyta
        {ids:86,batk:85,bdef:121,bsta:163,batk2:139,bdef2:177,bsta2:207,league1:1,league2:0,league3:0,statp1:464,statp2:2189.4,statp3:0,forms:0,genders:0}, //Seel
        {ids:88,batk:135,bdef:90,bsta:190,batk2:190,bdef2:172,bsta2:233,league1:1,league2:1,league3:1,statp1:355,statp2:1904.4,statp3:4125.9,forms:0,genders:0}, //Grimer
        {ids:88,batk:135,bdef:90,bsta:190,batk2:190,bdef2:172,bsta2:233,league1:0,league2:1,league3:1,statp1:355,statp2:1904.4,statp3:4125.9,forms:74,genders:0}, //Alolan Grimer
        //{ids:94,batk:261,bdef:149,bsta:155,batk2:261,bdef2:149,bsta2:155,league1:0,league2:1,league3:1,statp1:0,statp2:1430.1,statp3:3099.9,forms:0,genders:0}, //Gengar
        //{ids:95,batk:85,bdef:232,bsta:111,batk2:148,bdef2:272,bsta2:181,league1:1,league2:0,league3:0,statp1:493.4,statp2:2269.6,statp3:4878.3,forms:0,genders:0}, //Onix
        {ids:96,batk:89,bdef:136,bsta:155,batk2:144,bdef2:193,bsta2:198,league1:1,league2:0,league3:0,statp1:459.4,statp2:2170.7,statp3:0,forms:0,genders:0}, //Drowzee
        {ids:100,batk:109,bdef:111,bsta:120,batk2:176,bdef2:176,bsta2:155,league1:0,league2:1,league3:0,statp1:372.3,statp2:1808.4,statp3:0,forms:2728,genders:0}, //Hisiuan Voltorb
        {ids:104,batk:90,bdef:144,bsta:137,batk2:144,bdef2:186,bsta2:155,league1:1,league2:1,league3:0,statp1:450.4,statp2:2037.8,statp3:0,forms:0,genders:0}, //Cubone
        //{ids:108,batk:108,bdef:137,bsta:207,batk2:161,bdef2:181,bsta2:242,league1:1,league2:0,league3:0,statp1:446.8,statp2:2119.7,statp3:4591.4,forms:0,genders:0}, //Lickitung
        //{ids:113,batk:60,bdef:128,bsta:487,batk2:129,bdef2:169,bsta2:496,league1:0,league2:1,league3:1,statp1:0,statp2:2794.3,statp3:6041.8,forms:0,genders:0},
        {ids:116,batk:129,bdef:103,bsta:102,batk2:194,bdef2:194,bsta2:181,league1:1,league2:1,league3:1,statp1:325.6,statp2:1830.6,statp3:3968.5,forms:0,genders:0}, //Horsea
        {ids:118,batk:123,bdef:110,bsta:128,batk2:175,bdef2:147,bsta2:190,league1:0,league2:1,league3:0,statp1:356.2,statp2:1828.7,statp3:0,forms:0,genders:0}, //Goldeen
        {ids:123,batk:218,bdef:170,bsta:172,batk2:218,bdef2:170,bsta2:172,league1:0,league2:1,league3:0,statp1:314.9,statp2:1654.9,statp3:3494.8,forms:0,genders:0}, //Scyther
        {ids:123,batk:218,bdef:170,bsta:172,batk2:236,bdef2:181,bsta2:172,league1:1,league2:1,league3:0,statp1:314.9,statp2:1612.8,statp3:3494.8,forms:0,genders:0}, //Scizor
        //{ids:123,batk:218,bdef:170,bsta:172,batk2:253,bdef2:174,bsta2:172,league1:0,league2:1,league3:0,statp1:0,statp2:1542,statp3:3335.3,forms:0,genders:0}, //Kleavor
        {ids:131,batk:165,bdef:174,bsta:277,batk2:165,bdef2:174,bsta2:277,league1:0,league2:1,league3:1,statp1:0,statp2:2144.8,statp3:4642.4,forms:0,genders:0}, //Lapras
        //{ids:137,batk:153,bdef:136,bsta:163,batk2:198,bdef2:180,bsta2:198,league1:0,league2:0,league3:1,statp1:353.1,statp2:1813.6,statp3:3929.5,forms:0,genders:0}, //Porygon2
        //{ids:137,batk:153,bdef:136,bsta:163,batk2:264,bdef2:150,bsta2:198,league1:0,league2:1,league3:0,statp1:353.1,statp2:1510.5,statp3:3252.4,forms:0,genders:0}, //PorygonZ
        //{ids:143,batk:190,bdef:169,bsta:330,batk2:190,bdef2:169,bsta2:330,league1:0,league2:1,league3:1,statp1:0,statp2:2072,statp3:4465.5,forms:0,genders:0}, //Snorlax
        //{ids:147,batk:119,bdef:91,bsta:121,batk2:263,bdef2:198,bsta2:209,league1:1,league2:1,league3:1,statp1:343.2,statp2:1631.7,statp3:3525.5,forms:0,genders:0}, //Dratini
        //{ids:158,batk:117,bdef:109,bsta:137,batk2:205,bdef2:188,bsta2:198,league1:1,league2:1,league3:1,statp1:372,statp2:1812,statp3:3924,forms:0,genders:0}, //Totodile
        {ids:165,batk:72,bdef:118,bsta:120,batk2:107,bdef2:179,bsta2:146,league1:1,league2:0,league3:0,statp1:467.4,statp2:2181.6,statp3:0,forms:0,genders:0}, //Ledyba
        {ids:170,batk:106,bdef:97,bsta:181,batk2:146,bdef2:137,bsta2:268,league1:1,league2:1,league3:0,statp1:404.4,statp2:2141.6,statp3:0,forms:0,genders:0}, //Chinchou
        //{ids:179,batk:114,bdef:79,bsta:146,batk2:211,bdef2:169,bsta2:207,league1:0,league2:1,league3:0,statp1:355.1,statp2:1755.3,statp3:3802.2,forms:0,genders:0}, //Mareep
        //{ids:181,batk:211,bdef:169,bsta:207,batk2:211,bdef2:169,bsta2:207,league1:0,league2:0,league3:1,statp1:0,statp2:0,statp3:3802.2,forms:0,genders:0}, //Ampharos
        //{ids:194,batk:75,bdef:66,bsta:146,batk2:152,bdef2:143,bsta2:216,league1:1,league2:1,league3:0,statp1:427.1,statp2:2020.2,statp3:0,forms:0,genders:0}, //Wooper
        //{ids:194,batk:75,bdef:66,bsta:146,batk2:127,bdef2:151,bsta2:277,league1:1,league2:1,league3:0,statp1:427.1,statp2:2382.1,statp3:0,forms:3009,genders:0}, //Paldean Wooper
        {ids:204,batk:108,bdef:122,bsta:137,batk2:161,bdef2:205,bsta2:181,league1:1,league2:1,league3:1,statp1:395.4,statp2:2036.7,statp3:4270.8,forms:0,genders:0}, //Pineco
        {ids:206,batk:131,bdef:128,bsta:225,batk2:131,bdef2:128,bsta2:225,league1:0,league2:1,league3:0,statp1:0,statp2:2143.3,statp3:0,forms:0,genders:0}, //Dunsparce
        //{ids:207,batk:163,bdef:143,bsta:184,batk2:163,bdef2:143,bsta2:184,league1:1,league2:1,league3:0,statp1:392.8,statp2:2064.1,statp3:0,forms:0,genders:0}, //Gligar
        //{ids:215,batk:189,bdef:146,bsta:146,batk2:243,bdef2:171,bsta2:172,league1:1,league2:0,league3:0,statp1:314.8,statp2:1568.3,statp3:3400.6,forms:0,genders:0}, //Sneasel
        {ids:215,batk:189,bdef:146,bsta:146,batk2:259,bdef2:158,bsta2:190,league1:1,league2:0,league3:0,statp1:314.8,statp2:1526.8,statp3:3298.8,forms:2794,genders:0}, //Hisuian Sneasel
        {ids:215,batk:189,bdef:146,bsta:146,batk2:189,bdef2:146,bsta2:146,league1:0,league2:1,league3:0,statp1:314.8,statp2:1651.8,statp3:3298.8,forms:2794,genders:0}, //Hisuian Sneasel
        {ids:218,batk:118,bdef:71,bsta:120,batk2:139,bdef2:191,bsta2:137,league1:1,league2:1,league3:0,statp1:326.2,statp2:2029.5,statp3:0,forms:0,genders:0}, //Slugma
        //{ids:226,batk:148,bdef:226,bsta:163,batk2:148,bdef2:226,bsta2:163,league1:0,league2:1,league3:0,statp1:0,statp2:2120.9,statp3:0,forms:0,genders:0}, //Mantine
        {ids:228,batk:152,bdef:83,bsta:128,batk2:224,bdef2:144,bsta2:181,league1:1,league2:1,league3:1,statp1:301.3,statp2:1589.4,statp3:3445.5,forms:0,genders:0}, //Houndour
        {ids:229,batk:224,bdef:144,bsta:181,batk2:224,bdef2:144,bsta2:181,league1:0,league2:1,league3:1,statp1:0,statp2:1589.3,statp3:3445.2,forms:0,genders:0}, //Houndoom
        {ids:231,batk:107,bdef:98,bsta:207,batk2:214,bdef2:185,bsta2:207,league1:1,league2:1,league3:1,statp1:416.9,statp2:1778.6,statp3:3854.1,forms:0,genders:0}, //Phanpy
        {ids:257,batk:240,bdef:141,bsta:190,batk2:240,bdef2:141,bsta2:190,league1:0,league2:1,league3:1,statp1:0,statp2:1546,statp3:3350,forms:0,genders:0}, //Blaziken
        {ids:261,batk:96,bdef:61,bsta:111,batk2:171,bdef2:132,bsta2:172,league1:1,league2:1,league3:0,statp1:345.8,statp2:1767.4,statp3:0,forms:0,genders:0}, //Poochyena
        //{ids:263,batk:58,bdef:80,bsta:116,batk2:58,bdef2:80,bsta2:116,league1:1,league2:0,league3:0,statp1:440,statp2:0,statp3:0,forms:946,genders:0}, //Galarian Zigzagoon
        {ids:270,batk:71,bdef:77,bsta:120,batk2:173,bdef2:176,bsta2:190,league1:0,league2:1,league3:1,statp1:430.6,statp2:1917.4,statp3:4065.3,forms:0,genders:0}, //Lotad
        {ids:278,batk:106,bdef:61,bsta:120,batk2:175,bdef2:174,bsta2:155,league1:1,league2:1,league3:0,statp1:333.9,statp2:1813.9,statp3:0,forms:0,genders:0}, //Wingull
        {ids:287,batk:104,bdef:92,bsta:155,batk2:159,bdef2:145,bsta2:190,league1:0,league2:1,league3:0,statp1:0,statp2:1915.2,statp3:0,forms:0,genders:0},
        {ids:299,batk:82,bdef:215,bsta:102,batk2:135,bdef2:275,bsta2:155,league1:1,league2:0,league3:0,statp1:484,statp2:2301.7,statp3:0,forms:0,genders:0}, //Nosepass
        {ids:320,batk:136,bdef:68,bsta:277,batk2:175,bdef2:87,bsta2:347,league1:1,league2:1,league3:1,statp1:366.3,statp2:1881.9,statp3:3979,forms:0,genders:0}, //Wailmer
        {ids:320,batk:136,bdef:68,bsta:277,batk2:136,bdef2:68,bsta2:277,league1:0,league2:1,league3:0,statp1:0,statp2:1920.4,statp3:0,forms:0,genders:0}, //Wailmer
        {ids:322,batk:119,bdef:79,bsta:155,batk2:194,bdef2:136,bsta2:172,league1:1,league2:1,league3:0,statp1:352.2,statp2:1667.2,statp3:0,forms:0,genders:0}, //Numel
        {ids:333,batk:76,bdef:132,bsta:128,batk2:141,bdef2:201,bsta2:181,league1:1,league2:1,league3:0,statp1:473,statp2:2168.2,statp3:0,forms:0,genders:0}, //Swablu
        {ids:335,batk:222,bdef:124,bsta:177,batk2:222,bdef2:124,bsta2:177,league1:1,league2:1,league3:1,statp1:293.1,statp2:1537.4,statp3:3327.7,forms:0,genders:0}, //Zangoose
        {ids:339,batk:93,bdef:82,bsta:137,batk2:151,bdef2:141,bsta2:242,league1:1,league2:1,league3:0,statp1:390.5,statp2:2068.2,statp3:0,forms:0,genders:0}, //Barboach
        {ids:343,batk:77,bdef:124,bsta:120,batk2:140,bdef2:229,bsta2:155,league1:0,league2:1,league3:1,statp1:456.7,statp2:2166.5,statp3:3727.5,forms:0,genders:0}, //Baltoy
        //{ids:349,batk:29,bdef:85,bsta:85,batk2:192,bdef2:219,bsta2:216,league1:0,league2:1,league3:0,statp1:0,statp2:1975.4,statp3:0,forms:0,genders:0}, //Feebas
        //{ids:355,batk:70,bdef:162,bsta:85,batk2:180,bdef2:254,bsta2:128,league1:1,league2:1,league3:1,statp1:473.1,statp2:1866.3,statp3:4024.4,forms:0,genders:0}, //Duskull
        //{ids:351,batk:139,bdef:139,bsta:172,batk2:139,bdef2:139,bsta2:172,league1:1,league2:1,league3:0,statp1:376.6,statp2:1980.4,statp3:0,forms:0,genders:0}, //Castform
        //{ids:351,batk:139,bdef:139,bsta:172,batk2:139,bdef2:139,bsta2:172,league1:1,league2:1,league3:0,statp1:376.6,statp2:1980.4,statp3:0,forms:30,genders:0}, //Castform fire
        {ids:351,batk:139,bdef:139,bsta:172,batk2:139,bdef2:139,bsta2:172,league1:1,league2:1,league3:0,statp1:376.6,statp2:1980.4,statp3:0,forms:31,genders:0}, //Castform water
        {ids:351,batk:139,bdef:139,bsta:172,batk2:139,bdef2:139,bsta2:172,league1:1,league2:1,league3:0,statp1:376.6,statp2:1980.4,statp3:0,forms:32,genders:0}, //Castform ice
        {ids:355,batk:70,bdef:162,bsta:85,batk2:124,bdef2:234,bsta2:120,league1:0,league2:1,league3:0,statp1:0,statp2:2187.3,statp3:0,forms:0,genders:0}, //Dusclops
        {ids:359,batk:246,bdef:120,bsta:163,batk2:246,bdef2:120,bsta2:163,league1:0,league2:1,league3:0,statp1:0,statp2:1421.1,statp3:3079.3,forms:0,genders:0}, //Absol
        {ids:393,batk:112,bdef:102,bsta:142,batk2:210,bdef2:186,bsta2:197,league1:1,league2:1,league3:0,statp1:376,statp2:1778.4,statp3:3849.5,forms:0,genders:0}, //Piplup
        {ids:403,batk:117,bdef:64,bsta:128,batk2:232,bdef2:156,bsta2:190,league1:0,league2:1,league3:1,statp1:323.8,statp2:1605.7,statp3:3479.9,forms:0,genders:0}, //Shinx
        //{ids:410,batk:76,bdef:195,bsta:102,batk2:94,bdef2:286,bsta2:155,league1:1,league2:1,league3:0,statp1:491.2,statp2:2779.8,statp3:0,forms:0,genders:0}, //Shieldon
        {ids:425,batk:117,bdef:80,bsta:207,batk2:117,bdef2:80,bsta2:207,league1:1,league2:1,league3:1,statp1:381.5,statp2:1870.7,statp3:4025,forms:0,genders:0}, //Drifloon
        {ids:434,batk:121,bdef:90,bsta:160,batk2:184,bdef2:132,bsta2:230,league1:1,league2:1,league3:1,statp1:360.6,statp2:1817.3,statp3:3920.7,forms:0,genders:0}, //Stunky
        //{ids:436,batk:43,bdef:154,bsta:149,batk2:161,bdef2:213,bsta2:167,league1:1,league2:1,league3:0,statp1:666,statp2:2017,statp3:0,forms:0,genders:0}, //Bronzor
        {ids:451,batk:93,bdef:151,bsta:120,batk2:180,bdef2:202,bsta2:172,league1:1,league2:1,league3:1,statp1:434.4,statp2:1896.5,statp3:4107.9,forms:0,genders:0}, //Skorupi
        {ids:453,batk:116,bdef:76,bsta:134,batk2:211,bdef2:133,bsta2:195,league1:1,league2:1,league3:1,statp1:342.4,statp2:1637.7,statp3:3549.1,forms:0,genders:0}, //Croagunk
        //{ids:460,batk:178,bdef:158,bsta:207,batk2:178,bdef2:158,bsta2:207,league1:0,league2:0,league3:1,statp1:0,statp2:1882.2,statp3:4023.3,forms:0,genders:0}, //Abomasnow
        {ids:529,batk:154,bdef:85,bsta:155,batk2:255,bdef2:129,bsta2:242,league1:1,league2:1,league3:1,statp1:313.7,statp2:1556.9,statp3:3361.9,forms:0,genders:0},
        {ids:530,batk:255,bdef:129,bsta:242,batk2:255,bdef2:129,bsta2:242,league1:1,league2:1,league3:1,statp1:298.4,statp2:1556.9,statp3:3361.9,forms:0,genders:0},
        //{ids:532,batk:134,bdef:87,bsta:181,batk2:243,bdef2:158,bsta2:233,league1:0,league2:1,league3:0,statp1:353.2,statp2:1661.2,statp3:3572.7,forms:0,genders:0}, //Timburr
        //{ids:532,batk:134,bdef:87,bsta:181,batk2:180,bdef2:134,bsta2:198,league1:0,league2:1,league3:0,statp1:0,statp2:1784.4,statp3:0,forms:0,genders:0}, //Gurdurr
        //{ids:540,batk:96,bdef:124,bsta:128,batk2:205,bdef2:165,bsta2:181,league1:1,league2:1,league3:1,statp1:416.8,statp2:1722.5,statp3:3728.5,forms:0,genders:0}, //Sewaddle
        //{ids:540,batk:96,bdef:124,bsta:128,batk2:115,bdef2:162,bsta2:146,league1:0,league2:1,league3:0,statp1:0,statp2:2082.3,statp3:0,forms:0,genders:0},  //Swadloon
        {ids:543,batk:83,bdef:99,bsta:102,batk2:203,bdef2:175,bsta2:155,league1:1,league2:1,league3:0,statp1:403.8,statp2:1685,statp3:0,forms:0,genders:0}, //Venipede
        {ids:546,batk:71,bdef:111,bsta:120,batk2:164,bdef2:176,bsta2:155,league1:1,league2:1,league3:0,statp1:466.3,statp2:1879.4,statp3:0,forms:0,genders:0}, //Cottonee
        //{ids:554,batk:153,bdef:86,bsta:172,batk2:263,bdef2:114,bsta2:233,league1:0,league2:1,league3:0,statp1:323.6,statp2:1477.8,statp3:3196.5,forms:2341,genders:0}, //G. Darumaka
        {ids:557,batk:118,bdef:128,bsta:137,batk2:188,bdef2:200,bsta2:172,league1:1,league2:1,league3:1,statp1:382.5,statp2:1851.1,statp3:4011.5,forms:0,genders:0}, //Dwebble
        {ids:559,batk:132,bdef:132,bsta:137,batk2:163,bdef2:222,bsta2:163,league1:1,league2:1,league3:0,statp1:363.6,statp2:2013.4,statp3:0,forms:0,genders:0}, //Scraggy
        {ids:562,batk:95,bdef:141,bsta:116,batk2:163,bdef2:237,bsta2:151,league1:1,league2:1,league3:1,statp1:419.7,statp2:2006.4,statp3:4200.3,forms:0,genders:0}, //Yamask
        {ids:574,batk:98,bdef:112,bsta:128,batk2:176,bdef2:205,bsta2:172,league1:1,league2:1,league3:1,statp1:367.1,statp2:1919.5,statp3:4156,forms:0,genders:0}, //Gothita
        {ids:577,batk:170,bdef:83,bsta:128,batk2:214,bdef2:148,bsta2:242,league1:1,league2:1,league3:1,statp1:283.5,statp2:1750.6,statp3:3790.3,forms:0,genders:0},
        {ids:582,batk:118,bdef:106,bsta:113,batk2:218,bdef2:184,bsta2:174,league1:0,league2:1,league3:0,statp1:350.5,statp2:1689.6,statp3:3662.5,forms:0,genders:0},
        {ids:588,batk:137,bdef:87,bsta:137,batk2:223,bdef2:187,bsta2:172,league1:1,league2:1,league3:1,statp1:325.6,statp2:1671.7,statp3:3623.2,forms:0,genders:0}, //Karrablast
        {ids:592,batk:115,bdef:134,bsta:146,batk2:159,bdef2:178,bsta2:225,league1:1,league2:1,league3:1,statp1:397.1,statp2:2088.7,statp3:4429.1,forms:0,genders:0}, //Frillish
        {ids:597,batk:82,bdef:155,bsta:127,batk2:158,bdef2:223,bsta2:179,league1:1,league2:1,league3:1,statp1:471.2,statp2:2091.4,statp3:4418,forms:0,genders:0}, //Ferroseed
        {ids:602,batk:105,bdef:78,bsta:111,batk2:217,bdef2:152,bsta2:198,league1:1,league2:1,league3:1,statp1:348.5,statp2:1678,statp3:3631,forms:0,genders:0}, //Tynamo
        {ids:602,batk:105,bdef:78,bsta:111,batk2:156,bdef2:130,bsta2:163,league1:0,league2:1,league3:0,statp1:0,statp2:1832.9,statp3:0,forms:0,genders:0}, //Eelectrik
        //{ids:610,batk:154,bdef:101,bsta:130,batk2:284,bdef2:172,bsta2:183,league1:1,league2:1,league3:1,statp1:313,statp2:1473.8,statp3:3182.6,forms:0,genders:0}, //Axew
        //{ids:610,batk:154,bdef:101,bsta:130,batk2:212,bdef2:123,bsta2:165,league1:0,league2:1,league3:0,statp1:0,statp2:1544.1,statp3:0,forms:0,genders:0}, //Fraxure
        {ids:616,batk:72,bdef:140,bsta:137,batk2:220,bdef2:120,bsta2:190,league1:1,league2:1,league3:1,statp1:500.1,statp2:1557.6,statp3:3375.5,forms:0,genders:0}, //Shelmet
        {ids:618,batk:144,bdef:171,bsta:240,batk2:144,bdef2:171,bsta2:240,league1:1,league2:1,league3:0,statp1:421.9,statp2:2209.5,statp3:0,forms:0,genders:0}, //Stunfisk
        //{ids:624,batk:154,bdef:114,bsta:128,batk2:232,bdef2:176,bsta2:163,league1:1,league2:1,league3:1,statp1:302.5,statp2:1593.5,statp3:3452.5,forms:0,genders:0}, //Pawniard & Bisharp
        {ids:624,batk:154,bdef:114,bsta:128,batk2:238,bdef2:203,bsta2:225,league1:1,league2:0,league3:0,statp1:320,statp2:1755.9,statp3:3786,forms:0,genders:0}, //Kingambit
        {ids:633,batk:116,bdef:93,bsta:141,batk2:159,bdef2:135,bsta2:176,league1:1,league2:1,league3:0,statp1:361.7,statp2:1856.6,statp3:0,forms:0,genders:0}, //Deino
        //{ids:653,batk:116,bdef:102,bsta:120,batk2:230,bdef2:189,bsta2:181,league1:0,league2:1,league3:0,statp1:355.7,statp2:1670.8,statp3:3619,forms:0,genders:0}, //Fennekin
        {ids:656,batk:122,bdef:84,bsta:121,batk2:223,bdef2:152,bsta2:176,league1:0,league2:1,league3:0,statp1:333.2,statp2:1602.7,statp3:3473.3,forms:0,genders:0}, //Froakie
        {ids:661,batk:95,bdef:80,bsta:128,batk2:176,bdef2:155,bsta2:186,league1:0,league2:1,league3:0,statp1:0,statp2:1837.1,statp3:0,forms:0,genders:0}, //Fletchling
        {ids:667,batk:139,bdef:112,bsta:158,batk2:221,bdef2:149,bsta2:200,league1:1,league2:1,league3:0,statp1:352.4,statp2:1652.1,statp3:0,forms:0,genders:0}, //Litleo
        //{ids:667,batk:139,bdef:112,bsta:158,batk2:139,bdef2:112,bsta2:158,league1:0,league2:1,league3:0,statp1:0,statp2:1818.5,statp3:0,forms:0,genders:0}, //Litleo
        {ids:669,batk:108,bdef:120,bsta:127,batk2:212,bdef2:244,bsta2:186,league1:1,league2:0,league3:0,statp1:385.4,statp2:1854.9,statp3:4006.5,forms:0,genders:0}, //Flabebe
        {ids:682,batk:110,bdef:113,bsta:186,batk2:173,bdef2:150,bsta2:226,league1:1,league2:1,league3:1,statp1:413.5,statp2:1926.5,statp3:4098.9,forms:0,genders:0}, //Spritzee
        {ids:684,batk:109,bdef:119,bsta:158,batk2:168,bdef2:163,bsta2:193,league1:1,league2:1,league3:0,statp1:404.5,statp2:1919.1,statp3:0,forms:0,genders:0}, //Swirlix
        {ids:686,batk:98,bdef:95,bsta:142,batk2:177,bdef2:165,bsta2:200,league1:1,league2:1,league3:1,statp1:396.4,statp2:1890.2,statp3:4045.4,forms:0,genders:0}, //Inkay
        {ids:690,batk:109,bdef:109,bsta:137,batk2:177,bdef2:207,bsta2:163,league1:1,league2:1,league3:1,statp1:383.9,statp2:1900.1,statp3:4083.9,forms:0,genders:0}, //Skrelp
        //{ids:629,batk:105,bdef:139,bsta:172,batk2:129,bdef2:205,bsta2:242,league1:0,league2:1,league3:0,statp1:0,statp2:2440.3,statp3:0,forms:0,genders:0},
        {ids:698,batk:124,bdef:109,bsta:184,batk2:186,bdef2:163,bsta2:265,league1:1,league2:1,league3:1,statp1:385.1,statp2:1966.6,statp3:4259,forms:0,genders:0}, //Amaura
        {ids:702,batk:164,bdef:134,bsta:167,batk2:164,bdef2:134,bsta2:167,league1:1,league2:1,league3:0,statp1:342.7,statp2:1802.5,statp3:0,forms:0,genders:0}, //Dedenne
        //{ids:704,batk:101,bdef:112,bsta:128,batk2:220,bdef2:242,bsta2:207,league1:1,league2:1,league3:1,statp1:394.9,statp2:1869.9,statp3:4034.1,forms:0,genders:0}, //Goomy
        {ids:708,batk:125,bdef:103,bsta:125,batk2:201,bdef2:154,bsta2:198,league1:1,league2:1,league3:1,statp1:346.5,statp2:1740.8,statp3:3771.9,forms:0,genders:0}, //Phantump
        {ids:710,batk:118,bdef:120,bsta:153,batk2:182,bdef2:200,bsta2:198,league1:1,league2:1,league3:1,statp1:386.8,statp2:1944.1,statp3:4213.6,forms:2644,genders:0},
        {ids:722,batk:102,bdef:99,bsta:169,batk2:210,bdef2:179,bsta2:186,league1:1,league2:0,league3:0,statp1:407.6,statp2:1737.6,statp3:3765.1,forms:0,genders:0}, //Rowlett
        //{ids:722,batk:102,bdef:99,bsta:169,batk2:213,bdef2:174,bsta2:204,league1:0,league2:1,league3:1,statp1:407.6,statp2:1753.3,statp3:3794.4,forms:0,genders:0}, //Hisuian Rowlet
        {ids:725,batk:128,bdef:79,bsta:128,batk2:214,bdef2:175,bsta2:216,league1:1,league2:1,league3:1,statp1:324.9,statp2:1774.9,statp3:3843.7,forms:0,genders:0}, //Litten
        {ids:725,batk:128,bdef:79,bsta:128,batk2:174,bdef2:103,bsta2:163,league1:0,league2:1,league3:0,statp1:0,statp2:1774.9,statp3:0,forms:0,genders:0}, //Torracat
        {ids:731,batk:136,bdef:59,bsta:111,batk2:222,bdef2:146,bsta2:190,league1:1,league2:1,league3:1,statp1:288,statp2:1623.1,statp3:3517.4,forms:0,genders:0},
        //{ids:736,batk:115,bdef:85,bsta:132,batk2:254,bdef2:158,bsta2:184,league1:1,league2:0,league3:0,statp1:350.7,statp2:1530.8,statp3:3310.5,forms:0,genders:0}, //Grubbin
        {ids:751,batk:72,bdef:117,bsta:116,batk2:126,bdef2:219,bsta2:169,league1:1,league2:1,league3:0,statp1:464,statp2:2312,statp3:0,forms:0,genders:0}, //Dewpider
        {ids:753,batk:100,bdef:64,bsta:120,batk2:192,bdef2:169,bsta2:172,league1:1,league2:1,league3:0,statp1:346.9,statp2:1762,statp3:0,forms:0,genders:0}, //Fomantis
        //{ids:761,batk:55,bdef:69,bsta:123,batk2:222,bdef2:195,bsta2:176,league1:0,league2:0,league3:1,statp1:438,statp2:1708,statp3:3699,forms:0,genders:0}, //Bounsweet
        {ids:765,batk:168,bdef:192,bsta:207,batk2:168,bdef2:192,bsta2:207,league1:0,league2:1,league3:1,statp1:0,statp2:2026.7,statp3:4388.7,forms:0,genders:0}, //Oranguru
        {ids:767,batk:67,bdef:74,bsta:93,batk2:218,bdef2:226,bsta2:181,league1:0,league2:1,league3:0,statp1:396.6,statp2:1783.9,statp3:3860.1,forms:0,genders:0}, //Wimpod
        //{ids:769,batk:120,bdef:118,bsta:146,batk2:178,bdef2:178,bsta2:198,league1:0,league2:1,league3:0,statp1:377.6,statp2:1913.5,statp3:4145.9,forms:0,genders:0},
        //{ids:775,batk:216,bdef:165,bsta:163,batk2:216,bdef2:165,bsta2:163,league1:1,league2:1,league3:1,statp1:313.2,statp2:1639.1,statp3:3543.7,forms:0,genders:0}, //Komala
        {ids:782,batk:102,bdef:108,bsta:128,batk2:222,bdef2:240,bsta2:181,league1:0,league2:1,league3:0,statp1:390,statp2:1800,statp3:3888,forms:0,genders:0}, //JangmoO
        {ids:819,batk:95,bdef:86,bsta:172,batk2:160,bdef2:156,bsta2:260,league1:1,league2:1,league3:1,statp1:411.9,statp2:2090.6,statp3:4463.1,forms:0,genders:0}, //Skwovet
        {ids:821,batk:88,bdef:67,bsta:116,batk2:163,bdef2:192,bsta2:221,league1:1,league2:1,league3:1,statp1:372.5,statp2:2091.3,statp3:4526.2,forms:0,genders:0},
        //{ids:831,batk:76,bdef:97,bsta:123,batk2:159,bdef2:198,bsta2:176,league1:1,league2:1,league3:0,statp1:443.4,statp2:2035.9,statp3:0,forms:0,genders:0}, //Wooloo
        //{ids:906,batk:116,bdef:99,bsta:120,batk2:233,bdef2:153,bsta2:183,league1:1,league2:1,league3:1,statp1:353.6,statp2:1585.1,statp3:3433.3,forms:0,genders:0}, //Sprigatito
        //{ids:906,batk:116,bdef:99,bsta:120,batk2:157,bdef2:128,bsta2:156,league1:0,league2:1,league3:0,statp1:353.6,statp2:1795.8,statp3:3433.3,forms:0,genders:0}, //Sprigatito
        //{ids:907,batk:157,bdef:128,bsta:156,batk2:233,bdef2:153,bsta2:183,league1:0,league2:1,league3:0,statp1:0,statp2:1585.1,statp3:3433.3,forms:0,genders:0},
        {ids:909,batk:112,bdef:96,bsta:167,batk2:207,bdef2:178,bsta2:232,league1:0,league2:0,league3:0,statp1:384.9,statp2:1842.6,statp3:3989.8,forms:0,genders:0},
        {ids:912,batk:120,bdef:86,bsta:146,batk2:236,bdef2:159,bsta2:198,league1:0,league2:1,league3:0,statp1:352.2,statp2:1619,statp3:3506.4,forms:0,genders:0},
        {ids:915,batk:81,bdef:79,bsta:144,batk2:169,bdef2:162,bsta2:251,league1:0,league2:1,league3:1,statp1:420.4,statp2:2035.3,statp3:4408.2,forms:0,genders:2}, //Lechonk
        {ids:919,batk:81,bdef:65,bsta:107,batk2:199,bdef2:144,bsta2:174,league1:1,league2:1,league3:1,statp1:378.9,statp2:1672.2,statp3:3556.9,forms:0,genders:0}, //Nymble
        {ids:921,batk:95,bdef:45,bsta:128,batk2:232,bdef2:141,bsta2:172,league1:0,league2:1,league3:0,statp1:336.9,statp2:1532.9,statp3:3322.5,forms:0,genders:0}, //Pawmi
        {ids:971,batk:105,bdef:106,bsta:137,batk2:186,bdef2:195,bsta2:176,league1:1,league2:1,league3:1,statp1:388.4,statp2:1861,statp3:4030.9,forms:0,genders:0},
        //{ids:996,batk:134,bdef:86,bsta:163,batk2:254,bdef2:168,bsta2:229,league1:0,league2:1,league3:0,statp1:341.7,statp2:1635.5,statp3:3530.3,forms:0,genders:0}, //Frigibax

    ];

    var CPMulti = [
        {lvl:1,cpx:0.094},
        {lvl:1.5,cpx:0.1351374318},
        {lvl:2,cpx:0.16639787},
        {lvl:2.5,cpx:0.192650919},
        {lvl:3,cpx:0.21573247},
        {lvl:3.5,cpx:0.2365726613},
        {lvl:4,cpx:0.25572005},
        {lvl:4.5,cpx:0.2735303812},
        {lvl:5,cpx:0.29024988},
        {lvl:5.5,cpx:0.3060573775},
        {lvl:6,cpx:0.3210876},
        {lvl:6.5,cpx:0.3354450362},
        {lvl:7,cpx:0.34921268},
        {lvl:7.5,cpx:0.3624577511},
        {lvl:8,cpx:0.3752356},
        {lvl:8.5,cpx:0.387592416},
        {lvl:9,cpx:0.39956728},
        {lvl:9.5,cpx:0.4111935514},
        {lvl:10,cpx:0.4225},
        {lvl:10.5,cpx:0.4329264091},
        {lvl:11,cpx:0.44310755},
        {lvl:11.5,cpx:0.4530599591},
        {lvl:12,cpx:0.4627984},
        {lvl:12.5,cpx:0.472336093},
        {lvl:13,cpx:0.48168495},
        {lvl:13.5,cpx:0.4908558003},
        {lvl:14,cpx:0.49985844},
        {lvl:14.5,cpx:0.508701765},
        {lvl:15,cpx:0.51739395},
        {lvl:15.5,cpx:0.5259425113},
        {lvl:16,cpx:0.5343543},
        {lvl:16.5,cpx:0.5426357375},
        {lvl:17,cpx:0.5507927},
        {lvl:17.5,cpx:0.5588305862},
        {lvl:18,cpx:0.5667545},
        {lvl:18.5,cpx:0.5745691333},
        {lvl:19,cpx:0.5822789},
        {lvl:19.5,cpx:0.5898879072},
        {lvl:20,cpx:0.5974},
        {lvl:20.5,cpx:0.6048236651},
        {lvl:21,cpx:0.6121573},
        {lvl:21.5,cpx:0.6194041216},
        {lvl:22,cpx:0.6265671},
        {lvl:22.5,cpx:0.6336491432},
        {lvl:23,cpx:0.64065295},
        {lvl:23.5,cpx:0.6475809666},
        {lvl:24,cpx:0.65443563},
        {lvl:24.5,cpx:0.6612192524},
        {lvl:25,cpx:0.667934},
        {lvl:25.5,cpx:0.6745818959},
        {lvl:26,cpx:0.6811649},
        {lvl:26.5,cpx:0.6876849038},
        {lvl:27,cpx:0.69414365},
        {lvl:27.5,cpx:0.70054287},
        {lvl:28,cpx:0.7068842},
        {lvl:28.5,cpx:0.7131691091},
        {lvl:29,cpx:0.7193991},
        {lvl:29.5,cpx:0.7255756136},
        {lvl:30,cpx:0.7317},
        {lvl:30.5,cpx:0.7347410093},
        {lvl:31,cpx:0.7377695},
        {lvl:31.5,cpx:0.7407855938},
        {lvl:32,cpx:0.74378943},
        {lvl:32.5,cpx:0.7467812109},
        {lvl:33,cpx:0.74976104},
        {lvl:33.5,cpx:0.7527290867},
        {lvl:34,cpx:0.7556855},
        {lvl:34.5,cpx:0.7586303683},
        {lvl:35,cpx:0.76156384},
        {lvl:35.5,cpx:0.7644860647},
        {lvl:36,cpx:0.76739717},
        {lvl:36.5,cpx:0.7702972656},
        {lvl:37,cpx:0.7731865},
        {lvl:37.5,cpx:0.7760649616},
        {lvl:38,cpx:0.77893275},
        {lvl:38.5,cpx:0.7817900548},
        {lvl:39,cpx:0.784637},
        {lvl:39.5,cpx:0.7874736075},
        {lvl:40,cpx:0.7903},
        {lvl:40.5,cpx:0.792803968},
        {lvl:41,cpx:0.79530001},
        {lvl:41.5,cpx:0.797800015},
        {lvl:42,cpx:0.8003},
        {lvl:42.5,cpx:0.802799995},
        {lvl:43,cpx:0.8053},
        {lvl:43.5,cpx:0.8078},
        {lvl:44,cpx:0.81029999},
        {lvl:44.5,cpx:0.812799985},
        {lvl:45,cpx:0.81529999},
        {lvl:45.5,cpx:0.81779999},
        {lvl:46,cpx:0.82029999},
        {lvl:46.5,cpx:0.82279999},
        {lvl:47,cpx:0.82529999},
        {lvl:47.5,cpx:0.82779999},
        {lvl:48,cpx:0.83029999},
        {lvl:48.5,cpx:0.83279999},
        {lvl:49,cpx:0.83529999},
        {lvl:49.5,cpx:0.83779999},
        {lvl:50,cpx:0.84029999}
    ];


    if (!shouldUpdate) {
        return; //don't update when map is moving
    }
    var toBeRemovedIndexes = [];
    var currentPokemon, marker, i, u, y, CPLC, CPGLUL
    var currentUnixTime = Math.floor(Date.now() / 1000) - timeOffset;
    for (i = 0; i < pokemons.length; ++i) {
        currentPokemon = pokemons[i];
        if (currentPokemon.despawn < currentUnixTime - 10 || (!isPokemonChecked(currentPokemon.id) && !shouldTurnFilterOff()) || !showPokemon(currentPokemon)) {
            toBeRemovedIndexes.push(i);
        }
    }
    for (i = toBeRemovedIndexes.length - 1; i >= 0; --i) {
        pokemons.splice(toBeRemovedIndexes[i], 1);
        marker = markers[toBeRemovedIndexes[i]];
        marker.removeFrom(map);
        markers.splice(toBeRemovedIndexes[i], 1);
    }
    //debugger;
    //remove pokemon from list
    for (i = 0; i < pokemons.length; ++i) {
        currentPokemon = pokemons[i];
        marker = markers[i];
        var verifyPoke = 0;
        var baseAttack1 = 0;
        var baseDefence1 = 0;
        var baseStamina1 = 0;
        var baseAttack2 = 0;
        var baseDefence2 = 0;
        var baseStamina2 = 0;
        var currentStatP1 = 0;
        var currentStatP2 = 0;
        var currentStatP3 = 0;
        var TempAttack = 0;
        var currentCPLC = 0;
        var currentCPGLUL = 0;
        var formneutral = 0;
        var formKey = "" + currentPokemon.form;
        if (!formDict[formKey]) {
            formneutral = 1;
        }
        if (currentPokemon.attack < 1){
            currentPokemon.attack = 0;
        }
        for (u = 0; u < PokeInfo.length; ++u){
            //if (PokeInfo[u].ids == currentPokemon.id && ((currentPokemon.form == PokeInfo[u].forms) || (formneutral && PokeInfo[u].forms == 0))){
            if (PokeInfo[u].ids == currentPokemon.id){
                if (PokeInfo[u].genders == 0 || currentPokemon.gender == PokeInfo[u].genders){
                    for (y = 0; y < CPMulti.length; ++y){
                        TempAttack = currentPokemon.attack + 100;
                        baseAttack1 = (PokeInfo[u].batk + TempAttack - 100) * CPMulti[y].cpx;
                        baseDefence1 = (PokeInfo[u].bdef + currentPokemon.defence) * CPMulti[y].cpx;
                        baseStamina1 = Math.floor((PokeInfo[u].bsta + currentPokemon.stamina) * CPMulti[y].cpx);
                        baseAttack2 = (PokeInfo[u].batk2 + TempAttack - 100) * CPMulti[y].cpx;
                        baseDefence2 = (PokeInfo[u].bdef2 + currentPokemon.defence) * CPMulti[y].cpx;
                        baseStamina2 = Math.floor((PokeInfo[u].bsta2 + currentPokemon.stamina) * CPMulti[y].cpx);
                        currentStatP1 = (baseAttack1 * baseDefence1 * baseStamina1)/1000;
                        currentStatP2 = (baseAttack2 * baseDefence2 * baseStamina2)/1000;
                        CPLC = Math.floor(((PokeInfo[u].batk + TempAttack - 100) * Math.sqrt(PokeInfo[u].bdef + currentPokemon.defence) * Math.sqrt(PokeInfo[u].bsta + currentPokemon.stamina) * Math.pow(CPMulti[y].cpx,2))/10);
                        currentCPLC = Math.floor(((PokeInfo[u].batk + TempAttack - 100) * Math.sqrt(PokeInfo[u].bdef + currentPokemon.defence) * Math.sqrt(PokeInfo[u].bsta + currentPokemon.stamina) * Math.pow(CPMulti[(currentPokemon.level*2)-2].cpx,2))/10);
                        CPGLUL = Math.floor(((PokeInfo[u].batk2 + TempAttack - 100) * Math.sqrt(PokeInfo[u].bdef2 + currentPokemon.defence) * Math.sqrt(PokeInfo[u].bsta2 + currentPokemon.stamina) * Math.pow(CPMulti[y].cpx,2))/10);
                        currentCPGLUL = Math.floor(((PokeInfo[u].batk2 + TempAttack - 100) * Math.sqrt(PokeInfo[u].bdef2 + currentPokemon.defence) * Math.sqrt(PokeInfo[u].bsta2 + currentPokemon.stamina) * Math.pow(CPMulti[(currentPokemon.level*2)-2].cpx,2))/10);
                        if(PokeInfo[u].league1 && currentStatP1 >= PokeInfo[u].statp1 && CPLC <= 500 && currentCPLC <= 500){
                            verifyPoke = 1;
                        }
                        if(PokeInfo[u].league2 && currentStatP2 >= PokeInfo[u].statp2 && CPGLUL <= 1500 && currentCPGLUL <= 1500){
                            verifyPoke = 1;
                        }
                        if(PokeInfo[u].league3 && currentStatP2 >= PokeInfo[u].statp3 && CPGLUL <= 2500 && currentCPGLUL <= 2500){
                            verifyPoke = 1;
                        }
                    }
                }
            }
        }
        if((currentPokemon.attack ==15 && currentPokemon.defence==15 && currentPokemon.stamina==15) || verifyPoke){
            if (currentPokemon.attack < 1){
                currentPokemon.attack = 100
            }
            //debugger;
            if (!marker._map) {
                marker.addTo(map);
                //postDiscord(currentPokemon);
            }
        } else {
            //debugger;
            if (marker._map && currentPokemon.attack <= 15) {
                marker.removeFrom(map);
            }
        }
    }
}

function showPokemon(p) {
    return true;
}


// Inject this code into the site's scope
addJS_Node(indexOfPokemons);
addJS_Node(refreshPokemons);
addJS_Node(showPokemon);

function addJS_Node(text, s_URL, funcToRun, runOnLoad) {
    var D = document;
    var scriptNode = D.createElement('script');
    if (runOnLoad) {
        scriptNode.addEventListener("load", runOnLoad, false);
    }
    scriptNode.type	= "text/javascript";
    if (text) scriptNode.textContent = text;
    if (s_URL) scriptNode.src = s_URL;
    if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}