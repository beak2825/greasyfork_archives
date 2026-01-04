// ==UserScript==
// @name         bigo__bar
// @namespace    http://tampermonkey.net/
// @version      1.04
// @description  脚本开关功能
// @author       Zhangchun
// @match        https://global-oss.bigo.tv/front_end/index.html*
// @match        https://global-oss-jf2jja.bigo.tv/front_end/index.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389782/bigo__bar.user.js
// @updateURL https://update.greasyfork.org/scripts/389782/bigo__bar.meta.js
// ==/UserScript==

function creatNewElement(childElementName, childElementid, childElementTextAryy, styleArry, fatherElement) {
    /*
    功能：快速创建新的元素，并设置相关样式

    childElementName,要创建的元素名（参数类型：字符串）
    childElementid,要创建的元素id（参数类型：字符串）
    childElementTextAryy,要创建的元素文字内容（参数类型：字符串）
    styleArry,要创建的元素样式（参数类型：数组）
    fatherElement,父亲元素，用来容纳新创建的元素（参数类型：对象类型）
    */
    var childElement = document.createElement(childElementName);//创建新的元素
    childElement.id = childElementid;
    childElement.innerText = childElementTextAryy.join(";\n");
    childElement.style.cssText = styleArry.join(";");
    fatherElement.appendChild(childElement);//将新添加的元素加入父元素中
    return
}


