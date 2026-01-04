// ==UserScript==
// @name                Toolbox
// @version             0.41
// @description         -
// @author              LianSheng
// ==/UserScript==


// 【通用】添加 Script
// 預設添加於 body 尾端.
// 若指定的 target 有複數匹配，則只作用於第一個配對到的.
function addScript(appendScript, target="body", id="") {
    let s = document.createElement('script');
    s.type = "text/javascript";
    s.innerHTML = appendScript;
    s.id = id;
    try{
        document.querySelectorAll(target)[0].appendChild(s);
    } catch (e) {
        console.log(`%c【錯誤】%c在 %c"${target}" %c嘗試新增 %cScript %c失敗：\n"${e}"`, "font-size: 16px; color: red", "color: auto", "color: blue", "color: auto", "color: brown", "color: auto");
    }
}

// 【通用】添加 Style
// 預設添加於 body 尾端.
// 若指定的 target 有複數匹配，則只作用於第一個配對到的.
function addStyle(appendStyle, target="body", id="") {
    let css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = appendStyle;
    css.id = id;
    try{
        document.querySelectorAll(target)[0].appendChild(css);
    } catch (e) {
        console.log(`%c【錯誤】%c在 %c"${target}" %c嘗試新增 %cStyle %c失敗：\n"${e}"`, "font-size: 16px; color: red", "color: auto", "color: blue", "color: auto", "color: brown", "color: auto");
    }
}

// 【通用】添加 Style Link
function addStyleLink(href, id="", rel="stylesheet", type="text/css") {
    let link = document.createElement("link");
    link.type = type;
    link.rel = rel;
    link.href = href;
    link.id = id;
    try{
        document.head.appendChild(link);
    } catch (e) {
        console.log(`%c【錯誤】%c在 %c<head> %c嘗試新增 %cStyle Link %c失敗：\n"${e}"`, "font-size: 16px; color: red", "color: auto", "color: blue", "color: auto", "color: brown", "color: auto");
    }
}

// 【通用】添加 Style，每個屬性皆爲 !important
// 預設添加於 html 尾端. (可用於 @run-at document-start)
// 若指定的 target 有複數匹配，則只作用於第一個配對到的.
function addStyleImportant(appendStyle, target="html", id="") {
    let css = document.createElement("style");
    let importantStyle = appendStyle.replace(/([a-zA-Z\-]+:[\ ]*.+);/g, "$1 !important;")
    css.type = "text/css";
    css.innerHTML = importantStyle;
    css.id = id;
    css.setAttribute("info", "user custom style");
    try{
        document.querySelectorAll(target)[0].appendChild(css);
    } catch (e) {
        console.log(`%c【錯誤】%c在 %c"${target}" %c嘗試新增 %cStyle %c失敗：\n"${e}"`, "font-size: 16px; color: red", "color: auto", "color: blue", "color: auto", "color: brown", "color: auto");
    }
}

// 【通用】添加 HTML
// 預設添加於 body 尾端.
// 若指定的 target 有複數匹配，則只作用於第一個配對到的.
// type 可選 'beforebegin', 'afterbegin', 'beforeend', 'afterend'.
function addHTML(html, target="body", type="beforeend") {
    try{
        document.querySelectorAll(target)[0].insertAdjacentHTML(type, html);
    } catch (e) {
        console.log(`%c【錯誤】%c在 %c"${target}" %c嘗試新增 %cHTML %c失敗：\n"${e}"`, "font-size: 16px; color: red", "color: auto", "color: blue", "color: auto", "color: brown", "color: auto");
    }
}