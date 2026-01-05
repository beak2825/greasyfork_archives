// ==UserScript==
// @name         Amazon Kindle FixedLayout Message
// @description  Show message for fixedlayout.
// @namespace    https://twitter.com/foldrr/
// @author       foldrr
// @version      0.3
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @match        https://www.amazon.co.jp/*
// @downloadURL https://update.greasyfork.org/scripts/26240/Amazon%20Kindle%20FixedLayout%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/26240/Amazon%20Kindle%20FixedLayout%20Message.meta.js
// ==/UserScript==

(function() {
    var message = '固定レイアウト';
    var keywords = [
        '固定レイアウト',
        'ダウンロードに時間がかかる'
    ];

    $.each(keywords, function(index, keyword){
        var i = document.body.innerText.indexOf(keyword);
        if (i < 0) return;

        $('#dp-container').prepend(
            $('<div>', {style: "margin-bottom: 5px; padding: 16pt; border:3px solid red; background: #FDD; font-size: x-large"}).append(
                $('<p>' + message + '</p>')
            ));
        return false;
    });
})();
