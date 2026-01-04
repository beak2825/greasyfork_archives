// ==UserScript==
// @name              Pixiv quick fav
// @name:zh-CN        Pixiv 一键收藏
// @namespace         https://twitter.com/ikenaikoto
// @version           1.6
// @description       One-click fav on Pixiv
// @description:zh-cn Pixiv 一键收藏，避免烦人的页面跳转
// @author            fireattack
// @match             *://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// @downloadURL https://update.greasyfork.org/scripts/35427/Pixiv%20quick%20fav.user.js
// @updateURL https://update.greasyfork.org/scripts/35427/Pixiv%20quick%20fav.meta.js
// ==/UserScript==

function urlencodeFormData(fd) { //From: https://stackoverflow.com/questions/7542586/new-formdata-application-x-www-form-urlencoded
    var s = '';

    function encode(s) {
        return encodeURIComponent(s).replace(/%20/g, '+');
    }
    for (var pair of fd.entries()) {
        if (typeof pair[1] == 'string') {
            s += (s ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1]);
        }
    }
    return s;
}

var target = document.querySelector('body');

// create an observer instance
var observer = new MutationObserver(function (mutations, ob) {
    mutations.forEach(function (mutation) {
        var favBtn = document.querySelector('a[href*="/bookmark_add.php"]');
        if (favBtn && favBtn.querySelectorAll('path')) {
            main(favBtn);
            //ob.disconnect();
        }
    });
});

// configuration of the observer:
var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
};

// pass in the target node, as well as the observer options
observer.observe(target, config);

function gradientColorChange(favBtn) {
    var i = 255;
    var j = -10;
    return setInterval(() => {
        favBtn.querySelectorAll('path')[1].style.fill = `rgb(${i}, 64, 96`;
        i = i + j;
        if (i < 0) {
            i = -i;
            j = -j;
        };
        if (i > 255) {
            i = 255 - (i - 255);
            j = -j;
        }
    }, 30);
}

function main(favBtn) {
    favBtn.onclick = (event) => {
        var color = window.getComputedStyle(favBtn.querySelectorAll('path')[0]).fill;
        if (color != "rgb(255, 64, 96)") {
            var data = new FormData();
            data.append('mode', 'save_illust_bookmark');
            data.append('illust_id', window.location.href.match(/id=(\d+)/)[1]);
            data.append('restrict', '0');
            data.append('comment', '');
            data.append('tags', '');
            data.append('tt', globalInitData.token);
            data = urlencodeFormData(data);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/rpc/index.php', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.onload = () => {
                var jsonResponse = JSON.parse(xhr.responseText);
                if (jsonResponse.error) {
                    console.log('Bookmark error!');
                } else {
                    clearInterval(t);
                    favBtn.querySelectorAll('path')[0].style.fill = 'rgb(255, 64, 96)';
                    favBtn.querySelectorAll('path')[1].style.fill = 'rgb(255, 64, 96)';
                }
            };
            xhr.send(data);
            t = gradientColorChange(favBtn);
            event.preventDefault();
        }
    }
}