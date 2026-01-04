// ==UserScript==
// @name        SubHD资源跳转
// @namespace   superszy
// @author      superszy
// @description 适用于https://subhd.tv/
// @match       https://subhd.tv/d/*
// @run-at document-end
// @version     1.0.1
// @downloadURL https://update.greasyfork.org/scripts/429362/SubHD%E8%B5%84%E6%BA%90%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/429362/SubHD%E8%B5%84%E6%BA%90%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

{
    const url = location.href;
    var nUrl = url.replace('hd.tv','dh.com')

    var btn = "<a class=\"btn btn-outline-info btn-sm f12 me-1\" href='" + nUrl + "' role=\"button\" target=\"_blank\"> ";
    btn += " <svg class=\"me-1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"13\" height=\"13\" fill=\"currentColor\" class=\"bi bi-camera-reels\" viewBox=\"0 0 16 16\"> ";
    btn += " <path d=\"M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM1 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0z\"/> ";
    btn += " <path d=\"M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h7zm6 8.73V7.27l-3.5 1.555v4.35l3.5 1.556zM1 8v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1z\"/> ";
    btn += " <path d=\"M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM7 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0z\"/> ";
    btn += " </svg> ";
    btn += " 搜索资源</a>";

    document
        .querySelector('.btn.btn-outline-light.btn-sm.f12.me-1')
        .insertAdjacentHTML('beforeBegin', btn);
}