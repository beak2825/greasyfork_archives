// ==UserScript==
// @name         题目录入
// @namespace    pengpeng
// @version      1.5
// @description  try to take over the world!
// @author       You
// @include      *://matrix-book.ailearn100.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410734/%E9%A2%98%E7%9B%AE%E5%BD%95%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/410734/%E9%A2%98%E7%9B%AE%E5%BD%95%E5%85%A5.meta.js
// ==/UserScript==
    //颜色设置请将16进制颜色代码复制进去
    var texBgColor = "#ADFEDC";//公式背景颜色 alt+1
    var texColor="#7102D2";//公式颜色

    var puBgColor = "#FFD9EC";//全部标点背景颜色 alt+1
    var puColor="#F5821C";//标点颜色
    var puSize="24px";//标点大小
    var puNmColor = "lightgrey";//显示标点数量后标点颜色 alt+3

    var keyWordColor = "#FF9999";//易错字颜色 alt+1

    var brColor = "#00FF59";//换行颜色
    var brSize = "16px";//换行大小

    var spaceColor = "#44BCEA";//空格颜色


    var antColor = "#FF0033";//光标颜色 alt+1
(function () {
    setTimeout(function () {
        LatexColor();
        antInputColor();
        puncColor();
        puncNumber(0);
        keyHight();
    }, 1500);
})();
document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0]; //检测键盘事件
    var altlKey = event.altKey;
    if (altlKey && e.keyCode == 49) {  //按下Alt+1
        LatexColor();
        antInputColor();
        puncColor();
        puncNumber(0);
        keyHight()
    } else if (altlKey && e.keyCode == 50) { //按下ALt+2 重置所有颜色
        var e1 = document.getElementsByClassName("MathJax");
        for ( var i = 0; i < e1.length; i++) {
            e1[i].style.backgroundColor = "#FFFFFF";
        }
        var e2 = document.getElementsByClassName("punc ascii-punc");
        for ( var j = 0; j < e2.length; j++) {
            e2[j].style.backgroundColor = "#FFFFFF";
        }
        var e3 = document.getElementsByClassName("task-preview preview___1DvC2");//渲染后的div句柄
        var e4=null;
        for (var i1 = 0; i1 < e3.length; i1++) {
            e4=e3[i1].getElementsByClassName("puncNumber");
            var j1=0
            for(var i2=0;i2<10;i2++){
                for( j1=0;j1<e4.length;j1++){
                    e3[i1].removeChild(e4[j1]);

                }
            }
        }
    }else if(altlKey && e.keyCode == 51){
        puncNumber(1);
    };
}
 function LatexColor() {
        var e1 = document.getElementsByClassName("MathJax");//tex句柄
        for (var i = 0; i < e1.length; i++) {
            e1[i].style.backgroundColor = texBgColor;
            e1[i].style.color = texColor;
        }
    }
    function puncColor() {
        var e2 = document.getElementsByClassName("punc ascii-punc"); //标点句柄
        for (var j = 0; j < e2.length; j++) { //更改标点颜色
            e2[j].style.backgroundColor = puBgColor;
            e2[j].style.color = puColor;
            e2[j].style.fontSize = puSize;
        }
    }
