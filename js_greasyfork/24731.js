// ==UserScript==
// @name         Toradorable Alis.io
// @version      1.2.17
// @description  A Toradorable skin changer supporting multiple animations and variable image display times, Minimizes chat lag by using a custom skin updating function, and Adds in auto/instant-respawn. Includes a UI. To use, press "C" in game to cycle between different animations.
// @author       Toradorable
// @match        http://alis.io/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @namespace    http://tampermonkey.net/
// @require      https://cdnjs.cloudflare.com/ajax/libs/dragula/3.7.2/dragula.min.js
// @require https://greasyfork.org/scripts/24894-toradorable-animator/code/Toradorable%20Animator.js?version=159298
// @downloadURL https://update.greasyfork.org/scripts/24731/Toradorable%20Alisio.user.js
// @updateURL https://update.greasyfork.org/scripts/24731/Toradorable%20Alisio.meta.js
// ==/UserScript==
//debugger;
// @require      https://greasyfork.org/scripts/24844-toradorable-animation-for-toradorable-skin-changer/code/Toradorable%20Animation%20for%20Toradorable%20Skin%20Changer.js
// @require      https://greasyfork.org/scripts/24901-iwubbz-s-candy-animation-for-toradorable-skin-changer/code/iWubbz's%20Candy%20Animation%20for%20Toradorable%20Skin%20Changer.js
// @require https://greasyfork.org/scripts/24859-dabasaur-animation-for-toradorable-skin-changer/code/Dabasaur%20Animation%20for%20Toradorable%20Skin%20Changer.js

var window = unsafeWindow;
// FB content takes forever to load for me.
//window.FB={val:true};
function importAnimation(src) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = src;
    document.body.appendChild(script);
    return script;
}
function importCSS(src) {
    var script = document.createElement('link');
    script.type = "text/css";
    script.rel='stylesheet';
    script.href = src;
    document.head.appendChild(script);
    return script;
}
importCSS('https://cdnjs.cloudflare.com/ajax/libs/dragula/3.7.2/dragula.min.css');

// To use, press "C" in game to cycle between different animations. Animation being used is displayed on the right sidebar.

// 1st press turns animation on, 2nd press turns it off and selects the next animation,
// 3rd press turns the animation on and so on.

// NOTE: Anything after two slashes ("//") or inbetween a "/*" and a "*/" are comments, they do nothing and can be safely removed

// This is my Toradorable skinchanger script with most hackery removed.
// If my full script were posted, Taiga would get ticked off from all the trolling and within 2-3 minutes I would be beaten to a pulp.

/* NOTE: To Add more animations, appended to the list below. 
 * The first element in the skin array is the display time in milliseconds. 1000 milliseconds = 1 second,
 * Second element is the url to display.
 * Format:
{   name: "Replace With Name Of Your Animation", // This will be displayed in the sidebar to the right of the screen
    skin: [
        HowLongToShowFirstImageInMilliseconds, "replace/with/url/for/1st.img",
        HowLongToShowSeccondImageInMilliseconds, "url/for/2nd.img",
        etcetera, "etcetera",
]}
 * Look in the skinList for examples.
 */

// Skin Lists



var animator = new ToradorableAnimator();






if ((typeof animator !== 'object')) {
    alert("animator object does not exist. be sure to add " +
          "//@require https://greasyfork.org/scripts/24894-toradorable-animator/code/Toradorable%20Animator.js\n" +
          "To your script");
}
window.animator=animator;

