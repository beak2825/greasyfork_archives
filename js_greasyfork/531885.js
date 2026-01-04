// ==UserScript==
// @name Milky Way Idle 日本語化拡張機能
// @match https://www.milkywayidle.com/*
// @match https://test.milkywayidle.com/*
// @description Milky Way Idleを日本語化する拡張機能です。
// @version 0.0.1.20250427120612
// @namespace https://greasyfork.org/users/1450563
// @downloadURL https://update.greasyfork.org/scripts/531885/Milky%20Way%20Idle%20%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%8C%96%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/531885/Milky%20Way%20Idle%20%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%8C%96%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD.meta.js
// ==/UserScript==

//
// 制作者：@GaoGaoDinosaur（X）
// 翻訳協力者(敬称略)：夢野なつ、他1名
//

// 通常の置換設定
const replacements = [

  // 放置報酬ウィンドウ
  {
    className: 'OfflineProgressModal_modalContent__3ZsUb',
    translationKeys: ['WelcomeBack']
  },

  // 左サイドバー1(MarketplaceからSettingsまで)
  {
    className: 'NavigationBar_label__1uH-y',
    translationKeys: ['LeftSide1', 'LeftSide1_2']
  },

  // 左サイドバー2(NewsからLogoutまで)
  {
    className: 'NavigationBar_contentContainer__1x6WS',
    translationKeys: ['LeftSide2']
  },

  // 左サイドバー3(ツールチップ内説明)
  {
    className: 'NavigationBar_navigationSkillTooltip__3a9Rz',
    exactMatch: false,
    translationKeys: ['LeftSide3']
  },

  // 左サイドバー4_2(ツールチップ内説明2)
  {
    className: 'NavigationBar_info__3zahT',
    translationKeys: ['LeftSide4']
  },

  // 左サイドバー5(ツールチップ内説明3)
  {
    className: 'NavigationBar_info__3zahT',
    translationKeys: ['LeftSide5']
  },

  // 左サイドバー > 項目名
  {
    className: 'MuiBadge-root TabsComponent_badge__1Du26 css-1rzb3uu',
    translationKeys: ['ActionCategory']
  },

  // 左サイドバー > 行動名
  {
    className: 'SkillAction_name__2VPXa',
    translationKeys: ['CombatZone', 'Action', 'Enemy'],
    exactMatch: false
  },

  // セレクトボックス共通 (クローズ時)
  {
    className: 'MuiInputBase-root',
    translationKeys: ['Skill', 'CombatZone'],
    exactMatch: false
  },

  // セレクトボックス共通 (オープン時)
  {
    className: 'MuiPaper-root',
    translationKeys: ['Skill', 'CombatZone', 'CombatTrigger', 'Action', 'Ability'],
    exactMatch: false
  },

  // タブ名
  {
    className: 'MuiBadge-root TabsComponent_badge__1Du26 css-1rzb3uu',
    translationKeys: ['RightSideTab1']
  },

  // 右サイドバー1(小さいタイトル、CurrenceisからResourcesまで)
  {
    className: 'Inventory_categoryButton__35s1x',
    exactMatch: false,
    translationKeys: ['RightSide1']
  },

  // 右サイドバー2(大きいタイトル、Equipment)
  {
    className: 'EquipmentPanel_title__CY-rf',
    translationKeys: ['RightSide2']
  },

  // 右サイドバー3(大きいタイトル、Abilities)
  {
    className: 'AbilitiesPanel_title__2_8WC',
    translationKeys: ['RightSide3']
  },

  // 右サイドバー4(大きいタイトル、House)
  {
    className: 'HousePanel_title__2fQ1U',
    translationKeys: ['RightSide4']
  },

  // 右サイドバー5(大きいタイトル、Loadouts)
  {
    className: 'LoadoutsPanel_title__3pQwA',
    translationKeys: ['RightSide5']
  },

  // 右サイドバーボタン1
  {
    className: 'Button_button__1Fe9z',
    translationKeys: ['RightSideButton1'],
    exactMatch: false
  },

  // 右サイドバーテキスト1(アビリティ)
  {
    className: 'AbilitiesPanel_label__kW91i',
    translationKeys: ['RightSideAbilityText']
  },

  // 右サイドバーテキスト1(装備セット)
  {
    className: 'LoadoutsPanel_label__3j_J2',
    exactMatch: false,
    translationKeys: ['RightSideEquipSetText1']
  },

  // 右サイドバーテキスト2(装備セット)
  {
    className: 'LoadoutsPanel_loadoutSlotCount__3Fklt',
    exactMatch: false,
    translationKeys: ['RightSideEquipSetText2']
  },

  // 右サイドバーテキスト3(アイテムクリック時ウィンドウ)
  {
    className: 'Item_actionMenu__2yUcG',
    exactMatch: false,
    translationKeys: ['ItemActionMenu']
  },

  // 右サイドバーテキスト3(アイテムクリック時ウィンドウのアイテム名)
  {
    className: 'Item_itemInfo__3zAGf',
    exactMatch: false,
    translationKeys: ['Action', 'Item']
  },

  // 右サイドバー装備セットカテゴリテキスト1
  {
    className: 'MuiSelect-select MuiSelect-standard MuiInputBase-input MuiInput-input css-1cccqvr',
    translationKeys: ['LeftSide1', 'RightSideEquipSetCategoryText1']
  },

  // 右サイドバー装備スロット内テキスト1
  {
    className: 'ItemSelector_label__22ds9',
    translationKeys: ['RightSideEquipSlotText1']
  },

  // 右サイドバー装備スロット選択時テキスト1
  {
    className: 'ItemSelector_message__1RgQl',
    translationKeys: ['RightSideEquipSlotSelectedText1']
  },

  // 右サイドバーアビリティスロット選択時テキスト1
  {
    className: 'AbilitySlot_message__yxk65',
    translationKeys: ['RightSideAbilitySlotSelectedText1']
  },

  // 右サイドバーマイホームテキスト1
  {
    className: 'HousePanel_name__1SBye',
    translationKeys: ['RightSideMyHomeText1']
  },

  // 右サイドバーマイホームテキスト2
  {
    className: 'HousePanel_level__2UlEu ',
    translationKeys: ['RightSideMyHomeText2']
  },
  
  // 右サイドバーマイホームバフ
  {
    className: 'HousePanel_modalContent__3AwPH ',
    translationKeys: ['ConsumableDetail2','StatInfo','LeftSide1'],
    exactMatch: false
  },  

  // アビリティスロット内テキスト1
  {
    className: 'AbilitySlot_label__3rju7 ',
    translationKeys: ['SlotText1'],
    exactMatch: false
  },

  // アビリティスロット内テキスト1
  {
    className: 'ConsumableSlot_label__3De0J ',
    translationKeys: ['SlotText2'],
    exactMatch: false
  },

  // 右サイドバーステータス
  {
    className: 'EquipmentPanel_stats__JAGpK ',
    exactMatch: false,
    translationKeys: ['StatInfo']
  },

  // マウスオーバー時の汎用ツールチップ（左サイドバー）
  {
    className: 'NavigationBar_name__jAIEQ',
    translationKeys: ['LeftSide1']
  },

  // マウスオーバー時のアイテムツールチップ（右サイドバー）
  {
    className: 'ItemTooltipText_name__2JAHA',
    translationKeys: ['StatInfo', 'Item', 'Action', 'Ability']
  },

  // マウスオーバー時のアイテムツールチップ（ユニークステータス）
  {
    className: 'EquipmentStatsText_uniqueStat__2xvqX',
    translationKeys: ['UniqueStat']
  },

  // マウスオーバー時のアイテムツールチップ（アビリティ）
  {
    className: 'Ability_name__139E3',
    translationKeys: ['Ability']
  },

  // マウスオーバー時のアイテムツールチップ（アビリティ）
  {
    className: 'Ability_abilityDetail__26ZGV',
    translationKeys: ['ItemDescription']
  },

  // マーケットのアイテムツールチップ
  {
    className: 'ItemTooltipText_itemTooltipText__zFq3A',
    exactMatch: false,
    translationKeys: ['StatInfo', 'Item', 'Ability']
  },

  // マーケットのアイテムツールチップ2_1
  {
    className: 'ItemTooltipText_abilityDetail__3ZiU5',
    exactMatch: false,
    translationKeys: ['ItemRequired']
  },

  // マーケットのアイテムツールチップ2_2
  {
    className: 'ItemTooltipText_equipmentDetail__3sIHT',
    exactMatch: false,
    translationKeys: ['ItemRequired']
  },

  // マーケットのアイテムツールチップ2_3
  {
    className: 'ItemTooltipText_abilityDetail__3ZiU5',
    translationKeys: ['ItemEffect', 'ItemDescription']
  },

  // マーケットのアイテムツールチップ3_1(消耗品)
  {
    className: 'ItemTooltipText_consumableDetail__2_42s',
    includePlus: true,
    translationKeys: ['ConsumableDetail1']
  },

  // マーケットのアイテムツールチップ3_2(消耗品)
  {
    className: 'ItemTooltipText_consumableDetail__2_42s',
    exactMatch: false,
    translationKeys: ['ConsumableDetail2']
  },

  // アイテムアイコンクリック時のウィンドウ表示
  {
    className: 'Item_name__2C42x',
    translationKeys: ['Ability', 'Item', 'Action']
  },

  // マーケット商品購入時のテキスト
  {
    className: 'MarketplacePanel_modalContent__3YhCo',
    exactMatch: false,
    translationKeys: ['Market']
  },

  // マーケット
  {
    className: 'MarketplacePanel_orderBooksContainer__B4YE-',
    exactMatch: false,
    translationKeys: ['Market']
  },
  {
    className: 'Button_button__1Fe9z Button_sell__3FNpM-',
    exactMatch: false,
    translationKeys: ['Market']
  },
  {
    className: 'Button_button__1Fe9z Button_buy__3s24l-',
    exactMatch: false,
    translationKeys: ['Market']
  },
  {
    className: 'Button_button__1Fe9z',
    exactMatch: false,
    translationKeys: ['Market']
  },
  {
    className: 'MarketplacePanel_myListingsTableContainer__2s6pm',
    exactMatch: false,
    translationKeys: ['Market']
  },
  {
    className: 'MarketplacePanel_listingCount__3nVY_',
    exactMatch: false,
    translationKeys: ['Market']
  },
  {
    className: 'MarketplacePanel_itemSummaryTable__2g3gr',
    exactMatch: false,
    translationKeys: ['Market']
  },

  // 行動のタイトル1
  {
    className: 'GatheringProductionSkillPanel_title__3VihQ',
    translationKeys: ['LeftSide1']
  },

  // 行動のタイトル2
  {
    className: 'AlchemyPanel_title__1utdA',
    translationKeys: ['LeftSide1', 'ActionTop']
  },

  // 行動のタイトル3
  {
    className: 'EnhancingPanel_title__2_FLG',
    translationKeys: ['LeftSide1', 'ActionTop']
  },

  // 行動のタイトル4
  {
    className: 'CombatPanel_title__WUVp8',
    translationKeys: ['LeftSide1']
  },

  // 行動のタイトル5
  {
    className: 'MarketplacePanel_title__yTWKE',
    translationKeys: ['LeftSide1']
  },

  // 行動のタイトル6
  {
    className: 'TasksPanel_title__6_y-9',
    translationKeys: ['LeftSide1']
  },

  // 行動のタイトル7
  {
    className: 'ShopPanel_title__3emm9',
    translationKeys: ['LeftSide1', 'LeftSide1_2']
  },

  // 行動のタイトル8
  {
    className: 'CowbellStorePanel_title__2jRBi',
    translationKeys: ['LeftSide1', 'LeftSide1_2']
  },

  // 行動のタイトル9
  {
    className: 'SocialPanel_title__2lUiz',
    translationKeys: ['LeftSide1', 'LeftSide1_2']
  },

  // 行動のタイトル10
  {
    className: 'GuildPanel_title__CJuyQ',
    translationKeys: ['LeftSide1', 'LeftSide1_2']
  },

  // 行動のタイトル11
  {
    className: 'LeaderboardPanel_title__35RUH',
    translationKeys: ['LeftSide1', 'LeftSide1_2']
  },

  // 行動のタイトル12
  {
    className: 'SettingsPanel_title__3ORAB',
    translationKeys: ['LeftSide1', 'LeftSide1_2']
  },

  // 行動のタイトル13
  {
    className: 'NewsPanel_title__27b03',
    translationKeys: ['LeftSide2']
  },

  // 行動のタイトル14
  {
    className: 'PatchNotesPanel_title__2sMrP',
    translationKeys: ['LeftSide2']
  },

  // 行動のタイトル15
  {
    className: 'GameGuidePanel_title__1Nd_4',
    translationKeys: ['LeftSide2']
  },

  // 行動のタイトル16
  {
    className: 'GameRulesPanel_title__2SR8v',
    translationKeys: ['LeftSide2']
  },

  // 行動トップ 説明文
  {
    className: 'SkillActionDetail_instructions___EYV5',
    translationKeys: ['ActionTop'],
    exactMatch: false
  },

  // 行動トップ ダイアログ1
  {
    className: 'SkillActionDetail_name__3erHV',
    translationKeys: ['Enemy', 'CombatZone', 'Action'],
    exactMatch: false
  },

  // 行動トップ ダイアログ2
  {
    className: 'SkillActionDetail_info__3umoI',
    translationKeys: ['ActionDetail'],
    exactMatch: false
  },

  // 行動トップ ダイアログ3
  {
    className: 'SkillActionDetail_label__1mGQJ',
    translationKeys: ['ActionDetail'],
    exactMatch: false
  },

  // 行動トップ ダイアログ4
  {
    className: 'SkillActionDetail_buttonsContainer__sbg-V',
    translationKeys: ['ActionDetail'],
    exactMatch: false
  },

  // 行動の消耗品
  {
    className: 'GatheringProductionSkillPanel_label__3xUHj',
    translationKeys: ['ActionConsumable']
  },

  // 行動の消耗品2
  {
    className: 'AlchemyPanel_label__3DCfJ',
    translationKeys: ['ActionConsumable']
  },

  // 行動の消耗品3
  {
    className: 'EnhancingPanel_label__2ousC',
    translationKeys: ['ActionConsumable']
  },

  // 行動の消耗品4
  {
    className: 'BattlePanel_label__1lNyt',
    translationKeys: ['ActionConsumable']
  },

  // 行動の消耗品5
  {
    className: 'CombatZones_label__3pOEF',
    translationKeys: ['ActionConsumable']
  },

  // 行動の消耗品6
  {
    className: 'CombatZones_label__3pOEF',
    translationKeys: ['ActionConsumable']
  },

  // 行動の消耗品アイコン内テキスト
  {
    className: 'BattlePanel_label__1lNyt',
    translationKeys: ['ActionConsumable']
  },

  // 戦闘エリア
  {
    className: 'MuiTabs-root MuiTabs-vertical css-6x4ics',
    translationKeys: ['CombatZone'],
    exactMatch: false
  },

  // 戦闘前 敵のツールチップ
  {
    className: 'CombatMonsterTooltip_combatMonsterTooltip__3TWKx',
    translationKeys: ['StatInfo', 'Enemy', 'Item'],
    exactMatch: false
  },

  // 戦闘中 敵情報
  {
    className: 'BattlePanel_modalContent__pP-eh',
    translationKeys: ['StatInfo', 'Enemy'],
    exactMatch: false
  },

  // 戦闘中情報
  {
    className: 'BattlePanel_battleUnitBattleInfo__3rHcx',
    translationKeys: ['BattleInfo'],
    exactMatch: false
  },

  // 戦闘中の敵名前
  {
    className: 'CombatUnit_name__1SlO1',
    translationKeys: ['Enemy'],
    exactMatch: false
  },

  // 戦闘中のアビリティ名
  {
    className: 'ProgressBar_text__102Yn',
    translationKeys: ['Ability'],
    exactMatch: false
  },

  // 戦闘のトリガー設定
  {
    className: 'CombatTriggersSetting_combatTriggersEditMenu__QL_kp',
    translationKeys: ['CombatTrigger'],
    exactMatch: false
  },

  // タスク関連
  {
    className: 'Header_name__227rJ',
    translationKeys: ['Action', 'Enemy'],
    exactMatch: false
  },
  {
    className: 'Header_task__31FqV',
    translationKeys: ['Task', 'Action', 'Enemy'],
    exactMatch: false
  },
  {
    className: 'QuestModal_questModalContent__15Lbn',
    translationKeys: ['Task', 'Action', 'LeftSide1', 'Enemy'],
    exactMatch: false
  },
  {
    className: 'QuestModal_name__2HJhQ',
    translationKeys: ['Task'],
    exactMatch: false
  },
  {
    className: 'RandomTask_content__VVQva',
    translationKeys: ['Task', 'Action', 'LeftSide1', 'Enemy'],
    exactMatch: false
  },
  {
    className: 'TasksPanel_taskTimer__3rzXq',
    translationKeys: ['Task'],
    exactMatch: false
  },
  {
    className: 'TasksPanel_totalTaskPoints__qbkQv',
    translationKeys: ['Task'],
    exactMatch: false
  },
  {
    className: 'TasksPanel_taskSlotCount__nfhgS',
    translationKeys: ['Task'],
    exactMatch: false
  },
  {
    className: 'Button_button__1Fe9z Button_secondary__1wAfX Button_fullWidth__17pVU Button_disabled__wCyIq',
    translationKeys: ['Task'],
    exactMatch: false
  },
  {
    className: 'TasksPanel_text__YfALY',
    translationKeys: ['Task'],
    exactMatch: false
  },

  // アイテム辞典タイトル
  {
    className: 'ItemDictionary_title__27cTd',
    translationKeys: ['Action', 'Item'],
  },

  // アイテム辞典
  {
    className: 'ItemDictionary_header__dZE40',
    translationKeys: ['ItemDictionary'],
  },

  // アイテム辞典2
  {
    className: 'ItemDictionary_info__DberD',
    translationKeys: ['ItemDictionary2'],
    exactMatch: false
  },

  // アイテム辞典3
  {
    className: 'ItemDictionary_name__2p6n-',
    translationKeys: ['Action', 'Enemy'],
    exactMatch: false
  },

  // ショップ
  {
    className: 'MuiBadge-root TabsComponent_badge__1Du26 css-1rzb3uu',
    translationKeys: ['Shop'],
    exactMatch: false
  },
  {
    className: 'ShopPanel_name__3vA-H',
    translationKeys: ['Action', 'Item'],
    exactMatch: false
  },
  {
    className: 'ShopPanel_costs__XffBM',
    translationKeys: ['Action', 'Item'],
    exactMatch: false
  },

  // チャット
  {
    className: 'PartyLink_partyLink__3yDta',
    translationKeys: ['Action', 'ChatText', 'CombatZone'],
    exactMatch: false
  },

  // プロフィールウィンドウ(名前クリック時)
  {
    className: 'ChatMessage_playerButtons__2DVQq',
    translationKeys: ['Profile'],
    exactMatch: false
  },

  // プロフィールウィンドウ(マイホーム)
  {
    className: 'SharableProfile_name__1RDS1',
    translationKeys: ['RightSideMyHomeText1']
  },

  // ヘッダ 現在の行動
  {
    className: 'Header_myActions__3rlBU',
    translationKeys: ['HeaderAction', 'Action', 'CombatZone', 'Enemy'],
    exactMatch: false
  },

  // ヘッダ キュー
  {
    className: 'QueuedActions_queuedActions__2xerL',
    translationKeys: ['HeaderQueue'],
    exactMatch: false
  },

  // ヘッダ キュー マウスオーバー時ツールチップ
  {
    className: 'QueuedActions_queuedActionsTooltip__aOtTo',
    translationKeys: ['HeaderQueue', 'Enemy', 'Action'],
    exactMatch: false
  },

  // ヘッダ キュー クリック時
  {
    className: 'css-w9tg40',
    translationKeys: ['HeaderQueue', 'Enemy', 'Action'],
    exactMatch: false
  },

  // ヘッダ 合計レベル
  {
    className: 'Header_totalLevel__8LY3Q',
    before: 'Total Level',
    after: '合計レベル',
    exactMatch: false
  }
];

