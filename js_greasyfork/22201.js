// ==UserScript==
// @name           ppomppu 수정
// @namespace      https://greasyfork.org/ko/users/15592/
// @description    뽐뿌 링크 제거 등
// @include        http://*.ppomppu.co.kr/*
// @include        http://ppomppu.co.kr/*
// @author         anonymous
// @version        1.8
// @grant          none
// @run-at         document-end
// @id
// @license        public domain
// @downloadURL https://update.greasyfork.org/scripts/22201/ppomppu%20%EC%88%98%EC%A0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/22201/ppomppu%20%EC%88%98%EC%A0%95.meta.js
// ==/UserScript==

var anchors = document.getElementsByTagName('a');
//var regexp = /target=([^&#]*)/g;
var regexp = /target=(.*$)/g;
var target = '';

for (var i in anchors) {
    if (!anchors[i].href) continue;

    if (anchors[i].href.match(/http:\/\/s.ppomppu.co.kr\S*target=/)) {
        while ((match=regexp.exec(anchors[i].href)) !== null) {
            target = match[1];
            //console.info("#0 : " + match[0]);
            //console.info("#1 : " + match[1]);
            //console.info("#index : " + match.index);
        }

        if (anchors[i].href.match(/&encode=on/)){
            try {
                target = target.replace('&encode=on', '');
                anchors[i].href = atob(decodeURIComponent(target.replace(/\\/g,'')));
            } catch (e)
            {
                console.error('atob error!!!');
            }
        }
        else {
            anchors[i].href = target;
        }
    }
}

// 2016-08-10 메모칸에 로그인 메세지 후 이동 기능 제거
if (!!document.all.memo) {
    document.all.memo.onfocus = function() {
        if(checkLoginCount > 0)
            return true;

        if(_user == '0') {
            checkLoginCount++;
            alert('로그인 이후에 이용 가능 합니다.');
            //var s_url = 'zboard%2Fview.php%3Fid%3Dphone%26page%3D0%26divpage%3D%26no%3D3216072';
            //location.href="/zboard/login.php?s_url=" + s_url;
            return false;
        }
        return true;
    };
}

// 2016-8-11 더블클릭 top, bottom 스크롤 기능 제거
document.ondblclick = function () {
};

// 댓글창 로그인 체크 후 로그인 페이지로 이동 막기
if (checkLoginCount <= 0 && jQuery('#memo').length > 0)
{
    jQuery('#memo')[0].onfocus = {};
    jQuery('#memo').val('로그인 하세요!!!');
}