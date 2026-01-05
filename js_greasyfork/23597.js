// ==UserScript==
// @name        SankakuAddon
// @namespace   SankakuAddon
// @description Adds a few quality of life improvements on Sankaku Channel: Automatic image scaling, scrolling to image, thumbnail icons for loud/animated posts, muting/pausing videos, + - tag search buttons, a tag menu which allows for tagging by clicking, 'Choose/Set Parent' modes, easier duplicate tagging/flagging. Fully configurable through the Addon config.
// @author      sanchan
// @version     1.0.16
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbmlDQ1BpY2MAACiRdZHPKwRhGMc/dolYbeIgOewBOeyWKDlqFZflsFZZXGZmZ3fVzphmZpNclYuDchAXvw7+A67KlVKKlOTgL/DrIo3n3VUr8U7vPJ++7/t9et/vC6FUybC8+gGwbN9NTyRjs9m5WOMTETpoox00w3Mmp8cz/Dveb6hT9Tqhev2/78/RkjM9A+qahIcNx/WFR4VTy76jeEO4wyhqOeF94bgrBxS+ULpe5UfFhSq/KnYz6TEIqZ6xwg/Wf7BRdC3hfuEeq1Q2vs+jbhIx7ZlpqV0yu/FIM0GSGDplFinhk5BqS2Z/+wYqvimWxGPI32EFVxwFiuKNi1qWrqbUvOimfCVWVO6/8/TyQ4PV7pEkNDwEwUsvNG7B52YQfBwEwechhO/hzK75lySnkTfRN2tazx5E1+DkvKbp23C6Dp13juZqFSksM5TPw/MxtGah/Qqa56tZfa9zdAuZVXmiS9jZhT7ZH134ArhcZ+m/WStSAAAACXBIWXMAAAsSAAALEgHS3X78AAAAeElEQVQ4y2NgoCX4Xyb7H4TxqWHCo7keG5toA4CgAQebsAHYbMTlCiYibMfrCiZibcIlx0SE3/GGBRM+Gxi7HjeCMD41TESGPE5XMOGzHRsbnxcIxbsDDAMts4cbjmR7A4kpvQHkMiZCKY1QSmXBZTKedNBA1RwLAFCeNCTVhz2FAAAAAElFTkSuQmCC
// @match       https://chan.sankakucomplex.com/*
// @match       https://idol.sankakucomplex.com/*
// @match       https://legacy.sankakucomplex.com/*
// @run-at      document-start
// @noframes
// @grant       GM.registerMenuCommand
// @grant       GM.addStyle
// @grant       GM.openInTab
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @grant       GM.addValueChangeListener
// @grant       GM_addValueChangeListener
// @grant       GM.setClipboard
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/23597/SankakuAddon.user.js
// @updateURL https://update.greasyfork.org/scripts/23597/SankakuAddon.meta.js
// ==/UserScript==