// 翻訳の対応表
const translationTable = {
  'WelcomeBack': [
    { before: 'Welcome Back!', after: 'おかえりなさい！' },
    { before: 'Offline duration', after: 'オフライン時間' },
    { before: 'Items gained', after: '獲得したアイテム' },
    { before: 'Experience gained', after: '獲得した経験値' },
    { before: 'Items consumed', after: '消費したアイテム' },
    { before: 'Close', after: '閉じる' }
  ],
  
  'LeftSide1': [
    { before: 'My Stuff', after: '自分のモノ' },
    { before: 'Marketplace', after: 'マーケット' },
    { before: 'Tasks', after: 'タスク' },
    { before: 'Milking', after: '乳しぼり' },
    { before: 'Foraging', after: '採集' },
    { before: 'Woodcutting', after: '木こり' },
    { before: 'Cheesesmithing', after: 'チーズ鍛冶' },
    { before: 'Crafting', after: '製作' },
    { before: 'Tailoring', after: '裁縫' },
    { before: 'Cooking', after: '料理' },
    { before: 'Brewing', after: '醸造' },
    { before: 'Alchemy', after: '錬金術' },
    { before: 'Enhancing', after: '強化' },
    { before: 'Combat', after: '戦闘' },
    { before: 'Stamina', after: '体力' },
    { before: 'Intelligence', after: '知力' },
    { before: 'Attack', after: '攻撃力' },
    { before: 'Power', after: '腕力' },
    { before: 'Defense', after: '防御力' },
    { before: 'Ranged', after: '遠距離攻撃力' },
    { before: 'Magic', after: '魔法攻撃力' },
    { before: 'Social', after: 'ソーシャル' }
  ],
  
  'LeftSide1_2': [
    { before: 'Stamina', after: '体力' },
    { before: 'Intelligence', after: '知力' },
    { before: 'Attack', after: '攻撃力' },
    { before: 'Power', after: '腕力' },
    { before: 'Defense', after: '防御力' },
    { before: 'Ranged', after: '遠距離攻撃力' },
    { before: 'Magic', after: '魔法攻撃力' },
    { before: 'Shop', after: 'ショップ' },
    { before: 'Cowbell Store', after: 'カウベルストア' },
    { before: 'Guild', after: 'ギルド' },
    { before: 'Leaderboard', after: 'リーダーボード' },
    { before: 'Settings', after: '設定' }
  ],
  
  'LeftSide2': [
    { before: 'News', after: 'ニュース' },
    { before: 'Patch Notes', after: 'パッチノート' },
    { before: 'Game Guide', after: 'ゲームガイド' },
    { before: 'Game Rules', after: '規約' },
    { before: 'Game Wiki', after: 'ゲームWiki' },
    { before: 'Test Server', after: 'テストサーバー' },
    { before: 'Privacy Policy', after: 'プライバシーポリシー' },
    { before: 'Switch Character', after: 'キャラクター切り替え' },
    { before: 'Logout', after: 'ログアウト' }
  ],
  
  'LeftSide3': [
    { before: 'Level', after: 'レベル' },
    { before: 'mooooooooo…', after: 'モ～～～～～～…' },
    { before: 'Total Experience', after: '累計経験値' },
    { before: 'XP To Level Up', after: '次のレベルまで' },
    { before: 'Chop chop chop.', after: 'トン、トン、トン！' },
    { before: 'Shop', after: 'ショップ' },
    { before: 'Cowbell Store', after: 'カウベルストア' },
    { before: 'Guild', after: 'ギルド' },
    { before: 'Leaderboard', after: 'リーダーボード' },
    { before: 'Settings', after: '設定' }
  ],
  
  'LeftSide4': [,
    { before: 'Inventory, equipment, abilities, houses, and loadouts.', after: 'インベントリ、装備、アビリティ、マイホーム、装備セットを管理しよう。' },
    { before: 'Player-driven market where you can buy and sell items with coins.', after: 'プレイヤー同士がコインで売買できるマーケット！ ' },
    { before: 'Randomly generated tasks that players can complete for rewards.', after: 'ランダムに発生するクエストに挑戦！達成すると報酬がもらえるよ！' },
    { before: 'mooooooooo...', after: 'モ～～～～～～～～～。' },
    { before: 'Level', after: 'レベル' },
    { before: 'Total Experience', after: '累計経験値' },
    { before: 'XP To Level Up', after: '次のレベルまで' },
    { before: 'Master the skill of picking up things.', after: '物拾いの達人になろう。' },
    { before: 'Chop chop chop.', after: 'トン、トン、トン！' },
    { before: 'Did you know you can make equipment using these special hardened cheeses?', after: '知ってた？ この世界のチーズは装備だって作れちゃうんだ！' },
    { before: 'Create weapons, jewelry, and more.', after: '武器やアクセサリーなどをクラフトしよう。' },
    { before: 'Create ranged and magic clothing.', after: '遠距離･魔法用の防具を作成できる。' },
    { before: 'The art of making healthy food.', after: 'ヘルシーな料理を作る技術。' },
    { before: 'The art of making tasty drinks.', after: '美味しいドリンクを作る技術。' },
    { before: 'Transform unwanted items into wanted ones. (hopefully)', after: '不要なアイテムは別のアイテムに変換！' },
    { before: '+5 takes effort, +10 takes luck, +15 is a miracle, and +20 is destiny.', after: '+5は努力、+10は運、+15は奇跡、そして+20は…運命。', escapeSpecialChars: true },
    { before: 'Fight monsters. Your combat level represents your overall combat effectiveness based on the combination of individual combat skill levels', after: '世界中のモンスターと戦おう！戦闘レベルは個々の戦闘スキルレベルを総合して、全体的な戦闘力を表す。' },
    { before: 'Increases max HP by 10 per level. You gain experience mainly from taking damage and slightly from avoiding damage.', after: '1レベルにつき、最大HPが10増加します。ダメージを受けることで経験値を得られ、回避することでもわずかに経験値を得られます。' },
    { before: 'Increases max MP by 10 per level. You gain experience when consuming mana while using abilities.', after: '1レベルにつき最大MPが10増加します。アビリティを使ってマナを消費すると経験値を得られます。' },
    { before: 'Increases your melee accuracy and base attack speed. You gain experience when dealing melee damage, with more experience gained from stab and less from smash.', after: '近接攻撃の命中力と通常攻撃の速度が増加します。近接ダメージを与えることで経験値を得られ、特に刺突、他に斬撃、殴打ダメージで少量の経験値を得られます。' },
    { before: 'Increases your melee damage. You gain experience when dealing melee damage, with more experience gained from smash and less from stab.', after: '近接攻撃のダメージが増加します。近接ダメージを与えることで経験値を得て、殴打からは多く、刺突からは少ない経験値を得られます。' },
    { before: 'Increases your evasion, armor, and elemental resistances. You gain experience when dodging or mitigating damage.', after: '回避力、防御力、属性耐性が増加します。攻撃を回避したり軽減した時に経験値を得られます。' },
    { before: 'Increases your ranged accuracy, ranged damage, and magic evasion. Ranged attacks can critical strike. You gain experience when dealing ranged damage.', after: '遠距離攻撃の命中力、ダメージ、魔法回避力が増加します。遠距離攻撃にはクリティカルがあり、遠距離攻撃でダメージを与えると経験値を得られます。' },
    { before: 'Increases your magic accuracy, magic damage, and elemental resistances. You gain experience when dealing magic damage.', after: '魔法攻撃の命中力、ダメージ、属性耐性が増加します。魔法でダメージを与えると経験値を得られます。' },
    { before: 'Shop', after: 'ショップ' },
    { before: 'Purchase items from the vendor.', after: 'ショップでアイテムを購入しよう！' },
    { before: 'Cowbell Store', after: 'カウベルストア' },
    { before: 'Purchase and spend cowbells.', after: 'カウベルを使ってお買い物！' },
    { before: 'Friends, referrals, and block list.', after: 'フレンド登録・招待・ブロック管理。' },
    { before: 'Guild', after: 'ギルド' },
    { before: 'Join forces with a community of players.', after: 'ギルドに加入して仲間と共に冒険しよう！' },
    { before: 'Leaderboard', after: 'リーダーボード' },
    { before: 'Shows the top ranked players of each skill.', after: 'ランキングで各スキルのトッププレイヤーを確認。' },
    { before: 'Settings', after: '設定' },
    { before: 'Update account information and other settings.', after: 'アカウント情報や設定を変更する。' },
  ],
  
  'RightSideTab1': [
    { before: 'Inventory', after: 'インベントリ' },
    { before: 'Equipment', after: '装備' },
    { before: 'Abilities', after: 'アビリティ' },
    { before: 'House', after: 'マイホーム' },
    { before: 'Loadouts', after: '装備セット' },
    { before: 'Resources', after: '素材' },
    { before: 'Consumables', after: '消耗品' },
    { before: 'Books', after: '本' },
    { before: 'Keys', after: '鍵' },
    { before: 'Tools', after: '道具' },
    { before: 'Market Listings', after: 'マーケット商品' },
    { before: 'My Listings', after: '自分の商品' },
    { before: 'Task Board', after: 'タスクボード' },
    { before: 'Task Shop', after: 'タスクショップ' },
    { before: 'Coinify', after: '換金' },
    { before: 'Decompose', after: '分解' },
    { before: 'Transmute', after: '変換' },
    { before: 'Current Action', after: '現在のアクション' },
    { before: 'Enhance', after: '強化' },
    { before: 'Combat Zones', after: '戦闘エリア' },
    { before: 'Find Party', after: 'パーティを探す' },
    { before: 'Friends', after: 'フレンド' },
    { before: 'Referrals', after: '招待' },
    { before: 'Block List', after: 'ブロックリスト' },
    { before: 'Standard', after: 'スタンダード' },
    { before: 'Ironcow', after: 'アイアンカウ' },
    { before: 'Legacy Ironcow', after: 'レガシーアイアンカウ' },
    { before: 'Guild', after: 'ギルド' },
    { before: 'Profile', after: 'プロフィール' },
    { before: 'Game', after: 'ゲーム' },
    { before: 'Account', after: 'アカウント' },
    { before: 'My Party', after: '自分のパーティ' },
    { before: 'Battle Info', after: 'バトル情報' },
    { before: 'Stats', after: 'ステータス' },
    { before: 'Combat Stats', after: '戦闘ステータス' },
    { before: 'Non-combat Stats', after: '非戦闘ステータス' }
  ],
  
  'RightSide1': [
    { before: 'Currencies', after: '通貨' },
    { before: 'Foods', after: '食べ物' },
    { before: 'Drinks', after: '飲み物' },
    { before: 'Ability Books', after: '本' },
    { before: 'Equipment', after: '装備' },
    { before: 'Resources', after: '素材' },
    { before: 'Keys', after: '鍵' },
    { before: 'Loots', after: '戦利品' }
  ],
  
  'RightSide2': [
    { before: 'Equipment', after: '装備' }
  ],
  
  'RightSide3': [
    { before: 'Abilities', after: 'アビリティ' }
  ],
  
  'RightSide4': [
    { before: 'House', after: 'マイホーム' }
  ],
  
  'RightSide5': [
    { before: 'Loadouts', after: '装備セット' }
  ],
  
  'RightSideButton1': [
    { before: 'View Stats', after: 'ステータス表示' },
    { before: 'View Buffs', after: 'バフ表示' },
    { before: 'Create Loadout', after: '装備セット作成' },
    { before: 'Upgrade Capacity', after: 'アップグレード(容量)' },
    { before: 'Create Party', after: 'パーティ作成' },
    { before: 'Disband Party', after: 'パーティ解散' },
    { before: 'Find Party', after: 'パーティを探す' },
    { before: 'Flee', after: '逃げる' },
    { before: 'Profile', after: 'プロフィール' },
    { before: 'Send', after: '送信' },
    { before: 'Condition', after: '条件を追加' },
    { before: 'Reset Default', after: 'リセット' },
    { before: 'Save', after: '保存する' }
  ],
  
  'RightSideAbilityText': [
    { before: 'Ability Slots', after: 'アビリティスロット' },
    { before: 'Learned Abilities', after: '習得したアビリティ' }
  ],
  
  'RightSideEquipSetText1': [
    { before: 'New Loadout', after: '新しい装備セット' }
  ],
  
  'RightSideEquipSetText2': [
    { before: 'Loadouts', after: '装備セット' }
  ],
  
  'RightSideEquipSetCategoryText1': [
    { before: 'All Skills', after: 'すべてのスキル' }
  ],
  
  'RightSideEquipSlotText1': [
    { before: 'Back', after: '背中' },
    { before: 'Head', after: '頭' },
    { before: 'Main Hand', after: 'メイン' },
    { before: 'Body', after: '胴' },
    { before: 'Off Hand', after: 'サブ' },
    { before: 'Hands', after: '手' },
    { before: 'Legs', after: '脚' },
    { before: 'Pouch', after: 'ポーチ' },
    { before: 'Feet', after: '足' },
    { before: 'Necklace', after: '首' },
    { before: 'Earrings', after: '耳' },
    { before: 'Ring', after: '指輪' },
    { before: 'Milking Tool', after: '乳しぼりツール' },
    { before: 'Foraging Tool', after: '採集ツール' },
    { before: 'Wood-Cutting Tool', after: '木こりツール' },
    { before: 'Cheese-Smithing Tool', after: 'チーズ鍛冶ツール' },
    { before: 'Crafting Tool', after: '製作ツール' },
    { before: 'Tailoring Tool', after: '裁縫ツール' },
    { before: 'Cooking Tool', after: '料理ツール' },
    { before: 'Brewing Tool', after: '醸造ツール' },
    { before: 'Alchemy Tool', after: '錬金術ツール' },
    { before: 'Enhancing Tool', after: '強化ツール' },
    { before: 'Drink', after: '飲み物' },
    { before: 'Food', after: '食べ物' },
    { before: 'Alchemize Item', after: '錬金アイテム' },
    { before: 'Enhance Item', after: '強化アイテム' },
    { before: 'Consumed Item', after: '消耗アイテム' },
    { before: 'Remove', after: 'はずす' }
  ],
  
  'RightSideEquipSlotSelectedText1': [
    { before: 'No items available', after: '装備できるアイテムはありません' }
  ],
  
  'RightSideAbilitySlotSelectedText1': [
    { before: 'No abilities available', after: 'セットできるアビリティはありません' }
  ],
  
  'RightSideMyHomeText1': [
    { before: 'Dairy Barn', after: '乳牛舎' },
    { before: 'Garden', after: '庭園' },
    { before: 'Log Shed', after: '丸太小屋' },
    { before: 'Forge', after: '鍛冶場' },
    { before: 'Workshop', after: '工房' },
    { before: 'Sewing Parlor', after: '縫製室' },
    { before: 'Kitchen', after: 'キッチン' },
    { before: 'Brewery', after: '醸造所' },
    { before: 'Laboratory', after: '実験室' },
    { before: 'Observatory', after: '天文台' },
    { before: 'Dining Room', after: '食堂' },
    { before: 'Library', after: '図書館' },
    { before: 'Dojo', after: '道場' },
    { before: 'Gym', after: 'ジム' },
    { before: 'Armory', after: '武器庫' },
    { before: 'Archery Range', after: '射撃場' },
    { before: 'Mystical Study', after: '魔法研究室' },
  ],
  
  'RightSideMyHomeText2': [
    { before: 'Not built', after: '(未建築)' }
  ],
  
  'SlotText1': [
    { before: 'Special', after: 'SP' },
    { before: 'Ability', after: 'アビリティ' },
    { before: 'Unlock', after: '解放' },
    { before: 'INT', after: '知力' }
  ],
  
  'SlotText2': [
    { before: 'Require', after: 'ポーチ' },
    { before: 'Bigger', after: 'が必要' },
    { before: 'Pouch', after: '' }
  ],
  
  'ActionCategory': [
    { before: 'Farmland', after: '農場' },
    { before: 'Shimmering Lake', after: 'きらめく湖' },
    { before: 'Misty Forest', after: '霧の森' },
    { before: 'Burble Beach', after: '賑わう浜辺' },
    { before: 'Silly Cow Valley', after: 'シリカウバレー' },
    { before: 'Olympus Mons', after: 'オリンポス山' },
    { before: 'Asteroid Belt', after: 'アステロイドベルト' },
    { before: 'Material', after: '素材' },
    { before: 'Tool', after: '道具' },
    { before: 'Main Hand', after: '武器(メイン)' },
    { before: 'Off Hand', after: '武器(サブ)' },
    { before: 'Two Hand', after: '武器(両手)' },
    { before: 'Head', after: '防具(頭)' },
    { before: 'Body', after: '防具(胴)' },
    { before: 'Legs', after: '防具(脚)' },
    { before: 'Hands', after: '防具(手)' },
    { before: 'Feet', after: '防具(靴)' },
    { before: 'Lumber', after: '板材' },
    { before: 'Crossbow', after: 'クロスボウ' },
    { before: 'Bow', after: '弓' },
    { before: 'Staff', after: '杖' },
    { before: 'Ring', after: '指輪' },
    { before: 'Earrings', after: '耳飾り' },
    { before: 'Neck', after: '首飾り' },
    { before: 'Trinket', after: '装飾品' },
    { before: 'Special', after: '特殊素材' },
    { before: 'Dungeon Keys', after: 'ダンジョンの鍵' },
    { before: 'Pouch', after: 'ポーチ' },
    { before: 'Instant Heal', after: 'HP回復（即時）' },
    { before: 'Heal Over Time', after: 'HP回復（持続）' },
    { before: 'Instant Mana', after: 'MP回復（即時）' },
    { before: 'Mana Over Time', after: 'MP回復（持続）' },
    { before: 'Tea', after: '紅茶' },
    { before: 'Coffee', after: 'コーヒー' }
  ],
  
  'ActionTop': [
    { 'before': 'Select an item to alchemize', 'after': '錬金するアイテムを選択して下さい' },
    { 'before': 'Coinify', 'after': '換金' },
    { 'before': 'Converts item into coins', 'after': 'アイテムをコインに変換する' },
    { 'before': 'Select an equipment to enhance', 'after': '強化する装備を選択して下さい' },
    { 'before': 'Decompose', 'after': '分解' },
    { 'before': 'Converts item into component materials', 'after': 'アイテムを分解して素材にする' },
    { 'before': 'Transmute', 'after': '変換' },
    { 'before': 'Converts item into a random related item', 'after': 'アイテムを別の関連アイテムに変換する' },
    { 'before': 'Success', 'after': '成功時：' },
    { 'before': 'Failure', 'after': '失敗時：' },
    { 'before': "increases the item's enhancement level by 1", 'after': 'アイテムの強化レベルが1上がります' },
    { 'before': 'resets the enhancement level to 0 unless protection is used', 'after': 'プロテクトアイテムを使っていない場合、強化レベルがゼロにリセットされます' },
    { 'before': 'You are currently not alchemizing anything.', 'after': '現在何も錬金していません。' },
    { 'before': 'You are currently not enhancing anything.', 'after': '現在何も強化していません。' }
  ],
  
  'ActionDetail': [
    { 'before': 'Requires', 'after': '条件' },
    { 'before': 'Target Level', 'after': '目標レベル' },
    { 'before': 'Protection', 'after': 'プロテクト' },
    { 'before': 'Level', 'after': 'レベル' },
    { 'before': 'Outputs', 'after': '生産' },
    { 'before': 'Essences', 'after': 'エッセンス' },
    { 'before': 'Rares', 'after': 'レア' },
    { 'before': 'Duration', 'after': '実行時間' },
    { 'before': 'Bonuses', 'after': 'ボーナス' },
    { 'before': 'Monsters', 'after': 'モンスター' },
    { 'before': 'Travel', 'after': '移動時間' },
    { 'before': 'Boss Fight', 'after': 'ボス戦' },
    { 'before': 'Every 10', 'after': '戦闘10回で' },
    { 'before': 'Battles', 'after': '発生' },
    { 'before': 'Fight', 'after': '戦闘回数' },
    { 'before': 'Gather', 'after': '実行回数' },
    { 'before': 'Produce', 'after': '実行回数' },
    { 'before': 'Add Queue', 'after': '実行予約' },
    { 'before': 'Upgrade Queue Capacity', 'after': 'アクション実行予約上限アップグレード' },
    { 'before': 'Start', 'after': '実行' },
    { 'before': 'Start Now', 'after': '今すぐ実行' },
    { 'before': 'Costs', 'after': 'コスト' },
    { 'before': 'Success Rate', 'after': '成功率' },
    { 'before': 'Experience', 'after': '経験値' }
  ],
  
  'ActionConsumable': [
    { 'before': 'Consumables', 'after': '消耗品' },
    { 'before': 'Abilities', 'after': 'アビリティ' }
  ],
  
  'Task': [
    { before: 'Progress', after: '進捗' },
    { before: 'Task', after: 'タスク' },
    { before: 'Rewards', after: '報酬' },
    { before: 'Purple', after: 'パープル' },
    { before: 'Go', after: 'Go' },
    { before: 'Defeat', after: '討伐' },
    { before: 'Reroll', after: 'リロール' },
    { before: 'Next Task', after: '次のタスク' },
    { before: 'Tasks', after: 'タスク' },
    { before: 'Task Points', after: 'タスクポイント' },
    { before: 'Claim Reward', after: '報酬を受け取る' },
    { before: 'Claim', after: '受け取る' },
    { before: 'Lifetime Task Points', after: '合計獲得タスクポイント' },
    { before: "Purple's Gift", after: 'パープルからの贈り物' }
  ],
  
  'Market': [
    { before: 'Quantity', after: '数量' },
    { before: 'Ask Price', after: '販売価格' },
    { before: 'Action', after: '行動' },
    { before: 'Bid Price', after: '買取価格' },
    { before: 'Item', after: '商品' },
    { before: 'Best Ask Price', after: '最安値' },
    { before: 'Best Bid Price', after: '最高値' },
    { before: 'View All', after: 'すべて表示' },
    { before: 'Buy', after: '購入' },
    { before: 'Sell', after: '売却' },
    { before: 'View All Items', after: 'すべてのアイテムを表示' },
    { before: 'View All Enhancement Levels', after: 'すべての強化レベルを表示' },
    { before: 'Refresh', after: '再読み込み' },
    { before: 'Post Sell Listing', after: '出品する' },
    { before: 'Post Buy Listing', after: '購入希望を出す' },
    { before: 'New Buy Listing', after: '購入希望を出す' },
    { before: 'Buy Listing', after: '購入希望を出す' },
    { before: 'New Sell Listing', after: '出品する' },
    { before: 'Sell Listing', after: '出品する' },
    { before: 'Listing Limit Reached', after: '購入/出品上限' },
    { before: 'Enhancement Level', after: '強化レベル' },
    { before: 'Status', after: 'ステータス' },
    { before: 'Type', after: 'タイプ' },
    { before: 'Progress', after: '進捗' },
    { before: 'Price', after: '価格' },
    { before: 'Tax Taken', after: '手数料' },
    { before: 'Collect', after: '集金' },
    { before: 'Collect All', after: 'すべて集金' },
    { before: 'Active', after: 'アクティブ' },
    { before: 'Cancel', after: '取消' },
    { before: 'Listings', after: '使用中' },
    { before: 'Post Buy Order', after: '購入する' },
    { before: 'Post Sell Order', after: '売却する' },
    { before: 'Buy Now', after: '購入確認' },
    { before: 'Sell Now', after: '売却確認' },
    { before: 'Best Buy Offer', after: '最高値' },
    { before: 'Best Sell Offer', after: '最安値' },
    { before: 'All', after: '全部' },
    { before: 'Max', after: '最大' },
    { before: 'You Can Afford', after: '購入可能数' },
    { before: 'Available At Price', after: '指定価格の商品' },
    { before: "You can't afford this many", after: '所持コインが不足しています' },
    { before: "You don't have enough items", after: 'アイテムの所持数が足りません' },
    { before: "Must be at least 1", after: '1以上の値を入れて下さい' },
    { before: "Lots", after: 'いっぱい' },
    { before: 'You Pay', after: '支払い金額' },
    { before: 'You Get', after: '受取金額' },
    { before: '2% Taxed', after: '+2% 税金' },
    { before: '18% Taxed', after: '+18% 税金' },
    { before: 'less if better offers exist', after: '安い出品がある場合そちらが適用されます' },
    { before: 'more if better offers exist', after: '高い買取がある場合そちらが適用されます' }
  ],
  
  'Shop': [
    { before: 'General', after: '一般' },
    { before: 'Dungeon', after: 'ダンジョン' },
    { before: 'Coin', after: 'コイン' }
  ],
  
  'ItemDictionary': [
    { before: "Used For Milking:", after: '乳しぼりに使用：' },
    { before: "Used For Foraging:", after: '採集に使用：' },
    { before: "Used For Woodcutting:", after: '木こりに使用：' },
    { before: "Used For Cheesesmithing:", after: 'チーズ鍛冶に使用：' },
    { before: "Used For Crafting:", after: '製作に使用：' },
    { before: "Used For Tailoring:", after: '裁縫に使用：' },
    { before: "Used For Cooking:", after: '料理に使用：' },
    { before: "Used For Brewing:", after: '醸造に使用：' },
    { before: "Used For Alchemy:", after: '錬金術に使用：' },
    { before: "Used For Enhance:", after: '強化に使用：' },
    { before: "Produced From", after: '生産で入手：' },
    { before: "Gathered From", after: '収集で入手：' },
    { before: "Dropped By Monsters:", after: 'モンスターからドロップ：' },
    { before: "Looted From Container:", after: '戦利品から入手：' },
    { before: "Decomposes Into(Alchemy):", after: '分解で入手 (錬金術)：' },
    { before: "Decomposed From(Alchemy):", after: '分解から入手 (錬金術)：' },
    { before: "Transmutes Into(Alchemy):", after: '変換で入手 (錬金術)：' },
    { before: "Transmuted From(Alchemy):", after: '変換から入手 (錬金術)：' },
    { before: "Enhancing Cost:", after: '強化コスト：' },
    { before: "Used For Crafting:", after: '製作で使用：' }
  ],
  
  'ItemDictionary2': [
    { before: "Recommended", after: '推奨' },
    { before: "Level", after: 'レベル' },
    { before: "Almost all monsters drop coins", after: 'ほぼ全てのモンスターからドロップ' },
  ],
  
  'ChatText': [
    { before: 'Party', after: 'パーティ' },
    { before: 'Elite', after: 'エリート' }
  ],
  
  'Profile': [
    { before: 'Whisper', after: 'ささやき' },
    { before: 'Mention', after: 'メンション' },
    { before: 'Profile', after: 'プロフィール' },
    { before: 'Add Friend', after: 'フレンド追加' },
    { before: 'Block', after: 'ブロック' }
  ],
  
  'HeaderAction': [
    { before: 'Doing nothing', after: 'ただ宇宙を眺めている…' },
    { before: 'Flee', after: '逃げる' },
    { before: 'Stop', after: '中断する' },
    { before: 'Traveling To Battle', after: '戦闘の準備をしています…' }
  ],
  
  'HeaderQueue': [
    { before: 'Queued', after: '実行予定の' },
    { before: 'Actions', after: 'アクション' },
    { before: 'Queued Actions', after: '実行予定のアクション' },
    { before: 'Gather', after: '収集' },
    { before: 'Produce', after: '生産' },
    { before: 'Coinify', after: '換金' },
    { before: 'Decompose', after: '分解' },
    { before: 'Transmute', after: '変換' },
    { before: 'Repeat', after: '繰り返し' },
    { before: 'Target', after: '対象' },
    { before: 'Fight', after: '戦闘' },
    { before: 'times', after: '回' },
  ],
  
  'Item': [
    //汎用
    { before: 'Amount', after: '数量' },
    { before: 'Requires', after: '条件' },
    { before: 'Sell Price', after: '売値' },
    { before: 'Usable', after: '使用場面' },
    { before: 'Cooldown', after: 'クールタイム' },
    { before: 'in combat', after: '戦闘中' },
    { before: 'Cast Time', after: '詠唱時間' },
    { before: 'MP Cost', after: 'MP消費' },
    { before: 'Equip', after: '装備' },
    { before: 'Learn', after: '習得' },
    { before: 'Right Click', after: '右クリック' },

    { before: 'Combat Style', after: '戦闘スタイル' },
    { before: 'Damage Type', after: 'ダメージ分類' },
    { before: 'Total Level', after: '合計レベル' },

    //分類
    { before: 'Type', after: '分類' },
    { before: 'Main Hand', after: '武器(メイン)' },
    { before: 'Off Hand', after: '武器(サブ)' },
    { before: 'Two Hand', after: '武器(両手)' },
    { before: 'Head', after: '防具(頭)' },
    { before: 'Body', after: '防具(胴)' },
    { before: 'Legs', after: '防具(脚)' },
    { before: 'Hands', after: '防具(手)' },
    { before: 'Feet', after: '装備(靴)' },
    { before: 'Pouch', after: 'ポーチ' },
    { before: 'Neck', after: '首' },
    { before: 'Earrings', after: '耳飾り' },
    { before: 'Ring', after: '指輪' },
    { before: 'Consumable', after: '消耗品' },
    { before: 'Ability Book', after: '本' },
    { before: 'Trinket', after: '装飾品' },
    { before: 'Back', after: '背中' },

    //道具種別
    { before: 'Milking Tool', after: '乳しぼり道具' },
    { before: 'Foraging Tool', after: '採集道具' },
    { before: 'Woodcutting Tool', after: '木こり道具' },
    { before: 'Cheesesmithing Tool', after: 'チーズ鍛冶道具' },
    { before: 'Crafting Tool', after: '製作道具' },
    { before: 'Tailoring Tool', after: '裁縫道具' },
    { before: 'Cooking Tool', after: '料理道具' },
    { before: 'Brewing Tool', after: '醸造道具' },
    { before: 'Alchemy Tool', after: '錬金術道具' },
    { before: 'Enhancing Tool', after: '強化道具' },

    // 通貨
    { before: 'Coin', after: 'コイン' },
    { before: 'Task Token', after: 'タスクトークン' },
    { before: 'Cowbell', after: 'カウベル' },
    { before: 'Chimerical Token', after: '奇妙なトークン' },
    { before: 'Sinister Token', after: '不吉なトークン' },
    { before: 'Enchanted Token', after: '魔法のトークン' },

    //素材
    { before: 'Milk', after: 'ミルク' },
    { before: 'Verdant Milk', after: 'ヴァーダントミルク' },
    { before: 'Azure Milk', after: 'アズールミルク' },
    { before: 'Burble Milk', after: 'バーブルミルク' },
    { before: 'Crimson Milk', after: 'クリムゾンミルク' },
    { before: 'Rainbow Milk', after: 'レインボーミルク' },
    { before: 'Holy Milk', after: 'ホーリーミルク' },
    { before: 'Log', after: '丸太' },
    { before: 'Birch Log', after: 'シラカバの丸太' },
    { before: 'Cedar Log', after: 'スギの丸太' },
    { before: 'Purpleheart Log', after: 'パープルハートの丸太' },
    { before: 'Ginkgo Log', after: 'イチョウの丸太' },
    { before: 'Redwood Log', after: 'セコイアの丸太' },
    { before: 'Arcane Log', after: 'アーケインの丸太' },

    // エッセンス
    { before: 'Swamp Essence', after: '沼地のエッセンス' },
    { before: 'Aqua Essence', after: '水のエッセンス' },
    { before: 'Jungle Essence', after: 'ジャングルのエッセンス' },
    { before: 'Gobo Essence', after: 'ゴボのエッセンス' },
    { before: 'Eyessence', after: '目ッセンス' },
    { before: 'Sorcerer Essence', after: '魔法使いのエッセンス' },
    { before: 'Bear Essence', after: 'クマのエッセンス' },
    { before: 'Golem Essence', after: 'ゴーレムのエッセンス' },
    { before: 'Twilight Essence', after: '黄昏のエッセンス' },
    { before: 'Abyssal Essence', after: '地獄のエッセンス' },
    { before: 'Chimerical Essence', after: '奇妙なエッセンス' },
    { before: 'Sinister Essence', after: '不吉のエッセンス' },
    { before: 'Enchanted Essence', after: '魔法のエッセンス' },
    { before: 'Pirate Essence', after: '海賊のエッセンス' },

    { before: 'Milking Essence', after: '乳しぼりのエッセンス' },
    { before: 'Foraging Essence', after: '採集のエッセンス' },
    { before: 'Woodcutting Essence', after: '木こりのエッセンス' },
    { before: 'Cheesesmithing Essence', after: 'チーズ鍛冶のエッセンス' },
    { before: 'Crafting Essence', after: '製作のエッセンス' },
    { before: 'Tailoring Essence', after: '裁縫のエッセンス' },
    { before: 'Cooking Essence', after: '料理のエッセンス' },
    { before: 'Brewing Essence', after: '醸造のエッセンス' },
    { before: 'Alchemy Essence', after: '錬金術のエッセンス' },
    { before: 'Enhancing Essence', after: '強化のエッセンス' },

    //その他のアイテム
    { before: 'Bag Of 10 Cowbells', after: 'カウベル10個入りのバッグ' },
    { before: "Purple's Gift", after: 'パープルからの贈り物' },
    { before: "Task Crystal", after: 'タスククリスタル' },
    { before: 'Small Meteorite Cache', after: '小さなメテオライト' },
    { before: 'Medium Meteorite Cache', after: '中くらいのメテオライト' },
    { before: 'Large Meteorite Cache', after: '大きなメテオライト' },
    { before: 'Small Treasure Chest', after: '小さな宝箱' },
    { before: 'Medium Treasure Chest', after: '中くらいの宝箱' },
    { before: 'Large Treasure Chest', after: '大きな宝箱' },
    { before: "Small Artisan's Crate", after: '職人の小さな木箱' },
    { before: "Medium Artisan's Crate", after: '職人の中くらいの木箱' },
    { before: "Large Artisan's Crate", after: '職人の大きな木箱' },
    { before: 'Chimerical Chest', after: '奇妙な宝箱' },
    { before: 'Sinister Chest', after: '不吉な宝箱' },
    { before: 'Enchanted Chest', after: '魔法の宝箱' },
    { before: 'Pirate Chest', after: '海賊の宝箱' },
    { before: 'Rough Hide', after: '粗い皮' },
    { before: 'Reptile Hide', after: '爬虫類の皮' },
    { before: 'Beast Hide', after: '獣の皮' },
    { before: 'Gobo Hide', after: 'ゴボの皮' },
    { before: 'Umbral Hide', after: '影の皮' },
    { before: 'Green Tea Leaf', after: '緑の茶葉' },
    { before: 'Black Tea Leaf', after: '黒い茶葉' },
    { before: 'Burble Tea Leaf', after: 'バーブル茶葉' },
    { before: 'Moolong Tea Leaf', after: 'ムーラン茶葉' },
    { before: 'Red Tea Leaf', after: '赤い茶葉' },
    { before: 'Emp Tea Leaf', after: 'エンプ茶葉' },
    { before: 'Pearl', after: 'パール' },
    { before: 'Amber', after: 'コハク' },
    { before: 'Garnet', after: 'ガーネット' },
    { before: 'Jade', after: 'ヒスイ' },
    { before: 'Amethyst', after: 'アメジスト' },
    { before: 'Moonstone', after: '月の石' },
    { before: 'Gator Vest', after: 'ガーターベスト' },
    { before: 'Snake Fang', after: '蛇の牙' },
    { before: 'Shoebill Feather', after: 'ハシビロコウの羽' },
    { before: 'Snail Shell', after: 'カタツムリの殻' },
    { before: 'Crab Pincer', after: 'カニばさみ' },
    { before: 'Turtle Shell', after: '亀の甲羅' },
    { before: 'Marine Scale', after: '大洋のうろこ' },
    { before: 'Treant Bark', after: 'トレントの樹皮' },
    { before: 'Centaur Hoof', after: 'ケンタウロスの蹄' },
    { before: 'Luna Wing', after: '月の翅' },
    { before: 'Gobo Stabber', after: 'ゴボスタバー' },
    { before: 'Gobo Slasher', after: 'ゴボスラッシャー' },
    { before: 'Gobo Smasher', after: 'ゴボスマッシャー' },
    { before: 'Gobo Shooter', after: 'ゴボシューター' },
    { before: 'Gobo Boomstick', after: 'ゴボブームスティック' },
    { before: 'Gobo Rag', after: 'ゴボの絨毯' },
    { before: 'Gobo Defender', after: 'ゴボディフェンダー' },
    { before: 'Goggles', after: 'ゴーグル' },
    { before: 'Magnifying Glass', after: '虫眼鏡' },
    { before: 'Eye Of The Watcher', after: 'ウォッチャーの眼' },
    { before: "Sorcerer's Sole", after: '魔法使いの靴底' },
    { before: 'Icy Cloth', after: '氷の布' },
    { before: 'Flaming Cloth', after: '燃え滾る布' },
    { before: 'Chrono Sphere', after: 'クロノスフィア' },
    { before: 'Frost Sphere', after: 'フロストスフィア' },
    { before: 'Panda Fluff', after: 'パンダのふわふわ' },
    { before: 'Black Bear Fluff', after: 'クロクマのふわふわ' },
    { before: 'Grizzly Bear Fluff', after: 'グリズリーのふわふわ' },
    { before: 'Polar Bear Fluff', after: 'シロクマのふわふわ' },
    { before: 'Red Panda Fluff', after: 'レッサーパンダのふわふわ' },
    { before: 'Magnet', after: '磁石' },
    { before: 'Stalactite Shard', after: '鍾乳石の破片' },
    { before: 'Living Granite', after: '生きた花崗岩' },
    { before: 'Colossus Core', after: 'コロッサスコア' },
    { before: 'Vampire Fang', after: '吸血鬼の牙' },
    { before: 'Werewolf Claw', after: '狼男の爪' },
    { before: 'Revenant Anima', after: 'レヴナントのアニマ' },
    { before: 'Soul Fragment', after: '魂の断片' },
    { before: 'Infernal Ember', after: '弾ける業火' },
    { before: 'Demonic Core', after: 'デーモニックコア' },
    { before: 'Blue Key Fragment', after: '青い鍵の欠片' },
    { before: 'Green Key Fragment', after: '緑の鍵の欠片' },
    { before: 'Purple Key Fragment', after: '紫の鍵の欠片' },
    { before: 'White Key Fragment', after: '白色の鍵の欠片' },
    { before: 'Orange Key Fragment', after: '橙色の鍵の欠片' },
    { before: 'Brown Key Fragment', after: '茶色の鍵の欠片' },
    { before: 'Stone Key Fragment', after: '石の鍵の欠片' },
    { before: 'Dark Key Fragment', after: '昏い鍵の欠片' },
    { before: 'Burning Key Fragment', after: '燃える鍵の欠片' },
    { before: 'Griffin Leather', after: 'グリフィンの皮' },
    { before: 'Manticore Sting', after: 'マンティコアの針' },
    { before: 'Jackalope Antler', after: 'ジャッカロープの枝角' },
    { before: 'Dodocamel Plume', after: 'ドードーの羽根' },
    { before: 'Griffin Talon', after: 'グリフィンの鉤爪' },
    { before: "Acrobat's Ribbon", after: '曲芸師のリボン' },
    { before: "Magician's Cloth", after: 'マジシャンの布' },
    { before: 'Chaotic Chain', after: '混沌とした鎖' },
    { before: 'Cursed Ball', after: '呪われた玉石' },
    { before: 'Royal Cloth', after: '王家の布' },
    { before: "Knight's Ingot", after: '騎士のインゴット' },
    { before: "Bishop's Scroll", after: 'ビショップの書' },
    { before: 'Regal Jewel', after: '王者の宝石' },
    { before: 'Sundering Jewel', after: '破断の宝石' },
    { before: 'Marksman Brooch', after: '狙撃手のブローチ' },
    { before: 'Corsair Crest', after: 'コルセアの紋章' },
    { before: 'Damaged Anchor', after: '傷ついた錨' },
    { before: 'Maelstrom Plating', after: 'メイルストロムの鍍金' },
    { before: 'Kraken Leather', after: 'クラーケンの皮' },
    { before: 'Kraken Fang', after: 'クラーケンの牙' },
    { before: 'Butter Of Proficiency', after: '熟練のバター' },
    { before: 'Thread Of Expertise', after: '熟達の糸' },
    { before: 'Branch Of Insight', after: '洞察の枝' },
    { before: 'Gluttonous Energy', after: '豪食のエネルギー' },
    { before: 'Guzzling Energy', after: '豪飲のエネルギー' },
    { before: 'Star Fragment', after: '星のかけら' },
    { before: 'Sunstone', after: '太陽の石' },
    { before: "Philosopher's Stone", after: '賢者の石' },
    { before: 'Shard Of Protection', after: '守護の欠片' },
    { before: 'Chimerical Quiver', after: '奇妙な矢筒' },
    { before: 'Sinister Cape', after: '不吉なマント' },
    { before: 'Enchanted Cloak', after: '魔法のクローク' },

    // 食べ物効果
    { before: 'HP Restore: 40 HP', after: 'HP回復: 40 HP' },
    { before: 'HP Restore: 80 HP', after: 'HP回復: 80 HP' },
    { before: 'HP Restore: 120 HP', after: 'HP回復: 120 HP' },
    { before: 'HP Restore: 160 HP', after: 'HP回復: 160 HP' },
    { before: 'HP Restore: 200 HP', after: 'HP回復: 200 HP' },
    { before: 'HP Restore: 240 HP', after: 'HP回復: 240 HP' },
    { before: 'HP Restore: 280 HP', after: 'HP回復: 280 HP' },
    { before: 'HP Restore: 50 HP over 30s', after: 'HP回復: 30秒かけて50HP回復' },
    { before: 'HP Restore: 100 HP over 30s', after: 'HP回復: 30秒かけて100HP回復' },
    { before: 'HP Restore: 150 HP over 30s', after: 'HP回復: 30秒かけて150HP回復' },
    { before: 'HP Restore: 200 HP over 30s', after: 'HP回復: 30秒かけて200HP回復' },
    { before: 'HP Restore: 250 HP over 30s', after: 'HP回復: 30秒かけて250HP回復' },
    { before: 'HP Restore: 300 HP over 30s', after: 'HP回復: 30秒かけて300HP回復' },
    { before: 'HP Restore: 350 HP over 30s', after: 'HP回復: 30秒かけて350HP回復' },
    { before: 'MP Restore: 40 MP', after: 'MP回復: 40MP' },
    { before: 'MP Restore: 80 MP', after: 'MP回復: 80MP' },
    { before: 'MP Restore: 120 MP', after: 'MP回復: 120MP' },
    { before: 'MP Restore: 160 MP', after: 'MP回復: 160MP' },
    { before: 'MP Restore: 200 MP', after: 'MP回復: 200MP' },
    { before: 'MP Restore: 240 MP', after: 'MP回復: 240MP' },
    { before: 'MP Restore: 280 MP', after: 'MP回復: 280MP' },
    { before: 'MP Restore: 50 MP over 30s', after: 'MP回復: 30秒かけて50MP回復' },
    { before: 'MP Restore: 100 MP over 30s', after: 'MP回復: 30秒かけて100MP回復' },
    { before: 'MP Restore: 150 MP over 30s', after: 'MP回復: 30秒かけて150MP回復' },
    { before: 'MP Restore: 200 MP over 30s', after: 'MP回復: 30秒かけて200MP回復' },
    { before: 'MP Restore: 250 MP over 30s', after: 'MP回復: 30秒かけて250MP回復' },
    { before: 'MP Restore: 300 MP over 30s', after: 'MP回復: 30秒かけて300MP回復' },
    { before: 'MP Restore: 350 MP over 30s', after: 'MP回復: 30秒かけて350MP回復' },

    // 経験値
    { before: 'Ability Exp Per Book', after: '1冊あたりのアビリティ経験値' }
  ],
  
  'ItemActionMenu': [
    { before: 'Equip', after: '装備' },
    { before: 'Cannot During Combat', after: '戦闘中は不可' },
    { before: 'Enhance', after: '強化' },
    { before: 'Learn', after: '習得' },
    { before: 'Alchemize', after: '錬金' },
    { before: 'View Marketplace', after: 'マーケット価格を見る' },
    { before: 'Link To Chat', after: 'チャットにリンクを貼る' },
    { before: 'Open Item Dictionary', after: 'アイテム辞典を見る' },
    { before: 'View Cowbell Store', after: 'カウベルストアを見る' },
    { before: 'Open', after: '使用する: ' },
    { before: 'Sell For ', after: '売却する: ' },
    { before: 'Coins', after: 'コイン' }
  ],
  
  'Ability': [
    // アビリティ
    { before: 'Auto Attack', after: '通常攻撃' },
    { before: 'Poke', after: 'ポーク' },
    { before: 'Impale', after: 'インペイル' },
    { before: 'Puncture', after: 'パンクチャー' },
    { before: 'Penetrating Strike', after: 'ペネトレイティングストライク' },
    { before: 'Scratch', after: 'スクラッチ' },
    { before: 'Cleave', after: 'クリーブ' },
    { before: 'Maim', after: 'メイム' },
    { before: 'Crippling Slash', after: 'クリップリングスラッシュ' },
    { before: 'Smack', after: 'スマック' },
    { before: 'Sweep', after: 'スウィープ' },
    { before: 'Stunning Blow', after: 'スタニングブロー' },
    { before: 'Fracturing Impact', after: 'フラクチャリングインパクト' },
    { before: 'Shield Bash', after: 'シールドバッシュ' },

    { before: 'Quick Shot', after: '速射' },
    { before: 'Aqua Arrow', after: '水の矢' },
    { before: 'Flame Arrow', after: '火の矢' },
    { before: 'Rain Of Arrows', after: '矢の雨' },
    { before: 'Silencing Shot', after: '沈黙の一撃' },
    { before: 'Steady Shot', after: '精密射撃' },
    { before: 'Pestilent Shot', after: '瘴気の一撃' },
    { before: 'Penetrating Shot', after: '貫通射撃' },

    { before: 'Water Strike', after: 'ウォーターストライク' },
    { before: 'Ice Spear', after: 'アイススピア' },
    { before: 'Frost Surge', after: 'フロストサージ' },
    { before: 'Mana Spring', after: 'マナスプリング' },
    { before: 'Entangle', after: 'エンタングル ' },
    { before: 'Toxic Pollen', after: 'トキシックポレン' },
    { before: "Nature's Veil", after: 'ネイチャーズヴェイル' },
    { before: "Life Drain", after: 'ライフドレイン' },
    { before: 'Fireball', after: 'ファイアボール' },
    { before: 'Flame Blast', after: 'フレイムブラスト' },
    { before: 'Firestorm', after: 'ファイアストーム' },
    { before: 'Smoke Burst', after: 'スモークバースト' },
    { before: 'Minor Heal', after: 'マイナーヒール' },
    { before: 'Heal', after: 'ヒール' },
    { before: 'Quick Aid', after: 'クイックエイド ' },
    { before: 'Rejuvenate', after: 'リジュビネイト' },

    { before: 'Taunt', after: 'タウント' },
    { before: 'Provoke', after: 'プロヴォーク' },
    { before: 'Toughness', after: 'タフネス' },
    { before: 'Elusiveness', after: 'エルーシブネス' },
    { before: 'Precision', after: 'プレシジョン' },
    { before: 'Berserk', after: 'バーサーク' },
    { before: 'Elemental Affinity', after: 'エレメンタルアフィニティ' },
    { before: 'Frenzy', after: 'フレンジー' },
    { before: 'Spike Shell', after: 'スパイクシェル' },
    { before: 'Arcane Reflection', after: 'アーケインリフレクション' },
    { before: 'Vampirism', after: 'ヴァンパイリズム' },

    { before: 'Revive', after: 'リバイブ' },
    { before: 'Insanity', after: 'インサニティ' },
    { before: 'Invincible', after: 'インビンシブル' },
    { before: 'Fierce Aura', after: 'フィアースオーラ' },
    { before: 'Aqua Aura', after: 'アクアオーラ' },
    { before: 'Sylvan Aura', after: 'シルヴァンオーラ' },
    { before: 'Flame Aura', after: 'フレイムオーラ' },
    { before: 'Speed Aura', after: 'スピードオーラ' },
    { before: 'Critical Aura', after: 'クリティカルオーラ' }
  ],
  
  'ItemRequired': [
    { before: 'Milking', after: '乳しぼり' },
    { before: 'Foraging', after: '採集' },
    { before: 'Woodcutting', after: '木こり' },
    { before: 'Cheesesmithing', after: 'チーズ鍛冶' },
    { before: 'Crafting', after: '製作' },
    { before: 'Tailoring', after: '裁縫' },
    { before: 'Cooking', after: '料理' },
    { before: 'Brewing', after: '醸造' },
    { before: 'Alchemy', after: '錬金術' },
    { before: 'Enhancing', after: '強化' },
    { before: 'Combat', after: '戦闘' },
    { before: 'Stamina', after: '体力' },
    { before: 'Intelligence', after: '知力' },
    { before: 'Attack', after: '攻撃力' },
    { before: 'Power', after: '腕力' },
    { before: 'Defense', after: '防御力' },
    { before: 'Ranged', after: '遠距離攻撃力' },
    { before: 'Magic', after: '魔法攻撃力' }
  ],
  
  'ItemEffect': [
    // 赤本
    { before: 'Effect: Attacks enemy for 10HP+60% stab damage as physical damage. ', 'after': '効果: 敵に10HP+60%の刺突ダメージを物理ダメージとして攻撃する。' },
    { before: 'Effect: Attacks enemy for 20HP+90% stab damage as physical damage. ', 'after': '効果: 敵に20HP+90％の刺突ダメージを物理ダメージとして与える。' },
    { before: "Effect: Attacks enemy for 30HP+110% stab damage as physical damage. Decreases target's armor by -20% for 10s. ", 'after': '効果: 敵に30HP+110％の刺突ダメージを物理ダメージとして与える。10秒間、敵の防御力を-20％。' },
    { before: 'Effect: Attacks enemy for 30HP+80% stab damage as physical damage. 100% chance to pierce. ', 'after': '効果: 敵に30HP+80％の刺突ダメージを物理ダメージとして与える。100％の確率で貫通する。' },
    { before: 'Effect: Attacks enemy for 10HP+60% slash damage as physical damage. ', 'after': '効果: 敵に10HP+60％の斬撃ダメージを物理ダメージとして与える。' },
    { before: 'Effect: Attacks all enemies for 20HP+50% slash damage as physical damage. ', 'after': '効果: 全ての敵に20HP+50％の斬撃ダメージを物理ダメージとして与える。' },
    { before: "Effect: Attacks enemy for 30HP+65% slash damage as physical damage. bleeds for 100% dealt damage over 9s. Increases target's damage taken by 8% for 12s. ", 'after': '効果: 敵に30HP+65％の斬撃ダメージを物理ダメージとして与える。9秒間、与ダメージの100％を出血ダメージとして与える。12秒間、対象の被ダメージ量を8％上げる。' },
    { before: "Effect: Attacks enemy for 30HP+100% slash damage as physical damage. Decreases target's damage by -15% for 12s. ", 'after': '効果: 敵に30HP+100％の斬撃ダメージを物理ダメージとして与える。12秒間、敵からのダメージを-15％。' },
    { before: "Effect: Attacks all enemies for 20HP+60% slash damage as physical damage. Decreases target's damage by -12% for 12s. ", 'after': '全ての敵に20HP+60%の斬撃ダメージを物理ダメージとして与える。12秒間、対象の防御力を-12％。' },
    { before: 'Effect: Attacks enemy for 10HP+60% smash damage as physical damage. ', 'after': '効果: 敵に10HP+60％の殴打ダメージを物理ダメージとして与える。' },
    { before: 'Effect: Attacks all enemies for 20HP+50% smash damage as physical damage. ', 'after': '効果: 全ての敵に20HP+50％の殴打ダメージを物理ダメージとして与える。' },
    { before: 'Effect: Attacks enemy for 30HP+100% smash damage as physical damage. 70% chance to stun for 3s. ', 'after': '効果: 敵に30HP+100％の殴打ダメージを物理ダメージとして与える。70％の確率で3秒間スタンさせる。' },
    { before: "Effect: Attacks all enemies for 20HP+60% smash damage as physical damage. Increases target's damage taken by 5% for 12s. ", 'after': '効果: 全ての敵に20HP+60%の殴打ダメージを物理ダメージとして与える。12秒間、対象の被ダメージ量を5％上げる。' },
    { before: "Effect: Attacks enemy for 10HP+30% smash damage as physical damage. Bonus damage equal to 60% armor. ", 'after': '効果: 敵に10HP+30%の殴打ダメージを物理ダメージとして与える。追加ダメージは防御力の60％に相当する。' },

    // 緑本
    { before: 'Effect: Attacks enemy for 10HP+55% ranged damage as physical damage. ', after: '効果: 敵に10HP+55％の遠距離攻撃ダメージを物理ダメージとして与える。' },
    { before: 'Effect: Attacks enemy for 20HP+90% ranged damage as water damage. ', after: '効果: 敵に20HP+90％の遠距離ダメージを水属性ダメージとして与える。' },
    { before: 'Effect: Attacks enemy for 20HP+90% ranged damage as fire damage. ', after: '効果: 敵に20HP+90％の遠距離ダメージを炎属性ダメージとして与える。' },
    { before: 'Effect: Attacks all enemies for 20HP+50% ranged damage as physical damage. ', after: '効果: 全ての敵に20HP+50％の遠距離ダメージを物理ダメージとして与える。' },
    { before: 'Effect: Attacks enemy for 30HP+100% ranged damage as physical damage. 60% chance to silence for 5s. ', after: '効果: 敵に30HP+100％の遠距離ダメージを物理ダメージとして与える。60％の確率で5秒間沈黙させる。' },
    { before: 'Effect: Attacks enemy with 200% total accuracy for 30HP+100% ranged damage as physical damage. ', after: '効果: 敵に200％の命中力で攻撃し、30HP+100％の遠距離ダメージを物理ダメージとして与える。' },
    { before: "Effect: Attacks enemy for 30HP+100% ranged damage as physical damage. Decreases target's hp regen by -25% for 10s. Decreases target's mp regen by -25% for 10s. ", after: '効果: 敵に30HP+100％の遠距離ダメージを物理ダメージとして与える。10秒間、敵のHP回復量を-25％。10秒間、敵のMP回復量を-25％。' },
    { before: 'Effect: Attacks enemy for 30HP+80% ranged damage as physical damage. 100% chance to pierce. ', after: '効果: 敵に30HP+80％の遠距離ダメージを物理ダメージとして与える。100％の確率で貫通する。' },

    // 紫本
    { before: 'Effect: Attacks enemy for 10HP+60% magic damage as water damage. ', after: '効果: 敵に10HP+60％の魔法ダメージを水属性として与える。' },
    { before: "Effect: Attacks enemy for 20HP+130% magic damage as water damage. Decreases target's attack speed by -25% for 8s. ", after: '効果: 敵に20HP+130％の魔法ダメージを水属性として与える。8秒間、対象の攻撃速度を-25％。' },
    { before: "Effect: Attacks all enemies for 30HP+100% magic damage as water damage. Decreases target's evasion by -10% for 9s. ", after: '効果: 全ての敵に30HP+100％の魔法ダメージを水属性として与える。9秒間、対象の回避力を-10％。' },
    { before: 'Effect: Attacks all enemies for 30HP+70% magic damage as water damage. ', after: '効果: 全ての敵に30HP+70％の魔法ダメージを水属性として与える。' },
    { before: "Effect: Increases all allies' mp regen by 50% for 10s. ", after: '効果: 10秒間、全ての味方のMP回復を50％上げる。' },
    { before: 'Effect: Attacks enemy for 10HP+52% magic damage as nature damage. 10% chance to stun for 2s. ', after: '効果: 敵に10HP+52％の魔法ダメージを自然属性として与える。10％の確率で2秒スタンさせる。' },
    { before: "Effect: Attacks all enemies for 20HP+80% magic damage as nature damage. Decreases target's armor by -12 for 12s. Decreases target's water resistance by -15 for 12s. Decreases target's nature resistance by -20 for 12s. Decreases target's fire resistance by -15 for 12s. ", after: '効果: 全ての敵に20HP+80％の魔法ダメージを自然属性として与える。12秒間、対象の防御力は-12。12秒間、対象の水属性抵抗は-15。12秒間、対象の自然属性抵抗は-20。12秒間、対象の炎属性抵抗は-15。' },
    { before: 'Effect: Attacks all enemies for 30HP+100% magic damage as nature damage. 50% chance to blind for 5s. ', after: '効果: 全ての敵に30HP+100％の魔法ダメージを自然属性として与える。50％の確率で、5秒間盲目になる。' },
    { before: 'Effect: Attacks enemy for 30HP+180% magic damage as nature damage. Drains 8% of dealt damage as HP. ', after: '効果: 敵に30HP+180%の魔法ダメージを自然属性として与える。与えたダメージの8%をHPとして吸収する。' },
    { before: 'Effect: Attacks enemy for 10HP+60% magic damage as fire damage. ', after: '効果: 敵に10HP+60％の魔法ダメージを炎属性として与える。' },
    { before: 'Effect: Attacks all enemies for 20HP+80% magic damage as fire damage. ', after: '効果: 全ての敵に20HP+80％の魔法ダメージを炎属性として与える。' },
    { before: 'Effect: Attacks all enemies for 20HP+60% magic damage as fire damage. burns for 100% dealt damage over 6s. ', after: '効果: 全ての敵に20HP+60％の魔法ダメージを炎属性として与える。6秒間、炎上で100％のダメージを与える。' },
    { before: "Effect: Attacks enemy for 30HP+180% magic damage as fire damage. Decreases target's accuracy by -15% for 8s. Decreases target's evasion by -15% for 8s. ", after: '効果: 敵に30HP+180％の魔法ダメージを炎属性として与える。8秒間、対象の命中力を-15％。8秒間、対象の回避力を-15％。' },
    { before: 'Effect: Heals self for 20HP+30% magic damage. ', after: '効果: 自分自身を20HP+30％回復する。' },
    { before: 'Effect: Heals self for 30HP+45% magic damage. ', after: '効果: 自分自身を30HP+45％回復する。' },
    { before: 'Effect: Heals lowest HP ally for 40HP+30% magic damage. ', after: '効果: 最もHP割合が低い仲間を40HP+30％回復する。' },
    { before: 'Effect: Heals all allies for 30HP+20% magic damage. ', after: '効果: 全ての仲間を30HP+20％回復する。' },

    // 黄本
    { before: 'Effect: Increases  threat by 250% for 65s. ', after: '効果: 65秒間、自分の狙われやすさを250％上げる。' },
    { before: 'Effect: Increases  threat by 500% for 65s. ', after: '効果: 65秒間、自分の狙われやすさを500％上げる。' },
    { before: 'Effect: Increases  armor by 20%+20 for 20s. Increases  water resistance by 20%+20 for 20s. Increases  nature resistance by 20%+20 for 20s. Increases  fire resistance by 20%+20 for 20s. ', after: '効果: 20秒間、防御力が20％+20上がる。20秒間、水属性耐性が20％+20上がる。20秒間、自然属性耐性が20％+20上がる。20秒間、炎属性耐性が20％+20上がる。' },
    { before: 'Effect: Increases  evasion by 20% for 20s. ', after: '効果: 20秒間、回避力を20％上げる。' },
    { before: 'Effect: Increases  accuracy by 40% for 20s. ', after: '効果: 20秒間、命中力を40％上げる。' },
    { before: 'Effect: Increases  physical amplify by 18% for 20s. ', after: '効果: 20秒間、物理ダメージ増幅確率を18％上げる。' },
    { before: 'Effect: Increases  water amplify by 40% for 20s. Increases  nature amplify by 40% for 20s. Increases  fire amplify by 40% for 20s. ', after: '効果: 20秒間、水属性ダメージ増幅確率を40％上げる。20秒間、自然属性ダメージ増幅確率を40％上げる。20秒間、炎属性ダメージ増幅確率を40％上げる。' },
    { before: 'Effect: Increases  attack speed by 24% for 20s. ', after: '効果: 20秒間、攻撃速度を24％上げる。' },
    { before: 'Effect: Increases  physical thorns by 20% for 20s. ', after: '効果: 20秒間、敵から受ける物理ダメージの18％を反射する。' },
    { before: 'Effect: Increases  elemental thorns by 25% for 20s. ', after: '効果: 20秒間、敵から受ける属性ダメージの25％を反射する。' },
    { before: 'Effect: Increases  life steal by 8% for 20s. ', after: '効果: 20秒間、8％のHP吸収効果を得る' },

    // 水本
    { before: 'Effect: Revives and heals a defeated ally for 100HP+100% magic damage. ', after: '効果: 倒れた仲間を100HP+100％の回復とともに復活させる' },
    { before: 'Effect: Increases  damage by 30% for 12s. Increases  attack speed by 30% for 12s. Increases  cast speed by 30% for 12s. ', after: '効果: 12秒間、ダメージを30％上げる。12秒間、攻撃速度を30％上げる。12秒間、詠唱速度を30％上げる。' },
    { before: 'Effect: Costs 30% of current HP. ', after: '効果: 現在HPの30％を消費する。' },
    { before: 'Effect: Increases  armor by 700 for 12s. Increases  water resistance by 700 for 12s. Increases  nature resistance by 700 for 12s. Increases  fire resistance by 700 for 12s. Increases  tenacity by 700 for 12s. ', after: '効果: 12秒間、防御力を700上げる。12秒間、水属性耐性を700上げる。12秒間、自然属性耐性を700上げる。12秒間、炎属性耐性を700上げる。12秒間、状態異常耐性を700上げる。' },
    { before: "Effect: Increases all allies' physical amplify by 6% for 120s. Increases all allies' armor by 4 for 120s. ", after: '効果: 120秒間、全ての味方の物理ダメージ増幅確率を6％上げる。120秒間、全ての味方の防御力を4上げる。' },
    { before: "Effect: Increases all allies' water amplify by 8% for 120s. Increases all allies' water resistance by 4 for 120s. ", after: '効果: 120秒間、全ての味方の水属性ダメージ増幅確率を8％上げる。120秒間、全ての味方の水属性耐性を4上げる。' },
    { before: "Effect: Increases all allies' nature amplify by 6% for 120s. Increases all allies' healing amplify by 6% for 120s. Increases all allies' nature resistance by 4 for 120s. ", after: '効果: 120秒間、全ての味方の自然属性ダメージ増幅確率を6％上げる。120秒間、全ての味方の回復効果を6％上げる。120秒間、全ての味方の自然属性耐性を4上げる。' },
    { before: "Effect: Increases all allies' fire amplify by 8% for 120s. Increases all allies' fire resistance by 4 for 120s. ", after: '効果: 120秒間、全ての味方の炎属性ダメージ増幅確率を8％上げる。120秒間、全ての味方の炎属性耐性を4上げる。' },
    { before: "Effect: Increases all allies' attack speed by 4% for 120s. Increases all allies' cast speed by 4% for 120s. ", after: '効果: 120秒間、全ての味方の攻撃速度を4％上げる。120秒間、全ての味方の詠唱速度を4％上げる。' },
    { before: "Effect: Increases all allies' critical rate by 3% for 120s. ", after: '効果: 120秒間、全ての味方のクリティカル率が3％上がる。' }
  ],
  
  'ItemDescription': [
    // 赤本
    { 'before': 'Description: Pokes the targeted enemy', 'after': '説明: 対象の敵を突く' },
    { 'before': 'Description: Impales the targeted enemy', 'after': '説明: 対象の敵を突き刺す' },
    { 'before': "Description: Punctures the targeted enemy's armor, dealing damage and temporarily reducing its armor", 'after': '説明: 対象の敵の装甲に孔を開け、ダメージを与えつつ一時的に相手の防御力を下げる' },
    { 'before': 'Description: Strikes the targeted enemy. On each successful hit, will pierce and hit the next enemy.', 'after': '説明: 対象の敵を打ち付ける。命中するたびに貫通し、次の敵に当たる' },
    { 'before': 'Description: Scratches the targeted enemy', 'after': '説明: 対象の敵を引っかく' },
    { 'before': 'Description: Cleaves all enemies', 'after': '説明: 敵全体を切り裂く' },
    { 'before': 'Description: Maims the targeted enemy and causes bleeding', 'after': '説明: 対象の敵に深手を負わせ出血させる' },
    { 'before': 'Description: Slashes all enemies and reduce their damage', 'after': '説明: 全ての敵を切りつけ攻撃力を下げる' },
    { 'before': 'Description: Slashes the targeted enemy and reduce their damage', 'after': '説明: 対象の敵を切りつけ攻撃力を下げる' },
    { 'before': 'Description: Smacks the targeted enemy', 'after': '説明: 対象の敵を叩く' },
    { 'before': 'Description: Performs a sweeping attack on all enemies', 'after': '説明: 全ての敵を一掃する攻撃をする' },
    { 'before': 'Description: Smashes the targeted enemy and has a chance to stun', 'after': '説明: 対象の敵を打ち付け確率でスタンさせる' },
    { 'before': 'Description: Attacks all enemies, dealing damage and increases their damage taken', 'after': '説明: 全ての敵を攻撃し、ダメージを与えつつ被ダメージ量を増加させる' },
    { 'before': "Description: Bashes the targeted enemy with a shield, dealing extra damage based on attacker's armor", 'after': '説明: 対象の敵を盾で打ちつけ、使用者の防御力に応じた追加ダメージを与える。' },

    // 緑本
    { before: 'Description: Takes a quick shot at the targeted enemy', after: '説明: 対象の敵を素早く撃つ' },
    { before: 'Description: Shoots an arrow made of water at the targeted enemy', after: '説明: 対象の敵に水でできた矢を放つ' },
    { before: 'Description: Shoots a flaming arrow at the targeted enemy', after: '説明: 対象の敵に燃える矢を撃つ' },
    { before: 'Description: Shoots a rain of arrows on all enemies', after: '説明: 全ての敵に雨のごとく矢を放つ' },
    { before: 'Description: Takes a shot at the targeted enemy, temporarily silencing them', after: '説明: 対象の敵を射ち、一時的に沈黙させる' },
    { before: 'Description: Takes a shot at the targeted enemy with greatly enhanced accuracy', after: '説明: 対象の敵を、大幅に強化された命中力で射つ。' },
    { before: 'Description: Shoots the targeted enemy, dealing damage and decreasing regeneration', after: '説明: 対象の敵を撃ち、ダメージを与えつつ自然回復を低下させる' },
    { before: 'Description: Shoots the targeted enemy. On each successful hit, will pierce and hit the next enemy', after: '説明: 対象の敵を撃つ。命中するたびに貫通し、次の敵に当たる' },

    // 紫本
    { before: 'Description: Casts a water strike at the targeted enemy', after: '説明: 対象の敵に向かってウォーターストライクを唱える' },
    { before: 'Description: Casts an ice spear at the targeted enemy, dealing damage and reducing attack speed', after: '説明: 対象の敵に向かってアイススピアを唱え、ダメージを与えつつ攻撃速度を遅くする' },
    { before: 'Description: Casts frost surge at all enemies, dealing damage and reducing evasion', after: '説明: 全ての敵に向かってフロストサージを唱え、ダメージを与えつつ回避力を下げる' },
    { before: 'Description: Casts mana spring at all enemies, dealing damage and increasing ally MP regeneration', after: '説明: 全ての敵に向かってマナスプリングを唱え、ダメージを与えつつ味方のMP回復を上げる' },
    { before: 'Description: Entangles the targeted enemy, dealing damage with chance to stun', after: '説明: 対象の敵を絡め取り、ダメージを与えつつ確率でスタンさせる' },
    { before: 'Description: Casts toxic pollen at all enemies, dealing damage and decreasing armor and resistances', after: '説明: 全ての敵に向かってトキシックポレンを唱え、ダメージを与えつつ防御と抵抗を下げる' },
    { before: "Description: Cast's a veil over all enemies, dealing damage with a chance to blind", after: '説明: 全ての敵に向かってネイチャーズヴェールを唱え、ダメージを与えつつ確率で盲目にする' },
    { before: 'Description: Drains the life force of the targeted enemy, dealing damage and healing the caster', after: '説明: 対象の敵の生命力を吸い取り、ダメージを与えつつ自分のHPを回復する' },
    { before: 'Description: Casts a fireball at the targeted enemy', after: '説明: 対象の敵に向かってファイアボールを唱える' },
    { before: 'Description: Casts a flame blast at all enemies', after: '説明: 全ての敵に向かってフレイムブラストを唱える' },
    { before: 'Description: Casts a firestorm at all enemies', after: '説明: 全ての敵に向かってファイアストームを唱える' },
    { before: 'Description: Casts a smoke burst at the targeted enemy, dealing damage and decreasing their accuracy', after: '説明: 対象の敵にスモークバーストを唱え、ダメージを与え対象の命中力を下げる' },
    { before: 'Description: Casts minor heal on yourself', after: '説明: 自分自身にマイナーヒールを唱える' },
    { before: 'Description: Casts heal on yourself', after: '説明: 自分自身にヒールを唱える' },
    { before: 'Description: Casts heal on the ally with the lowest HP percentage', after: '説明: 最もHP割合が低い仲間にヒールを唱える' },
    { before: 'Description: Heals all allies', after: '説明: 全ての仲間を回復する' },

    // 黄本
    { before: 'Description: Greatly increases threat rating', after: '説明: 狙われやすさを大幅に上げる' },
    { before: 'Description: Tremendously increases threat rating', after: '説明: 狙われやすさを凄まじく上げる' },
    { before: 'Description: Greatly increases armor and resistances temporarily', after: '説明: 防御力と属性耐性を一時的に大幅に上昇させる' },
    { before: 'Description: Greatly increases evasion temporarily', after: '説明: 回避力を一時的に大幅に上昇させる' },
    { before: 'Description: Greatly increases accuracy temporarily', after: '説明: 命中力を一時的に大幅に上昇させる' },
    { before: 'Description: Greatly increases physical damage temporarily', after: '説明: 物理ダメージを一時的に大幅に上昇させる' },
    { before: 'Description: Greatly increases elemental damage temporarily', after: '説明: 属性ダメージを一時的に大幅に上昇させる' },
    { before: 'Description: Greatly increases attack speed temporarily', after: '説明: 攻撃速度を一時的に大幅に上昇させる' },
    { before: 'Description: Gains physical thorns temporarily', after: '説明: 物理ダメージ反射効果を一時的に得る' },
    { before: 'Description: Gains elemental thorns temporarily', after: '説明: 属性ダメージ反射効果を一時的に得る' },
    { before: 'Description: Gains lifesteal temporarily', after: '説明: HP吸収効果を一時的に得る' },

    // 水本
    { before: 'Description: Revives a dead ally', after: '説明: 倒れた仲間を復活させる' },
    { before: 'Description: Increases damage, attack speed, and cast speed temporarily at the cost of HP', after: '説明: HPを消費し、ダメージ、攻撃速度、詠唱速度を一時的に上昇させる' },
    { before: 'Description: Tremendously increases armor, resistances, and tenacity temporarily', after: '説明: 防御力、属性耐性、状態異常耐性を一時的に凄まじく上昇させる' },
    { before: 'Description: Increases physical amplify and armor for all allies', after: '説明: 全ての味方の物理ダメージと防御力を上昇させる' },
    { before: 'Description: Increases water amplify and resistance for all allies', after: '説明: 全ての味方の水属性ダメージと耐性を上昇させる' },
    { before: 'Description: Increases nature amplify and resistance for all allies', after: '説明: 全ての味方の自然属性ダメージと耐性、回復力を上げる' },
    { before: 'Description: Increases fire amplify and resistance for all allies', after: '説明: 全ての味方の炎属性ダメージと耐性を上昇させる' },
    { before: 'Description: Increases attack speed and cast speed for all allies', after: '説明: 全ての味方の攻撃速度と詠唱速度を上昇させる' },
    { before: 'Description: Increases critical rate for all allies', after: '説明: 全ての味方のクリティカル率を上昇させる' }
  ],

  'ConsumableDetail1': [
    { before: 'Detail: Chance to gain +2 instead of +1 on enhancing success', after: '詳細: 強化成功時に+2される確率上昇' }
  ],

  'ConsumableDetail2': [
    { before: 'Duration', after: '効果時間' },
    { before: 'Efficiency', after: 'リピート率' },
    { before: 'Milking Level', after: '乳しぼりレベル' },
    { before: 'Foraging Level', after: '採集レベル' },
    { before: 'Woodcutting Level', after: '木こりレベル' },
    { before: 'Cooking Level', after: '料理レベル' },
    { before: 'Brewing Level', after: '醸造レベル' },
    { before: 'Alchemy Level', after: '錬金術レベル' },
    { before: 'Enhancing Level', after: '強化レベル' },
    { before: 'Cheesesmithing Level', after: 'チーズ鍛冶レベル' },
    { before: 'Crafting Level', after: '製作レベル' },
    { before: 'Tailoring Level', after: '裁縫レベル' },
    { before: 'Action Speed', after: 'アクション速度' },
    { before: 'Gathering', after: '収集' },
    { before: 'Gourmet', after: 'グルメ' },
    { before: 'Wisdom', after: '知恵' },
    { before: 'Processing', after: '処理' },
    { before: 'Artisan', after: '職人' },
    { before: 'Action Level', after: 'アクションレベル' },
    { before: 'Alchemy Success', after: '錬金術成功率' },
    { before: 'Blessed', after: '祝福' },
    { before: 'Stamina Level', after: '体力レベル' },
    { before: 'Intelligence Level', after: '知力レベル' },
    { before: 'Defense Level', after: '防御力レベル' },
    { before: 'Attack Level', after: '攻撃力レベル' },
    { before: 'Power Level', after: '腕力レベル' },
    { before: 'Ranged Level', after: '遠距離攻撃力レベル' },
    { before: 'Magic Level', after: '魔法攻撃力レベル' },

    { before: 'Detail: Buffs milking level', after: '詳細: 乳しぼりレベル上昇' },
    { before: 'Detail: Buffs foraging level', after: '詳細: 採集レベル上昇' },
    { before: 'Detail: Buffs woodcutting level', after: '詳細: 木こりレベル上昇' },
    { before: 'Detail: Buffs cooking level', after: '詳細: 料理レベル上昇' },
    { before: 'Detail: Buffs brewing level', after: '詳細: 醸造レベル上昇' },
    { before: 'Detail: Buffs alchemy level', after: '詳細: 錬金術レベル上昇' },
    { before: 'Detail: Buffs enhancing level', after: '詳細: 強化レベル上昇' },
    { before: 'Detail: Buffs cheesesmithing level', after: '詳細: チーズ鍛冶レベル上昇' },
    { before: 'Detail: Buffs crafting level', after: '詳細: 製作レベル上昇' },
    { before: 'Detail: Buffs tailoring level', after: '詳細: 裁縫レベル上昇' },
    { before: 'Detail: Reduces required materials during production', after: '詳細: 生産に必要な素材削減' },
    { before: 'Detail: Buffs stamina level', after: '詳細: 体力レベル上昇' },
    { before: 'Detail: Buffs intelligence level', after: '詳細: 知力レベル上昇' },
    { before: 'Detail: Increases critical rate', after: '詳細: クリティカル確率上昇' },

    { before: 'Detail: Chance of repeating the action instantly', after: '詳細: アクションのリピート率上昇' },
    { before: 'Detail: Decreases time cost for the action', after: '詳細: アクションの実行時間短縮' },
    { before: 'Detail: Increases gathering quantity', after: '詳細: 採集数量増加' },
    { before: 'Detail: Chance to produce an additional item for free', after: '詳細: 追加アイテムの無料生産確率上昇' },
    { before: 'Detail: Increases experience gained', after: '詳細: 獲得経験値増加' },
    { before: 'Detail: Chance to instantly convert gathered resource into processed material', after: '詳細: 採集したアイテムの即時加工確率上昇' },
    { before: 'cheese, fabric, and lumber', after: 'チーズ, 布, 丸太' },
    { before: 'Detail: Increases required levels for the action', after: '詳細: アクション実行に必要なレベル増加' },
    { before: 'Detail: Multiplicative bonus to success rate while alchemizing', after: '詳細: 錬金術の成功率上昇' },
    { before: 'Detail: Chance to gain +2 instead of +1 on enhancing success', after: '詳細: 強化成功時に+2される確率上昇' },
    { before: 'Detail: Increases HP regeneration', after: '詳細: HP自然回復量増加' },
    { before: 'Detail: Increases MP regeneration', after: '詳細: MP自然回復量増加' },
    { before: 'Detail: Buffs defense level', after: '詳細: 防御力レベル上昇' },
    { before: 'Detail: Buffs attack level', after: '詳細: 攻撃力レベル上昇' },
    { before: 'Detail: Buffs power level', after: '詳細: 腕力レベル上昇' },
    { before: 'Detail: Buffs ranged level', after: '詳細: 近距離攻撃力レベル上昇' },
    { before: 'Detail: Buffs magic level', after: '詳細: 魔法攻撃力レベル上昇' },
    { before: 'Detail: Increases drop rate of combat loot', after: '詳細: 戦闘でのドロップ確率上昇' },
    { before: 'Detail: Increases auto attack speed', after: '詳細: 通常攻撃の速度上昇' },
    { before: 'Detail: Increases ability casting speed', after: '詳細: アビリティの詠唱速度上昇' },
    { before: 'Detail: Increases critical damage', after: '詳細: クリティカルダメージ上昇' },
  ],
  
  'Action': [
    // 乳搾り
    { before: 'Cow', after: 'ウシ' },
    { before: 'Verdant Cow', after: 'ヴァーダント牛' },
    { before: 'Azure Cow', after: 'アズール牛' },
    { before: 'Burble Cow', after: 'バーブル牛' },
    { before: 'Crimson Cow', after: 'クリムゾン牛' },
    { before: 'Unicow', after: 'ユニ牛ーン' },
    { before: 'Holy Cow', after: 'ホーリー牛' },

    // 採集
    { before: 'Egg', after: '卵' },
    { before: 'Wheat', after: '小麦' },
    { before: 'Sugar', after: '砂糖' },
    { before: 'Cotton', after: '綿花' },
    { before: 'Farmland', after: '農場' },
    { before: 'Blueberry', after: 'ブルーベリー' },
    { before: 'Apple', after: 'リンゴ' },
    { before: 'Arabica Coffee Bean', after: 'アラビカコーヒー豆' },
    { before: 'Flax', after: '亜麻' },
    { before: 'Shimmering Lake', after: 'きらめく湖' },
    { before: 'Blackberry', after: 'ブラックベリー' },
    { before: 'Orange', after: 'オレンジ' },
    { before: 'Robusta Coffee Bean', after: 'ロブスタコーヒー豆' },
    { before: 'Misty Forest', after: '霧の森' },
    { before: 'Strawberry', after: 'イチゴ' },
    { before: 'Plum', after: 'プラム' },
    { before: 'Liberica Coffee Bean', after: 'リベリカコーヒー豆' },
    { before: 'Bamboo Branch', after: '竹の枝' },
    { before: 'Burble Beach', after: '賑わう浜辺' },
    { before: 'Mooberry', after: 'モーベリー' },
    { before: 'Peach', after: 'モモ' },
    { before: 'Excelsa Coffee Bean', after: 'エクセルサコーヒー豆' },
    { before: 'Cocoon', after: 'マユ' },
    { before: 'Silly Cow Valley', after: 'シリカウバレー' },
    { before: 'Marsberry', after: 'マーズベリー' },
    { before: 'Dragon Fruit', after: 'ドラゴンフルーツ' },
    { before: 'Fieriosa Coffee Bean', after: 'フェリオサコーヒー豆' },
    { before: 'Olympus Mons', after: 'オリンポス山' },
    { before: 'Spaceberry', after: 'スペースベリー' },
    { before: 'Star Fruit', after: 'スターフルーツ' },
    { before: 'Spacia Coffee Bean', after: '宇宙コーヒー豆' },
    { before: 'Radiant Fiber', after: '輝く繊維' },
    { before: 'Asteroid Belt', after: 'アステロイドベルト' },

    // 木こり
    { before: 'Tree', after: '木' },
    { before: 'Birch Tree', after: 'シラカバの木' },
    { before: 'Cedar Tree', after: 'スギの木' },
    { before: 'Purpleheart Tree', after: 'パープルハートの木' },
    { before: 'Ginkgo Tree', after: 'イチョウの木' },
    { before: 'Redwood Tree', after: 'セコイアの木' },
    { before: 'Arcane Tree', after: 'アーケインの木' },

    //チーズ鍛冶
    { before: 'Cheese', after: 'チーズ' },
    { before: 'Verdant Cheese', after: 'ヴァーダントチーズ' },
    { before: 'Azure Cheese', after: 'アズールチーズ' },
    { before: 'Burble Cheese', after: 'バーブルチーズ' },
    { before: 'Crimson Cheese', after: 'クリムゾンチーズ' },
    { before: 'Rainbow Cheese', after: 'レインボーチーズ' },
    { before: 'Holy Cheese', after: 'ホーリーチーズ' },
    { before: 'Cheese Brush', after: 'チーズのブラシ' },
    { before: 'Cheese Shears', after: 'チーズのハサミ' },
    { before: 'Cheese Hatchet', after: 'チーズの手斧' },
    { before: 'Cheese Hammer', after: 'チーズのハンマー' },
    { before: 'Cheese Chisel', after: 'チーズの彫刻刀' },
    { before: 'Cheese Needle', after: 'チーズの裁縫針' },
    { before: 'Cheese Spatula', after: 'チーズのヘラ' },
    { before: 'Cheese Pot', after: 'チーズのポット' },
    { before: 'Cheese Alembic', after: 'チーズの蒸留器' },
    { before: 'Cheese Enhancer', after: 'チーズの強化器' },
    { before: 'Verdant Brush', after: '若葉のブラシ' },
    { before: 'Verdant Shears', after: '若葉のハサミ' },
    { before: 'Verdant Hatchet', after: '若葉の手斧' },
    { before: 'Verdant Hammer', after: '若葉のハンマー' },
    { before: 'Verdant Chisel', after: '若葉の彫刻刀' },
    { before: 'Verdant Needle', after: '若葉の裁縫針' },
    { before: 'Verdant Spatula', after: '若葉のヘラ' },
    { before: 'Verdant Pot', after: '若葉のポット' },
    { before: 'Verdant Alembic', after: '若葉の蒸留器' },
    { before: 'Verdant Enhancer', after: '若葉の強化器' },
    { before: 'Azure Brush', after: '青空のブラシ' },
    { before: 'Azure Shears', after: '青空のハサミ' },
    { before: 'Azure Hatchet', after: '青空の手斧' },
    { before: 'Azure Hammer', after: '青空のハンマー' },
    { before: 'Azure Chisel', after: '青空の彫刻刀' },
    { before: 'Azure Needle', after: '青空の裁縫針' },
    { before: 'Azure Spatula', after: '青空のヘラ' },
    { before: 'Azure Pot', after: '青空のポット' },
    { before: 'Azure Alembic', after: '青空の蒸留器' },
    { before: 'Azure Enhancer', after: '青空の強化器' },
    { before: 'Burble Brush', after: '紫紺のブラシ' },
    { before: 'Burble Shears', after: '紫紺のハサミ' },
    { before: 'Burble Hatchet', after: '紫紺の手斧' },
    { before: 'Burble Hammer', after: '紫紺のハンマー' },
    { before: 'Burble Chisel', after: '紫紺の彫刻刀' },
    { before: 'Burble Needle', after: '紫紺の裁縫針' },
    { before: 'Burble Spatula', after: '紫紺のヘラ' },
    { before: 'Burble Pot', after: '紫紺のポット' },
    { before: 'Burble Alembic', after: '紫紺の蒸留器' },
    { before: 'Burble Enhancer', after: '紫紺の強化器' },
    { before: 'Crimson Brush', after: '深紅のブラシ' },
    { before: 'Crimson Shears', after: '深紅のハサミ' },
    { before: 'Crimson Hatchet', after: '深紅の手斧' },
    { before: 'Crimson Hammer', after: '深紅のハンマー' },
    { before: 'Crimson Chisel', after: '深紅の彫刻刀' },
    { before: 'Crimson Needle', after: '深紅の裁縫針' },
    { before: 'Crimson Spatula', after: '深紅のヘラ' },
    { before: 'Crimson Pot', after: '深紅のポット' },
    { before: 'Crimson Alembic', after: '深紅の蒸留器' },
    { before: 'Crimson Enhancer', after: '深紅の強化器' },
    { before: 'Rainbow Brush', after: '虹のブラシ' },
    { before: 'Rainbow Shears', after: '虹のハサミ' },
    { before: 'Rainbow Hatchet', after: '虹の手斧' },
    { before: 'Rainbow Hammer', after: '虹のハンマー' },
    { before: 'Rainbow Chisel', after: '虹の彫刻刀' },
    { before: 'Rainbow Needle', after: '虹の裁縫針' },
    { before: 'Rainbow Spatula', after: '虹のヘラ' },
    { before: 'Rainbow Pot', after: '虹のポット' },
    { before: 'Rainbow Alembic', after: '虹の蒸留器' },
    { before: 'Rainbow Enhancer', after: '虹の強化器' },
    { before: 'Holy Brush', after: '聖なるブラシ' },
    { before: 'Holy Shears', after: '聖なるハサミ' },
    { before: 'Holy Hatchet', after: '聖なる手斧' },
    { before: 'Holy Hammer', after: '聖なるハンマー' },
    { before: 'Holy Chisel', after: '聖なる彫刻刀' },
    { before: 'Holy Needle', after: '聖なる裁縫針' },
    { before: 'Holy Spatula', after: '聖なるヘラ' },
    { before: 'Holy Pot', after: '聖なるポット' },
    { before: 'Holy Alembic', after: '聖なる蒸留器' },
    { before: 'Holy Enhancer', after: '聖なる強化器' },
    { before: 'Celestial Brush', after: '天空のブラシ' },
    { before: 'Celestial Shears', after: '天空のハサミ' },
    { before: 'Celestial Hatchet', after: '天空の手斧' },
    { before: 'Celestial Hammer', after: '天空のハンマー' },
    { before: 'Celestial Chisel', after: '天空の彫刻刀' },
    { before: 'Celestial Needle', after: '天空の裁縫針' },
    { before: 'Celestial Spatula', after: '天空のヘラ' },
    { before: 'Celestial Pot', after: '天空のポット' },
    { before: 'Celestial Alembic', after: '天空の蒸留器' },
    { before: 'Celestial Enhancer', after: '天空の強化器' },
    { before: 'Cheese Sword', after: 'チーズソード' },
    { before: 'Cheese Spear', after: 'チーズスピア' },
    { before: 'Cheese Mace', after: 'チーズメイス' },
    { before: 'Verdant Sword', after: 'ヴァーダントソード' },
    { before: 'Verdant Spear', after: 'ヴァーダントスピア' },
    { before: 'Verdant Mace', after: 'ヴァーダントメイス' },
    { before: 'Azure Sword', after: 'アズールソード' },
    { before: 'Azure Spear', after: 'アズールスピア' },
    { before: 'Azure Mace', after: 'アズールメイス' },
    { before: 'Burble Sword', after: 'バーブルソード' },
    { before: 'Burble Spear', after: 'バーブルスピア' },
    { before: 'Burble Mace', after: 'バーブルメイス' },
    { before: 'Crimson Sword', after: 'クリムゾンソード' },
    { before: 'Crimson Spear', after: 'クリムゾンスピア' },
    { before: 'Crimson Mace', after: 'クリムゾンメイス' },
    { before: 'Rainbow Sword', after: 'レインボーソード' },
    { before: 'Rainbow Spear', after: 'レインボースピア' },
    { before: 'Rainbow Mace', after: 'レインボーメイス' },
    { before: 'Holy Sword', after: 'ホーリーソード' },
    { before: 'Holy Spear', after: 'ホーリースピア' },
    { before: 'Holy Mace', after: 'ホーリーメイス' },
    { before: 'Stalactite Spear', after: '鍾乳石の槍' },
    { before: 'Granite Bludgeon', after: '花崗岩の棍棒' },
    { before: 'Chaotic Flail', after: '混沌のフレイル' },
    { before: 'Furious Spear', after: '激怒の槍' },
    { before: 'Regal Sword', after: 'リーガルソード' },
    { before: 'Cheese Bulwark', after: 'チーズバルワーク' },
    { before: 'Verdant Bulwark', after: 'ヴァーダントバルワーク' },
    { before: 'Azure Bulwark', after: 'アズールバルワーク' },
    { before: 'Burble Bulwark', after: 'バーブルバルワーク' },
    { before: 'Crimson Bulwark', after: 'クリムゾンバルワーク' },
    { before: 'Rainbow Bulwark', after: 'レインボーバルワーク' },
    { before: 'Werewolf Slasher', after: 'ウェアウルフスラッシャー' },
    { before: 'Holy Bulwark', after: 'ホーリーバルワーク' },
    { before: 'Spiked Bulwark', after: 'スパイクドバルワーク' },
    { before: 'Griffin Bulwark', after: 'グリフィンバルワーク' },
    { before: 'Cheese Buckler', after: 'チーズバックラー' },
    { before: 'Snake Fang Dirk', after: '蛇牙の短剣' },
    { before: 'Verdant Buckler', after: 'ヴァーダントバックラー' },
    { before: 'Azure Buckler', after: 'アズールバックラー' },
    { before: 'Burble Buckler', after: 'バーブルバックラー' },
    { before: 'Crimson Buckler', after: 'クリムゾンバックラー' },
    { before: 'Vision Shield', after: 'ヴィジョンシールド' },
    { before: 'Rainbow Buckler', after: 'レインボーバックラー' },
    { before: 'Vampire Fang Dirk', after: '吸血牙の短剣' },
    { before: 'Holy Buckler', after: 'ホーリーバックラー' },
    { before: "Knight's Aegis", after: '騎士の盾' },
    { before: "Knights Aegis", after: '騎士の盾' },
    { before: 'Cheese Boots', after: 'チーズブーツ' },
    { before: 'Verdant Boots', after: 'ヴァーダントブーツ' },
    { before: 'Azure Boots', after: 'アズールブーツ' },
    { before: 'Burble Boots', after: 'バーブルブーツ' },
    { before: 'Crimson Boots', after: 'クリムゾンブーツ' },
    { before: 'Rainbow Boots', after: 'レインボーブーツ' },
    { before: 'Black Bear Shoes', after: 'クロクマの靴' },
    { before: 'Grizzly Bear Shoes', after: 'グリズリーの靴' },
    { before: 'Polar Bear Shoes', after: 'シロクマの靴' },
    { before: 'Holy Boots', after: 'ホーリーブーツ' },
    { before: 'Cheese Gauntlets', after: 'チーズガントレット' },
    { before: 'Verdant Gauntlets', after: 'ヴァーダントガントレット' },
    { before: 'Azure Gauntlets', after: 'アズールガントレット' },
    { before: 'Pincer Gloves', after: 'ペンチグローブ' },
    { before: 'Burble Gauntlets', after: 'バーブルガントレット' },
    { before: 'Crimson Gauntlets', after: 'クリムゾンガントレット' },
    { before: 'Rainbow Gauntlets', after: 'レインボーガントレット' },
    { before: 'Panda Gloves', after: 'パンダグローブ' },
    { before: 'Holy Gauntlets', after: 'ホーリーガントレット' },
    { before: 'Magnetic Gloves', after: 'マグネティックグローブ' },
    { before: 'Dodocamel Gauntlets', after: 'ドードーガントレット' },
    { before: 'Cheese Helmet', after: 'チーズメット' },
    { before: 'Verdant Helmet', after: 'ヴァーダントメット' },
    { before: 'Azure Helmet', after: 'アズールメット' },
    { before: 'Snail Shell Helmet', after: 'スネイルメット' },
    { before: 'Burble Helmet', after: 'バーブルメット' },
    { before: 'Crimson Helmet', after: 'クリムゾンメット' },
    { before: 'Vision Helmet', after: 'ヴィジョンメット' },
    { before: 'Rainbow Helmet', after: 'レインボーメット' },
    { before: 'Holy Helmet', after: 'ホーリーメット' },
    { before: 'Cheese Plate Legs', after: 'チーズプレートレギンス' },
    { before: 'Verdant Plate Legs', after: 'ヴァーダントプレートレギンス' },
    { before: 'Azure Plate Legs', after: 'アズールプレートレギンス' },
    { before: 'Turtle Shell Legs', after: 'タートルプレートレギンス' },
    { before: 'Burble Plate Legs', after: 'バーブルプレートレギンス' },
    { before: 'Crimson Plate Legs', after: 'クリムゾンプレートレギンス' },
    { before: 'Rainbow Plate Legs', after: 'レインボープレートレギンス' },
    { before: 'Holy Plate Legs', after: 'ホーリープレートレギンス' },
    { before: 'Colossus Plate Legs', after: 'コロッサスプレートレギンス' },
    { before: 'Demonic Plate Legs', after: 'デーモニックプレートレギンス' },
    { before: 'Anchorbound Plate Legs', after: 'アンカーバウンドプレートレギンス' },
    { before: 'Maelstrom Plate Legs', after: 'メイルストロムプレートレギンス' },
    { before: 'Cheese Plate Body', after: 'チーズプレートアーマー' },
    { before: 'Verdant Plate Body', after: 'ヴァーダントプレートアーマー' },
    { before: 'Azure Plate Body', after: 'アズールプレートアーマー' },
    { before: 'Turtle Shell Body', after: 'タートルプレートアーマー' },
    { before: 'Burble Plate Body', after: 'バーブルプレートアーマー' },
    { before: 'Crimson Plate Body', after: 'クリムゾンプレートアーマー' },
    { before: 'Rainbow Plate Body', after: 'レインボープレートアーマー' },
    { before: 'Holy Plate Body', after: 'ホーリープレートアーマー' },
    { before: 'Colossus Plate Body', after: 'コロッサスプレートアーマー' },
    { before: 'Demonic Plate Body', after: 'デーモニックプレートアーマー' },
    { before: 'Anchorbound Plate Body', after: 'アンカーバウンドプレートアーマー' },
    { before: 'Maelstrom Plate Body', after: 'メイルストロムプレートアーマー' },

    //製作
    { before: 'Lumber', after: '板材' },
    { before: 'Birch Lumber', after: 'シラカバの板材' },
    { before: 'Cedar Lumber', after: 'スギの板材' },
    { before: 'Purpleheart Lumber', after: 'パープルハートの板材' },
    { before: 'Ginkgo Lumber', after: 'イチョウの板材' },
    { before: 'Redwood Lumber', after: 'セコイアの板材' },
    { before: 'Arcane Lumber', after: 'アーケインの板材' },
    { before: 'Wooden Crossbow', after: '木のクロスボウ' },
    { before: 'Birch Crossbow', after: 'シラカバのクロスボウ' },
    { before: 'Cedar Crossbow', after: 'スギのクロスボウ' },
    { before: 'Purpleheart Crossbow', after: 'パープルハートのクロスボウ' },
    { before: 'Ginkgo Crossbow', after: 'イチョウのクロスボウ' },
    { before: 'Redwood Crossbow', after: 'セコイアのクロスボウ' },
    { before: 'Arcane Crossbow', after: 'アーケインのクロスボウ' },
    { before: 'Soul Hunter Crossbow', after: '魂狩りのクロスボウ' },
    { before: 'Sundering Crossbow', after: '切断のクロスボウ' },
    { before: 'Wooden Bow', after: '木の弓' },
    { before: 'Birch Bow', after: 'シラカバの弓' },
    { before: 'Cedar Bow', after: 'スギの弓' },
    { before: 'Purpleheart Bow', after: 'パープルハートの弓' },
    { before: 'Ginkgo Bow', after: 'イチョウの弓' },
    { before: 'Redwood Bow', after: 'セコイアの弓' },
    { before: 'Arcane Bow', after: 'アーケインの弓' },
    { before: 'Vampiric Bow', after: '吸血鬼の弓' },
    { before: 'Cursed Bow', after: '呪われた弓' },
    { before: 'Wooden Water Staff', after: '木製の杖(水)' },
    { before: 'Wooden Nature Staff', after: '木製の杖(自然)' },
    { before: 'Wooden Fire Staff', after: '木製の杖(火)' },
    { before: 'Birch Water Staff', after: 'シラカバの杖(水)' },
    { before: 'Birch Nature Staff', after: 'シラカバの杖(自然)' },
    { before: 'Birch Fire Staff', after: 'シラカバの杖(火)' },
    { before: 'Cedar Water Staff', after: 'スギの杖(水)' },
    { before: 'Cedar Nature Staff', after: 'スギの杖(自然)' },
    { before: 'Cedar Fire Staff', after: 'スギの杖(火)' },
    { before: 'Purpleheart Water Staff', after: 'パープルハートの杖(水)' },
    { before: 'Purpleheart Nature Staff', after: 'パープルハートの杖(自然)' },
    { before: 'Purpleheart Fire Staff', after: 'パープルハートの杖(火)' },
    { before: 'Ginkgo Water Staff', after: 'イチョウの杖(水)' },
    { before: 'Ginkgo Nature Staff', after: 'イチョウの杖(自然)' },
    { before: 'Ginkgo Fire Staff', after: 'イチョウの杖(火)' },
    { before: 'Redwood Water Staff', after: 'セコイアの杖(水)' },
    { before: 'Redwood Nature Staff', after: 'セコイアの杖(自然)' },
    { before: 'Redwood Fire Staff', after: 'セコイアの杖(火)' },
    { before: 'Arcane Water Staff', after: 'アーケインの杖(水)' },
    { before: 'Arcane Nature Staff', after: 'アーケインの杖(自然)' },
    { before: 'Arcane Fire Staff', after: 'アーケインの杖(火)' },
    { before: 'Frost Staff', after: '凍てつく杖' },
    { before: 'Infernal Battlestaff', after: '地獄の杖' },
    { before: 'Jackalope Staff', after: 'ジャッカロープの杖' },
    { before: 'Rippling Trident', after: 'さざ波のトライデント' },
    { before: 'Blooming Trident', after: '開花のトライデント' },
    { before: 'Blazing Trident', after: '猛火のトライデント' },
    { before: 'Wooden Shield', after: '木の盾' },
    { before: 'Birch Shield', after: 'シラカバの盾' },
    { before: 'Cedar Shield', after: 'スギの盾' },
    { before: 'Purpleheart Shield', after: 'パープルハートの盾' },
    { before: 'Treant Shield', after: 'トレントの盾' },
    { before: 'Ginkgo Shield', after: 'イチョウの盾' },
    { before: 'Redwood Shield', after: 'セコイアの盾' },
    { before: 'Eye Watch', after: '目玉時計' },
    { before: 'Watchful Relic', after: '監視のレリック' },
    { before: 'Arcane Shield', after: 'アーケインの盾' },
    { before: 'Manticore Shield', after: 'マンティコアの盾' },
    { before: "Tome Of Healing", after: '癒やしの魔術書' },
    { before: "Tome Of The Elements", after: '属性の魔術書' },
    { before: "Bishop's Codex", after: '聖者の法典' },
    { before: 'Ring Of Gathering', after: '採集の指輪' },
    { before: 'Ring Of Essence Find', after: 'エッセンス発見の指輪' },
    { before: 'Ring Of Regeneration', after: '自動回復の指輪' },
    { before: 'Ring Of Armor', after: '防護の指輪' },
    { before: 'Ring Of Resistance', after: '抵抗の指輪' },
    { before: 'Ring Of Rare Find', after: 'レア発見の指輪' },
    { before: 'Ring Of Critical Strike', after: 'クリティカルの指輪' },
    { before: "Philosopher's Ring", after: '賢者の指輪' },
    { before: 'Earrings Of Gathering', after: '採集のイヤリング' },
    { before: 'Earrings Of Essence Find', after: 'エッセンス発見のイヤリング' },
    { before: 'Earrings Of Regeneration', after: '自動回復のイヤリング' },
    { before: 'Earrings Of Armor', after: '防護のイヤリング' },
    { before: 'Earrings Of Resistance', after: '抵抗のイヤリング' },
    { before: 'Earrings Of Rare Find', after: 'レア発見のイヤリング' },
    { before: 'Earrings Of Critical Strike', after: 'クリティカルのイヤリング' },
    { before: "Philosopher's Earrings", after: '賢者のイヤリング' },
    { before: 'Necklace Of Efficiency', after: '効率化のネックレス' },
    { before: 'Fighter Necklace', after: '戦士のネックレス' },
    { before: 'Ranger Necklace', after: '狩人のネックレス' },
    { before: 'Wizard Necklace', after: '魔法使いのネックレス' },
    { before: 'Necklace Of Wisdom', after: '知恵のネックレス' },
    { before: 'Necklace Of Speed', after: '速度のネックレス' },
    { before: "Philosopher's Necklace", after: '賢者のネックレス' },
    { before: 'Basic Task Badge', after: 'タスクバッジ(下級)' },
    { before: 'Advanced Task Badge', after: 'タスクバッジ(中級)' },
    { before: 'Expert Task Badge', after: 'タスクバッジ(上級)' },
    { before: 'Crushed Pearl', after: '砕けたパール' },
    { before: 'Crushed Amber', after: '砕けたコハク' },
    { before: 'Crushed Garnet', after: '砕けたガーネット' },
    { before: 'Crushed Jade', after: '砕けたヒスイ' },
    { before: 'Crushed Amethyst', after: '砕けたアメジスト' },
    { before: 'Catalyst Of Coinification', after: '換金の原核' },
    { before: 'Catalyst Of Decomposition', after: '分解の原核' },
    { before: 'Catalyst Of Transmutation', after: '変換の原核' },
    { before: 'Prime Catalyst', after: '起端の原核' },
    { before: 'Crushed Moonstone', after: '砕けた月の石' },
    { before: 'Crushed Sunstone', after: '砕けた太陽の石' },
    { before: 'Mirror Of Protection', after: '守護の鏡' },
    { before: "Crushed Philosopher's Stone", after: '砕けた賢者の石' },
    { before: 'Chimerical Entry Key', after: '奇妙な洞穴の鍵' },
    { before: 'Chimerical Chest Key', after: '奇妙な宝箱の鍵' },
    { before: 'Sinister Entry Key', after: '不吉な入場キー' },
    { before: 'Sinister Chest Key', after: '不吉な宝箱の鍵' },
    { before: 'Enchanted Entry Key', after: '魔法の入場の鍵' },
    { before: 'Enchanted Chest Key', after: '魔法の宝箱の鍵' },
    { before: 'Pirate Entry Key', after: '海賊の入場の鍵' },
    { before: 'Pirate Chest Key', after: '海賊の宝箱の鍵' },

    // 裁縫
    { before: 'Rough Leather', after: '粗い革' },
    { before: 'Cotton Fabric', after: '綿布' },
    { before: 'Reptile Leather', after: '爬虫類の革' },
    { before: 'Linen Fabric', after: 'リネン生地' },
    { before: 'Gobo Leather', after: 'ゴボ革' },
    { before: 'Bamboo Fabric', after: '竹布' },
    { before: 'Beast Leather', after: '獣の革' },
    { before: 'Silk Fabric', after: 'シルク' },
    { before: 'Umbral Leather', after: '影の革' },
    { before: 'Radiant Fabric', after: '輝く布' },
    { before: 'Rough Boots', after: '粗いブーツ' },
    { before: 'Cotton Boots', after: '綿のブーツ' },
    { before: 'Reptile Boots', after: '爬虫類のブーツ' },
    { before: 'Linen Boots', after: 'リネンのブーツ' },
    { before: 'Shoebill Shoes', after: 'ハシビロコウの靴' },
    { before: 'Gobo Boots', after: 'ゴボ靴' },
    { before: 'Bamboo Boots', after: '竹のブーツ' },
    { before: 'Beast Boots', after: '獣のブーツ' },
    { before: 'Silk Boots', after: 'シルクのブーツ' },
    { before: "Collector's Boots", after: 'コレクターのブーツ' },
    { before: "Collectors Boots", after: 'コレクターのブーツ' },
    { before: 'Centaur Boots', after: 'ケンタウロスのブーツ' },
    { before: 'Sorcerer Boots', after: '魔法使いのブーツ' },
    { before: 'Umbral Boots', after: '影のブーツ' },
    { before: 'Radiant Boots', after: '輝くブーツ' },
    { before: 'Rough Bracers', after: '粗い籠手' },
    { before: 'Cotton Gloves', after: '綿の手袋' },
    { before: 'Reptile Bracers', after: '爬虫類の籠手' },
    { before: 'Linen Gloves', after: 'リネンの手袋' },
    { before: 'Gobo Bracers', after: 'ゴボ籠手' },
    { before: 'Bamboo Gloves', after: '竹の手袋' },
    { before: 'Beast Bracers', after: '獣の籠手' },
    { before: 'Silk Gloves', after: 'シルクの手袋' },
    { before: 'Sighted Bracers', after: '晴眼者の籠手' },
    { before: 'Marksman Bracers', after: '狙撃手の籠手' },
    { before: 'Umbral Bracers', after: '影の籠手' },
    { before: 'Radiant Gloves', after: '輝く手袋' },
    { before: 'Enchanted Gloves', after: '魔法の手袋' },
    { before: 'Chrono Gloves', after: '時の手袋' },
    { before: 'Rough Hood', after: '粗いフード' },
    { before: 'Cotton Hat', after: '綿の帽子' },
    { before: 'Reptile Hood', after: '爬虫類のフード' },
    { before: 'Linen Hat', after: 'リネンの帽子' },
    { before: 'Gobo Hood', after: 'ゴボ頭巾' },
    { before: 'Bamboo Hat', after: '竹の帽子' },
    { before: 'Beast Hood', after: '獣のフード' },
    { before: 'Silk Hat', after: 'シルクの帽子' },
    { before: 'Red Culinary Hat', after: '赤い料理帽' },
    { before: 'Fluffy Red Hat', after: 'ふわふわの赤い帽子' },
    { before: 'Corsair Helmet', after: 'コルセアの兜' },
    { before: 'Umbral Hood', after: '影のフード' },
    { before: 'Radiant Hat', after: '輝く帽子' },
    { before: 'Acrobatic Hood', after: 'アクロバティックフード' },
    { before: "Magician's Hat", after: 'マジシャンの帽子' },
    { before: 'Rough Chaps', after: '粗い革ズボン' },
    { before: 'Cotton Robe Bottoms', after: '綿のローブ(下)' },
    { before: 'Reptile Chaps', after: '爬虫類の革ズボン' },
    { before: 'Linen Robe Bottoms', after: 'リネンのローブ(下)' },
    { before: 'Gobo Chaps', after: 'ゴボ革ズボン' },
    { before: 'Bamboo Robe Bottoms', after: '竹のローブ(下)' },
    { before: 'Marine Chaps', after: '海洋の革ズボン' },
    { before: 'Icy Robe Bottoms', after: '氷のローブ(下)' },
    { before: 'Flaming Robe Bottoms', after: '炎のローブ(下)' },
    { before: 'Beast Chaps', after: '獣の革ズボン' },
    { before: 'Silk Robe Bottoms', after: 'シルクのローブ(下)' },
    { before: 'Luna Robe Bottoms', after: '月のローブ(下)' },
    { before: 'Umbral Chaps', after: '影の革ズボン' },
    { before: 'Radiant Robe Bottoms', after: '輝くローブ(下)' },
    { before: 'Revenant Chaps', after: '亡霊の革ズボン' },
    { before: 'Griffin Chaps', after: 'グリフィン皮のズボン' },
    { before: 'Kraken Chaps', after: 'クラーケン皮のズボン' },
    { before: "Dairyhand's Bottoms", after: '酪農家の下装' },
    { before: "Forager's Bottoms", after: '採集者の下装' },
    { before: "Lumberjack's Bottoms", after: '木こりの下装' },
    { before: "Cheesemaker's Bottoms", after: 'チーズ職人の下装' },
    { before: "Crafter's Bottoms", after: 'クラフターの下装' },
    { before: "Tailor's Bottoms", after: '裁縫職人の下装' },
    { before: "Chef's Bottoms", after: 'シェフの下装' },
    { before: "Brewer's Bottoms", after: '醸造職人の下装' },
    { before: "Alchemist's Bottoms", after: '錬金術師の下装' },
    { before: "Enhancer's Bottoms", after: '強化達人の下装' },
    { before: 'Royal Water Robe Bottoms', after: 'ロイヤルウォーターローブ(下)' },
    { before: 'Royal Water Robe Bottoms (From Nature)', after: 'ロイヤルウォーターローブ(下･自然)' },
    { before: 'Royal Water Robe Bottoms (From Fire)', after: 'ロイヤルウォーターローブ(下･火)' },
    { before: 'Royal Nature Robe Bottoms', after: 'ロイヤルネイチャーローブ(下)' },
    { before: 'Royal Nature Robe Bottoms (From Water)', after: 'ロイヤルネイチャーローブ(下･水)' },
    { before: 'Royal Nature Robe Bottoms (From Fire)', after: 'ロイヤルネイチャーローブ(下･火)' },
    { before: 'Royal Fire Robe Bottoms', after: 'ロイヤルファイヤーローブ(下)' },
    { before: 'Royal Fire Robe Bottoms (From Water)', after: 'ロイヤルファイヤーローブ(下･水)' },
    { before: 'Royal Fire Robe Bottoms (From Nature)', after: 'ロイヤルファイヤーローブ(下･自然)' },
    { before: 'Rough Tunic', after: '粗いチュニック' },
    { before: 'Cotton Robe Top', after: '綿のローブ(上)' },
    { before: 'Reptile Tunic', after: '爬虫類のチュニック' },
    { before: 'Linen Robe Top', after: 'リネンのローブ(上)' },
    { before: 'Gobo Tunic', after: 'ゴボ上着' },
    { before: 'Bamboo Robe Top', after: '竹のローブ(上)' },
    { before: 'Marine Tunic', after: '海洋チュニック' },
    { before: 'Icy Robe Top', after: '氷のローブ(上)' },
    { before: 'Flaming Robe Top', after: '炎のローブ(上)' },
    { before: 'Beast Tunic', after: '獣のチュニック' },
    { before: 'Silk Robe Top', after: 'シルクのローブ(上)' },
    { before: 'Luna Robe Top', after: '月のローブ(上)' },
    { before: 'Umbral Tunic', after: '影のチュニック' },
    { before: 'Radiant Robe Top', after: '輝くローブ(上)' },
    { before: "Dairyhand's Top", after: '酪農家の上装' },
    { before: "Forager's Top", after: '採集者の上装' },
    { before: "Lumberjack's Top", after: '木こりの上装' },
    { before: "Cheesemaker's Top", after: 'チーズ職人の上装' },
    { before: "Crafter's Top", after: 'クラフターの上装' },
    { before: "Tailor's Top", after: '裁縫職人の上装' },
    { before: "Chef's Top", after: 'シェフの上装' },
    { before: "Brewer's Top", after: '醸造職人の上装' },
    { before: "Alchemist's Top", after: '錬金術師の上装' },
    { before: "Enhancer's Top", after: '強化達人の上装' },
    { before: 'Revenant Tunic', after: '亡霊のチュニック' },
    { before: 'Griffin Tunic', after: 'グリフィンのチュニック' },
    { before: 'Kraken Tunic', after: 'クラーケンチュニック' },
    { before: 'Royal Water Robe Top', after: 'ロイヤルウォーターローブ(上)' },
    { before: 'Royal Water Robe Top (From Nature)', after: 'ロイヤルウォーターローブ(上･自然)' },
    { before: 'Royal Water Robe Top (From Fire)', after: 'ロイヤルウォーターローブ(上･火)' },
    { before: 'Royal Nature Robe Top', after: 'ロイヤルネイチャーローブ(上)' },
    { before: 'Royal Nature Robe Top (From Water)', after: 'ロイヤルネイチャーローブ(上･水)' },
    { before: 'Royal Nature Robe Top (From Fire)', after: 'ロイヤルネイチャーローブ(上･火)' },
    { before: 'Royal Fire Robe Top', after: 'ロイヤルファイヤーローブ(上)' },
    { before: 'Royal Fire Robe Top (From Water)', after: 'ロイヤルファイヤーローブ(上･水)' },
    { before: 'Royal Fire Robe Top (From Nature)', after: 'ロイヤルファイヤーローブ(上･自然)' },
    { before: 'Small Pouch', after: '小さなポーチ' },
    { before: 'Medium Pouch', after: '中くらいのポーチ' },
    { before: 'Large Pouch', after: '大きなポーチ' },
    { before: 'Giant Pouch', after: '巨大なポーチ' },
    { before: 'Gluttonous Pouch', after: '豪食のポーチ' },
    { before: 'Guzzling Pouch', after: '豪飲のポーチ' },

    // 料理
    // ドーナツ
    { before: 'Donut', after: 'ドーナツ' },
    { before: 'Blueberry Donut', after: 'ブルーベリードーナツ' },
    { before: 'Blackberry Donut', after: 'ブラックベリードーナツ' },
    { before: 'Strawberry Donut', after: 'ストロベリードーナツ' },
    { before: 'Mooberry Donut', after: 'モーベリードーナツ' },
    { before: 'Marsberry Donut', after: 'マーズベリードナーツ' },
    { before: 'Spaceberry Donut', after: 'スペースベリードーナツ' },

    // ケーキ
    { before: 'Cupcake', after: 'カップケーキ' },
    { before: 'Blueberry Cake', after: 'ブルーベリーケーキ' },
    { before: 'Blackberry Cake', after: 'ブラックベリーケーキ' },
    { before: 'Strawberry Cake', after: 'ストロベリーケーキ' },
    { before: 'Mooberry Cake', after: 'モーベリーケーキ' },
    { before: 'Marsberry Cake', after: 'マーズベリーケーキ' },
    { before: 'Spaceberry Cake', after: 'スペースベリーケーキ' },

    // グミ
    { before: 'Gummy', after: 'グミ' },
    { before: 'Apple Gummy', after: 'アップルグミ' },
    { before: 'Orange Gummy', after: 'オレンジグミ' },
    { before: 'Plum Gummy', after: 'プラムグミ' },
    { before: 'Peach Gummy', after: 'ピーチグミ' },
    { before: 'Dragon Fruit Gummy', after: 'ドラゴンフルーツグミ' },
    { before: 'Star Fruit Gummy', after: 'スターフルーツグミ' },

    // ヨーグルト
    { before: 'Yogurt', after: 'ヨーグルト' },
    { before: 'Apple Yogurt', after: 'アップルヨーグルト' },
    { before: 'Orange Yogurt', after: 'オレンジヨーグルト' },
    { before: 'Plum Yogurt', after: 'プラムヨーグルト' },
    { before: 'Peach Yogurt', after: 'ピーチヨーグルト' },
    { before: 'Dragon Fruit Yogurt', after: 'ドラゴンフルーツヨーグルト' },
    { before: 'Star Fruit Yogurt', after: 'スターフルーツヨーグルト' },

    // 醸造
    // 紅茶
    { before: 'Milking Tea', after: '乳しぼりの紅茶' },
    { before: 'Foraging Tea', after: '採集の紅茶' },
    { before: 'Gathering Tea', after: '収集の紅茶' },
    { before: 'Woodcutting Tea', after: '木こりの紅茶' },
    { before: 'Cooking Tea', after: '料理の紅茶' },
    { before: 'Brewing Tea', after: '醸造の紅茶' },
    { before: 'Gourmet Tea', after: 'グルメの紅茶' },
    { before: 'Alchemy Tea', after: '錬金術の紅茶' },
    { before: 'Enhancing Tea', after: '強化の紅茶' },
    { before: 'Cheesesmithing Tea', after: 'チーズ鍛冶の紅茶' },
    { before: 'Crafting Tea', after: '製作の紅茶' },
    { before: 'Wisdom Tea', after: '知恵の紅茶' },
    { before: 'Tailoring Tea', after: '裁縫の紅茶' },
    { before: 'Super Milking Tea', after: '乳しぼりの高級紅茶' },
    { before: 'Super Foraging Tea', after: '採集の高級紅茶' },
    { before: 'Processing Tea', after: '処理の紅茶' },
    { before: 'Super Woodcutting Tea', after: '木こりの高級紅茶' },
    { before: 'Super Cooking Tea', after: '料理の高級紅茶' },
    { before: 'Super Brewing Tea', after: '醸造の高級紅茶' },
    { before: 'Ultra Milking Tea', after: '乳しぼりの極上紅茶' },
    { before: 'Efficiency Tea', after: '効率の紅茶' },
    { before: 'Super Alchemy Tea', after: '錬金術の高級紅茶' },
    { before: 'Super Enhancing Tea', after: '強化の高級紅茶' },
    { before: 'Ultra Foraging Tea', after: '採集の極上紅茶' },
    { before: 'Super Cheesesmithing Tea', after: 'チーズ鍛冶の高級紅茶' },
    { before: 'Ultra Woodcutting Tea', after: '木こりの極上紅茶' },
    { before: 'Artisan Tea', after: '職人の紅茶' },
    { before: 'Super Crafting Tea', after: '製作の高級紅茶' },
    { before: 'Ultra Cooking Tea', after: '料理の極上紅茶' },
    { before: 'Catalytic Tea', after: '活性の紅茶' },
    { before: 'Super Tailoring Tea', after: '裁縫の高級紅茶' },
    { before: 'Ultra Brewing Tea', after: '醸造の極上紅茶' },
    { before: 'Blessed Tea', after: '祝福の紅茶' },
    { before: 'Ultra Alchemy Tea', after: '錬金術の極上紅茶' },
    { before: 'Ultra Enhancing Tea', after: '強化の極上紅茶' },
    { before: 'Ultra Cheesesmithing Tea', after: 'チーズ鍛冶の極上紅茶' },
    { before: 'Ultra Crafting Tea', after: '製作の極上紅茶' },
    { before: 'Ultra Tailoring Tea', after: '裁縫の極上紅茶' },

    // コーヒー
    { before: 'Stamina Coffee', after: '体力のコーヒー' },
    { before: 'Intelligence Coffee', after: '知力のコーヒー' },
    { before: 'Defense Coffee', after: '防御のコーヒー' },
    { before: 'Attack Coffee', after: '攻撃力のコーヒー' },
    { before: 'Power Coffee', after: '腕力のコーヒー' },
    { before: 'Ranged Coffee', after: '遠距離攻撃のコーヒー' },
    { before: 'Wisdom Coffee', after: '知恵のコーヒー' },
    { before: 'Magic Coffee', after: '魔法のコーヒー' },
    { before: 'Super Stamina Coffee', after: '体力の高級コーヒー' },
    { before: 'Super Intelligence Coffee', after: '知力の高級コーヒー' },
    { before: 'Lucky Coffee', after: '幸運のコーヒー' },
    { before: 'Super Defense Coffee', after: '防御の高級コーヒー' },
    { before: 'Super Attack Coffee', after: '攻撃力の高級コーヒー' },
    { before: 'Ultra Stamina Coffee', after: '体力の極上コーヒー' },
    { before: 'Swiftness Coffee', after: '素早さのコーヒー' },
    { before: 'Ultra Intelligence Coffee', after: '知力の極上コーヒー' },
    { before: 'Channeling Coffee', after: 'アビリティ加速のコーヒー' },
    { before: 'Super Power Coffee', after: '腕力の高級コーヒー' },
    { before: 'Super Ranged Coffee', after: '遠距離攻撃の高級コーヒー' },
    { before: 'Ultra Defense Coffee', after: '防御の極上コーヒー' },
    { before: 'Critical Coffee', after: 'クリティカルのコーヒー' },
    { before: 'Super Magic Coffee', after: '魔法の高級コーヒー' },
    { before: 'Ultra Attack Coffee', after: '攻撃力の極上コーヒー' },
    { before: 'Ultra Power Coffee', after: '腕力の極上コーヒー' },
    { before: 'Ultra Ranged Coffee', after: '遠距離攻撃の極上コーヒー' },
    { before: 'Ultra Magic Coffee', after: '魔法の極上コーヒー' }
  ],

  'Enemy': [
    { before: 'Fly', after: 'ハエ' },
    { before: 'Jerry', after: 'ジェリー' },
    { before: 'Skunk', after: 'スカンク' },
    { before: 'Porcupine', after: 'ヤマアラシ' },
    { before: 'Slimy', after: 'スライミー' },

    // 沼地の惑星
    { before: 'Frogger', after: 'フロッガー' },
    { before: 'Thnake', after: 'スネーク' },
    { before: 'Swampy', after: 'スワンピー' },
    { before: 'Sherlock', after: 'シャーロック' },
    { before: 'Giant Shoebill', after: 'ジャイアントハシビロコウ' },

    // 水の惑星
    { before: 'Gary', after: 'ゲイリー' },
    { before: 'I Pinch', after: 'ピンチ' },
    { before: 'Aquahorse', after: 'アクアホース' },
    { before: 'Nom Nom', after: 'ノムノム' },
    { before: 'Turuto', after: 'トゥルト' },
    { before: 'Marine Huntress', after: '海の捕食者' },

    // ジャングルの惑星
    { before: 'Jungle Sprite', after: 'ジャングルスプライト' },
    { before: 'Myconid', after: 'マイコミド' },
    { before: 'Treant', after: 'トレント' },
    { before: 'Centaur Archer', after: 'ケンタウロスアーチャー' },
    { before: 'Luna Empress', after: 'ルナエンプレス' },

    // ゴボ惑星
    { before: 'Stabby', after: 'スタビー' },
    { before: 'Slashy', after: 'スラッシー' },
    { before: 'Smashy', after: 'スマッシー' },
    { before: 'Shooty', after: 'シューティ' },
    { before: 'Boomy', after: 'ブーミィ' },
    { before: 'Gobo Chieftain', after: 'ゴボ隊長' },

    // 眼の惑星
    { before: 'Eye', after: 'アイ' },
    { before: 'Eyes', after: 'アイズ' },
    { before: 'Veyes', after: 'ヴァイズ' },
    { before: 'The Watcher', after: 'ザ・ウォッチャー' },

    // 魔法使いの塔
    { before: 'Novice Sorcerer', after: '見習い魔法使い' },
    { before: 'Ice Sorcerer', after: '氷の魔法使い' },
    { before: 'Flame Sorcerer', after: '炎の魔法使い' },
    { before: 'Elementalist', after: 'エレメンタリスト' },
    { before: 'Chronofrost Sorcerer', after: '時と氷結の魔導士' },

    // ベアーウィズ
    { before: 'Gummy Bear', after: 'グミベアー' },
    { before: 'Panda', after: 'パンダ' },
    { before: 'Black Bear', after: 'クロクマ' },
    { before: 'Grizzly Bear', after: 'グリズリー' },
    { before: 'Polar Bear', after: 'シロクマ' },
    { before: 'Red Panda', after: 'レッサーパンダ' },

    // ゴーレムの洞窟
    { before: 'Magnetic Golem', after: 'マグネティックゴーレム' },
    { before: 'Stalactite Golem', after: '鍾乳石のゴーレム' },
    { before: 'Granite Golem', after: '花崗岩のゴーレム' },
    { before: 'Crystal Colossus', after: 'クリスタルの巨像' },

    // 黄昏の園
    { before: 'Zombie', after: 'ゾンビ' },
    { before: 'Vampire', after: 'ヴァンパイア' },
    { before: 'Werewolf', after: 'ウェアウルフ' },
    { before: 'Dusk Revenant', after: '夕闇の幽鬼' },

    // 地獄の大穴
    { before: 'Abyssal Imp', after: '地獄のインプ' },
    { before: 'Soul Hunter', after: 'ソウルハンター' },
    { before: 'Infernal Warlock', after: '業火の魔術師' },
    { before: 'Demonic Overlord', after: '地獄の支配者' },

    // 奇妙な洞穴
    { before: 'Butterjerry', after: 'バタージェリー' },
    { before: 'Jackalope', after: 'ジャッカロープ' },
    { before: 'Dodocamel', after: 'ドードー' },
    { before: 'Manticore', after: 'マンティコア' },
    { before: 'Griffin', after: 'グリフィン' },

    // 不吉なサーカス
    { before: 'Rabid Rabbit', after: 'ラビッドラビット' },
    { before: 'Zombie Bear', after: 'ゾンビベアー' },
    { before: 'Acrobat', after: '曲芸師' },
    { before: 'Juggler', after: 'ジャグラー' },
    { before: 'Magician', after: 'マジシャン' },
    { before: 'Deranged Jester', after: '狂乱の道化師' },

    // 魔法要塞
    { before: 'Enchanted Pawn', after: '魔法のポーン' },
    { before: 'Enchanted Knight', after: '魔法のナイト' },
    { before: 'Enchanted Bishop', after: '魔法のビショップ' },
    { before: 'Enchanted Rook', after: '魔法のルーク' },
    { before: 'Enchanted Queen', after: '魔法のクイーン' },
    { before: 'Enchanted King', after: '魔法のキング' },

    // 海賊の入り江
    { before: 'Squawker', after: '叫喚鳥' },
    { before: 'Anchor Shark', after: 'アンカーシャーク' },
    { before: 'Brine Marksman', after: '海潮の狙撃手' },
    { before: 'Tidal Conjuror', after: '潮流の魔術師' },
    { before: 'Captain Fishhook', after: 'フィッシュフック船長' },
    { before: 'The Kraken', after: 'ザ・クラーケン' }
  ],

  'UniqueStat': [
    { before: 'Ripple: On ability cast, 18% chance to reduce all ability cooldowns by 2s.', after: 'さざ波: アビリティを使用時、18％の確率で全てのアビリティのクールタイムを2秒減少させる。' },
    { before: 'Bloom: On ability cast, 35% chance to heal lowest HP% ally for 10HP+15% magic damage.', after: '開花: アビリティを使用時、35％の確率で最もHP割合が低い仲間を10HP+15%の魔法ダメージで回復する。' },
    { before: 'Blaze: On ability cast, 25% chance to attack all enemies for 30% magic damage.', after: '猛火: アビリティを使用時、25％の確率で全ての敵を30％の魔法ダメージで攻撃する。' }
  ],

  'Skill': [
    //戦闘エリア
    { before: 'All Skills', after: 'すべてのスキル' },
    { before: 'Milking', after: '乳しぼり' },
    { before: 'Foraging', after: '採集' },
    { before: 'Woodcutting', after: '木こり' },
    { before: 'Cheesesmithing', after: 'チーズ鍛冶' },
    { before: 'Crafting', after: '製作' },
    { before: 'Tailoring', after: '裁縫' },
    { before: 'Cooking', after: '料理' },
    { before: 'Brewing', after: '醸造' },
    { before: 'Alchemy', after: '錬金術' },
    { before: 'Enhancing', after: '強化' },
    { before: 'Combat', after: '戦闘' }
  ],

  'CombatZone': [
    //戦闘エリア
    { before: 'Select Zone', after: '戦闘エリアを選択' },
    { before: 'Smelly Planet', after: 'ねばねばの惑星' },
    { before: 'Swamp Planet', after: '沼地の惑星' },
    { before: 'Aqua Planet', after: '水の惑星' },
    { before: 'Jungle Planet', after: 'ジャングルの惑星' },
    { before: 'Gobo Planet', after: 'ゴボ惑星' },
    { before: 'Planet Of The Eyes', after: '眼の惑星' },
    { before: "Sorcerer's Tower", after: '魔法使いの塔' },
    { before: 'Bear With It', after: 'ベアーウィズ' },
    { before: 'Golem Cave', after: 'ゴーレムの洞窟' },
    { before: 'Twilight Zone', after: '黄昏の園' },
    { before: 'Infernal Abyss', after: '地獄の大穴' },
    { before: 'Chimerical Den', after: '奇妙な洞穴' },
    { before: 'Sinister Circus', after: '不吉なサーカス' },
    { before: 'Enchanted Fortress', after: '魔法要塞' },
    { before: 'Pirate Cove', after: '海賊の入り江' },
    { before: 'Dungeons', after: 'ダンジョン' },
    { before: 'Elite', after: 'エリート' },
  ],

  'CombatTrigger': [
    //戦闘エリア
    { before: 'Combat Triggers', after: '使用条件設定' },
    { before: 'Activate when', after: "発動条件" },
    { before: 'Select Target Type', after: "対象のタイプを選択" },
    { before: 'Select Condition', after: "状態を選択" },
    { before: 'Select', after: "選択" },
    
    { before: 'My', after: "自身の" },
    { before: "Target Enemy's", after: "対象の敵の" },
    { before: "Enemies' Total", after: "敵の合計" },
    { before: "Allies' Total", after: "味方の合計" },
    
    { before: "Missing Hp", after: "HP減少値" },
    { before: "Current Hp", after: "現在のHP" },
    { before: "Missing Mp", after: "MP減少値" },
    { before: "Current Mp", after: "現在のMP" },
    
    { before: 'Max HP', after: "最大HP" },
    { before: 'HP Regen', after: "HP自然回復" },
    { before: 'Max MP', after: "最大MP" },
    { before: 'MP Regen', after: "MP自然回復" },
    { before: 'Rate', after: "率" },
    { before: 'Damage', after: "ダメージ" },
    { before: 'Armor', after: "防御力" },
    { before: 'Water Resistance', after: "水耐性" },
    { before: 'Nature Resistance', after: "自然体制" },
    { before: 'Fire Resistance', after: "火耐性" },
    { before: 'Attack Speed', after: "攻撃速度" },
    { before: 'Cast Speed', after: "詠唱速度" },
    { before: 'Tenacity', after: "状態異常無視率" },
    { before: 'Physical Amplify', after: "物理ダメージ増幅確率" },
    { before: 'Water Amplify', after: "水属ダメージ増幅確率" },
    { before: 'Nature Amplify', after: "自然属性ダメージ増幅確率" },
    { before: 'Fire Amplify', after: "火属性ダメージ増幅確率" },
    { before: 'Healing Amplify', after: "回復増幅確率" },
    { before: 'Debuff', after: "デバフ" },
    { before: 'Accuracy', after: "命中" },
    { before: 'Evasion', after: "回避" },
    { before: 'Weaken', after: "弱体化" },
    { before: 'Fury', after: "激怒" },
    { before: 'Curse', after: "呪い" },
    { before: 'Blind Status', after: "盲目状態" },
    { before: 'Silence Status', after: "沈黙状態" },
    { before: 'Stun Status', after: "スタン状態" },
    
    { before: "Is Active", after: "が発動中", escapeSpecialChars: true },
    { before: "Is Inactive", after: "が発動中でない", escapeSpecialChars: true },
    
    { before: "Lowest HP %", after: "最低HP％", escapeSpecialChars: true },
    { before: "# of Active Units", after: "生存中の敵の数", escapeSpecialChars: true },
    { before: "# of Dead Units", after: "死亡した敵の数", escapeSpecialChars: true },
  ],

  'BattleInfo': [
    //戦闘エリア
    { before: 'Combat Duration', after: '戦闘時間' },
    { before: 'Battles', after: '戦闘数' },
    { before: 'Deaths', after: '死亡回数' },
    { before: 'Items looted', after: '獲得アイテム' },
    { before: 'Experience gained', after: '獲得経験値' }
  ],

  'StatInfo': [
    // CombatStats
    { before: 'Combat Stats', after: '戦闘ステータス' },
    { before: 'Combat Level', after: '戦闘レベル' },
    { before: 'Combat Style', after: '戦闘スタイル' },

    { before: 'Damage Type', after: 'ダメージ種別' },
    { before: 'Stab', after: '刺突' },
    { before: 'Slash', after: '斬撃' },
    { before: 'Smash', after: '殴打' },
    { before: 'Physical', after: '物理' },
    { before: 'Ranged', after: '遠距離' },
    { before: 'Magic', after: '魔法' },
    { before: 'Water', after: '水' },
    { before: 'Fire', after: '火' },
    { before: 'Nature', after: '自然' },

    // 斬撃
    { before: 'Slash Damage', after: '斬撃ダメージ' },
    { before: 'Slash Accuracy', after: '斬撃命中力' },
    { before: 'Slash Evasion', after: '斬撃回避力' },

    // 殴打
    { before: 'Smash Damage', after: '殴打ダメージ' },
    { before: 'Smash Accuracy', after: '殴打命中力' },
    { before: 'Smash Evasion', after: '殴打回避力' },

    // 刺突
    { before: 'Stab Damage', after: '刺突ダメージ' },
    { before: 'Stab Accuracy', after: '刺突命中力' },
    { before: 'Stab Evasion', after: '刺突回避力' },

    // 遠距離攻撃
    { before: 'Ranged Damage', after: '遠距離攻撃ダメージ' },
    { before: 'Ranged Accuracy', after: '遠距離攻撃命中力' },
    { before: 'Ranged Evasion', after: '遠距離攻撃回避力' },

    //魔法
    { before: 'Magic Damage', after: '魔法ダメージ' },
    { before: 'Magic Accuracy', after: '魔法命中力' },
    { before: 'Magic Evasion', after: '魔法回避力' },
    { before: 'Fire Resistance', after: '火耐性' },
    { before: 'Water Resistance', after: '水耐性' },
    { before: 'Nature Resistance', after: '自然耐性' },
    { before: 'Fire Amplify', after: '火強化' },
    { before: 'Water Amplify', after: '水強化' },
    { before: 'Nature Amplify', after: '自然強化' },
    { before: 'Healing Amplify', after: '回復強化' },
    { before: 'Fire Penetration', after: '火貫通' },
    { before: 'Water Penetration', after: '水貫通' },
    { before: 'Nature Penetration', after: '自然貫通' },
    { before: 'Cast Speed', after: '詠唱速度' },

    { before: 'Physical Thorns', after: '棘(物理)' },
    { before: 'Elemental Thorns', after: '棘(属性)' },
    { before: 'Armor', after: '防御力' },
    { before: 'Armor Penetration', after: '防御貫通率' },
    { before: 'Auto Attack Damage', after: '通常攻撃ダメージ' },
    { before: 'Attack Interval', after: '攻撃間隔' },
    { before: 'Task Damage', after: '戦闘ダメージ(タスク中)' },
    { before: 'Max Hitpoints', after: '最大HP' },
    { before: 'Max Manapoints', after: '最大MP' },
    { before: 'Tenacity', after: '状態異常耐無視率' },
    { before: 'Threat', after: '狙われやすさ' },
    { before: 'HP Regen', after: 'HP自然回復' },
    { before: 'MP Regen', after: 'MP自然回復' },
    { before: 'Life Steal', after: 'HP吸収' },
    { before: 'Mana Leech', after: 'MP吸収' },
    { before: 'Attack Speed', after: '攻撃速度' },
    { before: 'Critical Rate', after: 'クリティカル率' },
    { before: 'Critical Damage', after: 'クリティカルダメージ' },
    { before: 'Drops', after: 'ドロップアイテム' },
    { before: 'Rare Drops', after: 'レアドロップアイテム' },
    { before: 'Combat Drop Rate', after: '戦闘ドロップ率' },
    { before: 'Combat Drop Quantity', after: '戦闘ドロップ量' },
    { before: 'Combat Rare Find', after: '戦闘レア発見率' },
    { before: 'Combat Experience', after: '戦闘経験値' },

    // Non-CombatStats
    { before: 'Non-combat Stats', after: '非戦闘ステータス' },

    { before: 'Milking Speed', after: '乳しぼり速度' },
    { before: 'Foraging Speed', after: '採集速度' },
    { before: 'Woodcutting Speed', after: '木こり速度' },
    { before: 'Cheesesmithing Speed', after: 'チーズ鍛冶速度' },
    { before: 'Crafting Speed', after: '製作速度' },
    { before: 'Tailoring Speed', after: '裁縫速度' },
    { before: 'Cooking Speed', after: '料理速度' },
    { before: 'Brewing Speed', after: '醸造速度' },
    { before: 'Alchemy Speed', after: '錬金術速度' },
    { before: 'Enhancing Speed', after: '強化速度' },

    { before: 'Milking Experience', after: '乳しぼり経験値' },
    { before: 'Foraging Experience', after: '採集経験値' },
    { before: 'Woodcutting Experience', after: '木こり経験値' },
    { before: 'Cheesesmithing Experience', after: 'チーズ鍛冶経験値' },
    { before: 'Crafting Experience', after: '製作経験値' },
    { before: 'Tailoring Experience', after: '裁縫経験値' },
    { before: 'Cooking Experience', after: '料理経験値' },
    { before: 'Brewing Experience', after: '醸造経験値' },
    { before: 'Alchemy Experience', after: '錬金術経験値' },
    { before: 'Enhancing Experience', after: '強化経験値' },

    { before: 'Milking Efficiency', after: '乳しぼりリピート率' },
    { before: 'Foraging Efficiency', after: '採集リピート率' },
    { before: 'Woodcutting Efficiency', after: '木こりリピート率' },
    { before: 'Cheesesmithing Efficiency', after: 'チーズ鍛冶リピート率' },
    { before: 'Crafting Efficiency', after: '製作リピート率' },
    { before: 'Tailoring Efficiency', after: '裁縫リピート率' },
    { before: 'Cooking Efficiency', after: '料理リピート率' },
    { before: 'Brewing Efficiency', after: '醸造リピート率' },
    { before: 'Alchemy Efficiency', after: '錬金術リピート率' },
    { before: 'Enhancing Efficiency', after: '強化リピート率' },

    { before: 'Milking Rare Find', after: '乳しぼりレア発見率' },
    { before: 'Foraging Rare Find', after: '採集レア発見率' },
    { before: 'Woodcutting Rare Find', after: '木こりレア発見率' },
    { before: 'Cheesesmithing Rare Find', after: 'チーズ鍛冶レア発見率' },
    { before: 'Crafting Rare Find', after: '製作レア発見率' },
    { before: 'Tailoring Rare Find', after: '裁縫レア発見率' },
    { before: 'Cooking Rare Find', after: '料理レア発見率' },
    { before: 'Brewing Rare Find', after: '醸造レア発見率' },
    { before: 'Alchemy Rare Find', after: '錬金術レア発見率' },
    { before: 'Enhancing Rare Find', after: '強化レア発見率' },

    { before: 'Task Speed', after: 'アクション速度(タスク中)' },
    { before: 'Enhancing Success', after: '強化成功率' },
    { before: 'Ability Haste', after: 'アビリティクールタイム減少率' },
    { before: 'Food Haste', after: '食べ物クールタイム減少率' },
    { before: 'Drink Concentration', after: '飲み物効果増幅(持続時間/クールタイム)' },
    { before: 'Skilling Essence Find', after: 'スキルエッセンス発見率' },
    { before: 'Food Slots', after: '食べ物スロット' },
    { before: 'Drink Slots', after: '飲み物スロット' },
    { before: 'Gathering Quantity', after: '採集量' },
    { before: 'Skilling Speed', after: 'スキル速度' },
    { before: 'Skilling Efficiency', after: 'スキル効率' },
    { before: 'Skilling Experience', after: 'スキル経験値' },
    { before: 'Skilling Rare Find', after: 'スキルレア発見率' },
    { before: 'Rare Find', after: 'レア発見率' },
    { before: 'All Skills', after: 'すべてのスキル' },
    { before: 'House Buffs', after: 'マイホームバフ' }
  ]
};

