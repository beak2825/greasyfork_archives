// ==UserScript==
// @name         GoogleDev
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Google Drive Utility
// @author       You
// @match        https://drive.google.com/drive/u/*/folders/*
// @match https://drive.google.com/drive/folders/*
// @match https://drive.google.com/drive/*
// @match https://drive.google.com/uc?id=*
// @match https://drive.google.com/file/d/*
// @match https://inbox.google.com/*
// @require https://code.jquery.com/jquery-3.2.1.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.js
// @resource jqueryThemeCss http://code.jquery.com/ui/1.12.0/themes/smoothness/jquery-ui.css
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant GM_notification
// @downloadURL https://update.greasyfork.org/scripts/374943/GoogleDev.user.js
// @updateURL https://update.greasyfork.org/scripts/374943/GoogleDev.meta.js
// ==/UserScript==


class ChangeProperty{
    constructor(img=[]){
        this.max=img.length;
        this.sId=-1;
        this.img=img;
        this.sImg="";
    }
    getImage(){
        this.sId+=1;
        this.sId=this.sId%(this.max);
        this.sImg=this.img[this.sId];
        return this.sImg;
    }
    getShuffleImage(){
        for (let i=this.max-1;i>=0;i--){
            let index=Math.floor((Math.random()*100)%(i+1));
            let temp=this.img[i];
            this.img[i]=this.img[index];
            this.img[index]=temp;
        }
        return this.getImage();
    }
}

class ProgressBar{
    constructor(value=0,max=100){
        this.defaultValue=value;
        this.defaultMax=max;
        this.max=max;
        this.value=value;
        this.init();
    }
    css(elmt,css){
        for (let property in css)
            elmt.style[property]=css[property];
    }
    prepareValue(value){
        return ((value*100)/this.max).toPrecision(2);
    }
    setMax(value){
        this.defaultMax=value;
        this.max=max;
    }
    setValue(value){
        this.defaultValue=value;
        this.value=value;
    }
    onmouseover(func){
        this.bar.onmouseover=func;
    }
    onmouseout(func){
        this.bar.onmouseout=func;
    }
    step(value){
        this.value+=value;
        if (this.value<this.max)
            this.css(this.bar,{
                width:this.prepareValue(this.value)+"%"
            });
        else{
            this.value=this.defaultValue;
            this.css(this.bar,{
                width:this.prepareValue(this.value)+"%"
            });
        }
    }
    init(){
        this.progressBar=document.createElement("div");
        this.bar=document.createElement("div");
        this.css(this.progressBar,{
            width:"100%"
        });
        this.css(this.bar,{
            background:"linear-gradient(to right,rgba(0, 255, 0,0.8) ,rgba(255, 255, 255,0.8))",
            width:this.prepareValue(this.value)+"%",
            height:"3px"
        });
        this.progressBar.appendChild(this.bar);
    }
}

class ButtonDownload{
    constructor(fileId){
        this.fileId=fileId;
        this.init();
    }
    css(css){
        for (let property in css)
            this.button.style[property]=css[property];
    }
    init(){
        this.button=document.createElement("div");
        this.button.appendChild(document.createTextNode("Download"));
        this.css({
            backgroundColor:"rgba(255,255,255,0.5)",
            borderRadius:"12px",
            padding:"12px"
        });
        this.button.setAttribute("fileId",this.fileId);
        this.button.onclick=this.download;
    }
    download(){
        let download="https://drive.google.com/uc?id="+this.getAttribute("fileId");
        $.ajax({
            type:"GET",
            url:download,
            crossDomain:true,
            success:function(result,status,xhr){
                console.info("Get Link success "+download);
                let confirmCode=/confirm=[A-z_0-9\-]+/g.exec(result);
                if (confirmCode==undefined){
                    alert("Download Limited");
                    return;
                }
                confirmCode=confirmCode[0];
                download+="&"+confirmCode;
                let w=window.open(download);
                w.onload=()=>{
                    this.close();
                };
            }
        });
    }
}