(async function(unsafeWindow) {
  'use strict';

  const VERSION = 'v1.0.16';

  const SVG_SIZE = 20;
  const SPEAKER_SVG = `<svg class="speaker_icon" width="${SVG_SIZE}" height="${SVG_SIZE}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
 <rect x="2" y="2" width="28" height="28" fill-opacity=".67" fill-rule="evenodd" stroke-width=".22631"/>
 <g fill="#fff" fill-opacity=".33" fill-rule="evenodd">
  <rect width="32" height="2" stroke-width=".074927"/>
  <rect x="30" y="2" width="2" height="28" stroke-width=".075839"/>
  <rect y="2" width="2" height="28" stroke-width=".075839"/>
  <rect y="30" width="32" height="2" stroke-width=".07698"/>
 </g>
 <path d="m19 11c6 5 0 10 0 10" fill="none" stroke="#1cd9ff" stroke-width="2"/>
 <path d="m23 9c8 7 0 14 0 14" fill="none" stroke="#1cd9ff" stroke-width="2"/>
 <path d="m16 23h-3l-3-3h-5v-8h5l3-3h3" fill="#ff761c"/>
</svg>`;

  const ANIMATED_SVG = `<svg class="animated_icon" width="${SVG_SIZE}" height="${SVG_SIZE}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
 <rect x="2" y="2" width="28" height="28" fill-opacity=".67" fill-rule="evenodd" stroke-width=".22631"/>
 <g fill="#fff" fill-opacity=".33" fill-rule="evenodd">
  <rect width="32" height="2" stroke-width=".074927"/>
  <rect x="30" y="2" width="2" height="28" stroke-width=".075839"/>
  <rect y="2" width="2" height="28" stroke-width=".075839"/>
  <rect y="30" width="32" height="2" stroke-width=".07698"/>
 </g>
 <path d="m18 16-10 6v-12" fill="#ff761c"/>
 <path d="m26 16-9 6v-12" fill="#ff761c"/>
</svg>`;

  const EXPLICIT_SVG = `<svg width="${SVG_SIZE}" height="${SVG_SIZE}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
 <g>
  <rect x="2" y="2" width="28" height="28" fill-opacity=".67" fill-rule="evenodd" stroke-width=".22631"/>
  <g fill="#fff" fill-opacity=".33" fill-rule="evenodd">
   <rect x="-6.0956e-8" y="-1.3512e-9" width="32" height="2" stroke-width=".074927"/>
   <rect x="30" y="2" width="2" height="28" stroke-width=".075839"/>
   <rect x="-6.0956e-8" y="2" width="2" height="28" stroke-width=".075839"/>
   <rect x="-6.0956e-8" y="30" width="32" height="2" stroke-width=".07698"/>
  </g>
  <g transform="scale(.9953 1.0047)" fill="#f99" aria-label="S">
   <rect x="12.057" y="5.9718" width="11.052" height="2.9859" stroke-width="1.0856"/>
   <rect x="12.057" y="22.892" width="11.052" height="2.9859" stroke-width="1.0856"/>
   <rect x="12.057" y="14.432" width="9.0425" height="2.9859" stroke-width=".98198"/>
   <rect x="9.0425" y="5.9718" width="3.0142" height="19.906" stroke-width="1.0541"/>
  </g>
 </g>
</svg>`;

  const QUESTIONABLE_SVG = `<svg width="${SVG_SIZE}" height="${SVG_SIZE}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
 <g>
  <rect x="2" y="2" width="28" height="28" fill-opacity=".67" fill-rule="evenodd" stroke-width=".22631"/>
  <g fill="#fff" fill-opacity=".33" fill-rule="evenodd">
   <rect x="-6.0956e-8" y="-1.3512e-9" width="32" height="2" stroke-width=".074927"/>
   <rect x="30" y="2" width="2" height="28" stroke-width=".075839"/>
   <rect x="-6.0956e-8" y="2" width="2" height="28" stroke-width=".075839"/>
   <rect x="-6.0956e-8" y="30" width="32" height="2" stroke-width=".07698"/>
  </g>
  <g transform="translate(6.9551 5.0704)" fill="#999" aria-label="S">
   <path d="m11.545 14.93 5 4-2 2-5-4" fill="#999"/>
  </g>
  <text x="-13" y="4" font-family="'Andika New Basic'" font-size="40px" style="line-height:1.25" xml:space="preserve"><tspan x="-13" y="4"/></text>
  <path d="m16 6.5a7 9.5 0 0 0-7 9.5 7 9.5 0 0 0 7 9.5 7 9.5 0 0 0 7-9.5 7 9.5 0 0 0-7-9.5zm0 1.5a5 8 0 0 1 5 8 5 8 0 0 1-5 8 5 8 0 0 1-5-8 5 8 0 0 1 5-8z" fill="#999"/>
 </g>
</svg>`;

  const SAFE_SVG = `<svg width="${SVG_SIZE}" height="${SVG_SIZE}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
 <g>
  <rect x="2" y="2" width="28" height="28" fill-opacity=".67" fill-rule="evenodd" stroke-width=".22631"/>
  <g fill="#fff" fill-opacity=".33" fill-rule="evenodd">
   <rect x="-6.0956e-8" y="-1.3512e-9" width="32" height="2" stroke-width=".074927"/>
   <rect x="30" y="2" width="2" height="28" stroke-width=".075839"/>
   <rect x="-6.0956e-8" y="2" width="2" height="28" stroke-width=".075839"/>
   <rect x="-6.0956e-8" y="30" width="32" height="2" stroke-width=".07698"/>
  </g>
  <g transform="scale(.9953 1.0047)" fill="#9f9" aria-label="S">
   <path d="m21.586 9.7289q-0.78306-0.39548-1.4501-0.65914-0.65255-0.27684-1.2761-0.44822-0.62355-0.18456-1.2471-0.26366-0.62355-0.079096-1.3196-0.079096-0.87006 0-1.5951 0.23729-0.71055 0.23729-1.2326 0.63277-0.52204 0.39548-0.81206 0.90961-0.27552 0.51413-0.27552 1.0546 0 0.5405 0.15951 0.98871 0.17401 0.43503 0.68155 0.83052 0.50754 0.3823 1.4501 0.7646 0.94257 0.36912 2.4942 0.77779 1.4356 0.3823 2.5377 0.89643 1.1166 0.50095 1.8706 1.1601t1.1456 1.5028q0.39153 0.8437 0.39153 1.9115 0 1.3315-0.58004 2.4256-0.56554 1.081-1.5661 1.872-0.98607 0.77779-2.3057 1.2128-1.3196 0.42185-2.7987 0.42185-1.0441 0-2.0447-0.13183-0.98607-0.13183-1.8706-0.36912-0.87006-0.23729-1.6096-0.55368-0.73955-0.32957-1.2906-0.72506l0.65255-2.7025q1.4501 1.1469 2.9872 1.661 1.5516 0.51413 3.1757 0.51413 0.87006 0 1.6821-0.22411t1.4356-0.64596q0.62355-0.43503 1.0006-1.0546 0.37703-0.63278 0.37703-1.4369 0-0.51413-0.18851-0.97553-0.17401-0.47458-0.72505-0.9228-0.55104-0.44822-1.5806-0.88325-1.0296-0.44822-2.7262-0.90961-1.6966-0.4614-2.7697-1.0151-1.0731-0.55368-1.6821-1.1996-0.60904-0.65914-0.84106-1.3974-0.21752-0.75142-0.21752-1.5951 0-0.8437 0.37703-1.7797 0.39153-0.93598 1.2181-1.7269 0.82656-0.79097 2.1172-1.3051 1.2906-0.52731 3.1032-0.52731 0.84106 0 1.5661 0.065914 0.73956 0.065914 1.4211 0.21092 0.69605 0.14501 1.3631 0.36912 0.66705 0.22411 1.3776 0.5405z" fill="#9f9"/>
  </g>
 </g>
</svg>`;

  const RATING_SVG = {
    'r18+': EXPLICIT_SVG,
    'r15+': QUESTIONABLE_SVG,
    'g': SAFE_SVG,
  };

  // based on the Tag Checklist in the wiki
  const DEFAULT_TAGLIST =
    `[
  {
    "name": "People & Gender",
    "tags": [
      [
        ["female female_only 1girl 2girls 3girls 4girls 5girls 6+girls"],
        ["male male_only 1boy 2boys 3boys 4boys 5boys 6+boys"],
        ["futanari futanari_only 1_futanari 2_futanari 3_futanari 4_futanari 5_futanari 6+_futanari"],
        ["newhalf newhalf_only 1_newhalf 2_newhalf 3_newhalf 4_newhalf 5_newhalf 6+_newhalf"]
      ],
      "no_humans"
    ]
  },
  {
    "name": "Young Age",
    "tags": [
      "child loli shota toddlercon young"
    ]
  },
  {
    "name": "Androgynous",
    "tags": [
      "androgynous crossdressing genderswap trap reverse_trap"
    ]
  },
  {
    "name": "Group",
    "tags": [
      "solo duo trio quartet quintet sextet group"
    ]
  },
  {
    "name": "Relationship",
    "tags": [
      "couple siblings sisters brothers brother_and_sister twins triplets"
    ]
  },
  {
    "name": "Who/Other",
    "tags": [
      "anthropomorphization multiple_persona elf mecha monster monster_girl magical_girl fairy"
    ]
  },
  {
    "name": "Face",
    "tags": [
      "face ears eyes nose lips teeth facial_mark facial_hair beard"
    ]
  },
  {
    "name": "Upper Body",
    "tags": [
      "arms armpits armpit_crease armpit_peek back bare_shoulders breasts bust clavicle midriff navel stomach hands fingers"
    ]
  },
  {
    "name": "Lower Body",
    "tags": [
      "anus ass mound_of_venus vagina penis thighs knees feet barefoot legs bare_legs bare_thighs zettai_ryouiki toes"
    ]
  },
  {
    "name": "Breasts",
    "tags": [
      "cleavage breasts nipples areolae puffy_areolae areola_slip breasts_out_of_clothes breasts_apart underboob sideboob"
    ]
  },
  {
    "name": "Breast Size",
    "tags": [
      "pettanko small_breasts medium_breasts large_breasts huge_breasts gigantic_breasts alternate_bust_size"
    ]
  },
  {
    "name": "Skin Color",
    "tags": [
      "pale_skin dark_skin tanned shiny_skin albino",
      ["red_skin orange_skin yellow_skin green_skin blue_skin purple_skin pink_skin white_skin grey_skin black_skin"]
    ]
  },
  {
    "name": "Hairstyle",
    "tags": [
      "ahoge bangs blunt_bangs bob_cut double_bun drill_hair hair_over_one_eye peek-a-boo_bang ponytail side_pony_tail single_braid spiky_hair twinbraids twintails alternate_hairstyle two_side_up"
    ]
  },
  {
    "name": "Hair Length",
    "tags": [
      "very_short_hair short_hair medium_hair long_hair very_long_hair absurdly_long_hair"
    ]
  },
  {
    "name": "Hair/Eye Color",
    "tags": [
      [
        ["blonde_hair black_hair blue_hair brown_hair green_hair grey_hair orange_hair pink_hair purple_hair red_hair silver_hair white_hair"],
        ["golden_eyes black_eyes blue_eyes brown_eyes green_eyes grey_eyes orange_eyes pink_eyes purple_eyes red_eyes silver_eyes white_eyes"]
      ]
    ]
  },
  {
    "name": "Animal Parts",
    "tags": [
      "animal_ears bat_wings bunny_ears cat_tail wolf_ears fang horns kitsunemimi nekomimi tail inumimi wings angel_wings"
    ]
  },
  {
    "name": "Look/Other",
    "tags": [
      "chibi mole muscle pointed_ears pregnant scar curvy animal_ear_fluff fluffy_tail"
    ]
  },
  {
    "name": "Swimwear",
    "tags": [
      "bikini one-piece_swimsuit swimsuit competition_swimsuit sukumizu"
    ]
  },
  {
    "name": "Facewear",
    "tags": [
      "megane sunglasses eyewear_on_head red-framed_eyewear"
    ]
  },
  {
    "name": "Upper Body",
    "tags": [
      "sailor_collar choker shirt crop_top camisole dress bra babydoll"
    ]
  },
  {
    "name": "Lower Body",
    "tags": [
      "skirt pleated_skirt pantsu thighhighs shoes sandals socks pants shorts short_shorts"
    ]
  },
  {
    "name": "Traditional\u00A0Clothes",
    "tags": [
      "serafuku kimono kindergarten_uniform chinese_clothes"
    ]
  },
  {
    "name": "Wear/Other",
    "tags": [
      "armor suit uniform school_uniform underwear_only nude completely_nude"
    ]
  },
  {
    "name": "Actions",
    "tags": [
      "battle fighting jumping running princess_carry stretch sleeping lying flying squatting"
    ]
  },
  {
    "name": "Posture",
    "tags": [
      "all_fours arched_back back-to-back bent-over fighting_stance leaning leaning_back leaning_forward squat top-down_bottom-up"
    ]
  },
  {
    "name": "Arms",
    "tags": [
      "arms_behind_back arms_crossed arm_support arm_up arms_up arms_behind_head chin_rest outstretched_arm outstretched_arms spread_arms v_arms"
    ]
  },
  {
    "name": "Hands",
    "tags": [
      "hands_clasped hand_in_pocket hands_in_pocket hand_on_cheek hand_on_hat hand_on_head hand_on_hip hands_on_hip hand_on_shoulder holding_hands interlocked_fingers outstretched_hand"
    ]
  },
  {
    "name": "Legs",
    "tags": [
      "knees_on_chest leg_lift leg_up legs_up outstretched_leg pigeon_toed spread_legs"
    ]
  },
  {
    "name": "Sitting",
    "tags": [
      "sitting crossed_legs indian_style leg_hug seiza sitting_on_lap sitting_on_person wariza yokozuwari straddling"
    ]
  },
  {
    "name": "Standing",
    "tags": [
      "standing crossed_legs_(standing) standing_on_one_leg"
    ]
  },
  {
    "name": "Lying",
    "tags": [
      "lying on_back on_side on_stomach"
    ]
  },
  {
    "name": "Viewing Direction",
    "tags": [
      "eye_contact looking_at_viewer looking_back looking_away"
    ]
  },
  {
    "name": "Gesture",
    "tags": [
      "clenched_hand clenched_hands double_v heart_hands pinky_out pointing shushing thumbs_up \\\\m\\/ reaching salute waving cat_pose paw_pose v claw_pose double_\\\\m\\/"
    ]
  },
  {
    "name": "Facial Expressions",
    "tags": [
      "expressions expressionless ahegao anger_vein blush blush_stickers clenched_teeth closed_eyes evil naughty_face nosebleed open_mouth parted_lips pout rolleyes frown tears scream"
    ]
  },
  {
    "name": "Emotions",
    "tags": [
      "angry annoyed embarrassed happy sad scared surprised worried disappointed drunk trembling"
    ]
  },
  {
    "name": "Sex",
    "tags": [
      "sex anal clothed_sex happy_sex vaginal yaoi yuri tribadism oral"
    ]
  },
  {
    "name": "Positions",
    "tags": [
      "69 doggystyle girl_on_top cowgirl_position reverse_cowgirl_position upright_straddle missionary"
    ]
  },
  {
    "name": "Stimulation",
    "tags": [
      "buttjob footjob grinding thigh_sex tekoki caressing_testicles double_handjob masturbation crotch_rub paizuri naizuri"
    ]
  },
  {
    "name": "Oral",
    "tags": [
      "oral breast_sucking cunnilingus facesitting fellatio deepthroat :>="
    ]
  },
  {
    "name": "Groping",
    "tags": [
      "groping ass_grab breast_grab nipple_tweak self_fondle torso_grab"
    ]
  },
  {
    "name": "Group Sex",
    "tags": [
      "group_sex gangbang double_penetration orgy spitroast teamwork threesome"
    ]
  },
  {
    "name": "Insertion",
    "tags": [
      "insertion anal_insertion large_insertion stomach_bulge multiple_insertions urethral_insertion penetration nipple_penetration fingering anal_fingering"
    ]
  },
  {
    "name": "Fetishes",
    "tags": [
      "milf giantess minigirl plump fat skinny public public_nudity zenra exhibitionism voyeurism futa_on_female futa_on_male incest twincest rape about_to_be_raped molestation bestiality impregnation tentacles virgin vore"
    ]
  },
  {
    "name": "Bondage",
    "tags": [
      "bondage bdsm asphyxiation breast_bondage shibari spreader_bar suspension femdom humiliation body_writing slave spanked torture bound_arms bound_legs bound_wrists suspension"
    ]
  },
  {
    "name": "Semen",
    "tags": [
      "semen bukkake dripping_semen semen_splatter semen_pool nakadashi semen_in_anus semen_in_mouth semen_on_tongue semen_on_body semen_on_hair semen_on_lower_body semen_on_ass semen_on_vagina semen_on_upper_body semen_on_breasts semen_on_clothes ejaculation ejaculating_while_penetrated facial"
    ]
  },
  {
    "name": "Objects",
    "tags": [
      "condom used_condom sex_toy dildo vibrator"
    ]
  },
  {
    "name": "Bodily Fluids",
    "tags": [
      "blood lactation urinating saliva sweat female_ejaculation vaginal_juices"
    ]
  },
  {
    "name": "View",
    "tags": [
      "cross-section internal_cumshot x-ray"
    ]
  },
  {
    "name": "Background",
    "tags": [
      "simple_background gradient_background two-tone_background ambiguous_background blurry_background",
      ["white_background grey_background black_background red_background brown_background orange_background yellow_background green_background blue_background purple_background pink_background"]      
    ]
  },
  {
    "name": "Placement",
    "tags": [
      "indoors outdoors rooftop city pool beach cave bedroom hallway"
    ]
  },
  {
    "name": "Nature",
    "tags": [
      "ocean river tree palm_tree wisteria lilac grass sand water",
      ["white_flower red_flower yellow_flower blue_flower purple_flower pink_flower"]
    ]
  },
  {
    "name": "Indoors",
    "tags": [
      "pillow bed door bed_sheet counter window curtains bathtub"
    ]
  },
  {
    "name": "Work Type",
    "tags": [
      "scan watercolor_(medium) papercraft non-web_source photoshop_(medium) sketch work_in_progress lineart"
    ]
  }
]`;

  const POST_MODE_DESCRIPTIONS = {
    'view': 'View',
    'add-fav': 'Add to favorites',
    'remove-fav': 'Remove from favorites',
    'rating-s': 'Rate G',
    'rating-q': 'Rate 15+',
    'rating-e': 'Rate R18+',
    'approve': 'Approve post',
    'flag': 'Flag',
    'edit-tag-script': 'Edit tag script',
    'apply-tag-script': 'Apply tag script',
    'choose-parent': 'Choose Parent',
    'set-parent': 'Set Parent',
    'edit-tags': 'Edit Tags',
    'find-similar': 'Find Similar',
    'delete': 'Delete Post',
  };

  const TAG_CATEGORIES = [
    'copyright',
    'studio',
    'character',
    'artist',
    'medium',
    'meta',
    'genre'
  ];

  /*****************/
  /* compatibility */
  /*****************/

  let IS_MONKEY = false; // Tampermonkey, Violentmonkey, Greasemonkey (all at least partially support 'GM.' functions)

  if (typeof GM === 'object' && typeof GM.info === 'object') {
    IS_MONKEY = true;

    // Greasemonkey:
    // doesn't have addStyle and addValueChangeListener
    // fetch() doesn't work with relative URLs (https://github.com/greasemonkey/greasemonkey/issues/2647), workaround: new URL('/relative/path', document.location)

    // polyfill for ViolentMonkey
    if (!GM.addValueChangeListener && typeof GM_addValueChangeListener !== 'undefined') GM.addValueChangeListener = GM_addValueChangeListener;
  }

  const HAS_MONKEY_STORAGE = IS_MONKEY;
  const HAS_MONKEY_STORAGE_LISTENER = IS_MONKEY && GM.addValueChangeListener;
  const HAS_MONKEY_ADD_STYLE = IS_MONKEY && GM.addStyle;

  let HAS_LOCAL_STORAGE;
  try {
    HAS_LOCAL_STORAGE = !!localStorage.getItem;
  } catch (error) { // DOMException
    HAS_LOCAL_STORAGE = false;
  }

  function add_storage_change_listener() {
    if (HAS_MONKEY_STORAGE_LISTENER) for (const key of Object.keys(config)) GM.addValueChangeListener(key, storage_changed);
    else if (HAS_LOCAL_STORAGE) window.addEventListener('storage', local_storage_changed);
    else show_notice(console.error, '[addon error] couldn\'t add storage change listener! No cross-tab communication possible.');
  }

  function open_in_tab(url) {
    if (IS_MONKEY) GM.openInTab(url, false);
    else           window.open(url); // requires popup permission
  }

  function add_style(css) {
    if (HAS_MONKEY_ADD_STYLE) {
      return Promise.resolve(GM.addStyle(css));  // Violentmonkey returns a style element whereas Tampermonkey returns a Promise
    } else {
      const sheet = document.createElement('STYLE');
      sheet.innerText = css;
      document.head.appendChild(sheet);
      return Promise.resolve(sheet);
    }
  }

  function set_clipboard(text) {
    if (IS_MONKEY) {
      GM.setClipboard(text);
    } else {
      navigator.clipboard.writeText(text).catch((err) => {
        show_notice(console.error, '[addon error]: Couldn\'t copy text to clipboard', err);
      });
    }
  }

  // the site uses a ton of ancient, non-standard polyfills/prototype overrides, e.g.
  // Array.from(new Set([1])) returns [] instead of [1]
  // JSON.parse(JSON.stringify([1])) returns "[1]" instead of [1]
  // Array.from(s) can be replaced by [...s]
  // to use proper JSON we need to temporarily unbind the site's toJSON functions
  const toJSON_OBJECTS = [Object, Array.prototype, Number.prototype, String.prototype];

  function delete_toJSONs() {
    const toJSON_originals = [];
    for (const obj of toJSON_OBJECTS) {
      if (obj.hasOwnProperty('toJSON')) {
        toJSON_originals.push({ obj, func: obj.toJSON });
        delete obj.toJSON;
      }
    }
    return toJSON_originals;
  }

  function restore_toJSONs(toJSON_originals) {
    for (const { obj, func } of toJSON_originals)
      obj.toJSON = func;
  }

  function JSON_stringify(obj, replacer, space) {
    let toJSON_originals;
    try {
      toJSON_originals = delete_toJSONs();
      return JSON.stringify(obj, replacer, space);
    } finally {
      restore_toJSONs(toJSON_originals);
    }
  }

  // enables JSON to stringify Sets and Hotkeys
  function json_replacer(key, value) {
    if (typeof value === 'object') {
      if (value instanceof Set)  return { t: 'Set', v: [...value] };
      if (value instanceof Map)  return { t: 'Map', v: [...value] };
      if (value instanceof Hotkey) {
        return { t: 'Hotkey', v: {
            key: value.key,
            modifiers: value.modifiers,
            action: value.action_name,
          } };
      }
    }

    return value;
  }

  // enables JSON to parse Sets and Hotkeys
  function json_reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
      switch (value.t) {
        case 'Set':
          return new Set(value.v);
        case 'Map':
          return new Map(value.v);
        case 'Hotkey':
          return new Hotkey(value.v.action, value.v.key, value.v.modifiers);
      }
    }

    return value;
  }

  function adjust_tag_color_css() {
    for (const category of TAG_CATEGORIES) {
      if (!config.tag_category_colors.has(category)) continue;

      add_style(`
        .tag_button.tag-type-${category}:not(.tag_nonexistent) {
          color: ${config.tag_category_colors.get(category)};
        }
      `);
    }
  }

  let css_vars = null;
  async function update_css_vars() {
    const style = await add_style(`
      :root {
        --thumbnail-size: ${config.thumbnail_size}px;
      }
    `);
    css_vars?.remove();
    css_vars = style;
  }

  let applied_css = false;
  function adjust_css() {
    if (applied_css) return;
    applied_css = true;

    // change priority of post borders (by redefining their colors after their original definition)
    // original: flagged < has-children < has-parent < pending < deleted
    // default:  deleted < has-children < has-parent < pending < flagged
    // variants: pending < deleted < has-children < has-parent < flagged
    // note: pending, flagged and deleted are mutually exclusive, so this is only about their relation to has-children/parent
    // also note: deleted posts only show through explicit search so they don't really need a border
    add_style(`
      img.has-children { border-color: #A7DF38; }
      img.has-parent   { border-color: #CCCC00; }
    ${config.post_border_style === 0 ? `
      img.pending      { border-color: #4B4BA3; }
    ` : config.post_border_style === 2 ? `
      img.pending:is(.has-children,.has-parent) { outline: #4B4BA3 solid 2px; }
    ` : ''}
      img.flagged      { border-color: #F00; }
    `);

    /* allow enlarging tag edit box */
    add_style(`
    form#edit-form textarea#post_tags {
      max-width: unset;
      height: 255px;
    }`);

    /* style edit box buttons */
    add_style(`
    form#edit-form button {
      min-width: 7em;
      padding-left: 0.5em;
      padding-right: 0.5em;
      margin-top: 0.5em;
      margin-bottom: 0.5em;
    }`
    );

    /* sitefix: there can appear a small gap between the navbar <li>s and the <ul>s which partially breaks hovering */
    /* this issue seems to be font-dependent and is worsened by the unicode config gear icon, no matter it's size (...?!) */
    add_style(`
      div#header ul#navbar {
        margin-bottom: 0;
        padding-top: 2px;
        padding-bottom: 0;
      }
      div#header ul#navbar li {
        padding-bottom: 3px;
      }
      div#header ul#navbar li:hover > ul {
        height: 2.1em;
      }
    `);

    /* sitefix for broken deletion page layout */
    add_style(`
      /* comparison box */
      #content > .deleting-post {
          clear: left;    /* clearfix: ensure box starts below first thumbnail */
          overflow: auto; /* fit its content */
      }

      /* balance margins */
      #content > .deleting-post {
          padding-top: 1em;
          padding-bottom: 1em;
      }
      #content > .deleting-post > div {
          margin-top: unset !important; /* important due to inline style */
          margin-bottom: unset !important;
      }
      #content > .deleting-post > ul {
          margin-bottom: unset;
      }

      /* align first thumbnail with comparison box */
      #content > .thumb {
          margin-left: calc(4em + 4px);
      }

      /* center warn tags / edit gear below thumbnails */
      #content .deleting-post .thumb > * {
          margin: auto;
      }
    `);

    /* custom style for tag menu */
    add_style(`
      .tag_button {
        display: inline-block;
        border-style: solid;
        border-width: 1px;
        padding-left: 5px;
        padding-right: 5px;
      }

      .tag_list, .tag_group {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        align-items: flex-start;
        column-gap: 6px;
        row-gap: 3px;
      }

      .tag_list {
        padding-left: 3px;
        padding-top: 3px;
        padding-bottom: 1px;
      }

      .tag_group {
        padding: 2px;
      }

      .tag_list table {
        margin: 0;
      }

      .tag_group, .tag_list table {
        margin-left: -3px;
        margin-top: -2px;
      }

      a.tag_nonexistent {
        color: #E00;
      }
    `);

    adjust_tag_color_css();

    // disable site icons when using own icons
    if (config.show_speaker_icon || config.show_animated_icon) {
      add_style(`
        .sound-icon, .video-icon {
          display: none;
        }
      `);
    }

    update_css_vars();

    if (config.custom_style) {
      add_style(`
        :root {
            /* 1920px - 230px sidebar - scrollbar = ~1670px */
            --thumbnail-image-size: calc(var(--thumbnail-size) - 30px);
        }

        /* simple left-aligned grid */
        .post-gallery.post-gallery-grid .posts-container {
            grid-template-columns: repeat(auto-fill, var(--thumbnail-size));
        }

        .posts-container.gap-2 {
            gap: 0
        }
        .post-gallery-grid .posts-container {
            margin-bottom: 0;
        }

        /* center thumbnails */
        #popular-preview .post-preview-container {
            display: grid;
            place-items: center;
        }
        .post-gallery-grid .post-preview-container {
            place-items: center;
        }

        .post-gallery${General.page === Page.Index ? ':not(.post-gallery-inline)' : ''} .post-preview {
            /* add outline */
            outline: #84848463 dashed 1px;

            /* slight transparent background */
            background-color: #c4c4c421;
    
            /* set size */
            width: var(--thumbnail-size);
        }

        /* set/override size */
        #post-list .posts-container .post-preview .post-preview-container {
            height: var(--thumbnail-size);
        }

        /* fix thumbnail icons for post page parent/children */
        #post-view .post-preview .post-preview-link {
            display: inline-block;
        }

        /* scale thumbnail images */
        .posts-container img.post-preview-image {
            /*
             * using object-fit: contain; instead will cause the borders to not fit the image
             * but this way will make the crossed out eyes appear tiny...
             */
            width: auto;
            height: auto;
            max-width: var(--thumbnail-image-size);
            max-height: var(--thumbnail-image-size);
        }
      `);
    }

    if (config.enlarge_navbar) {
      add_style(`
        :root {
            --navbar-size: 4em;
            --subnav-size: 4em;
        }

        /* Grow navbar size to match hover area and equalize the latter for darkmode */
        div#header ul#subnavbar {
          height: calc(var(--navbar-size) - 1em + 1px);
        }
        div#header ul#navbar li:hover > ul {
          height: var(--subnav-size);
        }
    `);
    }
  }


  /***************************/
  /* configuration functions */
  /***************************/

  const IS_IDOL = (window.location.hostname === 'idol.sankakucomplex.com' ? 1 : 0);
  const HISTORY_KEY = (IS_IDOL ? 'view_history_idol' : 'view_history');
  const COMMON_TAGS_KEYS = ['common_tags_json', 'common_tags_json_idol'];
  const COMMON_TAGS_KEY = COMMON_TAGS_KEYS[IS_IDOL];
  const OTHER_COMMON_TAGS_KEY = COMMON_TAGS_KEYS[1 - IS_IDOL];

  const HOTKEY_ACTIONS = { // actions need unique names (for serialization)
    postpage: {
      reset_size: () => {
        scale_image(SCALE_MODES.RESET, true);
        scroll_to_image();
      },
      fit_size: () => {
        scale_image(SCALE_MODES.FIT, true);
        scroll_to_image();
      },
      fit_horizontal: () => {
        scale_image(SCALE_MODES.HORIZONTAL, true);
        scroll_to_image();
      },
      fit_vertical: () => {
        scale_image(SCALE_MODES.VERTICAL, true);
        scroll_to_image();
      },
      open_similar: () => {
        if (PostPage.post_id === null) {
          show_notice(console.error, 'addon error: no post id, report to author!');
          return;
        }
        open_in_tab(window.location.origin + '/posts/similar?id=' + PostPage.post_id);
      },
      open_delete: () => {
        if (!found_delete_action) {
          show_notice(console.error, 'addon error: Delete action not found, no permission?');
        } else {
          if (PostPage.post_id === null) {
            show_notice(console.error, 'addon error: no post id, report to author!');
            return;
          }
          open_in_tab(window.location.origin + '/posts/delete/' + PostPage.post_id);
        }
      },
      add_translation: () => {
        unsafeWindow.Note.create();
      },
      copy_translations: () => {
        copy_translations();
      },
      paste_translations: () => {
        paste_translations();
      },
    },
    indexpage: {}
  };

  for (const mode of Object.keys(POST_MODE_DESCRIPTIONS)) {
    HOTKEY_ACTIONS.indexpage[`${mode}_mode`] = () => select_mode(mode);
  }

  for (let i = 1; i <= 10; i++) {
    HOTKEY_ACTIONS.indexpage[`select_tagscript_preset${i}`] = () => {
      const dropdown = document.getElementById('tagscript_presets_dropdown');
      dropdown.selectedIndex = i;
      dropdown.dispatchEvent(new Event('change'));
    };
  }

  function get_hotkey_action(action_name) {
    for (const actions of Object.values(HOTKEY_ACTIONS)) {
      const action = actions[action_name];
      if (action) {
        return action;
      }
    }

    throw new Error(`Hotkey ${action_name} not found`);
  }

  class Hotkey {
    constructor(action_name, key, modifiers) {
      this.key = key;
      this.modifiers = modifiers ?? new Set();
      this.action_name = action_name;
      this.action = get_hotkey_action(action_name);
    }

    call(e) {
      if (e.key.toLowerCase() === this.key
        && this.modifiers.has('ctrl') === e.ctrlKey
        && this.modifiers.has('alt') === e.altKey
        && this.modifiers.has('shift') === e.shiftKey) {
        this.action();
      }
    }
  }

  const DEFAULT_CONFIG = {
    scroll_to_image: true,
    scale_image: true, // and video
    scale_only_downscale: false,
    scale_flash: false,
    scale_mode: 0,
    scale_on_resize: false,
    scroll_to_image_center: true,
    load_highres: false,
    highres_limit: 4000000, // bytes
    video_pause: false,
    video_mute: true,
    set_video_volume: false,
    video_volume: 50,
    video_controls: true,
    redirect_v_to_s_server: false,
    show_speaker_icon: false,
    show_animated_icon: false,
    show_ratings_icon: false,
    post_border_style: 0,
    custom_style: true,
    thumbnail_size: 208,
    enlarge_navbar: false,
    setparent_deletepotentialduplicate: false,
    editform_deleteuselesstags: false,
    hide_headerlogo: false,
    tag_search_buttons: true,
    tag_post_counts: true,
    or_tag_search_button: false,
    tag_menu: true,
    tag_menu_scale: '30%',
    tag_menu_layout: 1,
    common_tags_json: DEFAULT_TAGLIST,
    common_tags_json_idol: '[ {"name":"test tags", "tags":["tag1 tag2", ["grouped_tag1 grouped_tag2"], "tag3 tag4"] }, { "tags":[ "next_line tag5 tag6", ["grouped_tag3 grouped_tag4"] , "tag7 tag8"] }, {"name":"another\u00A0category", "tags":["t1 t2 t3"]} ]',
    view_history_enabled: false,
    view_history: new Set(),
    view_history_idol: new Set(),
    wiki_template: '',
    record_template:
      `[
  [
    "Poor Tagging - neutral",
    "Hello.\\n\\nPlease comply with our [[uploading rules]] when making new posts. [##]% of your posts do not have enough tags to get rid of their tagme status.\\n\\nIf you need help figuring out what tags to add, there's a great [[tag checklist]] that will give you lots of tags to add.\\n\\nUntil you correct this issue, I'll have to request that you not upload anything else. A failure to comply with our tagging standards can result in further staff action against your account.\\n\\nAs an extra bit of information, we require 13 general tags on color posts and 7 general tags on [[monochrome]] posts to avoid records such as this one.",
    "neutral"
  ]
]`,
    tagscript_presets:
      `[
  [
    "Remove potential_duplicate",
    "-potential_duplicate"
  ],
  [
    "futanari -> newhalf",
    "newhalf -futanari -full-package_futanari"
  ]
]`,
    tag_category_collapser: false,
    tag_category_collapser_style: 1,
    collapsed_tag_categories: new Set(),
    move_stats_to_edit_form: false,
    postpage_hotkeys: [
      new Hotkey('reset_size', 'h'),
      new Hotkey('fit_size', 'g'),
      new Hotkey('fit_horizontal', 'g', new Set(['shift'])),
      new Hotkey('fit_vertical', 'g', new Set(['alt'])),
      //new Hotkey('open_similar', 's'),
      //new Hotkey('open_delete', 'd'), // site: shift+d
      //new Hotkey('add_translation', 't'), // site: n
      new Hotkey('copy_translations', 'c'),
      new Hotkey('paste_translations', 'v'),
    ],
    indexpage_hotkeys: [
      new Hotkey('set-parent_mode', 'v'),
      new Hotkey('choose-parent_mode', 'c'),
      new Hotkey('rating-s_mode', 's'),
      new Hotkey('rating-q_mode', 'q'),
      new Hotkey('rating-e_mode', 'e'),
    ],
    notes: [],
    save_tag_categories: true,
    tag_categories: new Map(),
    tag_category_colors: new Map(),
    use_old_wiki: false,
    use_old_pools: false,
    use_old_tags_index: false,
  };

  for (let i = 1; i <= 10; i++) {
    const key = i < 10 ? String(i) : '0';
    DEFAULT_CONFIG.indexpage_hotkeys.push(new Hotkey(`select_tagscript_preset${i}`, key));
  }

  const KEY_PREFIX = 'config.'; // used to avoid conflicts in localStorage and config element ids

  const config = Object_clone(DEFAULT_CONFIG); // load default

  // applied to loaded/set config entries (to e.g. fix config elements returning strings when we need numbers)
  const CONFIG_FIXER = {
    scale_mode: Number,
    tag_menu_layout: Number,
    tag_category_collapser_style: Number,
    highres_limit: Number,
    post_border_style: Number,
    thumbnail_size: Number,
  };

  function fix_config_entry(key, value) {
    const fixer = CONFIG_FIXER[key];
    return (fixer !== undefined ? fixer(value) : value);
  }

  // permanently save setting (and broadcast to other tabs)
  function save_setting(key, value) {
    value = fix_config_entry(key, value);

    if (HAS_MONKEY_STORAGE) {
      GM.setValue(key, JSON_stringify(value, json_replacer)).catch((reason) => {
        show_notice(console.error, `addon error: couldn't save setting "${key}", check console`, reason);
      });

      // use localStorage too if we don't have a change listener
      if (GM.addValueChangeListener) return;
    }

    if (!HAS_LOCAL_STORAGE) {
      show_notice(console.warn, `[addon] couldn't save setting "${KEY_PREFIX + key}" to localStorage. check permissions`);
      return;
    }

    try {
      localStorage.setItem(KEY_PREFIX + key, JSON_stringify(value, json_replacer));
    } catch (error) {
      show_notice(console.error, `[addon error] couldn't save setting "${KEY_PREFIX + key}" to localStorage, check console`, error);
    }
  }

  async function load_config() {
    const monkey_values = {};

    if (HAS_MONKEY_STORAGE) {
      const promises = [];
      for (const key of Object.keys(config)) {
        promises.push(GM.getValue(key).then((value) => {
          monkey_values[key] = value;
        }));
      }

      await Promise.all(promises);
    }

    for (const key of Object.keys(config)) {
      let value = config[key]; // default already loaded

      let stored_value = monkey_values[key];

      if (stored_value === undefined && HAS_LOCAL_STORAGE)
        stored_value = localStorage.getItem(KEY_PREFIX + key);

      if (stored_value !== undefined && stored_value !== null) {
        try {
          value = JSON.parse(stored_value, json_reviver);

          // "migrate" from old hotkey format by resetting to default
          if ((key === 'postpage_hotkeys' || key === 'indexpage_hotkeys') && !Array.isArray(value)) {
            reset_setting(key);
            continue;
          }
        } catch (error) {
          show_notice(console.error, `[addon error] couldn't load setting "${key}"`, error);
        }
      }

      update_setting(key, value); // fire regardless
    }
  }

  function storage_changed(key, old_value, new_value, remote) {
    try {
      if (!remote) return; // only listen to other tabs

      if (new_value === undefined || new_value === null) {
        // entry was removed, reset setting to default
        update_setting(key, Object_clone(DEFAULT_CONFIG[key]));
      } else {
        // entry was added or changed
        const value = JSON.parse(new_value, json_reviver);

        // workaround for post view history race condition
        if (key === HISTORY_KEY) {
          const new_ids = Set_difference(value, config[key]);
          if (new_ids.size === 0) return;

          // integrate newly received post ids into view history
          config[key] = Set_union(value, config[key]);

          // save new view history and broadcast it to other tabs,
          // which in turn might broadcast their ids back to us
          save_setting(key, value);

          // live update thumbnails
          if (!is_personal_post_page()) {
            for (const id of new_ids) {
              const thumbs = General.thumbnail_cache.get(id);
              if (thumbs === undefined) continue;

              for (const thumb of thumbs)
                fadeout_post(thumb);
            }
          }

          return; // don't call update_setting()
        }

        update_setting(key, value);
      }
    } catch (error) {
      show_notice(console.error, 'storage_changed() failed, check console', error);
    }
  }

  // localStorage from other tabs changed
  function local_storage_changed(e) {
    if (e.storageArea !== localStorage) return;
    if (e.key === null) return; // ignore external localStorage.clear() for now

    // only look at SankakuAddon specific changes
    if (!e.key.startsWith(KEY_PREFIX)) return;
    const key = e.key.substring(KEY_PREFIX.length);

    storage_changed(key, e.oldValue, e.newValue, true);
  }

  function update_setting(key, value) {
    config[key] = fix_config_entry(key, value);

    if (key === 'thumbnail_size') {
      update_css_vars();
    } else if (key === 'scale_on_resize') {
      if (value) add_scale_on_resize_listener();
      else       remove_scale_on_resize_listener();
    }

    update_config_dialog_by_key(key);

    if (key === 'hide_headerlogo') {
      update_headerlogo();
    } else if (key === 'collapsed_tag_categories') {
      for (const category of collapser_map.keys())
        collapse_tag_category(category, config.collapsed_tag_categories.has(category), false);
    }
  }

  function reset_setting(key) {
    if (HAS_MONKEY_STORAGE) GM.deleteValue(key);
    if (HAS_LOCAL_STORAGE) localStorage.removeItem(KEY_PREFIX + key); // also delete if USE_MONKEY_STORAGE
    update_setting(key, Object_clone(DEFAULT_CONFIG[key]));
  }

  function reset_config() {
    for (const key of Object.keys(config)) {
      // don't clear the history so the clear history button makes more sense
      if (key === 'view_history' || key === 'view_history_idol') continue;
      // don't reset the common tags list of the other site
      if (key === OTHER_COMMON_TAGS_KEY) continue;

      reset_setting(key);
    }
  }


  // templates for the config dialog
  const CONFIG_TABS_TEMPLATE = {
    general: {
      name: 'General',
      categories: ['post', 'general'],
    },
    editing: {
      name: 'Editing',
      categories: ['editing'],
    },
    hotkeys: {
      name: 'Hotkeys',
      categories: ['postpage_hotkeys', 'indexpage_hotkeys'],
    },
  };

  const CONFIG_CATEGORY_TEMPLATE = {
    post: {
      name: 'Image/Video',
      entries: [
        'scroll_to_image',
        'scroll_to_image_center',
        'scale_image',
        'scale_only_downscale',
        'scale_flash',
        'scale_on_resize',
        'scale_mode',
        'load_highres',
        'video_pause',
        'video_mute',
        'set_video_volume',
        'video_controls',
        'redirect_v_to_s_server',
      ],
    },
    general: {
      name: 'General',
      entries: [
        'tag_search_buttons',
        'or_tag_search_button',
        'tag_post_counts',
        'tag_category_collapser',
        'tag_category_collapser_style',
        'show_speaker_icon',
        'show_animated_icon',
        'show_ratings_icon',
        'view_history_enabled',
        'post_border_style',
        'custom_style',
        'thumbnail_size',
        'enlarge_navbar',
        'hide_headerlogo',
      ],
    },
    editing: {
      name: 'Editing',
      entries: [
        'use_old_wiki',
        'use_old_pools',
        'use_old_tags_index',
        'move_stats_to_edit_form',
        'setparent_deletepotentialduplicate',
        'editform_deleteuselesstags',
        'tag_menu',
        COMMON_TAGS_KEY,
        'tag_menu_layout',
        'save_tag_categories',
        'wiki_template',
        'record_template',
        'tagscript_presets',
      ],
    },
    postpage_hotkeys: {
      name: 'Post Page Hotkeys',
      entries: [],
    },
    indexpage_hotkeys: {
      name: 'Index Page Hotkeys',
      entries: [],
    },
  };

  // expand hotkeys
  for (const [page, actions] of Object.entries(HOTKEY_ACTIONS)) {
    for (const name of Object.keys(actions)) {
      CONFIG_CATEGORY_TEMPLATE[`${page}_hotkeys`].entries.push(`${page}_hotkeys.${name}`);
    }
  }

  const SETTINGS_TEMPLATE = {
    scroll_to_image:                    {type: 'checkbox', desc: 'Scroll to image/video when opening post'},
    scroll_to_image_center:             {type: 'checkbox', desc: 'Scroll to center of image/video, else scroll to top'},
    scale_image:                        {type: 'checkbox', desc: 'Scale image/video when opening post'},
    scale_only_downscale:               {type: 'checkbox', desc: 'Only downscale'},
    scale_flash:                        {type: 'checkbox', desc: 'Also scale flash videos'},
    scale_on_resize:                    {type: 'checkbox', desc: 'Scale image on window resize', title: 'This uses the \'scale image mode\' setting, so it doesn\'t work well when using the manual scaling actions.'},
    scale_mode:                         {type: 'select',   desc: 'Scale image/video mode: ', options: {0: 'Fit to window', 1: 'Fit horizontally', 2: 'Fit vertically'}},
    load_highres:                       {type: 'checkbox', desc: 'Load original image if smaller than ', title: 'Set to 0 bytes to always load'},
    video_pause:                        {type: 'checkbox', desc: 'Pause (non-flash) videos'},
    video_mute:                         {type: 'checkbox', desc: 'Mute (non-flash) videos'},
    set_video_volume:                   {type: 'checkbox', desc: 'Set (non-flash) video volume to: '},
    video_controls:                     {type: 'checkbox', desc: 'Show video controls'},
    redirect_v_to_s_server:             {type: 'checkbox', desc: 'Redirect v.sankakucomplex.com to s.sankakucomplex.com'},
    tag_post_counts:                    {type: 'checkbox', desc: 'Add old style post tag counts'},
    tag_search_buttons:                 {type: 'checkbox', desc: 'Enable + - tag search buttons'},
    or_tag_search_button:               {type: 'checkbox', desc: 'Also add ~ tag search button'},
    show_speaker_icon:                  {type: 'checkbox', desc: `Show ${SPEAKER_SVG} icon on thumbnail if it has audio`},
    show_animated_icon:                 {type: 'checkbox', desc: `Show ${ANIMATED_SVG} icon on thumbnail if it is animated (${SPEAKER_SVG}  overrides ${ANIMATED_SVG} )`},
    show_ratings_icon:                  {type: 'checkbox', desc: `Show ratings icon (${SAFE_SVG}, ${QUESTIONABLE_SVG}, ${EXPLICIT_SVG}) on post thumbnails`},
    view_history_enabled:               {type: 'checkbox', desc: 'Fade out thumbnails of viewed posts (enables post view history)'},
    post_border_style:                  {type: 'select',   desc: 'Post border style: ', options: {0: 'Prioritize blue \'unapproved\' border', 1: 'Priorizite yellow/green \'has parent / children\' borders', 2: 'Show both borders'}},
    custom_style:                       {type: 'checkbox', desc: 'Custom thumbnail grid style', title: 'Previously known as \'Sankaku...Something\' userstyle'},
    thumbnail_size:                     {type: 'range',    desc: 'Thumbnail size for custom style: ', min: 30, max: 330},
    setparent_deletepotentialduplicate: {type: 'checkbox', desc: 'Delete potential_duplicate tag when using "Set Parent"'},
    enlarge_navbar:                     {type: 'checkbox', desc: 'Enlarge navbar', title: 'Makes it easier to reach far options without accidentally closing the subnav.'},
    editform_deleteuselesstags:         {type: 'checkbox', desc: '"Save changes" button deletes useless_tags tag'},
    tag_category_collapser:             {type: 'checkbox', desc: 'Enable tag category collapsers on post pages'},
    tag_category_collapser_style:       {type: 'select',   desc: 'Tag category collapser style: ', options: {0: 'Compact', 1: 'Compact category name', 2: 'Default category name'}},
    hide_headerlogo:                    {type: 'checkbox', desc: 'Hide header logo'},
    tag_menu:                           {type: 'checkbox', desc: 'Activate tag menu'},
    [COMMON_TAGS_KEY]:                  {type: 'text',     desc: 'Common tags list (JSON format):'},
    tag_menu_layout:                    {type: 'select',   desc: 'Tag menu layout: ', options: {0: 'Normal', 1: 'Vertically compact'}},
    save_tag_categories:                {type: 'checkbox', desc: 'Save tag color information for use in tag menu'},
    wiki_template:                      {type: 'text',     desc: 'Wiki template:', title: 'Text that will be be shown in a separate textarea on wiki add/edit pages so it can easily be copied.'},
    record_template:                    {type: 'text',     desc: 'Record templates (JSON format):', title: 'A list of templates to be chosen from a dropdown menu on the record add page, each entry has a title followed by the actual content.'},
    tagscript_presets:                  {type: 'text',     desc: 'Tag script presets (JSON format):', title: 'A list of tag scripts to be chosen from a dropdown menu below "Mode" (put [] to disable).'},
    move_stats_to_edit_form:            {type: 'checkbox', desc: 'Move post "Details" to the right of the edit form'},
    use_old_wiki:                       {type: 'checkbox', desc: 'Use old wiki where possible'},
    use_old_pools:                      {type: 'checkbox', desc: 'Use old pools instead of books (read-only)'},
    use_old_tags_index:                 {type: 'checkbox', desc: 'Use old tags index'},
    // TODO this is a mess
    'postpage_hotkeys.reset_size':      {type: 'hotkey',   desc: 'Reset Image Size'},
    'postpage_hotkeys.fit_size':        {type: 'hotkey',   desc: 'Fit Image'},
    'postpage_hotkeys.fit_horizontal':  {type: 'hotkey',   desc: 'Fit Image (Horizontal)'},
    'postpage_hotkeys.fit_vertical':    {type: 'hotkey',   desc: 'Fit Image (Vertical)'},
    'postpage_hotkeys.open_similar':    {type: 'hotkey',   desc: 'Find Similar'},
    'postpage_hotkeys.open_delete':     {type: 'hotkey',   desc: 'Delete Post'},
    'postpage_hotkeys.add_translation': {type: 'hotkey',   desc: 'Add Translation'},
    'postpage_hotkeys.copy_translations':  {type: 'hotkey',   desc: 'Copy Translations'},
    'postpage_hotkeys.paste_translations': {type: 'hotkey',   desc: 'Paste Translations'},
  };

  for (const [mode, desc] of Object.entries(POST_MODE_DESCRIPTIONS)) {
    SETTINGS_TEMPLATE[`indexpage_hotkeys.${mode}_mode`] = {type: 'hotkey', desc: desc + ' mode'};
  }

  for (let i = 1; i <= 10; i++) {
    SETTINGS_TEMPLATE[`indexpage_hotkeys.select_tagscript_preset${i}`] = {type: 'hotkey', desc: `Select Tag Script Template #${i}`};
  }

  // whether a config element's value are accessed via '.value' (or otherwise '.checked')
  function is_value_element(key) {
    // hardcoded elements
    if (key === 'video_volume')   return true;
    if (key === 'highres_limit')  return true;
    if (key === 'tag_menu_scale') return true; // doesn't exist as an element, but it would be '.value' type

    const type = SETTINGS_TEMPLATE[key].type;
    return (type === 'select' || type === 'range' || type === 'text');
  }

  // calls f(cfg_elem, key, get_value) for each existing config element
  function foreach_config_element(f) {
    for (const key of Object.keys(config)) {
      const cfg_elem = document.getElementById(KEY_PREFIX + key);
      if (cfg_elem === null) continue;

      if (is_value_element(key)) f(cfg_elem, key, () => cfg_elem.value);
      else                       f(cfg_elem, key, () => cfg_elem.checked);
    }
  }

  function update_config_dialog_by_key(key) {
    if (key.endsWith('_hotkeys')) {
      update_hotkeys(key.slice(0, -'_hotkeys'.length));
      return;
    }

    const cfg_elem = document.getElementById(KEY_PREFIX + key);
    if (cfg_elem !== null) {
      if (is_value_element(key)) cfg_elem.value   = config[key];
      else                       cfg_elem.checked = config[key];
    }
  }

  function update_config_dialog() {
    for (const key of Object.keys(config)) update_config_dialog_by_key(key);
  }

  function update_headerlogo() {
    hide_headerlogo(config.hide_headerlogo);
  }

  function is_config_dialog_visible() {
    return document.getElementById('cfg_dialog').style.display !== 'none';
  }

  function show_config_dialog(bool) {
    document.getElementById('cfg_dialog').style.display = (bool ? 'block' : 'none');
  }


  /********************/
  /* helper functions */
  /********************/

  const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

  class Tags { // thin wrapper around Set
    tags;

    constructor(tag_str) {
      tag_str ??= '';
      this.tags = new Set(tag_str.trim().split(/\s+/).filter(t => t.length !== 0));
    }

    static invert(tag) {
      const minus = tag.startsWith('-');
      return minus ? tag.substring(1) : `-${tag}`;
    }

    has(tag) {
      return this.tags.has(tag);
    }

    add(tag) {
      this.tags.add(tag);
      this.tags.delete(Tags.invert(tag));
    }

    remove(tag) {
      this.tags.delete(tag);
    }

    toggle(tag) {
      if (this.has(tag)) {
        this.remove(tag);
      } else {
        this.add(tag);
      }
    }

    filter(pred) {
      this.tags = new Set([...this.tags].filter(pred));
      return this;
    }

    [Symbol.iterator]() {
      return this.tags.values();
    }

    toArray() {
      return [...this.tags];
    }

    toString() {
      return [...this.tags].join(' ');
    }
  }

  function set_cookie(name, value, valid_for_days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (valid_for_days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
  }

  function get_cookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const kv = cookie.split('=');
      if (kv.length === 2 && kv[0].trim() === name) {
        return decodeURIComponent(kv[1]);
      }
    }
    return '';
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // helper function to modify nodes on creation
  function modify_nodes(node_selector, node_modifier, root_selector) {
    // MutationObserver (with childList: true, subtree: true) will observe every single node from the HTML as "added",
    // but for script-inserted node trees, only the root node is counted.
    // As a workaround, all subnodes of nodes matching root_selector will be checked manually

    const observer = new MutationObserver(mutations => {
      // for each added element
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;

          // check for match
          if (node.matches(node_selector) && node_modifier(node, observer)) { // are we done?
            observer.disconnect();
            return;
          }

          // check all subnodes of nodes matching root_selector
          if (root_selector && node.matches(root_selector)) {
            for (const subnode of node.getElementsByTagName('*')) {
              if (subnode.matches(node_selector) && node_modifier(subnode, observer)) {
                observer.disconnect();
                return;
              }
            }
          }
        }
      }
    });

    observer.observe(document, { childList: true, subtree: true });

    // it's possible we are too late to observe the element's construction, so look for it afterwards immediately
    for (const node of document.querySelectorAll(node_selector)) {
      if (node_modifier(node, observer)) {
        observer.disconnect();
        break;
      }
    }
  }

  // call adjust_css() as early as possible
  function modify_css() {
    const try_adjust_css = () => {
      if (document.body !== null) { // wait for body to guarantee head was loaded
        observer.disconnect();
        adjust_css();
      }
    };

    const observer = new MutationObserver(try_adjust_css);
    observer.observe(document, { childList: true, subtree: true });
    try_adjust_css();
  }

  function get_scrollbar_width() {
    const div = document.createElement('DIV');
    div.style.overflow = 'scroll';
    document.body.appendChild(div);
    const scrollbar_width = div.offsetWidth - div.clientWidth;
    div.remove();
    return scrollbar_width;
  }

  // (almost) deepclone an object
  function Object_clone(obj) {
    if (typeof obj === 'object') {
      // shallow clone containers
      if (obj instanceof Array) return [...obj];
      if (obj instanceof Set) return new Set(obj);
      if (obj instanceof Map) return new Map(obj);
      if (obj instanceof Hotkey) return new Hotkey(obj.action_name, obj.key, new Set(obj.modifiers));

      const new_obj = {};
      for (const [key, value] of Object.entries(obj))
        new_obj[key] = Object_clone(value);
      return new_obj;
    }

    return obj;
  }

  function Set_difference(a, b) {
    return new Set([...a].filter((x) => !b.has(x)));
  }

  function Set_union(a, b) {
    return new Set([...a, ...b]);
  }

  function insert_node_after(node, ref_node) {
    ref_node.parentNode.insertBefore(node, ref_node.nextSibling);
  }

  function get_resolution(obj) {
    if (obj.src === 'about:blank') return null;

    // natural size only for images, can be 0 when not yet loaded
    // note: when src is changed, this can read the old size
    if (obj.naturalWidth && obj.naturalHeight) {
      return [obj.naturalWidth, obj.naturalHeight];
    }

    if (obj.videoWidth && obj.videoHeight) {
      return [obj.videoWidth, obj.videoHeight];
    }

    return null;
  }

  function show_notice(logFunc, ...msg) {
    unsafeWindow.notice?.(msg[0]);
    logFunc?.(...msg);
  }

  function get_original_background_color() {
    // the background-color style gets changed through the (site)script, but we need the original one
    // there has to be a better way than this, right?
    const current = window.getComputedStyle(document.body).getPropertyValue('background-color');
    document.body.style.removeProperty('background-color');
    const original = window.getComputedStyle(document.body).getPropertyValue('background-color');
    document.body.style.backgroundColor = current;
    return original;
  }

  // "rgb(r,g,b)" -> [int(r), int(g), int(b)]
  function rgb_to_array(rgb) {
    const arr = rgb.substring(rgb.indexOf('(') + 1, rgb.lastIndexOf(')')).split(/,\s*/);
    for (let i = 0; i < arr.length; i++)
      arr[i] = parseInt(arr[i], 10);
    return arr;
  }

  function rgb_array_is_dark(rgb_array) {
    let avg = 0;
    for (let i = 0; i < rgb_array.length; i++)
      avg += rgb_array[i];
    avg /= rgb_array.length;

    return (avg <= 128);
  }

  function rgb_array_shift(rgb, shift) {
    const shifted = [];
    for (let i = 0; i < 3; i++)
      shifted.push(Math.min(Math.max(rgb[i] + shift, 0), 255));

    return shifted;
  }

  // [r, g, b] -> "rgb(r,g,b)"
  function rgb_array_to_rgb(rgb) {
    if (rgb.length === 3)
      return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
    return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + rgb[3] + ')';
  }

  function is_darkmode() {
    const theme = get_cookie('theme');
    if (theme !== '' && Number(theme) !== 0)
      return true;

    // fallback
    const rgb = rgb_to_array(get_original_background_color());
    return rgb_array_is_dark(rgb);
  }

  // helper function to adjust background colors based on light or dark mode
  function shifted_backgroundColor(shift) {
    const rgb = rgb_to_array(get_original_background_color());
    const shifted_rgb = rgb_array_shift(rgb, (is_darkmode() ? 1 : -1) * shift);
    return rgb_array_to_rgb(shifted_rgb);
  }

  function create_popup_menu() {
    const popup = document.createElement('DIV');
    popup.style.display = 'none';
    popup.style.padding = '6px 12px 6px 12px';
    popup.style.border = '1px solid ' + shifted_backgroundColor(32);
    popup.style.backgroundColor = get_original_background_color();
    // fixed, centered div
    popup.style.top  = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.position = 'fixed';
    popup.style.zIndex = '10002';
    // scroll bars if too large (resizing textareas behaves a bit weirdly on Chrome because it sets margins)
    popup.style.minWidth  = '30vw';
    popup.style.maxWidth  = '90vw';
    popup.style.maxHeight = '90vh';
    popup.style.overflow = 'auto';
    return popup;
  }


  /**************************/
  /* general site functions */
  /**************************/

  class Page {
    static Index     = Symbol('index/similar');
    static Upload    = Symbol('upload');
    static Post      = Symbol('post');
    static Pool      = Symbol('pool');
    static WikiNew   = Symbol('wiki new');
    static WikiEdit  = Symbol('wiki edit');
    static WikiShow  = Symbol('wiki show');
    static Tag       = Symbol('tag edit');
    static TagIndex  = Symbol('tag index');
    static Moderate  = Symbol('moderate');
    static Delete    = Symbol('delete');
    static User      = Symbol('user');
    static AddRecord = Symbol('add user record');
  }

  class General {
    static page;
    static thumbnail_cache = new Map(); // id -> array of thumbnail elements
  }

  class IndexPage {
    static has_tag_scripts;

    static init() {
      if (General.page !== Page.Index) return;

      IndexPage.has_tag_scripts = (document.querySelector('#mode > option[value=apply-tag-script]') !== null);
    }
  }

  class PostPage {
    static post_id = null;
    static parent_id = null;

    static init() {
      if (General.page !== Page.Post) return;

      PostPage.post_id = document.getElementById('hidden_post_id')?.innerText;
      PostPage.parent_id = document.getElementById('post_parent_id')?.value;
    }
  }

  class WikiPage {
    static tag = null;

    static init() {
      if (![Page.WikiNew, Page.WikiEdit, Page.WikiShow].includes(General.page)) return;

      // /wiki/edit?title=<tag>
      const params = new URL(window.location.href).searchParams;
      const title = params.get('title');
      if (title) {
        WikiPage.tag = title;
      } else {
        // /wiki/<tag> or potentially /wiki/<tag>/edit
        const pathname = window.location.pathname;
        const a = pathname.lastIndexOf('/wiki/') + 6;
        let b = pathname.indexOf('/', a + 1);
        if (b === -1) b = pathname.length;
        WikiPage.tag = decodeURIComponent(pathname.substring(a, b));
      }
    }
  }

  class PoolPage {
    static pool_id = null;

    static init() {
      if (General.page !== Page.Pool) return;

      PoolPage.pool_id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    }
  }


  function get_search_url(tags) {
    const url = new URL(window.location.origin);
    const params = new URLSearchParams();
    params.append('tags', tags);
    url.search = params.toString();
    return url.href;
  }

  function get_search_tags(location) {
    location ??= window.location;
    return new Tags(new URL(location.href).searchParams.get('tags'));
  }

  function get_username() { // won't work on every page
    // read from the 'My Favorites' button (in one of the subnavs) in the navbar
    for (const a of document.querySelectorAll('#navbar a')) {
      if (typeof a.href !== 'string') continue;

      for (const tag of new Tags(new URL(a.href).searchParams.get('tags'))) {
        if (tag.startsWith('fav:')) {
          return tag.substring('fav:'.length);
        }
      }
    }

    return null;
  }

  // is own uploads or favorites page
  let personal_cache = null;
  function is_personal_post_page() {
    if (personal_cache !== null) return personal_cache;

    const username = get_username();
    if (username === null) {
      personal_cache = false;
      return false;
    }

    const tags = get_search_tags();
    personal_cache = tags.has('fav:' + username) || tags.has('user:' + username);
    return personal_cache;
  }

  function hide_headerlogo(hide) {
    const logo = document.querySelector('#header .top-bar');
    const news = document.querySelector('#header .carousel');
    if (hide) {
      if (logo) logo.style.display = 'none';
      if (news) news.style.display = 'none';
    } else {
      if (logo) logo.style.removeProperty('display');
      if (news) news.style.removeProperty('display');
    }
  }

  function add_config_dialog() {
    const cfg_dialog = create_popup_menu();
    cfg_dialog.style.zIndex = '10010';
    cfg_dialog.id = 'cfg_dialog';

    // generate the content of the config menu
    let innerDivHTML = `<div style='font-weight: bold; margin-bottom: 6px;'>SankakuAddon ${VERSION}</div>`;
    // + `<hr style='margin-top: 0; margin-bottom: 2px; border:1px solid ${shifted_backgroundColor(32)};'>`;

    // add tabs, TODO: they're ugly especially in dark mode
    innerDivHTML += '<div id="cfg_tabs" style="display: flex; white-space: nowrap;">';
    for (const [key, value] of Object.entries(CONFIG_TABS_TEMPLATE))
      innerDivHTML += `<button id="cfg_tab_${key}" style="border-style: solid; padding: 0 2px 0 2px; margin: 0 2px 0 2px; background-color: transparent; border-bottom-width: 0; cursor: pointer">${value.name}</button>`;
    innerDivHTML += '</div>';

    // add bodies
    for (const [body_key, body] of Object.entries(CONFIG_CATEGORY_TEMPLATE)) {
      innerDivHTML += `<div id="cfg_body_${body_key}" style="background-color: rgba(128, 128, 128, 0.1); margin-bottom: 4px; padding: 0 4px 2px 4px;">`
        + `<h5>${body.name}</h5>`;

      // add config elements for each body
      for (const key of body.entries) {
        const value = SETTINGS_TEMPLATE[key];

        if (value === undefined) {
          console.error(`couldn't find SETTINGS_TEMPLATE[${key}]`);
          continue;
        }

        const generate_span = () => `<span style="vertical-align: middle; ${value.title ? 'cursor:help; text-decoration: underline dashed; ' : ''}" `
          + `${value.title ? `title="${value.title}"` : ''} >${value.desc}</span>`;

        innerDivHTML += '<div>';
        switch (value.type) {
          case 'checkbox':
            innerDivHTML += `<input id='${KEY_PREFIX}${key}' type='checkbox' style='vertical-align: middle; margin: 3px 4px 3px 4px;'>`;
            innerDivHTML += generate_span();
            // hardcoded elements:
            innerDivHTML += (key === 'set_video_volume' ? `<input id="${KEY_PREFIX}video_volume" type="number" min="0" max="100" size="4">%` : '');
            innerDivHTML += (key === 'load_highres' ? `<input id="${KEY_PREFIX}highres_limit" type="number" min="0" max="4000000" size="10"> bytes` : '');
            break;
          case 'select':
            innerDivHTML += generate_span();
            innerDivHTML += `<select id="${KEY_PREFIX}${key}">`;
            for (const [k, v] of Object.entries(value.options))
              innerDivHTML += `<option value="${k}">${v}</option>`;
            innerDivHTML += '</select>';
            break;
          case 'range':
            innerDivHTML += generate_span();
            innerDivHTML += `<input id="${KEY_PREFIX}${key}" type="range" min="${value.min}" max="${value.max}" style="vertical-align: middle;">`;
            break;
          case 'text':
            innerDivHTML += generate_span();
            innerDivHTML += `<textarea id="${KEY_PREFIX}${key}" rows=8 style='width: 100%; box-sizing: border-box; max-width: unset; margin-top: 0;'></textarea>`;
            break;
          case 'hotkey':
            innerDivHTML += `<input id='${KEY_PREFIX}${key}_ctrl' type='checkbox' style='vertical-align: middle; margin: 3px 4px 3px 4px;'>`;
            innerDivHTML += '<span style="vertical-align: middle;">ctrl</span>';
            innerDivHTML += `<input id='${KEY_PREFIX}${key}_alt' type='checkbox' style='vertical-align: middle; margin: 3px 4px 3px 4px;'>`;
            innerDivHTML += '<span style="vertical-align: middle;">alt</span>';
            innerDivHTML += `<input id='${KEY_PREFIX}${key}_shift' type='checkbox' style='vertical-align: middle; margin: 3px 4px 3px 4px;'>`;
            innerDivHTML += '<span style="vertical-align: middle;">shift</span>';
            innerDivHTML += `<input id='${KEY_PREFIX}${key}_key' type='text' maxLength='1' size='1' style='vertical-align: middle; margin: 3px 4px 3px 4px;'>`;
            innerDivHTML += generate_span();
            break;
          default:
            show_notice(console.error, '[addon error] CONFIG_TEMPLATE is defective!', value.type);
            continue;
        }
        innerDivHTML += '</div>';
      }

      innerDivHTML += '</div>';
    }

    innerDivHTML += '<div style="padding: 2px">';
    innerDivHTML +=  '<button id="config_close" style="cursor: pointer; margin-right: 6px">Close</button>';
    innerDivHTML +=  '<button id="config_reset" style="cursor: pointer;" title="Resets all settings to default (but doesn\'t clear post history)">Reset settings</button>';
    innerDivHTML +=  '<button id="history_clear" style="cursor: pointer;" title="Clears the post view history for the current site (chan or idol)">Clear post view history</button>';
    innerDivHTML += '</div>';
    innerDivHTML += '<div style="padding: 2px">&nbsp;Most settings require a page reload.</div>';

    cfg_dialog.innerHTML = innerDivHTML;

    // adjust inline SVG icons
    for (const svg of cfg_dialog.querySelectorAll('svg')) {
      svg.style.width = '1rem';
      svg.style.verticalAlign = 'middle';
    }

    document.body.appendChild(cfg_dialog);

    // hide non-default categories
    for (const [other_tab_name, other_tab] of Object.entries(CONFIG_TABS_TEMPLATE)) {
      if (other_tab_name !== 'general') {
        for (const category of other_tab.categories)
          document.getElementById(`cfg_body_${category}`).style.display = 'none';
      }
    }

    // add events
    document.getElementById('config_close').onclick = () => { show_config_dialog(false); return false; };
    document.getElementById('config_reset').onclick = () => {
      if (window.confirm('Are you sure?\nThis will reset ALL settings, including templates and the tag menu tags!')) {
        reset_config();
        show_notice(console.log, '[addon] reset all settings');
      }
      return false;
    };
    document.getElementById('history_clear').onclick = () => {
      if (window.confirm('Are you sure you want to clear the post view history?')) {
        reset_setting(HISTORY_KEY);
        show_notice(console.log, '[addon] reset post view history');
      }
      return false;
    };

    // tab events
    for (const [tab_name, tab] of Object.entries(CONFIG_TABS_TEMPLATE)) {
      document.getElementById(`cfg_tab_${tab_name}`).onclick = () => {
        // hide categories of other tabs
        for (const [other_tab_name, other_tab] of Object.entries(CONFIG_TABS_TEMPLATE)) {
          if (other_tab_name !== tab_name) {
            for (const category of other_tab.categories) {
              document.getElementById(`cfg_body_${category}`).style.display = 'none';
            }
          }
        }

        // show categories for given tab
        for (const category of tab.categories) {
          document.getElementById(`cfg_body_${category}`).style.display = 'block';
        }
      };
    }

    foreach_config_element((cfg_elem, key, get_value) => {
      cfg_elem.addEventListener('change', () => {
        update_setting(key, get_value());
        save_setting(key, get_value());
      });
    });

    // configure hotkey elements
    for (const [page, actions] of Object.entries(HOTKEY_ACTIONS)) {
      for (const name of Object.keys(actions)) {
        for (const suffix of ['ctrl', 'alt', 'shift', 'key']) {
          const cfg_elem = document.getElementById(`${KEY_PREFIX}${page}_hotkeys.${name}_${suffix}`);
          cfg_elem.addEventListener('change', () => {
            const hotkeys = get_hotkeys(page);
            update_setting(`${page}_hotkeys`, hotkeys);
            save_setting(`${page}_hotkeys`, hotkeys);
          });
        }
      }
    }
  }

  function get_hotkeys(page) { // get from config dialog
    const hotkeys = [];

    for (const [name, action] of Object.entries(HOTKEY_ACTIONS[page])) {
      const modifiers = new Set();
      for (const mod of ['ctrl', 'alt', 'shift']) {
        if (document.getElementById(`${KEY_PREFIX}${page}_hotkeys.${name}_${mod}`).checked) {
          modifiers.add(mod);
        }
      }

      const key = document.getElementById(`${KEY_PREFIX}${page}_hotkeys.${name}_key`).value;
      if (key.length !== 0) {
        hotkeys.push(new Hotkey(name, key, modifiers));
      }
    }

    return hotkeys;
  }

  function update_hotkeys(page) {
    // reset all hotkey config elements
    for (const name of Object.keys(HOTKEY_ACTIONS[page])) {
      for (const mod of ['ctrl', 'alt', 'shift']) {
        const el = document.getElementById(`${KEY_PREFIX}${page}_hotkeys.${name}_${mod}`);
        if (el !== null)
          el.checked = false;
      }
      const el = document.getElementById(`${KEY_PREFIX}${page}_hotkeys.${name}_key`);
      if (el !== null)
        el.value = '';
    }

    // update hotkey config elements
    for (const hotkey of config[`${page}_hotkeys`]) {
      const key_el = document.getElementById(`${KEY_PREFIX}${page}_hotkeys.${hotkey.action_name}_key`);
      if (key_el !== null)
        key_el.value = hotkey.key;

      for (const mod of ['ctrl', 'alt', 'shift']) {
        const mod_el = document.getElementById(`${KEY_PREFIX}${page}_hotkeys.${hotkey.action_name}_${mod}`);
        if (mod_el !== null)
          mod_el.checked = hotkey.modifiers.has(mod);
      }
    }
  }

  function add_config_button() {
    const navbar = document.getElementById('navbar');
    if (navbar === null) return;

    navbar.style.whiteSpace = 'nowrap'; // hack to fit config button

    const a = document.createElement('A');
    a.href = '#';
    a.onclick = () => { show_config_dialog(true); return false; };
    a.innerHTML = '<span style="font-size: 110%;">⚙</span> Addon config';

    // close when clicking outside
    document.addEventListener('click', (e) => {
      if (is_config_dialog_visible()) {
        if (e.target.closest('#cfg_dialog') !== null)
          return; // clicked inside

        show_config_dialog(false);
        e.preventDefault();
      }
    }, true);

    const li = document.createElement('LI');
    li.className = 'lang-select'; // match style of top bar
    li.appendChild(a);
    navbar.appendChild(document.createTextNode('\u00A0')); // add nbsp
    navbar.appendChild(li);
  }

  function add_tag_search_buttons() {
    for (const item of document.querySelectorAll('#tag-sidebar li')) {
      const taglink = item.querySelector('a');
      if (taglink === null) continue;

      const tagname = get_search_tags(taglink).toString();

      const get_click_listener = (tag) => {
        return () => {
          const search_field = document.getElementById('tags');
          const search_tags = new Tags(search_field.value);

          search_tags.toggle(tag);

          search_field.value = search_tags.toString() + ' ';

          search_field.setSelectionRange(search_field.value.length, search_field.value.length);
          search_field.focus({ preventScroll: true });

          return false;
        };
      };

      const add_search_button = (tag_prefix) => {
        const a = document.createElement('A');
        a.href = '#';
        a.innerText = tag_prefix;
        a.onclick = get_click_listener((tag_prefix === '+' ? '' : tag_prefix) + tagname);

        taglink.parentNode.insertBefore(a, taglink);
        taglink.parentNode.insertBefore(document.createTextNode(' '), taglink);
      };

      add_search_button('+');
      add_search_button('-');
      if (config.or_tag_search_button)
        add_search_button('~');
    }
  }

  function add_tag_post_counts() {
    for (const item of document.querySelectorAll('#tag-sidebar li')) {
      const post_count = item.querySelector('.tag-link')?.dataset?.count;
      if (!post_count) continue;

      const span = document.createElement('span');
      span.style.color = 'grey';
      span.innerText = post_count;
      item.appendChild(span);
    }
  }

  // needs to run before add_tag_search_buttons
  function collect_tag_categories() {
    for (const category of TAG_CATEGORIES) {
      for (const li of document.querySelectorAll(`.tag-type-${category}`)) {
        const taglink = li.querySelector('a');
        if (taglink === null) continue;

        const tag = get_search_tags(taglink).toString();
        config.tag_categories.set(tag, category);
        config.tag_category_colors.set(category, window.getComputedStyle(taglink, null).getPropertyValue('color'));
      }
    }

    adjust_tag_color_css(); // add another copy to reflect newly learned colors

    if (config.save_tag_categories) {
      // TODO this has the same storage race condition issue as the view history and the solution is way too complex and inefficient to implement here...
      save_setting('tag_categories', config.tag_categories);
      save_setting('tag_category_colors', config.tag_category_colors);
    }
  }

  const collapser_map = new Map(); // category -> [collapser, tags]
  const collapser_color_map = new Map(); // category -> font color

  function collapse_tag_category(category, collapse, save = true) {
    const [collapser, tags] = collapser_map.get(category);

    const a = collapser.children[0];
    const middle_div = a.children[1];

    // collapse/expand category
    if (collapse) {
      for (const tag of tags)
        tag.style.display = 'none';
    } else {
      for (const tag of tags)
        tag.style.removeProperty('display');
    }

    // change collapser visuals
    if ([0, 2].includes(config.tag_category_collapser_style)) { // compact style
      if (collapse) {
        middle_div.style.height = '0';
        middle_div.style.borderTopWidth = '3px';
        middle_div.style.borderBottomWidth = '3px';
        middle_div.style.marginTop = '3px';
        middle_div.style.marginBottom = '3px';
      } else {
        middle_div.style.height = '4px';
        middle_div.style.borderTopWidth = '2px';
        middle_div.style.borderBottomWidth = '2px';
        middle_div.style.marginTop = '2px';
        middle_div.style.marginBottom = '2px';
      }
    } else if (config.tag_category_collapser_style === 1) { // with category name
      if (collapse) {
        // swap border and font color
        middle_div.style.color = get_original_background_color();
        middle_div.style.backgroundColor = collapser_color_map.get(category);
      } else {
        middle_div.style.removeProperty('color');
        middle_div.style.removeProperty('background-color');
      }
    }

    // retain collapse state
    if (collapse) config.collapsed_tag_categories.add(category);
    else          config.collapsed_tag_categories.delete(category);

    if (save) save_setting('collapsed_tag_categories', config.collapsed_tag_categories);
  }

  let drag_collapse = false;
  let drag_collapse_categories;

  function drag_collapse_down(e) {
    e.preventDefault();
    drag_collapse = true;

    const category = e.currentTarget.className;
    drag_collapse_categories = !config.collapsed_tag_categories.has(category);

    collapse_tag_category(category, drag_collapse_categories);
  }

  function drag_collapse_move(e) {
    if (!drag_collapse) return;

    const category = e.currentTarget.className;

    if (drag_collapse_categories !== config.collapsed_tag_categories.has(category))
      collapse_tag_category(category, drag_collapse_categories);
  }

  function drag_collapse_up() {
    drag_collapse = false;
  }

  function add_tag_category_collapser() {
    const tagsidebar = document.getElementById('tag-sidebar');
    if (tagsidebar === null) return;

    // remove default category names for compact styles
    if (config.tag_category_collapser_style < 2) {
      for (const title of document.querySelectorAll('#tag-sidebar > h6, #tag-sidebar > br')) {
        title.remove();
      }
    }

    const items = tagsidebar.getElementsByTagName('LI');

    window.addEventListener('mouseup', drag_collapse_up);

    const setup_collapser = (collapser, category, tags) => {
      collapser_map.set(category, [collapser, tags]);

      collapser.addEventListener('mousedown', drag_collapse_down);
      collapser.addEventListener('mousemove', drag_collapse_move);
      for (const tag of tags)
        tag.addEventListener('mousemove', drag_collapse_move);
    };

    let curr_category = null;
    let curr_category_tags = [];
    let prev_category_collapser = null;
    const categories = [];

    for (const item of items) {
      if (item.className === curr_category) {
        curr_category_tags.push(item);
      } else { // reached new category
        if (prev_category_collapser !== null)
          setup_collapser(prev_category_collapser, curr_category, [...curr_category_tags]);

        // remember category color, workaround for color changing on hover
        for (const a of item.getElementsByTagName('A')) {
          collapser_color_map.set(item.className, window.getComputedStyle(a).getPropertyValue('color'));
          break;
        }

        curr_category = item.className;
        curr_category_tags = []; // item will be pushed in the next iteration, see warning below
        categories.push(curr_category);

        const a = document.createElement('A');
        a.href = '#';
        a.addEventListener('click', (e) => e.preventDefault());

        // collapser visuals
        a.style.display = 'flex';
        a.style.justifyContent = 'center';
        a.style.alignItems = 'center';

        if ([0, 2].includes(config.tag_category_collapser_style)) { // compact style
          a.innerHTML =
            '<div style="width:40%; height: 0; border-top-width: 1px; border-bottom-width: 1px; border-style: solid;"></div>' +
            '<div style="width:5%;  height: 4px; border-width: 2px; margin: 2px 2px 2px 2px; border-style: solid"></div>' +
            '<div style="width:40%; height: 0; border-top-width: 1px; border-bottom-width: 1px; border-style: solid;"></div>';
        } else { // with category name
          const category_name = curr_category.substring('tag-type-'.length);

          a.style.paddingLeft = '2.5%';
          a.style.paddingRight = '2.5%';
          a.innerHTML =
            '<div style="width:50%; height: 0; border-top-width: 1px; border-bottom-width: 1px; border-style: solid;"></div>' +
            `<div style="border-width: 2px; margin: 2px 2px 2px 2px; padding-left: 4px; padding-right: 4px; border-style: solid">${category_name}</div>` +
            '<div style="width:50%; height: 0; border-top-width: 1px; border-bottom-width: 1px; border-style: solid;"></div>';
        }

        const collapser = document.createElement('LI');
        collapser.className = item.className;
        collapser.appendChild(a);
        prev_category_collapser = collapser;

        // warning: modifies iterating list, current item will be processed twice
        item.insertAdjacentElement('beforebegin', collapser);
      }
    }

    // setup last collapser
    if (prev_category_collapser !== null)
      setup_collapser(prev_category_collapser, curr_category, [...curr_category_tags]);

    for (const category of categories)
      if (config.collapsed_tag_categories.has(category))
        collapse_tag_category(category, true, false);
  }

  function get_thumbnail_post_id(thumb) {
    return thumb.dataset.id ?? null;
  }

  const post_cache = new Map(); // returns object with tags array and rating
  function get_post(post_id) {
    // might not be loaded yet or exist at all (e.g on deletion page)
    const internalPost = unsafeWindow.Post?.posts[post_id];
    if (internalPost !== undefined) {
      const post = { ...internalPost };

      const fix_rating = (rating) => {
        const rating_translation = { 's': 'g', 'q': 'r15+', 'e': 'r18+' };
        if (rating_translation.hasOwnProperty(rating)) return rating_translation[rating];
        return rating;
      };

      post.rating = fix_rating(post.rating);

      return post;
    }

    const post = post_cache.get(post_id);
    if (post !== undefined) return post;

    return null;
  }

  function get_post_from_thumb(thumb) {
    const img = thumb.querySelector('img.post-preview-image');
    if (img === null) {
      show_notice(console.error, '[addon error] thumbnail has no preview image');
      return null;
    }

    const post_id = get_thumbnail_post_id(thumb);
    let post = get_post(post_id);

    if (post !== null) return post;

    let tags = new Tags(img.dataset['auto_page']).toArray();

    // find rating
    let rating = null;
    for (const tag of tags) {
      if (tag.startsWith('Rating:')) {
        rating = tag.substring('Rating:'.length).toLowerCase();
        break;
      }
    }

    // remove "match tags"
    tags = tags.filter((tag) => {
      return !(tag.startsWith('Rating:') || tag.startsWith('Score:') || tag.startsWith('Size:') || tag.startsWith('User:'));
    });

    post = {
      tags,
      rating,
    };

    post_cache.set(post_id, post);

    return post;
  }

  function modify_thumbnail(preview_image) {
    // expected layout:
    // article.post-preview > div.post-preview-container > a.post-preview-link > picture > img.post-preview-image
    // MutationObserver is waiting for innermost .post-preview-image to ensure all the necessary data is there

    const thumb_a = preview_image?.closest('a.post-preview-link');
    const thumb = preview_image?.closest('.post-preview');

    if (!thumb_a) {
      show_notice(console.error, '[addon error] couldn\'t find thumbnail link');
      return;
    } else if (!thumb) {
      show_notice(console.error, '[addon error] couldn\'t find outer thumbnail');
      return;
    }

    const post_id = get_thumbnail_post_id(thumb);
    if (post_id === null) return;

    // use and update thumbnail_cache
    const thumbs = General.thumbnail_cache.get(post_id) ?? [];

    const is_new = !thumbs.includes(thumb);

    if (is_new) thumbs.push(thumb);
    General.thumbnail_cache.set(post_id, thumbs);

    if (is_new) {
      override_thumbnail_click_event(thumb_a);
      add_thumbnail_icons(thumb);

      if (!is_personal_post_page() && General.page !== Page.Delete)
        fadeout_viewed_post(thumb, post_id);
    }
  }

  function add_thumbnail_icons(thumb) {
    if (!(config.show_speaker_icon || config.show_animated_icon || config.show_ratings_icon)) return;

    const post = get_post_from_thumb(thumb);
    if (post == null) return;

    const icons = document.createElement('SPAN');
    icons.style.whiteSpace = 'nowrap';

    if (config.show_ratings_icon) {
      icons.insertAdjacentHTML('beforeend', RATING_SVG[post.rating]);
    }

    if (config.show_speaker_icon && (post.tags.includes('has_audio'))) {
      icons.insertAdjacentHTML('beforeend', SPEAKER_SVG);
    } else if (config.show_animated_icon && (post.tags.includes('animated') || post.tags.includes('video') || post.tags.includes('slideshow'))) {
      icons.insertAdjacentHTML('beforeend', ANIMATED_SVG);
    }

    icons.className = 'thumbnail_icons';
    icons.style.position = 'absolute';
    icons.style.top   = '2px'; // account for border
    icons.style.right = '2px';
    icons.style.transform = `translateX(${SVG_SIZE / 2}px) translateY(-${SVG_SIZE / 2}px)`;

    thumb.querySelector('a').appendChild(icons);
  }

  function fadeout_post(thumb) {
    if (!config.view_history_enabled) return;

    const a = thumb.querySelector('a');
    const img = thumb.querySelector('img');

    // move box shadow from image to link, so opacity doesn't affect it
    a.style.display = 'inline-block';
    a.style.boxShadow = window.getComputedStyle(img).getPropertyValue('box-shadow');
    img.style.removeProperty('box-shadow');

    img.style.opacity = '20%';
    for (const thumbnail_icons of thumb.getElementsByClassName('thumbnail_icons'))
      thumbnail_icons.style.opacity = '20%';
  }

  function fadeout_viewed_post(thumb, id) {
    if (config[HISTORY_KEY].has(id))
      fadeout_post(thumb);
  }

  function configure_video(node) {
    if (config.video_pause)      node.pause();
    if (config.set_video_volume) node.volume = config.video_volume / 100.0;
    if (config.video_mute)       node.muted = true;
    node.controls = config.video_controls;
  }

  function useful_beta_link() { // idea and some code donated by Octopus Hugger
    const betaLink = new URL('https://beta.sankakucomplex.com/');

    if (General.page === Page.Index) {
      betaLink.search = window.location.search;

    } else if (General.page === Page.Post) {
        betaLink.pathname = `/post/show/${PostPage.post_id}`;

    } else if (General.page === Page.User) {
      const username = document.querySelector('.user-show-heading > h2')?.innerText.replaceAll(' ', '_');

      betaLink.pathname = '/user/show';
      betaLink.searchParams.set('name', username);

    } else if (General.page === Page.WikiNew) {
      betaLink.pathname = '/wiki/create_article';
      betaLink.searchParams.set('tagName', WikiPage.tag);

    } else if (General.page === Page.WikiEdit) {
      betaLink.pathname = '/wiki/edit_article';
      betaLink.searchParams.set('tagName', WikiPage.tag);

    } else if (General.page === Page.WikiShow) {
      betaLink.pathname = '/tag/en';
      betaLink.searchParams.set('tagName', WikiPage.tag);

    } else if (General.page === Page.Pool) {
      betaLink.pathname = '/books/' + PoolPage.pool_id;
    }

    // update beta link
    for (const a of document.querySelectorAll('#navbar a[href="https://beta.sankakucomplex.com/"]')) {
      a.href = betaLink.href;
    }
  }


  /***********************************************/
  /* main page / visually similar page functions */
  /***********************************************/

  function select_mode(mode) {
    const mode_dropdown = document.getElementById('mode');

    const old_mode = mode_dropdown.value;
    mode_dropdown.value = mode;
    if (!mode_dropdown.value) mode_dropdown.value = old_mode; // couldn't set mode (option doesn't exist)

    PostModeMenu_change_override();
  }

  function add_mode_options() {
    const mode_dropdown = document.getElementById('mode');
    if (mode_dropdown === null) return; // not logged in

    const add_mode_option = (text, value) => {
      const option = document.createElement('option');
      option.text  = text;
      option.value = value;
      mode_dropdown.add(option);
    };

    if (IndexPage.has_tag_scripts) {
      add_mode_option('Choose Parent', 'choose-parent');
      add_mode_option('Set Parent', 'set-parent');
    }
    // add_mode_option('Edit Tags', 'edit-tags'); // TODO: currently broken due to requiring an authenticity token
    add_mode_option('Find Similar', 'find-similar');
    if (IndexPage.has_tag_scripts) add_mode_option('Delete Post', 'delete'); // rough estimate of user permissions

    override_mode_change_event(mode_dropdown);

    PostModeMenu_init_workaround(); // guarantee that 'mode' correctly changes to new modes when loading page
  }

  function add_post_edit_dialog() {
    const dialog = create_popup_menu();
    dialog.id = 'post_edit_dialog';
    dialog.style.borderWidth = '4px';

    // edit box, modified from the post page
    dialog.innerHTML =
      `<div id="SA-edit" style="display: flex; align-items: center;">
<div style="width: 300px; height: 300px; display: flex; align-items: center; justify-content: center; margin-right: 12px">
<img id="SA-edit-image" src="${EMPTY_IMAGE}">
</div>
<div>
<h5><a id="post-link" href="" target="_blank"></a></h5>
<form id="SA-edit-form" method="post" style="width: fit-content">
<input id="SA-post_old_tags" name="post[old_tags]" type="hidden" value="">
<table class="form">
<tfoot>
<tr>
<td colspan="2" style="white-space: nowrap"><input accesskey="s" name="commit" tabindex="11" type="submit" value="Save changes" style="min-width: 13.5em;">
</td>
</tr>
</tfoot>
<tbody>
<tr>
<th style="width: 10%">
<label class="block" for="SA-post_rating_questionable">Rating</label>
</th>
<td style="width: 90%">
<input id="SA-post_rating_explicit" name="post[rating]" tabindex="1" type="radio" value="explicit">
<label for="SA-post_rating_explicit">R18+</label>
<input id="SA-post_rating_questionable" name="post[rating]" tabindex="2" type="radio" value="questionable">
<label for="SA-post_rating_questionable">R15+</label>
<input checked="" id="SA-post_rating_safe" name="post[rating]" tabindex="3" type="radio" value="safe">
<label for="SA-post_rating_safe">G</label>
</td>
</tr>
<tr>
<th>
<label class="block" for="SA-post_tags">Tags</label>
</th>
<td>
<textarea cols="83" id="SA-post_tags" name="post[tags]" rows="9" spellcheck="false" tabindex="10" autocomplete="off" style="margin-top: 0.5em;" ></textarea>
</td>
</tr>
</tbody>
</table>
</form>
</div>
</div>`;

    document.body.appendChild(dialog);
    add_tag_buttons('SA-edit-form');

    // hide when clicking outside
    document.addEventListener('click', (e) => {
      if (is_post_edit_dialog_visible()) {
        if (e.target.closest('#post_edit_dialog, #autosuggest') !== null)
          return; // clicked inside

        show_post_edit_dialog(false);
        e.preventDefault();
      }
    }, true);

    enable_auto_suggest();
  }

  async function enable_auto_suggest() {
    while (unsafeWindow.AutoSuggest === undefined)
      await sleep(250);

    unsafeWindow.AutoSuggest.add('#SA-post_tags');
  }

  function show_post_edit_dialog(bool) {
    const dialog = document.getElementById('post_edit_dialog');
    if (dialog !== null) dialog.style.display = (bool ? 'block' : 'none');
  }

  function is_post_edit_dialog_visible() {
    const dialog = document.getElementById('post_edit_dialog');
    return dialog?.style.display === 'block';
  }

  function open_post_edit_dialog(thumb) {
    const dialog = document.getElementById('post_edit_dialog');
    if (dialog === null) {
      show_notice(console.error, '[addon error] tag edit popup is missing?!');
      return;
    }

    const post_id = get_thumbnail_post_id(thumb);
    if (post_id === null) return;

    const a = thumb.querySelector('a');
    if (a === null) return;

    const edit_image = document.getElementById('SA-edit-image');
    const post_old_tags = document.getElementById('SA-post_old_tags');
    const post_tags = document.getElementById('SA-post_tags');
    const form = document.getElementById('SA-edit-form');
    const post_link = document.getElementById('post-link');

    // set thumbnail image and post link
    edit_image.src = EMPTY_IMAGE;
    edit_image.src = thumb.querySelector('.preview').src;
    post_link.href = a.href;
    post_link.innerText = 'Post ' + post_id;

    const full_rating = (rating) => ({ 'g': 'safe', 'r15+': 'questionable', 'r18+': 'explicit' }[rating]);

    // get tags and rating
    const post = get_post_from_thumb(thumb);
    const tags = post.tags.join(' ');
    const rating = full_rating(post.rating);

    // set edit box contents
    post_old_tags.value = tags;
    post_tags.value = tags;

    if (rating !== null) {
      document.getElementById('SA-post_rating_' + rating).checked = true;
    }

    update_tag_elements();

    form.onsubmit = async (event) => {
      event.preventDefault(); // block reloading page

      delete_useless_tags_tag();

      const submitted_tags = new Tags(post_tags.value).toArray();
      show_notice(console.log, '[addon] saving...');

      // manually submit data
      try {
        const response = await fetch(new URL(`/post/update/${post_id}`, document.location.origin), {
          method: 'POST',
          body: new FormData(form),
          redirect: 'manual', // this will otherwise err because of a https -> http redirect
        });

        // we assume success on redirect
        if (response.type === 'opaqueredirect' || response.ok) {
          // update local tags
          post.tags = submitted_tags;
          deletion_sanity_checks();

          show_notice(console.log, '[addon] saved tags!');
        } else {
          show_notice(console.error, '[addon error] couldn\'t save tags!');
        }
      } catch (error) {
        show_notice(console.error, '[addon error] network error while saving tags!', error);
      }
    };

    show_post_edit_dialog(true);
  }

  function add_postmode_hotkeys() {
    document.addEventListener('keydown', (e) => {
      const mode_dropdown = document.getElementById('mode');
      const script_presets = document.getElementById('tagscript_presets_dropdown');
      if (mode_dropdown === null) return;
      if (e.ctrlKey || e.altKey || e.shiftKey) return;

      if (e.target === mode_dropdown || (script_presets !== null && e.target === script_presets)) {
        e.preventDefault(); // e.g. 'v' would otherwise change to 'View Posts'
      } else if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      for (const hotkey of config.indexpage_hotkeys) {
        hotkey.call(e);
      }
    }, true);
  }

  function PostModeMenu_init_workaround() {
    // issue: new post modes can reset on page load if they were added too late
    // reason: on page load, PostModeMenu.init reads the "mode" cookie, tries to set mode_dropdown.value, then
    // calls PostModeMenu.change, which sets the cookie to mode_dropdown.value.
    // so if the new modes aren't added yet, mode_dropdown.value and the "mode" cookie will both reset
    // solution: safe mode in a separate 'backup' cookie and set the "mode" cookie and mode_dropdown after new modes were added
    const mode = get_cookie('addon_mode');
    if (mode !== '') {
      set_cookie('mode', mode, 7);
      document.getElementById('mode').value = mode;
    }

    PostModeMenu_change_override();
  }

  async function PostModeMenu_change_override() {
    const mode_dropdown = document.getElementById('mode');
    if (mode_dropdown === null) {
      show_notice(console.error, '[addon error] PostModeMenu_change_override() couldn\'t find mode dropdown?!');
      return;
    }

    // setting mode failed, possible when changing to account with lower permissions
    if (!mode_dropdown.value) {
      show_notice(console.error, '[addon error] invalid mode, resetting to \'view\'');
      mode_dropdown.value = 'view';
      set_cookie('mode', 'view', 7);
    }

    // try to guarantee sitescript has loaded TODO: future note: potential infinite loop
    while (unsafeWindow.PostModeMenu === undefined || unsafeWindow.Cookie === undefined || unsafeWindow.$ === undefined)
      await sleep(100);

    unsafeWindow.PostModeMenu.change();

    const s = mode_dropdown.value;

    set_cookie('addon_mode', s, 7); // set 'backup' cookie

    const darkmode = is_darkmode();
    if (s === 'add-fav') {
      // FFFFAA, original. darkmode: luminance 40
      document.body.style.backgroundColor = (darkmode ? '#505000' : '#FFA');
    } else if (s === 'remove-fav') {
      // FFFFAA -> FFEEAA, slightly more orange. darkmode: luminance 40
      document.body.style.backgroundColor = (darkmode ? '#504000' : '#FEA');
    } else if (s === 'apply-tag-script') {
      // AA33AA -> FFDDFF, weaken color intensity. darkmode: luminance 40
      document.body.style.backgroundColor = (darkmode ? '#500050' : '#FDF');
    } else if (s === 'approve') {
      // 2266AA -> FFDDFF, increase contrast to unapproved posts. darkmode: luminance 40
      document.body.style.backgroundColor = (darkmode ? '#500050' : '#FDF');
    } else if (s === 'choose-parent') {
      document.body.style.backgroundColor = (darkmode ? '#464600' : '#FFD');
    } else if (s === 'set-parent') {
      if (get_cookie('chosen-parent') === '') {
        show_notice(console.warn, '[addon] Choose parent first!');
        select_mode('choose-parent');
      } else {
        document.body.style.backgroundColor = (darkmode ? '#005050' : '#DFF');
      }
    } else if (s === 'edit-tags') {
      document.body.style.backgroundColor = (darkmode ? '#006400' : '#3A3');
    } else if (s === 'find-similar') {
      document.body.style.removeProperty('background-color');
    } else if (s === 'delete') {
      document.body.style.backgroundColor = 'rgba(147, 0, 0, 0.7)';
    }
  }

  function PostModeMenu_click_override(event) {
    const thumb_a = event.currentTarget;
    const thumb = thumb_a.closest('.post-preview');
    const post_id = get_thumbnail_post_id(thumb);

    if (unsafeWindow.PostModeMenu.click(post_id))
      return true; // view mode, let it click

    const mode_dropdown = document.getElementById('mode');
    const s = mode_dropdown.value;

    if (s === 'choose-parent') {
      set_cookie('chosen-parent', post_id);
      mode_dropdown.value = 'set-parent';
      PostModeMenu_change_override();
    } else if (s === 'set-parent') {
      const parent_id = get_cookie('chosen-parent');
      unsafeWindow.TagScript.run(post_id, 'parent:' + parent_id + (config.setparent_deletepotentialduplicate ? ' -potential_duplicate' : ''));
    } else if (s === 'edit-tags') {
      open_post_edit_dialog(thumb);
    } else if (s === 'find-similar') {
      open_in_tab(window.location.origin + '/posts/similar?id=' + post_id);
    } else if (s === 'delete') {
      open_in_tab(window.location.origin + `/posts/${post_id}/delete`);
    }

    return false;
  }

  function override_mode_change_event(mode_dropdown) {
    mode_dropdown.removeAttribute('onchange');
    mode_dropdown.onchange = PostModeMenu_change_override;
  }

  function override_thumbnail_click_event(thumb_a) {
    thumb_a.removeAttribute('onclick');
    thumb_a.onclick = PostModeMenu_click_override;
  }

  /***********************/
  /* post page functions */
  /***********************/

  // TODO put in PostPage
  // original post/parent ids
  let image_data = null;
  let resize_timer;
  let tag_update_timer;
  // set by find_actions_list():
  let found_delete_action = false;

  let done_scrolling = false;
  function is_done_scrolling() {
    return !config.scroll_to_image || done_scrolling;
  }

  class TagMenuScaler {
    static #mouse_moved = false;

    static mousedown(e) {
      e.preventDefault();
      TagMenuScaler.#mouse_moved = false;
      window.addEventListener('mousemove', TagMenuScaler.mousemove);
      window.addEventListener('mouseup',   TagMenuScaler.mouseup);
    }

    static mousemove(e) {
      e.preventDefault();
      TagMenuScaler.#mouse_moved = true;
      TagMenuScaler.set_scale(e, false);
    }

    static mouseup(e) {
      e.preventDefault();
      if (TagMenuScaler.#mouse_moved) TagMenuScaler.set_scale(e, true);

      window.removeEventListener('mousemove', TagMenuScaler.mousemove);
      window.removeEventListener('mouseup',   TagMenuScaler.mouseup);
    }

    static set_scale(e, save) {
      const tag_menu = document.getElementById('tag_menu');
      if (tag_menu === null) return;

      const yFromBottom = window.innerHeight - e.clientY;
      let yPercentfromBottom = (100.0 * (yFromBottom / window.innerHeight));
      yPercentfromBottom = Math.min(Math.max(yPercentfromBottom, 5), 95) + '%';

      tag_menu.style.height = yPercentfromBottom;

      if (save) save_setting('tag_menu_scale', yPercentfromBottom);
    }
  }

  function add_tag_menu() {
    if (document.getElementById('post_tags') === null) return; // not logged in

    const tag_menu = document.createElement('DIV');
    tag_menu.id = 'tag_menu';
    tag_menu.style.display = 'none';
    tag_menu.style.width = '100%';
    tag_menu.style.height = config.tag_menu_scale;
    tag_menu.style.position = 'fixed';
    tag_menu.style.bottom = '0';
    tag_menu.style.overflow = 'auto';
    tag_menu.style.backgroundColor = get_original_background_color();
    tag_menu.style.zIndex = '10001';
    document.body.appendChild(tag_menu);

    // the inner div ensures tag_menu_close button doesn't scroll with the content
    tag_menu.innerHTML = '<div style="width: calc(100% - 2px); height: 100%; overflow: auto;"><span id="common_tags"></span>Current Tags:<span id="current_tags"></span></div>';

    const tag_menu_scaler = document.createElement('DIV');
    tag_menu_scaler.id = 'tag_menu_scaler';
    tag_menu_scaler.style.width = '100%';
    tag_menu_scaler.style.height = '6px';
    tag_menu_scaler.style.backgroundColor = shifted_backgroundColor(32);
    tag_menu_scaler.style.position = 'absolute';
    tag_menu_scaler.style.top = '0';
    tag_menu_scaler.style.cursor = 'ns-resize';
    tag_menu_scaler.style.zIndex = '10000';
    tag_menu_scaler.addEventListener('mousedown', TagMenuScaler.mousedown);
    tag_menu.appendChild(tag_menu_scaler);
    tag_menu.style.paddingTop = tag_menu_scaler.style.height; // since tag_menu_scaler floats above the tags

    const create_tag_menu_button = function(id, text) {
      const button = document.createElement('DIV');
      button.id = id;
      button.style.border = '1px solid ' + shifted_backgroundColor(32);
      button.style.width  = '24px';
      button.style.height = '24px';
      button.style.position = 'absolute';
      button.style.textAlign = 'center';
      button.style.cursor = 'pointer';
      button.style.backgroundColor = shifted_backgroundColor(16);
      button.innerHTML = `<span style="width: 100%; display: block; position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);">${text}</span>`;
      button.style.zIndex = '10001';
      return button;
    };

    const tag_menu_close = create_tag_menu_button('tag_menu_close', 'X');
    tag_menu_close.style.top   = '0';
    tag_menu_close.style.right = '0';
    tag_menu_close.onclick = () => { show_tag_menu(false); return false; };
    tag_menu.appendChild(tag_menu_close);

    const tag_menu_open = create_tag_menu_button('tag_menu_open', '«');
    tag_menu_open.style.position = 'fixed';
    tag_menu_open.style.right  = '0';
    tag_menu_open.style.bottom = '0';
    tag_menu_open.onclick = () => { show_tag_menu(true); update_tag_menu(); return false; };
    document.body.appendChild(tag_menu_open);

    const tag_menu_save = create_tag_menu_button('tag_menu_save', 'Save changes');
    tag_menu_save.style.top   = '0';
    tag_menu_save.style.right = '36px';
    tag_menu_save.style.width = '140px';
    tag_menu_save.style.fontWeight = 'bold';
    tag_menu_save.addEventListener('click', (e) => {
      e.preventDefault();
      delete_useless_tags_tag();
      document.getElementById('edit-form').submit();
    });
    tag_menu.appendChild(tag_menu_save);
  }

  function update_tag_menu(skip_common_tags = false) {
    if (document.getElementById('post_tags') === null) return; // not logged in

    const common_tags_elem  = document.getElementById('common_tags');
    const current_tags_elem = document.getElementById('current_tags');

    // tag menu disabled
    if (common_tags_elem === null || current_tags_elem === null)
      return;

    if (config.tag_menu_layout === 1) {
      common_tags_elem.style.display = 'grid';
      common_tags_elem.style.gridTemplateColumns = 'fit-content(5%) auto';
    } else {
      common_tags_elem.style.removeProperty('display');
    }

    const create_tag_button = function(tag, skip_common_tags_update = false) {
      const a = document.createElement('A');
      a.href = '#';
      a.style.backgroundColor = (is_darkmode() ? '#000' : '#FFF'); // more contrast for tag buttons
      a.classList.add('tag_button');
      if (config.tag_categories.has(tag)) a.classList.add(`tag-type-${config.tag_categories.get(tag)}`);
      if (!get_post_tags().has(tag)) a.classList.add('tag_nonexistent');

      a.onclick = function(e) {
        if (e.ctrlKey) {
          open_in_tab(window.location.origin + '/wiki/' + tag);
          return false;
        }

        if (get_post_tags().has(tag)) {
          remove_post_tag(tag, skip_common_tags_update);
          a.classList.add('tag_nonexistent');
        } else {
          add_post_tag(tag, skip_common_tags_update);
          a.classList.remove('tag_nonexistent');
        }
        return false;
      };
      a.innerText = tag;
      return a;
    };

    const create_tag_list = function() {
      const div = document.createElement('DIV');
      div.className = 'tag_list';
      return div;
    };

    // generate tag button list for current tags
    const current_tags_flex = create_tag_list();
    current_tags_flex.style.marginBottom = '3px';
    for (const current_tag of get_post_tags()) {
      current_tags_flex.appendChild(create_tag_button(current_tag, false));
    }

    // replace current list with new one
    while (current_tags_elem.hasChildNodes())
      current_tags_elem.removeChild(current_tags_elem.lastChild);
    current_tags_elem.appendChild(current_tags_flex);

    // don't rebuild the common tags list when common tags buttons are pressed
    if (skip_common_tags) return;

    // now add common tags
    // common_tags_json(_idol) should be an array of objects with an optional string "name" field and an array "tags" field,
    // where the "tags" array can contain strings (space separated tags), arrays containing one string (representing a group)
    // or arrays of array containing one string (representing a table)
    // ex. [ { "name":"common tags", "tags":[ "tag1 tag2", ["grouped_tag1 grouped_tag2"] , "tag3 tag4"] }, { "name":"uncommon tags", "tags":[ "t1 t2 t3" ]} ]
    let tag_data;
    try {
      tag_data = JSON.parse(config[COMMON_TAGS_KEY]);
    } catch (error) {
      show_notice(console.error, '[addon error] "common tags" JSON syntax error', error);
      return;
    }

    if (!Array.isArray(tag_data)) {
      show_notice(console.error, '[addon error] "common tags" needs to be an array of objects');
      return;
    }

    while (common_tags_elem.hasChildNodes())
      common_tags_elem.removeChild(common_tags_elem.lastChild);

    for (let k = 0; k < tag_data.length; k++) {
      const list_flex = create_tag_list();
      const list_name = tag_data[k].name;
      const list_tags = tag_data[k].tags;

      if (!Array.isArray(list_tags)) {
        show_notice(console.error, '[addon error] a "common tags" object needs to have a "tags" array');
        return;
      }

      const TAGS_TYPES = {
        LIST:  'list',  // e.g. "tag1 tag2"
        GROUP: 'group', // e.g. ["tag1 tag2"]
        TABLE: 'table'  // e.g. [["tag1 tag2"], ["tag3 tag4"]]
      };

      const group_style = function(el) {
        // red in darkmode needs more contrast
        const rgb = rgb_to_array(get_original_background_color());
        if (is_darkmode()) {
          el.style.border = '1px solid ' + rgb_array_to_rgb(rgb_array_shift(rgb, 96));
          el.style.backgroundColor = rgb_array_to_rgb(rgb_array_shift(rgb, 64));
        } else {
          el.style.border = '1px solid ' + rgb_array_to_rgb(rgb_array_shift(rgb, -64));
          el.style.backgroundColor = rgb_array_to_rgb(rgb_array_shift(rgb, -32));
        }
      };

      for (const list_tag of list_tags) {
        const is_array = Array.isArray(list_tag);

        // find tags_type
        let tags_type;
        if (is_array) {
          if (list_tag.length === 0) {
            show_notice(console.error, '[addon error] "common tags" "tags" array contains an empty array');
            return;
          }

          // check what the array consists of
          let all_arrays = true;
          let no_arrays = true;
          for (let i = 0; i < list_tag.length; i++) {
            if (!Array.isArray(list_tag[i])) {
              all_arrays = false;
            } else {
              no_arrays = false;
            }
          }

          if (all_arrays) {
            tags_type = TAGS_TYPES.TABLE;
          } else if (no_arrays) {
            tags_type = TAGS_TYPES.GROUP;
          } else {
            show_notice(console.error, '[addon error] "common tags" "tags" array contains an array which is neither a group nor a table');
            return;
          }
        } else {
          tags_type = TAGS_TYPES.LIST;
        }

        if (tags_type === TAGS_TYPES.TABLE) {
          const tags_table = [];
          for (let j = 0; j < list_tag.length; j++) {
            if (list_tag[j].length !== 1) {
              show_notice(console.error, '[addon error] "common tags" "tags" array contains a table entry with not exactly 1 tags string');
              return;
            }

            tags_table.push(new Tags(list_tag[j][0]).toArray());
          }

          const table_height = tags_table.length;
          let table_width = 0;
          for (let row = 0; row < tags_table.length; row++)
            table_width = Math.max(table_width, tags_table[row].length);

          // div (flexbox)><table><tr><td><div (button)>
          // TODO maybe replace with grid
          const table = document.createElement('TABLE');
          table.style.display = 'inline-block';
          group_style(table);
          for (let row = 0; row < table_height; row++) {
            const tr = document.createElement('TR');
            for (let col = 0; col < table_width; col++) {
              const td = document.createElement('TD');
              td.style.border = 'none';
              td.style.padding = '0';
              if (tags_table[row][col])
                td.appendChild(create_tag_button(tags_table[row][col], true));
              tr.appendChild(td);
            }
            table.appendChild(tr);
          }

          list_flex.appendChild(table);
        } else if (tags_type === TAGS_TYPES.GROUP) {
          if (list_tag.length !== 1) {
            show_notice(console.error, '[addon error] "common tags" "tags" array contains a group with not exactly 1 tags string');
            return;
          }

          const tags = list_tag[0].trim().split(/\s+/);

          // <div (flexbox)><div (flexbox)><div (button)>
          const group_div = document.createElement('DIV');
          group_div.className = 'tag_group';
          group_style(group_div);

          for (const tag of tags)
            group_div.appendChild(create_tag_button(tag, true));

          list_flex.appendChild(group_div);
        } else /* if (tags_type === tag_types.LIST) */ {
          // <div (flexbox)><div (button)>
          const tags = new Tags(list_tag);
          for (const tag of tags) {
            list_flex.appendChild(create_tag_button(tag, true));
          }
        }
      }

      const span = document.createElement('SPAN');
      span.innerText = (list_name ? `${list_name}:` : '');
      span.style.paddingTop = '2px';
      if (list_name) span.style.marginLeft = '2px';

      if (list_name && config.tag_menu_layout === 1) {
        const add_top_border = function(el) {
          el.style.borderTopWidth = '1px';
          el.style.borderTopStyle = 'solid';
          el.style.borderTopColor = shifted_backgroundColor(32);
        };
        add_top_border(span);
        add_top_border(list_flex);
      }

      common_tags_elem.appendChild(span);
      common_tags_elem.appendChild(list_flex);
    }
  }

  function show_tag_menu(bool) {
    document.getElementById('tag_menu').style.display = (bool ? '' : 'none');
    document.getElementById('tag_menu_open').style.display = (!bool ? '' : 'none');
  }

  function add_tags_change_listener() {
    const post_tags = get_post_tags_el();
    if (post_tags === null) return; // not logged in

    const delayed_update = () => {
      clearTimeout(tag_update_timer);
      tag_update_timer = setTimeout(update_tag_elements, 400);
    };

    post_tags.addEventListener('change', delayed_update);
    post_tags.addEventListener('input',  delayed_update);
  }


  function add_tags_submit_listener() {
    document.getElementById('edit-form')?.addEventListener('submit', () => {
      delete_useless_tags_tag();
    });
  }

  function find_actions_list() {
    let actions_ul;

    for (const a of document.querySelectorAll('.sidebar > div > ul:not(#tag-sidebar) > li > a')) {
      try {
        const pathname = new URL(a.href).pathname;
        if (pathname.startsWith('/posts/similar') || pathname.startsWith('/post/similar')) {
          actions_ul = a.parentElement.parentElement;
        } else if (pathname.startsWith('/posts/delete/') || pathname.startsWith('/post/delete/')) {
          found_delete_action = true;
        }
      } catch (ignored) {}
    }

    return actions_ul;
  }

  function copy_translations() {
    config.notes = [];

    for (const note of unsafeWindow.Note.all) {
      config.notes.push({
        text: note.old.raw_body,
        fullsize: note.fullsize,
      });
    }

    save_setting('notes', config.notes);
    show_notice(console.log, '[addon] copied notes');
  }

  function paste_translations() {
    show_notice(console.log, '[addon] pasted notes');

    // TODO check https://chan.sankakucomplex.com/wiki/show?title=about%3Anote_formatting
    // TODO save all notes

    for (const note of config.notes) {
      unsafeWindow.Note.create();
      const new_note = unsafeWindow.Note.all.at(-1);

      const box = new_note.elements.box;
      const image = new_note.elements.image;
      const ratio = new_note.ratio();

      // set text
      new_note.elements.body.innerText = note.text;
      new_note.old.raw_body = note.text;

      // set size
      const width  = note.fullsize.width  * ratio;
      const height = note.fullsize.height * ratio;
      box.style.width  = width  + 'px';
      box.style.height = height + 'px';

      // set position
      const clipX = (x) => Math.max(5, Math.min(x, image.clientWidth  - box.clientWidth  - 5));
      const clipY = (y) => Math.max(5, Math.min(y, image.clientHeight - box.clientHeight - 5));
      const top  = clipY(note.fullsize.top  * ratio);
      const left = clipX(note.fullsize.left * ratio);
      box.style.top  = top  + 'px';
      box.style.left = left + 'px';
    }
  }

  function add_addon_actions(actions_ul) {
    if (actions_ul == null) {
      show_notice(console.error, '[addon error] couldn\'t find actions list! Disabled addon actions.');
      return;
    }

    const separator = document.createElement('H5');
    separator.innerText = 'Addon actions';
    const newli = document.createElement('LI');
    newli.appendChild(separator);
    actions_ul.appendChild(newli);

    const add_action = function(func, name, id) {
      const a = document.createElement('A');
      a.href = '#';
      a.onclick = () => { func(); return false; };
      a.innerText = name;

      const li = document.createElement('LI');
      li.id = id;
      li.appendChild(a);
      actions_ul.appendChild(li);
    };

    add_action(() => { scale_image(SCALE_MODES.FIT,        true); scroll_to_image(); }, 'Fit image',              'scale-image-fit');
    add_action(() => { scale_image(SCALE_MODES.HORIZONTAL, true); scroll_to_image(); }, 'Fit image (Horizontal)', 'scale-image-hor');
    add_action(() => { scale_image(SCALE_MODES.VERTICAL,   true); scroll_to_image(); }, 'Fit image (Vertical)',   'scale-image-ver');
    add_action(() => { scale_image(SCALE_MODES.RESET,      true); scroll_to_image(); }, 'Reset image size',       'reset-image');

    if (PostPage.parent_id === null) return; // not logged in

    add_action(() => { flag_duplicate(PostPage.post_id, '');                       }, 'Flag duplicate',              'flag-duplicate');
    add_action(() => { flag_duplicate(PostPage.post_id, ', visually identical');   }, 'Flag duplicate (identical)',  'flag-duplicate-identical');
    add_action(() => { flag_duplicate(PostPage.post_id, ' with worse quality');    }, 'Flag duplicate (quality)',    'flag-duplicate-quality');
    add_action(() => { flag_duplicate(PostPage.post_id, ' with worse resolution'); }, 'Flag duplicate (resolution)', 'flag-duplicate-resolution');

    add_action(copy_translations,  'Copy Notes',  'copy-notes');
    add_action(paste_translations, 'Paste Notes', 'paste-notes');
  }

  function add_flagger_links() {
    for (const a of document.querySelectorAll('.flag-and-reason-count > a')) {
      const username = a.innerText;

      const flagged = document.createElement('A');
      flagged.innerText = 'flagged';
      flagged.href = get_search_url(`flagger:${username}`);

      a.insertAdjacentText('afterend', ')');
      a.insertAdjacentElement('afterend', flagged);
      a.insertAdjacentText('afterend', ' (');
    }
  }

  function link_to_post_tag_history() {
    if (PostPage.post_id === null) return;

    for (const a of document.querySelectorAll('#subnavbar > li > a')) {
      try {
        const url = new URL(a.href);

        if (url.pathname.startsWith('/post_tag_history/index')) {
          url.search = 'post_id=' + PostPage.post_id;
          a.href = url;
        }

      } catch (ignored) {}
    }
  }

  function move_stats_to_edit_form() {
    try {

      // form display: flex
      // stats insertafter table
      // stats white-space: nowrap
      // #edit-form width: max-content
      // margin-left: 8px;

      const stats = document.getElementById('stats');

      const edit_form = document.getElementById('edit-form');
      if (edit_form === null) return;

      const table = edit_form.querySelector('table');

      edit_form.style.display = 'flex'; // add to the right

      insert_node_after(stats, table);
      stats.style.whiteSpace = 'nowrap';
      edit_form.style.width = 'max-content';
      stats.style.marginLeft = '8px';
    } catch (error) {
      console.error('[addon error] move_stats_to_edit_form failed with', error);
    }
  }

  function add_tag_buttons(form_id) {
    const edit_form = document.getElementById(form_id);
    if (edit_form === null) return; // not logged in

    const tags_div = document.getElementById('post-tags-container');
    if (tags_div) {
      // remove block display, let's div fit the text area
      tags_div.style.removeProperty('display');
    }

    const parent_el = document.getElementById('post_parent_id');

    {
      const el = document.createElement('BUTTON');
      el.id = 'clear_parent_id_button';
      el.innerText = 'Clear';
      el.onclick = () => { parent_el.value = ''; return false; };
      parent_el?.parentNode?.appendChild(el);
    }

    {
      const el = document.createElement('BUTTON');
      el.id = 'reset_parent_id_button';
      el.innerText = 'Reset';
      el.onclick = () => { reset_parent_id(); return false; };
      parent_el?.parentNode?.appendChild(el);
    }

    const tag_button_place = document.querySelector('#edit-post-submit')?.parentElement;
    if (!tag_button_place) {
      show_notice(console.error, '[addon error] couldn\'t find tags submit button');
      return;
    }

    if (tag_button_place.align === 'right') {
      tag_button_place.align = 'left';
    }

    {
      const el = document.createElement('BUTTON');
      el.id = 'tag_reset_button';
      el.innerText = 'Reset';
      el.onclick = () => { reset_tags(); return false; };
      tag_button_place?.appendChild(el);
    }

    const append_tag_button = (id, tag) => {
      const el = document.createElement('BUTTON');
      el.id = id;
      el.className = 'SA-tag-button';
      el.dataset['tag'] = tag;
      el.onclick = () => { toggle_post_tag(tag); return false; };
      tag_button_place?.appendChild(el);
    };

    append_tag_button('tag_dup_button',     'duplicate');
    append_tag_button('tag_var_button',     'legitimate_variation');
    append_tag_button('tag_rev_button',     'revision');
    append_tag_button('tag_has_rev_button', 'has_revised_version');
    append_tag_button('tag_pot_button',     'potential_duplicate');
  }

  function update_tag_buttons() {
    const taglist = get_post_tags_el();
    if (taglist === null)
      return;

    const tags = get_post_tags();

    for (const button of document.querySelectorAll('.SA-tag-button')) {
      const tag = button.dataset['tag'];

      if (tag === 'potential_duplicate') {
        if (tags.has(tag)) {
          button.disabled = false;
          button.style.removeProperty('cursor');
        } else {
          button.disabled = true;
          button.style.cursor = 'not-allowed';
        }
      }

      button.innerText = (tags?.has(tag) ? '-' : '+') + tag;
    }
  }

  function reset_parent_id() {
    document.getElementById('post_parent_id').value = PostPage.parent_id;
  }

  function get_post_old_tags_el() {
    return document.querySelector('#post_old_tags, #SA-post_old_tags');
  }

  function get_post_tags_el() {
    return document.querySelector('#post_tags, #SA-post_tags');
  }

  function get_post_old_tags() {
    return new Tags(get_post_old_tags_el()?.value);
  }

  function get_post_tags() {
    return new Tags(get_post_tags_el()?.value);
  }

  function toggle_post_tag(tag, skip_common_tags_update = false) {
    if (get_post_tags().has(tag)) {
      remove_post_tag(tag, skip_common_tags_update);
    } else {
      add_post_tag(tag, skip_common_tags_update);
    }
  }

  function add_post_tag(tag, skip_common_tags_update = false) {
    const tags_el = get_post_tags_el();
    const tags = get_post_tags();

    if ((tag === 'duplicate' && tags.has('legitimate_variation')) || (tag === 'legitimate_variation' && tags.has('duplicate'))) {
      show_notice(console.warn, '[addon] cannot tag as duplicate and legitimate_variation at the same time.');
      return;
    }

    tags.add(tag);
    tags_el.value = tags.toString() + ' ';

    update_tag_elements(skip_common_tags_update);
  }

  function remove_post_tag(tag, skip_common_tags_update = false) {
    const tags = get_post_tags();

    tags.remove(tag);
    get_post_tags_el().value = tags.toString() + ' ';

    update_tag_elements(skip_common_tags_update);
  }

  function delete_useless_tags_tag() {
    if (config.editform_deleteuselesstags) remove_post_tag('useless_tags');
  }

  function reset_tags() {
    get_post_tags_el().value = get_post_old_tags_el().value;
    update_tag_elements();
  }

  function update_tag_elements(skip_common_tags = false) {
    update_tag_buttons();

    const tag_menu = document.getElementById('tag_menu');
    if (tag_menu !== null && tag_menu.style.display !== 'none') {
      update_tag_menu(skip_common_tags);
    }
  }



  // flag option with default text
  function flag_duplicate(post_id, reason_suffix) {
    if (post_id === null) {
      show_notice(console.error, '[addon] no post id, report to author!');
      return;
    }
    if (PostPage.parent_id === null) {
      show_notice(console.warn, '[addon] parent id not found, not logged in?');
      return;
    }

    const current_parent_id = document.getElementById('post_parent_id')?.value;
    if (current_parent_id !== PostPage.parent_id) {
      show_notice(console.warn, '[addon] parent id was changed but not saved!');
      return;
    }

    if (!current_parent_id || current_parent_id.length === 0) {
      show_notice(console.warn, '[addon] no parent id set!');
      return;
    }

    const tags = get_post_tags();
    const old_tags = get_post_old_tags();
    if (tags.has('duplicate') && !old_tags.has('duplicate')) {
      show_notice(console.warn, '[addon] duplicate tag set but not saved!');
      return;
    }
    if (!old_tags.has('duplicate')) {
      show_notice(console.warn, '[addon] not tagged as duplicate!');
      return;
    }

    if (old_tags.has('legitimate_variation') || old_tags.has('revision'))
      if (!window.confirm('Post is tagged as a legitimate_variation or revision, it may not be a duplicate!\n\nFlag it anyway?'))
        return;

    const reason = window.prompt('Why should this post be reconsidered for moderation?', `duplicate of ${PostPage.parent_id}${reason_suffix}`);
    if (reason === null)
      return;

    const flag_reason = document.getElementById('other_reason');
    const flag_confirm = document.getElementById('confirm');
    const flag_form = flag_reason?.parentElement;
    if (flag_reason === null || flag_confirm === null) {
      show_notice(console.error, '[addon error] couldn\'t find flag form');
      return;
    }

    flag_reason.value = reason;
    flag_confirm.checked = true;

    (async function() {
      try {
        const response = await fetch(new URL(flag_form.action, document.location.origin), {
          method: 'POST',
          body: new FormData(flag_form),
        });

        if (!response.ok) {
          show_notice(console.error, `[addon error] non-OK status code ${response.status}`);
          return;
        }

        show_notice(console.log, 'Post was resent to moderation queue');
      } catch (error) {
        show_notice(console.error, '[addon error] error flagging post!', error);
      }
    })();
  }

  // writes to image_data once finished
  async function read_image_data() {
    const data = {
      img_elem: null, // <img>, <video> or <object> (in case of flash)
      emb_elem: null, non_img_div: null, // flash is <object><embed>, we need the <div> it's in as well
      is_flash: false,
      width: null,
      height: null,
      aspect_ratio: null,
    };

    // image or video
    const img = document.getElementById('image');
    if (img !== null) {
      data.img_elem = img;

      // the href of this element is removed when the original image is loaded
      const sample_link = document.querySelector('a#image-link.sample');
      const is_sample = sample_link !== null && sample_link.hasAttribute('href');

      let res = null;
      if (is_sample) {
        const lowres = document.getElementById('lowres');
        if (lowres !== null) {
          res = lowres.innerText.split('x'); // parse "<width>x<height>"
        }
      } else {
        const highres = document.getElementById('highres');
        if (highres !== null) {
          res = highres.innerText.split(' ')[0].split('x'); // parse "<width>x<height> (<file size>)"
        }

        if (res === null) {
          if (img.hasAttribute('orig_width') && img.hasAttribute('orig_height')) {
            res = [img.getAttribute('orig_width'), img.getAttribute('orig_height')];
          }
        }
      }

      // always use fallback when image has Exif orientation
      if (get_post_tags().has('exif_rotation'))
        res = null;

      if (res === null) {
        console.log('[addon] Couldn\'t read resolution from details section, waiting for image size...');

        // last resort: try to read natural size
        // when loading the original image, this can read the old preview size instead, which shouldn't be a huge deal since
        // this happens after image scrolling (see is_done_scrolling()) and the aspect ratio is approximately correct
        // TODO: this will however break the manual image scrolling

        // TODO: should abort when content failed loading
        while ((res = get_resolution(img)) === null)
          await sleep(20);
      }

      data.width  = Number(res[0]);
      data.height = Number(res[1]);
      console.log('[addon] Read image or video resolution ', data.width, 'x', data.height);

      data.aspect_ratio = data.width / data.height;
      image_data = data;
      return;
    }

    // flash or unknown
    const non_img = document.getElementById('non-image-content');
    if (non_img !== null) {
      data.non_img_div = non_img;

      const objs = non_img.getElementsByTagName('OBJECT');
      const embs = non_img.getElementsByTagName('EMBED');
      data.is_flash = (objs.length === 1 && embs.length === 1); // <object><embed>

      if (!data.is_flash) {
        show_notice(console.error, '[addon error] unknown post content! Can\'t read width/height.');
        return;
      }

      data.img_elem = objs[0];
      data.emb_elem = embs[0];
      // <object> contains width/height in both Firefox and Chrome
      data.width  = data.img_elem.width;
      data.height = data.img_elem.height;
      console.log('[addon] Read resolution ', data.width, 'x', data.height);

      data.aspect_ratio = data.width / data.height;
      image_data = data;
    }
  }

  const SCALE_MODES = { RESET: -1, FIT: 0, HORIZONTAL: 1, VERTICAL: 2 };

  // stretch image/video/flash, requires data from read_image_data()
  function scale_image(mode, always_scale) {
    if (image_data === null) return; // read_image_data() failed

    if (!always_scale && (!config.scale_flash && image_data.is_flash))
      return;

    // We can't use transform scale because it doesn't change the DOM size (so the image could be covered up by other elements)
    // We also can't use style.width/height because translation notes rely on .width/.height
    const set_dimensions = (obj, dim) => {
      obj.width  = dim.width;
      obj.height = dim.height;
    };

    // reset image size
    if (mode === SCALE_MODES.RESET) {
      if (!image_data.is_flash) {
        set_dimensions(image_data.img_elem, image_data);
        image_data.img_elem.classList.add('fit-width');
        image_data.img_elem.classList.add('fit-height');
        adjust_notes();
      } else {
        set_dimensions(image_data.img_elem, image_data);
        set_dimensions(image_data.emb_elem, image_data);
      }

      return;
    }

    const left_side = image_data.img_elem.getBoundingClientRect().left + window.scrollX;
    const target_w = Math.max(window.innerWidth - Math.ceil(left_side) - get_scrollbar_width(), 1);
    const target_h = Math.max(window.innerHeight, 1);
    const target_aspect_ratio = target_w / target_h;

    if (mode === SCALE_MODES.FIT)
      mode = (image_data.aspect_ratio > target_aspect_ratio ? SCALE_MODES.HORIZONTAL : SCALE_MODES.VERTICAL);

    const scaled = {};
    if (mode === SCALE_MODES.HORIZONTAL) {
      scaled.width  = Math.floor(target_w);
      scaled.height = Math.floor(target_w / image_data.aspect_ratio);
    } else if (mode === SCALE_MODES.VERTICAL) {
      scaled.width  = Math.floor(target_h * image_data.aspect_ratio);
      scaled.height = Math.floor(target_h);
    }

    if (!always_scale && (config.scale_only_downscale && (scaled.width > image_data.width || scaled.height > image_data.height)))
      return;

    if (!image_data.is_flash) {
      set_dimensions(image_data.img_elem, scaled);
      image_data.img_elem.classList.remove('fit-width');
      image_data.img_elem.classList.remove('fit-height');
      adjust_notes();
    } else {
      set_dimensions(image_data.img_elem, scaled);
      set_dimensions(image_data.emb_elem, scaled);
    }
  }

  function adjust_notes() {
    for (const note of unsafeWindow.Note?.all ?? []) {
      note.adjustScale(); // this relies on the image's .width and .height
    }
  }

  function scale_on_resize_helper() {
    clearTimeout(resize_timer);
    resize_timer = setTimeout(() => {
      if (config.scale_on_resize) scale_image(config.scale_mode, false);
    }, 100);
  }

  function add_scale_on_resize_listener() {
    window.addEventListener('resize', scale_on_resize_helper);
  }

  function remove_scale_on_resize_listener() {
    window.removeEventListener('resize', scale_on_resize_helper);
  }

  function scroll_to_image() {
    window.requestAnimationFrame(() => {
      if (image_data === null) return;
      const img_rect = (image_data.is_flash ? image_data.non_img_div : image_data.img_elem).getBoundingClientRect();
      const absolute_img_top = Math.round(img_rect.top) + window.scrollY;
      if (config.scroll_to_image_center && img_rect.height !== 0) { // TODO height may or may not be 0, needs more testing
        const top_of_centered_rect = absolute_img_top - (window.innerHeight - img_rect.height) / 2;
        window.scrollTo(0, top_of_centered_rect);
      } else {
        window.scrollTo(0, absolute_img_top);
      }
      done_scrolling = true;
    });
  }

  // when resize notice is hidden (e.g. original image is loaded), scroll to make up the difference
  function add_resize_notice_listener() {
    const resized_notice = document.getElementById('resized_notice');
    if (image_data === null || resized_notice === null) return;

    const notice_y_diff = image_data.img_elem.getBoundingClientRect().top - resized_notice.getBoundingClientRect().top;

    const observer = new MutationObserver(() => {
      observer.disconnect();
      window.scrollBy(0, -notice_y_diff);
    });
    observer.observe(resized_notice, { attributeFilter: ['style'] });
  }

  function add_highres_listener() {
    const img = document.getElementById('image');
    if (img === null) return;

    const observer = new MutationObserver(() => {
      // image is cleared before highres image is loaded
      if (img.src === 'about:blank') return;
      observer.disconnect();

      // re-read image size in case get_resolution() had to be used
      read_image_data().then(() => {
        if (config.scale_image) scale_image(config.scale_mode, false);
      });
    });

    observer.observe(img, { attributeFilter: ['src'] });
  }

  async function load_highres() {
    if (!config.load_highres) return;

    if (config.highres_limit > 0) {
      const highres = document.getElementById('highres');
      if (highres !== null) {
        let size = highres.title; // e.g. "1,738,253 bytes"
        size = size.replaceAll(',', '');
        size = parseInt(size, 10);

        if (size > config.highres_limit) {
          return;
        }
      }
    }

    while (!is_done_scrolling() || unsafeWindow.Post?.highres === undefined)
      await sleep(20);

    // mimic sitescript
    unsafeWindow.jQuery('a#image-link.sample').unbind('click').removeAttr('href');
    unsafeWindow.Post.highres();
  }

  function redirect_v_to_s_server() {
    const img = document.getElementById('image');
    if (img === null) return;

    const url = new URL(img.src);
    if (url.host === 'v.sankakucomplex.com') {
      url.host = 's.sankakucomplex.com';
      img.src = url;
    }
  }

  function add_postpage_hotkeys() {
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      for (const hotkey of config.postpage_hotkeys) {
        hotkey.call(e);
      }
    }, true);
  }

  // sitefix: fix pixiv source links under 'Details'
  // issue: source links of the form https://www.pixiv.net/artworks/<id> turn into
  // https://www.pixiv.net/artworks/https://www.pixiv.net/artworks/<id>
  // doesn't happen for https://www.pixiv.net/en/artworks/<id>
  // or the old format https://www.pixiv.net/member_illust.php?mode=medium&illust_id=<id>
  function fix_source_link() {
    const stats = document.getElementById('stats');
    if (stats === null) return;

    for (const link of stats.getElementsByTagName('A')) {
      if (!link.href) continue;
      if (link.href.startsWith('https://www.pixiv.net/artworks/')) {
        const id = link.href.substring('https://www.pixiv.net/artworks/'.length);
        try {
          new URL(id); // throws if not a valid URL
          link.href = id;
        } catch (ignore) { }
      } else {
        const match = /https:\/\/pictures.hentai-foundry.com\/[^/]\/([^/]+)\/(\d+)\//.exec(link.href);
        if (match) {
          const [,user, post_id] = match;
          link.href = `https://www.hentai-foundry.com/pictures/user/${user}/${post_id}`;
        }
      }
    }
  }

  /***********************/
  /* wiki page functions */
  /***********************/

  function add_wiki_template() {
    if (config.wiki_template.length === 0) return;

    const wiki_form = document.getElementById('wiki-form');
    const wiki_body = document.getElementById('wiki_page_body');

    if (wiki_form === null || wiki_body === null) {
      show_notice(console.error, '[addon error] couldn\'t find "wiki-form" or "wiki_page_body", wiki template disabled');
      return;
    }

    wiki_form.style.display = 'flex'; // add template to the right

    const div = document.createElement('DIV');
    div.style.marginLeft = '1em';

    const template_label = document.createElement('LABEL');
    template_label.innerText = 'Wiki Template';
    template_label.style.cursor = 'help';
    template_label.style.textDecoration = 'underline dashed';
    template_label.title = 'Selected text can be appended to the page body. Clicking or using arrow keys selects a whole line, pressing \'c\' or the button below copies the selection over';

    const template_text = document.createElement('TEXTAREA');
    template_text.id = 'wiki_template_text';
    template_text.cols = wiki_body.cols;
    template_text.rows = wiki_body.rows;
    template_text.style.width = '33em';
    template_text.style.marginTop = '0';
    template_text.value = config.wiki_template;

    const insert_template_selection = () => {
      const text = template_text.value;
      const a = template_text.selectionStart;
      const b = template_text.selectionEnd;

      const selection = text.substring(a, b);
      const add_newline = wiki_body.value && !wiki_body.value.endsWith('\n');
      wiki_body.value += (add_newline ? '\n' : '') + selection;
    };

    const extend_selection = () => {
      // extend empty selection to newlines (or text start/end)
      const text = template_text.value;
      let a = template_text.selectionStart;
      let b = template_text.selectionEnd;

      if (a === b) {
        const ext_a = text.lastIndexOf('\n', a - 1);
        a = (ext_a !== -1 ? ext_a + 1 : 0);

        if (text.charAt(b) !== '\n') {
          const ext_b = text.indexOf('\n', b + 1);
          b = (ext_b !== -1 ? ext_b - 1 : text.length - 1) + 1;
        }

        template_text.setSelectionRange(a, b);
      }
    };

    template_text.readOnly = true; // hides the caret and there's no easy workaround
    template_text.addEventListener('click', extend_selection);
    template_text.addEventListener('keyup', extend_selection);
    template_text.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.altKey || e.shiftKey) return;
      if (e.key === 'c') insert_template_selection();
    });

    const btn = document.createElement('BUTTON');
    btn.innerText = 'Copy selection over';
    btn.style.fontWeight = 'bold';
    btn.style.padding = '0.2em 2em';
    btn.style.margin = '0.1em';
    btn.onclick = () => { insert_template_selection(); template_text.focus(); return false; };

    div.appendChild(template_label);
    div.appendChild(document.createElement('BR'));
    div.appendChild(template_text);
    div.appendChild(document.createElement('BR'));
    div.appendChild(btn);
    wiki_form.appendChild(div);

    div.style.marginTop = (wiki_body.getBoundingClientRect().top - wiki_form.getBoundingClientRect().top - template_label.getBoundingClientRect().height - 1) + 'px';
  }

  function add_status_post_links() {
    const random_posts = [...document.querySelectorAll('.highlightable a')].find(a => a.href.endsWith('%20order%3Arandom'));
    if (!random_posts) return;
    const user_posts = random_posts.parentElement.children[0].href;
    const username = new URL(user_posts).searchParams.get('tags').substring('user:'.length);

    const status_post_link = (name, search) => {
      const a = document.createElement('A');
      a.href = get_search_url(search);
      a.innerText = name;
      return a;
    };

    let dateSearch = '';
    if (get_username() !== username) { // not your own profile
      // Thanks to Evaera
      // add leeway of 3 days to tag count searches (should be 2 days but date search goes by server time, which can differ from local UTC by up to 14 hours)
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const dd = String(threeDaysAgo.getUTCDate()).padStart(2, '0');
      const mm = String(threeDaysAgo.getUTCMonth() + 1).padStart(2, '0');
      const yyyy = threeDaysAgo.getUTCFullYear();
      dateSearch = ` date:<${yyyy}-${mm}-${dd}`;
    }

    insert_node_after(status_post_link('approver', `approver:${username}`), random_posts);
    insert_node_after(document.createTextNode(', '), random_posts);
    insert_node_after(status_post_link('flagger', `flagger:${username}`), random_posts);
    insert_node_after(document.createTextNode(', '), random_posts);
    insert_node_after(status_post_link('artist_tag_count:0', `user:${username} artist_tag_count:0${dateSearch}`), random_posts);
    insert_node_after(document.createTextNode(', '), random_posts);
    insert_node_after(status_post_link('general_tag_count:<13', `user:${username} general_tag_count:<13${dateSearch}`), random_posts);
    insert_node_after(document.createTextNode(', '), random_posts);
    insert_node_after(status_post_link('tagme', `user:${username} tagme${dateSearch}`), random_posts);
    insert_node_after(document.createTextNode(', '), random_posts);
    insert_node_after(status_post_link('flagged', `user:${username} status:flagged`), random_posts);
    insert_node_after(document.createTextNode(', '), random_posts);
    insert_node_after(status_post_link('unapproved', `user:${username} status:pending`), random_posts);
    insert_node_after(document.createTextNode(', '), random_posts);
  }

  function add_record_template() {
    const record_body = document.getElementById('user_record_body');
    const record_score = document.getElementById('user_record_score');

    if (record_body === null || record_score === null) {
      show_notice(console.error, 'couldn\'t find record elements, disabled template');
      return;
    }

    const label = document.createElement('SPAN');
    label.innerText = 'Template:';
    label.style.marginLeft = '0.5em';
    label.style.marginRight = '0.5em';
    insert_node_after(label, record_score);

    // the JSON is supposed to be an array of 2-or-3-entry-arrays, which converts to Map
    const raw_templates = JSON.parse(config.record_template);

    const templates = new Map();
    for (const [title, content, raw_score] of raw_templates) {
      let score = null;
      if (typeof raw_score !== 'undefined') {
        score = raw_score.toLowerCase();

        if (score === 'neutral') score = 0;
        else if (score === 'positive') score = 1;
        else if (score === 'negative') score = -1;
        else score = null;
      }

      if (score === null) {
        show_notice(console.error, '[addon error] record template has invalid score, see console for details', [title, content, raw_score]);
      }

      templates.set(title, { content, score });
    }

    const apply_template = (template) => {
      record_body.value = template.content;
      if (template.score !== null) record_score.value = template.score;
    };

    const dropdown = create_template_dropdown(templates, apply_template);
    dropdown.id = 'template_dropdown';
    insert_node_after(dropdown, label);
  }

  function add_tagscript_presets() {
    if (!IndexPage.has_tag_scripts) return;

    const mode_menu = document.getElementById('mode-menu');
    if (mode_menu === null) {
      show_notice(console.error, '[addon error] couldn\'t find "Mode" menu, disabled tagscript presets');
      return;
    }

    // the JSON is supposed to be an array of 2-entry-arrays, which converts to Map
    const presets = new Map(JSON.parse(config.tagscript_presets));

    if (presets.size === 0)
      return;

    mode_menu.appendChild(document.createElement('P'));

    const label = document.createElement('H5');
    label.innerText = 'Tag Script Presets';
    mode_menu.appendChild(label);

    const set_tag_script = (script) => {
      set_cookie('tag-script', script);
      select_mode('apply-tag-script');
    };

    const dropdown = create_template_dropdown(presets, set_tag_script);
    dropdown.id = 'tagscript_presets_dropdown';
    mode_menu.appendChild(dropdown);
  }

  function create_template_dropdown(templates, change_event) {
    const dropdown = document.createElement('SELECT');

    const empty_option = document.createElement('OPTION');
    empty_option.disabled = true;
    empty_option.selected = true;
    empty_option.style.display = 'none';
    dropdown.appendChild(empty_option);

    for (const [title, value] of templates.entries()) {
      const option = document.createElement('OPTION');
      option.innerText = title;

      // somewhat redundant to the change event but allows to "reset" the text to an already selected template
      option.addEventListener('click', (e) => {
        change_event(value);
        e.preventDefault();
      });

      dropdown.appendChild(option);
    }

    dropdown.addEventListener('change', (e) => {
      change_event(templates.get(dropdown.value));
      e.preventDefault();
    });

    return dropdown;
  }

  function add_tag_edit_gear() { // add a "⚙" link to the tag edit page
    try {
      const h2 = document.querySelector('.title');

      if (WikiPage.tag === 'recent_changes') return;

      const a = document.createElement('A');
      const url = new URL(`${get_lang_path()}/tag_histories`, document.location.origin);
      url.searchParams.set('tag_name', WikiPage.tag);
      a.href = url.href;
      a.innerText = '⚙';
      a.title = 'Tag History (with edit link)';

      h2.appendChild(a);
    } catch (error) {
      show_notice(console.error, '[addon error] couldn\'t add "⚙" tag page link, check console', error);
    }
  }

  function add_tag_history_link() { // add a "History »" link to the tag history page
    try {
      const info = document.querySelector('.tag-information');
      const related = document.querySelector('.related-tags');

      // use the hidden form field because url can either be e.g. /tags/edit?name=high_resolution or /tags/edit/464292
      const tag = document.getElementById('tag_name').value;

      const div = document.createElement('DIV');
      const h4 = document.createElement('H4');
      const a = document.createElement('A');
      a.href = '/tag_histories?tag_name=' + tag;
      a.innerText = 'History »';

      div.appendChild(h4);
      h4.appendChild(a);

      if (related !== null) {
        related.insertAdjacentElement('afterend', div);
      } else {
        info.prepend(div);
      }
    } catch (error) {
      show_notice(console.error, '[addon error] couldn\'t add tag history page link, check console', error);
    }
  }

  function deletion_sanity_checks() { // for duplicates
    const thumbs = [...document.querySelectorAll('#content > .deleting-post .thumb')];
    if (thumbs.length !== 2)
      return; // no parent

    const WARNING_TEXT = '<b style="color: crimson">Warning: </b>';
    const CHECKED_TAGS = ['upscaled', 'legitimate_variation', 'revision', 'third-party_edit', 'decensored', 'potential_upscale', 'md5_mismatch', 'resolution_mismatch'];
    const CHECKED_COMBINATIONS = [['censored', 'uncensored']];

    // remove old warnings before re-evaluating
    document.querySelectorAll('.SA-warning').forEach((el) => el.remove());

    const posts = thumbs.map(get_post_from_thumb);

    const warn_tags = posts.map(post => post.tags.filter(tag => CHECKED_TAGS.includes(tag)));

    for (const [tag1, tag2] of CHECKED_COMBINATIONS) {
      for (let i = 0; i < 2; i++) {
        if (posts[i].tags.includes(tag1) && posts[1 - i].tags.includes(tag2)) {
          warn_tags[i].push(tag1);
          warn_tags[1 - i].push(tag2);
        }
      }
    }

    const convert_to_margin = (thumb) => {
      const a = thumb.querySelector('a');
      const y_diff = a.getBoundingClientRect().top - thumb.getBoundingClientRect().top;

      // the thumbnail image is centered in a grid (see adjust_css()), which will move it up when something is added below it
      // to fix this we replace the vertical centering with a margin (and allow the thumbnail to scale vertically too)

      // fix thumbnail in place vertically
      a.style.marginTop = `${y_diff}px`;
      thumb.style.alignContent = 'start';
      // make thumbnail scale vertically
      thumb.style.minHeight = window.getComputedStyle(thumb).height;
      thumb.style.height = 'auto';
    };

    thumbs.forEach(convert_to_margin);

    const add_tags_below_thumb = (thumb, tags, missing) => {
      for (const tag of tags) {
        const span = document.createElement('SPAN');
        span.className = 'SA-warning';
        span.style.color = 'crimson';
        span.style.fontWeight = 'bold';
        if (missing) span.style.textDecoration = 'line-through';
        span.innerText = tag;

        thumb.appendChild(span);
      }
    };

    for (let i = 0; i < thumbs.length; i++) {
      add_tags_below_thumb(thumbs[i], warn_tags[i]);
    }

    if (!posts[0].tags.includes('duplicate')) {
      add_tags_below_thumb(thumbs[0], ['duplicate'], true);
    }

    const integer_multiple = (a, b) => {
      if (a < b) return integer_multiple(b, a);
      if (a > b && a % b === 0) {
        return a / b;
      }
      return NaN;
    };

    const widths = [];
    const heights = [];

    // read resolutions
    const res = document.querySelector('#content > .deleting-post > ul > li:nth-child(2)');
    for (const b of res.getElementsByTagName('B')) {
      const match = /([\d]+)x([\d]+)/.exec(b.innerText);
      if (match) {
        const [, width, height] = match;
        widths.push(Number(width));
        heights.push(Number(height));
      }
    }

    // add potential upscale warning
    const multiple = integer_multiple(...widths);
    if (multiple === integer_multiple(...heights)) {
      const span = document.createElement('SPAN');
      span.className = 'SA-warning';
      span.innerHTML = ` ${WARNING_TEXT} potential ${multiple}x upscale`;
      res.insertAdjacentElement('beforeend', span);
    }
  }

  function add_custom_duplicate_delete_reason() {
    const reason = document.getElementById('reason');
    const custom_reason = document.getElementById('custom_reason');

    const thumbs = [...document.querySelectorAll('#content > .deleting-post .thumb')];
    if (thumbs.length !== 2)
      return; // no parent

    const parent_id = thumbs[1].id.substring(1);

    const custom_dupe_option = document.createElement('OPTION');
    custom_dupe_option.innerText = `duplicate of ${parent_id} (custom reason)`;
    reason.appendChild(custom_dupe_option);

    reason.addEventListener('change', () => {
      const i = reason.selectedIndex;
      if (i === 0) return;

      const is_custom_dupe = reason.options[i] === custom_dupe_option;

      if (is_custom_dupe) {
        reason.selectedIndex = 0;
        custom_reason.value = `duplicate of ${parent_id} (...)`;
        custom_reason.focus();
        custom_reason.setSelectionRange(custom_reason.value.length - 4, custom_reason.value.length - 1);
      }
    });
  }

  function add_tags_copy_button() {
    const tags_not_present = document.querySelector('#content > .deleting-post > ul > li:nth-child(7)');
    if (tags_not_present === null) return;

    let tags_diff = ' ';
    for (const a of tags_not_present.getElementsByTagName('A')) {
      const tag = a.innerText.replaceAll(' ', '_');
      if (['duplicate', 'potential_duplicate'].includes(tag)) continue; // TODO: ignore all meta tags?
      tags_diff += tag + ' ';
    }

    const button = document.createElement('BUTTON');
    button.type = 'button';
    button.innerText = 'Copy Tags';
    button.onclick = () => set_clipboard(tags_diff);

    tags_not_present.appendChild(button);
  }

  function add_post_edit_buttons() {
    // cache thumbnail tags
    for (const thumb of document.querySelectorAll('.thumb'))
      get_post_from_thumb(thumb);

    const thumbs = [...document.querySelectorAll('.deleting-post .thumb')];
    for (const thumb of thumbs) {
      const a = document.createElement('A');
      a.innerText = '⚙';
      a.style.fontSize = '120%';
      a.href = '#';
      a.onclick = () => {
        open_post_edit_dialog(thumb);
        return false;
      };
      thumb.appendChild(a);
    }
  }

  function add_moderation_search_template() {
    const query = document.getElementById('query');
    const select = create_template_dropdown(new Map([
      ['Pending Posts', {add: ['status:pending'], remove: ['order:recently_flagged']}],
      ['Flagged Posts', {add: ['order:recently_flagged', '-status:pending'], remove: []}]
    ]), (value) => {
      select.selectedIndex = 0;

      const search_tags = new Tags(query.value);
      for (const tag of value.remove) {
        search_tags.remove(tag);
      }
      for (const tag of value.add) {
        search_tags.add(tag);
      }

      query.value = search_tags.toString() + ' ';
      query.focus();
    });

    const search_button = document.querySelector('#content > form > button');
    search_button.insertAdjacentElement('afterend', select);
    search_button.insertAdjacentText('afterend', ' ');
  }

  function get_lang_path() {
    const lang = get_cookie('locale');
    return lang && lang !== 'en' ? '/' + lang : '';
  }

  function old_wiki_tag_links() {
    if (!config.use_old_wiki) return;

    const lang = get_lang_path();

    const revert_beta_link = (a, is_tag_edit_link) => {
      try {
        const url = new URL(a.href);
        if (url.hostname !== 'beta.sankakucomplex.com') return;
        const tag = url.searchParams.get('tagName');

        if (url.pathname.startsWith('/tag/history')) {
          a.href = new URL(`${lang}/tag_histories?tag_name=${tag}`, document.location.origin).href;
        } else if (url.pathname.startsWith('/tag/')) {
          // tag index "Edit" link
          if (is_tag_edit_link) {
            // tag edit page still exists but needs id: /tags/<id>/edit, tag history has working edit link
            a.href = new URL(`${lang}/tag_histories?tag_name=${tag}`, document.location.origin).href;
          } else {
            a.href = new URL(`${lang}/wiki/${tag}`, document.location.origin).href;
          }
        } else if (url.pathname === '/') {
          const tags = url.searchParams.get('tags');
          a.href = new URL(`${lang}/?tags=${tags}`, document.location.origin).href;
        }
      } catch (e) { console.error('[addon error] failed reverting beta link', a.href, e); }
    };

    if (General.page === Page.TagIndex) {
      document.querySelectorAll('tbody td:nth-child(6) a').forEach(a => revert_beta_link(a, true));
      document.querySelectorAll('tbody a').forEach(a => revert_beta_link(a));
    } else {
      document.querySelectorAll('.tooltip a').forEach(a => revert_beta_link(a));
    }
  }

  function old_wiki_subnav_links() {
    if (!config.use_old_wiki) return;

    const lang = get_lang_path();

    for (const a of document.querySelectorAll('#subnavbar a')) {
      const url = new URL(a.href);
      if (url.hostname !== 'beta.sankakucomplex.com') continue;

      if (a.pathname === '/wiki/edit_article') {
        const tag = url.searchParams.get('tagName');
        a.href = new URL(`${lang}/wiki/edit?title=${tag}`, document.location.origin).href;
      } else if (a.pathname === '/wiki/article_history') {
        // TODO this currently points to the history tag wiki
        //a.href = new URL(`${lang}/wiki/history?title=${tag}`, document.location.origin).href;
        a.style.color = 'red';
      } else if (a.pathname === '/wiki/create_article') {
        a.href = new URL(`${lang}/wiki/new`, document.location.origin).href;
      } else if (a.pathname === '/') {
        const tag = url.searchParams.get('tags');
        a.href = new URL(`${lang}/?tags=${tag}`, document.location.origin).href;
      }
    }
  }

  function old_pools_post_link() {
    if (!config.use_old_pools) return;

    for (const el of document.querySelectorAll('.status-notice')) {
      if (el.id.startsWith('pool')) {
        const pool_id = el.id.substring(4);

        for (const a of el.querySelectorAll('a')) {
          const url = new URL(a.href);
          if (url.hostname !== 'beta.sankakucomplex.com') continue;

          a.href = new URL(`${get_lang_path()}/pools/${pool_id}`, document.location.origin).href;
          break;
        }
      }
    }
  }

  function old_nav_links() {
    for (const a of document.querySelectorAll('#navbar a')) {
      const url = new URL(a.href);
      if (url.hostname !== 'beta.sankakucomplex.com') continue;

      let reset_color = false;

      if (config.use_old_pools && a.pathname === '/books') {
        a.href = new URL(`${get_lang_path()}/pools`, document.location.origin).href;
        reset_color = true;
      } else if (config.use_old_tags_index && a.pathname === '/tags') {
        a.href = new URL(`${get_lang_path()}/tags`, document.location.origin).href;
        reset_color = true;
      }

      if (reset_color) {
        const font = a.querySelector('font');
        if (font) font.style.color = 'unset';
      }
    }
  }


  /******************/
  /* document-start */
  /******************/

  await load_config();

  let pathname = window.location.pathname;

  // strip language codes in pathnames like "/ja/post/show"
  if (pathname.indexOf('/', 1) === 3) pathname = pathname.substring(3);

  // normalize old singulars to plurals
  for (const path of ['post', 'user', 'user_record', 'tag']) {
    if (pathname.startsWith(`/${path}/`) || pathname === '/' + path)
      pathname = `/${path}s` + pathname.slice(5);
  }

  // normalize post index
  if (pathname.startsWith('/posts/index') || pathname === '/posts')
    pathname = '/';

  const segments = pathname.split('/').filter(Boolean);

  // match_segments('posts', 'delete') will match 'posts/[.../.../]delete[/...]'
  function match_segments(...ordered) {
    let i = 0;

    return ordered.every(m => {
      // search next segment
      while (i < segments.length) {
        if (segments[i++] === m) {
          return true;
        }
      }

      return false;
    });
  }

  // detect page
  if (pathname === '/' || (match_segments('posts') && segments.length === 1)
      || match_segments('posts', 'similar'))                  General.page = Page.Index;
  else if (match_segments('posts', 'delete'))                 General.page = Page.Delete;
  else if (match_segments('posts', 'moderate'))               General.page = Page.Moderate;
  else if (match_segments('posts', 'upload'))                 General.page = Page.Upload;
  else if (match_segments('posts'))                           General.page = Page.Post;
  else if (match_segments('pools'))                           General.page = Page.Pool;
  else if (match_segments('wiki', 'new'))                     General.page = Page.WikiNew;
  else if (match_segments('wiki', 'edit'))                    General.page = Page.WikiEdit;
  else if (match_segments('wiki') && segments.length !== 1)   General.page = Page.WikiShow;
  else if (match_segments('tags', 'edit'))                    General.page = Page.Tag;
  else if (match_segments('tags'))                            General.page = Page.TagIndex;
  else if (match_segments('users'))                           General.page = Page.User;
  else if (match_segments('user_records', 'new'))             General.page = Page.AddRecord;

  // listen for config changes in other windows
  add_storage_change_listener();

  modify_css();

  // add thumbnail icons and fade out thumbnails
  modify_nodes('img.post-preview-image', modify_thumbnail, '.post-preview, #recommendations');

  switch (General.page) {
    case Page.Post:

      // mute/pause video
      modify_nodes('video#image', node => { configure_video(node); return true; });

      break;
  }




  /******************/
  /* content-loaded */
  /******************/

  async function init() {
    IndexPage.init();
    PostPage.init();
    WikiPage.init();
    PoolPage.init();

    add_config_dialog();
    if (IS_MONKEY) GM.registerMenuCommand('Open Addon Config', () => show_config_dialog(true), 'C');
    add_config_button();
    update_config_dialog();

    update_headerlogo();
    useful_beta_link();
    old_wiki_tag_links();
    old_wiki_subnav_links();
    old_nav_links();

    switch (General.page) {
      case Page.Index:
        add_mode_options();
        add_tagscript_presets();

        collect_tag_categories();
        if (config.tag_search_buttons) add_tag_search_buttons();
        if (config.tag_post_counts) add_tag_post_counts();
        add_postmode_hotkeys();

        // TODO Edit Tags mode currently broken
        // add_post_edit_dialog();
        // update_tag_elements(); // initialize tag menu/buttons
        // add_tags_change_listener();

        break;

      case Page.Post:
        // reading the post id can fail when rate limited (or when the website changes)
        if (config.view_history_enabled && PostPage.post_id !== null) {
          config[HISTORY_KEY].add(PostPage.post_id);
          save_setting(HISTORY_KEY, config[HISTORY_KEY]); // save and broadcast view history
        }

        collect_tag_categories();
        if (config.tag_search_buttons) add_tag_search_buttons();
        if (config.tag_post_counts) add_tag_post_counts();
        if (config.tag_category_collapser) add_tag_category_collapser();
        add_addon_actions(find_actions_list());

        add_flagger_links();
        link_to_post_tag_history();

        fix_source_link();
        if (config.move_stats_to_edit_form) move_stats_to_edit_form();

        add_tag_buttons('edit-form');
        if (config.tag_menu) add_tag_menu();
        update_tag_elements(); // initialize tag menu/buttons
        add_tags_change_listener();
        add_tags_submit_listener(); // specifically for edit-form

        add_postpage_hotkeys();
        if (config.scale_on_resize) add_scale_on_resize_listener();

        if (config.redirect_v_to_s_server) redirect_v_to_s_server();
        read_image_data().then(() => {
          if (config.scale_image) scale_image(config.scale_mode, false);
          if (config.scroll_to_image) scroll_to_image();
          add_resize_notice_listener();
          add_highres_listener();
          load_highres();
        });

        old_pools_post_link();

        break;

      case Page.WikiNew:
      case Page.WikiEdit:
        add_wiki_template();

        break;

      case Page.WikiShow:
        add_tag_edit_gear();

        break;

      case Page.Tag:
        add_tag_history_link();

        break;

      case Page.User:
        add_status_post_links();

        break;

      case Page.AddRecord:
        add_record_template();

        break;

      case Page.Delete:
        // TODO pretty much all of this is broken
        document.getElementById('custom_reason').style.minWidth = '25%';
        //add_custom_duplicate_delete_reason();
        //add_tags_copy_button();

        //add_post_edit_dialog();
        //add_post_edit_buttons();
        //update_tag_elements(); // initialize tag menu/buttons
        //add_tags_change_listener();

        //deletion_sanity_checks();

        break;

      case Page.Moderate:
        add_moderation_search_template();

        break;
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
    init().catch((reason) => {
      show_notice(console.error, '[addon error] init() failed, check console', reason);
    });
  } else {
    document.addEventListener('DOMContentLoaded', init, false);
  }
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
