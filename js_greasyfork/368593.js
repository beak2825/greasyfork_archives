// ==UserScript==
// @name         隠密ユーザーの中身見るやつ
// @version      0.3
// @description  悪用厳禁だぞ★
// @author       udop
// @match        http://www1.x-feeder.info/*
// @match        http://www2.x-feeder.info/*
// @match        https://www1.x-feeder.info/*
// @match        https://www2.x-feeder.info/*
/* load jQuery */
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require https://code.jquery.com/ui/1.10.3/jquery-ui.min.js
// @namespace https://greasyfork.org/users/188116
// @downloadURL https://update.greasyfork.org/scripts/368593/%E9%9A%A0%E5%AF%86%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%AE%E4%B8%AD%E8%BA%AB%E8%A6%8B%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/368593/%E9%9A%A0%E5%AF%86%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%AE%E4%B8%AD%E8%BA%AB%E8%A6%8B%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==


(function($) {

    //隠密ユーザーの名前表示
    var userlistul = document.getElementById("online_users_list");

    var dispSecretUser = function(){
        var users = userlistul.getElementsByTagName("li");
        for (var user of users) {
            var id = user.id.slice(2);
            if (id === "") continue;
            if (onlineUsers[id].status == "9") {
                var spans = user.getElementsByTagName("span");
                spans[spans.length-2].innerHTML = onlineUsers[id].name;
                spans[spans.length-2].style.color = "purple";
            }
        }
    };

    var observer = new MutationObserver(function (MutationRecords, MutationObserver) {
        dispSecretUser();
    });

    observer.observe(userlistul, {
        childList: true,
    });


    $("#message_menu button").eq(0).click(function(){
        setTimeout(function(){
            var html = $("#message_view").html()
            var matcher = html.match(/ignoreOrAcceptUser\('........'\);/g);
            for(var i=0; i<matcher.length; i++){
                var id = matcher[i].match(/'(........)'/)[1];
                var name;
                try{
                    name = nameofid[id].join("<br>");
                }
                catch(e){
                    name = "退出済";
                }
                var hoge = $("#message_view").find("tr").eq(i+1).find("td").eq(1).html()
                $("#message_view").find("tr").eq(i+1).find("td").eq(1).html(hoge + " " + name).css("color","purple");
            }
        },500);
    });

    var nameofid = {}
    function update(){
        setTimeout(function(){
            for(var id in onlineUsers){
                var name = onlineUsers[id].name;
                if(!nameofid[id]){
                    nameofid[id]=[];
                }
                if(nameofid[id].indexOf(name) == -1){
                    nameofid[id].push(name);
                }
            }
        },1000);
    }
    update()

    socket.on('syncCallback', function(data) {
        if (data.code != 3 && data.code != 0 && data.code != 2) return(false); //3が発言らしい
        update();
    });

})(jQuery);