// ==UserScript==
// @name         fix Matryoshka div for BH bbcode beta
// @description  fix Matryoshka div
// @namespace    baha_bbcode_div_fix
// @author       Covenant
// @version      0.9
// @license      MIT
// @homepage
// @match        https://home.gamer.com.tw/artwork.php?sn=*
// @match        https://webcache.googleusercontent.com/search?q=cache:https://home.gamer.com.tw/artwork.php*
// @match        https://web.archive.org/web/*/*home.gamer.com.tw/artwork.php?sn=*
// @match        https://guild.gamer.com.tw/about.php?gsn=*
// @icon         data:image/x-icon;base64,AAABAAIAICAAAAEACACoCAAAJgAAABAQAAABAAgAaAUAAM4IAAAoAAAAIAAAAEAAAAABAAgAAAAAAIAEAAAAAAAAAAAAAAABAAAAAAAA////APb29gDw8PAA4+PjAN3d3ADMzMwAxsbGALu7uwCysrIAqqqqAKOjowCZmZkAiIiIAHh4dgBvb28AZmZmAFhYWABSUlEASkpKAEFBQQAzMzMAJycoAAUFBQAAAAAAAgH+AFpNLABwaT8AkIAtAK6aLwCzokkAoJZjAMGzZQDPxpYA49y3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcMDBMMBxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIERAIFxcXBBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBERFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQDxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXEBIIFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBASFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIEBAXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEAkXFxcXFxcXFxcEFxcXFxcXFxcXFxcXFxcXFxcXFxAQDBcXFxcXFxcXFwwXFxcXFxcXFxcXFxcXFxcXFxcXCA4QCBcXFxcXFwkOFxcXFxcXFxcXFxcXFxcXFxcXFxcXCA8SEAwXFwwODBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBISEw4MDwgXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFw4QFxcXFxcXFxcXFxcXChEREQoXFxcJCQ4OEhIRERMXFw4QEQkXFxcXFxcXFxcXFxcKEREREREREwkXCQkJERAQCgoREBcXFxcXFxcXFxcXFxcXChcKFwoXFxcXFxcJChERERERDBcMCRcMEhcXFxcXFxcXFxcXFxcXFxcRFxcXCQoRERERDBMSEhEcFxcXFxcXFxcXFxcXFxcXFwoRCRcXAwoREREREBocFxcXFxcXFxcXFxcXCRECFxcXChMTEREREBERHBERCRcXFxcXFxcXFxcXFxcXChEJCQkREREREREREREcAgsPCRIXFxcXFxcXFxcXFxcXChERERERERERERERExwXFwwSCRIXFxcXFxcXFxcXFxcNERERERERERERERERHBcKEgoSFxcXFxcXFxcXFxcXChEREREREREREREREREUERcXFxcXFxcXFxcXFxcXCg0NERERERERERERERERDQ0cCBIXFxcXFxcXFwoKDRERERERERERERERERENDQ0cHBwdIRcXFwoTEhEQERESEhINDQ0NDQ0NDQ0NDQ0cHBwdFxcXFxcXFxcXFxcXFxchHBwcHBweHh4eHBwcHBwhFxcXFxcXFxcXFxcXFxchHBwcHBwcHBwcHBwcHCEXFxcXFxcXFxcXFx8fHhwcHBwcHBwcHBweHyEhFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxf////////wf///w7///4////8f////H////j////4////+P////h/3//8f9///D8///4Mf///AP///8//BwBh/+AIAf/6vwCT//3AA//8YA//HAAf/4AAB//AAMP/wACH/4AAf/4AAB/gAAAcAAAA//wAA//wAB/8AAH///////ygAAAAQAAAAIAAAAAEACAAAAAAAQAEAAAAAAAAAAAAAAAEAAAAAAAD///8A////APDw8ADj4+MA3d3cAMzMzADGxsYAu7u7ALKysgCqqqoAo6OjAJmZmQCIiIgAeHh2AG9vbwBmZmYAWFhYAFJSUQBKSkoAQUFBADMzMwAnJygABQUFAAAAAAACAf4AWk0sAHBpPwCQgC0ArpovALOiSQCglmMAwbNlAM/GlgDj3LcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXFxcXFxcGDAgIFxcXFxcXFxcXFxcEERcXFwgXFxcXFxcXFxcEEAUXFxcXFxcXFxcXFxcXCBAXFxcXFxcXFxcXFxcXFwgQFxcXFxcGFxcXFxcXFxcEEAwXFxcMFxcXFxcXFxcXFwgSDA8OBBcXFwwXFxcXFxcXCBAPFxcXBhcXCgwLDA0NDQoIEQ8IBQ0XFxcGFwkXFw0PDxEREwwXFxcXFxcXFwwKFw8RHBEJFxcXFxcXDAkXDxEREREXEgcSFxcXFxcMEREREREPFwgSFwYODRERERERDxwcHBwPFxcXFyEfHxwcHBwcICEXFxcXIRwcHBwcHCAhFxcXFxcXF/8P///+d////H////z////8+////Hf///4H//9/Hf//gAH//9YD///8g///8gj///gJ//8AA///wA///wB///8=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/476106/fix%20Matryoshka%20div%20for%20BH%20bbcode%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/476106/fix%20Matryoshka%20div%20for%20BH%20bbcode%20beta.meta.js
// ==/UserScript==
async function fn_clipboard_w(str){
    try{
        await navigator.clipboard.writeText(str);
    }catch(e){alert(e.message);}
    finally{}
}
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    return [obj_url,params];
}
function fn_htmlToBBCode(html){//soyuka/6183947
    html = html.replace(/<pre(.*?)>(.*?)<\/pre>/gmi, "[code]$2[/code]");
    html = html.replace(/<h[1-7](.*?)>(.*?)<\/h[1-7]>/, "\n[h]$2[/h]\n");
    //paragraph handling:
    //- if a paragraph opens on the same line as another one closes, insert an extra blank line
    //- opening tag becomes two line breaks
    //- closing tags are just removed
    // html += html.replace(/<\/p><p/<\/p>\n<p/gi;
    // html += html.replace(/<p[^>]*>/\n\n/gi;
    // html += html.replace(/<\/p>//gi;

	/*html = html.replace(/<br>/gi, "\n");//*/
	html = html.replace(/<textarea(.*?)>(.*?)<\/textarea>/gmi, "\[code]$2\[\/code]");
	html = html.replace(/<b>/gi, "[b]");
	html = html.replace(/<i>/gi, "[i]");
	html = html.replace(/<u>/gi, "[u]");
	html = html.replace(/<\/b>/gi, "[/b]");
	html = html.replace(/<\/i>/gi, "[/i]");
	html = html.replace(/<\/u>/gi, "[/u]");
	html = html.replace(/<em>/gi, "[b]");
	html = html.replace(/<\/em>/gi, "[/b]");
	html = html.replace(/<strong>/gi, "[b]");
	html = html.replace(/<\/strong>/gi, "[/b]");
	html = html.replace(/<cite>/gi, "[i]");
	html = html.replace(/<\/cite>/gi, "[/i]");
	html = html.replace(/<font color="(.*?)">(.*?)<\/font>/gmi, "[color=$1]$2[/color]");
	html = html.replace(/<font color=(.*?)>(.*?)<\/font>/gmi, "[color=$1]$2[/color]");
	html = html.replace(/<link(.*?)>/gi, "");
	html = html.replace(/<li(.*?)>(.*?)<\/li>/gi, "[*]$2");
	html = html.replace(/<ul(.*?)>/gi, "[list]");
	html = html.replace(/<\/ul>/gi, "[/list]");
	html = html.replace(/<div>/gi, "\n");
	html = html.replace(/<\/div>/gi, "\n");
	/*html = html.replace(/<td(.*?)>/gi, " ");
	html = html.replace(/<tr(.*?)>/gi, "\n");//*/

	/*html = html.replace(/<img(.*?)src="(.*?)"(.*?)>/gi, "[img]$2[/img]");//*/
	html = html.replace(/<a(.*?)href="(.*?)"(.*?)>(.*?)<\/a>/gi, "[url=$2]$4[/url]");

	html = html.replace(/<head>(.*?)<\/head>/gmi, "");
	html = html.replace(/<object>(.*?)<\/object>/gmi, "");
	html = html.replace(/<script(.*?)>(.*?)<\/script>/gmi, "");
	html = html.replace(/<style(.*?)>(.*?)<\/style>/gmi, "");
	html = html.replace(/<title>(.*?)<\/title>/gmi, "");
	html = html.replace(/<!--(.*?)-->/gmi, "\n");
    /*custom baha🚚*/
    html = html.replace(/<img(.*?)src="(.*?)"(.*?)width="(.*?)"(.*?)>/gi, "[img=$2 width=$4]");
    html = html.replace(/<img(.*?)src="(.*?)"(.*?)>/gi, "[img=$2]");
    html = html.replace(/<font face="(.*?)">(.*?)<\/font>/gi, "[font=$1]$2[/font]");
    html = html.replace(/<font face="(.*?)">\n<\/font>/gi, "[font=$1]\n[/font]");
    html = html.replace(/<font size="(.*?)">(.*?)<\/font>/gi, "[size=$1]$2[/size]");
    html = html.replace(/<strike>/gi, "[s]");
	html = html.replace(/<\/strike>/gi, "[/s]");
    html = html.replace(/<iframe(.*?)data-src="(.*?)"(.*?)>/gi, "[movie=$2]");
    html = html.replace(/<table(.*?)>/gi, "[table$1]");
    html = html.replace(/width="(.*?)"/gi, "width=$1");
    html = html.replace(/border="(.*?)"/gi, "border=$1");
    html = html.replace(/cellspacing="(.*?)"/gi, "cellspacing=$1");
    html = html.replace(/cellpadding="(.*?)"/gi, "cellpadding=$1");
    html = html.replace(/<\/table>/gi, "[/table]");
    html = html.replace(/<tbody>/gi, "[tbody]");
	html = html.replace(/<tr>/gi, "[tr]");
	html = html.replace(/<td>/gi, "[td]");
	html = html.replace(/<\/tbody>/gi, "[/tbody]");
	html = html.replace(/<\/tr>/gi, "[/tr]");
	html = html.replace(/<\/td>/gi, "[/td]");
    html = html.replace(/<hr>/gi, "[hr]");
    html = html.replace(/<br>/gi, "[br]");

	/*html = html.replace(/\/\//gi, "/");
	html = html.replace(/http:\//gi, "http://");
    html = html.replace(/https:\//gi, "https://");//*/

	html = html.replace(/<(?:[^>'"]*|(['"]).*?\1)*>/gmi, "");
	html = html.replace(/\r\r/gi, "");
	html = html.replace(/\[img]\//gi, "[img]");
	html = html.replace(/\[url=\//gi, "[url=");

	html = html.replace(/(\S)\n/gi, "$1 ");

    ////html = html.replace(/\[br]/gi, "\n");
	return html;
}
//console.log("break");
function copy(selectors){
    let article=document.querySelectorAll(selectors)[0].cloneNode(true);
    let script=article.querySelectorAll('script');
    for(let i = 0; i<script.length; i++){script[i].remove();}
    let iframe=article.querySelectorAll('iframe');
    for(let i = 0; i<iframe.length; i++){
        let url=fn_url(iframe[i].getAttribute("data-src"));
        iframe[i].setAttribute("data-src","https://"+url[0].host+url[0].pathname.replace(/embed\//gi, "watch?v="));
    }
    let innerHTML=article.innerHTML;
    let tmp=fn_htmlToBBCode(innerHTML);
    console.log("copy");
    return tmp;
}
function menu_01(selectors){
    let tmp=copy(selectors);
    let ary_str=tmp.split('\n');
    let str_bbcode="";
    for(let i = 0; i<ary_str.length; i++){
        if(ary_str[i]==""){
            str_bbcode+="[div]\n[/div]";
        }else{
            str_bbcode+="[div]"+ary_str[i]+"[/div]";
        }
    }
    GM_setClipboard(str_bbcode.replace(/\[br]/gi, "\n").replace(/] \[/gi, "]["), "text");
}
function menu_02(selectors){
    let tmp=copy(selectors);
    GM_setClipboard(tmp.replace(/\[br]/gi, "\n"), "text");
}
(function() {
    'use strict';
    let url=fn_url(document.location);
    if(url[0].host.search(new RegExp("web.archive.org", "i"))==0){
        if(url[0].pathname.search(/\/web\/\d+\*\//i)==0)return;
    }
    /*if(url[0].host.search(new RegExp("guild.gamer.com.tw", "i"))==0&&url[0].pathname.search(/\/about/i)==0){//guild
        GM_registerMenuCommand("sidebar_section_about-box", () => {
            menu_01('div.sidebar_section_about-box');
        });
        GM_registerMenuCommand("sidebar_section_announcement", () => {
            menu_02('div.sidebar_section_announcement');
        });
    }else{//artwork*/
        GM_registerMenuCommand("copy", () => {
            menu_01('div#article_content');
        });
        GM_registerMenuCommand("copy without [div]", () => {
            menu_02('div#article_content');
        });
    //}
})();