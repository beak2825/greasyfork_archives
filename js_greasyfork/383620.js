// ==UserScript==
// @name         MastodonRTScript
// @version      0.53
// @description  try to take over the world!
// @author       GensouSakuya
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @match        https://nebula.moe/*
// @namespace https://greasyfork.org/users/194737
// @downloadURL https://update.greasyfork.org/scripts/383620/MastodonRTScript.user.js
// @updateURL https://update.greasyfork.org/scripts/383620/MastodonRTScript.meta.js
// ==/UserScript==

//↑↑@match的意思是匹配特定的实例域名，需要增加新的实例则另起一行填入url即可
//例如 // @match         https://acg.mn/*
(
    function() {

        var rtButtonHtml = '<div class="compose-form__publish-button-wrapper" style="margin-right:16px"><button class="button button--block" id="rtButton" style="padding: 0px 16px; height: 36px; line-height: 36px;">转嘟！</button></div>';

        var buttonHtml = '<button aria-pressed="false" title="转发" class="status__action-bar-button star-icon icon-button" tabindex="0" style="font-size: 18px; width: 23.1429px; height: 23.1429px; line-height: 18px;"><span style="font-weight: bold;">RT</span></button>'

        $(document).on('DOMNodeInserted', injectAdditionalDownloadButtons);


        function injectAdditionalDownloadButtons(event)
        {
            if(event.target.localName == 'article')
            {
                injectRTButton(event.target);
            }
        }
        function injectRTButton(target) {
            var parentdiv = $(target).find('.status__action-bar');
            //var id = target.attributes["data-id"].value;
            var html = buttonHtml;//downloadButton.replace("########",id);
            var button = $(html).insertAfter($(parentdiv).children('.star-icon'));
            ////

            //var replybtn = $(parentdiv).find("[title]:eq(0)");
            //console.log(replybtn);
            ////
            $(button).off("click").on("click",function () {
                retootClick(this);
            });
        }

        var tootBtn;

        function retootClick(btn){
            //console.log(btn);
            var replybtn = $(btn).parent().find("[title]:eq(0)");
            replybtn.click();
            var tootbtn = $(btn).parent().find("[title]:eq(1)");
            tootBtn = tootbtn;

            var cwBtn = $(".compose-form__buttons-wrapper").find("button:eq(3)");
            if(cwBtn.hasClass("active"))
            {
                cwBtn.click();
            }
            var textarea = $(".compose-form__autosuggest-wrapper").find("textarea");
            textarea.val("RT ");
            displayRTbtn();
        }

        var sendBtn;

        function RTbtnClick(){
            var textarea = $(".compose-form__autosuggest-wrapper").find("textarea");
            var msg = textarea.val();
            $(".reply-indicator").find("button").click()
            textarea.val(msg);
            tootBtn.click();
            setTimeout(sendBtn.click(),1000);
            removeRTbtn();
        }

        function displayRTbtn(){
            if($("#rtButton").length==0)
            {
                sendBtn = $(".compose-form__publish").find("button");
                $(rtButtonHtml).insertBefore($(".compose-form__publish").find(".compose-form__publish-button-wrapper"));
                $('#rtButton').off("click").on("click",RTbtnClick);
            }
            else
            {
                $("#rtButton").css("display","block");
            }
        }

        function removeRTbtn(){
                $("#rtButton").css("display","none");
        }
    }()
)