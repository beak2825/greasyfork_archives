// ==UserScript==
// @name         TioHax Cheat Menu
// @namespace    http://tampermonkey.net/
// @version      0.9.6
// @description  Ultimate Cheat Client for Gats.io
// @author       Taureon
// @match        https://gats.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479886/TioHax%20Cheat%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/479886/TioHax%20Cheat%20Menu.meta.js
// ==/UserScript==

/* jshint esversion: 11, loopfunc: true, bitwise: false, forin: false*/

(async function main() {

//now, this cheat obviously wouldn't work on sites that aren't gats.io
if (location.host != 'gats.io' && location.host != 'gats2.com') return alert('This inject can only be ran on gats.io!');

//if the game hasn't loaded yet, wait until it is loaded
//it is checked if the game has loaded by checking if the game tick function exists
if (typeof a41 !== 'function') return setTimeout(main);

//closure compiler help
//some literally useless code gets removed by the postprocessor, as it only exists to stop the closure compiler from being retarded
let css_key_alignItems           = Math.ceil(Math.random()) && 'alignItems',
    css_key_background           = Math.ceil(Math.random()) && 'background',
    css_key_backgroundColor      = Math.ceil(Math.random()) && 'backgroundColor',
    css_key_backgroundImage      = Math.ceil(Math.random()) && 'backgroundImage',
    css_key_border               = Math.ceil(Math.random()) && 'border',
    css_key_borderBottom         = Math.ceil(Math.random()) && 'borderBottom',
    css_key_borderColor          = Math.ceil(Math.random()) && 'borderColor',
    css_key_borderLeft           = Math.ceil(Math.random()) && 'borderLeft',
    css_key_borderRadius         = Math.ceil(Math.random()) && 'borderRadius',
    css_key_borderRight          = Math.ceil(Math.random()) && 'borderRight',
    css_key_borderTop            = Math.ceil(Math.random()) && 'borderTop',
    css_key_borderWidth          = Math.ceil(Math.random()) && 'borderWidth',
    css_key_color                = Math.ceil(Math.random()) && 'color',
    css_key_display              = Math.ceil(Math.random()) && 'display',
    css_key_flexDirection        = Math.ceil(Math.random()) && 'flexDirection',
    css_key_fontFamily           = Math.ceil(Math.random()) && 'fontFamily',
    css_key_fontSize             = Math.ceil(Math.random()) && 'fontSize',
    css_key_fontWeight           = Math.ceil(Math.random()) && 'fontWeight',
    css_key_gridTemplateColumns  = Math.ceil(Math.random()) && 'gridTemplateColumns',
    css_key_height               = Math.ceil(Math.random()) && 'height',
    css_key_justifyContent       = Math.ceil(Math.random()) && 'justifyContent',
    css_key_left                 = Math.ceil(Math.random()) && 'left',
    css_key_marginBottom         = Math.ceil(Math.random()) && 'marginBottom',
    css_key_marginLeft           = Math.ceil(Math.random()) && 'marginLeft',
    css_key_marginRight          = Math.ceil(Math.random()) && 'marginRight',
    css_key_marginTop            = Math.ceil(Math.random()) && 'marginTop',
    css_key_maxWidth             = Math.ceil(Math.random()) && 'maxWidth',
    css_key_minWidth             = Math.ceil(Math.random()) && 'minWidth',
    css_key_outline              = Math.ceil(Math.random()) && 'outline',
    css_key_overflowY            = Math.ceil(Math.random()) && 'overflowY',
    css_key_right                = Math.ceil(Math.random()) && 'right',
    css_key_padding              = Math.ceil(Math.random()) && 'padding',
    css_key_paddingBottom        = Math.ceil(Math.random()) && 'paddingBottom',
    css_key_paddingLeft          = Math.ceil(Math.random()) && 'paddingLeft',
    css_key_paddingRight         = Math.ceil(Math.random()) && 'paddingRight',
    css_key_paddingTop           = Math.ceil(Math.random()) && 'paddingTop',
    css_key_position             = Math.ceil(Math.random()) && 'position',
    css_key_top                  = Math.ceil(Math.random()) && 'top',
    css_key_userSelect           = Math.ceil(Math.random()) && 'userSelect',
    css_key_verticalAlign        = Math.ceil(Math.random()) && 'verticalAlign',
    css_key_whiteSpace           = Math.ceil(Math.random()) && 'whiteSpace',
    css_key_width                = Math.ceil(Math.random()) && 'width',
    css_key_zIndex               = Math.ceil(Math.random()) && 'zIndex',

    css_value_color_000f         = Math.ceil(Math.random()) && '#000f',
    css_value_color_000c         = Math.ceil(Math.random()) && '#000c',
    css_value_color_33dc         = Math.ceil(Math.random()) && '#33dc',
    css_value_color_4448         = Math.ceil(Math.random()) && '#4448',
    css_value_color_6666         = Math.ceil(Math.random()) && '#6666',
    css_value_color_777f         = Math.ceil(Math.random()) && '#777f',
    css_value_color_80f8         = Math.ceil(Math.random()) && '#80f8',
    css_value_color_888f         = Math.ceil(Math.random()) && '#888f',
    css_value_color_888c         = Math.ceil(Math.random()) && '#888c',
    css_value_color_8888         = Math.ceil(Math.random()) && '#8888',
    css_value_color_f00c         = Math.ceil(Math.random()) && '#f00c',
    css_value_color_f80f         = Math.ceil(Math.random()) && '#f80f',
    css_value_color_f80c         = Math.ceil(Math.random()) && '#f80c',
    css_value_color_ffff         = Math.ceil(Math.random()) && '#ffff',
    css_value_color_ff0c         = Math.ceil(Math.random()) && '#ff0c',
    css_value_color_fff8         = Math.ceil(Math.random()) && '#fff8',
    css_value_color_fffc         = Math.ceil(Math.random()) && '#fffc',
    css_value_color_008c         = Math.ceil(Math.random()) && '#008c',
    css_value_color_00fc         = Math.ceil(Math.random()) && '#00fc',
    css_value_color_800c         = Math.ceil(Math.random()) && '#800c',
    css_value_color_00ff         = Math.ceil(Math.random()) && '#00ff',
    css_value_color_0f0c         = Math.ceil(Math.random()) && '#0f0c',
    css_value_color_444f         = Math.ceil(Math.random()) && '#444f',
    css_value_color_666f         = Math.ceil(Math.random()) && '#666f',
    css_value_color_8886         = Math.ceil(Math.random()) && '#8886',
    css_value_color_88ff         = Math.ceil(Math.random()) && '#88ff',
    css_value_color_aaaf         = Math.ceil(Math.random()) && '#aaaf',
    css_value_color_dddf         = Math.ceil(Math.random()) && '#dddf',
    css_value_color_f00f         = Math.ceil(Math.random()) && '#f00f',
    css_value_color_f88f         = Math.ceil(Math.random()) && '#f88f',
    css_value_color_ff0f         = Math.ceil(Math.random()) && '#ff0f',

    css_value_auto_10            = Math.ceil(Math.random()) && 'auto' + ' auto'.repeat(9),
    css_value_auto_5             = Math.ceil(Math.random()) && 'auto' + ' auto'.repeat(4),

    css_value_10                 = Math.ceil(Math.random()) && '10',

    css_value_length_minContent  = Math.ceil(Math.random()) && 'min_content',
    css_value_length_perc100     = Math.ceil(Math.random()) && '100%',
    css_value_length_calcperc100 = Math.ceil(Math.random()) && 'calc(' + css_value_length_perc100 + ' - 15px)',
    css_value_length_calcperc102 = Math.ceil(Math.random()) && 'calc(' + css_value_length_perc100 + ' - 10px)',
    css_value_length_calcperc33  = Math.ceil(Math.random()) && 'calc(' + css_value_length_perc100 + ' / 3)',
    css_value_length_em2         = Math.ceil(Math.random()) && '2em',
    css_value_length_pxNeg5      = Math.ceil(Math.random()) && '-5px',
    css_value_length_px0         = Math.ceil(Math.random()) && '0px',
    css_value_length_px1         = Math.ceil(Math.random()) && '1px',
    css_value_length_px2         = Math.ceil(Math.random()) && '2px',
    css_value_length_px3         = Math.ceil(Math.random()) && '3px',
    css_value_length_px3p5       = Math.ceil(Math.random()) && '3.5px',
    css_value_length_px4         = Math.ceil(Math.random()) && '4px',
    css_value_length_px5         = Math.ceil(Math.random()) && '5px',
    css_value_length_px7         = Math.ceil(Math.random()) && '7px',
    css_value_length_px8         = Math.ceil(Math.random()) && '8px',
    css_value_length_px10        = Math.ceil(Math.random()) && '10px',
    css_value_length_px12        = Math.ceil(Math.random()) && '12px',
    css_value_length_px14        = Math.ceil(Math.random()) && '14px',
    css_value_length_px15        = Math.ceil(Math.random()) && '15px',
    css_value_length_px16        = Math.ceil(Math.random()) && '16px',
    css_value_length_px20        = Math.ceil(Math.random()) && '20px',
    css_value_length_px25        = Math.ceil(Math.random()) && '25px',
    css_value_length_px26        = Math.ceil(Math.random()) && '26px',
    css_value_length_px28        = Math.ceil(Math.random()) && '28px',
    css_value_length_px30        = Math.ceil(Math.random()) && '30px',
    css_value_length_px34        = Math.ceil(Math.random()) && '34px',
    css_value_length_px38        = Math.ceil(Math.random()) && '38px',
    css_value_length_px40        = Math.ceil(Math.random()) && '40px',
    css_value_length_px43        = Math.ceil(Math.random()) && '43px',
    css_value_length_px45        = Math.ceil(Math.random()) && '45px',
    css_value_length_px50        = Math.ceil(Math.random()) && '50px',
    css_value_length_px55        = Math.ceil(Math.random()) && '55px',
    css_value_length_px60        = Math.ceil(Math.random()) && '60px',
    css_value_length_px70        = Math.ceil(Math.random()) && '70px',
    css_value_length_px80        = Math.ceil(Math.random()) && '80px',
    css_value_length_px250       = Math.ceil(Math.random()) && '250px',
    css_value_length_px300       = Math.ceil(Math.random()) && '300px',
    css_value_length_px350       = Math.ceil(Math.random()) && '350px',
    css_value_length_px520       = Math.ceil(Math.random()) && '520px',

    css_value_gradient_redblue   = Math.ceil(Math.random()) && 'linear-gradient(to bottom, ' + css_value_color_800c + ' 0%, ' + css_value_color_f00c + ' 40%, ' + css_value_color_00fc + ' 60%, ' + css_value_color_008c + ' ' + css_value_length_perc100 + ')',
    css_value_gradient_gray      = Math.ceil(Math.random()) && 'linear-gradient(to bottom, ' + css_value_color_888c + ' 0%, ' + css_value_color_fffc + ' 50%, ' + css_value_color_888c +                                   ' ' + css_value_length_perc100 + ')',

    css_value_random_solid       = Math.ceil(Math.random()) && ' solid ',

    css_value_border_3pxffff     = Math.ceil(Math.random()) && css_value_length_px3   + css_value_random_solid + css_value_color_ffff,
    css_value_border_4pxffff     = Math.ceil(Math.random()) && css_value_length_px4   + css_value_random_solid + css_value_color_ffff,
    css_value_border_35px000f    = Math.ceil(Math.random()) && css_value_length_px3p5 + css_value_random_solid + css_value_color_000f,
    css_value_border_1px000f     = Math.ceil(Math.random()) && css_value_length_px1   + css_value_random_solid + css_value_color_000f,
    css_value_border_2px000f     = Math.ceil(Math.random()) && css_value_length_px2   + css_value_random_solid + css_value_color_000f,
    css_value_border_3px000f     = Math.ceil(Math.random()) && css_value_length_px3   + css_value_random_solid + css_value_color_000f,
    css_value_border_4px000f     = Math.ceil(Math.random()) && css_value_length_px4   + css_value_random_solid + css_value_color_000f,

    css_value_misc_absolute      = Math.ceil(Math.random()) && 'absolute',
    css_value_misc_bold          = Math.ceil(Math.random()) && 'bold',
    css_value_misc_block         = Math.ceil(Math.random()) && 'block',
    css_value_misc_center        = Math.ceil(Math.random()) && 'center',
    css_value_misc_Consolas      = Math.ceil(Math.random()) && 'Consolas',
    css_value_misc_flex          = Math.ceil(Math.random()) && 'flex',
    css_value_misc_flexEnd       = Math.ceil(Math.random()) && 'flex-end',
    css_value_misc_grid          = Math.ceil(Math.random()) && 'grid',
    css_value_misc_none          = Math.ceil(Math.random()) && 'none',
    css_value_misc_relative      = Math.ceil(Math.random()) && 'relative',
    css_value_misc_row           = Math.ceil(Math.random()) && 'row',
    css_value_misc_preWrap       = Math.ceil(Math.random()) && 'pre-wrap',
    css_value_misc_scroll        = Math.ceil(Math.random()) && 'scroll',
    css_value_misc_spaceBetween  = Math.ceil(Math.random()) && 'space-between',
    css_value_misc_text          = Math.ceil(Math.random()) && 'text',
    css_value_misc_inlineBlock   = Math.ceil(Math.random()) && 'inline-block',

    MOUSEEVENT_LEFT = 1,
    MOUSEEVENT_MIDDLE = 2,
    MOUSEEVENT_RIGHT = 3,

    KEYPRESS_KEY_LEFT = 0,
    KEYPRESS_KEY_RIGHT = 1,
    KEYPRESS_KEY_UP = 2,
    KEYPRESS_KEY_DOWN = 3,
    KEYPRESS_KEY_RELOAD = 4,

    KEYPRESS_STATE_OFF = 0,
    KEYPRESS_STATE_ON = 1,

    SHIELD_RANGE = 45,

    enumsCharDict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$',

    ATTRIBUTE_USERNAMEHASH = enumsCharDict[0],
    ATTRIBUTE_PREVACCX = enumsCharDict[1],
    ATTRIBUTE_PREVACCY = enumsCharDict[2],
    ATTRIBUTE_ACCX = enumsCharDict[3],
    ATTRIBUTE_ACCY = enumsCharDict[4],
    ATTRIBUTE_HITBOX = enumsCharDict[5],
    ATTRIBUTE_HITBOXOFFSET = enumsCharDict[6],
    ATTRIBUTE_HITBOXRADIUS = enumsCharDict[7],
    ATTRIBUTE_HITBOXFORWARDOFFSET = enumsCharDict[8],
    ATTRIBUTE_BULLETCOLLISIONS = enumsCharDict[9],
    ATTRIBUTE_WIDTH = enumsCharDict[10],
    ATTRIBUTE_HEIGHT = enumsCharDict[11],
    ATTRIBUTE_PINGS = enumsCharDict[12],
    ATTRIBUTE_AVERAGEPING = enumsCharDict[13],
    ATTRIBUTE_MINPING = enumsCharDict[14],
    ATTRIBUTE_MAXPING = enumsCharDict[15],
    ATTRIBUTE_TIMEALIVEEXTRA = enumsCharDict[16],
    ATTRIBUTE_ISFROMCHEAT = enumsCharDict[17],
    ATTRIBUTE_TAGGEDNAME = enumsCharDict[18],
    ATTRIBUTE_USERNAME = enumsCharDict[19],
    ATTRIBUTE_SANITIZEDNAME = enumsCharDict[20],
    ATTRIBUTE_USABLEACCX = enumsCharDict[21],
    ATTRIBUTE_USABLEACCY = enumsCharDict[22],
    ATTRIBUTE_ENEMYFRIENDS = enumsCharDict[23],
    ATTRIBUTE_ENEMIES = enumsCharDict[24],
    ATTRIBUTE_PREVSPDX = enumsCharDict[25],
    ATTRIBUTE_PREVSPDY = enumsCharDict[26],
    ATTRIBUTE_USABLESPDX = enumsCharDict[27],
    ATTRIBUTE_USABLESPDY = enumsCharDict[28],
    ATTRIBUTE_ENEMY = enumsCharDict[29],
    ATTRIBUTE_DISTANCE = enumsCharDict[30],
    ATTRIBUTE_RADIUS = enumsCharDict[31],
    ATTRIBUTE_UPDATE = enumsCharDict[32],
    ATTRIBUTE_HPRADIUS = enumsCharDict[33],
    ATTRIBUTE_FILLHITBOX = enumsCharDict[34],
    ATTRIBUTE_MAKEHITBOX = enumsCharDict[35],
    ATTRIBUTE_DRAW = enumsCharDict[36],
    ATTRIBUTE_DRAWBODY = enumsCharDict[37],
    ATTRIBUTE_DRAWGUN = enumsCharDict[38],

    KEYCODE_ESC = enumsCharDict[0],
    KEYCODE_A = enumsCharDict[1],
    KEYCODE_E = enumsCharDict[2],
    KEYCODE_D = enumsCharDict[3],
    KEYCODE_R = enumsCharDict[4],
    KEYCODE_S = enumsCharDict[5],
    KEYCODE_T = enumsCharDict[6],
    KEYCODE_W = enumsCharDict[7],
    KEYCODE_Z = enumsCharDict[8],
    KEYCODE_ENTER = enumsCharDict[9],
    KEYCODE_SPACE = enumsCharDict[10],
    KEYCODE_ARROWLEFT = enumsCharDict[11],
    KEYCODE_ARROWRIGHT = enumsCharDict[12],
    KEYCODE_ARROWUP = enumsCharDict[13],
    KEYCODE_ARROWDOWN = enumsCharDict[14],
    KEYCODE_N = enumsCharDict[15],
    KEYCODE_SHIFT = enumsCharDict[16],
    KEYCODE_CTRL = enumsCharDict[17],

    INSTANTCHAT_CHATBINDS = enumsCharDict[0],
    INSTANTCHAT_CHATBINDSTEXTS = enumsCharDict[1],
    INSTANTCHAT_ONKILL = enumsCharDict[2],
    INSTANTCHAT_ONKILLTEXT = enumsCharDict[3],
    INSTANTCHAT_ONDEATH = enumsCharDict[4],
    INSTANTCHAT_ONDEATHTEXT = enumsCharDict[5],
    INSTANTCHAT_AUTOTHANK = enumsCharDict[6],
    INSTANTCHAT_AUTOTHANKTEXT = enumsCharDict[7],

    AIMBOT_ENABLE = enumsCharDict[0],
    AIMBOT_AIMSMOOTHING = enumsCharDict[1],
    AIMBOT_CURSORMODE = enumsCharDict[2],
    AIMBOT_USEACCELERATION = enumsCharDict[3],
    AIMBOT_IGNORECHATTING = enumsCharDict[4],
    AIMBOT_PINGCOMPENSATION = enumsCharDict[5],
    AIMBOT_TRIGGERBOT = enumsCharDict[6],
    AIMBOT_WALLCHECK = enumsCharDict[7],
    AIMBOT_USEAHEAD = enumsCharDict[8],
    AIMBOT_DISABLEWHENDASHING = enumsCharDict[9],
    AIMBOT_CURSORPROXCOSENESS = enumsCharDict[10],
    AIMBOT_TARGETMODE = enumsCharDict[11],
    AIMBOT_TRIGGERBOTWHENDOWN = enumsCharDict[12],
    AIMBOT_RIGHTCLICKFRIEND = enumsCharDict[13],
    AIMBOT_AUXCLICKTARGET = enumsCharDict[14],
    AIMBOT_DROPDOWN_GENERAL = enumsCharDict[15],
    AIMBOT_DROPDOWN_ENHANCED = enumsCharDict[16],
    AIMBOT_DROPDOWN_CURSORPROX = enumsCharDict[17],
    AIMBOT_DROPDOWN_SMART = enumsCharDict[18],
    AIMBOT_DROPDOWN_PRIORITY = enumsCharDict[19],
    AIMBOT_DROPDOWN_TRIGGERBOT = enumsCharDict[20],
    AIMBOT_TARGETSONLY = enumsCharDict[21],
    AIMBOT_AVOIDFRIENDS = enumsCharDict[22],
    AIMBOT_AHEADNESSDEPTH = enumsCharDict[23],
    AIMBOT_LEADERMODE = enumsCharDict[24],
    AIMBOT_ACCAPPLYMULTIPLIER = enumsCharDict[25],
    AIMBOT_ACCTIMEMULTIPLIER = enumsCharDict[26],

    ESP_ZOOM = enumsCharDict[0],
    ESP_FIXCAMERA = enumsCharDict[1],
    ESP_TRACERSBODYENEMY = enumsCharDict[2],
    ESP_TRACERSCURSORENEMY = enumsCharDict[3],
    ESP_TRACERSWALLCHECK = enumsCharDict[4],
    ESP_TRACERSGUN = enumsCharDict[5],
    ESP_TRACERSGRENADES = enumsCharDict[6],
    ESP_SHOWINVIS = enumsCharDict[7],
    ESP_REVEALTEAMS = enumsCharDict[8],
    ESP_SHOWHEALTH = enumsCharDict[9],
    ESP_SHOWARMOR = enumsCharDict[10],
    ESP_SHOWMAGS = enumsCharDict[11],
    ESP_SHOWGUNRELOADSTATUS = enumsCharDict[12],
    ESP_CAMUSEREALPOSITION = enumsCharDict[13],
    ESP_INCLUDEYOU = enumsCharDict[14],
    ESP_DROPDOWN_CAMERA = enumsCharDict[15],
    ESP_DROPDOWN_TRACERS = enumsCharDict[16],
    ESP_DROPDOWN_PLAYERSTATS = enumsCharDict[17],
    ESP_DROPDOWN_OTHER = enumsCharDict[18],
    ESP_SHOWRANGE = enumsCharDict[19],
    ESP_SCROLLSENSITIVITY = enumsCharDict[20],

    CHATSPAMMER_TEXT = enumsCharDict[0],
    CHATSPAMMER_WIDTH = enumsCharDict[1],
    CHATSPAMMER_INTERVAL = enumsCharDict[2],
    CHATSPAMMER_DIRECTION = enumsCharDict[3],
    CHATSPAMMER_SEPERATOR = enumsCharDict[4],
    CHATSPAMMER_INDEX = enumsCharDict[5],
    CHATSPAMMER_TIMEOUT = enumsCharDict[6],
    CHATSPAMMER_PAUSEPERIOD = enumsCharDict[7],
    CHATSPAMMER_VARIATION = enumsCharDict[8],
    CHATSPAMMER_PREFIX = enumsCharDict[9],
    CHATSPAMMER_SUFFIX = enumsCharDict[10],

    ANTIAIM_RELOAD = enumsCharDict[0],
    ANTIAIM_SHOOT = enumsCharDict[1],
    ANTIAIM_IDLE = enumsCharDict[2],
    ANTIAIM_ANGLESTART = enumsCharDict[3],
    ANTIAIM_ANGLERANGE = enumsCharDict[4],
    ANTIAIM_SPINSPEED = enumsCharDict[5],
    ANTIAIM_DELAY = enumsCharDict[6],
    ANTIAIM_SAVEDX = enumsCharDict[7],
    ANTIAIM_SAVEDY = enumsCharDict[8],
    ANTIAIM_DRAWREALAIM = enumsCharDict[9],

    RECORDER_ISRECORDING = enumsCharDict[0],
    RECORDER_CURRENT = enumsCharDict[1],
    RECORDER_SESSIONS = enumsCharDict[2],
    RECORDER_ISPLAYING = enumsCharDict[3],
    RECORDER_TIMEOUT = enumsCharDict[4],
    RECORDER_SESSIONTOPLAY = enumsCharDict[5],

    MISC_AUTORELOAD = enumsCharDict[0],
    MISC_PINGDISPLAY = enumsCharDict[1],
    MISC_RENDERDISPLAY = enumsCharDict[2],
    MISC_STATICHUD = enumsCharDict[3],
    MISC_STATICHEALTH = enumsCharDict[4],
    MISC_DISABLECLOSEPOPUP = enumsCharDict[5],
    MISC_BETTERCRATEHP = enumsCharDict[6],
    MISC_HIDECHATTING = enumsCharDict[7],
    MISC_FFACLANDISPLAY = enumsCharDict[8],
    MISC_SHOWFEATURES = enumsCharDict[9],
    MISC_DROPDOWN_INGAME = enumsCharDict[10],
    MISC_DROPDOWN_DEBUG = enumsCharDict[11],
    MISC_DROPDOWN_HUD = enumsCharDict[12],
    MISC_DROPDOWN_OTHER = enumsCharDict[13],
    MISC_POSITION = enumsCharDict[14],
    MISC_LEADERBOARDBADGES = enumsCharDict[15],

    THNET_SOCKET = enumsCharDict[0],
    THNET_ENABLE = enumsCharDict[1],
    THNET_DISCONNECT = enumsCharDict[2],
    THNET_MEMBERS = enumsCharDict[3],
    THNET_CHAT = enumsCharDict[4],
    THNET_DONATE = enumsCharDict[5],
    THNET_ENTEROPENCHAT = enumsCharDict[6],
    THNET_AUTH = enumsCharDict[7],
    THNET_CLOSEREASON = enumsCharDict[8],
    THNET_INFOSHARE = enumsCharDict[9],
    THNET_INFOSHARING = enumsCharDict[10],
    THNET_BROTHERS = enumsCharDict[11],

    ADVANCED_PINGCOUNT = enumsCharDict[0],
    ADVANCED_AIMCONSTANT = enumsCharDict[1],
    ADVANCED_TPS = enumsCharDict[2],
    ADVANCED_OPTIMISEWALLCHECK = enumsCharDict[3],
    ADVANCED_PINGCOMP = enumsCharDict[4],

    PERKHACKS_KNIFE = enumsCharDict[0],
    PERKHACKS_KNIFEMAXRANGE = enumsCharDict[1],
    PERKHACKS_TICK = enumsCharDict[2],
    PERKHACKS_SHIELD = enumsCharDict[3],
    PERKHACKS_SHIELDUPKEEP = enumsCharDict[4],
    PERKHACKS_STOREDANGLE = enumsCharDict[5],
    PERKHACKS_SHIELDMANUAL = enumsCharDict[6],
    PERKHACKS_CRATEPLACEVISION = enumsCharDict[7],
    PERKHACKS_SHIELDLOOKAHEAD = enumsCharDict[8],
    PERKHACKS_MEDKITSELFHEAL = enumsCharDict[9],
    PERKHACKS_MEDKITSELFHEALTHRESHOLD = enumsCharDict[10],
    PERKHACKS_SHIELDVISUALISER = enumsCharDict[11],
    PERKHACKS_SHIELDWALLCHECK = enumsCharDict[12],

    WEIRD_CURSORMOVE = enumsCharDict[0],

    DISCORDRPC_ENABLED = enumsCharDict[0],
    DISCORDRPC_STATE = enumsCharDict[1],
    DISCORDRPC_DETAILS = enumsCharDict[2],
    DISCORDRPC_UPDATEINTERVAL = enumsCharDict[3],
    DISCORDRPC_START = enumsCharDict[4],
    DISCORDRPC_TIMEOUT = enumsCharDict[5],
    DISCORDRPC_CONNECTION = enumsCharDict[6],
    DISCORDRPC_TRIES = enumsCharDict[7],
    DISCORDRPC_ACCESSTOKEN = enumsCharDict[8],
    DISCORDRPC_CLIENTID = enumsCharDict[9],
    DISCORDRPC_EXPECTING = enumsCharDict[10],

    PAINT_GRID = enumsCharDict[0],
    PAINT_GRIDSPACEX = enumsCharDict[1],
    PAINT_GRIDSPACEY = enumsCharDict[2],
    PAINT_GRIDLINEWIDTHHORIZONTAL = enumsCharDict[3],
    PAINT_GRIDLINEWIDTHVERTICAL = enumsCharDict[4],
    PAINT_GRIDCOLOR = enumsCharDict[6],
    PAINT_CRATES = enumsCharDict[7],
    PAINT_CRATESQUARE = enumsCharDict[8],
    PAINT_CRATELONG = enumsCharDict[9],
    PAINT_CRATEUSER = enumsCharDict[10],
    PAINT_CRATEPREMIUM = enumsCharDict[11],
    PAINT_CRATESHOWHPMODE = enumsCharDict[12],
    PAINT_POINTS = enumsCharDict[13],
    PAINT_POINTSIDLE = enumsCharDict[14],
    PAINT_POINTSFFA = enumsCharDict[15],
    PAINT_POINTSBLU = enumsCharDict[16],
    PAINT_POINTSRED = enumsCharDict[17],
    PAINT_POINTEDGEWIDTH = enumsCharDict[18],
    PAINT_CRATECORPSE = enumsCharDict[19],
    PAINT_PRESETMANAGER = enumsCharDict[20],
    PAINT_PRESETS = enumsCharDict[21],

    MULTIBOX_SELECTEDSOCKET = enumsCharDict[0],
    MULTIBOX_SPAWNCLONE = enumsCharDict[1],
    MULTIBOX_INSTANTRESPAWN = enumsCharDict[2],

    //database of guide entries
    //very incomplete, missing a lot of information
    guide = [[
        'Menu',

        'Navigation',
        'You can select any menu from the main menu by clicking on the menu\'s name.',

        'Back Button',
        'You can return to the menu selection screen by clicking the back button at the top left corner.',

        'Toggling',
        'You can toggle the menu to make it vanish or reappear by pressing (T) on your keyboard at any particular time.',

        'Scrolling',
        'You can scroll in some menus by either using your mouse wheel or moving the scroll bar at the right side of the menu.',

        'Moving',
        'You can drag the menu around by holding the title element.'
    ],[
        'Settings',

        'Toggles and Values',
        'You can toggle On/Off settings by simply clicking on them. You can change Value settings by clicking the [+] or [-] buttons next to them or by using your scroll wheel on the value display. To know what a setting does, hover over the setting, since most controls have tooltips added.',

        'Special Controls',
        'Some menus use custom controls like text inputs, perk selection and more. Though most of those special controls don\'t need an introduction (as I think it is self explanatory enough, correct me if i\'m wrong), but for Auto Upgrade, you can click a perk you have already selected to unselect it.',

        'Empty Menus',
        'Some menus (Recorder) don\'t have menu contents, which means they will be eventually added, probably...',

        'Imperfect Features',
        'Some features may decrease your effectiveness or may cause other issues, please report the issues if that is the case.',

        'Saving',
        'When you change any setting, it gets saved, which means if you reload, the settings won\'t be lost!'
    ],[
        'Contact',

        'Discord',
        'We have a discord where you can talk with fellow TioHax users and even the Developer himself! https://discord.gg/CwWd5UKf6R'
    ]],

    credits = [[
        'Developing',
        'Main Developer of this Cheat Software',
        'Taureon',
        'For helping with technical stuff',
        'Vaakir & Nitrogem35',
        'Providing an API for the FFA Clan Display feature',
        'Nitrogem35'
    ],[
        'Playtesting',
        'Finding dumb bugs and general playtesting',
        'Ravgo'
    ],[
        'Inspiration',
        'Making my own Cheat Client',
        'Vaakir',
        'Providing me with moral justifications',
        'GodF4ther, cat421, CrimAnn, SHTURM, DeadForYears and pretty much the rest of the Gats.io Community, you toxic idiots'
    ],[
        'Special Thanks',
        'You!',
        'For using this cheat! Thank you so much!'
    ]],

    //if the current enviroment is tampermonkey
    //isUserscript = typeof GM === 'object' || typeof GM_info === 'object',

    //make sure closure compiler deals with that aswell
    ctx = j58,

    undefVar = Math.ceil(Math.random()) && undefined,

    //used to make math easier to read
    {
        PI, abs, asin, atan2,
        ceil, cos, floor, max,
        min, random, round, sign,
        sin, sqrt, E
    } = Math,
    TAU = PI * 2,
    degToRad = TAU / 360,
    mathSin = sin(degToRad * 60),
    third = 1 / 3,

    nullPos = {x: 0, y: 0},

    idRefreshMenu = 0,

    //hash of the developer's ign
    //this is 'TheS3xHaver' but hashed with hashString() function
    developerHash = -1599485949,

    homeUrl = 's://cheats.gatsio.repl.co/',

    //time it took to render a frame
    renderTime = 0,

    //how many ticks the main function has ran for
    tickCount = 0,

    chatBoxRandom,

    //turning armor names into indexes
    armorMap = {
        noArmor: 0,
        lightArmor: 1,
        mediumArmor: 2,
        heavyArmor: 3
    },

    //turning gun names to indexes
    gunMap = {
        pistol: 0,
        smg: 1,
        shotgun: 2,
        assault: 3,
        sniper: 4,
        lmg: 5,
        'bolt-action-rifle': 4,
        'machine-gun': 5
    },

    //turning gun indexes into gun displaynames
    gunNames = ['Pistol', 'SMG', 'Shotgun', 'Assault', 'Sniper', 'LMG'],

    //6 = knife
    //7 = shield

    //bullet velocities of guns
    velocities = [24, 22, 24, 24, 30, 24, 7, Infinity],

    //bullet spawn offsets based on gun lengths
    offsets = [44, 50, 55, 63, 75, 62, 0, 0],

    //how far each bullet travels
    ranges = [18, 13, 10, 18, 22, 16, 32, Infinity],

    //stupidness
    textBoxFocused = 0,

    gunMinRange = 0,

    //cursor position that is independent of the game
    cursor = {x: 0, y: 0, isPressed: 0, isShooting: 0},

    highestZIndex = 3,

    movableWindows = [],

    clanTagCache = {},

    menuNames = [
        '', 'Guide', 'Menu', 'Aimbot',
        'ESP', 'Instant Chat', 'Misc', 'Player Manager',
        'Auto Upgrades', 'Chat Spammer', 'Anti Aim', 'Perk Hacks',
        'Paint', 'Recorder', 'Discord Rich Presence', 'THNet',
        'Weird', 'Advanced', 'Credits'
    ],

    aimbotLabel = {
        [AIMBOT_ENABLE]: [ 'Enable Aimbot', 'Automatically aims your weapon at enemies, toggleable with right click.'],
        [AIMBOT_AIMSMOOTHING]: [ 'Aim Smoothing', 'Makes aimbot\'s movement smoother.'],
        [AIMBOT_CURSORMODE]: [ 'Enable', 'Whichever is closest to your cursor.'],
        [AIMBOT_USEACCELERATION]: [ 'Use Acceleration', 'Tries to account for the enemy\'s velocity changes.'],
        [AIMBOT_IGNORECHATTING]: [ 'Ignore Chatting', 'Ignores players who are typing.'],
        [AIMBOT_PINGCOMPENSATION]: [ 'Ping Compensation', 'Tries to compensate for the internet connection.'],
        [AIMBOT_TRIGGERBOT]: [ 'Enable', 'Shoots automatically when possible, requires Wall Check to be enabled (not recommended with single fire weapons.)'],
        [AIMBOT_WALLCHECK]: [ 'Wall Check', 'Tries to not aim at enemies behind walls.'],
        [AIMBOT_USEAHEAD]: [ 'Use Ahead Check', 'Use the position of where the enemy will be for wall check instead of where they are right now.'],
        [AIMBOT_DISABLEWHENDASHING]: [ 'Dash Disable', 'Turns aimbot temporarily off when dashing.'],
        [AIMBOT_CURSORPROXCOSENESS]: [ 'Range', 'How close an enemy needs to be to be targetted by the aimbot when in Cursor Proximity mode.'],
        [AIMBOT_TARGETMODE]: [ 'Prioritise Targets', 'Prioritises targetted players over anything when applicable.'],
        [AIMBOT_TRIGGERBOTWHENDOWN]: [ 'When Mouse Down', 'Triggerbot fires only when you shoot, suppresses manual firing when this and Triggerbot is enabled.'],
        [AIMBOT_RIGHTCLICKFRIEND]: [ 'Rightclick Friend', 'When you Rightclick on someone, it adds them to the friends list.'],
        [AIMBOT_AUXCLICKTARGET]: [ 'Middleclick Target', 'When you Middleclick on someone (Mouse-wheel when you press on it), it adds them to the targets list.'],
        [AIMBOT_TARGETSONLY]: [ 'Targets Only', 'Ignores people you aren\'t targetting.'],
        [AIMBOT_AVOIDFRIENDS]: [ 'Avoid Friends (WIP)', 'Avoids shooting at an enemy if it would be too risky for a friend on the enemy team to get hit. THIS IS IN BETA, MAY RESULT IN UNINTENDED CONSEQUENCES.'],
        [AIMBOT_AHEADNESSDEPTH]: [ 'Ahead Calc Depth', 'The accuracy of the calculation that checks how far ahead the aimbot should aim.'],
        [AIMBOT_LEADERMODE]: [ 'Prioritise Leader', 'Prioritises the top scoring player if they are on the enemy team. This takes priority over the \'Prioritise Targets\' setting.'],
        [AIMBOT_DROPDOWN_GENERAL]: [ 'General', '' ],
        [AIMBOT_DROPDOWN_ENHANCED]: [ 'Enhancements', '' ],
        [AIMBOT_DROPDOWN_CURSORPROX]: [ 'Cursor Proximity', '' ],
        [AIMBOT_DROPDOWN_SMART]: [ 'Smarter Targeting', '' ],
        [AIMBOT_DROPDOWN_PRIORITY]: [ 'Priority', '' ],
        [AIMBOT_DROPDOWN_TRIGGERBOT]: [ 'Triggerbot', '' ]
    },

    espLabel = {
        [ESP_ZOOM]: [ 'Extended View', 'Gives you maximum possible vision', ],
        [ESP_FIXCAMERA]: [ 'Fixed Camera', 'Stops the camera from moving', ],
        [ESP_TRACERSBODYENEMY]: [ 'Player Tracers', 'Draws a line from you to every player currently loaded in' ],
        [ESP_TRACERSCURSORENEMY]: [ 'CursorProx Tracers', 'When Cursor Proximity is enabled, draws lines from your cursor to your enemies' ],
        [ESP_TRACERSWALLCHECK]: [ 'Wall Check Tracers', 'Visualises the wall checking algorithm' ],
        [ESP_TRACERSGUN]: [ 'Gun Tracers', 'Draws the line a bullet would go if you shot your gun' ],
        [ESP_TRACERSGRENADES]: [ 'Grenade Tracers', 'Draws a line to where a grenade is to where the grenade will roughly land at' ],
        [ESP_SHOWINVIS]: [ 'Show Invisibles', 'Shows silencers, camo players and landmines', ],
        [ESP_REVEALTEAMS]: [ 'Reveal Teams', 'Reveals the team affiliations for grenades, landmines, gas and knifes', ],
        [ESP_SHOWHEALTH]: [ 'Healths', 'Shows every players\' current health', ],
        [ESP_SHOWARMOR]: [ 'Armors', 'Shows every players\' current armor', ],
        [ESP_SHOWMAGS]: [ 'Magazines', 'Shows every players\' current ammo counts', ],
        [ESP_SHOWGUNRELOADSTATUS]: [ 'Gun Reload', 'Shows every player\'s current gun reloading status with a percentage.', ],
        [ESP_SHOWRANGE]: [ 'Ranges', 'Shows how far players can shoot (may cause the game to look like a clusterfuck)' ],
        [ESP_CAMUSEREALPOSITION]: [ 'Camera Cursor Fix', 'When Aimbot is on, this makes the Camera follow your Cursor, and not where the Aimbot tells the game where the Cursor is' ],
        [ESP_INCLUDEYOU]: [ 'Self Attributes', 'Makes Player Healths, Player Armors, Player Magazines and Player Gun Status draw over you aswell' ],
        [ESP_SCROLLSENSITIVITY]: [ 'Zoom Sensitivity', 'When the \'Extended View\' mode is on \'Scroll\', this determines how much you zoom in and out when you use the scroll wheel' ],
        [ESP_DROPDOWN_CAMERA]: [ 'Camera', 'Various Camera Improvement Settings' ],
        [ESP_DROPDOWN_TRACERS]: [ 'Tracers', 'Some Lines and Circles' ],
        [ESP_DROPDOWN_PLAYERSTATS]: [ 'Player Attributes', 'Helpful Attributes of nearby Players' ],
        [ESP_DROPDOWN_OTHER]: [ 'Other', 'Other ESP Features' ]
    },

    autoUpgradesLabel = [
        [ 'Auto Upgrade', 'Automatically upgrades specified perks for you' ],
        'No Perk Selected'
    ],

    scrollerLabel = {
        0: [ 'Toggle Scroller', 'Turn the Chat Scroller either On or Off' ],
        [CHATSPAMMER_WIDTH]: [ 'Text Width', 'Maximum width of the scrolled text' ],
        [CHATSPAMMER_DIRECTION]: [ 'Direction', 'In which direction the text scrolls (- = left, + = right)' ],
        [CHATSPAMMER_INTERVAL]: [ 'Interval', 'The interval it takes for the text to shift' ],
        [CHATSPAMMER_PAUSEPERIOD]: [ 'Pause Period', 'When something besides the Scroller has said something in chat, for how long it should wait before it should scroll again' ],
        [CHATSPAMMER_TEXT]: [ 'Text', 'The Text to scroll in Chat' ],
        [CHATSPAMMER_SEPERATOR]: [ 'Seperator', 'The Seperator so it does not look like \'hello worldhello worldhello world\'' ],
        [CHATSPAMMER_PREFIX]: [ 'Prefix', 'Static text to add in front of your chat message' ],
        [CHATSPAMMER_SUFFIX]: [ 'Sufffix', 'Static text to add after your chat message' ]
    },

    instantchatLabel = {
        0: 'Change the text you say when you press a key',
        [INSTANTCHAT_CHATBINDS]: [ 'Chat Binds', 'Press buttons to make the cheat instantly say something in chat for you', ],
        [INSTANTCHAT_CHATBINDSTEXTS]: [ 'Edit Binds', 'Select a button on your keyboard to make the cheat say LITERALLY ANYTHING for you' ],
        [INSTANTCHAT_ONKILL]: [ 'On Kill Chat Msg', 'Say something when you kill someone', ],
        [INSTANTCHAT_ONKILLTEXT]: [ '', 'Change the text you say when you kill someone' ],
        [INSTANTCHAT_ONDEATH]: [ 'On Death Chat Msg', 'Say something when you die', ],
        [INSTANTCHAT_ONDEATHTEXT]: [ '', 'Change the text you say when you die' ],
        [INSTANTCHAT_AUTOTHANK]: [ 'Auto Medkit Thank', 'Instantly say thanks when you get healed', ],
        [INSTANTCHAT_AUTOTHANKTEXT]: [ '', 'Change the text you say when you get healed' ]
    },

    antiAimLabel = {
        [ANTIAIM_RELOAD]: [ 'While Reloading', 'To hide aim while reloading your gun' ],
        [ANTIAIM_SHOOT]: [ 'While Shooting', 'To hide aim while shooting your gun' ],
        [ANTIAIM_IDLE]: [ 'While Idle', 'To hide wim while neither shooting or reloading your gun (not recommended with single fire weapons)' ],
        [ANTIAIM_ANGLESTART]: [ 'Min Angle', 'Minimum Angle where it starts off' ],
        [ANTIAIM_ANGLERANGE]: [ 'Angle Range', 'Random additional angle from 0 to the angle range which gets added on the Minimum Angle' ],
        [ANTIAIM_SPINSPEED]: [ 'Spin Speed', 'How fast it spins. Accepts negative numbers if you want it to spin the other direction' ],
        [ANTIAIM_DELAY]: [ 'Interval', 'The amount of time (in game ticks) at which it picks another position to aim at' ],
        [ANTIAIM_DRAWREALAIM]: [ 'Draw Real Aim', 'Draws the gun a second time as if Anti Aim wasn\'t enabled' ]
    },

    miscLabel = {
        [MISC_AUTORELOAD]: [ 'Auto Reload', 'Automatically reloads when there are no enemies nearby', ],
        [MISC_PINGDISPLAY]: [ 'Ping Display', 'Displays the latency to the server', ],
        [MISC_RENDERDISPLAY]: [ 'FPS & Render Time', 'Displays your current FPS and how long it took to render the last frame', ],
        [MISC_STATICHUD]: [ 'Static Hud', 'Disables hud animations', ],
        [MISC_STATICHEALTH]: [ 'Static Health', 'Disables the hp moving animations on players when they take damage', ],
        [MISC_DISABLECLOSEPOPUP]: [ 'No Unload Popup', 'Disable the unload popup when you leave or reload the game' ],
        [MISC_BETTERCRATEHP]: [ 'Better Crate HP', 'Makes the health display pick colors better instead of just picking one of 5 colors' ],
        [MISC_HIDECHATTING]: [ 'Hide Chatbox', 'Others won\'t see that you\'re typing, they\'ll just see you not move' ],
        [MISC_FFACLANDISPLAY]: [ 'FFA Clan Tags', 'Shows clan tags next to names in FFA Mode' ],
        [MISC_SHOWFEATURES]: [ 'Feature Display', 'Shows what main features are enabled in the bottom right corner' ],
        [MISC_POSITION]: [ 'Coordinates', 'Shows your coordinates, velocity and acceleration' ],
        [MISC_LEADERBOARDBADGES]: [ 'Leaderboard Badges', 'Shows Friends, Targets, THNet members and the dev with badges next to their leaderboard' ],
        [MISC_DROPDOWN_INGAME]: [ 'In Game', 'Gameplay related settings' ],
        [MISC_DROPDOWN_DEBUG]: [ 'Debug', 'Special Technical Information' ],
        [MISC_DROPDOWN_HUD]: [ 'Heads Up Display', 'HUD-related settings' ],
        [MISC_DROPDOWN_OTHER]: [ 'Other', 'Settings that have no category of their own' ]
    },

    playerManagerLabel = [[
        'Friends',
        'Switch to the list of ignored enemies'
    ],[
        'Targets',
        'Switch to the list of prioritised targets'
    ],[
        'Muted',
        'Switch to the list of muted players'
    ],[
        'Add a friend',
        'Add a target',
        'Mute someone'
    ]],

    advancedLabel = {
        0: [ 'Disconnect', 'Disconnect from the current server' ],
        1: [ 'Clear Bootloader', 'Clears the stored code and version of the bootloader' ],
        2: [ 'Clear TioHax', 'Clears the settings and configutations, and resets them to factory defaults.' ],
        [ADVANCED_PINGCOUNT]: [ 'Ping Cache', 'How many recent ping times it stores' ],
        [ADVANCED_AIMCONSTANT]: [ 'Aim Constant', 'Lower = Aimbot aims further ahead' ],
        [ADVANCED_PINGCOMP]: [ 'Account for ping', 'How far the aimbot aims ahead depending on the ping. lower = further' ],
        [ADVANCED_TPS]: [ 'Sync TPS with Server', 'Makes the game run at 25 ticks per second instead of 62.5' ],
        [ADVANCED_OPTIMISEWALLCHECK]: [ 'Optimise Wallcheck', 'Optimises the checking for the wall checking algorithm' ]
    },

    perkHacksLabel = {
        0: [ 'KnifeBot (WIP)', 'Automatically shoots a knife at very near enemies' ],
        1: [ 'ShieldBot (WIP)', 'Automatically blocks nearby bullets' ],
        2: [ 'Medkit and Build (WIP)', 'Gives tools for using Medkit and Build perks' ],

        [PERKHACKS_KNIFE]: [ 'Enable', 'Automatically shoots a knife at a close enemy' ],
        [PERKHACKS_KNIFEMAXRANGE]: [ 'Range', 'How close an enemy needs to be to be knifed' ],

        [PERKHACKS_SHIELD]: [ 'Enable', 'Automatically block nearby bullets' ],
        [PERKHACKS_SHIELDUPKEEP]: [ 'Takedown delay', 'How long (in ticks) the shield should be up for even when the bullet is deflected' ],
        [PERKHACKS_SHIELDMANUAL]: [ 'Manual Ability', 'Does not take control over your ability to use the shield, but still aims torwards close bullets for you' ],
        [PERKHACKS_SHIELDLOOKAHEAD]: [ 'Lookahead', 'Tries to block incoming bullets earlier the higher this value is' ],
        [PERKHACKS_SHIELDVISUALISER]: [ 'Visualiser', 'For debugging purposes, visualises the check that the ShieldBot does.' ],
        [PERKHACKS_SHIELDWALLCHECK]: [ 'Wall Check', 'Only tries to block bullets that would have to go through crates.' ],

        [PERKHACKS_CRATEPLACEVISION]: [ 'Placement Vision', 'Where exactly the build block or medkit will be placed when Build or Medkit is used' ],
        [PERKHACKS_MEDKITSELFHEAL]: [ 'Auto Self Heal', 'Automatically puts the Medkit in front of you if you\'re below a certain health threshold' ],
        [PERKHACKS_MEDKITSELFHEALTHRESHOLD]: [ 'Threshold', 'The health threshold that says when to heal yourself. If your health is lower, it heals' ]
    },

    THNetLabel = {
        0: [ 'THNet Rules', 'Rules you have to follow when using THNet' ],
        1: [
            'Don\'t kill other THNet members, the point is to make THNet work with each other.',
            'Don\'t spam THNet Chat with garbage, else it drowns out good messages.',
            'Don\'t be mean to others in THNet Chat, it does not make you a good person.'
        ],
        [THNET_ENABLE]: [ 'Connect', 'Connects to THNet when you join a server, bringing a variety of features' ],
        [THNET_DISCONNECT]: [ 'Disconnect', 'Disconnect from THNet, your Aimbot will shoot at them but their Aimbots will also shoot you' ],
        [THNET_MEMBERS]: [ 'THNet Members', 'The List of THNet Members in your current lobby' ],
        [THNET_CHAT]: [ 'Serverwide Chat', 'Chat with all other THNet members in your current server without needing to be close' ],
        [THNET_DONATE]: [ 'Donate Connection', 'Donate an unused Game Connection to Taureon for a Botnet which will assist you' ],
        [THNET_AUTH]: [ 'THNet Admin Authentication', 'Authentication Code Input Box for THNet Administrators' ],
        [THNET_INFOSHARE]: [ 'Share Gameplay Info', 'Shares health, position, ammo count and class with other members' ]
    },

    weirdLabel = {
        [WEIRD_CURSORMOVE]: [ 'Move with Cursor', 'You will move to where your cursor is' ]
    },

    discordRPCLabel = {
        [DISCORDRPC_ENABLED]: [ 'Enable', 'Makes the Rich Presence show up on your Discord Profile' ],
        [DISCORDRPC_STATE]: [ 'State', 'First line below the Presence Title' ],
        [DISCORDRPC_DETAILS]: [ 'Details', 'Line below the State Line' ],
        [DISCORDRPC_UPDATEINTERVAL]: [ 'Update Interval', 'In seconds, how often it updates' ]
    },

    paintLabel = {
        0: [ 'Reset Colors/Values', 'Resets every change back to default'],
        1: [ 'ARE YOU SURE that you want to reset everything you have changed in Paint?', 'Type exactly \'yes\' if yes' ],

        [PAINT_GRID]: [ 'Grid', 'Change the look of the floor' ],
        [PAINT_POINTS]: [ 'Capture Points', 'Change the look of capture points' ],
        [PAINT_CRATES]: [ 'Crates', 'Change the look of crates on the map' ],

        [PAINT_GRIDSPACEX]: [ 'Horiz. Space', 'The horizontal space between the grid lines' ],
        [PAINT_GRIDSPACEY]: [ 'Vert. Space', 'The vertical space between the grid lines' ],
        [PAINT_GRIDLINEWIDTHHORIZONTAL]: [ 'Hori. Line Width', 'Width of the lines that go horizontally' ],
        [PAINT_GRIDLINEWIDTHVERTICAL]: [ 'Vert. Line Width', 'Width of the lines that go vertically' ],
        [PAINT_GRIDCOLOR]: [ 'Grid Color', 'The color of the Grid' ],

        [PAINT_POINTSIDLE]: [ 'No One Capturing', 'The color if no one is capturing the point' ],
        [PAINT_POINTSFFA]: [ 'FFA You Capturing', 'The color if you are capturing the point' ],
        [PAINT_POINTSBLU]: [ 'Blue Capturing', 'The color if the blue team is capturing the point' ],
        [PAINT_POINTSRED]: [ 'Red Capturing', 'The color if the red team is capturing the point' ],
        [PAINT_POINTEDGEWIDTH]: [ 'Edge Width', 'How wide the edges of the capture points should be' ],

        [PAINT_CRATESHOWHPMODE]: [ 'Health Display', 'Change which parts should turn white when build crates get damaged' ],
        [PAINT_CRATESQUARE]: [ 'Square Crates', 'The large square-shaped crates' ],
        [PAINT_CRATELONG]: [ 'Long Crates', 'The smaller rectangle-shaped crates' ],
        [PAINT_CRATEUSER]: [ 'Build Crates', 'The crates made with the Build perk' ],
        [PAINT_CRATEPREMIUM]: [ 'Premium Crates', 'Build crates but built by Premium Users' ],
        [PAINT_CRATECORPSE]: [ 'Crate Corpses', 'The colors the crate takes on as its Health decreases' ],

        [PAINT_PRESETMANAGER]: [ 'Preset Manager', 'Manage Paint Presets. Save, Load, Export, Import and Name Presets' ]
    },

    controlDropdownOptions = [
        [
            [ 'Normal', 'Normal Game View' ],
            [ 'Scroll', 'Use your scroll wheel to change how much you can see' ],
            [ 'Static', 'Automatically zooms out to the most possible you can see' ]
        ], [
            [ 'None', 'Crate colors do not change' ],
            [ 'Edges', 'Only the crate\'s edge changes' ],
            [ 'Inside', 'Only the inside of the crate changes' ],
            [ 'Both', 'Entire crate changes' ]
        ], [
            [ 'Disabled', 'No Display for what Main Features are enabled' ],
            [ 'Enabled', 'Main Features get displayed in the bottom right corner' ],
            [ 'Graytext', 'Subsettings are shown in Gray Colors instead of Rainbow' ]
        ], [
            [ 'None', 'No ShieldBot check visualisers' ],
            [ 'Closeness', 'The circle inside a bullet needs to be in' ],
            [ 'Bullets', 'Draws small arrows to see how far ahead it predicts the bullets to be' ],
            [ 'Both', 'Shows both Bullets and Closeness' ]
        ]
    ],

    menuLabel = [
        'Minimise the Menu, can be reopened by pressing T',
        'Return back to the previous menu',
        'Close THNet chat, can be reopened by pressing CTRL',
        'TioHax Cheat Menu',
        'THNet Serverwide Chat'
    ],

    loadedLocalisation = {},

    //for if the player has made friends on the enemy team
    friends = [],

    //for if the player wants to really kill someone
    targets = [],

    //muted players who you don't want to hear text from
    muted = [],

    //0 = friends
    playermanagerSelectedMenu = 0,

    //the divs that make up the cheat menu
    divs = {
        menu: 0,
        title: 0,
        chatbox: 0,
        content: 0,
        chatwrap: 0,
        chatinput: 0,
        backbutton: 0
    },

    //selected perk slot for auto upgrade menu
    selectedPerkSlot = 1,

    //alternate chat bind messages so we don't get kicked for spam
    lastMessageLength = 0,

    //key code map
    // http://www.foreui.com/articles/Key_Code_Table.htm
    keyCodeMap = {
        [KEYCODE_ESC]:        27,  [KEYCODE_A]:       65,  [KEYCODE_E]:         69,
        [KEYCODE_D]:          68,  [KEYCODE_R]:       82,  [KEYCODE_S]:         83,
        [KEYCODE_T]:          84,  [KEYCODE_W]:       87,  [KEYCODE_Z]:         90,
        [KEYCODE_ENTER]:      13,  [KEYCODE_SPACE]:   32,  [KEYCODE_ARROWLEFT]: 37,
        [KEYCODE_ARROWRIGHT]: 39,  [KEYCODE_ARROWUP]: 38,  [KEYCODE_ARROWDOWN]: 40,
        [KEYCODE_N]:          78,  [KEYCODE_SHIFT]:   16,  [KEYCODE_CTRL]:      17,
    },

    autoUpgrades = [0, '', '', ''],

    perks = [
        'bipod',         'optics',      'thermal',
        'armorPiercing', 'extended',    'grip',
        'silencer',      'lightweight', 'longRange',
        'thickSkin'
    ],
    abilities = [
        'shield',        'firstAid',    'grenade',
        'knife',         'engineer',    'ghillie',
        'dash',          'gasGrenade',  'landMine',
        'fragGrenade'
    ],

    perkNames = {
        'bipod': 'No Recoil',
        'optics': 'Binoculars',
        'thermal': 'Thermal',
        'armorPiercing': 'Damage',
        'extended': 'Large Mags',
        'grip': '+Accuracy',
        'silencer': 'Silencer',
        'lightweight': 'Speed',
        'longRange': 'Range',
        'thickSkin': 'Kevlar',
        'shield': 'Shield',
        'firstAid': 'Medkit',
        'grenade': 'Grenade',
        'knife': 'Knife',
        'engineer': 'Build',
        'ghillie': 'Camo',
        'dash': 'Dash',
        'gasGrenade': 'Gas',
        'landMine': 'Landmine',
        'fragGrenade': 'Frag'
    },

    aimbot = {
        [AIMBOT_ENABLE]: 0,
        [AIMBOT_AIMSMOOTHING]: 0,
        [AIMBOT_CURSORMODE]: 0,
        [AIMBOT_CURSORPROXCOSENESS]: 200,
        [AIMBOT_USEACCELERATION]: 0,
        [AIMBOT_IGNORECHATTING]: 0,
        [AIMBOT_PINGCOMPENSATION]: 0,
        [AIMBOT_WALLCHECK]: 0,
        [AIMBOT_USEAHEAD]: 0,
        [AIMBOT_DISABLEWHENDASHING]: 0,
        [AIMBOT_TRIGGERBOT]: 0,
        [AIMBOT_TRIGGERBOTWHENDOWN]: 0,
        [AIMBOT_TARGETMODE]: 0,
        [AIMBOT_RIGHTCLICKFRIEND]: 1,
        [AIMBOT_AUXCLICKTARGET]: 1,
        [AIMBOT_AVOIDFRIENDS]: 0,
        [AIMBOT_AHEADNESSDEPTH]: 0,
        [AIMBOT_LEADERMODE]: 0
    },

    esp = {
        [ESP_ZOOM]: 0,
        [ESP_FIXCAMERA]: 0,
        [ESP_CAMUSEREALPOSITION]: 0,
        [ESP_TRACERSBODYENEMY]: 0,
        [ESP_TRACERSCURSORENEMY]: 0,
        [ESP_TRACERSWALLCHECK]: 0,
        [ESP_TRACERSGUN]: 0,
        [ESP_TRACERSGRENADES]: 0,
        [ESP_SHOWINVIS]: 0,
        [ESP_REVEALTEAMS]: 0,
        [ESP_SHOWHEALTH]: 0,
        [ESP_SHOWARMOR]: 0,
        [ESP_SHOWMAGS]: 0,
        [ESP_SHOWGUNRELOADSTATUS]: 0,
        [ESP_SHOWRANGE]: 0,
        [ESP_INCLUDEYOU]: 0,
        [ESP_SCROLLSENSITIVITY]: 1.1
    },

    chatSpam = {
        [CHATSPAMMER_TEXT]: 'TioHax on top! http' + homeUrl,
        [CHATSPAMMER_INDEX]: 0,
        [CHATSPAMMER_WIDTH]: 30,
        [CHATSPAMMER_TIMEOUT]: 0,
        [CHATSPAMMER_INTERVAL]: 100,
        [CHATSPAMMER_VARIATION]: 0,
        [CHATSPAMMER_DIRECTION]: 1,
        [CHATSPAMMER_SEPERATOR]: ' # ',
        [CHATSPAMMER_PAUSEPERIOD]: 3000,
        [CHATSPAMMER_PREFIX]: '',
        [CHATSPAMMER_SUFFIX]: ''
    },

    instantchat = {
        [INSTANTCHAT_ONKILL]: 0,
        [INSTANTCHAT_ONKILLTEXT]: '[[ENEMY]] just died to TioHax!',
        [INSTANTCHAT_ONDEATH]: 0,
        [INSTANTCHAT_ONDEATHTEXT]: '[[ENEMY]] = god awful',
        [INSTANTCHAT_AUTOTHANK]: 0,
        [INSTANTCHAT_AUTOTHANKTEXT]: 'I have been healed! Thank you!',
        [INSTANTCHAT_CHATBINDS]: 0,
        [INSTANTCHAT_CHATBINDSTEXTS]: {
            [keyCodeMap[KEYCODE_E]]: 'I need a medic!' ,
            [keyCodeMap[KEYCODE_Z]]: 'Put Build Blocks here!'
        }
    },

    antiAim = {
        [ANTIAIM_RELOAD]: 0,
        [ANTIAIM_SHOOT]: 0,
        [ANTIAIM_IDLE]: 0,
        [ANTIAIM_ANGLESTART]: 0,
        [ANTIAIM_ANGLERANGE]: 0,
        [ANTIAIM_SPINSPEED]: 0,
        [ANTIAIM_DELAY]: 1,
        [ANTIAIM_SAVEDX]: 0,
        [ANTIAIM_SAVEDY]: 0
    },

    recorder = {
        [RECORDER_ISRECORDING]: 0,
        [RECORDER_ISPLAYING]: 0,
        [RECORDER_CURRENT]: [],
        [RECORDER_SESSIONS]: [],
        [RECORDER_TIMEOUT]: 0,
        [RECORDER_SESSIONTOPLAY]: -1
    },

    misc = {
        [MISC_AUTORELOAD]: 0,
        [MISC_PINGDISPLAY]: 0,
        [MISC_RENDERDISPLAY]: 0,
        [MISC_STATICHUD]: 0,
        [MISC_STATICHEALTH]: 0,
        [MISC_DISABLECLOSEPOPUP]: 0,
        [MISC_BETTERCRATEHP]: 0,
        [MISC_HIDECHATTING]: 0,
        [MISC_FFACLANDISPLAY]: 0,
        [MISC_SHOWFEATURES]: 0,
        [MISC_POSITION]: 0,
        [MISC_LEADERBOARDBADGES]: 0
    },

    advanced = {
        [ADVANCED_PINGCOUNT]: 10,
        [ADVANCED_AIMCONSTANT]: 1,
        [ADVANCED_TPS]: 2.5,
        [ADVANCED_OPTIMISEWALLCHECK]: 1,
        [ADVANCED_PINGCOMP]: 25 // originally 40 because the server updates once every 40 ms, though 25 is a better number
    },

    perkHacks = {
        [PERKHACKS_TICK]: 0,
        [PERKHACKS_KNIFE]: 0,
        [PERKHACKS_KNIFEMAXRANGE]: 100,
        [PERKHACKS_SHIELD]: 0,
        [PERKHACKS_SHIELDUPKEEP]: 5,
        [PERKHACKS_STOREDANGLE]: 0,
        [PERKHACKS_SHIELDMANUAL]: 0,
        [PERKHACKS_SHIELDLOOKAHEAD]: 0,
        [PERKHACKS_CRATEPLACEVISION]: 0,
        [PERKHACKS_MEDKITSELFHEAL]: 0,
        [PERKHACKS_MEDKITSELFHEALTHRESHOLD]: 50,
        [PERKHACKS_SHIELDVISUALISER]: 0,
        [PERKHACKS_SHIELDWALLCHECK]: 0
    },

    thnet = {
        [THNET_ENABLE]: 1,
        [THNET_SOCKET]: 0,
        [THNET_CHAT]: 0,
        [THNET_DONATE]: 0,
        [THNET_CLOSEREASON]: '',
        [THNET_AUTH]: '',
        [THNET_BROTHERS]: [],
        [THNET_INFOSHARE]: 0,
        [THNET_INFOSHARING]: {},
        [THNET_ENTEROPENCHAT]: 0
    },

    weird = {
        [WEIRD_CURSORMOVE]: 0
    },

    discordRPC = {
        [DISCORDRPC_ENABLED]: 0,
        [DISCORDRPC_STATE]: 'State',
        [DISCORDRPC_DETAILS]: 'Details',
        [DISCORDRPC_UPDATEINTERVAL]: 30,
        // ^^ = configurable | vv = internal
        [DISCORDRPC_START]: Date.now(),
        [DISCORDRPC_TIMEOUT]: 0,
        [DISCORDRPC_CONNECTION]: 0,
        [DISCORDRPC_CLIENTID]: '1050361019609927690',
        [DISCORDRPC_TRIES]: 0,
        [DISCORDRPC_ACCESSTOKEN]: '',
        [DISCORDRPC_EXPECTING]: []
    },

    paint = {
        [PAINT_GRIDSPACEX]: 20,
        [PAINT_GRIDSPACEY]: 20,
        [PAINT_GRIDLINEWIDTHHORIZONTAL]: 1,
        [PAINT_GRIDLINEWIDTHVERTICAL]: 1,
        [PAINT_GRIDCOLOR]: ['#e3e3e8', '#efeff5'],

        [PAINT_POINTSIDLE]: ['#aaaaaa', '#f9f9f9'],
        [PAINT_POINTSFFA]: ['#00cc66', '#f9f9f9'],
        [PAINT_POINTSBLU]: ['#8dd8f8', '#f9f9f9'],
        [PAINT_POINTSRED]: ['#f26740', '#f9f9f9'],
        [PAINT_POINTEDGEWIDTH]: 4,

        [PAINT_CRATESHOWHPMODE]: 2,
        [PAINT_CRATESQUARE]: ['#808080', '#dfbf9f'],
        [PAINT_CRATELONG]: ['#808080', '#bec8dd'],
        [PAINT_CRATEUSER]: ['#808080', '#53c68c'],
        [PAINT_CRATEPREMIUM]: ['#2e2d2d', '#f0ba37'],
        [PAINT_CRATECORPSE]: ['#ffffff', '#ffffff'],

        [PAINT_PRESETS]: [
            [ 'Default'       , 'Dygn'   , 20, 20, 1, 1, ['#e3e3e8', '#efeff5'], ['#aaaaaa', '#f9f9f9'], ['#00cc66', '#f9f9f9'], ['#8dd8f8', '#f9f9f9'], ['#f26740', '#f9f9f9'], 4 , 2, ['#808080', '#dfbf9f'], ['#808080', '#bec8dd'], ['#808080', '#53c68c'], ['#2e2d2d', '#f0ba37'], ['#ffffff', '#ffffff'] ],
            [ 'Vaakir Style'  , 'Vaakir' , 20, 20, 1, 1, ['#e3e3e8', '#efeff5'], ['#aaaaaa', '#f9f9f9'], ['#00cc66', '#f9f9f9'], ['#8dd8f8', '#f9f9f9'], ['#f26740', '#f9f9f9'], 4 , 2, ['#4dd8f0', '#b1e9f9'], ['#303030', '#646464'], ['#808080', '#53c68c'], ['#2e2d2d', '#f0ba37'], ['#ffffff', '#ffffff'] ],
            [ 'Drawn on Paper', 'Taureon', 40, 40, 1, 0, ["#a0a0a0", "#ffffff"], ["#808080", "#c4c4c4"], ["#00cc66", "#8fff91"], ["#00b3ff", "#94d1ff"], ["#f26740", "#ffa680"], 10, 2, ["#ff0000", "#ff9494"], ["#2b00ff", "#94b6ff"], ["#00ff04", "#7cfebd"], ["#ff8800", "#ffd470"], ["#ffffff", "#ffffff"] ]
        ]
    },

    multiBox = {
        [MULTIBOX_SELECTEDSOCKET]: 0,
        [MULTIBOX_SPAWNCLONE]: 0,
        [MULTIBOX_INSTANTRESPAWN]: 0
    },

    renderFunctions = [],

    //this really doesnt need to exist but idc
    pInt = parseInt,

    getElementById = x => x && document.getElementById(x),

keyPress = (socketId, inputId, state) => RF.list[socketId]?.send(a59('key-press', {inputId, state: state * 1})),

startGunfire = socketId => keyPress(socketId, 6, cursor.isShooting = 1),
stopGunfire = socketId => keyPress(socketId, 6, cursor.isShooting = 0),

startActivePerk = socketId => keyPress(socketId, 5, 1),
stopActivePerk = socketId => keyPress(socketId, 5, 0),

startReloading = socketId => keyPress(socketId, 4, 1),
stopReloading = socketId => keyPress(socketId, 4, 0),

getPlayerHoveringOverOnLeaderboard = mouseEvent => {
    if (j3 < 1 && j3 > 2.6) return '';
    let offset = 0.03,
        x = 1.7 * j13;
    for (let entry of j38.current) {
        if (!entry.userId) continue;
        let y = (0.05 + offset) * j14;
        offset += 0.045;
        if (mouseEvent.x > x && mouseEvent.y > y && mouseEvent.x < x + 0.295 * j13 && mouseEvent.y < y + 0.04 * j14) {
            return sanitiseName(entry.userId);
        }
    }
},

getPlayerHoveringOverInGame = mouseEvent => {
    let me = RD.pool[c3],
        x = c2.x + mouseEvent.x / j6,
        y = c2.y + mouseEvent.y / j5;
    for (let player of getPool(RD)) {
        if (player.activated && player.id != me.id && getDistanceSquared(player, {x, y}, nullPos) <= (player[ATTRIBUTE_RADIUS] + 2 ) ** 2) {
            return player[ATTRIBUTE_SANITIZEDNAME];
        }
    }
},

nonLeftClickPressHandler = (player, primaryList, secondaryList, enumClickToggle, enumSettingToggle) => {
    if (player && aimbot[enumClickToggle]) {
        toggleUsernameInlist(primaryList, player);
        if (includesInArray(secondaryList, player)) toggleUsernameInlist(secondaryList, player);
    } else {
        aimbot[enumSettingToggle] = 1 - aimbot[enumSettingToggle];
        saveSettings();
    }
},

gameMouseUp = mouseEvent => {
    if (!j17 && c3 && mouseEvent.which == MOUSEEVENT_LEFT) {
        cursor.isPressed = 0;
        stopGunfire(multiBox[MULTIBOX_SELECTEDSOCKET]);
    }
    j18 = {x: 0, y: 0};
},

gameMouseDown = mouseEvent => {
    if ($('#loginModal'    ).is(':visible') ||
        $('#registerModal' ).is(':visible') ||
        $('#aboutModal'    ).is(':visible') ||
        $('#privacyModal'  ).is(':visible')) return;

    j18 = {x: mouseEvent.clientX, y: mouseEvent.clientY};

    if (j17 || c3 == null) return;

    let playerHover = '';
    if (mouseEvent.which !== MOUSEEVENT_LEFT && (aimbot[AIMBOT_RIGHTCLICKFRIEND] || aimbot[AIMBOT_AUXCLICKTARGET])) {
        playerHover = getPlayerHoveringOverOnLeaderboard(mouseEvent) || getPlayerHoveringOverInGame(mouseEvent);
    }

    switch (mouseEvent.which) {
        case MOUSEEVENT_LEFT:
            if (aimbot[AIMBOT_TRIGGERBOTWHENDOWN] || !aimbot[AIMBOT_ENABLE] || !aimbot[AIMBOT_TRIGGERBOT]) startGunfire(multiBox[MULTIBOX_SELECTEDSOCKET]);
            cursor.isPressed = 1;
            break;

        case MOUSEEVENT_MIDDLE:
            nonLeftClickPressHandler(playerHover, targets, friends, AIMBOT_RIGHTCLICKFRIEND, AIMBOT_TARGETSONLY);
            break;

        case MOUSEEVENT_RIGHT:
            nonLeftClickPressHandler(playerHover, friends, targets, AIMBOT_AUXCLICKTARGET, AIMBOT_ENABLE);
            break;
    }

    //reset aiming direction to the cursor
    if (aimbot[AIMBOT_ENABLE]) return;
    aimMeAt({ clientX: cursor.x, clientY: cursor.y });
    sendMousePositionToServer(multiBox[MULTIBOX_SELECTEDSOCKET]);
},

hashString = str => {
    let hash = 0, i;
    for (i = 0; i < str.length; i++) hash = (((hash << 5) - hash) + str.charCodeAt(i)) | 0;
    return hash;
},

fetchFromServer = path => new Promise(Resolve => fetch('http' + homeUrl + path).then(res => res.text()).then(Resolve)),

// https://stackoverflow.com/questions/3977792/how-to-convert-keycode-to-character-using-javascript
keyCodeToLetter = key => String.fromCharCode((96 <= key && key <= 105) ? key - 48 : key),

clamp = (minVal, val, maxVal) => isNaN(val) ? minVal : min(maxVal, max(minVal, val)),

lerp = (a, b, t) => a + t * (b - a),

lerpR = (a, b, t) => round(lerp(a, b, t)),

spacePadding = (val, minLength = 3) => {
    val = val.toString();
    while (val.length < minLength) val = ' ' + val;
    return val;
},

percentify = a => round(a * 100) + '%',

pressKey = keyCode => document.onkeydown({keyCode, [ATTRIBUTE_ISFROMCHEAT]: 1, preventDefault: ()=>{}}),
releaseKey = keyCode => document.onkeyup({keyCode, [ATTRIBUTE_ISFROMCHEAT]: 1, preventDefault: ()=>{}}),

sendChatMessage = (socketId, message, dontpause) => {
    if (!dontpause) pauseChatScrolling();
    lastMessageLength = message.length;
    RF.list[socketId].send(a59('message', {message: message.replace(/,/g, '~')}));
},

//remove clan tags in tdm and dom
sanitiseName = username => username.replace(/\[[\d\w]{1,4}\] /, ''),

indexOfInArray = (arr, target) => {
    for (let i = 0; i < arr.length; i++) if (arr[i] == target) return i;
    return -1;
},

includesInArray = (arr, target) => {
    for (let i = 0; i < arr.length; i++) if (arr[i] == target) return 1;
    return 0;
},

getPool = R => {
    if (!R) return;
    return Object.values(R.pool);
},

discordRPCConnect = onConnected => {
    const port = 6463 + (discordRPC[DISCORDRPC_TRIES]++ % 10);
    discordRPC[DISCORDRPC_CONNECTION] = applyAttrbutes(new WebSocket('ws://127.0.0.1:' + port + '/?v=1&client_id=' + discordRPC[DISCORDRPC_CLIENTID]), {
        'onopen': onConnected,
        'onmessage': event => {
            let message = JSON.parse(event.data),
                nonce = message.nonce;
            if (message.cmd === 'DISPATCH' && message.evt === 'READY') {
                onConnected();
            } else if (nonce in discordRPC[DISCORDRPC_EXPECTING]) {
                const { y, n } = discordRPC[DISCORDRPC_EXPECTING][nonce];
                if (message.evt === 'ERROR') {
                    const e = new Error(message.data.message);
                    e.code = message.data.code;
                    e.data = message.data;
                    n(e);
                } else {
                    y(message.data);
                }
                delete discordRPC[DISCORDRPC_EXPECTING][nonce];
            }
        },
        'onerror': event => {
            try {
                discordRPC[DISCORDRPC_CONNECTION].close();
            } catch {}
            if (discordRPC[DISCORDRPC_TRIES] > 20) {
                //TODO: handle error of there being no discord client
            } else {
                setTimeout(discordRPCConnect, 250);
            }
        },
        'onclose': event => {
            if (event.wasClean) for (let e of discordRPC[DISCORDRPC_EXPECTING]) e.n(new Error('connection closed'));
            discordRPC[DISCORDRPC_CONNECTION] = 0;
        }
    });
},

discordRPCStart = () => {
    let discordRPCUpdate = () => discordRPCActivitySet(discordRPC[DISCORDRPC_TIMEOUT] = setTimeout(discordRPCUpdate, discordRPC[DISCORDRPC_UPDATEINTERVAL] * 1e3));
    discordRPCConnect(discordRPCUpdate);
},

discordRPCRequest = (cmd, args, evt) => {
    return new Promise((y, n) => {
        let nonce = random() + ''; //good enough
        if (discordRPC[DISCORDRPC_CONNECTION].readyState == 'OPEN') discordRPC[DISCORDRPC_CONNECTION].send(JSON.stringify({ cmd, args, evt, nonce }));
        discordRPC[DISCORDRPC_EXPECTING][nonce] = { y, n };
    });
},

discordRPCActivitySet = () => {
    discordRPCRequest('SET_ACTIVITY', {
        pid: null,
        activity: {
            state: discordRPC[DISCORDRPC_STATE],
            details: discordRPC[DISCORDRPC_DETAILS],
            timestamps: { start: discordRPC[DISCORDRPC_START], end: undefVar },
            assets: { large_image: 'tiohax_icon', large_text: 'TioHax Cheat Menu', small_image: 'gatsio_favicon', small_text: 'On Gats.io' },
            buttons: undefVar,
            instance: false,
        },
    });
},

discordRPCActivityClear = () => discordRPCRequest('SET_ACTIVITY', { pid: null }),

saveSettings = () => {
    //TODO: multibox stop fire on everything
    stopGunfire(multiBox[MULTIBOX_SELECTEDSOCKET]);
    for (let func of renderFunctions) func();
    localStorage.setItem('TioHax_settings', JSON.stringify([
        friends.filter(x => !x.startsWith('Guest ')),
        targets.filter(x => !x.startsWith('Guest ')),
        autoUpgrades,
        [
            aimbot[AIMBOT_ENABLE],
            aimbot[AIMBOT_AIMSMOOTHING],
            aimbot[AIMBOT_CURSORMODE],
            aimbot[AIMBOT_USEACCELERATION],
            aimbot[AIMBOT_IGNORECHATTING],
            aimbot[AIMBOT_PINGCOMPENSATION],
            aimbot[AIMBOT_TRIGGERBOT],
            aimbot[AIMBOT_WALLCHECK],
            aimbot[AIMBOT_USEAHEAD],
            aimbot[AIMBOT_DISABLEWHENDASHING],
            aimbot[AIMBOT_CURSORPROXCOSENESS],
            aimbot[AIMBOT_TARGETMODE],
            aimbot[AIMBOT_TRIGGERBOTWHENDOWN],
            aimbot[AIMBOT_RIGHTCLICKFRIEND],
            aimbot[AIMBOT_AUXCLICKTARGET],
            aimbot[AIMBOT_TARGETSONLY],
            aimbot[AIMBOT_AVOIDFRIENDS],
            aimbot[AIMBOT_AHEADNESSDEPTH],
            aimbot[AIMBOT_LEADERMODE]
        ],[
            esp[ESP_ZOOM],
            esp[ESP_FIXCAMERA],
            esp[ESP_TRACERSBODYENEMY],
            esp[ESP_TRACERSCURSORENEMY],
            esp[ESP_TRACERSWALLCHECK],
            esp[ESP_TRACERSGUN],
            esp[ESP_TRACERSGRENADES],
            esp[ESP_SHOWINVIS],
            esp[ESP_REVEALTEAMS],
            esp[ESP_SHOWHEALTH],
            esp[ESP_SHOWARMOR],
            esp[ESP_SHOWMAGS],
            esp[ESP_SHOWGUNRELOADSTATUS],
            esp[ESP_CAMUSEREALPOSITION],
            esp[ESP_INCLUDEYOU],
            esp[ESP_SHOWRANGE],
            esp[ESP_SCROLLSENSITIVITY]
        ],[
            chatSpam[CHATSPAMMER_TEXT],
            chatSpam[CHATSPAMMER_WIDTH],
            chatSpam[CHATSPAMMER_INTERVAL],
            chatSpam[CHATSPAMMER_DIRECTION],
            chatSpam[CHATSPAMMER_SEPERATOR],
            chatSpam[CHATSPAMMER_PREFIX],
            chatSpam[CHATSPAMMER_SUFFIX]
        ],[
            antiAim[ANTIAIM_RELOAD],
            antiAim[ANTIAIM_SHOOT],
            antiAim[ANTIAIM_IDLE],
            antiAim[ANTIAIM_ANGLESTART],
            antiAim[ANTIAIM_ANGLERANGE],
            antiAim[ANTIAIM_SPINSPEED],
            antiAim[ANTIAIM_DELAY],
            antiAim[ANTIAIM_DRAWREALAIM]
        ],[
            instantchat[INSTANTCHAT_CHATBINDS],
            instantchat[INSTANTCHAT_CHATBINDSTEXTS],
            instantchat[INSTANTCHAT_ONKILL],
            instantchat[INSTANTCHAT_ONKILLTEXT],
            instantchat[INSTANTCHAT_ONDEATH],
            instantchat[INSTANTCHAT_ONDEATHTEXT],
            instantchat[INSTANTCHAT_AUTOTHANK],
            instantchat[INSTANTCHAT_AUTOTHANKTEXT]
        ],[
            misc[MISC_AUTORELOAD],
            misc[MISC_PINGDISPLAY],
            misc[MISC_RENDERDISPLAY],
            misc[MISC_STATICHUD],
            misc[MISC_STATICHEALTH],
            misc[MISC_DISABLECLOSEPOPUP],
            misc[MISC_BETTERCRATEHP],
            misc[MISC_HIDECHATTING],
            misc[MISC_FFACLANDISPLAY],
            misc[MISC_SHOWFEATURES],
            misc[MISC_POSITION],
            misc[MISC_LEADERBOARDBADGES]
        ],[
            advanced[ADVANCED_PINGCOUNT],
            advanced[ADVANCED_AIMCONSTANT],
            advanced[ADVANCED_OPTIMISEWALLCHECK],
            advanced[ADVANCED_TPS],
            advanced[ADVANCED_PINGCOMP]
        ],[
            thnet[THNET_ENABLE],
            thnet[THNET_CHAT],
            thnet[THNET_DONATE],
            thnet[THNET_INFOSHARE]
        ],
        muted.filter(x => !x.startsWith('Guest ')),
        [
            perkHacks[PERKHACKS_KNIFE],
            perkHacks[PERKHACKS_KNIFEMAXRANGE],
            perkHacks[PERKHACKS_SHIELD],
            perkHacks[PERKHACKS_SHIELDUPKEEP],
            perkHacks[PERKHACKS_SHIELDMANUAL],
            perkHacks[PERKHACKS_CRATEPLACEVISION],
            perkHacks[PERKHACKS_SHIELDLOOKAHEAD],
            perkHacks[PERKHACKS_MEDKITSELFHEAL],
            perkHacks[PERKHACKS_MEDKITSELFHEALTHRESHOLD],
            perkHacks[PERKHACKS_SHIELDVISUALISER],
            perkHacks[PERKHACKS_SHIELDWALLCHECK]
        ],[
            // discordRPC[DISCORDRPC_ENABLED],
            // discordRPC[DISCORDRPC_STATE],
            // discordRPC[DISCORDRPC_DETAILS],
            // discordRPC[DISCORDRPC_UPDATEINTERVAL]
        ],[
            paint[PAINT_GRIDSPACEX],
            paint[PAINT_GRIDSPACEY],
            paint[PAINT_GRIDLINEWIDTHHORIZONTAL],
            paint[PAINT_GRIDLINEWIDTHVERTICAL],
            paint[PAINT_GRIDCOLOR],
            paint[PAINT_POINTSIDLE],
            paint[PAINT_POINTSFFA],
            paint[PAINT_POINTSBLU],
            paint[PAINT_POINTSRED],
            paint[PAINT_POINTEDGEWIDTH],
            paint[PAINT_CRATESHOWHPMODE],
            paint[PAINT_CRATESQUARE],
            paint[PAINT_CRATELONG],
            paint[PAINT_CRATEUSER],
            paint[PAINT_CRATEPREMIUM],
            paint[PAINT_CRATECORPSE],
            paint[PAINT_PRESETS]
        ],[
            multiBox[MULTIBOX_SELECTEDSOCKET],
            multiBox[MULTIBOX_SPAWNCLONE],
            multiBox[MULTIBOX_INSTANTRESPAWN]
        ]
    ]));
},

loadSettings = () => {
    let data = JSON.parse(localStorage.getItem('TioHax_settings') || '{}'),
        stuffToLoad = [
            [friends
            ],
            [targets
            ],
            [autoUpgrades
            ],
            [aimbot,
                AIMBOT_ENABLE + AIMBOT_AIMSMOOTHING + AIMBOT_CURSORMODE + AIMBOT_USEACCELERATION +
                AIMBOT_IGNORECHATTING + AIMBOT_PINGCOMPENSATION + AIMBOT_TRIGGERBOT + AIMBOT_WALLCHECK +
                AIMBOT_USEAHEAD + AIMBOT_DISABLEWHENDASHING + AIMBOT_CURSORPROXCOSENESS + AIMBOT_TARGETMODE +
                AIMBOT_TRIGGERBOTWHENDOWN + AIMBOT_RIGHTCLICKFRIEND + AIMBOT_AUXCLICKTARGET + AIMBOT_TARGETSONLY +
                AIMBOT_AVOIDFRIENDS + AIMBOT_AHEADNESSDEPTH + AIMBOT_LEADERMODE
            ],
            [esp,
                ESP_ZOOM + ESP_FIXCAMERA + ESP_TRACERSBODYENEMY + ESP_TRACERSCURSORENEMY +
                ESP_TRACERSWALLCHECK + ESP_TRACERSGUN + ESP_TRACERSGRENADES + ESP_SHOWINVIS +
                ESP_REVEALTEAMS + ESP_SHOWHEALTH + ESP_SHOWARMOR + ESP_SHOWMAGS +
                ESP_SHOWGUNRELOADSTATUS + ESP_CAMUSEREALPOSITION + ESP_INCLUDEYOU + ESP_SHOWRANGE +
                ESP_SCROLLSENSITIVITY],
            [chatSpam,
                CHATSPAMMER_TEXT + CHATSPAMMER_WIDTH + CHATSPAMMER_INTERVAL + CHATSPAMMER_DIRECTION +
                CHATSPAMMER_SEPERATOR + CHATSPAMMER_PREFIX + CHATSPAMMER_SUFFIX
            ],
            [antiAim,
                ANTIAIM_RELOAD + ANTIAIM_SHOOT + ANTIAIM_IDLE + ANTIAIM_ANGLESTART +
                ANTIAIM_ANGLERANGE + ANTIAIM_SPINSPEED + ANTIAIM_DELAY + ANTIAIM_DRAWREALAIM
            ],
            [instantchat,
                INSTANTCHAT_CHATBINDS + INSTANTCHAT_CHATBINDSTEXTS + INSTANTCHAT_ONKILL + INSTANTCHAT_ONKILLTEXT +
                INSTANTCHAT_ONDEATH + INSTANTCHAT_ONDEATHTEXT + INSTANTCHAT_AUTOTHANK + INSTANTCHAT_AUTOTHANKTEXT
            ],
            [misc,
                MISC_AUTORELOAD + MISC_PINGDISPLAY + MISC_RENDERDISPLAY + MISC_STATICHUD +
                MISC_STATICHEALTH + MISC_DISABLECLOSEPOPUP + MISC_BETTERCRATEHP + MISC_HIDECHATTING +
                MISC_FFACLANDISPLAY + MISC_SHOWFEATURES + MISC_POSITION + MISC_LEADERBOARDBADGES
            ],
            [advanced,
                ADVANCED_PINGCOUNT + ADVANCED_AIMCONSTANT + ADVANCED_OPTIMISEWALLCHECK + ADVANCED_TPS +
                ADVANCED_PINGCOMP
            ],
            [thnet,
                THNET_ENABLE + THNET_CHAT + THNET_DONATE + THNET_INFOSHARE
            ],
            [muted
            ],
            [perkHacks,
                PERKHACKS_KNIFE + PERKHACKS_KNIFEMAXRANGE + PERKHACKS_SHIELD + PERKHACKS_SHIELDUPKEEP +
                PERKHACKS_SHIELDMANUAL + PERKHACKS_CRATEPLACEVISION + PERKHACKS_SHIELDLOOKAHEAD + PERKHACKS_MEDKITSELFHEAL +
                PERKHACKS_MEDKITSELFHEALTHRESHOLD + PERKHACKS_SHIELDVISUALISER + PERKHACKS_SHIELDWALLCHECK
            ],
            [discordRPC,
                DISCORDRPC_ENABLED + DISCORDRPC_STATE + DISCORDRPC_DETAILS + DISCORDRPC_UPDATEINTERVAL
            ],
            [paint,
                PAINT_GRIDSPACEX + PAINT_GRIDSPACEY + PAINT_GRIDLINEWIDTHHORIZONTAL + PAINT_GRIDLINEWIDTHVERTICAL +
                PAINT_GRIDCOLOR + PAINT_POINTSIDLE + PAINT_POINTSFFA + PAINT_POINTSBLU +
                PAINT_POINTSRED + PAINT_POINTEDGEWIDTH + PAINT_CRATESHOWHPMODE + PAINT_CRATESQUARE +
                PAINT_CRATELONG + PAINT_CRATEUSER + PAINT_CRATEPREMIUM + PAINT_CRATECORPSE +
                PAINT_PRESETS
            ],
            [multiBox,
                MULTIBOX_SELECTEDSOCKET + MULTIBOX_SPAWNCLONE + MULTIBOX_INSTANTRESPAWN
            ]
        ];
    for (let i = 0; i < stuffToLoad.length; i++) if (undefVar != data[i]) {
        let renameThisLater = stuffToLoad[i],
            [settingStorageObject, keystring] = renameThisLater;
        if (keystring) {
            for (let j = 0; j < keystring.length; j++) {
                if (undefVar == data[i][j]) continue;
                settingStorageObject[keystring[j]] = data[i][j];
            }
        } else {
            settingStorageObject.length = 0; //this clears arrays because then the array class forgets that there were elements in it
            settingStorageObject.push(...data[i]);
        }
    }
},

drawLineWrap = (x1, y1, x2, y2, w, c) => {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
},

drawLine = (start, entity, offset, width, color) => drawLineWrap(
    start.x, start.y,
    entity.x + offset.x, entity.y + offset.y,
    width,
    color || getColor(entity)
),

drawLine2 = (entity, end, offset, width, color) => drawLineWrap(
    entity.x + offset.x,
    entity.y + offset.y,
    entity.x + offset.x + end.x,
    entity.y + offset.y + end.y,
    width,
    color || getColor(entity)
),

drawCircle = (entity, offset, radius, width, color) => {
    ctx.strokeStyle = color || getColor(entity);
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(entity.x + offset.x + radius, entity.y + offset.y);
    ctx.arc(entity.x + offset.x, entity.y + offset.y, radius, 0, TAU);
    ctx.stroke();
},

drawCircle2 = (entity, offset, radius, width, color) => {
    for (let i = 0; i < 3; i++) {
        ctx.globalAlpha /= 2;
        drawCircle(entity, offset, radius - width * i, width, color);
    }
},

//text drawer wrapper
drawText = (x, y, text, color) => {
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.fillText(text, x, y);
    ctx.strokeText(text, x, y);
},

CLLonSegment = (p0, p1, q0, q1, r0, r1) => q0 <= max(p0, r0) && q0 >= min(p0, r0) && q1 <= max(p1, r1) && q1 >= min(p1, r1),

CLLorientation = (p0, p1, q0, q1, r0, r1) => {

    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
    // for details of below formula.
    let v = (q1 - p1) * (r0 - q0) - (q0 - p0) * (r1 - q1);

    return !v ? 0 : // collinear
            v > 0 ? 1 : 2; // clock or counterclock wise
},

collisionLineLine = (p10, p11, q10, q11, p20, p21, q20, q21) => {

    // Find the four orientations needed for general and
    // special cases
    let o1 = CLLorientation(p10, p11, q10, q11, p20, p21),
        o2 = CLLorientation(p10, p11, q10, q11, q20, q21),
        o3 = CLLorientation(p20, p21, q20, q21, p10, p11),
        o4 = CLLorientation(p20, p21, q20, q21, q10, q11);
    
    // General case
    if (o1 != o2 && o3 != o4) return 1;
    
    // Special Cases
    return (
        (o1 == 0 && CLLonSegment(p10, p11, p20, p21, q10, q11)) ||
        (o2 == 0 && CLLonSegment(p10, p11, q20, q21, q10, q11)) ||
        (o3 == 0 && CLLonSegment(p20, p21, p10, p11, q20, q21)) ||
        (o4 == 0 && CLLonSegment(p20, p21, q10, q11, q20, q21))
    );
},

// https://stackoverflow.com/a/1968345/10793061 but a comment by the god called cortijon
intersectionPointLineLine = (p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) => {
    let s1_x = p1_x - p0_x,
        s1_y = p1_y - p0_y,
        s2_x = p3_x - p2_x,
        s2_y = p3_y - p2_y,
        s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y),
        t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        return {
            x: p0_x + t * s1_x,
            y: p0_y + t * s1_y
        };
    }
},

