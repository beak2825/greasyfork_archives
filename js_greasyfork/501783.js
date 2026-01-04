// ==UserScript==
// @name        我的工具箱(手机版)m
// @namespace   shan_haiying@tongji.edu.cn
// @description 日常上网辅助工具。（2023.9.7更新）
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @include     *://*
// @version     3.2
// @noframes
// @grant    GM_addStyle
// @grant    GM_download
// @grant    GM_notification
// @grant    GM_setClipboard

// @grant       GM_getResourceText
// @license MIT


// @downloadURL https://update.greasyfork.org/scripts/501783/%E6%88%91%E7%9A%84%E5%B7%A5%E5%85%B7%E7%AE%B1%28%E6%89%8B%E6%9C%BA%E7%89%88%29m.user.js
// @updateURL https://update.greasyfork.org/scripts/501783/%E6%88%91%E7%9A%84%E5%B7%A5%E5%85%B7%E7%AE%B1%28%E6%89%8B%E6%9C%BA%E7%89%88%29m.meta.js
// ==/UserScript==

GM_addStyle(`
/* default button style */
.half-circle {
position:fixed;
width: 30px;
height: 30px;
bottom: 0;
background-color:black;
border-top-right-radius: 40px;
border-bottom:0;
border-left: 0;
opacity:0.3;
z-index:100000;
}

#myContainer table {
text-align: left;
position: relative;
border-collapse: collapse;
width:100%;
}
#myContainer th, td {
padding: 0.25rem;
}
#myContainer tr.red th {
background: red;
color: white;
}
#myContainer tr.green th {
background: green;
color: white;
}
#myContainer tr.purple th {
background: purple;
color: white;
}
#myContainer th {
background: white;
position: sticky;
top: 0;
box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
}

#myContainer:hover {
left:0px;
opacity:1;
border-radius:10px;
box-shadow:5px-5px 10px #777;
}

#tool_buttons  h2 {
padding-top: 30px;
font-size: 24px;
font-weight: 900;
color: #f9f9f9;
text-align: center;
z-index:2;
}

#tool_buttons div{
background: rgb(51, 51, 51);
width:20%;
}

.mybtn {
width:100%;
padding-top: 5px;
padding: 5px 5px;
font-size: 16px;
text-align: center;
cursor: pointer;
outline: none;
color: #ffffff;
background-color: #848d95;
border: none;
border-radius: 5px;
box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.4);
}

.mybtn:hover {
background-color: #1976D2;
transition: all 0.3s ease-in-out;
}

.mybtn:active {
background-color: #3e8e41;
box-shadow: 0 5px #666;
transform: translateY(4px);
}
`);

var data = `
<div  id="tool_buttons">
<table>
<thead>
<tr class="red">
<td><h2>工具箱</h2></td>
</tr>
</thead>
<tbody>
<tr>
<td><button type="button" id="bt1" class="mybtn">下载论文源代码</button></td>
</tr>
<tr>
<td><button type="button" id="bt2" class="mybtn">All2TeX</button></td>
</tr>
<tr>
<td><button type="button" id="bt3" class="mybtn">CellExport</button></td>
</tr>
<tr>
<td><button type="button" id="bt4" class="mybtn">tikzjax</button></td>
</tr>
<tr>
<td><button type="button" id="bt5" class="mybtn">YouTube内容转文字</button></td>
</tr>
<tr>
<td><button type="button" id="bt6" class="mybtn">爱课程下载</button></td>
</tr>
<tr>
<td><button type="button" id="bt7" class="mybtn">导出播放列表</button></td>
</tr>
<tr>
<td><button type="button" id="bt8" class="mybtn">剪裁到Obsidian</button></td>
</tr>
<tr>
<td><button type="button" id="bt9" class="mybtn">Test</button></td>
</tr>
</tbody>
</table>
</div>
`;

var zNode = document.createElement("div");
zNode.innerHTML = data;
zNode.setAttribute("id", "myContainer");
var style = `
visibility: visible;
position:fixed;
left: 0px;top: 30px;
width:180px;
left:-200px;
height:100%;
text-align:center;
color:#fff;
background:#333;
z-index:2147483647;
margin: 0;
border:2px solid #a1a1a1;
border-radius: 10px;
color:#fff;
padding:4px;
box-shadow: 0 0 0 3px rgba(0, 123, 255, .5);
`;

zNode.setAttribute("style", style);
if (document.body != null) {
    document.body.appendChild(zNode);
}
var halfbtn = document.createElement("div");
halfbtn.classList.add("half-circle");
halfbtn.id = "mybtn";
document.body.appendChild(halfbtn);

//--- Activate the newly added button.
document.getElementById("bt1").addEventListener("click", func1, false);

