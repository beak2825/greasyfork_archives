// ==UserScript==
// @name         Old Avatars the west
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Use old avatars for the west
// @author       Llane
// @include https://*.the-west.*/game.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427601/Old%20Avatars%20the%20west.user.js
// @updateURL https://update.greasyfork.org/scripts/427601/Old%20Avatars%20the%20west.meta.js
// ==/UserScript==

(function() {
        Avatar = {
        actualAvatar:0,
        selectedAvatar:-1,
        changedAvatar:false,
        avatars:[],
        prefix:"/images/avatars/",
        suffix:".jpg",
        init:function() {
            Avatar.avatars[0] = "trapper";
            Avatar.avatars[1] = "indian";
            Avatar.avatars[2] = "vagabond";
            Avatar.avatars[3] = "goldseeker";
            Avatar.avatars[4] = "trapper_woman";
            Avatar.avatars[5] = "indian_woman";
            Avatar.avatars[6] = "vagabond_woman";
            Avatar.avatars[7] = "goldseeker_woman";
            Avatar.avatars[8] = "bandit";
            Avatar.avatars[9] = "bountyhunter";
            Avatar.avatars[10] = "gunslinger";
            Avatar.avatars[11] = "hangdog";
            Avatar.avatars[12] = "bandit_woman";
            Avatar.avatars[13] = "bountyhunter_woman";
            Avatar.avatars[14] = "gunslinger_woman";
            Avatar.avatars[15] = "hangdog_woman";
            Avatar.avatars[16] = "cowboy";
            Avatar.avatars[17] = "pilgrim";
            Avatar.avatars[18] = "undertaker";
            Avatar.avatars[19] = "worker";
            Avatar.avatars[20] = "cowboy_woman";
            Avatar.avatars[21] = "pilgrim_woman";
            Avatar.avatars[22] = "undertaker_woman";
            Avatar.avatars[23] = "worker_woman";
            Avatar.avatars[24] = "cavalry";
            Avatar.avatars[25] = "iroquois";
            Avatar.avatars[26] = "mercenary";
            Avatar.avatars[27] = "mexican";
            Avatar.avatars[28] = "cavalry_woman";
            Avatar.avatars[29] = "iroquois_woman";
            Avatar.avatars[30] = "mercenary_woman";
            Avatar.avatars[31] = "mexican_woman";
            Avatar.avatars[32] = "mr.anonymus";

        }
    };
     Avatar.createWindow = function() {
        var content = $('<div class=\'avatar-window\'/>');
        var win = wman.open('avatar-table').setResizeable(true).setMinSize(750, 475).setSize(750, 475).setMiniTitle("Avatar change");
        var buttonLeft = new west.gui.Button("<<",function() {
            Avatar.actualAvatar--;
            if(Avatar.actualAvatar <0)
                Avatar.actualAvatar = Avatar.avatars.length-1;
            Avatar.createWindow();
        });
         buttonLeft.divMain.id = "buttonleft";
         var buttonRight = new west.gui.Button(">>",function() {
            Avatar.actualAvatar++;
            if(Avatar.actualAvatar == Avatar.avatars.length)
                Avatar.actualAvatar = 0;
            Avatar.createWindow();
        });
         buttonRight.divMain.id = "buttonright";
         var buttonSelect = new west.gui.Button("Select",function() {
            Avatar.selectedAvatar = Avatar.actualAvatar;
            Avatar.setCookies();
            Character.setAvatar(null,"<img src= \'" + Avatar.prefix + Avatar.avatars[Avatar.selectedAvatar] + Avatar.suffix + "'\ alt = \''\/>");
        });
         buttonSelect.divMain.id = "buttonselect";
        var html = "<div class=\'avatar-structure'\><h1 class=\'avatar-title'\> Selected avatar </h1><img class=\'avatar-image'\ src =" + Avatar.prefix + Avatar.avatars[Avatar.actualAvatar] + Avatar.suffix + "></div>";
        content.append(html);
         content.append(buttonLeft.getMainDiv());
         content.append(buttonRight.getMainDiv());
         content.append(buttonSelect.getMainDiv());
        win.appendToContentPane(content);
         Avatar.insertCss();

    };
    Avatar.insertCss = function() {
        $(".avatar-structure").css({"display":"block","position":"relative"});
        $(".avatar-image").css({"top":"100px","left":"282px","position":"absolute"});
        $(".avatar-title").css({"top":"70px","left":"272px","position":"absolute"});
         $("#buttonleft").css({"top":"140px","left":"177px","position":"absolute"});
        $("#buttonright").css({"top":"140px","left":"420px","position":"absolute"});
        $("#buttonselect").css({"top":"300px","left":"292px","position":"absolute"});
    };
    Avatar.getCompleteImage = function() {
        return Avatar.prefix + Avatar.avatars[Avatar.selectedAvatar] + Avatar.suffix;
    };
    Avatar.getSmallImage = function() {
        return Avatar.prefix + Avatar.avatars[Avatar.selectedAvatar] + "_small.png";
    };
    Avatar.checkRankImage =function() {
        var condition = false;
        $('.playerprofile-title-player').each(function(){
                var titleName = $(this).text().split(" ");
                if(titleName[titleName.length-1]==Character.name){
                    if($(this).parent().parent().parent().find(".profileavatar").find("img").attr("src") == Avatar.getCompleteImage()) {
                        condition = true;
                        return;
                    }
                }
            });

        if(Avatar.selectedAvatar != -1 && condition) {
            return true;
        }
        return false;
    };
    Avatar.checkProfileImage =function() {
        if(Avatar.selectedAvatar != -1 && $(".charoverview-avatar").find("img").attr("src") == Avatar.getCompleteImage()) {
            return true;
        }
        return false;
    };
    Avatar.checkFriendsImage =function() {
        if(Avatar.selectedAvatar != -1 && $(".fbar-player-self .fbar-player-avatar-wrapper .fbar-player-avatar-inner").find("img").attr("src") ==(Avatar.getSmallImage())) {
            return true;
        }
        return false;
    };
    Avatar.checkFortFightImage = function() {
        if(Avatar.selectedAvatar != -1 && $(".recruitlist_avatar").find("img").attr("src") == Avatar.getCompleteImage()) {
            return true;
        }
        return false;
    };
    Avatar.checkAdventure1Image = function() {
        if(Avatar.selectedAvatar != -1 && $(".mpi-playerinfo-avatar").find("img").attr("src") == Avatar.getCompleteImage()) {
            return true;
        }
        return false;
    }
    Avatar.deleteNewAvatar = function(where) {
        //avatar pic is visible when friends window is open, double drawing, not working only if default avatar is old
        if(where ==1 && $(".profileavatar .avatar_pic").length > 0 && $(".profileavatar").length > 0) {
            $(".profileavatar div").remove();
            $(".profileavatar").append('<div class=\"overlay"\></div>');
            $(".profileavatar").append('<img src=\""\>');
        }
        if(where == 2 && $(".charoverview-avatar .avatar_pic").length > 0 && $(".charoverview-avatar").length > 0) {
            $(".charoverview-avatar div").remove();
            $(".charoverview-avatar").append('<div class=\"overlay"\></div>');
            $(".charoverview-avatar").append('<img src=\""\>');
        }
        if(where == 3 && $(".fbar-player-self  .fbar-player-avatar-wrapper  .fbar-player-avatar-inner .avatar_small").length > 0) {
            $(".fbar-player-self .fbar-player-avatar-wrapper .fbar-player-avatar-inner div").remove();
            $(".fbar-player-self .fbar-player-avatar-wrapper .fbar-player-avatar-inner").append("<img class=\'old-avatar'\ src=\''\/>");
        }
        if(where == 4 && $(".recruitlist_avatar .avatar_pic").length > 0) {
            $(".recruitlist_avatar div").remove();
            $(".recruitlist_avatar").append('<img src=\""\>');
        }
        if(where == 5 && $(".mpi-playerinfo-avatar .avatar_pic").length > 0) {
            $(".mpi-playerinfo-avatar div").remove();
            $(".mpi-playerinfo-avatar").append("<img src=\''\/>");
        }
    };
    Avatar.changeDefaultAvatar = setInterval(function() {
        if(Avatar.selectedAvatar != -1) {
        if ($('.profileavatar').length && !Avatar.checkRankImage()) {
            $('.playerprofile-title-player').each(function(){
                var titleName = $(this).text().split(" ");
                if(titleName[titleName.length-1]==Character.name){
                    if($(this).parent().parent().parent().find(".avatar_pic").length > 0) {
                    $(this).parent().parent().parent().find(".profileavatar div").remove();
                    $(this).parent().parent().parent().find(".profileavatar").append('<div class=\"overlay"\></div>');
                    $(this).parent().parent().parent().find(".profileavatar").append('<img src=\""\>');
                    }
                    $(this).parent().parent().parent().find(".profileavatar img").attr("src",Avatar.getCompleteImage()).css({"margin":"16px 6px 6px","border":"2px solid rgb(0,0,0)"});
                }
            });
   }
        if($(".charoverview-avatar").length) {
            if(!Avatar.checkProfileImage()) {
            Avatar.deleteNewAvatar(2);
           $("div.charoverview-avatar img").attr("src",Avatar.getCompleteImage()).css({"margin":"16px 6px 6px","border":"2px solid rgb(0,0,0)"});
            }
      }
            if($(".fbar-player-self").length > 0) {
                if(!Avatar.checkFriendsImage()) {
                    Avatar.deleteNewAvatar(3);
                $(".fbar-player-self .fbar-player-avatar-wrapper .fbar-player-avatar-inner img").attr("src",Avatar.getSmallImage());
                }
            }
            if($(".fort_battle_infoarea").length > 0) {
                var name = $(".recruitlist_name span").text();
                if(name == Character.name && !Avatar.checkFortFightImage()) {
                    Avatar.deleteNewAvatar(4);
                    $(".recruitlist_avatar img").attr("src",Avatar.getCompleteImage());
                }
            }
            if($("#mpi-playerinfo").length > 0) {
                var name = $(".name").text();
                if(name == Character.name && !Avatar.checkAdventure1Image()) {
                    Avatar.deleteNewAvatar(5);
                    $(".mpi-playerinfo-avatar img").attr("src",Avatar.getCompleteImage());
                }
            }
            if($(".duel_report_self").length > 0) {
                $(".duel_report_self").each(function() {
                    if($(this).find("a").text() == Character.name && $(this).find(".duel_report_avatar img").attr("src") != Avatar.getSmallImage()) {
                    if($(this).find(".avatar_pic").length >0 ) {
                        $(this).find(".duel_report_avatar div").remove();
                        $(this).find(".duel_report_avatar").append('<img src=\""\>');
                    }
                    $(this).find(".duel_report_avatar img").attr("src",Avatar.getSmallImage());
                    }
                });
            }
            if($(".team-players").length > 0) {
                $(".team-players .player").each(function() {
                    var playerWindow = $(this).getMousePopup();
                    var text = playerWindow['text'];

                    if(text.includes(Character.name) && $(this).find("img").attr("src") != Avatar.getSmallImage()) {
                    if($(this).find(".avatar img").attr("src") != Avatar.getSmallImage()) {
                    if($(this).find(".avatar_pic").length > 0) {
                        $(this).find(".avatar div").remove();
                        $(this).find(".avatar").append('<img src=\""\>');
                    }


                    $(this).find(".avatar img").attr("src",Avatar.getSmallImage());
                    }
                   }
                });
            }
            if($(".tbsh_tooltip_head").length > 0 && $(".tbsh_tooltip_head .center").text().includes(Character.name) && !$(".tbsh_tooltip_head .tbsh_tooltip_avatar img").attr("src").includes(Avatar.getSmallImage())) {
                if($(".tbsh_tooltip_head .avatar_pic").length > 0) {
                    $(".tbsh_tooltip_head .avatar_pic").remove();
                    $(".tbsh_tooltip_head .tbsh_tooltip_avatar").append("<img src=\'" + Avatar.getSmallImage().substring(1) + "'\>");
                }else {
                $(".tbsh_tooltip_head .tbsh_tooltip_avatar img").attr("src",Avatar.getSmallImage().substring(1));
                }
            }
            if($(".ranking_halloffame_playername").length > 0) {
                $(".ranking_halloffame_playername").each(function() {
                 if($(this).find("a").text() == Character.name && $(this).parent().find("img").attr("src") != Avatar.getSmallImage() ){
                     if($(this).parent().find(".avatar_pic").length) {
                         $(this).parent().find(".player_pic div").remove();
                         $(this).parent().find(".player_pic").append("<img src=\''\>");
                     }
                    $(this).parent().find("img").attr("src",Avatar.getSmallImage());
                     }
                   })
            }

        }
    },1);
    Avatar.setCookies = function() {
        var expiracyDate = new Date();
         expiracyDate.setDate(expiracyDate.getDate() + 360000);
        document.cookie = "avatar=" + Avatar.selectedAvatar + ";expires=" + expiracyDate.toGMTString() + ";";
    };
    Avatar.getCookies = function() {
        var cookie = document.cookie.split("=");
        for(var i = 0; i < cookie.length;i++) {
           if( cookie[i].includes("avatar")) {
            Avatar.selectedAvatar = parseInt(cookie[i+1]);
            Avatar.actualAvatar = Avatar.selectedAvatar;
            Character.setAvatar(null,"<img src= \'" + Avatar.prefix + Avatar.avatars[Avatar.selectedAvatar] + Avatar.suffix + "'\ alt = \''\/>");
            break;
           }
        }


    };



      var menuimage = 'data:image/jpeg;base64,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';
      var div = $('<div class="ui_menucontainer" />');
    var link = $('<div id="Menu" class="menulink" onclick=Avatar.createWindow();  title="Old avatar" />').css('background-image', 'url(' + menuimage + ')').css('background-position', '0px 0px');
    $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
     $(document).ready(function () {
    try {
        Avatar.init();
        Avatar.getCookies();
    } catch (e) {
      console.log(e.stack);
    }
  });


})();