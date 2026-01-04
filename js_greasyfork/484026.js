// ==UserScript==
// @name         Copy SteamDB Changelog as BBcode
// @namespace    none
// @version      5
// @description  Adds a button to copy changelog
// @author       ingts
// @match        https://steamdb.info/patchnotes/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/484026/Copy%20SteamDB%20Changelog%20as%20BBcode.user.js
// @updateURL https://update.greasyfork.org/scripts/484026/Copy%20SteamDB%20Changelog%20as%20BBcode.meta.js
// ==/UserScript==

function html2bb(str) {
    if (!str) return ""
    str = str.replace(/<p><\/p>/g, '\n')
    str = str.replace(/<p>(.*)<\/p>/g, '$1\n')
    str = str.replace(/<ul>/g, '')
    str = str.replace(/<\/ul>/g, '')
    str = str.replace(/<li>/g, "[*]")
    str = str.replace(/<li>\n/g, "[*]")
    str = str.replace(/<li>\n<p>(.*)<\/p>\n<ul>/g, '$1') // dont bullet first parent of nested list
    str = str.replace(/<li>\n<p><strong>(.*)<\/strong>\s*<\/p>\s*<\/li>/g, '[*][b]$1[/b]')
    str = str.replace(/< *br *\/*>/g, "\n\n") //*/
    str = str.replace(/<hr\n?>/g, "\n") //*/
    str = str.replace(/< *b *>/g, "[b]")
    str = str.replace(/< *\/ *b *>/g, "[/b]")
    str = str.replace(/< *u *>/g, "[u]")
    str = str.replace(/< *\/ *u *>/g, "[/u]")
    str = str.replace(/< *i *>/g, "[i]")
    str = str.replace(/< *\/ *i *>/g, "[/i]")
    str = str.replace(/< *strong *>/g, "[b]")
    str = str.replace(/< *\/ *strong *>/g, "[/b]")
    str = str.replace(/< *em *>/g, "[i]")
    str = str.replace(/< *\/ *em *>/g, "[/i]")
    str = str.replace(/< *\/ *li *>/g, "")
    str = str.replace(/< *ul *class=\\*\"bb_ul\\*\" *>/g, "")
    str = str.replace(/< *\/ *ul *>/g, "")
    str = str.replace(/< *h2 *class=\"bb_tag\" *>/g, "\n[align=center][u][b]")
    str = str.replace(/< *h[12] *>/g, "\n[align=center][u][b]")
    str = str.replace(/< *\/ *h[12] *>/g, "[/b][/u][/align]\n")
    str = str.replace(/&quot;/g, "\"")
    str = str.replace(/&amp;/g, "&")
    str = str.replace(/< *img *src="([^"]*)".*>/g, "\n")
    str = str.replace(/< *a [^>]*>/g, "")
    str = str.replace(/< *\/ *a *>/g, "")
    str = str.replace(/< *p *>/g, "")
    str = str.replace(/< *\/ *p *>/g, "")
    str = str.replace(//g, "\"")
    str = str.replace(//g, "\"")
    str = str.replace(/  +/g, " ")
    str = str.replace(/\n +/g, "\n")
    str = str.replace(/\n\n\n+/gm, "\n\n")
    str = str.replace(/\[\/b]\[\/u]\[\/align]\n\n/g, "[/b][/u][/align]\n")
    str = str.replace(/\n\n\[\*]/g, "\n[*]")
    str = str.replace(/<ul>\n/g, '')
    str = str.replace(/<h\d.*>(.*?)<\/h\d>/g, '[b]$1[/b]')
    // str = str.replace(/\[*]\n/g, '[*]')
    str = str.replace(/<lite-youtube.*>.*<\/lite-youtube>\n?/gs, '')
    str = str.replace(/https:\/\/store.steampowered.com.*\n?\n?/g, '')
    return str
}

const button = document.createElement('button')
button.textContent = 'Copy changelog as BBcode'
document.querySelector('.patchnotes-metadata').querySelector('.hint-with-octicon:nth-of-type(3)').after(button)
button.addEventListener('click', () => {
    const patchnotes = document.querySelector('.patchnotes-official')
    GM_setClipboard('[hide=Changelog]' + html2bb(patchnotes.innerHTML) + '[/hide]')
    button.textContent = 'Copied'
})
