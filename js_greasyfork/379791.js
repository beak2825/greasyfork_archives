// ==UserScript==
// @name          Exhentai Highlighting
// @copyright     2016 to 2023, Thasidar
// @namespace     exhentai.org/thasidar
// @description   Skript fuer Exhentai-Reader mit Highlight Funktion
// @include       https://exhentai.org/*
// @include       https://e-hentai.org/*
// @grant         GM_addStyle
// @version       2.8.16
// @downloadURL https://update.greasyfork.org/scripts/379791/Exhentai%20Highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/379791/Exhentai%20Highlighting.meta.js
// ==/UserScript==



// some predefined Colors:
var LIGHT_BLUE = '#e6e6fa';     var BLUE = '#9b9beb';         var DARK_BLUE = '#0044dd';
var LIGHT_GREEN = '#e6fae6';    var GREEN = '#9beb9b';        var DARK_GREEN = '#008800';
var LIGHT_RED = '#fae6e6';      var RED = '#ff0000';          var DARK_RED = '#aa0000';
                                var YELLOWGREEN = '#96BE00';  var DARK_YELLOWGREEN = '#6E9300';
                                var ORANGE = '#ffd085';       var DARK_ORANGE = '#f29400';
var BLACK = '#000000';          var GREY = '#ddDDdd';         var WHITE = '#ffFFff';

var SERIENFARBE = DARK_GREEN;
var TAGFARBE = DARK_GREEN;
var MANGAKAFARBE = DARK_BLUE;
var TRANSLATORFARBE = DARK_YELLOWGREEN;
var BLACKLISTFARBE = DARK_RED;
var WHITELISTFARBE = DARK_GREEN;
var NEWMANGAFARBE = DARK_GREEN;

/*************************************************************************************************************************
 *  hier wird alles eingetragen was gehighlightet werden soll!
 *
 *  auf der Hauptseite:
 *************************************************************************************************************************/
var serien = [
    "Onnajima - Harem Frontier", "Girls Lacrosse Club", "Mare Holic", "Succubus Stayed Life", "A Tentacled Romance", "Traumerei", "Akiko-san to Issho", "Eroge de Subete wa Kaiketsu Dekiru", "Iseijin no Hanshoku", "My Ideal Life in Another World", "Sorcery : A Yokai Harem", "Zombie Harem Life", "For Sale: Fallen Lady, Never Used", "Awkward Affairs: Bunny Sister"
];

var translator = [
    "NecroManCr", "Lazarus H"
];

var mangaka = [
    "Methonium", "Mizone", "Dr.P", "Fukumaaya", "setouchi kurage", "narita kyousha", "muronaga chaashuu", "sasamori tomoe", "Omnivorous Hero", "izayoi no kiki", "horitomo", "jeanne da'ck", "jitsuma", "otochichi", "obmas", "Satsuki Imonet", "Moketa", "Uekan", "Takasugi Kou", "Toruneko", "Sugi G", "Cuvie", "Nario", "Amatarou", "Hroz", "Shunjou Shuusuke", "Zenmai Kourogi", "Minakami Sakura", "nokoppa", "alde hyde", "(Jun)", "[Jun]"
];


/*************************************************************************************************************************
 *  hier wird alles eingetragen was gehighlightet werden soll!
 *
 *  auf der Mangaseite:
 *************************************************************************************************************************/
