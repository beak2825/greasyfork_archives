// ==UserScript==
// @name         HTML2BBCode
// @namespace    https://orbitalzero.ovh/scripts
// @version      0.02
// @description  html2bb *tries* to convert html code to bbcode as accurately as possible
// @author       NeutronNoir
// 
// ==/UserScript==

function html2bb(str) {
    if(typeof str === "undefined") return "";
    str = str.replace(/< *br *\/*>/g, "\n");
    str = str.replace(/< *u *>/g, "[u]");
    str = str.replace(/< *\/ *u *>/g, "[/u]");
    str = str.replace(/< *\/ *li *>/g, "");
    str = str.replace(/< *li *>/g, "[*]");
    str = str.replace(/< *\/ *ul *>/g, "");
    str = str.replace(/< *ul *class=\\*\"bb_ul\\*\" *>/g, "");
    str = str.replace(/< *h2 *class=\"bb_tag\" *>/g, "[u]");
    str = str.replace(/< *\/ *h2 *>/g, "[/u]");
    str = str.replace(/< *strong *>/g, "[b]");
    str = str.replace(/< *\/ *strong *>/g, "[/b]");
    str = str.replace(/< *i *>/g, "[i]");
    str = str.replace(/< *\/ *i *>/g, "[/i]");
    str = str.replace(/\&quot;/g, "\"");
    str = str.replace(/< *img *src="([^"]*)" *>/g, "[img]$1[/img]");
    str = str.replace(/< *b *>/g, "[b]");
    str = str.replace(/< *\/ *b *>/g, "[/b]");
    str = str.replace(/< *a [^>]*>/g, "");
    str = str.replace(/< *\/ *a *>/g, "");
    //Yeah, all these damn stars. Because people put spaces where they shouldn't.
    return str;
}
