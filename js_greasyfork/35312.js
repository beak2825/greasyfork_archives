// ==UserScript==
// @name         SeriousGMod++
// @namespace    http://skyrossm.pcriot.com
// @version      1.0
// @description  try to take over the world!
// @author       Skyrossm, Xproplayer, Yatty
// @match        https://www.seriousgmod.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35312/SeriousGMod%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/35312/SeriousGMod%2B%2B.meta.js
// ==/UserScript==

/* =======+ Settings +======= */
var colorStealer = false; //Steal the previous message's color. NOTE: some users may use red and heck u over, use at own risk.
var rc = true; //Random color
    var rcColor = "pink"; //Choose from Blue, Red, Green, Yellow, Monochrome, and Pink
var betterPosts = true; //Add New Posts to the side of /chat/
var nicknames = true;
    // [ID, Replacement, If the original name should be replaced]
    var replacements = [
        [10789, "Yattem", false],
        [138, "Sky", false],
        [6775, "Xboo", false]
    ];

jQuery.ajaxSetup({
  cache: true
});

function replace() {
        var usernames = document.getElementsByClassName('username');
        main:
        for (var i = 0; i < usernames.length; ++i) {
            var item = usernames[i].children[0];
            if (item) {
                if (usernames[i].href) {
                    var id = usernames[i].href.split(".").slice(-1)[0].split("/")[0];
                    for (var i2 = 0; i2 < replacements.length; ++i2) {
                        var replacement = replacements[i2];
                        if (id == replacement[0]) {
                            if (!item.innerHTML.includes(replacement[1])) {
                                if(replacement[2]){
                                    item.innerHTML = replacement[1];
                                } else {
                                    item.innerHTML = item.innerHTML + " <span style=\"color: grey;\">(" + replacement[1] + ")</span>";
                                }
                            }
                        }
                    }
                } else {
                    if (usernames[i].tagName == "H1") {
                        id = window.location.href.split("/").slice(-2)[0].split(".").slice(-1)[0];
                        for (var i2 = 0; i2 < replacements.length; ++i2) {
                            var replacement = replacements[i2];
                            if (id == replacement[0]) {
                                if (!item.innerHTML.includes(replacement[1])) {
                                    if(replacement[2]){
                                        item.innerHTML = replacement[1];
                                    } else {
                                        item.innerHTML = item.innerHTML + " <span style=\"color: grey;\">(" + replacement[1] + ")</span>";
                                    }
                                }
                            }
                        }
                    }
                    if (usernames[i].tagName == "H3") {
                        var id = item.href.split(".").slice(-1)[0].split("/")[0];
                        for (var i2 = 0; i2 < replacements.length; ++i2) {
                            var replacement = replacements[i2];
                            if (id == replacement[0]) {
                                if (!item.innerHTML.includes(replacement[1])) {
                                    if(!item.className.includes("StatusTooltip")){
                                        if(replacement[2]){
                                            item.innerHTML = replacement[1];
                                        } else {
                                            item.innerHTML = item.innerHTML + " <span style=\"color: grey;\">(" + replacement[1] + ")</span>";
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


(function() {
    if(betterPosts && window.location.pathname == "/chat/"){
        $('div[class="sidebar"]').append('<style>.threadListItem{overflow:hidden;zoom:1;margin:0;padding:5px 0;border-top:1px solid #2c2c2c;border-bottom:1px solid #161616}.threadListItem:first-child{border-top:none;padding-top:0}.threadListItem:last-child{border-bottom:none}.threadListItem .avatar{float:left;font-size:0}.threadListItem .avatar img{width:24px;height:24px}.threadListItem .messageInfo{margin-left:34px}.threadListItem .title{padding:1px 0}.threadListItem .additionalRow,.threadListItem .title{overflow:hidden;white-space:nowrap;word-wrap:normal;text-overflow:ellipsis}</style><div id="threadFrame" class="section threadList"></div>');
        $('#threadFrame').load('https://www.seriousgmod.com/ .threadList > div');
    }
    if(nicknames){
        replace();

        setInterval(function() {
            replace();
        }, 1000);
    }
})();

if(rc){
    setInterval(function(){
        taigaLastMessage = $(".taigachat_messagetext").last()[0].innerHTML;
        lastColor = taigaLastMessage.substring(20,27);
        jQuery.ajax({
            url: "https://cdnjs.cloudflare.com/ajax/libs/randomcolor/0.5.2/randomColor.min.js",
            dataType: "script",
            cache: true
        }).done(function() {
            jQuery.ajax({
                url: "https://code.jquery.com/color/jquery.color.js",
                dataType: "script",
                cache: true
            }).done(function() {
                var color = randomColor({
                    luminosity: 'light',
                    hue: rcColor
                });
                taigachat.customColor = color.slice(1);
                $("#taigachat_message").animate({color: color},1000);
            });
        });
    }, 2000);
}

if(colorStealer){
    setInterval(function(){
        taigaLastMessage = $(".taigachat_messagetext").last()[0].innerHTML;
        lastColor = taigaLastMessage.substring(21,27);
        taigachat.customColor = lastColor;
        $("#taigachat_message").css({color: "#"+lastColor});
    }, 100);
}

if(betterPosts){
    setInterval(function(){
        $('#threadFrame').load('https://www.seriousgmod.com/ .threadList > div');
    }, 300000);
}

