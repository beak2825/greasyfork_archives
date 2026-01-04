// ==UserScript==
// @name         GMM tools
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  顯示MMPage的marketline id/自動勾號，取消勾選fixture event頁面的checkbox
// @author       Yich
// @include       *MarketManagement/*
// @include       *://gmm*.gmm88.com/*
// @include        *SportBook/Event/FixtureEvent*
// @include      *gmmweb*
// @grant        none
// @run-at        document-end
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/383068/GMM%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/383068/GMM%20tools.meta.js
// ==/UserScript==

(function() {
    if(UrlContains("MarketManagement")){
        ShowMarketlineId();
    }
    if(UrlContains("gmm88")){
        AddRedBackGround();
    }
    //打開QAT event center的權限
    if(UrlContains("avabet")){
        enableEventCenter();
    }
    //目前還不能用
    if(UrlContains("FixtureEvent")){
      //WaitChildEventPanel();
    }


})();

function enableEventCenter(){
    const links = document.querySelectorAll('a[href="#"][style="color:#bbbbbb;"][disabled]');

    // 遍歷所有符合條件的 <a> 標籤並替換
    links.forEach(link => {
        if (link.textContent.trim() === 'Event Center') {
            link.outerHTML = `
            <a href="javascript:window.open('/Public/SsoRedirector.aspx?target=EventCenterWeb','_blank','width = 1280,height = 960,scrollbars = 1,resizable = 1');$.Event(window.event).preventDefault();">
                Event Center
            </a>
        `;
        }
    });
}

 //幫prod的background加上紅色
function AddRedBackGround(){

    function highlightProd(){
    var url = document.location.toString();
        if(window.location.href.indexOf("gmm88")>-1 && ($("#ContainerDiv").css("background-color") !== "red" || $("#event_table > thead > tr > th").css("background-color") !== "red")){
            $("#ContainerDiv").css("background-color","red");
            $("table > thead > tr > th").css("background-color","red");
        }
    }

    setInterval(highlightProd, 1000);
}

//用來顯示MMPage的MarketlineId
function ShowMarketlineId(){
    $('.search-panel >ul,#top-panel > div > ul').prepend('<li><input type="button" id="ShowAllMarketLine" value="ML ID" class="btn_release" ></li>');
    $( "#ShowAllMarketLine" ).click(function() {

        var enable = $(".showMlId").length == 0;


        if(enable){
            //將marketline id加到html中
            var pauseDiv = $(".pause").filter(function() {
                return $(this).attr("actionsrc") === "MarketLineStatusControl.js" ;
            });
            pauseDiv.each(function(i, obj) {
                $(this).parent().prepend("<span class='showMlId' style = 'background:#c9e1f6'>"+$(obj).attr("id").match(/\d+/)[0]+"</span>");
            });

            //將selection id加到html中
            var oddsdiv = $("tr:not([isalgorow])").find(".odds,.oddsnonlink").each(function(i, obj) {
                $(this).prepend("<span class='showSlId' style = 'background:#fe98b0' SlId='"+$(obj).attr("id").match(/\d+/)[0]+"'>S</span>");
            });

            var items = document.getElementsByClassName ("showSlId")
            for (var i = 0; i < items.length; i++) {
                items[i].addEventListener ("click", ClickSelectionBtn, false);
            }
        }else{
            $(".showMlId,.showSlId,#slidDisplay").remove();
        }

    });//end of ShowAllMarketLine click

         //Selection button點擊事件
    var ClickSelectionBtn = function (){
        $("#slidDisplay").remove();
        $(this).parent().append("<div id='slidDisplay'>"+$(this).attr("SlId")+"</div>");
    }
}

//用來一次全選、全取消勾選fixtureEvent頁面的checkbox
function WaitChildEventPanel(){
  waitForKeyElements(".vue-txtlabel:contains('Specials :')", ShowCheckAllCheckbox);
}

function ShowCheckAllCheckbox(){
  $(".vue-txtlabel:contains('Specials :')").append("<li><input type=\"checkbox\" id=\"checkAllBoxs\" name=\"checkAllBoxs\"><label for=\"checkAllBoxs\">Check All Checkboxs</label><br><\li>");
    $('#checkAllBoxs').click(function(event){
        var checked = $(this).attr("checked");
       $('[id^=chk]:enabled').attr('checked', checked);
        $('[id^=chk]:enabled')[0].dispatchEvent(new Event('change'));
    });
}



function UrlContains(urlfragment){
	return document.URL.indexOf(urlfragment) != -1;
}