distanceSquaredBetweenPoints = (Ax, Ay, Bx, By) => (Ax - Bx) ** 2 + (Ay - By) ** 2,

//https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
distanceSquaredLinePoint = (Ax, Ay, Bx, By, Cx, Cy) => {
    if (Ax === Bx && Ay === By) return distanceSquaredBetweenPoints(Cx, Cy, Ax, Ay);
    let t = max(0, min(1, ((Cx - Ax) * (Bx - Ax) + (Cy - Ay) * (By - Ay)) / distanceSquaredBetweenPoints(Cx, Cy, Ax, Ay)));
    return distanceSquaredBetweenPoints(Cx, Cy, Ax + t * (Bx - Ax), Ay + t * (By - Ay));
},

upgradePerk = (socketId, upgrade, upgradeLevel) => {
    o3[upgradeLevel] = upgrade;
    RF.list[socketId].send(a59('upgrade', {upgrade, upgradeLevel}));
    c8[upgradeLevel] = 0;
},

autoUpgrade = (socketId, me) => {
    if ((me.score >= c33 || c10 >= 1) && !o3[1] && autoUpgrades[1]) upgradePerk(socketId, autoUpgrades[1], 1);
    if ((me.score >= c34 || c10 >= 2) && !o3[2] && autoUpgrades[2]) upgradePerk(socketId, autoUpgrades[2], 2);
    if ((me.score >= c35 || c10 >= 3) && !o3[3] && autoUpgrades[3]) upgradePerk(socketId, autoUpgrades[3], 3);
},