function getElementsByXPath(xpath, parent) {
    let results = [];
    let query = document.evaluate(
        xpath,
        parent || document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return results;
}

function func1() {
    var link = window.location.href;
    var arxiv = "https://arxiv.org/abs";
    var arxiv_search = "arxiv.org/search";
    var alco = "alco.centre-mersenne.org/item";
    var title, xPathResult, element;

    if (link.search(arxiv) != -1) {
        title =
            document.head.getElementsByTagName("meta")["citation_title"].content;
        xPathResult = document.evaluate(
            '//a[contains(text(),"Other formats")]',
            document
        );
        if (xPathResult) {
            element = xPathResult.iterateNext();
        }
        element.href = element.href.replace("format", "e-print");
        var arx_id = link.replace(arxiv + "/", "").replace("/", "-");
        var req = new XMLHttpRequest();
        req.open("GET", element.href, false);
        req.send();
        if (req.getResponseHeader("content-type") == "application/x-eprint") {
            ext = ".tex";
        } else {
            ext = ".tar.gz";
        }
        title = "[" + arx_id + "] " + title + ext;

        title = title.replace(/\\sl|\//gi, "");
        element.download = title;
        element.innerText = ext;
        element.title = title;
        element.click();
        GM_notification({ title: "棒棒的!", text: "正在下载论文附件!" });
    }
    if (link.search(alco) != -1) {
        title =
            document.head.getElementsByTagName("meta")["citation_title"].content;
        xPathResult = document.evaluate(
            '//img[@src="/static/ptf/img/tex.png"]/..',
            document
        );
        if (xPathResult) {
            element = xPathResult.iterateNext();
        }
        element.download = title.replace(/\s/g, "_") + ".tex";
        element.click();
        alert("正在下载!");
    }

    if (link.search(arxiv_search) != -1) {
        var xpath = '//a[contains(@href,"format")]';
        var links = getElementsByXPath(xpath, document);
        var ext;
        for (var lk of links) {
            var li = lk.closest("li");
            title = li.querySelector(".title").innerText;
            lk.href = lk.href.replace("format", "e-print");
            arx_id = li
                .getElementsByTagName("a")[0]
                .innerText.replace("arXiv:", "")
                .replace("/", "");

            //lk.href.match(/\d+\.\d+/)[0];
            title = "[" + arx_id + "] " + title;
            title = title.replace(/\\sl|\//gi, "");
            ext = ".tar.gz";
            lk.download = title + ext;
            lk.innerText = ext;
            lk.title = title + ext;
        }

        GM_notification({
            title: "棒棒的!",
            text: "转换完成,请使用 downthemall 下载论文附件!",
        });
    }
}

function Copy(target) {
    var range, select;
    if (document.createRange) {
        range = document.createRange();
        //         if (targe.nodeType==undefined){
        //          return false
        //         }
        range.selectNode(target);
        select = window.getSelection();
        select.removeAllRanges();
        select.addRange(range);
        document.execCommand("copy");
        select.removeAllRanges();
    } else {
        range = document.body.createTextRange();
        range.moveToElementText(target);
        range.select();
        document.execCommand("copy");
    }
}

function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

const selection = getSelectionHtml();

function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    var a = document.createElement("a"),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}


function deleteElementsByClassName(namelist) {
    namelist.forEach(name=>{
        var elms = document.querySelectorAll(`[class*=${name}]`);
        [...elms].forEach(el=>{el.outerHTML=""})
    })
}

function deleteElementsById(namelist) {
    for (let name of namelist) {
        var el = document.getElementById(name);
        if (el) {
            el.outerHTML="";
        }
    }
}

var htmlencode = function (str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    //         s = s.replace(/ /g,"&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s=s.replace(/\\\s*begin\s*{\s*/gim, "\\begin{")
    s=s.replace(/\\\s*end\s*{\s*/gim, "\\end{")
    s=s.replace(/\s*}/gim, "}")
    s=s.replace(/\\\s*right/gim, "\\right")
    s=s.replace(/\\\s*left/gim, "\\left")
    return s;
};



function img2tex(){
    var mathimgs=Array.from(document.querySelectorAll("img[data-formula]"))
    mathimgs.forEach(img=>{
        var texcode=htmlencode(img.getAttribute("data-formula").trim())
        texcode=texcode.replace(/^\s*\\\(/img, "")
        texcode=texcode.replace(/\\\)\s*$/img, "")
        var fmtype=img=>(img.previousSibling!=null?img.previousSibling.nodeName:"")+"me"+(img.nextSibling!=null?img.nextSibling.nodeName:"")
        //         console.log(fmtype)
        var ct=texcode.replace(/\\\w+/ig,"a")

        console.log(ct)
        if (ct.length<18){
            img.outerHTML=` $${texcode.trim()}$ `
        }
        else{
            img.outerHTML=`<br/>$$<br/>${texcode.trim()}<br/>$$<br/>`
        }
    })
}


//转换html下标或数学符号成tex格式
function sub_em2tex(){
    var subs=Array.from(document.getElementsByTagName("sub"))
    subs.forEach(sub=>{
        var  ps=sub.previousSibling
        var ismath=(ps.className=="math")
        if (ismath==false){
            if (ps.wholeText==undefined){
                var pstr=ps.innerText

                }else{
                    pstr=ps.wholeText
                }
            var pat=(pstr.match(/\s/)==null)?/(.*)(^\S+)$/:/(^.*\s+)(\S+)\s*$/
            var mch=pstr.match(pat)
            if (mch!=null){
                if (ps.wholeText==undefined){
                    ps.innerText=mch[1]+` $${mch[2]}_{${sub.innerText}}$ `
                }else{
                    ps.data=mch[1]+` $${mch[2]}_{${sub.innerText}}$ `
                }
            }else{
                if (ps.wholeText==undefined){
                    ps.innerText=ps.innerText+`$_{${sub.innerText}}$ `
                }else{
                    ps.data=ps.data+`$_{${sub.innerText}}$ `
                }
            }
        }else{
            if (ps.wholeText==undefined){
                ps.insertAdjacentHTML("afterend",`$_{${sub.innerText}}$ `)
            }else{
                ps.data=ps.data+`$_{${sub.innerText}}$ `
            }
        }
        sub.outerHTML=""
    })

    var ems=Array.from(document.getElementsByTagName("em"))
    ems.forEach(em=>{
        if ( em.innerText.length==1){
            em.outerHTML="$"+em.innerText+"$"
        }
    })
}

//转换mathjax格式公式成tex公式
function convmath() {
    function equ2markdown(tex,tag,label){
        return `<br/>\`\`\`ad-equation<br/>$$<br/>${tex}<br/>\\tag{${tag}}<br/>$$<br/>\`\`\`<br/> ^b${label}<br/><br/>`;
    }

    let canvasElements = document.getElementsByTagName('canvas');
for(let i = 0; i < canvasElements.length; i++) {
  // 获取data-content属性
  let content = canvasElements[i].getAttribute('data-content');
  // 将canvas的内容替换为data-content的值
  canvasElements[i].outerHTML = `$${content}$`;
}
    var equations=document.querySelectorAll("[class*=c-article-equation], .formula,.EquationContent, MathJax_SVG")
    equations.forEach(equ=>{
        var scripts=equ.querySelectorAll("script")
        if (scripts.length>0){
            var tex=""
            var script=scripts[0]
            tex=script.innerText
            var type=script.type
            if (/mml/.test(type)){
                tex=MathML2LaTeX.convert(tex)
            }
            tex=tex.trim()
            if (equ.className=="EquationContent"){
                equ=equ.parentElement
            }
            var equlabels=equ.querySelectorAll("span.label,.c-article-equation__number,.EquationNumber")
            var hasLabel=equlabels.length>0
            if (hasLabel){
                var tag=equlabels[0].innerText.replace(/\(|\)/g,"")
                var label=equ.id
                equ.outerHTML=equ2markdown(tex,tag,label)
            }
            else{
                equ.outerHTML=`<br/>$$<br/>${tex}<br/>$$<br/>`;
            }
        }


    })
    var maths=document.querySelectorAll("span.math,.mathjax-tex, .MathJax")
    maths.forEach(equ=>{
        var scripts=equ.querySelectorAll("script")
        if (scripts.length>0){
            var tex=""
            var script=scripts[0]
            tex=script.innerText
            var type=script.type
            if (/mml/.test(type)){
                tex=MathML2LaTeX.convert(tex)
            }
            tex=tex.trim()
            equ.outerHTML =  `<span >\$${tex}\$</span>`;
        }
    })
    var scripts=document.querySelectorAll("script[type='math/tex'],script[type='math/mml']")
    scripts.forEach(script=>{
        var tex=""
        tex=script.innerText
        var type=script.type
        if (/mml/.test(type)){
            tex=MathML2LaTeX.convert(tex)
        }
        tex=tex.trim()
        script.previousSibling.outerHTML =  `<span >\$${tex}\$</span>`;
    })

    maths=document.querySelectorAll(".ztext-math");
    maths.forEach(equ=>{
        var scripts=equ.querySelectorAll("script")
        if (scripts.length>0){
            var tex=""
            var script=scripts[0]
            tex=script.innerText
            tex=tex.trim()
            var type=script.type
            if (/inline/.test(type)){
                tex=`<span >\$${tex}\$</span>`;
            }
            if (/display/.test(type)){
                tex=`<br/>$$<br/>${tex}<br/>$$<br/>`;
            }
        }
        equ.outerHTML=tex;
})
}

//通用的交叉引用结构处理函数
function CR_obj_processor(objselector, obp, refp, getobid){
    var objs=document.querySelectorAll(objselector)
    objs.forEach(obj=>{
        var id=getobid(obj)
        refp(obj,id)
        obp(obj,id)
    })
}

var refp=(obj,id)=>{
    var refs=document.querySelectorAll(`a[name="b${id}"`)
    var tid=id.replace(".","-")
    refs.forEach(ref=>{
        ref.outerHTML=` [[#^${tid}|${ref.innerText}]] `
    })
}

function func2() {
    var webSite = window.location.href;
    var reGH = /github/i;
    var reCSDN = /csdn|beekc/i;
    var reWiKi = /wikipedia|wikiwand/i;
    var reZH = /zhihu/i;
    var reWP = /wordpress/i;
    var ketex = /upupming/i;
    var ccjou = /ccjou.wordpress.com/i;
    var ketex1 = /songcy/i;
    var artofproof = /artofproblemsolving/i;
    var remathworld = /mathworld/i;
    var planetmath = /planetmath/i;
    var cnblogs = /cnblogs|stackexchange/i;
    var rehandwiki = /handwiki/i;
    var christangdt = /christangdt.home.blog/i;

    var htmlencode = function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        //         s = s.replace(/ /g,"&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        return s;
    };

    var isThm=(obj)=>{
        var mch=obj.innerText.match(/^(\w+)/)
        var hds=new Set(["Claim", "Conjecture","Corollary","Definition","Lemma","Question","Remark","Theorem"])
        return mch!=null &&hds.has(mch[1])
    }

    var isPrf=(obj)=>{
        var mch=obj.innerText.match(/^(\w+)/)
        var hds=new Set(["Proof"])
        return mch!=null &&hds.has(mch[1])
    }









    var container, matches, P, M, texcode;

    if (webSite.indexOf("zhihu.com") != -1) {


    }

    //alert("替换图像为其相关的tex")
    function CovertFunc() {
        // 知乎
        if (reZH.test(webSite)) {
            img2tex()
            function genfrantmetter(){
                var tags =
                    "tags: " +
                    Array.from(document.getElementsByClassName("Tag Topic"))
                .map((x) => x.innerText.replace(" ",""))
                .join(" ") +
                    "<br/>";
                return "<br/>" + tags + "<br/>";
            }

            var frantmatter =genfrantmetter()




            var header1 = document.getElementsByClassName("Post-Header")[0];
            header1.innerHTML = header1.children[0].outerHTML;
            Array.from(
                document.getElementsByClassName("RichText-LinkCardContainer")
            ).map((x) => (x.outerHTML = "[[" + x.innerText + "]]"));

            try {
                var refs = document.querySelectorAll("a.ReferenceList-backLink");
                for (let ref of refs) {
                    var id = ref.getAttribute("href").slice(1);
                    var cite = document.getElementById(id);
                    var pnd = cite.parentElement;
                    var citetag = cite.innerText.replace("[", "[^");
                    if (pnd.tagName == "SUP") {
                        pnd.outerHTML = citetag;
                    }
                    ref.outerHTML = citetag + ":";
                }

                var reflist = document.querySelector(".ReferenceList");
                var lst = Array.from(reflist.getElementsByTagName("li"))
                .map((x) => x.innerText)
                .join("\n");
                reflist.innerHTML = lst;
            } catch (error) {}



            try {
                Array.from(
                    document.querySelectorAll('sup[data-draft-type="reference"]')
                ).map(
                    (x) =>
                    (x.outerHTML = x.querySelector("a").innerText.replace("[", "[^"))
                );
            } catch (error) {}



            var gifs = document.getElementsByClassName("ztext-gif");
            for (var img of gifs) {
                img.onchange = function (event) {
                    var theel = event.target;
                    theel.outerHTML = '<img src="' + theel.src + '" >';
                };
                img.click();
            }

            var titleimg=document.querySelector(".TitleImage")
            var article=document.querySelector("article")
            if (titleimg!=null){
                article.insertAdjacentHTML("afterbegin",titleimg.outerHTML)
            }


            deleteElementsByClassName([
                "Post-topicsAndReviewer",
                "Reward",
                "RichContent-actions",
                "ContentItem-time",
                "entry-utility",
                "sharedaddy",
                "entry-meta",
                "inline-ad-slot",
                "LinkCard-desc",
                "LinkCard-image",
                "ContentItem-actions",
                "Catalog"
            ]);

            var links=document.querySelectorAll("a[href*='www.zhihu.com/search']")
            links.forEach(link=>{
                link.outerHTML=link.innerText
            })

            convmath()

            var save = function () {
                var target = document.querySelector(".QuestionAnswer-content,article");
                target.innerHTML = frantmatter + target.innerHTML;
                if (target != undefined) {
                    Copy(target);
                    return;
                }
            };

            setTimeout(save, 50);

        }

        //christangdt
        if (christangdt.test(webSite)) {
            var formulae = document.querySelectorAll("p.has-text-align-center");
            for (let p of formulae) {
                let code="<br/>$$<br/>";
                let maths= p.querySelectorAll("img.latex");
                for (let img of maths) {
                    code=code+img.alt;
                }
                code=code+"<br/>$$<br/>";
                p.innerHTML = htmlencode(code);
            }
            var imgs = document.querySelectorAll("img.latex");
            for (let img of imgs) {
                img.outerHTML = " $"+htmlencode(img.alt.trim())+"$ ";
            }
        }


        //artofproof
        if (artofproof.test(webSite)) {
            imgs = document.querySelectorAll("img.latex");
            for (let img of imgs) {
                img.outerHTML = htmlencode(img.alt);
            }
            imgs = document.querySelectorAll("img.latexcenter");
            for (let img of imgs) {
                img.outerHTML = htmlencode(img.alt);
            }
        }

        //香蕉空间
        var bananaspace=/bananaspace/
        if (bananaspace.test(webSite)) {
            if(!/action=edit/.test(webSite)){
                webSite=webSite.replace("org/wiki/","org/w/index.php?title=")+"&action=edit"
                window.location.href=webSite
            }else{
                var source=document.getElementById("wpTextbox1")
                if(source!=null){
                    tex=source.innerText
                }
            }


            title=RLCONF["wgTitle"];

            GM_setClipboard (`# ${title}\n\n`+tex);
        }



        var ituring = /ituring/i;
        if (ituring.test(webSite)) {
            imgs = document.querySelectorAll("p[class='图']>img[src*='latex']")
            imgs.forEach(x=>{x.outerHTML=`$$${x.alt}$$`})
            imgs = document.querySelectorAll("p>img[src*='latex']")
            imgs.forEach(x=>{x.outerHTML=`$${x.alt}$`})
            imgs = document.querySelectorAll("sub")
            imgs.forEach(x=>{
                subs=x.querySelectorAll("em")
                subs.forEach(x=>{x.outerHTML=`${x.innerText}`})
                x.outerHTML=`_{${x.innerText}}`}
                        )
            imgs = document.querySelectorAll("sup")
            imgs.forEach(x=>{
                subs=x.querySelectorAll("em")
                subs.forEach(x=>{x.outerHTML=`${x.innerText}`})
                x.outerHTML=`^{${x.innerText}}`}
                        )
            imgs = document.querySelectorAll("em")
            imgs.forEach(x=>{x.outerHTML=`${x.innerText}`})
            target = document.querySelector("article");
            if (target != undefined) {
                Copy(target);
                return;
            }
        }




        //线代启示录
        if (ccjou.test(webSite)) {
            var ps = document.querySelectorAll("p");
            for (let p of ps) {
                if (p.style["text-align"] == "center") {
                    imgs = p.querySelectorAll("img.latex");
                    for (let img of imgs) {
                        var tex=htmlencode(img.alt).trim();
                        img.outerHTML = tex
                    }
                    p.innerHTML = "<br/>$$<br/>" + p.innerHTML + "<br/>$$<br/>";
                }
            }

            imgs = document.querySelectorAll("img.latex");
            for (let img of imgs) {
                img.outerHTML = "&nbsp;$" + htmlencode(img.alt).trim() + "$&nbsp;";
            }


            var title=document.querySelector("h2[class='entry-title']")
            title.outerHTML=`# ${title.innerText}`


            var   tags =
                "tags: " +
                Array.from(document.querySelectorAll('a[rel="tag"]'))
            .map((x) => x.innerText.replace(" ",""))
            .join(" ") +
                "<br/>";
            var categorys =
                "categorys: " +
                Array.from(document.querySelectorAll('a[rel="category tag"]'))
            .map((x) => x.innerText.replace(" ",""))
            .join(" ") +
                "<br/>";
            frantmatter = "<br/>" + categorys + tags + "<br/>";

            try {
                Array.from(
                    document
                    .querySelector("ul+#jp-post-flair")
                    .previousElementSibling.querySelectorAll("a")
                ).map((x) => (x.outerHTML = "[[" + x.innerText + "]]"));
            } catch (error) {}

            deleteElementsByClassName([
                "entry-utility",
                "sharedaddy",
                "entry-meta",
                "inline-ad-slot",
                "LinkCard-desc",
                "Post-topicsAndReviewer",
                "LinkCard-image",
            ]);
            deleteElementsById(["nav-above", "nav-below", "comments"]);

            Array.from(
                document.getElementsByClassName("RichText-LinkCardContainer")
            ).map((x) => (x.outerHTML = "[[" + x.innerText + "]]"));

            container = document.querySelector("#content,.post");

            var pagelinks = container.querySelectorAll("a[href*='ccjou']");
            pagelinks.forEach(link=>{
                var text=link.innerText.trim()
                if(text!=""){
                    link.outerHTML=`[[${text}]]`
            }
                    })





            container = document.querySelector("#content,.post");
            container.innerHTML = frantmatter + container.innerHTML;
            if (container != undefined) {
                Copy(container);
            }
        }

        // mathworld
        if (remathworld.test(webSite)) {
            imgs = document.querySelectorAll("img[data-formula]");

            imgs = document.querySelectorAll(".inlineformula");
            for (img of imgs) {
                formula = img
                    .getAttribute("alt")
                    .trim()
                    .replace(/^\\\[|^\\\(|\\\)$|\\\]$/g, "");
                img.outerHTML = " $" + formula + "$ ";
            }
            var target = document.querySelector(".QuestionAnswer-content,article");
            if (target != undefined) {
                Copy(target);
                return;
            }
        }
        //wikipedia   fullContent
        if (reWiKi.test(webSite)) {
            var container = document.querySelector("#bodyContent,#fullContent");
            var matches = container.querySelectorAll("annotation");
            for (var M of matches) {
                var P = M.closest("span.mwe-math-element");
                var texcode = M.innerHTML;

                var oldtexcode = texcode;
                texcode = texcode.replace(/(\))+$/, "");
                texcode = texcode + "}".repeat(oldtexcode.length - texcode.length);

                if (P != null) {
                    if (P.previousSibling == null && P.nextSibling == null) {
                        P.outerHTML = "$$" + texcode + "$$";
                    } else {
                        P.outerHTML = "$" + texcode + "$";
                    }
                }
            }
            var its = container.querySelectorAll("i");
            for (var it of its) {
                it.outerHTML = it.innerText;
            }

            var subs = container.querySelectorAll("sub");
            for (var sub of subs) {
                sub.outerHTML = "_{" + sub.innerText + "}";
            }

            var sups = container.querySelectorAll("sup");
            for (var sup of sups) {
                sup.outerHTML = "^{" + sup.innerText + "}";
            }

            var edits = document.getElementsByClassName("mw-editsection");
            for (var ed of edits) {
                ed.parentNode.removeChild(ed);
            }

            var ems = container.querySelectorAll("em");
            for (var em of ems) {
                em.outerHTML = em.innerText;
            }
            Copy(container);
        }

        //ketex （Hexo）
        if (ketex.test(webSite)) {
            container = document.querySelector("#post-content");
            matches = container.querySelectorAll("annotation");
            for (M of matches) {
                P = M.closest("div.katex-wrap");
                if (P != null) {
                    P.outerHTML = "$$" + M.innerHTML + "$$";
                } else {
                    P = M.closest("span.katex");
                    P.outerHTML = "$" + M.innerHTML + "$";
                }
            }
            Copy(container);
        }

        //ketex （Hexo）
        if (ketex1.test(webSite)) {
            container = document.querySelector(".container");
            matches = container.querySelectorAll("annotation");
            for (M of matches) {
                P = M.closest("span.katex-display");
                if (P != null) {
                    P.outerHTML = "$$" + M.innerHTML + "$$";
                } else {
                    P = M.closest("span.katex");
                    P.outerHTML = "$" + M.innerHTML + "$";
                }
            }
            Copy(container);
        }

        if (cnblogs.test(webSite)) {
            var mathjax = document.querySelectorAll(
                ".MathJax_Display, .theme_next_mathjax_display"
            );
            for (var math of mathjax) {
                var   formula = math.nextElementSibling.innerText.trim();

                math.innerHTML = "<br/>$$<br/>" + htmlencode(formula) + "<br/>$$<br/>";
            }

            mathjax = document.querySelectorAll(".MathJax");
            for (math of mathjax) {
                formula = math.nextElementSibling.innerText.trim();
                math.outerHTML = "$" + htmlencode(formula) + "$";
            }
            container = document.querySelector("#cnblogs_post_body");

            if (container != undefined) {
                container.insertBefore(
                    document.getElementsByClassName("postTitle")[0],
                    container.children[0]
                );
                Copy(container);
            }
        }

        var encyomath = /encyclopediaofmath/i;
        if (encyomath.test(webSite)) {
            convmath()
            container = document.querySelector("#InnerContent");

            if (container != undefined) {

                Copy(container);
            }


        }

        var rewiley = /wiley/i;
        if (rewiley.test(webSite)) {
            deleteElementsByClassName([
                "fixedCoolBar",
                "pb-dropzone",
                "doi-access-container clearfix",
                "figure-extra",
                "icon-mail_outline"])

            var reference=document.getElementsByClassName("accordion__content")[0]
            reference.style="display: block;"



            var thms=Array.from(document.querySelectorAll("div.mathStatement"))
            thms.forEach(thm=>{
                var thmid=thm.id
                thm.insertAdjacentHTML("afterend",`<br/> ^${thmid}`)
                refs=Array.from(document.querySelectorAll(`[href='#${thmid}']`))
                refs.forEach(ref=>{
                    ref.outerHTML=`[[#^${thmid}|${ref.innerText}]]`
                })

            })

            var secs=Array.from(document.querySelectorAll("section>h2[class~='article-section__title']"))
            secs.forEach(tit=>{
                var sec=tit.parentElement
                var secid=sec.id
                tit.insertAdjacentHTML("afterend", `<br/> ^${secid}`)
                refs=Array.from(  document.querySelectorAll(`[href='#${secid}']`))
                refs.forEach(ref=>{
                    ref.outerHTML=`[[#^${secid}|${ref.innerText}]]`
                })

            })


            var bibs=Array.from(document.querySelectorAll("li[data-bib-id]"))

            bibs.forEach(li=>{
                var linum=li.querySelector(".bullet")
                var refid=li.getAttribute("data-bib-id")
                var extralk=li.querySelector(".extra-links")
                if (extralk!=null){
                    var href=extralk.querySelector("A").href
                    linum.innerText=` [ [${linum.innerText}]. ](${href})`
                }
                var numhtm=linum.outerHTML
                extralk.outerHTML=""
                linum.outerHTML=""
                li.innerHTML=numhtm+li.innerText+`<br/> ^${refid}<br/>`
                refs=Array.from(  document.querySelectorAll(`[href='#${refid}']`))
                refs.forEach(ref=>{
                    ref.outerHTML=` [[#^${refid}|${ref.innerText}]]`
                })
                    })




            var fms=Array.from(document.querySelectorAll("div.inline-equation"));
            fms.forEach(fm=>{
                var mathml=fm.querySelector("script[type='math/mml']").innerText
                fm.innerHTML= `<p><br/>\`\`\`ad-equation<br/>$$<br/><span>${MathML2LaTeX.convert(mathml)}</span><br/>$$<br/>\`\`\`<br/></p>`;
            })

            var maths=Array.from(document.querySelectorAll("script[type='math/mml']"))
            maths.forEach(math => {
                try{
                    var mathml=math.innerText
                    var mathp=math.previousElementSibling
                    mathp.previousElementSibling.outerHTML=""
                    mathp.outerHTML=  `<span >\$${MathML2LaTeX.convert(mathml).trim()}\$</span>`;
                    math.outerHTML=""}
                catch(error){
                    console.log("Math convert error:"+mathml)
                }
            })

            target = document.querySelector("#article__content")
            Copy(target);
            if (target != null) {
                Copy(target);
            }


        }


        //degruyter



        var degruyter=/degruyter/

        if (degruyter.test(webSite)) {

            document.getElementById("ccc").outerHTML=""


            convmath()





        }




        //sciencedirect=====================================================================
        var reSD = /sciencedirect/i;
        if (reSD.test(webSite)) {
            deleteElementsByClassName([
                "rights-and-content",
                "sr-only",
                "author-ref",
                "Copyright",
                "anchor-text",
            ]);
            var bar = document.getElementById("author-group");
            var authors = bar.children;
            var authorNames = "";
            for (let author of authors) {
                var Author = author.querySelector("span");
                authorNames =
                    authorNames +
                    Author.children[0].innerText +
                    " " +
                    Author.children[1].innerText +
                    ", ";
            }
            bar.innerHTML = authorNames.slice(0, -2);
            deleteElementsById([
                "issue-navigation",
                "toc-outline",
                "publication",
                "show-more-btn",
            ]);




            // 开始处理定理类结构===============================================
            getobid=(ob)=>{
                id=ob.parentElement.id
                return id
            }



            var movecite=(obj)=>{
                // 若定理标题下面有文献引用，将其移至标题后
                // if (obj.nextElementSibling!=null){
                var cites=obj.parentElement.querySelectorAll("span>h2")
                if (cites.length>0){
                    obj.insertAdjacentHTML("afterend",` (${cites[0].innerHTML}) `)
                    cites[0].outerHTML=""
                }
                // }
                // 检验定理正文中是否开头用(...[1]...)这类的文献引用，若有，移至标题后
                var sec=obj.parentElement.parentElement
                var thmhead=sec.children[0]
                var thmbody=sec.children[1]
                var nds=[...(thmbody.childNodes)]
                if (nds[0].textContent[0]=="("){
                    var fnd=nds.find(nd=>{
                        Array.from(nd.textContent).find(x=>x==")")!=undefined
                    })
                    if(fnd!=undefined){
                        var ind=nds.indexOf(fnd)
                        var nds1=nds.slice(0,ind)
                        thmhead.insertAdjacentText("beforeend"," ")
                        nds1.forEach(x=>{
                            var temp=(x.wholeText==undefined)?x.outerHTML:x.wholeText
                            thmhead.insertAdjacentHTML("beforeend",temp)
                            thmbody.removeChild(x)
                        })
                        var mch=nds[ind].textContent.match(/([^\(]+\)[\.]{1}\s*)(.*)/)
                        thmbody.removeChild(nds[ind])
                        thmhead.insertAdjacentHTML("beforeend",mch[1])
                        thmbody.insertAdjacentHTML("beforebegin",mch[2])
                    }
                }
            }

            obp=(obj,id)=>{
                var tid=id.replace(".","-")
                var sec=obj.parentElement.parentElement
                var thmhead=sec.children[0]
                //console.log(obj.innerText+"test:"+isThm(obj))
                if (isThm(obj)){
                    var thmbody=sec.children[1]
                    movecite(obj)
                    // 除去定理中的斜体
                    var ems=thmbody.querySelectorAll("em")
                    ems.forEach(em=>{
                        em.outerHTML=em.innerHTML
                    })
                    // 将标题段与定理正文合并
                    var   thmtitle=obj.innerText.match(/^(\w+)/)[1].toLowerCase()
                    thmbody.innerHTML= `<br/>\`\`\`ad-${thmtitle}<br/><span>title:${thmhead.innerHTML}</span><br/><span>${thmbody.innerHTML}<br/></span>\`\`\`<br/> ^${tid}<br/>`;
                    thmhead.outerHTML=""
                }
                // if (isPrf(obj)){
                //     var proofbody=sec
                //     thmhead.outerHTML=""
                //     thmbody.innerHTML= `<br/>\`\`\`ad-${obj.innerText}<br/><span>${thmbody.innerHTML}<br/></span>\`\`\`<br/>`;
                // }

                //console.log(obj.innerText+"over")
            }

            CR_obj_processor("section>p>strong", obp, refp, getobid)
            //处理定理类结构结束==============================================




            //处理文献引用开始==============================================

            var getobid=(ob)=>{
                return ob.previousElementSibling.children[0].id.slice(7)
            }


            var obp=(obj,id)=>{
                var ReferenceLinks=obj.getElementsByClassName("ReferenceLinks")
                var link=undefined
                if (ReferenceLinks.length>0){
                    link=ReferenceLinks[0].getElementsByTagName("A")[0]
                    ReferenceLinks[0].outerHTML=""}
                var label=document.getElementById(`ref-id-${id}`)
                if (link!=undefined){
                    label.outerHTML=`[[${label.innerText.replace(/\[|\]/g,"")}].](${link.href})`
                }else{
                    label.outerHTML=`[${label.innerText.replace(/\[|\]/g,"")}]. `
                }
                obj.innerHTML=obj.innerHTML+`<br/>^${id}`
            }

            var objselector="dd[class='reference']"
            CR_obj_processor(objselector, obp, refp, getobid)
            //处理文献引用结束==============================================


            //处理图表引用开始==============================================
            getobid=(ob)=>{
                id=ob.parentElement.id
                return id
            }

            refp=(ob,id)=>{
                refs=document.querySelectorAll(`a[name=b${id}`)
                refs.forEach(ref=>{
                    ref.outerHTML=` [[#^${id}|${ref.innerText}]] `
                })
                    }

                    obp=(obj,id)=>{
                        var links=obj.getElementsByClassName("links-for-figure")[0]
                        links.outerHTML=""
                        var caption=obj.getElementsByClassName("captions")[0]
                        caption.insertAdjacentHTML("beforeend","<br/> ^"+id)
                        var img=  obj.getElementsByTagName("img")[0]
                        img.insertAdjacentHTML("afterend","<br/>"+caption.outerHTML)
                        caption.outerHTML=""
                    }

                    CR_obj_processor("figure", obp, refp, getobid)
            //处理图表引用结束==============================================


            //处理章节引用开始==============================================
            obp=(obj,id)=>{
                obj.insertAdjacentHTML("afterend", `<br/> ^${id}<br/>`)
            }
            CR_obj_processor("section>h2", obp, refp, getobid)
            //处理章节引用结束==============================================






            //处理数学公式开始==============================================

            // sub_em2tex()

            convmath()


            //处理数学公式结束==============================================




            container = document.querySelector("article");

            if (container != undefined) {
                Copy(container);
            }

        }
        //     处理arxiv-vanity网站=====================================================================
        var rearxvan = /arxiv-vanity/;
        if (rearxvan.test(webSite)) {
            authors=document.querySelectorAll("[class*='ltx_personname']")
            authors.forEach(author=>{author.outerHTML=`<br/> ${author.outerHTML} <br/>`})


            var equations=document.querySelectorAll("[class*='ltx_eqn_table']")
            equations.forEach(equ=>{
                var texs=equ.querySelectorAll("[aria-label]")
                var tex=""
                if (texs.length>0){
                    tex=texs[0].getAttribute("aria-label")
                }
                tex=tex.replace(/\s*(?<!\\)%\s*/g," ")
                var tags=equ.querySelectorAll("[class*='ltx_tag']")
                if (tags.length>0){
                    var tag=tags[0].innerText.replace(/\(|\)/,"")
                    equ.outerHTML=`<br/>$$<br/>${tex}     \\tag{${tag}}<br/>$$<br/>`
                }
                else{
                    if (tex!=""){
                        equ.outerHTML=`<br/>$$<br/>${tex}<br/>$$<br/>`
                    }
                        }
            })
            maths=document.querySelectorAll("[aria-label]")
            maths.forEach(math=>{
                math.outerHTML=`$${math.getAttribute("aria-label")}$`})

            bibs=Array.from(document.querySelectorAll("li[class='ltx_bibitem']"))


            bibs.forEach(li=>{
                var linum=li.querySelector(".ltx_tag_bibitem")
                var refid=li.id
                linum.outerHTML=linum.innerText+"."
                li.innerHTML=li.innerText+`<br/> ^${refid.replace("bib.","").replace(" ", "")}<br/>`
                refs=Array.from(document.querySelectorAll(`[href='#${refid}']`))
                refs.forEach(ref=>{
                    ref.outerHTML=` [[#^${refid.replace("bib.","")}|${ref.innerText}]]`
                })
            })
            target = document.querySelector("article")
            if (target != undefined) {
                Copy(target);
            }

        }


        //     处理ar5iv.org网站=====================================================================
        var ar5iv = /ar5iv/;
        if (ar5iv.test(webSite)) {

            authors=document.querySelectorAll("[class*='ltx_personname']")
            authors.forEach(author=>{author.outerHTML=`<br/> ${author.outerHTML} <br/>`})
            equations=document.querySelectorAll("mjx-container")
            equations.forEach(equ=>{
                if(equ.parentElement.tagName!="TD"){
                    equ.outerHTML=`$${equ.querySelector("math").getAttribute("alttext")}$`
                }else{
                    equ.outerHTML=equ.querySelector("math").getAttribute("alttext").replace(/\s*\\displaystyle/g,"")
                }
                    })


                    tags=document.querySelectorAll("[class*='ltx_eqn_eqno']")
                    tags.forEach(tag=>{
                        tag.outerHTML=` \\tag{${tag.innerText.trim().slice(1,-1)}}`
            })



                    tags=document.querySelectorAll("[class*='ltx_eqn_center_padright']")
                    tags.forEach(tag=>{
                        tag.outerHTML=""
                    })

                    tags=document.querySelectorAll("[class*='ltx_eqn_center_padleft']")
                    tags.forEach(tag=>{
                        tag.outerHTML=""
                    })

                    var items=document.querySelectorAll("[class*='ltx_align_center']")
                    items.forEach(item=>{
                        item.outerHTML=`${item.innerText.trim()}`
            })

                    items=document.querySelectorAll("[class*='ltx_align_left']")
                    items.forEach(item=>{
                        item.outerHTML=`${item.innerText.trim()}`
            })

                    items=document.querySelectorAll("[class*='ltx_align_right']")
                    items.forEach(item=>{
                        item.outerHTML=`${item.innerText.trim()}`
            })




                    var tables=document.querySelectorAll("[class*='ltx_eqn_table']")

                    tables.forEach(table=>{
                        let formulaid=table.id
                        let rows=table.querySelectorAll("tr")
                        let lstrow=[...rows].slice(-1)[0]
                        if(rows.length>1){
                            lstrow.outerHTML=`&${lstrow.innerText.trim()}`
                }else{
                    lstrow.outerHTML=`${lstrow.innerText.trim()}`
                }

                [...rows].slice(0,-1).forEach(row=>{
                    row.outerHTML=`&${row.innerText.trim()}\\\\<br/>`
                })

                var formbody=""

                if(rows.length>1){
                    formbody=`<br/>$$<br/>\\begin{aligned}${table.innerText.trim()}\\end{aligned} <br/>$$<br/>`
                }else{
                    formbody=`<br/>$$<br/>${table.innerText.trim()}<br/>$$<br/>`
                }

                if(formbody.search("tag")!=-1){
                    table.outerHTML=`<br/>\`\`\`ad-equation${formbody}\`\`\`<br/> ^${formulaid.replace(".","")}<br/><br/>`;
                    refs=Array.from(document.querySelectorAll(`[href='#${formulaid}']`))
                    refs.forEach(ref=>{
                        ref.outerHTML=` [[#^${formulaid.replace(".","")}|${ref.innerText}]]`
                    })

                }else{
                    table.outerHTML=formbody
                }


            })

                    bibs=Array.from(document.querySelectorAll("li[class='ltx_bibitem']"))


                    bibs.forEach(li=>{
                        var linum=li.querySelector(".ltx_tag_bibitem")
                        var refid=li.id
                        linum.outerHTML=linum.innerText+"."
                        li.innerHTML=li.innerText+`<br/> ^${refid.replace("bib.","").replace(" ", "")}<br/>`
                refs=Array.from(document.querySelectorAll(`[href='#${refid}']`))
                refs.forEach(ref=>{
                    ref.outerHTML=` [[#^${refid.replace("bib.","")}|${ref.innerText}]]`
                })
            })


                    target = document.querySelector("article")
                    if (target != undefined) {
                        Copy(target);
                    }
                }




        //     处理Springer网站=====================================================================
        var reSP = /springer/;
        if (reSP.test(webSite)) {


            tags="tags: "+Array.from(document.getElementsByClassName("c-article-subject-list__subject")).map(x=>x.innerText.replace(" ","")).join(" ")+""
            frantmatter = "---" + "<br/>" + tags +"<br/>" +"---" + "<br/>";
            //             var bak=document.getElementById("Ack1-section")
            //             var Acks=NextSiblings(bak.parentElement)
            //             Acks.forEach(x=>x.outerHTML="")
            //             var xts = Array.from(document.querySelectorAll("article i"));
            //             xts.forEach((x) => {
            //                 var text = x.innerText;
            //                 if (text.length == 1) x.outerHTML = "$" + text.trim() + "$";
            //             });


            //处理数学公式开始==============================================

            sub_em2tex()

            convmath()


            //处理数学公式结束==============================================


            //处理文献引用开始==============================================

            var bibobjs= document.querySelectorAll("[class*=c-article-references__item]")
            bibobjs.forEach(bib=>{
                var   bibtext=bib.querySelector("[class*=c-article-references__text]")
                var  biblink=bib.querySelector("[class*=c-article-references__links]")
                var   bibhref=biblink!=null?biblink.children[0].href:""
                bibtext=bib.querySelector("[class*=c-article-references__text]")
                bib.outerHTML=`[[${[...bibobjs].indexOf(bib)+1}].](${bibhref})    ${bibtext.innerText} <br/> ^${bibtext.id.trim()}<br/><br/>`
            })
            //处理文献引用链接
            var  bibrefs=document.querySelectorAll("a[data-track-action='reference anchor']")
            bibrefs.forEach(ref=>{
                var bibobj=ref.href.split("#")[1]
                var num=ref.innerText
                ref.outerHTML=` [[\#^${bibobj}|${num}]] `
            })
            //处理文献引用结束==============================================

            //处理章节或定理引用链接
            var  secrefs=document.querySelectorAll("a[data-track-action='subsection anchor']")
            secrefs.forEach(ref=>{
                var secobj=ref.href.split("#")[1]
                var num=ref.innerText
                ref.outerHTML=`[[\#^${secobj}|${num}]]`
            })
            //处理章节引用结束==============================================

            //处理定理主体标签
            var  secobjs=document.querySelectorAll(".c-article__sub-heading")
            secobjs.forEach(sec=>{
                if(isThm(sec)){
                    sec.insertAdjacentHTML("beforeend","<br/> ^"+"b"+sec.id.replace(".","-")+"<br/>")
                }
            })



            deleteElementsByClassName([
                "c-article__pill-button",
                "c-article-references__links",
                "c-article-references__download"
            ]);
            var authorlist=document.querySelector("[class*=c-article-author-list],[class*=authors__title]")
            authorlist.outerHTML=authorlist.outerText


            var titles=new Set(["Author information","Acknowledgements","Additional information","Rights and permissions","About this article"])
            secs=document.querySelectorAll("section[data-title]")
            secs.forEach(sec=>{
                var title=sec.getAttribute("data-title")
                if (titles.has(title)){
                    sec.outerHTML=""
                }

            })

            setTimeout(()=>{
                target = document.querySelector("article")
                target.insertAdjacentHTML("afterbegin",frantmatter)
                if (target != undefined) {
                    Copy(target);
                    console.log("拷贝完成")
                }
                console.log("处理完成")
            }, 150);


        }

        var agedcat = /agedcat\.com\/math/;

        if (agedcat.test(webSite)) {



            maths=document.querySelectorAll("script[type='math/tex; mode=display']")
            maths.forEach(math=>{
                var tex=math.innerHTML.trim()
                var  span=math.previousSibling
                span.outerHTML=`<br/>$$<br/>${tex}<br/>$$<br/>`
            })

            maths=document.querySelectorAll("script[type='math/tex']")
            maths.forEach(math=>{
                var tex=math.innerHTML.trim()
                var span=math.previousSibling
                span.outerHTML=` $${tex}$ `
            })


            target = document.querySelector("#article")
            if (target != undefined) {
                Copy(target);
            }
        }


        var reNJ = /tcs\.nju\.edu\.cn\/wiki/;

        if (reNJ.test(webSite)) {

            maths=document.querySelectorAll("dd>span>script[type='math/tex']")
            maths.forEach(math=>{
                var tex=math.innerHTML.trim()
                var  span=math.parentElement
                var dd=span.parentElement
                var otL=dd.innerText.length-span.innerText.length
                if(otL<3){
                    span.outerHTML=`<br/>$$<br/>${tex}<br/>$$<br/>`
                }else{
                    span.outerHTML=` $${tex}$ `
                }
            })
            maths=document.querySelectorAll("script[type='math/tex']")
            maths.forEach(math=>{
                var tex=math.innerHTML.trim()
                var span=math.parentElement
                span.outerHTML=` $${tex}$ `
            })


            target = document.querySelector("#content")
            if (target != undefined) {
                Copy(target);
            }
        }

        //微信公众=====================================================================
        var reWX=/mp\.weixin\.qq\.com/
        if (reWX.test(webSite)) {
            imgs = document.querySelectorAll("[data-formula]");

            for ( img of imgs) {
                if (img.getAttribute("data-formula-type") == "block-equation") {
                    img.outerText =
                        "\n$$\n" + img.getAttribute("data-formula").trim() + "\n$$\n";
                }

                if (img.getAttribute("data-formula-type") == "inline-equation") {
                    img.outerText = "$" + img.getAttribute("data-formula").trim() + "$";
                }
            }

            container = document.querySelector("#page-content");
            if (container != undefined) {
                Copy(container);
            }
        }

        //CSDN=====================================================================
        // alert("替换图像为其相关的tex")

        var reCSDN = /csdn/i;
        if (reCSDN.test(webSite)) {

            maths = document.querySelectorAll("span[class='katex--inline']");
            maths.forEach(math=>{
                var tex=math.querySelector("span[class='katex-mathml']").innerText
                math.outerHTML=`$${tex}$`
    })

            maths = document.querySelectorAll("span[class='katex--display']");
            maths.forEach(math=>{
                var tex=math.querySelector("span[class='katex-mathml']").innerText
                math.outerHTML=`<br/>$$<br/>${tex}<br/>$$<br/>`
    })

            container = document.querySelector("article");
            if (container != undefined) {
                Copy(container);
            }


            // alert("替换图像为其相关的tex")
            /*     container = document.querySelector("#article_content");
    if (container == null) {
        container = document.querySelector("article");
    }
    matches = container.querySelectorAll("annotation");
    for (M of matches) {
        P = M.closest("span.katex-display");
        texcode = M.innerHTML;
        // texcode = texcode.replace(new RegExp("&amp;" + "#" + "x27;", "g"), "'")
        if (P != null) {
            texcode = texcode.trim().replace(/^\\\[|^\\\(|\\\)$|\\\]$/g, "");
            P.outerHTML = "<br/>$$<br/>" + texcode + "<br/>$$<br/>";
        } else {
            P = M.closest("span.katex--inline");
            if (P == null) {
                P = M.closest("span.katex");
            }
            if (P != null) {
                texcode = texcode.trim().replace(/^\\\[|^\\\(|\\\)$|\\\]$/g, "");
                P.outerHTML = "&nbsp;$" + texcode + "$&nbsp;";
            }
        }
    } */

        }

        GM_notification({
            title: "棒棒的!",
            text: "转换完成, 数据已复制到剪切板，可粘贴到Typora中进行编辑整理， 认真学习呀！",
        });
    }

    CovertFunc();
    convmath();

}




