// ==UserScript==
// @name         GithubCard
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  生成Github的简介卡片
// @connect      avatars.githubusercontent.com
// @grant        GM_xmlhttpRequest
// @author       ljs-2002
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @match        https://github.com/*/*
// @downloadURL https://update.greasyfork.org/scripts/471947/GithubCard.user.js
// @updateURL https://update.greasyfork.org/scripts/471947/GithubCard.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class _repoName {
        constructor(ownerName, repoName) {
            this.ownerName = ownerName,
                this.repoName = repoName,
                this.fullName = ownerName + '/' + repoName
        }

        url() {
            return "https://api.github.com/repos/" + this.fullName
        }
    }

    async function getFromAPI(url, type) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data; // 使用async/await来获取解决值并作为函数a()的返回值
        } catch (error) {
            console.error("请求出错:", error);
            throw error; // 在此抛出错误，以确保调用函数的地方可以捕获到错误
        }
    }

    class GithubInfo {
        constructor(info_dict) {

            this.repo_name = info_dict.name
            this.repo_href = info_dict.html_url
            this.tag_href = this.repo_href + '/tags'
            this.star_href = this.repo_href + '/stargazers'
            this.fork_href = this.repo_href + '/forks'
            this.owner = info_dict.owner
            this.description = info_dict.description
            this.stars_count = String(info_dict.stargazers_count)
            this.language = info_dict.language
            this.forks_count = String(info_dict.forks_count)
            this.license = info_dict.license ? info_dict.license.spdx_id : undefined
            if (this.license !== undefined){
                this.license_href = this.repo_href + '/blob/' + info_dict.default_branch + '/LICENSE'
                if(this.license === 'NOASSERTION'){
                    this.license = 'Custom-License'
                }
            }
            this.tag_count ='0'
            this.topics = info_dict.topics

        }

    }

    function getRepoName() {
        var owner_repo = /github.com\/([^/]+)\/([^/]+)/i
        // 获取当前页面的URL
        var currentUrl = window.location.href;
        var matches = currentUrl.match(owner_repo)
        if (matches) {
            var ownerName = matches[1]
            var repoName = matches[2]
        }else{
            throw new Error("can't matches current repo name!")
        }
        return new _repoName(ownerName, repoName)
    }

    function renderEmoji(desc) {
        // Split the string using lookbehind and lookahead regex pattern
        const chunks = desc.split(/(?<=\s)|(?=\s)/);
    
        // Define a dictionary mapping symbols to emojis (assuming it's defined somewhere in the code)
        const emoji = {":+1:": "👍", ":100:": "💯", ":1234:": "🔢",
        ":8ball:": "🎱", ":a:": "🅰️", ":ab:": "🆎", 
        ":abc:": "🔤", ":abcd:": "🔡", ":accept:": "🉑", 
        ":aerial_tramway:": "🚡", ":airplane:": "✈️", 
        ":alarm_clock:": "⏰", ":alien:": "👽", 
        ":ambulance:": "🚑", ":anchor:": "⚓️", 
        ":angel:": "👼", ":anger:": "💢", 
        ":angry:": "😠", ":anguished:": "😧", 
        ":ant:": "🐜", ":apple:": "🍎", 
        ":aquarius:": "♒️", ":aries:": "♈️", 
        ":arrow_backward:": "◀️", ":arrow_double_down:": "⏬", 
        ":arrow_double_up:": "⏫", ":arrow_down:": "⬇️", 
        ":arrow_down_small:": "🔽", ":arrow_forward:": "▶️", 
        ":arrow_heading_down:": "⤵️", ":arrow_heading_up:": "⤴️", 
        ":arrow_left:": "⬅️", ":arrow_lower_left:": "↙️", 
        ":arrow_lower_right:": "↘️", ":arrow_right:": "➡️", 
        ":arrow_right_hook:": "↪️", ":arrow_up:": "⬆️", 
        ":arrow_up_down:": "↕️", ":arrow_up_small:": "🔼", 
        ":arrow_upper_left:": "↖️", ":arrow_upper_right:": "↗️", 
        ":arrows_clockwise:": "🔃", ":arrows_counterclockwise:": "🔄", 
        ":art:": "🎨", ":articulated_lorry:": "🚛", ":astonished:": "😲", 
        ":athletic_shoe:": "👟", ":atm:": "🏧", ":b:": "🅱️", ":baby:": "👶", 
        ":baby_bottle:": "🍼", ":baby_chick:": "🐤", ":baby_symbol:": "🚼", 
        ":back:": "🔙", ":baggage_claim:": "🛄", ":balloon:": "🎈", 
        ":ballot_box_with_check:": "☑️", ":bamboo:": "🎍", 
        ":banana:": "🍌", ":bangbang:": "‼️", ":bank:": "🏦", 
        ":bar_chart:": "📊", ":barber:": "💈", ":baseball:": "⚾️", 
        ":basketball:": "🏀", ":bath:": "🛀", ":bathtub:": "🛁", 
        ":battery:": "🔋", ":bear:": "🐻", ":bee:": "🐝", ":beer:": "🍺", 
        ":beers:": "🍻", ":beetle:": "🐞", ":beginner:": "🔰", ":bell:": "🔔", 
        ":bento:": "🍱", ":bicyclist:": "🚴", ":bike:": "🚲", ":bikini:": "👙", 
        ":bird:": "🐦", ":birthday:": "🎂", ":black_circle:": "⚫️", 
        ":black_joker:": "🃏", ":black_large_square:": "⬛️", 
        ":black_medium_small_square:": "◾️", ":black_medium_square:": "◼️", 
        ":black_nib:": "✒️", ":black_small_square:": "▪️", 
        ":black_square_button:": "🔲", ":blossom:": "🌼", 
        ":blowfish:": "🐡", ":blue_book:": "📘", ":blue_car:": "🚙", 
        ":blue_heart:": "💙", ":blush:": "😊", ":boar:": "🐗", 
        ":boat:": "⛵️", ":bomb:": "💣", ":book:": "📖", ":bookmark:": "🔖", 
        ":bookmark_tabs:": "📑", ":books:": "📚", ":boom:": "💥", 
        ":boot:": "👢", ":bouquet:": "💐", ":bow:": "🙇", 
        ":bow_and_arrow:": "🏹", ":bowing_man:": "🙇", 
        ":bowing_woman:": "🙇\u200D♀", ":bowling:": "🎳",
        ":bowtie:": "", ":boy:": "👦", ":bread:": "🍞", 
        ":bride_with_veil:": "👰", ":bridge_at_night:": "🌉", 
        ":briefcase:": "💼", ":broken_heart:": "💔", ":bug:": "🐛", 
        ":bulb:": "💡", ":bullettrain_front:": "🚅", 
        ":bullettrain_side:": "🚄", ":bus:": "🚌", ":busstop:": "🚏", 
        ":bust_in_silhouette:": "👤", ":busts_in_silhouette:": "👥", 
        ":cactus:": "🌵", ":cake:": "🍰", ":calendar:": "📆", 
        ":calling:": "📲", ":camel:": "🐫", ":camera:": "📷", ":canada:": "🇨🇦", 
        ":canary_islands:": "🇮🇨", ":cancer:": "♋️", 
        ":candle:": "🕯", ":candy:": "🍬", ":capital_abcd:": "🔠", 
        ":capricorn:": "♑️", ":car:": "🚗", ":card_index:": "📇", 
        ":carousel_horse:": "🎠", ":cat:": "🐱", ":cat2:": "🐈", 
        ":cd:": "💿", ":chart:": "💹", ":chart_with_downwards_trend:": "📉", 
        ":chart_with_upwards_trend:": "📈", ":checkered_flag:": "🏁", 
        ":cherries:": "🍒", ":cherry_blossom:": "🌸", ":chestnut:": "🌰", 
        ":chicken:": "🐔", ":children_crossing:": "🚸", ":chocolate_bar:": "🍫", 
        ":christmas_tree:": "🎄", ":church:": "⛪️", ":cinema:": "🎦", 
        ":circus_tent:": "🎪", ":city_sunrise:": "🌇", ":city_sunset:": "🌆", 
        ":cl:": "🆑", ":clap:": "👏", ":clapper:": "🎬", ":clipboard:": "📋", 
        ":clock1:": "🕐", ":clock10:": "🕙", ":clock1030:": "🕥", 
        ":clock11:": "🕚", ":clock1130:": "🕦", ":clock12:": "🕛", 
        ":clock1230:": "🕧", ":clock130:": "🕜", ":clock2:": "🕑", 
        ":clock230:": "🕝", ":clock3:": "🕒", ":clock330:": "🕞", 
        ":clock4:": "🕓", ":clock430:": "🕟", ":clock5:": "🕔", 
        ":clock530:": "🕠", ":clock6:": "🕕", ":clock630:": "🕡", 
        ":clock7:": "🕖", ":clock730:": "🕢", ":clock8:": "🕗", 
        ":clock830:": "🕣", ":clock9:": "🕘", ":clock930:": "🕤", 
        ":closed_book:": "📕", ":closed_lock_with_key:": "🔐", 
        ":closed_umbrella:": "🌂", ":cloud:": "☁️", ":clubs:": "♣️", 
        ":cn:": "🇨🇳", ":cocktail:": "🍸", ":coffee:": "☕️", ":cold_sweat:": "😰", 
        ":collision:": "💥", ":computer:": "💻", ":confetti_ball:": 
        "🎊", ":confounded:": "😖", ":confused:": "😕", ":congratulations:": "㊗️", 
        ":construction:": "🚧", ":construction_worker:": "👷", 
        ":convenience_store:": "🏪", ":cookie:": "🍪", ":cool:": "🆒", 
        ":cop:": "👮", ":copyright:": "©️", ":corn:": "🌽", ":couple:": "👫", 
        ":couple_with_heart:": "💑", ":cow:": "🐮", ":cow2:": "🐄", 
        ":credit_card:": "💳", ":crescent_moon:": "🌙", ":crocodile:": "🐊", 
        ":crossed_flags:": "🎌", ":crown:": "👑", ":cry:": "😢", 
        ":crying_cat_face:": "😿", ":crystal_ball:": "🔮", ":cupid:": "💘", 
        ":curly_loop:": "➰", ":currency_exchange:": "💱", ":curry:": "🍛", 
        ":custard:": "🍮", ":customs:": "🛃", ":cyclone:": "🌀", ":dancer:": "💃", 
        ":dancers:": "👯", ":dango:": "🍡", ":dart:": "🎯", ":dash:": "💨", 
        ":date:": "📅", ":de:": "🇩🇪", ":deciduous_tree:": "🌳", 
        ":department_store:": "🏬", ":diamond_shape_with_a_dot_inside:": "💠", 
        ":diamonds:": "♦️", ":disappointed:": "😞", ":disappointed_relieved:": "😥", 
        ":dizzy:": "💫", ":dizzy_face:": "😵", ":do_not_litter:": "🚯", 
        ":dog:": "🐶", ":dog2:": "🐕", ":dollar:": "💵", ":dolls:": "🎎", 
        ":dolphin:": "🐬", ":door:": "🚪", ":doughnut:": "🍩", ":dragon:": "🐉", 
        ":dragon_face:": "🐲", ":dress:": "👗", ":dromedary_camel:": "🐪", 
        ":droplet:": "💧", ":dvd:": "📀", ":e-mail:": "📧", ":ear:": "👂", 
        ":ear_of_rice:": "🌾", ":earth_africa:": "🌍", ":earth_americas:": "🌎", 
        ":earth_asia:": "🌏", ":egg:": "🥚", ":eggplant:": "🍆", ":eight:": "8️⃣", 
        ":eight_pointed_black_star:": "✴️", ":eight_spoked_asterisk:": "✳️", 
        ":electric_plug:": "🔌", ":elephant:": "🐘", ":email:": "✉️", 
        ":end:": "🔚", ":envelope:": "✉️", ":envelope_with_arrow:": "📩", 
        ":es:": "🇪🇸", ":euro:": "💶", ":european_castle:": "🏰", 
        ":european_post_office:": "🏤", ":evergreen_tree:": "🌲", 
        ":exclamation:": "❗️", ":expressionless:": "😑", ":eyeglasses:": "👓", 
        ":eyes:": "👀", ":facepunch:": "👊", ":factory:": "🏭", 
        ":fallen_leaf:": "🍂", ":family:": "👪", ":fast_forward:": "⏩", 
        ":fax:": "📠", ":fearful:": "😨", ":feelsgood:": "", 
        ":feet:": "🐾", ":ferris_wheel:": "🎡", ":file_folder:": "📁", 
        ":finnadie:": "", ":fire:": "🔥", ":fire_engine:": "🚒", 
        ":fireworks:": "🎆", ":first_quarter_moon:": "🌓", ":first_quarter_moon_with_face:": "🌛", 
        ":fish:": "🐟", ":fish_cake:": "🍥", ":fishing_pole_and_fish:": "🎣", ":fist:": "✊", 
        ":five:": "5️⃣", ":flags:": "🎏", ":flashlight:": "🔦", ":flipper:": "🐬", 
        ":floppy_disk:": "💾", ":flower_playing_cards:": "🎴", ":flushed:": "😳", 
        ":foggy:": "🌁", ":football:": "🏈", ":footprints:": "👣", ":fork_and_knife:": "🍴", 
        ":fountain:": "⛲️", ":four:": "4️⃣", ":four_leaf_clover:": "🍀", ":fr:": "🇫🇷", 
        ":free:": "🆓", ":fried_shrimp:": "🍤", ":fries:": "🍟", ":frog:": "🐸", 
        ":frowning:": "😦", ":fu:": "🖕", ":fuelpump:": "⛽️", ":full_moon:": "🌕", 
        ":full_moon_with_face:": "🌝", ":game_die:": "🎲", ":gb:": "🇬🇧", ":gem:": "💎", 
        ":gemini:": "♊️", ":ghost:": "👻", ":gift:": "🎁", ":gift_heart:": "💝", 
        ":girl:": "👧", ":globe_with_meridians:": "🌐", ":goat:": "🐐", ":goberserk:": "", 
        ":godmode:": "", ":golf:": "⛳️", ":grapes:": "🍇", ":green_apple:": "🍏", ":green_book:": "📗", 
        ":green_heart:": "💚", ":grey_exclamation:": "❕", ":grey_question:": "❔", ":grimacing:": "😬", ":grin:": "😁", 
        ":grinning:": "😀", ":guardsman:": "💂", ":guitar:": "🎸", ":gun:": "🔫", ":haircut:": "💇", ":hamburger:": "🍔", 
        ":hammer:": "🔨", ":hamster:": "🐹", ":hand:": "✋", ":handbag:": "👜", ":hankey:": "💩", ":hash:": "#️⃣", ":hatched_chick:": "🐥", 
        ":hatching_chick:": "🐣", ":headphones:": "🎧", ":hear_no_evil:": "🙉", ":heart:": "❤️", ":heart_decoration:": "💟", 
        ":heart_eyes:": "😍", ":heart_eyes_cat:": "😻", ":heartbeat:": "💓", ":heartpulse:": "💗", ":hearts:": "♥️", 
        ":heavy_check_mark:": "✔️", ":heavy_division_sign:": "➗", ":heavy_dollar_sign:": "💲", ":heavy_exclamation_mark:": "❗️", 
        ":heavy_minus_sign:": "➖", ":heavy_multiplication_x:": "✖️", ":heavy_plus_sign:": "➕", 
        ":helicopter:": "🚁", ":herb:": "🌿", ":hibiscus:": "🌺", ":high_brightness:": "🔆", 
        ":high_heel:": "👠", ":hocho:": "🔪", ":honey_pot:": "🍯", ":honeybee:": "🐝", ":horse:": "🐴", 
        ":horse_racing:": "🏇", ":hospital:": "🏥", ":hotel:": "🏨", ":hotsprings:": "♨️", ":hourglass:": "⌛️", 
        ":hourglass_flowing_sand:": "⏳", ":house:": "🏠", ":house_with_garden:": "🏡", ":hurtrealbad:": "", 
        ":hushed:": "😯", ":ice_cream:": "🍨", ":icecream:": "🍦", ":id:": "🆔", ":ideograph_advantage:": "🉐", 
        ":imp:": "👿", ":inbox_tray:": "📥", ":incoming_envelope:": "📨", ":information_desk_person:": "💁", 
        ":information_source:": "ℹ️", ":innocent:": "😇", ":interrobang:": "⁉️", ":iphone:": "📱", ":it:": "🇮🇹", 
        ":izakaya_lantern:": "🏮", ":jack_o_lantern:": "🎃", ":japan:": "🗾", ":japanese_castle:": "🏯", ":japanese_goblin:": "👺", 
        ":japanese_ogre:": "👹", ":jeans:": "👖", ":joy:": "😂", ":joy_cat:": "😹", ":jp:": "🇯🇵", ":key:": "🔑", 
        ":keycap_ten:": "🔟", ":kimono:": "👘", ":kiss:": "💋", ":kissing:": "😗", ":kissing_cat:": "😽", 
        ":kissing_closed_eyes:": "😚", ":kissing_heart:": "😘", ":kissing_smiling_eyes:": "😙", ":koala:": "🐨", 
        ":koko:": "🈁", ":kr:": "🇰🇷", ":lantern:": "🏮", ":large_blue_circle:": "🔵", ":large_blue_diamond:": "🔷", 
        ":large_orange_diamond:": "🔶", ":last_quarter_moon:": "🌗", ":last_quarter_moon_with_face:": "🌜", 
        ":laughing:": "😆", ":leaves:": "🍃", ":ledger:": "📒", ":left_luggage:": "🛅", ":left_right_arrow:": "↔️", 
        ":leftwards_arrow_with_hook:": "↩️", ":lemon:": "🍋", ":leo:": "♌️", ":leopard:": "🐆", ":libra:": "♎️", 
        ":light_rail:": "🚈", ":link:": "🔗", ":lips:": "👄", ":lipstick:": "💄", ":lock:": "🔒", 
        ":lock_with_ink_pen:": "🔏", ":lollipop:": "🍭", ":loop:": "➿", ":loud_sound:": "🔊", 
        ":loudspeaker:": "📢", ":love_hotel:": "🏩", ":love_letter:": "💌", ":low_brightness:": "🔅", 
        ":m:": "Ⓜ️", ":mag:": "🔍", ":mag_right:": "🔎", ":mahjong:": "🀄️", ":mailbox:": "📫", 
        ":mailbox_closed:": "📪", ":mailbox_with_mail:": "📬", ":mailbox_with_no_mail:": "📭", 
        ":man:": "👨", ":man_with_gua_pi_mao:": "👲", ":man_with_turban:": "👳", ":mans_shoe:": "👞", 
        ":maple_leaf:": "🍁", ":mask:": "😷", ":massage:": "💆", ":meat_on_bone:": "🍖", ":mega:": "📣", 
        ":melon:": "🍈", ":memo:": "📝", ":mens:": "🚹", ":metal:": "🤘", ":metro:": "🚇", ":microphone:": 
        "🎤", ":microscope:": "🔬", ":milky_way:": "🌌", ":minibus:": "🚐", ":minidisc:": "💽", 
        ":mobile_phone_off:": "📴", ":money_with_wings:": "💸", ":moneybag:": "💰", ":monkey:": "🐒", 
        ":monkey_face:": "🐵", ":monorail:": "🚝", ":moon:": "🌔", ":mortar_board:": "🎓", ":mount_fuji:": "🗻", 
        ":mountain_bicyclist:": "🚵", ":mountain_cableway:": "🚠", ":mountain_railway:": "🚞", ":mouse:": "🐭", 
        ":mouse2:": "🐁", ":movie_camera:": "🎥", ":moyai:": "🗿", ":muscle:": "💪", ":mushroom:": "🍄", 
        ":musical_keyboard:": "🎹", ":musical_note:": "🎵", ":musical_score:": "🎼", ":mute:": "🔇", ":nail_care:": 
        "💅", ":name_badge:": "📛", ":neckbeard:": "", ":necktie:": "👔", ":negative_squared_cross_mark:": 
        "❎", ":neutral_face:": "😐", ":new:": "🆕", ":new_moon:": "🌑", ":new_moon_with_face:": "🌚", ":newspaper:": 
        "📰", ":ng:": "🆖", ":night_with_stars:": "🌃", ":nine:": "9️⃣", ":no_bell:": "🔕", ":no_bicycles:": "🚳", 
        ":no_entry:": "⛔️", ":no_entry_sign:": "🚫", ":no_good:": "🙅", ":no_mobile_phones:": "📵", ":no_mouth:": "😶", 
        ":no_pedestrians:": "🚷", ":no_smoking:": "🚭", ":non-potable_water:": "🚱", ":nose:": "👃", ":notebook:": "📓", 
        ":notebook_with_decorative_cover:": "📔", ":notes:": "🎶", ":nut_and_bolt:": "🔩", ":o:": "⭕️", ":o2:": "🅾️", 
        ":ocean:": "🌊", ":octocat:": "", ":octopus:": "🐙", ":oden:": "🍢", ":office:": "🏢", ":ok:": "🆗", 
        ":ok_hand:": "👌", ":ok_woman:": "🙆", ":older_man:": "👴", ":older_woman:": "👵", ":on:": "🔛", 
        ":oncoming_automobile:": "🚘", ":oncoming_bus:": "🚍", ":oncoming_police_car:": "🚔", ":oncoming_taxi:": "🚖", 
        ":one:": "1️⃣", ":open_book:": "📖", ":open_file_folder:": "📂", ":open_hands:": "👐", ":open_mouth:": "😮", 
        ":ophiuchus:": "⛎", ":orange_book:": "📙", ":outbox_tray:": "📤", ":ox:": "🐂", ":package:": "📦", 
        ":page_facing_up:": "📄", ":page_with_curl:": "📃", ":pager:": "📟", ":palm_tree:": "🌴", ":panda_face:": "🐼", 
        ":paperclip:": "📎", ":parking:": "🅿️", ":part_alternation_mark:": "〽️", ":partly_sunny:": "⛅️", 
        ":passport_control:": "🛂", ":paw_prints:": "🐾", ":peach:": "🍑", ":pear:": "🍐", ":pencil:": "📝", 
        ":pencil2:": "✏️", ":penguin:": "🐧", ":pensive:": "😔", ":performing_arts:": "🎭", ":persevere:": "😣", 
        ":person_frowning:": "🙍", ":person_with_blond_hair:": "👱", ":person_with_pouting_face:": "🙎", ":phone:": "☎️", 
        ":pig:": "🐷", ":pig2:": "🐖", ":pig_nose:": "🐽", ":pill:": "💊", ":pineapple:": "🍍", ":pisces:": "♓️", 
        ":pizza:": "🍕", ":point_down:": "👇", ":point_left:": "👈", ":point_right:": "👉", ":point_up:": "☝️", 
        ":point_up_2:": "👆", ":police_car:": "🚓", ":poodle:": "🐩", ":poop:": "💩", ":post_office:": "🏣", 
        ":postal_horn:": "📯", ":postbox:": "📮", ":potable_water:": "🚰", ":pouch:": "👝", ":poultry_leg:": "🍗", 
        ":pound:": "💷", ":pouting_cat:": "😾", ":pray:": "🙏", ":princess:": "👸", ":punch:": "👊", 
        ":purple_heart:": "💜", ":purse:": "👛", ":pushpin:": "📌", ":put_litter_in_its_place:": "🚮", ":question:": "❓", 
        ":rabbit:": "🐰", ":rabbit2:": "🐇", ":racehorse:": "🐎", ":radio:": "📻", ":radio_button:": "🔘", 
        ":rage:": "😡", ":rage1:": "", ":rage2:": "", ":rage3:": "", ":rage4:": "", 
        ":railway_car:": "🚃", ":rainbow:": "🌈", ":raised_hand:": "✋", ":raised_hands:": "🙌", ":raising_hand:": "🙋", 
        ":ram:": "🐏", ":ramen:": "🍜", ":rat:": "🐀", ":recycle:": "♻️", ":red_car:": "🚗", ":red_circle:": "🔴", 
        ":registered:": "®️", ":relaxed:": "☺️", ":relieved:": "😌", ":repeat:": "🔁", ":repeat_one:": "🔂", 
        ":restroom:": "🚻", ":revolving_hearts:": "💞", ":rewind:": "⏪", ":ribbon:": "🎀", ":rice:": "🍚", 
        ":rice_ball:": "🍙", ":rice_cracker:": "🍘", ":rice_scene:": "🎑", ":ring:": "💍", ":rocket:": "🚀", 
        ":roller_coaster:": "🎢", ":rooster:": "🐓", ":rose:": "🌹", ":rotating_light:": "🚨", ":round_pushpin:": "📍", 
        ":rowboat:": "🚣", ":ru:": "🇷🇺", ":rugby_football:": "🏉", ":runner:": "🏃", ":running:": "🏃", 
        ":running_shirt_with_sash:": "🎽", ":sa:": "🈂️", ":sagittarius:": "♐️", ":sailboat:": "⛵️", 
        ":sake:": "🍶", ":sandal:": "👡", ":santa:": "🎅", ":satellite:": "📡", ":satisfied:": "😆", 
        ":saxophone:": "🎷", ":school:": "🏫", ":school_satchel:": "🎒", ":scissors:": "✂️", ":scorpius:": "♏️", 
        ":scream:": "😱", ":scream_cat:": "🙀", ":scroll:": "📜", ":seat:": "💺", ":secret:": "㊙️", ":see_no_evil:": "🙈", 
        ":seedling:": "🌱", ":seven:": "7️⃣", ":shaved_ice:": "🍧", ":sheep:": "🐑", ":shell:": "🐚", ":ship:": "🚢", 
        ":shipit:": "", ":shirt:": "👕", ":shit:": "💩", ":shoe:": "👞", ":shower:": "🚿", ":signal_strength:": "📶", 
        ":six:": "6️⃣", ":six_pointed_star:": "🔯", ":ski:": "🎿", ":skull:": "💀", ":sleeping:": "😴", ":sleepy:": "😪", 
        ":slot_machine:": "🎰", ":small_blue_diamond:": "🔹", ":small_orange_diamond:": "🔸", ":small_red_triangle:": "🔺", 
        ":small_red_triangle_down:": "🔻", ":smile:": "😄", ":smile_cat:": "😸", ":smiley:": "😃", ":smiley_cat:": "😺", 
        ":smiling_imp:": "😈", ":smirk:": "😏", ":smirk_cat:": "😼", ":smoking:": "🚬", ":snail:": "🐌", ":snake:": "🐍", 
        ":snowboarder:": "🏂", ":snowflake:": "❄️", ":snowman:": "⛄️", ":sob:": "😭", ":soccer:": "⚽️", ":soon:": "🔜", 
        ":sos:": "🆘", ":sound:": "🔉", ":space_invader:": "👾", ":spades:": "♠️", ":spaghetti:": "🍝", ":sparkle:": "❇️", 
        ":sparkler:": "🎇", ":sparkles:": "✨", ":sparkling_heart:": "💖", ":speak_no_evil:": "🙊", ":speaker:": "🔈", 
        ":speech_balloon:": "💬", ":speedboat:": "🚤", ":squirrel:": "", ":star:": "⭐️", ":star2:": "🌟", ":stars:": "🌠", 
        ":station:": "🚉", ":statue_of_liberty:": "🗽", ":steam_locomotive:": "🚂", ":stew:": "🍲", ":straight_ruler:": "📏", 
        ":strawberry:": "🍓", ":stuck_out_tongue:": "😛", ":stuck_out_tongue_closed_eyes:": "😝", 
        ":stuck_out_tongue_winking_eye:": "😜", ":sun_with_face:": "🌞", ":sunflower:": "🌻", ":sunglasses:": "😎", 
        ":sunny:": "☀️", ":sunrise:": "🌅", ":sunrise_over_mountains:": "🌄", ":surfer:": "🏄", ":sushi:": "🍣", 
        ":suspect:": "", ":suspension_railway:": "🚟", ":sweat:": "😓", ":sweat_drops:": "💦", 
        ":sweat_smile:": "😅", ":sweet_potato:": "🍠", ":swimmer:": "🏊", ":symbols:": "🔣", ":syringe:": "💉", 
        ":tada:": "🎉", ":tanabata_tree:": "🎋", ":tangerine:": "🍊", ":taurus:": "♉️", ":taxi:": "🚕", ":tea:": "🍵", 
        ":telephone:": "☎️", ":telephone_receiver:": "📞", ":telescope:": "🔭", ":tennis:": "🎾", ":tent:": "⛺️", 
        ":thought_balloon:": "💭", ":three:": "3️⃣", ":thumbsdown:": "👎", ":thumbsup:": "👍", ":ticket:": "🎫", 
        ":tiger:": "🐯", ":tiger2:": "🐅", ":tired_face:": "😫", ":tm:": "™️", ":toilet:": "🚽", ":tokyo_tower:": "🗼", 
        ":tomato:": "🍅", ":tongue:": "👅", ":top:": "🔝", ":tophat:": "🎩", ":tractor:": "🚜", ":traffic_light:": "🚥", 
        ":train:": "🚋", ":train2:": "🚆", ":tram:": "🚊", ":triangular_flag_on_post:": "🚩", ":triangular_ruler:": "📐", 
        ":trident:": "🔱", ":triumph:": "😤", ":trolleybus:": "🚎", ":trollface:": "", ":trophy:": "🏆", 
        ":tropical_drink:": "🍹", ":tropical_fish:": "🐠", ":truck:": "🚚", ":trumpet:": "🎺", ":tshirt:": "👕", 
        ":tulip:": "🌷", ":turtle:": "🐢", ":tv:": "📺", ":twisted_rightwards_arrows:": "🔀", ":two:": "2️⃣", 
        ":two_hearts:": "💕", ":two_men_holding_hands:": "👬", ":two_women_holding_hands:": "👭", ":u5272:": "🈹", 
        ":u5408:": "🈴", ":u55b6:": "🈺", ":u6307:": "🈯️", ":u6708:": "🈷️", ":u6709:": "🈶", ":u6e80:": "🈵", 
        ":u7121:": "🈚️", ":u7533:": "🈸", ":u7981:": "🈲", ":u7a7a:": "🈳", ":uk:": "🇬🇧", ":ukraine:": "🇺🇦", ":umbrella:": "☔️", 
        ":unamused:": "😒", ":underage:": "🔞", ":unlock:": "🔓", ":up:": "🆙", ":us:": "🇺🇸", ":us_virgin_islands:": "🇻🇮", 
        ":v:": "✌️", ":vertical_traffic_light:": "🚦", ":vhs:": "📼", ":vibration_mode:": "📳", ":video_camera:": "📹", 
        ":video_game:": "🎮", ":violin:": "🎻", ":virgo:": "♍️", ":volcano:": "🌋", ":vs:": "🆚", ":walking:": "🚶", 
        ":walking_man:": "🚶", ":walking_woman:": "🚶\u200D♀", ":wallis_futuna:": "🇼🇫", ":waning_crescent_moon:": "🌘", 
        ":waning_gibbous_moon:": "🌖", ":warning:": "⚠️", ":watch:": "⌚️", ":water_buffalo:": "🐃", ":watermelon:": "🍉", 
        ":wave:": "👋", ":wavy_dash:": "〰️", ":waxing_crescent_moon:": "🌒", ":waxing_gibbous_moon:": "🌔", ":wc:": "🚾", 
        ":weary:": "😩", ":wedding:": "💒", ":whale:": "🐳", ":whale2:": "🐋", ":wheel_of_dharma:": "☸️", ":wheelchair:": "♿️", 
        ":white_check_mark:": "✅", ":white_circle:": "⚪️", ":white_flower:": "💮", ":white_large_square:": "⬜️", 
        ":white_medium_small_square:": "◽️", ":white_medium_square:": "◻️", ":white_small_square:": "▫️", ":white_square_button:": "🔳", 
        ":wilted_flower:": "🥀", ":wind_chime:": "🎐", ":wind_face:": "🌬", ":wine_glass:": "🍷", ":wink:": "😉", ":wolf:": "🐺", 
        ":woman:": "👩", ":womans_clothes:": "👚", ":womans_hat:": "👒", ":womens:": "🚺", ":world_map:": "🗺", ":worried:": "😟", 
        ":wrench:": "🔧", ":x:": "❌", ":yellow_heart:": "💛", ":yen:": "💴", ":yum:": "😋", ":zap:": "⚡️", ":zero:": "0️⃣", ":zzz:": "💤"}
    
        // Replace chunks with emojis if they exist in the dictionary, otherwise keep them unchanged
        const result = chunks.map(chunk => (emoji[chunk] ? emoji[chunk] : chunk));
    
        // Join the chunks to form the final string
        return result.join('');
    }

    function descriptionToLines(description) {
        const svgEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&apos;',
            '%': '&#37;',
            '{': '&#123;',
            '}': '&#125;',
            '#': '&#35;',
            '=': '&#61;',
            '(': '&#40;',
            ')': '&#41;',
            ';': '&#59;',
            '/': '&#47;',
            '?': '&#63;',
            '@': '&#64;',
            '^': '&#94;',
            '|': '&#124;',
            '~': '&#126;'
          };
        const wordRe = /[\u4e00-\u9fff]|[a-zA-Z0-9]+(?!=[\u4e00-\u9fff])|[^\u4e00-\u9fff\w\s]|\s/g;
        const words = description.match(wordRe);
        let line = "";
        const lines = [];
        let length = 0;
    
        for (const word of words) {
            var word_len = 0
            if (word.charCodeAt()>255) {
                word_len = 16;
            } else {
                for (var i = 0;i<word.length;i++){
                    if (word.charCodeAt(i) >64 && word.charCodeAt(i)<91) {
                        word_len += 10
                    }else{
                        word_len += 8
                    }
                }
            }
            length += word_len
            if (length > 380) {
                line = line.replace(/[&<>"'%{}#=();\/?@^|~]/g, match => svgEntities[match]);
                lines.push(line);
                line = word;
                length = word_len;
            }else{
                line += word;
            }
        }
    
        if (line !== "") {
            line = line.replace(/[&<>"'%{}#=();\/?@^|~]/g, match => svgEntities[match]);
            lines.push(line);
        }
    
        return lines;
    }

    function doCreateDescription(description_lines) {
        let y = 86;
        const diff = 21;
        const descript_element =
            '<g fill="#586069" fill-opacity="1" stroke="#586069" stroke-opacity="1" ' +
            'stroke-width="1" stroke-linecap="square" stroke-linejoin="bevel" ' +
            'transform="matrix(1,0,0,1,0,0)">' +
            '<text fill="#586069" fill-opacity="1" stroke="none" x="17" y="{y}" ' +
            'font-family="sans-serif" font-size="14" font-weight="550" font-style="normal">' +
            '{content}</text></g>';
    
        let desc = '';
        for (const line of description_lines) {
            const e = descript_element.replace('{y}', y).replace('{content}', line);
            desc += e;
            y += diff;
        }
    
        return [desc, y - diff];
    }

    function createDesc(description){
        var desc_with_emoji = renderEmoji(description)
        var desc_lines = descriptionToLines(desc_with_emoji)
        return doCreateDescription(desc_lines)
    }

    function createLanguage(circle_y, language) {
        const language_color_dict = {"1C Enterprise": "#814CCC", "2-Dimensional Array": "#38761D", "4D": "#004289", "ABAP": "#E8274B", "ABAP CDS": "#555e25", "AGS Script": "#B9D9FF", "AIDL": "#34EB6B", "AL": "#3AA2B5", "AMPL": "#E6EFBB", "ANTLR": "#9DC3FF", "API Blueprint": "#2ACCA8", "APL": "#5A8164", "ASP.NET": "#9400ff", "ATS": "#1ac620", "ActionScript": "#882B0F", "Ada": "#02f88c", "Adblock Filter List": "#800000", "Adobe Font Metrics": "#fa0f00", "Agda": "#315665", "Alloy": "#64C800", "Alpine Abuild": "#0D597F", "Altium Designer": "#A89663", "AngelScript": "#C7D7DC", "Ant Build System": "#A9157E", "Antlers": "#ff269e", "ApacheConf": "#d12127", "Apex": "#1797c0", "Apollo Guidance Computer": "#0B3D91", "AppleScript": "#101F1F", "Arc": "#aa2afe", "AsciiDoc": "#73a0c5", "AspectJ": "#a957b0", "Assembly": "#6E4C13", "Astro": "#ff5a03", "Asymptote": "#ff0000", "Augeas": "#9CC134", "AutoHotkey": "#6594b9", "AutoIt": "#1C3552", "Avro IDL": "#0040FF", "Awk": "#c30e9b", "BASIC": "#ff0000", "Ballerina": "#FF5000", "Batchfile": "#C1F12E", "Beef": "#a52f4e", "Berry": "#15A13C", "BibTeX": "#778899", "Bicep": "#519aba", "Bikeshed": "#5562ac", "Bison": "#6A463F", "BitBake": "#00bce4", "Blade": "#f7523f", "BlitzBasic": "#00FFAE", "BlitzMax": "#cd6400", "Bluespec": "#12223c", "Boo": "#d4bec1", "Boogie": "#c80fa0", "Brainfuck": "#2F2530", "BrighterScript": "#66AABB", "Brightscript": "#662D91", "Browserslist": "#ffd539", "C": "#555555", "C#": "#178600", "C++": "#f34b7d", "CAP CDS": "#0092d1", "CLIPS": "#00A300", "CMake": "#DA3434", "COLLADA": "#F1A42B", "CSON": "#244776", "CSS": "#563d7c", "CSV": "#237346", "CUE": "#5886E1", "CWeb": "#00007a", "Cabal Config": "#483465", "Cadence": "#00ef8b", "Cairo": "#ff4a48", "CameLIGO": "#3be133", "Cap'n Proto": "#c42727", "Ceylon": "#dfa535", "Chapel": "#8dc63f", "ChucK": "#3f8000", "Circom": "#707575", "Cirru": "#ccccff", "Clarion": "#db901e", "Clarity": "#5546ff", "Classic ASP": "#6a40fd", "Clean": "#3F85AF", "Click": "#E4E6F3", "Clojure": "#db5855", "Closure Templates": "#0d948f", "Cloud Firestore Security Rules": "#FFA000", "CodeQL": "#140f46", "CoffeeScript": "#244776", "ColdFusion": "#ed2cd6", "ColdFusion CFC": "#ed2cd6", "Common Lisp": "#3fb68b", "Common Workflow Language": "#B5314C", "Component Pascal": "#B0CE4E", "Coq": "#d0b68c", "Crystal": "#000100", "Csound": "#1a1a1a", "Csound Document": "#1a1a1a", "Csound Score": "#1a1a1a", "Cuda": "#3A4E3A", "Curry": "#531242", "Cypher": "#34c0eb", "Cython": "#fedf5b", "D": "#ba595e", "D2": "#526ee8", "DM": "#447265", "Dafny": "#FFEC25", "Darcs Patch": "#8eff23", "Dart": "#00B4AB", "DataWeave": "#003a52", "Debian Package Control File": "#D70751", "DenizenScript": "#FBEE96", "Dhall": "#dfafff", "DirectX 3D File": "#aace60", "Dockerfile": "#384d54", "Dogescript": "#cca760", "Dotenv": "#e5d559", "Dylan": "#6c616e", "E": "#ccce35", "ECL": "#8a1267", "ECLiPSe": "#001d9d", "EJS": "#a91e50", "EQ": "#a78649", "Earthly": "#2af0ff", "Easybuild": "#069406", "Ecere Projects": "#913960", "Ecmarkup": "#eb8131", "EditorConfig": "#fff1f2", "Eiffel": "#4d6977", "Elixir": "#6e4a7e", "Elm": "#60B5CC", "Elvish": "#55BB55", "Elvish Transcript": "#55BB55", "Emacs Lisp": "#c065db", "EmberScript": "#FFF4F3", "Erlang": "#B83998", "Euphoria": "#FF790B", "F#": "#b845fc", "F*": "#572e30", "FIGlet Font": "#FFDDBB", "FLUX": "#88ccff", "Factor": "#636746", "Fancy": "#7b9db4", "Fantom": "#14253c", "Faust": "#c37240", "Fennel": "#fff3d7", "Filebench WML": "#F6B900", "Fluent": "#ffcc33", "Forth": "#341708", "Fortran": "#4d41b1", "Fortran Free Form": "#4d41b1", "FreeBasic": "#141AC9", "FreeMarker": "#0050b2", "Frege": "#00cafe", "Futhark": "#5f021f", "G-code": "#D08CF2", "GAML": "#FFC766", "GAMS": "#f49a22", "GAP": "#0000cc", "GCC Machine Description": "#FFCFAB", "GDScript": "#355570", "GEDCOM": "#003058", "GLSL": "#5686a5", "GSC": "#FF6800", "Game Maker Language": "#71b417", "Gemfile.lock": "#701516", "Gemini": "#ff6900", "Genero": "#63408e", "Genero Forms": "#d8df39", "Genie": "#fb855d", "Genshi": "#951531", "Gentoo Ebuild": "#9400ff", "Gentoo Eclass": "#9400ff", "Gerber Image": "#d20b00", "Gherkin": "#5B2063", "Git Attributes": "#F44D27", "Git Config": "#F44D27", "Git Revision List": "#F44D27", "Gleam": "#ffaff3", "Glyph": "#c1ac7f", "Gnuplot": "#f0a9f0", "Go": "#00ADD8", "Go Checksums": "#00ADD8", "Go Module": "#00ADD8", "Go Workspace": "#00ADD8", "Godot Resource": "#355570", "Golo": "#88562A", "Gosu": "#82937f", "Grace": "#615f8b", "Gradle": "#02303a", "Grammatical Framework": "#ff0000", "GraphQL": "#e10098", "Graphviz (DOT)": "#2596be", "Groovy": "#4298b8", "Groovy Server Pages": "#4298b8", "HAProxy": "#106da9", "HCL": "#844FBA", "HLSL": "#aace60", "HOCON": "#9ff8ee", "HTML": "#e34c26", "HTML+ECR": "#2e1052", "HTML+EEX": "#6e4a7e", "HTML+ERB": "#701516", "HTML+PHP": "#4f5d95", "HTML+Razor": "#512be4", "HTTP": "#005C9C", "HXML": "#f68712", "Hack": "#878787", "Haml": "#ece2a9", "Handlebars": "#f7931e", "Harbour": "#0e60e3", "Haskell": "#5e5086", "Haxe": "#df7900", "HiveQL": "#dce200", "HolyC": "#ffefaf", "Hosts File": "#308888", "Hy": "#7790B2", "IDL": "#a3522f", "IGOR Pro": "#0000cc", "INI": "#d1dbe0", "Idris": "#b30000", "Ignore List": "#000000", "ImageJ Macro": "#99AAFF", "Imba": "#16cec6", "Inno Setup": "#264b99", "Io": "#a9188d", "Ioke": "#078193", "Isabelle": "#FEFE00", "Isabelle ROOT": "#FEFE00", "J": "#9EEDFF", "JAR Manifest": "#b07219", "JCL": "#d90e09", "JFlex": "#DBCA00", "JSON": "#292929", "JSON with Comments": "#292929", "JSON5": "#267CB9", "JSONLD": "#0c479c", "JSONiq": "#40d47e", "Janet": "#0886a5", "Jasmin": "#d03600", "Java": "#b07219", "Java Properties": "#2A6277", "Java Server Pages": "#2A6277", "JavaScript": "#f1e05a", "JavaScript+ERB": "#f1e05a", "Jest Snapshot": "#15c213", "JetBrains MPS": "#21D789", "Jinja": "#a52a22", "Jison": "#56b3cb", "Jison Lex": "#56b3cb", "Jolie": "#843179", "Jsonnet": "#0064bd", "Julia": "#a270ba", "Jupyter Notebook": "#DA5B0B", "Just": "#384d54", "KRL": "#28430A", "Kaitai Struct": "#773b37", "KakouneScript": "#6f8042", "KerboScript": "#41adf0", "KiCad Layout": "#2f4aab", "KiCad Legacy Layout": "#2f4aab", "KiCad Schematic": "#2f4aab", "Kotlin": "#A97BFF", "LFE": "#4C3023", "LLVM": "#185619", "LOLCODE": "#cc9900", "LSL": "#3d9970", "LabVIEW": "#fede06", "Lark": "#2980B9", "Lasso": "#999999", "Latte": "#f2a542", "Less": "#1d365d", "Lex": "#DBCA00", "LigoLANG": "#0e74ff", "LilyPond": "#9ccc7c", "Liquid": "#67b8de", "Literate Agda": "#315665", "Literate CoffeeScript": "#244776", "Literate Haskell": "#5e5086", "LiveScript": "#499886", "Logtalk": "#295b9a", "LookML": "#652B81", "Lua": "#000080", "MATLAB": "#e16737", "MAXScript": "#00a6a6", "MDX": "#fcb32c", "MLIR": "#5EC8DB", "MQL4": "#62A8D6", "MQL5": "#4A76B8", "MTML": "#b7e1f4", "Macaulay2": "#d8ffff", "Makefile": "#427819", "Mako": "#7e858d", "Markdown": "#083fa1", "Marko": "#42bff2", "Mask": "#f97732", "Mathematica": "#dd1100", "Max": "#c4a79c", "Mercury": "#ff2b2b", "Mermaid": "#ff3670", "Meson": "#007800", "Metal": "#8f14e9", "MiniYAML": "#ff1111", "Mint": "#02b046", "Mirah": "#c7a938", "Modelica": "#de1d31", "Modula-2": "#10253f", "Modula-3": "#223388", "Monkey C": "#8D6747", "MoonScript": "#ff4585", "Motoko": "#fbb03b", "Motorola 68K Assembly": "#005daa", "Move": "#4a137a", "Mustache": "#724b3b", "NCL": "#28431f", "NPM Config": "#cb3837", "NWScript": "#111522", "Nasal": "#1d2c4e", "Nearley": "#990000", "Nemerle": "#3d3c6e", "NetLinx": "#0aa0ff", "NetLinx+ERB": "#747faa", "NetLogo": "#ff6375", "NewLisp": "#87AED7", "Nextflow": "#3ac486", "Nginx": "#009639", "Nim": "#ffc200", "Nit": "#009917", "Nix": "#7e7eff", "Nu": "#c9df40", "NumPy": "#9C8AF9", "Nunjucks": "#3d8137", "Nushell": "#4E9906", "OASv2-json": "#85ea2d", "OASv2-yaml": "#85ea2d", "OASv3-json": "#85ea2d", "OASv3-yaml": "#85ea2d", "OCaml": "#ef7a08", "ObjectScript": "#424893", "Objective-C": "#438eff", "Objective-C++": "#6866fb", "Objective-J": "#ff0c5a", "Odin": "#60AFFE", "Omgrofl": "#cabbff", "Opal": "#f7ede0", "Open Policy Agent": "#7d9199", "OpenAPI Specification v2": "#85ea2d", "OpenAPI Specification v3": "#85ea2d", "OpenCL": "#ed2e2d", "OpenEdge ABL": "#5ce600", "OpenQASM": "#AA70FF", "OpenSCAD": "#e5cd45", "Option List": "#476732", "Org": "#77aa99", "Oxygene": "#cdd0e3", "Oz": "#fab738", "P4": "#7055b5", "PDDL": "#0d00ff", "PEG.js": "#234d6b", "PHP": "#4F5D95", "PLSQL": "#dad8d8", "PLpgSQL": "#336790", "POV-Ray SDL": "#6bac65", "Pact": "#F7A8B8", "Pan": "#cc0000", "Papyrus": "#6600cc", "Parrot": "#f3ca0a", "Pascal": "#E3F171", "Pawn": "#dbb284", "Pep8": "#C76F5B", "Perl": "#0298c3", "PicoLisp": "#6067af", "PigLatin": "#fcd7de", "Pike": "#005390", "PlantUML": "#fbbd16", "PogoScript": "#d80074", "Polar": "#ae81ff", "Portugol": "#f8bd00", "PostCSS": "#dc3a0c", "PostScript": "#da291c", "PowerBuilder": "#8f0f8d", "PowerShell": "#012456", "Prisma": "#0c344b", "Processing": "#0096D8", "Procfile": "#3B2F63", "Prolog": "#74283c", "Promela": "#de0000", "Propeller Spin": "#7fa2a7", "Pug": "#a86454", "Puppet": "#302B6D", "PureBasic": "#5a6986", "PureScript": "#1D222D", "Pyret": "#ee1e10", "Python": "#3572A5", "Python console": "#3572A5", "Python traceback": "#3572A5", "Q#": "#fed659", "QML": "#44a51c", "Qt Script": "#00b841", "Quake": "#882233", "R": "#198CE7", "RAML": "#77d9fb", "RBS": "#701516", "RDoc": "#701516", "REXX": "#d90e09", "RMarkdown": "#198ce7", "RPGLE": "#2BDE21", "RUNOFF": "#665a4e", "Racket": "#3c5caa", "Ragel": "#9d5200", "Raku": "#0000fb", "Rascal": "#fffaa0", "ReScript": "#ed5051", "Reason": "#ff5847", "ReasonLIGO": "#ff5847", "Rebol": "#358a5b", "Record Jar": "#0673ba", "Red": "#f50000", "Regular Expression": "#009a00", "Ren'Py": "#ff7f7f", "Ring": "#2D54CB", "Riot": "#A71E49", "RobotFramework": "#00c0b5", "Roff": "#ecdebe", "Roff Manpage": "#ecdebe", "Rouge": "#cc0088", "RouterOS Script": "#DE3941", "Ruby": "#701516", "Rust": "#dea584", "SAS": "#B34936", "SCSS": "#c6538c", "SPARQL": "#0C4597", "SQF": "#3F3F3F", "SQL": "#e38c00", "SQLPL": "#e38c00", "SRecode Template": "#348a34", "STL": "#373b5e", "SVG": "#ff9900", "SaltStack": "#646464", "Sass": "#a53b70", "Scala": "#c22d40", "Scaml": "#bd181a", "Scenic": "#fdc700", "Scheme": "#1e4aec", "Scilab": "#ca0f21", "Self": "#0579aa", "ShaderLab": "#222c37", "Shell": "#89e051", "ShellCheck Config": "#cecfcb", "Shen": "#120F14", "Simple File Verification": "#C9BFED", "Singularity": "#64E6AD", "Slash": "#007eff", "Slice": "#003fa2", "Slim": "#2b2b2b", "SmPL": "#c94949", "Smalltalk": "#596706", "Smarty": "#f0c040", "Smithy": "#c44536", "Snakemake": "#419179", "Solidity": "#AA6746", "SourcePawn": "#f69e1d", "Squirrel": "#800000", "Stan": "#b2011d", "Standard ML": "#dc566d", "Starlark": "#76d275", "Stata": "#1a5f91", "StringTemplate": "#3fb34f", "Stylus": "#ff6347", "SubRip Text": "#9e0101", "SugarSS": "#2fcc9f", "SuperCollider": "#46390b", "Svelte": "#ff3e00", "Sway": "#dea584", "Swift": "#F05138", "SystemVerilog": "#DAE1C2", "TI Program": "#A0AA87", "TL-Verilog": "#C40023", "TLA": "#4b0079", "TOML": "#9c4221", "TSQL": "#e38c00", "TSV": "#237346", "TSX": "#3178c6", "TXL": "#0178b8", "Talon": "#333333", "Tcl": "#e4cc98", "TeX": "#3D6117", "Terra": "#00004c", "TextMate Properties": "#df66e4", "Textile": "#ffe7ac", "Thrift": "#D12127", "Turing": "#cf142b", "Twig": "#c1d026", "TypeScript": "#3178c6", "Unified Parallel C": "#4e3617", "Unity3D Asset": "#222c37", "Uno": "#9933cc", "UnrealScript": "#a54c4d", "UrWeb": "#ccccee", "V": "#4f87c4", "VBA": "#867db1", "VBScript": "#15dcdc", "VCL": "#148AA8", "VHDL": "#adb2cb", "Vala": "#a56de2", "Valve Data Format": "#f26025", "Velocity Template Language": "#507cff", "Verilog": "#b2b7f8", "Vim Help File": "#199f4b", "Vim Script": "#199f4b", "Vim Snippet": "#199f4b", "Visual Basic .NET": "#945db7", "Visual Basic 6.0": "#2c6353", "Volt": "#1F1F1F", "Vue": "#41b883", "Vyper": "#2980b9", "WDL": "#42f1f4", "WGSL": "#1a5e9a", "Web Ontology Language": "#5b70bd", "WebAssembly": "#04133b", "WebAssembly Interface Type": "#6250e7", "Whiley": "#d5c397", "Wikitext": "#fc5757", "Windows Registry Entries": "#52d5ff", "Witcher Script": "#ff0000", "Wollok": "#a23738", "World of Warcraft Addon Data": "#f7e43f", "Wren": "#383838", "X10": "#4B6BEF", "XC": "#99DA07", "XML": "#0060ac", "XML Property List": "#0060ac", "XQuery": "#5232e7", "XSLT": "#EB8CEB", "Xojo": "#81bd41", "Xonsh": "#285EEF", "Xtend": "#24255d", "YAML": "#cb171e", "YARA": "#220000", "YASnippet": "#32AB90", "Yacc": "#4B6C4B", "Yul": "#794932", "ZAP": "#0d665e", "ZIL": "#dc75e5", "ZenScript": "#00BCD1", "Zephir": "#118f9e", "Zig": "#ec915c", "Zimpl": "#d67711", "eC": "#913960", "fish": "#4aae47", "hoon": "#00b171", "jq": "#c7254e", "kvlang": "#1da6e0", "mIRC Script": "#3d57c3", "mcfunction": "#E22837", "mupad": "#244963", "nanorc": "#2d004d", "nesC": "#94B0C7", "ooc": "#b0b77e", "q": "#0040cd", "reStructuredText": "#141414", "sed": "#64b970", "wisp": "#7582D1", "xBase": "#403a40"}
    
        const language_format =
            '<circle cx="25" cy="{circle_y}" r="7" stroke="none" fill="{color}"></circle>' +
            '<g transform="matrix(1,0,0,1,0,0)">' +
            '<text fill="#24292e" fill-opacity="1" stroke="none" x="{language_x}" y="{language_y}" font-family="sans-serif" ' +
            'font-size="12" font-weight="400" font-style="normal">{language}</text>' +
            '</g>';
    
        const language_x = 35;
        const language_y = circle_y + 4;
    
        let color, en_count = 0, cn_count = 0;
        if (!language) {
            language = 'None';
            color = '#000000';
        } else {
            color = language_color_dict[language] || '#000000';
        }
    
        const en_char_len = 8;
        const cn_char_len = 16;
    
        for (const char of language) {
            if ('\u4e00' <= char && char <= '\u9fff') {
                cn_count += 1;
            } else {
                en_count += 1;
            }
        }
    
        const next_x = cn_count * cn_char_len + en_count * en_char_len + language_x;
    
        return [language_format.replace('{circle_y}', circle_y)
                                .replace('{language_x}', language_x)
                                .replace('{language_y}', language_y)
                                .replace('{color}', color)
                                .replace('{language}', language), next_x];
    }

    // 通过GM_xmlhttpRequest获取PNG图片的二进制数据
    function getBinaryDataFromURL(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "arraybuffer",
                onload: function(response) {
                    const binaryData = response.response;
                    resolve(binaryData);
                },
                onerror: function(error) {
                    console.error("Error fetching the image:", error);
                    reject(error);
                }
            });
        });
    }

    // 将二进制数据转换为base64编码
    function convertBinaryToBase64(binaryData) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64Value = reader.result.split(",")[1];
                resolve(base64Value);
            };
            reader.readAsDataURL(new Blob([binaryData], { type: "image/png" }));
        });
    }

    // 在这里调用获取二进制数据和转换为base64的函数
    async function processImage(imageUrl) {
        try {
            const binaryData = await getBinaryDataFromURL(imageUrl);
            const base64Value = await convertBinaryToBase64(binaryData);
            return base64Value;
        } catch (error) {
            console.error("Failed to process the image:", error);
            return null;
        }
    }

    function startDownload(svgContent, fileName) {
        // 将SVG内容转换为Blob对象
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });

        // 创建下载链接
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName; // 下载文件的名称

        // 触发点击事件，弹出下载框
        downloadLink.dispatchEvent(new MouseEvent('click'));

        // 释放URL对象，防止内存泄漏
        URL.revokeObjectURL(downloadLink.href);
    }

    async function getCard() {
        var repo = getRepoName()
        var info_msg = await getFromAPI(repo.url(), 'json')
        var gitInfo = new GithubInfo(info_msg)
        try {
            const response = await fetch(info_msg.tags_url);
            const data = await response.json();
            gitInfo.tag_count = String(data.length);
        } catch (error) {
            console.error("请求出错:", error);
            throw error; // 在此抛出错误，以确保调用函数的地方可以捕获到错误
        }
        console.log(gitInfo)

        //构建repo
        var repo_href = gitInfo.repo_href
        var repo_name = gitInfo.repo_name
        const repo_part = `
            <g fill="#586069" fill-opacity="1" stroke="none" transform="matrix(1.25,0,0,1.25,18,18)">
                <path vector-effect="none" fill-rule="evenodd" d="M4,9 L3,9 L3,8 L4,8 L4,9 M4,6 L3,6 L3,7 L4,7 L4,6 M4,4 L3,4 L3,5 L4,5 L4,4 M4,2 L3,2 L3,3 L4,3 L4,2 M12,1 L12,13 C12,13.55 11.55,14 11,14 L6,14 L6,16 L4.5,14.5 L3,16 L3,14 L1,14 C0.45,14 0,13.55 0,13 L0,1 C0,0.45 0.45,0 1,0 L11,0 C11.55,0 12,0.45 12,1 M11,11 L1,11 L1,13 L3,13 L3,12 L6,12 L6,13 L11,13 L11,11 M11,1 L2,1 L2,10 L11,10 L11,1"></path>
            </g>
            <g fill="#0366d6" fill-opacity="1" stroke="#0366d6" stroke-opacity="1" stroke-width="1" stroke-linecap="square" stroke-linejoin="bevel" transform="matrix(1,0,0,1,25,0)">
                <a target="_blank" href="${repo_href}">
                    <text fill="#0366d6" fill-opacity="1" stroke="none" xml:space="preserve" x="17" y="33" font-family="sans-serif" font-size="18" font-weight="630" font-style="normal">${repo_name}</text>
                </a>
            </g>
        `;
        
        //构建owner
        var owner_href = gitInfo.owner.html_url
        //var img = gitInfo.owner.avatar_url
        var img = await processImage(gitInfo.owner.avatar_url)
        var owner = gitInfo.owner.login
        // const base64Value = await processImage(gitInfo.owner.avatar_url);
        // console.log("PNG图片的base64值:", base64Value);
        const owner_part = `
            <g transform="matrix(1,0,0,1,0,0)">
                <a target="_blank" href="${owner_href}">
                    <circle cx="25" cy="56" r="12" stroke="#afb8c1" stroke-width="1.5" fill="none" />
                    <image stroke="null" id="svg_1" height="24" width="24" x="13" y="44" clip-path="url(#circleClip)" href="data:image/png;base64,${img}"/>
                </a>
            </g>
            <g transform="matrix(1,0,0,1,25,0)">
                <a target="_blank" href="${owner_href}">
                    <text fill="#000000" fill-opacity="1" stroke="none" xml:space="preserve" x="17" y="59.5" font-family="sans-serif" font-size="15" font-weight="540" font-style="normal">${owner}</text>
                </a>
            </g>
        `;

        //构建description
        var desc_result = createDesc(gitInfo.description)
        var desc_part = desc_result[0]
        var desc_last_y = desc_result[1]
        var language_y = desc_last_y + 18
        var next_y = desc_last_y + 10

        //构建language部分
        var language_result = createLanguage(language_y,gitInfo.language)
        var language_part = language_result[0]
        var next_x = language_result[1]

        //构建各个info部分
        var icon_x = next_x + 16
        var icon_y = next_y
        var href = gitInfo.star_href
        var info_x = icon_x + 21
        var info_y = icon_y + 12
        var info = gitInfo.stars_count
        const star_info = `
            <g transform="matrix(1,0,0,1,${icon_x},${icon_y})">
            <a target="_blank" href="${href}">
            <path fill="#656d76" stroke="none" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
            </a>
            </g>        
            <g transform="matrix(1,0,0,1,0,0)">
            <a target="_blank" href="${href}">
            <text fill="#656d76" fill-opacity="1" stroke="none" x="${info_x}" y="${info_y}" font-family="sans-serif" 
            font-size="12" font-weight="400" font-style="normal">${info}</text>
            </a>
            </g>
        `
        icon_x = info_x + 8*info.length + 16
        href = gitInfo.fork_href
        info_x = icon_x +21
        info = gitInfo.forks_count
        const fork_info = `
            <g transform="matrix(1,0,0,1,${icon_x},${icon_y})">
            <a target="_blank" href="${href}">
            <path fill="#656d76" stroke="none" d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
            </a>
            </g>
            <g transform="matrix(1,0,0,1,0,0)">
            <a target="_blank" href="${href}">
            <text fill="#656d76" fill-opacity="1" stroke="none" x="${info_x}" y="${info_y}" font-family="sans-serif" 
            font-size="12" font-weight="400" font-style="normal">${info}</text>
            </a>
            </g>
        `
        icon_x = info_x + 8*info.length + 16
        href = gitInfo.tag_href
        info_x = icon_x +21
        info = gitInfo.tag_count
        const tag_info = `
            <g transform="matrix(1,0,0,1,${icon_x},${icon_y})">
            <a target="_blank" href="${href}">
            <path fill="#656d76" stroke="none" d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"></path>
            </a>
            </g>
            <g transform="matrix(1,0,0,1,0,0)">
            <a target="_blank" href="${href}">
            <text fill="#656d76" fill-opacity="1" stroke="none" x="${info_x}" y="${info_y}" font-family="sans-serif" 
            font-size="12" font-weight="400" font-style="normal">${info}</text>
            </a>
            </g>
        `
        let license_info = ''
        if (gitInfo.license !==undefined){
            icon_x = info_x + 8*info.length + 16
            href = gitInfo.license_href
            info_x = icon_x +21
            info = gitInfo.license
            license_info = `
                <g transform="matrix(1,0,0,1,${icon_x},${icon_y})">
                <a target="_blank" href="${href}">
                <path fill="#656d76" stroke="none" d="M8.75.75V2h.985c.304 0 .603.08.867.231l1.29.736c.038.022.08.033.124.033h2.234a.75.75 0 0 1 0 1.5h-.427l2.111 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.006.005-.01.01-.045.04c-.21.176-.441.327-.686.45C14.556 10.78 13.88 11 13 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L12.178 4.5h-.162c-.305 0-.604-.079-.868-.231l-1.29-.736a.245.245 0 0 0-.124-.033H8.75V13h2.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h2.5V3.5h-.984a.245.245 0 0 0-.124.033l-1.289.737c-.265.15-.564.23-.869.23h-.162l2.112 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.016.015-.045.04c-.21.176-.441.327-.686.45C4.556 10.78 3.88 11 3 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L2.178 4.5H1.75a.75.75 0 0 1 0-1.5h2.234a.249.249 0 0 0 .125-.033l1.288-.737c.265-.15.564-.23.869-.23h.984V.75a.75.75 0 0 1 1.5 0Zm2.945 8.477c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327Zm-10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327Z"></path>
                </a>
                </g>
                <g transform="matrix(1,0,0,1,0,0)">
                <a target="_blank" href="${href}">
                <text fill="#656d76" fill-opacity="1" stroke="none" x="${info_x}" y="${info_y}" font-family="sans-serif" 
                font-size="12" font-weight="400" font-style="normal">${info}</text>
                </a>
                </g>
            `
        }
        
        var height = desc_last_y+33
        var body = repo_part + owner_part + desc_part + language_part + star_info + fork_info + tag_info + license_info
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="422" height="${height}" version="1.2" baseProfile="tiny" data-reactroot="">
                <defs>
                    <clipPath id="circleClip">
                        <circle cx="25" cy="56" r="12" />
                    </clipPath>
                </defs>
                <g fill="none" stroke="black" stroke-width="1" fill-rule="evenodd" stroke-linecap="square" stroke-linejoin="bevel">
                    <g fill="#ffffff" fill-opacity="1" stroke="none" transform="matrix(1,0,0,1,0,0)">
                        <rect x="0" y="0" width="420" height="${height}"></rect>
                    </g>
                    <rect x="0" y="0" width="421" height="${height}" stroke="#eaecef" stroke-width="2"></rect>
                    <g transform="matrix(1,0,0,1,0,-3)">${body}</g>
                </g>
            </svg>
        `;
        var file_name = repo.ownerName + '_' + repo.repoName + '.svg'
        startDownload(svg,file_name)

    }

    //在页面设置按钮
    var button = document.createElement("button");
    button.textContent = "Get\nCard"; // 竖向显示内容，使用换行符分隔
    button.style.borderRadius = '5px';
    button.style.position = "fixed";
    button.style.left = "-40px"; // 初始时隐藏按钮部分
    button.style.top = "50%";
    button.style.backgroundColor = '#216e39';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.transform = "translateY(-50%)"; // 竖向显示，并旋转90度
    button.style.width = "50px"; // 调整按钮宽度
    button.style.height = "40px"; // 调整按钮高度
    button.style.textAlign = "center"; // 内容居中
    button.style.lineHeight = "1"; // 行高，可根据需要调整
    button.style.zIndex = "9999";
    button.style.transition = "left 0.3s"; // 添加过渡效果

    // 将按钮添加到页面
    document.body.appendChild(button);

    // 绑定按钮的点击事件，点击时执行 getCard 函数
    button.addEventListener("click", getCard);

    // 鼠标移动到按钮旁边时显示全部按钮
    button.addEventListener("mouseover", function () {
        button.style.left = "0";
    });

    // 鼠标移出按钮时恢复部分隐藏
    button.addEventListener("mouseout", function () {
        button.style.left = "-40px";
    });

})();