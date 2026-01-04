// ==UserScript==
// @name         Rule 34 QoL
// @version      0.0.4
// @description  Rule 34 Quality-of-Life Tools
// @author       ryousukecchi
// @match        https://rule34.xxx/*
// @namespace    https://greasyfork.org/users/801832
// @icon         https://www.google.com/s2/favicons?domain=rule34.xxx
// match         https://rule34.xxx/index.php?page=post&s=list*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474547/Rule%2034%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/474547/Rule%2034%20QoL.meta.js
// ==/UserScript==
// jshint esversion: 6

/*

if (localstorage != null && date is not match) {
    clear said key
}
get localstorage
setitem localstorage+updated date

notes:
limit caption in desc
remove statistics data

*/

// var blacklisted_tag = [
//     // 'anal_sex',
//     'futanari',
//     'derpixon',
//     'speedosausage',
//     'tentacle',
//     'yaoi',
//     'male_only',
//     'male_on_male',
//     'male/male',
//     // furry
//     'digimon',
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
//     'diives',
//     'helluva_boss',
//     'minecraft',
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
var q_origin_image_a = '.link-list>ul>li>a';
var q_vid = 'video#gelcomVideoPlayer';
var q_img_v = 'img#image';

var q_tag = {
    "pre": 'ul#tag-sidebar>li.tag-type-',
    "post": '>a:nth-child(1)',
};
q_tag.copyright = q_tag.pre + 'copyright' + q_tag.post;
q_tag.character = q_tag.pre + 'character' + q_tag.post;
q_tag.artist = q_tag.pre + 'artist' + q_tag.post;
// var q_tag_copyright = 'ul#tag-sidebar>li.tag-type-copyright>a:nth-child(1)';
// var q_tag_character = 'ul#tag-sidebar>li.tag-type-character>a:nth-child(1)';
// var q_tag_artist = 'ul#tag-sidebar>li.tag-type-artist>a:nth-child(1)';
var url_obj;

var pages_has_tag = ["post"];

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

var exclude_tags = [
    'blender_(software)',
    'nier',
];

var known_owner = [
    'blizzard_entertainment',
    'capcom',
    'cartoon_network',
    'dc',
    'dc_comics',
    'disney',
    'game_freak',
    'hasbro',
    'konami',
    'midway',
    'milk_factory',
    'naughty_dog',
    'netherrealm_studios',
    'nickelodeon',
    'nintendo',
    'pixar',
    'popcap_games',
    'shounen_jump',
    "sony_interactive_entertainment",
    'square_enix',
    'virtual_youtuber',
];

let tags_copyright = JSON.parse(window.localStorage.getItem("copyright"));
let tags_character = JSON.parse(window.localStorage.getItem("character"));
let views = JSON.parse(window.localStorage.getItem("views"));
let vids_info = JSON.parse(window.localStorage.getItem("vids_info"));
// known_owner = [];
function isNumber(value) {
   return typeof value === 'number' && isFinite(value);
}

function doCallback(callback=false) {
    if (typeof callback == "function") {
        callback();
    }
}
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
                doCallback(callback);
            } else if (old_top==document.querySelectorAll(query)[qid].getBoundingClientRect().top && old_left==document.querySelectorAll(query)[qid].getBoundingClientRect().left) {
                clearInterval(loop_checkEl);
                doCallback(callback);
            } else {
                old_top = document.querySelectorAll(query)[qid].getBoundingClientRect().top;
                old_left = document.querySelectorAll(query)[qid].getBoundingClientRect().left;
            }
        }
    }, 300);
}

function s_to_hms(t) {
    let d = new Date(t * 1000).toISOString().substr(11, 8);
    let s = d.slice(-2);
    let m = d.slice(0,-3);
    m = parseInt(m.slice(-2)).toString();
    m += ":";
    let h = d.slice(0,-6);
    h = parseInt(h).toString();
    if (h=="0") {
        h = "";
    } else {
        h += ":"
    }
    return h+m+s;
}


function checkEls(queries,callback=false,hidden_ok=false) {
    let exist_result;
    let loop_checkEls = setInterval(function() {
        exist_result = [];
        for (let i = 0; i < queries.length; i++) {
            console.log(checkEls.name + " " + queries[i].q + "[" + queries[i].qid + "]");
            exist_result.push(checkExist(queries[i].q,queries[i].qid,hidden_ok));
        }
        if (exist_result.indexOf(false)===-1) {
            clearInterval(loop_checkEls);
            doCallback(callback);
        }
    }, 300);
}

