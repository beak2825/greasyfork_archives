/*global Mustache*/
Mustache.DIO = {smiley : true}
let smiley = true, MID = document.location.host.split(".")[0];
 
let smileyArray = {};
let SmileyBox = {
    loading_error: false,
    activate: () => {
        $('<style id="dio_smiley">' +
            '#dio_smiley_button { cursor:pointer; margin:3px 2px 2px 2px; } ' +
 
            '.dio_smiley_box.game { z-index:5000; position:absolute; top:27px; right: -5px; width:400px; display:none; border: 2px inset #52d313;} ' +
            '.dio_smiley_box.game.open { display:block; } ' +
 
            // Smiley categories
            '.dio_smiley_box .dio_box_header { display: table; width: 100%; text-align: center; margin-bottom: -9px; position: relative; top: 3px;} ' +
            '.dio_smiley_box .dio_box_header img { position: relative; top: 2px;}' +
            '.dio_smiley_box .dio_group { float: left; width: 35px; background: url("https://www.tuto-de-david1327.com/medias/images/etabA.gif") no-repeat; border-bottom: none; margin-right: 1px;}' +
            '.dio_smiley_box .dio_group.active { background: url("https://www.tuto-de-david1327.com/medias/images/etabB.gif") no-repeat;}' +
            //'.dio_smiley_box .dio_group:hover { color: #14999E; } ' + // #11AD6C
 
            '.dio_smiley_box hr { margin:3px 0px 0px 0px; color:#086b18; border:1px solid; } ' +
 
            // Smilies
            '.dio_smiley_box .dio_box_content { overflow-y: auto !important; max-height: 120px; } ' +
            '.dio_smiley_box .dio_box_content .smiley { border: 1px solid rgba(0,0,0,0); border-radius: 5px; margin: 0px; padding: 2px; max-height: 35px; cursor: pointer; } ' +
            '.dio_smiley_box .dio_box_content .smiley:hover { background: rgba(8, 148, 77, 0.2); border: 1px solid rgba(0, 128, 0, 0.5); } ' +
 
            // Scrollbar Style: Chrome, opera, safari
            '.dio_smiley_box ::-webkit-scrollbar { width: 13px; } ' +
            '.dio_smiley_box ::-webkit-scrollbar-track { background-color: rgba(130, 186, 135, 0.5); border-top-right-radius: 4px; border-bottom-right-radius: 4px; } ' +
            '.dio_smiley_box ::-webkit-scrollbar-thumb { background-color: rgba(87, 121, 45, 0.5); border-radius: 3px; } ' +
            '.dio_smiley_box ::-webkit-scrollbar-thumb:hover { background-color: rgba(87, 121, 45, 0.8); } ' +
            // Button Up //
            '.dio_smiley_box ::-webkit-scrollbar-button:single-button:vertical:decrement {height: 16px; background-image: url(https://www.tuto-de-david1327.com/medias/images/scroll-up-green.png);} ' +
            '.dio_smiley_box ::-webkit-scrollbar-button:single-button:vertical:decrement:hover {height: 16px; background-image: url(https://www.tuto-de-david1327.com/medias/images/scroll-up-green-hover.png);} ' +
            // Button Down //
            '.dio_smiley_box ::-webkit-scrollbar-button:single-button:vertical:increment {height: 16px; background-image: url(https://www.tuto-de-david1327.com/medias/images/scroll-down-green.png);} ' +
            '.dio_smiley_box ::-webkit-scrollbar-button:vertical:single-button:increment:hover {height: 16px; background-image: url(https://www.tuto-de-david1327.com/medias/images/scroll-down-green-hover.png);} ' +
 
            // Smiley page link
            '.dio_smiley_box .box_footer { text-align:center; margin-top:4px; } ' +
            '.dio_smiley_box a:link, .dio_smiley_box a:visited { color: #086b18; font-size: 0.7em; } ' +
            '.dio_smiley_box a:hover { color: #14999E; } ' +
            '#dio_smiley_button { z-index:2; height: 18px; border: transparent; background:url("https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-smile.gif") no-repeat 0px 0px } ' +
            '#dio_smiley_butt {display:none;} ' +
            '</style>').appendTo('head');
 
        // Smiley categories
        smileyArray.button = ["rollsmiliey", "smile"];
 
        smileyArray.standard = [
            "smilenew", "lol", "neutral-new", "afraid", "freddus-pacman", "auslachen2", "kolobok-sanduhr", "bussi2", "winken4", "flucht2", "panik4", "seb-zunge", "ins-auge-stechen", "fluch4-GREEN", "baby-junge2", "blush-reloaded6", "frown", "verlegen", "blush-pfeif", "stevieh-rolleyes", "daumendreh2", "baby-taptap",
            "sadnew", "hust", "confusednew", "idea2", "irre", "irre4", "sleep", "candle", "nicken", "no-sad", "thumbs-up-new", "kciuki", "thumbs-down-new", "oh-no2", "bravo2", "kaffee2", "drunk", "saufen", "freu-dance", "hecheln", "headstand", "rollsmiliey", "eazy-cool01", "motz", "cuinlove", "biggrin",
            "_xp-ani04b-rosa", "_charly_rofl", "_schiefgrinsen2", "_klatsch", "_dream1", "_pssst", "_scared", "_baeh", "_baeh2", "_unknownauthor_neinnein", "_igitt", "_doh", "_charly_klatscher", "_flucht", "_confusednew", "_denker", "_klugscheisser", "_buch", "_nixweiss", "_bulb",
        ];
        smileyArray.nature = [
            "dinosaurier07", "flu-super-gau", "ben-cat", "schwein", "hundeleine01", "blume", "ben-sharky", "ben-cow", "charly-bissig", "gehirnschnecke-confused", "mttao-fische", "mttao-angler", "insel", "fliegeschnappen", "ben-dumbo", "twitter", "elefant", "schildkroete", "elektroschocker", "spiderschwein", "oma-sessel-katze", "fred-elefant",
            "palmoel", "stevieh-teddy", "fips-aufsmaul", "marienkaefer", "mrkaktus", "kleeblatt2", "fred-blumenstauss", "hurra-fruehling1-lila", "fred-rasenmaeher", "fred-blumenbeet",
            "_fips_doh", "_fips_baeh2", "_fips_doh", "_fips_nixweiss",
        ];
        smileyArray.grepolis = [
            "grepolis", "mttao-wassermann", "palka", "i-lovo-grepolis", "silvester-cuinlove", "mttao-schuetze", "kleeblatt2", "wallbash", "musketiere-fechtend", "lol-1", "mttao-waage2", "saladin", "steckenpferd", "skullhaufen", "pferdehaufen", "pirat5", "seb-cowboy", "gw-ranger001",
            "barbar", "datz", "waffe01", "sarazene-bogen", "waffe02", "waffe14", "hoplit-sword1", "pfeildurchkopf02", "hoplit-sword3",
            "_stephan_stahlhelm", "_mttao_star_wars",
        ];
        smileyArray.people = [
            "greenistan", "mttao-usa", "schal-usa", "mttao-grossbritannien", "seb-hut5", "opa-boese2", "star-wars-yoda1-gruen", "snob", "seb-detektiv-ani", "devil", "segen", "borg", "hexe3b", "eazy-polizei", "stars-elvis", "mttao-chefkoch", "nikolaus", "pirate3-biggrin", "batman-skeptisch", "tubbie1", "tubbie2", "tubbie3", "kosmita", "tubbie4",
            "_schriftsteller2", "_geek", "_help",
        ];
        smileyArray.Party = [
            "torte1", "torte3", "bier", "party", "party2", "fans", "band", "klokotzen", "rave", "laola", "prost", "mcdonalds", "margarita", "geschenk", "sauf", "el", "trommler", "ozboss-gitarre2", "kaffee", "kaffee3", "caipirinha", "whiskey", "drunk", "popcorn-essen", "fressen", "saufen", "leckerer", "birthday", "energydrink1", "prost2",
            "_stars_takethat_gary4", "_stars_takethat_gary3", "_stars_kiss_peter05b", "_kingrestless05", "_bananadancer2", "_kolobok_schlagzeuger",
        ];
        smileyArray.other = [
            "steinwerfen", "kolobok", "headbash", "liebeskummer", "bussi", "grab-schaufler2", "boxen2", "aufsmaul", "mttao-kehren", "sm", "weckruf", "klugscheisser2", "karte2-rot", "dagegen", "party", "outofthebox", "dafuer", "pokal-gold", "koepfler", "transformer", "eazy-senseo1",
            "_browser-opera-vs-ff", "_browser-ff-vs-safari", "_browser-opera-vs-safari", "_browser-safari-vs-ff", "_browser-safari-vs-opera", "_seb_browser-ff", "_seb_browser-opera", "_seb_browser-safari", "_seb_browser-chrome1", "_mttao_haeuptling", "_pagerank-05", "_bibi_stats", "_fred_zocker_augen_4eck", "_fred_aoe_theageofkings", "_teuflisches-ja",
            "_kilroy_sofa2", "_no-cheats", "_paradoxon5", "_ralf_greenpacman", "_ralf_greenpacman_bigmac", "_stevieh_ordilove",
        ];
        smileyArray.halloween = [
            "zombies-alien", "zombies-lol", "zombies-rolleyes", "zombie01", "zombies-smile", "zombie02", "zombies-skeptisch", "zombies-eek", "zombies-frown", "geistani", "scream-if-you-can", "pfeildurchkopf01", "grab-schaufler", "kuerbisleuchten", "mummy3", "kuerbishaufen", "halloweenskulljongleur", "fledermausvampir", "frankenstein-lol", "halloween-confused", "zombies-razz",
            "halloweenstars-freddykrueger", "zombies-cool", "geist2", "fledermaus2", "halloweenstars-dracula", "batman", "halloweenstars-lastsummer", "hexefliegend",
            "_hexe-frosch", "_xmas4_hexe-frosch", "_hexe-frosch2",
        ];
        smileyArray.xmas = [
            "i-love-grepolis", "santagrin", "xmas1-down", "xmas1-thumbs1", "xmas2-lol", "xmas1-frown", "xmas1-irre", "xmas1-razz", "xmas4-kaffee2", "xmas4-hurra2", "xmas4-aufsmaul", "schneeball", "schneeballwerfen", "xmas4-advent4", "nikolaus", "weihnachtsmann-junge", "schneewerfen-wald", "weihnachtsmann-nordpol", "xmas-kilroy-kamin",
            "xmas4-laola", "xmas3-smile", "xmas4-paketliebe", "3hlkoenige", "santa", "weihnachtsgeschenk2", "fred-weihnachten-ostern", "xmas4-wallbash", "xmas4-liebe", "xmas4-skullhaufen",
            "_tree", "_xmas1_censored", "_xmas4_furz", "_xmas4_nixweiss", "_xmas4_postbote", "_xmas4_altermann", "_xmas4_postpaket", "_xmas4_paketliebe", "_xmas4_regenschirm2", "_xmas4_respekt", "_xmas4_stars_takethat_howard",
            "_xmas4_talk", "_xmas4_hundeleine01", "_xmas4_spam1", "_xmas4_spam3", "_xmas4_google", "_xmas4_selbstmord", "_xmas4_doh", "_xmas_kilroy", "_xmas4_pfeif", "_xmas4_stars_takethat_gary", "_xmas4_borg", "_xmas4_borg2", "_xmas4_doh", "_xmas4_verlegen", "_xmas4_nixweiss", "_klo-lesen-mann-xmas",
        ];
        smileyArray.easter = [
            "eier-bemalen-blau-hase-braun", "osterei-hase05", "osterei-bunt", "ostern-hurra2", "osterhasensmilie", "ostern-thumbs1", "ostern-nosmile", "ostern-lol", "ostern-irre", "ostern-frown", "ostern-down", "ostern-cuinlove", "ostern-confused", "ostern-blush", "ostern-biggrin", "plapperhase",
            "_ostern1_blush-reloaded", "_ostern_alien", "_ostern_censored", "_ostern_cool", "_ostern_stumm", "_xmas4_ostern_stumm", "_ostern1_xd", "_ostern2_xd", "_ostern2_censored", "_ostern2_confused", "_ostern2_cuinlove", "_ostern2_down", "_ostern2_thumbs1", "_ostern_rofl3", "_ostern2_rofl3", "_ostern_eek", "_ostern_erschreckt", "_ostern_igitt", "_ostern_rolleyes", "_ostern_skeptisch", "_ostern_confused",
        ];
        smileyArray.love = [
            "b-love2", "brautpaar-kinder", "brautpaar-reis", "cuinlove", "fips-herzen01", "heart", "herzen01", "herzen02", "herzen06", "kiss", "klk-tee", "liebesflagge", "love", "lovelove-light", "rose", "send-out-love", "teeglas-fruechtetee", "unknownauthor-knutsch", "valentinstag-biggrin", "valentinstag-confused",
            "valentinstag-down", "valentinstag-irre", "valentinstag-lol", "valentinstag-thumbs1", "wolke7",
            "_xmas4_rose", "_sex4", "_teeglas_schwarzer-tee", "_teetasse", "_klk_tee", "_gehirnschnecke_cuinlove",
        ];
        smileyArray.Buchstaben = [
            "_megaeek", "_question", "_callsign",
            "smile/sign2_0", "smile/sign2_1", "smile/sign2_2", "smile/sign2_3", "smile/sign2_4", "smile/sign2_5", "smile/sign2_6", "smile/sign2_7", "smile/sign2_8", "smile/sign2_9",
            "smile/sign2_A", "smile/sign2_B", "smile/sign2_C", "smile/sign2_D", "smile/sign2_E", "smile/sign2_F", "smile/sign2_G", "smile/sign2_H", "smile/sign2_I", "smile/sign2_J", "smile/sign2_K", "smile/sign2_L", "smile/sign2_M", "smile/sign2_N", "smile/sign2_O", "smile/sign2_P", "smile/sign2_Q", "smile/sign2_R", "smile/sign2_S", "smile/sign2_T", "smile/sign2_U", "smile/sign2_V", "smile/sign2_W", "smile/sign2_X", "smile/sign2_Y", "smile/sign2_Z",
            "smile/sign2_and", "smile/sign2_backslash", "smile/sign2_callsign", "smile/sign2_comma", "smile/sign2_plus", "smile/sign2_point", "smile/sign2_questionmark", "smile/sign2_quote", "smile/sign2_slash", "smile/sign2_space", "smile/sign2_star", "smile/sign2_AE", "smile/sign2_OE", "smile/sign2_UE", "smile/sign2_SZ",
 
            "smile/sign3_0", "smile/sign3_1", "smile/sign3_2", "smile/sign3_3", "smile/sign3_4", "smile/sign3_5", "smile/sign3_6", "smile/sign3_7", "smile/sign3_8", "smile/sign3_9",
            "smile/sign3_A", "smile/sign3_B", "smile/sign3_C", "smile/sign3_D", "smile/sign3_E", "smile/sign3_F", "smile/sign3_G", "smile/sign3_H", "smile/sign3_I", "smile/sign3_J", "smile/sign3_K", "smile/sign3_L", "smile/sign3_M", "smile/sign3_N", "smile/sign3_O", "smile/sign3_P", "smile/sign3_Q", "smile/sign3_R", "smile/sign3_S", "smile/sign3_T", "smile/sign3_U", "smile/sign3_V", "smile/sign3_W", "smile/sign3_X", "smile/sign3_Y", "smile/sign3_Z",
            "smile/sign3_and", "smile/sign3_backslash", "smile/sign3_callsign", "smile/sign3_comma", "smile/sign3_plus", "smile/sign3_point", "smile/sign3_questionmark", "smile/sign3_quote", "smile/sign3_slash", "smile/sign3_space", "smile/sign3_star", "smile/sign3_AE", "smile/sign3_OE", "smile/sign3_UE", "smile/sign3_SZ",
 
            "smile/braille-schrift_0", "smile/braille-schrift_1", "smile/braille-schrift_2", "smile/braille-schrift_3", "smile/braille-schrift_4", "smile/braille-schrift_5", "smile/braille-schrift_6", "smile/braille-schrift_7", "smile/braille-schrift_8", "smile/braille-schrift_9",
            "smile/braille-schrift_A", "smile/braille-schrift_B", "smile/braille-schrift_C", "smile/braille-schrift_D", "smile/braille-schrift_E", "smile/braille-schrift_F", "smile/braille-schrift_G", "smile/braille-schrift_H", "smile/braille-schrift_I", "smile/braille-schrift_J", "smile/braille-schrift_K", "smile/braille-schrift_L", "smile/braille-schrift_M", "smile/braille-schrift_N", "smile/braille-schrift_O", "smile/braille-schrift_P", "smile/braille-schrift_Q", "smile/braille-schrift_R", "smile/braille-schrift_S", "smile/braille-schrift_T", "smile/braille-schrift_U", "smile/braille-schrift_V", "smile/braille-schrift_W", "smile/braille-schrift_X", "smile/braille-schrift_Y", "smile/braille-schrift_Z",
            "smile/braille-schrift_callsign", "smile/braille-schrift_comma", "smile/braille-schrift_point", "smile/braille-schrift_questionmark", "smile/braille-schrift_quote", "smile/braille-schrift_space", "smile/braille-schrift_AE", "smile/braille-schrift_OE", "smile/braille-schrift_UE", "smile/braille-schrift_SZ",
 
            "smile/buchstaben_0", "smile/buchstaben_1", "smile/buchstaben_2", "smile/buchstaben_3", "smile/buchstaben_4", "smile/buchstaben_5", "smile/buchstaben_6", "smile/buchstaben_7", "smile/buchstaben_8", "smile/buchstaben_9",
            "smile/buchstaben_A", "smile/buchstaben_B", "smile/buchstaben_C", "smile/buchstaben_D", "smile/buchstaben_E", "smile/buchstaben_F", "smile/buchstaben_G", "smile/buchstaben_H", "smile/buchstaben_I", "smile/buchstaben_J", "smile/buchstaben_K", "smile/buchstaben_L", "smile/buchstaben_M", "smile/buchstaben_N", "smile/buchstaben_O", "smile/buchstaben_P", "smile/buchstaben_Q", "smile/buchstaben_R", "smile/buchstaben_S", "smile/buchstaben_T", "smile/buchstaben_U", "smile/buchstaben_V", "smile/buchstaben_W", "smile/buchstaben_X", "smile/buchstaben_Y", "smile/buchstaben_Z",
            "smile/buchstaben_and", "smile/buchstaben_callsign", "smile/buchstaben_comma", "smile/buchstaben_plus", "smile/buchstaben_point", "smile/buchstaben_questionmark", "smile/buchstaben_quote", "smile/buchstaben_space", "smile/buchstaben_star", "smile/buchstaben_AE", "smile/buchstaben_OE", "smile/buchstaben_UE",
 
            "smile/xmas-sign_0", "smile/xmas-sign_1", "smile/xmas-sign_2", "smile/xmas-sign_3", "smile/xmas-sign_4", "smile/xmas-sign_5", "smile/xmas-sign_6", "smile/xmas-sign_7", "smile/xmas-sign_8", "smile/xmas-sign_9",
            "smile/xmas-sign_A", "smile/xmas-sign_B", "smile/xmas-sign_C", "smile/xmas-sign_D", "smile/xmas-sign_E", "smile/xmas-sign_F", "smile/xmas-sign_G", "smile/xmas-sign_H", "smile/xmas-sign_I", "smile/xmas-sign_J", "smile/xmas-sign_K", "smile/xmas-sign_L", "smile/xmas-sign_M", "smile/xmas-sign_N", "smile/xmas-sign_O", "smile/xmas-sign_P", "smile/xmas-sign_Q", "smile/xmas-sign_R", "smile/xmas-sign_S", "smile/xmas-sign_T", "smile/xmas-sign_U", "smile/xmas-sign_V", "smile/xmas-sign_W", "smile/xmas-sign_X", "smile/xmas-sign_Y", "smile/xmas-sign_Z",
            "smile/xmas-sign_and", "smile/xmas-sign_backslash", "smile/xmas-sign_callsign", "smile/xmas-sign_comma", "smile/xmas-sign_plus", "smile/xmas-sign_point", "smile/xmas-sign_questionmark", "smile/xmas-sign_quote", "smile/xmas-sign_slash", "smile/xmas-sign_space", "smile/xmas-sign_star", "smile/xmas-sign_AE", "smile/xmas-sign_OE", "smile/xmas-sign_UE", "smile/xmas-sign_SZ",
        ];
        //smileyArray.Geburtstag = ["_29a", "_29b", "_29c"];
 
        SmileyBox.loadSmileys();
    },
    deactivate: () => {
        $('#dio_smiley').remove();
    },
    // preload images
    loadSmileys: () => {
        try {
            // Replace german sign smilies
            if (MID == "de") {
                smileyArray.standard.push("land-germany", "land-germany2", "land-germany3", "land-germany-kings");
                smileyArray.other.push("dagegen2", "dafuer2");
                smileyArray.people[2] = "mttao-deutschland";
                smileyArray.people[3] = "schal-deutschland";
            }
            if (MID == "fr") {
                smileyArray.standard.push("land-france", "land-france2", "land-france3");
                smileyArray.people[2] = "mttao-frankreich";
                smileyArray.people[3] = "schal-frankreich";
            }
            if (MID == "it") {
                smileyArray.standard.push("land-italy", "land-italy2", "land-italy3");
                smileyArray.people[2] = "mttao-italien";
                smileyArray.people[3] = "schal-italien";
            }
            if (MID == "ro") {
                smileyArray.standard.push("land-romania", "land-romania2", "land-romania3");
                smileyArray.people[3] = "mttao-rumaenien";
            }
            if (MID == "br") {
                smileyArray.standard.push("land-portugal", "land-portugal2", "land-portugal3");
                smileyArray.people[2] = "mttao-portugal";
                smileyArray.people[3] = "schal-portugal";
            }
            if (MID == "pl") {
                smileyArray.standard.push("land-poland", "land-poland2", "land-poland3");
                smileyArray.people[3] = "mttao-polen";
            }
            if (MID == "es") {
                smileyArray.standard.push("land-spain", "land-spain2", "land-spain3");
                smileyArray.people[2] = "mttao-spanien";
                smileyArray.people[3] = "schal-spanien";
            }
            if (MID == "sk") {
                smileyArray.people[2] = "mttao-slowakei";
                smileyArray.people[3] = "schal-slowakei";
            }
            for (var a = 1; a < 10; a++) {
                smileyArray.Buchstaben.push("_rate0" + a);
            }
            smileyArray.Buchstaben.push("_rate10", "_rate11", "_rate11b", "_29a", "_29b", "_29c")
            for (var b = 1; b < 101; b++) {
                smileyArray.Buchstaben.push("_geburtstagswedler-" + b);
            }
            for (var e in smileyArray) {
                if (smileyArray.hasOwnProperty(e)) {
                    for (var f in smileyArray[e]) {
                        if (smileyArray[e].hasOwnProperty(f)) {
                            var src = smileyArray[e][f];
 
                            smileyArray[e][f] = new Image();
                            smileyArray[e][f].className = "smiley";
                            if (src.substring(0, 6) == "smile/") {
                                smileyArray[e][f].src = "https://www.greensmilies.com/" + src + ".gif";
                            } else if (src.substring(0, 1) == "_") {
                                smileyArray[e][f].src = "https://www.greensmilies.com/smile/smiley_emoticons" + src + ".gif";
                            } else {
                                if (SmileyBox.loading_error == false) {
                                    smileyArray[e][f].src = "https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-" + src + ".gif";
                                } else {
                                    smileyArray[e][f].src = 'https://i.imgur.com/VdjJJgk.gif';
                                }
                            }
                            smileyArray[e][f].onerror = function () {
                                this.src = 'https://i.imgur.com/VdjJJgk.gif';
                            };
                        }
                    }
                }
            }
        } catch (error) { console.log(e) }
    },
    // add smiley box
    add: (e) => {
        try {
            var bbcodeBarId, bbcodeBarIdd, button, Class = "message", nb;
            switch (e) {
                case "xfSmilie-1":
                    nb = "1";
                    Class = "block-container";
                    break;
                case "xfSmilie-2":
                    nb = "2";
                    break;
                case "xfSmilie-3":
                    nb = "3";
                    break;
                case "xfSmilie-4":
                    nb = "4";
                    break;
                case "xfSmilie-5":
                    nb = "5";
                    break;
                case "xfSmilie-6":
                    nb = "6";
                    break;
            }
            button = "dio_smiley_butt-" + nb;
            bbcodeBarId = "#xfSmilie-" + nb;
            bbcodeBarIdd = "dio_smiley-" + nb;
 
            if (!$('#' + button).get(0)) {
                $(bbcodeBarId).after('<button id="' + button + '" type="button" data-title="Smileys by David1327" role="button" class="fr-command fr-btn fr-active" style="text-align: center;"><div id="dio_smiley_button" class="button"></div></button>');
            } else return
            $(bbcodeBarId).parent().parent().parent().append(
                '<div id="' + bbcodeBarIdd + '" class="dio_smiley_box game ' + Class + '" style="border: 2px inset #52d313; margin-top: 12px;">' +
                '<div class="bbcode_box middle_center"><div class="bbcode_box middle_right"></div><div class="bbcode_box middle_left"></div>' +
                '<div class="bbcode_box top_left"></div><div class="bbcode_box top_right"></div><div class="bbcode_box top_center"></div>' +
                '<div class="bbcode_box bottom_center"></div><div class="bbcode_box bottom_right"></div><div class="bbcode_box bottom_left"></div>' +
                '<div class="dio_box_header">' +
                '<span class="dio_group standard active"><img src="https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-smilenew.gif"></span>' +
                '<span class="dio_group nature"><img src="https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-ben-cat.gif" style="top: 1px;"></span>' +
                '<span class="dio_group grepolis"><img src="https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-i-lovo-grepolis.gif" style="top: -5px;" ></span>' +
                '<span class="dio_group people"><img src="https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-stars-elvis.gif" style="top: -1px;" ></span>' +
                '<span class="dio_group Party"><img src="https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-prost2.gif" style="margin-right: -5px;" ></span>' +
                '<span class="dio_group other"><img src="https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-irre.gif" style="margin-right: -5px;" ></span>' +
                '<span class="dio_group halloween"><img src="https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-zombies-lol.gif" style="margin-right: -5px;" ></span>' +
                '<span class="dio_group xmas"><img src="https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-santagrin.gif" style="top: -6px;" ></span>' +
                '<span class="dio_group easter"><img src="https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-osterhasensmilie.gif" style="top: -6px;" ></span>' +
                '<span class="dio_group love"><img src="https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-herzen02-1.gif" style="top: -3px;" ></span>' +
                '<span class="dio_group Buchstaben"><img src="https://www.greensmilies.com/smile/sign_A.gif" style="" ></span>' +
                //'<span class="dio_group Geburtstag"><img src="https://www.greensmilies.com/smile/smiley_emoticons_geburtstagswedler-1.gif" style="" ></span>' +
                '</div>' +
                '<hr><div class="dio_box_content"></div><hr>' +
                '<div class="box_footer">Smiley Forum by David1327 & greensmilies.com</div>' +
                /////'<div class="box_footer"><a href="http://www.greensmilies.com/smilie-album/" target="_blank">WWW.GREENSMILIES.COM</a></div>' +
                '</div>');
 
            bbcodeBarIdd = "#" + bbcodeBarIdd;
            $('.dio_group').click(function (e) {
                var bbcodeBar = e.currentTarget.offsetParent.offsetParent.id;
                button = "dio_smiley_butt-1";
                if (bbcodeBar == "dio_smiley-2") { button = "dio_smiley_butt-2"; }
                else if (bbcodeBar == "dio_smiley-3") { button = "dio_smiley_butt-3"; }
                else if (bbcodeBar == "dio_smiley-4") { button = "dio_smiley_butt-4"; }
                else if (bbcodeBar == "dio_smiley-5") { button = "dio_smiley_butt-5"; }
                else if (bbcodeBar == "dio_smiley-6") { button = "dio_smiley_butt-6"; }
                $('#' + bbcodeBar + ' .dio_group.active').removeClass("active");
                $(this).addClass("active");
                // Change smiley group
                SmileyBox.addSmileys(this.className.split(" ")[1], "", '#' + bbcodeBar, button);
            });
 
            SmileyBox.addSmileys("standard", bbcodeBarId, bbcodeBarIdd, button);
 
            // smiley box toggle
            $('#' + button).click(function (e) {
                let bbcodeBar = "#dio_smiley-1", bbcodeBarremove = "#dio_smiley-2, #dio_smiley-3, #dio_smiley-4, #dio_smiley-5, #dio_smiley-6";
                if (e.currentTarget.id == "dio_smiley_butt-2") { bbcodeBar = "#dio_smiley-2"; bbcodeBarremove = "#dio_smiley-1, #dio_smiley-3, #dio_smiley-4, #dio_smiley-5, #dio_smiley-6" }
                if (e.currentTarget.id == "dio_smiley_butt-3") { bbcodeBar = "#dio_smiley-3"; bbcodeBarremove = "#dio_smiley-1, #dio_smiley-2, #dio_smiley-4, #dio_smiley-5, #dio_smiley-6" }
                if (e.currentTarget.id == "dio_smiley_butt-4") { bbcodeBar = "#dio_smiley-4"; bbcodeBarremove = "#dio_smiley-1, #dio_smiley-2, #dio_smiley-3, #dio_smiley-5, #dio_smiley-6" }
                if (e.currentTarget.id == "dio_smiley_butt-5") { bbcodeBar = "#dio_smiley-5"; bbcodeBarremove = "#dio_smiley-1, #dio_smiley-2, #dio_smiley-3, #dio_smiley-4, #dio_smiley-6" }
                if (e.currentTarget.id == "dio_smiley_butt-6") { bbcodeBar = "#dio_smiley-6"; bbcodeBarremove = "#dio_smiley-1, #dio_smiley-2, #dio_smiley-3, #dio_smiley-4, #dio_smiley-5" }
                $($(bbcodeBarremove)).removeClass("open");
                $("#dio_smiley_butt-1 #dio_smiley_button, #dio_smiley_butt-2 #dio_smiley_button, #dio_smiley_butt-3 #dio_smiley_button").css({ background: 'url(https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-smile.gif) no-repeat 0px 0px' });
                if (!$($(bbcodeBar)).hasClass("open")) {
                    $($(bbcodeBar)).addClass("open");
                    $("#" + e.currentTarget.id + " #dio_smiley_button").css({ background: 'url(https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-rollsmiliey.gif) no-repeat 0px 0px' });
                } else {
                    $($(bbcodeBar)).removeClass("open");
                    $("#" + e.currentTarget.id + " #dio_smiley_button").css({ background: 'url(https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-smile.gif) no-repeat 0px 0px' });
                }
            });
            $('#moreRich-1, #moreRich-2, #moreRich-3, #moreRich-4, #moreRich-5, .rte-tab--preview, .fr-dropdown:last-of-type').click(function (e) {
                $("#dio_smiley-1, #dio_smiley-2, #dio_smiley-3, #dio_smiley-4, #dio_smiley-5").removeClass("open");
                $("#dio_smiley_butt-1 #dio_smiley_button, #dio_smiley_butt-2 #dio_smiley_button, #dio_smiley_butt-3 #dio_smiley_button").css({ background: 'url(https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-smile.gif) no-repeat 0px 0px' });
            });
 
        } catch (error) { console.log(e) }
    },
    // insert smileys from arrays into smiley box
    addSmileys: (type, bbcodeBarId, bbcodeBarIdd, button) => {
        try {
            // reset smilies
            if ($(bbcodeBarIdd + " .dio_box_content").get(0)) {
                $(bbcodeBarIdd + " .dio_box_content").get(0).innerHTML = '';
            }
            // add smilies
            for (var e in smileyArray[type]) {
                if (smileyArray[type].hasOwnProperty(e)) {
                    $(smileyArray[type][e]).clone().appendTo(bbcodeBarIdd + " .dio_box_content");
                    //$('<img class="smiley" src="' + smileyArray[type][e].src + '" alt="" />').appendTo(bbcodeBarId + " .dio_box_content");
                }
            }
 
            $(bbcodeBarIdd + " .dio_box_content .smiley").click(function (e) {
                var textarea;
                // hide smiley box
                $('#' + button).click();
                // find textarea
                textarea = $(this).closest('.fr-box.fr-basic').find("textarea").get(0);
                if ($(this).closest('.fr-box.fr-basic').find("textarea").get(0) == undefined) $('<img src="' + this.src + '" data-url="' + this.src + '" class="bbImage fr-fic fr-dii fr-draggable" alt="" title="">').insertBefore(".fr-element.fr-view:first p:last br:last")
                else {
                    var text = $(textarea).val();
                    $(textarea).val(text.substring(0, $(textarea).get(0).selectionStart) + "[img]" + this.src + "[/img]" + text.substring($(textarea).get(0).selectionEnd));
                }
            });
        } catch (error) { console.log(e) }
    }
};
SmileyBox.activate();
setInterval(() => {
    if ($("#xfSmilie-1").length & !$('#dio_smiley_butt-1').length) SmileyBox.add("xfSmilie-1");
    if ($("#xfSmilie-2").length & !$('#dio_smiley_butt-2').length) SmileyBox.add("xfSmilie-2");
    if ($("#xfSmilie-3").length & !$('#dio_smiley_butt-3').length) SmileyBox.add("xfSmilie-3");
    if ($("#xfSmilie-4").length & !$('#dio_smiley_butt-4').length) SmileyBox.add("xfSmilie-4");
    if ($("#xfSmilie-5").length & !$('#dio_smiley_butt-5').length) SmileyBox.add("xfSmilie-5");
    if ($("#xfSmilie-6").length & !$('#dio_smiley_butt-6').length) SmileyBox.add("xfSmilie-6");
}, 4000);
setTimeout(() => { SmileyBox.add("xfSmilie-1"); }, 200);