// ==UserScript==
// @name         恢复贴吧删贴功能
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  恢复贴吧删贴功能，可以自由选择删贴或屏蔽（只要你有删贴权限）
// @author       scientificworld
// @include      /^https?://tieba\.baidu\.com/((f\?kz=.*)|(p/.*))/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444681/%E6%81%A2%E5%A4%8D%E8%B4%B4%E5%90%A7%E5%88%A0%E8%B4%B4%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/444681/%E6%81%A2%E5%A4%8D%E8%B4%B4%E5%90%A7%E5%88%A0%E8%B4%B4%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

/*
是吧务 是楼主 开放删贴 未被屏蔽 => 无屏蔽按钮 有删贴按钮 添加屏蔽
是吧务 是楼主 开放删贴 已被屏蔽 => 无屏蔽按钮 有删贴按钮 不添加
是吧务 是楼主 限制删贴 未被屏蔽 => 有屏蔽按钮 有删贴按钮 不添加
是吧务 是楼主 限制删贴 已被屏蔽 => 无屏蔽按钮 有删贴按钮 不添加
是吧务 非楼主 开放删贴 未被屏蔽 => 无屏蔽按钮 有删贴按钮 添加屏蔽
是吧务 非楼主 开放删贴 已被屏蔽 => 无屏蔽按钮 有删贴按钮 不添加
是吧务 非楼主 限制删贴 未被屏蔽 => 有屏蔽按钮 无删贴按钮 添加删贴
是吧务 非楼主 限制删贴 已被屏蔽 => 无屏蔽按钮 无删贴按钮 添加删贴
非吧务 是楼主 => 无屏蔽按钮 有删贴按钮 不添加
非吧务 非楼主 => 无屏蔽按钮 无删贴按钮 不添加
*/

(function() {
    'use strict';
    if (! PageData.is_thread_admin) return;
    var a = document.getElementsByClassName('j_thread_delete').length > 0,
        b = document.getElementsByClassName('j_thread_shield').length > 0,
        c = PageData.power.lz_del,
        d = document.getElementsByClassName('shield-tip').length > 0,
        x = document.createElement('a');
    if (!a) {
        x.classList.add('j_thread_delete');
        x.appendChild(document.createTextNode('删除主题'));
    } else if (!b && !d) {
        x.classList.add('j_thread_shield');
        x.appendChild(document.createTextNode('屏蔽主题'));
    } else return;
    x.rel = 'noopener';
    x.href = '#';
    var y = document.createElement('div'), z = document.getElementsByClassName('l_thread_manage')[0];
    y.classList.add('d_del_thread');
    y.appendChild(x);
    if (a) z.insertBefore(y, z.firstChild.nextSibling.nextSibling);
    else z.insertBefore(y, z.firstChild);
 })();