/*gets the color of an enemy by its team affiliation
    -FFA player colors-
    red: {a: '#f26740', b: '#fcd9cf'}
    orange: {a: '#f6803c', b: '#fddfce'}
    yellow: {a: '#fff133', b: '#fffccc'}
    green: {a: '#92cd8b', b: '#ddf0db'}
    blue: {a: '#8dd8f8', b: '#cfeefc'}
    pink: {a: '#f7b0c2', b: '#fde8ed'}
 */
getColor = entity => {
    //fix for FFA
    if (entity.ownerId && !entity.teamCode) return RD.pool[c3].id == entity.ownerId ? 'green' : 'red';

    return entity.teamCode == 2 ? 'blue' : entity.teamCode == 1 ? 'red' : {
        '#f26740': 'red',
        '#f6803c': 'orange',
        '#fff133': 'yellow',
        '#92cd8b': 'green', 
        '#8dd8f8': 'blue',
        '#f7b0c2': 'hotpink'
    }[entity.color.a];
},

//either add them or remove them from the friends list depending on if they are already in it or not
toggleUsernameInlist = (list, username) => {
    username = sanitiseName(username);
    let index = indexOfInArray(list, username);

    //if the player doesnt exist in the list, add them
    if (index == -1) {
        list.push(username);

    //if the player does exist, delete them from the list
    } else if (index == list.length - 1){
        list.pop();
    } else {
        list[index] = list.pop();
    }

    saveSettings();
},

applyAttrbutes = (object, attributes) => {
    for (let key in attributes) object[key] = attributes[key];
    return object;
},

applyStyle = (element, style) => applyAttrbutes(element.style, style),

make = (type, style = {}, attributes = {}, babies = []) => {
    let element = document.createElement(type);
    applyStyle(element, style);
    applyAttrbutes(element, attributes);
    for (let baby of babies) element.append(baby);
    return element;
},

//note: elements cannot be placed at two places at once
dupeImg = img => {
    let element = make('canvas', {
        [css_key_width]: css_value_length_perc100,
        [css_key_height]: css_value_length_perc100
    }, {
        [css_key_width]: img.width,
        [css_key_height]: img.height
    });
    element.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    return element;
},

//if a menu requires a canvas for whatever reason
//this function would later be re-defined in a menu
updateMenuCanvas = () => {},

stopChatScrolling = () => {
    //surprisingly, clearTimeout doesn't throw an error if the argument is zero...
    clearTimeout(chatSpam[CHATSPAMMER_TIMEOUT]);
    chatSpam[CHATSPAMMER_TIMEOUT] = 0;
},

startChatScrolling = socketId => {
    stopChatScrolling();
    let chatSpamLoop = () => {
        let text = chatSpam[CHATSPAMMER_TEXT] + chatSpam[CHATSPAMMER_SEPERATOR],
            index = chatSpam[CHATSPAMMER_INDEX],
            width = chatSpam[CHATSPAMMER_WIDTH] - (chatSpam[CHATSPAMMER_PREFIX].length + chatSpam[CHATSPAMMER_SUFFIX].length),
            msg = text.length ? '' : ' ',
            pad = ' '.repeat(chatSpam[CHATSPAMMER_VARIATION]);

        if (!msg) for (let i = 0; i < width; i++) msg += text[(index + i) % text.length];
        //the padding exists because the game kicks you for sending messages with the same length often
        sendChatMessage(socketId, pad + chatSpam[CHATSPAMMER_PREFIX] + msg + chatSpam[CHATSPAMMER_SUFFIX] + pad, 1);

        chatSpam[CHATSPAMMER_INDEX] = (index + chatSpam[CHATSPAMMER_DIRECTION] + text.length) % text.length;
        chatSpam[CHATSPAMMER_VARIATION] = (chatSpam[CHATSPAMMER_VARIATION] + 1) % 3;
        chatSpam[CHATSPAMMER_TIMEOUT] = setTimeout(chatSpamLoop, chatSpam[CHATSPAMMER_INTERVAL]);
    };
    chatSpamLoop();
},

pauseChatScrolling = socketId => {
    if (!chatSpam[CHATSPAMMER_TIMEOUT]) return;
    stopChatScrolling(socketId);
    //to not conflict if this function was called another time
    let localRandom = random();
    chatBoxRandom = localRandom;
    setTimeout(() => chatBoxRandom == localRandom && startChatScrolling(socketId), chatSpam[CHATSPAMMER_PAUSEPERIOD]);
},

removeChildren = element => {
    while (element.hasChildNodes()) element.removeChild(element.lastChild);
},

checkScrollable = (bool, element, style) => {
    bool = divs.content.scrollHeight > divs.content.clientHeight;
    element = divs.content.lastChild;
    style = element.style;
    applyStyle(element, {
        [css_key_borderBottom]: bool ? css_value_length_px0 : css_value_border_2px000f,
        [css_key_height]: (pInt(style.height) - (4 - 2 * pInt(style.borderBottom || style.border))) + 'px'
    });
},

loadLocalisationFile = fileStr => {
    loadedLocalisation = {};
    let entries = fileStr.split('\n');
    for (let i = 0; i < entries.length; i++) {
        let entry = entries[i],
            index = indexOfInArray(entry, '=');
        if (index == -1) continue;
        let key = entry.slice(0, index),
            value = entry.slice(index + 1, entry.length);
        loadedLocalisation[key] = value;
    }
},

getLocal = localisationEntry => loadedLocalisation[localisationEntry] ?? localisationEntry,

createControlBase = (label, controlSetting) => label && make('div', {
    [css_key_width]: css_value_length_perc100,
    [css_key_height]: css_value_length_px40,
    [css_key_display]: css_value_misc_flex,
    [css_key_alignItems]: css_value_misc_center,
    [css_key_paddingLeft]: css_value_length_px5,
    [css_key_paddingRight]: css_value_length_px5,
    [css_key_borderBottom]: css_value_border_2px000f,
    [css_key_paddingBottom]: css_value_length_px0,
    [css_key_justifyContent]: css_value_misc_spaceBetween
 }, {
    title: getLocal(label[1])
}, [
    make('div', {}, {
        innerText: getLocal(label[0])
    }),
    controlSetting
]),

createControlButton = (label, doThing) => {
    return createControlBase(label, make('div', {
        [css_key_width]: css_value_length_px45,
        [css_key_height]: css_value_length_px30,
        [css_key_border]: css_value_border_4pxffff,
        [css_key_position]: css_value_misc_relative,
        [css_key_borderRadius]: css_value_length_px7,
        [css_key_backgroundColor]: css_value_color_33dc
    }, {
        onclick: () => {
            saveSettings();
            doThing();
        }
    }));
},

createControlToggle = (label, toggle, render) => {
    let controlButtonDiv = make('div', {
        [css_key_width]: css_value_length_px60,
        [css_key_height]: css_value_length_px30,
        [css_key_border]: css_value_border_4pxffff,
        [css_key_display]: css_value_misc_flex,
        [css_key_position]: css_value_misc_relative,
        [css_key_alignItems]: css_value_misc_center,
        [css_key_borderRadius]: css_value_length_px7,
        [css_key_justifyContent]: css_value_misc_center
    }, {
        onclick: () => {
            toggle();
            controlButtonDiv[ATTRIBUTE_UPDATE]();
            saveSettings();
        },
        [ATTRIBUTE_UPDATE]: () => {
            let bool = render();
            controlButtonDiv.innerText = bool ? 'On' : 'Off';
            applyStyle(controlButtonDiv, {
                [css_key_backgroundColor]: bool ? css_value_color_0f0c : css_value_color_f00c
            });
        }
    });
    controlButtonDiv[ATTRIBUTE_UPDATE]();
    renderFunctions.push(controlButtonDiv[ATTRIBUTE_UPDATE]);
    return createControlBase(label, controlButtonDiv);
},

createControlValue = (label, update, render) => {
    let style = {
        [css_key_width]: css_value_length_px30,
        [css_key_height]: css_value_length_px30,
        [css_key_border]: css_value_border_3pxffff,
        [css_key_display]: css_value_misc_flex,
        [css_key_position]: css_value_misc_relative,
        [css_key_fontWeight]: css_value_misc_bold,
        [css_key_alignItems]: css_value_misc_center,
        [css_key_borderRadius]: css_value_length_px5,
        [css_key_justifyContent]: css_value_misc_center,
        [css_key_backgroundColor]: css_value_color_ff0c
    },
    controlIndicatorDiv = make('div', {
        [css_key_color]: css_value_color_000f,
        [css_key_width]: css_value_length_px60,
        [css_key_height]: css_value_length_px34,
        [css_key_border]: css_value_border_4pxffff,
        [css_key_display]: css_value_misc_flex,
        [css_key_position]: css_value_misc_relative,
        [css_key_alignItems]: css_value_misc_center,
        [css_key_marginLeft]: css_value_length_px5,
        [css_key_marginRight]: css_value_length_px5,
        [css_key_borderRadius]: css_value_length_px5,
        [css_key_justifyContent]: css_value_misc_center,
        [css_key_backgroundColor]: css_value_color_fffc
    }, {
        //type: css_value_misc_text,
        //maxlength: 64,
        //onfocus: () => textBoxFocused = 1,
        //onblur: () => textBoxFocused = 0,
        //value: render(),
        //oninput: () => {
        //    update(editAutoTextInput.value);
        //    controlIndicatorDiv[ATTRIBUTE_UPDATE]();
        //    saveSettings();
        //},
        onwheel: E => {
            E.preventDefault();
            update(sign(-E.deltaY));
            controlIndicatorDiv[ATTRIBUTE_UPDATE](1);
        },
        [ATTRIBUTE_UPDATE]: shouldSave => {
            controlIndicatorDiv.innerText = render();
            if (shouldSave) saveSettings();
        }
    }),
    controlButtonLeftDiv = make('div', style, {
        innerText: '-',
        onclick: () => {
            update(-1);
            controlIndicatorDiv[ATTRIBUTE_UPDATE](1);
        }
    }),
    controlButtonRightDiv = make('div', style, {
        innerText: '+',
        onclick: () => {
            update(1);
            controlIndicatorDiv[ATTRIBUTE_UPDATE](1);
        }
    });
    controlIndicatorDiv[ATTRIBUTE_UPDATE]();
    renderFunctions.push(controlIndicatorDiv[ATTRIBUTE_UPDATE]);
    return createControlBase(label, make('div', {
        [css_key_display]: css_value_misc_flex,
        [css_key_alignItems]: css_value_misc_center,
        [css_key_flexDirection]: css_value_misc_row
    }, {}, [controlButtonLeftDiv, controlIndicatorDiv, controlButtonRightDiv]));
},

