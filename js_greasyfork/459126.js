var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

// ==UserScript==
// @name        SD JP translation
// @namespace   http://nyokki2319.hatenablog.com/entry/2017/11/01/233117
// @match       https://pokemonshowdown.com/*
// @match       https://play.pokemonshowdown.com/*
// @match       https://replay.pokemonshowdown.com/*
// @match       https://dex.pokemonshowdown.com/*
// @version     2.0.3.1
// @description showdown translation to japanese
// @author      Nyokki
// @grant       none
// @require     http://code.jquery.com/jquery-2.2.4.min.js
// @run-at      document-end
// @copyright   2017, nyokki (https://openuserjs.org/users/nyokki)
// @license     GPL-2.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/459126/SD%20JP%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/459126/SD%20JP%20translation.meta.js
// ==/UserScript==
/*
Copyright (c) 2017 Ceca3 / kirliavc
Released under the MIT license
http://opensource.org/licenses/mit-license.php
*/

/*
Copyright (C) 2018, warehaha (https://warehaha.hatenablog.com/entry/script/psja)
*/

/*
Custom Music PS Edition
Based Choon (http://www.smogon.com/forums/members/pikachuun.171701/)
https://www.smogon.com/forums/threads/3527641/
*/

/*
Index 目次 【もくじ】　　※「//;」で検索してジャンプできます！
●翻訳(translations)の定義編
　⦿システムメッセージ
　⦿特性
　⦿わざ
　⦿アイテム
　⦿ポケモン名
　⦿battle.js
●置換編
　⦿置換①
　⦿置換②
　⦿置換③
*/

// 【注意】新しいバージョンのスクリプトに更新すると元の内容は消えます。このスクリプトを編集する場合は別名で保存するかバックアップを取ってください。

var toggleCustomBgm = 0; // カスタムBGM (1でオン、0でオフ)
var toggleAdvanceMode = 0; // 上級者モード (未実装)
var i, wikiurl, wikiurl2, opp2, splitted2, target, target2, target3;
// var splitted, poke_name, text, opp, text1, text2;
/*
【メモ】
文のまとまり（要素）ごとに置換する。ブラウザの開発ツール参照
○置換のパターン
・var translations = {"置換前":"置換後",};
　単語や1パターンの文の置換
・翻訳(translations)の定義を使わないが複雑な文の置換
・翻訳(translations)の定義を使う複雑な文の置換
*/

//document.getElementById("header").style.display="none"; // 特定のidの要素を非表示

document.title += " (日本語化)"; //ページのタイトルを変更

///////////////////////////////////////
// なぜか反映されない

target = document.getElementsByClassName("utilichart");
for (i = 0; i < target.length; i++) {
	console.log("utilichart").
	target[i].style.margin = "0px 0px 50px 0px";
}
///////////////////////////////////////

const formatmeaning = [
	"【メモ：(format,フォーマット)または(tier,ティア)の意味】",
	"OU:Overused(使われすぎ), Ubers:超(なんでも), UU:Underused(あまり使われない), UUBL:UnderUsed Banlist(UUの中で強い), ",
	"RU:Rarely Used(めったに使われない), RUBL:RarelyUsed Banlist(RUの中で強い), NU:Never Used(絶対使われない), ",
	"PU:(一番下のティア), NFEs:Not Fully Evolved(進化前), LC:Little Cup(リトルカップ), CAP:Create a Pokemon(創作ポケモン)/ ダブルバトルはDOU,DUU",
].join("");