function checkElsOR(queries,callback=false,hidden_ok=false) {
    let exist_result;
    let loop_checkEls = setInterval(function() {
        exist_result = [];
        for (let i = 0; i < queries.length; i++) {
            console.log(checkElsOR.name + " " + queries[i].q + "[" + queries[i].qid + "]");
            exist_result.push(checkExist(queries[i].q,queries[i].qid,hidden_ok));
        }
        if (exist_result.indexOf(true)>=0) {
            clearInterval(loop_checkEls);
            doCallback(callback);
        }
    }, 300);
}

function htmlDecode(input){
  let e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function trackView(id) {
    let db = window.localStorage.getItem("views");
    if (db != null) {
        db = JSON.parse(db);
        if (db[id] === undefined) {
            db[id] = 1;
        } else {
            db[id] += 1;
        }
        window.localStorage.setItem("views", JSON.stringify(db));
    } else {
        db = {}
        db[id] = 1;
        window.localStorage.setItem("views", JSON.stringify(db));
    }
}

function trackVidInfo(id,s,temp=false) {
    let db = window.localStorage;
    if (temp) {
        db = window.sessionStorage;
    }
    let d = db.getItem("vids_info");
    if (d != null) {
        d = JSON.parse(d);
        if (d[id] === undefined) {
            d[id] = {"s":s};
            db.setItem("vids_info", JSON.stringify(d));
        }
    } else {
        d = {}
        d[id] = {"s":s};
        db.setItem("vids_info", JSON.stringify(d));
    }
}

function insertTag(tag_type,tag,inc_count=false) {
    let db = window.localStorage.getItem(tag_type);
    if (db != null) {
        db = JSON.parse(db);
        if (db[tag] === undefined) {
            db[tag] = 0;
            window.localStorage.setItem(tag_type, JSON.stringify(db));
        } else if (inc_count) {
            db[tag] += 1;
            window.localStorage.setItem(tag_type, JSON.stringify(db));
        }
    } else {
        db = {}
        db[tag] = 0;
        window.localStorage.setItem(tag_type, JSON.stringify(db));
    }
}

function loopNavTag(tag_type,inc_count=false,e="default") {
    if (e == "default") {
        e = document;
    }
    let list_el_tag = e.querySelectorAll(q_tag[tag_type]);

    for (let i = 0; i < list_el_tag.length; i++) {
        let el_tag = list_el_tag[i];
        let tag_str;
        if (el_tag.textContent == "+") {
            tag_str = el_tag.onclick.toString();
            tag_str = tag_str.substring(tag_str.lastIndexOf("+")+1,tag_str.lastIndexOf("'"));
        } else if (el_tag.href != "" && el_tag.href.length > 0){
            let href_obj = new URL(el_tag.href);
            tag_str = href_obj.searchParams.get("tags");
        }
        insertTag(tag_type,tag_str,inc_count);

    }
}

function addDurationToDOM(el_image, s) {
    let el_time = document.createElement("div");
    let el_span = el_image.parentElement.parentElement;
    el_time.style.backgroundColor = "rgba(0,0,0,0.7)";
    el_time.style.color = "#fff";
    el_time.style.display = "flex";
    el_time.style.justifyContent = "center";
    el_time.style.alignItems = "center";
    el_time.style.position = "absolute";
    el_time.style.zIndex = "90";
    el_time.appendChild(document.createTextNode(s_to_hms(s)));
    el_image.parentElement.insertBefore(el_time, el_image.parentElement.firstChild);
    el_time.style.marginTop = (el_image.getBoundingClientRect().height-el_time.getBoundingClientRect().height-2).toString() + "px";
    el_time.style.marginLeft = (((el_span.getBoundingClientRect().width - el_image.getBoundingClientRect().width) / 2) + el_image.getBoundingClientRect().width - el_time.getBoundingClientRect().width-2).toString() + "px";
}

function hasAudio (video) {
    return video.mozHasAudio ||
    Boolean(video.webkitAudioDecodedByteCount) ||
    Boolean(video.audioTracks && video.audioTracks.length);
}

function getVideoDuration(el_image) {
    let u = el_image.parentElement.href;
    let gallery_url = new URL(el_image.parentElement.href);
    let gallery_id = gallery_url.searchParams.get("id");
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            let r = xhr.responseText;
            let e = document.createElement("div");
            e.innerHTML = r.substring(r.indexOf("<body"),r.indexOf("</body>")+7);
            let loop_checkDuration = setInterval(function() {
                if (isNumber(e.querySelector(q_vid).duration)) {
                    clearInterval(loop_checkDuration);
                    loopNavTag("copyright",false,e);
                    loopNavTag("character",false,e);
                    tags_copyright = JSON.parse(window.localStorage.getItem("copyright"));
                    tags_character = JSON.parse(window.localStorage.getItem("character"));
                    let s = e.querySelector(q_vid).duration;
                    trackVidInfo(gallery_id, s, true);
                    addDurationToDOM(el_image, s);
                }
            }, 500);
        }
    }
    xhr.open("GET", u, true);
    xhr.send(null);
}