createControlText = (label, update, render) => {
    let editAutoTextInput = make('input', {
        [css_key_color]: css_value_color_000f,
        [css_key_width]: css_value_length_perc100,
        [css_key_height]: css_value_length_px34,
        [css_key_border]: css_value_border_4pxffff,
        [css_key_display]: css_value_misc_flex,
        [css_key_position]: css_value_misc_relative,
        [css_key_alignItems]: css_value_misc_center,
        [css_key_borderRadius]: css_value_length_px5,
        [css_key_justifyContent]: css_value_misc_center,
        [css_key_backgroundColor]: css_value_color_fffc
    }, {
        type: css_value_misc_text,
        maxlength: 64,
        onfocus: () => textBoxFocused = 1,
        onblur: () => textBoxFocused = 0,
        oninput: () => {
            update(editAutoTextInput.value);
            editAutoTextInput.value = render();
            saveSettings();
        },
        value: render()
    });
    renderFunctions.push(() => editAutoTextInput.value = render());
    return make('div', {
        [css_key_width]: css_value_length_perc100,
        [css_key_padding]: css_value_length_px5,
        [css_key_paddingTop]: css_value_length_px0,
        [css_key_borderBottom]: css_value_border_2px000f,
        [css_key_paddingBottom]: css_value_length_px0,
        [css_key_justifyContent]: css_value_misc_spaceBetween,
        [css_key_height]: css_value_length_px80
    }, {
        title: getLocal(label[1])
    }, [
        make('div', {
            [css_key_width]: css_value_length_perc100,
            [css_key_display]: css_value_misc_flex,
            [css_key_padding]: css_value_length_px5,
            [css_key_justifyContent]: css_value_misc_spaceBetween,
            [css_key_height]: css_value_length_px40
        }, {
            innerText: getLocal(label[0])
        }),
        editAutoTextInput
    ]);
},

createControlDropdown = (label, options, update, render) => {
    let longest = 0;
    for (let optionValue in options) if (options[optionValue][0].length > longest) longest = options[optionValue][0].length;
    longest = (longest + 4.5) + 'ch';

    let i = render(),
        optionCount = Object.keys(options).length;
    if (!options[i]) update(i = 0);
    let controlOptionsDiv = make('div', {
        [css_key_width]: longest,
        [css_key_maxWidth]: longest,
        [css_key_border]: css_value_border_4pxffff,
        [css_key_display]: css_value_misc_flex,
        [css_key_borderRadius]: css_value_length_px7,
        [css_key_paddingRight]: css_value_length_px10,
        [css_key_justifyContent]: css_value_misc_flexEnd,
        [css_key_backgroundColor]: css_value_color_80f8,
        [css_key_zIndex]: css_value_10
    }, {
        hidden: 1,
        onclick: () => {
            update(++i % optionCount);
            controlOptionsDiv[ATTRIBUTE_UPDATE]();
        },
        [ATTRIBUTE_UPDATE]: () => applyAttrbutes(controlOptionsDiv, {
            innerText: getLocal(options[render()][0]) + ' ▼',
            title: getLocal(options[render()][1])
        })
    });

    controlOptionsDiv[ATTRIBUTE_UPDATE]();
    renderFunctions.push(controlOptionsDiv[ATTRIBUTE_UPDATE]);
    return createControlBase(label, controlOptionsDiv);
},

createControlColor = (label, color) => {
    let style = {
    }, opts = [];
    for (let i in color) {
        let colorControl = make('input', applyAttrbutes(style, {
            [css_key_width]: css_value_length_px26,
            [css_key_height]: css_value_length_px26,
            [css_key_borderRadius]: css_value_length_px7,
            [css_key_border]: css_value_border_1px000f,
            [css_key_padding]: css_value_length_px0,
            [css_key_outline]: css_value_border_4pxffff,
            [css_key_marginLeft]: css_value_length_px7,
            [css_key_marginRight]: css_value_length_px5
        }), {
            type: 'color',
            value: color[i],
            oninput: () => {
                color[i] = opts[i].value;
                saveSettings();
                opts[i][ATTRIBUTE_UPDATE]();
            },
            [ATTRIBUTE_UPDATE]: () => applyStyle(colorControl, { [css_key_backgroundColor]: colorControl.value = color[i] })
        });
        if (!color[i]) {
            colorControl.value = '#ffffff';
            colorControl.oninput();
        }
        colorControl[ATTRIBUTE_UPDATE]();
        opts[i] = colorControl;
    }
    return createControlBase(label, make('div', {
        [css_key_display]: css_value_misc_flex
    }, {}, opts));
},

createMenuDropdown = (label, subcontrols) => {
    let controlNameDiv = make('div', {
        [css_key_display]: css_value_misc_flex
    }, {
        innerText: getLocal(label[0])
    }),
    controlButtonDiv = make('div', {
        [css_key_width]: css_value_length_px45,
        [css_key_height]: css_value_length_px30,
        [css_key_border]: css_value_border_4pxffff,
        [css_key_display]: css_value_misc_flex,
        [css_key_position]: css_value_misc_relative,
        [css_key_alignItems]: css_value_misc_center,
        [css_key_borderRadius]: css_value_length_px7,
        [css_key_justifyContent]: css_value_misc_center,
        [css_key_backgroundColor]: css_value_color_888f
    }, {
        innerText: '▼',
        onclick: () => checkScrollable(controlButtonDiv.innerText = (subcontrolsDiv.hidden = !subcontrolsDiv.hidden) ? '▼' : '▲')
    }),
    controlDiv = make('div', {
        [css_key_width]: css_value_length_perc100,
        [css_key_padding]: css_value_length_px5,
        [css_key_display]: css_value_misc_flex,
        [css_key_paddingBottom]: css_value_length_px0,
        [css_key_justifyContent]: css_value_misc_spaceBetween,
        [css_key_backgroundColor]: css_value_color_6666,
        [css_key_height]: css_value_length_px40
    }, {
        title: getLocal(label[1])
    }, [controlNameDiv, controlButtonDiv]),
    subcontrolsDiv = make('div', {
        [css_key_borderTop]: css_value_border_2px000f,
        [css_key_borderLeft]: css_value_border_4px000f,
        [css_key_borderBottom]: css_value_border_4px000f
    }, { hidden: 1 }, subcontrols);
    return make('div', {
        [css_key_borderBottom]: css_value_border_2px000f
    }, {}, [controlDiv, subcontrolsDiv]);
},

refreshMenu = menuID => {
    idRefreshMenu = 0;
    updateMenuCanvas = () => {};
    renderFunctions = [];
    removeChildren(divs.content);
    menus[menuID][1](x=>divs.content.append(x));
    checkScrollable();
},

createWindow = (fullWidth, contentHeight, mainTitleLabel, minifyLabelTitle, backbuttonLabelTitle) => {
    let movableWindow = {},
        title, content, backbutton,
    menu = make('div', {
        [css_key_width]: "number" == typeof fullWidth ? fullWidth + 'px' : fullWidth,
        [css_key_height]: css_value_length_minContent,
        [css_key_color]: css_value_color_ffff,
        [css_key_border]: css_value_border_2px000f,
        [css_key_borderRadius]: css_value_length_px5,
        [css_key_zIndex]: highestZIndex++,
        [css_key_position]: css_value_misc_absolute,
        [css_key_fontSize]: css_value_length_px20,
        [css_key_fontFamily]: css_value_misc_Consolas,
        [css_key_userSelect]: css_value_misc_none
    }, {
        hidden: 1
    }, [
        title = make('div', {
            [css_key_width]: css_value_length_perc100,
            [css_key_height]: css_value_length_px43,
            [css_key_border]: css_value_border_2px000f,
            [css_key_padding]: css_value_length_px5,
            [css_key_display]: css_value_misc_flex,
            [css_key_whiteSpace]: css_value_misc_preWrap,
            [css_key_justifyContent]: css_value_misc_spaceBetween,
            [css_key_backgroundImage]: css_value_gradient_redblue
        }, {
            innerText: mainTitleLabel,
            onmousedown: e => {
                let style = menu.style;
                style[css_key_zIndex] = highestZIndex++;
                if (style[css_key_right]) {
                    style[css_key_left] = (window.innerWidth - (pInt(style[css_key_right]) + pInt(style[css_key_width]))) + 'px';
                    style[css_key_right] = '';
                }
                movableWindow.offsetX = e.clientX - pInt(style[css_key_left]);
                movableWindow.offsetY = e.clientY - pInt(style[css_key_top]);
                movableWindow.enable = 1;
            },
            onmouseup: () => movableWindow.enable = 0
        }, [
            make('div', {
                [css_key_color]: css_value_color_000f,
                [css_key_width]: css_value_length_px28,
                [css_key_height]: css_value_length_px28,
                [css_key_border]: css_value_border_35px000f,
                [css_key_display]: css_value_misc_flex,
                [css_key_fontWeight]: css_value_misc_bold,
                [css_key_alignItems]: css_value_misc_center,
                [css_key_paddingTop]: css_value_length_pxNeg5,
                [css_key_borderRadius]: css_value_length_px10,
                [css_key_justifyContent]: css_value_misc_center,
                [css_key_backgroundColor]: css_value_color_fff8
            }, {
                title: getLocal(minifyLabelTitle),
                innerText: '_',
                onclick: () => divs.menu.hidden = 1
            })
        ]),
        content = make('div', {
            [css_key_width]: css_value_length_perc100,
            [css_key_height]: "number" == typeof contentHeight ? contentHeight + 'px' : contentHeight,
            [css_key_border]: css_value_border_2px000f,
            [css_key_overflowY]: css_value_misc_scroll,
            [css_key_borderTop]: css_value_border_2px000f,
            [css_key_borderLeft]: css_value_border_2px000f,
            [css_key_backgroundColor]: css_value_color_000c
        })
    ]);

    if (backbuttonLabelTitle) {
        backbutton = make('div', {
            [css_key_color]: css_value_color_000f,
            [css_key_width]: css_value_length_px28,
            [css_key_height]: css_value_length_px28,
            [css_key_border]: css_value_border_35px000f,
            [css_key_display]: css_value_misc_flex,
            [css_key_alignItems]: css_value_misc_center,
            [css_key_justifyContent]: css_value_misc_center,
            [css_key_backgroundColor]: css_value_color_fff8,
            [css_key_borderRadius]: css_value_length_px10
        }, {
            title: getLocal(backbuttonLabelTitle),
            innerText: '<',
            onclick: () => refreshMenu(0)
        });

        title.prepend(backbutton);
    }
    movableWindow.element = menu;
    movableWindows.push(movableWindow);

    return [menu, title, content, backbutton];
},

createMenu = () => {
    //custom scrollbar
    //i wish there were a better way...
    let windowElements = createWindow(350, 522, menuLabel[3], menuLabel[0], menuLabel[1]),
        someText = '}::-webkit-scrollbar';
    windowElements[0].hidden = 0;
    document.head.append(make('style', {}, {
        textContent:
            'img{'+
                css_key_width      + ':' + css_value_length_perc100 + ';' +
                css_key_height     + ':' + css_value_length_perc100 +
            someText + '{'+
                css_key_width      + ':' + css_value_length_px16 +
            someText + '-track{'+
                css_key_background + ':' + css_value_color_000f + ';'+
                'border-left:' + css_value_border_4px000f +
            someText + '-thumb{'+
                css_key_background + ':' + css_value_color_666f + ';'+
                'border-left:' + css_value_border_4px000f +
            someText + '-thumb:hover{'+
                css_key_background + ':' + css_value_color_888f +
            '}'
    }));


    divs.menu = windowElements[0];
    divs.title = windowElements[1];
    divs.content = windowElements[2];
    divs.backbutton = windowElements[3];

    // if (isUserscript) divs.menu.append(make('div', {
    //     [css_key_color]: css_value_color_000f,
    //     [css_key_width]: css_value_length_perc100,
    //     [css_key_border]: css_value_border_2px000f,
    //     [css_key_alignItems]: css_value_misc_center,
    //     [css_key_paddingLeft]: css_value_length_px5,
    //     [css_key_justifyContent]: css_value_misc_center,
    //     [css_key_backgroundImage]: css_value_gradient_gray
    // }, {
    //     onclick: () => window.open('http' + homeUrl, '_blank').focus(),
    //     innerHTML: 'You are using:<br><b style="color:red">TioHax Userscript Edition</b><br><span style="color:blue">Click here to get the standalone version!<br></span><span style="fontSize: 14px">(It gets frequently updated)<span>'
    // }));

    document.body.append(divs.menu);
    refreshMenu(0);
    createChatbox();

    applyStyle(divs.menu, { [css_key_left]: css_value_length_px5 });
    setTimeout(applyStyle(divs.menu, { [css_key_top]: floor(window.innerHeight - pInt(divs.content.style[css_key_height])) / 2 + 'px' }));
},

createChatbox = () => {
    let thnetChatWindow = createWindow(300, 294, menuLabel[4], menuLabel[2]);
    divs.chatinput = make('input', {
        [css_key_color]: css_value_color_000f,
        [css_key_width]: css_value_length_perc100,
        [css_key_height]: css_value_length_px34,
        [css_key_border]: css_value_border_4pxffff,
        [css_key_display]: css_value_misc_flex,
        [css_key_position]: css_value_misc_relative,
        [css_key_alignItems]: css_value_misc_center,
        [css_key_borderRadius]: css_value_length_px5,
        [css_key_justifyContent]: css_value_misc_center,
        [css_key_backgroundColor]: css_value_color_fffc
    }, {
        type: css_value_misc_text,
        maxlength: 128,
        onfocus: () => textBoxFocused = 1,
        onblur: () => textBoxFocused = 0,
        onchange: () => {
            thnet[THNET_SOCKET]?.send('0 ' + divs.chatinput.value);
            divs.chatinput.value = '';
            divs.chatinput.blur();
        },
        value: ''
    });

    thnetChatWindow[2].append(divs.chatbox = make('div', {
        [css_key_width]: css_value_length_perc100,
        [css_key_height]: css_value_length_px250,
        [css_key_border]: css_value_border_2px000f,
        [css_key_fontSize]: css_value_length_px14,
        [css_key_overflowY]: css_value_misc_scroll,
        [css_key_borderTop]: css_value_border_2px000f,
        [css_key_userSelect]: css_value_misc_text,
        [css_key_borderLeft]: css_value_border_2px000f,
    }));
    thnetChatWindow[2].append(make('div', {
        [css_key_width]: css_value_length_perc100,
        [css_key_display]: css_value_misc_flex,
        [css_key_padding]: css_value_length_px5,
        [css_key_paddingTop]: css_value_length_px2,
        [css_key_paddingBottom]: css_value_length_px0,
        [css_key_justifyContent]: css_value_misc_spaceBetween,
        [css_key_height]: css_value_length_px40
    }, {}, [ divs.chatinput ]))
    document.body.append(divs.chatwrap = thnetChatWindow[0]);

    applyStyle(thnetChatWindow[2], { [css_key_overflowY]: '' });
    applyStyle(divs.chatwrap, { [css_key_left]: '', [css_key_right]: css_value_length_px5 });
    setTimeout(applyStyle(divs.chatwrap, { [css_key_top]: (window.innerHeight - pInt(divs.chatbox.style[css_key_height])) / 2 + 'px' }));
},

fixWindowPositions = () => {
    for (let movableWindow of movableWindows) {
        let element = movableWindow.element,
            rect = element.getBoundingClientRect(),
            style = element.style;
        if (!style[css_key_right]) {
            applyStyle(element, {
                [css_key_left]: max(0, min(window.innerWidth - rect[css_key_width], pInt(style[css_key_left]))) + 'px',
                [css_key_top]: max(0, min(window.innerHeight - rect[css_key_height], pInt(style[css_key_top]))) + 'px'
            });
        }
    }
},

refreshMenuSelect = append => {
    for (let i in menus) {
        if (pInt(i)) {
            let menuDiv = make('div', {
                [css_key_width]: css_value_length_perc100,
                [css_key_padding]: css_value_length_px5,
                [css_key_alignItems]: css_value_misc_center,
                [css_key_borderBottom]: css_value_border_2px000f,
                [css_key_justifyContent]: css_value_misc_center,
                [css_key_backgroundColor]: css_value_color_8888,
                [css_key_height]: menus.length - 1 == i ? css_value_length_px38 : css_value_length_px40
            }, {
                innerText: getLocal(menus[i][0]),
                onmouseover: () => menuDiv.style[css_key_backgroundColor] = css_value_color_888c,
                onmouseout: () => menuDiv.style[css_key_backgroundColor] = css_value_color_8888,
                onclick: () => refreshMenu(pInt(i)),
            });

            append(menuDiv);
        }
    }
},

//PEOPLE STILL DONT READ THIS FOR SOME REASON
refreshMenuGuide = append => {
    //this was going to have submenus so it would be easier to navigate
    //then the cheat controls menu would have submenus aswell so it isnt just one disorganized mess
    for (let entry in guide) for (let i in guide[entry]) {
        let bool = i == 0;
        append(make('div', {
            [css_key_fontSize]: bool ? css_value_length_px30 : i & 1 ? css_value_length_px25 : css_value_length_px20,
            [css_key_borderTop]: (bool && entry * 1) ? css_value_border_4px000f : '',
            [css_key_paddingTop]: bool ? css_value_length_px10 : '',
            [css_key_paddingLeft]: css_value_length_px5,
            [css_key_marginBottom]: bool ? css_value_length_px10 : i & 1 ? css_value_length_px15 : css_value_length_px5
        }, {
            innerText: guide[entry][i]
        }));
    }
},

refreshMenuMenu = append => {
    append(make('div', {}, {innerText: 'Coming Soon'}));
},

refreshMenuAimbot = append => {
    let dropdowns = {
        [AIMBOT_DROPDOWN_GENERAL]: AIMBOT_ENABLE + AIMBOT_AIMSMOOTHING + AIMBOT_DISABLEWHENDASHING,
        [AIMBOT_DROPDOWN_ENHANCED]: AIMBOT_USEACCELERATION + AIMBOT_PINGCOMPENSATION + AIMBOT_AHEADNESSDEPTH,
        [AIMBOT_DROPDOWN_CURSORPROX]: AIMBOT_CURSORMODE + AIMBOT_CURSORPROXCOSENESS,
        [AIMBOT_DROPDOWN_SMART]: AIMBOT_WALLCHECK + AIMBOT_USEAHEAD + AIMBOT_AVOIDFRIENDS,
        [AIMBOT_DROPDOWN_PRIORITY]: AIMBOT_RIGHTCLICKFRIEND + AIMBOT_IGNORECHATTING + AIMBOT_TARGETMODE + AIMBOT_AUXCLICKTARGET + AIMBOT_TARGETSONLY + AIMBOT_LEADERMODE,
        [AIMBOT_DROPDOWN_TRIGGERBOT]: AIMBOT_TRIGGERBOT + AIMBOT_TRIGGERBOTWHENDOWN
    };

    for (let dropdown in dropdowns) {
        let controls = [];
        for (let setting of dropdowns[dropdown]) {
            controls.push(
                setting == AIMBOT_CURSORPROXCOSENESS ?
                createControlValue(aimbotLabel[setting], i => aimbot[setting] = clamp(0, aimbot[setting] + 50 * i, 500), () => aimbot[setting]) :
                setting == AIMBOT_AHEADNESSDEPTH ?
                createControlValue(aimbotLabel[setting], i => aimbot[setting] = clamp(0, aimbot[setting] + i, 4), () => aimbot[setting] + 1) :
                createControlToggle(aimbotLabel[setting], () => aimbot[setting] = 1 - aimbot[setting], () => aimbot[setting])
            );
        }
        append(createMenuDropdown(aimbotLabel[dropdown], controls));
    }
},

refreshMenuESP = append => {
    let dropdowns = {
        [ESP_DROPDOWN_CAMERA]: ESP_ZOOM + ESP_FIXCAMERA + ESP_CAMUSEREALPOSITION + ESP_SCROLLSENSITIVITY,
        [ESP_DROPDOWN_TRACERS]: ESP_TRACERSBODYENEMY + ESP_TRACERSCURSORENEMY + ESP_TRACERSWALLCHECK + ESP_TRACERSGUN + ESP_TRACERSGRENADES,
        [ESP_DROPDOWN_PLAYERSTATS]: ESP_SHOWHEALTH + ESP_SHOWARMOR + ESP_SHOWMAGS + ESP_SHOWGUNRELOADSTATUS + ESP_SHOWRANGE + ESP_INCLUDEYOU,
        [ESP_DROPDOWN_OTHER]: ESP_SHOWINVIS + ESP_REVEALTEAMS
    };

    for (let dropdown in dropdowns) {
        let controls = [];
        for (let setting of dropdowns[dropdown]) {
            controls.push(
                setting == ESP_ZOOM ?
                createControlDropdown(espLabel[setting], controlDropdownOptions[0], i => esp[setting] = i, () => esp[setting] ) :
                setting == ESP_SCROLLSENSITIVITY ?
                createControlValue(espLabel[setting], i => esp[setting] = clamp(1, esp[setting] + i * 0.01, 2), () => round((esp[setting] - 1) * 100)) :
                createControlToggle(espLabel[setting], () => esp[setting] = 1 - esp[setting], () => esp[setting])
            );
        }
        append(createMenuDropdown(espLabel[dropdown], controls));
    }
},

refreshMenuMisc = append => {
    let dropdowns = {
        [MISC_DROPDOWN_INGAME]: MISC_AUTORELOAD + MISC_STATICHEALTH + MISC_BETTERCRATEHP + MISC_HIDECHATTING + MISC_FFACLANDISPLAY,
        [MISC_DROPDOWN_DEBUG]: MISC_PINGDISPLAY + MISC_RENDERDISPLAY + MISC_POSITION,
        [MISC_DROPDOWN_HUD]: MISC_STATICHUD + MISC_SHOWFEATURES + MISC_LEADERBOARDBADGES,
        [MISC_DROPDOWN_OTHER]: MISC_DISABLECLOSEPOPUP
    };

    for (let dropdown in dropdowns) {
        let controls = [];
        for (let setting of dropdowns[dropdown]) controls.push(
            setting == MISC_SHOWFEATURES ? 
            createControlDropdown(miscLabel[setting], controlDropdownOptions[2], i => misc[setting] = i, () => misc[setting] ) :
            createControlToggle(miscLabel[setting], () => misc[setting] = 1 - misc[setting], () => misc[setting])
        );
        append(createMenuDropdown(miscLabel[dropdown], controls));
    }
},

refreshMenuInstantchat = append => {
    for (let setting in instantchat) if (setting !== INSTANTCHAT_CHATBINDSTEXTS) {
        if (includesInArray(INSTANTCHAT_ONKILLTEXT + INSTANTCHAT_ONDEATHTEXT + INSTANTCHAT_AUTOTHANKTEXT, setting)) {
            let editAutoTextInput = make('input', {
                [css_key_color]: css_value_color_000f,
                [css_key_width]: css_value_length_perc100,
                [css_key_height]: css_value_length_px34,
                [css_key_border]: css_value_border_4pxffff,
                [css_key_display]: css_value_misc_flex,
                [css_key_position]: css_value_misc_relative,
                [css_key_alignItems]: css_value_misc_center,
                [css_key_borderRadius]: css_value_length_px5,
                [css_key_justifyContent]: css_value_misc_center,
                [css_key_backgroundColor]: css_value_color_fffc
            }, {
                type: css_value_misc_text,
                maxlength: setting === INSTANTCHAT_AUTOTHANKTEXT ? 32 : 38,
                onfocus: () => textBoxFocused = 1,
                onblur: () => textBoxFocused = 0,
                oninput: () => {
                    instantchat[setting] = editAutoTextInput.value;
                    saveSettings();
                },
                value: instantchat[setting]
            });
            append(make('div', {
                [css_key_width]: css_value_length_perc100,
                [css_key_display]: css_value_misc_flex,
                [css_key_padding]: css_value_length_px5,
                [css_key_paddingTop]: css_value_length_px0,
                [css_key_borderBottom]: css_value_border_3px000f,
                [css_key_paddingBottom]: css_value_length_px0,
                [css_key_justifyContent]: css_value_misc_spaceBetween,
                [css_key_height]: css_value_length_px40
            }, { title: instantchatLabel[setting][1] }, [editAutoTextInput]));
        } else {
            append(createControlToggle(instantchatLabel[setting], () => instantchat[setting] = 1 - instantchat[setting], () => instantchat[setting]));
        }
    }
    let editBindInput = make('input', {
        [css_key_color]: css_value_color_000f,
        [css_key_width]: css_value_length_perc100,
        [css_key_height]: css_value_length_px34,
        [css_key_border]: css_value_border_4pxffff,
        [css_key_display]: css_value_misc_flex,
        [css_key_position]: css_value_misc_relative,
        [css_key_alignItems]: css_value_misc_center,
        [css_key_borderRadius]: css_value_length_px5,
        [css_key_justifyContent]: css_value_misc_center,
        [css_key_backgroundColor]: css_value_color_fffc
    }, {
        type: css_value_misc_text,
        maxlength: 32,
        onfocus: () => textBoxFocused = 1,
        onblur: () => textBoxFocused = 0,
        oninput: () => {
            //memory leak prevention
            if (selectedKey && !(instantchat[INSTANTCHAT_CHATBINDSTEXTS][selectedKey] = editBindInput.value)) delete instantchat[INSTANTCHAT_CHATBINDSTEXTS][selectedKey];
        },
        value: ''
    }),
    editBindDiv = make('div', {
        [css_key_width]: css_value_length_perc100,
        [css_key_display]: css_value_misc_flex,
        [css_key_padding]: css_value_length_px5,
        [css_key_paddingTop]: css_value_length_px2,
        [css_key_borderBottom]: css_value_border_3px000f,
        [css_key_paddingBottom]: css_value_length_px0,
        [css_key_backgroundColor]: css_value_color_8888,
        [css_key_justifyContent]: css_value_misc_spaceBetween,
        [css_key_height]: css_value_length_px40
    }, { title: getLocal(instantchatLabel[0]) }, [editBindInput]),
    bindSelectDiv = make('div', {
        [css_key_width]: css_value_length_perc100,
        [css_key_display]: css_value_misc_grid,
        [css_key_gridTemplateColumns]: css_value_auto_10
    }), selectedBindDiv, selectedKey = 0;
    for (let validKey of [0, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 66, 67, 69, 70, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 85, 86, 88, 89, 90]) {
        let bindKeyDiv = make('div', {
            [css_key_display]: css_value_misc_flex,
            [css_key_height]: bindSelectDiv.width / 9,
            [css_key_alignItems]: css_value_misc_center,
            [css_key_justifyContent]: css_value_misc_center,
            [css_key_backgroundColor]: css_value_color_f80f
        }, {
            innerText: validKey ? ' ' + keyCodeToLetter(validKey) : ' ',
            onclick: () => {
                let oldDiv = selectedBindDiv;
                selectedBindDiv = bindKeyDiv;
                selectedKey = validKey;
                oldDiv[ATTRIBUTE_UPDATE]();
                bindKeyDiv[ATTRIBUTE_UPDATE]();
                editBindInput.value = instantchat[INSTANTCHAT_CHATBINDSTEXTS][validKey] || '';
            },
            //update
            [ATTRIBUTE_UPDATE]: () => applyStyle(bindKeyDiv, {
                [css_key_border]: css_value_length_px2 + css_value_random_solid + (selectedBindDiv === bindKeyDiv ? css_value_color_ff0f : css_value_color_000f)
            })
        });
        if (!validKey) selectedBindDiv = bindKeyDiv;
        bindKeyDiv[ATTRIBUTE_UPDATE]();
        bindSelectDiv.append(bindKeyDiv);
    }
    append(bindSelectDiv);
    append(editBindDiv);
},

refreshMenuPlayermanager = append => {
    let refreshPlayerManager = () => refreshMenu(7),
        list = [friends, targets, muted][playermanagerSelectedMenu],
        otherList = playermanagerSelectedMenu ? friends : targets,
    controlAddButton = make('div', {
        [css_key_width]: css_value_length_px50,
        [css_key_height]: css_value_length_px34,
        [css_key_color]: css_value_color_ffff,
        [css_key_border]: css_value_border_4pxffff,
        [css_key_display]: css_value_misc_flex,
        [css_key_position]: css_value_misc_relative,
        [css_key_alignItems]: css_value_misc_center,
        [css_key_justifyContent]: css_value_misc_center,
        [css_key_backgroundColor]: css_value_color_f80c
    }, {
        innerText: 'Add',
        onclick: () => {
            let name = sanitiseName(controlAddName.value);
            if (includesInArray(list, name)) return;
            if (playermanagerSelectedMenu !== 2 && includesInArray(otherList, name)) toggleUsernameInlist(otherList, name);
            saveSettings(checkScrollable(refreshPlayerManager(toggleUsernameInlist(list, name))));
        }
    }),
    controlAddName = make('input', {
        [css_key_width]: css_value_length_calcperc100,
        [css_key_height]: css_value_length_px34,
        [css_key_color]: css_value_color_000f,
        [css_key_border]: css_value_border_4pxffff,
        [css_key_display]: css_value_misc_flex,
        [css_key_marginLeft]: css_value_length_px5,
        [css_key_position]: css_value_misc_relative,
        [css_key_alignItems]: css_value_misc_center,
        [css_key_justifyContent]: css_value_misc_center,
        [css_key_backgroundColor]: css_value_color_fffc
    }, {
        type: css_value_misc_text,
        onfocus: () => textBoxFocused = 1,
        onblur: () => textBoxFocused = 0,
        oninput: () => controlAddName.value = controlAddName.value.replace(/[^0-9a-zA-Z ]/g, '').slice(0, 12),
        value: ''
    }),
    controlAdd = make('div', {
        [css_key_width]: css_value_length_perc100,
        [css_key_display]: css_value_misc_flex,
        [css_key_padding]: css_value_length_px5,
        [css_key_paddingTop]: css_value_length_px2,
        [css_key_borderBottom]: css_value_border_3px000f,
        [css_key_paddingBottom]: css_value_length_px0,
        [css_key_backgroundColor]: css_value_color_8888,
        [css_key_justifyContent]: css_value_misc_spaceBetween,
        [css_key_height]: css_value_length_px40
    }, {
        title: playerManagerLabel[3][playermanagerSelectedMenu]
    }, [controlAddButton, controlAddName]),
    submenus = [];
    for (let i = 0; i < 3; i++) {
        submenus[i] = make('div', {
            [css_key_width]: css_value_length_calcperc33,
            [css_key_padding]: css_value_length_px5,
            [css_key_alignItems]: css_value_misc_center,
            [css_key_borderBottom]: css_value_border_3px000f,
            [css_key_borderRight]: (i == playerManagerLabel.length - 1) ? '' : css_value_border_3px000f,
            [css_key_paddingBottom]: css_value_length_px0,
            [css_key_paddingTop]: css_value_length_px0,
            [css_key_justifyContent]: css_value_misc_center,
            [css_key_backgroundColor]: css_value_color_8888,
            [css_key_display]: css_value_misc_flex,
            [css_key_position]: css_value_misc_relative,
            [css_key_height]: css_value_length_px40
        }, {
            innerText: getLocal(playerManagerLabel[i][0]),
            title: getLocal(playerManagerLabel[i][1]),
            onclick: () => refreshPlayerManager(playermanagerSelectedMenu = i)
        });
    }
    append(make('div', {}, {}, [make('div', {
        [css_key_width]: css_value_length_perc100,
        [css_key_display]: css_value_misc_flex
    }, {}, submenus), controlAdd]));

    for (let username of list) {
        let entryNameDiv = make('div', {
            [css_key_userSelect]: css_value_misc_text
        }, {
            innerText: username
        }),
        entryButtonDiv = make('div', {
            [css_key_width]: css_value_length_px30,
            [css_key_height]: css_value_length_px30,
            [css_key_border]: css_value_border_4pxffff,
            [css_key_display]: css_value_misc_flex,
            [css_key_position]: css_value_misc_relative,
            [css_key_alignItems]: css_value_misc_center,
            [css_key_justifyContent]: css_value_misc_center,
            [css_key_backgroundColor]: css_value_color_f00c
        }, {
            innerText: 'X',
            onclick: () => refreshPlayerManager(toggleUsernameInlist(list, username))
        }),
        entryDiv = make('div', {
            [css_key_width]: css_value_length_perc100,
            [css_key_display]: css_value_misc_flex,
            [css_key_padding]: css_value_length_px5,
            [css_key_borderBottom]: css_value_border_2px000f,
            [css_key_paddingBottom]: css_value_length_px0,
            [css_key_justifyContent]: css_value_misc_spaceBetween,
            [css_key_height]: css_value_length_px40
        }, {}, [entryNameDiv, entryButtonDiv]);

        append(entryDiv);
    }
},

//this menu was a serious pain in the ass
refreshMenuUpgrades = append => {
    append(createControlToggle(autoUpgradesLabel[0], () => autoUpgrades[0] = 1 - autoUpgrades[0], () => autoUpgrades[0]));

    let upgradeslotsDivs = [],
        perkSelectDiv = make('div', {
            [css_key_width]: ' 100%',
            [css_key_display]: css_value_misc_grid,
            [css_key_gridTemplateColumns]: css_value_auto_5
        });

    for (let i = 1; i < 4; i++) {
        let upgradeNameDiv = make('div'),
        perkSlotImageDiv = make('div', {
            [css_key_width]: css_value_length_px30,
            [css_key_height]: css_value_length_px30,
            [css_key_border]: css_value_border_2px000f,
            [css_key_padding]: css_value_length_px0,
            [css_key_verticalAlign]: css_value_length_px0,
            [css_key_backgroundColor]: css_value_color_4448
        }),
        upgradeSlotDiv = make('div', {
            [css_key_width]: css_value_length_perc100,
            [css_key_padding]: css_value_length_px5,
            [css_key_display]: css_value_misc_flex,
            [css_key_borderBottom]: css_value_border_2px000f,
            [css_key_paddingBottom]: css_value_length_px0,
            [css_key_justifyContent]: css_value_misc_spaceBetween,
            [css_key_height]: css_value_length_px40
        }, {
            onclick: () => {
                perkSelectDiv.p(selectedPerkSlot = i);
                for (let slot of upgradeslotsDivs) slot.f();
            }
        }, [upgradeNameDiv, perkSlotImageDiv]);

        //b = update
        //this is abstracted because closure compiler doesnt
        upgradeSlotDiv.b = (perk, boolean) => {
            upgradeNameDiv.innerText = perkNames[perk] || getLocal(autoUpgradesLabel[1]);
            removeChildren(perkSlotImageDiv);
            if (perk && j30[perk]) perkSlotImageDiv.append(dupeImg(j30[perk]));
        };
        upgradeSlotDiv.b(autoUpgrades[i], 1);

        //f = update visually
        //this is abstracted because closure compiler doesnt
        upgradeSlotDiv.f = () => upgradeSlotDiv.style[css_key_backgroundColor] = i == selectedPerkSlot ? css_value_color_888c : css_value_color_8886;
        upgradeSlotDiv.f();

        upgradeslotsDivs.push(upgradeSlotDiv);
    }

    //p = update
    //this is abstracted because closure compiler doesnt
    perkSelectDiv.p = perkLevel => {
        removeChildren(perkSelectDiv);
        let perksToDisplay = perkLevel === 2 ? abilities : perks,
            perkLevelOther = 4 - perkLevel;
        for (let perk of perksToDisplay) {
            let perkImageDiv = make('div', {
                [css_key_border]: css_value_length_px2 + css_value_random_solid + (autoUpgrades[perkLevel] === perk ? css_value_color_ff0f : css_value_color_000f),
                [css_key_height]: perkSelectDiv.width / 4
            }, {
                onclick: () => {
                    //if this perk is already set, clear it
                    upgradeslotsDivs[perkLevel - 1].b(autoUpgrades[perkLevel] = autoUpgrades[perkLevel] === perk ? '' : perk);

                    //if the other setting is equal, clear it
                    if (perkLevelOther !== 2 && autoUpgrades[perkLevel] && autoUpgrades[perkLevelOther] === autoUpgrades[perkLevel]) {
                        upgradeslotsDivs[perkLevelOther - 1].b(autoUpgrades[perkLevelOther] = '');
                    }

                    //alternatively you can update just the perk selects that actually change but this is easier to do soo...
                    perkSelectDiv.p(perkLevel);

                    saveSettings();
                }
            }, [j30[perk]]);
            perkSelectDiv.append(perkImageDiv);
        }
    };
        perkSelectDiv.p(selectedPerkSlot);
    for (let div of upgradeslotsDivs) append(div);
    append(perkSelectDiv);
},