const translations = { // 簡単に置換できるもの

	// ⦿システムメッセージ

	//"[Gen 7] Random Battle":"[第七世代] ランダム対戦",
	"Add game": "Add game", //??
	"Format:": "フォーマット:",
	"Team:": "チーム",
	"Battle!": "対戦！",
	"Find a random opponent": "対戦相手を探す",
	"Teambuilder": "チーム作成",
	"Ladder": "ランキング",
	"Watch a battle": "観戦する",
	"Find a user": "ユーザー検索",
	// "Did you have a good day?":"今日はいい日でしたか?",
	// "[Gen 7] OU battle started between":"[第七世代] OU対戦の開始期間：", //??
	// "and":"and", //どこ?
	"forfeited": "降参",
	"Random team": "ランダムチーム", //x
	"Abilities": "特性",
	"Hidden Ability": "隠れ特性",
	// "Will be":"メガ進化後は",
	// "after Mega Evolving.":"", //上とセット
	"Nickname": "ニックネーム",
	"Item": "持ち物",
	"Ability": "特性",
	"Level": "レベル",
	"Gender": "性別",
	"Happiness": "なつき度",
	"Shiny": "色違い",
	"Level:": "レベル:",
	"Gender:": "性別:",
	"Happiness:": "なつき度:",
	"Shiny:": "色違い:",
	"Moves": "わざ",
	"Copy": "コピー",
	"Import/Export": "インポート/エクスポート",
	"Move": "移動", // 図鑑で Z-移動 となってしまう
	"Delete": "削除",
	"Team": " チーム",
	"Validate": "確認",
	"Add Pokémon": "ポケモンを追加",
	"New Team": "新しいチーム",
	"Male": "オス",
	"Female": "メス",
	"Random": "ランダム",
	"Format List": " フォーマットリスト",
	"List": " リスト",
	"Edit": "編集",
	"Save": "保存",
	"Switch": "交代",
	"Change avatar": "アバターを変更",
	"Password change": "パスワードを変更",
	"Graphics": "グラフィック",
	"Layout:": "レイアウト:",
	"◫ Left and right panels": "◫ 2カラム",
	"◻ Single panel": "◻ 1カラム",
	"Background:": "背景:",
	"Change background": "背景を変更",
	"Dark mode": "ダークモード",
	"Disable animations": "アニメーションを止める",
	"Use BW sprites instead of XY models": "XYモデルの代わりにBWの画像を使用",
	"Use modern sprites for past generations": "過去作に対しても最近の画像を使用",
	"Chat": "チャット",
	"Ignore tournaments": "トーナメントを無視", //??
	"Show PMs in chat rooms": "PMをチャットルームに表示",
	"Highlight when your name is said in chat": "チャットで自分の名前を強調表示",
	"Notifications disappear automatically": "通知を自動的に消去",
	"Timestamps in chat rooms:": "チャットのタイムスタンプを表示:",
	"Off": "オフ",
	"Timestamps in PMs:": "PMのタイムスタンプを表示:",
	"Chat preferences:": "チャットの設定:",
	"Edit formatting": "編集",
	// "You can choose to display formatted text as normal text":"You can choose to display formatted text as normal text", //??
	"Change name": "名前を変える",
	"Log out": "ログアウト",

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 未整理
	"Pokémon": "ポケモン",
	"Normal": "ノーマル",
	"Fire": "ほのお",
	"Water": "みず",
	"Grass": "くさ",
	"Electric": "でんき",
	"Ice": "こおり",
	"Fighting": "かくとう",
	"Poison": "どく",
	"Ground": "じめん",
	"Flying": "ひこう",
	"Psychic": "エスパー",
	"Bug": "むし",
	"Rock": "いわ",
	"Ghost": "ゴースト",
	"Dragon": "ドラゴン",
	"Dark": "あく",
	"Steel": "はがね",
	"Fairy": "フェアリー",
	"Search": "検索",
	//"Psychic": "サイコキネシス",//「エスパー」と被る！やばい
	"Choose name": "名前を決める",
	"Home": "ホーム",
	"News": "お知らせ",
	"Official chat rooms": "公式チャットルーム",
	"Chat rooms": "チャットルーム",
	"Join chat": "チャットに参加",
	"Hide": "隠す",
	"users online": "オンライン人数",
	"active battles": "進行中のバトル",
	"You have been disconnected – possibly because the server was restarted.": "接続が切れました。　　　　　　　　　　　サーバーが再起動したかもしれません。",
	"Reconnect": "再接続",
	"Work offline": "オフラインで利用する",
	"Couldn't connect to server!": "サーバーとの接続に失敗しました！",
	"Retry": "リトライ",
	"Retry with HTTP": "HTTPでリトライ",
	"Pokédex": "ポケモン図鑑",
	"Pokédex Search": "ポケモン図鑑を検索",
	"Replays": "リプレイ",
	"Username:": "ユーザーネーム:",
	"Username": "ユーザーネーム:",
	"Cancel": "キャンセル",
	"Loading...": "ロード中...",
	"Join other room": "別のルームに参加",
	"Join room": "ルームに参加",
	"Open": "検索",
	"Close": "閉じる",
	"All teams": "全てのチーム",
	"(all)": "(全て)",
	"(uncategorized)": "(カテゴリ無し)",
	"(add format folder)": "(フォーマットを追加)",
	"(add folder)": "(フォルダーを追加)",
	"HP is shown in percentages": " HPはパーセントで表示",
	"Limit one foe put to sleep": " 複数催眠禁止",
	"Battle Options": "バトルオプション",
	"In this battle": "今回のバトルのみ",
	"Hardcore mode (hide info not shown in-game) (beta)": "ハードモード(バトル中の情報を隠す)",
	"Hardcore mode (hide info not shown in-game)": "ハードモード(バトル中の情報を隠す)",
	"Ignore Spectators": "観客のチャットを無視",
	"Ignore Opponent": "相手のチャットを無視",
	"Ignore nicknames": "ニックネームを無視",
	"Open new battles on the right side": "新規のバトルを右側のタブで開く",
	"All battles": "全てのバトル",
	"The name you chose is registered.": "その名前はすでに登録されています。",
	"If this is your account": "あなたのアカウントの場合はログイン", //x
	"Log in": "ログイン",
	"If this is someone else's account": "他人のアカウントの場合", //x
	"Choose another name": "別の名前を決める",
	"Connecting": "接続中", //x
	"Waiting for opponent...": "通信待機中...", //x
	"Waiting for players...": "通信待機中...", //x
	"Turn": "ターン", //x
	"Instant replay": "最初から再生",
	"Main menu": "ホームに戻る",
	"Rematch": "再戦する",
	"doses this battle": "このバトルを離れます",
	"Download replay": "リプレイを保存",
	"Upload and share replay": "アップロードして共有", //x
	"Switch sides": "視点切り替え",
	"Resume": "再開",
	"Last turn": "前のターン",
	"Next turn": "次のターン",
	"Skip turn": "次のターン",
	"First turn": "最初のターン",
	"Skip to end": "最後のターン",
	"Go to turn...": "ターンを指定",
	"Download": "ダウンロード",
	"This room is expired": "このルームは閉じられました",
	"Open replay in new tab": "新しいタブでリプレイを開く",
	"Search replays": "リプレイを検索",
	"Featured replays": "人気のリプレイ",
	"minutes ago": "分前",
	"minute ago": "分前",
	"Base power": "いりょく",
	"Base power:": "いりょく:",
	"Power": "威力",
	"Z-Power": "Ｚワザ",
	"Pow": "威力",
	"Accuracy": "命中",
	//"Accuracy: ":"めいちゅう: ",
	"Acc": "命中",
	"Moves": "わざ", //x
	"Type": "タイプ",
	"Types:": "タイプ:",
	"Types": "タイプ",
	"Size:": "おおきさ・おもさ",
	"Abilities:": "特性:",
	"(H)": "(隠れ)",
	"Spc": "とくしゅ",
	"Base stats:": "種族値:",
	"Attack:": "こうげき",
	"Defense:": "ぼうぎょ",
	"Sp. Atk:": "とくこう",
	"Sp. Def:": "とくぼう",
	"Speed:": "すばやさ",
	"Total:": "合計",
	"Evolution:": "進化",
	"Egg groups:": "タマゴグループ",
	"Gender ratio:": "性別比",
	"Past gens": "過去の世代",
	"Flavor": "フレーバー",
	"Events": "イベント",
	"male": "オス",
	"female": "メス",
	//"Atk":"攻撃",
	//"Def":"防御",
	//"SpA":"特攻",
	//"SpD":"特防",
	//"Spe":"素早",
	//"BST":"合計",
	"Atk": "Ａ",
	"Def": "Ｂ",
	"SpA": "Ｃ",
	"SpD": "Ｄ",
	"Spe": "Ｓ",
	"BST": "計",
	"Accept": "許可",
	"Forfeit": "降参",
	"Replace player": "プレイヤーを交代",
	"Close after forfeiting": "降参して閉じる",
	"Forfeiting makes you lose the battle. Are you sure?": "降参するとバトルに負けます。よろしいですか？",
	"empty room": "空きルーム",
	"Timer": "タイマー",
	"Start timer": "タイマー スタート",
	"Stop timer": "タイマー ストップ",
	//"come back!":"戻れ！",//x
	"Play": "プレイ",
	"Pause": "ポーズ",
	"Reset": "リセット",
	"//web.archive.org/web/20220416091720/https://more replays": "別のリプレイを探す", //x
	"Encored": "アンコール",
	"Failed": "しっぱい",
	"Rated battle": "レートバトル",
	"You are disconnected and cannot chat.": "接続が切れたためチャットができません。",
	"Jan": "1月", //x
	"Feb": "2月",
	"Mar": "3月",
	"Apr": "4月",
	"May": "5月",
	"Jun": "6月",
	"Jul": "7月",
	"Aug": "8月",
	"Sep": "9月",
	"Oct": "10月",
	"Nov": "11月",
	"Dec": "12月",
	"Limit one of each Pokémon": " 同じ種族は1体まで",
	"OHKO moves are banned": " 一撃必殺技は禁止",
	"Moody is banned": " ムラっけは禁止",
	"Evasion abilities are banned": " 回避特性は禁止",
	"Evasion moves are banned": " 回避技は禁止",
	"Forcing endless battles is banned": " 無限ループの強制は禁止",
	"'s team:": "のチーム",
	"Play (music off)": "プレイ (音楽なし)",
	"Fast": "はやい",
	"Slow": "おそい",
	"Really Slow": "ゆっくり",
	"Music:": "音楽:",
	"Color scheme:": "背景テーマ:",
	"Light": "ひかり",
	"Text formatting": "テキスト整形",
	"Usable formatting:": "使える整形方法",
	"Import from text": "テキストからインポート",
	"you don't have any teams lol": "チームが ひとつも登録されていない！",
	"Backup/Restore all teams": "全てのチームをバックアップ/リストアする",
	"Backup all teams from this folder": "このフォルダーの全てのチームをバックアップする",
	"Folder name:": "フォルダー名:",
	"Create folder": "フォルダーを作成",
	"Restore teams from backup": "バックアップからチームをリストア",
	"Disconnected": "接続切れ",
	"Connecting...": "接続中...",
	"Search for user": "ユーザーで検索",
	"Search by format": "フォーマットで検索",
	"Super-effective": "ばつぐん",
	"Resisted": "いまひとつ",
	"Critical hit": "きゅうしょ",
	"Protected": "ガード",
	"Immune": "こうかは ない",
	"TOX": "もうどく",
	"Toxic poison": "もうどく",
	"PAR": "まひ",
	"Paralyzed": "まひ",
	"Damage": "ダメージ",
	"Faded": "なくなった",
	"Does not evolve": "進化しない",
	"genderless": "性別不明",
	"Undiscovered": "未確認",
	"Formes:": "フォルム:",
	"Cry": "鳴き声",
	"Cat": "分類",
	"Name": "名前",
	"Default": "デフォルト",
	"Official": "公式",
	"Custom": "カスタム",
	"Done": "決定",
	"Reject": "拒否",
	"[Invalid choice] There's nothing to cancel": "[無効な選択] キャンセルするものはありません",
	"Ladder updating...": "ランキングを 更新しています..",
	"Foe's Reflect": "相手のリフレクター",
	"EVs": "努力値",
	"IVs": "個体値",
	"Base": "ベース",
	"Sp. Atk.": "特攻",
	"Sp. Def.": "特防",
	"Limit one of each item": "同じ道具は１つまで",
	"BRN": "やけど",
	"Battle timer is now OFF.": "バトルタイマーがオフになりました。",
	"Missed": "はずれ",
	"Balloon": "ふうせん",
	"None": "なし",
	"(All formats)": "(全てのフォーマット)",
	"(Select a format)": "(フォーマットを選択)",
	"Battles": "バトル",
	"Elo 1300+": "Eloレート 1300以上",
	"Only guests": "ゲストのみ",
	"Select a format": "フォーマットを選択",
	"Nature:": "性格:",
	'You can also set natures by typing "+" and "-" next to a stat.': '性格は努力値欄の数値の横に「+」と「-」を入力しても設定できます。',
	"Did you have a good day?": " ",
	"Yes, my day was pretty good": " ",
	"No, it wasn't great": " ",
	"Popular items": "よく持たせられているアイテム",
	"Restricted Legendary": "禁止級伝説",
	"Regular": "一般",
	"Details": "詳細",
	"Remaining:": "残り",
	"Adamant (+Atk, -SpA)": "いじっぱり (攻撃+ 特攻-)",
	"Bashful": "てれや",
	"Bold (+Def, -Atk)": "ずぶとい (防御+ 攻撃-)",
	"Brave (+Atk, -Spe)": "ゆうかん (攻撃+ 素早-)",
	"Calm (+SpD, -Atk)": "おだやか (特防+ 攻撃-)",
	"Careful (+SpD, -SpA)": "しんちょう (特防+ 特攻-)",
	"Docile": "すなお",
	"Gentle (+SpD, -Def)": "おとなしい (特防+ 防御-)",
	"Hardy": "がんばりや",
	"Hasty (+Spe, -Def)": "せっかち (素早+ 防御-)",
	"Impish (+Def, -SpA)": "わんぱく (防御+ 特攻-)",
	"Jolly (+Spe, -SpA)": "ようき (素早+ 特攻-)",
	"Lax (+Def, -SpD)": "のうてんき (防御+ 特防-)",
	"Lonely (+Atk, -Def)": "さみしがり (攻撃+ 防御-)",
	"Mild (+SpA, -Def)": "おっとり (特攻+ 防御-)",
	"Modest (+SpA, -Atk)": "ひかえめ (特攻+ 攻撃-)",
	"Naive (+Spe, -SpD)": "むじゃき (素早+ 特防-)",
	"Naughty (+Atk, -SpD)": "やんちゃ (攻撃+ 特防-)",
	"Quiet (+SpA, -Spe)": "れいせい (特攻+ 素早-)",
	"Quirky": "きまぐれ",
	"Rash (+SpA, -SpD)": "うっかりや (特攻+ 特防-)",
	"Relaxed (+Def, -Spe)": "のんき (防御+ 素早-)",
	"Sassy (+SpD, -Spe)": "なまいき (特防+ 素早-)",
	"Serious": "まじめ",
	"Timid (+Spe, -Atk)": "おくびょう (素早+ 攻撃-)",
	"IV spreads": "おすすめ個体値",
	"min Atk": "A0 (攻撃最低)",
	"min Atk, min Spe": "A0S0 (攻撃最低 最遅)",
	"max all": "6V (全て最高)",
	"min Spe": "S0 (最遅)",
	"Clearing your cookies (specifically,": "【注意】クッキー(ローカルストレージ)",
	"localStorage": " ",
	") will delete your teams.": "が削除されると登録したチームが消えます。",
	"Browsers sometimes randomly clear cookies - you should back up your teams or use the desktop client if you want to make sure you don't lose them.": "チームが失われないように定期的にバックアップをとるか、デスクトップクライアントを利用してください。",
	"If you want to clear your cookies or": "クッキーやローカルストレージを削除したい場合、",
	", you can use the Backup/Restore feature to save your teams as text first.": "バックアップ/リストア機能を利用してチームをテキストとして保存することができます。",
	"Stats": "ステータス",
	"See a user's ranking with": "特定のユーザーのランキングを見たい場合：",
	"User lookup": "ユーザーを見る",
	"How the ladder works": "ランキングについて",
	"Our ladder displays three ratings: Elo, GXE, and Glicko-1.": "ここでは Elo, GXE, and Glicko-1 の3つのレーティングがあります。",
	"is the main ladder rating. It's a pretty normal ladder rating: goes up when you win and down when you lose.": "はメインのレートです。ごく普通のレートで、勝つと上がり、負けると下がります。",
	"(Glicko X-Act Estimate) is an estimate of your win chance against an average ladder player.": "(Glicko X-Act Estimate) は平均的なプレイヤーに対する推定勝率です。",
	"is a different rating system. It has rating and deviation values.": " は変わったレーティングシステムで、レートと偏差値があります。",
	"Note that win/loss should not be used to estimate skill, since who you play against is much more important than how many times you win or lose. Our other stats like Elo and GXE are much better for estimating skill.": "勝ち負けの回数よりも誰と戦うかが重要なので、勝率はスキルを見積もるために使うべきではないことに注意してください。 EloやGXEのような統計の方が、スキルを見積もるのに優れています。",
	"Undo Delete": "削除取り消し",
	"SLP": "ねむり",
	"Limit two of each ability": " 同じ特性は2つまで",
	"Crystal-free Z-Moves are banned": " ＺクリスタルのいらないＺワザは禁止",
	"Level-up": "レベルアップ",
	"TM/HM": "わざマシン/ひでんマシン",
	"Tutor": "おしえわざ",
	"Event": "イベント",
	"Past generation only": "過去作のみ",
	"HP is reported as percentages": " HPはパーセントで表示",
	"Swagger is banned": " いばるは禁止",
	"Item knocked off": "はたきおとす",
	"Burned": "やけど",
	"(The sunlight is strong!)": "日差しが 強くなっている",
	"Suggested spread:": "おすすめ配分:",
	"Transformed": "へんしん",
	"Effect volume:": "効果音 (小 <<< 大)",
	"Music volume:": "BGM　(小 <<< 大)",
	"Notification volume:": "通知音 (小 <<< 大)",
	"Mute sounds": "ミュート",
	"(muted)": "(ミュート)",
	"bold": "太字", // Bold ずぶとい
	"italics": "斜体",
	"strikethrough": "取り消し線",
	"superscript": "上付き",
	"subscript": "下付き",
	"Don't warn for untrusted links": "信頼できないリンクを警告しない",
	"Credits": "クレジット",
	"Choose an avatar or": "アバターを選ぶ ",
	"Drag and drop an image to PS (the background settings don't need to be open), or upload:": "このページに画像をドラッグ＆ドロップ (背景設定を開いておく必要はありません) または ファイルを参照",
	"You have been logged out and disconnected.": "ログアウトが完了し、サーバーから切断しました。",
	"If you wanted to change your name while staying connected, use the 'Change Name' button or the '/nick' command.": "接続中に名前を変更する場合は、[名前の変更]ボタンまたは[/nick]コマンドを使用してください。",
	"If this is someone else's account:": "他人のアカウントの場合:",
	"If this is your account:": "自分のアカウントの場合:",
	"Password:": "パスワード:",
	"Other teams": "他のチーム",
	"Show all teams": "全てのチームを開く",
	"Select a team": "チームを選ぶ",
	"Stat drop blocked": "能力は下がらない",
	"Taunted": "ちょうはつ",
	"Physical": "ぶつり",
	"Special": "とくしゅ",
	"Status": "へんか",
	"Challenge": "対戦を申し込む",
	"Ignore": "無視",
	"Report": "通報",
	"Mega Evolution": "メガシンカ",
  "Terastallize": "テラスタル",
	" Mega Evolution": " メガシンカ",
	"Usually useless moves": "あまり使われない技",
	"Accuracy-lowering moves are banned": " 命中を下げる技は禁止",
	"Filters:": "フィルター:",
	"Filtered results": "フィルター結果",
	"(backspace = delete filter)": "(backspace = フィルター削除)",
	"Useless items": "役に立たないアイテム",
	"Usually useless items": "通常役に立たないアイテム",
	"Items": "アイテム",
	"Pokémon-specific items": "特定のポケモン用のアイテム",
	"Sort:": "並べ替え:",
	"you have no pokemon lol": "ポケモンが 登録されていない！",
	"(empty team)": "(空きチーム)",
	"How will you start the battle?": "どのポケモンを 最初にだす？",
	"Choose Lead": "最初に出すポケモンを選ぶ",
	"Opponent sees:": "相手が分かる情報:",
	"Neuroforce": "ブレインフォース",
	"Ultranecrozium Z": "ウルトラネクロＺ",
	"Suggested spread: (Please choose 4 moves to get a suggested spread) (": "おすすめ配分:(先に4つのわざを選んでください) (",
	"Unreleased": "未解禁",
	"Flabébé": "フラベベ",
	"Type: Null": "タイプ：ヌル",
	"Apicot Berry": "ズアのみ",
	"Berry Juice": "きのみジュース",
	"Coba Berry": "バコウのみ （ひこう）",
	"Full Incense": "まんぷくおこう",
	"Ganlon Berry": "リュガのみ",
	"Grepa Berry": "ウブのみ",
	"Kelpsy Berry": "ネコブのみ",
	"King's Rock": "おうじゃのしるし",
	"Kommonium Z": "ジャラランガＺ",
	"Lansat Berry": "サンのみ",
	"Lax Incense": "のんきのおこう",
	"Leppa Berry": "ヒメリのみ",
	"Liechi Berry": "チイラのみ",
	"Lunalium Z": "ルナアーラＺ",
	"Lycanium Z": "ルガルガンＺ",
	"Mail": "メール",
	"Micle Berry": "ミクルのみ",
	"Mimikium Z": "ミミッキュＺ",
	"Odd Incense": "あやしいおこう",
	"Petaya Berry": "ヤタピのみ",
	"Rock Incense": "がんせきおこう",
	"Rose Incense": "おはなのおこう",
	"Salac Berry": "カムラのみ",
	"Sea Incense": "うしおのおこう",
	"Shed Shell": "きれいなぬけがら",
	"SilverPowder": "ぎんのこな",
	"Solganium Z": "ソルガレオＺ",
	"Starf Berry": "スターのみ",
	"Wave Incense": "さざなみのおこう",
	"Adamant Orb": "こんごうだま",
	"Burn Drive": "ブレイズカセット",
	"Chill Drive": "フリーズカセット",
	"Douse Drive": "アクアカセット",
	"Lustrous Orb": "しらたま",
	"Metagrossite": "メタグロスナイト",
	"Shock Drive": "イナズマカセット",
	"Destiny Knot": "あかいいと",
	"Enigma Berry": "ナゾのみ",
	"Macho Brace": "きょうせいギプス",
	"Power Anklet": "パワーアンクル",
	"Power Band": "パワーバンド",
	"Power Belt": "パワーベルト",
	"Power Bracer": "パワーリスト",
	"Power Lens": "パワーレンズ",
	"Oran Berry": "オレンのみ",
	"Power Weight": "パワーウエイト",
	"Fairy Gem": "フェアリージュエル",
	"Sketched moves": "スケッチしたわざ",
	"Room name:": "ルーム名:",
	"(color)": "(カラー)",
	"(more games needed)": "(対戦数が足りません)",
	"Rain": "あめ",
	"Sun": "ひざしがつよい",
	"(closes this battle)": "(このバトルを閉じます)",
	"Sash": "タスキ",
	"Battle": "バトル",
	"(5 or 8 turns)": "(5 or 8ターン)", //雑置換
	"(4 or 7 turns)": "(4 or 7ターン)",
	"(3 or 6 turns)": "(3 or 6ターン)",
	"(2 or 5 turns)": "(2 or 5ターン)",
	"(1 or 4 turns)": "(1 or 4ターン)",
	"(5 turns)": "(5ターン)",
	"(4 turns)": "(4ターン)",
	"(3 turns)": "(3ターン)",
	"(2 turns)": "(2ターン)",
	"(1 turn)": "(1ターン)",
	"Register": "登録",
	"Register your account:": "アカウントを登録:",
	"Password (confirm):": "パスワード (確認):",
	"What is this pokemon?": "What is this pokemon? (訳:Pikachuと入力してください)",
	'(Others will be able to see your name change. To change name privately, use "Log out")': "(他の人にも名前を変更したことが分かってしまいます。こっそり変更したければログアウトしてください。)",
	"code formatting": "網掛けと囲み線",
	"Auto-show spoilers:": "ネタバレを自動表示:",
	"Suppress": "無効化: ",
	"Make [[clickable links]] unclickable": "[[リンク]]をクリック不可にする",
	//     "(btw if you couldn't tell the ladder screens aren't done yet; they'll look nicer than this once I'm done.)": formatmeaning,
	"(btw if you couldn't tell the ladder screens aren't done yet; they'll look nicer than this once I'm done.)": " ",
	"Asleep": "ねむり",
	"Poll": "投票",
	"(You can't vote after viewing results)": "(結果を見た後は投票できません)",
	"(View results)": "(結果を見る)",
	"Confused": "こんらん",
	"Pokémon in a team must share a type": "タイプ統一",
	"Clipboard:": "ｸﾘｯﾌﾟﾎﾞｰﾄﾞ:",
	"Paste!": "貼り付け",
	"Clear clipboard": "クリップボードをクリア",
	"PSN": "どく",
	"Poisoned": "どく",
	"poison": "どく",
	"badly poison": "もうどく",
	"Already paralyzed": "すでにまひ",
	"You are trapped and cannot switch!": "いまは 交代できない！",
	"Special Event Ability": "特別なイベントの特性",
	"Back": "戻る",
	" What about the rest of your team?": "残りのポケモンは どうする？",
	"(Rain continues to fall!)": "雨が 降り続いている",
	"No results found": "見つかりませんでした",
	"Public": "パブリック",
	"Private": "プライベート",
	"(In gen 7, Dark is immune to Prankster moves.)": "(第7世代では、あくタイプにいたずらごころのわざは効きません。)",
	"burn": "やけど",
	"Taunt ended": "ちょうはつ解除", //x
	"You ": "You ",
	"might": "might",
	" be trapped, so you won't be able to cancel a switch!": " be trapped, so you won't be able to cancel a switch! (交代できないかもしれない！)", //x
	"[Invalid choice] Can't switch: The active Pokémon is trapped": "[無効な選択] 交代不可: そのポケモンは拘束されている",
	"(Fake Out only works on your first turn out.)": "(ねこだましは場に出てから最初のターンだけ成功します。)",
	" You cannot mega evolve Rayquaza": " レックウザはメガシンカできない", //x
	"Limit one foe frozen": " 凍るのは1体ずつまで",
	"Faster Pokémon switch first": " 素早い方から先に交代",
	"All Pokémon that heard the song will faint in three turns!": "ほろびのうたを 聴いたポケモンは ３ターン後に滅びてしまう！",
	"Nicknames ignored.": "ニックネームが無視されました。",
	"Nicknames no longer ignored.": "ニックネームを無視しません。",
	"Encore ended": "アンコール解除", //x
	"Poll ended": "投票終了",
	"You have been disqualified from the tournament in Lobby: You failed to accept your opponent's challenge in time.": "ロビーのトーナメントで失格になりました: 時間内に相手の挑戦を受けなかったため",
	"Spikes were scattered on the ground all around the opposing team!": "相手の 足元に まきびしが 散らばった！",
	"Spikes were scattered on the ground all around your team!": "味方の 足元に まきびしが 散らばった！",
	"At who?": "どのポケモンに？",
	"What about the rest of your team?": "残りのポケモンは どうする？",
	"Helping Hand": "てだすけ",
	"Restored": "かいふく",
	"Woke up": "めをさました",
	"Berry": "きのみ",
	"Gold Berry": "おうごんのみ",
	"PSNCureBerry": "どくけしのみ",
	"PRZCureBerry": "まひなおしのみ",
	"Mint Berry": "はっかのみ",
	"Burnt Berry": "やけたきのみ",
	"Ice Berry": "こおったきのみ",
	"Bitter Berry": "にがいきのみ",
	"MysteryBerry": "ふしぎなきのみ",
	"MiracleBerry": "きせきのみ",
	"You sense the presence of many!": "たくさんの 気配を 感じる...！",
	"Stats reset": "くろいきり",
	"A soothing aroma wafted through the area!": "心地よい香りが 広がった！", //x
	"paralysis": "まひ",
	"It created a bizarre area in which Defense and Sp. Def stats are swapped!": "防御と特防が入れ替わる空間を 作り出した！",
	"Wonder Room wore off, and Defense and Sp. Def stats returned to normal!": "防御と特防が入れ替わる空間が 元に戻った！",
	"Foe's Light Screen": "相手のひかりのかべ",
	"Foe's Reflect": "相手のリフレクター",
	"Foe's Tailwind": "相手のおいかぜ",
	// まきびし・どくびし・ステルスロック・ねばねばネット やどりぎのタネ しめつける、まきつく、ほのおのうず、からではさむ、すなじごく、マグマストーム、うずしお、まとわりつく
	"The spikes disappeared from the ground around the opposing team!": "相手の周りの まきびしが 消え去った！",
	"The spikes disappeared from the ground around your team!": "味方の周りの まきびしが 消え去った！",
	"The sticky web has disappeared from the ground around the opposing team!": "相手の周りの ねばねばネットが 消え去った！",
	"The sticky web has disappeared from the ground around your team!": "味方の周りの ねばねばネットが 消え去った！",
	"A sticky web spreads out on the ground around the opposing team!": "相手の周りに ねばねばネットが 張り巡らされた！",
	"A sticky web spreads out on the ground around your team!": "味方の周りに ねばねばネットが 張り巡らされた！",
	"Lightened": "かるい",
	"Pick a variant or": "見た目を選ぶ ",
	"Gravity intensified!": "重力が 強くなった！",
	"Gravity returned to normal!": "重力が 元に戻った！",
	"Disabled": "つかえない",
	"Disable ended": "かなしばり解除", //x
	"Enduring": "こらえる",
	"The extremely harsh sunlight faded.": "とても強い日差しが 元に戻った！",
	"No exact match found. The closest matches alphabetically are:": "一致するものが見つかりませんでした。 もしかして:",
	"Heavy Rain": "おおあめ",
	"The opposing team is too nervous to eat Berries!": "相手は 緊張して きのみが 食べられなくなった！",
	"Your team is too nervous to eat Berries!": "味方は 緊張して きのみが 食べられなくなった！",
	"Intense Sun": "おおひでり",
	"Pop-out": "ポップアウト",
	"In Progress": "開催中",
	"Toggle": "[ 開閉 ]",
	"The tournament has started!": "トーナメントが始まりました！",
	"Watch the finals of the tournament! «": "トーナメントの決勝戦を観戦しましょう！ «",
	"Tournament battle": "トーナメントバトル",
	"Join": "参加",
	"FRZ": "こおり",
	"Drowsy": "あくび",
	"Your username is no longer available.": "そのユーザーネームは利用できません。",
	"Saved": "保存されました",
	"De-seeded": "やどりぎ解除",
	"Friezed": "こおり",
	"Hardcore mode ON: Information not available in-game is now hidden.": "ハードモードがオン: ゲーム内で得られない情報が隠されました。",
	"Hardcore mode OFF: Information not available in-game is now shown.": "ハードモードがオフ: ゲーム内で得られない情報も表示されます。",
	"Spectators ignored.": "観客のチャットが無視されます。",
	"Spectators no longer ignored.": "観客のチャットが無視されなくなりました。",
	"Opponent ignored.": "対戦相手のチャットが無視されます。",
	"Opponent no longer ignored.": "対戦相手のチャットが無視されなくなりました。",
	"Mega": "メガ",
	"Type:": "タイプ:",
	"Accuracy:": "めいちゅう",
	"You have been successfully registered.": "ユーザー登録に成功しました。",
	"Your username must be less than 19 characters long.": "ユーザーネームは19文字未満でなければいけません。",
	" This is a made-up Pokémon by ": " これはSmogonで独自に作られたポケモンです。", //x
	"Mysterious strong winds are protecting Flying-type Pokémon!": "謎の乱気流が ひこうポケモンを守る！",
	"Balloon popped": "ふうせん割れた",
	"Flinched": "ひるみ",
	"Your replay has been uploaded! It's available at:": "リプレイがアップロードされました！リンクはこちら:",
	"It created a bizarre area in which Pokémon's held items lose their effects!": "道具の効果が無くなる 空間が 作られた！",
	"Magic Room wore off, and held items' effects returned to normal!": "マジックルームが消えて 道具の効果が 元に戻った！",
	"": "",
	"": "",
	"": "",
	"": "",
	"": "",
	"": "",
	"": "",
	"": "",

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	// ⦿特性
	//;

　"RKS System": "ARシステム",
　"Ice Face": "アイスフェイス",
　"Ice Body": "アイスボディ",
　"Stench": "あくしゅう",
　"Thick Fat": "あついしぼう",
　"Stall": "あとだし",
　"Analytic": "アナライズ",
　"Contrary": "あまのじゃく",
　"Rain Dish": "あめうけざら",
　"Drizzle": "あめふらし",
　"Arena Trap": "ありじごく",
　"Aroma Veil": "アロマベール",
　"Intimidate": "いかく",
　"Anger Shell": "いかりのこうら",
　"Anger Point": "いかりのつぼ",
　"Rock Head": "いしあたま",
　"Prankster": "いたずらごころ",
　"Healer": "いやしのこころ",
　"Illusion": "イリュージョン",
　"Tinted Lens": "いろめがね",
　"Rocky Payload": "いわはこび",
　"Gulp Missile": "うのミサイル",
　"Liquid Voice": "うるおいボイス",
　"Hydration": "うるおいボディ",
　"Air Lock": "エアロック",
　"Galvanize": "エレキスキン",
　"Electric Surge": "エレキメイカー",
　"Long Reach": "えんかく",
　"Good as Gold": "おうごんのからだ",
　"Dancer": "おどりこ",
　"Frisk": "おみとおし",
　"Parental Bond": "おやこあい",
　"Aura Break": "オーラブレイク",
　"Desolate Land": "おわりのだいち",
　"Hyper Cutter": "かいりきバサミ",
　"Power of Alchemy": "かがくのちから",
　"Neutralizing Gas": "かがくへんかガス",
　"Shadow Tag": "かげふみ",
　"Wind Rider": "かぜのり",
　"Speed Boost": "かそく",
　"Tough Claws": "かたいツメ",
　"Mold Breaker": "かたやぶり",
　"Competitive": "かちき",
　"Battle Armor": "カブトアーマー",
　"Tangling Hair": "カーリーヘアー",
　"Unburden": "かるわざ",
　"Imposter": "かわりもの",
　"Sturdy": "がんじょう",
　"Strong Jaw": "がんじょうあご",
　"Dry Skin": "かんそうはだ",
　"Emergency Exit": "ききかいひ",
　"Anticipation": "きけんよち",
　"Battle Bond": "きずなへんげ",
　"Mimicry": "ぎたい",
　"Curious Medicine": "きみょうなくすり",
　"Scrappy": "きもったま",
　"Berserk": "ぎゃくじょう",
　"Suction Cups": "きゅうばん",
　"Super Luck": "きょううん",
　"Costar": "きょうえん",
　"Symbiosis": "きょうせい",
　"Schooling": "ぎょぐん",
　"Purifying Salt": "きよめのしお",
　"Sharpness": "きれあじ",
　"Mycelium Might": "きんしのちから",
　"Unnerve": "きんちょうかん",
　"Gluttony": "くいしんぼう",
　"Quick Draw": "クイックドロウ",
　"Quark Drive": "クォークチャージ",
　"Grass Pelt": "くさのけがわ",
　"Weak Armor": "くだけるよろい",
　"Grassy Surge": "グラスメイカー",
　"Clear Body": "クリアボディ",
　"Grim Neigh": "くろのいななき",
　"Torrent": "げきりゅう",
　"Ice Scales": "こおりのりんぷん",
　"Protosynthesis": "こだいかっせい",
　"Seed Sower": "こぼれダネ",
　"Gorilla Tactics": "ごりむちゅう",
　"Well-Baked Body": "こんがりボディ",
　"Guts": "こんじょう",
　"Psychic Surge": "サイコメイカー",
　"Regenerator": "さいせいりょく",
　"Surge Surfer": "サーフテール",
　"Wandering Spirit": "さまようたましい",
　"Rough Skin": "さめはだ",
　"Solar Power": "サンパワー",
　"Shell Armor": "シェルアーマー",
　"Stamina": "じきゅうりょく",
　"Moxie": "じしんかじょう",
　"Natural Cure": "しぜんかいふく",
　"Damp": "しめりけ",
　"Harvest": "しゅうかく",
　"Limber": "じゅうなん",
　"Ripen": "じゅくせい",
　"Steam Engine": "じょうききかん",
　"Victory Star": "しょうりのほし",
　"Queenly Majesty": "じょおうのいげん",
　"Magnet Pull": "じりょく",
　"Commander": "しれいとう",
　"White Smoke": "しろいけむり",
　"Chilling Neigh": "しろのいななき",
　"Synchronize": "シンクロ",
　"As One": "じんばいったい",
　"As One": "じんばいったい",
　"Overgrow": "しんりょく",
　"Swift Swim": "すいすい",
　"Sweet Veil": "スイートベール",
　"Water Bubble": "すいほう",
　"Aerilate": "スカイスキン",
　"Skill Link": "スキルリンク",
　"Propeller Tail": "スクリューおびれ",
　"Stalwart": "すじがねいり",
　"Reckless": "すてみ",
　"Sniper": "スナイパー",
　"Sand Stream": "すなおこし",
　"Sand Rush": "すなかき",
　"Sand Veil": "すながくれ",
　"Sand Force": "すなのちから",
　"Sand Spit": "すなはき",
　"Infiltrator": "すりぬけ",
　"Keen Eye": "するどいめ",
　"Slow Start": "スロースタート",
　"Power Construct": "スワームチェンジ",
　"Justified": "せいぎのこころ",
　"Inner Focus": "せいしんりょく",
　"Static": "せいでんき",
　"Comatose": "ぜったいねむり",
　"Sap Sipper": "そうしょく",
　"Supreme Overlord": "そうだいしょう",
　"Soul-Heart": "ソウルハート",
　"Heatproof": "たいねつ",
　"Download": "ダウンロード",
　"Dark Aura": "ダークオーラ",
　"Shed Skin": "だっぴ",
　"Turboblaze": "ターボブレイズ",
　"Ball Fetch": "たまひろい",
　"Zen Mode": "ダルマモード",
　"Simple": "たんじゅん",
　"Sheer Force": "ちからずく",
　"Huge Power": "ちからもち",
　"Volt Absorb": "ちくでん",
　"Tangled Feet": "ちどりあし",
　"Water Absorb": "ちょすい",
　"Armor Tail": "テイルアーマー",
　"Adaptability": "てきおうりょく",
　"Technician": "テクニシャン",
　"Iron Fist": "てつのこぶし",
　"Iron Barbs": "てつのトゲ",
　"Teravolt": "テラボルテージ",
　"Delta Stream": "デルタストリーム",
　"Telepathy": "テレパシー",
　"Motor Drive": "でんきエンジン",
　"Electromorphosis": "でんきにかえる",
　"Forecast": "てんきや",
　"Unaware": "てんねん",
　"Serene Grace": "てんのめぐみ",
　"Rivalry": "とうそうしん",
　"Toxic Debris": "どくげしょう",
　"Poison Touch": "どくしゅ",
　"Poison Point": "どくのトゲ",
　"Toxic Boost": "どくぼうそう",
　"Earth Eater": "どしょく",
　"Innards Out": "とびだすなかみ",
　"Transistor": "トランジスタ",
　"Trace": "トレース",
　"Lingering Aroma": "とれないにおい",
　"Oblivious": "どんかん",
　"Bad Dreams": "ナイトメア",
　"Truant": "なまけ",
　"Run Away": "にげあし",
　"Wimp Out": "にげごし",
　"Gooey": "ぬめぬめ",
　"Thermal Exchange": "ねつこうかん",
　"Flare Boost": "ねつぼうそう",
　"Sticky Hold": "ねんちゃく",
　"No Guard": "ノーガード",
　"Cloud Nine": "ノーてんき",
　"Normalize": "ノーマルスキン",
　"Cursed Body": "のろわれボディ",
　"Steelworker": "はがねつかい",
　"Steely Spirit": "はがねのせいしん",
　"Disguise": "ばけのかわ",
　"Primordial Sea": "はじまりのうみ",
　"Pastel Veil": "パステルベール",
　"Illuminate": "はっこう",
　"Battery": "バッテリー",
　"Big Pecks": "はとむね",
　"Stance Change": "バトルスイッチ",
　"Solid Rock": "ハードロック",
　"Hadron Engine": "ハドロンエンジン",
　"Quick Feet": "はやあし",
　"Early Bird": "はやおき",
　"Gale Wings": "はやてのつばさ",
　"Hunger Switch": "はらぺこスイッチ",
　"Screen Cleaner": "バリアフリー",
　"Hustle": "はりきり",
　"Stakeout": "はりこみ",
　"Power Spot": "パワースポット",
　"Punk Rock": "パンクロック",
　"Guard Dog": "ばんけん",
　"Cud Chew": "はんすう",
　"Beast Boost": "ビーストブースト",
　"Drought": "ひでり",
　"Merciless": "ひとでなし",
　"Orichalcum Pulse": "ひひいろのこどう",
　"Dazzling": "ビビッドボディ",
　"Rattled": "びびり",
　"Lightning Rod": "ひらいしん",
　"Triage": "ヒーリングシフト",
　"Opportunist": "びんじょう",
　"Fur Coat": "ファーコート",
　"Shadow Shield": "ファントムガード",
　"Filter": "フィルター",
　"Wind Power": "ふうりょくでんき",
　"Fairy Aura": "フェアリーオーラ",
　"Pixilate": "フェアリースキン",
　"Unseen Fist": "ふかしのこぶし",
　"Klutz": "ぶきよう",
　"Compound Eyes": "ふくがん",
　"Steadfast": "ふくつのこころ",
　"Dauntless Shield": "ふくつのたて",
　"Marvel Scale": "ふしぎなうろこ",
　"Wonder Guard": "ふしぎなまもり",
　"Corrosion": "ふしょく",
　"Intrepid Sword": "ふとうのけん",
　"Insomnia": "ふみん",
　"Levitate": "ふゆう",
　"Plus": "プラス",
　"Flower Gift": "フラワーギフト",
　"Flower Veil": "フラワーベール",
　"Refrigerate": "フリーズスキン",
　"Prism Armor": "プリズムアーマー",
　"Neuroforce": "ブレインフォース",
　"Pressure": "プレッシャー",
　"Friend Guard": "フレンドガード",
　"Heavy Metal": "ヘヴィメタル",
　"Liquid Ooze": "ヘドロえき",
　"Protean": "へんげんじざい",
　"Color Change": "へんしょく",
　"Poison Heal": "ポイズンヒール",
　"Soundproof": "ぼうおん",
　"Effect Spore": "ほうし",
　"Overcoat": "ぼうじん",
　"Bulletproof": "ぼうだん",
　"Cheek Pouch": "ほおぶくろ",
　"Flame Body": "ほのおのからだ",
　"Perish Body": "ほろびのボディ",
　"Zero to Hero": "マイティチェンジ",
　"Minus": "マイナス",
　"Own Tempo": "マイペース",
　"Magma Armor": "マグマのよろい",
　"Defiant": "まけんき",
　"Magician": "マジシャン",
　"Magic Guard": "マジックガード",
　"Magic Bounce": "マジックミラー",
　"Multiscale": "マルチスケイル",
　"Multitype": "マルチタイプ",
　"Mummy": "ミイラ",
　"Water Compaction": "みずがため",
　"Misty Surge": "ミストメイカー",
　"Water Veil": "みずのベール",
　"Honey Gather": "みつあつめ",
　"Mirror Armor": "ミラーアーマー",
　"Wonder Skin": "ミラクルスキン",
　"Swarm": "むしのしらせ",
　"Moody": "ムラっけ",
　"Mega Launcher": "メガランチャー",
　"Full Metal Body": "メタルプロテクト",
　"Cute Charm": "メロメロボディ",
　"Immunity": "めんえき",
　"Blaze": "もうか",
　"Pickup": "ものひろい",
　"Fluffy": "もふもふ",
　"Flash Fire": "もらいび",
　"Vital Spirit": "やるき",
　"Aftermath": "ゆうばく",
　"Slush Rush": "ゆきかき",
　"Snow Cloak": "ゆきがくれ",
　"Snow Warning": "ゆきふらし",
　"Chlorophyll": "ようりょくそ",
　"Pure Power": "ヨガパワー",
　"Forewarn": "よちむ",
　"Storm Drain": "よびみず",
　"Defeatist": "よわき",
　"Light Metal": "ライトメタル",
　"Leaf Guard": "リーフガード",
　"Libero": "リベロ",
　"Shields Down": "リミットシールド",
　"Dragon's Maw": "りゅうのあぎと",
　"Shield Dust": "りんぷん",
　"Receiver": "レシーバー",
　"Vessel of Ruin": "わざわいのうつわ",
　"Tablets of Ruin": "わざわいのおふだ",
　"Beads of Ruin": "わざわいのたま",
　"Sword of Ruin": "わざわいのつるぎ",
　"Cotton Down": "わたげ",
　"Pickpocket": "わるいてぐせ",

	// ⦿わざ
	//;

　"10,000,000 Volt Thunderbolt": "1000まんボルト",
　"High Horsepower": "10まんばりき",
　"Thunderbolt": "10まんボルト",
　"Triple Arrows": "3ぼんのや",
　"Darkest Lariat": "DDラリアット",
　"Grav Apple": "Gのちから",
　"V-create": "Vジェネレート",
　"Iron Tail": "アイアンテール",
　"Iron Head": "アイアンヘッド",
　"Steel Roller": "アイアンローラー",
　"Ice Spinner": "アイススピナー",
　"Ice Hammer": "アイスハンマー",
　"Ice Ball": "アイスボール",
　"Blue Flare": "あおいほのお",
　"Aqua Cutter": "アクアカッター",
　"Aqua Jet": "アクアジェット",
　"Aqua Step": "アクアステップ",
　"Aqua Tail": "アクアテール",
　"Liquidation": "アクアブレイク",
　"Aqua Ring": "アクアリング",
　"Spacial Rend": "あくうせつだん",
　"Collision Course": "アクセルブレイク",
　"Accelerock": "アクセルロック",
　"Dark Pulse": "あくのはどう",
　"Yawn": "あくび",
　"Lovely Kiss": "あくまのキッス",
　"Nightmare": "あくむ",
　"Acrobatics": "アクロバット",
　"Morning Sun": "あさのひざし",
　"Gear Up": "アシストギア",
　"Stored Power": "アシストパワー",
　"Acid Downpour": "アシッドポイズンデリート",
　"Acid Spray": "アシッドボム",
　"Astral Barrage": "アストラルビット",
　"Vital Throw": "あてみなげ",
　"Dig": "あなをほる",
　"Thrash": "あばれる",
　"Head Charge": "アフロブレイク",
　"Sweet Scent": "あまいかおり",
　"Charm": "あまえる",
　"Armor Cannon": "アーマーキャノン",
　"Rain Dance": "あまごい",
　"Hammer Arm": "アームハンマー",
　"Ominous Wind": "あやしいかぜ",
　"Confuse Ray": "あやしいひかり",
　"Hail": "あられ",
　"Devastating Drake": "アルティメットドラゴンバーン",
　"Aromatherapy": "アロマセラピー",
　"Aromatic Mist": "アロマミスト",
　"Bubble": "あわ",
　"Anchor Shot": "アンカーショット",
　"Wicked Blow": "あんこくきょうだ",
　"Encore": "アンコール",
　"Cut": "いあいぎり",
　"Gastro Acid": "いえき",
　"Foul Play": "イカサマ",
　"Rage": "いかり",
　"Rage Powder": "いかりのこな",
　"Super Fang": "いかりのまえば",
　"Bouncy Bubble": "いきいきバブル",
　"Hyperspace Hole": "いじげんホール",
　"Hyperspace Fury": "いじげんラッシュ",
　"Pain Split": "いたみわけ",
　"Torment": "いちゃもん",
　"Order Up": "いっちょうあがり",
　"Freezing Glare": "いてつくしせん",
　"String Shot": "いとをはく",
　"Electro Drift": "イナズマドライブ",
　"Relic Song": "いにしえのうた",
　"Final Gambit": "いのちがけ",
　"Life Dew": "いのちのしずく",
　"Swagger": "いばる",
　"Snore": "いびき",
　"Heal Bell": "いやしのすず",
　"Healing Wish": "いやしのねがい",
　"Heal Pulse": "いやしのはどう",
　"Screech": "いやなおと",
　"Rock Throw": "いわおとし",
　"Rock Smash": "いわくだき",
　"Rock Slide": "いわなだれ",
　"Close Combat": "インファイト",
　"Weather Ball": "ウェザーボール",
　"Wave Crash": "ウェーブタックル",
　"Whirlpool": "うずしお",
　"Fake Tears": "うそなき",
　"Sing": "うたう",
　"Sparkling Aria": "うたかたのアリア",
　"Smack Down": "うちおとす",
　"Doodle": "うつしえ",
　"Wood Hammer": "ウッドハンマー",
　"Horn Leech": "ウッドホーン",
　"Lash Out": "うっぷんばらし",
　"Spite": "うらみ",
　"Bitter Malice": "うらみつらみ",
　"Breakneck Blitz": "ウルトラダッシュアタック",
　"Air Cutter": "エアカッター",
　"Air Slash": "エアスラッシュ",
　"Aeroblast": "エアロブラスト",
　"Echoed Voice": "エコーボイス",
　"Branch Poke": "えだづき",
　"Energy Ball": "エナジーボール",
　"Fishious Rend": "エラがみ",
　"Electroweb": "エレキネット",
　"Electric Terrain": "エレキフィールド",
　"Electro Ball": "エレキボール",
　"Smokescreen": "えんまく",
　"Pursuit": "おいうち",
　"Tailwind": "おいかぜ",
　"Celebrate": "おいわい",
　"Double Slap": "おうふくビンタ",
　"Mirror Move": "オウムがえし",
　"Tidy Up": "おかたづけ",
　"Memento": "おきみやげ",
　"Octazooka": "オクタンほう",
　"After You": "おさきにどうぞ",
　"Punishment": "おしおき",
　"Chatter": "おしゃべり",
　"Noble Roar": "おたけび",
　"Flatter": "おだてる",
　"Teatime": "おちゃかい",
　"Astonish": "おどろかす",
　"Will-O-Wisp": "おにび",
　"Last Respects": "おはかまいり",
　"Overdrive": "オーバードライブ",
　"Overheat": "オーバーヒート",
　"Lucky Chant": "おまじない",
　"Esper Wing": "オーラウイング",
　"Aura Wheel": "オーラぐるま",
　"Genesis Supernova": "オリジンズスーパーノヴァ",
　"Aurora Beam": "オーロラビーム",
　"Aurora Veil": "オーロラベール",
　"Return": "おんがえし",
　"Grudge": "おんねん",
　"Eerie Impulse": "かいでんぱ",
　"Heal Order": "かいふくしれい",
　"Heal Block": "かいふくふうじ",
　"Strength": "かいりき",
　"Counter": "カウンター",
　"Flame Wheel": "かえんぐるま",
　"Searing Shot": "かえんだん",
　"Flamethrower": "かえんほうしゃ",
　"Pyro Ball": "かえんボール",
　"Axe Kick": "かかとおとし",
　"Odor Sleuth": "かぎわける",
　"Sharpen": "かくばる",
　"Shadow Sneak": "かげうち",
　"Spirit Shackle": "かげぬい",
　"Double Team": "かげぶんしん",
　"Gust": "かぜおこし",
　"Retaliate": "かたきうち",
　"Harden": "かたくなる",
　"Ruination": "カタストロフィ",
　"Guardian of Alola": "ガーディアン・デ・アローラ",
　"Guard Split": "ガードシェア",
　"Guard Swap": "ガードスワップ",
　"Disable": "かなしばり",
　"Pollen Puff": "かふんだんご",
　"Razor Wind": "かまいたち",
　"Bide": "がまん",
　"Crunch": "かみくだく",
　"Bite": "かみつく",
　"Thunder": "かみなり",
　"Wildbolt Storm": "かみなりあらし",
　"Thunder Fang": "かみなりのキバ",
　"Thunder Punch": "かみなりパンチ",
　"Endeavor": "がむしゃら",
　"Facade": "からげんき",
　"Karate Chop": "からてチョップ",
　"Clamp": "からではさむ",
　"Withdraw": "からにこもる",
　"Constrict": "からみつく",
　"Shell Smash": "からをやぶる",
　"Dragon Ascent": "ガリョウテンセイ",
　"Brick Break": "かわらわり",
　"Stone Axe": "がんせきアックス",
　"Rock Tomb": "がんせきふうじ",
　"Rock Wrecker": "がんせきほう",
　"Focus Blast": "きあいだま",
　"Focus Energy": "きあいだめ",
　"Focus Punch": "きあいパンチ",
　"Gear Grind": "ギアソーサー",
　"Shift Gear": "ギアチェンジ",
　"Giga Impact": "ギガインパクト",
　"Giga Drain": "ギガドレイン",
　"Reversal": "きしかいせい",
　"Smelling Salts": "きつけ",
　"Spore": "キノコのほうし",
　"Bestow": "ギフトパス",
　"Leech Life": "きゅうけつ",
　"Glaive Rush": "きょけんとつげき",
　"Behemoth Blade": "きょじゅうざん",
　"Behemoth Bash": "きょじゅうだん",
　"G-Max One Blow": "キョダイイチゲキ",
　"G-Max Fireball": "キョダイカキュウ",
　"G-Max Stonesurge": "キョダイガンジン",
　"G-Max Stun Shock": "キョダイカンデン",
　"G-Max Sweetness": "キョダイカンロ",
　"G-Max Terror": "キョダイゲンエイ",
　"G-Max Depletion": "キョダイゲンスイ",
　"G-Max Steelsurge": "キョダイコウジン",
　"G-Max Wildfire": "キョダイゴクエン",
　"G-Max Gold Rush": "キョダイコバン",
　"G-Max Drum Solo": "キョダイコランダ",
　"G-Max Befuddle": "キョダイコワク",
　"G-Max Replenish": "キョダイサイセイ",
　"G-Max Sandblast": "キョダイサジン",
　"G-Max Tartness": "キョダイサンゲキ",
　"G-Max Malodor": "キョダイシュウキ",
　"G-Max Chi Strike": "キョダイシンゲキ",
　"G-Max Snooze": "キョダイスイマ",
　"G-Max Resonance": "キョダイセンリツ",
　"G-Max Hydrosnipe": "キョダイソゲキ",
　"G-Max Finale": "キョダイダンエン",
　"G-Max Gravitas": "キョダイテンドウ",
　"G-Max Smite": "キョダイテンバツ",
　"G-Max Volt Crash": "キョダイバンライ",
　"G-Max Centiferno": "キョダイヒャッカ",
　"G-Max Wind Rage": "キョダイフウゲキ",
　"G-Max Volcalith": "キョダイフンセキ",
　"G-Max Vine Lash": "キョダイベンタツ",
　"G-Max Cannonade": "キョダイホウゲキ",
　"G-Max Foam Burst": "キョダイホウマツ",
　"G-Max Cuddle": "キョダイホーヨー",
　"G-Max Meltdown": "キョダイユウゲキ",
　"G-Max Rapid Flow": "キョダイレンゲキ",
　"Sparkly Swirl": "きらきらストーム",
　"Mortal Spin": "キラースピン",
　"Slash": "きりさく",
　"Defog": "きりばらい",
　"Trump Card": "きりふだ",
　"Silver Wind": "ぎんいろのかぜ",
　"King's Shield": "キングシールド",
　"Metal Sound": "きんぞくおん",
　"Flip Turn": "クイックターン",
　"Grass Pledge": "くさのちかい",
　"Grass Whistle": "くさぶえ",
　"Grass Knot": "くさむすび",
　"Trailblaze": "くさわけ",
　"Tickle": "くすぐる",
　"Beak Blast": "くちばしキャノン",
　"Spider Web": "クモのす",
　"Jaw Lock": "くらいつく",
　"Grassy Glide": "グラススライダー",
　"Grassy Terrain": "グラスフィールド",
　"Leaf Tornado": "グラスミキサー",
　"Crabhammer": "クラブハンマー",
　"Land's Wrath": "グランドフォース",
　"Clear Smog": "クリアスモッグ",
　"Haze": "くろいきり",
　"Mean Look": "くろいまなざし",
　"Power-Up Punch": "グロウパンチ",
　"Fusion Bolt": "クロスサンダー",
　"Cross Chop": "クロスチョップ",
　"Fusion Flare": "クロスフレイム",
　"Cross Poison": "クロスポイズン",
　"Chloroblast": "クロロブラスト",
　"Outrage": "げきりん",
　"Low Kick": "けたぐり",
　"Belch": "ゲップ",
　"Ancient Power": "げんしのちから",
　"Core Enforcer": "コアパニッシャー",
　"Attack Order": "こうげきしれい",
　"Synthesis": "こうごうせい",
　"Agility": "こうそくいどう",
　"Rapid Spin": "こうそくスピン",
　"Frost Breath": "こおりのいぶき",
　"Ice Fang": "こおりのキバ",
　"Ice Shard": "こおりのつぶて",
　"Bleakwind Storm": "こがらしあらし",
　"Icy Wind": "こごえるかぜ",
　"Glaciate": "こごえるせかい",
　"Mind Reader": "こころのめ",
　"Phantom Force": "ゴーストダイブ",
　"Cosmic Power": "コスモパワー",
　"Freezy Frost": "こちこちフロスト",
　"Coaching": "コーチング",
　"Sky Attack": "ゴッドバード",
　"Cotton Guard": "コットンガード",
　"Court Change": "コートチェンジ",
　"Powder Snow": "こなゆき",
　"Leafage": "このは",
　"Follow Me": "このゆびとまれ",
　"Meteor Mash": "コメットパンチ",
　"Endure": "こらえる",
　"Ice Burn": "コールドフレア",
　"Make It Rain": "ゴールドラッシュ",
　"Rollout": "ころがる",
　"Scary Face": "こわいかお",
　"Origin Pulse": "こんげんのはどう",
　"Revival Blessing": "さいきのいのり",
　"Psybeam": "サイケこうせん",
　"Psywave": "サイコウェーブ",
　"Psycho Cut": "サイコカッター",
　"Psychic": "サイコキネシス",
　"Psycho Shift": "サイコシフト",
　"Psyshock": "サイコショック",
　"Psychic Fangs": "サイコファング",
　"Psychic Terrain": "サイコフィールド",
　"Psycho Boost": "サイコブースト",
　"Psystrike": "サイコブレイク",
　"Ally Switch": "サイドチェンジ",
　"Instruct": "さいはい",
　"Hypnosis": "さいみんじゅつ",
　"Thousand Arrows": "サウザンアロー",
　"Thousand Waves": "サウザンウェーブ",
　"Quash": "さきおくり",
　"Me First": "さきどり",
　"Embargo": "さしおさえ",
　"Judgment": "さばきのつぶて",
　"Splishy Splash": "ざぶざぶサーフ",
　"Chilly Reception": "さむいギャグ",
　"Uproar": "さわぐ",
　"Searing Sunraze Smash": "サンシャインスマッシャー",
　"Thunder Cage": "サンダープリズン",
　"Jet Punch": "ジェットパンチ",
　"Shell Side Arm": "シェルアームズ",
　"Razor Shell": "シェルブレード",
　"Geomancy": "ジオコントロール",
　"Salt Cure": "しおづけ",
　"Water Spout": "しおふき",
　"Brine": "しおみず",
　"Signal Beam": "シグナルビーム",
　"Psych Up": "じこあんじ",
　"Submission": "じごくぐるま",
　"Throat Chop": "じごくづき",
　"Recover": "じこさいせい",
　"X-Scissor": "シザークロス",
　"Earthquake": "じしん",
　"Nature's Madness": "しぜんのいかり",
　"Nature Power": "しぜんのちから",
　"Natural Gift": "しぜんのめぐみ",
　"Lick": "したでなめる",
　"Flail": "じたばた",
　"Stomping Tantrum": "じだんだ",
　"Soul-Stealing 7-Star Strike": "しちせいだっこんたい",
　"Burning Jealousy": "しっとのほのお",
　"Payback": "しっぺがえし",
　"Shed Tail": "しっぽきり",
　"Tail Whip": "しっぽをふる",
　"Seed Flare": "シードフレア",
　"Bulldoze": "じならし",
　"Zen Headbutt": "しねんのずつき",
　"Self-Destruct": "じばく",
　"Magnetic Flux": "じばそうさ",
　"Stun Spore": "しびれごな",
　"Wring Out": "しぼりとる",
　"Bind": "しめつける",
　"Gyro Ball": "ジャイロボール",
　"Sinister Arrow Raid": "シャドーアローズストライク",
　"Shadow Claw": "シャドークロー",
　"Spectral Thief": "シャドースチール",
　"Shadow Force": "シャドーダイブ",
　"Shadow Punch": "シャドーパンチ",
　"Shadow Ball": "シャドーボール",
　"Shadow Bone": "シャドーボーン",
　"Moongeist Beam": "シャドーレイ",
　"Play Rough": "じゃれつく",
　"Jungle Healing": "ジャングルヒール",
　"Charge": "じゅうでん",
　"Gravity": "じゅうりょく",
　"Purify": "じょうか",
　"Victory Dance": "しょうりのまい",
　"Mist": "しろいきり",
　"Fissure": "じわれ",
　"Vacuum Wave": "しんくうは",
　"Synchronoise": "シンクロノイズ",
　"Extreme Speed": "しんそく",
　"Extrasensory": "じんつうりき",
　"Mystical Power": "しんぴのちから",
　"Secret Sword": "しんぴのつるぎ",
　"Safeguard": "しんぴのまもり",
　"Simple Beam": "シンプルビーム",
　"Absorb": "すいとる",
　"Tail Slap": "スイープビンタ",
　"Surging Strikes": "すいりゅうれんだ",
　"Sky Uppercut": "スカイアッパー",
　"Skill Swap": "スキルスワップ",
　"Sappy Seed": "すくすくボンバー",
　"Scale Shot": "スケイルショット",
　"Clanging Scales": "スケイルノイズ",
　"Sketch": "スケッチ",
　"Meteor Assault": "スターアサルト",
　"Steam Eruption": "スチームバースト",
　"Headbutt": "ずつき",
　"Parting Shot": "すてゼリフ",
　"Double-Edge": "すてみタックル",
　"Stealth Rock": "ステルスロック",
　"Stone Edge": "ストーンエッジ",
　"Shore Up": "すなあつめ",
　"Sandstorm": "すなあらし",
　"Sand Attack": "すなかけ",
　"Sand Tomb": "すなじごく",
　"Hydro Vortex": "スーパーアクアトルネード",
　"Gigavolt Havoc": "スパーキングギガボルト",
　"Spark": "スパーク",
　"Swift": "スピードスター",
　"Speed Swap": "スピードスワップ",
　"Kinesis": "スプーンまげ",
　"Spotlight": "スポットライト",
　"Smart Strike": "スマートホーン",
　"Smog": "スモッグ",
　"Switcheroo": "すりかえ",
　"Silk Trap": "スレッドトラップ",
　"Growth": "せいちょう",
　"Sacred Sword": "せいなるつるぎ",
　"Sacred Fire": "せいなるほのお",
　"Savage Spin-Out": "ぜったいほしょくかいてんざん",
　"Sheer Cold": "ぜったいれいど",
　"All-Out Pummeling": "ぜんりょくむそうげきれつけん",
　"Electrify": "そうでん",
　"Spirit Break": "ソウルクラッシュ",
　"Clangorous Soul": "ソウルビート",
　"Sonic Boom": "ソニックブーム",
　"Solar Beam": "ソーラービーム",
　"Solar Blade": "ソーラーブレード",
　"Fly": "そらをとぶ",
　"Max Hailstorm": "ダイアイス",
　"Max Darkness": "ダイアーク",
　"Max Ooze": "ダイアシッド",
　"Max Quake": "ダイアース",
　"Max Strike": "ダイアタック",
　"Tackle": "たいあたり",
　"Max Guard": "ダイウォール",
　"Max Mindstorm": "ダイサイコ",
　"Max Lightning": "ダイサンダー",
　"Max Airstream": "ダイジェット",
　"Max Steelspike": "ダイスチル",
　"Max Geyser": "ダイストリーム",
　"Max Overgrowth": "ダイソウゲン",
　"Earth Power": "だいちのちから",
　"Terrain Pulse": "だいちのはどう",
　"Max Wyrmwind": "ダイドラグーン",
　"Max Knuckle": "ダイナックル",
　"Inferno Overdrive": "ダイナミックフルフレイム",
　"Explosion": "だいばくはつ",
　"Max Flare": "ダイバーン",
　"Dive": "ダイビング",
　"Max Starfall": "ダイフェアリー",
　"Raging Fury": "だいふんげき",
　"Max Phantasm": "ダイホロウ",
　"Dynamax Cannon": "ダイマックスほう",
　"Fire Blast": "だいもんじ",
　"Diamond Storm": "ダイヤストーム",
　"Max Rockfall": "ダイロック",
　"Max Flutterby": "ダイワーム",
　"Rototiller": "たがやす",
　"Waterfall": "たきのぼり",
　"Wicked Torque": "ダークアクセル",
　"Dark Void": "ダークホール",
　"Muddy Water": "だくりゅう",
　"Stockpile": "たくわえる",
　"Octolock": "たこがため",
　"Gunk Shot": "ダストシュート",
　"Slam": "たたきつける",
　"Mat Block": "たたみがえし",
　"Hex": "たたりめ",
　"Twister": "たつまき",
　"Shelter": "たてこもる",
　"Seed Bomb": "タネばくだん",
　"Bullet Seed": "タネマシンガン",
　"Double Hit": "ダブルアタック",
　"Dual Wingbeat": "ダブルウイング",
　"Dual Chop": "ダブルチョップ",
　"Twineedle": "ダブルニードル",
　"Double Iron Bash": "ダブルパンツァー",
　"Soft-Boiled": "タマゴうみ",
　"Egg Bomb": "タマゴばくだん",
　"Feint Attack": "だましうち",
　"Barrage": "たまなげ",
　"Assurance": "ダメおし",
　"Tar Shot": "タールショット",
　"Precipice Blades": "だんがいのつるぎ",
　"Minimize": "ちいさくなる",
　"Strength Sap": "ちからをすいとる",
　"Seismic Toss": "ちきゅうなげ",
　"Charge Beam": "チャージビーム",
　"Disarming Voice": "チャームボイス",
　"Supersonic": "ちょうおんぱ",
　"Corkscrew Crash": "ちょうぜつらせんれんげき",
　"Quiver Dance": "ちょうのまい",
　"Taunt": "ちょうはつ",
　"Pluck": "ついばむ",
　"Twin Beam": "ツインビーム",
　"Moonlight": "つきのひかり",
　"Power Trip": "つけあがる",
　"Night Slash": "つじぎり",
　"Peck": "つつく",
　"Arm Thrust": "つっぱり",
　"Horn Attack": "つのでつく",
　"Horn Drill": "つのドリル",
　"Wing Attack": "つばさでうつ",
　"Aerial Ace": "つばめがえし",
　"Baby-Doll Eyes": "つぶらなひとみ",
　"Acupressure": "つぼをつく",
　"Hone Claws": "つめとぎ",
　"Icicle Crash": "つららおとし",
　"Icicle Spear": "つららばり",
　"Swords Dance": "つるぎのまい",
　"Vine Whip": "つるのムチ",
　"First Impression": "であいがしら",
　"Hold Back": "てかげん",
　"Gigaton Hammer": "デカハンマー",
　"Conversion": "テクスチャー",
　"Conversion 2": "テクスチャー2",
　"Techno Blast": "テクノバスター",
　"Decorate": "デコレーション",
　"Oblivion Wing": "デスウイング",
　"Helping Hand": "てだすけ",
　"Steel Beam": "てっていこうせん",
　"Iron Defense": "てっぺき",
　"Tera Blast": "テラバースト",
　"Telekinesis": "テレキネシス",
　"Teleport": "テレポート",
　"Hold Hands": "てをつなぐ",
　"Thunder Shock": "でんきショック",
　"Bolt Beak": "でんげきくちばし",
　"Shock Wave": "でんげきは",
　"Quick Attack": "でんこうせっか",
　"Double Shock": "でんこうそうげき",
　"Light That Burns the Sky": "てんこがすめつぼうのひかり",
　"Sweet Kiss": "てんしのキッス",
　"Thunder Wave": "でんじは",
　"Magnet Rise": "でんじふゆう",
　"Zap Cannon": "でんじほう",
　"Block": "とおせんぼう",
　"Howl": "とおぼえ",
　"Laser Focus": "とぎすます",
　"Roar of Time": "ときのほうこう",
　"Poison Gas": "どくガス",
　"Poison Jab": "どくづき",
　"Toxic": "どくどく",
　"Poison Fang": "どくどくのキバ",
　"Toxic Thread": "どくのいと",
　"Poison Powder": "どくのこな",
　"Poison Sting": "どくばり",
　"Barb Barrage": "どくばりセンボン",
　"Toxic Spikes": "どくびし",
　"Coil": "とぐろをまく",
　"Spike Cannon": "とげキャノン",
　"False Surrender": "どげざつき",
　"Kowtow Cleave": "ドゲザン",
　"Acid Armor": "とける",
　"Baneful Bunker": "トーチカ",
　"Take Down": "とっしん",
　"Last Resort": "とっておき",
　"Fell Stinger": "とどめばり",
　"Glitzy Glow": "どばどばオーラ",
　"Lunge": "とびかかる",
　"Jump Kick": "とびげり",
　"Pounce": "とびつく",
　"Bounce": "とびはねる",
　"High Jump Kick": "とびひざげり",
　"Circle Throw": "ともえなげ",
　"Tri Attack": "トライアタック",
　"Dragon Darts": "ドラゴンアロー",
　"Dragon Energy": "ドラゴンエナジー",
　"Dragon Claw": "ドラゴンクロー",
　"Dragon Rush": "ドラゴンダイブ",
　"Dragon Tail": "ドラゴンテール",
　"Dragon Hammer": "ドラゴンハンマー",
　"Shell Trap": "トラップシェル",
　"Snap Trap": "トラバサミ",
　"Drum Beating": "ドラムアタック",
　"Trick": "トリック",
　"Crafty Shield": "トリックガード",
　"Flower Trick": "トリックフラワー",
　"Trick Room": "トリックルーム",
　"Triple Axel": "トリプルアクセル",
　"Triple Kick": "トリプルキック",
　"Triple Dive": "トリプルダイブ",
　"Drill Peck": "ドリルくちばし",
　"Drill Run": "ドリルライナー",
　"Draining Kiss": "ドレインキッス",
　"Drain Punch": "ドレインパンチ",
　"Mud Sport": "どろあそび",
　"Mud-Slap": "どろかけ",
　"Mud Bomb": "どろばくだん",
　"Trop Kick": "トロピカルキック",
　"Thief": "どろぼう",
　"Amnesia": "ドわすれ",
　"U-turn": "とんぼがえり",
　"Confide": "ないしょばなし",
　"Night Daze": "ナイトバースト",
　"Night Shade": "ナイトヘッド",
　"Extreme Evoboost": "ナインエボルブースト",
　"Entrainment": "なかまづくり",
　"Play Nice": "なかよくする",
　"Growl": "なきごえ",
　"Fling": "なげつける",
　"Chip Away": "なしくずし",
　"Slack Off": "なまける",
　"Tearful Look": "なみだめ",
　"Surf": "なみのり",
　"Worry Seed": "なやみのタネ",
　"Role Play": "なりきり",
　"Crush Grip": "にぎりつぶす",
　"Double Kick": "にどげり",
　"Needle Arm": "ニードルアーム",
　"Spiky Shield": "ニードルガード",
　"Flame Charge": "ニトロチャージ",
　"Sunny Day": "にほんばれ",
　"Leer": "にらみつける",
　"Wish": "ねがいごと",
　"Fake Out": "ねこだまし",
　"Sleep Talk": "ねごと",
　"Pay Day": "ネコにこばん",
　"Assist": "ねこのて",
　"Population Bomb": "ネズミざん",
　"Sandsear Storm": "ねっさのあらし",
　"Scorching Sands": "ねっさのだいち",
　"Scald": "ねっとう",
　"Heat Wave": "ねっぷう",
　"Sticky Web": "ねばねばネット",
　"Sleep Powder": "ねむりごな",
　"Rest": "ねむる",
　"Snipe Shot": "ねらいうち",
　"Ingrain": "ねをはる",
　"Confusion": "ねんりき",
　"Body Slam": "のしかかり",
　"Swallow": "のみこむ",
　"Curse": "のろい",
　"No Retreat": "はいすいのじん",
　"Hydro Cannon": "ハイドロカノン",
　"Hydro Pump": "ハイドロポンプ",
　"Malicious Moonsault": "ハイパーダーククラッシャー",
　"Hyper Drill": "ハイパードリル",
　"Hyper Voice": "ハイパーボイス",
　"Skitter Smack": "はいよるいちげき",
　"Hyper Beam": "はかいこうせん",
　"Superpower": "ばかぢから",
　"Steel Wing": "はがねのつばさ",
　"Spit Up": "はきだす",
　"Snarl": "バークアウト",
　"Boomburst": "ばくおんぱ",
　"Dynamic Punch": "ばくれつパンチ",
　"Guillotine": "ハサミギロチン",
　"Vise Grip": "はさむ",
　"Flame Burst": "はじけるほのお",
　"Knock Off": "はたきおとす",
　"Pound": "はたく",
　"Pound": "はたく",
　"Pound": "はたく",
　"Zippy Zap": "ばちばちアクセル",
　"Force Palm": "はっけい",
　"Razor Leaf": "はっぱカッター",
　"Happy Hour": "ハッピータイム",
　"Aura Sphere": "はどうだん",
　"Heart Stamp": "ハートスタンプ",
　"Heart Swap": "ハートスワップ",
　"Frenzy Plant": "ハードプラント",
　"Steamroller": "ハードローラー",
　"Baton Pass": "バトンタッチ",
　"Petal Dance": "はなびらのまい",
　"Petal Blizzard": "はなふぶき",
　"Roost": "はねやすめ",
　"Splash": "はねる",
　"Spicy Extract": "ハバネロエキス",
　"Bubble Beam": "バブルこうせん",
　"Doom Desire": "はめつのねがい",
　"Light of Ruin": "はめつのひかり",
　"Belly Drum": "はらだいこ",
　"Parabolic Charge": "パラボラチャージ",
　"Barrier": "バリアー",
　"Psyshield Bash": "バリアーラッシュ",
　"Springtide Storm": "はるのあらし",
　"Bullet Punch": "バレットパンチ",
　"Trick-or-Treat": "ハロウィン",
　"Power Whip": "パワーウィップ",
　"Power Split": "パワーシェア",
　"Power Gem": "パワージェム",
　"Power Shift": "パワーシフト",
　"Power Swap": "パワースワップ",
　"Power Trick": "パワートリック",
　"Blazing Torque": "バーンアクセル",
　"Pika Papow": "ピカピカサンダー",
　"Light Screen": "ひかりのかべ",
　"Ceaseless Edge": "ひけん・ちえなみ",
　"Scratch": "ひっかく",
　"Topsy-Turvy": "ひっくりかえす",
　"Mind Blown": "ビックリヘッド",
　"Catastropika": "ひっさつのピカチュート",
　"Hyper Fang": "ひっさつまえば",
　"Heat Crash": "ヒートスタンプ",
　"Ember": "ひのこ",
　"Secret Power": "ひみつのちから",
　"Infernal Parade": "ひゃっきやこう",
　"Chilling Water": "ひやみず",
　"Mountain Gale": "ひょうざんおろし",
　"Dizzy Punch": "ピヨピヨパンチ",
　"Buzzy Buzz": "びりびりエレキ",
　"Zing Zap": "びりびりちくちく",
　"Bulk Up": "ビルドアップ",
　"Combat Torque": "ファイトアクセル",
　"Supersonic Skystrike": "ファイナルダイブクラッシュ",
　"Quick Guard": "ファストガード",
　"Sucker Punch": "ふいうち",
　"Veevee Volley": "ブイブイブレイク",
　"Imprison": "ふういん",
　"Fairy Lock": "フェアリーロック",
　"Dire Claw": "フェイタルクロー",
　"Feint": "フェイント",
　"Feather Dance": "フェザーダンス",
　"Photon Geyser": "フォトンゲイザー",
　"Whirlwind": "ふきとばし",
　"Eerie Spell": "ぶきみなじゅもん",
　"Beat Up": "ふくろだたき",
　"Corrosive Gas": "ふしょくガス",
　"Headlong Rush": "ぶちかまし",
　"Blizzard": "ふぶき",
　"Stomp": "ふみつけ",
　"Flying Press": "フライングプレス",
　"Blast Burn": "ブラストバーン",
　"Ion Deluge": "プラズマシャワー",
　"Plasma Fists": "プラズマフィスト",
　"Black Hole Eclipse": "ブラックホールイクリプス",
　"Flash": "フラッシュ",
　"Teeter Dance": "フラフラダンス",
　"Flower Shield": "フラワーガード",
　"Floral Healing": "フラワーヒール",
　"Glacial Lance": "ブリザードランス",
　"Freeze-Dry": "フリーズドライ",
　"Freeze Shock": "フリーズボルト",
　"Prismatic Laser": "プリズムレーザー",
　"Sky Drop": "フリーフォール",
　"Work Up": "ふるいたてる",
　"Bloom Doom": "ブルームシャインエクストラ",
　"Fleur Cannon": "フルールカノン",
　"Torch Song": "フレアソング",
　"Flare Blitz": "フレアドライブ",
　"Crush Claw": "ブレイククロー",
　"Clangorous Soulblaze": "ブレイジングソウルビート",
　"Blaze Kick": "ブレイズキック",
　"Take Heart": "ブレイブチャージ",
　"Brave Bird": "ブレイブバード",
　"Present": "プレゼント",
　"Obstruct": "ブロッキング",
　"Floaty Fall": "ふわふわフォール",
　"Lava Plume": "ふんえん",
　"Eruption": "ふんか",
　"Powder": "ふんじん",
　"Rage Fist": "ふんどのこぶし",
　"Brutal Swing": "ぶんまわす",
　"Sludge Wave": "ヘドロウェーブ",
　"Sludge": "ヘドロこうげき",
　"Sludge Bomb": "ヘドロばくだん",
　"Venoshock": "ベノムショック",
　"Venom Drench": "ベノムトラップ",
　"Glare": "へびにらみ",
　"Heavy Slam": "ヘビーボンバー",
　"Transform": "へんしん",
　"Noxious Torque": "ポイズンアクセル",
　"Poison Tail": "ポイズンテール",
　"Spin Out": "ホイールスピン",
　"Defend Order": "ぼうぎょしれい",
　"Discharge": "ほうでん",
　"Hurricane": "ぼうふう",
　"Comeuppance": "ほうふく",
　"Roar": "ほえる",
　"Stuff Cheeks": "ほおばる",
　"Let's Snuggle Forever": "ぽかぼかフレンドタイム",
　"Camouflage": "ほごしょく",
　"Covet": "ほしがる",
　"Tail Glow": "ほたるび",
　"Nuzzle": "ほっぺすりすり",
　"Autotomize": "ボディパージ",
　"Body Press": "ボディプレス",
　"Bone Club": "ホネこんぼう",
　"Bonemerang": "ホネブーメラン",
　"Fire Spin": "ほのおのうず",
　"Fire Fang": "ほのおのキバ",
　"Fire Pledge": "ほのおのちかい",
　"Fire Punch": "ほのおのパンチ",
　"Fiery Dance": "ほのおのまい",
　"Fire Lash": "ほのおのムチ",
　"Poltergeist": "ポルターガイスト",
　"Volt Tackle": "ボルテッカー",
　"Volt Switch": "ボルトチェンジ",
　"Perish Song": "ほろびのうた",
　"Pulverizing Pancake": "ほんきをだす こうげき",
　"Bone Rush": "ボーンラッシュ",
　"Shattered Psyche": "マキシマムサイブレイカー",
　"Wrap": "まきつく",
　"Spikes": "まきびし",
　"Magnitude": "マグニチュード",
　"Magnet Bomb": "マグネットボム",
　"Magma Storm": "マグマストーム",
　"Magical Torque": "マジカルアクセル",
　"Dazzling Gleam": "マジカルシャイン",
　"Mystical Fire": "マジカルフレイム",
　"Magical Leaf": "マジカルリーフ",
　"Magic Coat": "マジックコート",
　"Magic Room": "マジックルーム",
　"Mud Shot": "マッドショット",
　"Mach Punch": "マッハパンチ",
　"Infestation": "まとわりつく",
　"Copycat": "まねっこ",
　"Magic Powder": "まほうのこな",
　"Protect": "まもる",
　"Defense Curl": "まるくなる",
　"Multi-Attack": "マルチアタック",
　"Rolling Kick": "まわしげり",
　"Lunar Blessing": "みかづきのいのり",
　"Lunar Dance": "みかづきのまい",
　"Substitute": "みがわり",
　"Detect": "みきり",
　"Pin Missile": "ミサイルばり",
　"Water Sport": "みずあそび",
　"Water Shuriken": "みずしゅりけん",
　"Water Gun": "みずでっぽう",
　"Misty Explosion": "ミストバースト",
　"Misty Terrain": "ミストフィールド",
　"Mist Ball": "ミストボール",
　"Water Pledge": "みずのちかい",
　"Water Pulse": "みずのはどう",
　"Soak": "みずびたし",
　"Fury Attack": "みだれづき",
　"Fury Swipes": "みだれひっかき",
　"Destiny Bond": "みちづれ",
　"False Swipe": "みねうち",
　"Foresight": "みやぶる",
　"Future Sight": "みらいよち",
　"Miracle Eye": "ミラクルアイ",
　"Mirror Coat": "ミラーコート",
　"Mirror Shot": "ミラーショット",
　"Reflect Type": "ミラータイプ",
　"Milk Drink": "ミルクのみ",
　"Fillet Away": "みをけずる",
　"Never-Ending Nightmare": "むげんあんやへのいざない",
　"Eternabeam": "ムゲンダイビーム",
　"Bug Bite": "むしくい",
　"Bug Buzz": "むしのさざめき",
　"Struggle Bug": "むしのていこう",
　"Bitter Blade": "むねんのつるぎ",
　"Moonblast": "ムーンフォース",
　"Menacing Moonraze Maelstrom": "ムーンライトブラスター",
　"Calm Mind": "めいそう",
　"Mega Drain": "メガドレイン",
　"Mega Kick": "メガトンキック",
　"Mega Punch": "メガトンパンチ",
　"Megahorn": "メガホーン",
　"Wake-Up Slap": "めざましビンタ",
　"Revelation Dance": "めざめるダンス",
　"Hidden Power": "めざめるパワー",
　"Metal Claw": "メタルクロー",
　"Metal Burst": "メタルバースト",
　"Sunsteel Strike": "メテオドライブ",
　"Meteor Beam": "メテオビーム",
　"Sizzly Slide": "めらめらバーン",
　"Attract": "メロメロ",
　"Fiery Wrath": "もえあがるいかり",
　"Burn Up": "もえつきる",
　"Mimic": "ものまね",
　"Forest's Curse": "もりののろい",
　"Head Smash": "もろはのずつき",
　"Incinerate": "やきつくす",
　"Frustration": "やつあたり",
　"Leech Seed": "やどりぎのタネ",
　"Storm Throw": "やまあらし",
　"Captivate": "ゆうわく",
　"Snowscape": "ゆきげしき",
　"Avalanche": "ゆきなだれ",
　"Metronome": "ゆびをふる",
　"Dream Eater": "ゆめくい",
　"Acid": "ようかいえき",
　"Fairy Wind": "ようせいのかぜ",
　"Meditate": "ヨガのポーズ",
　"Snatch": "よこどり",
　"Bolt Strike": "らいげき",
　"Rising Voltage": "ライジングボルト",
　"Tectonic Rage": "ライジングランドオーバー",
　"Stoked Sparksurfer": "ライトニングサーフライド",
　"Thunderous Kick": "らいめいげり",
　"Splintered Stormshards": "ラジアルエッジストーム",
　"Flash Cannon": "ラスターカノン",
　"Luster Purge": "ラスターパージ",
　"Twinkle Tackle": "ラブリースターインパクト",
　"Recycle": "リサイクル",
　"Leaf Storm": "リーフストーム",
　"Leaf Blade": "リーフブレード",
　"Reflect": "リフレクター",
　"Refresh": "リフレッシュ",
　"Revenge": "リベンジ",
　"Draco Meteor": "りゅうせいぐん",
　"Dragon Rage": "りゅうのいかり",
　"Dragon Breath": "りゅうのいぶき",
　"Dragon Pulse": "りゅうのはどう",
　"Dragon Dance": "りゅうのまい",
　"Apple Acid": "りんごさん",
　"Round": "りんしょう",
　"Lumina Crash": "ルミナコリジョン",
　"Subzero Slammer": "レイジングジオフリーズ",
　"Raging Bull": "レイジングブル",
　"Ice Punch": "れいとうパンチ",
　"Ice Beam": "れいとうビーム",
　"Inferno": "れんごく",
　"Fury Cutter": "れんぞくぎり",
　"Comet Punch": "れんぞくパンチ",
　"Low Sweep": "ローキック",
　"Skull Bash": "ロケットずつき",
　"Lock-On": "ロックオン",
　"Rock Polish": "ロックカット",
　"Rock Climb": "ロッククライム",
　"Rock Blast": "ロックブラスト",
　"Wide Guard": "ワイドガード",
　"Expanding Force": "ワイドフォース",
　"Breaking Swipe": "ワイドブレイカー",
　"Wild Charge": "ワイルドボルト",
　"Oceanic Operetta": "わだつみのシンフォニア",
　"Cotton Spore": "わたほうし",
　"Struggle": "わるあがき",
　"Continental Crush": "ワールズエンドフォール",
　"Nasty Plot": "わるだくみ",
　"Baddy Bad": "わるわるゾーン",
　"Strange Steam": "ワンダースチーム",
　"Wonder Room": "ワンダールーム",

	// ⦿アイテム
	//;

	"Ability Capsule": "とくせいカプセル",
	"Absorb Bulb": "きゅうこん",
	"Adamant Mint": "いじっぱりミント",
	"Adventure Guide": "たんけんこころえ",
	"Amulet Coin": "おまもりこばん",
	"Antidote": "どくけし",
	"Assault Vest": "とつげきチョッキ",
	"Awakening": "ねむけざまし",
	"Balm Mushroom": "かおるキノコ",
	"Big Mushroom": "おおきなキノコ",
	"Big Nugget": "でかいきんのたま",
	"Big Pearl": "おおきなしんじゅ",
	"Big Root": "おおきなねっこ",
	"Binding Band": "しめつけバンド",
	"Black Belt": "くろおび",
	"Black Glasses": "くろいメガネ",
	"Black Sludge": "くろいヘドロ",
	"Blunder Policy": "からぶりほけん",
	"Bold Mint": "ずぶといミント",
	"Bottle Cap": "ぎんのおうかん",
	"Brave Mint": "ゆうかんミント",
	"Bright Powder": "ひかりのこな",
	"Burn Drive": "ブレイズカセット",
	"Burn Heal": "やけどなおし",
	"Calcium": "リゾチウム",
	"Calm Mint": "おだやかミント",
	"Camping Gear": "キャンプセット",
	"Carbos": "インドメタシン",
	"Careful Mint": "しんちょうミント",
	"Casteliacone": "ヒウンアイス",
	"Catching Charm": "ゆれないおまもり",
	"Cell Battery": "じゅうでんち",
	"Charcoal": "もくたん",
	"Chill Drive": "フリーズカセット",
	"Chipped Pot": "かけたポット",
	"Choice Band": "こだわりハチマキ",
	"Choice Scarf": "こだわりスカーフ",
	"Choice Specs": "こだわりメガネ",
	"Cleanse Tag": "きよめのおふだ",
	"Clever Feather": "せいしんのハネ",
	"Clover Sweet": "よつばアメざいく",
	"Comet Shard": "すいせいのかけら",
	"Cracked Pot": "われたポット",
	"Damp Rock": "しめったいわ",
	"Dawn Stone": "めざめいし",
	"Destiny Knot": "あかいいと",
	"Dire Hit": "クリティカット",
	"Douse Drive": "アクアカセット",
	"Dragon Fang": "りゅうのキバ",
	"Dragon Scale": "りゅうのウロコ",
	"Dusk Stone": "やみのいし",
	"Dynamax Band": "ダイマックスB",
	"Dynamax Candy": "ダイマックスアメ",
	"Eject Button": "だっしゅつボタン",
	"Eject Pack": "だっしゅつパック",
	"Electric Seed": "エレキシード",
	"Elixir": "ピーピーエイダー",
	"Endorsement": "すいせんじょう",
	"Energy Powder": "ちからのこな",
	"Energy Root": "ちからのねっこ",
	"Escape Rope": "あなぬけのヒモ",
	"Ether": "ピーピーエイド",
	"Everstone": "かわらずのいし",
	"Eviolite": "しんかのきせき",
	"Exp. Candy L": "けいけんアメL",
	"Exp. Candy M": "けいけんアメM",
	"Exp. Candy S": "けいけんアメS",
	"Exp. Candy XL": "けいけんアメXL",
	"Exp. Candy XS": "けいけんアメXS",
	"Expert Belt": "たつじんのおび",
	"Fire Stone": "ほのおのいし",
	"Fishing Rod": "つりざお",
	"Fishing Rod": "つりざお",
	"Float Stone": "かるいし",
	"Flower Sweet": "おはなアメざいく",
	"Focus Band": "きあいのハチマキ",
	"Focus Sash": "きあいのタスキ",
	"Fossilized Bird": "カセキのトリ",
	"Fossilized Dino": "カセキのクビナガ",
	"Fossilized Drake": "カセキのリュウ",
	"Fossilized Fish": "カセキのサカナ",
	"Fresh Water": "おいしいみず",
	"Full Heal": "なんでもなおし",
	"Full Incense": "まんぷくおこう",
	"Full Restore": "かいふくのくすり",
	"Genius Feather": "ちりょくのハネ",
	"Gentle Mint": "おとなしいミント",
	"Gold Bottle Cap": "きんのおうかん",
	"Grassy Seed": "グラスシード",
	"Grip Claw": "ねばりのかぎづめ",
	"Guard Spec.": "エフェクトガード",
	"Hard Stone": "かたいいし",
	"Hasty Mint": "せっかちミント",
	"Heal Powder": "ばんのうごな",
	"Health Feather": "たいりょくのハネ",
	"Heat Rock": "あついいわ",
	"Heavy-Duty Boots": "あつぞこブーツ",
	"Hi-tech Earbuds": "すごいみみせん",
	"Honey": "あまいミツ",
	"HP Up": "マックスアップ",
	"Hyper Potion": "すごいキズぐすり",
	"Ice Heal": "こおりなおし",
	"Ice Stone": "こおりのいし",
	"Icy Rock": "つめたいいわ",
	"Impish Mint": "わんぱくミント",
	"Iron": "ブロムヘキシン",
	"Jolly Mint": "ようきミント",
	"King's Rock": "おうじゃのしるし",
	"Lagging Tail": "こうこうのしっぽ",
	"Lava Cookie": "フエンせんべい",
	"Lax Incense": "のんきのおこう",
	"Lax Mint": "のうてんきミント",
	"Leaf Stone": "リーフのいし",
	"Leek": "ながねぎ",
	"Leftovers": "たべのこし",
	"Lemonade": "ミックスオレ",
	"Light Clay": "ひかりのねんど",
	"Lonely Mint": "さみしがりミント",
	"Love Sweet": "ハートアメざいく",
	"Luck Incense": "こううんのおこう",
	"Lucky Egg": "しあわせタマゴ",
	"Lucky Punch": "ラッキーパンチ",
	"Luminous Moss": "ひかりごけ",
	"Lumiose Galette": "ミアレガレット",
	"Magmarizer": "マグマブースター",
	"Magnet": "じしゃく",
	"Max Elixir": "ピーピーマックス",
	"Max Ether": "ピーピーリカバー",
	"Max Potion": "まんたんのくすり",
	"Max Repel": "ゴールドスプレー",
	"Max Revive": "げんきのかたまり",
	"Mental Herb": "メンタルハーブ",
	"Metal Coat": "メタルコート",
	"Metal Powder": "メタルパウダー",
	"Metronome": "メトロノーム",
	"Mild Mint": "おっとりミント",
	"Miracle Seed": "きせきのタネ",
	"Misty Seed": "ミストシード",
	"Modest Mint": "ひかえめミント",
	"Moomoo Milk": "モーモーミルク",
	"Moon Stone": "つきのいし",
	"Muscle Band": "ちからのハチマキ",
	"Muscle Feather": "きんりょくのハネ",
	"Mystic Water": "しんぴのしずく",
	"Naive Mint": "むじゃきミント",
	"Naughty Mint": "やんちゃミント",
	"Never-Melt Ice": "とけないこおり",
	"Nugget": "きんのたま",
	"Odd Incense": "あやしいおこう",
	"Old Gateau": "もりのヨウカン",
	"Oval Charm": "まるいおまもり",
	"Oval Stone": "まんまるいし",
	"Paralyze Heal": "まひなおし",
	"Pearl": "しんじゅ",
	"Pearl String": "おだんごしんじゅ",
	"Pewter Crunchies": "ニビあられ",
	"Poison Barb": "どくバリ",
	"Poke Doll": "ピッピにんぎょう",
	"Poke Toy": "ポケじゃらし",
	"Pokemon Box Link": "ポケモンボックス",
	"Pokemon Box Link": "ポケモンボックス",
	"Potion": "キズぐすり",
	"Power Anklet": "パワーアンクル",
	"Power Band": "パワーバンド",
	"Power Belt": "パワーベルト",
	"Power Bracer": "パワーリスト",
	"Power Herb": "パワフルハーブ",
	"Power Lens": "パワーレンズ",
	"Power Weight": "パワーウエイト",
	"PP Max": "ポイントマックス",
	"PP Up": "ポイントアップ",
	"Pretty Feather": "きれいなハネ",
	"Prism Scale": "きれいなウロコ",
	"Protective Pads": "ぼうごパット",
	"Protector": "プロテクター",
	"Protein": "タウリン",
	"Psychic Seed": "サイコシード",
	"Pure Incense": "きよめのおこう",
	"Quick Claw": "せんせいのツメ",
	"Quick Powder": "スピードパウダー",
	"Quiet Mint": "れいせいミント",
	"Rage Candy Bar": "いかりまんじゅう",
	"Rare Bone": "きちょうなホネ",
	"Rare Candy": "ふしぎなアメ",
	"Rash Mint": "うっかりやミント",
	"Razor Claw": "するどいツメ",
	"Razor Fang": "するどいキバ",
	"Reaper Cloth": "れいかいのぬの",
	"Red Card": "レッドカード",
	"Relaxed Mint": "のんきミント",
	"Repel": "むしよけスプレー",
	"Resist Feather": "ていこうのハネ",
	"Revival Herb": "ふっかつそう",
	"Revive": "げんきのかけら",
	"Ribbon Sweet": "リボンアメざいく",
	"Ring Target": "ねらいのまと",
	"Rock Incense": "がんせきおこう",
	"Rocky Helmet": "ゴツゴツメット",
	"Room Service": "ルームサービス",
	"Rose Incense": "おはなのおこう",
	"Rotom Bike": "ロトムじてんしゃ",
	"Rotom Bike": "ロトムじてんしゃ",
	"Rotom Catalog": "ロトムのカタログ",
	"Rusted Shield": "くちたたて",
	"Rusted Sword": "くちたけん",
	"Sachet": "においぶくろ",
	"Sacred Ash": "せいなるはい",
	"Safety Goggles": "ぼうじんゴーグル",
	"Sassy Mint": "なまいきミント",
	"Scope Lens": "ピントレンズ",
	"Sea Incense": "うしおのおこう",
	"Serious Mint": "まじめミント",
	"Shalour Sable": "シャラサブレ",
	"Sharp Beak": "するどいくちばし",
	"Shed Shell": "きれいなぬけがら",
	"Shell Bell": "かいがらのすず",
	"Shiny Charm": "ひかるおまもり",
	"Shiny Stone": "ひかりのいし",
	"Shock Drive": "イナズマカセット",
	"Silk Scarf": "シルクのスカーフ",
	"Silver Powder": "ぎんのこな",
	"Smooth Rock": "さらさらいわ",
	"Soda Pop": "サイコソーダ",
	"Soft Sand": "やわらかいすな",
	"Sonia's Book": "ソニアのほん",
	"Soothe Bell": "やすらぎのすず",
	"Soul Dew": "こころのしずく",
	"Spell Tag": "のろいのおふだ",
	"Star Piece": "ほしのかけら",
	"Star Sweet": "スターアメざいく",
	"Stardust": "ほしのすな",
	"Sticky Barb": "くっつきバリ",
	"Sun Stone": "たいようのいし",
	"Super Potion": "いいキズぐすり",
	"Super Repel": "シルバースプレー",
	"Sweet Apple": "あまーいりんご",
	"Sweet Heart": "ハートスイーツ",
	"Swift Feather": "しゅんぱつのハネ",
	"Tart Apple": "すっぱいりんご",
	"Terrain Extender": "グランドコート",
	"Thick Club": "ふといホネ",
	"Throat Spray": "のどスプレー",
	"Thunder Stone": "かみなりのいし",
	"Timid Mint": "おくびょうミント",
	"Tiny Mushroom": "ちいさなキノコ",
	"Twisted Spoon": "まがったスプーン",
	"Utility Umbrella": "ばんのうがさ",
	"Water Stone": "みずのいし",
	"Wave Incense": "さざなみのおこう",
	"Weakness Policy": "じゃくてんほけん",
	"Whipped Dream": "ホイップポップ",
	"White Herb": "しろいハーブ",
	"Wide Lens": "こうかくレンズ",
	"Wise Glasses": "ものしりメガネ",
	"Wishing Piece": "ねがいのかたまり",
	"Wishing Star": "ねがいぼし",
	"X Accuracy": "ヨクアタール",
	"X Attack": "プラスパワー",
	"X Defense": "ディフェンダー",
	"X Sp. Atk": "スペシャルアップ",
	"X Sp. Def": "スペシャルガード",
	"X Speed": "スピーダー",
	"Zinc": "キトサン",
	"Zoom Lens": "フォーカスレンズ",
	"Deep Sea Scale": "しんかいのウロコ",
	"Deep Sea Tooth": "しんかいのキバ",
	"Strawberry Sweet": "いちごアメざいく",
	"Berry Sweet": "ベリーアメざいく",
	"Berry Juice": "きのみジュース",
	"Air Balloon": "ふうせん",

	"Dive Ball": "ダイブボール",
	"Dream Ball": "ドリームボール",
	"Dusk Ball": "ダークボール",
	"Fast Ball": "スピードボール",
	"Friend Ball": "フレンドボール",
	"Great Ball": "スーパーボール",
	"Heal Ball": "ヒールボール",
	"Heavy Ball": "ヘビーボール",
	"Level Ball": "レベルボール",
	"Love Ball": "ラブラブボール",
	"Lure Ball": "ルアーボール",
	"Luxury Ball": "ゴージャスボール",
	"Master Ball": "マスターボール",
	"Moon Ball": "ムーンボール",
	"Nest Ball": "ネストボール",
	"Net Ball": "ネットボール",
	"Poke Ball": "モンスターボール",
	"Premier Ball": "プレミアボール",
	"Quick Ball": "クイックボール",
	"Repeat Ball": "リピートボール",
	"Timer Ball": "タイマーボール",
	"Ultra Ball": "ハイパーボール",

	"Iron Ball": "くろいてっきゅう",
	"Light Ball": "でんきだま",
	"Smoke Ball": "けむりだま",
	"Snowball": "ゆきだま",
	"Adamant Orb": "こんごうだま",
	"Flame Orb": "かえんだま",
	"Griseous Orb": "はっきんだま",
	"Life Orb": "いのちのたま",
	"Lustrous Orb": "しらたま",
	"Red Orb": "べにいろのたま",
	"Toxic Orb": "どくどくだま",
	"Adrenaline Orb": "ビビリたま",
	"Blue Orb": "あいいろのたま",

	"Normal Gem": "ノーマルジュエル",
	"Bug Gem": "むしのジュエル",
	"Dark Gem": "あくのジュエル",
	"Dragon Gem": "ドラゴンジュエル",
	"Electric Gem": "でんきのジュエル",
	"Fighting Gem": "かくとうジュエル",
	"Fire Gem": "ほのおのジュエル",
	"Flying Gem": "ひこうのジュエル",
	"Ghost Gem": "ゴーストジュエル",
	"Grass Gem": "くさのジュエル",
	"Ground Gem": "じめんのジュエル",
	"Ice Gem": "こおりのジュエル",
	"Poison Gem": "どくのジュエル",
	"Psychic Gem": "エスパージュエル",
	"Rock Gem": "いわのジュエル",
	"Steel Gem": "はがねのジュエル",
	"Water Gem": "みずのジュエル",

	"Draco Plate": "りゅうのプレート",
	"Dread Plate": "こわもてプレート",
	"Earth Plate": "だいちのプレート",
	"Fist Plate": "こぶしのプレート",
	"Flame Plate": "ひのたまプレート",
	"Icicle Plate": "つららのプレート",
	"Insect Plate": "たまむしプレート",
	"Iron Plate": "こうてつプレート",
	"Meadow Plate": "みどりのプレート",
	"Mind Plate": "ふしぎのプレート",
	"Pixie Plate": "せいれいプレート",
	"Sky Plate": "あおぞらプレート",
	"Splash Plate": "しずくプレート",
	"Spooky Plate": "もののけプレート",
	"Stone Plate": "がんせきプレート",
	"Toxic Plate": "もうどくプレート",
	"Zap Plate": "いかずちプレート",

	"Bug Memory": "バグメモリ",
	"Dark Memory": "ダークメモリ",
	"Dragon Memory": "ドラゴンメモリ",
	"Electric Memory": "エレクトロメモリ",
	"Fairy Memory": "フェアリーメモリ",
	"Fighting Memory": "ファイトメモリ",
	"Fire Memory": "ファイヤーメモリ",
	"Flying Memory": "フライングメモリ",
	"Ghost Memory": "ゴーストメモリ",
	"Grass Memory": "グラスメモリ",
	"Ground Memory": "グラウンドメモリ",
	"Ice Memory": "アイスメモリ",
	"Poison Memory": "ポイズンメモリ",
	"Psychic Memory": "サイキックメモリ",
	"Rock Memory": "ロックメモリ",
	"Steel Memory": "スチールメモリ",
	"Water Memory": "ウオーターメモリ",

	"Cheri Berry": "クラボのみ",
	"Chesto Berry": "カゴのみ",
	"Pecha Berry": "モモンのみ",
	"Rawst Berry": "チーゴのみ",
	"Aspear Berry": "ナナシのみ",
	"Leppa Berry": "ヒメリのみ",
	"Oran Berry": "オレンのみ",
	"Persim Berry": "キーのみ",
	"Lum Berry": "ラムのみ",
	"Sitrus Berry": "オボンのみ",
	"Figy Berry": "フィラのみ",
	"Wiki Berry": "ウイのみ",
	"Mago Berry": "マゴのみ",
	"Aguav Berry": "バンジのみ",
	"Iapapa Berry": "イアのみ",
	"Razz Berry": "ズリのみ",
	"Bluk Berry": "ブリーのみ",
	"Nanab Berry": "ナナのみ",
	"Wepear Berry": "セシナのみ",
	"Pinap Berry": "パイルのみ",
	"Pomeg Berry": "ザロクのみ",
	"Kelpsy Berry": "ネコブのみ",
	"Qualot Berry": "タポルのみ",
	"Hondew Berry": "ロメのみ",
	"Grepa Berry": "ウブのみ",
	"Tamato Berry": "マトマのみ",
	"Cornn Berry": "モコシのみ",
	"Magost Berry": "ゴスのみ",
	"Rabuta Berry": "ラブタのみ",
	"Nomel Berry": "ノメルのみ",
	"Spelon Berry": "ノワキのみ",
	"Pamtre Berry": "シーヤのみ",
	"Watmel Berry": "カイスのみ",
	"Durin Berry": "ドリのみ",
	"Belue Berry": "ベリブのみ",
	"Occa Berry": "オッカのみ（ほのお）",
	"Passho Berry": "イトケのみ（みず）",
	"Wacan Berry": "ソクノのみ（でんき）",
	"Rindo Berry": "リンドのみ（くさ）",
	"Yache Berry": "ヤチェのみ（こおり）",
	"Chople Berry": "ヨプのみ（かくとう）",
	"Kebia Berry": "ビアーのみ（どく）",
	"Shuca Berry": "シュカのみ（じめん）",
	"Coba Berry": "バコウのみ（ひこう）",
	"Payapa Berry": "ウタンのみ（エスパー）",
	"Tanga Berry": "タンガのみ（むし）",
	"Charti Berry": "ヨロギのみ（いわ）",
	"Kasib Berry": "カシブのみ（ゴースト）",
	"Haban Berry": "ハバンのみ（ドラゴン）",
	"Colbur Berry": "ナモのみ（あく）",
	"Babiri Berry": "リリバのみ（はがね）",
	"Roseli Berry": "ロゼルのみ（フェアリー）",
	"Chilan Berry": "ホズのみ（ノーマル）",
	"Liechi Berry": "チイラのみ",
	"Ganlon Berry": "リュガのみ",
	"Salac Berry": "カムラのみ",
	"Petaya Berry": "ヤタピのみ",
	"Apicot Berry": "ズアのみ",
	"Lansat Berry": "サンのみ",
	"Starf Berry": "スターのみ",
	"Enigma Berry": "ナゾのみ",
	"Micle Berry": "ミクルのみ",
	"Custap Berry": "イバンのみ",
	"Jaboca Berry": "ジャポのみ",
	"Rowap Berry": "レンブのみ",
	"Kee Berry": "アッキのみ",
	"Maranga Berry": "タラプのみ",

  //パルデア
　"Booster Energy": "ブーストエナジー",
　"Ability Shield": "とくせいガード",
　"Clear Amulet": "クリアチャーム",
　"Mirror Herb": "ものまねハーブ",
　"Punching Glove": "パンチグローブ",
　"Covert Cloak": "おんみつマント",
　"Loaded Dice": "いかさまダイス",

	// ⦿ポケモン名
	//;

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
	"Rattata-Alola": "コラッタ-アローラ",
	"Raticate-Alola": "ラッタ-アローラ",
	"Spearow": "オニスズメ",
	"Fearow": "オニドリル",
	"Ekans": "アーボ",
	"Arbok": "アーボック",
	"Pikachu": "ピカチュウ",
	"Raichu": "ライチュウ",
	"Raichu-Alola": "ライチュウ-アローラ",
	"Sandshrew": "サンド",
	"Sandslash": "サンドパン",
	"Sandshrew-Alola": "サンド-アローラ",
	"Sandslash-Alola": "サンドパン-アローラ",
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
	"Vulpix-Alola": "ロコン-アローラ",
	"Ninetales-Alola": "キュウコン-アローラ",
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
	"Diglett-Alola": "ディグダ-アローラ",
	"Dugtrio-Alola": "ダグトリオ-アローラ",
	"Meowth-Alola": "ニャース-アローラ",
	"Persian-Alola": "ペルシアン-アローラ",
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
	"Geodude-Alola": "イシツブテ-アローラ",
	"Graveler-Alola": "ゴローン-アローラ",
	"Golem-Alola": "ゴローニャ-アローラ",
	"Ponyta": "ポニータ",
	"Ponyta-Galar": "ポニータ-ガラル",
	"Rapidash": "ギャロップ",
	"Rapidash-Galar": "ギャロップ-ガラル",
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
	"Grimer-Alola": "ベトベター-アローラ",
	"Muk-Alola": "ベトベトン-アローラ",
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
	"Exeggutor-Alola": "ナッシー-アローラ",
	"Cubone": "カラカラ",
	"Marowak": "ガラガラ",
	"Marowak-Alola": "ガラガラ-アローラ",
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
	"Mr. Mime": "バリヤード",
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
	"Castform-Rainy": "ポワルン-あまみず",
	"Castform-Snowy": "ポワルン-ゆきぐも",
	"Castform-Sunny": "ポワルン-たいよう",
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
	"Deoxys-Attack": "デオキシス-アタック",
	"Deoxys-Defense": "デオキシス-ディフェンス",
	"Deoxys-Speed": "デオキシス-スピード",
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
	"Wormadam-Sandy": "ミノマダム-すなち",
	"Wormadam-Trash": "ミノマダム-ゴミ",
	"Mothim": "ガーメイル",
	"Combee": "ミツハニー",
	"Vespiquen": "ビークイン",
	"Pachirisu": "パチリス",
	"Buizel": "ブイゼル",
	"Floatzel": "フローゼル",
	"Cherubi": "チェリンボ",
	"Cherrim": "チェリム",
	"Cherrim-Sunshine": "チェリム-ポジ",
	"Shellos": "カラナクシ",
	"Gastrodon": "トリトドン",
	"Gastrodon-East": "トリトドン-ひがし",
	"Gastrodon-West": "トリトドン-にし",
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
	"Mime Jr.": "マネネ",
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
	"Rotom-Fan": "ロトム-スピン",
	"Rotom-Wash": "ロトム-ウォッシュ",
	"Rotom-Mow": "ロトム-カット",
	"Rotom-Heat": "ロトム-ヒート",
	"Rotom-Frost": "ロトム-フロスト",
	"Uxie": "ユクシー",
	"Mesprit": "エムリット",
	"Azelf": "アグノム",
	"Dialga": "ディアルガ",
	"Palkia": "パルキア",
	"Heatran": "ヒードラン",
	"Regigigas": "レジギガス",
	"Giratina": "ギラティナ",
	"Giratina-Origin": "ギラティナ-オリジン",
	"Cresselia": "クレセリア",
	"Phione": "フィオネ",
	"Manaphy": "マナフィ",
	"Darkrai": "ダークライ",
	"Shaymin": "シェイミ",
	"Shaymin-Sky": "シェイミ-スカイ",
	"Arceus": "アルセウス",
	"Arceus-*": "アルセウス-不明",
	"Arceus-Bug": "アルセウス-むし",
	"Arceus-Dark": "アルセウス-あく",
	"Arceus-Dragon": "アルセウス-ドラゴン",
	"Arceus-Electric": "アルセウス-でんき",
	"Arceus-Fairy": "アルセウス-フェアリー",
	"Arceus-Fighting": "アルセウス-かくとう",
	"Arceus-Fire": "アルセウス-ほのお",
	"Arceus-Flying": "アルセウス-ひこう",
	"Arceus-Ghost": "アルセウス-ゴースト",
	"Arceus-Grass": "アルセウス-くさ",
	"Arceus-Ground": "アルセウス-じめん",
	"Arceus-Ice": "アルセウス-こおり",
	"Arceus-Poison": "アルセウス-どく",
	"Arceus-Psychic": "アルセウス-エスパー",
	"Arceus-Rock": "アルセウス-いわ",
	"Arceus-Steel": "アルセウス-はがね",
	"Arceus-Water": "アルセウス-みず",
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
	"Basculin": "バスラオ",
	"Basculin-Blue-Striped": "バスラオ",
	"Sandile": "メグロコ",
	"Krokorok": "ワルビル",
	"Krookodile": "ワルビアル",
	"Darumaka": "ダルマッカ",
	"Darmanitan": "ヒヒダルマ",
	"Darmanitan-Galar": "ヒヒダルマ-ガラル",
	"Darmanitan-Zen": "ヒヒダルマ-ダルマ",
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
	"Kyurem-Black": "キュレム-ブラック",
	"Kyurem-White": "キュレム-ホワイト",
	"Keldeo": "ケルディオ",
	"Keldeo-Resolute": "ケルディオ-かくご",
	"Meloetta": "メロエッタ",
	"Meloetta-Pirouette": "メロエッタ-ステップ",
	"Genesect": "ゲノセクト",
	"Genesect-*": "ゲノセクト-不明",
	"Genesect-Burn": "ゲノセクト-ブレイズ",
	"Genesect-Chill": "ゲノセクト-フリーズ",
	"Genesect-Douse": "ゲノセクト-アクア",
	"Genesect-Shock": "ゲノセクト-イナズマ",
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
	"Vivillon-Ocean": "ビビヨン-オーシャン",
	"Litleo": "シシコ",
	"Pyroar": "カエンジシ",
	"Flabébé": "フラベベ",
	"Floette": "フラエッテ",
	"Floette-Eternal": "フラエッテ-えいえん",
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
	"Zygarde-Complete": "ジガルデ-パーフェクト",
	"Diancie": "ディアンシー",
	"Diancie-Mega": "メガディアンシー",
	"Hoopa": "フーパ",
	"Hoopa-Unbound": "フーパ-解放",
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
	"Lycanroc": "ルガルガン",
	"Lycanroc-Midnight": "ルガルガン-まよなか",
	"Lycanroc-Dusk": "ルガルガン-たそがれ",
	"Wishiwashi": "ヨワシ",
	"Wishiwashi-School": "ヨワシ-むれ",
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
	"Silvally-*": "シルヴァディ-不明",
	"Silvally-Bug": "シルヴァディ-むし",
	"Silvally-Dark": "シルヴァディ-あく",
	"Silvally-Dragon": "シルヴァディ-ドラゴン",
	"Silvally-Electric": "シルヴァディ-でんき",
	"Silvally-Fairy": "シルヴァディ-フェアリー",
	"Silvally-Fighting": "シルヴァディ-かくとう",
	"Silvally-Fire": "シルヴァディ-ほのお",
	"Silvally-Flying": "シルヴァディ-ひこう",
	"Silvally-Ghost": "シルヴァディ-ゴースト",
	"Silvally-Grass": "シルヴァディ-くさ",
	"Silvally-Ground": "シルヴァディ-じめん",
	"Silvally-Ice": "シルヴァディ-こおり",
	"Silvally-Poison": "シルヴァディ-どく",
	"Silvally-Psychic": "シルヴァディ-エスパー",
	"Silvally-Rock": "シルヴァディ-いわ",
	"Silvally-Steel": "シルヴァディ-はがね",
	"Silvally-Water": "シルヴァディ-みず",
	"Minior": "メテノ",
	"Minior-Meteor": "メテノ-コア",
	"Komala": "ネッコアラ",
	"Turtonator": "バクガメス",
	"Togedemaru": "トゲデマル",
	"Mimikyu": "ミミッキュ",
	"Mimikyu-Busted": "ミミッキュ-ばれた姿",
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
	"Necrozma-Dusk-Mane": "ネクロズマ-たそがれ",
	"Necrozma-Dawn-Wings": "ネクロズマ-あかつき",
	"Magearna": "マギアナ",
	"Magearna-Original": "マギアナ-オリジナル",
	"Marshadow": "マーシャドー",
	"Stakataka": "ツンデツンデ",
	"Blacephalon": "ズガドーン",
	"Poipole": "ベベノム",
	"Naganadel": "アーゴヨン",
	"Zeraora": "ゼラオラ",

	"Meltan": "メルタン",
	"Melmetal": "メルメタル",

	"Missingno.": "けつばん",
	"Pokestar Smeargle": "ペネロペのドーブル",
	"Pokestar UFO": "ポケウッド ＵＦＯ",
	"Pokestar Brycen-Man": "ハチクマン",
	"Pokestar MT": "メカバンギラス",
	"Pokestar MT2": "メカバンギラス２",
	"Pokestar Giant": "ＯＬのモニカ",
	"Pokestar Humanoid": "ポケウッド 人型",
	"Pokestar Monster": "ポケウッド 怪物",
	"Pokestar F-00": "ポケウッド F-00",
	"Pokestar F-002": "ポケウッド F-002",
	"Pokestar Spirit": "ポケウッド 魔神",

	// ポケモン名の接辞
	//

	"-Rainy": "-あまみず",
	"-Snowy": "-ゆきぐも",
	"-Sunny": "-たいよう",
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
	"-*": "-不明",
	"-Bug": "-むし",
	"-Dark": "-あく",
	"-Dragon": "-ドラゴン",
	"-Electric": "-でんき",
	"-Fairy": "-フェアリー",
	"-Fighting": "-かくとう",
	"-Fire": "-ほのお",
	"-Flying": "-ひこう",
	"-Ghost": "-ゴースト",
	"-Grass": "-くさ",
	"-Ground": "-じめん",
	"-Ice": "-こおり",
	"-Poison": "-どく",
	"-Psychic": "-エスパー",
	"-Rock": "-いわ",
	"-Steel": "-はがね",
	"-Water": "-みず",
	"-Spiky-eared": "-ギザみみ",
	"-Zen": "-ダルマ",
	"-Resolute": "-かくご",
	"-Pirouette": "-ステップ",
	"-Burn": "-ブレイズ",
	"-Chill": "-フリーズ",
	"-Douse": "-アクア",
	"-Shock": "-イナズマ", //ゲノセクト
	"-Mega": "-メガ",
	"-Mega-X": "-メガ-X",
	"-Mega-Y": "-メガ-Y",
	"-Ash": "-サトシ", //ゲッコウガ
	"-Blade": "-ブレード",
	"-Eternal": "-永遠の花",
	"-Large": "-大きい",
	"-Small": "-小さい",
	"-Super": "-特大",
	"-Unbound": "-解放", //フーパ
	"-Rock-Star": "-ハードロック",
	"-Belle": "-マダム",
	"-Pop-Star": "-アイドル",
	"-PhD": "-ドクター",
	"-Libre": "-マスクド",
	"-Partner": "-キミにきめた",
	"-Busted": "-ばれた姿", //ミミッキュ
	"-Primal": "-ゲンシカイキ",
	"-Sandy": "-すなちのミノ",
	"-Trash": "-ゴミのミノ",
	"-Sunshine": "-ポジ", //チェリム
	"-Blue-Striped": "-あおすじ",
	"-Therian": "-霊獣",
	"-Black": "-ブラック",
	"-White": "-ホワイト",
	"-Fancy": "-ファンシー",
	"-Pokeball": "-モンスターボール",
	"-Complete": "-パーフェクト",
	"-Totem": "-ぬし",
	"-Alola-Totem": "-アローラ-ぬし",
	"-Pa'u": "-ふらふら",
	"-Pom-Pom": "-ぱちぱち",
	"-Sensu": "-まいまい",
	"-Midnight": "-まよなか",
	"-Dusk": "-たそがれ",
	"-School": "-群れ",
	"-Meteor": "-りゅうせい",
	"-Busted-Totem": "-ばれた姿-ぬし",
	"-Alola": "-アローラ",
	"-Hoenn": "-ホウエン",
	"-Kalos": "-カロス",
	"-Original": "-オリジナル",
	"-Sinnoh": "-シンオウ",
	"-Unova": "-イッシュ", //ピカチュウのやつ
	"-Dusk-Mane": "-日食",
	"-Dawn-Wings": "-月食",
	"-Ultra": "-ウルトラ",
	"-Starter": "-相棒",
	"-Gmax": "-キョダイ",
	"-Galar": "-ガラル",
	"-Crowned": "-王の姿",

	//ガラル
	"Grookey": "サルノリ",
	"Thwackey": "バチンキー",
	"Rillaboom": "ゴリランダー",
	"Scorbunny": "ヒバニー",
	"Raboot": "ラビフット",
	"Cinderace": "エースバーン",
	"Sobble": "メッソン",
	"Drizzile": "ジメレオン",
	"Inteleon": "インテレオン",
	"Skwovet": "ホシガリス",
	"Greedent": "ヨクバリス",
	"Rookidee": "ココガラ",
	"Corvisquire": "アオガラス",
	"Corviknight": "アーマーガア",
	"Blipbug": "サッチムシ",
	"Dottler": "レドームシ",
	"Orbeetle": "イオルブ",
	"Nickit": "クスネ",
	"Thievul": "フォクスライ",
	"Gossifleur": "ヒメンカ",
	"Eldegoss": "ワタシラガ",
	"Wooloo": "ウールー",
	"Dubwool": "バイウールー",
	"Chewtle": "カムカメ",
	"Drednaw": "カジリガメ",
	"Yamper": "ワンパチ",
	"Boltund": "パルスワン",
	"Rolycoly": "タンドン",
	"Carkol": "トロッゴン",
	"Coalossal": "セキタンザン",
	"Applin": "カジッチュ",
	"Flapple": "アップリュー",
	"Appletun": "タルップル",
	"Silicobra": "スナヘビ",
	"Sandaconda": "サダイジャ",
	"Cramorant": "ウッウ",
	"Arrokuda": "サシカマス",
	"Barraskewda": "カマスジョー",
	"Toxel": "エレズン",
	"Toxtricity": "ストリンダー",
	"Sizzlipede": "ヤクデ",
	"Centiskorch": "マルヤクデ",
	"Clobbopus": "タタッコ",
	"Grapploct": "オトスパス",
	"Sinistea": "ヤバチャ",
	"Polteageist": "ポットデス",
	"Hatenna": "ミブリム",
	"Hattrem": "テブリム",
	"Hatterene": "ブリムオン",
	"Impidimp": "ベロバー",
	"Morgrem": "ギモー",
	"Grimmsnarl": "オーロンゲ",
	"Obstagoon": "タチフサグマ",
	"Perrserker": "ニャイキング",
	"Cursola": "サニゴーン",
	"Sirfetch'd": "ネギガナイト",
	"Mr. Rime": "バリコオル",
	"Runerigus": "デスバーン",
	"Milcery": "マホミル",
	"Alcremie": "マホイップ",
	"Falinks": "タイレーツ",
	"Pincurchin": "バチンウニ",
	"Snom": "ユキハミ",
	"Frosmoth": "モスノウ",
	"Stonjourner": "イシヘンジン",
	"Eiscue": "コオリッポ",
	"Indeedee": "イエッサン",
	"Indeedee-F": "イエッサン-メス",
	"Indeedee-M": "イエッサン-オス",
	"Morpeko": "モルペコ",
	"Cufant": "ゾウドウ",
	"Copperajah": "ダイオウドウ",
	"Dracozolt": "パッチラゴン",
	"Arctozolt": "パッチルドン",
	"Dracovish": "ウオノラゴン",
	"Arctovish": "ウオチルドン",
	"Duraludon": "ジュラルドン",
	"Dreepy": "ドラメシヤ",
	"Drakloak": "ドロンチ",
	"Dragapult": "ドラパルト",
	"Zacian": "ザシアン",
	"Zamazenta": "ザマゼンタ",
	"Eternatus": "ムゲンダイナ",
	"Kubfu": "ダクマ",
	"Urshifu": "ウーラオス",
	"Zarude": "ザルード",
	"Regieleki": "レジエレキ",
	"Regidrago": "レジドラゴ",
	"Glastrier": "ブリザポス",
	"Spectrier": "レイスポス",
	"Calyrex": "バドレックス",

　//ヒスイ
　"Wyrdeer": "アヤシシ",
　"Kleavor": "バサギリ",
　"Ursaluna": "ガチグマ",
　"Basculegion": "イダイトウ",
　"Sneasler": "オオニューラ",
　"Overqwil": "ハリーマン",
　"Enamorus": "ラブトロス",

  //パルデア
　"Sprigatito": "ニャオハ",
　"Floragato": "ニャローテ",
　"Meowscarada": "マスカーニャ",
　"Fuecoco": "ホゲータ",
　"Crocalor": "アチゲータ",
　"Skeledirge": "ラウドボーン",
　"Quaxly": "クワッス",
　"Quaxwell": "ウェルカモ",
　"Quaquaval": "ウェーニバル",
　"Lechonk": "グルトン",
　"Oinkologne": "パフュートン",
　"Tarountula": "タマンチュラ",
　"Spidops": "ワナイダー",
　"Nymble": "マメバッタ",
　"Lokix": "エクスレッグ",
　"Pawmi": "パモ",
　"Pawmo": "パモット",
　"Pawmot": "パーモット",
　"Tandemaus": "ワッカネズミ",
　"Maushold": "イッカネズミ",
　"Fidough": "パピモッチ",
　"Dachsbun": "バウッツェル",
　"Smoliv": "ミニーブ",
　"Dolliv": "オリーニョ",
　"Arboliva": "オリーヴァ",
　"Squawkabilly": "イキリンコ",
　"Nacli": "コジオ",
　"Naclstack": "ジオヅム",
　"Garganacl": "キョジオーン",
　"Charcadet": "カルボウ",
　"Armarouge": "グレンアルマ",
　"Ceruledge": "ソウブレイズ",
　"Tadbulb": "ズピカ",
　"Bellibolt": "ハラバリー",
　"Wattrel": "カイデン",
　"Kilowattrel": "タイカイデン",
　"Maschiff": "オラチフ",
　"Mabosstiff": "マフィティフ",
　"Shroodle": "シルシュルー",
　"Grafaiai": "タギングル",
　"Bramblin": "アノクサ",
　"Brambleghast": "アノホラグサ",
　"Toedscool": "ノノクラゲ",
　"Toedscruel": "リククラゲ",
　"Klawf": "ガケガニ",
　"Capsakid": "カプサイジ",
　"Scovillain": "スコヴィラン",
　"Rellor": "シガロコ",
　"Rabsca": "ベラカス",
　"Flittle": "ヒラヒナ",
　"Espathra": "クエスパトラ",
　"Tinkatink": "カヌチャン",
　"Tinkatuff": "ナカヌチャン",
　"Tinkaton": "デカヌチャン",
　"Wiglett": "ウミディグダ",
　"Wugtrio": "ウミトリオ",
　"Bombirdier": "オトシドリ",
　"Finizen": "ナミイルカ",
　"Palafin": "イルカマン",
　"Varoom": "ブロロン",
　"Revavroom": "ブロロローム",
　"Cyclizar": "モトトカゲ",
　"Orthworm": "ミミズズ",
　"Glimmet": "キラーメ",
　"Glimmora": "キラフロル",
　"Greavard": "ボチ",
　"Houndstone": "ハカドッグ",
　"Flamigo": "カラミンゴ",
　"Cetoddle": "アルクジラ",
　"Cetitan": "ハルクジラ",
　"Veluza": "ミガルーサ",
　"Dondozo": "ヘイラッシャ",
　"Tatsugiri": "シャリタツ",
　"Annihilape": "コノヨザル",
　"Clodsire": "ドオー",
　"Farigiraf": "リキキリン",
　"Dudunsparce": "ノココッチ",
　"Kingambit": "ドドゲザン",
　"Great Tusk": "イダイナキバ",
　"Scream Tail": "サケブシッポ",
　"Brute Bonnet": "アラブルタケ",
　"Flutter Mane": "ハバタクカミ",
　"Slither Wing": "チヲハウハネ",
　"Sandy Shocks": "スナノケガワ",
　"Iron Treads": "テツノワダチ",
　"Iron Bundle": "テツノツツミ",
　"Iron Hands": "テツノカイナ",
　"Iron Jugulis": "テツノコウベ",
　"Iron Moth": "テツノドクガ",
　"Iron Thorns": "テツノイバラ",
　"Frigibax": "セビエ",
　"Arctibax": "セゴール",
　"Baxcalibur": "セグレイブ",
　"Gimmighoul": "コレクレー",
　"Gholdengo": "サーフゴー",
　"Wo-Chien": "チオンジェン",
　"Chien-Pao": "パオジアン",
　"Ting-Lu": "ディンルー",
　"Chi-Yu": "イーユイ",
　"Roaring Moon": "トドロクツキ",
　"Iron Valiant": "テツノブジン",
　"Koraidon": "コライドン",
　"Miraidon": "ミライドン",

	// ⦿battle.js
	//;

	"The opposing": "相手の",
	"restored a little HP using its Leftovers!": "はたべのこしで 少し回復した！",

	"It's super effective!": "効果はバツグンだ！",
	"It's not very effective...": "効果は いまひとつのようだ... ",
	//"lost": "に ",
	//" of its health!)": " のダメージ！)", //上とセット "ポケモン名 lost ??% of its health!""
	", come back!": " 戻れ！",
	"(exists)": "(exsits)", //道具かな
	// "Go!": "ゆけっ！",

	// "withdrew": "withdrew", // "プレイヤー名 withdrew ポケモン名" 無理
	// "sent out": "sent out", // "プレイヤー名 sent out ポケモン名" 無理

	"The sunlight turned harsh!": "日差しが 強くなった！",
	"s Drought intensified the sun's rays!": "の ひでり で日差しが強くなった！",
	"The sunlight faded.": "日差しが 元に戻った！",
	"The sunlight turned extremely harsh!": "日差しが とても強くなった！",
	"The harsh sunlight faded.": "日差しが 元に戻った！",
	"It started to rain!": "雨が降り始めた！",
	"s Drizzle made it rain!": "の あめふらしで 雨が降り始めた！",
	"The rain stopped.": "雨が降り止んだ！",
	"A heavy rain began to fall!": "強い雨が 降り始めた！",
	"The heavy rain has lifted!": "強い雨が 降り止んだ！",
	"A sandstorm kicked up!": "砂あらしが ふき始めた！",
	"s Sand Stream whipped up a sandstorm!": "の すなおこしで 砂あらしが ふき始めた！",
	"The sandstorm is raging.": "砂あらしが ふきあれる",
	"The sandstorm subsided.": "砂あらしが おさまった！",
	"It started to hail!": "あられが 降り始めた！",
	"s Snow Warning whipped up a hailstorm!": "の ゆきふらしで あられが 降り始めた！",
	"The hail is crashing down.": "あられが 降り続いている",
	"The hail stopped.": "あられが 降り止んだ！",
	"Mysterious strong winds are protecting Flying-type Pok&eacute;mon!": "謎の乱気流が 飛行ポケモンを守る！",
	"The mysterious strong winds have dissipated!": "謎の乱気流が おさまった！",
	"unleashes its full-force Z-Move!": "が解き放つ 全力のＺワザ！",
	"bounced the": "bounced the", //わからん
	"back!": "！",
	"Waggling a finger let it use": "Waggling a finger let it use", //ゆびをふる
	"Nature Power turned into": "しぜんのちからは変化した！", //自然の力
	"Breakneck Blitz turned into": "ウルトラダッシュアタックは変化した！",
	"s attack continues!": "の攻撃は まだ続いている！",
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
	"is fast asleep.": "ぐうぐう眠っている！",
	"Sky Drop won't let": "Sky Drop won't let",
	// "go!": "go!",
	"cannot use": "cannot use",
	"is loafing around!": "is loafing around!",
	"must recharge!": "はは反動で動けない！",
	"lost its focus and couldn't move!": "は集中が途切れて技が出せなかった！",
	"s shell trap didn't work!": "のトラップシェルは不発に終わった！",
	"flinched and couldn\'t move!": "はひるんで技が出せない！",
	"is immobilized by love!": "はメロメロで技が出せない！",
	"But there was no PP left for the move!": "しかし わざのPPが足りなかった！", //オリジナルメッセージ知らず
	"can't move": "can't move",
	"Automatic center!": "Automatic center!",
	//"Pointed stones dug into":"尖锐的岩石扎进了", //ステロ 「〜に尖った岩が食い込んだ」
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
	"It hurt itself in its confusion!": "わけも分からず 自分を攻撃した！",
	"'s health is sapped by Leech Seed!": "の体力がやどりぎに奪われる！", //オリジナル「やどりぎが〜の体力を奪う」
	"The bursting flame hit": "The bursting flame hit", //弾ける炎
	"is hurt by the sea of fire!": "火の海のダメージを受けた！", //誓い
	"kept going and crashed!": "は勢い余って地面にぶつかった！",
	//"is hurt by": "is hurt by", //どこ
	//"is hurt by its": "is hurt by its", //どこ
	"lost some HP because of": "lost some HP because of", //語順
	"'s HP was restored by the Z-Power!": "は Zパワーで体力を回復した！",
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
	//"restored its HP.": "は体力を回復した！",
	"restored its HP using its Z-Power!": "は　Zパワーで体力を回復した！", //上のと違うのか？
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
	"But it does not have enough HP left to make a substitute!": "しかし 身代わりを出すには体力が足りなかった！",
	"already has a substitute!": "の身代わりはすでに出ていた！",
	"is too heavy to be lifted!": "は重すぎて持ち上げられない！", //フリーフォール
	"But it failed!": "しかし うまく決まらなかった！", //技の対象がいない場合とか
	"The extremely harsh sunlight was not lessened at all!": "強い日差しの勢いは止まらない！",
	"There is no relief from this heavy rain!": "強い雨の勢いは止まらない！",
	"The mysterious strong winds blow on regardless!": "謎の乱気流の勢いは止まらない！",
	"surrounded itself with a veil of petals!": "surrounded itself with a veil of petals!",
	"'s": "の",
	"stats were": "stats were",
	"not lowered!": "not lowered!",
	"The Water-type attack evaporated in the harsh sunlight!": "強い日差しの影響で水タイプの攻撃が蒸発した！",
	"The Fire-type attack fizzled out in the heavy rain!": "強い雨の影響で炎タイプの攻撃がかき消された！",
	"But there was no target...": "しかし くり出す相手が いなかった！",
	"It's a one-hit KO!": "一撃必殺！",
	"But nothing happened!": "しかし 何も起こらなかった！", //はねる?
	"is waiting for": "は", //誓い　下とセット？「〜は〜を待っている...」
	"'s move...": "を待っている...",
	"The two moves have become one! It's a combined move!": "２つの技が１つになった！ コンビネーションわざだ！",
	"surrounded itself with its Z-Power!": "はZパワーを身体にまとった！",
	"by the": "by the",
	"was burned!": "は 火傷を負った！",
	"was badly poisoned!": "は 猛毒をあびた！",
	"was poisoned!": "は 毒をあびた!",
	"slept and became healthy!": "は 眠って元気になった！",
	"fell asleep!": "は 眠ってしまった！",
	"is paralyzed! It may be unable to move!": "は まひして 技が出にくくなった！",
	"was frozen solid!": "は こおりついた！",
	"moved its status onto": "moved its status onto",
	"'s Natural Cure activated!": "'s Natural Cure activated!", //自然回復
	"heals its status!": "heals its status!",
	"healed its burn!": "healed its burn!",
	"'s burn was healed.": "'s burn was healed.",
	"cured its poison!": "cured its poison!",
	"was cured of its poisoning.": "の 毒が治った！",
	"was cured of paralysis.": "の 麻痺が治った！", //自信ない
	"woke it up!": "は 目を覚ました！", //下と違うのか
	"woke up!": "は 目を覚ました！",
	"cured its paralysis!": "cured its paralysis!",
	"defrosted it!": "の 氷がとけた！", //下と違うのか
	"thawed out!": "の 氷がとけた！",
	"'s status cleared!": "'s status cleared!",
	"A soothing aroma wafted through the area!": "A soothing aroma wafted through the area!",
	"A bell chimed!": "鈴の音が 響きわたった！", //いやしのすず
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
	//"lost its": "lost its",
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
	"Shields Down deactivated!": "リミットシールド 発動！", // 紛らわしい "deactivated"で「発動」
	"Shields Down activated!": "リミットシールド 解除！",
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
	"'s perish count fell to 0.": "の滅びのカウントが ０になった！",
	"'s perish count fell to 1.": "の滅びのカウントが １になった！",
	"'s perish count fell to 2.": "の滅びのカウントが ２になった！",
	"'s perish count fell to 3.": "の滅びのカウントが ３になった！",
	"received an encore!": "はアンコールをうけた！",
	"is storing energy!": "はがまんしている", //違うかも
	"can't get it going!": "は調子が上がらない！", //スロースタート
	"fell in love from the": "fell in love from the",
	"became nimble!": "became nimble!",
	// "used the": "used the",
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

	"Aurora Veil made your team stronger against physical and special moves!": "味方はオーロラベールで 物理と特殊に強くなった！!",
	"Aurora Veil made the opposing team stronger against physical and special moves!": "相手はオーロラベールで 物理と特殊に強くなった！",
	"Reflect made your team stronger against physical moves!": "味方はリフレクターで 物理に強くなった！",
	"Reflect made the opposing team stronger against physical moves!": "相手はリフレクターで 物理に強くなった！",
	"Light Screen made your team stronger against special moves!": "味方はひかりのかべで 特殊に強くなった！",
	"Light Screen made the opposing team stronger against special moves!": "相手はひかりのかべで 特殊に強くなった！",

	"Your team's Aurora Veil wore off!": "味方のオーロラベールの 効果が切れた！",
	"Your team's Reflect wore off!": "味方のリフレクターの 効果が切れた！",
	"Your team's Light Screen wore off!": "味方のひかりのかべの 効果が切れた！",

	"The opposing team's Aurora Veil wore off!": "相手のオーロラベールの 効果が切れた！",
	"The opposing team's Reflect wore off!": "相手のリフレクターの 効果が切れた！",
	"The opposing team's Light Screen wore off!": "相手のひかりのかべの 効果が切れた！",

	"Poison spikes were scattered on the ground all around your team!": "味方の足元に どくびしが散らばった！",
	"Poison spikes were scattered on the ground all around the opposing team!": "相手の足元に どくびしが散らばった！",
	"The poison spikes disappeared from the ground around your team!": "味方の周りのどくびしが 消え去った！",
	"The poison spikes disappeared from the ground around the opposing team!": "相手の周りのどくびしが 消え去った！",

	"It's super effective! A critical hit!": "効果は抜群だ！急所に当たった！",
	"It's not very effective... A critical hit!": "効果はいまひとつのようだ... 急所に当たった！",
	"was burned by the Flame Orb!": "はかえんだまでやけどを負った！",

	"[Opposing": "[相手の",

	"Pointed stones float in the air around your team!": "味方の周りに とがった岩が ただよい始めた！",
	"Pointed stones float in the air around the opposing team!": "相手の周りに とがった岩が ただよい始めた！",
	"The pointed stones disappeared from around your team!": "味方の周りの ステルスロックが 消え去った！",
	"The pointed stones disappeared from around the opposing team!": "相手の周りの ステルスロックが 消え去った！",

	"the opposing ": "相手の ",
	"The opposing": "相手の",

	"Attack": "攻撃",
	"Special Attack": "特攻",
	"Defense": "防御",
	"Special Defense": "特防",
	"Speed": "素早さ",
	"accuracy": "命中",
	"evasiveness": "回避率",
	"fell": "下がった",
	"rose": "上がった",

	"The grass disappeared from the battlefield.": "足元の草が 消え去った！",
	"The mist disappeared from the battlefield.": "足元の霧が 消え去った！",
	"The electricity disappeared from the battlefield.": "足元の電気が 消え去った！",
	"The weirdness disappeared from the battlefield!": "足元の不思議感が 消え去った！",

	"Grass grew to cover the battlefield!": "足元に草が おいしげった！",
	"Mist swirls around the battlefield!": "足元に霧が 立ち込めた！",
	"An electric current runs across the battlefield!": "足元に電気が かけめぐる！",
	"The battlefield got weird!": "足元が 不思議な感じになった！",

	"The Tailwind blew from behind your team!": "味方に追い風が 吹き始めた！",
	"The Tailwind blew from behind the opposing team!": "相手に追い風が 吹き始めた！",
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

	"Its disguise served it as a decoy!": "化けの皮が 身代わりになった！",
	"'s disguise was busted!": "の 化けの皮が 剥がれた！",

	"'s Weakness Policy activated!": "の 弱点保険が 発動した！", //実機にはない
	"vanished instantly!": "の姿が 一瞬にして消えた！", //ゴーストダイブ

	// "couldn't fully protect itself and got hurt! (placeholder)":"は攻撃を守りきれずにダメージを受けた！" //placeholderとは

	// "It's super effective on":"に効果は抜群だ！",
	// "It's not very effective on":"には効果はいまひとつのようだ...",
	"It's super effective on": "効果は抜群だ！ ",
	"It's not very effective on": "効果はいまひとつのようだ... ",

	"It's super effective! The opposing": "効果は抜群だ！ 相手の",

	"twisted the dimensions!": "は時空をゆがめた！",
	"The twisted dimensions returned to normal!": "ゆがんだ時空が 元に戻った！",

	"Wide Guard protected the opposing team!": "相手の周りを ワイドガードが 守っている！",
	"Wide Guard protected your team!": "味方の周りを ワイドガードが 守っている！",

	"A sea of fire enveloped your team!": "味方の周りが 火の海に包まれた！",
	"A sea of fire enveloped the opposing team!": "相手の周りが 火の海に包まれた！",
	"The sea of fire around your team disappeared!": "味方の周りの 火の海が消えた！",
	"The sea of fire around the opposing team disappeared!": "相手の周りの 火の海が消えた！",

	"is confused!": "は混乱している！",
	"'s substitute faded!": "の身代わりは 消えてしまった！",

	"'s Misty Seed activated!": "の ミストシードが 発動した！",
	"'s Electric Seed activated!": "の エレキシードが 発動した！",
	"'s Grassy Seed activated!": "の グラスシードが 発動した！",
	"'s Psychic Seed activated!": "の サイコシードが 発動した！",

	"surrounds itself with psychic terrain!": "は サイコフィールドに 守られている！",
	"surrounds itself with electrified terrain!": "は エレキフィールドに 守られている！",
	"surrounds itself with a protective mist!": "は ミストフィールドに 守られている！",

	"became the center of attention!": "は 注目の的になった！",
	"couldn't fully protect itself and got hurt!": "は 攻撃を守りきれずに ダメージを受けた！",

	"absorbed light!": "は 光を吸収した！",
	"avoids attacks by its ally Pokémon!": "は 味方からの攻撃を受けない！",

	"and": "と",
	"and the opposing": "と", //サイドチェンジの時 他の場面での暴発があるかも
	"switched places.": "は場所を入れ替えた！",

	"(Max Guard activated!)": "(ダイウォールで攻撃から身を守った！)"
};


