// ==UserScript==
// @name         niconico tagrepo
// @namespace    https://twitter.com/r1825_java
// @version      0.1
// @description  niconicoのフォローページにタグレポへのリンクを追加します。
// @author       r1825
// @include      https://www.nicovideo.jp/my/follow*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422189/niconico%20tagrepo.user.js
// @updateURL https://update.greasyfork.org/scripts/422189/niconico%20tagrepo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(
    function () {
        let target = document.getElementsByClassName("SubMenuHeader MyFollowSideContainer-header")[0];
        target.insertAdjacentHTML('beforebegin','<header class="SubMenuHeader MyFollowSideContainer-header"><h3 class="SubMenuHeader-title">フォロー中のタグ</h3></header><ul class="SubMenuLinkList MyFollowSideContainer-menu"><li class="SubMenuLink MyFollowSideContainer-menuItem"><a class="SubMenuLink-link SubMenuLink-link_internal" href="/my/follow/tag/NEUTRINO(歌声合成エンジン)/tagrepo?ref=pc_mypage_follow_tag"><span class="SubMenuLink-label">NEUTRINO(歌声合成エンジン)</span></a><li><li class="SubMenuLink MyFollowSideContainer-menuItem"><a class="SubMenuLink-link SubMenuLink-link_internal" href="/my/follow/tag/ボイ酒ロイド/tagrepo?ref=pc_mypage_follow_tag"><span class="SubMenuLink-label">ボイ酒ロイド</span></a></li><li class="SubMenuLink MyFollowSideContainer-menuItem"><a class="SubMenuLink-link SubMenuLink-link_internal" href="/my/follow/tag/ゆっくり解説/tagrepo?ref=pc_mypage_follow_tag"><span class="SubMenuLink-label">ゆっくり解説</span></a></li><li class="SubMenuLink MyFollowSideContainer-menuItem"><a class="SubMenuLink-link SubMenuLink-link_internal" href="/my/follow/tag/ニコニコ動画講座/tagrepo?ref=pc_mypage_follow_tag"><span class="SubMenuLink-label">ニコニコ動画講座</span></a></li><li class="SubMenuLink MyFollowSideContainer-menuItem"><a class="SubMenuLink-link SubMenuLink-link_internal" href="/my/follow/tag/VOICEROIDファンの数学サイド/tagrepo?ref=pc_mypage_follow_tag"><span class="SubMenuLink-label">VOICEROIDファンの数学サイド</span></a></li><li class="SubMenuLink MyFollowSideContainer-menuItem"><a class="SubMenuLink-link SubMenuLink-link_internal" href="/my/follow/tag/VOICEROIDボドゲ卓/tagrepo?ref=pc_mypage_follow_tag"><span class="SubMenuLink-label">VOICEROIDボドゲ卓</span></a></li><li class="SubMenuLink MyFollowSideContainer-menuItem"><a class="SubMenuLink-link SubMenuLink-link_internal" href="/my/follow/tag/クトゥルフ神話TRPG完結済みリンク/tagrepo?ref=pc_mypage_follow_tag"><span class="SubMenuLink-label">クトゥルフ神話TRPG完結済みリンク</span></a></li><li class="SubMenuLink MyFollowSideContainer-menuItem"><a class="SubMenuLink-link SubMenuLink-link_internal" href="/my/follow/tag/VOICEROIDキッチン/tagrepo?ref=pc_mypage_follow_tag"><span class="SubMenuLink-label">VOICEROIDキッチン</span></a></li><li class="SubMenuLink MyFollowSideContainer-menuItem"><a class="SubMenuLink-link SubMenuLink-link_internal" href="/my/follow/tag/歌うボイスロイド/tagrepo?ref=pc_mypage_follow_tag"><span class="SubMenuLink-label">歌うボイスロイド</span></a></li><li class="SubMenuLink MyFollowSideContainer-menuItem"><a class="SubMenuLink-link SubMenuLink-link_internal" href="/my/follow/tag/VOICEROID遊劇場/tagrepo?ref=pc_mypage_follow_tag"><span class="SubMenuLink-label">VOICEROID遊劇場</span></a></li><li class="SubMenuLink MyFollowSideContainer-menuItem"><a class="SubMenuLink-link SubMenuLink-link_internal" href="/my/follow/tag/ニコニコ技術部/tagrepo?ref=pc_mypage_follow_tag"><span class="SubMenuLink-label">ニコニコ技術部</span></a></li><li class="SubMenuLink MyFollowSideContainer-menuItem"><a class="SubMenuLink-link SubMenuLink-link_internal" href="/my/follow/tag/VOICEROID解説/tagrepo?ref=pc_mypage_follow_tag"><span class="SubMenuLink-label">VOICEROID解説</span></a></li><li class="SubMenuLink MyFollowSideContainer-menuItem"><a class="SubMenuLink-link SubMenuLink-link_internal" href="/my/follow/tag/VOICEROID劇場/tagrepo?ref=pc_mypage_follow_tag"><span class="SubMenuLink-label">VOICEROID劇場</span></a></li></ul>');
    },
    "500"
  );
    // Your code here...
})();