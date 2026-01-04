// ==UserScript==
// @name          DARE Enhancement
// @namespace     DARE Enhancement
// @description   DARE Enhancement + "Alt + G" to display / "Alt + S" to display Toast / Show Info about Notif
// @author        Quentin V
// @version       1.0.2
// @include       *launchpad*
// @icon          https://i.imgur.com/AC7SyUr.png
// @compatible    Chrome Google Chrome + Tampermonkey
// @grant         GM_registerMenuCommand
// @require       http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/391998/DARE%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/391998/DARE%20Enhancement.meta.js
// ==/UserScript==
console.log("build container");

(function() {
    "use strict";
    //var $ = window.jQuery;
    const dare_enhancement_lang_switch = true;
    const dare_enhancement_lang_array = ["EN", "FR", "IT", "DE", "ES", "JA", "ZH"];
    var dare_enhancement_css = `
.dare_enhancement_button { display:inline-block; padding:0.2em 1.45em; margin:0.1em; border:0.15em solid; box-sizing:border-box;text-decoration:none;font-family:'Lato Light';font-weight:400;color:white;background-color:#333333;
text-align:center;position:relative;}
.dare_enhancement_button:hover { border-color:#7a7a7a; }
.dare_enhancement_button:active { background-color:#999999; }
@media all and (max-width:30em) { .QQbut{ display:block; margin:0.2em auto; } }
.dare_enhancement_container { padding:10px;z-index:99999;}`;
    const dare_container_style = "top:0px;right:0;position:absolute;";
    const dare_class_toggle = 'dare_enhancement_class_toggle';
    const dare_id_container = 'dare_enhancement_id_container';
    const dare_class_container = ['dare_enhancement_container', 'ricUi5Breadcrumb', dare_class_toggle];
    const dare_class_button = ['dare_enhancement_button'];

    addGlobalStyle(dare_enhancement_css);

    //-----------------------------
    document.addEventListener('keydown', function(e) {
        // handle dashboard for language
        // pressed alt+g
        if (e.keyCode == 71 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
            $('.' + dare_class_toggle).toggle();
            showInfo();
        };

        if (e.keyCode == 83 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
            navigator.clipboard.readText()
                .then(text => {
                addToast(text);
            })
                .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
        };5

    }, false);

    $(window).on('hashchange', function(e){
        console.log("ww");
        setTimeout(showInfo(), 5000);
    });


    if (dare_enhancement_lang_switch == true) {
        build_container(dare_id_container);
        dare_enhancement_lang_array.forEach(function(e){ buttonLang(e); });
    }

    function analyzePopup(){
        var equi = sap.ui.getCore().byId($('[id^=__label]')[0].id).getModel("write").getData().NotificationWebCS.Create.Equipment.EQUNR;

        $("#qq--SubtitleText");
        $("#idMainView--SubtitleText").text( $("#idMainView--SubtitleText").text + equi);
    }

    // at startup this is shown as deactivated
    $('.' + dare_class_toggle).toggle();
    //---------------------------------------------------------------------------------
    function changeLang(a) {
        sap.ui.getCore().getConfiguration().setLanguage(a);
    };

    function buttonLang(a) {
        var button = document.createElement("Button");
        $('#' + dare_id_container).append(button);

        button.onclick = function() {
            changeLang(a)
        };
        button.innerHTML = a;

        dare_class_button.forEach(function(e) {
            $(button).addClass(e);
        });
    };

    function build_container(a) {
        var container = document.createElement("div");
        container.id = a;
        container.style = dare_container_style;

        dare_class_container.forEach(function(e) {
            $(container).addClass(e);
        });
        document.body.appendChild(container);
    };

    //---------------------------------------------------------------------------------
    const dare_enhancement_popup_timeout = 5000;
    const dare_enhancement_popup_id = '#dare_enhancement_pop_up';
    const dare_enhancement_div ='<div class="sapMMessageToast sapUiSelectable sapContrast sapContrastPlus" role="alert" aria-label="" id="dare_enhancement_pop_up" style="width: 15em;position: absolute; visibility: visible; z-index: 150; display: block; top: 1159px; left: 1129px;"></div>';

    function addToast(str) {
        //remove the last pop-up if it exists
        $('dare_enhancement_popup_id').remove();
        $('body').append(dare_enhancement_div);
        $(dare_enhancement_popup_id).text(str);
        setTimeout(function(){$(dare_enhancement_popup_id).remove();}, 5000);
    };

    $('h1').on("click",function(){
        showInfo();
    });

})();

function addInfo(v,t){
        console.log("addInfo");
        if(v) {
            $("#qq--SubtitleText").append('<span class="title">--'+t+'--</span><span class="quickcopy">' + v + '</span>' );
        };
}

function showInfo(){
console.log("showInfo");

        if( $("#qq--SubtitleText").length == 0 ){
            $("#idMainView--SubtitleText").append('<div id="qq--SubtitleText"></div>')
        }

        $("#qq--SubtitleText").empty();

        //--------------------------------------------------------------------------------------------------------------------------------
        addInfo(sap.ui.getCore().byId( $('[id^=__label]')[0].id).getModel("write").getData().NotificationWebCS.Create.Kunum,"KUNUM");
        addInfo(sap.ui.getCore().byId( $('[id^=__label]')[0].id).getModel("write").getData().NotificationWebCS.Create.Equipment.EQUNR,"EQUI");
        addInfo(sap.ui.getCore().byId( $('[id^=__label]')[0].id).getModel("write").getData().NotificationCollect.Create.SdDocNum,"SDDOC");

        $("#qq--SubtitleText").append("<input id='qq_temp'></input>");
        $("#qq_temp").toggle(false);

        $(".quickcopy").on("click", function (event){
            quickCopy($(this));

        });

    };

function quickCopy(b) {
            var a = b.text();
            $("#qq_temp").toggle(true);
            $("#qq_temp").val(a);
            var copyText = document.getElementById("qq_temp");
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
            $("#qq_temp").toggle(false);
            sap.m.MessageToast.show(b.text()+" was copied to clipboard");
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
};