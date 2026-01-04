// ==UserScript==
// @name         Rule 34 QoL
// @version      0.0.3
// @description  Rule 34 Quality-of-Life Tools
// @author       ryousukecchi
// @match        https://rule34.xxx/index.php?page=post&s=list*
// @namespace    https://greasyfork.org/users/292830
// @icon         https://www.google.com/s2/favicons?domain=rule34.xxx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423860/Rule%2034%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/423860/Rule%2034%20QoL.meta.js
// ==/UserScript==
// jshint esversion: 6


// var blacklisted_tag = [
//     // 'anal_sex',
//     'futanari',
//     'derpixon',
//     'speedosausage',
//     'tentacle',
//     // furry
//     'animal_crossing',
//     'a_hat_in_time',
//     'hazbin_hotel',
//     'my_little_pony',
//     'xingzuo_temple',
//     'ratchet_and_clank',
//     'male_human/female_pokemon',
//     'male_human/female_digimon',
//     'cartoon_network',
//     'imp_midna',
//     'haydee_(game)',
//     'undertale',
//     'battlerite',
// ];
// var a = 'https://rule34.xxx/index.php?page=post&s=list&tags=video+' 
// var b = encodeURI("-"+blacklisted_tag.join("+-")+"+");
// var c = encodeURI('score:>=200+');
// var d = encodeURI('sort:score:desc+');
// var latest = a+c+b
// var popular = a+d+b
// copy(latest);
// copy(popular);


var q_img = 'span.thumb>a>img';

var known_series = [
    'aladdin',
    'apex_legends',
    'ascendant_one',
    'attack_on_titan',
    'avatar_the_last_airbender',
    'azur_lane',
    
    'bayonetta',
    'ben_10',
    'big_hero_6',
    'bioshock',
    'black_rock_shooter',
    'bleach',
    'blue_archive',
    'bokutachi_wa_benkyou_ga_dekinai',
    
    'call_of_duty',
    'cyberpunk_2077',
    
    'darkstalkers',
    'dead_or_alive',
    'detroit:_become_human',
    'devil_may_cry',
    'digimon',
    'doki_doki_literature_club',
    'dota_2',
    'dragon_ball',
    'drop_out',
    'dungeon_ni_deai_wo_motomeru_no_wa_machigatteiru_darou_ka',
    
    'elsword',

    'far_cry',
    'final_fantasy',
    'fire_emblem',
    'fire_force',
    'fortnite',
    
    'genshin_impact',
    'girls_frontline',
    'granblue_fantasy',
    'grand_theft_auto',
    
    'helltaker',
    'hollow_knight',
    'hololive',
    
    'idolmaster',
    'indivisible',

    'jujutsu_kaisen',
    
    'kaifuku_jutsushi_no_yarinaoshi_sokushi_mahou_to_skill_copy_no_chouetsu_heal',
    'kanojo_okarishimasu',
    'kantai_collection',
    'kill_la_kill',
    'king_of_fighters',
    'kingdom_hearts',
    'kono_subarashii_sekai_ni_shukufuku_wo!',
    'kuroinu_~kedakaki_seijo_wa_hakudaku_ni_somaru~',
    'kyokou_suiri',
    'kyonyuu_princess_saimin',
    
    'league_of_legends',
    'life_is_strange',
    'lollipop_chainsaw',
    
    'mass_effect',
    'metal_gear_solid',
    'metroid',
    'mizugi_kanojo',
    'monster_hunter',
    'monster_musume_no_iru_nichijou',
    'monster_musume_no_oisha-san',
    'mortal_kombat',
    'motto!_haramase!_honoo_no_oppai_chou_ero_appli_gakuen!',
    'mushoku_tensei',
    'mushoku_tensei:_isekai_ittara_honki_dasu',
    'my_hero_academia',
    
    'nande_koko_ni_sensei_ga!?',
    'naruto',
    'nier:_automata',

    'ochi_mono_rpg_seikishi_luvilias',
    'one-punch_man',
    'one_piece',
    'onigiri_(mmorpg)',
    'original',
    'overwatch',
    
    'paladins',
    'panty_&_stocking_with_garterbelt',
    'parodius',
    'persona',
    'plants_vs_zombies',
    "please_don't_bully_me,_nagatoro",
    'pokemon',
    'precure',
    'princess_connect!',
    'pure_onyx',
    
    'rainbow_six_siege',
    'renkin_san-kyuu_magical_pokaan',
    'resident_evil',
    'rwby',
    
    'samurai_shodown',
    'senran_kagura',
    'soul_calibur',
    'spice_and_wolf',
    'splatoon',
    'star_wars',
    'street_fighter',
    'super_robot_wars',

    'tail_concerto',
    'tangled',
    'tate_no_yuusha_no_nariagari',
    'teen_titans',
    'the_amazing_world_of_gumball',
    'the_incredibles',
    'the_last_of_us',
    'the_legend_of_zelda',
    'the_ring',
    'the_summoning',
    'the_witcher',
    'tomb_raider',
    'touhou',
    'toy_story',
    
    'valorant',
    'vindictus',
    'vocaloid',
    
    'waku_waku_7',
    'warframe',
    'world_of_warcraft',
];