document.getElementById("bt2").addEventListener("click", func2, false);


//=================================================================================================================


function func3() {
    //     var cell = IPython.notebook.get_selected_cell();
    //     var out1=cell.output_area.outputs[0]
    //     if(out1==undefined){
    //         alert("请先选中带有输出的 Cell")
    //         return
    //     }
    //     var divContents
    //     if (Object.keys(out1.data).includes("text/html")){
    //         divContents = out1.data["text/html"]
    //     }
    //     else if(Object.keys(out1.data).includes("text/plain")){
    //         divContents = out1.data["text/plainl"]

    //     }
    //     else if(Object.keys(out1.data).includes("image/png")){
    //         divContents ="<img  src='data:image/png;base64,"+out1.data["image/png"]+"'/>";

    //     }
    var divContents, nbs, output;
    try {
        var cell = IPython.notebook.get_selected_cell();
        var out1 = cell.output_area.outputs[0];
        if (out1 == undefined) {
            alert("请先选中带有输出的 Cell");
        }
        if (Object.keys(out1.data).includes("text/html")) {
            divContents = out1.data["text/html"];
        } else if (Object.keys(out1.data).includes("text/plain")) {
            divContents = out1.data["text/plainl"];
        } else if (Object.keys(out1.data).includes("image/png")) {
            divContents =
                "<img  src='data:image/png;base64," + out1.data["image/png"] + "'/>";
        }
    } catch (e) {
        if (e instanceof ReferenceError) {
            nbs = document.querySelectorAll(".jp-Activity");
            for (var nb of nbs) {
                output = nb.querySelector(".jp-mod-selected");
                if (output != null) {
                    divContents = output.querySelector(".jp-OutputArea-output").outerHTML;
                }
            }
        }
    }

    var head = `
<html>
<head>
<meta charset="UTF-8">
<script type="text/javascript"
src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
<style>
body {
color:black
}
.MathJax {color: "#CCCCCC";}
h1 {
text-align:center;
}
table {
margin-left:auto;
margin-right:auto;
border: 2px solid #CCCCCC;
}
thead tr {
background:#8AB512;
color:#FFF;
}

tbody tr:nth-child(even) {
background:#FFF;
border:0px;
color:#000;
}
tbody tr:nth-child(odd) {
background:#DFE7C0;
}
</style>
</head>
`;
    var filename = document.title + "的输出结果";
    alert("ok");
    var htmlbody =
        head +
        "<body > <h1>" +
        filename +
        '</h1> <br><p style="text-align:center;">' +
        divContents +
        "</p></body></html>";

    download(htmlbody, filename + ".html", "text/html");
}