var mangaka_gelesen = [
    "td_group:zenmai_kourogi", "td_group:horsetail", "td_group:mamamaster",

    "td_artist:Methonium", "td_artist:Mizone", "td_artist:Dr.P", "td_artist:Fukumaaya", "td_artist:setouchi_kurage", "td_artist:narita_kyousha", "td_artist:muronaga_chaashuu", "td_artist:sasamori_tomoe","td_artist:Omnivorous_Hero", "td_artist:izayoi_no_kiki", "td_artist:shinobe", "td_artist:emily", "td_artist:tsuruta_bungaku", "td_artist:tachibana_omina", "td_artist:purupyon_saitou", "td_artist:kon-kit", "td_artist:kurokoshi_you", "td_artist:ouma_tokiichi", "td_artist:aoki_kanji", "td_artist:sena_youtarou", "td_artist:tonnosuke", "td_artist:jun", "td_artist:fumitsuki_sou", "td_artist:yukiusagi.", "td_artist:nanakagi_satoshi", "td_artist:kudou_hisashi", "td_artist:takunomi", "td_artist:akikusa_peperon", "ta_artist:nanao", "td_artist:gemu555", "td_artist:jeanne_dack", "td_artist:pija", "td_artist:oroneko", "td_artist:akanagi", "td_artist:shioroku", "td_artist:ashiomi_masato", "td_artist:sakurayu_hal", "td_artist:badhand", "td_artist:goban", "td_artist:horitomo", "td_artist:momonosuke", "td_artist:blmanian", "td_artist:abe_morioka", "td_artist:koorizu", "td_artist:suzuhane_suzu", "td_artist:rocket_monkey", "td_artist:gotoh_juan", "td_artist:kuronomiki", "td_artist:ikezaki_misa", "td_artist:satsuki_imonet", "td_artist:sakula", "td_artist:tsuina", "td_artist:at", "td_artist:umino_sachi", "td_artist:uesugi_kyoushirou", "td_artist:izayoi_seishin", "td_artist:okumori_boy", "td_artist:dozamura", "td_artist:mizuiro_megane", "td_artist:kerorin", "td_artist:unagimaru", "td_artist:rage", "td_artist:takeda_hiromitsu", "td_artist:dowarukofu", "td_artist:makinosaka_shinichi", "td_artist:yomotsuka_tsukasa", "td_artist:sowitchraw", "td_artist:gentsuki", "td_artist:feena", "td_artist:takatsu", "td_artist:isao", "td_artist:piero", "td_artist:hal", "td_artist:kiichi", "td_artist:asuhiro", "td_artist:moketa", "td_artist:uekan", "td_artist:dunga", "td_artist:kai_hiroyuki", "td_artist:kaiduka", "td_artist:aoi_hitori", "td_artist:hiryuu_ran", "td_artist:taihei_tengoku", "td_artist:azuma_sawayoshi", "td_artist:sunagawa_tara", "td_artist:ootsuka_kotora", "td_artist:bu-chan", "td_artist:nanahoshi_tento", "td_artist:yumano_yuuki", "td_artist:ed", "td_artist:kemonono", "td_artist:spiritus_tarou", "td_artist:nakamura_regura", "td_artist:kiya_shii", "td_artist:moriya_makoto", "td_artist:chirumakuro", "td_artist:yukiji_shia", "td_artist:ginto", "td_artist:shinobu_tanei", "td_artist:take", "td_artist:tanaka_naburu", "td_artist:kishizuka_kenji", "td_artist:tatsunami_youtoku", "td_artist:itaba_hiroshi", "td_artist:yokkora", "td_artist:yamada_yuuya", "td_artist:ishimura", "td_artist:hyji", "td_artist:takasugi_kou", "td_artist:solopipb", "td_artist:hisakawa_tinn", "td_artist:yunioshi", "td_artist:mitarashi_kousei", "td_artist:chiba_tetsutarou", "td_artist:hakkyou_daioujou", "td_artist:tamon_ketsuyuk", "td_artist:unadon", "td_artist:iroito", "td_artist:jyoka", "td_artist:koishi_chikasa", "td_artist:alpaca_club", "td_artist:toruneko", "td_artist:mizone", "td_artist:fue", "td_artist:seibee", "td_artist:syoukaki", "td_artist:koyanagi_royal", "td_artist:nora_higuma", "td_artist:herio", "td_artist:etuzan_jakusui", "td_artist:oohira_sunset", "td_artist:tanishi", "td_artist:mokkouyou_bond", "td_artist:shinozuka_yuuji", "td_artist:piririnegi", "td_artist:tsubaki_jushirou", "td_artist:sindoll", "td_artist:dorei_jackie", "td_artist:hiro", "td_artist:hoshino_ryuichi", "td_artist:john_k._pe-ta", "td_artist:kemuri_haku", "td_artist:ryuuta", "td_artist:accio", "td_artist:arekusa_mahone", "td_artist:bubonic", "td_artist:swa", "td_artist:otochichi", "td_artist:sugi_g", "td_artist:morishima_kon", "td_artist:aoi_tiduru", "td_artist:yamamoto_yoshifumi", "td_artist:bakuya", "td_artist:daigo", "td_artist:cuvie", "td_artist:ndc", "td_artist:kunaboto", "td_artist:yanyo", "td_artist:narusawa_kei", "td_artist:yoshu_ohepe", "td_artist:onapan", "td_artist:nishikawa_kou", "td_artist:qdou_kei", "td_artist:saiyazumi", "td_artist:itami", "td_artist:misaki_yukihiro", "td_artist:ao_madousi", "td_artist:yukiyanagi", "td_artist:natsu_no_oyatsu", "td_artist:okamura_morimi", "td_artist:batsu", "td_artist:kizaru", "td_artist:onomeshin", "td_artist:date", "td_artist:ooishi_kou", "td_artist:miitoban", "td_artist:zakotsu", "td_artist:suruga_kuroitsu", "td_artist:rikose", "td_artist:nakagami_takashi", "td_artist:z-ton", "td_artist:trump", "td_artist:matsumoto_katsuya", "td_artist:nme", "td_artist:edo_shigezu", "td_artist:menea_the_dog", "td_artist:utu", "td_artist:tokiwa_midori", "td_artist:marui_maru", "td_artist:mushi", "td_artist:mikawaya", "td_artist:isorashi", "td_artist:minamida_usuke", "td_artist:doumou", "td_artist:kakuzatou", "td_artist:sanbun_kyoden", "td_artist:kumada", "td_artist:misaoka", "td_artist:kemigawa_mondo", "td_artist:yuzuha", "td_artist:tsukudani", "td_artist:fuetakishi", "td_artist:bai_asuka", "td_artist:nokishita_negio", "td_artist:takayama_chihiro", "td_artist:ojo", "td_artist:momofuki_rio", "td_artist:awayume", "td_artist:ayasaka_mitsune", "td_artist:okunoha", "td_artist:ichihaya", "td_artist:shindou", "td_artist:kusatsu_terunyo", "td_artist:izawa_shinichi", "td_artist:hroz", "td_artist:yuki_tomoshi", "td_artist:meme50", "td_artist:cuzukago", "td_artist:beijuu", "td_artist:fuyuno_mikan", "td_artist:ichitaka", "td_artist:kanroame", "td_artist:kyuuri", "td_artist:yukimi", "td_artist:distance", "td_artist:takaishi_fuu", "td_artist:okyuuri", "td_artist:musashimaru", "td_artist:kame", "td_artist:yoshimura_tatsumaki", "td_artist:mashiro_shirako", "td_artist:fukuyama_naoto", "td_artist:zanzi", "td_artist:mifune_seijirou", "td_artist:yana", "td_artist:azukiko", "td_artist:katsura_yoshihiro", "td_artist:jin", "td_artist:shimanto_shisakugata", "td_artist:neromashin", "td_artist:akifuji_satoshi", "td_artist:stealth_changing_line", "td_artist:kentarou", "td_artist:ash_yokoshima", "td_artist:nikusoukyuu", "td_artist:sirokuma", "td_artist:hatakeyama_tohya", "td_artist:kumakiti", "td_artist:souryuu", "td_artist:yamamoto_zenzen", "td_artist:choco_pahe", "td_artist:tomohiro_kai", "td_artist:emons", "td_artist:fan_no_hitori", "td_artist:tawara_hiryuu", "td_artist:gesundheit", "td_artist:ryuno", "td_artist:jirou", "td_artist:sakai_nayuta", "td_artist:urukaze", "td_artist:senke_kagero", "td_artist:kousuke", "td_artist:kaidou_kana", "td_artist:otono_natsu", "td_artist:niwatori_gunsou", "td_artist:kouda_tomohiro", "td_artist:mgmee", "td_artist:michiking", "td_artist:labui", "td_artist:hachimitsu", "td_artist:kirome", "td_artist:aruse_yuuji", "td_artist:chicken", "td_artist:agata", "td_artist:nekoi_hikaru", "td_artist:sasaki_akira", "td_artist:benantoka", "td_artist:karasuma_yayoi", "td_artist:mizuyuki", "td_artist:shido_mayuru", "td_artist:mozu", "td_artist:pochi.", "td_artist:yam", "td_artist:maguro_teikoku", "td_artist:arai_kei", "td_artist:maimu-maimu", "td_artist:nekoro_tanuki", "td_artist:plum", "td_artist:spices", "td_artist:shijou_sadafumi", "td_artist:kiyokawa_nijiko", "td_artist:double_deck", "td_artist:kogaku_kazuya", "td_artist:nakano_sora", "td_artist:sanpaku", "td_artist:fumi_miyabi", "td_artist:nario", "td_artist:sorono", "td_artist:ocha", "td_artist:kisaragi_nana", "td_artist:kosuke", "td_artist:kimura_neito", "td_artist:kakao", "td_artist:juna_juna_juice", "td_artist:takeda_aranobu", "td_artist:miyamoto_issa", "td_artist:ikumo_taisuke", "td_artist:ushino_kandume", "td_artist:noise", "td_artist:orutoro", "td_artist:ginzake", "td_artist:jorori", "td_artist:tamagoro", "td_artist:fence_14", "td_artist:igumox", "td_artist:shouji_nigou", "td_artist:korotsuke", "td_artist:okayusan", "td_artist:takayanagi_katsuya", "td_artist:moya", "td_artist:tanabe", "td_artist:takayuki_hiyori", "td_artist:sasaki_maru", "td_artist:kojima_miu", "td_artist:kurosu_gatari", "td_artist:ouchi_kaeru", "td_artist:shuten_douji", "td_artist:tatsukawa_shin", "td_artist:kloah", "td_artist:yuyama_chika", "td_artist:ameyama_denshin", "td_artist:okumoto_yuuta", "td_artist:ootsuka_mahiro", "td_artist:nakani", "td_artist:shibi", "td_artist:ponfaz", "td_artist:katase_minami", "td_artist:jyura", "td_artist:kizuka_kazuki", "td_artist:orikuchi_hirata", "td_artist:gonza", "td_artist:yoshida", "td_artist:shimanto_youta", "td_artist:saemon", "td_artist:tachikawa_negoro", "td_artist:wanao", "td_artist:obmas", "td_artist:murasaki_syu", "td_artist:ichiren_takushou", "td_artist:ennorei", "td_artist:alexi_laiho", "td_artist:amano_kazumi", "td_artist:bifidus", "td_artist:shiomaneki", "td_artist:yoshida_inuhito", "td_artist:hijiri_tsukasa", "td_artist:takei_ooki", "td_artist:shou_akira", "td_artist:amane_ruri", "td_artist:amagaeru", "td_artist:bota_mochito", "td_artist:kazuma_muramasa", "td_artist:alp", "td_artist:midori_no_rupe", "td_artist:manabe_jouji", "td_artist:tamano_kedama", "td_artist:rokuichi", "td_artist:gustav", "td_artist:aki", "td_artist:kh", "td_artist:nukunuku", "td_artist:meganei", "td_artist:fummy", "td_artist:ginhaha", "td_artist:bobobo", "td_artist:mamezou", "td_artist:satou_kimiatsu", "td_artist:tamatsuyada", "td_artist:kuroki_hidehiko", "td_artist:kosuke_haruhito", "td_artist:uchi-uchi_keyaki", "td_artist:takahashi_takashi", "td_artist:amatarou", "td_artist:arisawa_masaharu", "td_artist:oouso", "td_artist:unou", "td_artist:yukibuster_z", "td_artist:uchida_shou", "td_artist:takaoka_motofumi", "td_artist:yumoteliuce", "td_artist:amatake_akewo", "td_artist:kirihara_you", "td_artist:nanao_yukiji", "td_artist:karma_tatsurou", "td_artist:usagi_nagomu", "td_artist:akatsuki_myuuto", "td_artist:rurukichi", "td_artist:yanagawa_rio", "td_artist:fukumaaya", "td_artist:gosaiji", "td_artist:nakayama_tetsugaku", "td_artist:shomu", "td_artist:mil", "td_artist:yamakumo", "td_artist:nanase_mizuho", "td_artist:fushoku", "td_artist:aho", "td_artist:miyamoto_liz", "td_artist:hiyoshi_hana", "td_artist:herohero_tom", "td_artist:kasuga_mayu", "td_artist:the_amanoja", "td_artist:karasu_chan", "td_artist:uramac", "td_artist:yoo_oona", "td_artist:shiden_hiro", "td_artist:nekogen", "td_artist:tsukino_jyogi", "td_artist:minamoto_jin", "td_artist:konshin", "td_artist:chiba_toshirou", "td_artist:anza_yuu", "td_artist:mario", "td_artist:raymon", "td_artist:kishiri_toworu", "td_artist:mikihime", "td_artist:achumuchi", "td_artist:maihara_matsuge", "td_artist:simon", "td_artist:binsen", "td_artist:shinogi_a-suke", "td_artist:suihei_sen", "td_artist:oltlo", "td_artist:7zu7", "td_artist:kurokawa_otogi", "td_artist:fumihiko", "td_artist:kannazuki_motofumi", "td_artist:punita", "td_artist:shin_fuzen", "td_artist:mizuryu_kei", "td_artist:inkey", "td_artist:izumi_banya", "td_artist:kawakami_rokkaku", "td_artist:takanashi_rei", "td_artist:wakamatsu", "td_artist:c.r", "td_artist:cle_masahiro", "td_artist:maruta", "td_artist:kuroshiki", "td_artist:hyocorou", "td_artist:kirisaki_byakko", "td_artist:sentakuki", "td_artist:mr.takealook", "td_artist:haguruma", "td_artist:kazuhiro", "td_artist:shake", "td_artist:xxzero", "td_artist:n.o._chachamaru", "td_artist:shiwasu_no_okina", "td_artist:mikemono_yuu", "td_artist:amano_jack", "td_artist:tokei_usagi", "td_artist:savan", "td_artist:mikami_cannon", "td_artist:yasu", "td_artist:hiroya", "td_artist:jinsuke", "td_artist:fujisawa_tatsurou", "td_artist:eo_masaka", "td_artist:satsuki_itsuka", "td_artist:mumumu", "td_artist:amazon", "td_artist:name_john", "td_artist:zzinzinz", "td_artist:kozakura_kumaneko", "td_artist:kumoemon", "td_artist:kaida_bora", "td_artist:ikuhana_niro", "td_artist:inoue_yoshihisa", "td_artist:shinoda_kazuhiro", "td_artist:clover", "td_artist:fuji-han", "td_artist:seihoukei", "td_artist:stealyy", "td_artist:hiroshiki", "td_artist:miyashiro_sousuke", "td_artist:diisuke", "td_artist:hanzaki_jirou", "td_artist:amakuchi", "td_artist:sanagi_torajirou", "td_artist:samozumo_tooru", "td_artist:the_amanoja9", "td_artist:echigoya_takeru", "td_artist:yukiyoshi_mamizu", "td_artist:kira_hiroyoshi", "td_artist:tokomaya_keita", "td_artist:sagano_yuuji", "td_artist:hirune", "td_artist:iguchi_sentarou", "td_artist:okano_hajime", "td_artist:futaba_yae", "td_artist:mitsuba_minoru", "td_artist:erect_sawaru", "td_artist:yuzuno_kiichi", "td_artist:jingrock", "td_artist:sugar_milk", "td_artist:chiyoda_micro", "td_artist:hitotsuba", "td_artist:shisyo", "td_artist:yamazaki_kazuma", "td_artist:kobanya_koban", "td_artist:tabigarasu", "td_artist:supurai", "td_artist:sakaki_utamaru", "td_artist:sakomae_aichi", "td_artist:fei", "td_artist:namboku", "td_artist:densuke", "td_artist:higashino_mikan", "td_artist:ganmarei", "td_artist:yamu", "td_artist:kawaisaw", "td_artist:zonda", "td_artist:kurihara_kenshirou", "td_artist:ozy", "td_artist:nezumin", "td_artist:nise", "td_artist:teru", "td_artist:yua", "td_artist:wamusato_haru", "td_artist:akihiko", "td_artist:redbarong", "td_artist:kokonoki_nao", "td_artist:herurun", "td_artist:kotoba_ai", "td_artist:kuroiwa_madoka", "td_artist:hinemosu_notari", "td_artist:shunjou_shuusuke", "td_artist:mura_osamu", "td_group:cent_millibar", "td_artist:sakamata_nerimono", "td_artist:satou_souji", "td_artist:akinaro", "td_artist:ebina_ebi", "td_artist:kurogane_satsuki", "td_artist:hoyoyo", "td_artist:fujoujoshi", "td_artist:takahashi_note", "td_artist:uragoshi_ichigo", "td_artist:tetsuyama_kaya", "td_artist:aoino_broome", "td_artist:takemasa_takeshi", "td_artist:betty", "td_artist:peniken", "td_artist:akitsuki_itsuki", "td_artist:karoti", "td_artist:sueyuu", "td_artist:suzuki_sakura", "td_artist:shirisensha", "td_artist:yosyo-", "td_artist:mogiki_hayami", "td_artist:mamo", "td_artist:hiru_okita", "td_artist:oryou", "td_artist:aka_seiryuu", "td_artist:mikaduchi", "td_artist:mutou_koucha", "td_artist:eno", "td_artist:pyon-kti", "td_artist:tairame", "td_artist:tamanosuke", "td_artist:nemu", "td_artist:ouji_hiyoko", "td_artist:ichigain", "td_artist:saigado", "td_artist:kiasa", "td_artist:tomotsuka_haruomi", "td_artist:kurokura_eri", "td_artist:nusmusbim", "td_artist:hikage_hinata", "td_artist:toguchi_masaya", "td_artist:makita_yoshiharu", "td_artist:zero_no_mono", "td_artist:matsurino_naginata", "td_artist:makuro", "td_artist:yuzuna_hiyo", "td_artist:otogi_tetsurou", "td_artist:koharu_nanakusa", "td_artist:izure", "td_artist:tenzaki_kanna", "td_artist:mafuyu", "td_artist:oota_yuuichi", "td_artist:majoccoid", "td_artist:haruhisky", "td_artist:metako", "td_artist:murasame_masumi", "td_artist:narashino_zoe", "td_artist:hoikooroo", "td_artist:takeyama_shimeji", "td_artist:motomushi", "td_artist:zion", "td_artist:yuuki_ray", "td_artist:yatsuashi_matomo", "td_artist:yatsuashimatomo", "td_artist:arsenal", "td_artist:kirino_kyousuke", "td_artist:r-one", "td_artist:teri_terio", "td_artist:akino_sora", "td_artist:g-10", "td_artist:hoshino_yuuto", "td_artist:henkuma", "td_artist:eba", "td_artist:natsuki_kiyohito", "td_artist:nodame", "td_artist:tokie_hirohito", "td_artist:midoh_tsukasa", "td_artist:gengorou", "td_artist:kenji", "td_artist:piyopiyo", "td_artist:umakuchi_syouyu", "td_artist:kirishima_ayu", "td_artist:ice", "td_artist:torigoshi_crow", "td_artist:kayumidome", "td_artist:murasaki_nyaa", "td_artist:kuroiwa_menou", "td_artist:itou_ei", "td_artist:tensei-kun", "td_artist:ishigami_kazui", "td_artist:kojima_video", "td_artist:sumiyao", "td_artist:asaki_takayuki", "td_artist:drachef", "td_artist:kurumiya_mashimin", "td_artist:narita_koh", "td_artist:inu", "td_artist:torotaro", "td_artist:kizuki_rei", "td_artist:akitsuki_hirozumi", "td_artist:karube_guri", "td_artist:miyama", "td_artist:scarlett_ann", "td_artist:koayako", "td_artist:higashide_irodori", "td_artist:kamiyama_aya", "td_artist:yaiba_kyousuke", "td_artist:ringo_sui", "td_artist:kase_daiki", "td_artist:yorisuke", "td_artist:shion", "td_artist:type.90", "td_artist:millefeuille", "td_artist:chin", "td_artist:yuzuki_n_dash", "td_artist:tarakan", "td_artist:yokoyama_lynch", "td_artist:poron", "td_artist:nijou_tayun", "td_artist:itou_eight", "td_artist:minato_yoshihiro", "td_artist:o.p_com", "td_artist:dhibi", "td_artist:yasuhara_tsukasa", "td_artist:poruno_ibuki", "td_artist:pon_takahanada", "td_artist:xter", "td_artist:konmori", "td_artist:penicillin_xi", "td_artist:chinbotsu_tower", "td_artist:jairou", "td_artist:zettaizetumei", "td_artist:uzukinoko", "td_artist:sage_joh", "td_artist:sunahama_nosame", "td_artist:sumita_kazuasa", "td_artist:kapa", "td_artist:inax", "td_artist:kitsunekov", "td_artist:muneshiro", "td_artist:furari", "td_artist:harigane_shinshi", "td_artist:sabaku", "td_artist:torichamaru", "td_artist:thomas", "td_artist:midoriha_mint", "td_artist:shigeta", "td_artist:toba_yuga", "td_artist:kotatsu_tomodachi", "td_artist:hakaishin", "td_artist:wasabi", "td_artist:oyari_ashito", "td_artist:sen", "td_artist:magatama", "td_artist:kirimoto_yuuji", "td_artist:yoshiragi", "td_artist:tatsu_tairagi", "td_artist:mimic", "td_artist:ariko_youichi", "td_artist:kikunoya.", "td_artist:kamaboko", "td_group:wasabi_chazuke.", "td_artist:matsuyama_seiji", "td_artist:baneroku", "td_artist:2no.", "td_artist:kaiko", "td_artist:ganima", "td_artist:hakai_taitei", "td_artist:hakai_taitei", "td_artist:shinkuukan", "td_artist:iwasaki_yuuki", "td_artist:sudou_ruku", "td_artist:arima_kouichi", "td_artist:miyabe_kiwi", "td_artist:nishi_shizumu", "td_artist:yu", "td_artist:tadano_kushami", "td_artist:danimaru", "td_artist:yamizawa", "td_artist:mameko", "td_artist:nenemaru", "td_artist:mucc", "td_artist:buta", "td_artist:sumiya", "td_artist:kanno_takanori", "td_artist:tsukumo_nikyu", "td_artist:nishida_megane", "td_artist:kojima_saya", "td_artist:shijou_mako", "td_artist:hirob816", "td_artist:toritora", "td_artist:idaten_funisuke", "td_artist:nekonta", "td_artist:sion", "td_artist:pink_taro", "td_artist:oniyama", "td_artist:sasaki_saki", "td_artist:212", "td_artist:barakey", "td_artist:kauti", "td_artist:nayuta_takumi", "td_artist:ahobaka", "td_artist:bijogi_junction", "td_artist:nobishiro", "td_artist:wherewolf", "td_artist:homunculus", "td_artist:nogiwa_kaede", "td_artist:taki_re-ki", "td_artist:ather_birochi", "td_artist:tadano_happa", "td_artist:narushima_godou", "td_artist:namidame", "td_artist:aihara_you", "td_artist:turiganesou", "td_artist:sukedai", "td_artist:kaenuco", "td_artist:bang-you", "td_artist:tamabi", "td_artist:oniku", "td_artist:miyoshi", "td_artist:andou_hiroyuki", "td_artist:taiban_steak", "td_artist:onaka_emi", "td_artist:yamaguchi", "td_artist:asano_yomichi", "td_artist:ono_kenuji", "td_artist:mon-petit", "td_artist:kirekawa", "td_artist:yanagida_fumita", "td_artist:enokido", "td_artist:namekata_fumiaki", "td_artist:kitamura_kouichi", "td_artist:mamaloni", "td_artist:nabe", "td_artist:nigesapo", "td_artist:yatsuki_hiyori", "td_artist:sasizume_soutarou", "td_artist:minakami_sakura", "td_artist:emori_uki", "td_artist:highlow", "td_artist:soborogo", "td_artist:tsuchinoshita_kaeru", "td_artist:inari_mochi", "td_artist:danbo", "td_artist:mikuni_mizuki", "td_artist:done", "td_artist:akikan", "td_artist:yosuke", "td_artist:aoin", "td_artist:tokei", "td_artist:gyouza_teishoku", "td_artist:tomonaga_kenji", "td_artist:usashiro_mani", "td_artist:rondonko", "td_artist:someoka_yusura", "td_artist:yottan", "td_artist:yasson_yoshiyuki", "td_artist:takimoto_yukari", "td_artist:napo", "td_artist:maeshima_ryou", "td_artist:takashina_asahi", "td_artist:nishi_yoshiyuki", "td_artist:nokoppa", "td_artist:ogino_satoshi", "td_artist:yutakame", "td_artist:kyaradain", "td_artist:rig-pa", "td_artist:komugiko", "td_artist:hanpera", "td_artist:hayake", "td_artist:mocco", "td_artist:yamamori", "td_artist:yuuki_shin", "td_artist:wise_speak", "td_artist:oobayashi_mori", "td_artist:tanaka-ex", "td_artist:takaya", "td_artist:ken_sogen", "td_artist:gin_eiji", "td_artist:jodminster", "td_artist:homare", "td_artist:matsuno_susumu", "td_artist:nakao_hamu", "td_artist:katou_an", "td_artist:tamachi_yuki", "td_artist:announ", "td_artist:kyockcho", "td_artist:haji", "td_artist:izumiya_otoha", "td_artist:ichiri", "td_artist:yuzushiko", "td_artist:shinjitsu", "td_artist:grifon", "td_artist:yaeda_nagumo", "td_artist:sakazaki_freddie", "td_artist:sekiya_asami", "td_artist:minato_fumi", "td_artist:akage_no_un", "td_artist:azuma_tesshin", "td_artist:rtr", "td_artist:kokutou_nikke", "td_artist:mikaduki_neko", "td_artist:rama", "td_artist:otone", "td_artist:wantan_meo", "td_artist:andoryu", "td_artist:hara", "td_artist:kinntarou", "td_artist:jii", "td_artist:eixin", "td_artist:art_post", "td_artist:uonome_beji", "td_artist:uranokyuu", "td_artist:ml", "td_artist:okyou", "td_artist:teppo", "td_artist:milkexplorer", "td_artist:zeroshiki_kouichi", "td_artist:kameyama_shiruko", "td_artist:achuto", "td_artist:atyuto", "td_artist:jean_louis", "td_artist:negoya", "td_artist:ichinomiya_yuu", "td_artist:uemukai_dai", "td_artist:yahiro_pochi", "td_artist:mokushi", "td_artist:morocco", "td_artist:sirn", "td_artist:hoshino_darts", "td_artist:shinjiro", "td_artist:inuburo", "td_artist:tsukako", "td_artist:touma_itsuki", "td_artist:kiriyama_taichi", "td_artist:bankokudou", "td_artist:himadara", "td_artist:hihiyama_yokikana", "td_artist:dramus", "td_artist:ryopie", "td_artist:camekirin", "td_artist:momoko", "td_artist:eguchi_chibi", "td_artist:shirabe_shiki", "td_artist:mataro", "td_artist:sparrowl", "td_artist:hirano_kawajuu", "td_artist:meido_sushi", "td_artist:inoue_makito", "td_artist:matsuri", "td_artist:drill_jill", "td_artist:goto-beido", "td_artist:ryoji", "td_artist:aoino", "td_artist:roreru", "td_artist:marota", "td_artist:minami_chisato", "td_artist:unosero", "td_artist:lbl", "td_artist:uten_ameka", "td_artist:88", "td_artist:kurokawa_izumi", "td_artist:hirekatsu", "td_artist:doji_ro", "td_artist:zero_tanuki", "td_artist:nagashima_chosuke", "td_artist:tc", "td_artist:yaruku", "td_artist:ushinomiya", "td_artist:mameojitan", "td_artist:fuuga", "td_artist:vulcan_nure", "td_artist:saranaru_takami", "td_artist:hukii", "td_artist:nagareboshi", "td_artist:naitou_kirara", "td_artist:sagattoru", "td_artist:takei_tsukasa", "td_artist:nigiri_usagi", "td_artist:anesky", "td_artist:karakuchi_choucream", "td_artist:agobitch_nee-san", "td_artist:mikitoamon", "td_artist:yamaoka_koutetsurou", "td_artist:kawaisounako", "td_artist:kinomoto_anzu", "td_artist:zakuro", "td_artist:chomoran", "td_artist:fujimaru", "td_artist:yukijirushi", "td_artist:mojarin", "td_artist:aiue_oka", "td_artist:shiibara_tetsu", "td_artist:tanuma", "td_artist:norinko", "td_artist:tsusauto", "td_artist:shimipan", "td_artist:nihito", "td_artist:hibakichi", "td_artist:ishikawa_shisuke", "td_artist:utamaro", "td_artist:mutou_mato", "td_artist:shiina_kazuki", "td_artist:maeda_momo", "td_artist:sasahara_yuuki", "td_artist:konchiki", "td_artist:wakamiya_teresa", "td_artist:ziran", "td_artist:masha", "td_artist:zaki_zaraki", "td_artist:itsuki_kuro", "td_artist:hindenburg", "td_artist:bookmoun10", "td_artist:futamaro", "td_artist:mimamoriencyo", "td_artist:sasakuma_kyouta", "td_artist:saeki", "td_artist:rustle", "td_artist:shibaken_goro", "td_artist:yamahata_rian", "td_artist:akatsuki_kochi", "td_artist:akitaka", "td_artist:sakuragi_yomi", "td_artist:airandou", "td_artist:a.pg", "td_artist:redchicken", "td_artist:survival_knife", "td_artist:shishamo", "td_artist:yuna", "td_artist:momoduki_suzu", "td_artist:hotate-chan", "td_artist:haitoku_sensei", "td_artist:yoshida_tobio", "td_artist:umiyamasoze", "td_artist:kirigakure_takaya", "td_artist:nukunuku_orange", "td_artist:asagi_ryu", "td_artist:namaribou_nayonayo", "td_artist:itouya", "td_artist:kagami", "td_artist:souko_souji", "td_artist:yakusho", "td_artist:r-koga", "td_artist:mori_manpei", "td_artist:setouchi", "td_artist:hori_hiroaki", "td_artist:torotarou", "td_artist:satsuki_mikazu", "td_artist:kiduki_sai", "td_group:upa24", "td_artist:kamata", "td_artist:dotsuco", "td_artist:kiiroi_tamago", "td_artist:matsutou_tomoki", "td_artist:ootsuki_wataru", "td_artist:jinnai", "td_artist:bonten", "td_artist:okada_kou", "td_artist:kuga_mayuri", "td_artist:sameda_koban", "td_artist:uc", "td_artist:akki", "td_artist:eba_uenihane", "td_artist:rakujin", "td_artist:warabino_matsuri", "td_artist:subachi", "td_artist:makigai_ikko", "td_artist:keso", "td_artist:miyashiro_yousuke", "td_artist:takura_mahiro", "td_artist:sasaki_yuuhei", "td_artist:honryo_hanaru", "td_artist:maekawa_hayato", "td_artist:miyahara_ayumu", "td_artist:kanzume", "td_artist:garoudo", "td_artist:jt_dong-agyoku", "td_artist:don.agyoku", "td_artist:tanaka_ginji", "td_artist:shiawase_na_choshoku", "td_artist:oshima_aki", "td_artist:kyabetsuka", "td_artist:cessa", "td_artist:shiun", "td_artist:onodera", "td_artist:uni18", "td_artist:maskwolf", "td_artist:kuratsuka_riko", "td_artist:ishikei", "td_artist:poncocchan", "td_artist:muteki_soda", "td_artist:rororogi_mogera", "td_artist:saigi", "td_artist:u-1", "td_artist:ushiro", "td_artist:akari_kyousuke", "td_artist:noripachi", "td_artist:poriuretan", "td_artist:ie", "td_artist:oriue_wato", "td_artist:owasobi", "td_artist:acbins", "td_artist:akubinium", "td_artist:nekono_fuguri", "td_artist:yuizaki_kazuya", "td_artist:funakura", "td_artist:yoshiie", "td_artist:skyzen", "td_artist:sakagami_umi", "td_artist:clone_ningen", "td_artist:mt", "td_artist:shogota", "td_artist:ocha_no_degarashi", "td_artist:special_g", "td_artist:kuretudenn", "td_artist:bouningen", "td_artist:inukami_inoji", "td_artist:arimura_daikon", "td_artist:moegi", "td_artist:onesota_shuu", "td_artist:menyang", "td_artist:emine_kendama", "td_artist:shiono_kou", "td_artist:hasebe_souutsu", "td_artist:suzuki_toto", "td_artist:shiawase_na_choshoku", "td_artist:butachang", "td_artist:sakamoto_hinata", "td_artist:kuon", "td_artist:maccha_neji", "td_artist:dt_hone", "td_artist:rabadash_ii", "td_artist:alde_hyde", "td_artist:nibiirokaden", "td_artist:hidemaru", "td_artist:saitou_renji", "td_artist:ooban_yaki", "td_artist:aramaki_echizen", "td_artist:takamaru", "td_artist:gudl", "td_artist:pukara", "td_artist:sabashi_renya", "td_artist:ikeshita_maue", "td_artist:sawayaka_samehada", "td_artist:utsunomiya_ukatsu", "td_artist:sakamoto_kafka", "td_artist:akai_same", "td_artist:juuichi_gatsu", "td_artist:mokko_ritchie", "td_artist:chimeda", "td_artist:tsukunendo", "td_artist:tsumetoro", "td_artist:yakitomato", "td_artist:kanimura_ebio", "td_artist:okuva", "td_artist:kakashi_asahiro", "td_artist:moejin", "td_artist:senakagashiri", "td_artist:pcmaniac88", "td_artist:uchuu_ika", "td_artist:ahemaru", "td_artist:kotobuki_mairo", "td_artist:kagura_moromi", "td_artist:fuguta-ke", "td_artist:takashima", "td_artist:atori_k", "td_artist:aya_shachou", "td_artist:chiguchi_miri", "td_artist:shigekix", "td_artist:detritus", "td_artist:nyanko_mic", "td_artist:igedoaha", "td_artist:yumekawa_dododo-chan", "td_artist:siberian_hahasky", "td_artist:kiliu", "td_artist:nadadekoko", "td_artist:libre", "td_artist:aino_tatsurou", "td_artist:suzan", "td_artist:kaneda_asao", "td_artist:youta", "td_artist:kekemotsu", "td_artist:komota", "td_artist:yuruchin_kyouso", "td_artist:remu", "td_artist:ohsaka_minami", "td_artist:kazum", "td_artist:matsumoto_jikyuuryoku", "td_artist:giga", "td_artist:varios", "td_artist:oshiro", "td_artist:mm", "td_artist:yaminabe", "td_artist:upanishi.", "td_artist:walterwolf", "td_artist:tamaki", "td_artist:heitai_gensui", "td_artist:eibon", "td_artist:choma", "td_artist:equal", "td_artist:hinata", "td_artist:raidon", "td_artist:denbu_momo", "td_artist:jakko", "td_artist:lemon_yoshinobu", "td_artist:brother_pierrot", "td_artist:gamigami", "td_artist:shinozaki_rei", "td_artist:andojing", "td_artist:murabito_c", "td_artist:ranmaru", "td_artist:miyano_kintarou", "td_artist:f", "td_artist:daruguxwa", "td_artist:roboku", "td_artist:otou.", "td_artist:noji", "td_artist:kirin_kakeru", "td_artist:enoughmin", "td_artist:hinasaki_yo", "td_artist:aoyama_akira", "td_artist:borusiti", "td_artist:kutibue", "td_artist:sanjiro", "td_artist:omuraisu", "td_artist:deep_valley", "td_artist:butcha-u", "td_artist:nagaikusa", "td_artist:arai_kazuki", "td_artist:meisuke", "td_artist:ebi_fry_teishoku", "td_artist:honda_arima", "td_artist:point_takashi", "td_artist:rati", "td_artist:fukuhara_takaya", "td_artist:washimori", "td_artist:kazma", "td_artist:hashida_mamoru", "td_artist:mizsawa", "td_artist:ishimari_yuuya", "td_artist:koko_ankou", "td_artist:yamakonbu", "td_artist:kamakiri", "td_artist:senbon", "td_artist:yuzuto_sen", "td_artist:barlun", "td_artist:wkar", "td_artist:baltan", "td_artist:fukuinu", "td_artist:hanabi", "td_artist:6no1", "td_artist:geso_smith", "td_artist:saida_kazuaki", "td_artist:flanvia", "td_artist:shuuhen_kouichi", "td_artist:botamochi", "td_artist:mankai_beesuke", "td_artist:morris", "td_artist:majirou", "td_artist:shiitaken", "td_artist:koori_nezumi", "td_artist:mabo", "td_artist:vaneroku", "td_artist:saionji_poruporu", "td_artist:satozaki", "td_artist:senor_daietsu", "td_artist:buta99", "td_artist:guusuka", "td_artist:sakifox", "td_artist:yue", "td_artist:tenkomori", "td_artist:mizuyan", "td_artist:ishino_kanon", "td_artist:hoshii_nasake", "td_artist:velzhe", "td_artist:kagemusya", "td_artist:tomagiri", "td_artist:pilaf_modoki", "td_artist:liteu", "td_artist:dangan", "td_artist:dakkoku_jiro", "td_artist:yawaraka_black", "td_artist:nippa_takahide", "td_artist:tsukasawa", "td_artist:ishikawa_hirodi", "td_artist:urasuji_samurai", "td_artist:tsunao", "td_artist:ogino", "td_artist:wasisan", "td_artist:kousaka_tsutomu", "td_artist:fujun_nyuushi", "td_artist:ame_no_machi", "td_artist:tanutan", "td_artist:golden", "td_artist:amamiya_mizuki", "td_artist:guts_shihan", "ta_artist:mamo_williams", "td_artist:seura_isago", "td_artist:kourui", "td_artist:yanonoshin", "td_artist:kinoshita_junichi", "td_artist:ramanda", "td_artist:hujinon", "td_artist:fukurou", "td_artist:nekodanshaku", "td_artist:muo", "td_artist:takeaki", "td_artist:kikunyi", "td_artist:hardboiled_yoshiko", "td_artist:ryoma", "td_artist:meeko", "td_artist:gaburi", "td_artist:makosho", "td_artist:sasaki_kazuyuki", "td_artist:tikubin", "td_artist:periodo", "td_artist:ratatatat74", "td_artist:pobotto", "td_artist:ki-51", "td_artist:shano", "td_artist:si-man", "td_artist:kouki_kuu", "td_artist:craft", "td_artist:jitsuma", "td_artist:ikki_ichiyuu", "td_artist:huwahuwa_raidou", "td_artist:moon", "td_artist:akahito", "td_artist:penguindou", "td_artist:ume_fumi", "td_artist:oyabe_ryo", "td_artist:tyomoti", "td_artist:toumasu", "td_artist:karl", "td_artist:nabatani_kinoko", "td_artist:manbou_syoten", "td_artist:teaindian", "td_artist:fuwatani", "td_artist:ruzi", "td_artist:ujihara_shitone", "td_artist:pz-x", "td_artist:41", "td_artist:boole", "td_artist:syoukyakubutu", "td_artist:natsuzo", "td_artist:ani", "td_artist:yuri_kowashi", "td_artist:aya", "td_artist:darkmaya", "td_artist:sakai_hamachi", "td_artist:issyoukin", "td_artist:gomio", "td_artist:suzunomoku", "td_artist:nesz", "td_artist:sayika", "td_artist:drill_murata", "td_artist:yucchris", "td_artist:sabo", "td_artist:misaragi", "td_artist:molta", "td_artist:motsuaki", "td_artist:otemoto", "td_artist:sankaku_noel", "td_artist:urase_shioji", "td_artist:bowcan", "td_artist:shirokouji_shio", "td_artist:hannya-san"
];