var QQ = $.noConflict();
var regex_ability = new RegExp(/Ability: ([A-Za-z- ]+)$/);
var regex_abi_and_item = new RegExp(/Ability: ([A-Za-z- ]+) \/ Item: ([(A-Za-z- ]+[A-za-z)])$/);
var regex_possible_ability = new RegExp(/Possible abilities: ([A-za-z- ]+[A-za-z])$/);
var regex_possible_ability2 = new RegExp(/Possible abilities: ([A-za-z- ]+[A-za-z]), ([A-za-z- ]+[A-za-z])$/);
var regex_possible_ability3 = new RegExp(/Possible abilities: ([A-za-z- ]+[A-za-z]), ([A-za-z- ]+[A-za-z]), ([A-za-z- ]+[A-za-z])$/);
var regex_Item = new RegExp(/Item: ([(A-Za-z- ]+[A-za-z)])$/);
var regex_stat_change = new RegExp(/^'s ([A-za-z ]+) (fell|rose) ?(sharply|harshly)?! ?(The opposing)?/);
var regex_magic_bounce = new RegExp(/bounced the ([A-za-z -']+) back!/);
var regex_preview = new RegExp(/^([A-za-z0-9* -]+ \/ )+([A-za-z0-9* -]+)$/);
//var regex_start_battle = new RegExp(/Battle between (.+) and (.+) started!/);
var regex_start_battle = new RegExp(/Battle started between (.+) and (.+)!/);
var regex_uturn = new RegExp(/(.+) went back to (.*)!/);
var regex_hurtby = new RegExp(/is hurt by ([A-Za-z- ]+)!/);
var regex_gems = new RegExp(/The ([A-za-z ]+) strengthened ([A-za-z- ]+)'s power!/);
var regex_eat = new RegExp(/(.+) ate its ([A-Za-z ]+)!/);
var regex_restorehp = new RegExp(/(.+) restored HP using its ([A-Za-z ]+)!/);

// var regex_pointed_stones=new RegExp(/Pointed stones dug into (the opposing )?([A-za-z -']+)!/);
var regex_pointed_stones = new RegExp(/Pointed stones dug into/);
var regex_doesnt_affect = new RegExp(/It doesn't affect (the opposing )?([A-za-z -']+).../);
var regex_forme = new RegExp(/(sent out $)|(withdrew $)|(Go! $)/);
var regex_z_prtct = new RegExp(/([A-za-z -']+) couldn't fully protect itself and got hurt!/);
var regex_megastone = new RegExp(/(.+)'s ([A-Za-z ]+) is reacting to the Key Stone!/);
var regex_effective_on = new RegExp(/(It's super effective on|It's not very effective on) (the opposing )?([A-Za-z -']+) ?[\.!] ?(A critical hit on)?.*/);
var regex_crit_on = new RegExp(/A critical hit on (the opposing )?([A-Za-z -']+) !/);
var regex_weakened = new RegExp(/The ([A-Za-z ]+) weakened the damage to (the opposing )?([A-Za-z -']+) !/);
var regex_Z_hojo = new RegExp(/^Z-([A-Za-z ]+)/);
var regex_Z_boost = new RegExp(/boosted its ([A-Za-z ]+) using its Z-Power!/);
var regex_copied = new RegExp(/copied (the opposing )?([A-Za-z ]+) 's (stat changes)?([A-Za-z -]+ Ability)?!/);
var regex_instruct = new RegExp(/used the move instructed by (the opposing )?([A-Za-z ]+) !/);

var regex_search = new RegExp(/It's not very effective on|It's super effective on|\.? ?A critical hit on| weakened the damage to /);
// var regex_search = new RegExp(/It's not very effective on|It's super effective on|\.? ?A critical hit on/);

// var regex_first = new RegExp(/([A-Za-z ]+)(?:, )?([A-Za-z ]+)?(?:, )?([A-Za-z ]+)?(?:, )?([A-Za-z ]+)?(?:, )?([A-Za-z ]+)?(?:, )?([A-Za-z ]+)? will be sent out first/);
var regex_first = new RegExp(/will be sent out first/);
var regex_frisk = new RegExp(/(The opposing)? ?([A-Za-z -']+) frisked (the opposing )?([A-Za-z -']+) and found its ([A-Za-z -']+)!/);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var regex_joined = new RegExp(/(.+) joined./);
var regex_left = new RegExp(/(.+) left./);
var regex_battleoptions = new RegExp(/Battle(.*)Options/);
var regex_whatwilldo = new RegExp(/What will (.+) do?/);
var regex_alreadyinbattle = new RegExp(/(.+) is already in battle!/);
var regex_2users = new RegExp(/([0-9]+) users/);
var regex_moveused = new RegExp(/(The opposing)* (.+) used (.+)/);
//var regex_wonthebattle = new RegExp(/(.+) won the battle！/);
//var regex_rose = new RegExp(/(\S{3})× (\S{3})/);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ⦿置換①
//;
var t = function (originalStr, n) {
	var tmp = originalStr.trim(); // trim()は文字列の両端の空白を削除

	// console.log(tmp);

	// 定義に存在する単語の場合はそのまま置換して返す
	if (translateText(tmp) !== tmp) {
		return translateText(tmp);
	}

	if (tmp.indexOf("'s ") != -1 && tmp.indexOf("!]") != -1) { // 特性？
		tmp = tmp.replace("'s ", "").replace("!]", "");
		return "の" + translateText(tmp) + "！]";
	}

	var splitted, poke_name, text, opp, text1, text2;

	// スロースタート The opposing Regigigas can't get it going!

	// indexOf 対象の文字列の中に指定した文字列が含まれるかどうか検索し、含まれていた場合は最初の見つかった位置を返す
	// match マッチした結果を含む配列が返される
	// test trueかfalseを返す
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// ⦿置換②
	//;
	// 新たに一から作り直した置換スクリプト！！！
	// 翻訳(translations)の定義を使う複雑な文の置換
	// 取得した文字列tmpに特定の文字列が含まれていたら // "The opposing "が含まれていたらカットし"相手の "を最終的な出力文に追加 //splittedに分割 // 分割したパーツごとに翻訳
	/* // 【テンプレ】
		if (tmp.indexOf("") !== -1) {
			if (tmp.indexOf("The opposing ") !== -1){tmp=tmp.slice(13); opp="相手の";} else{tmp=tmp.slice(0); opp="";}
			splitted =tmp.split("");
			return opp + translateText(splitted[0]) + "" + translateText(splitted[1]);
		}
	*/

	// はダイマックスした！ (The opposing Hydreigon's Dynamax!)
	if (tmp.indexOf("'s Dynamax!)") !== -1) {
		tmp = tmp.slice(1);
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("'s Dynamax!)");
		return "（" + opp + translateText(splitted[0]) + "はダイマックスした！）";
	}

	// の姿は元に戻った！ (The opposing Hydreigon returned to normal!)
	if (tmp.indexOf(" returned to normal!)") !== -1) {
		tmp = tmp.slice(1);
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" returned to normal!)");
		return "（" + opp + translateText(splitted[0]) + "の姿は元に戻った！）";
	}

	// の弱点保険が発動した！ (The opposing Aegislash used its Weakness Policy!)
	if (tmp.indexOf(" used its Weakness Policy!") !== -1) {
		tmp = tmp.slice(1);
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" used its Weakness Policy!");
		return "（" + opp + translateText(splitted[0]) + "の弱点保険が発動した！）";
	}

	// は反動で ダメージを受けた！ The opposing Snorlax was damaged by the recoil!
	if (tmp.indexOf(" was damaged by the recoil!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was damaged by the recoil!");
		return opp + translateText(splitted[0]) + "は反動でダメージを受けた！";
	}

	// はダイウォールで守りの体勢に入った！ (Max Guard started on the opposing Aegislash!)
	if (tmp.indexOf("(Max Guard started on ") !== -1) {
		tmp = tmp.slice(22);
		if (tmp.indexOf("the opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("!)");
		return "(" + opp + translateText(splitted[0]) + "はダイウォールで守りの体勢に入った！)";
	}

	// のシールドを 破った！ It broke through Smeargle's protection!
	if (tmp.indexOf("It broke through ") !== -1 && tmp.indexOf("'s protection!") !== -1) {
		tmp = tmp.slice(17);
		if (tmp.indexOf("the opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("'s protection!");
		return opp + translateText(splitted[0]) + "のシールドを 破った！";
	}

	// は 能力変化を 交換した！ The opposing Smeargle switched stat changes with its target!
	if (tmp.indexOf(" switched stat changes with its target!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" switched stat changes with its target!");
		return opp + translateText(splitted[0]) + "は 能力変化を 交換した！";
	}

	// は 特性を 交換した！ The opposing Azelf swapped Abilities with its target!
	if (tmp.indexOf(" swapped Abilities with its target!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" swapped Abilities with its target!");
		return opp + translateText(splitted[0]) + "は 特性を 交換した！";
	}

	// は 疲れて混乱した！ Flygon became confused due to fatigue!
	if (tmp.indexOf(" became confused due to fatigue!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" became confused due to fatigue!");
		return opp + translateText(splitted[0]) + "は 疲れて混乱した！";
	}

	// の を 引き継いだ！ Pikachu's Lightning Rod was taken over!
	if (tmp.indexOf(" was taken over!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -16);
		splitted = tmp.split("'s ");
		return opp + translateText(splitted[0]) + "の " + translateText(splitted[1]) + "を 引き継いだ！";
	}

	// は すべての オーラを 制圧する！ The opposing Zygarde reversed all other Pokémon's auras!
	if (tmp.indexOf(" reversed all other Pokémon's auras!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" reversed all other Pokémon's auras!");
		return opp + translateText(splitted[0]) + "は すべての オーラを 制圧する！";
	}

	// は 悪夢に 捕らわれている！ is locked in a nightmare!
	if (tmp.indexOf(" is locked in a nightmare!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is locked in a nightmare!");
		return opp + translateText(splitted[0]) + "は 悪夢に 捕らわれている！";
	}

	// は 悪夢を見始めた！ The opposing Darkrai began having a nightmare!
	if (tmp.indexOf(" began having a nightmare!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" began having a nightmare!");
		return opp + translateText(splitted[0]) + "は 悪夢を見始めた！";
	}

	// は うなされている！ The opposing Darkrai is tormented!
	if (tmp.indexOf(" is tormented!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is tormented!");
		return opp + translateText(splitted[0]) + "は うなされている！";
	}

	// の は の メガバングルに 反応した！ Blaziken-Mega's Blazikenite is reacting to Hihihiroshi's Mega Bracelet!
	if (tmp.indexOf("'s Mega Bracelet!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -17);
		splitted = tmp.split("'s ");
		splitted2 = splitted[1].split(" is reacting to ");
		return opp + translateText(splitted[0]) + "の " + translateText(splitted2[0]) + "は " + splitted2[1] + "の メガバングルに 反応した！";
	}

	// は の キーストーンに 反応した！ The opposing Rayquaza-Mega is reacting to 's Key Stone!
	if (tmp.indexOf(" is reacting to ") !== -1 && tmp.indexOf("ite") == -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -13);
		splitted = tmp.split(" is reacting to ");
		return opp + translateText(splitted[0]) + "は " + splitted[1] + "の キーストーンに 反応した！";
	}

	// タマゴわざ： Egg from Sewaddle
	if (tmp.indexOf("Egg from ") !== -1) {
		splitted = tmp.split("Egg from ");
		return "タマゴわざ：" + translateText(splitted[1]);
	}

	// 進化前限定のわざ： Level-up from Swadloon
	if (tmp.indexOf("Level-up from ") !== -1) {
		splitted = tmp.split("Level-up from ");
		return "進化前限定のわざ：" + translateText(splitted[1]);
	}

	// は 拘束から 抜け出した！ The opposing Smeargle was freed from Infestation!
	if (tmp.indexOf(" was freed from Infestation!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was freed from Infestation!");
		return opp + translateText(splitted[0]) + "は 拘束から 抜け出した！";
	}

	// は まとわりつくの ダメージを 受けている The opposing Smeargle is hurt by Infestation!
	if (tmp.indexOf(" is hurt by Infestation!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is hurt by Infestation!");
		return opp + translateText(splitted[0]) + "は まとわりつくの ダメージを 受けている";
	}

	// は に まとわりつかれた！ The opposing Smeargle has been afflicted with an infestation by Smeargle!
	if (tmp.indexOf(" has been afflicted with an infestation by ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp2 = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp2 = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" has been afflicted with an infestation by ");
		return opp + translateText(splitted[0]) + "は " + opp2 + translateText(splitted[1]) + "に まとわりつかれた！";
	}

	// は うずしおから 抜け出した！ The opposing Smeargle was freed from Whirlpool!
	if (tmp.indexOf(" was freed from Whirlpool!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was freed from Whirlpool!");
		return opp + translateText(splitted[0]) + "は うずしおから 抜け出した！";
	}

	// は うずしおの ダメージを 受けている The opposing Smeargle is hurt by Whirlpool!
	if (tmp.indexOf(" is hurt by Whirlpool!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is hurt by Whirlpool!");
		return opp + translateText(splitted[0]) + "は うずしおの ダメージを 受けている";
	}

	// は うずしおに 閉じ込められた！ The opposing Smeargle became trapped in the vortex!
	if (tmp.indexOf(" became trapped in the vortex!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" became trapped in the vortex!");
		return opp + translateText(splitted[0]) + "は うずしおに 閉じ込められた！";
	}

	// は すなじごくから 抜け出した！ The opposing Smeargle was freed from Sand Tomb!
	if (tmp.indexOf(" was freed from Sand Tomb!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was freed from Sand Tomb!");
		return opp + translateText(splitted[0]) + "は すなじごくから 抜け出した！";
	}

	// は すなじごくの ダメージを 受けている The opposing Smeargle is hurt by Sand Tomb!
	if (tmp.indexOf(" is hurt by Sand Tomb!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is hurt by Sand Tomb!");
		return opp + translateText(splitted[0]) + "は すなじごくの ダメージを 受けている";
	}

	// は すなじごくに 閉じ込められた！ The opposing Smeargle became trapped by the quicksand!
	if (tmp.indexOf(" became trapped by the quicksand!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" became trapped by the quicksand!");
		return opp + translateText(splitted[0]) + "は すなじごくに 閉じ込められた！";
	}

	// は マグマストームから 抜け出した！ The opposing Smeargle was freed from Magma Storm!
	if (tmp.indexOf(" was freed from Magma Storm!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was freed from Magma Storm!");
		return opp + translateText(splitted[0]) + "は マグマストームから 抜け出した！";
	}

	// は マグマストームの ダメージを 受けている The opposing Smeargle is hurt by Magma Storm!
	if (tmp.indexOf(" is hurt by Magma Storm!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is hurt by Magma Storm!");
		return opp + translateText(splitted[0]) + "は マグマストームの ダメージを 受けている";
	}

	// は マグマストームに 閉じ込められた！ The opposing Smeargle became trapped by swirling magma!
	if (tmp.indexOf(" became trapped by swirling magma!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" became trapped by swirling magma!");
		return opp + translateText(splitted[0]) + "は マグマストームに 閉じ込められた！";
	}

	// は からではさむの ダメージを 受けている The opposing Smeargle is hurt by Clamp!
	if (tmp.indexOf(" is hurt by Clamp!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is hurt by Clamp!");
		return opp + translateText(splitted[0]) + "は からではさむの ダメージを 受けている";
	}

	// は の からに はさまれた！ The opposing Smeargle clamped down on Smeargle!
	if (tmp.indexOf(" clamped down on ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp2 = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp2 = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" clamped down on ");
		return opp2 + translateText(splitted[1]) + "は " + opp + translateText(splitted[0]) + "の からに はさまれた！";
	}

	// は 炎の渦から 抜け出した！ The opposing Smeargle was freed from Fire Spin!
	if (tmp.indexOf(" was freed from Fire Spin!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was freed from Fire Spin!");
		return opp + translateText(splitted[0]) + "は 炎の渦から 抜け出した！";
	}

	// は 拘束から 抜け出した！ The opposing Smeargle was freed from Wrap!
	if (tmp.indexOf(" was freed from Wrap!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was freed from Wrap!");
		return opp + translateText(splitted[0]) + "は 拘束から 抜け出した！";
	}

	// は まきつくの ダメージを 受けている The opposing Smeargle is hurt by Wrap!
	if (tmp.indexOf(" is hurt by Wrap!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is hurt by Wrap!");
		return opp + translateText(splitted[0]) + "は まきつくの ダメージを 受けている";
	}

	// は に 巻きつかれた！ The opposing Smeargle was wrapped by Smeargle!
	if (tmp.indexOf(" was wrapped by ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp2 = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp2 = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" was wrapped by ");
		return opp + translateText(splitted[0]) + "は" + opp2 + translateText(splitted[1]) + "に 巻きつかれた！";
	}

	// は 拘束から 抜け出した！ The opposing Smeargle was freed from Bind!
	if (tmp.indexOf(" was freed from Bind!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was freed from Bind!");
		return opp + translateText(splitted[0]) + "は 拘束から 抜け出した！";
	}

	// は 宿り木から 抜け出した！ The opposing Smeargle was freed from Leech Seed!
	if (tmp.indexOf(" was freed from Leech Seed!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was freed from Leech Seed!");
		return opp + translateText(splitted[0]) + "は 宿り木から 抜けだした！";
	}

	// は しめつけるの ダメージを 受けている The opposing Smeargle is hurt by Bind!
	if (tmp.indexOf(" is hurt by Bind!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is hurt by Bind!");
		return opp + translateText(splitted[0]) + "は しめつけるの ダメージを 受けている";
	}

	// は に 締め付けられた！ The opposing Smeargle was squeezed by Smeargle!
	if (tmp.indexOf(" was squeezed by ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp2 = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp2 = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" was squeezed by ");
		return opp + translateText(splitted[0]) + "は " + opp2 + translateText(splitted[1]) + "に 締め付けられた！";
	}

	// は 体力を削って に 呪いをかけた！ The opposing Mimikyu-Busted cut its own HP and put a curse on Heatran!
	if (tmp.indexOf(" cut its own HP and put a curse on ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp2 = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp2 = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" cut its own HP and put a curse on ");
		return opp + translateText(splitted[0]) + "は 体力を削って " + opp2 + translateText(splitted[1]) + "に 呪いをかけた！";
	}

	// は 呪われている！ Heatran is afflicted by the curse!
	if (tmp.indexOf(" is afflicted by the curse!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is afflicted by the curse!");
		return opp + translateText(splitted[0]) + "は 呪われている！";
	}

	// は を はね返した！ The opposing Espeon bounced the Stealth Rock back!
	if (tmp.indexOf(" back!") !== -1 && tmp.indexOf(" bounced ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -6);
		splitted = tmp.split(" bounced the ");
		return opp + translateText(splitted[0]) + "は " + translateText(splitted[1]) + "を はね返した！";
	}

	// は みらいよちの 攻撃を受けた！ The opposing Alakazam-Mega took the Future Sight attack!
	if (tmp.indexOf(" took the Future Sight attack!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" took the Future Sight attack!");
		return opp + translateText(splitted[0]) + "は みらいよちの 攻撃を受けた！";
	}

	// は 未来に 攻撃を 予知した！ The opposing Mewtwo foresaw an attack!
	if (tmp.indexOf(" foresaw an attack!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" foresaw an attack!");
		return opp + translateText(splitted[0]) + "は 未来に 攻撃を 予知した！";
	}

	// の ゲンシカイキ！ 原始の力を取り戻した！ The opposing Groudon's Primal Reversion! It reverted to its primal state!
	if (tmp.indexOf("'s Primal Reversion! It reverted to its primal state!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("'s Primal Reversion! It reverted to its primal state!");
		return opp + translateText(splitted[0]) + "の ゲンシカイキ！ 原始の力を取り戻した！";
	}

	// の イリュージョンが 解けた！ The opposing Zoroark's illusion wore off!
	if (tmp.indexOf("'s illusion wore off!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("'s illusion wore off!");
		return opp + translateText(splitted[0]) + "の イリュージョンが 解けた！";
	}

	// (The opposing Groudon is being withdrawn...)
	if (tmp.indexOf(" is being withdrawn...)") !== -1) {
		tmp = tmp.slice(1);
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is being withdrawn...)");
		return "(" + opp + translateText(splitted[0]) + "は 交代されようとしている...)";
	}

	// (the opposing Minior stopped shielding itself.)
	if (tmp.indexOf(" stopped shielding itself.)") !== -1) {
		tmp = tmp.slice(1);
		if (tmp.indexOf("the opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" stopped shielding itself.)");
		return "(" + opp + translateText(splitted[0]) + "は 守りを解いた)";
	}

	// (the opposing Minior shielded itself.)
	if (tmp.indexOf(" shielded itself.)") !== -1) {
		tmp = tmp.slice(1);
		if (tmp.indexOf("the opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" shielded itself.)");
		return "(" + opp + translateText(splitted[0]) + "は 守りを固めた)";
	}

	// は 攻撃を こらえた！ Giratina endured the hit!
	if (tmp.indexOf(" endured the hit!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" endured the hit!");
		return opp + translateText(splitted[0]) + "は 攻撃を こらえた！";
	}

	// は 一瞬にして 姿を消した！ Giratina vanished instantly!
	if (tmp.indexOf(" vanished instantly!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" vanished instantly!");
		return opp + translateText(splitted[0]) + "は 一瞬にして 姿を消した！";
	}

	// の かなしばりが 解けた！ The opposing Yveltal's move is no longer disabled!
	if (tmp.indexOf("'s move is no longer disabled!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("'s move is no longer disabled!");
		return opp + translateText(splitted[0]) + "の かなしばりが 解けた！";
	}

	// は を 使えない！ Yveltal can't use Disable!
	if (tmp.indexOf(" can't use ") !== -1 && tmp.indexOf("!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" can't use ");
		return opp + translateText(splitted[0]) + "は " + translateText(splitted[1]) + "を 使えない！";
	}

	// の を 封じ込めた！ The opposing Yveltal's Oblivion Wing was disabled!
	if (tmp.indexOf(" was disabled!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -14);
		splitted = tmp.split("'s ");
		return opp + translateText(splitted[0]) + "の " + translateText(splitted[1]) + "を 封じ込めた！";
	}

	// を 激しい光が包む！ The opposing Yveltal became cloaked in a harsh light!
	if (tmp.indexOf(" became cloaked in a harsh light!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" became cloaked in a harsh light!");
		return opp + translateText(splitted[0]) + "を 激しい光が包む！";
	}

	// いやしのねがいが に届いた！ The healing wish came true for the opposing Skarmory!
	if (tmp.indexOf("The healing wish came true for ") !== -1) {
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split("The healing wish came true for ");
		return "いやしのねがいが " + opp + translateText(splitted[1]) + "に 届いた！";
	}

	// は メロメロになった！ The opposing Skarmory fell in love!
	if (tmp.indexOf(" fell in love!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" fell in love!");
		return opp + translateText(splitted[0]) + "は メロメロになった！";
	}

	// は 身軽になった！ The opposing Skarmory became nimble!
	if (tmp.indexOf(" became nimble!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" became nimble!");
		return opp + translateText(splitted[0]) + "は 身軽になった！";
	}

	// は フェイントに 引っかかった！ Skarmory fell for the feint!
	if (tmp.indexOf(" fell for the feint!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" fell for the feint!");
		return opp + translateText(splitted[0]) + "は フェイントに 引っかかった！";
	}

	// は こらえる たいせいに 入った！ The opposing Gardevoir braced itself!
	if (tmp.indexOf(" braced itself!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" braced itself!");
		return opp + translateText(splitted[0]) + "は こらえる たいせいに 入った！";
	}

	// は の を トレースした！ The opposing Gardevoir traced Gardevoir's Sturdy!
	if (tmp.indexOf(" traced ") !== -1 && tmp.indexOf("'s ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp2 = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp2 = "";
		}
		tmp = tmp.slice(0, -1)
		splitted = tmp.split(" traced ");
		splitted2 = splitted[1].split("'s ");
		return opp + translateText(splitted[0]) + "は " + translateText(splitted2[0]) + "の " + translateText(splitted2[1]) + "を トレースした！";
	}

	// は 特性が ふみんになった！ The opposing Xerneas acquired Insomnia!
	if (tmp.indexOf(" acquired Insomnia!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" acquired Insomnia!");
		return opp + translateText(splitted[0]) + "は 特性が ふみんになった！";
	}

	// の が治った！ The opposing Zygarde was cured of paralysis.
	if (tmp.indexOf(" was cured of ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" was cured of ");
		return opp + translateText(splitted[0]) + "の " + translateText(splitted[1]) + "が治った！";
	}

	// は がまんの限界だ！ The opposing Charizard unleashed its energy!
	if (tmp.indexOf(" unleashed its energy!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" unleashed its energy!");
		return opp + translateText(splitted[0]) + "は がまんの限界だ！";
	}

	// は 変身した！ The opposing Castform transformed!
	if (tmp.indexOf(" transformed!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" transformed!");
		return opp + translateText(splitted[0]) + "は 変身した！";
	}

	// は になった！ transformed into !
	if (tmp.indexOf(" transformed into ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		tmp = tmp.replace(" its ", " ");
		splitted = tmp.split(" transformed into ");
		let tEnd = "になった！";
		if (splitted[1] == "Complete Forme") {
			splitted[1] = "パーフェクトフォルム";
			tEnd = "に変わった！";
		}
		return opp + translateText(splitted[0]) + "は " + translateText(splitted[1]) + tEnd;
	}

	// は がまんしている！ The opposing Charizard is storing energy!
	if (tmp.indexOf(" is storing energy!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is storing energy!");
		return opp + translateText(splitted[0]) + "は がまんしている！";
	}

	// は Ｚパワーで が上がった！ The opposing Charizard boosted its Speed using its Z-Power!
	if (tmp.indexOf(" using its Z-Power!") !== -1 && tmp.indexOf(" boosted its ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -19);
		splitted = tmp.split(" boosted its ");
		return opp + translateText(splitted[0]) + "は Ｚパワーで" + translateText(splitted[1]) + "が上がった！";
	}

	// は サンパワーで ダメージを受けた (The opposing Charizard was hurt by its Solar Power.)
	if (tmp.indexOf(" was hurt by its Solar Power.)") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(14);
			opp = "相手の";
		} else {
			tmp = tmp.slice(1);
			opp = "";
		}
		splitted = tmp.split(" was hurt by its Solar Power.)");
		return "(" + opp + translateText(splitted[0]) + "は サンパワーで ダメージを受けた)";
	}

	// は 空高く 飛び上がった！ The opposing Zekrom flew up high!
	if (tmp.indexOf(" flew up high!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" flew up high!");
		return opp + translateText(splitted[0]) + "は 空高く 飛び上がった！";
	}

	// は 精神を集中させた！ The opposing Zekrom concentrated intensely!
	if (tmp.indexOf(" concentrated intensely!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" concentrated intensely!");
		return opp + translateText(splitted[0]) + "は 精神を集中させた！";
	}

	// は に 狙いを定めた！ The opposing Smeargle took aim at Smeargle!
	if (tmp.indexOf(" took aim at ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp2 = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp2 = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" took aim at ");
		return opp + translateText(splitted[0]) + "は " + opp2 + translateText(splitted[1]) + "に 狙いを定めた！";
	}

	// は 磁力のちからで 宙に浮いた！ The opposing Zekrom levitated with electromagnetism!
	if (tmp.indexOf(" levitated with electromagnetism!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" levitated with electromagnetism!");
		return opp + translateText(splitted[0]) + "は 磁力のちからで 宙に浮いた！";
	}

	// と は 場所を入れ替えた！ The opposing Smeargle and the opposing Zekrom switched places!
	if (tmp.indexOf(" switched places!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp2 = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp2 = "";
		}
		tmp = tmp.slice(0, -17);
		splitted = tmp.split(" and ");
		return opp + translateText(splitted[0]) + "と " + opp2 + translateText(splitted[1]) + "は 場所を入れ替えた！";
	}

	// の風船は 割れてしまった！ 's Air Balloon popped!
	if (tmp.indexOf("'s Air Balloon popped!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("'s Air Balloon popped!");
		return opp + translateText(splitted[0]) + "の風船は 割れてしまった！";
	}

	// は ワイドガードに 守られた！ Wide Guard protected the opposing Smeargle!
	if (tmp.indexOf("Wide Guard protected ") !== -1) {
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split("Wide Guard protected ");
		return opp + translateText(splitted[1]) + "は ワイドガードに 守られた！";
	}

	// は を放っている！ The opposing Xerneas is radiating a fairy aura!
	if (tmp.indexOf(" is radiating a ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" is radiating a ");
		if (splitted[1] == "fairy aura") {
			splitted[1] = "Fairy Aura";
		}
		if (splitted[1] == "dark aura") {
			splitted[1] = "Dark Aura";
		}
		if (splitted[1] == "bursting aura") {
			splitted[1] = "はじけるオーラ";
		}
		if (splitted[1] == "blazing aura") {
			splitted[1] = "燃え盛るオーラ";
		}
		return opp + translateText(splitted[0]) + "は " + translateText(splitted[1]) + "を放っている！";
	}

	// は を食べた！ The opposing Ferrothorn ate its Occa Berry!
	if (tmp.indexOf(" ate its ") !== -1 && tmp.indexOf("!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" ate its ");
		return opp + translateText(splitted[0]) + "は " + translateText(splitted[1]) + "を食べた！";
	}

	// を くり出します Mew will switch in.
	if (tmp.indexOf(" will switch in.") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" will switch in.");
		return opp + translateText(splitted[0]) + "を くり出します";
	}

	// の 願い事が かなった！ Smeargle's wish came true!
	if (tmp.indexOf("'s wish came true!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("'s wish came true!");
		return opp + translateText(splitted[0]) + "の 願い事が かなった！";
	}

	// は 傷ついた！ The opposing Ferrothorn was hurt!
	if (tmp.indexOf(" was hurt!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was hurt!");
		return opp + translateText(splitted[0]) + "は 傷ついた！";
	}

	// は くっつきバリで ダメージを受けた！ The opposing Smeargle is hurt by its Sticky Barb!
	if (tmp.indexOf(" is hurt by its Sticky Barb!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is hurt by its Sticky Barb!");
		return opp + translateText(splitted[0]) + "は くっつきバリで ダメージを受けた！";
	}

	// の 眠気を誘った！ The opposing Reshiram grew drowsy!
	if (tmp.indexOf(" grew drowsy!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" grew drowsy!");
		return opp + translateText(splitted[0]) + "の 眠気を誘った！";
	}

	// しかし の 攻撃は外れた！ The opposing Poliwhirl's attack missed!
	if (tmp.indexOf("'s attack missed!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("'s attack missed!");
		return "しかし " + opp + translateText(splitted[0]) + "の 攻撃は外れた！";
	}

	// は まきびしの ダメージを受けた！ The opposing Ferrothorn is hurt by the spikes!
	if (tmp.indexOf(" is hurt by the spikes!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is hurt by the spikes!");
		return opp + translateText(splitted[0]) + "は まきびしの ダメージを受けた！";
	}

	// は もう逃げられない！ The opposing Mew can no longer escape!
	if (tmp.indexOf(" can no longer escape!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" can no longer escape!");
		return opp + translateText(splitted[0]) + "は もう逃げられない！";
	}

	// は ぐうぐう眠っている！ The opposing Whimsicott is fast asleep.
	if (tmp.indexOf(" is fast asleep.") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is fast asleep.");
		return opp + translateText(splitted[0]) + "は ぐうぐう眠っている！";
	}

	// は 眠って元気になった！ The opposing Whimsicott slept and became healthy!
	if (tmp.indexOf(" slept and became healthy!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" slept and became healthy!");
		return opp + translateText(splitted[0]) + "は 眠って元気になった！";
	}

	// は ほのおのうずで ダメージを受けている！ The opposing Whimsicott is hurt by Fire Spin!
	if (tmp.indexOf(" is hurt by Fire Spin!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is hurt by Fire Spin!");
		return opp + translateText(splitted[0]) + "は ほのおのうずで ダメージを受けている！";
	}

	// あられが を襲う！ The opposing Whimsicott is buffeted by the hail!
	if (tmp.indexOf(" is buffeted by the hail!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is buffeted by the hail!");
		return "あられが " + opp + translateText(splitted[0]) + "を襲う！";
	}

	// は 炎の渦に 閉じこめられた！ The opposing Whimsicott became trapped in the fiery vortex!
	if (tmp.indexOf(" became trapped in the fiery vortex!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" became trapped in the fiery vortex!");
		return opp + translateText(splitted[0]) + "は 炎の渦に 閉じこめられた！";
	}

	// は 光を吸収した！ The opposing Arcanine absorbed light!
	if (tmp.indexOf(" absorbed light!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" absorbed light!");
		return opp + translateText(splitted[0]) + "は 光を吸収した！";
	}

	// 指を振ったら がでた！ Waggling a finger let it use Psych Up!
	if (tmp.indexOf("Waggling a finger let it use ") !== -1) {
		//if (tmp.indexOf("The opposing ") !== -1){tmp=tmp.slice(13); opp="相手の";} else{tmp=tmp.slice(0); opp="";}
		splitted = tmp.split("Waggling a finger let it use ");
		return "指を振ったら " + translateText(splitted[1]) + " がでた！";
	}

	// は を 手助けする体勢に入った！ Togekiss is ready to help Ferrothorn!
	if (tmp.indexOf(" is ready to help ") !== -1) {
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" is ready to help ");
		return opp + translateText(splitted[0]) + "は " + opp + translateText(splitted[1]) + "を 手助けする体勢に入った！";
	}

	// は しろいハーブで 能力が もとに戻った！ The opposing Mew returned its status to normal using its White Herb!
	if (tmp.indexOf(" returned its status to normal using its White Herb!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" returned its status to normal using its White Herb!");
		return opp + translateText(splitted[0]) + "は しろいハーブで 能力が もとに戻った！";
	}

	// は 注目の的になった！ Togekiss became the center of attention!
	if (tmp.indexOf(" became the center of attention!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" became the center of attention!");
		return opp + translateText(splitted[0]) + "は 注目の的になった！";
	}

	// 勢いあまって は 地面にぶつかった！ The opposing Mienshao kept going and crashed!
	if (tmp.indexOf(" kept going and crashed!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" kept going and crashed!");
		return "勢いあまって " + opp + translateText(splitted[0]) + "は 地面にぶつかった！";
	}

	// は は反動で ダメージを受けた！ Rampardos is damaged by the recoil!
	if (tmp.indexOf(" is damaged by the recoil!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is damaged by the recoil!");
		return opp + translateText(splitted[0]) + "は は反動で ダメージを受けた！";
	}

	// の アンコールが解けた！ Liepard's encore ended!
	if (tmp.indexOf("'s encore ended!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("'s encore ended!");
		return opp + translateText(splitted[0]) + "の アンコールが解けた！";
	}

	// は パワフルハーブで 力がみなぎった！ Smeargle became fully charged due to its Power Herb!
	if (tmp.indexOf(" became fully charged due to its Power Herb!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" became fully charged due to its Power Herb!");
		return opp + translateText(splitted[0]) + "は パワフルハーブで 力がみなぎった！";
	}

	// は パワーをためこんでいる！ Smeargle is absorbing power!
	if (tmp.indexOf(" is absorbing power!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is absorbing power!");
		return opp + translateText(splitted[0]) + "は パワーをためこんでいる！";
	}

	// は 集中が途切れて 技が出せなかった！ The opposing Mienshao lost its focus and couldn't move!
	if (tmp.indexOf(" lost its focus and couldn't move!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" lost its focus and couldn't move!");
		return opp + translateText(splitted[0]) + "は 集中が途切れて 技が出せなかった！";
	}

	// は の 能力変化を コピーした！ Liepard copied the opposing Mienshao's stat changes!
	if (tmp.indexOf(" copied ") !== -1 && tmp.indexOf("'s stat changes!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp2 = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp2 = "";
		}
		tmp = tmp.slice(0, -16);
		splitted = tmp.split(" copied ");
		return opp + translateText(splitted[0]) + "は " + opp2 + translateText(splitted[1]) + "の 能力変化をコピーした！";
	}

	// の 特性が 効かなくなった！ The opposing Mienshao's Ability was suppressed!
	if (tmp.indexOf("'s Ability was suppressed!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("'s Ability was suppressed!");
		return opp + translateText(splitted[0]) + "の 特性が 効かなくなった！";
	}

	// は で 体力を回復した！ Naganadel restored a little HP using its Black Sludge!
	if (tmp.indexOf(" restored a little HP using its ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" restored a little HP using its ");
		return opp + translateText(splitted[0]) + "は " + translateText(splitted[1]) + "で 体力を回復した！";
	}
	// は で 体力を回復した！ The opposing Tapu Bulu restored HP using its Grassy Terrain!
	if (tmp.indexOf(" restored HP using its ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" restored HP using its ");
		return opp + translateText(splitted[0]) + "は " + translateText(splitted[1]) + "で 体力を回復した！";
	}

	// は せんせいのツメで 行動が早くなった！ The opposing Mienshao's Quick Claw let it move first!
	if (tmp.indexOf(" let it move first!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.replace(" let it move first!", " ");
		tmp = tmp.slice(0, -1);
		splitted = tmp.split("'s ");
		return opp + translateText(splitted[0]) + "は " + translateText(splitted[1]) + "で 行動が早くなった！";
	}

	// は の を はたき落とした！ The opposing Liepard knocked off Liepard's Mental Herb!
	if (tmp.indexOf(" knocked off ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp2 = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp2 = "";
		}
		tmp = tmp.slice(0, -1)
		splitted = tmp.split(" knocked off ");
		splitted2 = splitted[1].split("'s ");
		return opp + translateText(splitted[0]) + "は " + opp2 + translateText(splitted2[0]) + "の " + translateText(splitted2[1]) + "を はたき落とした！";
	}

	// から 体力を吸い取った！ Mewtwo had its energy drained!
	if (tmp.indexOf(" had its energy drained!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" had its energy drained!");
		return opp + translateText(splitted[0]) + "から 体力を吸い取った！";
	}

	// 攻撃のは反動で は動けない！ The opposing Arceus must recharge!
	if (tmp.indexOf(" must recharge!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" must recharge!");
		return "攻撃のは反動で " + opp + translateText(splitted[0]) + "は動けない！";
	}

	// は だっしゅつボタンで 戻っていく！ Arceus is switched out with the Eject Button!
	if (tmp.indexOf(" is switched out with the Eject Button!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is switched out with the Eject Button!");
		return opp + translateText(splitted[0]) + "は だっしゅつボタンで 戻っていく！";
	}


	// の 滅びのカウントが になった！ Smeargle's perish count fell to 3.
	if (tmp.indexOf("'s perish count fell to ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split("'s perish count fell to ");
		return opp + translateText(splitted[0]) + "の 滅びのカウントが " + splitted[1] + "になった！";
	}

	// は 猛毒をあびた！ Smeargle was badly poisoned!
	if (tmp.indexOf(" was badly poisoned!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was badly poisoned!");
		return opp + translateText(splitted[0]) + "は 猛毒をあびた！";
	}

	// は いちゃもんを つけられた！ Smeargle was subjected to torment!
	if (tmp.indexOf(" was subjected to torment!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was subjected to torment!");
		return opp + translateText(splitted[0]) + "は いちゃもんを つけられた！";
	}

	// の指示で は 技をくり出した！ Smeargle used the move instructed by the opposing Smeargle!
	if (tmp.indexOf(" used the move instructed by ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp2 = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp2 = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" used the move instructed by ");
		return opp2 + translateText(splitted[0]) + "の指示で " + opp + translateText(splitted[1]) + "は 技をくり出した！";
	}

	// やどりぎが の体力を奪う！ Smeargle's health is sapped by Leech Seed!
	if (tmp.indexOf("'s health is sapped by Leech Seed!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("'s health is sapped by Leech Seed!");
		return "やどりぎが " + opp + translateText(splitted[0]) + "の体力を奪う！";
	}

	// に 種を植えつけた！ The opposing Smeargle was seeded!
	if (tmp.indexOf(" was seeded!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was seeded!");
		return opp + translateText(splitted[0]) + "に 種を植えつけた！";
	}

	// は ふうせんで 浮いている！ The opposing Smeargle floats in the air with its Air Balloon!
	if (tmp.indexOf(" floats in the air with its Air Balloon!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" floats in the air with its Air Balloon!");
		return opp + translateText(splitted[0]) + "は ふうせんで 浮いている！";
	}

	// は 戦闘に引きずり出された！ ゲンガー was dragged out!
	if (tmp.indexOf("was dragged out!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("was dragged out!");
		return opp + translateText(splitted[0]) + "は 戦闘に引きずり出された！";
	}

	// は レッドカードを  に たたきつけた！ The opposing Heatran held up its Red Card against Heatran!
	if (tmp.indexOf(" held up its Red Card against ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp2 = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp2 = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" held up its Red Card against ");
		return opp + translateText(splitted[0]) + "は レッドカードを" + opp2 + translateText(splitted[1]) + "に 叩きつけた！";
	}

	// は 凍ってしまって 動けない！ The opposing Heatran is frozen solid!
	if (tmp.indexOf(" is frozen solid!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is frozen solid!");
		return opp + translateText(splitted[0]) + "は 凍ってしまって 動けない！";
	}

	// は 凍りついた！ The opposing Heatran was frozen solid!
	if (tmp.indexOf(" was frozen solid!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was frozen solid!");
		return opp + translateText(splitted[0]) + "は 凍りついた！";
	}

	// しぜんのちからは  になった！ Nature Power turned into Tri Attack!
	if (tmp.indexOf("Nature Power turned into ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split("Nature Power turned into ");
		return opp + "しぜんのちからは " + translateText(splitted[1]) + "になった！";
	}

	// は 騒いでいる！ The opposing Heatran is making an uproar!
	if (tmp.indexOf(" is making an uproar!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is making an uproar!");
		return opp + translateText(splitted[0]) + "は 騒いでいる！";
	}


	// は 騒ぎ始めた！ The opposing Heatran caused an uproar!
	if (tmp.indexOf(" caused an uproar!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" caused an uproar!");
		return opp + translateText(splitted[0]) + "は 騒ぎ始めた！";
	}

	// は 相手と 攻撃と特攻の能力変化を 入れ替えた！ The opposing Mewtwo switched all changes to its Attack and Sp. Atk with its target!
	if (tmp.indexOf(" switched all changes to its Attack and Sp. Atk with its target!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" switched all changes to its Attack and Sp. Atk with its target!");
		return opp + translateText(splitted[0]) + "は 相手と 攻撃と特攻の能力変化を 入れ替えた！";
	}

	// は 体力を回復した！ The opposing Mewtwo restored its HP.
	if (tmp.indexOf(" restored its HP.") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" restored its HP.");
		return opp + translateText(splitted[0]) + "は 体力を回復した！";
	}

	// は 体力を回復した！ Gastrodon had its HP restored.
	if (tmp.indexOf(" had its HP restored.") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" had its HP restored.");
		return opp + translateText(splitted[0]) + "は 体力を回復した！";
	}

	// は マジックコートに 包まれた！ The opposing Mewtwo shrouded itself with Magic Coat!
	if (tmp.indexOf(" shrouded itself with Magic Coat!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" shrouded itself with Magic Coat!");
		return opp + translateText(splitted[0]) + "は マジックコートに 包まれた！";
	}

	// は 集中力を 高めている！ Smeargle is tightening its focus!
	if (tmp.indexOf(" is tightening its focus!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is tightening its focus!");
		return opp + translateText(splitted[0]) + "は 集中力を 高めている！";
	}

	// は 体力を削って パワー全開！ Smeargle cut its own HP and maximized its Attack!
	if (tmp.indexOf(" cut its own HP and maximized its Attack!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" cut its own HP and maximized its Attack!");
		return opp + translateText(splitted[0]) + "は 体力を削って パワー全開！";
	}


	// の 混乱が解けた！ Smeargle snapped out of its confusion!
	if (tmp.indexOf(" snapped out of its confusion!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" snapped out of its confusion!");
		return opp + translateText(splitted[0]) + "の 混乱が解けた！";
	}

	// は 混乱している！ Smeargle is confused!
	if (tmp.indexOf(" is confused!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is confused!");
		return opp + translateText(splitted[0]) + "は 混乱している！";
	}

	// は 混乱した！Smeargle became confused!
	if (tmp.indexOf(" became confused!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" became confused!");
		return opp + translateText(splitted[0]) + "は 混乱した！";
	}

	// は プレッシャーを放っている！ The opposing Mewtwo is exerting its pressure!
	if (tmp.indexOf(" is exerting its pressure!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is exerting its pressure!");
		return opp + translateText(splitted[0]) + "は プレッシャーを放っている！";
	}

	// は アンコールを受けた！ The opposing Smeargle received an encore!
	if (tmp.indexOf(" received an encore!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" received an encore!");
		return opp + translateText(splitted[0]) + "は アンコールを受けた！";
	}

	// は ほのおの 威力が上がった！ The power of Heatran's Fire-type moves rose'!
	if (tmp.indexOf("'s Fire-type moves rose") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(13);
		tmp = tmp.slice(0, -2);
		splitted = tmp.split("'s Fire-type moves rose");
		return opp + translateText(splitted[0]) + "は ほのおの 威力が上がった！";
	}

	// は を 投げつけた！ Smeargle flung its Mental Herb!
	if (tmp.indexOf(" flung its ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" flung its ");
		return opp + translateText(splitted[0]) + "は " + translateText(splitted[1]) + "を 投げつけた！";
	}

	// は ゴツゴツメットで ダメージを受けた！ Smeargle was hurt by the Rocky Helmet!
	if (tmp.indexOf(" was hurt by the Rocky Helmet!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was hurt by the Rocky Helmet!");
		return opp + translateText(splitted[0]) + "は ゴツゴツメットで ダメージを受けた！";
	}

	// 砂あらしが を襲う！ Smeargle is buffeted by the sandstorm!
	if (tmp.indexOf(" is buffeted by the sandstorm!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is buffeted by the sandstorm!");
		return "砂あらしが " + opp + translateText(splitted[0]) + "を襲う！";
	}

	// は を 手に入れた！ Smeargle obtained one Mental Herb. すりかえ・トリック
	if (tmp.indexOf(" obtained one ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" obtained one ");
		return opp + translateText(splitted[0]) + "は " + translateText(splitted[1]) + "を 手に入れた！";
	}

	// は お互いの持ち物を すり替えた！ The opposing Liepard switched items with its target!
	if (tmp.indexOf(" switched items with its target!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" switched items with its target!");
		return opp + translateText(splitted[0]) + "は お互いの持ち物を すり替えた！";
	}

	// は 相手を 道連れにした！ The opposing Gengar took its attacker down with it!
	if (tmp.indexOf(" took its attacker down with it!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" took its attacker down with it!");
		return opp + translateText(splitted[0]) + "は 相手を 道連れにした！";
	}

	// は 捕まっていて 交代できない！ Liepard is trapped and cannot switch!
	if (tmp.indexOf(" is trapped and cannot switch!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is trapped and cannot switch!");
		return opp + translateText(splitted[0]) + "は 捕まっていて 交代できない！";
	}

	// は ひるんで 動けなかった！ The opposing Liepard flinched and couldn't move!
	if (tmp.indexOf(" flinched and couldn't move!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" flinched and couldn't move!");
		return opp + translateText(splitted[0]) + "は ひるんで 動けなかった！";
	}

	// には 効果がないようだ... It doesn't affect the opposing Pikachu...
	if (tmp.indexOf("It doesn't affect ") !== -1) {
		if (tmp.indexOf("the opposing ") !== -1) {
			tmp = tmp.replace(" the opposing ", " ");
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -3);
		splitted = tmp.split("It doesn't affect ");
		return opp + translateText(splitted[1]) + "には 効果がないようだ...";
	}

	// は やけどを負った！ Smeargle was burned!
	if (tmp.indexOf(" was burned!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was burned!");
		return opp + translateText(splitted[0]) + "は やけどを負った！";
	}

	// の は 治った！ Smeargle's burn was healed.
	if (tmp.indexOf(" was healed.") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -12);
		splitted = tmp.split("'s ");
		return opp + translateText(splitted[0]) + "の " + translateText(splitted[1]) + "は 治った！";
	}

	// の 挑発の 効果が解けた！ Smeargle's taunt wore off!
	if (tmp.indexOf("'s taunt wore off!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("'s taunt wore off!");
		return opp + translateText(splitted[0]) + "の 挑発の 効果が解けた！";
	}

	// は 挑発されて <>が出せない！ Pikachu can't use <> after the taunt!
	if (tmp.indexOf(" after the taunt!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -17);
		splitted = tmp.split(" can't use ");
		return opp + translateText(splitted[0]) + "は 挑発されて " + translateText(splitted[1]) + "が出せない！";
	}

	// は 挑発に 乗ってしまった！ Pikachu fell for the taunt!
	if (tmp.indexOf(" fell for the taunt!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" fell for the taunt!");
		return opp + translateText(splitted[0]) + "は 挑発に 乗ってしまった！";
	}

	// は 相手を 道連れにしようとしている！ The opposing Banette is hoping to take its attacker down with it!
	if (tmp.indexOf(" is hoping to take its attacker down with it!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is hoping to take its attacker down with it!");
		return opp + translateText(splitted[0]) + "は 相手を 道連れにしようとしている！";
	}

	// の 化けの皮がはがれた！ The opposing Mimikyu's disguise was busted!
	if (tmp.indexOf("'s disguise was busted!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("'s disguise was busted!");
		return opp + translateText(splitted[0]) + "の 化けの皮が はがれた！";
	}

	// は Ｚパワーを身体にまとった！ Tapu Fini surrounded itself with its Z-Power!
	if (tmp.indexOf(" surrounded itself with its Z-Power!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" surrounded itself with its Z-Power!");
		return opp + translateText(splitted[0]) + "は Ｚパワーを 身体にまとった！";
	}

	// かたやぶり breaks the mold!
	if (tmp.indexOf(" breaks the mold!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" breaks the mold!");
		return opp + translateText(splitted[0]) + "は かたやぶりだ！";
	}

	// は 眠ってしまった！Smeargle fell asleep!
	if (tmp.indexOf(" fell asleep!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" fell asleep!");
		return opp + translateText(splitted[0]) + "は 眠ってしまった！";
	}

	// は 目をさました！Smeargle woke up!
	if (tmp.indexOf(" woke up!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" woke up!");
		return opp + translateText(splitted[0]) + "は 目をさました！";
	}

	// 空高く とびあがった！ Smeargle sprang up!
	if (tmp.indexOf(" sprang up!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" sprang up!");
		return opp + translateText(splitted[0]) + "は 空高く とびあがった！";
	}

	// 攻撃を かわした！ The opposing Charizard avoided the attack!
	if (tmp.indexOf(" avoided the attack!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" avoided the attack!");
		return opp + translateText(splitted[0]) + "は 攻撃を かわした！";
	}

	// で もちこたえた！ Smeargle hung on using its Focus Sash!
	if (tmp.indexOf(" hung on using its ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" hung on using its ");
		return opp + translateText(splitted[0]) + "は " + translateText(splitted[1]) + "で もちこたえた！";
	}

	// まひして　技が 出にくくなった！ The opposing Charizard is paralyzed! It may be unable to move!
	if (tmp.indexOf(" is paralyzed! It may be unable to move!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is paralyzed! It may be unable to move!");
		return opp + translateText(splitted[0]) + "は まひして 技が 出にくくなった！";
	}

	// すでにまひ Smeargle is already paralyzed.
	if (tmp.indexOf(" is already paralyzed.") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is already paralyzed.");
		return opp + translateText(splitted[0]) + "は すでに まひしている";
	}

	// 体がしびれて 動けない！ The opposing Smeargle is paralyzed! It can't move!
	if (tmp.indexOf(" is paralyzed! It can't move!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" is paralyzed! It can't move!");
		return opp + translateText(splitted[0]) + "は 体がしびれて 動けない！";
	}

	// 時空をゆがめた！ The opposing Smeargle twisted the dimensions!
	if (tmp.indexOf(" twisted the dimensions!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" twisted the dimensions!");
		return opp + translateText(splitted[0]) + "は 時空をゆがめた！";
	}

	// The opposing JirachiはHihihiroshiのもとへ戻っていく！ The opposing Jirachi went back to Hihihiroshi!
	if (tmp.indexOf(" went back to ") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" went back to ");
		return opp + translateText(splitted[0]) + "は " + translateText(splitted[1]) + "のもとへ戻っていく！";
	}

	// の 身代わりは 消えてしまった...  Ninetales's substitute faded!
	if (tmp.indexOf("'s substitute faded!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split("'s substitute faded!");
		return opp + translateText(splitted[0]) + "の 身代わりは 消えてしまった...";
	}

	// みがわりが現れた Ninetales put in a substitute!
	if (tmp.indexOf(" put in a substitute!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" put in a substitute!");
		return opp + translateText(splitted[0]) + "の 身代わりが現れた！";
	}

	// 代わって身代わりが攻撃を受けた！ The substitute took damage for Ninetales!
	if (tmp.indexOf("The substitute took damage for ") !== -1) {
		if (tmp.indexOf(" the opposing ") !== -1) {
			tmp = tmp.replace(/ the opposing /, "");
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		tmp = tmp.slice(31);
		//console.log("tmp="+tmp);
		//splitted =tmp.split("The substitute took damage for ");
		//console.log("splitted[0]="+splitted[0]);
		return opp + translateText(tmp) + "に代わって 身代わりが攻撃を受けた！";
	}

	// 能力変化 The opposing Smeargle's evasiveness rose sharply! /rose drastically!
	if (tmp.indexOf(" rose") !== -1 && tmp.indexOf("moves") == -1 ||
		tmp.indexOf(" fell") !== -1 && tmp.indexOf("asleep") == -1 && tmp.indexOf(" for the taunt!") == -1 && tmp.indexOf("perish count") == -1 && tmp.indexOf("the feint!") == -1 && tmp.indexOf("in love!") == -1) {
		//console.log("tmp =" + tmp);
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		if (tmp.indexOf(" rose") !== -1) { //console.log("上がった");
			if (tmp.indexOf(" sharply!") !== -1) {
				tmp = tmp.slice(0, -14);
				text1 = "が ぐーんと上がった！"; /*console.log("ぐーんと");*/
			}
			if (tmp.indexOf(" drastically!") !== -1) {
				tmp = tmp.slice(0, -18);
				text1 = "が ぐぐーんと上がった！";
			}
			//if (tmp.indexOf(" sharply!") == -1 && tmp.indexOf(" drastically!") == -1){tmp=tmp.slice(0,-6);text1="が 上がった！";}
			if (tmp.indexOf(" rose!") !== -1) {
				tmp = tmp.slice(0, -6);
				text1 = "が 上がった！";
			}
		}
		if (tmp.indexOf(" fell") !== -1) { //console.log("下がった");
			if (tmp.indexOf(" harshly!") !== -1) {
				tmp = tmp.slice(0, -14);
				text1 = "が がくっと下がった！";
			} else {
				tmp = tmp.slice(0, -6);
				text1 = "が 下がった！";
			}
		}
		//console.log("tmp ="+tmp);
		//console.log("text1 ="+text1);
		splitted = tmp.split("'s ");
		return opp + translateText(splitted[0]) + "の " + translateText(splitted[1]) + text1;
	}

	// やけどのダメージを受けている！ Smeargle was hurt by its burn!
	if (tmp.indexOf(" was hurt by its burn!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		//tmp = tmp.slice(0, -1);
		splitted = tmp.split(" was hurt by its burn!");
		return opp + translateText(splitted[0]) + "は やけどのダメージを受けている！";
	}

	// どくのダメージを受けている！
	if (tmp.indexOf(" was hurt by ") !== -1 && tmp.indexOf("poison") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" was hurt by ");
		return opp + translateText(splitted[0]) + "は " + translateText(splitted[1]) + "のダメージを受けている！";
	}

	// どく　(もうどくは was badly poisoned!)
	if (tmp.indexOf(" was poisoned!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" was poisoned!");
		return opp + translateText(splitted[0]) + "は 毒をあびた！";
	}

	// 攻撃から身を守った！
	if (tmp.indexOf(" protected itself!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" protected itself!");
		return opp + translateText(splitted[0]) + "は 攻撃から身を守った！";
	}

	// たべのこし
	if (tmp.indexOf(" restored a little HP using its Leftovers!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" restored a little HP using its Leftovers!");
		return opp + translateText(splitted[0]) + "は たべのこしで 少し回復した！";
	}

	// 能力変化（ランク変化）//x
	if (tmp.indexOf(/.{3}x .{3}/) !== -1) {
		//console.log("ランク変化 ?.?x 能力");
		splitted = tmp.split("x ");
		return translateText(splitted[1]) + " x" + splitted[0];
	}

	// 特性の発動　[(.+)'s (.+)]
	if (tmp.indexOf("[") !== -1 && tmp.indexOf("'s ") !== -1 && tmp.indexOf("Let's Go") == -1) {
		//console.log("特性の発動 tmp =" + tmp);
		opp = "";
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(14);
			opp = "相手の";
		} else {
			tmp = tmp.slice(1);
		}
		//console.log("sliced1 tmp =" + tmp);
		tmp = tmp.slice(0, -1);
		splitted = tmp.split("'s ");
		//console.log("sliced2 tmp =" + tmp);
		//console.log("splitted =" + splitted);
		return "[" + opp + translateText(splitted[0]) + "の" + translateText(splitted[1]) + "]";
	}
	// .replace(/(.+), come back!/,"$1、戻れ！")
	if (tmp.indexOf(", come back!") != -1) {
		splitted = tmp.split(", come back!");
		return translateText(splitted[0]) + "、戻れ！";
	}
	// 味方 倒れた
	if (tmp.indexOf(" fainted!") != -1 && tmp.indexOf("The opposing") == -1) {
		splitted = tmp.split(" fainted!");
		return translateText(splitted[0]) + "は 倒れた！";
	}
	// 敵 倒れた
	if (tmp.indexOf(" fainted!") != -1 && tmp.indexOf("The opposing") !== -1) {
		splitted = tmp.split(" fainted!");
		splitted[0] = splitted[0].slice(13); // 13文字(The opposing )を削る
		return "相手の" + translateText(splitted[0]) + "は 倒れた！";
	}

	// (味方の)ポケモン名 used 技名!
	if (tmp.indexOf(" used") != -1 && tmp.indexOf("The opposing") == -1) { // 文字列tmpを左から右へ検索して usedが現れ、かつThe opposingがない場合
		splitted = tmp.split(/ used/); // tmpをusedで分割
		// console.log("(味方の)ポケモン名 used 技名!: tmp = " + tmp);
		return translateText(splitted[0]) + "の ";
	}
	// 相手の ポケモン名 used 技名!
	if (tmp.indexOf(" used") != -1 && tmp.indexOf("The opposing") != -1) {
		splitted = tmp.split(/ used/);
		// console.log("相手の ポケモン名 used 技名!: tmp = " + tmp);
		splitted[0] = splitted[0].slice(13); // 13文字(The opposing )を削る
		//console.log("相手の ポケモン名 used 技名!: splitted[0] = " + splitted[0]);
		return "相手の" + translateText(splitted[0]) + "の ";
	}

	// 命が少し削られた！ The opposing Darmanitan lost some of its HP!
	if (tmp.indexOf(" lost some of its HP!") !== -1) {
		if (tmp.indexOf("The opposing ") !== -1) {
			tmp = tmp.slice(13);
			opp = "相手の";
		} else {
			tmp = tmp.slice(0);
			opp = "";
		}
		splitted = tmp.split(" lost some of its HP!");
		return opp + translateText(splitted[0]) + "の 命が少し削られた！";
	}

	// 【playとreplayで文の区切りが異なる？ playだと区切りなし？】
	//(The opposing Heracross lost 区切り??.?%区切り of its health!)　(リプレイ)
	// (自分の)ポケモン名に ??.?%のダメージ！
	if (tmp.indexOf(" lost ") != -1 && tmp.indexOf("of its health!)") !== -1 && tmp.indexOf("The opposing") == -1) {
		//console.log("(自分の)ポケモン名に ??.?%のダメージ！ tmp =" + tmp);
		tmp = tmp.slice(1);
		tmp = tmp.slice(0, -16); // この時点でtmpは"Pikachu lost 26%"
		splitted = tmp.split(" lost ");
		return "(" + translateText(splitted[0]) + "に " + splitted[1] + "のダメージ！)";
	}
	// 【区切られていた場合】 (相手または自分の)ポケモン名に ??.?%のダメージ！ ←なぜか置換できない！？
	/*if (tmp.indexOf(/\((.+) lost /) !== -1) {
		if (tmp.indexOf("The opposing ") !== -1){tmp=tmp.slice(14); opp="相手の";} else{tmp=tmp.slice(1); opp="";}
		splitted =tmp.split(" lost ");
		return "(" + opp + translateText(splitted[0]) + "に ";
	}
	if (tmp.indexOf(" of its health!)") !== -1) {
		//console.log(" of its health!");
		tmp ="のダメージ！)";
		return tmp;
	}
	*/

	// (相手の ポケモン名に ??%のダメージ！)
	if (tmp.indexOf(" lost ") != -1 && tmp.indexOf("of its health!)") !== -1 && tmp.indexOf("The opposing") !== -1) {
		//console.log("相手の ポケモン名に ??.?%のダメージ！ tmp =" + tmp);
		tmp = tmp.slice(14); // ポケモン名 lost ??.?% of its health!)
		tmp = tmp.slice(0, -16); // この時点でtmpは"Pikachu lost 26%"
		//console.log("sliced tmp ="+tmp);
		splitted = tmp.split("lost");
		splitted[0] = splitted[0].slice(0, -1);
		splitted[1] = splitted[1].slice(1);
		//console.log("splitted[0] ="+splitted[0]);console.log("splitted[1] ="+splitted[1]);
		return "(相手の" + translateText(splitted[0]) + "に " + splitted[1] + "のダメージ！)";
	}

	//if (tmp.indexOf(/(\(.+) lost /) !== -1){return "$1に ";}

	if (tmp.indexOf("!dex ") !== -1) {
		splitted = tmp.split("!dex ");
		return "!dex " + translateText(splitted[1]);
	}
	if (tmp.indexOf("!data ") !== -1) {
		splitted = tmp.split("!data ");
		return "!data " + translateText(splitted[1]);
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	if (tmp.indexOf("will be sent out first") != -1) {
		var poke_names = tmp.replace(" will be sent out first.", "").split(", ");
		for (var i = 0; i < poke_names.length; i++) {
			poke_names[i] = translateText(poke_names[i]);
		}
		text = poke_names.join("、");
		return text + " の順にくりだします";
	}

	if (tmp.indexOf(" will use ") != -1) { // your ポケモン名 will use わざ名 against 相手のポケモン名
		splitted = tmp.replace(" will use ", ",").replace(".", "").replace(" against ", ",").split(",");
		opp = "";
		if (splitted[2] != undefined) {
			poke_name = splitted[2].replace("your ", "");
			opp = (splitted[2].indexOf("your") != -1) ? "自分の" + translateText(poke_name) + "に" : translateText(poke_name) + "に";
		}
		return translateText(splitted[0]) + "は " + translateText(splitted[1]) + "を " + opp + "使います";
	}

	if (tmp.indexOf(" will mega evolve, ") != -1) {
		splitted = tmp.replace(" will mega evolve, then use ", ",").replace(".", "").replace(" against ", ",").split(",");
		opp = "";
		if (splitted[2] != undefined) {
			poke_name = splitted[2].replace("your ", "");
			opp = (splitted[2].indexOf("your") != -1) ? "自分の" + translateText(poke_name) + "に" : translateText(poke_name) + "に";
		}
		return translateText(splitted[0]) + "は メガシンカして " + translateText(splitted[1]) + " を" + opp + "使います";
	}

	if (tmp.indexOf(" will switch in, ") != -1) {
		splitted = tmp.replace(" will switch in, replacing ", ",").replace(".", "").split(",");
		return translateText(splitted[1]) + "を引っ込めて " + translateText(splitted[0]) + "に交代します";
	}

	if (tmp.indexOf("sent out ") != -1 && tmp.indexOf("(") == -1) {
		splitted = tmp.split(" sent out ");
		poke_name = splitted[1].split(" (");
		text = (poke_name[1]) ? translateText(poke_name[0]) + "(" + translateText(poke_name[1].replace(")", "")) + ")" : translateText(splitted[1].replace("!", ""));
		return splitted[0] + "は " + text + "をくりだした！";
	}
	if (tmp.indexOf(" sent out ") != -1 && tmp.indexOf("(") !== -1) { //ニックネーム付きの場合:Hihihiroshi sent out Charizard (区切りCharizard-Mega-X区切り)!
		tmp = tmp.slice(0, -2);
		splitted = tmp.split(" sent out ");
		return splitted[0] + "は " + translateText(splitted[1]) + "をくりだした(";
	}

	if (tmp.indexOf(" withdrew ") != -1) {
		splitted = tmp.split(" withdrew ");
		poke_name = splitted[1].split(" (");
		text = (poke_name[1]) ? translateText(poke_name[0]) + "(" + translateText(poke_name[1].replace(")", "")) + ")" : translateText(splitted[1].replace("!", ""));
		return splitted[0] + "は " + text + "を引っこめた！";
		// return splitted[0]+"は "+translateText(splitted[1].replace("!","")]+"を引っこめた！";
	}
	if (tmp.indexOf("Go! ") != -1 && tmp.indexOf("(") == -1) {
		splitted = tmp.replace("Go! ", "");
		poke_name = splitted.split(" (");
		text = (poke_name[1]) ? translateText(poke_name[0]) + "(" + translateText(poke_name[1].replace(")", "")) + ")" : translateText(splitted.replace("!", ""));
		return "ゆけっ！ " + text + "！";
		// return "行け、"+translateText(tmp.replace("Go! ","").replace("!","")]+"！";
	}
	if (tmp.indexOf("Go! ") != -1 && tmp.indexOf("(") !== -1) { //ニックネーム付きの場合:Go! Charizard (区切りCharizard-Mega-X区切り)!
		tmp = tmp.slice(4);
		splitted = tmp.split(" (");
		return "ゆけっ！ " + translateText(splitted[0]) + "(";
	}


	if (tmp.indexOf("Pointed stones dug into") != -1) {
		// var opp = "";
		// if(tmp.indexOf("the opposing") != -1){
		//     opp = "相手の";
		// }
		opp = (tmp.indexOf("the opposing") != -1) ? "相手の" : "";
		return opp + translateText(tmp.replace("Pointed stones dug into ", "").replace("!", "").replace("the opposing ", "")) + "に とがった岩が食い込んだ！";
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

	// if (tmp.indexOf("frisked ") != -1) {
	// 	opp = (tmp.indexOf("the opposing") != -1) ? "相手の" : "";
	// 	tmp = tmp.replace("frisked ", "").replace("the opposing ", "");
	// 	splitted = tmp.split(" and found its ");
	// 	return "は" + opp + translateText(splitted[0]) + "の" + translateText(splitted[1].replace("!", "")) + "をお見通しだ！";
	// }

	if (tmp.match(regex_frisk)) {
		var opp1 = (!RegExp.$1) ? "" : translateText(RegExp.$1);
		var poke1 = translateText(RegExp.$2);
		var opp2 = (!RegExp.$3) ? "" : translateText(RegExp.$3);
		var poke2 = translateText(RegExp.$4);
		var item = translateText(RegExp.$5);
		return opp1 + poke1 + " は " + opp2 + poke2 + " の " + item + " をお見通しだ！";
	}

	if (tmp.match(regex_effective_on)) {
		var eff = translateText(RegExp.$1);
		var opp = (translateText(RegExp.$2) === undefined) ? "" : translateText(RegExp.$2);
		var poke = translateText(RegExp.$3);
		var crit = (RegExp.$4 === "") ? "" : "急所に当たった！ ";
		// return eff + crit;
		return opp + "に" + poke + eff + crit;
	}

	if (tmp.match(regex_crit_on)) {
		return "急所に当たった！ ";
	}

	//if (tmp.match(regex_restorehp)) {
	//	return translateText(RegExp.$1) + "は " + translateText(RegExp.$2) + "で 体力を回復した！";
	//}

	if (originalStr.match(regex_stat_change)) {
		var stat = translateText(RegExp.$1);
		opp = (translateText(RegExp.$4) === undefined) ? "" : translateText(RegExp.$4);
		var sh = (translateText(RegExp.$3) === undefined) ? "" : translateText(RegExp.$3);
		// var harsh = (translateText(RegExp.$2) === undefined) ? "" : translateText(RegExp.$2);
		return "の" + stat + "が" + sh + translateText(RegExp.$2) + "！" + opp;
	}

	//if (tmp.match(regex_eat)) {
	//	return translateText(RegExp.$1) + "は " + translateText(RegExp.$2) + "を食べた";
	//}

	//if (tmp.match(regex_weakened)) {
	//	opp = (translateText(RegExp.$2) === undefined) ? "" : translateText(RegExp.$2);
	//	poke_name = translateText(RegExp.$3);
	//	return opp + poke + "へのダメージを " + translateText(RegExp.$1) + "が弱めた！";
	//}

	if (tmp.match(regex_Z_hojo)) {
		return "Z-" + translateText(RegExp.$1);
	}

	//if (tmp.match(regex_Z_boost)) {
	//	return "はZパワーで" + translateText(RegExp.$1) + "が上がった！";
	//}

	// if(originalStr.match(regex_stat_change)){
	//console.log(originalStr);
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
		return RegExp.$1 + "と " + RegExp.$2 + "の 対戦がはじまった！";
		//return RegExp.$1 + "が 勝負を しかけてきた！";
	}
	if (originalStr.match(/^\((.*)\)$/)) {
		if (translateText(RegExp.$1)) {
			return "(" + translateText(RegExp.$1) + ")";
		}

	}
	if (originalStr.match(/(.+) has Mega Evolved into Mega ([A-za-z -']+)!/) && originalStr.indexOf("The opposing") == -1) {
		return translateText(RegExp.$1) + "は メガ" + translateText(RegExp.$2) + "に メガシンカした！";
	}
	if (originalStr.match(/(.+) has Mega Evolved into Mega ([A-za-z -']+)!/) && originalStr.indexOf("The opposing") !== -1) {
		// The opposing Salamence has Mega Evolved into Mega Salamence!
		tmp = tmp.slice(13);
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" has Mega Evolved into Mega ");
		return "相手の" + translateText(splitted[0]) + "は メガ" + translateText(splitted[1]) + "に メガシンカした！";
	}

	if (originalStr.match(/(.+) transformed into ([A-za-z -']+)!/) && originalStr.indexOf("The opposing ") == -1) {
		RegExp.$2 = RegExp.$2.replace(" its ", " ");
		return translateText(RegExp.$1) + "は " + translateText(RegExp.$2) + "になった！";
	}
	if (originalStr.match(/(.+) transformed into ([A-za-z -']+)!/) && originalStr.indexOf("The opposing ") !== -1) {
		tmp = tmp.slice(13);
		tmp = tmp.slice(0, -1);
		splitted = tmp.split(" transformed into ");
		return "相手の" + translateText(splitted[0]) + "は " + translateText(splitted[1]) + "になった！";
	}
	//if (originalStr.match(regex_uturn)) {
	//	return translateText(RegExp.$1) + "は" + RegExp.$2 + "のもとへ戻っていく！";
	//}
	//if (originalStr.match(regex_hurtby)) {
	//	if (originalStr.indexOf("opposing")){
	//		return "は" + translateText(RegExp.$1) + "のダメージを受けている！";
	//    }
	//}
	// if(originalStr.match(regex_magic_bounce)){
	//     return "把"+translateText(RegExp.$1)+"反弹回去了！";
	// }
	// if(originalStr.match(regex_magic_bounce)){
	//     return "把"+translateText(RegExp.$1)+"反弹回去了！";
	// }
	//if (originalStr.match(/can't use ([A-za-z- ]+) after the taunt!/)) {
	//	return "は挑発されて" + translateText(RegExp.$1) + "が出せない！";
	//}
	if (originalStr.match(regex_gems)) { //ジェム
		return translateText(RegExp.$1) + "は " + translateText(RegExp.$2) + "の威力を強めた!";
	}

	//if (originalStr.match(regex_doesnt_affect)) {
	//	opp = (translateText(RegExp.$1) === undefined) ? "" : translateText(RegExp.$1);
	//	return opp + translateText(RegExp.$2) + "には 効果が ないようだ...";//x
	//	return "効果が ないようだ...";
	//}

	if (originalStr.match(regex_z_prtct)) {
		return translateText(RegExp.$1) + "は攻撃を守りきれずにダメージを受けた！";
	}

	if (originalStr.match(regex_megastone) && originalStr.indexOf("The opposing ") == -1) {
		return translateText(RegExp.$1) + "の " + translateText(RegExp.$2) + "と キーストーンが反応した！";
	}
	if (originalStr.match(regex_megastone) && originalStr.indexOf("The opposing ") !== -1) { // The opposing Salamence's Salamencite is reacting to the Key Stone!
		tmp = tmp.slice(13);
		tmp = tmp.slice(0, -30);
		splitted = tmp.split("'s ");
		return "相手の" + translateText(splitted[0]) + "の " + translateText(splitted[1]) + "と キーストーンが反応した！";
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	if (originalStr.match(regex_joined)) {
		if (originalStr.match("You ")) {
			return "チャットルームに入室しました。";
		} else {
			return RegExp.$1 + "が参加しました。";
		}
	}
	if (originalStr.match(regex_left)) {
		if (originalStr.match(/(.+) has (.+) seconds left./)) {} else {
			return RegExp.$1 + "が退出しました。";
		}
	}

	if (originalStr.match(regex_whatwilldo)) {
		return RegExp.$1 + "は どうする？";
	}

	if (originalStr.match(regex_battleoptions)) {
		return "バトル" + RegExp.$1 + "オプション";
	}

	if (originalStr.match(regex_alreadyinbattle)) {
		return RegExp.$1 + "は すでに場に出ています";
	}

	if (originalStr.match(regex_2users)) {
		return RegExp.$1 + "人のユーザー";
	}

	//    if (tmp.indexOf(regex_moveused)) {
	//        return "相手の" + translateText(RegExp.$1) + "の " + translateText(RegExp.$2);
	//	}

	//    if (originalStr.match(regex_wonthebattle)) {
	//		return RegExp.$1 + "は 戦いに勝利した！";
	//	}



	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// debug
	if (originalStr.match(/Turn ([0-9]+)/)) {
		//console.log("ターン開始！\n");
		//console.log(" = " + );

	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// ⦿置換③
	//;
	// 要素の一部分でもたぶん置換可能
	return originalStr
		// .replace(/Ability: ([A-za-z ]+)/,"特性: "+translateText(RegExp.$1));
		// .replace(/Ability: ([A-za-z ]+)\/ Item: ([A-za-z ]+)/,"特性:: "+translateText(RegExp.$1)+"/ 道具:"+translateText(RegExp.$2));
		// .replace(" sent out ","放出了 ")
		.replace(/ won the battle!/, "は 戦いに勝利した！")
		.replace(" withdrew ", "引き分け")
		.replace(" forfeited.", "は 降参した")
		.replace(/Turn ([0-9]+)/, "ターン$1")
		.replace("Battle timer is ON", "バトルタイマーがオン")
		.replace("inactive players will automatically lose when time's up.", "時間切れになると負けます。")
		.replace(/requested by (.+)/g, "($1のリクエスト)")
		.replace(/(.+) has ([0-9]+) seconds left./, "$1のタイマー:残り$2秒")
		.replace(/(.+)'s team:/, "$1のチーム:")
		//.replace(/The opposing/,"相手の")
		.replace(/(.+) disconnected and has 300 seconds to reconnect!/, "$1がサーバーから切断しました。300秒間は再接続が可能です。")
		.replace(/(.+)'s rating:/, "$1のレート:")
		//.replace(/(.+) for losing/,"負け $1")//x
		//.replace(/(.+) for winning/,"勝ち $1")//x
		.replace("What will ", "")
		.replace(" do?", "は どうする？")
		.replace(/ New (.+) Team/, "$1 の新しいチームを作成")
		.replace(/(.+)wants to battle!/, "$1が勝負をしかけてきた！")
		.replace(/Challenge (.+)\?/, "$1に 戦いを挑みますか？")
		.replace(/Challenging (.+).../, "$1に 戦いを挑んでいます...")
		.replace(/Waiting for (.+).../, "$1の 選択を待っています...")
		.replace(/The challenge was cancelled./, "挑戦はキャンセルされました。")
		.replace(/(before items\u002fabilities\u002fmodifiers)/, "アイテム、特性の補正前") // アイテム、特性、性格の補正前 かも
		.replace(/^(?!.*currently set).*to:/, "の次は どれを出す？")
		.replace(/Generation ([0-9])/, "第$1世代")
		.replace(/No (.+) battles are going on right now./, "$1 の対戦は現在行われていません。")
		.replace(/(.+) disconnected and has a minute to reconnect!/, "$1がサーバーから切断しました。1分間は再接続できます。")
		.replace(/(.+) has (.+) seconds to reconnect!/, "$1の再接続可能時間:残り$2秒")
		.replace(/Your team is valid for (.+)./, "このチームは$1で使用可能です。")
		.replace("Your team was rejected for the following reasons:", "あなたのチームは以下の理由により受け付けられませんでした:")
//		.replace(/(.+) to (.+) Spe/, "素早さ: $1～$2")
		.replace(/Choose a Pokémon for slot (.+)/, "$1番目のポケモンを選ぶ")
		.replace(/Search results for "(.+)"/, '"$1"の検索結果')
		.replace(/The room "(.+)" does not exist./, '対戦ルーム"$1"は期限が切れて、無くなっています。')
		.replace('The battle you\u0027re looking for has expired. Battles expire after 15 minutes of inactivity unless they\u0027re saved.', "保存されなかったバトルは、プレイヤーがいなくなってから15分後に期限が切れます。")
		.replace('In the future, remember to click "Save replay" to save a replay permanently.', "リプレイを永久に保存するには忘れずに「リプレイを保存」を選ぶようにしてください。")
		.replace(/(.+) lost due to inactivity./, "$1は どこかへ いなくなった")
		.replace(/Congratulations, (.+)!/, "おめでとう！ $1！！")
		.replace(/(.+) Tournament created./, "トーナメントが作られました：$1 Tournament")
		.replace(/(.+) has won the match (.+) - (.+) against (.+)./, "$1は $4に $2 - $3 で 勝った！")
		.replace(/(.+) has lost the match (.+) - (.+) against (.+)./, "$1は $4に $2 - $3 で 負けた！")
		.replace(/Tournament battle between (.+) and (.+) started./, "$1と $2の トーナメントバトルが始まった！")
		.replace(/The tournament's automatic disqualify timer has been set to (.+) minutes./, "トーナメントを失格になるまでの時間が$1分にセットされました。")
		.replace(/(.+) has been disqualified from the tournament./, "$1は トーナメントを失格になりました。")
		.replace(/Congratulations to (.+) for winning the (.+)!/, "$1が $2で優勝しました！おめでとうございます！")
		.replace(/Runner-up: (.+)/, "準優勝: $1")
		.replace(/L([0-9][0-9]?[0-9]?)/, "Lv.$1")
	//.replace(/(.+) and (.+) joined./,"$1と$2が参加しました。")
	//.replace(/(.+) joined./,"$1が参加しました。")
	//.replace(/You joined./,"チャットルームに参加しました。")
	//.replace("Z-move(s)","Ｚワザ") //x
	;
} // /var t

// 単語の置換の実行
function translateText(txt) {
	if (txt === undefined) return false;
	//console.log(txt);
	if (translations[txt] === undefined) {
		// ポケモンの接尾語判定　他に影響あるかも？
		let splitSuffix = txt.split('-');
		if (splitSuffix.length > 0 &&
			translations[splitSuffix[0]] && translations['-' + splitSuffix[1]]) {
			return translations[splitSuffix[0]] + translations['-' + splitSuffix[1]];
		}
		return txt;
	} else {
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
			//console.log(QQ(node).text());
			//QQ(node).text(transl)
			//  console.log(node.nodeValue+" "+node.parentNode.getAttribute("class"));
			//console.log();
			var value = node.nodeValue;

			// (ポケモン lost /xx.x-yy.y% /of its health!) で区切られる
			if (/lost\s?$/.test(value)) {
				var arr = [value.trim()];
				flag = true;
				node.nodeValue = "";
				while (flag) {
					node = skip(node, elTW);
					var txt = node.nodeValue.trim();
					arr.push(txt);
					if (txt == "of its health!)") {
						flag = false;
					}
					node.nodeValue = "";
				}
				var text = translate(arr.join(" "));
				node.nodeValue = translate(text);
			} else if (value.indexOf('•') != -1) {
				value = value.replace('•', "");
				value = translate(value);
				node.nodeValue = "• " + value;
				continue;
			}
			// else if (value.match(regex_search)) { //ダブルダメージ
			// 	var arr = [value.trim()];
			// 	 flag = true;
			// 	node.nodeValue = "";
			// 	while (flag) {
			// 		node = skip(node, elTW);
			// 		var txt = node.nodeValue.trim();
			// 		arr.push(txt);
			// 		if (txt == "!" || txt == ".") flag = false;
			// 		node.nodeValue = "";
			// 	}
			// 	var text = translate(arr.join(" "));
			//     node.nodeValue = translate(arr.join(" "));
			// }
			// else if (value.indexOf("Pointed stones dug into") != -1 || value.indexOf("It doesn't affect") != -1 || value.indexOf("used the move instructed") != -1 ) {
			// 	arr = [value.trim()];
			// 	flag = true;

			// 	node.nodeValue = "";

			// 	while (flag){
			// 		node = skip(node, elTW);
			// 		arr.push(node.nodeValue.trim());
			// 		if (node.nodeValue.indexOf("!") != -1) flag = false;
			// 		node.nodeValue = "";
			// 	}
			// 	node.nodeValue = translate(arr.join(" "));
			// }
			else if (value == " knocked off " || value == " knocked off the opposing " || value == " copied " || value == " copied the opposing ") {

				/*var*/
				arr = [value.trim()];
				/*var*/
				flag = true;

				node.nodeValue = "";

				while (flag) {
					node = skip(node, elTW);
					arr.push(node.nodeValue.trim());
					if (node.nodeValue.indexOf("'s ") != -1) flag = false;
					node.nodeValue = "";

				}
				node.nodeValue = translate(arr.join(" "));
			} else if (value == " frisked " || value == " frisked the opposing ") {

				/*var*/
				arr = [value.trim()];
				/*var*/
				flag = true;

				node.nodeValue = "";

				while (flag) {
					node = skip(node, elTW);
					arr.push(node.nodeValue.trim());
					if (node.nodeValue.indexOf("and found its ") != -1) flag = false;
					node.nodeValue = "";
				}
				node.nodeValue = translate(arr.join(" "));
			} else if (value.match(regex_forme)) {
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

			} else {
				node.nodeValue = translate(node.nodeValue.replace("held by", "holder is"));
			}

			var text = node.nodeValue;
			if (text && text.indexOf('急所に当たった！') != -1 && QQ(node).parent().parent().attr('class') == 'battle-history' || QQ(node).parent().parent().attr('class') == 'battle') {
				QQ(node).wrap('<font color="#c00000">'); // 急所が当たった！を赤色にする
			}

			if (text && text.indexOf('日本語 Japanese') != -1 && QQ(node).parent().parent().attr('class') == 'ilink') {
				QQ(node).wrap('<font color="#c00000" />');
			}

			if (text && text.match(/(!dex)|(!data) (.+)/)) {
				if (text.match(/!dex (.+)/)) {
					text = text.slice(5);
				}
				if (text.match(/!data (.+)/)) {
					text = text.slice(6);
				}
				let wikiurl = "http://web.archive.org/web/20220416091720/https://wiki.ポケモン.com/wiki/" + text;
				QQ(node).wrap('<a href=' + wikiurl + ' target="_blank" />');
			}

			if ( /*text.match(translateText(text))　&& (*/ QQ(node).parent().parent().attr('class') == 'statbar lstatbar' || QQ(node).parent().parent().attr('class') == 'statbar rstatbar') /*)*/ {
				//if(text.indexOf("L") !== -1){console.log(QQ(node).parent().parent().parent().attr('class') + " Lが検出されました！");}
				let splitted3 = text.split("-");
				if (splitted3[0] == "ゲンシグラードン") {
					splitted3[0] == "グラードン";
				}
				if (splitted3[0] == "ゲンシカイオーガ") {
					splitted3[0] == "カイオーガ";
				}
				if (splitted3[0].indexOf("メガ") !== -1 && splitted3[0] !== "メガニウム" && splitted3[0] !== "メガヤンマ") {
					splitted3[0] = splitted3[0].slice(2);
				}
				//console.log("statbar lstatbar splitted[0] =" + splitted[0]);
				//console.log("text =" + text);
				//if (splitted3[0].indexOf("Lv.") !== -1){QQ(node).wrap('<a href="http://web.archive.org/web/20220416091720/http://pokemon-wiki.net/ + splitted3[0]" style="letter-spacing: 1em;" />');} //x
				if (splitted3[0].length >= 2 && splitted3[0].indexOf("Lv.") == -1) {
					QQ(node).wrap('<a href="http://web.archive.org/web/20220416091720/http://pokemon-wiki.net/' + splitted3[0] +
						'" target="_blank" style="color: #FFFFFF; text-decoration: none; letter-spacing: 0.05em; font-size: 100%;' +
						' text-shadow: rgb(0, 0, 0) 1px 0px 0px,rgb(0, 0, 0) 0.587px 0.917px 0px, rgb(0, 0, 0) -0.458px 1.00833px 0px, rgb(0, 0, 0) -1.0817px 0.147px 0px, rgb(0, 0, 0) -0.715px -0.825px 0px, rgb(0, 0, 0) 0.312px -1.0633px 0px, rgb(0, 0, 0) 1.063px -0.312px 0px;" />');
				}
			}


			//if (QQ(node).parent().attr('class') == 'hptext'){
			//console.log("hptext");
			//QQ(node).setAttribute("style",'"border-radius: 4px 4px 4px 4px; left: -48px; width: 48px;"');
			//QQ(node).wrap('<div style="border-radius: 4px 4px 4px 4px !important; left: -48px; width: 48px !important;" />');
			//}
			if ( /*text.match(translateText(text))　&& (*/ QQ(node).parent().parent().attr('class') == 'hpbar') /*)*/ {
				//console.log("hpbar " + text);
				//console.log("HPバーの色: ");
				QQ(node).wrap('<div style="z-index: 2; color: #FFFFFF; font-size: 150%; position: absolute; bottom: 4px; font-weight: 600;' +
					' text-shadow: rgb(0, 0, 0) 1px 0px 0px,rgb(0, 0, 0) 0.587px 0.917px 0px, rgb(0, 0, 0) -0.458px 1.00833px 0px, rgb(0, 0, 0) -1.0817px 0.147px 0px, rgb(0, 0, 0) -0.715px -0.825px 0px, rgb(0, 0, 0) 0.312px -1.0633px 0px, rgb(0, 0, 0) 1.063px -0.312px 0px;" />');
			}

			// 疑似コマンド
			if (text && text.indexOf(' does not exist. To send a message starting with "/') !== -1) {
				if (text.indexOf(' does not exist. To send a message starting with "/7') !== -1) {
					text = text.slice(0, -2);
					let splitted = text.split('", type "//7');
					wikiurl2 = splitted[1];
					QQ(node).wrap('<a href="http://web.archive.org/web/20220416091720/http://7th.pokemonpedia.net/' + wikiurl2 + '" target="_blank" />');
				}
				if (text.indexOf(' does not exist. To send a message starting with "/７') !== -1) {
					text = text.slice(0, -2);
					let splitted = text.split('", type "//７');
					wikiurl2 = splitted[1];
					QQ(node).wrap('<a href="http://web.archive.org/web/20220416091720/http://7th.pokemonpedia.net/' + wikiurl2 + '" target="_blank" />');
				}
				if (text.indexOf(' does not exist. To send a message starting with "/6') !== -1) {
					text = text.slice(0, -2);
					let splitted = text.split('", type "//6');
					wikiurl2 = splitted[1];
					QQ(node).wrap('<a href="http://web.archive.org/web/20220416091720/http://6th.pokemonpedia.net/' + wikiurl2 + '" target="_blank" />');
				}
				if (text.indexOf(' does not exist. To send a message starting with "/６') !== -1) {
					text = text.slice(0, -2);
					let splitted = text.split('", type "//６');
					wikiurl2 = splitted[1];
					QQ(node).wrap('<a href="http://web.archive.org/web/20220416091720/http://6th.pokemonpedia.net/' + wikiurl2 + '" target="_blank" />');
				}
				if (text.indexOf(' does not exist. To send a message starting with "/?') !== -1) {
					text = text.slice(0, -2);
					let splitted = text.split('", type "//?');
					wikiurl2 = splitted[1];
					wikiurl2 = wikiurl2.replace("ｚ", "Z");
					QQ(node).wrap('<a href="http://web.archive.org/web/20220416091720/https://wiki.ポケモン.com/w/index.php?search=' + wikiurl2 + '" target="_blank" />');
				}
				if (text.indexOf(' does not exist. To send a message starting with "/？') !== -1) {
					text = text.slice(0, -2);
					let splitted = text.split('", type "//？');
					wikiurl2 = splitted[1];
					wikiurl2 = wikiurl2.replace("ｚ", "Z");
					QQ(node).wrap('<a href="http://web.archive.org/web/20220416091720/https://wiki.ポケモン.com/w/index.php?search=' + wikiurl2 + '" target="_blank" />');
				}
				if (text.search('The command "/コマンド" does not exist. To send a message starting with "/コマンド", type "//コマンド".') !== -1) {
					//text = text.replace(text,"疑似コマンド");
					QQ(node).wrap('<a href="http://web.archive.org/web/20220416091720/https://www.smogon.com/forums/threads/3566554/" target="_blank" />');
					//let splitted = text.split('", type "//');
					//wikiurl2 = splitted[1];
					//QQ(node).wrap('<a href=https://wiki.ポケモン.com/wiki/' + wikiurl2 + ' target="_blank" />');
				}
			}
			//node=elTW.previousNode();
			//QQ(t).remove();

		}
	}
}

(function () {
	'use strict';
	if (document.getElementById('room-')) {
		translateElement(document.getElementById('room-'));
	}
	QQ(document).on('DOMNodeInserted', function (e) {
		translateElement(e.target);
	});
})();

/////////////////////////////////////

}
/*
     FILE ARCHIVED ON 09:17:20 Apr 16, 2022 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 09:17:26 Apr 16, 2022.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 241.225
  exclusion.robots: 0.099
  exclusion.robots.policy: 0.091
  RedisCDXSource: 0.595
  esindex: 0.008
  LoadShardBlock: 220.556 (3)
  PetaboxLoader3.datanode: 195.15 (3)
  CDXLines.iter: 17.377 (3)
  load_resource: 23.066
*/