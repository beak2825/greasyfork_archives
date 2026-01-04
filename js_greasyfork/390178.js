// ==UserScript==
// @name         Black HyRead
// @namespace    Yr
// @version      1.0
// @description  Download hyread ebook
// @author       toudaimori
// @match        https://service.ebook.hyread.com.tw/ebookservice/epubreader/hyread/v3/reader.jsp
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js
// @grant    GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/390178/Black%20HyRead.user.js
// @updateURL https://update.greasyfork.org/scripts/390178/Black%20HyRead.meta.js
// ==/UserScript==

var container = []

async function Download(event)
{
    event.stopPropagation()

    const realContainer = []
    for(let i = 0; i < container.length; ++i){
        console.log(i, container[i])
        realContainer.push(await getImageBase64(i, container[i]))
    }

    Compress('Download', realContainer)
}

function Compress(title, pics)
{
    return new Promise((resolve, reject) => {
        console.log(`Start Compress`)
        const zip = new JSZip()
        const folder = zip.folder(`${title}`);
        for(let i = 0; i < pics.length; ++i){
            folder.file(`${pics[i].index}.jpg`, pics[i].base64, {base64: true})
        }

        zip.generateAsync({type:"blob", streamFiles: true}, metadata => {
            console.log(`Compress Progress = ${metadata.percent} %`)
        })
        .then((content) => {
            // see FileSaver.js
            console.log(`All Done, Save to ${title}.zip`);
            resolve(saveAs(content, `${title}.zip`))
        });
    })
}

async function processSinglePage(){
    const pages = [...document.querySelectorAll('.hyr-hejview__content')].map(x => x.style['background-image'])
    pages.filter(x => x.match(/(blob.*)\"/)).map(x => container.push(x.match(/(blob.*)\"/)[1]))

    container = [...new Set(container)]
    document.title = `HyRead (${container.length})`
}

function getImageBase64(index, path)
{
    return new Promise((resolve, reject) => {
        const extension = path.substring(path.lastIndexOf('.') + 1)
        GM.xmlHttpRequest({
            method: "GET",
            url: path,
            overrideMimeType: 'text/plain; charset=x-user-defined',
            onload: response => {
                let binary = "";
                const responseText = response.responseText;
                const responseTextLen = responseText.length;
                for ( let i = 0; i < responseTextLen; i++ ) {
                    binary += String.fromCharCode(responseText.charCodeAt(i) & 255)
                }

                // Note there is no 'data:image/jpeg;base64,' Due to JSZip
                let src = btoa(binary)

                console.log(`Downloaded: ${index}.${extension}, src=${path}`)
                resolve({'index': index, 'base64': src, 'extension': extension })
            }
        })
    })
}

const btn = $(`<a id="yrBtn" style="position: absolute;top: 50px;left: 10px;">下載</a>`)

$('body').append(btn)

btn.on('click', event => {
    console.log('click')
    Download(event)
})

setInterval(processSinglePage, 500)