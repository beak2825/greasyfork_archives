// ==UserScript==
// @name         显示nga头像
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  在正常模式和lite模式下无视内容长度显示用户头像
// @author       wfel
// @match        *://bbs.ngacn.cc/*
// @match        *://bbs.nga.cn/*
// @match        *://nga.178.com/*
// @match        *://ngabbs.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/377289/%E6%98%BE%E7%A4%BAnga%E5%A4%B4%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/377289/%E6%98%BE%E7%A4%BAnga%E5%A4%B4%E5%83%8F.meta.js
// ==/UserScript==

(function() {
    // from js_commonui.js line 3075
    console.log('Show Avatar: running!');
    window.commonui = Object.defineProperties(window.commonui?window.commonui:{}, {
        'avatarUrl': {
            value: function(y, uid) {
                if (y.charAt(0) == '.' && (i = y.match(/^\.a\/(\d+)_(\d+)\.(jpg|png|gif)\?(\d+)/)))
                    y = __AVATAR_BASE_VIEW + '/' + ('000000000' + (i[1] | 0).toString(16)).replace(/.+?([0-9a-z]{3})([0-9a-z]{3})([0-9a-z]{3})$/, '$3/$2/$1') + '/' + i[1] + '_' + i[2] + '.' + i[3] + '?' + i[4]
                else if (y.charAt(0) == 'h' && y.match(/^https?:\/\/([^\/]+)\//)) {
                    //if (!y.match(_ALL_IMG_HOST_REG) && uid != window.__CURRENT_UID)
                    //    y = ''
                    //some of the old attach servers can not be detected
                } else if (y)
                    y = __IMGPATH + '/face/' + y
                else
                    y = ''
                if (this.correctAttachUrl)
                    y = this.correctAttachUrl(y)
                return y
            },
            writable: false
        },
        // feature是cLength的计算方法导致的
        // js_read.js Line 379: a.cLength = this.postDispCalcContentLength(a.contentC);
        'postDispCalcContentLength': {
            value: function() {
                return 21;
            },
            writable: false
        }
    });
})();