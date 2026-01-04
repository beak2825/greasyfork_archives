// ==UserScript==
// @name         natsureiTempFixMangaDownloader
// @version      0.4
// @license      GPL-3.0
// @author       Natsurei
// @run-at document-start
// @description  temp for manga-bang.com
// @icon         https://bookwalker.jp/favicon.ico
// @match        https://comics.manga-bang.com/episodes/*
// @match        https://alpha.comics.manga-bang.com/episodes/*
// @match        https://carula.jp/episodes/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/jimp@0.22.10/browser/lib/jimp.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @require      https://greasyfork.org/scripts/451814-publuspage/code/PublusPage.js?version=1159347
// @require      https://greasyfork.org/scripts/451811-publusconfigdecoder/code/PublusConfigDecoder.js?version=1096709
// @require      https://greasyfork.org/scripts/451813-publusnovelpage/code/PublusNovelPage.js?version=1128858

// @grant        GM_info
// @grant        unsafeWindow

// @namespace https://greasyfork.org/users/1242405
// @downloadURL https://update.greasyfork.org/scripts/483738/natsureiTempFixMangaDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/483738/natsureiTempFixMangaDownloader.meta.js
// ==/UserScript==

function handlescramble(scramble) {
    let nr=[]
    for (let er = 4, tr = 4, rr = 0, ir = 0; ir < er; ir++)
        for (let or = 0; or < tr; or++)
            nr[rr++] = [ir, or];
    for (var n = nr.length, r = [], i = scramble.replace(/\s+/g, "").slice(1).slice(0, -1).split(","), o = 0; o < n; o++)
        r.push(nr[i[o]]);
    return r
}

function getRowAndColByOrder(order){
    console.log(order)
    let nr=[]
    for (let er = 4, tr = 4, rr = 0, ir = 0; ir < er; ir++)
        for (let or = 0; or < tr; or++)
            nr[rr++] = [ir, or];
    console.log(nr)
    return nr[order]
}


async function getSpaceByOrder(JimpImg,order,{spaceWidth,spaceHeight,size}){
    const [row,col]=await getRowAndColByOrder(order,size)
    const clone=await JimpImg.clone()
    console.log("row:",row,"col:",col,"x:",(col)*spaceWidth,"y:",(row)*spaceHeight)
    return clone.crop((col)*spaceWidth,(row)*spaceHeight,spaceWidth,spaceHeight)
}

async function getDecryptedImage(img,spaceSize=4) {
    const imgBuffer=await axios.get(img.imageUrl, { responseType: 'arraybuffer' })
    const scrambleArray=handlescramble(img.scramble)
    // console.log("scrambleArray",scrambleArray)
    const JimpImg=await Jimp.read(imgBuffer.data)
    const spaceWidth=Math.floor(JimpImg.bitmap.width/spaceSize);
    const spaceHeight=Math.floor(JimpImg.bitmap.height/spaceSize);
    // const newImg=new Jimp({ data: buffer, width: impImg.bitmap.width, height: JimpImg.bitmap.height });
    const newImage=new Jimp(JimpImg.bitmap.width, JimpImg.bitmap.height, "#FFFFFF");
    // console.log("newImage1",newImage)
    for(let i=0;i<spaceSize*spaceSize;i++){
        const [row,col]=scrambleArray[i]
        const currentSpace=await getSpaceByOrder(JimpImg,row+col*4,{spaceWidth,spaceHeight,size:spaceSize})
        // console.log(currentSpace)
        // const [col,row]=getRowAndColByOrder(realOrder,spaceSize)
        const [fromCol,fromRow]=getRowAndColByOrder(i,spaceSize)
        // console.log("scrambleArray ",scrambleArray[i],"order:",i)
        // console.log("From ","row:",fromRow,"col:",fromCol,"order:",i)
        // console.log("Draw ","row:",row,"col:",col)
        await newImage.composite(currentSpace,(fromCol)*spaceWidth,(fromRow)*spaceHeight,{
            mode: Jimp.BLEND_SOURCE_OVER,
            // opacitySource: 0,
            // opacityDest: 1,
        })
    }
    console.log("newImag2",newImage)

    return await newImage.getBufferAsync(Jimp.MIME_JPEG)
}

(async function(axios, JSZip, saveAs, ImageDownloader, PublusConfigDecoder, PublusPage, PublusNovelPage) {
    'use strict';

    function getImagePromisesFunc(imageData){
        // const scrambleArray=JSON.parse(scramble)
        return function getImagePromises(startNum, endNum) {
            return imageData
                .slice(startNum - 1, endNum)
                .map((data,index) => (
                getDecryptedImage(data)
            ).then(ImageDownloader.fulfillHandler).catch(ImageDownloader.rejectHandler));
        }
    }
    const originFetch = fetch;
    console.log(originFetch);
    window.unsafeWindow.fetch = (url, options) => {
        console.log('外层捕获请求',url);
        return originFetch(url, options).then(async (response) => {
            console.log('内层捕获请求',url);
            const catchSite=[
                'https://comics.manga-bang.com/book/contentsInfo',
                'https://alpha.comics.manga-bang.com/book/contentsInfo',
                'https://carula.jp/book/contentsInfo']
            let isMatched=catchSite.some(site=>{
                if(url.startsWith (site)){
                    return true
                }
                return false
            })
            if (isMatched) {
                console.log('捕获链接',url);
                const responseClone = response.clone();
                let res = await responseClone.json();
                console.log(res)
                if(res?.result?.length>2){
                    ImageDownloader.init({
                        maxImageAmount:res?.result?.length,
                        getImagePromises:getImagePromisesFunc(res?.result),
                        title: "Untitled",
                        imageSuffix: 'jpeg',
                        zipOptions: {  }
                    });
                }
                const responseNew = new Response(JSON.stringify(res), response);
                return responseNew;
            } else {
                return response;

            }
        });
    };

})(axios, JSZip, saveAs, ImageDownloader, PublusConfigDecoder, PublusPage, PublusNovelPage);