// ==UserScript==
// @name         小米笔记转markdown
// @namespace    http://i.mi.com/
// @version      2024-07-14
// @description  将小米笔记中的笔记转换成markdown形式，可供其他笔记使用
// @author       hhhllll
// @require      https://unpkg.com/turndown/dist/turndown.js
// @match        http*://i.mi.com/note/h5*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502186/%E5%B0%8F%E7%B1%B3%E7%AC%94%E8%AE%B0%E8%BD%ACmarkdown.user.js
// @updateURL https://update.greasyfork.org/scripts/502186/%E5%B0%8F%E7%B1%B3%E7%AC%94%E8%AE%B0%E8%BD%ACmarkdown.meta.js
// ==/UserScript==

(function() {
    let testParser = new TurndownService({hr:'---',fence:'```',bulletListMarker:'-'});
    testParser.keep(['del','u'])
    testParser.addRule('center', {//居中
        filter: function(node) {
            return node.nodeName === 'P' && node.classList.contains('pm-align-center');
        },
        replacement: function(content) {
            return '<center>' + content + '</center>\n';
        }
    });
    testParser.addRule('right',{//居右
        filter: function(node){
            return node.nodeName === 'P' && node.classList.contains('pm-align-right');
        },
        replacement: function(content){
            return '<p align="right">'+content+'</p>\n';
        }
    });
    testParser.addRule('highLight',{//高亮
        filter: function(node){
            return node.nodeName === 'SPAN' && node.classList.contains('pm-highlight');
        },
        replacement: function(content){
            return "=="+content+"==";
        }
    });
    testParser.addRule('h1',{//h1
        filter:function(node){
            return node.nodeName === 'P' && node.classList.contains("pm-size-large");
        },
        replacement: function(content){
            return "# "+content+"\n";
        }
    });
    testParser.addRule('h2',{
        filter:function(node){
            return node.nodeName === 'P' && node.classList.contains("pm-size-middle");
        },
        replacement: function(content){
            return "## "+content +"\n";
        }
    });
    testParser.addRule('h3',{
        filter:function(node){
            return node.nodeName === 'P' && node.classList.contains("pm-size-h3");
        },
        replacement: function(content){
            return "### "+content+"\n";
        }
    });
    testParser.addRule('checkbox',{
        filter:function(node){
            return node.nodeName === 'DIV' && node.classList.contains("pm-checklist");
        },
        replacement:function(content,node){
            if(node.getAttribute('data-checked')== "false"){
                return "- [] "+node.querySelector('span').textContent+"\n";
            }  return "- [x] "+node.querySelector('span').textContent+"\n";

        }
    });
    testParser.addRule('img',{//保存后的图片不是原始图片，需要cookie{xmuuid,serviceToken,userId}带着链接获取图片直链
        filter:function(node){
            return node.classList.contains("pm-img-container");
        },
        replacement:function(content,node){
            var imgSrc = node.querySelector("img").getAttribute("src");
            var imgDes = node.querySelector("div>div").textContent;
            var imgSrc = "https://i.mi.com"+imgSrc;
            if(!(imgDes))
                var imgDes = "";
            return "![]("+imgSrc+")\n"+imgDes+"\n";
        }
    });
    testParser.addRule("quote",{
        filter:function(node){
            return node.classList.contains("quote");
        },
        replacement:function(content,node){
            var quoteL=node.querySelectorAll("p");
            var elment=Array.from(quoteL);
            var elment=elment.map(i=>"> "+i.textContent+"\n");
            return elment.join('');
        }
    })
    testParser.addRule("order-list",{//有序列表
        filter:function(node){
            return node.classList.contains("pm-order-list");
        },
        replacement:function(content,node){
            var tab = ""
            for(var i = 1;i<node.getAttribute("data-indentation");i++){
                tab=tab+"\t";
            }
            return tab+node.getAttribute("data-start")+". "+node.textContent+"\n";
        }
    })
    testParser.addRule("pm-bullet-list",{//无序列表
        filter:function(node){
            return node.classList.contains("pm-bullet-list");
        },
        replacement:function(content,node){
            var tab = ""
            for(var i = 1;i<node.getAttribute("data-indentation");i++){
                tab=tab+"\t";
            }
            return tab+"- "+node.textContent+"\n";
        }
    })

    GM_registerMenuCommand("将当前笔记保存为markdown",function(){
        var u1 = document.querySelectorAll("#u1 > #pm-container > div > :not(:first-child)");
        var u1A = Array.from(u1);
        var bodyhtml = u1A.map(i=>i.outerHTML).join("");
        var head = document.querySelector("#u1 > div.origin-title > div").textContent;
        // console.log(bodyhtml);
        let result = testParser.turndown(bodyhtml);
        // console.log(result);
        saveToFile(result,head);
    })
    function saveToFile(text,head){//默认保存为txt
        const blob = new Blob([text],{type:"text/plain"});
        const url =URL.createObjectURL(blob);
        GM_download({
            url:url,
            name:head,
            saveAs:true,
        })
    }
})();