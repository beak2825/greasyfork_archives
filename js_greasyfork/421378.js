// ==UserScript==
// @name         文献翻译格式化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动移除从PDF等复制的文本中包含的换行符，不需要的连接符，测试了谷歌翻译，有道翻译。一般只用这两个。
// @author       zhengyangqi
// @match        https://translate.google.com/*
// @match        https://translate.google.cn/*
// @match        http://fanyi.youdao.com/
// @icon         https://translate.google.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/421378/%E6%96%87%E7%8C%AE%E7%BF%BB%E8%AF%91%E6%A0%BC%E5%BC%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/421378/%E6%96%87%E7%8C%AE%E7%BF%BB%E8%AF%91%E6%A0%BC%E5%BC%8F%E5%8C%96.meta.js
// ==/UserScript==

javascript: document.getElementsByTagName('textarea')[0].addEventListener('input',
    function ()
    {
        var txt = "";
        txt = document.getElementsByTagName('textarea')[0].value;

        //第一步：连字符与换行连用表示单词拼接
        txt = txt.replace(/-\n/g,"");
        txt = txt.replace(/- /g,""); //有的连字符后面有空格

        //第二步：换行符替换为空格
        txt = txt.replace(/(?<![\.?!;:\n])\n/g," "); //(?<![\.?!;:\n])这个用法不明白，我在\n后面添加无效
        txt = txt.replace(/([\.?!;:])\n([0-9a-zA-z])/g,"$1 $2"); //以句号、问号、感叹号、分号、冒号结尾，但是后一个字符为0-9a-zA-z，也替换为空格。使用分组

        //第三步：去除段开头空格
        txt = txt.replace(/(\n) +/g,"$1");

        //第四步：换行符替换为双回车
        txt = txt.replace(/(?<=[\.?!;:])\n+/g,"\n\n");

        document.getElementsByTagName('textarea')[0].value = txt;
    }
);