// 翻訳のON/OFFフラグ（localStorageで保持）
let translationEnabled = localStorage.getItem('translationEnabled') === 'true';

// 監視対象から除外するクラス名（動的追加のみ除外）
const ignoreClasses = [
  'Header_navLogoAndPlayerCount__2earI',
  'Header_characterInfo__3ixY8',
  'NavigationBar_navigationLinks__1XSSb',
  'TabsComponent_tabsContainer__3BDUp',
  'GamePage_chatPanel__mVaVt',
  'Header_communityBuffs__3x-B2'
];

// 特殊文字をエスケープ
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 通常のテキストを変更する関数（初回は除外判定なし）
function changeText(log = false) {
  if (!translationEnabled) return;

  replacements.forEach(({ className, before, after, exactMatch = true, escapeSpecialChars = false }) => {
    const elements = document.getElementsByClassName(className);
    for (let element of elements) {
      const textContent = element.textContent;

      if (exactMatch) {
        // escapeSpecialChars が true の場合、before をエスケープ
        const compareText = escapeSpecialChars ? escapeRegExp(before) : before;
        const regex = new RegExp(`^${compareText}$`);
        if (regex.test(textContent)) {
          element.textContent = after;
          //if (log) console.log('翻訳適用:', element);
        }
      } else {
        // escapeSpecialChars が true の場合、before をエスケープ
        const pattern = escapeSpecialChars ? escapeRegExp(before) : before;
        const regex = new RegExp(pattern, 'g');
        if (textContent.includes(before)) {
          element.textContent = textContent.replace(regex, after);
          //if (log) console.log('翻訳適用:', element);
        }
      }
    }
  });
}