var blacklist_mangaka = [
    "td_artist:fuusen_club"
];

/*************************************************************************************************************************
 *  Tags
 *************************************************************************************************************************/
var whitelist = [
    "td_artist:dr.p",

    "td_uncensored", "td_incest", "td_inseki",

    "td_male:sole_male",

    "td_female:alien_girl", "td_female:angel", "td_female:bbw", "td_female:sister", "td_female:big_ass", "td_female:catgirl", "td_female:tomboy", "td_female:tanlines", "td_female:milf", "td_female:wolf_girl", "td_female:demon_girl", "td_female:widow", "td_female:big_breasts", "td_female:mother", "td_female:bunny_girl", "td_female:dog_girl", "td_female:cowgirl", "td_female:tall_girl", "td_female:underwater", "td_female:fox_girl", "td_female:monster_girl", "td_female:dark_skin", "td_female:elf", "td_female:wormhole", "td_female:centaur", "td_female:snake_girl", "td_female:insect_girl", "td_female:lizard_girl", "td_female:plant_girl", "td_female:slime_girl", "td_female:oni", "td_female:sole_female", "td_female:horns", 

"td_male:human_on_furry"
];

var blacklist = [
    "td_incomplete", "td_novel", "td_poor_grammar", "td_group", "td_mmf_threesome", "td_mtf_threesome",

    "td_language:rewrite", "td_other:rough_translation",

    "td_female:futanari", "td_female:rape", "td_female:yuri", "td_female:females_only", "td_female:double_penetration", "td_female:blood", "td_female:guro", "td_female:snuff", "td_female:netorare", "td_female:mind_control", "td_female:huge_penis", "td_female:slave", "td_female:mind_break", "td_female:cheating", "td_female:dick_growth", "td_female:multiple_penises", "td_female:sole_dickgirl", "td_female:drugs", "td_female:urination","td_female:male_on_dickgirl", "td_female:prostitution","td_female:shemale","td_female:asphyxiation","td_female:strap-on", "td_female:triple_penetration", "td_female:cannibalism", "td_female:blackmail", "td_female:bestiality", "td_female:farting", "td_female:scat", "td_female:humiliation", "td_female:diaper", "td_female:bdsm", "td_female:dickgirl_on_dickgirl", "td_female:prostate_massage", "td_female:chloroform", "td_female:human_pet", "td_female:lolicon", "td_female:corruption", "td_female:unbirth", "td_female:vore", "td_female:anal_birth", "td_female:birth", "td_female:parasite", "td_female:vomit", "td_female:piss_drinking", "td_female:public_use", "td_female:torture", "td_female:eyepatch", "td_female:oppai_loli", "td_female:moral_degeneration", "td_female:human_cattle", "td_female:toddlercon", "td_female:granddaughter", "td_female:anorexic", "td_female:big_penis", "td_female:swinging",

    "td_male:dilf", "td_male:bbm", "td_male:smegma", "td_male:cbt", "td_male:pegging", "td_male:anal", "td_male:asphyxiation", "td_male:unbirth", "td_male:miniguy", "td_male:mind_control", "td_male:chastity_belt", "td_male:dickgirl_on_male", "td_male:prostate_massage", "td_male:piss_drinking", "td_male:bdsm", "td_male:rape", "td_male:cheating", "td_male:fisting", "td_male:toddlercon", "td_male:double_penetration", "td_male:mind_break", "td_male:yaoi", "td_male:males_only", "td_male:snuff", "td_male:blood", "td_male:vomit", "td_male:vore", "td_male:scat", "td_male:blackmail", "td_male:torture", "td_male:slave", "td_male:eyepatch", "td_male:diaper", "td_male:infantilism", "td_male:urination", "td_male:schoolgirl_uniform", "td_male:feminization", "td_male:old_man", "td_male:drugs", "td_male:bondage", "td_male:guro", "td_male:harem", "td_male:gender_bender", "td_male:orc", "td_male:monster", "td_male:netorare"
];