document.getElementById("bt3").addEventListener("click", func3, false);

function func4() {
    navigator.clipboard.readText().then(function(tikz) {
        if (tikz!=null) {
            var templete=`<!doctype html>
<html lang=en>
<head>
<meta charset=utf-8>
<link rel="stylesheet" type="text/css" href="https://tikzjax.com/v1/fonts.css">
<script src="https://tikzjax.com/v1/tikzjax.js"></script>
<body>
<script type="text/tikz">
${tikz}
</script>
</body>
</html>`
            var file = new Blob([templete], { type: "text/html" });
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            document.body.appendChild(a);
            a.click();
        }
    });
    window.open(url,"_self")
}

document.getElementById("bt4").addEventListener("click", func4, false);

// function func5() {
//     var svg=document.querySelector("svg")
//     var fdata=`<?xml version="1.0" standalone="no"?> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd" >
// ${svg.outerHTML}`
//     download(fdata,  "tikz.svg", "text/html");
// }

function func15() {
    var links = Array.prototype.slice
    .call(document.querySelectorAll("a"))
    .filter(function (el) {
        var hostname = new URL(el.href).hostname;
        return hostname == "link.zhihu.com";
    });
    for (var link of links) {
        var regRe = link.href.match(/target=(.+?)(&|$)/);
        if (regRe && regRe.length == 3) {
            link.href = decodeURIComponent(regRe[1]);
        }
    }
}


