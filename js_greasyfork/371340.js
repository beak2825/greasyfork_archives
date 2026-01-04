// ==UserScript==
// @name         SinaWeiboFansRemover
// @namespace    https://github.com/GeeLaw/SinaWeiboFansRemover
// @version      1.1
// @description  To remove sina weibo fans
// @author       GeeLaw
// @match        *://weibo.com/*fans*
// @match        *://www.weibo.com/*fans*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371340/SinaWeiboFansRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/371340/SinaWeiboFansRemover.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var UniqueIdPrefix = '_cdaa3d6fd4964efab6442ac893444099_';
    var FollowerItemClass = '_item_cdaa3d6fd4964efab6442ac893444099';
    var FollowerRemoveLinkClass = '_removelink_cdaa3d6fd4964efab6442ac893444099';
    var FollowerHideLinkClass = '_hidelink_cdaa3d6fd4964efab6442ac893444099';
    var FollowerRemoveAllClass = '_removeall_cdaa3d6fd4964efab6442ac893444099';
    var uniqueIdIndex = 0;
    var decorator = function () {
        if (!document.location.pathname.endsWith('/fans'))
            return;
        Array.prototype.forEach.call(
            document.querySelectorAll('ul.follow_list>li.follow_item>dl>dt.mod_pic:not(.' + FollowerItemClass + ')'),
            function (follower) {
                var uniqueId = follower.id;
                if (!uniqueId) {
                    uniqueId = UniqueIdPrefix + (uniqueIdIndex++).toString();
                    follower.id = uniqueId;
                }
                follower.classList.add(FollowerItemClass);
                var hostElem = document.createElement('div');
                hostElem.style.textAlign = 'center';
                hostElem.style.fontSize = '2em';
                (function (aElem) {
                    aElem.className = FollowerRemoveLinkClass;
                    aElem.href = 'javascript:void(0);';
                    aElem.onclick = function () {
                        document.querySelector('#' + uniqueId + ' ~ dd.opt_box a[action-type=removeFan]').click();
                        window.setTimeout(function () {
                            document.querySelector('div.content.layer_mini_opt>p.btn>a.W_btn_a').click();
                        }, 500);
                    };
                    aElem.style.display = 'inline-block';
                    aElem.style.marginRight = '8px';
                    aElem.innerHTML = '&#215;';
                    hostElem.appendChild(aElem);
                })(document.createElement('A'));
                (function (aElem) {
                    aElem.className = FollowerHideLinkClass;
                    aElem.href = 'javascript:void(0);';
                    aElem.onclick = function () {
                        var elem = follower;
                        while (elem.tagName != 'LI')
                            elem = elem.parentElement;
                        elem.remove();
                    };
                    aElem.style.display = 'inline-block';
                    aElem.style.marginLeft = '8px';
                    aElem.innerHTML = '&#247;';
                    hostElem.appendChild(aElem);
                })(document.createElement('A'));
                follower.appendChild(hostElem);
            }
        );
        if (!document.querySelector('.PCD_connectlist div.' + FollowerRemoveAllClass)) {
            var followBox = document.querySelector('.PCD_connectlist .follow_box');
            if (followBox != null) {
                var divElem = document.createElement('DIV');
                divElem.className = FollowerRemoveAllClass;
                var aElem = document.createElement('A');
                aElem.href = 'javascript:void(0);';
                aElem.onclick = function () {
                    if (!window.confirm('Are you sure that you want to remove ALL followers ON THIS PAGE?\n\nAfter all the followers on this page are removed, the page will automatically reload.'))
                        return;
                    aElem.onclick = null;
                    aElem.removeAttribute('href');
                    aElem.style.color = '#bbb';
                    aElem.innerText = 'Removing...';
                    var recurser = function () {
                        var clickTarget = document.querySelector('a.' + FollowerRemoveLinkClass);
                        if (clickTarget == null) {
                            document.location.reload();
                            return;
                        }
                        clickTarget.click();
                        window.setTimeout(recurser, 1000);
                    };
                    recurser();
                };
                aElem.style.display = 'block';
                aElem.style.fontSize = '2em';
                aElem.style.padding = '20px 16px 8px 16px';
                aElem.style.textAlign = 'center';
                aElem.innerText = 'Remove ALL followers ON THIS PAGE';
                divElem.appendChild(aElem);
                followBox.parentNode.insertBefore(divElem, followBox);
            }
        }
        window.setTimeout(decorator, 1000);
    };
    window.setTimeout(decorator, 500);
})();