if (animator.animations.length === 0) {
var defaultspeed=100;
animator.addAnimations(
    {title:"Toradorable",
     frames: [
         {time: 500, url: "https://s22.postimg.org/jha3867up/image.png"},
         {time: 500, url: "https://s22.postimg.org/jrhlrimgx/image.png"},
         {time: 500, url: "https://s22.postimg.org/6xjjy691d/image.png"},
         {time: 500, url: "https://s22.postimg.org/idpyw7n7l/Ra2.png"},
         {time: 500, url: "https://s22.postimg.org/inxhfk1tt/exclam.png"},
         {time: 2000, url: "https://s18.postimg.org/tl8xraeux/Taiga_square.png"}
     ]},
    {title:"Chuunibyou",
    defaultDisplayTime: 100,
    frames:[
        {time: 125, url: "https://s12.postimg.org/6vwrv8z5p/frame_0_delay_0_25s.gif"},
        {url: "https://s12.postimg.org/fs7jz6prx/frame_1_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/68xv5q29p/frame_2_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/furfm0tfh/frame_3_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/axdv0wrgd/frame_4_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/r9nwqn5rx/frame_5_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/7ggebohrx/frame_6_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/iu2xmvsal/frame_7_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/4ox4l2j99/frame_8_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/89t04anst/frame_9_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/4rh07wmwt/frame_10_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/4fzjv56gt/frame_11_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/ai76lmuwt/frame_12_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/ktjjeamm5/frame_13_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/qvr64sb25/frame_14_delay_0_1s.gif"},
        {time: 125, url: "https://s12.postimg.org/xaq71ghrx/frame_15_delay_0_25s.gif"},
        {url: "https://s12.postimg.org/5c0moc5j1/frame_16_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/yfoukktml/frame_17_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/8y6g0zbwd/frame_18_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/ar9cpax31/frame_19_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/6jekgjvnh/frame_20_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/imjw446pp/frame_21_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/l55l4ssfx/frame_22_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/f5hu157nh/frame_23_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/e4hlc0qnx/frame_24_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/a9e79g7i5/frame_25_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/73y6wze9p/frame_26_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/qzu6civb1/frame_27_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/lcxtf1ssd/frame_28_delay_0_1s.gif"},
        {url: "https://s12.postimg.org/537nc5i4d/frame_29_delay_0_1s.gif"}
    ]},
    {title:"Neon Cat",
    	frames: [
        {time: 030, url: "https://s18.postimg.org/h1w6ml4s9/frame_0_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/o6dzvmc1l/frame_1_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/fcn3eip2x/frame_2_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/wr7bmsm7t/frame_3_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/4sd5vxkl5/frame_4_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/auksmf915/frame_5_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/3smv085fd/frame_6_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/khoaw520p/frame_7_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/bb608uws9/frame_8_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/kx462wdbt/frame_9_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/z4turjq0p/frame_10_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/ytcees9kp/frame_11_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/4d6hgno1l/frame_12_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/5gqlsm8op/frame_13_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/ago20kebd/frame_14_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/7b3gacvp5/frame_15_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/vsvjy8y9l/frame_16_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/6bd5engjd/frame_17_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/xzzsm63jt/frame_18_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/fltuvxgmx/frame_19_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/fn3spcigp/frame_20_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/jxigkxnjt/frame_21_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/uydlpyfsp/frame_22_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/wrgiea0zd/frame_23_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/bj2twumih/frame_24_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/ks506yveh/frame_25_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/j1lz5hdvd/frame_26_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/ba596x9q1/frame_27_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/hp4a3lgft/frame_28_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/6e67syyyh/frame_29_delay_0_03s.gif"},
        {time: 070, url: "https://s18.postimg.org/qmtleoy9l/frame_30_delay_0_07s.gif"},
        {time: 070, url: "https://s18.postimg.org/foibwi9o9/frame_31_delay_0_07s.gif"},
        {time: 070, url: "https://s18.postimg.org/s4f1q9309/frame_32_delay_0_07s.gif"},
        {time: 070, url: "https://s18.postimg.org/548edx56h/frame_33_delay_0_07s.gif"},
        {time: 030, url: "https://s18.postimg.org/3qgrim5x5/frame_34_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/3rqpc17qx/frame_35_delay_0_03s.gif"},
        {time: 070, url: "https://s18.postimg.org/aw8il2f09/frame_36_delay_0_07s.gif"},
        {time: 070, url: "https://s18.postimg.org/td2xbvuyh/frame_37_delay_0_07s.gif"},
        {time: 070, url: "https://s18.postimg.org/ndf688a61/frame_38_delay_0_07s.gif"},
        {time: 030, url: "https://s18.postimg.org/dhiombtrt/frame_39_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/km0hvd115/frame_40_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/4p1pyn8mx/frame_41_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/u94052u0p/frame_42_delay_0_03s.gif"},
        {time: 070, url: "https://s18.postimg.org/4rlllhcah/frame_43_delay_0_07s.gif"},
        {time: 070, url: "https://s18.postimg.org/tm53fjx4p/frame_44_delay_0_07s.gif"},
        {time: 070, url: "https://s18.postimg.org/4he324xo9/frame_45_delay_0_07s.gif"},
        {time: 030, url: "https://s18.postimg.org/j1v5wysmx/frame_46_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/baefyeohl/frame_47_delay_0_03s.gif"},
        {time: 070, url: "https://s18.postimg.org/ndjrlyzjt/frame_48_delay_0_07s.gif"},
        {time: 030, url: "https://s18.postimg.org/3kc970bjt/frame_49_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/b1lgm812x/frame_50_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/g1iwu66pl/frame_51_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/i7d7ooa61/frame_52_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/5u0dhrkhl/frame_53_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/8cm2ig67t/frame_54_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/5jsuyf5vd/frame_55_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/yapoohbp5/frame_56_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/q6hkjqpa1/frame_57_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/dgdc6nhbt/frame_58_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/anoq0d6d5/frame_59_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/ctj0uv9tl/frame_60_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/jy0u3wh2x/frame_61_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/w165rgs55/frame_62_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/nk6ngjng9/frame_63_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/tz5od7u61/frame_64_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/3s4hh9bw9/frame_65_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/j24cog7eh/frame_66_delay_0_03s.gif"},
        {time: 070, url: "https://s18.postimg.org/tq83nahdl/frame_67_delay_0_07s.gif"},
        {time: 070, url: "https://s18.postimg.org/uh0tt2jqx/frame_68_delay_0_07s.gif"},
        {time: 070, url: "https://s18.postimg.org/ou929c6m1/frame_69_delay_0_07s.gif"},
        {time: 070, url: "https://s18.postimg.org/3ymry3aex/frame_70_delay_0_07s.gif"},
        {time: 030, url: "https://s18.postimg.org/y4l6cvhbt/frame_71_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/dyhodzlo9/frame_72_delay_0_03s.gif"},
        {time: 070, url: "https://s18.postimg.org/4f7zkiy61/frame_73_delay_0_07s.gif"},
        {time: 030, url: "https://s18.postimg.org/4t9bk4i9l/frame_74_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/b88cgsozd/frame_75_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/58kld546x/frame_76_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/ptzd51lrt/frame_77_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/lm4kwakc9/frame_78_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/govlox7qx/frame_79_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/ysym9k5fd/frame_80_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/c5jd3epvd/frame_81_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/53lfh7m9l/frame_82_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/kqcoul01l/frame_83_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/h80oy6z5l/frame_84_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/tb60lra7t/frame_85_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/w6j3sme7t/frame_86_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/fk1jjjla1/frame_87_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/7ftfesyux/frame_88_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/d5e9cuuex/frame_89_delay_0_03s.gif"},
        {time: 070, url: "https://s18.postimg.org/jkda9j14p/frame_90_delay_0_07s.gif"},
        {time: 070, url: "https://s18.postimg.org/rr5a13r7d/frame_91_delay_0_07s.gif"},
        {time: 030, url: "https://s18.postimg.org/5t8t7bc6x/frame_92_delay_0_03s.gif"},
        {time: 030, url: "https://s18.postimg.org/9qw2wpz09/frame_93_delay_0_03s.gif"},
        {time: 070, url: "https://s18.postimg.org/ylfkqsjuh/frame_94_delay_0_07s.gif"},
        {time: 070, url: "https://s18.postimg.org/xx6q7ul4p/frame_95_delay_0_07s.gif"},
        {time: 070, url: "https://s18.postimg.org/e3umf57qx/frame_96_delay_0_07s.gif"},
        {time: 070, url: "https://s18.postimg.org/fk64xaant/frame_97_delay_0_07s.gif"},
        {time: 030, url: "https://s18.postimg.org/z3aq6n9fd/frame_98_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/orgqbzq37/frame_99_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/zfkhau02b/frame_100_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/n2c8hnzrn/frame_101_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/j78uf3glv/frame_102_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/ms4pybl5f/frame_103_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/succot9lf/frame_104_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/nwys3p7mb/frame_105_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/ffz9ss2xf/frame_106_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/6yzrhuy8j/frame_107_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/vgrv5r0sz/frame_108_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/sb79fji6r/frame_109_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/galtetas3/frame_110_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/3xdklnahf/frame_111_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/qalb8gbf7/frame_112_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/ok2a6ytw3/frame_113_delay_0_03s.gif"},
        {time: 070, url: "https://s3.postimg.org/6ij595zv7/frame_114_delay_0_07s.gif"},
        {time: 070, url: "https://s3.postimg.org/5uaaq815f/frame_115_delay_0_07s.gif"},
        {time: 030, url: "https://s3.postimg.org/5vk8jn2z7/frame_116_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/syarit4gj/frame_117_delay_0_03s.gif"},
        {time: 070, url: "https://s3.postimg.org/3tjr5e503/frame_118_delay_0_07s.gif"},
        {time: 070, url: "https://s3.postimg.org/59v9nj7wz/frame_119_delay_0_07s.gif"},
        {time: 070, url: "https://s3.postimg.org/72y6but3n/frame_120_delay_0_07s.gif"},
        {time: 070, url: "https://s3.postimg.org/3kqrt7hlf/frame_121_delay_0_07s.gif"},
        {time: 030, url: "https://s3.postimg.org/xdxs1t68j/frame_122_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/aqiivnqoj/frame_123_delay_0_03s.gif"},
        {time: 070, url: "https://s3.postimg.org/53m5y6o5v/frame_124_delay_0_07s.gif"},
        {time: 070, url: "https://s3.postimg.org/54w3rlpzn/frame_125_delay_0_07s.gif"},
        {time: 030, url: "https://s3.postimg.org/nyhwolo7n/frame_126_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/5wyrqsu6r/frame_127_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/qidjipbrn/frame_128_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/yce543jkj/frame_129_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/3w885yy1f/frame_130_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/3kvd6y6z7/frame_131_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/j7mmkbkr7/frame_132_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/6u9sdev2r/frame_133_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/m49nklqkz/frame_134_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/ub1nc6gnn/frame_135_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/lhaqv2toz/frame_136_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/qh8730zbn/frame_137_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/6b4p453o3/frame_138_delay_0_03s.gif"},
        {time: 030, url: "https://s3.postimg.org/iea0rpeqb/frame_139_delay_0_03s.gif"}
        ]},
        {title:"Dancing Cat",
        	frames: [
        		{time: 500, url: "https://s11.postimg.org/51bh2tc6r/frame_0_delay_0_5s.gif", nick: "Cat"},
        		{time: 500, url: "https://s11.postimg.org/uy55fffub/frame_1_delay_0_5s.gif", nick: "I Am A Cat"},
        		{time: 800, url: "https://s11.postimg.org/po06o4vlf/frame_2_delay_0_8s.gif", nick: "I Am A Cat"},
        		{time: 200, url: "https://s11.postimg.org/8or88vkdv/frame_3_delay_0_2s.gif", nick: "And I"},
        		{time: 200, url: "https://s11.postimg.org/nyr3g2fw3/frame_4_delay_0_2s.gif", nick: "Dance"},
        		{time: 200, url: "https://s11.postimg.org/6zi50t4oj/frame_5_delay_0_2s.gif", nick: "Dance Dance"},
        		{time: 200, url: "https://s11.postimg.org/coydl4aur/frame_6_delay_0_2s.gif", nick: "Dance Dance Dance"},
        		{time: 200, url: "https://s11.postimg.org/dsihx2vhv/frame_7_delay_0_2s.gif", nick: "And I"},
        		{time: 200, url: "https://s11.postimg.org/6dxrifz03/frame_8_delay_0_2s.gif", nick: "Dance"},
        		{time: 200, url: "https://s11.postimg.org/74qho81df/frame_9_delay_0_2s.gif", nick: "Dance Dance"},
        		{time: 500, url: "https://s11.postimg.org/p8ti8uz1v/frame_10_delay_0_5s.gif", nick: "Dance Dance Dance"}
		]},
	{title:"Dino",
		frames:[
			{time: 40, url: "https://s9.postimg.org/j058kibqn/frame_0_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/uqj61w4j3/frame_1_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/bzh8rq9yn/frame_2_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/os5crnlkf/frame_3_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/v78z22hnz/frame_4_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/xpuo2r3e7/frame_5_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/xed7pzmy7/frame_6_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/vnu6oi5f3/frame_7_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/6vukh9o8f/frame_8_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/bvs0p7tv3/frame_9_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/aurs03cvj/frame_10_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/3studw99r/frame_11_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/jfl3r9n1r/frame_12_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/9wbexszjj/frame_13_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/49jne2men/frame_14_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/oi70zslpr/frame_15_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/gdywv1zan/frame_16_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/u8x7ditpr/frame_17_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/njqnxi8dr/frame_18_delay_0_04s.gif"},
			{time: 40, url: "https://s9.postimg.org/4fxch5vjj/frame_19_delay_0_04s.gif"}
	]}
);
}

