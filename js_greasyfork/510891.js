// ==UserScript==
// @name         GGn Epic Games Store Cover Replacer
// @namespace    none
// @version      4
// @description  Easily replace cover using Epic Games Store images
// @author       ingts
// @match        https://gazellegames.net/torrents.php?id=*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      store.epicgames.com
// @connect      store-content.ak.epicgames.com
// @connect      litterbox.catbox.moe
// @require      https://update.greasyfork.org/scripts/541342/GGn%20Corner%20Button.js
// @downloadURL https://update.greasyfork.org/scripts/510891/GGn%20Epic%20Games%20Store%20Cover%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/510891/GGn%20Epic%20Games%20Store%20Cover%20Replacer.meta.js
// ==/UserScript==

function fillOptions(options = {
    method: "GET",
    responseType: "json",
    onSuccess: (response) => {
        return JSON.parse(response.responseText)
    }
}) {
    options.method = options.method || "GET"
    options.responseType = options.responseType || "json"
    if (!options.onSuccess) {
        options.onSuccess = (response) => {
            return JSON.parse(response.responseText)
        }
    }
    return options
}

function doFetch(url, options = {
    method: "GET",
    responseType: "json",
    onSuccess: (response) => {
        return JSON.parse(response.responseText)
    }
}) {
    const fullOptions = fillOptions(options)

    let resolve, reject
    let responsePromise = new Promise((promiseResolve, promiseReject) => {
        resolve = promiseResolve
        reject = promiseReject
    })


    GM_xmlhttpRequest({
        url: url,
        method: fullOptions.method,
        responseType: fullOptions.responseType,
        headers: {
            'accept': 'application/json',
        },
        data: fullOptions.body,
        onload: (response) => {
            if (response.status < 200 || response.status >= 400) {
                console.error(response.responseText, url)
                reject(response)
            } else {
                resolve(fullOptions.onSuccess(response))
            }
        }
    })
    return responsePromise
}

function graphql(query, variables, extensions) {
    const jsonVariables = JSON.stringify(variables)
    const jsonExtensions = JSON.stringify(extensions)
    const url = `https://store.epicgames.com/graphql?operationName=${query}&variables=${jsonVariables}&extensions=${jsonExtensions}`
    return doFetch(url).then(response => response.data)
}

function getMappingByPageSlug(slug) {
    const variables = {
        pageSlug: slug,
        locale: "en-US",
    }
    const extensions = {
        persistedQuery: {
            version: 1,
            sha256Hash: "781fd69ec8116125fa8dc245c0838198cdf5283e31647d08dfa27f45ee8b1f30",
        }
    }

    return graphql("getMappingByPageSlug", variables, extensions)
}

function getProductMapping(slug) {
    return doFetch(`https://store-content.ak.epicgames.com/api/en-US/content/products/${slug}`)
}

function getCatalogOffer(identifiers) {
    const variables = {
        country: "US",
        locale: "en-US",
        sandboxId: identifiers.sandboxId,
        offerId: identifiers.offerId,
    }
    const extensions = {
        persistedQuery: {
            version: 1,
            sha256Hash: "abafd6e0aa80535c43676f533f0283c7f5214a59e9fae6ebfb37bed1b1bb2e9b", // if this changes again, need to get it from page source
        }
    }

    return graphql("getCatalogOffer", variables, extensions).then(data => data?.Catalog.catalogOffer)
}


function ptpimg(url) {
    return fetch(`imgup.php?img=${url}`)
        .then(res => res.text())
        .then(text => {
            if (text === "https://ptpimg.me/.") {
                throw new Error()
            }
            return text
        })
        .catch(() => {
            alert('PTPimg upload failed')
        })
}

function submitCover(body) {
    return fetch('torrents.php', {
        method: 'post',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: body
    })
        .then(r => {
            if (!r.redirected) {
                throw Error
            }
        })
        .catch(() => {
            alert(`Failed to submit`)
        })
}

function promiseXHR(url, options) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url,
            ...options,
            onabort: (response) => {
                reject(response)
            },
            onerror: (response) => {
                reject(response)
            },
            ontimeout: (response) => {
                reject(response)
            },
            onload: (response) => {
                resolve(response)
            },
        })
    })
}

const egsUrl = document.querySelector('a[title=EpicGames]')

if (egsUrl) {
    createCornerButton('right-vertical', 'EGS Cover', e => {
        e.target.remove()
        main()
    })
}

