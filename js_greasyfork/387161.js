// ==UserScript==
// @name         Facebook inviter
// @namespace    https://www.facebook.com
// @version      0.2
// @description  invite people who like you
// @author       Wuyingqiang
// @match        *://*.facebook.com/EnjoyPaintbyNumbers*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387161/Facebook%20inviter.user.js
// @updateURL https://update.greasyfork.org/scripts/387161/Facebook%20inviter.meta.js
// ==/UserScript==
function invite_filter(ele, index, array) {
    return ele.getElementsByClassName('_6a _6b')[3].getElementsByTagName('button').length == 0;
}

function expanding_members() {
    setTimeout(() => {
        on_prepare();

        var expanding_bnt = document.getElementById('reaction_profile_pager');
        if (expanding_bnt == null) { console.log('no expanding btn'); setIsReady(); return;}

        var expanding = expanding_bnt.getElementsByTagName('a');

        if (document.getElementById('reaction_profile_pager').childNodes.length == 0) {
            // no expanding btn
            console.log('no expanding btn');
            setIsReady();
            return ;
        }

        if (expanding.length > 0) {
            if (expanding_bnt.className === "clearfix mtm uiMorePager stat_elem _52jv async_saving") {
                console.log('wait expanded');
            } else {
                // set red
                expanding[0].click();
                console.log('expanding');
                console.log(expanding_bnt);
            }
        }

        expanding_members();
    }, 2000);
}

function setIsReady(){
    console.log('ready');
    document.getElementsByClassName('_2iem _50f7')[0].setAttribute('style', 'color:green;');
    document.getElementsByClassName('_2iem _50f7')[0].textContent = '变绿啦，点这里邀请所有用户';
}
function on_prepare(){
    document.getElementsByClassName('_2iem _50f7')[0].setAttribute('style', 'color:red;');
    document.getElementsByClassName('_2iem _50f7')[0].textContent = '正在扩展所有用户,变绿之后点这里';
}

(function() {
    'use strict';

    document.addEventListener ("click", function (zEvent) {
        if (zEvent.srcElement.className === "_81hb") {
            console.log('expand people who like you');
            expanding_members();
        }

        if (zEvent.srcElement.className === "_2iem _50f7") {
            if (document.getElementsByClassName('_2iem _50f7')[0].textContent !== "变绿啦，点这里邀请所有用户") {
                alert('等一下，还没绿呢');
                return ;
            }

            var dialog = document.getElementsByClassName('_5i_q');
            if (dialog.length > 0) {

                // here, we can get the page of likes
                console.log(dialog);
                dialog = Array.from(dialog);
                var need_invite = dialog.filter(invite_filter).map((e) => {return e.getElementsByTagName('span')[1];});

                for (var d in need_invite) {
                    need_invite[d].getElementsByTagName('a')[0].click();
                    console.log(need_invite[d].getElementsByTagName('a')[0]);
                }

                 alert("发起邀请:" + need_invite.length);
            }
        }
    });
})();