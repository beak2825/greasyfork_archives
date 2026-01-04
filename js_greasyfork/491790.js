// ==UserScript==
// @name         Hentaiverse Monsterbation
// @namespace    hvmonsterbate
// @version      1.4.1.3w
// @description  M-M-M-MONSTERBATE!!
// @match        *://*.hentaiverse.org/*
// @exclude      *hentaiverse.org/equip/*
// @exclude      *hentaiverse.org/isekai/equip/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491790/Hentaiverse%20Monsterbation.user.js
// @updateURL https://update.greasyfork.org/scripts/491790/Hentaiverse%20Monsterbation.meta.js
// ==/UserScript==

// vvv SETTINGS vvv //

const settings = {
    cfgInterface: true, //              add link under character to configure settings
    profileAutoswitch: true, //         automatically switch profile when changing persona or equipment set
    isekaiInherit: true, //             use persistent persona/equipment profiles in isekai

    // ui settings
    cfgButton: true, //                 show button to access settings and switch profiles during battle
    mpboost: 100, spboost: 100, //      set to match player stats. add up all bonuses from abilities and capacitor
    mppot: 75, sppot: 75, //            set to percentages restored by mana/spirit potions
    showCooldowns: true, //             show cooldowns on the quickbar
    effectsAboveMonsters: false, //     move player effects to above monsters
    vitalsAboveMonsters: false, //      move vitals and spirit button to above monsters
    quickbarBesideMonsters: false, //   move quickbar to the right of monsters
    riddleRight: false, //              shrink riddlemaster to the right
    condenseLeft: false, //             activate the above four options with everything moved to the left
    compactQuickbar: false, //          eliminate whitespace on quickbar and monster bars
    expireNoblink: false, //            disable blinking of expiring effects
    showDurations: true, //             show effect durations
    stackBorder: true, //               show effect stacks as border thickness rather than numbers
    alertColours: true, //              change background colours according to alert conditions
    alertBackground: false, //          whole background instead of relevant area for alert colours
    alertBuffs: '/(healthpot.png|manapot.png|scroll.png|infusion.png|regen.png|heartseeker.png|arcanemeditation.png)/',
    // change colour of player effects area if any of these buffs has less than 2 turns left
    // add the icon filename of any critical buff. this also affects stopOnBuffsExpiring
    // to get the filename, activate the buff in battle, right click its icon and inspect element
    // some examples: spiritpot.png darkinfusion.png protection_scroll.png flowers.png gum.png
    //                spiritshield.png sparklife.png shadowveil.png haste.png protection.png
    colours: { default:     '#EDEBDF', //           alert colours
               spark:       'magenta', //           set to any valid html colour, or false to disable
               lowhp:       'deeppink',
               lowmp:       'darkslateblue',
               lowsp:       'indigo',
               ocfull:      'mediumspringgreen',
               expiring:    'lightblue',
               channelling: 'aquamarine',
               usable:      'mediumspringgreen',
               miss:        'gray', //              log colours
               damage:      'red',
               item:        '#00B000',
               attack:      'blue',
               spell:       'darkslateblue',
               recovery:    'mediumseagreen',
               effect:      'seagreen',
               spirit:      'indigo',
               proficiency: 'darkolivegreen',
               monster:     'springgreen', //       monsters that match your keywords
               stun:        'darkseagreen', //      stunned monsters, set to false to disable
               imperil:     'lightsteelblue', //    imperilled monsters
               stunimperil: 'cadetblue' }, //       stunned and imperilled monsters
    usableBlink: true, //           mana and spirit gems and potions on the quickbar blink when usable to their full effect
    logColours: false, //           add colour highlights to the battle log
    turnDividers: false, //         add horizontal row between turns
    logPasteover: false, //         add last turn of previous round to new round log. requires ajaxRound
    hideLog: false, //              hide the battle log
    maxVitals: false, //            show maximum player vitals
    showMonsterHP: false, //        display current and max hp of monsters
    shortenHPbars: false, //        shorten monster hp bars relative to their max hp
    monsterNumbers: false, //       show monster numbers instead of letters
    monsterKeywords: false, //      highlight monsters where the name, id or max hp match this expression, set to false to disable
                            //      example: '/(Meiling|MID=70699|HP=243060)/'
    ajaxRound: false, //            advance to next round using ajax. set to false if you use other scripts that do not support this
    ajaxIntervals: 100, //          set to 0 or a higher number if you experience weird flashing of expiring effects
    noPopup: true, //               skip end of round popup
    stopAtBattleEnd: true, //       do not dismiss popup at end of battle
    stopOnEquipDrop: false, //      do not dismiss popup if equipment drops, quality specified by cutoff below
    clickableRiddlemaster: true, // add links to the riddlemaster to directly submit an answer
    edConfirm: false, //            ask for confirmation before using energy drink
    fleeConfirm: false, //          ask for confirmation before fleeing
    raiseGem: false, //             raise gem icon above quickbar
    hoverGem: false, //             activate gem by hovering over the icon
    hoverSpirit: false, //          activate spirit stance by hovering over the icon
    quickbarExtend: [ 1,'ikey_1','ikey_2','ikey_3','ikey_4','ikey_7','ikey_8','ikey_9','ikey_10',
                    'ikey_s1','ikey_s2','ikey_s4','ikey_n1','ikey_n5','ikey_n6','ikey_6','ikey_5' ],
    // ID for skills/spells/items (in quotes), 0 for space, 1 for gem
    // set to [1] if you just want the gem icon or [] to disable
    // IDs:
    // 1001 Flee 1011 Scan 1101 FUS RO DAH 1111 Orbital Friendship Cannon
    // 2201 Shield Bash 2202 Vital Strike 2203 Merciful Blow
    // 2301 Great Cleave 2302 Rending Blow 2303 Shatter Strike
    // 2401 Iris Strike 2402 Backstab 2403 Frenzied Blows
    // 2101 Skyward Sword 2501 Concussive Strike
    // 111 Fiery Blast 112 Inferno 113 Flames of Loki
    // 121 Freeze  122 Blizzard 123 Fimbulvetr
    // 131 Shockblast 132 Chained Lightning 133 Wrath of Thor
    // 141 Gale 142 Downburst 143 Storms of Njord
    // 151 Smite 152 Banishment 153 Paradise Lost
    // 161 Corruption 162 Disintegrate 163 Ragnarok
    // 211 Drain 212 Weaken 213 Imperil
    // 221 Slow 222 Sleep 223 Confuse
    // 231 Blind 232 Silence 233 MagNet
    // 311 Cure 312 Regen 313 Full-Cure
    // 411 Protection 412 Haste 413 Shadow Veil
    // 421 Absorb 422 Spark of Life 423 Spirit Shield
    // 431 Heartseeker 432 Arcane Focus
    // ikey_1-ikey_15 items ikey_s1-ikey_s6 scrolls ikey_n1-ikey_n6 infusions

    // mouse binding and hover settings
    // it is best to use mouse bindings in conjunction with hoverArea, as mouse actions always target the whole monster
    clickEverywhere: false, //  by default, click actions are only performed when the cursor is over a live monster
                            //  setting this to true will enable middle and right click bindings and disable the context menu everywhere
    wheelEverywhere: false, //  same as above, but for the wheel
    mouseEngage: false, //      hold mouse buttons to modify hover behaviour, rather than performing the bound action only once
    clickLeft: false, //        unused. set to "Nothing" to attack with mouseEngage
    clickMiddle: "Cast('Scan')",
    clickRight: "Strongest([Cast('FUS RO DAH'), Cast('Orbital Friendship Cannon'), Cast('Ragnarok'), Cast('Disintegrate'), Cast('Corruption')])",
    wheelUp: "Impulse(Cast('Imperil'))",
    wheelDown: "Impulse(Cast('Weaken'))",
    wheelLeft: "Impulse(Strongest([Cast('Silence'), Cast('Sleep')]))",
    wheelRight: "Impulse(Strongest([Cast('Vital Strike'), Cast('Frenzied Blows'), Cast('MagNet')]))",
    hoverAction: "Nothing", // Attack
    hoverShiftAction: "Strongest([Cast('Ragnarok'), Cast('Disintegrate'), Cast('Corruption')])", // alternate hover action when holding shift
    hoverCtrlAction: "Strongest([Cast('Paradise Lost'), Cast('Banishment'), Cast('Smite')])", // alternate hover action when holding ctrl
    hoverAltAction: "Strongest([Cast('Flames of Loki'), Cast('Inferno'), Cast('Fiery Blast')])", // alternate hover action when holding alt
    // these can be set to any bindable action that can be followed up with targeting a monster,
    // as explained in the keybind section, or to false to disable
    // examples:
    // hoverAction: false, // disable hover
    // hoverAction: "Nothing", // attack
    // hoverAction: "Strongest([Cast('Ragnarok'), Cast('Disintegrate'), Cast('Corruption')])", // dark spell rotation
    // hoverShiftAction: "Strongest([ToggleHover, Cast('Imperil')])", // single cast of imperil
    // with the above example, you can hold shift, hover and hit Z to cast imperil while being protected by the usual hover safeguards
    hoverArea: 6, // part of the monster that activates hover
                  // 1: whole box, 2: icon, 3: name, 4: vitals, 6: status effects

    // hoverplay interrupt settings
    startRoundWithHover: true, //    have hoverplay active at the beginning of each round
                               //    or require a kepress to start, in case you want to imperil first
    hoverAutoresume: false, //       reactivate hover after releasing any key
    minHP: 0.3,
    minMP: 0.1,
    minSP: 'auto', //                formula when set to 'auto': 0.5-0.5*spboost/(spboost+100)
    stopOnEmergency: true, //        sparked or low vitals
    stopOnBuffsExpiring: true, //    critical buff expiring in 1 turn or less

    // mobile settings
    clearRound: false, // clear target and reset hoverAction at round transition, to avoid lingering taps and make monsterBar safer
    spacedBar: false, //  increase spacing of quickbar and monster bar
    monsterBar: [], //    add skill/spell icons next to monsters, for single use or tap to engage/tap elsewhere to disengage, single skills and spell rotations
    // example: first parameter is false for single use or true to engage, followed by skill/spell IDs or leave empty for attack
    // monsterBar: [ [true], //                     engage attack
    //               [false,"213"], //              single cast of imperil
    //               [false,"212"], //              single cast of weaken
    //               [true,"163","162","161"] ], // engage dark spell rotation

    // tracking settings
    trackDrops: true, //          show total numbers of drops and exp at end of battle
    detailedDroplog: true, //     list each drop type individually, excluding crystals and equipment below your quality cutoff
    detailedCrystlog: false, //   list each crystal type individually
    equipmentCutoff: 3, //        0 to track all equipment combined,
                        //        1 to track Peerless separateley,
                        //        2 to track Peerless and Legendary separateley, etc.
    selectLog: false, //          limit end-of-battle onclick to icon, allowing for easier selecting of log
    terseLog: false, //           format log for easier pasting into spreadsheets
    trackProficiency: false, //   show total proficiency gains at end of battle
    proficiencySidebar: false, // show live proficiency gains during battle
    profbarInMainpane: false, //  set to false to avoid overlap with showMonsterHP
    deleteDropLog: 2, //          delete drop log, 0: never, 1: when navigating away from battle section, 2: at end of battle
    dropFontSize: 100, //         adjust font size of drop and proficiency log
    trackSpeed: true, //          show turn count and speed statistic at end of battle
    autoPause: 15, //             auto pause timer if you idle over the setting threshold
    speedFontSize: 100, //        adjust font size of speed statistic
    trackDamage: true, //         show damage dealt and taken at end of battle
    damageFontSize: 100, //       adjust font size of damage log
    trackUsage: true, //          show attack/skill/spell/item usage at end of battle
    deleteCombatLog: 2, //        delete damage and usage logs, 0: never, 1: when navigating away from battle section, 2: at end of battle
    consoleLog: false, //         output raw machine-readable log data to console when showing the drop log
    showRound: true, //           show the current round number during battle
    bigRoundCounter: false, //    bigger round counter, placed in top right

    // key bindings
    bind: "\
          Bind(KEY_SPACE, Any, Strongest([Cast('Cure'), HoverAction(Cast('Cure'), true)]));\
          Bind(KEY_Z, Any, ToggleHover);\
          Bind(KEY_S, Any, Impulse(Toggle('Spirit')));\
          Bind(KEY_A, Strongest([Use(4), Cast('Full-Cure'), Cast('Cure')]));\
          Bind(KEY_A, Shift, Strongest([Use(7), Use(4), Cast('Full-Cure'), Cast('Cure')]));\
          Bind(KEY_A, Ctrl, Strongest([Use(7), Use(4), Cast('Full-Cure'), Cast('Cure')]));\
          Bind(KEY_A, Alt, Strongest([Use(7), Use(4), Cast('Full-Cure'), Cast('Cure')]));\
          Bind(KEY_X, Strongest([Use('s1'), Use('s4'), Use('s2'), Use(2), Use(1)]));\
          Bind(KEY_X, Shift, Strongest([Use('s1'), Use('s4'), Use('s2'), Use('n6'), Use(2), Use(1)]));\
          Bind(KEY_X, Ctrl, Strongest([Use('s1'), Use('s4'), Use('s2'), Use('n5'), Use(2), Use(1)]));\
          Bind(KEY_X, Alt, Strongest([Use('s1'), Use('s4'), Use('s2'), Use('n1'), Use(2), Use(1)]));\
          Bind(KEY_C, Any, Cast('Regen'));\
          Bind(KEY_V, Any, Cast(damage));\
          Bind(KEY_Q, Impulse(Use(5)));\
          Bind(KEY_Q, Shift, Impulse(Strongest([Use(8), Use(5)])));\
          Bind(KEY_Q, Ctrl, Impulse(Strongest([Use(8), Use(5)])));\
          Bind(KEY_Q, Alt, Impulse(Strongest([Use(8), Use(5)])));\
          Bind(KEY_W, Any, Impulse(Use(3)));\
          Bind(KEY_E, Impulse(Use(6)));\
          Bind(KEY_E, Shift, Impulse(Strongest([Use(9), Use(6)])));\
          Bind(KEY_E, Ctrl, Impulse(Strongest([Use(9), Use(6)])));\
          Bind(KEY_E, Alt, Impulse(Strongest([Use(9), Use(6)])));\
          Bind(KEY_P, Settings);\
          Bind(KEY_1, Any, Strongest([TargetMonster(1), Cast('Imperil')]));\
          Bind(KEY_2, Any, Strongest([TargetMonster(4), Cast('Imperil')]));\
          Bind(KEY_3, Any, Strongest([TargetMonster(7), Cast('Imperil')]));\
          ",
    // Add this for as many bindings as you want:
    // Bind(KeyCode, Modifier, Action);\
    //  KeyCode = From http://www.javascripter.net/faq/keycodes.htm or any of the following:
    //  KEY_A, KEY_B, KEY_C, KEY_D, KEY_E, KEY_F, KEY_G, KEY_H, KEY_I, KEY_J, KEY_K, KEY_L, KEY_M,
    //  KEY_N, KEY_O, KEY_P, KEY_Q, KEY_R, KEY_S, KEY_T, KEY_U, KEY_V, KEY_W, KEY_X, KEY_Y, KEY_Z,
    //  KEY_1, KEY_2, KEY_3, KEY_4, KEY_5, KEY_6, KEY_7, KEY_8, KEY_9, KEY_0,
    //  KEY_SPACE, KEY_ENTER, KEY_PAGEUP, KEY_PAGEDOWN, KEY_END, KEY_HOME, KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN,
    //  KEY_F1, KEY_F2, KEY_F3, KEY_F4, KEY_F5, KEY_F6, KEY_F7, KEY_F8, KEY_F9, KEY_F10, KEY_F11, KEY_F12,
    //  KEY_COMMA, KEY_PERIOD, KEY_SLASH, KEY_FORWARDSLASH, KEY_GRAVE, KEY_TILDE, KEY_LBRACKET, KEY_BACKSLASH,
    //  KEY_SEMI, KEY_RBRACKET, KEY_APOSTROPHE, KEY_SHIFT, KEY_CTRL, KEY_ALT
    //  Modifier = This is OPTIONAL. Valid mods are NoMod, Shift, Ctrl, Alt, CtrlShift, AltShift, CtrlAlt, CtrlAltShift, Any
    //  Action = Valid actions:
    //    Cast('Spell Name')
    //      Spell Name.
    //    Use('Item ID')
    //      Valid Item IDs are 'p' for Gem, 1-15 for Items, 's1'-'s6' for Scrolls and 'n1'-'n6' for Infusions.
    //    Toggle('Type')
    //      Attack, Focus, Defend or Spirit.
    //    Nothing
    //      Use this to unbind a default key or use the default attack when targeting a monster.
    //    TargetMonster(Number)
    //      Targets the specified monster, starting at 0 for A up to 9 for J.
    //    NextRound
    //      Enters next round. Using this overrides both Space and Enter for next round. If you still want to use one of those, add it manually.
    //    Strongest([Action Array])
    //      Picks the most desired action.
    //      For targeted spells or skills, put the most desired action first.
    //      For untargeted spells or items, put the most desired action last.
    //    HoverAction(Action, true/false)
    //      Point mouse at target monster, hit key to perform action, Nothing for default attack. Set second parameter to true to respect alerts.
    //    Impulse(Action)
    //      Perform an action once.
    //    ToggleHover
    //      Turn hoverplay on or off.
    //    Drops
    //      Show drop log.
    //    CursorUp, CursorDown
    //      Move the targeting cursor.
    //    CursorTarget
    //      Target selected monster. Use with Strongest to specify action.
    //    CursorHover
    //      Engage hover at cursor location.
    //    ClearTarget
    //      Unset hover target.
    //    Settings.
    //      Access configuration interface.
    //
    // Examples:
    // Bind(KEY_M, Shift, Use(1));\ -- Shift + M = Use Item 1
    // Bind(KEY_LBRACKET, Cast('WRATH OF THOR'));\ -- Case insensitive. Key [ = cast Wrath of Thor.
    // Bind(KEY_A, Nothing);\ -- You can unbind a default key.
    // Bind(KEY_I, Use('p'));\ -- I uses Powerup Gem.
    // Bind(KEY_F, Toggle('Focus'));\ -- Toggle focus.
    // Bind(KEY_S, Toggle('Spirit'));\ -- Toggle spirit stance.
    // Bind(KEY_T, Strongest([Cast('Ragnarok'), Cast('Disintegrate'), Cast('Corruption')]));\ -- Strongest Dark spell.
    // Bind(KEY_B, Strongest([Cast('Full-Cure'), Cast('Cure')]));\ -- Use available Cure spell.
    // Bind(KEY_N, Strongest([Use(3), Use(2), Use(1)]));\ -- Use available item.
    // Bind(KEY_A, HoverAction(Nothing));\ -- Attack selected monster by holding A, to be used with hoverAction = false.
    // Bind(KEY_I, HoverAction(Cast('Imperil')));\ -- Cast Imperil on selected monster, ignore alerts.
    // Bind(KEY_I, HoverAction(Strongest([ToggleHover, Cast('Imperil')]), true));\ -- Single cast of Imperil, respect alerts.
    // Bind(KEY_I, Impulse(Cast('Imperil'))); -- Inject Imperil into hover rotation.
    // Bind(KEY_1, Strongest([TargetMonster(0), Cast('Imperil')]));\ -- Cast Imperil on monster A.
    // Bind(KEY_Z, Any, ToggleHover);\ -- Toggle hoverplay, regardless of modifier keys.
    // Bind(KEY_F, Drops);\ -- Show drops.
    // Bind(KEY_UP, CursorUp); -- Move cursor up.
    // Bind(KEY_DOWN, Strongest([CursorDown, ClearTarget]));\ -- Move cursor down, stop hover.
    // Bind(KEY_LEFT, Strongest([CursorTarget, Cast('Imperil')]));\ -- Cast Imperil on selected monster.
    // Bind(KEY_RIGHT, CursorHover);\ -- Hover on selected monster, recommended use with clearRound = true.

    // custom profiles
    // to override defaults, add elements to 'settings' sections
    name: '[persistent]',
    persona: [ { name: 'persona 1', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
               { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
               { name: 'persona 2', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
               { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
               { name: 'persona 3', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
               { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
               { name: 'persona 4', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
               { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
               { name: 'persona 5', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
               { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
               { name: 'persona 6', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
               { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
               { name: 'persona 7', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
               { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
               { name: 'persona 8', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
               { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
               { name: 'persona 9', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
               { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] } ],
    isekai: { name: '[isekai]', settings: {},
              persona: [ { name: 'persona 1', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
                         { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
                         { name: 'persona 2', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
                         { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
                         { name: 'persona 3', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
                         { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
                         { name: 'persona 4', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
                         { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
                         { name: 'persona 5', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
                         { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
                         { name: 'persona 6', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
                         { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
                         { name: 'persona 7', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
                         { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
                         { name: 'persona 8', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
                         { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] },
                         { name: 'persona 9', settings: {}, set: [ { name: 'set 1', settings: {} }, { name: 'set 2', settings: {} }, { name: 'set 3', settings: {} },
                         { name: 'set 4', settings: {} }, { name: 'set 5', settings: {} }, { name: 'set 6', settings: {} }, { name: 'set 7', settings: {} } ] } ] }
    };

// ^^^ SETTINGS ^^^ //

// bindable functions
function Toggle(name) {
    return function() {
        var state;
        if ( (state = document.getElementById('ckey_' + name.toLowerCase())) ) {
            dummy.setAttribute('onclick', state.getAttribute('onmouseover'));
            dummy.click();
            state.click(); }};}

function Cast(name) {
    return function() {
        var spell;
        if ( document.getElementsByClassName('btii')[0].innerHTML != name &&
             (spell = document.querySelector('.bts > div[onclick][onmouseover*="\'' + name + '\'"]')) ) {
            dummy.setAttribute('onclick', spell.getAttribute('onmouseover'));
            dummy.click();
            spell.click(); }};}

function Use(id) {
    return function() {
        var item;
        if ( (item = document.getElementById('ikey_' + id)) ) {
            dummy.setAttribute('onclick', item.getAttribute('onmouseover'));
            dummy.click();
            item.click(); }};}

function Nothing() {}

function NextRound() { var btcp; if ( (btcp = document.getElementById('btcp')) ) btcp.click(); document.querySelector('img[src$="finishbattle.png"]').click(); }

function TargetMonster(num) { return function() { if ( monsters[num] && monsters[num].hasAttribute('onclick') ) monsters[num].click(); };}

function Strongest(actions) { return function() { var n = actions.length; while ( n-- > 0 ) actions[n](); };}

function HoverAction(action, alert) {
    return function() {
        override = action;
        if ( (cfg.hoverAction || override) && !interruptHover && (!alert || !interruptAlert) && monsters[target] && monsters[target].hasAttribute('onclick') ) {
            Hover(); }};}

function Impulse(action) {
    return function() {
        if ( done ) return;
        impulse = action;
        if ( interruptHover || interruptAlert || !monsters[target] || !monsters[target].hasAttribute('onclick') ) {
            action(); done = true; impulse = false; }};}

function ToggleHover() {
    interruptHover = !interruptHover;
    if ( (cfg.hoverAction || override) && !interruptHover && !interruptAlert && monsters[target] && monsters[target].hasAttribute('onclick') ) {
        Hover(); }}

function Drops() { ShowDrops(false); }

function CursorUp() { if ( --cursor < 0 ) cursor = 0; Cursor(); }

function CursorDown() { if ( ++cursor >= monsters.length ) cursor = monsters.length - 1; Cursor(); }

function CursorTarget() { TargetMonster(cursor)(); }

function CursorHover() { if ( cursor >= 0 ) SetTarget(cursor)(); }

function ClearTarget() { target = false; }

function Settings() {
    var mainpane, style, form, div, changed = false, p = 0, s = 0, isk = '', select, option, index = 0;
    if ( !(mainpane = document.getElementById('mainpane')) ) return;
    bindings = [];
    mainpane.innerHTML = '';
    if ( !document.getElementById('hvcfgstyle') ) {
        style = document.head.appendChild(document.createElement('style'));
        style.id = 'hvcfgstyle';
        style.innerHTML =
            '.mbar, #cfgbutton { display: none !important; } #mainpane { height: ' + (document.getElementById('navbar') ? '644' : '671') +
            'px; overflow: auto; } #mbcfg div { display: flex; margin: 2px; } #mbcfg input { margin: 0 2px 0 0; } #mbcfg input[type="text"] { width: 30px; }' +
            '#mbcfgbt { display: flex; position: absolute; bottom: 0; left: 0; height: 27px; width: inherit; } #mbcfgbt select { margin: 0; }' +
            '#mbcfgbt div { margin: 4px 0; } #mbcfgbt input[type="checkbox"] { margin-left: 10px; } .help { cursor: pointer; }' +
            '.help .helptext { visibility: hidden; text-align: left; position: absolute; z-index: 2; bottom: 0; right: 0; background-color: #EDEBDF;' +
            'padding: 4px; border: 1px solid #5C0D11; } .help:hover .helptext { visibility: visible; }'; }
    form = mainpane.appendChild(document.createElement('form'));
    form.id = 'mbcfg';
    const Change = function(i, e) {
        return function() {
            changed = true;
            var prf = s ? (isk ? cfg.isekai : cfg).persona[p-1].set[s-1].settings : (p ? (isk ? cfg.isekai : cfg).persona[p-1].settings : (isk ? cfg.isekai.settings : cfg)),
                setting = settingsData[i][0], input = form.querySelector('[name="' + setting + (e ? '-' + e : '') + '"]'), value, inputs, j, above = Above(setting);
            switch ( settingsData[i][1][0] ) {
                case 'b': prf[setting] = input.checked; break;
                case 'o': if ( !prf[setting] ) {
                              prf[setting] = JSON.parse(JSON.stringify(above)); }
                              prf[setting][e] = (value = input.value) == '' ? above[e] : (value == 'false' ? false : value); break;
                case 'a': prf[setting] = (value = input.value) == '' ? above : JSON.parse(value); break;
                case 'i': prf[setting] = (value = parseInt(input.value)) || value === 0 ? value : above; break;
                case 'f': prf[setting] = parseFloat(value = input.value) || parseFloat(value) === 0 ? parseFloat(value) :
                                         settingsData[i][1][1] == 's' && value != '' ? 'auto' : above; break;
                case 's': if ( setting.indexOf('Action') > -1 && regexp.itemuse.test(input.value) ) {
                              alert('Fearsome powers thrust Laputa into orbit. Their dreaded empire once ruled the earth!'); return; }
                case 't': if ( regexp.hoveruse.test(input.value) ) {
                              alert('Fearsome powers thrust Laputa into orbit. Their dreaded empire once ruled the earth!'); return; }
                          prf[setting] = (value = input.value.replace(regexp.whitespace,'')) == '' ? above : value; break; }
            if ( (isk || p) && JSON.stringify(above) === JSON.stringify(prf[setting]) ) {
                if ( e ) {
                    form.querySelector('#' + setting).parentNode.style.opacity = '0.5';
                    inputs = form.querySelectorAll('[name*="' + setting + '-"]');
                    for ( j = 0; j < inputs.length; j++ ) {
                        inputs[j].parentNode.style.opacity = '0.5'; }}
                else {
                    input.parentNode.style.opacity = '0.5'; }
                delete prf[setting]; }
            else {
                if ( e ) {
                    form.querySelector('#' + setting).parentNode.style.opacity = '1';
                    inputs = form.querySelectorAll('[name*="' + setting + '-"]');
                    for ( j = 0; j < inputs.length; j++ ) {
                        inputs[j].parentNode.style.opacity = '1'; }}
                else {
                    input.parentNode.style.opacity = '1'; }}};},
        Load = function(d) {
            LoadCfg();
            form.innerHTML = '';
            var input, value;
            if ( d ) {
                input = form.appendChild(document.createElement('div')).appendChild(document.createElement('textarea'));
                input.name = 'dump';
                input.style.width = '1205px';
                input.style.height = '631px';
                input.style.resize = 'none';
                input.value = JSON.stringify(cfg);
                input.onchange = function() {
                    changed = true;
                    var dump = JSON.parse(input.value);
                    for ( var setting in settings ) {
                        cfg[setting] = (value = dump[setting]) || value === false || value === 0 ? value : settings[setting]; }
                    var option = select.querySelector('[value="00"]');
                    option.innerHTML = cfg.name;
                    for ( var i = 0; i < cfg.persona.length; i++ ) {
                        option = select.querySelector('[value="' + (i+1) + '0"]');
                        option.innerHTML = '- ' + cfg.persona[i].name;
                        for ( var j = 0; j < cfg.persona[i].set.length; j++ ) {
                            option = select.querySelector('[value="' + (i+1) + (j+1) + '"]');
                            option.innerHTML = '-- ' + cfg.persona[i].set[j].name; }}};
                return; }
            for ( var i = 0; i < settingsData.length; i++ ) {
                value = (s ? (isk ? cfg.isekai : cfg).persona[p-1].set[s-1].settings :
                        (p ? (isk ? cfg.isekai : cfg).persona[p-1].settings :
                        (isk ? cfg.isekai.settings : cfg)))[settingsData[i][0]];
                var none = !(value || value === false || value === 0), above = Above(settingsData[i][0]);
                if ( none ) {
                    value = above; }
                var grey = (isk || p) && (none || JSON.stringify(value) === JSON.stringify(above)),
                    div = form.appendChild(document.createElement('div'));
                div.style.opacity = grey ? '0.5' : '1';
                switch ( settingsData[i][1][0] ) {
                    case 'h': div.appendChild(document.createElement('div')).innerHTML = settingsData[i][0];
                              div.style.opacity = '1'; break;
                    case 'b': input = div.appendChild(document.createElement('input'));
                              input.name = settingsData[i][0];
                              input.type = 'checkbox';
                              input.checked = value;
                              input.onchange = Change(i);
                              div.appendChild(document.createElement('div')).innerHTML = settingsData[i][2]; break;
                    case 'o': input = div.appendChild(document.createElement('div'));
                              input.id = settingsData[i][0];
                              input.innerHTML = settingsData[i][2];
                              for ( var element in value ) {
                                  var dv = form.appendChild(document.createElement('div'));
                                  dv.style.opacity = grey ? '0.5' : '1';
                                  input = dv.appendChild(document.createElement('input'));
                                  input.name = settingsData[i][0] + '-' + element;
                                  input.type = 'text';
                                  input.value = value[element];
                                  if ( settingsData[i][4] ) {
                                      input.style.width = settingsData[i][4] + 'px'; }
                                  input.onchange = Change(i,element);
                                  dv.appendChild(document.createElement('div')).innerHTML = element; } break;
                    case 'a': input = div.appendChild(document.createElement('input'));
                              input.name = settingsData[i][0];
                              input.type = 'text';
                              input.value = JSON.stringify(value);
                              input.onchange = Change(i);
                              div.appendChild(document.createElement('div')).innerHTML = settingsData[i][2]; break;
                    case 't': input = div.appendChild(document.createElement('textarea'));
                              input.name = settingsData[i][0];
                              input.rows = 30;
                              input.style.resize = 'none';
                              input.value = value.replace(regexp.break,';\n');
                              input.onchange = Change(i); break;
                     default: input = div.appendChild(document.createElement('input'));
                              input.name = settingsData[i][0];
                              input.type = 'text';
                              input.value = value;
                              input.onchange = Change(i);
                              div.appendChild(document.createElement('div')).innerHTML = settingsData[i][2]; break; }
                if ( settingsData[i][4] ) {
                    input.style.width = settingsData[i][4] + 'px'; }
                if ( p == 0 && settingsData[i][3] ) {
                    var help = div.appendChild(document.createElement('div'));
                    help.className = 'help';
                    help.innerHTML = '?';
                    var helptext = help.appendChild(document.createElement('span'));
                    helptext.className = 'helptext';
                    helptext.innerHTML = settingsData[i][3]; }}},
    Above = function(setting) {
        var value;
        if ( !isk ) {
            return s && ((value = cfg.persona[p-1].settings[setting]) || value === false || value === 0) ? value : (p ? cfg[setting] : settings[setting]); }
        else if ( !cfg.isekaiInherit ) {
            return s && ((value = cfg.isekai.persona[p-1].settings[setting]) || value === false || value === 0) ? value :
                  (p && ((value = cfg.isekai.settings[setting]) || value === false || value === 0) ? value : cfg[setting]); }
        else {
            return s && ((value = cfg.persona[p-1].set[s-1].settings[setting]) || value === false || value === 0) ? value :
                  (s && ((value = cfg.isekai.persona[p-1].settings[setting]) || value === false || value === 0) ? value :
                  (p && ((value = cfg.persona[p-1].settings[setting]) || value === false || value === 0) ? value :
                  (p && ((value = cfg.isekai.settings[setting]) || value === false || value === 0) ? value : cfg[setting]))); }},
    Save = function() { if ( changed ) { changed = false; localStorage.HVmbcfg = JSON.stringify(cfg); }},
    Exit = function() { location.href = location.href; },
    Reset = function() {
        if ( p == 0 && s == 0 && !isk && confirm('确定重置设置吗?') ) {
            localStorage.removeItem('HVmbcfg');
            cfg = JSON.parse(JSON.stringify(settings));
            Settings(); }
        else if ( p == 0 && s == 0 && isk && confirm('重置这套设置吗?') ) {
            cfg.isekai.settings = {};
            Save();
            Load(); }
        else if ( p != 0 && confirm('重置这套设置吗?') ) {
            (s ? (isk ? cfg.isekai : cfg).persona[p-1].set[s-1] : (isk ? cfg.isekai : cfg).persona[p-1]).settings = {};
            Save();
            Load(); }},
    Switch = function(persona, set, ise) {
        if ( p === persona && s === set && isk === ise ) return true;
        if ( !changed || confirm('修改并保存这套设置吗?') ) {
            Save();
            p = persona;
            s = set;
            isk = ise;
            Load();
            return true; }
        return false; };
    Load();
    if ( (div = document.getElementById('mbcfgbt')) ) {
        div.parentNode.removeChild(div); }
    div = mainpane.appendChild(document.createElement('div'));
    div.id = 'mbcfgbt';
    var button = div.appendChild(document.createElement('button'));
    button.innerHTML = '保存设置';
    button.onclick = function() { Save(); Load(); };
    button = div.appendChild(document.createElement('button'));
    button.innerHTML = '保存并退出';
    button.onclick = function() { if ( !changed || confirm('保存并退出?') ) { Save(); Exit(); }};
    button = div.appendChild(document.createElement('button'));
    button.innerHTML = '退出';
    button.onclick = function() { if ( !changed || confirm('不保存设置直接退出?') ) { Exit(); }};
    button = div.appendChild(document.createElement('button'));
    button.innerHTML = '导出/导入设置';
    button.onclick = function() { if ( !changed || confirm('保存并导出设置?') ) { Save(); Load(true); }};
    button = div.appendChild(document.createElement('button'));
    button.innerHTML = '重置设置';
    button.onclick = Reset;
    select = div.appendChild(document.createElement('select'));
    select.onchange = function() {
        if ( Switch(parseInt(select.value[0]), parseInt(select.value[1]), select.value[2] ? 'i' : '') ) {
            index = select.selectedIndex; }
        else {
            select.selectedIndex = index; }};
    option = select.appendChild(document.createElement('option'));
    option.value = '00';
    option.innerHTML = cfg.name;
    if ( '' + profile.p + (profile.p ? profile['s' + profile.p] : '0') == option.value ) {
        option.style.color = 'blue'; }
    for ( var i = 0; i < cfg.persona.length; i++ ) {
        option = select.appendChild(document.createElement('option'));
        option.value = (i+1) + '0';
        option.innerHTML = '- ' + cfg.persona[i].name;
        if ( '' + profile.p + (profile.p ? profile['s' + profile.p] : '0') == option.value ) {
            option.style.color = 'blue'; }
        for ( var j = 0; j < cfg.persona[i].set.length; j++ ) {
            option = select.appendChild(document.createElement('option'));
            option.value = '' + (i+1) + (j+1);
            option.innerHTML = '-- ' + cfg.persona[i].set[j].name;
            if ( '' + profile.p + (profile.p ? profile['s' + profile.p] : '0') == option.value ) {
                option.style.color = 'blue'; }}}
    option = select.appendChild(document.createElement('option'));
    option.value = '00i';
    option.innerHTML = cfg.isekai.name;
    if ( '' + profile.ip + (profile.ip ? profile['is' + profile.ip] : '0') + 'i' == option.value ) {
        option.style.color = 'red'; }
    for ( i = 0; i < cfg.isekai.persona.length; i++ ) {
        option = select.appendChild(document.createElement('option'));
        option.value = (i+1) + '0i';
        option.innerHTML = '- ' + cfg.isekai.persona[i].name;
        if ( '' + profile.ip + (profile.ip ? profile['is' + profile.ip] : '0') + 'i' == option.value ) {
            option.style.color = 'red'; }
        for ( j = 0; j < cfg.isekai.persona[i].set.length; j++ ) {
            option = select.appendChild(document.createElement('option'));
            option.value = '' + (i+1) + (j+1) + 'i';
            option.innerHTML = '-- ' + cfg.isekai.persona[i].set[j].name;
            if ( '' + profile.ip + (profile.ip ? profile['is' + profile.ip] : '0') + 'i' == option.value ) {
                option.style.color = 'red'; }}}
    button = div.appendChild(document.createElement('button'));
    button.innerHTML = '重命名设置';
    button.onclick = function() {
        var prf = s ? (isk ? cfg.isekai : cfg).persona[p-1].set[s-1] : (p ? (isk ? cfg.isekai : cfg).persona[p-1] : (isk ? cfg.isekai : cfg)),
            opt = select.options[index], name;
        if ( (name = prompt('为设置命名', prf.name)) && name != prf.name ) {
            changed = true;
            prf.name = name;
            opt.innerHTML = (p ? (s ? '-- ' : '- ') : '') + prf.name; }};
    button = div.appendChild(document.createElement('button'));
    button.innerHTML = '标记设置组';
    button.onclick = function() {
        select.querySelector('[style*="' + (isk ? 'red' : 'blue') + '"]').style.color = '';
        profile[isk + 'p'] = p;
        if (p) {
            profile[isk + 's' + p] = s; }
        if ( JSON.stringify(profile) != localStorage.HVmbp ) {
            localStorage.HVmbp = JSON.stringify(profile); }
        select.querySelector('[value="' + p + s + isk + '"]').style.color = isk ? 'red' : 'blue'; };
    var auto = div.appendChild(document.createElement('input'));
    auto.name = 'profileAutoswitch';
    auto.type = 'checkbox';
    auto.checked = cfg.profileAutoswitch;
    auto.onchange = function() {
        changed = true;
        cfg.profileAutoswitch = auto.checked; };
    var help = div.appendChild(document.createElement('div'));
    help.className = 'help';
    help.innerHTML = '自动切换';
    var helptext = help.appendChild(document.createElement('span'));
    helptext.className = 'helptext';
    helptext.innerHTML = '在更改角色或套装时自动切换配置文件';
    var inherit = div.appendChild(document.createElement('input'));
    inherit.name = 'isekaiInherit';
    inherit.type = 'checkbox';
    inherit.checked = cfg.isekaiInherit;
    inherit.onchange = function() {
        changed = true;
        cfg.isekaiInherit = inherit.checked; };
    help = div.appendChild(document.createElement('div'));
    help.className = 'help';
    help.innerHTML = '继承设置';
    helptext = help.appendChild(document.createElement('span'));
    helptext.className = 'helptext';
    helptext.innerHTML = '在异世界中使用永久区的人物/套装配置文件'; }

// keybind helper functions
function handleKeys(e) {
    if ( release ) {
        done = false;
        release = false; }
	saveKeyDown();
    shiftHeld = e.shiftKey;
    ctrlHeld = e.ctrlKey;
    altHeld = e.altKey;
    var bind;
	for ( var i = 0; i < bindings.length; i++ ) {
		bind = bindings[i];
		if ( e.keyCode == bind.keyCode && bind.modifier(e) ) {
			bind.action();
			return; }}
	loadKeyDown(); }

function handleKeyup(e) {
    shiftHeld = e.shiftKey;
    ctrlHeld = e.ctrlKey;
    altHeld = e.altKey;
    override = false;
    release = true;
    if ( cfg.hoverAutoresume ) {
        interruptHover = false;
        if ( (cfg.hoverAction || override) && !interruptAlert && monsters[target] && monsters[target].hasAttribute('onclick') ) {
            Hover(); }}
}

function saveKeyDown() { runScript('var oldkeydown = document.onkeydown ? document.onkeydown : oldkeydown; document.onkeydown = null;'); }

function loadKeyDown() { runScript('document.onkeydown = oldkeydown;'); }

function runScript(code) {
	var scriptElement = document.createElement('script');
	scriptElement.type = 'text/javascript';
	scriptElement.textContent = code;
	document.body.appendChild(scriptElement);
	scriptElement.remove(); }

function Bind(key, mod, command) {
    if ( !command ) {
	      command = mod;
	      mod = NoMod; }
    if ( command ) {
        bindings.push(new Keybind(key,mod,command)); }}

function Keybind(key, mod, action) {
    this.keyCode = key;
    this.modifier = mod;
    this.action = action; }

function NoMod(e) { return !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey; }
function CtrlAltShift(e) { return e.shiftKey && e.altKey && e.ctrlKey && !e.metaKey; }
function CtrlShift(e) { return !e.altKey && e.shiftKey && e.ctrlKey && !e.metaKey; }
function AltShift(e) { return !e.ctrlKey && e.altKey && e.shiftKey && !e.metaKey; }
function CtrlAlt(e) { return !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey; }
function Ctrl(e) { return e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey; }
function Shift(e) { return e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey; }
function Alt(e) { return e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey; }
function Any(e) { return !e.metaKey; }

// global variables and constants
var cfg = {}, profile = JSON.parse(localStorage.HVmbp || '{}'), isekai = document.URL.indexOf('isekai') > -1 ? 'i' : '',
    bindings = [], gem = [], target = false, cursor = localStorage['HVcursor' + isekai] ? parseInt(localStorage['HVcursor' + isekai]) : -1,
    interruptHover, interruptAlert = false, hovering = false, override = false, impulse = false, done = false,
    release = false, shiftHeld = false, ctrlHeld = false, altHeld = false, bg, dummy = document.createElement('div'),
    mp = 1, sp = 1, monsters = [], monsterData = {}, log, turn, timelog = JSON.parse(localStorage['HVtimelog' + isekai] || '{ "turn":0,"action":0,"round":1,"lastuse":{} }'),
    combatlog = JSON.parse(localStorage['HVcombatlog' + isekai] || '{ "pdealt":{"hit":0,"crit":0,"miss":0,"evade":0,"parry":0,"resist":0,"r50":0,"r75":0,"r90":0},' +
                                                         '"mdealt":{"hit":0,"crit":0,"miss":0,"evade":0,"parry":0,"resist":0,"r50":0,"r75":0,"r90":0},' +
                                                         '"ptaken":{"hit":0,"shit":0,"crit":0,"scrit":0,"miss":0,"evade":0,"parry":0,"block":0,"r50":0,"r75":0,"r90":0},' +
                                                         '"mtaken":{"hit":0,"shit":0,"crit":0,"scrit":0,"miss":0,"evade":0,"parry":0,"block":0,"r50":0,"r75":0,"r90":0},' +
                                                         '"used":{} }'),
    vitals = JSON.parse(localStorage['HVvitals' + isekai] || '{ "hp":0,"mp":0,"sp":0 }'),
    itemkey = JSON.parse(localStorage['HVitemkey' + isekai] || '0'),
    droplog = JSON.parse(localStorage['HVtrackdrops' + isekai] ||
              '{ "Crystals":{}, "Equips":{}, "Mats":{}, "Artifacts":{}, "Figurines":{}, "Trophies":{}, "Consumables":{}, "Foods":{}, "proficiency":{} }'),
    csp = false;
const damage = document.getElementById('2501') ? 'Arcane Focus' : 'Heartseeker',
    KEY_A = 65, KEY_B = 66, KEY_C = 67, KEY_D = 68, KEY_E = 69, KEY_F = 70, KEY_G = 71, KEY_H = 72, KEY_I = 73, KEY_J = 74, KEY_K = 75, KEY_L = 76, KEY_M = 77,
    KEY_N = 78, KEY_O = 79, KEY_P = 80, KEY_Q = 81, KEY_R = 82, KEY_S = 83, KEY_T = 84, KEY_U = 85, KEY_V = 86, KEY_W = 87, KEY_X = 88, KEY_Y = 89, KEY_Z = 90,
    KEY_1 = 49, KEY_2 = 50, KEY_3 = 51, KEY_4 = 52, KEY_5 = 53, KEY_6 = 54, KEY_7 = 55, KEY_8 = 56, KEY_9 = 57, KEY_0 = 48,
    KEY_SPACE = 32, KEY_ENTER = 13, KEY_PAGEUP = 33, KEY_PAGEDOWN = 34, KEY_END = 35, KEY_HOME = 36, KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40,
    KEY_F1 = 112, KEY_F2 = 113, KEY_F3 = 114, KEY_F4 = 115, KEY_F5 = 116, KEY_F6 = 117, KEY_F7 = 118, KEY_F8 = 119, KEY_F9 = 120, KEY_F10 = 121, KEY_F11 = 122, KEY_F12 = 123,
    KEY_COMMA = 188, KEY_PERIOD = 190, KEY_SLASH = 191, KEY_FORWARDSLASH = 191, KEY_GRAVE = 192, KEY_TILDE = 192, KEY_LBRACKET = 219, KEY_BACKSLASH = 220,
    KEY_SEMI = 186, KEY_RBRACKET = 221, KEY_APOSTROPHE = 222, KEY_SHIFT = 16, KEY_CTRL = 17, KEY_ALT = 18,
    regexp = { gem:/\w(\w+) Gem/, defaultgem:/\w(\w+).gem/, duration:/(x(\d))*[^\(]*, (\d+)/,
        monsters:/MID=\d+[^<>]+HP=\d+/g, monster:/MID=(\d+) \((.+)\) .+ HP=(\d+)/, spellicon:/, '(\w+)'/, defaultfont:/"c\d\w"/,
        turn:/(.+?)<tr><td class="tls">/, action:/>([^<>]+)<\/td><\/tr>(<tr><td class="tlb">Spirit Stance Exhausted<\/td><\/tr>)*<tr><td class="tls"/,
        zeroturn:/You use\s*\w* (Gem|Draught|Potion|Elixir|Drink|Candy|Infusion|Scroll|Vase|Gum)/, use:/You (cast|use) ([\w\s-]+)/,
        damage:/[^<>]+damage( \([^<>]+\))*(<\/td><\/tr><tr><td class="tlb">Your spirit shield absorbs \d+ |<|\.)/g,
        type:/for (\d+) (\w+) damage/, shield:/absorbs (\d+)/, strike:/(Fire|Cold|Wind|Elec|Holy|Dark|Void) Strike hits/,
        dot:/for (\d+) damage/, pdot:/(Bleeding Wound|Spreading Poison)/, points:/for (\d+) points of (\w+) damage/,
        mdmiss:/to connect./g, mdevade:/evades your spell./g, md50:/ hits [^y][^<>]+50%/g, md75:/ hits [^y][^<>]+75%/g, md90:/ hits [^y][^<>]+90%/g,
        mdresist:/resists your spell./g, pdmiss:/its mark./g, pdevade:/evades your attack./g, pdparry:/parries your attack./g, mtevade:/ casts [^<>]+evade the attack./g,
        mtblock:/ casts [^<>]+block the attack./g, mt50:/ hits y[^<>]+50%/g, mt75:/ hits y[^<>]+75%/g, mt90:/ hits y[^<>]+90%/g, ptmiss:/misses the attack against you./g,
        ptevade:/(>You evade| uses [^<>]+evade the attack.)/g, ptparry:/(>You parry| uses [^<>]+parry the attack.)/g, ptblock:/(>You block| uses [^<>]+block the attack.)/g,
        counter:/>You counter/g, spellinfo:/\('([\w\s-]+)'.*, (\d+)\)/, crit:/(You crit| crits | blasts )/,
        miss:/(You evade|You block|You parry| evades | parries | resists | misses | fails )/, attack:/(You hit|You crit|Arcane Blow)/,
        spell:/(You cast| hits | crits | blasts |gains the effect)/, recovery:/(You are healed|Recovered | restores |You drain)/,
        round:/Round (\d+) \/ (\d+)/, drops: /\S+ <span style="color:.{7}">\[[^<>]+\](<\/span><\/td><\/tr><tr><td class="tlb">A t)*/g,
        drop:/(\S+) \<.*#(.{6}).*\[(.*)\](.)*/, crystal:/(?:(\d+)x )?Crystal/, crystals:/Crystal of (\w+)/, credit:/(\d+) Credit/, reward: /gain (\d+) Credit/,
        exp:/You gain (\d+) EXP/, proficiencies:/\d+\.\d+ points of [^<>]+ proficiency/g, proficiency:/(\d+\.\d+) points of ([^<>]+) proficiency/,
        quality:[/\[\]/,/\[Peerless/,/\[(Legendary|Peerless)/,/\[(Magnificent|Legendary|Peerless)/,/\[(Exquisite|Magnificent|Legendary|Peerless)/,
                 /\[(Superior|Exquisite|Magnificent|Legendary|Peerless)/,/\[(Average|Superior|Exquisite|Magnificent|Legendary|Peerless)/,
                 /\[(Fair|Average|Superior|Exquisite|Magnificent|Legendary|Peerless)/,/\[(Crude|Fair|Average|Superior|Exquisite|Magnificent|Legendary|Peerless)/],
        defaultstring:/"c\d\w"/g, defaultletter:/"c\d(\w)"/, whitespace:/(\s{2,}|\n)/g, break:/;/g, number:/\d+/, profile:/settings":{"/,
        itemuse:/Use\(/, hoveruse:/HoverAction\([^;]*Use\(/ },
    settingsData = [
        ['界面设置','h'],
        ['cfgButton','b','在设置界面下方显示插件设置'],
        ['mpboost','f','从技能与潜能中获得的魔力值加成'],
        ['spboost','f','从技能与潜能中获得的灵力值加成'],
        ['mppot','i','法力药水恢复的基础魔法百分比'],
        ['sppot','i','灵力药水恢复的基础灵力百分比'],
        ['showCooldowns','b','在快捷栏上显示冷却时间'],
        ['effectsAboveMonsters','b','移动玩家的状态栏至怪物侧'],
        ['vitalsAboveMonsters','b','移动玩家的生命槽至怪物侧'],
        ['quickbarBesideMonsters','b','移动快捷栏至怪物右侧'],
        ['riddleRight','b','缩小御谜士至画面右侧'],
        ['condenseLeft','b','将上面4个涉及的UI界面选项同时移动到左侧'],
        ['compactQuickbar','b','消除快捷栏与怪物栏上的空位'],
        ['expireNoblink','b','禁用效果临近结束时的闪动效果'],
        ['showDurations','b','显示buff持续时间'],
        ['stackBorder','b','将效果堆叠层数显示为边框厚度而非数字'],
        ['alertColours','b','根据警报条件更改背景颜色'],
        ['alertBackground','b','警报时更改整个背景颜色，而非警报区域颜色'],
        ['alertBuffs','s','关键buff',
         '如果这些buff中的任何一个剩余时间不到2回合，则更改玩家效果区域的颜色<br>' +
         '你可以添加任何关键buff的图标文件名，这也会影响鼠标移至快过期buff上时中断悬停操作的范围<br>' +
         '要获得文件名，请在战斗中激活buff，右键单击其图标并检查元素',750],
        ['colours','o','警报与日志颜色','设置为任何有效的html颜色，或设置为false禁用',120],
        ['usableBlink','b','快捷栏上的魔法和灵力宝石以及药水在完全可发挥恢复效果时会闪烁'],
        ['logColours','b','为战斗日志添加高亮'],
        ['turnDividers','b','在各回合之间添加分割线'],
        ['logPasteover','b','将上一轮战斗的最后一回合添加到新一轮的战斗日志中。需要ajaxRound的支持'],
        ['hideLog','b','隐藏战斗日志'],
        ['maxVitals','b','显示玩家当前和最大生命值'],
        ['showMonsterHP','b','显示怪物的当前和最大生命值'],
        ['shortenHPbars','b','根据怪物的最大生命值缩放怪物的生命条'],
        ['monsterNumbers','b','显示怪物数字序号而不是字母序号'],
        ['monsterKeywords','s','怪物关键词',
         '突出显示名称、id或最大hp与此表达式匹配的怪物，设置为false可禁用<br>' +
         '例子: /(Meiling|MID=70699|HP=243060)/',750],
        ['ajaxRound','b','使用ajax进入下一轮。如果使用其他不支持此功能的脚本，请设置为false'],
        ['ajaxIntervals','i','如果你有发现出现了奇怪的过期buff效果闪烁，请设置为0或更高的数字'],
        ['noPopup','b','跳过回合结束的弹出界面'],
        ['stopAtBattleEnd','b','不要在战斗结束时取消弹出窗口'],
        ['stopOnEquipDrop','b','如果指定稀有度以上的装备掉落了，不要取消弹出窗口，装备稀有度可在下面指定'],
        ['clickableRiddlemaster','b','添加御谜士链接，直接提交答案'],
        ['edConfirm','b','战斗中使用能量饮料前确认'],
        ['fleeConfirm','b','逃跑前确认'],
        ['raiseGem','b','将宝石图标移动到快捷栏上方'],
        ['hoverGem','b','将鼠标悬停在图标上激活宝石'],
        ['hoverSpirit','b','通过悬停在图标上激活灵动架势'],
        ['quickbarExtend','a','拓展快捷栏',
         '输入 技能/法术/物品的id (在引号中), 0 表示留空, 1 表示宝石<br>' +
         '如果你仅需要显示宝石，请设置为[1]，如果不想显示，请设置为[]<br>' +
         '技能id列表:<br>' +
         '1001 逃跑Flee 1011 扫描Scan 1101 龙吼FUS RO DAH 1111 友情小马炮Orbital Friendship Cannon<br>' +
         '2201 盾击Shield Bash 2202 致命打击Vital Strike 2203 最后的慈悲Merciful Blow<br>' +
         '2301 大劈砍Great Cleave 2302 撕裂打击Rending Blow 2303 粉碎打击Shatter Strike<br>' +
         '2401 虹膜打击Iris Strike 2402 背刺Backstab 2403 狂乱百裂斩Frenzied Blows<br>' +
         '2101 天空之剑Skyward Sword 2501 震荡打击Concussive Strike<br>' +
         '111 炎爆术(Ⅰ)Fiery Blast 112 地狱火(Ⅱ)Inferno 113 邪神之火(Ⅲ)Flames of Loki<br>' +
         '121 冰冻(Ⅰ)Freeze  122 暴风雪(Ⅱ)Blizzard 123 芬布尔之冬(Ⅲ)Fimbulvetr<br>' +
         '131 电能爆破(Ⅰ)Shockblast 132 连锁闪电(Ⅱ)Chained Lightning 133 雷神之怒(Ⅲ)Wrath of Thor<br>' +
         '141 烈风(Ⅰ)Gale 142 下击暴流(Ⅱ)Downburst 143 尼奥尔德风暴(Ⅲ)Storms of Njord<br>' +
         '151 惩戒(Ⅰ)Smite 152 放逐(Ⅱ)Banishment 153 失乐园(Ⅲ)Paradise Lost<br>' +
         '161 腐化(Ⅰ)Corruption 162 瓦解(Ⅱ)Disintegrate 163 诸神黄昏(Ⅲ)Ragnaro<br>' +
         '211 枯竭[D]Drain 212 虚弱[D]Weaken 213 陷危[D]Imperil<br>' +
         '221 缓慢[D]Slow 222 沉眠[D]Sleep 223 混乱[D]Confuse<br>' +
         '231 致盲[D]Blind 232 沉默[D]Silence 233 魔磁网[D]MagNet<br>' +
         '311 治疗术[S]Cure 312 细胞活化[S]Regen 313 完全治疗术[S]Full-Cure<br>' +
         '411 守护[S]Protection 412 急速[S]Haste 413 影纱[S]Shadow Veil<br>' +
         '421 吸收[S]Absorb 422 生命火花[S]Spark of Life 423 灵力盾[S]Spirit Shield<br>' +
         '431 觅心者[S]Heartseeker 432 奥术集中[S]Arcane Focus<br>' +
         'ikey_1-ikey_15 代表快捷栏的1-15号道具 ikey_s1-ikey_s6 代表1-6号卷轴 ikey_n1-ikey_n6 代表1-6号魔药',750],
        ['鼠标绑定和悬停设置','h'],
        ['clickEverywhere','b','在各处启用鼠标中键和右键单击绑定，并禁用原始的上下文菜单'],
        ['wheelEverywhere','b','在各处启用滚轮绑定'],
        ['mouseEngage','b','按住鼠标按钮以修改悬停行为'],
        ['clickLeft','s','左键点击',
         '设置为false可禁用，或设置为Nothing可使用点击进行普通攻击',750],
        ['clickMiddle','s','中键点击',,750],
        ['clickRight','s','右键点击',,750],
        ['wheelUp','s','滚轮上',,750],
        ['wheelDown','s','滚轮下',,750],
        ['wheelLeft','s','滚轮左',,750],
        ['wheelRight','s','滚轮右',,750],
        ['hoverAction','s','悬停设置',,750],
        ['hoverShiftAction','s','shift+悬停设置',,750],
        ['hoverCtrlAction','s','ctrl+悬停设置',,750],
        ['hoverAltAction','s','alt+悬停设置',
         '这些可以设置为任何可绑定的动作，并以怪物为目标,<br>' +
         '如按键绑定部分所述，或设置为false以禁用<br>' +
         '举例:<br>' +
         '悬停设置: false - 禁用悬停<br>' +
         '悬停设置: Nothing - 普通攻击<br>' +
         "悬停设置: Strongest([Cast('Ragnarok'), Cast('Disintegrate'), Cast('Corruption')]) - 暗法T3-T1技能循环<br>" +
         "shift+悬停设置: Strongest([ToggleHover, Cast('Imperil')]) - 单独释放一次陷危<br>" +
         '在上面的例子中，你可以通过按住shift后将鼠标悬停到目标上并按下悬停触发键Z(可在最下面的按键设置修改)来施放陷危，同时不会触发其他误操作',750],
        ['hoverArea','i','激活悬停操作的怪物区域',
         '1: 整个怪物栏, 2: 怪物图标, 3: 怪物姓名, 4: 怪物血条栏, 6: 怪物状态栏'],
        ['悬停中断设置','h'],
        ['startRoundWithHover','b','在每回合开始时激活悬停操作'],
        ['hoverAutoresume','b','松开任意键后重新激活悬停操作'],
        ['minHP','f','生命阈值'],
        ['minMP','f','魔力阈值'],
        ['minSP','fs','灵力阈值',
         "自动根据以下公式计算: 0.5-0.5*spboost/(spboost+100)"],
        ['stopOnEmergency','b','触发生命火花或低血量时停止'],
        ['stopOnBuffsExpiring','b','关键buff剩余时间低于1回合时停止'],
        ['移动端设置','h'],
        ['clearRound','b','在回合转换时清除目标并重置悬停动作，以避免持续点击，并使怪物栏更安全'],
        ['spacedBar','b','增加快捷栏和怪物栏的间距'],
        ['monsterBar','a','怪物栏',
         '在怪物旁边添加技能/法术图标，用于单次使用或点击以启用/点击其他地方以停用单个技能或法术循环<br>' +
         '保留为空以禁用。例如：第一个参数为false表示单次使用，或为true表示普通攻击，后面是技能/法术ID，或为空表示普通攻击<br>' +
         '[ [true],                    - 启用普通攻击<br>' +
         '  [false,"213"],             - 单独释放一次陷危<br>' +
         '  [false,"212"],             - 单独释放一次虚弱<br>' +
         '  [true,"163","162","161"] ] - 启用暗法T3-T1技能循环',750],
        ['追踪设置','h'],
        ['trackDrops','b','战斗结束时统计获得的经验与掉落'],
        ['detailedDroplog','b','单独列出每种掉落物品的类型，不包括低于设定稀有度的装备和水晶'],
        ['detailedCrystlog','b','单独列出每种水晶类型'],
        ['equipmentCutoff','i','装备过滤器阈值',
         '设定为0追踪所有装备,<br>' +
         '设定为1用于追踪无双装备,<br>' +
         '设定为2用于追踪无双和传奇装备, 以此类推.'],
        ['selectLog','b','将end-of-battle的点击限制为图标，以便更容易地选择日志'],
        ['terseLog','b','格式化日志，以便更容易地粘贴到电子表格中'],
        ['trackProficiency','b','在战斗结束时显示总熟练度获得量'],
        ['proficiencySidebar','b','在战斗中显示实时熟练度获得量'],
        ['profbarInMainpane','b','将熟练度获取量移动至侧边栏'],
        ['deleteDropLog','i','删除掉落日志，0:从不，1:离开战斗时，2:战斗结束时'],
        ['dropFontSize','i','调整掉落和熟练度日志的字体大小'],
        ['trackSpeed','b','显示战斗结束时的回合数和速度统计'],
        ['autoPause','i','空闲时间超过指定秒数后停止计时器',
         '你的空闲时间会从最终战斗时间中减去<br>' +
         '设置为0如果不想空闲的时候自动暂停战斗</br>' +
         '点击回合计数器或者设置键位绑定也可以手动暂停计时器'],
        ['speedFontSize','i','调整战斗速度统计的字体大小'],
        ['trackDamage','b','战斗结束时显示伤害日志'],
        ['damageFontSize','i','调整伤害日志的字体大小'],
        ['trackUsage','b','在战斗结束时显示攻击/技能/法术/物品使用情况'],
        ['deleteCombatLog','i','删除受伤和使用日志，0:从不，1:离开战斗时，2:战斗结束时'],
        ['consoleLog','b','显示掉落日志时，将原始日志输出到电脑控制台'],
        ['showRound','b','在战斗中显示当前回合数'],
        ['bigRoundCounter','b','更大的回合数显示方式，位于右上角'],
        ['键位绑定','h',,
         '你可以随意添加任意数量的键位绑定:<br>' +
         '绑定格式为 Bind(KeyCode, Modifier, Action);<br>' +
         ' 查看键位代码 http://www.javascripter.net/faq/keycodes.htm 或根据下面的键位列表:<br>' +
         ' KEY_A, KEY_B, KEY_C, KEY_D, KEY_E, KEY_F, KEY_G, KEY_H, KEY_I, KEY_J, KEY_K, KEY_L, KEY_M,<br>' +
         ' KEY_N, KEY_O, KEY_P, KEY_Q, KEY_R, KEY_S, KEY_T, KEY_U, KEY_V, KEY_W, KEY_X, KEY_Y, KEY_Z,<br>' +
         ' KEY_1, KEY_2, KEY_3, KEY_4, KEY_5, KEY_6, KEY_7, KEY_8, KEY_9, KEY_0,<br>' +
         ' KEY_SPACE, KEY_ENTER, KEY_PAGEUP, KEY_PAGEDOWN, KEY_END, KEY_HOME, KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN,<br>' +
         ' KEY_F1, KEY_F2, KEY_F3, KEY_F4, KEY_F5, KEY_F6, KEY_F7, KEY_F8, KEY_F9, KEY_F10, KEY_F11, KEY_F12,<br>' +
         ' KEY_COMMA, KEY_PERIOD, KEY_SLASH, KEY_FORWARDSLASH, KEY_GRAVE, KEY_TILDE, KEY_LBRACKET, KEY_BACKSLASH,<br>' +
         ' KEY_SEMI, KEY_RBRACKET, KEY_APOSTROPHE, KEY_SHIFT, KEY_CTRL, KEY_ALT<br>' +
         ' Modifier = 这是可选项. 有效的mod包括 NoMod, Shift, Ctrl, Alt, CtrlShift, AltShift, CtrlAlt, CtrlAltShift, Any<br>' +
         ' Action = Valid actions:<br>' +
         "   Cast('Spell Name')<br>" +
         '     使用法术,输入英文法术名称.<br>' +
         "   Use('Item ID')<br>" +
         "     关于道具ID 'p' 代表宝石, 1-15 代表快捷栏上的1-15号物品, 's1'-'s6' 代表快捷栏上的1-6号卷轴 'n1'-'n6' 代表快捷栏上的1-6号魔药.<br>" +
         "   Toggle('Type')<br>" +
         '     Attack, Focus, Defend or Spirit 触发攻击,集中,防御或启用灵动架势.<br>' +
         '   Nothing<br>' +
         '     使用此功能解除绑定默认密钥，或在针对怪物时使用默认攻击.<br>' +
         '   TargetMonster(Number)<br>' +
         '     以指定的怪物为目标，A-J，或0-9.<br>' +
         '   NextRound<br>' +
         '     进入下一轮战斗。使用此选项将覆盖下一轮的Space和Enter。如果您仍然想使用其中一个，请手动添加。<br>' +
         '   Strongest([Action Array])<br>' +
         '     选择最想要的动作.<br>' +
         '     对于有指向性的法术或技能，将最想要的动作放在第一位.<br>' +
         '     对于无特定目标的法术或物品，将最想要的动作放在最后.<br>' +
         '   HoverAction(Action, true/false)<br>' +
         '     鼠标指向目标怪物，点击按键执行动作，默认攻击无效。将第二个参数设置为true以优先处理警报。<br>' +
         '    Impulse(Action)<br>' +
         '      执行一次操作.<br>' +
         '   ToggleHover<br>' +
         '     打开或关闭悬停设置.<br>' +
         '   Drops<br>' +
         '     显示掉落日志.<br>' +
         '   CursorUp, CursorDown<br>' +
         '     移动目标光标.<br>' +
         '   CursorTarget<br>' +
         '     选定目标怪物。与“Strongest”一起使用可指定操作.<br>' +
         '   CursorHover<br>' +
         '     将鼠标悬停在光标位置.<br>' +
         '   ClearTarget<br>' +
         '     取消设置悬停目标.<br>' +
         '   Settings.<br>' +
         '     访问设置界面.'],
        ['bind','t',,,750]
    ];

// main function triggered on page load
function Enhance() {
    if ( document.getElementById('gay_sex') ) return;
    Riddlemaster();
    if ( !(log = document.getElementById('textlog')) ) return;
    if ( cfg.trackSpeed && log.textContent.indexOf('You gain the effect Blessing of the RiddleMaster') > -1 ) {
        timelog.horse = (timelog.horse ? timelog.horse : 0) + 1; }
    if ( cfg.logPasteover && turn ) {
        log.firstChild.innerHTML += '<tr><td class="tls"></td></tr>' + turn;
        FormatLog(); }
    monsters = document.getElementsByClassName('btm1');
    if ( cfg.alertBackground ) {
        csp = document.getElementById('csp'); }
    interruptHover = !cfg.startRoundWithHover;
    if ( cursor >= 0 ) ClearTarget();
    if ( cursor >= monsters.length ) cursor = monsters.length - 1;
    document.addEventListener('keydown', handleKeys, true);
    document.addEventListener('keyup', handleKeyup, true);
    if ( cfg.clearRound ) {
        Disengage(); }
    document.addEventListener('mouseover', ClearTarget, true);
    if ( cfg.clickEverywhere ) {
        document.addEventListener('mousedown', HandleClick(), true);
        document.addEventListener('contextmenu', function(e) { e.preventDefault(); }); }
    if ( cfg.wheelEverywhere ) {
        document.addEventListener('wheel', HandleWheel(), true); }
    if ( cfg.mouseEngage ) {
        document.addEventListener('mousedown', MouseEngage, true);
        document.addEventListener('mouseup', function() { override = false; release = true; }, true); }
    else {
        document.addEventListener('mouseup', function() { release = true; }, true); }
    var obs = new MutationObserver(Observe);
    obs.observe(log.firstChild, {childList: true});
    if ( !document.getElementById('homosex') ) {
        GetItemKey();
        if ( (cfg.mouseEngage && (regexp.itemuse.test(cfg.clickLeft) || regexp.itemuse.test(cfg.clickMiddle) || regexp.itemuse.test(cfg.clickRight))) ||
             regexp.itemuse.test(cfg.hoverAction) || regexp.itemuse.test(cfg.hoverShiftAction) || regexp.itemuse.test(cfg.hoverCtrlAction) ||
             regexp.itemuse.test(cfg.hoverAltAction) || regexp.hoveruse.test(cfg.bind) ) {
            alert('You have transgressed against your God and your fellow Man. God has charged me with your redemption. ' +
                  'You are hereby Exiled to Wraeclast where, it is hoped, you shall come to repent your Sins, and make your peace with your beloved Father.'); return; }
        cfg.minSP = cfg.minSP == 'auto' ? 0.5-0.5*cfg.spboost/(cfg.spboost+100) : cfg.minSP;
        const evals = ['alertBuffs', 'monsterKeywords', 'clickLeft', 'clickMiddle', 'clickRight', 'wheelUp', 'wheelDown', 'wheelLeft', 'wheelRight',
                       'hoverAction', 'hoverShiftAction', 'hoverCtrlAction', 'hoverAltAction'];
        for ( var i = 0; i < evals.length; i++ ) {
            try {
                cfg[evals[i]] = eval(cfg[evals[i]]); }
            catch ( error ) {
                cfg[evals[i]] = false;
                alert('非法 ' + evals[i] + ' 格式. 设置停用'); }}
        try {
            eval(cfg.bind); }
        catch ( error ) {
            bindings = [];
            alert('非法键位设置，设置停用'); }
        var style = document.createElement('style');
        style.id = 'homosex';
        style.innerHTML = '.btm6 { min-width: 195px; top: 0 !important; padding: 18px 3px 3px 1px !important; }' +
            (cfg.condenseLeft ? '#pane_effects { position: relative; left: -92px; } #pane_completion { left: -688px; } #battle_left { left: 550px; }' +
            '#pane_vitals { position: absolute; top: 3px; left: ' + (document.querySelector('img[src$="bar_orange.png"]') ?
            '-556px; } #ckey_spirit { left: -411px; top: 45px;' : '-548px; } #ckey_spirit { left: -459px; top: 2px;') +
            'position: absolute; z-index: 1; } #battle_right { left: -7px !important; top: 107px !important; }' +
            '#pane_quickbar { display: flex; position: absolute; left: -212px; top: 69px; width: 203px; }' :
            (cfg.effectsAboveMonsters ? '#pane_effects { max-width: 534px; position: relative; left: 596px; }' : '') +
            (cfg.vitalsAboveMonsters ? '#pane_vitals { position: absolute; top: 3px; left: ' + (document.querySelector('img[src$="bar_orange.png"]') ?
            '672px; } #ckey_spirit { left: 817px; top: 45px;' : '690px; } #ckey_spirit { left: 779px; top: 2px;') +
            'position: absolute; z-index: 1; } #battle_right { top: 107px !important; }' : '') +
            (cfg.quickbarBesideMonsters ? '#pane_quickbar { display: flex; position: absolute; left: 1026px; top: ' + (cfg.vitalsAboveMonsters ? '69' : '4') +
            'px; width: 203px; }' : '')) + (cfg.compactQuickbar ? '.btqs { width: 30px !important; height: 32px !important; padding: 0 !important;' +
            'border: 1px solid black; } .btqs:not(.mbs):not([onmouseover]) { opacity: 0; } .btqi { left: 0 !important; top: 0 !important; }' +
            '.btqs:not(.extend):not(.mbs):not([onmouseover]), .btqb { display:none; }' : '.btqi { top: 3px !important; }') +
            (cfg.expireNoblink ? '#pane_effects > img, .btm6 > img { opacity: 1 !important; }' : '') +
            '.effect_duration { display: inline-block; width: 30px; margin-right: -30px; position: relative; text-align: center; z-index: 1; }' +
            '.effect_duration > div { display: inline-block; min-width: 16px; padding: 0 2px; background: #EDEBDF; color: black; font-weight: bold; }' +
            '.effect_duration > div { border: 1px solid black; } .cooldown {' + (cfg.compactQuickbar ? 'width: 30px; margin-top: 4px;' :
            'width: 37px; margin-top: 7px;') + 'position: relative; z-index: 3; color: black; font-size: 20px; font-weight: bold; }' +
            '#infopane, .bttp, .btm1 { background: ' + cfg.colours.default + '; }' + (cfg.hideLog ? '#textlog { display: none; }' : '') +
            (cfg.noPopup ? '#btcp { display: none; }' : '') + '.drop { font-size: ' + cfg.dropFontSize + '%; } .speed { font-size: ' + cfg.speedFontSize + '%; }' +
            '.crystal { color: #BA05B4; } .credit { color: #A89000; } .equipment { color: #FF0000; } .token { color: #254117; }' +
            '.artifact { color: #0000FF; } .trophy { color: #461B7E; } .consumable { color: #00B000; } .food { color: #489EFF; } ' +
            '#pane_effects, #ckey_spirit { border-radius: 5px; }' + (cfg.spacedBar ? '.btqs { margin: 0 20px 20px 0 !important; }' : '') +
            (cfg.colours.usable ? '.usable { background: ' + cfg.colours.usable + ';' + (cfg.compactQuickbar ? 'border: 1px solid ' + cfg.colours.usable :
            'border-radius: 5px') + '; } .usable > .btqb { display: none; }' : '') + '.monsterhp { display: inline-block; position: relative; left: 204px; top: -20px; }' +
            (cfg.usableBlink ? '@keyframes blink { 50% { opacity: 0; }} .usable > .btqi { animation: blink 1s linear infinite; }' : '') +
            '#battle_right { position: absolute; left: 681px; top: 42px; width: 364px; overflow: visible; }' +
            (cfg.monsterNumbers ? '.btm2 img { display: none; } .btm2 > div:nth-child(1) { font-size: 250%; }' +
            '#mkey_1 > .btm2 > div:nth-child(1):after { content: "1"; } #mkey_2 > .btm2 > div:nth-child(1):after { content: "2"; }' +
            '#mkey_3 > .btm2 > div:nth-child(1):after { content: "3"; } #mkey_4 > .btm2 > div:nth-child(1):after { content: "4"; }' +
            '#mkey_5 > .btm2 > div:nth-child(1):after { content: "5"; } #mkey_6 > .btm2 > div:nth-child(1):after { content: "6"; }' +
            '#mkey_7 > .btm2 > div:nth-child(1):after { content: "7"; } #mkey_8 > .btm2 > div:nth-child(1):after { content: "8"; }' +
            '#mkey_9 > .btm2 > div:nth-child(1):after { content: "9"; } #mkey_0 > .btm2 > div:nth-child(1):after { content: "10"; }' : '') +
            (cfg.colours.miss ? '.miss { color: ' + cfg.colours.miss + '; }' : '') + (cfg.colours.damage ? '.damage { color: ' + cfg.colours.damage + '; }' : '') +
            (cfg.colours.item ? '.item { color: ' + cfg.colours.item + '; }' : '') + (cfg.colours.attack ? '.attack { color: ' + cfg.colours.attack + '; }' : '') +
            (cfg.colours.spell ? '.spell { color: ' + cfg.colours.spell + '; }' : '') + (cfg.colours.recovery ? '.recovery { color: ' + cfg.colours.recovery + '; }' : '') +
            (cfg.colours.effect ? '.effect { color: ' + cfg.colours.effect + '; }' : '') + (cfg.colours.spirit ? '.spirit { color: ' + cfg.colours.spirit + '; }' : '') +
            (cfg.colours.proficiency ? '.proficiency { color: ' + cfg.colours.proficiency + '; }' : '') +
            '#profbar { position: absolute; left: ' + (cfg.profbarInMainpane ? '1140' : '1240') + 'px; top: 50px; z-index: 1; }' +
            '#profbar td:nth-child(1) { text-align: right; } #profbar td:nth-child(2) { text-align: left; } .mbar { display: flex; position: absolute; left: 1075px; }' +
            '.mbar > div { cursor: pointer; } #cfgbutton { position: absolute; top: 673px; left: ' + (cfg.condenseLeft ? '529' : '1220') +
            'px; cursor: pointer; background: ' + cfg.colours.default + '; z-index: 3; width: 18px; height: 18px; font-size: 17px; }' +
            '#cfgbutton:hover #mbprofile { visibility: visible; } #mbprofile { visibility: hidden; position: absolute; right: 0; bottom: 18px;' +
            'width: max-content; height: max-content; padding: 5px; background: ' + cfg.colours.default + '; border: 1px solid #5C0D11; }' +
            '#mbar_0 { top: ' + ((cfg.showMonsterHP ? 61 : 58)+(cfg.vitalsAboveMonsters ? 65 : 0)) + 'px; }' +
            '#mbar_1 { top: ' + ((cfg.showMonsterHP ? 119 : 116)+(cfg.vitalsAboveMonsters ? 65 : 0)) + 'px; }' +
            '#mbar_2 { top: ' + ((cfg.showMonsterHP ? 177 : 174)+(cfg.vitalsAboveMonsters ? 65 : 0)) + 'px; }' +
            '#mbar_3 { top: ' + ((cfg.showMonsterHP ? 235 : 232)+(cfg.vitalsAboveMonsters ? 65 : 0)) + 'px; }' +
            '#mbar_4 { top: ' + ((cfg.showMonsterHP ? 293 : 290)+(cfg.vitalsAboveMonsters ? 65 : 0)) + 'px; }' +
            '#mbar_5 { top: ' + ((cfg.showMonsterHP ? 351 : 348)+(cfg.vitalsAboveMonsters ? 65 : 0)) + 'px; }' +
            '#mbar_6 { top: ' + ((cfg.showMonsterHP ? 409 : 406)+(cfg.vitalsAboveMonsters ? 65 : 0)) + 'px; }' +
            '#mbar_7 { top: ' + ((cfg.showMonsterHP ? 467 : 464)+(cfg.vitalsAboveMonsters ? 65 : 0)) + 'px; }' +
            '#mbar_8 { top: ' + ((cfg.showMonsterHP ? 525 : 522)+(cfg.vitalsAboveMonsters ? 65 : 0)) + 'px; }' +
            '#mbar_9 { top: ' + ((cfg.showMonsterHP ? 583 : 580)+(cfg.vitalsAboveMonsters ? 65 : 0)) + 'px; }' +
            (cfg.maxVitals ? '#dvrhd, #dvrhb, #dvrm, #dvrs { left: -45px; width: 100px; } #vrm { left: -63px; width: 100px; }' : '') +
            '#table_magic .fc2 { font-size: 7pt; } #dropbox { position: absolute; top: 35px; left: 583px; width: 360px;' +
            'margin: 2px 0 0 15px; padding: 5px 1px 1px; border: 2px ridge #5C0D12; background: #F2EFDF; opacity: 0.95; z-index: 9; }' +
            '#damagelog { border: 1px solid; border-collapse: collapse; } #damagelog tr:nth-child(1) > td, #damagelog tr:nth-child(2) > td { text-align: center; }' +
            '#damagelog td:nth-child(1) { text-align: left; } #damagelog td { min-width: 50px; padding: 2px 4px; border-left: 1px solid; text-align: right; font-size: ' +
            cfg.damageFontSize + '%; }';
        document.head.appendChild(style); }
    Gems();
    Alerts();
    Durations();
    GetMonsterData();
    Monsters();
    Confirm();
    ExtendQuickbar();
    MonsterBar();
    ShowCooldowns();
    MaxVitals();
    Profbar();
    ShowRound();
    CfgButton(); }

// main function triggered on new turn
function Observe() {
    // check for battle end
    if ( document.querySelector('img[src$="finishbattle.png"]') ) {
        if ( cfg.alertColours ) {
            document.getElementById(cfg.alertBackground ? 'csp' : 'pane_vitals').style.background = cfg.colours.default;
            document.getElementById('pane_effects').style.background = cfg.colours.default;
            document.getElementById('ckey_spirit').style.background = cfg.colours.default; }
        ProcessLog();
        FormatLog();
        TrackDrops();
        Profbar();
        ShowDrops(true);
        ShowUsage();
        ShowDamage();
        window.dispatchEvent(new CustomEvent("battleEnd", {"detail":{timelog,combatlog,droplog}}));
        window.removeEventListener('beforeunload', StoreTmp);
        var btcp, equip = document.querySelector('span[style$="#FF0000"]');
        localStorage.removeItem('HVmonsterData' + isekai);
        localStorage.removeItem('HVtimelog' + isekai);
        localStorage.removeItem('HVvitals' + isekai);
        localStorage.removeItem('HVcursor' + isekai);
        localStorage.removeItem('HVitemkey' + isekai);
        if ( cfg.deleteDropLog == 2 ) {
            localStorage.removeItem('HVtrackdrops' + isekai); }
        else if ( cfg.trackDrops || cfg.trackProficiency || cfg.proficiencySidebar ) {
            localStorage['HVtrackdrops' + isekai] = JSON.stringify(droplog); }
        if ( cfg.deleteCombatLog == 2 ) {
            localStorage.removeItem('HVcombatlog' + isekai); }
        else if ( cfg.trackDamage || cfg.trackUsage ) {
            localStorage['HVcombatlog' + isekai] = JSON.stringify(combatlog); }
        document.getElementById('homosex').innerHTML += '.mbar, #cfgbutton { display: none !important; }';
        if ( cfg.noPopup && (btcp = document.getElementById('btcp')) && !cfg.stopAtBattleEnd &&
             (!cfg.stopOnEquipDrop || !equip) ) {
            btcp.click();
            document.querySelector('img[src$="finishbattle.png"]').click(); }
        return; }
    hovering = false;
    PauseTimer(true);
    Gems();
    Alerts();
    Durations();
    Monsters();
    Confirm();
    ExtendQuickbar();
    ProcessLog();
    ShowCooldowns();
    MaxVitals();
    FormatLog();
    TrackDrops();
    Profbar();
    NoPopup(); }

// combat helper functions
function Riddlemaster() {
    var bot;
    if ( !cfg.clickableRiddlemaster || !(bot = document.getElementById('riddlebot')) ) return;
    if ( cfg.trackSpeed ) {
        timelog.horse = (timelog.horse ? timelog.horse : 0) + 1;}
    if ( !document.getElementById('buttsex') ) {
        var style = document.createElement('style');
        style.id = 'buttsex';
        style.innerHTML =
            (cfg.condenseLeft || cfg.riddleRight ? '#riddlemaster { left: ' + (cfg.condenseLeft ? '-370' : '340') + 'px; }' +
            '#riddlebot > img { width: 500px; } .riddlelink { display: inline-block; position: absolute; top: 44px; }' +
            '.riddlelink:nth-child(2) { left: 128px; } .riddlelink:nth-child(3) { left: 288px; } .riddlelink:nth-child(4) { left: 448px; }' :
            '.riddlelink { display: inline-block; position: relative; top: -585px; }' +
            '.riddlelink:nth-child(2) { left: -80px; } .riddlelink:nth-child(4) { left: 80px; }') +
            '.riddlelink > div { width: 0; height: 0; border-left: 20px solid transparent;' +
            'border-right: 20px solid transparent; border-bottom: 20px solid #5C0D11; margin: 20px 50px 0; }';
        document.head.appendChild(style); }
    var a = document.createElement('a');
    a.id = 'gay_sex';
    a.className = 'riddlelink';
    a.href = 'javascript:void(0)';
    a.appendChild(document.createElement('div'));
    a.setAttribute('onclick', 'document.getElementById("riddleanswer").value="A";document.getElementById("riddleform").submit()');
    bot.appendChild(a);
    a = document.createElement('a');
    a.className = 'riddlelink';
    a.href = 'javascript:void(0)';
    a.appendChild(document.createElement('div'));
    a.setAttribute('onclick', 'document.getElementById("riddleanswer").value="B";document.getElementById("riddleform").submit()');
    bot.appendChild(a);
    a = document.createElement('a');
    a.className = 'riddlelink';
    a.href = 'javascript:void(0)';
    a.appendChild(document.createElement('div'));
    a.setAttribute('onclick', 'document.getElementById("riddleanswer").value="C";document.getElementById("riddleform").submit()');
    bot.appendChild(a); }

function Gems() {
    var ikeyp;
    if ( (ikeyp = document.getElementById('ikey_p')) ) {
        gem[0] = ikeyp.getAttribute('onclick');
        gem[1] = ikeyp.getAttribute('onmouseover');
        var name = ikeyp.innerHTML.match(regexp.gem) || ParseDefault(ikeyp).match(regexp.defaultgem);
        switch ( name[1] ) {
            case 'ystic': gem[2] = '/y/e/channeling.png'; break;
            case 'ealth': gem[2] = '/y/e/healthpot.png'; break;
            case 'ana' : gem[2] = '/y/e/manapot.png'; gem[3] = 0; break;
            case 'pirit': gem[2] = '/y/e/spiritpot.png'; gem[3] = 1; break; }}
    else gem = []; }

function Alerts() {
    var alert = false, ocfull = false, omo, oc, vcp,
        spirit = document.querySelector('img[src$="spirit_n.png"]') || document.querySelector('img[src$="spirit_s.png"]');
    bg = cfg.colours.default;
    if ( cfg.hoverSpirit && spirit && (omo = spirit.getAttribute('onmouseover')) && omo.indexOf('lock') < 0 ) {
        spirit.setAttribute('onmouseover', omo + ';' + spirit.getAttribute('onclick')); }
    if ( (oc = document.querySelector('img[src$="bar_orange.png"]')) ) {
        mp = parseInt(document.querySelector('img[src$="bar_blue.png"]').style.width)/414;
        sp = parseInt(document.querySelector('img[src$="bar_red.png"]').style.width)/414;
        if ( spirit && parseInt(oc.style.width) >= 414 ) {
            ocfull = true; }
        if ( (gem[3] === 0 && mp < 0.5+0.5*cfg.mpboost/(cfg.mpboost+100)) ||
             (gem[3] === 1 && sp < 0.75+0.25*cfg.spboost/(cfg.spboost+100)) ) {
            gem[4] = true; }
        else gem[4] = false;
        if ( sp <= cfg.minSP && cfg.colours.lowsp ) {
            bg = cfg.colours.lowsp; if ( cfg.stopOnEmergency ) alert = true; }
        if ( mp <= cfg.minMP && cfg.colours.lowmp ) {
            bg = cfg.colours.lowmp; if ( cfg.stopOnEmergency ) alert = true; }
        if ( parseInt(document.querySelector('img[src$="green.png"]').style.width) <= 414 * cfg.minHP && cfg.colours.lowhp ) {
            bg = cfg.colours.lowhp; if ( cfg.stopOnEmergency ) alert = true; }
        if ( !document.querySelector('img[src$="bar_dgreen.png"]') && document.querySelector('img[src$="fallenshield.png"]') && cfg.colours.spark ) {
            bg = cfg.colours.spark; if ( cfg.stopOnEmergency ) alert = true; }}
    else {
        mp = parseInt(document.querySelector('img[src$="bar_blue.png"]').style.width)/207;
        sp = parseInt(document.querySelector('img[src$="bar_red.png"]').style.width)/207;
        if ( spirit && (vcp = document.querySelector('#vcp > div')) && parseInt(vcp.style.width) >= 190 ) {
            ocfull = true; }
        if ( (gem[3] === 0 && mp < 0.5+0.5*cfg.mpboost/(cfg.mpboost+100)) ||
             (gem[3] === 1 && sp < 0.75+0.25*cfg.spboost/(cfg.spboost+100)) ) {
            gem[4] = true; }
        else gem[4] = false;
        if ( sp <= cfg.minSP && cfg.colours.lowsp ) {
            bg = cfg.colours.lowsp; if ( cfg.stopOnEmergency ) alert = true; }
        if ( mp <= cfg.minMP && cfg.colours.lowmp ) {
            bg = cfg.colours.lowmp; if ( cfg.stopOnEmergency ) alert = true; }
        if ( parseInt(document.querySelector('img[src$="green.png"]').style.width) <= 496 * cfg.minHP && cfg.colours.lowhp ) {
            bg = cfg.colours.lowhp; if ( cfg.stopOnEmergency ) alert = true; }
        if ( !document.querySelector('img[src$="bar_dgreen.png"]') && document.querySelector('img[src$="fallenshield.png"]') && cfg.colours.spark ) {
            bg = cfg.colours.spark; if ( cfg.stopOnEmergency ) alert = true; }}
    interruptAlert = alert;
    if ( cfg.alertColours ) {
        if ( csp ) {
            if ( bg == cfg.colours.default && ocfull && cfg.colours.ocfull ) {
                bg = cfg.colours.ocfull; }
            csp.style.background = bg; }
        else {
            if ( spirit && cfg.colours.ocfull ) {
                spirit.style.background = ocfull ? cfg.colours.ocfull : cfg.colours.default; }
            document.getElementById('pane_vitals').style.background = bg; }}}

function Durations() {
    if ( !cfg.showDurations && !cfg.alertColours && !cfg.stopOnBuffsExpiring ) return;
    var pane = document.getElementById('pane_effects'), alert = false, div, dur, duration, stack,
        effects = pane.getElementsByTagName('img'), n = effects.length;
    while ( n-- > 0 ) {
        if ( (duration = effects[n].getAttribute('onmouseover').match(regexp.duration)) ) {
            if ( cfg.alertBuffs && duration[3] < 2 && effects[n].src.indexOf('channeling.png') < 0 && cfg.alertBuffs.test(effects[n].src) ) {
                alert = true; }
            if ( cfg.showDurations ) {
                div = document.createElement('div');
                dur = document.createElement('div');
                div.className = 'effect_duration';
                if ( duration[3] < 9 ) {
                    dur.style.background = duration[3] < 4 ? 'aquamarine' : 'lavender'; }
                dur.innerHTML = duration[3];
                if ( (stack = duration[2]) ) {
                    if ( cfg.stackBorder ) {
                        dur.style.border = Math.ceil(stack/2)+1 + 'px solid black'; }
                    else {
                        dur.innerHTML += ' x' + stack; }}
                div.appendChild(dur);
                pane.insertBefore(div, effects[n]); }}}
    if ( cfg.alertColours ) {
        var colour = alert && cfg.colours.expiring ? cfg.colours.expiring :
            (document.querySelector('#pane_effects > img[src$="channeling.png"]') && cfg.colours.channelling ? cfg.colours.channelling : cfg.colours.default);
        if ( csp ) {
            csp.style.background = bg != cfg.colours.default ? bg : colour; }
        else {
            pane.style.background = colour; }}
    interruptAlert = interruptAlert || (cfg.stopOnBuffsExpiring && alert);
    if ( cfg.showDurations ) {
        effects = document.querySelectorAll('.btm6 > img[onmouseover]'); n = effects.length;
        while ( n-- > 0 ) {
            if ( (duration = effects[n].getAttribute('onmouseover').match(regexp.duration)) ) {
                div = document.createElement('div');
                dur = document.createElement('div');
                div.className = 'effect_duration';
                if ( duration[3] < 9 ) {
                    dur.style.background = duration[3] < 4 ? 'aquamarine' : 'lavender'; }
                dur.innerHTML = duration[3];
                if ( (stack = duration[2]) ) {
                    if ( cfg.stackBorder ) {
                        dur.style.border = Math.ceil(stack/2)+1 + 'px solid black'; }
                    else {
                        dur.innerHTML += ' x' + stack; }}
                div.appendChild(dur);
                effects[n].parentNode.insertBefore(div, effects[n]); }}}}

function GetMonsterData() {
    if ( !cfg.showMonsterHP && !cfg.shortenHPbars && !cfg.monsterKeywords ) return;
    var local, data, monster;
    if ( (local = localStorage['HVmonsterData' + isekai]) ) {
        monsterData = JSON.parse(local); }
    else {
        monsterData.info = [];
        monsterData.id = [];
        monsterData.name = [];
        monsterData.hp = [];
        monsterData.highlight = [];
        monsterData.hp[10] = 0;
        if ( (data = log.innerHTML.match(regexp.monsters)) ) {
            for ( var i = 0; i < monsters.length; i++ ) {
                monster = data[monsters.length-i-1].match(regexp.monster);
                monsterData.info[i] = monster[0];
                monsterData.id[i] = parseInt(monster[1]);
                monsterData.name[i] = monster[2];
                monsterData.hp[i] = parseInt(monster[3]);
                monsterData.highlight[i] = cfg.monsterKeywords && monsters[i].hasAttribute('onclick') && cfg.monsterKeywords.test(monster[0]);
                if ( !monsters[i].querySelector('.btm2[style]') ) {
                    monsterData.hp[10] = monsterData.hp[i] > monsterData.hp[10] ? monsterData.hp[i] : monsterData.hp[10]; }}}}}

function Monsters() {
    var monster;
    for ( var i = 0; i < monsters.length; i++ ) {
        if ( (monster = monsters[i]) && monster.hasAttribute('onclick') ) {
            var area = monster.querySelector('.btm' + cfg.hoverArea) || monster;
            area.addEventListener('mouseout', ClearTarget, true);
            area.addEventListener('mouseover', SetTarget(i), true);
            monster.addEventListener('mousedown', HandleClick(i), true);
            monster.addEventListener('contextmenu', function(e) { e.preventDefault(); });
            monster.addEventListener('wheel', HandleWheel(i), true);
            if ( cursor >= 0 ) Cursor();
            if ( target === i && (cfg.hoverAction || override) && !interruptHover && !interruptAlert ) {
                Hover(); }
            if ( monsterData.highlight && monsterData.highlight[i] ) {
                monster.querySelector('.btm2').style.background = cfg.colours.monster; }
            if ( (cfg.showMonsterHP || cfg.shortenHPbars) && monsterData.hp[i] ) {
                var bar = monster.querySelector('img[src$="nbargreen.png"]'),
                    ratio = parseInt(bar.style.width) / 120;
                if ( cfg.showMonsterHP && !cfg.quickbarBesideMonsters && !cfg.condenseLeft ) {
                    var div = monster.appendChild(document.createElement('div'));
                    div.className = 'monsterhp';
                    div.style.left = '48px';
                    div.style.top = '-16px';
                    div.style.fontWeight = 'bold';
                    div.style.fontSize = 'larger';
                    div.innerHTML = 'HP: ' + Math.max(1, Math.round(ratio * monsterData.hp[i])).toLocaleString() + ' / ' + monsterData.hp[i].toLocaleString(); }
                if ( cfg.shortenHPbars && monsterData.hp[i] < monsterData.hp[10] ) {
                    var factor = monsterData.hp[i] / monsterData.hp[10],
                        border = monster.querySelector('img[src$="nbarfg.png"]'),
                        bg = monster.querySelector('.chbd');
                    bar.style.width = Math.round(ratio * factor * 120) + 'px';
                    border.style.width = Math.round(factor * 120) + 'px';
                    border.style.height = '12px';
                    bg.style.width = Math.round(factor * 120) + 'px'; }}
            if ( cfg.colours.stun || cfg.colours.imperil || cfg.colours.stunimperil ) {
                var status = monster.querySelector('.btm6'),
                    stun = status.innerHTML.indexOf('wpn_stun.png') > -1,
                    imperil = status.innerHTML.indexOf('imperil.png') > -1;
                if ( cfg.colours.stunimperil && stun && imperil ) {
                    monster.style.background = cfg.colours.stunimperil; }
                else if ( cfg.colours.stun && stun ) {
                    monster.style.background = cfg.colours.stun; }
                else if ( cfg.colours.imperil && imperil ) {
                    monster.style.background = cfg.colours.imperil; }}}}}

function Hover() {
    if ( hovering ) return;
    hovering = true;
    if ( override ) {
        override(); }
    else if ( shiftHeld && cfg.hoverShiftAction ) {
        cfg.hoverShiftAction(); }
    else if ( ctrlHeld && cfg.hoverCtrlAction ) {
        cfg.hoverCtrlAction(); }
    else if ( altHeld && cfg.hoverAltAction ) {
        cfg.hoverAltAction(); }
    else {
        cfg.hoverAction(); }
    if ( impulse ) {
        impulse();
        done = true;
        impulse = false; }
    monsters[target].click(); }

function SetTarget(i) { return function() {
    target = i;
    if ( (cfg.hoverAction || override) && !interruptHover && !interruptAlert && monsters[target].hasAttribute('onclick') ) {
        Hover(); }};}

function HandleClick(i) {
    return function(e) {
        var action;
        if ( (i || i === 0) && e.which == 1 ) action = cfg.clickLeft;
        else if ( e.which == 2 ) action = cfg.clickMiddle;
        else if ( e.which == 3 ) action = cfg.clickRight;
        if ( action ) {
            e.preventDefault();
            if ( release ) {
                done = false;
                release = false; }
            action();
            if ( i || i === 0 ) {
                monsters[i].click(); }}};}

function HandleWheel(i) {
    return function(e) {
        var action;
        if ( e.deltaY < 0 ) action = cfg.wheelUp;
        else if ( e.deltaY > 0 ) action = cfg.wheelDown;
        else if ( e.deltaX < 0 ) action = cfg.wheelLeft;
        else if ( e.deltaX > 0 ) action = cfg.wheelRight;
        if ( action ) {
            e.preventDefault();
            done = false;
            action();
            if ( i || i === 0 ) {
                monsters[i].click(); }}};}

function MouseEngage(e) {
    if ( e.which == 1 ) override = cfg.clickLeft;
    else if ( e.which == 2 ) override = cfg.clickMiddle;
    else if ( e.which == 3 ) override = cfg.clickRight; }

function Cursor() {
    this.battle.hover_target(monsters[cursor]); }

function Confirm() {
    var ed, flee;
    if ( cfg.edConfirm && (ed = document.querySelector('div[onclick][onmouseover*="item(11401)"]:not([onclick*=confirm])')) ) {
        ed.setAttribute('onclick', 'if ( confirm("确定要使用能量饮料吗?") ) {' + ed.getAttribute('onclick') + '}'); }
    if ( cfg.fleeConfirm && (flee = document.getElementById('1001')) ) {
        flee.setAttribute('onclick', 'if ( confirm("确定要逃跑吗?") ) {' + flee.getAttribute('onclick') + '}'); }
    if ( cfg.fleeConfirm && (flee = document.querySelector('.btqs[onclick][onmouseover*="Flee"]')) ) {
        flee.setAttribute('onclick', 'if ( confirm("确定要逃跑吗?") ) {' + flee.getAttribute('onclick') + '}'); }}

function ExtendQuickbar() {
    var quickbar = document.getElementById('quickbar'), div, img, spell, action;
    for ( var i = 0; i < cfg.quickbarExtend.length; i++ ) {
        div = document.createElement('div');
        div.className = 'btqs extend';
        switch ( cfg.quickbarExtend[i] ) {
            case 0: break;
            case 1: if ( gem[0] ) {
                        if ( cfg.raiseGem ) {
                            div.setAttribute('style', 'position: absolute;' + (cfg.condenseLeft ? 'top: -55px; left: 165px;' :
                                                                              (cfg.vitalsAboveMonsters ? 'top: 15px; left: 1191px;' :
                                                                              'top: 50px; left: 622px;'))); }
                        div.setAttribute('onclick', gem[0]);
                        if ( cfg.hoverGem ) {
                            div.setAttribute('onmouseover', gem[1] + ';' + gem[0]); }
                        else {
                            div.setAttribute('onmouseover', gem[1]); }
                        if ( cfg.alertColours && gem[4] ) {
                            div.className += ' usable'; }
                        img = document.createElement('img');
                        img.src = gem[2];
                        img.className = 'btqi';
                        div.appendChild(img);
                        img = document.createElement('img');
                        img.src = '/y/ab/b.png';
                        img.className = 'btqb';
                        div.appendChild(img); } break;
            default: if ( (spell = document.getElementById(cfg.quickbarExtend[i])) ) {
                        img = document.createElement('img');
                        var info = spell.getAttribute('onmouseover');
                        if ( (action = spell.getAttribute('onclick')) ) {
                            div.setAttribute('onclick', action); }
                        else {
                            img.style.opacity = 0.5; }
                        div.setAttribute('onmouseover', info);
                        if ( cfg.quickbarExtend[i].indexOf('ikey') < 0 ) {
                            img.src = '/y/a/' + info.match(regexp.spellicon)[1] + '.png'; }
                        else {
                            var name = spell.innerHTML;
                            if ( regexp.defaultfont.test(name) ) name = ParseDefault(spell);
                            switch ( true ) {
                                case name.indexOf('ealth') > -1: img.src = '/y/e/healthpot.png'; break;
                                case name.indexOf('ana') > -1: img.src = '/y/e/manapot.png';
                                    if ( cfg.alertColours && name.indexOf('otion') > -1 && mp < (100-cfg.mppot+cfg.mppot*cfg.mpboost/(cfg.mpboost+100))/100 ) {
                                        div.className += ' usable'; } break;
                                case name.indexOf('pirit') > -1: img.src = '/y/e/spiritpot.png';
                                    if ( cfg.alertColours && name.indexOf('otion') > -1 && sp < (100-cfg.sppot+cfg.sppot*cfg.spboost/(cfg.spboost+100))/100 ) {
                                        div.className += ' usable'; } break;
                                case name.indexOf('lixir') > -1: img.src = '/y/e/healthpot.png'; break;
                                case name.indexOf('rink') > -1: img.src = '/y/e/soulstone.png'; break;
                                case name.indexOf('andy') > -1: img.src = '/y/e/soulstone.png'; break;
                                case name.indexOf('lames') > -1: img.src = '/y/e/fireinfusion.png'; break;
                                case name.indexOf('rost') > -1: img.src = '/y/e/coldinfusion.png'; break;
                                case name.indexOf('ightning') > -1: img.src = '/y/e/elecinfusion.png'; break;
                                case name.indexOf('torms') > -1: img.src = '/y/e/windinfusion.png'; break;
                                case name.indexOf('ivinity') > -1: img.src = '/y/e/holyinfusion.png'; break;
                                case name.indexOf('arkness') > -1: img.src = '/y/e/darkinfusion.png'; break;
                                case name.indexOf('wiftness') > -1: img.src = '/y/e/haste_scroll.png'; break;
                                case name.indexOf('rotection') > -1: img.src = '/y/e/protection_scroll.png'; break;
                                case name.indexOf('vatar') > -1: img.src = '/y/e/protection_scroll.png'; break;
                                case name.indexOf('bsorption') > -1: img.src = '/y/e/absorb_scroll.png'; break;
                                case name.indexOf('hadows') > -1: img.src = '/y/e/shadowveil_scroll.png'; break;
                                case name.indexOf('ife') > -1: img.src = '/y/e/sparklife_scroll.png'; break;
                                case name.indexOf('ods') > -1: img.src = '/y/e/sparklife_scroll.png'; break;
                                case name.indexOf('ase') > -1: img.src = '/y/e/flowers.png'; break;
                                case name.indexOf('um') > -1: img.src = '/y/e/gum.png'; break;
                                default: img.src = '/y/e/channeling.png'; break; }}
                        img.className = 'btqi';
                        div.appendChild(img);
                        img = document.createElement('img');
                        img.src = '/y/ab/b.png';
                        img.className = 'btqb';
                        div.appendChild(img); } break; }
        quickbar.appendChild(div); }}

function MonsterBar() {
    if ( !cfg.monsterBar[0] || cfg.quickbarBesideMonsters || cfg.condenseLeft ) return;
    var mbar, div, img;
    for ( var i = 0; i < monsters.length; i++ ) {
        mbar = document.createElement('div');
        mbar.id = 'mbar_' + i;
        mbar.className = 'mbar';
        for ( var j = 0; (j < 3 || (j < 4 && !cfg.spacedBar)) && j < cfg.monsterBar.length; j++ ) {
            div = document.createElement('div');
            div.className = 'btqs mbs';
            img = document.createElement('img');
            img.src = cfg.monsterBar[j][1] ?
                      '/y/a/' + document.getElementById(cfg.monsterBar[j][1]).getAttribute('onmouseover').match(regexp.spellicon)[1] + '.png' :
                      '/y/e/wpn_bleed.png';
            img.className = 'btqi';
            div.appendChild(img);
            img = document.createElement('img');
            img.src = '/y/ab/b.png';
            img.className = 'btqb';
            div.appendChild(img);
            if ( cfg.monsterBar[j][0] ) {
                div.onmouseout = Disengage;
                div.onmouseover = BarEngage(i, cfg.monsterBar[j]); }
            else {
                div.onclick = BarAction(i, cfg.monsterBar[j]); }
            mbar.appendChild(div); }
        document.body.appendChild(mbar); }}

function Disengage() { target = false; override = false; }

function BarEngage(i, actions) {
    return function() {
        if ( !monsters[i].hasAttribute('onclick') ) return;
        override = StrongestBar(actions);
        SetTarget(i)(); };}

function BarAction(i, actions) {
    return function() {
        if ( !monsters[i].hasAttribute('onclick') ) return;
        StrongestBar(actions)();
        monsters[i].click(); };}

function StrongestBar(actions) { return function() { var n = actions.length; while ( n-- > 1 ) document.getElementById(actions[n]).click(); };}

function ProcessLog() {
    turn = log.innerHTML.match(regexp.turn);
    if ( turn ) turn = turn[0]; else return;
    if ( !cfg.showCooldowns && !cfg.trackSpeed && !cfg.trackDamage && !cfg.trackUsage ) return;
    if ( !timelog.startTime && cfg.trackSpeed ) {
        timelog.startTime = Date.now();
        timelog.pauseTime = 0; }
    if ( turn.indexOf('You gain the effect Cloak of the Fallen.') > -1 ) timelog.spark = (timelog.spark ? timelog.spark : 0) + 1;
    var action = turn.match(regexp.action);
    if ( action ) action = action[1]; else return;
    timelog.action++;
    var zeroturn = regexp.zeroturn.test(action);
    if ( !zeroturn ) timelog.turn++;
    var use = action.match(regexp.use), miss, counter;
    if ( use ) {
        use = use[2];
        if ( cfg.showCooldowns ) timelog.lastuse[use] = zeroturn ? timelog.action : timelog.turn;
        if ( cfg.trackUsage ) combatlog.used[use] = (combatlog.used[use] ? combatlog.used[use] : 0) + 1; }
    else if ( !cfg.trackUsage ) {}
    else if ( action.indexOf('Spirit Stance') > -1 ) combatlog.used.Spirit = (combatlog.used.Spirit ? combatlog.used.Spirit : 0) + 1;
    else if ( action.indexOf('Defending.') > -1 ) combatlog.used.Defend = (combatlog.used.Defend ? combatlog.used.Defend : 0) + 1;
    else if ( action.indexOf('Focusing.') > -1 ) combatlog.used.Focus = (combatlog.used.Focus ? combatlog.used.Focus : 0) + 1;
    else combatlog.used.Attack = (combatlog.used.Attack ? combatlog.used.Attack : 0) + 1;
    if ( cfg.trackDamage ) {
        var dmg;
        if ( (dmg = turn.match(regexp.damage)) ) {
            var cast = action.indexOf('You cast') > -1, data, shield;
            for ( var i = 0; i < dmg.length; i++ ) {
                if ( (data = dmg[i].match(regexp.type)) ) {
                    if ( dmg[i].indexOf('its you for') > -1 ) {
                        var crit = dmg[i].indexOf(' crits ') > -1;
                        if ( dmg[i].indexOf(' casts ') > -1 ) {
                            combatlog.mtaken.hit++;
                            if ( crit ) combatlog.mtaken.crit++;
                            combatlog.mtaken[data[2]] = (combatlog.mtaken[data[2]] ? combatlog.mtaken[data[2]] : 0) + parseInt(data[1]);
                            if ( (shield = dmg[i].match(regexp.shield)) ) {
                                combatlog.mtaken.shit++;
                                if ( crit ) combatlog.mtaken.scrit++;
                                combatlog.mtaken['s'+data[2]] = (combatlog.mtaken['s'+data[2]] ? combatlog.mtaken['s'+data[2]] : 0) + parseInt(shield[1]); }}
                        else {
                            combatlog.ptaken.hit++;
                            if ( crit ) combatlog.ptaken.crit++;
                            combatlog.ptaken[data[2]] = (combatlog.ptaken[data[2]] ? combatlog.ptaken[data[2]] : 0) + parseInt(data[1]);
                            if ( (shield = dmg[i].match(regexp.shield)) ) {
                                combatlog.ptaken.shit++;
                                if ( crit ) combatlog.ptaken.scrit++;
                                combatlog.ptaken['s'+data[2]] = (combatlog.ptaken['s'+data[2]] ? combatlog.ptaken['s'+data[2]] : 0) + parseInt(shield[1]); }}}
                    else {
                        if ( cast ) {
                            if ( dmg[i].indexOf(' explodes ') < 0 ) {
                                combatlog.mdealt.hit++;
                                if ( dmg[i].indexOf(' blasts ') > -1 ) combatlog.mdealt.crit++; }
                            combatlog.mdealt[data[2]] = (combatlog.mdealt[data[2]] ? combatlog.mdealt[data[2]] : 0) + parseInt(data[1]); }
                        else {
                            if ( !regexp.strike.test(dmg[i]) ) {
                                combatlog.pdealt.hit++;
                                if ( regexp.crit.test(dmg[i]) ) combatlog.pdealt.crit++; }
                            combatlog.pdealt[data[2]] = (combatlog.pdealt[data[2]] ? combatlog.pdealt[data[2]] : 0) + parseInt(data[1]); }}}
                else if ( (data = dmg[i].match(regexp.dot)) ) {
                    if ( regexp.pdot.test(dmg[i]) ) combatlog.pdealt.dot = (combatlog.pdealt.dot ? combatlog.pdealt.dot : 0) + parseInt(data[1]);
                    else combatlog.mdealt.dot = (combatlog.mdealt.dot ? combatlog.mdealt.dot : 0) + parseInt(data[1]); }
                else if ( (data = dmg[i].match(regexp.points)) ) {
                    if ( dmg[i].indexOf('You counter') > -1 ) {
                        combatlog.pdealt.hit++;
                        combatlog.pdealt[data[2]] = (combatlog.pdealt[data[2]] ? combatlog.pdealt[data[2]] : 0) + parseInt(data[1]); }
                    else {
                        combatlog.mdealt[data[2]] = (combatlog.mdealt[data[2]] ? combatlog.mdealt[data[2]] : 0) + parseInt(data[1]); }}}}
        if ( (miss = turn.match(regexp.mdmiss)) ) combatlog.mdealt.miss += miss.length;
        if ( (miss = turn.match(regexp.mdevade)) ) combatlog.mdealt.evade += miss.length;
        if ( (miss = turn.match(regexp.mdresist)) ) combatlog.mdealt.resist += miss.length;
        if ( (miss = turn.match(regexp.md50)) ) combatlog.mdealt.r50 += miss.length;
        if ( (miss = turn.match(regexp.md75)) ) combatlog.mdealt.r75 += miss.length;
        if ( (miss = turn.match(regexp.md90)) ) combatlog.mdealt.r90 += miss.length;
        if ( (miss = turn.match(regexp.pdmiss)) ) combatlog.pdealt.miss += miss.length;
        if ( (miss = turn.match(regexp.pdevade)) ) combatlog.pdealt.evade += miss.length;
        if ( (miss = turn.match(regexp.pdparry)) ) combatlog.pdealt.parry += miss.length;
        if ( (miss = turn.match(regexp.mtevade)) ) combatlog.mtaken.evade += miss.length;
        if ( (miss = turn.match(regexp.mtblock)) ) combatlog.mtaken.block += miss.length;
        if ( (miss = turn.match(regexp.mt50)) ) combatlog.mtaken.r50 += miss.length;
        if ( (miss = turn.match(regexp.mt75)) ) combatlog.mtaken.r75 += miss.length;
        if ( (miss = turn.match(regexp.mt90)) ) combatlog.mtaken.r90 += miss.length;
        if ( (miss = turn.match(regexp.ptmiss)) ) combatlog.ptaken.miss += miss.length;
        if ( (miss = turn.match(regexp.ptevade)) ) combatlog.ptaken.evade += miss.length;
        if ( (miss = turn.match(regexp.ptparry)) ) combatlog.ptaken.parry += miss.length;
        if ( (miss = turn.match(regexp.ptblock)) ) combatlog.ptaken.block += miss.length; }
    if ( cfg.trackUsage && (counter = turn.match(regexp.counter)) ) combatlog.used.Counter = (combatlog.used.Counter ? combatlog.used.Counter : 0) + counter.length; }

function GetItemKey() {
    if ( !cfg.showCooldowns || itemkey ) return;
    itemkey = {};
    var items = document.querySelectorAll(':not([id])>.bti1');
    for ( var i = 0; i < items.length; i++ ) {
        var item = items[i], key = item.firstElementChild, name = item.lastElementChild;
        if ( key && (key = key.textContent.trim().toLowerCase()) && name && (name = name.textContent.trim()) ) {
            itemkey['ikey_' + key] = name; }}}

function ShowCooldowns() {
    if ( !cfg.showCooldowns ) return;
    var quickbar = document.getElementById('quickbar'), info, used, cooldown, div,
        buttons = quickbar.querySelectorAll('.btqs[onmouseover]:not([onclick])'), n = buttons.length;
    for ( var idx = 0; idx < cfg.quickbarExtend.length; idx++ ) {
        if ( (info = itemkey[cfg.quickbarExtend[idx]]) && (used = timelog.lastuse[info]) &&
             (cooldown = 41 - timelog.action + used) > 0 ) {
            div = document.createElement('div');
            div.className = 'cooldown';
            div.innerHTML = cooldown;
            quickbar.children[16+idx].appendChild(div); }}
    while ( n-- > 0 ) {
        if ( (info = buttons[n].getAttribute('onmouseover').match(regexp.spellinfo)) &&
             (used = timelog.lastuse[info[1]]) && (cooldown = info[2] - timelog.turn + used) > 0 ) {
            div = document.createElement('div');
            div.className = 'cooldown';
            div.innerHTML = cooldown;
            buttons[n].appendChild(div); }}}

function MaxVitals() {
    if ( !cfg.maxVitals ) return;
    var hpd, mpd, spd, changed = false;
    if ( (hpd = document.getElementById('dvrhd') || document.getElementById('dvrhb')) ) {
        mpd = document.getElementById('dvrm');
        spd = document.getElementById('dvrs'); }
    else {
        hpd = document.getElementById('vrhd') || document.getElementById('vrhb');
        mpd = document.getElementById('vrm');
        spd = document.getElementById('vrs'); }
    var hpv = parseInt(hpd.innerHTML), mpv = parseInt(mpd.innerHTML), spv = parseInt(spd.innerHTML);
    if ( hpv > vitals.hp ) { vitals.hp = hpv; changed = true; }
    if ( mpv > vitals.mp ) { vitals.mp = mpv; changed = true; }
    if ( spv > vitals.sp ) { vitals.sp = spv; changed = true; }
    hpd.innerHTML = hpv + '/' + vitals.hp;
    mpd.innerHTML = mpv + '/' + vitals.mp;
    spd.innerHTML = spv + '/' + vitals.sp; }

function FormatLog() {
    if ( !cfg.logColours && !cfg.turnDividers ) return;
    var rows = log.getElementsByTagName('td');
    for ( var i = 0; i < rows.length; i++ ) {
        if ( rows[i].className == 'tls' ) {
            if ( cfg.turnDividers ) {
                rows[i].innerHTML = '<hr>'; }
            break; }
        var text = rows[i].innerHTML;
        if ( cfg.logColours ) {
            if ( regexp.crit.test(text) ) {
                rows[i].className = 'tlb'; }
            if ( regexp.miss.test(text) ) {
                rows[i].className += ' miss'; }
            else if ( text.indexOf('its you for') > -1 ) {
                rows[i].className += ' damage'; }
            else if ( regexp.zeroturn.test(text) ) {
                rows[i].className += ' item'; }
            else if ( regexp.attack.test(text) ) {
                rows[i].className += ' attack'; }
            else if ( regexp.spell.test(text) ) {
                rows[i].className += ' spell'; }
            else if ( regexp.recovery.test(text) ) {
                rows[i].className += ' recovery'; }
            else if ( text.indexOf('You gain the effect') > -1 ) {
                rows[i].className += ' effect'; }
            else if ( text.indexOf('Spirit Stance') > -1 ) {
                rows[i].className += ' spirit'; }
            else if ( text.indexOf('proficiency') > -1 ) {
                rows[i].className += ' proficiency'; }}}}

function PauseTimer(resume) {
    if ( !cfg.trackSpeed ) return;
    var now = Date.now();
    if ( resume!=true && timelog.startTime && !timelog.pauseStart ) {
        // manually trigger by user ( keybinding or click the round counter )
        timelog.pauseStart = now;
        document.getElementById('gay_sex').textContent += ' \u23EF\uFE0F'; }
    else if ( timelog.pauseStart ) {
        // a manual pause existed, resume the timer
        document.getElementById('gay_sex').textContent = document.getElementById('gay_sex').textContent.replace(' \u23EF\uFE0F', '');
        timelog.pauseTime += now - timelog.pauseStart;
        delete timelog.pauseStart; }
    else if ( cfg.autoPause > 0 && now - timelog.lastTime > cfg.autoPause * 1000 ) {
        // no action over the auto pause threoshold
        timelog.pauseTime += now - timelog.lastTime; }
    timelog.lastTime = now; }

function ShowRound() {
    var div = document.getElementById(cfg.bigRoundCounter ? 'mainpane' : 'battle_right').appendChild(document.createElement('div')), rounds;
    div.id = 'gay_sex';
    div.onclick = PauseTimer;
    if ( !cfg.showRound ) return;
    if ( !timelog.rounds && (rounds = log.innerHTML.match(regexp.round)) ) {
        timelog.round = rounds[1];
        timelog.rounds = rounds[2]; }
    if ( timelog.rounds ) {
        div.innerHTML = (cfg.bigRoundCounter ? '' : 'Round ') + timelog.round.toLocaleString() + ' / ' + timelog.rounds.toLocaleString();
        if ( cfg.bigRoundCounter ) {
            div.setAttribute('style', 'position: absolute; left: 1110px; top: 10px; font-size: 200%; font-weight: bold'); }}}

function CfgButton() {
    if ( !cfg.cfgButton ) return;
    var div = document.createElement('div');
    div.id = 'cfgbutton';
    div.innerHTML = '\u2699';
    div.onclick = Settings;
    document.body.appendChild(div);
    var hasper = regexp.profile.test(JSON.stringify(cfg.persona));
    var hasisk = regexp.profile.test(JSON.stringify(cfg.isekai.persona)) || (hasper && cfg.isekaiInherit);
    if ( (!isekai && hasper) || (isekai && hasisk) ) {
        var menu = div.appendChild(document.createElement('div'));
        const Set = function(i, p, s) {
            return function(e) {
                e.stopPropagation();
                var blue;
                if ( (blue = menu.querySelector('[style*="' + (isekai ? 'red' : 'blue') + '"')) ) {
                    blue.style.color = ''; }
                profile[isekai + 'p'] = p;
                if (p) {
                    profile[isekai + 's' + profile[isekai + 'p']] = s; }
                if ( JSON.stringify(profile) != localStorage.HVmbp ) {
                    localStorage.HVmbp = JSON.stringify(profile);
                    location.href = location.href; }
                i.style.color = isekai ? 'red' : 'blue'; };};
        menu.id = 'mbprofile';
        menu.className = 'fc4 fal fcb';
        var base = menu.appendChild(document.createElement('div')), blue = false;
        base.onclick = Set(base, 0, 0);
        if ( !isekai ) {
            base.innerHTML = cfg.name;
            for ( var i = 0; i < cfg.persona.length; i++ ) {
                if ( regexp.profile.test(JSON.stringify(cfg.persona[i])) ) {
                    var persona = menu.appendChild(document.createElement('div'));
                    persona.innerHTML = '- ' + cfg.persona[i].name;
                    persona.onclick = Set(persona, i+1, 0);
                    for ( var j = 0; j < cfg.persona[i].set.length; j++ ) {
                        if ( regexp.profile.test(JSON.stringify(cfg.persona[i].set[j])) ) {
                            var set = menu.appendChild(document.createElement('div'));
                            set.innerHTML = '-- ' + cfg.persona[i].set[j].name;
                            set.onclick = Set(set, i+1, j+1);
                            if ( profile.p == i+1 && profile['s' + profile.p] == j+1 ) {
                                set.style.color = 'blue';
                                blue = true; }}}
                    if ( profile.p == i+1 && (!blue || profile['s' + profile.p] == 0) ) {
                        persona.style.color = 'blue';
                        blue = true; }}}
            if ( !blue || profile.p == 0 ) {
                base.style.color = 'blue'; }}
        else {
            base.innerHTML = cfg.isekai.name;
            for ( i = 0; i < cfg.isekai.persona.length; i++ ) {
                hasisk = regexp.profile.test(JSON.stringify(cfg.isekai.persona[i]));
                hasper = regexp.profile.test(JSON.stringify(cfg.persona[i])) && cfg.isekaiInherit;
                if ( hasisk || hasper ) {
                    persona = menu.appendChild(document.createElement('div'));
                    persona.innerHTML = '- ' + (hasisk ? cfg.isekai.persona[i].name : cfg.persona[i].name);
                    persona.onclick = Set(persona, i+1, 0);
                    for ( j = 0; j < cfg.isekai.persona[i].set.length; j++ ) {
                        hasisk = regexp.profile.test(JSON.stringify(cfg.isekai.persona[i].set[j]));
                        hasper = regexp.profile.test(JSON.stringify(cfg.persona[i].set[j])) && cfg.isekaiInherit;
                        if ( hasisk || hasper ) {
                            set = menu.appendChild(document.createElement('div'));
                            set.innerHTML = '-- ' + (hasisk ? cfg.isekai.persona[i].set[j].name : cfg.persona[i].set[j].name);
                            set.onclick = Set(set, i+1, j+1);
                            if ( profile.ip == i+1 && profile['is' + profile.ip] == j+1 ) {
                                set.style.color = 'red';
                                blue = true; }}}
                    if ( profile.ip == i+1 && (!blue || profile['is' + profile.ip] == 0) ) {
                        persona.style.color = 'red';
                        blue = true; }}}
            if ( !blue || profile.ip == 0 ) {
                base.style.color = 'red'; }}}}

function TrackDrops() {
    if ( (!cfg.trackDrops && !cfg.trackProficiency && !cfg.proficiencySidebar) || !document.getElementById('btcp') ) return;
    if ( cfg.trackDrops ) {
        var reward = turn.match(regexp.reward);
        if ( reward && (reward = parseInt(reward[1])) ) {
            droplog.Credit = (droplog.Credit ? droplog.Credit : 0) + reward; }
        var drops = turn.match(regexp.drops);
        if ( !drops ) drops = [];
        var n = drops.length, crystal, crystals, credit, exp, proficiencies, proficiency, prof;
        while ( n-- > 0 ) {
            var drop = drops[n].match(regexp.drop);
            if ( drop[2] == 'BA05B4' && (crystal = drop[3].match(regexp.crystal)) ) {
                droplog.Crystal = (droplog.Crystal ? droplog.Crystal : 0) + (parseInt(crystal[1]) || 1);
                if ( cfg.detailedCrystlog && (crystals = drop[3].match(regexp.crystals)) ) {
                    droplog.Crystals[crystals[0]] = (droplog.Crystals[crystals[0]] ? droplog.Crystals[crystals[0]] : 0) + (parseInt(crystal[1]) || 1); }}
            else if (drop[2] == 'A89000' && (credit = drop[3].match(regexp.credit)) ) {
                droplog.Credit = (droplog.Credit ? droplog.Credit : 0) + (parseInt(credit[1]) || 1); }
            else if ( drop[2] == 'FF0000' && !drop[4] && regexp.quality[8].test(drop[0]) ) {
                var tracked = false;
                if ( (tracked = cfg.equipmentCutoff > 0 && drop[3].indexOf('Peerless') > -1) ) {
                    droplog.Peerless = (droplog.Peerless ? droplog.Peerless : 0) + 1; }
                else if ( (tracked = cfg.equipmentCutoff > 1 && drop[3].indexOf('Legendary') > -1) ) {
                    droplog.Legendary = (droplog.Legendary ? droplog.Legendary : 0) + 1; }
                else if ( (tracked = cfg.equipmentCutoff > 2 && drop[3].indexOf('Magnificent') > -1) ) {
                    droplog.Magnificent = (droplog.Magnificent ? droplog.Magnificent : 0) + 1; }
                else if ( (tracked = cfg.equipmentCutoff > 3 && drop[3].indexOf('Exquisite') > -1) ) {
                    droplog.Exquisite = (droplog.Exquisite ? droplog.Exquisite : 0) + 1; }
                else if ( (tracked = cfg.equipmentCutoff > 4 && drop[3].indexOf('Superior') > -1) ) {
                    droplog.Superior = (droplog.Superior ? droplog.Superior : 0) + 1; }
                else if ( (tracked = cfg.equipmentCutoff > 5 && drop[3].indexOf('Average') > -1) ) {
                    droplog.Average = (droplog.Average ? droplog.Average : 0) + 1; }
                else if ( (tracked = cfg.equipmentCutoff > 6 && drop[3].indexOf('Fair') > -1) ) {
                    droplog.Fair = (droplog.Fair ? droplog.Fair : 0) + 1; }
                else if ( (tracked = cfg.equipmentCutoff > 7 && drop[3].indexOf('Crude') > -1) ) {
                    droplog.Crude = (droplog.Crude ? droplog.Crude : 0) + 1; }
                else {
                    droplog.Equipment = (droplog.Equipment ? droplog.Equipment : 0) + 1; }
                if ( cfg.detailedDroplog && tracked ) {
                    droplog.Equips[drop[3]] = (droplog.Equips[drop[3]] ? droplog.Equips[drop[3]] : 0) + 1; }}
            else if ( drop[2] == 'FF0000' && !drop[4] ) {
                droplog.Material = (droplog.Material ? droplog.Material : 0) + (parseInt(drop[1]) || 1);
                if ( cfg.detailedDroplog ) {
                    droplog.Mats[drop[3]] = (droplog.Mats[drop[3]] ? droplog.Mats[drop[3]] : 0) + (parseInt(drop[1]) || 1); }}
            else if ( drop[3].indexOf('Chaos') > -1 ) {
                droplog.Chaos = (droplog.Chaos ? droplog.Chaos : 0) + 1; }
            else if ( drop[3].indexOf('Blood') > -1 ) {
                droplog.Blood = (droplog.Blood ? droplog.Blood : 0) + 1; }
            else if ( drop[3].indexOf('Soul') > -1 ) {
                droplog.Soul = (droplog.Soul ? droplog.Soul : 0) + (drop[1] == 'five' ? 5 : (parseInt(drop[1]) || 1)); }
            else if ( drop[3].indexOf('Figurine') > -1 ) {
                droplog.Figurine = (droplog.Figurine ? droplog.Figurine : 0) + 1;
                if ( cfg.detailedDroplog ) {
                    droplog.Figurines[drop[3]] = (droplog.Figurines[drop[3]] ? droplog.Figurines[drop[3]] : 0) + 1; }}
            else if ( drop[2] == '0000FF' ) {
                droplog.Artifact = (droplog.Artifact ? droplog.Artifact : 0) + 1;
                if ( cfg.detailedDroplog ) {
                    droplog.Artifacts[drop[3]] = (droplog.Artifacts[drop[3]] ? droplog.Artifacts[drop[3]] : 0) + 1; }}
            else if ( drop[2] == '461B7E' ) {
                droplog.Trophy = (droplog.Trophy ? droplog.Trophy : 0) + 1;
                if ( cfg.detailedDroplog ) {
                    droplog.Trophies[drop[3]] = (droplog.Trophies[drop[3]] ? droplog.Trophies[drop[3]] : 0) + 1; }}
            else if ( drop[2] == '00B000' && drop[3].indexOf('Gem') < 0 ) {
                droplog.Consumable = (droplog.Consumable ? droplog.Consumable : 0) + 1;
                if ( cfg.detailedDroplog ) {
                    droplog.Consumables[drop[3]] = (droplog.Consumables[drop[3]] ? droplog.Consumables[drop[3]] : 0) + 1; }}
            else if ( drop[2] == '489EFF' ) {
                droplog.Food = (droplog.Food ? droplog.Food : 0) + 1;
                if ( cfg.detailedDroplog ) {
                    droplog.Foods[drop[3]] = (droplog.Foods[drop[3]] ? droplog.Foods[drop[3]] : 0) + 1; }}}
        if ( (exp = log.innerHTML.match(regexp.exp)) ) {
            droplog.EXP = (droplog.EXP ? droplog.EXP : 0) + parseInt(exp[1]); }}
    if ( (cfg.trackProficiency || cfg.proficiencySidebar) && (proficiencies = turn.match(regexp.proficiencies)) ) {
        for ( var i = 0; i < proficiencies.length; i++ ) {
            if ( (proficiency = proficiencies[i].match(regexp.proficiency)) && (prof = parseFloat(proficiency[1])) && prof > 0 ) {
                droplog.proficiency[proficiency[2]] = (droplog.proficiency[proficiency[2]] ? droplog.proficiency[proficiency[2]] : 0) + prof; }}}}

function Profbar() {
    if ( !cfg.proficiencySidebar ) return;
    var profbar = document.getElementById('profbar');
    if ( !profbar ) {
        profbar = document.createElement('table');
        profbar.id = 'profbar';
        document.getElementById('csp').appendChild(profbar); }
    profbar.innerHTML = '<thead><tr><th colspan="2">熟练度获得量</th></tr></thead>' +
        (droplog.proficiency['one-handed weapon'] ? '<tr><td>' + droplog.proficiency['one-handed weapon'].toFixed(3) + '</td><td style="font-weight: bold;">单手熟练</td></tr>' : '') +
        (droplog.proficiency['two-handed weapon'] ? '<tr><td>' + droplog.proficiency['two-handed weapon'].toFixed(3) + '</td><td style="font-weight: bold;">双手熟练</td></tr>' : '') +
        (droplog.proficiency['dual wielding'] ? '<tr><td>' + droplog.proficiency['dual wielding'].toFixed(3) + '</td><td style="font-weight: bold;">双持熟练</td></tr>' : '') +
        (droplog.proficiency['cloth armor'] ? '<tr><td>' + droplog.proficiency['cloth armor'].toFixed(3) + '</td><td style="font-weight: bold;">布甲熟练</td></tr>' : '') +
        (droplog.proficiency['light armor'] ? '<tr><td>' + droplog.proficiency['light armor'].toFixed(3) + '</td><td style="font-weight: bold;">轻甲熟练</td></tr>' : '') +
        (droplog.proficiency['heavy armor'] ? '<tr><td>' + droplog.proficiency['heavy armor'].toFixed(3) + '</td><td style="font-weight: bold;">重甲熟练</td></tr>' : '') +
        (droplog.proficiency.staff ? '<tr><td>' + droplog.proficiency.staff.toFixed(3) + '</td><td style="font-weight: bold;">法杖熟练</td></tr>' : '') +
        (droplog.proficiency['elemental magic'] ? '<tr><td>' + droplog.proficiency['elemental magic'].toFixed(3) + '</td><td style="font-weight: bold;">元素熟练</td></tr>' : '') +
        (droplog.proficiency['divine magic'] ? '<tr><td>' + droplog.proficiency['divine magic'].toFixed(3) + '</td><td style="font-weight: bold;">神圣熟练</td></tr>' : '') +
        (droplog.proficiency['forbidden magic'] ? '<tr><td>' + droplog.proficiency['forbidden magic'].toFixed(3) + '</td><td style="font-weight: bold;">黑暗熟练</td></tr>' : '') +
        (droplog.proficiency['deprecating magic'] ? '<tr><td>' + droplog.proficiency['deprecating magic'].toFixed(3) + '</td><td style="font-weight: bold;">减益熟练</td></tr>' : '') +
        (droplog.proficiency['supportive magic'] ? '<tr><td>' + droplog.proficiency['supportive magic'].toFixed(3) + '</td><td style="font-weight: bold;">增益熟练</td></tr>' : '') +
        '</tbody>'; }

function ShowDrops(end) {
    var btcp = document.getElementById('btcp');
    if ( end && !btcp ) return;
    if ( !end && !btcp ) {
        if ( (btcp = document.getElementById('dropbox')) ) {
            btcp.parentNode.removeChild(btcp);
            return; }
        btcp = document.createElement('div');
        btcp.id = 'dropbox';
        document.getElementById('pane_completion').appendChild(btcp); }
    if ( end && cfg.selectLog ) {
        document.querySelector('img[src$="finishbattle.png"]').setAttribute('onclick', btcp.getAttribute('onclick'));
        btcp.removeAttribute('onclick'); }
    var span, crystal, credit, peerless, legendary, magnificent, exquisite, superior, average, fair, crude, equipment,
        material, chaos, blood, soul, artifact, figurine, trophy, consumable, food, exp, turns, startTime;
    if ( cfg.consoleLog ) {
        console.log(JSON.stringify(combatlog));
        console.log(JSON.stringify(droplog)); }
    btcp.setAttribute('style', 'display: block; height: auto; min-height: 120px; max-height: 621px; overflow: auto');
    if ( (crystal = droplog.Crystal) ) {
        btcp.appendChild(document.createElement('br'));
        span = btcp.appendChild(document.createElement('span'));
        span.className = 'drop crystal';
        span.innerHTML = crystal.toLocaleString() + (cfg.terseLog ? '\t' : ' ') + '水晶' + (crystal > 1 || cfg.terseLog ? '' : '');

        if ( cfg.detailedCrystlog ) {
                    // 映射表，将英文属性名映射到中文名
           const crystalsMapping = {
        'Crystal of Vigor' : '力量水晶',
        'Crystal of Finesse' : '灵巧水晶',
        'Crystal of Swiftness' : '敏捷水晶',
        'Crystal of Fortitude' : '体质水晶',
        'Crystal of Cunning' : '智力水晶',
        'Crystal of Knowledge' : '智慧水晶',
        'Crystal of Flames' : '火焰水晶',
        'Crystal of Frost' : '冰冻水晶',
        'Crystal of Lightning' : '闪电水晶',
        'Crystal of Tempest' : '疾风水晶',
        'Crystal of Devotion' : '神圣水晶',
        'Crystal of Corruption' : '暗黑水晶',
         // 添加其他属性名的映射...
            };
            for ( var crystals in droplog.Crystals ) {
                btcp.appendChild(document.createElement('br'));
                span = btcp.appendChild(document.createElement('span'));
                span.className = 'drop crystal';
                const chineseName = crystalsMapping[crystals] || crystals;
                span.innerHTML = droplog.Crystals[crystals].toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + chineseName;}}}
    if ( (credit = droplog.Credit) ) {
        btcp.appendChild(document.createElement('br'));
        span = btcp.appendChild(document.createElement('span'));
        span.className = 'drop credit';
        span.innerHTML = credit.toLocaleString() + (cfg.terseLog ? '\t' : ' ') + 'Credit' + (credit > 1 || cfg.terseLog ? 's' : ''); }
    if ( cfg.detailedDroplog ) {
        for ( var equips in droplog.Equips ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop equipment';
            span.innerHTML = droplog.Equips[equips].toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + equips; }}
    else {
        if ( (peerless = droplog.Peerless) ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop equipment';
            span.innerHTML = peerless.toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + '☯无双☯ 装备'; }
        if ( (legendary = droplog.Legendary) ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop equipment';
            span.innerHTML = legendary.toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + '✪传奇✪ 装备'; }
        if ( (magnificent = droplog.Magnificent) ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop equipment';
            span.innerHTML = magnificent.toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + '☆史诗☆ 装备'; }
        if ( (exquisite = droplog.Exquisite) ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop equipment';
            span.innerHTML = exquisite.toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + '✧精良✧ 装备'; }
        if ( (superior = droplog.Superior) ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop equipment';
            span.innerHTML = superior.toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + '上等 装备'; }
        if ( (average = droplog.Average) ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop equipment';
            span.innerHTML = average.toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + '中等 装备'; }
        if ( (fair = droplog.Fair) ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop equipment';
            span.innerHTML = fair.toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + '普通 装备'; }
        if ( (crude = droplog.Crude) ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop equipment';
            span.innerHTML = crude.toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + '粗糙 装备'; }}
    if ( (equipment = droplog.Equipment) ) {
        btcp.appendChild(document.createElement('br'));
        span = btcp.appendChild(document.createElement('span'));
        span.className = 'drop equipment';
        span.innerHTML = equipment.toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + (cfg.equipmentCutoff > 0 ? '低级 ' : '') + '装备'; }
    if ( cfg.detailedDroplog ) {
        // 映射表，将英文属性名映射到中文名
const materialsMapping = {
        'Low-Grade Cloth': '低级布料',
        'Mid-Grade Cloth': '中级布料',
        'High-Grade Cloth': '高级布料',
        'Low-Grade Leather': '低级皮革',
        'Mid-Grade Leather': '中级皮革',
        'High-Grade Leather': '高级皮革',
        'Low-Grade Metals': '低级金属',
        'Mid-Grade Metals': '中级金属',
        'High-Grade Metals': '高级金属',
        'Low-Grade Wood': '低级木材',
        'Mid-Grade Wood': '中级木材',
        'High-Grade Wood': '高级木材',
        'Scrap Metal' : '金属废料',
        'Scrap Leather' : '皮革废料',
        'Scrap Wood' : '木材废料',
        'Scrap Cloth' : '废布料',
        'Energy Cell' : '能量元',
        'Defense Matrix Modulator' : '力场碎片(盾)',
        'Repurposed Actuator' : '动力碎片(重)',
        'Shade Fragment' : '暗影碎片(轻)',
        'Crystallized Phazon' : '相位碎片(布)',
        'Voidseeker Shard' : '虚空碎片',
        'Featherweight Shard' : '羽毛碎片',
        'Aether Shard' : '以太碎片',
        'Amnesia Shard' : '重铸碎片',
    // 添加属性名的映射...
};
        for ( var mats in droplog.Mats ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop equipment';
            const chineseName = materialsMapping[mats] || mats;
        span.innerHTML = droplog.Mats[mats].toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + chineseName;
    }
}
    else {
        if ( (material = droplog.Material) ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop equipment';
            span.innerHTML = material.toLocaleString() + (cfg.terseLog ? '\t' : ' ') + '材料' + (material > 1 && !cfg.terseLog ? '' : '');}}
    if ( (chaos = droplog.Chaos) ) {
        btcp.appendChild(document.createElement('br'));
        span = btcp.appendChild(document.createElement('span'));
        span.className = 'drop token';
        span.innerHTML = chaos.toLocaleString() + (cfg.terseLog ? '\t' : ' ') + '混沌令牌' + (chaos > 1 && !cfg.terseLog ? '' : ''); }
    if ( (blood = droplog.Blood) ) {
        btcp.appendChild(document.createElement('br'));
        span = btcp.appendChild(document.createElement('span'));
        span.className = 'drop token';
        span.innerHTML = blood.toLocaleString() + (cfg.terseLog ? '\t' : ' ') + '鲜血令牌' + (blood > 1 && !cfg.terseLog ? '' : '') + ''; }
    if ( (soul = droplog.Soul) ) {
        btcp.appendChild(document.createElement('br'));
        span = btcp.appendChild(document.createElement('span'));
        span.className = 'drop token';
        span.innerHTML = soul.toLocaleString() + (cfg.terseLog ? '\t' : ' ') + ' 灵魂碎片' + (cfg.terseLog ? '' : ''); }
    if ( cfg.detailedDroplog ) {
        for ( var artifacts in droplog.Artifacts ) {
            const artifactsMapping = {
         'Precursor Artifact' : '古遗物',
    // 添加属性名的映射...
};
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop artifact';
const chineseName = artifactsMapping[artifacts] || artifacts;

    span.innerHTML = droplog.Artifacts[artifacts].toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + chineseName;
}
        for ( var figurines in droplog.Figurines ) {
            // 映射表，将英文属性名映射到中文名
const figurinesMapping = {
        'Twilight Sparkle Figurine' : '暮光闪闪公仔',
        'Rainbow Dash Figurine' : '云宝黛西公仔',
        'Applejack Figurine' : '苹果杰克公仔',
        'Fluttershy Figurine' : '小蝶公仔',
        'Pinkie Pie Figurine' : '萍琪派公仔',
        'Rarity Figurine' : '瑞瑞公仔',
        'Trixie Figurine' : '崔克茜公仔',
        'Princess Celestia Figurine' : '塞拉斯蒂亚公主公仔',
        'Princess Luna Figurine' : '露娜公主公仔',
        'Apple Bloom Figurine' : '小苹花公仔',
        'Scootaloo Figurine' : '飞板璐公仔',
        'Sweetie Belle Figurine' : '甜贝儿公仔',
        'Big Macintosh Figurine' : '大麦克公仔',
        'Spitfire Figurine' : '飞火公仔',
        'Derpy Hooves Figurine' : '小呆公仔',
        'Lyra Heartstrings Figurine' : '天琴心弦公仔',
        'Octavia Figurine' : '奥塔维亚公仔',
        'Zecora Figurine' : '泽科拉公仔',
        'Cheerilee Figurine' : '车厘子公仔',
        'Vinyl Scratch Figurine' : '维尼尔公仔',
        'Daring Do Figurine' : '无畏天马公仔',
        'Doctor Whooves Figurine' : '神秘博士公仔',
        'Berry Punch Figurine' : '酸梅酒公仔',
        'Bon-Bon Figurine' : '糖糖公仔',
        'Fluffle Puff Figurine' : '毛毛马公仔',
        'Angel Bunny Figurine' : '天使兔公仔',
        'Gummy Figurine' : '嘎米公仔',
    // 添加属性名的映射...
};
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop artifact';
const chineseName = figurinesMapping[figurines] || figurines;

    span.innerHTML = droplog.Figurines[figurines].toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + chineseName;
}
        for ( var trophies in droplog.Trophies ) {
            const trophiesMapping = {
        'ManBearPig Tail' : '人熊猪的尾巴(等级2)',
        'Holy Hand Grenade of Antioch' : '安提阿的神圣手榴弹(等级2)',
        'Mithra\'s Flower' : '猫人族的花(等级2)',
        'Dalek Voicebox' : '戴立克音箱(等级2)',
        'Lock of Blue Hair' : '一绺蓝发(等级2)',
        'Bunny-Girl Costume' : '兔女郎装(等级3)',
        'Hinamatsuri Doll' : '雏人形(等级3)',
        'Broken Glasses' : '破碎的眼镜(等级3)',
        'Sapling' : '树苗(等级4)',
        'Black T-Shirt' : '黑色Ｔ恤(等级4)',
        'Unicorn Horn' : '独角兽的角(等级5)',
        'Noodly Appendage' : '面条般的附肢(等级6)',
    // 添加属性名的映射...
};
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop trophy';
const chineseName = trophiesMapping[trophies] || trophies;

    span.innerHTML = droplog.Trophies[trophies].toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + chineseName;
}


for (var consumables in droplog.Consumables) {
            // 映射表，将英文属性名映射到中文名
        const consumablesMapping = {
        'Health Potion' : '生命药水',
        'Health Draught' : '生命长效药',
        'Health Elixir' : '生命秘药',
        'Mana Potion' : '法力药水',
        'Mana Draught' : '法力长效药',
        'Mana Elixir' : '法力秘药',
        'Spirit Potion' : '灵力药水',
        'Spirit Draught' : '灵力长效药',
        'Spirit Elixir' : '灵力秘药',
        'Last Elixir' : '终极秘药',
        'Flower Vase' : '花瓶',
        'Bubble-Gum' : '泡泡糖',
        'Infusion of Darkness' : '黑暗魔药',
        'Infusion of Divinity' : '神圣魔药',
        'Infusion of Storms' : '风暴魔药',
        'Infusion of Lightning' : '闪电魔药',
        'Infusion of Frost' : '冰冷魔药',
        'Infusion of Flames' : '火焰魔药',
        'Scroll of Swiftness' : '加速卷轴',
        'Scroll of the Avatar' : '化身卷轴',
        'Scroll of Shadows' : '幻影卷轴',
        'Scroll of Absorption' : '吸收卷轴',
        'Scroll of Life' : '生命卷轴',
        'Scroll of Protection' : '保护卷轴',
        'Scroll of the Gods' : '神之卷轴',
        'Voidseeker Shard' : '虚空碎片',
        'Featherweight Shard' : '羽毛碎片',
        'Aether Shard' : '以太碎片',
        'Amnesia Shard' : '重铸碎片',
    // 添加其他属性名的映射...
};
    btcp.appendChild(document.createElement('br'));
    span = btcp.appendChild(document.createElement('span'));
    span.className = 'drop consumable';
    // 将英文属性名替换为中文名，如果映射表中没有对应的中文名，则保留英文名
    const chineseName = consumablesMapping[consumables] || consumables;
    span.innerHTML = droplog.Consumables[consumables].toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + chineseName;
}
        for ( var foods in droplog.Foods ) {
            // 映射表，将英文属性名映射到中文名
const foodsMapping = {
        'Monster Chow' : '怪物饲料',
        'Monster Edibles' : '怪物食品',
        'Monster Cuisine' : '怪物料理',
        'Happy Pills' : '快乐药丸',
    // 添加属性名的映射...
};
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop food';
const chineseName = foodsMapping[foods] || foods;

    span.innerHTML = droplog.Foods[foods].toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + chineseName;
}}
    else {
        if ( (artifact = droplog.Artifact) ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop artifact';
            span.innerHTML = artifact.toLocaleString() + (cfg.terseLog ? '\t' : ' ') + '文物' + (artifact > 1 && !cfg.terseLog ? '' : ''); }
        if ( (figurine = droplog.Figurine) ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop artifact';
            span.innerHTML = figurine.toLocaleString() + (cfg.terseLog ? '\t' : ' ') + '小马手办' + (figurine > 1 && !cfg.terseLog ? '' : ''); }
        if ( (trophy = droplog.Trophy) ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop trophy';
            span.innerHTML = trophy.toLocaleString() + (cfg.terseLog ? '\t' : ' ') + '奖杯' + (trophy > 1 && !cfg.terseLog ? '' : ''); }
        if ( (consumable = droplog.Consumable) ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop consumable';
            span.innerHTML = consumable.toLocaleString() + (cfg.terseLog ? '\t' : ' ') + '消耗品' + (consumable > 1 && !cfg.terseLog ? '' : ''); }
        if ( (food = droplog.Food) ) {
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop food';
            span.innerHTML = food.toLocaleString() + (cfg.terseLog ? '\t' : 'x ') + '怪物食品'; }}
    if ( (exp = droplog.EXP) ) {
        btcp.appendChild(document.createElement('br'));
        span = btcp.appendChild(document.createElement('span'));
        span.className = 'drop';
        span.innerHTML = exp.toLocaleString() + (cfg.terseLog ? '\t' : ' ') + '经验'; }
    if ( cfg.trackProficiency ) {
        for ( var prof in droplog.proficiency ) {
            const proficiencyMapping = {
        'one-handed weapon':'单手武器熟练度',
        'two-handed weapon':'双手武器熟练度',
        'staff':'法杖熟练度',
        'cloth armor':'布甲熟练度',
        'light armor':'轻甲熟练度',
        'heavy armor':'重甲熟练度',
        'deprecating magic':'减益魔法熟练度',
        'supportive magic':'增益魔法熟练度',
        'elemental magic':'元素魔法熟练度',
        'divine magic':'神圣魔法熟练度',
        'forbidden magic':'黑暗魔法熟练度',
    // 添加属性名的映射...
};
            btcp.appendChild(document.createElement('br'));
            span = btcp.appendChild(document.createElement('span'));
            span.className = 'drop';
const chineseName = proficiencyMapping[prof] || prof;

    span.innerHTML = droplog.proficiency[prof].toFixed(3) + (cfg.terseLog ? '\t' : ' ') + chineseName;
}}
    if ( cfg.trackSpeed && (turns = timelog.action) && (startTime = timelog.startTime) ) {
        btcp.appendChild(document.createElement('br'));
        btcp.appendChild(document.createElement('br'));
        var time = (Date.now() - startTime - timelog.pauseTime) / 1000.0,
            dtime = Math.round(time),
            hours = Math.floor(dtime / 3600),
            minutes = Math.floor(dtime / 60) % 60,
            seconds = dtime % 60,
            tps = turns / time;
        span = btcp.appendChild(document.createElement('span'));
        span.className = 'speed';
        span.innerHTML = turns.toLocaleString() + ' 回合' + (turns == 1 ? '' : '') + '  ' +
                         hours + ':' +
                         (minutes < 10 ? '0' : '') + minutes + ':' +
                         (seconds < 10 ? '0' : '') + seconds + '  (' +
                         tps.toLocaleString() + ' 回合/秒)' +
                         (timelog.spark ? '  ' + timelog.spark + ' 次火花触发' + (timelog.spark > 1 ? '' : ''): '') +
                         (timelog.horse ? '  ' + timelog.horse + ' 次小马答题' + (timelog.horse > 1 ? '' : '') : '');
        if (timelog.pauseTime) {
            var pausetime = Math.round(timelog.pauseTime / 1000.0),
                pausehours = Math.floor(pausetime / 3600),
                pauseminutes = Math.floor(pausetime / 60) % 60,
                pauseseconds = pausetime % 60;
            span.innerHTML += '</br>(闲置时间: ' + pausehours + ':' +
                              (pauseminutes < 10 ? '0' : '') + pauseminutes + ':' +
                              (pauseseconds < 10 ? '0' : '') + pauseseconds + ')'; }}}

function ShowDamage() {
    if ( !cfg.trackDamage ) return;
    var any = { fire:     combatlog.pdealt.fire || combatlog.mdealt.fire || combatlog.ptaken.fire || combatlog.mtaken.fire,
                cold:     combatlog.pdealt.cold || combatlog.mdealt.cold || combatlog.ptaken.cold || combatlog.mtaken.cold,
                elec:     combatlog.pdealt.elec || combatlog.mdealt.elec || combatlog.ptaken.elec || combatlog.mtaken.elec,
                wind:     combatlog.pdealt.wind || combatlog.mdealt.wind || combatlog.ptaken.wind || combatlog.mtaken.wind,
                holy:     combatlog.pdealt.holy || combatlog.mdealt.holy || combatlog.ptaken.holy || combatlog.mtaken.holy,
                dark:     combatlog.pdealt.dark || combatlog.mdealt.dark || combatlog.ptaken.dark || combatlog.mtaken.dark,
                crushing: combatlog.pdealt.crushing || combatlog.mdealt.crushing || combatlog.ptaken.crushing || combatlog.mtaken.crushing,
                slashing: combatlog.pdealt.slashing || combatlog.mdealt.slashing || combatlog.ptaken.slashing || combatlog.mtaken.slashing,
                piercing: combatlog.pdealt.piercing || combatlog.mdealt.piercing || combatlog.ptaken.piercing || combatlog.mtaken.piercing,
                void:     combatlog.pdealt.void || combatlog.mdealt.void || combatlog.ptaken.void || combatlog.mtaken.void,
                dot:      combatlog.pdealt.dot || combatlog.mdealt.dot,
                pdealt:   combatlog.pdealt.dot || combatlog.pdealt.hit || combatlog.pdealt.miss || combatlog.pdealt.evade || combatlog.pdealt.parry,
                mdealt:   combatlog.mdealt.fire || combatlog.mdealt.cold || combatlog.mdealt.elec || combatlog.mdealt.wind ||
                            combatlog.mdealt.dot || combatlog.mdealt.hit || combatlog.mdealt.miss || combatlog.mdealt.evade || combatlog.mdealt.resist,
                ptaken:   combatlog.ptaken.hit || combatlog.ptaken.miss || combatlog.ptaken.evade || combatlog.ptaken.parry || combatlog.ptaken.block,
                mtaken:   combatlog.mtaken.hit || combatlog.mtaken.evade || combatlog.mtaken.block,
                pspirit:  combatlog.ptaken.sfire || combatlog.ptaken.scold || combatlog.ptaken.selec || combatlog.ptaken.swind || combatlog.ptaken.sholy ||
                            combatlog.ptaken.sdark || combatlog.ptaken.scrushing || combatlog.ptaken.sslashing || combatlog.ptaken.spiercing || combatlog.ptaken.svoid,
                mspirit:  combatlog.mtaken.sfire || combatlog.mtaken.scold || combatlog.mtaken.selec || combatlog.mtaken.swind || combatlog.mtaken.sholy ||
                            combatlog.mtaken.sdark || combatlog.mtaken.scrushing || combatlog.mtaken.sslashing || combatlog.mtaken.spiercing || combatlog.mtaken.svoid,
                hit:      combatlog.pdealt.hit || combatlog.mdealt.hit || combatlog.ptaken.hit || combatlog.mtaken.hit,
                r50:      combatlog.mdealt.r50 || combatlog.mtaken.r50,
                r75:      combatlog.mdealt.r75 || combatlog.mtaken.r75,
                r90:      combatlog.mdealt.r90 || combatlog.mtaken.r90,
                miss:     combatlog.pdealt.miss || combatlog.mdealt.miss || combatlog.ptaken.miss,
                evade:    combatlog.pdealt.evade || combatlog.mdealt.evade || combatlog.ptaken.evade || combatlog.mtaken.evade,
                parry:    combatlog.pdealt.parry || combatlog.ptaken.parry,
                resist:   combatlog.mdealt.resist,
                block:    combatlog.ptaken.block || combatlog.mtaken.block };
    if ( !any.pdealt && !any.mdealt && !any.ptaken && !any.mtaken ) return;
    any.dtotal = any.pdealt && any.mdealt;
    any.ttotal = any.ptaken && any.mtaken || any.pspirit || any.mspirit;
    any.none = any.miss || any.evade || any.parry || any.resist || any.block;
    const Row = function(type) {
            return any[type] ? '</tr><tr><td>' + type + '</td>' +
                (any.pdealt ? '<td>' + (combatlog.pdealt[type] ? combatlog.pdealt[type].toLocaleString() : '') + '</td>' : '') +
                (any.mdealt ? '<td>' + (combatlog.mdealt[type] ? combatlog.mdealt[type].toLocaleString() : '') + '</td>' : '') +
                (any.dtotal ? '<td>' + (combatlog.pdealt[type] || combatlog.mdealt[type] ?
                    ((combatlog.pdealt[type] ? combatlog.pdealt[type] : 0) + (combatlog.mdealt[type] ? combatlog.mdealt[type] : 0)).toLocaleString() : '') + '</td>' : '') +
                (any.ptaken ? '<td>' + (combatlog.ptaken[type] ? combatlog.ptaken[type].toLocaleString() : '') + '</td>' : '') +
                (any.pspirit ? '<td>' + (combatlog.ptaken['s'+type] ? combatlog.ptaken['s'+type].toLocaleString() : '') + '</td>' : '') +
                (any.mtaken ? '<td>' + (combatlog.mtaken[type] ? combatlog.mtaken[type].toLocaleString() : '') + '</td>' : '') +
                (any.mspirit ? '<td>' + (combatlog.mtaken['s'+type] ? combatlog.mtaken['s'+type].toLocaleString() : '') + '</td>' : '') +
                (any.ttotal ? '<td>' + (combatlog.ptaken[type] || combatlog.mtaken[type] ?
                    ((combatlog.ptaken[type] ? combatlog.ptaken[type] : 0) + (combatlog.ptaken['s'+type] ? combatlog.ptaken['s'+type]: 0) +
                     (combatlog.mtaken[type] ? combatlog.mtaken[type] : 0) + (combatlog.mtaken['s'+type] ? combatlog.mtaken['s'+type] : 0)).toLocaleString() : '') +
                    '</td>' : '') : ''; },
        Column = function(type, s) {
            return (combatlog[type][s+'fire'] ? combatlog[type][s+'fire'] : 0) + (combatlog[type][s+'cold'] ? combatlog[type][s+'cold'] : 0) +
                (combatlog[type][s+'elec'] ? combatlog[type][s+'elec'] : 0) + (combatlog[type][s+'wind'] ? combatlog[type][s+'wind'] : 0) +
                (combatlog[type][s+'holy'] ? combatlog[type][s+'holy'] : 0) + (combatlog[type][s+'dark'] ? combatlog[type][s+'dark'] : 0) +
                (combatlog[type][s+'crushing'] ? combatlog[type][s+'crushing'] : 0) + (combatlog[type][s+'slashing'] ? combatlog[type][s+'slashing'] : 0) +
                (combatlog[type][s+'piercing'] ? combatlog[type][s+'piercing'] : 0) + (combatlog[type][s+'void'] ? combatlog[type][s+'void'] : 0) +
                (combatlog[type][s+'dot'] ? combatlog[type][s+'dot'] : 0); },
        ColumnNone = function(type) {
            return (combatlog[type].miss ? combatlog[type].miss : 0) + (combatlog[type].evade ? combatlog[type].evade : 0) +
                (combatlog[type].parry ? combatlog[type].parry : 0) + (combatlog[type].resist ? combatlog[type].resist : 0) +
                (combatlog[type].block ? combatlog[type].block : 0); },
        Count = function(type) {
            return '<td>' + type + '</td>' +
                (any.pdealt ? '<td>' + (combatlog.pdealt[type] ? combatlog.pdealt[type].toLocaleString() : '') + '</td>' : '') +
                (any.mdealt ? '<td>' + (combatlog.mdealt[type] ? combatlog.mdealt[type].toLocaleString() : '') + '</td>' : '') +
                (any.dtotal ? '<td>' + (combatlog.pdealt[type] || combatlog.mdealt[type] ?
                                       (combatlog.pdealt[type] + combatlog.mdealt[type]).toLocaleString() : '') + '</td>' : '') +
                (any.ptaken ? '<td>' + (combatlog.ptaken[type] ? combatlog.ptaken[type].toLocaleString() : '') + '</td>' : '') +
                (any.pspirit ? '<td>' + (combatlog.ptaken['s'+type] ? combatlog.ptaken['s'+type].toLocaleString() : '') + '</td>' : '') +
                (any.mtaken ? '<td>' + (combatlog.mtaken[type] ? combatlog.mtaken[type].toLocaleString() : '') + '</td>' : '') +
                (any.mspirit ? '<td>' + (combatlog.mtaken['s'+type] ? combatlog.mtaken['s'+type].toLocaleString() : '') + '</td>' : '') +
                (any.ttotal ? '<td>' + (combatlog.ptaken[type] || combatlog.mtaken[type] ?
                                       (combatlog.ptaken[type] + combatlog.mtaken[type]).toLocaleString() : '') + '</td>' : ''); };
    var total = { pdealt: Column('pdealt', ''), mdealt: Column('mdealt', ''),
                  ptaken: Column('ptaken', ''), pspirit: Column('ptaken', 's'),
                  mtaken: Column('mtaken', ''), mspirit: Column('mtaken', 's'),
                  pdnone: ColumnNone('pdealt'), mdnone: ColumnNone('mdealt'),
                  ptnone: ColumnNone('ptaken'), mtnone: ColumnNone('mtaken'), };
    total.dealt = total.pdealt + total.mdealt;
    total.taken = total.ptaken + total.pspirit + total.mtaken + total.mspirit;
    total.dnone = total.pdnone + total.mdnone;
    total.tnone = total.ptnone + total.mtnone;
    var damagelog = log.parentNode.insertBefore(document.createElement('table'), log);
    damagelog.id = 'damagelog';
    damagelog.innerHTML = '<tbody><tr><td></td>' +
        (any.pdealt || any.mdealt ? '<td' + (any.dtotal ? ' colspan="3"' : '') + '>伤害输出</td>' : '') +
        (any.ptaken || any.mtaken ? '<td' + (any.ttotal ? ' colspan="' +
            ((any.ptaken ? 1 : 0) + (any.mtaken ? 1 : 0) + (any.pspirit ? 1 : 0) + (any.mspirit ? 1 : 0) + 1) + '"' : '') + '>承受伤害</td>' : '') +
        '</tr><tr><td></td>' +
        (any.pdealt ? '<td>物理</td>' : '') + (any.mdealt ? '<td>魔法</td>' : '') +
        (any.dtotal ? '<td>总计</td>' : '') +
        (any.ptaken ? '<td>物理</td>' : '') + (any.pspirit ? '<td style="border-left:none">灵力</td>' : '') +
        (any.mtaken ? '<td>魔法</td>' : '') + (any.mspirit ? '<td style="border-left:none">灵力</td>' : '') +
        (any.ttotal ? '<td>总计</td>' : '') +
        Row('fire') + Row('cold') + Row('elec') + Row('wind') + Row('holy') + Row('dark') + Row('crushing') + Row('slashing') + Row('piercing') + Row('void') + Row('dot') +
        '</tr><tr><td>合计</td>' +
        (any.pdealt ? '<td>' + total.pdealt.toLocaleString() + '</td>' : '') + (any.mdealt ? '<td>' + total.mdealt.toLocaleString() + '</td>' : '') +
        (any.dtotal ? '<td>' + total.dealt.toLocaleString() + '</td>' : '') +
        (any.ptaken ? '<td>' + total.ptaken.toLocaleString() + '</td>' : '') + (any.pspirit ? '<td>' + total.pspirit.toLocaleString() + '</td>' : '') +
        (any.mtaken ? '<td>' + total.mtaken.toLocaleString() + '</td>' : '') + (any.mspirit ? '<td>' + total.mspirit.toLocaleString() + '</td>' : '') +
        (any.ttotal ? '<td>' + total.taken.toLocaleString() + '</td>' : '') +
        (any.hit ? '</tr><tr style="border-top:1px solid">' + Count('hit') + '</tr><tr>' + Count('crit') +
        (any.r50 ? '</tr><tr>' + Count('r50') : '') + (any.r75 ? '</tr><tr>' + Count('r75') : '') + (any.r90 ? '</tr><tr>' + Count('r90') : '') : '') +
        (any.none ? '</tr><tr style="border-top:1px solid">' + (any.miss ? '</tr><tr>' + Count('miss') : '') + (any.evade ? '</tr><tr>' + Count('evade') : '') +
        (any.parry ? '</tr><tr>' + Count('parry') : '') + (any.resist ? '</tr><tr>' + Count('resist') : '') + (any.block ? '</tr><tr>' + Count('block') : ''): '') +
        (any.none ? '</tr><tr><td>合计</td>' +
        (any.pdealt ? '<td>' + total.pdnone.toLocaleString() + '</td>' : '') + (any.mdealt ? '<td>' + total.mdnone.toLocaleString() + '</td>' : '') +
        (any.dtotal ? '<td>' + total.dnone.toLocaleString() + '</td>' : '') +
        (any.ptaken ? '<td>' + total.ptnone.toLocaleString() + '</td>' : '') + (any.pspirit ? '<td></td>' : '') +
        (any.mtaken ? '<td>' + total.mtnone.toLocaleString() + '</td>' : '') + (any.mspirit ? '<td></td>' : '') +
        (any.ttotal ? '<td>' + total.tnone.toLocaleString() + '</td>' : '') : '') + '</tr></tbody>';
    // 将英文内容转换为中文
    damagelog.innerHTML = damagelog.innerHTML
    .replace(/hit/g, '击中')
    .replace(/crit/g, '暴击')
    .replace(/r50/g, '50%抵抗')
    .replace(/r75/g, '75%抵抗')
    .replace(/r90/g, '90%抵抗')
    .replace(/miss/g, '未命中')
    .replace(/evade/g, '闪避')
    .replace(/parry/g, '招架')
    .replace(/resist/g, '抵抗')
    .replace(/block/g, '格挡')
    .replace(/fire/g, '火焰')
    .replace(/cold/g, '冰冷')
    .replace(/elec/g, '闪电')
    .replace(/wind/g, '疾风')
    .replace(/holy/g, '神圣')
    .replace(/dark/g, '黑暗')
    .replace(/crushing/g, '打击')
    .replace(/slashing/g, '斩击')
    .replace(/piercing/g, '刺击')
    .replace(/void/g, '虚空')
    .replace(/dot/g, '持续伤害')
    // 可继续补充
    ;
}


function ShowUsage() {
    if ( !cfg.trackUsage || JSON.stringify(combatlog.used) == '{}' ) return;
    var td = log.insertBefore(document.createElement('tbody'), log.firstChild).appendChild(document.createElement('tr')).appendChild(document.createElement('td'));
    td.className = 'tlb';
    td.innerHTML = 'Used: ' + JSON.stringify(combatlog.used).replace('{','').replace('}','').replace(/"/g,'').replace(/:/g,': ').replace(/,/g,', '); }

function NoPopup() {
    var btcp;
    if ( !(btcp = document.getElementById('btcp')) ) return;
    if ( cfg.ajaxRound ) {
        btcp.onclick = function() {
            btcp.onclick = null;
            var x = new XMLHttpRequest();
            x.onreadystatechange = function() {
                if ( x.readyState == XMLHttpRequest.DONE ) {
                    if ( x.status == 200 ) {
                        var doc = (new DOMParser()).parseFromString(x.responseText, 'text/html');
                        document.body.innerHTML = doc.body.innerHTML;
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        if ( doc.getElementById('riddlemaster') ) {
                            script.innerHTML = doc.getElementsByTagName('script')[2].innerHTML.replace(
                                'e("riddleanswer").value = "?";', '').replace('e("riddleform").submit();', ''); }
                        else {
                            script.innerHTML = 'var t = setTimeout(function(){}, 0); for ( var i = t; i > 0' +
                                               (cfg.ajaxIntervals ? ' && i > t - ' + cfg.ajaxIntervals : '') +
                                               '; i-- ) clearInterval(i); battle = new Battle();'; }
                        document.getElementById('mainpane').appendChild(script);
                        var event = new Event('DOMContentLoaded');
                        document.dispatchEvent(event); }
                    else {
                        alert('error during round transition: code ' + x.status); }}};
            x.open('GET', document.location.href, true);
            x.send(); };}
    monsterData = {};
    localStorage.removeItem('HVmonsterData' + isekai);
    if ( cfg.showRound ) {
        timelog.round++; }
    if ( cfg.noPopup && (!cfg.stopOnEquipDrop || !regexp.quality[cfg.equipmentCutoff].test(log.innerHTML)) ) {
        btcp.click(); }
    else {
        btcp.setAttribute('style', 'display: block'); }}

// main function running out of combat
function OutOfCombat() {
    DeleteLog();
    ProfileSwitch();
    SettingsLink(); }

// out-of-combat helper functions
function DeleteLog() {
    localStorage.removeItem('HVmonsterData' + isekai);
    localStorage.removeItem('HVtimelog' + isekai);
    localStorage.removeItem('HVvitals' + isekai);
    localStorage.removeItem('HVcursor' + isekai);
    localStorage.removeItem('HVitemkey' + isekai);
    if ( cfg.deleteDropLog == 2 || (cfg.deleteDropLog == 1 && document.URL.indexOf('Battle') < 0) ) {
        localStorage.removeItem('HVtrackdrops' + isekai); }
    if ( cfg.deleteCombatLog == 2 || (cfg.deleteCombatLog == 1 && document.URL.indexOf('Battle') < 0) ) {
        localStorage.removeItem('HVcombatlog' + isekai); }}

function ProfileSwitch() {
    if ( !cfg.profileAutoswitch ) return;
    var choice;
    if ( (choice = document.querySelector('[name="persona_set"] [selected]')) ) {
        profile[(isekai ? 'i' : '') + 'p'] = choice.value; }
    if ( (choice = document.querySelector(['[src*="equip/set"][src$="_on.png"]'])) ) {
        profile[(isekai ? 'i' : '') + 's' + profile[(isekai ? 'i' : '') + 'p']] = parseInt(choice.src.match(regexp.number)); }
    if ( JSON.stringify(profile) != localStorage.HVmbp ) {
        localStorage.HVmbp = JSON.stringify(profile); }}

function SettingsLink() {
    var character;
    if ( !cfg.cfgInterface || !(character = document.getElementById('child_Character')) ) return;
    var div = character.firstChild.appendChild(document.createElement('div')),
        link = div.appendChild(document.createElement('div')),
        def = regexp.defaultletter.test(character.innerHTML);
    document.head.appendChild(document.createElement('style')).innerHTML = '#mbsettings { cursor: pointer; }' +
        '#mbsettings:hover #mbprofile { visibility: visible; } #mbprofile { visibility: hidden; position: relative; left: ' + (def ? '223' : '175') +
        'px; top: -' + (def ? '9' : '25') + 'px; display: block; width: max-content; height: max-content; padding: 5px; background: #EDEBDF; border: 1px solid #5C0D11; }';
    div.id = 'mbsettings';
    link.onclick = Settings;
    link.className = def ? 'fl f4b' : 'fc4 fal fcb';
    if ( def ) {
        character.style.width = '228px';
        link.appendChild(document.createElement('div')).className = 'c5m';
        link.appendChild(document.createElement('div')).className = 'c5o';
        link.appendChild(document.createElement('div')).className = 'c5n';
        link.appendChild(document.createElement('div')).className = 'c5s';
        link.appendChild(document.createElement('div')).className = 'c5t';
        link.appendChild(document.createElement('div')).className = 'c5e';
        link.appendChild(document.createElement('div')).className = 'c5r';
        link.appendChild(document.createElement('div')).className = 'c5b';
        link.appendChild(document.createElement('div')).className = 'c5a';
        link.appendChild(document.createElement('div')).className = 'c5t';
        link.appendChild(document.createElement('div')).className = 'c5i';
        link.appendChild(document.createElement('div')).className = 'c5o';
        link.appendChild(document.createElement('div')).className = 'c5n';
        link.appendChild(document.createElement('div')).className = 'c59';
        link.appendChild(document.createElement('div')).className = 'c5s';
        link.appendChild(document.createElement('div')).className = 'c5e';
        link.appendChild(document.createElement('div')).className = 'c5t';
        link.appendChild(document.createElement('div')).className = 'c5t';
        link.appendChild(document.createElement('div')).className = 'c5i';
        link.appendChild(document.createElement('div')).className = 'c5n';
        link.appendChild(document.createElement('div')).className = 'c5g';
        link.appendChild(document.createElement('div')).className = 'c5s'; }
    else {
        link.appendChild(document.createElement('div')).innerHTML = 'Monsterbation 设置'; }
    var hasper = regexp.profile.test(JSON.stringify(cfg.persona));
    var hasisk = regexp.profile.test(JSON.stringify(cfg.isekai.persona)) || (hasper && cfg.isekaiInherit);
    if ( (!isekai && hasper) || (isekai && hasisk) ) {
        var menu = div.appendChild(document.createElement('div'));
        const Set = function(i, p, s) {
            return function() {
                var blue;
                if ( (blue = menu.querySelector('[style*="' + (isekai ? 'red' : 'blue') + '"')) ) {
                    blue.style.color = ''; }
                profile[isekai + 'p'] = p;
                if (p) {
                    profile[isekai + 's' + profile[isekai + 'p']] = s; }
                if ( JSON.stringify(profile) != localStorage.HVmbp ) {
                    localStorage.HVmbp = JSON.stringify(profile); }
                i.style.color = isekai ? 'red' : 'blue'; };};
        menu.id = 'mbprofile';
        menu.className = 'fc4 fal fcb';
        var base = menu.appendChild(document.createElement('div')), blue = false;
        base.onclick = Set(base, 0, 0);
        if ( !isekai ) {
            base.innerHTML = cfg.name;
            for ( var i = 0; i < cfg.persona.length; i++ ) {
                if ( regexp.profile.test(JSON.stringify(cfg.persona[i])) ) {
                    var persona = menu.appendChild(document.createElement('div'));
                    persona.innerHTML = '- ' + cfg.persona[i].name;
                    persona.onclick = Set(persona, i+1, 0);
                    for ( var j = 0; j < cfg.persona[i].set.length; j++ ) {
                        if ( regexp.profile.test(JSON.stringify(cfg.persona[i].set[j])) ) {
                            var set = menu.appendChild(document.createElement('div'));
                            set.innerHTML = '-- ' + cfg.persona[i].set[j].name;
                            set.onclick = Set(set, i+1, j+1);
                            if ( profile.p == i+1 && profile['s' + profile.p] == j+1 ) {
                                set.style.color = 'blue';
                                blue = true; }}}
                    if ( profile.p == i+1 && (!blue || profile['s' + profile.p] == 0) ) {
                        persona.style.color = 'blue';
                        blue = true; }}}
            if ( !blue || profile.p == 0 ) {
                base.style.color = 'blue'; }}
        else {
            base.innerHTML = cfg.isekai.name;
            for ( i = 0; i < cfg.isekai.persona.length; i++ ) {
                hasisk = regexp.profile.test(JSON.stringify(cfg.isekai.persona[i]));
                hasper = regexp.profile.test(JSON.stringify(cfg.persona[i])) && cfg.isekaiInherit;
                if ( hasisk || hasper ) {
                    persona = menu.appendChild(document.createElement('div'));
                    persona.innerHTML = '- ' + (hasisk ? cfg.isekai.persona[i].name : cfg.persona[i].name);
                    persona.onclick = Set(persona, i+1, 0);
                    for ( j = 0; j < cfg.isekai.persona[i].set.length; j++ ) {
                        hasisk = regexp.profile.test(JSON.stringify(cfg.isekai.persona[i].set[j]));
                        hasper = regexp.profile.test(JSON.stringify(cfg.persona[i].set[j])) && cfg.isekaiInherit;
                        if ( hasisk || hasper ) {
                            set = menu.appendChild(document.createElement('div'));
                            set.innerHTML = '-- ' + (hasisk ? cfg.isekai.persona[i].set[j].name : cfg.persona[i].set[j].name);
                            set.onclick = Set(set, i+1, j+1);
                            if ( profile.ip == i+1 && profile['is' + profile.ip] == j+1 ) {
                                set.style.color = 'red';
                                blue = true; }}}
                    if ( profile.ip == i+1 && (!blue || profile['is' + profile.ip] == 0) ) {
                        persona.style.color = 'red';
                        blue = true; }}}
            if ( !blue || profile.ip == 0 ) {
                base.style.color = 'red'; }}}}

function LoadCfg(p, s, i) {
    var local, value;
    if ( settings.cfgInterface && (local = localStorage.HVmbcfg) ) {
        local = JSON.parse(local); }
    var persona = local && local.persona ? local.persona : settings.persona;
    var isk = local && local.isekai ? local.isekai : settings.isekai;
    for ( var setting in settings ) {
        cfg[setting] = i && p && s && ((value = isk.persona[p-1].set[s-1].settings[setting]) || value === false || value === 0) ? value :
                       ((!i || cfg.isekaiInherit) && p && s && ((value = persona[p-1].set[s-1].settings[setting]) || value === false || value === 0) ? value :
                       (i && p && ((value = isk.persona[p-1].settings[setting]) || value === false || value === 0) ? value :
                       ((!i || cfg.isekaiInherit) && p && ((value = persona[p-1].settings[setting]) || value === false || value === 0) ? value :
                       (i && ((value = isk.settings[setting]) || value === false || value === 0) ? value :
                       (local && ((value = local[setting]) || value === false || value === 0) ? value : settings[setting])))));
        if ( typeof(settings[setting]) == 'object' && !(settings[setting] instanceof Array) ) {
            for ( var item in settings[setting] ) {
                if ( !cfg[setting][item] && !(cfg[setting][item] === false) ) {
                    cfg[setting][item] = settings[setting][item]; }}}}
    cfg.bind = cfg.bind.replace(regexp.whitespace,''); }

function StoreTmp() {
    if ( (cfg.showMonsterHP || cfg.shortenHPbars || cfg.monsterKeywords) && JSON.stringify(monsterData) != '{}' ) {
        localStorage['HVmonsterData' + isekai] = JSON.stringify(monsterData); }
    if ( cfg.showCooldowns || cfg.trackSpeed || cfg.showRound ) {
        localStorage['HVtimelog' + isekai] = JSON.stringify(timelog); }
    if ( itemkey ) localStorage['HVitemkey' + isekai] = JSON.stringify(itemkey);
    if ( cfg.trackDamage || cfg.trackUsage ) {
        localStorage['HVcombatlog' + isekai] = JSON.stringify(combatlog); }
    if ( cfg.maxVitals && JSON.stringify(vitals) != localStorage['HVvitals' + isekai] ) {
        localStorage['HVvitals' + isekai] = JSON.stringify(vitals); }
    if ( cfg.trackDrops || cfg.trackProficiency || cfg.proficiencySidebar ) {
        localStorage['HVtrackdrops' + isekai] = JSON.stringify(droplog); }
    if ( cursor >= 0 ) localStorage['HVcursor' + isekai] = cursor; }

// default font parser
function ParseDefault(div) {
    var string = '', letters = div.innerHTML.match(regexp.defaultstring);
    for ( var j = 0; j < letters.length; j++ ) {
        string += letters[j].match(regexp.defaultletter)[1]; }
    return string; }

if ( !profile.p ) { profile.p = 0; }
if ( !profile.ip ) { profile.ip = 0; }
for ( var i = 1; i < 10; i++ ) {
    if ( !profile['s' + i] ) { profile['s' + i] = 0; }
    if ( !profile['is' + i] ) { profile['is' + i] = 0; }}
if ( !droplog.Mats ) { droplog.Mats = {}; }
LoadCfg(profile[isekai + 'p'], profile[isekai + 's' + profile[isekai + 'p']], isekai);
if ( document.getElementById('textlog') || document.getElementById('riddlemaster') ) {
    Enhance();
    document.addEventListener('DOMContentLoaded', Enhance);
    window.addEventListener('beforeunload', StoreTmp); }
else { OutOfCombat(); }
