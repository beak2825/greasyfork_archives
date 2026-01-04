// ==UserScript==
// @name         优书网发现页面按F搜索分数超过的
// @version      2.6
// @description  无法单独使用，配合其他脚本使用
// @author       myself
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        GM_openInTab
// @grant        GM_addStyle
// @match  https://www.yousuu.com/explore*
// @icon         https://inews.gtimg.com/newsapp_bt/0/12771684230/1000
// @namespace https://greasyfork.org/users/305985
// @downloadURL https://update.greasyfork.org/scripts/445775/%E4%BC%98%E4%B9%A6%E7%BD%91%E5%8F%91%E7%8E%B0%E9%A1%B5%E9%9D%A2%E6%8C%89F%E6%90%9C%E7%B4%A2%E5%88%86%E6%95%B0%E8%B6%85%E8%BF%87%E7%9A%84.user.js
// @updateURL https://update.greasyfork.org/scripts/445775/%E4%BC%98%E4%B9%A6%E7%BD%91%E5%8F%91%E7%8E%B0%E9%A1%B5%E9%9D%A2%E6%8C%89F%E6%90%9C%E7%B4%A2%E5%88%86%E6%95%B0%E8%B6%85%E8%BF%87%E7%9A%84.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var wantedScore=6.0
    //查询所有6分以上的
    var check0_0 = 1;
    //考虑0.0评分
    var check0_rate=4;
    //0.0评分4星以上的
    var check_all_rate=4;
    //查询所有4星以上的
    var forceLoadTime = 2;
    //加载两次没有数据列入黑名单

    var forceLoad = 0;
    var bookLog=''
    var unRatedBookList=[]
    
    var keyNext = 70
    var keyBack = 71
    // 监听键盘输入，F键对应70
    //查询键位对应的数字https://www.runoob.com/try/try.php?filename=tryjquery_event_which
    function timeStr(){
        return  new Date().toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ").substring(2,);
    }

    function printLog(text){
        console.log(`[${timeStr()}]按F搜索评分插件：\n\n`+text)
    }

    function printRedLog(text1,text2){
        console.log(`%c[${timeStr()}]按F搜索评分插件：\n\n%c`+text1+`%c`+text2,'','color:red','')
    }

    document.addEventListener('keyup', (e) => {
        if (event.keyCode == keyNext) {
            document.querySelector('.mybtn').click();
        }
        if (event.keyCode == keyBack) {
            document.querySelector('.backtop-btn').click();
        }
    })

    function getNextElement(node){
        if(!node.nextSibling) return null;
        var nextNode = node.nextSibling;
        if(nextNode.classList && nextNode.classList.contains('comment-card')){
            return nextNode;
        }
        return getNextElement(node.nextSibling);
    }

    var node0,node1,view;

    function getParentNode(view){
        let parentNode;
        if(document.querySelector("#app > div.app-main > section > div > div.left > div:nth-child(3)")==null) return document.querySelector("#app > div.app-main > section > div > div.left > div:nth-child(1)")
        if(view){
            parentNode = document.querySelector("#app > div.app-main > section > div > div.left > div:nth-child(3)")
        }else{
            parentNode = document.querySelector("#app > div.app-main > section > div > div.left > div:nth-child(2)")
        }
        return parentNode

    }

    function checkView1(){
        if(document.querySelector("#app > div.app-main > section > div > div.left > div:nth-child(3) ")==null) return view=0;
        if(getComputedStyle(document.querySelector("#app > div.app-main > section > div > div.left > div:nth-child(3) ")).display == 'none'){
            return view = 0;
        }else{
            return view = 1;
        }
    }

    function getScore(node){
        let score

        if(!view){
            score = node.querySelector('div.comment-content.comment > div:nth-child(1)')
        }else{
            score = node.querySelector('div.comment-content > div:nth-child(1)')
        }

        if (score==null || !score.innerHTML.split('&nbsp;')[0].split('：')[1] ||score.innerHTML.split('&nbsp;')[0].split('：')[1].length>5){
            let bookname = node.querySelector('.book-name-and-score.BookTitleScore').innerText
            if(bookname!=null){
                printRedLog(bookname,'没有评分')
                if(bookname.indexOf('《')==-1) return -2
            }
            return -1
        }

        return score.innerHTML.split('&nbsp;')[0].split('：')[1]
    }
    function getBookNameNode(node){
        if(node == null) return;
        if(!view)
            return node.querySelector("div.book-name-and-score.space-praiseCom-BookTitleScore-margin > a")
        else
            return node.querySelector("div.book-name-and-score.BookTitleScore > a")
    }


    function findNextBook(currentNode,parentNode){
        let score= -444;
        let check_rate=0;
        if(currentNode==null){
            let firstNode=0;
            while(currentNode==null || currentNode.nodeType==8){
            currentNode = parentNode.childNodes[firstNode++]
            }
            printRedLog(`初始化`,'')
            score=getScore( currentNode);
            check_rate=currentNode.querySelector('.el-rate').getAttribute('aria-valuenow')
            if(score == -1) return currentNode;
        }
        let booknameNode
        while(score < wantedScore &&
              check_rate<check_all_rate &&
              ((check0_0?score!=0:1) ||
               check_rate<check0_rate)){
            let tempNode = getNextElement(currentNode)
            if(!tempNode){
                jumpToPosition(currentNode,true)
                return currentNode;
            }
            score = getScore(tempNode)
            if(score ==-2){
                tempNode = getNextElement(tempNode);
                jumpToPosition(currentNode,true);
            }
            if(score == -1 ) {
                booknameNode = getBookNameNode(tempNode)
                let isInclude = unRatedBookList.includes(booknameNode.innerText)
                if(!isInclude && forceLoad< forceLoadTime ){
                    forceLoad++;
                    printRedLog(`强制加载次数${forceLoad}`,'')
                    jumpToPosition(currentNode,true);
                    return currentNode;
                }else{
                    if(!isInclude){
                        unRatedBookList.push(booknameNode.innerText)
                        printRedLog(`忽略列表加入${booknameNode.innerText}`,'')
                    }else{
                        printRedLog(`忽略${booknameNode.innerText}`,'')
                    }
                    if(forceLoad==3)
                        printRedLog("超级跳跃","")
                }
            }
            check_rate = tempNode.querySelector('.el-rate').getAttribute('aria-valuenow')
            forceLoad = 0;
            currentNode = tempNode;
        }
        booknameNode = getBookNameNode(currentNode)
        let log = `${booknameNode.innerText}  分数:${score}\n${booknameNode.href}\n`
        console.log(log)
        bookLog+=log;
        jumpToPosition(currentNode,false)
        return currentNode;

    }

    function jumpToPosition(node, load){
        if(load == true){
            node = document.querySelector("#app > div.app-main > section > div > div.left > div:nth-child(3) > div.infinite-loading-container")
            window.scroll(0, node.offsetTop-window.innerHeight/2+node.clientHeight/2)
        }else{
            selectNode(node)
        }
        window.scroll(0, node.offsetTop-window.innerHeight/2+node.clientHeight/2)
        printLog("跳到指定位置")
    }

    function selectNode(node){
        window.getSelection().removeAllRanges();
        let selection = window.getSelection();
        let range = document.createRange();
        range.selectNode(getBookNameNode(node));
        selection.addRange(range);
        if(node.querySelector('.ToggleBtn')!=null)node.querySelector('.ToggleBtn').click()
    }

    $("#app > button").before('<button class="mybtn  el-icon-bottom" style=""></button>')
    document.querySelector('.mybtn').onclick=()=>{
        let view = checkView1();
        let parentNode = getParentNode(view)
        if(view){
            node1=findNextBook(node1,parentNode)
        }else{
            node0=findNextBook(node0,parentNode)
        }

    }

    document.querySelector(".backtop-btn.el-icon-top").onclick=()=>{
        if(checkView1()){
            node1=null;
        }else{
            node0=null;
        }
        printLog(bookLog)
    }

    GM_addStyle ( `
    .mybtn {
            word-wrap: break-word;
    word-break: break-all;
    --main-bg-color: #f3f4f7;
    --card-bg-color: #fff;
    --comment-bg-color: #f8f8f8;
    --comment-color: #444;
    --text-color: #333;
    --fuzhu-color: #888;
    --fuzhu-next-color: #eee;
    --zerozerozero-text-color: #000;
    --aaa-color: #aaa;
    --sr-annote-color-0: #b4d9fb;
    --sr-annote-color-1: #ffeb3b;
    --sr-annote-color-2: #a2e9f2;
    --sr-annote-color-3: #a1e0ff;
    --sr-annote-color-4: #a8ea68;
    --sr-annote-color-5: #ffb7da;
    -webkit-appearance: inherit;
    -webkit-tap-highlight-color: inherit;
    box-sizing: inherit;
    padding: 0;
    margin: 0;
    font: inherit;
    outline: none;
    border: none;
    text-decoration: inherit;
    transition: background-color .4s;
    font-family: element-icons!important;
    speak: none;
    font-style: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    position: fixed;
    bottom: 100px;
    right: 12px;
    cursor: pointer;
    z-index: 99;
    font-size: 24px;
    box-shadow: 0 4px 12px 0 rgba(86,124,235,.26);
    width: 50px;
    height: 50px;
    border-radius: 4px;
    color: #5a7be6;
    background-color: var(--card-bg-color);
    font-weight: 700;
    }

    .helper-loading{
    position:absolute;
    margin:11px}


` );
    // Your code here...
})();