function antInputColor() {
    var e3 = document.getElementsByClassName("ant-input textarea___2v5KX"); //更改光标颜色
    var e4 = document.getElementsByClassName("ProseMirror");
    for (var k = 0; k < e3.length; k++) {
        e3[k].style.caretColor = antColor;
    }
    for (var k1 = 0; k1 < e4.length; k1++) {
        e4[k1].style.caretColor = antColor;
    }
}
function puncNumber(temp) {
    var e = document.getElementsByClassName("task-preview preview___1DvC2");//渲染后的div句柄

    var e_1;
    var flag = 0;//标点个数
    var punce_=null;
    for (var i1 = 0; i1 < e.length; i1++) {
        //console.log(e[i1].getElementsByClassName("punc ascii-punc"));
        flag = 0//将标点数量初值设为0
        e_1 = e[i1].getElementsByClassName("punc ascii-punc");//标点span标签的array
        for (var j1 = 0; j1 < e_1.length; j1++) {
            if (e_1[j1].innerHTML == "," || e_1[j1].innerHTML == "." || e_1[j1].innerHTML == ";"||e_1[j1].innerHTML == "?") {
                if(temp==1){
                    e_1[j1].style.background = puNmColor;
                }
                flag++;
            }
        }
        //punce_=e[i1].getElementsByClassName("puncNumber");
        if(temp==1){
            var div = document.createElement("div")//用来存放标点个数得div
            div.setAttribute('class', 'puncNumber');//设置选择器
            div.innerHTML = "标点: "+flag;
            e[i1].appendChild(div);
        }
    }
    var punce=document.getElementsByClassName("puncNumber");
    for(var i=0;i<punce.length;i++){
        punce[i].style.width="60px";
        punce[i].style.color="red";
        punce[i].style.marginLeft="-3px";
        punce[i].style.marginTop="-2px";

    }
}
function keyHight() {
        var content = document.getElementsByClassName("task-preview preview___1DvC2");
        var contents=null;
        var brText = "↵";
        var spaceReg = new RegExp('(?<=>|[\u4e00-\u9fa5]|↵| ) (?=<|[\u4e00-\u9fa5]| |↵|&nbsp;)|(?<=[\u4e00-\u9fa5]) (?=[A-Za-z0-9)])|(?<=[A-Za-z0-9)]) (?=[\u4e00-\u9fa5])', 'g');
        var text = ["河","民","洗","最筒","如下图","如上图","屠幼哟","青荔素","屠哟哟","曲","深度解析","湘", "测", "分析", "多选", "干万", "干米", "一一", "菱白", "乌类", "食虫乌", "如胞", "率化", "将介石", "进退准谷", "烷紫女焉红", "影晌", "客器", "干米", "题于", "伊犁", "宣言", "右图", "横线上", "青篙", "筒式", "结台", "连结", "周恩来", "蒋介石", "兼葭", "徽粒", "II", "III", "IV", "VI", "便剂", "半封建", "方框", "等侯", "筒要", "己知", "容案", "泊秦准", "时侯", "属子", "氘核", "临桃", "考査", "懂憬", "栽判", "输人", "虚框", "熔融", "嘧啶", "蔡锷", "填空", "汽化", "本题", "磁通量", "镍铬", "结合", "论释", "虚线", "波浪线", "面两", "化筒", "酚酞", "试液", "民主主义革命", "竟争", "双缩脲", "关健", "申场线", "守怕", "讨程", "直线", "混台", "属干", "故答案", "白然", "増强", "隋朝", "灌溉", "曲辕犁", "焦裕禄", "邓稼先", "澎湖列岛", "猖撅", "因家", "喜马拉雅", "重载铁路", "人类", "电荷", "又化", "地温包络线", "献县", "径流量", "金丝小枣", "稻麦复种", "智利", "天山北坡", "推测", "缅甸蟒", "樱桃", "塔里木盆地", "富营养化", "赛里木湖", "辆牲", "牺牲", "纳木错湖", "伊犁河", "库尔德宁", "巴尔喀什湖", "卡普恰盖", "雅鲁藏布江", "段祺瑞", "陷人", "朱熹", "霍尔果斯", "赫鲁晓夫", "中国共产党", "冶铁", "慕尼黑", "勃列日涅夫", "诞生", "红军", "土地", "马克思主义", "全国人大常委会", "人人", "洞庭湖", "伊朗", "新民主主义革命", "塞尔维亚", "萨拉热窝", "颠覆", "土库曼斯坦", "蒸汽机", "张作霖", "干瓦", "全面小康社会", "新时代中国特色社会主义", "中国特色社会主义", "吴佩孚", "民族", "革命", "棉纺织业", "珠穆朗玛峰", "李鸿章", "徐悲鸿", "清政府", "新时代中国特色社会主义思想", "二欠", "消弭", "弘扬", "洪仁玕", "朝廷", "精神", "太平天国", "滴人", "哈萨克斯坦", "宣传", "旗帜", "俄罗斯", "袁世凯", "陈抟", "继承", "麾下", "刘昌祚", "昌祚", "干早", "普伦蒂湾", "范纯粹", "弹劾", "弹勒", "赋子", "部署", "俸禄", "白己", "草命", "达累斯萨拉姆", "真苗", "侧隐", "缠绵排侧", "艺木", "地慢", "沼令", "思格尔", "酵母茵", "时鬣", "衰世凯", "品口", "组带", "将车", "收人", "酸肝", "时、司", "平街", "酵母苗", "苗种", "乳酸茵", "代人", "移人", "放人", "图象", "测可", "则使", "溢号", "淇", "解焦", "加人", "进人", "筒单", "函敖", "范国", "高体", "类圈", "引人", "真茵", "细茵", "溢裂", "高子", "葡荀", "荀萄", "拈抗", "氩气", "造到", "血精", "己经", "深人", "自已", "跨人", "文化", "继", "凌汛", "敛", "拈抗", "筒图", "干早", "博仪", "器张", "膜存听", "相形见细", "乳雀", "氯基酸", "青篙", "电心", "凇沪", "磨碾", "俞族", "杂鞣", "灯火闲珊", "因难", "动入", "加人", "张赛", "地慢", "粗扩", "甘之如治", "台糖", "菌相如", "防早", "洗星海", "磅碌", "崔额", "鸟云", "传水", "按图素骤", "祭袒", "已烷", "蛛螂", "洽理", "福社", "自已", "塞暖", "追择", "借大", "左支右细", "氩基", "葡荀", "两干", "占老", "文稻", "滴守", "调佩", "吝尚", "浩森", "贫因", "如媚", "刺漱", "套自菲薄", "王熙风", "改单", "项果", "视祖", "固家", "平而", "菜莉", "茵", "疱丁", "薛荔", "穷尺", "操索", "单命", "衰阳", "且日", "推读", "元索", "苯莉", "乳酸苗", "患心", "胃犯", "通近", "姥紫婿红", "夏纳", "祭花", "货而", "荣莉", "酵母苗", "目讨苦吃", "白讨苦吃", "可掏", "白已", "式力", "嚎亮", "莱莉", "细苗", "若鹫", "螯头", "做慢", "心照不宜", "拜调", "弹刻", "癫蛤蟆", "倘样", "怪柳", "白在", "朝延", "提拨", "派遗", "呈帝", "夹视", "迁徒", "枝柱", "而积", "葛蒲", "妮妮动听", "禁铟", "官史", "已见", "字相", "倭臣", "玩要", "圆链", "授子", "柱甫", "全山", "沤歌", "苟子", "姻娜", "突元", "战没", "共扼", "蚁香", "祭礼", "隋场", "白己", "道遥", "弹让", "围家", "崛州", "车阀", "筒便", "社甫", "车事", "成力", "动上", "因境", "因难", "宜战", "宜言", "筒直", "咕脓", "干米", "芦枟", "容质", "筒单", "群敖", "淇简", "瘁死", "淇中", "洗找", "谊染", "干克", "物质沫", "氧基", "淇结", "河用", "同测", "淇生", "幻胞", "河产", "重米", "量简", "淇与", "海次", "氯基", "倍测", "泼现", "烷融", "测含", "淇余", "溶量", "自已", "破位", "钻酞", "淇理", "通人", "蚌锰", "宜告", "字字珠巩", "骄做", "萘绕", "悸于", "濒闪", "淇合", "驾以", "解导", "中绝", "耐早", "筒解", "牌应", "淇大", "伊然", "竞然", "歧王", "非过　联将", "海图", "阿根延", "筒洁", "筒单", "车用", "请束", "清敝", "骨毡", "知胞", "皮弃", "平街", "蛛蛇", "乌拉主", "才育", "歹甲", "弓|物", "氩酸", "如胞", "桑柑", "蜂蛇", "反射狐", "补髓", "细苗", "漠定", "源长", "深用", "沐箱", "沐块", "地亡", "氯化钻", "纽织", "氩酸", "收人", "淇作", "青蕊素", "渤质", "必燃", "传人", "灭茵", "宜誓", "共产觉", "日的", "捉醒", "切人", "宫延", "宜传", "细茵", "地是", "淇反应", "农杆茵", "植抹", "泼生", "合有", "白治", "吴佩乎", "毕竞", "退异", "雾需", "改草", "单命", "消资", "因惑", "票色", "昔酸", "喀喉", "遣传", "烹任", "名师点评", "解析卜", "盂", "卜", "对干", "思路点拨卜", "点评", "化筒", "题", "筒单", "湘", "目", "解", "解析"];
        var a = text.sort((a, b) => b.length - a.length);//转换为数组
        var reg = new RegExp('(' + a.join('|') + ')', 'g');//建立全部要高亮数据的正则表达式
        for (var i = 0; i < content.length; i++) {
            contents = content[i].innerHTML;
            var values = contents.split(brText); //分割换行
            contents = values.join('<span style="background:'+brColor+'; font-size:'+brSize+';">' + brText + '</span>')//高亮换行
            contents = contents.replace(spaceReg, '<span style="background:'+spaceColor+'"> </span>');//高亮空格
            contents = contents.replace(new RegExp('&nbsp;','g'), '<span style="background:'+spaceColor+'">&nbsp;</span>')
            contents = contents.replace(reg, '<span style="background:' + keyWordColor + '">$1</span>');//高亮易错关键字

            document.getElementsByClassName("task-preview preview___1DvC2")[i].innerHTML = contents;//写入原网页
        }
    }