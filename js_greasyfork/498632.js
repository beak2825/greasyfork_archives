// ==UserScript==
// @name        Textarea to P on characterhub.org
// @namespace   https://greasyfork.org/users/1202784-az689
// @match       https://*characterhub.org/*
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @version     0.1.3
// @author      az689
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @description Convert Textarea elements on characterhub.org into P elements, so that the translator can translate their content. (I use TWP)
// @description:zh-CN  将characterhub.org上的Textarea元素转换成P元素, 使得翻译器能翻译其内容(我用的是TWP)
// @description:fr  Convertir les éléments Textarea sur characterhub.org en éléments P, afin que les traducteurs puissent traduire leur contenu (j'utilise TWP)
// @description:es  Convertir los elementos Textarea en characterhub.org a elementos P, para que los traductores puedan traducir su contenido (uso TWP)
// @description:de  Konvertiere die Textarea-Elemente auf characterhub.org in P-Elemente, damit Übersetzer deren Inhalt übersetzen können (ich benutze TWP)
// @description:pt  Converta os elementos Textarea em characterhub.org para elementos P, para que os tradutores possam traduzir seu conteúdo (eu uso TWP)
// @description:ru  Преобразовать элементы Textarea на characterhub.org в элементы P, чтобы переводчики могли переводить их содержимое (я использую TWP)
// @description:zh-TW  將characterhub.org上的Textarea元素轉換成P元素, 使得翻譯器能翻譯其內容(我用的是TWP)
// @description:ja  characterhub.orgでTextarea要素をP要素に変換し、翻訳ツール(私はTWPを使用)でその内容を翻訳できるようにします。
// @downloadURL https://update.greasyfork.org/scripts/498632/Textarea%20to%20P%20on%20characterhuborg.user.js
// @updateURL https://update.greasyfork.org/scripts/498632/Textarea%20to%20P%20on%20characterhuborg.meta.js
// ==/UserScript==

let dict = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "\n": "<br>",
    "\r": "",
    "\t": "&nbsp;&nbsp;&nbsp;&nbsp;",
    " ": "&nbsp;",
};
let regex = new RegExp(
    Object.keys(dict)
    .map(key => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))//转义dict键中的正则表达式特殊字符
    .join("|"), "gi");//并联所有键构建正则表达式
let t2p = function() {
    //遍历所有textarea
    Array.from(document.getElementsByTagName("textarea")).forEach(
        function (aTag) {
            let pTag = document.createElement("p");
            pTag.className = aTag.className + " pformtextarea";
            pTag.innerHTML = aTag.value.replace(regex, (char => dict[char] || char));
            //使用dict对textarea内的html进行转义
            aTag.parentNode.replaceChild(pTag, aTag);
        }
    );
};

GM_registerMenuCommand('Textarea to P', t2p);

let css = `#t2p_button {
    display: block;
    border: 2px solid;
    margin-inline: 25px;
    font-size: 1.3rem;
    line-height: 1.57143;
}

#t2p_button > div {
    background-color: var(--lighter-almost-black);
    padding: 2px;
    text-align: center;
}

#t2p_button > div:active {
    filter: invert(100%);
}

.pformtextarea {
    padding-inline: 12px;
    background-color: var(--almost-black-color);
}
`;
GM_addStyle(css);

let add_t2p_button = function() {
    let cc = document.getElementsByClassName("!visible text-sm")?.[0];
    if (cc && !cc?.querySelector("#t2p_button")) {//容器存在且未添加按钮
        cc.insertAdjacentHTML("afterbegin", "<div id='t2p_button'><div>Textarea to P</div></div>");
        document.getElementById("t2p_button").addEventListener("click", t2p);
    };
};
if (/\/characters\/|\/lorebooks\//.test(location.href)) {
    (new MutationObserver(add_t2p_button))
        .observe(document.body, { childList: true, subtree: true });
};
