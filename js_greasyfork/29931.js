// ==UserScript==
// @name       Plug.dj avatar ramdom
// @namespace  plugdj
// @version    1.061
// @description  avatar
// @match      https://plug.dj/*
// @downloadURL https://update.greasyfork.org/scripts/29931/Plugdj%20avatar%20ramdom.user.js
// @updateURL https://update.greasyfork.org/scripts/29931/Plugdj%20avatar%20ramdom.meta.js
// ==/UserScript==   
setTimeout(randomAvatar,30000);
function randomAvatar() {

    var avatarSuccess,
    avatars;
    function getAvatars() {
        $.ajax({
            url : 'https://plug.dj/_/store/inventory/avatars',
            type : 'GET',
            contentType : 'application/json',
            success : function (data) {
                console.info("[Random Avatar] Got Avatars!");
                avatarSuccess = true;
                avatars = data.data;
            }
        });
    };
    function randomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    };
    function changeAvatar(avid) {
        var dataSend = {
            "id" : avid
        };
        $.ajax({
            url : 'https://plug.dj/_/users/avatar',
            type : 'PUT',
            contentType : 'application/json',
            data : JSON.stringify(dataSend),
            success : function (data) {
                console.info("[Random Avatar] Avatar Changed to " + avid);
            }
        });
    };
    setInterval(function () {
        if (!!avatarSuccess) {
            changeAvatar(randomFromArray(avatars).id);
        };
    }, 30000);
    getAvatars();
};
randomAvatar();