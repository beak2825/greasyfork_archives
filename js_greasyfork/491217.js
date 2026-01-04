// ==UserScript==
// @name         Latexlive公式编辑器输出增强：转 Markdown 格式，适用于 Logseq 等
// @namespace    http://tampermonkey.net/
// @version      2.4.2
// @description  为中文文本中的公式添加 $$ 符号，以适应 Markdown 或 Latex 格式的需求。并修复常见的图片识别结果中的错误
// @author       Another_Ghost
// @match        https://*.latexlive.com/*
// @icon         https://img.icons8.com/?size=50&id=1759&format=png
// @grant         GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491217/Latexlive%E5%85%AC%E5%BC%8F%E7%BC%96%E8%BE%91%E5%99%A8%E8%BE%93%E5%87%BA%E5%A2%9E%E5%BC%BA%EF%BC%9A%E8%BD%AC%20Markdown%20%E6%A0%BC%E5%BC%8F%EF%BC%8C%E9%80%82%E7%94%A8%E4%BA%8E%20Logseq%20%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/491217/Latexlive%E5%85%AC%E5%BC%8F%E7%BC%96%E8%BE%91%E5%99%A8%E8%BE%93%E5%87%BA%E5%A2%9E%E5%BC%BA%EF%BC%9A%E8%BD%AC%20Markdown%20%E6%A0%BC%E5%BC%8F%EF%BC%8C%E9%80%82%E7%94%A8%E4%BA%8E%20Logseq%20%E7%AD%89.meta.js
// ==/UserScript==

//export function correctText(){};

