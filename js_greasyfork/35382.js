// ==UserScript==
// @name        SD JP translation
// @namespace   http://nyokki2319.hatenablog.com/entry/2017/11/01/233117
// @match       http://play.pokemonshowdown.com/*
// @match       http://replay.pokemonshowdown.com/*
// @match       https://play.pokemonshowdown.com/*
// @match       https://replay.pokemonshowdown.com/*
// @version     1.6.0
// @description showdown translation to japanese
// @author      Nyokki
// @grant       none
// @require     http://code.jquery.com/jquery-2.2.4.min.js
// @run-at      document-end
// @copyright   2017, nyokki (https://openuserjs.org/users/nyokki)
// @license     GPL-2.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/35382/SD%20JP%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/35382/SD%20JP%20translation.meta.js
// ==/UserScript==

/*
Copyright (c) 2017 Ceca3 / kirliavc
Released under the MIT license
http://opensource.org/licenses/mit-license.php
*/

var translations = {

	//system
	// "[Gen 7] Random Battle":"[第七世代] ランダム対戦",
	// "Add game":"Add game", //??
	// "Format:":"フォーマット:",
	// "Team:":"チーム",
	// "Battle!":"対戦！",
	// "Find a random opponent":"対戦相手を探す",
	// "Teambuilder":"チーム作成",
	// "Ladder":"ランキング",
	// "Watch a battle":"観戦する",
	// "Find a user":"ユーザー検索",
	// // "Did you have a good day?":"今日はいい日でしたか?",
	// // "[Gen 7] OU battle started between":"[第七世代] OU対戦の開始期間：", //??
	// // "and":"and", //どこ?
	// // "forfeited":"降参",
	// "Random team":"ランダムチーム",
	// "Abilities":"特性",
	// "Hidden Ability":"隠れ特性",
	// // "Will be":"メガ進化後は",
	// // "after Mega Evolving.":"", //上とセット
	// "Nickname":"ニックネーム",
	// "Item":"持ち物",
	// "Ability":"特性",
	// "Level":"レベル",
	// "Gender":"性別",
	// "Happiness":"なつき度",
	// "Shiny":"色違い",
	// "Level:":"レベル:",
	// "Gender:":"性別:",
	// "Happiness:":"なつき度:",
	// "Shiny:":"色違い:",
	// "Moves":"技",
	// "Copy":"コピー",
	// "Import/Export":"インポート/エクスポート",
	// "Move":"移動",
	// "Delete":"削除",
	// "Team":" チーム",
	// "Validate":"確認",
	// "Add Pokémon":"ポケモンを追加",
	// "New Team":"新しいチーム",
	// "Male":"オス",
	// "Female":"メス",
	// "Random":"ランダム",
	// "Format List":" フォーマットリスト",
	// "List":" リスト",
	// "Edit":"編集",
	// "Save":"保存",
	// // "Switch":"交換",
	// "Change avatar":"アバターを変更",
	// "Password change":"パスワードを変更",
	// "Graphics":"Graphics",
	// "Layout:":"レイアウト:",
	// "◫ Left and right panels":"◫ 2カラム",
	// "◻ Single panel":"◻ 1カラム",
	// "Background:":"背景:",
	// "Change background":"背景を変更",
	// "Dark mode (beta)":"Dark mode(beta)",
	// "Disable animations":"アニメーションを止める",
	// "Use BW sprites instead of XY models":"XYモデルの代わりにBWの画像を使用",
	// "Use modern sprites for past generations":"過去作に対しても最近の画像を使用",
	// "Chat":"チャット",
	// "Ignore tournaments":"トーナメントを無視", //??
	// "Show PMs in chat rooms":"PMをチャット部屋に表示",
	// "Highlight when your name is said in chat":"チャットで自分の名前を強調表示",
	// "Notifications disappear automatically":"通知を自動的に消去",
	// "Timestamps in chat rooms:":"チャットのタイムスタンプを表示:",
	// "Off":"オフ",
	// "Timestamps in PMs:":"PMのタイムスタンプを表示:",
	// "Chat preferences:":"チャットの設定:",
	// "Edit formatting":"編集",
	// "You can choose to display formatted text as normal text":"You can choose to display formatted text as normal text", //??
	// "Change name":"名前を変える",
	// "Log out":"ログアウト",

	//Abilities

	"Adaptability": "てきおうりょく",
	"Aerilate": "スカイスキン",
	"Aftermath": "ゆうばく",
	"Air Lock": "エアロック",
	"Analytic": "アナライズ",
	"Anger Point": "いかりのつぼ",
	"Anticipation": "きけんよち",
	"Arena Trap": "ありじごく",
	"Aroma Veil": "アロマベール",
	"Aura Break": "オーラブレイク",
	"Bad Dreams": "ナイトメア",
	"Battery": "バッテリー",
	"Battle Armor": "カブトアーマー",
	"Battle Bond": "きずなへんげ",
	"Beast Boost": "ビーストブースト",
	"Berserk": "ぎゃくじょう",
	"Big Pecks": "はとむね",
	"Blaze": "もうか",
	"Bulletproof": "ぼうだん",
	"Cheek Pouch": "ほおぶくろ",
	"Chlorophyll": "ようりょくそ",
	"Clear Body": "クリアボディ",
	"Cloud Nine": "ノーてんき",
	"Color Change": "へんしょく",
	"Comatose": "ぜったいねむり",
	"Competitive": "かちき",
	"Compound Eyes": "ふくがん",
	"Contrary": "あまのじゃく",
	"Corrosion": "ふしょく",
	"Cursed Body": "のろわれボディ",
	"Cute Charm": "メロメロボディ",
	"Damp": "しめりけ",
	"Dancer": "おどりこ",
	"Dark Aura": "ダークオーラ",
	"Dazzling": "ビビッドボディ",
	"Defeatist": "よわき",
	"Defiant": "まけんき",
	"Delta Stream": "デルタストリーム",
	"Desolate Land": "おわりのだいち",
	"Disguise": "ばけのかわ",
	"Download": "ダウンロード",
	"Drizzle": "あめふらし",
	"Drought": "ひでり",
	"Dry Skin": "かんそうはだ",
	"Early Bird": "はやおき",
	"Effect Spore": "ほうし",
	"Electric Surge": "エレキメイカー",
	"Emergency Exit": "ききかいひ",
	"Fairy Aura": "フェアリーオーラ",
	"Filter": "フィルター",
	"Flame Body": "ほのおのからだ",
	"Flare Boost": "ねつぼうそう",
	"Flash Fire": "もらいび",
	"Flower Gift": "フラワーギフト",
	"Flower Veil": "フラワーベール",
	"Fluffy": "もふもふ",
	"Forecast": "てんきや",
	"Forewarn": "よちむ",
	"Friend Guard": "フレンドガード",
	"Frisk": "おみとおし",
	"Full Metal Body": "メタルプロテクト",
	"Fur Coat": "ファーコート",
	"Gale Wings": "はやてのつばさ",
	"Galvanize": "エレキスキン",
	"Gluttony": "くいしんぼう",
	"Gooey": "ぬめぬめ",
	"Grass Pelt": "くさのけがわ",
	"Grassy Surge": "グラスメイカー",
	"Guts": "こんじょう",
	"Harvest": "しゅうかく",
	"Healer": "いやしのこころ",
	"Heatproof": "たいねつ",
	"Heavy Metal": "ヘヴィメタル",
	"Honey Gather": "みつあつめ",
	"Huge Power": "ちからもち",
	"Hustle": "はりきり",
	"Hydration": "うるおいボディ",
	"Hyper Cutter": "かいりきバサミ",
	"Ice Body": "アイスボディ",
	"Illuminate": "はっこう",
	"Illusion": "イリュージョン",
	"Immunity": "めんえき",
	"Imposter": "かわりもの",
	"Infiltrator": "すりぬけ",
	"Innards Out": "とびだすなかみ",
	"Inner Focus": "せいしんりょく",
	"Insomnia": "ふみん",
	"Intimidate": "いかく",
	"Iron Barbs": "てつのトゲ",
	"Iron Fist": "てつのこぶし",
	"Justified": "せいぎのこころ",
	"Keen Eye": "するどいめ",
	"Klutz": "ぶきよう",
	"Leaf Guard": "リーフガード",
	"Levitate": "ふゆう",
	"Light Metal": "ライトメタル",
	"Lightning Rod": "ひらいしん",
	"Limber": "じゅうなん",
	"Liquid Ooze": "ヘドロえき",
	"Liquid Voice": "うるおいボイス",
	"Long Reach": "えんかく",
	"Magic Bounce": "マジックミラー",
	"Magic Guard": "マジックガード",
	"Magician": "マジシャン",
	"Magma Armor": "マグマのよろい",
	"Magnet Pull": "じりょく",
	"Marvel Scale": "ふしぎなうろこ",
	"Mega Launcher": "メガランチャー",
	"Merciless": "ひとでなし",
	"Minus": "マイナス",
	"Misty Surge": "ミストメイカー",
	"Mold Breaker": "かたやぶり",
	"Moody": "ムラっけ",
	"Motor Drive": "でんきエンジン",
	"Moxie": "じしんかじょう",
	"Multiscale": "マルチスケイル",
	"Multitype": "マルチタイプ",
	"Mummy": "ミイラ",
	"Natural Cure": "しぜんかいふく",
	"No Guard": "ノーガード",
	"Normalize": "ノーマルスキン",
	"Oblivious": "どんかん",
	"Overcoat": "ぼうじん",
	"Overgrow": "しんりょく",
	"Own Tempo": "マイペース",
	"Parental Bond": "おやこあい",
	"Pickpocket": "わるいてぐせ",
	"Pickup": "ものひろい",
	"Pixilate": "フェアリースキン",
	"Plus": "プラス",
	"Poison Heal": "ポイズンヒール",
	"Poison Point": "どくのトゲ",
	"Poison Touch": "どくしゅ",
	"Power Construct": "スワームチェンジ",
	"Power of Alchemy": "かがくのちから",
	"Prankster": "いたずらごころ",
	"Pressure": "プレッシャー",
	"Primordial Sea": "はじまりのうみ",
	"Prism Armor": "プリズムアーマー",
	"Protean": "へんげんじざい",
	"Psychic Surge": "サイコメイカー",
	"Pure Power": "ヨガパワー",
	"Queenly Majesty": "じょおうのいげん",
	"Quick Feet": "はやあし",
	"Rain Dish": "あめうけざら",
	"Rattled": "びびり",
	"Receiver": "レシーバー",
	"Reckless": "すてみ",
	"Refrigerate": "フリーズスキン",
	"Regenerator": "さいせいりょく",
	"Rivalry": "とうそうしん",
	"RKS System": "ＡＲシステム",
	"Rock Head": "いしあたま",
	"Rough Skin": "さめはだ",
	"Run Away": "にげあし",
	"Sand Force": "すなのちから",
	"Sand Rush": "すなかき",
	"Sand Stream": "すなおこし",
	"Sand Veil": "すながくれ",
	"Sap Sipper": "そうしょく",
	"Schooling": "ぎょぐん",
	"Scrappy": "きもったま",
	"Serene Grace": "てんのめぐみ",
	"Shadow Shield": "ファントムガード",
	"Shadow Tag": "かげふみ",
	"Shed Skin": "だっぴ",
	"Sheer Force": "ちからずく",
	"Shell Armor": "シェルアーマー",
	"Shield Dust": "りんぷん",
	"Shields Down": "リミットシールド",
	"Simple": "たんじゅん",
	"Skill Link": "スキルリンク",
	"Slow Start": "スロースタート",
	"Slush Rush": "ゆきかき",
	"Sniper": "スナイパー",
	"Snow Cloak": "ゆきがくれ",
	"Snow Warning": "ゆきふらし",
	"Solar Power": "サンパワー",
	"Solid Rock": "ハードロック",
	"Soul-Heart": "ソウルハート",
	"Soundproof": "ぼうおん",
	"Speed Boost": "かそく",
	"Stakeout": "はりこみ",
	"Stall": "あとだし",
	"Stamina": "じきゅうりょく",
	"Stance Change": "バトルスイッチ",
	"Static": "せいでんき",
	"Steadfast": "ふくつのこころ",
	"Steelworker": "はがねつかい",
	"Stench": "あくしゅう",
	"Sticky Hold": "ねんちゃく",
	"Storm Drain": "よびみず",
	"Strong Jaw": "がんじょうあご",
	"Sturdy": "がんじょう",
	"Suction Cups": "きゅうばん",
	"Super Luck": "きょううん",
	"Surge Surfer": "サーフテール",
	"Swarm": "むしのしらせ",
	"Sweet Veil": "スイートベール",
	"Swift Swim": "すいすい",
	"Symbiosis": "きょうせい",
	"Synchronize": "シンクロ",
	"Tangled Feet": "ちどりあし",
	"Tangling Hair": "カーリーヘアー",
	"Technician": "テクニシャン",
	"Telepathy": "テレパシー",
	"Teravolt": "テラボルテージ",
	"Thick Fat": "あついしぼう",
	"Tinted Lens": "いろめがね",
	"Torrent": "げきりゅう",
	"Tough Claws": "かたいツメ",
	"Toxic Boost": "どくぼうそう",
	"Trace": "トレース",
	"Triage": "ヒーリングシフト",
	"Truant": "なまけ",
	"Turboblaze": "ターボブレイズ",
	"Unaware": "てんねん",
	"Unburden": "かるわざ",
	"Unnerve": "きんちょうかん",
	"Victory Star": "しょうりのほし",
	"Vital Spirit": "やるき",
	"Volt Absorb": "ちくでん",
	"Water Absorb": "ちょすい",
	"Water Bubble": "すいほう",
	"Water Compaction": "みずがため",
	"Water Veil": "みずのベール",
	"Weak Armor": "くだけるよろい",
	"White Smoke": "しろいけむり",
	"Wimp Out": "にげごし",
	"Wonder Guard": "ふしぎなまもり",
	"Wonder Skin": "ミラクルスキン",
	"Zen Mode": "ダルマモード",

	// Moves

	"10,000,Volt Thunderbolt": "１０００まんボルト",
	"Absorb": "すいとる",
	"Accelerock": "アクセルロック",
	"Acid": "ようかいえき",
	"Acid Armor": "とける",
	"Acid Downpour": "アシッドポイズンデリート",
	"Acid Spray": "アシッドボム",
	"Acrobatics": "アクロバット",
	"Acupressure": "つぼをつく",
	"Aerial Ace": "つばめがえし",
	"Aeroblast": "エアロブラスト",
	"After You": "おさきにどうぞ",
	"Agility": "こうそくいどう",
	"Air Cutter": "エアカッター",
	"Air Slash": "エアスラッシュ",
	"All-Out Pummeling": "ぜんりょくむそうげきれつけん",
	"Ally Switch": "サイドチェンジ",
	"Amnesia": "ドわすれ",
	"Anchor Shot": "アンカーショット",
	"Ancient Power": "げんしのちから",
	"Aqua Jet": "アクアジェット",
	"Aqua Ring": "アクアリング",
	"Aqua Tail": "アクアテール",
	"Arm Thrust": "つっぱり",
	"Aromatherapy": "アロマセラピー",
	"Aromatic Mist": "アロマミスト",
	"Assist": "ねこのて",
	"Assurance": "ダメおし",
	"Astonish": "おどろかす",
	"Attack Order": "こうげきしれい",
	"Attract": "メロメロ",
	"Aura Sphere": "はどうだん",
	"Aurora Beam": "オーロラビーム",
	"Aurora Veil": "オーロラベール",
	"Autotomize": "ボディパージ",
	"Avalanche": "ゆきなだれ",
	"Baby-Doll Eyes": "つぶらなひとみ",
	"Baneful Bunker": "トーチカ",
	"Barrage": "たまなげ",
	"Barrier": "バリアー",
	"Baton Pass": "バトンタッチ",
	"Beak Blast": "くちばしキャノン",
	"Beat Up": "ふくろだたき",
	"Belch": "ゲップ",
	"Belly Drum": "はらだいこ",
	"Bestow": "ギフトパス",
	"Bide": "がまん",
	"Bind": "しめつける",
	"Bite": "かみつく",
	"Black Hole Eclipse": "ブラックホールイクリプス",
	"Blast Burn": "ブラストバーン",
	"Blaze Kick": "ブレイズキック",
	"Blizzard": "ふぶき",
	"Block": "とおせんぼう",
	"Bloom Doom": "ブルームシャインエクストラ",
	"Blue Flare": "あおいほのお",
	"Body Slam": "のしかかり",
	"Bolt Strike": "らいげき",
	"Bone Club": "ホネこんぼう",
	"Bone Rush": "ボーンラッシュ",
	"Bonemerang": "ホネブーメラン",
	"Boomburst": "ばくおんぱ",
	"Bounce": "とびはねる",
	"Brave Bird": "ブレイブバード",
	"Breakneck Blitz": "ウルトラダッシュアタック",
	"Brick Break": "かわらわり",
	"Brine": "しおみず",
	"Brutal Swing": "ぶんまわす",
	"Bubble": "あわ",
	"Bubble Beam": "バブルこうせん",
	"Bug Bite": "むしくい",
	"Bug Buzz": "むしのさざめき",
	"Bulk Up": "ビルドアップ",
	"Bulldoze": "じならし",
	"Bullet Punch": "バレットパンチ",
	"Bullet Seed": "タネマシンガン",
	"Burn Up": "もえつきる",
	"Calm Mind": "めいそう",
	"Camouflage": "ほごしょく",
	"Captivate": "ゆうわく",
	"Catastropika": "ひっさつのピカチュート",
	"Celebrate": "おいわい",
	"Charge": "じゅうでん",
	"Charge Beam": "チャージビーム",
	"Charm": "あまえる",
	"Chatter": "おしゃべり",
	"Chip Away": "なしくずし",
	"Circle Throw": "ともえなげ",
	"Clamp": "からではさむ",
	"Clanging Scales": "スケイルノイズ",
	"Clear Smog": "クリアスモッグ",
	"Close Combat": "インファイト",
	"Coil": "とぐろをまく",
	"Comet Punch": "れんぞくパンチ",
	"Confide": "ないしょばなし",
	"Confuse Ray": "あやしいひかり",
	"Confusion": "ねんりき",
	"Constrict": "からみつく",
	"Continental Crush": "ワールズエンドフォール",
	"Conversion": "テクスチャー",
	"Conversion 2": "テクスチャー２",
	"Copycat": "まねっこ",
	"Core Enforcer": "コアパニッシャー",
	"Corkscrew Crash": "ちょうぜつらせんれんげき",
	"Cosmic Power": "コスモパワー",
	"Cotton Guard": "コットンガード",
	"Cotton Spore": "わたほうし",
	"Counter": "カウンター",
	"Covet": "ほしがる",
	"Crabhammer": "クラブハンマー",
	"Crafty Shield": "トリックガード",
	"Cross Chop": "クロスチョップ",
	"Cross Poison": "クロスポイズン",
	"Crunch": "かみくだく",
	"Crush Claw": "ブレイククロー",
	"Crush Grip": "にぎりつぶす",
	"Curse": "のろい",
	"Cut": "いあいぎり",
	"Dark Pulse": "あくのはどう",
	"Dark Void": "ダークホール",
	"Darkest Lariat": "ＤＤラリアット",
	"Dazzling Gleam": "マジカルシャイン",
	"Defend Order": "ぼうぎょしれい",
	"Defense Curl": "まるくなる",
	"Defog": "きりばらい",
	"Destiny Bond": "みちづれ",
	"Detect": "みきり",
	"Devastating Drake": "アルティメットドラゴンバーン",
	"Diamond Storm": "ダイヤストーム",
	"Dig": "あなをほる",
	"Disable": "かなしばり",
	"Disarming Voice": "チャームボイス",
	"Discharge": "ほうでん",
	"Dive": "ダイビング",
	"Dizzy Punch": "ピヨピヨパンチ",
	"Doom Desire": "はめつのねがい",
	"Double Hit": "ダブルアタック",
	"Double Kick": "にどげり",
	"Double Slap": "おうふくビンタ",
	"Double Team": "かげぶんしん",
	"Double-Edge": "すてみタックル",
	"Draco Meteor": "りゅうせいぐん",
	"Dragon Ascent": "ガリョウテンセイ",
	"Dragon Breath": "りゅうのいぶき",
	"Dragon Claw": "ドラゴンクロー",
	"Dragon Dance": "りゅうのまい",
	"Dragon Hammer": "ドラゴンハンマー",
	"Dragon Pulse": "りゅうのはどう",
	"Dragon Rage": "りゅうのいかり",
	"Dragon Rush": "ドラゴンダイブ",
	"Dragon Tail": "ドラゴンテール",
	"Drain Punch": "ドレインパンチ",
	"Draining Kiss": "ドレインキッス",
	"Dream Eater": "ゆめくい",
	"Drill Peck": "ドリルくちばし",
	"Drill Run": "ドリルライナー",
	"Dual Chop": "ダブルチョップ",
	"Dynamic Punch": "ばくれつパンチ",
	"Earth Power": "だいちのちから",
	"Earthquake": "じしん",
	"Echoed Voice": "エコーボイス",
	"Eerie Impulse": "かいでんぱ",
	"Egg Bomb": "タマゴばくだん",
	"Electric Terrain": "エレキフィールド",
	"Electrify": "そうでん",
	"Electro Ball": "エレキボール",
	"Electroweb": "エレキネット",
	"Embargo": "さしおさえ",
	"Ember": "ひのこ",
	"Encore": "アンコール",
	"Endeavor": "がむしゃら",
	"Endure": "こらえる",
	"Energy Ball": "エナジーボール",
	"Entrainment": "なかまづくり",
	"Eruption": "ふんか",
	"Explosion": "だいばくはつ",
	"Extrasensory": "じんつうりき",
	"Extreme Evoboost": "ナインエボルブースト",
	"Extreme Speed": "しんそく",
	"Facade": "からげんき",
	"Fairy Lock": "フェアリーロック",
	"Fairy Wind": "ようせいのかぜ",
	"Fake Out": "ねこだまし",
	"Fake Tears": "うそなき",
	"False Swipe": "みねうち",
	"Feather Dance": "フェザーダンス",
	"Feint": "フェイント",
	"Feint Attack": "だましうち",
	"Fell Stinger": "とどめばり",
	"Fiery Dance": "ほのおのまい",
	"Final Gambit": "いのちがけ",
	"Fire Blast": "だいもんじ",
	"Fire Fang": "ほのおのキバ",
	"Fire Lash": "ほのおのムチ",
	"Fire Pledge": "ほのおのちかい",
	"Fire Punch": "ほのおのパンチ",
	"Fire Spin": "ほのおのうず",
	"First Impression": "であいがしら",
	"Fissure": "じわれ",
	"Flail": "じたばた",
	"Flame Burst": "はじけるほのお",
	"Flame Charge": "ニトロチャージ",
	"Flame Wheel": "かえんぐるま",
	"Flamethrower": "かえんほうしゃ",
	"Flare Blitz": "フレアドライブ",
	"Flash": "フラッシュ",
	"Flash Cannon": "ラスターカノン",
	"Flatter": "おだてる",
	"Fleur Cannon": "フルールカノン",
	"Fling": "なげつける",
	"Floral Healing": "フラワーヒール",
	"Flower Shield": "フラワーガード",
	"Fly": "そらをとぶ",
	"Flying Press": "フライングプレス",
	"Focus Blast": "きあいだま",
	"Focus Energy": "きあいだめ",
	"Focus Punch": "きあいパンチ",
	"Follow Me": "このゆびとまれ",
	"Force Palm": "はっけい",
	"Foresight": "みやぶる",
	"Forest's Curse": "もりののろい",
	"Foul Play": "イカサマ",
	"Freeze Shock": "フリーズボルト",
	"Freeze-Dry": "フリーズドライ",
	"Frenzy Plant": "ハードプラント",
	"Frost Breath": "こおりのいぶき",
	"Frustration": "やつあたり",
	"Fury Attack": "みだれづき",
	"Fury Cutter": "れんぞくぎり",
	"Fury Swipes": "みだれひっかき",
	"Fusion Bolt": "クロスサンダー",
	"Fusion Flare": "クロスフレイム",
	"Future Sight": "みらいよち",
	"Gastro Acid": "いえき",
	"Gear Grind": "ギアソーサー",
	"Gear Up": "アシストギア",
	"Genesis Supernova": "オリジンズスーパーノヴァ",
	"Geomancy": "ジオコントロール",
	"Giga Drain": "ギガドレイン",
	"Giga Impact": "ギガインパクト",
	"Gigavolt Havoc": "スパーキングギガボルト",
	"Glaciate": "こごえるせかい",
	"Glare": "へびにらみ",
	"Grass Knot": "くさむすび",
	"Grass Pledge": "くさのちかい",
	"Grass Whistle": "くさぶえ",
	"Grassy Terrain": "グラスフィールド",
	"Gravity": "じゅうりょく",
	"Growl": "なきごえ",
	"Growth": "せいちょう",
	"Grudge": "おんねん",
	"Guard Split": "ガードシェア",
	"Guard Swap": "ガードスワップ",
	"Guardian of Alola": "ガーディアン・デ・アローラ",
	"Guillotine": "ハサミギロチン",
	"Gunk Shot": "ダストシュート",
	"Gust": "かぜおこし",
	"Gyro Ball": "ジャイロボール",
	"Hail": "あられ",
	"Hammer Arm": "アームハンマー",
	"Happy Hour": "ハッピータイム",
	"Harden": "かたくなる",
	"Haze": "くろいきり",
	"Head Charge": "アフロブレイク",
	"Head Smash": "もろはのずつき",
	"Headbutt": "ずつき",
	"Heal Bell": "いやしのすず",
	"Heal Block": "かいふくふうじ",
	"Heal Order": "かいふくしれい",
	"Heal Pulse": "いやしのはどう",
	"Healing Wish": "いやしのねがい",
	"Heart Stamp": "ハートスタンプ",
	"Heart Swap": "ハートスワップ",
	"Heat Crash": "ヒートスタンプ",
	"Heat Wave": "ねっぷう",
	"Heavy Slam": "ヘビーボンバー",
	"Helping Hand": "てだすけ",
	"Hex": "たたりめ",
	"Hidden Power": "めざめるパワー",
	"Hidden Power Bug": "めざめるパワー Bug",
	"Hidden Power Dark": "めざめるパワー Dark",
	"Hidden Power Dragon": "めざめるパワー Dragon",
	"Hidden Power Electric": "めざめるパワー Electric",
	"Hidden Power Fairy": "めざめるパワー Fairy",
	"Hidden Power Fighting": "めざめるパワー Fighting",
	"Hidden Power Fire": "めざめるパワー Fire",
	"Hidden Power Flying": "めざめるパワー Flying",
	"Hidden Power Ghost": "めざめるパワー Ghost",
	"Hidden Power Grass": "めざめるパワー Grass",
	"Hidden Power Ground": "めざめるパワー Ground",
	"Hidden Power Ice": "めざめるパワー Ice",
	"Hidden Power Poison": "めざめるパワー Poison",
	"Hidden Power Psychic": "めざめるパワー Psychic",
	"Hidden Power Rock": "めざめるパワー Rock",
	"Hidden Power Steel": "めざめるパワー Steel",
	"Hidden Power Water": "めざめるパワー Water",
	"High Horsepower": "１０まんばりき",
	"High Jump Kick": "とびひざげり",
	"Hold Back": "てかげん",
	"Hold Hands": "てをつなぐ",
	"Hone Claws": "つめとぎ",
	"Horn Attack": "つのでつく",
	"Horn Drill": "つのドリル",
	"Horn Leech": "ウッドホーン",
	"Howl": "とおぼえ",
	"Hurricane": "ぼうふう",
	"Hydro Cannon": "ハイドロカノン",
	"Hydro Pump": "ハイドロポンプ",
	"Hydro Vortex": "スーパーアクアトルネード",
	"Hyper Beam": "はかいこうせん",
	"Hyper Fang": "ひっさつまえば",
	"Hyper Voice": "ハイパーボイス",
	"Hyperspace Fury": "いじげんラッシュ",
	"Hyperspace Hole": "いじげんホール",
	"Hypnosis": "さいみんじゅつ",
	"Ice Ball": "アイスボール",
	"Ice Beam": "れいとうビーム",
	"Ice Burn": "コールドフレア",
	"Ice Fang": "こおりのキバ",
	"Ice Hammer": "アイスハンマー",
	"Ice Punch": "れいとうパンチ",
	"Ice Shard": "こおりのつぶて",
	"Icicle Crash": "つららおとし",
	"Icicle Spear": "つららばり",
	"Icy Wind": "こごえるかぜ",
	"Imprison": "ふういん",
	"Incinerate": "やきつくす",
	"Inferno": "れんごく",
	"Inferno Overdrive": "ダイナミックフルフレイム",
	"Infestation": "まとわりつく",
	"Ingrain": "ねをはる",
	"Instruct": "さいはい",
	"Ion Deluge": "プラズマシャワー",
	"Iron Defense": "てっぺき",
	"Iron Head": "アイアンヘッド",
	"Iron Tail": "アイアンテール",
	"Judgment": "さばきのつぶて",
	"Jump Kick": "とびげり",
	"Karate Chop": "からてチョップ",
	"Kinesis": "スプーンまげ",
	"King's Shield": "キングシールド",
	"Knock Off": "はたきおとす",
	"Land's Wrath": "グランドフォース",
	"Laser Focus": "とぎすます",
	"Last Resort": "とっておき",
	"Lava Plume": "ふんえん",
	"Leaf Blade": "リーフブレード",
	"Leaf Storm": "リーフストーム",
	"Leaf Tornado": "グラスミキサー",
	"Leafage": "このは",
	"Leech Life": "きゅうけつ",
	"Leech Seed": "やどりぎのたね",
	"Leer": "にらみつける",
	"Lick": "したでなめる",
	"Light of Ruin": "はめつのひかり",
	"Light Screen": "ひかりのかべ",
	"Liquidation": "アクアブレイク",
	"Lock-On": "ロックオン",
	"Lovely Kiss": "あくまのキッス",
	"Low Kick": "けたぐり",
	"Low Sweep": "ローキック",
	"Lucky Chant": "おまじない",
	"Lunar Dance": "みかづきのまい",
	"Lunge": "とびかかる",
	"Luster Purge": "ラスターパージ",
	"Mach Punch": "マッハパンチ",
	"Magic Coat": "マジックコート",
	"Magic Room": "マジックルーム",
	"Magical Leaf": "マジカルリーフ",
	"Magma Storm": "マグマストーム",
	"Magnet Bomb": "マグネットボム",
	"Magnet Rise": "でんじふゆう",
	"Magnetic Flux": "じばそうさ",
	"Magnitude": "マグニチュード",
	"Malicious Moonsault": "ハイパーダーククラッシャー",
	"Mat Block": "たたみがえし",
	"Me First": "さきどり",
	"Mean Look": "くろいまなざし",
	"Meditate": "ヨガのポーズ",
	"Mega Drain": "メガドレイン",
	"Mega Kick": "メガトンキック",
	"Mega Punch": "メガトンパンチ",
	"Megahorn": "メガホーン",
	"Memento": "おきみやげ",
	"Metal Burst": "メタルバースト",
	"Metal Claw": "メタルクロー",
	"Metal Sound": "きんぞくおん",
	"Meteor Mash": "コメットパンチ",
	"Metronome": "ゆびをふる",
	"Milk Drink": "ミルクのみ",
	"Mimic": "ものまね",
	"Mind Reader": "こころのめ",
	"Minimize": "ちいさくなる",
	"Miracle Eye": "ミラクルアイ",
	"Mirror Coat": "ミラーコート",
	"Mirror Move": "オウムがえし",
	"Mirror Shot": "ミラーショット",
	"Mist": "しろいきり",
	"Mist Ball": "ミストボール",
	"Misty Terrain": "ミストフィールド",
	"Moonblast": "ムーンフォース",
	"Moongeist Beam": "シャドーレイ",
	"Moonlight": "つきのひかり",
	"Morning Sun": "あさのひざし",
	"Mud Bomb": "どろばくだん",
	"Mud Shot": "マッドショット",
	"Mud Sport": "どろあそび",
	"Mud-Slap": "どろかけ",
	"Muddy Water": "だくりゅう",
	"Multi-Attack": "マルチアタック",
	"Mystical Fire": "マジカルフレイム",
	"Nasty Plot": "わるだくみ",
	"Natural Gift": "しぜんのめぐみ",
	"Nature Power": "しぜんのちから",
	"Nature's Madness": "しぜんのいかり",
	"Needle Arm": "ニードルアーム",
	"Never-Ending Nightmare": "むげんあんやへのいざない",
	"Night Daze": "ナイトバースト",
	"Night Shade": "ナイトヘッド",
	"Night Slash": "つじぎり",
	"Nightmare": "あくむ",
	"Noble Roar": "おたけび",
	"Nuzzle": "ほっぺすりすり",
	"Oblivion Wing": "デスウイング",
	"Oceanic Operetta": "わだつみのシンフォニア",
	"Octazooka": "オクタンほう",
	"Odor Sleuth": "かぎわける",
	"Ominous Wind": "あやしいかぜ",
	"Origin Pulse": "こんげんのはどう",
	"Outrage": "げきりん",
	"Overheat": "オーバーヒート",
	"Pain Split": "いたみわけ",
	"Parabolic Charge": "パラボラチャージ",
	"Parting Shot": "すてゼリフ",
	"Pay Day": "ネコにこばん",
	"Payback": "しっぺがえし",
	"Peck": "つつく",
	"Perish Song": "ほろびのうた",
	"Petal Blizzard": "はなふぶき",
	"Petal Dance": "はなびらのまい",
	"Phantom Force": "ゴーストダイブ",
	"Pin Missile": "ミサイルばり",
	"Play Nice": "なかよくする",
	"Play Rough": "じゃれつく",
	"Pluck": "ついばむ",
	"Poison Fang": "どくどくのキバ",
	"Poison Gas": "どくガス",
	"Poison Jab": "どくづき",
	"Poison Powder": "どくのこな",
	"Poison Sting": "どくばり",
	"Poison Tail": "ポイズンテール",
	"Pollen Puff": "かふんだんご",
	"Pound": "はたく",
	"Powder": "ふんじん",
	"Powder Snow": "こなゆき",
	"Power Gem": "パワージェム",
	"Power Split": "パワーシェア",
	"Power Swap": "パワースワップ",
	"Power Trick": "パワートリック",
	"Power Trip": "つけあがる",
	"Power Whip": "パワーウィップ",
	"Power-Up Punch": "グロウパンチ",
	"Precipice Blades": "だんがいのつるぎ",
	"Present": "プレゼント",
	"Prismatic Laser": "プリズムレーザー",
	"Protect": "まもる",
	"Psybeam": "サイケこうせん",
	"Psych Up": "じこあんじ",
	"Psychic": "サイコキネシス",
	"Psychic Fangs": "サイコファング",
	"Psychic Terrain": "サイコフィールド",
	"Psycho Boost": "サイコブースト",
	"Psycho Cut": "サイコカッター",
	"Psycho Shift": "サイコシフト",
	"Psyshock": "サイコショック",
	"Psystrike": "サイコブレイク",
	"Psywave": "サイコウェーブ",
	"Pulverizing Pancake": "ほんきをだす こうげき",
	"Punishment": "おしおき",
	"Purify": "じょうか",
	"Pursuit": "おいうち",
	"Quash": "さきおくり",
	"Quick Attack": "でんこうせっか",
	"Quick Guard": "ファストガード",
	"Quiver Dance": "ちょうのまい",
	"Rage": "いかり",
	"Rage Powder": "いかりのこな",
	"Rain Dance": "あまごい",
	"Rapid Spin": "こうそくスピン",
	"Razor Leaf": "はっぱカッター",
	"Razor Shell": "シェルブレード",
	"Razor Wind": "かまいたち",
	"Recover": "じこさいせい",
	"Recycle": "リサイクル",
	"Reflect": "リフレクター",
	"Reflect Type": "ミラータイプ",
	"Refresh": "リフレッシュ",
	"Relic Song": "いにしえのうた",
	"Rest": "ねむる",
	"Retaliate": "かたきうち",
	"Return": "おんがえし",
	"Revelation Dance": "めざめるダンス",
	"Revenge": "リベンジ",
	"Reversal": "きしかいせい",
	"Roar": "ほえる",
	"Roar of Time": "ときのほうこう",
	"Rock Blast": "ロックブラスト",
	"Rock Climb": "ロッククライム",
	"Rock Polish": "ロックカット",
	"Rock Slide": "いわなだれ",
	"Rock Smash": "いわくだき",
	"Rock Throw": "いわおとし",
	"Rock Tomb": "がんせきふうじ",
	"Rock Wrecker": "がんせきほう",
	"Role Play": "なりきり",
	"Rolling Kick": "まわしげり",
	"Rollout": "ころがる",
	"Roost": "はねやすめ",
	"Rototiller": "たがやす",
	"Round": "りんしょう",
	"Sacred Fire": "せいなるほのお",
	"Sacred Sword": "せいなるつるぎ",
	"Safeguard": "しんぴのまもり",
	"Sand Attack": "すなかけ",
	"Sand Tomb": "すなじごく",
	"Sandstorm": "すなあらし",
	"Savage Spin-out": "ぜったいほしょくかいてんざん",
	"Scald": "ねっとう",
	"Scary Face": "こわいかお",
	"Scratch": "ひっかく",
	"Screech": "いやなおと",
	"Searing Shot": "かえんだん",
	"Secret Power": "ひみつのちから",
	"Secret Sword": "しんぴのつるぎ",
	"Seed Bomb": "タネばくだん",
	"Seed Flare": "シードフレア",
	"Seismic Toss": "ちきゅうなげ",
	"Self-Destruct": "じばく",
	"Shadow Ball": "シャドーボール",
	"Shadow Bone": "シャドーボーン",
	"Shadow Claw": "シャドークロー",
	"Shadow Force": "シャドーダイブ",
	"Shadow Punch": "シャドーパンチ",
	"Shadow Sneak": "かげうち",
	"Sharpen": "かくばる",
	"Shattered Psyche": "マキシマムサイブレイカー",
	"Sheer Cold": "ぜったいれいど",
	"Shell Smash": "からをやぶる",
	"Shell Trap": "トラップシェル",
	"Shift Gear": "ギアチェンジ",
	"Shock Wave": "でんげきは",
	"Shore Up": "すなあつめ",
	"Signal Beam": "シグナルビーム",
	"Silver Wind": "ぎんいろのかぜ",
	"Simple Beam": "シンプルビーム",
	"Sing": "うたう",
	"Sinister Arrow Raid": "シャドーアローズストライク",
	"Sketch": "スケッチ",
	"Skill Swap": "スキルスワップ",
	"Skull Bash": "ロケットずつき",
	"Sky Attack": "ゴッドバード",
	"Sky Drop": "フリーフォール",
	"Sky Uppercut": "スカイアッパー",
	"Slack Off": "なまける",
	"Slam": "たたきつける",
	"Slash": "きりさく",
	"Sleep Powder": "ねむりごな",
	"Sleep Talk": "ねごと",
	"Sludge": "ヘドロこうげき",
	"Sludge Bomb": "ヘドロばくだん",
	"Sludge Wave": "ヘドロウェーブ",
	"Smack Down": "うちおとす",
	"Smart Strike": "スマートホーン",
	"Smelling Salts": "きつけ",
	"Smog": "スモッグ",
	"Smokescreen": "えんまく",
	"Snarl": "バークアウト",
	"Snatch": "よこどり",
	"Snore": "いびき",
	"Soak": "みずびたし",
	"Soft-Boiled": "タマゴうみ",
	"Solar Beam": "ソーラービーム",
	"Solar Blade": "ソーラーブレード",
	"Sonic Boom": "ソニックブーム",
	"Soul-Stealing 7-Star Strike": "七星奪魂腿",
	"Spacial Rend": "あくうせつだん",
	"Spark": "スパーク",
	"Sparkling Aria": "うたかたのアリア",
	"Spectral Thief": "シャドースチール",
	"Speed Swap": "スピードスワップ",
	"Spider Web": "クモのす",
	"Spike Cannon": "とげキャノン",
	"Spikes": "まきびし",
	"Spiky Shield": "ニードルガード",
	"Spirit Shackle": "かげぬい",
	"Spit Up": "はきだす",
	"Spite": "うらみ",
	"Splash": "はねる",
	"Spore": "キノコのほうし",
	"Spotlight": "スポットライト",
	"Stealth Rock": "ステルスロック",
	"Steam Eruption": "スチームバースト",
	"Steamroller": "ハードローラー",
	"Steel Wing": "はがねのつばさ",
	"Sticky Web": "ねばねばネット",
	"Stockpile": "たくわえる",
	"Stoked Sparksurfer": "ライトニングサーフライド",
	"Stomp": "ふみつけ",
	"Stomping Tantrum": "じだんだ",
	"Stone Edge": "ストーンエッジ",
	"Stored Power": "アシストパワー",
	"Storm Throw": "やまあらし",
	"Strength": "かいりき",
	"Strength Sap": "ちからをすいとる",
	"String Shot": "いとをはく",
	"Struggle": "わるあがき",
	"Struggle Bug": "むしのていこう",
	"Stun Spore": "しびれごな",
	"Submission": "じごくぐるま",
	"Substitute": "みがわり",
	"Subzero Slammer": "レイジングジオフリーズ",
	"Sucker Punch": "ふいうち",
	"Sunny Day": "にほんばれ",
	"Sunsteel Strike": "メテオドライブ",
	"Super Fang": "いかりのまえば",
	"Superpower": "ばかぢから",
	"Supersonic": "ちょうおんぱ",
	"Supersonic Skystrike": "ファイナルダイブクラッシュ",
	"Surf": "なみのり",
	"Swagger": "いばる",
	"Swallow": "のみこむ",
	"Sweet Kiss": "てんしのキッス",
	"Sweet Scent": "あまいかおり",
	"Swift": "スピードスター",
	"Switcheroo": "すりかえ",
	"Swords Dance": "つるぎのまい",
	"Synchronoise": "シンクロノイズ",
	"Synthesis": "こうごうせい",
	"Tackle": "たいあたり",
	"Tail Glow": "ほたるび",
	"Tail Slap": "スイープビンタ",
	"Tail Whip": "しっぽをふる",
	"Tailwind": "おいかぜ",
	"Take Down": "とっしん",
	"Taunt": "ちょうはつ",
	"Tearful Look": "なみだめ",
	"Techno Blast": "テクノバスター",
	"Tectonic Rage": "ライジングランドオーバー",
	"Teeter Dance": "フラフラダンス",
	"Telekinesis": "テレキネシス",
	"Teleport": "テレポート",
	"Thief": "どろぼう",
	"Thousand Arrows": "サウザンアロー",
	"Thousand Waves": "サウザンウェーブ",
	"Thrash": "あばれる",
	"Throat Chop": "じごくづき",
	"Thunder": "かみなり",
	"Thunder Fang": "かみなりのキバ",
	"Thunder Punch": "かみなりパンチ",
	"Thunder Shock": "でんきショック",
	"Thunder Wave": "でんじは",
	"Thunderbolt": "１０まんボルト",
	"Tickle": "くすぐる",
	"Topsy-Turvy": "ひっくりかえす",
	"Torment": "いちゃもん",
	"Toxic": "どくどく",
	"Toxic Spikes": "どくびし",
	"Toxic Thread": "どくのいと",
	"Transform": "へんしん",
	"Tri Attack": "トライアタック",
	"Trick": "トリック",
	"Trick Room": "トリックルーム",
	"Trick-or-Treat": "ハロウィン",
	"Triple Kick": "トリプルキック",
	"Trop Kick": "トロピカルキック",
	"Trump Card": "きりふだ",
	"Twineedle": "ダブルニードル",
	"Twinkle Tackle": "ラブリースターインパクト",
	"Twister": "たつまき",
	"U-turn": "とんぼがえり",
	"Uproar": "さわぐ",
	"V-create": "Ｖジェネレート",
	"Vacuum Wave": "しんくうは",
	"Venom Drench": "ベノムトラップ",
	"Venoshock": "ベノムショック",
	"Vice Grip": "はさむ",
	"Vine Whip": "つるのムチ",
	"Vital Throw": "あてみなげ",
	"Volt Switch": "ボルトチェンジ",
	"Volt Tackle": "ボルテッカー",
	"Wake-Up Slap": "めざましビンタ",
	"Water Gun": "みずでっぽう",
	"Water Pledge": "みずのちかい",
	"Water Pulse": "みずのはどう",
	"Water Shuriken": "みずしゅりけん",
	"Water Sport": "みずあそび",
	"Water Spout": "しおふき",
	"Waterfall": "たきのぼり",
	"Weather Ball": "ウェザーボール",
	"Whirlpool": "うずしお",
	"Whirlwind": "ふきとばし",
	"Wide Guard": "ワイドガード",
	"Wild Charge": "ワイルドボルト",
	"Will-O-Wisp": "おにび",
	"Wing Attack": "つばさでうつ",
	"Wish": "ねがいごと",
	"Withdraw": "からにこもる",
	"Wonder Room": "ワンダールーム",
	"Wood Hammer": "ウッドハンマー",
	"Work Up": "ふるいたてる",
	"Worry Seed": "なやみのタネ",
	"Wrap": "まきつく",
	"Wring Out": "しぼりとる",
	"X-Scissor": "シザークロス",
	"Yawn": "あくび",
	"Zap Cannon": "でんじほう",
	"Zen Headbutt": "しねんのずつき",
	"Zing Zap": "びりびりちくちく",

	"Mind Blown": "ビックリヘッド",
	"Photon Geyser": "フォトンゲイザー",
	"Light That Burns the Sky": "天焦がす滅亡の光",
	"Searing Sunraze Smash": "サンシャインスマッシャー",
	"Menacing Moonraze Maelstrom": "ムーンライトブラスター",
	"Let's Snuggle Forever": "ぽかぼかフレンドタイム",
	"Clangorous Soulblaze": "ブレイジングソウルビート",
	"Splintered Stormshards": "ラジアルエッジストーム",

	"Sizzly Slide" : "めらめらバーン",
	"Sappy Seed" : "すくすくボンバー",
	"Bouncy Bubble" : "いきいきバブル",
	"Buzzy Buzz" : "びりびりエレキ",
	"Glitzy Glow" : "どばどばオーラ",
	"Baddy Bad" : "わるわるゾーン",
	"Freezy Frost" : "こちこちフロスト",
	"Sparkly Swirl" : "きらきらストーム",
	"Veevee Volley" : "ブイブイブレイク",
	"Zippy Zap" : "ばちばちアクセル",
	"Splishy Splash" : "ざぶざぶサーフ",
	"Floaty Fall" : "ふわふわフォール",
	"Pika Papow" : "ピカピカサンダー",

	// Items

	"Absorb Bulb": "きゅうこん",
	"Adrenaline Orb": "ビビリたま",
	"Air Balloon": "ふうせん",
	"Aloraichium Z": "アロライＺ",
	"Aspear Berry": "ナナシのみ",
	"Assault Vest": "とつげきチョッキ",
	"Babiri Berry": "リリバのみ（はがね）",
	"Big Root": "おおきなねっこ",
	"Binding Band": "しめつけバンド",
	"Black Belt": "くろおび",
	"Black Glasses": "くろいメガネ",
	"Black Sludge": "くろいへドロ",
	"Blue Orb": "あいいろのたま",
	"Bright Powder": "ひかりのこな",
	"Bug Gem": "むしのジュエル",
	"Bug Memory": "バグメモリ",
	"Buginium Z": "ムシＺ",
	"Cell Battery": "じゅうでんち",
	"Charcoal": "もくたん",
	"Charti Berry": "ヨロギのみ（いわ）",
	"Cheri Berry": "クラボのみ",
	"Chesto Berry": "カゴのみ",
	"Chilan Berry": "ホズのみ（ノーマル）",
	"Choice Band": "こだわりハチマキ",
	"Choice Scarf": "こだわりスカーフ",
	"Choice Specs": "こだわりめがね",
	"Chople Berry": "ヨプのみ（かくとう）",
	"Colbur Berry": "ナモのみ（あく）",
	"Custap Berry": "イバンのみ",
	"Damp Rock": "しめったいわ",
	"Dark Gem": "あくのジュエル",
	"Dark Memory": "ダークメモリ",
	"Darkinium Z": "アクＺ",
	"Decidium Z": "ジュナイパーＺ",
	"Deep Sea Scale": "しんかいのウロコ",
	"Deep Sea Tooth": "しんかいのキバ",
	"Draco Plate": "りゅうのプレート",
	"Dragon Fang": "りゅうのキバ",
	"Dragon Gem": "ドラゴンジュエル",
	"Dragon Memory": "ドラゴンメモリ",
	"Dragonium Z": "ドラゴンＺ",
	"Dread Plate": "こわもてプレート",
	"Earth Plate": "だいちのプレート",
	"Eevium Z": "イーブイＺ",
	"Eject Button": "だっしゅつボタン",
	"Electric Gem": "でんきのジュエル",
	"Electric Memory": "エレクトロメモリ",
	"Electric Seed": "エレキシード",
	"Electrium Z": "デンキＺ",
	"Eviolite": "しんかのきせき",
	"Expert Belt": "たつじんのおび",
	"Fairium Z": "フェアリーＺ",
	"Fairy Memory": "フェアリーメモリ",
	"Fighting Gem": "かくとうジュエル",
	"Fighting Memory": "ファイトメモリ",
	"Fightinium Z": "カクトウＺ",
	"Fire Gem": "ほのおのジュエル",
	"Fire Memory": "ファイヤーメモリ",
	"Firium Z": "ホノオＺ",
	"Fist Plate": "こぶしのプレート",
	"Flame Orb": "かえんだま",
	"Flame Plate": "ひのたまプレート",
	"Float Stone": "かるいし",
	"Flying Gem": "ひこうのジュエル",
	"Flying Memory": "フライングメモリ",
	"Flyinium Z": "ヒコウＺ",
	"Focus Band": "きあいのハチマキ",
	"Focus Sash": "きあいのタスキ",
	"Ghost Gem": "ゴーストジュエル",
	"Ghost Memory": "ゴーストメモリ",
	"Ghostium Z": "ゴーストＺ",
	"Grass Gem": "くさのジュエル",
	"Grass Memory": "グラスメモリ",
	"Grassium Z": "クサＺ",
	"Grassy Seed": "グラスシード",
	"Grip Claw": "ねばりのかぎづめ",
	"Griseous Orb": "はっきんだま",
	"Ground Gem": "じめんのジュエル",
	"Ground Memory": "グラウンドメモリ",
	"Groundium Z": "ジメンＺ",
	"Haban Berry": "ハバンのみ（ドラゴン）",
	"Hard Stone": "かたいいし",
	"Heat Rock": "あついいわ",
	"Ice Gem": "こおりのジュエル",
	"Ice Memory": "アイスメモリ",
	"Icicle Plate": "つららのプレート",
	"Icium Z": "コオリＺ",
	"Icy Rock": "つめたいいわ",
	"Incinium Z": "ガオガエンＺ",
	"Insect Plate": "たまむしプレート",
	"Iron Ball": "くろいてっきゅう",
	"Iron Plate": "こうてつプレート",
	"Jaboca Berry": "ジャポのみ",
	"Kasib Berry": "カシブのみ（ゴースト）",
	"Kebia Berry": "ビアーのみ（どく）",
	"Kee Berry": "アッキのみ",
	"Lagging Tail": "こうこうのしっぽ",
	"Leftovers": "たべのこし",
	"Life Orb": "いのちのたま",
	"Light Ball": "でんきだま",
	"Light Clay": "ひかりのねんど",
	"Lucky Punch": "ラッキーパンチ",
	"Lum Berry": "ラムのみ",
	"Luminous Moss": "ひかりごけ",
	"Magnet": "じしゃく",
	"Maranga Berry": "タラプのみ",
	"Marshadium Z": "マーシャドーＺ",
	"Meadow Plate": "みどりのプレート",
	"Mental Herb": "メンタルハーブ",
	"Metal Coat": "メタルコート",
	"Metal Powder": "メタルパウダー",
	"Mewnium Z": "ミュウＺ",
	"Mind Plate": "ふしぎのプレート",
	"Miracle Seed": "きせきのタネ",
	"Misty Seed": "ミストシード",
	"Muscle Band": "ちからのハチマキ",
	"Mystic Water": "しんぴのしずく",
	"Never-Melt Ice": "とけないこおり",
	"Normal Gem": "ノーマルジュエル",
	"Normalium Z": "ノーマルＺ",
	"Occa Berry": "オッカのみ（ほのお）",
	"Passho Berry": "イトケのみ（みず）",
	"Payapa Berry": "ウタンのみ（エスパー）",
	"Pecha Berry": "モモンのみ",
	"Persim Berry": "キーのみ",
	"Pikanium Z": "ピカチュウＺ",
	"Pikashunium Z": "サトピカＺ",
	"Pixie Plate": "せいれいプレート",
	"Poison Barb": "どくばり",
	"Poison Gem": "どくのジュエル",
	"Poison Memory": "ポイズンメモリ",
	"Poisonium Z": "ドクＺ",
	"Power Herb": "パワフルハーブ",
	"Primarium Z": "アシレーヌＺ",
	"Protective Pads": "ぼうごパット",
	"Psychic Gem": "エスパージュエル",
	"Psychic Memory": "サイキックメモリ",
	"Psychic Seed": "サイコシード",
	"Psychium Z": "エスパーＺ",
	"Quick Claw": "せんせいのツメ",
	"Quick Powder": "スピードパウダー",
	"Rawst Berry": "チーゴのみ",
	"Razor Claw": "するどいツメ",
	"Razor Fang": "するどいキバ",
	"Red Card": "レッドカード",
	"Red Orb": "べにいろのたま",
	"Rindo Berry": "リンドのみ（くさ）",
	"Ring Target": "ねらいのまと",
	"Rock Gem": "いわのジュエル",
	"Rock Memory": "ロックメモリ",
	"Rockium Z": "イワＺ",
	"Rocky Helmet": "ゴツゴツメット",
	"Roseli Berry": "ロゼルのみ（フェアリー）",
	"Rowap Berry": "レンブのみ",
	"Safety Goggles": "ぼうじんゴーグル",
	"Scope Lens": "ピントレンズ",
	"Sharp Beak": "するどいくちばし",
	"Shell Bell": "かいがらのすず",
	"Shuca Berry": "シュカのみ（じめん）",
	"Silk Scarf": "シルクのスカーフ",
	"Silver Powder": "ぎんのこな",
	"Sitrus Berry": "オボンのみ",
	"Sky Plate": "あおぞらプレート",
	"Smooth Rock": "さらさらいわ",
	"Snorlium Z": "カビゴンＺ",
	"Snowball": "ゆきだま",
	"Soft Sand": "やわらかいすな",
	"Soul Dew": "こころのしずく",
	"Spell Tag": "のろいのおふだ",
	"Splash Plate": "しずくプレート",
	"Spooky Plate": "もののけプレート",
	"Steel Gem": "はがねのジュエル",
	"Steel Memory": "スチールメモリ",
	"Steelium Z": "ハガネＺ",
	"Stick": "ながねぎ",
	"Sticky Barb": "くっつきバリ",
	"Stone Plate": "がんせきプレート",
	"Tanga Berry": "タンガのみ（むし）",
	"Tapunium Z": "カプＺ",
	"Terrain Extender": "グランドコート",
	"Thick Club": "ふといホネ",
	"Toxic Orb": "どくどくだま",
	"Toxic Plate": "もうどくプレート",
	"Twisted Spoon": "まがったスプーン",
	"Wacan Berry": "ソクノのみ（でんき）",
	"Water Gem": "みずのジュエル",
	"Water Memory": "ウオーターメモリ",
	"Waterium Z": "ミズＺ",
	"Weakness Policy": "じゃくてんほけん",
	"White Herb": "しろいハーブ",
	"Wide Lens": "こうかくレンズ",
	"Wise Glasses": "ものしりメガネ",
	"Yache Berry": "ヤチェのみ（こおり）",
	"Zap Plate": "いかずちプレート",
	"Zoom Lens": "フォーカスレンズ",
	"Wiki Berry": "ウイのみ",
	"Figy Berry": "フィラのみ",
	"Iapapa Berry": "イアのみ",
	"Aguav Berry": "バンジのみ",
	"Mago Berry": "マゴのみ",

	"Gengarite": "ゲンガナイト",
	"Gardevoirite": "サーナイトナイト",
	"Ampharosite": "デンリュウナイト",
	"Venusaurite": "フシギバナナイト",
	"Charizardite X": "リザードナイトＸ",
	"Blastoisinite": "カメックスナイト",
	"Mewtwonite X": "ミュウツナイトＸ",
	"Mewtwonite Y": "ミュウツナイトＹ",
	"Blazikenite": "バシャーモナイト",
	"Medichamite": "チャーレムナイト",
	"Houndoominite": "ヘルガナイト",
	"Aggronite": "ボスゴドラナイト",
	"Banettite": "ジュペッタナイト",
	"Tyranitarite": "バンギラスナイト",
	"Scizorite": "ハッサムナイト",
	"Pinsirite": "カイロスナイト",
	"Aerodactylite": "プテラナイト",
	"Lucarionite": "ルカリオナイト",
	"Abomasite": "ユキノオナイト",
	"Kangaskhanite": "ガルーラナイト",
	"Gyaradosite": "ギャラドスナイト",
	"Absolite": "アブソルナイト",
	"Charizardite Y": "リザードナイトＹ",
	"Alakazite": "フーディナイト",
	"Heracronite": "ヘラクロスナイト",
	"Mawilite": "クチートナイト",
	"Manectite": "ライボルトナイト",
	"Garchompite": "ガブリアスナイト",
	"Salamencite": "ボーマンダナイト",
	"Lopunnite": "ミミロップナイト",
	"Swampertite": "ラグラージナイト",
	"Sceptilite": "ジュカインナイト",
	"Latiasite": "ラティアスナイト",
	"Latiosite": "ラティオスナイト",
	"Steelixite": "ハガネールナイト",

	// Pokemon
	"Bulbasaur": "フシギダネ",
	"Ivysaur": "フシギソウ",
	"Venusaur": "フシギバナ",
	"Venusaur-Mega": "メガフシギバナ",
	"Charmander": "ヒトカゲ",
	"Charmeleon": "リザード",
	"Charizard": "リザードン",
	"Charizard-Mega-X": "メガリザードンX",
	"Charizard-Mega-Y": "メガリザードンY",
	"Squirtle": "ゼニガメ",
	"Wartortle": "カメール",
	"Blastoise": "カメックス",
	"Blastoise-Mega": "メガカメックス",
	"Caterpie": "キャタピー",
	"Metapod": "トランセル",
	"Butterfree": "バタフリー",
	"Weedle": "ビードル",
	"Kakuna": "コクーン",
	"Beedrill": "スピアー",
	"Beedrill-Mega": "メガスピアー",
	"Pidgey": "ポッポ",
	"Pidgeotto": "ピジョン",
	"Pidgeot": "ピジョット",
	"Pidgeot-Mega": "メガピジョット",
	"Rattata": "コラッタ",
	"Raticate": "ラッタ",
	"Rattata-Alola": "コラッタ-Alola",
	"Raticate-Alola": "ラッタ-Alola",
	"Spearow": "オニスズメ",
	"Fearow": "オニドリル",
	"Ekans": "アーボ",
	"Arbok": "アーボック",
	"Pikachu": "ピカチュウ",
	"Raichu": "ライチュウ",
	"Raichu-Alola": "ライチュウ-Alola",
	"Sandshrew": "サンド",
	"Sandslash": "サンドパン",
	"Sandshrew-Alola": "サンド-Alola",
	"Sandslash-Alola": "サンドパン-Alola",
	"Nidoran-F": "ニドラン♀",
	"Nidorina": "ニドリーナ",
	"Nidoqueen": "ニドクイン",
	"Nidoran-M": "ニドラン♂",
	"Nidorino": "ニドリーノ",
	"Nidoking": "ニドキング",
	"Clefairy": "ピッピ",
	"Clefable": "ピクシー",
	"Vulpix": "ロコン",
	"Ninetales": "キュウコン",
	"Vulpix-Alola": "ロコン-Alola",
	"Ninetales-Alola": "キュウコン-Alola",
	"Jigglypuff": "プリン",
	"Wigglytuff": "プクリン",
	"Zubat": "ズバット",
	"Golbat": "ゴルバット",
	"Oddish": "ナゾノクサ",
	"Gloom": "クサイハナ",
	"Vileplume": "ラフレシア",
	"Paras": "パラス",
	"Parasect": "パラセクト",
	"Venonat": "コンパン",
	"Venomoth": "モルフォン",
	"Diglett": "ディグダ",
	"Dugtrio": "ダグトリオ",
	"Diglett-Alola": "ディグダ-Alola",
	"Dugtrio-Alola": "ダグトリオ-Alola",
	"Meowth-Alola": "ニャース-Alola",
	"Persian-Alola": "ペルシアン-Alola",
	"Meowth": "ニャース",
	"Persian": "ペルシアン",
	"Psyduck": "コダック",
	"Golduck": "ゴルダック",
	"Mankey": "マンキー",
	"Primeape": "オコリザル",
	"Growlithe": "ガーディ",
	"Arcanine": "ウインディ",
	"Poliwag": "ニョロモ",
	"Poliwhirl": "ニョロゾ",
	"Poliwrath": "ニョロボン",
	"Abra": "ケーシィ",
	"Kadabra": "ユンゲラー",
	"Alakazam": "フーディン",
	"Alakazam-Mega": "メガフーディン",
	"Machop": "ワンリキー",
	"Machoke": "ゴーリキー",
	"Machamp": "カイリキー",
	"Bellsprout": "マダツボミ",
	"Weepinbell": "ウツドン",
	"Victreebel": "ウツボット",
	"Tentacool": "メノクラゲ",
	"Tentacruel": "ドククラゲ",
	"Geodude": "イシツブテ",
	"Graveler": "ゴローン",
	"Golem": "ゴローニャ",
	"Geodude-Alola": "イシツブテ-Alola",
	"Graveler-Alola": "ゴローン-Alola",
	"Golem-Alola": "ゴローニャ-Alola",
	"Ponyta": "ポニータ",
	"Rapidash": "ギャロップ",
	"Slowpoke": "ヤドン",
	"Slowbro": "ヤドラン",
	"Slowbro-Mega": "メガヤドラン",
	"Magnemite": "コイル",
	"Magneton": "レアコイル",
	"Farfetch'd": "カモネギ",
	"Doduo": "ドードー",
	"Dodrio": "ドードリオ",
	"Seel": "パウワウ",
	"Dewgong": "ジュゴン",
	"Grimer": "ベトベター",
	"Muk": "ベトベトン",
	"Grimer-Alola": "ベトベター-Alola",
	"Muk-Alola": "ベトベトン-Alola",
	"Shellder": "シェルダー",
	"Cloyster": "パルシェン",
	"Gastly": "ゴース",
	"Haunter": "ゴースト",
	"Gengar": "ゲンガー",
	"Gengar-Mega": "メガゲンガー",
	"Onix": "イワーク",
	"Drowzee": "スリープ",
	"Hypno": "スリーパー",
	"Krabby": "クラブ",
	"Kingler": "キングラー",
	"Voltorb": "ビリリダマ",
	"Electrode": "マルマイン",
	"Exeggcute": "タマタマ",
	"Exeggutor": "ナッシー",
	"Exeggutor-Alola": "ナッシー-Alola",
	"Cubone": "カラカラ",
	"Marowak": "ガラガラ",
	"Marowak-Alola": "ガラガラ-Alola",
	"Hitmonlee": "サワムラー",
	"Hitmonchan": "エビワラー",
	"Lickitung": "ベロリンガ",
	"Koffing": "ドガース",
	"Weezing": "マタドガス",
	"Rhyhorn": "サイホーン",
	"Rhydon": "サイドン",
	"Chansey": "ラッキー",
	"Tangela": "モンジャラ",
	"Kangaskhan": "ガルーラ",
	"Kangaskhan-Mega": "メガガルーラ",
	"Horsea": "タッツー",
	"Seadra": "シードラ",
	"Goldeen": "トサキント",
	"Seaking": "アズマオウ",
	"Staryu": "ヒトデマン",
	"Starmie": "スターミー",
	"Mr.Mime": "バリヤード",
	"Scyther": "ストライク",
	"Jynx": "ルージュラ",
	"Electabuzz": "エレブー",
	"Magmar": "ブーバー",
	"Pinsir": "カイロス",
	"Pinsir-Mega": "メガカイロス",
	"Tauros": "ケンタロス",
	"Magikarp": "コイキング",
	"Gyarados": "ギャラドス",
	"Gyarados-Mega": "メガギャラドス",
	"Lapras": "ラプラス",
	"Ditto": "メタモン",
	"Eevee": "イーブイ",
	"Vaporeon": "シャワーズ",
	"Jolteon": "サンダース",
	"Flareon": "ブースター",
	"Porygon": "ポリゴン",
	"Omanyte": "オムナイト",
	"Omastar": "オムスター",
	"Kabuto": "カブト",
	"Kabutops": "カブトプス",
	"Aerodactyl": "プテラ",
	"Aerodactyl-Mega": "メガプテラ",
	"Snorlax": "カビゴン",
	"Articuno": "フリーザー",
	"Zapdos": "サンダー",
	"Moltres": "ファイヤー",
	"Dratini": "ミニリュウ",
	"Dragonair": "ハクリュー",
	"Dragonite": "カイリュー",
	"Mewtwo": "ミュウツー",
	"Mewtwo-Mega-Y": "メガミュウツーY",
	"Mewtwo-Mega-X": "メガミュウツーX",
	"Mew": "ミュウ",
	"Chikorita": "チコリータ",
	"Bayleef": "ベイリーフ",
	"Meganium": "メガニウム",
	"Cyndaquil": "ヒノアラシ",
	"Quilava": "マグマラシ",
	"Typhlosion": "バクフーン",
	"Totodile": "ワニノコ",
	"Croconaw": "アリゲイツ",
	"Feraligatr": "オーダイル",
	"Sentret": "オタチ",
	"Furret": "オオタチ",
	"Hoothoot": "ホーホー",
	"Noctowl": "ヨルノズク",
	"Ledyba": "レディバ",
	"Ledian": "レディアン",
	"Spinarak": "イトマル",
	"Ariados": "アリアドス",
	"Crobat": "クロバット",
	"Chinchou": "チョンチー",
	"Lanturn": "ランターン",
	"Pichu": "ピチュー",
	"Cleffa": "ピィ",
	"Igglybuff": "ププリン",
	"Togepi": "トゲピー",
	"Togetic": "トゲチック",
	"Natu": "ネイティ",
	"Xatu": "ネイティオ",
	"Mareep": "メリープ",
	"Flaaffy": "モココ",
	"Ampharos": "デンリュウ",
	"Ampharos-Mega": "メガデンリュウ",
	"Bellossom": "キレイハナ",
	"Marill": "マリル",
	"Azumarill": "マリルリ",
	"Sudowoodo": "ウソッキー",
	"Politoed": "ニョロトノ",
	"Hoppip": "ハネッコ",
	"Skiploom": "ポポッコ",
	"Jumpluff": "ワタッコ",
	"Aipom": "エイパム",
	"Sunkern": "ヒマナッツ",
	"Sunflora": "キマワリ",
	"Yanma": "ヤンヤンマ",
	"Wooper": "ウパー",
	"Quagsire": "ヌオー",
	"Espeon": "エーフィ",
	"Umbreon": "ブラッキー",
	"Murkrow": "ヤミカラス",
	"Slowking": "ヤドキング",
	"Misdreavus": "ムウマ",
	"Unown": "アンノーン",
	"Wobbuffet": "ソーナンス",
	"Girafarig": "キリンリキ",
	"Pineco": "クヌギダマ",
	"Forretress": "フォレトス",
	"Dunsparce": "ノコッチ",
	"Gligar": "グライガー",
	"Steelix": "ハガネール",
	"Steelix-Mega": "メガハガネール",
	"Snubbull": "ブルー",
	"Granbull": "グランブル",
	"Qwilfish": "ハリーセン",
	"Scizor": "ハッサム",
	"Scizor-Mega": "メガハッサム",
	"Shuckle": "ツボツボ",
	"Heracross": "ヘラクロス",
	"Heracross-Mega": "メガヘラクロス",
	"Sneasel": "ニューラ",
	"Teddiursa": "ヒメグマ",
	"Ursaring": "リングマ",
	"Slugma": "マグマッグ",
	"Magcargo": "マグカルゴ",
	"Swinub": "ウリムー",
	"Piloswine": "イノムー",
	"Corsola": "サニーゴ",
	"Remoraid": "テッポウオ",
	"Octillery": "オクタン",
	"Delibird": "デリバード",
	"Mantine": "マンタイン",
	"Skarmory": "エアームド",
	"Houndour": "デルビル",
	"Houndoom": "ヘルガー",
	"Houndoom-Mega": "メガヘルガー",
	"Kingdra": "キングドラ",
	"Phanpy": "ゴマゾウ",
	"Donphan": "ドンファン",
	"Porygon2": "ポリゴン2",
	"Stantler": "オドシシ",
	"Smeargle": "ドーブル",
	"Tyrogue": "バルキー",
	"Hitmontop": "カポエラー",
	"Smoochum": "ムチュール",
	"Elekid": "エレキッド",
	"Magby": "ブビィ",
	"Miltank": "ミルタンク",
	"Blissey": "ハピナス",
	"Raikou": "ライコウ",
	"Entei": "エンテイ",
	"Suicune": "スイクン",
	"Larvitar": "ヨーギラス",
	"Pupitar": "サナギラス",
	"Tyranitar": "バンギラス",
	"Tyranitar-Mega": "メガバンギラス",
	"Lugia": "ルギア",
	"Ho-Oh": "ホウオウ",
	"Celebi": "セレビィ",
	"Treecko": "キモリ",
	"Grovyle": "ジュプトル",
	"Sceptile": "ジュカイン",
	"Sceptile-Mega": "メガジュカイン",
	"Torchic": "アチャモ",
	"Combusken": "ワカシャモ",
	"Blaziken": "バシャーモ",
	"Blaziken-Mega": "メガバシャーモ",
	"Mudkip": "ミズゴロウ",
	"Marshtomp": "ヌマクロー",
	"Swampert": "ラグラージ",
	"Swampert-Mega": "メガラグラージ",
	"Poochyena": "ポチエナ",
	"Mightyena": "グラエナ",
	"Zigzagoon": "ジグザグマ",
	"Linoone": "マッスグマ",
	"Wurmple": "ケムッソ",
	"Silcoon": "カラサリス",
	"Beautifly": "アゲハント",
	"Cascoon": "マユルド",
	"Dustox": "ドクケイル",
	"Lotad": "ハスボー",
	"Lombre": "ハスブレロ",
	"Ludicolo": "ルンパッパ",
	"Seedot": "タネボー",
	"Nuzleaf": "コノハナ",
	"Shiftry": "ダーテング",
	"Taillow": "スバメ",
	"Swellow": "オオスバメ",
	"Wingull": "キャモメ",
	"Pelipper": "ペリッパー",
	"Ralts": "ラルトス",
	"Kirlia": "キルリア",
	"Gardevoir": "サーナイト",
	"Gardevoir-Mega": "メガサーナイト",
	"Surskit": "アメタマ",
	"Masquerain": "アメモース",
	"Shroomish": "キノココ",
	"Breloom": "キノガッサ",
	"Slakoth": "ナマケロ",
	"Vigoroth": "ヤルキモノ",
	"Slaking": "ケッキング",
	"Nincada": "ツチニン",
	"Ninjask": "テッカニン",
	"Shedinja": "ヌケニン",
	"Whismur": "ゴニョニョ",
	"Loudred": "ドゴーム",
	"Exploud": "バクオング",
	"Makuhita": "マクノシタ",
	"Hariyama": "ハリテヤマ",
	"Azurill": "ルリリ",
	"Nosepass": "ノズパス",
	"Skitty": "エネコ",
	"Delcatty": "エネコロロ",
	"Sableye": "ヤミラミ",
	"Sableye-Mega": "メガヤミラミ",
	"Mawile": "クチート",
	"Mawile-Mega": "メガクチート",
	"Aron": "ココドラ",
	"Lairon": "コドラ",
	"Aggron": "ボスゴドラ",
	"Aggron-Mega": "メガボスゴドラ",
	"Meditite": "アサナン",
	"Medicham": "チャーレム",
	"Medicham-Mega": "メガチャーレム",
	"Electrike": "ラクライ",
	"Manectric": "ライボルト",
	"Manectric-Mega": "メガライボルト",
	"Plusle": "プラスル",
	"Minun": "マイナン",
	"Volbeat": "バルビート",
	"Illumise": "イルミーゼ",
	"Roselia": "ロゼリア",
	"Gulpin": "ゴクリン",
	"Swalot": "マルノーム",
	"Carvanha": "キバニア",
	"Sharpedo": "サメハダー",
	"Sharpedo-Mega": "メガサメハダー",
	"Wailmer": "ホエルコ",
	"Wailord": "ホエルオー",
	"Numel": "ドンメル",
	"Camerupt": "バクーダ",
	"Camerupt-Mega": "メガバクーダ",
	"Torkoal": "コータス",
	"Spoink": "バネブー",
	"Grumpig": "ブーピッグ",
	"Spinda": "パッチール",
	"Trapinch": "ナックラー",
	"Vibrava": "ビブラーバ",
	"Flygon": "フライゴン",
	"Cacnea": "サボネア",
	"Cacturne": "ノクタス",
	"Swablu": "チルット",
	"Altaria": "チルタリス",
	"Altaria-Mega": "メガチルタリス",
	"Zangoose": "ザングース",
	"Seviper": "ハブネーク",
	"Lunatone": "ルナトーン",
	"Solrock": "ソルロック",
	"Barboach": "ドジョッチ",
	"Whiscash": "ナマズン",
	"Corphish": "ヘイガニ",
	"Crawdaunt": "シザリガー",
	"Baltoy": "ヤジロン",
	"Claydol": "ネンドール",
	"Lileep": "リリーラ",
	"Cradily": "ユレイドル",
	"Anorith": "アノプス",
	"Armaldo": "アーマルド",
	"Feebas": "ヒンバス",
	"Milotic": "ミロカロス",
	"Castform": "ポワルン",
	"Castform-Rainy": "ポワルン-雨",
	"Castform-Snowy": "ポワルン-霰",
	"Castform-Sunny": "ポワルン-晴",
	"Kecleon": "カクレオン",
	"Shuppet": "カゲボウズ",
	"Banette": "ジュペッタ",
	"Banette-Mega": "メガジュペッタ",
	"Duskull": "ヨマワル",
	"Dusclops": "サマヨール",
	"Tropius": "トロピウス",
	"Chimecho": "チリーン",
	"Absol": "アブソル",
	"Absol-Mega": "メガアブソル",
	"Wynaut": "ソーナノ",
	"Snorunt": "ユキワラシ",
	"Glalie": "オニゴーリ",
	"Glalie-Mega": "メガオニゴーリ",
	"Spheal": "タマザラシ",
	"Sealeo": "トドグラー",
	"Walrein": "トドゼルガ",
	"Clamperl": "パールル",
	"Huntail": "ハンテール",
	"Gorebyss": "サクラビス",
	"Relicanth": "ジーランス",
	"Luvdisc": "ラブカス",
	"Bagon": "タツベイ",
	"Shelgon": "コモルー",
	"Salamence": "ボーマンダ",
	"Salamence-Mega": "メガボーマンダ",
	"Beldum": "ダンバル",
	"Metang": "メタング",
	"Metagross": "メタグロス",
	"Metagross-Mega": "メガメタグロス",
	"Regirock": "レジロック",
	"Regice": "レジアイス",
	"Registeel": "レジスチル",
	"Latias": "ラティアス",
	"Latios": "ラティオス",
	"Latias-Mega": "メガラティアス",
	"Latios-Mega": "メガラティオス",
	"Kyogre": "カイオーガ",
	"Groudon": "グラードン",
	"Kyogre-Primal": "ゲンシカイオーガ",
	"Groudon-Primal": "ゲンシグラードン",
	"Rayquaza": "レックウザ",
	"Rayquaza-Mega": "メガレックウザ",
	"Jirachi": "ジラーチ",
	"Deoxys": "デオキシス",
	"Deoxys-Attack": "デオキシス-Attack",
	"Deoxys-Defense": "デオキシス-Defense",
	"Deoxys-Speed": "デオキシス-Speed",
	"Turtwig": "ナエトル",
	"Grotle": "ハヤシガメ",
	"Torterra": "ドダイトス",
	"Chimchar": "ヒコザル",
	"Monferno": "モウカザル",
	"Infernape": "ゴウカザル",
	"Piplup": "ポッチャマ",
	"Prinplup": "ポッタイシ",
	"Empoleon": "エンペルト",
	"Starly": "ムックル",
	"Staravia": "ムクバード",
	"Staraptor": "ムクホーク",
	"Bidoof": "ビッパ",
	"Bibarel": "ビーダル",
	"Kricketot": "コロボーシ",
	"Kricketune": "コロトック",
	"Shinx": "コリンク",
	"Luxio": "ルクシオ",
	"Luxray": "レントラー",
	"Budew": "スボミー",
	"Roserade": "ロズレイド",
	"Cranidos": "ズガイドス",
	"Rampardos": "ラムパルド",
	"Shieldon": "タテトプス",
	"Bastiodon": "トリデプス",
	"Burmy": "ミノムッチ",
	"Wormadam": "ミノマダム",
	"Wormadam-Sandy": "ミノマダム-砂",
	"Wormadam-Trash": "ミノマダム-塵",
	"Mothim": "ガーメイル",
	"Combee": "ミツハニー",
	"Vespiquen": "ビークイン",
	"Pachirisu": "パチリス",
	"Buizel": "ブイゼル",
	"Floatzel": "フローゼル",
	"Cherubi": "チェリンボ",
	"Cherrim": "チェリム",
	"Cherrim-Sunshine": "チェリム-晴",
	"Shellos": "カラナクシ",
	"Gastrodon": "トリトドン",
	"Ambipom": "エテボース",
	"Drifloon": "フワンテ",
	"Drifblim": "フワライド",
	"Buneary": "ミミロル",
	"Lopunny": "ミミロップ",
	"Lopunny-Mega": "メガミミロップ",
	"Mismagius": "ムウマージ",
	"Honchkrow": "ドンカラス",
	"Glameow": "ニャルマー",
	"Purugly": "ブニャット",
	"Chingling": "リーシャン",
	"Stunky": "スカンプー",
	"Skuntank": "スカタンク",
	"Bronzor": "ドーミラー",
	"Bronzong": "ドータクン",
	"Bonsly": "ウソハチ",
	"MimeJr.": "マネネ",
	"Happiny": "ピンプク",
	"Chatot": "ペラップ",
	"Spiritomb": "ミカルゲ",
	"Gible": "フカマル",
	"Gabite": "ガバイト",
	"Garchomp": "ガブリアス",
	"Garchomp-Mega": "メガガブリアス",
	"Munchlax": "ゴンベ",
	"Riolu": "リオル",
	"Lucario": "ルカリオ",
	"Lucario-Mega": "メガルカリオ",
	"Hippopotas": "ヒポポタス",
	"Hippowdon": "カバルドン",
	"Skorupi": "スコルピ",
	"Drapion": "ドラピオン",
	"Croagunk": "グレッグル",
	"Toxicroak": "ドクロッグ",
	"Carnivine": "マスキッパ",
	"Finneon": "ケイコウオ",
	"Lumineon": "ネオラント",
	"Mantyke": "タマンタ",
	"Snover": "ユキカブリ",
	"Abomasnow": "ユキノオー",
	"Abomasnow-Mega": "メガユキノオー",
	"Weavile": "マニューラ",
	"Magnezone": "ジバコイル",
	"Lickilicky": "ベロベルト",
	"Rhyperior": "ドサイドン",
	"Tangrowth": "モジャンボ",
	"Electivire": "エレキブル",
	"Magmortar": "ブーバーン",
	"Togekiss": "トゲキッス",
	"Yanmega": "メガヤンマ",
	"Leafeon": "リーフィア",
	"Glaceon": "グレイシア",
	"Gliscor": "グライオン",
	"Mamoswine": "マンムー",
	"Porygon-Z": "ポリゴンZ",
	"Gallade": "エルレイド",
	"Gallade-Mega": "メガエルレイド",
	"Probopass": "ダイノーズ",
	"Dusknoir": "ヨノワール",
	"Froslass": "ユキメノコ",
	"Rotom": "ロトム",
	"Rotom-Fan": "ロトム-Spin",
	"Rotom-Wash": "ロトム-Wash",
	"Rotom-Mow": "ロトム-Cut",
	"Rotom-Heat": "ロトム-Heat",
	"Rotom-Frost": "ロトム-Frost",
	"Uxie": "ユクシー",
	"Mesprit": "エムリット",
	"Azelf": "アグノム",
	"Dialga": "ディアルガ",
	"Palkia": "パルキア",
	"Heatran": "ヒードラン",
	"Regigigas": "レジギガス",
	"Giratina": "ギラティナ",
	"Giratina-Origin": "ギラティナ-Origin",
	"Cresselia": "クレセリア",
	"Phione": "フィオネ",
	"Manaphy": "マナフィ",
	"Darkrai": "ダークライ",
	"Shaymin": "シェイミ",
	"Shaymin-Sky": "シェイミ-Sky",
	"Arceus": "アルセウス",
	"Arceus-Bug": "アルセウス-Bug",
	"Arceus-Dark": "アルセウス-Dark",
	"Arceus-Dragon": "アルセウス-Dragon",
	"Arceus-Electric": "アルセウス-Electric",
	"Arceus-Fairy": "アルセウス-Fairy",
	"Arceus-Fighting": "アルセウス-Fighting",
	"Arceus-Fire": "アルセウス-Fire",
	"Arceus-Flying": "アルセウス-Flying",
	"Arceus-Ghost": "アルセウス-Ghost",
	"Arceus-Grass": "アルセウス-Grass",
	"Arceus-Ground": "アルセウス-Ground",
	"Arceus-Ice": "アルセウス-Ice",
	"Arceus-Poison": "アルセウス-Poison",
	"Arceus-Psychic": "アルセウス-Psychic",
	"Arceus-Rock": "アルセウス-Rock",
	"Arceus-Steel": "アルセウス-Steel",
	"Arceus-Water": "アルセウス-Water",
	"Victini": "ビクティニ",
	"Snivy": "ツタージャ",
	"Servine": "ジャノビー",
	"Serperior": "ジャローダ",
	"Tepig": "ポカブ",
	"Pignite": "チャオブー",
	"Emboar": "エンブオー",
	"Oshawott": "ミジュマル",
	"Dewott": "フタチマル",
	"Samurott": "ダイケンキ",
	"Patrat": "ミネズミ",
	"Watchog": "ミルホッグ",
	"Lillipup": "ヨーテリー",
	"Herdier": "ハーデリア",
	"Stoutland": "ムーランド",
	"Purrloin": "チョロネコ",
	"Liepard": "レパルダス",
	"Pansage": "ヤナップ",
	"Simisage": "ヤナッキー",
	"Pansear": "バオップ",
	"Simisear": "バオッキー",
	"Panpour": "ヒヤップ",
	"Simipour": "ヒヤッキー",
	"Munna": "ムンナ",
	"Musharna": "ムシャーナ",
	"Pidove": "マメパト",
	"Tranquill": "ハトーボー",
	"Unfezant": "ケンホロウ",
	"Blitzle": "シママ",
	"Zebstrika": "ゼブライカ",
	"Roggenrola": "ダンゴロ",
	"Boldore": "ガントル",
	"Gigalith": "ギガイアス",
	"Woobat": "コロモリ",
	"Swoobat": "ココロモリ",
	"Drilbur": "モグリュー",
	"Excadrill": "ドリュウズ",
	"Audino": "タブンネ",
	"Audino-Mega": "メガタブンネ",
	"Timburr": "ドッコラー",
	"Gurdurr": "ドテッコツ",
	"Conkeldurr": "ローブシン",
	"Tympole": "オタマロ",
	"Palpitoad": "ガマガル",
	"Seismitoad": "ガマゲロゲ",
	"Throh": "ナゲキ",
	"Sawk": "ダゲキ",
	"Sewaddle": "クルミル",
	"Swadloon": "クルマユ",
	"Leavanny": "ハハコモリ",
	"Venipede": "フシデ",
	"Whirlipede": "ホイーガ",
	"Scolipede": "ペンドラー",
	"Cottonee": "モンメン",
	"Whimsicott": "エルフーン",
	"Petilil": "チュリネ",
	"Lilligant": "ドレディア",
	"Basculin": "バスラオ-赤",
	"Basculin-Blue-Striped": "バスラオ-青",
	"Sandile": "メグロコ",
	"Krokorok": "ワルビル",
	"Krookodile": "ワルビアル",
	"Darumaka": "ダルマッカ",
	"Darmanitan": "ヒヒダルマ",
	"Darmanitan-Zen": "ヒヒダルマ-Zen",
	"Maractus": "マラカッチ",
	"Dwebble": "イシズマイ",
	"Crustle": "イワパレス",
	"Scraggy": "ズルッグ",
	"Scrafty": "ズルズキン",
	"Sigilyph": "シンボラー",
	"Yamask": "デスマス",
	"Cofagrigus": "デスカーン",
	"Tirtouga": "プロトーガ",
	"Carracosta": "アバゴーラ",
	"Archen": "アーケン",
	"Archeops": "アーケオス",
	"Trubbish": "ヤブクロン",
	"Garbodor": "ダストダス",
	"Zorua": "ゾロア",
	"Zoroark": "ゾロアーク",
	"Minccino": "チラーミィ",
	"Cinccino": "チラチーノ",
	"Gothita": "ゴチム",
	"Gothorita": "ゴチミル",
	"Gothitelle": "ゴチルゼル",
	"Solosis": "ユニラン",
	"Duosion": "ダブラン",
	"Reuniclus": "ランクルス",
	"Ducklett": "コアルヒー",
	"Swanna": "スワンナ",
	"Vanillite": "バニプッチ",
	"Vanillish": "バニリッチ",
	"Vanilluxe": "バイバニラ",
	"Deerling": "シキジカ",
	"Sawsbuck": "メブキジカ",
	"Emolga": "エモンガ",
	"Karrablast": "カブルモ",
	"Escavalier": "シュバルゴ",
	"Foongus": "タマゲタケ",
	"Amoonguss": "モロバレル",
	"Frillish": "プルリル",
	"Jellicent": "ブルンゲル",
	"Alomomola": "ママンボウ",
	"Joltik": "バチュル",
	"Galvantula": "デンチュラ",
	"Ferroseed": "テッシード",
	"Ferrothorn": "ナットレイ",
	"Klink": "ギアル",
	"Klang": "ギギアル",
	"Klinklang": "ギギギアル",
	"Tynamo": "シビシラス",
	"Eelektrik": "シビビール",
	"Eelektross": "シビルドン",
	"Elgyem": "リグレー",
	"Beheeyem": "オーベム",
	"Litwick": "ヒトモシ",
	"Lampent": "ランプラー",
	"Chandelure": "シャンデラ",
	"Axew": "キバゴ",
	"Fraxure": "オノンド",
	"Haxorus": "オノノクス",
	"Cubchoo": "クマシュン",
	"Beartic": "ツンベアー",
	"Cryogonal": "フリージオ",
	"Shelmet": "チョボマキ",
	"Accelgor": "アギルダー",
	"Stunfisk": "マッギョ",
	"Mienfoo": "コジョフー",
	"Mienshao": "コジョンド",
	"Druddigon": "クリムガン",
	"Golett": "ゴビット",
	"Golurk": "ゴルーグ",
	"Pawniard": "コマタナ",
	"Bisharp": "キリキザン",
	"Bouffalant": "バッフロン",
	"Rufflet": "ワシボン",
	"Braviary": "ウォーグル",
	"Vullaby": "バルチャイ",
	"Mandibuzz": "バルジーナ",
	"Heatmor": "クイタラン",
	"Durant": "アイアント",
	"Deino": "モノズ",
	"Zweilous": "ジヘッド",
	"Hydreigon": "サザンドラ",
	"Larvesta": "メラルバ",
	"Volcarona": "ウルガモス",
	"Cobalion": "コバルオン",
	"Terrakion": "テラキオン",
	"Virizion": "ビリジオン",
	"Tornadus": "トルネロス",
	"Thundurus": "ボルトロス",
	"Tornadus-Therian": "トルネロス-霊獣",
	"Thundurus-Therian": "ボルトロス-霊獣",
	"Reshiram": "レシラム",
	"Zekrom": "ゼクロム",
	"Landorus": "ランドロス",
	"Landorus-Therian": "ランドロス-霊獣",
	"Kyurem": "キュレム",
	"Kyurem-Black": "キュレム-黒",
	"Kyurem-White": "キュレム-白",
	"Keldeo": "ケルディオ",
	"Keldeo-Resolute": "ケルディオ-覚悟の姿",
	"Meloetta": "メロエッタ",
	"Meloetta-Pirouette": "メロエッタ-ステップフォルム",
	"Genesect": "ゲノセクト",
	"Genesect-Burn": "ゲノセクト-Burn",
	"Genesect-Chill": "ゲノセクト-Chill",
	"Genesect-Douse": "ゲノセクト-Douse",
	"Genesect-Shock": "ゲノセクト-Shock",
	"Chespin": "ハリマロン",
	"Quilladin": "ハリボーグ",
	"Chesnaught": "ブリガロン",
	"Fennekin": "フォッコ",
	"Braixen": "テールナー",
	"Delphox": "マフォクシー",
	"Froakie": "ケロマツ",
	"Frogadier": "ゲコガシラ",
	"Greninja": "ゲッコウガ",
	"Greninja-Ash": "サトシゲッコウガ",
	"Bunnelby": "ホルビー",
	"Diggersby": "ホルード",
	"Fletchling": "ヤヤコマ",
	"Fletchinder": "ヒノヤコマ",
	"Talonflame": "ファイアロー",
	"Scatterbug": "コフキムシ",
	"Spewpa": "コフーライ",
	"Vivillon": "ビビヨン",
	"Litleo": "シシコ",
	"Pyroar": "カエンジシ",
	"Flabébé": "フラベベ",
	"Floette": "フラエッテ",
	"Floette-Eternal": "フラエッテ-Eternal",
	"Florges": "フラージェス",
	"Skiddo": "メェークル",
	"Gogoat": "ゴーゴート",
	"Pancham": "ヤンチャム",
	"Pangoro": "ゴロンダ",
	"Furfrou": "トリミアン",
	"Espurr": "ニャスパー",
	"Meowstic": "ニャオニクス",
	"Honedge": "ヒトツキ",
	"Doublade": "ニダンギル",
	"Aegislash": "ギルガルド",
	"Spritzee": "シュシュプ",
	"Aromatisse": "フレフワン",
	"Swirlix": "ペロッパフ",
	"Slurpuff": "ペロリーム",
	"Inkay": "マーイーカ",
	"Malamar": "カラマネロ",
	"Binacle": "カメテテ",
	"Barbaracle": "ガメノデス",
	"Skrelp": "クズモー",
	"Dragalge": "ドラミドロ",
	"Clauncher": "ウデッポウ",
	"Clawitzer": "ブロスター",
	"Helioptile": "エリキテル",
	"Heliolisk": "エレザード",
	"Tyrunt": "チゴラス",
	"Tyrantrum": "ガチゴラス",
	"Amaura": "アマルス",
	"Aurorus": "アマルルガ",
	"Sylveon": "ニンフィア",
	"Hawlucha": "ルチャブル",
	"Dedenne": "デデンネ",
	"Carbink": "メレシー",
	"Goomy": "ヌメラ",
	"Sliggoo": "ヌメイル",
	"Goodra": "ヌメルゴン",
	"Klefki": "クレッフィ",
	"Phantump": "ボクレー",
	"Trevenant": "オーロット",
	"Pumpkaboo": "バケッチャ",
	"Pumpkaboo-Large": "バケッチャ-大きい",
	"Pumpkaboo-Small": "バケッチャ-小さい",
	"Pumpkaboo-Super": "バケッチャ-特大",
	"Gourgeist": "パンプジン",
	"Gourgeist-Large": "バンプジン-大きい",
	"Gourgeist-Small": "パンプジン-小さい",
	"Gourgeist-Super": "パンプジン-特大",
	"Bergmite": "カチコール",
	"Avalugg": "クレベース",
	"Noibat": "オンバット",
	"Noivern": "オンバーン",
	"Xerneas": "ゼルネアス",
	"Yveltal": "イベルタル",
	"Zygarde": "ジガルデ",
	"Zygarde-10%": "ジガルデ-10%",
	"Zygarde-Complete": "ジガルデ-Perfect",
	"Diancie": "ディアンシー",
	"Diancie-Mega": "メガディアンシー",
	"Hoopa": "フーパ",
	"Hoopa-Unbound": "フーパ-Unbound",
	"Volcanion": "ボルケニオン",
	"Rowlet": "モクロー",
	"Dartrix": "フクスロー",
	"Decidueye": "ジュナイパー",
	"Litten": "ニャビー",
	"Torracat": "ニャヒート",
	"Incineroar": "ガオガエン",
	"Popplio": "アシマリ",
	"Brionne": "オシャマリ",
	"Primarina": "アシレーヌ",
	"Pikipek": "ツツケラ",
	"Trumbeak": "ケララッパ",
	"Toucannon": "ドデカバシ",
	"Yungoos": "ヤングース",
	"Gumshoos": "デカグース",
	"Grubbin": "アゴジムシ",
	"Charjabug": "デンヂムシ",
	"Vikavolt": "クワガノン",
	"Crabrawler": "マケンカニ",
	"Crabominable": "ケケンカニ",
	"Oricorio": "オドリドリ-めらめら",
	"Oricorio-Pa'u": "オドリドリ-ふらふら",
	"Oricorio-Pom-Pom": "オドリドリ-ぱちぱち",
	"Oricorio-Sensu": "オドリドリ-まいまい",
	"Cutiefly": "アブリー",
	"Ribombee": "アブリボン",
	"Rockruff": "イワンコ",
	"Lycanroc": "ルガルガン-昼",
	"Lycanroc-Midnight": "ルガルガン-夜",
	"Wishiwashi": "ヨワシ",
	"Wishiwashi-School": "ヨワシ-群",
	"Mareanie": "ヒドイデ",
	"Toxapex": "ドヒドイデ",
	"Mudbray": "ドロバンコ",
	"Mudsdale": "バンバドロ",
	"Dewpider": "シズクモ",
	"Araquanid": "オニシズクモ",
	"Fomantis": "カリキリ",
	"Lurantis": "ラランテス",
	"Morelull": "ネマシュ",
	"Shiinotic": "マシェード",
	"Salandit": "ヤトウモリ",
	"Salazzle": "エンニュート",
	"Stufful": "ヌイコグマ",
	"Bewear": "キテルグマ",
	"Bounsweet": "アマカジ",
	"Steenee": "アママイコ",
	"Tsareena": "アマージョ",
	"Comfey": "キュワワー",
	"Oranguru": "ヤレユータン",
	"Passimian": "ナゲツケサル",
	"Wimpod": "コソクムシ",
	"Golisopod": "グソクムシャ",
	"Sandygast": "スナバァ",
	"Palossand": "シロデスナ",
	"Pyukumuku": "ナマコブシ",
	"Type:Null": "タイプ:ヌル",
	"Silvally": "シルヴァディ",
	"Silvally-Bug": "シルヴァディ-Bug",
	"Silvally-Dark": "シルヴァディ-Dark",
	"Silvally-Dragon": "シルヴァディ-Dragon",
	"Silvally-Electric": "シルヴァディ-Electric",
	"Silvally-Fairy": "シルヴァディ-Fairy",
	"Silvally-Fighting": "シルヴァディ-Fighting",
	"Silvally-Fire": "シルヴァディ-Fire",
	"Silvally-Flying": "シルヴァディ-Flying",
	"Silvally-Ghost": "シルヴァディ-Ghost",
	"Silvally-Grass": "シルヴァディ-Grass",
	"Silvally-Ground": "シルヴァディ-Ground",
	"Silvally-Ice": "シルヴァディ-Ice",
	"Silvally-Poison": "シルヴァディ-Poison",
	"Silvally-Psychic": "シルヴァディ-Psychic",
	"Silvally-Rock": "シルヴァディ-Rock",
	"Silvally-Steel": "シルヴァディ-Steel",
	"Silvally-Water": "シルヴァディ-Water",
	"Minior": "メテノ",
	"Minior-Meteor": "メテノ-核",
	"Komala": "ネッコアラ",
	"Turtonator": "バクガメス",
	"Togedemaru": "トゲデマル",
	"Mimikyu": "ミミッキュ",
	"Mimikyu-Busted": "ミミッキュ-Busted",
	"Bruxish": "ハギギシリ",
	"Drampa": "ジジーロン",
	"Dhelmise": "ダダリン",
	"Jangmo-o": "ジャラコ",
	"Hakamo-o": "ジャランゴ",
	"Kommo-o": "ジャラランガ",
	"Tapu Koko": "カプ・コケコ",
	"Tapu Lele": "カプ・テテフ",
	"Tapu Bulu": "カプ・ブルル",
	"Tapu Fini": "カプ・レヒレ",
	"Cosmog": "コスモッグ",
	"Cosmoem": "コスモウム",
	"Solgaleo": "ソルガレオ",
	"Lunala": "ルナアーラ",
	"Nihilego": "ウツロイド",
	"Buzzwole": "マッシブーン",
	"Pheromosa": "フェローチェ",
	"Xurkitree": "デンジュモク",
	"Celesteela": "テッカグヤ",
	"Kartana": "カミツルギ",
	"Guzzlord": "アクジキング",
	"Necrozma": "ネクロズマ",
	"Magearna": "マギアナ",
	"Magearna-Original": "マギアナ-Original",
	"Marshadow": "マーシャドー",
	"Stakataka": "ツンデツンデ",
	"Blacephalon": "ズガドーン",
	"Poipole": "ベベノム",
	"Naganadel": "アーゴヨン",
	"Zeraora": "ゼラオラ",

	//Extra PM Names
	"-Rainy": "-雨",
	"-Snowy": "-霰",
	"-Sunny": "-晴",
	"-Attack": "-アタック",
	"-Defense": "-ディフェンス",
	"-Speed": "-スピード",
	"-Fan": "-スピン",
	"-Wash": "-ウォッシュ",
	"-Mow": "-カット",
	"-Heat": "-ヒート",
	"-Frost": "-フロスト",
	"-Origin": "-オリジン",
	"-Sky": "-スカイ",
	"-Bug": "-虫",
	"-Dark": "-悪",
	"-Dragon": "-竜",
	"-Electric": "-電気",
	"-Fairy": "-フェアリー",
	"-Fighting": "-格闘",
	"-Fire": "-炎",
	"-Flying": "-飛行",
	"-Ghost": "-ゴースト",
	"-Grass": "-草",
	"-Ground": "-地面",
	"-Ice": "-氷",
	"-Poison": "-毒",
	"-Psychic": "-エスパー",
	"-Rock": "-岩",
	"-Steel": "-鋼",
	"-Water": "-水",
	"-Zen": "-ダルマモード",
	"-Resolute": "-覚悟",
	"-Pirouette": "-ステップ",
	"-Burn": "-ブレイズ",
	"-Chill": "-フリーズ",
	"-Douse": "-アクア",
	"-Shock": "-イナズマ", //ゲノセクト
	"-Ash": "-サトシ", //ゲッコウガ
	"-Eternal": "-永遠の花",
	"-Large": "-大きい",
	"-Small": "-小さい",
	"-Super": "-特大",
	"-Unbound": "-解放", //フーパ
	"-Busted": "-ばれた姿", //ミミッキュ
	"-Primal": "-ゲンシカイキ",
	"-Sandy": "-砂地のミノ",
	"-Trash": "-ゴミのミノ",
	"-Sunshine": "-晴れ", //チェリム
	"-Blue-Striped": "-青すじ",
	"-Therian": "-霊獣",
	"-Black": "-ブラック",
	"-White": "-ホワイト",
	"-Pa'u": "-ふらふら",
	"-Pom-Pom": "-ぱちぱち",
	"-Sensu": "-まいまい",
	"-Midnight": "-真夜中",
	"-School": "-群",
	"-Alola": "-アローラ",
	"-Hoenn": "-ホウエン",
	"-Kalos": "-カロス",
	"-Original": "-オリジナル",
	"-Sinnoh": "-シンオウ",
	"-Unova": "-イッシュ", //ピカチュウのやつ

	//battle.js

	"used": "の ", //"ポケモン名 used 技名"

	"The opposing": "相手の",
	"restored a little HP using its Leftovers!": "はたべのこしで少し回復した！",

	"It's super effective!": "効果は抜群だ！",
	"It's not very effective...": "効果はいまひとつのようだ... ",
	"lost": "に ",
	"of its health!": " のダメージ！", //上とセット "ポケモン名 lost ??% of its health!""
	", come back!": " 戻れ！",
	"(exists)": "(exsits)", //道具かな
	"Go!": "ゆけっ！",

	"fainted!": "は倒れた！",

	"withdrew": "withdrew", // "プレイヤー名 withdrew ポケモン名" 無理
	"sent out": "sent out", // "プレイヤー名 sent out ポケモン名" 無理

	"The sunlight turned harsh!": "日差しが強くなった！",
	"s Drought intensified the sun's rays!": "の ひでり で日差しが強くなった！",
	"The sunlight faded.": "日差しが元に戻った。",
	"The sunlight turned extremely harsh!": "日差しがとても強くなった！",
	"The harsh sunlight faded.": "日差しが元に戻った。",
	"It started to rain!": "雨が降り始めた！",
	"s Drizzle made it rain!": "の あめふらし で雨が降り始めた！",
	"The rain stopped.": "雨が止んだ。",
	"A heavy rain began to fall!": "強い雨が降り始めた！",
	"The heavy rain has lifted!": "強い雨が止まった！",
	"A sandstorm kicked up!": "砂あらしがふき始めた！",
	"s Sand Stream whipped up a sandstorm!": "の すなおこし で砂あらしがふき始めた！",
	"The sandstorm is raging.": "砂あらしが吹いている。",
	"The sandstorm subsided.": "砂あらしがおさまった。",
	"It started to hail!": "あられが降り始めた！",
	"s Snow Warning whipped up a hailstorm!": "の ゆきふらし であられが降り始めた！",
	"The hail is crashing down.": "あられが降っている。",
	"The hail stopped.": "あられが止んだ。",
	"Mysterious strong winds are protecting Flying-type Pok&eacute;mon!": "謎の乱気流が飛行ポケモンを守る！",
	"The mysterious strong winds have dissipated!": "謎の乱気流がおさまった！",
	"unleashes its full-force Z-Move!": "が解き放つ全力のZわざ！",
	"bounced the": "bounced the", //わからん
	"back!": "！",
	"Waggling a finger let it use": "Waggling a finger let it use", //ゆびをふる
	"Nature Power turned into": "しぜんのちからは変化した。", //自然の力
	"Breakneck Blitz turned into": "ウルトラダッシュアタックは変化した。",
	"s attack continues!": "の攻撃はまだ続いている！",
	"used Fissure!": "のじわれ！",
	// "Just kidding! It was Earthquake!":"Just kidding! It was Earthquake!",
	// "Sneaky Pebbles":"Sneaky Pebbles", //わからん
	// "Sly Rubble":"Sly Rubble",
	// "Subtle Sediment":"Subtle Sediment",
	// "Buried Bedrock":"Buried Bedrock",
	// "Camouflaged Cinnabar":"Camouflaged Cinnabar",
	// "Clandestine Cobblestones":"隐秘的鹅卵石",
	// "Cloaked Clay":"隐形黏土",
	// "Concealed Ore":"隐藏的矿石",
	// "Covert Crags":"隐蔽的峭壁",
	// "Crafty Coal":"狡诈的煤炭",
	// "Discreet Bricks":"小心的砖块",
	// "Disguised Debris":"伪装的瓦砾",
	// "Espionage Pebbles":"间谍卵石",
	// "Furtive Fortress":"鬼头鬼脑的堡垒",
	// "Hush-Hush Hardware":"秘密的硬件",
	// "Incognito Boulders":"匿名的巨石",
	// "Invisible Quartz":"无形的石英",
	// "Masked Minerals":"蒙面的矿物",
	// "Mischievous Masonry":"恶作剧石工",
	// "Obscure Ornaments":"隐晦的装饰品",
	// "Private Paragon":"私人的模范",
	// "Secret Solitaire":"秘密的接龙",
	// "Sheltered Sand":"被庇护的沙子",
	// "Surreptitious Sapphire":"诡秘的蓝宝石",
	// "Undercover Ultramarine":"隐秘的群青色",
	// "Yo mama so fat, she 4x resists Ice- and Fire-type attacks!":"你麻麻太胖了，她能四倍抵抗冰系和火系的攻击！",
	// "Yo mama so ugly, Captivate raises her opponent's Special Attack!":"你麻麻太丑了，她的诱惑提升了她对手的特攻！",
	// "Yo mama so dumb, she lowers her Special Attack when she uses Nasty Plot!":"你麻麻太蠢了，当她使用诡计的时候她降低了她的特攻！",
	// "Yo mama so dumb, she thought Sylveon would be Light Type!":"你麻麻太蠢了，她认为仙子伊布应该是光属性的！",

	"can't use": "can't use", // AはBを使えない 以下と合わせて うまく訳せない
	"after the taunt!": "after the taunt!",
	"because of gravity!": "because of gravity!",
	"because of Heal Block!": "because of Heal Block!",
	"can't use its sealed": "can't use its sealed",
	"The effects of Throat Chop prevent": "じごくづき の効果で", //次とセット
	"from using certain moves!": "は技を出せない！",
	"is paralyzed! It can't move!": "は痺れて動けない！",
	"is frozen solid!": "は凍ってしまって動かない！",
	"is fast asleep.": "ぐうぐう眠っている。",
	"Sky Drop won't let": "Sky Drop won't let",
	"go!": "go!",
	"cannot use": "cannot use",
	"is loafing around!": "is loafing around!",
	"must recharge!": "は反動で動けない！",
	"lost its focus and couldn't move!": "は集中が途切れて技が出せなかった！",
	"s shell trap didn't work!": "のトラップシェルは不発に終わった！",
	"flinched and couldn\'t move!": "はひるんで技が出せない！",
	"is immobilized by love!": "はメロメロで技が出せない！",
	"But there was no PP left for the move!": "しかしわざのPPが足りなかった！", //オリジナルメッセージ知らず
	"can't move": "can't move",
	"Automatic center!": "Automatic center!",
	// "Pointed stones dug into":"尖锐的岩石扎进了", //ステロ 「〜に尖った岩が食い込んだ」
	"is hurt by the spikes!": "はまきびしのダメージを受けた！",
	"was hurt by its burn!": "は火傷のダメージを受けている！",
	"was hurt by poison!": "は毒のダメージを受けている！",
	"lost some of its HP!": "は命が少し削られた！", //いのちのたま　タブンネ
	"is damaged by the recoil!": "は反動によるダメージを受けた！",
	"is buffeted by the sandstorm!": "は砂嵐によるダメージを受けた！",
	"is buffeted by the hail!": "はあられによるダメージを受けた！", // オリジナルは「あられが〜を襲う」（多分上も）妥協
	"is tormented!": "is tormented!",
	"is afflicted by the curse!": "は呪われている！",
	"is locked in a nightmare!": "悪夢にうなされている！", //オリジナル知らず
	"was hurt!": "はダメージを受けている！", //どこ
	"is hurt!": "はダメージを受けた！", //どこ
	"sucked up the liquid ooze!": "はヘドロえきを吸い取った！",
	"It hurt itself in its confusion!": "わけも分からず自分を攻撃した！",
	"'s health is sapped by Leech Seed!": "の体力がやどりぎに奪われる！", //オリジナル「やどりぎが〜の体力を奪う」
	"The bursting flame hit": "The bursting flame hit", //弾ける炎
	"is hurt by the sea of fire!": "火の海のダメージを受けた！", //誓い
	"kept going and crashed!": "は勢い余って地面にぶつかった！",
	"is hurt by": "is hurt by", //どこ
	"is hurt by its": "is hurt by its", //どこ
	"lost some HP because of": "lost some HP because of", //語順
	"'s HP was restored by the Z-Power!": "はZパワーで体力を回復した！",
	"absorbed nutrients with its roots!": "は根から養分を吸い取った！",
	"A veil of water restored": "A veil of water restored", //アクアリング「〜は水のリングで体力を回復！」
	"'s HP!": "'s HP!",
	"The healing wish came true for": "The healing wish came true for", //「いやしのねがいが〜に届いた」
	"became cloaked in mystical moonlight!": "became cloaked in mystical moonlight!", //どこ
	"s wish came true!": "のねがいごとがかなった！", //ここまで　飽きた
	"had its energy drained!": "は体力を吸い取られた！",
	"restored a little HP using its": "restored a little HP using its", //どこ
	"absorbs the attack!": "absorbs the attack!", //どこ
	"restored HP using its": "restored HP using its",
	"restored its HP.": "は体力を回復した。",
	"restored its HP using its Z-Power!": "はZパワーで体力を回復した！", //上のと違うのか？
	"The battlers shared their pain!": "おたがいの体力を分かちあった！", //痛み分け（未確認）
	"won't go any higher!": "はもう上がらない！", //ランク変化のか（未確認）
	// "raised":"提升了", //Z技のランク変化か 語順は？
	// "boosted its stats":"提升了它的能力",
	// "using its Z-Power!":"通过Z技能！",
	// "boosted its":"提升了它的",
	"won't go any lower!": "はもう下がらない！",
	// "lowered":"下降了",
	"cut its own HP and maximized its Attack!": "は体力を削ってパワー全開！",
	"'s Anger Point!": "のいかりのつぼ！",
	"maxed its Attack!": "は攻撃が最大まで上がった！",
	"switched all changes to its Defense and Sp. Def with its target!": "は相手と自分の防御と特防の能力変化を入れ替えた！", //ガードスワップ
	"switched stat changes with its target!": "は相手と自分の能力変化を入れ替えた！", //ハートスワップ
	"switched all changes to its Attack and Sp. Atk with its target!": "は相手と自分の攻撃と特攻の能力変化を入れ替えた！",
	"stole the target's boosted stats!": "は上がった能力を奪い取った！", //シャドースチールか
	"returned its decreased stats to normal using its Z-Power!": "はZパワーで下がった能力を元に戻した！", //Z守るなど

	"'s stat changes!": "'s stat changes!", //自己暗示
	"'s stat changes were removed!": "'s stat changes were removed!", //どこ
	"'s stat changes were inverted!": "は能力変化がひっくりかえった！", //ひっくりかえす（多分）
	"All stat changes were eliminated!": "全てのステータスが元に戻った！", //黒い霧
	"A critical hit!": "急所に当たった！",
	"doesn't become confused!": "は混乱しなかった！", //どこ
	// "It doesn't affect":"It doesn't affect",
	"It had no effect!": "It had no effect!",
	"avoided the attack!": "は攻撃をかわした！",
	"'s attack missed!": "の攻撃は外れた！",
	"already has a burn.": "はすでに火傷を負っている.",
	"is already poisoned.": "はすでに毒をあびている",
	"can't sleep in an uproar!": "can't sleep in an uproar!", //騒ぐ
	"But the uproar kept": "But the uproar kept",
	"is already asleep!": "はすでに眠っている",
	"is already paralyzed.": "はすでに麻痺している",
	"is already frozen solid!": "はすでに氷漬けになっている",
	"can\'t use it the way it is now!": "can\'t use it the way it is now!",
	"can\'t use the move!": "can\'t use the move!",
	"But it does not have enough HP left to make a substitute!": "しかし身代わりを出すには体力が足りなかった",
	"already has a substitute!": "の身代わりはすでに出ていた！",
	"is too heavy to be lifted!": "は重すぎて持ち上げられない！", //フリーフォール
	"But it failed!": "しかしうまく決まらなかった！", //技の対象がいない場合とか
	"The extremely harsh sunlight was not lessened at all!": "強い日差しの勢いは止まらない！",
	"There is no relief from this heavy rain!": "強い雨の勢いは止まらない！",
	"The mysterious strong winds blow on regardless!": "謎の乱気流の勢いは止まらない！",
	"surrounded itself with a veil of petals!": "surrounded itself with a veil of petals!",
	"'s": "の",
	"stats were": "stats were",
	"not lowered!": "not lowered!",
	"The Water-type attack evaporated in the harsh sunlight!": "強い日差しの影響で水タイプの攻撃が蒸発した！",
	"The Fire-type attack fizzled out in the heavy rain!": "強い雨の影響で炎タイプの攻撃がかき消された！",
	"But there was no target……": "But there was no target……",
	"It's a one-hit KO!": "一撃必殺！",
	"But nothing happened!": "しかし何も起こらなかった！", //はねる?
	"is waiting for": "は", //誓い　下とセット？「〜は〜を待っている...」
	"'s move...": "を待っている...",
	"The two moves have become one! It's a combined move!": "２つの技が１つになった！ コンビネーションわざだ！",
	"surrounded itself with its Z-Power!": "はZパワーを身体にまとった！",
	"by the": "by the",
	"was burned!": "は火傷を負った！",
	"was badly poisoned!": "は猛毒をあびた！",
	"was poisoned!": "は毒をあびた!",
	"slept and became healthy!": "は眠って元気になった！",
	"fell asleep!": "は眠ってしまった！",
	"is paralyzed! It may be unable to move!": "はまひして技が出にくくなった！",
	"was frozen solid!": "はこおりついた！",
	"moved its status onto": "moved its status onto",
	"'s Natural Cure activated!": "'s Natural Cure activated!", //自然回復
	"heals its status!": "heals its status!",
	"healed its burn!": "healed its burn!",
	"'s burn was healed.": "'s burn was healed.",
	"cured its poison!": "cured its poison!",
	"was cured of its poisoning.": "の毒が治った",
	"was cured of paralysis.": "の麻痺が治った", //自信ない
	"woke it up!": "は目を覚ました！", //下と違うのか
	"woke up!": "は目を覚ました！",
	"cured its paralysis!": "cured its paralysis!",
	"defrosted it!": "の氷がとけた！", //下と違うのか
	"thawed out!": "の氷がとけた！",
	"'s status cleared!": "'s status cleared!",
	"A soothing aroma wafted through the area!": "A soothing aroma wafted through the area!",
	"A bell chimed!": "鈴の音が響きわたった！", //いやしのすず
	"'s team was cured!": "'s team was cured!",
	"found one": "found one",
	"frisked": "frisked",
	"and found its": "and found its",
	"frisked its target and found one": "frisked its target and found one", //お見通し「〜は〜の〜をお見通しだ」
	"stole": "stole",
	"harvested one": "harvested one",

	"obtained one": "obtained one",
	"floats in the air with its Air Balloon!": "は風船で宙に浮いている！",
	"ate its": "ate its",

	"flung its": "flung its", //なげつける
	"knocked off": "knocked off", //はたき落とす
	"stole and ate its target\'s": "stole and ate its target\'s", //虫食い
	"strengthened": "strengthened", //貰い火?
	"\'s power!": "\'s power!",
	"was burned up!": "was burned up!", //焼き尽くす?
	"lost its": "lost its",
	"'s Air Balloon popped!": "の風船は割れてしまった！",
	"hung on using its Focus Sash!": "はきあいのタスキでもちこたえた！",
	"hung on using its Focus Band!": "はきあいのハチマキでもちこたえた！",
	"became fully charged due to its Power Herb!": "はパワフルハーブで力がみなぎった！",
	"returned its status to normal using its White Herb!": "はしろいハーブでステータスを元に戻した！",
	"is switched out with the Eject Button!": "はだっしゅつボタンで戻っていく！",
	"activated": "activated",
	"traced": "traced",
	"was taken over!": "was taken over!",
	"copied": "copied", // ~ copied ~'s stats changes!
	"Ability!": "Ability!",
	"acquired": "acquired",
	"The effects of the weather disappeared.": "天気の影響がなくなった！",
	"shuddered!": "shuddered!",
	"reversed all other Pokémon's auras!": "は全てのオーラを制圧する！", //オーラブレイク
	"is drowsing!": "is drowsing!", //あくび?
	"is radiating a dark aura!": "はダークオーラを放っている！",
	"is radiating a fairy aura!": "はフェアリーオーラを放っている！",
	"breaks the mold!": "はかたやぶりだ！",
	"is exerting its pressure!": "はプレッシャーを放っている！",
	"endured the hit!": "は攻撃をこらえた！",
	"is radiating a bursting aura!": "は弾けるオーラを放っている！",
	"is radiating a blazing aura!": "は燃え盛るオーラを放っている！",
	"is too nervous to eat Berries!": "は緊張してきのみが食べられなくなった！",
	"was removed.)": "was removed.)",
	"\'s Ability was suppressed!": "の特性が効かなくなった！", //胃液
	"transformed into": "transformed into", //変幻自在で確認
	"transformed!": "transformed!",
	"Zen Mode triggered!": "ダルマモード 発動！",
	"Zen Mode ended!": "ダルマモード 解除！",
	"Changed to Blade Forme!": "ブレードフォルム チェンジ！",
	"Changed to Shield Forme!": "シールドフォルム チェンジ！",
	"formed a school!": "の群れが集まった！", //ヨワシ
	"stopped schooling!": "の群れはちりぢりになった！",
	"Shields Down deactivated!": "リミットシールド 解除！",
	"Shields Down activated!": "リミットシールド 発動！",
	"'s fervent wish has reached": "'s fervent wish has reached",

	"has Mega Evolved into Mega": "has Mega Evolved into Mega",
	"'s Primal Reversion! It reverted to its primal state!": "のゲンシカイキ！原子の姿を取り戻した！",
	"transformed into the": "transformed into the",
	"type!": "type!",
	"'s type became the same as": "'s type became the same as",
	"'s type!": "'s type!",
	"burned itself out!": "の炎は燃え尽きた！",
	"made it the": "made it the",
	"type was added to": "type was added to",
	"switched its Attack and Defense!": "は攻撃と防御を入れ替えた！",
	"was identified!": "の正体を見破った！",
	"was hurled into the air!": "を宙に浮かせた！",
	"is already confused!": "はすでに混乱している！",
	"became confused due to fatigue!": "は疲れ果てて混乱した！",
	"became confused!": "は混乱した！",
	"was seeded!": "に種を植え付けた",
	"was prevented from healing!": "was prevented from healing!", //かいふくふうじ
	"Electricity's power was weakened!": "電気の威力が弱まった！",
	"Fire's power was weakened!": "炎の威力が弱まった！",
	"grew drowsy!": "の眠気を誘った！", //ここまで

	"fell for the taunt!": "は挑発に乗ってしまった！",
	"sealed any moves its target shares with it!": "は相手の技を封印した！",
	"was disabled!": "を封じ込めた！",
	"can't use items anymore!": "は道具が使えなくなった！",
	"was subjected to torment!": "はいちゃもんをつけられた！",
	"planted its roots!": "は根をはった！",
	"surrounded itself with a veil of water!": "は水のリングをまとった！",
	"stockpiled 1!": "１つたくわえた！",
	"stockpiled 2!": "２つたくわえた！",
	"stockpiled 3!": "３つたくわえた！",
	"'s perish count fell to 0.": "の滅びのカウントが０になった！",
	"'s perish count fell to 1.": "の滅びのカウントが１になった！",
	"'s perish count fell to 2.": "の滅びのカウントが２になった！",
	"'s perish count fell to 3.": "の滅びのカウントが３になった！",
	"received an encore!": "はアンコールをうけた！",
	"is storing energy!": "はがまんしている", //違うかも
	"can't get it going!": "は調子が上がらない！", //スロースタート
	"fell in love from the": "fell in love from the",
	"became nimble!": "became nimble!",
	"used the": "used the",
	"to get pumped!": "to get pumped!", //気合いだめではない?
	"boosted its critical-hit ratio using its Z-Power!": "はZパワーで急所に当たりやすくなった！",
	"is getting pumped!": "は張り切っている！", //気合いだめ
	"cut its own HP and put a curse on": "cut its own HP and put a curse on", //呪い「〜は自分の体力を削って〜にのろいをかけた」
	"levitated with electromagnetism!": "は電磁力で浮かびあがった！", //電磁浮遊
	"fell straight down!": "fell straight down!", //うちおとす
	"The substitute took damage for": "The substitute took damage for", //みがわり「〜に代わって身代わりが攻撃を受けた」
	"put in a substitute!": "の身代わりが現れた！",
	"is making an uproar!": "is making an uproar!", //騒ぐ
	"caused an uproar!": "caused an uproar!", //ここまで

	"Aurora Veil made your team stronger against physical and special moves!": "味方はオーロラベールで物理と特殊に強くなった！!",
	"Aurora Veil made the opposing team stronger against physical and special moves!": "相手はオーロラベールで物理と特殊に強くなった！",
	"Reflect made your team stronger against physical moves!": "味方はリフレクターで物理に強くなった！",
	"Reflect made the opposing team stronger against physical moves!": "相手はリフレクターで物理に強くなった！",
	"Light Screen made your team stronger against special moves!": "味方はひかりのかべで特殊に強くなった！",
	"Light Screen made the opposing team stronger against special moves!": "相手はひかりのかべで特殊に強くなった！",

	"Your team's Aurora Veil wore off!": "味方ののオーロラーベールの効果が切れた！",
	"Your team's Reflect wore off!": "味方ののリフレクターの効果が切れた！",
	"Your team's Light Screen wore off!": "味方ののひかりのかべの効果が切れた！",

	"The opposing team's Aurora Veil wore off!": "相手のオーロラーベールの効果が切れた！",
	"The opposing team's Reflect wore off!": "相手のリフレクターの効果が切れた！",
	"The opposing team's Light Screen wore off!": "相手のひかりのかべの効果が切れた！",

	"Poison spikes were scattered on the ground all around your team!": "味方の足元にどくびしが散らばった！",
	"Poison spikes were scattered on the ground all around the opposing team!": "相手の足元にどくびしが散らばった！",
	"The poison spikes disappeared from the ground around your team!": "味方の周りのどくびしが消え去った！",
	"The poison spikes disappeared from the ground around the opposing team!": "相手の周りのどくびしが消え去った！",

	"It's super effective! A critical hit!": "効果は抜群だ！急所に当たった！",
	"It's not very effective... A critical hit!": "効果はいまひとつのようだ... 急所に当たった！",
	"was burned by the Flame Orb!": "はかえんだまでやけどを負った！",

	"[Opposing": "[相手の",

	"Pointed stones float in the air around your team!": "味方の周りにとがった岩がただよい始めた！",
	"Pointed stones float in the air around the opposing team!": "相手の周りにとがった岩がただよい始めた！",
	"The pointed stones disappeared from around your team!": "味方の周りのステルスロックが消え去った！",
	"The pointed stones disappeared from around the opposing team!": "相手の周りのステルスロックが消え去った！",

	"the opposing ": "相手の",
	"the opposing": "相手の",

	"Attack": "攻撃",
	"Special Attack": "特攻",
	"Defense": "防御",
	"Special Defense": "特防",
	"Speed": "素早さ",
	"accuracy": "命中",
	"evasiveness": "回避率",
	"fell": "下がった",
	"rose": "上がった",

	"The grass disappeared from the battlefield.": "足下の草が消え去った！",
	"The mist disappeared from the battlefield.": "足下の霧が消え去った！",
	"The electricity disappeared from the battlefield.": "足下の電気が消え去った！",
	"The weirdness disappeared from the battlefield!": "足下の不思議感が消え去った！",

	"Grass grew to cover the battlefield!": "足下に草がおいしげった！",
	"Mist swirls around the battlefield!": "足下に霧が立ち込めた！",
	"An electric current runs across the battlefield!": "足下に電気がかけめぐる！",
	"The battlefield got weird!": "足下が不思議な感じになった！",

	"The Tailwind blew from behind your team!": "味方に追い風が吹き始めた！",
	"The Tailwind blew from behind the opposing team!": "相手に追い風が吹き始めた！",
	"Your team's Tailwind petered out!": "味方の追い風が止んだ！",
	"The opposing team's Tailwind petered out!": "相手の追い風が止んだ！",

	"protected itself!": "は攻撃から身を守った！", //「守りの体勢に入った」と同テキスト

	"swapped Abilities with its target!": "はお互いの特性を入れ替えた！",

	"the Normal type": "ノーマルタイプ",
	"the Fire type": "ほのおタイプ",
	"the Water type": "みずタイプ",
	"the Grass type": "くさタイプ",
	"the Electric type": "でんきタイプ",
	"the Ice type": "こおりタイプ",
	"the Fighting type": "かくとうタイプ",
	"the Poison type": "どくタイプ",
	"the Ground type": "じめんタイプ",
	"the Flying type": "ひこうタイプ",
	"the Psychic type": "エスパータイプ",
	"the Bug type": "むしタイプ",
	"the Rock type": "いわタイプ",
	"the Ghost type": "ゴーストタイプ",
	"the Dragon type": "ドラゴンタイプ",
	"the Dark type": "あくタイプ",
	"the Steel type": "はがねタイプ",
	"the Fairy type": "フェアリータイプ",

	"Hit 1 time!": "1回当たった！",
	"Hit 2 times!": "2回当たった！",
	"Hit 3 times!": "3回当たった！",
	"Hit 4 times!": "4回当たった！",
	"Hit 5 times!": "5回当たった！",

	"sharply": "ぐーんと",
	"harshly": "がくっと",

	"Its disguise served it as a decoy!": "化けの皮が身代わりになった！",
	"'s disguise was busted!": "の化けの皮が剥がれた！",

	"'s Weakness Policy activated!": "の弱点保険が発動した！", //実機にはない
	"vanished instantly!": "の姿が一瞬にして消えた！", //ゴーストダイブ

	// "couldn't fully protect itself and got hurt! (placeholder)":"は攻撃を守りきれずにダメージを受けた！" //placeholderとは

	// "It's super effective on":"に効果は抜群だ！",
	// "It's not very effective on":"には効果はいまひとつのようだ...",
	"It's super effective on": "効果は抜群だ！ ",
	"It's not very effective on": "効果はいまひとつのようだ... ",

	"It's super effective! The opposing": "効果は抜群だ！ 相手の",

	"twisted the dimensions!": "は時空をゆがめた！",
	"The twisted dimensions returned to normal!": "ゆがんだ時空が元に戻った！",

	"Wide Guard protected the opposing team!": "相手の周りをワイドガードが守っている！",
	"Wide Guard protected your team!": "味方の周りをワイドガードが守っている！",

	"A sea of fire enveloped your team!": "味方の周りが火の海に包まれた！",
	"A sea of fire enveloped the opposing team!": "相手の周りが火の海に包まれた！",
	"The sea of fire around your team disappeared!": "味方の周りの火の海が消えた！",
	"The sea of fire around the opposing team disappeared!": "相手の周りの火の海が消えた！",

	"is confused!": "は混乱している！",
	"'s substitute faded!": "の身代わりは消えてしまった！",

	"'s Misty Seed activated!": "のミストシードが発動した！",
	"'s Electric Seed activated!": "のエレキシードが発動した！",
	"'s Grassy Seed activated!": "のグラスシードが発動した！",
	"'s Psychic Seed activated!": "のサイコシードが発動した！",

	"surrounds itself with psychic terrain!": "はサイコフィールドに守られている！",
	"surrounds itself with electrified terrain!": "はエレキフィールドに守られている！",
	"surrounds itself with a protective mist!": "はミストフィールドに守られている！",

	"became the center of attention!": "は注目の的になった！",
	"couldn't fully protect itself and got hurt!": "は攻撃を守りきれずにダメージを受けた！",

	"absorbed light!": "は光を吸収した！",
	"avoids attacks by its ally Pokémon!": "は味方からの攻撃を受けない！",

	"and": "と",
	"and the opposing": "と", //サイドチェンジの時 他の場面での暴発があるかも
	"switched places.": "は場所を入れ替えた！",
};

