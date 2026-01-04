// ==UserScript==
// @name         Remove Puhlan
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Чистит чат от мусора
// @author       You
// @include https://vk.com/*
// @include http://vk.com/*
// @grant       GM.xmlHttpRequest
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/387835/Remove%20Puhlan.user.js
// @updateURL https://update.greasyfork.org/scripts/387835/Remove%20Puhlan.meta.js
// ==/UserScript==


var name = 'id1818059';
var element = document.getElementById('content');
var hashString = null;
var removedIds = [];
var scripts = document.getElementsByTagName('script');
for(var o=0; o<scripts.length; o++) {
    var re = /IM.init\(.*?"hash":"([^"]+)".*/ig;
    var hashStrings = re.exec($(scripts[o]).text());
    if (hashStrings) {
        hashString = hashStrings[1];
    }
}


element.addEventListener("DOMNodeInserted", filter, false);
//element.addEventListener("wheel", filter, false);

//setInterval(filter, 3000);
filter();

function removeMsg(msgId,peerId) {
    if (!hashString) return;
    if (removedIds.includes(msgId)) {
        console.log("Сообщение " + msgId + " уже удалено.");
        return;
    }
    removedIds.push(msgId);
    console.log("Remove message id: " + msgId + ", PeerId: " + peerId + ", Hash: " + hashString);
    console.log("Удалённых сообщений: " + removedIds.length);
    GM.xmlHttpRequest({
        method: "POST",
        url: "https://vk.com/al_im.php",
        data: "act=a_mark&al=1&gid=0&hash=" + hashString + "&im_v=2&mark=spam&msgs_ids="+msgId+"&peer="+peerId,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
            console.log("Response: " + response.responseText);
        }
    });
}

function filter ()
{
    var selector = 'a[href="/'+name+'"]';
    var spam = document.querySelectorAll(selector);

    for(var j=0; j<spam.length; j++)
    {
        if (spam[j].className == 'im-mess-stack--lnk'){
            var content = $(spam[j].parentElement.parentElement.parentElement);
            var al = content.find( ".im-mess-stack--lnk" );
            var topClass = al.parent().parent().parent().parent()
            //console.log("T2----> " + topClass.text() + " class: " + topClass.prop('className'));
            var messages = topClass.find( ".im-mess" );
            for (var i = 0; i < messages.length; i++) {
                if (messages[i].classList.contains("im-mess_fwd")) {
                    //console.log("Пересланное сообщение, пропускаем");
                    continue;
                }
                var message = $(messages[i]);
                var messageId = message.attr('data-msgid');
                var peerId = message.attr('data-peer');
                if (message.find(".media_link__photo_").length) {
                    console.warn("Фото \(link\) msgid: " + messageId);
                    removeMsg(messageId,peerId);
                } else if (message.find(".page_post_sized_thumbs").length) {
                    console.warn("Фото \(thumbs\) msgid: " + messageId);
                    removeMsg(messageId,peerId);
                } else if (message.find(".im_msg_media_link").length) {
                    var mediaLink = message.find(".im_msg_media_link");
                    console.warn("Линк ----> " + mediaLink.find(".media_link__subtitle").text() + ", Текст: " + mediaLink.find(".media_link__title").text());
                    removeMsg(messageId,peerId);
                } else if (message.find(".im-mess--text").length) {
                    var textMessage = message.find(".im-mess--text").text()
                    if (textMessage.length > 300) {
                        console.warn("Паста----> " + textMessage + ", длина: " + textMessage.length + ", class: " + message.find(".im-mess--text").prop('className'));
                        removeMsg(messageId,peerId);
                    }
                }
            }
        }
    }
}