animator.init();
animator.ui.showAnimations();


//importAnimation("https://greasyfork.org/scripts/24860-neon-cat-animation-for-toradorable-skin-changer/code/Neon%20Cat%20Animation%20for%20Toradorable%20Skin%20Changer.js");
var autoJoinGameContainer = document.createElement("div");
autoJoinGameContainer.class="checkbox";

var autoJoinGameLabel = document.getElementsByClassName("checkbox")[0].children[0].cloneNode(true);
document.getElementById('home').insertBefore(autoJoinGameContainer,document.getElementById("skin_row"));
autoJoinGameLabel.children[0].id="autoJoinGame";
autoJoinGameContainer.appendChild(autoJoinGameLabel);
autoJoinGameContainer.innerHTML = autoJoinGameContainer.innerHTML + ' Auto Join Game';
var autoJoinGame = document.getElementById('autoJoinGame');
autoJoinGame.checked=true;

/* Add Animation Example 
animator.addAnimation({
    title: "Name Of Your Animation",
    // Optional Default display time, used when/if a frame does not have a time specified.
    defaultDisplayTime: 1000,
    frames: [
       //time: Optional display time for this frame in milliseconds,
       //url: "http://Link/To/Your/Image.png",
       //nick: "Optional Nick to use if applicable. Most sites do not allow you to change your nick in game."
         {time: 500, url: "https://s22.postimg.org/jha3867up/image.png", nick: "To"},
         {time: 500, url: "https://s22.postimg.org/jrhlrimgx/image.png", nick: "Ra"},
         {time: 500, url: "https://s22.postimg.org/6xjjy691d/image.png", nick: "Do"},
         {time: 500, url: "https://s22.postimg.org/idpyw7n7l/Ra2.png", nick: "Ra"},
         {time: 500, url: "https://s22.postimg.org/inxhfk1tt/exclam.png", nick: "!"},
         {time: 2000, url: "https://s18.postimg.org/tl8xraeux/Taiga_square.png", nick: "Toradora!"}
    ]
})
 *
 * Example of importing a skinList,
animator.importSkinList(
    // First argument is a skin list array.
    // Below is iWubbz's candy skinList as found on
    // https://greasyfork.org/en/scripts/23677-iwubbz-candy-skin-changer/code
    ["http://i.imgur.com/1JQqUzR.png",
     "http://i.imgur.com/VKcEy4k.png",
     "http://i.imgur.com/FKsf0PC.png",
     "http://i.imgur.com/zg6Oxzo.png",
     "http://i.imgur.com/EPawa6H.png",
     "http://i.imgur.com/NyKl8tG.png"
    ],
    // Second argument is optional. However, I recomend setting title at the least.
    //defaultDisplayTime is 1000 (1 second) by default.
    //All frames will be displayed for defaultDisplayTime milliseconds.
    //Use animator.addAnimation if you want different display times per frame.
    {title: "iWubbz's Candy", defaultDisplayTime: 5000}
);
 * ^^ Importing skin lists is as easy as stealing candy from iWubbz. ^^
*/