refreshMenuSpammer = append => {
    append(createControlToggle(scrollerLabel[0], () => {
        if (!chatSpam[CHATSPAMMER_TIMEOUT]) {
            startChatScrolling(multiBox[MULTIBOX_SELECTEDSOCKET]);
        } else {
            stopChatScrolling(multiBox[MULTIBOX_SELECTEDSOCKET]);
            sendChatMessage(multiBox[MULTIBOX_SELECTEDSOCKET], ' ');
        }
    }, () => chatSpam[CHATSPAMMER_TIMEOUT]));

    //makes sure the values don't go past a certain unsafe point
    let maxLength = (str, max) => str.replace(/\n/g, '').slice(0, max),
    clampValues = () => {
        chatSpam[CHATSPAMMER_WIDTH] = clamp(5, chatSpam[CHATSPAMMER_WIDTH], 30);
        chatSpam[CHATSPAMMER_DIRECTION] = clamp(-5, chatSpam[CHATSPAMMER_DIRECTION], 5);
        chatSpam[CHATSPAMMER_INTERVAL] = clamp(25, chatSpam[CHATSPAMMER_INTERVAL], 1000);
        chatSpam[CHATSPAMMER_SEPERATOR] = maxLength(chatSpam[CHATSPAMMER_SEPERATOR], 5);
        chatSpam[CHATSPAMMER_TEXT] = maxLength(chatSpam[CHATSPAMMER_TEXT], 99999);
        chatSpam[CHATSPAMMER_PAUSEPERIOD] = clamp(500, chatSpam[CHATSPAMMER_PAUSEPERIOD], 10000);
        chatSpam[CHATSPAMMER_PREFIX] = maxLength(chatSpam[CHATSPAMMER_PREFIX], 25 - chatSpam[CHATSPAMMER_SUFFIX].length);
        chatSpam[CHATSPAMMER_SUFFIX] = maxLength(chatSpam[CHATSPAMMER_SUFFIX], 25 - chatSpam[CHATSPAMMER_PREFIX].length);
        saveSettings();
    };
    clampValues();

    for (let attribute of CHATSPAMMER_WIDTH + CHATSPAMMER_DIRECTION + CHATSPAMMER_INTERVAL + CHATSPAMMER_PAUSEPERIOD) append(createControlValue(scrollerLabel[attribute],
        i => clampValues(chatSpam[attribute] += (CHATSPAMMER_PAUSEPERIOD == attribute ? 500 : CHATSPAMMER_INTERVAL == attribute ? 25 : 1) * i),
        () => chatSpam[attribute] / (attribute == CHATSPAMMER_PAUSEPERIOD ? 1000 : 1)
    ));

    for (let attribute of CHATSPAMMER_SEPERATOR + CHATSPAMMER_TEXT + CHATSPAMMER_PREFIX + CHATSPAMMER_SUFFIX) {
        let controlTextNameDiv = make('div', {
            [css_key_marginTop]: css_value_length_px3,
            [css_key_marginRight]: css_value_length_px8,
            [css_key_display]: css_value_misc_flex
        }, { innerText: scrollerLabel[attribute][0]}),
        controlTextInputDiv = make('input', {
            [css_key_width]: attribute == CHATSPAMMER_TEXT ? css_value_length_calcperc102 : css_value_length_px70,
            [css_key_height]: css_value_length_px34,
            [css_key_color]: css_value_color_000f,
            [css_key_border]: css_value_border_4pxffff,
            [css_key_display]: css_value_misc_flex,
            [css_key_position]: css_value_misc_relative,
            [css_key_alignItems]: css_value_misc_center,
            [css_key_justifyContent]: css_value_misc_center,
            [css_key_backgroundColor]: css_value_color_fffc
        }, {
            type: css_value_misc_text,
            oninput: () => {
                chatSpam[attribute] = controlTextInputDiv.value;
                clampValues();
                controlTextInputDiv.value = chatSpam[attribute];
            },
            onfocus: () => textBoxFocused = 1,
            onblur: () => textBoxFocused = 0,
            value: chatSpam[attribute]
        }),
        controlTextDiv = make('div', {
            [css_key_width]: css_value_length_perc100,
            [css_key_display]: css_value_misc_flex,
            [css_key_padding]: css_value_length_px5,
            [css_key_paddingTop]: css_value_length_px2,
            [css_key_borderBottom]: css_value_border_2px000f,
            [css_key_paddingBottom]: css_value_length_px0,
            [css_key_justifyContent]: css_value_misc_spaceBetween,
            [css_key_height]: css_value_length_px40
        }, { title: scrollerLabel[attribute][1] }, [controlTextNameDiv, controlTextInputDiv]);
        append(controlTextDiv);
    }
},

refreshMenuAntiAim = append => {
    let clampValues = () => {
        antiAim[ANTIAIM_ANGLESTART] = (360 + antiAim[ANTIAIM_ANGLESTART]) % 360;
        antiAim[ANTIAIM_ANGLERANGE] = (365 + antiAim[ANTIAIM_ANGLERANGE]) % 365;
        antiAim[ANTIAIM_SPINSPEED] = clamp(-180, antiAim[ANTIAIM_SPINSPEED], 180);
        antiAim[ANTIAIM_DELAY] = clamp(1, antiAim[ANTIAIM_DELAY], 62);
    };

    //toggleable settings
    for (let attribute of ANTIAIM_RELOAD + ANTIAIM_SHOOT + ANTIAIM_IDLE + ANTIAIM_DRAWREALAIM) append(createControlToggle(antiAimLabel[attribute], () => antiAim[attribute] = 1 - antiAim[attribute], () => antiAim[attribute]));

    //number settings
    for (let attribute of ANTIAIM_ANGLESTART + ANTIAIM_ANGLERANGE + ANTIAIM_SPINSPEED + ANTIAIM_DELAY) append(createControlValue(antiAimLabel[attribute], i => clampValues(antiAim[attribute] += (includesInArray(ANTIAIM_ANGLESTART + ANTIAIM_ANGLERANGE, attribute) ? 5 : 1) * i), () => antiAim[attribute]));

    updateMenuCanvas = (me, offset, players, crates) => {
        if (divs.menu.hidden) return;
        let angle1 = (antiAim[ANTIAIM_ANGLESTART] + tickCount * antiAim[ANTIAIM_SPINSPEED]) * degToRad,
            angle2 = angle1 + antiAim[ANTIAIM_ANGLERANGE] * degToRad,
            length = me[ATTRIBUTE_RADIUS] * 1.5 + 20;
        drawLine2(me, {
            x: length * sin(angle1),
            y: length * cos(angle1)
        }, offset, 2, '#f00');
        drawLine2(me, {
            x: length * sin(angle2),
            y: length * cos(angle2)
        }, offset, 2, '#00f');
        ctx.lineWidth = 1;
        ctx.beginPath();
        //fuck this shit
        ctx.arc(me.x + offset.x, me.y + offset.y, length, -angle1 + TAU / 4, -angle2 + TAU / 4, true);
        ctx.stroke();
    };
    
},

refreshMenuPerkHacks = append => {
    append(createMenuDropdown(perkHacksLabel[0], [
        createControlToggle(perkHacksLabel[PERKHACKS_KNIFE], () => perkHacks[PERKHACKS_KNIFE] = 1 - perkHacks[PERKHACKS_KNIFE], () => perkHacks[PERKHACKS_KNIFE]),
        createControlValue(perkHacksLabel[PERKHACKS_KNIFEMAXRANGE], i => perkHacks[PERKHACKS_KNIFEMAXRANGE] = clamp(20, perkHacks[PERKHACKS_KNIFEMAXRANGE] + 10 * i, 300), () => perkHacks[PERKHACKS_KNIFEMAXRANGE])
    ]));
    append(createMenuDropdown(perkHacksLabel[1], [
        createControlToggle(perkHacksLabel[PERKHACKS_SHIELD], () => perkHacks[PERKHACKS_SHIELD] = 1 - perkHacks[PERKHACKS_SHIELD], () => perkHacks[PERKHACKS_SHIELD]),
        createControlValue(perkHacksLabel[PERKHACKS_SHIELDUPKEEP], i => perkHacks[PERKHACKS_SHIELDUPKEEP] = clamp(0, perkHacks[PERKHACKS_SHIELDUPKEEP] + i, 50), () => perkHacks[PERKHACKS_SHIELDUPKEEP]),
        createControlValue(perkHacksLabel[PERKHACKS_SHIELDLOOKAHEAD], i => perkHacks[PERKHACKS_SHIELDLOOKAHEAD] = clamp(0, perkHacks[PERKHACKS_SHIELDLOOKAHEAD] + i, 10), () => perkHacks[PERKHACKS_SHIELDLOOKAHEAD]),
        createControlToggle(perkHacksLabel[PERKHACKS_SHIELDMANUAL], () => perkHacks[PERKHACKS_SHIELDMANUAL] = 1 - perkHacks[PERKHACKS_SHIELDMANUAL], () => perkHacks[PERKHACKS_SHIELDMANUAL]),
        createControlDropdown(perkHacksLabel[PERKHACKS_SHIELDVISUALISER], controlDropdownOptions[3], i => perkHacks[PERKHACKS_SHIELDVISUALISER] = i, () => perkHacks[PERKHACKS_SHIELDVISUALISER]),
        createControlToggle(perkHacksLabel[PERKHACKS_SHIELDWALLCHECK], () => perkHacks[PERKHACKS_SHIELDWALLCHECK] = 1 - perkHacks[PERKHACKS_SHIELDWALLCHECK], () => perkHacks[PERKHACKS_SHIELDWALLCHECK])
    ]));
    append(createMenuDropdown(perkHacksLabel[2], [
        createControlToggle(perkHacksLabel[PERKHACKS_CRATEPLACEVISION], () => perkHacks[PERKHACKS_CRATEPLACEVISION] = 1 - perkHacks[PERKHACKS_CRATEPLACEVISION], () => perkHacks[PERKHACKS_CRATEPLACEVISION]),
        //createControlToggle(perkHacksLabel[PERKHACKS_MEDKITSELFHEAL], () => perkHacks[PERKHACKS_MEDKITSELFHEAL] = 1 - perkHacks[PERKHACKS_MEDKITSELFHEAL], () => perkHacks[PERKHACKS_MEDKITSELFHEAL]),
        //createControlValue(perkHacksLabel[PERKHACKS_MEDKITSELFHEALTHRESHOLD], i => perkHacks[PERKHACKS_MEDKITSELFHEALTHRESHOLD] = clamp(5, perkHacks[PERKHACKS_MEDKITSELFHEALTHRESHOLD] + i * 5, 100), () => perkHacks[PERKHACKS_MEDKITSELFHEALTHRESHOLD]),
    ]));
},

refreshMenuPaint = append => {
    let dropdowns = {
        [PAINT_GRID]: PAINT_GRIDSPACEX + PAINT_GRIDSPACEY + PAINT_GRIDLINEWIDTHHORIZONTAL + PAINT_GRIDLINEWIDTHVERTICAL + PAINT_GRIDCOLOR,
        [PAINT_POINTS]: PAINT_POINTSIDLE + PAINT_POINTSFFA + PAINT_POINTSBLU + PAINT_POINTSRED + PAINT_POINTEDGEWIDTH,
        [PAINT_CRATES]: PAINT_CRATESHOWHPMODE + PAINT_CRATESQUARE + PAINT_CRATELONG + PAINT_CRATEUSER + PAINT_CRATEPREMIUM + PAINT_CRATECORPSE
    };

    for (let dropdown in dropdowns) {
        let controls = [];
        for (let setting of dropdowns[dropdown]) {
            let control;
            switch (setting) {
                case PAINT_CRATESHOWHPMODE:
                    control = createControlDropdown(paintLabel[PAINT_CRATESHOWHPMODE],
                    controlDropdownOptions[1],
                    x => paint[PAINT_CRATESHOWHPMODE] = x,
                    () => paint[PAINT_CRATESHOWHPMODE]);
                    break;

                case PAINT_POINTEDGEWIDTH:
                    control = createControlValue(paintLabel[PAINT_POINTEDGEWIDTH],
                        i => paint[PAINT_POINTEDGEWIDTH] = clamp(0, paint[PAINT_POINTEDGEWIDTH] + i, 20),
                        () => paint[PAINT_POINTEDGEWIDTH]
                    );
                    break;

                case PAINT_GRIDLINEWIDTHHORIZONTAL:
                    control = createControlValue(paintLabel[PAINT_GRIDLINEWIDTHHORIZONTAL],
                        i => paint[PAINT_GRIDLINEWIDTHHORIZONTAL] = clamp(0, paint[PAINT_GRIDLINEWIDTHHORIZONTAL] + i, 10),
                        () => paint[PAINT_GRIDLINEWIDTHHORIZONTAL]
                    );
                    break;

                case PAINT_GRIDLINEWIDTHVERTICAL:
                    control = createControlValue(paintLabel[PAINT_GRIDLINEWIDTHVERTICAL],
                        i => paint[PAINT_GRIDLINEWIDTHVERTICAL] = clamp(0, paint[PAINT_GRIDLINEWIDTHVERTICAL] + i, 10),
                        () => paint[PAINT_GRIDLINEWIDTHVERTICAL]
                    );
                    break;

                case PAINT_GRIDSPACEX:
                    control = createControlValue(paintLabel[PAINT_GRIDSPACEX],
                        i => paint[PAINT_GRIDSPACEX] = clamp(2, paint[PAINT_GRIDSPACEX] + i, 500),
                        () => paint[PAINT_GRIDSPACEX]
                    );
                    break;

                case PAINT_GRIDSPACEY:
                    control = createControlValue(paintLabel[PAINT_GRIDSPACEY],
                        i => paint[PAINT_GRIDSPACEY] = clamp(2, paint[PAINT_GRIDSPACEY] + i, 500),
                        () => paint[PAINT_GRIDSPACEY]
                    );
                    break;

                default:
                    control = createControlColor(paintLabel[setting], paint[setting]);
            }
            controls.push(control);
        }
        append(createMenuDropdown(paintLabel[dropdown], controls));
    }
    append(createControlButton(paintLabel[0], () => {
        if (prompt(paintLabel[0], paintLabel[1]) == 'yes') paint = {
            [PAINT_GRIDSPACEX]: 20,
            [PAINT_GRIDSPACEY]: 20,
            [PAINT_GRIDLINEWIDTHHORIZONTAL]: 1,
            [PAINT_GRIDLINEWIDTHVERTICAL]: 1,
            [PAINT_GRIDCOLOR]: ['#e3e3e8', '#efeff5'],
            [PAINT_POINTSIDLE]: ['#aaaaaa', '#f9f9f9'],
            [PAINT_POINTSFFA]: ['#00cc66', '#f9f9f9'],
            [PAINT_POINTSBLU]: ['#8dd8f8', '#f9f9f9'],
            [PAINT_POINTSRED]: ['#f26740', '#f9f9f9'],
            [PAINT_POINTEDGEWIDTH]: 4,
            [PAINT_CRATESHOWHPMODE]: 2,
            [PAINT_CRATESQUARE]: ['#808080', '#dfbf9f'],
            [PAINT_CRATELONG]: ['#808080', '#bec8dd'],
            [PAINT_CRATEUSER]: ['#808080', '#53c68c'],
            [PAINT_CRATEPREMIUM]: ['#2e2d2d', '#f0ba37']
        }
        saveSettings();
    }));
    let presetElements = [];
    for (let preset of paint[PAINT_PRESETS]) {

        presetElements.push(createControlBase(preset, [make("div", {
            [css_key_border]: css_value_border_3pxffff,
            [css_key_backgroundColor]: css_value_color_00fc
            //TODO: add css
        }, {
            innerText: '⇑', //TODO: find good character
            onclick: () => {
                if (paint[PAINT_CHANGEDSOMETHING] && prompt(paintLabel[0], paintLabel[1]) == 'yes') saveSettings(paint = {
                    [PAINT_GRIDSPACEX]:              preset[ 2],
                    [PAINT_GRIDSPACEY]:              preset[ 3],
                    [PAINT_GRIDLINEWIDTHHORIZONTAL]: preset[ 4],
                    [PAINT_GRIDLINEWIDTHVERTICAL]:   preset[ 5],
                    [PAINT_GRIDCOLOR]:             [ preset[ 6], preset[ 7] ],
                    [PAINT_POINTSIDLE]:            [ preset[ 8], preset[ 9] ],
                    [PAINT_POINTSFFA]:             [ preset[10], preset[11] ],
                    [PAINT_POINTSBLU]:             [ preset[12], preset[13] ],
                    [PAINT_POINTSRED]:             [ preset[14], preset[15] ],
                    [PAINT_POINTEDGEWIDTH]:          preset[16],
                    [PAINT_CRATESHOWHPMODE]:         preset[17],
                    [PAINT_CRATESQUARE]:           [ preset[18], preset[19] ],
                    [PAINT_CRATELONG]:             [ preset[20], preset[21] ],
                    [PAINT_CRATEUSER]:             [ preset[22], preset[23] ],
                    [PAINT_CRATEPREMIUM]:          [ preset[24], preset[25] ]
                })
            }
        }, [])]));
    }
    append(createMenuDropdown(paintLabel[PAINT_PRESETMANAGER], [
        createControlButton(paintLabel[PAINT_PRESETMANAGERSAVE]),
        createControlButton(paintLabel[PAINT_PRESETMANAGERIMPORT]),
        createControlButton(paintLabel[PAINT_PRESETMANAGEREXPORT]),
        createMenuDropdown(paintLabel[PAINT_PRESETMANAGERPRESETS], presetElements)
    ]));
},

refreshMenuRecorder = append => {
    //a game recorder similar to nitrogem's recorder but it works offline and doesn't need an iframe to play
    //it back since it just plays back server packets while making the game think it is connected to one
    append(make('div', {}, {
        innerText: 'Coming Soon'
    }));
},

//L, find a solution that works
refreshMenuDiscordRPC = append => {
    append(createControlToggle(discordRPCLabel[DISCORDRPC_ENABLED], () => {
        discordRPC[DISCORDRPC_ENABLED] = !discordRPC[DISCORDRPC_ENABLED];
        if (discordRPC[DISCORDRPC_ENABLED]) {
            //TODO: login to discord rpc
            discordRPCStart();
        } else if (discordRPC[DISCORDRPC_CONNECTION]) {
            discordRPCActivityClear();
            discordRPC[DISCORDRPC_CONNECTION].close();
        }
    }, () => discordRPC[DISCORDRPC_ENABLED]));

    append(createControlText(discordRPCLabel[DISCORDRPC_STATE], str => discordRPC[DISCORDRPC_STATE] = str, () => discordRPC[DISCORDRPC_STATE]));
    append(createControlText(discordRPCLabel[DISCORDRPC_DETAILS], str => discordRPC[DISCORDRPC_DETAILS] = str, () => discordRPC[DISCORDRPC_DETAILS]));
    append(createControlValue(discordRPCLabel[DISCORDRPC_UPDATEINTERVAL], i => discordRPC[DISCORDRPC_UPDATEINTERVAL] = clamp(15, discordRPC[DISCORDRPC_UPDATEINTERVAL] + i, 60), () => discordRPC[DISCORDRPC_UPDATEINTERVAL]));
},

refreshMenuTHNet = append => {
    append(createControlToggle(THNetLabel[THNET_ENABLE], () => {
        thnet[THNET_ENABLE] = !thnet[THNET_ENABLE];
        if (c3 !== null) {
            if (thnet[THNET_ENABLE]) {
                connectToTHNet();
            } else if (thnet[THNET_SOCKET]) {
                thnet[THNET_CLOSEREASON] = 'Manual';
                thnet[THNET_SOCKET].close();
            }
        }
    }, () => thnet[THNET_ENABLE]));
    append(createControlToggle(THNetLabel[THNET_INFOSHARE], () => (thnet[THNET_INFOSHARE] = 1 - thnet[THNET_INFOSHARE]) || thnet[THNET_SOCKET].send('1'), () => thnet[THNET_INFOSHARE]));
    append(createControlToggle(THNetLabel[THNET_CHAT], () => thnet[THNET_CHAT] = 1 - (divs.chatwrap.hidden = 1 - divs.chatwrap.hidden), () => thnet[THNET_CHAT]));
    let rules = [];
    for (let i = 0; i < THNetLabel[1].length; i++) rules[i] = make('div', {
        [css_key_paddingTop]: css_value_length_px5
    }, {
        innerText: THNetLabel[1][i]
    });
    append(createMenuDropdown(THNetLabel[0], rules));
},

refreshMenuWeird = append => {
    for (let setting in weird) append(createControlToggle(weirdLabel[setting], () => weird[setting] = 1 - weird[setting], () => weird[setting]));
},

refreshMenuAdvanced = append => {
    for (let setting in advanced) {
        let control;
        switch (setting) {
            case ADVANCED_TPS:
                control = createControlToggle(advancedLabel[setting], () => advanced[setting] = advanced[setting] === 2.5 ? 1 : 2.5, () => advanced[setting] === 1);
                break;
            case ADVANCED_OPTIMISEWALLCHECK:
                control = createControlToggle(advancedLabel[setting], () => advanced[setting] = 1 - advanced[setting], () => advanced[setting]);
                break;
            case ADVANCED_PINGCOUNT:
                control = createControlValue(advancedLabel[setting], i => advanced[setting] = clamp(1, advanced[setting] + i, 50), () => advanced[setting]);
                break;
            case ADVANCED_PINGCOMP:
                control = createControlValue(advancedLabel[setting], i => advanced[setting] = clamp(1, advanced[setting] + i, 100), () => advanced[setting]);
                break;
            case ADVANCED_AIMCONSTANT:
                control = createControlValue(advancedLabel[setting], i => advanced[setting] = parseFloat(clamp(0.5, advanced[setting] + 0.05 * i, 2.5).toFixed(2)), () => advanced[setting]);
        }
        append(control);
    }
    append(createControlButton(advancedLabel[0], () => {
        for (let server of RF.list) server.socket.close();
    }));
    append(createControlButton(advancedLabel[1], () => localStorage.removeItem('TioHax_bootloader')));
    append(createControlButton(advancedLabel[2], () => {
        if (prompt("Are you sure that you want to clear all TioHax settings? This cannot be undone! Type 'yes' if you want to proceed:", "no") == 'yes' &&
            prompt("ARE YOU ABSOLUTELY SURE that you want to clear ALL TioHax settings!? Your current settings will be lost forever if you do this!! Type 'yes' again if you absolutely want to proceed:", "no") == 'yes'
        ) {
            localStorage.removeItem('TioHax_settings');
            location.reload();
        }
    }));
    append(createControlText(THNetLabel[THNET_AUTH], str => thnet[THNET_AUTH] = str, () => thnet[THNET_AUTH]));
},

refreshMenuCredits = append => {
    for (let entry of credits) for (let i in entry) {
        let bool = i == 0;
        append(make('div', {
            [css_key_fontSize]: bool ? css_value_length_px30 : i & 1 ? css_value_length_px25 : css_value_length_px20,
            [css_key_borderTop]: bool ? css_value_border_4px000f : '',
            [css_key_marginTop]: bool ? css_value_length_px10 : i & 1 ? css_value_length_px15 : css_value_length_px5,
            [css_key_paddingTop]: bool ? css_value_length_px10 : '',
            [css_key_paddingLeft]: css_value_length_px5
        }, { innerText: entry[i] }));
    }
},

pingDisplay = () => {

    //starts at 5 padding so it isn't directly on the screen's edge, looks nicer
    let pingTextPadding = 5,
        fallbackText = 'Not Connected',
        pingSocket = RF.list[0] || {
            currentPing: fallbackText,
            [ATTRIBUTE_AVERAGEPING]: fallbackText,
            [ATTRIBUTE_MAXPING]: fallbackText,
            [ATTRIBUTE_MINPING]: fallbackText
        },
        pingTexts = [
            'Ping: ' + pingSocket.currentPing + ' ms',
            'Avg.: ' + round(pingSocket[ATTRIBUTE_AVERAGEPING]) + ' ms',
            'Max:  ' + pingSocket[ATTRIBUTE_MAXPING] + ' ms',
            'Min:  ' + pingSocket[ATTRIBUTE_MINPING] + ' ms'
        ];

    //if we're in a game or not
    if (b21 || c28) {
        pingTextPadding += 10;
        
        //second padding for the VIP tag
        if (selfPremiumMember) pingTextPadding += 35;

        //second padding for the username text
        if (b3 || b4) {
            ctx.font = '14px Arial';
            pingTextPadding += ceil(ctx.measureText((b3 ? 'Logged in' : 'Playing') + ' as ' + b4).width);
        }
    }
    ctx.font = 'bold 16px consolas';

    //draw the ping number
    for (let i = 0; i < pingTexts.length; i++) drawText(pingTextPadding, 16 + (i * 17), pingTexts[i], '#fff');

    //return the padding for the render time so we dont draw the render time text over server ping text
    return pingTextPadding + ceil(ctx.measureText(pingTexts[2]).width);
},

renderDisplay = (renderDisplayPadding) => {
    ctx.font = 'bold 16px consolas';
    let texts = [
        'Render time: ' + renderTime + 'ms',
        spacePadding('FPS: ', 13) + min(1000 / renderTime, 25 * advanced[ADVANCED_TPS]).toFixed(renderTime > 500 ? 2 : 1)

    ];
    drawText(renderDisplayPadding, 16, texts[0], '#fff');
    drawText(renderDisplayPadding, 32, texts[1], '#fff');
    return ceil(ctx.measureText(texts[0].length > texts[1].length ? texts[0] : texts[1]).width);
},

coordsDisplay = (renderDisplayPadding, me) => {
    ctx.font = 'bold 16px consolas';
    let texts = [
        'Pos: x:' + spacePadding(me.x, 7) + ' y: ' + spacePadding(me.y, 7),
        'Vel: x:' + spacePadding(me.spdX, 7) + ' y: ' + spacePadding(me.spdY, 7),
        'Acc: x:' + spacePadding(me[ATTRIBUTE_ACCX].toFixed(1), 7) + ' y: ' + spacePadding(me[ATTRIBUTE_ACCY].toFixed(1), 7)
    ], y = 16, longest = '';
    for (let text of texts) {
        drawText(renderDisplayPadding, y, text, '#fff');
        y += 17;
        if (longest.length < text.length) longest = text;
    }
    return ceil(ctx.measureText(longest).width);
},

getEnemies = (me, players) => {

    //enemies: enemy players which will be aimed at
    //enemy friends: enemy players which are friended
    let enemies = [], enemyFriends = [];

    for (let player of players) {

        //dont aimbot at invincible players or at team mates
        if (player.invincible || (player.teamCode && player.teamCode == me.teamCode)) continue;

            //dont aimbot at the developer of this cheat
        if (player[ATTRIBUTE_USERNAMEHASH] === developerHash ||
            //dont aimbot at chatting people if that setting is enabled
            (aimbot[AIMBOT_IGNORECHATTING] && player.chatBoxOpen) ||
            //dont aimbot at people the aimbot is not supposted to shoot at
            includesInArray(friends, player[ATTRIBUTE_SANITIZEDNAME]) ||
            //dont aimbot at other tiohax users
            includesInArray(thnet[THNET_BROTHERS], player[ATTRIBUTE_USERNAMEHASH])
        ) {
            enemyFriends.push(player);
        } else {
            enemies.push(player);
        }
    }

    return { [ATTRIBUTE_ENEMIES]: enemies, [ATTRIBUTE_ENEMYFRIENDS]: enemyFriends };
},

getDistanceSquared = (me, enemy, offset) => ((me.x - offset.x) - enemy.x) ** 2 + ((me.y - offset.y) - enemy.y) ** 2,

//calculate where someone will be with respect to how long it takes to get there
calcAheadness = (me, enemy, distance, gun, count = aimbot[AIMBOT_AHEADNESSDEPTH]) => {

    if (count) distance = getDistanceSquared(me, calcAheadness(me, enemy, distance, gun, count - 1), nullPos);

    let x = enemy.x,
        y = enemy.y;

    //mathematical
    distance = (sqrt(distance) - offsets[gun]) / (velocities[gun] * advanced[ADVANCED_AIMCONSTANT]);

    //aim a bit more ahead depending on the connection, since some server ticks may have happened during transport
    if (aimbot[AIMBOT_PINGCOMPENSATION]) {
        distance += ceil(RF.list[0][ATTRIBUTE_AVERAGEPING] / advanced[ADVANCED_PINGCOMP]);
    }

    //Formula for 'Pos + Vel + Acc + Time => New Pos': (np = new pos, p = pos, v = vel, t = time, a = acc) np = (p) + (v * t) + (0.5 * a * t²)
    //https://math.stackexchange.com/questions/4538784/formula-for-predicting-next-position-does-not-include-maximum-velocity-is-there/4538831#4538831
    //TODO: fix when a player just stops going in one direction that the bot thinks it is going in the opposite direction
    if (aimbot[AIMBOT_USEACCELERATION]) {
        let maxXvel = me[ATTRIBUTE_USABLEACCX] ? me[ATTRIBUTE_USABLEACCX] * 8 : me[ATTRIBUTE_USABLESPDX],
            maxYvel = me[ATTRIBUTE_USABLEACCY] ? me[ATTRIBUTE_USABLEACCY] * 8 : me[ATTRIBUTE_USABLESPDY];
        if (distance > (maxXvel - me[ATTRIBUTE_USABLESPDX]) / me[ATTRIBUTE_USABLEACCX]) {
            x += maxXvel * distance - ((maxXvel - me[ATTRIBUTE_USABLESPDX]) ** 2) / (me[ATTRIBUTE_USABLEACCX] ? 2 * me[ATTRIBUTE_USABLEACCX] : Infinity);
            x += maxYvel * distance - ((maxYvel - me[ATTRIBUTE_USABLESPDY]) ** 2) / (me[ATTRIBUTE_USABLEACCY] ? 2 * me[ATTRIBUTE_USABLEACCY] : Infinity);
        } else {
            x += enemy[ATTRIBUTE_USABLESPDX] * distance + 0.5 * me[ATTRIBUTE_USABLEACCX] * (distance ** 2);
            x += enemy[ATTRIBUTE_USABLESPDY] * distance + 0.5 * me[ATTRIBUTE_USABLEACCY] * (distance ** 2);
        }
    } else {
        x += enemy[ATTRIBUTE_USABLESPDX] * distance;
        y += enemy[ATTRIBUTE_USABLESPDY] * distance;
    }

    return {x, y};
},

wouldHitWall = (me, enemy, crates, gun) => {

    //TODO: move the MAAAAAAAAAAAAAATH to a function
    let enemyPos = aimbot[AIMBOT_USEAHEAD] ? calcAheadness(me, enemy, getDistanceSquared(me, enemy, nullPos), gun) : enemy,
        relPos = {
            x: enemyPos.x - me.x,
            y: enemyPos.y - me.y
        },
        possibleAngle = atan2(relPos.y, relPos.x) + asin(18 / sqrt(relPos.x ** 2 + relPos.y ** 2)),
        handAngle = 0 - (TAU * 0.6 + possibleAngle),
        gunOffset = offsets[gun] + velocities[gun] - 14,
        gunAngle = 0 - (TAU * 0.75 + possibleAngle),
        gunEnd = {
            x: me.x + sin(handAngle) * me[ATTRIBUTE_RADIUS] + sin(gunAngle) * gunOffset,
            y: me.y + cos(handAngle) * me[ATTRIBUTE_RADIUS] + cos(gunAngle) * gunOffset
        },
        inclusionBox = {
            x: (gunEnd.x + enemyPos.x) / 2,
            y: (gunEnd.y + enemyPos.y) / 2,
            z: sqrt(getDistanceSquared(gunEnd.x, enemyPos.x, nullPos)) / 2
        },
        hitCrates = [[gunEnd, enemyPos]];

    wallcheckoptimise: {
        for (let i = 0; i < crates.length; i++) {
            let crate = crates[i];

            //avoid calculating collisions if it would just be a waste
            if (!crate[ATTRIBUTE_BULLETCOLLISIONS] || getDistanceSquared(inclusionBox, crate, nullPos) > (inclusionBox.z + crate[ATTRIBUTE_HITBOXRADIUS]) ** 2) continue;

            //if the crate intersects with the line, add them to the list of crates that have been hit
            //works by checking if the line from the gun end to the enemy position collides with any line from the crate hitbox
            for (let j = 0; j < crate[ATTRIBUTE_HITBOX].length; j++) {
                if (collisionLineLine(
                    gunEnd.x, gunEnd.y,
                    enemyPos.x, enemyPos.y,
                    crate.x + crate[ATTRIBUTE_HITBOX][j][0], crate.y + crate[ATTRIBUTE_HITBOX][j][1],
                    crate.x + crate[ATTRIBUTE_HITBOX][j][2], crate.y + crate[ATTRIBUTE_HITBOX][j][3]
                ) || collisionLineLine(
                    enemy.x, enemy.y,
                    enemyPos.x, enemyPos.y,
                    crate.x + crate[ATTRIBUTE_HITBOX][j][0], crate.y + crate[ATTRIBUTE_HITBOX][j][1],
                    crate.x + crate[ATTRIBUTE_HITBOX][j][2], crate.y + crate[ATTRIBUTE_HITBOX][j][3]
                )) {
                    hitCrates.push(crate);
                    if (advanced[ADVANCED_OPTIMISEWALLCHECK]) break wallcheckoptimise;
                    break;
                }
            }
        }
    }
    return hitCrates;
},

couldHitFriend = (me, enemy, enemyFriends, gun) => {

    //TODO: move the MAAAAAAAAAAAAAATH to a function
    let enemyPos = aimbot[AIMBOT_USEAHEAD] ? calcAheadness(me, enemy, getDistanceSquared(me, enemy, nullPos), gun) : enemy.getAttr(), //the onlytime this method is ever needed...
        relPos = {
            x: enemyPos.x - me.x,
            y: enemyPos.y - me.y
        },
        possibleAngle = atan2(relPos.y, relPos.x) + asin(18 / sqrt(relPos.x ** 2 + relPos.y ** 2)),
        handAngle = 0 - (TAU * 0.6 + possibleAngle),
        gunOffset = offsets[gun] + velocities[gun] - 14,
        gunAngle = 0 - (TAU * 0.75 + possibleAngle),
        gunEnd = {
            x: me.x + sin(handAngle) * me[ATTRIBUTE_RADIUS] + sin(gunAngle) * gunOffset,
            y: me.y + cos(handAngle) * me[ATTRIBUTE_RADIUS] + cos(gunAngle) * gunOffset
        },
        factor = (gunOffset + ranges[gun] * velocities[gun]) / sqrt(getDistanceSquared(me, enemyPos, nullPos));
    enemyPos.x *= factor;
    enemyPos.y *= factor;

    for (let i = 0; i < enemyFriends.length; i++) {
        let friend = enemyFriends[i],
            offset = {x: -c2.x, y: -c2.y},
            //scale radius based on distance
            //TODO: this is goofy af, add stuff for speed and acceleration, make sure it also knows how far bullets can even go with ranges[gun] * velocities[gun]
            radius = friend[ATTRIBUTE_RADIUS] * sqrt(max(1, (getDistanceSquared(me, friend, nullPos) - getDistanceSquared(me, gunEnd, nullPos)) / (velocities[gun] * 2.5))),
            canHit = distanceSquaredLinePoint(
                gunEnd.x, gunEnd.y,
                enemyPos.x, enemyPos.y,
                friend.x, friend.y,
            ) < radius ** 2;
        drawCircle(friend, offset, radius, 2, canHit ? '#888' : '#aaa');
        if (canHit) return 1;
    }
},