function updateGalleryInfo(el_image) {

}

function processGallery() {
    let page = url_obj.page;
    if (pages_has_tag.indexOf(page) >= 0) {
        loopNavTag("copyright");
        loopNavTag("character");
        tags_copyright = JSON.parse(window.localStorage.getItem("copyright"));
        tags_character = JSON.parse(window.localStorage.getItem("character"));
    }

    let el_images = document.querySelectorAll(q_img);

    for (let i = 0; i < el_images.length; i++) {
        let el_image = el_images[i];
        let el_span = el_image.parentElement.parentElement;

        let gallery_url = new URL(el_image.parentElement.href)
        let gallery_id = gallery_url.searchParams.get("id");

        let gallery_views = 0;

        if (vids_info != null && vids_info[gallery_id] != undefined) {
            addDurationToDOM(el_image, vids_info[gallery_id].s);
        } else {
            let temp_vids_info = JSON.parse(window.sessionStorage.getItem("vids_info"));
            if (temp_vids_info != null && temp_vids_info[gallery_id] != undefined) {
                addDurationToDOM(el_image, temp_vids_info[gallery_id].s);
            } else {
                getVideoDuration(el_image);
            }
        }

        if (views != null && views[gallery_id] != undefined) {
            gallery_views = views[gallery_id];
        }


        let tag_str;
        if (pages_has_tag.indexOf(page) >= 0) {
            tag_str = htmlDecode(el_image.alt).trim();
        } else {
            tag_str = htmlDecode(el_image.title).trim();
        }
        let tag_list = tag_str.split(' ');

        let series_list = [];
        let character_list = [];
        let owner_list = [];

        for (let ii = 0; ii < tag_list.length; ii++) {
            if (exclude_tags.indexOf(tag_list[ii]) >= 0) {
            } else if (tags_copyright[tag_list[ii]] != null) {
                let is_unknown_series = true;
                for (let iii = 0; iii < known_series.length; iii++) {
                    if (tag_list[ii].indexOf(known_series[iii]) >= 0) {
                        if (series_list.indexOf(known_series[iii])===-1) {
                            series_list.push(known_series[iii]);
                        }
                        is_unknown_series = false;
                    }
                }
                if (is_unknown_series) {
                    if (known_owner.indexOf(tag_list[ii]) >= 0) {
                        owner_list.push(tag_list[ii]);
                    } else {
                        series_list.push(tag_list[ii]);
                    }
                }
            // if (known_series.indexOf(tag_list[ii]) >= 0) {

            } else if (known_owner.indexOf(tag_list[ii]) >= 0) {
                owner_list.push(tag_list[ii]);
            } else if (tag_list[ii].indexOf('(series') >= 0) {
                series_list.push(tag_list[ii]);
            } else if (tags_character[tag_list[ii]] != null) {
                character_list.push(tag_list[ii]);
            }
        }
        // console.log(series_list);

        let series_str = "";
        let series_txt = series_list.join(', ');
        if (series_list.length > 0) {
            series_str = "<br><span style='word-wrap:break-word;'>" + series_txt + '</span>';
        } else if (owner_list.length > 0) {
            series_str = "<br><span style='word-wrap:break-word;'>" + owner_list.join(', ') + '</span>';
        } else {
            // series_str = "<br><span style='word-wrap:break-word;'>gatau</span>";
        }

        // console.log()
        // console.log(el_span);

        let title_series_str = "";
        if (series_list.length > 0) {
            title_series_str = "Series: "+series_txt+'\n';
        }
        let title_owner_str = "";
        if (owner_list.length > 0) {
            title_owner_str = "Copyright: "+owner_list.join(', ')+'\n';
        }
        let title_character_str = "";
        if (character_list.length > 0) {
            title_character_str = "Character: "+character_list.join(', ')+'\n';
        }

        let title_str = title_series_str+title_owner_str+title_character_str;

        let desc_str = series_str;

        if (pages_has_tag.indexOf(page) >= 0) {
            let score_str = (el_image.title.replace(tag_str,"")).trim();
            if (score_str.length > 30) {
                console.log(i);
                console.log(el_image.alt);
            }
            let score_txt = score_str.substring(0,score_str.indexOf(" "));
            let score_num = score_txt.replace("score:","")
            score_txt = "Score: "+score_num;
            score_str = "<br><span style='word-wrap:break-word;'>" + score_txt + '</span>';
            desc_str += score_str;
            title_str += score_txt+'\n';
        }

        desc_str += "<br><span>Views: "+(gallery_views).toString()+"</span>";

        title_str += "Views: "+(gallery_views).toString();

        el_image.title = title_str;
        let el_span_desc = document.createElement("span");
        el_span_desc.innerHTML = desc_str;
        el_span.appendChild(el_span_desc);
        // el_span.style = "height:200px;";
    }

}

