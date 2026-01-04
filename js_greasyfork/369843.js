// ==UserScript==
// @name         百度网盘提取工具（BaiduyundiskLinkCodeExtract）
// @namespace    http://weibo.com/comicwings
// @version      1.5
// @description  点击按钮扫描，如果页面上有百度云盘的资源网址，则将文字转换为链接；如果页面上有百度云盘资源链接和提取码，则在点击链接后自动填入提取码并提交
// @author       WingsJ
// @match        *://*/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/369843/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7%EF%BC%88BaiduyundiskLinkCodeExtract%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/369843/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7%EF%BC%88BaiduyundiskLinkCodeExtract%EF%BC%89.meta.js
// ==/UserScript==

(()=>
{
/*成员*/

    /**
     * @name 链接
     * @type Class
     */
    const Link=class
    {
        /**
         * @name 构造方法
         * @type Constructor Function
         * @param {Object} node 结点。DOMNode实例
         * @param {String} text 链接地址
         */
        constructor(node,text=null)
        {
            this.node=node;
            this.text=text;
        }
    };

    const BaiduHostname='pan.baidu.com';
    const CodeRegexp=/[百度云盘提取密码]+[:：\s]*([a-zA-Z\d]{4})|^\s*([a-zA-Z\d]{4})\s*$/m;
    const LinkRegexp=/((?:https?:\/\/)?(?:pan|yun).baidu.com\/s\/[-\w]+)/i;

    let links=null;

    /**
     * @name 搜索链接
     * @type Function
     */
    let searchLink=function()
    {
        let filter=(node)=>
        {
            if(node.nodeName==='A' && !node.classList.contains('BaiduyundiskLinkCodeExtract_link'))
            {
                if(node.href.match(LinkRegexp))
                {
                    links.push(new Link(node));
                }

                return NodeFilter.FILTER_ACCEPT;
            }
            else if(node.nodeName==='#text' && node.parentNode.nodeName!=='A')
            {
                let linkMatchResult=node.nodeValue.match(LinkRegexp);       //普通链接文本
                if(linkMatchResult)
                {
                    links.push(new Link(node.parentNode,linkMatchResult[1]));

                    return NodeFilter.FILTER_ACCEPT;
                }
            }

            return NodeFilter.FILTER_SKIP;
        };
        let nodeIterator=document.createNodeIterator(document.body,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,filter,false);
        while(nodeIterator.nextNode());
    };
    /**
     * @name 搜索提取码
     * @type Function
     * @param {Object} startNode 起点。DOMNode实例
     */
    let searchCode=function(startNode)
    {
        if(startNode===null)
            return;

        let code=null;

        let filter=(node)=>
        {
            if(node.nodeName==='#text')
            {
                let codeMatchResult=node.nodeValue.match(CodeRegexp);       //普通链接文本
                if(codeMatchResult)
                {
                    code=codeMatchResult[1]||codeMatchResult[2];

                    return NodeFilter.FILTER_ACCEPT;
                }

                return NodeFilter.FILTER_SKIP;
            }
        };

        const MaxLevel=10;       //最多搜索层数
        let level=0;
        while(code===null && level<MaxLevel)
        {
            let nodeIterator=document.createNodeIterator(startNode,NodeFilter.SHOW_TEXT,filter,false);
            while(nodeIterator.nextNode() && code===null);

            level++;
            startNode=startNode.parentNode;
        }

        return code;
    };
    /**
     * @name 修饰链接
     * @type Function
     * @param {Object} link Link实例
     * @param {String} code 提取码
     */
    let decorateLink=function(link,code)
    {
        if(link.node.tagName.toUpperCase()==='A' && !link.node.BaiduyundiskLinkCodeExtract_decorated)
        {
            link.node.href+=`#${code}`;      //百度网盘在跳转时hash会被保留
            link.node.classList.add('BaiduyundiskLinkCodeExtract_link');
            link.node.BaiduyundiskLinkCodeExtract_decorated=true;
        }
        else if(link.text!==null)
        {
            let aHtml=`<a class='BaiduyundiskLinkCodeExtract_link' href='${link.text}#${code}' target='_blank'>${link.text}</a>`;
            link.node.innerHTML=link.node.innerHTML.replace(link.text,aHtml);       //将文本转换为链接
        }
    };
    /**
     * @name 扫描
     * @type Function
     */
    const scan=function()
    {
        links=[];

        searchLink();

        for(let el of links)
        {
            let code=searchCode(el.node);
            if(code)
                decorateLink(el,code);
        }
    };
    /**
     * @name 初始化
     * @type Function
     */
    const initiate=function()
    {
        const css=
        `
            .BaiduyundiskLinkCodeExtract_menu
            {
                z-index:10000;
                position:fixed;
                right:0;
                top:30%;
                padding:10px;
                background-color:skyblue;
                font-size:24px;
                font-family:'Microsoft JhengHei',sans-self;
                line-height:1.2;
                text-align:center;
                border-top-left-radius:16px;
                border-bottom-left-radius:16px;
                color:#333;
            }

            .BaiduyundiskLinkCodeExtract_menu p
            {
                margin:0;
            }

            .BaiduyundiskLinkCodeExtract_title
            {
                padding-bottom:8px;
                border-bottom:1px solid lightblue;
                font-size:14px;
            }

            .BaiduyundiskLinkCodeExtract_button
            {
                padding:4px 0;
                cursor:pointer;
            }
            .BaiduyundiskLinkCodeExtract_button:hover
            {
                color:blue;
            }

            .BaiduyundiskLinkCodeExtract_link
            {
                background-color:rgba(255,255,0,0.5);
            }
        `;

        let style=document.createElement('style');
        style.innerHTML=css;
        document.head.appendChild(style);

        let menu=document.createElement('div');
        menu.className='BaiduyundiskLinkCodeExtract_menu';
        menu.innerHTML=`<p class='BaiduyundiskLinkCodeExtract_title'>百度网盘工具</p>`;

        let button_scan=document.createElement('p');
        button_scan.className='BaiduyundiskLinkCodeExtract_button';
        button_scan.innerText='扫描链接';
        button_scan.addEventListener('click',scan);

        menu.appendChild(button_scan);
        document.body.appendChild(menu);
    };

/*构造*/

    if(self===top)      //不在iframe中
        initiate();

    if(window.location.hostname===BaiduHostname)       //网盘目标网页
    {
        let extractCode=window.location.hash.slice(1,5);
        if(extractCode)
        {
            let codeInput=document.querySelector('.pickpw input');
            codeInput.value=extractCode;
            document.querySelector('form[name="accessForm"]').onsubmit();
        }
    }
})();