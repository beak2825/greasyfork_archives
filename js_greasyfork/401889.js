// ==UserScript==
// @name       南充2020公需科目考试自动答题
// @namespace   yaoscript
// @match       http://www.ncjxjy.com/user/exam_do.php
// @match       http://www.ncjxjy.com/user/index.php
// @grant       none
// @version     2.0
// @author      yao
// @description 可用于南充公需科目考试的自动答题，进入考试页面时即可自动填写正确答案。（仅供答题后进行自我检查，并非用于替代考试。）
// @require     http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/401889/%E5%8D%97%E5%85%852020%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/401889/%E5%8D%97%E5%85%852020%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==


//############################################判断题答案######################################################
var strjdq={2797: '正确', 2798: '错误', 2799: '正确', 2800: '正确', 2801: '正确', 2802: '错误', 2803: '正确', 2804: '正确', 2805: '错误', 2806: '正确', 2807: '正确', 2808: '正确', 2809: '错误', 2810: '正确', 2811: '错误', 2812: '错误', 2813: '正确', 2814: '错误', 2815: '正确', 2816: '错误', 2817: '错误', 2818: '正确', 2819: '正确', 2820: '正确', 2821: '错误', 2822: '正确', 2823: '正确', 2824: '正确', 2825: '错误', 2826: '正确', 2827: '正确', 2828: '错误', 2829: '正确', 2830: '错误', 2831: '错误', 2832: '正确', 2833: '正确', 2834: '错误', 2835: '正确', 2836: '正确', 2837: '正确', 2838: '错误', 2839: '正确', 2840: '错误', 2841: '错误', 2842: '正确', 2843: '正确', 2844: '正确', 2845: '正确', 2846: '正确', 2847: '正确', 2848: '错误', 2849: '错误', 2850: '正确', 2851: '错误', 2852: '正确', 2853: '正确', 2854: '正确', 2855: '正确', 2856: '正确', 2857: '错误', 2858: '正确', 2859: '正确', 2860: '正确', 2861: '正确', 2862: '正确', 2863: '正确', 2864: '正确', 2865: '正确', 2866: '正确', 2867: '正确', 2868: '正确', 2869: '正确', 2870: '正确', 2871: '正确', 2872: '正确', 2873: '正确', 2874: '正确', 2875: '正确', 2876: '正确', 2877: '正确', 2878: '错误', 2879: '正确', 2880: '正确', 2881: '正确', 2882: '正确', 2883: '错误', 2884: '错误', 2885: '正确', 2886: '错误', 2887: '正确', 2888: '错误', 2889: '错误', 2890: '错误', 2891: '正确', 2892: '错误', 2893: '正确', 2894: '正确'};

//############################################单选题答案######################################################
var strssq={2895: 0, 2896: 2, 2897: 3, 2898: 1, 2899: 0, 2900: 2, 2901: 0, 2902: 1, 2903: 0, 2904: 2, 2905: 3, 2906: 1, 2907: 2, 2908: 0, 2909: 3, 2910: 1, 2911: 2, 2912: 2, 2913: 0, 2914: 3, 2915: 1, 2916: 2, 2917: 0, 2918: 2, 2919: 1, 2920: 2, 2921: 1, 2922: 3, 2923: 0, 2924: 2, 2925: 0, 2926: 2, 2927: 1, 2928: 3, 2929: 1, 2930: 2, 2931: 1, 2932: 0, 2933: 1, 2934: 1, 2935: 3, 2936: 0, 2937: 2, 2938: 3, 2939: 2, 2940: 3, 2941: 3, 2942: 1, 2943: 3, 2944: 0, 2945: 0, 2946: 1, 2947: 3, 2948: 3, 2949: 0, 2950: 1, 2951: 2, 2952: 3, 2953: 2, 2954: 2, 2955: 1, 2956: 2, 2957: 3, 2958: 3, 2959: 1, 2960: 2, 2961: 1, 2962: 0, 2963: 2, 2964: 2, 2965: 1, 2966: 3, 2967: 2, 2968: 0, 2969: 2, 2970: 3, 2971: 1, 2972: 3, 2973: 0, 2974: 1};

