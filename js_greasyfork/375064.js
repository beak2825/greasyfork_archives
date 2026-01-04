// ==UserScript==
// @name         Manga Loader
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Auto loading next chap to one page
// @author       You
// @require http://code.jquery.com/jquery-3.3.1.js
// @require https://greasyfork.org/scripts/376052-linq/code/LINQ.js?version=658359
// @match        https://blogtruyen.com/c*/*
// @match https://truyentranhlh.net/doc-*
// @match http://hocvientruyentranh.net/chapter/*
// @match https://comicvn.net/truyen-tranh-online/*/*
// @match http://mangak.info/*-chap-*/
// @match https://lhscan.net/read*.html
// @resource awesome https://use.fontawesome.com/releases/v5.5.0/css/all.css
// @grant GM_getResourceText
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375064/Manga%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/375064/Manga%20Loader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(
        '.frm-input-group{display:flex;}' +
        '.frm-input-group-reverse{display:flex;flex-direction:row-reverse}' +
        '.frm-group{display:flex;flex-direction:column}' +
        '.frm-control{padding:.375rem .75rem}' +
        'label{margin-bottom:1px}' +
        'label::after{content:":";}' +
        '.text-bold{text-weight:bold}' +
        '.text-center{align-text:center}' +
        '.mgl-alert{display:block;padding:10px 50px;color:black;background-color:#f6f6ee;width:100%;word-break:break-all}' +
        '.mgl-alert.mgl-alert-danger{color:white;background-color:#ff531a}' +
        '.mgl-alert.mgl-alert-success{color:white;background-color:green}' +
        '.mgl-progress-bar{width:100%;position:relative;height:5px}' +
        '.mgl-progress-bar>.mgl-progress-text{position:absolute;color:white;padding:2px 6px;background-color:green}' +
        '.mgl-progress-bar>.mgl-progress{background-image:linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%);width:0%;height:100%}'+
        '.mgl-button{padding:5px 9px;background-color:#3399ff;color:white;text-align:center;vertical-align:middle;border-radius:3px;display:inline-block}'+
        '.mgl-button:hover{cursor:pointer}'+
        '.mgl-button.mgl-button-opacity{opacity:0.5}'+
        '.mgl-button.mgl-button-opacity:hover{opacity:1}'+
        '.frm-control-group{padding:3px 0px}'+
        '.frm-control-group>.frm-control-title{text-weight:bold}'+
        '#mglLoadStatus{background-color:black;padding:3px;position:fixed;right:0px;bottom:0px;z-index:100000;max-width:20%;border-radius:3px;opacity:0.5}'+
        '#mglLoadStatus>.mgl-status{padding:0px 5px;color:white !important;float:left}'+
        '.mgl-modal{position:fixed;width:50%;height:50%;top:25%;left:25%;overflow:auto;z-index:10000;background-color:white;display:none}'+
        "#imageList>div{flex:1;background-color:green;border-left:1px solid black}"
    );

    GM_addStyle(GM_getResourceText("awesome"));
    $("body").append(`
<div class="mgl-progress-bar" style="position:fixed;top:0px;left:0px;z-index:99999">
<div class="mgl-progress">
</div>
<div class="mgl-progress-text" style="width:8%">
</div>
</div>
`);
    $("body").append(
        '<div class="mgl-alert-list" style="position:fixed;right:1%;top:1%;max-width:20%;z-index:10000"></div>'
    );
    $("body").append(
        '<div class="nv-pn-chp" style="position:fixed;left:0px;bottom:0px;max-width:15%;z-index:99999">' +
        '<div><form id="frmChapter" style="display:none;background-color:#f2f2f2;padding:5px 9px">' +
        '<div class="frm-input-group"><select id="cbxChapter" style="width:100%" class="frm-control"></select></div>' +
        '<div class="frm-control-group">'+
        '<div class="frm-input-group"><input class="frm-control" id="chkOnPage" type="checkbox" checked> <span class="text-bold">Load to current page</span></div>' +
        '<div class="frm-input-group"><input class="frm-control" id="chkAsync" type="checkbox" checked> <span class="text-bold">Load with JS</span></div>'+
        '</div>'+
        '<div class="frm-control-group js-chapter-loader">'+
        '<div class="frm-input-group"><input class="frm-control" id="rbtCleanRead" name="cleanmode" type="radio"> <span class="text-bold">Clean readed image</span></div>' +
        '<div class="frm-input-group"><input class="frm-control" id="rbtCleanAll" name="cleanmode" type="radio"> <span class="text-bold">Clean all image</span></div>' +
        '<div class="frm-input-group"><input class="frm-control" name="cleanmode" type="radio" checked> <span class="text-bold">No clean</span></div>' +
        '</div>'+
        '<div class="frm-control-group js-chapter-loader">'+
        '<div class="frm-input-group"><input class="frm-control" id="rbtPrepend" name="addmode" type="radio"> <span class="text-bold">Prepend</span></div>' +
        '<div class="frm-input-group"><input class="frm-control" id="rbtAppend" name="addmode" type="radio" checked> <span class="text-bold">Append</span></div>' +
        '</div>'+
        '<div><input class="frm-control" id="btnLoad" style="width:100%" type="button" value="Load"></div>' +
        '<div class="frm-group"><label>List current loaded chapter</label><select id="cbxCurrentChapter" style="width:100%" class="frm-control"></select></div>' +
        '<div>' +
        '<div class="frm-input-group"><input class="frm-control" id="chkAutoLoad" type="checkbox" checked> <span class="text-bold" style="color:black;text-align:center">Auto load next chap</span></div>' +
        '<div class="frm-group"><label>Auto load after reading (%) </label><input class="frm-control" style="width:100%" id="txtLoadPercent" type="number" value="80"></div>' +
        '<div class="frm-group"><label>Chapters auto load amount</label><input class="frm-control" style="width:100%" id="txtLoadAmount" type="number" value="1"></div>' +
        '</div>' +
        '</form></div>' +
        '<div class="mgl-button mgl-button-opacity" id="btnShowFrmChapter" style="display:inline-block">Show</div>'+
        '</div>'
    );
    $("body").append([
        '<div id="mglLoadStatus">',
        '<span class="mgl-status" id="mglLoaded">Loaded: 0/0</span>',
        '<span class="mgl-status" id="mglError">Error: 0</span>',
        '</div>',
        '<img id="ngvPreviewImage" style="max-width:30%;height:auto;width:auto;display:none;position:fixed;bottom:0px;z-index:10000;left:35%;bottom:2%">',
        '<div id="imageList" style="position:fixed;width:65%;left:17%;height:1%;bottom:0px;z-index:99999;background-color:dark;display:flex;opacity:0.7"></div>'
    ].join("\n"));

    $("#btnShowFrmChapter").on("click", function () {
        $("#frmChapter").slideToggle(1000);
    });

    $("#chkAsync").on("change",function(){
        $(".js-chapter-loader input").prop("disabled",!$(this).prop("checked"));
    });

    $("#txtLoadPercent").on("change", function () {
        let value = $(this).val();
        if (value < 20) {
            $(this).val(20);
        }
        else if (value > 100) {
            $(this).val(100);
        }
    });

    const loadInfo = {
        onPage: 1,
        cleanPage: 2,
        async:4,
        cleanAll:8
    };
    const keyCode = {};
    for (let i = 1; i <= 26; i++) {
        keyCode[String.fromCharCode(96 + i)] = 64 + i;
    }

    function setWindowTitle(data) {
        let title = new RegExp("<title>(.*?)</title>", "g").exec(data)[1];
        document.title = title;
    }
    function chapterRequest(options) {
        let rawSuccess = options.success;
        options.success = function (data) {
            setWindowTitle(data);
            rawSuccess(data);
        };
        $.ajax(options);
    }
    function message(options) {
        let mode = options.mode || "success";
        let message = options.message || "";
        let duration = options.duration || 1000;
        let msg = $(`<div class="mgl-alert mgl-alert-${mode}">${message}</div>`);
        let autoClose=true;
        if (options.autoClose!==undefined){
            autoClose=options.autoClose;
        }
        let hidden=false;
        if (options.autoClose!==undefined){
            hidden=options.hidden;
        }
        if (hidden){
            msg.hide();
        }
        msg.text(message);
        $(".mgl-alert-list").append(msg);
        if (autoClose){
            setTimeout(function () {
                msg.remove();
            }, duration);
        }
        return msg;
    }
    let wmga = {
        "blogtruyen.com": {
            getChaps: function () {
                return $(".ddlChapter option").toArray().map(x => {
                    return {
                        url: window.location.protocol + "//" + window.location.host + x.value,
                        title: x.innerText
                    };
                }).reverse();
            },
            getImages: function (url, onSuccess) {
                chapterRequest({
                    method: "GET",
                    url: url,
                    success: function (data) {
                        onSuccess($(data).find("#content img").toArray());
                    }
                });
            },
            viewContent: function () {
                return document.querySelector("#content");
            },
            getOffsetHeight: function () {
                return this.viewContent().offsetHeight;
            },
            scrollValid: function (curr, max) {
                if (curr >= max - window.innerHeight / 2) {
                    return true;
                }
                return false;
            }
        },
        "truyentranhlh.net": {
            getChaps: function () {
                return $(".select-chapter option").toArray().map(x => {
                    return {
                        title: x.innerText,
                        url: window.location.protocol + "//" + window.location.host + "/" + x.value
                    };
                }).reverse();
            },
            getImages: function (url, onSuccess) {
                chapterRequest({
                    method: "GET",
                    url: url,
                    success: function (data) {
                        data = data.replace(/\n|\r\n|\r/g,"").match(
                            new RegExp("<img class='_lazy chapter-img' src='.*?'",'g')
                        ).map(x => $('<img class="_lazy chapter-img" src="' + new RegExp("src='(.*)'", "g").exec(x)[1] + '">')).map(function(x){
                            x.css({margin:"auto",display:"block"});
                            return x;
                        });
                        onSuccess(data);
                    }
                });
            },
            viewContent: function () {
                let dview = document.querySelectorAll(".chapter-content")[1];
                if ($(dview).find(".ct-manga-content").length == 0) {
                    $(dview).find("br").remove();
                    let view = $('<div class="ct-manga-content"></div>');
                    $(view).append($(dview).find("img"));
                    $(view).find("img").css({margin:"auto",display:"block"});
                    $(dview).prepend(view);
                    return view;
                }
                else {
                    return document.querySelector(".chapter-content .ct-manga-content");
                }
            },
            getOffsetHeight: function () {
                return $(this.viewContent()).find("img").toArray().reduce((curr, next) => curr + next.offsetHeight, 0);
            },
            scrollValid: function (curr, max) {
                if (curr >= max) {
                    return true;
                }
                return false;
            }
        },
        "hocvientruyentranh.net": {
            getChaps: function () {
                return $(".chapters-dropdown option").toArray().map(x => {
                    return {
                        url: x.value,
                        title: x.innerText
                    };
                });
            },
            getImages: function (url, onSuccess) {
                chapterRequest({
                    method: "GET",
                    url: url,
                    success: function (data) {
                        onSuccess($(data).find(".manga-container img").toArray());
                    }
                });
            },
            viewContent: function () {
                return document.querySelector(".manga-container");
            },
            getOffsetHeight: function () {
                return this.viewContent().offsetHeight;
            },
            scrollValid: function (curr, max) {
                if (curr >= max - window.innerHeight / 2) {
                    return true;
                }
                return false;
            }
        },
        "comicvn.net": {
            getChaps: function () {
                return $(".loadChapter option").toArray().map(x => {
                    return {
                        url: x.value,
                        title: x.innerText
                    };
                }).reverse();
            },
            getImages: function (url, onSuccess) {
                chapterRequest({
                    method: "GET",
                    url: url,
                    success: function (data) {
                        onSuccess($($(data).find("#txtarea").text()).toArray().map(x => {
                            x.style.minHeight = "140px";
                            return x;
                        }));
                    }
                });
            },
            viewContent: function () {
                return document.querySelector("#image-load");
            },
            getOffsetHeight: function () {
                return this.viewContent().offsetHeight;
            },
            scrollValid: function (curr, max) {
                if (curr >= max - window.innerHeight / 2) {
                    return true;
                }
                return false;
            }
        },
        "mangak.info": {
            getChaps: function () {
                return $(".select-chapter option").toArray().map(x => {
                    return {
                        url: x.value,
                        title: x.innerText
                    };
                }).reverse();
            },
            getImages: function (url, onSuccess) {
                chapterRequest({
                    method: "GET",
                    url: url,
                    success: function (data) {
                        data = data.replace(/\n|\r\n/gm, "");
                        data = eval(new RegExp('var content=(\\[(.*?)\\])', "g").exec(data)[1]);
                        onSuccess(data.map(x => {
                            let img = new Image();
                            img.src = x;
                            img.style.minHeight = "140px";
                            return img;
                        }));
                    }
                });
            },
            viewContent: function () {
                return document.querySelector(".vung_doc");
            },
            getOffsetHeight: function () {
                return this.viewContent().offsetHeight;
            },
            scrollValid: function (curr, max) {
                if (curr >= max - window.innerHeight / 2) {
                    return true;
                }
                return false;
            }
        },
        "lhscan.net": {
            getChaps: function () {
                return $(".select-chapter select option").toArray().map(x => {
                    return {
                        url: `https://lhscan.net/${x.value}`,
                        title: x.innerText
                    };
                }).reverse();
            },
            getImages: function (url, onSuccess) {
                chapterRequest({
                    method: "GET",
                    url: url,
                    success: function (data) {
                        data = data.replace(/\n|\r\n|\r/gm, "").
                        match(new RegExp("<img class='chapter-img' src='.*?'", 'g')).
                        map(x => new RegExp("<img class='chapter-img' src='(.*?)'", 'g').exec(x)[1]).map(x => $(`<img class="chapter-img" src=${x}>`));
                        onSuccess(data);
                    }
                });
            },
            viewContent: function () {
                let parent = document.querySelectorAll(".chapter-content")[1];
                parent = $(parent);
                if (parent.find(".mgl-img-container").length == 0) {
                    let imgContainer = $(`<div class="mgl-img-container"></div>`);
                    parent.prepend(imgContainer);
                    imgContainer.append(parent.find("img"));
                    parent.find("br").remove();
                    return imgContainer[0];
                }
                else {
                    return document.querySelector(".chapter-content .mgl-img-container");
                }
            },
            getOffsetHeight: function () {
                return this.viewContent().offsetHeight;
            },
            scrollValid: function (curr, max) {
                if (curr >= max - window.innerHeight / 2) {
                    return true;
                }
                return false;
            }
        }
    };

    function MangaContext(host) {
        this.host = host;
        let instance = wmga[host];
        this.currentIndex = -1;
        this.percReading = 80;
        this.viewContent = instance.viewContent();
        $(this.viewContent).find(":not(img)").remove();
        Object.defineProperty(this, "scrollPosition", {
            get: function () {
                return instance.getOffsetHeight() / 100 * this.percReading;
            }
        });
        this.chaps = Enumerable.from(instance.getChaps()).unique(x=>x.url).toArray();
        this.loadState = {};
        this.isComplete = false;
        this.loading = false;
        this.alertComplete = false;
        this.imageUrls=[];
        this.imageStatus={
            loaded:0,
            error:0,
            loading:0,
            total:0
        };
        for (let x of this.chaps) {
            this.loadState[x] = false;
        }
        this.cChapUrl = this.chaps.filter(x => x.url == window.location.href);
        if (this.cChapUrl.length) {
            this.cChapUrl = this.cChapUrl[0];
            let imgs=$(this.viewContent).find("img").toArray();
            for (let x in imgs){
                this.imageUrls.push({src:imgs[x].src,chapter:this.cChapUrl.url});
            }
        }
        else {
            this.cChapUrl = null;
        }
        this.currentIndex = this.chaps.indexOf(this.cChapUrl);
        this.currentScrollPosition = -1;

        this.getChapIndex = function (url) {
            let temp = this.chaps.filter(x => x.url == url);
            return (temp.length != 0) ? this.chaps.indexOf(temp[0]) : -1;
        };

        this.loadChap=function(options){
            let title=options.title || "";
            let url=options.url;
            let flags=options.flags || 0;
            let onPage=true;
            let cleanPage=false;
            let cleanAll=false;
            let async=true;
            let append=true;
            let onSuccess=options.onSuccess || null;
            if (options.prepend){
                append=false;
            }
            if ((flags & loadInfo.onPage)!=loadInfo.onPage){
                onPage=false;
            }
            if ((flags & loadInfo.cleanPage)==loadInfo.cleanPage){
                cleanPage=true;
            }
            else if ((flags & loadInfo.cleanAll)==loadInfo.cleanAll){
                cleanAll=true;
            }
            if ((flags & loadInfo.async)!=loadInfo.async){
                async=false;
            }
            if (!async && !onPage){
                window.open(url);
            }
            else if (!async && onPage){
                window.location.href=url;
            }
            else if (async && onPage){
                let viewContent=this.viewContent;
                let ctx=this;
                let currentScrollPosition=this.currentScrollPosition;
                if (!this.loading){
                    this.loading=true;
                    instance.getImages(url, function (data) {
                        window.history.pushState("", "", url);
                        message({ message: `${title} loaded`, duration: 3000 });
                        ctx.createImageStatus(data);
                        data.forEach(x=>{
                            ctx.imageUrls.push({src:$(x).attr("src").trim(),chapter:url});
                        });
                        let totalImgOffset = 0;
                        let a=data.map(x=>$(x).attr("src").trim());
                        if (cleanPage){
                            $(viewContent).find("img").toArray().forEach(x => {
                                totalImgOffset += x.offsetHeight;
                                a.push(x.src.trim());
                                if (totalImgOffset < currentScrollPosition - window.innerHeight*2) {
                                    $(x).remove();
                                }
                            });
                        }
                        else{
                            if (cleanAll){
                                window.scrollTo(0,0);
                                $(viewContent).find("img").remove();
                            }
                        }
                        if (append){
                            data.forEach(x => {
                                $(viewContent).append(x);
                            });
                        }
                        else{
                            window.scrollTo(0,0);
                            data.reverse().forEach(x => {
                                $(viewContent).prepend(x);
                            });
                        }
                        ctx.imageUrls=ctx.imageUrls.filter(x=>a.some(y=>y==x.src));
                        ctx.loadedChapterList();
                        ctx.loading = false;
                        if (typeof onSuccess=="function"){
                            onSuccess(options);
                        }
                        ctx.createImageNavigation();
                    });
                }
            }
        };

        this.loadNextChap = function (next = 1) {
            next--;
            if (!this.loading && !this.isComplete && next >= 0) {
                if (window.location.href == this.chaps[this.chaps.length - 1].url) {
                    this.isComplete = true;
                    message({ message: `Owari`, duration: 3000, mode: "danger" });
                    return;
                }
                this.currentIndex += 1;
                let ctx=this;
                let nChap = this.chaps[this.currentIndex];
                if (nChap){
                    this.loadChap({
                        title:nChap.title,
                        url:nChap.url,
                        flags:loadInfo.onPage | loadInfo.async | loadInfo.cleanPage,
                        onSuccess:function(opts){
                            $("#cbxChapter").val(opts.url);
                            ctx.loadNextChap(next);
                        }
                    });
                }
            }
            else {
            }
        };
        this.loadedChapterList=function(){
            let chaps=this.chaps;
            $("#cbxCurrentChapter").html("");
            Enumerable.from(this.imageUrls).groupBy(x=>x.chapter).each(function(x){
                $("#cbxCurrentChapter").append(`<option value="${x.key}">`+Enumerable.from(chaps).first(y=>y.url==x.key).title+'</option');
            });
        };
        this.imagePositionMap=function(){
            let imgTotalOffset=0;
            let posImageMap=$(this.viewContent).find("img").toArray().map(function(x){
                let fromPos=imgTotalOffset+1;
                imgTotalOffset+=x.offsetHeight;
                return {src:x.src,from:fromPos,to:imgTotalOffset}
            });
            return posImageMap;
        };
        this.scrollValid = function (curr, max) {
            this.currentScrollPosition = curr;
            let relMax=instance.getOffsetHeight();
            let readPerc=(curr/relMax)*100;
            readPerc=parseInt(readPerc);
            $(".mgl-progress-text").show();
            //             let tOffsetWidth=$(".mgl-progress-text").prop("offsetWidth");
            //             let tPercUsed=parseInt((tOffsetWidth/$(".mgl-progress").prop("clientWidth"))*100);
            readPerc=(readPerc>100)?100:readPerc;
            let readPerText=readPerc+"%";
            $(".mgl-progress").css({
                width:readPerText
            });
            $(".mgl-progress-text").css({
                left:(((8+readPerc)>100)?readPerc-(readPerc+8-100):readPerc)+"%"
            });
            $(".mgl-progress-text").text("Reading "+readPerText);
            setTimeout(function(){
                $(".mgl-progress-text").hide();
            },1000);
            let posImageMap=this.imagePositionMap().filter(x=>curr>=x.from && curr<=x.to);
            if (posImageMap.length){
                let lastImage=posImageMap[posImageMap.length-1];
                let a=this.imageUrls.filter(x=>x.src==lastImage.src);
                if (a.length){
                    a=a[0];
                    let b=this.imageUrls.filter(x=>x.chapter==a.chapter);
                    if (b.length){
                        let i=b.indexOf(a)+1;
                        let perc=(i/b.length)*100;
                        let title=this.chaps.filter(x=>x.url==a.chapter)[0].title;
                        perc=parseInt(perc);
                        $("#btnShowFrmChapter").text(`${title} - Reading ${perc}%[${i}/${b.length}(Img)]`);
                    }
                }
            }
            return instance.scrollValid(curr, max);
        };
        this.bindImageEvent=function(img){
            let src=img.src;
            let imageStatus=this.imageStatus;
            img.onload=function(){
                imageStatus.loaded++;
                imageStatus.loading--;
                $("#mglLoaded").text(`Loaded: ${imageStatus.loaded}/${imageStatus.total}`);
            };
            img.onerror=function(){
                imageStatus.error+=1;
                $("#mglError").text(`Error: ${imageStatus.error}`);
            };
            img.src=src;
        };
        this.createImageStatus=function(images){
            let ctx=this;
            let len=images.length;
            $("#mglLoaded").text(`Loaded: ${this.imageStatus.loaded}/${this.imageStatus.total}`);
            this.imageStatus.loading+=len;
            this.imageStatus.total+=len;
            images.forEach(x=>{
                ctx.bindImageEvent($(x)[0]);
            });
        };
        this.createImageNavigation=function(){
            $("#imageList").html("");
            $(this.viewContent).find("img").toArray().forEach(x=>{
                let img=$(`<div> </div>`);
                $("#imageList").append(img);
                img.on("mouseover",function(e){
                    $("#ngvPreviewImage").attr({src:$(x).attr("src")});
                    $("#ngvPreviewImage").show();
                });
                img.on("click",function(){
                    x.scrollIntoView();
                });
                img.on("mouseout",function(e){
                    $("#ngvPreviewImage").hide();
                });
            });
        };
        this.init=function(){
            let ctx=this;
            let viewContent=$(this.viewContent);
            this.createImageStatus(viewContent.find("img").toArray());
            this.createImageNavigation();
            this.loadedChapterList();
        };
        this.init();
    };
    $(document).ready(function () {
        let ctx = new MangaContext(window.location.host);
        $("#cbxChapter").val(ctx.chaps[ctx.currentIndex].url);
        let nextAmount = parseInt($("#txtLoadAmount").val());
        $("#cbxChapter").append(ctx.chaps.map(x => $('<option value="' + x.url.trim() + '">' + x.title + '</option>')));
        $("#cbxChapter").on("change",function(){
            ctx.currentIndex=ctx.getChapIndex($(this).val());
            let option=$(this).find("option:selected");
            message({
                message:`Chapter will load from ${option.text().trim()} up`,
                duration:5000,
                mode:"danger"
            });
        });
        $("#cbxCurrentChapter").on("change",function(){
            let url=$(this).val().trim();
            let imgMapList=ctx.imagePositionMap();
            let img=ctx.imageUrls.filter(x=>x.chapter==url && imgMapList.some(y=>y.src==x.src));
            if (img.length){
                img=img[0];
                let imgPos=Enumerable.from(imgMapList).firstOrDefault(x=>x.src==img.src);
                if(imgPos){
                    window.scrollTo(0,imgPos.from);
                }
            }
        });
        $("#btnLoad").on("click", function () {
            let flags = 0;
            flags |= $("#chkOnPage").prop("checked") ? loadInfo.onPage : 0;
            flags |= $("#rbtCleanRead").prop("checked") ? loadInfo.cleanPage : 0;
            flags |= $("#rbtCleanAll").prop("checked") ? loadInfo.cleanAll : 0;
            flags |= $("#chkAsync").prop("checked")?loadInfo.async:0;
            let chap=ctx.chaps.filter(x=>x.url==$("#cbxChapter").val());
            if (chap.length){
                chap=chap[0];
                ctx.loadChap({
                    url:chap.url,
                    title:chap.title,
                    flags:flags,prepend:$("#rbtPrepend").prop("checked"),
                    onSuccess:function(opts){
                        $("#cbxChapter").val(opts.url);
                    }
                });
            }
        });
        $(document).on("scroll", function () {
            if (ctx.scrollValid(window.pageYOffset, ctx.scrollPosition) && $("#chkAutoLoad").prop("checked")) {
                ctx.loadNextChap(nextAmount);
                $("#cbxChapter").val(ctx.chaps[ctx.currentIndex].url);
            }
        });
        $(document).on("keydown", function (e) {
            if (e.shiftKey && !e.ctrlKey && !e.altKey) {
                switch (e.keyCode) {
                    case keyCode.a:
                        $("#chkAutoLoad").prop("checked", !$("#chkAutoLoad").prop("checked"));
                        break;
                    case keyCode.n:
                        ctx.loadNextChap();
                        break;
                }
            }
        });
        $("#txtLoadPercent").on("change", function () {
            ctx.percReading = $(this).val();
        });
        $("#txtLoadAmount").on("change", function () {
            nextAmount = parseInt($(this).val());
        });
    });
})();