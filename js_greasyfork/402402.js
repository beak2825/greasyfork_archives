// ==UserScript==
// @name         Acfun首页板块位置自定义
// @namespace    ACfunHomePageCustomize
// @version      0.1.4
// @description  Acfun首页板块位置自定义，跳转
// @author       Jianeddie
// @match        https://www.acfun.cn/
// @require      https://code.jquery.com/jquery-3.5.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.scrollto@2.1.2/jquery.scrollTo.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/402402/Acfun%E9%A6%96%E9%A1%B5%E6%9D%BF%E5%9D%97%E4%BD%8D%E7%BD%AE%E8%87%AA%E5%AE%9A%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/402402/Acfun%E9%A6%96%E9%A1%B5%E6%9D%BF%E5%9D%97%E4%BD%8D%E7%BD%AE%E8%87%AA%E5%AE%9A%E4%B9%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // pagelet_douga.parentNode.removeChild(pagelet_douga);

    var $ = window.$;

    var pageletList = [
        {'name': '动画', 'divname': 'pagelet_douga'},
        {'name': '游戏', 'divname': 'pagelet_game'},
        {'name': '娱乐', 'divname': 'pagelet_amusement'},
        {'name': '番剧', 'divname': 'pagelet_bangumi_list'},
        {'name': '生活', 'divname': 'pagelet_life'},
        {'name': '科技', 'divname': 'pagelet_tech'},
        {'name': '舞蹈', 'divname': 'pagelet_dance'},
        {'name': '音乐', 'divname': 'pagelet_music'},
        {'name': '影视', 'divname': 'pagelet_film'},
        {'name': '鱼塘', 'divname': 'pagelet_fishpond'},
        {'name': '体育', 'divname': 'pagelet_sport'}];

    var listIndex = [0,1,2,3,4,5,6,7,8,9,10];

    var sortalbeFlag = false;

    var storageData = getStorageData();
    if (storageData) {
        listIndex = storageData;

    } else {
        setStorageData(listIndex);
    }

    var divList = document.createElement('div');
    divList.style.cssText = "position: fixed;top:295px;left:calc(50% + 620px);border:1px solid #e5e5e5; border-radius:8px;";
    divList.id = "pagelet_List";

    var divListTips = document.createElement('div');
    divListTips.style.cssText = "position: fixed;top:406px;left:calc(50% + 705px);border:1px solid #e5e5e5; border-radius:8px;height: 300px;width: 30px;display: flex;flex-direction:column;align-items: center;justify-content:center;-ms-user-select: none;user-select: none;";
    divListTips.id = "pagelet_ListTips";

    var divListTipsNote = document.createElement('div');
    divListTipsNote.style.cssText = "word-wrap: break-word;width: 14px;text-align: center;letter-spacing: 4px;color: black;font-size:14px";
    divListTipsNote.id = "pagelet_ListTipsNote";
    divListTipsNote.innerText = "←拖动可调整分区位置←";
    divListTips.appendChild(divListTipsNote);

    var divListTipsNoteB = document.createElement('div');
    divListTipsNoteB.style.cssText = "height: 12px;";
    divListTips.appendChild(divListTipsNoteB);

    var divListTipsTop = document.createElement('div');
    divListTipsTop.style.cssText = "position: fixed;top:370px;left:calc(50% + 680px);";
    divListTipsTop.id = "pagelet_ListTipsTop";

    var imgTop = document.createElement('img');
    imgTop.style.cssText = "width:60px;";
    //imgTop.setAttribute('src','https://js2.a.yximgs.com/bs2/emotion/1589273286998third_party_b59381310.png');
    imgTop.setAttribute('src','https://tx-free-imgs2.acfun.cn/kimg/bs2/zt-image-host/ChYwOGJiODNhYzRjMTBjZGJhYzQ4MDA1EJjM1y8.png');
    divListTipsTop.appendChild(imgTop);

    var divListTipsBottom = document.createElement('div');
    divListTipsBottom.style.cssText = "position: fixed;top:670px;left:calc(50% + 715px);";
    divListTipsBottom.id = "pagelet_ListTipsBottom";

    var imgBottom = document.createElement('img');
    imgBottom.style.cssText = "width:60px;";
    //imgBottom.setAttribute('src','https://js2.a.yximgs.com/bs2/emotion/1589273285493third_party_b59381293.png');
    imgBottom.setAttribute('src','https://tx-free-imgs2.acfun.cn/kimg/bs2/zt-image-host/ChYwOGMwOGVhYzRjMTA4M2UxZDhhNDA3EJjM1y8.png');
    divListTipsBottom.appendChild(imgBottom);

    var divListCss ="width: 54px;height: 30px;line-height: 30px;text-align: center;transition: all .2s;cursor: pointer;-ms-user-select: none;user-select: none;color: black;";

    var divListTop = document.createElement('div');
    divListTop.style.cssText = divListCss + "margin-top: 6px;";
    divListTop.id = "pagelet_ListTop";
    divListTop.innerText = "置顶";
    divList.appendChild(divListTop);

    var divListRecommend = document.createElement('div');
    divListRecommend.style.cssText = divListCss;
    divListRecommend.id = "pagelet_ListRecommend";
    divListRecommend.innerText = "推荐";
    divList.appendChild(divListRecommend);

    var divListBanana = document.createElement('div');
    divListBanana.style.cssText = divListCss + "border-bottom:1px solid #e5e5e5;";;
    divListBanana.id = "pagelet_ListBanana";
    divListBanana.innerText = "香蕉榜";
    divList.appendChild(divListBanana);

    var divListContain = document.createElement('div');
    divListContain.style.cssText = "display: flex;flex-direction:column;align-items: center;justify-content:center;";
    divListContain.id = "pagelet_List_Contain";
    divList.appendChild(divListContain);

    for(let num = 0;num < pageletList.length;num ++){
        var divListItem = document.createElement('div');
        divListItem.style.cssText = divListCss;
        divListItem.id = "pagelet_ListItem_" + listIndex[num];
        divListItem.innerText = pageletList[listIndex[num]].name;
        divListContain.appendChild(divListItem);

        if (num == 0){
            $("#pagelet_list_banana").after($('#' + pageletList[listIndex[num]].divname));
        } else {
            $('#' + pageletList[listIndex[num - 1]].divname).after($('#' + pageletList[listIndex[num]].divname));
        }
    }

    var divListChange = document.createElement('div');
    divListChange.style.cssText = divListCss + "border-top:1px solid #e5e5e5;";
    divListChange.id = "pagelet_ListItemChange";
    divListChange.innerText = "调整";
    divList.appendChild(divListChange);

    var divListDefault = document.createElement('div');
    divListDefault.style.cssText = divListCss + "margin-bottom: 6px;";
    divListDefault.id = "pagelet_ListItemDefault";
    divListDefault.innerText = "重置";
    divList.appendChild(divListDefault);


    var pagelet_top_area = document.getElementById("pagelet_top_area");
    pagelet_top_area.parentNode.appendChild(divList);

    var overCss = {"background-color": "#fd4c5d","color": "white"};
    var outCss ={"background-color": "transparent","color": "black"};

    $('#pagelet_ListTop').mouseover(function () {
        $('#pagelet_ListTop').css(overCss);
    }).mouseout(function () {
        $('#pagelet_ListTop').css(outCss);
    }).click(function(){
        $.scrollTo('#pagelet_top_area',200,{offset:-110});
    })

    $('#pagelet_ListRecommend').mouseover(function () {
        $('#pagelet_ListRecommend').css(overCss);
    }).mouseout(function () {
        $('#pagelet_ListRecommend').css(outCss);
    }).click(function(){
        $.scrollTo('#pagelet_monkey_recommend',200,{offset:-110});
    })

    $('#pagelet_ListBanana').mouseover(function () {
        $('#pagelet_ListBanana').css(overCss);
    }).mouseout(function () {
        $('#pagelet_ListBanana').css(outCss);
    }).click(function(){
        $.scrollTo('#pagelet_list_banana',200,{offset:-110});
    })

    for(let num = 0;num < pageletList.length;num ++){
        (function(num){
            $('#pagelet_ListItem_' + num).mouseover(function () {
               $('#pagelet_ListItem_' + num).css(overCss);
            }).mouseout(function () {
               $('#pagelet_ListItem_' + num).css(outCss);
            }).click(function(){
                $.scrollTo('#' + pageletList[num].divname,200,{offset:-110});
            })
        })(num)
    }

    $('#pagelet_ListItemChange').mouseover(function () {
        $('#pagelet_ListItemChange').css(overCss);
     }).mouseout(function () {
        $('#pagelet_ListItemChange').css(outCss);
    }).click(function(){
        if (sortalbeFlag){
            $('#pagelet_ListItemChange').mouseout(function () {
                $('#pagelet_ListItemChange').css(outCss);
            });

            $("#pagelet_List_Contain").sortable({disabled: true});
            sortalbeFlag = false;
            for(let num = 0;num < pageletList.length;num ++){
                (function(num){
                    $('#pagelet_ListItem_' + num).css(outCss);
                    $('#pagelet_ListItem_' + num).mouseover(function () {
                        $('#pagelet_ListItem_' + num).css(overCss);
                    }).mouseout(function () {
                        $('#pagelet_ListItem_' + num).css(outCss);
                    }).click(function(){
                        $.scrollTo('#' + pageletList[num].divname,200,{offset:-110});
                    })
                })(num)
            }

            pagelet_top_area.parentNode.removeChild(divListTips);
            pagelet_top_area.parentNode.removeChild(divListTipsTop);
            pagelet_top_area.parentNode.removeChild(divListTipsBottom);

        } else{
            $('#pagelet_ListItemChange').unbind('mouseout');
            for(let num = 0;num < pageletList.length;num ++){
                (function(num){
                    $('#pagelet_ListItem_' + num).unbind('click');
                })(num)
            }
            $("#pagelet_List_Contain").sortable({disabled: false,axis: "y",revert: 300,scrollSensitivity: 50,activate: function( event, ui ) {
                for(let num = 0;num < pageletList.length;num ++){
                    (function(num){
                        $('#pagelet_ListItem_' + num).css(outCss);
                        $('#pagelet_ListItem_' + num).unbind('mouseover');
                    })(num)
                }

                $(ui.item).css(overCss);
                $(ui.item).unbind("mouseout");

            },stop: function( event, ui ) {
                $(ui.item).mouseout(function () {
                        $(ui.item).css(outCss);
                    })

                for(let num = 0;num < pageletList.length;num ++){
                    (function(num){
                        $('#pagelet_ListItem_' + num).mouseover(function () {
                            $('#pagelet_ListItem_' + num).css(overCss);
                        })
                    })(num)
                }

                var sortedIDs = $( "#pagelet_List_Contain" ).sortable( "toArray" );

                for(let num = 0;num < sortedIDs.length;num ++){
                    if (listIndex[num] != parseInt(sortedIDs[num].split('_')[2])){
                        listIndex[num] = parseInt(sortedIDs[num].split('_')[2]);
                    }
                }

                setStorageData(listIndex);

                for(let num = 0;num < pageletList.length;num ++){
                    if (num == 0){
                        $("#pagelet_list_banana").after($('#' + pageletList[listIndex[num]].divname));
                    } else {
                        $('#' + pageletList[listIndex[num - 1]].divname).after($('#' + pageletList[listIndex[num]].divname));
                    }
                }
            }});
            sortalbeFlag = true;

            pagelet_top_area.parentNode.appendChild(divListTips);
            pagelet_top_area.parentNode.appendChild(divListTipsTop);
            pagelet_top_area.parentNode.appendChild(divListTipsBottom);
        }
    })

    $('#pagelet_ListItemDefault').mouseover(function () {
        $('#pagelet_ListItemDefault').css(overCss);
     }).mouseout(function () {
        $('#pagelet_ListItemDefault').css(outCss);
    }).click(function(){
        deleteStorageData();
        location.reload();
    })


    function getStorageData() {
        return GM_getValue('ACfunHomePageCustomizeData');
    }

    function setStorageData(value) {
        return GM_setValue('ACfunHomePageCustomizeData', value);
    }

    function deleteStorageData() {
        GM.deleteValue("ACfunHomePageCustomizeData");
    }
})();