// ==UserScript==
// @name               e-hentai Scroll Mode
// @name:zh-TW         e-hentai 滾動模式
// @name:zh-CN         e-hentai 滚动模式
// @name:ja            e-hentai スクロールモード
// @namespace          https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @description        Scroll to browsing e-hentai's art.
// @description:zh-TW  在 e-hentai 滾動卷軸持續瀏覽
// @description:zh-CN  在 e-hentai 滚动卷轴持续浏览
// @description:ja     e-hentaiスクロールスクロールでブラウジングを続ける
// @copyright          2019, HrJasn (https://greasyfork.org/zh-TW/users/142344-jasn-hr)
// @license            GPL3
// @license            Copyright HrJasn
// @version            3.0.5
// @icon               https://www.google.com/s2/favicons?domain=e-hentai.org
// @match              http*://e-hentai.org/s/*
// @match              http*://exhentai.org/s/*
// @exclude            http*://www.e-hentai.org/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/438066/e-hentai%20Scroll%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/438066/e-hentai%20Scroll%20Mode.meta.js
// ==/UserScript==

(() => {
    const scrollMode_DIV = document.body.appendChild(document.createElement("div"));
    scrollMode_DIV.style = "z-index:999;position:fixed;cursor:pointer;left:0px;width:100%;height:0px;top:" + window.innerHeight + "px;-webkit-overflow-scrolling:touch;overflow-y:scroll;background-color:gray;transition:all 0.5s ease 0.5s;";
    let ImgJsonArr = [];

    let mainImage = document.querySelector('#img').parentNode;
    let PrevBtn = document.querySelector('a[href *= "/s/"] > img[src *= "/p.png"]').parentNode;
    let NextBtn = document.querySelector('a[href *= "/s/"] > img[src *= "/n.png"]').parentNode;
    mainImage.querySelector('img').setAttribute("pageurl",window.location.href);
    ImgJsonArr.push({
        'pageurl' : window.location.href,
        'mainImage' : mainImage,
        'PrevBtn' : PrevBtn,
        'NextBtn' : NextBtn
    });
    function LoadBeforeImageToJsonArr(cnImg){
        fetch(cnImg.href).then(async (res)=>{
            return [res.url, await res.text()];
        }).then((res)=>{
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(res[1], "text/html");
            const mImg = htmlDocument.documentElement.querySelector('#img').parentNode;
            const pImg = htmlDocument.documentElement.querySelector('a[href *= "/s/"] > img[src *= "/p.png"]').parentNode;
            const nImg = htmlDocument.documentElement.querySelector('a[href *= "/s/"] > img[src *= "/n.png"]').parentNode;
            mImg.querySelector('img').setAttribute("pageurl",res[0]);
            ImgJsonArr.unshift({
                'pageurl' : res[0],
                'mainImage' : mImg,
                'PrevBtn' : pImg,
                'NextBtn' : nImg
            });
            //console.log('Update ImgJsonArr: ', ImgJsonArr);
            if(pImg.href != cnImg.href){
                LoadBeforeImageToJsonArr(pImg);
            };
        });
    };
    LoadBeforeImageToJsonArr(PrevBtn);
    function LoadAfterImageToJsonArr(cnImg){
        fetch(cnImg.href).then(async (res)=>{
            return [res.url, await res.text()];
        }).then((res)=>{
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(res[1], "text/html");
            const mImg = htmlDocument.documentElement.querySelector('#img').parentNode;
            const pImg = htmlDocument.documentElement.querySelector('a[href *= "/s/"] > img[src *= "/p.png"]').parentNode;
            const nImg = htmlDocument.documentElement.querySelector('a[href *= "/s/"] > img[src *= "/n.png"]').parentNode;
            mImg.querySelector('img').setAttribute("pageurl",res[0]);
            ImgJsonArr.push({
                'pageurl' : res[0],
                'mainImage' : mImg,
                'PrevBtn' : pImg,
                'NextBtn' : nImg
            });
            //console.log('Update ImgJsonArr: ', ImgJsonArr);
            if(nImg.href != cnImg.href){
                LoadAfterImageToJsonArr(nImg);
            };
        });
    };
    LoadAfterImageToJsonArr(NextBtn);
    function reSizeElmtFlwWidthIfScl(Elmt,scale = 0.75){
        Elmt.style.maxWidth = "";
        Elmt.style.maxHeight = "";
        let Elmt_originalWidth = Elmt.offsetWidth;
        let Elmt_originalHeight = Elmt.offsetHeight;
        Elmt.setAttribute("originalWidth",Elmt_originalWidth);
        Elmt.setAttribute("originalHeight",Elmt_originalHeight);
        Elmt.style.width = "100%";
        Elmt.style.height = (Elmt_originalHeight*Elmt.offsetWidth)/Elmt_originalWidth + "px";
        if( (Elmt.offsetWidth*scale > Elmt_originalWidth) || (Elmt.offsetheight*scale > Elmt_originalHeight) ){
            Elmt.style.width = Elmt_originalWidth + "px";
            Elmt.style.height = Elmt_originalHeight + "px";
        };
        return Elmt;
    };
    let lastScrollTop = 0;
    const UpdatescrollMode_DIV = (evnt) => {
        document.body.style.overflow = "hidden";
        let cuImg = null;
        let sMImgNl = scrollMode_DIV.querySelectorAll('img');
        let sMImgArr = [...sMImgNl];
        if(scrollMode_DIV.querySelector('img')){
            cuImg = sMImgArr.find((img)=>{
                return ( (document.body.offsetHeight > (img.y + img.offsetHeight)) && ((img.y + img.offsetHeight) > 0) )
            });
        } else {
            cuImg = ImgJsonArr.find((img)=>{
                return ( img.pageurl.match(/\-([^\-]+)$/)[1] == location.href.match(/\-([^\-]+)$/)[1] )
            });
            let mainImage_clone = cuImg.mainImage.querySelector('img').cloneNode(true);
            scrollMode_DIV.appendChild(mainImage_clone);
            mainImage_clone = reSizeElmtFlwWidthIfScl(mainImage_clone);
            cuImg = mainImage_clone;
        };
        if(cuImg){
            const currentScrollTop = (cuImg.y + cuImg.offsetHeight) || scrollMode_DIV.scrollTop;
            const IJAcuImg = ImgJsonArr.find((ij)=>{
                return ( ij.pageurl.match(/\-([^\-]+)$/)[1] == cuImg.getAttribute("pageurl").match(/\-([^\-]+)$/)[1] );
            });
            if (currentScrollTop > (lastScrollTop + (cuImg.offsetHeight*0.5))) {
                [...ImgJsonArr].forEach((ImgJson,ImgJsonIdx)=>{
                    const IJACIdx = ImgJsonArr.indexOf(IJAcuImg);
                    sMImgNl = scrollMode_DIV.querySelectorAll('img');
                    sMImgArr = [...sMImgNl];
                    if( ((IJACIdx-5) <= ImgJsonIdx) && (ImgJsonIdx < (IJACIdx+5)) ){
                        let sMcuImg = null;
                        sMcuImg = sMImgArr.find((sMImgNE)=>{
                            return ( sMImgNE.getAttribute("pageurl").match(/\-([^\-]+)$/)[1] == ImgJson.pageurl.match(/\-([^\-]+)$/)[1] );
                        });
                        if( !(sMcuImg) ){
                            let mainImage_clone = ImgJson.mainImage.querySelector('img').cloneNode(true);
                            scrollMode_DIV.appendChild(mainImage_clone);
                            mainImage_clone = reSizeElmtFlwWidthIfScl(mainImage_clone);
                            sMcuImg = mainImage_clone;
                        };
                        if ( !(evnt) && (sMcuImg) && (sMcuImg.getAttribute("pageurl").match(/\-([^\-]+)$/)[1] == location.href.match(/\-([^\-]+)$/)[1]) ) {
                            sMcuImg.scrollIntoView();
                        };
                    };
                    if( ImgJsonIdx < (IJACIdx-5) ){
                        sMImgNl.forEach((sMImgNE)=>{
                            if( ImgJson.pageurl.match(/\-([^\-]+)$/)[1] == sMImgNE.getAttribute("pageurl").match(/\-([^\-]+)$/)[1] ){
                                sMImgNE.remove();
                            };
                        });
                    };
                });
                lastScrollTop = currentScrollTop;
            } else if (currentScrollTop < (lastScrollTop - (cuImg.offsetHeight*0.5))) {
                const ImgJsonArrRvsd = [...ImgJsonArr].reverse();
                [...ImgJsonArrRvsd].forEach((ImgJson,ImgJsonIdx)=>{
                    const IJACIdx = ImgJsonArrRvsd.indexOf(IJAcuImg);
                    sMImgNl = scrollMode_DIV.querySelectorAll('img');
                    sMImgArr = [...sMImgNl];
                    if( ((IJACIdx+5) >= ImgJsonIdx) && (ImgJsonIdx > (IJACIdx-5)) ){
                        let sMcuImg = null;
                        sMcuImg = sMImgArr.find((sMImgNE)=>{
                            return ( sMImgNE.getAttribute("pageurl").match(/\-([^\-]+)$/)[1] == ImgJson.pageurl.match(/\-([^\-]+)$/)[1] );
                        });
                        if( !(sMcuImg) ){
                            let mainImage_clone = ImgJson.mainImage.querySelector('img').cloneNode(true);
                            scrollMode_DIV.insertBefore(mainImage_clone,sMImgArr[0]);
                            mainImage_clone = reSizeElmtFlwWidthIfScl(mainImage_clone);
                            sMcuImg = mainImage_clone;
                        };
                        if ( !(evnt) && (sMcuImg) && (sMcuImg.getAttribute("pageurl").match(/\-([^\-]+)$/)[1] == location.href.match(/\-([^\-]+)$/)[1]) ) {
                            sMcuImg.scrollIntoView();
                        };
                    };
                    if( ImgJsonIdx <= (IJACIdx-5) ){
                        sMImgNl.forEach((sMImgNE)=>{
                            if( ImgJson.pageurl.match(/\-([^\-]+)$/)[1] == sMImgNE.getAttribute("pageurl").match(/\-([^\-]+)$/)[1] ){
                                sMImgNE.remove();
                            };
                        });
                    };
                });
                lastScrollTop = currentScrollTop;
            };
        };
    };
    const ShowscrollMode_DIV = () => {
        let cuImg = null;
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if ( (currentScrollTop >= lastScrollTop) && (currentScrollTop + window.innerHeight >= document.body.offsetHeight*0.99) ) {
            document.body.style.overflow="hidden";
            scrollMode_DIV.style.height = "100%";
            scrollMode_DIV.style.top = '0px';
            scrollMode_DIV.addEventListener("wheel",UpdatescrollMode_DIV,false);
            scrollMode_DIV.addEventListener("scroll",UpdatescrollMode_DIV,false);
            scrollMode_DIV.addEventListener("keydown",UpdatescrollMode_DIV,false);
            document.removeEventListener("wheel",ShowscrollMode_DIV,false);
            document.removeEventListener("scroll",ShowscrollMode_DIV,false);
            document.removeEventListener("keydown",ShowscrollMode_DIV,false);
            scrollMode_DIV.focus();
            UpdatescrollMode_DIV();
        };
        lastScrollTop = currentScrollTop;
    };
    document.addEventListener("wheel",ShowscrollMode_DIV,false);
    document.addEventListener("scroll",ShowscrollMode_DIV,false);
    document.addEventListener("keydown",ShowscrollMode_DIV,false);
    const HidescrollMode_DIV = () => {
        scrollMode_DIV.style.height = '0px';
        scrollMode_DIV.style.top = window.innerHeight + 'px';
        document.body.style.overflow = "scroll";
        scrollMode_DIV.removeEventListener("wheel",UpdatescrollMode_DIV,false);
        scrollMode_DIV.removeEventListener("scroll",UpdatescrollMode_DIV,false);
        scrollMode_DIV.removeEventListener("keydown",UpdatescrollMode_DIV,false);
        document.body.focus();
        document.body.scrollTo({
            top: document.body.offsetHeight*0.8,
            behavior: "smooth"
        });
        document.addEventListener("wheel",ShowscrollMode_DIV,false);
        document.addEventListener("scroll",ShowscrollMode_DIV,false);
        document.addEventListener("keydown",ShowscrollMode_DIV,false);
        const sMImgNl = scrollMode_DIV.querySelectorAll('img');
        const cuImg = [...sMImgNl].find((img)=>{
            return ( (document.body.offsetHeight > (img.y + img.offsetHeight)) && ((img.y + img.offsetHeight) > 0) )
        });
        window.location.href = cuImg.getAttribute("pageurl");
    };
    scrollMode_DIV.addEventListener("click",HidescrollMode_DIV,false);
    window.addEventListener('resize', ()=>{
        scrollMode_DIV.querySelectorAll('img').forEach((img)=>{
            reSizeElmtFlwWidthIfScl(img);
        });
    });
})();