function func5() {
    var transcript=document.getElementsByTagName("ytd-transcript-renderer")[0];
    var info="没复制成功，请确认内容转文字面板已打开。"
    if (transcript != undefined) {
                Copy(transcript);
        info="YouTube脚本已复制到剪切板！"
            }

        GM_notification({
            title: "棒棒的!",
            text:info,
        });
    }


document.getElementById("bt5").addEventListener("click", func5, false);

function func6() {
    var links = Array.prototype.slice
    .call(document.querySelectorAll("a"))
    .filter(function (el) {
        var hostname = new URL(el.href).hostname;
        return hostname == "link.zhihu.com";
    });
    for (var link of links) {
        var regRe = link.href.match(/target=(.+?)(&|$)/);
        if (regRe && regRe.length == 3) {
            link.href = decodeURIComponent(regRe[1]);
        }
    }
}

document.getElementById("bt6").addEventListener("click", func6, false);





function func9() {
    var range, select;
    var target = document.querySelector("article");
    if (document.createRange) {
        range = document.createRange();
        range.selectNode(target);
        select = window.getSelection();
        select.removeAllRanges();
        select.addRange(range);
        document.execCommand("copy");
        select.removeAllRanges();
    } else {
        range = document.body.createTextRange();
        range.moveToElementText(target);
        range.select();
        document.execCommand("copy");
    }
}