function main() {
    const slug = egsUrl.href.split("/").pop()

    const mainDiv = document.createElement('div')
    mainDiv.id = 'egs-cover-main'
    mainDiv.style.cssText = `
        position: absolute;
    width: 250px;
    left: 20%;
    top: 0.1%;
    background-color: #2a2b36;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 3px 0
    `
    const loading = document.createElement('p')
    loading.textContent = 'Loading'
    loading.style.fontSize = '2em'
    mainDiv.append(loading)

    const coverDiv = document.getElementById('group_cover')
    coverDiv.after(mainDiv)


    getProductMapping(slug).then(mapping => { // some games don't have this. {"error":true,"message":"Page was not found"}
        return {
            sandboxId: mapping.namespace,
            offerId: mapping.pages.find(o => o.type === "productHome").offer.id // could find from data.editions.editions but doesn't work for games that have only 1 edition
        }
    }).catch(() => { //
        return getMappingByPageSlug(slug).then(mapping => ({
            sandboxId: mapping.StorePageMapping.mapping.sandboxId,
            offerId: mapping.StorePageMapping.mapping.mappings.offerId
        }))
    })
        .then(async identifiers => {
            let tries = 4
            while (tries > 0) {
                const catalog = await getCatalogOffer(identifiers)
                if (!catalog) {
                    console.warn('Retrying getCatalogOffer')
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    tries--
                    continue
                }
                return catalog
            }
            mainDiv.remove()
        }).then(catalog => {
        console.log("catalog", catalog)
        const coverImage = catalog.keyImages.find(image => image.type === "OfferImageTall")?.url
        if (!coverImage) {
            alert('No cover image found')
            return
        }
        new Promise((resolve, reject) => {
            let img = new Image()
            img.src = coverImage
            img.style.maxWidth = '250px'
            img.style.maxHeight = '350px'
            img.onload = () => resolve(img)
            img.onerror = () => reject()
        }).then(img => {
            loading.remove()
            const currentCover = coverDiv.querySelector('img')

            const closeBtn = document.createElement('button')
            closeBtn.textContent = 'Close'
            closeBtn.addEventListener('click', () => mainDiv.style.display = 'none')
            closeBtn.style.alignSelf = 'end'
            mainDiv.append(closeBtn)

            mainDiv.insertAdjacentHTML('beforeend', `
<span style="font-size: 1.1em;">Current: ${currentCover.naturalWidth} x ${currentCover.naturalHeight}</span>
<span style="font-size: 1.1em;">New: ${img.naturalWidth} x ${img.naturalHeight}</span>
`)
            mainDiv.append(img)

            mainDiv.insertAdjacentHTML('beforeend', `
        <input type="text" style="width: 80%;" id="egs-cover-input">
        <button id="egs-cover-submit" type="button">Submit</button>
`)

            const body = new URLSearchParams(`action=takeimagesedit&groupid=${new URL(location.href).searchParams.get('id')}&categoryid=1`)
            document.querySelectorAll('#group_screenshots a').forEach(a => body.append('screens[]', a.href))

            function addText(text) {
                const p = document.createElement('p')
                p.style.textAlign = 'center'
                p.textContent = text
                mainDiv.append(p)
                return p
            }

            function done() {
                const p = document.createElement('p')
                p.style.textAlign = 'center'
                p.textContent = 'Done'
                p.style.cssText = "font-size: 1.5em;color: lightgreen;"
                mainDiv.append(p)
                setTimeout(() => {
                    mainDiv.remove()
                }, 1000)
            }

            document.getElementById('egs-cover-submit').onclick = () => {
                const input = document.getElementById('egs-cover-input')
                body.append('image', input.value)
                submitCover(body).then(() => {
                    done()
                })
            }

            mainDiv.insertAdjacentHTML('beforeend', `<button id="egs-cover-ptpimg" type="button">PTPImg and Submit</button>`)
            document.getElementById('egs-cover-ptpimg').onclick = () => {
                function finish(url, text) {
                    ptpimg(url)
                        .then(ptpimgLink => {
                            body.append('image', ptpimgLink)
                            submitCover(body).then(() => {
                                text.remove()
                                done()
                            })
                        })
                }

                if (coverImage.includes('.jpg') || coverImage.includes('.png')) {
                    const text = addText("Uploading to PTPimg")
                    finish(coverImage, text)
                } else {
                    const text = addText('URL has no extension. Uploading to litterbox first')
                    promiseXHR(coverImage, {responseType: 'blob'})
                        .then(r => {
                            const blob = r.response
                            const fd = new FormData()
                            fd.append('time', '1h')
                            fd.append('reqtype', 'fileupload')
                            fd.append('fileToUpload', new File([blob], 'a.' + blob.type.split('/')[1]))

                            promiseXHR('https://litterbox.catbox.moe/resources/internals/api.php', {
                                method: 'POST',
                                data: fd,
                            }).then(r => {
                                text.textContent = "Uploading to PTPimg"
                                finish(r.response, text)
                            })
                        })
                }
            }
        })
    })
}
