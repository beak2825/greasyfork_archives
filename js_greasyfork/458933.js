// ==UserScript==
// @license MIT
// @name         Misc Stuff
// @namespace    ricroon
// @version      0.0.20
// @description  Misc Stuff for personal
// @author       ricroon
// @grant        none
// @include      https://keylol.com*
// @include      https://store.steampowered.com/widget/*
// @include      *tstorage.info*
// @include      *mmda.booru.org*
// @include      *chan.sankakucomplex.com*
// @include      *footfetishbooru.booru.org*
// @include      *yande.re*
// @include      *gelbooru.com*
// @include      *.18board.*
// @include      *.18p2p.*
// @downloadURL https://update.greasyfork.org/scripts/458933/Misc%20Stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/458933/Misc%20Stuff.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url=window.location.href
    const KEYLOL_REG=/keylol\./;
    const STEAM_WIDGET_REG=/store\.steampowered\.com\/widget\//;
    const MMDA_REG=/mmda\.booru\.org/;
    const SANKAKU_REG=/chan\.sankakucomplex\.com/;
    const FFB_REG=/footfetishbooru\.booru\.org/;
    const R18P2P_REG=/(\.18p2p\.)|(\.18board\.)/;
    const YANDE_REG=/yande\.re/;
    const GELBOORU_REG=/gelbooru\.com/;
    const TSTORAGE_REG=/tstorage\.info/;
    //User agent
    let isMobile=/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    if(KEYLOL_REG.test(url)){
        const TOTAL_PAGE=3;
        const STEAM_LINK_CLASS="steamInfoLink";
        const STEAM_APP_SUB_REG=/store.steampowered.com\/(app|sub)\/(\d+)/;
        const STEAM_WIDGET_REG=/store.steampowered.com\/widget\/(\d+)/;
        const ATTRIBUTE_HAS_WIDGET="s_s_s_s_has_widget";
        const ATTRIBUTE_HAS_WIDGET_VALUE="true";
        let styEle=document.createElement("style");
        styEle.type="text/css";
        if(isMobile){
            styEle.innerHTML="section.threadlist ul li a:visited {color:#1E9943!important;}section.threadlist ul li a.subject:visited div.a{font-weight:bold!important;color:#1E9943!important;}";
        }else{
            styEle.innerHTML="tr th.common a.s.xst:visited {color:#1E9943!important}tr td+th.new a.s.xst:visited {color:#1E9943!important}tr td+th.lock a.s.xst:visited {color:#1E9943!important}tr td.new.fn a.s.xst:visited {color:#1E9943!important}";
            styEle.innerHTML+="tr th.common a.s.xst {color:red!important}tr td+th.new a.s.xst {color:red!important}tr td+th.lock a.s.xst {color:red!important}tr td.new.fn a.s.xst {color:red!important}";
        }
        document.head.appendChild(styEle);
        //highlight to normal
        //link to -1-1
        let highlights=document.getElementsByClassName("s xst");
        for(let i=0;i<highlights.length;++i){
            if(highlights[i].style.length!=0){
                highlights[i].setAttribute("style","font-weight: bold;");
            }else{
                highlights[i].setAttribute("style","");
            }
            highlights[i].href=highlights[i].href.replace(/-[\d]+-[\d]+/,"-1-1");
        }
        //steam widget
        let stinfo=document.getElementsByClassName(STEAM_LINK_CLASS);
        let ifs=document.getElementsByTagName("iframe");
        for(let i=0;i<ifs.length;++i){
            let mat=ifs[i].src.match(STEAM_WIDGET_REG);
            if(mat&&mat.length==2){
                let stpsi=ifs[i].nextElementSibling;
                if(stpsi){
                    let stp=stpsi.nextElementSibling;
                    if(stp){
                        let stinfo=stp.getElementsByClassName(STEAM_LINK_CLASS);
                        if(stinfo.length>0){
                            for(let j=0;j<stinfo.length;++j){
                                stinfo[j].setAttribute(ATTRIBUTE_HAS_WIDGET,ATTRIBUTE_HAS_WIDGET_VALUE);
                            }
                            function findPreLink(ele){
                                if(ele){
                                    let chd=ele.getElementsByClassName(STEAM_LINK_CLASS);
                                    if(ele.tagName=="A"){
                                        let mat2=ele.href.match(STEAM_APP_SUB_REG);
                                        if(mat2&&mat2[1]=="app"&&mat2[2]==mat[1]){
                                            ele.setAttribute(ATTRIBUTE_HAS_WIDGET,ATTRIBUTE_HAS_WIDGET_VALUE);
                                        }
                                    }else if(chd.length>0){
                                        for(let k=0;k<chd.length;++k){
                                            let mat2=chd[k].href.match(STEAM_APP_SUB_REG);
                                            if(mat2[1]=="app"&&mat2[2]==mat[1]){
                                                chd[k].setAttribute(ATTRIBUTE_HAS_WIDGET,ATTRIBUTE_HAS_WIDGET_VALUE);
                                            }
                                        }
                                    }
                                    findPreLink(ele.previousElementSibling);
                                }
                            }
                            findPreLink(ifs[i].previousElementSibling);
                        }
                    }
                }
            }
        }
        for(let i=0;i<stinfo.length;++i){
            if(stinfo[i].getAttribute(ATTRIBUTE_HAS_WIDGET)!=ATTRIBUTE_HAS_WIDGET_VALUE){
                let mat=stinfo[i].href.match(STEAM_APP_SUB_REG);
                if(mat[1]=="app"){
                    stinfo[i].outerHTML=`<br><iframe src="https://store.steampowered.com/widget/`+mat[2]+`/" style="border:none;height:190px;width:100%;max-width:646px;"></iframe><br>`+stinfo[i].outerHTML;
                    //console.log("Add widget!");
                }
            }
        }
        function tidLinkList(){
            this.tids=[];
            this.links=[];
            this.indexOf=function(tid){
                return this.tids.indexOf(tid);
            }
            this.push=function(tid,link){
                let index=this.indexOf(tid);
                if(index>-1){
                    this.links[index].push(link);
                }else{
                    this.tids.push(tid);
                    this.links.push([link]);
                }
            }
            this.linkAt=function(index){
                return this.links[index];
            }
            this.tidAt=function(index){
                return this.tids[index];
            }
            this.length=function(){
                return this.tids.length;
            }
        }
        let ths=document.querySelectorAll(".s.xst");
        let thslink=new tidLinkList();
        for(let i=0;i<ths.length;++i){
            let thread=ths[i];
            let link=thread.href;
            if(link.match(/[a-zA-Z]\d+/)){
                if(/filter=typeid/.test(url)){
                    thslink.push(link.match(/tid=([\d]+)/)[1],thread);
                    thread.href=`/t${thslink.tidAt(i)}-1-1`;
                }else{
                    thslink.push(link.match(/[a-zA-Z]([\d]+)/)[1],thread);
                }
            }
        }
        function pageCheck(rurl){
            return new Promise((resolve)=>{
                jQuery.ajax({url: rurl,type: 'get',success: function(html) {
                    let frEle=document.createElement("frame");
                    frEle.innerHTML=html;
                    let threls;
                    let replink=new tidLinkList();
                    if(isMobile){
                        return;
                    }else{
                        let bm_c=frEle.querySelector(".bm_c");
                        let repsAll=bm_c.querySelectorAll(".bw0_all");
                        for(let i=0;i<repsAll.length;++i){
                            let link=repsAll[i].querySelector("a").href;
                            let tid=link.match(/ptid=([\d]+)&/)[1];
                            replink.push(tid,link);
                        }
                        for(let i=0;i<thslink.length();++i){
                            let index=replink.indexOf(thslink.tidAt(i));
                            if(index>-1){
                                let links=replink.linkAt(index);
                                for(let j=0;j<links.length;++j){
                                    let link=links[j];
                                    thslink.linkAt(i)[0].setAttribute("style",thslink.linkAt(i)[0].getAttribute("style")+"text-decoration:  underline;");//这句话必须在前面，在后面就会失效，因为innerHTML改变了父节点的内容
                                    thslink.linkAt(i)[0].parentNode.innerHTML+=`<a href="${link}" target="_blank" style="color: red; font-weight: bold;margin-left: 3px;text-decoration:  underline;">${j+1}</a>`;
                                }
                            }
                        }
                    }
                    resolve(true);
                }}).fail(function(data){
                    resolve("get url: "+rurl+" failed!");
                }).always(function(){
                    //
                });
            });
        }
        async function perPage(){
            let replayUrl="/forum.php?mod=guide&view=my&type=reply";
            if(isMobile){
                replayUrl="/home.php?mod=space&uid=595672&do=thread&view=me&type=reply&mobile=2";
            }
            let nextPage="&page=";
            for(let i=0;i<TOTAL_PAGE;++i){
                let rurl=replayUrl;
                if(i>0){
                    rurl=replayUrl+nextPage+(i+1);
                }
                const result=await pageCheck(rurl);
            }
        }
        perPage().then(data=>{
            console.log("success");
        }).catch(error=>{
            console.log(error);
        });
    }else if(STEAM_WIDGET_REG.test(url)&&!url.match(/\/sub\/\d+\//)){
        let appid=url.match(/\/\d+\//)[0].replace(/\//g,"");
        let gamePurchase=document.getElementsByClassName("game_purchase_action");
        if(gamePurchase.length>0){
            gamePurchase=gamePurchase[0];
            let form=gamePurchase.getElementsByTagName("form");
            if(form.length>0&&form[0].name!="add_to_wishlist"){
                let sessionid=form[0].sessionid.value;
                let gamePrice=gamePurchase.getElementsByClassName("game_purchase_action_bg")[0].firstElementChild;
                let formWishlist=`
<form name="add_to_wishlist" action="https://store.steampowered.com//api/addtowishlist/" method="POST" target="_blank">
<input type="hidden" name="snr" value="1_5_1100_">
<input type="hidden" name="sessionid" value="`+sessionid+`">
<input type="hidden" name="appid" value="`+appid+`">
<input type="hidden" name="widget" value="1">
</form>`;
                let wishlistButton=`<div class="btn_addtocart">
<a class="btn_addtocart_content" href="javascript:addToWishlist();">
添加至 Steam 愿望单</a>
</div>`;
                gamePrice.outerHTML+=wishlistButton;
                gamePurchase.innerHTML=formWishlist+gamePurchase.innerHTML;
            }else{
                //
            }
        }
    }else if(MMDA_REG.test(url)){
        let styl=document.createElement("style");
        styl.type="text/css";
        styl.innerHTML="a:visited img.s_s_s_border_color{outline:#ff0000 dashed 3px!important}";
        document.head.appendChild(styl);
        if(document.getElementById("post-list")){
            let imgthumbs=document.getElementById("post-list").getElementsByClassName("thumb");
            for(let i=0;i<imgthumbs.length;++i){
                let imglink=imgthumbs[i].firstElementChild.firstElementChild;
                imglink.style="outline:#666 dashed 3px";
                imglink.className="s_s_s_border_color";
            }
        }
    }else if(SANKAKU_REG.test(url)){
        let styl=document.createElement("style");
        styl.type="text/css";
        styl.innerHTML="div.content div span.thumb a:visited img{border:3px dashed #ff0000!important}";
        document.head.appendChild(styl);
        let newImg=document.createElement("img");
        //
        if(document.getElementById("sticky")){
            let imgthumbs=document.getElementById("sticky").nextElementSibling.firstElementChild.children;
            for(let i=0;i<imgthumbs.length;++i){
                imgthumbs[i].firstElementChild.firstElementChild.style.border="3px dashed #ffffff";
            }
        }
        function updateRecm(){
            let recm=document.getElementById("recommendations");
            let recmthumbs;
            if(recm.firstElementChild.tagName=="DIV"){
                recmthumbs=recm.firstElementChild.children;
            }else{
                recmthumbs=recm.children;
            }
            for(let i=0;i<recmthumbs.length;++i){
                if(recmthumbs[i].tagName!="SPAN") break;
                recmthumbs[i].firstElementChild.firstElementChild.style.border="3px dashed #ffffff";
            }
        }
        let recm=document.getElementById("recommendations");
        if(recm){
            recm.addEventListener("DOMNodeInserted",updateRecm);
            updateRecm();
        }
        let highres=document.getElementById("highres");
        if(highres){
            let imageI=document.getElementById("image");
            imageI.style.width="100px";
            imageI.style.height="100%";
            let imageIPar=imageI.parentNode;
            newImg.src=highres.href;
            newImg.style.width="800px";
            newImg.style.height="100%";
            newImg.style.border="3px dashed #ff0000";
            imageI.style.border="3px dashed #ff0000";
            imageIPar.parentNode.appendChild(newImg);
        }
    }else if(FFB_REG.test(url)){
        let styl=document.createElement("style");
        styl.type="text/css";
        styl.innerHTML="span.thumb a:visited img{border:3px dashed #FFEE00!important}div#note-container{width:800px}img#image{width:100%}";
        document.head.appendChild(styl);
        if(document.getElementById("post-list")){
            let contents=document.getElementById("post-list").getElementsByClassName("thumb");
            for(let i=0;i<contents.length;++i){
                let pic=contents[i].firstElementChild.firstElementChild;
                pic.style="border:3px dashed #2a2a2a";
            }
        }
    }else if(R18P2P_REG.test(url)){
        let adv=document.getElementById("floatAdv");
        if(adv){
            adv.parentNode.removeChild(adv);
        }
        let sty=document.createElement("style");
        sty.type="text/css";
        sty.innerHTML="table.tableborder .altbg2 a:visited{color:EE5023!important}";
        document.head.appendChild(sty);
        let main=document.getElementsByClassName("altbg1");
        for(let i=0;i<main.length;++i){
            if(main[i].tagName.toLowerCase()=="td"){
                main=main[i];
                break;
            }
        }
        let imgs=document.querySelectorAll("img");
        for(let i=0;i<imgs.length;++i){
            if(/^http:\/\/https\/\//.test(imgs[i].src)){
                imgs[i].src=imgs[i].src.replace(/^http:\/\/https\/\//,"https://");
            }
            //console.log(imgs[i].src);
        }
    }else if(YANDE_REG.test(url)){
        let lists=document.getElementById("post-list-posts");
        if(lists){
            let styl=document.createElement("style");
            styl.type="text/css";
            styl.innerHTML="div.inner a.thumb:visited img{border:3px dashed #FFEE00!important}";
            document.head.appendChild(styl);
            let thumbs=document.getElementsByClassName("thumb");
            for(let i=0;i<thumbs.length;++i){
                let pic=thumbs[i].firstElementChild;
                pic.style="border:3px dashed #222;max-height:144px;max-width:144px";
            }
        }
        let highres=document.getElementById("png");
        if(!highres){
            highres=document.getElementById("highres");
        }
        if(highres){
            let newImg=document.createElement("img");
            let imageI=document.getElementById("image");
            imageI.style.width="100px";
            imageI.style.height="100%";
            let imageIPar=imageI.parentNode;
            newImg.src=highres.href;
            newImg.style.width="800px";
            newImg.style.height="100%";
            newImg.style.border="3px dashed #ff0000";
            imageI.style.border="3px dashed #ff0000";
            imageIPar.appendChild(newImg);
        }
    }else if(GELBOORU_REG.test(url)){
        let image=document.getElementById("image");
        image.style="height:100%;";
        let styl=document.createElement("style");
        styl.type="text/css";
        styl.innerHTML="img#image{width:150px!important;}";
        document.head.appendChild(styl);
        let taglist=document.getElementById("tag-list");
        if(taglist){
            let links=taglist.getElementsByTagName("a");
            for(let i=0;i<links.length;++i){
                if(links[i].textContent.toLowerCase()=="original image"){
                    let orgImg=document.createElement("img");
                    orgImg.src=links[i].href;
                    orgImg.style="height:100%;width:750px;";
                    image.outerHTML+=orgImg.outerHTML;
                    break;
                }
            }
        }
    }else if(TSTORAGE_REG.test(url)){
        let sty=document.createElement("style");
        sty.type="text/css";
        sty.innerHTML="div.link a:visited{color:EE5023!important}";
        document.head.appendChild(sty);
    }
})();