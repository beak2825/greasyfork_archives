// ==UserScript==
// @name         AcWing Markdown
// @namespace    http://www.cspoi.net/
// @version      0.1.2
// @description  AcWing 题目 Markdown 源码复制
// @author       Sky390
// @match        https://www.acwing.com/problem/content/*
// @exclude      https://www.acwing.com/problem/content/submission/*
// @exclude      https://www.acwing.com/problem/content/discussion/*
// @exclude      https://www.acwing.com/problem/content/video/*
// @exclude      https://www.acwing.com/problem/content/solution/*
// @icon         data:image/vnd.microsoft.icon;base64,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n+CgtWjSm6xZzsnPoOD/////29m36K2lVM6yo1POt6FSzrufUc7AnVDOxJtPzsmZTs7NmE2mQdNuvkXRbc6h5rPi9vz3/FPLas5XyWnOXMdozmDFZ85txm3Q8Pnv+PT69PrP6crs/v7+//X68/ru9en24+7b8uPt2PDt8uX27vPm9ubs2PDL1Kji9/jy+vb27/iurF/QraVUzrKjU863oVLOu59RzsCdUM7Em0/OyZlOzs2XTb5B027KRdFtzq7qvubq+e34U8tqzlfJac5cx2jOYMVnzmXDZc6h2Z7e/////9LqzOzw+O748vjv+Onz5PTl793y4+3Z8N/p0e7V4cDqxtOl4unt2/L/////zc+h4KmnVs6tpVTOsqNTzrehUs67n1HOwJ1QzsSbT87JmU7OzZdNzEHTbspF0W3Oruq+5ur57fhTy2rOV8lpzlzHaM5gxWfOZcNlzmrCZc7d8Nvy/P38/6DQkdrT6Mrs7PTn9uDs1/DL3rfmu9Gd3sLTo+Dl69fw//////X27viytnHUqadWzq2lVM6yo1POt6FSzrufUc7AnVDOxJtPzsmZTs7Nl03MQdNuvEXRbc6h5rPi9vz4/FPLas5XyWnOXMdozmDFZ85lw2XOasFkzonMgdb8/fz83u7Y8Hy6YM6IvGnQstGa3tXkxury9uz49fjw+vL16/j+/v7/0dau5Ofo0/C+vYDYraVUzrKjU863oVLOu59RzsCdUM7Em0/OyZlOzs2XTb5B0m6kRdFtzoTenNz/////atJ91FfJac5cx2jOYMVnzmXDZc5qwWTObsBjzsXkv+j/////qdGX3IC4X86Ftl7OibRdzo6yXM7C1KTi//////j58/r09ez4ycua4M7NnuC9tXTWsqNTzrehUs67n1HOwJ1QzsSbT87JmU7OzZhNpkLSbnxF0W3OWNN40v3+/f+b4KjgV8lpzlzHaM5gxWfOZcNlzmrBZM5uwGPOe8Js0PP58frv9uv4hLpk0IW2Xs6JtF3OkbRg0PD16vb2+PH6orJk0MDHkdzy8+j25uXO7rKqXtCyo1POt6FSzrufUc7AnVDOxJtPzsmZTs7MmE1+QtJuRkXRbc5Kz2zO1/Te8tby2/BXyWnOXMdozmDFZ85lw2XOasFkzm7AY85zvmLOrdeh3v/////B3LHkhbZezom0Xc7G2a3k/////8LP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
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/446013/AcWing%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/446013/AcWing%20Markdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var html = document.getElementById('acwing_page').innerHTML;
    html = html.substring(html.lastIndexOf("<div class=\"col-sm-9 col-xs-12\">"), html.lastIndexOf("<div class=\"col-sm-3 hidden-xs\" style=\"padding-left: 0;top: -20px;\">") - 1)
    var markdown_html = html.substring(html.indexOf("<p>"), html.indexOf("</div>") - 1)

    replace(/<p>/g,"\n");
    replace(/<\/p>/g,"");
    replace(/<ul>/g,"");
    replace(/<\/ul>/g,"");
    replace(/<pre class="hljs"><code>/g,"\n```\n");
    replace(/<\/code><\/pre>/g,"```");
    replace(/<code>/g,"`");
    replace(/<\/code>/g,"`");
    replace(/<h1>/g,"\n# "); replace(/<\/h1>/g,"");
    replace(/<h2>/g,"\n## "); replace(/<\/h2>/g,"");
    replace(/<h3>/g,"\n### "); replace(/<\/h3>/g,"");
    replace(/<h4>/g,"\n#### "); replace(/<\/h4>/g,"");
    replace(/<h5>/g,"\n##### "); replace(/<\/h5>/g,"");
    replace(/<h6>/g,"\n###### "); replace(/<\/h6>/g,"");
    replace(/<li>/g," - "); replace(/<\/li>/g,"");
    replace(/<br>/g,"\n");

    // console.log(markdown_html);

    var copy_button = document.createElement("button");
    var text_copy = document.createElement("textarea");

    copy_button.style = "font-size: 14px; float: right; border-radius: 20px; margin: 0 0 0 20px;";
    copy_button.addEventListener("click", copyText);
    copy_button.className = "btn btn-default";
    copy_button.textContent = "复制 Markdown";
    text_copy.textContent = markdown_html;
    text_copy.id = "copy-input";
    text_copy.style = "position: absolute; left: -2333px;";

    var header = document.getElementsByClassName("nice_font problem-content-title");
    header[0].appendChild(copy_button);
    header[0].appendChild(text_copy);

    function replace(before, after) {
        markdown_html = markdown_html.replace(before, after);
    }

    function copyText() {
        var input = document.getElementById("copy-input");
        input.select();
        document.execCommand("copy");
        alert("复制成功！");
    }
})();