// Initialize UI After adding all animations

/*var initUiScript = document.createElement('script');
initUiScript.type = "text/javascript";
initUiScript.innerHTML = "window.animator.site.initilaizeUI();";
document.body.appendChild(initUiScript);*/
//setTimeout(function() { animator.site.initilaizeUI(); }, 2000);
//animator.site.initilaizeUI();
// Activation Status
var skinChangerWanted = false;

// Auto Join Games when Dead
//var autoJoinGame = true;


/*
 * Setup Hotkeys
 * FIXME: hot key saving realy does not work... It seems like it works on one part, but new values do not discard old values, causeing conflicts.
 */
var hotKeyTable = document.getElementById("hotkey_table");
var hotkeyMappingREV={};
var tmphotkeyMapping=JSON.parse(getLocalStorage("hotkeyMapping"));
for (var prop in tmphotkeyMapping) {
	hotkeyMappingREV[tmphotkeyMapping[prop]]=prop;
}

function AddHotKey(hk) {
	var hkdefault = {
	    id: "hk_change_my_hotkey_id",
	    defaultHotkey: "",
	    key: null,
	    description: "Change My Description",
	    keyDown: null,
	    keyUp: null,
	    type: "NORMAL"
	};
	hk = Object.assign(hkdefault,hk);
	if (! hk.key || hk.key === null) hk.key = hotkeyMappingREV[hk.id];
	if (! hk.key || hk.key === null) hk.key = hk.defaultHotkey;
	var hk_element = hotKeyTable.lastChild.cloneNode(true);
	hk_element.children[0].dataset.hotkeyid = hk.id;
	hk_element.children[0].innerHTML=hk.key;
	hk_element.children[1].innerHTML=hk.description;
	hk_element.children[2].innerHTML="/";
	console.log("Adding Hotkey: " + hk);
	hotKeyTable.appendChild(hk_element);
	
	hotkeyConfig[hk.id]= {
	    defaultHotkey: hk.defaultHotkey,
	    name: hk.description,
	    keyDown: hk.keyDown,
	    type: hk.type
	};
	hotkeyMapping[hk.key] = hk.id;
	return hk_element;
}