// テキストノードを再帰的に置換する関数（初回は除外判定なし）
function replaceTextNodes(node, translations, exactMatch, log = false) {
  node.childNodes.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      let originalText = child.nodeValue;
      let newText = originalText;

      translations.sort((a, b) => b.before.length - a.before.length);

      translations.forEach(({ before, after, includePlus = false, escapeSpecialChars = false }) => {
        // escapeSpecialChars が true の場合、before をエスケープ
        let pattern = escapeSpecialChars ? escapeRegExp(before) : (includePlus ? before.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : `\\b${before}\\b`);
        const regex = new RegExp(pattern, 'g');

        if (exactMatch) {
          if (newText === before) {
            newText = after;
          }
        } else {
          if (newText.includes(before)) {
            newText = newText.replace(regex, after);
          }
        }
      });

      if (newText !== originalText) {
        child.nodeValue = newText;
        //if (log) console.log('翻訳適用:', child.parentNode);
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      replaceTextNodes(child, translations, exactMatch, log);
    }
  });
}

// MutationObserver用の除外判定
function shouldIgnore(node) {
  return node.nodeType === Node.ELEMENT_NODE &&
    ignoreClasses.some(cls => node.closest(`.${cls}`));
}

// 翻訳を適用する関数（初回は除外判定なし）
function changeTextFromList(log = false) {
  if (!translationEnabled) return;

  replacements.forEach(({ className, translationKeys = [], exactMatch = true }) => {
    translationKeys.forEach(translationKey => {
      if (translationTable[translationKey]) {
        const elements = document.getElementsByClassName(className);
        const translations = translationTable[translationKey];

        for (let element of elements) {
          replaceTextNodes(element, translations, exactMatch, log);
        }
      }
    });
  });
}