function getImageDir(src){
    GM_xmlhttpRequest({
        method:"GET",
        url:src,
        onreadystatechange:(res)=>{
            var img=[];
            if (res.readyState==4){
                var resText=res.responseText;
                resText=resText.replace(/\n/g,"");
                resText.match(/\"images\":\[.*?\]/g).forEach((match)=>{
                    match.match(/\{.*?\}/g).forEach((match1)=>{
                        let hash=/\"hash\":\"(.*?)\"/.exec(match1)[1];
                        let ext=/\"ext\":\"(.*?)\"/.exec(match1)[1];
                        let imgUrl="https://i.imgur.com/"+hash+ext;
                        img.push(imgUrl);
                        console.log(imgUrl);
                    });
                });
                GoogleDev.img=new ChangeProperty(img);
            }
        }
    });
}

class Snow{
    constructor(parent){
        this.top=Math.random()*100;
        this.left=Math.random()*100;
        let r=Math.floor((Math.random()*10))%3;
        this.width=[45,35,20][r];
        this.height=[45,35,20][r];
        this.opacity=[1,0.5,0.3][r];
        this.parent=parent;
        this.init();
    }
    init(){
        this.snow=document.createElement("div");
        this.css(this.snow,{
            backgroundImage:"url(\""+"https://png.icons8.com/snow-storm/ultraviolet/100/ffffff"+"\")",
            backgroundSize:"cover",
            width:this.width+"px",
            height:this.height+"px",
            position:"absolute",
            left:this.left+"%",
            top:this.top+"%",
            opacity:this.opacity
        });
    }
    css(elmt,css){
        for (let property in css)
            elmt.style[property]=css[property];
    }
    fall(){
        this.top+=0.5;
        this.top%=100;
        this.left+=this.parent.offsetWidth/100/100;
        this.left%=100;
        this.css(this.snow,{
            top:this.top+"%",
            left:this.left+"%"
        });
    }
}

class SnowFall{
    constructor(parent,snowCount=0,snowArray){
        this.parent=parent;
        if (this.snowArray!==undefined){
            this.snowArray=snowArray;
            this.snowCount=snowArray.length;
        }
        else
            this.createSnowArray(snowCount);
        this.addSnowToParent(this.snowArray);
    }
    createSnowArray(snowCount){
        this.snowArray=[];
        this.snowCount=snowCount;
        for (let i=0;i<snowCount;i++)
            this.snowArray.push(new Snow(this.parent));
    }
    addSnowToParent(snowArray){
        for (let i=0;i<snowArray.length;i++)
            this.parent.appendChild(snowArray[i].snow);
    }
    fall(){
        for (let i=0;i<this.snowArray.length;i++)
            this.snowArray[i].fall();
    }
}

