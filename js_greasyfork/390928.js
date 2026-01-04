// ==UserScript==
// @name         茅山脚本修改版3
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  yujian
// @author       lanren22
// @match        http://*.yytou.cn/*
// @exclude      http://res.yytou.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390928/%E8%8C%85%E5%B1%B1%E8%84%9A%E6%9C%AC%E4%BF%AE%E6%94%B9%E7%89%883.user.js
// @updateURL https://update.greasyfork.org/scripts/390928/%E8%8C%85%E5%B1%B1%E8%84%9A%E6%9C%AC%E4%BF%AE%E6%94%B9%E7%89%883.meta.js
// ==/UserScript==

//青龙物品
var Mingyue = '明月：烈日棍西毒蛇杖冰魄银针碧磷鞭--倚天剑屠龙刀墨玄掌套明月帽明月鞋明月项链明月戒月光宝甲衣明月手镯星月大斧碧玉锤霸王枪';
var Lieri = '烈日：残阳棍伏虎杖暴雨梨花针七星鞭--诛仙剑斩神刀龙象拳套烈日帽烈日宝靴烈日宝链烈日宝戒日光宝甲衣烈日宝镯破冥斧撼魂锤赤焰枪';
var Zhanlong = '斩龙：开天宝棍达摩杖小李飞刀乌金玄火鞭--九天龙吟剑飞宇天怒刀天罡掌套斩龙帽斩龙宝靴斩龙宝链斩龙宝戒龙皮至尊甲衣斩龙宝镯天雷断龙斧烛幽鬼煞锤斩龙鎏金枪'
var Yintian = '胤天宝帽碎片胤天项链碎片胤天宝镯碎片胤天宝戒碎片胤天宝靴碎片胤天紫金衣碎片昊天龙旋铠碎片鱼肠碎片水羽云裳碎片奉天金带碎片凤羽乾坤盾碎片轩辕剑碎片破岳拳套碎片天雨玄镖碎片天神杖碎片轰天巨棍碎片神龙怒火鞭碎片雷霆诛神刀碎片胤武伏魔斧碎片九天灭世锤碎片玄冰凝魄枪碎片';
var Qihua = '君影草矢车菊忘忧草仙客来雪英朝开暮落花夕雾草凤凰木熙颜花晚香玉朽凌霄花彼岸花洛神花百宜雪梅';
var allEquipment = [Mingyue,Lieri,Zhanlong,Yintian,Qihua];
var task_gw = 0;
//寻路路径
var city = {
    "雪亭镇": "jh 1;inn_op1;n;s;w;e;e;w;s;e;s;w;w;e;s;n;e;e;ne;ne;sw;sw;n;w;n;w;e;e;e;n;s;e;e;n;s;s;n;e;w;w;w;w;w;n;w;e;n;w;e;e;e;w;w;n;w;e;e;w;n",
    "洛阳": "jh 2;n;n;e;s;luoyang317_op1;n;n;w;n;w;putuan;n;e;e;s;n;w;n;e;s;n;w;w;s;w;e;n;event_1_98995501;n;w;e;n;e;w;s;s;s;e;n;w;s;luoyang111_op1;e;n;n;n;w;e;s;s;w;n;w;get_silver;s;e;n;n;e;get_silver;n;w;s;s;s;e;e;e;n;op1;s;s;e;n;n;w;e;e;n;s;w;n;w;e;n;e;w;n;w;e;s;s;s;s;s;w;w;n;w;e;e;n;s;w;n;e;w;n;w;luoyang14_op1;n;e;e;w;n;e;n;n;s;s;w;n;n;n;n;",
    "华山村": "jh 3;n;e;w;s;w;n;s;e;s;e;n;s;w;s;e;s;huashancun24_op2;w;n;w;w;n;s;e;s;s;w;n;s;e;s;e;w;nw;jh 3;w;event_1_59520311;n;n;w;get_silver;s;e;n;n;e;get_silver;n;w;n;e;w;s;s;s;s;s;e;e",
    "华山": "jh 4;n;n;w;e;n;e;w;n;n;n;e;n;n;event_1_91604710;s;s;s;w;e;s;e;w;n;n;n;n;nw;s;s;w;n;n;s;n;w;w;n;get_xiangnang2;w;s;e;e;n;n;w;e;n;n;w;e;e;n;n;s;s;s;s;n;n;w;n;get_silver;s;s;s;s;s;e;n;n;w;e;n;e;w;n;e;w;n;s;s;s;s;s;w;n;w;event_1_30014247;s;w;e;s;e;w;s;s;s;e",
    "扬州": "jh 5;n;e;w;w;w;n;s;e;e;n;e;w;w;e;n;w;e;n;w;yangzhou16_op1;e;e;n;w;w;s;s;n;n;n;n;n;s;e;w;w;n;n;n;s;s;s;e;s;s;e;e;e;n;n;n;s;s;w;n;n;n;e;n;n;s;s;e;s;s;w;n;ns;s;e;s;w;s;w;n;w;e;e;n;n;w;get_silver;s;e;e;w;n;n;s;s;s;s;w;n;w;e;e;get_silver;s;w;n;w;w;n;get_silver;s;s;w;e;e;e;n;e;s;e;s;s;s;n;n;n;w;n;w;n;ne;sw;s;w;s;n;w;n;e;w;w;e;n;n;w;n;s;e;e;s;n;w;n",
    "丐帮": "jh 6;event_1_98623439;s;w;e;n;ne;ne;ne;sw;sw;n;ne;ne;ne;event_1_97428251",
    "乔阴县": "jh 7;s;s;s;w;s;w;w;w;e;e;e;e;event_1_65599392;w;e;n;s;ne;s;s;e;n;n;e;w;s;s;w;s;w;w;w;n;s;s;e;n;s;e;ne;s;e;n;e;s;e",
    "峨眉山": "jh 8",
    "恒山": "jh 9;n;w;e;n;e;get_silver;w;w;n;w;e;n;e;w;henshan15_op1;e;n;event_1_85624865;n;w;e;e;w;n;n;henshan_zizhiyu11_op1;e;n;s;s;s;s;w;n;n;w;n;s;s;n;e;e;e;w;n;s;w;n;n;w;n;e;henshan_qinqitai23_op1;s;w;n;n;n;s;w;get_silver",
    "武当山": "jh 10;w;n;n;w;w;w;n;n;n;n;n;w;n;s;e;e;e;e;e;w;w;s;n;w;w;n;n;n;n;s;s;s;s;s;e;e;e;e;s;e;s;e;n;s;s;n;e;e;n;s;e;w;s;s;s",
    "晚月庄": "jh 11;s;e;s",
    "水烟阁": "jh 12;n;e;w;n;n;n;s;w;n;n;e;w;s;nw;e;n;s;e;sw;n;s;s;e",
    "少林寺": "jh 13;e;s;s;w;w;w;e;e;n;n;w;n;w;w;n;shaolin012_op1;s;s;e;e;n;w;e;e;w;n;n;w;e;e;w;n;n;w;e;e;w;n;shaolin27_op1;event_1_34680156;s;w;n;w;e;e;w;n;shaolin25_op1;w;n;w;s;s;s;s;s;s;s;s;n;n;n;n;n;n;n;n;e;e;s;s;s;s;s;s;s;s;n;n;n;n;n;n;n;n;w;n;w;e;e;w;n;w;n;get_silver",
    "唐门": "jh 14;w;n;n;n;n;s;w;w;w;w;e;n;s;s;n;e;n;s;s;n;e;n;s;s;n;e;e;s;n;e;n;e;w;n;n;s;ask tangmen_tangmei;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;s;s;jh 14;e;event_1_10831808;n;s;s;w;sw;s;e;s;s;sw;sw;w;w;s;s;e",
    "逍遥林": "jh 16;s;s;s;s;e;e;s;w;n;s;s;s;n;n;w;n;n;s;s;s;s;n;n;w;w;n;s;s;n;w;e;e;e;e;e;e;n;n;e;event_1_5221690;s;w;event_1_57688376;n;n;w;n;s;w;e;e;e;n;s;e;n;n;w;n;e",
    "开封": "jh 17;n;w;e;e;s;n;w;n;w;n;n;s;s;s;n;e;e;e;s;n;n;n;s;get_silver;e;s;w;s;s;s;w;e;s;w;e;n;e;n;s;s;n;e;e;w;w;w;n;n;n;w;n;e;w;n;e;w;w;w;n;s;s;n;w;s;s;w;e;n;n;n;n;w;e;s;s;w;e;e;e;e;n;e;n;n;n;event_1_27702191;w;s;s;s;w;s;s;s;s;s;e;s;s;s;e;kaifeng_yuwangtai23_op1;s;w;s;s;w;e;n;n;n;n;n;w;event_1_97081006;s;s;s;s;s;w;w;e;kaifeng_yezhulin05_op1;s;e;n;n;e;kaifeng_yezhulin23_op1;jh 17;sw;nw;se;s;sw;nw;ne;event_1_38940168",
    "光明顶": "jh 18;e;w;w;n;s;e;n;nw;sw;ne;n;n;w;e;n;n;n;ne;n;n;w;e;e;w;n;w;e;e;w;n;n;n;n;e;w;n;e;w;w;e;n;w;nw;nw;se;se;w;s;s;s;s;n;e;e;n;w;e;e;e;s;w;e;se;se;e;w;nw;nw;n;n;ne;sw;n;w;w;n;n;n;w;e;n;event_1_90080676;event_1_56007071;nw;ne;n;nw",
    "全真教": "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;e;w;w;e;n;w;w;w;s;n;w;s;n;e;e;e;e;e;n;s;e;e;w;n;n;s;s;w;w;n;n;w;w;s;s;n;n;w;s;s;n;n;w;n;n;n;n;e;n;s;s;s;e;n;n;w;e;e;s;s;n;n;e;n",
    "古墓": "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;e;w;s;s;s;s;",
    "白驼山": "jh 21;n;n;n;n;s;s;s;s;nw;s;n;w;n;s;w;nw;e;w;nw;nw;n;w;sw;jh 21;nw;w;w;nw;n;e;w;n;n;w;e;n;n;e;e;w;ne;sw;e;se;nw;w;n;s;s;n;w;w;n;n;n;n;s;s;s;e;e;e;e;n;n;e;e;w;w;w;e;n;nw;se;ne;e;w;n;jh 21;nw;ne;ne;sw;n;n;ne;w;e;n;n;w;w"
};

var hairsfalling = {
    '奇侠秘境':{
        '石街':'jh 2,n,n,n,n,w,event_1_98995501,n',
        '桃花泉':"jh 3,s,s,s,s,s,nw,n,n,e",
        '潭畔草地':"jh 4,n,n,n,n,n,n,n,event_1_91604710,s,s,s,",
        '临渊石台':"jh 4,n,n,n,n,n,n,n,n,n,e,n",
        '沙丘小洞':"jh 6,event_1_98623439,ne,n,ne,ne,ne,event_1_97428251",
        '碧水寒潭':"jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,e,e,se,se,e",
        '小洞天':"jh 24,n,n,n,n,e,e",
        '青云坪':"jh 13,e,s,s,w,w",
        '湖边':"jh 16,s,s,s,s,e,n,e,event_1_5221690,s,w",
        '玉壁瀑布':"jh 16,s,s,s,s,e,n,e",
        '悬根松':"jh 9,n,w",
        '夕阳岭':'jh 9,n,n,e',
        '天梯':"jh 24,n,n,n",
        '山溪畔':"jh 22,n,n,w,n,n,n,n,look_npc songshan_songshan7,event_1_88705407,s,s",
        '奇槐坡':"jh 23,n,n,n,n,n,n,n,n",
        '启母石':"jh 22,n,n,w,w",
        '无极老姆洞':'jh 22,n,n,w,n,n,n,n',
        '草原':"jh 26,w",
        '戈壁':"jh 21",
        '云步桥':"jh 24,n,n,n,n,n,n,n,n,n",
        '寒水潭':"jh 20,w,w,s,e,s,s,s,s,s,sw,sw,s,e,se",
        '危崖前':"jh 25,w",
        '千尺幢': "jh 4,n,n,n,n",
        '玉女峰': "jh 4,n,n,n,n,n,n,n,n,w",
        '长空栈道':'jh 4,n,n,n,n,n,n,n,n,n,e',
        '山坳':"jh 1,e,n,n,n,n,n",
        '猢狲愁':"jh 4,n,n,n,n,n,n,e,n,n",
        '无名山峡谷':"jh 29,n,n,n,n,event_1_60035830,event_1_65661209",
        '悬崖':"jh 20,w,w,s,e,s,s,s,s,s,sw,sw,s,s,e",
        '观景台':"jh 24,n,n,n,n,n,n,n,n,n,n,n,n,e,e,n",
        '九老洞':'jh 8,w,nw,n,n,n,n,e,e,n,n,e,n,n,n,n,w,n,n,n,n,n,n,n,n,n,nw,sw,w,nw,w',
        '卢崖瀑布':'jh 22,n,n,n,n,e,n',
    },
    '快速路径':{
        '01':'jh 1',
        '02':'jh 2',
        '03':'jh 3',
        '04':'jh 4',
        '05':'jh 5',
        '06':'jh 6',
        '07':'jh 7',
        '08':'jh 8',
        '09':'jh 9',
        '10':'jh 10',
        '11':'jh 11',
        '12':'jh 12',
        '13':'jh 13',
        '14':'jh 14',
        '15':'jh 15',
        '16':'jh 16',
        '17':'jh 17',
        '18':'jh 18',
        '19':'jh 19',
        '20':'jh 20',
        '21':'jh 21',
        '22':'jh 22',
        '23':'jh 23',
        '24':'jh 24',
        '25':'jh 25',
        '26':'jh 26',
        '27':'jh 27',
        '28':'jh 28',
        '29':'jh 29',
        '30':'jh 30',
        '31':'jh 31',
        '32':'jh 32',
        '33':'jh 33',
        '34':'jh 34',
        '35':'jh 35',
        '36':'jh 36',
        '37':'jh 37',
        '38':'jh 38',
        '39':'jh 39',
        '40':'jh 40',
        '41':'jh 1',
        '42':'jh 42',
        '43':'jh 43',
        '44':'jh 44',
        '45':'jh 45',
        '46':'jh 46',
        '47':'jh 47',
        '48':'jh 48',
        '49':'jh 49',
    },

    '雪亭镇': {
        '雪亭镇': 'jh 1,w',
        '逄义': 'jh 1',
        '店小二': 'jh 1',
        '星河大师': 'jh 1,inn_op1',
        '崔元基': 'jh 1,inn_op1',
        '苦力': 'jh 1,e',
        '黎老八': 'jh 1,e,s',
        '农夫': 'jh 1,e,s,w',
        '老农夫': 'jh 1,e,s,w',
        '疯狗': 'jh 1,e,s,w,w',
        '魏无极': 'jh 1,e,s,w,s',
        '野狗': 'jh 1,e,e,s,ne',
        '蒙面剑客': 'jh 1,e,e,s,ne,ne',
        '庙祝': 'jh 1,e,e',
        '刘安禄': 'jh 1,e,n,e',
        '武馆弟子': 'jh 1,e,n,e,e',
        '李火狮': 'jh 1,e,n,e,e',
        '柳淳风': 'jh 1,e,n,e,e,e',
        '柳绘心': 'jh 1,e,n,e,e,e,e,n',
        '安惜迩': 'jh 1,e,n,w',
        '醉汉': 'jh 1,e,n,n',
        '收破烂的': 'jh 1,e,n,n',
        '王铁匠': 'jh 1,e,n,n,w',
        '杨掌柜': 'jh 1,e,n,n,n,w',
        '花不为': 'jh 1,e,n,n,n,n,e',
        '杜宽': 'jh 1,e,n,n,n,n,w',
        '杜宽宽': 'jh 1,e,n,n,n,n,w',
    },

    '洛阳': {
        '洛阳': 'jh 2',
        '农夫': 'jh 2,n',
        '守城士兵': 'jh 2,n,n',
        '客商': 'jh 2,n,n,e',
        '蓑衣男子': 'jh 2,n,n,e,s,luoyang317_op1',
        '乞丐': 'jh 2,n,n,n',
        '金刀门弟子': 'jh 2,n,n,n,e',
        '王霸天': 'jh 2,n,n,n,e,s',
        '庙祝': 'jh 2,n,n,n,w',
        '老乞丐': 'jh 2,n,n,n,w,putuan',
        '地痞': 'jh 2,n,n,n,n',
        '小贩': 'jh 2,n,n,n,n,e',
        '郑屠夫': 'jh 2,n,n,n,n,e,s',
        '何九叔': 'jh 2,n,n,n,n,w',
        '无赖': 'jh 2,n,n,n,n,w,event_1_98995501,n',
        '甄大海': 'jh 2,n,n,n,n,w,event_1_98995501,n,n,e',
        '红娘': 'jh 2,n,n,n,n,w,s',
        '柳小花': 'jh 2,n,n,n,n,w,s,w',
        '富家公子': 'jh 2,n,n,n,n,n,e,n',
        '洪帮主': 'jh 2,n,n,n,n,n,e,n,op1',
        '游客': 'jh 2,n,n,n,n,n,e,e,n',
        '绿袍老者': 'jh 2,n,n,n,n,n,e,e,n,n,e,n',
        '护卫': 'jh 2,n,n,n,n,n,e,e,n,n,w',
        '山贼': 'jh 2,n,n,n,n,n,e,e,n,n,n',
        '白面书生': 'jh 2,n,n,n,n,n,e,e,n,n,n,w',
        '守墓人': 'jh 2,n,n,n,n,n,e,e,n,n,n,n',
        '凌云': 'jh 2,n,n,n,n,n,e,e,n,n,n,n,e',
        '凌中天': 'jh 2,n,n,n,n,n,e,e,n,n,n,n,e',
        '盗墓贼': 'jh 2,n,n,n,n,n,e,e,n,n,n,n,n',
        '黑衣文士': 'jh 2,n,n,n,n,n,e,e,n,n,n,n,n',
        '黑衣女子': 'jh 2,n,n,n,n,n,e,e,n,n,n,n,n,get_silver',
        '马倌': 'jh 2,n,n,n,n,n,w,n,n,w',
        '黑衣打手': 'jh 2,n,n,n,n,n,w,w',
        '小偷': 'jh 2,n,n,n,n,n,w,w,n',
        '张逍林': 'jh 2,n,n,n,n,n,w,w,n,w,get_silver',
        '玉娘': 'jh 2,n,n,n,n,n,w,w,n,n,n,e',
        '守园老人': 'jh 2,n,n,n,n,n,w,s',
        '赛牡丹': 'jh 2,n,n,n,n,n,w,s,luoyang111_op1',
        '鲁长老': 'jh 2,n,n,n,n,n,n,e',
        '陈扒皮': 'jh 2,n,n,n,n,n,n,w',
        '卖花姑娘': 'jh 2,n,n,n,n,n,n,n',
        '刘守财': 'jh 2,n,n,n,n,n,n,n,e',
        '守城武将': 'jh 2,n,n,n,n,n,n,n,n',
        '李元帅': 'jh 2,n,n,n,n,n,n,n,n,w,luoyang14_op1',
        '疯狗': 'jh 2,n,n,n,n,n,n,n,n,n',
        '青竹蛇': 'jh 2,n,n,n,n,n,n,n,n,n,e',
        '布衣老翁': 'jh 2,n,n,n,n,n,n,n,n,n,e,n',
        '萧问天': 'jh 2,n,n,n,n,n,n,n,n,n,e,n,n',
        '藏剑楼首领': 'jh 2,n,n,n,n,n,n,n,n,n,e,n,n,n',
    },

    '长安': {
        '胡商': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '城门卫兵': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '无影卫': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w',
        '紫衣追影': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w',
        '禁卫统领': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,w,w',
        '城门禁卫': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,w,w',
        '蓝色城门卫兵': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,w,w,n,n,n,n',
        '血手天魔': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,w,w,n,n,n,n,n,n',
        '看门人': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,w,w,n,n,n,n,n,n,nw,w,sw,s',
        '钦官': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,w,w,n,n,n,n,n,n,nw,w,sw,s,s',
        '先锋大将': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,w,w,n,n,n,n,n,n,n,n',
        '霍骠姚': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,w,w,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '江湖大盗': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,e,e',
        '李贺': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,e,e,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '云梦璃': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,e,e,n,n,n,n,n,n,n,n,n,n,n,n,n,n,event_1_95312623',
        '游客': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '捕快统领': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e',
        '捕快': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e',
        '刀僧卫': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w',
        '镇魂使': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,s,s,s,s,s',
        '招魂师': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,s,s,s,s,w',
        '说书人': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,n,w',
        '客栈老板': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,n,w',
        '游四海': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,w',
        '糖人张': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,w',
        '高铁匠': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,e',
        '哥舒翰': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,e',
        '若羌巨商': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,e',
        '樊天纵': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,e',
        '杨玄素': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,w',
        '乌孙马贩': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,n',
        '卫青': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,n,w',
        '方秀珣': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,n,w',
        '孙三娘': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,n,e',
        '大宛使者': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,n,n,n',
        '马夫': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,n,n,n',
        '白衣少侠': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,n,n,,n,n',
        '玄甲卫兵': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,n,n,,n,n,n',
        '房玄龄': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,n,n,,n,n,n,n,w',
        '杜如晦': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,n,n,,n,n,n,n,e',
        '秦王': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,n,n,,n,n,n,n,n,n,n,n',
        '程知节': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,n,n,,n,n,n,n,n,n,n,n,w',
        '尉迟敬德': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,n,n,,n,n,n,n,n,n,n,n,e',
        '翼国公': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,n,n,n,n,,n,n,n,n,n,n,n,n,e',
        '独孤须臾': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '金甲卫士': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '独孤皇后': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '仇老板': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,n,w',
        '顾先生': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,n,w',
        '苗一郎': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,n,e',
        '董老板': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,n,n,e',
        '护国军卫': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,n,n,w',
        '朱老板': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,n,n,w',
        '王府小厮': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,n,n',
        '王府总管': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,n,n',
        '龟兹乐师': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,n,n,n',
        '龟兹舞女': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,n,n,n,w',
        '卓小妹': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,n,n,n,w',
        '上官小婉': 'jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,n,n,n,e',
    },

    '华山村': {
        '华山村': 'jh 3',
        '泼皮': 'jh 3',
        '松鼠': 'jh 3,n',
        '野兔': 'jh 3,n,e',
        '小男孩': 'jh 3,w',
        '村中地痞': 'jh 3,w,event_1_59520311',
        '抠脚大汉': 'jh 3,w,event_1_59520311,n',
        '庙内黑狗': 'jh 3,w,event_1_59520311,n,n',
        '青衣守卫': 'jh 3,w,event_1_59520311,n,n,n',
        '米义为': 'jh 3,w,event_1_59520311,n,n,w,get_silver',
        '葛不光': 'jh 3,w,event_1_59520311,n,n,n,n,n',
        '王老二': 'jh 3,w,n',
        '泼皮头子': 'jh 3,s',
        '采花贼': 'jh 3,s,e',
        '冯铁匠': 'jh 3,s,e,n',
        '村民': 'jh 3,s,s',
        '方老板': 'jh 3,s,s,e',
        '跛脚汉子': 'jh 3,s,s,e,s',
        '云含笑': 'jh 3,s,s,e,s,huashancun24_op2',
        '朱老伯': 'jh 3,s,s,w',
        '方寡妇': 'jh 3,s,s,w,n',
        '剑大师': 'jh 3,s,s,w,n',
        '英白罗': 'jh 3,s,s,s',
        '庙外黑狗': 'jh 3,s,s,s',
        '刘三': 'jh 3,s,s,s,s',
        '血尸': 'jh 3,s,s,s,s,huashancun15_op1',
        '藏剑楼杀手': 'jh 3,s,s,s,s,huashancun15_op1,event_1_46902878',
        '受伤的曲右使': 'jh 3,s,s,s,s,w,get_silver',
        '曲姑娘': 'jh 3,s,s,s,s,w,n',
        '毒蛇': 'jh 3,s,s,s,s,s',
        '丐帮长老': 'jh 3,s,s,s,s,s,e',
        '小狼': 'jh 3,s,s,s,s,s,nw',
        '老狼': 'jh 3,s,s,s,s,s,nw,n',
        '土匪': 'jh 3,s,s,s,s,s,nw,n,n',
        '土匪头目': 'jh 3,s,s,s,s,s,nw,n,n,e',
        '玉牡丹': 'jh 3,s,s,s,s,s,nw,n,n,e,get_silver',
        '刘龟仙': 'jh 3,s,s,s,s,s,nw,n,n,n,n',
        '萧独眼': 'jh 3,s,s,s,s,s,nw,n,n,n,n,n',
        '刘寨主': 'jh 3,s,s,s,s,s,nw,n,n,n,n,n,n',
    },

    '华山': {
        '华山': 'jh 4',
        '孙驼子': 'jh 4',
        '吕子弦': 'jh 4,n',
        '女弟子': 'jh 4,n,n',
        '游客': 'jh 4,n,n,n',
        '公平子': 'jh 4,n,n,n,e',
        '豪客': 'jh 4,n,n,w',
        '白二': 'jh 4,n,n,n,n,n,n',
        '山贼': 'jh 4,n,n,n,n,n,n',
        '猿猴': 'jh 4,n,n,n,n,n,n,n',
        '李铁嘴': 'jh 4,n,n,n,n,n,n,e',
        '赵辅德': 'jh 4,n,n,n,n,n,n,e,n',
        '岳师妹': 'jh 4,n,n,n,n,n,n,n,n,w,s',
        '大松鼠': 'jh 4,n,n,n,n,n,n,n,n',
        '六猴儿': 'jh 4,n,n,n,n,n,n,n,n,w,w',
        '令狐大师哥': 'jh 4,n,n,n,n,n,n,n,n,w,w,n',
        '英黑罗': 'jh 4,n,n,n,n,n,n,n,n,n',
        '魔教喽喽': 'jh 4,n,n,n,n,n,n,n,n,n,e',
        '史大哥': 'jh 4,n,n,n,n,n,n,n,n,n,e,n',
        '史老三': 'jh 4,n,n,n,n,n,n,n,n,n,e,n,n',
        '闵老二': 'jh 4,n,n,n,n,n,n,n,n,n,e,n,n,n',
        '戚老四': 'jh 4,n,n,n,n,n,n,n,n,n,e,n,n,n,n',
        '葛长老': 'jh 4,n,n,n,n,n,n,n,n,n,e,n,n,n,n,e',
        '剑宗弟子': 'jh 4,n,n,n,n,n,n,n,event_1_91604710',
        '从云弃': 'jh 4,n,n,n,n,n,n,n,event_1_91604710,s,s',
        '尘无剑': 'jh 4,n,n,n,n,n,n,n,event_1_91604710,s,s,s',
        '封剑羽': 'jh 4,n,n,n,n,n,n,n,event_1_91604710,s,s,s,s,e',
        '岳掌门': 'jh 4,n,n,n,n,n,n,n,n,n,n,n',
        '高算盘': 'jh 4,n,n,n,n,n,n,n,n,n,n',
        '施剑客': 'jh 4,n,n,n,n,n,n,n,n,n,n,w',
        '舒奇': 'jh 4,n,n,n,n,n,n,n,n,n,n,n,n',
        '小猴': 'jh 4,n,n,n,n,n,n,n,n,n,n,n,n,w',
        '劳师兄': 'jh 4,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '宁女侠': 'jh 4,n,n,n,n,n,n,n,n,n,n,n,n,n,get_silver',
        '梁师兄': 'jh 4,n,n,n,n,n,n,n,n,n,n,n,n,e',
        '林师弟': 'jh 4,n,n,n,n,n,n,n,n,n,n,n,n,e,s',
        '小尼姑': 'jh 4,n,n,n,n,n,n,n,n,n,n,n,n,e,s,s',
        '华山弟子': 'jh 4,n,n,n,n,n,n,n,n,n,n,w,event_1_30014247',
        '蒙面剑客': 'jh 4,n,n,n,n,n,n,n,n,n,n,w,event_1_30014247,s,s,s,s',
        '黑衣人': 'jh 4,n,n,n,n,n,n,n,n,n,n,w,event_1_30014247,s,s,s,s,s,e',
    },

    '扬州': {
        '扬州': 'jh 5',
        '官兵': 'jh 5',
        '花店伙计': 'jh 5,n,w,w,n',
        '大黑马': 'jh 5,n,n',
        '铁匠': 'jh 5,n,n,w',
        '双儿': 'jh 5,n,n,e',
        '黑狗子': 'jh 5,n,n,n',
        '武馆护卫': 'jh 5,n,n,n,e',
        '武馆弟子': 'jh 5,n,n,n,e,n',
        '方不为': 'jh 5,n,n,n,e,n,n',
        '王教头': 'jh 5,n,n,n,e,n,w',
        '神秘客': 'jh 5,n,n,n,e,n,n,w,n,get_silver',
        '范先生': 'jh 5,n,n,n,e,n,n,n',
        '陈有德': 'jh 5,n,n,n,e,n,n,n,n',
        '古三通': 'jh 5,n,n,n,e,n,n,n,e',
        '黄掌柜': 'jh 5,n,n,n,w',
        '游客': 'jh 5,n,n,n,n',
        '账房先生': 'jh 5,n,n,n,n,w',
        '小飞贼': 'jh 5,n,n,n,n,w',
        '飞贼': 'jh 5,n,n,n,n,w,yangzhou16_op1',
        '艺人': 'jh 5,n,n,n,n,n',
        '空空儿': 'jh 5,n,n,n,n,n',
        '马夫人': 'jh 5,n,n,n,n,n,n',
        '润玉': 'jh 5,n,n,n,n,n,n',
        '流氓': 'jh 5,n,n,n,n,n,n',
        '刘步飞': 'jh 5,n,n,n,n,n,n,w',
        '马员外': 'jh 5,n,n,n,n,n,n,n',
        '毒蛇': 'jh 5,n,n,n,n,n,n,n,n',
        '扫地僧': 'jh 5,n,n,n,n,n,n,n,n,n,w,w,n',
        '柳碧荷': 'jh 5,n,n,n,n,n,n,n,n,n,w,w,n,w',
        '张三': 'jh 5,n,n,n,n,n,n,n,n,n,w,w,n,e',
        '火工僧': 'jh 5,n,n,n,n,n,n,n,n,n,w,w,n,n,n,e',
        '顽童': 'jh 5,n,n,n,n,n,n,n,n,w,w',
        '青衣门卫': 'jh 5,n,n,n,n,n,n,n,n,w,w,w',
        '玉娇红': 'jh 5,n,n,n,n,n,n,n,n,w,w,w,s',
        '赵明诚': 'jh 5,n,n,n,n,n,n,n,n,w,w,w,s,w',
        '青楼小厮': 'jh 5,n,n,n,n,n,n,n,n,w,w,w,s,e',
        '苏小婉': 'jh 5,n,n,n,n,n,n,n,n,w,w,w,s,e,e,s,s,e,e,s,s,s',
        '书生': 'jh 5,n,n,n,n,n,n,n,n,w,w,n',
        '李丽君': 'jh 5,n,n,n,n,n,n,n,n,w,w,n,get_silver',
        '小混混': 'jh 5,n,n,n,n,n,n,n,n,n,e',
        '北城门士兵': 'jh 5,n,n,n,n,n,n,n,n,n,n',
        '恶丐': 'jh 5,n,n,n,n,n,n,n,n,w',
        '唐老板': 'jh 5,n,n,n,n,n,n,n,w',
        '云九天': 'jh 5,n,n,n,n,n,n,n,e',
        '柳文君': 'jh 5,n,n,n,n,n,n,n,e,get_silver',
        '茶社伙计': 'jh 5,n,n,n,n,n,n,n,e',
        '醉仙楼伙计': 'jh 5,n,n,n,n,n,n,e',
        '丰不为': 'jh 5,n,n,n,n,n,n,e,n',
        '张总管': 'jh 5,n,n,n,n,n,n,e,n,n',
        '计无施': 'jh 5,n,n,n,n,n,n,e,n,n,w',
        '胡神医': 'jh 5,n,n,n,n,n,n,e,n,n,e',
        '胖商人': 'jh 5,n,n,n,n,n,n,e,n,n,n',
        '冼老板': 'jh 5,n,n,n,n,n,n,e,n,n,n,n',
        '赤练仙子': 'jh 5,n,n,n,n,n,w',
        '白老板': 'jh 5,n,n,n,n,n,w,w,s,s',
        '衙役': 'jh 5,n,n,n,n,n,w,w,n',
        '公孙岚': 'jh 5,n,n,n,n,n,w,w,n,n,w',
        '程大人': 'jh 5,n,n,n,n,n,w,w,n,n,n',
        '楚雄霸': 'jh 5,n,n,n,n,n,w,w,n,n,n,get_silver',
        '朱先生': 'jh 5,n,n,n,n,n,e,n,n,n',
    },

    '丐帮': {
        '丐帮': 'jh 6',
        '左全': 'jh 6',
        '裘万家': 'jh 6',
        '梁长老': 'jh 6,event_1_98623439',
        '何一河': 'jh 6,event_1_98623439,s',
        '密室': 'jh 6,fly,s,w',
        '莫不收': 'jh 6,event_1_98623439,ne,ne',
        '藏剑楼统领': 'jh 6,event_1_98623439,ne,n',
        '藏剑楼探子': 'jh 6,event_1_98623439,ne,ne,ne,event_1_16841370',
        '何不净': 'jh 6,event_1_98623439,ne,n,ne,ne',
        '马俱为': 'jh 6,event_1_98623439,ne,n,ne,ne,ne',
        '余洪兴': 'jh 6,event_1_98623439,ne,n,ne,ne,ne,event_1_97428251',
    },

    '乔阴县': {
        '乔阴县': 'jh 7',
        '守城官兵': 'jh 7',
        '卖饼大叔': 'jh 7,s',
        '陆得财': 'jh 7,s',
        '卖包子的': 'jh 7,s,s,s',
        '武官': 'jh 7,s,s,s,s,s,s,e',
        '汤掌柜': 'jh 7,s,s,s,s,s,s,e',
        '家丁': 'jh 7,s,s,s,s,s,s,e,n',
        '贵公子': 'jh 7,s,s,s,s,s,s,e,n',
        '酒楼守卫': 'jh 7,s,s,s,s,s,s,e,n,n',
        '书生': 'jh 7,s,s,s,s,s,s,s,s,e',
        '丫鬟': 'jh 7,s,s,s,s,s,s,s,s,e,n,e',
        '官家小姐': 'jh 7,s,s,s,s,s,s,s,s,e,n,e',
        '乾瘪老太婆': 'jh 7,s,s,s,s,s,s,s,sw,w',
        '妇人': 'jh 7,s,s,s,s,s,s,s,sw,w,n',
        '骆云舟': 'jh 7,s,s,s,s,s,s,s,s,e,n,e,s,e',
    },

    '峨眉山': {
        '峨眉山': 'jh 8',
        '白猿': 'jh 8,w,nw,n,n,n,n,w',
        '文虚师太': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e',
        '看山弟子': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e',
        '文寒师太': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n',
        '文玉师太': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n',
        '巡山弟子': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n',
        '青书少侠': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,n,n,n,n,e,e',
        '小女孩': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w',
        '小贩': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w',
        '静洪师太': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w,n',
        '静雨师太': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w,n,n',
        '女孩': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w,n,n,n,w,w,w,w,n',
        '尼姑': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w,n,n,n,w,w,w,w,n',
        '小尼姑': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w,n,n,n,w,w,w,w,sw',
        '静玄师太': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w,n,n,n,w,w,n,n,w',
        '贝锦瑟': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w,n,n,n,e,e,n,n,e',
        '毒蛇': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w,n,n,n,n,n,n,n,n,n,n,n',
        '护法弟子': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w,n,n,n,n,n,n,n,n,n,ne',
        '护法大弟子': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w,n,n,n,n,n,n,n,n,n,ne,ne',
        '静慈师太	': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w,n,n,n,n,n,n,n,n,n,ne,ne,se,e',
        '灭绝掌门': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w,n,n,n,n,n,n,n,n,n,ne,ne,n',
        '方碧翠': 'jh 8,w,nw,n,n,n,n,e,e,n,n,e,em1,n,em2,n,n,n,w,n,n,n,n,n,n,n,n,n,ne,ne,n',
        '斥候': 'jh 8,ne,e,e,e,n,n,n,n,n,e,s',
    },

    '恒山': {
        '恒山': 'jh 9',
        '山盗': 'jh 9',
        '秦卷帘': 'jh 9,n',
        '九戒大师': 'jh 9,n,w',
        '郑婉儿': 'jh 9,n,n',
        '哑太婆': 'jh 9,n,n,e',
        '云问天': 'jh 9,n,n,n',
        '柳云烟': 'jh 9,n,n,n,w',
        '石高达': 'jh 9,n,n,n,n',
        '不可不戒': 'jh 9,n,n,n,n,henshan15_op1',
        '公孙浩': 'jh 9,n,n,n,e',
        '山蛇': 'jh 9,n,n,n,n,n',
        '嵩山弟子': 'jh 9,n,n,n,n,n,event_1_85624865',
        '赵志高': 'jh 9,n,n,n,n,n,event_1_85624865,n,w',
        '司马承': 'jh 9,n,n,n,n,n,event_1_85624865,n,e',
        '沙江龙': 'jh 9,n,n,n,n,n,event_1_85624865,n,n,n,fly',
        '史师兄': 'jh 9,n,n,n,n,n,event_1_85624865,n,n,n,n',
        '定云师太': 'jh 9,n,n,n,n,n,n,n',
        '小师太': 'jh 9,n,n,n,n,n,n,n,w,n',
        '仪容': 'jh 9,n,n,n,n,n,n,n,e,n',
        '仪雨': 'jh 9,n,n,n,n,n,n,n,e,e',
        '吸血蝙蝠': 'jh 9,n,n,n,n,n,n,n,n',
        '定安师太': 'jh 9,n,n,n,n,n,n,n,n,n',
        '神教杀手': 'jh 9,n,n,n,n,n,n,n,n,n,w',
        '魔教杀手': 'jh 9,n,n,n,n,n,n,n,n,n,w,n,e,henshan_qinqitai23_op1',
        '魔教头目': 'jh 9,n,n,n,n,n,n,n,n,n,w,n,n,n,n',
    },

    '武当山': {
        '武当山': 'jh 10',
        '土匪': 'jh 10',
        '野兔': 'jh 10,w,n,n,w',
        '进香客': 'jh 10,w,n,n,w,w',
        '青书少侠': 'jh 10,w,n,n,w,w',
        '知客道长': 'jh 10,w,n,n,w,w,w,n,n,n',
        '道童': 'jh 10,w,n,n,w,w,w,n,n,n,n',
        '清虚道长': 'jh 10,w,n,n,w,w,w,n,n,n,n,n',
        '宋首侠': 'jh 10,w,n,n,w,w,w,n,n,n,n,n',
        '俞莲舟': 'jh 10,w,n,n,w,w,w,n,n,n,n,n,n,n',
        '张三丰': 'jh 10,w,n,n,w,w,w,n,n,n,n,n,n,n,n,n,n',
        '张松溪': 'jh 10,w,n,n,w,w,w,n,n,n,n,n,e',
        '小翠': 'jh 10,w,n,n,w,w,w,n,n,n,n,n,e,e,s',
        '俞二侠': 'jh 10,w,n,n,w,w,w,n,n,n,n,n,e,e,e,e',
        '蜜蜂': 'jh 10,w,n,n,w,w,w,n,n,n,n,e,e,e,e,s,e,s,e,n',
        '小蜜蜂': 'jh 10,w,n,n,w,w,w,n,n,n,n,e,e,e,e,s,e,s,e,n',
        '猴子': 'jh 10,w,n,n,w,w,w,n,n,n,n,e,e,e,e,s,e,s,e,s',
        '布衣弟子':'jh 10,w,n,event_1_74091319,ne,n,sw,nw,w,ne,n,n',
        '剑童':'jh 10,w,n,event_1_74091319,ne,n,sw,nw,w,ne,n,n,n,n,n,n',
        '剑遇安':'jh 10,w,n,event_1_74091319,ne,n,sw,nw,w,ne,n,n,n,n,n,n,n',

    },

    '晚月庄': {
        '晚月庄': 'jh 11',
        '蝴蝶': 'jh 11,e,e,s',
        '彩衣少女': 'jh 11,e,e,s,sw',
        '蓝止萍': 'jh 11,e,e,s,sw,se,w',
        '婢女': 'jh 11,e,e,s,sw,se,w',
        '蓝雨梅': 'jh 11,e,e,s,sw,se,w,n',
        '芳绫': 'jh 11,e,e,s,sw,se,w,w,n,w',
        '昭仪': 'jh 11,e,e,s,sw,se,w,w,w,w',
        '昭蓉': 'jh 11,e,e,s,sw,se,w,w,s,s,w',
        '苗郁手': 'jh 11,e,e,s,sw,se,w,w,s,s,s',
        '圆春': 'jh 11,e,e,s,sw,se,w,w,s,s,s',
        '瑷伦': 'jh 11,e,e,s,sw,se,w,w,s,s,s,e,s,s,e',
        '虞琼衣': 'jh 11,e,e,s,sw,se,w,w,s,s,s,e,s,s,w',
        '龙韶吟': 'jh 11,e,e,s,sw,se,w,w,s,s,s,e,s,s,w,s',
        '阮欣郁': 'jh 11,e,e,s,sw,se,w,w,s,s,s,e,s,s,w,s,e',
        '金仪彤': 'jh 11,e,e,s,sw,se,w,w,s,s,s,e,s,s,w,s,e,e',
        '凤凰': 'jh 11,e,e,s,sw,se,w,w,s,s,s,e,s,s,w,s,e,e',
    },

    '水烟阁': {
        '天邪水烟阁': 'jh 12',
        '天邪虎': 'jh 12,n,n,n',
        '董老头': 'jh 12,n,n,n,e,n,n',
        '水烟阁武士': 'jh 12,n,n,n',
        '潘军禅': 'jh 12,n,n,n,n',
        '萧辟尘': 'jh 12,n,n,n,n',
        '水烟阁红衣武士': 'jh 12,n,n,n,w,n,nw',
        '水烟阁司事': 'jh 12,n,n,n,w,n,nw,e',
        '於兰天武': 'jh 12,n,n,n,w,n,nw,e,n',
    },

    '少林寺': {
        '少林寺': 'jh 13',
        '山猪': 'jh 13',
        '虚通': 'jh 13',
        '虚明': 'jh 13,n',
        '僧人': 'jh 13,n',
        '田鼠': 'jh 13,n,w',
        '道品禅师': 'jh 13,n,w',
        '小孩': 'jh 13,n,w,w',
        '道觉禅师': 'jh 13,n,w,w',
        '扫地和尚': 'jh 13,n,n',
        '慧色尊者': 'jh 13,n,n',
        '慧如尊者': 'jh 13,n,n',
        '道成禅师': 'jh 13,n,n,w',
        '挑水僧': 'jh 13,n,n,w',
        '洒水僧': 'jh 13,n,n,e',
        '玄痛大师': 'jh 13,n,n,n',
        '小北': 'jh 13,n,n,n',
        '进香客': 'jh 13,n,n,n,n',
        '慧名尊者': 'jh 13,n,n,n,n',
        '慧空尊者': 'jh 13,n,n,n,n',
        '狱卒': 'jh 13,n,n,n,n,w',
        '道尘禅师': 'jh 13,n,n,n,n,w',
        '行者': 'jh 13,n,n,n,n,e',
        '扫地僧': 'jh 13,n,n,n,n,e',
        '道象禅师': 'jh 13,n,n,n,n,n',
        '小南': 'jh 13,n,n,n,n,n',
        '托钵僧': 'jh 13,n,n,n,n,n,n',
        '巡寺僧人': 'jh 13,n,n,n,n,n,n',
        '盈盈': 'jh 13,n,n,n,n,n,n,w',
        '打坐僧人': 'jh 13,n,n,n,n,n,n,e',
        '黑衣大汉': 'jh 13,n,n,n,n,n,n,n',
        '清缘比丘': 'jh 13,n,n,n,n,n,n,n',
        '清晓比丘': 'jh 13,n,n,n,n,n,n,n',
        '灰衣僧': 'jh 13,n,n,n,n,n,n,n,shaolin27_op1',
        '守经僧人': 'jh 13,n,n,n,n,n,n,n,shaolin27_op1,event_1_34680156',
        '小沙弥': 'jh 13,n,n,n,n,n,n,n,n',
        '清为比丘': 'jh 13,n,n,n,n,n,n,n,n',
        '清闻比丘': 'jh 13,n,n,n,n,n,n,n,n',
        '清无比丘': 'jh 13,n,n,n,n,n,n,n,n',
        '慧洁尊者': 'jh 13,n,n,n,n,n,n,n,n,w',
        '慧合尊者': 'jh 13,n,n,n,n,n,n,n,n,w',
        '玄苦大师': 'jh 13,n,n,n,n,n,n,n,n,w',
        '玄悲大师': 'jh 13,n,n,n,n,n,n,n,n,e',
        '清乐比丘': 'jh 13,n,n,n,n,n,n,n,n,n',
        '玄慈大师': 'jh 13,n,n,n,n,n,n,n,n,n',
        '清善比丘': 'jh 13,n,n,n,n,n,n,n,n,n',
        '叶十二娘': 'jh 13,n,n,n,n,n,n,n,n,n,shaolin25_op1',
        '立雪亭': 'jh 13,n,n,n,n,n,n,n,n,n,n',
        '清观比丘': 'jh 13,n,n,n,n,n,n,n,n,n,n',
        '清法比丘': 'jh 13,n,n,n,n,n,n,n,n,n,n',
        '白眉老僧': 'jh 13,n,n,n,n,n,n,n,n,n,n',
        '慧真尊者': 'jh 13,n,n,n,n,n,n,n,n,n,n,n',
        '慧虚尊者': 'jh 13,n,n,n,n,n,n,n,n,n,n,n',
        '青松': 'jh 13,n,n,n,n,n,n,n,n,n,n,n',
        '道一禅师': 'jh 13,n,n,n,n,n,n,n,n,n,n,n,w',
        '道正禅师': 'jh 13,n,n,n,n,n,n,n,n,n,n,n,w',
        '玄难大师': 'jh 13,n,n,n,n,n,n,n,n,n,n,n,w',
        '冷幽兰': 'jh 13,n,n,n,n,n,n,n,n,n,n,n,e',
        '慧轮': 'jh 13,n,n,n,n,n,n,n,n,n,n,n,n',
        '慧修尊者': 'jh 13,n,n,n,n,n,n,n,n,n,n,n,n',
        '砍柴僧': 'jh 13,n,n,n,n,n,n,n,n,n,n,n,n,w',
        '道相禅师': 'jh 13,n,n,n,n,n,n,n,n,n,n,n,n,w',
        '达摩老祖': 'jh 13,n,n,n,n,n,n,n,n,n,n,n,n,w,n,get_silver',
        '渡雨': 'jh 13,e,s,s,w,w,w',
        '渡云': 'jh 13,e,s,s,w,w,w',
        '渡风': 'jh 13,e,s,s,w,w,w',
    },

    '唐门': {
        '唐门': 'jh 14,w,n',
        '高一毅': 'jh 14,e',
        '张之岳': 'jh 14,e,event_1_10831808,n',
        '唐门弟子': 'jh 14,w,n',
        '黄色唐门弟子': 'jh 14,w,n,n,n,e,e,n',
        '唐风': 'jh 14,w,n,n',
        '唐看': 'jh 14,w,n,n,n',
        '唐镖': 'jh 14,w,n,n,n,w,w,s',
        '唐芳': 'jh 14,w,n,n,n,w,w,w,n',
        '唐缘': 'jh 14,w,n,n,n,w,w,w,s',
        '方媃': 'jh 14,w,n,n,n,n',
        '唐怒': 'jh 14,w,n,n,n,n',
        '唐健': 'jh 14,w,n,n,n,e,e,n',
        '唐情': 'jh 14,w,n,n,n,e,e,n,n',
        '唐刚': 'jh 14,w,n,n,n,e,e,n,n',
        '欧阳敏': 'jh 14,w,n,n,n,e,e,n,n,ask tangmen_tangmei,ask tangmen_tangmei,e,event_1_8413183,event_1_39383240,e,s,e,n,w,n,n',
        '甄不恶': 'jh 14,sw,s,e,s,s,sw,sw,w,w,s,s,e,e,e,n,ne',
        '竺霁庵': 'jh 14,sw,s,e,s,s,sw,sw,w,w,s,s,e,e,e,n',
        '默剑客': 'jh 14,sw,s,e,s,s,sw,sw,w,w,s,s,e,e,e',
        '无名剑客': 'jh 14,sw,s,e,s,s,sw,sw,w,w,s,s,e,e',
        '程倾城': 'jh 14,sw,s,e,s,s,sw,sw,w,w,s,s,e',
        '素厉铭': 'jh 14,sw,s,e,s,s,sw,sw,w,w,s,s,e,e,e,n,ne,e',
        '骆祺樱': 'jh 14,sw,s,e,s,s,sw,sw,w,w,s,s,e,e,e,n,ne,e,se',
        '谢麟玄': 'jh 14,sw,s,e,s,s,sw,sw,w,w,s,s,e,e,e,n,ne,e,se,s,se',
        '祝公博': 'jh 14,sw,s,e,s,s,sw,sw,w,w,s,s,e,e,e,n,ne,e,se,s,se,e',
        '黄衫少女': 'jh 14,sw,s,e,s,s,sw,sw,w,w,s,s,e,e,e,n,ne,e,se,s,se,e,ne',
        '鹿熙吟': 'jh 14,sw,s,e,s,s,sw,sw,w,w,s,s,e,e,e,n,ne,e,se,s,se,e,ne,n',
    },

    '青城山': {
        '青城山': 'jh 15',
        '海公公': 'jh 15',
        '游方郎中': 'jh 15,n',
        '仵作':'jh 15,s,ne',
        '青城派弟子': 'jh 15,n,nw,w,nw,w,s,s',
        '青城弟子': 'jh 15,n,nw,w,nw,w,s,s',
        '候老大': 'jh 15,n,nw,w,nw,w,s,s',
        '罗老四': 'jh 15,n,nw,w,nw,w,s,s,s',
        '吉人英': 'jh 15,n,nw,w,nw,w,s,s,s,w,w',
        '小室': 'jh 15,n,nw,w,nw,w,s,s,s,w,w,n',
        '贾老二': 'jh 15,n,nw,w,nw,w,s,s,s,w,w,n',
        '余大掌门': 'jh 15,n,nw,w,nw,w,s,s,s,w,w,w',
        '青袍老道': 'jh 15,n,nw,w,nw,w,s,s,s,w,w,w,n',
        '黄袍老道': 'jh 15,n,nw,w,nw,w,s,s,s,w,w,w,n',
        '于老三': 'jh 15,n,nw,w,nw,w,s,s,s,w,w,w,n,w',
        '仆人': 'jh 15,s,s',
        '恶少': 'jh 15,s,s',
        '屠夫': 'jh 15,s,s,e',
        '小甜': 'jh 15,s,s,s,e',
        '读千里': 'jh 15,s,s,s,s,e',
        '福州府尹': 'jh 15,s,s,s,s,s,e',
        '店小二': 'jh 15,s,s,w',
        '酒店老板': 'jh 15,s,s,w',
        '酒店女老板': 'jh 15,s,s,w,n',
        '女侍': 'jh 15,s,s,w,n',
        '阿美': 'jh 15,s,s,s,w,w,n',
        '镖局弟子': 'jh 15,s,s,s,w,w,s,s',
        '黄衣镖师': 'jh 15,s,s,s,w,w,s,s',
        '红衣镖师': 'jh 15,s,s,s,w,w,s,s',
        '黄衣镖师': 'jh 15,s,s,s,w,w,s,s',
        '林师弟': 'jh 15,s,s,s,w,w,w,w,w,n',
        '兵器贩子': 'jh 15,s,s,s,s,w',
        '木道神': 'jh 15,s,s,s,s,s,s,w',
        '背剑老人': 'jh 15,s,s,s,s,s,s,s,s,s,e,s',
    },

    '逍遥林': {
        '逍遥林': 'jh 16',
        '天山姥姥': 'jh 16,s,s,s,s,e,n,e,event_1_5221690,s,w,event_1_57688376,n,n,e,n,event_1_88625473,event_1_82116250,event_1_90680562,event_1_38586637',
        '吴统领': 'jh 16,s,s,s,s,e,e,s,w',
        '蒙面人': 'jh 16,s,s,s,s,e,e,s,w',
        '范棋痴': 'jh 16,s,s,s,s,e,e,s,w,n',
        '冯巧匠': 'jh 16,s,s,s,s,e,e,s,w,s,s',
        '苏先生': 'jh 16,s,s,s,s,e,e,s,w,w',
        '石师妹': 'jh 16,s,s,s,s,e,e,s,w,w,n',
        '薛神医': 'jh 16,s,s,s,s,e,e,s,w,w,n,n',
        '康琴癫': 'jh 16,s,s,s,s,e,e,s,w,w,s,s',
        '苟书痴': 'jh 16,s,s,s,s,e,e,s,w,w,w',
        '李唱戏': 'jh 16,s,s,s,s,e,e,s,w,w,w,w,s',
        '常一恶':'jh 16,s,s,s,s,e,n,e,event_1_56806815',
    },

    '开封': {
        '开封': 'jh 17',
        '骆驼': 'jh 17',
        '毒蛇': 'jh 17,event_1_97081006',
        '野猪': 'jh 17,event_1_97081006,s',
        '黑鬃野猪': 'jh 17,event_1_97081006,s,s,s,s',
        '野猪王': 'jh 17,event_1_97081006,s,s,s,s,s',
        '白面人': 'jh 17,event_1_97081006,s,s,s,s,s,w,kaifeng_yezhulin05_op1',
        '鹤发老人': 'jh 17,event_1_97081006,s,s,s,s,s,w,w',
        '鹿杖老人': 'jh 17,event_1_97081006,s,s,s,s,s,w,w',
        '灯笼小贩': 'jh 17,n',
        '赵大夫': 'jh 17,n,w',
        '欧阳春': 'jh 17,n,e',
        '展昭': 'jh 17,n,e',
        '包拯': 'jh 17,n,e,s',
        '皮货商': 'jh 17,n,n',
        '新郎官': 'jh 17,n,n,w',
        '混混张三': 'jh 17,n,n,w,n',
        '刘财主': 'jh 17,n,n,w,n,n',
        '铁翼': 'jh 17,n,n,w,n,n',
        '李四': 'jh 17,n,n,n',
        '陈举人': 'jh 17,n,n,n,e',
        '流浪汉': 'jh 17,n,n,n,n',
        '天波侍卫': 'jh 17,n,n,n,n,w',
        '杨排风': 'jh 17,n,n,n,n,w',
        '柴郡主': 'jh 17,n,n,n,n,w,w,w',
        '侍女': 'jh 17,n,n,n,n,w,w,w,s',
        '佘太君': 'jh 17,n,n,n,n,w,w,w,s,s,w',
        '穆桂英': 'jh 17,n,n,n,n,w,w,w,n,n',
        '杨文姬': 'jh 17,n,n,n,n,w,w,w,n,n,w',
        '杨延昭': 'jh 17,n,n,n,n,w,w,w,w',
        '富家弟子': 'jh 17,n,n,n,n,e',
        '赵虎': 'jh 17,n,n,n,n,n',
        '踏青妇人': 'jh 17,n,n,n,n,n,e',
        '平夫人': 'jh 17,n,n,n,n,n,e,n,n',
        '恶狗': 'jh 17,n,n,n,n,n,e,n,n,n',
        '平怪医': 'jh 17,n,n,n,n,n,e,n,n,n,event_1_27702191',
        '官兵': 'jh 17,e',
        '七煞堂弟子': 'jh 17,e,s',
        '七煞堂打手': 'jh 17,e,s,s',
        '七煞堂护卫': 'jh 17,e,s,s,s,s',
        '七煞堂堂主': 'jh 17,e,s,s,s,s,s',
        '武官': 'jh 17,n,n,e',
        '高衙内': 'jh 17,n,n,e,s',
        '护寺僧人': 'jh 17,n,n,e,s,s',
        '烧香老太': 'jh 17,n,n,e,s,s,s',
        '素斋师傅': 'jh 17,n,n,e,s,s,s,w',
        '泼皮': 'jh 17,n,n,e,s,s,s,e',
        '老僧人': 'jh 17,n,n,e,s,s,s,e,e',
        '烧火僧人': 'jh 17,n,n,e,s,s,s,e,s',
        '张龙': 'jh 17,n,n,e,s,s,s,s',
        '孔大官人': 'jh 17,n,n,e,s,s,s,s,w',
        '菜贩子': 'jh 17,n,n,e,e',
        '王老板': 'jh 17,n,n,e,e,s',
        '码头工人': 'jh 17,n,n,e,e,n',
        '船老大': 'jh 17,n,n,e,e,n,n',
        '落魄书生': 'jh 17,n,n,e,e,n,get_silver',
        '玄衣少年': 'jh 17,n,n,e,e',
    },

    '光明顶': {
        '光明顶': 'jh 18',
        '村民': 'jh 18',
        '沧桑老人': 'jh 18,e',
        '村妇': 'jh 18,w',
        '老太婆': 'jh 18,w,n',
        '小男孩': 'jh 18,w,n',
        '明教小圣使': 'jh 18,n,nw,n,n,n,n,n',
        '闻旗使': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n',
        '韦蝠王': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n',
        '彭散玉': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n',
        '明教小喽啰': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,w',
        '唐旗使': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,e,e',
        '周散仙': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,e,e,n',
        '庄旗使': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,e,e,n,n',
        '布袋大师': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,w,w,n',
        '颜旗使': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,w,w,n,n',
        '辛旗使': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,w,w',
        '冷步水': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,n,n',
        '冷文臻': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,n,n,n',
        '张散仙': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,n,n,e',
        '殷鹰王': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,n,n,n,n',
        '明教教众': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,n,n,n,n',
        '黛龙王': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,n,n,n,n,w',
        '谢狮王': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,n,n,n,n,e',
        '张教主': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,n,n,n,n,n',
        '范右使': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,n,n,n,n,n,n',
        '小昭': 'jh 18,n,nw,n,n,n,n,n,ne,n,n,n,n,n,n,n,n,n,n,n,n',
    },

    '全真教': {
        '全真教': 'jh 19',
        '终南山游客': 'jh 19,s,s,s,sw,s,e',
        '男童': 'jh 19,s,s,s,sw,s,e,n,nw',
        '全真女弟子': 'jh 19,s,s,s,sw,s,e,n,nw,n',
        '迎客道长': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n',
        '程遥伽': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n',
        '练功弟子': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n',
        '尹志平': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n',
        '健马': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,w,w,w,s',
        '李四': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,w,w,w,s',
        '孙不二': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,e,e,e',
        '柴火道士': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,e,e,n,n',
        '马钰': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n',
        '丘处机': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n',
        '小道童': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,n,w',
        '王处一': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,n,n',
        '鹿道清': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,n,n,e',
        '蓝色小道童': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,w,w,w,s',
        '郝大通': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,w,w,w,w,n,n,n',
        '王重阳': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,w,w,s',
        '老道长': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,n,e',
        '观想兽': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,n,n,w',
        '赵师兄': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,n,n,w,n',
        '老顽童': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,n,n,w,w,n',
        '谭处端': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,n,n,n,n,e',
        '刘处玄': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,n,n,n,n,e,e',
        '小麻雀': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,n,n,n,n,e,e,e,n',
        '老人': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '蜜蜂': 'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w,n',
    },

    '古墓': {
        '古墓': 'jh 20',
        '天蛾': 'jh 20,w,w,s,e,s,s,s',
        '食虫虻': 'jh 20,w,w,s,e,s,s,s,s,s,sw',
        '白玉蜂': 'jh 20,w,w,s,e,s,s,s,s,s,sw,sw,s',
        '红玉蜂': 'jh 20,w,w,s,e,s,s,s,s,s,sw,sw,s,s,e',
        '龙儿': 'jh 20,w,w,s,e,s,s,s,s,s,sw,sw,s,s,s,s,e,e',
        '林祖师': 'jh 20,w,w,s,e,s,s,s,s,s,sw,sw,s,s,s,s,e,e,event_1_3723773,se,n,e,s,e,s,e',
        '孙婆婆': 'jh 20,w,w,s,e,s,s,s,s,s,sw,sw,s,s,s,s,s,s,s,e,e,e,e,s,e',
    },

    '白驼山': {
        '白驼山': 'jh 21',
        '玉门守将': 'jh 21,n,n,n,n,e',
        '匈奴杀手': 'jh 21,n,n,n,n,e,n,n,n',
        '玉门守军': 'jh 21,n,n,n,n,e,e',
        '玄甲骑兵': 'jh 21,n,n,n,n,e,e,e',
        '车夫': 'jh 21,n,n,n,n,e,e,e,e',
        '天策大将': 'jh 21,n,n,n,n,e,e,e,e,e',
        '玄甲参将': 'jh 21,n,n,n,n,e,e,e,e,e',
        '凤七': 'jh 21,n,n,n,n,e,e,e,e,e,s,s,w',
        '慕容孤烟': 'jh 21,n,n,n,n,e,e,e,e,e,e,e,s',
        '醉酒男子': 'jh 21,n,n,n,n,e,e,e,e,e,e,e,s',
        '马匪': 'jh 21,n,n,n,n,e,e,e,e,e,e,e,e,e',
        '花花公子': 'jh 21,nw',
        '寡妇': 'jh 21,nw,ne,ne',
        '小山贼': 'jh 21,nw,ne,n,n',
        '山贼': 'jh 21,nw,ne,n,n,ne,n',
        '侍杖': 'jh 21,nw,ne,n,n,ne,w',
        '雷横天': 'jh 21,nw,ne,n,n,ne,n,n',
        '金花': 'jh 21,nw,ne,n,n,ne,n,n,w',
        '铁匠': 'jh 21,nw,s',
        '农民': 'jh 21,nw,w',
        '舞蛇人': 'jh 21,nw,w',
        '店小二': 'jh 21,nw,w,n',
        '村姑': 'jh 21,nw,w,w',
        '小孩': 'jh 21,nw,w,w,nw',
        '农家妇女': 'jh 21,nw,w,w,nw,e',
        '樵夫': 'jh 21,nw,w,w,nw,nw,nw',
        '门卫': 'jh 21,nw,w,w,nw,n,n',
        '仕卫': 'jh 21,nw,w,w,nw,n,n,n,w',
        '丫环': 'jh 21,nw,w,w,nw,n,n,n,n',
        '欧阳少主': 'jh 21,nw,w,w,nw,n,n,n,n',
        '李教头': 'jh 21,nw,w,w,nw,n,n,n,n,n',
        '小青': 'jh 21,nw,w,w,nw,n,n,n,n,n,w,s',
        '黑冠巨蟒': 'jh 21,nw,w,w,nw,n,n,n,n,n,w,w,w,n',
        '蟒蛇': 'jh 21,nw,w,w,nw,n,n,n,n,n,w,w,w,n,n,n',
        '教练': 'jh 21,nw,w,w,nw,n,n,n,n,n,e',
        '陪练童子': 'jh 21,nw,w,w,nw,n,n,n,n,n,e,ne',
        '管家': 'jh 21,nw,w,w,nw,n,n,n,n,n,n',
        '白衣少女': 'jh 21,nw,w,w,nw,n,n,n,n,n,n,n',
        '老毒物': 'jh 21,nw,w,w,nw,n,n,n,n,n,n,n',
        '肥肥': 'jh 21,nw,w,w,nw,n,n,n,n,n,n,n,e',
        '老材': 'jh 21,nw,w,w,nw,n,n,n,n,n,n,n,e,e',
        '张妈': 'jh 21,nw,w,w,nw,n,n,n,n,n,n,n,n,nw',
        '白兔': 'jh 21,nw,w,w,nw,n,n,n,n,n,n,n,n,ne',
        '狐狸': 'jh 21,nw,w,w,nw,n,n,n,n,n,n,n,n,ne,w',
        '老虎': 'jh 21,nw,w,w,nw,n,n,n,n,n,n,n,n,ne,w',
        '野狼': 'jh 21,nw,w,w,nw,n,n,n,n,n,n,n,n,ne,w',
        '雄狮': 'jh 21,nw,w,w,nw,n,n,n,n,n,n,n,n,ne,w',
        '竹叶青蛇': 'jh 21,nw,w,w,nw,n,n,n,n,n,n,n,n,ne,e',
        '金环蛇': 'jh 21,nw,w,w,nw,n,n,n,n,n,n,n,n,ne,e',
    },

    '嵩山': {
        '嵩山': 'jh 22',
        '脚夫': 'jh 22',
        '秋半仙': 'jh 22,n',
        '风骚少妇': 'jh 22,n',
        '锦袍老人': 'jh 22,n,n',
        '游客': 'jh 22,n,n,w',
        '野狼': 'jh 22,n,n,w,n',
        '山贼': 'jh 22,n,n,w,n,n,n',
        '林立德': 'jh 22,n,n,w,n,n',
        '修行道士': 'jh 22,n,n,w,n,n,n,n',
        '黄色毒蛇': 'jh 22,n,n,w,n,n,n,n,event_1_88705407',
        '麻衣刀客': 'jh 22,n,n,w,n,n,n,n,event_1_88705407,s,s',
        '白板煞星': 'jh 22,n,n,w,n,n,n,n,event_1_88705407,s,s,s,s',
        '小猴': 'jh 22,n,n,w,n,n,n,n,n',
        '万大平': 'jh 22,n,n,w,n,n,n,n,n,e',
        '芙儿': 'jh 22,n,n,w,n,n,n,n,n,e,e',
        '嵩山弟子': 'jh 22,n,n,w,n,n,n,n,n,e,n',
        '麻衣汉子': 'jh 22,n,n,w,n,n,n,n,n,e,n,n,w,n',
        '史师兄': 'jh 22,n,n,w,n,n,n,n,n,e,n,n,n',
        '白头仙翁': 'jh 22,n,n,w,n,n,n,n,n,e,n,n,n,n',
        '左挺': 'jh 22,n,n,w,n,n,n,n,n,e,n,n,n,n,n',
        '钟九曲': 'jh 22,n,n,w,n,n,n,n,n,e,n,n,n,n,n,e',
        '乐老狗': 'jh 22,n,n,w,n,n,n,n,n,e,n,n,n,n,n,w',
        '伙夫': 'jh 22,n,n,w,n,n,n,n,n,e,n,n,n,n,n,w,n,w',
        '沙秃翁': 'jh 22,n,n,w,n,n,n,n,n,e,n,n,n,n,n,w,w',
        '陆太保': 'jh 22,n,n,w,n,n,n,n,n,e,n,n,n,n,n,n',
        '邓神鞭': 'jh 22,n,n,w,n,n,n,n,n,e,n,n,n,n,n,n,n',
        '聂红衣': 'jh 22,n,n,w,n,n,n,n,n,e,n,n,n,n,n,n,n,e',
        '高锦毛': 'jh 22,n,n,w,n,n,n,n,n,e,n,n,n,n,n,n,e',
        '左盟主': 'jh 22,n,n,w,n,n,n,n,n,e,n,n,n,n,n,n,n,n',
        '吸血蝙蝠': 'jh 22,n,n,w,w,s',
        '瞎眼剑客': 'jh 22,n,n,w,w,s,s',
        '瞎眼刀客': 'jh 22,n,n,w,w,s,s,s,s,w',
        '瞎眼老者': 'jh 22,n,n,w,w,s,s,s,s,s',
        '柳易之': 'jh 22,n,n,n,n',
        '卢鸿一': 'jh 22,n,n,n,n,e',
        '英元鹤': 'jh 22,n,n,n,n,e,n',
    },

    '梅庄': {
        '梅庄': 'jh 23',
        '柳府家丁': 'jh 23',
        '柳玥': 'jh 23,n,n',
        '老者': 'jh 23,n,n',
        '筱西风': 'jh 23,n,n,e',
        '梅庄护院': 'jh 23,n,n,n',
        '施令威': 'jh 23,n,n,n,n,n,n',
        '丁管家': 'jh 23,n,n,n,n,n,n,n',
        '向左使': 'jh 23,n,n,n,n,n,n,n,w,w',
        '黑老二': 'jh 23,n,n,n,n,n,n,n,e,s',
        '瘦小汉子': 'jh 23,n,n,n,n,n,n,n,n',
        '丹老四': 'jh 23,n,n,n,n,n,n,n,n,e,n',
        '柳蓉': 'jh 23,n,n,n,n,n,n,n,n,w',
        '丁二': 'jh 23,n,n,n,n,n,n,n,n,w,n',
        '聋哑老人': 'jh 23,n,n,n,n,n,n,n,n,w,w',
        '上官香云': 'jh 23,n,n,n,n,n,n,n,n,n,n',
        '秃笔客': 'jh 23,n,n,n,n,n,n,n,n,n,n,e',
        '琴童': 'jh 23,n,n,n,n,n,n,n,n,n,n,w',
        '黄老朽': 'jh 23,n,n,n,n,n,n,n,n,n,n,w,n',
        '黑衣刀客': 'jh 23,n,n,n,n,n,n,n,n,n,n,event_1_8188693,n',
        '青衣剑客': 'jh 23,n,n,n,n,n,n,n,n,n,n,event_1_8188693,n,n',
        '紫袍老者': 'jh 23,n,n,n,n,n,n,n,n,n,n,event_1_8188693,n,n,w',
        '红衣僧人': 'jh 23,n,n,n,n,n,n,n,n,n,n,event_1_8188693,n,n,n,n',
        '黄衫婆婆': 'jh 23,n,n,n,n,n,n,n,n,n,n,event_1_8188693,n,n,n,e,n',
    },
    '泰山': {
        '泰山': 'jh 24',
        '挑夫': 'jh 24',
        '黄衣刀客': 'jh 24,n',
        '瘦僧人': 'jh 24,n,n',
        '柳安庭': 'jh 24,n,n,n',
        '石云天': 'jh 24,n,n,n,n',
        '程不为': 'jh 24,n,n,n,n,w',
        '朱莹莹': 'jh 24,n,n,n,n,e',
        '温青青': 'jh 24,n,n,n,n,e,e',
        '易安居士': 'jh 24,n,n,n,n,e,e',
        '欧阳留云': 'jh 24,n,n,n,n,e,s',
        '吕进': 'jh 24,n,n,n,n,n',
        '司马玄': 'jh 24,n,n,n,n,n,n',
        '桑不羁': 'jh 24,n,n,n,n,n,n,e',
        '鲁刚': 'jh 24,n,n,n,n,n,n,w',
        '于霸天': 'jh 24,n,n,n,n,n,n,n',
        '神秘游客': 'jh 24,n,n,n,n,n,n,n,e',
        '海棠杀手': 'jh 24,n,n,n,n,n,n,n,n,w',
        '路独雪': 'jh 24,n,n,n,n,n,n,n,n,w,n,n',
        '铁云': 'jh 24,n,n,n,n,n,n,n,n,w,n,n,n',
        '孔翎': 'jh 24,n,n,n,n,n,n,n,n,w,n,n,n,n,n',
        '姬梓烟': 'jh 24,n,n,n,n,n,n,n,n,w,n,n,n,w',
        '朱樱林': 'jh 24,n,n,n,n,n,n,n,n,w,n,n,n,w,n',
        '柳兰儿': 'jh 24,n,n,n,n,n,n,n,n,w,n,n,n,w,n',
        '布衣男子': 'jh 24,n,n,n,n,n,n,n,n,w,n,n,n,w,n,event_1_15941870',
        '阮小': 'jh 24,n,n,n,n,n,n,n,n,w,n,n,n,w,n,event_1_15941870,n',
        '史义': 'jh 24,n,n,n,n,n,n,n,n,w,n,n,n,w,n,event_1_15941870,n,e',
        '阮大': 'jh 24,n,n,n,n,n,n,n,n,w,n,n,n,w,n,event_1_15941870,n,w',
        '司马墉': 'jh 24,n,n,n,n,n,n,n,n,w,n,n,n,w,n,event_1_15941870,n,n,n,w',
        '林忠达': 'jh 24,n,n,n,n,n,n,n,n,w,n,n,n,w,n,event_1_15941870,n,n,n,n',
        '铁面人': 'jh 24,n,n,n,n,n,n,n,n,w,n,n,n,w,n,event_1_15941870,n,n,n,n,n',
        '李三': 'jh 24,n,n,n,n,n,n,n,n,n',
        '仇霸': 'jh 24,n,n,n,n,n,n,n,n,n,e',
        '平光杰': 'jh 24,n,n,n,n,n,n,n,n,n,n',
        '玉师弟': 'jh 24,n,n,n,n,n,n,n,n,n,n,w',
        '玉师兄': 'jh 24,n,n,n,n,n,n,n,n,n,n,n',
        '玉师伯': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n',
        '任娘子': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,e',
        '黄老板': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,e,s',
        '红衣卫士': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,e,e',
        '西门允儿': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,e,e,n,n,w',
        '白飞羽': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,e,e,n,e',
        '商鹤鸣': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,e,e,n,n,e',
        '钟逍林': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,e,e,n,n,n,n',
        '西门宇': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,e,e,n,n,n,n,n',
        '黑衣密探': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,w',
        '毒蛇': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,w,n',
        '筱墨客': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,w,n,n,w',
        '迟一城': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '泰山弟子': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '建除': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,n,n,e',
        '天柏': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '天松': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '玉师叔': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,w',
        '泰山掌门': 'jh 24,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
    },

    '铁血大旗门': {
        '铁血大旗门': 'jh 25',
        '宾奴': 'jh 25,w',
        '渔夫': 'jh 25,e,e,e',
        '叶缘': 'jh 25,e,e,e,e,s',
        '老婆子': 'jh 25,e,e,e,e,s,yell-常春岛渡口',
        '潘兴鑫': 'jh 25,e,e,e,e,s,yell-常春岛渡口,s',
        '罗少羽': 'jh 25,e,e,e,e,s,yell-常春岛渡口,e',
        '青衣少女': 'jh 25,e,e,e,e,s,yell-常春岛渡口,e,ne',
        '日岛主': 'jh 25,e,e,e,e,s,yell-常春岛渡口,e,ne,se,e,e,e,e',
        '铁掌门': 'jh 25,e,e,e,e,s,yell-常春岛渡口,s,e,event_1_81629028',
        '夜皇': 'jh 25,e,e,e,e,s,yell-常春岛渡口,s,e,event_1_81629028,s,e,n,w,w',
        '红衣少女': 'jh 25,e,e,e,e,s,yell-常春岛渡口,s,e,event_1_81629028,s,e,n,w,w,s,w',
        '紫衣少女': 'jh 25,e,e,e,e,s,yell-常春岛渡口,s,e,event_1_81629028,s,e,n,w,w,s,w',
        '蓝衣少女': 'jh 25,e,e,e,e,s,yell-常春岛渡口,s,e,event_1_81629028,s,e,n,w,w,s,w',
        '橙衣少女': 'jh 25,e,e,e,e,s,yell-常春岛渡口,s,e,event_1_81629028,s,e,n,w,w,s,w',
        '小贩': 'jh 11,e,e,s,n,nw,w,nw,e',
        '酒肉和尚': 'jh 11,e,e,s,n,nw,w,nw,e,e,e,n,w',
        '陈子昂': 'jh 11,e,e,s,n,nw,w,nw,e,e,e,se',
    },

    '大昭寺': {
        '大昭寺': 'jh 26',
        '小绵羊': 'jh 26,w',
        '草原狼': 'jh 26,w',
        '大绵羊': 'jh 26,w,w',
        '李将军': 'jh 26,w,w,n',
        '牧羊女': 'jh 26,w,w,w',
        '小羊羔': 'jh 26,w,w,w',
        '城卫': 'jh 26,w,w,w,w,w',
        '塔僧': 'jh 26,w,w,w,w,w,n',
        '紫衣妖僧': 'jh 26,w,w,w,w,w,n',
        '关外旅客': 'jh 26,w,w,w,w,w,w',
        '护寺喇嘛': 'jh 26,w,w,w,w,w,w',
        '余洪兴': 'jh 26,w,w,w,w,w,w,s',
        '店老板': 'jh 26,w,w,w,w,w,w,s,e',
        '陶老大': 'jh 26,w,w,w,w,w,w,s,w',
        '野狗': 'jh 26,w,w,w,w,w,w,s,s,w,w,w,w',
        '樵夫': 'jh 26,w,w,w,w,w,w,s,s,w,w,w,w',
        '收破烂的': 'jh 26,w,w,w,w,w,w,s,s,w,w,w,w',
        '乞丐': 'jh 26,w,w,w,w,w,w,s,s,w,w,w,w,n,n',
        '护寺藏尼': 'jh 26,w,w,w,w,w,w,n',
        '黄色护寺藏尼': 'jh 26,w,w,w,w,w,w,w,w,w,w',
        '卜一刀': 'jh 26,w,w,w,w,w,w,n,n,e',
        '疯狗': 'jh 26,w,w,w,w,w,w,n,n,w',
        '胭松': 'jh 26,w,w,w,w,w,w,w,w,n,e',
        '塔祝': 'jh 26,w,w,w,w,w,w,w,w,w',
        '灵空': 'jh 26,w,w,w,w,w,w,w,w,w,w',
        '葛伦': 'jh 26,w,w,w,w,w,w,w,w,w,w,ask lama_master,event_1_91837538',
    },

    '黑木崖': {
        '黑木崖': 'jh 27',
        '店小二': 'jh 27,ne,w',
        '客店老板': 'jh 27,ne,w',
        '外面船夫': 'jh 27,ne,nw,w,nw,w,w',
        '里面船夫': 'jh 27,ne,nw,w,nw,w,w,yell-饮马滩',
        '黑熊': 'jh 27,se,e',
        '怪人': 'jh 27,se,e,e,e',
        '冉无望': 'jh 27,ne,n,ne',
        '魔教弟子': 'jh 27,ne,nw,w,nw,w,w,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n',
        '白色魔教弟子': 'jh 27,ne,nw,w,nw,w,w,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n',
        '青色魔教弟子': 'jh 27,ne,nw,w,nw,w,w,yell-饮马滩,w,nw,n,n,n,n,n',
        '蓝色魔教弟子': 'jh 27,ne,nw,w,nw,w,w,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n',
        '黄色魔教弟子': 'jh 27,ne,nw,w,nw,w,w,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n',
        '见钱开': 'jh 27,ne,nw,w,nw,w,w,kill-船夫,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,e',
        '上官云': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,w,n',
        '葛停香': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,w,nw',
        '桑三娘': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,w,ne',
        '鲍长老': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,w,w',
        '贾布': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,w,sw',
        '罗烈': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,w,se',
        '王诚': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,ne',
        '紫色魔教犯人': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,e,n',
        '青色魔教犯人': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,e,e,e,n',
        '红色魔教犯人': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,e,e,e,e,n',
        '蓝色魔教犯人': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,e,e,e,e,e,n',
        '紫色魔教弟子': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,n',
        '亮蓝色魔教弟子': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,n,n,n,n,n,n',
        '花想容': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,n,n,n,n,n,w',
        '曲右使': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,n,n,n,n,n,w,w',
        '张矮子': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,n,n,n,n,n,w,w,w',
        '张白发': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w',
        '赵长老': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,n,n,n,n,n,w,w,w,w,w',
        '独孤风': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,n,n,n,n,n,e',
        '杨延庆': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,n,n,n,n,n,e,e',
        '范松': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,n,n,n,n,n,e,e,e',
        '巨灵': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e',
        '楚笑': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,n,n,n,n,n,e,e,e,e,e',
        '莲亭': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,n,n,n,n,n,n',
        '东方教主': 'jh 27,ne,nw,w,nw,w,w,kill heimuya_shaogong,yell-饮马滩,w,nw,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell-空地,n,n,n,n,n,n,n,n,n,n,n,n,n,event_1_57107759,e,e,n,w',
    },

    '星宿海': {
        '星宿海': 'jh 28',
        '狮吼师兄': 'jh 28,n,n',
        '星宿派鼓手': 'jh 28,n,n',
        '星宿派号手': 'jh 28,n,n',
        '星宿派钹手': 'jh 28,n,n',
        '摘星大师兄': 'jh 28,n,n,n',
        '丁老怪': 'jh 28,n,n,n,n,n,n,n',
        '采花子': 'jh 28,n,n,n,n,n,n,nw,w',
        '牧羊人': 'jh 28,n',
        '紫姑娘': 'jh 28,n,w',
        '采药人': 'jh 28,n,w,w',
        '毒蛇': 'jh 28,n,w,w,w,w,n',
        '雪豹': 'jh 28,n,w,w,w,w,w,w,nw,ne,nw,w',
        '牦牛': 'jh 28,n,w,w,w,w,w,w,nw,ne,nw,w',
        '天狼师兄': 'jh 28,n,w,n',
        '出尘师弟': 'jh 28,n,w,n,n',
        '波斯商人': 'jh 28',
        '梅师姐': 'jh 28,sw',
        '铁尸': 'jh 28,sw,nw,sw,sw,nw,nw,se,sw',
        '伊犁': 'jh 28,nw',
        '矮胖妇女': 'jh 28,nw',
        '唐冠': 'jh 28,nw',
        '买卖提': 'jh 28,nw,w',
        '巴依': 'jh 28,nw,e',
        '小孩': 'jh 28,nw,e',
        '阿拉木罕': 'jh 28,nw,nw',
        '伊犁马': 'jh 28,nw,nw',
        '阿凡提': 'jh 28,nw,e,e',
    },

    '茅山': {
        '茅山': 'jh 29',
        '野猪': 'jh 29,n',
        '张天师': 'jh 29,n,n,n,n,event_1_60035830-平台,event_1_65661209-无名山峡谷,n',
        '万年火龟': 'jh 29,n,n,n,n,event_1_60035830-平台,event_1_65661209-无名山峡谷,n',
        '阳明居士': 'jh 29,n,n,n,n,event_1_60035830-平台,e',
        '道士': 'jh 29,n,n,n,n,event_1_60035830-平台,event_1_65661209-洞口,n,n,n,n,n,e,n',
        '孙天灭': 'jh 29,n,n,n,n,event_1_60035830-平台,event_1_65661209-洞口,n,n,n,n,n,n,n',
        '道灵': 'jh 29,n,n,n,n,event_1_60035830-平台,event_1_65661209-洞口,n,n,n,n,n,n,n,event_1_98579273',
        '护山使者': 'jh 29,n,n,n,n,event_1_60035830-平台,event_1_65661209-洞口,n,n,n,n,n,n,n,event_1_98579273,w',
        '林忌': 'jh 29,n,n,n,n,event_1_60035830-平台,event_1_65661209-洞口,n,n,n,n,n,n,n,event_1_98579273,n',
    },

    '桃花岛': {
        '桃花岛': 'jh 30',
        '陆废人': 'jh 30',
        '神雕大侠': 'jh 30,n,n,ne',
        '老渔夫': 'jh 30,n,n,n,n,n,n',
        '后院桃花岛弟子': 'jh 30,n,n,n,n,n,n,n',
        '哑仆人': 'jh 30,n,n,n,n,n,n,n,w,w',
        '丁高阳': 'jh 30,n,n,n,n,n,n,n,n,n,n,e,s',
        '曲三': 'jh 30,n,n,n,n,n,n,n,n,n,n,e,e,n',
        '习武房桃花岛弟子': 'jh 30,n,n,n,n,n,n,n,n,n,n,w',
        '药房桃花岛弟子': 'jh 30,n,n,n,n,n,n,n,n,n,n,w,w,s',
        '哑仆': 'jh 30,n,n,n,n,n,n,n,n,n,n,w,w,s',
        '黄岛主': 'jh 30,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
        '蓉儿': 'jh 30,n,n,n,n,n,n,n,n,n,n,n,n,n,n,se,s',
        '傻姑': 'jh 30,yell-牛家村海边,w,n',
        '戚总兵': 'jh 30,yell-牛家村海边,w,n,e',
    },

    '铁雪山庄': {
        '铁雪山庄': 'jh 31',
        '樵夫': 'jh 31,n,n,n',
        '红色樵夫': 'jh 31,n,n,n,w',
        '老张': 'jh 31,n,n,n,w,w,w,w,n',
        '雪鸳': 'jh 31,n,n,n,w,w,w,w,n,n',
        '铁少': 'jh 31,n,n,n,w,w,w,w,n,n,n',
        '雪蕊儿': 'jh 31,n,n,n,w,w,w,w,n,n,n',
        '小翠': 'jh 31,n,n,n,w,w,w,w,n,n,n',
        '黑袍公': 'jh 31,n,n,n,w,w,w,w,n,n,n,n',
        '白袍公': 'jh 31,n,n,n,w,w,w,w,n,n,n,n',
        '男主角◆番茄':'jh 31,n,se,e,se,s,s,sw,se,se,e,nw,e,ne,n,ne,n,n,n,n,n,n,w,n',
    },

    '慕容山庄': {
        '慕容山庄': 'jh 32',
        '家丁': 'jh 32,n,n',
        '邓家臣': 'jh 32,n,n,se',
        '朱姑娘': 'jh 32,n,n,se,e,s,s',
        '船工小厮': 'jh 32,n,n,se,e,s,s,event_1_99232080',
        '芳绫': 'jh 32,n,n,se,e,s,s,event_1_99232080,e,e,s,e,s,e,e,e',
        '无影斥候': 'jh 32,n,n,se,e,s,s,event_1_99232080,e,e,s,e,s,e,e,e,n',
        '柳掌门': 'jh 32,n,n,se,e,s,s,event_1_99232080,e,e,s,e,s,e,e,e,s,s,event_1_92057893,e,s,event_1_8205862',
        '慕容老夫人': 'jh 32,n,n,se,n',
        '慕容侍女': 'jh 32,n,n,se,n',
        '公冶家臣': 'jh 32,n,n,se,n,n',
        '包家将': 'jh 32,n,n,se,n,n,n,n',
        '风波恶': 'jh 32,n,n,se,n,n,n,n,n',
        '慕容公子': 'jh 32,n,n,se,n,n,n,n,w,w,n',
        '慕容家主': 'jh 32,n,n,se,n,n,n,n,w,w,w,n,event_1_72278818,event_1_35141481,w',
        '小兰': 'jh 32,n,n,se,n,n,n,n,w,w,w,n,w',
        '神仙姐姐': 'jh 32,n,n,se,n,n,n,n,w,w,w,n,w,n,e,n,e,n,e',
        '严妈妈': 'jh 32,n,n,se,n,n,n,n,w,w,w,n,w,n,e,n,e,n,w',
        '王夫人': 'jh 32,n,n,se,n,n,n,n,w,w,w,n,w,n,e,n,e,n,n',
        '小茗': 'jh 32,n,n,se,n,n,n,n,w,w,w,n,w,n,e,n,e,n,n',
    },

    '大理': {
        '大理': 'jh 33',
        '摆夷女子': 'jh 33,sw,sw',
        '士兵': 'jh 33,sw,sw,s,s',
        '武将': 'jh 33,sw,sw,s,s',
        '下关城台夷商贩': 'jh 33,sw,sw,s,s,s,nw,n',
        '乌夷商贩': 'jh 33,sw,sw,s,s,s,nw,n',
        '土匪': 'jh 33,sw,sw,s,s,s,nw,n,ne,n,n,ne',
        '猎人': 'jh 33,sw,sw,s,s,s,nw,n,nw,n',
        '皮货商': 'jh 33,sw,sw,s,s,s,nw,n,nw,n',
        '牧羊女': 'jh 33,sw,sw,s,s,s,nw,n,nw,n,n,n,n,e,e',
        '牧羊人': 'jh 33,sw,sw,s,s,s,nw,n,nw,n,n,n,n,e,e',
        '破嗔': 'jh 33,sw,sw,s,s,s,s,w,w,n',
        '破疑': 'jh 33,sw,sw,s,s,s,s,w,w,n',
        '段恶人': 'jh 33,sw,sw,s,s,s,s,w,w,n,se',
        '吴道长': 'jh 33,sw,sw,s,s,s,s,w,w,w,w',
        '农夫': 'jh 33,sw,sw,s,s,s,s,w,w,w,w,w,n,e',
        '乌夷老祭祀': 'jh 33,sw,sw,s,s,s,s,w,w,w,w,w,n,w,se',
        '少女': 'jh 33,sw,sw,s,s,s,s,w,w,w,w,w,n,ne',
        '山羊': 'jh 33,sw,sw,s,s,s,s,w,w,w,w,w,n,n',
        '孟加拉虎': 'jh 33,sw,sw,s,s,s,s,w,w,w,w,w,s,s,w,w',
        '神农帮弟子': 'jh 33,sw,sw,s,s,s,s,w,w,s',
        '无量剑弟子': 'jh 33,sw,sw,s,s,s,s,w,w,s,nw',
        '朱护卫': 'jh 33,sw,sw,s,s,s,s,s,w',
        '锦衣卫士': 'jh 33,sw,sw,s,s,s,s,s,w',
        '太监': 'jh 33,sw,sw,s,s,s,s,s,w,n,n',
        '宫女': 'jh 33,sw,sw,s,s,s,s,s,w,n,n,n,n',
        '傅护卫': 'jh 33,sw,sw,s,s,s,s,s,e',
        '褚护卫': 'jh 33,sw,sw,s,s,s,s,s,e,n',
        '家丁': 'jh 33,sw,sw,s,s,s,s,s,e,n,se',
        '霍先生': 'jh 33,sw,sw,s,s,s,s,s,e,n,se,w',
        '华司徒': 'jh 33,sw,sw,s,s,s,s,s,e,n,se,n,w',
        '范司马': 'jh 33,sw,sw,s,s,s,s,s,e,n,se,n,e',
        '巴司空': 'jh 33,sw,sw,s,s,s,s,s,e,n,se,n,n',
        '段王妃': 'jh 33,sw,sw,s,s,s,s,s,e,n,se,e,e',
        '石人': 'jh 33,sw,sw,s,s,s,s,s,e,n,se,e,e,s',
        '段无畏': 'jh 33,sw,sw,s,s,s,s,s,e,n,se,e,e,n',
        '古护卫': 'jh 33,sw,sw,s,s,s,s,s,e,n,se,e,e,n,n',
        '王府御医': 'jh 33,sw,sw,s,s,s,s,s,e,n,se,e,e,n,n,n',
        '段皇爷': 'jh 33,sw,sw,s,s,s,s,s,e,n,se,e,e,n,n,n,ne,n',
        '婉清姑娘': 'jh 33,sw,sw,s,s,s,s,s,e,n,se,e,e,n,n,n,ne,e,e,n',
        '薛老板': 'jh 33,sw,sw,s,s,s,s,s,s,e,n',
        '石匠': 'jh 33,sw,sw,s,s,s,s,s,s,e,e',
        '摆夷小孩': 'jh 33,sw,sw,s,s,s,s,s,s,w',
        '江湖艺人': 'jh 33,sw,sw,s,s,s,s,s,s,s',
        '太和居店小二': 'jh 33,sw,sw,s,s,s,s,s,s,s,e',
        '歌女': 'jh 33,sw,sw,s,s,s,s,s,s,s,e,n',
        '南国姑娘': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,e,s',
        '摆夷老叟': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,e,s',
        '野兔': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,se',
        '盛皮罗客商': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,s,s,s',
        '客店店小二': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,s,s,s,e',
        '古灯大师': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s',
        '渔夫': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,se,sw,n',
        '台夷猎人': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,se,sw,s',
        '台夷妇女': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,se,sw,w',
        '台夷姑娘': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,s,s,s,sw,sw',
        '水牛': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,s,s,s,sw,sw,n',
        '台夷农妇': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,s,s,s,sw,sw,s',
        '武定镇采笋人': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,s,s,s,sw,sw,w',
        '族长': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,e,n,n',
        '祭祀': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,e,n,n,n',
        '侍者': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,w,w,se',
        '高侯爷': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,w,w,se,n',
        '素衣卫士': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,w,w,se,n',
        '陪从': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,w,w,se,n,n,w,se',
        '傣族首领': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,s,w,w,se,n,n,e,e,se',
        '大土司': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,n,w,n',
        '族头人': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,n,w,n,se,ne',
        '黄衣卫士': 'jh 33,sw,sw,s,s,s,s,s,s,s,s,s,n,w,s',
        '毒蜂': 'jh 33,sw,sw,s,s,s,s,e,e,n',
        '平通镖局镖头': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,s',
        '麻雀': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,s,s',
        '小道姑': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,s,s,w',
        '刀俏尼': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,s,s,w,n',
        '僧人': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,e,e',
        '枯大师': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,e,e,e,n',
        '恶奴': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,e,e,e,e,e',
        '贵公子': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,e,e,e,e,e',
        '游客': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,s,e',
        '村妇': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,s,e,e,e',
        '段公子': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,s,e,e,e,ne',
        '竹叶青蛇': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,s,e,e,e,ne,e,e,se,e,e,sw',
        '阳宗镇台夷商贩': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,s,e,e,e,ne,e,e,se,e,e',
        '阳宗镇采笋人': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,s,e,e,e,ne,e,e,se,e,e,sw,s',
        '砍竹人': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,s,e,e,e,ne,e,e,se,e,e,sw,s,s',
        '养蚕女': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,s,e,e,e,ne,e,e,se,e,e,sw,s,s,e,e',
        '纺纱女': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,s,e,e,e,ne,e,e,se,e,e,sw,s,s,e,n,e,n',
        '老祭祀': 'jh 33,sw,sw,s,s,s,s,e,e,e,e,se,s,e,e,e,ne,e,e,se,e,e,ne,e,n',
    },

    '断剑山庄': {
        '断剑山庄': 'jh 34',
        '黑袍老人': 'jh 34,ne,e,e,e,e,e,n,e,n',
        '白袍老人': 'jh 34,ne,e,e,e,e,e,n,e,n',
        '和尚': 'jh 34,ne,e,e,e,e,e,n,n,n,n,n,w',
        '尼姑': 'jh 34,ne,e,e,e,e,e,n,n,n,n,n,n,e',
        '摆渡老人': 'jh 34,ne,e,e,e,e,e,n,n,n,w,w,w,n,n,yell-小船',
        '天怒剑客': 'jh 34,ne,e,e,e,e,e,n,n,n,w,w,w,n,n,yell-断剑山庄,n,n,e,e',
        '任笑天': 'jh 34,ne,e,e,e,e,e,n,n,n,w,w,w,n,n,yell-断剑山庄,n,n,w,w',
        '摘星老人': 'jh 34,ne,e,e,e,e,e,n,n,n,w,w,w,n,n,yell-断剑山庄,n,n,w,s,w',
        '落魄中年': 'jh 34,ne,e,e,e,e,e,n,n,n,w,w,w,n,n,yell-断剑山庄,n,n,w,s',
        '栽花老人': 'jh 34,ne,e,e,e,e,e,n,n,n,w,w,w,n,n,yell-断剑山庄,n,n,n',
        '背刀人': 'jh 34,ne,e,e,e,e,e,n,n,n,w,w,w,n,n,yell-断剑山庄,n,n,n,e,e',
        '雁南飞': 'jh 34,ne,e,e,e,e,e,n,n,n,w,w,w,n,n,yell-断剑山庄,n,n,n,e,n,e',
        '梦如雪': 'jh 34,ne,e,e,e,e,e,n,n,n,w,w,w,n,n,yell-断剑山庄,n,n,n,n,w,w',
        '剑痴': 'jh 34,ne,e,e,e,e,e,n,n,n,w,w,w,n,n,yell-断剑山庄,n,n,n,n,n,n',
        '雾中人': 'jh 34,ne,e,e,e,e,e,n,n,n,w,w,w,n,n,yell-断剑山庄,n,n,n,n,n,n,n',
        '独孤不败': 'jh 34,ne,e,e,e,e,e,n,n,n,w,w,w,n,n,yell-断剑山庄,n,n,n,n,n,n,e,e,event_1_10251226',
    },

    '冰火岛': {
        '冰火岛': 'jh 35',
        '火麒麟王': 'jh 35,nw,nw,nw,n,ne,nw',
        '火麒麟': 'jh 35,nw,nw,nw,n,ne,nw,w,nw,e,e,n,nw',
        '麒麟幼崽': 'jh 35,nw,nw,nw,n,ne,nw,w,nw,e,e,n,nw',
        '游方道士': 'jh 35,nw,nw,nw,n,ne,nw,w,nw,e,e,e',
        '梅花鹿': 'jh 35,nw,nw,nw,n,ne,nw,w,nw,e,e,e,e,e',
        '雪狼': 'jh 35,nw,nw,nw,n,ne,nw,w,nw,e,e,e,e,e,se,s,se,w,sw',
        '白熊': 'jh 35,nw,nw,nw,n,ne,nw,w,nw,e,e,e,e,e,se,s,se,w,sw',
        '殷夫人': 'jh 35,nw,nw,nw,n,ne,nw,w,nw,e,e,e,e,e,se,s,se,w,nw,s,s,s,s,s,s,e',
        '张五侠': 'jh 35,nw,nw,nw,n,ne,nw,w,nw,e,e,e,e,e,se,s,se,w,nw,s,s,s,s,s,s,w,w,n,e,n,w,w,s,s',
        '赵郡主': 'jh 35,nw,nw,nw,n,ne,nw,w,nw,e,e,e,e,e,se,n,n',
        '谢狮王': 'jh 35,nw,nw,nw,n,ne,nw,w,nw,e,e,e,e,e,se,n,n,ne,n',
        '黑衣杀手': 'jh 35,nw,nw,nw,n,ne,nw,w,nw,e,e,e,e,e,se,n,n,w,n,w,nw',
        '元真和尚': 'jh 35,nw,nw,nw,n,ne,nw,w,nw,e,e,e,e,e,se,n,n,w,n,w,nw,sw,se,s,sw,sw,se,se',
    },

    '侠客岛': {
        '侠客岛': 'jh 36',
        '黄衣船夫': 'jh 36,yell-侠客岛渡口',
        '侠客岛厮仆': 'jh 36,yell-侠客岛渡口',
        '张三': 'jh 36,yell-侠客岛渡口,e',
        '云游高僧': 'jh 36,yell-侠客岛渡口,e,ne,ne',
        '王五': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,s',
        '白衣弟子': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,s',
        '店小二': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,s,e',
        '侠客岛闲人': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,s,w',
        '石公子': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,n',
        '书生': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,n',
        '丁当': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,n,n',
        '白掌门': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,n,w',
        '马六': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,e',
        '侠客岛弟子': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,e',
        '李四': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,e,n',
        '蓝衣弟子': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,e,n',
        '童子': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,e,e',
        '龙岛主': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,e,e',
        '木岛主': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,e,e,fly,e',
        '侍者': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,e,e,e',
        '史婆婆': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,e,e,e,e',
        '矮老者': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,e,e,e,e,e,n,n,n,e,ne,nw',
        '高老者': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,e,e,e,e,e,n,n,n,e,ne,nw,w',
        '谢居士': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,e,e,e,e,e,n,e,e,ne',
        '朱熹': 'jh 36,yell-侠客岛渡口,e,ne,ne,ne,e,e,e,e,e,e,n,n,n,w,w',
        '小猴子': 'jh 36,yell-侠客岛渡口,e,se,e',
        '樵夫': 'jh 36,yell-侠客岛渡口,e,se,e,e',
        '医者': 'jh 36,yell-侠客岛渡口,e,se,e,e,e,e',
        '石帮主': 'jh 36,yell-侠客岛渡口,e,se,e,e,n,e,s',
        '野猪': 'jh 36,yell-侠客岛渡口,e,se,e,e,w',
        '渔家男孩': 'jh 36,yell-侠客岛渡口,e,se,e,e,s,s,s,w',
        '渔夫': 'jh 36,yell-侠客岛渡口,e,se,e,e,s,s,s,s',
        '渔家少女': 'jh 36,yell-侠客岛渡口,e,se,e,e,s,s,s,e',
        '阅书老者': 'jh 36,yell-侠客岛渡口,e,se,e,e,s,s,s,e,ne',
        '青年海盗': 'jh 36,yell-侠客岛渡口,e,se,e,e,s,s,s,e,ne,e,e,n',
        '老海盗': 'jh 36,yell-侠客岛渡口,e,se,e,e,s,s,s,e,ne,e,e,n,e,n',
    },

    '绝情谷': {
        '绝情谷': 'jh 37',
        '土匪': 'jh 37,n',
        '村民': 'jh 37,n,e,e',
        '野兔': 'jh 37,n,e,e,nw,nw,w,n,nw,n,n',
        '绝情谷弟子': 'jh 37,n,e,e,nw,nw,w,n,nw,n,n,ne,n,nw',
        '天竺大师': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,nw,w',
        '养花女': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,nw,w,n',
        '侍女': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,nw,w,n,nw,n',
        '谷主夫人': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,nw,w,n,nw,n,nw',
        '门卫': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,nw,w,n,nw,n,nw,n,nw',
        '绝情谷谷主': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,nw,w,n,nw,n,nw,n,nw,n,nw',
        '谷主分身': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,nw,w,n,nw,n,nw,n,nw,n,nw',
        '白衣女子': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,nw,w,n,nw,n,nw,ne,n,ne',
        '采花贼': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,nw,w,n,nw,n,nw,n,ne,e,ne,e,n',
        '拓跋嗣': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,nw,w,n,nw,n,ne',
        '没藏羽无': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,nw,w,n,nw,n,ne,e',
        '野利仁嵘': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,nw,w,n,nw,n,ne,e,ne',
        '嵬名元昊': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,nw,w,n,nw,n,ne,e,ne,se',
        '雪若云': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,ne,ne,event_1_16813927',
        '养鳄人': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,ne,ne,se',
        '鳄鱼': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,ne,ne,se',
        '囚犯': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,ne,ne,se,s,s,s',
        '地牢看守': 'jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,ne,ne,se,s,s,s,w',
    },

    '碧海山庄': {
        '碧海山庄': 'jh 38',
        '法明大师': 'jh 38,n,n,w',
        '僧人': 'jh 38,n,n,w',
        '隐士': 'jh 38,n,n,n,n,w',
        '野兔': 'jh 38,n,n,n,n,w,w',
        '护卫': 'jh 38,n,n,n,n,n,n,n',
        '侍女': 'jh 38,n,n,n,n,n,n,n,w,w,nw',
        '尹秋水': 'jh 38,n,n,n,n,n,n,n,w,w,nw,w',
        '养花女': 'jh 38,n,n,n,n,n,n,n,w,w,nw,w,w,n,n',
        '家丁': 'jh 38,n,n,n,n,n,n,n,n',
        '耶律楚哥': 'jh 38,n,n,n,n,n,n,n,n,n',
        '护卫总管': 'jh 38,n,n,n,n,n,n,n,n,n',
        '易牙传人': 'jh 38,n,n,n,n,n,n,n,n,n,e,se,s',
        '砍柴人': 'jh 38,n,n,n,n,n,n,n,n,n,e,se,s,e',
        '独孤雄': 'jh 38,n,n,n,n,n,n,n,n,n,n,n,e,e,se,se,e,n',
        '王子轩': 'jh 38,n,n,n,n,n,n,n,n,n,n,n,e,e,se,se,e,n,n,n',
        '王昕': 'jh 38,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
    },

    '天山': {
        '天山': 'jh 39,ne',
        '周教头': 'jh 39,ne',
        '辛怪人': 'jh 39,ne,e,n,ne',
        '穆小哥': 'jh 39,ne,e,n,ne,ne,n',
        '牧民': 'jh 39,ne,e,n,nw',
        '塞外胡兵': 'jh 39,ne,e,n,nw,nw,w,s,s',
        '胡兵头领': 'jh 39,ne,e,n,nw,nw,w,s,s,sw,n,nw,e,sw,w',
        '乌刀客': 'jh 39,ne,e,n,nw,nw,w,s,s,sw,n,nw,e,sw,w,s,w',
        '波斯商人': 'jh 39,ne,e,n,ne,ne,se',
        '贺好汉': 'jh 39,ne,e,n,ne,ne,se,e',
        '铁好汉': 'jh 39,ne,e,n,ne,ne,se,e',
        '刁屠夫': 'jh 39,ne,e,n,ne,ne,se,e,n',
        '金老板': 'jh 39,ne,e,n,ne,ne,se,e,n',
        '韩马夫': 'jh 39,ne,e,n,ne,ne,se,e,e',
        '蒙面女郎': 'jh 39,ne,e,n,ne,ne,se,e,s,e,se',
        '宝箱': 'jh 39,ne,e,n,nw,nw,w,s,s,sw,n,nw,e,sw,w,s,w,n,w,event_1_69872740',
        '武壮士': 'jh 39,ne,e,n,ne,ne,n,ne,nw,event_1_58460791-失足岩,ts1,nw,n',
        '程首领': 'jh 39,ne,e,n,ne,ne,n,ne,nw,event_1_58460791-失足岩,ts1,nw,n,ne,nw',
        '菊剑': 'jh 39,ne,e,n,ne,ne,n,ne,nw,event_1_58460791-失足岩,ts1,nw,n,ne,nw,nw,n',
        '石嫂': 'jh 39,ne,e,n,ne,ne,n,ne,nw,event_1_58460791-失足岩,ts1,nw,n,ne,nw,nw,w,w',
        '兰剑': 'jh 39,ne,e,n,ne,ne,n,ne,nw,event_1_58460791-失足岩,ts1,nw,n,ne,nw,nw,w,n',
        '符针神': 'jh 39,ne,e,n,ne,ne,n,ne,nw,event_1_58460791-失足岩,ts1,nw,n,ne,nw,nw,w,n,n',
        '梅剑': 'jh 39,ne,e,n,ne,ne,n,ne,nw,event_1_58460791-失足岩,ts1,nw,n,ne,nw,nw,w,n,n,e',
        '竹剑': 'jh 39,ne,e,n,ne,ne,n,ne,nw,event_1_58460791-失足岩,ts1,nw,n,ne,nw,nw,w,n,n,w',
        '余婆': 'jh 39,ne,e,n,ne,ne,n,ne,nw,event_1_58460791-失足岩,ts1,nw,n,ne,nw,nw,w,n,n,n,e,nw',
        '九翼': 'jh 39,ne,e,n,ne,ne,n,ne,nw,event_1_58460791-失足岩,ts1,nw,n,ne,nw,nw,w,n,n,n,e,nw,w,ne',
        '天山死士': 'jh 39,ne,e,n,ne,ne,n,ne,nw,event_1_58460791-失足岩,ts1,nw,n,ne,nw,nw,w,n,n,n,e,nw,w,nw',
        '天山大剑师': 'jh 39,ne,e,n,ne,ne,n,ne,nw,event_1_58460791-失足岩,ts1,nw,n,ne,nw,nw,w,n,n,n,e,nw,w,nw',
        '护关弟子': 'jh 39,ne,e,n,ne,ne,n,ne,nw,event_1_58460791-失足岩,ts1,nw,n,ne,nw,nw,w,n,n,n,e,e,s',
        '楚大师兄': 'jh 39,ne,e,n,ne,ne,n,ne,nw,ne,nw,event_1_17801939-星星峡,ts2',
        '傅奇士': 'jh 39,ne,e,n,ne,ne,n,ne,nw,ne,nw,event_1_17801939-星星峡,ts2,ne,ne,nw',
        '杨英雄': 'jh 39,ne,e,n,ne,ne,n,ne,nw,ne,nw,event_1_17801939-星星峡,ts2,ne,ne,nw,nw',
        '胡大侠': 'jh 39,ne,e,n,ne,ne,n,ne,nw,ne,nw,event_1_17801939-星星峡,ts2,ne,ne,nw,nw,nw,w',
    },
    '苗疆': {
        '苗疆': 'jh 40',
        '温青': 'jh 40,s,s,s,s',
        '苗村长': 'jh 40,s,s,s,s,w,w,w',
        '苗家小娃': 'jh 40,s,s,s,s,w,w,w,n',
        '苗族少年': 'jh 40,s,s,s,s,w,w,w,w',
        '苗族少女': 'jh 40,s,s,s,s,w,w,w,w',
        '田嫂': 'jh 40,s,s,s,s,e,s,se',
        '金背蜈蚣': 'jh 40,s,s,s,s,e,s,se,sw,s,s',
        '人面蜘蛛': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,s,sw',
        '吸血蜘蛛': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,s,sw',
        '樵夫': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e',
        '蓝姑娘': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧峡,sw',
        '莽牯朱蛤': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s',
        '阴山天蜈': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,s',
        '食尸蝎': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s',
        '蛇': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s,sw,e',
        '五毒教徒': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s,sw,e,e,ne,ne,nw',
        '沙护法': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s,sw,e,e,ne,ne,nw,ne,ne,n',
        '五毒弟子': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s,sw,e,e,ne,ne,nw,ne,ne,n,n',
        '毒郎中': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s,sw,e,e,ne,ne,nw,ne,ne,n,n,e',
        '白鬓老者': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s,sw,e,e,ne,ne,nw,ne,ne,n,n,w',
        '何长老': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s,sw,e,e,ne,ne,nw,ne,ne,n,n,w,sw',
        '毒女': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s,sw,e,e,ne,ne,nw,ne,ne,n,n,n',
        '潘左护法': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s,sw,e,e,ne,ne,nw,ne,ne,n,n,n,n',
        '大祭司': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s,sw,e,e,ne,ne,nw,ne,ne,n,n,n,n,e',
        '岑秀士': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s,sw,e,e,ne,ne,nw,ne,ne,n,n,n,n,nw',
        '齐长老': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s,sw,e,e,ne,ne,nw,ne,ne,n,n,n,n,nw,ne,ne,se,se',
        '五毒护法': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s,sw,e,e,ne,ne,nw,ne,ne,n,n,n,n,nw,ne,ne,nw,ne,e',
        '何教主': 'jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,event_1_8004914-澜沧江南岸,se,s,s,e,n,n,e,s,e,ne,s,sw,e,e,ne,ne,nw,ne,ne,n,n,n,n,nw,ne,ne,nw,ne,e',
    },
    '白帝城': {
        '白帝城': 'jh 41',
        '白衣弟子': 'jh 41,se,e,e',
        '白衣少年': 'jh 41,se,e,e,se,se,se,se',
        '李峰': 'jh 41,se,e,e,se,se,se,se,s,s',
        '李白': 'jh 41,se,e,e,se,se,se,se,s,s,s',
        '“妖怪”': 'jh 41,se,e,e,se,se,se,se,s,s,s,e',
        '庙祝': 'jh 41,se,e,e,se,se,se,se,s,s,s,e,e,ne',
        '狱卒': 'jh 41,se,e,e,se,se,se,se,se,se,event_1_57976870,w,w,w',
        '白帝': 'jh 41,se,e,e,se,se,se,se,se,se,event_1_57976870,n,n,n',
        '练武士兵': 'jh 41,se,e,e,se,se,se,se,se,se,event_1_57976870,e,e',
        '镇长': 'jh 41,se,e,e,ne,ne,se,e,e,ne',
        '李巡': 'jh 41,se,e,e,ne,ne,se,e,e,s,w',
        '守门士兵': 'jh 41,se,e,e,nw,nw',
        '公孙将军': 'jh 41,se,e,e,nw,nw,n,n,e,ne,e',
        '贴身侍卫': 'jh 41,se,e,e,nw,nw,n,n,e,ne,e',
        '粮官': 'jh 41,se,e,e,nw,nw,n,n,e,ne,n,nw,n',
        '白衣士兵': 'jh 41,se,e,e,nw,nw,n,n,w,w',
        '文将军': 'jh 41,se,e,e,nw,nw,n,n,w,w,n,n,e',
    },
    '墨家机关城': {
        '索卢参': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n',
        '墨家弟子': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n',
        '高孙子': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n',
        '燕丹': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,n,n',
        '荆轲': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,n,n',
        '庖丁': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,n,n,n,n,n',
        '县子硕': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,w,w,n,e',
        '魏越': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,w,w,n,n,e',
        '公尚过': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,w,w,n,n,n,e',
        '高石子': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,w',
        '大博士': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,w',
        '治徒娱': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,n,w',
        '黑衣人': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,event_1_39026213,n,ne,se,s,event_1_623818-非命崖底',
        '徐夫子': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,event_1_39026213,n,ne,se,s,event_1_623818-神龙山,e,s,e,s,ne,s,sw,nw,s,se,s,sw,s,s',
        '屈将子': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,event_1_39026213,n,ne,se,s,event_1_623818-神龙山,e,s,e,s,ne,s,sw,nw,s,se,s,e,e',
        '偷剑贼': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,event_1_39026213,n,ne,se,s,event_1_623818-神龙山,e,s,e,s,ne,s,sw,nw,s,se,s,e,e,e',
        '大匠师': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,event_1_39026213,n,ne,se,s,event_1_623818-神龙山,e,n,e,s,e,n,nw,e,nw,w,w',
        '随巢子': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,event_1_39026213,n,ne,se,s,event_1_623818-神龙山,e,n,e,s,e,n,nw,e,nw,e',
        '高何': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,event_1_39026213,n,ne,se,s,event_1_623818-神龙山,e,n,e,s,e,n,nw,e,nw,sw',
        '随师弟': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,event_1_39026213,n,ne,se,s,event_1_623818-神龙山,e,n,e,s,e,n,nw,e,nw,sw,sw',
        '曹公子': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,event_1_39026213,n,ne,se,s,event_1_623818-神龙山,e,n,e,s,e,n,nw,e,nw,n,e',
        '鲁班': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,event_1_39026213,n,ne,se,s,event_1_623818-神龙山,e,n,e,s,e,n,nw,e,nw,n,w',
        '耕柱子': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,event_1_39026213,n,ne,se,s,event_1_623818-神龙山,e,n,e,s,e,n,nw,e,nw,n,nw',
        '墨子': 'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,event_1_39026213,n,ne,se,s,event_1_623818-神龙山,e,n,e,s,e,n,nw,e,nw,n,ne',
    },
    '掩月城': {
        '掩月城': 'jh 43',
        '执定长老': 'jh 43',
        '佩剑少女': 'jh 43',
        '野狗': 'jh 43',
        '穿山甲': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne',
        '黑衣老者': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,se,se,s,s,sw,s',
        '六道禅师': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,se,se,s,s,sw,s,sw,sw,sw,sw',
        '火狐': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,ne,n,nw',
        '黄鹂': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,ne,n,nw,ne,e,se',
        '夜攸裳': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,ne,n,nw,ne,e,se,se,se',
        '云卫': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,ne,n,nw,ne,e,se,se,se,se,ne,n,n',
        '云将': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,ne,n,nw,ne,e,se,se,se,se,ne,n,n,e,e,e',
        '女眷': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,ne,n,nw,ne,e,se,se,se,se,ne,n,n,e,e,e,e',
        '莫邪传人': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,ne,n,nw,ne,e,se,se,se,se,ne,n,n,e,e,e,e,n',
        '老仆': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,ne,n,nw,ne,e,se,se,se,se,ne,n,n,e,e,e,e,n,n',
        '狄仁啸': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,ne,n,nw,ne,e,se,se,se,se,ne,n,n,e,e,e,e,e',
        '青云仙子': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,ne,n,nw,ne,e,se,se,se,se,ne,n,n,e,e,e,e,e',
        '秦东海': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,ne,n,nw,ne,e,se,se,se,se,ne,n,n,e,e,e,e,e,e',
        '执剑长老': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,ne,n,nw,ne,e,se,se,se,se,ne,n,n,e,e,e,e,e,e',
        '执典长老': 'jh 43,n,ne,ne,n,e,e,se,se,e,ne,ne,n,nw,ne,e,se,se,se,se,ne,n,n,e,e,e,e,e,e,event_1_89957254,ne,ne,se,s,s,s',
        '野兔': 'jh 43,n,ne,ne,n,n,n,nw',
        '杂货脚夫': 'jh 43,n,ne,ne,n,n,n,nw,n',
        '老烟杆儿': 'jh 43,n,ne,ne,n,n,n,nw,n',
        '短衫剑客': 'jh 43,n,ne,ne,n,n,n,nw,n,ne',
        '巧儿': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne',
        '青牛': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n',
        '骑牛老汉': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n',
        '书童': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n,w',
        '赤尾雪狐': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n,w,sw',
        '泥鳅': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n,w,sw,sw',
        '灰衣血僧': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n,w,sw,sw,sw,s,s',
        '白鹭': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n,w,sw,sw,sw,s,s,s',
        '青衫女子': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n,w,nw',
        '樊川居士': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n,w,nw',
        '无影暗侍': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n,w,nw,nw',
        '琴仙子': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n,w,nw,nw,n,n,n,n,ne,ne,nw,ne,ne,n,n',
        '百晓居士': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n,w,nw,nw,n,n,n,n,ne,ne,nw,ne,ne,n,n,ne,e',
        '清风童子': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n,w,nw,nw,n,n,n,n,ne,ne,nw,ne,ne,n,n,ne,e,se,se',
        '刀仆': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n,w,nw,nw,n,n,n,n,ne,ne,nw,ne,ne,n,n,ne,e,se,se,se,sw,sw',
        '天刀宗师': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n,w,nw,nw,n,n,n,n,ne,ne,nw,ne,ne,n,n,ne,e,se,se,se,sw,sw',
        '虬髯长老': 'jh 43,n,ne,ne,n,n,n,nw,n,ne,ne,n,n,w,nw,nw,n,n,n,n,ne,ne,nw,ne,ne,n,n,ne,e,se,se,se,sw,sw,s,e,s,s,s,event_1_69228002',
        '仆人': 'jh 43,w',
        '醉酒男子': 'jh 43,w',
        '候君凛': 'jh 43,w,n',
        '紫衣仆从': 'jh 43,w,n',
        '轻纱女侍': 'jh 43,w,n,n',
        '抚琴女子': 'jh 43,w,n,n',
        '黑纱舞女': 'jh 43,w,n,n,w',
        '女官人': 'jh 43,w,n,n,w',
        '小厮': 'jh 43,w,n,n,n',
        '梅映雪': 'jh 43,w,n,n,n,ne',
        '舞眉儿': 'jh 43,w,n,n,n,ne,nw,nw,nw',
        '寄雪奴儿': 'jh 43,w,n,n,n,ne,nw,nw,ne',
        '琴楚儿': 'jh 43,w,n,n,n,ne,nw,nw,ne',
        '赤髯刀客': 'jh 43,w,w',
        '华衣女子': 'jh 43,w,w',
        '老乞丐': 'jh 43,w,w',
        '候君凛': 'jh 43,w,w,w',
        '马帮弟子': 'jh 43,w,w,w',
        '养马小厮': 'jh 43,w,w,w,n',
        '客栈掌柜': 'jh 43,w,w,w,n,n',
        '店小二': 'jh 43,w,w,w,n,n',
        '蝮蛇': 'jh 43,w,w,w,w',
        '东方秋': 'jh 43,w,w,w,w,nw,n,n',
        '函谷关官兵': 'jh 43,w,w,w,w,nw,n,n,nw',
        '长刀敌将': 'jh 43,w,w,w,w,nw,n,n,nw,nw,nw,nw',
        '黑虎敌将': 'jh 43,w,w,w,w,nw,n,n,nw,nw,nw,nw,w',
        '长鞭敌将': 'jh 43,w,w,w,w,nw,n,n,nw,nw,nw,nw,w,sw',
        '巨锤敌将': 'jh 43,w,w,w,w,nw,n,n,nw,nw,nw,nw,w,sw,nw,sw,s',
        '狼牙敌将': 'jh 43,w,w,w,w,nw,n,n,nw,nw,nw,nw,w,sw,nw,sw,s,sw',
        '金刚敌将': 'jh 43,w,w,w,w,nw,n,n,nw,nw,nw,nw,w,sw,nw,sw,s,sw,sw,sw',
        '蛮斧敌将': 'jh 43,w,w,w,w,nw,n,n,nw,nw,nw,nw,w,sw,nw,sw,s,sw,sw,sw,nw,n',
        '血枪敌将': 'jh 43,w,w,w,w,nw,n,n,nw,nw,nw,nw,w,sw,nw,sw,s,sw,sw,sw,nw,n,n,n,nw',
        '夜魔': 'jh 43,w,w,w,w,nw,n,n,nw,nw,nw,nw,w,sw,nw,sw,s,sw,sw,sw,nw,n,n,n,nw,nw',
        '千夜精锐': 'jh 43,w,w,w,w,nw,n,n,nw,nw,nw,nw,w,sw,nw,sw,s,sw,sw,sw,nw,n,n,n,nw,nw,n',
        '胡人王子': 'jh 43,w,w,w,w,nw,n,n,nw,nw,nw,nw,w,sw,nw,sw,s,sw,sw,sw,nw,n,n,n,nw,nw,n,n,ne',
        '夜魔侍从': 'jh 43,w,w,w,w,nw,n,n,nw,nw,nw,nw,w,sw,nw,sw,s,sw,sw,sw,nw,n,n,n,nw,nw,n,n,ne,ne,ne',
        '行脚贩子': 'jh 43,sw',
        '六婆婆': 'jh 43,sw,sw,sw,w',
        '农家少妇': 'jh 43,sw,sw,sw,w',
        '青壮小伙': 'jh 43,sw,sw,sw,w,w',
        '店老板': 'jh 43,sw,sw,sw,s,se,se,se',
        '白衣弟子': 'jh 43,sw,sw,sw,s,se,se,se,e',
        '黑衣骑士': 'jh 43,sw,sw,sw,s,se,se,se,e,n',
        '青衫铁匠': 'jh 43,sw,sw,sw,s,se,se,se,e,e',
        '青鬃野马': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw',
        '牧民': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw',
        '小马驹儿': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se',
        '绛衣剑客': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,se',
        '白衣公子': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,se,ne',
        '老仆': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,se,ne',
        '的卢幼驹': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne',
        '乌骓马': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne',
        '秦惊烈': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s',
        '千小驹': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s',
        '牧羊犬': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e',
        '追风马': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e',
        '诸侯秘使': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e,ne',
        '赤菟马': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e,ne,ne',
        '风如斩': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e,ne,ne,ne',
        '白狐': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e,ne,ne,ne,nw',
        '小鹿': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e,ne,ne,ne,nw,nw',
        '破石寻花': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e,ne,ne,ne,nw,nw,w',
        '爪黄飞电': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e,ne,se',
        '黑狗': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e,ne,se,s',
        '照夜玉狮子': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e,ne,se,s,s',
        '灰耳兔': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e,ne,se,s,s,sw,sw',
        '闻香寻芳': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e,ne,se,s,s,sw,sw,sw',
        '鲁总管': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e,ne,se,s,s,se',
        '风花侍女': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e,ne,se,s,s,se',
        '天玑童子': 'jh 43,sw,sw,sw,s,se,se,se,e,s,sw,se,ne,se,s,e,e,e,ne,se,s,s,se,e',
    },
}
//江湖悬红提示
var xhts = {
    '雪亭镇': {
        '逄义':'逄义是封山派中和柳淳风同辈的弟子，但是生性好赌的他并不受师父及同门师兄弟的喜爱，因此辈分虽高，却未曾担任门中任何重要职务。逄义经常外出，美其名曰：旅行，实则避债，碍於门规又不敢做那打家劫舍的勾当，因此经常四处寻找赚钱发财的机会。',
        '店小二':'这位店小二正笑咪咪地忙著，还不时拿起挂在脖子上的抹布擦脸。',
        '星河大师':'帅',
        '崔元基':'',
        '樵夫':'你看到一个粗壮的大汉，身上穿著普通樵夫的衣服。',
        '苦力':'一个苦力打扮的汉子在这里等人来雇用。',
        '黎老八':'这是位生性刚直，嫉恶如仇的丐帮八袋弟子。',
        '农夫':'你看到一位面色黝黑的农夫。',
        '老农夫':'你看到一位面色黝黑的农夫。',
        '疯狗':'一只浑身脏兮兮的野狗，一双眼睛正恶狠狠地瞪著你。',
        '魏无极':'魏无极是个博学多闻的教书先生，他年轻时曾经中过举人，但是因为生性喜爱自由而不愿做官，魏无极以教书为业，如果你付他一笔学费，就可以成为他的弟子学习读书识字。',
        '野狗':'一只浑身脏兮兮的野狗。',
        '蒙面剑客':'蒙着脸，身后背着一把剑，看上去武艺颇为不俗。',
        '庙祝':'这个老人看起来七十多岁了，看著他佝偻的身影，你忽然觉得心情沈重了下来。',
        '刘安禄':'刘安禄是淳风武馆的门房，除了馆主柳淳风没有人知道他的出身来历，只知到他的武艺不弱，一手快刀在这一带罕有敌手。',
        '武馆弟子':'你看到一位身材高大的汉子，正在辛苦地操练著。',
        '李火狮':'李火狮是个孔武有力的大块头，他正在训练他的弟子们习练「柳家拳法」。',
        '柳淳风':'柳淳风是个相当高大的中年儒生，若不是从他腰间挂著的「玄苏剑」你大概猜不到眼前这个温文儒雅的中年人竟是家大武馆的馆主。',
        '柳绘心':'柳绘心是淳风武馆馆主柳淳风的独生女。',
        '安惜迩':'安惜迩是个看起来相当斯文的年轻人，不过有时候会有些心不在焉的样子，雪亭镇的居民对安惜迩都觉得有点神秘莫测的感觉，为什麽他年纪轻轻就身为一家大钱庄的老板，还有他一身稀奇古怪的武功，所幸安惜迩似乎天性恬淡，甚至有些隐者的风骨，只要旁人不去惹他，他也绝不会去招惹旁人。',
        '醉汉':'一个喝得醉醺醺的年轻人。。。。。',
        '收破烂的':'这个人不但自己收破烂，身上也穿得破烂不堪。',
        '王铁匠':'王铁匠正用铁钳夹住一块红热的铁块放进炉中。打孔',
        '杨掌柜':'杨掌柜是这附近相当有名的大善人，常常施舍草药给付不起药钱的穷人。此外他的医术也不错，年轻时曾经跟著山烟寺的玄智和尚学医，一般的伤寒小病直接问他开药吃比医生还灵。',
        '花不为':'此人前几年搬到雪亭镇来，身世迷糊。',
        '杜宽':'杜宽担任雪亭驿的驿长已经有十几年了，虽然期间有几次升迁的机会，但是他都因为舍不得离开这个小山村而放弃了，雪亭镇的居民对杜宽的风评相当不错，常常会来到驿站跟他聊天。',
        '杜宽宽?':'不要杀我~~~~~~~~~~',
    },

    '洛阳': {
        '农夫':'一个戴着斗笠，正在辛勤劳作的农夫。',
        '守城士兵':'一个守卫洛阳城的士兵',
        '客商':'长途跋涉至此的客商。',
        '蓑衣男子':'身穿蓑衣坐在船头的男子，头上的斗笠压得很低，你看不见他的脸。',
        '乞丐':'一个穿着破破烂烂的乞丐',
        '金刀门弟子':'这人虽然年纪不大，却十分傲慢。看来金刀门是上梁不正下梁歪。',
        '王霸天':'王霸天已有七十来岁，满面红光，颚下一丛长长的白须飘在胸前，精神矍铄，左手呛啷啷的玩着两枚鹅蛋大小的金胆。',
        '庙祝':'洛神庙的庙祝',
        '老乞丐':'一个穿着破破烂烂的乞丐',
        '地痞':'洛阳城里的地痞，人见人恶。',
        '小贩':'起早贪黑养家糊口的小贩。',
        '郑屠夫':'一个唾沫四溅，满身油星的屠夫。看上去粗陋鄙俗，有些碍眼。',
        '何九叔':'丐帮5袋弟子，衣着干净，看起来是净衣派的。',
        '无赖':'洛阳城无赖，专靠耍赖撒泼骗钱。',
        '甄大海':'洛阳地痞无赖头领，阴险狡黠，手段极其卑鄙。',
        '红娘':'一个肥胖的中年妇女，以做媒为生。',
        '柳小花':'洛阳武馆馆主的女儿，身材窈窕，面若桃花，十分漂亮。性格却是骄纵任性，大小姐脾气。',
        '富家公子':'此人一副风流倜傥的样子，一看就是个不知天高地厚的公子哥。',
        '洪帮主':'他就是丐帮第十七任帮主，号称洪老爷子。',
        '游客':'来白冢游玩的人，背上的包袱里鼓鼓囊囊，不知道装了什么？',
        '绿袍老者':'一身绿袍的老人，除了满头白发，强健的身姿和矍铄的眼神都不像一位老者。',
        '护卫':'大户人家的护卫，一身劲装。',
        '山贼':'隐藏在密林中打家劫舍的贼匪。',
        '白面书生':'书生打扮的中年男子，手中的折扇隐露寒光。',
        '守墓人':'负责看守白冢的老人，看起来也是有些功夫的。',
        '凌云':'败剑山庄少庄主，跟着父亲云游四海。',
        '凌中天':'好游山玩水的败剑山庄庄主。',
        '盗墓贼':'看样子很斯文，不像会欺负人哦～',
        '黑衣文士':'以盗窃古墓财宝为生的人。',
        '黑衣女子':'一身紧身黑衣将其身体勾勒的曲线毕露，黑纱遮住了面容，但看那剪水双眸，已经足以勾魂',
        '马倌':'这是是客栈的马倌，正在悉心照料客人的马匹。',
        '黑衣打手':'一身黑衣的打手，脚下功夫还是有点的。',
        '小偷':'混迹在赌坊里的小偷。',
        '张逍林':'来洛阳游玩的游客，被困在银钩赌坊一段时间了。',
        '玉娘':'肌肤如白玉般晶莹的美人，不知道在这赌坊雅舍中等谁？',
        '守园老人':'守护牡丹园的老人。因为洛阳城地痞不少，所以这守园老人可不轻松。',
        '赛牡丹':'人称赛牡丹，自然是个美人儿啦~',
        '鲁长老':'鲁长老虽然武功算不得顶尖高手，可是在江湖上却颇有声望。因为他在丐帮中有仁有义，行事光明磊落，深得洪帮主的器重。',
        '陈扒皮':'据洛阳城中最小气的人，号称陈扒皮，意思是见了谁都想赚个小便宜。',
        '卖花姑娘':'她总是甜甜的微笑，让人不忍拒绝她篮子里的鲜花。',
        '刘守财':'洛阳城的财主，开了一家钱庄，家财万贯。',
        '守城武将':'一个守卫洛阳城的武将',
        '李元帅':'吃了败仗的元帅逃在此密室，却不知是为了什么。',
        '疯狗':'一只四处乱窜的疯狗，顶着一身脏兮兮的的毛发。',
        '青竹蛇':'一条全身翠绿的毒蛇，缠绕在竹枝上。',
        '布衣老翁':'一身布衣，面容慈祥的老人。',
        '萧问天':'虽然身居陋室，衣着朴素，眼神的锐利却让人不能忽视他的存在。',
        '藏剑楼首领':'一名看上去风度非凡之人，正背手闭目养神中好像等候什么。',
        '剑遇北':'一个身受重伤的布衣青年，手持一把染血的佩剑。',
    },

    '长安': {
        '胡商': ' ',
        '城门卫兵': ' ',
        '无影卫': ' ',
        '紫衣追影': ' ',
        '禁卫统领': ' ',
        '城门禁卫': ' ',
        '蓝色城门卫兵': ' ',
        '血手天魔': ' ',
        '看门人': ' ',
        '钦官': ' ',
        '先锋大将': ' ',
        '霍骠姚': ' ',
        '江湖大盗': ' ',
        '李贺': ' ',
        '云梦璃': ' ',
        '游客': ' ',
        '捕快统领': ' ',
        '捕快': ' ',
        '刀僧卫': ' ',
        '镇魂使': ' ',
        '招魂师': ' ',
        '说书人': ' ',
        '客栈老板': ' ',
        '游四海': ' ',
        '糖人张': ' ',
        '高铁匠': ' ',
        '哥舒翰': ' ',
        '若羌巨商': ' ',
        '樊天纵': ' ',
        '杨玄素': ' ',
        '乌孙马贩': ' ',
        '卫青': ' ',
        '方秀珣': ' ',
        '孙三娘': ' ',
        '大宛使者': ' ',
        '马夫': ' ',
        '白衣少侠': ' ',
        '玄甲卫兵': ' ',
        '房玄龄': ' ',
        '杜如晦': ' ',
        '秦王': ' ',
        '程知节': ' ',
        '尉迟敬德': ' ',
        '翼国公': ' ',
        '独孤须臾': ' ',
        '金甲卫士': ' ',
        '独孤皇后': ' ',
        '仇老板': ' ',
        '顾先生': ' ',
        '苗一郎': ' ',
        '董老板': ' ',
        '护国军卫': ' ',
        '朱老板': ' ',
        '王府小厮': ' ',
        '王府总管': ' ',
        '龟兹乐师': ' ',
        '龟兹舞女': ' ',
        '卓小妹': ' ',
        '上官小婉': ' ',
    },

    '华山村': {
        '松鼠':'一只在松林里觅食的小松鼠。',
        '野兔':'正在吃草的野兔。',
        '泼皮':'好吃懒做的无赖，整天无所事事，欺软怕硬。',
        '小男孩':'扎着双髻的小男孩，正在杏林里跟小伙伴们捉迷藏。',
        '王老二':'看起来跟普通村民没什么不同，但一双眼睛却透着狡黠。',
        '村中地痞':'村内地痞，人见人恶。',
        '抠脚大汉':'坐在土地面前抠脚的汉子',
        '庙内黑狗':'凶恶的黑狗，张开的大嘴露出锋利的獠牙。',
        '青衣守卫':'身穿青衣的守卫，武功招式看起来有些眼熟。',
        '葛不光':'四十岁左右的中年男子，颇为好色。',
        '泼皮头子':'好吃懒做的无赖，整天无所事事，欺软怕硬。',
        '采花贼':'声名狼藉的采花贼，一路潜逃来到了华山村。',
        '冯铁匠':'这名铁匠看上去年纪也不大，却是一副饱经沧桑的样子。',
        '村民':'身穿布衣的村民',
        '朱老伯':'一位德高望重的老人，须发已经全白。',
        '方寡妇':'颇有几分姿色的女子，是个寡妇。',
        '剑大师':'宗之潇洒美少年举觞白眼望青天皎如玉树临风前',
        '方老板':'平日行踪有些诡秘，看来杂货铺并不是他真正的营生。',
        '跛脚汉子':'衣着普通的中年男子，右脚有些跛。',
        '云含笑':'眸含秋水清波流盼，香娇玉嫩，秀靥艳比花娇，指如削葱根，口如含朱丹，一颦一笑动人心魂。',
        '英白罗':'这是华山派弟子，奉师命下山寻找游玩未归的小师妹。',
        '庙外黑狗':'一只黑色毛发的大狗。',
        '刘三':'这一代远近闻名的恶棍，欺男霸女无恶不作',
        '曲姑娘':'这是一名身穿翠绿衣裳的少女，皮肤白皙，脸蛋清秀可爱。',
        '受伤的曲右使':'他已经深受重伤，半躺在地上。',
        '血尸':'这是一具极为可怖的男子尸体，只见他周身肿胀，肌肤崩裂，眼角、鼻子、指甲缝里都沁出了鲜血，在这片美丽的花海里，这具尸体的出现实在诡异至极。',
        '藏剑楼杀手':'极为冷酷无情的男人，手上不知道沾满了多少无辜生命的鲜血。',
        '毒蛇':'一条色彩斑斓的毒蛇',
        '丐帮长老':'丐帮长老，衣衫褴褛，满头白发，看起来精神不错。',
        '小狼':'出来觅食的小狼',
        '老狼':'在山上觅食的老狼',
        '土匪':'清风寨土匪',
        '土匪头目':'清风寨土匪头目',
        '玉牡丹':'这是一名看不出年龄的男子，一身皮肤又白又细，宛如良质美玉，竟比闺门处子都要光滑细腻许多。若不是高大身材和脸颊上青色胡茬，他可能会让大多女子汗颜。',
        '刘龟仙':'清风寨军事，诡计多端。',
        '萧独眼':'清风寨二当家，一次劫镖时被刺伤一目，自此成了独眼龙。',
        '刘寨主':'清风寨寨主，对手下极为严厉。',
        '米不为':'一名青年男子，衣衫上血迹斑斑，奄奄一息的躺在地上。',
    },

    '华山': {
        '孙驼子':'一面容猥琐可憎，让人不忍直视，脊背高高隆起的驼子。',
        '吕子弦':'青衣长袍的书生，前来华山游玩。',
        '女弟子':'她是华山派女弟子，不施脂粉，衣着素雅。',
        '豪客':'一名满脸彪悍之色的江湖豪客',
        '游客':'这是一名来华山游玩的中年男子，背着包裹。',
        '公平子':'这是一位仙风道骨的中年道人，早年云游四方，性好任侠，公正无私。',
        '山贼':'拦路抢劫的山贼',
        '白二':'山贼头目，看起来很强壮。',
        '李铁嘴':'李铁嘴是个买卜算卦的江湖术士，兼代客写书信、条幅。',
        '赵辅徳':'负责打理群仙观的老人',
        '猿猴':'华山上的猿猴，时常骚扰过路人',
        '剑宗弟子':'华山剑宗弟子',
        '丛云弃':'华山派传人，封剑羽的师弟。',
        '尘无剑':'他是华山控剑宗派的第一高手。',
        '封剑羽':'他是华山控剑宗派的第一高手。',
        '大松鼠':'一只在松林里觅食的小松鼠。',
        '岳师妹':'华山派掌门的爱女。她看起来十多岁，容貌秀丽，虽不是绝代美人，也别有一番可人之处。',
        '六猴儿':'六猴儿身材很瘦，又长的尖嘴猴腮的，但别看他其貌不扬，他在同门中排行第六，是华山派年轻一代中的好手。',
        '令狐大师哥':'他是华山派的大师兄，英气逼人。',
        '风老前辈':'这便是当年名震江湖的华山名宿。他身著青袍，神气抑郁脸如金纸。身材瘦长，眉宇间一直笼罩着一股淡淡的忧伤神色。',
        '英黑罗':'英白罗是岳不群的第八位弟子',
        '魔教喽喽':'日月神教小喽喽喽',
        '卢大哥':'日月神教教众',
        '史老三':'日月神教教众',
        '闵老二':'日月神教教众',
        '戚老四':'日月神教教众',
        '葛长老':'日月神教教众',
        '小林子':'气宗传人小林子，实力已是非同凡响。',
        '高算盘':'此人整天拿着算盘，身材高大，长得很胖，但别看他其貌不扬，他在同门中排行第五，是华山派年轻一代中的好手。',
        '施剑客':'同门中排行第四，是华山派年轻一代中的好手。',
        '华山弟子':'华山派门下的第子',
        '蒙面剑客':'手握长剑的蒙面人',
        '黑衣人':'戴着神秘的黑衣人，压低的帽檐遮住的他的面容。',
        '岳掌门':'华山掌门，他今年四十多岁，素以温文尔雅著称。',
        '舒奇':'华山派小弟子',
        '小猴':'这是一只调皮的小猴子，虽是畜牲，却喜欢模仿人样。',
        '劳师兄':'他就是华山排行第二的弟子。',
        '宁女侠':'华山派掌门的夫人，眉宇间还少不了年轻时的英气。',
        '梁师兄':'他就是华山排行第三的弟子。',
        '陶钧':'陶钧是岳不群的第七位弟子',
        '林师弟':'林师弟是华山众最小的一个弟子。',
        '小尼姑':'一个娇俏迷人的小尼姑。',
    },

    '扬州': {
        '官兵':'守城的官兵，相貌可长得不好瞧。',
        '花店伙计':'花店的伙计，正忙碌地给花淋水。',
        '大黑马':'一匹受惊的大黑马，一路狂奔到了闹市街头。',
        '铁匠':'看起来很强壮的中年男子',
        '双儿':'柔善良，善解人意，乖巧聪慧，体贴贤惠，清秀可人，腼腆羞涩，似乎男人喜欢的品质都集中在她身上了。',
        '黑狗子':'扬州街头人见人恶的地痞，嘴角一颗黑色痦子，看起来极为可憎。',
        '武馆护卫':'一名武馆护卫，专门对付那些想混进来闹事的人。',
        '武馆弟子':'在武馆拜师学艺的弟子，看来还是会些基本功。',
        '方不为':'武馆管家，馆中大小事务都需要向他禀报。',
        '王教头':'一名武馆内的教头，专门负责教新手武功。',
        '神秘客':'一名四十岁左右的中年男子，脸上一道刀疤给他平添了些许沧桑。',
        '范先生':'武馆账房先生，为人极为谨慎，账房钥匙通常带在身上。',
        '陈有德':'这就是武馆馆主，紫金脸庞，面带威严，威武有力，站在那里就象是一座铁塔。',
        '古三通':'一名看起来和蔼的老人，手里拿着一个旱烟袋，据说跟馆主颇有渊源。',
        '黄掌柜':'这就是武馆馆主，紫金脸庞，面带威严，威武有力，站在那里就象是一座铁塔。',
        '游客':'来扬州游玩的游客，背上的包裹看起来有些重。',
        '账房先生':'满脸精明的中年男子，手里的算盘拨的飞快。',
        '小飞贼':'一个年级尚幼的飞贼。',
        '飞贼':'一身黑色劲装，黑巾蒙面，眼露凶光。',
        '艺人':'一名四海为家的卖艺人，满脸沧桑。',
        '空空儿':'一个满脸风霜之色的老乞丐。',
        '马夫人':'一名体格魁梧的妇人，看起来极为彪悍。',
        '润玉':'买花少女，手中的花篮里装着时令鲜花。',
        '流氓':'扬州城里的流氓，经常四处游荡，调戏妇女。',
        '刘步飞':'龙门镖局的镖师，正在武庙里祭拜。',
        '马员外':'马员外是扬州有名的善人，看起来有点郁郁不乐。',
        '毒蛇':'一条毒蛇草丛窜出，正昂首吐信虎视眈眈地盯著你。',
        '扫地僧':'一名看起来很普通的僧人',
        '柳碧荷':'来禅智寺上香的女子，颇有几分姿色。',
        '张三':'看起来很邋遢的道士，似乎有些功夫。',
        '火工僧':'禅智寺中专做杂事的火工僧，身体十分地强壮',
        '书生':'一个摇头晃脑正在吟诗的书生。',
        '李丽君':'女扮男装的女子，容颜清丽，孤身一身住在魁星阁的阁楼上。',
        '小混混':'扬州城里的小混混，整天无所事事，四处游荡。',
        '北城门士兵':'看守城门的士兵',
        '青衣门卫':'浅月楼门口的侍卫。',
        '玉娇红':'浅月楼的老板娘，看似年不过三十，也是一个颇有姿色的女子。她抬起眼来，黛眉轻扫，红唇轻启，嘴角勾起的那抹弧度仿佛还带着丝丝嘲讽。当她眼波一转，流露出的风情似可让人忘记一切。红色的外袍包裹着洁白细腻的肌肤，她每走一步，都要露出细白水嫩的小腿。脚上的银铃也随着步伐轻轻发出零零碎碎的声音。',
        '赵明诚':'当朝仆射，也是一代名士，致力于金石之学，幼而好之，终生不渝。',
        '青楼小厮':'这是一个青楼的小侍从，不过十五六岁。',
        '苏小婉':'名满天下的第一琴姬，苏小婉是那种文人梦中的红颜知己。这样美貌才智具备的女子，怕是世间几百年才能出现一位。曾有人替她惋惜，说如若她是一大家闺秀，或许也能寻得一志趣相投之人，也会有“赌书消得泼茶香”的美谈。即使她只是一贫家女子，不读书亦不学艺，纵使是貌胜西子，或许仍可安稳一生。然而命运时常戏弄人，偏偏让那如花美眷落入淤泥，误了那似水流年。本想为一人盛开，却被众人窥去了芳颜。可她只是微微一笑，说道：『寻一平凡男子，日出而作日落而息，相夫教子，如湮没于历史烟尘中的所有女子一般。那样的生活，不是我做不到，只是不愿意。没有燃烧过的，只是一堆黑色的粉末，哪里能叫做烟火？』',
        '恶丐':'看守城门的士兵',
        '顽童':'一个顽皮的小童。',
        '唐老板':'广陵当铺老板，肩宽体壮，看起来颇为威严。',
        '云九天':'他是大旗门的掌刑长老，最是严厉不过。',
        '柳文君':'茶社老板娘，扬州闻名的才女，姿色娇美，精通音律，善弹琴。许多文人墨客慕名前来，茶社总是客满为患。',
        '茶社伙计':'提着茶壶的伙计，目露精光，看起来不简单。',
        '醉仙楼伙计':'这是醉仙楼伙计，看起来有些功夫。',
        '丰不为':'一个常在酒楼混吃混喝的地痞，不知酒店老板为何不将他逐出。',
        '张总管':'一名中年男子，目露凶光。',
        '计无施':'一名剑眉星目的白衣剑客。',
        '胡神医':'这就是江湖中有名的胡神医，看起来很普通。',
        '胖商人':'一名衣着华丽，体态臃肿，手脚看起来极短的中年男子。',
        '冼老板':'醉仙楼老板，能将这家祖传老店买下来，其来历应该没那么简单。',
        '赤练仙子':'她生得极为美貌，但冰冷的目光让人不寒而栗。',
        '白老板':'玉器店老板，对珍宝古玩颇为熟稔。',
        '衙役':'扬州官衙衙役，看起来一脸疲态。',
        '公孙岚':'扬州官衙有名的神捕，据说曾经抓获不少江湖大盗。',
        '程大人':'扬州知府，脸色阴沉，微有怒色，',
        '楚雄霸':'江湖有名的江洋大盗，五短身材，貌不惊人。',
        '朱先生':'这就是当今大儒朱先生。',
        '书生（书院）':'一个摇头晃脑正在吟诗的书生。',
        '少林恶僧':'因嗜酒如命，故从少林叛出，顺便盗取些许经书以便拿来换酒。',
        '船运东主':'此人一身黝黑的皮肤，几道深深的岁月的沟壑在他脸上烙下了印记。深邃凹进的眼眶中显露出干练的眼神。显露出不凡的船上阅历。',
    },

    '丐帮': {
        '左全':'这是位豪爽大方的丐帮七袋弟子，看来是个北地豪杰。',
        '裘万家':'这是位衣著邋塌，蓬头垢面的丐帮二袋弟子',
        '梁长老':'梁长老是丐帮出道最久，武功最高的长老，在武林中享名已久。丐帮武功向来较强，近来梁长老一力整顿，更是蒸蒸日上。',
        '何一河':'他是丐帮新近加入的弟子，可也一步步升到了五袋。他长的极其丑陋，脸上坑坑洼洼',
        '莫不收':'这是位衣著邋塌，蓬头垢面的丐帮三袋弟子。',
        '藏剑楼统领':'此人似乎是这群人的头目，正在叮嘱手下办事。',
        '何不净':'这是位衣著邋塌，蓬头垢面的丐帮七袋弟子',
        '马俱为':'这是位武艺精强，却沉默寡言的丐帮八袋弟子。',
        '余洪兴':'这是位笑眯眯的丐帮八袋弟子，生性多智，外号小吴用。',
    },

    '乔阴县': {
        '守城官兵':'这是个正在这里站岗的守城官兵，虽然和许多武林人物比起来，官兵们的武功实在稀松平常，但是他们是有组织、有纪律的战士，谁也不轻易地招惹他们。',
        '卖饼大叔':'一个相貌朴实的卖饼大叔，憨厚的脸上挂著和蔼的笑容。',
        '陆得财':'陆得财是一个浑身脏兮兮的老丐，一副无精打采要死不活的样子，可是武林中人人都识得他身上打著二十三个结的皮酒囊，这不但是「花紫会」龙头的信物，更是名镇漠南的「黑水伏蛟」独门兵器，只不过陆得财行踪诡密，据说各处随时都有七、八的他的替身在四处活动，所以你也很难确定眼前这个陆得财到底是不是真的。',
        '卖包子的':'这个卖包子的小贩对你微微一笑，说道：热腾腾的包子，来一笼吧',
        '武官':'一位相貌威武的武官，独自一个人站在这里发呆，似乎正有什麽事困扰著他。',
        '怪人':'体型与小孩一般，脸上却满是皱纹，头发已经掉光。',
        '汤掌柜':'汤掌柜是这家大酒楼的主人，别看他只是一个小小的酒楼老板，乔阴县境内除了知县老爷以外，恐怕就属他最财大势大。',
        '家丁':'一个穿著家人服色的男子，必恭必敬地垂手站在一旁。',
        '贵公子':'一个相貌俊美的年轻贵公子正优雅地欣赏著窗外的景物。',
        '酒楼守卫':'一个身穿蓝布衣的人，从他锐利的眼神跟神情，显然是个练家子。',
        '书生':'一个看起来相当斯文的书生，正拿著一本书摇头晃脑地读著。',
        '丫鬟':'一个服侍有钱人家小姐的丫鬟，正无聊地玩弄著衣角。',
        '官家小姐':'一个看起来像是有钱人家的女子，正在这里游湖。',
        '乾瘪老太婆':'这个老太婆怀中抱了个竹篓，似乎在卖什麽东西，也许你可以跟她问问价钱？',
        '妇人':'一个衣饰华丽的妇人正跪在这里虔诚地膜拜著。',
        '骆云舟':'骆云舟本是世家公子，因喜爱诗酒剑法，不为家族中人所偏爱。因此他年少离家，常年在外漂泊，时至今日，倒是武有所成，在文学的造诣上，也是深不可测了。',
        '藏剑楼长老':'一名谈吐不凡的中年男子，备受手下尊崇',
        '藏剑楼学者':'此人文质彬彬，手持一本书册，正不断的翻阅似乎想在里面找到想要的答案。',
    },

    '峨眉山': {
        '白猿':'这是一头全身白色毛发的猿猴。',
        '文虚师太':'她是峨眉派的“文”辈弟子。',
        '看山弟子':'一个女弟子，手上拿着一把长剑。',
        '文寒师太':'她是峨眉派的“文”辈弟子。',
        '文玉师太':'她是峨眉派的“文”辈弟子。',
        '巡山弟子':'一个拿着武器，有点气势的巡山弟子。',
        '青书少侠':'他今年二十岁，乃是武当第三代中出类拔萃的人物。',
        '小女孩':'这是个小女孩。',
        '小贩':'峨眉山上做点小生意的小贩。',
        '静洪师太':'她是峨眉派的“静”辈弟子。',
        '静雨师太':'她是峨眉派的“静”辈弟子。',
        '女孩':'这是个少女，虽然只有十二、三岁，身材已经开始发育。',
        '尼姑':'这是一个年轻尼姑，似乎有几手武功。',
        '尼姑':'这是一个年轻尼姑。',
        '小尼姑':'一个年纪赏小的尼姑。',
        '静玄师太':'她是峨眉派的“静”辈弟子。',
        '贝锦瑟':'她是峨嵋派的第四代俗家弟子。',
        '毒蛇':'一条剧毒的毒蛇。',
        '护法弟子':'她是一位年轻的师太。是灭绝石台座前的护法弟子。',
        '护法大弟子':'她是一位年轻的师太。是灭绝石台座前的护法弟子。',
        '静慈师太':'这是一位年纪不算很大的师太。',
        '灭绝掌门':'她是峨嵋派的第三代弟子，现任峨嵋派掌门人。',
        '方碧翠':'她是峨嵋派的第四代俗家弟子。',
        '传令兵':'钓鱼城派往长安求援的传令兵，行色匆匆，满面尘土。',
        '运输兵':'负责运送器械的士兵。',
        '斥候':'负责侦查敌情的军士',
        '军械官':'管理军械库的一位中年军官，健壮有力。',
        '神箭手':'钓鱼城守城大军的神箭手，百步穿杨，箭无虚发。',
        '耶律霸':'辽国皇族后裔，蒙古宰相耶律楚材之子，金狼军主帅。他骁勇善战，精通兵法，凭借着一手堪可开山破岳的好斧法杀得武林中人无人可挡闻之色变。视天波杨门为心腹之患欲处之而后快。',
        '先锋军士':'攻城大军的先锋军士，满脸凶狠，却也掩饰不住疲乏之色。',
        '先锋敌将':'攻城先锋大将，长期毫无进展的战事让他难掩烦躁。',
        '赤豹死士':'攻城大军的赤豹营死士，战力蛮横，重盔重甲，防御极好。',
        '守城军士':'守城的军士，英勇强悍，不畏生死。',
        '黑鹰死士':'攻城大军的黑鹰营死士，出手极准。',
        '金狼死士':'攻城大军将领的近身精锐。',
        '金狼大将':'攻城大将，曾是江湖上一等一的好手。',
        '粮库主薄':'管理粮库的军官，双眼炯炯有神，一丝一毫的细节都牢记于心。',
        '参谋官':'守军参谋军官，负责传递消息和提出作战意见。',
        '王坚':'钓鱼城守城大将，智勇双全，有条不紊地指挥着整座城市的防御工作。',
        '藏剑楼剑客':'此人手持长剑，正虎视眈眈的留神周围，准备伺机而动。',
    },

    '恒山': {
        '山盗':'一个盘踞山林的盗匪。',
        '秦卷帘':'恒山派俗家弟子，脸上没有一丝表情，让人望而却步。',
        '九戒大师':'虽着一身袈裟，但一脸络腮胡让他看起来颇有些凶悍。',
        '郑婉儿':'恒山派俗家弟子，看起来清丽可人。',
        '哑太婆':'一身黑衣，头发虽已花白，但俏丽的容颜却让人忍不住多看两眼',
        '云问天':'身背行囊的游客，看起来会些功夫。',
        '柳云烟':'一身短装的女子，头戴纱帽，一张俏脸在面纱后若隐若现，让人忍不住想掀开面纱瞧个仔细。',
        '石高达':'一名身份可疑的男子，最近常在山上游荡。',
        '公孙浩':'一名行走五湖四海的游侠，看起来功夫还不错。',
        '不可不戒':'曾经是江湖上有名的采花大盗，被不戒和尚用药迷倒，剪掉了作案工具，剃度后收为徒弟。',
        '山蛇':'一条吐着红舌头的毒蛇',
        '定云师太':'恒山派白云庵庵主，外刚内和，脾气虽然暴躁，心地却极慈祥。',
        '仪容':'恒山派大弟子',
        '仪雨':'恒山派二弟子',
        '小师太':'恒山入门弟子',
        '吸血蝙蝠':'这是一只黑色的吸血蝙蝠',
        '定安师太':'恒山派掌门，心细如发，虽然平时极少出庵，但于江湖上各门各派的人物，无一不是了如指掌，其武功修为极高。',
        '神教杀手':'日月神教杀手，手段极其凶残。',
        '魔教杀手':'魔教杀手，一张黄脸让人过目难忘。',
        '魔教头目':'看起来风流倜傥的中年男子，魔教的小头目。',
        '嵩山弟子':'嵩山派弟子',
        '赵志高':'嵩山派高手，看起来颇有些修为。',
        '司马承':'嵩山派高手，看起来颇有些修为。',
        '沙江龙':'嵩山派高手，看起来颇有些修为。',
        '史师兄':'嵩山派大弟子，武功修为颇高。',
    },

    '武当山': {
        '土匪':'这家伙满脸横肉一付凶神恶煞的模样，令人望而生畏。',
        '土匪头':'这家伙满脸杀气，一付凶神恶煞的模样，令人望而生畏。',
        '王五':'一位邋邋遢遢的道士。',
        '野兔':'一只好可爱的小野兔。',
        '进香客':'一位前往武当山进香的人。',
        '青书少侠':'他今年二十岁，乃是武当第三代中出类拔萃的人物。',
        '知客道长':'他是武当山的知客道长。',
        '道童':'他是武当山的小道童。',
        '清虚道长':'他就是清虚道长。他今年四十岁，主管武当派的俗事。',
        '练功弟子':'一位正在练功的青年弟子，但似乎很不耐烦。',
        '宋首侠':'他就是张三丰的大弟子、武当七侠之首。身穿一件干干净净的灰色道袍。他已年过六十，身材瘦长，满脸红光。恬淡冲和，沉默寡言。',
        '俞莲舟':'他就是张三丰的二弟子俞莲舟。他今年五十岁，身材魁梧，气度凝重。虽在武当七侠中排名第二，功夫却是最精。',
        '张三丰':'他就是武当派开山鼻祖、当今武林的泰山北斗，中华武功承先启后、继往开来的大宗师。身穿一件污秽的灰色道袍，不修边幅。身材高大，年满百岁，满脸红光，须眉皆白。',
        '张松溪':'他就是张三丰的四弟子张松溪。他今年四十岁，精明能干，以足智多谋著称。',
        '小翠':'这是个年年龄不大的小姑娘，但宽松的道袍也遮不住她过早发育的身体。一脸聪明乖巧，满口伶牙俐齿。见有人稍微示意，便过去加茶倒水。',
        '俞二侠':'服下丹药之后的他武功似乎提升了不少，实力不容小觑。',
        '蜜蜂':'这是一只蜜蜂，正忙着采蜜。',
        '小蜜蜂':'这是一只蜜蜂，正忙着采蜜。',
        '猴子':'这只猴子在在桃树间跳上跳下，还不时津津有味地啃几口着蜜桃。',
        '布衣弟子':'遇剑阁的一位弟子，不知是哪个长老门下的。',
        '剑童':'遇剑阁的一名剑童，长得十分可爱。',
        '剑遇安':'一位似乎身重剧毒的老前辈，但仍能看出其健康之时武功不凡。',
    },

    '晚月庄': {
        '蝴蝶':'一只翩翩起舞的小蝴蝶哦!',
        '彩衣少女':'小姑娘是晚月庄的女弟子，虽说身形单薄，可眼神里透出的傲气让人感到并不好欺负。',
        '婢女':'一名婢女，长的到也清秀。',
        '蓝止萍':'蓝止萍是一个十分出色的美女，她弹的一手琵琶更是闻名千里，许多王侯子弟，富商豪客都为她天下无双的美貌与琴艺倾倒。',
        '蓝雨梅':'蓝雨梅是晚月庄主蓝止萍的养女，由於庄主不信任男子，因此晚月庄接待外宾的工作向来由她负责。',
        '芳绫':'她看起来像个小灵精，头上梳两个小包包头。她坐在地上，看到你看她便向你作了个鬼脸!你想她一定是调皮才会在这受罚!',
        '昭仪':'她看起来非常可爱。身材玲珑有致，曲线苗条。第一眼印象，你觉的她舞蹈一定跳的不错，看她的一举一动有一种说不出的流畅优雅！',
        '昭蓉':'她长得十分漂亮！让你忍不住多瞧她几眼，从她身上你闻到淡淡的香气。她很有礼貌的向你点头，优雅的动作，轻盈的步伐，好美哦!',
        '苗郁手':'她看起来很有活力，两眼明亮有神。给你一种巾帼不让须眉的气势，但刚毅之中似又隐含著女孩子有的娇柔。',
        '圆春':'她是惜春的妹妹，跟姐姐从小就在晚月庄长大。因为与双亲失散，被庄主收留。平常帮忙庄内琐碎事务。',
        '婢女':'一名婢女，长的到也清秀。',
        '惜春':'她看起来成熟中带有一些稚气。飘逸的长发十分迷人。她是个孤儿，从小与妹妹圆春被庄主收留，她很聪明，在第四代弟子中算是武功很出色的一个。',
        '凤凰':'火神「凤凰」乃勇士寒於的魂魄所化成的十三个精灵之一。由於其奇异神迹，被晚月庄供奉为护庄神兽。',
        '金仪彤':'她国色天香，娇丽无伦；温柔娴静，秀绝人寰。可惜眉心上有一道地煞纹干犯紫斗，恐要玉手染血，浩劫武林。',
        '瑷伦':'她已是步入老年，但仍风采依旧。',
        '曲馥琪':'她国色天香，娇丽无伦；温柔娴静，秀绝人寰。她姿容绝美，世所罕见。从她身旁你闻道一寒谷幽香。',
        '梦玉楼':'一个风尘仆仆的侠客。。',
        '安妮儿':'无描述',
        '虞琼衣':'无描述',
        '龙韶吟':'无描述',
        '阮欣郁':'无描述',
    },

    '水烟阁': {
        '天邪虎':'这是一只天邪派的灵兽「天邪虎」，火红的毛皮上有著如白银般的白纹，湛蓝色的眼珠中散发出妖异的光芒。',
        '水烟阁武士':'这是一个水烟阁武士。',
        '董老头':'於兰天武的亲兵，追随於兰天武多年，如今隐居于水烟阁，继续保护王爷',
        '水烟阁红衣武士':'这个人身著红色水烟阁武士服色，眼神十分锐利。',
        '水烟阁司事':'这个人看起来十分和蔼可亲，一双眼睛炯炯有神。',
        '萧辟尘':'萧辟尘自幼生长於岚城之中，看起来仙风道骨，不食人间烟火。',
        '潘军禅':'潘军禅是当今武林的一位传奇性人物，以他仅仅二十八岁的年龄竟能做到水烟阁执法使的职位，著实是一位不简单的人物。潘军禅是封山剑派掌门柳淳风的结拜义弟，但是他为人其实十分风趣，又好交朋友，丝毫不会摆出武林执法者的架子。',
        '於兰天武':'於兰天武是当今皇上的叔父，但是他毕生浸淫武学，甘愿抛弃荣华富以换取水烟阁传功使一职，以便阅读水烟阁中所藏的武学典籍，无论你有什麽武学上的疑难，他都能为你解答。',
    },

    '少林寺': {
        '山猪':'黑色山猪，披着一身刚硬的鬃毛。',
        '田鼠':'一只脏兮兮的田鼠，正在田间觅食。',
        '僧人':'少林寺僧人，负责看守山门。',
        '乔三槐':'勤劳朴实的山民，皮肤黝黑粗糙。',
        '小孩':'一个农家小孩，不知道在这里干什么。',
        '扫地和尚':'一名年轻僧人，身穿灰色僧衣。',
        '挑水僧':'一名年轻僧人，身穿灰色僧衣。',
        '洒水僧':'一名年轻僧人，身穿灰色僧衣。',
        '青松':'天真无邪的小沙弥',
        '小北':'这是一个天真活泼的小沙弥，刚进寺不久，尚未剃度',
        '小南':'青衣小沙弥，尚未剃度。',
        '巡寺僧人':'身穿黄色僧衣的僧人，负责看守藏经阁。',
        '进香客':'来寺里进香的中年男子，看起来满脸疲惫。',
        '狱卒':'一名看起来凶神恶煞的狱卒',
        '行者':'游历四方学艺的僧人，看起来武功修为颇高。',
        '行者':'他是一位云游四方的行者，风霜满面，行色匆匆，似乎正在办一件急事。',
        '扫地僧':'一个年老的僧人，看上去老态龙钟，但是双目间却有一股精气？',
        '托钵僧':'他是一位未通世故的青年和尚，脸上挂着孩儿般的微笑。',
        '灰衣僧':'一名灰衣僧人，灰布蒙面，一双眼睛里透着过人的精明。',
        '守药僧':'一位守着少林药楼的高僧。',
        '砍柴僧':'一名年轻僧人，身穿灰色僧衣。',
        '澄X':'他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。',
        '虚X':'他是一位身穿黄布袈裟的青年僧人。脸上稚气未脱，身手却已相当矫捷，看来似乎学过一点武功。',
        '道X禅师':'他是一位身材高大的中年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭灰布镶边袈裟，似乎有一身武艺。',
        '慧X尊者':'他是一位两鬓斑白的老僧，身穿一袭青布镶边袈裟。他身材略高，太阳穴微凸，双目炯炯有神。',
        '清X比丘':'他是一位体格强健的壮年僧人，他身得虎背熊腰，全身似乎蕴含着无穷劲力。他身穿一袭白布黑边袈裟，似乎身怀武艺。',
        '玄难大师':'他是一位白须白眉的老僧，身穿一袭银丝棕黄袈裟。他身材极瘦，两手更象鸡爪一样。他双目微闭，一副没精打采的模样。',
        '玄慈大师':'他是一位白须白眉的老僧，身穿一袭金丝绣红袈裟。他身材略显佝偻，但却满面红光，目蕴慈笑，显得神完气足。',
        '玄痛大师':'他是一位白须白眉的老僧，身穿一袭银丝棕黄袈裟。他身材高大，两手过膝。双目半睁半闭，却不时射出一缕精光。',
        '玄苦大师':'他是一位白须白眉的老僧，身穿一袭银丝棕黄袈裟。他身材瘦高，脸上满布皱纹，手臂处青筋绽露，似乎久经风霜。',
        '玄悲大师':'他是一位白须白眉的老僧，身穿一袭银丝棕黄袈裟。他身材甚高，但骨瘦如柴，顶门高耸，双目湛然有神。',
        '盈盈':'魔教任教主之女，有倾城之貌，闭月之姿，流转星眸顾盼生辉，发丝随意披散，慵懒不羁。',
        '打坐僧人':'正在禅室打坐修行的僧人。',
        '守经僧人':'似乎常年镇守于藏经阁，稀稀疏疏的几根长须已然全白，正拿着经书仔细研究。',
        '小沙弥':'一名憨头憨脑的和尚，手里端着茶盘。',
        '黑衣大汉':'黑布蒙面，只露出一双冷电般的眼睛的黑衣大汉。',
        '萧远山':'契丹绝顶高手之一，曾随汉人学武，契丹鹰师总教头。',
        '白眉老僧':'少林寺高僧，武功修为无人能知。',
        '叶十二娘':'颇有姿色的中年女子，一双大眼里似乎隐藏着无穷愁苦、无限伤心。',
        '冷幽兰':'“吐秀乔林之下，盘根众草之旁。虽无人而见赏，且得地而含芳。”她如同空谷幽兰一般素雅静谧，纤巧削细，面若凝脂，眉目如画，神若秋水。',
        '慧轮':'少林寺弟子，虚竹的师傅，武功修为平平。',
        '达摩老祖':'这是少林派的开山祖师达摩老祖他身材高大，看起来不知有多大年纪，目光如炬，神光湛然！',
    },

    '唐门': {
        '高一毅':'五代十国神枪王后人，英气勃发，目含剑气。',
        '张之岳':'张宪之子，身形高大，威风凛凛',
        '唐门弟子':'这是唐门的弟子，不苟言笑。',
        '唐风':'唐风是唐门一个神秘之人，世人对他知之甚少。他在唐门默默地传授武艺，极少说话。',
        '唐看':'这是嫡系死士之一，一身的功夫却是不凡。',
        '唐怒':'唐门门主，在江湖中地位很高。',
        '方媃':'一个美丽的中年妇女，使得一手好暗器。',
        '唐鹤':'唐门中的高层，野心很大，一直想将唐门称霸武林。',
        '唐镖':'唐门中所有的绝门镖法，他都会用。',
        '唐缘':'人如其名，虽然年幼，但已是能看出美人胚子了。',
        '唐芳':'虽然是一个少女，但武艺已达精进之境界了。',
        '唐健':'他身怀绝技，心气也甚高。',
        '唐舌':'这是嫡系死士之一，一身的功夫却是不凡。用毒高手。',
        '唐情':'一个小女孩，十分可爱。',
        '唐刚':'一个尚未成年的小男孩，但也已经开始学习唐门的武艺。',
        '欧阳敏':'一个老妇人，眼睛中射出道道精光，一看就是武艺高强之人。',
        '程倾城':'曾是两淮一代最有天赋的年轻剑客，在观海庄追杀徽北剧盗之战一剑破对方七人刀阵，自此“倾城剑客”之名响彻武林。',
        '无名剑客':'一位没有名字的剑客，他很可能是曾经冠绝武林的剑术高手。',
        '默剑客':'这是一个沉默不语的剑客，数年来不曾说过一句话，专注地参悟着剑池绝学。',
        '竺霁庵':'湖竺家一门七进士，竺霁庵更是天子门生独占鳌头，随身喜携带一柄折扇。后因朝廷乱政心灰意冷，弃仕从武，更拜入少林成为俗家弟子。不足二十三岁便学尽少林绝学，武功臻至登峰造极之化境。后在燕北之地追凶时偶遇当时也是少年的鹿熙吟和谢麟玄，三人联手血战七日，白袍尽赤，屠尽太行十八夜骑。三人意气相投，志同道合，结为异姓兄弟，在鹿谢二人引荐下，终成为浣花剑池这一代的破军剑神。',
        '甄不恶':'他的相貌看起来是那么宁静淡泊、眼睛眉毛都透着和气，嘴角弯弯一看就象个善笑的人。他不象个侠客，倒象一个孤隐的君子。不了解的人总是怀疑清秀如竹的他怎么能拿起手中那把重剑？然而，他确是浣花剑派最嫉恶如仇的剑神，武林奸邪最惧怕的名字，因为当有恶人听到『甄不恶』被他轻轻从嘴里吐出，那便往往是他听到的最后三个字。',
        '素厉铭':'本是淮南渔家子弟，也并无至高的武学天赋，然其自幼喜观察鱼虫鸟兽，竟不自觉地悟出了一套气脉运转的不上心法。后因此绝学获难，被千夜旗余孽追杀，欲夺其心法为己用。上代封山剑主出手相救，并送至廉贞剑神门下，专心修炼内功，最终竟凭借其一颗不二之心，成就一代剑神。',
        '骆祺樱':'塞外武学世家骆家家主的千金，自幼聪慧无比，年纪轻轻便习尽骆家绝学，十八岁通过剑池试炼，成为剑池数百年来最年轻的七杀剑神。她双眸似水，却带着谈谈的冰冷，似乎能看透一切；四肢纤长，有仙子般脱俗气质。她一袭白衣委地，满头青丝用蝴蝶流苏浅浅绾起，虽峨眉淡扫，不施粉黛，却仍然掩不住她的绝世容颜。',
        '谢麟玄':'一袭青缎长衫，儒雅中透着英气，好一个翩翩公子。书香门第之后，其剑学领悟大多出自绝世的琴谱，棋谱，和书画，剑法狂放不羁，处处不合武学常理，却又有着难以言喻的写意和潇洒。他擅长寻找对手的薄弱环节，猛然一击，敌阵便土崩瓦解。',
        '祝公博':'曾经的湘西农家少年，全家遭遇匪祸，幸得上一代巨门剑神出手相救。剑神喜其非凡的武学天赋和不舍不弃的勤奋，收作关门弟子，最终得以承接巨门剑神衣钵。祝公博嫉恶如仇，公正不阿，视天道正义为世间唯一准则。',
        '黄衫少女':'身着鹅黄裙衫的少女，一席华贵的栗色秀发真达腰际，碧色的瞳孔隐隐透出神秘。她见你走过来，冲你轻轻一笑。',
        '鹿熙吟':'浣花剑派当世的首席剑神，他身形挺拔，目若朗星。虽然已是中年，但岁月的雕琢更显出他的气度。身为天下第一剑派的首席，他待人和善，却又不怒自威。百晓公见过鹿熙吟之后，惊为天人，三月不知如何下笔，最后据说在百晓图录贪狼剑神鹿熙吟那一页，只留下了两个字：不凡。他的家世出身是一个迷，从来无人知晓。',
        '独臂剑客':'他一生守护在这，剑重要过他的生命。',
        '无情剑客':'神秘的江湖侠客，如今在这里不知道作甚么。',
        '黑衣剑客':'一身黑衣，手持长剑，就像世外高人一样。',
        '青衣剑客':'一个风程仆仆的侠客。',
        '紫衣剑客':'傲然而立，一脸严肃，好像是在瞪着你一样。',
    },

    '青城山': {
        '海公公':'海公公是皇帝身边的红人，不知为什么在此？',
        '仵作':'这是福州城外的一个仵作，专门检验命案死尸。',
        '恶少':'这是福州城中人见人恶的恶少，最好别惹。',
        '仆人':'恶少带着这个仆人，可是威风得紧的。',
        '屠夫':'一个卖肉的屠夫。',
        '酒店老板':'酒店老板是福州城有名的富人。',
        '店小二':'这个店小二忙忙碌碌，招待客人手脚利索。',
        '女侍':'这是一个女店小二，在福州城内，可是独一无二哦。',
        '酒店女老板':'一个漂亮的女老板，体格风骚。',
        '小甜':'花店中卖花的姑娘，花衬人脸，果然美不胜收。',
        '阿美':'此人三十来岁，专门福州驾驶马车。',
        '镖局弟子':'福威镖局的弟子。',
        '黄衣镖师':'这个镖师穿着一身黄衣。',
        '红衣镖师':'这个镖师穿着一身红衣。',
        '白衣镖师':'这个镖师穿着一身白衣。',
        '林师弟':'林师弟是华山众最小的一个弟子。',
        '兵器贩子':'一个贩卖兵器的男子，看不出有什么来历。',
        '读千里':'此人学富五车，摇头晃脑，只和人谈史论经。',
        '福州捕快':'福州的捕快，整天懒懒散散，不务正业。',
        '福州府尹':'此人官架子很大。',
        '童泽':'一个青年人，眼神有悲伤、亦有仇恨。',
        '木道神':'木道神是青城山的祖师级人物了，年纪虽大，但看不出岁月沧桑。',
        '童隆':'一个眼神凶恶的老头，身材有点佝偻。',
        '背剑老人':'背着一把普通的剑，神态自若，似乎有一股剑势与围于周身，退隐江湖几十年，如今沉醉于花道。',
        '游方郎中':'一个到处贩卖药材的赤脚医生。',
        '青城派弟子':'青城派的弟子，年纪刚过二十，武艺还过得去。',
        '青城弟子':'青城派的弟子，年纪刚过二十，武艺不错，资质上乘。',
        '侯老大':'他就是「英雄豪杰，青城四秀」之一，武功也远高同门。',
        '罗老四':'他就是「英雄豪杰，青城四秀」之一，武功也远高同门。',
        '吉人英':'他就是和申人俊焦孟不离的吉人通。',
        '贾老二':'他就是「青城派」中最为同门不齿、最下达的家伙。',
        '余大掌门':'青城派十八代掌门人',
        '黄袍老道':'一个穿着黄色道袍的老道士。',
        '青袍老道':'一个穿着青色道袍的老道士。',
        '于老三':'他就是「英雄豪杰，青城四秀」之一，武功也远高同门。',
        '林总镖头':'他就是「福威镖局」的总镖头。',
    },

    '逍遥林': {
        '蒙面人':'一个蒙着面部，身穿黑色夜行衣服的神秘人。',
        '吴统领':'他雅擅丹青，山水人物，翎毛花卉，并皆精巧。拜入师门之前，在大宋朝廷做过领军将军之职，因此大家便叫他吴统领',
        '冯巧匠':'据说他就是鲁班的后人，本来是木匠出身。他在精于土木工艺之学，当代的第一巧匠，设计机关的能手',
        '范棋痴':'他师从先生，学的是围棋，当今天下，少有敌手',
        '苏先生':'此人就是苏先生，据说他能言善辩，是一个武林中的智者，而他的武功也是无人能知。',
        '石师妹':'她精于莳花，天下的奇花异卉，一经她的培植，无不欣欣向荣。',
        '薛神医':'据说他精通医理，可以起死回生。',
        '康琴癫':'只见他高额凸颡，容貌奇古，笑眯眯的脸色极为和谟，手中抱着一具瑶琴。',
        '苟书痴':'他看上去也是几十岁的人了，性好读书，诸子百家，无所不窥，是一位极有学问的宿儒，却是纯然一个书呆子的模样。',
        '李唱戏':'他看起来青面獠牙，红发绿须，形状可怕之极，直是个妖怪，身穿一件亮光闪闪的锦袍。他一生沉迷扮演戏文，疯疯颠颠，于这武学一道，不免疏忽了。',
        '常一恶':'马帮帮主，总管事，喜欢钱财的老狐狸。',
        '逍遥祖师':'他就是逍遥派开山祖师、但是因为逍遥派属于一个在江湖中的秘密教派，所以他在江湖中不是很多人知道，但其实他的功夫却是。。。。他年满七旬，满脸红光，须眉皆白。',
        '天山姥姥':'她乍一看似乎是个十七八岁的女子，可神情却是老气横秋。双目如电，炯炯有神，向你瞧来时，自有一股凌人的威严。',
    },

    '开封': {
        '皮货商':'这是一位皮货商，他自己也是满身皮裘。',
        '骆驼':'这是一条看起来有些疲惫的骆驼。',
        '新娘':'新郎官的未婚妻，被高衙内抓到此处。',
        '耶律夷烈':'辽德宗耶律大石之子，身材高大，满面虬髯。',
        '毒蛇':'一条剧毒的毒蛇。',
        '野猪':'一只四肢强健的野猪，看起来很饿',
        '黑鬃野猪':'这是一直体型较大的野猪，一身黑色鬃毛',
        '野猪王':'这是野猪比普通野猪体型大了近一倍，一身棕褐色鬃毛竖立着，看起来很凶残。',
        '鹿杖老人':'此人好色奸诈，但武功卓绝，乃是一代武林高手。经常与鹤发老人同闯武林。',
        '鹤发老人':'此人愚钝好酒，但武功卓绝，乃是一代武林高手。经常与鹿杖老人同闯武林。',
        '白面人':'一个套着白色长袍，带着白色面罩的人，犹如鬼魅，让人见之心寒',
        '官兵':'这是一名官兵，虽然武艺不能跟武林人士比，但他们靠的是人多力量大',
        '七煞堂弟子':'江湖上臭名昭著的七煞堂弟子，最近经常聚集在禹王台，不知道有什么阴谋。',
        '七煞堂打手':'七煞堂打手，还有点功夫的',
        '七煞堂护卫':'七煞堂护卫，似乎有一身武艺',
        '七煞堂护法':'武功高强的护卫，乃总舵主的贴身心腹。',
        '七煞堂总舵主':'这是七煞堂总舵主，看起道貌岸然，但眼神藏有极深的戾气。',
        '七煞堂堂主':'这是七煞堂堂主，看起来一表人才，不过据说手段极为残忍。',
        '小男孩':'一个衣衫褴褛，面有饥色的10多岁小男孩，正跪在大堂前，眼里布满了绝望！',
        '灯笼小贩':'这是一个勤劳朴实的手艺人，据说他做的灯笼明亮又防风。',
        '赵大夫':'赵大夫医术高明，尤其善治妇科各种疑难杂症。',
        '展昭':'这就是大名鼎鼎的南侠。',
        '欧阳春':'这是大名鼎鼎的北侠。',
        '包拯':'他就是朝中的龙图大学士包丞相。只见他面色黝黑，相貌清奇，气度不凡。让你不由自主，好生敬仰。',
        '新郎官':'这是一名披着大红花的新郎官，脸上喜气洋洋。',
        '混混张三':'他长得奸嘴猴腮的，一看就不像是个好人。',
        '铁翼':'他是大旗门的元老。他刚正不阿，铁骨诤诤。',
        '刘财主':'开封府中的富户，看起来脑满肠肥，养尊处优。',
        '武官':'这名武官看起来养尊处优，不知道能不能出征打仗。',
        '高衙内':'这就是开封府内恶名远扬的高衙内，专一爱调戏淫辱良家妇女。',
        '护寺僧人':'他是一位身材高大的青年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭白布镶边袈裟，似乎有一身武艺。',
        '烧香老太':'一个见佛烧香的老太太，花白的头发松散的梳着发髻，满是皱纹的脸上愁容密布',
        '张龙':'这便是开封府霍霍有名的捕头张龙，他身体强壮，看上去武功不错。',
        '孔大官人':'开封府中的富户，最近家中似乎有些变故。',
        '素斋师傅':'在寺庙中烧饭的和尚。',
        '泼皮':'大相国寺附近的泼皮，常到菜园中偷菜。',
        '老僧人':'一个老朽的僧人，脸上满是皱纹，眼睛都睁不开来了',
        '烧火僧人':'一名专职在灶下烧火的僧人',
        '玄衣少年':'一身玄衣的一个少年，似乎对开封的繁华十分向往。',
        '菜贩子':'一个老实巴交的农民，卖些新鲜的蔬菜',
        '王老板':'王家纸马店老板，为人热诚。',
        '码头工人':'这是一名膀大腰圆的码头工人，也许不会什么招式，但力气肯定是有的',
        '船老大':'看起来精明能干的中年男子，坚毅的眼神让人心生敬畏。',
        '落魄书生':'名衣衫褴褛的书生，右手摇着一柄破扇，面色焦黄，两眼无神。',
        '李四':'他长得奸嘴猴腮的，一看就不像是个好人。',
        '陈举人':'看起来有些酸腐的书生，正在查看贡院布告牌。',
        '张老知府':'开封的前任知府大人，如今虽退休多年，但仍然忧国忧民。',
        '富家弟子':'一个白白胖胖的年轻人，一看就知道是娇生惯养惯的富家子。',
        '天波侍卫':'天波府侍卫，个个均是能征善战的勇士！',
        '杨排风':'容貌俏丽，风姿绰约，自幼在天波杨门长大，性情爽直勇敢，平日里常跟穆桂英练功习武，十八般武艺样样在行。曾被封为“征西先锋将军”，大败西夏国元帅殷奇。因为是烧火丫头出身，且随身武器是烧火棍，所以被宋仁宗封为“火帅”。又因为，民间称赞其为“红颜火帅”。',
        '杨延昭':'杨延昭是北宋抗辽名将杨业的长子，契丹人认为北斗七星中的第六颗主镇幽燕北方，是他们的克星，辽人将他看做是天上的六郎星宿下凡，故称为杨六郎。',
        '侍女':'一个豆蔻年华的小姑娘，看其身手似也是有一点武功底子的呢。',
        '佘太君':'名将之女，自幼受其父兄武略的影响，青年时候就成为一名性机敏、善骑射，文武双全的女将。她与普通的大家闺秀不同，她研习兵法，颇通将略，把戍边御侵、保卫疆域、守护中原民众为己任，协助父兄练兵把关，具备巾帼英雄的气度。夫君边关打仗，她在杨府内组织男女仆人丫环习武，仆人的武技和忠勇之气个个都不亚于边关的士兵',
        '柴郡主':'六郎之妻，为后周世宗柴荣之女，宋太祖赵匡胤敕封皇御妹金花郡主。一名巾帼英雄、女中豪杰，成为当时著名的杨门女将之一，有当时天下第一美女之称。',
        '穆桂英':'穆柯寨穆羽之女，有沉鱼落雁之容，且武艺超群，巾帼不让须眉。传说有神女传授神箭飞刀之术。因阵前与杨宗保交战，穆桂英生擒宗保并招之成亲，归于杨家将之列，为杨门女将中的杰出人物。',
        '杨文姬':'乃天波杨门幺女。体态文秀儒雅、有惊鸿之貌，集万千宠爱于一身，被杨门一族视为掌上明珠。其武学集杨门之大成，却又脱胎于杨门自成一格，实属武林中不可多得的才女。',
        '赵虎':'这便是开封府霍霍有名的捕头赵虎，他身体强壮，看上去武功不错。',
        '踏青妇人':'春天出来游玩的妇人，略有姿色。',
        '平夫人':'方面大耳，眼睛深陷，脸上全无血色。',
        '恶狗':'这是一条看家护院的恶狗。',
        '平怪医':'他身材矮胖，脑袋极大，生两撇鼠须，摇头晃脑，形相十分滑稽。',
    },

    '光明顶': {
        '村民':'这是村落里的一个村名。',
        '沧桑老人':'这是一个满脸沧桑的老人。',
        '村妇':'一个村妇。',
        '老太婆':'一个满脸皱纹的老太婆。',
        '小男孩':'这是个七八岁的小男孩。',
        '神秘女子':'这是一个女子',
        '明教小圣使':'他是一个明教小圣使。',
        '闻旗使':'他是明教巨林旗掌旗使。',
        '韦蝠王':'明教四大护法之一，传说喜好吸人鲜血。',
        '彭散玉':'明教五散仙之一。',
        '明教小喽啰':'明教的一个小喽啰，看起来有点猥琐，而且还有点阴险。',
        '辛旗使':'他是明教烈焰旗掌旗使。',
        '布袋大师':'他是明教五散仙之一的布袋大师说不得，腰间歪歪斜斜的挂着几支布袋。',
        '颜旗使':'严垣是明教深土旗掌旗使。',
        '唐旗使':'他是明教白水旗掌旗使。',
        '周散仙':'明教五散仙之一',
        '庄旗使':'明教耀金旗掌旗使。',
        '杨左使':'明教光明左使。',
        '黛龙王':'她就是武林中盛传的紫衣龙王，她肤如凝脂，杏眼桃腮，容光照人，端丽难言。虽然已年过中年，但仍风姿嫣然。',
        '明教教众':'他是身材矮小，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一黑色圣衣，似乎有一身武艺',
        '九幽毒魔':'千夜旗至尊九长老之一，看似一个面容慈祥的白发老人，鹤发童颜，双手隐隐的黑雾却显露了他不世的毒功！',
        '九幽毒童':'负责管理九幽毒池的童子们，个个面色阴沉，残忍好杀。',
        '青衣女孩':'一个身着青衣的小女孩，被抓来此出准备炼毒之用，虽能感觉到恐惧，但双眼仍透出不屈的顽强',
        '冷步水':'他是明教五散仙之一。在他僵硬的面孔上看不出一点表情。',
        '张散仙':'明教五散仙之一。长于风雅之做。',
        '冷文臻':'冷步水的侄子，较为自傲，且要面子。',
        '殷鹰王':'他就是赫赫有名的白眉鹰王，张大教主的外公，曾因不满明教的混乱，独自创立了飞鹰教，自从其外孙成为教主之后，便回归了明教',
        '谢狮王':'他就是赫赫有名的金发狮王，张大教主的义父，生性耿直，只因满心仇恨和脾气暴躁而做下了许多憾事。',
        '张教主':'年方二十多岁的年轻人。明教现今正统教主，武功集各家之长最全面，修为当世之罕见。',
        '范右使':'明教光明右使。',
        '小昭':'她双目湛湛有神，修眉端鼻，颊边微现梨涡，真是秀美无伦，只是年纪幼小，身材尚未长成，虽然容貌绝丽，却掩不住容颜中的稚气。',
        '蒙面人':'用厚厚面巾蒙着脸上的武士，看不清他的真面目',
        '青衣女孩':'一个身着青衣的小女孩，被抓来此出准备炼毒之用，虽能感觉到恐惧，但双眼仍透出不屈的顽强。',
    },

    '全真教': {
        '野马':'一匹健壮的野马。',
        '终南山游客':'一个来终南山游玩的游客。',
        '男童':'这是一个男童。',
        '全真女弟子':'这是一个女道姑。',
        '迎客道长':'他是全真教内负责接待客人的道士。',
        '程遥伽':'她长相清秀端庄。',
        '小道童':'他是全真教的一个小道童',
        '蓝色小道童':'一个全真教的小道童。',
        '练功弟子':'这是全真教的练功弟子。',
        '尹志平':'他是丘处机的得意大弟子尹志平，他粗眉大眼，长的有些英雄气概，在全真教第三代弟子中算得上年轻有为。身材不高，眉宇间似乎有一股忧郁之色。长的倒是长眉俊目，容貌秀雅，面白无须，可惜朱雀和玄武稍有不和。',
        '健马':'一匹健壮的大马',
        '李四':'这是一个中年道士。',
        '孙不二':'她就是全真教二代弟子中唯一的女弟子孙不二孙真人。她本是马钰入道前的妻子，道袍上绣着一个骷髅头。',
        '柴火道士':'一个负责柴火的道士。',
        '马钰':'他就是王重阳的大弟子，全真七子之首，丹阳子马钰马真人。他慈眉善目，和蔼可亲，正笑着看着你。',
        '重阳祖师':'他就是全真教的开山祖师，其身材消瘦，精神矍铄，飘飘然仿佛神仙中人',
        '郝大通':'他就是全真七子中的郝大通郝真人。他身材微胖，象个富翁模样，身上穿的道袍双袖皆无。',
        '老顽童':'此人年龄虽大但却顽心未改，一头乱糟糟的花白胡子，一双小眼睛透出让人觉得滑稽的神色。',
        '观想兽':'一只只有道家之所才有的怪兽',
        '王处一':'他就是全真七子之五王处一王真人。他身材修长，服饰整洁，三绺黑须飘在胸前，神态潇洒',
        '老道长':'这是一个年老的道人。',
        '青年弟子':'一个风程仆仆的侠客。',
        '谭处端':'他就是全真次徒谭处端谭真人，他身材魁梧，浓眉大眼，嗓音洪亮，拜重阳真人为师前本是铁匠出身。',
        '鹿道清':'他是全真教尹志平门下第四代弟子',
        '刘处玄':'他就是全真三徒刘处玄刘真人，他身材瘦小，但顾盼间自有一种威严气概。',
        '掌厨道士':'一个负责掌厨的道士。',
        '小麻雀':'一只叽叽咋咋的小麻雀。',
        '挑水道士':'这是全真教内负责挑水的道士。',
        '老人':'这是一个老人，在全真教内已有几十年了。',
        '蜜蜂':'一直忙碌的小蜜蜂。',
        '丘处机':'他就是江湖上人称‘长春子’的丘处机丘真人，他方面大耳，满面红光，剑目圆睁，双眉如刀，相貌威严，平生疾恶如仇。',
    },

    '古墓': {
        '天蛾':'蜜蜂的天敌之一。',
        '食虫虻':'食肉昆虫，蜜蜂的天敌之一。',
        '白玉蜂':'这是一只玉色的蜜蜂，个头比普通蜜蜂大得多，翅膀上被人用尖针刺有字',
        '红玉蜂':'这是一只玉色的蜜蜂，个头比普通蜜蜂大得多，翅膀上被人用尖针刺有字。',
        '毒蟒':'缺',
        '龙儿':'盈盈而站着一位秀美绝俗的女子，肌肤间少了一层血色，显得苍白异常。披著一袭轻纱般的白衣，犹似身在烟中雾里。',
        '林祖师':'她就是古墓派的开山祖师，虽然已经是四十许人，望之却还如同三十出头。当年她与全真教主王重阳本是一对痴心爱侣，只可惜有缘无份，只得独自在这古墓上幽居。',
        '孙婆婆':'这是一位慈祥的老婆婆，正看着你微微一笑。',
    },

    '白驼山': {
        '傅介子':'中原朝廷出使西域楼兰国的使臣，气宇轩昂，雍容华度，似也会一些武功。',
        '青衣盾卫':'身着青衣，手持巨盾，是敌军阵前的铁卫，看起来极难对付。',
        '飞羽神箭':'百发百中的神箭手，难以近身，必须用暗器武学方可隔空攻击',
        '银狼近卫':'主帅身侧的近卫，都是万里挑一的好手',
        '军中主帅':'敌军主帅，黑盔黑甲，手持长刀。',
        '玉门守将':'一位身经百战的将军，多年驻守此地，脸上满是大漠黄沙和狂风留下的沧桑。',
        '匈奴杀手':'匈奴人杀手，手持弯刀，眼露凶光。',
        '玉门守军':'玉门关的守卫军士，将军百战死，壮士十年归。',
        '玄甲骑兵':'黑盔黑甲的天策骑兵，连马也被锃亮的铠甲包裹着。',
        '车夫':'一名驾车的车夫，尘霜满面。',
        '天策大将':'天策府左将军，英勇善战，智勇双全。身穿黑盔黑甲，腰间有一柄火红的长刀。',
        '玄甲参将':'天策玄甲军的参将，双目专注，正在认真地看着城防图。',
        '凤七':'无影楼金凤堂堂主，武功卓绝自是不在话下，腕上白玉镯衬出如雪肌肤，脚上一双鎏金鞋用宝石装饰。',
        '慕容孤烟':'英姿飒爽的马车店女老板，汉族和鲜卑族混血，双目深邃，含情脉脉，细卷的栗色长发上夹着一个金色玉蜻蜓。',
        '醉酒男子':'此人看似已经喝了不少，面前摆着不下七八个空酒坛，两颊绯红，然而双目却仍是炯炯有神，身长不足七尺，腰别一把看似贵族名士方才有的长剑，谈笑之间雄心勃勃，睥睨天下。男子醉言醉语之间，似是自称青莲居士。',
        '马匪':'这是肆虐戈壁的马匪，长相凶狠，血债累累。',
        '花花公子':'这是个流里流气的花花公子。',
        '寡妇':'一个年轻漂亮又不甘寂寞的小寡妇。',
        '农民':'一个很健壮的壮年农民。',
        '小山贼':'这是个尚未成年的小山贼。',
        '雷震天':'雷横天的儿子，与其父亲不同，长得颇为英俊。',
        '山贼':'这是个面目可憎的山贼。',
        '侍杖':'他头上包着紫布头巾，一袭紫衫，没有一丝褶皱。',
        '雷横天':'这是个粗鲁的山贼头。一身膘肉，看上去内力极度强劲！',
        '金花':'一个年少貌美的姑娘。',
        '铁匠':'铁匠正用汗流浃背地打铁。',
        '舞蛇人':'他是一个西域来的舞蛇人。',
        '店小二':'这位店小二正笑咪咪地忙著招呼客人。',
        '村姑':'一个很清秀的年轻农村姑娘，挎着一只盖着布小篮子。',
        '小孩':'这是个农家小孩子',
        '樵夫':'一个很健壮的樵夫。',
        '农家妇女':'一个很精明能干的农家妇女。',
        '门卫':'这是个年富力强的卫兵，样子十分威严。',
        '仕卫':'这是个样子威严的仕卫。',
        '丫环':'一个很能干的丫环。',
        '欧阳少主':'他一身飘逸的白色长衫，手摇折扇，风流儒雅。',
        '李教头':'这是个和蔼可亲的教头。',
        '小青':'这是个聪明乖巧的小姑娘，打扮的很朴素，一袭青衣，却也显得落落有致。小青对人非常热情。你要是跟她打过交道就会理解这一点！',
        '黑冠巨蟒':'一只庞然大物，它眼中喷火，好象要一口把你吞下。',
        '金环蛇':'一只让人看了起毛骨悚然的金环蛇。',
        '竹叶青蛇':'一只让人看了起鸡皮疙瘩的竹叶青蛇。',
        '蟒蛇':'一只昂首直立，吐着长舌芯的大蟒蛇。',
        '教练':'这是个和蔼可亲的教练。',
        '陪练童子':'这是个陪人练功的陪练童子。',
        '管家':'一个老谋深算的老管家。',
        '白衣少女':'一个聪明伶俐的白衣少女。',
        '老毒物':'他是白驮山庄主，号称“老毒物”。',
        '肥肥':'一个肥头大耳的厨师，两只小眼睛不停地眨巴着。',
        '老材':'一个有名的吝啬鬼，好象他整日看守着柴房也能发财似的',
        '白兔':'一只雪白的小白兔，可爱之致。',
        '驯蛇人':'蛇园里面的驯蛇人，替白驼山庄驯养各种毒蛇。',
        '野狼':'一只独行的野狼，半张着的大嘴里露着几颗獠牙。',
        '雄狮':'一只矫健的雄狮，十分威风。',
        '狐狸':'一只多疑成性的狐狸。',
        '老虎':'一只斑斓猛虎，雄伟极了。',
        '张妈':'一个历经沧桑的老婆婆。',
    },

    '嵩山': {
        '脚夫':'五大三粗的汉子，看起来会些拳脚功夫。',
        '秋半仙':'一名算命道士，灰色道袍上缀着几个补丁。',
        '风骚少妇':'一个风骚的少妇，颇有几分姿色。',
        '锦袍老人':'神情威猛须发花白的老人，看起来武功修为颇高。',
        '柳易之':'朝廷通事舍人，负责传达皇帝旨意。',
        '卢鸿一':'一名布衣老者，慈眉善目，须发皆白。',
        '英元鹤':'这是一名枯瘦矮小的黑衣老人，一双灰白的耳朵看起来有些诡异。',
        '马帮精锐':'身材异常高大的男子，眼神中充满杀气，脸上满布虬龙似的伤疤。',
        '游客':'来嵩山游玩的男子，书生打扮，看来来颇为儒雅。',
        '吸血蝙蝠':'一只体型巨大的吸血蝙蝠。',
        '瞎眼剑客':'一名黑衣剑客，双面失明。',
        '瞎眼刀客':'一名黑衣刀客，双面失明。',
        '瞎眼老者':'这是一名黑衣瞎眼老者，看起来武功修为颇高。',
        '野狼':'山林觅食的野狼，看起来很饿。',
        '林立德':'在嵩阳书院进学的书生，看起来有些木讷。',
        '山贼':'拦路抢劫的山贼',
        '修行道士':'在嵩山隐居修行的道士',
        '黄色毒蛇':'一条吐舌蛇信子的毒蛇。',
        '麻衣刀客':'一身麻衣，头戴斗笠的刀客',
        '白板煞星':'没有鼻子，脸孔平平，像一块白板，看起来极为可怖',
        '小猴':'这是一只调皮的小猴子，虽是畜牲，却喜欢模仿人样。',
        '万大平':'嵩山弟子，看起来很普通。',
        '嵩山弟子':'这是一名嵩山弟子，武功看起来稀松平常。',
        '芙儿':'一名身穿淡绿衫子的少女，只见她脸如白玉，颜若朝华，真是艳冠群芳的绝色美人。',
        '麻衣汉子':'头戴斗笠，身材瘦长，一身麻衣的中年男子，看起来有些诡异。',
        '史师兄':'嵩山派大弟子，武功修为颇高。',
        '白头仙翁':'嵩山派高手，年纪不大，头花却已全白。',
        '左罗':'左掌门的侄子，武功平平，但多谋善断，有传闻说他是左掌门的亲生儿子。',
        '左挺':'冷面短髯，相貌堂皇的青年汉子。',
        '乐老狗':'这人矮矮胖胖，面皮黄肿，约莫五十来岁年纪，目神光炯炯，凛然生威，两只手掌肥肥的又小又厚。',
        '伙夫':'一名肥头大耳的伙夫，负责打理嵩山派一众大小伙食。',
        '冷峻青年':'一个风程仆仆的侠客。',
        '沙秃翁':'这是一名秃头老者，一双鹰眼微闭。',
        '钟九曲':'脸白无须，看起来不像练武之人。',
        '陆太保':'面目凶光的中年汉子，虽是所谓名门正派，但手段极为凶残。',
        '高锦毛':'须发火红的中年汉子',
        '邓神鞭':'一名面容黯淡的老人，但看外表，很难想到他是一名内外皆修的高手。',
        '聂红衣':'一名体态风流的少妇，酥胸微露，媚眼勾人。',
        '左盟主':'身穿杏黄长袍，冷口冷面，喜怒皆不行于色，心机颇深。',
        '枯瘦的人':'身形枯瘦，似乎被困于此多年，但眼神中仍有强烈的生存意志',
    },

    '梅庄': {
        '柳府家丁':'这是杭州有名大户柳府的家丁，穿着一身考究的短衫，一副目中无人的样子。',
        '柳玥':'柳府二小姐，只见她眸含秋水清波流盼，香娇玉嫩，秀靥艳比花娇，指如削葱根，口如含朱丹，一颦一笑动人心魂，旖旎身姿在上等丝绸长裙包裹下若隐若现。听说柳府二千金芳名远扬，传闻柳府大小姐月夜逃婚，至今不知下落。',
        '老者':'一个姓汪的老者，似乎有什么秘密在身上。',
        '筱西风':'这是一名看起来很冷峻的男子，只见他鬓若刀裁，眉如墨画，身上穿着墨色的缎子衣袍，袍内露出银色镂空木槿花的镶边，腰上挂着一把长剑。',
        '武悼':'一个白发苍苍的老人，默默打扫着这万人景仰的武穆祠堂。',
        '梅庄护院':'一身家人装束的壮汉，要挂宝刀，看起来有些功夫。',
        '梅庄家丁':'一身家人装束的男子，看起来有些功夫。',
        '施令威':'一身家人装束的老者，目光炯炯，步履稳重，看起来武功不低。',
        '丁管家':'一身家人装束的老者，目光炯炯，步履稳重，看起来武功不低。',
        '黑老二':'这人虽然生的眉清目秀，然而脸色泛白，头发极黑而脸色极白，像一具僵尸的模样。据说此人酷爱下棋，为人工于心计。',
        '向左使':'这是一名身穿白袍的老人，容貌清癯，刻颏下疏疏朗朗一缕花白长须，身材高瘦，要挂弯刀。',
        '瘦小汉子':'脸如金纸的瘦小的中年男子，一身黑衣，腰系黄带。',
        '柳蓉':'这女子虽是一袭仆人粗布衣裳，却掩不住其俊俏的容颜。只见那张粉脸如花瓣般娇嫩可爱，樱桃小嘴微微轻启，似是要诉说少女心事。',
        '丁二':'这是一名满脸油光的中年男子，虽然其貌不扬，据说曾是京城御厨，蒸炒煎炸样样拿手。',
        '聋哑老人':'这是一名弯腰曲背的聋哑老人，须发皆白，满脸皱纹。据说他每天都去湖底地牢送饭。',
        '丹老四':'此人髯长及腹，一身酒气，据说此人极为好酒好丹青，为人豪迈豁达。',
        '上官香云':'这女子有着倾城之貌，闭月之姿，流转星眸顾盼生辉，发丝随意披散，慵懒不羁。她是江南一带有名的歌妓，据闻琴棋书画无不精通，文人雅士、王孙公子都想一亲芳泽。',
        '秃笔客':'这人身型矮矮胖胖，头顶秃得油光滑亮，看起来没有半点文人雅致，却极为嗜好书法。',
        '琴童':'这是一名青衣童子，扎着双髻，眉目清秀。',
        '黄老朽':'这是一名身型骨瘦如柴的老人，炯炯有神的双目却让内行人一眼看出其不俗的内力。',
        '黑衣刀客':'一身黑色劲装，手持大刀，看起来很凶狠。',
        '青衣剑客':'一身青衣，不知道练得什么邪门功夫，看起来脸色铁青。',
        '紫袍老者':'看起来气度不凡的老人，紫色脸膛在紫袍的衬托下显得更是威严。',
        '红衣僧人':'这人虽然身穿红色僧袍，但面目狰狞，看起来绝非善类。',
        '黄衫婆婆':'虽已满头白发，但眉眼间依旧可见年轻时的娟秀。',
        '地牢看守':'身穿灰布衣裳，脸色因为常年不见阳光，看起来有些灰白。',
        '地鼠':'一只肥大的地鼠，正在觅食。',
        '奎孜墨':'这是一名身穿黑衣的年轻男子，一张脸甚是苍白，漆黑的眉毛下是艺术按个深沉的眼睛，深沉的跟他的年龄极不相符。',
        '任教主':'这名老者身材甚高，一头黑发，穿的是一袭青衫，长长的脸孔，脸色雪白，更无半分血色，眉目清秀，只是脸色实在白得怕人，便如刚从坟墓中出来的僵尸一般。',

    },

    '泰山': {
        '镖师':'当地镖局的镖师，现在被狼军士兵团团围住，难以脱身。',
        '挑夫':'这青年汉子看起来五大三粗，估计会些三脚猫功夫。',
        '黄衣刀客':'这家伙满脸横肉，一付凶神恶煞的模样，令人望而生畏。',
        '瘦僧人':'他是一位中年游方和尚，骨瘦如柴，身上的袈裟打满了补丁。',
        '柳安庭':'这是个饱读诗书，却手无缚鸡之力的年轻书生。',
        '石云天':'生性豁达，原本是丐帮弟子，因为风流本性难改，被逐出丐帮。',
        '朱莹莹':'艳丽的容貌、曼妙的身姿，真是数不尽的万种风情。',
        '欧阳留云':'这是位中年武人，肩背长剑，长长的剑穗随风飘扬，看来似乎身怀绝艺。',
        '温青青':'这名女子神态娴静淡雅，穿着一身石青色短衫，衣履精致，一张俏脸白里透红，好一个美丽俏佳人。',
        '易安居士':'这是有“千古第一才女”之称的李清照，自幼生活优裕，其父李格非藏书甚丰，小时候就在良好的家庭环境中打下文学基础。少年时即负文学的盛名，她的词更是传诵一时。中国女作家中，能够在文学史上占一席地的，必先提李易安。她生活的时代虽在北宋南宋之间，却不愿意随着当时一般的潮流，而专意于小令的吟咏。她的名作象《醉花阴》，《如梦令》，有佳句象“花自飘零水自流，一种相思两处闲愁”等等，都脍炙人口。',
        '程不为':'此人出身神秘，常常独来独往，戴一副铁面具，不让人看到真面目，师承不明。',
        '吕进':'此人出身神秘，常常独来独往，戴一副铁面具，不让人看到真面目，师承不明。',
        '司马玄':'这是一名白发老人，慈眉善目，据说此人精通医术和药理。',
        '桑不羁':'此人身似猿猴，动作矫健，因轻功出众，江湖中难有人可以追的上他，故而以刺探江湖门派消息为生。',
        '鲁刚':'一名隐士，据闻此人精通铸剑。',
        '于霸天':'此人身材魁梧，身穿铁甲，看起来似乎是官府的人。',
        '神秘游客':'此人年纪虽不大，但须发皆白，一身黑袍，看起来气度不凡。',
        '海棠杀手':'这人的脸上看起来没有一丝表情，手里的刀刃闪着寒光。',
        '路独雪':'这人便是江湖有名的海棠杀手“三剑断命”，看起来倒也算是一表人才，只是双目透出的杀气却让人见之胆寒。',
        '铁云':'据说杀手无情便无敌，这人看起来风流倜傥，却是极为冷血之人。',
        '孔翎':'据说他就是海棠杀手组织的首领，不过看他的样子，似乎不像是一个能统领众多杀手的人。',
        '姬梓烟':'这是一名极为妖艳的女子，一身黑色的紧身衣将其包裹得曲线毕露，估计十个男人见了十个都会心痒难耐。',
        '柳兰儿':'这是一个看起来天真烂漫的少女，不过等她的剑刺穿你的身体时，你才会意识到天真是多么好的伪装。',
        '布衣男子':'这是一名身穿粗布衣服的男子，看起来很强壮。',
        '阮小':'这人五短身材，尖嘴猴腮。',
        '阮大':'这人五短身材，尖嘴猴腮。',
        '史义':'这人身穿粗布劲装，满脸络腮胡，双眼圆瞪，似乎随时准备发怒。',
        '司马墉':'这人穿着一身长袍，敏锐的双眼让人感觉到他的精明过人。',
        '林忠达':'这人看起来很普通，是那种见过后便会忘记的人。',
        '铁面人':'这人脸上蒙着一张黑铁面具，看不见他的模样，但面具后双眼却给人一种沧桑感。',
        '铁翼':'铁翼是铁血大旗门的元老。他刚正不阿，铁骨诤诤，如今被囚禁于此。',
        '黑衣人':'一个风程仆仆的侠客。',
        '李三':'此人无发无眉，相貌极其丑陋。',
        '仇霸':'此人独目秃顶，面目凶恶，来官府通缉要犯。',
        '平光杰':'这是一名身穿粗布衣服的少年，背上背着一个竹篓，里面放着一些不知名的药草。',
        '玉师弟':'此人一身道袍，看起来颇为狡诈。',
        '玉师兄':'这人面色灰白，双眼无神，看起来一副沉溺酒色的模样。',
        '玉师伯':'泰山掌门的师叔，此人看起来老奸巨猾。',
        '任娘子':'这是一名艳丽少妇，勾魂双面中透出一股杀气。',
        '黄老板':'双鞭客栈老板，看起来精明过人。',
        '红衣卫士':'一身红色劲装的卫士，看起来有些功夫。',
        '白飞羽':'这人算得上是一个美男子，长眉若柳，身如玉树。',
        '商鹤鸣':'这人生的有些难看，黑红脸膛，白发长眉，看起来有些阴郁。',
        '西门允儿':'这是一名极有灵气的女子，穿着碧绿纱裙。',
        '冯太监':'皇帝身边鹤发童颜的太监，权势滔天，眼中闪着精光。',
        '钟逍林':'这是一名魁梧的中年男子，看起来内家功夫造诣不浅。',
        '西门宇':'这是一名身材伟岸的中年男子，看起来霸气逼人。',
        '黑衣密探':'这是一名蒙面密探。',
        '毒蛇':'这是一条斑斓的大蛇，一眼看去就知道有剧毒',
        '黄衣刀客':'这家伙满脸横肉，一付凶神恶煞的模样，令人望而生畏。',
        '筱墨客':'这人脸上挂着难以捉摸的笑容，看起来城府极深。',
        '铁恶人':'铁毅同父异母之弟，为了「大旗门」宝藏，时常算计其大哥铁毅。',
        '迟一城':'泰山弟子，剑眉星目，身姿挺拔如松。',
        '泰山弟子':'这是一名青衣弟子，手里握着一把长剑。',
        '建除':'泰山掌门的弟子，身形矫健，看起来武功不错。',
        '天柏':'泰山掌门的师弟，看起来英气勃勃。',
        '天松':'泰山掌门的师弟，嫉恶如仇，性子有些急躁。',
        '玉师叔':'泰山掌门的师叔，处事冷静，极有见识。',
        '泰山掌门':'此人为泰山掌门，此人看起来正气凛然。',

    },

    '铁血大旗门': {
        '陈子昂':'一个狂放书生，显是出自豪富之家，轻财好施，慷慨任侠。',
        '小贩':'这小贩左手提着个篮子，右手提着个酒壶。篮上系着铜铃，不住叮铛作响。',
        '酒肉和尚':'这是一个僧不僧俗不俗，满头乱发的怪人',
        '宾奴':'阴宾所养的波斯猫',
        '渔夫':'这是一个满脸风霜的老渔夫。',
        '叶缘':'刚拜入大旗门不久的青年。',
        '老婆子':'她面容被岁月侵蚀，风雨吹打，划出了千百条皱纹，显得那么衰老但一双眼睛，却仍亮如闪电，似是只要一眼瞧过去，任何人的秘密，却再也休想瞒过她。',
        '罗少羽':'刚拜入大旗门不久的青年。',
        '青衣少女':'一个身材苗条，身着青衣的少女。',
        '日岛主':'日岛主乃大旗门第七代掌门人云翼之妻，因看不惯大旗门人对其n妻子的无情，开创常春岛一派，以收容世上所有伤心女子。',
        '潘兴鑫':'刚到拜入大旗门不久的青年。',
        '铁掌门':'他是大旗门的传人。',
        '夜皇':'他容光焕发，须发有如衣衫般轻柔，看来虽是潇洒飘逸，又带有一种不可抗拒之威严。',
        '橙衣少女':'她身穿轻纱柔丝，白足如霜，青丝飘扬。',
        '阴宾':'她面上蒙着轻红罗纱，隐约间露出面容轮廓，当真美得惊人，宛如烟笼芍药，雾里看花',
        '宾奴':'阴宾所养的波斯猫',
        '朱藻':'风流倜傥',
        '隐藏-X衣少女':'她身穿轻纱柔丝，白足如霜，青丝飘扬。',
        '卓三娘':'闪电卓三娘轻功世无双，在碧落赋中排名第三。',
        '风老四':'风梭风九幽，但他现在走火入魔，一动也不能动了。',
        '小白兔':'小白兔白又白两只耳朵竖起来。',
        '水灵儿':'她满面愁容，手里虽然拿着本书，却只是呆呆的出神。',
        '隐藏-叶缘':'一个风程仆仆的侠客。',
        '隐藏-罗少羽':'一个风程仆仆的侠客。',
        '隐藏-潘兴鑫':'一个风程仆仆的侠客。',
    },

    '大昭寺': {
        '小绵羊':'一只全身雪白的的绵羊。',
        '大绵羊':'一只全身雪白的的绵羊。',
        '小羊羔':'一只全身雪白的的绵羊。',
        '红牧羊女':'一个牧羊女正在放羊。',
        '白牧羊女':'一个牧羊女正在放羊。',
        '草原狼':'一直凶残的草原狼。',
        '白衣少年':'年纪轻轻的少年，武功了得，却心狠手辣。',
        '李将军':'一个玄甲黑盔，身披白色披风的少年将军，虽面容清秀，却不掩眉宇之间的果决和坚毅。',
        '突厥先锋大将':'东突厥狼军先锋大将，面目凶狠，身披狼皮铠甲，背负长弓，手持丈余狼牙棒。',
        '神秘甲士':'身披重甲，手持长戟，不许旁人前进一步。',
        '地宫暗哨':'黑衣黑靴，一旦有外人靠近地宫，便手中暗器齐发。',
        '守山力士':'他们的双拳，便是镇守陵寝最好的武器。',
        '城卫':'一个年青的藏僧。',
        '紫衣妖僧':'附有邪魔之气的僧人。',
        '塔僧':'一个负责看管舍利塔的藏僧。',
        '关外旅客':'这是一位来大昭寺游览的旅客。',
        '护寺喇嘛':'一个大招寺的藏僧。',
        '护寺藏尼（黄)':'一个大招寺的藏尼。',
        '护寺藏尼（白)':'一个大招寺的藏尼。',
        '灵空':'灵空高僧是大昭寺现在的主持。',
        '葛伦':'葛伦高僧已在大昭寺主持多年。男女弟子遍布关外。',
        '塔祝':'这个老人看起来七十多岁了，看著他佝偻的身影，你忽然觉得心情沈重了下来。',
        '胭松':'胭松是葛伦高僧的得意二弟子。',
        '余洪兴':'这是位笑眯眯的丐帮八袋弟子，生性多智，外号小吴用。',
        '陶老大':'这是整天笑咪咪的车老板，虽然功夫不高，却也过得自在。',
        '店老板':'这位店老板正在招呼客人',
        '野狗':'一只浑身脏兮兮的野狗。',
        '樵夫':'你看到一个粗壮的大汉，身上穿著普通樵夫的衣服。',
        '收破烂的':'一个收破烂的。',
        '乞丐':'一个满脸风霜之色的老乞丐。',
        '疯狗':'一只浑身脏兮兮的野狗，一双眼睛正恶狠狠地瞪著你。',
        '卜一刀':'他是个看起来相当英俊的年轻人，不过点神秘莫测的感觉。',
        '镇魂将':'金盔金甲的护陵大将。',
        '头狼':'狼群之王，体型硕大，狼牙寒锋毕露。',
    },

    '黑木崖': {
        '怪人':'看起来像是只妖怪一般。',
        '黑熊':'一只健壮的黑熊。',
        '店小二':'这是一个忙忙碌碌的小二。',
        '客店老板':'一个贼眉鼠眼的商人。',
        '冉无望':'一个面容俊朗的少年，却眉头深锁，面带杀气。',
        '船夫':'一个船夫。',
        '魔教弟子':'这家伙满脸横肉，一付凶神恶煞的模样，令人望而生畏。',
        '见钱开':'此人十分喜好钱财。',
        '贾布':'他使得一手好钩法。',
        '鲍长老':'他一身横练的功夫，孔武有力。',
        '葛停香':'他天生神力，勇猛无比。',
        '上官云':'他使得一手好剑法。',
        '桑三娘':'她使得一手好叉法。',
        '罗烈':'他使得一手好枪法。',
        '童长老':'他使得一手好锤法',
        '王诚':'他使得一手好刀法。',
        '魔教犯人':'一个魔教的犯人，他们都是到魔教卧底的各大门派弟子事泄被捕的',
        '花想容':'她使得一手好刀法。',
        '曲右使':'他使得一手好钩法。',
        '张矮子':'他使得一手好武功。',
        '张白发':'他使得一手好掌法。',
        '赵长老':'她使得一手好叉法。',
        '独孤风':'此人是用剑高手。',
        '杨延庆':'他使得一手好枪法。',
        '范松':'他使得一手好斧法。',
        '巨灵':'他使得一手好锤法。',
        '楚笑':'虽是女子，但武功绝不输于须眉。',
        '莲亭':'他身形魁梧，满脸虬髯，形貌极为雄健。',
        '东方教主':'他就是日月神教教主。号称无人可敌。',
    },

    '星宿海': {
        '梅师姐':'此人一脸干皱的皮肤，双眼深陷，犹如一具死尸。',
        '天梵密使':'天梵宗主密使，遮住了容貌，神秘莫测。',
        '波斯商人':'一个高鼻蓝眼的波斯商人。他看着你脸上露出狡猾的笑容。',
        '矮胖妇女':'一个很胖的中年妇女。',
        '唐冠':'唐门中的贵公子，父亲是唐门中的高层，看起来极自负',
        '波斯老者':'一个老者来自波斯，似乎是一个铁匠，脸上看起来有点阴险的感觉。',
        '买卖提':'买卖提是个中年商人，去过几次中原，能讲一点儿汉话',
        '阿拉木罕':'她身段不肥也不瘦。她的眉毛像弯月，她的眼睛很多情',
        '伊犁马':'这是一匹雄壮的母马，四肢发达，毛发油亮。',
        '巴依':'一个风尘仆仆的侠客。。',
        '小孩':'这是个小孩子',
        '阿凡提':'他头上包着头巾，长着向上翘的八字胡，最喜欢捉弄巴依、帮助穷人。他常给别人出谜语。',
        '牧羊人':'一个老汉，赶着几十只羊。',
        '紫姑娘':'她就是丁老怪弟子紫姑娘。她容颜俏丽，可眼神中总是透出一股邪气。',
        '采药人':'一个辛苦工作的采药人。',
        '玄衣刀妖':'一个白发老人，身着紫衣，眼神凶狠，太阳穴隆起，显是有不低的内力修为。',
        '周女侠':'身形修长，青裙曳地。皮肤白嫩，美若天人。恍若仙子下凡，是人世间极少的绝美女子。其武功修为十分了得。',
        '毒蛇':'一只有着三角形脑袋的蛇，尾巴沙沙做响。',
        '牦牛':'这是一头常见的昆仑山野牦牛',
        '雪豹':'这是一头通体雪白的昆仑山雪豹，极为罕有',
        '天狼师兄':'他就是丁老怪的三弟子。',
        '出尘师弟':'他就是丁老怪的八弟子。他身才矮胖，可手中握的钢杖又长又重。',
        '星宿派号手':'他是星宿派的吹号手。他手中拿着一只铜号，鼓足力气一脸沉醉地吹着。',
        '星宿派钹手':'他是星宿派的击钹手。他手中拿着一对铜钹，一边敲一边扯着嗓子唱些肉麻的话。',
        '星宿派鼓手':'他是星宿派的吹鼓手。他面前放着一只铜鼓，一边敲一边扯着嗓子唱些肉麻的话。',
        '狮吼师兄':'他就是丁老怪的二弟子。他三十多岁，狮鼻阔口，一望而知不是中土人士',
        '摘星大师兄':'他就是丁老怪的大弟子、星宿派大师兄。他三十多岁，脸庞瘦削，眼光中透出一丝乖戾之气。',
        '丁老怪':'他就是星宿派开山祖师、令正派人士深恶痛绝的星宿老怪丁老怪。可是他看起来形貌清奇，仙风道骨。',
        '采花子':'采花子是星宿派的一个小喽罗，武功虽不好，但生性淫邪，经常奸淫良家妇女，是官府通缉的犯人，故而星宿派名义上也不承认有这个弟子。',
        '铁尸':'这人全身干枯，不像一个人，倒像是一具干尸。',
    },

    '茅山': {
        '野猪':'一只笨笨的野猪',
        '阳明居士':'阳明居士潇洒俊逸，一代鸿儒，学识渊博且深谙武事，有「军神」之美誉，他开创的「阳明心学」更是打破了朱派独霸天下的局面。',
        '道士':'茅山派的道士，着一身黑色的道袍',
        '孙天灭':'孙天灭外号六指小真人，是林忌最喜爱的徒弟。他尽得林忌真传！',
        '道灵':'道灵真人是林忌的师弟，也是上代掌门的关门弟子，虽然比林忌小了几岁，但道行十分高深，「谷衣心法」已修炼到极高境界了。',
        '护山使者':'护山使者是茅山派的护法，着一身黑色的道袍',
        '林忌':'林忌是一位道行十分高深的修道者，你发现他的眼珠一个是黑色的，一个是金色的，这正是「谷衣心法」修炼到极高境界的徵兆。',
        '万年火龟':'一只尺许大小，通体火红的乌龟。',
        '张天师':'他是龙虎山太乙一派的嫡系传人，他法力高强，威名远播。',
        '心魔':'缺',
    },

    '桃花岛': {
        '陆废人':'他是黄岛主的三弟子。',
        '神雕大侠':'他就是神雕大侠，一张清癯俊秀的脸孔，剑眉入鬓。',
        '老渔夫':'一个看上去毫不起眼的老渔夫，然而……',
        '桃花岛弟子':'一个三十出头的小伙子，身板结实，双目有神，似乎练过几年功夫。',
        '桃花岛弟子':'一个二十多岁的小伙子，身板结实，双目有神，似乎练过几年功夫。',
        '哑仆人':'又聋又哑，似乎以前曾是一位武林高手。',
        '哑仆':'这是一个桃花岛的哑仆。他们全是十恶不赦的混蛋，黄药师刺哑他们，充为下御。',
        '丁高阳':'曲三的一位好友，神态似乎非常着急。',
        '曲三':'他是黄岛主的四弟子。',
        '黄岛主':'他就是黄岛主，喜怒无常，武功深不可测。',
        '蓉儿':'她是黄岛主的爱女，长得极为漂亮。',
        '傻姑':'这位姑娘长相还算端正，就是一副傻头傻脑的样子。',
        '戚总兵':'此乃东南海防驻军主将，英武之气凛凛逼人，威信素著，三军皆畏其令，从不敢扰民。',
    },

    '铁雪山庄': {
        '樵夫':'一个砍柴为生的樵夫。',
        '红樵夫':'一个砍柴为生的樵夫。',
        '欧冶子':'华夏铸剑第一人，许多神剑曾出自他手。',
        '老张':'铁血山庄的门卫。',
        '雪鸳':'神秘的绿衣女子，似乎隐居在铁雪山庄，无人能知其来历。',
        '铁少':'铁山是一个风流倜傥的公子。',
        '雪蕊儿':'雪蕊儿肤白如雪，很是漂亮。在这铁雪山庄中，和铁少过着神仙一般的日子。',
        '小翠':'铁雪山庄的一个丫鬟。',
        '白袍公':'一个一袭白衣的老翁。',
        '黑袍公':'一个一袭黑衣的老翁。',
        '陳小神':'快活林里小神仙，一个眉清目秀的江湖新人，据说机缘巧合下得到了不少江湖秘药，功力非同一般，前途不可限量。',
        '剑荡八荒':'虬髯大汉，要凭一把铁剑战胜天下高手，八荒无敌。',
        '魏娇':'女扮男装的青衣秀士，手持长剑，英姿飒爽，好一个巾帼不让须眉。',
        '神仙姐姐':'白裙袭地，仙气氤氲，武林中冉冉升起的新星，誓要问鼎至尊榜，执天下之牛耳。',
        '小飞':'『不落皇朝』的二当家，为人洒脱风趣，酷爱蹴鞠，酒量超群，以球入道。传闻只要饮下三杯佳酿，带醉出战，那么不论是踢全场、转花枝、大小出尖，流星赶月，他都能凭借出色的技艺独占鳌头。',
        '寒夜·斩':'一副浪荡书生打扮的中年剑客，据说他也曾是一代高手。',
        '他':'这人的名字颇为奇怪，只一个字。行为也颇为怪诞，总是藏在花丛里。不过武功底子看起来却一点都不弱。',
        '出品人◆风云':'江湖豪门『21世纪影业』的核心长老之一，与帮主番茄携手打下一片江山，江湖中威震一方的豪杰。',
        '二虎子':'一个已过盛年的江湖高手，像是曾有过辉煌，却早已随风吹雨打去。他曾有过很多名字，现在却连一个像样的都没有留下，只剩下喝醉后嘴里呢喃不清的“大师”，“二二二”，“泯恩仇”，你也听不出个所以然。',
        '老妖':'一个金眼赤眉的老人，传说来自遥远的黑森之山，有着深不可测的妖道修为。',
        '欢乐剑客':'『地府』威震江湖的右护法，手中大斧不知道收留了多少江湖高手的亡魂。',
        '黑市老鬼':'江湖人无人不知，无人不晓的黑市老鬼头，包裹里无奇不有，无所不卖，只要你有钱，什么稀奇的货品都有，比如黑鬼的凝视，眼泪，咆哮，微笑。。。一应俱全。',
        '纵横老野猪?':'两件普通的黑布衣衫罩在身上，粗犷的眉宇间英华内敛，目光凝实如玉，显出极高的修行。《参同契》有云：「故铅外黑，内怀金华，被褐怀玉，外为狂夫」。目睹此人，可窥一斑。',
        '无头苍蝇':'一个佝偻着身躯的玄衣老头，从后面看去，似是没有头一样，颇为骇人。',
        '神弑☆铁手':'武林中数一数二的后起之秀，和所有崛起的江湖高手一样，潜心修炼，志气凌云。',
        '禅师':'一个退隐的禅师，出家人连名字都忘怀了，只剩下眼中隐含的光芒还能看出曾是问鼎武林的高手。',
        '道一':'后起之秀，面若中秋之月，色如春晓之花，鬓若刀裁，眉如墨画。',
        '采菊隐士':'一个与世无争的清修高人，无心江湖，潜心修仙。用「美男子」来形容他一点也不为过。身高近七尺，穿着一袭绣绿纹的紫长袍，外罩一件亮绸面的乳白色对襟袄背子。',
        '【人间】雨修':'曾经的江湖第二豪门『天傲阁』的大当家，武勇过人，修为颇深。怎奈何门派日渐式微，江湖声望一日不如一日，让人不禁扼腕叹息，纵使一方霸主也独木难支。',
        '男主角◆番茄':'江湖豪门『21世纪影业』的灵魂，当世绝顶高手之一，正在此潜心修练至上武学心法，立志要在这腥风血雨的江湖立下自己的声威！',
        '剑仙':'白须白发，仙风道骨，离世独居的高人。',
        '冷泉心影':'『不落皇朝』当之无愧的君主和领袖，致力破除心中习武障魔，参得无上武道。头上戴着束发嵌宝紫金冠，齐眉勒着二龙抢珠金抹额，如同天上神佛降临人世。',
        '汉时叹':'身穿水墨色衣、头戴一片毡巾，生得风流秀气。『地府』帮的开山祖师，曾是武功横绝一时的江湖至尊。手中暗器『大巧不工』闻者丧胆，镖身有字『挥剑诀浮云』。',
        '烽火戏诸侯':'身躯凛凛，相貌堂堂。一双眼光射寒星，两弯眉浑如刷漆。胸脯横阔，有万夫难敌之威风。武林至尊榜顶尖剑客，一人一剑，手持『春雷』荡平天剑谷，天下武林无人不晓！神剑剑身一面刻“凤年”，一面刻着“天狼”。',
        '阿不':'器宇轩昂，吐千丈凌云之志气。?白衣黑发，双手负于背后，立于巨岩之顶，直似神明降世??。这是武林至尊榜第一高手，不世出的天才剑客，率『纵横天下』帮独尊江湖。手持一柄『穿林雨』长枪，枪柄上刻着一行小字：『归去，也无风雨也无晴』。',

    },

    '慕容山庄': {
        '家丁':'一个穿着仆人服装的家丁。',
        '邓家臣':'他是慕容家四大家臣之首，功力最为深厚。',
        '朱姑娘':'这是个身穿红衣的女郎，大约十七八岁，一脸精灵顽皮的神气。一张鹅蛋脸，眼珠灵动，别有一番动人风韵。',
        '慕容老夫人':'她身穿古铜缎子袄裙，腕带玉镯，珠翠满头，打扮的雍容华贵，脸上皱纹甚多，眼睛迷迷朦朦，似乎已经看不见东西。',
        '慕容侍女':'一个侍女，年龄不大。',
        '公冶家臣':'他是慕容家四大家臣之二，为人稳重。',
        '包家将':'他是慕容家四大家臣之三，生性喜欢饶舌。',
        '风波恶':'他是慕容家四大家臣之四，最喜欢打架，轻易却不服输。',
        '慕容公子':'他是姑苏慕容的传人，他容貌俊雅，风度过人，的确非寻常人可比。',
        '慕容家主':'他是姑苏慕容的传人，可以说是自慕容龙城以下武功最为杰出之人。不仅能贯通天下百家之长，更是深为精通慕容家绝技。',
        '小兰':'这是一个蔓陀山庄的丫环。',
        '严妈妈':'一个中年妇女，身上的皮肤黝黑，常年不见天日的结果。',
        '神仙姐姐':'她秀美的面庞之上，端庄中带有稚气，隐隐含着一丝忧色。见你注目看她不觉低头轻叹。只听得这轻轻一声叹息。霎时之间，你不由得全身一震，一颗心怦怦跳动。心想：“这一声叹息如此好听，世上怎能有这样的声音？”听得她唇吐玉音，更是全身热血如沸！',
        '王夫人':'她身穿鹅黄绸衫，眉目口鼻均美艳无伦，脸上却颇有风霜岁月的痕迹。',
        '小茗':'这是一个蔓陀山庄的丫环。',
        '船工小厮':'一位年轻的船工。表情看上去很消沉，不知道发生了什么。',
        '芳绫':'她看起来像个小灵精，头上梳两个小包包头。她坐在地上，看到你看她便向你作了个鬼脸!你想她一定是调皮才会在这受罚!',
        '无影斥候':'经常在孔府徘徊的斥候。',
        '柳掌门':'封山剑派掌门，看似中了某种迷香，昏昏沉沉的睡着。',
    },

    '大理': {
        '摆夷女子':'她是一个身着白衣的摆夷女子，长发飘飘，身态娥娜。',
        '士兵':'他是一个大理国禁卫军士兵，身着锦衣，手执钢刀，双目精光炯炯，警惕地巡视着四周的情形。',
        '武将':'他站在那里，的确有说不出的威风。',
        '下关城台夷商贩':'一位台夷族的商贩，正在贩卖一竹篓刚打上来的活蹦乱跳的鲜鱼。',
        '乌夷商贩':'一位乌夷族的商贩，挑着一担皮毛野味在贩卖。',
        '土匪':'这家伙满脸横肉一付凶神恶煞的模样，令人望而生畏。',
        '猎人':'一位身强力壮的乌夷族猎手。',
        '皮货商':'一位来远道而来的汉族商人，来此采购皮货。',
        '牧羊女':'她是一个摆夷牧羊女子。',
        '牧羊人':'他一个摆夷牧羊男子。',
        '破嗔':'他是一个和尚，是黄眉大师的二弟子。',
        '破疑':'他是一个和尚，是黄眉大师的大弟子。',
        '段恶人':'他身穿一件青布长袍，身高五尺有余，脸上常年戴一张人皮面具，喜怒哀乐一丝不露。',
        '吴道长':'一个看起来道风仙骨的道士。',
        '农夫':'一位乌夷族的农夫，束发总于脑后，用布纱包着，上半身裸露，下著兽皮。',
        '乌夷老祭祀':'一个乌夷族的祭司，身披乌夷大麾，戴着颇多金银饰物，显示其地位不凡。',
        '少女':'一位乌夷族的少女，以酥泽发，盘成两环，上披蓝纱头巾，饰以花边。',
        '山羊':'一头短角山羊，大理地区常见的家畜。',
        '孟加拉虎':'一只斑斓孟加拉虎，雄伟极了。',
        '神农帮弟子':'这是一个神农帮的帮众，身穿黄衣，肩悬药囊，手持一柄药锄。',
        '无量剑弟子':'这是无量剑派的一名弟子，腰挎一柄长剑，神情有些鬼祟，象是惧怕些什么。',
        '朱护卫':'他是大理国四大护卫之一。一副书生酸溜溜的打扮行头。',
        '锦衣卫士':'这是位锦衣卫士，身着锦衣，手执钢刀，双目精光炯炯，警惕地巡视着四周的情形。',
        '太监':'一个风尘仆仆的侠客。。',
        '丹顶鹤':'一只全身洁白的丹顶鹤，看来是修了翅膀，没法高飞了。',
        '宫女':'一位大理皇宫乌夷族宫女，以酥泽发，盘成两环，一身宫装，目无表情。',
        '傅护卫':'他是大理国四大护卫之一。',
        '褚护卫':'他是大理国四大护卫之一。身穿黄衣，脸上英气逼人。手持一根铁杆。',
        '家丁':'他是大理国镇南王府的家丁。',
        '霍先生':'他一身邋遢，形容委琐，整天迷迷糊糊的睡不醒模样。可是他的账务十几年来无可挑剔。原来他就是伏牛派的崔百泉，为避仇祸隐居于此。',
        '华司徒':'他是大理国三大公之一。华司徒本名阿根，出身贫贱，现今在大理国位列三公，未发迹时，干部的却是盗墓掘坟的勾当，最擅长的本领是偷盗王公巨贾的坟墓。这些富贵人物死后，必有珍异宝物殉葬，华阿根从极远处挖掘地道，通入坟墓，然后盗取宝物。所花的一和虽巨，却由此而从未为人发觉。有一次他掘入一坟，在棺木中得到了一本殉葬的武功秘诀，依法修习，练成了一身卓绝的外门功夫，便舍弃了这下贱的营生，辅佐保定帝，累立奇功，终于升到司徒之职。',
        '范司马':'他是大理国三公之一。',
        '巴司空':'他是大理国三公之一。一个又瘦又黑的汉子，但他的擅长轻功。',
        '段王妃':'大理王妃，徐娘半老，风韵犹存。',
        '石人':'一个练功用的比武石人，雕凿得很精细，如同真人一般。',
        '段无畏':'他是大理国镇南王府管家。',
        '古护卫':'他是大理国四大护卫之一。',
        '王府御医':'一个风程仆仆的侠客。',
        '段皇爷':'他就是大理国的镇南王，当今皇太弟，是有名的爱情圣手。',
        '婉清姑娘':'她长得似新月清晕，如花树堆雪，一张脸秀丽绝俗，只是过于苍白，没半点血色，想是她长时面幕蒙脸之故，两片薄薄的嘴唇，也是血色极淡，神情楚楚可怜，娇柔婉转。',
        '薛老板':'这是一个经验老到的生意人，一双精明的眼睛不停的打量着你。',
        '石匠':'他是一个打磨大理石的石匠，身上只穿了一件坎肩，全身布满了厚实的肌肉。',
        '摆夷小孩':'一个幼小的摆夷儿童。',
        '江湖艺人':'他是一个外地来的江湖艺人，手里牵着一只金丝猴儿，满脸风尘之色。',
        '太和居店小二':'这位店小二正笑咪咪地忙著，还不时拿起挂在脖子上的抹布擦脸。',
        '歌女':'她是一个卖唱为生的歌女。',
        '南国姑娘':'南国的大姑娘颇带有当地优美秀丽山水的风韵，甜甜的笑，又有天真的浪漫。她穿着白色上衣，蓝色的宽裤，外面套着黑丝绒领褂，头上缠着彩色的头巾。',
        '摆夷老叟':'一个摆夷老叟大大咧咧地坐在竹篱板舍门口，甩着三四个巴掌大的棕吕树叶，瞧着道上来来往往的人们，倒也快活自在。',
        '野兔':'一只好可爱的小野兔。',
        '盛皮罗客商':'这是一位从印度来的客商，皮肤黝黑，白布包头，大理把印度人叫作盛皮罗。',
        '客店店小二':'这位店小二正笑咪咪地忙著，还不时拿起挂在脖子上的抹布擦脸。',
        '古灯大师':'他身穿粗布僧袍，两道长长的白眉从眼角垂了下来，面目慈祥，长须垂肩，眉间虽隐含愁苦，但一番雍容高华的神色，却是一望而知。大师一生行善，积德无穷。',
        '渔夫':'一位台夷族的渔夫，扛这两条竹桨，提着一个鱼篓。',
        '台夷猎人':'一位台夷族的猎手，擅用短弩，射飞鸟。',
        '台夷妇女':'一位中年的台夷妇女，上着无领衬花对襟，下穿五色筒裙，正在编织渔网。',
        '台夷姑娘':'一位年轻的台夷姑娘，上着无领衬花对襟，下穿五色筒裙。',
        '水牛':'一头南方山区常见的水牛，是耕作的主力，也用来拉车载物。由于水草茂盛，长得十分肥壮。',
        '台夷农妇':'一位年轻的台夷农妇，在田里辛勤地劳作着。',
        '武定镇采笋人':'一个卢鹿部的青年台夷妇女，背后背了个竹筐，手拿一把砍柴刀，来采竹笋。',
        '族长':'一位满脸皱纹的老年妇女，正是本村的族长。台夷时处母系氏族，族中权贵皆为妇女。',
        '祭祀':'一位满脸皱纹的老年妇女，是本村的大祭司，常年司守祭台。台夷时处母系氏族，祭司要职皆为妇女。',
        '侍者':'他看上去长的眉清目秀。',
        '高侯爷':'大理国侯爷，这是位宽袍大袖的中年男子，三缕长髯，形貌高雅',
        '素衣卫士':'这是位身怀绝技的武士。',
        '陪从':'一个部族头领的陪从。',
        '傣族首领':'这是一个身裹虎皮的高大男性。',
        '大土司':'大土司是摆夷族人氏，是苍山纳苏系的。他倒是长的肥头大耳的，每说一句话，每有一点表情，满脸的肉纹便象是洱海里的波浪一样。他身着彩绸，头带凤羽，脚踩藤鞋，满身挂着不同色彩的贝壳。只见他傲气凛然地高居上座，不把来人看在眼里。',
        '侍从':'这位倒也打扮的利索，一身短打，白布包头，翘起的裤腿，一双洁白的布鞋，格外醒目。他正准备出去筹备白尼族一年一度的大会。',
        '族头人':'这位是哈尼的族头人，哈尼是大理国的第三大族，大多聚在大都附近。此人貌甚精明，身穿对襟衣，亦是白布包头。他坐在大土司的右下首，对来人细细打量着。',
        '黄衣卫士':'这是位黄衣卫士，身着锦衣，手执钢刀，双目精光炯炯，警惕地巡视着四周的情形。',
        '毒蜂':'一只色彩斑斓大个野蜂，成群结队的。',
        '平通镖局镖头':'一个风尘仆仆的侠客。。',
        '麻雀':'一只叽叽喳喳，飞来飞去的小麻雀。',
        '小道姑':'玉虚观的小道姑，她是在这接待香客的。',
        '刀俏尼':'这是个容貌秀丽的中年道姑，是个摆夷族女子，颇有雍容气质。',
        '僧人':'一个精壮僧人。',
        '枯大师':'他的面容奇特之极，左边的一半脸色红润，皮光肉滑，有如婴儿，右边的一半却如枯骨，除了一张焦黄的面皮之外全无肌肉，骨头突了出来，宛然便是半个骷髅骨头。这是他修习枯荣禅功所致。',
        '恶奴':'他看上去膀大腰粗，横眉怒目，满面横肉。看来手下倒也有点功夫。',
        '贵公子':'这是一介翩翩贵公子，长得到也算玉树临风、一表人才，可偏偏一双眼睛却爱斜着瞟人。',
        '游客':'一个远道来的汉族游客，风尘仆仆，但显然为眼前美景所动，兴高彩烈。',
        '村妇':'一个年轻的摆夷村妇。',
        '段公子':'他是一个身穿青衫的年轻男子。脸孔略尖，自有一股书生的呆气。',
        '竹叶青蛇':'一只让人看了起鸡皮疙瘩的竹叶青蛇。',
        '阳宗镇台夷商贩':'一个台夷妇女，背着个竹篓贩卖些丝织物品和手工艺品。',
        '采桑女':'一个年轻的摆夷采桑姑娘。',
        '阳宗镇采笋人':'一个壮年村民，住在数里外的村庄，背后背了个竹筐，手拿一把砍柴刀，上山来采竹笋。',
        '砍竹人':'一个壮年村民，住在山下的村落里，是上山来砍伐竹子的。',
        '养蚕女':'一个年轻的摆夷村妇，养蚕纺丝为生。',
        '纺纱女':'一个年轻的摆夷村妇，心灵手巧，专擅纺纱。',
        '老祭祀':'一个颇老朽的摆夷老人，穿戴齐整，是本村的祭司，权力颇大，相当于族长。',
    },

    '断剑山庄': {
        '黑袍老人':'一生黑装的老人。',
        '白袍老人':'一生白装的老人。',
        '和尚':'出了家的人，唯一做的事就是念经了。',
        '尼姑':'一个正虔诚念经的尼姑。',
        '摆渡老人':'一个饱经风霜的摆渡老人。',
        '天怒剑客':'他是独孤求败的爱徒，但他和师傅的性格相差极远。他从不苟言笑，他的脸永远冰冷，只因他已看透了世界，只因他杀的人已太多。他永远只在杀人的时候微笑，当剑尖穿过敌人的咽喉，他那灿烂的一笑令人感到温暖，只因他一向认为——死者无罪！',
        '任笑天':'这是一个中年男子。正静静地站着，双目微闭，正在听海！',
        '摘星老人':'他站在这里已经有几十年了。每天看天上划过的流星，已经完全忘记了一切……甚至他自己。',
        '落魄中年':'一位落魄的中年人，似乎是一位铁匠。',
        '栽花老人':'一个饱经风霜的栽花老人。',
        '背刀人':'此人背着一把生锈的刀，他似乎姓浪，武功深不可测。',
        '雁南飞':'这是一个绝美的女子，正在静静地望着天上的圆月。她的脸美丽而忧伤，忧伤得令人心碎。',
        '梦如雪':'这是一个寻梦的人。他已厌倦事实。他只有寻找曾经的梦，不知道这算不算是一种悲哀呢？',
        '剑痴':'他是剑痴，剑重要过他的生命。',
        '雾中人':'这个人全身都是模糊的，仿佛是一个并不真正存在的影子。只因他一生都生活在雾中，雾朦胧，人亦朦胧。',
        '独孤不败':'这就是一代剑帝独孤求败。独孤求败五岁练剑，十岁就已经罕有人能敌。被江湖称为剑术天才。',
    },

    '冰火岛': {
        '火麒麟王':'浑身充满灼热的气息，嘴巴可吐出高温烈焰，拥有强韧的利爪以及锋利的尖齿，是主宰冰火岛上的兽王。岛上酷热的火山地带便是他的领地，性格极其凶残，会将所看到闯入其领地的生物物焚烧殆尽。',
        '火麒麟':'磷甲刀枪不入，四爪孔武有力速度奇快。浑身能散发极高温的火焰，喜热厌冷，嗜好吞噬火山晶元。现居于冰焰岛火山一侧。',
        '麒麟幼崽':'火麒麟的爱子，生人勿近。',
        '游方道士':'一名云游四海的道士，头束白色发带，身上的道袍颇为残旧，背驮着一个不大的行囊，脸上的皱纹显示饱经风霜的游历，双目却清澈异常，仿佛包容了天地。',
        '梅花鹿':'一身赭黄色的皮毛，背上还有许多像梅花白点。头上岔立着的一双犄角，看上去颇有攻击性。行动十分机敏。',
        '雪狼':'毛色净白，眼瞳红如鲜血，牙齿十分锐利，身形巨大强壮，速度极快。天性狡猾，通常都是群体出动。',
        '白熊':'全身长满白色长毛，双爪极度锋利，身材颇为剽悍，十分嗜血狂暴。是冰焰岛上最强的猎食者。',
        '殷夫人':'此女容貌娇艳无伦，虽已过中年但风采依稀不减。为人任性长情，智计百出，武功十分了得。立场亦正亦邪。乃张五侠结发妻子，张大教主亲生母亲。',
        '张五侠':'在武当七侠之中排行第五，人称张五侠。虽人已过中年，但脸上依然俊秀。为人彬彬有礼，谦和中又遮不住激情如火的风发意气。可谓文武双全，乃现任张大教主的亲生父亲。',
        '赵郡主':'天下兵马大元帅汝阳王之女，大元第一美人。明艳不可方物，艳丽非凡，性格精灵俊秀，直率豪爽，对张大教主一往情深，为爱放弃所有与其共赴冰焰岛厮守终身。',
        '谢狮王':'他就是明教的四大护法之一的金毛狮王。他身材魁伟异常，满头金发散披肩头。但双目已瞎。在你面前一站，威风凛凛，真如天神一般。',
        '黑衣杀手':'穿着极其神秘的黑衣人，黑色的面巾遮住了他的面容。武功十分高强。',
        '杀手头目':'颇为精明能干。闪烁的双眼散发毋容置疑的威望。乃是这群不明来历黑衣人的统领头目。',
        '元真和尚':'此人武功极高，极富智谋，心狠手辣杀人如麻。因与前明教教主私怨而恼羞成怒，出家剃度意图挑拨江湖各大派，以达歼灭明教颠覆武林之目的。与谢狮王也有过一段不为人知的恩怨情仇。',
        '蓬面老头':'蓬头垢面，衣服千丝万缕，显然被关在这里已经很久了。',
    },

    '侠客岛': {
        '黄衣船夫':'这是个身着黄衣的三十几岁汉子，手持木桨，面无表情。',
        '侠客岛厮仆':'他是岛上的一个仆人，手底下似乎很有两下子。',
        '张三':'乃江湖传闻中赏善罚恶使者之一，其精明能干，为人大公无私。但平时大大咧咧表情十分滑稽。',
        '云游高僧':'一位云游四方的行者，风霜满面，行色匆匆，似乎正在办一件急事。',
        '王五':'他大约二十多岁，精明能干，笑嘻嘻的和蔼可亲。',
        '白衣弟子':'乃侠客岛龙岛主门下的一个弟子。身上穿着洗得发白的锦衣，头上带着秀才帽，一脸的书呆子气，怎麽看也不象是个武林中人。',
        '丁三':'一个鹤发童颜的老头，穿得荒诞不经，但看似武功十分了得。',
        '店小二':'位店小二正笑咪咪地忙著，还不时拿起挂在脖子上的抹布擦脸。',
        '侠客岛闲人':'他是岛上一个游手好闲的人。不怀好意。',
        '石公子':'这是一个年轻公子，面若中秋之月，色如春晓之花，鬓若刀裁，眉如墨画，鼻如悬胆，情若秋波，虽怒而时笑，即视而有情。',
        '书生':'他看过去像个落泊的书生，呆头呆脑的一付书呆子的样子。但只要你留心，你就发现他两眼深沉，而且腰挂一把长剑。',
        '丁当':'一个十七八岁的少女，身穿淡绿衫子，一张瓜子脸，秀丽美艳。',
        '白掌门':'他就是雪山剑派的掌门人，习武成性，自认为天下武功第一，精明能干，嫉恶如仇，性如烈火。',
        '马六':'他身材魁梧，圆脸大耳，笑嘻嘻地和蔼可亲。',
        '侠客岛弟子':'这是身材魁梧的壮汉，膀大腰圆，是岛主从中原招募来的。力气十分之大。',
        '李四':'身形甚高，但十分瘦削，留一撇鼠尾须，脸色阴沉。就是江湖传闻中赏善罚恶使者之一，其精明能干，但总是阴沉着脸。',
        '蓝衣弟子':'她是木岛主的女弟子，专管传授岛上弟子的基本功夫。',
        '童子':'这是一个十五六岁的少年，眉清目秀，聪明伶俐，深得岛主喜爱。',
        '龙岛主':'就是天下闻之色变的侠客岛岛主，号称“不死神龙”。他须眉全白，脸色红润，有如孩童。看不出他的实际年纪。',
        '木岛主':'他就是天下闻之色变的侠客岛岛主，号称“叶上秋露”。只见他长须稀稀落落，兀自黑多白少，但一张脸却满是皱纹。看不出他的实际年纪。',
        '侍者':'这是个身着黄衣的三十几岁汉子，垂手站立，面无表情。',
        '史婆婆':'她是雪山派白掌门的妻子，虽说现在人已显得苍老，但几十年前提起“江湖一枝花”史小妹来，武林中却是无人不知。',
        '矮老者':'此老身躯矮小，但气度非凡，令人不敢小窥。他与其师弟高老者闭关已久，江湖上鲜闻其名。武功之高，却令人震惊。',
        '高老者':'他身形高大硕状，满面红光。举止滑稽，带点傻气，武功却是极高。他因不常在江湖上露面，是以并非太多人知闻其名。',
        '谢居士':'他就是摩天崖的主人。是个亦正亦邪的高手，但信守承诺，年轻时好武成兴，无比骄傲，自认为天下第一。',
        '朱熹':'他是个精通诗理的学者，原本是被逼而来到侠客岛，但学了武功後死心塌地的留了下来。',
        '小猴子':'一只机灵的猴子，眼巴巴的看着你，大概想讨些吃的。',
        '樵夫':'一个一辈子以砍材为生的老樵夫，由于饱受风霜，显出与年龄不相称的衰老。',
        '医者':'一位白发银须的老者。据说当年曾经是江湖上一位著名的神医。但自从来到侠客岛上后，隐姓埋名，至今谁也不知道他真名是甚么了。他看起来懒洋洋的，你要是想请他疗伤的话恐怕不那么容易。',
        '石帮主':'为人忠厚老实，性情温和，天赋极高，记性极好。穿着一身破烂的衣服，却也挡不住他一身的英气。似乎身怀绝世武功。',
        '野猪':'这是一只凶猛的野猪，长得极为粗壮，嘴里还不断发出可怕的哄声。',
        '渔家男孩':'这是个渔家少年，大概由于长期在室外的缘故，皮肤已晒得黝黑，人也长得很粗壮了。',
        '渔夫':'看过去像个平平凡凡的渔夫，脸和赤裸的臂膀都晒得黑黑的。但只要你留心，你就发现他两眼深沉，而且腰挂一把长剑。',
        '渔家少女':'这是个渔家少女，虽然只有十二、三岁，但身材已经发育得很好了，眼睛水汪汪很是诱人。',
        '阅书老者':'一个精神矍烁的老者，他正手持书籍，稳站地上，很有姜太公之风。',
        '青年海盗':'一个青年海盗，颇为精壮，，眼角中展露出了凶相。',
        '老海盗':'一个年老的海盗，虽然胡子一大把了，但还是凶巴巴的。',
    },

    '绝情谷': {
        '土匪':'在山谷下烧伤抢掠的恶人。',
        '村民':'世代生活于此的人，每日靠着进山打打猎生活。',
        '野兔':'正在吃草的野兔。',
        '绝情谷弟子':'年纪不大，却心狠手辣，一直守候在绝情山庄。',
        '冰蛇':'身体犹如冰块透明般的蛇。',
        '千年寒蛇':'一条通体雪白的大蛇。',
        '天竺大师':'在绝情谷中研究怎么破解情花之毒的医学圣手。',
        '养花女':'照顾着绝情谷的花花草草的少女。',
        '侍女':'好色的绝情谷谷主从来劫来的少女。',
        '谷主夫人':'绝情谷上一任谷主的女儿，被现任谷主所伤，终日只得坐在轮椅之上。',
        '门卫':'这是个年富力强的卫兵，样子十分威严。',
        '绝情谷谷主':'好色、阴险狡诈的独眼龙。',
        '白衣女子':'一个宛如仙女般的白衣女子。',
        '采花贼':'声名狼藉的采花贼，一路潜逃来到了绝情谷。',
        '拓跋嗣':'鲜卑皇族后裔，自幼就表现出过人的军事天赋，十七岁时就远赴河套抗击柔然骑兵，迫使柔然不敢入侵。',
        '没藏羽无':'多权谋，善用计，所率西夏堂刺客素以神鬼莫测著称，让对头心惊胆战。',
        '野利仁嵘':'西夏皇族后裔，黑道威名赫赫的杀手头领，决策果断，部署周密，讲究战法，神出鬼没。',
        '嵬名元昊':'一副圆圆的面孔，炯炯的目光下，鹰勾鼻子耸起，刚毅中带着几分凛然不可侵犯的神态。中等身材，却显得魁梧雄壮，英气逼人。平素喜穿白色长袖衣，头戴黑色冠帽，身佩弓矢。此人城府心机深不可测，凭借一身最惊世骇俗的的锤法位居西夏堂最处尊居显之位，力图在天波杨门与燕云世家三方互相牵制各自鼎立态势下，为本门谋求最大之利益。',
        '雪若云':'身着黑色纱裙，面容精致秀美，神色冷若冰雪，嘴角却隐隐透出一股温暖的笑意。现在似是在被仇家围攻，已是身受重伤。',
        '养鳄人':'饲养鳄鱼的年轻汉子。',
        '鳄鱼':'悠闲的在鳄鱼潭边休息，看似人畜无害，但是无人敢靠近它们。',
        '囚犯':'被关押在暗无天日的地牢内，落魄的样子无法让你联想到他们曾是江湖好汉。',
        '地牢看守':'看守着地牢的武者，一脸严肃，不知道在想些什么。',
    },

    '碧海山庄': {
        '法明大师':'管理龙王殿的高僧，龙王殿大大小小的事物都是他在负责。',
        '僧人':'龙王殿僧人，负责每年祭祀龙王。',
        '隐士':'厌倦了这世间的纷纷扰扰，隐居于此的世外高人。',
        '野兔':'正在吃草的兔子。',
        '护卫':'他是一个身材高大的中年男子，看起来凶神恶煞，招惹不得。',
        '侍女':'打理碧海山庄上上下下的杂物。',
        '尹秋水':'她肌肤胜雪，双目犹似一泓清水，顾盼之际，自有一番清雅高华的气质，让人为之所摄、自惭形秽、不敢亵渎。但那冷傲灵动中颇有勾魂摄魄之态，又让人不能不魂牵蒙绕。',
        '养花女':'一位养花少女，她每天就是照顾这数也数不清的花。',
        '家丁':'碧海山庄的家丁。',
        '耶律楚哥':'出身契丹皇族，为人多智谋，善料敌先机，骑术了得，为大辽立下赫赫卓著战功。故而被奉为燕云世家之主。与天波杨门缠斗一生，至死方休。',
        '护卫总管':'身材瘦小，可是一身武艺超群，碧海山庄之内能胜他者不超过五人',
        '易牙传人':'一身厨艺已经傲世天下，煎、熬、燔、炙，无所不精。',
        '砍柴人':'碧海山庄所需木柴都由他来供给。',
        '独孤雄':'一个风程仆仆的侠客。',
        '王子轩':'碧海山庄少庄主，整日沉迷于一些稀奇古怪的玩意。',
        '王昕':'年过半百的中年男子，长相平庸，很难让人把他与碧海山庄庄主这个身份联想起来。',
    },

    '天山': {
        '周教头':'大内军教头，外表朴实无华，实则锋芒内敛。有着一腔江湖豪情。',
        '辛怪人':'性情古怪，不好交往，喜用新招，每每和对方对招之际，学会对方的招式，然后拿来对付对方，令到对方啼笑皆非。。是个狼养大的孩子，他很能打，打起来不要命，一个性情古怪的人，有着一段谜一样的过去。',
        '穆小哥':'一个只有十八九岁的小伙子，乐观豁达，无处世经验，对情感也茫然无措，擅长进攻，变化奇快。',
        '牧民':'这是一位边塞牧民，正在驱赶羊群。',
        '塞外胡兵':'一副凶神恶煞的长相，来自塞外。以掳掠关外牧民卫生。',
        '胡兵头领':'手持一根狼牙棒，背负一口长弓。身材高大，面目可憎。',
        '乌刀客':'他就是名动江湖的乌老大，昔日曾谋反童姥未遂而被囚禁于此。',
        '波斯商人':'这是一位来自波斯的商人，经商手段十分高明。',
        '贺好汉':'乃行走江湖的绿林好汉，脾气极为暴躁。',
        '铁好汉':'邱莫言重金雇佣的绿林好汉，贺兰山草寇。缺乏主见，使一柄没有太多特色的单刀，虽是为财而来，却也不失为江湖义士',
        '刁屠夫':'乃龙门客栈屠夫，此人凭借常年累月的剔骨切肉练就一身好刀法。',
        '金老板':'龙门客栈老板娘，为人八面玲珑。左手使镖，右手使刀，体态婀娜多姿，妩媚泼辣。',
        '韩马夫':'一位憨直的汉子，面容普通，但本性古道热肠，有侠义本色。',
        '蒙面女郎':'这是个身材娇好的女郎，轻纱遮面，一双秀目中透出一丝杀气。',
        '武壮士':'他身穿一件藏蓝色古香缎夹袍，腰间绑着一根青色蟒纹带，一头暗红色的发丝，有着一双深不可测眼睛，体型挺秀，当真是风度翩翩飒爽英姿。',
        '程首领':'她是「灵柩宫」九天九部中钧天部的副首领',
        '菊剑':'这是个容貌姣好的女子，瓜子脸蛋，眼如点漆，清秀绝俗。',
        '石嫂':'她是[灵柩宫]的厨师。',
        '兰剑':'这是个容貌姣好的女子，瓜子脸蛋。',
        '符针神':'她是「灵柩宫」九天九部中阳天部的首领她号称「针神」',
        '梅剑':'她有着白皙的面容，犹如梅花般的亲丽脱俗，堆云砌黑的浓发，整个人显得妍姿俏丽惠质兰心。',
        '竹剑':'这是个容貌姣好的女子，瓜子脸蛋，眼如点漆，清秀绝俗。你总觉得在哪见过她',
        '余婆':'她是「灵柩宫」九天九部中昊天部的首领。她跟随童姥多年，出生入死，饱经风霜。',
        '九翼':'他是西夏一品堂礼聘的高手，身材高瘦，脸上总是阴沉沉的他轻功极高，擅使雷公挡，凭一手雷公挡功夫，成为江湖的一流高手。',
        '天山死士':'是掌门从武林掳掠天资聪明的小孩至天山培养的弟子，自小就相互厮杀，脱颖而出者便会成为天山死士，只听命于掌门一人，倘若有好事者在天山大动干戈，他将毫不犹豫的将对方动武，至死方休。',
        '天山大剑师':'弃尘世而深居天山颠峰，数十年成铸剑宗师，铸成七把宝剑。此七把剑代表晦明大师在天山上经过的七个不同剑的境界。',
        '护关弟子':'这是掌门最忠心的护卫，武功高深莫测。正用警惕的眼光打量着你',
        '楚大师兄':'有“塞外第一剑客”之称、“游龙一出，万剑臣服”之勇。性傲、极度自信、重情重义、儿女情长，具有英雄气盖，但容易感情用事，做事走极端。乃天山派大师兄。',
        '傅奇士':'一个三绺长须、面色红润、儒冠儒服的老人，不但医术精妙，天下无匹，而且长于武功，在剑法上有精深造诣。除此之外，他还是书画名家。',
        '杨英雄':'一个有情有义的好男儿，他武功高强大义凛然，乃天山派二师兄。',
        '胡大侠':'因其武功高强神出鬼没。在江湖上人送外号「雪山飞狐」。他身穿一件白色长衫，腰间别着一把看起来很旧的刀。他满腮虬髯，根根如铁，一头浓发，却不结辫。',

    },
    '苗疆': {
        '温青':'此人俊秀异常，个性温和有风度，喜好游历山水是一位姿态优雅的翩翩君子',
        '苗村长':'这是本村的村长，凡是村里各家各户，老老少少的事他没有不知道的。',
        '苗家小娃':'此娃肥肥胖胖，走路一晃一晃，甚是可爱。',
        '苗族少年':'一个身穿苗族服饰的英俊少年。',
        '苗族少女':'一个身穿苗族服饰的妙龄少女。',
        '田嫂':'一个白皙丰满的中年妇人．',
        '金背蜈蚣':'一条三尺多长，张牙舞爪的毒蜈蚣。',
        '人面蜘蛛':'一只面盆大小，长着人样脑袋的大蜘蛛。',
        '吸血蜘蛛':'一只拳头大小，全身绿毛的毒蜘蛛。',
        '樵夫':'一位面色黑红，悠然自得的樵夫．',
        '蓝姑娘':'此女千娇百媚，风韵甚佳，声音娇柔宛转，荡人心魄。年龄约莫二十三四岁。喜欢养毒蛇，能炼制传说中苗族人的蛊毒，还善于配置各种剧毒。喜欢吹洞箫，口哨也很好。',
        '莽牯朱蛤':'一只拳头大小，叫声洪亮的毒蛤蟆。',
        '阴山天蜈':'一条三寸多长，长有一双翅膀剧毒蜈蚣。',
        '食尸蝎':'一条三尺来长，全身铁甲的毒蝎子。',
        '蛇':'一条七尺多长，手腕般粗细的毒蛇。十分骇人。',
        '五毒教徒':'一个五毒的基层教徒，看来刚入教不久。',
        '沙护法':'他就是五毒教的护法弟子，身材魁梧，方面大耳。在教中转管招募教众，教授弟子们的入门功夫。',
        '五毒弟子':'五毒教一个身体强壮的苗族青年，看来武功已小由所成。',
        '毒郎中':'一位身穿道服，干瘪黑瘦的中年苗人．',
        '白鬓老者':'一个须发皆白的老者，精神矍铄，满面红光。',
        '何长老':'她就是五毒教的长老，教主的姑姑。随然是教主的长辈，但功夫却是一块跟上代教主学的。据说她曾经被立为教主继承人，但后来犯下大错，所以被罚到此处面壁思过，以赎前罪。她穿着一身破旧的衣衫，满脸疤痕，长得骨瘦如柴，双目中满是怨毒之色。',
        '毒女':'年纪约20岁，冷艳绝伦，背景离奇，混身是毒，外号毒女曼陀罗，涉嫌下毒命案，其实她是个十分善良的女子。与铁捕快有一段缠绵悱恻的爱情，花耐寒而艳丽。',
        '潘左护法':'他就是五毒教的左护法，人称笑面阎罗。别看他一脸笑眯眯的，但是常常杀人于弹指之间，一手五毒钩法也已达到登峰造极的境界。',
        '大祭司':'乃苗疆最为德高望重的祭师。但凡祭祀之事皆是由其一手主持。',
        '岑秀士':'他就是五毒教的右护法，人称五毒秀士。经常装扮成一个白衣秀士的模样，没事总爱附庸风雅。',
        '齐长老':'他就是五毒教的长老，人称锦衣毒丐。乃是教主的同门师兄，在教中一向飞扬跋扈，大权独揽。他长的身材魁梧，面目狰狞，身穿一件五彩锦衣，太阳穴高高坟起。',
        '五毒护法':'乃帮主的贴身护法，为人忠心耿耿，武艺深不可测。帮主有难时，会豁尽全力以护佑她人身安全。',
        '何教主':'你对面的是一个一身粉红纱裙，笑靥如花的少女。她长得肌肤雪白，眉目如画，赤着一双白嫩的秀足，手脚上都戴着闪闪的金镯。谁能想到她就是五毒教的教主，武林人士提起她无不胆颤心惊。',

    },
    '白帝城': {
        '白衣弟子':'身穿白衣的青年弟子，似乎身手不凡，傲气十足。',
        '守门士兵':'身穿白帝城军服的士兵。',
        '白衣士兵':'身穿白衣的士兵，正在街上巡逻。',
        '文将军':'白帝城公孙氏的外戚，主要在紫阳城替白帝城防御外敌。',
        '粮官':'负责管理紫阳城的粮仓的官员。',
        '练武士兵':'正在奋力操练的士兵。',
        '近身侍卫':'公孙将军的近身侍卫，手执长剑。',
        '公孙将军':'公孙氏的一位将军，深受白帝信任，被派到紫阳城担任守城要务。',
        '白衣少年':'身穿白帝城统一服饰的少年，长相虽然一般，但神态看起来有点傲气。',
        '李峰':'精神奕奕的中年汉子，看起来非常自信。',
        '李白':'字太白，号青莲居士，又号“谪仙人”，他拿着一壶酒，似乎醉醺醺的样子。',
        '“妖怪”':'一个公孙氏的纨绔弟子，无聊得假扮妖怪到处吓人。',
        '庙祝':'一个风程仆仆的侠客。',
        '狱卒':'一个普通的狱卒，似乎在这发呆。',
        '白帝':'现任白帝，乃公孙氏族长，看起来威严无比，在他身旁能感受到不少压力。',
        '李巡':'白发苍苍的老头，貌似是李峰的父亲。',
        '镇长':'白发苍苍的镇长，看起来还挺精神的。',
    },
    '墨家机关城': {
        '墨家弟子':'一声正气禀然的装束，乃天下间心存侠义之人仰慕墨家风采而成为其中一员。',
        '索卢参':'此人乃墨子学生，为人特别诚恳，因此被指派负责接待外宾司仪一职。',
        '高孙子':'为墨子的学生，口才十分了得。故而负责机关城与外界联系。',
        '燕丹':'此人乃前朝皇族，灭国之后投身到墨家麾下四处行侠仗义神秘莫测。',
        '荆轲':'墨家绝顶刺客，剑法在墨家中出类拔萃，为人慷慨侠义。备受墨家弟子所敬重。',
        '庖丁':'一名憨厚开朗的大胖子，其刀法如神，是个烧遍天下美食的名厨。',
        '治徒娱':'为墨子的学生，有过目不忘之才数目分明之能，因此在节用市坐镇负责机关城资源调配。',
        '大博士':'对天下学术有着极高造诣的宗师，主管墨家学说的传承。',
        '高石子':'此人乃墨子的学生，深受墨子欣赏。曾经当过高官，现主管墨家日常政务。',
        '县子硕':'此人乃墨子学生，与高何一样无恶不作，后师从墨子，收心敛性，专职培养墨家人才。',
        '魏越':'为墨子的学生，此人天敏而好学，时常不耻下问，因此被墨子钦点在此顾守书籍。',
        '黑衣人':'一身蒙面黑衣，鬼鬼祟祟，不知是何人。',
        '徐夫子':'墨家最优秀的铸匠，毕生致力精研铸剑术，很多名震天下的神兵利刃皆是出自他手。',
        '屈将子':'此人乃资深航海师，墨家麾下的殸龙船便是由其掌控。',
        '偷剑贼':'身穿黑色夜行衣，举手投足之间尽显高手风范，实力不容小觑。',
        '高何':'此人乃墨子学生，面相凶神恶煞，因而负责机关城的安全事务。',
        '随师弟':'随巢子的师弟，因犯事被暂时关于此地。',
        '大匠师':'铸艺高超的墨家宗师，主管墨家兵器打造。',
        '随巢子':'此人乃墨子的学生，沉迷于打造大型机关兽，木鸢便是出自其手。',
        '鲁班':'机关术的专家，以善于发明各种机关而闻名。木匠出身，在机关术上有着天人一般的精湛技艺。如今不知为何来到墨家机关城。',
        '曹公子':'早年曾质疑墨子之道，后被博大精深的墨家机关术所折服，专职看守天工坞。',
        '耕柱子':'为墨子的学生，此人天资异禀，但骄傲自满，因此被墨子惩罚到兼爱祠看管。',
        '墨子':'墨家的开山祖师，以一人之力开创出机关流派，须眉皆白，已不知其岁数几何，但依然满脸红光，精神精神焕发。',
        '公尚过':'墨子的弟子，深得墨子器重，为人大公无私，现主管墨家的检察维持门内秩序。',
    },
    '掩月城': {
        '佩剑少女':'两个年方豆蔻的小女孩，身上背着一把短剑，腰间系着一块『出云』玉牌，脸上全是天真烂漫。',
        '野狗':'一条低头啃着骨头的野狗。',
        '执定长老':'出云阁四大长老之一，负责出云庄在城中的各种日常事务，也带一些难得下山的年轻小弟子来城中历练。虽表情严肃，却深受晚辈弟子的喜爱。',
        '醉酒男子':'一名喝得酩酊大醉的男子，看起来似是个浪荡的公子哥。',
        '仆人':'富家公子的仆人，唯唯诺诺地跟在身后。',
        '紫衣仆从':'身着紫衣的侍从，不像是青楼守卫，却更有豪门王府门卫的气派。',
        '候君凛':'一名中年男子，虽是平常侠客打扮，却颇有几分朝廷中人的气度。',
        '轻纱女侍':'一名身着轻纱的女子，黛眉轻扫，红唇轻启，嘴角勾起的那抹弧度仿佛还带着丝丝嘲讽。眼波一转。流露出的风情让人忘记一切。',
        '抚琴女子':'身着红衣的抚琴少女，红色的外袍包裹着洁白细腻的肌肤，她偶尔站起走动，都要露出细白水嫩的小腿。脚上的银铃也随着步伐轻轻发出零零碎碎的声音。纤细的手指划过古朴的琵琶。令人骚动的琴声从弦衫流淌下来。',
        '女官人':'犹怜楼的女主事，半老徐娘，风韵犹存。',
        '黑纱舞女':'一个在大厅中间舞台上表演的舞女，身着黑纱。她玉足轻旋，在地上留下点点画痕，水袖乱舞，沾染墨汁勾勒眼里牡丹，裙摆旋舞，朵朵莲花在她脚底绽放，柳腰轻摇，勾人魂魄，暗送秋波，一时间天地竞相为此美色而失色羞愧。可谓是丝竹罗衣舞纷飞！',
        '小厮':'楼里的小厮，看起来乖巧得很。',
        '梅映雪':'一名英姿飒爽的女剑客，身手非凡，负责把守通向后院的小路。',
        '舞眉儿':'犹怜楼内最善舞的女子，云袖轻摆招蝶舞、纤腰慢拧飘丝绦。她似是一只蝴蝶翩翩飞舞、一片落叶空中摇曳，又似是丛中的一束花、随着风的节奏扭动腰肢。若有若无的笑容始终荡漾在她脸上，清雅如同夏日荷花。',
        '寄雪奴儿':'一条从西域带来的波斯猫。',
        '琴楚儿':'女子长长的秀发随着绝美的脸庞自然垂下，月光下，长发上似乎流动着一条清澈的河流，直直泻到散开的裙角边，那翠色欲流的玉箫轻轻挨着薄薄的红唇，萧声凄美苍凉。她的双手洁白无瑕，轻柔的流动在乐声中，白色的衣裙，散落的长发，流离凄美。她眉宇间，忧伤像薄薄的晨雾一样笼罩着。没有金冠玉饰，没有尊贵华杉。她却比任何人都美。',
        '华衣女子':'衣着华贵的女子，年纪尚轻，身上似藏有一些秘密。',
        '赤髯刀客':'一名面向粗旷威武的刀客，胡髯全是火红之色，似是钟馗一般。',
        '老乞丐':'衣衫破烂却不污秽的老乞丐，身上有八个口袋，似是丐帮净衣八袋弟子。',
        '马帮弟子':'漠北马帮的得力弟子。',
        '养马小厮':'这是客栈门口负责为客人牵马喂马的小厮。',
        '客栈掌柜':'卧马客栈的大掌柜的。',
        '店小二':'一个跑前跑后的小二，忙得不可开交。',
        '蝮蛇':'当地特有的毒蛇，嘶嘶地发出警告，你最好不要靠近。',
        '东方秋':'一名年青剑客，腰插一块显是王府内的令牌，让人对其身份产生了好奇。',
        '函谷关官兵':'这是镇守函谷关的官兵，在渡口侦探敌情。',
        '函谷关武官':'函谷关统兵武官，驻守渡口监视着敌人的动向。',
        '长刀敌将':'这是一名手持长刀的敌将。',
        '穿山甲':'这是一只穿山甲。',
        '黑衣老者':'一个表情凶狠的黑衣老者，你最好还是不要招惹他。',
        '六道禅师':'曾经的武林禅宗第一高手，武功修为极高，内力深厚，一身真气护体的功夫，寻常人难以企及。',
        '雪若云':'这是无影楼长老雪若云，此刻正在榻上打坐静养。',
        '火狐':'这是一只红色皮毛的狐狸。',
        '黄鹂':'这是一只黄鹂鸟儿，吱吱呀呀地唱着。',
        '夜攸裳':'一个来自波斯国的女子，看似穿着华裙，内中却是劲衣。头上扎着一个侧髻，斜插着一支金玉双凤钗。',
        '云卫':'这是守卫出云庄大门的守卫，气度不凡。',
        '云将':'这是统管出云庄护卫的将领，龙行虎步，神威凛凛。',
        '女眷':'这是出云庄的女眷，虽为女流，却精通武艺。',
        '制甲师':'这是一个顶尖的制造甲胄的大师。',
        '试剑士':'这是一个试炼各式兵器和器械的武士。',
        '莫邪传人':'这是一个顶尖的铸炼天匠，据传曾是莫邪的弟子。',
        '老仆':'一名忠心耿耿的老仆人，一言不发地守在公子身后。',
        '狄啸':'这是一个能征战四方的将军，出云庄的得力大将。',
        '青云仙子':'这是一个游历四方的道姑，姿态飘逸，身负古琴，能成为出云庄的客人，怕也是来头不小。',
        '秦东海':'是出云庄的主人，也是出云部军队的大统帅。身穿狮头麒麟铠，腰佩神剑。',
        '执剑长老':'这是出云庄四大长老之一的执剑长老，负责传授庄中武士的武艺，其一身武功之高自是不在话下。',
        '执法长老':'这是出云庄四大长老之一的执法长老，负责庄中的法规制度的执行，严肃公正，一丝不苟。',
        '执典长老':'这是出云庄四大长老之一的执典长老，负责维护管理庄中重要的典籍和秘书。',
        '野兔':'这是一只灰耳白尾的野兔',
        '老烟杆儿':'一名白发苍苍的老人，手持一柄烟杆儿。',
        '杂货脚夫':'一个负责运送日常杂货的脚夫。',
        '短衫剑客':'一个身着短衫，利落干净的剑客。',
        '巧儿':'一个聪明伶俐，娇小可爱的小丫头。',
        '骑牛老汉':'一个黑衫华发的老人，腰佩长剑。',
        '青牛':'一头通体泛青，健硕无比的公牛。',
        '书童':'一名年不及二八的小书童，身上背着书篓。',
        '赤尾雪狐':'一只通体雪白，尾稍赤红如火的狐狸。',
        '泥鳅':'一条乌黑油亮的小泥鳅，在溪水中畅快地游着。',
        '灰衣血僧':'一个满面煞气，身着灰色僧袍，手持大环刀的中年恶僧。',
        '白鹭':'一只羽毛如雪的白鹭，双翅一展有丈许，直欲振翅上九天而去。',
        '青衫女子':'一名身着青衫，头戴碧玉簪的年青女子。手里拿着一支绿色玉箫。',
        '樊川居士':'百年难得一出的天纵英才，诗文当世无二，其诗雄姿英发。而人如其诗，个性张扬，如鹤舞长空，俊朗飘逸。',
        '无影暗侍':'这是一个无影楼守门的侍卫，全身黑衣，面带黑纱。',
        '琴仙子':'一个身着朴素白裙，满头青丝垂下的少女，手指轻动，天籁般的琴音便流淌而出。琴声之间还包含了极深的内力修为。',
        '百晓居士':'这是一个江湖事无所不晓的老头，总是一副若有所思的样子。',
        '清风童子':'这是无影楼的小侍童。',
        '刀仆':'这是天刀宗师的仆人，忠心耿耿。',
        '天刀宗师':'一个白发老人，身形挺拔，传说这是二十年前突然消失于武林的天下第一刀客。',
        '虬髯长老':'这是无影阁四大长老之一的虬髯公，满面赤色的虬髯，腰间一把帝王之剑。',
        '行脚贩子':'这是一个远道而来的商人，满面风尘。',
        '农家少妇':'附近农家的新婚妇人，一边带着孩子，一边浣洗着衣服。',
        '六婆婆':'年长的妇女，总忍不住要善意地指导一下年轻女孩们的家务。',
        '青壮小伙':'在井边打水的健壮少年，浑身都是紧实的肌肉，总是在有意无意之间展示着自己的力量。',
        '店老板':'马车店老板，年近不惑。',
        '白衣弟子':'出云庄的年轻弟子，第一次来到市集，看什么都是新鲜。',
        '黑衣骑士':'穿着马靴的黑衣少年，似是在维持市场的秩序。',
        '青衫铁匠':'一个深藏不露的铁匠，据说能打出最上乘的武器。',
        '牧民':'一个风霜满面却面带微笑的中年男子。',
        '青鬃野马':'野外的空阔辽远，青鬃马扬起鬃毛，收腰扎背，四蹄翻飞，跨阡度陌，跃丘越壑，尽情地奔驰在自由的风里。',
        '小马驹':'出生不足一年的小马驹，虽不知其名，但显是有着极纯正优秀的血统，世人皆说风花牧场尽收天下名驹，此言非虚。',
        '的卢幼驹':'额上有白点，通体黝黑的神骏幼驹。',
        '乌骓马':'通体黑缎子一样，油光放亮，唯有四个马蹄子部位白得赛雪。乌骓背长腰短而平直，四肢关节筋腱发育壮实，这样的马有个讲头，名唤“踢雪乌骓”。',
        '绛衣剑客':'一名身着绛色短衫的剑客，太阳穴微微鼓起，显是有着极强内力修为。',
        '白衣公子':'手持折扇，白衣飘飘的俊美公子，似是女扮男装。',
        '老仆':'一名忠心耿耿的老仆人，一言不发地守在公子身后。',
        '秦惊烈':'一个身高七尺的伟岸男子，腰里挂着弯刀，明明是满脸虬髯，脸上却总是带着温和的微笑。',
        '千小驹':'一个年近弱冠的小孩子，身着皮袄，手拿小鞭，自幼在牧场长大，以马驹为名，也极善与马儿相处，据说他能听懂马儿说话。',
        '小马驹儿':'一只刚出生不久的小马驹，虽步行踉跄，却也已能看出纯种烈血宝马的一二分风采。',
        '牧羊犬':'牧民们的牧羊犬，威风凛凛，忠心耿耿。',
        '追风马':'中原诸侯梦寐以求的军中良马，可日行六百，四蹄翻飞，逐风不休。',
        '诸侯秘使':'一个来求购良马的使者，不知道哪个诸侯派出，身份隐秘。',
        '赤菟马':'人中吕布，马中赤兔，如龙如神，日行千里，红影震慑千军阵！',
        '风如斩':'风花牧场上最好的牧人之一，左耳吊坠是一只狼王之齿，腰间的马刀也是功勋赫赫！',
        '爪黄飞电':'据说是魏武帝最爱的名驹，体型高大，气势磅礴，万马之中也可一眼看出。',
        '黑狗':'一条牧场上的黑狗，汪汪地冲你叫着。',
        '照夜玉狮子':'此马天下无双，通体上下，一色雪白，没有半根杂色，浑身雪白，传说能日行千里，产于西域，是极品中的极品。',
        '鲁总管':'风花牧场的总管，上上下下的诸多事情都归他打理，内务外交都会经他之手。他却一副好整以暇的样子，似是经纬尽在掌握。',
        '风花侍女':'风花牧场的侍女，虽名义上都是仆从，但却神色轻松，喜笑颜开，和主人管事们都亲热非常。',
        '灰耳兔':'一只白色的兔子，耳朵却是灰色。',
        '白狐':'一只通体雪白的小狐狸，在树洞里伸出头来看着你。',
        '小鹿':'一只满身梅花的小鹿，抬起头看着你。',
        '天玑童子':'天玑楼里的小童子，身穿青衫，头系蓝色发带。',
    },
    '海云镇':{
        '马夫':'这是一个等候主人的马夫，耐心地打扫着马车。',
        '野狗':'一只浑身脏兮兮的野狗',
        '老镇长':'这是海云镇的镇长，平日里也没啥事情可管，便拿着个烟袋闲逛。',
        '烟袋老头':'一个显然有着不低功夫底子的老头子，手拿一个烟袋。',
        '青年女子':'一个青年女剑客，年方二八，身姿矫健。',
        '背枪客':'这是一个青年武士，背后背着一把亮银长枪。',
        '小孩':'这是海云镇的一个小孩子，年方五六岁，天真烂漫。',
        '野兔':'正在吃草的兔子。',
        '游客':'这是一个游客，背着手享受着山海美景。',
        '青年剑客':'这是一个青年剑客，眼含剑气。',
        '九纹龙':'这是海云阁四大杀手之一的九纹龙，凶狠非常。',
        '蟒蛇':'一只昂首直立，吐着长舌芯的大蟒蛇。',
        '暗哨':'这是海云阁的暗哨，身穿平常的布衣，却掩饰不了眼神里的狡黠和敏锐。',
        '石邪王':'据说这曾是武林魔道名门掌门，其武学造诣也是登峰造极。',
        '穿山豹':'这事海云阁四大杀手之一的穿山豹，行动敏捷，狡黠异常。',
        '地杀':'这是一名海云阁高级杀手。',
        '天杀':'这是一名海云阁高级杀手。',
        '海东狮':'这是海云阁四大杀手之首的海东狮，近十年来从未失手，手底已有数十个江湖名门掌门的性命。',
        '海云长老':'这是海云阁内的长老级杀手。',
        '红纱舞女':'这是一个身着轻纱的舞女，穿着轻薄，舞姿极尽媚态，眉目轻笑之间却隐含着淡淡的杀气。',
        '青纱舞女':'这是一个身着轻纱的舞女，穿着轻薄，舞姿极尽媚态，眉目轻笑之间却隐含着淡淡的杀气。',
        '紫纱舞女':'这是一个身着轻纱的舞女，穿着轻薄，舞姿极尽媚态，眉目轻笑之间却隐含着淡淡的杀气。',
        '白纱舞女':'这是一个身着轻纱的舞女，穿着轻薄，舞姿极尽媚态，眉目轻笑之间却隐含着淡淡的杀气。',
        '六如公子':'这是一个隐士，武学修为极高，也似乎并不受海云阁辖制。',
        '萧秋水':'传闻他出自天下第一名门浣花剑派，却无人知晓他的名讳。',
        '啸林虎':'这事海云阁四大杀手之一的啸林虎，武功极高。',
        '陆大刀':'江湖南四奇之首，人称仁义陆大刀。',
        '水剑侠':'江湖南四奇之一，外号叫作“冷月剑”',
        '乘风客':'江湖南四奇之一，外号叫作“柔云剑”。',
        '血刀妖僧':'「血刀圣教」掌门人，自称「武林第一邪派高手」，门下都作和尚打扮，但个个都是十恶不赦的淫僧。',
        '花铁枪':'江湖南四奇之一，外号叫作“中平枪”',
        '狄小侠':'其貌不扬，但却有情有义，敢爱敢恨，性格鲜明。',
        '水姑娘':'白衫飘飘，样貌清秀俏丽，人品俊雅，嫉恶如仇。',
        '虬髯犯人':'这人满脸虬髯，头发长长的直垂至颈，衣衫破烂不堪，简直如同荒山中的野人',
    }
};
//-----------
function isContains(str, substr) {
    return str.indexOf(substr) >= 0;
}
//通用代码----------------------------------------------------------------
//颜色去除
function ys_replace(a){
    a =a.replace(/\u001b.*?m|\u001b\d{1,2}\u001b|\u0003/g, "");
    return a;
}
//go函数
var Player = {scounter:0}
var isDelayCmd = 1,	// 是否延迟命令
    cmdCache = [],		// 命令池
    cmd = null,         //当前命令
    cmd_stop = 0,    //等待
    cmd_room = null,    //当前房间
    cmd_roomb = null,    //之前房间
    cmd_room1 = null,    //yell目的地
    cmd_room2 = null,    //event目的地
    cmd_target = null,    //目标npc
    cmd_target_id = null, //npc的id
    cmdBack = [],       //命令池备份
    timeCmd = null,		// 定时器句柄
    cmdDelayTime = 150,	// 命令延迟时间
    cmdDelayTime1 = 100;
// 执行命令串
function go(str) {
    var arr = str.split(";");
    if (isDelayCmd && cmdDelayTime) {
        // 把命令存入命令池中
        cmdCache = cmdCache.concat(arr);

        // 当前如果命令没在执行则开始执行
        if (!timeCmd) delayCmd();
    } else {
        for (var i = 0; i < arr.length; i++) clickButton(arr[i]);
    }
}

// 执行命令池中的命令
function delayCmd() {
    if(g_gmain.is_fighting){
        cmd_go();
        return 0;
    }
    var r = g_obj_map.get("msg_room");
    if(cmd_stop==0){
        cmd = cmdCache.shift();
        if(cmd.indexOf('jh')!=-1){
            cmdBack = [];
            cmdBack.push(cmd);
        }else{
            cmdBack.push(cmd);
        }
        if(cmd.indexOf('-')!=-1){
            if(cmd.indexOf('yell')!=-1){
                cmd_room1 = cmd.split('-')[1];
                cmd = cmd.split('-')[0];
                cmd_roomb = r.get('short').replace(/\u001b.*?m|\u001b\d{1,2}\u001b/g, "");
                clickButton(cmd);
                cmd_stop = 1;
            }
            if(cmd.indexOf('event')!=-1){
                cmd_room2 = cmd.split('-')[1];
                cmd = cmd.split('-')[0];
                cmd_roomb = r.get('short').replace(/\u001b.*?m|\u001b\d{1,2}\u001b/g, "");
                clickButton(cmd);
                cmd = 'event';
                cmd_stop = 1;
            }
            if(cmd.indexOf('kill')!=-1 || cmd.indexOf('fight')!=-1 || cmd.indexOf('ask')!=-1){
                cmd_target = cmd.split('-')[1];
                cmd = cmd.split('-')[0];
                cmd_stop = 1;
            }
        }else{
            clickButton(cmd);
        }
    }else{
        cmd_room = r.get('short').replace(/\u001b.*?m|\u001b\d{1,2}\u001b/g, "");
        switch(cmd){
            case 'yell':{
                if(cmd_room1 == cmd_room){
                    cmd_room1 = null;
                    cmd_stop = 0;
                }
            };break;
            case 'event':{
                if(cmd_room == cmd_room2){
                    cmd_room2 = null;
                    cmd_stop = 0;
                }else if(cmd_room != cmd_roomb){
                    cmdCache = cmdBack.concat(cmdCache);
                    cmd_room2 = null;
                    cmd_stop = 0;
                }else{
                    clickButton(cmd);
                }
            };break;
            case 'kill':;
            case 'fight':{
                if(cmd_target_id){
                    if(g_obj_map.get("msg_combat_result")){
                        if( all_npc.contains(g_obj_map.get("msg_combat_result").get('fail_uid').split(',')[0]) ){
                            cmd_target = null;
                            cmd_target_id = null;
                            cmd_stop = 0;
                        }
                    }
                }else{
                    cmd_target_id = fj_npc(cmd_target);
                    if(cmd_target_id){
                        clickButton(cmd + ' '+ cmd_target_id);
                    }
                }
            };break;
            case 'ask':{
                cmd_target_id = fj_npc(cmd_target);
                if(cmd_target_id){
                    clickButton(cmd + ' '+ cmd_target_id);
                    cmd_stop = 0;
                }
            };break;
        }
    }
    cmd_go();
}
function cmd_go(){
    // 如果命令池还有命令，则延时继续执行
    if (cmdCache.length > 0 || cmd_stop ==1) {
        timeCmd = setTimeout(delayCmd, cmdDelayTime);
    }else{
        // 没有命令 则归零
        timeCmd = 1;
        setTimeout(function(){
            if(cmdCache.length == 0)
                timeCmd=0;
            else
                delayCmd();
        },cmdDelayTime);
    }
}

// 停止执行
function stopDelayCmd() {
    // 清除计时器
    clearTimeout(timeCmd);

    // 归零计时器
    timeCmd = 0;

    // 清除命令池
    cmdCache = [];
}

//界面函数--------------------------
//按钮设置项
function BtnList(currentPos,right){
    this.type = {};
    this.list = {};
    this.num = 0;
    this.type.buttonWidth = '100px';// 按钮宽度
    this.type.buttonHeight = '20px';// 按钮高度
    this.type.currentPos = currentPos;// 当前按钮距离顶端高度
    this.type.right = right;//距离右边的距离
    this.type.delta = 25;// 每个按钮间隔
}
var anniu_weizhi_right=-32;
var anniu_pianyi= 30
//创建按钮函数
function createButton(btnName,func,btnList){
    if(btnList.list[btnName]){return;}
    btnList.list[btnName]=document.createElement('button');
    var myBtn = btnList.list[btnName];
    myBtn.innerText = btnName;
    myBtn.style.position = 'absolute';
    myBtn.style.right = btnList.type.right +'%';
    myBtn.style.top = btnList.type.currentPos +btnList.type.delta*btnList.num + 'px';
    myBtn.style.width = btnList.type.buttonWidth;
    myBtn.style.height = btnList.type.buttonHeight;
    myBtn.className = 'myBtn';
    myBtn.addEventListener('click', func);
    btnList.num++;
    // 按钮加入窗体中
    document.body.appendChild(myBtn);
}

String.prototype.trim = function (char, type) { // 去除字符串中，头部或者尾部的指定字符串
    if (char) {
        if (type == 'left') {
            return this.replace(new RegExp('^\\'+char+'+', 'g'), '');
        } else if (type == 'right') {
            return this.replace(new RegExp('\\'+char+'+$', 'g'), '');
        }
        return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
}
var Jianshi = {sys:1,renwu:0,zhengxie:0,teshu:0,tf:0,yx:0,gw:0,hd:0,qx:0,qxmj:0,qxhg:0,gensha:0};
var task = 'test';
(function (window) {
    window.go = function(dir) {
        console.debug("开始执行：", dir);
        var d = dir.split(";");
        for (var i = 0; i < d.length; i++)
            clickButton(d[i], 0);
    };



    function PlayerStatue(){
        this.dispatchMessage = function(b){
        }
    }

    //find_clan_quest_road clan scene ---clan task---  find_family_quest_road go_family恭喜你完成师门任务 find_task_road xxxxx谜题寻路
    function Renwu(){
         this.dispatchMessage = function(b){
            var type = b.get("type"), subType = b.get("subtype");
            var msg = b.get('msg');
            if(type == 'main_msg' && Jianshi.renwu ==1){
                if(msg.indexOf('find_task_road')!=-1){
                    //谜题任务
                    Jianshi.task_type = 1;
                    var g1 = ys_replace(msg).match(/find_task_road [\x00-\xff]+/g);
                    var g2 = ys_replace(msg).match(/find_task_road2 [\x00-\xff]+/g);
                    var g3 = ys_replace(msg).match(/find_task_road3 [\x00-\xff]+/g);
                    if(g1){
                        go(g1[0]);
                    }else if(g2){
                        go(g2[0]);
                    }else if(g3){
                        go(g3[0]);
                    }
                }
                if(msg.indexOf('find_clan_quest_road')!=-1){
                    go('find_clan_quest_road');
                    Jianshi.task_type = 2;
                }
                if(msg.indexOf('clan scene')!=-1 || msg.indexOf('clan task')!=-1){
                    go('clan scene;clan task');
                }
                //师门任务
                if(msg.indexOf('find_family_quest_road')!=-1){
                    go('find_family_quest_road');
                    Jianshi.task_type = 3;
                }
                if(msg.indexOf('family')!=-1 && msg.indexOf('继续领取任务')!=-1){
                    go('go_family;family_quest');
                }
                if(msg.indexOf('find')!=-1){
                    task = g_simul_efun.replaceControlCharBlank(msg.replace(/\u0003.*?\u0003/g, ""));
                    do_task(task);
                }else if(msg.indexOf('完成谜题')!=-1){
                    task = null;
                }
            }
            if(type =='main_msg' && Jianshi.gensha == 1){
                //你对著进香客喝道：「老匹夫！今日不是你死就是我活！」
                if(msg.indexOf('今日不是你死就是我活')!=-1){
                    msg = ys_replace(msg);
                    var kill = msg.match(/(.*)对著(.*)喝道：「(.*)！今日不是你死就是我活！」/)[2];
                    killTarget([kill],'');
                }
            }
            if(Jianshi.xuanhong >0 ){
                if(type == 'main_msg'){
                    msg = g_simul_efun.replaceControlCharBlank(msg.replace(/\u0003.*?\u0003/g, ""));
                    if(msg.indexOf('江湖悬红榜')!=-1){
                        var xh = msg.match('『(.*)』的『(.*)』');
                        var xh1 = xh[1],xh2 = xh[2];
                        $.each(xhts[xh1],function(key,val){
                            if(val.indexOf(xh2)!=-1){
                                InforOutFunc(key);
                                Jianshi.xhnpc.push(key);
                                if(hairsfalling[xh1][key]){
                                    dhgo(hairsfalling[xh1][key]);
                                };
                            }
                        })
                    }
                }else if(type == 'notice'){
                    msg = g_simul_efun.replaceControlCharBlank(msg.replace(/\u0003.*?\u0003/g, ""));
                    if(msg.indexOf('【江湖悬红榜】任务已完成。')!=-1){
                        Jianshi.xhnpc = []
                        go('jh 1;w;event_1_40923067;event_1_40923067');
                    }
                }
            }
            //正邪
            if(type == 'main_msg' && Jianshi.zhengxie >0 ){
                msg = g_simul_efun.replaceControlCharBlank(msg);
                if(msg.match(/这是你今天完成的第(.*)\/10场正邪之战！/)){
                    clickButton('home')
                }
            }
            //恶棍对著刘守财喝道：「老匹夫！今日不是你死就是我活！」
            if(type == 'main_msg' && Jianshi.zhengxie ==1 ){
                msg = g_simul_efun.replaceControlCharBlank(msg);
                if(msg.match(/(.*)对著(.*)喝道：/)){
                    var zx = msg.match(/(.*)对著(.*)喝道：/);
                    if(zx[1]=='段老大'||zx[1]=='二娘'){
                        killTarget(['二娘','段老大'],'eren');
                    }
                }
            }
            if(type == 'main_msg' && Jianshi.zhengxie ==2 ){
                msg = g_simul_efun.replaceControlCharBlank(msg);
                if(msg.match(/(.*)对著(.*)喝道：/)){
                    var zx = msg.match(/(.*)对著(.*)喝道：/);
                    if(zx[1] == '云老四'){
                        negativeKill([zx[2]],'bad_target');
                    }
                }
            }
        }
    }
    var renwu = new Renwu;

    function QinglongMon() {
        this.dispatchMessage = function(b) {
            var type = b.get("type"), subType = b.get("subtype");
            var msg;
            if (type == "channel" && subType == "sys" && Jianshi.sys ==1) {
                msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
                //青龙--------------
                if(Jianshi.ql ==1){
                    if(msg.indexOf('[新区]') == -1 && msg.indexOf('跨服时空武林广场')!=-1 ){
                        console.log(msg);
                        var qf = msg.match(/跨服：(.*)逃到了跨服时空武林广场(.*)之中，青龙会组织悬赏(.*)惩治恶人，众位英雄快来诛杀。这是第(.*)个/);
                    }
                    if(msg.indexOf('本区第') !=-1){
                        console.log(msg);
                        var bf = msg.match(/青龙会组织：(.*)正在(.*)施展力量，本会愿出(.*)的战利品奖励给本场战斗的最终获胜者。这是本区第(.*)个青龙/);
                        if(arrayCotains(allEquipment,bf[3]) == 1){
                            playWarn();
                            console.log(msg);
                            qinglongGo(ql_p[bf[2]]);
                        }
                    }
                    if(msg.indexOf('跨服青龙')!=-1 && msg.indexOf('青龙会组织：[36-40区]') != -1){
                        console.log(msg);
                        //【系统】青龙会组织：[66-70区]流寇正在杂货铺施展力量，本会愿出水羽云裳碎片的战利品奖励给本场战斗的最终获胜者。这是本大区第28个跨服青龙。
                        var bq = msg.match(/【系统】青龙会组织：\[36-40区\](.*)正在(.*)施展力量，本会愿出(.*)的战利品奖励给本场战斗的最终获胜者。这是本大区第(.*)个跨服青龙。/);
                        playWarn();
                        qinglongGo(ql_p[bq[2]])
                        InforOutFunc(msg);
                    }
                    if(msg.indexOf('跨服青龙')!=-1 && msg.indexOf('跨服：[36-40区]') != -1){
                        var bq = msg.match(/跨服：\[36-40区\](.*)逃到了跨服时空(.*)之中，青龙会组织悬赏(.*)惩治恶人，众位英雄快来诛杀。这是本大区第(.*)个跨服青龙/);
                        playWarn();
                        go('change_server world');
                        InforOutFunc(msg);
                        setTimeout(function(){qinglongGo(ql_p[bq[2]])},2000);
                    }
                }
                //【系统】【醉梦销魂】：各位大侠请知晓了，我醉梦楼的寒碧翠仙子此刻心情大好，小舞一曲以飨同好。座位有限，请速速前来。
                //盈散花 寒碧翠 薄昭如
                if(Jianshi.gw == 1 && msg.indexOf('醉梦销魂') != -1){
                    var gw = msg.match(/【醉梦销魂】：各位大侠请知晓了，我醉梦楼的(.*)仙子此刻心情大好，小舞一曲以飨同好。座位有限，请速速前来。/)[1];
                    switch(gw){
                        case '盈散花':go('event_1_5392021 go');InforOutFunc(gw+' 攻');break;
                        case '寒碧翠':clickButton('event_1_48561012 go');InforOutFunc(gw+' 血');break;
                        case '薄昭如':go('event_1_29896809 go');InforOutFunc(gw+' 内');break;
                        default:InforOutFunc(gw);
                    }
                    playWarn();
                }
                //『大快朵颐』：天子赐福，传出御厨珍馐美味，六盘热气腾腾，香味扑鼻的狮子头，请各位大侠速速赶往光明顶，武当山，扬州，晚月庄，唐门，洛阳赴宴。
                if(Jianshi.hd == 1 ){
                    if(msg.indexOf('大快朵颐') != -1){
                        console.log(msg);
                        var cy = msg.match(/『大快朵颐』：天子赐福，传出御厨珍馐美味，六盘热气腾腾，香味扑鼻的(.*)，请各位大侠速速赶往(.*)，(.*)，(.*)，(.*)，(.*)，(.*)赴宴。/);
                        playWarn();
                    }
                }
                if(Jianshi.yx == 1){
                    if(msg.indexOf('游侠') != -1){
                        msg = msg.replace(/\u001b.*?m|\u001b\d{1,2}\u001b/g, "")
                        var yxnpc = msg.match(/【系统】游侠会：听说(.*?)出来闯荡江湖了，目前正在前往(.*?)的路上。/)[1];
                        var yxdd = msg.match(/游侠会：听说(.*)出来闯荡江湖了，目前正在前往(.*)的路上。/)[2];
                        InforOutFunc(msg)
                        playWarn();
                        yx_go([yxnpc],yxdd);
                    }
                }
                if(Jianshi.tf == 1){
                    if(msg.indexOf('慌不择路，逃往了') != -1){
                        msg = msg.replace(/\u001b.*?m|\u001b\d{1,2}\u001b/g, "");
                        var name =msg.match(/【系统】(.*)慌不择路，逃往了(.*)-/)[1];
                        if(name=='二娘'|| name =='[36-40区]段老大'){
                            var tfdd = msg.match(/【系统】(.*)慌不择路，逃往了(.*)-/)[2];
                            dhgo(hairsfalling[tfdd][tfdd]);
                            playWarn();
                        }
                    }
                }
                //正邪-------------------------
                //二娘对着柳绘心叫道：喂，小娘皮！想要消灾赶紧掏钱，要不然老子可不客气了！
                //流寇不怀好意地对着柳小花笑道：哟~小妞陪大爷我玩玩吧~
                if(Jianshi.zhengxie >0 ){
                    if(msg.indexOf('哟~小妞陪大爷我玩玩吧~')!=-1){
                        var zx = msg.match(/【系统】(.*)不怀好意地对着(.*)笑道/);
                        if(Jianshi.zhengxie ==1){
                            if(zx[1]=='二娘'||zx[1]=='段老大'){
                                qinglongGo(zhengxie_p[zx[2]]);
                            }
                        }else if(Jianshi.zhengxie ==2){
                            if(zx[1]=='云老四'){
                                qinglongGo(zhengxie_p[zx[2]]);
                            }
                        }
                    }
                    if(msg.indexOf('想要消灾赶紧掏钱，要不然老子可不客气了！')!=-1){
                        zx = msg.match(/【系统】(.*)对着(.*)叫道/);
                        if(Jianshi.zhengxie ==1){
                            if(zx[1]=='二娘'||zx[1]=='段老大'){
                                qinglongGo(zhengxie_p[zx[2]]);
                            }
                        }else if(Jianshi.zhengxie == 2){
                            if(zx[1]=='云老四'){
                                qinglongGo(zhengxie_p[zx[2]]);
                            }
                        }
                    }
                }
                //特殊正邪---------------------
                //【系统】百毒旗主对着黑袍公叫道：混世斧王，今天你可是在我的地盘，看来你是在劫难逃！
                //【系统】巫蛊王对着云观海叫道：云大侠，今天你可是在我的地盘，看来你是在劫难逃！
                //【系统】夜千麟对着翼国公叫道：翼将军，今天你可是在我的地盘，看来你是在劫难逃！
                //【系统】十方恶神对着独孤须臾叫道：独孤大侠，今天你可是在我的地盘，看来你是在劫难逃！
                if(Jianshi.teshu>0){
                    if(msg.indexOf('看来你是在劫难逃！')!=-1){
                        playWarn();
                        var ts = msg.match(/【系统】(.*)对着(.*)叫道：(.*)，今天你可是在我的地盘，看来你是在劫难逃！/);
                        switch(ts[2]){
                            case '云观海':clickButton('n');if(Jianshi.teshu ==1){clickButton('kill changan_yunguanhai1')}else if(Jianshi.teshu ==2){clickButton('kill changan_wuguwang')};break;
                            case '黑袍公':clickButton('w');if(Jianshi.teshu ==1){clickButton('kill changan_heipaogong1')}else if(Jianshi.teshu ==2){clickButton('kill changan_baiduqizhu')};break;
                            case '独孤须臾':clickButton('e');if(Jianshi.teshu ==1){clickButton('kill changan_duguxuyu1')}else if(Jianshi.teshu ==2){clickButton('kill changan_shifangeshen')};;break;
                            case '翼国公':clickButton('s');if(Jianshi.teshu ==1){clickButton('kill changan_yiguogong1')}else if(Jianshi.teshu ==2){clickButton('kill changan_yeqianlin')};;break;
                            default:;
                        }
                    }
                    if(msg.indexOf('这不是找死吗？')!=-1){
                        var t = msg.match(/【系统】(.*)：哈哈，挑战我的(.*)？这不是找死吗？/);
                        switch(t[2]){
                            case '万蛊堂':go('s;clan bzmt puzz');break;
                            case '百毒池':go('e;clan bzmt puzz');break;
                            case '十恶殿':go('w;clan bzmt puzz');break;
                            case '千蛇窟':go('n;clan bzmt puzz');break;
                            default:;
                        }
                    }
                    if(msg.indexOf('多谢大侠相助！感激不尽！')!=-1){
                        var zs = msg.match(/【系统】(.*)：多谢大侠相助！感激不尽！/);
                        switch(zs[1]){
                            case '云观海':go('s;clan bzmt puzz');break;
                            case '黑袍公':go('e;clan bzmt puzz');break;
                            case '独孤须臾':go('w;clan bzmt puzz');break;
                            case '翼国公':go('n;clan bzmt puzz');break;
                            default:;
                        }
                    }
                }

                if(Jianshi.zhuguo ==1){
                    if(msg.indexOf('[新区]') == -1 && msg.indexOf('跨服时空武林广场')!=-1 ){
                        console.log(msg);
                        var zg = msg.match(/跨服：(.*)逃到了跨服时空武林广场(.*)之中，青龙会组织悬赏(.*)惩治恶人，众位英雄快来诛杀。这是第(.*)个/);
                        if(arrayCotains([Zhanlong,Yintian,Qihua],zg[3]) == 1){
                            console.log(msg);
                            if($('.outtitle').children().text().indexOf('武林广场')==-1){
                                go('change_server world');
                                setTimeout(function(){clickButton('home');},2000)
                            }
                        }
                    }
                }
            }

        }
    }

    //**奇侠秘境 xxx对你悄声道：------------------
    function QXWhisper(){
        this.dispatchMessage=function(b){
            var type = b.get("type"), subtype = b.get("subType");
            if(Jianshi.qx>0){
                if(type=="notice"){
                    var msg = ys_replace(b.get("msg"));
                    if (msg.match(/(.*)对你悄声道：你现在去(.*)，应当会有发现/)!=null){
                        var qx=msg.match(/(.*)对你悄声道：你现在去(.*)，应当会有发现/);
                        qx_stop = 1;
                        Jianshi.qxmj++;
                        dhgo(hairsfalling['奇侠秘境'][qx[2]]);
                    }
                }
                else if(type=="main_msg"){
                    var msg = ys_replace(b.get("msg"));
                    if(msg.indexOf('今日亲密度操作次数')!=-1){
                        Jianshi.qxhg = parseInt(msg.match(/今日亲密度操作次数\((.*)\/20/)[1]);
                        if(qx_stop =2){
                            qx_stop = 0;
                        }
                    }
                }
            }
        }
    }

    var whipser=new QXWhisper;

    //破招
    var pzts =['(.*)这一招正好击向了你的破绽！','你一不留神，招式被(.*)所破！','(.*)将招式连成一片，令你眼花缭乱！','你的招式尽数被(.*)所破！','(.*)(往|对准|直指|刺向|指向)你的(.*)','(.*)(向|直指|直取|纵使|攻击)你(.*)','(.*)你(已是|愕然间|被|根本)(.*)'];
    Jianshi.pzjs = 0;
    function PozhaoTest(){
        this.dm = function(b){
            var type = b.get('type'),subtype = b.get('subtype');
            if(Jianshi.pozhao ==1){
                if(subtype =='ready_skill'){

                }
                if(subtype =='text'){
                    var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
                    for(var i =0;i<pzts.length;i++){
                        if(msg.match(pzts[i])){
                            Jianshi.pzjs = 1;
                            //console.log(msg);
                        }
                    }
                }
            }
        }
    }

    var pzt = new PozhaoTest;

    var zhengxie_p = {
        '柳绘心': 1,
        '王铁匠': 2,
        '杨掌柜': 3,
        '客商': 4,
        '红娘': 5,
        '柳小花': 6,
        '卖花姑娘': 7,
        '刘守财': 8,
        '方老板': 9,
        '朱老伯': 10,
        '方寡妇': 11
    }

    var qlMon = new QinglongMon;

    var ql_p = {
        '书房': 1,
        '打铁铺子': 2,
        '桑邻药铺': 3,
        '南市': 4,
        '桃花别院': 5,
        '绣楼': 6,
        '北大街': 7,
        '钱庄': 8,
        '杂货铺': 9,
        '祠堂大门': 10,
        '厅堂': 11
    };

    function qinglongGo(x) {
        switch(x){
            case 1:go("jh 1;e;n;e;e;e;e;n");break;
            case 2:go("jh 1;e;n;n;w");break;
            case 3:go("jh 1;e;n;n;n;w");break;
            case 4:go("jh 2;n;n;e");break;
            case 5:go("jh 2;n;n;n;n;w;s");break;
            case 6:go("jh 2;n;n;n;n;w;s;w");break;
            case 7:go("jh 2;n;n;n;n;n;n;n");break;
            case 8:go("jh 2;n;n;n;n;n;n;;n;e");break;
            case 9:go("jh 3;s;s;e");break;
            case 10:go("jh 3;s;s;w");break;
            case 11:go("jh 3;s;s;w;n");break;
        }
    }


    function MyMap(){
        this.elements = [];
        this.size = function() {
            return this.elements.length
        };
        this.isEmpty = function() {
            return 1 > this.elements.length
        };
        this.clear = function() {
            this.elements = []
        };
        this.put = function(a, b) {
            for (var c = !1, d = 0; d < this.elements.length; d++)
                if (this.elements[d].key == a) {
                    c = !0;
                    this.elements[d].value = b;
                    break
                }
            !1 == c && this.elements.push({
                key: a,
                value: b
            })
        };
        this.remove = function(a) {
            var b = !1;
            try {
                for (var c = 0; c < this.elements.length; c++)
                    if (this.elements[c].key == a)
                        return this.elements.splice(c, 1), !0
            } catch (d) {
                b =
                    !1
            }
            return b
        };
        this.get = function(a) {
            try {
                for (var b = 0; b < this.elements.length; b++)
                    if (this.elements[b].key == a)
                        return this.elements[b].value
            } catch (c) {
                return null
            }
        };
        this.copy = function(a) {
            null == a && (a = new Map);
            try {
                for (var b = 0; b < this.elements.length; b++)
                    a.put(this.elements[b].key, this.elements[b].value);
                return a
            } catch (c) {
                return null
            }
        };
        this.element = function(a) {
            return 0 > a || a >= this.elements.length ? null : this.elements[a]
        };
        this.containsKey = function(a) {
            var b = !1;
            try {
                for (var c = 0; c < this.elements.length; c++)
                    if (this.elements[c].key ==
                        a) {
                        b = !0;
                        break
                    }
            } catch (d) {
                b = !1
            }
            return b
        };
        this.containsValue = function(a) {
            var b = !1;
            try {
                for (var c = 0; c < this.elements.length; c++)
                    if (this.elements[c].value == a) {
                        b = !0;
                        break
                    }
            } catch (d) {
                b = !1
            }
            return b
        };
        this.values = function() {
            for (var a = [], b = 0; b < this.elements.length; b++)
                a.push(this.elements[b].value);
            return a
        };
        this.keys = function() {
            for (var a = [], b = 0; b < this.elements.length; b++)
                a.push(this.elements[b].key);
            return a
        }
    }

    function Question() {
        this.answers = new MyMap;
        this.answers.put("锦缎腰带是腰带类的第几级装备", "a");
        this.answers.put("扬州询问黑狗子能到下面哪个地点", "a");
        this.answers.put("跨服天剑谷每周六几点开启", "a");
        this.answers.put("青城派的道德经可以提升哪个属性", "c");
        this.answers.put("论剑中以下哪个不是晚月庄的技能", "d");
        this.answers.put("跨服天剑谷是星期几举行的", "b");
        this.answers.put("玉女剑法是哪个门派的技能", "b");
        this.answers.put("玉草帽可以在哪位npc那里获得？", "b");
        this.answers.put("逍遥林是第几章的地图", "c");
        this.answers.put("精铁棒可以在哪位npc那里获得", "d");
        this.answers.put("鎏金缦罗是披风类的第几级装备", "d");
        this.answers.put("神雕大侠在哪一章", "a");
        this.answers.put("华山武器库从哪个NPC进", "d");
        this.answers.put("首冲重置卡需要隔多少天才能在每日充值奖励中领取", "b");
        this.answers.put("以下哪个不是空空儿教导的武学", "b");
        this.answers.put('“迎梅客栈”场景是在哪个地图上', "d");
        this.answers.put('独孤求败有过几把剑', "d");
        this.answers.put('晚月庄的小贩在下面哪个地点', "a");
        this.answers.put('扬州询问黑狗能到下面哪个地点', "a");
        this.answers.put('“清音居”场景是在哪个地图上', "a");
        this.answers.put('一天能完成师门任务有多少个', "c");
        this.answers.put('林祖师是哪个门派的师傅', "a");
        this.answers.put('九区服务器名称', "d");
        this.answers.put('去唐门地下通道要找谁拿钥匙', "a");
        this.answers.put('能增容貌的是下面哪个技能', "a");
        this.answers.put('铁手镯  可以在哪位npc那里获得', "a");
        this.answers.put('街头卖艺是挂机里的第几个任务', "a");
        this.answers.put('“三清宫”场景是在哪个地图上', "c");
        this.answers.put('论剑中以下哪个是大理段家的技能', "a");
        this.answers.put('藏宝图在哪里npc那里买', "a");
        this.answers.put('六脉神剑是哪个门派的绝学', "a");
        this.answers.put('如何将华山剑法从400级提升到440级', "d");
        this.answers.put('王重阳是哪个门派的师傅', "b");
        this.answers.put('在庙祝处洗杀气每次可以消除多少点', "a");
        this.answers.put('以下哪个宝石不能镶嵌到衣服', "a");
        this.answers.put('达摩杖的伤害是多少', "d");
        this.answers.put('嫁衣神功是哪个门派的技能', "b");
        this.answers.put('可以召唤金甲伏兵助战是哪个门派', "a");
        this.answers.put('端茶递水是挂机里的第几个任务', "b");
        this.answers.put('下列哪项战斗不能多个玩家一起战斗', "a");
        this.answers.put('寒玉床在哪里切割', "a");
        this.answers.put('拜师风老前辈需要正气多少', "b");
        this.answers.put('每天微信分享能获得多少元宝', "d");
        this.answers.put('丐帮的绝学是什么', "a");
        this.answers.put('以下哪个门派不是隐藏门派', "c");
        this.answers.put('玩家想修改名字可以寻找哪个NPC', "a");
        this.answers.put('论剑中以下哪个不是古墓派的的技能', "b");
        this.answers.put('安惜迩是在那个场景', "c");
        this.answers.put('神雕侠侣的时代背景是哪个朝代', "d");
        this.answers.put('论剑中以下哪个是华山派的技能的', "a");
        this.answers.put('夜皇在大旗门哪个场景', "c");
        this.answers.put('什么装备可以镶嵌紫水晶', "c");
        this.answers.put('乌檀木刀可以在哪位npc那里获得', "d");
        this.answers.put('易容后保持时间是多久', "a");
        this.answers.put('以下哪个不是宋首侠教导的武学', "d");
        this.answers.put('踏云棍可以在哪位npc那里获得', "a");
        this.answers.put('玉女剑法是哪个门派的技能', "b");
        this.answers.put('根骨能提升哪个属性', "c");
        this.answers.put('论剑中以下哪个是铁血大旗门的技能', "b");
        this.answers.put('明教的九阳神功有哪个特殊效果', "a");
        this.answers.put('辟邪剑法在哪学习', "b");
        this.answers.put('论剑中古墓派的终极师傅是谁', "d");
        this.answers.put('论剑中青城派的终极师傅是谁', "d");
        this.answers.put('逍遥林怎么弹琴可以见到天山姥姥', "b");
        this.answers.put('论剑一次最多能突破几个技能', "c");
        this.answers.put('劈雳拳套有几个镶孔', "a");
        this.answers.put('仓库最多可以容纳多少种物品', "b");
        this.answers.put('以下不是天宿派师傅的是哪个', "c");
        this.answers.put('易容术在哪学习', "b");
        this.answers.put('瑷伦在晚月庄的哪个场景', "b");
        this.answers.put('羊毛斗篷是披风类的第几级装备', "a");
        this.answers.put('弯月刀可以在哪位npc那里获得', "b");
        this.answers.put('骆云舟在乔阴县的哪个场景', "b");
        this.answers.put('屠龙刀是什么级别的武器', "a");
        this.answers.put('天蚕围腰可以镶嵌几颗宝石', "d");
        this.answers.put('“蓉香榭”场景是在哪个地图上', "c");
        this.answers.put('施令威在哪个地图', "b");
        this.answers.put('扬州在下面哪个地点的npc处可以获得玉佩', "c");
        this.answers.put('拜师铁翼需要多少内力', "b");
        this.answers.put('九区服务器名称', "d");
        this.answers.put('"白玉牌楼"场景是在哪个地图上', "c");
        this.answers.put('宝玉鞋在哪获得', "a");
        this.answers.put('落英神剑掌是哪个门派的技能', "b");
        this.answers.put('下面哪个门派是正派', "a");
        this.answers.put('兑换易容面具需要多少玄铁碎片', "c");
        this.answers.put('以下哪些物品是成长计划第五天可以领取的', "b");
        this.answers.put('论剑中以下哪个是晚月庄的人物', "a");
        this.answers.put('论剑中以下哪个不是魔教的技能', "a");
        this.answers.put('匕首加什么属性', "c");
        this.answers.put('钢丝甲衣可以在哪位npc那里获得', "d");
        this.answers.put('论剑中花紫会的师傅是谁', "c");
        this.answers.put('暴雨梨花针的伤害是多少', "c");
        this.answers.put('吸血蝙蝠在下面哪个地图', "a");
        this.answers.put('论剑中以下是峨嵋派技能的是哪个', "a");
        this.answers.put('蓝止萍在晚月庄哪个小地图', "b");
        this.answers.put('下面哪个地点不是乔阴县的', "d");
        this.answers.put('领取消费积分需要寻找哪个NPC', "c");
        this.answers.put('下面哪个不是门派绝学', "d");
        this.answers.put('人物背包最多可以容纳多少种物品', "a");
        this.answers.put('什么装备不能镶嵌黄水晶', "d");
        this.answers.put('古灯大师在大理哪个场景', "c");
        this.answers.put('草帽可以在哪位npc那里获得', "b");
        this.answers.put('西毒蛇杖的伤害是多少', "c");
        this.answers.put('成长计划六天可以领取多少银两', "d");
        this.answers.put('朱老伯在华山村哪个小地图', "b");
        this.answers.put('论剑中以下哪个是唐门的技能', "b");
        this.answers.put('游龙散花是哪个门派的阵法', "d");
        this.answers.put('高级乾坤再造丹加什么', "b");
        this.answers.put('唐门的唐门毒经有哪个特殊效果', "a");
        this.answers.put('葛伦在大招寺的哪个场景', "b");
        this.answers.put('“三清殿”场景是在哪个地图上', "b");
        this.answers.put('哪样不能获得玄铁碎片', "c");
        this.answers.put('在哪里捏脸提升容貌', "d");
        this.answers.put('论剑中以下哪个是天邪派的技能', "b");
        this.answers.put('向师傅磕头可以获得什么', "b");
        this.answers.put('骆云舟在哪一章', "c");
        this.answers.put('论剑中以下哪个不是唐门的技能', "c");
        this.answers.put('华山村王老二掉落的物品是什么', "a");
        this.answers.put('下面有什么是寻宝不能获得的', "c");
        this.answers.put('寒玉床需要切割多少次', "d");
        this.answers.put('绿宝石加什么属性', "c");
        this.answers.put('魏无极处读书可以读到多少级', "a");
        this.answers.put('天山姥姥在逍遥林的哪个场景', "d");
        this.answers.put('天羽奇剑是哪个门派的技能', "a");
        this.answers.put('大招寺的铁布衫有哪个特殊效果', "c");
        this.answers.put('挖剑冢可得什么', "a");
        this.answers.put('灭绝师太在峨眉山哪个场景', "a");
        this.answers.put('论剑是星期几举行的', "c");
        this.answers.put('柳淳风在雪亭镇哪个场景', "b");
        this.answers.put('萧辟尘在哪一章', "d");
        this.answers.put('论剑中以下哪个是明教的技能', "b");
        this.answers.put('天邪派在哪里拜师', "b");
        this.answers.put('钨金腰带是腰带类的第几级装备', "d");
        this.answers.put('灭绝师太在第几章', "c");
        this.answers.put('一指弹在哪里领悟', "b");
        this.answers.put('翻译梵文一次多少银两', "d");
        this.answers.put('刀法基础在哪掉落', "a");
        this.answers.put('黯然消魂掌有多少招式', "c");
        this.answers.put('黑狗血在哪获得', "b");
        this.answers.put('雪蕊儿在铁雪山庄的哪个场景', "d");
        this.answers.put('东方教主在魔教的哪个场景', "b");
        this.answers.put('以下属于正派的门派是哪个', "a");
        this.answers.put('选择武学世家会影响哪个属性', "a");
        this.answers.put('寒玉床睡觉一次多久', "c");
        this.answers.put('魏无极在第几章', "a");
        this.answers.put('孙天灭是哪个门派的师傅', "c");
        this.answers.put('易容术在哪里学习', "a");
        this.answers.put('哪个NPC掉落拆招基础', "a");
        this.answers.put('七星剑法是哪个门派的绝学', "a");
        this.answers.put('以下哪些物品不是成长计划第二天可以领取的', "c");
        this.answers.put('以下哪个门派是中立门派', "a");
        this.answers.put('黄袍老道是哪个门派的师傅', "c");
        this.answers.put('舞中之武是哪个门派的阵法', "b");
        this.answers.put('隐者之术是那个门派的阵法', "a");
        this.answers.put('踏雪无痕是哪个门派的技能', "b");
        this.answers.put('以下哪个不是在雪亭镇场景', "d");
        this.answers.put('排行榜最多可以显示多少名玩家', "a");
        this.answers.put('貂皮斗篷是披风类的第几级装备', "b");
        this.answers.put('武当派的绝学技能是以下哪个', "d");
        this.answers.put('兰花拂穴手是哪个门派的技能', "a");
        this.answers.put('油流麻香手是哪个门派的技能', "a");;
        this.answers.put('披星戴月是披风类的第几级装备', "d");
        this.answers.put('当日最低累积充值多少元即可获得返利', "b");
        this.answers.put('追风棍在哪里获得', "b");
        this.answers.put('长剑在哪里可以购买', "a");
        this.answers.put('莫不收在哪一章', "a");
        this.answers.put('读书写字最高可以到多少级', "b");
        this.answers.put('哪个门派拜师没有性别要求', "d");
        this.answers.put('墨磷腰带是腰带类的第几级装备', "d");
        this.answers.put('不属于白驼山的技能是什么', "b");
        this.answers.put('婆萝蜜多心经是哪个门派的技能', "b");
        this.answers.put('乾坤一阳指是哪个师傅教的', "a");
        this.answers.put('“日月洞”场景是在哪个地图上', "b");
        this.answers.put('倚天屠龙记的时代背景哪个朝代', "a");
        this.answers.put('八卦迷阵是哪个门派的阵法', "b");
        this.answers.put('七宝天岚舞是哪个门派的技能', "d");
        this.answers.put('断云斧是哪个门派的技能', "a");
        this.answers.put('跨服需要多少级才能进入', "c");
        this.answers.put('易容面具需要多少玄铁兑换', "c");
        this.answers.put('张教主在明教哪个场景', "d");
        this.answers.put('玉蜂浆在哪个地图获得', "a");
        this.answers.put('在逍遥派能学到的技能是哪个', "a");
        this.answers.put('每日微信分享可以获得什么奖励', "a");
        this.answers.put('红宝石加什么属性', "b");
        this.answers.put('金玉断云是哪个门派的阵法', "a");
        this.answers.put('正邪任务一天能做几次', "a");
        this.answers.put('白金戒指可以在哪位npc那里获得', "b");
        this.answers.put('金戒指可以在哪位npc那里获得', "d");
        this.answers.put('柳淳风在哪哪一章', "c");
        this.answers.put('论剑是什么时间点正式开始', "a");
        this.answers.put('黯然销魂掌是哪个门派的技能', "a");
        this.answers.put('在正邪任务中不能获得下面什么奖励', "d");
        this.answers.put('孤儿出身增加什么', "d");
        this.answers.put('丁老怪在天宿海的哪个场景', "b");
        this.answers.put('读书写字301-400级在哪里买书', "c");
        this.answers.put('闯楼第几层可以获得称号“藏剑楼长老”', "c");
        this.answers.put('以下属于邪派的门派是哪个', "b");
        this.answers.put('论剑中以下哪个不是丐帮的人物', "a");
        this.answers.put('论剑中青城派的第一个师傅是谁', "a");
        this.answers.put('以下哪个不是何不净教导的武学', "c");
        this.answers.put('吕进在哪个地图', "a");
        this.answers.put('拜师老毒物需要蛤蟆功多少级', "a");
        this.answers.put('蛇形刁手是哪个门派的技能', "b");
        this.answers.put('乌金玄火鞭的伤害是多少', "d");
        this.answers.put('张松溪在哪个地图', "c");
        this.answers.put('欧阳敏是哪个门派的', "b");
        this.answers.put('以下哪个门派是正派', "d");
        this.answers.put('成功易容成异性几次可以领取易容成就奖', "b");
        this.answers.put('论剑中以下不是峨嵋派技能的是哪个', "b");
        this.answers.put('城里抓贼是挂机里的第几个任务', "b");
        this.answers.put('每天的任务次数几点重置', "d");
        this.answers.put('莲花掌是哪个门派的技能', "a");
        this.answers.put('大招寺的金刚不坏功有哪个特殊效果', "a");
        this.answers.put('多少消费积分可以换取黄金钥匙', "b");
        this.answers.put('什么装备都能镶嵌的是什么宝石', "c");
        this.answers.put('什么影响打坐的速度', "c");
        this.answers.put('蓝止萍在哪一章', "c");
        this.answers.put('寒玉床睡觉修炼需要多少点内力值', "c");
        this.answers.put('武穆兵法通过什么学习', "a");
        this.answers.put('倒乱七星步法是哪个门派的技能', "d");
        this.answers.put('闯楼第几层可以获得称号“藏剑楼护法”', "b");
        this.answers.put('兽皮鞋可以在哪位npc那里获得', "b");
        this.answers.put('寒玉床在那个地图可以找到', "a");
        this.answers.put('易容术可以找哪位NPC学习', "b");
        this.answers.put('铁戒指可以在哪位npc那里获得', "a");
        this.answers.put('通灵需要寻找哪个NPC', "c");
        this.answers.put('功德箱在雪亭镇的哪个场景', "c");
        this.answers.put('蓝宝石加什么属性', "a");
        this.answers.put('每天分享游戏到哪里可以获得20元宝', "a");
        this.answers.put('选择书香门第会影响哪个属性', "b");
        this.answers.put('以下哪个不是微信分享好友、朋友圈、QQ空间的奖励', "a");
        this.answers.put('新手礼包在哪领取', "c");
        this.answers.put('春风快意刀是哪个门派的技能', "b");
        this.answers.put('朱姑娘是哪个门派的师傅', "a");
        this.answers.put('出生选武学世家增加什么', "a");
        this.answers.put('以下哪个宝石不能镶嵌到内甲', "a");
        this.answers.put('生死符的伤害是多少', "a");
        this.answers.put('扬文的属性', "a");
        this.answers.put('云问天在哪一章', "a");
        this.answers.put('首次通过桥阴县不可以获得那种奖励', "a");
        this.answers.put('剑冢在哪个地图', "a");
        this.answers.put('在哪里消杀气', "a");
        this.answers.put('闯楼每多少层有称号奖励', "a");
        this.answers.put('打坐增长什么属性', "a");
        this.answers.put('从哪个npc处进入跨服战场', "a");
        this.answers.put('下面哪个是天邪派的师傅', "a");
        this.answers.put('每天能做多少个谜题任务', "a");
        this.answers.put('小男孩在华山村哪里', "a");
        this.answers.put('追风棍可以在哪位npc那里获得', "a");
        this.answers.put('逍遥派的绝学技能是以下哪个', "a");
        this.answers.put('沧海护腰是腰带类的第几级装备', "a");
        this.answers.put('花花公子在哪个地图', "a");
        this.answers.put('每次合成宝石需要多少银两', "a");
        this.answers.put('以下哪个不是微信分享好友、朋友圈、QQ空间的奖励', "a");
        this.answers.put('打排行榜每天可以完成多少次', "a");
        this.answers.put('夜行披风是披风类的第几级装备', "a");
        this.answers.put('白蟒鞭的伤害是多少', "a");
        this.answers.put('易容术向谁学习', "a");
        this.answers.put('支线对话书生上魁星阁二楼杀死哪个NPC给10元宝', "a");
        this.answers.put('斗转星移是哪个门派的技能', "a");
        this.answers.put('杨过在哪个地图', "a");
        this.answers.put('钻石项链在哪获得', "a");
        this.answers.put('多少消费积分换取黄金宝箱', "a");
        this.answers.put('每突破一次技能有效系数加多少', "a");
        this.answers.put('茅山学习什么技能招宝宝', "a");
        this.answers.put('陆得财在乔阴县的哪个场景', "a");
        this.answers.put('独龙寨是第几个组队副本', "a");
        this.answers.put('以下哪个是花紫会的祖师', "a");
        this.answers.put('金弹子的伤害是多少', "a");
        this.answers.put('明月帽要多少刻刀摩刻', "a");
        this.answers.put('论剑输一场获得多少论剑积分', "a");
        this.answers.put('论剑中以下哪个是铁血大旗门的师傅', "a");
        this.answers.put('8级的装备摹刻需要几把刻刀', "a");
        this.answers.put('赠送李铁嘴银两能够增加什么', "a");
        this.answers.put('金刚不坏功有什么效果', "a");
        this.answers.put('少林的易筋经神功有哪个特殊效果', "a");
        this.answers.put('大旗门的修养术有哪个特殊效果', "a");
        this.answers.put('金刚杖的伤害是多少', "a");
        this.answers.put('双儿在扬州的哪个小地图', "a");
        this.answers.put('花不为在哪一章', "a");
        this.answers.put('铁项链可以在哪位npc那里获得', "a");
        this.answers.put('武学世家加的什么初始属性', "a");
        this.answers.put('师门磕头增加什么', "a");
        this.answers.put('全真的道家心法有哪个特殊效果', "a");
        this.answers.put('功德箱捐香火钱有什么用', "a");
        this.answers.put('雪莲有什么作用', "a");
        this.answers.put('论剑中以下哪个是花紫会的技能', "a");
        this.answers.put('柳文君所在的位置', "a");
        this.answers.put('岳掌门在哪一章', "a");
        this.answers.put('长虹剑在哪位npc那里获得？', "a");
        this.answers.put('副本一次最多可以进几人', "a");
        this.answers.put('师门任务每天可以完成多少次', "a");
        this.answers.put('逍遥步是哪个门派的技能', "a");
        this.answers.put('新人礼包在哪个npc处兑换', "a");
        this.answers.put('使用朱果经验潜能将分别增加多少', "a");
        this.answers.put('欧阳敏在哪一章', "a");
        this.answers.put('辟邪剑法是哪个门派的绝学技能', "a");
        this.answers.put('在哪个npc处可以更改名字', "a");
        this.answers.put('毒龙鞭的伤害是多少', "a");
        this.answers.put('晚月庄主线过关要求', "a");
        this.answers.put('怎么样获得免费元宝', "a");
        this.answers.put('成长计划需要多少元宝方可购买', "a");
        this.answers.put('青城派的道家心法有哪个特殊效果', "a");
        this.answers.put('藏宝图在哪个NPC处购买', "a");
        this.answers.put('丁老怪是哪个门派的终极师傅', "a");
        this.answers.put('斗转星移阵是哪个门派的阵法', "a");
        this.answers.put('挂机增长什么', "a");
        this.answers.put('鹰爪擒拿手是哪个门派的技能', "a");
        this.answers.put('八卦迷阵是那个门派的阵法', "a");
        this.answers.put('一天能完成挑战排行榜任务多少次', "a");
        this.answers.put('论剑每天能打几次', "a");
        this.answers.put('需要使用什么衣服才能睡寒玉床', "a");
        this.answers.put('张天师是哪个门派的师傅', "a");
        this.answers.put('技能柳家拳谁教的', "a");
        this.answers.put('九阴派梅师姐在星宿海哪个场景', "a");
        this.answers.put('哪个npc处可以捏脸', "a");
        this.answers.put('论剑中步玄派的师傅是哪个', "a");
        this.answers.put('宝玉鞋击杀哪个npc可以获得', "a");
        this.answers.put('慕容家主在慕容山庄的哪个场景', "a");
        this.answers.put('闻旗使在哪个地图', "a");
        this.answers.put('虎皮腰带是腰带类的第几级装备', "a");
        this.answers.put('在哪里可以找到“香茶”？', "a");
        this.answers.put('打造刻刀需要多少个玄铁', "a");
        this.answers.put('包家将是哪个门派的师傅', "a");
        this.answers.put('论剑中以下哪个是天邪派的人物', "a");
        this.answers.put('升级什么技能可以提升根骨', "a");
        this.answers.put('NPC公平子在哪一章地图', "a");
        this.answers.put('逄义是在那个场景', "a");
        this.answers.put('锻造一把刻刀需要多少银两', "a");
        this.answers.put('以下哪个不是岳掌门教导的武学', "a");
        this.answers.put('捏脸需要寻找哪个NPC？', "a");
        this.answers.put('论剑中以下哪个是晚月庄的技能', "a");
        this.answers.put('碧海潮生剑在哪位师傅处学习', "a");
        this.answers.put('干苦力是挂机里的第几个任务', "a");
        this.answers.put('铁血大旗门云海心法可以提升什么', "a");
        this.answers.put('以下哪些物品是成长计划第四天可以领取的？', "a");
        this.answers.put('易容术多少级才可以易容成异性NPC', "a");
        this.answers.put('摹刻扬文需要多少把刻刀？', "a");
        this.answers.put('正邪任务中客商的在哪个地图', "a");
        this.answers.put('白驼山第一位要拜的师傅是谁', "a");
        this.answers.put('枯荣禅功是哪个门派的技能', "a");
        this.answers.put('漫天花雨匕在哪获得', "a");
        this.answers.put('摧心掌是哪个门派的技能', "a");
        this.answers.put('“花海”场景是在哪个地图上？', "a");
        this.answers.put('雪蕊儿是哪个门派的师傅', "a");
        this.answers.put('新手礼包在哪里领取', "a");
        this.answers.put('论语在哪购买', "a");
        this.answers.put('银丝链甲衣可以在哪位npc那里获得？', "a");
        this.answers.put('乾坤大挪移属于什么类型的武功', "a");
        this.answers.put('移开明教石板需要哪项技能到一定级别', "a");
        this.answers.put('开通VIP月卡最低需要当天充值多少元方有购买资格', "a");
        this.answers.put('黯然销魂掌有多少招式', "c");
        this.answers.put('“跪拜坪”场景是在哪个地图上', "b");
        this.answers.put('孤独求败称号需要多少论剑积分兑换', "b");
        this.answers.put('孔雀氅可以镶嵌几颗宝石', "b");
        this.answers.put('客商在哪一章', "b");
        this.answers.put('疯魔杖的伤害是多少', "b");
        this.answers.put('丐帮的轻功是哪个', "b");
        this.answers.put('霹雳掌套的伤害是多少', "b");
        this.answers.put('方媃是哪个门派的师傅', "b");
        this.answers.put('拜师张三丰需要多少正气', "b");
        this.answers.put('天师阵法是哪个门派的阵法', "b");
        this.answers.put('选择商贾会影响哪个属性', "b");
        this.answers.put('银手镯可以在哪位npc那里获得？', "b");
        this.answers.put('在雪亭镇李火狮可以学习多少级柳家拳', "b");
        this.answers.put('华山施戴子掉落的物品是什么', "b");
        this.answers.put('尹志平是哪个门派的师傅', "b");
        this.answers.put('病维摩拳是哪个门派的技能', "b");
        this.answers.put('茅山的绝学是什么', "b");
        this.answers.put('茅山派的轻功是什么', "b");
        this.answers.put('风泉之剑可以在哪位npc那里获得？', "b");
        this.answers.put('凌波微步是哪个门派的技能', "b");
        this.answers.put('藏宝图在哪个npc处购买', "b");
        this.answers.put('军营是第几个组队副本', "b");
        this.answers.put('北岳殿神像后面是哪位npc', "b");
        this.answers.put('王重阳是哪个门派的师傅', "b");
        this.answers.put('跨服是星期几举行的', "b");
        this.answers.put('学习屠龙刀法需要多少内力', "b");
        this.answers.put('高级乾坤再造丹是增加什么的', "b");
        this.answers.put('银项链可以在哪位npc那里获得', "b");
        this.answers.put('每天在线多少个小时即可领取消费积分', "b");
        this.answers.put('晚月庄的内功是什么', "b");
        this.answers.put('冰魄银针的伤害是多少', "b");
        this.answers.put('论剑中以下哪个是丐帮的技能', "b");
        this.answers.put('神雕大侠所在的地图', "b");
        this.answers.put('突破丹在哪里购买', "b");
        this.answers.put('白金手镯可以在哪位npc那里获得', "a");
        this.answers.put('金手镯可以在哪位npc那里获得', "b");
        this.answers.put('以下哪个不是梁师兄教导的武学', "b");
        this.answers.put('技能数量超过了什么消耗潜能会增加', "b");
        this.answers.put('白金项链可以在哪位npc那里获得', "b");
        this.answers.put('小龙女住的古墓是谁建造的', "b");
        this.answers.put('打开引路蜂礼包可以得到多少引路蜂', "b");
        this.answers.put('购买新手进阶礼包在挂机打坐练习上可以享受多少倍收益', "b");
        this.answers.put('白玉腰束是腰带类的第几级装备', "b");
        this.answers.put('老顽童在全真教哪个场景', "b");
        this.answers.put('神雕侠侣的作者是', "b");
        this.answers.put('晚月庄的七宝天岚舞可以提升哪个属性', "b");
        this.answers.put('论剑在周几进行', "b");
        this.answers.put('vip每天不可以领取什么', "b");
        this.answers.put('每天有几次试剑', "b");
        this.answers.put('晚月庄七宝天岚舞可以提升什么', "b");
        this.answers.put('哪个分享可以获得20元宝', "b");
        this.answers.put('大保险卡可以承受多少次死亡后不降技能等级', "b");
        this.answers.put('凌虚锁云步是哪个门派的技能', "b");
        this.answers.put('屠龙刀法是哪个门派的绝学技能', "b");
        this.answers.put('金丝鞋可以在哪位npc那里获得', "b");
        this.answers.put('老毒物在白驮山的哪个场景', "b");
        this.answers.put('毒物阵法是哪个门派的阵法', "b");
        this.answers.put('以下哪个不是知客道长教导的武学', "b");
        this.answers.put('飞仙剑阵是哪个门派的阵法', "b");
        this.answers.put('副本完成后不可获得下列什么物品', "b");
        this.answers.put('晚月庄意寒神功可以提升什么', "b");
        this.answers.put('北冥神功是哪个门派的技能', "b");
        this.answers.put('论剑中以下哪个是青城派的技能', "b");
        this.answers.put('六阴追魂剑是哪个门派的技能', "b");
        this.answers.put('王铁匠是在那个场景', "b");
        this.answers.put('以下哪个是步玄派的祖师', "b");
        this.answers.put('在洛阳萧问天那可以学习什么心法', "b");
        this.answers.put('在哪个npc处能够升级易容术', "b");
        this.answers.put('摹刻10级的装备需要摩刻技巧多少级', "b");
        this.answers.put('师门任务什么时候更新', "b");
        this.answers.put('哪个npc属于全真七子', "b");
        this.answers.put('正邪任务中卖花姑娘在哪个地图', "b");
        this.answers.put('风老前辈在华山哪个场景', "b");
        this.answers.put('“留云馆”场景是在哪个地图上？', "b");
        this.answers.put('割鹿刀可以在哪位npc那里获得', "b");
        this.answers.put('论剑中以下哪个是大招寺的技能', "b");
        this.answers.put('全真的基本阵法有哪个特殊效果', "b");
        this.answers.put('论剑要在晚上几点前报名', "b");
        this.answers.put('碧磷鞭的伤害是多少？', "b");
        this.answers.put('一天能完成谜题任务多少个', "b");
        this.answers.put('正邪任务杀死好人增长什么', "b");
        this.answers.put('木道人在青城山的哪个场景', "b");
        this.answers.put('论剑中以下哪个不是大招寺的技能', "b");
        this.answers.put('“伊犁”场景是在哪个地图上？', "b");
        this.answers.put('“冰火岛”场景是在哪个地图上', "b");
        this.answers.put('“双鹤桥”场景是在哪个地图上', "b");
        this.answers.put('“百龙山庄”场景是在哪个地图上？', "b");
        this.answers.put('九阳神功是哪个门派的技能', "c");
        this.answers.put('树王坟在第几章节', "c");
        this.answers.put('阳刚之劲是哪个门派的阵法', "c");
        this.answers.put('上山打猎是挂机里的第几个任务', "c");
        this.answers.put('一张分身卡的有效时间是多久', "c");
        this.answers.put('锻造一把刻刀需要多少玄铁碎片锻造', "c");
        this.answers.put('论剑中以下哪个不是铁血大旗门的技能', "c");
        this.answers.put('如意刀是哪个门派的技能', "c");
        this.answers.put('跨服在哪个场景进入', "c");
        this.answers.put('在哪个NPC可以购买恢复内力的药品？', "c");
        this.answers.put('欧阳敏在唐门的哪个场景', "c");
        this.answers.put('密宗伏魔是哪个门派的阵法', "c");
        this.answers.put('孔雀氅是披风类的第几级装备？', "c");
        this.answers.put('天山折梅手是哪个门派的技能', "c");
        this.answers.put('玩家每天能够做几次正邪任务', "c");
        this.answers.put('柳淳风在哪一章', "c");
        this.answers.put('茅山天师正道可以提升什么', "c");
        this.answers.put('洪帮主在洛阳哪个场景', "c");
        this.answers.put('以下哪个不是全真七子？', "c");
        this.answers.put('云九天是哪个门派的师傅', "c");
        this.answers.put('摹刻烈日宝链需要多少级摩刻技巧', "c");
        this.answers.put('伏虎杖的伤害是多少', "c");
        this.answers.put('灵蛇杖法是哪个门派的技能', "c");
        this.answers.put('“子午楼”场景是在哪个地图上', "c");
        this.answers.put('什么装备可以镶嵌紫水晶', "c");
        this.answers.put('石师妹哪个门派的师傅', "c");
        this.answers.put('烈火旗大厅是那个地图的场景', "c");
        this.answers.put('打土匪是挂机里的第几个任务', "c");
        this.answers.put('捏脸需要花费多少银两', "c");
        this.answers.put('大旗门的云海心法可以提升哪个属性', "c");
        this.answers.put('论剑中以下哪个是铁雪山庄的技能', "c");
        this.answers.put('“白玉牌楼”场景是在哪个地图上', "c");
        this.answers.put('以下哪个宝石不能镶嵌到披风', "c");
        this.answers.put('魏无极身上掉落什么装备', "c");
        this.answers.put('以下不是步玄派的技能的哪个', "c");
        this.answers.put('“常春岛渡口”场景是在哪个地图上', "c");
        this.answers.put('北斗七星阵是第几个的组队副本', "c");
        this.answers.put('宝石合成一次需要消耗多少颗低级宝石', "c");
        this.answers.put('烈日项链可以镶嵌几颗宝石', "c");
        this.answers.put('达摩在少林哪个场景', "c");
        this.answers.put('积分商城在雪亭镇的哪个场景', "c");
        this.answers.put('全真的双手互搏有哪个特殊效果', "c");
        this.answers.put('论剑中以下哪个不是唐门的人物', "c");
        this.answers.put('棋道是哪个门派的技能', "c");
        this.answers.put('七星鞭的伤害是多少', "c");
        this.answers.put('富春茶社在哪一章', "c");
        this.answers.put('等级多少才能在世界频道聊天', "c");
        this.answers.put('以下哪个是封山派的祖师', "c");
        this.answers.put('论剑是星期几进行的', "c");
        this.answers.put('师门任务每天可以做多少个', "c");
        this.answers.put('风泉之剑加几点悟性', "c");
        this.answers.put('黑水伏蛟可以在哪位npc那里获得？', "c");
        this.answers.put('陆得财是哪个门派的师傅', "c");
        this.answers.put('拜师小龙女需要容貌多少', "c");
        this.answers.put('下列装备中不可摹刻的是', "c");
        this.answers.put('古灯大师是哪个门派的终极师傅', "c");
        this.answers.put('“翰墨书屋”场景是在哪个地图上', "c");
        this.answers.put('论剑中大招寺第一个要拜的师傅是谁', "c");
        this.answers.put('杨过小龙女分开多少年后重逢', "c");
        this.answers.put('选择孤儿会影响哪个属性', "c");
        this.answers.put('论剑中逍遥派的终极师傅是谁', "c");
        this.answers.put('不可保存装备下线多久会消失', "c");
        this.answers.put('一个队伍最多有几个队员', "c");
        this.answers.put('以下哪个宝石不能镶嵌到戒指', "c");
        this.answers.put('论剑是每周星期几', "c");
        this.answers.put('茅山在哪里拜师', "c");
        this.answers.put('以下哪个宝石不能镶嵌到腰带', "c");
        this.answers.put('黄宝石加什么属性', "c");
        this.answers.put('茅山可以招几个宝宝', "c");
        this.answers.put('唐门密道怎么走', "c");
        this.answers.put('论剑中以下哪个不是大理段家的技能', "c");
        this.answers.put('论剑中以下哪个不是魔教的人物', "d");
        this.answers.put('每天能做多少个师门任务', "c");
        this.answers.put('一天能使用元宝做几次暴击谜题', "c");
        this.answers.put('成长计划第七天可以领取多少元宝', "d");
        this.answers.put('每天能挖几次宝', "d");
        this.answers.put('日月神教大光明心法可以提升什么', "d");
        this.answers.put('在哪个npc处领取免费消费积分', "d");
        this.answers.put('副本有什么奖励', "d");
        this.answers.put('论剑中以下不是华山派的人物的是哪个', "d");
        this.answers.put('论剑中以下哪个不是丐帮的技能', "d");
        this.answers.put('以下哪个不是慧名尊者教导的技能', "d");
        this.answers.put('慕容山庄的斗转星移可以提升哪个属性', "d");
        this.answers.put('论剑中以下哪个不是铁雪山庄的技能', "d");
        this.answers.put('师门任务一天能完成几次', "d");
        this.answers.put('以下有哪些物品不是每日充值的奖励', "d");
        this.answers.put('论剑中以下哪个不是华山派的技能的', "d");
        this.answers.put('武穆兵法提升到多少级才能出现战斗必刷', "d");
        this.answers.put('论剑中以下哪个不是全真教的技能', "d");
        this.answers.put('师门任务最多可以完成多少个', "d");
        this.answers.put('张三丰在哪一章', "d");
        this.answers.put('倚天剑加多少伤害', "d");
        this.answers.put('以下谁不精通降龙十八掌', "d");
        this.answers.put('论剑中以下哪个不是明教的技能', "d");
        this.answers.put('受赠的消费积分在哪里领取', "d");
        this.answers.put('以下哪个不是道尘禅师教导的武学', "d");
        this.answers.put('古墓多少级以后才能进去', "d");
        this.answers.put('千古奇侠称号需要多少论剑积分兑换', "d");
        this.answers.put('魔鞭诀在哪里学习', "d");
        this.answers.put('通灵需要花费多少银两', "d");
        this.answers.put('白银宝箱礼包多少元宝一个', "d");
        this.answers.put('以下哪个不是论剑的皮肤', "d");
        this.answers.put('小李飞刀的伤害是多少', "d");
        this.answers.put('下面哪个npc不是魔教的', "d");
        this.answers.put('天蚕围腰是腰带类的第几级装备', "d");
        this.answers.put('黄岛主在桃花岛的哪个场景', "d");
        this.answers.put('宝玉帽可以在哪位npc那里获得？', "d");
        this.answers.put('什么影响攻击力', "d");
        this.answers.put('紫宝石加什么属性', "d");
        this.answers.put('少林的混元一气功有哪个特殊效果', "d");
        this.answers.put('以下哪个是晚月庄的祖师', "d");
        this.answers.put('以下不是隐藏门派的是哪个', "d");
        this.answers.put('第一个副本需要多少等级才能进入', "d");
        this.answers.put('风泉之剑在哪里获得', "d");
        this.answers.put('镖局保镖是挂机里的第几个任务', "d");
        this.answers.put('下面哪个不是古墓的师傅', "d");
        this.answers.put('每个玩家最多能有多少个好友', "b");
        this.answers.put('以下哪个不是在扬州场景', "d");
        this.answers.put('茅山的天师正道可以提升哪个属性', "d");
        this.answers.put('“无名山脚”场景是在哪个地图上', "d");
        this.answers.put('闯楼第几层可以获得称号“藏剑楼楼主”', "d");
        this.answers.put('充值积分不可以兑换下面什么物品', "d");
        this.answers.put('魔教的大光明心法可以提升哪个属性', "d");
        this.answers.put('以下哪些物品不是成长计划第三天可以领取的', "d");
        this.answers.put('论剑中以下哪个不是峨嵋派可以拜师的师傅', "d");
        this.answers.put('哪个技能不是魔教的', "d");
        this.answers.put('沧海护腰可以镶嵌几颗宝石', "d");
        this.answers.put('城里打擂是挂机里的第几个任务', "d");
        this.answers.put('以下哪个不是鲁长老教导的武学', "d");
        this.answers.put('以下哪些物品不是成长计划第一天可以领取的', "d");
        this.answers.put('包拯在哪一章', "d");
        this.answers.put('张天师在茅山哪个场景', "d");
        this.answers.put('山河藏宝图需要在哪个NPC手里购买？', "d");
        this.answers.put('影响你出生的福缘的出生是', "d");
        this.answers.put('张三丰在武当山哪个场景', "d");
        this.answers.put('春秋水色斋需要多少杀气才能进入', "d");
        this.answers.put('论剑中以下哪个不是是晚月庄的技能', "d");
        this.answers.put('大乘佛法有什么效果', "d");
        this.answers.put('正邪任务最多可以完成多少个', "d");
        this.answers.put('高级突破丹多少元宝一颗', "d");
        this.answers.put('清虚道长在哪一章', "d");
        this.answers.put('在战斗界面点击哪个按钮可以进入聊天界面', "d");
        this.answers.put('“鹰记商号”场景是在哪个地图上？', "d");
        this.answers.put('改名字在哪改', "d");
        this.answers.put('以下哪个不是在洛阳场景', "d");
        this.answers.put('金项链可以在哪位npc那里获得', "d");

        this.answer = function(a) {
            go("question " + a);
        }

        this.dispatchMessage = function(b) {
            var type = b.get("type"), msg= b.get("msg")
            if (type == "show_html_page" && msg.indexOf("知识问答第") > 0) {
                //console.log(msg);
                if (msg.indexOf("回答正确！") > 0) {
                    go("question");
                    return;
                }

                var q = this.answers.keys();
                for (var i in q) {
                    var k = q[i];

                    if (msg.indexOf(k) > 0) {
                        this.answer(this.answers.get(k));
                        break;
                    }
                }

            }
        }
    }

    var question = new Question
    function Trigger(r, h, c, n) {
        this.regexp = r;
        this.handler = h;
        this.class = c;
        this.name = n;

        this.enabled = true;

        this.trigger = function(line) {
            if (!this.enabled) return;

            if (!this.regexp.test(line)) return;

            //console.log("触发器: " + this.regexp + "触发了");
            var m = line.match(this.regexp);
            this.handler(m);
        }

        this.enable = function() {
            this.enabled = true;
        }

        this.disable = function() {
            this.enabled = false;
        }

    }

    jh = function(w) {
        if (w == 'xt') w = 1;
        if (w == 'ly') w = 2;
        if (w == 'hsc') w = 3;
        if (w == 'hs') w = 4;
        if (w == 'yz') w = 5;
        if (w == 'gb') w = 6;
        if (w == 'qy') w = 7;
        if (w == 'em') w = 8;
        if (w == 'hs2') w = 9;
        if (w == 'wd') w = 10;
        if (w == 'wy') w = 11;
        if (w == 'sy') w = 12;
        if (w == 'sl') w = 13;
        if (w == 'tm') w = 14;
        if (w == 'qc') w = 15;
        if (w == 'xx') w = 16;
        if (w == 'kf') w = 17;
        if (w == 'gmd') w = 18;
        if (w == 'qz') w = 19;
        if (w == 'gm') w = 20;
        if (w == 'bt') w = 21;
        if (w == 'ss') w = 22;
        if (w == 'mz') w = 23;
        if (w == 'ts') w = 24;


        clickButton("jh " + w, 0);
    };


    function Triggers() {
        this.allTriggers = [];

        this.trigger = function(line) {
            var t = this.allTriggers.slice(0);
            for (var i = 0, l = t.length; i < l; i++) {
                t[i].trigger(line);
            }
        }

        this.newTrigger = function(r, h, c, n) {
            var t = new Trigger(r, h, c, n);
            if (n) {
                for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                    if (this.allTriggers[i].name == n) this.allTriggers.splice(i, 1);
                }
            }

            this.allTriggers.push(t);

            return t;
        }

        this.enableTriggerByName = function(n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) t.enable();
            }
        }

        this.disableTriggerByName = function(n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) t.disable();
            }
        }

        this.enableByCls = function(c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.class == c) t.enable();
            }
        }

        this.disableByCls = function(c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.class == c) t.disable();
            }
        }

        this.removeByCls = function(c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t && t.class == c) this.allTriggers.splice(i, 1);
            }
        }

        this.removeByName = function(n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) this.allTriggers.splice(i, 1);
            }
        }
    }

    window.triggers = new Triggers;

    triggers.newTrigger(/似乎以下地方藏有宝物(.*)/, function(m) {
        m = m[1].split(/\d+/);
        var bl_found = false;
        for (i = 0, l = m.length; i < l; i++) {
            var a = m[i];
            console.log(a);
            if (/一片翠绿的草地/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/大诗人白居易之墓，墓碑上刻着“唐少傅白公墓”。四周环绕着冬青。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正站在雪亭镇南边的一家小客栈里，这家客栈虽小，却是方圆五百里/.test(a)) {
                jh('xt');
                go('dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇镇前广场的空地，地上整齐地铺著大石板。广场中央有一个木头搭的架子，经过多年的风吹日晒雨淋，看来非常破旧。四周建筑林立。往西你可以看到一间客栈，看来生意似乎很好。/.test(a)) {
                jh('xt');
                go('e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间十分老旧的城隍庙，在你面前的神桌上供奉著一尊红脸的城隍，庙虽老旧，但是神案四周已被香火薰成乌黑的颜色，显示这里必定相当受到信徒的敬仰。/.test(a)) {
                jh('xt');
                go('e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条普通的黄土小径，弯弯曲曲往东北一路盘旋上山，北边有一间城隍庙，往西则是雪亭镇的街道。/.test(a)) {
                jh('xt');
                go('e;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条普通的黄土小径，小径往西南通往一处山间的平地，从这里可以望见不少房屋错落在平地上，往东北则一路上山。/.test(a)) {
                jh('xt');
                go('e;e;s;ne;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条说宽不宽，说窄倒也不窄的山路，路面用几块生满青苔的大石铺成，西面是一段坡地，从这里可以望见西边有几间房屋错落在林木间，东面则是山壁，山路往西南衔接一条黄土小径，往北则是通往山上的石阶。/.test(a)) {
                jh('xt');
                go('e;e;s;ne;ne;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的街口，往北是一个热闹的广场，南边是条小路通往一座林子，东边则有一条小径沿著山腰通往山上，往西是一条比较窄的街道，参差不齐的瓦屋之间传来几声犬吠。从这里向东南走就是进出关的驿道了。/.test(a)) {
                jh('xt');
                go('e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的街道，你的北边有一家客栈，从这里就可以听到客栈里人们饮酒谈笑/.test(a)) {
                jh('xt');
                go('e;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间宽敞的书院，虽然房子看起来很老旧了，但是打扫得很整洁，墙壁上挂著一幅山水画，意境颇为不俗，书院的大门开在北边，西边有一扇木门通往边厢。/.test(a)) {
                jh('xt');
                go('e;s;w;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条宽敞坚实的青石板铺成的大道，路上车马的痕迹已经在路面上留下一条条明显的凹痕，往东是一条较小的街道通往雪亭镇。/.test(a)) {
                jh('xt');
                go('e;s;w;w;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正走在雪亭镇的街道上，东边不远处有一间高大的院子，门口立著一根粗大的旗杆/.test(a)) {
                jh('xt');
                go('e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间素来以公平信用著称的钱庄，钱庄的老板还是个曾经中过举人的读书人/.test(a)) {
                jh('xt');
                go('e;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正站在一间大宅院的入口，两只巨大的石狮镇守在大门的两侧，一阵阵吆喝与刀剑碰撞的声音从院子中传来，通过大门往东可以望见许多身穿灰衣的汉子正在操练。/.test(a)) {
                jh('xt');
                go('e;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正站在一个宽敞的教练场中，地上铺著黄色的细砂，许多人正在这里努力地操练著，北边是一间高大的兵器厅，往东则是武馆师父们休息的大厅。/.test(a)) {
                jh('xt');
                go('e;n;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间堆满各式兵器、刀械的储藏室，各式武器都依照种类、长短、依次放在一起，并且擦拭得一尘不染，储藏室的出口在你的南边，面对出口的左手边有一个架子/.test(a)) {
                jh('xt');
                go('e;n;e;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是淳风武馆的正厅，五张太师椅一字排开面对著门口，这是武馆中四位大师傅与馆主柳淳风的座位/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是淳风武馆中的天井，往西走可以回到正厅/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间整理得相当乾净的书房，红木桌椅上铺著蓝绸巾，显得十分考究，西面的立著一个书架，上面放著一排排的古书，往南走出房门可以看到天井。/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间布置得相当雅致的厢房，从窗子可以看到北边的天井跟南边的庭园中各式各样的奇花异草，以及他们所带来的淡淡香气，厢房的东面墙上还挂著一幅仕女图/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这里是淳风武馆的内院，平常武馆弟子没有馆主的允许是不敢到这里来的/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正走在雪亭镇的大街，往南直走不远处是镇上的广场，在你的东边是一间大宅院/.test(a)) {
                jh('xt');
                go('e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间打铁铺子，从火炉中冒出的火光将墙壁映得通红，屋子的角/.test(a)) {
                jh('xt');
                go('e;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的大街，东边有一栋陈旧的建□，看起来像是什麽店铺，但是并没有任何招牌，只有一扇门上面写著一个大大的/.test(a)) {
                jh('xt');
                go('e;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一家中等规模的当铺，老旧的柜台上放著一张木牌/.test(a)) {
                jh('xt');
                go('e;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是丰登当铺的储藏室，有时候当铺里的大朝奉会把铺里存不下的死当货物拿出来拍卖/.test(a)) {
                jh('xt');
                go('e;n;n;n;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的大街，一条小巷子通往东边，西边则是一间驿站/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是负责雪亭镇官府文书跟军令往来的雪亭驿/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/一间小木屋，在这北方的风中吱吱作响。/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一处山坳，往南就是雪亭镇，一条蜿蜒的小径往东通往另一个邻近的小山村/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里便是有名的龙门石窟，石窟造像，密布于两岸的崖壁上。远远可以望见琵琶峰上的白冢。/.test(a)) {
                jh('ly');
                go('dig go');
                bl_found = true;
                break;
            }
            if (/城南官道，道路两旁是一片树林，远处是一片片的农田了。田地里传来农人的呼号，几头黄牛悠闲的趴卧着。/.test(a)) {
                jh('ly');
                go('n;dig go');
                bl_found = true;
                break;
            }
            if (/由此洛阳城南门出去，就可以通往南市的龙门石窟。城门处往来客商络绎不绝，几名守城官兵正在检查过往行人。/.test(a)) {
                jh('ly');
                go('n;n;dig go');
                bl_found = true;
                break;
            }
            if (/洛阳最繁华的街市，这里聚集着各国客商。/.test(a)) {
                jh('ly');
                go('n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里便是洛水渡口静静的洛水由此向东，汇入滚滚黄河。码头上正泊着一艘船坞，常常的缆绳垂在水中。/.test(a)) {
                jh('ly');
                go('n;n;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/一艘普通的船坞，船头坐着一位蓑衣男子。/.test(a)) {
                jh('ly');
                go('n;n;e;s;luoyang317_op1;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是洛阳的南面了，街上有好几个乞丐在行乞。/.test(a)) {
                jh('ly');
                go('n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是一座供奉洛神的小庙。小庙的地上放着几个蒲团。/.test(a)) {
                jh('ly');
                go('n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这儿就是洛阳金刀世家了。金刀门虽然武功不算高，但也是有两下子的。/.test(a)) {
                jh('ly');
                go('n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/金刀世家的练武场。金刀门的门主王天霸在这儿教众弟子习武。/.test(a)) {
                jh('ly');
                go('n;n;n;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是洛神庙下面的地道，上面人走动的声音都隐约可听见。/.test(a)) {
                jh('ly');
                go('n;n;n;w;putuan;dig go');
                bl_found = true;
                break;
            }
            if (/湿润的青石路显然是刚刚下过雨，因为来往行人过多，路面多少有些坑坑凹凹，一不留神很容易被绊到。/.test(a)) {
                jh('ly');
                go('n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这儿就是菜市口。各种小贩商人十分嘈杂，而一些地痞流氓也混迹人群伺机作案。/.test(a)) {
                jh('ly');
                go('n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/一个猪肉摊，在这儿摆摊卖肉已经十多年了。/.test(a)) {
                jh('ly');
                go('n;n;n;n;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/你刚踏进巷子，便听得琴韵丁冬，小巷的宁静和外面喧嚣宛如两个世界/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/小院四周满是盛开的桃花，穿过一条长廊，一座别致的绣楼就在眼前了。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;s;dig go');
                bl_found = true;
                break;
            }
            if (/绣楼内挂着湖绿色帐幔，一名女子斜靠在窗前的美人榻上。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里就是背阴巷了，站在巷口可以万剑阴暗潮湿的窄巷，这里聚集着洛阳的地痞流氓，寻常人不敢近前。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;event_1_98995501;dig go');
                bl_found = true;
                break;
            }
            if (/黑暗的街道，几个地痞无赖正慵懒的躺在一旁。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;event_1_98995501;n;dig go;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一家酒肆，洛阳地痞头目甄大海正坐在里面小酌。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;event_1_98995501;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/院落里杂草丛生，东面的葡萄架早已枯萎。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;event_1_98995501;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/一座跨街大青砖砌的拱洞高台谯楼，矗立在城中心。鼓楼为二层木瓦建筑，设有大鼓大钟，晨钟暮鼓，用以报时。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/相传春秋时代，楚王在此仰望周王城，问鼎重几何。周室暗弱，居然隐忍不发。这便是街名的由来。银钩赌坊也在这条街上。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里便是洛阳有名的悦来客栈，只见客栈大门处人来人往，看来生意很红火。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/客栈大院，院内紫藤花架下放着几张桌椅，东面是一座马厩。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/客栈马倌正在往马槽里添草料，旁边草料堆看起来有些奇怪。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/房间布置的极为雅致，没有太多的装饰，唯有屋角放着一个牡丹屏风。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/赌坊二楼走廊，两旁房间里不时床来莺声燕语，看来这里不止可以赌。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通往赌坊二楼的楼梯，上面铺着大红色地毯。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/大厅满是呼庐喝雉声、骰子落碗声、银钱敲击声，男人和女人的笑声，/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/走出赌坊后门，桂花清香扑面而来，桂花树下的水缸似乎被人移动过。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/赌坊门口人马喧哗，门上一支银钩在风中摇晃，不知道多少人咬上了这没有鱼饵的钩/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;dig go');
                bl_found = true;
                break;
            }
            if (/自古以来，洛阳墨客骚人云集，因此有“诗都”之称，牡丹香气四溢，又有“花都”的美誉/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;s;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是牡丹园内的一座小亭子，布置得十分雅致。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;s;luoyang111_op1;dig go');
                bl_found = true;
                break;
            }
            if (/也许由于连年的战乱，使得本来很热闹的街市冷冷清清，道路两旁的店铺早已破旧不堪，一眼望去便知道有很久没有人居住了。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这间当铺处于闹市，位置极好。当铺老板正半眯着双眼在高高的柜台上打盹。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/你无意中走进一条青石街，这里不同于北大街的繁华热闹，两边是一些小店铺，北面有一家酒肆，里面出入的人看起来衣衫褴褛。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间小酒肆，里面黑暗潮湿，满是油垢的桌旁，几名无赖正百无聊赖的就着一盘花生米喝酒。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是洛阳北边街道，人群熙熙攘攘甚是热闹。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/洛阳城的钱庄，来往的商客往往都会将银两存于此处。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/就是洛阳北门，门口站着的是守城官兵。站在城楼望出去，外面是一片茅草路。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/城北通往邙山的小路，路旁草丛中时有小兽出没。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/一片绿云般的竹林隔绝了喧嚣尘世，步入这里，心不由平静了下来。青石小路在竹林中蜿蜒穿行，竹林深处隐约可见一座小院。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/绿竹环绕的小院，院内几间房舍都用竹子打造，与周围竹林颇为和谐。这小院的主人显然有些独特之处。院内一名老翁正在劈柴。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/一间雅致的书斋，透过窗户可以见到青翠修竹，四周如此清幽，竹叶上露珠滴落的声音都能听见。靠墙的书架看起来很别致。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/ 就是洛阳城墙上的城楼，驻守的官兵通常会在这儿歇个脚，或是聊下天。如果心细之人，能看到角落里似乎有一个隐秘的把手。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/ 这个城楼上的密室显然是守城军士秘密建造的，却不知有何用途。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;w;luoyang14_op1;dig go');
                bl_found = true;
                break;
            }
            if (/这就是洛阳城的城墙。洛阳是重镇，因此城墙上驻守的官兵格外多。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/由于连年的战乱，整条金谷街的不少铺子已经荒废掉了。再往东走就是洛阳地痞流氓聚集的背阴巷。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是洛阳首富的庄院，据说家财万贯，富可敌国。庄院的的中间有一棵参天大树。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是富人家的储藏室，因此有不少奇珍异宝。仔细一看，竟然还有一个红光满面的老人家半躺在角落里。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;n;op1;dig go');
                bl_found = true;
                break;
            }
            if (/一座朴实的石拱桥，清澈河水从桥下流过。对面可见一座水榭。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/荷池旁的水榭，几名游客正在里面小憩。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/回廊两旁便是碧绿荷塘，阵阵荷香拂过。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/荷塘中的观景台，两名女子在这里游玩。远远站着几名护卫，闲杂人等一律被挡在外面。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/隐藏在一片苍翠树林中的小路，小路尽头有座草屋。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/简陋的茅草小屋，屋内陈设极其简单。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/石阶两侧山泉叮咚，林木森森。漫步而上，可见山腰有亭。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这就是听伊亭，据说白居易曾与好友在此品茗、论诗。一旁的松树上似乎有什么东西。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/丛林小径，因为走得人少，小径已被杂草覆盖。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/听着松涛之音，犹如直面大海/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是华山村村口，几个草垛随意的堆放在路边，三两个泼皮慵懒躺在那里。/.test(a)) {
                jh('hsc');
                go('dig go');
                bl_found = true;
                break;
            }
            if (/这是一条穿过村口松树林的小路。/.test(a)) {
                jh('hsc');
                go('n;dig go');
                bl_found = true;
                break;
            }
            if (/这就是有名的神女冢，墓碑前散落着游人墨客烧的纸钱，前面不远处有一间破败的土地庙。/.test(a)) {
                jh('hsc');
                go('n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一片溪边的杏树林，一群孩童在此玩耍。/.test(a)) {
                jh('hsc');
                go('w;dig go');
                bl_found = true;
                break;
            }
            if (/村口一个简易茶棚，放着几张木质桌椅，干净齐整，过往路人会在这里喝杯热茶歇歇脚，村里的王老二常常会混在这里小偷小摸。/.test(a)) {
                jh('hsc');
                go('w;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间破败的土地庙门口，门旁的对联已经模糊不清，隐约只见上联“德之不修/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;dig go');
                bl_found = true;
                break;
            }
            if (/土地庙庙堂，正中供奉着土地，香案上堆积这厚厚的灰尘。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;dig go');
                bl_found = true;
                break;
            }
            if (/隐藏在佛像后的地道入口，两只黑狗正虎视眈眈的立在那里。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通往西侧的通道，前面被铁栅栏挡住了。/.test(a)) {
                jh('hsc');
                bl_found = true;
                go('w;event_1_59520311;n;n;w;dig go');
                break;
            }
            if (/通往地下通道的木楼梯/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通道两侧点着油灯，昏暗的灯光让人看不清楚周围的环境。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通往东侧的通道，前面传来有水声和痛苦的呻吟。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一件宽敞的大厅，正中间摆着一张太师椅，两侧放着一排椅子。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一件布置极为简单的卧房，显然只是偶尔有人在此小憩。床上躺着一名半裸女子，满脸惊恐。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条古老的青石街，几个泼皮在街上游荡。/.test(a)) {
                jh('hsc');
                go('s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条碎石小路，前面有一个打铁铺。/.test(a)) {
                jh('hsc');
                go('s;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间打铁铺，炉火烧的正旺，一名汉子赤膊挥舞着巨锤，锤落之处但见火花四溅。/.test(a)) {
                jh('hsc');
                go('s;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/一棵千年银杏树屹立在广场中央，树下有一口古井，据说这口古井的水清澈甘甜，村里的人每天都会来这里挑水。/.test(a)) {
                jh('hsc');
                go('s;s;dig go');
                bl_found = true;
                break;
            }
            if (/村里的杂货铺，店老板正在清点货品。/.test(a)) {
                jh('hsc');
                go('s;s;e;dig go');
                bl_found = true;
                break;
            }
            if (/杂货铺后院，堆放着一些杂物，东边角落里放着一个马车车厢，一个跛脚汉子坐在一旁假寐。/.test(a)) {
                jh('hsc');
                go('s;s;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一个普通的马车车厢，粗布帘挡住了马车车窗和车门，地板上面躺着一个人。/.test(a)) {
                jh('hsc');
                go('s;s;e;s;huashancun24_op2;dig go');
                bl_found = true;
                break;
            }
            if (/这是村内宗祠大门，门口一棵古槐，树干低垂。/.test(a)) {
                jh('hsc');
                go('s;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/宗祠的大厅，这里供奉着宗室先祖。/.test(a)) {
                jh('hsc');
                go('s;s;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/青石板铺就的小桥，几棵野草从石缝中钻出，清澈的溪水自桥下湍湍流过。/.test(a)) {
                jh('hsc');
                go('s;s;s;dig go');
                bl_found = true;
                break;
            }
            if (/田间泥泞的小路，一个稻草人孤单的立在一旁，似乎在指着某个地方。一个男子神色慌张的从一旁田地里钻出。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间竹篱围城的小院，院内种着几株桃花，屋后竹林环绕，颇为雅致。旁边的西厢房上挂着一把铜制大锁，看起来有些奇怪。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/这是小院的厅堂，迎面墙壁上挂着一幅山水画，看来小院的主人不是普通农人。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间普通的厢房，四周窗户被布帘遮得严严实实。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;w;get_silver;dig go');
                bl_found = true;
                break;
            }
            if (/一条杂草丛生的乡间小路，时有毒蛇出没。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;dig go');
                bl_found = true;
                break;
            }
            if (/一间看起来有些破败的小茅屋，屋内角落里堆着一堆稻草，只见稻草堆悉悉索索响了一阵，竟然从里面钻出一个人来。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;e;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨山脚，站在此处可以摇摇望见四面悬崖的清风寨。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;dig go');
                bl_found = true;
                break;
            }
            if (/通往清风寨唯一的山路，一侧便是万丈深渊。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;dig go');
                bl_found = true;
                break;
            }
            if (/两扇包铁木门将清风寨与外界隔绝开来，门上写着“清风寨”三字。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里就是桃花泉，一片桃林环绕着清澈泉水，据说泉水一年四季不会枯竭。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨前院，地面由坚硬岩石铺就。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨练武场，四周放置着兵器架。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨议事厅，正中放置着一张虎皮椅。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是清风寨后院，远角有一颗大树，树旁有一扇小门。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里就是清风寨兵器库了，里面放着各色兵器。角落里一个上锁的黑铁箱不知道装着什么。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里的空气中充满清甜的味道，地上堆积着已经晒干的柿子。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是清风寨寨主的卧房，床头挂着一把大刀。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是通往二楼大厅的楼梯，楼梯扶手上的雕花精美绝伦，看来这酒楼老板并不是一般的生意人/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/二楼是雅座，文人学士经常在这里吟诗作画，富商土豪也在这里边吃喝边作交易。/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/进门绕过一道淡绿绸屏风，迎面墙上挂着一副『芙蓉出水』图。厅内陈列奢华，雕花楠/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/进门绕过一道淡黄绸屏风，迎面墙上挂着一副『芍药』图，鲜嫩欲滴/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/进门绕过一道淡红绸屏风，迎面墙上挂着一副『牡丹争艳』图，牡丹素以富贵著称。图侧对联：“幽径天姿呈独秀，古园国色冠群芳”。/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/你站在观景台上眺望，扬州城的美景尽收眼底。东面是就是小秦淮河岸，河岸杨柳轻拂水面，几簇粉色桃花点缀其间。/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;n;n;dig go');
                bl_found = true;
                break;
            }

        }
        if (bl_found) go("cangbaotu_op1");
        //      window.setTimeout('go("cangbaotu_op1")', 3000);
    }, "", "cbt");

    window.game = this;

    window.attach = function() {
        var oldWriteToScreen = window.writeToScreen;
        window.writeToScreen = function(a, e, f, g) {
            oldWriteToScreen(a, e, f, g);
            a = a.replace(/<[^>]*>/g, "");
            triggers.trigger(a);
        };

        webSocketMsg.prototype.old = gSocketMsg.dispatchMessage;

        gSocketMsg.dispatchMessage = function(b) {
            this.old(b);
            qlMon.dispatchMessage(b);
            renwu.dispatchMessage(b);
            question.dispatchMessage(b);
            whipser.dispatchMessage(b);
            pzt.dm(b);
        }
    };
    attach();
})(window);
String.prototype.trim = function (char, type) { // 去除字符串中，头部或者尾部的指定字符串
    if (char) {
        if (type == 'left') {
            return this.replace(new RegExp('^\\'+char+'+', 'g'), '');
        } else if (type == 'right') {
            return this.replace(new RegExp('\\'+char+'+$', 'g'), '');
        }
        return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
}
//通用函数数组比较
function arrayCotains(array,str){
    var i = 0;
    $.each(array,function(j,value){
        if(value.indexOf(str) != -1){
            i = 1;
        }
    });
    return i;
}
var snd = new Audio("data:audio/wav;base64,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");
function playWarn(){
    //base64码警报声
    snd.play();
}
//按钮列表1--------------------------------------------------------------------------------------------------------------
var btnList1 = new BtnList(10,anniu_weizhi_right);		// 按钮列表1
var btnList0 = new BtnList(10,anniu_weizhi_right-anniu_pianyi);		// 按钮列表0
createButton('隐藏按钮',ycan_Func,btnList1);
createButton('自动杀怪',zdsg_Func,btnList1);
createButton('名字叫杀',mzjs_Func,btnList1);
//createButton('战斗绝学',zdjx_Func,btnList1);
createButton('出招',ycan_Func2(btnList0),btnList1);
createButton('破招',pz_Func,btnList1);
//createButton('锁定敌人',sddr_Func,btnList1);
createButton('补红',buhong_Func,btnList1);
createButton('补蓝',bulan_Func,btnList1);
//createButton('摸尸体',mst_Func,btnList1);
createButton('逃跑',tp_Func,btnList1);
createButton('战斗恢复',Stop_Func,btnList1);
createButton('跨服逃犯',tfxz_Func,btnList1);
createButton('跨服青龙',kfqlxz_Func,btnList1);
//隐藏按钮
//隐藏和显示按钮
function hideButton(btnList){
    for(var i in btnList.list){
        if(i!='隐藏按钮'){
            btnList.list[i].style.visibility="hidden";
        }
    }
}
function showButton(btnList){
    for(var i in btnList.list){
        if(i!='隐藏按钮'){
            btnList.list[i].style.visibility="visible";
        }
    }
}
function ycan_Func(){
    if(btnList1.list['隐藏按钮'].innerText == '隐藏按钮'){
        hideButton(btnList1);
        btnList1.list['隐藏按钮'].innerText = '战斗设置'
    }else{
        btnList1.list['隐藏按钮'].innerText = '隐藏按钮'
        showButton(btnList1);
    }
}

function hideButton2(btnList){
    for(var i in btnList.list){
        btnList.list[i].style.visibility="hidden";
     }
}
function showButton2(btnList){
    for(var i in btnList.list){
        btnList.list[i].style.visibility="visible";
    }
}

function ycan_Func2(btnList){
    return function(e){
        if(!btnList.hidden){
            hideButton2(btnList0);
            hideButton2(btnList2);
            showButton2(btnList);
            btnList0.hidden = 0;
            btnList2.hidden = 1;
            btnList.hidden = 1;
        }else{
            btnList2.hidden = 0;
            btnList.hidden = 0;
            showButton2(btnList2);
            hideButton2(btnList);
        }
    }
}
setTimeout(ycan_Func2(btnList0),100);
//按钮列表0---------------
createButton('出招开关',czkg_Func,btnList0);
createButton('技能1',jnsz(1),btnList0);
createButton('技能2',jnsz(2),btnList0);
createButton('技能3',jnsz(3),btnList0);
createButton('技能4',jnsz(4),btnList0);
createButton('技能5',jnsz(5),btnList0);
createButton('技能6',jnsz(6),btnList0);
createButton('技能7',jnsz(7),btnList0);
//自动技能
var czkg_interval = null;
var cz_xdx = [0,3,3,3,3,3,3,3];//
var skill_arr = [];
function czkg_Func(){
    if (btnList0.list["出招开关"].innerText == '出招开关'){
        btnList0.list["出招开关"].innerText ='关闭出招';
        czxdx = [];
        skill_arr = [];
        zdjn_pp = 0;
        for(var i = 1;g_obj_map.get('skill_button'+i);i++){
            var skillName = ys_replace(g_obj_map.get('skill_button'+i).get('name'));
            var xdz = g_obj_map.get('skill_button'+i).get('xdz');
            cz_xdx[i] = parseInt(xdz);
            btnList0.list['技能'+i].innerText = skillName;
        }
        czkg_interval = setInterval(zdjn,300);
    }else{
        btnList0.list["出招开关"].innerText ='出招开关';
        clearInterval(czkg_interval);
    }
}
//remove
Array.prototype.remove = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val){
            this.splice(i, 1);
            break;
        }
    }
};
var zdjn_pp = 0;
function jnsz(i){
    return function(e){
        if(btnList0.list['技能'+i].innerText.indexOf('✔')==-1){
            skill_arr.push(btnList0.list['技能'+i].innerText);
            zdjn_pp +=cz_xdx[i];
            btnList0.list['技能'+i].innerText += '✔';
        }else{
            btnList0.list['技能'+i].innerText=btnList0.list['技能'+i].innerText.replace('✔','');
            skill_arr.remove(btnList0.list['技能'+i].innerText);
            zdjn_pp -=cz_xdx[i];
        }
    }
}

//自动出招
var xiqi = 0;
function zdjn(){
    var jn_play = [];
    var ng_play = [];
    var p = g_obj_map.get('msg_attrs');
    var hp = parseInt(p.get('kee'));
    var mp = parseInt(p.get('force'));
    var mx_hp = parseInt(p.get('max_kee'));
    var mx_mp = parseInt(p.get('max_force'));
    var pp;

    if(g_gmain.is_fighting){
        for(var i = 1;g_obj_map.get('skill_button'+i);i++){
            var skillName = ys_replace(g_obj_map.get('skill_button'+i).get('name'));
            if($.inArray(skillName,skill_arr)!=-1){
                jn_play.push(i);
            }
            if($.inArray(skillName,['道种心魔经'])!=-1|$.inArray(skillName,['白首太玄经'])!=-1){
                ng_play.push(i);
            }
        }
        pp = gSocketMsg.get_xdz();
        //自动回血
        if(hp<=mx_hp*0.5&&hxhq_set==0){
            if(xiqi<3 && ng_play.length>0 && pp>=3){
                clickButton('playskill ' + ng_play[0]);
                xiqi++;
                return;
            }else{
            }
        }
        //自动回内
        if(mp < parseInt(mx_mp*0.3)&&hxhq_set==0){
            if(ng_play.length>0 && pp>=3){
                clickButton('playskill ' + ng_play[0]);
                return;
            }
        }
        //自动出招
        if(jn_play.length>0 && pp>=zdjn_pp){
            for(var j =0;j<jn_play.length;j++){
                clickButton('playskill ' + jn_play[j]);
            }
        }
    }else{
        xiqi = 0;
    }
}


//自动杀怪
var moren = ['天剑','虹雷','虹风','虹电',"虹雨","镇殿神兽", "守殿神兽", "幽荧幼崽", "幽荧兽魂", "幽荧分身", "幽荧战神",
             "镇潭神兽", "守潭神兽", "螣蛇幼崽", "螣蛇兽魂", "螣蛇分身", "螣蛇战神",
             "镇山神兽", "守山神兽", "应龙幼崽", "应龙兽魂", "应龙分身", "应龙战神",
             "镇谷神兽", "守谷神兽", "饕餮幼崽", "饕餮兽魂", "饕餮王", "饕餮战神",'铁狼军','银狼军','金狼军','金狼将','十夫长','百夫长','濯缨剑士','对影剑士','月幽剑士','夏花剑士',
             '星宿恶徒【一】','星宿恶徒【二】','星宿恶徒【三】','星宿恶徒【四】',
            ];
var zdsg_Interval = null;
function zdsg_Func(){
    if (btnList1.list["自动杀怪"].innerText == '自动杀怪'){
        btnList1.list["自动杀怪"].innerText ='停止杀怪';
        zdsg_Interval = setInterval(killTarget,300,moren,'');
    }else{
        btnList1.list["自动杀怪"].innerText ='自动杀怪';
        clearInterval(zdsg_Interval);
    }
}
//逃犯选择杀
var taofan_xuanze1 =['[36-40区]段老大'];
var taofan_xuanze2 =['[36-40区]无一'];
function tfxz_Func(){
    if (btnList1.list["跨服逃犯"].innerText == '跨服逃犯'){
        btnList1.list["跨服逃犯"].innerText ='杀老大';
        zdsg_Interval = setInterval(killTarget,300,taofan_xuanze1,'');
    }else if(btnList1.list["跨服逃犯"].innerText =='杀老大'){
        btnList1.list["跨服逃犯"].innerText ='杀无一';
        clearInterval(zdsg_Interval);
        zdsg_Interval = setInterval(killTarget,300,taofan_xuanze2,'');
    }
     else if(btnList1.list["跨服逃犯"].innerText =='杀无一'){
        btnList1.list["跨服逃犯"].innerText ='跨服逃犯';
        clearInterval(zdsg_Interval);
    }
}
//跨服青龙选择杀
var kuafu_xuanze1 =['[36-40区]王铁匠','[36-40区]杨掌柜','[36-40区]柳绘心','[36-40区]方老板','[36-40区]朱老伯','[36-40区]方寡妇',
                    '[36-40区]客商','[36-40区]柳小花','[36-40区]卖花姑娘','[36-40区]刘守财'];
var kuafu_xuanze2 =['[36-40区]恶棍','[36-40区]流寇','[36-40区]剧盗','[36-40区]云老四','[36-40区]岳老三','[36-40区]二娘','[36-40区]段老大'];
function kfqlxz_Func(){
    if (btnList1.list["跨服青龙"].innerText == '跨服青龙'){
        btnList1.list["跨服青龙"].innerText ='杀好人';
        kfzdsg_Interval = setInterval(killTarget,300,kuafu_xuanze1,'');
    }else if(btnList1.list["跨服青龙"].innerText =='杀好人'){
        btnList1.list["跨服青龙"].innerText ='杀坏人';
        clearInterval(kfzdsg_Interval);
        kfzdsg_Interval = setInterval(killTarget,300,kuafu_xuanze2,'');
    }
     else if(btnList1.list["跨服青龙"].innerText =='杀坏人'){
        btnList1.list["跨服青龙"].innerText ='跨服青龙';
        clearInterval(kfzdsg_Interval);
    }
}

//从最后一个杀
function negativeKill(npcNameList,killset){
    var target= []
    var r = g_obj_map.get("msg_room");
    if(r){
        for (var b = 1; r.get("npc" + b); b++){
            var l = r.get("npc" + b).split(',');
            if(l[0].indexOf(killset)!=-1){
                if( npcNameList.contains(ys_replace(l[1])) ){
                    target.push(l[0]);
                }
            }
        }
    }
    var targetCode;
    if(target.length > 0){
        targetCode = target[target.length-1];
        clickButton('kill ' + targetCode); // 点击杀人
    }
}
//杀第一个
function killTarget(npcNameList,killset){
    var target= []
    var r = g_obj_map.get("msg_room");
    if(r){
        for (var b = 1; r.get("npc" + b); b++){
            var l = r.get("npc" + b).split(',');
            if(l[0].indexOf(killset)!=-1){
                if(npcNameList.contains(g_simul_efun.replaceControlCharBlank(l[1]))){
                    target.push(l[0]);
                }
            }
        };
    }
    var targetCode;
    if(g_gmain.is_fighting){
        return -2;//战斗中
    }
    else if($('.outtitle').text().indexOf('请确认')!=-1){
        return -1;
    }
    else if($('.outbig_text').text().indexOf('战败了')!=-1){
        return -3;
    }//战败了...
    else if($('.outbig_text').text().indexOf('胜利！')!=-1){
        clickButton('prev_combat');
        return -4;
    }
    else if($('.outbig_text').text().indexOf('临阵逃跑')!=-1){
        return -5;
    }
    else if(target.length > 0){
        targetCode = target[0];
        clickButton('kill ' + targetCode); // 点击杀人
        return target.length;
    }
    else if(target.length ==0){
        return 0;
    }
}
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
//名字叫杀
var mzjs_interval =null;
function mzjs_Func(){
    if(btnList1.list['名字叫杀'].innerText == '名字叫杀'){
        var a = prompt('输入叫杀npc名字');
        if(mzjs_interval){
            clearInterval(mzjs_interval);
        }
        if(a){
            mzjs_interval = setInterval(function(){
                if($('button:contains('+a+')').length>0){
                    killTarget([a],'');
                    //clearInterval(mzjs_interval);
                }
            },150);
        }
    }else{
        clearInterval(mzjs_interval);
    }
}
//战斗绝学
var skill_set = 0;
var zdjx_Interval = null;
function zdjx_Func(){
    if(btnList1.list['战斗绝学'].innerText == '战斗绝学'){
        zdjx_Interval = setInterval(jxz,300);
        btnList1.list['战斗绝学'].innerText = '群攻';
        skill_set = 0;
    }else if(btnList1.list['战斗绝学'].innerText == '群攻'){
        btnList1.list['战斗绝学'].innerText = '新老阵法';
        skill_set = 1;
    }else if(btnList1.list['战斗绝学'].innerText == '新老阵法'){
        btnList1.list['战斗绝学'].innerText = '单招';
        skill_set = 2;
    }else if(btnList1.list['战斗绝学'].innerText == '单招'){
        btnList1.list['战斗绝学'].innerText = '只出轻功';
        skill_set = 3;
    }else if(btnList1.list['战斗绝学'].innerText == '只出轻功'){
        btnList1.list['战斗绝学'].innerText = '战斗绝学';
        clearInterval(zdjx_Interval);
        skill_set = 0;
    }
}

var hxhq_set=0; //回血回内设置；
function Stop_Func(){
    if(btnList1.list['战斗恢复'].innerText == '战斗恢复'){
        hxhq_set=1;
        btnList1.list['战斗恢复'].innerText = '暂停恢复';
    }else if(btnList1.list['战斗恢复'].innerText == '暂停恢复'){
        btnList1.list['战斗恢复'].innerText = '战斗恢复';
        hxhq_set=0;
    }
}
var xiqi = 0;
var xjh_skill1 = ['昊云破周斧','四海断潮斩','九溪断月枪','燎原百破','玄胤天雷','天火飞锤','冰月破魔枪','燎原百击','正道十七'];
var xjh_skill2 = ['辉月杖法','玄天杖法','破军棍诀','千影百伤棍','拈花解语鞭','十怒绞龙索','月夜鬼萧'];
var ljh_skill = ['九天龙吟剑法','覆雨剑法','织冰剑法','如来神掌','排云掌法','雪饮狂刀','翻云刀法','飞刀绝技',"孔雀翎"]
var qg_skill = ['乾坤大挪移','万流归一','幽影幻虚步'];
var ng_skill = ['道种心魔经','生生造化功','易筋经神功'];
var hn_skill = ['不动明王诀'];

function jxz(){
    var xjh_play1 = [];
    var xjh_play2 = [];
    var ljh_play = [];
    var qg_play = [];
    var ng_play = [];
    var hn_play = [];
    var p = g_obj_map.get('msg_attrs');
    var hp = parseInt(p.get('kee'));
    var mp = parseInt(p.get('force'));
    var mx_hp = parseInt(p.get('max_kee'));
    var mx_mp = parseInt(p.get('max_force'));
    var pp;

    if(g_gmain.is_fighting){
        for(var i = 1;g_obj_map.get('skill_button'+i);i++){
            var skillName = g_simul_efun.replaceControlCharBlank(g_obj_map.get('skill_button'+i).get('name'));
            if(skillName == ""){
            }else if($.inArray(skillName,xjh_skill1)!=-1){
                xjh_play1.push(i)
            }else if($.inArray(skillName,xjh_skill2)!=-1){
                xjh_play2.push(i);
            }else if($.inArray(skillName,ljh_skill)!=-1){
                ljh_play.push(i);
            }else if($.inArray(skillName,ng_skill)!=-1){
                ng_play.push(i);
            }else if($.inArray(skillName,hn_skill)!=-1){
                hn_play.push(i);
            }else if($.inArray(skillName,qg_skill)!=-1){
                qg_play.push(i);
            }
        }
        pp = gSocketMsg.get_xdz();
        //自动回血
        if(hp<=mx_hp*0.4&&hxhq_set==0){
            if(xiqi<3 && ng_play.length>0 && pp>=3){
                clickButton('playskill ' + ng_play[0]);
                xiqi++;
                return;
            }else{
            }
        }
        //自动回内
        if(mp < parseInt(mx_mp*0.3)&&hxhq_set==0){
            if(hn_play.length>0 && pp>=2){
                clickButton('playskill ' + hn_play[0]);
                return;
            }else if(ng_play.length>0 && pp>=3){
                clickButton('playskill ' + ng_play[0]);
                return;
            }
        }
        //自动出招
        if(skill_set == 0){
            if(xjh_play2.length>0 && pp>=6){
                clickButton('playskill ' + xjh_play2[0]);
                if(xjh_play1.length>0){
                    clickButton('playskill ' + xjh_play1[0]);
                }else if(ljh_play.length>0){
                    clickButton('playskill ' + ljh_play[0]);
                }
            }
        }else if(skill_set == 1){
            if(pp>=6){
                if(xjh_play1.length>0 && ljh_play.length>0){
                    clickButton('playskill ' + xjh_play1[0]);
                    clickButton('playskill ' + ljh_play[0]);
                }else if(ljh_play.length>1){
                    clickButton('playskill ' + ljh_play[0]);
                    clickButton('playskill ' + ljh_play[1]);
                }
            }
        }else if(skill_set == 2){
            if(pp>=3){
                if(xjh_play1.length>0){
                    clickButton('playskill ' + xjh_play1[0]);
                }else if(xjh_play2.length>0){
                    clickButton('playskill ' + xjh_play2[0]);
                }else if(ljh_play.length>0){
                    clickButton('playskill ' + ljh_play[0]);
                }
            }
        }else if(skill_set == 3){
            if(pp>=3){
                if(qg_play.length>0){
                    clickButton('playskill ' + qg_play[0]);
                }               }
            }
    }else{
        xiqi = 0;
    }
}
//破招
var pz_interval = null;
function pz_Func(){
    if(btnList1.list['破招'].innerText == '破招'){
        Jianshi.pozhao =1;
        btnList1.list['破招'].innerText = '停破招';
        pz_interval = setInterval(function(){
            var xjh_play1 = [];
            var xjh_play2 = [];
            var ljh_play = [];
            var qg_play = [];
            var ng_play = [];
            var hn_play = [];
            var p = g_obj_map.get('msg_attrs');
            var hp = parseInt(p.get('kee'));
            var mp = parseInt(p.get('force'));
            var mx_hp = parseInt(p.get('max_kee'));
            var mx_mp = parseInt(p.get('max_force'));
            var pp;

            if(g_gmain.is_fighting){
                for(var i = 1;g_obj_map.get('skill_button'+i);i++){
                    var skillName = g_simul_efun.replaceControlCharBlank(g_obj_map.get('skill_button'+i).get('name'));
                    if(skillName == ""){
                    }else if($.inArray(skillName,xjh_skill1)!=-1){
                        xjh_play1.push(i)
                    }else if($.inArray(skillName,xjh_skill2)!=-1){
                        xjh_play2.push(i);
                    }else if($.inArray(skillName,ljh_skill)!=-1){
                        ljh_play.push(i);
                    }else if($.inArray(skillName,ng_skill)!=-1){
                        ng_play.push(i);
                    }else if($.inArray(skillName,hn_skill)!=-1){
                        hn_play.push(i);
                    }
                }
                pp = gSocketMsg.get_xdz();
                //自动回血
                if(hp<=mx_hp*0.4&&hxhq_set==0){
                    if(xiqi<3 && ng_play.length>0 && pp>=3){
                        clickButton('playskill ' + ng_play[0]);
                        xiqi++;
                        return;
                    }else{
                    }
                }
                //自动回内
                if(mp < parseInt(mx_mp*0.3&&hxhq_set==0)){
                    if(hn_play.length>0 && pp>=2){
                        clickButton('playskill ' + hn_play[0]);
                    }else if(ng_play.length>0 && pp>=3){
                        clickButton('playskill ' + ng_play[0]);
                    }
                    return;
                }
                //自动出招
                if(Jianshi.pzjs == 1){
                    if(pp>=3){
                        if(xjh_play1.length>0){
                            clickButton('playskill ' + xjh_play1[0]);
                        }else if(xjh_play2.length>0){
                            clickButton('playskill ' + xjh_play2[0]);
                        }else if(ljh_play.length>0){
                            clickButton('playskill ' + ljh_play[0]);
                        }
                        Jianshi.pzjs = 0;
                    }
                }
            }else{
                Jianshi.pzjs = 0;
                xiqi = 0;
            }
        },300);
    }else{
        btnList1.list['破招'].innerText = '破招';
        Jianshi.pozhao = 0;
        Jianshi.pzjs =0;
        clearInterval(pz_interval);
    }
}
//锁定敌人
function sddr_Func(){
}
//自动补红蓝
var bujiInterval = null;
function bulan_Func(){
    bulan();
}
function buhong_Func(){
    buhong();
}
function buhong(t){
    var BuhongInterval =setInterval(function(){
        var p = g_obj_map.get('msg_attrs');
        var max_qixue = parseInt(p.get('max_kee'));
        var max_neili = parseInt(p.get('max_force'));
        var neili = parseInt (p.get('force'));
        var qixue = parseInt(p.get('kee'));
        if(neili<max_neili-30000){
            clickButton('items use snow_wannianlingzhi');
        }else if(qixue<max_qixue){
            clickButton('recovery');
        }else{
            clearInterval(BuhongInterval);
        }
    },300);
}
function bulan(){
    var p = g_obj_map.get('msg_attrs');
    var max_neili = parseInt( p.get('max_force') );;
    var neili = parseInt (p.get('force'));
    var BulanInterval = setInterval(function(){
        if(neili<max_neili-30000){
            clickButton('items use snow_wannianlingzhi');
            neili +=30000;
        }
        else if(neili<max_neili){
            clickButton('items use snow_qiannianlingzhi');
            neili +=5000;
        }else{
            clickButton('golook_room');
            clearInterval(BulanInterval);
        }
    },120,max_neili,neili);
}
//摸尸体
var mst_interval = null;
function mst_Func(){
    if(btnList1.list['摸尸体'].innerText == '摸尸体'){
        btnList1.list['摸尸体'].innerText = '停摸尸体';
        var corpse = [];
        var mst_i = 0;
        var cy = [];
        var mcy_i = 0;
        mst_interval = setInterval(function(){
            var m = g_obj_map.get("msg_room");
            for(var i =1;m.get('item'+i);i++){
                if(!corpse.contains(m.get('item'+i).split(',')[0])){
                    corpse.push(m.get('item'+i).split(',')[0]);
                }
            }
            for(i =1;m.get('cmd'+i);i++){
                if( m.get('cmd'+i).indexOf('caiyao')!=-1 && !cy.contains(m.get('cmd'+i)) ){
                    cy.push(m.get('cmd'+i));
                }
            }
            if(corpse.length>0 && mst_i<corpse.length){
                clickButton('get '+corpse[mst_i]);
                mst_i++;
            }
            if(cy.length>0 && mcy_i<cy.length){
                clickButton(cy[mcy_i]);
                mcy_i++;
            }
        },200)
    }else{
        clearInterval(mst_interval)
        btnList1.list['摸尸体'].innerText = '摸尸体';
    }
}
//逃跑
var tp_interval = null;
function tp_Func(){
    if(btnList1.list['逃跑'].innerText == '逃跑'){
        btnList1.list['逃跑'].innerText = '停逃跑';
        tp_interval = setInterval(function(){
            if(g_gmain.is_fighting){
                clickButton('escape');
            }else{
                btnList1.list['逃跑'].innerText = '逃跑'
                clearInterval(tp_interval);
            }
        },300);
    }else{
        btnList1.list['逃跑'].innerText = '逃跑'
        clearInterval(tp_interval);
    }
}
/*//逃犯选择打好人还是坏人
var tf_xuanze=null;
function tfxz_Func(){
    if (btnList1.list["跨服逃犯"].innerText == '跨服逃犯'){
        btnList1.list["跨服逃犯"].innerText ='杀老大';
        tf_xuanze=1;
    }else if(btnList1.list["跨服逃犯"].innerText =='杀老大'){
        btnList1.list["跨服逃犯"].innerText ='杀无一';
        tf_xuanze=2;
    }else if(btnList1.list["跨服逃犯"].innerText =='杀无一'){
        btnList1.list["跨服逃犯"].innerText ='跨服逃犯';
        tf_xuanze=null;
    }
}
*/
//end list1---------------------------------

////按钮列表2--------------------------------------------------------------------------------------------
var btnList2 = new BtnList(10,anniu_weizhi_right-anniu_pianyi);//按钮列表2
createButton('隐藏按钮',fb_Func,btnList2);
//副本1-8
createButton('副本1',fb1_Func,btnList2);
createButton('副本2',fb2_Func,btnList2);
createButton('副本3',fb3_Func,btnList2);
createButton('副本4',fb4_Func,btnList2);
createButton('副本5',fb5_Func,btnList2);
createButton('副本6',fb6_Func,btnList2);
createButton('副本7',fb7_Func,btnList2);
createButton('副本8',fb8_Func,btnList2);
//帮派1-2-3
createButton('帮本1',bpfb1_Func,btnList2);
createButton('帮本2',bpfb2_Func,btnList2);
createButton('帮本3',bpfb3_Func,btnList2);
//跨服1-2-3
createButton('跨本1',kffb1_Func,btnList2);
createButton('跨本2',kffb2_Func,btnList2);
createButton('跨本3',kffb3_Func,btnList2);
//游侠自动寻路
var yx_interval = null;
var yx_num = 0;
function yx_go(npcList,yxdd){
    var go_array = city[yxdd].split(';');
    yx_interval = setInterval(function(){
        if(killTarget(npcList,'') == 0 && yx_num<go_array.length){
            clickButton(go_array[yx_num++]);
        }else {
            yx_num = 0;
            clearInterval(yx_interval);
        }
    },300)
}
//副本自动寻路-------------
var fb_obj = {fb:0,Interval_fb:null,dy:0}
function fb_go(kill,npcList,goList){
    var target_num = killTarget(npcList,kill);
    var go_array = goList.split(';');
    if(fb_obj.fb>go_array.length){
        clearInterval(fb_obj.Interval_fb);
    }
    if(target_num ==0 && fb_obj.fb<=go_array.length){
        clickButton(go_array[fb_obj.fb++]);
    }
}
function fb_Func(){
    if(btnList2.list['隐藏按钮'].innerText == '隐藏按钮'){
        hideButton(btnList2);
        btnList2.list['隐藏按钮'].innerText = '副本'
    }else{
        btnList2.list['隐藏按钮'].innerText = '隐藏按钮'
        showButton(btnList2);
    }
}
//副本
function fb1_Func(){
    fb_obj.fb =0;
    fb_obj.Interval_fb= setInterval(fb_go,200,'',["傅一镖",'独龙寨土匪'],'fb 1;n;n;n;n');
}
function fb2_Func(){
    fb_obj.fb =0;
    var t = g_obj_map.get('msg_team');
    for(var i = t.get('member_num');i>0;i--){
        if(t.get('member'+i).indexOf(g_user_id)!=-1){
            fb_obj.dy = i;
        }
    }
    if(fb_obj.dy ==1){
        fb_obj.Interval_fb= setInterval(fb_go,200,'',['护卫','小兵'],'fb 2;e;e;event_1_43484736');
    }else if(fb_obj.dy ==2){
        fb_obj.Interval_fb= setInterval(fb_go,200,'',['护卫','小兵'],'fb 2;e;s;event_1_41361248');
    }else if(fb_obj.dy ==3){
        fb_obj.Interval_fb= setInterval(fb_go,200,'',['护卫','小兵'],'fb 2;e;n;event_1_48728674');
    }else if(fb_obj.dy ==4){
        fb_obj.Interval_fb= setInterval(fb_go,200,'',['护卫','小兵'],'fb 2;e;e;event_1_43484736');
    }
}
function fb3_Func(){
    fb_obj.fb =0;
    fb_obj.Interval_fb= setInterval(fb_go,200,'',['天权剑客','天枢剑客','开阳剑客','天璇剑客'],'fb 3;w;e;s;n;e;event_1_9777898');
}
function fb4_Func(){
    fb_obj.fb =0;
    fb_obj.Interval_fb= setInterval(fb_go,200,'',['翻云刀神','织冰女侠','覆雨剑神','排云狂神','九天老祖'],'fb 4;n;n;n;n;n');
}
function fb5_Func(){
    go('fb 5');
}
function fb6_Func(){
    go('fb 6');
}
function fb7_Func(){
    go('fb 7');
}
function fb8_Func(){
    go('fb 8');
}
//帮本1-2-3
function bpfb1_Func(){
    fb_obj.fb = 0;
    if(g_obj_map.get('msg_team').get('is_leader') == '1'){
        if (btnList2.list["帮本1"].innerText == '帮本1'){//event_1_40313353  event_1_2645997 event_1_43755600 event_1_64156549
            fb_obj.Interval_fb= setInterval(fb_go,400,'',["镇殿神兽", "守殿神兽", "幽荧幼崽", "幽荧兽魂", "幽荧分身", "幽荧战神", "镇潭神兽", "守潭神兽", "螣蛇幼崽", "螣蛇兽魂", "螣蛇分身", "螣蛇战神", "镇山神兽", "守山神兽", "应龙幼崽", "应龙兽魂", "应龙分身", "应龙战神", "镇谷神兽", "守谷神兽", "饕餮幼崽", "饕餮兽魂", "饕餮王", "饕餮战神"],'clan fb enter shenshousenlin;event_1_2645997;s;w;w;w;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s;w;w;w;e;e;e;e;e;e;w;w;w;s');
            btnList2.list["帮本1"].innerText ='停';
        }else{
            clearInterval(fb_obj.Interval_fb);
            btnList2.list["帮本1"].innerText ='帮本1';
        }
    }else{
        go('clan fb enter shenshousenlin;event_1_2645997');
    }
}
function bpfb2_Func(){
    clickButton('clan fb enter daxuemangongdao');
}
function bpfb3_Func(){
}
//跨服1-2-3
function kffb1_Func(){
    if (btnList2.list['跨本1'].innerText == '跨本1'){
        fb_obj.fb =0;
        fb_obj.Interval_fb= setInterval(fb_go,300,'',['极武坛弟子','十二宫门人','天海·麒麟月','鲲鹏·展苍鹰','血瞳·狱虎令','罪罚·铁狂徒','金曦·焚宇凤','银豹·末日狂','守序·云行兽','啸日·赤猋影','蝶魂·玄魄武','火狂·炽巽翼','点星·剑魔狼','刀行·玉珐猿'],'fb 1;w;s;e;e;e;e;e;nw;w;nw;nw;se;se;ne;se;nw;sw;nw;e;w;ne;sw;w;e;se;ne;n;s;ne;sw;e;w;nw;se;sw;nw;n;s;sw;ne;se;ne;w');
        btnList2.list['跨本1'].innerText ='停';
    }else{
        clearInterval(fb_obj.Interval_fb);
        btnList2.list["跨本1"].innerText ='跨本1';
    }
}
function kffb2_Func(){
    if(btnList2.list['跨本2'].innerText == '跨本2'){
        go('fb 2;s;e;e;e;e;s;event_1_78544045');
        btnList2.list['跨本2'].innerText = '苗寨深处';
    }else{
        go('w;n;e;e;s;s;w;w');
        btnList2.list['跨本2'].innerText = '跨本2';
    }
}
function kffb3_Func(){
}


//按钮列表3---------------------------------------------------------------------
var btnList3 = new BtnList(10,anniu_weizhi_right-2*anniu_pianyi);

createButton('隐藏按钮',rc_Func,btnList3);
createButton('签到',qd_Func,btnList3);
createButton('试剑',sj_Func,btnList3);
//createButton('采莲',cl_Func,btnList3);
createButton('冰月1',by1_Func,btnList3);
//createButton('冰月2',by2_Func,btnList3);
createButton('唐门',tm_Func,btnList3);
//createButton('破阵',dzpz_Func,btnList3);
createButton('岩画',yh_Func,btnList3);
//createButton('玄铁',xzt_Func,btnList3);
//createButton('绝情谷',jqg_Func,btnList3);
createButton('侠客岛',xkd_Func,btnList3);
createButton('天山',ts_Func,btnList3);
createButton('大成忘武',dcww_Func,btnList3);
createButton('青白峨恒少毒',qc_Func,btnList3);
//createButton('奇袭',qx_Func,btnList3);
//createButton('峨眉',em_Func,btnList3);
//createButton('峨眉军令',jl_Func,btnList3);
//createButton('恒山',hs_Func,btnList3);
//createButton('少林渡劫',dj_Func,btnList3);
createButton('天山七剑',tsqj_Func,btnList3);
//createButton('明教毒魔',mjdm_Func,btnList3);
createButton('开答题',answerquestions_Func,btnList3);
createButton('破障除魔',PozhangFunc,btnList3);
createButton('李火师领奖',lihuoshiFunc,btnList3);
createButton('VIP师帮',VipFunc,btnList3);
createButton('打榜',FightPaiHang,btnList3);
createButton('小号签到',XhQd_Func,btnList3);
//日常任务---------------------------------------------------------------------
//多段寻路:
var ddxl_interval = null;
function ddxl(rm_list,xl_list){
    var rm = g_obj_map.get('msg_room').get('short');
    for(var i =0;i<rm_list.length;i++){
        if(rm == rm_list[i]){
            go(xl_list[i]);
        }
    }
}
function rc_Func(){
    if(btnList3.list['隐藏按钮'].innerText == '隐藏按钮'){
        hideButton(btnList3);
        btnList3.list['隐藏按钮'].innerText = '日常任务'
    }else{
        btnList3.list['隐藏按钮'].innerText = '隐藏按钮'
        showButton(btnList3);
    }
}
//签到
function qd_Func(){
   go('vip drops');//领通勤
    //go('jh 1;event_1_21024726;e;n;n;w;event_1_24319712;home');//领礼包御寒衣探查
    go('jh 1;event_1_21024726;home');//领礼包
    go('vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;');//10次暴击
    go('vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig');//挖宝
    go('vip finish_fb dulongzhai;vip finish_fb dulongzhai;vip finish_fb junying;vip finish_fb junying;vip finish_fb beidou;vip finish_fb beidou;vip finish_fb youling;vip finish_fb youling;vip finish_fb siyu;vip finish_fb changleweiyang');//副本扫荡
    go('vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;');//钓鱼
    go('clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;clan incense yx;');//上香
    go('sort;sort fetch_reward;');//排行榜奖励
    go('shop money_buy mny_shop1_N_10');//买引路蜂
    //go('shop money_buy mny_shop9_N_10;shop money_buy mny_shop9;shop money_buy mny_shop9;shop money_buy mny_shop9;shop money_buy mny_shop9;shop money_buy mny_shop9');//买毒琥珀
    //go('shop money_buy mny_shop10_N_10;shop money_buy mny_shop10;shop money_buy mny_shop10;shop money_buy mny_shop10;shop money_buy mny_shop10;shop money_buy mny_shop10');//买毒藤胶
    go('clan buy 201;clan buy 201;clan buy 302;clan buy 302;clan buy 302;clan buy 302;clan buy 302;clan buy 401');//帮派买金锭
    go("share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;share_ok 7;");//分享
    go('cangjian get_all;xueyin_shenbinggu blade get_all;xueyin_shenbinggu unarmed get_all;xueyin_shenbinggu throwing get_all;xueyin_shenbinggu spear get_all;xueyin_shenbinggu hammer get_all;xueyin_shenbinggu stick get_all');//闯楼奖励
    go('jh 5;n;n;n;w;sign7;home;');//扬州签到
    go('jh 1;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;home;');//消费积分和谜题卡
    //go("jh 1;e;n;e;e;e;e;n;lq_bysf_lb;lq_lmyh_lb;home;");//比翼双飞和劳模英豪
    go('jh 2;n;n;n;n;n;n;n;e;tzjh_lq;w;n;n;n;n;n;n;n;n;n;n;n;n;e;n;n;n;w;event_1_31320275;home');//采莲
    go('jh 26;w;w;n;e;e;event_1_18075497;home');//大招采矿
    go('jh 26;w;w;n;n;event_1_14435995;home');//大招破阵
    go("jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n;event_1_97487911;home");//绝情谷鳄鱼
    go('jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;home'); //冰火岛玄重铁
    //go('jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w;event_1_712982;event_1_712982 go;home');//买冰糖葫芦
    //go("jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;event_1_56989555 go;home");//唐门试练
    //go("jh 28;n;w;w;w;w;w;w;nw;ne;nw;ne;nw;ne;e");//射雕
}
function XhQd_Func(){
 go('shop money_buy mny_shop1_N_10');//买引路蜂
 go('jh 5;n;n;n;w;sign7;home;');//扬州签到
 go("share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;share_ok 7;");//分享
 go('jh 2;n;n;n;n;n;n;n;e;tzjh_lq;home');//领取投资奖励
 go("home;clan;clan scene;clan fb;clan fb saodang shenshousenlin;clan fb go_saodang shenshousenlin;clan fb saodang daxuemangongdao;clan fb go_saodang daxuemangongdao;home");
 go("jh 1;event_1_21024726");
 go("home");
}
//试剑
function sj_Func(){
    var interval = setInterval(function(){
        if(!g_gmain.is_fighting){
            clickButton('swords select_member taoist_zhangtianshi');  //张天师
            clickButton('swords select_member dali_yideng');   //古灯大师
            clickButton('swords select_member gumu_yangguo');   //神雕大侠
            clickButton('swords fight_test go', 0);
        }
        if($('span:contains("你今天试剑次数已达限额。")').length>0){
            clearInterval(interval);
        }
    },500);
}
//采莲
function cl_Func(){
    go('jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;n;n;n;w;event_1_31320275;'+'jh 26;w;w;n;n;event_1_14435995;s;e;e;event_1_18075497;'+'jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n;event_1_97487911;');
}
function by1_Func(){
    go('jh 14;w;n;n;n;n;event_1_32682066;event_1_83460220;kill-龙纹兽;event_1_75500753;kill-玄武机关兽;event_1_17623983;event_1_6670148;kill-混沌妖灵;s;kill-冰月仙人');
}
function by2_Func(){
    go('jh 26');
}
function tm_Func(){
    go('jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;event_1_56989555');
}
function dzpz_Func(){
    go('jh 26;w;w;n;n;event_1_14435995;s;e;e;event_1_18075497');
}
function yh_Func(){
    go('jh 26;w;w;n;w;w;w;n;n;event_1_12853448');
}
function xzt_Func(){
    go('jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632');
}
function jqg_Func(){
    go('jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n;event_1_97487911');
}
function xkd_Func(){
    if(btnList3.list['侠客岛'].innerText == '侠客岛'){
        ddxl_interval = setInterval(function(){
            ddxl(['侠客岛渡口','书房','崖底','石门'],['e;ne;ne;ne;e;e;e;event_1_9179222;e;event_1_11720543','w;n;e;e;s;e;event_1_44025101','event_1_4788477;nw;w;sw;w;n;n;n;w;w;s;w;nw;w;e;ne;ne;ne;e;e;e;e;e;s;e;event_1_44025101','event_1_36230918;e;e;s;event_1_77496481'])
        },1000);
        btnList3.list['侠客岛'].innerText = '停侠客岛';
    }else{
        btnList3.list['侠客岛'].innerText = '侠客岛';
        clearInterval(ddxl_interval);
    }
}
function ts_Func(){
    go('jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791-失足岩;nw;n;ne;nw;nw;w;n;n;n;e;e;s');
}
function dcww_Func(){
    go('jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;w;w;event_1_57281457');
}
//青城
function qc_Func(){
    go('jh 15;n;nw;w;nw;n;event_1_14401179;kill-孽龙之灵;'+
       'jh 21;n;n;n;n;w;kill-青衣盾卫;w;kill-飞羽神箭;w;kill-银狼近卫;w;fight-军中主帅;'+
       'jh 21;n;n;n;n;e;e;e;e;e;e;e;s;s;event_1_66710076;s;e;ne;e;se;n;event_1_53430818;n;kill-豹军主帅;s;s;nw;n;n;kill-虎军主帅;s;s;se;e;e;e;kill-鹰军主帅;w;w;w;nw;w;nw;event_1_89411813;kill-颉利;'+
       ';jh 8;ne;e;e;e;n;kill-赤豹死士;n;n;kill-黑鹰死士;n;n;kill-金狼大将;e;e;e;event_1_55885405;w;n;event_1_19360932 go;kill-乞利;s;s;kill-黑羽敌将;n;w;s;kill-阿保甲;n;e;e;event_1_53216521;'+
       'jh 13;e;s;s;w;w;w;event_1_38874360;kill-渡风神识;'+
       'jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287;kill-九幽毒魔;'+
       'jh 9;event_1_20960851;kill-杀神寨匪首;'
      );
}
function em_Func(){
    if(btnList3.list['峨眉'].innerText == '峨眉'){
        fb_obj.fb =0;
        fb_obj.Interval_fb= setInterval(fb_go,200,'',['赤豹死士','黑鹰死士','金狼大将'],'jh 8;ne;e;e;e;n;n;n;n;n;e;e;n;event_1_19360932');
        btnList3.list['峨眉'].innerText = '停峨眉'
    }else{
        btnList3.list['峨眉'].innerText = '峨眉';
        clearInterval(fb_obj.Interval_fb);
    }
}
function jl_Func(){
    if(btnList3.list['峨眉军令'].innerText == '峨眉军令'){
        fb_obj.fb =0;
        fb_obj.Interval_fb= setInterval(fb_go,200,'',['乞利','黑羽敌将','阿保甲'],'event_1_55885405;w;n;event_1_19360932 go;s;s;n;w;s;n;e;e;event_1_53216521');
        btnList3.list['峨眉军令'].innerText = '停军令'
    }else{
        btnList3.list['峨眉军令'].innerText = '峨眉军令'
        clearInterval(fb_obj.Interval_fb);
    }
}
function hs_Func(){
    go('jh 9;event_1_20960851');
}
function dj_Func(){
    go('jh 13;e;s;s;w;w;w;event_1_38874360');
}
function tsqj_Func(){
    go('jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939-星星峡;ne;ne;nw;nw');

}
function mjdm_Func(){
    go('jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287');
}
function answerquestions_Func(){
    if($('span:contains(每日武林知识问答次数已经)').text().slice(-23) == "每日武林知识问答次数已经达到限额，请明天再来。") {
        // 今天答题结束了
        //console.log("完成自动答题！");
        InforOutFunc("已完成自动答题！");
        go('home');
        btnList3.list['开答题'].innerText = "开答题";
        return;
    }else {
        go('question');
        btnList3.list['开答题'].innerText = "正在答题";
        return;
        }
    }

function PozhangFunc(){
     go("jh 31;n;se;e;;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;e;e;event_1_94442590;event_1_85535721");//破障除魔
}
function lihuoshiFunc(){
    go('jh 1;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;event_1_29721519;event_1_60133236;home');//李火师领奖
}
//一键VIP师门及帮派
function VipFunc(){
            alert("VIP专用\n\n请手动完成最后一个任务");
            /*var panduan1= $('span:contains(今天做的帮派任务').text().slice(-17)== "今天做的帮派任务已过量，明天再来。";
            var panduan2= $('span:contains(今日帮派任务已做完。').text().slice(-10)=="今日帮派任务已做完。";
            var panduan3= $('span:contains(没有开通VIP月卡').text().slice(-15)=="没有开通VIP月卡，请先开通。";
            InforOutFunc(panduan1);
            InforOutFunc(panduan2);
            InforOutFunc(panduan3);
            //go("home;clan;clan scene;clan task");
           // go("home;family_quest;");
            //if(msg.indexof('今天做的帮派任务已过量，明天再来。')==-1 || msg.indexof('今日帮派任务已做完。') ==-1|| msg.indexof('没有开通VIP月卡，请先开通。'))
             do{go('vip finish_clan');
               panduan1= $('span:contains(今天做的帮派任务').text().slice(-17)== "今天做的帮派任务已过量，明天再来。";
               panduan2= $('span:contains(今日帮派任务已做完。').text().slice(-10)=="今日帮派任务已做完。";
               panduan3= $('span:contains(没有开通VIP月卡').text().slice(-15)=="没有开通VIP月卡，请先开通。";}while (!panduan1||!panduan2||!panduan3);
             //do{go('vip finish_clan')}while ($('span:contains(今天做的帮派任务').text().slice(-17)== "今天做的帮派任务已过量，明天再来。"|| $('span:contains(今日帮派任务已做完。').text().slice(-10)=="今日帮派任务已做完。"|| $('span:contains(没有开通VIP月卡，请先开通。').text().slice(-15)=="没有开通VIP月卡，请先开通。");

            //do{go('vip finish_family')}while(!msg.match(/今天做的师门任务已过量，明天再来。/) || !msg.match(/今日师门任务已做完。/) || !msg.match(/没有开通VIP月卡，请先开通。/));
			//go("home;clan;clan scene;clan task");*/

            go("home;clan;clan scene;clan task");
      var VIPbangpai_interval=null;
      var VIPshimen_interval=null;
       /*  VIPbangpai_interval=setInterval(function(){
               if($('.out2:last').text() =="今日帮派任务已做完。"||$('.out2:last').text() == "今天做的帮派任务已过量，明天再来。"||$('.out2:last').text() =="没有开通VIP月卡，请先开通。"){
                  clearInterval(VIPbangpai_interval);
                } else {
                go('vip finish_clan');
               }
            },150)


    go("home;family_quest;");
     VIPshimen_interval=setInterval(function(){
                 go('vip finish_family');
                if($('.out2:last').text() =="今日师门任务已做完。"||$('.out2:last').text() == "今天做的师门任务已过量，明天再来。"||$('.out2:last').text() =="没有开通VIP月卡，请先开通。"){
                  clearInterval(VIPshimen_interval);
                } else {
                go('vip finish_family');
               }
            },150)
          // go("home;family_quest;");*/
    VIPbangpai_interval=setInterval(function(){
              if($('span:contains("没有开通VIP月卡，请先开通。")').length>0 || $('span:contains("今天做的帮派任务已过量，明天再来。")').length>0 || $('span:contains("今日帮派任务已做完。")').length>0){
                  //InforOutFunc($('span:contains("没有开通VIP月卡，请先开通。")').length);
                 clearInterval(VIPbangpai_interval);
                } else {
                go('vip finish_clan');
               }
            },300)

    go("home;family_quest;");
     VIPshimen_interval=setInterval(function(){
               if($('span:contains("今日师门任务已做完。")').length>0 ||$('span:contains("今天做的师门任务已过量，明天再来。")').length>0||$('span:contains("没有开通VIP月卡，请先开通。")').length>0){
                   InforOutFunc($('span:contains("没有开通VIP月卡，请先开通。")').length);
                   clearInterval(VIPshimen_interval);
                } else {
                go('vip finish_family');
               }
            },150)



}
//打榜
function FightPaiHang(){
     clickButton('sort');
     clickButton('sort sortinfo 1');
     clickButton('fight_hero 1');
     var FTPH_interval=setInterval(function(){
        if($('span.outbig_text:contains(胜利)').length>0){
        clickButton('prev_combat');
        dhgo('fight_hero 1');
        }
        else if( isContains($('span:contains(今日挑战)').text().slice(-19), '今日挑战高手的次数已达上限，明日再来。')){
        clearInterval(FTPH_interval);
        clickButton('home');
        console.log('打完收工！');
        }
    },300)
}


//end-list3--------------------

//按钮列表4-------------------------------------------------------------------------
var btnList4 = new BtnList(10,anniu_weizhi_right-3*anniu_pianyi);
createButton('隐藏按钮',js_Func,btnList4);
createButton('青龙监视',qljs_Func,btnList4);
createButton('全服果子',qfgz_Func,btnList4);
createButton('特殊正邪',tszx_Func,btnList4);
createButton('正邪监视',zxjs_Func,btnList4);
createButton('任务监视',rwjs_Func,btnList4);
createButton('江湖悬红',jhxh_Func,btnList4);
createButton('游侠监视',yxjs_Func,btnList4);
createButton('观舞监视',gwjs_Func,btnList4);
createButton('活动监视',hdjs_Func,btnList4);
createButton('逃犯监视',tfjs_Func,btnList4);
createButton('奇侠监视',qxjs_Func,btnList4);
createButton('奇侠对话',qxdh_Func,btnList4);
createButton('奇侠果子',qxgz_Func,btnList4);
createButton('杀天剑',stj_Func,btnList4);
createButton('进入跨服',jrkf_Func,btnList4);
createButton('生死簿',ssb_Func,btnList4);
createButton('清空谜题',qkmt_Func,btnList4);
createButton('回主页',zy_Func,btnList4);
function js_Func(){
    if(btnList4.list['隐藏按钮'].innerText == '隐藏按钮'){
        hideButton(btnList4);
        btnList4.list['隐藏按钮'].innerText = '监视'
    }else{
        btnList4.list['隐藏按钮'].innerText = '隐藏按钮'
        showButton(btnList4);
    }
}
//青龙监视
function qljs_Func(){
    if(btnList4.list['青龙监视'].innerText == '青龙监视'){
        btnList4.list['青龙监视'].innerText = '停青龙';
        Jianshi.ql =1;
    }else{
        Jianshi.ql =0;
        btnList4.list['青龙监视'].innerText = '青龙监视';
    }
}
//全服果子
function qfgz_Func(){
    if(btnList4.list['全服果子'].innerText == '全服果子'){
        btnList4.list['全服果子'].innerText = '停混朱果';
        Jianshi.zhuguo =1;
    }else{
        Jianshi.zhuguo =0;
        btnList4.list['全服果子'].innerText = '全服果子';
    }
}
//特殊正邪
function tszx_Func(){
    if(btnList4.list['特殊正邪'].innerText == '特殊正邪'){
        btnList4.list['特殊正邪'].innerText = '特殊正';
        if($('.outtitle').text().indexOf('地室')==-1){
            go('jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;e;event_1_2215721');
        }
        Jianshi.teshu =1;
    }else if(btnList4.list['特殊正邪'].innerText == '特殊正'){
        Jianshi.teshu =2;
        btnList4.list['特殊正邪'].innerText = '特殊邪';
    }else if(btnList4.list['特殊正邪'].innerText == '特殊邪'){
        Jianshi.teshu =0;
        btnList4.list['特殊正邪'].innerText = '特殊正邪';
    }
}
//正邪监视
function zxjs_Func(){
    if(btnList4.list['正邪监视'].innerText == '正邪监视'){
        btnList4.list['正邪监视'].innerText = '正气';
        Jianshi.zhengxie =1;
    }else if(btnList4.list['正邪监视'].innerText == '正气'){
        Jianshi.zhengxie =2;
        btnList4.list['正邪监视'].innerText = '邪气';
    }else{
        Jianshi.zhengxie =0;
        btnList4.list['正邪监视'].innerText = '正邪监视';
    }
}
//任务监视
var rwjs_interval = null;
var rwts = [['可以回去找(.*)交差了','回去(告诉|转告)(.*)吧。','我有个事情想找(.*)，','我想找(.*)商量一点事情'],//对话
    ['被(.*)抢走了，去替我','道：(.*)十分嚣张','道：(.*)好大胆','道：(.*)竟敢得罪我','我十分讨厌那(.*)，','：给我在(.*)内战胜(.*)。','你现在的任务是战胜(.*)。'],//比试
    ['道：(.*)昨天捡到了','道：(.*)竟对我横眉瞪眼','竟然吃了(.*)的亏','：给我在(.*)内杀(.*)。','你现在的任务是杀(.*)。'],//叫杀
    ['道：(.*)看上去好生奇怪','道：(.*)鬼鬼祟祟的',],//打探
    ['道：唉，好想要一(.)(.*)啊。','道：唉，好想要一(.)(.*)啊。','道：突然想要一(.)(.*)，','：给我在(.*)内寻找(.*)。','你现在的任务是寻找(.*)。'],//捡东西
    ['我将(.*)藏在了(.*)，'],//仔细搜索
           ]
function rwjs_Func(){
     if(btnList4.list['任务监视'].innerText == '任务监视'){
        btnList4.list['任务监视'].innerText = '停止任务';
        Jianshi.renwu =1;
    }else{
        Jianshi.renwu =0;
        btnList4.list['任务监视'].innerText = '任务监视';
    }
}
//执行任务
function do_task(task){
    if(task){
        console.log(task);
        for(var i = 0;i<rwts.length;i++){
            for(var j = 0;j<rwts[i].length;j++){
                if( task.match(rwts[i][j]) ){
                    var w = task.match(rwts[i][j]);
                    console.log(w);
                    if(w[w.length-1].indexOf('-')!=-1){
                        w = w[1].split('-');
                    }
                    var target = w[w.length-1];
                    console.log(target);
                    switch(i){
                        case 0 :go('ask-'+target);break;
                        case 1 :go('fight-'+target);break;
                        case 2 :go('kill-'+target);break;
                        case 3 :go('npc_datan-'+target);break;
                        case 4 :{
                            if(task.match('任务所在地方好像是：(.*)-(.*)-(.*)')){
                            }else{
                                if(Jianshi.task_type == 2){
                                    go('get-'+target+';clan scene;clan submit_task');
                                }else if(Jianshi.task_type == 3){
                                    go('get-'+target+';go_family;');
                                }
                            }
                        };break;
                        case 5:go('room_sousuo');break;
                        default:console.log('错误');break;;
                    }
                }
            }
        }
    }
}
//杀死 比试 对话 打探-------给予，物品，搜索此地待完成
function kill_task(npcName){
    if(g_gmain.is_fighting){
        return -1;//战斗中
    }
    var r = g_obj_map.get("msg_room");
    if(r){
        for (var b = 1; r.get("npc" + b); b++){
            var l = r.get("npc" + b).split(',');
            if(g_simul_efun.replaceControlCharBlank(l[1]) == npcName){
                clickButton('kill ' + l[0]);
            }
        }
    }
}
function fight_task(npcName){
    if(g_gmain.is_fighting){
        return -1;//战斗中
    }
    var r = g_obj_map.get("msg_room");
    if(r){
        for (var b = 1; r.get("npc" + b); b++){
            var l = r.get("npc" + b).split(',');
            if(g_simul_efun.replaceControlCharBlank(l[1]) == npcName){
                clickButton('fight ' + l[0]);
                task = null;
                return 1;
            }
        }
    }
}
function ask_task(npcName){
    if(g_gmain.is_fighting){
        return -1;//战斗中
    }
    var r = g_obj_map.get("msg_room");
    if(r){
        for (var b = 1; r.get("npc" + b); b++){
            var l = r.get("npc" + b).split(',');
            if(g_simul_efun.replaceControlCharBlank(l[1]) == npcName){
                clickButton('ask ' + l[0]);
                task = null;
                return 1;
            }
        }
    }
}
function dt_task(npcName){
    if(g_gmain.is_fighting){
        return -1;//战斗中
    }
    var r = g_obj_map.get("msg_room");
    if(r){
        for (var b = 1; r.get("npc" + b); b++){
            var l = r.get("npc" + b).split(',');
            if(g_simul_efun.replaceControlCharBlank(l[1]) == npcName){
                clickButton('npc_datan ' + l[0]);
                task = null;
                return 1;
            }
        }
    }
}
function get_task(wpName){
    var r = g_obj_map.get("msg_room");
    for(var i =1;r.get('item'+i);i++){
        if(ys_replace(r.get('item'+i).split(',')[1])==wpName){
            clickButton('get '+r.get('item'+i).split(',')[0]);
            task = null;
            return 1;
        }
    }
}
function cmd_task(cmdName){
    var r = g_obj_map.get("msg_room");
    if(r){
        for(var i =1;r.get('cmd'+i);i++){
            if( ys_replace(r.get('cmd'+i+'_name')).indexOf(cmdName)!=-1 ){
                go(r.get('cmd'+i));
                return 1;
            }
        }
    }
}
//悬红任务
var jhxh_Interval = null;
function jhxh_Func(){
    if(btnList4.list['江湖悬红'].innerText == '江湖悬红'){
        btnList4.list['江湖悬红'].innerText = '停止悬红';
        Jianshi.xuanhong =1;
        Jianshi.xhnpc = [];
        go('jh 1;w;event_1_40923067;');
        jhxh_Interval = setInterval(function(){
            for(var i=0;i<Jianshi.xhnpc.length;i++){
                if(ask_task(Jianshi.xhnpc[i]) ==1){
                    Jianshi.xhnpc.splice(i,1);
                }
            }
        },300);
    }else{
        Jianshi.xuanhong =0;
        clearInterval(jhxh_Interval);
        btnList4.list['江湖悬红'].innerText = '江湖悬红';
    }
}
//游侠监视
function yxjs_Func(){
    if(btnList4.list['游侠监视'].innerText == '游侠监视'){
        btnList4.list['游侠监视'].innerText = '停游侠';
        Jianshi.yx = 1;
    }else{
        Jianshi.yx =0;
        btnList4.list['游侠监视'].innerText = '游侠监视';
    }
}
//观舞监视
var gw_interval = null;
function gwjs_Func(){
    if(btnList4.list['观舞监视'].innerText == '观舞监视'){
        btnList4.list['观舞监视'].innerText = '停观舞';
        Jianshi.gw = 1;
        go('rank go 161;w;w;w;w;w;n;n;n;e;e;');
    }else{
        Jianshi.gw =0;
        btnList4.list['观舞监视'].innerText = '观舞监视';
    }
}
//
function hdjs_Func(){
    if(btnList4.list['活动监视'].innerText == '活动监视'){
        btnList4.list['活动监视'].innerText = '停活动';
        Jianshi.hd = 1;
    }else{
        Jianshi.hd =0;
        btnList4.list['活动监视'].innerText = '活动监视';
    }
}
//逃犯监视
function tfjs_Func(){
    if(btnList4.list['逃犯监视'].innerText == '逃犯监视'){
        btnList4.list['逃犯监视'].innerText = '停逃犯';
        Jianshi.tf = 1;
    }else{
        Jianshi.tf =0;
        btnList4.list['逃犯监视'].innerText = '逃犯监视';
    }
}
//奇侠监视
function qxjs_Func(){
    clickButton('open jhqx', 0);
}
//奇侠对话
var qx_stop = 0;
var qxdh_interval = null;
function qxdh_Func(){
    var a = prompt("输入奇侠名字-方式");
    if(a){
        var fs = a.split(' ')[1];
        a = a.split(' ')[0];
        clickButton('open jhqx', 0);
        Jianshi.qx =1;
        qxdh_interval = setInterval(function(){
            //20次 结束
            if(Jianshi.qxhg>=19){
                Jianshi.qx =0;
                clearInterval(qxdh_interval);
            }
            switch(qx_stop){
                case 0:{
                    //对话 给金子 加好感
                    var qxid = fj_npc(a);
                    if(qxid){
                        if(fs == '1'){
                            //ask
                            go('ask '+qxid);
                            qx_stop = 2;
                        }else if(fs == '2'){
                            //auto_zsjd20_fengwuhen
                            go('auto_zsjd20_'+qxid.split('_')[0]);
                            qx_stop = 2;
                        }else if(fs == '3'){
                            if(Jianshi.qxmj<3 || Jianshi.qxmj >=5){
                                go('ask '+qxid);
                                qx_stop = 2;
                            }else if(Jianshi.qxmj ==3){
                                go('auto_zsjd_'+qxid.split('_')[0]);
                                qx_stop = 2;
                            }else if(Jianshi.qxmj ==4){
                                go('auto_zsjd20_'+qxid.split('_')[0]);
                                qx_stop = 2;
                            }
                        }
                    }else{
                        var h = ys_replace(g_obj_map.get("msg_html_page").get("msg"));
                        if(h){
                            var g = h.match('find_task_road qixia (.{1,2})'+a);
                            clickButton('find_task_road qixia '+ g[1]);
                        }
                    }
                };break;
                case 1:{
                    //出现秘境
                    //仔细搜寻 clickButton('find_task_road secret', 0);
                    var zxsx = fj_an('仔细搜寻');
                    var zxss = fj_an('仔细搜索');
                    var sd = fj_an('扫荡');
                    if(zxsx){
                        clickButton(zxsx);
                    }
                    //扫荡
                    if(sd){
                        clickButton(zxss);
                        clickButton(sd +' go');
                        qx_stop=0;
                    }else{
                        //仔细搜索
                        if(zxss){
                            clickButton(zxss);
                            qx_stop=0;
                        }
                    }
                };break;
                case 2:{
                    //等待
                };break;
            }
        },500);
    }else{
        Jianshi.qx =0;
        clearInterval(qxdh_interval);
    }
}

//获取房间按钮
function fj_an(name){
    var r = g_obj_map.get("msg_room");
    if(r){
        for (var b = 1; r.get("cmd"+b+'_name'); b++){
            if( name == ys_replace(r.get("cmd"+b+'_name')) ){
                return r.get('cmd'+b);
            }
        }
        return 0;
    }else{
        return 0;
    }
}
//获取房间npc
var all_npc = [];
function fj_npc(name){
    all_npc = [];
    var r = g_obj_map.get("msg_room");
    var id = null;
    if(r){
        for (var b = 1; r.get("npc" + b); b++){
            var l = r.get("npc" + b).split(',');
            all_npc.push(l[0]);
            if( name ==ys_replace(l[1]) ){
                id = l[0];
            }
        }
    }
    return id
}
//
//奇侠果子
var currentTime = 0;
var delta_Time = 2000;
var qinmiFinished=0;
var QiXiaList=[];
function qxgz_Func(){
    var QiXiaList_Input= "";
    //打开 江湖奇侠页面。
    if (QXStop==0){
        clickButton('open jhqx', 0);
        GetQiXiaList();
    }else if (QXStop==1&&qinmiFinished==0){
        QXStop=0;
        QiXiaTalkButton.innerText = '奇侠领朱果';
    }else if (QXStop==1&&qinmiFinished==1){
        QXStop=0;
        QixiaList=[];
        finallist=[];
        QXTalkcounter=1;
        QixiaTotalCounter=0;
        clickButton('open jhqx', 0);
        GetQiXiaList();
    }
}
var QXretried=0;
var QXStop=0;
var QXTalkcounter=1;
var QxTalking=0;
function GetQXID(name,QXindex){
    if (QXStop==1&&qinmiFinished==1){
        return;
    }else if (g_obj_map.get("msg_room")==undefined||QXStop==1){
        setTimeout(function(){GetQXID(name,QXindex);},300);
    }else{
        //console.log("开始寻找"+name+QXindex);
        var QX_ID = "";
        var npcindex=0;
        var els=g_obj_map.get("msg_room").elements;
        for (var i = els.length - 1; i >= 0; i--) {
            if (els[i].key.indexOf("npc") > -1) {
                if (els[i].value.indexOf(",") > -1) {
                    var elsitem_ar = els[i].value.split(',');
                    if (elsitem_ar.length > 1 && elsitem_ar[1] == name) {
                        //console.log(elsitem_ar[0]);
                        npcindex=els[i].key;
                        QX_ID = elsitem_ar[0];
                    }
                }
            }
        }
        if (QX_ID==null||QX_ID==undefined||QX_ID==0){
            clickButton('find_task_road qixia '+QXindex);
            setTimeout(function(){GetQXID(name,QXindex);},300);
        }else{
            //console.log("找到奇侠编号"+QX_ID);
            if (QXTalkcounter<=5){
                //console.log("开始与"+name+"第"+QXTalkcounter+"对话")
                QXTalkcounter++;
                clickButton('ask '+QX_ID);
                clickButton('find_task_road qixia '+QXindex);
                setTimeout(function(){GetQXID(name,QXindex)},300);
            }else if (QXTalkcounter>5){
                QXTalkcounter=1;
                //console.log("与"+name+"对话完成");
                QixiaTotalCounter++;
                //console.log("GetQXid:奇侠第"+QixiaTotalCounter+"号状态：" + finallist[QixiaTotalCounter]);
                if (QixiaTotalCounter>24){
                    //console.log("今日奇侠已经完成");
                }else{
                    //console.log("下一个目标是"+finallist[QixiaTotalCounter]["name"]);
                }
                talktoQixia();
            }
        }

    }
}
var QixiaTotalCounter=0;
function TalkQXBase(name,QXindex){
    var QX_NAME = name;
    //console.log("开始撩" + QX_NAME + "！");
    if (g_obj_map.get("msg_room")!=undefined)
        g_obj_map.get("msg_room").clear();
    overrideclick('find_task_road qixia ' + QXindex);
    overrideclick('golook_room');
    setTimeout(function(){GetQXID(QX_NAME,QXindex);},500);
}

function TalkLangHuanYu(){
    // 0 浪欢愉
    if (QXStop==1){
        return;
    }
    TalkQXBase("浪唤雨",0);
}
function TalkWangRong(){
    // 1 王蓉，要果子
    if (QXStop==1){
        return;
    }
    TalkQXBase("王蓉",1);
}
function TalkPangTong(){
    // 2 庞统
    if (QXStop==1){
        return;
    }
    TalkQXBase("庞统",2);
}
function TalkLiYuFei(){
    // 3 李宇飞，要果子
    if (QXStop==1){
        return;
    }
    TalkQXBase("李宇飞",3);
}
function TalkBuJingHong(){
    //4  步惊魂
    if (QXStop==1){
        return;
    }
    TalkQXBase("步惊鸿",4);
}
function TalkFengXingJu(){
    //5 风行骓
    if (QXStop==1){
        return;
    }
    TalkQXBase("风行骓",5);
}
function TalkGuoJI(){
    // 6 郭记
    if (QXStop==1){
        return;
    }
    TalkQXBase("郭济",6);
}
function TalkWuZhen(){
    // 7 吴缜
    if (QXStop==1){
        return;
    }
    TalkQXBase("吴缜",7);
}
function TalkFengNan(){
    // 8 凤南
    if (QXStop==1){
        return;
    }
    TalkQXBase("风南",8);
}
function TalkHuoYunXieShen(){
    //9 火云邪神
    if (QXStop==1){
        return;
    }
    TalkQXBase("火云邪神",9);
}
function TalkNiFengWu(){
    //10 逆风舞
    if (QXStop==1){
        return;
    }
    TalkQXBase("逆风舞",10);
}
function TalkCangGuYan(){
    //11 狐苍雁
    if (QXStop==1){
        return;
    }
    TalkQXBase("狐苍雁",11);
}
function TalkHuZhu(){
    //12 护竺
    if (QXStop==1){
        return;
    }
    TalkQXBase("护竺",12);
}
function TalkXuanYueYan(){
    //13 玄月研
    if (QXStop==1){
        return;
    }
    TalkQXBase("玄月研",13);
}
function TalkLangJuXu(){
    //14 狼居胥
    if (QXStop==1){
        return;
    }
    TalkQXBase("狼居胥",14);
}
function TalkLieJiuZhou(){
    //15 烈九州
    if (QXStop==1){
        return;
    }
    TalkQXBase("烈九州",15);
}
function TalkMuMiaoYu(){
    //16 穆妙羽
    if (QXStop==1){
        return;
    }
    TalkQXBase("穆妙羽",16);
}
function TalkYuWenWuDi(){
    //17 宇文无敌
    if (QXStop==1){
        return;
    }
    TalkQXBase("宇文无敌",17);
}
function TalkLiXuanBa(){
    //18 李玄霸
    if (QXStop==1){
        return;
    }
    TalkQXBase("李玄霸",18);
}
function TalkBaBuLongJiang(){
    //19 八部龙将
    if (QXStop==1){
        return;
    }
    TalkQXBase("八部龙将",19);
}
function TalkFengWuHen(){
    //20 风无痕
    if (QXStop==1){
        return;
    }
    TalkQXBase("风无痕",20);
}
function TalkLiCangRuo(){
    //21 厉沧若
    if (QXStop==1){
        return;
    }
    TalkQXBase("厉沧若",21);
}
function TalkXiaYueQing(){
    //22 夏岳卿
    if (QXStop==1){
        return;
    }
    TalkQXBase("夏岳卿",22);
}
function TalkMiaoWuXin(){
    //23 妙无心
    if (QXStop==1){
        return;
    }
    TalkQXBase("妙无心",23);
}
function TalkWuYeJi(){
    //24 巫夜姬
    if (QXStop==1){
        return;
    }
    TalkQXBase("巫夜姬",24);
}
function GetQiXiaList(){
    var html=g_obj_map.get("msg_html_page");
    QxTalking=1;
    if (html==undefined){
        setTimeout(function(){GetQiXiaList();},500);
    }else if(g_obj_map.get("msg_html_page").get("msg").match("江湖奇侠成长信息")==null){
        setTimeout(function(){GetQiXiaList();},500);
    }else{
        QiXiaList=formatQx(g_obj_map.get("msg_html_page").get("msg"));
        //console.log(QiXiaList);
        SortQiXia();
    }
}
function SortQiXia(){//冒泡法排序
    var temp={};
    var temparray=[];
    var newarray=[];
    for (var i=0;i<QiXiaList.length;i++){
        for (var j=1;j<QiXiaList.length-i;j++){
            if (parseInt(QiXiaList[j-1]["degree"])<parseInt(QiXiaList[j]["degree"])){
                temp=QiXiaList[j-1];
                QiXiaList[j-1]=QiXiaList[j];
                QiXiaList[j]=temp;
            }
        }
    }
    var tempcounter=0;
    //console.log("奇侠好感度排序如下:");
    //console.log(QiXiaList);
    //首次排序结束 目前是按照由小到大排序。现在需要找出所有的超过25000 小于30000的奇侠。找到后 排序到最上面；
    for (var i=0;i<QiXiaList.length;i++){
        if (parseInt(QiXiaList[i]["degree"])>=25000&&parseInt(QiXiaList[i]["degree"])<30000){
            temparray[tempcounter]=QiXiaList[i];
            tempcounter++;
            newarray.push(i);
        }
    }
    //console.log(temparray);
    //console.log("提取满朱果好感度排序如下:");
    for (var i=0;i<QiXiaList.length;i++){
        if (newarray.indexOf(i)==-1){
            temparray[tempcounter]=QiXiaList[i];
            tempcounter++;
        }
    }
    var over3=[];
    //console.log(temparray);//第一次排序结束。现在要挑出所有超过3万的亲密 并且放到最后。
    for (var i=0;i<temparray.length;i++){
        if (parseInt(temparray[i]["degree"])>=30000){//找到3万以上的
            over3.push(i);//push超过3万的序号
        }
    }
    //console.log(over3);
    var overarray=[];
    var overcounter=0;
    for (var i=0;i<temparray.length;i++){ //第一遍循环 找到不在3万列表中的
        if (over3.indexOf(i)<0){
            overarray[overcounter]=temparray[i];
            overcounter++;
        }
    }
    //console.log(overarray);
    for (var i=0;i<temparray.length;i++){//第二遍循环 把列表中的插入
        if (over3.indexOf(i)>=0){
            overarray[overcounter]=temparray[i];
            overcounter++;
        }
    }
    finallist=[];
    finallist=overarray;
    //console.log(finallist);
    getZhuguo();
}
function getZhuguo(){
    var msg="";
    //console.log(finallist);
    for (var i=0;i<4;i++){//只检查 头四个奇侠是不是在师门，是不是已经死亡。
        if (finallist[i]["isOk"]!=true){
            msg+=finallist[i]["name"]+" ";
        }
    }
    talktoQixia();
}
var unfinish="";
function talktoQixia(){
    //console.log("talktoqixia-奇侠-目前计数" + QixiaTotalCounter);
    //console.log(finallist[QixiaTotalCounter]);
    if (QixiaTotalCounter<=24){// 奇侠list仍然有元素。开始调取排列第一个的奇侠
        var Qixianame="";
        var QixiaIndex=0;
        //console.log(finallist[QixiaTotalCounter]["name"]);
        Qixianame=finallist[QixiaTotalCounter]["name"];
        QixiaIndex=finallist[QixiaTotalCounter]["index"];
        if (finallist[QixiaTotalCounter]["isOk"]!=true){
            //            alert("奇侠"+Qixianame+"目前不在江湖，可能死亡，可能在师门。领取朱果中断，请在一段时间之后重新点击领取朱果按钮。无需刷新页面");
            //console.log("talktoqixia-奇侠"+Qixianame+"目前不在江湖，可能死亡，可能在师门。");
            QixiaTotalCounter++;
            setTimeout(talktoQixia,500);
            // return;
        }else{
            //console.log(finallist[QixiaTotalCounter]);
            clickButton('find_task_road qixia '+QixiaIndex);
            //console.log(QixiaIndex);
            GetQXID(Qixianame,QixiaIndex);
        }
    }else{
        //alert("今日奇侠已经完成");
        return;
    }
}
var finallist=[];
// 格式话奇侠数据并返回数组
function formatQx(str){
    var tmpMsg = removeSpec(str);
    var arr = tmpMsg.match(/<tr>(.*?)<\/tr>/g);
    var qxArray = [];
    var qxInfo = {};
    if(arr){
        for(var i = 0;i < arr.length;i++){
            qxInfo = {};
            arr2 = arr[i].match(/<td[^>]*>([^\d\(]*)\(?(\d*)\)?<\/td><td[^>]*>(.*?)<\/td><td[^>]*>(.*?)<\/td><td[^>]*>.*?<\/td>/);
            qxInfo["name"] = arr2[1];
            qxInfo["degree"] = arr2[2] == "" ? 0 : arr2[2];
            if (arr2[3].match("未出世")!=null||arr2[4].match("师门")!=null){
                qxInfo["isOk"]=false;
            }else{
                qxInfo["isOk"]=true;
            }
            qxInfo["index"]=i;
            qxArray.push(qxInfo);
        }
        return qxArray;
    }
    return [];
}
// 去除链接以及特殊字符
function removeSpec(str) {
    var tmp = g_simul_efun.replaceControlCharBlank(str.replace(/\u0003.*?\u0003/g, ""));
    tmp = tmp.replace(/[\x01-\x09|\x11-\x20]+/g, "");
    tmp = tmp.replace(/朱果/g, "");
    return tmp;
}
function talk2QiXiabyName(localname){
    //    console.log("目前是：" + localname);
    currentTime = currentTime + delta_Time;
    switch(localname){
        case "王蓉":
            setTimeout(TalkWangRong, currentTime); // 王蓉
            break;
        case "浪唤雨":
            setTimeout(TalkLangHuanYu, currentTime);
            break;
        case "庞统":
            setTimeout(TalkPangTong, currentTime);
            break;
        case "李宇飞":
            setTimeout(TalkLiYuFei, currentTime);
            break;
        case "步惊鸿":
            setTimeout(TalkBuJingHong, currentTime);
            break;
        case "风行骓":
            setTimeout(TalkFengXingJu, currentTime);
            break;
        case "郭济":
            setTimeout(TalkGuoJI, currentTime);
            break;
        case "吴缜":
            setTimeout(TalkWuZhen, currentTime);
            break;
        case "风南":
            setTimeout(TalkFengNan, currentTime);
            break;
        case "火云邪神":
            setTimeout(TalkHuoYunXieShen, currentTime);
            break;
        case "逆风舞":
            setTimeout(TalkNiFengWu, currentTime);
            break;
        case "狐苍雁":
            setTimeout(TalkCangGuYan, currentTime);
            break;
        case "护竺":
            setTimeout(TalkHuZhu, currentTime);
            break;
        case "玄月研":
            setTimeout(TalkXuanYueYan, currentTime);
            break;
        case "狼居胥":
            setTimeout(TalkLangJuXu, currentTime);
            break;
        case "烈九州":
            setTimeout(TalkLieJiuZhou, currentTime);
            break;
        case "穆妙羽":
            setTimeout(TalkMuMiaoYu, currentTime);
            break;
        case "宇文无敌":
            setTimeout(TalkYuWenWuDi, currentTime);
            break;
        case "李玄霸":
            setTimeout(TalkLiXuanBa, currentTime);
            break;
        case "八部龙将":
            setTimeout(TalkBaBuLongJiang, currentTime);
            break;
        case "风无痕":
            setTimeout(TalkFengWuHen, currentTime);
            break;
        case "厉沧若":
            setTimeout(TalkLiCangRuo, currentTime);
            break;
        case "夏岳卿":
            setTimeout(TalkXiaYueQing, currentTime);
            break;
        case "妙无心":
            setTimeout(TalkMiaoWuXin, currentTime);
            break;
        case "巫夜姬":
            setTimeout(TalkWuYeJi, currentTime);
            break;
        default:
            console.error("没有找到该奇侠：" + localname + " ！");
    }
}
//杀天剑
var stj_interval = null;
var tj_target = [];
function stj_Func(){
    clickButton('team', 0);
    if (btnList4.list["杀天剑"].innerText == '杀天剑'){
        btnList4.list["杀天剑"].innerText ='杀秘籍';
        tj_target = ['虹雷','虹风','虹电',"虹雨"];
        stj_interval = setInterval(function(){
            var target_num = killTarget(tj_target,'');
            if(target_num==0 && g_obj_map.get('msg_team').get('is_leader') == '1'){
                random_go();
            }
        },200);
    }else if (btnList4.list["杀天剑"].innerText == '杀秘籍'){
        btnList4.list["杀天剑"].innerText ='杀卫士';
        tj_target = ['天剑谷卫士','天剑','虹雷','虹风','虹电',"虹雨"];
    }else{
        btnList4.list["杀天剑"].innerText ='杀天剑';
        clearInterval(stj_interval)
    }
}

var fangxiang = ['east','west','south','north','southeast','southwest','northeast','northwest'];
function random_go() {
    var fx = [];
    var r = g_obj_map.get('msg_room');
    for(var i in fangxiang){
        if( r.get(fangxiang[i]) ){
            fx.push(fangxiang[i]);
            if(r.get(fangxiang[i]).indexOf('峡谷')==-1){
                clickButton('go '+ fangxiang[i]);
                return 0;
            }
        }
    }
    var j = Math.floor(Math.random()*fx.length);
    clickButton('go '+fx[j]);
}
//进入跨服-------------------------
function jrkf_Func(){
    go('change_server world');
}
//生死簿event_1_44575766
function ssb_Func(){
    go('jh 1;e;n;n;n;n;w;event_1_44575766 go;');
}
//清空谜题
function qkmt_Func(){
    clickButton('auto_tasks cancel');
}
//回主页
function zy_Func(){
    go('home');
}
//end-list4--------------------------

//按钮列表5---------------------------------------------------
var btnList5 = new BtnList(10,anniu_weizhi_right-4*anniu_pianyi);
createButton('隐藏按钮',hid5_Func,btnList5);
createButton('获取id',hqid_Func,btnList5);
createButton('清空id',qkid_Func,btnList5);
createButton('揣摩',cmjn_Func,btnList5);
createButton('学习技能',xxjn_Func,btnList5)
createButton('帮派战',bpz_Func,btnList5);
//createButton('杭界山',hjs_Func,btnList5);
createButton('导航仪',dhy_Func,btnList5);
//createButton('不二公主',begz_Func,btnList5);
createButton('自动重连',zdcl_Func,btnList5);
//createButton('寻找npc',xznpc_Func,btnList5);
createButton('寻找菜肴',xzcy_Func,btnList5);
createButton('跟随',gs_Func,btnList5);
//list5隐藏
function hid5_Func(){
    if(btnList5.list['隐藏按钮'].innerText == '隐藏按钮'){
        hideButton(btnList5);
        btnList5.list['隐藏按钮'].innerText = '特殊'
    }else{
        btnList5.list['隐藏按钮'].innerText = '隐藏按钮'
        showButton(btnList5);
    }
}
//获取id
var btnList_jsmb = new BtnList(10,10);
function hqid_Func(){
    var p = g_obj_map.get('msg_vs_info');
    var id,name;
    var idList ={};
    for(var i = 1;p.get('vs1_name'+i);i++){
        name = p.get('vs1_name'+i);
        id = p.get('vs1_pos'+i);
        idList[name] = id;
        window.writeToScreen(name+' '+id,2,1);
    }
    for(var j = 1;p.get('vs2_name'+j);j++){
        name = p.get('vs2_name'+j);
        id = p.get('vs2_pos'+j);
        idList[name] = id;
        window.writeToScreen(name+' '+id,2,1);
    }
    for(var k in idList){
        createButton(k,hqid_kill(idList[k]),btnList_jsmb);
    }
}
function hqid_kill(id){
    return function(e){
        clickButton('kill '+ id);
    }
}
//清空id
function qkid_Func(){
    for(var i in btnList_jsmb.list){
        document.body.removeChild(btnList_jsmb.list[i]);
    }
    btnList_jsmb.num = 0;
    btnList_jsmb.list = {};
}
//揣摩技能
function cmjn_Func(){
    $('button:contains("揣摩技能")').click();
    var cmjn_interval = setInterval(function(){
        if($('.out2:last').text() == '请先提升这项技能的基础技能，才能继续揣摩。'){
            clearInterval(cmjn_interval);
        }else{
            $('button:contains("揣摩技能")').click();
        }
    },300);
}
//学习技能
function xxjn_Func(){
    $('button:contains("学习十次")').click();
    var xxjn_interva= setInterval(function(){
        if($('.out2:last').text() == '这项技能你的程度已经不输你师父了。'){
            clearInterval(xxjn_interva);
        }else{
            $('button:contains("学习十次")').click();
        }
    },300);
}
//杭界山
function hjs_Func(){
    go('jh 2;n;n;e;s;luoyang317_op1;go_hjs go;se;se;ne;w;n');
}

//不二公主
var begz_interval = null;
function begz_Func(){
    if(btnList5.list['不二公主'].innerText == '不二公主'){
        btnList5.list['不二公主'].innerText = '帮助不二'
        begz_interval = setInterval(function(){
            if(!g_gmain.is_fighting){
                go(fj_an('帮助不二'));
            }
        },500)
    }else if(btnList5.list['不二公主'].innerText == '帮助不二'){
        btnList5.list['不二公主'].innerText = '帮助公主'
        clearInterval(begz_interval);
        begz_interval = setInterval(function(){
            if(!g_gmain.is_fighting){
                go(fj_an('帮助公主'));
            }
        },500)
    }else if(btnList5.list['不二公主'].innerText == '帮助公主'){
        btnList5.list['不二公主'].innerText = '不二公主'
        clearInterval(begz_interval);
    }
}

var zdcl_Interval = null;
function zdcl_Func(){
    if(btnList5.list['自动重连'].innerText == '自动重连'){
        btnList5.list['自动重连'].innerText = '停止重连';
        zdcl_Interval = setInterval(function(){
            if(g_gmain.g_delay_connect>0){
                g_gmain.g_delay_connect = 0;
                connectServer();
            }
        },1000);
    }else{
        clearInterval(zdcl_Interval);
        btnList5.list['自动重连'].innerText = '自动重连'
    }
}
//寻找npc
function xznpc_Func(){
    var a = prompt('请输入 地点 人');
    if(a){
        var city = a.split(' ')[0];
        var npc = a.split(' ')[1];
        yx_go([npc],city);
    }
}

//寻找菜肴
var xzcy_interval =null;
function xzcy_Func(){
    var a = prompt('请输入 地点 菜');
    if(a){
        var dd = a.split(' ')[0];
        var name = a.split(' ')[1];
        var go_array = city[dd].split(';');
        var num = 0;
        xzcy_interval = setInterval(function(){
            if(!cmd_task(name) && num<go_array.length){
                go(go_array[num++]);
            }else {
                clearInterval(xzcy_interval);
            }
        },500);
    }else{
        clearInterval(xzcy_interval);
    }
}
//跟随
function gs_Func(){
    if(btnList5.list['跟随'].innerText == '跟随'){
        btnList5.list['跟随'].innerText = '停止跟随';
        Jianshi.gensha = 1;
    }else{
        Jianshi.gensha = 0;
        btnList5.list['跟随'].innerText = '跟随'
    }
}

// 帮派战------------------------
var bpzInterval = null;
var bpz_place = '至尊殿';
var bpz_ge = '天阁';
var bangpaizhan_place = {
    '至尊殿': 1,
    '翰海楼': 2,
    '八荒谷': 3,
    '九州城': 4,
    '怒蛟泽': 5
};
var bpz_gs = 0;//
var bpz_gs_npc = {
    1:'攻楼死士',
    0:'守楼虎将'
}
var bpz_target = []
function bpz_Func(){
    if(btnList5.list["帮派战"].innerText == '帮派战'){
        btnList5.list["帮派战"].innerText = '天阁';
        $('span .out2').each(function(){
            if($(this).text().indexOf('茅山宗')!=-1){
                //bpz_ge=$(this).text().match(/\((.*)\)/)[1];
                bpz_place = $(this).parent().parent().text().slice(0,3);
                bpz_gs = $(this).siblings(':first').text().match(/\d{1,2}/);
                bpz_gs = parseInt(bpz_gs)%2;
                console.log(bpz_gs)
                bpz_target.push(bpz_gs_npc[bpz_gs])
            }
        });
        bpzInterval = setInterval(bpz_Go,500);
    }else if( btnList5.list["帮派战"].innerText == '天阁'){
        btnList5.list["帮派战"].innerText = '龙阁';
        bpz_ge = '龙阁';
    }
    else{
        btnList5.list["帮派战"].innerText = '帮派战';
        clearInterval(bpzInterval);
    }
}
function bpz_Go(){
    var p = g_obj_map.get('msg_room').get('short')
    if(p.indexOf('武林广场')!=-1){
        var wlgc = p.match(/武林广场(.*)/);
        wlgc = parseInt(wlgc[1]);
        var place = parseInt(bangpaizhan_place[bpz_place]);
        if(wlgc == place){
            ge_Go(bpz_ge);
        }
        else if(wlgc<place){
            clickButton('e');
        }
        else if(wlgc>place){
            clickButton('w');
        }
    }else if(p.indexOf('阁')!=-1 && !g_gmain.is_fighting){
        var a = g_obj_map.get('msg_attrs');
        var max_qixue = parseInt(a.get('max_kee'));
        var max_neili = parseInt(a.get('max_force'));
        var neili = parseInt (a.get('force'));
        var qixue = parseInt(a.get('kee'));
        if(neili<max_neili-30000){
            clickButton('items use snow_wannianlingzhi');
        }else if(qixue<max_qixue){
            clickButton('recovery');
        }else{
            killTarget(bpz_target,'');
        }
    }
}
function ge_Go(x){
    switch(x){
        case '天阁':go('s;w');break;
        case '龙阁':go('s;sw');break;
        case '地阁':go('s;s');break;
        case '玄阁':go('s;se');break;
        case '黄阁': go('s;e');;break;
        default:console.log('出现bug');
    }
}
// 执行命令串
function dhgo(str) {
    var arr = str.split(",");
    if (isDelayCmd && cmdDelayTime) {
        // 把命令存入命令池中
        cmdCache = cmdCache.concat(arr);
        // 当前如果命令没在执行则开始执行
        if (!timeCmd) delayCmd();
    } else {
        for (var i = 0; i < arr.length; i++) clickButton(arr[i]);
    }
}
//加入屏幕提示
function InforOutFunc(text) {
    var node = document.createElement("span");
    node.className = "out2";
    node.style = "color:rgb(255, 127, 0)";
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    document.getElementById("out2").appendChild(node);
}

function dhy_Func(){
    var ljsonpath ={};
    var llnpcList = [];
    var lspath,pathindex=0;
    var ll_mapname="";
    var ll_npcname="";
    var ll_tipinfo='';
    //  console.log('paht:' + hairsfalling[ll_mapname].[ll_npcname] );



    //  InforOutFunc(lspath);
    //  console.log('paht:' + hairsfalling[ll_mapname] );

    var ll_targetName=prompt("请输入导航的目标名称：\nNPC名称\n如：农夫","");
    if (!ll_targetName) {
        return;
    }
    InforOutFunc(ll_targetName);

    $.each(hairsfalling, function(i) {
        //     alert(hairsfalling[i]);	//Coding, 100
        //     alert(i);   	//Type, Height
        //   InforOutFunc(i + '--'+typeof(hairsfalling[i]));
        if('object'===typeof(hairsfalling[i])){

            $.each(hairsfalling[i], function(j) {
                //    InforOutFunc(j +'--'+ i+ '--'+(hairsfalling[i][j]));
                if(j.indexOf(ll_targetName)!=-1) {


                    llnpcList[pathindex]=(pathindex +1)+':'+i + ':'+j+':'+(hairsfalling[i][j]);
                    ll_tipinfo=ll_tipinfo+(pathindex +1)+':'+i + ':'+j+':'+(hairsfalling[i][j])+'\n';

                    pathindex=pathindex +1;
                }

            });

        }

    });

    if (pathindex>1)
    {
        var ll_targetIndex=prompt("请输入导航的目标序号：\n"+ll_tipinfo,"1");
        if (!ll_targetIndex) {
            return;
        }
        ll_targetIndex=parseInt(ll_targetIndex) - 1;
        if( ll_targetIndex < 0 || ll_targetIndex > llnpcList.length ){
            alert("导航的目标序号不正确");
            return;

        }
        lspath=llnpcList[ll_targetIndex].split(':')[3];
        InforOutFunc(lspath);
        dhgo(lspath);

    }else if (pathindex===1)
    {
        lspath=llnpcList[0].split(':')[3];
        InforOutFunc(lspath);
        dhgo(lspath);
    }else{
        alert("导航的目标不在数据库中！");

    }

}

//end-list5----------------------------------


