// ==UserScript==
// @name        NutAID Consolidated Script
// @match       *://*/*
// @version     1.2.0-indev4
// @author      nutzlos
// @description Nut's All Image Downloader.
// @run-at      document-start
// @inject-into content
// @sandbox     DOM
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @connect     *

// @namespace https://greasyfork.org/users/1455562
// @downloadURL https://update.greasyfork.org/scripts/532237/NutAID%20Consolidated%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/532237/NutAID%20Consolidated%20Script.meta.js
// ==/UserScript==


(function (){
    const LOGGING = "console";   //possible values: false or "", "log" or true, "console"
    let OPTIONS = {
        trackingProtection: GM_getValue('trackingProtection', true),
        arbitraryFillStyle: GM_getValue('arbitraryFillStyle', false),
        allowText: GM_getValue('allowText', false),
        mergedDownloads: GM_getValue('mergedDownloads', false),
        binbMerging: GM_getValue('binbMerging', true),
        modifyImgSrcLoading: GM_getValue('modifyImgSrcLoading', false),
        keys: {
            toContext: 'xyyxyxyyxxxy',
            toPageTop: 'asaasssassaas'
        }
    }

    let keySeed = GM_getValue('communicationKey', {
        lastUsed: -Infinity,
        value: 0
    })
    //generate new one if key has been unused for more than 2 hours
    if (new Date() - keySeed.lastUsed > 7.2e6) {
        keySeed.value = (Math.random() * 1e16) & (0xffffffff)
    }
    keySeed.lastUsed = (new Date()).valueOf()
    GM_setValue('communicationKey', keySeed)

    const generateKey = ((seed) => {
        let state = seed
        const xorshift = () => {
            state ^= state << 13
            state ^= state >> 17
            state ^= state << 5
            return state
        }
        let cipher = 'abcdefghijklmnopQRSTUVWxyzABCDEFGHIJKLMNOPqrstuvwXYZ'
        return (length, maxLength) => {
            if (maxLength && maxLength != length) {
                length = Math.abs(xorshift() % (maxLength - length)) + length
            }
            let key = ''
            for (let i = length; i > 0; --i) {
                key += cipher.charAt(Math.abs(xorshift() % cipher.length))
            }
            return key
        }
    })(keySeed.value)

    OPTIONS.keys.toContext = generateKey(30)
    OPTIONS.keys.toPageTop = generateKey(30)


    let pageScript = function (OPTIONS){
        let targetWindow = this
        //cross origin iframes will not be able to dispatch events to the top level window.
        //even the content script cannot work around that without being detectable.
        //therefore, we need to add nested menus
        let windowtop = targetWindow //since this is run in an iframe for added isolation, the target window will be the parent
        try {
            while (windowtop != window.top) {
                if ('dispatchEvent' in windowtop.parent) {
                    windowtop = windowtop.parent
                } else {
                    break
                }
            }
        } catch (e) {}

        const logger = (function () {
            return (title, that, args) => {
                if (title.includes('toString')) return;
                let e = new CustomEvent(OPTIONS.keys.toPageTop, {
                    detail: {
                        action: 'log',
                        title: title,
                        that: that,
                        args: args,
                        context: targetWindow
                    }
                })
                windowtop.dispatchEvent(e)
            }
        })()

        if (targetWindow == windowtop) {
            function IndexTracker(){
                let values = []
                function getID(value) {
                    if (!value) return null;
                    let i = values.indexOf(value)
                    if (i < 0) {
                        values.push(value)
                        i = values.indexOf(value)
                    }
                    return i
                }
                return getID
            }
            const capturedFramesIndex = new IndexTracker()
            capturedFramesIndex(this)
            targetWindow.addEventListener(OPTIONS.keys.toPageTop, (e) => {
                e.detail.context = capturedFramesIndex(e.detail.context)
                let ev = new CustomEvent(OPTIONS.keys.toContext, {
                    detail: e.detail
                })
                dispatchEvent(ev)
            })
        }

        const canvasToBlob = HTMLCanvasElement.prototype.toBlob
        const ctxDrawImage = CanvasRenderingContext2D.prototype.drawImage
        const canvasToDataURL = HTMLCanvasElement.prototype.toDataURL
        const createUrlFromBlob = URL.createObjectURL
        const imgSetSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set

        let globalImageCounter = 0
        function captureNewImage(image = null, source = null, risky, scrambleParams) {
            //image = element the image was caught on, if applicable
            //source = the source object/element that was captured
            if (scrambleParams === undefined) {
                scrambleParams = dirtyFlag('get:params', image)
            }
            if (risky === undefined) {
                risky = dirtyFlag('get:risky', image) | dirtyFlag('get:risky', source)
            }
            let e = new CustomEvent(OPTIONS.keys.toPageTop, {
                detail: {
                    action: 'captureImage',
                    image: image,
                    source: source,
                    risky: risky,
                    scrambleParams: scrambleParams,
                    context: targetWindow
                }
            })
            windowtop.dispatchEvent(e)
            dirtyFlag('clear', image)
        }

        function extensionFromMimeType(mime) {
            let extension
            switch (mime) {
                case 'image/png':
                    extension = '.png'
                    break;
                case 'image/webp':
                    extension = '.webp'
                    break;
                case 'image/gif':
                    extension = '.gif'
                    break;
                case 'image/avif':
                    extension = '.avif'
                    break;
                case 'image/jxl':
                    extension = '.jxl'
                    break;
                case 'image/svg+xml':
                    extension = '.svg'
                    break;
                default:
                    extension = '.jpeg'
                    break
            }
            return extension
        }
        function GM_xmlhttpRequest_asyncWrapper (urlToFetch) {
            return new Promise((resolve, reject) => {
                let url = new URL(urlToFetch, location.href)
                let sameOrigin = urlToFetch.startsWith(location.origin)
                GM_xmlhttpRequest({
                    url: url.href,
                    responseType: 'blob',
                    anonymous: false,
                    headers: {
                        'Referer': location.origin + '/',
                        'Sec-Fetch-Dest': 'image',
                        'Sec-Fetch-Mode': 'no-cors',
                        'Sec-Fetch-Site': sameOrigin ? 'same-origin' : 'cross-site',
                        'Pragma': 'no-cache',
                        'Cache-Control': 'no-cache'
                    },
                    onload: resolve,
                    onerror: reject
                })
            })
        }
        async function fetchImg(url) {
            if (url.startsWith('http')) {
                let r = await GM_xmlhttpRequest_asyncWrapper(url)
                let mime = r.responseHeaders.match(/content-type: (.*)/i)
                return {
                    data: await r.response,
                    contentType: mime && mime[1]
                }
            } else {
                let r = await fetch(url, {cache: 'force-cache'})
                return {
                    data: await r.blob(),
                    contentType: r.headers.get('content-type')
                }
            }
        }

        async function dlAllImgs() {
            let promises = []
            let filenameCounter = 0
            let fileCompletedCounter = 0
            dledImgsCounterElement.innerText = '(0 imgs)'
            async function getImg(x, i) {
                const url = x.getAttribute('data-original') || x.getAttribute('data-src') || x.getAttribute('content')
                let img
                try {
                    img = await fetchImg(url)
                } catch (e) {
                    img = await fetchImg(x.src)
                }
                let extension = extensionFromMimeType(img.contentType)
                let filename = String(i).padStart(4, '0')
                dledImgsCounterElement.innerText = `(${++fileCompletedCounter} imgs)`
                return {
                    name: filename + extension,
                    data: await img.data.arrayBuffer()
                }
            }
            for (let x of document.getElementsByTagName('img')) {
                promises.push(getImg(x, ++filenameCounter))
            }
            Promise.allSettled(promises).then((p) => {
                let files = []
                p.map(x => (x.status == 'fulfilled') && files.push(x.value))
                let zipData = SimpleZip.GenerateZipFrom(files)
                let blob = new Blob([zipData], {type: "octet/stream"})
                var url = createUrlFromBlob(blob);
                createDownload(url, (+new Date())+'.zip')
                dledImgsCounterElement.innerText = ''
            })
        }

        let dirtyFlagPerCanvas = new Map()
        /* Layout of the objects for the above: {
         *        dirty: bool,
         *        risky: bool,
         *        timer: int,
         *        lastSource: drawImage source, //used for scrambled images
         *        drawImageSequence: [coords]   //scrambled images
    }*/
        function dirtyFlag(op, canvas, img_source=null, drawImageParams) {
            if (op.startsWith('set')) {
                let o = {
                    dirty: true,
                    risky: false,
                    timer: null,
                    lastSource: null,
                    drawImageSequence: []
                }
                if (dirtyFlagPerCanvas.has(canvas)) {
                    o = dirtyFlagPerCanvas.get(canvas)
                    o.dirty = true
                }
                if (img_source) {
                    o.lastSource = img_source
                }
                if (op.includes('+timer')) {
                    if (o.timer) {
                        clearTimeout(o.timer)
                    }
                    o.timer = setTimeout((y,z)=>captureNewImage(y, z), 500, canvas, img_source)
                }
                if (op.includes('+risky')) {
                    o.risky = true
                }
                if (op.includes('+params')) {
                    if (drawImageParams) o.drawImageSequence.push(drawImageParams)
                }
                dirtyFlagPerCanvas.set(canvas, o)
            }
            if (op == 'clear') {
                if (dirtyFlagPerCanvas.has(canvas)) {
                    o = dirtyFlagPerCanvas.get(canvas)
                    if (o.timer) {
                        clearTimeout(o.timer)
                    }
                    dirtyFlagPerCanvas.delete(canvas)
                }
            }
            if (op.startsWith('get')) {
                if (dirtyFlagPerCanvas.has(canvas)) {
                    o = dirtyFlagPerCanvas.get(canvas)
                    if (op == 'get:risky') {
                        return o.risky
                    }
                    if (op == 'get:source') {
                        return o.lastSource
                    }
                    if (op == 'get:params') {
                        return o.drawImageSequence
                    }
                    return o.dirty
                } else {
                    return false
                }
            }
        }



        const urlToBlobMapping = {}


        function setupIntercept(window){
            const funcsToConceil = new Map()
            const originalFuncs = new Map()
            const orig = (f) => originalFuncs.get(f)

            function createInterceptorFunction(originalFunction, newFunction, baseObj) {
                let originalProps = Object.getOwnPropertyDescriptors(originalFunction)
                let loggingTag = baseObj[Symbol.toStringTag]+'.'
                loggingTag += originalProps.name.value.includes(' ') ? `[${originalProps.name.value}]` : originalProps.name.value
                let interceptor = {
                    fuckShit(){
                        logger(loggingTag, this, arguments)
                        return newFunction.apply(this, arguments)
                    }
                }.fuckShit
                Object.defineProperties(interceptor, originalProps)
                funcsToConceil.set(interceptor, originalFunction)
                originalFuncs.set(newFunction, originalFunction)
                return interceptor
            }

            function interceptFunction(obj, prop, fun) {
                const old = obj[prop]
                let ifunc = createInterceptorFunction(old, fun, obj)
                obj[prop] = ifunc
            }
            function interceptProperty(obj, prop, getOrSet, fun) {
                const old = Object.getOwnPropertyDescriptor(obj, prop)
                if (typeof old[getOrSet] != 'function') {
                    console.warn('Risky interceptor for ', fun)
                    debugger
                }
                let ifunc = createInterceptorFunction(old[getOrSet], fun, obj)
                let x = {}
                x[getOrSet] = ifunc
                Object.defineProperty(obj, prop, x)
            }

            interceptFunction(window.Function.prototype, 'toString', function toString(){
                return orig(toString).apply(funcsToConceil.get(this)||this, arguments)
            })

            //image interception
            interceptFunction(window.CanvasRenderingContext2D.prototype, 'drawImage', function drawImage(...args) {
                //do what needs to be done
                let img_source = args[0], img

                let oldsrc = dirtyFlag('get:source', this.canvas)
                if (oldsrc && oldsrc != img_source) {
                    //source changes are sus, rip to be on the safe side
                    captureNewImage(this.canvas, oldsrc)
                    dirtyFlag('set+risky', this.canvas)
                }

                // if (img_source.toString() == "[object HTMLImageElement]" && img_source.naturalHeight == 0) debugger
                if (args.length == 3 || (
                        args.length == 5 &&
                        args[1] == 0 &&
                        args[2] == 0 &&
                        args[3] == img_source.width &&
                        args[4] == img_source.height
                    )
                ) {
                    //no cropping of the source image, or it covers the whole canvas
                    if (dirtyFlag('get', this.canvas)) {
                        captureNewImage(this.canvas, dirtyFlag('get:source', this.canvas))
                    }
                    //dirtyFlag('clear', this.canvas)   //done by captureNewImage, in theory that should be enough
                    let source = img_source

                    //set scrambling param just in case only part of the image is scrambled
                    //make the params compatible with the full length drawImage arguments
                    let fullLengthArgs = [
                        0, 0,                               //source origin
                        img_source.width, img_source.height,//source dimensions
                        0, 0,                               //target origin
                        img_source.width, img_source.height //target dimensions
                    ]
                    dirtyFlag('set+params', this.canvas, img_source, fullLengthArgs)

                    captureNewImage(this.canvas, img_source)
                } else if (args.length == 9) {
                    //need to canvas rip because the image is likely to be scrambled
                    dirtyFlag('set+timer+params', this.canvas, img_source, args.slice(1))
                }
                //call the proper function
                return ctxDrawImage.apply(this, args)
            })

            function ignoreSource(source) {
                let e = new CustomEvent(OPTIONS.keys.toPageTop, {
                    detail: {
                        action: 'ignoreSource',
                        source: source,
                        context: window
                    }
                })
                windowtop.dispatchEvent(e)
            }
            interceptFunction(window.HTMLCanvasElement.prototype, 'toBlob', function toBlob() {
                if (dirtyFlag('get', this)) {
                    let src = dirtyFlag('get:source', this)
                    //If no image made its way to the canvas, then there's no need to capture it
                    if (src) captureNewImage(this, src)
                }
                return canvasToBlob.call(this, (b)=>{
                    ignoreSource(b)
                    arguments[0](b)
                })
            })
            interceptFunction(window.HTMLCanvasElement.prototype, 'toDataURL', function toDataURL() {
                if (dirtyFlag('get', this)) {
                    let src = dirtyFlag('get:source', this)
                    //If no image made its way to the canvas, then there's no need to capture it
                    if (src) captureNewImage(this, src)
                }
                let uri = canvasToDataURL.apply(this, arguments)
                ignoreSource(uri)
                return uri
            })
            interceptFunction(window.CanvasRenderingContext2D.prototype, 'putImageData', function putImageData() {
                dirtyFlag('set+risky+timer', this.canvas)
                const ret = orig(putImageData).apply(this, arguments)
                if (arguments[0].width == this.canvas.width && arguments[0].height == this.canvas.height) {
                    captureNewImage(this.canvas, arguments[0])
                }
                return ret
            })
            interceptFunction(window.CanvasRenderingContext2D.prototype, 'createPattern', function createPattern() {
                //capture the image that's passed in but don't link it to this canvas as technically
                //nothing happened just yet and we don't want to reset the dirty flag just yet
                captureNewImage('canvaspattern', arguments[0])
                let pattern = orig(createPattern).apply(this, arguments)
                ignoreSource(pattern)
                return pattern
            })

            interceptFunction(window.URL, 'createObjectURL', function createObjectURL() {
                let url = createUrlFromBlob(...arguments)
                let blob = arguments[0]
                urlToBlobMapping[url] = blob
                let e = new CustomEvent(OPTIONS.keys.toPageTop, {
                    detail: {
                        action: 'urlToBlob',
                        url: url,
                        blob: blob,
                        context: window
                    }
                })
                windowtop.dispatchEvent(e)
                if (blob instanceof Blob && blob.type.startsWith('image')) {
                    captureNewImage('createObjectURL', blob)
                } else {
                    // blob.arrayBuffer().then(a => {
                    //     let u = new Uint8Array(a)
                    //     if (
                    //         (u[0] === 0xFF && u[1] === 0xD8 && u[2]  === 0xFF) ||    //JPG
                    //         (u[1] === 0x50 && u[2] === 0x4E && u[3]  === 0x47) ||    //PNG
                    //         (u[8] === 0x57 && u[9] === 0x45 && u[10] === 0x42) ||    //Web(P)
                    //         (u[0] === 0x47 && u[1] === 0x49 && u[2]  === 0x46)       //GIF
                    //     ) {
                    //         captureNewImage('createObjectURL', blob)
                    //     }
                    // })

                    //mime sniffing is clearly insufficient, there's too many image formats to hardcode, and there could be more in the future
                    let i = new Image()
                    i.onload = ()=> captureNewImage('createObjectURL', blob)
                    imgSetSrc.call(i, url)
                }
                return url
            })
            // interceptFunction(window.URL, 'revokeObjectURL', function revokeObjectURL() {
            //     return undefined
            // })
            interceptProperty(window.HTMLImageElement.prototype, 'src', 'set', function setSrc() {
                const url = arguments[0]
                if (url && url.startsWith('blob:') || url.startsWith('data:')) {
                    captureNewImage(this, url)
                    orig(setSrc).apply(this, arguments)
                } else if (OPTIONS.modifyImgSrcLoading && !this.crossOrigin) {
                    GM_xmlhttpRequest_asyncWrapper(url).then((resp) => {
                        captureNewImage(this, resp.response)
                        let u = URL.createObjectURL(resp.response)
                        orig(setSrc).call(this, u)
                    }).catch((e) => {
                        orig(setSrc).apply(this, arguments)
                    })
                } else {
                    captureNewImage(this, url)
                    orig(setSrc).apply(this, arguments)
                }
            })


            //block APIs useful for fingerprinting / tracking
            interceptFunction(window.CanvasRenderingContext2D.prototype, 'clearRect', function clearRect(){
                if (arguments[2] != this.canvas.width && arguments[3] != this.canvas.height) {
                    if (!OPTIONS.trackingProtection) {
                        dirtyFlag('set+risky', this.canvas)
                        return orig(clearRect).apply(this, arguments)
                    } else {
                        return
                    }
                }
                if (dirtyFlag('get', this.canvas)) {
                    let src = dirtyFlag('get:source', this.canvas)
                    if (src) captureNewImage(this.canvas, src)
                }
                return orig(clearRect).apply(this, arguments)
            })
            //setting canvas width/height can also clear the canvas
            interceptProperty(window.HTMLCanvasElement.prototype, 'width', 'set', function setWidth(){
                if (dirtyFlag('get', this)) {
                    let src = dirtyFlag('get:source', this)
                    //If no image made its way to the canvas, then there's no need to capture it
                    if (src) captureNewImage(this, src)
                }
                return orig(setWidth).apply(this, arguments)
            })
            interceptProperty(window.HTMLCanvasElement.prototype, 'width', 'set', function setHeight(){
                if (dirtyFlag('get', this)) {
                    let src = dirtyFlag('get:source', this)
                    //If no image made its way to the canvas, then there's no need to capture it
                    if (src) captureNewImage(this, src)
                }
                return orig(setHeight).apply(this, arguments)
            })
            interceptFunction(window.CanvasRenderingContext2D.prototype, 'fillRect', function fillRect(){
                if (arguments[2] != this.canvas.width && arguments[3] != this.canvas.height) {
                    if (!OPTIONS.trackingProtection) {
                        dirtyFlag('set+risky', this.canvas)
                        return orig(fillRect).apply(this, arguments)
                    } else {
                        return
                    }
                }
                if (dirtyFlag('get', this.canvas)) {
                    let src = dirtyFlag('get:source', this.canvas)
                    //If no image made its way to the canvas, then there's no need to capture it
                    if (src) captureNewImage(this.canvas, src)
                }
                if (OPTIONS.arbitraryFillStyle)
                    dirtyFlag('set+risky', this.canvas);
                return orig(fillRect).apply(this, arguments)
            })
            interceptFunction(window.CanvasRenderingContext2D.prototype, 'strokeRect', function strokeRect() {
                if (!OPTIONS.trackingProtection) {
                    dirtyFlag('set+risky', this.canvas)
                    return orig(strokeRect).apply(this, arguments)
                } else {
                    return
                }
            })
            interceptFunction(window.CanvasRenderingContext2D.prototype, 'fill', function fill() {
                if (!OPTIONS.trackingProtection) {
                    dirtyFlag('set+risky', this.canvas)
                    return orig(fill).apply(this, arguments)
                } else {
                    return
                }
            })
            interceptFunction(window.CanvasRenderingContext2D.prototype, 'stroke', function stroke() {
                if (!OPTIONS.trackingProtection) {
                    dirtyFlag('set+risky', this.canvas)
                    return orig(stroke).apply(this, arguments)
                } else {
                    return
                }
            })
            //should text be blocked too?
            //it can be useful despite tracking possibility
            //if we block transparency, that shouldn't pose too much of a risk
            interceptProperty(window.CanvasRenderingContext2D.prototype, 'globalAlpha', 'set', function setAlpha(){
                if (OPTIONS.trackingProtection) {
                    return orig(setAlpha).call(this, Math.round(arguments[0]))
                } else {
                    return orig(setAlpha).call(this, arguments[0])
                }
            })
            interceptProperty(window.CanvasRenderingContext2D.prototype, 'fillStyle', 'set', function setStyle(){
                if (OPTIONS.trackingProtection && !OPTIONS.arbitraryFillStyle) {
                    return orig(setStyle).call(this, '#f60')
                } else {
                    return orig(setStyle).apply(this, arguments)
                }
            })
            interceptFunction(window.CanvasRenderingContext2D.prototype, 'fillText', function fillText() {
                if (OPTIONS.trackingProtection && !OPTIONS.allowText) {
                    return
                } else {
                    dirtyFlag('set+risky', this.canvas)
                    return orig(fillText).apply(this, arguments)
                }
            })
            interceptFunction(window.CanvasRenderingContext2D.prototype, 'strokeText', function strokeText() {
                if (OPTIONS.trackingProtection && !OPTIONS.allowText) {
                    return
                } else {
                    dirtyFlag('set+risky', this.canvas)
                    return orig(strokeText).apply(this, arguments)
                }
            })


            // //don't let sites get away by sourcing their functions/prototypes from an iframe
            // interceptProperty(window.HTMLIFrameElement.prototype, 'contentWindow', 'get', function getIFrame(){
            //     let iframeWindow = orig(getIFrame).call(this)
            //     try {
            //         setupIntercept(iframeWindow)
            //     } catch (all) {}
            //     return iframeWindow
            // })

            // ^ should be handled by userscript manager
        }
        setupIntercept(targetWindow)

        console.log('cr page script loaded')
    }
    //insert page script into page
    let injectionScript = document.createElement('script')
    // ifr.src = 'about:blank'
    // let s = document.createElement('script')
    let injectionCode = `
        (${pageScript.toString()})(${JSON.stringify(OPTIONS)});
        document.currentScript.remove()
    `;
    let injectionBlob = new Blob([injectionCode], {type:'application/javascript'});
    let injectionUrl = URL.createObjectURL(injectionBlob);
    injectionScript.setAttribute('src', injectionUrl);
    (document.body || document.documentElement || document).insertAdjacentElement('afterbegin', injectionScript);


    //cross origin iframes will not be able to dispatch events to the top level window.
    //even the content script cannot work around that without being detectable.
    //therefore, we need to add nested menus
    let windowtop = window
    try {
        while (windowtop != window.top) {
            if ('dispatchEvent' in windowtop.parent) {
                windowtop = windowtop.parent
            } else {
                break
            }
        }
    } catch (e) {}

    //insert UI and Content script only once on the top level document
    if (window == windowtop) {

        function IndexTracker(){
            let values = []
            function getID(value) {
                if (!value) return null
                    let i = values.indexOf(value)
                    if (i < 0) {
                        values.push(value)
                        i = values.indexOf(value)
                    }
                    return i
            }
            return getID
        }


        let NutZip
        (()=>{
            NutZip=function(){const p="byteLength";async function d(d){const h=d.crcLut;return async function(e,t){var{nameLength:e,data:a}=d.file,r=function(e){let[t,a,r,n,o,s,f,i]=h,c=-1,u=0;for(var l,g,w=new Uint32Array(e.buffer,0,e.buffer.byteLength>>>2),p=4294967294&w.length;u<p;)l=w[u++]^c,g=w[u++],c=i[255&l]^f[l>>>8&255]^s[l>>>16&255]^o[l>>>24]^n[255&g]^r[g>>>8&255]^a[g>>>16&255]^t[g>>>24];let d=4*u;for(;d<e.length;)c=c>>>8^t[255&c^e[d++]];return~c}(a=new Uint8Array(a)),n=t?(o=a,n=new CompressionStream("deflate-raw"),o=new Response(o).body.pipeThrough(n),await new Response(o).arrayBuffer()):a.buffer,o=new ArrayBuffer(30),s=new DataView(o),f=new ArrayBuffer(46),i=new DataView(f),c=(g=new Date).getFullYear(),u=g.getMonth()+1,l=g.getDate(),g=g.getHours()<<11|g.getMinutes()<<5|g.getSeconds()>>>1,c=(c<1980?0:2107<c?127:c-1980)<<9|u<<5|l;let[w,p]=(u=a=>[(e,t)=>a.setUint16(e,t,!0),(e,t)=>a.setUint32(e,t,!0)])(s);return p(0,67324752),t?w(4,2580):w(4,2570),w(6,2048),t?w(8,8):w(8,0),w(10,g),w(12,c),p(14,r),p(18,n.byteLength),p(22,a.byteLength),w(26,e),[w,p]=u(i),p(0,33639248),w(4,2623),t?w(6,2580):w(6,2570),w(8,2048),t?w(10,8):w(10,0),w(12,g),w(14,c),p(16,r),p(20,n.byteLength),p(24,a.byteLength),w(28,e),{data:n,localHeader:o,centralHeader:f}}(0,d.compress)}const h=function(){var e=Array.from({length:8},()=>new Uint32Array(256)),[a,t,r,n,o,s,f,i]=e;for(let e=0;e<=255;e++){let t=e;for(let e=0;e<8;e++)t=t>>>1^3988292384*(1&t);a[e]=t}for(let e=0;e<=255;e++)t[e]=a[e]>>>8^a[255&a[e]],r[e]=t[e]>>>8^a[255&t[e]],n[e]=r[e]>>>8^a[255&r[e]],o[e]=n[e]>>>8^a[255&n[e]],s[e]=o[e]>>>8^a[255&o[e]],f[e]=s[e]>>>8^a[255&s[e]],i[e]=f[e]>>>8^a[255&f[e]];return e}(),y=new TextEncoder;return async function(e,a=!1){const r=e.map(e=>y.encode(e.name).buffer);var t,n,g=d,w=e.map((e,t)=>({args:{file:{data:e=(e="string"==typeof(e=e.data)?y.encode(e):e).buffer&&"object"==typeof e.buffer?e.buffer:e,nameLength:r[t][p]},compress:a,crcLut:h},transfer:[e]})),o=[];let s=0,f=0;for(t of c=await new Promise(r=>{const t=w.length;let n=t,a=-1,o=[],s=[];var e=`${(e=g).toString()};onmessage=async e=>{var a=await ${e.name}(e.data.p.args);let s=[];const t=e=>{if("object"==typeof e){"ArrayBuffer"==e[Symbol.toStringTag]&&s.push(e);for(var a of Object.values(e))t(a)}};t(a),postMessage({r:a,i:e.data.i},s)};`,f=URL.createObjectURL(new Blob([e])),i=Math.min(t,navigator.hardwareConcurrency);const c=e=>{++a<t&&e.postMessage({i:a,p:w[a]},w[a].transfer)};var u=e=>{var t=e.data.i;if(o[t]=e.data.r,0==--n){for(var a of s)a.terminate();r(o)}else c(e.srcElement)};for(let e=0;e<i;++e){var l=new Worker(f);l.onmessage=u,s.push(l),c(l)}}))t.offset=s,o.push(t.localHeader),o.push(r[f]),o.push(t.data),s+=t.localHeader[p]+r[f++][p]+t.data[p];let i=0;f=0;for(n of c)new DataView(n.centralHeader).setUint32(42,n.offset,!0),o.push(n.centralHeader),o.push(r[f]),i+=n.centralHeader[p]+r[f++][p];var c=new ArrayBuffer(22),u=(l=new DataView(c)).setUint32.bind(l),l=l.setUint16.bind(l);return u(0,101010256,!0),l(8,e.length,!0),l(10,e.length,!0),u(12,i,!0),u(16,s,!0),o.push(c),new Blob(o,{type:"application/zip"})}}();

        })()

        let LOG = '#,action,"origin object id",params\n'
        const logger = (function () {
            if (!LOGGING) return ()=>undefined;
            var logCount = 0
            var origins = new IndexTracker()
            const objToID = (obj, frame) => {
                let frameID = frame
                let i = origins(obj)
                return `#${frameID}/${i}`
            }
            return (title, that, args, frame) => {
                if (!that) that = '';
                if (that.canvas) that = that.canvas;
                let x = objToID(that, frame)
                let argumentArray = Array.from(args).map(
                    x => typeof x == 'object' ? objToID(x, frame) : x
                )
                LOG += [
                    logCount++,
                    title,
                    x,
                    `"${JSON.stringify(argumentArray).replaceAll('"', '""')}"`
                ].join(',') + "\n";
                if (LOGGING == 'console') console.debug(title, 'on', x, 'with args:', args);
            }
        })()



        let dledImgsCounterElement
        let overlay = document.createElement('tbody')
        document.addEventListener("DOMContentLoaded", (event) => {
            // let divName
            // do {
            //     divName = generateKey(3, 10)
            // } while ((document.getElementsByTagName(divName)).length)
            // const div = document.createElement(divName)
            const div = document.createElement('div')
            const shadow = div.attachShadow({mode: 'closed'})
            shadow.innerHTML = `
                <details id="_____cr" style="position: fixed; bottom: 0; left: 0; background-color: white; color: black; font-size: small; z-index: 99999999999999999;max-height:100%;max-width:100%">
                <div style="width: 300px; height: 300px; overflow: scroll">
                <div style="position:sticky;top:0;background:white;z-index:1">
                Bulk <button>download</button> all selected images <br>
                Selection: <button title="Select all found images.">All</button> <button title="Deselect all">None</button> <span title="Select all found images starting with the respective letter."><button>b</button> <button>c</button> <button>d</button> <button>e</button> <button>i</button> <button>p</button></span> <br>
                <details>
                <summary><small>Problems? Click here!</small></summary>
                <small style="padding-left: 1em; display: block;">
                <em> Changes to the below options will require reloading the page to take effect. </em>
                <details>
                <summary><input id="trackingProtection" type="checkbox"> Prevent insertion of tracking data </summary>
                <div style="padding-left: 1em; display: block;">
                This blocks several APIs often used to insert hidden tracking pixels or account-identifying watermarks. Of course, no protection measures can be 100% effective, and this is entirely useless if the site adds tracking data server-side. Also, this could potentially be detected by the website.
                <details>
                <summary><input id="arbitraryFillStyle" type="checkbox"> Allow arbitrary fillStyle</summary>
                Should for some reason images end up entirely orange, try ticking this checkbox. Note that websites might embed hidden tracking pixels this way.
                </details>
                <details>
                <summary><input id="allowText" type="checkbox"> Allow drawing text </summary>
                This poses a big risk of hidden watermark insertion but sometimes text drawn this way can include useful information.
                </details>
                <hr>
                </div>
                </details>
                <details>
                <summary><input id="mergedDownloads" type="checkbox"> Merge split pages (broken)</summary>
                Doesn't work properly at the moment, don't use this. If required, use the Firefox Add-On port of this userscript.
                </details>
                <details>
                <summary><input id="modifyImgSrcLoading" type="checkbox"> Modify &lt;img&gt; loading</summary>
                If images fail to load, cannot be captured or cannot be downloaded, try enabling this option. Intercepts most image loading and routes it through the UserScript manager to bypass CORS restrictions. This should be relatively safe, but could potentially be detected by the website.
                </details>
                <details>
                <summary><button>Download</button> all &lt;img&gt;s currently on the page <span id="dlcounter">(slow)</span></summary>
                Basically like the classic image downloading browser add-ons. Make sure to scroll through the entire page first to make sure all images have actually loaded. Note that this is completely unrelated to the captured image list and other functionality of this UserScript.
                </details>
                <details>
                <summary><button>Save</button> logs of intercepted functions</summary>
                For debugging purposes to investigate what a website might be doing.
                </details>
                </small>
                </details>
                <hr>
                </div>
                <table style="width:100%"></table>
                </div>
                <summary>Show</summary>
                </details>`
            let buttons = shadow.querySelectorAll('button')
            buttons[0].addEventListener('click', dlSelected)
            buttons[1].addEventListener('click', ()=>selectAll(true))
            buttons[2].addEventListener('click', ()=>selectAll(false))
            buttons[3].addEventListener('click', ()=>selectAllOf('b'))
            buttons[4].addEventListener('click', ()=>selectAllOf('c'))
            buttons[5].addEventListener('click', ()=>selectAllOf('d'))
            buttons[6].addEventListener('click', ()=>selectAllOf('e'))
            buttons[7].addEventListener('click', ()=>selectAllOf('i'))
            buttons[8].addEventListener('click', ()=>selectAllOf('p'))
            buttons[9].addEventListener('click', dlAllImgs)
            buttons[10].addEventListener('click', ()=> {
                createDownload('data:text/plain,'+encodeURIComponent(LOG), 'crlog'+(+new Date())+'.csv')
            })
            for (let x in OPTIONS) {
                if (typeof OPTIONS[x] != 'boolean') continue;
                let check = shadow.getElementById(x)
                if (!check) continue;
                check.checked = OPTIONS[x]
                check.addEventListener('change', function(){
                    GM_setValue(this.id, this.checked)
                })
            }
            dledImgsCounterElement = shadow.querySelector('#dlcounter')
            shadow.querySelector('table').appendChild(overlay)
            div.style.display = 'block'
            div.style.width = '0'
            div.style.height = '0'
            document.documentElement.appendChild(div)
        });

        const canvasToBlob = HTMLCanvasElement.prototype.toBlob
        const ctxDrawImage = CanvasRenderingContext2D.prototype.drawImage
        const canvasToDataURL = HTMLCanvasElement.prototype.toDataURL
        const createUrlFromBlob = URL.createObjectURL
        const imgSetSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set
        function ctob(canvas, ...args) {
            return new Promise(function(resolve) {
                canvasToBlob.apply(canvas, [resolve, ...args])
            })
        }

        const previewImageSize = 50

        const capturedImages = new Map()
        const ignoredSources = []
        let globalImageCounter = 0
        const captureNewImage = (function() {
            function copyImage(image) {
                if (typeof image == 'string') {
                    return copyToImg(image)
                }
                switch (image.toString()) {
                    case "[object HTMLImageElement]":
                        return copyToImg(image.src)
                        break
                    case "[object Blob]":
                        return copyToImg(createUrlFromBlob(image))
                        break
                    case "[object HTMLCanvasElement]":
                    default:
                        return copyToCanvas(image)
                }
            }
            function copyToImg(url) {
                let img = new Image()
                img.style.maxWidth = previewImageSize+'px'
                img.style.maxHeight = previewImageSize+'px'
                imgSetSrc.call(img, url)
                return img
            }
            function copyToCanvas(image, scramble) {
                if (!(scramble?.compare?.size > 1))
                    scramble = {};
                let c = document.createElement('canvas')
                c.width = scramble.w || image.naturalWidth || image.width
                c.height = scramble.h || image.naturalHeight || image.height
                c.style.maxWidth = previewImageSize+'px'
                c.style.maxHeight = previewImageSize+'px'
                let ctx = c.getContext('2d')
                if (scramble.compare && scramble.compare.size) {
                    ctxDrawImage.call(ctx, image, scramble.x, scramble.y, c.width, c.height, 0, 0, c.width, c.height)
                } else {
                    ctxDrawImage.call(ctx, image, 0, 0)
                }
                return c
            }
            function processScrramblingParams(params, thingToSave) {
                if (!params) params = [];
                const tTS_w = thingToSave.naturalWidth || thingToSave.width
                const tTS_h = thingToSave.naturalHeight || thingToSave.height
                let bounds = [Infinity, Infinity, -Infinity, -Infinity]
                for (let x of params) {
                    bounds[0] = Math.min(bounds[0], x[4])
                    bounds[1] = Math.min(bounds[1], x[5])
                    bounds[2] = Math.max(bounds[2], x[4]+x[6])
                    bounds[3] = Math.max(bounds[3], x[5]+x[7])
                }
                bounds[0] = Math.max(bounds[0], 0)
                bounds[1] = Math.max(bounds[1], 0)
                bounds[2] = Math.min(bounds[2], tTS_w)
                bounds[3] = Math.min(bounds[3], tTS_h)
                return {
                    w: bounds[2] - bounds[0],
                    h: bounds[3] - bounds[1],
                    x: bounds[0],
                    y: bounds[1],
                    compare: new Set((params || []).map(x => x.slice(0, 4).join()))
                }
            }
            function mergeImages(...images) {
                let yOffset = 0
                if (OPTIONS.binbMerging) {
                    yOffset = -4
                }
                let c = document.createElement('canvas')
                c.width = Math.max(...images.map(x => x.naturalWidth || x.width))
                c.height = images.reduce((a,x) => a + (x.naturalHeight || x.height), 0) + (images.length -1)*yOffset
                c.style.maxWidth = previewImageSize+'px'
                c.style.maxHeight = previewImageSize+'px'
                let ctx = c.getContext('2d')
                let y = 0
                for (let i of images) {
                    let x = Math.floor((c.width - (i.naturalWidth || i.width))*0.5)
                    ctxDrawImage.call(ctx, i, x, y)
                    y += (i.naturalHeight || i.height) + yOffset
                }
                return c
            }
            function addPageToPile(obj) {
                //image = element the image was caught on, if applicable
                //source = the source object/element that was captured
                let {
                    image,
                    source,
                    risky,
                    scrambleParams,
                    context
                } = obj

                let isImageData = false, isScrambled = Boolean(scrambleParams && scrambleParams.length > 1), isFiltered = false
                globalImageCounter++
                if (!source && image.toString() == "[object HTMLImageElement]") {
                    source = image.src
                }
                if (source.toString() == "[object HTMLImageElement]") {
                    source = source.src
                }
                if (source.toString() == "[object HTMLCanvasElement]") {
                    //carry over flags
                    risky |= dirtyFlag('get:risky', source)
                }
                if (image.toString() == "[object HTMLCanvasElement]") {
                    if (image.filter && image.filter != 'none') {
                        isFiltered = true
                    }
                }
                if (typeof source == 'string' && source.startsWith('blob:')) {
                    source = urlToBlobMapping[source]
                }
                //no idea how to effectively dedupe ImageData
                if (source.toString() == "[object ImageData]") {
                    //let's not keep that in memory too when we already never delete blobs
                    source = 'imagedata-' + globalImageCounter
                    isImageData = true
                }
                //there's probably more possible source types that I forgot, who cares
                if (ignoredSources.includes(source)) return false;

                const thingToSave = (isScrambled || isImageData || isFiltered)  ? image : source
                let scramble = processScrramblingParams(scrambleParams, thingToSave)

                let existing = capturedImages.get(source)
                if (!existing) {
                    //the template for a captured image entry
                    let obj = {
                        isScrambled: isScrambled,
                        individual: [{
                            savedImage: null,
                            scrambleParams: scramble.compare,
                            caughtOn: [image],
                            isRisky: !!risky
                        }],
                        combined: {}
                    }
                    let i = obj.individual[0]
                    if (isScrambled) {
                        let c = copyToCanvas(thingToSave, scramble)
                        i.savedImage = c
                    } else {
                        i.savedImage = copyImage(thingToSave)
                    }
                    capturedImages.set(source, obj)
                    obj.combined = i
                    return true
                } else {
                    if (isScrambled) {

                        //compare if the scrambleParams are the same
                        let exIdx
                        if (
                            existing.isScrambled &&
                            (exIdx = existing.individual.findIndex(x => x.scrambleParams.isSubsetOf(scramble.compare))) >= 0
                        ) {
                            //same params were captured once already
                            let exI = existing.individual[exIdx].savedImage
                            if (exI.width >= scramble.w && exI.height >= scramble.h) {
                                return false
                            } else {
                                //previous capture is likely to be incomplete, remove it and capture anew
                                existing.individual.splice(exIdx, 1)
                            }
                        }

                        let c = copyToCanvas(thingToSave, scramble)

                        if (existing.isScrambled) {
                            if (OPTIONS.mergedDownloads) {
                                let merged = mergeImages(existing.combined.savedImage, c)
                                let combi = {
                                    savedImage: merged,
                                 scrambleParams: '',
                                 caughtOn: existing.combined.caughtOn.slice(),
                                 isRisky: !!risky || existing.combined.risky
                                }
                                if (!combi.caughtOn.includes(image)) combi.caughtOn.push(image);
                                existing.combined = combi
                            }
                            existing.individual.push({
                                savedImage: c,
                                scrambleParams: scramble.compare,
                                caughtOn: [image],
                                isRisky: !!risky
                            })
                        } else {
                            //the still scrambled image was saved. discard it in favor of the now uncrambled addition
                            let obj = existing.combined //for whole images like the still scrambled page this should be the same object as individual[0]
                            obj.savedImage = copyImage(c)
                            obj.scrambleParams = scramble.compare.union(obj.scrambleParams)
                            if (!obj.caughtOn.includes(image)) obj.caughtOn.push(image);
                            obj.isRisky = !!risky || obj.isRisky
                            existing.isScrambled = true
                        }
                        return true
                    } else {
                        //probably the same thing, already exists
                        if (!existing.combined.caughtOn.includes(image))
                            existing.combined.caughtOn.push(image);
                        if (scramble.compare.size == 1)
                            existing.combined.scrambleParams = scramble.compare.union(existing.combined.scrambleParams);
                        return true
                    }
                }
            }
            return function(obj) {
                // console.log('captured Image:', obj)
                addPageToPile(obj) && updateOverlay()
            }
        })()

        function updateOverlay() {
            let sourcedFrom = {
                i: [],  //normal urls caught on img
                u: [],  //blob urls caught on img
                c: [],  //drawImage interception on canvases
                e: [],  //scrambled images first captured as normal img (E like scrambled Eggs)
                d: [],  //ImageData interception on canvases
                p: [],  //createPattern interception
                b: []   //createObjectURL interception
            }
            for (let x of capturedImages.entries()) {
                if (typeof x[0] == 'string') {
                    if (x[0].startsWith('imagedata')) {
                        sourcedFrom.d.push(x)
                    } else {
                        if (x[1].isScrambled) {
                            sourcedFrom.e.push(x)
                        } else {
                            sourcedFrom.i.push(x)
                        }
                    }
                } else {
                    if (typeof x[1].combined.caughtOn[0] == 'string') {
                        if (x[1].combined.caughtOn[0] == 'canvaspattern')
                            sourcedFrom.p.push(x);
                        else sourcedFrom.b.push(x)
                    } else {
                        if (x[1].combined.caughtOn[0] instanceof HTMLCanvasElement) {
                            sourcedFrom.c.push(x)
                        } else {
                            sourcedFrom.u.push(x)   //should in theory remain empty as any such image should have gone thorugh createObjectURL prior
                        }
                    }
                }
            }
            let docHTML = document.documentElement.innerHTML
            let b = sourcedFrom['b'].map(x=>({
                /* Looks up the corresponding blob URL, and finds it in the page HTML */
                i: docHTML.indexOf( Object.keys(urlToBlobMapping)[Object.values(urlToBlobMapping).indexOf(x[0])] ),
                                             x: x
            }))
            b.sort((a,b)=> a.i > b.i )
            sourcedFrom['b'] = b.map(x=>x.x)
            let allCanvases = Array.from(document.getElementsByTagName('canvas'))
            let allImgs = Array.from(document.getElementsByTagName('img'))
            overlay.innerHTML = ''
            for (let cat in sourcedFrom) {
                let offscreenCounter = 1
                for (let x of sourcedFrom[cat]) {
                    let name = cat
                    let origin = x[1].combined.caughtOn.find(x=>(x instanceof HTMLImageElement || x instanceof HTMLCanvasElement) && x.parentElement != null)
                    let allOfThem = origin && origin instanceof HTMLImageElement ? allImgs : allCanvases
                    let n = 0
                    if (origin && (n = allOfThem.findIndex(node => node.isSameNode(origin)) + 1) && allOfThem.length >= sourcedFrom[cat].length) {
                        name += String(n).padStart(4, '0')
                    } else {
                        name += '_' + String(offscreenCounter++).padStart(4, '0')
                    }
                    //TODO do something with the individual vs combined images
                    let y;
                    if (OPTIONS.mergedDownloads) {
                        y = [x[1].combined]
                    } else {
                        y = x[1].individual
                    }
                    for (let i = 0; i < y.length; i++) {
                        let name2 = name, fileInfo = ''
                        if (y.length > 1) {
                            name2 += '-' + String(i+1).padStart(2, '0')
                        } else {
                            if (x[0] instanceof Blob && x[0].type) {
                                fileInfo = extensionFromMimeType(x[0].type)
                            } else if (typeof x[0] == 'string' && x[0].startsWith('imagedata')) {
                                fileInfo = '.png'
                            }
                        }
                        let z = y[i].savedImage
                        let riskBg = y[i].isRisky ? 'background: #ffc;' : ''
                        overlay.insertAdjacentHTML('beforeend', `<tr style="height: ${previewImageSize+5}px; ${riskBg}">
                            <td><input type="checkbox"></td>
                            <td style="max-width: ${previewImageSize}px; max-height: ${previewImageSize}px; position: relative"></td>
                            <td>${name2}</td>
                            <td>${fileInfo}</td>
                            <td title="Download this image."><button>DL</button></td>
                            </tr>`)
                        let tds = overlay.lastChild.children
                        if (z) tds[1].appendChild(z)
                            tds[4].addEventListener('click', dl)
                    }
                }
            }
        }
        function selectAll(check = true) {
            for (let x of overlay.children) {
                x.children[0].firstChild.checked = check
            }
        }
        function selectAllOf(type) {
            for (let x of overlay.children) {
                x.children[0].firstChild.checked = x.children[2].innerText.startsWith(type)
            }
        }

        function extensionFromMimeType(mime) {
            let extension
            switch (mime) {
                case 'image/png':
                    extension = '.png'
                    break;
                case 'image/webp':
                    extension = '.webp'
                    break;
                case 'image/gif':
                    extension = '.gif'
                    break;
                case 'image/avif':
                    extension = '.avif'
                    break;
                case 'image/jxl':
                    extension = '.jxl'
                    break;
                case 'image/svg+xml':
                    extension = '.svg'
                    break;
                default:
                    extension = '.jpeg'
                    break
            }
            return extension
        }
        function createDownload(url, filename) {
            let a = document.createElement('a')
            a.href = url
            a.download = filename
            a.click()
        }
        function GM_xmlhttpRequest_asyncWrapper (urlToFetch) {
            return new Promise((resolve, reject) => {
                let url = new URL(urlToFetch, location.href)
                let sameOrigin = urlToFetch.startsWith(location.origin)
                GM_xmlhttpRequest({
                    url: url.href,
                    responseType: 'blob',
                    anonymous: false,
                    headers: {
                        'Referer': location.origin + '/',
                        'Sec-Fetch-Dest': 'image',
                        'Sec-Fetch-Mode': 'no-cors',
                        'Sec-Fetch-Site': sameOrigin ? 'same-origin' : 'cross-site',
                        'Pragma': 'no-cache',
                        'Cache-Control': 'no-cache'
                    },
                    onload: resolve,
                    onerror: reject
                })
            })
        }
        async function fetchImg(url) {
            if (url.startsWith('http')) {
                let r = await GM_xmlhttpRequest_asyncWrapper(url)
                let mime = r.responseHeaders.match(/content-type: (.*)/i)
                return {
                    data: await r.response,
                    contentType: mime && mime[1]
                }
            } else {
                let r = await fetch(url, {cache: 'force-cache'})
                return {
                    data: await r.blob(),
                    contentType: r.headers.get('content-type')
                }
            }
        }

        async function dl() {
            const url = this.parentElement.children[1].firstChild.src
            console.log(this, url)
            let img = await fetchImg(url)
            let extension = extensionFromMimeType(img.contentType)
            let objurl = createUrlFromBlob(img.data)
            createDownload(objurl, this.parentElement.children[2].innerText + extension)
        }

        async function dlSelected() {
            let files = []
            let filenames = []
            // for (let x of overlay.children) {
            //     if (x.children[0].firstChild.checked) {
            //         try {
            //             let img, extension
            //             if (x.children[1].firstChild.toString() == "[object HTMLImageElement]") {
            //                 const url = x.children[1].firstChild.src
            //                 let req = await fetchImg(url)
            //                 extension = extensionFromMimeType(req.contentType)
            //                 img = req.data
            //             } else if (x.children[1].firstChild.toString() == "[object HTMLCanvasElement]") {
            //                 img = await ctob(x.children[1].firstChild)
            //                 extension = '.png'
            //             }
            //             let filename = x.children[2].innerText
            //             let filenameCount = filenames.reduce((a,x)=>a+(x==filename?1:0), 0)
            //             filenames.push(filename)
            //             if (filenameCount) filename += ' ('+(filenameCount+1)+')';
            //             files.push({
            //                 name: filename + extension,
            //                 data: await img.arrayBuffer()
            //             })
            //         } catch (e) {}
            //     }
            // }
            await Promise.allSettled(Array.from(overlay.children).map(async x => {
                if (x.children[0].firstChild.checked) {
                    try {
                        let img, extension
                        if (x.children[1].firstChild.toString() == "[object HTMLImageElement]") {
                            const url = x.children[1].firstChild.src
                            let req = await fetchImg(url)
                            extension = extensionFromMimeType(req.contentType)
                            img = req.data
                        } else if (x.children[1].firstChild.toString() == "[object HTMLCanvasElement]") {
                            img = await ctob(x.children[1].firstChild)
                            extension = '.png'
                        }
                        let filename = x.children[2].innerText
                        let filenameCount = filenames.reduce((a,x)=>a+(x==filename?1:0), 0)
                        filenames.push(filename)
                        if (filenameCount) filename += ' ('+(filenameCount+1)+')';
                        files.push({
                            name: filename + extension,
                            data: await img.arrayBuffer()
                        })
                    } catch (e) {}
                };
            }))
            let zipData = await NutZip(files)
            let blob = new Blob([zipData], {type: "octet/stream"})
            var url = createUrlFromBlob(blob);
            createDownload(url, (+new Date())+'.zip')
        }

        async function dlAllImgs() {
            let promises = []
            let filenameCounter = 0
            let fileCompletedCounter = 0
            dledImgsCounterElement.innerText = '(0 imgs)'
            async function getImg(x, i) {
                const url = x.getAttribute('data-original') || x.getAttribute('data-src') || x.getAttribute('content')
                let img
                try {
                    img = await fetchImg(url)
                } catch (e) {
                    img = await fetchImg(x.src)
                }
                let extension = extensionFromMimeType(img.contentType)
                let filename = String(i).padStart(4, '0')
                dledImgsCounterElement.innerText = `(${++fileCompletedCounter} imgs)`
                return {
                    name: filename + extension,
                    data: await img.data.arrayBuffer()
                }
            }
            for (let x of document.getElementsByTagName('img')) {
                promises.push(getImg(x, ++filenameCounter))
            }
            Promise.allSettled(promises).then((p) => {
                let files = []
                p.map(x => (x.status == 'fulfilled') && files.push(x.value))
                let zipData = SimpleZip.GenerateZipFrom(files)
                let blob = new Blob([zipData], {type: "octet/stream"})
                var url = createUrlFromBlob(blob);
                createDownload(url, (+new Date())+'.zip')
                dledImgsCounterElement.innerText = ''
            })
        }



        const urlToBlobMapping = {}


        window.addEventListener(OPTIONS.keys.toContext, (e) => {
            switch (e.detail.action) {
                case 'log':
                    logger(e.detail.title, e.detail.that, e.detail.args, e.detail.context)
                    break
                case 'captureImage':
                    captureNewImage(e.detail)
                    break
                case 'urlToBlob':
                    urlToBlobMapping[e.detail.url] = e.detail.blob
                    break
                case 'ignoreSource':
                    ignoredSources.push(e.detail.source)
                    break
            }
        })

    }

    console.log('cr loaded')
})()