/*
var hk_AutoStealNearbySkin = AddHotKey({
id: "hk_AutoStealNearbySkin",
defaultHotkey: "M",
description: "Start/Stop Auto-Stealing Nearby Skin",
keyDown: function() {    }
});
*/
var hk_ReconnectToServer = AddHotKey({
id: "hk_ReconnectToServer",
defaultHotkey: "L",
description: "Reconnect to Server",
keyDown: function() {
    connect(myApp.getCurrentPartyCode());
    RefreshSkinIn(1200);
}
});
function NextSkin() {
    skinidx++;
    if(skinidx >= skinList.length) {skinidx = 0;}
    SkinListBox.selectedIndex =skinidx;
}
function PrevSkin() {
    skinidx--;
    if(skinidx < 0) {skinidx = skinList.length - 1;}
    SkinListBox.selectedIndex =skinidx;
}
var haveUsedSkin=false;
var hk_CycleSkinRotator = AddHotKey({
id: "hk_CycleSkinRotator",
defaultHotkey: "C",
description: "Cycle Skin Rotator",
keyDown: function() { 
    if (animator.isPlaying) {
        animator.pauseAnimation();
        animator.nextAnimation();
        //LagOnce();
    } else {
        animator.playAnimation();
    }
    //UpdateTargetBox();
}
});
//myApp.refreshHotkeySettingPage();