//NOTE: all distances calculated here are left squared because it is not required for them to be square-rooted until later on
getTarget = (me, offset, enemies, enemyFriends, crates, minRange, maxRange, gun) => {

    //two of those will be returned and one of those will be used in the distance check
    let includeOnlyTargets = aimbot[AIMBOT_TARGETSONLY],
        smallestDistanceToPoint = aimbot[AIMBOT_CURSORMODE] && aimbot[AIMBOT_CURSORPROXCOSENESS] ? aimbot[AIMBOT_CURSORPROXCOSENESS] ** 2 : Infinity,
        distanceToMe, distanceToPoint, enemy, distance,
        c = {x: j9[0], y: j9[1]};
    for (let currentEnemy of enemies) {
        //compare distances and check if the current enemy to check is closer
        distanceToMe = getDistanceSquared(me, currentEnemy, nullPos);

        //or closer to the mouse if that setting is enabled
        if (aimbot[AIMBOT_CURSORMODE]) {
            distanceToPoint = getDistanceSquared(c, currentEnemy, offset);

            //draws lines from cursor to enemies
            if (esp[ESP_TRACERSCURSORENEMY]) drawLine(c, currentEnemy, offset, 1, '#888');
        } else {
            distanceToPoint = distanceToMe;
        }

        if (aimbot[AIMBOT_WALLCHECK]) {
            let hitCrates = wouldHitWall(me, currentEnemy, crates, gun);

            if (esp[ESP_TRACERSWALLCHECK]) {
                let pos = hitCrates[0];
                ctx.globalAlpha = hitCrates.length > 1 ? 1 : 0.5;
                drawLineWrap(
                    pos[0].x + offset.x, pos[0].y + offset.y,
                    pos[1].x + offset.x, pos[1].y + offset.y,
                    2,
                    '#888'
                );
                ctx.globalAlpha = 0.5;
                for (let i = 1; i < hitCrates.length; i++) hitCrates[i][ATTRIBUTE_FILLHITBOX]();
                ctx.globalAlpha = 1;
            }

            //NOTE: first hitCrates element is not a crate, it is the raycast line
            if (hitCrates.length > 1) continue;
        }

        //if the enemy is too close or far for the gun to hit, completely disregard them
        if (distanceToMe < minRange || distanceToPoint > maxRange) continue;

        let isATarget = includesInArray(targets, currentEnemy[ATTRIBUTE_SANITIZEDNAME]);

        //if (aimbot[AIMBOT_LEADERMODE] && currentEnemy.isLeader) return {[ATTRIBUTE_ENEMY]: currentEnemy, [ATTRIBUTE_DISTANCE]: distanceToMe};
        //if (aimbot[AIMBOT_LEADERMODE] && currentEnemy.isLeader) break;

        if (includeOnlyTargets && !isATarget) continue;
        if (aimbot[AIMBOT_TARGETMODE] && isATarget && !includeOnlyTargets) {
            includeOnlyTargets = 1;
            smallestDistanceToPoint = aimbot[AIMBOT_CURSORMODE] ? aimbot[AIMBOT_CURSORPROXCOSENESS] ** 2 : Infinity;
        }

        if (distanceToPoint > smallestDistanceToPoint) continue;
        if (aimbot[AIMBOT_AVOIDFRIENDS] && couldHitFriend(me, currentEnemy, enemyFriends, gun)) continue;

        smallestDistanceToPoint = distanceToPoint;
        distance = distanceToMe;
        enemy = currentEnemy;
    }

    //a visualiser so you know whats close to your cursor
    if (aimbot[AIMBOT_CURSORMODE]) {
        if (enemy) drawLine(c, enemy, offset, 2, '#888');
        let radius = sqrt(smallestDistanceToPoint);
        ctx.beginPath();
        ctx.moveTo(c.x + radius, c.y);
        ctx.arc(c.x, c.y, radius, 0, TAU);
        ctx.stroke();
    }

    return {[ATTRIBUTE_ENEMY]: enemy, [ATTRIBUTE_DISTANCE]: distance};
},

aimTorwards = (me, enemy, offset, distance, gun) => {

    //not accounting for velocity when the enemy is dashing is mostly a better idea
    if (!enemy.dashing) enemy = calcAheadness(me, enemy, distance, gun);

    //if too close to player move the position to aim at somewhat away so it doesnt break
    distance = sqrt(getDistanceSquared(me, enemy, nullPos));
    if (distance < 50) {
        distance = 50 / distance;
        enemy.x -= me.x;
        enemy.y -= me.y;
        enemy.x *= distance;
        enemy.y *= distance;
        enemy.x += me.x;
        enemy.y += me.y;
    }

    //immitate mouse cursor movement
    return {
        clientX: enemy.x + offset.x,
        clientY: enemy.y + offset.y
    };
},

setNameVariations = (player, username) => {
    player[ATTRIBUTE_USERNAMEHASH] = hashString(player[ATTRIBUTE_SANITIZEDNAME] = sanitiseName(player[ATTRIBUTE_TAGGEDNAME] = player[ATTRIBUTE_USERNAME] = username));
    if (c22 == 'FFA' && !player[ATTRIBUTE_TAGGEDNAME].startsWith('Guest ')) {
        if (player[ATTRIBUTE_USERNAME] in clanTagCache) {
            if (clanTagCache[player[ATTRIBUTE_USERNAME]]) {
                player[ATTRIBUTE_TAGGEDNAME] = '[' + clanTagCache[player[ATTRIBUTE_USERNAME]] + '] ' + player[ATTRIBUTE_TAGGEDNAME];
            }
        } else {
            fetchFromServer('clanof/' + player[ATTRIBUTE_TAGGEDNAME])
            .then(clanTag => {
                clanTagCache[player[ATTRIBUTE_USERNAME]] = clanTag;
                if (clanTag) player[ATTRIBUTE_TAGGEDNAME] = '[' + clanTag + '] ' + player[ATTRIBUTE_TAGGEDNAME];
            });
        }
    }
},

doAimbotThings = (me, offset, enemies, enemyFriends, crates, gunMinRange, playerScreenPos, gun) => {
    let target = {[ATTRIBUTE_ENEMY]: undefVar, [ATTRIBUTE_DISTANCE]: undefVar};
    if (!aimbot[AIMBOT_ENABLE]) return target;

    drawCircle(me, offset, 10, 2, '#000');
    if (aimbot[AIMBOT_TARGETSONLY]) drawCircle(me, offset, 15, 2, 'gray');

    if (me.dashing && aimbot[AIMBOT_DISABLEWHENDASHING]) return target;

    target = getTarget(me, offset, enemies, enemyFriends, crates, gunMinRange, Infinity, gun);
    if (target[ATTRIBUTE_ENEMY]) {
        if (!perkHacks[PERKHACKS_TICK]) aimMeAt(aimTorwards(me, target[ATTRIBUTE_ENEMY], offset, target[ATTRIBUTE_DISTANCE], gun), 1);
        if (esp[ESP_TRACERSBODYENEMY]) drawLine(playerScreenPos, target[ATTRIBUTE_ENEMY], offset, 3);
    }

    return target;
},

hideAim = (me, offset, animationSubtraction) => {
    if (me.dashing) return;
    if (!(
        (antiAim[ANTIAIM_IDLE] && !(me.reloading || me.shooting || cursor.isShooting)) ||
        (antiAim[ANTIAIM_RELOAD] && me.reloading && me.reloadingAnimation && (me.reloadingFrame < me.reloadingAnimation.length - animationSubtraction)) ||
        (antiAim[ANTIAIM_SHOOT] && me.shooting && me.shootingAnimation && (me.shootingFrame < me.shootingAnimation.length - animationSubtraction))
    )) return;
    if (0 === tickCount % antiAim[ANTIAIM_DELAY]) {
        let angle = (antiAim[ANTIAIM_ANGLESTART] + antiAim[ANTIAIM_ANGLERANGE] * random() + tickCount * antiAim[ANTIAIM_SPINSPEED]) * degToRad,
            ahead = me[ATTRIBUTE_RADIUS] * 2;
        antiAim[ANTIAIM_SAVEDX] = me.x + offset.x + ahead * sin(angle);
        antiAim[ANTIAIM_SAVEDY] = me.y + offset.y + ahead * cos(angle);
    }
    aimMeAt({
        clientX: antiAim[ANTIAIM_SAVEDX],
        clientY: antiAim[ANTIAIM_SAVEDY]
    }, 1, 1);
},

showFeatures = () => {
    ctx.font = 'bold 20px consolas';
    let maxX = j1 * 2 - 5,
        maxY = c2 ? floor(1.725 * j2) : (j2 * 2 - 30),
        tracers = esp[ESP_TRACERSBODYENEMY] || esp[ESP_TRACERSCURSORENEMY] || esp[ESP_TRACERSWALLCHECK] || esp[ESP_TRACERSGUN] || esp[ESP_TRACERSGRENADES],
        playerAttribs = esp[ESP_SHOWHEALTH] || esp[ESP_SHOWARMOR] || esp[ESP_SHOWMAGS] || esp[ESP_SHOWGUNRELOADSTATUS] || esp[ESP_SHOWRANGE],
        things = [
            [
                chatSpam[CHATSPAMMER_TIMEOUT],
                'Chat Spammer',
            ],[
                misc[MISC_FFACLANDISPLAY],
                'FFA Clan Display',
            ],[
                chatSpam[CHATSPAMMER_TIMEOUT],
                'Chat Scroller',
            ],[
                esp[ESP_SHOWINVIS] || esp[ESP_REVEALTEAMS],
                'Invis Reveal',
            ],[
                misc[MISC_AUTORELOAD],
                'Auto Reload',
            ],[
                perkHacks[PERKHACKS_KNIFE] || perkHacks[PERKHACKS_SHIELD] ||  perkHacks[PERKHACKS_CRATEPLACEVISION],
                'Perk Hacks',
                perkHacks[PERKHACKS_KNIFE] ? 'KnifeBot' : '',
                perkHacks[PERKHACKS_SHIELD] ? 'ShieldBot' : '',
                perkHacks[PERKHACKS_CRATEPLACEVISION] ? 'Build & Medkit' : ''
            ],[
                antiAim[ANTIAIM_RELOAD] || antiAim[ANTIAIM_SHOOT] || antiAim[ANTIAIM_IDLE],
                'Anti Aim',
            ],[
                aimbot[AIMBOT_ENABLE],
                'Aimbot',
                aimbot[AIMBOT_WALLCHECK] ? 'Wall Check' : '',
                aimbot[AIMBOT_TARGETSONLY] ? 'Targets Only' : '',
                aimbot[AIMBOT_CURSORMODE] ? 'Cursor Prox' : '',
                aimbot[AIMBOT_TRIGGERBOT] ? 'Triggerbot' + (aimbot[AIMBOT_TRIGGERBOTWHENDOWN] ? ', Mouse Down' : '') : ''
            ],[
                esp[ESP_ZOOM] || esp[ESP_FIXCAMERA],
                'Camera',
                esp[ESP_ZOOM] ? 'Zoom' : '',
                esp[ESP_FIXCAMERA] ? 'Fix' : ''
            ],[
                tracers || playerAttribs,
                'ESP',
                tracers ? 'Tracers' : '',
                playerAttribs ? 'Player Attributes' : ''
            ],[
                thnet[THNET_ENABLE],
                'THNet',
                thnet[THNET_SOCKET].readyState != WebSocket.OPEN ? 'Not Connected' : '',
                thnet[THNET_INFOSHARE] ? 'Info Share' : ''
            ]
        ];
    for (let [should, head, ...ext] of things) if (should) {
        let rainbowText = head,
            grayText = '',
            pad = 0;
        for (let e of ext) if (e) grayText += ' (' + e + ')';
        if (misc[MISC_SHOWFEATURES] == 1) {
            rainbowText += grayText;
            grayText = '';
        }
        pad = ctx.measureText(grayText).width;
        drawText(maxX - ctx.measureText(rainbowText).width - pad, maxY - 10, rainbowText, 'hsl(' + round(tickCount * third + (maxY - j7) / E) % 360 + ', 100%, 50%)');
        drawText(maxX - ctx.measureText(grayText).width, maxY - 10, grayText, '#888');
        maxY -= 20;
    }
},

drawTracers = (players, playerScreenPos, offset, animationSubtraction) => {
    for (let player of players) {

        //if they have no bullets and they arent reloading, assume they have max bullets
        //because the server doesnt send accurate currentbullets info unless the other players update their bullet count in any way
        if (!player.reloading && player.currentBullets == 0) player.currentBullets = player.maxBullets;

        //the tracer
        if (esp[ESP_TRACERSBODYENEMY]) drawLine(playerScreenPos, player, offset, 1);

        let ringColor;
        //congrats, you're playing with the dev of this cheat
        if (player[ATTRIBUTE_USERNAMEHASH] == developerHash) {
            ctx.globalAlpha = third * 2;
            ringColor = 'blue';

        //make a light blue circle to signify fellow tiohax users
        } else if (includesInArray(thnet[THNET_BROTHERS], player[ATTRIBUTE_USERNAMEHASH])) {
            ctx.globalAlpha = third;
            ringColor = 'blue';

        //make a red circle to tell targets apart
        } else if (includesInArray(targets, player[ATTRIBUTE_SANITIZEDNAME])) {
            ctx.globalAlpha = third;
            ringColor = 'red';

        //make a dark circle to tell friends apart
        } else if (includesInArray(friends, player[ATTRIBUTE_SANITIZEDNAME])) {
            ctx.globalAlpha = third * 2;
            ringColor = '#000';

        //show that they wont be shot at because they are chatting and the ignorechatting option is enabled
        } else if (aimbot[AIMBOT_IGNORECHATTING] && player.chatBoxOpen) {
            ctx.globalAlpha = third;
            ringColor = '#000';
        }

        if (ringColor) drawCircle(player, offset, player[ATTRIBUTE_RADIUS] * 1.4, 5, ringColor);

        //dont make the health value text transparent
        ctx.globalAlpha = 1;

        //draw the health values (hp and armor) either above or below the player
        //could be more elegant, but ehh
        let x = player.x + offset.x - player[ATTRIBUTE_RADIUS],
            y = player.y + offset.y - (player[ATTRIBUTE_RADIUS] + 6);

        //move health text further down if the player is chatting and above the upper half of the screen
        //figuring out the exact offset values took 2 whole days of trial and error for some reason.
        if (esp[ESP_SHOWHEALTH]) {
            drawText(x, y, player.hp, getColor(player)); //drawText(x, y, spacePadding(player.hp), getColor(player));
            y -= 20;
        }
        if (esp[ESP_SHOWARMOR]) {
            drawText(x, y, player.armorAmount, '#666'); //drawText(x, y, spacePadding(player.armorAmount), '#666');
            y -= 20;
        }
        if (esp[ESP_SHOWMAGS]) {
            drawText(x, y, player.currentBullets + '/' + player.maxBullets, '#000'); //drawText(x, y, spacePadding(player.currentBullets) + '/' + player.maxBullets, '#000');
            y -= 20;
        }
        if (esp[ESP_SHOWGUNRELOADSTATUS] && player.reloading) drawText(x, y, 'RELOADING ' + spacePadding(percentify(player.reloadingAnimation ? player.reloadingFrame / (player.reloadingAnimation.length - animationSubtraction) : 0)), '#888');
        if (esp[ESP_SHOWRANGE]) {
            let gun = gunMap[player.class], range = ranges[gun] * velocities[gun];
            ctx.globalAlpha = 1;
            drawCircle2(player, offset, sqrt((range * mathSin) ** 2 + (range * 0.5 + player[ATTRIBUTE_RADIUS]) ** 2), 3);
            ctx.globalAlpha = 1;
            drawCircle2(player, offset, sqrt((range * 1.5 * mathSin) ** 2 + (range * 0.75 + player[ATTRIBUTE_RADIUS]) ** 2), 3);
            ctx.globalAlpha = 1;
        }
    }
},

drawTeamAffiliations = offset => {
    //draw team affiliations of various stuff
    if (!esp[ESP_REVEALTEAMS]) return;
    for (let item of getPool(RA)) {
        if (!item.activated) continue;

        //landmines
        if (item.type == 'landMine') {
            drawCircle(item, offset, 20, 2);
            continue;
        }
        
        //gas
        if (item.emitting) {
            drawCircle(item, offset, item.emissionRadius, 2);
            continue;
        }
        
        //grenades
        drawCircle(item, offset, 10, 2);

        if (!esp[ESP_TRACERSGRENADES] || item.timeAlive > item.travelTime) continue;

        //a line from where they are to roughly where they will be
        let factor = (item.travelTime - (item.timeAlive + item[ATTRIBUTE_TIMEALIVEEXTRA])) * advanced[ADVANCED_TPS];
        item[ATTRIBUTE_TIMEALIVEEXTRA] += third;
        drawLine2(item, {x: item.spdX * factor, y: item.spdY * factor}, offset, 1);
    }

    //reveal team affiliations of knifes
    for (let knife of getPool(RC)) if (knife.activated && knife.isKnife) drawCircle(knife, offset, 5, 2);
},

perkHacksActionKnife = (me, socketId, offset, enemies, enemyFriends, crates) => {
    if (!perkHacks[PERKHACKS_KNIFE]) return;

    let range = me[ATTRIBUTE_RADIUS] + perkHacks[PERKHACKS_KNIFEMAXRANGE],
        gun = 6, // 6 is knife
        target = getTarget(me, offset, enemies, enemyFriends, crates, me[ATTRIBUTE_RADIUS] ** 2, range ** 2, gun);
    drawCircle(me, offset, range, 3, '#f88');

    if (target[ATTRIBUTE_ENEMY] && target[ATTRIBUTE_DISTANCE] < range ** 2) {
        aimMeAt(aimTorwards(me, target[ATTRIBUTE_ENEMY], offset, target[ATTRIBUTE_DISTANCE], gun), 1, 1);
        if (perkHacks[PERKHACKS_TICK]) {
            startActivePerk(socketId);
        } else {
            stopActivePerk(socketId);
        }
        perkHacks[PERKHACKS_TICK] = 1;

    } else {
        perkHacks[PERKHACKS_TICK] = 0;
    }
},

perkHacksActionShield = (me, socketId, playerScreenPos, offset, crates, animationSubtraction) => {
    if (!perkHacks[PERKHACKS_SHIELD]) return;

    let closestBullet = 0,
        shortestDistance = SHIELD_RANGE ** 2,
        chosenAngle = 0.,
        factor = animationSubtraction + perkHacks[PERKHACKS_SHIELDLOOKAHEAD],
        futurePos = calcAheadness(me, me, 0, 0);

    futurePos.x = me.x + (me.x - futurePos.x);
    futurePos.y = me.y + (me.y - futurePos.y);

    if (perkHacks[PERKHACKS_SHIELDVISUALISER] & 1) {
        drawCircle(futurePos, offset, SHIELD_RANGE, 2, '#000');
        drawCircle(futurePos, offset, 30, 2, '#000');
    }

    //look for the best bullet to block
    for (let bullet of getPool(RC)) {
        if (bullet.ownerId === me.id || (bullet.teamCode && bullet.teamCode == me.teamCode) ||
            getDistanceSquared(bullet, me, nullPos) < 30 ** 2
        ) continue;
        let lineEnd = {
            x: bullet.spdX * factor + bullet.length * cos(bullet.angle * degToRad),
            y: bullet.spdY * factor + bullet.length * sin(bullet.angle * degToRad)
        },
        distance = distanceSquaredLinePoint(
            bullet.x, bullet.y,
            bullet.x + lineEnd.x, bullet.y + lineEnd.y,
            futurePos.x, futurePos.y
        );

        if (perkHacks[PERKHACKS_SHIELDVISUALISER] > 1) drawLine2(bullet, lineEnd, offset, 1, '#ddd');

        //if closer than the current closest bullet
        if (distance > shortestDistance) continue;

        //ignore bullets that would have to go through a wall
        if (perkHacks[PERKHACKS_SHIELDWALLCHECK]) {
            let hasToHit = 0;
            for (let i = 0; i < crates.length; i++) {
                let crate = crates[i];

                //avoid calculating collisions if it would just be a waste
                if (!crate[ATTRIBUTE_BULLETCOLLISIONS] || getDistanceSquared(inclusionBox, crate, nullPos) > (inclusionBox.z + crate[ATTRIBUTE_HITBOXRADIUS]) ** 2) continue;

                //if the crate intersects with the line, add them to the list of crates that have been hit
                //works by checking if the line from the gun end to the enemy position collides with any line from the crate hitbox
                let wallIntersect = 0;
                for (let j = 0; j < crate[ATTRIBUTE_HITBOX].length; j++) {

                    //find out where the wall is currently intersecting
                    let currentIntersect = intersectionPointLineLine(
                        bullet.x, bullet.y,
                        bullet.x + lineEnd.x, bullet.y + lineEnd.y,
                        crate.x + crate[ATTRIBUTE_HITBOX][j][0], crate.y + crate[ATTRIBUTE_HITBOX][j][1],
                        crate.x + crate[ATTRIBUTE_HITBOX][j][2], crate.y + crate[ATTRIBUTE_HITBOX][j][3]
                    );

                    //if we are intersecting, we have hit something
                    if (currentIntersect) {
                        hasToHit = 1;

                        //get the intersection point that is closer to the bullet
                        if (wallIntersect) {
                            if (getDistanceSquared(currentIntersect, bullet, nullPos) > getDistanceSquared(wallIntersect, bullet, nullPos)) {
                                wallIntersect = currentIntersect;
                            }
                        } else {
                            wallIntersect = currentIntersect;
                        }
                    }
                }
            }

            //

            if (hasToHit) continue;
        }

        closestBullet = bullet;
        shortestDistance = distance;
    }

    if (closestBullet) {
        if (!perkHacks[PERKHACKS_SHIELDMANUAL]) startActivePerk(socketId);
        perkHacks[PERKHACKS_TICK] = perkHacks[PERKHACKS_SHIELDUPKEEP] * 2.5;
        chosenAngle = perkHacks[PERKHACKS_STOREDANGLE] = atan2(-closestBullet.spdY, -closestBullet.spdX);

    } else if (perkHacks[PERKHACKS_TICK] > 0 && (perkHacks[PERKHACKS_TICK] -= 2.5 / advanced[ADVANCED_TPS])) {
        chosenAngle = perkHacks[PERKHACKS_STOREDANGLE];
        if (!perkHacks[PERKHACKS_SHIELDMANUAL]) startActivePerk(socketId);

    } else {
        if (!perkHacks[PERKHACKS_SHIELDMANUAL]) stopActivePerk(socketId);
        perkHacks[PERKHACKS_TICK] = perkHacks[PERKHACKS_STOREDANGLE] = 0;
        return;
    }
    aimMeAt({
        clientX: playerScreenPos.x + 50 * cos(perkHacks[PERKHACKS_STOREDANGLE]),
        clientY: playerScreenPos.y + 50 * sin(perkHacks[PERKHACKS_STOREDANGLE])
    }, 1, 1);
},

perkHacksActionBuildMedkit = (me, socketId, offset) => {
    if (perkHacks[PERKHACKS_CRATEPLACEVISION]) {
        let box = {
            x: 50 * cos(me.playerAngle * degToRad),
            y: 50 * sin(me.playerAngle * degToRad)
        };
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(me.x + offset.x + box.x - 20, me.y + offset.y + box.y - 20, 40, 40);
        drawLine2(me, box, offset, 1, '#000');
    }

    // if medkit
    if (false && o3[2] == abilities[1]) {
        if (perkHacks[PERKHACKS_MEDKITSELFHEAL] && me.hp < perkHacks[PERKHACKS_MEDKITSELFHEALTHRESHOLD]) {
            let futurePos
            aimMeAt({
                clientX: me.x + offset.x + me[ATTRIBUTE_USABLESPDX],
                clientY: me.y + offset.y + me[ATTRIBUTE_USABLESPDY]
            }, 1, 1);
            if (perkHacks[PERKHACKS_TICK]) startActivePerk(socketId);
            perkHacks[PERKHACKS_TICK] = 1;
        } else {
            stopActivePerk(socketId);
            perkHacks[PERKHACKS_TICK] = 0;
        }
        return;
    }
    // if build
},

perkHacksAction = (me, socketId, playerScreenPos, offset, enemies, enemyFriends, crates, animationSubtraction) => {
    if (c9.current - animationSubtraction > 0 || !o3[2]) {
        perkHacks[PERKHACKS_TICK] = 0;
        if ((perkHacks[PERKHACKS_KNIFE] || perkHacks[PERKHACKS_SHIELD]) &&
            !(perkHacks[PERKHACKS_SHIELD] && abilities[0] == o3[2] && perkHacks[PERKHACKS_SHIELDMANUAL])
        ) stopActivePerk(socketId);
        return;
    }

    switch (o3[2]) {
        case abilities[3]: //Knife
            perkHacksActionKnife(me, socketId, offset, enemies, enemyFriends, crates);
            break;

        case abilities[0]: //Shield
            perkHacksActionShield(me, socketId, playerScreenPos, offset, crates, animationSubtraction);
            break;

        case abilities[1]: //Medkit
        case abilities[4]: //Build
            perkHacksActionBuildMedkit(me, socketId, offset);
            break;
    }
},

thnetInfoShare = leaderboardLeft => {
    ctx.font = 'bold 14px consolas';
    for (let entryName in thnet[THNET_INFOSHARING]) {
        let entry = thnet[THNET_INFOSHARING][entryName],
            spacing = 5,
            width = 160,
            height = 160;
        if (entry.length < 10) continue;
        leaderboardLeft -= spacing + width;
        ctx.strokeStyle = ctx.fillStyle = '#888';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(leaderboardLeft, 5, width, height);
        ctx.lineWidth = 3;
        ctx.globalAlpha = 1;
        ctx.strokeRect(leaderboardLeft, 5, width, height);
        leaderboardLeft += 5;
        let text = [
            ' Name: ' + entry[0],
            '   HP: ' + spacePadding(entry[1]) + '/' + entry[2],
            'Armor: ' + spacePadding(entry[3]) + '/' + entry[4],
            ' Ammo: ' + spacePadding(entry[5]) + '/' + entry[6],
            'Class: ' + gunNames[entry[7]],
            '    X: ' + spacePadding(round(entry[8]), 4) + ' Y: ' + spacePadding(round(entry[9]), 4)
        ];
        for (let i = 0; i < text.length; i++) {
            drawText(leaderboardLeft, 20 + i * 17, text[i], '#000');
        }
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.strokeRect(leaderboardLeft + 5 + i * 50, 115, 40, 40);
            if (j30[entry[11 + i]]) {
                ctx.drawImage(j30[entry[11 + i]], leaderboardLeft + 5 + i * 50, 115, 40, 40);
                if (i == 1 && entry[14] > 0) {
                    j58.globalAlpha = 0.75;
                    j58.fillStyle = "#7a7a7a";
                    j58.fillRect(leaderboardLeft + 5 + i * 50, 115, 40 * entry[14], 40);
                    ctx.globalAlpha = 1;
                }
            }
        }
        //0: sanitisedname
        //1: hp
        //2: hpMax
        //3: armorAmount
        //4: armorMax
        //5: currentBullets
        //6: maxBullets
        //7: gun
        //8: x
        //9: y
        //a: color
        //b: o3[1]
        //c: o3[2]
        //d: o3[3]
        //e: c9.current / c9.total


        //RD.prototype[ATTRIBUTE_DRAWBODY].call({});
        //RD.prototype[ATTRIBUTE_DRAWGUN].call({});
        leaderboardLeft -= 10;
    }
},

goToSpotWithPackets = (socketId, me, goal) => {
    //resets movement
    for (let inputId of [KEYPRESS_KEY_LEFT, KEYPRESS_KEY_RIGHT, KEYPRESS_KEY_UP, KEYPRESS_KEY_DOWN]) keyPress(socketId, inputId, 0);

    //sends the correct movement
    for (let inputId of [
        [KEYPRESS_KEY_RIGHT],
        [KEYPRESS_KEY_RIGHT, KEYPRESS_KEY_DOWN],
        [KEYPRESS_KEY_DOWN],
        [KEYPRESS_KEY_DOWN, KEYPRESS_KEY_LEFT],
        [KEYPRESS_KEY_LEFT],
        [KEYPRESS_KEY_UP, KEYPRESS_KEY_LEFT],
        [KEYPRESS_KEY_UP],
        [KEYPRESS_KEY_UP, KEYPRESS_KEY_RIGHT]
    ][ round(( atan2(me.y - goal.y, me.x - goal.x) / TAU ) * 8 + 4) % 8 ]) keyPress(socketId, inputId, 1);
},

//will i ever use this?
sanitizeMessage = message => make('p', {}, { innerText: message }).innerHTML,

makeChatMessage = args => {
    let scrollback = divs.chatbox.scrollTop === divs.chatbox.scrollHeight - divs.chatbox.clientHeight, msgs = [];
    for (let msg of args) {
        msgs.push(make('div', {
            color: msg[0],
            whiteSpace: msg[2] ? 'pre' : 'normal'
        }, { innerText:  msg[1] }));
    }
    divs.chatbox.append(make('div', {
        [css_key_paddingLeft]: css_value_length_px3,
        [css_key_display]: css_value_misc_flex,
        [css_key_minWidth]: css_value_length_em2
    }, {}, msgs));
    if (scrollback) divs.chatbox.scroll({ top: divs.chatbox.scrollHeight, behavior: 'instant' });
},

thnetOnMessage = event => {
    let data = event.data.split(' ');
    switch (pInt(data.shift())) {
        case 0: //load new people into dict without dublicates
            for (let user of data) {
                user = pInt(user);
                if (!includesInArray(thnet[THNET_BROTHERS], user)) thnet[THNET_BROTHERS].push(user);
            }
            break;

        case 1: //remove a person from the dict
            let i = indexOfInArray(thnet[THNET_BROTHERS], pInt(data[0]));
            if (thnet[THNET_BROTHERS].length - 1 > i) {
                thnet[THNET_BROTHERS][i] = thnet[THNET_BROTHERS].pop();
            } else {
                thnet[THNET_BROTHERS].pop();
            }
            break;

        case 2: //serverwide chat
            makeChatMessage([['#88f', data.shift().replace('_', ' ')], ['#fff', ': ', 1], ['#fff', data.join(' ')]]);
            break;

        case 3: //keepalive
            thnet[THNET_SOCKET].send('');
            if (thnet[THNET_INFOSHARE] && c3 !== null && thnet[THNET_SOCKET].readyState == WebSocket.OPEN) {
                let me = RD.pool[c3];
                thnet[THNET_SOCKET].send('1 ' + [
                    me.hp, me.hpMax,
                    me.armorAmount, armorMap[c1.armor] * 30,
                    me.currentBullets, me.maxBullets,
                    gunMap[me.class],
                    me.x, me.y, me.color.a,
                    o3[1], o3[2], o3[3], c9.current / c9.total
                ].join(' '));
            }
            break;

        case 4: //received close reason
            thnet[THNET_CLOSEREASON] = data.join(' ');
            break;

        case 5:
            makeChatMessage([['#f88', data.join(' ')]]);
            break;

        case 6:
            let name = data[0].replace('_', ' ');
            if (data.length < 2) {
                delete thnet[THNET_INFOSHARING][name];
                return;
            }
            data[0] = name;
            thnet[THNET_INFOSHARING][name] = data;
    }
},

connectToTHNet = () => thnet[THNET_SOCKET] = applyAttrbutes(new WebSocket('ws' + homeUrl + sanitiseName(b4) +  '/' + encodeURIComponent(o4.server + '/' + c22) + '/' + thnet[THNET_AUTH]), {
    onopen: event => {
        divs.chatwrap.hidden = !thnet[THNET_CHAT];
        makeChatMessage([['#ff0', 'Connected']]);
    },
    onmessage: thnetOnMessage,
    onerror: event => thnet[THNET_CLOSEREASON] = 'Error',
    onclose: event => {
        thnet[THNET_BROTHERS] = [];
        thnet[THNET_SOCKET] = 0;
        makeChatMessage([['#ff0', 'Disconnected' + (thnet[THNET_CLOSEREASON] ? ' (' + thnet[THNET_CLOSEREASON] + ')' : '')]]);

    }
}),

handleUncomplicatedKeypress = (keyEvent, msg) => {
    switch (keyEvent.keyCode) {
        case keyCodeMap[KEYCODE_A]:
        case keyCodeMap[KEYCODE_ARROWLEFT]:
            keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], KEYPRESS_KEY_LEFT, KEYPRESS_STATE_ON);
            keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], KEYPRESS_KEY_RIGHT, KEYPRESS_STATE_OFF);
            break;
        case keyCodeMap[KEYCODE_D]:
        case keyCodeMap[KEYCODE_ARROWRIGHT]:
            keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], KEYPRESS_KEY_RIGHT, KEYPRESS_STATE_ON);
            keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], KEYPRESS_KEY_LEFT, KEYPRESS_STATE_OFF);
            break;
        case keyCodeMap[KEYCODE_W]:
        case keyCodeMap[KEYCODE_ARROWUP]:
            keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], KEYPRESS_KEY_UP, KEYPRESS_STATE_ON);
            keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], KEYPRESS_KEY_DOWN, KEYPRESS_STATE_OFF);
            break;
        case keyCodeMap[KEYCODE_S]:
        case keyCodeMap[KEYCODE_ARROWDOWN]:
            keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], KEYPRESS_KEY_DOWN, KEYPRESS_STATE_ON);
            keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], KEYPRESS_KEY_UP, KEYPRESS_STATE_OFF);
            break;
        case keyCodeMap[KEYCODE_R]:
            keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], KEYPRESS_KEY_RELOAD, KEYPRESS_STATE_ON);
            break;
        case keyCodeMap[KEYCODE_SPACE]:
            startActivePerk(multiBox[MULTIBOX_SELECTEDSOCKET]);
            break;
        case keyCodeMap[KEYCODE_N]:
            o10.push({type: 8, content: c37 = !c37, initTime: Date.now()});
            break;
        case keyCodeMap[KEYCODE_T]:
            divs.menu.hidden = !divs.menu.hidden;
            break;
        case keyCodeMap[KEYCODE_CTRL]:
            divs.chatwrap.hidden = !divs.chatwrap.hidden;
            break;
        default:   
            if (!instantchat[INSTANTCHAT_CHATBINDS] || !msg) break;
            let padding = ' '.repeat(lastMessageLength = (lastMessageLength + 1) & 1);
            sendChatMessage(multiBox[MULTIBOX_SELECTEDSOCKET], padding + msg + padding);
    }
},

