// ==UserScript==
// @name         字幕发布助手
// @namespace    https://github.com/Sunhelter/LearningFile/blob/master/UserScript/SubtvHelper.js
// @version      1.4.1
// @description  自动选择上传的字幕类型，根据片源名称生成标题
// @match        *://subhd.tv/upload*
// @author       Sunhelter
// @date         2023-12-03
// @charset		 UTF-8
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/420762/%E5%AD%97%E5%B9%95%E5%8F%91%E5%B8%83%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/420762/%E5%AD%97%E5%B9%95%E5%8F%91%E5%B8%83%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    var url = window.location.href;

    $(function() {
        $("#lang1").prop("checked", true);
        $("#lang2").prop("checked", true);
        $("#lang3").prop("checked", true);
        $("#shuang1").prop("checked", true);
        $("#from1").prop("checked", true);
        $("#format1").prop("checked", true);
        $("#format2").prop("checked", true);
        $("#sub_zu").val("14", true);
        $("#sub_text").val('翻译/时间轴招募中，请访问yysub.cc\n\n字幕组目前无任何粉丝群及收费群，欢迎发布调轴的版本，但请勿删除制作名单及网址');

        var btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute('class', 'btn btn-primary btn-sm');
        btn.setAttribute('onclick', 'watch()');
        var btntxt = document.createTextNode("生成标题");
        btn.appendChild(btntxt);
        document.getElementById("submit").parentNode.appendChild(btn);

        var s = document.createElement("script");
        s.type = "text/javascript";
        s.class = "btn btn-primary btn-sm";
        s.textContent = "\
         function watch(){\
             var chi = $(\"#douban_re\").text();\
             if(chi.length > 0){\
                 if(chi.search(/\\s/) > 0){\
                   chi = chi.substring(0,chi.search(/\\s/));\
                 }\
                 else if(chi.search(/\\uFF08/) > 0) {\
                   chi = chi.substring(0,chi.search(/\\uFF08/));\
                 }\
             }\
             else {\
                 alert('请关联剧集');\
                 return false;\
             }\
\
             var eng = $(\"#sub_edition\").val();\
             if(eng.length > 0){\
                 var title = eng.substring(0,eng.search(/s\\d{1,2}e\\d{1,2}/i)).replace(/\\./g,' ');\
                 if(title.length > 0){\
                     var se = eng.match(/s\\d{1,2}e\\d{1,2}/i);\
                     var season = se[0].replace(/e\\d{1,2}/i,'').replace(/s/i,'');\
                     var epsoide = se[0].replace(/s\\d{1,2}/i,'').replace(/e/i,'');\
                     eng = '第' + SectionToChinese(season) + '季第' + SectionToChinese(epsoide) + '集 (' + firstUpperCase(title) + 'S' + season + 'E' + epsoide + ')';\
\
                     $(\"#tv\").prop(\"checked\", true);\
                     $(\"#sub_season\").val(parseInt(season));\
                     $(\"#sub_ep\").val(parseInt(epsoide));\
                 }\
                 else{\
                    title = eng.substring(0,eng.search(/.\\d{4}.\\d{3,4}p/ig)).replace(/\\./g,' ');\
                    eng = ' (' + title + ')';\
                     $(\"#mv\").prop(\"checked\", true);\
                 }\
             }\
             else {\
                 alert('请填写字幕版本');\
                 return false;\
             }\
\
             $(\"#sub_title\").attr(\"value\",fullTitle(chi, eng));\
         }\
\
         function fullTitle(chi, eng){\
             return chi + ' '+ eng + '【人人字幕】';\
         }\
\
         function firstUpperCase(str) {\
             return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());\
         }\
\
         function SectionToChinese(section){\
             var chnNumChar = [\"零\",\"一\",\"二\",\"三\",\"四\",\"五\",\"六\",\"七\",\"八\",\"九\"];\
             var chnUnitChar = [\"\",\"十\",\"百\",\"千\",\"万\",\"亿\",\"万亿\",\"亿亿\"];\
             var strIns = '', chnStr = '';\
             var unitPos = 0;\
             var zero = true;\
             while(section > 0){\
                 var v = section % 10;\
                 if(v === 0){\
                     if(!zero){\
                         zero = true;\
                         chnStr = chnNumChar[v] + chnStr;\
                     }\
                 }else{\
                     zero = false;\
                     strIns = chnNumChar[v];\
                     strIns += chnUnitChar[unitPos];\
                     chnStr = strIns + chnStr;\
                 }\
                 unitPos++;\
                 section = Math.floor(section / 10);\
             }\
             if(section < 20){\
                 chnStr = chnStr.replace('一十','十');\
             }\
             return chnStr;\
         }\
         ";
        document.head.appendChild(s);
    });
})();