(function () { // 使用匿名函数封装代码，避免变量污染全局环境
    createButton('复制', copyOriginalText, '');
    createButton('转换后复制', convertFormulasToLaTeX, /\\boldsymbol/g);

    /**
     * 创建按钮并添加到指定容器中
     * @param {number} buttonName - 按钮的名字
     * @param {function} convert - 转换函数
     * @param {string} wordsToRemove - 需要移除的字符串
     */
    function createButton(buttonName, convert, wordsToRemove) {
        // 创建一个新按钮
        let button = document.createElement('button');
        button.innerHTML = `${buttonName}`;
        button.className = 'btn btn-light btn-outline-dark';
        //button.id = `copy-btn${buttonId}`;
        // add click handler
        button.onclick = function () {
            //选中输入文本框的所有文本
            var selected = document.querySelector('#txta_input'); 
            //先通过 convert 函数转换文本，再复制
            navigator.clipboard.writeText(convert(selected.value, wordsToRemove));
            displayAlertBox('已复制');
        };
        //输入框上方的容器
        var CONTAINER = "#wrap_immediate > row > div.col-5.col-sm-5.col-md-5.col-lg-5.col-xl-5";
        //等待容器出现并添加按钮
        var interval = setInterval(function () {
            var wrap = document.querySelector(CONTAINER);
            if (wrap) {
                wrap.appendChild(button);
                clearInterval(interval);
            }
        }, 200);
    }

    function displayAlertBox(text) {
        var alertBox = document.createElement('div');
        alertBox.innerHTML = text;
        //alertBox.style.display = none;
        alertBox.style.position = 'fixed';
        alertBox.style.bottom = `20px`;
        alertBox.style.left = `50%`;
        alertBox.style.transform = `translateX(-50%)`;
        alertBox.style.backgroundColor = `#4CAF50`;
        alertBox.style.color = `white`;
        alertBox.style.padding = `12px`;
        alertBox.style.borderRadius = `5px`;
        alertBox.style.zIndex = `1000`;
        alertBox.style.boxShadow = `0px 0px 10px rgba(0,0,0,0.5)`;
        alertBox.style.opacity = '0';
        alertBox.style.transition = 'opacity 0.3s';
        document.body.appendChild(alertBox);
        setTimeout(function () {
            alertBox.style.opacity = '1';
        }, 100);
        setTimeout(function () {
            alertBox.style.opacity = '0';
        }, 1100);
        setTimeout(function () {
            alertBox.remove();
        }, 1500);
    }

    function copyOriginalText(inStr, wordsToRemove = '') {
        return inStr;
    }

    let bRadical = true; //是否是更激进的转换方式
    let bLogseq = false; //是否是为Logseq准备的转换方式
    
    if(typeof GM_registerMenuCommand === 'function'){
        let shortcutKey = null;
        GM_registerMenuCommand('切换激进转换', function (){
            bRadical = !bRadical;
            if(bRadical)
            {
                displayAlertBox("开启激进转换");
            }
            else
            {
                displayAlertBox("关闭激进转换");
            }
        }, shortcutKey);

        GM_registerMenuCommand('切换Logseq格式转换', function (){
            bLogseq = !bLogseq;
            if(bLogseq)
            {
                displayAlertBox("开启Logseq格式转换");
            }
            else
            {
                displayAlertBox("关闭Logseq格式转换");
            }
        }, shortcutKey);
    }
    /**
     * 将字符串中的公式转换为LaTeX格式，用"$$"包围起来。
     */
    function convertFormulasToLaTeX(inStr, wordsToRemove = '') {
    
        // 输入的预处理
        inStr = inStr.trim(); //删除字符串两端的空白字符
        if(bRadical)
        {
            inStr = inStr.replace(/\\begin{array}{[^{}]*}/g, '\\begin{aligned}');
            inStr = inStr.replace(/\\end{array}/g, '\\end{aligned}');
            inStr = inStr.replace(/\\boldsymbol ?/g, '');
            inStr = inStr.replace(/\\mathbf ?/g, '');
            inStr = inStr.replace(/\\mathscr ?/g, '\\mathcal');
        }

        //inStr = inStr.replace(wordsToRemove, '');
        inStr = inStr.replace(/ +/g, ' '); //将多个空格替换为一个空格
        inStr = inStr.replace(/\n+/g, '\n'); //去除重复换行符
        inStr = inStr.replace(/输人/g, "输入");
        inStr = inStr.replace(/存人/g, "存入");
        inStr = inStr.replace(/接人/g, "接入");
        inStr = inStr.replace(/舍人/g, "舍入");
        //inStr = inStr.trim(); 
        
        let nonFormulaChar = /[\u2000-\uffff]/g; //非公式字符的正则表达式
        let outStr = ""; //最终输出的字符串

        let blocks = SplitToBlocks(inStr);

        for(let i = 0; i < blocks.length; i++){
            if(!blocks[i].match(/\\begin\{(.*?)\}([\s\S]*?)\\end\{\1\}/)){ //判断是否多行非全公式块，是则不需做任何处理

                let tempMap = {};
                let index = 0;
            
                // 替换 $\text{...}$ 结构
                let processedBlock = blocks[i].replace(/\$\\text ?\{[^{}]*\}\$/g, match => {
                    let placeholder = `__PLACEHOLDER${index++}__`;
                    tempMap[placeholder] = match;
                    return placeholder;
                });
            
                let parts = processedBlock.split(/([\u2000-\uffff]+)|( +[a-zA-Z]{2,} +)/).filter(part => part !== undefined);
                if(parts.length > 1){
                    blocks[i] = blocks[i].replace(/\\text ?\{([^{}]*)\}/g, '$1'); //非全公式块，去掉\text{}
                    //非公式行，替换中文句尾标点
                    blocks[i] = blocks[i].replace(/, *?/g, '，');
                    blocks[i] = blocks[i].replace(/: *?/g, '：');
                    blocks[i] = blocks[i].replace(/; *?/g, '；');
                    blocks[i] = blocks[i].replace(/\? *?/g, '？');
                    blocks[i] = blocks[i].replace(/([\u2000-\uffff]) ?\(([^()\d]+?)\) ?([\u2000-\uffff])/g, '$1（$2）$3'); //? (中 1 文) 情况，为 $z^{-1} ($ 或 $z )$ 的 情况
                    //blocks[i] = blocks[i].replace(/[^\d]\. /g, '。');
                    blocks[i] = blocks[i].replace(/([\u2000-\uffff]) +([\u2000-\uffff])/g, '$1$2');

                    // 在非中文和非单词字符串前后加上$
                    blocks[i] = blocks[i].replace(/[^\u2000-\uffff]+/g, match => {
                        if(match.trim() === '') {
                            return match;
                        }
                        else if(match.match(/^[a-zA-Z]{2,} */) || match.match(/^\d\. /) || match.match(/^\(?\d\) /) || match.match(/([\u2000-\uffff]) *\- *([\u2000-\uffff])/)) { // match.match(/^[a-zA-Z]{2,} */) 为匹配 word 开头的情况
                            return match;
                        }
                        else if(match.match(/ +([a-zA-Z]{2,}) */))
                        {
                            return ' ' + match.trim() + ' ';
                        }
                        else{
                            return ` $` + match.trim() + '$ ';
                        }
                    });                
                }
                else { //单行全公式块，只需整体前后加上$$
                    blocks[i] = AddToStartEnd(blocks[i], "$$"); 
                }
                
            }else{ //多行全公式块，只需整体前后加上$$
                blocks[i] = AddToStartEnd(blocks[i], "$$");
            }
            if(bLogseq)
            {
                if(blocks[i].match(/^\d+\. /))
                {
                    blocks[i] = blocks[i].replace(/^\d+\. /, '');
                    blocks[i] = '- ' + blocks[i] + '\n' + 'logseq.order-list-type:: number';
                }
                else if(blocks[i].match(/^\(\d+\) /))
                {
                    blocks[i] = blocks[i].replace(/^(\()?\d+\) /, '');
                    blocks[i] = '   - ' + blocks[i] + '\n' + 'logseq.order-list-type:: number';
                }
            }
            outStr += blocks[i]+'\n';
        }

        //window.internalFunc = convertFormulasToLaTeX;

        return outStr;
        
        function AddToStartEnd(str, toAdd){
            return toAdd+str.trim()+toAdd;
        }

        // 将字符串分割为块
        function SplitToBlocks(str)
        {
            //先按换行分割
            let splits = str.split(/[\n\r]/g).filter(part => part !== undefined); 
            let i = 0;
            let blocks = [];
            while(i < splits.length)
            {
                //将\begin{x} ... \end{x} 视为一个块，所以需要合并行
                if(splits[i].match(/\\begin/))
                {
                    let j = i + 1;
                    while(j < splits.length && !splits[j].match(/\\end/))
                    {
                        j++;
                    }
                    let tempStr = "";
                    for(let k = i; k < j + 1; k++)
                    {
                        tempStr += splits[k] + "\n";
                    }
                    blocks.push(tempStr);
                    i = j + 1;
                }
                else
                {
                    blocks.push(splits[i]);
                    i++;
                }
            }
            return blocks;
        }
    }
    //myFunction = convertFormulasToLaTeX;
    //window.convertFormulasToLaTeX = convertFormulasToLaTeX;
    correctText = convertFormulasToLaTeX;
})();