/*************************************************************************************************************************
 *  Start
 *************************************************************************************************************************/
GM_addStyle ( "a:visited .glink,a:active {   \
     color:#008800; \
    }" );


window.main = function(){

    var path = window.location.href.slice(21);  // "https://exhentai.org/" wegschneiden von der ganzen Adresse
//    alert(window.location.href + "|     >" + path.slice(0,7));

    var i, j;
    var eintrag;
    var newdiv;
    var dieser_eintrag;
    var suchtext;
    var alle_tags;
    var anzeigemode = 0;


    if(window.location.href.slice(8,10) != "ex")
    {
        SERIENFARBE = GREEN;
        TAGFARBE = GREEN;
        MANGAKAFARBE = BLUE;
        TRANSLATORFARBE = YELLOWGREEN;
        BLACKLISTFARBE = RED;
        WHITELISTFARBE = GREEN;
        NEWMANGAFARBE = GREEN;
    }


   

//****************************************************************************************************************************
//****************************************************************************************************************************
// Bissl was für E-Hentai, richtung Dark-Mode ********************************************************************************
//****************************************************************************************************************************
//****************************************************************************************************************************
    if(window.location.href.lastIndexOf("e-hentai") != -1)
    {
        // Hintergrund grau
        document.body.style.backgroundColor = '#363636';
        // Oberen Bereich grau
        if(document.getElementsByClassName("ido")[0] != null)
        {
            document.getElementsByClassName("ido")[0].style.backgroundColor = '#606060';
            document.getElementById("rangebar").style.backgroundColor = '#707070';
        }

        // Gallery:
        if(document.getElementsByClassName("gm")[0] != null)
        {
            document.getElementsByClassName("gm")[0].style.backgroundColor = '#606060';
            document.getElementById("gd2").style.backgroundColor = '#606060';
            document.getElementById("gmid").style.backgroundColor = '#606060';
            document.getElementById("gdt").style.backgroundColor = '#606060';
            document.getElementById("cdiv").style.backgroundColor = '#606060';

        }
    }
//****************************************************************************************************************************
//****************************************************************************************************************************
//****************************************************************************************************************************
//****************************************************************************************************************************

    

//****************************************************************************************************************************
//****************************************************************************************************************************
if(path.slice(0,1) =='g') {   // wenn in der Gallery-Ansicht *****************************************************************
//****************************************************************************************************************************
//****************************************************************************************************************************

    /*************************************************************************************************************************
     *  Whitelist highlighten
     *************************************************************************************************************************/
    for(i = 0; ; i++)
    {
        if(whitelist[i] == null)
        {
            break;
        }

        eintrag = document.getElementById(whitelist[i]);

        if(eintrag != null)
        {
            eintrag.style.backgroundColor = WHITELISTFARBE;
            eintrag.style.borderColor = GREEN;
        }
    }

    /*************************************************************************************************************************
     *  Blacklist highlighten
     *************************************************************************************************************************/
    for(i = 0; ; i++)
    {
        if(blacklist[i] == null)
        {
            break;
        }

        eintrag = document.getElementById(blacklist[i]);

        if(eintrag != null)
        {
            eintrag.style.backgroundColor = BLACKLISTFARBE;
            eintrag.style.borderColor = RED;
        }
    }

    /*************************************************************************************************************************
     *  Gelesene Mangaka highlighten
     *************************************************************************************************************************/
    for(i = 0; ; i++)
    {
        if(mangaka_gelesen[i] == null)
        {
            break;
        }

        eintrag = document.getElementById(mangaka_gelesen[i]);

        if(eintrag != null)
        {
            eintrag.style.backgroundColor = MANGAKAFARBE ;
            eintrag.style.borderColor = BLUE;
        }
    }

    /*************************************************************************************************************************
     *  Blacklist Mangaka highlighten
     *************************************************************************************************************************/
    for(i = 0; ; i++)
    {
        if(blacklist_mangaka[i] == null)
        {
            break;
        }

        eintrag = document.getElementById(blacklist_mangaka[i]);

        if(eintrag != null)
        {
            eintrag.style.backgroundColor = BLACKLISTFARBE;
            eintrag.style.borderColor = RED;
        }
    }


//****************************************************************************************************************************
//****************************************************************************************************************************
}   // Ende vom if(Gallery-Ansicht) ******************************************************************************************
else if(path.slice(0,1) =='s') {   // wenn in der Lesen-Ansicht **************************************************************


    // noch nix hier (brauchts auch nix soweit)


}   // Ende vom if(Lesen-Ansicht) ********************************************************************************************
else {  // In der Hauptseite *************************************************************************************************
//****************************************************************************************************************************
//****************************************************************************************************************************


    /*************************************************************************************************************************
     *  Farbübersicht oben rein
     *************************************************************************************************************************/
    newdiv = document.getElementById("searchbox").cloneNode(false);
    newdiv.id = "farbenuebersicht";
    newdiv.style.height = "14px";

    document.getElementById("toppane").appendChild(newdiv);

    newdiv = document.createElement("div");
    newdiv.id = "serie";
    newdiv.style.background = SERIENFARBE;
    newdiv.style.float = "left";
    newdiv.style.width = "15%";
    newdiv.innerHTML = "Serien";

    document.getElementById("farbenuebersicht").appendChild(newdiv);

    newdiv = document.createElement("div");
    newdiv.id = "mangaka";
    newdiv.style.background = MANGAKAFARBE;
    newdiv.style.float = "left";
    newdiv.style.width = "15%";
    newdiv.innerHTML = "Mangaka";

    document.getElementById("farbenuebersicht").appendChild(newdiv);

    newdiv = document.createElement("div");
    newdiv.id = "Translator";
    newdiv.style.background = TRANSLATORFARBE;
    newdiv.style.width = "15%";
    newdiv.style.float = "left";
    newdiv.innerHTML = "Translator";

    document.getElementById("farbenuebersicht").appendChild(newdiv);

    /*************************************************************************************************************************
     *  Neue Gallerien anders markieren (grün statt nur fett gedruckt
     *************************************************************************************************************************/
    eintrag = document.getElementsByClassName("glnew")

    for(i = 0; i < eintrag.length; i++)
    {
        eintrag[i].style.color = NEWMANGAFARBE;
    }

    /*************************************************************************************************************************
     *  Serien highlighten
     *************************************************************************************************************************/
    eintrag = document.getElementsByClassName("gl3m glname"); //whitelist[i]);
    if(eintrag.length == 0)
    {
        eintrag = document.getElementsByClassName("gl3c glname");
        anzeigemode = 1;
    }

    for(i = 0; i < eintrag.length; i++)
    {
        dieser_eintrag = eintrag[i].textContent.toLowerCase();
        for(j = 0; j < serien.length; j++)
        {
            if (dieser_eintrag.indexOf(serien[j].toLowerCase()) != -1)
            {
                eintrag[i].style.backgroundColor = SERIENFARBE;
            }
        }
    }

    /*************************************************************************************************************************
     *  Translator highlighten
     *************************************************************************************************************************/
    suchtext = document.getElementById("f_search").value;

    eintrag = document.getElementsByClassName("gl3m glname");
    if(eintrag.length == 0)
    {
        eintrag = document.getElementsByClassName("gl3c glname");
    }

    for(i = 0; i < eintrag.length; i++)
    {
        dieser_eintrag = eintrag[i].firstChild.firstChild.textContent.toLowerCase();

        //alert(">" + dieser_eintrag);

        for(j = 0; j < translator.length; j++)
        {
            // kommt translator[j] im text dieses Eintrages vor?
            if (dieser_eintrag.indexOf(translator[j].toLowerCase()) != -1)
            {
                // Nur machen wenn der name von diesem Translator NICHT in der Suchleiste steht
                if(suchtext.toLowerCase().indexOf(translator[j].toLowerCase()) == -1)
                {
                    eintrag[i].style.backgroundColor = TRANSLATORFARBE;
                }
            }
        }
    }

    /*************************************************************************************************************************
     *  Mangaka highlighten
     *************************************************************************************************************************/
    suchtext = document.getElementById("f_search").value;

    eintrag = document.getElementsByClassName("gl3m glname");
    if(eintrag.length == 0)
    {
        eintrag = document.getElementsByClassName("gl3c glname");
    }

    for(i = 0; i < eintrag.length; i++)
    {
        dieser_eintrag = eintrag[i].textContent.toLowerCase();

        for(j = 0; j < mangaka.length; j++)
        {
            // kommt mangaka[j] im text dieses Eintrages vor?
            if (dieser_eintrag.indexOf(mangaka[j].toLowerCase()) != -1)
            {
                // Nur machen wenn der name von diesem Mangaka NICHT in der Suchleiste steht
                if(suchtext.toLowerCase().indexOf(mangaka[j].toLowerCase()) == -1)
                {
                    eintrag[i].style.backgroundColor = MANGAKAFARBE;
                }
            }
        }
    }



    /*************************************************************************************************************************
     *  Tags Highlighten aber nur im Compact Mode
     *************************************************************************************************************************/
    if(anzeigemode == 1)
    {
        alle_tags = document.getElementsByClassName("gt");

        for(i = 0; i < alle_tags.length; i++)
        {
            if(alle_tags[i].title == "language:english")
            {
                alle_tags[i].remove();
                i--;
                continue;
            }
            if(alle_tags[i].title == "language:translated")
            {
                alle_tags[i].remove();
                i--;
                continue;
            }
            if(alle_tags[i].title.includes("character"))
            {
                alle_tags[i].remove();
                i--;
                continue;
            }
            if(alle_tags[i].title.includes("group"))
            {
                alle_tags[i].remove();
                i--;
                continue;
            }
            if(alle_tags[i].title.includes("artist"))
            {
                alle_tags[i].remove();
                i--;
                continue;
            }
            if(alle_tags[i].title.includes(":incest"))
            {
                alle_tags[i].style.backgroundColor = TAGFARBE;
                alle_tags[i].style.borderColor = GREEN;
                continue;
            }
            if(alle_tags[i].title.includes("parody:"))
            {
                alle_tags[i].style.backgroundColor = DARK_ORANGE;
                alle_tags[i].style.borderColor = ORANGE;
                continue;
            }






            for(j = 0; j < whitelist.length; j++)
            {
                if(alle_tags[i].title == whitelist[j].replace("td_", "").replace('_',' '))
                {
                    alle_tags[i].style.backgroundColor = WHITELISTFARBE;
                    alle_tags[i].style.borderColor = GREEN;
                }
            }

            for(j = 0; j < blacklist.length; j++)
            {
                if(alle_tags[i].title == blacklist[j].replace("td_", "").replace('_',' '))
                {
                    alle_tags[i].style.backgroundColor = BLACKLISTFARBE;
                    alle_tags[i].style.borderColor = RED;
                }
            }



        }

    }



}   // Ende vom else (Hauptseite)
//****************************************************************************************************************************
//****************************************************************************************************************************
//****************************************************************************************************************************
//****************************************************************************************************************************
//****************************************************************************************************************************
//****************************************************************************************************************************



};  // Ende von:    window.main = function(){

