// ==UserScript==
// @name         阿民脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  阿民的脚本
// @author       You
// @match        https://consolezombie.7piratesgames.com:8888/admin/ModSysNotice?Operation=Add
// @require      https://cdn.bootcdn.net/ajax/libs/moment.js/2.29.1/moment.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437248/%E9%98%BF%E6%B0%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/437248/%E9%98%BF%E6%B0%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('body').append('<button class="zaobing" type="button" style="z-index:100000;position:absolute;right:0;top:0;opacity:0.7">造兵减半</button>');
    $('body').append('<button class="zaobing" type="button" style="z-index:100000;position:absolute;right:80px;top:0;opacity:0.7">行军减半</button>');
    $(".zaobing").click(function () {
        $("input[name='Title']").val(moment().add(6-new Date().getDay(),'days').format('MM-DD')+'-'+moment().add(7-new Date().getDay(),'days').format('MM-DD')+'造兵时间减半');
        $("#start").val(moment().add(6-new Date().getDay(),'days').format('YYYY-MM-DD 00:00:00'));
        $("#end").val(moment().add(8-new Date().getDay(),'days').format('YYYY-MM-DD 00:00:00'));
        $("select[name='ChangeCSVId']").val(649);
        $("#IsEvent").attr("checked",'checked');
        $("textarea[name=EN_Title]").val("Training Time Halving");
        $("textarea[name=EN_Message]").val("During this event, troops construction time will be halved. You can put these fast-constructed troops into battle. So, Commander, get out and conquer! \n\nTake note: Militia training time will not be halved, because their training time is already short enough.");
        $("textarea[name=CN_Title]").val("造兵时间减半");
        $("textarea[name=CN_Message]").val("在活动期间，部队建造时间将减半。您将能迅速地建造部队投入战斗，指挥官，快去攻城略地吧！ \n\n注意：民兵的造兵时间不会减半，因为民兵的初始建造时间很短。");
        $("textarea[name=ZH_Title]").val("造兵時間減半");
        $("textarea[name=ZH_Message]").val("在活動期間，部隊建造時間將減半。您將能迅速地建造部隊投入戰鬥，指揮官，快去攻城略地吧！ \n\n注意：民兵的造兵時間不會減半，因為民兵的初始建造時間很短。");
        $("textarea[name=KR_Title]").val("유닛제조시간 절반감소 이벤트");
        $("textarea[name=KR_Message]").val("이벤트 동안, 유닛제조시간이 절반으로 감소됩니다. 이기회에 군사세력을 확장하여 세계를 정복하세요. \n\n주의: 민병의 제조시간이 너무 짧은 원인으로 민병의 제조시간은 절반으로 감소되지 않습니다.");
        $("textarea[name=JP_Title]").val("Training Time Halving");
        $("textarea[name=JP_Message]").val("During this event, troops construction time will be halved. You can put these fast-constructed troops into battle. So, Commander, get out and conquer! \n\nTake note: Militia training time will not be halved, because their training time is already short enough.");
        $("textarea[name=IT_Title]").val("Training Time Halving");
        $("textarea[name=IT_Message]").val("During this event, troops construction time will be halved. You can put these fast-constructed troops into battle. So, Commander, get out and conquer! \n\nTake note: Militia training time will not be halved, because their training time is already short enough.");
        $("textarea[name=SP_Title]").val("Training Time Halving");
        $("textarea[name=SP_Message]").val("During this event, troops construction time will be halved. You can put these fast-constructed troops into battle. So, Commander, get out and conquer! \n\nTake note: Militia training time will not be halved, because their training time is already short enough.");
        $("textarea[name=DE_Title]").val("Trainingsdauer ist halbiert");
        $("textarea[name=DE_Message]").val("Während dieses events ist die Konstruktionszeit für Truppen halbiert. Du kannst diese schnellaufgestellten Truppen in die Schlacht werfen. Als denn, Kommandant, zieht los und erobert! \n\nBitte beachte: Die Trainingszeit für Miliz wird nicht halbiert, da deren Trainingszeit bereits kurz genug ist.");
        $("textarea[name=FR_Title]").val("Le temps d'entrainement est réduit de moitié");
        $("textarea[name=FR_Message]").val("Pendant cet evenement, le temps de construction des troupes sera réduit de moitié. Vous pouvez engager ces troupes rapidement construites à la bataille. Donc, Commandant, sortez conquérir! \n\nAttention: Le temps d'entrainement Milice étant déjà très court, ne sera pas réduit.");
        $("textarea[name=PT_Title]").val("Training Time Halving");
        $("textarea[name=PT_Message]").val("During this event, troops construction time will be halved. You can put these fast-constructed troops into battle. So, Commander, get out and conquer! \n\nTake note: Militia training time will not be halved, because their training time is already short enough.");
        $("textarea[name=RU_Title]").val("Скорость подготовки удвоена");
        $("textarea[name=RU_Message]").val("Во время ивента скорость подготовки солдат будет удвоена. Используйте эту возможность по максимуму и атакуйте своих врагов! \n\nПримечание: время подготовки Ополчение останется неизменным, так как они уже подготавливаются очень быстро.");
        $("textarea[name=TH_Title]").val("Training Time Halving");
        $("textarea[name=TH_Message]").val("During this event, troops construction time will be halved. You can put these fast-constructed troops into battle. So, Commander, get out and conquer! \n\nTake note: Militia training time will not be halved, because their training time is already short enough.");
        $("textarea[name=NL_Title]").val("Training Time Halving");
        $("textarea[name=NL_Message]").val("During this event, troops construction time will be halved. You can put these fast-constructed troops into battle. So, Commander, get out and conquer! \n\nTake note: Militia training time will not be halved, because their training time is already short enough.");
        $("textarea[name=IL_Title]").val("Training Time Halving");
        $("textarea[name=IL_Message]").val("During this event, troops construction time will be halved. You can put these fast-constructed troops into battle. So, Commander, get out and conquer! \n\nTake note: Militia training time will not be halved, because their training time is already short enough.");
        $("textarea[name=PL_Title]").val("Training Time Halving");
        $("textarea[name=PL_Message]").val("During this event, troops construction time will be halved. You can put these fast-constructed troops into battle. So, Commander, get out and conquer! \n\nTake note: Militia training time will not be halved, because their training time is already short enough.");
        $("textarea[name=TR_Title]").val("Training Time Halving");
        $("textarea[name=TR_Message]").val("During this event, troops construction time will be halved. You can put these fast-constructed troops into battle. So, Commander, get out and conquer! \n\nTake note: Militia training time will not be halved, because their training time is already short enough.");
    });
    // Your code here...
})();