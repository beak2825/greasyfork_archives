// ==UserScript==
// @name         HFLS OA Toolbox
// @namespace    https://rscb9004.github.io/
// @version      0.1
// @description  Fill in the teaching evaluation survey of HFLS.
// @author       RsCb
// @match        http://oa.chinahw.net:8088/*
// @icon         https://cdn.luogu.com.cn/upload/usericon/277650.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512360/HFLS%20OA%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/512360/HFLS%20OA%20Toolbox.meta.js
// ==/UserScript==

function scriptMsg(content, func1, func2){
    layer.confirm(content, {title: '来自 HFLS OA Toolbox 的消息'}, func1, func2);
}

function isAtModel(id){
    return Boolean($(`#model-div-${id}`).length);
}

function update(){
    if(isAtModel('74012')) teachingEval.main();
}

var teachingEval = {};

teachingEval.isAtForm = function(){
    return isAtModel('74012') && Boolean($('#itemFormId').length);
};

teachingEval.main = function(){
    teachingEval.modelObserver = new MutationObserver(function(){
        this.disconnect();
        (new MutationObserver(teachingEval.addButtons))
            .observe($('#itemShowDivId')[0], {childList: true});
    });
    teachingEval.modelObserver.observe($('#model-div-74012')[0], {childList: true});
};

teachingEval.addButtons = function(){

    goback = function(){
        let url = "/oa7/evaluate/stu/list";
        $("#itemShowDivId").load(url);
    };

    if(teachingEval.isAtForm()){

        $('#itemFormId .filter').after(
            `<div style="margin:0px 0px 10px 0px">
                <div class="btn btn-long btn-blue" id="fillButton">一键填写</div>
                <div class="btn btn-long btn-blue" id="autoFillButton">填写全部</div>
            </div>`
        );
        $('#fillButton').click(teachingEval.fill);
        $('#autoFillButton').click(teachingEval.autoFill);

        if(teachingEval.auto) teachingEval.fill();
    }
};

teachingEval.fill = function(){

    for(let i=0;; i++){
        function getItems(name){
            return $(`#itemFormId .table-container [name='resultList[${i}].${name}']`);
        }

        if(!getItems('itemId').length) break;

        switch(getItems('itemType')[0].value){
        case '10':
            getItems('resultId')[0].checked = true;
            break;
        case '11':
            getItems('resultId')[0].checked = true;
            break;
        case '12':
            getItems('result')[0].value = '无';
            break;
        }
    }
    teachingEval.save();
};

teachingEval.autoFill = function(){
    teachingEval.auto = true;
    teachingEval.firstPage();
};

teachingEval.save = function(){
    if(isSubmit) return;

    isSubmit = true;
    layer.load();

    let options = {
        url: "/oa7/evaluate/stu/saveItem",
        dataType: 'json',
        data: {'state': '1'},
        success: function(data){
            isSubmit = false;
            layer.closeAll();

            let jsonO = data;
            if(!jsonO.success)
                layerTipMsg(jsonO.success, "保存失败", jsonO.msg);
            else if(!teachingEval.auto)
                scriptMsg('已自动填写并保存，是否前往下一张问卷？', teachingEval.nextPage)
            else
                teachingEval.nextPage();
        },
        clearForm: false,
        resetForm: false,
        type: 'post',
    };
    $("#itemFormId").ajaxSubmit(options);
};

teachingEval.firstPage = function(){
    if($('#subjectId').length)
        $('#subjectId')[0].value = $('#subjectId :first-child').val();
    doSearch();
};

teachingEval.nextPage = function(){
    layer.closeAll();
    let curVal = $('#subjectId').val();
    let nxtVal = $(`#subjectId [value='${curVal}']`).next().val();
    if(nxtVal == undefined){
        teachingEval.submit(); return;
    }
    $('#subjectId')[0].value = nxtVal;
    doSearch();
};

teachingEval.submit = function(){
    teachingEval.auto = false;
    scriptMsg('已填完，是否提交？', function(){
        layer.closeAll();
        saveItemList('2', '0');
    });
};

var inf = `\
之前的私宅鹅心发言被我删了，kimo。
总之这是一个帮助你自动填写评教调查的脚本。显然 zjx 已经教你怎么用了。
提一嘴，本人已接近毕业，之后此脚本估计不会添加新功能的。
本来我要写一个抢课功能的，然后发现沟槽的羽毛球课即使开挂也抢不到，遂破防，不写了。
总之这个更新只改了这一段话，以及这个文件名。我一开始是在浏览自己的 Github 仓库，\
突然发现这个文件名实在是唐，于是才来改的，顺便把这段话也改了。
就这样，希望你拥有美好的每一天。
<div style="text-align:right">
RsCb
2024/10/12
</div>
`;

(function(){
    'use strict';
    switch(window.location.pathname){
    case '/oa7/desktop/index/page':{
        scriptMsg(inf.replace(/^\s{4}/gm, '&emsp;&emsp;').replace(/(?<!\>)\n/g, '<br>'));
        (new MutationObserver(update)).observe($('#deskTopContainer')[0], {childList: true});
        break;
    }
    }
})();