handleEnterPress = (socket, { style: chatboxContainerStyle }, chatbox, shiftPressed) => {
    if (shiftPressed) return divs.chatinput.focus();

    //get chat input value
    j47 = chatbox.value;

    //if there is a chat input value, send it as a chat message
    if (j46 && j47 != '') {
        sendChatMessage(multiBox[MULTIBOX_SELECTEDSOCKET], j47.replace(/,/g, '~').substring(0, 30));
        chatboxContainerStyle[css_key_display] = css_value_misc_none;
        chatbox.value = j47 = '';

    //if no chat input value, close the chat input
    } else if (j46 && j47 == '') {
        chatboxContainerStyle[css_key_display] = css_value_misc_none;
    } else if (!j46) {
        chatboxContainerStyle[css_key_display] = css_value_misc_inlineBlock;
        chatbox.focus();
    }
    j46 = !j46;
    keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], 7, j46 * !misc[MISC_HIDECHATTING]);
    socket.send(a59('focus'));
},

colorLerp = (color1, color2, percent) => {
    color1 = [
        pInt(color1.slice(1, 3), 16),
        pInt(color1.slice(3, 5), 16),
        pInt(color1.slice(5, 7), 16)
    ];
    color2 = [
        pInt(color2.slice(1, 3), 16),
        pInt(color2.slice(3, 5), 16),
        pInt(color2.slice(5, 7), 16)
    ];
    let result = '#';
    for (let i = 0; i < 3; i++) {
        let chunk = lerpR(color2[i], color1[i], percent).toString(16);
        result += chunk.length == 1 ? '0' + chunk : chunk;
    }

    return result;
},

onAFK = (me, socketId) => {
    let horizontal = j11 / 2 - me.x,
        vertical = j12 / 2 - me.y,
        key = [[ KEYPRESS_KEY_LEFT, KEYPRESS_KEY_RIGHT ][ horizontal > 1 ], [ KEYPRESS_KEY_DOWN, KEYPRESS_KEY_UP ][ vertical > 1 ]][ abs(horizontal) > abs(vertical) ];
    keyPress(socketId, key, KEYPRESS_STATE_OFF);
    keyPress(socketId, key, KEYPRESS_STATE_ON);
},

replaceENEMYInText = (str, enemy) => str.replace('[[ENEMY]]', sanitiseName(enemy.replace('Guest ', ''))),

onKill  = (socketId, victim) => instantchat[INSTANTCHAT_ONKILL] && sendChatMessage(socketId, replaceENEMYInText(instantchat[INSTANTCHAT_ONKILLTEXT], victim)),

onDeath = (socketId, killer) => instantchat[INSTANTCHAT_ONDEATH] && sendChatMessage(socketId, replaceENEMYInText(instantchat[INSTANTCHAT_ONDEATHTEXT], killer)),

onHeal  = (socketId, geduldig) => instantchat[INSTANTCHAT_AUTOTHANK] && geduldig == c3 && sendChatMessage(socketId, instantchat[INSTANTCHAT_AUTOTHANKTEXT]),

drawMinimap = player => {
    if (j43) return;
    let baseWidth = 144,
        baseHeight = 144,
        scaledWidth = (100 / j11 - j31) * 0.01,
        scaledHeight = (100 / j12 - j41) * 0.01,
        widthOffset = baseWidth / 2 - scaledWidth,
        heightOffset = baseHeight / 2 - scaledWidth,
        width = baseWidth * (c24 / j11),
        height = baseHeight * (c24 / j12),
        baseX = (baseWidth - width) * 0.5,
        baseY = (baseHeight - height) * 0.5;
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#808080";
    ctx.fillRect(5, 20, 150, 150);
    ctx.fillStyle = "#7a7a7a";
    ctx.fillRect(8, 23, baseWidth, baseHeight);
    ctx.fillStyle = "#b5b5b5";
    ctx.strokeStyle = "#d9d9d9";
    ctx.lineWidth = 1;
    ctx.fillRect(widthOffset + 8, heightOffset + 23, scaledWidth * 2, scaledHeight * 2);
    if (c22 == "FFA" || c22 == "TDM") {
        ctx.strokeStyle = "#d9d9d9";
        j25(ctx, baseX + 8, baseY + 23, width, height);
    } else if (c22 == "2TEAM" || c22 == "DOM") {
        for (let i = 0; i < 4; i++) {
            ctx.strokeStyle = [
                "#d9d9d9", //light gray, neutral
                "#f26740", //reddish orange, red capped
                "#8dd8f8" //light blue, blue capped
            ][j52[i + 1]];

            let baseX = baseWidth * 0.5 - 20,
                baseY = baseHeight * 0.5 - 20;
            if (i & 1) baseX += 40 - width;
            if (i > 1) baseY += 40 - height;

            j25(ctx, baseX + 8, baseY + 23, width, height);
        }
    }
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 0;
    if (thnet[THNET_INFOSHARE]) for (let entryName in thnet[THNET_INFOSHARING]) if (entryName != player[ATTRIBUTE_SANITIZEDNAME]) {
        let entry = thnet[THNET_INFOSHARING][entryName];
        ctx.fillStyle = entry[10];
        j22(ctx, baseWidth * (entry[8] / j11) + 8, baseHeight * (entry[9] / j12) + 23, 2);
        ctx.fill();
    }
    if (player == null || player === undefVar) return;
    ctx.fillStyle = player.color.a;
    j22(ctx, baseWidth * (player.x / j11) + 8, baseHeight * (player.y / j12) + 23, 2);
    ctx.fill();
    ctx.globalAlpha = 1;
},

//send mouse position to server
sendMousePositionToServer = socketId => {
    //thank you dygn for coding packet sending in such a weird way
    let str = a60('mouse-move', {mouseX: j16[0], mouseY: j16[1], mouseAngle: j16[2]});

    //convert string to bytes then send
    //j15 isnt used anywhere so we can reuse it for whatever purpose
    if (RF.list[socketId] !== undefVar && str !== j15) RF.list[socketId].send(a66(j15 = str));
},

//draw floor
drawFloor = (ctx, camera) => {
    let relPos1 = {x: -camera.x , y: -camera.y},
        relPos2 = {x: j11 - camera.x, y: j12 - camera.y},
        playerPos = RD.pool[c3],
        position = {x: relPos1.x + j11 / 2 - c24 / 2, y: relPos1.y + j12 / 2 - c24 / 2},
        positionMap = [
            {x: relPos1.x + j11 / 2 - 1000       , y: relPos1.y + j12 / 2 - 1000      },
            {x: relPos1.x + j11 / 2 + 1000 - c24 , y: relPos1.y + j12 / 2 - 1000      },
            {x: relPos1.x + j11 / 2 - 1000       , y: relPos1.y + j12 / 2 + 1000 - c24},
            {x: relPos1.x + j11 / 2 + 1000 - c24 , y: relPos1.y + j12 / 2 + 1000 - c24}
        ],
        capturepointPos = { x: (j11 - c24) / 2, y: (j12 - c24) / 2 },
        midPointColor = playerPos.x > capturepointPos.x && playerPos.x < capturepointPos.x + c24 && playerPos.y > capturepointPos.y && playerPos.y < capturepointPos.y + c24 ? paint[PAINT_POINTSFFA] : paint[PAINT_POINTSIDLE],
            i = 0;

    for (i = 0; i < 4; i++) positionMap[i].z = [paint[PAINT_POINTSIDLE], paint[PAINT_POINTSRED], paint[PAINT_POINTSBLU]][j52[i + 1]];

    //background
    ctx.fillStyle = paint[PAINT_GRIDCOLOR][1];
    ctx.fillRect(0, 0, j7, j8);

    //mid point
    if (c22 ==   'FFA' || c22 == 'TDM') {
        ctx.fillStyle = midPointColor[1];
        ctx.fillRect(position.x, position.y, c24, c24);
    }
    if (c22 == '2TEAM' || c22 == 'DOM') for (let i = 0; i < positionMap.length; i++) {
        ctx.fillStyle = positionMap[i].z[1];
        ctx.fillRect(positionMap[i].x, positionMap[i].y, c24, c24);
    }

    //hey whats up guys its gr1dical here today we are changing how the grid looks
    ctx.strokeStyle = paint[PAINT_GRIDCOLOR][0];
    for (i = 0; i <= j12; i += paint[PAINT_GRIDSPACEY]) if (relPos1.y + i > 0 && relPos1.y + i <= relPos2.y) j21(ctx, relPos1.x, relPos1.y + i, relPos2.x, relPos1.y + i, paint[PAINT_GRIDLINEWIDTHHORIZONTAL]);
    for (i = 0; i <= j11; i += paint[PAINT_GRIDSPACEX]) if (relPos1.x + i > 0 && relPos1.x + i <= relPos2.x) j21(ctx, relPos1.x + i, relPos1.y, relPos1.x + i, relPos2.y, paint[PAINT_GRIDLINEWIDTHVERTICAL]);

    //map border
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 10;
    ctx.strokeRect(relPos1.x, relPos1.y, j11, j12);

    //if mid capture point is being capped
    ctx.lineWidth = paint[PAINT_POINTEDGEWIDTH];
    if (c22 == 'FFA' || c22 == 'TDM') {
        ctx.strokeStyle = midPointColor[0];
        ctx.strokeRect(position.x, position.y, c24, c24);

    }
    //if dom capture points are being capped
    if (c22 == '2TEAM' || c22 == 'DOM') for (let i = 0; i < positionMap.length; i++) {
        ctx.strokeStyle = positionMap[i].z[0];
        ctx.strokeRect(positionMap[i].x, positionMap[i].y, c24, c24);
    }
},

//draw leaderboard
drawLeaderBoard = (ctx, leaderboard) => {
    leaderboard.current = leaderboard.new;
    if (j3 < 1 || j3 > 2.6) return;
    let offset = 0.03,
        leftiest = 1.695 * j1;
    ctx.fillStyle = '#609b68';
    ctx.textAlign = css_value_misc_center;
    ctx.font = 'bold 11px Arial';
    ctx.fillText('Total Players Online: ' + c29, 1.845 * j1, 0.032 * j2);
    ctx.fillStyle = '#4C4C4C';
    if (leaderboard.current.length > 0) ctx.fillText('Leaderboard', 1.845 * j1, 0.07 * j2);
    ctx.textAlign = 'start';
    for (let entry of leaderboard.current) {
        if (!entry.userId) continue;
        let horizontalOffset = 1.695 * j1,
            name = entry.userId,
            nameHash = hashString(sanitiseName(name)),
            selectedStyle = nameHash == developerHash ? '#00f' :
                includesInArray(thnet[THNET_BROTHERS], nameHash) ? '#88f' :
                includesInArray(targets, name) ? '#f00' :
                includesInArray(friends, name) ? '#000' : 0,
            label = {
                '#00f': 'DEV',
                '#88f': 'THnet',
                '#f00': 'Target',
                '#000': 'Friend'
            }[selectedStyle];
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = ['#808080', '#f26740', '#40b2e5'][pInt(entry.teamCode)];
        ctx.fillRect(1.7 * j1, (0.05 + offset) * j2, 0.295 * j1, 0.04 * j2);
        if (entry.isMember) {
            ctx.globalAlpha = 0.65;
            drawImage(j30.vip, 1.703 * j1, (0.055 + offset) * j2, 18, 10);
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.fillText(name + ': ' + entry.score, (entry.isMember ? 1.735 : 1.705) * j1, (0.0787 + offset) * j2);
        ctx.textAlign = 'right';
        ctx.fillText('Kills: ' + entry.kills, 1.99 * j1, (0.0795 + offset) * j2);
        ctx.textAlign = 'start';
        if (misc[MISC_LEADERBOARDBADGES] && selectedStyle) {
            ctx.strokeStyle = ctx.fillStyle = selectedStyle;
            ctx.font = 'bold 13px consolas';
            let width = ctx.measureText(label).width + 8;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(horizontalOffset - width, (0.05 + offset) * j2, width, 0.04 * j2);
            ctx.globalAlpha = ctx.lineWidth = 1;
            ctx.strokeRect(horizontalOffset - width, (0.05 + offset) * j2, width, 0.04 * j2);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(label, horizontalOffset - width + 4, (0.0795 + offset) * j2);
            horizontalOffset -= width;
        }
        leftiest = min(leftiest, horizontalOffset);
        offset += 0.045;
    }
    ctx.textAlign = 'right';
    ctx.fillStyle = '#4C4C4C';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('Players in arena: ' + o4.currentPlayers, 1.99 * j1, (offset + 0.075) * j2);
    ctx.textAlign = 'start';
    return leftiest;
},

aimMeAt = (event, isBot, isAbility) => {
    let me = RD.pool[c3],
        relPos = {
            x: (me.x - c2.x) * (isBot ? 1 : j6) - event.clientX,
            y: (me.y - c2.y) * (isBot ? 1 : j5) - event.clientY
        },
        mouseAngle = atan2(relPos.y, relPos.x) / degToRad + 180,
        playerAngle = mouseAngle + (isAbility ? 0 : asin(18 / sqrt(relPos.x ** 2 + relPos.y ** 2)) / degToRad);
    j16 = [round(relPos.x), round(relPos.y), round(mouseAngle)];
    if (!playerAngle && playerAngle !== 0) playerAngle = mouseAngle;
    me.playerAngle = round(playerAngle);
    j9 = [event.clientX, event.clientY];
    if (esp[ESP_CAMUSEREALPOSITION]) {
        relPos.x += event.clientX - cursor.x;
        relPos.y += event.clientY - cursor.y;
        mouseAngle = atan2(relPos.y, relPos.x) / degToRad + 180;
    }
    me.mouseAngle = round(mouseAngle);
    j39 = sqrt(relPos.x ** 2 + relPos.y ** 2);
},

handleMessage = (socketId, wsMsgEvent) => {
    if (wsMsgEvent.data === undefVar || RF.list[0] === undefVar) return;
    var messageString = a67(wsMsgEvent.data);
    if (messageString == ".") {
        RF.list[socketId].a74();
        RF.list[socketId].a76();
    }
    var messageStringFragments = messageString.split("|");
    for (var i = 0; i < messageStringFragments.length; i++) {
        var wsMessage = a61(messageStringFragments[i]);
        if (wsMessage) switch (wsMessage.code) {
            case "a":
                a78();
                a90();
                c3 = wsMessage.id;
                c2 = new RE(wsMessage.c2);
                c2.trackingId = wsMessage.id;
                a1(c2);
                RD.pool[wsMessage.id].activate(wsMessage, 0);
                c10 = 0;
                c5 = wsMessage.hp;
                c6 = wsMessage.armorAmount;
                c4 = 1;
                var me = RD.pool[c3];
                if (me) {
                    c2.x = me.x - window.innerWidth / j6 / 2;
                    c2.y = me.y - window.innerHeight / j5 / 2;
                }
                b4 = wsMessage.username;
                b38 = wsMessage.b38;
                selfPremiumMember = wsMessage.isPremiumMember;
                b11 = 0;
                j43 = 0;
                if (thnet[THNET_ENABLE] && !thnet[THNET_SOCKET]) connectToTHNet();
                break;
            case "b":
                RD.pool[wsMessage.id].applyPrimaryUpdate(wsMessage);
                break;
            case "c":
                RD.pool[wsMessage.id].applyAuxUpdate(wsMessage);
                break;
            case "d":
                RD.pool[wsMessage.id].activate(wsMessage, 1);
                break;
            case "e":
                RD.pool[wsMessage.id].deactivate();
                break;
            case "f":
                if (c3) RD.pool[c3].applyFirstPersonUpdateData(wsMessage);
                break;
            case "g":
                RC.pool[wsMessage.id].activate(wsMessage);
                break;
            case "h":
                var bullet = RC.pool[wsMessage.id];
                if (bullet) bullet.applyUpdate(wsMessage);
                break;
            case "i":
                RC.pool[wsMessage.id].deactivate();
                break;
            case "j":
                RB.pool[wsMessage.id].activate(wsMessage);
                break;
            case "k":
                RB.pool[wsMessage.id].applyUpdate(wsMessage);
                break;
            case "l":
                RB.pool[wsMessage.id].deactivate();
                break;
            case "m":
                RA.pool[wsMessage.id].activate(wsMessage);
                break;
            case "n":
                var thrown = RA.pool[wsMessage.id];
                if (thrown) thrown.applyUpdate(wsMessage);
                break;
            case "o":
                RA.pool[wsMessage.id].deactivate();
                break;
            case "p":
                c10 = wsMessage.level;
                break;
            case "q":
                j27.push({
                    x: wsMessage.x / 10,
                    y: wsMessage.y / 10,
                    c42: 0
                });
                break;
            case "r":
                let type = pInt(wsMessage.type),
                    content = wsMessage.content;
                if (type == 1) onKill(socketId, content);
                if (type == 2 || type == 9) onDeath(socketId, content);
                if (type == 5) onAFK(socketId, RD.pool[c3]);
                if (pInt(wsMessage.type) == 3) {
                    //hit damage notification
                    let notif = _.find(o10, {type: 3});
                    content = pInt(content);
                    if (!notif) {
                        o10.push({
                            type: type,
                            content: content,
                            initTime: Date.now()
                        });
                        break;
                    }
                    notif.content += content;
                    notif.initTime = Date.now();
                    break;
                }
                o10.push({
                    type: type,
                    content: content,
                    initTime: Date.now()
                });
                break;
            case "s":
                a4();
                break;
            case "t":
                b11 = 1;
                a45();
                break;
            case "v":
                j38.new = wsMessage.j38;
                o4.currentPlayers = wsMessage.currentPlayers;
                break;
            case "w":
                b4 = wsMessage.username;
                b38 = wsMessage.b38;
                selfPremiumMember = wsMessage.isPremiumMember;
                b3 = 1;
                a111("registerModal");
                a111("loginModal");
                if (wsMessage.rememberCookie.length > 0) a2("remember_cookie", wsMessage.rememberCookie, 365);
                if (selfPremiumMember) $("#hostServerTabLi").show();
                b2 = 0;
                a104();
                a99();
                b24();
                break;
            case "x":
                a18(wsMessage);
                b2 = 0;
                a99();
                break;
            case "y":
                a20(wsMessage);
                break;
            case "z":
                if (wsMessage.status) {
                    b4 = "Mystery Creature";
                    b38 = "";
                    selfPremiumMember = 0;
                    b3 = 0;
                    $("#hostServerTabLi").hide();
                }
                a99();
                a104();
                break;
            case "sq":
                j52[1] = pInt(wsMessage.squareOneTeam);
                j52[2] = pInt(wsMessage.squareTwoTeam);
                j52[3] = pInt(wsMessage.squareThreeTeam);
                j52[4] = pInt(wsMessage.squareFourTeam);
                break;
            case "sz":
                j31 = pInt(wsMessage.newSize);
                j41 = pInt(wsMessage.newSize);
                break;
            case "sta":
                c27 = wsMessage;
                break;
            case "re":
                j43 = 1;
                a80("respawn");
                break;
            case "fr":
                j43 = 1;
                a80("respawn");
                grecaptcha.execute("6LenZt4ZAAAAAF-2nPKzH9111gkjBlaJCEp8UsQV", {action: "connect"})
                .then(function (grecaptchatoken) {
                    grecaptcha.LoToken = grecaptchatoken;
                    grecaptcha.LoTime = (new Date).getTime();
                    RF.list[socketId].send(new Uint8Array(a68("q," + grecaptcha.LoToken + "," + grecaptcha.LoTime + "")));
                });
                break;
            case "reco":
                b1 = 0;
                b2 = 0;
                servers = [];
                b11 = 0;
                c4 = 0;
                a47();
                break;
        }
    }
    if (messageString == "+") {
        RF.list[socketId].b12 = 1;
        RF.list[socketId].send(new Uint8Array(a68("q," + grecaptcha.LoToken + "," + grecaptcha.LoTime + "")));
        b17();
        a91();
        b15 = 0;
        if (!b1) {
            loginViaCookie();
            b1 = 1;
        }
    } else if (messageString.substring(0, 7) == "version") {
        var receivedVersion = b35(messageString.substr(8)),
            clientVersion = b35(window.clientVersion),
            latestVersion = b35(window.latestVersion);
        if (receivedVersion.pat > clientVersion.pat
         || receivedVersion.min != clientVersion.min
         || receivedVersion.maj != clientVersion.maj
        ) return b36(receivedVersion);
        a2("clv", clientVersion.maj + "." + clientVersion.min + "." + clientVersion.pat);
        b37();
    } else if (messageString.substring(0, 10) == "highScores" && messageString.substr(11).length > 20) {
        var highScorePackage = JSON.parse(messageString.substr(11));
        getElementById("hscrs").style[css_key_display] = "block";
        getElementById("highScoresHeading").innerHTML = "Top Scores Today";
        var todayHighScores = getElementById("hsd");
        todayHighScores.innerHTML = "";
        for (var highScoreEntry in highScorePackage) {
            if (!highScorePackage[highScoreEntry].score) continue;
            var highScoreEntryMainContainer = document.createElement("div");
            highScoreEntryMainContainer.className = "high-score-row";
            var highScoreEntryVIPContainer = document.createElement("div");
            highScoreEntryVIPContainer.className = "vip-image-div";
            if (highScorePackage[highScoreEntry].is_member) {
                var vipImg = document.createElement("img");
                vipImg.src = "/img/vip.png";
                vipImg.className = "vip-score-image";
                highScoreEntryVIPContainer.appendChild(vipImg);
            }
            highScoreEntryMainContainer.appendChild(highScoreEntryVIPContainer);
            var nameContainer = document.createElement("div");
            nameContainer.className = "high-scores-text";
            nameContainer.innerHTML = highScorePackage[highScoreEntry].username + ": " + highScorePackage[highScoreEntry].score.toLocaleString();
            highScoreEntryMainContainer.appendChild(nameContainer);
            todayHighScores.appendChild(highScoreEntryMainContainer);
        }
    } else if (messageString.substring(0, 8) == "c22") {
        a103(a61(messageString).j50);
    }
},

menus = [
    [menuNames[ 0], refreshMenuSelect],
    [menuNames[ 1], refreshMenuGuide],
    [menuNames[ 2], refreshMenuMenu],
    [menuNames[ 3], refreshMenuAimbot],
    [menuNames[ 4], refreshMenuESP],
    [menuNames[ 5], refreshMenuInstantchat],
    [menuNames[ 6], refreshMenuMisc],
    [menuNames[ 7], refreshMenuPlayermanager],
    [menuNames[ 8], refreshMenuUpgrades],
    [menuNames[ 9], refreshMenuSpammer],
    [menuNames[10], refreshMenuAntiAim],
    [menuNames[11], refreshMenuPerkHacks],
    [menuNames[12], refreshMenuPaint],
    [menuNames[13], refreshMenuRecorder],
  //[menuNames[14], refreshMenuDiscordRPC],
    [menuNames[15], refreshMenuTHNet],
    [menuNames[16], refreshMenuWeird],
    [menuNames[17], refreshMenuAdvanced],
    [menuNames[18], refreshMenuCredits],
];

/*
//handle stuff when other cheats are loaded aswell, since they can cause issues
if (//getElementById('box2') || //vaakir
    //getElementById('m2') || //dewey's spammer
    //getElementById('scrollerGUI') //nitro's spammer
false) {
    if (await new Promise(Resolve => {
        let def = localStorage.getItem('TioHax_abortWhenRanWithOtherMods');
        if (def) return Resolve(pInt(def));
        document.body.append(make('div', {}))
        Resolve();
    })) return;
}*/

//this is the DRM!
setInterval(console.dir, 30000, 'GATS.io TioHax Menu\nMade by Taureon.\nhttp' + homeUrl + '\nhttps://discord.gg/CwWd5UKf6R');


/*
    this is planned shit for an uktrakill-like style meter which would use the chat for the style level and the duration of the style
    concept:
    -------SSShitstorm-------
     ------SSShitstorm------
      -----SSShitstorm-----
       ----SSShitstorm----
        ---SSShitstorm---
          -SSShitstorm-
           SSShitstorm
    when it ends it downgrades to the level before
    if the user kills someone it levels up and resets the timer

    (11) Destructive
    ( 7) Chaotic
    ( 6) Brutal
    ( 8) Anarchic
    ( 7) Supreme
    ( 9) SSadistic
    (11) SSShitstorm
    ( 9) ULTRAKILL
    30 - 11 = 19 => 18
    (30) jgihrehgioerhgiorehiogheriohge
*/


RE = function(data) {
    let that = this;
    for (let prop of ['x', 'y', 'spdX', 'spdY', 'width', 'height']) {
        that[prop] = pInt(data[prop]);
        if (isNaN(that[prop])) that[prop] = 0;
    }
    that.update = that[ATTRIBUTE_UPDATE] = function(bool) {
        let player = RD.pool[that.trackingId];
        if (!player) return;
        if (player.mouseAngle === undefVar) player.mouseAngle = 0;
        if (esp[ESP_FIXCAMERA]) {
            that.x = player.x + round(player.spdX / advanced[ADVANCED_TPS]) - j40.x;
            that.y = player.y + round(player.spdY / advanced[ADVANCED_TPS]) - j40.y;
            return;
        }
        if (!bool) {
            that.spdX += sign(player.spdX - that.spdX) / 10;
            that.spdY += sign(player.spdY - that.spdY) / 10;
            if (that.spdX > -0.1 && that.spdX < 0.1) that.spdX = 0;
            if (that.spdY > -0.1 && that.spdY < 0.1) that.spdY = 0;
            that.spdX = round(that.spdX * 10) / 10;
            that.spdY = round(that.spdY * 10) / 10;
        }
        let angleRad = player.mouseAngle * degToRad;
        if (that.spdX > -22 && that.spdX < 22) that.x = j39 / 15 * cos(angleRad) + (player.x - j40.x) - that.spdX * 12;
        if (that.spdY > -22 && that.spdY < 22) that.y = j39 / 15 * sin(angleRad) + (player.y - j40.y) - that.spdY * 12;
    };
    that.getRelPos = obj => ({ x: obj.x - that.x, y: obj.y - that.y });
    that.getPos = () => ({ x: that.x, y: that.y });
    that.getSize = () => ({ width: that.width, height: that.height });
};


//crates
RB.prototype[ATTRIBUTE_FILLHITBOX] = function () {
    let relPos = { x: this.x - c2.x, y: this.y - c2.y };
    ctx.beginPath();
    ctx.moveTo(this[ATTRIBUTE_HITBOX][0][0] + relPos.x, this[ATTRIBUTE_HITBOX][0][1] + relPos.y);
    for (let i = 1; i < 4; i++) ctx.lineTo(this[ATTRIBUTE_HITBOX][i][0] + relPos.x, this[ATTRIBUTE_HITBOX][i][1] + relPos.y);
    ctx.closePath();
    ctx.fill();
};

RB.prototype[ATTRIBUTE_MAKEHITBOX] = function () {

    //`this.angle` is weird
    let angle = 0 - (this.angle * degToRad - PI / 2),

        hitboxOffset = {
            x: this[ATTRIBUTE_HITBOXFORWARDOFFSET] * sin(angle),
            y: this[ATTRIBUTE_HITBOXFORWARDOFFSET] * cos(angle)
        },

        //generate the relative corners
        relativeCorners = [
            atan2(    this[ATTRIBUTE_WIDTH],     this[ATTRIBUTE_HEIGHT]) + angle,
            atan2(0 - this[ATTRIBUTE_WIDTH],     this[ATTRIBUTE_HEIGHT]) + angle,
            atan2(0 - this[ATTRIBUTE_WIDTH], 0 - this[ATTRIBUTE_HEIGHT]) + angle,
            atan2(    this[ATTRIBUTE_WIDTH], 0 - this[ATTRIBUTE_HEIGHT]) + angle
        ],

        distance = sqrt(this[ATTRIBUTE_WIDTH] ** 2 + this[ATTRIBUTE_HEIGHT] ** 2);

    //ceonver 4 corners into 4 lines
    for (let i = 0; i < 4; i++) relativeCorners[i] = {
        x: hitboxOffset.x + distance * sin(relativeCorners[i]),
        y: hitboxOffset.y + distance * cos(relativeCorners[i])
    };
    this[ATTRIBUTE_HITBOX] = [
        [relativeCorners[0].x, relativeCorners[0].y, relativeCorners[1].x, relativeCorners[1].y],
        [relativeCorners[1].x, relativeCorners[1].y, relativeCorners[2].x, relativeCorners[2].y],
        [relativeCorners[2].x, relativeCorners[2].y, relativeCorners[3].x, relativeCorners[3].y],
        [relativeCorners[3].x, relativeCorners[3].y, relativeCorners[0].x, relativeCorners[0].y]
    ];

    this[ATTRIBUTE_HITBOXOFFSET] = hitboxOffset;
    this[ATTRIBUTE_HITBOXRADIUS] = distance;
};

RB.prototype.activate = function (data) {
    this.parent = data.parentId;
    this.type = data.type;
    this.x = data.x / 10;
    this.y = data.y / 10;
    this.angle = data.angle;
    this.maxHp = data.maxHp;
    this.hp = data.hp;
    this.isPremium = data.isPremium;
    this.model = a11(this.type, this.isPremium);
    this[ATTRIBUTE_WIDTH] = 0;
    this[ATTRIBUTE_HEIGHT] = 0;
    this[ATTRIBUTE_HITBOXFORWARDOFFSET] = 0;
    this[ATTRIBUTE_BULLETCOLLISIONS] = 0;
    switch (this.type) {
        case 'crate':
            this[ATTRIBUTE_WIDTH] = 45;
            this[ATTRIBUTE_HEIGHT] = 45;
            this[ATTRIBUTE_BULLETCOLLISIONS] = 1;
            break;
        case 'longCrate':
            this[ATTRIBUTE_WIDTH] = 45;
            this[ATTRIBUTE_HEIGHT] = 20;
            this[ATTRIBUTE_BULLETCOLLISIONS] = 1;
            break;
        case 'userCrate':
        case 'premiumCrate':
            this[ATTRIBUTE_WIDTH] = 15;
            this[ATTRIBUTE_HEIGHT] = 15;
            this[ATTRIBUTE_BULLETCOLLISIONS] = 1;
            break;
        case 'shield':
            this[ATTRIBUTE_WIDTH] = 30;
            this[ATTRIBUTE_HEIGHT] = 10;
            this[ATTRIBUTE_HITBOXFORWARDOFFSET] = 33;
            this[ATTRIBUTE_BULLETCOLLISIONS] = 1;
            break;
    }
    this.activated = 1;
    this[ATTRIBUTE_MAKEHITBOX]();
};

RB.prototype[ATTRIBUTE_UPDATE] = function () {
    if (this.model) this.animationFrame = (this.animationFrame + 1) % this.model.length;
    if (this.type != 'shield') return;
    let parent = RD.pool[this.parent];
    if (!parent) return;
    let angle = parent.playerAngle * degToRad;
    this.x = parent.x + parent.spdX / advanced[ADVANCED_TPS] + cos(angle);
    this.y = parent.y + parent.spdY / advanced[ADVANCED_TPS] + sin(angle);
    this.angle = parent.playerAngle;
};

RB.prototype.applyUpdate = function (data) {
    let bool = this.angle != data.angle;
    this.x = data.x / 10;
    this.y = data.y / 10;
    this.angle = data.angle;
    if (data.hp !== undefVar && data.hp != '') this.hp = pInt(data.hp);
    if (bool) this[ATTRIBUTE_MAKEHITBOX]();
};

RB.prototype[ATTRIBUTE_DRAW] = function() {
    if (!this.model) return;

    let hpPercent = this.maxHp ? this.hp / this.maxHp : 1,
        model = this.model[this.animationFrame],
        color = {
            'crate': paint[PAINT_CRATESQUARE],
            'longCrate': paint[PAINT_CRATELONG],
            'userCrate': this.isPremium ? paint[PAINT_CRATEPREMIUM] : paint[PAINT_CRATEUSER]
        }[this.type];

    if (color) {
        model[0][1][3] = color[0];
        model[1][1][3] = color[1];
        if (hpPercent < 0 || hpPercent > 1) hpPercent = 0;
        if (!misc[MISC_BETTERCRATEHP]) hpPercent = ceil(hpPercent * 5) / 5;
        if (paint[PAINT_CRATESHOWHPMODE] & 1) model[0][1][3] = colorLerp(color[0], paint[PAINT_CRATECORPSE][0], hpPercent);
        if (paint[PAINT_CRATESHOWHPMODE] >> 1) model[1][1][3] = colorLerp(color[1], paint[PAINT_CRATECORPSE][1], hpPercent);
    }
    a38(ctx, c2, this, this.angle, model);
};


//bullets
RC.prototype[ATTRIBUTE_UPDATE] = function () {
    if (this.model) this.animationFrame = (this.animationFrame + 1) % this.model.length;
    this.x += this.spdX;
    this.y += this.spdY;
};

RC.prototype[ATTRIBUTE_DRAW] = function() {
    if (this.isKnife) return a38(ctx, c2, this, this.angle, this.model[this.animationFrame]);

    ctx.strokeStyle = '#000';
    if (this.silenced && !esp[ESP_SHOWINVIS]) {
        ctx.strokeStyle = '#D3D3DA';
    } else if (this.ownerId == c3 || (this.teamCode > 0 && this.teamCode == RD.pool[c3].teamCode)) {
        ctx.strokeStyle = '#107a24';
    } else if (RD.pool[c3].thermal) {
        ctx.strokeStyle = '#f00';
    }
    let relPosX = this.x - c2.x,
        relPosY = this.y - c2.y;
    j21(ctx, relPosX, relPosY, relPosX + this.length * cos(this.angle * degToRad), relPosY + this.length * sin(this.angle * degToRad), this.width);
};


//players
RD.prototype.activate = async function(data, isMe) {
    this.color = data.color;
    this.x = parseFloat(data.x / 10);
    this.y = parseFloat(data.y / 10);
    this[ATTRIBUTE_PREVSPDX] = this[ATTRIBUTE_PREVSPDY] = this.spdY = this.spdX = this[ATTRIBUTE_PREVACCX] = this[ATTRIBUTE_PREVACCY] = this[ATTRIBUTE_ACCX] = this[ATTRIBUTE_ACCY] = 0;
    this[ATTRIBUTE_RADIUS] = pInt(data.radius / 10);
    this.playerAngle = pInt(data.playerAngle);
    this.hp = pInt(data.hp);
    this[ATTRIBUTE_HPRADIUS] = this.hp * this[ATTRIBUTE_RADIUS] / 100;
    this.armorAmount = pInt(data.armorAmount);
    this.shootingAnimation = a6('shooting', this.class = data.class);
    this.ghillie = data.ghillie;
    this.maxBullets = data.maxBullets;
    this.invincible = data.invincible;
    this.isLeader = pInt(data.isLeader);
    this.isPremiumMember = pInt(data.isPremiumMember);
    this.teamCode = pInt(data.teamCode);
    this.chatBoxOpen = pInt(data.chatBoxOpen);
    this.activated = 1;
    if (!isMe) {
        this.currentBullets = pInt(data.currentBullets);
        this.maxBullets = pInt(data.maxBullets);
        this.armor = data.armor;
        this.c2 = data.c2;
        this.hpMax = data.hpMax;
        this.numExplosivesLeft = 3;
        j31 = pInt(data.mapWidth) / 10;
        j41 = pInt(data.mapHeight) / 10;
    }
    setNameVariations(this, formatUserName(data.username));
};

RD.prototype.applyFirstPersonUpdateData = function (data) {
    if (data.currentBullets !== undefVar && data.currentBullets != '') this.currentBullets = pInt(data.currentBullets);
    if (data.score !== undefVar && data.score != '') this.score = pInt(data.score);
    if (data.kills !== undefVar && data.kills != '') this.kills = pInt(data.kills);
    if (data.rechargeTimer !== undefVar) c9 = {current: pInt(data.rechargeTimer) * advanced[ADVANCED_TPS], total: pInt(data.rechargeTimer) * advanced[ADVANCED_TPS]};
    if (data.maxBullets !== undefVar && data.maxBullets != '') this.maxBullets = pInt(data.maxBullets);
    if (data.c2 !== undefVar && data.c2 != '') {
        let c = data.c2.split('x');
        c2.width = pInt(c[0]);
        c2.height = pInt(c[1]);
    }
    if (data.thermal !== undefVar && data.thermal != '') this.thermal = pInt(data.thermal);
    if (data.numExplosivesLeft !== undefVar && data.numExplosivesLeft != '') this.numExplosivesLeft = pInt(data.numExplosivesLeft);
};

RD.prototype[ATTRIBUTE_UPDATE] = function () {
    let hpRadius = round((this.hp / 100) * (this[ATTRIBUTE_RADIUS] - this.armorAmount / 10 - 1));
    if (misc[MISC_STATICHEALTH]) {
        this[ATTRIBUTE_HPRADIUS] = hpRadius;

    //if end user wants to keep health animations
    } else {
        if (this[ATTRIBUTE_HPRADIUS] > hpRadius - 0.5 && this[ATTRIBUTE_HPRADIUS] < hpRadius + 0.5) {
            this[ATTRIBUTE_HPRADIUS] = hpRadius;
        } else if (this[ATTRIBUTE_HPRADIUS] > hpRadius) {
            this[ATTRIBUTE_HPRADIUS] = this[ATTRIBUTE_HPRADIUS] - 0.5;
        } else if (this[ATTRIBUTE_HPRADIUS] < hpRadius) {
            this[ATTRIBUTE_HPRADIUS] = this[ATTRIBUTE_HPRADIUS] + 0.5;
        }
        if (this[ATTRIBUTE_HPRADIUS] < 0) this[ATTRIBUTE_HPRADIUS] = 0;
    }

    if (this.hp > 0) {
        this.x += round(this.spdX / advanced[ADVANCED_TPS]);
        this.y += round(this.spdY / advanced[ADVANCED_TPS]);
    }

    //chat timer
    if (this.j47Timer > 0) {
        this.j47Timer -= 2.5 / advanced[ADVANCED_TPS];
        if (this.j47Timer <= 0) this.j47 = "";
    }

    //animation handler
    this.shootingAnimation = a6("shooting", this.class);
    if (this.shooting) {
        this.shootingFrame = (this.shootingFrame + 1) % this.shootingAnimation.length;
    } else if (this.reloading && this.reloadingAnimation) {
        this.reloadingFrame = (this.reloadingFrame + 1) % this.reloadingAnimation.length;
    }
    if (!this.shooting) this.shootingFrame = 0;
    if (!this.reloading) this.reloadingFrame = 0;
};

RD.prototype.applyPrimaryUpdate = function(data) {
    this.x = parseFloat(data.x / 10);
    this.y = parseFloat(data.y / 10);
    let spdX = parseFloat(data.spdX / 10);
    let spdY = parseFloat(data.spdY / 10);
    this[ATTRIBUTE_PREVACCX] = this[ATTRIBUTE_ACCX];
    this[ATTRIBUTE_PREVACCY] = this[ATTRIBUTE_ACCY];
    this[ATTRIBUTE_ACCX] = spdX - this.spdX;
    this[ATTRIBUTE_ACCY] = spdY - this.spdY;
    this[ATTRIBUTE_PREVSPDX] = this.spdX;
    this[ATTRIBUTE_PREVSPDY] = this.spdY;
    this.spdX = spdX;
    this.spdY = spdY;
    if (aimbot[AIMBOT_AIMSMOOTHING]) {
        this[ATTRIBUTE_USABLESPDX] = (spdX + this[ATTRIBUTE_PREVSPDX]) / 2;
        this[ATTRIBUTE_USABLESPDY] = (spdY + this[ATTRIBUTE_PREVSPDY]) / 2;
        this[ATTRIBUTE_USABLEACCX] = (this[ATTRIBUTE_ACCX] + this[ATTRIBUTE_PREVACCX]) / 2;
        this[ATTRIBUTE_USABLEACCY] = (this[ATTRIBUTE_ACCY] + this[ATTRIBUTE_PREVACCY]) / 2;
    } else {
        this[ATTRIBUTE_USABLESPDX] = spdX;
        this[ATTRIBUTE_USABLESPDY] = spdY;
        this[ATTRIBUTE_USABLEACCX] = this[ATTRIBUTE_ACCX];
        this[ATTRIBUTE_USABLEACCY] = this[ATTRIBUTE_ACCY];
    }
    if (data.id != c3) this.playerAngle = pInt(data.playerAngle);
};

RD.prototype.applyAuxUpdate = function (data) {
    if (!this.activated) return;
    if (data.color          !== undefVar && data.color          != '') this.color             = data.color;
    if (data.radius         !== undefVar && data.radius         != '') this[ATTRIBUTE_RADIUS] = pInt(data.radius / 10);
    if (data.dashing        !== undefVar && data.dashing        != '') this.dashing           = pInt(data.dashing);
    if (data.ghillie        !== undefVar && data.ghillie        != '') this.ghillie           = pInt(data.ghillie);
    if (data.shooting       !== undefVar && data.shooting       != '') this.shooting          = pInt(data.shooting);
    if (data.isLeader       !== undefVar && data.isLeader       != '') this.isLeader          = pInt(data.isLeader);
    if (data.reloading      !== undefVar && data.reloading      != '') this.reloading         = pInt(data.reloading);
    if (data.maxBullets     !== undefVar && data.maxBullets     != '') this.maxBullets        = pInt(data.maxBullets);
    if (data.invincible     !== undefVar && data.invincible     != '') this.invincible        = pInt(data.invincible);
    if (data.armorAmount    !== undefVar && data.armorAmount    != '') this.armorAmount       = pInt(data.armorAmount);
    if (data.chatBoxOpen    !== undefVar && data.chatBoxOpen    != '') this.chatBoxOpen       = pInt(data.chatBoxOpen);
    if (data.currentBullets !== undefVar && data.currentBullets != '') this.currentBullets    = pInt(data.currentBullets);
    if (data.hp !== undefVar && data.hp != '') {
        let newHp = pInt(data.hp);
        if (this.hp + 1 < newHp) onHeal(this.id);
        this.hp = newHp;
    }
    if (data.beingHit !== undefVar && data.beingHit != '') {
        if (data.id == c3) j37 = 6;
        this.beingHit = pInt(data.beingHit);
    }
    if (data.j47 !== undefVar && data.j47 != '') {
        this.j47 = data.j47.replace(/~/g, ',');
        this.j47Timer = 200;
        //if (!thnet[THNET_ENABLE] && this[ATTRIBUTE_USERNAMEHASH] == developerHash && this.j47 == ',revealRogues') sendChatMessage('I am rogue');
    }
};

RD.prototype[ATTRIBUTE_DRAWBODY] = function() {
    let relPos = {
        x: this.x - c2.x,
        y: this.y - c2.y
    };
    if (!(this.ghillie && !esp[ESP_SHOWINVIS]) || this.spdX != 0 || this.spdY != 0 || this.beingHit || this.shooting) {
        if (this.isLeader) {
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = this.color.a;
            ctx.lineWidth = 10;
            j22(ctx, relPos.x, relPos.y, this[ATTRIBUTE_RADIUS] * 1.65);
        }
        ctx.globalAlpha = this.invincible ? 0.3 : 1;
        ctx.lineWidth = 2;
        ctx.strokeStyle = ctx.fillStyle = this.isPremiumMember ? '#000' : '#666';
        j22(ctx, relPos.x, relPos.y, this[ATTRIBUTE_RADIUS] + 1);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = ctx.fillStyle = this.color.b;
        j22(ctx, relPos.x, relPos.y, this[ATTRIBUTE_RADIUS] - this.armorAmount / 10);
        ctx.fill();
        if (this.dashing) {
            ctx.strokeStyle = '#bababa';
            j21(ctx, relPos.x     , relPos.y     , relPos.x      - this.spdX * 5, relPos.y      - this.spdY * 5, 1);
            j21(ctx, relPos.x     , relPos.y + 20, relPos.x      - this.spdX * 5, relPos.y + 20 - this.spdY * 5, 1);
            j21(ctx, relPos.x     , relPos.y - 20, relPos.x      - this.spdX * 5, relPos.y - 20 - this.spdY * 5, 1);
            j21(ctx, relPos.x + 20, relPos.y     , relPos.x + 20 - this.spdX * 5, relPos.y      - this.spdY * 5, 1);
            j21(ctx, relPos.x - 20, relPos.y     , relPos.x - 20 - this.spdX * 5, relPos.y      - this.spdY * 5, 1);
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = ctx.fillStyle = this.color.a;
        j22(ctx, relPos.x, relPos.y, this[ATTRIBUTE_HPRADIUS] + 1);
        ctx.fill();
        if (c37 && this.id != c3) {
            ctx.fillStyle = this.isPremiumMember ? '#000' : '#666';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            let usedName = misc[MISC_FFACLANDISPLAY] ? this[ATTRIBUTE_TAGGEDNAME] : this[ATTRIBUTE_USERNAME],
                textWidth = ctx.measureText(usedName).width;
            if (this.isPremiumMember) {
                ctx.globalAlpha = 0.75;
                ctx.fillText(usedName, relPos.x - 9, relPos.y + this[ATTRIBUTE_RADIUS] * 1.75);
                drawImage(j30.vip, relPos.x + textWidth / 2 - 6, relPos.y + this[ATTRIBUTE_RADIUS] * 1.75 - 9, 18, 10);
                ctx.globalAlpha = 1;
            } else {
                ctx.fillText(usedName, relPos.x, relPos.y + this[ATTRIBUTE_RADIUS] * 1.75);
            }
            ctx.textAlign = 'start';
        }
        ctx.globalAlpha = 1;
    } else if (this.id != c3 && RD.pool[c3].thermal == 1) {
        if (this.teamCode > 0 && this.teamCode == RD.pool[c3].teamCode) {
            ctx.strokeStyle = '#107a24';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#107a24';
            ctx.fillText(this[ATTRIBUTE_USERNAME], relPos.x, relPos.y + this[ATTRIBUTE_RADIUS] * 1.75);
            ctx.textAlign = 'start';
        } else {
            ctx.strokeStyle = '#f00';
        }
    } else {
        ctx.strokeStyle = '#efeff5';
        ctx.lineWidth = 2;
        j22(ctx, relPos.x, relPos.y, this[ATTRIBUTE_RADIUS]);
        ctx.fillStyle = '#efeff5';
        ctx.fill();
    }
    if (!c37 || includesInArray(muted, this[ATTRIBUTE_SANITIZEDNAME])) return;
    let chatMessage = this.j47;
    if (chatMessage == '' && this.chatBoxOpen) chatMessage = '...';
    if (chatMessage[chatMessage.length - 1] == ' ') chatMessage = chatMessage.substring(0, chatMessage.length - 1);
    if (!chatMessage.length) return;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    let textWidth = ctx.measureText(chatMessage).width;
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = this.isPremiumMember ? '#000' : '#7a7a7a';
    ctx.fillRect(relPos.x - textWidth / 2 - 3, relPos.y + this[ATTRIBUTE_RADIUS] * 2.7 - 13, textWidth + 6, 18);
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.isPremiumMember ? '#deb34c' : '#fff';
    ctx.fillText(chatMessage, relPos.x, relPos.y + this[ATTRIBUTE_RADIUS] * 2.7);
    ctx.textAlign = 'start';
};

RD.prototype[ATTRIBUTE_DRAWGUN] = function () {
    if (this.ghillie && !this.spdX && !this.spdY && !this.beingHit && !this.shooting) {
        if (!RD.pool[c3].thermal || c3 == this.id) return;
        let relPos = {
            x: this.x - c2.x,
            y: this.y - c2.y
        };
        ctx.strokeStyle = (this.teamCode > 0 && this.teamCode == RD.pool[c3].teamCode) ? "#107a24" : "#ff0000";
        j21(ctx, relPos.x, relPos.y, relPos.x + cos(this.playerAngle * degToRad) * 20, relPos.y + sin(this.playerAngle * degToRad) * 20, 4);
        return;
    }

    this.shootingAnimation = a6("shooting", this.class);
    let animationFrameToDraw = this.shootingAnimation[this.shootingFrame],
        what = 0;
    if (this.beingHit) {
        what = -1;
        this.beingHit = 0;
    }
    if (this.reloading) {
        this.reloadingAnimation = a6("reloading", this.class, this.maxBullets - this.currentBullets, !this.currentBullets);
        animationFrameToDraw = this.reloadingAnimation[this.reloadingFrame];
    }
    if (this.invincible) ctx.globalAlpha = 0.3;
    a38(ctx, c2, this.getAttr(), this.playerAngle, animationFrameToDraw, 4, null, what);
    ctx.globalAlpha = 1;
};

//connections
RF.prototype.a74 = function () {
    this.pingReceivedTime = Date.now();
    this.currentPing = (this.pingReceivedTime - this.pingSentTime) >> 1; //divides by 2 and also rounds in the same operation!
    ++this.numSuccessfulPings;

    if (!this[ATTRIBUTE_PINGS]) this[ATTRIBUTE_PINGS] = [];
    this[ATTRIBUTE_PINGS].push(this.currentPing);
    if (this[ATTRIBUTE_PINGS].length > advanced[ADVANCED_PINGCOUNT]) this[ATTRIBUTE_PINGS].shift();

    this[ATTRIBUTE_AVERAGEPING] = 0;
    for (let ping of this[ATTRIBUTE_PINGS]) this[ATTRIBUTE_AVERAGEPING] += ping;
    this[ATTRIBUTE_AVERAGEPING] /= this[ATTRIBUTE_PINGS].length;

    this[ATTRIBUTE_MINPING] = min(...this[ATTRIBUTE_PINGS]);
    this[ATTRIBUTE_MAXPING] = max(...this[ATTRIBUTE_PINGS]); //lag spikes? L
};

RF.prototype.createGameSocket = function () {
    this.socket = new WebSocket(this.connectHostname);
    this.socket.binaryType = 'arraybuffer';
    this.pingSentTime = Date.now();
    this.socket.onopen = () => {
        if (this.socket == null) return;
        let indexInList = indexOfInArray(RF.list, this);
        this.socket.onmessage = wsMsgEvent => {
            if (recorder[RECORDER_ISRECORDING]) recorder[RECORDER_CURRENT].push([Date.now(), wsMsgEvent.data]);
            handleMessage(indexInList, wsMsgEvent);
        };
    };
    this.socket.onclose = () => {
        if (thnet[THNET_SOCKET]) thnet[THNET_SOCKET].close();
        this.close();
        a45();
    };
};


//non-bullet projectiles
RA.prototype.applyUpdate = function(data) {
    this.x = pInt(data.x / 10);
    this.y = pInt(data.y / 10);
    this.exploding = pInt(data.exploding);
    this.emitting = pInt(data.emitting);
    this.emissionRadius = pInt(data.emissionRadius / 10);
    this[ATTRIBUTE_TIMEALIVEEXTRA] = 0;
    this.timeAlive++;
};

RA.prototype[ATTRIBUTE_UPDATE] = function () {
    if (this.type == "landMine" || this.emitting) return;
    if (this.exploding) {
        this.animationFrame++;
        if (this.animationFrame < this.model.length) this.deactivate();
    }
    if (this.timeAlive < this.travelTime) {
        this.x += this.spdX;
        this.y += this.spdY;
    }
    this.angle = (this.angle + 7) % 360;
};

RA.prototype[ATTRIBUTE_DRAW] = function () {
    if (!this.activated) return;
    if (this.exploding) return a38(ctx, c2, this.getAttr(), this.angle, this.model[this.animationFrame]);
    a38(ctx, c2, this.getAttr(), this.angle, this.model[0]);
    if (this.type == "landMine" && RD.pool[c3].thermal == 1) {
        let relPos = {
            x: this.x - c2.x,
            y: this.y - c2.y
        };
        ctx.strokeStyle = (this.ownerId == c3 || this.teamCode > 0 && this.teamCode == RD.pool[c3].teamCode) ? "#107a24" : "#ff0000";
        j22(ctx, relPos.x, relPos.y, 20);
        j22(ctx, relPos.x, relPos.y, 4);
    }
};


//yes i could use addEventListener but I felt like doing it this way anyway
document.onkeydown = keyEvent => {

    //prevents stupidness
    if (textBoxFocused && !keyEvent[ATTRIBUTE_ISFROMCHEAT]) return;

    let msg = instantchat[INSTANTCHAT_CHATBINDSTEXTS][keyEvent.keyCode],
        socket = RF.list[multiBox[MULTIBOX_SELECTEDSOCKET]],
        chatboxContainer = getElementById('chatboxContainer'),
        chatbox = getElementById('chatbox');

    //if the key code is the key code used to toggle the menu
    if ((!(j46 || c4) && includesInArray([keyCodeMap[KEYCODE_T], keyCodeMap[KEYCODE_SHIFT]], keyEvent.keyCode)) ||
    //if the chatbox is closed and if we are in a game
        (c4 && !j46 && (msg || includesInArray(Object.values(keyCodeMap), keyEvent.keyCode)))
    ) {
        keyEvent.preventDefault();
        handleUncomplicatedKeypress(keyEvent, msg);
    }

    //handle enter press
    if (keyEvent.keyCode == keyCodeMap[KEYCODE_ENTER] && c4 && !c28) handleEnterPress(socket, chatboxContainer, chatbox, keyEvent.shiftKey);

    //if ESC key pressed, simply close the chat input
    if (keyEvent.keyCode == keyCodeMap[KEYCODE_ESC] && j46) {
        divs.chatinput.blur();
        chatboxContainer.style[css_key_display] = css_value_misc_none;
        j46 = 0;
        keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], 7, 0);
    }
};

