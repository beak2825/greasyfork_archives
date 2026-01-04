// ==UserScript==
// @name           DEPRECATED: NJPW World Infinite Video Scrolling
// @version        2.0.0
// @description    Infinite scrolling for the NJPW World video library, powered by Metafizzy's Isotope.js and Infinite-Scroll.js
// @namespace      https://daveyjake.dev
// @author         Davey Jacobson <daveyjake21 [at] geemail [dot] com>
// @match          *://njpwworld.com/*
// @include        *://njpwworld.com/search*
// @include        *://njpwworld.com/tag*
// @include        *://front.njpwworld.com/*
// @require        https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require        https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js
// @require        https://unpkg.com/infinite-scroll@3/dist/infinite-scroll.pkgd.min.js
// @grant          none
// @noframes
// @license        GPL v3
// @downloadURL https://update.greasyfork.org/scripts/373166/DEPRECATED%3A%20NJPW%20World%20Infinite%20Video%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/373166/DEPRECATED%3A%20NJPW%20World%20Infinite%20Video%20Scrolling.meta.js
// ==/UserScript==
( function( win, undefined ) {
    'use strict';

    // Standard globals.
    const doc  = document,
          html = doc.documentElement,
          head = doc.head,
          body = doc.body;

    if ( location.pathname.match( /\/p\// ) || _.includes( body.classList, 'page-dir-p' ) ) {
        return;
    }

    // Add `Y-m-d` format to Date.
    Date.prototype.Ymd = function() {
        const m = this.getMonth() + 1,
              d = this.getDate();

        return [
            this.getFullYear(),
            ( 9 < m ? '' : '0' ) + m,
            ( 9 < d ? '' : '0' ) + d
        ].join( '-' );
    };

    // Begin NJPW Infinite Scroll.
    const njpwInfScroll = {
        containerParent: '.contents-left',
        container: '.second-movie-box',
        query: '#top > .contents-wrapper > .contents-wrapper .second-movie-box .movieArea',
        target: '.movieArea',
        paginate: '#top > .contents-wrapper > .contents-wrapper .default-w-block .pager',
        nextPage: 'a.next',
        pageLoadStatusClass: '.page-load-status',
        pageLoadStatus: '<style id="infAnimation">.loader-wheel{font-size:64px;position:relative;height:1em;width:1em;padding-left:.45em;overflow:hidden;margin:0 auto;animation:loader-wheel-rotate .5s steps(12) infinite}.loader-wheel i{display:block;position:absolute;height:.3em;width:.1em;border-radius:.05em;background:#333;opacity:.8;transform:rotate(-30deg);transform-origin:center .5em}@keyframes loader-wheel-rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}</style><p class="infinite-scroll-request"><div class="loader-wheel"><i><i><i><i><i><i><i><i><i><i><i><i></i></i></i></i></i></i></i></i></i></i></i></i></div></p><p class="infinite-scroll-last">End of content</p><p class="infinite-scroll-error">No more pages to load</p>',
        urlPaths: ['/search', '/search/latest', '/search/tag', '/search/tag/mic_82', '/tag'],
        tags: {"man_1_en":"Antonio Inoki","man_2_en":"Seiji Sakaguchi","man_3_en":"Lou Thesz","man_4_en":"Karl Gotch","man_5_en":"Johnny Powers","man_6_en":"Strong Kobayashi","man_7_en":"Killer Karl Krupp","man_8_en":"Kintaro Oki","man_9_en":"Tiger Jeet Singh","man_10_en":"Jack Brisco","man_11_en":"Jerry Brown","man_12_en":"Buddy Roberts","man_13_en":"Bill Robinson","man_14_en":"William Ruska","man_15_en":"Andr\u00e9 the Giant","man_16_en":"Umanosuke Ueda","man_17_en":"The Monsterman","man_18_en":"Chuck Wepner","man_19_en":"The Great Antonio","man_20_en":"Carlos Jos\u00e9 Estrada","man_99_en":"Tatsumi Fujinami","man_22_en":"Ryuma Go","man_23_en":"Roland Bock","man_24_en":"Hiro Matsuda","man_25_en":"Mr.X","man_26_en":"Lefthook Dayton","man_27_en":"Stan Hansen","man_28_en":"EL Canek","man_29_en":"Masa Saito","man_30_en":"Riki Choshu","man_31_en":"Dusty Rhodes","man_32_en":"Bob Backlund","man_126_en":"Kengo Kimura","man_34_en":"Dynamite KID","man_35_en":"Ricky Morton","man_36_en":"Ashura Hara","man_37_en":"Kotetsu Yamamoto","man_38_en":"Kantaro Hoshino","man_39_en":"Goro Tsurumi","man_40_en":"Katsuzo Oiyama","man_41_en":"Satoru Sayama","man_42_en":"Gran Hamada","man_43_en":"Baby Face","man_44_en":"PerroAguayo","man_45_en":"Chavo Guererro","man_46_en":"Hulk Hogan","man_48_en":"Yoshiaki Yatsu","man_49_en":"Abdullah the Butcher","man_50_en":"Villano\u2162","man_51_en":"El Solitario","man_52_en":"Robert Gibson","man_53_en":"El Solar","man_54_en":"Rusher Kimura","man_55_en":"Masked Hurricane","man_56_en":"Animal Hamaguchi","man_57_en":"Dino Bravo","man_58_en":"Tiger Toguchi","man_59_en":"Dick Murdoch","man_60_en":"Rene Goulet","man_61_en":"Yoshiaki Fujiwara","man_62_en":"Steve Wright","man_64_en":"Black Tiger","man_65_en":"Ultraman","man_66_en":"Kuniaki Kobayashi","man_67_en":"Isamu Teranishi","man_68_en":"Akira Maeda","man_69_en":"Paul Orndorff","man_70_en":"The Cobra","man_72_en":"Adrian Adonis","man_73_en":"Bad News Allen","man_74_en":"Bruiser Brody","man_75_en":"Giant Machine","man_76_en":"Super Machine","man_77_en":"Keiji Muto","man_78_en":"Tony St. Clair","man_79_en":"Jimmy Snuka","man_80_en":"Masked Superstar","man_92_en":"Nobuhiko Takada","man_83_en":"Keiichi Yamada","man_84_en":"Osamu Kido","man_85_en":"Shiro Koshinaka","man_86_en":"Kazuo Yamazaki","man_87_en":"Shogun KY Wakamatsu","man_88_en":"Don Nakaya Nielsen","man_89_en":"Kevin Von Erich","man_90_en":"Shinya Hashimoto","man_91_en":"Masahiro Chono","man_93_en":"Super Strong Machine","man_94_en":"Big Van Vader","man_95_en":"Masakatsu Funaki","man_96_en":"Giulia","man_97_en":"Ryu Lee","man_98_en":"Luciferno","man_100_en":"Bam Bam Bigelow","man_101_en":"Naoki Sano","man_102_en":"Hiro Saito","man_103_en":"George Takano","man_104_en":"Hiroshi Hase","man_105_en":"Michael Richards","man_106_en":"Salman Hashimikov","man_107_en":"Shota Samsonovich Chochishvili","man_108_en":"Vladim\u00edr Berkovich","man_109_en":"Buzz Sawyer","man_110_en":"Victor Zangiev","man_111_en":"Benny Urquidez","man_112_en":"Shinya Asuka","man_113_en":"Wach Eburoefu","man_114_en":"Tatsutoshi Goto","man_115_en":"Jyushin Thunder Liger","man_116_en":"Osamu Matsuda","man_117_en":"Takayuki Iizuka","man_118_en":"Koji Kitao","man_119_en":"Akira Nogami","mic_121_en":"Shunsuke Sayama","man_122_en":"Norio Honaga","man_123_en":"Brad Rheingans","man_124_en":"Steve Williams","man_125_en":"Larry Zbyszko","man_128_en":"Genichiro Tenryu","man_129_en":"Punisher Dice Morgan","man_130_en":"Masashi Aoyagi","man_131_en":"The Road Warriors","man_132_en":"Masanobu Kurisu","man_133_en":"The Great Muta","man_134_en":"Kensuke Sasaki","man_135_en":"RicK Flair","man_136_en":"ZETMAN","man_137_en":"Brian Pillman","man_138_en":"Tim Horner","man_139_en":"Scott Norton","man_140_en":"Exliser","man_141_en":"Andrew Villalobos","man_142_en":"Arn Anderson","man_143_en":"Barry Windham","man_144_en":"Scott Steiner","man_145_en":"Rick Steiner","man_146_en":"El Gigante","man_147_en":"Big Cat Hughes","man_148_en":"Ron Simmons","man_149_en":"Butch Reed","man_150_en":"Sting","man_151_en":"Tony Halme","man_152_en":"Black Cat","man_153_en":"Hiroyoshi Yamamoto","man_154_en":"Lex Luger","man_155_en":"Michiyoshi Ohara","man_156_en":"KIM DUK","man_157_en":"Dusty Rhodes Jr.","man_158_en":"Bill Kazmaier","man_159_en":"Akitoshi Saito","man_160_en":"The Steiner Brothers","man_161_en":"Rick Rude","man_162_en":"Steve Austin","man_163_en":"Mark Tui","man_164_en":"Aaron Solow","man_165_en":"El Samurai","man_166_en":"Nobukazu Hirai","man_167_en":"Masao Orihara","man_168_en":"Nick Bury","man_169_en":"The Great Kabuki","man_170_en":"Ultimo Dragon","man_171_en":"Power Warrior","man_172_en":"Hawk Warrior","man_173_en":"Takashi Ishikawa","man_174_en":"Kodo Fuyuki","man_175_en":"Koki Kitahara","man_176_en":"Hellraisers","man_177_en":"Manabu Nakanishi","man_178_en":"Yuji Nagata","man_179_en":"Satoshi Kojima","man_180_en":"Brutus Beefcake","man_181_en":"Hercules Hernandez","man_182_en":"Tadao Yasuda","man_183_en":"Wild Pegasus","man_184_en":"Gedo","man_185_en":"The Great Sasuke","man_186_en":"Dean Malenko","man_187_en":"Shinjiro Otani","man_188_en":"Super Delfin","man_189_en":"Taka Michinoku","man_190_en":"Masayoshi Motegi","man_191_en":"Negro Casas","man_192_en":"Ricky Fuji","man_193_en":"Hayabusa","man_194_en":"Junji Hirata","man_195_en":"Sabu","man_196_en":"Koji Kanemoto","man_197_en":"Hiroyoshi Tenzan","man_198_en":"Tiger Jeet Singh Jr.","man_199_en":"Tony Balmora","man_200_en":"Gerard Gordeau","man_201_en":"Tony Kozina","man_202_en":"Yoji Anjo","man_203_en":"Tatsuo Nakano","man_204_en":"Tokimitsu Ishizawa","man_205_en":"Hiromitsu Kanehara","man_206_en":"Kazushi Sakuraba","man_207_en":"Kenichi Yamamoto","man_208_en":"Takashi Iizuka","man_209_en":"Tiger","man_210_en":"Masahito Kakihara","man_211_en":"Amazing Red","man_212_en":"Yoshihiro Takayama","man_213_en":"Jinsei Hakushi Shinzaki","man_214_en":"Kazuyuki Fujita","man_215_en":"Osamu Nishimura","man_216_en":"TJP","man_217_en":"Super Liger","man_218_en":"Jinsei Shinzaki","man_219_en":"Yoshihiro Tajiri","man_220_en":"Kendo Nagasaki","man_221_en":"Shoji Nakamaki","man_222_en":"Great Kojika","man_223_en":"Willie Williams","man_224_en":"Tiger King","man_225_en":"Dulce Gardenia","man_226_en":"Yutaka Yoshie","man_227_en":"Tatsuhito Takaiwa","man_229_en":"Don Frye","man_230_en":"Denis Hurricane Lane","man_231_en":"Misterioso","man_233_en":"Barrett Brown","man_234_en":"Logan Riegel","man_235_en":"Atsushi Onita","man_236_en":"Dave Beneteau","man_237_en":"Brian Johnston","man_238_en":"Sterling Riegel","man_239_en":"Minoru Tanaka","man_240_en":"Kendo Kashin","man_242_en":"Kenzo Suzuki","man_243_en":"Kimo","man_244_en":"Randy Savage","man_245_en":"Toshiaki Kawada","man_246_en":"Shinya Makabe","man_247_en":"Jun Akiyama","man_248_en":"Masayuki Naruse","man_249_en":"Katsuyori Shibata","man_250_en":"Wataru Inoue","man_251_en":"Gabriel Kidd","man_252_en":"AKIRA","man_253_en":"Kazunari Murakami","man_254_en":"Yuki Ishikawa","man_256_en":"Hiroshi Tanahashi","man_257_en":"Dan Tamura","man_259_en":"Jado","man_260_en":"Dick Togo","man_261_en":"Giant Silva","man_262_en":"Ed Leslie","man_263_en":"Daijiro Matsuda","man_264_en":"Giant Shin","man_265_en":"Mitsuharu Misawa","man_266_en":"Bob Sapp","man_267_en":"Don Muraco","man_268_en":"Tsuyoshi Kosaka","man_269_en":"Josh Barnett","man_270_en":"Ryushi Yanagisawa","man_271_en":"Makai No.1","man_272_en":"Daimajin","man_273_en":"Makai No.4","man_274_en":"Makai No.5","man_275_en":"Ellinger Akim","man_276_en":"Takehiro Murahama","man_277_en":"Heat","man_278_en":"Shinsuke Nakamura","man_279_en":"Kenta Kobashi","man_280_en":"Naofumi Yamamoto","man_281_en":"Hirooki Goto","man_282_en":"Minoru Suzuki","man_283_en":"Katsushi Takemura","man_284_en":"Ense Inoue","man_285_en":"Ryota Chikuzen","man_286_en":"Mitsuya Nagai","man_287_en":"Blue Wolf","man_288_en":"Toru Yano","man_289_en":"Ryusuke Taguchi","man_290_en":"Akiya Anzawa","man_291_en":"Mohamed Karim","man_292_en":"Takashi Sugiura","man_293_en":"Katsuhiko Nagata","man_294_en":"Ron Waterman","man_295_en":"Dolgorsuren Sumiyabazar","man_296_en":"Ryoji Sai","man_297_en":"Takao Omori","man_299_en":"Davis Storm","man_300_en":"Masato Tanaka","man_301_en":"Kintaro Kanemura","man_302_en":"Bad Boy Hido","man_303_en":"Kawato San","man_304_en":"Tomohiro Ishii","man_305_en":"Hiroshi Nagao","man_306_en":"Kohei Sato","man_307_en":"Takashi Uwano","man_308_en":"Yoshihito Sasaki","man_309_en":"Kamikaze","man_310_en":"Daisuke Sekimoto","man_311_en":"Akebono","man_312_en":"BS Machine","man_313_en":"Giant Bernard","man_314_en":"Masanobu Fuchi","man_315_en":"Kikutaro","man_316_en":"Akira Raijin","man_317_en":"Nobutaka Araya","man_318_en":"Rongai Nosawa","man_320_en":"Togi Makabe","man_321_en":"Buchanan","man_322_en":"Travis Tomko","man_323_en":"D'Lo Brown","man_324_en":"Suwama","man_325_en":"RO'Z","man_327_en":"Kazu Hayashi","man_329_en":"Shuji Kondo","man_330_en":"Milano Collection A.T.","man_331_en":"Taiyo Care","man_332_en":"Blue Panther","man_333_en":"Petey Williams","man_335_en":"Prince Devitt","man_338_en":"Felino","man_339_en":"Aero Boy","man_340_en":"MR. AGUILA","man_341_en":"Stevie Filip","man_342_en":"Tome Filip","man_343_en":"Jack Bonza","man_345_en":"Alex Zayne","man_346_en":"Atsuki Aoyagi","man_347_en":"Taichi Ishikari","man_348_en":"Nobuo Yoshihashi","man_349_en":"Kazuchika Okada","man_350_en":"Mitsuhide Hirasawa","man_351_en":"Mistico","man_352_en":"Averno","man_353_en":"Takuma Sano","man_354_en":"Chris Sabin","man_355_en":"Alex Shelley","man_356_en":"Tetsuya Naito","man_358_en":"LOW-KI","man_359_en":"Kevin Nash","man_360_en":"Karl Anderson","man_363_en":"Hejor Kidman","man_364_en":"Ultra Soki","man_365_en":"Koji Niizumi","man_366_en":"El Brave","man_367_en":"Ultimo Guerrero","man_368_en":"Cosmo Soldier","man_369_en":"Satoshi Ogawa","man_371_en":"Terry Funk","man_372_en":"Muhammad Yone","man_373_en":"Naomichi Marufuji","man_374_en":"Go Shiozaki","man_375_en":"Tama Tonga","man_376_en":"Tomoaki Honma","man_377_en":"Yujiro Takahashi","man_379_en":"Kenny Omega","man_380_en":"Taichi","man_381_en":"Aztec","man_384_en":"Strongman","man_385_en":"La Sombra","man_386_en":"M\u00e1scara Dorada","man_387_en":"H\u00e9ctor Garza","man_389_en":"Kota Ibushi","man_390_en":"Senza Volto","man_391_en":"Michael Oku","man_392_en":"Takuya Nomura","man_393_en":"Greg Valentine","man_394_en":"Davey Boy Smith","man_395_en":"Duke Myers","man_396_en":"Charlie Haas","man_398_en":"Lance Archer","man_399_en":"Gerry Morrow","man_400_en":"Strong Machine No.1","man_401_en":"Strong Machine No.2","man_402_en":"Cowboy\" Bob Orton","man_403_en":"KUSHIDA","man_404_en":"Anoaro Atisanoe","man_405_en":"Kyosuke Mikami","man_406_en":"Captain New Japan","man_407_en":"Rocky Romero","man_408_en":"Davey Richards","man_409_en":"Valiente","man_410_en":"ATLANTIS","man_411_en":"Masayuki Kono","man_413_en":"Shelton X Benjamin","man_415_en":"Shunji Kosugi","man_416_en":"YOSHI-HASHI","man_417_en":"BUSHI","man_418_en":"Daisuke Sasaki","man_419_en":"Alex Koslov","man_420_en":"Brian Kendrick","man_421_en":"Angel de Oro","man_423_en":"Pat Kelly","man_425_en":"Shiryu","man_428_en":"Hiroshi Yamato","man_429_en":"Hiromu Takahashi","man_430_en":"Manabu Soya","man_431_en":"Mike Kelly","man_432_en":"Rip Oliver","man_433_en":"Seiya Sanada","man_434_en":"Joe Doering","man_435_en":"Rambo Sakurada","man_436_en":"Konga the Barbarian","man_437_en":"Alexis Smirnoff","man_438_en":"Rush","man_439_en":"Harry Smith","man_440_en":"Kengo Mashimo","man_441_en":"Davey Boy Smith Jr.","man_442_en":"Masaaki Mochizuki","man_443_en":"Angelo Mosca","man_444_en":"Rob Conway","man_445_en":"King Fale","man_446_en":"Beretta","man_447_en":"Ricochet","man_448_en":"Super Fly TUI","man_449_en":"Kevin Sullivan","man_450_en":"Terrible","man_451_en":"Bad Luck Fale","man_452_en":"King Kong Bundy","man_453_en":"Gene Lewis","man_454_en":"Gary Fulton","man_455_en":"Strong Machine","man_456_en":"Rey Bucanero","man_457_en":"Takaaki Watanabe","man_458_en":"Larry Sharpe","man_459_en":"Matt Jackson","man_460_en":"Nick Jackson","man_461_en":"Matt Borne","man_463_en":"JAX DANE","man_464_en":"Yohei Komatsu","man_465_en":"Doc Gallows","man_466_en":"Rolles Gracie","man_467_en":"Daniel Gracie","man_468_en":"Volador Jr.","man_469_en":"Mephisto","man_476_en":"Michael Tarver","man_477_en":"Big Daddy Yum Yum","man_481_en":"Bandido","man_483_en":"El Desperado","man_484_en":"Don Arakawa","man_485_en":"Steve Collins","man_486_en":"Mark Lewin","man_487_en":"Sho Tanaka","man_488_en":"The Cuban Assassin","man_489_en":"Pedro Morales","man_490_en":"EL Phantasmo","man_491_en":"David Starr","man_492_en":"Great-O-Kharn","man_493_en":"Walter","man_494_en":"Danny Duggan","man_495_en":"AJ Styles","man_496_en":"Wes Brisco","man_497_en":"Meng","man_498_en":"Mascara Don","man_499_en":"Fuego","man_500_en":"Michael Bennett","man_501_en":"Adam Cole","man_502_en":"Bobby Fish","man_503_en":"Kyle O'Reilly","man_504_en":"Maximo","man_505_en":"Chase Owens","man_506_en":"YOSHITATSU","man_507_en":"Akira Hokuto","man_508_en":"Bull Nakano","man_509_en":"Fishman","man_510_en":"Athol Foley","man_511_en":"Frank Monty","man_512_en":"The Barbarian","man_513_en":"Lord Steven Regal","man_514_en":"Marcus Bagwell","man_515_en":"nWo Sting","man_516_en":"Scott Hall","man_517_en":"Shane Haste","man_518_en":"Mikey Nicholls","man_519_en":"Jeff Jarrett","man_520_en":"TURRIN","man_521_en":"OKUMURA","man_522_en":"B\u00e1rbaro Cavernario","man_523_en":"Gran Guerrero","man_524_en":"Stuka Jr.","man_525_en":"Borabora","man_526_en":"Stigma","man_527_en":"Rey Cometa","man_528_en":"Jay White","man_529_en":"Akram Pahalwan","man_530_en":"Cody Hall","man_531_en":"Matt Taven","man_532_en":"Scorpion","man_533_en":"S.D. Jones","man_534_en":"La M\u00e1scara","man_535_en":"Maria Kanellis","man_536_en":"Amber Gallows","man_537_en":"Steve Anthony","man_538_en":"David Finlay","man_539_en":"Euforia","man_540_en":"Thunder","man_541_en":"Hitoshi Kumano","man_542_en":"Gemba Hirayanagi","man_543_en":"Jack Gamble","man_544_en":"John Web","man_545_en":"Captain Noah","man_546_en":"Zack Sabre Jr.","man_547_en":"Yoshinari Ogawa","man_548_en":"Daisuke Harada","man_549_en":"Maybach Taniguchi","man_550_en":"Shingo Takagi","man_551_en":"Diamante Azul","man_552_en":"Shocker","man_553_en":"Marco Corleone","man_554_en":"Monsieur Rambo","man_555_en":"The Great Oz","man_556_en":"CIMA","man_557_en":"Roger Smith","man_558_en":"Karl Fredericks","man_559_en":"Alex Coughlin","man_560_en":"Clark Connors","man_561_en":"Mark Briscoe","man_562_en":"Jay Briscoe","man_564_en":"Silas Young","man_565_en":"Michael Elgin","man_566_en":"Matt Sydal","man_567_en":"Dalton Castle","man_568_en":"ACH","man_569_en":"Roderick Strong","man_570_en":"Randy Sonton","man_572_en":"Mr.Pogo","man_575_en":"Italian Stallion","man_576_en":"Billy Jack","man_577_en":"Owen Hart","man_578_en":"Jyushin Liger","man_579_en":"Juice Robinson","man_580_en":"Great Kokina","man_581_en":"Wild Samoan","man_582_en":"Brad Armstrong","man_583_en":"Martin Kirby","man_584_en":"Big Damo","man_585_en":"\"King of Darkness\" EVIL","man_586_en":"Buddy Rose","man_587_en":"Sanshiro Takagi","man_588_en":"Iron Mike Sharpe","man_594_en":"Audaz","man_595_en":"GurukunMask","man_598_en":"Toru Sugiura","man_600_en":"Templarino","man_609_en":"Hikaru Sato","man_610_en":"Katsuhiko Nakajima","man_611_en":"Kotaro Nasu ","man_617_en":"Yuji Okabayashi","man_618_en":"Christopher Daniels","man_619_en":"Frankie Kazarian","man_621_en":"Ken Oka","man_622_en":"Flyer","man_623_en":"Lord Gideon Grey","man_624_en":"Forastero","man_625_en":"Joel Redman","man_626_en":"Marty Scurll","man_627_en":"Shaw Sameles","man_628_en":"James Castle","man_629_en":"Will Ospreay","man_630_en":"Jay Lethal","man_631_en":"King Haku","man_632_en":"Cheeseburger","man_633_en":"Dragon Lee","man_634_en":"Kamaitachi","man_635_en":"Tit\u00e1n","man_636_en":"Virus","man_637_en":"Bobby Z","man_638_en":"Hechicero","man_640_en":"Guerrero Maya Jr.","man_641_en":"Te Panther","man_642_en":"Hirai Kawato","man_643_en":"Teruaki Kanemitsu","man_644_en":"Takumi Honjo","man_645_en":"Tomoyuki Oka","man_646_en":"Katsuya Kitamura","man_647_en":"Moose","man_648_en":"Delirious","man_649_en":"Mitsuhiro Kitamiya","man_650_en":"Quiet Storm","man_651_en":"Taiji Ishimori","man_652_en":"Kaito Kiyomiya","man_653_en":"Atlantis Jr.","man_654_en":"Kyu Mogami","man_655_en":"GO Asakawa","man_656_en":"Ayato Yoshida","man_657_en":"Namajague","man_658_en":"Bambi","man_659_en":"Koharu Hinata","man_660_en":"Raijin","man_661_en":"Fujin","man_662_en":"Dragon George","man_663_en":"SweetGorilla Maruyama","man_664_en":"Gokiburi Mask","man_665_en":"Ginbae Mask","man_666_en":"Tracy Williams","man_667_en":"Brody King","man_668_en":"Tyler Bateman","man_669_en":"John Skyler","man_670_en":"Tomato  Kaji","man_671_en":"Shiori Asahi","man_672_en":"Ayumu Honda","man_673_en":"Hiro Tonai","man_674_en":"Taishi Takizawa","man_675_en":"Kotaro Yoshino","man_676_en":"Atsushi Kotoge","man_677_en":"Yoshinobu Kanemaru","man_678_en":"Tanga Loa","man_681_en":"Hanson","man_682_en":"Raymond Rowe","man_686_en":"Kenoh","man_687_en":"Hajime Ohara","man_688_en":"SANADA","man_689_en":"Shiro Tomoyose","man_690_en":"Masa Kitamiya","man_691_en":"Ryo Kawamura","man_692_en":"Hiroyo Matsumoto","man_693_en":"Andy Dalton","man_694_en":"Eclipse","man_695_en":"hangman Page","man_696_en":"Yuma Aoyagi","man_698_en":"Calistico","man_700_en":"Peat Dan","man_701_en":"Josh Bodom","man_703_en":"Lio Rush","man_705_en":"Henare","man_706_en":"Tracer X","man_707_en":"Harlem Bravado","man_708_en":"Kento Miyahara","man_709_en":"Jake Lee","man_710_en":"Kazushi Miyamoto","man_711_en":"Naoya Nomura","man_712_en":"Tomohiko Hashimoto","man_713_en":"Daichi Hashimoto","man_714_en":"Tiger Mask W","man_715_en":"Red Death Musk","man_717_en":"Billy Gunn","man_718_en":"Leland Race","man_719_en":"Brian Breaker","man_720_en":"Cody","man_722_en":"Johnny Rivera","man_723_en":"Blue Panther Jr.","man_724_en":"Ephesto","man_725_en":"Soberano Jr","man_726_en":"Raziel","man_727_en":"M\u00e1ximo Sexy","man_728_en":"Scotty Riggs","man_729_en":"Big Tyton","man_730_en":"Michael Wallstreet","man_731_en":"Dr. Wagner Jr.","man_732_en":"Masakazu Fukuda","man_733_en":"Kenny Kaos","man_734_en":"Robbie Rage","man_735_en":"Hayato Nanjo","man_736_en":"Mike Enos","man_737_en":"Ax Demolition","man_738_en":"Red Scorpion","man_739_en":"Dave Finlay","man_741_en":"Dan Devine","man_742_en":"Chris Candido","man_743_en":"Bobby Duncum","man_744_en":"Matt Riddle","man_746_en":"Silver King","man_747_en":"Panisher Martinez","man_748_en":"Shota Umino","man_749_en":"Koji Iwamoto","man_750_en":"Dinosaur Takuma","man_751_en":"Zack Gibson","man_752_en":"Ryan Smile","man_753_en":"SHANE STRICKLAND","man_754_en":"Tetsuhiro Yagi","man_755_en":"Daisuke Kanehira","man_757_en":"Bully Ray","man_758_en":"CHRIS BROOKES","man_759_en":"Travis Banks","man_760_en":"The Wild Samoan #1","man_761_en":"Don Diamond","man_762_en":"Gino Brito","man_773_en":"Mayu Iwatani","man_774_en":"Kelly Klein","man_775_en":"PCO","man_776_en":"Brian Adams","man_777_en":"DOUKI","man_778_en":"Jon Moxley","man_779_en":"KENTA","man_780_en":"Kurtis Chapmann","man_781_en":"Josh Wall","man_782_en":"Ren Narita","man_783_en":"Chris Jericho","man_785_en":"Leo Tonga","man_788_en":"SHO","man_789_en":"YOH","man_790_en":"Curry Man","man_791_en":"American Dragon","man_792_en":"TK O'Ryan","man_793_en":"Vinny Marseglia","man_795_en":"Jonathan Gresham","man_796_en":"Flip Gordon","man_797_en":"Chuck Taylor","man_798_en":"Shane Taylor","man_799_en":"Colt Cabana","man_801_en":"Keith Lee","man_806_en":"ChuckieT","man_807_en":"Jeff Cobb","man_808_en":"Sami Callihan","man_809_en":"SLEX","man_810_en":"Masked Horse","man_811_en":"Hacksaw Higgins","man_812_en":"Gino Gambino","man_813_en":"Toa Henare","man_814_en":"Disturbio","man_815_en":"Cuatrero","man_816_en":"Drone","man_817_en":"Star Jr.","man_818_en":"Sanson","man_820_en":"Puma","man_821_en":"Mark Davis","man_822_en":"Kyle Fletcher","man_823_en":"Hikuleo","man_824_en":"Kelly Brown","man_825_en":"Beer City Bruiser","man_826_en":"Jonah Rock","man_827_en":"Elliot Sexton","man_829_en":"Marcus Pitt","man_830_en":"Robbie Eagles","man_831_en":"Mick Moretti","man_832_en":"Damian Slater","man_833_en":"Jack \u00b7 J \u00b7 Bonza","man_834_en":"Mareko","man_835_en":"Scorpio Sky","man_836_en":"Rey Mysterio Jr.","man_837_en":"MANJIMARU","man_838_en":"Ken45\u00b0","man_839_en":"Yuya Uemura","man_840_en":"Yota Tsuji","man_847_en":"Tiger Mask (1st generation)","man_849_en":"Tiger Mask (3rd generation)","man_850_en":"Tiger Mask (4th generation)","man_851_en":"Master Wato","man_852_en":"OLIMPICO","man_854_en":"Yuto Nakashima","man_855_en":"Adam Thornstowe","man_856_en":"Luster \u201cThe Legend\u201d","man_858_en":"Reno Scum","man_859_en":"Cody Deaner","man_860_en":"Animal Warrior","man_861_en":"Aaron Henare","man_862_en":"VsK","man_863_en":"Danny Limelight","man_864_en":"Ace Austin","man_865_en":"Rohit Raju","man_866_en":"Acey Romero","man_867_en":"Eddie Edwards","man_868_en":"Josh Alexander","man_869_en":"Minoru","man_871_en":"Madman Fulton","man_872_en":"Rhyno","man_873_en":"Royce Isaacs","man_874_en":"JD Drake","man_875_en":"Takanori Ito","man_876_en":"Shera","man_877_en":"Chris Bey","man_878_en":"Fallah Bahh","man_882_en":"FRED ROSSER","man_884_en":"Jorel Nelson","man_886_en":"JR Kratos","man_887_en":"TOM LAWLOR","man_888_en":"Adrian Quest","man_889_en":"Fred Yehi","man_890_en":"Chris Dickinson","man_891_en":"Wheeler Yuta","man_892_en":"Ryohei Oiwa","man_893_en":"Kosei Fujita","man_894_en":"Maika","man_895_en":"Lady C","man_896_en":"Momo Watanabe","man_897_en":"Saya Kamitani","man_898_en":"Eddie Kingston","man_899_en":"Syuri","man_900_en":"Ricky Knight Jr.","man_901_en":"Connor Mills","man_902_en":"Willie Mack","man_903_en":"Bryan Danielson","man_904_en":"Trey Miguel","man_905_en":"Steve Maclin","man_906_en":"The Shadow","man_907_en":"W Morrissey","man_908_en":"Matt Cardona","man_909_en":"KALEB","man_910_en":"Killer rabbit","man_911_en":"Hideo Saito","man_915_en":"The Butcher ","man_916_en":"Orange Cassidy","man_917_en":"The Blade","man_918_en":"Raj Singh","man_919_en":"Fire Katsumi","man_920_en":"SEKIYA","man_921_en":"Genta Yubari","man_922_en":"Akira Jumonji","man_923_en":"Sumika Yanagawa","man_924_en":"rhythm","man_925_en":"Misa Kagura","man_926_en":"YAKO","man_927_en":"President Ram","man_928_en":"Nao Ishikawa","man_929_en":"Ryuya Takekura","man_930_en":"Eagle Mask","man_931_en":"T-Hawk","man_932_en":"Arata","man_933_en":"Tomoka Inaba","man_934_en":"Aoi","man_935_en":"Maya Yukihi","man_936_en":"Yu Yamagata","man_937_en":"KANON","man_938_en":"Ren Ayabe","man_939_en":"Yasutaka Yano","man_940_en":"King Tany","man_941_en":"Daiki Inaba","man_942_en":"Yoshiki Inamura","man_943_en":"Kinya Okada","man_944_en":"Seiki Yoshioka","man_945_en":"Tadasuke","man_946_en":"ALEJA","man_947_en":"HAYATA","man_948_en":"YO-HEY","man_949_en":"Tam Nakano","man_950_en":"Starlight Kid","man_951_en":"Jake Something","man_952_en":"Tony Loco","man_953_en":"Bob Roop","man_954_en":"Kurt Von Hess","man_955_en":"Jesse Ventura","man_956_en":"Killer Khan","man_957_en":"Mike Bailey","man_958_en":"Shunji Takano","man_959_en":"Strong Machine No. 3","man_960_en":"Eric Young","other_45_en":"All Match"},
        dateRegex: /([A-Za-z]{3}\s\d{1,2}\s?,\s?\d{4})/,

        /**
         * Find and parse date from video description.
         * 
         * @memberof njpwInfScroll
         * @function
         *
         * @param {string} label Video description content.
         */
        date( label ) {
            let dateFromLabel = label.slice( 0, 12 );

            if ( ! dateFromLabel.match( this.dateRegex ) && ! label.match( this.dateRegex ) ) {
                dateFromLabel = Date.now();
            } else {
                dateFromLabel = label.match( this.dateRegex )[0];

                if ( dateFromLabel.match( /[年月日]/ ) ) {
                    dateFromLabel = dateFromLabel.split( ' ' )[0];
                    dateFromLabel = dateFromLabel.replace( '日', '' );
                    dateFromLabel = dateFromLabel.replace( /[年月]/g, '-' );
                }
            }

            let date = new Date( dateFromLabel );

            return date.Ymd();
        },

        /**
         * jQuery's `$.extend` in pure vanilla JS.
         *
         * @author Chris Ferdinandi <chris@gomakethings.com>
         * @see {@link https://gomakethings.com/vanilla-javascript-version-of-jquery-extend}
         *
         * For a deep extend, set the `deep` argument to `true`.
         */
        extend() {
            // Variables
            let extended = {},
                deep     = false,
                i        = 0,
                length   = arguments.length;

            // Check if a deep merge
            if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
                deep = arguments[0];
                i++;
            }

            // Merge the object into the extended object
            const merge = function( obj ) {
                for ( const prop in obj ) {
                    if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                        // If deep merge and property is an object, merge properties
                        if ( deep && Object.prototype.toString.call( obj[ prop ] ) === '[object Object]' ) {
                            extended[ prop ] = extend( true, extended[ prop ], obj[ prop ] );
                        } else {
                            extended[ prop ] = obj[ prop ];
                        }
                    }
                }
            };

            // Loop through each object and conduct a merge
            for ( i; i < length; i++ ) {
                const obj = arguments[ i ];
                merge( obj );
            }

            return extended;
        },

        /**
         * Inject grid sizer for Isotope.
         * 
         * @memberof njpwInfScroll
         * @function
         */
        gridSizer() {
            let sizer = doc.createElement( 'div' );
            sizer.setAttribute( 'class', 'movieArea--sizer' );
            sizer.style.width = '2.7777777778%';
            //sizer.style.width = '31.4814814815%';

            document.querySelectorAll( this.container )[0].insertBefore( sizer, document.querySelectorAll( this.target )[0] );
        },

        /**
         * `ParseArgs` for JavaScript; like `wp_parse_args`.
         *
         * @memberof njpwInfScroll
         * @function
         * @uses     njpwInfScroll#extend
         *
         * @param {Object} args     Function parameters.
         * @param {Object} defaults Function parameter default values.
         */
        parseArgs( args, defaults ) {
            if ( typeof args !== 'object' )
            {
                args = {};
            }

            if ( typeof defaults !== 'object' )
            {
                defaults = {};
            }
            return this.extend( {}, defaults, args );
        },

        /**
         * Parse the retrieved items and add a `data-filter` attribute.
         *
         * @memberof njpwInfScroll
         * @function
         * 
         * @param {array} items Elements to parse.
         */
        parseItems( items ) {
            return _.each( items, ( item ) => {
                const label = item.textContent.trim();

                item.dataset.sort = this.date( label );

                if ( ! location.pathname.match( /mic_82/ ) ) {
                    if ( label.match( /English\sCommentary/ ) ) {
                        item.dataset.filter = 'english';
                    } else {
                        item.dataset.filter = 'japanese';
                    }
                } else {
                    item.dataset.filter = 'english';
                }
            });
        },

        /**
         * Add the necessary nodes and styles.
         *
         * @memberof njpwInfScroll
         * @function
         */
        stylesAndSettings() {
            this.gridSizer();

            // Custom CSS.
            let style = doc.createElement( 'style' );
            style.innerText = '.movieArea { margin-right: 0 !important; }';
            head.appendChild( style );

            // The node location to insert the actual `spinning wheel` HTML.
            const videoWall  = doc.querySelectorAll( this.containerParent )[0],
                  videoPaged = videoWall.children,
                  spinWheel  = doc.createElement( 'div' );

            // Spinning Wheel attributes.
            spinWheel.className = this.pageLoadStatusClass.slice(1);
            spinWheel.innerHTML = this.pageLoadStatus;
            spinWheel.style.marginTop = '-25px';
            spinWheel.style.marginBottom = '25px';
            spinWheel.style.textAlign = 'center';

            // Insert `spinning wheel`.
            if ( location.pathname !== this.urlPaths[1] )
            {
                videoWall.insertBefore( spinWheel, videoPaged[2] );
            }
            else
            {
                videoWall.insertBefore( spinWheel, videoPaged[3] );
            }
        },

        /**
         * Initialize UserScript.
         *
         * @memberof njpwInfScroll
         * @function
         */
        init() {
            this.stylesAndSettings();

            let videos = document.querySelectorAll( this.query );
            this.parseItems( videos );

            const iso = new Isotope( this.container, {
                itemSelector: this.target,
                filter: '[data-filter="english"]',
                layoutMode: 'fitRows',
                fitRows: {
                    gutter: '.movieArea--sizer'
                },
                getSortData: {
                    date: '[data-sort]'
                },
                sortBy: 'date',
                sortAscending: false,
                percentPosition: true
            });

            const infScroll = new InfiniteScroll( this.container, {
                path: this.nextPage,
                append: this.target,
                checkLastPage: this.nextPage,
                hideNav: this.paginate,
                status: this.pageLoadStatusClass,
                outlayer: iso,
                history: false,
                debug: true
            });

            infScroll.on( 'load', ( body, path, response ) => {
                videos = body.querySelectorAll( this.query );
                this.parseItems( videos );
                iso.updateSortData( videos );
            });

            infScroll.on( 'append', ( body, path, items, response ) => {
                iso.updateSortData( items );
                iso.layout();
            });

            iso.on( 'arrangeComplete', ( filteredItems ) => {
                iso.updateSortData( filteredItems );
                iso.layout();
            });

            win.addEventListener( 'scroll', _.debounce( ( e ) => {
                iso.updateSortData( videos );
                iso.layout();
            }, 100 ) );
        }
    };

    njpwInfScroll.init();
})( window );