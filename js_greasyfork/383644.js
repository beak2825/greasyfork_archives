// ==UserScript==
// @name     Accipiter
// @namespace yrAccipiter
// @include    /http(s?):\/\/ahri\.[a-zA-Z]*\/post.php\?ID=[0-9]*/
// @include    /http(s?):\/\/ahri-hentai\.[a-zA-Z]*\/post.php\?ID=[0-9]*/
// @description  Collect Squirrels
// @author       toudaimori
// @version  1.7
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js
// @grant    GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/383644/Accipiter.user.js
// @updateURL https://update.greasyfork.org/scripts/383644/Accipiter.meta.js
// ==/UserScript==

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

function Compress(metaData, pics)
{
    return new Promise((resolve, reject) => {
        console.log(`Start Compress`)
        const zip = new JSZip()
        const folder = zip.folder(`${metaData.title}`);
        for(let i = 0; i < pics.length; ++i){
            folder.file(`${pics[i].index}.${pics[i].extension}`, pics[i].base64, {base64: true})
        }

        zip.generateAsync({type:"blob", streamFiles: true}, metadata => {
            console.log(`Compress Progress = ${metadata.percent} %`)
        })
        .then((content) => {
            // see FileSaver.js
            console.log(`All Done, Save to ${metaData.title}.zip`);
            resolve(saveAs(content, `${metaData.title}.zip`))
        });
    })
}

function downloadWrapper(metaData)
{
    return new Promise((resolve, reject) => {
        let prefix = metaData['HTTP_IMAGE']
        let tasks = []

        metaData['Original_Image_List'].map( x => {
            const src = `${prefix}${x['new_filename']}_w1100.${x['extension']}`
            const index = x['sort']
            const checkImage = getImageBase64(index, src)
            tasks.push(checkImage)
        })

        Promise.all(tasks).then(result => {
            Compress(metaData, result)
            resolve()
        })
    })
}

function __main__ ()
{
    // get last download button
    const downloadBtn = $('.page-title')
    const btnText = `<span style="padding-left: 5px;"><a class="btn btn-success" href="#" id="YrDownload" value="false"><i class="fa fa-download"></i>&nbsp;&nbsp;ダウンロード</a></span>`
    const btn = $(downloadBtn).append(btnText)

    btn.click(event => {
        event.preventDefault()
        event.stopPropagation()

        if(event.target.getAttribute('value') === true){
            return
        }
        else{
            event.target.setAttribute('value',  true)
            event.target.style['opacity'] = 0.0
        }

        const title = $('.page-title > h1 > a')[0].text.trim()
        const id = location.search.substring(1).split('&').reduce((acc,ele) => { return ele.indexOf('ID') === 0 ? acc.concat(ele) : acc }, '').split('=')[1]

        const domain = 'https://ahri.club'
        const site = `${domain}/readOnline2.php?ID=${id}&host_id=0&page=0`

        console.log(`Start Download ${title}`)

        GM.xmlHttpRequest({
          method: "GET",
          url: site,
          onload: response => {
            let script = ''
            const data = response.responseText
            try{
                if(data.indexOf('is_login = false;') === -1){
                    console.log(`Detect Login!`)
                    // use 'host_id = \'0\'; ' as sceond param instead of 'var rsh = false;'
                    // to avoid '_' not defined when eval the script
                    script = data.substring(data.indexOf('var HTTP_IMAGE = '),data.indexOf('host_id = \'0\'; '))
                }
                else{
                    script = data.substring(data.indexOf('var HTTP_IMAGE = '),data.indexOf('is_login = false;'))
                }

                // Eval Script To get data from javaScript
                eval(script)
            }
            catch(err){
                console.error(err)
            }

            if(Original_Image_List === undefined){
                throw new Error(`Parsing Error!`)
            }
            else{
                let map = []
                Original_Image_List = Original_Image_List.reduce((acc, ele) => {
                    if(map.indexOf(ele.sort) === -1){
                        map.push(ele.sort)
                        return acc.concat(ele)
                    }
                    else{
                        return acc
                    }
                }, [])
                downloadWrapper({'HTTP_IMAGE': HTTP_IMAGE, 'Original_Image_List': Original_Image_List, title: title, id: id})
                    .then(() => doneDownload)
            }
          }
        })
    })
}

function doneDownload()
{
    $('#YrDownload')[0].style['opacity'] = 1
    $('#YrDownload')[0].setAttribute('value',  false)
}

const $ = jQuery.noConflict()
$(document).ready(__main__)