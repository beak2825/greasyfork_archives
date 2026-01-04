// ==UserScript==
// @name         dianping
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.dianping.com/*/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.4/clipboard.min.js

// @downloadURL https://update.greasyfork.org/scripts/386610/dianping.user.js
// @updateURL https://update.greasyfork.org/scripts/386610/dianping.meta.js
// ==/UserScript==

function replace_num(phone_){
    var phone=phone_.replace(/\uec2d/g,"0");
    phone=phone.replace(/\ue4ff/g,"2");
    phone=phone.replace(/\uf70d/g,"3");
    phone=phone.replace(/\ue6ec/g,"4");
    phone=phone.replace(/\uf404/g,"5");
    phone=phone.replace(/\ue65d/g,"6");
    phone=phone.replace(/\ue284/g,"7");
    phone=phone.replace(/\uf810/g,"8");
    phone=phone.replace(/\ue27b/g,"9");
    return phone
}


function toHex(str) {
	var hex = '';
	for(var i=0;i<str.length;i++) {
		hex += ''+str.charCodeAt(i).toString(16);
	}
	return hex;
}

(function() {
    'use strict';
    var $, jQuery;
    $ = jQuery = window.jQuery;
    var phone_dom;
    var shop_name;
    shop_name=$(".breadcrumb span").text();
    if(location.href.indexOf("/shop/") ){
        phone_dom=$(".tel");
    }
    else{
        phone_dom=$(".phone-info");
    }
    var phone=phone_dom.text();
    phone=replace_num(phone);
//http://s3plus.meituan.net/v1/mss_0a06a471f9514fc79c981b5466f56b91/svgtextcss/d0bf400be151e495d1b51cb4ae3221bd.css
//通过css来改变文字
//view-source:http://s3plus.meituan.net/v1/mss_0a06a471f9514fc79c981b5466f56b91/svgtextcss/1cf9bbbcaeda2ef6054b31452d1ed641.svg
    var kv={ugude:"肇",ugl43:"迁",ugmk1:"龙",ugtkv:"文",ugj3f:"治",ugk7t:"站",ugkr0:"业",ugcby:"花",uglag:"合",ugqht:"名",ugebb:"川",ugw52:"育",ugf6r:"人",ugod7:"襄",ug3l8:"清",ug1w9:"泉",ug0wy:"绍",ugabg:"中",ugmio:"体",ugnpm:"江",ug09c:"齐",ugtis:"一",ug1wg:"四",ugg1g:"晋",ugum0:"园",ugdeu:"遵",ugqp1:"香",ughkx:"昌",ugk5q:"民",ugedd:"汕",ug7ga:"邢",ugua7:"振",ugd4r:"岛",ugmie:"武",ugokv:"北",ugxli:"心",ugjbd:"温",ug1jp:"教",ugah0:"源",ugrkd:"淮",ugj99:"苏",ugyie:"农",ughot:"盐",ugrxl:"沈",ugdj1:"金",ugpfw:"甘",ugdq5:"弄",uglvd:"春",ug1wq:"环",ugsz3:"工",ug0xh:"号",ugbcp:"古",ugx39:"藏",ugfi5:"湛",ugt8w:"康",ugnih:"杭",ugefm:"云",ugfd0:"风",ug12f:"区",ugvge:"扬",ugl1k:"石",ughbq:"冈",ug8i2:"徐",ugqc2:"新",ug9p8:"胜",uglgh:"圳",ugj1h:"路",ug7wq:"河",ugr6b:"关",ugx73:"凤",ugrxs:"岳",ugfpv:"九",ugekk:"谐",ug5g7:"珠",ug2dn:"交",ugza9:"锦",ug49t:"楼",ug8oo:"友",ugggj:"曙",ugmg5:"三",ugrqr:"通",ugcwn:"韶",ug6kc:"义",ugtck:"泰",ugse0:"淄",ugaze:"秦",ugma3:"谊",ugty4:"海",ugjgw:"疆",ugfah:"廊",ugyhk:"红",ugu3q:"无",ug5xb:"迎",ugcm7:"六",ugcda:"创",ugmpd:"沿",ugzao:"嘉",ugkmt:"明",ugrbi:"深",ugsjf:"结",ugpw3:"阳",ug0k0:"绵",uguej:"旗",ugq4m:"郑",ugg1w:"重",ugsr9:"富",ugr7l:"向",ug1jn:"爱",ugkfn:"年",ug9fv:"台",ug6bg:"县",uggqz:"滨",ugbof:"省",ugefi:"广",ugtpd:"道",ug9le:"港",uge06:"青",ugwwr:"凰",ugoyu:"化",ugy0y:"福",ug45e:"津",ughje:"机",ugr2i:"贵",ugnla:"南",ug7jy:"西",ughsj:"永",ug2vk:"学",ug27m:"定",ugkxe:"州",ug2j1:"常",ug89m:"和",ugaes:"市",ug5uv:"前",ugqo7:"场",ugy37:"夏",ugyug:"主",ugfqm:"惠",ugxfp:"尔",ug2ic:"街",ugcnu:"长",ugv3v:"威",ugwzm:"健",ugmnk:"锡",ugan7:"朝",ugiiu:"华",ug1hq:"二",ug8pk:"乌",ugui5:"澳",ugafw:"庄",ugjpg:"头",uggtd:"连",uglr4:"解",ugk9x:"八",ugrle:"建",ugix0:"佛",ughnn:"村",ugild:"平",ugs1o:"开",ugw7g:"皇",ug9d4:"鞍",ugir7:"烟",ugv1c:"济",ugw6m:"层",ugkhv:"设",ug9hv:"远",ugo7c:"乡",ugrkr:"放",ugzm4:"辽",ugwey:"沙",ug2t6:"京",ughvm:"天",ugcpi:"镇",ug5nr:"林",ug5o4:"利",uga3k:"祥",ug4kb:"乐",ugssl:"城",ugm7v:"成",ugs80:"湖",ugxnf:"孝",ugcf0:"十",ug7wv:"莞",ugulo:"府",ug2wn:"衢",ugq10:"厦",ugko4:"安",ug96d:"哈",ug4va:"湾",ughhb:"团",ugy35:"光",ug149:"木",ug314:"洛",ugaql:"宿",ug6jb:"家",ug441:"隆",uginp:"感",ugczk:"鲁",ug1qe:"潍",ugl9u:"赣",ugh76:"保",ug7te:"进",ugol5:"公",ug9jo:"内",ugrv1:"军",ugdtb:"黄",uguhn:"山",ugy0f:"宁",uglwg:"宜",ugzv9:"桂",ugcgj:"拥",ugnhs:"都",ugm6n:"德",ugp7c:"蒙",ug90t:"临",ug3zm:"才",ugy5c:"吉",ugfiw:"昆",ugkdm:"大",ug0ux:"浙",ugvzz:"上",ug16h:"兴",ug0pw:"七",ugwh7:"庆",ugwsi:"充",ughcb:"五",ug4ck:"汉",ug0i5:"波",ugemf:"封",ugc5p:"东",uggck:"肃",ugsqj:"梅",ugeej:"徽",ug7py:"信",ug51y:"茂",ugo9e:"幸",ugswa:"宾",ug37s:"衡",uglxg:"陕",ugvg3:"门",ugrsn:"汾",ugyte:"太",ugvsg:"坊",ug58k:"肥",ug1rn:"黑",ugyad:"生",ug4fa:"银"};
//通过字体来改变文字
//http://s3plus.meituan.net/v1/mss_73a511b8f91f43d0bdae92584ea6330b/font/53cfe63b.woff
//http://fontstore.baidu.com/static/editor/index.html
//https://programmer.group/5cc0fef6907ae.html
    var kv2={efeb:"1",e4ff:"2",f70d:"3",e6ec:"4",f404:"5",e65d:"6",e284:"7",f810:"8",e27b:"9",ec2d:"0",e36d:"店",f5da:"中",e92d:"美",ebb5:"家",ed21:"馆",e544:"小",e57d:"车",eb93:"大",e5f1:"市",e615:"公",efdd:"酒",e41b:"行",ebb6:"国",e10e:"品",f735:"发",ef2c:"电",e727:"金",f8ae:"心",e128:"业",ec00:"商",ecc6:"司",f85b:"超",e816:"生",f31a:"装",ed75:"园",eb21:"场",e4d5:"食",eb26:"有",f4c9:"新",e0f3:"限",f826:"天",e60f:"面",e91b:"工",e65c:"服",e1b1:"海",f73b:"华",f888:"水",e072:"房",e191:"饰",e588:"城",e175:"乐",e768:"汽",ecce:"香",e514:"部",edc9:"利",ea24:"子",efe6:"老",f2d1:"艺",ef9c:"花",f7b0:"专",ea41:"东",e097:"肉",eb5a:"菜",f722:"学",f121:"福",f1c6:"饭",eeb2:"人",f479:"百",f585:"餐",f671:"茶",eedf:"务",f45b:"通",e108:"味",e65f:"所",f86e:"山",e83e:"区",f44e:"门",ebbd:"药",e930:"银",f4ce:"农",e149:"龙",eebc:"停",e77c:"尚",e579:"安",e7af:"广",f41b:"鑫",f009:"一",ecec:"容",e4f8:"动",edb4:"南",e66f:"具",ed69:"源",e16f:"兴",e847:"鲜",eae0:"记",f740:"时",e708:"机",ebf4:"烤",ee9a:"文",ecb6:"康",f1bf:"信",ee9c:"果",ec94:"阳",ede2:"理",f89a:"锅",ed9a:"宝",eefa:"达",ea28:"地",e985:"儿",e8c8:"衣",e371:"特",e199:"产",f7c1:"西",f4ee:"批",f4f8:"坊",e4a8:"州",e565:"牛",e674:"佳",eee4:"化",eb85:"五",eabc:"米",e95c:"修",f762:"爱",effc:"北",f7f1:"养",f463:"卖",eee5:"建",e37d:"材",f60f:"三",e51b:"会",f488:"鸡",ee0c:"室",e038:"红",e4ec:"站",e9ca:"德",eede:"王",f3a4:"光",eaa7:"名",f5de:"丽",f3a5:"油",e3b8:"院",f3d5:"堂",e432:"烧",e5c1:"江",f1b5:"社",f4c4:"合",ee7e:"星",e7ee:"货",f567:"型",e8d5:"村",f3c6:"自",f046:"科",e216:"快",e7ac:"便",f865:"日",f8cf:"民",f37e:"营",f53e:"和",e652:"活",e1a7:"童",e165:"明",e188:"器",f659:"烟",e6fb:"育",f838:"宾",ee3e:"精",e0a6:"屋",e888:"经",eeda:"居",f1ce:"庄",e7c3:"石",ede5:"顺",f6c4:"林",f8bb:"尔",ecd1:"县",e54a:"手",f8a8:"厅",f2cd:"销",e313:"用",ed7f:"好",f08d:"客",e073:"火",e920:"雅",f4e3:"盛",f0f4:"体",e972:"旅",f57a:"之",e037:"鞋",e545:"辣",f226:"作",f017:"粉",e63f:"包",ea25:"楼",f2cf:"校",e1a8:"鱼",f8ee:"平",e3ce:"彩",f40e:"上",f1d5:"吧",e4b7:"保",f53f:"永",ebcd:"万",f661:"物",e2e0:"教",e99a:"吃",ec71:"设",ef5d:"医",ef81:"正",f775:"造",f791:"丰",e6f5:"健",f5e1:"点",f1ed:"汤",f7bb:"网",ed7c:"庆",e153:"技",e152:"斯",e98b:"洗",ea84:"料",e6ed:"配",ead9:"汇",e7ca:"木",e13a:"缘",e522:"加",e82d:"麻",e19e:"联",e781:"卫",ec8f:"川",ecf7:"泰",eabb:"色",ec40:"世",f5c2:"方",e9ea:"寓",f477:"风",e0e1:"幼",f03c:"羊",e060:"烫",ed5a:"来",ea56:"高",e36c:"厂",f27e:"兰",f43e:"阿",eff7:"贝",e8b0:"皮",e3f8:"全",f6a7:"女",e6dc:"拉",e015:"成",e1d1:"云",e7b9:"维",ec67:"贸",ef46:"道",e7a7:"术",eca7:"运",e289:"都",ec81:"口",e5b0:"博",f1db:"河",e210:"瑞",f060:"宏",e7c1:"京",eebe:"际",f1b7:"路",e62a:"祥",ed55:"青",e9ac:"镇",f143:"师",f4d1:"培",e1a1:"力",ef3d:"惠",f0c8:"连",e519:"马",f741:"鸿",f209:"钢",ecdc:"训",ef3c:"影",ea47:"甲",edf6:"助",e721:"窗",e459:"布",e731:"富",e083:"牌",f3ce:"头",e3e1:"四",eb24:"多",ec48:"妆",f4c2:"吉",e09c:"苑",e0c1:"沙",e2f1:"恒",f0d3:"隆",f482:"春",f606:"干",e2a8:"饼",f39e:"氏",f75f:"里",f18e:"二",e7e0:"管",e7cf:"诚",f59e:"制",eaaf:"售",e29b:"嘉",f6ad:"长",e682:"轩",e066:"杂",f2ab:"副",f8ab:"清",f1e0:"计",f2b0:"黄",e1e5:"讯",f696:"太",e5fa:"鸭",e8b8:"号",f70b:"街",f46a:"交",e123:"与",e50a:"叉",e471:"附",ea18:"近",f616:"层",f0fa:"旁",e7f9:"对",e35d:"巷",eb2a:"栋",e97f:"环",e19c:"省",e7d4:"桥",ee95:"湖",f6e5:"段",e1c3:"乡",f3e1:"厦",f391:"府",e0a5:"铺",efc2:"内",f7a8:"侧",e907:"元",ea3e:"购",f146:"前",f3bb:"幢",f6c1:"滨",f133:"处",eb35:"向",f583:"座",e3de:"下",e05c:"県",e89d:"凤",e70a:"港",e082:"开",e32f:"关",ec5d:"景",ef66:"泉",eb96:"塘",e058:"放",eba3:"昌",e272:"线",e231:"湾",e4e5:"政",f3c9:"步",e2fc:"宁",f591:"解",e9de:"白",e399:"田",e095:"町",f7e9:"溪",e41c:"十",ea46:"八",ea67:"古",e702:"双",ec62:"胜",ecd0:"本",e06d:"单",f172:"同",f7af:"九",f476:"迎",eb62:"第",f134:"台",e213:"玉",ebae:"锦",ee48:"底",e820:"后",f45e:"七",ea49:"斜",f00e:"期",f3df:"武",e66d:"岭",ed48:"松",f2f6:"角",ef1a:"纪",f3b7:"朝",f1f2:"峰",f881:"六",eeea:"振",ec26:"珠",f627:"局",ef1b:"岗",eb3f:"洲",e51e:"横",ea3b:"边",f5d0:"济",f2ce:"井",f589:"办",e8f2:"汉",f555:"代",e0f4:"临",e830:"弄",f6f4:"团",f4f4:"外",f369:"塔",e0bc:"杨",ef6d:"铁",e60c:"浦",f16b:"字",e804:"年",f202:"岛",eef5:"陵",e38d:"原",e5fc:"梅",f6b5:"进",eee0:"荣",f61f:"友",f4e1:"虹",e5c9:"央",f114:"桂",e45b:"沿",e316:"事",f0f2:"津",e4fb:"凯",e065:"莲",e055:"丁",edae:"秀",f62d:"柳",e9e0:"集",e2c8:"紫",e661:"旗",e881:"张",f755:"谷",e8dd:"的",e689:"是",e746:"不",e5bd:"了",f495:"很",f8a7:"还",f3d9:"个",f83d:"也",f513:"这",efa9:"我",ef35:"就",f37d:"在",e0e0:"以",f754:"可",f538:"到",e4f6:"错",eff3:"没",e77a:"去",e643:"过",f5b5:"感",ec2a:"次",f3c7:"要",e6ef:"比",ea2b:"觉",e78f:"看",f1a0:"得",f2b5:"说",ef2d:"常",e9bd:"真",e08a:"们",e9ce:"但",f04e:"最",e3fe:"喜",e421:"哈",e700:"么",eff2:"别",f5f0:"位",f471:"能",e70e:"较",e4e8:"境",e748:"非",ed35:"为",f113:"欢",f80d:"然",f59a:"他",ee1a:"挺",f71f:"着",e963:"价",f173:"那",f857:"意",f074:"种",efff:"想",e814:"出",e568:"员",e8ad:"两",e0ec:"推",f387:"做",f26f:"排",f7cb:"实",f571:"分",f390:"间",e129:"甜",f417:"度",f872:"起",f2a0:"满",e98d:"给",f22a:"热",f720:"完",f32d:"格",eacc:"荐",ead7:"喝",e73d:"等",e01c:"其",e598:"再",f8c2:"几",e600:"只",f3d8:"现",f163:"朋",f042:"候",e9f4:"样",ece3:"直",e0c0:"而",ebc9:"买",e92f:"于",ea7c:"般",e215:"豆",f683:"量",f5f4:"选",f205:"奶",f836:"打",f15a:"每",e49d:"评",ef07:"少",f4f2:"算",e9a5:"又",f0ff:"因",e031:"情",e54b:"找",f415:"些",e2fe:"份",ef4a:"置",f3d0:"适",f5af:"什",e139:"蛋",e5be:"师",e5b4:"气",eaac:"你",e9a2:"姐",e95d:"棒",efaf:"试",e5f8:"总",f4b7:"定",e9ec:"啊",f196:"足",e285:"级",f82d:"整",ebc5:"带",e63b:"虾",f35b:"如",e21b:"态",e7f5:"且",e44c:"尝",f73c:"主",ef89:"话",e7ff:"强",e2f7:"当",f003:"更",e679:"板",e45c:"知",e0d8:"己",f18d:"无",e5e8:"酸",f435:"让",f112:"入",e3c1:"啦",ea96:"式",e94c:"笑",f35f:"赞",edc8:"片",ebbb:"酱",e3cb:"差",f653:"像",e40d:"提",e8bb:"队",ef83:"走",f811:"嫩",f4a4:"才",e516:"刚",f7be:"午",e656:"接",f002:"重",e90b:"串",f253:"回",ebee:"晚",e6ce:"微",e60b:"周",e1a2:"值",e0e5:"费",e4bd:"性",e627:"桌",ef70:"拍",f631:"跟",f795:"块",f04f:"调",e104:"糕"};
    var html=$("#address").html();
    var e_list=$("#address e");
    for(var i=0; i<e_list.length ;i++){
        var item=e_list[i];
        var key =item.className;
        if(key.startsWith("ug")){
            html= html.replace('class="'+key+'"><',">"+kv[key]+"<");
        }
        else if(key=='address'){
            var addr_char=toHex(item.textContent);
            html= html.replace('class="address">',">");
            html= html.replace(item.textContent,kv2[addr_char]);
        }
    }
    html=replace_num(html);
    $("#address").html(html);
    var dizhi=$("#address").text();
    console.log(phone);
    var tmptext="店铺:"+shop_name+'\n地址:'+dizhi+'\n'+phone.trim();
    var btn='<button class="copybtn" data-clipboard-text="'+tmptext+'">复制</button>';
    $(".action").html(btn);
    var clipboard = new ClipboardJS('.copybtn');
    phone_dom.text(phone);
    // Your code here...
})();