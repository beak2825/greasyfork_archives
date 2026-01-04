// ==UserScript==
// @name        Bangumi-Hyperlinks
// @namespace   BE
// @description Add Twitter, Instagram, Pixiv, and Amazon links based on Infobox content
// @homepage    https://github.com/NeKoOuO/bangumiscripts
// @homepage    https://greasyfork.org/scripts/485821-bangumi-hyperlinks
// @include     /https?:\/\/(bgm|bangumi|chii)\.(tv|in)\/(person|subject)\/\d+$/
// @version     0.1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/485821/Bangumi-Hyperlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/485821/Bangumi-Hyperlinks.meta.js
// ==/UserScript==

// Function to add social media and Pixiv links in Infobox
function addLinks() {
    $('#infobox').html(function(index, html) {
        // Add Twitter link
        html = html.replace(/([Tt]witter[^:]*|X): <\/span\>@?(https?:\/\/twitter\.com\/|)([\w\d_]+)/gi, '$1: </span><a class="l" href="https://twitter.com/$3" target="_blank">@$3</a>');

       // Add Instagram link
        html = html.replace(/([Ii]nstagram[^:]*): <\/span\>@?([^\s<]+)/gi, function(match, p1, p2) {
            var username = p2.replace(/https?:\/\/www.instagram.com\//, ''); // 移除前置的 URL
            // 如果尾綴有 "/" 則去掉
            if (username.endsWith('/')) {
                username = username.slice(0, -1);
            }
            return p1 + ': </span><a class="l" href="https://www.instagram.com/' + username + '" target="_blank">@' + username + '</a>';
        });

        // Add YouTube link
        html = html.replace(/([Yy]ou[Tt]ube[^:]*): <\/span\>@?(https?:\/\/(?:www\.)?youtube\.com\/channel\/|)([\w\d_-]+)/gi, '$1: </span><a class="l" href="https://www.youtube.com/channel/$3" target="_blank">@YouTube</a>');

        // Add Bilibili link
        html = html.replace(/([Bb]ili[Bb]ili[^:]*): <\/span\>@?(https?:\/\/(?:space\.)?bilibili\.com\/)([\w\d_-]+)/gi, '$1: </span><a class="l" href="https://space.bilibili.com/$3" target="_blank">@$3</a>');

        // Add Pixiv link
        html = html.replace(/([Pp]ixiv[^:]*): <\/span\>@?(https?:\/\/www\.pixiv\.net\/(en\/)?users?\/)?(?:id=)?([\w\d_]+)/gi, function(match, p1, p2, p3, p4) {
            var userId = p4;
            if (p4.startsWith('id=')) {
                userId = p4.substring(3); // Remove 'id=' prefix
            }
            var pixivUrl = p2 && p3 ? 'https://www.pixiv.net/member.php?id=' + userId : 'https://www.pixiv.net/users/' + userId;
            return p1 + ': </span><a class="l" href="' + pixivUrl + '" target="_blank">@' + userId + '</a>';
        });

        return html;
    });
}

//Add Amazon link by ISBN
$('#infobox').html((function() {
    var isbn = $('#infobox').html().match(/ISBN: <\/span\>([\dX\-]+)/)[1];
    if(typeof isbn == "undefined") return $('#infobox').html();
    isbn = isbn.replace(/\-/g, '');
    if(isbn.length == 13) {
        isbn = isbn.substr(3, 9);
        var tmp = 0;
        for(var i = 0; i <= 8; i++) {
            tmp += parseInt(isbn[i]) * (10 - i);
        }
        tmp = 11 - (tmp % 11);
        if(tmp == 10) tmp = "X";
        if(tmp == 11) tmp = "0";
        isbn += ("" + tmp);
    }
    return $('#infobox').html().replace(/ISBN: <\/span\>([\dX\-]+)/, 'ISBN: </span>$1 <a class="l" href="https://www.amazon.co.jp/dp/' + isbn + '" target="_blank">日本Amazon</a>');
}));