document.getElementById("bt9").addEventListener("click", func9, false);

function func7() {
    var links = document.getElementsByClassName("list-box")[0]
    var md = "#" + document.title + "\n\n";
    for (var link of links) {
        md = md + "\n" + link.innerText + "\n![](" + link.href + ")";
    }
    GM_setClipboard(md);
    alert("ok");
}

document.getElementById("bt7").addEventListener("click", func7, false);

Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
};


function NextSiblings(element) {
    var children = Array.from(element.parentElement.children)
    var del=false;
    for (var i = 0; i < children.length; i++) {
        if (children[i] == element) {
            return children.slice(i)
        }
    }
}


function func8() {
    function clip2obsidian(target){
        var fileContent=target.innerText;
        document.location.href = "obsidian://advanced-uri?vault="+encodeURIComponent("我的知识库")+"&filepath=inbox/test.md&data=" + encodeURIComponent(fileContent)+"&mode=overwrite"
    }
    var target=document.querySelector("#sp0060");

    clip2obsidian(target);
}

document.getElementById("bt8").addEventListener("click", func8, false);

document.onkeyup = function (e) {
    //  var e = e || window.event; // for IE to cover IEs window event-object
    if (e.altKey && e.which == 65) {
        //alt+A
        func2();
    }
};

//       if (/degruyter/.test(window.location.href)) {

//             document.getElementById("ccc").outerHTML=""

//       }

zNode.addEventListener("mouseleave", function () {
    var el = document.getElementById("myContainer");
    el.style.left = "-200px";
    el.style.opacity = ".3";
    var halfbtn = document.getElementById("mybtn");
    halfbtn.style.opacity = ".3";
});

halfbtn.addEventListener("mouseover", function () {
    var el = document.getElementById("myContainer");
    el.style.position = "fixed";
    el.style.left = "0px";
    el.style.bottom = "0px";
    el.style.opacity = "1";
    el.style.borderRightRadius = "12px";
});