function processView() {
    loopNavTag("copyright",true);
    loopNavTag("character",true);
    let gallery_id = url_obj.searchParams.get("id");

    let el_vid = document.querySelector(q_vid);
    let el_img = document.querySelector(q_img_v);

    if (el_vid != null) {
        el_vid.style.maxHeight = "95vh";
        el_vid.style.maxWidth = "95vw";

        el_vid.parentElement.style.maxHeight = "95vh";
        el_vid.parentElement.style.maxWidth = "95vw";

        let el_container = document.querySelector("h4.image-sublinks");

        let loop_checkDuration = setInterval(function() {
            if (isNumber(document.querySelector(q_vid).duration)) {
                clearInterval(loop_checkDuration);
                trackView(gallery_id);
                trackVidInfo(gallery_id, document.querySelector(q_vid).duration);
                views = JSON.parse(window.localStorage.getItem("views"));
                let el_span = "<span>Views: " + views[gallery_id] + '</span> | ';
                el_container.innerHTML = el_span + el_container.innerHTML;
                // el_vid.scrollIntoViewIfNeeded();
                el_vid.volume = 1;
                window.scrollTo(0,window.pageYOffset + el_vid.getBoundingClientRect().top - 2)
            }
        }, 500);
    }
}

function changeVideo() {
  var el_origin_image_a = document.querySelectorAll(q_origin_image_a)[1];
  console.log(el_origin_image_a);
}

function initChangeVideo() {
  checkEl(q_origin_image_a, 1, changeVideo);
}

function initGallery() {
    checkEl(q_img, 0, processGallery);
}
function initView() {
    checkElsOR([{"q":q_vid,"qid":0},{"q":q_img_v,"qid":0}], processView);
}

function initDB(tag_type,list_tag) {
    let db = window.localStorage.getItem(tag_type);
    if (db === null) {
        db = {}
        for (let i = 0; i < list_tag.length; i++) {
            let tag = list_tag[i];
            db[tag] = 0;
        }
        window.localStorage.setItem(tag_type, JSON.stringify(db));
    }
}

(function() {
    'use strict';

    // Your code here...
    initDB("copyright", known_series);
    url_obj = new URL(window.location.href);
    url_obj.page = url_obj.searchParams.get("page");
    url_obj.s = url_obj.searchParams.get("s");
    if (url_obj.page == "post") {
        if (url_obj.s == "list") {
            initGallery();
        } else if (url_obj.s == "view") {
            initView();
            initChangeVideo();
        }
    } else if (url_obj.page == "favorites") {
        if (url_obj.s == "view") {
            initGallery();
        }
    }
})();