//############################################多选题答案######################################################
var strmsq={2975: [0, 1, 2], 2976: [0, 1, 3, 4], 2977: [1, 2, 3], 2978: [0, 1, 2, 3, 4], 2979: [0, 1, 2, 3, 4], 2980: [0, 1, 2, 3, 4], 2981: [0, 1, 2, 3, 4], 2982: [0, 2, 3, 4], 2983: [0, 1, 2, 3, 4], 2984: [0, 1, 2], 2985: [0, 1, 2, 3], 2986: [0, 1, 2, 3, 4], 2987: [0, 1, 2], 2988: [1, 2, 3, 4], 2989: [0, 1, 2, 3, 4], 2990: [1, 2], 2991: [0, 1, 2, 3, 4], 2992: [0, 1, 2, 3], 2993: [1, 2], 2994: [0, 1, 2], 2995: [0, 1, 2, 3, 4], 2996: [0, 1, 2, 3, 4], 2997: [0, 1, 2, 3, 4], 2998: [0, 1, 2, 3, 4], 2999: [2, 3, 4], 3000: [1, 2, 3, 4], 3001: [0, 1, 4], 3002: [0, 1, 2, 3, 4], 3003: [0, 1, 2, 3, 4], 3004: [0, 1, 2, 4], 3005: [1, 2, 3, 4], 3006: [0, 1, 2, 3], 3007: [1, 3], 3008: [1, 2, 4], 3009: [0, 1, 2], 3010: [0, 1, 2, 3, 4], 3011: [2, 3, 4], 3012: [0, 2, 4], 3013: [0, 1, 2, 3, 4], 3014: [1, 2, 4], 3015: [0, 1, 2, 3, 4], 3016: [1, 3, 4], 3017: [0, 1, 2], 3018: [0, 1, 2, 3], 3019: [0, 2, 3], 3020: [0, 1, 2], 3021: [2, 3, 4], 3022: [0, 1, 2], 3023: [0, 1, 2, 3], 3024: [0, 1, 2], 3025: [0, 1, 2], 3026: [1, 3], 3027: [0, 1, 2, 3, 4], 3028: [0, 1, 2, 3], 3029: [1, 2, 3, 4], 3030: [0, 1, 2, 3], 3031: [0, 2, 3, 4], 3032: [0, 1, 2, 3, 4], 3033: [0, 1, 2, 3, 4], 3034: [0, 1, 2, 3, 4], 3035: [0, 1, 2, 3, 4], 3036: [0, 1, 2, 3, 4], 3037: [0, 1, 2, 3], 3038: [0, 1, 2, 3, 4], 3039: [0, 1, 2, 3, 4], 3040: [0, 1, 2, 3], 3041: [0, 1, 2], 3042: [0, 2], 3043: [0, 1, 2, 3], 3044: [0, 1, 3], 3045: [0, 2, 4], 3046: [0, 2, 3, 4], 3047: [0, 1, 2, 3, 4], 3048: [0, 1, 4], 3049: [1, 2, 4], 3050: [0, 1, 3, 4], 3051: [0, 1, 3], 3052: [1, 3, 4], 3053: [0, 1, 2, 3], 3054: [0, 2, 4]};


//启用浏览器复制功能
(function() {
    document.oncontextmenu = document.onselectstart = document.body.onselectstart = document.oncopy = document.body.oncopy ="";

    function R(a) {
        ona = "on" + a;
        if (window.addEventListener)
            window.addEventListener(
                a,
                function(e) {
                    for (var n = e.originalTarget; n; n = n.parentNode) n[ona] = null;
                },
                true
            );
        window[ona] = null;
        document[ona] = null;
        if (document.body) document.body[ona] = null;
    }
    R("contextmenu");
    R("click");
    R("mousedown");
    R("mouseup");
    R("selectstart");
})();

