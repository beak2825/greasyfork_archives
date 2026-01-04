// ==UserScript==
// @name         PoC: misskey.io emojis on twitter
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  misskey.io emojis on twitter
// @author       @ozero
// @match        https://twitter.com/*
// @grant        GM_addElement
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461043/PoC%3A%20misskeyio%20emojis%20on%20twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/461043/PoC%3A%20misskeyio%20emojis%20on%20twitter.meta.js
// ==/UserScript==

/*

なんの保証もサポートもしません。
おお我らただのコンセプト実証にマジになるな高校。
動くのを確かめたらすぐ消せ。いいね？

*/

(function() {
  'use strict';

  const emojis = [
    {
      "aliases": [""],
      "name": "ai_acid_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/ai_acid_misskeyio.apng"
    },
    {
      "aliases": [""],
      "name": "ai_embarrassed_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/ai_embarrassed_misskeyio.png"
    },
    {
      "aliases": [""],
      "name": "ai_late_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/ai_late_misskeyio.png"
    },
    {
      "aliases": [""],
      "name": "ainers_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/ainers_misskeyio.apng"
    },
    {
      "aliases": [""],
      "name": "ai_panic_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/ai_panic_misskeyio.apng"
    },
    {
      "aliases": [""],
      "name": "ai_petrified_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/ai_petrified_misskeyio.png"
    },
    {
      "aliases": [""],
      "name": "ai_pointing_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/ai_pointing_misskeyio.png"
    },
    {
      "aliases": [""],
      "name": "ai_psychedelic_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/ai_psychedelic_misskeyio.png"
    },
    {
      "aliases": [""],
      "name": "ai_serious_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/ai_serious_misskeyio.png"
    },
    {
      "aliases": [""],
      "name": "ai_sign_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/ai_sign_misskeyio.png"
    },
    {
      "aliases": [""],
      "name": "ai_smile_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/ai_smile_misskeyio.png"
    },
    {
      "aliases": [""],
      "name": "ai_space_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/ai_space_misskeyio.png"
    },
    {
      "aliases": [""],
      "name": "ai_tired_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/ai_tired_misskeyio.apng"
    },
    {
      "aliases": [""],
      "name": "nouhin_kannryou_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/nouhin_kannryou_misskeyio.png"
    },
    {
      "aliases": [""],
      "name": "nouhin_shippai_misskeyio",
      "category": "00 Misskey.io Original",
      "url": "https://s3.arkjp.net/emoji/nouhin_shippai_misskeyio.png"
    },
    {
      "aliases": ["ai", "aiscript_logo"],
      "name": "aiscript",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/aiscript.png"
    },
    {
      "aliases": [
        "misskeyで有り金全部溶かした村上さん",
        "ありがねぜんぶとかしたむらかみさん",
        "ariganezenbutokasita_murakamisan"
      ],
      "name": "ariganezenbutokashita_murakamisan",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/misskey/7f0e2745-070a-4df0-89fe-4844c1eec583.png"
    },
    {
      "aliases": ["村上さん", "confidential", "blur", "pixelized", "murakamisan"],
      "name": "confidential_murakamisan",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/confidential_murakamisan.png"
    },
    {
      "aliases": ["村上さん", "むらかみさん", "aureoleark", "ark", "aureole", ""],
      "name": "icon_murakamisan",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/icon_murakamisan.png"
    },
    {
      "aliases": [
        "けものむらかみさんあかじです",
        "ケモノ村上さん赤字です",
        "赤字です",
        "akajidesu",
        "kemomimimurakamisan_akajidesu"
      ],
      "name": "kemonomurakamisan_akajidesu",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/misskey/e156da1a-1e85-4d19-a948-b8de3878aa7a.png"
    },
    {
      "aliases": ["misskey"],
      "name": "misskey",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/misskey.png"
    },
    {
      "aliases": ["misskey_v11", "v11"],
      "name": "misskey11",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/misskey11.png"
    },
    {
      "aliases": ["misskey_2017_mar30"],
      "name": "misskey2017",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/misskey2017.png"
    },
    {
      "aliases": ["misskey_title"],
      "name": "misskey2022",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/misskey2022.png"
    },
    {
      "aliases": ["misskey_pre2017_mar30_0643_v0.0.5018"],
      "name": "misskey_pre_v0_0_5018",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/misskey_pre_v0_0_5018.png"
    },
    {
      "aliases": ["misskey_v12.0.0", "misskey_2020_jan31"],
      "name": "misskey_pre_v12",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/misskey_pre_v12.png"
    },
    {
      "aliases": ["kro", "stackoverflow", "500", ""],
      "name": "misskeystackoverflow",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/misskeystackoverflow.gif"
    },
    {
      "aliases": ["misskey_v0.0.5018"],
      "name": "misskey_v0_0_5018",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/misskey_v0_0_5018.png"
    },
    {
      "aliases": ["misskey2020_mar25_1454_v12_26"],
      "name": "misskey_v12_26_01",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/misskey_v12_26_01.png"
    },
    {
      "aliases": ["misskey2020_mar25_2119_v12_26"],
      "name": "misskey_v12_26_02",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/misskey_v12_26_02.png"
    },
    {
      "aliases": ["misskey_v12.26.0"],
      "name": "misskey_v12_26_favicon",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/misskey_v12_26_favicon.png"
    },
    {
      "aliases": ["misskey_v12.27.1"],
      "name": "misskey_v12_27_1",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/misskey_v12_27_1.png"
    },
    {
      "aliases": [
        "レターパックで現金送る村上さん",
        "れたーぱっくでげんきんおくるむらかみさん",
        "letterpack_de_genkin_okuru_murakamisan",
        "murakamisan_letterpack"
      ],
      "name": "murakamisan_send_money",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/misskey/11672508-b84a-4697-bba0-a74632a8dfc0.png"
    },
    {
      "aliases": [
        "村上さんパニック",
        "むらかみさんぱにっく",
        "村上さんショック",
        "むらかみさんしょっく",
        "murakamisan_panic",
        "えええ",
        "はずかしい",
        "せきめん",
        "赤面",
        "恥ずかしい",
        "恥しい"
      ],
      "name": "murakamisan_shock",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/misskey/16bd73b2-5a15-44c5-84fb-90cba740ed33.gif"
    },
    {
      "aliases": [
        "しゅいろ",
        "なでなで",
        "びよーん",
        "nadenade",
        "pat",
        "pet",
        "syuilo",
        "pet_the_wide_syuilo",
        "wide"
      ],
      "name": "petthex_syuilo_9597",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/petthex_syuilo_9597.gif"
    },
    {
      "aliases": ["プリン", "ねこ", "ねこプリン"],
      "name": "pudding_cat",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/pudding_cat.png"
    },
    {
      "aliases": ["プリン", "認証プリン", "ミスキープリン"],
      "name": "pudding_verified_misskey",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/pudding_verified_misskey.png"
    },
    {
      "aliases": [
        "画像の読み込みに失敗しました",
        "がぞうのよみこみにしっぱいしました",
        "failed_to_load_image",
        "ssr",
        "failed",
        "load",
        "image",
        ""
      ],
      "name": "ssr_faildtoloadimage",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/ssr_faildtoloadimage.png"
    },
    {
      "aliases": ["unknown", "emoji"],
      "name": "unknown_emoji",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/unknown_emoji.jpg"
    },
    {
      "aliases": ["misskey_v12"],
      "name": "v12",
      "category": "01 Misskey",
      "url": "https://s3.arkjp.net/emoji/v12.png"
    },
    {
      "aliases": [
        "藍",
        "あい",
        "ai",
        "blink_ai",
        "まばたき",
        "瞬き",
        "おめめぱちぱち",
        "ぱちぱち"
      ],
      "name": "ai_blink",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/ai_blink.apng"
    },
    {
      "aliases": [
        "bonk",
        "藍",
        "あい",
        "おこ",
        "怒った",
        "叩く",
        "たたく",
        "ひっと",
        "ぼんく",
        "だめ",
        "bap",
        ""
      ],
      "name": "ai_bonk",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/ai_bonk.gif"
    },
    {
      "aliases": ["ai"],
      "name": "ai_icon",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/ai_icon.png"
    },
    {
      "aliases": [""],
      "name": "ai_koreyarimashitaka",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/ai_koreyarimashitaka.png"
    },
    {
      "aliases": [
        "ai_eating",
        "ai_mogumogu",
        "もぐもぐ",
        "mogumogu",
        "たべる",
        "食べる",
        "おいしい"
      ],
      "name": "ai_nomming",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/misskey/f6294900-f678-43cc-bc36-3ee5deeca4c2.gif"
    },
    {
      "aliases": ["owo", "ai", "藍", "owo藍", "藍owo", "あい", "おを"],
      "name": "ai_owo",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/ai_owo.png"
    },
    {
      "aliases": [
        "yay_ai",
        "藍",
        "あい",
        "ばんざい",
        "バンザイ",
        "ばんざーい",
        "やった",
        "やったぁ",
        "わぁい",
        "わーい",
        "やったー",
        "やったぁ",
        "うれしい",
        "ハッピー",
        "たのしい",
        "わーいわーい",
        "よろこび",
        "よろこぶ",
        "",
        "happy",
        "yay",
        "ai",
        "praise"
      ],
      "name": "ai_yay",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/ai_yay.apng"
    },
    {
      "aliases": [
        "ai_hyper",
        "ai_yayhyper",
        "ai_trippin",
        "ai_superfastyay",
        "ai_yay_superfast",
        "ai_yay_hyper",
        "藍",
        "あい",
        "やったー",
        ""
      ],
      "name": "ai_yaysuperfast",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/ai_yaysuperfast.apng"
    },
    {
      "aliases": ["ai", "angry", "oko"],
      "name": "angry_ai",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/angry_ai.png"
    },
    {
      "aliases": ["ai", "cry"],
      "name": "crying_ai",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/crying_ai.png"
    },
    {
      "aliases": ["ai", "doya", "kiri", "smirk"],
      "name": "doya_ai",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/doya_ai.png"
    },
    {
      "aliases": [
        "ai_innocent",
        "innocent",
        "halo",
        "ai_halo",
        "halo_ai",
        "藍",
        "天使",
        "藍天使",
        "天使藍",
        "あい",
        "にっこり",
        "ニッコリ",
        "笑顔",
        ""
      ],
      "name": "innocent_ai",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/innocent_ai.png"
    },
    {
      "aliases": [
        "藍",
        "藍owo",
        "藍おを",
        "おをあい",
        "owoai",
        "aiowo",
        "ai_owo"
      ],
      "name": "owo_ai",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/owo_ai.png"
    },
    {
      "aliases": ["ai", "sleep", "oyasumi", "suya"],
      "name": "sleeping_ai",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/sleeping_ai.png"
    },
    {
      "aliases": ["ai", "smile"],
      "name": "smiling_ai",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/smiling_ai.png"
    },
    {
      "aliases": ["ai", "surprise"],
      "name": "surprised_ai",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/surprised_ai.png"
    },
    {
      "aliases": ["ai"],
      "name": "thinking__ai",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/thinking__ai.png"
    },
    {
      "aliases": ["ai", "thinking"],
      "name": "thinking_ai",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/thinking_ai.png"
    },
    {
      "aliases": ["ai", "woozy", "藍", "ウージー", ""],
      "name": "woozy_ai",
      "category": "02 Ai",
      "url": "https://s3.arkjp.net/emoji/woozy_ai.png"
    },
    {
      "aliases": ["4って鳴く犬", "よん"],
      "name": "4ttenakuinu",
      "category": "Animal",
      "url": "https://s3.arkjp.net/emoji/4ttenakuinu.png"
    },
    {
      "aliases": [
        "frozen_bluebird",
        "青い鳥",
        "あおいとり",
        "凍結",
        "frozen",
        "凍結した鳥",
        "凍結した青い鳥",
        "bluebird",
        "twitter_suspended",
        "freeze",
        "とうけつ",
        "touketu",
        "touketsu",
        ""
      ],
      "name": "bluebird_frozen",
      "category": "Animal",
      "url": "https://s3.arkjp.net/emoji/bluebird_frozen.png"
    },
    {
      "aliases": ["かわうそ", "獺"],
      "name": "kawauso",
      "category": "Animal",
      "url": "https://s3.arkjp.net/misskey/webpublic-9b030982-3095-4426-9675-3208457bb79f.png"
    },
    {
      "aliases": [
        "幼体期ねむだる",
        "ようたいきねむだる",
        "baby_nemudaru",
        "young_nemudaru"
      ],
      "name": "youtaiki_nemudaru",
      "category": "Animal",
      "url": "https://s3.arkjp.net/emoji/youtaiki_nemudaru.png"
    },
    {
      "aliases": ["暇", "ひま", "ボアードパロット"],
      "name": "boredparrot",
      "category": "Animal/PartyParrot",
      "url": "https://s3.arkjp.net/emoji/boredparrot.gif"
    },
    {
      "aliases": ["ファストパロット", "パーティパロット", "パロット"],
      "name": "fastparrot",
      "category": "Animal/PartyParrot",
      "url": "https://s3.arkjp.net/emoji/fastparrot.gif"
    },
    {
      "aliases": ["パロット", "パーティパロット"],
      "name": "parrot",
      "category": "Animal/PartyParrot",
      "url": "https://s3.arkjp.net/emoji/parrot.gif"
    },
    {
      "aliases": ["それな", "それなぱろっと", "sorena_parrot", "that", "this"],
      "name": "parrot_sorena",
      "category": "Animal/PartyParrot",
      "url": "https://s3.arkjp.net/emoji/parrot_sorena.png"
    },
    {
      "aliases": [
        "しべ犬",
        "シベ犬",
        "アングリーシベ",
        "angry",
        "upset",
        "mad",
        "screaming",
        "scream",
        "roar",
        "roaring",
        "bark",
        "barking",
        "dog",
        "shibe_dog",
        "dog_shibe",
        "sibe",
        "sibe_dog",
        "angry_shibe",
        "shibe_angry",
        "おこ",
        "怒る",
        "吠える",
        "ほえる"
      ],
      "name": "angry_shibe",
      "category": "Animal/Shibe",
      "url": "https://s3.arkjp.net/emoji/angry_shibe.gif"
    },
    {
      "aliases": [
        "しべ",
        "シベ",
        "シベアングリー",
        "おこ",
        "怒る",
        "おこる",
        "むか",
        "むかっ",
        "アングリー",
        "angry",
        "upset",
        "mad",
        "muka",
        "oko",
        "okoru"
      ],
      "name": "shibeangry",
      "category": "Animal/Shibe",
      "url": "https://s3.arkjp.net/emoji/shibeangry.png"
    },
    {
      "aliases": [
        "しべ",
        "シベ",
        "シベハッピー",
        "にこにこ",
        "にこっ",
        "笑顔",
        "しあわせ",
        "nikoniko",
        "happy",
        "shibehappy",
        "sibe_happy",
        "happy_shibe",
        "ShibeSoHappy"
      ],
      "name": "shibehappy",
      "category": "Animal/Shibe",
      "url": "https://s3.arkjp.net/emoji/shibehappy.png"
    },
    {
      "aliases": [
        "しべ",
        "シベ",
        "シベスマッグ",
        "smug",
        "ドヤ顔",
        "どや顔",
        "どやがお",
        "どやぁ",
        "にやっ",
        "sibe",
        "ShibeSmug",
        "smug_shibe",
        "sibe_smug",
        "shibe_smug",
        "smug_sibe"
      ],
      "name": "shibesmug",
      "category": "Animal/Shibe",
      "url": "https://s3.arkjp.net/emoji/shibesmug.png"
    },
    {
      "aliases": [
        "うんちげぼざうるす",
        "ウンチゲボザウルス",
        "unchi_gebo_saurus"
      ],
      "name": "poop_vomiting_saurus",
      "category": "Animal/ウンチゲボザウルス",
      "url": "https://s3.arkjp.net/emoji/poop_vomiting_saurus.png"
    },
    {
      "aliases": ["ウンチゲボザウルス", "unchigebozaurusu"],
      "name": "poop_vomiting_saurus_animation",
      "category": "Animal/ウンチゲボザウルス",
      "url": "https://s3.arkjp.net/emoji/poop_vomiting_saurus_animation.apng"
    },
    {
      "aliases": [
        "うんちげぼざうるす",
        "ウンチゲボザウルス",
        "unchi_gebo_saurus"
      ],
      "name": "poop_vomiting_saurus_eat",
      "category": "Animal/ウンチゲボザウルス",
      "url": "https://s3.arkjp.net/emoji/poop_vomiting_saurus_eat.png"
    },
    {
      "aliases": [
        "うんちげぼざうるす",
        "ウンチゲボザウルス",
        "unchi_gebo_saurus"
      ],
      "name": "poop_vomiting_saurus_found",
      "category": "Animal/ウンチゲボザウルス",
      "url": "https://s3.arkjp.net/emoji/poop_vomiting_saurus_found.png"
    },
    {
      "aliases": [
        "うんちげぼざうるす",
        "ウンチゲボザウルス",
        "unchi_gebo_saurus"
      ],
      "name": "poop_vomiting_saurus_hungry",
      "category": "Animal/ウンチゲボザウルス",
      "url": "https://s3.arkjp.net/emoji/poop_vomiting_saurus_hungry.png"
    },
    {
      "aliases": [
        "うんちげぼざうるす",
        "ウンチゲボザウルス",
        "unchi_gebo_saurus"
      ],
      "name": "poop_vomiting_saurus_vomiting",
      "category": "Animal/ウンチゲボザウルス",
      "url": "https://s3.arkjp.net/emoji/poop_vomiting_saurus_vomiting.png"
    },
    {
      "aliases": [
        "ウンチゲボザウルス",
        "うんちげぼざうるす",
        "unchigebo_saurus",
        "unchigebo_zaurusu",
        "unchi_gebo_saurus",
        "unchi_gebo_zaurusu",
        "untigebo_saurus",
        "untigebo_zaurusu",
        "unti_gebo_saurus",
        "unti_gebo_zaurusu"
      ],
      "name": "unchi_gebo_saurus",
      "category": "Animal/ウンチゲボザウルス",
      "url": "https://s3.arkjp.net/emoji/unchi_gebo_saurus.png"
    },
    {
      "aliases": [],
      "name": "blebcat",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blebcat.png"
    },
    {
      "aliases": [],
      "name": "blobbroken",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobbroken.png"
    },
    {
      "aliases": ["blob", "かめら", "camera", "カメラ"],
      "name": "blobcamera",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobcamera.png"
    },
    {
      "aliases": [],
      "name": "blob_closed_book",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blob_closed_book.png"
    },
    {
      "aliases": [
        "おふとん",
        "ふとん",
        "futon",
        "huton",
        "布団",
        "お布団",
        "ブロブコージーナップ",
        "ブロブコージィーナップ",
        "お昼寝",
        "おひるね",
        "ひるね",
        "昼寝",
        "ohirune",
        "hirune",
        "nap",
        "cozynap",
        "ナップ"
      ],
      "name": "blobcozynap",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobcozynap.png"
    },
    {
      "aliases": [
        "blob",
        "eating",
        "ehoumaki",
        "食べる",
        "恵方巻き",
        "えほうまき",
        "ehomaki",
        ""
      ],
      "name": "blobeating_ehoumaki",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobeating_ehoumaki.png"
    },
    {
      "aliases": ["blob", "gamer", "ゲーマー", ""],
      "name": "blobgamer",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobgamer.png"
    },
    {
      "aliases": [""],
      "name": "blobglassesdown",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobglassesdown.png"
    },
    {
      "aliases": [""],
      "name": "blobgo",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobgo.png"
    },
    {
      "aliases": [
        "ban",
        "バン",
        "追放",
        "ハンマー",
        "バンハンマー",
        "ブロブハンマー"
      ],
      "name": "blobhammer",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobhammer.png"
    },
    {
      "aliases": [""],
      "name": "blobhighfive",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobhighfive.png"
    },
    {
      "aliases": [
        "イケアシャーク",
        "ikeashark",
        "サメ",
        "イケアのサメ",
        "ブローハイちゃん"
      ],
      "name": "blob_hug_blahaj",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blob_hug_blahaj.png"
    },
    {
      "aliases": [""],
      "name": "blobhyperthink",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobhyperthink.png"
    },
    {
      "aliases": [
        "こたつ",
        "おこた",
        "炬燵",
        "火燵",
        "blobkotatu",
        "kotatu",
        "kotatsu",
        "ブロブこたつ"
      ],
      "name": "blobkotatsu",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobkotatsu.png"
    },
    {
      "aliases": [""],
      "name": "bloblargemouth",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/bloblargemouth.png"
    },
    {
      "aliases": [""],
      "name": "blobmail",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobmail.png"
    },
    {
      "aliases": [
        "nervous",
        "えーっと",
        "えーと",
        "指つん",
        "ゆびつん",
        "yubitun",
        "指つんつん",
        "言い訳",
        "いいわけ",
        "iiwake"
      ],
      "name": "blobnervous2",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobnervous2.png"
    },
    {
      "aliases": ["blob_no", "blob", "no", ""],
      "name": "blobno",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobno.png"
    },
    {
      "aliases": [
        "blobowo",
        "squint",
        "目細め",
        "スキュイント",
        "スクイント",
        "きゃ",
        ""
      ],
      "name": "blobowosquint",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobowosquint.png"
    },
    {
      "aliases": [""],
      "name": "blobshh",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobshh.png"
    },
    {
      "aliases": [""],
      "name": "blobsignya",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobsignya.png"
    },
    {
      "aliases": [""],
      "name": "blobsleepless",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobsleepless.png"
    },
    {
      "aliases": [""],
      "name": "blobsweats",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobsweats.png"
    },
    {
      "aliases": [""],
      "name": "blob_think_smart",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blob_think_smart.png"
    },
    {
      "aliases": ["omotenidero", "表出ろ"],
      "name": "blobthumbsup",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blobthumbsup.png"
    },
    {
      "aliases": [],
      "name": "blob_yum",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/blob_yum.png"
    },
    {
      "aliases": [""],
      "name": "nombread",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/nombread.png"
    },
    {
      "aliases": [""],
      "name": "ohoho_blobs",
      "category": "Blob",
      "url": "https://s3.arkjp.net/emoji/ohoho_blobs.png"
    },
    {
      "aliases": [""],
      "name": "ablobaww",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobaww.apng"
    },
    {
      "aliases": [""],
      "name": "ablobblewobble",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobblewobble.apng"
    },
    {
      "aliases": [
        "コール",
        "泣きコール",
        "応援",
        "加油",
        "call",
        "ouen",
        "crycall",
        "crycheer",
        "crying_call",
        "crying_cheering",
        "cheering_crying",
        "blob",
        "cry"
      ],
      "name": "ablobcall",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobcall.apng"
    },
    {
      "aliases": [""],
      "name": "ablobdj",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobdj.apng"
    },
    {
      "aliases": [],
      "name": "ablobdjslow",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobdjslow.gif"
    },
    {
      "aliases": [],
      "name": "ablobdjveryslow",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobdjveryslow.gif"
    },
    {
      "aliases": [""],
      "name": "ablobdundundun",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobdundundun.gif"
    },
    {
      "aliases": [""],
      "name": "ablobgoodnightreverse",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobgoodnightreverse.gif"
    },
    {
      "aliases": [
        "BAN",
        "aban",
        "バン",
        "追放",
        "ハンマー",
        "バンハンマー",
        "ブロブハンマー"
      ],
      "name": "ablobhammer",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobhammer.apng"
    },
    {
      "aliases": ["blob", "hungry"],
      "name": "ablobhungry",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobhungry.apng"
    },
    {
      "aliases": [""],
      "name": "ablobhype",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobhype.apng"
    },
    {
      "aliases": [],
      "name": "ablobkeyboard",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobkeyboard.apng"
    },
    {
      "aliases": [""],
      "name": "ablobmaracas",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobmaracas.apng"
    },
    {
      "aliases": [""],
      "name": "ablobpeekjohnny",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobpeekjohnny.apng"
    },
    {
      "aliases": [""],
      "name": "ablobsmile",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobsmile.apng"
    },
    {
      "aliases": [""],
      "name": "ablobsmilehappy",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobsmilehappy.gif"
    },
    {
      "aliases": [""],
      "name": "ablob_spinfast",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablob_spinfast.apng"
    },
    {
      "aliases": [""],
      "name": "ablobthinkingzerogravity",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobthinkingzerogravity.gif"
    },
    {
      "aliases": [""],
      "name": "ablobwobroll",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/ablobwobroll.gif"
    },
    {
      "aliases": [""],
      "name": "blob_congaroll_bounce",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_congaroll_bounce.gif"
    },
    {
      "aliases": [""],
      "name": "blob_devil",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_devil.gif"
    },
    {
      "aliases": [""],
      "name": "blob_disappointment",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_disappointment.gif"
    },
    {
      "aliases": [""],
      "name": "blob_flushed",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_flushed.gif"
    },
    {
      "aliases": [""],
      "name": "blob_goggling",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_goggling.gif"
    },
    {
      "aliases": [""],
      "name": "blobhai",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blobhai.gif"
    },
    {
      "aliases": [""],
      "name": "blob_hello",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_hello.gif"
    },
    {
      "aliases": [""],
      "name": "blobhyperbounce",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blobhyperbounce.apng"
    },
    {
      "aliases": [
        "うんうん",
        "肯く",
        "首肯く",
        "頷く",
        "うなづく",
        "うなずく",
        ""
      ],
      "name": "blob_hyper_nod",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_hyper_nod.gif"
    },
    {
      "aliases": ["キーボード"],
      "name": "blob_keybord",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_keybord.gif"
    },
    {
      "aliases": [""],
      "name": "blob_nope",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_nope.gif"
    },
    {
      "aliases": [""],
      "name": "blobooohai",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blobooohai.gif"
    },
    {
      "aliases": [""],
      "name": "blob_present",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_present.gif"
    },
    {
      "aliases": [""],
      "name": "blob_rolling_bound",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_rolling_bound.gif"
    },
    {
      "aliases": [""],
      "name": "blob_sleepy",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_sleepy.gif"
    },
    {
      "aliases": [""],
      "name": "blobsnowball2",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blobsnowball2.gif"
    },
    {
      "aliases": [""],
      "name": "blob_squish",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_squish.gif"
    },
    {
      "aliases": [
        "うんうん",
        "肯く",
        "首肯く",
        "頷く",
        "うなづく",
        "うなずく",
        ""
      ],
      "name": "blob_super_nod",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_super_nod.gif"
    },
    {
      "aliases": [""],
      "name": "blob_surprise_blush",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blob_surprise_blush.gif"
    },
    {
      "aliases": [""],
      "name": "blobtoofast",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/blobtoofast.apng"
    },
    {
      "aliases": [""],
      "name": "burublobhyperthink",
      "category": "Blob/A",
      "url": "https://s3.arkjp.net/emoji/burublobhyperthink.gif"
    },
    {
      "aliases": [],
      "name": "blabcatbea",
      "category": "Blob/Blab",
      "url": "https://s3.arkjp.net/emoji/blabcatbea.png"
    },
    {
      "aliases": [""],
      "name": "blabcatpeek",
      "category": "Blob/Blab",
      "url": "https://s3.arkjp.net/emoji/blabcatpeek.png"
    },
    {
      "aliases": [],
      "name": "blabcatverified",
      "category": "Blob/Blab",
      "url": "https://s3.arkjp.net/emoji/blabcatverified.png"
    },
    {
      "aliases": [],
      "name": "blabcatverifiedfake",
      "category": "Blob/Blab",
      "url": "https://s3.arkjp.net/emoji/blabcatverifiedfake.png"
    },
    {
      "aliases": [],
      "name": "blobcataco",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcataco.png"
    },
    {
      "aliases": [""],
      "name": "blobcatartist",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatartist.png"
    },
    {
      "aliases": [],
      "name": "blobcataww",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcataww.png"
    },
    {
      "aliases": [""],
      "name": "blobcatbigsob",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatbigsob.png"
    },
    {
      "aliases": [""],
      "name": "blobcatboopblush",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatboopblush.png"
    },
    {
      "aliases": [""],
      "name": "blobcatcofesip",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatcofesip.png"
    },
    {
      "aliases": [""],
      "name": "blobcatcomfy",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatcomfy.png"
    },
    {
      "aliases": [
        "blob",
        "cat",
        "confounded",
        "まごまご",
        "まごつく",
        "困惑",
        "ふええ",
        "狼狽"
      ],
      "name": "blobcatconfounded",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatconfounded.png"
    },
    {
      "aliases": [
        "うまそう",
        "美味そう",
        "おいしそう",
        "美味しそう",
        "ほしい",
        "欲しい",
        "よだれ",
        "涎",
        "ジュルール",
        "ドルール",
        "リーチ",
        "手伸ばし",
        "手を伸ばす",
        "てをのばす",
        "yummy",
        "want",
        "tasty",
        ""
      ],
      "name": "blobcatdroolreach",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatdroolreach.png"
    },
    {
      "aliases": [""],
      "name": "blobcatevil",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatevil.png"
    },
    {
      "aliases": [],
      "name": "blobcatflip",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatflip.png"
    },
    {
      "aliases": [],
      "name": "blobcatfluffpout",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatfluffpout.png"
    },
    {
      "aliases": ["ぐえー", ""],
      "name": "blobcat_frustration",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcat_frustration.png"
    },
    {
      "aliases": [],
      "name": "blobcatgooglytrash",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatgooglytrash.png"
    },
    {
      "aliases": [],
      "name": "blobcatmeataww",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatmeataww.png"
    },
    {
      "aliases": [""],
      "name": "blobcatmeltlove",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatmeltlove.png"
    },
    {
      "aliases": [""],
      "name": "blobcatmeltnomblobcatmelt",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatmeltnomblobcatmelt.png"
    },
    {
      "aliases": [""],
      "name": "blobcatmlem",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatmlem.png"
    },
    {
      "aliases": [""],
      "name": "blobcatnomblobdoggo",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatnomblobdoggo.png"
    },
    {
      "aliases": [],
      "name": "blobcatnomwatermelon",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatnomwatermelon.png"
    },
    {
      "aliases": [""],
      "name": "blobcatnoplease",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatnoplease.png"
    },
    {
      "aliases": [
        "><",
        "＞＜",
        "blobcat",
        "notamused",
        "not_amused",
        "ふええ",
        ""
      ],
      "name": "blobcatnotamused",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatnotamused.png"
    },
    {
      "aliases": ["oh"],
      "name": "blobcatoh",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatoh.png"
    },
    {
      "aliases": [""],
      "name": "blobcat_ok_sign",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcat_ok_sign.png"
    },
    {
      "aliases": [""],
      "name": "blobcatpensive",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatpensive.png"
    },
    {
      "aliases": [""],
      "name": "blobcatphoto",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatphoto.png"
    },
    {
      "aliases": [
        "blobcat",
        "blob",
        "photobomb",
        "peeking",
        "覗く",
        "フォトボム",
        "フォトボミング",
        "うつりこむ",
        "写真に映り込む"
      ],
      "name": "blobcatphotobomb",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatphotobomb.png"
    },
    {
      "aliases": [
        "blob",
        "blobcat",
        "blobcatphotobomb",
        "photobomb",
        "frustration",
        "frustrated",
        "blobcatfrustrated_photobomb",
        "blobcatphotobomb_frustrated",
        ""
      ],
      "name": "blobcatphoto_frustration",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatphoto_frustration.png"
    },
    {
      "aliases": [
        "警察",
        "ポリス",
        "ポリスピーク",
        "警察ちら見",
        "ブロブキャットポリスピーク"
      ],
      "name": "blobcatpolicepeek",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatpolicepeek.png"
    },
    {
      "aliases": [""],
      "name": "blobcatreachmelt",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatreachmelt.png"
    },
    {
      "aliases": [""],
      "name": "blobcatshrug",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatshrug.png"
    },
    {
      "aliases": [""],
      "name": "blobcatsign",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatsign.png"
    },
    {
      "aliases": ["blob", "cat", "stop", "止まれ", "やめて", "ねこ", ""],
      "name": "blobcatstop",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatstop.png"
    },
    {
      "aliases": ["tea", "お茶", "おちゃ", "blob", "blobcat", ""],
      "name": "blobcattea",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcattea.png"
    },
    {
      "aliases": [""],
      "name": "blobcatthinking",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatthinking.png"
    },
    {
      "aliases": [""],
      "name": "blobcatuwu",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatuwu.png"
    },
    {
      "aliases": [],
      "name": "blobcatverified",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcatverified.png"
    },
    {
      "aliases": [""],
      "name": "blobcat_woozy",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/blobcat_woozy.png"
    },
    {
      "aliases": [
        "イケアシャーク",
        "ikeashark",
        "サメ",
        "イケアのサメ",
        "ブローハイちゃん",
        "blobcat",
        "hug",
        ""
      ],
      "name": "catblob_hug_blahaj",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/catblob_hug_blahaj.png"
    },
    {
      "aliases": ["catblob", "hug", "udon", "うどん", "ねこ", "どん兵衛"],
      "name": "catblob_hug_udon",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/catblob_hug_udon.png"
    },
    {
      "aliases": ["yes", "はい", "看板", "かんばん", "kanban"],
      "name": "comfyyes",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/comfyyes.png"
    },
    {
      "aliases": [],
      "name": "meow0_0",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meow0_0.png"
    },
    {
      "aliases": [
        "blob",
        "笑顔",
        "えがお",
        "egao",
        "smile",
        "happy",
        "ハッピー",
        "はっぴー"
      ],
      "name": "meowawauu",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowawauu.png"
    },
    {
      "aliases": ["blobcatblue", "blob", "cat", "blue"],
      "name": "meowblue",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowblue.png"
    },
    {
      "aliases": [
        "cry",
        "猫",
        "ねこ",
        "neko",
        "泣く",
        "なく",
        "naku",
        "涙",
        "なみだ",
        "namida"
      ],
      "name": "meowcry",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowcry.png"
    },
    {
      "aliases": [],
      "name": "meowfacepalm",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowfacepalm.png"
    },
    {
      "aliases": [""],
      "name": "meowFingerGuns",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowFingerGuns.png"
    },
    {
      "aliases": [],
      "name": "meowflower",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowflower.png"
    },
    {
      "aliases": ["blobcatgreen", "blob", "cat", "green"],
      "name": "meowgreen",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowgreen.png"
    },
    {
      "aliases": [],
      "name": "meowhuggies",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowhuggies.png"
    },
    {
      "aliases": [""],
      "name": "meowmelt",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowmelt.png"
    },
    {
      "aliases": [
        "cry",
        "猫",
        "ねこ",
        "neko",
        "泣く",
        "なく",
        "naku",
        "涙",
        "なみだ",
        "namida",
        "blobcatmeltcry",
        "blobcat",
        "blobcat_meltcry",
        "meltcry"
      ],
      "name": "meowmeltcry",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowmeltcry.png"
    },
    {
      "aliases": ["blobcatorange", "blob", "cat", "orange"],
      "name": "meoworange",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meoworange.png"
    },
    {
      "aliases": [
        "blob",
        "pat",
        "ナデナデ",
        "なでなで",
        "なでる",
        "撫でる",
        "naderu",
        "nadenade"
      ],
      "name": "meowpats",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowpats.png"
    },
    {
      "aliases": [],
      "name": "meowPuffyHeadphones",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowPuffyHeadphones.png"
    },
    {
      "aliases": [],
      "name": "meowScream",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowScream.png"
    },
    {
      "aliases": [],
      "name": "meowshh",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowshh.png"
    },
    {
      "aliases": [],
      "name": "meowShrug",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowShrug.png"
    },
    {
      "aliases": [],
      "name": "meowSleeping",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowSleeping.png"
    },
    {
      "aliases": [],
      "name": "meowSurprised",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowSurprised.png"
    },
    {
      "aliases": [],
      "name": "meowtilt",
      "category": "Blob/Cat",
      "url": "https://s3.arkjp.net/emoji/meowtilt.png"
    },
    {
      "aliases": [
        "パチパチ",
        "おめめパチパチ",
        "ブリンク",
        "ブロブキャットブリンク"
      ],
      "name": "ablobcatblink",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ablobcatblink.gif"
    },
    {
      "aliases": [
        "おめめパチパチハイパー",
        "パチパチハイパー",
        "ブリンクハイパー"
      ],
      "name": "ablobcatblinkhyper",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ablobcatblinkhyper.gif"
    },
    {
      "aliases": [""],
      "name": "ablobcatcoffee",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ablobcatcoffee.apng"
    },
    {
      "aliases": [""],
      "name": "ablobcatcryingcute",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ablobcatcryingcute.apng"
    },
    {
      "aliases": [
        "うんうん",
        "肯く",
        "首肯く",
        "頷く",
        "うなづく",
        "うなずく",
        "nod",
        "nodding",
        "nodhyper"
      ],
      "name": "ablobcatheadbangfastultra",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ablobcatheadbangfastultra.gif"
    },
    {
      "aliases": [""],
      "name": "ablobcathyper",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ablobcathyper.apng"
    },
    {
      "aliases": [
        "うんうん",
        "肯く",
        "首肯く",
        "頷く",
        "うなづく",
        "うなずく",
        "",
        "ameownodmeltcry",
        "ablob",
        "blob",
        "ablobcat",
        "ameow",
        "cat",
        "meow",
        "nod",
        "melt",
        "cry"
      ],
      "name": "ablobcatnodmeltcry",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ablobcatnodmeltcry.gif"
    },
    {
      "aliases": [
        "animated",
        "アニメーション",
        "動く",
        "blobcat",
        "blob",
        "ablobcat",
        "photobomb",
        "peeking",
        "覗く",
        "フォトボム",
        "フォトボミング",
        "うつりこむ",
        "写真に映り込む"
      ],
      "name": "ablobcatphotobomb",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ablobcatphotobomb.gif"
    },
    {
      "aliases": [],
      "name": "ablobcatreachflip",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ablobcatreachflip.apng"
    },
    {
      "aliases": [""],
      "name": "ablobcatsnowjoy",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ablobcatsnowjoy.gif"
    },
    {
      "aliases": ["飲む", "シップ", "汗", "あせ"],
      "name": "ablobcatsweatsip",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ablobcatsweatsip.apng"
    },
    {
      "aliases": [""],
      "name": "ablobcatwave",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ablobcatwave.apng"
    },
    {
      "aliases": [],
      "name": "ablobcatwhackyfast",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ablobcatwhackyfast.gif"
    },
    {
      "aliases": ["ブロブキャットブリンク", "ブリンク"],
      "name": "ameowblink",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ameowblink.apng"
    },
    {
      "aliases": ["ブロブキャットブリンクリバース", "ブリンク"],
      "name": "ameowblinkreverse",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ameowblinkreverse.apng"
    },
    {
      "aliases": [""],
      "name": "ameowbongo",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ameowbongo.apng"
    },
    {
      "aliases": [
        "うなづく",
        "うなずく",
        "首肯く",
        "肯く",
        "頷く",
        "ノッド",
        "ブロブキャットノッド",
        "ミャウノッド",
        "ニャーノッド"
      ],
      "name": "ameownod",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/ameownod.gif"
    },
    {
      "aliases": [
        "キーボード",
        "ボンゴ",
        "ボンゴキャット",
        "ボンゴねこ",
        "ボンゴキャットキーボード",
        ""
      ],
      "name": "blob_bongo_cat_keyboard",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/blob_bongo_cat_keyboard.gif"
    },
    {
      "aliases": ["ブロブキャットブリンクリバース", "ブリンク"],
      "name": "blobcatblinkrev",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/blobcatblinkrev.apng"
    },
    {
      "aliases": [
        "ハート",
        "好き",
        "すき",
        "いいね",
        "ブロブキャットハートボンゴ"
      ],
      "name": "blobcatheartbongo",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/blobcatheartbongo.gif"
    },
    {
      "aliases": [
        "無駄無駄無駄",
        "むだむだむだ",
        "無駄無駄ラッシュ",
        "ブロブキャットムダムダムダ",
        "mudamudamuda",
        "blobcat",
        "punch",
        "パンチ",
        "ねこぱんち"
      ],
      "name": "blobcat_mudamudamuda",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/blobcat_mudamudamuda.apng"
    },
    {
      "aliases": [
        "レインボー",
        "にじいろ",
        "虹色",
        "七色",
        "なないろ",
        "ななびかり",
        "ななひかり",
        "七光",
        "ゲーミング",
        "ブロブキャットレインボー"
      ],
      "name": "blobcatrainbow",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/blobcatrainbow.apng"
    },
    {
      "aliases": [""],
      "name": "blobcatstretchbottom",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/blobcatstretchbottom.gif"
    },
    {
      "aliases": [""],
      "name": "blobcatstretchmiddle",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/blobcatstretchmiddle.gif"
    },
    {
      "aliases": [""],
      "name": "blobcatstretchtop",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/blobcatstretchtop.gif"
    },
    {
      "aliases": [
        "汗",
        "あせ",
        "いやいや",
        "あわてる",
        "慌てる",
        "ブロブキャットスウェットフリップス"
      ],
      "name": "blobcatsweatflips",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/blobcatsweatflips.apng"
    },
    {
      "aliases": [],
      "name": "resonyance",
      "category": "Blob/Cat/A",
      "url": "https://s3.arkjp.net/emoji/resonyance.webp"
    },
    {
      "aliases": ["ablobfox", "loading"],
      "name": "ablobfox_loading",
      "category": "Blob/Fox",
      "url": "https://s3.arkjp.net/emoji/ablobfox_loading.apng"
    },
    {
      "aliases": [""],
      "name": "blobfoxcheck",
      "category": "Blob/Fox",
      "url": "https://s3.arkjp.net/emoji/blobfoxcheck.png"
    },
    {
      "aliases": [""],
      "name": "blobfoxfacepalm",
      "category": "Blob/Fox",
      "url": "https://s3.arkjp.net/emoji/blobfoxfacepalm.png"
    },
    {
      "aliases": ["blobfox", "outage"],
      "name": "blobfoxoutage",
      "category": "Blob/Fox",
      "url": "https://s3.arkjp.net/emoji/blobfoxoutage.png"
    },
    {
      "aliases": [""],
      "name": "blobfoxsignbaka",
      "category": "Blob/Fox",
      "url": "https://s3.arkjp.net/emoji/blobfoxsignbaka.png"
    },
    {
      "aliases": [""],
      "name": "blobfoxsignnou",
      "category": "Blob/Fox",
      "url": "https://s3.arkjp.net/emoji/blobfoxsignnou.png"
    },
    {
      "aliases": [""],
      "name": "blobfoxsignnoublush",
      "category": "Blob/Fox",
      "url": "https://s3.arkjp.net/emoji/blobfoxsignnoublush.png"
    },
    {
      "aliases": [""],
      "name": "blobfoxsignthx",
      "category": "Blob/Fox",
      "url": "https://s3.arkjp.net/emoji/blobfoxsignthx.png"
    },
    {
      "aliases": [""],
      "name": "blobfoxsignyes",
      "category": "Blob/Fox",
      "url": "https://s3.arkjp.net/emoji/blobfoxsignyes.png"
    },
    {
      "aliases": [
        "cry",
        "兎",
        "ウサギ",
        "うさぎ",
        "usagi",
        "バニー",
        "ばにー",
        "bani-",
        "bunny",
        "泣く",
        "なく",
        "naku",
        "涙",
        "なみだ",
        "namida"
      ],
      "name": "abunhdcry",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/abunhdcry.apng"
    },
    {
      "aliases": [],
      "name": "abunhdhappyhop",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/abunhdhappyhop.apng"
    },
    {
      "aliases": [],
      "name": "bun",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bun.apng"
    },
    {
      "aliases": [],
      "name": "bun_back",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bun_back.apng"
    },
    {
      "aliases": [],
      "name": "bunblanketkawaii",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunblanketkawaii.png"
    },
    {
      "aliases": [],
      "name": "buncowboy",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/buncowboy.apng"
    },
    {
      "aliases": [
        "cry",
        "兎",
        "ウサギ",
        "うさぎ",
        "usagi",
        "バニー",
        "ばにー",
        "bani-",
        "bunny",
        "泣く",
        "なく",
        "naku",
        "涙",
        "なみだ",
        "namida"
      ],
      "name": "buncowboycry",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/buncowboycry.apng"
    },
    {
      "aliases": [
        "cry",
        "兎",
        "ウサギ",
        "うさぎ",
        "usagi",
        "バニー",
        "ばにー",
        "bani-",
        "bunny",
        "泣く",
        "なく",
        "naku",
        "涙",
        "なみだ",
        "namida"
      ],
      "name": "buncry",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/buncry.apng"
    },
    {
      "aliases": [],
      "name": "bun_down",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bun_down.apng"
    },
    {
      "aliases": [],
      "name": "buneyes",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/buneyes.png"
    },
    {
      "aliases": [],
      "name": "bun_fliprev",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bun_fliprev.apng"
    },
    {
      "aliases": [],
      "name": "bunglitch",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunglitch.gif"
    },
    {
      "aliases": [],
      "name": "bunhd",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhd.png"
    },
    {
      "aliases": [],
      "name": "bunhd_aww",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhd_aww.png"
    },
    {
      "aliases": [],
      "name": "bunhdcouple",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhdcouple.png"
    },
    {
      "aliases": [
        "cry",
        "兎",
        "ウサギ",
        "うさぎ",
        "usagi",
        "バニー",
        "ばにー",
        "bani-",
        "bunny",
        "泣く",
        "なく",
        "naku",
        "涙",
        "なみだ",
        "namida"
      ],
      "name": "bunhdcry",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhdcry.png"
    },
    {
      "aliases": [],
      "name": "bunhd_googly",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhd_googly.png"
    },
    {
      "aliases": [],
      "name": "bunhd_happy",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhd_happy.apng"
    },
    {
      "aliases": [],
      "name": "bunhd_happyhop",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhd_happyhop.apng"
    },
    {
      "aliases": [],
      "name": "bunhd_hop",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhd_hop.apng"
    },
    {
      "aliases": [],
      "name": "bunhdhyperbounce",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhdhyperbounce.gif"
    },
    {
      "aliases": [],
      "name": "bunhd_kadomatsu",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhd_kadomatsu.png"
    },
    {
      "aliases": [],
      "name": "bunhd_kagamimochi",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhd_kagamimochi.png"
    },
    {
      "aliases": [],
      "name": "bunhdknife",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhdknife.png"
    },
    {
      "aliases": [],
      "name": "bunhdlurkaww",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhdlurkaww.png"
    },
    {
      "aliases": [],
      "name": "bunhdrainbow",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhdrainbow.apng"
    },
    {
      "aliases": [],
      "name": "bunhd_sadpat",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhd_sadpat.apng"
    },
    {
      "aliases": [],
      "name": "bunhd_sleep",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhd_sleep.png"
    },
    {
      "aliases": ["bun", "bunny", "verified", "misskey", ""],
      "name": "bunhdverifiredmisskey",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunhdverifiredmisskey.png"
    },
    {
      "aliases": [],
      "name": "bunlewd",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunlewd.png"
    },
    {
      "aliases": [],
      "name": "bunpats",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunpats.apng"
    },
    {
      "aliases": [],
      "name": "bunsad",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunsad.png"
    },
    {
      "aliases": [],
      "name": "bunsleep",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunsleep.png"
    },
    {
      "aliases": [],
      "name": "bunthinking",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bunthinking.png"
    },
    {
      "aliases": [],
      "name": "bun_up",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/bun_up.apng"
    },
    {
      "aliases": [],
      "name": "cofebun1",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/cofebun1.png"
    },
    {
      "aliases": [],
      "name": "cofebun3",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/cofebun3.png"
    },
    {
      "aliases": [],
      "name": "revbunhdgoogly",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/revbunhdgoogly.png"
    },
    {
      "aliases": [],
      "name": "revbunhdsmug",
      "category": "Bunny",
      "url": "https://s3.arkjp.net/emoji/revbunhdsmug.png"
    },
    {
      "aliases": [],
      "name": "cat_on_laptop",
      "category": "Cat",
      "url": "https://s3.arkjp.net/emoji/cat_on_laptop.png"
    },
    {
      "aliases": [
        "dance",
        "楽しい",
        "たのしい",
        "だんす",
        "ダンス",
        "tanoshii",
        "tanosii"
      ],
      "name": "hyper_vibecat",
      "category": "Cat",
      "url": "https://s3.arkjp.net/emoji/hyper_vibecat.gif"
    },
    {
      "aliases": [
        "animu",
        "あにむ",
        "think",
        "thinking",
        "animu_think",
        "animu_thinking",
        "thinking_animu",
        "think_animu",
        "thinku_animu",
        "考える",
        "かんがえる",
        "うーん",
        "しんきんぐ",
        "シンキング",
        "シンキングあにむ"
      ],
      "name": "animuthinku",
      "category": "Character",
      "url": "https://s3.arkjp.net/emoji/animuthinku.png"
    },
    {
      "aliases": [
        "pawoo",
        "白象",
        "ハクゾウ",
        "はくぞう",
        "pawoo.net",
        "ぱうー",
        "パウー"
      ],
      "name": "hakuzou",
      "category": "Character",
      "url": "https://s3.arkjp.net/emoji/hakuzou.png"
    },
    {
      "aliases": [
        "うんうん",
        "肯く",
        "首肯く",
        "頷く",
        "うなづく",
        "うなずく",
        ""
      ],
      "name": "maid_nod",
      "category": "Character",
      "url": "https://s3.arkjp.net/emoji/maid_nod.gif"
    },
    {
      "aliases": ["Otachan_DRINKING", ""],
      "name": "otachan_drinking",
      "category": "Character",
      "url": "https://s3.arkjp.net/emoji/otachan_drinking.gif"
    },
    {
      "aliases": ["ピカ", "ぴか"],
      "name": "pika",
      "category": "Character",
      "url": "https://s3.arkjp.net/emoji/pika.png"
    },
    {
      "aliases": [""],
      "name": "puniko_pout",
      "category": "Character / Angry",
      "url": "https://s3.arkjp.net/emoji/puniko_pout.png"
    },
    {
      "aliases": [""],
      "name": "reeEEE",
      "category": "Character / Angry",
      "url": "https://s3.arkjp.net/emoji/reeEEE.apng"
    },
    {
      "aliases": ["ちるの", "チルノ"],
      "name": "cirno_saddest",
      "category": "Character / Cry",
      "url": "https://s3.arkjp.net/emoji/cirno_saddest.png"
    },
    {
      "aliases": [""],
      "name": "cri",
      "category": "Character / Cry",
      "url": "https://s3.arkjp.net/emoji/cri.png"
    },
    {
      "aliases": [""],
      "name": "ota",
      "category": "Character / Cry",
      "url": "https://s3.arkjp.net/emoji/ota.png"
    },
    {
      "aliases": [""],
      "name": "owonervous",
      "category": "Character / Cry",
      "url": "https://s3.arkjp.net/emoji/owonervous.png"
    },
    {
      "aliases": [""],
      "name": "pixie_fan",
      "category": "Character / Cry",
      "url": "https://s3.arkjp.net/emoji/pixie_fan.png"
    },
    {
      "aliases": [""],
      "name": "puniko_cry",
      "category": "Character / Cry",
      "url": "https://s3.arkjp.net/emoji/puniko_cry.png"
    },
    {
      "aliases": ["cry", "sad", "かなしい", "悲しい", "ぐにょぐにょ"],
      "name": "sadblob",
      "category": "Character / Cry",
      "url": "https://s3.arkjp.net/emoji/sadblob.gif"
    },
    {
      "aliases": ["mastodon", "マストドン", "greeting_don", "mastodon_mascot"],
      "name": "don_greeting",
      "category": "Character/Don",
      "url": "https://s3.arkjp.net/emoji/don_greeting.png"
    },
    {
      "aliases": [
        "コンセント",
        "コンセントプラグ",
        "デンマーク",
        "デンマーク式コンセントプラグ"
      ],
      "name": "kawaii_denmark",
      "category": "Character / Happy",
      "url": "https://s3.arkjp.net/emoji/kawaii_denmark.png"
    },
    {
      "aliases": [""],
      "name": "koisuru_doragon",
      "category": "Character / Happy",
      "url": "https://s3.arkjp.net/emoji/koisuru_doragon.png"
    },
    {
      "aliases": [],
      "name": "konomi_good",
      "category": "Character / Happy",
      "url": "https://s3.arkjp.net/emoji/konomi_good.png"
    },
    {
      "aliases": [""],
      "name": "lul",
      "category": "Character / Happy",
      "url": "https://s3.arkjp.net/emoji/lul.png"
    },
    {
      "aliases": [],
      "name": "owo_hyper",
      "category": "Character / Happy",
      "url": "https://s3.arkjp.net/emoji/owo_hyper.gif"
    },
    {
      "aliases": [""],
      "name": "02lewd",
      "category": "Character / lewd",
      "url": "https://s3.arkjp.net/emoji/02lewd.png"
    },
    {
      "aliases": [""],
      "name": "lewd",
      "category": "Character / lewd",
      "url": "https://s3.arkjp.net/emoji/lewd.png"
    },
    {
      "aliases": [],
      "name": "chick_wink_heart",
      "category": "Character / Love",
      "url": "https://s3.arkjp.net/emoji/chick_wink_heart.png"
    },
    {
      "aliases": [""],
      "name": "gustafgaveyoumyheart",
      "category": "Character / Love",
      "url": "https://s3.arkjp.net/emoji/gustafgaveyoumyheart.png"
    },
    {
      "aliases": ["menme", "ジト目"],
      "name": "menme_jito",
      "category": "Character/Menme",
      "url": "https://s3.arkjp.net/misskey/322cee13-27a4-4dd1-8bca-bc3bda8ed8a8.png"
    },
    {
      "aliases": [
        "menme",
        "cry",
        "crying",
        "悲しい",
        "かなしい",
        "かなしむ",
        "悲しむ",
        "泣く",
        "なく",
        "涙",
        "なみだ"
      ],
      "name": "menme_kanasi",
      "category": "Character/Menme",
      "url": "https://s3.arkjp.net/misskey/c98d98b9-e895-4f7a-bc27-78068933b39c.png"
    },
    {
      "aliases": ["menme", "虚無", "白目"],
      "name": "menme_kyomu",
      "category": "Character/Menme",
      "url": "https://s3.arkjp.net/misskey/d31e91f8-2dab-4d99-826e-84ca593559a1.png"
    },
    {
      "aliases": [
        "menme",
        "menme_peti",
        "ぺちぺち",
        "ペチペチ",
        "pechipechi",
        ""
      ],
      "name": "menme_pechi",
      "category": "Character/Menme",
      "url": "https://s3.arkjp.net/misskey/9096bbc7-7103-4de5-a35c-1c7b50fd10da.gif"
    },
    {
      "aliases": ["menme", "シェイク", "怒る"],
      "name": "menme_shake",
      "category": "Character/Menme",
      "url": "https://s3.arkjp.net/misskey/ca9973b4-8ceb-4e79-b0ce-8d493286b830.gif"
    },
    {
      "aliases": ["menme", "しおしお", "つかれた"],
      "name": "menme_siosio",
      "category": "Character/Menme",
      "url": "https://s3.arkjp.net/misskey/b788738d-5f50-4d36-a879-37957d7592d2.png"
    },
    {
      "aliases": ["menme", "surprised", "びっくり", "おどろく", "驚く", "！"],
      "name": "menme_surprise",
      "category": "Character/Menme",
      "url": "https://s3.arkjp.net/misskey/a3efa5f7-b34b-4d45-911d-0bfe2430381c.png"
    },
    {
      "aliases": ["menme", "たのしい"],
      "name": "menme_tanosi",
      "category": "Character/Menme",
      "url": "https://s3.arkjp.net/misskey/c6dbbba4-1b3c-4a6b-bc26-7578955f9ea4.png"
    },
    {
      "aliases": ["menme", "thinking", "think", "？", "疑問符", "疑問", "はてな"],
      "name": "menme_thinking",
      "category": "Character/Menme",
      "url": "https://s3.arkjp.net/misskey/4a149940-ab47-494c-8d5e-962dc4610701.png"
    },
    {
      "aliases": ["menme", "溶ける", "暑い"],
      "name": "menme_tokeru",
      "category": "Character/Menme",
      "url": "https://s3.arkjp.net/misskey/4fa62bd3-fae0-4070-a218-6c2c59840695.png"
    },
    {
      "aliases": ["menme"],
      "name": "menme_uresi",
      "category": "Character/Menme",
      "url": "https://s3.arkjp.net/misskey/9b873f67-13d5-4814-8b88-c0213b6c868a.png"
    },
    {
      "aliases": [
        "notlikethis",
        "notlike",
        "こんなはずでは",
        "みや",
        "綾瀬美夜",
        "頭を抱える",
        "あたまをかかえる"
      ],
      "name": "notlikemiya",
      "category": "Character / NotLike",
      "url": "https://s3.arkjp.net/emoji/notlikemiya.png"
    },
    {
      "aliases": [""],
      "name": "baka_nullcatchan",
      "category": "Character/Nullcat",
      "url": "https://s3.arkjp.net/emoji/baka_nullcatchan.png"
    },
    {
      "aliases": [""],
      "name": "bibibi_nullcat",
      "category": "Character/Nullcat",
      "url": "https://s3.arkjp.net/emoji/bibibi_nullcat.png"
    },
    {
      "aliases": [""],
      "name": "biglove_nullcatchan",
      "category": "Character/Nullcat",
      "url": "https://s3.arkjp.net/emoji/biglove_nullcatchan.png"
    },
    {
      "aliases": [""],
      "name": "love_nullcat",
      "category": "Character/Nullcat",
      "url": "https://s3.arkjp.net/emoji/love_nullcat.png"
    },
    {
      "aliases": [""],
      "name": "monster_nullcat",
      "category": "Character/Nullcat",
      "url": "https://s3.arkjp.net/emoji/monster_nullcat.png"
    },
    {
      "aliases": [
        "notlikethis",
        "notlike",
        "nullcat",
        "こんなはずでは",
        "こんにゃはずでは",
        "頭を抱える",
        "あたまをかかえる"
      ],
      "name": "notlikenullcatchan",
      "category": "Character/Nullcat",
      "url": "https://s3.arkjp.net/emoji/notlikenullcatchan.png"
    },
    {
      "aliases": [""],
      "name": "petthex_nullcat",
      "category": "Character/Nullcat",
      "url": "https://s3.arkjp.net/emoji/petthex_nullcat.gif"
    },
    {
      "aliases": [""],
      "name": "sad_nullcat",
      "category": "Character/Nullcat",
      "url": "https://s3.arkjp.net/emoji/sad_nullcat.png"
    },
    {
      "aliases": [""],
      "name": "think_nullcat",
      "category": "Character/Nullcat",
      "url": "https://s3.arkjp.net/emoji/think_nullcat.png"
    },
    {
      "aliases": [],
      "name": "aissh",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/aissh.png"
    },
    {
      "aliases": [],
      "name": "angry_thinking_sleeping_face_with_tongue_sticking_out",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/angry_thinking_sleeping_face_with_tongue_sticking_out.png"
    },
    {
      "aliases": [""],
      "name": "bap",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/bap.gif"
    },
    {
      "aliases": ["キャラ", "きゃら"],
      "name": "chara",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/chara.png"
    },
    {
      "aliases": [],
      "name": "chicken_roll",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/chicken_roll.gif"
    },
    {
      "aliases": ["チルノ", "ちるの"],
      "name": "cirno_when",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/cirno_when.png"
    },
    {
      "aliases": [""],
      "name": "danboard",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/danboard.png"
    },
    {
      "aliases": [""],
      "name": "doge",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/doge.png"
    },
    {
      "aliases": [""],
      "name": "eyes_blink",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/eyes_blink.gif"
    },
    {
      "aliases": ["フラウィー", "ふらうぃー", "おはな", "はな", "花", "クソ花"],
      "name": "flowey",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/flowey.png"
    },
    {
      "aliases": [],
      "name": "foxjump",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/foxjump.gif"
    },
    {
      "aliases": [],
      "name": "genbaneko",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/genbaneko.png"
    },
    {
      "aliases": ["もこう", "藤原妹紅"],
      "name": "gyate_mokou_fire",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/gyate_mokou_fire.png"
    },
    {
      "aliases": [""],
      "name": "hibiki_flex",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/hibiki_flex.png"
    },
    {
      "aliases": [],
      "name": "kyle",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/kyle.png"
    },
    {
      "aliases": [""],
      "name": "mastodon_oops",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/mastodon_oops.apng"
    },
    {
      "aliases": [""],
      "name": "menharayippie",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/menharayippie.gif"
    },
    {
      "aliases": [],
      "name": "neko_kitui_scp_040_jp_j_snoj_Ikr_4185_cc_by_sa_3_0",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/neko_kitui_scp_040_jp_j_snoj_Ikr_4185_cc_by_sa_3_0.png"
    },
    {
      "aliases": ["neko_test"],
      "name": "neko_scp_040_jp_Ikr_4185_cc_by_sa_3_0",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/neko_scp_040_jp_Ikr_4185_cc_by_sa_3_0.png"
    },
    {
      "aliases": [""],
      "name": "oh_shoboon",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/oh_shoboon.png"
    },
    {
      "aliases": ["ポプ子", "popteamepic", "ポプテピピック", "popuko"],
      "name": "o_wa",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/o_wa.png"
    },
    {
      "aliases": [],
      "name": "owaaaaaa",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/owaaaaaa.gif"
    },
    {
      "aliases": [""],
      "name": "oyaji_body",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/oyaji_body.png"
    },
    {
      "aliases": [""],
      "name": "psychedelic_fits",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/psychedelic_fits.gif"
    },
    {
      "aliases": [""],
      "name": "puniko_hi",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/puniko_hi.apng"
    },
    {
      "aliases": [],
      "name": "rhaha_anger_loop",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/rhaha_anger_loop.gif"
    },
    {
      "aliases": [],
      "name": "rhaha_norinori",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/rhaha_norinori.gif"
    },
    {
      "aliases": [""],
      "name": "rhaha_norinori_loop",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/rhaha_norinori_loop.gif"
    },
    {
      "aliases": [""],
      "name": "take_this",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/take_this.gif"
    },
    {
      "aliases": [],
      "name": "tvchan",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/tvchan.png"
    },
    {
      "aliases": [],
      "name": "vomiting_thinking_skeptical_face_with_hugging_hands",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/vomiting_thinking_skeptical_face_with_hugging_hands.png"
    },
    {
      "aliases": [],
      "name": "wobbly_chicken",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/wobbly_chicken.gif"
    },
    {
      "aliases": [""],
      "name": "yen_face",
      "category": "Character / Other",
      "url": "https://s3.arkjp.net/emoji/yen_face.png"
    },
    {
      "aliases": [""],
      "name": "heyy",
      "category": "Character / Pepe",
      "url": "https://s3.arkjp.net/emoji/heyy.png"
    },
    {
      "aliases": [""],
      "name": "pepehands",
      "category": "Character / Pepe",
      "url": "https://s3.arkjp.net/emoji/pepehands.png"
    },
    {
      "aliases": ["pepe", "ペペ", "ぺぺ"],
      "name": "pepejam",
      "category": "Character / Pepe",
      "url": "https://s3.arkjp.net/emoji/pepejam.apng"
    },
    {
      "aliases": ["sad", "pepe", "ペペ", "ぺぺ", ""],
      "name": "pepesad",
      "category": "Character / Pepe",
      "url": "https://s3.arkjp.net/emoji/pepesad.png"
    },
    {
      "aliases": ["pepe", "smug", "どやがお", "ドヤ顔", "ペペ", "ペペ"],
      "name": "pepesmug",
      "category": "Character / Pepe",
      "url": "https://s3.arkjp.net/emoji/pepesmug.png"
    },
    {
      "aliases": ["think", "pepe", "ぺぺ", "ペペ", ""],
      "name": "pepethinking",
      "category": "Character / Pepe",
      "url": "https://s3.arkjp.net/emoji/pepethinking.png"
    },
    {
      "aliases": [""],
      "name": "sitt",
      "category": "Character / Pepe",
      "url": "https://s3.arkjp.net/emoji/sitt.png"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbear",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbear.apng"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbearandsmallerpolarbear",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbearandsmallerpolarbear.gif"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbearbongocat",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbearbongocat.gif"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbear_crying",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbear_crying.gif"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbear_fast",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbear_fast.gif"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbear_fire",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbear_fire.gif"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbear_hayasugi",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbear_hayasugi.gif"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbear_mambo_no5",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbear_mambo_no5.apng"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbearpartyhat",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbearpartyhat.gif"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbearpatpolarbear",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbearpatpolarbear.gif"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbear_pensive",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbear_pensive.gif"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbear_sdvx",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbear_sdvx.apng"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbear_slow",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbear_slow.apng"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbearsunglasses",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbearsunglasses.gif"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbear_superslow",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbear_superslow.gif"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbear_tomarikake",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbear_tomarikake.gif"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "polarbearwarping",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/polarbearwarping.gif"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "static_polarbear",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/static_polarbear.png"
    },
    {
      "aliases": [
        "bear",
        "polarbear",
        "polar",
        "しろくま",
        "白くま",
        "白熊",
        "白ぐま",
        "白グマ",
        "シログマ",
        "シロクマ",
        "北極熊",
        "北極グマ",
        "ホッキョクグマ",
        "ポーラベア",
        "white_bear",
        "sirokuma",
        "siroguma",
        "shirokuma",
        "shiroguma",
        "kuma"
      ],
      "name": "static_polarbear_inverted",
      "category": "Character / Polarbear",
      "url": "https://s3.arkjp.net/emoji/static_polarbear_inverted.png"
    },
    {
      "aliases": ["setsufuro", "vtuber"],
      "name": "setsufuro_angry",
      "category": "Character/Setsufuro",
      "url": "https://s3.arkjp.net/misskey/webpublic-b681cc3e-8176-4539-bf55-29dc9b6af879.png"
    },
    {
      "aliases": ["setsufuro", "vtuber"],
      "name": "setsufuro_cheering",
      "category": "Character/Setsufuro",
      "url": "https://s3.arkjp.net/misskey/webpublic-fcc0cc10-7daf-4dcd-9ffc-e45c961bed2c.png"
    },
    {
      "aliases": ["setsufuro", "vtuber"],
      "name": "setsufuro_gg",
      "category": "Character/Setsufuro",
      "url": "https://s3.arkjp.net/misskey/webpublic-d4325e65-e797-435b-baa2-39ce9b1b46af.png"
    },
    {
      "aliases": ["setsufuro", "vtuber"],
      "name": "setsufuro_heart",
      "category": "Character/Setsufuro",
      "url": "https://s3.arkjp.net/misskey/webpublic-9ec9d5ba-0d1e-4153-94c2-02841db8ee01.png"
    },
    {
      "aliases": ["setsufuro", "vtuber"],
      "name": "setsufuro_hi",
      "category": "Character/Setsufuro",
      "url": "https://s3.arkjp.net/misskey/webpublic-c50abbcf-fe08-46a3-aa78-5c05e977ff80.png"
    },
    {
      "aliases": ["setsufuro", "vtuber"],
      "name": "setsufuro_omg",
      "category": "Character/Setsufuro",
      "url": "https://s3.arkjp.net/misskey/webpublic-f894d0e6-e142-48ef-b609-c5af23d439d1.png"
    },
    {
      "aliases": ["setsufuro", "vtuber"],
      "name": "setsufuro_pien",
      "category": "Character/Setsufuro",
      "url": "https://s3.arkjp.net/misskey/webpublic-7795418a-5168-435d-893e-07dfda659d0d.png"
    },
    {
      "aliases": ["setsufuro", "vtuber"],
      "name": "setsufuro_question",
      "category": "Character/Setsufuro",
      "url": "https://s3.arkjp.net/misskey/webpublic-a934d6c1-c061-49f8-b68d-44651bf841e1.png"
    },
    {
      "aliases": ["setsufuro", "vtuber"],
      "name": "setsufuro_tententen",
      "category": "Character/Setsufuro",
      "url": "https://s3.arkjp.net/misskey/webpublic-728c7302-64e1-44ae-a818-345d3339dee1.png"
    },
    {
      "aliases": ["setsufuro", "vtuber"],
      "name": "setsufuro_thinking",
      "category": "Character/Setsufuro",
      "url": "https://s3.arkjp.net/misskey/webpublic-231ea427-adc0-4746-b2fb-9a4cfa246a9d.png"
    },
    {
      "aliases": ["setsufuro", "vtuber"],
      "name": "setsufuro_www",
      "category": "Character/Setsufuro",
      "url": "https://s3.arkjp.net/misskey/webpublic-ded01c3e-d140-4ee6-9a27-7276ef425312.png"
    },
    {
      "aliases": [""],
      "name": "hehe",
      "category": "Character / Smug",
      "url": "https://s3.arkjp.net/emoji/hehe.png"
    },
    {
      "aliases": [""],
      "name": "JahySmug",
      "category": "Character / Smug",
      "url": "https://s3.arkjp.net/emoji/JahySmug.png"
    },
    {
      "aliases": [""],
      "name": "puniko_smug2",
      "category": "Character / Smug",
      "url": "https://s3.arkjp.net/emoji/puniko_smug2.png"
    },
    {
      "aliases": [""],
      "name": "puniko_smug3",
      "category": "Character / Smug",
      "url": "https://s3.arkjp.net/emoji/puniko_smug3.png"
    },
    {
      "aliases": [
        "スターキャットハート",
        "starcat",
        "heart",
        "love",
        "suki",
        "like",
        "いいね",
        "iine"
      ],
      "name": "starcatheart",
      "category": "Character/Starcat",
      "url": "https://s3.arkjp.net/emoji/starcatheart.png"
    },
    {
      "aliases": [
        "スターキャットレッドアイ",
        "星猫",
        "starcat",
        "starcat_jp",
        "hoshineko",
        "hosineko",
        "赤目",
        "レッドアイ",
        "赤い目",
        "レッドアイ"
      ],
      "name": "starcatredeye",
      "category": "Character/Starcat",
      "url": "https://s3.arkjp.net/emoji/starcatredeye.png"
    },
    {
      "aliases": [""],
      "name": "taniguti_hyperthink",
      "category": "Character / Think",
      "url": "https://s3.arkjp.net/emoji/taniguti_hyperthink.png"
    },
    {
      "aliases": [""],
      "name": "shibawhat",
      "category": "Character / What",
      "url": "https://s3.arkjp.net/emoji/shibawhat.png"
    },
    {
      "aliases": ["yanchon", "やんちょん"],
      "name": "yanchon_cry",
      "category": "Character/Yanchon",
      "url": "https://s3.arkjp.net/emoji/yanchon_cry.png"
    },
    {
      "aliases": ["yanchon", "やんちょん"],
      "name": "yanchon_eat",
      "category": "Character/Yanchon",
      "url": "https://s3.arkjp.net/emoji/yanchon_eat.png"
    },
    {
      "aliases": ["yanchon", "やんちょん"],
      "name": "yanchon_kanpai",
      "category": "Character/Yanchon",
      "url": "https://s3.arkjp.net/emoji/yanchon_kanpai.png"
    },
    {
      "aliases": ["yanchon", "やんちょん"],
      "name": "yanchon_love",
      "category": "Character/Yanchon",
      "url": "https://s3.arkjp.net/emoji/yanchon_love.png"
    },
    {
      "aliases": ["yanchon", "やんちょん"],
      "name": "yanchon_morning",
      "category": "Character/Yanchon",
      "url": "https://s3.arkjp.net/emoji/yanchon_morning.png"
    },
    {
      "aliases": ["yanchon", "やんちょん"],
      "name": "yanchon_night",
      "category": "Character/Yanchon",
      "url": "https://s3.arkjp.net/emoji/yanchon_night.png"
    },
    {
      "aliases": ["yanchon", "やんちょん"],
      "name": "yanchon_scared",
      "category": "Character/Yanchon",
      "url": "https://s3.arkjp.net/emoji/yanchon_scared.png"
    },
    {
      "aliases": ["yanchon", "やんちょん"],
      "name": "yanchon_working",
      "category": "Character/Yanchon",
      "url": "https://s3.arkjp.net/emoji/yanchon_working.png"
    },
    {
      "aliases": ["yuniru", "yuniruyuni", "ゆにる", "ユニ", "ゆにるユニ"],
      "name": "yunirubatsu",
      "category": "Character/YuniruYuni",
      "url": "https://s3.arkjp.net/emoji/yunirubatsu.png"
    },
    {
      "aliases": ["yuniru", "yuniruyuni", "ゆにる", "ユニ", "ゆにるユニ"],
      "name": "yunirublush",
      "category": "Character/YuniruYuni",
      "url": "https://s3.arkjp.net/emoji/yunirublush.png"
    },
    {
      "aliases": ["yuniru", "yuniruyuni", "ゆにる", "ユニ", "ゆにるユニ"],
      "name": "yunirueat",
      "category": "Character/YuniruYuni",
      "url": "https://s3.arkjp.net/emoji/yunirueat.png"
    },
    {
      "aliases": ["yuniru", "yuniruyuni", "ゆにる", "ユニ", "ゆにるユニ"],
      "name": "yuniruheart",
      "category": "Character/YuniruYuni",
      "url": "https://s3.arkjp.net/emoji/yuniruheart.png"
    },
    {
      "aliases": ["yuniru", "yuniruyuni", "ゆにる", "ユニ", "ゆにるユニ"],
      "name": "yunirumaru",
      "category": "Character/YuniruYuni",
      "url": "https://s3.arkjp.net/emoji/yunirumaru.png"
    },
    {
      "aliases": ["yuniru", "yuniruyuni", "ゆにる", "ユニ", "ゆにるユニ"],
      "name": "yunirunipa",
      "category": "Character/YuniruYuni",
      "url": "https://s3.arkjp.net/emoji/yunirunipa.png"
    },
    {
      "aliases": ["", "yuniru", "yuniruyuni", "ゆにる", "ユニ", "ゆにるユニ"],
      "name": "yuniruowo",
      "category": "Character/YuniruYuni",
      "url": "https://s3.arkjp.net/emoji/yuniruowo.png"
    },
    {
      "aliases": ["yuniru", "yuniruyuni", "ゆにる", "ユニ", "ゆにるユニ"],
      "name": "yunirusurprise",
      "category": "Character/YuniruYuni",
      "url": "https://s3.arkjp.net/emoji/yunirusurprise.png"
    },
    {
      "aliases": [],
      "name": "happymac",
      "category": "Cute",
      "url": "https://s3.arkjp.net/emoji/happymac.png"
    },
    {
      "aliases": ["gamingshark"],
      "name": "rainbowshark",
      "category": "Cute",
      "url": "https://s3.arkjp.net/emoji/rainbowshark.png"
    },
    {
      "aliases": [],
      "name": "sadmac",
      "category": "Cute",
      "url": "https://s3.arkjp.net/emoji/sadmac.png"
    },
    {
      "aliases": ["stat", "sake", "beer"],
      "name": "stat_sake",
      "category": "Cute",
      "url": "https://s3.arkjp.net/emoji/stat_sake.apng"
    },
    {
      "aliases": [],
      "name": "stat_sing",
      "category": "Cute",
      "url": "https://s3.arkjp.net/emoji/stat_sing.apng"
    },
    {
      "aliases": ["stat", "sweets", "cake"],
      "name": "stat_sweets",
      "category": "Cute",
      "url": "https://s3.arkjp.net/emoji/stat_sweets.apng"
    },
    {
      "aliases": ["stat", "tea"],
      "name": "stat_tea",
      "category": "Cute",
      "url": "https://s3.arkjp.net/emoji/stat_tea.apng"
    },
    {
      "aliases": [""],
      "name": "anidab_right",
      "category": "Dance",
      "url": "https://s3.arkjp.net/emoji/anidab_right.png"
    },
    {
      "aliases": ["subaru", "hololive"],
      "name": "duckdance",
      "category": "Dance",
      "url": "https://s3.arkjp.net/emoji/duckdance.gif"
    },
    {
      "aliases": ["kyouko_dance"],
      "name": "KyoukoDance",
      "category": "Dance",
      "url": "https://s3.arkjp.net/emoji/KyoukoDance.gif"
    },
    {
      "aliases": [""],
      "name": "nekobounce",
      "category": "Dance",
      "url": "https://s3.arkjp.net/emoji/nekobounce.gif"
    },
    {
      "aliases": [],
      "name": "nyanners",
      "category": "Dance",
      "url": "https://s3.arkjp.net/emoji/nyanners.gif"
    },
    {
      "aliases": [],
      "name": "nyanners2",
      "category": "Dance",
      "url": "https://s3.arkjp.net/emoji/nyanners2.gif"
    },
    {
      "aliases": [""],
      "name": "nyanners_hyper",
      "category": "Dance",
      "url": "https://s3.arkjp.net/emoji/nyanners_hyper.gif"
    },
    {
      "aliases": [],
      "name": "parrot_wave1",
      "category": "Dance",
      "url": "https://s3.arkjp.net/emoji/parrot_wave1.apng"
    },
    {
      "aliases": [],
      "name": "rainbowneko",
      "category": "Dance",
      "url": "https://s3.arkjp.net/emoji/rainbowneko.gif"
    },
    {
      "aliases": [""],
      "name": "smugDance",
      "category": "Dance",
      "url": "https://s3.arkjp.net/emoji/smugDance.apng"
    },
    {
      "aliases": ["parrot"],
      "name": "twinsparrot",
      "category": "Dance",
      "url": "https://s3.arkjp.net/emoji/twinsparrot.gif"
    },
    {
      "aliases": ["parrot"],
      "name": "ultrafastparrot",
      "category": "Dance",
      "url": "https://s3.arkjp.net/emoji/ultrafastparrot.gif"
    },
    {
      "aliases": [""],
      "name": "cool_doggo",
      "category": "Dog",
      "url": "https://s3.arkjp.net/emoji/cool_doggo.gif"
    },
    {
      "aliases": [""],
      "name": "dog_smile",
      "category": "Dog",
      "url": "https://s3.arkjp.net/emoji/dog_smile.gif"
    },
    {
      "aliases": ["アボカド", "認証済みアボカド", "認証アボカド"],
      "name": "avocado_verified",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/avocado_verified.png"
    },
    {
      "aliases": ["おいで", "ベッドおいで", "bed", "oide", "べっど", "ベッド"],
      "name": "bed_oide",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/bed_oide.png"
    },
    {
      "aliases": ["カレープリン"],
      "name": "curry_pudding",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/curry_pudding.png"
    },
    {
      "aliases": ["ドーナツプリン", "ドーナッツプリン"],
      "name": "doughnut_pudding",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/doughnut_pudding.png"
    },
    {
      "aliases": [
        "鴨",
        "かも",
        "ダック",
        "認証",
        "認証鴨",
        "認証かも",
        "認証ダック",
        "duck",
        "verified_duck"
      ],
      "name": "duck_verified",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/duck_verified.png"
    },
    {
      "aliases": ["プリン", "噴火", "食べ物", "food", "mountain", "magma"],
      "name": "erupting_pudding",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/erupting_pudding.png"
    },
    {
      "aliases": ["vomit", ""],
      "name": "french_spew",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/french_spew.png"
    },
    {
      "aliases": ["みどりうんち", "うんこ", "グリーンプープ", "green", "poop"],
      "name": "green_poop",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/green_poop.png"
    },
    {
      "aliases": [
        "material_error",
        "マテリアルエラー",
        "まてりあるえらー",
        "マジェンタ",
        "マゼンタ",
        "ピンク",
        ""
      ],
      "name": "magenta_square",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/magenta_square.png"
    },
    {
      "aliases": ["承認", "認証", "プリン", "ベリファイ", "食べ物", "food"],
      "name": "pudding_puddingified_verified",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/pudding_puddingified_verified.png"
    },
    {
      "aliases": ["sushi", "pudding", "プリン寿司", "プリンすし"],
      "name": "pudding_sushi",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/pudding_sushi.png"
    },
    {
      "aliases": [""],
      "name": "pudding_verified",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/pudding_verified.png"
    },
    {
      "aliases": [
        "プリン",
        "ぷりん",
        "カスタード",
        "custard",
        "custard_verified_gold",
        "custard_verified_business",
        "pudding_verified_business"
      ],
      "name": "pudding_verified_gold",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/pudding_verified_gold.png"
    },
    {
      "aliases": ["プリン", "顔", "ぼんやり", "face", "食べ物", "food"],
      "name": "pudding_woozy",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/pudding_woozy.png"
    },
    {
      "aliases": ["ラーメンプリン"],
      "name": "ramen_pudding",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/ramen_pudding.png"
    },
    {
      "aliases": [
        "happy_baby",
        "relax",
        "happy",
        "baby",
        "赤ちゃん",
        "リラックス",
        "ハッピー",
        "しあわせ"
      ],
      "name": "relaxed_baby",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/relaxed_baby.png"
    },
    {
      "aliases": ["寿司プリン", "すしプリン", ""],
      "name": "rolled_sushi_pudding",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/rolled_sushi_pudding.png"
    },
    {
      "aliases": ["smiling", "face", "hearts", "ハート"],
      "name": "smiling_face_with_a_lot_of_hearts",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/smiling_face_with_a_lot_of_hearts.png"
    },
    {
      "aliases": ["プリン", "すしプリン"],
      "name": "sushi_pudding",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/sushi_pudding.png"
    },
    {
      "aliases": ["wheezing", "lol", "laugh", "funny"],
      "name": "wheeze",
      "category": "EmojiLike",
      "url": "https://s3.arkjp.net/emoji/wheeze.png"
    },
    {
      "aliases": ["thinking"],
      "name": "hyperthink",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/hyperthink.png"
    },
    {
      "aliases": [],
      "name": "syncing_face",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/syncing_face.png"
    },
    {
      "aliases": ["thinking", "happy"],
      "name": "thinkhappy",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/thinkhappy.png"
    },
    {
      "aliases": [],
      "name": "thinking_cat_face",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/thinking_cat_face.png"
    },
    {
      "aliases": [],
      "name": "thinking_clap",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/thinking_clap.png"
    },
    {
      "aliases": [],
      "name": "thinking_face_both",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/thinking_face_both.png"
    },
    {
      "aliases": [],
      "name": "thinking_framing",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/thinking_framing.png"
    },
    {
      "aliases": [""],
      "name": "thinking_panic",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/thinking_panic.gif"
    },
    {
      "aliases": ["thinking"],
      "name": "thinking_rotate",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/thinking_rotate.apng"
    },
    {
      "aliases": [],
      "name": "thinking_sunriseovermountains",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/thinking_sunriseovermountains.png"
    },
    {
      "aliases": [],
      "name": "thinknyan",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/thinknyan.png"
    },
    {
      "aliases": [""],
      "name": "thonk",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/thonk.png"
    },
    {
      "aliases": [],
      "name": "thonk_roll",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/thonk_roll.gif"
    },
    {
      "aliases": [],
      "name": "thonk_spin",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/thonk_spin.gif"
    },
    {
      "aliases": [],
      "name": "verifinking",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/verifinking.png"
    },
    {
      "aliases": [],
      "name": "zen_thinking",
      "category": "EmojiLike/Think",
      "url": "https://s3.arkjp.net/emoji/zen_thinking.png"
    },
    {
      "aliases": [
        "牛丼",
        "ぎゅうどん",
        "寝室の牛丼",
        "goma",
        "bedroom",
        "gyudon"
      ],
      "name": "bedroom_gyudon",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/bedroom_gyudon.png"
    },
    {
      "aliases": [],
      "name": "colaup",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/colaup.png"
    },
    {
      "aliases": ["sushi"],
      "name": "desyo",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/desyo.png"
    },
    {
      "aliases": [
        "ｶﾞｯﾂﾘ塩ラーメン",
        "がっつりしおらーめん",
        "gattsurisioramen",
        "gattsurishioramen",
        "gatturisioramen",
        "gatturishioramen",
        "ラーメン",
        "pudding_ramen",
        "プリンラーメン"
      ],
      "name": "gattsurishioramen",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/gattsurishioramen.png"
    },
    {
      "aliases": ["本わさび", "わさび", "わさびの根", "wasabi"],
      "name": "hon_wasabi",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/hon_wasabi.png"
    },
    {
      "aliases": [
        "ホットソース",
        "デスソース",
        "タバスコ",
        "ペッパーソース",
        "スパイシーソース",
        "tabasco",
        "hot",
        "spicy",
        "hotsauce"
      ],
      "name": "hot_sauce",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/hot_sauce.png"
    },
    {
      "aliases": ["かまぼこ"],
      "name": "kamaboko",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/kamaboko.png"
    },
    {
      "aliases": ["pancake"],
      "name": "long_pancakes_bottom",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/long_pancakes_bottom.png"
    },
    {
      "aliases": ["pancake"],
      "name": "long_pancakes_middle",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/long_pancakes_middle.png"
    },
    {
      "aliases": ["pancake"],
      "name": "long_pancakes_top",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/long_pancakes_top.png"
    },
    {
      "aliases": [],
      "name": "monster_absolutely_zero",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/monster_absolutely_zero.png"
    },
    {
      "aliases": [],
      "name": "monster_chaos",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/monster_chaos.png"
    },
    {
      "aliases": [],
      "name": "monster_cuba_libre",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/monster_cuba_libre.png"
    },
    {
      "aliases": [],
      "name": "monsterenergy",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/monsterenergy.png"
    },
    {
      "aliases": [],
      "name": "monster_pipeline_punch",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/monster_pipeline_punch.png"
    },
    {
      "aliases": [],
      "name": "monster_ultra",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/monster_ultra.png"
    },
    {
      "aliases": ["納豆", "なっとう", "natto"],
      "name": "nattou",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/nattou.png"
    },
    {
      "aliases": [
        "アップルティー",
        "大人の紅茶",
        "おとなのこうちゃ",
        "村上さんがおいしいっていってたやつ"
      ],
      "name": "otonano_appletea",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/otonano_appletea.png"
    },
    {
      "aliases": [""],
      "name": "pat_colaup",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/pat_colaup.gif"
    },
    {
      "aliases": [
        "あんこの詰まったおいしい和菓子",
        "あんこが詰まったおいしい和菓子",
        "あんこのつまったおいしいわがし",
        "あんこがつまったおいしいわがし",
        "baked_mochocho",
        "imagawayaki",
        "oobanyaki",
        "obantoku",
        "oyaki",
        "kaitenyaki",
        "kaitenmanjuu",
        "custard_pancake",
        "kintsuba",
        "taikomanjuu",
        "taikoman",
        "taikoyaki",
        "taikouyaki",
        "nijuuyaki",
        "sharinmochi",
        "nattoumochi",
        "tokiwado",
        "japanese_cake",
        "wheelcake",
        "ajiman",
        "adumayaki",
        "azumayaki",
        "amaideyaki",
        "amatarouyaki",
        "amayaki",
        "ankomanjuu",
        "ebisuyaki",
        "enbanyaki",
        "ougonmanjuu",
        "otakemanjuu",
        "oyatsumanjuu",
        "gamegomochi",
        "gishiyaki",
        "kurimanjuu",
        "gozasourou",
        "ougonyaki",
        "koganeyaki",
        "shibaraku",
        "jimanyaki",
        "jinkoueiseimanjuu",
        "zuborayaki",
        "zundouyaki",
        "taihouyaki",
        "daimonjiyaki",
        "tarouyaki",
        "chapporoyaki",
        "tenrin",
        "toukaiyaki",
        "dotekin",
        "tomoeyaki",
        "dorakoyaki",
        "dorikonoyaki",
        "nanaoyaki",
        "nanakoshiyaki",
        "nanakoshiman",
        "hanamiyaki",
        "panjuuyaki",
        "higiriyaki",
        "bikkurimanjuu",
        "hittoyaki",
        "piipan",
        "fuuman",
        "houraimanjuu",
        "hourakumanjuu",
        "homerunyaki",
        "hoppeyaki",
        "mangetsuyaki",
        "mikasayaki",
        "meotomanjuu",
        "mochiduki",
        "yakiichiban",
        "yakimanjuu",
        "yanagimanjuu",
        "yokodunamanjuu",
        "roppouyaki",
        "obantokku",
        "obang-ttok",
        "obangttok",
        "osutoanderu",
        "ankorino"
      ],
      "name": "petthex_japanesecake",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/petthex_japanesecake.gif"
    },
    {
      "aliases": [
        "ピザ",
        "マルゲリータピザ",
        "ナポリタンピザ",
        "vera_pizza",
        "margherita_pizza",
        "napolitan_pizza",
        "pizza_napoletana",
        "naples_style_pizza",
        "pizza_marinara"
      ],
      "name": "pizza",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/pizza.png"
    },
    {
      "aliases": [""],
      "name": "pizza_charged_with_electricity",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/pizza_charged_with_electricity.png"
    },
    {
      "aliases": [],
      "name": "redbull",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/redbull.png"
    },
    {
      "aliases": [""],
      "name": "sandwich_buns_bottom",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/sandwich_buns_bottom.png"
    },
    {
      "aliases": [""],
      "name": "sandwich_buns_top_a",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/sandwich_buns_top_a.png"
    },
    {
      "aliases": [""],
      "name": "sandwich_buns_top_b",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/sandwich_buns_top_b.png"
    },
    {
      "aliases": [""],
      "name": "sandwich_lettuce",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/sandwich_lettuce.png"
    },
    {
      "aliases": [""],
      "name": "sandwich_tomato",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/sandwich_tomato.png"
    },
    {
      "aliases": [],
      "name": "sijimi",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/sijimi.png"
    },
    {
      "aliases": [],
      "name": "spam",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/spam.png"
    },
    {
      "aliases": [],
      "name": "suika",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/suika.png"
    },
    {
      "aliases": ["しゅいろ", "納豆", "失敗", ""],
      "name": "syuilo_nattoopen_failed",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/syuilo_nattoopen_failed.png"
    },
    {
      "aliases": [
        "대동강맥주",
        "大同江麥酒",
        "大同江麦酒",
        "だいどうこうばくしゅ",
        "大同江ビール",
        "テドンガンビール",
        "アツいビール",
        "テドンガンメッチュ",
        "テドンガンメクチュ",
        "daedong_gang_maekju",
        "taetong_kang_maekchu"
      ],
      "name": "taedonggang_beer",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/taedonggang_beer.png"
    },
    {
      "aliases": ["オムライス", "おむらいす", "omlette", "rice", "thinking"],
      "name": "thinking_omurice",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/thinking_omurice.png"
    },
    {
      "aliases": ["わさび", "wasabi", "チューブのわさび"],
      "name": "tube_wasabi",
      "category": "Food drink",
      "url": "https://s3.arkjp.net/emoji/tube_wasabi.png"
    },
    {
      "aliases": ["misetehosii", "i-filter", "filtering", "show"],
      "name": "ifilter_misetehoshii",
      "category": "i-フィルター",
      "url": "https://s3.arkjp.net/emoji/ifilter_misetehoshii.png"
    },
    {
      "aliases": ["tukaitai", "i-filter", "filtering", "use"],
      "name": "ifilter_tsukaitai",
      "category": "i-フィルター",
      "url": "https://s3.arkjp.net/emoji/ifilter_tsukaitai.png"
    },
    {
      "aliases": ["ω", "fuguri", "オメガ", "ふぐり"],
      "name": "omega",
      "category": "Letters/Greek",
      "url": "https://s3.arkjp.net/misskey/b2f6927a-3203-4a96-bdfc-be8b1202056d.png"
    },
    {
      "aliases": [""],
      "name": "0",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/0.png"
    },
    {
      "aliases": ["nisuru", "にする"],
      "name": "1_nisuru",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/1_nisuru.png"
    },
    {
      "aliases": [],
      "name": "a",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/a.png"
    },
    {
      "aliases": [""],
      "name": "aaaaaaaaaaaaaaaaaaaaaaaaa",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/aaaaaaaaaaaaaaaaaaaaaaaaa.png"
    },
    {
      "aliases": [""],
      "name": "akan",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/akan.png"
    },
    {
      "aliases": [""],
      "name": "akanyatsuya",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/akanyatsuya.png"
    },
    {
      "aliases": [""],
      "name": "akugyo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/akugyo.png"
    },
    {
      "aliases": [""],
      "name": "akusaa",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/akusaa.png"
    },
    {
      "aliases": ["start_the_war", "funsou_wo_kaishi"],
      "name": "aliexpress_mistranslation",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/aliexpress_mistranslation.png"
    },
    {
      "aliases": [],
      "name": "anatano_jitakuwo_keibishimasu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/anatano_jitakuwo_keibishimasu.png"
    },
    {
      "aliases": [""],
      "name": "arama",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/arama.png"
    },
    {
      "aliases": ["あれ", "that"],
      "name": "are",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/misskey/c92a6a26-eb4f-4119-a959-5a75abf73b83.png"
    },
    {
      "aliases": [],
      "name": "arienai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/arienai.png"
    },
    {
      "aliases": [],
      "name": "arigato",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/arigato.png"
    },
    {
      "aliases": [""],
      "name": "arigato_2",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/arigato_2.png"
    },
    {
      "aliases": [""],
      "name": "arigatougozaimasu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/arigatougozaimasu.png"
    },
    {
      "aliases": [],
      "name": "arigunyatogonyainyasu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/arigunyatogonyainyasu.png"
    },
    {
      "aliases": [""],
      "name": "arisou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/arisou.png"
    },
    {
      "aliases": [""],
      "name": "ariyorinoari",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ariyorinoari.png"
    },
    {
      "aliases": [""],
      "name": "aru",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/aru.png"
    },
    {
      "aliases": [],
      "name": "aruaru",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/aruaru.png"
    },
    {
      "aliases": [],
      "name": "arusa",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/arusa.png"
    },
    {
      "aliases": [],
      "name": "ashitaga",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ashitaga.png"
    },
    {
      "aliases": [],
      "name": "at_kobayashi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/at_kobayashi.png"
    },
    {
      "aliases": [],
      "name": "atsumori",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/atsumori.png"
    },
    {
      "aliases": ["怪しい日本語"],
      "name": "ayashii_nihongo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ayashii_nihongo.png"
    },
    {
      "aliases": [""],
      "name": "aza",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/aza.png"
    },
    {
      "aliases": [""],
      "name": "azamasu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/azamasu.png"
    },
    {
      "aliases": [""],
      "name": "bababa",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/bababa.png"
    },
    {
      "aliases": ["banana", "ばにゃにゃ"],
      "name": "banyanya",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/banyanya.png"
    },
    {
      "aliases": [],
      "name": "benkyou_shiro",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/benkyou_shiro.png"
    },
    {
      "aliases": [""],
      "name": "bishoujodesukedo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/bishoujodesukedo.png"
    },
    {
      "aliases": [],
      "name": "bread_from_hell",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/bread_from_hell.png"
    },
    {
      "aliases": ["demo_omae"],
      "name": "but_you_are",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/but_you_are.png"
    },
    {
      "aliases": [""],
      "name": "chanto_tabero",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/chanto_tabero.png"
    },
    {
      "aliases": [""],
      "name": "chasmo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/chasmo.png"
    },
    {
      "aliases": [""],
      "name": "chet",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/chet.png"
    },
    {
      "aliases": [""],
      "name": "chinchin",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/chinchin.png"
    },
    {
      "aliases": [""],
      "name": "chottodannshii",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/chottodannshii.png"
    },
    {
      "aliases": [""],
      "name": "chottodekiru",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/chottodekiru.png"
    },
    {
      "aliases": ["ちょっとなにいってるかわかんない"],
      "name": "chottonaniitterukawanannai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/chottonaniitterukawanannai.png"
    },
    {
      "aliases": [],
      "name": "chou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/chou.png"
    },
    {
      "aliases": ["カスタム絵文字", "かすたむえもじ", "kasutamu_emoji"],
      "name": "custom_emoji",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/misskey/d47bdf06-27ac-4628-84dd-57c6118e5577.png"
    },
    {
      "aliases": [""],
      "name": "dad",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/dad.png"
    },
    {
      "aliases": [""],
      "name": "daijoubu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/daijoubu.png"
    },
    {
      "aliases": [""],
      "name": "daijoubu_ask",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/daijoubu_ask.png"
    },
    {
      "aliases": [],
      "name": "daijyoubuda_mondainai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/daijyoubuda_mondainai.png"
    },
    {
      "aliases": [""],
      "name": "daikansya",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/daikansya.png"
    },
    {
      "aliases": [""],
      "name": "daisuki",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/daisuki.png"
    },
    {
      "aliases": ["who", "だれ", "誰"],
      "name": "dare",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/dare.png"
    },
    {
      "aliases": [""],
      "name": "darega_umaikotoieto",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/darega_umaikotoieto.png"
    },
    {
      "aliases": [],
      "name": "darenimo_aisarenai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/darenimo_aisarenai.png"
    },
    {
      "aliases": [""],
      "name": "datou_corona",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/datou_corona.png"
    },
    {
      "aliases": [""],
      "name": "debobigego",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/debobigego.png"
    },
    {
      "aliases": ["できぬ"],
      "name": "dekinu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/dekinu.png"
    },
    {
      "aliases": ["できる"],
      "name": "dekiru",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/dekiru.png"
    },
    {
      "aliases": [""],
      "name": "desho",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/desho.png"
    },
    {
      "aliases": [""],
      "name": "desu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/desu.png"
    },
    {
      "aliases": ["ですわよ"],
      "name": "desuwayo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/desuwayo.png"
    },
    {
      "aliases": [
        "アッアラララァアアァ",
        "あっあらららぁああぁ",
        "axtuarararaaxaaaxa",
        ""
      ],
      "name": "diggy_a",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/diggy_a.png"
    },
    {
      "aliases": [""],
      "name": "doihii",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/doihii.png"
    },
    {
      "aliases": [""],
      "name": "dokidoki",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/dokidoki.png"
    },
    {
      "aliases": ["tabunugokutoomoukara_riri-su_shiyouze", "release"],
      "name": "done_is_better_than_perfect",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/done_is_better_than_perfect.png"
    },
    {
      "aliases": [""],
      "name": "donmai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/donmai.png"
    },
    {
      "aliases": [""],
      "name": "dosi_1",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/dosi_1.png"
    },
    {
      "aliases": [""],
      "name": "dosi_2",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/dosi_2.png"
    },
    {
      "aliases": [""],
      "name": "douita",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/douita.png"
    },
    {
      "aliases": [""],
      "name": "downlo_do",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/downlo_do.png"
    },
    {
      "aliases": [""],
      "name": "dyomero",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/dyomero.png"
    },
    {
      "aliases": [
        "えっちコンロ点火！",
        "えっちこんろてんか",
        "ecchikonrotenka",
        "ecchi_stove_fire"
      ],
      "name": "ecchi_konro_tenka",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/misskey/c4b66f07-0920-40b1-a0e8-afacaf9507ed.png"
    },
    {
      "aliases": [""],
      "name": "ee",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ee.png"
    },
    {
      "aliases": ["ええやん"],
      "name": "eeyan_2",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/eeyan_2.png"
    },
    {
      "aliases": [""],
      "name": "erajan",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/erajan.png"
    },
    {
      "aliases": [""],
      "name": "eroit",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/eroit.png"
    },
    {
      "aliases": ["えろじゃん", "erozyann", "jp", "エロじゃん"],
      "name": "erojan",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/erojan.png"
    },
    {
      "aliases": [],
      "name": "ete",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ete.png"
    },
    {
      "aliases": [],
      "name": "ete_fuete",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ete_fuete.png"
    },
    {
      "aliases": [""],
      "name": "everyday_behavior",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/everyday_behavior.png"
    },
    {
      "aliases": ["偽", "ぎ", "ギ", "gi"],
      "name": "false",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/false.png"
    },
    {
      "aliases": [""],
      "name": "fruit_megamori_ynts",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/fruit_megamori_ynts.jpeg"
    },
    {
      "aliases": [],
      "name": "fuete",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/fuete.png"
    },
    {
      "aliases": ["furyouhinn"],
      "name": "furyouhin",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/furyouhin.png"
    },
    {
      "aliases": ["げげーっ"],
      "name": "gege_ltu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/gege_ltu.png"
    },
    {
      "aliases": [],
      "name": "genbaneko_yoshi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/genbaneko_yoshi.png"
    },
    {
      "aliases": [""],
      "name": "gomamayo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/gomamayo.png"
    },
    {
      "aliases": ["ごめんね"],
      "name": "gomenne",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/gomenne.png"
    },
    {
      "aliases": [""],
      "name": "go_study",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/go_study.png"
    },
    {
      "aliases": ["shigoto_shiro"],
      "name": "go_work",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/go_work.png"
    },
    {
      "aliases": [""],
      "name": "gyafun",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/gyafun.png"
    },
    {
      "aliases": ["逆だったかもしれねェ"],
      "name": "gyakudatta_kamo_shirenee",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/gyakudatta_kamo_shirenee.png"
    },
    {
      "aliases": [""],
      "name": "gyoi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/gyoi.png"
    },
    {
      "aliases": [],
      "name": "haccp_approved",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/haccp_approved.png"
    },
    {
      "aliases": [],
      "name": "haccp_non_approved",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/haccp_non_approved.png"
    },
    {
      "aliases": [""],
      "name": "hai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/hai.png"
    },
    {
      "aliases": ["迫真", "はくしん", "hakusin"],
      "name": "hakushin",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/hakushin.png"
    },
    {
      "aliases": ["sale"],
      "name": "hangaku",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/hangaku.png"
    },
    {
      "aliases": [],
      "name": "hanko_sumi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/hanko_sumi.png"
    },
    {
      "aliases": [],
      "name": "ha_q",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ha_q.png"
    },
    {
      "aliases": ["ヘイトスピーチ"],
      "name": "hate_speech",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/hate_speech.gif"
    },
    {
      "aliases": [""],
      "name": "hayai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/hayai.png"
    },
    {
      "aliases": [],
      "name": "hayasugite_mienai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/hayasugite_mienai.png"
    },
    {
      "aliases": ["丙", "へい", "hei", "hee", ""],
      "name": "hei",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/hei.png"
    },
    {
      "aliases": [""],
      "name": "heiomachi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/heiomachi.png"
    },
    {
      "aliases": ["hennkinn"],
      "name": "henkin",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/henkin.png"
    },
    {
      "aliases": ["hennpinn"],
      "name": "henpin",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/henpin.png"
    },
    {
      "aliases": [],
      "name": "hikaru_heart",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/hikaru_heart.png"
    },
    {
      "aliases": [],
      "name": "hires_spatial_pressure",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/hires_spatial_pressure.png"
    },
    {
      "aliases": [""],
      "name": "hiroukonpaira",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/hiroukonpaira.png"
    },
    {
      "aliases": [],
      "name": "ho",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ho.png"
    },
    {
      "aliases": [""],
      "name": "honi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/honi.png"
    },
    {
      "aliases": ["自分で調べろ", "じぶんでしらべろ", "ggrks", ""],
      "name": "honi_jibunndeshirabero",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/honi_jibunndeshirabero.png"
    },
    {
      "aliases": [""],
      "name": "honmaka",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/honmaka.png"
    },
    {
      "aliases": [""],
      "name": "honmaya",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/honmaya.png"
    },
    {
      "aliases": [
        "ほんわかレス推奨です",
        "ほんわかれすすいしょうです",
        "honwakares_suisyoudesu",
        "honwakaresusuishoudesu",
        "honwaka",
        "suisyou"
      ],
      "name": "honwaka_res_suisyou_desu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/misskey/webpublic-689e3213-6d78-4419-a9c6-4eea921d1fb3.png"
    },
    {
      "aliases": [""],
      "name": "hou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/hou.png"
    },
    {
      "aliases": [""],
      "name": "hutomomo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/hutomomo.png"
    },
    {
      "aliases": ["いえっさー", "イエッサー"],
      "name": "iessa",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/iessa.png"
    },
    {
      "aliases": [
        "意外な共通点",
        "いがいなきょうつうてん",
        "igaina_kyoutsuuten",
        "igainakyoutsuuten",
        "igaina_kyotsuten",
        "igainakyotsuten",
        "",
        "igaina_kyoutuuten",
        "igainakyoutuuten",
        "igaina_kyotuten",
        "igainakyotuten"
      ],
      "name": "igaina_kyoutsuuten",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/misskey/57dc8f75-203e-414c-a0d4-f11208c147ba.png"
    },
    {
      "aliases": [""],
      "name": "iizo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/iizo.png"
    },
    {
      "aliases": [],
      "name": "ijo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ijo.png"
    },
    {
      "aliases": [""],
      "name": "ikasune",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ikasune.png"
    },
    {
      "aliases": [],
      "name": "index_out_of_range",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/index_out_of_range.png"
    },
    {
      "aliases": [""],
      "name": "inochinokiken",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/inochinokiken.png"
    },
    {
      "aliases": [],
      "name": "internetkemutukasisaconcours",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/internetkemutukasisaconcours.png"
    },
    {
      "aliases": [""],
      "name": "io_update",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/io_update.gif"
    },
    {
      "aliases": [""],
      "name": "iovc_came",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/iovc_came.png"
    },
    {
      "aliases": [""],
      "name": "iovc_come",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/iovc_come.png"
    },
    {
      "aliases": [""],
      "name": "iovc_go",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/iovc_go.png"
    },
    {
      "aliases": ["いっぱんのごかてい"],
      "name": "ippannno_gokatei",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ippannno_gokatei.png"
    },
    {
      "aliases": [""],
      "name": "ippantekinikaimononiikutotukaretesimaimasu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ippantekinikaimononiikutotukaretesimaimasu.png"
    },
    {
      "aliases": [""],
      "name": "issue",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/issue.png"
    },
    {
      "aliases": [],
      "name": "janoute",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/janoute.png"
    },
    {
      "aliases": [],
      "name": "java_dl",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/java_dl.png"
    },
    {
      "aliases": [],
      "name": "jigatiisasugitemienai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/jigatiisasugitemienai.png"
    },
    {
      "aliases": [],
      "name": "jinsei",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/jinsei.png"
    },
    {
      "aliases": [""],
      "name": "jinseikan_kawaruyo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/jinseikan_kawaruyo.png"
    },
    {
      "aliases": ["zisseki_kaizyo"],
      "name": "jisseki_kaijyo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/jisseki_kaijyo.png"
    },
    {
      "aliases": [
        "zisyushite",
        "jisyusite",
        "zisyusite",
        "自首して",
        "じしゅして"
      ],
      "name": "jisyushite",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/jisyushite.png"
    },
    {
      "aliases": ["しょく", "職"],
      "name": "job",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/job.png"
    },
    {
      "aliases": [""],
      "name": "jouhourouei",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/jouhourouei.png"
    },
    {
      "aliases": [""],
      "name": "jouhouryuushitsu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/jouhouryuushitsu.png"
    },
    {
      "aliases": [""],
      "name": "joule_netsu_de_jurultu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/joule_netsu_de_jurultu.png"
    },
    {
      "aliases": [""],
      "name": "kaeritai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kaeritai.png"
    },
    {
      "aliases": [""],
      "name": "kaeroune",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kaeroune.png"
    },
    {
      "aliases": [""],
      "name": "kakedasanai_engineer",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kakedasanai_engineer.jpeg"
    },
    {
      "aliases": [""],
      "name": "kakkoii",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kakkoii.png"
    },
    {
      "aliases": [""],
      "name": "kami",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kami.png"
    },
    {
      "aliases": [""],
      "name": "kami_desukedo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kami_desukedo.png"
    },
    {
      "aliases": [""],
      "name": "kamo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kamo.png"
    },
    {
      "aliases": ["完売", "かんばい", "kanbai", "kannbai"],
      "name": "kanbai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kanbai.png"
    },
    {
      "aliases": [""],
      "name": "kanjouganai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kanjouganai.png"
    },
    {
      "aliases": [""],
      "name": "kashiko_marihachi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kashiko_marihachi.png"
    },
    {
      "aliases": [""],
      "name": "kawaiii",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kawaiii.png"
    },
    {
      "aliases": [],
      "name": "kawaiine",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kawaiine.png"
    },
    {
      "aliases": [""],
      "name": "kiaide_nantoka_shiro",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kiaide_nantoka_shiro.png"
    },
    {
      "aliases": [],
      "name": "kimitatchi_mounenasai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kimitatchi_mounenasai.png"
    },
    {
      "aliases": ["気にすんな", "きにすんな"],
      "name": "kinisunna",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kinisunna.png"
    },
    {
      "aliases": ["choudo", "tyoudo", "kirashiteta"],
      "name": "kirasiteta",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kirasiteta.png"
    },
    {
      "aliases": ["きたない", "汚い"],
      "name": "kitanai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kitanai.png"
    },
    {
      "aliases": [""],
      "name": "kitanyo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kitanyo.png"
    },
    {
      "aliases": [""],
      "name": "koippoikoto_siyouzele",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/koippoikoto_siyouzele.png"
    },
    {
      "aliases": [],
      "name": "koke",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/koke.png"
    },
    {
      "aliases": ["burger", "こけ", "苔"],
      "name": "koke_burger",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/koke_burger.png"
    },
    {
      "aliases": [],
      "name": "kolonyanyachiwala",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kolonyanyachiwala.png"
    },
    {
      "aliases": [""],
      "name": "konyanyachiwa",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/konyanyachiwa.png"
    },
    {
      "aliases": [""],
      "name": "koreha_tukaesou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/koreha_tukaesou.png"
    },
    {
      "aliases": [""],
      "name": "koresuki",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/koresuki.png"
    },
    {
      "aliases": ["甲", "こう", "koo", "ko"],
      "name": "kou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kou.png"
    },
    {
      "aliases": ["こうこくのしな", "広告の品"],
      "name": "koukokunoshina",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/koukokunoshina.png"
    },
    {
      "aliases": [],
      "name": "kowai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kowai.png"
    },
    {
      "aliases": ["こゃんぷっぷー"],
      "name": "koyanpuppu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/misskey/875b752a-8f27-4f2a-91a3-cecde3e1dca3.png"
    },
    {
      "aliases": ["lol", "grass"],
      "name": "kusa",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kusa.png"
    },
    {
      "aliases": [],
      "name": "kusyami_deta",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/kusyami_deta.png"
    },
    {
      "aliases": [""],
      "name": "lgtm",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/lgtm.png"
    },
    {
      "aliases": [],
      "name": "maanantekoto",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/maanantekoto.png"
    },
    {
      "aliases": [""],
      "name": "mada",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mada.png"
    },
    {
      "aliases": [""],
      "name": "majikayo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/majikayo.png"
    },
    {
      "aliases": [""],
      "name": "majisuka",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/majisuka.png"
    },
    {
      "aliases": ["まことに", "おっしゃる", "とおりですわ", "誠に", "通りですわ"],
      "name": "makotoniossharutooridesuwa",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/makotoniossharutooridesuwa.png"
    },
    {
      "aliases": [""],
      "name": "makotonokansha",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/makotonokansha.png"
    },
    {
      "aliases": [""],
      "name": "mama",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mama.png"
    },
    {
      "aliases": [],
      "name": "matakayo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/matakayo.png"
    },
    {
      "aliases": [""],
      "name": "matareyo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/matareyo.png"
    },
    {
      "aliases": [],
      "name": "mazide",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mazide.png"
    },
    {
      "aliases": [""],
      "name": "meigen",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/meigen.png"
    },
    {
      "aliases": [""],
      "name": "meijitsutomonitaikin",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/meijitsutomonitaikin.gif"
    },
    {
      "aliases": [""],
      "name": "meijitsutomonityahan",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/meijitsutomonityahan.gif"
    },
    {
      "aliases": ["mei2"],
      "name": "meimei",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/meimei.png"
    },
    {
      "aliases": [],
      "name": "mendou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mendou.png"
    },
    {
      "aliases": [""],
      "name": "midyomidyo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/midyomidyo.png"
    },
    {
      "aliases": [],
      "name": "mimige",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mimige.png"
    },
    {
      "aliases": ["everyone_is_here", "minnna_kokoniiru"],
      "name": "minna_kokoniiru",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/misskey/44b0cb9b-fe83-49da-92c1-37754e9970f7.png"
    },
    {
      "aliases": [
        "ミス廃",
        "みすはい",
        "mishai",
        "misshai",
        "misskey_addict",
        "ミスキー廃人",
        "みすきーはいじん"
      ],
      "name": "misuhai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/misuhai.gif"
    },
    {
      "aliases": [""],
      "name": "mitsu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mitsu.png"
    },
    {
      "aliases": [""],
      "name": "mitsu_desu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mitsu_desu.png"
    },
    {
      "aliases": [""],
      "name": "mochimochi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mochimochi.png"
    },
    {
      "aliases": ["燃えそう", "萌えそう", "もえそう"],
      "name": "moesou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/moesou.png"
    },
    {
      "aliases": [""],
      "name": "mofumofu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mofumofu.png"
    },
    {
      "aliases": [""],
      "name": "mog",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mog.png"
    },
    {
      "aliases": [],
      "name": "mogesou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mogesou.png"
    },
    {
      "aliases": ["文字化け"],
      "name": "mojibake",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mojibake.png"
    },
    {
      "aliases": ["もれそう"],
      "name": "moresou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/moresou.png"
    },
    {
      "aliases": [],
      "name": "motto",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/motto.png"
    },
    {
      "aliases": [],
      "name": "mou3jidashi_daisanjittekanji",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mou3jidashi_daisanjittekanji.png"
    },
    {
      "aliases": [],
      "name": "mouissyoniha_ikenai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mouissyoniha_ikenai.png"
    },
    {
      "aliases": [],
      "name": "mukityoueki",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mukityoueki.png"
    },
    {
      "aliases": [""],
      "name": "mumei",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mumei.png"
    },
    {
      "aliases": [""],
      "name": "murishinaide",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/murishinaide.png"
    },
    {
      "aliases": [""],
      "name": "murishite",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/murishite.png"
    },
    {
      "aliases": [""],
      "name": "mushiru",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/mushiru.png"
    },
    {
      "aliases": ["むすめ", "娘"],
      "name": "musume",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/musume.png"
    },
    {
      "aliases": [],
      "name": "nai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nai.png"
    },
    {
      "aliases": [],
      "name": "nainai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nainai.png"
    },
    {
      "aliases": [""],
      "name": "namennayo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/namennayo.png"
    },
    {
      "aliases": [""],
      "name": "nandato",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nandato.png"
    },
    {
      "aliases": ["なんですの"],
      "name": "nandesuno",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nandesuno.png"
    },
    {
      "aliases": [""],
      "name": "nanikore",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nanikore.png"
    },
    {
      "aliases": [""],
      "name": "naniwoitteru_nokawakarimase_n",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/naniwoitteru_nokawakarimase_n.png"
    },
    {
      "aliases": [""],
      "name": "nanodesu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nanodesu.png"
    },
    {
      "aliases": [""],
      "name": "nantokashiro",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nantokashiro.png"
    },
    {
      "aliases": ["なぬ", "what"],
      "name": "nanu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nanu.png"
    },
    {
      "aliases": [""],
      "name": "naruhodo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/naruhodo.png"
    },
    {
      "aliases": ["夏", "なつ", "natu"],
      "name": "natsu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/misskey/5a52b471-765a-4264-a95f-c823aef1132a.png"
    },
    {
      "aliases": [""],
      "name": "nayomiya",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nayomiya.png"
    },
    {
      "aliases": [""],
      "name": "nazo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nazo.png"
    },
    {
      "aliases": [""],
      "name": "nekochan",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nekochan.png"
    },
    {
      "aliases": [""],
      "name": "nekojan",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nekojan.png"
    },
    {
      "aliases": [],
      "name": "nemu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nemu.png"
    },
    {
      "aliases": ["ネムイわよ!!", "ねむい"],
      "name": "nemuiwayo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nemuiwayo.png"
    },
    {
      "aliases": [],
      "name": "nenaito_shinu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nenaito_shinu.png"
    },
    {
      "aliases": [],
      "name": "neru",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/neru.png"
    },
    {
      "aliases": ["ねっとでしんじつ"],
      "name": "netdeshinjitsu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/netdeshinjitsu.png"
    },
    {
      "aliases": [],
      "name": "niconico_choukaigi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/niconico_choukaigi.png"
    },
    {
      "aliases": [],
      "name": "niconico_namahousou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/niconico_namahousou.png"
    },
    {
      "aliases": [
        "肉うどんにも",
        "にくうどんにも",
        "nikuudonnimo",
        "with_nikuudon_too"
      ],
      "name": "nikuudon_nimo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nikuudon_nimo.png"
    },
    {
      "aliases": [""],
      "name": "ningen_desukedo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ningen_desukedo.png"
    },
    {
      "aliases": [""],
      "name": "nurashitemo_nakanaide",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/nurashitemo_nakanaide.png"
    },
    {
      "aliases": [""],
      "name": "ochitsuke",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ochitsuke.png"
    },
    {
      "aliases": [""],
      "name": "odaijini",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/odaijini.png"
    },
    {
      "aliases": [
        "インジェラ",
        "injera",
        "オフチョベットしたテフをマブガッドしてリットにします",
        "おふちょべっとしたてふをまぐがっどしてりっとにします",
        "ohutyobetto_sita_tehu_wo_mabugaddo_site_ritto_ni_simasu",
        "ofuchobetto_shita_tefu_wo_mabugaddo_shite_ritto_ni_shimasu"
      ],
      "name": "ofuchobetto_shita_tefu_wo_mabugaddo_shite_ritto_ni_shimasu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/misskey/8521cbe7-8cb5-4c50-afda-191e48a9964b.png"
    },
    {
      "aliases": [""],
      "name": "oh",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/oh.png"
    },
    {
      "aliases": [""],
      "name": "ohayou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ohayou.png"
    },
    {
      "aliases": [],
      "name": "ohayougozaimasen",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ohayougozaimasen.gif"
    },
    {
      "aliases": [""],
      "name": "ohayougozaimasu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ohayougozaimasu.gif"
    },
    {
      "aliases": [""],
      "name": "ojiichan",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ojiichan.png"
    },
    {
      "aliases": ["おかえり", "お帰り"],
      "name": "okaeri",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/okaeri.png"
    },
    {
      "aliases": [""],
      "name": "okometabenasai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/okometabenasai.png"
    },
    {
      "aliases": ["お前", "おまえ", "jp"],
      "name": "omae",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/omae.png"
    },
    {
      "aliases": [
        "omaegatsukure",
        "omaegatukure",
        "お前が作れ",
        "おまえがつくれ",
        "jp"
      ],
      "name": "omae_ga_tsukure",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/omae_ga_tsukure.png"
    },
    {
      "aliases": [],
      "name": "omaegawarui",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/omaegawarui.png"
    },
    {
      "aliases": ["congrats", "congratulation"],
      "name": "omedetou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/omedetou.png"
    },
    {
      "aliases": [""],
      "name": "onaka_pekosugi_no_kei",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/onaka_pekosugi_no_kei.png"
    },
    {
      "aliases": [],
      "name": "oneechan",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/oneechan.png"
    },
    {
      "aliases": [],
      "name": "oniichan",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/oniichan.png"
    },
    {
      "aliases": ["俺", "おれ", "オレ"],
      "name": "ore",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ore.png"
    },
    {
      "aliases": [],
      "name": "oregawarui",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/oregawarui.png"
    },
    {
      "aliases": [
        "俺をサーバーにしてくれ",
        "おれをさーばーにしてくれ",
        "orewo_server_ni_shitekure",
        "turn_me_into_a_server"
      ],
      "name": "orewo_server_ni_sitekure",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/misskey/389728f0-5752-4ce3-a54f-b397b1f325e7.png"
    },
    {
      "aliases": ["推し", "おし", "oshi"],
      "name": "osi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/misskey/61a76401-de7b-4e4a-9a91-748fdecf0cd8.png"
    },
    {
      "aliases": ["おそすぎてみえっぱなし", "遅すぎて見えっぱなし"],
      "name": "ososugite_mieppanashi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ososugite_mieppanashi.png"
    },
    {
      "aliases": ["乙", "おつ", "otu"],
      "name": "otsu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/otsu.png"
    },
    {
      "aliases": [""],
      "name": "otukaresama",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/otukaresama.png"
    },
    {
      "aliases": [""],
      "name": "oyurushikudasai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/oyurushikudasai.png"
    },
    {
      "aliases": ["パクパクですわ！", "ぱくぱくですわ！", "jp"],
      "name": "pakupakudesuwa",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/pakupakudesuwa.png"
    },
    {
      "aliases": [""],
      "name": "pan_jan",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/pan_jan.png"
    },
    {
      "aliases": [],
      "name": "pc",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/pc.png"
    },
    {
      "aliases": [""],
      "name": "pecchintosh",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/pecchintosh.png"
    },
    {
      "aliases": ["ペコイわよ!!", "ぺこい"],
      "name": "pekoiwayo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/pekoiwayo.png"
    },
    {
      "aliases": ["ほーん", "ホーン"],
      "name": "phon",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/phon.png"
    },
    {
      "aliases": [],
      "name": "pojittelibu_sunao_keikakusei",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/pojittelibu_sunao_keikakusei.png"
    },
    {
      "aliases": [""],
      "name": "ponkotsu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ponkotsu.png"
    },
    {
      "aliases": ["落選", "らくせん"],
      "name": "rakusen",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/rakusen.png"
    },
    {
      "aliases": [],
      "name": "reino_are",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/reino_are.png"
    },
    {
      "aliases": [""],
      "name": "ryoukai_shinnpann",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/ryoukai_shinnpann.png"
    },
    {
      "aliases": [""],
      "name": "s",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/s.png"
    },
    {
      "aliases": [""],
      "name": "sasuga",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/sasuga.png"
    },
    {
      "aliases": [""],
      "name": "sasuga_neet",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/sasuga_neet.png"
    },
    {
      "aliases": [""],
      "name": "sekiro_death",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/sekiro_death.png"
    },
    {
      "aliases": [""],
      "name": "setafunyo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/setafunyo.png"
    },
    {
      "aliases": [],
      "name": "seyana",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/seyana.png"
    },
    {
      "aliases": [""],
      "name": "shark_syukka",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/shark_syukka.png"
    },
    {
      "aliases": [],
      "name": "shigoto",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/shigoto.png"
    },
    {
      "aliases": ["しかかたん", "しか勝たん"],
      "name": "shikakatan",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/shikakatan.png"
    },
    {
      "aliases": ["sikei", "しけい", "死刑"],
      "name": "shikei",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/shikei.png"
    },
    {
      "aliases": [],
      "name": "shikkouyuuyo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/shikkouyuuyo.png"
    },
    {
      "aliases": ["sinkan"],
      "name": "shinkan_erodesu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/shinkan_erodesu.png"
    },
    {
      "aliases": ["sinkan_otosita"],
      "name": "shinkan_otoshita",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/shinkan_otoshita.png"
    },
    {
      "aliases": ["知れてえらい", "しれてえらい", "sireteerai", "shireteerai"],
      "name": "shirete_erai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/shirete_erai.png"
    },
    {
      "aliases": [""],
      "name": "shitenainoha_omaedake",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/shitenainoha_omaedake.png"
    },
    {
      "aliases": ["syoppu", "ショップ", "しょっぷ"],
      "name": "shop",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/shop.png"
    },
    {
      "aliases": [""],
      "name": "shou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/shou.png"
    },
    {
      "aliases": ["しゅき", "syuki"],
      "name": "shuki_heart",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/misskey/60b39903-8908-4ab6-a71a-056c40aa18ac.png"
    },
    {
      "aliases": ["しゅぷしゅぷ", "温野菜"],
      "name": "shupushupuonyasai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/shupushupuonyasai.png"
    },
    {
      "aliases": ["shinngikyohi"],
      "name": "sinngikyohi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/sinngikyohi.png"
    },
    {
      "aliases": [""],
      "name": "social_distance",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/social_distance.png"
    },
    {
      "aliases": [""],
      "name": "sokoni_attemo_naidesune",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/sokoni_attemo_naidesune.png"
    },
    {
      "aliases": [""],
      "name": "sokoni_nakereba_naidesune",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/sokoni_nakereba_naidesune.png"
    },
    {
      "aliases": [""],
      "name": "sonokanouseiwaaru",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/sonokanouseiwaaru.png"
    },
    {
      "aliases": [],
      "name": "sore_575",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/sore_575.png"
    },
    {
      "aliases": [],
      "name": "sorehasou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/sorehasou.png"
    },
    {
      "aliases": ["そうだそうだ"],
      "name": "soudasouda",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/soudasouda.png"
    },
    {
      "aliases": ["そうはならんやろ"],
      "name": "souhanaranyaro",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/souhanaranyaro.png"
    },
    {
      "aliases": [],
      "name": "souiugamezyaneekara_kore",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/souiugamezyaneekara_kore.png"
    },
    {
      "aliases": [],
      "name": "souiuhimoaru",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/souiuhimoaru.png"
    },
    {
      "aliases": [],
      "name": "souiukoto",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/souiukoto.png"
    },
    {
      "aliases": [],
      "name": "souiutokimoaru",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/souiutokimoaru.png"
    },
    {
      "aliases": [],
      "name": "souiutokoyazo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/souiutokoyazo.png"
    },
    {
      "aliases": [],
      "name": "souiutoshigoro",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/souiutoshigoro.png"
    },
    {
      "aliases": ["そうかも"],
      "name": "soukamo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/soukamo.png"
    },
    {
      "aliases": ["そうおもう", "think_so"],
      "name": "souomou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/souomou.png"
    },
    {
      "aliases": ["なっとるやろがい", "nattoruyarogai"],
      "name": "stamp_nattoruyarogai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/stamp_nattoruyarogai.png"
    },
    {
      "aliases": ["nemui", "眠い", "ねむい"],
      "name": "stamp_nemui",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/stamp_nemui.png"
    },
    {
      "aliases": ["おいパイ食わねぇか", "oipaikuwaneleka"],
      "name": "stamp_pie",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/stamp_pie.png"
    },
    {
      "aliases": [],
      "name": "stamp_pie_bug",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/stamp_pie_bug.png"
    },
    {
      "aliases": [""],
      "name": "str_hametsu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/str_hametsu.png"
    },
    {
      "aliases": [""],
      "name": "strings_validation_error",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/strings_validation_error.png"
    },
    {
      "aliases": ["すごい"],
      "name": "sugoi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/sugoi.png"
    },
    {
      "aliases": [""],
      "name": "suibotsu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/suibotsu.png"
    },
    {
      "aliases": [],
      "name": "sukebe",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/sukebe.png"
    },
    {
      "aliases": ["すけべ!", "すけべ！"],
      "name": "sukebe_2",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/sukebe_2.png"
    },
    {
      "aliases": ["sapo-tosennta-"],
      "name": "support_center",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/support_center.png"
    },
    {
      "aliases": [""],
      "name": "syo_ga_nai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/syo_ga_nai.png"
    },
    {
      "aliases": [],
      "name": "syuuri",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/syuuri.png"
    },
    {
      "aliases": [""],
      "name": "taikin",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/taikin.png"
    },
    {
      "aliases": [""],
      "name": "take_a_break",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/take_a_break.png"
    },
    {
      "aliases": ["tako", "たこ", "タコ", "octopus"],
      "name": "tako",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/tako.png"
    },
    {
      "aliases": [],
      "name": "takosune",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/takosune.png"
    },
    {
      "aliases": [""],
      "name": "tameninattane",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/tameninattane.png"
    },
    {
      "aliases": [],
      "name": "taninnokotobaja_dame",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/taninnokotobaja_dame.png"
    },
    {
      "aliases": [],
      "name": "tanoshisou",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/tanoshisou.png"
    },
    {
      "aliases": ["タピオカナタデココラーメン"],
      "name": "tapioca_natadecoco_ramen",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/tapioca_natadecoco_ramen.png"
    },
    {
      "aliases": ["reiwa"],
      "name": "tapioka",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/tapioka.png"
    },
    {
      "aliases": [""],
      "name": "tasukete",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/tasukete.png"
    },
    {
      "aliases": [""],
      "name": "tehepero",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/tehepero.png"
    },
    {
      "aliases": ["グリルでグリッ", "gurirudeguri", "ぐりるでぐりっ"],
      "name": "t_grill_de_gri",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/t_grill_de_gri.png"
    },
    {
      "aliases": [],
      "name": "thaikick",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/thaikick.png"
    },
    {
      "aliases": [""],
      "name": "t_heyakata",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/t_heyakata.png"
    },
    {
      "aliases": [],
      "name": "t_hodai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/t_hodai.png"
    },
    {
      "aliases": ["知見", "ちけん", "chiken", "tomomi"],
      "name": "tiken",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/tiken.png"
    },
    {
      "aliases": ["色々やばい", "いろいろやばい"],
      "name": "t_iroiroyabai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/t_iroiroyabai.png"
    },
    {
      "aliases": ["今日の破壊", "きょうのはかい", "kyounohakai", "kyonohakai"],
      "name": "today_break",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/today_break.png"
    },
    {
      "aliases": [""],
      "name": "t_ofuton",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/t_ofuton.png"
    },
    {
      "aliases": ["おいしい", "oisii"],
      "name": "t_oishii",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/t_oishii.png"
    },
    {
      "aliases": ["とくしゅ", "トクシュ", "tokusyu"],
      "name": "tokushu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/tokushu.png"
    },
    {
      "aliases": [
        "emoji",
        "gyakukarayondemo",
        "ぎゃくからよんでも",
        "かいぶん",
        "にほんご"
      ],
      "name": "tomato",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/tomato.png"
    },
    {
      "aliases": [""],
      "name": "tomimya",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/tomimya.png"
    },
    {
      "aliases": ["ぴろぴろ", "ピロピロ"],
      "name": "t_piropiro",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/t_piropiro.apng"
    },
    {
      "aliases": [""],
      "name": "translate",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/translate.png"
    },
    {
      "aliases": ["とろじゃん", "torojan"],
      "name": "trojan",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/trojan.png"
    },
    {
      "aliases": ["sin", "shin", "まこと", "ま", "しん", ""],
      "name": "true",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/true.png"
    },
    {
      "aliases": ["つよい", "tuyoi"],
      "name": "tsuyoi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/tsuyoi.png"
    },
    {
      "aliases": ["つらたん", "tsuratan", "turatan"],
      "name": "t_tsuratan",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/t_tsuratan.png"
    },
    {
      "aliases": ["wakutin", "ワクチン"],
      "name": "t_vaccine",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/t_vaccine.png"
    },
    {
      "aliases": [""],
      "name": "t_wakarimitaro",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/t_wakarimitaro.png"
    },
    {
      "aliases": ["slack", "ちょくせつはなした", "chokusetsu"],
      "name": "tyokusetu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/tyokusetu.png"
    },
    {
      "aliases": ["違憲", "いけん", "ikenn"],
      "name": "unconstitutionality",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/unconstitutionality.png"
    },
    {
      "aliases": [],
      "name": "utsu",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/utsu.png"
    },
    {
      "aliases": [],
      "name": "utsukushii",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/utsukushii.png"
    },
    {
      "aliases": [""],
      "name": "vnn",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/vnn.png"
    },
    {
      "aliases": [""],
      "name": "vun",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/vun.png"
    },
    {
      "aliases": [],
      "name": "wakarimi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/wakarimi.png"
    },
    {
      "aliases": [],
      "name": "wakatte",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/wakatte.png"
    },
    {
      "aliases": [""],
      "name": "wakuwaku",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/wakuwaku.png"
    },
    {
      "aliases": ["わたくしだってそうですわ", "watakusidattesoudesuwa"],
      "name": "watakushidattesoudesuwa",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/watakushidattesoudesuwa.png"
    },
    {
      "aliases": [""],
      "name": "watashi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/watashi.png"
    },
    {
      "aliases": [""],
      "name": "what_is",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/what_is.png"
    },
    {
      "aliases": [""],
      "name": "what_is_mrhc",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/what_is_mrhc.png"
    },
    {
      "aliases": ["omhnc"],
      "name": "what_is_omhnc",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/what_is_omhnc.png"
    },
    {
      "aliases": [],
      "name": "wikipedia_wo_wiki_tte_ryakusuna",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/wikipedia_wo_wiki_tte_ryakusuna.png"
    },
    {
      "aliases": ["yavai"],
      "name": "yabai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/yabai.png"
    },
    {
      "aliases": ["ヤバい", "やばい"],
      "name": "yabaidesukoto",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/yabaidesukoto.png"
    },
    {
      "aliases": ["やばい", "ヤバい"],
      "name": "yabaidesuwa",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/yabaidesuwa.png"
    },
    {
      "aliases": [],
      "name": "yabaiwayo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/yabaiwayo.png"
    },
    {
      "aliases": [],
      "name": "yakinikunotare",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/yakinikunotare.png"
    },
    {
      "aliases": ["やめたれ"],
      "name": "yametare",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/yametare.png"
    },
    {
      "aliases": [""],
      "name": "yareyare",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/yareyare.png"
    },
    {
      "aliases": [],
      "name": "yarukiga_denai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/yarukiga_denai.png"
    },
    {
      "aliases": [""],
      "name": "yattane",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/yattane.png"
    },
    {
      "aliases": ["やったれ"],
      "name": "yattare",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/yattare.png"
    },
    {
      "aliases": [""],
      "name": "yonutiwo",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/yonutiwo.png"
    },
    {
      "aliases": ["please", "よろしく", "おねがいします", "お願いします"],
      "name": "yorosiku_onegai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/yorosiku_onegai.png"
    },
    {
      "aliases": [],
      "name": "yumei",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/yumei.png"
    },
    {
      "aliases": [""],
      "name": "yurushite_kamisama",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/yurushite_kamisama.png"
    },
    {
      "aliases": ["是非", "ぜひ", "jp"],
      "name": "zehi",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/zehi.png"
    },
    {
      "aliases": [],
      "name": "_zhhwe7eo_",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/_zhhwe7eo_.png"
    },
    {
      "aliases": ["ずるい"],
      "name": "zurui",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/zurui.png"
    },
    {
      "aliases": [],
      "name": "zutsuuga_itai",
      "category": "Letters/Japanese",
      "url": "https://s3.arkjp.net/emoji/zutsuuga_itai.png"
    },
    {
      "aliases": [
        "5000",
        "ごせんちょうえんほしい",
        "5000兆円欲しい！",
        "欲しい",
        "hosii",
        "hoshii",
        "ほしい",
        "want",
        "5000cho",
        "yen"
      ],
      "name": "5000chouen_hoshii",
      "category": "Letters/Japanese/5000",
      "url": "https://s3.arkjp.net/emoji/5000chouen_hoshii.png"
    },
    {
      "aliases": [
        "5000",
        "ごせんえんほしい",
        "5000円欲しい！",
        "欲しい",
        "ほしい",
        "want",
        "5000yen"
      ],
      "name": "5000en_hoshii",
      "category": "Letters/Japanese/5000",
      "url": "https://s3.arkjp.net/emoji/5000en_hoshii.png"
    },
    {
      "aliases": ["shi", "si", "し"],
      "name": "5000t_death",
      "category": "Letters/Japanese/5000",
      "url": "https://s3.arkjp.net/emoji/5000t_death.png"
    },
    {
      "aliases": ["axtu"],
      "name": "altu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/altu.png"
    },
    {
      "aliases": [""],
      "name": "baltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/baltu.png"
    },
    {
      "aliases": [""],
      "name": "daltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/daltu.png"
    },
    {
      "aliases": [""],
      "name": "deltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/deltu.png"
    },
    {
      "aliases": [""],
      "name": "doltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/doltu.png"
    },
    {
      "aliases": ["extu"],
      "name": "eltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/eltu.png"
    },
    {
      "aliases": [""],
      "name": "galtu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/galtu.png"
    },
    {
      "aliases": ["gextu"],
      "name": "geltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/geltu.png"
    },
    {
      "aliases": [""],
      "name": "goltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/goltu.png"
    },
    {
      "aliases": [""],
      "name": "gultu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/gultu.png"
    },
    {
      "aliases": [""],
      "name": "haltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/haltu.png"
    },
    {
      "aliases": [""],
      "name": "heltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/heltu.png"
    },
    {
      "aliases": [""],
      "name": "hiltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/hiltu.png"
    },
    {
      "aliases": [""],
      "name": "holtu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/holtu.png"
    },
    {
      "aliases": [""],
      "name": "iltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/iltu.png"
    },
    {
      "aliases": [""],
      "name": "kaltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/kaltu.png"
    },
    {
      "aliases": [""],
      "name": "keltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/keltu.png"
    },
    {
      "aliases": [""],
      "name": "kiltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/kiltu.png"
    },
    {
      "aliases": [""],
      "name": "koltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/koltu.png"
    },
    {
      "aliases": [""],
      "name": "kultu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/kultu.png"
    },
    {
      "aliases": ["xtu"],
      "name": "ltuu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/ltuu.png"
    },
    {
      "aliases": [""],
      "name": "maltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/maltu.png"
    },
    {
      "aliases": [""],
      "name": "meltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/meltu.png"
    },
    {
      "aliases": [""],
      "name": "miltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/miltu.png"
    },
    {
      "aliases": [""],
      "name": "moltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/moltu.png"
    },
    {
      "aliases": [""],
      "name": "multu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/multu.png"
    },
    {
      "aliases": [""],
      "name": "naltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/naltu.png"
    },
    {
      "aliases": [""],
      "name": "neltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/neltu.png"
    },
    {
      "aliases": [""],
      "name": "niltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/niltu.png"
    },
    {
      "aliases": [""],
      "name": "nnltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/nnltu.png"
    },
    {
      "aliases": ["nuxtu"],
      "name": "nultu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/nultu.png"
    },
    {
      "aliases": ["oxtu"],
      "name": "oltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/oltu.png"
    },
    {
      "aliases": [""],
      "name": "pultu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/pultu.png"
    },
    {
      "aliases": [""],
      "name": "riltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/riltu.png"
    },
    {
      "aliases": [""],
      "name": "roltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/roltu.png"
    },
    {
      "aliases": [""],
      "name": "rultu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/rultu.png"
    },
    {
      "aliases": [""],
      "name": "siltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/siltu.png"
    },
    {
      "aliases": [""],
      "name": "sultu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/sultu.png"
    },
    {
      "aliases": [""],
      "name": "taltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/taltu.png"
    },
    {
      "aliases": [""],
      "name": "teltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/teltu.png"
    },
    {
      "aliases": [""],
      "name": "tiltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/tiltu.png"
    },
    {
      "aliases": [""],
      "name": "tultu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/tultu.png"
    },
    {
      "aliases": ["uxtu"],
      "name": "ultu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/ultu.png"
    },
    {
      "aliases": [""],
      "name": "waltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/waltu.png"
    },
    {
      "aliases": [""],
      "name": "yaltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/yaltu.png"
    },
    {
      "aliases": ["よっ", "ヨッ"],
      "name": "yoltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/yoltu.png"
    },
    {
      "aliases": [""],
      "name": "yultu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/yultu.png"
    },
    {
      "aliases": [""],
      "name": "zoltu",
      "category": "Letters/Japanese/オッ",
      "url": "https://s3.arkjp.net/emoji/zoltu.png"
    },
    {
      "aliases": ["大損", "おおぞん", "損", "ooson", "daison", ""],
      "name": "oozon",
      "category": "Letters/Japanese/お得",
      "url": "https://s3.arkjp.net/emoji/oozon.apng"
    },
    {
      "aliases": ["大曽根", "おおぞね"],
      "name": "oozone",
      "category": "Letters/Japanese/お得",
      "url": "https://s3.arkjp.net/emoji/oozone.png"
    },
    {
      "aliases": ["おたく", "オタク"],
      "name": "otaku",
      "category": "Letters/Japanese/お得",
      "url": "https://s3.arkjp.net/emoji/otaku.png"
    },
    {
      "aliases": ["お得", "おとく", "とく"],
      "name": "otoku",
      "category": "Letters/Japanese/お得",
      "url": "https://s3.arkjp.net/emoji/otoku.png"
    },
    {
      "aliases": ["損", "そん"],
      "name": "son",
      "category": "Letters/Japanese/お得",
      "url": "https://s3.arkjp.net/emoji/son.png"
    },
    {
      "aliases": ["ぼちぼちいこうね", "botiboti_ikoune", ""],
      "name": "bochibochi_ikoune",
      "category": "Letters/Japanese/〜しようね",
      "url": "https://s3.arkjp.net/emoji/bochibochi_ikoune.png"
    },
    {
      "aliases": [],
      "name": "mayonnaisekaketeagemashoune",
      "category": "Letters/Japanese/〜しようね",
      "url": "https://s3.arkjp.net/emoji/mayonnaisekaketeagemashoune.png"
    },
    {
      "aliases": [""],
      "name": "neyoune",
      "category": "Letters/Japanese/〜しようね",
      "url": "https://s3.arkjp.net/emoji/neyoune.png"
    },
    {
      "aliases": ["スピリタス", "入れて", "あげましょうね"],
      "name": "supiritasu_irete_agemashoune",
      "category": "Letters/Japanese/〜しようね",
      "url": "https://s3.arkjp.net/emoji/supiritasu_irete_agemashoune.png"
    },
    {
      "aliases": ["そんなことあるんだ"],
      "name": "sonnakotoarunda",
      "category": "Letters/Japanese/そんな",
      "url": "https://s3.arkjp.net/emoji/sonnakotoarunda.png"
    },
    {
      "aliases": [],
      "name": "sonnakotodekinai",
      "category": "Letters/Japanese/そんな",
      "url": "https://s3.arkjp.net/emoji/sonnakotodekinai.png"
    },
    {
      "aliases": [],
      "name": "sonnakotodekirunda",
      "category": "Letters/Japanese/そんな",
      "url": "https://s3.arkjp.net/emoji/sonnakotodekirunda.png"
    },
    {
      "aliases": [],
      "name": "sonnakotodekitanda",
      "category": "Letters/Japanese/そんな",
      "url": "https://s3.arkjp.net/emoji/sonnakotodekitanda.png"
    },
    {
      "aliases": [
        "そんなこと言っていいのか",
        "そんなこといっていいのか",
        "sonnakotoitteiinoka"
      ],
      "name": "sonnakoto_itte_iinoka",
      "category": "Letters/Japanese/そんな",
      "url": "https://s3.arkjp.net/emoji/sonnakoto_itte_iinoka.png"
    },
    {
      "aliases": [""],
      "name": "sonnakotonai",
      "category": "Letters/Japanese/そんな",
      "url": "https://s3.arkjp.net/emoji/sonnakotonai.png"
    },
    {
      "aliases": ["そんなものあるんだ"],
      "name": "sonnamonoarunda",
      "category": "Letters/Japanese/そんな",
      "url": "https://s3.arkjp.net/emoji/sonnamonoarunda.png"
    },
    {
      "aliases": ["そんなのいらない", "sonnnanoiranai"],
      "name": "sonnnano_iranai",
      "category": "Letters/Japanese/そんな",
      "url": "https://s3.arkjp.net/emoji/sonnnano_iranai.png"
    },
    {
      "aliases": [],
      "name": "sonnnasoubide_daijoubuka",
      "category": "Letters/Japanese/そんな",
      "url": "https://s3.arkjp.net/emoji/sonnnasoubide_daijoubuka.png"
    },
    {
      "aliases": [],
      "name": "_a",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_a.png"
    },
    {
      "aliases": [],
      "name": "_ba",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ba.png"
    },
    {
      "aliases": [],
      "name": "_be",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_be.png"
    },
    {
      "aliases": [],
      "name": "_bi",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_bi.png"
    },
    {
      "aliases": [],
      "name": "_bo",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_bo.png"
    },
    {
      "aliases": [],
      "name": "_bu",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_bu.png"
    },
    {
      "aliases": [],
      "name": "_da",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_da.png"
    },
    {
      "aliases": [],
      "name": "_de",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_de.png"
    },
    {
      "aliases": [],
      "name": "_di",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_di.png"
    },
    {
      "aliases": [],
      "name": "_do",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_do.png"
    },
    {
      "aliases": [],
      "name": "_du",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_du.png"
    },
    {
      "aliases": [],
      "name": "_e",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_e.png"
    },
    {
      "aliases": ["_hu"],
      "name": "_fu",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_fu.png"
    },
    {
      "aliases": [],
      "name": "_ga",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ga.png"
    },
    {
      "aliases": [],
      "name": "_ge",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ge.png"
    },
    {
      "aliases": [],
      "name": "_gi",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_gi.png"
    },
    {
      "aliases": [],
      "name": "_go",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_go.png"
    },
    {
      "aliases": [],
      "name": "_gu",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_gu.png"
    },
    {
      "aliases": [],
      "name": "_ha",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ha.png"
    },
    {
      "aliases": [],
      "name": "_he",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_he.png"
    },
    {
      "aliases": [],
      "name": "_hi",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_hi.png"
    },
    {
      "aliases": [],
      "name": "_ho",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ho.png"
    },
    {
      "aliases": [],
      "name": "_i",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_i.png"
    },
    {
      "aliases": [],
      "name": "_ka",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ka.png"
    },
    {
      "aliases": [],
      "name": "_ke",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ke.png"
    },
    {
      "aliases": [],
      "name": "_ki",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ki.png"
    },
    {
      "aliases": [],
      "name": "_kka",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_kka.png"
    },
    {
      "aliases": [],
      "name": "_kkb",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_kkb.png"
    },
    {
      "aliases": [],
      "name": "_ko",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ko.png"
    },
    {
      "aliases": [],
      "name": "_ku",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ku.png"
    },
    {
      "aliases": ["_xa"],
      "name": "_la",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_la.png"
    },
    {
      "aliases": ["_xe"],
      "name": "_le",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_le.png"
    },
    {
      "aliases": ["_xi"],
      "name": "_li",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_li.png"
    },
    {
      "aliases": ["_xo"],
      "name": "_lo",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_lo.png"
    },
    {
      "aliases": ["_xtsu"],
      "name": "_ltsu",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ltsu.png"
    },
    {
      "aliases": ["_xu"],
      "name": "_lu",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_lu.png"
    },
    {
      "aliases": ["_xya"],
      "name": "_lya",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_lya.png"
    },
    {
      "aliases": ["_xyo"],
      "name": "_lyo",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_lyo.png"
    },
    {
      "aliases": ["_xyu"],
      "name": "_lyu",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_lyu.png"
    },
    {
      "aliases": [],
      "name": "_ma",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ma.png"
    },
    {
      "aliases": [],
      "name": "_maru",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_maru.png"
    },
    {
      "aliases": [],
      "name": "_me",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_me.png"
    },
    {
      "aliases": [],
      "name": "_mi",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_mi.png"
    },
    {
      "aliases": [],
      "name": "_mo",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_mo.png"
    },
    {
      "aliases": [],
      "name": "_mu",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_mu.png"
    },
    {
      "aliases": [],
      "name": "_n",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_n.png"
    },
    {
      "aliases": [],
      "name": "_na",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_na.png"
    },
    {
      "aliases": [],
      "name": "_ne",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ne.png"
    },
    {
      "aliases": [],
      "name": "_ni",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ni.png"
    },
    {
      "aliases": [],
      "name": "_no",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_no.png"
    },
    {
      "aliases": [],
      "name": "_nu",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_nu.png"
    },
    {
      "aliases": [],
      "name": "_o",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_o.png"
    },
    {
      "aliases": [],
      "name": "_pa",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_pa.png"
    },
    {
      "aliases": [],
      "name": "_pe",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_pe.png"
    },
    {
      "aliases": [],
      "name": "_pi",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_pi.png"
    },
    {
      "aliases": [],
      "name": "_po",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_po.png"
    },
    {
      "aliases": [],
      "name": "_pu",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_pu.png"
    },
    {
      "aliases": [],
      "name": "_ra",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ra.png"
    },
    {
      "aliases": [],
      "name": "_re",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_re.png"
    },
    {
      "aliases": [],
      "name": "_ri",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ri.png"
    },
    {
      "aliases": [],
      "name": "_ro",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ro.png"
    },
    {
      "aliases": [],
      "name": "_ru",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ru.png"
    },
    {
      "aliases": [],
      "name": "_sa",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_sa.png"
    },
    {
      "aliases": [],
      "name": "_se",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_se.png"
    },
    {
      "aliases": ["_si"],
      "name": "_shi",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_shi.png"
    },
    {
      "aliases": [],
      "name": "_so",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_so.png"
    },
    {
      "aliases": [],
      "name": "_su",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_su.png"
    },
    {
      "aliases": [],
      "name": "_ta",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ta.png"
    },
    {
      "aliases": [],
      "name": "_te",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_te.png"
    },
    {
      "aliases": [],
      "name": "_ten",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ten.png"
    },
    {
      "aliases": [],
      "name": "_ti",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ti.png"
    },
    {
      "aliases": [],
      "name": "_to",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_to.png"
    },
    {
      "aliases": ["_tu"],
      "name": "_tsu",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_tsu.png"
    },
    {
      "aliases": [],
      "name": "_u",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_u.png"
    },
    {
      "aliases": [],
      "name": "_wa",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_wa.png"
    },
    {
      "aliases": [],
      "name": "_wo",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_wo.png"
    },
    {
      "aliases": [],
      "name": "_ya",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ya.png"
    },
    {
      "aliases": [],
      "name": "_yo",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_yo.png"
    },
    {
      "aliases": [],
      "name": "_yu",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_yu.png"
    },
    {
      "aliases": [],
      "name": "_za",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_za.png"
    },
    {
      "aliases": [],
      "name": "_ze",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_ze.png"
    },
    {
      "aliases": [],
      "name": "_zi",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_zi.png"
    },
    {
      "aliases": [],
      "name": "_zo",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_zo.png"
    },
    {
      "aliases": [],
      "name": "_zu",
      "category": "Letters/Japanese/デコ文字",
      "url": "https://s3.arkjp.net/emoji/_zu.png"
    },
    {
      "aliases": ["ありがたいはなし", "arigatai_hanashi", "arigatai_hanasi"],
      "name": "arigataihanashi",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/misskey/0c35f75a-3eef-4b8d-b7f6-a8fbf225e1ff.gif"
    },
    {
      "aliases": ["ひどいはなし"],
      "name": "hidoihanashi",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/emoji/hidoihanashi.gif"
    },
    {
      "aliases": ["いいはなし"],
      "name": "iihanashi",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/emoji/iihanashi.gif"
    },
    {
      "aliases": ["いいはなしムーブ", "iihanashimove"],
      "name": "iihanashi_move",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/emoji/iihanashi_move.gif"
    },
    {
      "aliases": ["いいはなし中文", "好的故事"],
      "name": "iihanashi_zh",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/emoji/iihanashi_zh.gif"
    },
    {
      "aliases": ["悲しいはなし", "かなしいはなし", "kanashii_hanashi", ""],
      "name": "kanasiihanasi",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/misskey/31eda4db-a05f-4dc8-a098-0952e6fa1fe8.gif"
    },
    {
      "aliases": ["ここだけのはなし"],
      "name": "kokodakeno_hanashi",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/emoji/kokodakeno_hanashi.png"
    },
    {
      "aliases": ["こわいはなし"],
      "name": "kowaihanashi",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/emoji/kowaihanashi.gif"
    },
    {
      "aliases": ["もんだいはなし"],
      "name": "mondaihanashi",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/emoji/mondaihanashi.gif"
    },
    {
      "aliases": ["むずかしいはなし"],
      "name": "muzukashiihanashi",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/emoji/muzukashiihanashi.gif"
    },
    {
      "aliases": [
        "面白いはなし",
        "おもしろいはなし",
        "omoshiroihanashi",
        "omosiroi_hanasi",
        "omosiroihanasi"
      ],
      "name": "omoshiroi_hanashi",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/emoji/omoshiroi_hanashi.png"
    },
    {
      "aliases": ["しょうがないはなし"],
      "name": "shouganaihanashi",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/emoji/shouganaihanashi.gif"
    },
    {
      "aliases": ["すごいはなし"],
      "name": "sugoihanashi",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/emoji/sugoihanashi.gif"
    },
    {
      "aliases": ["わいのはなし"],
      "name": "wainohanashi",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/emoji/wainohanashi.png"
    },
    {
      "aliases": ["わるいはなし"],
      "name": "waruihanasi",
      "category": "Letters/Japanese/はなし",
      "url": "https://s3.arkjp.net/emoji/waruihanasi.gif"
    },
    {
      "aliases": [
        "haripota",
        "ハリポタ",
        "potter",
        "harry",
        "ハリー",
        "ポッター"
      ],
      "name": "harrypotterto",
      "category": "Letters/Japanese/ハリーポッターと",
      "url": "https://s3.arkjp.net/emoji/harrypotterto.png"
    },
    {
      "aliases": [
        "haripota",
        "ハリポタ",
        "potter",
        "harry",
        "ハリー",
        "ポッター"
      ],
      "name": "harrypottertohyougennnoziyuu",
      "category": "Letters/Japanese/ハリーポッターと",
      "url": "https://s3.arkjp.net/emoji/harrypottertohyougennnoziyuu.png"
    },
    {
      "aliases": [
        "haripota",
        "ハリポタ",
        "potter",
        "harry",
        "ハリー",
        "ポッター"
      ],
      "name": "harrypottertojunntakunasekiyushigenn",
      "category": "Letters/Japanese/ハリーポッターと",
      "url": "https://s3.arkjp.net/emoji/harrypottertojunntakunasekiyushigenn.png"
    },
    {
      "aliases": [
        "haripota",
        "ハリポタ",
        "potter",
        "harry",
        "ハリー",
        "ポッター"
      ],
      "name": "harrypottertojyuusyakaihenoakogare",
      "category": "Letters/Japanese/ハリーポッターと",
      "url": "https://s3.arkjp.net/emoji/harrypottertojyuusyakaihenoakogare.png"
    },
    {
      "aliases": [
        "haripota",
        "ハリポタ",
        "potter",
        "harry",
        "ハリー",
        "ポッター"
      ],
      "name": "harrypottertokeikakuseinonasa",
      "category": "Letters/Japanese/ハリーポッターと",
      "url": "https://s3.arkjp.net/emoji/harrypottertokeikakuseinonasa.png"
    },
    {
      "aliases": [
        "ハリーポッターと無茶な要求",
        "無茶な要求",
        "haripota",
        "ハリポタ",
        "potter",
        "harry",
        "ハリー",
        "ポッター"
      ],
      "name": "harrypottertomutyanayoukyuu",
      "category": "Letters/Japanese/ハリーポッターと",
      "url": "https://s3.arkjp.net/emoji/harrypottertomutyanayoukyuu.png"
    },
    {
      "aliases": [
        "haripota",
        "ハリポタ",
        "potter",
        "harry",
        "ハリー",
        "ポッター"
      ],
      "name": "harrypotterto_newline",
      "category": "Letters/Japanese/ハリーポッターと",
      "url": "https://s3.arkjp.net/emoji/harrypotterto_newline.png"
    },
    {
      "aliases": [
        "haripota",
        "ハリポタ",
        "potter",
        "harry",
        "ハリー",
        "ポッター"
      ],
      "name": "harrypottertoniranomisoshiru",
      "category": "Letters/Japanese/ハリーポッターと",
      "url": "https://s3.arkjp.net/emoji/harrypottertoniranomisoshiru.png"
    },
    {
      "aliases": [
        "haripota",
        "ハリポタ",
        "potter",
        "harry",
        "ハリー",
        "ポッター"
      ],
      "name": "harrypottertosennryokunotikujitounyuu",
      "category": "Letters/Japanese/ハリーポッターと",
      "url": "https://s3.arkjp.net/emoji/harrypottertosennryokunotikujitounyuu.png"
    },
    {
      "aliases": [
        "haripota",
        "ハリポタ",
        "potter",
        "harry",
        "ハリー",
        "ポッター"
      ],
      "name": "harrypottertozennti2syuukannnokega",
      "category": "Letters/Japanese/ハリーポッターと",
      "url": "https://s3.arkjp.net/emoji/harrypottertozennti2syuukannnokega.png"
    },
    {
      "aliases": [
        "haripota",
        "ハリポタ",
        "potter",
        "harry",
        "ハリー",
        "ポッター"
      ],
      "name": "harrypottertozissekinonaimusyoku",
      "category": "Letters/Japanese/ハリーポッターと",
      "url": "https://s3.arkjp.net/emoji/harrypottertozissekinonaimusyoku.png"
    },
    {
      "aliases": [
        "ようこそ",
        "welcome",
        "windows_welcome",
        "windowsxp_welcome",
        "windows_youkoso",
        "windowsxp_youkoso"
      ],
      "name": "youkoso",
      "category": "Letters/Japanese/ようこそ",
      "url": "https://s3.arkjp.net/misskey/webpublic-1c253796-7dc4-4d54-8367-ad2259693ce7.png"
    },
    {
      "aliases": [
        "レターパックで現金送れ",
        "れたーぱっくでげんきんおくれ",
        "send_money_with_letterpack"
      ],
      "name": "youkoso_send_money",
      "category": "Letters/Japanese/ようこそ",
      "url": "https://s3.arkjp.net/misskey/webpublic-4a24eb9d-e3e8-491f-b0a8-42fd2099b400.png"
    },
    {
      "aliases": ["そう", "sou"],
      "name": "youkoso_sou",
      "category": "Letters/Japanese/ようこそ",
      "url": "https://s3.arkjp.net/misskey/dd880699-84b6-4e4e-ae6e-d077f5e5adbe.png"
    },
    {
      "aliases": ["うそ", "uso", "lie"],
      "name": "youkoso_uso",
      "category": "Letters/Japanese/ようこそ",
      "url": "https://s3.arkjp.net/misskey/46f8ea40-f60e-478e-be44-819641cb8db4.png"
    },
    {
      "aliases": ["よう", "you"],
      "name": "youkoso_you",
      "category": "Letters/Japanese/ようこそ",
      "url": "https://s3.arkjp.net/misskey/4dfc6416-45d8-4601-b0fc-8304f4ec5fe7.png"
    },
    {
      "aliases": ["妹", "いもうと", "imouto", "imoto"],
      "name": "imouto2",
      "category": "Letters/Japanese/一文字",
      "url": "https://s3.arkjp.net/misskey/1cf547a3-31e8-4d3e-8817-5ce86447953a.png"
    },
    {
      "aliases": ["珍", "ちん", "chin", "めづらし"],
      "name": "tin",
      "category": "Letters/Japanese/一文字",
      "url": "https://s3.arkjp.net/misskey/4db64fdc-ad20-4833-91c9-acd0166bac2d.png"
    },
    {
      "aliases": ["（暗黒微笑）", "あんこくびしょう", "annkokubisyou"],
      "name": "ankoku_bisyou",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/misskey/webpublic-f3ed3ef2-b57f-4da1-96eb-bff63a9f81f2.jpg"
    },
    {
      "aliases": [
        "投稿時間(〜前)を押すと返信や引用が見れます",
        "とうこうじかんまえをおすとへんしんやいんようがみれます"
      ],
      "name": "click_the_date_to_view_replies_and_quotes",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/misskey/61215e1d-5b1e-4055-9c36-a9586c7b6c61.png"
    },
    {
      "aliases": ["カスタム絵文字", "かすたむえもじ", "kasutamu_emoji"],
      "name": "custom_emoji2",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/misskey/8bcad9fe-a489-4cd3-8794-a3ad72e5607b.png"
    },
    {
      "aliases": [
        "がちんこバトル",
        "gachinko",
        "gatinko",
        "gatinko_battle",
        "battle",
        "batoru",
        "gachinkobatoru",
        "gatinkobatoru"
      ],
      "name": "gachinko_battle",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/emoji/gachinko_battle.png"
    },
    {
      "aliases": [
        "いかなごのくぎ煮の発送は",
        "いかなごのくぎにのはっそうは",
        "ikanago_no_kugini_no_hassou_ha"
      ],
      "name": "ikanago_shipping_is",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/misskey/b8c26013-b9ab-41b0-9a32-6424150d01a0.png"
    },
    {
      "aliases": [
        "fraud",
        "hasubete_sagidesu",
        "はすべて詐欺です",
        "はすべてさぎです"
      ],
      "name": "is_all_scam",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/emoji/is_all_scam.png"
    },
    {
      "aliases": [
        "怪文書いただきました",
        "かいぶんしょいただきました",
        "kaibunsho_itadakimashita"
      ],
      "name": "kaibunsyo_itadakimasita",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/misskey/e5486c7c-eefb-4a18-b2fd-42f202d3ec00.png"
    },
    {
      "aliases": [
        "官営八幡製鐵所",
        "かんえいやはたせいてつしょ",
        "かんえいやわたせいてつしょ",
        "kan'ei_yahatase_seitetusyo",
        "kanei_yahatase_seitetsusho",
        "kan'ei_yawatase_seitetusyo",
        "kanei_yawatase_seitetsusho",
        "the_imperial_steel_works_japan",
        "tiswj",
        "doko"
      ],
      "name": "kanneiyahataseitetsusyo",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/emoji/kanneiyahataseitetsusyo.png"
    },
    {
      "aliases": ["ここからはがす"],
      "name": "kokokara_hagasu",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/emoji/kokokara_hagasu.png"
    },
    {
      "aliases": [
        "ローカルはこのサイトの全ユーザーの投稿です",
        "ろーかるはこのさいとのぜんゆーざーののーとです"
      ],
      "name": "local_is_post_from_every_user_within_this_site",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/misskey/adc45843-92dc-430a-b52c-088f54f65072.png"
    },
    {
      "aliases": ["ねも"],
      "name": "nemo",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/emoji/nemo.png"
    },
    {
      "aliases": ["ねもねもっ!"],
      "name": "nemonemo",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/emoji/nemonemo.png"
    },
    {
      "aliases": ["パワー！"],
      "name": "power_txt",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/emoji/power_txt.png"
    },
    {
      "aliases": ["さんがつついたち", "３月１日", "3月1日"],
      "name": "sangatsu_tsuitachi_de_gozaimasu",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/misskey/03ed1c9f-e79f-4a2c-9e76-b833432c47ea.png"
    },
    {
      "aliases": [
        "モグレターでギル送れ",
        "もぐれたーでぎるおくれ",
        "mogureta-degiruokure"
      ],
      "name": "send_gil_with_mogletter",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/misskey/e5fb64f0-7f73-4fe6-8bc1-ebe7be1fbe93.png"
    },
    {
      "aliases": [
        "letterpack",
        "cash",
        "fraud",
        "scam",
        "レターパックで",
        "れたーぱっくで"
      ],
      "name": "send_money",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/emoji/send_money.png"
    },
    {
      "aliases": ["shikyuu_kaifuu"],
      "name": "sikyuu_kaihuu_c",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/emoji/sikyuu_kaihuu_c.png"
    },
    {
      "aliases": ["仕様デス", "しようです", "its_a_feature", "shiyou_desu"],
      "name": "siyou_desu",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/misskey/0bb7d1a7-d897-4b1c-8f81-2c1f4236a6ee.png"
    },
    {
      "aliases": ["わんぷっぷー"],
      "name": "wanpuppu",
      "category": "Letters/Japanese/不当幅",
      "url": "https://s3.arkjp.net/misskey/1f8badf9-b367-47ba-bfc5-424f881d8e78.png"
    },
    {
      "aliases": ["tigau", "chigau", "soujanai", "suzuki_masayuki"],
      "name": "chigau_soujanai",
      "category": "Letters/Japanese/否定",
      "url": "https://s3.arkjp.net/emoji/chigau_soujanai.jpeg"
    },
    {
      "aliases": ["いいえ", "no", "negative", ""],
      "name": "iie",
      "category": "Letters/Japanese/否定",
      "url": "https://s3.arkjp.net/emoji/iie.png"
    },
    {
      "aliases": ["解釈違い", "かいしゃくちがい", "kaishaku_tigai"],
      "name": "kaishaku_chigai",
      "category": "Letters/Japanese/否定",
      "url": "https://s3.arkjp.net/emoji/kaishaku_chigai.png"
    },
    {
      "aliases": [
        "絵文字多すぎ",
        "えもじおおすぎ",
        "emoji_oosugi",
        "emojioosugi",
        "toomuchemoji",
        "too_much_emoji"
      ],
      "name": "emoji_too_much",
      "category": "Letters/Japanese/多すぎ",
      "url": "https://s3.arkjp.net/emoji/emoji_too_much.png"
    },
    {
      "aliases": ["too_many_hashtag", "toomanyhashtag", "hasshutagu_ga_oosugiru"],
      "name": "hashtag_ga_oosugiru",
      "category": "Letters/Japanese/多すぎ",
      "url": "https://s3.arkjp.net/emoji/hashtag_ga_oosugiru.png"
    },
    {
      "aliases": [
        "漢字が多すぎる",
        "かんじがおおすぎる",
        "kanjikata",
        "kanji_ga_oosugiru",
        ""
      ],
      "name": "too_many_kanji",
      "category": "Letters/Japanese/多すぎ",
      "url": "https://s3.arkjp.net/emoji/too_many_kanji.png"
    },
    {
      "aliases": [
        "カタカナが多すぎる",
        "かたかながおおすぎる",
        "katakana_ga_oosugiru",
        "katakana_ga_osugiru",
        "katakanagaoosugiru",
        "toomanykatakana"
      ],
      "name": "too_many_katakana",
      "category": "Letters/Japanese/多すぎ",
      "url": "https://s3.arkjp.net/emoji/too_many_katakana.png"
    },
    {
      "aliases": ["kakuzikken", "are_you_okay_do_you_wanna_nuclear_test"],
      "name": "daizyoubu_kakujikkennsuru",
      "category": "Letters/Japanese/核実験",
      "url": "https://s3.arkjp.net/emoji/daizyoubu_kakujikkennsuru.png"
    },
    {
      "aliases": ["kakujikken", "lets_nuclear_test_together"],
      "name": "isshoni_kakujikken_shiyo",
      "category": "Letters/Japanese/核実験",
      "url": "https://s3.arkjp.net/emoji/isshoni_kakujikken_shiyo.png"
    },
    {
      "aliases": [
        "核実験",
        "かくじっけん",
        "kakujikken",
        "kakuzikken",
        "kakujikken_sippaisita",
        "kakujikken_sippaishita",
        "kakujikken_shippaisita",
        "kakujikken_shippaishita",
        "nuclear_test_failed"
      ],
      "name": "kakujikkenn_shippaishita",
      "category": "Letters/Japanese/核実験",
      "url": "https://s3.arkjp.net/emoji/kakujikkenn_shippaishita.png"
    },
    {
      "aliases": [
        "核実験",
        "かくじっけん",
        "kakujikken",
        "kakuzikken",
        "核実験したよっ",
        "かくじっけんしたよっ",
        "kakujikken_sitayo",
        "nuclear_testing_finished_with_love"
      ],
      "name": "kakujikken_shitayo",
      "category": "Letters/Japanese/核実験",
      "url": "https://s3.arkjp.net/emoji/kakujikken_shitayo.png"
    },
    {
      "aliases": [
        "核実験",
        "かくじっけん",
        "kakujikken",
        "kakuzikken",
        "核実験したぞ",
        "kakujikken_sitazo",
        "かくじっけんしたぞ",
        "",
        "nuclear_testing_done"
      ],
      "name": "kakujikken_shitazo",
      "category": "Letters/Japanese/核実験",
      "url": "https://s3.arkjp.net/emoji/kakujikken_shitazo.png"
    },
    {
      "aliases": [
        "核実験",
        "かくじっけん",
        "kakujikken",
        "kakuzikken",
        "核実験するぞ",
        "かくじっけんするぞ",
        "nuclear_testing"
      ],
      "name": "kakujikkensuruzo",
      "category": "Letters/Japanese/核実験",
      "url": "https://s3.arkjp.net/emoji/kakujikkensuruzo.png"
    },
    {
      "aliases": [
        "アラスカンマラミュート",
        "あらすかんまらみゅーと",
        "arasukan_maramyu-to"
      ],
      "name": "alaskan_malamute",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/webpublic-5055f297-93f0-470c-a848-1480953f8462.png"
    },
    {
      "aliases": ["アンコリーノ", "ankoriino", "", "ancoleeno"],
      "name": "ankoleeno",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/0e68c828-acb4-4707-b201-8459e73c87e7.png"
    },
    {
      "aliases": [
        "あんたがナンバーワン",
        "あんたがなんばーわん",
        "あんたがno.1",
        "あんたがno1",
        "あんたがnumber1",
        "anntaga_number_one"
      ],
      "name": "antaga_numberone",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/antaga_numberone.png"
    },
    {
      "aliases": [],
      "name": "arajio",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/af04df61-5c57-4e0b-a403-fcf47e84243e.png"
    },
    {
      "aliases": ["あら大変", "あらたいへん", "arataihen"],
      "name": "ara_taihen",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/webpublic-f880f283-de39-4ec1-898e-1baf4b0ba9e3.png"
    },
    {
      "aliases": ["あるある探検隊", "あるあるたんけんたい", "aruaru_tankentai"],
      "name": "aruarutankentai",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/e3e440c8-962c-4d3e-9478-2d3bb32fd539.png"
    },
    {
      "aliases": ["あとでけす", "atodekesu"],
      "name": "atode_kesu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/atode_kesu.png"
    },
    {
      "aliases": ["あとできく", "atodekiku"],
      "name": "atode_kiku",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/atode_kiku.png"
    },
    {
      "aliases": ["あとでみる", "atodemiru"],
      "name": "atode_miru",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/atode_miru.png"
    },
    {
      "aliases": [
        "あったか〜い",
        "あったかーい",
        "あったかい",
        "attakai",
        "attakaai"
      ],
      "name": "attaka_i",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/attaka_i.png"
    },
    {
      "aliases": [
        "圧倒的感謝",
        "attoutekikansha",
        "attootekikansha",
        "あっとうてきかんしゃ"
      ],
      "name": "attouteki_kansha",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/attouteki_kansha.png"
    },
    {
      "aliases": ["kenni_shugi", "kenni_syugi", "けんいしゅぎ"],
      "name": "authoritarianism",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/cb959a7a-412a-4c81-8042-7698ccec3bef.png"
    },
    {
      "aliases": ["暴力", "ぼうりょく", "violence", "boryoku", ""],
      "name": "bouryoku",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/bouryoku.png"
    },
    {
      "aliases": [
        "bump_of_知見",
        "バンプオブチケン",
        "ばんぷおぶちけん",
        "bumpof_tiken",
        "bump_of_chiken",
        ""
      ],
      "name": "bump_of_tiken",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/173e382f-d48d-42e5-9149-e46cba85704a.png"
    },
    {
      "aliases": [],
      "name": "bunmei_kaika",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/a03847ee-e0d8-4659-b76c-f71fc444c3e4.png"
    },
    {
      "aliases": ["ちゃんとはげろ", "tyantohagero"],
      "name": "chantohagero",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/chantohagero.png"
    },
    {
      "aliases": [
        "力こそパワー",
        "ちからこそぱわー",
        "chikarakosopower",
        "tikarakosopower",
        "tikarakosopawa-",
        "tikarakoso_power",
        "tikarakoso_pawa-",
        "chikarakosopower",
        "chikarakosopawa-",
        "chikarakoso_power",
        "chikarakoso_pawa-"
      ],
      "name": "chikara_power",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/chikara_power.png"
    },
    {
      "aliases": [
        "地球平面説",
        "ちきゅうへいめんせつ",
        "tikyuheimen",
        "tikyuheimensetu",
        "tikyuheimensetsu",
        "tikyuuheimen",
        "tikyuuheimensetu",
        "tikyuuheimensetsu",
        "chikyuheimen",
        "chikyuheimensetu",
        "chikyuheimensetsu",
        "chikyuuheimen",
        "chikyuuheimensetu",
        "chikyuuheimensetsu"
      ],
      "name": "chikyuuheimensetsu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/chikyuuheimensetsu.png"
    },
    {
      "aliases": ["デッキ", "でっき", "deck", ""],
      "name": "dekki",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/18b61b76-3506-4951-8032-7781e92a3e05.png"
    },
    {
      "aliases": ["dottimo", "docchimo", "どっちも"],
      "name": "docchimo",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/docchimo.png"
    },
    {
      "aliases": ["jibunde_tsukurou", "diy", "doityourself"],
      "name": "do_it_yourself",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/do_it_yourself.png"
    },
    {
      "aliases": ["どこ住みてかMisskeyやってる", "どこずみてかみすきーやってる"],
      "name": "dokozumi_tekamisskey_yatteru",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/dokozumi_tekamisskey_yatteru.png"
    },
    {
      "aliases": ["毒乳首", "どくちくび", "doku_chikubi", "poisonous_nipple"],
      "name": "doku_tikubi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/f30b17f3-47c4-43b4-9470-520d2b7e20d9.png"
    },
    {
      "aliases": ["どすけべ"],
      "name": "dosukebe",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/dosukebe.png"
    },
    {
      "aliases": [
        "どすけべ祭り",
        "どすけべまつり",
        "dosukebe_maturi",
        "dosukebe_matsuri",
        "dosukebe_fes",
        ""
      ],
      "name": "dosukebefes",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/86567dc9-373f-4cdf-a704-8db58e6dd550.png"
    },
    {
      "aliases": ["どうぞどうぞ", "douzodouzo", "dozodozo", "doozodoozo"],
      "name": "douzo_douzo",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/douzo_douzo.png"
    },
    {
      "aliases": [],
      "name": "edasi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/3fc27664-dda6-481f-863a-0c01ba5cce3e.png"
    },
    {
      "aliases": ["えへへw"],
      "name": "ehehe",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/ehehe.png"
    },
    {
      "aliases": [
        "英国紳士",
        "えいこくしんし",
        "uk_gentleman",
        "eikoku_shinshi",
        "イギリス",
        "しんし"
      ],
      "name": "eikoku_sinsi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/9d0f5da8-56e5-421d-9fff-45bd12930613.png"
    },
    {
      "aliases": [
        "英国淑女",
        "えいこくしゅくじょ",
        "uk_lady",
        "eikoku_shukujo",
        "イギリス",
        "しゅくじょ"
      ],
      "name": "eikoku_syukujo",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/e4522adb-1196-467f-a26c-859d1abd53c8.png"
    },
    {
      "aliases": ["エンドウ豆", "えんどうまめ", "endou", "pea", "mame", ""],
      "name": "endou_mame",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/bae6e51c-4ccf-408f-970c-55eaa2c1dbc3.png"
    },
    {
      "aliases": ["すりすり", "surisuri", "sulisuli", ""],
      "name": "eti_suri",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/eti_suri.png"
    },
    {
      "aliases": ["深い", "ふかい", "deep", "hukai"],
      "name": "fukai",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/fukai.png"
    },
    {
      "aliases": ["ふろてら", "hurotera"],
      "name": "furotera",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/36b29a13-aa2c-4c51-a727-9e14cae25d6f.png"
    },
    {
      "aliases": [
        "学生気分が抜けすぎ",
        "がくせいきぶんがぬけすぎ",
        "gakuseikibunganukesugi"
      ],
      "name": "gakuseikibunga_nukesugi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/gakuseikibunga_nukesugi.png"
    },
    {
      "aliases": [
        "学生気分が抜けてない",
        "がくせいきぶんがぬけてない",
        "gakuseikibunganuketenai"
      ],
      "name": "gakuseikibunga_nuketenai",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/gakuseikibunga_nuketenai.png"
    },
    {
      "aliases": ["がんばれ", "がんばれ!", ""],
      "name": "ganbare",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/ganbare.png"
    },
    {
      "aliases": [
        "劇場版Misskey無限メンテ編",
        "げきじょうばんみすきーむげんめんてへん",
        ""
      ],
      "name": "gekijouban_misskey_mugenmenntehenn",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/gekijouban_misskey_mugenmenntehenn.png"
    },
    {
      "aliases": [
        "技評",
        "技術評論社",
        "ぎひょう",
        "ギヒョウ",
        "ギヒョー",
        "ぎひょー",
        "ぎじゅつひょうろんしゃ"
      ],
      "name": "gihyo",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/gihyo.png"
    },
    {
      "aliases": ["ご安全に", "ごあんぜんに", "be_safe", "goannzennni", ""],
      "name": "goanzenni",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/goanzenni.png"
    },
    {
      "aliases": [],
      "name": "gobaku",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/aca5fd3e-26b3-4160-a1e7-c32e47b05ebd.png"
    },
    {
      "aliases": ["ご期待ください", "ごきたいください", "gokitaikudasai"],
      "name": "gokitai_kudasai",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/57f97eac-a347-4616-a37e-43a373ac654b.png"
    },
    {
      "aliases": ["ゴママヨサラダ", "ごままよさらだ", "gomamayo_salad", ""],
      "name": "gomamayo_sarada",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/gamamayo_sarada.png"
    },
    {
      "aliases": ["豪遊", "ごうゆう", "goyu", "goyuu", "gouyu", "gouyuu"],
      "name": "gouyuu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/gouyuu.png"
    },
    {
      "aliases": ["排便完了", "はいべんかんりょう", "haibennkanryo", "うんち"],
      "name": "haiben_kanryou",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/7445cc22-e04f-43d5-b19c-c4cc0823c990.png"
    },
    {
      "aliases": [],
      "name": "haigo_chuui",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/a164ff64-ee4b-4e8b-8528-4c89897eb90d.png"
    },
    {
      "aliases": ["はいそ", "敗訴"],
      "name": "haiso",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/haiso.png"
    },
    {
      "aliases": [""],
      "name": "hakudatu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/hakudatu.png"
    },
    {
      "aliases": ["へんたい", "変態", "hentai"],
      "name": "hentai_laminated",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/hentai_laminated.gif"
    },
    {
      "aliases": ["ホックホク"],
      "name": "hokkuhoku",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/c6b39271-c75a-490f-afaf-426b894b378a.png"
    },
    {
      "aliases": ["ほんわか", "honnwaka"],
      "name": "honwaka",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/honwaka.png"
    },
    {
      "aliases": [
        "滅ぼしましょう",
        "ほろぼしましょう",
        "horobosimasho",
        "horobosimashou",
        "horobosimasyo",
        "horobosimasyou",
        "horoboshimasho",
        "horoboshimashou",
        "horoboshimasyo",
        "horoboshimasyou"
      ],
      "name": "horoboshimashou",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/horoboshimashou.gif"
    },
    {
      "aliases": ["ほしい", "ほしい！", "ほしい!", "hosii"],
      "name": "hoshii",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/hoshii.png"
    },
    {
      "aliases": ["イーロン", "いーろん", "elon", "i-ron", ""],
      "name": "iiron",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/iiron.png"
    },
    {
      "aliases": ["今川焼", "いまがわやき"],
      "name": "imagawayaki",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/cc8c5e5d-3115-445c-8f7c-2c965ef2f5c3.png"
    },
    {
      "aliases": ["いますぐ", "今すぐ"],
      "name": "imasugu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/imasugu.png"
    },
    {
      "aliases": ["いもうと", "imoto"],
      "name": "imouto",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/f55e3243-8348-43e3-ac93-4535dec2f81b.png"
    },
    {
      "aliases": ["いもうと祭り", "いもうとまつり", "imouto_fes", "imotofes"],
      "name": "imoutofes",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/c7b39ba5-5885-4eb7-a42e-c02ca65c28af.png"
    },
    {
      "aliases": ["飲酒ださ！", "inshudasa", "いんしゅださ！"],
      "name": "insyudasa",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/insyudasa.png"
    },
    {
      "aliases": ["インターネットやめろ", "quit_internetting"],
      "name": "internet_yamero",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/f85d7b14-9d95-478a-8b6d-fee9279fec8c.png"
    },
    {
      "aliases": [],
      "name": "isoge",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/f17c1cc6-6bfc-4007-88c2-dce1338bba89.png"
    },
    {
      "aliases": ["いてら"],
      "name": "itera",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/2686e5e1-dcd2-4d63-a67a-fd3f3aefe28b.png"
    },
    {
      "aliases": ["いったん深呼吸", "いったんしんこきゅう"],
      "name": "ittan_shinkokyu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/ittan_shinkokyu.png"
    },
    {
      "aliases": ["いったれ"],
      "name": "ittare",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/ittare.png"
    },
    {
      "aliases": ["いやん"],
      "name": "iyann",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/iyann.png"
    },
    {
      "aliases": ["joukyuusya"],
      "name": "jyoukyusya_muke",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/jyoukyusya_muke.png"
    },
    {
      "aliases": ["かえ", "買え"],
      "name": "kae",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/kae.png"
    },
    {
      "aliases": [
        "かいきげんしょう",
        "怪奇現象",
        "kaikigensho",
        "kaikigensyou",
        "kaikigensyo"
      ],
      "name": "kaikigenshou",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/kaikigenshou.png"
    },
    {
      "aliases": ["開戦", "かいせん"],
      "name": "kaisen",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/kaisen.png"
    },
    {
      "aliases": ["かいたれ"],
      "name": "kaitare",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/20831519-cff2-4816-bdc6-143c20f7d2ef.png"
    },
    {
      "aliases": ["kakinsanzai", "かきんさんざい", "課金散財"],
      "name": "kakin_sanzai",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/kakin_sanzai.png"
    },
    {
      "aliases": ["競馬やめろ", "けいばやめろ", "keibayamero"],
      "name": "keiba_yamero",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/keiba_yamero.png"
    },
    {
      "aliases": [
        "憲法違反",
        "けんぽういはん",
        "kenpou_ihan",
        "kenpo_ihan",
        "kenpoihan"
      ],
      "name": "kenpouihan",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/kenpouihan.png"
    },
    {
      "aliases": ["検討する", "けんとうする", "kento_suru"],
      "name": "kentou_suru",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/ad723a5c-4053-4dd6-a943-9926caec10f1.png"
    },
    {
      "aliases": [
        "気合でなんとかした",
        "きあいでなんとかした",
        "kiaide",
        "nantoka",
        "shita",
        "kiaidenantokashita",
        "kiaidenantokasita",
        ""
      ],
      "name": "kiaide_nantoka_shita",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/kiaide_nantoka_shita.png"
    },
    {
      "aliases": [
        "禁止カード",
        "きんしかーど",
        "kinsicard",
        "kinsika-do",
        "kinsi_card",
        "kinsi_ka-do",
        "kinshicard",
        "kinshika-do",
        "kinshi_card",
        "kinshi_ka-do"
      ],
      "name": "kinsi_card",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/kinsi_card.png"
    },
    {
      "aliases": [
        "起床完了",
        "きしょうかんりょう",
        "kisyokanryo",
        "kisho_kanryo",
        "おきた",
        ""
      ],
      "name": "kisyou_kanryou",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/86ee726e-4849-4602-b225-a0fbfc1e1e3e.png"
    },
    {
      "aliases": [],
      "name": "kitanai_hanashi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/c4dd640a-9755-46b6-a41d-9171505e7f1f.png"
    },
    {
      "aliases": ["kobayasi", "itoyoji"],
      "name": "kobayashiseiyaku_no_itoyouji",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/kobayashiseiyaku_no_itoyouji.png"
    },
    {
      "aliases": ["kobayasi", "itoyoji"],
      "name": "kobayashiseiyakuno_itoyouji",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/kobayashiseiyakuno_itoyouji.png"
    },
    {
      "aliases": ["こくたいごじ", "國體護持", "kokutaigoji"],
      "name": "kokutai_goji",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/kokutai_goji.png"
    },
    {
      "aliases": ["mrhc", "marihachi", "komarihachi"],
      "name": "ko_marihachi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/ko_marihachi.png"
    },
    {
      "aliases": ["こんばんは〜", "こんばんは", "konbanwa"],
      "name": "konbanha",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/konbanha.png"
    },
    {
      "aliases": [
        "こんにちは！",
        "こんにちは",
        "hello",
        "konnitiha",
        "konnitiwa",
        "konnichiha",
        "konnichiwa"
      ],
      "name": "konni_tiha",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/konni_tiha.png"
    },
    {
      "aliases": ["苦行", "くぎょう"],
      "name": "kugyou",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/kugyou.png"
    },
    {
      "aliases": [],
      "name": "kuma_bokujo",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/c7de2bca-81eb-4a81-a569-cb9c63a56760.png"
    },
    {
      "aliases": ["くそざこ"],
      "name": "kusozako",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/8d2bb255-cc0a-4e4d-97c5-9186f8db476c.png"
    },
    {
      "aliases": ["くったれ"],
      "name": "kuttare",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/kuttare.png"
    },
    {
      "aliases": ["極端", "きょくたん"],
      "name": "kyokutan",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/kyokutan.png"
    },
    {
      "aliases": [
        "今日の創造",
        "きょうのそうぞう",
        "todays_creation",
        "creations_today",
        "kyonosozo"
      ],
      "name": "kyounosouzou",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/kyounosouzou.png"
    },
    {
      "aliases": ["ロリコン", "ろりこん", "rorikon", ""],
      "name": "lolicon",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/e936180d-f18d-4ea7-bbcd-b298be7c2de9.png"
    },
    {
      "aliases": ["マグロ", "まぐろ"],
      "name": "maguro",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/41d5e983-c80e-4345-80d3-377bc7f6e4b0.png"
    },
    {
      "aliases": [],
      "name": "man",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/008bc549-46ff-49b3-8b06-3f134f0c1333.png"
    },
    {
      "aliases": ["またね"],
      "name": "matane",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/matane.png"
    },
    {
      "aliases": [
        "魔剤ださ",
        "まざいださ",
        "monster_not_cool",
        "モンエネださ",
        ""
      ],
      "name": "mazaidasa",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/mazaidasa.png"
    },
    {
      "aliases": [
        "まぜるな危険",
        "まぜるなきけん",
        "mazerunakiken",
        "do_not_mix"
      ],
      "name": "mazeruna_kiken",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/6d2f9747-989c-4294-b5e2-c06dd60fb62f.png"
    },
    {
      "aliases": ["メスガキ", "めすがき"],
      "name": "mesugaki",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/ce1a32a0-5b16-49aa-a138-8af35ff5dde9.png"
    },
    {
      "aliases": [
        "メスガキ祭り",
        "めすがきまつり",
        "mesugaki_matsuri",
        "mesugaki_maturi",
        "mesugaki_fes"
      ],
      "name": "mesugakifes",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/98120654-9227-4402-9e66-6898d7459358.png"
    },
    {
      "aliases": [
        "見えすぎて見失いがち",
        "みえすぎてみうしないがち",
        "miesugitemiushinaigati",
        "miesugitemiushinaigachi",
        "miesugitemiusinaigati",
        "miesugitemiusinaigachi",
        "miesugite_miushinaigati",
        "miesugite_miushinaigachi",
        "miesugite_miusinaigati",
        "miesugite_miusinaigachi"
      ],
      "name": "miesugite_miushinaigachi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/miesugite_miushinaigachi.png"
    },
    {
      "aliases": [
        "猛者",
        "もさ",
        "もざ",
        "もしゃ",
        "もじゃ",
        "もうさ",
        "もうざ",
        "もうしゃ",
        "もうじゃ",
        "mosa",
        "moza",
        "mosha",
        "mozya",
        "moja",
        "mousa",
        "mouza",
        "mousha",
        "mouzya",
        "mouja"
      ],
      "name": "mosa",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/mosa.png"
    },
    {
      "aliases": ["もっとやれ", "mottoyare"],
      "name": "motto_yare",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/motto_yare.png"
    },
    {
      "aliases": ["もう一時一大事！って感じ", "もういちじいちだいじってかんじ"],
      "name": "mou1ji_ichidaiji_ttekanji",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/mou1ji_ichidaiji_ttekanji.png"
    },
    {
      "aliases": ["無慈悲", "むじひ", "mujihi", ""],
      "name": "mujihi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/mujihi.png"
    },
    {
      "aliases": ["無敵", "むてき"],
      "name": "muteki",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/aa404783-5dbe-4acd-9bb0-d023c7b42f24.png"
    },
    {
      "aliases": [],
      "name": "nadoto_kangaete_imasenka",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/4647c345-8b1c-4173-a439-cb145b7dfbcf.PNG"
    },
    {
      "aliases": ["なんかすごそう", "なんか凄そう", "nanka", "sugoso"],
      "name": "nanka_sugosou",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/nanka_sugosou.png"
    },
    {
      "aliases": ["なんとかなる"],
      "name": "nantokanaru",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/nantokanaru.png"
    },
    {
      "aliases": ["なおりかけ"],
      "name": "naori_kake",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/naori_kake.png"
    },
    {
      "aliases": ["なったれ"],
      "name": "nattare",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/nattare.png"
    },
    {
      "aliases": ["猫を吸います", "ねこをすいます", "get_cat"],
      "name": "neko_wo_suimasu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/neko_wo_suimasu.png"
    },
    {
      "aliases": [],
      "name": "neppiro",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/6a96a352-ffe1-43d2-a491-75d2b7c36d7b.PNG"
    },
    {
      "aliases": ["寝ろ", "ねろ"],
      "name": "nero",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/nero.png"
    },
    {
      "aliases": ["にげて"],
      "name": "nigete",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/nigete.png"
    },
    {
      "aliases": ["んなわけねえだろ", "nnawakeneedaro"],
      "name": "nnawake_needaro",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/nnawake_needaro.png"
    },
    {
      "aliases": ["ぬるぽ", ""],
      "name": "nullpointerexception",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/nullpointerexception.png"
    },
    {
      "aliases": [
        "入浴完了",
        "にゅうよくかんりょう",
        "nyuyokukanryo",
        "ふろ",
        ""
      ],
      "name": "nyuuyoku_kanryou",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/c6c21147-8b29-40bd-9797-362110fcd648.png"
    },
    {
      "aliases": [
        "おだやかじゃないわね",
        "穏やかじゃないわね",
        "odayakajanaiwane"
      ],
      "name": "odayakajya_naiwane",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/odayakajya_naiwane.png"
    },
    {
      "aliases": ["奢りで寿司", "おごりですし", "ogoridesushi", "ogoride_susi"],
      "name": "ogoride_sushi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/webpublic-83b099e0-a9aa-43b9-b579-2a2fe7145ee8.png"
    },
    {
      "aliases": [],
      "name": "ogoride_yakiniku",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/webpublic-c64c1776-2bcc-4a4b-9e90-c068feb9f81a.png"
    },
    {
      "aliases": ["おハーブ生えますわ!", "oha-buhaemasuwa"],
      "name": "oherb_haemasuwa",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/oherb_haemasuwa.png"
    },
    {
      "aliases": ["お嬢様", "おじょうさま", "ojosama", "ojoosama"],
      "name": "ojousama",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/ojousama.png"
    },
    {
      "aliases": ["おかえりくださいませ", "おかえり下さいませ", ""],
      "name": "okaerikudasaimase",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/okaerikudasaimase.gif"
    },
    {
      "aliases": ["おかえりなさいませ"],
      "name": "okaerinasaimase",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/okaerinasaimase.png"
    },
    {
      "aliases": [],
      "name": "okawari_mo_iizo",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/9eb1bc5f-e433-4c31-9cf8-63cbb66c5a50.png"
    },
    {
      "aliases": ["お肉食べなさい", "おにくたべなさい"],
      "name": "onikutabenasai",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/onikutabenasai.png"
    },
    {
      "aliases": [
        "俺も同じ気持ち",
        "おれもおなじきもち",
        "i_feel_the_same_too",
        "oremoonajikimochi",
        "oremoonajikimoti"
      ],
      "name": "oremoonajikimochi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/oremoonajikimochi.png"
    },
    {
      "aliases": ["惜しい！", "おしい", "osii"],
      "name": "oshii",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/oshii.png"
    },
    {
      "aliases": ["おっさん"],
      "name": "ossan",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/ossan.png"
    },
    {
      "aliases": ["大人買い", "おとながい", "otonakai"],
      "name": "otonagai",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/otonagai.png"
    },
    {
      "aliases": ["ho_n", "hoon", "ho--n"],
      "name": "pho_n",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/pho_n.png"
    },
    {
      "aliases": [
        "ponkotume",
        "ponkotsu_me",
        "ポンコツは私です",
        "ぽんこつは私です"
      ],
      "name": "ponkotu_me",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/ponkotu_me.png"
    },
    {
      "aliases": ["ポシカヨ", "ﾎﾟｼｶﾖ", "ポシヵﾖ", "poshikayo"],
      "name": "posikayo",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/posikayo.png"
    },
    {
      "aliases": ["ラスカル"],
      "name": "rasukaru",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/3358ad86-64a3-4b49-aad2-1429349fecb4.png"
    },
    {
      "aliases": ["reaction", "shooting", "リアクションシューティング"],
      "name": "reaction_shooting",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/reaction_shooting.png"
    },
    {
      "aliases": ["離業", "りぎょう", "rigyou"],
      "name": "rigyo",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/rigyo.png"
    },
    {
      "aliases": ["renote"],
      "name": "rn",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/rn.png"
    },
    {
      "aliases": ["さいこう", "最高"],
      "name": "saikou",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/saikou.png"
    },
    {
      "aliases": ["埼玉", "さいたま", "saitama"],
      "name": "saitama_txt",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/edbddb0f-1f1e-422f-9f55-3a0675a529b0.png"
    },
    {
      "aliases": [],
      "name": "sakushi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/15b5f5b1-ba09-4fd4-b056-56e0491f86b4.png"
    },
    {
      "aliases": ["サ終", "サービス終了", "sashu", "sashuu", "sasyu", ""],
      "name": "sasyuu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/sasyuu.png"
    },
    {
      "aliases": ["撮影開始", "さつえいかいし", "satsuei_kaishi"],
      "name": "satuei_kaisi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/aa9e3b08-6527-44d7-af37-68501e42bc13.png"
    },
    {
      "aliases": ["聖地巡礼", "せいちじゅんれい", "seichi_junrei"],
      "name": "seiti_zyunrei",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/def2c8a8-04f1-4229-99f8-49599a116052.png"
    },
    {
      "aliases": [],
      "name": "semarikuru",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/20686271-e061-4981-a5da-d4956b1a1c5b.PNG"
    },
    {
      "aliases": ["攻め", "せめ"],
      "name": "seme",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/webpublic-62ac22b5-0c00-467d-abd1-0be245507b30.png"
    },
    {
      "aliases": [
        "宣戦布告",
        "せんせんふこく",
        "sensenfukoku",
        "sensenhukoku",
        ""
      ],
      "name": "sensen",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/sensen.png"
    },
    {
      "aliases": [],
      "name": "server_ni_suruzo",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/6fe8d871-b5f5-4732-b70c-1fb13e785172.png"
    },
    {
      "aliases": ["しーきび", "siikibi", "ckibi", ""],
      "name": "shiikibi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/shiikibi.png"
    },
    {
      "aliases": ["siimo", "しーも"],
      "name": "shiimo",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/shiimo.png"
    },
    {
      "aliases": [
        "死なない程度で",
        "しなないていどで",
        "sinanai_teidode",
        "shinanai",
        "sinanai",
        "teidode"
      ],
      "name": "shinanai_teidode",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/shinanai_teidode.png"
    },
    {
      "aliases": [
        "新刊あります",
        "しんかんあります",
        "shinkanarimasu",
        "sinkanarimasu",
        ""
      ],
      "name": "shinkan_arimasu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/shinkan_arimasu.png"
    },
    {
      "aliases": ["しべはす", "shibehasu", "siberian_husky"],
      "name": "sibehasu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/webpublic-5a5411a2-4a52-4605-89b8-7a0f5f35da1a.png"
    },
    {
      "aliases": ["締切", "しめきり", "shimekiri"],
      "name": "simekiri",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/f37b9f06-755a-4329-a7e2-888260c74e62.PNG"
    },
    {
      "aliases": ["新譜", "しんぷ", "shinpu", "shimpu"],
      "name": "sinpu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/d93b2485-e34c-49b5-ae52-1e79bc2e67a3.png"
    },
    {
      "aliases": ["心頭滅却", "しんとうめっきゃく"],
      "name": "sintou_mekkyaku",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/sintou_mekkyaku.png"
    },
    {
      "aliases": ["shirane", "しらねー", "知らね〜〜!!"],
      "name": "sirane",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/sirane.png"
    },
    {
      "aliases": ["知らんけど", "しらんけど", "sirankedo", "shirankedo"],
      "name": "siranke_do",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/siranke_do.png"
    },
    {
      "aliases": ["師匠", "ししょう", "shisho"],
      "name": "sisyou",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/bfd8c41d-dd23-4dcc-a64c-23922039eae4.png"
    },
    {
      "aliases": ["sodachiga_futsuu"],
      "name": "sodatiga_futsuu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/sodatiga_futsuu.png"
    },
    {
      "aliases": ["育ちが悪い"],
      "name": "sodatiga_warui",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/sodatiga_warui.png"
    },
    {
      "aliases": ["その発想はなかった", "そのはっそうはなかった"],
      "name": "sonohassouha_nakatta",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/sonohassouha_nakatta.png"
    },
    {
      "aliases": ["それはうそ"],
      "name": "sorehauso",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/sorehauso.png"
    },
    {
      "aliases": ["それ以上はいけない", "それいじょうはいけない"],
      "name": "soreijouwa_ikenai",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/soreijouwa_ikenai.png"
    },
    {
      "aliases": ["それみりょく", "それ魅力"],
      "name": "soremiryoku",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/soremiryoku.png"
    },
    {
      "aliases": ["そうか...", "そうか", "sooka", "soka", ""],
      "name": "souka",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/souka.png"
    },
    {
      "aliases": ["soomitai", "somitai", "そうみたい"],
      "name": "soumitai",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/soumitai.png"
    },
    {
      "aliases": ["souomouyona", "そう思うよな", "そうおもうよな"],
      "name": "sou_omouyona",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/sou_omouyona.png"
    },
    {
      "aliases": ["すみませんでした", "sumimasendesita"],
      "name": "sumimasendeshita",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/sumimasendeshita.png"
    },
    {
      "aliases": ["すみませんでした", "sumimasendeshita"],
      "name": "sumimasendesita",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/sumimasendesita.png"
    },
    {
      "aliases": ["shosinsha_muke", "for_newbies", "for_noobs", "for_beginners"],
      "name": "syoshinsya_muke",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/syoshinsya_muke.png"
    },
    {
      "aliases": [
        "承認欲求モンスター",
        "しょうにんよっきゅうもんすたー",
        "shounin_yokkyu_monster"
      ],
      "name": "syounin_yokkyuu_monster",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/f009348b-a2fb-451b-bfb8-c20dc5895542.gif"
    },
    {
      "aliases": ["勝訴", "しょうそ", "shoso", "syoso", "shouso"],
      "name": "syouso",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/syouso.png"
    },
    {
      "aliases": ["しゅいろ"],
      "name": "syuilo",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/syuilo.png"
    },
    {
      "aliases": ["終戦", "しゅうせん", "shuusen", "syusen", "shusen"],
      "name": "syuusen",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/syuusen.png"
    },
    {
      "aliases": ["他意はない", "たいはない", "taihanai", "taiwanai"],
      "name": "taiha_nai",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/taiha_nai.png"
    },
    {
      "aliases": [
        "たいへんいまおきました",
        "taihen",
        "imaokimashita",
        "imaokimasita",
        ""
      ],
      "name": "taihen_imaokimashita",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/taihen_imaokimashita.png"
    },
    {
      "aliases": ["大変ね…", "たいへんね", "taihenne"],
      "name": "taihen_ne_",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/webpublic-bae51719-d9a5-40c5-bb6d-ea5a2431b596.png"
    },
    {
      "aliases": ["逮捕", "たいほ", "arrest", "arrested", "cuffed"],
      "name": "taiho",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/taiho.png"
    },
    {
      "aliases": ["他意しかない", "たいしかない", "taishikanai", "taisikanai"],
      "name": "taishika_nai",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/taishika_nai.png"
    },
    {
      "aliases": ["楽しい", "たのしい", "tanosii"],
      "name": "tanoshii",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/tanoshii.png"
    },
    {
      "aliases": [
        "天動説",
        "てんどうせつ",
        "tendosetu",
        "tendosetsu",
        "tendousetu",
        "tendousetsu"
      ],
      "name": "tendousetsu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/tendousetsu.png"
    },
    {
      "aliases": ["天才", "てんさい"],
      "name": "tensai",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/tensai.gif"
    },
    {
      "aliases": ["哲学", "てつがく", "tetugaku"],
      "name": "tetsugaku",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/tetsugaku.png"
    },
    {
      "aliases": ["特にお前", "とくにおまえ", "tokuniomae"],
      "name": "tokuni_omae",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/tokuni_omae.png"
    },
    {
      "aliases": ["とんこつ", "トンコツ"],
      "name": "tonkotsu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/tonkotsu.png"
    },
    {
      "aliases": ["当選", "とうせん", "tosen", "tosenn", "tousenn", ""],
      "name": "tousen",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/tousen.png"
    },
    {
      "aliases": [
        "つめた〜い",
        "つめたーい",
        "つめたい",
        "tsumetai",
        "tumeta_i",
        "tumetai",
        ""
      ],
      "name": "tsumeta_i",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/tsumeta_i.png"
    },
    {
      "aliases": ["つんだ", "詰んだ", "tunda", ""],
      "name": "tsunda",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/tsunda.jpeg"
    },
    {
      "aliases": ["受け", "うけ"],
      "name": "uke",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/webpublic-ad857739-07c7-404b-9440-1b424e208c30.png"
    },
    {
      "aliases": [
        "浮き足だってそうですわ",
        "うきあしだってそうですわ",
        "ukiasidattesoudesuwa"
      ],
      "name": "ukiashidattesoudesuwa",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/ukiashidattesoudesuwa.png"
    },
    {
      "aliases": ["wehihihihi", "uxehihihihi", "うぇひひひひ", "ｳｪﾋﾋﾋﾋwww"],
      "name": "ulehihihihi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/ulehihihihi.png"
    },
    {
      "aliases": ["うらやま"],
      "name": "urayama",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/urayama.png"
    },
    {
      "aliases": ["うそだうそだ"],
      "name": "usodausoda",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/2bf3e64f-fa13-4a54-b1b3-b6fdc9c76f09.png"
    },
    {
      "aliases": ["iovc", "vio脱毛する", "びおだつもうする", "viodatumousuru"],
      "name": "vio_hair_removal_do",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/vio_hair_removal_do.png"
    },
    {
      "aliases": ["ワッチャ"],
      "name": "waccha",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/waccha.png"
    },
    {
      "aliases": ["わかりかけ"],
      "name": "wakarikake",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/wakarikake.png"
    },
    {
      "aliases": [
        "わかりみが深すぎる",
        "わかりみがふかすぎる",
        "wakarimigafukasugiru",
        "wakarimigahukasugiru"
      ],
      "name": "wakarimiga_fukasugiru",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/wakarimiga_fukasugiru.png"
    },
    {
      "aliases": [
        "ワンちゃん",
        "わんちゃん",
        "wanchan",
        "wan_chan",
        "one_chan",
        "one_chance",
        "a_chance"
      ],
      "name": "wanchan",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/wanchan.png"
    },
    {
      "aliases": ["わるいおとな", "waruiotona"],
      "name": "warui_otona",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/warui_otona.png"
    },
    {
      "aliases": [""],
      "name": "watakushiha_soudeha_arimasenwa",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/watakushiha_soudeha_arimasenwa.png"
    },
    {
      "aliases": [
        "私がたべた",
        "わたしがたべた",
        "watasigatabeta",
        "watasiga_tabeta",
        "watashigatabeta",
        "watashiga_tabeta"
      ],
      "name": "watashiga_tabeta",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/watashiga_tabeta.png"
    },
    {
      "aliases": [
        "やべー破産する",
        "やべーはさんする",
        "yabeehasansuru",
        "on_the_verge_of_going_bankrupt"
      ],
      "name": "yabee_hasan_suru",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/d4e8a69a-c962-4747-a3a5-f8ccf12495cb.png"
    },
    {
      "aliases": ["やくぞ", "焼くぞ"],
      "name": "yakuzo",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/yakuzo.png"
    },
    {
      "aliases": ["ヤレばデキる", "やればできる", "yarebadekiru", ""],
      "name": "yareba_dekiru",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/yareba_dekiru.png"
    },
    {
      "aliases": ["やさいせいかつ", "yasai", "seikatu", "seikatsu"],
      "name": "yasai_seikatsu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/yasai_seikatsu.png"
    },
    {
      "aliases": [
        "やさしいせかい",
        "yasasii",
        "sekai",
        "yasashii",
        "yasasi",
        "yasashi"
      ],
      "name": "yasashii_sekai",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/yasashii_sekai.png"
    },
    {
      "aliases": ["休み気分がぬけてない", "やすみきぶんがぬけてない", ""],
      "name": "yasumikibunga_nuketenai",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/yasumikibunga_nuketenai.png"
    },
    {
      "aliases": [
        "休み気分が抜けっぱなし",
        "やすみきぶんがぬけっぱなし",
        "yasumikibunnga",
        "nukeppanashi"
      ],
      "name": "yasumikibunnga_nukeppanashi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/yasumikibunnga_nukeppanashi.png"
    },
    {
      "aliases": ["やったぜ"],
      "name": "yattaze",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/yattaze.png"
    },
    {
      "aliases": ["やったぜ"],
      "name": "yattaze2",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/6f722b06-f1b8-4211-ae34-9d447d3d7b82.png"
    },
    {
      "aliases": ["やっていき"],
      "name": "yatteiki",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/1b30da77-dcf2-4871-b1ac-c77283fdac92.png"
    },
    {
      "aliases": ["良いと思います", "よいとおもいます"],
      "name": "yoito_omoimasu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/yoito_omoimasu.png"
    },
    {
      "aliases": [],
      "name": "yukichi",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/8a1c0e60-cb95-48de-94c3-a9c9d5bc30e0.png"
    },
    {
      "aliases": [],
      "name": "yuunou",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/cd49d101-6605-48d6-afee-8c616758ff7a.png"
    },
    {
      "aliases": ["ざぁこ"],
      "name": "zako_heart",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/zako_heart.png"
    },
    {
      "aliases": ["ぜんぶ", "全部"],
      "name": "zenbu",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/zenbu.png"
    },
    {
      "aliases": ["全部買え", "ぜんぶかえ", "zenbukae"],
      "name": "zenbu_kae",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/zenbu_kae.png"
    },
    {
      "aliases": ["全能", "ぜんのう", "zenno"],
      "name": "zennou",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/b4096497-9966-4454-b0c7-e422403d8cfa.png"
    },
    {
      "aliases": ["zettainiiru", "ぜったいにいる", "絶対にいる"],
      "name": "zettaini_iru",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/emoji/zettaini_iru.png"
    },
    {
      "aliases": ["人類", "じんるい", "jinrui"],
      "name": "zinrui",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/d85ce891-313a-47f0-a8c7-b88034bc11ea.png"
    },
    {
      "aliases": ["重症", "じゅうしょう", "juushou", "jusho", "zyusyo"],
      "name": "zyuusyou",
      "category": "Letters/Japanese/組み文字",
      "url": "https://s3.arkjp.net/misskey/f0dd2cd4-8a44-4246-9add-693340676d4d.png"
    },
    {
      "aliases": [
        "あなた今言いましたね",
        "あなたいまいいましたね",
        "anata_ima_iimasitane"
      ],
      "name": "anata_ima_iimashitane",
      "category": "Letters/Japanese/組み文字/あなた今言いましたね",
      "url": "https://s3.arkjp.net/misskey/c186f019-e1e0-42db-b0e7-9886a1788816.png"
    },
    {
      "aliases": [
        "あなた今マックって言いましたね",
        "あなたいままっくっていいましたね",
        "you_just_said_mac_didnt_you",
        "makku",
        "iimasitane"
      ],
      "name": "anataima_makkutte_iimashitane",
      "category": "Letters/Japanese/組み文字/あなた今言いましたね",
      "url": "https://s3.arkjp.net/emoji/anataima_makkutte_iimashitane.png"
    },
    {
      "aliases": [
        "あなた今マクドって言いましたね",
        "あなたいままっくっていいましたね",
        "you_just_said_mcd_didnt_you",
        "makudo",
        "iimasitane"
      ],
      "name": "anataima_makudotte_iimashitane",
      "category": "Letters/Japanese/組み文字/あなた今言いましたね",
      "url": "https://s3.arkjp.net/emoji/anataima_makudotte_iimashitane.png"
    },
    {
      "aliases": ["unko"],
      "name": "anataima_unkotte_iimashitane",
      "category": "Letters/Japanese/組み文字/あなた今言いましたね",
      "url": "https://s3.arkjp.net/emoji/anataima_unkotte_iimashitane.png"
    },
    {
      "aliases": ["伊塚キヨ子"],
      "name": "iduka_kiyoko",
      "category": "Letters/Japanese/組み文字/名前",
      "url": "https://s3.arkjp.net/misskey/e06ecc7f-7402-455b-a60d-e57451ecaaef.png"
    },
    {
      "aliases": ["敗北者", "はいぼくしゃ", "haibokusha"],
      "name": "haibokusya",
      "category": "Letters/Japanese/組み文字/否定",
      "url": "https://s3.arkjp.net/misskey/bb539f36-ffc9-456b-867a-8c2c70a95517.png"
    },
    {
      "aliases": ["君消す", "きみけす", "delet_dis", ""],
      "name": "kimikesu",
      "category": "Letters/Japanese/組み文字/否定",
      "url": "https://s3.arkjp.net/emoji/kimikesu.png"
    },
    {
      "aliases": ["怖いわ...", "怖いわ", "こわいわ", "怖いわ…", "scared"],
      "name": "kowaiwa",
      "category": "Letters/Japanese/組み文字/否定",
      "url": "https://s3.arkjp.net/emoji/kowaiwa.png"
    },
    {
      "aliases": ["何もわからん", "なんもわからん"],
      "name": "nanmowakaran",
      "category": "Letters/Japanese/組み文字/否定",
      "url": "https://s3.arkjp.net/emoji/nanmowakaran.png"
    },
    {
      "aliases": ["なんもわからんズ"],
      "name": "nannmo_wakarannzu",
      "category": "Letters/Japanese/組み文字/否定",
      "url": "https://s3.arkjp.net/emoji/nannmo_wakarannzu.png"
    },
    {
      "aliases": ["なるほどわからん", "naruhodo", "wakaran"],
      "name": "naruhodo_wakaran",
      "category": "Letters/Japanese/組み文字/否定",
      "url": "https://s3.arkjp.net/emoji/naruhodo_wakaran.png"
    },
    {
      "aliases": [
        "進捗ダメです",
        "しんちょくだめです",
        "no_progress",
        "shinchokudamedesu",
        "shinchoku_damedesu",
        "shintyokudamedesu",
        "shintyoku_damedesu",
        "sinchokudamedesu",
        "sinchoku_damedesu",
        "sintyokudamedesu",
        "sintyoku_damedesu"
      ],
      "name": "shintyoku_damedesu",
      "category": "Letters/Japanese/組み文字/否定",
      "url": "https://s3.arkjp.net/emoji/shintyoku_damedesu.png"
    },
    {
      "aliases": ["すぐ煽り", "すぐあおり", "sugu_aori"],
      "name": "suguaori",
      "category": "Letters/Japanese/組み文字/否定",
      "url": "https://s3.arkjp.net/emoji/suguaori.png"
    },
    {
      "aliases": ["わからん", "idk"],
      "name": "wakaran",
      "category": "Letters/Japanese/組み文字/否定",
      "url": "https://s3.arkjp.net/misskey/c5d47f7d-a78f-4402-84d1-d4ef50b06e24.png"
    },
    {
      "aliases": ["わからない", "idk", "i_dont_know"],
      "name": "wakaranai",
      "category": "Letters/Japanese/組み文字/否定",
      "url": "https://s3.arkjp.net/misskey/138819a7-7130-4b81-8235-6fd86da99c5e.png"
    },
    {
      "aliases": ["限界突破", "げんかいとっぱ", "genkaitoppa"],
      "name": "genkai_toppa",
      "category": "Letters/Japanese/組み文字/四字熟語",
      "url": "https://s3.arkjp.net/emoji/genkai_toppa.png"
    },
    {
      "aliases": ["他力本願", "たりきほんがん", "tarikihongan", ""],
      "name": "tariki_hongan",
      "category": "Letters/Japanese/組み文字/四字熟語",
      "url": "https://s3.arkjp.net/emoji/tariki_hongan.png"
    },
    {
      "aliases": [
        "場をわきまえようね",
        "ばをわきまえようね",
        "bawowakimaeyoune",
        "know_your_place"
      ],
      "name": "ba_wo_wakimaeyoune",
      "category": "Letters/Japanese/組み文字/提案",
      "url": "https://s3.arkjp.net/emoji/ba_wo_wakimaeyoune.png"
    },
    {
      "aliases": [
        "絵文字にして",
        "えもじにして",
        "make_it_emoji",
        "emojify_this",
        "emoji_ni_site",
        "emojinisite",
        "emojinishite"
      ],
      "name": "emoji_ni_shite",
      "category": "Letters/Japanese/組み文字/提案",
      "url": "https://s3.arkjp.net/emoji/emoji_ni_shite.png"
    },
    {
      "aliases": ["べろべろべろべろ"],
      "name": "beroberoberobero",
      "category": "Letters/Japanese/組み文字/擬音語",
      "url": "https://s3.arkjp.net/emoji/beroberoberobero.png"
    },
    {
      "aliases": ["気になる", "きになる", "kininaru"],
      "name": "kininaru",
      "category": "Letters/Japanese/組み文字/疑問",
      "url": "https://s3.arkjp.net/emoji/kininaru.png"
    },
    {
      "aliases": ["progress", "how_is_progress", "shinchoku_doudesuka"],
      "name": "shintyoku_doudesuka",
      "category": "Letters/Japanese/組み文字/疑問",
      "url": "https://s3.arkjp.net/emoji/shintyoku_doudesuka.png"
    },
    {
      "aliases": [
        "それなんてアニメ",
        "それなんてあにめ",
        "what_anime_is_that",
        "which_anime_is_that",
        "what_kind_of_anime_is_that",
        "sorenanteanime",
        "sorenante_anime",
        "sorenannteanime",
        "sorenannte_anime"
      ],
      "name": "sorenante_anime",
      "category": "Letters/Japanese/組み文字/疑問",
      "url": "https://s3.arkjp.net/emoji/sorenante_anime.png"
    },
    {
      "aliases": [
        "それなんて漫画",
        "それなんてまんが",
        "sorenanntemanga",
        "sorenantemanga",
        "what_manga_is_that",
        "which_manga_is_that",
        "what_kind_of_manga_is_that"
      ],
      "name": "sorenante_manga",
      "category": "Letters/Japanese/組み文字/疑問",
      "url": "https://s3.arkjp.net/emoji/sorenante_manga.png"
    },
    {
      "aliases": [
        "それなんてソシャゲ",
        "それなんてそしゃげ",
        "sorenanntesoshage",
        "sorenantesoshage",
        "what_social_game_is_that",
        "which_social_game_is_that",
        "what_kind_of_social_game_is_that"
      ],
      "name": "sorenante_socialgame",
      "category": "Letters/Japanese/組み文字/疑問",
      "url": "https://s3.arkjp.net/emoji/sorenante_socialgame.png"
    },
    {
      "aliases": ["あけおめ", "happy_new_year"],
      "name": "akeome",
      "category": "Letters/Japanese/組み文字/祭日",
      "url": "https://s3.arkjp.net/emoji/akeome.png"
    },
    {
      "aliases": [
        "ことよろ",
        "ことしもよろしくおねがいします",
        "new_years_greeting"
      ],
      "name": "kotoyoro",
      "category": "Letters/Japanese/組み文字/祭日",
      "url": "https://s3.arkjp.net/emoji/kotoyoro.png"
    },
    {
      "aliases": ["ですよね"],
      "name": "desuyone",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/emoji/desuyone.png"
    },
    {
      "aliases": ["えもいっ!", "えもいっ！"],
      "name": "emoit",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/misskey/8364efab-b2ea-4489-84ef-e0e7036899e9.png"
    },
    {
      "aliases": ["えらいっ!", "えらいっ！"],
      "name": "erait",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/misskey/3178789f-404e-4986-adbe-70c19210e6e4.png"
    },
    {
      "aliases": ["偉業", "いぎょう", "igyou", "goodjob", "greatjob", ""],
      "name": "igyo",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/emoji/igyo.png"
    },
    {
      "aliases": ["いいこと言う", "いいこという"],
      "name": "iikotoiu",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/emoji/iikotoiu.png"
    },
    {
      "aliases": ["完璧", "かんぺき", "kannpeki"],
      "name": "kanpeki",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/emoji/kanpeki.png"
    },
    {
      "aliases": [
        "顔が良すぎ",
        "かおがよすぎ",
        "too_handsome",
        "too_good_looking",
        "kaogayosugi"
      ],
      "name": "kao_ga_yosugi",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/emoji/kao_ga_yosugi.png"
    },
    {
      "aliases": ["期待", "きたい", ""],
      "name": "kitai",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/emoji/kitai.png"
    },
    {
      "aliases": [
        "入浴は偉業",
        "にゅうよくはいぎょう",
        "bath_is_igyo",
        "bath_is_igyou",
        "bath_is_a_feat",
        "nyuuyokuha_igyo",
        "nyuuyokuha_igyou",
        "nyuuyoku_ha_igyo",
        "nyuuyoku_ha_igyou",
        "nyuuyokuhaigyou",
        "nyuuyokuhaigyo"
      ],
      "name": "nyuuyoku_ha_igyou",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/emoji/nyuuyoku_ha_igyou.png"
    },
    {
      "aliases": ["それ", "sorena", "this", "that"],
      "name": "sore",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/misskey/8e5a4108-7109-4005-beb3-510c4e46b4da.png"
    },
    {
      "aliases": ["そうなんだ", "sonanda"],
      "name": "sounanda",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/emoji/sounanda.png"
    },
    {
      "aliases": [
        "すばらしい",
        "すばらC",
        "subarashii",
        "subarasii",
        "subarac",
        ""
      ],
      "name": "subarac",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/emoji/subarac.png"
    },
    {
      "aliases": ["たしかに", "tasikani"],
      "name": "tashikani",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/emoji/tashikani.png"
    },
    {
      "aliases": ["うまそう", "umaso"],
      "name": "umasou",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/emoji/umasou.png"
    },
    {
      "aliases": ["わからなくもない"],
      "name": "wakaranakumonai",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/emoji/wakaranakumonai.png"
    },
    {
      "aliases": ["わかる", "understand", "gotit", "agree", ""],
      "name": "wakaru",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/misskey/3bf0a4c7-9dae-4f5b-ae23-5dde0e9c0d1a.png"
    },
    {
      "aliases": ["よかった"],
      "name": "yokatta",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/emoji/yokatta.png"
    },
    {
      "aliases": [
        "優勝",
        "ゆうしょう",
        "yusho",
        "yushou",
        "yusyo",
        "yusyou",
        "yuusho",
        "yuushou",
        "yuusyo",
        "yuusyou"
      ],
      "name": "yuushou",
      "category": "Letters/Japanese/組み文字/肯定",
      "url": "https://s3.arkjp.net/emoji/yuushou.png"
    },
    {
      "aliases": ["マイニューギア", "mng"],
      "name": "my_new_gear",
      "category": "Letters/Latin",
      "url": "https://s3.arkjp.net/misskey/6ea00c11-d9d3-4ada-976f-7f431694fc06.png"
    },
    {
      "aliases": ["テスト", "てすと"],
      "name": "test",
      "category": "Letters/Latin",
      "url": "https://s3.arkjp.net/misskey/4d76d4a0-6a0a-4f63-b810-848b9df99603.png"
    },
    {
      "aliases": ["嘘八百", "うそはっぴゃく", "usohappyaku"],
      "name": "uso800",
      "category": "Letters/Latin",
      "url": "https://s3.arkjp.net/misskey/be86e299-b37b-4a9b-90c6-aaa959361f47.png"
    },
    {
      "aliases": [],
      "name": "anchan",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/anchan.png"
    },
    {
      "aliases": ["activity_pub", "activitypub", "activitypub_logo"],
      "name": "ap",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/ap.png"
    },
    {
      "aliases": [],
      "name": "bitcoin",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/bitcoin.png"
    },
    {
      "aliases": [""],
      "name": "brainworx",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/brainworx.png"
    },
    {
      "aliases": ["カロリーゼロ", "ゼロカロリー", "zero", "calorie"],
      "name": "calorie_zero",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/calorie_zero.png"
    },
    {
      "aliases": ["キャンドゥ", "100円ショップ", "100en_shop"],
      "name": "cando",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/cando.png"
    },
    {
      "aliases": [
        "えーあい",
        "エーアイ",
        "チャットエーアイ",
        "チャットジーピーティー",
        "ChatGenerativePretrainedTransformer"
      ],
      "name": "chatgpt",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/chatgpt.png"
    },
    {
      "aliases": ["ダイソー", "だいそー"],
      "name": "daiso",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/daiso.png"
    },
    {
      "aliases": [""],
      "name": "dvd_audio",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/dvd_audio.png"
    },
    {
      "aliases": [""],
      "name": "eastwest",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/eastwest.png"
    },
    {
      "aliases": [""],
      "name": "goodtale",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/goodtale.png"
    },
    {
      "aliases": ["audio"],
      "name": "hires",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/hires.jpg"
    },
    {
      "aliases": [""],
      "name": "ilok",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/ilok.png"
    },
    {
      "aliases": [""],
      "name": "insight",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/insight.png"
    },
    {
      "aliases": [""],
      "name": "izotope",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/izotope.png"
    },
    {
      "aliases": [],
      "name": "kimwipe",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/kimwipe.png"
    },
    {
      "aliases": ["marukame"],
      "name": "marugame",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/marukame.png"
    },
    {
      "aliases": [],
      "name": "mcdonalds",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/mcdonalds.png"
    },
    {
      "aliases": [""],
      "name": "midi",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/midi.png"
    },
    {
      "aliases": [""],
      "name": "midi2",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/midi2.png"
    },
    {
      "aliases": [],
      "name": "nasa",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/nasa.png"
    },
    {
      "aliases": [""],
      "name": "nectar",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/nectar.png"
    },
    {
      "aliases": [""],
      "name": "neoberb",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/neoberb.png"
    },
    {
      "aliases": [""],
      "name": "neutron",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/neutron.png"
    },
    {
      "aliases": [""],
      "name": "ozone",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/ozone.png"
    },
    {
      "aliases": ["pip", "npm"],
      "name": "p_i_p",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/p_i_p.png"
    },
    {
      "aliases": ["QC", "qcabandoned"],
      "name": "qc_abandoned",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/qc_abandoned.png"
    },
    {
      "aliases": ["qcrejected", "QC"],
      "name": "qc_rejected",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/qc_rejected.png"
    },
    {
      "aliases": [""],
      "name": "revoice",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/revoice.png"
    },
    {
      "aliases": [""],
      "name": "rx",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/rx.png"
    },
    {
      "aliases": ["らいぜん", "ライゼン", ""],
      "name": "ryzen_circle",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/ryzen_circle.png"
    },
    {
      "aliases": [],
      "name": "scp_foundation_cc_by_sa_3_0",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/scp_foundation_cc_by_sa_3_0.png"
    },
    {
      "aliases": ["セリア", "せりあ"],
      "name": "seria",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/seria.png"
    },
    {
      "aliases": [""],
      "name": "srs_wow",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/srs_wow.png"
    },
    {
      "aliases": [""],
      "name": "stamp_qcpass",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/stamp_qcpass.png"
    },
    {
      "aliases": [""],
      "name": "synchro_arts",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/synchro_arts.png"
    },
    {
      "aliases": [
        "普通",
        "ふつう",
        "local",
        "futsuu",
        "futsuuu",
        "futuu",
        "futuuu",
        "hutsuu",
        "hutsuuu",
        "hutuu",
        "hutuuu"
      ],
      "name": "type_local",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/type_local.png"
    },
    {
      "aliases": [""],
      "name": "waves",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/waves.png"
    },
    {
      "aliases": ["ヤマハモーター", ""],
      "name": "yamaha_motor_logo",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/yamaha_motor_logo.png"
    },
    {
      "aliases": [""],
      "name": "yodobashi",
      "category": "Logo",
      "url": "https://s3.arkjp.net/emoji/yodobashi.png"
    },
    {
      "aliases": [""],
      "name": "acrobat_pdf",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/acrobat_pdf.png"
    },
    {
      "aliases": ["あどべ", "アドベ"],
      "name": "adobe",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/adobe.png"
    },
    {
      "aliases": ["ATOK"],
      "name": "atok",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/atok.png"
    },
    {
      "aliases": [],
      "name": "aviutl",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/aviutl.png"
    },
    {
      "aliases": ["daw"],
      "name": "bitwig",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/bitwig.png"
    },
    {
      "aliases": [],
      "name": "blender",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/blender.png"
    },
    {
      "aliases": [],
      "name": "brave",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/brave.png"
    },
    {
      "aliases": ["browser"],
      "name": "chrome_teardrop",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/chrome_teardrop.png"
    },
    {
      "aliases": ["クリップスタジオペイント"],
      "name": "clipstudiopaint",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/clipstudiopaint.png"
    },
    {
      "aliases": [""],
      "name": "cr_edge",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/cr_edge.png"
    },
    {
      "aliases": ["social", "ディスコード", "でぃすこーど"],
      "name": "discord",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/discord.png"
    },
    {
      "aliases": ["fl", "daw"],
      "name": "flstudio",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/flstudio.png"
    },
    {
      "aliases": [
        "グラビティ",
        "グラビティー",
        "SNS",
        "sns",
        "gravity_sns",
        "gravity_logo"
      ],
      "name": "gravity",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/gravity.png"
    },
    {
      "aliases": ["アイビスペイント", "あいびすぺいんと", "aibisupeinnto"],
      "name": "ibispaint",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/ibispaint.png"
    },
    {
      "aliases": ["browser"],
      "name": "ie",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/ie.png"
    },
    {
      "aliases": [""],
      "name": "illustrator",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/illustrator.png"
    },
    {
      "aliases": ["インクスケイプ"],
      "name": "inkscape",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/inkscape.png"
    },
    {
      "aliases": ["かいてき", "快適", "快的", "カイテキ", ""],
      "name": "kaiteki",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/kaiteki.png"
    },
    {
      "aliases": ["クリタ"],
      "name": "krita",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/krita.png"
    },
    {
      "aliases": ["ミスキャット", "ミスキークライアントアプリ", "MissCat"],
      "name": "misscat",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/misscat.png"
    },
    {
      "aliases": ["icon_ririca", "miss_ririca", "icon", "miss", "ririca"],
      "name": "missririca",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/missririca.png"
    },
    {
      "aliases": [
        "mochocho_database",
        "モチョチョデータベース",
        "もちょちょでーたべーす"
      ],
      "name": "mochocho_db",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/misskey/0af751f0-82d6-44a0-82c2-05d2cf90b86e.png"
    },
    {
      "aliases": [],
      "name": "opera",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/opera.png"
    },
    {
      "aliases": [""],
      "name": "pdf",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/pdf.png"
    },
    {
      "aliases": ["ps", "フォトショ", "ふぉとしょ", "フォトショップ"],
      "name": "photoshop",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/photoshop.png"
    },
    {
      "aliases": [],
      "name": "reaper",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/reaper.png"
    },
    {
      "aliases": ["browser"],
      "name": "safari",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/safari.png"
    },
    {
      "aliases": [
        "paint_tool_sai",
        "彩",
        "さい",
        "ペイントツール彩",
        "ペイントツールSAI",
        "easy_paint_tool_sai"
      ],
      "name": "sai",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/sai.png"
    },
    {
      "aliases": [""],
      "name": "skype",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/skype.png"
    },
    {
      "aliases": [""],
      "name": "socialhub",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/socialhub.png"
    },
    {
      "aliases": ["daw"],
      "name": "studio_one",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/studio_one.png"
    },
    {
      "aliases": ["subway_tooter"],
      "name": "subwaytooter",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/subwaytooter.png"
    },
    {
      "aliases": [
        "thunderbird_logo",
        "サンダーバード",
        "雷鳥",
        "mozilla_thunderbird"
      ],
      "name": "thunderbird",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/thunderbird.png"
    },
    {
      "aliases": [
        "tor",
        "browser",
        "onion",
        "onon_browser",
        "トーア",
        "トア",
        "トーアブラウザ",
        "トアブラウザ"
      ],
      "name": "tor_browser",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/tor_browser.png"
    },
    {
      "aliases": [""],
      "name": "vivaldi",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/vivaldi.png"
    },
    {
      "aliases": [""],
      "name": "vlc",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/vlc.png"
    },
    {
      "aliases": [""],
      "name": "vroidstudio",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/emoji/vroidstudio.png"
    },
    {
      "aliases": ["よっ"],
      "name": "yo",
      "category": "Logo/Apps",
      "url": "https://s3.arkjp.net/misskey/8c04c259-a256-4812-8237-d2cd827ab03c.png"
    },
    {
      "aliases": ["activity_pub", "activity_pub_logo"],
      "name": "activitypub",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/activitypub.png"
    },
    {
      "aliases": [],
      "name": "cloudflare",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/cloudflare.png"
    },
    {
      "aliases": [""],
      "name": "dart",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/dart.png"
    },
    {
      "aliases": ["デノ", "deno_logo", "deno_dinosaur"],
      "name": "deno",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/deno.png"
    },
    {
      "aliases": [],
      "name": "digitalocean",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/digitalocean.png"
    },
    {
      "aliases": [],
      "name": "docker",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/docker.png"
    },
    {
      "aliases": ["フォートラン"],
      "name": "fortran",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/fortran.png"
    },
    {
      "aliases": [
        "ギット",
        "version_control_system",
        "git_logo",
        "バージョン管理",
        "version_management",
        ""
      ],
      "name": "git",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/git.png"
    },
    {
      "aliases": [],
      "name": "github",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/github.png"
    },
    {
      "aliases": [],
      "name": "gitlab",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/gitlab.png"
    },
    {
      "aliases": [],
      "name": "grunt",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/grunt.png"
    },
    {
      "aliases": ["ハスケル"],
      "name": "haskell",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/haskell.png"
    },
    {
      "aliases": ["hot_soup_processor", "hsp_logo", "ホットスーププロセッサ"],
      "name": "hsp",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/hsp.png"
    },
    {
      "aliases": [""],
      "name": "javascript",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/javascript.png"
    },
    {
      "aliases": [""],
      "name": "linux",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/linux.png"
    },
    {
      "aliases": ["リスプ", "lisp_logo"],
      "name": "lisp",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/lisp.png"
    },
    {
      "aliases": ["lisp", "alien", "リスプ", "エイリアン", "lisplogo_alien"],
      "name": "lisp_alien",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/lisp_alien.png"
    },
    {
      "aliases": [
        "hg",
        "バージョン管理",
        "version_management",
        "version_control_system"
      ],
      "name": "mercurial",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/misskey/66ce19da-fa01-4b2e-96bc-5bcba8d7a099.png"
    },
    {
      "aliases": [],
      "name": "mongodb",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/mongodb.png"
    },
    {
      "aliases": [""],
      "name": "MySQL",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/MySQL.png"
    },
    {
      "aliases": ["ニム", "nim_crown", "nim_logo"],
      "name": "nim",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/nim.png"
    },
    {
      "aliases": [],
      "name": "nodejs",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/nodejs.png"
    },
    {
      "aliases": [],
      "name": "openstack",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/openstack.png"
    },
    {
      "aliases": [""],
      "name": "perl",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/misskey/5692078b-a773-46a3-9232-388b39c2d2d0.png"
    },
    {
      "aliases": [
        "perl",
        "camel",
        "perl_logo",
        "perl_symbol",
        "パール",
        "パールキャメル",
        "ラクダ",
        "perlのラクダ"
      ],
      "name": "perl_camel",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/perl_camel.png"
    },
    {
      "aliases": [],
      "name": "python",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/python.png"
    },
    {
      "aliases": ["perl6"],
      "name": "raku",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/misskey/fa4a9763-be87-4eea-bc19-b1a97a14dea4.png"
    },
    {
      "aliases": [],
      "name": "redis",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/redis.png"
    },
    {
      "aliases": ["ルビー", "rubygem", "ruby_logo"],
      "name": "ruby",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/ruby.png"
    },
    {
      "aliases": [""],
      "name": "rust",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/rust.png"
    },
    {
      "aliases": [
        "svn",
        "apache_subversion",
        "サブバージョン",
        "アパッチサブバージョン",
        "バージョン管理",
        "version_management",
        "version_control_system"
      ],
      "name": "subversion",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/misskey/9f201d70-cefb-41e6-af6a-ce8762988794.png"
    },
    {
      "aliases": ["ts", "タイプスクリプト", "typescript_logo"],
      "name": "typescript",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/typescript.png"
    },
    {
      "aliases": [],
      "name": "vue",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/vue.png"
    },
    {
      "aliases": [],
      "name": "wasabi",
      "category": "Logo/Develop",
      "url": "https://s3.arkjp.net/emoji/wasabi.png"
    },
    {
      "aliases": ["jetbrains", "ac"],
      "name": "appcode",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/appcode.png"
    },
    {
      "aliases": ["jetbrains", "cl"],
      "name": "clion",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/clion.png"
    },
    {
      "aliases": ["jetbrains", "dg"],
      "name": "datagrip",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/datagrip.png"
    },
    {
      "aliases": ["jetbrains", "dl"],
      "name": "datalore",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/datalore.png"
    },
    {
      "aliases": ["jetbrains", "dc"],
      "name": "dotcover",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/dotcover.png"
    },
    {
      "aliases": ["jetbrains", "dm"],
      "name": "dotmemory",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/dotmemory.png"
    },
    {
      "aliases": ["jetbrains", "dp"],
      "name": "dotpeek",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/dotpeek.png"
    },
    {
      "aliases": ["jetbrains", "dt"],
      "name": "dottrace",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/dottrace.png"
    },
    {
      "aliases": ["jetbrains", "go"],
      "name": "goland",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/goland.png"
    },
    {
      "aliases": ["jetbrains", "hb"],
      "name": "hub",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/hub.png"
    },
    {
      "aliases": ["jetbrains", "ij", "idea"],
      "name": "intellij",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/intellij.png"
    },
    {
      "aliases": ["ジェットブレインズ"],
      "name": "jetbrains",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/jetbrains.png"
    },
    {
      "aliases": ["jetbrains"],
      "name": "kotlin",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/kotlin.png"
    },
    {
      "aliases": ["jetbrains"],
      "name": "mps",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/mps.png"
    },
    {
      "aliases": ["jetbrains", "ps"],
      "name": "phpstorm",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/phpstorm.png"
    },
    {
      "aliases": ["jetbrains", "pc"],
      "name": "pycharm",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/pycharm.png"
    },
    {
      "aliases": ["jetbrains", "rs"],
      "name": "resharper",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/resharper.png"
    },
    {
      "aliases": ["jetbrains", "rsc", "resharper-cpp"],
      "name": "resharper_cpp",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/resharper_cpp.png"
    },
    {
      "aliases": ["jetbrains", "rd"],
      "name": "rider",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/rider.png"
    },
    {
      "aliases": ["jetbrains", "rm"],
      "name": "rubymine",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/rubymine.png"
    },
    {
      "aliases": ["jetbrains"],
      "name": "space",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/space.png"
    },
    {
      "aliases": ["jetbrains", "tc"],
      "name": "teamcity",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/teamcity.png"
    },
    {
      "aliases": ["jetbrains"],
      "name": "toolbox",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/toolbox.png"
    },
    {
      "aliases": ["jetbrains", "up"],
      "name": "upsource",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/upsource.png"
    },
    {
      "aliases": ["jetbrains", "ws"],
      "name": "webstorm",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/webstorm.png"
    },
    {
      "aliases": ["jetbrains", "yt"],
      "name": "youtrack",
      "category": "Logo/Develop/JetBrains",
      "url": "https://s3.arkjp.net/emoji/youtrack.png"
    },
    {
      "aliases": [],
      "name": "amd",
      "category": "Logo/Famous",
      "url": "https://s3.arkjp.net/emoji/amd.png"
    },
    {
      "aliases": [],
      "name": "android",
      "category": "Logo/Famous",
      "url": "https://s3.arkjp.net/emoji/android.png"
    },
    {
      "aliases": ["ホロライブ", "hororaibu"],
      "name": "hololive",
      "category": "Logo/Famous",
      "url": "https://s3.arkjp.net/emoji/hololive.png"
    },
    {
      "aliases": [],
      "name": "intel",
      "category": "Logo/Famous",
      "url": "https://s3.arkjp.net/emoji/intel.png"
    },
    {
      "aliases": [],
      "name": "microsoft",
      "category": "Logo/Famous",
      "url": "https://s3.arkjp.net/emoji/microsoft.png"
    },
    {
      "aliases": [
        "にじさんじ",
        "nijisanji",
        "nijisanzi",
        "niji3ji",
        "niji3zi",
        "nizisanji",
        "nizisanzi",
        "nizi3ji",
        "nizi3zi",
        "2jisanji",
        "2jisanzi",
        "2ji3ji",
        "2ji3zi",
        "2zisanji",
        "2zisanzi",
        "2zi3ji",
        "2zi3zi",
        "23"
      ],
      "name": "nijisanji",
      "category": "Logo/Famous",
      "url": "https://s3.arkjp.net/emoji/nijisanji.png"
    },
    {
      "aliases": ["ea"],
      "name": "apex",
      "category": "Logo/Games",
      "url": "https://s3.arkjp.net/emoji/apex.png"
    },
    {
      "aliases": [
        "原神",
        "原神",
        "げんしん",
        "ゲンシン",
        "ｹﾞﾝｼﾝ",
        "logo_genshin"
      ],
      "name": "genshin",
      "category": "Logo/Games",
      "url": "https://s3.arkjp.net/emoji/genshin.png"
    },
    {
      "aliases": ["ea"],
      "name": "knockout_city",
      "category": "Logo/Games",
      "url": "https://s3.arkjp.net/emoji/knockout_city.png"
    },
    {
      "aliases": [""],
      "name": "leagueoflegends",
      "category": "Logo/Games",
      "url": "https://s3.arkjp.net/emoji/leagueoflegends.png"
    },
    {
      "aliases": [""],
      "name": "mabinogi",
      "category": "Logo/Games",
      "url": "https://s3.arkjp.net/emoji/mabinogi.png"
    },
    {
      "aliases": ["neos", "ネオス", "NeosVR", ""],
      "name": "neosvr",
      "category": "Logo/Games",
      "url": "https://s3.arkjp.net/emoji/neosvr.png"
    },
    {
      "aliases": [""],
      "name": "osu",
      "category": "Logo/Games",
      "url": "https://s3.arkjp.net/emoji/osu.png"
    },
    {
      "aliases": [
        "落ちないで.io",
        "落ちないでio",
        "おちないでどっとあいおー",
        "おちないであいおー"
      ],
      "name": "otinaide_io",
      "category": "Logo/Games",
      "url": "https://s3.arkjp.net/emoji/otinaide_io.png"
    },
    {
      "aliases": [],
      "name": "steam",
      "category": "Logo/Games",
      "url": "https://s3.arkjp.net/emoji/steam.png"
    },
    {
      "aliases": [""],
      "name": "vrc",
      "category": "Logo/Games",
      "url": "https://s3.arkjp.net/emoji/vrc.png"
    },
    {
      "aliases": [""],
      "name": "vrchat",
      "category": "Logo/Games",
      "url": "https://s3.arkjp.net/emoji/vrchat.png"
    },
    {
      "aliases": ["almalinux", "alma", "アルマ"],
      "name": "alma_linux",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/alma_linux.png"
    },
    {
      "aliases": [
        "アーチ",
        "archlinux",
        "arch_linux",
        "linux",
        "リナックス",
        "ライナックス"
      ],
      "name": "arch",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/arch.png"
    },
    {
      "aliases": [
        "asahi_linux",
        "asahi",
        "linux",
        "朝日リナックス",
        "あさひ",
        "リナックス",
        "ライナックス"
      ],
      "name": "asahilinux",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/asahilinux.png"
    },
    {
      "aliases": ["macos", "apple", "macintosh", "mach"],
      "name": "darlinghq",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/darlinghq.png"
    },
    {
      "aliases": ["dosbox", "msdos"],
      "name": "dosbox",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/dosbox.png"
    },
    {
      "aliases": [
        "fedora_os",
        "fedora_logo",
        "fedora_linux",
        "フェドラ",
        "linux",
        "フェドーラ"
      ],
      "name": "fedora",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/fedora.png"
    },
    {
      "aliases": ["bsd", "フリービーエスディー"],
      "name": "freebsd",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/freebsd.png"
    },
    {
      "aliases": [
        "gentoo_linux",
        "linux",
        "ジェントゥー",
        "ゲントゥー",
        "ジェンツー",
        "ゲンツー"
      ],
      "name": "gentoo",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/gentoo.png"
    },
    {
      "aliases": ["BeOS", "haiku", "俳句", "はいく"],
      "name": "haiku",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/haiku.png"
    },
    {
      "aliases": ["iOS", "アイオーエス", "あいおーえす", ""],
      "name": "ios",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/ios.png"
    },
    {
      "aliases": ["kalilinux", "kali_linux", "カリ"],
      "name": "kali_dragon",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/kali_dragon.png"
    },
    {
      "aliases": ["android"],
      "name": "lineage_os",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/lineage_os.png"
    },
    {
      "aliases": ["マギア", "マギアリナックス", "linux", "mageia_linux"],
      "name": "mageia",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/mageia.png"
    },
    {
      "aliases": ["マンジャロ", "manjaro_linux", "arch_based", "linux"],
      "name": "manjaro",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/manjaro.png"
    },
    {
      "aliases": [
        "ニクスオーエス",
        "ニクス",
        "ニックス",
        "ニックスオーエス",
        "nix_os",
        "nix",
        "linux"
      ],
      "name": "nixos",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/nixos.png"
    },
    {
      "aliases": ["reactos", "windows"],
      "name": "reactos",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/reactos.png"
    },
    {
      "aliases": ["red_hat", "レッドハット", "赤帽子", "赤帽"],
      "name": "redhat",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/redhat.png"
    },
    {
      "aliases": ["rockylinux", "rocky", "ロッキー"],
      "name": "rocky_linux",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/rocky_linux.png"
    },
    {
      "aliases": ["wine", "windows", "wine_is_not_an_emulator"],
      "name": "winehq",
      "category": "Logo/OS",
      "url": "https://s3.arkjp.net/emoji/winehq.png"
    },
    {
      "aliases": ["works_on_my_machine", ""],
      "name": "worksonmymachine",
      "category": "Logo/Other",
      "url": "https://s3.arkjp.net/emoji/worksonmymachine.png"
    },
    {
      "aliases": ["yubico_logo", "yubikey", "yubico_favicon", "favicon_yubico"],
      "name": "yubico",
      "category": "Logo/Other",
      "url": "https://s3.arkjp.net/emoji/yubico.png"
    },
    {
      "aliases": ["yubico", "yubico_logo"],
      "name": "yubico_title",
      "category": "Logo/Other",
      "url": "https://s3.arkjp.net/emoji/yubico_title.png"
    },
    {
      "aliases": [""],
      "name": "5g",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/5g.png"
    },
    {
      "aliases": ["あっこま", "あつこま", "アツコマ", "アッコマ"],
      "name": "akkoma",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/akkoma.png"
    },
    {
      "aliases": [],
      "name": "ap_amzn",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/ap_amzn.png"
    },
    {
      "aliases": [""],
      "name": "audioplugin_deals",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/audioplugin_deals.png"
    },
    {
      "aliases": [""],
      "name": "aws",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/aws.png"
    },
    {
      "aliases": [""],
      "name": "azure",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/azure.png"
    },
    {
      "aliases": ["ブース", "booth.pm"],
      "name": "booth",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/booth.png"
    },
    {
      "aliases": ["github_copilot"],
      "name": "copilot",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/copilot.png"
    },
    {
      "aliases": ["くるっぷ", "クルップ", "SNS", "sns", "kuruppu", "crepu_sns"],
      "name": "crepu",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/crepu.png"
    },
    {
      "aliases": [],
      "name": "dlsite",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/dlsite.png"
    },
    {
      "aliases": [""],
      "name": "evernote",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/evernote.png"
    },
    {
      "aliases": ["ファンクホエール", "ファンクヱール", "クジラ", "鯨"],
      "name": "funkwhale",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/funkwhale.png"
    },
    {
      "aliases": ["ガーシー丼", "がーしー", ""],
      "name": "gc2",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/gc2.png"
    },
    {
      "aliases": ["google", "search_it_yourself"],
      "name": "ggrks_search",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/ggrks_search.png"
    },
    {
      "aliases": ["ギンプ"],
      "name": "gimp",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/gimp.png"
    },
    {
      "aliases": ["gnusocial", "ぐにゅー", "ぐぬそ", "言論の自由", ""],
      "name": "gnu_social",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/gnu_social.png"
    },
    {
      "aliases": ["pornhub"],
      "name": "hub_porn",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/hub_porn.png"
    },
    {
      "aliases": ["imode", "iモード"],
      "name": "i_mode",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/i_mode.png"
    },
    {
      "aliases": ["misskey_io", "misskeyio"],
      "name": "io",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/io.png"
    },
    {
      "aliases": [""],
      "name": "java",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/java.png"
    },
    {
      "aliases": ["javascript_meme"],
      "name": "javascript_with_coffeecup",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/javascript_with_coffeecup.png"
    },
    {
      "aliases": [],
      "name": "keybase",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/keybase.png"
    },
    {
      "aliases": [
        "marshmallow",
        "marshmallow-qa",
        "マシュマロ",
        "マシュマロ",
        "質問箱",
        "qa",
        "QA",
        ""
      ],
      "name": "marshmallow_qa",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/marshmallow_qa.png"
    },
    {
      "aliases": ["social", "sns", "ますとどん", "マストドン"],
      "name": "mastodon",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/mastodon.png"
    },
    {
      "aliases": ["ミルクティー"],
      "name": "milktea",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/milktea.png"
    },
    {
      "aliases": ["パトレオン"],
      "name": "patreon",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/patreon.png"
    },
    {
      "aliases": ["ペイパル"],
      "name": "paypal",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/paypal.png"
    },
    {
      "aliases": ["peertube_logo"],
      "name": "peertube",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/peertube.png"
    },
    {
      "aliases": ["プレロマ", "ぷれろま"],
      "name": "pleroma",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/pleroma.png"
    },
    {
      "aliases": [""],
      "name": "plugin_alliance",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/plugin_alliance.png"
    },
    {
      "aliases": [""],
      "name": "plugin_boutique",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/plugin_boutique.png"
    },
    {
      "aliases": ["くいっぷ", "クイップ", "kuippu", ""],
      "name": "quip",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/quip.png"
    },
    {
      "aliases": ["レディット"],
      "name": "reddit",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/reddit.png"
    },
    {
      "aliases": [],
      "name": "slack",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/slack.png"
    },
    {
      "aliases": [],
      "name": "soundcloud",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/soundcloud.png"
    },
    {
      "aliases": ["さぶまりん", "サブマリン"],
      "name": "submarin",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/submarin.png"
    },
    {
      "aliases": [""],
      "name": "telegram",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/telegram.png"
    },
    {
      "aliases": ["ツイッチ", "ついっち"],
      "name": "twitch",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/misskey/e43c2a0c-b186-456b-a69c-eee3e47f9b56.png"
    },
    {
      "aliases": [],
      "name": "twitter",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/twitter.png"
    },
    {
      "aliases": [
        "ひ",
        "ヒ",
        "ﾋ",
        "hi",
        "twitter_logo",
        "twitter",
        "logo_twitter",
        "twitter_favicon",
        "twitter_icon"
      ],
      "name": "twitter2006",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/twitter2006.png"
    },
    {
      "aliases": [],
      "name": "unext",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/unext.png"
    },
    {
      "aliases": ["vultr", "ヴァルチャー", "バルチャー"],
      "name": "vultr_bird",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/vultr_bird.png"
    },
    {
      "aliases": [],
      "name": "youtube",
      "category": "Logo/Service",
      "url": "https://s3.arkjp.net/emoji/youtube.png"
    },
    {
      "aliases": ["github_atom"],
      "name": "atom",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/atom.png"
    },
    {
      "aliases": [""],
      "name": "EclipseIDE",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/EclipseIDE.png"
    },
    {
      "aliases": ["gnu_emacs", "gnuemacs", "イーマックス"],
      "name": "emacs",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/emacs.png"
    },
    {
      "aliases": [],
      "name": "excel",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/excel.png"
    },
    {
      "aliases": ["nano"],
      "name": "gnu_nano",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/gnu_nano.png"
    },
    {
      "aliases": [
        "ヘリックス",
        "ヒリックス",
        "helix",
        "editor",
        "post_modern_text_editor"
      ],
      "name": "helix_editor",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/helix_editor.png"
    },
    {
      "aliases": ["一太郎", "いちたろう", "ititaro"],
      "name": "ichitarou",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/ichitarou.png"
    },
    {
      "aliases": [""],
      "name": "kakoune",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/kakoune.png"
    },
    {
      "aliases": [""],
      "name": "kate",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/kate.png"
    },
    {
      "aliases": ["latex", "らてふ", ""],
      "name": "latex_logo",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/misskey/4c85e6f4-3e8b-4831-8459-ee4719793a85.png"
    },
    {
      "aliases": ["リーフパッド", "leafpad_text_ediitor"],
      "name": "leafpad",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/leafpad.png"
    },
    {
      "aliases": ["メリー"],
      "name": "mery",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/mery.png"
    },
    {
      "aliases": [""],
      "name": "neovim",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/neovim.png"
    },
    {
      "aliases": ["notepad++"],
      "name": "notepad_plus_plus",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/notepad_plus_plus.png"
    },
    {
      "aliases": [],
      "name": "office",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/office.png"
    },
    {
      "aliases": [],
      "name": "onenote",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/onenote.png"
    },
    {
      "aliases": [],
      "name": "powerpoint",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/powerpoint.png"
    },
    {
      "aliases": [
        "サクラエディタ",
        "さくらえでぃた",
        "sakuraeditor",
        "sakura",
        "text_editor"
      ],
      "name": "sakura_editor",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/sakura_editor.png"
    },
    {
      "aliases": ["sublime", "sublimetext"],
      "name": "sublime_text",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/sublime_text.png"
    },
    {
      "aliases": ["テラパッド", "terapad_text_editor", "tpad", "tpadicon"],
      "name": "terapad",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/terapad.gif"
    },
    {
      "aliases": [],
      "name": "vim",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/vim.png"
    },
    {
      "aliases": ["visualstudio", "microsoft_visual_studio"],
      "name": "visual_studio",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/visual_studio.png"
    },
    {
      "aliases": ["vscode", "vim", "vi"],
      "name": "v_scode",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/v_scode.png"
    },
    {
      "aliases": ["notepad", "ノートパッド", "メモ帳", "microsoft_notepad"],
      "name": "windows_notepad",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/windows_notepad.png"
    },
    {
      "aliases": [],
      "name": "word",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/word.png"
    },
    {
      "aliases": ["microsoft_wordpad", "windows_wordpad", "ワードパッド"],
      "name": "wordpad",
      "category": "Logo/TextEditor",
      "url": "https://s3.arkjp.net/emoji/wordpad.png"
    },
    {
      "aliases": [""],
      "name": "neko_cats_eye",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_cats_eye.png"
    },
    {
      "aliases": [""],
      "name": "neko_cats_eye_blue",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_cats_eye_blue.png"
    },
    {
      "aliases": [],
      "name": "neko_closing_eyes",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_closing_eyes.png"
    },
    {
      "aliases": [""],
      "name": "neko_eyes_shut",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_eyes_shut.png"
    },
    {
      "aliases": [""],
      "name": "neko_fish",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_fish.png"
    },
    {
      "aliases": [""],
      "name": "neko_frowning",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_frowning.png"
    },
    {
      "aliases": [""],
      "name": "neko_glasses3",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_glasses3.png"
    },
    {
      "aliases": [""],
      "name": "neko_gray",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_gray.png"
    },
    {
      "aliases": [""],
      "name": "neko_nyaan",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_nyaan.png"
    },
    {
      "aliases": [""],
      "name": "neko_oinari",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_oinari.png"
    },
    {
      "aliases": [""],
      "name": "neko_relax",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_relax.png"
    },
    {
      "aliases": [""],
      "name": "neko_roling_eyes",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_roling_eyes.png"
    },
    {
      "aliases": [""],
      "name": "neko_roling_eyes2",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_roling_eyes2.png"
    },
    {
      "aliases": [""],
      "name": "neko_sad",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_sad.png"
    },
    {
      "aliases": [""],
      "name": "neko_siam",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_siam.png"
    },
    {
      "aliases": [""],
      "name": "neko_smiley",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_smiley.png"
    },
    {
      "aliases": [""],
      "name": "neko_smirk",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_smirk.png"
    },
    {
      "aliases": [""],
      "name": "neko_star_eyes",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_star_eyes.png"
    },
    {
      "aliases": [""],
      "name": "neko_sunglasses",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_sunglasses.png"
    },
    {
      "aliases": [""],
      "name": "neko_sweat",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_sweat.png"
    },
    {
      "aliases": [""],
      "name": "neko_thinking",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_thinking.png"
    },
    {
      "aliases": [],
      "name": "neko_tired",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_tired.png"
    },
    {
      "aliases": [""],
      "name": "neko_tired2",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_tired2.png"
    },
    {
      "aliases": [""],
      "name": "neko_xd",
      "category": "NekoCats",
      "url": "https://s3.arkjp.net/emoji/neko_xd.png"
    },
    {
      "aliases": ["ベル", "チリン", "チンチン"],
      "name": "aemoji_bell",
      "category": "Objects",
      "url": "https://s3.arkjp.net/emoji/aemoji_bell.gif"
    },
    {
      "aliases": ["ic", "qfp"],
      "name": "ic_qfp",
      "category": "Objects",
      "url": "https://s3.arkjp.net/misskey/46038f93-d095-4778-bdc0-705efb5af5ab.png"
    },
    {
      "aliases": [
        "rest_in_peace",
        "tombstone",
        "墓石",
        "お墓",
        "おはか",
        "はかいし",
        "リップ",
        "りっぷ",
        "死",
        "し",
        "死にました",
        "しにました"
      ],
      "name": "rip",
      "category": "Objects",
      "url": "https://s3.arkjp.net/emoji/rip.png"
    },
    {
      "aliases": [
        "yubico",
        "key",
        "yubiKey_5",
        "yubikey_nfc",
        "nfc",
        "yubikey_nano",
        ""
      ],
      "name": "yubikey",
      "category": "Objects",
      "url": "https://s3.arkjp.net/emoji/yubikey.png"
    },
    {
      "aliases": ["道具", "はんだごて", "solder"],
      "name": "soldering",
      "category": "Objects/Tools",
      "url": "https://s3.arkjp.net/misskey/7a4c94a4-3584-4e77-8ec9-fe95e9598438.png"
    },
    {
      "aliases": [""],
      "name": "00",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/00.png"
    },
    {
      "aliases": [""],
      "name": "000",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/000.png"
    },
    {
      "aliases": [],
      "name": "04",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/04.png"
    },
    {
      "aliases": ["点数", "points"],
      "name": "100minuspts",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/100minuspts.png"
    },
    {
      "aliases": [""],
      "name": "110",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/110.png"
    },
    {
      "aliases": [""],
      "name": "1up",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/1up.png"
    },
    {
      "aliases": [
        "hanshin",
        "はんしん",
        "阪神",
        "なんでや！阪神関係ないやろ！",
        "なんでや!阪神関係ないやろ!"
      ],
      "name": "334",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/334.png"
    },
    {
      "aliases": [],
      "name": "575",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/575.png"
    },
    {
      "aliases": ["clock", "時計", "とけい"],
      "name": "acceleratedclock",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/acceleratedclock.gif"
    },
    {
      "aliases": [""],
      "name": "agooglehearts",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/agooglehearts.apng"
    },
    {
      "aliases": [""],
      "name": "agoogleoctopus",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/agoogleoctopus.apng"
    },
    {
      "aliases": ["dangerous"],
      "name": "ba90",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/ba90.png"
    },
    {
      "aliases": [],
      "name": "blank",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/blank.png"
    },
    {
      "aliases": ["fire", "火", "ひ"],
      "name": "blaze",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/blaze.gif"
    },
    {
      "aliases": [],
      "name": "chikuwa",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/chikuwa.png"
    },
    {
      "aliases": ["時計", "とけい"],
      "name": "clock",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/clock.gif"
    },
    {
      "aliases": [],
      "name": "cv",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/cv.png"
    },
    {
      "aliases": ["matrix", "まとりっくす", "マトリックス"],
      "name": "cyber_hacking",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/cyber_hacking.gif"
    },
    {
      "aliases": [""],
      "name": "disputed",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/disputed.png"
    },
    {
      "aliases": [
        "keisatsu",
        "police_siren",
        "alarm",
        "light",
        "rotating_light",
        "flash",
        "flashing_red_light",
        "rotating_red_light",
        "red_light_rotating",
        "pi-po-",
        "patoka-noare",
        "patrol_light",
        "patolight",
        "patlight",
        "light_patrolcar",
        "patrol_car_lights"
      ],
      "name": "emergency",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/emergency.apng"
    },
    {
      "aliases": [
        "esperanto",
        "エスペラント",
        "エスペラント語",
        "世界語",
        "希望語",
        ""
      ],
      "name": "eo_flag",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/eo_flag.png"
    },
    {
      "aliases": [],
      "name": "error",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/error.png"
    },
    {
      "aliases": [""],
      "name": "explosion",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/explosion.apng"
    },
    {
      "aliases": ["fake", "news"],
      "name": "fakenews",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/fakenews.png"
    },
    {
      "aliases": [""],
      "name": "github_unicorn",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/github_unicorn.png"
    },
    {
      "aliases": ["阪神", "はんしん"],
      "name": "hanshin",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/hanshin.png"
    },
    {
      "aliases": [],
      "name": "hasta_la_vista",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/hasta_la_vista.png"
    },
    {
      "aliases": [""],
      "name": "hokkaidou",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/hokkaidou.png"
    },
    {
      "aliases": ["clock", "時計", "とけい"],
      "name": "hyperacceleratedclock_backwards",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/hyperacceleratedclock_backwards.gif"
    },
    {
      "aliases": ["china"],
      "name": "jiangshi",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/jiangshi.png"
    },
    {
      "aliases": [],
      "name": "karakarauo",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/karakarauo.png"
    },
    {
      "aliases": [],
      "name": "laser",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/laser.png"
    },
    {
      "aliases": [""],
      "name": "loading",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/loading.apng"
    },
    {
      "aliases": ["loading", "cursor", "mouse", "mac"],
      "name": "macos",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/macos.apng"
    },
    {
      "aliases": [],
      "name": "mappin",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/mappin.png"
    },
    {
      "aliases": ["cake", "ケーキ", "マイクラ"],
      "name": "minecraft_cake",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/minecraft_cake.gif"
    },
    {
      "aliases": ["tnt", "マイクラ"],
      "name": "minecraft_tnt",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/minecraft_tnt.gif"
    },
    {
      "aliases": [""],
      "name": "need_for_sleep",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/need_for_sleep.png"
    },
    {
      "aliases": [""],
      "name": "negi",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/negi.png"
    },
    {
      "aliases": [""],
      "name": "nervouscursor",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/nervouscursor.gif"
    },
    {
      "aliases": [],
      "name": "new_l",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/new_l.png"
    },
    {
      "aliases": [],
      "name": "new_r",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/new_r.png"
    },
    {
      "aliases": [],
      "name": "pangya_jikan",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/pangya_jikan.apng"
    },
    {
      "aliases": ["ban"],
      "name": "prohibit_bath",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/prohibit_bath.png"
    },
    {
      "aliases": ["ban"],
      "name": "prohibit_water",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/prohibit_water.png"
    },
    {
      "aliases": [""],
      "name": "pui",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/pui.png"
    },
    {
      "aliases": ["パンチ"],
      "name": "punch_left_fast",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/punch_left_fast.gif"
    },
    {
      "aliases": [],
      "name": "radioactive",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/radioactive.png"
    },
    {
      "aliases": [""],
      "name": "rec",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/rec.png"
    },
    {
      "aliases": [],
      "name": "score_65535",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/score_65535.png"
    },
    {
      "aliases": [""],
      "name": "simcard",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/simcard.png"
    },
    {
      "aliases": [""],
      "name": "speechbubble",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/speechbubble.png"
    },
    {
      "aliases": [""],
      "name": "speechbubble_",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/speechbubble_.png"
    },
    {
      "aliases": [""],
      "name": "speechbubble_rant_left",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/speechbubble_rant_left.png"
    },
    {
      "aliases": [""],
      "name": "speechbubble_zigzag_left",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/speechbubble_zigzag_left.png"
    },
    {
      "aliases": [""],
      "name": "speechbubble_zigzag_right",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/speechbubble_zigzag_right.png"
    },
    {
      "aliases": [],
      "name": "supertada",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/supertada.gif"
    },
    {
      "aliases": [""],
      "name": "tada_broccoli",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/tada_broccoli.png"
    },
    {
      "aliases": [],
      "name": "tetrapod1",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/tetrapod1.png"
    },
    {
      "aliases": [""],
      "name": "thought_bubble",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/thought_bubble.png"
    },
    {
      "aliases": [""],
      "name": "thought_bubble_",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/thought_bubble_.png"
    },
    {
      "aliases": [
        "toki_pona",
        "ときぽな",
        "トキポナ",
        "도기보나",
        "道本語",
        "道本",
        ""
      ],
      "name": "tokipona",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/tokipona.png"
    },
    {
      "aliases": ["china"],
      "name": "touhuku",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/touhuku.png"
    },
    {
      "aliases": [""],
      "name": "twitter_fact_check",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/twitter_fact_check.png"
    },
    {
      "aliases": [],
      "name": "twitter_heart",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/twitter_heart.apng"
    },
    {
      "aliases": ["ウクレレ"],
      "name": "ukulele",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/ukulele.png"
    },
    {
      "aliases": [""],
      "name": "uni",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/uni.png"
    },
    {
      "aliases": [""],
      "name": "uptoyou",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/uptoyou.png"
    },
    {
      "aliases": [],
      "name": "vs",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/vs.gif"
    },
    {
      "aliases": [""],
      "name": "win_computer",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/win_computer.png"
    },
    {
      "aliases": [""],
      "name": "you_are_winner",
      "category": "Other",
      "url": "https://s3.arkjp.net/emoji/you_are_winner.png"
    },
    {
      "aliases": ["takagi", "joyman", "ジョイマン", "じょいまん"],
      "name": "nananana",
      "category": "People",
      "url": "https://s3.arkjp.net/emoji/nananana.png"
    },
    {
      "aliases": [
        "icon_c30",
        "sky",
        "青い空",
        "空",
        "そら",
        "青空",
        "あおそら",
        "あおぞら"
      ],
      "name": "c30",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/c30.png"
    },
    {
      "aliases": ["ででお", "デデオ"],
      "name": "dedeo",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/dedeo.png"
    },
    {
      "aliases": ["balloon", "風船", "ふうせん", "fu-sen", "icon_fu-sen", ""],
      "name": "icon_balloon",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/icon_balloon.png"
    },
    {
      "aliases": ["goma", "ごま", "ゴマ", "胡麻", "icon_g0ma_", "g0ma_icon"],
      "name": "icon_goma",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/icon_goma.png"
    },
    {
      "aliases": [
        "hisubway_icon",
        "はいさぶうぇい",
        "はいさぶゑい",
        "サブウェイ",
        "サブヱイ",
        "hisubway",
        "怪レい日本语"
      ],
      "name": "icon_hisubway",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/icon_hisubway.jpg"
    },
    {
      "aliases": ["伊塚キヨ子", "いづかきよこ", "iduka_kiyoko"],
      "name": "icon_kiyoko",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/misskey/ef09c183-07c1-469d-937e-e6f3b16f06f0.jpg"
    },
    {
      "aliases": ["kiyomaru", "きよまる"],
      "name": "icon_kiyomaru",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/icon_kiyomaru.png"
    },
    {
      "aliases": [""],
      "name": "icon_long_mewlme_bottom",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/icon_long_mewlme_bottom.png"
    },
    {
      "aliases": [""],
      "name": "icon_long_mewlme_chest",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/icon_long_mewlme_chest.png"
    },
    {
      "aliases": [""],
      "name": "icon_long_mewlme_head",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/icon_long_mewlme_head.png"
    },
    {
      "aliases": [""],
      "name": "icon_long_mewlme_middle",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/icon_long_mewlme_middle.png"
    },
    {
      "aliases": ["mattyatea_icon", "mattyatea", "まっちゃてぃー"],
      "name": "icon_mattyatea",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/icon_mattyatea.png"
    },
    {
      "aliases": ["nae", "なえ", "なえなえ", "nae2", "icon_nae2", "naenae"],
      "name": "icon_nae",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/icon_nae.jpg"
    },
    {
      "aliases": ["renfa", "renfa_icon"],
      "name": "icon_renfa",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/icon_renfa.png"
    },
    {
      "aliases": ["しゅいろ", "syuilo"],
      "name": "icon_syuilo",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/icon_syuilo.jpg"
    },
    {
      "aliases": [
        "scream",
        "thinaticsystem",
        "しなちくシステム",
        "sinatikusisutemu",
        "shinatikushisutemu",
        "しなちくしすてむ",
        "しなちなち",
        "sinati",
        "sinachi",
        "thinachi",
        "thinati",
        "エクレール",
        "マルティノッジ",
        "Martinozzi",
        "Éclair",
        "Martinodge",
        "Eclair",
        "ekure-ru",
        "marutexinozzi",
        "marutelinozzi",
        "叫ぶ",
        "さけぶ",
        "sakebu",
        "驚く",
        "おどろく",
        "odoroku",
        "surprised"
      ],
      "name": "icon_thinaticsystem",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/icon_thinaticsystem.png"
    },
    {
      "aliases": [""],
      "name": "kobatokokoa",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/kobatokokoa.png"
    },
    {
      "aliases": [""],
      "name": "mei23",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/mei23.png"
    },
    {
      "aliases": ["めうるみ"],
      "name": "mewlme_woozy_head",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/mewlme_woozy_head.png"
    },
    {
      "aliases": ["みかどにんじん", "carotene", "icon_carotene", "きゃろってね"],
      "name": "mikadoninjin",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/mikadoninjin.jpeg"
    },
    {
      "aliases": ["みれい", "icon_mirei", "mirei_icon", ""],
      "name": "mirei",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/mirei.png"
    },
    {
      "aliases": [
        "みれい",
        "icon_mirei_9597",
        "mirei_icon",
        "_9597",
        "icon_mirei_long",
        "びよーん",
        "ながい"
      ],
      "name": "mirei_9597",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/mirei_9597.jpg"
    },
    {
      "aliases": ["ねむだるとうふ", "ねむだる豆腐", "namudaru", "tofu"],
      "name": "nemudaru_tofu",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/nemudaru_tofu.png"
    },
    {
      "aliases": ["しゅいろ"],
      "name": "syuiro",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/syuiro.jpg"
    },
    {
      "aliases": ["yotimuhai", "426hai", "", "よちむはい", "よちむ応援", ""],
      "name": "yotimu_hai",
      "category": "People / Fediverse",
      "url": "https://s3.arkjp.net/emoji/yotimu_hai.apng"
    },
    {
      "aliases": [
        "bossan",
        "ぼっさん",
        "ribbonchan",
        "りぼんちゃん",
        "ribonchan"
      ],
      "name": "bossan",
      "category": "People / Other",
      "url": "https://s3.arkjp.net/emoji/bossan.png"
    },
    {
      "aliases": [
        "ゴールデンyagoo",
        "golden_yago",
        "golden_yagou",
        "golden_yagoh",
        "gooruden_yago"
      ],
      "name": "golden_yagoo",
      "category": "People / Other",
      "url": "https://s3.arkjp.net/emoji/golden_yagoo.png"
    },
    {
      "aliases": [
        "谷郷元昭",
        "たにごうもとあき",
        "やごー",
        "ホロライブのえらいひと",
        "yagou",
        "yagoh",
        "yago"
      ],
      "name": "yagoo",
      "category": "People / Other",
      "url": "https://s3.arkjp.net/emoji/yagoo.png"
    },
    {
      "aliases": ["pet", "pat", "なでなで", ""],
      "name": "ablobcatfloofpat",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/ablobcatfloofpat.gif"
    },
    {
      "aliases": ["なでなで"],
      "name": "blobcatawwpat",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/blobcatawwpat.gif"
    },
    {
      "aliases": [
        "kazamin_pat",
        "kazaminpat",
        "fuukapat",
        "かざみん",
        "ふうか",
        "kazamin_nadenade",
        "fuuka_nadenade",
        "かざみんなでなで",
        "ふうかなでなで",
        "petthex_fuuka"
      ],
      "name": "fuuka_pat",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/fuuka_pat.gif"
    },
    {
      "aliases": ["hamburger", "naderu"],
      "name": "hamburger_petthex",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/hamburger_petthex.gif"
    },
    {
      "aliases": [
        "petthex_angel",
        "pet",
        "pat",
        "nadenade",
        "なでなで",
        "angel",
        ""
      ],
      "name": "pet_the_angel",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/pet_the_angel.gif"
    },
    {
      "aliases": ["藍", "あい", "なでなで", "pet", "pat", "ai"],
      "name": "petthex_ai",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_ai.gif"
    },
    {
      "aliases": ["petthex_風船", "petthex_ふうせん", "petthex_fu-sen"],
      "name": "petthex_balloon",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_balloon.gif"
    },
    {
      "aliases": ["なでなで", "pet", "pat", "blobcat", "blobcat_frustration", ""],
      "name": "petthex_blobcat_frustration",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_blobcat_frustration.gif"
    },
    {
      "aliases": [
        "c30_pat",
        "pet",
        "pat",
        "nadenade",
        "なでなで",
        "icon_c30",
        ""
      ],
      "name": "petthex_c30",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_c30.gif"
    },
    {
      "aliases": [
        "pet_the_carotene",
        "なでなで",
        "nadenade",
        "pet",
        "pat",
        "pet_carotene",
        "きゃろってねなでなで",
        "petpet_carotene"
      ],
      "name": "petthex_carotene",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_carotene.gif"
    },
    {
      "aliases": ["petthex_g0ma_", "pet", "pat", "なでなで", "なでなでごま", ""],
      "name": "petthex_goma",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_goma.gif"
    },
    {
      "aliases": [
        "petinu",
        "ぺっといぬ",
        "pet",
        "pat",
        "inu",
        "nadenade",
        "なでなで"
      ],
      "name": "petthex_inu",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/misskey/c025a2d0-f672-4bf3-bbbc-4f2ade0dc264.gif"
    },
    {
      "aliases": [
        "なでなで",
        "pet",
        "pat",
        "nadenade",
        "伊塚キヨ子なでなで",
        "いづかきよこなでなで"
      ],
      "name": "petthex_kiyoko",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/misskey/bc5c6317-bc45-4742-813e-5a7421e6dfd0.gif"
    },
    {
      "aliases": ["kro", "pet", "pat", "なでなで", "クロ", "petpet", ""],
      "name": "petthex_kro",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_kro.gif"
    },
    {
      "aliases": ["petpet", "pet", "pat", "なでなで", "まっちゃてぃーなでなで"],
      "name": "petthex_mattyatea",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_mattyatea.gif"
    },
    {
      "aliases": [
        "mei23",
        "meimei",
        "めいめい",
        "めいめいなでなで",
        "なでなで",
        "pet",
        "pat",
        ""
      ],
      "name": "petthex_mei23",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_mei23.gif"
    },
    {
      "aliases": ["menme", "nadenade", "なでなで", "pet", "pat"],
      "name": "petthex_menme",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/misskey/4922a4b9-9754-4ff0-a1bd-19cc93cb765c.gif"
    },
    {
      "aliases": [
        "petthex_aureoleark",
        "petthex_ark",
        "ark",
        "pet",
        "pat",
        "nadenade",
        "なでなで",
        "村上さん"
      ],
      "name": "petthex_murakamisan",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_murakamisan.gif"
    },
    {
      "aliases": [
        "六葩くる",
        "六葩",
        "むゆひら",
        "なでなで",
        "pet",
        "pat",
        "muyuhira_kuru"
      ],
      "name": "petthex_muyuhira",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_muyuhira.gif"
    },
    {
      "aliases": [
        "pet",
        "pat",
        "nadenade",
        "なでなで",
        "ウンチゲボザウルス",
        "ウンゲボ"
      ],
      "name": "petthex_poop_vomiting_saurus",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/misskey/07a075d0-0c05-4cef-ad91-d5e8b3fb9116.gif"
    },
    {
      "aliases": [""],
      "name": "petthex_ryotak",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_ryotak.gif"
    },
    {
      "aliases": ["しゅいろ", "pet", "pat", "nadenade", "なでなで", ""],
      "name": "petthex_syuilo",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_syuilo.gif"
    },
    {
      "aliases": [
        "yanchon_nadenade",
        "なでなで",
        "pet",
        "pat",
        "yanchon_nadenade",
        "やんちょんなでなで",
        "なでなでやんちょん"
      ],
      "name": "petthex_yanchon",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_yanchon.gif"
    },
    {
      "aliases": [
        "pet",
        "pat",
        "なでなで",
        "pet_yotimu",
        "pat_yotimu",
        "pet_426",
        "pat_426",
        "なでなでよちむ",
        "なでなで426"
      ],
      "name": "petthex_yotimu",
      "category": "PetPet",
      "url": "https://s3.arkjp.net/emoji/petthex_yotimu.gif"
    },
    {
      "aliases": ["hammerandsickle", "ソ連", "ussr"],
      "name": "hammer_and_sickle",
      "category": "Symbols",
      "url": "https://s3.arkjp.net/misskey/d75c78de-fa0e-4b6d-acaf-54e72be9ef7a.png"
    },
    {
      "aliases": ["〆", "しめ", "締め", "sime"],
      "name": "shime",
      "category": "Symbols",
      "url": "https://s3.arkjp.net/misskey/0da8ddf0-29b1-464a-b6f3-27ce7854e233.png"
    },
    {
      "aliases": ["ふきだし", "fukidashi", "hukidasi"],
      "name": "left_side_balloon_without_tail",
      "category": "Symbols/ふきだし",
      "url": "https://s3.arkjp.net/misskey/3dd8db4f-e913-4651-9e34-24cfcc707204.png"
    },
    {
      "aliases": ["ふきだし", "fukidashi", "hukidasi"],
      "name": "left_side_balloon_with_tail",
      "category": "Symbols/ふきだし",
      "url": "https://s3.arkjp.net/misskey/41fa705e-2ed6-4f3d-b3a9-73903c905ee0.png"
    },
    {
      "aliases": ["ふきだし", "fukidashi", "hukidasi"],
      "name": "left_side_jagged_balloon_without_tail",
      "category": "Symbols/ふきだし",
      "url": "https://s3.arkjp.net/misskey/b1e05465-f86d-477f-ba90-a281b74b8578.png"
    },
    {
      "aliases": ["ふきだし", "fukidashi", "hukidasi"],
      "name": "left_side_thinking_balloon_without_tail",
      "category": "Symbols/ふきだし",
      "url": "https://s3.arkjp.net/misskey/28f72043-1b6a-4e36-9270-d89cc1692a28.png"
    },
    {
      "aliases": ["ふきだし", "fukidashi", "hukidasi"],
      "name": "left_side_thinking_balloon_with_tail",
      "category": "Symbols/ふきだし",
      "url": "https://s3.arkjp.net/misskey/7b16ed1e-2a11-4be7-af6c-0a8264048e4f.png"
    },
    {
      "aliases": ["ふきだし", "fukidashi", "hukidasi"],
      "name": "right_side_balloon_without_tail",
      "category": "Symbols/ふきだし",
      "url": "https://s3.arkjp.net/misskey/b9187be7-349c-4df6-b776-35a088066169.png"
    },
    {
      "aliases": ["ふきだし", "fukidashi", "hukidasi"],
      "name": "right_side_balloon_with_tail",
      "category": "Symbols/ふきだし",
      "url": "https://s3.arkjp.net/misskey/da6c33a8-096c-4747-9093-583f0bce2b34.png"
    },
    {
      "aliases": ["ふきだし", "fukidashi", "hukidasi"],
      "name": "right_side_jagged_balloon_without_tail",
      "category": "Symbols/ふきだし",
      "url": "https://s3.arkjp.net/misskey/4a2ca726-0793-460b-a540-09f4f6191e1c.png"
    },
    {
      "aliases": ["ふきだし", "fukidashi", "hukidasi"],
      "name": "right_side_thinking_balloon_without_tail",
      "category": "Symbols/ふきだし",
      "url": "https://s3.arkjp.net/misskey/dc463599-0e8e-4eae-996c-92f40b4c559f.png"
    },
    {
      "aliases": ["ふきだし", "fukidashi", "hukidasi"],
      "name": "right_side_thinking_balloon_with_tail",
      "category": "Symbols/ふきだし",
      "url": "https://s3.arkjp.net/misskey/090fbb56-1576-4093-acd7-77cd539e06ae.png"
    },
    {
      "aliases": ["idle"],
      "name": "blinking_cursor",
      "category": "Terminal/A",
      "url": "https://s3.arkjp.net/misskey/091a8cea-fc35-46c9-b8c9-0aa5bcdc3d60.gif"
    },
    {
      "aliases": ["ポグ", "ポッグ", "Ryan", "Gootecks", "Guiterrez"],
      "name": "pog",
      "category": "Twitch",
      "url": "https://s3.arkjp.net/emoji/pog.png"
    },
    {
      "aliases": [],
      "name": "fact",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/fact.png"
    },
    {
      "aliases": [],
      "name": "fake",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/fake.png"
    },
    {
      "aliases": [],
      "name": "ferdiverified",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/ferdiverified.png"
    },
    {
      "aliases": ["flag_grey", "flag_government_official"],
      "name": "flag_gray",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/flag_gray.png"
    },
    {
      "aliases": ["grey_desk_with_mic", "desk", "mic", "state-affiliated_media"],
      "name": "gray_desk_with_mic",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/gray_desk_with_mic.png"
    },
    {
      "aliases": ["却下", "認証", "プリン", "ベリファイ", "食べ物", "food", "x"],
      "name": "puddingified_rejected",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/puddingified_rejected.png"
    },
    {
      "aliases": [
        "承認",
        "認証",
        "プリン",
        "ベリファイ",
        "食べ物",
        "food",
        "check"
      ],
      "name": "puddingified_verified_recursion",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/puddingified_verified_recursion.png"
    },
    {
      "aliases": [
        "承認",
        "認証",
        "プリン",
        "ベリファイ",
        "食べ物",
        "food",
        "check"
      ],
      "name": "puddingified_verify",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/puddingified_verify.png"
    },
    {
      "aliases": [],
      "name": "rejected_verify",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/rejected_verify.png"
    },
    {
      "aliases": ["認証マーク", "verified", "認証ブルー"],
      "name": "verified_blue",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/verified_blue.png"
    },
    {
      "aliases": ["認証マーク", "企業認証", "verified_business", "ゴールド認証"],
      "name": "verified_gold",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/verified_gold.png"
    },
    {
      "aliases": ["認証マーク", "企業認証", "verified_business", "ゴールド認証"],
      "name": "verified_gold_gradient",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/verified_gold_gradient.png"
    },
    {
      "aliases": [
        "認証マーク",
        "政府認証",
        "verified_government",
        "gov",
        "government",
        "グレー認証",
        "政府関係",
        "多国間機関"
      ],
      "name": "verified_grey",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/verified_grey.png"
    },
    {
      "aliases": [
        "認証マーク",
        "verified_green",
        "認証グリーン",
        "認証ミスキー",
        "認証ミスキスト"
      ],
      "name": "verified_misskey",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/verified_misskey.png"
    },
    {
      "aliases": [
        "認証マーク",
        "verified_green_gradiant",
        "認証グリーングラデェーション",
        "認証ミスキー",
        "認証ミスキスト"
      ],
      "name": "verified_misskey_gradiant",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/verified_misskey_gradiant.png"
    },
    {
      "aliases": [
        "承認",
        "認証",
        "プリン",
        "ベリファイ",
        "食べ物",
        "food",
        "check"
      ],
      "name": "verified_puddingified_verify",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/verified_puddingified_verify.png"
    },
    {
      "aliases": [],
      "name": "verified_reject",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/verified_reject.png"
    },
    {
      "aliases": [],
      "name": "verifiedsabakan",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/verifiedsabakan.png"
    },
    {
      "aliases": ["公式", "official", "not_twitter_blue"],
      "name": "verified_stroke_1",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/verified_stroke_1.png"
    },
    {
      "aliases": ["認証マーク", "verified"],
      "name": "verify",
      "category": "Verification",
      "url": "https://s3.arkjp.net/emoji/verify.gif"
    },
    {
      "aliases": ["vrchat", "チュートリアルワールド"],
      "name": "jp_tutorial_world",
      "category": "VRChat",
      "url": "https://s3.arkjp.net/misskey/44c69567-e599-4eec-81d1-b985ecf2692e.png"
    },
    {
      "aliases": ["h", "justh", "just_h_party", "party", "just", "H"],
      "name": "just_h",
      "category": "VRChat",
      "url": "https://s3.arkjp.net/emoji/just_h.png"
    },
    {
      "aliases": [""],
      "name": "vrchat_user_is_online_in_a_private_world",
      "category": "VRChat",
      "url": "https://s3.arkjp.net/emoji/vrchat_user_is_online_in_a_private_world.png"
    },
    {
      "aliases": [""],
      "name": "half_closed_eyes_woozy",
      "category": "woozy",
      "url": "https://s3.arkjp.net/emoji/half_closed_eyes_woozy.png"
    },
    {
      "aliases": [""],
      "name": "smile_woozy",
      "category": "woozy",
      "url": "https://s3.arkjp.net/emoji/smile_woozy.gif"
    },
    {
      "aliases": [""],
      "name": "thinking_woozy",
      "category": "woozy",
      "url": "https://s3.arkjp.net/emoji/thinking_woozy.png"
    },
    {
      "aliases": [],
      "name": "woozy_angry",
      "category": "woozy",
      "url": "https://s3.arkjp.net/emoji/woozy_angry.png"
    },
    {
      "aliases": [],
      "name": "woozy_sob",
      "category": "woozy",
      "url": "https://s3.arkjp.net/emoji/woozy_sob.png"
    },
    {
      "aliases": [],
      "name": "woozytoocold",
      "category": "woozy",
      "url": "https://s3.arkjp.net/emoji/woozytoocold.png"
    },
    {
      "aliases": [],
      "name": "woozytoohot",
      "category": "woozy",
      "url": "https://s3.arkjp.net/emoji/woozytoohot.png"
    },
    {
      "aliases": [""],
      "name": "ot_hyakusogan",
      "category": "その他",
      "url": "https://s3.arkjp.net/emoji/ot_hyakusogan.png"
    },
    {
      "aliases": [""],
      "name": "share",
      "category": "その他",
      "url": "https://s3.arkjp.net/emoji/share.png"
    },
    {
      "aliases": [
        "自力更生",
        "じりょくこうせい",
        "じりきこうせい",
        "jaryeok",
        "kaengsaeng",
        "자력갱생",
        "자력",
        "갱생"
      ],
      "name": "jaryeok_kaengsaeng",
      "category": "ハングル",
      "url": "https://s3.arkjp.net/emoji/jaryeok_kaengsaeng.png"
    },
    {
      "aliases": [""],
      "name": "arigatofes",
      "category": "祭り",
      "url": "https://s3.arkjp.net/emoji/arigatofes.png"
    },
    {
      "aliases": [""],
      "name": "naruhodofes",
      "category": "祭り",
      "url": "https://s3.arkjp.net/emoji/naruhodofes.png"
    },
    {
      "aliases": [
        "たすかるまつり",
        "tasukarumatsuri",
        "tasukarumaturi",
        "thanks",
        "fes",
        "saved",
        "helpful",
        "rescured",
        "tasukaru",
        "matsuri",
        "maturi"
      ],
      "name": "tasukarufes",
      "category": "祭り",
      "url": "https://s3.arkjp.net/emoji/tasukarufes.png"
    },
    {
      "aliases": ["help", "たすけてまつり"],
      "name": "tasuketefes",
      "category": "祭り",
      "url": "https://s3.arkjp.net/emoji/tasuketefes.png"
    },
    {
      "aliases": [],
      "name": "ableton_live",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/e4be959c-2723-4f85-b680-c866ee8f852d.png"
    },
    {
      "aliases": [],
      "name": "aftereffects",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/baadc7ac-349f-4b54-bb86-999319a6065e.png"
    },
    {
      "aliases": [],
      "name": "ageage",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ageage.png"
    },
    {
      "aliases": [],
      "name": "ai",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/0fa8bb5c-b7a2-42ee-b13e-bc73c680d8c4.png"
    },
    {
      "aliases": [],
      "name": "aified",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/12785d4c-d170-46d6-a9ca-c54aa952c0c1.png"
    },
    {
      "aliases": [],
      "name": "aki",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/002bc5ff-9955-454a-8097-2f71a519026e.png"
    },
    {
      "aliases": [],
      "name": "amarinimo_kawaii",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/f88de618-fdbb-4c38-a578-173af4ece1d3.png"
    },
    {
      "aliases": [],
      "name": "ansible",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/webpublic-7b156e23-b78c-44b8-8a25-d4df3bdff19d.png"
    },
    {
      "aliases": [],
      "name": "approved",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/6e3f8d26-a10e-49f0-840e-fbc4620017b3.png"
    },
    {
      "aliases": [],
      "name": "ara_kawaii",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/4cd92ac3-797d-471b-a39a-8614ac957ac3.png"
    },
    {
      "aliases": [],
      "name": "ara_steak",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/64bd7b6d-c9a2-4b85-b5da-84b9c858880a.png"
    },
    {
      "aliases": [],
      "name": "ara_suteki",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/09eff5d4-3a09-4a91-9f43-f18b59b7825c.png"
    },
    {
      "aliases": ["argo_cd"],
      "name": "argocd",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/argocd.png"
    },
    {
      "aliases": [],
      "name": "arigachi",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/arigachi.png"
    },
    {
      "aliases": [],
      "name": "arukamo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/d574c752-1372-40e9-9785-982ec17faeb0.png"
    },
    {
      "aliases": [],
      "name": "atatakaisekai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/atatakaisekai.png"
    },
    {
      "aliases": [],
      "name": "atatakaisekai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/atatakaisekai.png"
    },
    {
      "aliases": [],
      "name": "atsuiyoo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/5f667a16-53a1-4c1d-bb93-c04bf3ef28d1.png"
    },
    {
      "aliases": [],
      "name": "aussieparrot",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/aussieparrot.gif"
    },
    {
      "aliases": [],
      "name": "baiba",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/baiba.png"
    },
    {
      "aliases": [],
      "name": "baked_mochocho",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/baked_mochocho.png"
    },
    {
      "aliases": [],
      "name": "bara_jan",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/bara_jan.png"
    },
    {
      "aliases": [],
      "name": "benri",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/benri.png"
    },
    {
      "aliases": [],
      "name": "blobsnowball1",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/blobsnowball1.gif"
    },
    {
      "aliases": [],
      "name": "booth_logo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/booth_logo.png"
    },
    {
      "aliases": [],
      "name": "boron",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/boron.png"
    },
    {
      "aliases": [],
      "name": "boron",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/boron.png"
    },
    {
      "aliases": [],
      "name": "bubuntekini_sou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/bubuntekini_sou.png"
    },
    {
      "aliases": [],
      "name": "buturi_de_naguru",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/801dd1e7-3dce-4bb9-8c1a-409132ff3a78.png"
    },
    {
      "aliases": [],
      "name": "cerenkov",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/16ce5075-2e02-4d62-b921-ac2bc28daed7.png"
    },
    {
      "aliases": [],
      "name": "cevio",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/cevio.png"
    },
    {
      "aliases": [],
      "name": "chara_eyeless",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/chara_eyeless.png"
    },
    {
      "aliases": [],
      "name": "cheonggyecheon",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/cheonggyecheon.png"
    },
    {
      "aliases": [],
      "name": "chian_saikou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/chian_saikou.gif"
    },
    {
      "aliases": [],
      "name": "chigauno",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/chigauno.png"
    },
    {
      "aliases": [],
      "name": "chocotto",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/chocotto.png"
    },
    {
      "aliases": [],
      "name": "chotto_chigau",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/chotto_chigau.png"
    },
    {
      "aliases": [],
      "name": "chotto_wakaru",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/eb23e4ed-788b-48e5-9e5c-cba3e7d5bf34.png"
    },
    {
      "aliases": [],
      "name": "chrome",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/bc37e08d-a3ac-4d9b-9943-caac393456fa.png"
    },
    {
      "aliases": [],
      "name": "chuteki",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/chuteki.png"
    },
    {
      "aliases": [],
      "name": "chuteki",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/chuteki.png"
    },
    {
      "aliases": ["クリッピー"],
      "name": "clippy",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/63929ed2-496c-4be4-b936-ed3618074c87.png"
    },
    {
      "aliases": [],
      "name": "cluster",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/cluster.png"
    },
    {
      "aliases": [],
      "name": "conoha_logo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/conoha_logo.png"
    },
    {
      "aliases": ["カードマン", "かーどまん", "楽天カードマン"],
      "name": "creditcard_face",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/creditcard_face.png"
    },
    {
      "aliases": [],
      "name": "c_sharp",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/c_sharp.png"
    },
    {
      "aliases": [],
      "name": "cyberpunk2077",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/18ba3719-ff91-4e26-bedb-e547aa33bf4a.png"
    },
    {
      "aliases": [],
      "name": "daitai_atteru",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/e88e31af-f4d8-46f8-b850-d0a18aea355e.png"
    },
    {
      "aliases": [],
      "name": "dajare",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/d98e950b-60f0-465a-b6bd-7d80c6cff09d.png"
    },
    {
      "aliases": [],
      "name": "dame",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/6c633376-c2dc-4e0c-b780-ae3913e5b21b.png"
    },
    {
      "aliases": [],
      "name": "damedesu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/damedesu.png"
    },
    {
      "aliases": [],
      "name": "dareda_imano",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/dareda_imano.png"
    },
    {
      "aliases": [],
      "name": "de",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/b0e4d403-4194-470c-8f88-d20038767c83.png"
    },
    {
      "aliases": [],
      "name": "dealwithitparrot",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/efa64ff9-fb6b-42f9-bd90-2d69c9b11675.gif"
    },
    {
      "aliases": [],
      "name": "dekai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/dekai.png"
    },
    {
      "aliases": [],
      "name": "dekiraa",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/dekiraa.png"
    },
    {
      "aliases": [],
      "name": "demaekan",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/7df011f2-56ea-4222-8985-83a52cbc3f00.png"
    },
    {
      "aliases": [],
      "name": "desuka",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/0b238393-ba88-450f-9898-82dc380aef98.png"
    },
    {
      "aliases": [],
      "name": "desuwa",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/4aac9654-96d4-433a-bad8-318f4f53f14f.png"
    },
    {
      "aliases": [],
      "name": "desuyo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/a402352e-df06-4657-9fed-30dbb8979f9f.png"
    },
    {
      "aliases": [],
      "name": "dlang_kun",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/dlang_kun.png"
    },
    {
      "aliases": [],
      "name": "docker_moby",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/docker_moby.png"
    },
    {
      "aliases": [],
      "name": "doecchi",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/8227528c-86ed-494d-b1f3-20b3b9edd2d9.png"
    },
    {
      "aliases": [],
      "name": "dokaben",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/62928074-2297-42d9-be7b-a2a1607febd3.png"
    },
    {
      "aliases": [],
      "name": "doki",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/doki.png"
    },
    {
      "aliases": [],
      "name": "donitikankeinai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/donitikankeinai.png"
    },
    {
      "aliases": [],
      "name": "dontt",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/7793f726-a259-48e1-bdf8-370e86b0759a.png"
    },
    {
      "aliases": [],
      "name": "dore",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/62c3b67c-369f-41c6-9770-56b304dffe25.png"
    },
    {
      "aliases": [],
      "name": "dosukoi",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/8cf69ce1-8e5d-4fce-aa2c-b11a9eae9e89.png"
    },
    {
      "aliases": [],
      "name": "doudemoiine",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/webpublic-289a4450-1c1d-47bc-abb1-cd7826962d72.png"
    },
    {
      "aliases": [],
      "name": "douzo_douzo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/douzo_douzo.png"
    },
    {
      "aliases": [],
      "name": "edamame",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/edamame.png"
    },
    {
      "aliases": [],
      "name": "edge",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/85f78286-ebf8-40d2-8161-debe4e65128c.png"
    },
    {
      "aliases": [""],
      "name": "eeyan",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/58df785e-808e-4efe-8ec1-e7ed584f11e8.png"
    },
    {
      "aliases": [],
      "name": "eggdog",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/eggdog.gif"
    },
    {
      "aliases": [],
      "name": "eti",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/1f15b076-2cac-455a-ab85-901562dfcecd.png"
    },
    {
      "aliases": [],
      "name": "_exclamation_mark",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/9f5a225f-b812-45b0-8648-8838c97015c7.png"
    },
    {
      "aliases": [],
      "name": "exclamation_sign",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/exclamation_sign.png"
    },
    {
      "aliases": [],
      "name": "expack_500_is_economical",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/1ff08c9e-22d4-47f1-aeb3-1d666bfb17ac.png"
    },
    {
      "aliases": [],
      "name": "exploding_woozy",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/3ca46836-1912-4d0d-9d15-539b19b5634c.png"
    },
    {
      "aliases": [],
      "name": "eyes_fidgeting",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/eyes_fidgeting.gif"
    },
    {
      "aliases": [],
      "name": "fediverse",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/05f7ce80-3568-4269-848a-4d8b99858038.png"
    },
    {
      "aliases": [],
      "name": "firefox",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/e3a67aee-aa57-48de-bb38-e0d81fc16bc8.png"
    },
    {
      "aliases": [],
      "name": "flying_money",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/flying_money.gif"
    },
    {
      "aliases": [],
      "name": "frisk",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/frisk.png"
    },
    {
      "aliases": [],
      "name": "fumifumi",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/12d67a23-d9e9-4018-a2ca-014b93e00582.png"
    },
    {
      "aliases": [],
      "name": "fumu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/fumu.png"
    },
    {
      "aliases": [],
      "name": "fumufumu",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/cce5a2b7-5a25-40ee-a6cb-c914a7afe59b.png"
    },
    {
      "aliases": [],
      "name": "funwari",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/funwari.png"
    },
    {
      "aliases": [],
      "name": "furuhe",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/furuhe.png"
    },
    {
      "aliases": [],
      "name": "fuwafuwa",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/fuwafuwa.png"
    },
    {
      "aliases": [],
      "name": "fuyu",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/71849314-6f66-4038-a1bc-b0698ee50991.png"
    },
    {
      "aliases": [],
      "name": "ga",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/aebd10aa-dcfc-4903-bc1e-94c9eb57d926.png"
    },
    {
      "aliases": [],
      "name": "ganbatta",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ganbatta.png"
    },
    {
      "aliases": [],
      "name": "gaon_sleepy",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/gaon_sleepy.gif"
    },
    {
      "aliases": [],
      "name": "gateway",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/1e5bda3c-054f-4dfb-bd2e-4b08f4908f8a.png"
    },
    {
      "aliases": [
        "現場猫",
        "げんばねこ",
        "どうして",
        "genbaneko_doushite",
        "dousitegenbaneko"
      ],
      "name": "genbaneko_dousite",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/0ccd0ab1-1b31-4a45-8af2-e888e9d417cc.png"
    },
    {
      "aliases": [],
      "name": "genmai_shisho",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/genmai_shisho.png"
    },
    {
      "aliases": [],
      "name": "gichigichi",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/gichigichi.png"
    },
    {
      "aliases": [],
      "name": "giman",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/giman.png"
    },
    {
      "aliases": [
        "お金",
        "おかね",
        "give",
        "money",
        "cash",
        "あげる",
        "take_my_money"
      ],
      "name": "give_money",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/give_money.png"
    },
    {
      "aliases": [],
      "name": "gogono",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/gogono.png"
    },
    {
      "aliases": [],
      "name": "gokigenyou",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/42f33e65-0619-44b2-a05d-6de61b753634.png"
    },
    {
      "aliases": [],
      "name": "golang_gopher",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/golang_gopher.png"
    },
    {
      "aliases": [],
      "name": "goodgame",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/ae08aa41-0d27-4b61-a1d8-4269a02295ce.png"
    },
    {
      "aliases": [],
      "name": "goodluck",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/f0cd7f89-053d-4f97-a141-b6d0c2c69566.png"
    },
    {
      "aliases": [],
      "name": "goukyuu",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/webpublic-49231275-08bf-4b19-a8c6-1bbe93c4f69c.png"
    },
    {
      "aliases": [],
      "name": "gozasourou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/gozasourou.png"
    },
    {
      "aliases": [],
      "name": "gozennno",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/gozennno.png"
    },
    {
      "aliases": [],
      "name": "grafana",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/80e96fc6-7641-48cf-ad86-bbc4a3a69e4c.png"
    },
    {
      "aliases": [],
      "name": "guwaa_meshi_terro_ja",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/guwaa_meshi_terro_ja.png"
    },
    {
      "aliases": [],
      "name": "haibokuwoshiritai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/haibokuwoshiritai.png"
    },
    {
      "aliases": [],
      "name": "haihaihamujanai",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/a1c53fad-0aa3-4c80-bc8d-67c31730149d.png"
    },
    {
      "aliases": [],
      "name": "hanakin",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/hanakin.png"
    },
    {
      "aliases": [],
      "name": "hanashihanashi",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/0c383d04-e9c5-4f06-9270-750c1b7d95e9.gif"
    },
    {
      "aliases": [],
      "name": "hanka",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/hanka.png"
    },
    {
      "aliases": [],
      "name": "happy",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/happy.png"
    },
    {
      "aliases": [],
      "name": "haru",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/78fb2e58-df26-4fb5-88d4-c06c63adb4a6.png"
    },
    {
      "aliases": [],
      "name": "higeki",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/higeki.gif"
    },
    {
      "aliases": [],
      "name": "hoba",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/8563cbb7-027c-468d-80d0-928265cfc192.png"
    },
    {
      "aliases": [],
      "name": "hokohoko",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/hokohoko.png"
    },
    {
      "aliases": [],
      "name": "hol_crew_happy",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/d8dff28f-9f74-4f33-a964-5b2003bc1264.png"
    },
    {
      "aliases": [],
      "name": "hol_crew_love",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/66824329-d0ee-4f7f-b2c2-8780e7b90423.png"
    },
    {
      "aliases": [],
      "name": "honmatsu_tentou",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/77497a2b-cbe3-4bf7-88b1-09d65a3bc503.png"
    },
    {
      "aliases": [],
      "name": "honshitsu_jouhou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/honshitsu_jouhou.png"
    },
    {
      "aliases": [],
      "name": "hou_shiyou",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/371d711c-6724-4ca5-bc87-f58d7e1efd0d.png"
    },
    {
      "aliases": [],
      "name": "hunikideyatteru",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/hunikideyatteru.png"
    },
    {
      "aliases": [],
      "name": "ichiriaru",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ichiriaru.png"
    },
    {
      "aliases": [],
      "name": "icon_ryotak",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/icon_ryotak.png"
    },
    {
      "aliases": [],
      "name": "igokotiyosa",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/igokotiyosa.png"
    },
    {
      "aliases": [],
      "name": "igokotiyosa",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/igokotiyosa.png"
    },
    {
      "aliases": [],
      "name": "igyou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/igyou.png"
    },
    {
      "aliases": [],
      "name": "ii",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/2132e166-920d-40dc-8ce4-02e4b6cf077b.png"
    },
    {
      "aliases": [],
      "name": "iine",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/iine.png"
    },
    {
      "aliases": [],
      "name": "iiyo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/iiyo.png"
    },
    {
      "aliases": [],
      "name": "iiyone",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/iiyone.png"
    },
    {
      "aliases": [],
      "name": "ijin",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/402c746d-a8c6-4793-9b54-711ce1210ec4.png"
    },
    {
      "aliases": [],
      "name": "iki",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/iki.gif"
    },
    {
      "aliases": [],
      "name": "ikioi_daiji",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ikioi_daiji.png"
    },
    {
      "aliases": [],
      "name": "ikite",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ikite.png"
    },
    {
      "aliases": [],
      "name": "imadesyo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/imadesyo.png"
    },
    {
      "aliases": [],
      "name": "imanohanashi",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/c081a715-9f1a-4400-a142-7fc67279bd7e.gif"
    },
    {
      "aliases": [],
      "name": "ingaouhou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ingaouhou.png"
    },
    {
      "aliases": [],
      "name": "iniwach",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/iniwach.png"
    },
    {
      "aliases": [],
      "name": "internet_roujinkai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/internet_roujinkai.png"
    },
    {
      "aliases": [],
      "name": "_interrobang_mark",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/d8ba0230-592b-4cfc-8fa8-a69b946ebdee.png"
    },
    {
      "aliases": [],
      "name": "inu_happy",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/inu_happy.gif"
    },
    {
      "aliases": [],
      "name": "iro",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/bc4da48e-00b0-4cba-9176-dc0eec03373f.png"
    },
    {
      "aliases": [],
      "name": "irohas",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/irohas.png"
    },
    {
      "aliases": [],
      "name": "iron",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/iron.png"
    },
    {
      "aliases": [],
      "name": "itekima",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/ca51c3b1-e502-45e7-a535-b58346e824e9.png"
    },
    {
      "aliases": [],
      "name": "itterassyai",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/d8b5f75d-b3f9-4503-bd99-a7420a415677.png"
    },
    {
      "aliases": [],
      "name": "jakigan",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/jakigan.jpeg"
    },
    {
      "aliases": [],
      "name": "jigoku",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/jigoku.png"
    },
    {
      "aliases": [],
      "name": "jikuujyou_no_sonzaisyoumei",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/jikuujyou_no_sonzaisyoumei.png"
    },
    {
      "aliases": [],
      "name": "jinruimetubou",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/0bc8b8d1-ba40-4764-b897-becf2247e0bd.png"
    },
    {
      "aliases": [],
      "name": "jisshitsu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/jisshitsu.png"
    },
    {
      "aliases": [],
      "name": "jiyuu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/jiyuu.png"
    },
    {
      "aliases": [],
      "name": "joubutsushite_clemence",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/joubutsushite_clemence.png"
    },
    {
      "aliases": ["juudaiinshidento"],
      "name": "juudai_incident",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/juudai_incident.png"
    },
    {
      "aliases": [],
      "name": "jyuuden_nai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/jyuuden_nai.png"
    },
    {
      "aliases": [],
      "name": "jyuuden_shiro",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/jyuuden_shiro.png"
    },
    {
      "aliases": [],
      "name": "kafun",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/155c8a0b-9719-4acb-afcf-551dbbf9f363.png"
    },
    {
      "aliases": [],
      "name": "kaiketsu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kaiketsu.png"
    },
    {
      "aliases": [],
      "name": "kakoku",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kakoku.png"
    },
    {
      "aliases": [],
      "name": "kakugi_kettei",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kakugi_kettei.png"
    },
    {
      "aliases": [],
      "name": "kakugo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kakugo.png"
    },
    {
      "aliases": [],
      "name": "kakutei",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/52f0649e-7323-4922-9e6f-31ecbcc1fb33.png"
    },
    {
      "aliases": [],
      "name": "kanashii",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kanashii.png"
    },
    {
      "aliases": [],
      "name": "kanzennirikaisita",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/6ae705aa-92c9-4edf-9a8f-682129c75ee2.png"
    },
    {
      "aliases": [],
      "name": "kanzennisore",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kanzennisore.png"
    },
    {
      "aliases": [],
      "name": "kanzennisou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kanzennisou.png"
    },
    {
      "aliases": [],
      "name": "kanzenrikai",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/c768f859-7d58-4ae0-95fc-9247a83c077a.png"
    },
    {
      "aliases": [],
      "name": "katikaku",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/katikaku.png"
    },
    {
      "aliases": [],
      "name": "kattare",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kattare.png"
    },
    {
      "aliases": [],
      "name": "kattenitatakae",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kattenitatakae.png"
    },
    {
      "aliases": [],
      "name": "kawaii",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/e9072ab8-0e85-4e65-8d9a-021f26a1064d.png"
    },
    {
      "aliases": [],
      "name": "kawaiifes",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/3c436e44-db69-4605-97b7-49074fd8b4ff.png"
    },
    {
      "aliases": [],
      "name": "kawaikochan",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/5a5981a7-a7d1-4f38-8e99-0b940cb96623.png"
    },
    {
      "aliases": [],
      "name": "kawaisokawaisonanodesu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kawaisokawaisonanodesu.png"
    },
    {
      "aliases": [],
      "name": "kawaisugidaro",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/3cab128a-b499-4450-858a-a1fb355104c0.png"
    },
    {
      "aliases": [],
      "name": "kawaisugiru",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/d5b17e8e-5f80-4eb6-9d51-147130e4b9b8.png"
    },
    {
      "aliases": [],
      "name": "kawaisugiru",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/d5b17e8e-5f80-4eb6-9d51-147130e4b9b8.png"
    },
    {
      "aliases": [],
      "name": "kawayoi",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/b6e7ea68-4233-4c2b-891d-209c2f3cb13b.png"
    },
    {
      "aliases": [],
      "name": "kayowai",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/b5a14d44-64d6-4fa0-a6b4-f9917a94dbc5.png"
    },
    {
      "aliases": [],
      "name": "kekkin",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kekkin.png"
    },
    {
      "aliases": [],
      "name": "kiatu_no_sei",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/01f77dfa-9115-4812-9d12-dcc691805988.png"
    },
    {
      "aliases": [],
      "name": "kiduki",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kiduki.png"
    },
    {
      "aliases": [],
      "name": "kinishinaide",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kinishinaide.png"
    },
    {
      "aliases": [],
      "name": "kinnki",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kinnki.png"
    },
    {
      "aliases": [],
      "name": "kinnki",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kinnki.png"
    },
    {
      "aliases": [],
      "name": "kirakira",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/webpublic-c094034e-d373-494f-9d11-b0a94299a757.png"
    },
    {
      "aliases": [],
      "name": "kireteruyo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kireteruyo.png"
    },
    {
      "aliases": [],
      "name": "kitsukitsu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kitsukitsu.png"
    },
    {
      "aliases": [],
      "name": "kitsunechan",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/webpublic-c946d8a9-a0ce-438a-b376-18c5c9a02145.png"
    },
    {
      "aliases": [],
      "name": "koi",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/koi.png"
    },
    {
      "aliases": [],
      "name": "kojin_kaihatsu_yazo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/2d1622f5-e5b2-46b9-9f34-eda06e11da3b.png"
    },
    {
      "aliases": [],
      "name": "kojin_unei_yazo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/7f75fb6e-f599-425d-920d-e14cfa4cd5b8.png"
    },
    {
      "aliases": [],
      "name": "komeda",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/1bb80ea3-ba4b-4811-ae19-5a968fcc0096.png"
    },
    {
      "aliases": [],
      "name": "koorudo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/koorudo.png"
    },
    {
      "aliases": [],
      "name": "kora",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/bc05b376-be20-46a6-9039-f3a1ac057ee0.png"
    },
    {
      "aliases": [],
      "name": "kore",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/b70105a1-8a3d-4c23-bcb7-255b656add4d.png"
    },
    {
      "aliases": [],
      "name": "koucha",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/koucha.png"
    },
    {
      "aliases": [],
      "name": "kouhai",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/496f95ec-042e-4a5d-adfb-d790403e46dd.png"
    },
    {
      "aliases": [],
      "name": "kowaii",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/c7d4cba7-cf3b-4ab0-a6ab-ab20464e558b.png"
    },
    {
      "aliases": [],
      "name": "kubernetes",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kubernetes.png"
    },
    {
      "aliases": [],
      "name": "kumagaya",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/ab5220e1-9a70-4248-a02d-0399596754ea.gif"
    },
    {
      "aliases": [],
      "name": "kuromaku",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kuromaku.png"
    },
    {
      "aliases": [],
      "name": "kuruu",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/500fbea4-376e-4b0e-8b25-bd2a29fbf722.png"
    },
    {
      "aliases": [],
      "name": "kyash",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kyash.png"
    },
    {
      "aliases": [],
      "name": "kyusai",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/80c6c186-2cef-41a8-a62e-ef1ebecd0be4.png"
    },
    {
      "aliases": [],
      "name": "kyuubo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kyuubo.png"
    },
    {
      "aliases": [],
      "name": "kyuukei",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/kyuukei.png"
    },
    {
      "aliases": [],
      "name": "live2d",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/live2d.png"
    },
    {
      "aliases": [],
      "name": "logbo_wasuretenai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/logbo_wasuretenai.png"
    },
    {
      "aliases": [],
      "name": "love",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/love.png"
    },
    {
      "aliases": [],
      "name": "lstm",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/lstm.png"
    },
    {
      "aliases": [],
      "name": "majires_suruto",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/2ea88278-cb5a-484b-a8cb-0a92668b3d5d.png"
    },
    {
      "aliases": [],
      "name": "major_league_baseball",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/major_league_baseball.png"
    },
    {
      "aliases": [],
      "name": "manal",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/webpublic-e30c68c5-72d1-49c1-ab5f-5746b07aa69f.jpg"
    },
    {
      "aliases": ["万葉集", "萬葉集", "まんようしゅう"],
      "name": "manyo_shu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/manyo_shu.png"
    },
    {
      "aliases": [],
      "name": "mareniyokuaru",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/mareniyokuaru.png"
    },
    {
      "aliases": [],
      "name": "matakattesimattana",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/matakattesimattana.png"
    },
    {
      "aliases": [],
      "name": "matsukensanba",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/matsukensanba.png"
    },
    {
      "aliases": [],
      "name": "matsukensanba",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/matsukensanba.png"
    },
    {
      "aliases": [],
      "name": "mattyaski",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/mattyaski.png"
    },
    {
      "aliases": [],
      "name": "mazuiwayo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/afb83530-71d1-4a20-b9c4-fc3ce283e475.png"
    },
    {
      "aliases": [],
      "name": "mchammer",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/mchammer.png"
    },
    {
      "aliases": [],
      "name": "mc_hammer_symbolic",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/mc_hammer_symbolic.png"
    },
    {
      "aliases": [],
      "name": "mexican_cat",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/9509d02a-e0b1-4cc9-a8f9-5a22e605e0f4.gif"
    },
    {
      "aliases": [],
      "name": "mfm",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/21356a85-a8ab-45b2-b30c-bd83e7ce377b.png"
    },
    {
      "aliases": [],
      "name": "miraijin",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/miraijin.png"
    },
    {
      "aliases": [],
      "name": "miraini_ikiteru",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/miraini_ikiteru.png"
    },
    {
      "aliases": [],
      "name": "m_league_abemas",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/m_league_abemas.png"
    },
    {
      "aliases": [],
      "name": "m_league_drivens",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/m_league_drivens.png"
    },
    {
      "aliases": [],
      "name": "m_league_fightclub",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/m_league_fightclub.png"
    },
    {
      "aliases": [],
      "name": "m_league_furinkazan",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/m_league_furinkazan.png"
    },
    {
      "aliases": [],
      "name": "m_league_logo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/m_league_logo.png"
    },
    {
      "aliases": [],
      "name": "m_league_phoenix",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/m_league_phoenix.png"
    },
    {
      "aliases": [],
      "name": "m_league_pirates",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/m_league_pirates.png"
    },
    {
      "aliases": [],
      "name": "m_league_raiden",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/m_league_raiden.png"
    },
    {
      "aliases": [],
      "name": "m_league_sakuraknights",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/m_league_sakuraknights.png"
    },
    {
      "aliases": [],
      "name": "mochiron",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/mochiron.png"
    },
    {
      "aliases": [],
      "name": "mochi_tsuite",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/68bd0d6f-01d7-4a3c-ac10-409a51276316.png"
    },
    {
      "aliases": [],
      "name": "mokuzou_kenchiku",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/mokuzou_kenchiku.png"
    },
    {
      "aliases": [],
      "name": "mo_morochinda",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/mo_morochinda.png"
    },
    {
      "aliases": [],
      "name": "monday",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/monday.gif"
    },
    {
      "aliases": [],
      "name": "monkahmm",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/monkahmm.png"
    },
    {
      "aliases": [],
      "name": "monkas",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/monkas.png"
    },
    {
      "aliases": [],
      "name": "mononiyoru",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/mononiyoru.jpg"
    },
    {
      "aliases": [],
      "name": "monosugoi",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/monosugoi.png"
    },
    {
      "aliases": [],
      "name": "moriougai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/moriougai.png"
    },
    {
      "aliases": [],
      "name": "morochin",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/morochin.png"
    },
    {
      "aliases": [""],
      "name": "morojan",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/morojan.gif"
    },
    {
      "aliases": [],
      "name": "mouse",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/40090746-24f6-4197-897e-bc4a36c6a156.png"
    },
    {
      "aliases": [],
      "name": "muchi_situ",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/muchi_situ.png"
    },
    {
      "aliases": [],
      "name": "mujun",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/mujun.png"
    },
    {
      "aliases": [],
      "name": "muri",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/c8431a62-3cad-4991-bff0-ecee7fbf7cd8.png"
    },
    {
      "aliases": [],
      "name": "murikamo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/92ad80bc-5add-4d52-b15b-6d5ac5019cbc.png"
    },
    {
      "aliases": [],
      "name": "muryou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/muryou.png"
    },
    {
      "aliases": [],
      "name": "muzu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/muzu.png"
    },
    {
      "aliases": [],
      "name": "muzui",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/67ae166a-ccf4-463a-ad27-058728ba22d9.png"
    },
    {
      "aliases": [],
      "name": "naigachi",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/naigachi.png"
    },
    {
      "aliases": [],
      "name": "naikamo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/28341e2d-191b-4712-bfcb-ec3c39723e21.png"
    },
    {
      "aliases": [
        "内容がないようって...ダジャレは大事",
        "ないようがないようって…ダジャレは大事",
        ""
      ],
      "name": "naiyouganaiyoutte_dajarehadaiji",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/naiyouganaiyoutte_dajarehadaiji.png"
    },
    {
      "aliases": [],
      "name": "nanda_koitsu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/nanda_koitsu.png"
    },
    {
      "aliases": [],
      "name": "nan_dato_",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/0b266f42-621a-41a8-86c3-f4d58ea8069e.png"
    },
    {
      "aliases": [],
      "name": "nani",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/6cf97c89-8d05-4abe-b688-2ee05bcb1b53.png"
    },
    {
      "aliases": [],
      "name": "naniwaro",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/naniwaro.png"
    },
    {
      "aliases": ["nankaugoiterukaraok"],
      "name": "nanka_ugoiterukara_ok",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/nanka_ugoiterukara_ok.png"
    },
    {
      "aliases": [],
      "name": "nanto",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/webpublic-d8ddbd35-e8d1-4992-97a9-3c37efe0d568.png"
    },
    {
      "aliases": [],
      "name": "naruhodonaa",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/naruhodonaa.png"
    },
    {
      "aliases": [],
      "name": "natsukashii",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/natsukashii.png"
    },
    {
      "aliases": [],
      "name": "nerunerunerune",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/459c3fa2-dc8a-4347-a026-339b31bcb17e.png"
    },
    {
      "aliases": [],
      "name": "neta_dayona",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/neta_dayona.png"
    },
    {
      "aliases": [],
      "name": "nete",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/webpublic-93a5244b-4305-44f1-ae29-edc46a405f3b.png"
    },
    {
      "aliases": [],
      "name": "nihongo_de_ok_gatagata",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/nihongo_de_ok_gatagata.gif"
    },
    {
      "aliases": ["ningenhaoroka"],
      "name": "ningen_ha_oroka",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ningen_ha_oroka.png"
    },
    {
      "aliases": [],
      "name": "ninkimono",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ninkimono.png"
    },
    {
      "aliases": [],
      "name": "no",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/d496f670-639e-400f-806b-bb6bb9a40b58.png"
    },
    {
      "aliases": [],
      "name": "npm",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/2a1fa2dd-14d5-44bd-9ff7-16501e60f168.png"
    },
    {
      "aliases": [],
      "name": "numa",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/numa.png"
    },
    {
      "aliases": [],
      "name": "nyancat",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/nyancat.gif"
    },
    {
      "aliases": [],
      "name": "nyanparrot",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/5daefc04-b00f-4a9d-9980-f74af0932abf.gif"
    },
    {
      "aliases": [],
      "name": "nyanpuppu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/nyanpuppu.png"
    },
    {
      "aliases": [],
      "name": "nyanpuppuchan",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/81954642-b702-42ea-a2fd-f5e6a605eef3.png"
    },
    {
      "aliases": [],
      "name": "nyanpuppuchan_eating_baked_mochocho",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/webpublic-bfdece3a-6c99-4f1d-a911-57a0ffcba680.jpg"
    },
    {
      "aliases": [],
      "name": "obaachan",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/obaachan.png"
    },
    {
      "aliases": [],
      "name": "oboeta",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/oboeta.png"
    },
    {
      "aliases": [],
      "name": "ochingin",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ochingin.png"
    },
    {
      "aliases": [],
      "name": "off",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/webpublic-dc325f73-9a82-48bf-b233-3b077106c7b6.png"
    },
    {
      "aliases": [],
      "name": "oioioi",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/4948a337-ac77-46a6-9c5d-80f00d94d78a.gif"
    },
    {
      "aliases": [],
      "name": "oishiine",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/oishiine.png"
    },
    {
      "aliases": [],
      "name": "oishii_pasta_tukutta_omae",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/oishii_pasta_tukutta_omae.png"
    },
    {
      "aliases": [],
      "name": "oishisou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/oishisou.png"
    },
    {
      "aliases": [],
      "name": "oisho",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/oisho.png"
    },
    {
      "aliases": [],
      "name": "oisho",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/oisho.png"
    },
    {
      "aliases": [],
      "name": "okaeshi_mousu",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/7b7ae2c4-221a-42bd-b9ac-8ca5af1ec137.png"
    },
    {
      "aliases": [],
      "name": "okashiine",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/okashiine.png"
    },
    {
      "aliases": [],
      "name": "ok_dman",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ok_dman.png"
    },
    {
      "aliases": [],
      "name": "okusuri",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/okusuri.png"
    },
    {
      "aliases": [],
      "name": "oldtimeyparrot",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/oldtimeyparrot.gif"
    },
    {
      "aliases": [],
      "name": "omaemokaa",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/55b7e2dc-5c03-42e2-b5cd-4e7aa8aefb5d.png"
    },
    {
      "aliases": [
        "お前それサバンナでも同じこと言えんの？",
        "おまえそれさばんなでもおなじこといえんの",
        "sabanna_demo",
        "omae_sore_sabanna_demo_onazikoto_ienno"
      ],
      "name": "omae_sore_savanna_demo_onajikoto_ienno",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/f9754345-2078-41a5-94dc-5b04e9779d4a.png"
    },
    {
      "aliases": [],
      "name": "omoshiroi",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/omoshiroi.png"
    },
    {
      "aliases": [],
      "name": "onsha_ha_hima_nanodesuka",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/4e81c423-3cbc-4666-bdbb-52493631bb92.png"
    },
    {
      "aliases": [],
      "name": "ooo_otitsuite",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/a98ae34b-5bca-4a98-bcd0-4a04d7863708.png"
    },
    {
      "aliases": [],
      "name": "open_eye_crying_laughing",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/open_eye_crying_laughing.png"
    },
    {
      "aliases": [],
      "name": "order_constant",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/order_constant.png"
    },
    {
      "aliases": [],
      "name": "order_cubic",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/order_cubic.png"
    },
    {
      "aliases": [],
      "name": "order_factorial",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/order_factorial.png"
    },
    {
      "aliases": [],
      "name": "order_linear",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/order_linear.png"
    },
    {
      "aliases": [],
      "name": "order_logarithmic",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/order_logarithmic.png"
    },
    {
      "aliases": [],
      "name": "order_quadratic",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/order_quadratic.png"
    },
    {
      "aliases": [],
      "name": "oshimai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/oshimai.png"
    },
    {
      "aliases": [],
      "name": "osusume",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/b584f3b9-20ac-4422-ad57-75f3d41b59b9.png"
    },
    {
      "aliases": [],
      "name": "otouto",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/1f0cf2f2-2433-4fab-a0d7-3c4cbb9e2798.png"
    },
    {
      "aliases": [],
      "name": "otto_tega",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/903edc81-aeaa-4c9e-a672-5b19ef58cb0d.png"
    },
    {
      "aliases": [],
      "name": "otukarefes",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/b5ed457a-d093-40cc-80c8-e47fcd2840f3.png"
    },
    {
      "aliases": [],
      "name": "oyasumi",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/oyasumi.png"
    },
    {
      "aliases": [],
      "name": "oyoo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/oyoo.png"
    },
    {
      "aliases": [],
      "name": "peisu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/peisu.png"
    },
    {
      "aliases": [],
      "name": "petthex_blobcatmeltcry",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/petthex_blobcatmeltcry.gif"
    },
    {
      "aliases": [],
      "name": "petthex_yosano_akiko",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/petthex_yosano_akiko.gif"
    },
    {
      "aliases": [],
      "name": "peyupeyu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/peyupeyu.png"
    },
    {
      "aliases": [],
      "name": "pirelli_tyre_hard",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/pirelli_tyre_hard.png"
    },
    {
      "aliases": [],
      "name": "pirelli_tyre_inter",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/05c7c476-2a9a-4bb8-adae-a1a8f2fd500f.png"
    },
    {
      "aliases": [],
      "name": "pirelli_tyre_medium",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/pirelli_tyre_medium.png"
    },
    {
      "aliases": [],
      "name": "pirelli_tyre_soft",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/pirelli_tyre_soft.png"
    },
    {
      "aliases": [],
      "name": "pirelli_tyre_wet",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/6009843b-73ff-4a55-a164-88c87cbd0f23.png"
    },
    {
      "aliases": [""],
      "name": "pixiv",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/pixiv.png"
    },
    {
      "aliases": [],
      "name": "pixiv_icon",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/pixiv_icon.png"
    },
    {
      "aliases": [],
      "name": "poayoo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/poayoo.png"
    },
    {
      "aliases": [],
      "name": "pokaeri",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/pokaeri.png"
    },
    {
      "aliases": [],
      "name": "poyasuni",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/poyasuni.png"
    },
    {
      "aliases": [],
      "name": "_prolong",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/cbd8c038-6aaf-42bc-930c-48aebbfeabd6.png"
    },
    {
      "aliases": [],
      "name": "puro",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/puro.png"
    },
    {
      "aliases": [],
      "name": "pyonpuppu",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/7e5bc2d3-b018-4324-9a60-e54c25900825.png"
    },
    {
      "aliases": [],
      "name": "_question_mark",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/3db850d5-25dc-42d7-bb00-cd7495e09007.png"
    },
    {
      "aliases": [],
      "name": "r15",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/c08c4674-3404-4b33-9078-7373873990c1.png"
    },
    {
      "aliases": [],
      "name": "ramee",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ramee.png"
    },
    {
      "aliases": [],
      "name": "raspberrypi",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/raspberrypi.png"
    },
    {
      "aliases": [],
      "name": "reaction_shooter",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/ec5d78ed-7b60-438f-bfbf-51b2bb26ae55.png"
    },
    {
      "aliases": [],
      "name": "realtek",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/6332ba07-55b6-4694-804e-766d6818dcac.png"
    },
    {
      "aliases": [],
      "name": "regretcar",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/regretcar.png"
    },
    {
      "aliases": [],
      "name": "regretcar_1",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/regretcar_1.png"
    },
    {
      "aliases": [],
      "name": "regretcar_2",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/regretcar_2.png"
    },
    {
      "aliases": [],
      "name": "regretcar_3",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/regretcar_3.png"
    },
    {
      "aliases": [],
      "name": "retahasu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/retahasu.png"
    },
    {
      "aliases": [],
      "name": "rikidouzan",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/rikidouzan.png"
    },
    {
      "aliases": [],
      "name": "ringi_syounin",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/b89bcb04-c559-4733-bca2-fc680fd06b71.png"
    },
    {
      "aliases": [],
      "name": "ryuukou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ryuukou.png"
    },
    {
      "aliases": [],
      "name": "sadparrot",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/0018354b-d103-454e-85c2-b138a34efd4f.gif"
    },
    {
      "aliases": [],
      "name": "sagashiteta",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/6966f39f-2705-4f74-aa71-8b9e11680a1d.png"
    },
    {
      "aliases": [],
      "name": "saikidou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/saikidou.jpeg"
    },
    {
      "aliases": [],
      "name": "saikyou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/saikyou.gif"
    },
    {
      "aliases": [],
      "name": "saitama",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/f9aa14af-0993-4e3b-84c6-cdf45aac4262.png"
    },
    {
      "aliases": [],
      "name": "saretai",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/931bf73b-bd6a-4dc6-9dda-3f861176f74a.png"
    },
    {
      "aliases": [],
      "name": "saretemitai",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/391eb9c9-9452-40c3-8549-cdb0b7112f2e.png"
    },
    {
      "aliases": [],
      "name": "scala",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/dbe3a7b3-aaea-426f-ab37-532367af1cef.png"
    },
    {
      "aliases": [],
      "name": "seitai_server",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/901006af-1b56-467b-a86b-264f71d00839.png"
    },
    {
      "aliases": [],
      "name": "seitai_server_ni_siteyarou",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/3bfa486e-6872-4769-82fe-34a737694254.png"
    },
    {
      "aliases": [],
      "name": "sekinin",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/e4018a9f-1452-4dc1-81db-f4ac16fb6a4f.png"
    },
    {
      "aliases": [],
      "name": "sekiyuou",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/071ddca7-1f28-4c35-958d-b29be9e39d43.png"
    },
    {
      "aliases": [],
      "name": "senpai",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/da5d0274-be70-4b89-8681-2ef46be33307.png"
    },
    {
      "aliases": [],
      "name": "sensei",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/2c713e8e-dbc9-4120-8c1c-ec0283a73f12.png"
    },
    {
      "aliases": [],
      "name": "server_ni_naruzo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/20fc8b19-4616-43d4-8678-60fbc040471b.png"
    },
    {
      "aliases": [],
      "name": "setsu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/setsu.png"
    },
    {
      "aliases": [],
      "name": "seyakate",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/seyakate.png"
    },
    {
      "aliases": [],
      "name": "sheep_verified",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/sheep_verified.png"
    },
    {
      "aliases": [],
      "name": "shigomodo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/shigomodo.png"
    },
    {
      "aliases": [],
      "name": "shin",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/shin.png"
    },
    {
      "aliases": [],
      "name": "shinjirou_koubun",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/shinjirou_koubun.png"
    },
    {
      "aliases": [],
      "name": "shinsaku",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/403173b0-1b41-4085-a755-fda7b5ecedec.png"
    },
    {
      "aliases": [],
      "name": "shiogatanneeyo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/shiogatanneeyo.png"
    },
    {
      "aliases": [],
      "name": "shitai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/shitai.png"
    },
    {
      "aliases": [],
      "name": "shosetsuaru",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/3fba8994-36e5-4c07-a8e3-d091f9fda93f.png"
    },
    {
      "aliases": [],
      "name": "shpongle",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/shpongle.png"
    },
    {
      "aliases": [],
      "name": "shpongle",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/shpongle.png"
    },
    {
      "aliases": [],
      "name": "shukujitsu_shukkin",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/shukujitsu_shukkin.png"
    },
    {
      "aliases": ["syukujitukankeinai"],
      "name": "shukujitukankeinai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/shukujitukankeinai.png"
    },
    {
      "aliases": [],
      "name": "shukusei",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/shukusei.png"
    },
    {
      "aliases": [],
      "name": "shukusei",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/shukusei.png"
    },
    {
      "aliases": [],
      "name": "shumi",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/shumi.png"
    },
    {
      "aliases": [],
      "name": "sinri",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/0d10731e-18ff-4977-9b9c-4a86e60b4fd5.png"
    },
    {
      "aliases": [],
      "name": "sitehosii",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/5947fe17-6668-4904-8863-71ed832f2694.png"
    },
    {
      "aliases": [],
      "name": "sitenai",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/1374ba44-a244-4e87-b7e1-2451bc185db3.png"
    },
    {
      "aliases": [],
      "name": "siteru",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/e47b2b40-b5af-4d5d-a9e1-17ab8dddf34f.png"
    },
    {
      "aliases": [],
      "name": "sittai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/sittai.png"
    },
    {
      "aliases": [],
      "name": "sittai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/sittai.png"
    },
    {
      "aliases": [],
      "name": "sitteokou",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/webpublic-e80bab51-0c91-4726-9964-53a80cad1901.jpg"
    },
    {
      "aliases": [],
      "name": "social_is_local_and_follow",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/social_is_local_and_follow.png"
    },
    {
      "aliases": [],
      "name": "sodane",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/0e576809-8c8e-444d-af69-f2aafd93d7b2.png"
    },
    {
      "aliases": [],
      "name": "sonna_banana",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/sonna_banana.png"
    },
    {
      "aliases": [],
      "name": "sonnani",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/sonnani.png"
    },
    {
      "aliases": [],
      "name": "sonnani_ureshiika",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/sonnani_ureshiika.png"
    },
    {
      "aliases": [],
      "name": "sonotyousi",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/f6155730-b9f0-4437-85bc-abdc0f06eb00.png"
    },
    {
      "aliases": [],
      "name": "soredeshikanai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/soredeshikanai.png"
    },
    {
      "aliases": [],
      "name": "sorehadoukana",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/sorehadoukana.png"
    },
    {
      "aliases": [],
      "name": "soremomatajinsei",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/soremomatajinsei.gif"
    },
    {
      "aliases": [],
      "name": "sore_of_sore",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/sore_of_sore.png"
    },
    {
      "aliases": [],
      "name": "sore_yatteru",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/sore_yatteru.png"
    },
    {
      "aliases": [],
      "name": "soudane",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/soudane.png"
    },
    {
      "aliases": [],
      "name": "soudayo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/soudayo.png"
    },
    {
      "aliases": [],
      "name": "soudesu",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/38a60ffc-3d00-4a0f-b6a4-57f635b071be.png"
    },
    {
      "aliases": [],
      "name": "soukashira",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/soukashira.png"
    },
    {
      "aliases": [],
      "name": "sounano",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/sounano.gif"
    },
    {
      "aliases": [],
      "name": "soutai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/soutai.png"
    },
    {
      "aliases": [],
      "name": "souwayo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/souwayo.png"
    },
    {
      "aliases": [],
      "name": "stamp",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/ceca8214-ff19-470b-9069-60fcf919dd0e.png"
    },
    {
      "aliases": [],
      "name": "sugesuge_voo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/2910a062-957f-4baf-9e53-49a9b45e899f.png"
    },
    {
      "aliases": [],
      "name": "sugosou",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/b9311ddc-85e2-412c-8ed1-700ad1109e7b.png"
    },
    {
      "aliases": [],
      "name": "suki",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/40bdf625-5da3-4691-8222-410ef7e578b4.png"
    },
    {
      "aliases": [],
      "name": "sukkiri",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/sukkiri.png"
    },
    {
      "aliases": [],
      "name": "sukkiri2",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/sukkiri2.png"
    },
    {
      "aliases": [],
      "name": "sukkokoko",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/sukkokoko.png"
    },
    {
      "aliases": [],
      "name": "super_chat_10000yen",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/webpublic-eb172695-ce66-4988-bda6-676a46d95b25.jpg"
    },
    {
      "aliases": [],
      "name": "super_chat_500yen",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/webpublic-0507768c-b87b-4b78-8022-997edea5dc71.jpg"
    },
    {
      "aliases": [],
      "name": "sutekidane",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/080a0dc0-380b-4b39-92a7-221a224026da.png"
    },
    {
      "aliases": [],
      "name": "synthv",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/synthv.png"
    },
    {
      "aliases": [],
      "name": "syokken_ranyou",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/d5d5fb58-4403-41e4-9919-5b812f647838.png"
    },
    {
      "aliases": [],
      "name": "syu",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/d21f2922-0567-40d0-a4a8-8083149b5b2a.png"
    },
    {
      "aliases": [],
      "name": "tabetai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/tabetai.png"
    },
    {
      "aliases": [],
      "name": "tabun_sou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/tabun_sou.png"
    },
    {
      "aliases": [],
      "name": "taichou_fryou",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/webpublic-7fe041df-3cba-4c7b-9c1a-4b5957ddce00.png"
    },
    {
      "aliases": [],
      "name": "taotie",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/taotie.png"
    },
    {
      "aliases": [],
      "name": "taso",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/c2099bee-73d8-42de-9198-8b897a76d771.png"
    },
    {
      "aliases": [],
      "name": "tasukaru",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/c3a6d682-e477-41d6-80f2-21f0b1743021.png"
    },
    {
      "aliases": [],
      "name": "teetee",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/teetee.png"
    },
    {
      "aliases": [],
      "name": "teetee",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/teetee.png"
    },
    {
      "aliases": [],
      "name": "teiji_taisha",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/teiji_taisha.png"
    },
    {
      "aliases": [],
      "name": "tere",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/13d80867-59b1-446d-87df-df6b50d92120.png"
    },
    {
      "aliases": [],
      "name": "thinking_knife",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/thinking_knife.png"
    },
    {
      "aliases": [],
      "name": "thinking_pad",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/thinking_pad.png"
    },
    {
      "aliases": [],
      "name": "tikutiku_kotoba",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/tikutiku_kotoba.png"
    },
    {
      "aliases": [],
      "name": "time",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/time.png"
    },
    {
      "aliases": [],
      "name": "to",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/3b7741e7-cbed-4a4f-bdc1-c8f97fa59030.png"
    },
    {
      "aliases": [],
      "name": "tobu_nodaline",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/tobu_nodaline.png"
    },
    {
      "aliases": [],
      "name": "tokkyu_jubutsu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/tokkyu_jubutsu.png"
    },
    {
      "aliases": [],
      "name": "totemo_kawaii",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/6e2a5a0e-ffe1-4933-970b-d4dea46a721f.png"
    },
    {
      "aliases": [],
      "name": "totemosore",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/totemosore.png"
    },
    {
      "aliases": [],
      "name": "totemosou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/totemosou.png"
    },
    {
      "aliases": [],
      "name": "totemoyoi",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/totemoyoi.png"
    },
    {
      "aliases": [],
      "name": "tottemo_cute",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/c8beeccf-8398-4358-bbd4-18362655a3d0.png"
    },
    {
      "aliases": [],
      "name": "tourounagashi",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/1d6e0704-5cbc-4e02-886a-455a60ca082d.png"
    },
    {
      "aliases": [],
      "name": "toutoi",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/toutoi.png"
    },
    {
      "aliases": [],
      "name": "toutoi",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/toutoi.png"
    },
    {
      "aliases": [],
      "name": "tripletsparrot",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/tripletsparrot.gif"
    },
    {
      "aliases": [],
      "name": "tsugihanashi",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/818196f0-d2ab-4a04-a737-23cc3c73bf0d.gif"
    },
    {
      "aliases": [],
      "name": "tsuyoso",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/tsuyoso.png"
    },
    {
      "aliases": [],
      "name": "turai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/turai.png"
    },
    {
      "aliases": [],
      "name": "tyunpuppu",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/02358d7f-35d2-4d7a-a565-0564a135ce4b.png"
    },
    {
      "aliases": [],
      "name": "uber_eats",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/476aaa62-ce61-4fdc-91d3-42b4ca94e072.png"
    },
    {
      "aliases": [],
      "name": "ubuntu",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/67a7e91d-4f56-4e82-8293-03a46391ce84.png"
    },
    {
      "aliases": [],
      "name": "uhee",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/18501dee-517b-4f9d-b7a9-e925c5956a61.png"
    },
    {
      "aliases": [],
      "name": "ultimate_anko_circle",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ultimate_anko_circle.png"
    },
    {
      "aliases": [],
      "name": "ultra_bakasake_nomi",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ultra_bakasake_nomi.png"
    },
    {
      "aliases": [],
      "name": "un",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/ca966525-8be6-45b9-9f08-f379465e361a.png"
    },
    {
      "aliases": [],
      "name": "unitycube",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/unitycube.png"
    },
    {
      "aliases": [],
      "name": "unitycube_2004",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/unitycube_2004.png"
    },
    {
      "aliases": [],
      "name": "ureshii",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/ureshii.png"
    },
    {
      "aliases": [],
      "name": "usapyonpyon",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/54550956-a3b2-4e07-adae-6e0c3459e9f4.png"
    },
    {
      "aliases": [],
      "name": "usodesu",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/ee1426d1-9e7c-4baf-a699-a4ee461c72d4.png"
    },
    {
      "aliases": [],
      "name": "utau",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/utau.jpeg"
    },
    {
      "aliases": [],
      "name": "vlang",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/vlang.png"
    },
    {
      "aliases": [],
      "name": "vocaloid",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/vocaloid.jpeg"
    },
    {
      "aliases": [],
      "name": "vscode",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/c437e7de-290d-41a1-ac0a-92bba2f80010.png"
    },
    {
      "aliases": [],
      "name": "vultr",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/vultr.png"
    },
    {
      "aliases": [""],
      "name": "vultr_logo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/vultr_logo.png"
    },
    {
      "aliases": [],
      "name": "waai",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/waai.png"
    },
    {
      "aliases": [],
      "name": "waimo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/waimo.png"
    },
    {
      "aliases": [],
      "name": "wakaiseyo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/ef5b67df-5e20-4dce-b2de-6ca3cb12a1e0.png"
    },
    {
      "aliases": [],
      "name": "wakarisou",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/05d3d2a9-56e6-4ede-adb9-28fd74b0d990.png"
    },
    {
      "aliases": [],
      "name": "wakarukamo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/bfd5f460-f437-446b-94fd-3ae4cfdfc456.png"
    },
    {
      "aliases": [],
      "name": "wakarunaa",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/wakarunaa.png"
    },
    {
      "aliases": [],
      "name": "wakatta",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/61829d98-7fb3-4029-83ef-78c462f47056.png"
    },
    {
      "aliases": ["trap"],
      "name": "wana",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/wana.png"
    },
    {
      "aliases": [],
      "name": "waraitomanneeyo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/waraitomanneeyo.png"
    },
    {
      "aliases": [],
      "name": "warauna",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/warauna.png"
    },
    {
      "aliases": [],
      "name": "wasureta",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/wasureta.png"
    },
    {
      "aliases": [],
      "name": "_wave",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/8e2d3c7a-c8d7-4b23-af00-3fb4550b6210.png"
    },
    {
      "aliases": [],
      "name": "wave",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/345eccb3-2f25-4647-9776-99d217b03410.png"
    },
    {
      "aliases": [],
      "name": "wo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/66447670-bc9a-4d5c-891a-114f6adb4d45.png"
    },
    {
      "aliases": [],
      "name": "woozy_cute",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/6d87c8cc-1d0b-4241-b453-db806e25036a.png"
    },
    {
      "aliases": [],
      "name": "xtu",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/2b8da5b5-801f-4de4-9665-6eb3097b4f2c.png"
    },
    {
      "aliases": [],
      "name": "yaan",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/c4bc43fe-17fb-4961-82ff-84ef62e0c0f3.png"
    },
    {
      "aliases": [],
      "name": "yabai_logo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/066eb933-5b97-4a57-a9b7-991d0146cf25.png"
    },
    {
      "aliases": [],
      "name": "yaitare",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yaitare.png"
    },
    {
      "aliases": [],
      "name": "yamero",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/2e6a33bb-f675-4b30-956c-3c1a28fb3b01.png"
    },
    {
      "aliases": [],
      "name": "yarujan",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yarujan.png"
    },
    {
      "aliases": [],
      "name": "yodobashi_extreme",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yodobashi_extreme.png"
    },
    {
      "aliases": [],
      "name": "yoidore",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yoidore.png"
    },
    {
      "aliases": [],
      "name": "yokuaru",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/92df44e8-eb39-41e2-8ba7-97a95c1caafa.png"
    },
    {
      "aliases": [],
      "name": "yokunai",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/fcfdf830-620e-4372-b294-9fbf7df54bec.png"
    },
    {
      "aliases": [],
      "name": "yokutteyo",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/8bd695eb-d0e3-44b1-bf7d-d8c24a599f65.png"
    },
    {
      "aliases": [],
      "name": "yokuyatta",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yokuyatta.png"
    },
    {
      "aliases": [],
      "name": "yoltsu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yoltsu.png"
    },
    {
      "aliases": [],
      "name": "yoroshikuonegaishimasu",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yoroshikuonegaishimasu.png"
    },
    {
      "aliases": [],
      "name": "yosano_akiko",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yosano_akiko.png"
    },
    {
      "aliases": [],
      "name": "yosano_akiko_is_always_watching_you",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yosano_akiko_is_always_watching_you.jpg"
    },
    {
      "aliases": [],
      "name": "yosasou",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/fdf3d935-b140-4eda-8a11-3def3c0c500b.png"
    },
    {
      "aliases": [],
      "name": "yotimu_cry",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yotimu_cry.png"
    },
    {
      "aliases": [],
      "name": "yotimu_sirome",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yotimu_sirome.png"
    },
    {
      "aliases": [],
      "name": "yotimu_suki",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yotimu_suki.png"
    },
    {
      "aliases": [],
      "name": "yunirucry",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yunirucry.png"
    },
    {
      "aliases": [],
      "name": "yuniruganbare",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yuniruganbare.png"
    },
    {
      "aliases": [],
      "name": "yunirugg",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yunirugg.png"
    },
    {
      "aliases": [],
      "name": "yunirugl",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yunirugl.png"
    },
    {
      "aliases": [],
      "name": "yuri_jan",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yuri_jan.png"
    },
    {
      "aliases": [],
      "name": "yurubo",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yurubo.png"
    },
    {
      "aliases": [],
      "name": "yusho",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/yusho.png"
    },
    {
      "aliases": [],
      "name": "zangyou",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/zangyou.png"
    },
    {
      "aliases": [],
      "name": "zenchi1",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/307ba6ad-cc1c-431c-aa6c-12ac088d6ff8.png"
    },
    {
      "aliases": [],
      "name": "zenchi2",
      "category": null,
      "url": "https://s3.arkjp.net/misskey/9db98bc5-07cd-481f-a861-1525a5e4ce3b.png"
    },
    {
      "aliases": [],
      "name": "zip_de_kure",
      "category": null,
      "url": "https://s3.arkjp.net/emoji/zip_de_kure.png"
    }
  ];
  let emojiIndex = {};
  for(const index in emojis){
    for(const alias in emojis[index].aliases){
      emojiIndex[alias] = index;
    }
    emojiIndex[emojis[index].name] = index;
  }

  // insert links for chart service
  const decorate = (textElements) => {

    for (const i in textElements){
      let innerText = textElements[i].innerText;
      if(!innerText){
        continue;
      }
      if(innerText.trim() == ""){continue;}

      //
      if( textElements[i].getAttribute("data-decorate") == "done" ){
        continue;
      }

      let innerHtml = textElements[i].innerHTML;
      if(!innerHtml){
        continue;
      }
      innerHtml = innerHtml.toLowerCase();

      const regexpToMatch = /:([\w-_]*?):/g;
      const matches = [...innerHtml.matchAll(regexpToMatch)];

      //
      for(const match of matches){
        if(!emojiIndex[match[1]]){
          continue;
        }else{

          const emojiIndexToShow = emojiIndex[match[1]];
          const emojiImgElm = GM_addElement(document.getElementsByTagName('span')[i], 'img', {
            src: emojis[emojiIndexToShow].url,
            alt: `:${match[1]}:`,
            height:32
          });

          //const emojiImgElm = `<img alt=':${match[1]}:' src='${emojis[emojiIndexToShow].url}'>`;
          //const regexpToReplace = new RegExp( `:${match[1]}:`, 'g' );
          //const foo = innerHtml.split(`:${match[1]}:`).join(emojiImgElm);
          //innerHtml = innerHtml.split(`:${match[1]}:`).join(emojiImgElm);//innerHtml.replace(regexpToReplace, emojiImgElm);
        }
      }
      //textElements[i].innerHTML = innerHtml;
      textElements[i].dataset.decorate = "done";
    }
  }

  //check and insert periodically (2sec)
  let scan_for_emojitag = () =>{
    window.setTimeout(function(){
      let span_list = document.getElementsByTagName("span");
      decorate(span_list);
      scan_for_emojitag();
    }, 2000);
  }

  //bootstrap
  scan_for_emojitag();
})();