//myApp.restoreSetting();

myApp.setUpHotKeyConfigPage();

/*********************
 * Generic Functions *
 *********************/


function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function Print(msg) {
	console.log(msg);
}


/******************
 * Global Overrides
 ******************/
//Function override. Allow sending messages when dead
myApp["onDead"] = function() {
    isJoinedGame = false;
    $(".btn-spectate")["prop"]("disabled", false);
    $("#nick")["prop"]("disabled", false);
    $(".nav")["show"]();
    // Auto Respawn
    if (autoJoinGame.checked) setNick(document.getElementById('nick').value);
    // Below forces you out of chat when dead.
    // I hated when I lost the message I was typing because someone ate me when I sent it,
    // So I disabled it.
    // conn["leaveRoom"](myApp["getRoom"]());
};


/*****************
** Custom Hot Keys
******************/

const keycodes={
    backspace:8,    tab:9,         enter:13,
    shift:16,       ctrl:17,       alt:18,
    pause_break:19, capslock:20,   escape:27,
    space:32,       pageup:33,     pagedown:34,
    end:35,         home:36,       leftarrow:37,
    uparrow:38,     rightarrow:39, downarrow:40,
    insert:45,      delete:46,
    0:48,   1:49,   2:50,   3:51,
    4:52,   5:53,   6:54,   7:55,
    8:56,   9:57,   a:65,   b:66,
    c:67,   d:68,   e:69,   f:70,
    g:71,   h:72,   i:73,   j:74,
    k:75,   l:76,   m:77,   n:78,
    o:79,   p:80,   q:81,   r:82,
    s:83,   t:84,   u:85,   v:86,
    w:87,   x:88,   y:89,   z:90,
    multiply: 106, add: 107, subtract: 109,
    decimalpoint: 110, divide: 111,
    f1: 112, f2: 113, f3: 114,
    f4: 115, f5: 116, f6: 117,
    f7: 118, f8: 119, f9: 120,
    f10: 121, f11: 122, f12: 123,
    numlock: 144, scrolllock: 145,
    semicolon: 186, equalsign: 187,
    comma: 188, dash: 189, period: 190,
    forwardslash: 191, graveaccent: 192,
    openbracket: 219, backslash: 220,
    closebraket: 221, singlequote: 222
};

