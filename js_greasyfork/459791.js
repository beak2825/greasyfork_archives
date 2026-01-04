// ==UserScript==
// @name         chatGPT 删除upgrade按钮
// @namespace    https://github.com/Huoyuuu
// @version      1.1
// @description  延时3秒自动删除upgrade按钮（这脚本确实没太大用，直接把代码拷贝到已有的脚本里面就成）
// @author       Huoyuuu
// @match        https://chat.openai.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      The MIT License
// @downloadURL https://update.greasyfork.org/scripts/459791/chatGPT%20%E5%88%A0%E9%99%A4upgrade%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/459791/chatGPT%20%E5%88%A0%E9%99%A4upgrade%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function ()
{
    setTimeout(function ()
    {
        var t = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative > div.dark.hidden.bg-gray-900.md\\:fixed.md\\:inset-y-0.md\\:flex.md\\:w-\\[260px\\].md\\:flex-col > div > div > nav > a.flex.py-3.px-3.items-center.gap-3.rounded-md.hover\\:bg-gray-500\\/10.transition-colors.duration-200.text-white.cursor-pointer.text-sm.\\!bg-yellow-400.\\!text-gray-900.font-medium.border-b-2.shim-yellow.\\!border-yellow-600.hover\\:\\!bg-yellow-400\\/90");
        t.remove();
    }, 3000);
})();