var known_owner = [
    'blizzard_entertainment',
    'capcom',
    'cartoon_network',
    'dc',
    'disney',
    'hasbro',
    'konami',
    'milk_factory',
    'nickelodeon',
    'nintendo',
    'pixar',
    'popcap_games',
    'shounen_jump',
    'square_enix',
    'virtual_youtuber',
];
// known_owner = [];

function checkExist(query,qid=0,hidden_ok=false) {
    let el_exist = false;
    if (document.querySelectorAll(query).length > qid){
        if (hidden_ok) {
            el_exist = true;
        } else if (document.querySelectorAll(query)[qid].getBoundingClientRect().width > 0 && document.querySelectorAll(query)[qid].getBoundingClientRect().height > 0) {
            el_exist = true;
        }
    }
    return el_exist;
}
function checkEl(query,qid=0,callback=false,hidden_ok=false) {
    let old_top = -1;
    let old_left = -1;
    let loop_checkEl = setInterval(function() {
        console.log("checkEl: "+query+"["+qid+"]");
        if (checkExist(query,qid,hidden_ok)) {
            if (hidden_ok) {
                clearInterval(loop_checkEl);
                if (typeof callback == "function") {
                    callback();
                }
            } else if (old_top==document.querySelectorAll(query)[qid].getBoundingClientRect().top && old_left==document.querySelectorAll(query)[qid].getBoundingClientRect().left) {
                clearInterval(loop_checkEl);
                if (typeof callback == "function") {
                    callback();
                }
            } else {
                old_top = document.querySelectorAll(query)[qid].getBoundingClientRect().top;
                old_left = document.querySelectorAll(query)[qid].getBoundingClientRect().left;
            }
        }
    }, 200);
}

function htmlDecode(input){
  var e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function processAllAlt() {
    var el_images = document.querySelectorAll(q_img);
    // console.log(el_images);
    for (let i = 0; i < el_images.length; i++) {
        // console.log(i);
        let el_image = el_images[i];
        let el_span = el_image.parentElement.parentElement;

        // let tag_str = (el_image.alt.replace(/&#039;/g,"'")).trim();
        let tag_str = htmlDecode(el_image.alt).trim();
        let tag_list = tag_str.split(' ');

        let series_list = [];
        let owner_list = [];

        for (let ii = 0; ii < tag_list.length; ii++) {
            if (known_series.indexOf(tag_list[ii]) >= 0) {
                series_list.push(tag_list[ii]);
            } else if (known_owner.indexOf(tag_list[ii]) >= 0) {
                owner_list.push(tag_list[ii]);
            } else if (tag_list[ii].indexOf('(series') >= 0) {
                series_list.push(tag_list[ii]);
            }
        }
        // console.log(series_list);

        let series_str = "";
        if (series_list.length > 0) {
            series_str = "<br><span style='word-wrap:break-word;'>" + series_list.join(', ') + '</span>';
        } else if (owner_list.length > 0) {
            series_str = "<br><span style='word-wrap:break-word;'>" + owner_list.join(', ') + '</span>';
        } else {
            // series_str = "<br><span style='word-wrap:break-word;'>gatau</span>";
        }

        // console.log()
        // console.log(el_span);
        let score_str = (el_image.title.replace(tag_str,"")).trim();
        if (score_str.length > 30) {
            console.log(i);
            console.log(el_image.alt);
        }
        score_str = score_str.substring(0,score_str.indexOf(" "));
        score_str = "<br><span style='word-wrap:break-word;'>" + score_str + '</span>';

        let desc_str = series_str + score_str;
        
        el_span.innerHTML += desc_str;
        el_span.style = "height:200px;";
        // el_image.title = 
        // if (el_image.alt.indexOf('&amp;#039;') >= 0) {
        //     console.log(el_image.alt.replace("&amp;#039;","'"));
        // }
        // if (i === 4) {
        //     console.log(i);
        //     console.log(series_list);
        //     console.log("series_str:",series_str);
        //     console.log("score_str:",score_str);
        //     console.log("desc_str:",desc_str);
        // }
        // if (el_image.title.indexOf("score") >= 0) {
        //     // console.log(el_image);
        // } else {
        //     // console.log(el_image);
        // }
    }
}

(function() {
    'use strict';

    // Your code here...
    checkEl(q_img,0,processAllAlt);
})();