document.onkeyup = function (keyEvent) {
    if (!c4 || j46 || !includesInArray([68, 83, 65, 87, 82, 32, 45, 37, 38, 39, 40], keyEvent.keyCode)) return;
    keyEvent.preventDefault();
    switch (keyEvent.keyCode) {
        case keyCodeMap[KEYCODE_A]:
        case keyCodeMap[KEYCODE_ARROWLEFT]:
            keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], KEYPRESS_KEY_LEFT, KEYPRESS_STATE_OFF);
            break;
        case keyCodeMap[KEYCODE_D]:
        case keyCodeMap[KEYCODE_ARROWRIGHT]:
            keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], KEYPRESS_KEY_RIGHT, KEYPRESS_STATE_OFF);
            break;
        case keyCodeMap[KEYCODE_W]:
        case keyCodeMap[KEYCODE_ARROWUP]:
            keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], KEYPRESS_KEY_UP, KEYPRESS_STATE_OFF);
            break;
        case keyCodeMap[KEYCODE_S]:
        case keyCodeMap[KEYCODE_ARROWDOWN]:
            keyPress(multiBox[MULTIBOX_SELECTEDSOCKET], KEYPRESS_KEY_DOWN, KEYPRESS_STATE_OFF);
            break;
        case keyCodeMap[KEYCODE_R]:
            stopReloading(multiBox[MULTIBOX_SELECTEDSOCKET]);
            break;
        case keyCodeMap[KEYCODE_SPACE]:
            stopActivePerk(multiBox[MULTIBOX_SELECTEDSOCKET]);
            break;
    }
};

//game tick
a41 = () => {
    let start = Date.now(),
        renderDisplayPadding = 5,
        leaderboardLeft;

    //modified game loop tick
    if (!c4 && !b21 && window.location.pathname != '/model') a29();

    if (c3 != null) {

        if (1 !== esp[ESP_ZOOM]) {
            j7 = esp[ESP_ZOOM] ? 2000 : c2.width;
            j8 = esp[ESP_ZOOM] ? 1125 : c2.height;
            a1();
        }

        //shows landmines
        for (let i in landMine[0]) landMine[0][i][1][3] = esp[ESP_SHOWINVIS] ? '#000' : '#e8e8ed';

        j17 = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        c2[ATTRIBUTE_UPDATE]();
        drawFloor(ctx, c2);
        for (let entity of getPool(RA)) {
            if (!entity.activated || entity.type != 'landMine') continue;
            entity[ATTRIBUTE_UPDATE]();
            entity[ATTRIBUTE_DRAW]();
        }
        for (let bullet of getPool(RC)) {
            if (!bullet.activated) continue;
            bullet[ATTRIBUTE_UPDATE]();
            bullet[ATTRIBUTE_DRAW]();
        }
        for (let crate of getPool(RB)) {
            if (!crate.activated) continue;
            crate[ATTRIBUTE_UPDATE]();
            crate[ATTRIBUTE_DRAW]();
            if (!crate[ATTRIBUTE_HITBOX]) crate[ATTRIBUTE_MAKEHITBOX]();
        }
        for (let entity of getPool(RA)) {
            if (!entity.activated || entity.type == 'landMine') continue;
            if (!entity[ATTRIBUTE_TIMEALIVEEXTRA]) entity[ATTRIBUTE_TIMEALIVEEXTRA] = 0;
            entity[ATTRIBUTE_UPDATE]();
            entity[ATTRIBUTE_DRAW]();
        }
        for (let player of getPool(RD)) {
            if (!player.activated || (c28 && player.id == c3)) continue;
            player[ATTRIBUTE_UPDATE]();
            player[ATTRIBUTE_DRAWBODY]();
            player[ATTRIBUTE_DRAWGUN]();
        }
        for (let gas of getPool(RA)) if (gas.activated) gas.drawEmission(ctx, c2);
        for (let i in j27) {
            let hitParticle = j27[i];
            if (hitParticle.c42++ < 5) {
                j26(c2, hitParticle.x, hitParticle.y);
            } else {
                delete hitParticle[i];
            }
        }
        a55(ctx, c2);
        let me = RD.pool[c3];
        if (misc[MISC_STATICHUD]) {
            c5 = me.hp;
            c6 = me.armorAmount;
            c7 = me.score;
        }
        if (autoUpgrades[0]) autoUpgrade(multiBox[MULTIBOX_SELECTEDSOCKET], me);

        //fixes hud visual glitches
        //for some reason this works without major errors?
        j9 = [cursor.x, cursor.y];

        a9(me);
        drawMinimap(me);
        a13(ctx, c8);
        leaderboardLeft = drawLeaderBoard(ctx, j38);
    }
    a113();
    a56();

    if (misc[MISC_SHOWFEATURES]) showFeatures();

    //:trolleybus:
    j9[0] /= j6;
    j9[1] /= j5;

    //server latency display
    if (misc[MISC_PINGDISPLAY]) renderDisplayPadding += pingDisplay() + 10;

    //draw the time taken to draw everything in the last frame
    if (misc[MISC_RENDERDISPLAY]) renderDisplayPadding += renderDisplay(renderDisplayPadding) + 10;

    //only do shit when in a game, else the cheat breaks
    if (c2) {
        //important variable declarations
        let players = [], crates = [],
            me = RD.pool[c3],
            playerScreenPos = {
                x: me.x - c2.x,
                y: me.y - c2.y
            },
            offset = {
                x: nullPos.x - c2.x,
                y: nullPos.y - c2.y
            },
            animationSubtraction = ceil(RF.list[0][ATTRIBUTE_AVERAGEPING] / 2.5);

        //get all RELEVANT players and crates
        for (let player of getPool(RD)) if (player.activated && (esp[ESP_INCLUDEYOU] || player.id != me.id) && player.hp != 0) players.push(player);
        for (let crate of getPool(RB)) if (crate.activated) crates.push(crate);
        let {[ATTRIBUTE_ENEMIES]: enemies, [ATTRIBUTE_ENEMYFRIENDS]: enemyFriends} = getEnemies(me, players);

        if (misc[MISC_POSITION]) renderDisplayPadding += coordsDisplay(renderDisplayPadding, me) + 10;

        if (thnet[THNET_INFOSHARE]) thnetInfoShare(leaderboardLeft);
        ctx.font = 'bold 20px consolas';

        //cursor can control movement
        if (weird[WEIRD_CURSORMOVE]) {
            goToSpotWithPackets(multiBox[MULTIBOX_SELECTEDSOCKET], playerScreenPos, cursor);
            drawCircle(playerScreenPos, nullPos, 50, 2, '#444');
            for (let i = TAU / 16; i < TAU; i += TAU / 8) drawLine2(me, {x: sin(i) * 50, y: cos(i) * 50}, offset, 1, '#000');
            drawLine(playerScreenPos, cursor, nullPos, 2, '#000');
        }

        drawTracers(players, playerScreenPos, offset, animationSubtraction);

        drawTeamAffiliations(offset);

        if (!perkHacks[PERKHACKS_TICK]) aimMeAt({
            clientX: cursor.x / j6,
            clientY: cursor.y / j5
        }, 1);

        //no need to get a target if the setting isnt even activated
        let gun = gunMap[c1.weapon],
            target = doAimbotThings(me, offset, enemies, enemyFriends, crates, gunMinRange, playerScreenPos, gun);

        perkHacksAction(me, multiBox[MULTIBOX_SELECTEDSOCKET], playerScreenPos, offset, enemies, enemyFriends, crates, animationSubtraction);

        if (aimbot[AIMBOT_ENABLE] && aimbot[AIMBOT_WALLCHECK] && aimbot[AIMBOT_TRIGGERBOT]) {
            let bulletPathLength = ranges[gun] * velocities[gun] * ((o3[1] === perks[8] || o3[3] === perks[8]) ? 1.5 : 1),
                rangeSquared = (bulletPathLength * mathSin) ** 2 + (bulletPathLength * 0.5 + me[ATTRIBUTE_RADIUS]) ** 2;

            drawCircle(me, offset, sqrt(rangeSquared), 2, '#000');

            if (target[ATTRIBUTE_ENEMY] && !perkHacks[PERKHACKS_TICK] && target[ATTRIBUTE_DISTANCE] < rangeSquared && !(aimbot[AIMBOT_TRIGGERBOTWHENDOWN] && !cursor.isPressed)) {
                startGunfire(multiBox[MULTIBOX_SELECTEDSOCKET]);
            } else {
                stopGunfire(multiBox[MULTIBOX_SELECTEDSOCKET]);
            }
        }

        if (antiAim[ANTIAIM_DRAWREALAIM]) me[ATTRIBUTE_DRAWGUN](ctx, c2);

        hideAim(me, offset, animationSubtraction);

        //the  H A N D  of  P O W E R R R R R
        gun = gunMap[c1.weapon];
        let newAngle = (me.playerAngle + 210) * -degToRad,
            gunOffset = offsets[gun] + velocities[gun] - 14,
            gunAngle = (me.playerAngle + 270) * -degToRad,
            hand = { x: playerScreenPos.x + sin(newAngle) * me[ATTRIBUTE_RADIUS], y: playerScreenPos.y + cos(newAngle) * me[ATTRIBUTE_RADIUS] },
            gunEnd = { x: hand.x + sin(gunAngle) * gunOffset, y: hand.y + cos(gunAngle) * gunOffset };

        //draw a laser from the gun to the mouse cursor
        if (esp[ESP_TRACERSGUN]) {
            //scuffed
            drawLine2(hand, {x: j9[0] - hand.x, y: j9[1] - hand.y}, nullPos, 1, '#000');
            drawCircle(gunEnd, nullPos, 1, 2, 'red');
        }

        gunMinRange = (me.x + offset.x - gunEnd.x) ** 2 + (me.y + offset.y - gunEnd.y) ** 2;

        //update the server with our new aiming direction
        sendMousePositionToServer(multiBox[MULTIBOX_SELECTEDSOCKET]);

        //auto reload the gun if: not fully reloaded, not currently reloading, there are no enemies nearby, the player isnt shooting for no reason
        //reloads by pressing R to tell game to reload the gun
        if (misc[MISC_AUTORELOAD] && !(enemies.length || cursor.isPressed || me.shooting || me.reloading || me.maxBullets == me.currentBullets)) {
            startReloading(multiBox[MULTIBOX_SELECTEDSOCKET]);
        } else {
            stopReloading(multiBox[MULTIBOX_SELECTEDSOCKET]);
        }

        //if any menu is needing a canvas right now
        updateMenuCanvas(me, offset, players, crates);
    }

    tickCount++;

    //simplified next tick delay function
    if (RF.list[0]) RF.list[0].check();

    //guarantees that the next tick will happen in 16 since when this tick started
    //NOTE: nope it fucking doesnt, setTimeout is inaccurate
    renderTime = Date.now() - start;
    setTimeout(a41, (40 / advanced[ADVANCED_TPS]) - renderTime);
};

a45 = () => {
    if (!b15) a93();
    a4();
    a75();
    b4 = null;
    b38 = null;
    selfPremiumMember = 0;
    b3 = 0;
    b2 = 0;
    b1 = 0;
    $('#hostServerTabLi').hide();
    $('#playButton').hide();
    applyStyle(getElementById('gametypeDropdown'), {
        [css_key_display]: css_value_misc_block
    });
    applyStyle(getElementById('serversBtn'), {
        [css_key_display]: css_value_misc_flex
    });
    a99();
};

reloadGame = () => a120(o4.server, c22);

play = () => {
    let socket = RF.list[multiBox[MULTIBOX_SELECTEDSOCKET]];
    if (socket === undefVar) return;
    if (!c4) socket.send(a59('c1', {class: c1.weapon, armor: c1.armor, color: c1.color}));
    b21 = 1;
    c8 = {1: 0, 2: 0, 3: 0};
    o3 = {1: '', 2: '', 3: ''};
    a2('c1', c1.weapon + ',' + c1.armor + ',' + c1.armorBtn + ',' + c1.color, 365);
};

//make the hack menu
loadSettings();
createMenu();

//keeping track of the mouse's actual position
document.onmousemove = mouseEvent => {

    //future proofing
    if (!mouseEvent.isTrusted) return;

    cursor.x = mouseEvent.clientX;
    cursor.y = mouseEvent.clientY;
    for (let movableWindow of movableWindows) {
        if (movableWindow.enable) {
            applyStyle(movableWindow.element, {
                [css_key_left]: (cursor.x - movableWindow.offsetX) + 'px',
                [css_key_top]: (cursor.y - movableWindow.offsetY) + 'px'
            });
        }
    }
    fixWindowPositions();
};

window.onresize = () => {
    fixWindowPositions();
    a1();
    if (null == c3) return;
    c2[ATTRIBUTE_UPDATE](1);
    drawFloor(ctx, c2);
    for (let entity of getPool(RA)) if (entity.activated || entity.type == 'landMine') entity[ATTRIBUTE_DRAW]();
    for (let bullet of getPool(RC)) if (bullet.activated) bullet[ATTRIBUTE_DRAW]();
    for (let crate of getPool(RB)) if (crate.activated) crate[ATTRIBUTE_DRAW]();
    for (let entity of getPool(RA)) if (entity.activated && entity.type != 'landMine') entity[ATTRIBUTE_DRAW]();
    for (let player of getPool(RD)) {
        if (!player.activated || (c28 && player.id == c3)) continue;
        player[ATTRIBUTE_DRAWBODY]();
        player[ATTRIBUTE_DRAWGUN]();
    }
    for (let gas of getPool(RA)) if (gas.activated) gas.drawEmission(ctx, c2);
    for (let i in j27) {
        let hitParticle = j27[i];
        if (hitParticle.c42 < 5) {
            j26(c2, hitParticle.x, hitParticle.y);
        } else {
            delete hitParticle[i];
        }
    }

    a55(ctx, c2);
    j9 = [cursor.x, cursor.y];
    let me = RD.pool[c3];
    a9(me);
    drawMinimap(me);
    a13(ctx, c8);
    drawLeaderBoard(ctx, j38);
    showFeatures();
};

//adblock
a36=a119=a78=a79=a80=()=>{};
for (let ad of j36) {
    //to make it work with Gats.io Adblocker without it crashing
    let element = getElementById(ad.pl);
    if (element) element.remove();
}

if (c2) c2 = new RE(c2);

document.onmouseup=()=>{};
document.onmousedown=()=>{};
canvas.onmouseup = gameMouseUp;
canvas.onmousedown = gameMouseDown;

canvas.onwheel = E => {
    if (esp[ESP_ZOOM] != 1) return;
    E.preventDefault();
    let dir = sign(E.deltaY);
    if (dir == 1) {
        j7 *= esp[ESP_SCROLLSENSITIVITY];
        j8 *= esp[ESP_SCROLLSENSITIVITY];
    }
    if (dir == -1) {
        j7 /= esp[ESP_SCROLLSENSITIVITY];
        j8 /= esp[ESP_SCROLLSENSITIVITY];
    }
    a1();
};

window.onbeforeunload = event => {
    if (b3 && !misc[MISC_DISABLECLOSEPOPUP]) {
        event.preventDefault();
        return event.returnValue = "You're still logged in. Are you sure you want to leave?";
    }
};

//if loading during a game, hook the game socket
if (RF.list && RF.list[0] && RF.list[0].socket && RF.list[0].socket.url == RF.list[0].connectHostname) RF.list[0].socket.onmessage = function (wsMsgEvent) {
    if (recorder[RECORDER_ISRECORDING]) recorder[RECORDER_CURRENT].push([Date.now(), wsMsgEvent.data]);
    handleMessage(0, wsMsgEvent);
};

//sync player attributes to prevent fatal bugs
for (let player of getPool(RD)) {
    if (player.activated) {
        player[ATTRIBUTE_RADIUS] = player.radius;
        player[ATTRIBUTE_HPRADIUS] = player.hpRadius;
        player[ATTRIBUTE_ACCX] = player[ATTRIBUTE_ACCY] = 0;
        setNameVariations(player, player.username);
    }
}

//instant reconnect attempt on load
if (getElementById('reconnectButton').style[css_key_display] == css_value_misc_block) reloadGame();

//just making some stuff look better
applyStyle(getElementById('playButton'), {
    [css_key_height]: css_value_length_px55,
    [css_key_marginTop]: css_value_length_px0,
    [css_key_borderWidth]: css_value_length_px4
});
applyStyle(getElementById('reconnectButton'), {
    [css_key_height]: css_value_length_px55,
    [css_key_marginTop]: css_value_length_px0,
    [css_key_borderWidth]: css_value_length_px4,
    [css_key_borderColor]: css_value_color_777f
});

})();