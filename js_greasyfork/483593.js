// ==UserScript==
// @name               clipboard-shims
// @description        Shims for GM_setClipboard and GM.setClipboard.
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.0
// @license            MIT
// ==/UserScript==

let GM_setClipboard = function GM_setClipboard(data, type = "text/plain")
{
    if (navigator.clipboard?.write)
    {
        navigator.clipboard.write([new ClipboardItem({ [type]: data })]);
    }
    else
    {
        document.addEventListener("copy", (event) =>
        {
            event.preventDefault();
            event.stopImmediatePropagation();

            event.clipboardData.setData(type, data);
        }, { capture: true, once: true });

        document.execCommand("copy");
    }
}

GM.setClipboard = GM_setClipboard;