window.setTimeout(main,100);


/*************************************************************************************************************************
 *  Just to search for Elements by Classname
 *************************************************************************************************************************/
function getElementsByClassName(node, classname) {
    var a = [];
    var re = new RegExp('(^| )'+classname+'( |$)');
    var els = node.getElementsByTagName("*");
    for(var i=0,j=els.length; i<j; i++)
        if(re.test(els[i].className))a.push(els[i]);
    return a;
}


/*  Versionshistory:
 *  ----------------------
 *  1.0 - 10.12.16:
 *	Erstellt
 *  1.0.1 - 17.12.16:
 *      Änderung in der Einfärbung. Wenn der Text Farbe hatte funktionierte das anklicken und "Show Tagged Galleries" nicht
 *      + Faben leicht ge#ndert und Rahmen eingef#rbt
 *  1.1.0 - 24.12.16:
 *      Man kann nun Serien farblich hervorheben
 *  1.2.0 - 30.12.16:
 *      Ergänzt, dass nach Mangaka eingefärbt wird (wird nur eingefärbt, wenn man nicht nach diesem gesucht hat)
 *      + kleiner Rahmen unter dem Suchfeld, mit Übersicht der Farben
 *  1.3.0 - 28.07.17:
 *      Ergänzt, dass Mangaka die ich schon durch hab in der "Lesen Ansicht (wo die Tags stehen)" gehighlightet werden
 *  1.4.0 - 18.11.17:
 *      Blacklist-Mangaka hinzu gefügt
 *  1.5.0 - 01.01.18:
 *      Farbhighlight für Translatorgruppe in die Hauptseite eingebaut
 *  1.5.1 - 13.02.18:
 *      Bei Mangaka und Gruppe Highlighten den "suchtext" gefixt
 *  1.5.2 - 26.08.18:
 *      kleine Fixe - Variablen explizit deklariert...
 *  1.6.x - 10.03.19:
 *      minimale Anpassung und Versionserhöhung für Verwendung über Greasyfork
 *  2.0.0 - 22.03.19
 *      Anpassung an das neue Layout (kleiner Bugfix für "minimal Layout" und Zusatzfunktion für "Compact Layout"
 *  2.0.1 - 22.03.19
 *      Bugfix mit dem Titel...
 *  2.2.x - 22.03.19
 *      eingebaut, dass incest auch grün ist
 *      eingebaut, dass parody orange hinterlegt ist (damit man es im compact besser auseinander halten kann)
 *  2.3.x - 02.09.20
 *      geht evtl auch direkt auf e-hentai ?
 *  2.4.x - 03.09.20
 *      umbau, damit es sauber auf exhentai und e-hentai geht
 *  2.5.x - 02.11.22
 *      Fix, weil die eine Klasse umbenannt haben...
 *  2.6.x - 05.11.2022
 *      Fix für den vorherigen Fix, weil ich es verpeilt hab :)
 *  2.7.x - 10.12.2022
 *      Bissl was rein, damit es auf e-hentai dunkler ist
 *  2.8.x - 08.08.2023
 *      Besuchte Links sind nun dunkelgrün
 */