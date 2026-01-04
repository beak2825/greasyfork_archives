// ==UserScript==
// @name         Scale Sankaku Beta
// @version      0.1.3
// @description  Resizes pics on Sankaku beta to full window size when you touch the left side of the window with your cursor. Uses the Magic Kernel Sharp algorithm for scaling.
// @author       Octopus Hugger
// @icon         https://s2.googleusercontent.com/s2/favicons?domain=https://beta.sankakucomplex.com/
// @grant		GM_xmlhttpRequest
// @connect    *
// @match      *://beta.sankakucomplex.com/*
// @license WTFPL
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/bootstrap.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/lie/3.1.1/lie.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/pica/9.0.1/pica.min.js
// @namespace https://greasyfork.org/users/879890
// @downloadURL https://update.greasyfork.org/scripts/440517/Scale%20Sankaku%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/440517/Scale%20Sankaku%20Beta.meta.js
// ==/UserScript==

// Changelog

// 0.1.3
// Improved text readout.

// 0.1.2
// Updated description and changelog and decreased rate of checking for Imagus.

// 0.1.1
// Fixed issue where the feature to always load original after it's been loaded at least once sometimes didn't work.


(function() {
    'use strict';
    if (window.top != window.self){ //-- Don't run on frames or iframes
        return;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function base64img(i){
        let canvas = document.createElement('canvas');
        canvas.width = i.width;
        canvas.height = i.height;
        let context = canvas.getContext("2d");
        context.drawImage(i, 0, 0);
        let blob = canvas.toDataURL("image/png");
        return blob;
    }

    function ImgToCanvas(i){
        let canvas = document.createElement('canvas');
        canvas.width = i.width;
        canvas.height = i.height;
        let context = canvas.getContext("2d");
        context.drawImage(i, 0, 0);
        return canvas;
    }

    let resizer;


    let resizer_mode = {
        js:   true,
        wasm: true,
        cib:  false,
        ww:   true
    };

    function create_resizer() {
        let opts = [];

        Object.keys(resizer_mode).forEach(function (k) {
            if (resizer_mode[k]) opts.push(k);
        });

        resizer = window.pica({ features: opts });
    }

    create_resizer();

    let cancelactiveresizes;
    let cancelresize = new Promise((_, reject) => cancelactiveresizes = reject);

    let currentpic = "null?"

    let maindiv = null

    let savedwidth = null

    let imagestore = {}

    let mainimg = null
    let towindowsize = false
    let mydiv = null
    let imgfirstload = true

    let purgewaittime = 15000

    function purgeimage(linkvar){
        if (currentpic !== linkvar&&linkvar!=inprogress){
            delete imagestore[linkvar]
        }
        else{
            imagestore[linkvar+"myexpire"] = setTimeout(purgeimage,purgewaittime,linkvar)
        }
    }

    function getSankImageType(linkvar){
        if(linkvar==null||linkvar==undefined) return null
        if(linkvar.search("preview")!==-1){
            return "Thumbnail"
        }
        else if(linkvar.search("sample")!==-1){
            return "Sample"
        }
        else {
            return "Original"
        }
    }

    let imagereadoutcount = 0
    let readoutlinkvar=null
    function imagereadout(inputtext,w,linkvar,editnumber){
        if(linkvar!==null&&linkvar!==undefined&&linkvar!=="null?"){
            if(readoutlinkvar!==null&&linkvar!==readoutlinkvar){
                return
            }
            if(inputtext=="Waiting for server"&&getSankImageType(linkvar)=="Original") return
        }
        if(imagereadoutcount>=50&&inputtext!=="Scaling Complete"){
            clearimagereadout()
            if(linkvar.search("sankakucomplex.com")!==-1){
                imagereadout(getSankImageType(linkvar),w,linkvar)
            }
        }
        let currentreadout
        if(editnumber!==undefined&&editnumber!==null){
            currentreadout = imagereadoutcount
        }
        else{
            imagereadoutcount+=1
            currentreadout = imagereadoutcount
        }
        let readouttext = document.createElement("readouttext"+currentreadout)
        readouttext.id = "readouttext"+currentreadout

        readouttext.style.pointerEvents="none"
        readouttext.style.backgroundColor="black"
        readouttext.style["border-color"]="black"
        if(inputtext=="Original") {
            readouttext.style.backgroundColor="#F70DFF"
            readouttext.style["border-color"]="#F70DFF"
        }
        else if(inputtext=="Sample") {
            readouttext.style.backgroundColor="#1C37FF"
            readouttext.style["border-color"]="#1C37FF"
        }
        else if(inputtext=="Thumbnail") {
            readouttext.style.backgroundColor="#FF0000"
            readouttext.style["border-color"]="#FF0000"
        }
        readouttext.style.color="white"
        readouttext.style["border-style"]="solid"
        readouttext.innerText=inputtext


        if(document.getElementById('readouttext'+currentreadout) !== null){
            document.getElementById('mydiv').replaceChild(readouttext,document.getElementById('readouttext'+currentreadout))
        }
        else{
            document.getElementById('mydiv').appendChild(readouttext)
        }

        if(w==window.innerWidth||imagereadoutcount>1&&document.getElementById('readouttext'+(imagereadoutcount-1)).offsetLeft>=0){
            if(imagereadoutcount>1&&document.getElementById('readouttext'+(imagereadoutcount-1)).offsetLeft<0){
                for(let i=1;i<imagereadoutcount;i++){
                    document.getElementById('readouttext'+i).style.position="relative"
                    document.getElementById('readouttext'+i).style.top="-20px"
                    document.getElementById('readouttext'+i).style.left=(3*(i-1)+"px")
                }
            }
            readouttext.style.position="relative"
            readouttext.style.top="-20px"
            readouttext.style.left=(3*(imagereadoutcount-1)+"px")
        }
        else{
            if(imagereadoutcount>1&&document.getElementById('readouttext'+(imagereadoutcount-1)).offsetLeft>=0){
                for(let i=1;i<imagereadoutcount;i++){
                    document.getElementById('readouttext'+i).style.position="absolute"
                    let down = 0
                    for(let u=1;u<i;u++) down+=Math.floor(document.getElementById('readouttext'+u).getBoundingClientRect().height)
                    document.getElementById('readouttext'+i).style.left="-"+Math.floor(document.getElementById('readouttext'+i).getBoundingClientRect().width)+"px"
                    document.getElementById('readouttext'+i).style.top=((i-1)*2)+down+"px"
                }
            }
            readouttext.style.position="absolute"
            let down = 0
            for(let i=1;i<imagereadoutcount;i++) down+=Math.floor(document.getElementById('readouttext'+i).getBoundingClientRect().height)
            readouttext.style.left="-"+(Math.floor(readouttext.getBoundingClientRect().width))+"px"
            readouttext.style.top=((imagereadoutcount-1)*(2))+down+"px"
        }
    }

    function clearimagereadout(){
        if (imagereadoutcount>0){
            for (let i=1;i<=imagereadoutcount;i++){
                document.getElementById('readouttext'+i).setAttribute("style","display:none")
            }
            imagereadoutcount=0
            readoutlinkvar=null
        }
    }

    function resizenow(linkvar,width,height){
        cancelactiveresizes();

        let cancelresize = new Promise((_, reject) => cancelactiveresizes = reject);

        if(towindowsize){
            if (window.innerWidth/imagestore[linkvar].width<window.innerHeight/imagestore[linkvar].height){
                height=Math.round(imagestore[linkvar].height*window.innerWidth/imagestore[linkvar].width)
                width=window.innerWidth
            }
            else{
                width=Math.round(imagestore[linkvar].width*window.innerHeight/imagestore[linkvar].height)
                height=window.innerHeight
            }
        }

        let imgbtmp = null


        let imgCanvas = document.createElement("canvas"),
            imgContext = imgCanvas.getContext("2d");

        imgCanvas.width=Math.round(width);
        imgCanvas.height=Math.round(height);
        imgContext.drawImage(imagestore[linkvar], 0, 0, imgCanvas.width, imgCanvas.height);

        let options = {cancelToken: cancelresize}

        let starttime = Date.now()

        resizer.resize(imagestore[linkvar], imgCanvas, options)
            .then(function () {
            imgCanvas.style.zIndex = 2147483648
            imgCanvas.style.visibility = "visible";
            imgCanvas.style.position="absolute";
            imgCanvas.style.pointerEvents="none";
            imgCanvas.style["box-shadow"]="0 0 100px black";

            if(towindowsize){
                if(mydiv==null){
                    mydiv=document.createElement('div')
                    mydiv.width="100%"
                    mydiv.height="100%"
                }
                mydiv.style.top=Math.round(getScrollTop()+window.innerHeight/2-height/2)+"px";
                if(bigscreensankaku&&width>=window.innerWidth-280){
                    mydiv.style.left=Math.round((window.innerWidth-280)/2-width/2+280-(width-(window.innerWidth-280))/2)+"px";
                }
                else if(bigscreensankaku){
                    mydiv.style.left=Math.round((window.innerWidth-280)/2-width/2+280)+"px";
                }
                else{
                    mydiv.style.left=Math.round(window.innerWidth/2-width/2)+"px";
                }
                mydiv.id="mydiv"
                mydiv.style.boxSizing="content-box"
                mydiv.style.zIndex = 2147483648
                mydiv.style.visibility = "visible";
                mydiv.style.position="absolute";
                mydiv.style.pointerEvents="none";
                mydiv.style.display = "block"

                let scaletime = Date.now()-starttime
                if (scaletime < 1000){
                    imagereadout("Scaling Complete "+(scaletime)+"ms",width,null,2)
                }
                else if (scaletime <10000){
                    imagereadout("Scaling Complete "+(Math.round(scaletime/100)/10)+"s",width,null,2)
                }
                else{
                    imagereadout("Scaling Complete "+(Math.round(scaletime/1000))+"s",width,null,2)
                }

                if(document.getElementById('upscaledimgcanvas2') !== null){
                    mydiv.replaceChild(imgCanvas,document.getElementById('upscaledimgcanvas2'));
                }
                else{
                    document.body.parentNode.insertBefore(mydiv,null);
                    mydiv.insertBefore(imgCanvas,null);
                }
                imgCanvas.id="upscaledimgcanvas2";
                setlast=2
            }
            else{
                if(document.getElementById('upscaledimgcanvas') !== null){
                    maindiv.replaceChild(imgCanvas,document.getElementById('upscaledimgcanvas'));
                }
                else{
                    maindiv.insertBefore(imgCanvas,maindiv.firstChild);
                }
                imgCanvas.id="upscaledimgcanvas";
                setlast=1
            }
            inprogress="null?"
            currentpic = linkvar
            clearTimeout(imagestore[linkvar+"myexpire"])
            imagestore[linkvar+"myexpire"]=setTimeout(purgeimage,purgewaittime,linkvar)
        })
            .catch(function (err) {

            inprogress="null?"
            throw err;
        });
    }

    function checkfordiv(){
        if (maindiv==null){
            let divs = document.getElementsByTagName("div")
            for (let div of divs) {
                if (div.style.zIndex == 2147483647) {
                    clearInterval(divchecking)
                    maindiv = div
                    resize_ob.observe(maindiv);
                }
            }
        }
    }


    function loop(){
        if (maindiv.style.display !== "none") {
        }
    }

    let downloadstarttime = null
    let bigscreensankaku = false
    let thingie = null
    let inprogressh = null
    let inprogressw = null

    let originalbutton = null

    let requestcount = 0
    let lastinprogress

    function isCanvas(i) {
        return i instanceof HTMLCanvasElement;
    }



    function grabimg_and_resize(linkvar,w,h){

        if(linkvar!==null &&linkvar!== undefined&&linkvar!== ""&&bigscreensankaku){
            if (imagestore[linkvar+"myoriginal"]){
                linkvar = imagestore[linkvar+"myoriginal"]
            }

            let linkvarsplit=null

            if(linkvar.search("sample")!==-1){
                linkvarsplit=linkvar.split("-")[1].split(".")[0]
            }
            else if(linkvar.search("preview")!==-1){
                linkvarsplit=linkvar.split("/")[7].split(".")[0]
            }
            else{
                linkvarsplit=linkvar.split("/")[6].split(".")[0]
            }

            let originalfound=false
            for(let key in imagestore){
                if(key.search("myexpire")==-1&&key.search("myoriginal")==-1&&key.search("preview")==-1){
                    let keysplit=null
                    if(key.search("sample")!==-1){
                        keysplit=key.split("-")[1].split(".")[0]
                    }
                    else{
                        keysplit=key.split("/")[6].split(".")[0]
                    }
                    if(key.search("sample")==-1){
                        if(linkvarsplit==keysplit){
                            linkvar = key
                            console.log("found previously saved original key | "+key)
                            originalfound=true
                            break
                        }
                    }
                }
            }
            if(linkvar.search("sample")==-1&&linkvar.search("preview")==-1){
                originalfound=true
            }
            if(!originalfound){

                for(let key in imagestore){
                    if(key.search("myexpire")==-1&&key.search("myoriginal")==-1&&key.search("preview")==-1){
                        let keysplit=null
                        if(key.search("sample")!==-1){
                            keysplit=key.split("-")[1].split(".")[0]
                        }
                        else{
                            keysplit=key.split("/")[6].split(".")[0]
                        }
                        if(linkvarsplit==keysplit){
                            linkvar=key
                            break
                        }
                    }
                }
            }
        }

        towindowsize=false
        if (bigscreensankaku||w<window.innerWidth && h<window.innerHeight && w==mainimg.naturalWidth || w<window.innerWidth && h<window.innerHeight && w>window.innerWidth-30 || w<window.innerWidth && h<window.innerHeight && h>window.innerHeight-30||bigscreensankaku){

            if (window.innerWidth/w<window.innerHeight/h){
                h=Math.round(h*window.innerWidth/w)
                w=window.innerWidth
            }
            else{
                w=Math.round(w*window.innerHeight/h)
                h=window.innerHeight
            }
            towindowsize = true
        }
        if(linkvar!==null &&linkvar!== undefined&&linkvar!== ""&&linkvar.split("?")[0]==inprogress.split("?")[0]&&inprogressh==h&&inprogressw==w){
        }
        else if (linkvar==currentpic&&inprogressh==h&&inprogressw==w){
            if(document.getElementById('mydiv')==null){
                mydiv=document.createElement('div')
                mydiv.width="100%"
                mydiv.height="100%"
            }
            else{
                mydiv = document.getElementById('mydiv')
                if(document.getElementById('upscaledimgcanvas2')){
                    w=document.getElementById('upscaledimgcanvas2').width
                    h=document.getElementById('upscaledimgcanvas2').height
                }
            }
            mydiv.style.top=Math.round(getScrollTop()+window.innerHeight/2-h/2)+"px";
            if(bigscreensankaku&&w>=window.innerWidth-280){
                mydiv.style.left=Math.round((window.innerWidth-280)/2-w/2+280-(w-(window.innerWidth-280))/2)+"px";
            }
            else if(bigscreensankaku){
                mydiv.style.left=Math.round((window.innerWidth-280)/2-w/2+280)+"px";
            }
            else{
                mydiv.style.left=Math.round(window.innerWidth/2-w/2)+"px";
            }
            mydiv.id="mydiv"
            if(document.getElementById('mydiv') !== null){
                if(setlast==2){
                    document.getElementById('mydiv').setAttribute("style","display: block;visibility: visible;z-index: 2147483647;box-sizing: content-box;position: absolute;pointer-events: none;top:"+document.getElementById('mydiv').style.top+";left:"+document.getElementById('mydiv').style.left+";")

                    document.getElementById('mydiv').style.top=Math.floor(getScrollTop()+window.innerHeight/2-h/2)+"px";
                }
            }
            if(document.getElementById('upscaledimgcanvas') !== null){
                if(setlast==1){
                    document.getElementById('upscaledimgcanvas').setAttribute("style","z-index: 2147483647;display:block;position:absolute;visibility:visible;")
                }
            }
        }
        else{

            if(linkvar!==null &&linkvar!== undefined&&linkvar!== ""){

                if(linkvar.search(".mp4")==-1&&linkvar.search(".webm")==-1&&linkvar.search(".flv")==-1){

                    if(inprogress.split("?")[0]!== linkvar.split("?")[0]){
                        cancelactiveresizes();

                        if(linkvar.search("sankakucomplex.com")!==-1){
                            let linkvarsplit
                            if(linkvar.search("sample")!==-1){
                                linkvarsplit=linkvar.split("-")[1].split(".")[0]
                            }
                            else if(linkvar.search("preview")!==-1){
                                linkvarsplit=linkvar.split("/")[7].split(".")[0]
                            }
                            else{
                                linkvarsplit=linkvar.split("/")[6].split(".")[0]
                            }
                            let lastinprogresssplit
                            if(lastinprogress&&lastinprogress!=="null?"){
                                if(lastinprogress.search("sample")!==-1){
                                    lastinprogresssplit=lastinprogress.split("-")[1].split(".")[0]
                                }
                                else if(lastinprogress.search("preview")!==-1){
                                    lastinprogresssplit=lastinprogress.split("/")[7].split(".")[0]
                                }
                                else{
                                    lastinprogresssplit=lastinprogress.split("/")[6].split(".")[0]
                                }
                            }
                        }

                        if(towindowsize){
                            let tempimage = document.createElement('img');
                            tempimage.setAttribute("src", linkvar);
                            tempimage.width = Math.round(w)
                            tempimage.height = Math.round(h)

                            tempimage.style.zIndex = 2147483648
                            tempimage.style.visibility = "visible";
                            tempimage.style.position="absolute";
                            tempimage.style.pointerEvents="none";
                            tempimage.style["box-shadow"]="0 0 100px black";

                            if(document.getElementById('mydiv')==null){
                                mydiv=document.createElement('div')
                                mydiv.width="100%"
                                mydiv.height="100%"
                            }
                            else{
                                mydiv = document.getElementById('mydiv')
                            }
                            mydiv.style.top=Math.round(getScrollTop()+window.innerHeight/2-h/2)+"px";
                            if(bigscreensankaku&&w>=window.innerWidth-280){
                                mydiv.style.left=Math.round((window.innerWidth-280)/2-w/2+280-(w-(window.innerWidth-280))/2)+"px";
                            }
                            else if(bigscreensankaku){
                                mydiv.style.left=Math.round((window.innerWidth-280)/2-w/2+280)+"px";
                            }
                            else{
                                mydiv.style.left=Math.round(window.innerWidth/2-w/2)+"px";
                            }
                            mydiv.id="mydiv"
                            mydiv.style.boxSizing="content-box"
                            mydiv.style.zIndex = 2147483648
                            mydiv.style.visibility = "visible";
                            mydiv.style.position="absolute";
                            mydiv.style.pointerEvents="none";
                            mydiv.style.display = "block"
                            if(document.getElementById('mydiv')==null){
                                document.body.parentNode.insertBefore(mydiv,null);
                            }
                            if(document.getElementById('upscaledimgcanvas2') !== null){
                                mydiv.replaceChild(tempimage,document.getElementById('upscaledimgcanvas2'));
                            }
                            else{
                                mydiv.insertBefore(tempimage,null)
                            }
                            tempimage.id="upscaledimgcanvas2";

                            clearimagereadout()

                            if(linkvar.search("sankakucomplex.com")!==-1){
                                imagereadout(getSankImageType(linkvar),w,linkvar)
                            }
                        }


                        lastinprogress=linkvar
                        inprogress = linkvar
                        inprogressh=h
                        inprogressw=w

                        let spin =0
                        function spinselect(input){
                            if(input==1) return "-"
                            if(input==2) return "\\"
                            if(input==3) return "|"
                            if(input==4) return "/"
                        }

                        function loadFailed(){
                            imagereadout("Failed to load image",w)
                        }

                        if(linkvar.search(".gif")==-1){
                            if (imagestore[linkvar]==null||imagestore[linkvar]==undefined){
                                requestcount+=1
                                let startsource = linkvar
                                let starttime = Date.now()
                                downloadstarttime = Date.now()
                                setTimeout(function() {
                                    imgfirstload = true
                                    GM_xmlhttpRequest({
                                        method: 'GET',
                                        url: startsource,
                                        responseType: 'blob',
                                        onload: function(resp) {
                                            let requesttime = Date.now()-downloadstarttime
                                            if (requesttime < 1000){
                                                imagereadout("Image Request "+(requesttime)+"ms",w,linkvar,2)
                                            }
                                            else if (requesttime <10000){
                                                imagereadout("Image Request "+(Math.round(requesttime/100)/10)+"s",w,linkvar,2)
                                            }
                                            else{
                                                imagereadout("Image Request "+(Math.round(requesttime/1000))+"s",w,linkvar,2)
                                            }
                                            imagereadout("Scaling... ",w)
                                            starttime = Date.now()
                                            if (resp.response.type !== "image/gif"){
                                                const img = new Image()
                                                img.onload = (event) => {
                                                    URL.revokeObjectURL(event.target.src)
                                                    imagestore[startsource] = document.createElement("canvas")
                                                    imagestore[startsource].width = img.width
                                                    imagestore[startsource].height = img.height
                                                    let ctx = imagestore[startsource].getContext("2d")
                                                    ctx.drawImage(event.target, 0, 0)
                                                    imagestore[startsource+"myexpire"]=setTimeout(purgeimage,purgewaittime,startsource)
                                                    if(mainimg!==null&&mainimg!==undefined){
                                                        if(startsource == mainimg.src && w!==imagestore[startsource].width) {
                                                            resizenow(linkvar,w,h);
                                                        }
                                                        else inprogress="null?"
                                                    }
                                                    if(thingie!==null){
                                                        if(startsource==thingie.src&&bigscreensankaku) {
                                                            resizenow(linkvar,w,h);
                                                        }
                                                        else inprogress="null?"
                                                    }
                                                }
                                                img.src = URL.createObjectURL(resp.response)
                                            }
                                        },
                                        onerror: loadFailed,
                                        onabort: loadFailed,
                                        onprogress: function(){
                                            spin+=1
                                            imagereadout("Requesting Image "+spinselect(spin)+" ",w,linkvar,2)
                                            if (spin>=4) spin=0
                                        },
                                        onloadstart: function(){
                                            starttime = Date.now()
                                            imagereadout("Requesting Image / ",w,linkvar)
                                        }
                                    });
                                }, 0);
                            }
                            else {
                                imagereadout("Scaling... ",w)
                                resizenow(linkvar,w,h);
                            }
                        }
                        else {
                            imagereadout("HQ Gif Scaling Not Supported")
                            inprogress="null?"
                        }
                    }
                }

                else{
                    cancelactiveresizes();
                    if(document.getElementById('mydiv') !== null){
                        if(document.getElementById('mydiv').style.display !== "none"){
                            document.getElementById('mydiv').setAttribute("style","display:none;top:"+document.getElementById('mydiv').style.top+";left:"+document.getElementById('mydiv').style.left+";")
                        }
                    }
                    if(document.getElementById('upscaledimgcanvas') !== null){
                        if(document.getElementById('upscaledimgcanvas').style.display !== "none" && document.getElementById('upscaledimgcanvas').style.display !== null){
                            document.getElementById('upscaledimgcanvas').setAttribute("style","display:none;top:"+document.getElementById('upscaledimgcanvas').style.top+";left:"+document.getElementById('upscaledimgcanvas').style.left+";")
                        }
                    }
                }

            }
            else{
                cancelactiveresizes();
                if(document.getElementById('mydiv') !== null){
                    if(document.getElementById('mydiv').style.display !== "none"){
                        document.getElementById('mydiv').setAttribute("style","display:none;top:"+document.getElementById('mydiv').style.top+";left:"+document.getElementById('mydiv').style.left+";")
                    }
                }
                if(document.getElementById('upscaledimgcanvas') !== null){
                    if(document.getElementById('upscaledimgcanvas').style.display !== "none" && document.getElementById('upscaledimgcanvas').style.display !== null){
                        document.getElementById('upscaledimgcanvas').setAttribute("style","display:none;top:"+document.getElementById('upscaledimgcanvas').style.top+";left:"+document.getElementById('upscaledimgcanvas').style.left+";")
                    }
                }
            }
        }

    }

    const resize_ob = new ResizeObserver(function(entries) {
        if(bigscreensankaku==false){
            cancelactiveresizes();

            let rect = entries[0].contentRect;

            let w = rect.width;
            let h = rect.height;

            if(document.getElementById('upscaledimgcanvas') !== null){
                document.getElementById('upscaledimgcanvas').setAttribute("style","display:none;top:"+document.getElementById('upscaledimgcanvas').style.top+";left:"+document.getElementById('upscaledimgcanvas').style.left+";")
            }
            if(document.getElementById('upscaledimgcanvas2') !== null){
                document.getElementById('mydiv').setAttribute("style","display:none;top:"+document.getElementById('mydiv').style.top+";left:"+document.getElementById('mydiv').style.left+";")
            }

            if (h !== 0){
                if(mainimg == null){
                    function checkforimg(input){
                        for (let elem of input){
                            if (elem.nodeName.toLowerCase() == "img") {
                                return elem;
                            }
                        }
                        return "wtf didn't find img"
                    }
                    mainimg = checkforimg(Array.from(maindiv.children))
                    mainimg.style.position="relative";
                    mainimg.style.zIndex=2147483646
                }

                grabimg_and_resize(mainimg.src,w,h)
            }
        }
    });

    let divchecking = setInterval(checkfordiv,300)

    function getScrollTop() {
        if (typeof window.pageYOffset !== "undefined" ) {
            return window.pageYOffset;
        }

        let d = document.documentElement;
        if (typeof d.clientHeight !== "undefined") {
            return d.scrollTop;
        }

        return document.body.scrollTop;
    }
    let lastthingietop = null
    let setlast = 0
    let thingietop = null
    let inprogress = "null?"

    const sankobservob = new MutationObserver(function(mutationsList, observer){

        if (bigscreensankaku){
            for (let elem of document.getElementsByClassName("swiper-slide swiper-slide-active")){
                if (elem.className.endsWith("active")){

                    thingietop = elem
                    thingie = elem.firstChild.firstChild.firstChild.firstChild
                    if(thingie!==null&&thingie!==undefined){
                        sankobservob.disconnect()
                        sankobservob.observe(thingietop, {attributes: true});
                        psankobservob.disconnect()
                        psankobservob.observe(thingie, {attributes: true, attributeOldValue: true});
                        grabimg_and_resize(thingie.src,thingie.naturalWidth,thingie.naturalHeight)
                        break
                    }
                }
            }
            lastthingietop = thingietop
        }
    })

    const psankobservob = new MutationObserver(function(mutationsList, observer){
        for(const mutation of mutationsList) {
            if (mutation.type=='attributes'&&mutation.attributeName=="src"&&bigscreensankaku&&thingietop.firstChild.firstChild.firstChild.firstChild==thingie){
                if(mutation.oldValue!==null&&mutation.oldValue!==undefined){
                    if (mutation.oldValue.search("sample")!==-1||mutation.oldValue.search("preview")!==-1){
                        if(thingie.src.search("sample")==-1&&thingie.src.search("preview")==-1){
                            imagestore[mutation.oldValue+"myoriginal"] = thingie.src
                        }
                    }
                }
                grabimg_and_resize(thingie.src,thingie.naturalWidth,thingie.naturalHeight)
            }

        }
    })

    const buttonob = new MutationObserver(function(){
        originalbutton.click();
    })

    document.addEventListener('keydown', function (zEvent) {
        if (zEvent.key == "m"){
            if(document.getElementById('mydiv') !== null){
                if(document.getElementById('mydiv').style.display !== "none"){
                    document.getElementById('mydiv').setAttribute("style","display:none;top:"+document.getElementById('mydiv').style.top+";left:"+document.getElementById('mydiv').style.left+";")
                    setlast = 2
                }
                else if(setlast==2){
                    document.getElementById('mydiv').setAttribute("style","display: block;visibility: visible;z-index: 2147483647;box-sizing: content-box;position: absolute;pointer-events: none;top:"+document.getElementById('mydiv').style.top+";left:"+document.getElementById('mydiv').style.left+";")
                }
            }
            if(document.getElementById('upscaledimgcanvas') !== null){
                if(document.getElementById('upscaledimgcanvas').style.display !== "none" && document.getElementById('upscaledimgcanvas').style.display !== null){
                    document.getElementById('upscaledimgcanvas').setAttribute("style","display:none;top:"+document.getElementById('upscaledimgcanvas').style.top+";left:"+document.getElementById('upscaledimgcanvas').style.left+";")
                    setlast = 1
                }
                else if(setlast==1){
                    document.getElementById('upscaledimgcanvas').setAttribute("style","z-index: 2147483647;display:block;position:absolute;visibility:visible;")
                }
            }
        }
        else if (zEvent.key == "n"){
            bigscreensankaku = !bigscreensankaku

            if (bigscreensankaku){
                for (let elem of document.getElementsByClassName("swiper-slide swiper-slide-active")){
                    if (elem.className.endsWith("active")){
                        thingietop = elem
                        thingie = elem.firstChild.firstChild.firstChild.firstChild
                        if(thingie!==null&&thingie!==undefined){
                            sankobservob.disconnect()
                            sankobservob.observe(thingietop, {attributes: true});
                            psankobservob.disconnect()
                            psankobservob.observe(thingie, {attributes: true, attributeOldValue: true});
                            grabimg_and_resize(thingie.src)
                            break
                        }
                    }
                }
            }
            else{
                psankobservob.disconnect()
                sankobservob.disconnect()
            }
            if(document.getElementById('mydiv') !== null){
                if(document.getElementById('mydiv').style.display !== "none"){
                    document.getElementById('mydiv').setAttribute("style","display:none;top:"+document.getElementById('mydiv').style.top+";left:"+document.getElementById('mydiv').style.left+";")
                }
            }
        }
        else if(zEvent.key == "0"){
            imagereadout("Waiting for server",null,inprogress!=="null?"?inprogress:currentpic)
            let originalsearch = document.getElementsByName("post_mode")
            if(originalsearch){
                for (let i = 0; i < originalsearch.length; i++) {
                    if(originalsearch[i].getAttribute("value") == "original"){
                        if(window.getComputedStyle(originalsearch[i]).getPropertyValue('color') !== "rgb(255, 140, 0)") {
                            originalsearch[i].click();
                            originalbutton = originalsearch[i]
                            let textsearch =document.getElementsByClassName('MuiTypography-root')
                            }
                    }
                }
            }
        }
    });

    let leftareasize = 20
    document.addEventListener('click', function (e) {
        if (e.button==0&&e.mozInputSource==1&&e.pageX <=leftareasize&&window.location.href.includes("/post/")){
            let listofel = document.getElementsByClassName("MuiButtonBase-root MuiFab-root")
            if(listofel){

                for (let i = 0; i < listofel.length; i++) {
                    if(listofel[i].getAttribute("aria-label") == "Prev"){
                        listofel[i].click();
                        break
                    }
                }
            }
        }
    });

    document.addEventListener('mousemove', e => {
        if(window.location.href.includes("https://beta.sankakucomplex.com")){
            if (e.pageX <=leftareasize&&!bigscreensankaku&&window.location.href.includes("/post/")){
                bigscreensankaku = !bigscreensankaku

                if (bigscreensankaku){
                    for (let elem of document.getElementsByClassName("swiper-slide swiper-slide-active")){
                        if (elem.className.endsWith("active")){
                            thingietop = elem
                            thingie = elem.firstChild.firstChild.firstChild.firstChild
                            if(thingie!==null&&thingie!==undefined){
                                sankobservob.disconnect()
                                sankobservob.observe(thingietop, {attributes: true});
                                psankobservob.disconnect()
                                psankobservob.observe(thingie, {attributes: true, attributeOldValue: true});
                                grabimg_and_resize(thingie.src,thingie.naturalWidth,thingie.naturalHeight)
                            }
                        }
                    }
                }
            }
            else if(e.pageX >leftareasize&&bigscreensankaku){
                bigscreensankaku = !bigscreensankaku
                cancelactiveresizes();
                psankobservob.disconnect()
                sankobservob.disconnect()
                if(document.getElementById('mydiv') !== null){
                    if(document.getElementById('mydiv').style.display !== "none"){
                        document.getElementById('mydiv').setAttribute("style","display:none;top:"+document.getElementById('mydiv').style.top+";left:"+document.getElementById('mydiv').style.left+";")
                    }
                }
            }
        }
    });
})();