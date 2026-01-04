// ==UserScript==
// @name         Pixiv AI Filter && Zoom
// @namespace    https://www.youtube.com/@NurarihyonMaou
// @version      0.5
// @description  Hover over Image to determine whether it's AI Generated | 'Zoom' Images by making them larger on hover | Works in "Users Your Following" (their Arts) Tab
// @author       NurarihyonMaou
// @match        https://www.pixiv.net/bookmark_new_illust.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/475760/Pixiv%20AI%20Filter%20%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/475760/Pixiv%20AI%20Filter%20%20Zoom.meta.js
// ==/UserScript==

const $ = window.jQuery;

let element;

let userID;
let hideAI = GM_getValue('hideAI') ?? false;
let profilesPostingAI = GM_getValue('profilesPostingAI') ?? [];

let zoomToggle = true;

function hideAIGenerated(){
    $.each(profilesPostingAI, function(index, profile){
        $.each(document.querySelectorAll(`[data-gtm-value='${profile}']`), function(index, illustToHide){
            $(illustToHide).parent().parent().parent().css("display", "none");
        });
    });
}

function showAIGenerated(){
    $.each(profilesPostingAI, function(index, profile){
        $.each(document.querySelectorAll(`[data-gtm-value='${profile}']`), function(index, illustToHide){
            $(illustToHide).parent().parent().parent().css("display", "block");
        });
    });
}


function init() {
let illusts = document.querySelectorAll('div[type=illust]');
let allImages = $('li.wHEbW');

if (allImages.length > 0 && illusts.length > 0) {


$(allImages).hover(function () {
    if(!zoomToggle)
       return;

    let delay=500, setTimeoutConst;
    element = $(this);
    setTimeoutConst = setTimeout(function() {

        $(element).find('*').not("button.fgVkZi").not("svg.fYcrPo").not("div.hHNegy").not("div.Sxcoo").not("div.liXhix").not("div.gUquFP").not("div.efxZOo").not("span").not("svg").not("a.sc-d98f2c-0").not("div.hMqBzA").not("div.jtpclu").not("a.dghpiU").not("img").not("div.cIllir").not("div.icsUdQ").not("div.eMfHJB").css("width", "400px").css("height", "400px").css("z-index", 999);
    }, delay);
    },  function () {

        $(element).find('*').not("button.fgVkZi").not("svg.fYcrPo").not("div.hHNegy").not("div.Sxcoo").not("div.liXhix").not("div.gUquFP").not("div.efxZOo").not("span").not("svg").not("a.sc-d98f2c-0").not("div.hMqBzA").not("div.jtpclu").not("a.dghpiU").not("img").not("div.cIllir").not("div.icsUdQ").not("div.eMfHJB").css("width", "").css("height", "").css("z-index", "");
        $(element).find("div.iGXOdz").css("width", "").css("height", "").css("z-index", "");
    }
), function(){
    clearTimeout(setTimeoutConst);
};

        let R18 = document.querySelectorAll("a[href='/bookmark_new_illust_r18.php']");
        let InputHideAI = document.querySelectorAll("input[id='HideAI']").length == 0 ? false : true;

        if(hideAI){
            hideAIGenerated();
            if(!InputHideAI)
                $(R18).after(`<input type='checkbox' id='HideAI' checked/>`);
        }
        else{
            if(!InputHideAI)
                $(R18).after(`<input type='checkbox' id='HideAI'/>`);
        }

        $("body").on('click', "input#HideAI", function () {
            hideAI = $(this).prop('checked');
            GM_setValue('hideAI', hideAI);
            if(hideAI)
                hideAIGenerated();
            else
                showAIGenerated();
        });


        $.each(illusts, function(index, illust){
            let hovered = false;

            let delay=100, setTimeoutConst;
            $(illust).hover(function(){

                setTimeoutConst = setTimeout(function() {
                    if(!hovered)
                        $.ajax({
                           method: 'GET',
                           url: "https://www.pixiv.net/ajax/illust/"+$(illust).find('a').attr('href').split('/')[3],
                           complete: function(data){
                                userID = data.responseJSON.body.userId;
                               if(data.responseJSON.body.aiType == 2){
                                   $(illust).append("<p>AI Generated</p>");
                                   
                                   if(profilesPostingAI.indexOf(userID) < 0){
                                        profilesPostingAI.push(userID);
                                        hideAIGenerated();
                                        GM_setValue('profilesPostingAI', profilesPostingAI);
                                   }
                               }
                            },
                           error: function(error){
                               console.error(error);
                           }
                        });
                    hovered = true;
                  }, delay);
                }, function(){
                  clearTimeout(setTimeoutConst);
            });
        });

} else {
    setTimeout(init, 0);
}
};

document.addEventListener("keydown", (e) => {
    if(e.which == 90)
      zoomToggle = !zoomToggle;
    else
        return;
});

init();

let previousUrl = '';
const observer = new MutationObserver(function(mutations) {
  if (window.location.href !== previousUrl) {
    if(previousUrl != '' && window.location.href.indexOf("https://www.pixiv.net/bookmark_new_illust.php") != -1)
        init();
    previousUrl = window.location.href;
    }
});
const config = {subtree: true, childList: true};

observer.observe(document, config);