//提示脚本的函数
function run() {

    //计算当前时间差
    function clock(dom, time) {
        /*
        功能：计算传入的时间与当前时间的时间差，单位秒
        dom：想应用的元素，参数类型：引用类型
        time：你想要的计算的时间，参数类型：字符串，格式：2020-03-18 18:02:45
        */
        var time = time.replace(/-/g, '/'),
            difference = parseInt(new Date().getTime() / 1000) - Date.parse(time) / 1000;   //时间差 

        if (difference >= 30) {
            dom.style.color = "red";
            return '当前工单已生成' + difference + '秒' + '，请注意时效'
        }
        else {
            dom.style.color = "blue";
            return '当前工单已生成' + difference + '秒'
        }

    }


    function rule(dom, countryname) {
        /*
        规则提示功能:匹配规则配置（对象名为configs）的rules属性里面的国家码栏（二维数组中的索引为[1]），并返回二维数组中索引为[0]的字符串（即规则文字）
    
        dom:表示要应用到的元素
        countryname:国家名，参数类型：字符串
        应用：仅适用于本脚本中的规则提示功能
    
        */
        var text = "",
            str = new RegExp(countryname);
        dom.style.display = "none";
        for (var i = 0; i < configs.rules.length; i++) {
            if (str.test(configs.rules[i][1])) {
                dom.style.display = "block";
                text += configs.rules[i][0] + "\n";
            }
        }
        return text
    }


    function bgcolor(bar_type) {
        /*
        帖子类型提示功能：根据贴吧的帖子类型，通过改变网页背景色进行提示
        bar_type:帖子类型名称，参数类型：字符串
        */
        var _bgcolor = "",
            str = new RegExp(bar_type);
        for (var i = 0; i < configs.bar_type.length; i++) {
            if (str.test(configs.bar_type[i][1])) {
                _bgcolor = configs.bar_type[i][0];
            }
        }
        return _bgcolor
    }


    function country_setting(countryname) {
        /*
         功能：更改元素的文字内容、背景色、字体颜色
        countryname:表示匹配的国家码，参数类型为字符串
        */
        var text = '',
            bgcolor = '',
            text_color = '',
            str = new RegExp(countryname),
            arr = [];


        for (var i = 0; i < configs.country_setting.length; i++) {
            if (str.test(configs.country_setting[i][0])) {
                text = configs.country_setting[i][1];
                bgcolor = configs.country_setting[i][2];
                text_color = configs.country_setting[i][3];
            }
        }

        arr.push(text, bgcolor, text_color);

        return arr
    }




    //----------------------------------------------------------以上是函数功能模块---------------------------------------------------------------------


    //创建国家码提示按钮、规则提示按钮、时间提示div
    creatNewElement("button", "btn-country", ["国家提示区域"], ["width:200px", "height:50px", "position:absolute", "top:55px", "left:550px", "background-color: darkgoldenrod", "font-weight:bold", "font-size:15px", "display:none"], document.getElementById("app"));
    creatNewElement("button", "btn_rules", ["规则提示区域"], ["width:500px", "height:90px", "position:absolute", "top:48px", "left:850px", "background-color: black", "font-weight:bold", "font-size:10px", "color:white", "display:none"], document.getElementById("app"));
    creatNewElement("div", "clock", ["工单已生成"], ["width:400px", "height:50px", "position:absolute", "top:280px", "left:1300px", "font-weight", "bold;font-size:20px", "color:#3c8dbc", "display:none"], document.getElementById("app"))
    creatNewElement('div', 'specialuid', [''], ["display:none", "line-height:50px", "width:250px", "height:50px", "position:absolute", "top:55px", "left:1550px", "font-weight:bolder", "font-size:20px", "text-align:center"], document.getElementById("app"));



    //规则配置+国家码颜色配置
    var configs = {
        "rules": [
            [
                "抖音【删除】;",//第一行写规则，第二行写国家码
                ";AE;AF;AM;AZ;BD;BH;BN;CN;CY;GE;ID;IL;IN;IQ;IR;JO;JP;KG;KH;KP;KR;KW;KZ;LA;LB;LK;MM;MN;MV;MY;NP;OM;PH;PK;PS;QA;SA;SG;SY;TH;TJ;TM;TR;UZ;YE;TW;HK;BT;MO;TL;AD;AL;AT;BE;BG;BY;CH;CZ;DE;DK;EE;ES;FI;FR;GB;GR;HU;IE;IS;IT;LI;LT;LU;LV;MC;MD;MT;NL;NO;PL;PT;RO;RU;SE;SI;SK;SM;UA;RS;AX;BA;GP;HR;ME;MK;FO;GI;GL;SU;UN;UR;BL;BQ;SX;JE;IM;GG;AG;AI;AR;BB;BM;BO;BR;BS;BZ;CA;CL;CO;CR;CU;DO;EC;GD;GF;GT;GY;HN;HT;JM;LC;MS;MX;NI;PA;PE;PR;PY;SR;SV;TT;US;UY;VE;AW;KN;TC;VI;AN;AS;BU;EL;KY;MQ;VC;DM;CW;VG;AO;BF;BI;BJ;BW;CD;CF;CG;CM;DJ;DZ;EG;ET;GA;GH;GM;GN;KE;KT;LR;LS;LY;MA;MG;ML;MU;MW;MZ;NA;NE;SC;SD;SL;SN;SO;SZ;TD;TG;TN;TZ;UG;ZA;ZM;ZW;CI;FM;GQ;MR;NG;SS;RW;CV;GW;KM;RE;ST;ER;LE;ST;ER;LE;XK;YT;AU;CK;FJ;GU;NR;NZ;PG;SB;TO;AC;AP;CX;MH;MP;NC;PF;PW;TK;KI;NU;WS;HA;HO;JA;KA;KO;PO;SP;TP;TU;UK;ZZ;VU;OTHER"
            ],
            [
                "抖音【封禁一天】;",
                ";VN;"
            ],
            [
                "未成年色情【封禁设备】;",
                ";VN;AE;AF;AM;AZ;BD;BH;BN;CN;CY;GE;ID;IL;IN;IQ;IR;JO;JP;KG;KH;KP;KR;KW;KZ;LA;LB;LK;MM;MN;MV;MY;NP;OM;PH;PK;PS;QA;SA;SG;SY;TH;TJ;TM;TR;UZ;YE;TW;HK;BT;MO;TL;AD;AL;AT;BE;BG;BY;CH;CZ;DE;DK;EE;ES;FI;FR;GB;GR;HU;IE;IS;IT;LI;LT;LU;LV;MC;MD;MT;NL;NO;PL;PT;RO;RU;SE;SI;SK;SM;UA;RS;AX;BA;GP;HR;ME;MK;FO;GI;GL;SU;UN;UR;BL;BQ;SX;JE;IM;GG;AG;AI;AR;BB;BM;BO;BR;BS;BZ;CA;CL;CO;CR;CU;DO;EC;GD;GF;GT;GY;HN;HT;JM;LC;MS;MX;NI;PA;PE;PR;PY;SR;SV;TT;US;UY;VE;AW;KN;TC;VI;AN;AS;BU;EL;KY;MQ;VC;DM;CW;VG;AO;BF;BI;BJ;BW;CD;CF;CG;CM;DJ;DZ;EG;ET;GA;GH;GM;GN;KE;KT;LR;LS;LY;MA;MG;ML;MU;MW;MZ;NA;NE;SC;SD;SL;SN;SO;SZ;TD;TG;TN;TZ;UG;ZA;ZM;ZW;CI;FM;GQ;MR;NG;SS;RW;CV;GW;KM;RE;ST;ER;LE;ST;ER;LE;XK;YT;AU;CK;FJ;GU;NR;NZ;PG;SB;TO;AC;AP;CX;MH;MP;NC;PF;PW;TK;KI;NU;WS;HA;HO;JA;KA;KO;PO;SP;TP;TU;UK;ZZ;VU;OTHER"
            ],
            [
                "暴露生殖器官【永久禁止发帖】",
                ";VN;AE;AF;AM;AZ;BD;BH;BN;CN;CY;GE;ID;IL;IN;IQ;IR;JO;JP;KG;KH;KP;KR;KW;KZ;LA;LB;LK;MM;MN;MV;MY;NP;OM;PH;PK;PS;QA;SA;SG;SY;TH;TJ;TM;TR;UZ;YE;TW;HK;BT;MO;TL;AD;AL;AT;BE;BG;BY;CH;CZ;DE;DK;EE;ES;FI;FR;GB;GR;HU;IE;IS;IT;LI;LT;LU;LV;MC;MD;MT;NL;NO;PL;PT;RO;RU;SE;SI;SK;SM;UA;RS;AX;BA;GP;HR;ME;MK;FO;GI;GL;SU;UN;UR;BL;BQ;SX;JE;IM;GG;AG;AI;AR;BB;BM;BO;BR;BS;BZ;CA;CL;CO;CR;CU;DO;EC;GD;GF;GT;GY;HN;HT;JM;LC;MS;MX;NI;PA;PE;PR;PY;SR;SV;TT;US;UY;VE;AW;KN;TC;VI;AN;AS;BU;EL;KY;MQ;VC;DM;CW;VG;AO;BF;BI;BJ;BW;CD;CF;CG;CM;DJ;DZ;EG;ET;GA;GH;GM;GN;KE;KT;LR;LS;LY;MA;MG;ML;MU;MW;MZ;NA;NE;SC;SD;SL;SN;SO;SZ;TD;TG;TN;TZ;UG;ZA;ZM;ZW;CI;FM;GQ;MR;NG;SS;RW;CV;GW;KM;RE;ST;ER;LE;ST;ER;LE;XK;YT;AU;CK;FJ;GU;NR;NZ;PG;SB;TO;AC;AP;CX;MH;MP;NC;PF;PW;TK;KI;NU;WS;HA;HO;JA;KA;KO;PO;SP;TP;TU;UK;ZZ;VU;OTHER"
            ],
            [
                "【禁止发帖一天】确认/疑似未成年、婴儿；政治言论及领导人",
                ";SA;AE;KW;IQ;AQ;BH;YE;OM;JO;SY;LB;EG;LY;TN;DZ;MA;SD;MR;SO;DJ;KM;PS;IR;IL;",
            ]

        ],


        "bar_type": [
            [
                "#fcb161",//第一行写背景颜色
                ";bar_burn_content;bar_burn_comment" //第二行写帖子类型的字段名
            ],
            [
                "",//第一行写背景颜色
                ";bar_content;bar_comment" //第二行写帖子类型的字段名
            ]
        ],

        'country_setting': [
            [
                ";IN;PK;NP;BD;",//国家码
                "【印度大区】",  //所属区域
                '#FF4500', //背景色
                "#FFF",    //字体颜色

            ],
            [
                ";SA;AE;KW;IQ;AQ;BH;YE;OM;JO;SY;LB;EG;LY;TN;DZ;MA;SD;MR;SO;DJ;KM;PS;IR;IL;",
                "【中东】",
                "#FFFF00",
                "#030303"
            ]
        ],
        "specialuid": [
            [
                // ";30001;30003;30004;30005;30007;30009;30010;30011;30013;30014;30017;30018;30020;30021;30022;30023;30024;30025;30026;30027;1709345140;",    //特殊uid
                [30001,30003,30004,30005,30007,30009,30010,30011,30013,30014,30017,30018,30020,30021,30022,30023,30024,30025,30026,30027,1709345140],
                "官方运营账号，请勿封禁",    //提示文字
                "#FFA500",   //背景颜色
                "white",    //字体颜色
                'block'
            ]
        ]
    };


    function specialUid(uid) {
        /*
         功能：更改元素的文字内容、背景色、字体颜色
        uid:表示匹配的uid，参数类型为字符串
        */
        var text = '',
            bgcolor = '',
            text_color = '',
            style = 'none',
            arr = [];

        for (var i = 0; i < configs.specialuid.length; i++) {
            for(var j = 0;j<configs.specialuid[i][0].length;j++){
                if(Number(uid) - configs.specialuid[i][0][j]===0){
                    text = configs.specialuid[i][1];
                    bgcolor = configs.specialuid[i][2];
                    text_color = configs.specialuid[i][3];
                    style = configs.specialuid[i][4];
                    
                }
            }
            arr.push(text,bgcolor,text_color,style)
        }
        return arr
    }
    document.getElementById("specialuid").style.display = "none";
    timer = setInterval(function () {
        var bar_country = document.querySelectorAll(".list-inline>li>span")[5],     //获取工单国家码（贴吧）所属的元素             
            bar_create_time = document.querySelectorAll(".profile-meta > p")[3], //获取工单生成时间（贴吧）所属的元素
            bar_type = document.querySelectorAll(".list-inline>li>span")[2],    //获取贴子类型（贴吧）所属的元素
            bar_bgcolor = document.querySelector(".profile"),   //获取贴吧审核界面class为profile的元素，后面用来设置界面背景颜色，根据不同的帖子类型
            bar_uid = document.querySelectorAll(".profile-meta > p")[2],    //获取贴UID的父节点；

            country_tips_btn = document.getElementById("btn-country"),  //获取国家提示按钮-------|
            rule_tips_btn = document.getElementById("btn_rules"),   //获取规则提示按钮---------------这4个是我自己创建的，非后台自带
            time_tips_div = document.getElementById("clock"),   //获取时间提示DIV--------------|
            specialuid_div = document.getElementById("specialuid");  //获取特殊UID提示DIV--------|
        if (bar_country) {
            var stleyarr = country_setting(bar_country.innerText);
            var specialuid_style = specialUid(bar_uid.children[0].innerText);
            country_tips_btn.style.display = "block";
            time_tips_div.style.display = "block";
            

            country_tips_btn.innerText = bar_country.innerText + stleyarr[0];
            country_tips_btn.style.backgroundColor = stleyarr[1];     //国家码提示上展示国家码对应的颜色
            country_tips_btn.style.color = stleyarr[2];     //国家码提示上展示国家码对应的颜色
            rule_tips_btn.innerText = rule(rule_tips_btn, bar_country.innerText);     //规则提示上展示国家码对应的规则
            time_tips_div.innerText = clock(time_tips_div, bar_create_time.innerText.slice(7));      //展示工单生成的时间并做提示
            bar_bgcolor.style.backgroundColor = bgcolor(bar_type.innerText);        //不同帖子类型，背景色不同

            specialuid_div.innerText = specialuid_style[0];
            specialuid_div.style.backgroundColor = specialuid_style[1];
            specialuid_div.style.color = specialuid_style[2];
            specialuid_div.style.display = specialuid_style[3];
        }
        else {
            country_tips_btn.style.display = "none";
            rule_tips_btn.style.display = "none";
            time_tips_div.style.display = "none";
            specialuid_div.style.display = 'none';
        }

    }, 500);
}

creatNewElement('button','switch',['开启脚本'],["width:80px", "height:50px", "position:absolute", "top:55px", "left:430px", "background-color: green", "font-weight:bold", "font-size:15px", "display:block",'color:white'], document.getElementById("app"));
var timer;

//开关
document.getElementById("switch").addEventListener("click",function(e){
    if(e.target.innerText==='开启脚本'){
        e.target.innerText = '关闭脚本';
        e.target.style.backgroundColor = 'red';
        run();
    }
    else{
        e.target.innerText = '开启脚本';
        e.target.style.backgroundColor = 'green';
        clearInterval(timer);
        document.getElementById("btn-country").style.display = 'none';
        document.getElementById("btn_rules").style.display = 'none';
        document.getElementById("clock").style.display = 'none';
        document.getElementById("specialuid").style.display = 'none';
        document.querySelector(".profile").style.backgroundColor = '';
    }
});