window.addEventListener('keydown', keydown);
function keydown(e) {
    var chatArea=$("#chatboxArea2");
    var chatIsFocused=$("#input_box2").is(':focus') || $("#LieAsElm").is(':focus') || $("#StealSkinElm").is(':focus');
   /*if(e.keyCode === keycodes.c && !(chatIsFocused)) {
        if (skinChangerWanted && !skinChanger) {
            RefreshSkin(0,true);
            //LagOnce();
        } else if(skinChangerWanted) {
            skinChangerWanted=false;
            skinChanger=false;
        } else {
            skinChangerWanted=true;
            skinChanger=true;
            skinidx++;
            if(skinidx >= skinList.length) {skinidx = 0;}
            AutoChangeSkin();
        }
    }
    else */ if(e.keyCode === 27) {
        animator.pauseAnimation();
        //temporary workaround to StealSkin/FakeSkin/ HotKey "M" Problem 
        $("#overlays")["show"]();
    }
    else if(e.keyCode === keycodes.add && !(chatIsFocused)) {
        //naservers();
        animator.incrementSpeedMultiplier();
    } else if(e.keyCode === keycodes.subtract && !(chatIsFocused)) {
        //naservers();
        animator.decrementSpeedMultiplier();
    } else if(e.keyCode === keycodes[0] && !(chatIsFocused)) {
        //naservers();
        animator.speedMultiplier=1;
    }
    /*else if(e.keyCode === keycodes.l && !(chatIsFocused)) {
        //naservers();
        connect(myApp.getCurrentPartyCode());
    }*/
    /*else if((e.keyCode === keycodes.space || e.keyCode === keycodes.t) && !IsDoingFireork && !($("#chatboxArea2").is(":focus"))) {
        fireworkidx=0;
        Firework();
    }*/
}

// FIXME Im not sure what I was doing here
function HasRestarted() {
    if (testHasRestarted >=5) {
        testHasRestarted=0;
    } else {
        testHasRestarted++;
        return false;
    }
    var myCell;
    try {
        if(typeof getCell != 'function') throw "GetCell is NotAFunc";
        myCell=getCell();
        if(myCell === undefined) throw "GetCell Returned null";
        if(myCell[0] === undefined) throw "CellDataEmpty";
        if(myCell[0].x === undefined) throw "Cell has no X";
        FailCount=0;
    }
    catch(err) {
        console.log(err," ",FailCount);
        myCell=null;
        FailCount++;
    }
    finally {
        if (FailCount >= 5) return true;
        else if (FailCount !== 0) return false;
        myCell=myCell[0];
    }
    if (LastXY[0] != myCell.x || LastXY[1] != myCell.y) {
        LastXY=[myCell.x,myCell.y];
        return false;
    }
    var LB = getLB();
    if (LB.length != 9) return false;
    for (var i=0; i < 8; i++) { // Leaderboard 1-8 should be named RESTART
        if (LB[i].name != "RESTART") return false;
    }
    // Leaderboard 9 should be named ALIS.IO
    if (LB[8].name != "ALIS.IO") return false;
    return true;
}


/*************************
 * Skin Changing Functions
 *************************/

// Method for overloading global functions directly (functions in objects dont need this)
function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';
    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}