// 初回実行（除外なし）
changeText();
changeTextFromList();

// DOMの変更を監視（除外あり + ログ出力あり）
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList' && mutation.addedNodes.length) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (shouldIgnore(node)) return;

          const shouldTranslate = replacements.some(({ className }) => {
            return node.classList?.contains(className) || node.querySelector(`.${className}`);
          });

          if (shouldTranslate) {
            changeText(true); // ログあり
            changeTextFromList(true); // ログあり
          }
        }
      });
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// タブ切り替え対応（除外なし・ログあり）
document.addEventListener('click', (event) => {
  if (event.target.closest('.TabsComponent_tabsComponent__3PqGp')) {
    changeText(true);
    changeTextFromList(true);
  }
});

// Tキーで翻訳ON/OFF（入力中は除外）
document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 't') {
    const activeElement = document.activeElement;
    const isInputting = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    );

    if (isInputting) return; // 入力中ならスルー

    translationEnabled = !translationEnabled;
    localStorage.setItem('translationEnabled', translationEnabled);
    location.reload();
  }
});

// 翻訳切り替え案内
function addTranslationToggleLabel() {
  const targets = document.getElementsByClassName('Header_info__26fkk');
  for (let target of targets) {
    if (!target.querySelector('.Header_totalLevel__8LY3Q.translation-toggle-label')) {
      const infoDiv = document.createElement('div');
      infoDiv.className = 'Header_totalLevel__8LY3Q translation-toggle-label';
      infoDiv.textContent = '翻訳切り替え：Tキー';
      infoDiv.style.color = 'orange';
      target.appendChild(infoDiv);
    }
  }
}

// ヘッダーが来たら案内追加
const headerObserver = new MutationObserver(() => {
  const targetExists = document.querySelector('.Header_info__26fkk');
  if (targetExists) {
    addTranslationToggleLabel();
    headerObserver.disconnect();
  }
});

headerObserver.observe(document.body, {
  childList: true,
  subtree: true
});