var QQ = $.noConflict();
var regex_ability = new RegExp(/Ability: ([A-Za-z- ]+)$/);
var regex_abi_and_item = new RegExp(/Ability: ([A-Za-z- ]+) \/ Item: ([(A-Za-z- ]+[A-za-z)])$/);
var regex_possible_ability = new RegExp(/Possible abilities: ([A-za-z- ]+[A-za-z])$/);
var regex_possible_ability2 = new RegExp(/Possible abilities: ([A-za-z- ]+[A-za-z]), ([A-za-z- ]+[A-za-z])$/);
var regex_possible_ability3 = new RegExp(/Possible abilities: ([A-za-z- ]+[A-za-z]), ([A-za-z- ]+[A-za-z]), ([A-za-z- ]+[A-za-z])$/);
var regex_Item = new RegExp(/Item: ([(A-Za-z- ]+[A-za-z)])$/);
var regex_stat_change = new RegExp(/^'s ([A-za-z ]+) (fell|rose) ?(sharply|harshly)?! ?(The opposing)?/);
var regex_magic_bounce = new RegExp(/bounced the ([A-za-z -]+) back!/);
var regex_preview = new RegExp(/^([A-za-z* -]+ \/ )+([A-za-z* -]+)$/);
var regex_start_battle = new RegExp(/Battle between (.+) and (.+) started!/);
var regex_uturn = new RegExp(/went back to (.*)!/);
var regex_hurtby = new RegExp(/is hurt by ([A-Za-z- ]+)!/);
var regex_gems = new RegExp(/The ([A-za-z ]+) strengthened ([A-za-z- ]+)'s power!/);
var regex_eat = new RegExp(/ate its ([A-Za-z ]+)!/);
var regex_restorehp = new RegExp(/restored HP using its ([A-Za-z ]+)!/);

// var regex_pointed_stones=new RegExp(/Pointed stones dug into (the opposing )?([A-za-z -]+)!/);
var regex_pointed_stones = new RegExp(/Pointed stones dug into/);
var regex_doesnt_affect = new RegExp(/It doesn't affect (the opposing )?([A-za-z -]+)/);
var regex_forme = new RegExp(/(sent out $)|(withdrew $)|(Go! $)/);
var regex_z_prtct = new RegExp(/([A-za-z -]+) couldn't fully protect itself and got hurt!/);
var regex_megastone = new RegExp(/'s ([A-Za-z ]+) is reacting to the Key Stone!/);
var regex_effective_on = new RegExp(/(It's super effective on|It's not very effective on) (the opposing )?([A-Za-z -]+) [\.!] ?(A critical hit on)?.*/);
var regex_crit_on = new RegExp(/A critical hit on (the opposing )?([A-Za-z -]+) !/);
var regex_weakened = new RegExp(/The ([A-Za-z ]+) weakened the damage to (the opposing )?([A-Za-z -]+) !/);
var regex_Z_hojo = new RegExp(/^Z-([A-Za-z ]+)/);
var regex_Z_boost = new RegExp(/boosted its ([A-Za-z ]+) using its Z-Power!/);
var regex_copied = new RegExp(/copied (the opposing )?([A-Za-z ]+) 's (stat changes)?([A-Za-z -]+ Ability)?!/);
var regex_instruct = new RegExp(/used the move instructed by (the opposing )?([A-Za-z ]+) !/);

var regex_search = new RegExp(/It's not very effective on|It's super effective on|\.? ?A critical hit on| weakened the damage to /);
// var regex_search = new RegExp(/It's not very effective on|It's super effective on|\.? ?A critical hit on/);

// var regex_first = new RegExp(/([A-Za-z ]+)(?:, )?([A-Za-z ]+)?(?:, )?([A-Za-z ]+)?(?:, )?([A-Za-z ]+)?(?:, )?([A-Za-z ]+)?(?:, )?([A-Za-z ]+)? will be sent out first/);
var regex_first = new RegExp(/will be sent out first/);

var t_ = function (a) {
	return a;
};
var t = function (originalStr, n) {
	var tmp = originalStr.trim();

	// console.log(tmp);

	if (translations[tmp])
		return translateText(tmp);
	
	if (tmp.indexOf("'s ") != -1 && tmp.indexOf("!]") != -1) {
		tmp = tmp.replace("'s ", "").replace("!]", "");
		return "の" + translateText(tmp) + "！]";
	}

	var splitted, poke_name, text, opp;

	if (tmp.indexOf("will be sent out first") != -1) {
		var poke_names = tmp.replace(" will be sent out first.","").split(", ");
		for (var i = 0; i < poke_names.length; i++) {
			poke_names[i] = translateText(poke_names[i]);
		}
		text = poke_names.join(",");
		return text + "の順にくりだします";
	}

	if (tmp.indexOf(" will use ") != -1) {
		splitted = tmp.replace(" will use ",",").replace(".","").replace(" against ",",").split(",");
		opp = "";
		if (splitted[2] != undefined) {
			poke_name = splitted[2].replace("your ","");
			opp = (splitted[2].indexOf("your") != -1) ? "自分の" + translateText(poke_name) + "に" : translateText(poke_name) + "に";
		}
		return translateText(splitted[0]) + "は " + translateText(splitted[1]) + " を" + opp + "使います";
	}

	if (tmp.indexOf(" will mega evolve, ") != -1) {
		splitted = tmp.replace(" will mega evolve, then use ",",").replace(".","").replace(" against ",",").split(",");
		opp = "";
		if (splitted[2] != undefined) {
			poke_name = splitted[2].replace("your ","");
			opp = (splitted[2].indexOf("your") != -1) ? "自分の" + translateText(poke_name) + "に" : translateText(poke_name) + "に";
		}
		return translateText(splitted[0]) + "はメガシンカをして、 " + translateText(splitted[1]) + " を" + opp + "使います";
	}

	if (tmp.indexOf(" will switch in, ") != -1) {
		splitted = tmp.replace(" will switch in, replacing ",",").replace(".","").split(",");
		return translateText(splitted[1]) + "を引っ込めて" + translateText(splitted[0]) + "に交代します";
	}

	if (tmp.indexOf("sent out ") != -1) {
		splitted = tmp.split(" sent out ");
		poke_name = splitted[1].split(" (");
		text = (poke_name[1]) ? translateText(poke_name[0]) + "(" + translateText(poke_name[1].replace(")", "")) + ")" : translateText(splitted[1].replace("!", ""));
		return splitted[0] + "は" + text + "をくりだした！";
	}
	if (tmp.indexOf(" withdrew ") != -1) {
		splitted = tmp.split(" withdrew ");
		poke_name = splitted[1].split(" (");
		text = (poke_name[1]) ? translateText(poke_name[0]) + "(" + translateText(poke_name[1].replace(")", "")) + ")" : translateText(splitted[1].replace("!", ""));
		return splitted[0] + "は" + text + "を引っこめた！";
		// return splitted[0]+"は"+translateText(splitted[1].replace("!","")]+"を引っこめた！";
	}
	if (tmp.indexOf("Go! ") != -1) {
		splitted = tmp.replace("Go! ", "");
		poke_name = splitted.split(" (");
		text = (poke_name[1]) ? translateText(poke_name[0]) + "(" + translateText(poke_name[1].replace(")", "")) + ")" : translateText(splitted.replace("!", ""));
		return "ゆけっ！ " + text + "！";
		// return "行け、"+translateText(tmp.replace("Go! ","").replace("!","")]+"！";
	}

	if (tmp.indexOf("Pointed stones dug into") != -1) {
		// var opp = "";
		// if(tmp.indexOf("the opposing") != -1){
		//     opp = "相手の";
		// }
		opp = (tmp.indexOf("the opposing") != -1) ? "相手の" : "";
		return opp + translateText(tmp.replace("Pointed stones dug into ", "").replace("!", "").replace("the opposing ", "")) + "にとがった岩が食い込んだ！";
	}

	if (tmp.indexOf("knocked off ") != -1) {
		// var opp = "";
		// if(tmp.indexOf("the opposing") != -1) opp = "相手の";

		opp = (tmp.indexOf("the opposing") != -1) ? "相手の" : "";
		tmp = tmp.replace("knocked off ", "").replace("the opposing ", "");
		splitted = tmp.split(" 's ");
		return "は" + opp + translateText(splitted[0]) + "の" + translateText(splitted[1].replace("!", "")) + "をはたき落した！";
	}

	if (tmp.match(regex_copied)) {
		// opp = (translateText(RegExp.$1) === undefined) ? "" : "相手の";
		opp = (RegExp.$1) ? "相手の" : "";
		poke_name = translateText(RegExp.$2);
		var anzi = (RegExp.$3 === "") ? "" : "の能力変化をコピーした！";
		var abi = (RegExp.$4 === "") ? "" : "の" + translateText(RegExp.$4.replace(" Ability", "")) + "をコピーした！";
		return "は" + opp + poke_name + anzi + abi;
	}

	if (tmp.match(regex_instruct)) {
		opp = (RegExp.$1) ? "相手の" : "";
		poke_name = translateText(RegExp.$2);
		return "は" + opp + poke_name + "の指示で技を繰り出した！";
	}

	if (tmp.indexOf("frisked ") != -1) {
		opp = (tmp.indexOf("the opposing") != -1) ? "相手の" : "";
		tmp = tmp.replace("frisked ", "").replace("the opposing ", "");
		splitted = tmp.split(" and found its ");
		return "は" + opp + translateText(splitted[0]) + "の" + translateText(splitted[1].replace("!", "")) + "をお見通しだ！";
	}

	if (tmp.match(regex_effective_on)) {
		var eff = translateText(RegExp.$1);
		// var opp = (translateText(RegExp.$2) === undefined) ? "" : translateText(RegExp.$2);
		// var poke = translateText(RegExp.$3);
		var crit = (RegExp.$4 === "") ? "" : "急所に当たった！ ";
		return eff + crit;
	}

	if (tmp.match(regex_crit_on)) {
		return "急所に当たった！ ";
	}

	if (tmp.match(regex_restorehp)) {
		return "は" + translateText(RegExp.$1) + "で体力を回復した！";
	}

	if (originalStr.match(regex_stat_change)) {
		var stat = translateText(RegExp.$1);
		opp = (translateText(RegExp.$4) === undefined) ? "" : translateText(RegExp.$4);
		var sh = (translateText(RegExp.$3) === undefined) ? "" : translateText(RegExp.$3);
		// var harsh = (translateText(RegExp.$2) === undefined) ? "" : translateText(RegExp.$2);
		return "の" + stat + "が" + sh + translateText(RegExp.$2) + "！" + opp;
	}

	if (tmp.match(regex_eat)) {
		return "は" + translateText(RegExp.$1) + "を食べた";
	}

	if (tmp.match(regex_weakened)) {
		opp = (translateText(RegExp.$2) === undefined) ? "" : translateText(RegExp.$2);
		poke_name = translateText(RegExp.$3);
		return opp + poke + "へのダメージを" + translateText(RegExp.$1) + "が弱めた！";
	}

	if (tmp.match(regex_Z_hojo)) {
		return "Z-" + translateText(RegExp.$1);
	}

	if (tmp.match(regex_Z_boost)) {
		return "はZパワーで" + translateText(RegExp.$1) + "が上がった！";
	}

	// if(originalStr.match(regex_stat_change)){
	//     console.log(originalStr);
	//     var splitted=RegExp.$1.split(' ');
	//     var pos=splitted.length-1;
	//     var str2=splitted[pos--];
	//     while(!translateText(str2)){
	//         str2=splitted[pos--]+" "+str2;
	//         if(pos<=0)break;
	//     }
	//     var str1=splitted[pos--];
	//     if(pos>=0)
	//         str1=splitted[pos--]+" "+str1;
	//     var ret="の";
	//     var trans1=translateText(str1);
	//     var trans2=translateText(str2);
	//     if(trans1)
	//         ret+=trans1;
	//     if(trans2)
	//         ret+=trans2;
	//     ret+="！";
	//     if(originalStr.indexOf("The opposing")!=-1)
	//         ret+=" 相手の";
	//     return ret;
	// }

	if (originalStr.match(regex_abi_and_item)) {
		originalStr = originalStr.replace(regex_abi_and_item, "特性: ");
		if (translateText(RegExp.$1)) {
			originalStr += translateText(RegExp.$1);
		}
		originalStr += " / 持ち物: ";
		if (translateText(RegExp.$2)) {
			originalStr += translateText(RegExp.$2);
		}

		return originalStr;
	}

	if (originalStr.match(regex_ability)) {
		originalStr = originalStr.replace(regex_ability, "特性: ");
		if (translateText(RegExp.$1)) {
			originalStr += translateText(RegExp.$1);
		}
		return originalStr;
	}

	if (originalStr.match(regex_possible_ability)) {
		originalStr = originalStr.replace(regex_possible_ability, "特性: ");
		if (translateText(RegExp.$1)) {
			originalStr += translateText(RegExp.$1);
		}
		return originalStr;
	}

	if (originalStr.match(regex_possible_ability2)) {
		originalStr = originalStr.replace(regex_possible_ability2, "特性: ");
		if (translateText(RegExp.$1) && translateText(RegExp.$2)) {
			originalStr = originalStr + translateText(RegExp.$1) + "," + translateText(RegExp.$2);
		}
		return originalStr;
	}

	if (originalStr.match(regex_possible_ability3)) {
		text = "特性: ";
		if (translateText(RegExp.$1) && translateText(RegExp.$2) && translateText(RegExp.$3)) {
			text = text + translateText(RegExp.$1) + "," + translateText(RegExp.$2) + "," + translateText(RegExp.$3);
		}
		return text;
	}

	if (originalStr.match(regex_Item)) {
		originalStr = originalStr.replace(regex_Item, "持ち物: ");
		if (translateText(RegExp.$1)) {
			originalStr += translateText(RegExp.$1);
		}
		return originalStr;
	}
	if (originalStr.match(regex_preview)) {
		var pokes = originalStr.split(" / ");
		var ret = translateText(pokes[0]);
		var pos = 1;
		while (pokes[pos]) {
			ret += " / " + translateText(pokes[pos]);
			pos++;
			if (pos >= 6) break;
		}
		return ret;
	}
	if (originalStr.match(regex_start_battle)) {
		return RegExp.$1 + " と " + RegExp.$2 + " の対戦がはじまった！";
	}
	if (originalStr.match(/^\((.*)\)$/)) {
		if (translateText(RegExp.$1))
			return "(" + translateText(RegExp.$1) + ")";
	}
	if (originalStr.match(/has Mega Evolved into Mega ([A-za-z -]+)!/)) {
		return "はメガ" + translateText(RegExp.$1) + "にメガシンカした！";
	}
	if (originalStr.match(/transformed into ([A-za-z -]+)!/)) {
		return "は" + translateText(RegExp.$1) + "になった！";
	}
	if (originalStr.match(regex_uturn)) {
		return "は" + RegExp.$1 + "のもとへ戻っていく！";
	}
	if (originalStr.match(regex_hurtby)) {
		if (originalStr.indexOf("opposing"))
			return "は" + translateText(RegExp.$1) + "のダメージを受けている！";
	}
	// if(originalStr.match(regex_magic_bounce)){
	//     return "把"+translateText(RegExp.$1)+"反弹回去了！";
	// }
	// if(originalStr.match(regex_magic_bounce)){
	//     return "把"+translateText(RegExp.$1)+"反弹回去了！";
	// }
	if (originalStr.match(/can't use ([A-za-z- ]+) after the taunt!/)) {
		return "は挑発されて" + translateText(RegExp.$1) + "が出せない！";
	}
	if (originalStr.match(regex_gems)) { //ジェム
		return translateText(RegExp.$1) + "は" + translateText(RegExp.$2) + "の威力を強めた!";
	}

	if (originalStr.match(regex_doesnt_affect)) {
		opp = (translateText(RegExp.$1) === undefined) ? "" : translateText(RegExp.$1);
		return opp + translateText(RegExp.$2) + "には効果がないようだ...";
	}

	if (originalStr.match(regex_z_prtct)) {
		return translateText(RegExp.$1) + "は攻撃を守りきれずにダメージを受けた！";
	}

	if (originalStr.match(regex_megastone)) {
		return "の" + translateText(RegExp.$1) + "とキーストーンが反応した！";
	}



	//else
	return originalStr
		.replace(/ lost ([0-9]+)% of its health!/, "に$1%のダメージを与えた！");
	// .replace(/Ability: ([A-za-z ]+)/,"特性: "+translateText(RegExp.$1));
	// .replace(/Ability: ([A-za-z ]+)\/ Item: ([A-za-z ]+)/,"特性:: "+translateText(RegExp.$1)+"/ 道具:"+translateText(RegExp.$2));
	// .replace(" sent out ","放出了 ")
	// .replace("won the battle","获得了胜利")
	// .replace(" withdrew ","收回了 ")
	// .replace("forfeited","认输了")
	// ;

}

function translateText(txt) {
	// console.log(translations[txt]);
	if (translations[txt] === undefined) {
		return txt;
	}
	else {
		return translations[txt];
	}
}

function skip(node, elTW) {
	node = elTW.nextNode();
	while (node.nodeValue == null) {
		node = elTW.nextNode();
	}
	return node;
}

function translateElement(element) {
	var elTW = document.createTreeWalker(element, NodeFilter.SHOW_Element, null, false);
	var node = null;
	var translate = t;
	var flag = true;
	while ((node = elTW.nextNode()) != null) {
		if (node.nodeValue && node.parentNode.getAttribute("class") != "textbox") { //テキストボックス内を除く（TeambuilderのImport/Exportで一部が置換されるため）
			// console.log(QQ(node).text());
			//QQ(node).text(transl)
			// console.log(node.nodeValue+" "+node.parentNode.getAttribute("class"));
			//console.log();
			var value = node.nodeValue;
			if (value.indexOf('•') != -1) {
				value = value.replace('•', "");
				value = translate(value);
				node.nodeValue = "• " + value;
				continue;
			}
			else if (value.match(regex_search)) { //ダブルダメージ
				var arr = [value.trim()];
				var flag = true;

				node.nodeValue = "";

				while (flag) {
					node = skip(node, elTW);

					var txt = node.nodeValue.trim();
					arr.push(txt);
					if (txt == "!" || txt == ".") flag = false;
					node.nodeValue = "";
				}

				// console.log(arr.join(" "));

				var text = translate(arr.join(" "));
				// if (text.indexOf("急所に当たった") != -1) {
				//   var sp = text.split("急所に当たった！");
				//   node.nodeValue = "";
				//   QQ(node).parent().append(sp[0] + '<font color="#a00000">急所に当たった！</font>' + sp[1]);
				// }else{
				//   node.nodeValue = text;
				// }
				node.nodeValue = translate(arr.join(" "));

			}
			else if (value.indexOf("Pointed stones dug into") != -1 || value.indexOf("It doesn't affect") != -1 || value.indexOf("used the move instructed") != -1 ) {
				// var tmp = node.nodeValue;
				// node.nodeValue = "";
				// node = elTW.nextNode();
				// while (node.nodeValue == null) {
				// 	node = elTW.nextNode();
				// }
				// node.nodeValue = tmp + node.nodeValue;
				// node.nodeValue = translate(node.nodeValue);
				// node = elTW.nextNode();
				// node.nodeValue = "";

				var arr = [value.trim()];
				var flag = true;

				node.nodeValue = "";

				while (flag){
					node = skip(node, elTW);
					arr.push(node.nodeValue.trim());
					if (node.nodeValue.indexOf("!") != -1) flag = false;
					node.nodeValue = "";
				}
				node.nodeValue = translate(arr.join(" "));
			}
			else if (value == " knocked off " || value == " knocked off the opposing " || value == " copied " || value == " copied the opposing ") {

				var arr = [value.trim()];
				var flag = true;

				node.nodeValue = "";

				while (flag) {
					node = skip(node, elTW);
					arr.push(node.nodeValue.trim());
					if (node.nodeValue.indexOf("'s ") != -1) flag = false;
					node.nodeValue = "";

				}
				node.nodeValue = translate(arr.join(" "));
			}
			else if (value == " frisked " || value == " frisked the opposing ") {

				var arr = [value.trim()];
				var flag = true;

				node.nodeValue = "";

				while (flag) {
					node = skip(node, elTW);
					arr.push(node.nodeValue.trim());
					if (node.nodeValue.indexOf("and found its ") != -1) flag = false;
					node.nodeValue = "";
				}
				node.nodeValue = translate(arr.join(" "));
			}
			else if (value.match(regex_forme)) {
				var target = node;
				node.nodeValue = "";
				node = elTW.nextNode();

				while (node.nodeValue == null) {
					node = elTW.nextNode();
				}
				var nn = node.nodeValue;
				node.nodeValue = "";

				node = skip(node, elTW);

				target.nodeValue = translate(value + nn + node.nodeValue);

				node.nodeValue = "";

				node = elTW.nextNode();
				node.nodeValue = ""; // "!"を消去

			}
			else {
				node.nodeValue = translate(node.nodeValue.replace("held by", "holder is"));
			}

			var text = node.nodeValue;
			if (text.indexOf('急所に当たった！') != -1 && QQ(node).parent().parent().attr('class') == 'battle-history') {
				QQ(node).wrap('<font color="#c00000">');
			}

			//node=elTW.previousNode();
			//QQ(t).remove();
		}
	}
}

(function () {
	'use strict';
	if (document.getElementById('room-'))
		translateElement(document.getElementById('room-'));
	QQ(document).on('DOMNodeInserted', function (e) {
		translateElement(e.target);
	});
})();