//自动答判断题
function funcjdq() {
    $.each($("#judgeDiv>p").next(),function(i, el) {
        //s变量存放取回的题目编号

        var s = $(el).prop('value');
          //debugger;    
        //opt变量为ul下的li位置序号，正确为0，错误为1.
        var opt = 0;
        if (strjdq[s] == '错误') {
            opt = 1;
        }

        //$(el).nextAll().eq(2).children().eq(opt).children("input").prop("checked",true);
        //点选opt序号对应的option
        $(el).nextAll().eq(1).children().eq(opt).children("input").click();
        //debugger;
    });
}

//自动答单选题
function funcssq() {
    $("#signleDiv>p").next().each(function(i, el) {
        var s =$(el).prop('value');
        var opt = 0;
        opt = strssq[s];
        if (opt < 0 || opt > 3) {
            opt = 0;
        }
        $(el).nextAll().eq(1).children().eq(opt).children("input").click();
    });
}

//自动答多选题
function funcmsq() {
    //清除所有选项
    $("#multiDiv input").prop("checked", false);
    //开始遍历每一道多选题，然后点击相应选项
    $("#multiDiv>p").next().each(function(i, el) {
        var s =$(el).prop('value');
        var optarr = strmsq[s];
        //debugger;
        for (var opt in optarr) {
            $(el)
                .nextAll()
                .eq(1)
                .children()
                .eq(optarr[opt] )
                .children("input")
                .click();
        }
    });
}

//自动答所有题型
function funcautodati() {
    funcjdq();
    funcssq();
    funcmsq();
}

//选课与打开考试
function openKaoshi() {
    //选课
    //window.open("http://www.ncjxjy.com/user/choose_do.php?id=q0aod2p5zlmin4rio45wi92kut7hxihf");
    //打开考试
    window.open("http://www.ncjxjy.com/user/exam_do.php?SubjectID=9bm38c3czdq35xqi3m9oc8qt7jrsmu7u");
    //console.log('aaa');
}


//*****************************主程序*******************************
(function() {
    var strrst = "";
    //openKaoshi();
    if (window.location.href == 'http://www.ncjxjy.com/user/index.php') {
        openKaoshi();
    }

    //修改自动提交时间
    //c = 20000;
    //停止计时器
    clearInterval(a);
    //document.oncontextmenu = "";

    //定义需要向页面添加的元素
   var addElement1 ='<div><input type="button" id="jdq" value="答判断题" style="margin:6px 0"></div>'+
      '<div><input type="button" id="ssq" value="答单选题" style="margin:6px 0"></div>'+
      '<div><input type="button" id="msq" value="答多选题" style="margin:6px 0"> </div>'+
      '<div><input type="button" id="autodati" value="自动答题" style="margin:6px 0"></div>'+
      '<div><input type="button" id="cleardati" value="清除答题" style="margin:6px 0"></div>'+
      '<div id="showresult" style="margin:15px 15px;line-height:25px;text-align:left"></div>';

    $("#float_banner").height('450px');
    //向页面添加元素
    //$("body").prepend(addElement1);
    $("#float_banner").append(addElement1);
  
    //为判断题按钮指定点击事件
    $("#jdq").click(function() {
        funcjdq();
    });

    //为单选题按钮指定点击事件
    $("#ssq").click(function() {
        funcssq();
    });

    //为多选题按钮指定点击事件
    $("#msq").click(function() {
        funcmsq();
    });

    //为自动答题按钮指定点击事件
    $("#autodati").click(function() {
        funcautodati();
    });
    
    //清除所有答题
    $("#cleardati").click(function() {
        $('input').prop("checked",false)
    });

    //自动答所有题型
    funcautodati();

    //在页面显示自己的消息
    strrst =
        "打开此页面时答题已经完成，直接提交即可！如果没有自动答题，请点击按钮答题。";
    $("#showresult").text(strrst);
})();