var GoogleDev={
    options:{
        version:"1.0"
    },
    img:new ChangeProperty(
        ["https://i.imgur.com/5Sl4F3D.jpg",
         "https://i.imgur.com/hnhQ26v.jpg",
         "https://i.imgur.com/QOYKBQl.jpg",
         "https://i.imgur.com/9GZv8jm.jpg",
         "https://i.imgur.com/dkFUDtZ.jpg",
         "https://i.imgur.com/FLTjuI1.jpg",
         "https://i.imgur.com/jP0KTEa.png",
         "https://i.imgur.com/WEJrca0.png",
         "https://i.imgur.com/ToG4MDh.jpg",
         "https://i.imgur.com/il0vY1r.jpg",
         "https://i.imgur.com/25Q9oQq.jpg",
         "https://i.imgur.com/lQfmMSF.png",
         "https://i.imgur.com/D6RqHLr.jpg",
         "https://i.imgur.com/fUCAFIJ.jpg"
        ]),
    styleChange:(elmt,css)=>{
        for (let propertyName in css)
            elmt.style[propertyName]=css[propertyName];
    },
    css:(querySelector,css,id=-1)=>{
        if (id==-1){
            document.querySelectorAll(querySelector).forEach((elmt)=>{
                GoogleDev.styleChange(elmt,css);
            });
        }
        else
            GoogleDev.styleChange(document.querySelectorAll(querySelector)[id],css);
    },
    createButton:()=>{
        document.querySelectorAll(".a-t-J-Rf>div").forEach((elmt)=>{
            var fileId=elmt.getAttribute("data-id");
            var button=new ButtonDownload(fileId);
            GoogleDev.styleChange(elmt.querySelectorAll(".a-t-cb")[3],{
                position:"relative"
            });
            button.css({
                position:"absolute",
                right:"0px",
                top:"10%"
            });
            button.button.className="myBtn";
            if (elmt.querySelectorAll(".a-t-cb")[3].querySelector(".myBtn")===null)
                elmt.querySelectorAll(".a-t-cb")[3].appendChild(button.button);
        });
    },
    update:()=>{
        GM_xmlhttpRequest(
            {
                method:"GET",
                url:"https://pastebin.com/dl/8ieLHMRd",
                headers:{
                    "referer":"https://pastebin.com/8ieLHMRd"
                },
                onreadystatechange:(xhr)=>{
                    if (xhr.readyState==4){
                        var resText=xhr.responseText;
                        var version=/@version\s+([A-z_0-9\.]+)/.exec(resText)[1];
                        if (GoogleDev.options.version!=version)
                            GM_notification({
                                title:"GoogleDev",
                                text:"New version: "+version,
                                onclick:()=>{
                                    window.open("https://pastebin.com/8ieLHMRd");
                                }
                            });
                    }
                }
            });
    },
    googleDrive:()=>{
        let progressBarChangeTime=new ProgressBar(1,100);
        let body=document.querySelector("#drive_main_page");
        body.style.position="relative";
        let snowFall=new SnowFall(body,0);
        let progressBarImage=new ProgressBar(1,GoogleDev.img.max);
        progressBarChangeTime.css(
            progressBarChangeTime.progressBar,
            {
                position:"absolute",
                top:"0px",
                left:"0px"
            });
        progressBarImage.css(
            progressBarImage.progressBar,
            {
                position:"absolute",
                bottom:"0px",
                left:"0px"
            });
        body.style.position="relative";
        body.appendChild(progressBarChangeTime.progressBar);
        body.appendChild(progressBarImage.progressBar);
        // body.appendChild(snowFall.canvas);
        window.onload=()=>{
            document.querySelector(".a-qc-La").addEventListener("DOMNodeInserted",(elmt)=>{
                GoogleDev.createButton();
                // GoogleDev.styleChange(
                // elmt.target,
                // {
                // backgroundColor:"rgba(255,255,255,0.02)"
                // });
                // elmt.target.querySelectorAll("*").forEach((subElmt)=>{
                // GoogleDev.styleChange(
                // subElmt,
                // {
                // backgroundColor:"rgba(255,255,255,0.02)"
                // });
                // });
                GoogleDev.css(".a-qc-La div :not(.myBtn)",{
                    backgroundColor:"rgba(255,255,255,0.02)"
                });
                GoogleDev.css("span",{
                    color:"blue"
                });
                document.querySelectorAll(".l-Ab-T-r").forEach((elmt)=>{
                    elmt.onmouseover=()=>{
                        GoogleDev.styleChange(elmt,{
                            color:"red"
                        });
                    };
                    elmt.onmouseout=()=>{
                        GoogleDev.styleChange(elmt,{
                            color:"blue"
                        });
                    };
                });
            });
            GoogleDev.css("#drive_main_page div",{
                backgroundColor:"rgba(255,255,255,0.02)"
            });
            GoogleDev.css("#drive_main_page",{
                backgroundRepeat:"no-repeat",
                backgroundSize:"100%",
                backgroundAttachment:"fixed",
                backgroundImage:"url(\""+GoogleDev.img.getShuffleImage()+"\")",
                transition:"background 2s linear"
            },0);
            setInterval(()=>{
                progressBarChangeTime.step(1);
            },200);
//             setInterval(()=>{
//                 snowFall.fall();
//             },40);
            setInterval(()=>{
                //.a-qc-La
                GoogleDev.css("#drive_main_page",{
                    backgroundImage:"url(\""+GoogleDev.img.getShuffleImage()+"\")",
                },0);
                progressBarImage.step(1);
            },20000);
        };
    },
    googleInbox:()=>{
        let progressBarChangeTime=new ProgressBar(1,100);
        let body=document.querySelector("body");
        body.style.position="relative";
        let progressBarImage=new ProgressBar(1,GoogleDev.img.max);
        progressBarChangeTime.css(
            progressBarChangeTime.progressBar,
            {
                position:"fixed",
                top:"0px",
                left:"0px"
            });
        progressBarImage.css(
            progressBarImage.progressBar,
            {
                position:"fixed",
                bottom:"0px",
                left:"0px"
            });
        body.style.position="relative";
        body.appendChild(progressBarChangeTime.progressBar);
        body.appendChild(progressBarImage.progressBar);
        window.onload=()=>{
            GoogleDev.css("body *",{
                backgroundColor:"rgba(255,255,255,0.02)"
            });
            GoogleDev.css(".yDSKFc *",{
                backgroundColor:"rgba(255,255,255,0.02)"
            });
            document.querySelector("body").addEventListener("DOMNodeInserted",(elmt)=>{
                // GoogleDev.styleChange(
                // elmt.target,
                // {
                // backgroundColor:"rgba(255,255,255,0.02)"
                // });
                // elmt.target.querySelectorAll("*").forEach((subElmt)=>{
                // GoogleDev.styleChange(
                // subElmt,
                // {
                // backgroundColor:"rgba(255,255,255,0.02)"
                // });
                // });
                GoogleDev.css(".yDSKFc *",{
                    backgroundColor:"rgba(255,255,255,0.02)"
                });
                GoogleDev.css("span",{
                    color:"blue"
                });
                document.querySelectorAll("span").forEach((elmt)=>{
                    elmt.onmouseover=()=>{
                        GoogleDev.styleChange(elmt,{
                            color:"red"
                        });
                    };
                    elmt.onmouseout=()=>{
                        GoogleDev.styleChange(elmt,{
                            color:"blue"
                        });
                    };
                });
            });
            GoogleDev.css("body",{
                backgroundRepeat:"no-repeat",
                backgroundSize:"100%",
                backgroundAttachment:"fixed",
                backgroundImage:"url(\""+GoogleDev.img.getShuffleImage()+"\")",
                transition:"background 2s linear"
            },0);
            setInterval(()=>{
                progressBarChangeTime.step(1);
            },200);
            setInterval(()=>{
                GoogleDev.css("body",{
                    backgroundImage:"url(\""+GoogleDev.img.getShuffleImage()+"\")",
                },0);
                progressBarImage.step(1);
                if (progressBarImage.max<GoogleDev.img.max) progressBarImage.max=GoogleDev.img.max;
            },20000);
        };
    },
    init:()=>{
        GoogleDev.update();
        getImageDir("https://imgur.com/a/gCYII");
        let href=window.location.href;
        if (/https:\/\/drive\.google\.com\/drive/.test(href)){
            GoogleDev.googleDrive();
        }
        else if (/https:\/\/drive\.google\.com\/uc\?id=[A-z_0-9\-]+/.test(href))
            window.location.href=document.querySelector("#uc-download-link").href;
        else if (/https:\/\/drive\.google\.com\/file\/d\/[A-z_0-9\-]+/.test(href)){
            if (document.querySelectorAll(".drive-viewer-button-disabled")[2].style.display=="none"){
                if (!window.confirm("Download ?"))
                    return;
                var fileId=/https:\/\/drive\.google\.com\/file\/d\/([A-z_0-9\-]+)/.exec(href)[1];
                window.location.href="https://drive.google.com/uc?id="+fileId;
            }
        }
        else if(/https:\/\/inbox.google.com\//.test(href)){
            GoogleDev.googleInbox();
        }
    }
};

GoogleDev.init();