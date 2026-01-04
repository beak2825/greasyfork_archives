// ==UserScript==
// @name         GGn Screenshots Resolutions Checker
// @namespace    none
// @version      2
// @description  Helps check and fix unequal screenshots resolutions
// @author       ingts
// @match        https://gazellegames.net/torrents.php?id=*
// @match        https://gazellegames.net/upload.php
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/479685/GGn%20Screenshots%20Resolutions%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/479685/GGn%20Screenshots%20Resolutions%20Checker.meta.js
// ==/UserScript==
const check_after_group_creation = true
const scroll_to_screenshots = true
const refresh_after_submit = false

const heading = document.querySelector('.screenshots_div > .head > strong')

function getImgUrl(imgElement) {
    return imgElement.src.includes('postimg') ? new URL(imgElement.src).searchParams.get('i') : imgElement.src
}

function check(screenshots, status) {
    const resolutions = Array.from(screenshots).map(img => `${img.naturalWidth}x${img.naturalHeight}`)
    let freqMap = resolutions.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1
        return acc
    }, {})
    let maxFreqElement = Object.keys(freqMap).reduce((max, cur) => freqMap[max] > freqMap[cur] ? max : cur)
    let minorityIndexes = []
    resolutions.forEach((val, index) => {
        if (val !== maxFreqElement) {
            minorityIndexes.push(index)
        }
    })

    if (minorityIndexes.length === 0) {
        status.style.color = 'lightgreen'
        status.textContent = 'All same resolution'
        return
    }
    status.style.color = 'red'
    status.textContent = 'Not all same resolution'

    screenshots.forEach((img, index) => {
        img.style.width = `${img.width}px`
        img.style.height = `${img.height}px`
        img.style.removeProperty('max-width')
        let imgParent = img.parentElement
        imgParent.style.flex = '1'
        const div = document.createElement('div')
        Object.assign(div.style, {
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            position: 'relative'
        })
        imgParent.before(div)
        div.append(imgParent)
        const input = document.createElement('input')
        input.type = 'text'
        input.onblur = () => {
            if (input.value) {
                input.value.replace(/(\.png|\.jpg|\.jpeg).*$/i, "$1") // remove text after extension
                imageUpload(input.value, input) // ptpimg site function
            }
        }
        const span = document.createElement('span')
        span.textContent = `${img.naturalWidth}x${img.naturalHeight}`
        Object.assign(span.style, {
            position: 'absolute',
            backgroundColor: 'rgb(0 0 0 / 70%)',
            top: `${imgParent.offsetTop}px`,
            left: `${imgParent.offsetLeft}px`,
        })
        if (minorityIndexes.includes(index)) {
            input.style.backgroundColor = '#f17373'
            span.style.color = '#f17373'
            span.style.fontSize = '1.6em'
        } else {
            input.value = getImgUrl(img)
            span.style.fontSize = '1.2em'
        }
        div.append(input)
        img.before(span)
    })
    document.getElementById('group_screenshots').style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    justify-content: center;`
    document.querySelector('.screenshots_div > .body').insertAdjacentHTML("afterend", `<input type=button style="display:block;margin: 20px auto 0;" id="check-submit" value="Submit">`)
    const submitBtn = document.getElementById('check-submit')
    submitBtn.addEventListener("click", () => {
        const body = new URLSearchParams(`action=takeimagesedit&groupid=${new URL(location.href).searchParams.get('id')}&categoryid=1&image=${getImgUrl(document.querySelector("#group_cover img"))}`)
        const screens = Array.from(document.querySelectorAll('#group_screenshots input')).map(a => a.value).filter(Boolean)
        screens.forEach(url => body.append('screens[]', url))
        fetch('https://gazellegames.net/torrents.php', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        }).then(r => {
            if (!r.redirected)
                throw new Error()
            submitBtn.value = 'Submitted'
            submitBtn.disabled = true
            if (refresh_after_submit)
                location.reload()
        }).catch(() => {
            alert('Failed')
        })
    })
}

function main() {
    const screenshots = document.querySelectorAll('#group_screenshots img')
    let loadedImgs = 0
    const status = document.createElement('span')
    status.style.marginLeft = '2rem'
    heading.after(status)

    const loadingTimeout = setTimeout(() => {
        status.style.color = '#FF8015'
        status.textContent = 'Loading'
    }, 800)

    screenshots.forEach(img => {
        if (img.complete) {
            loadedImgs++
        } else {
            img.addEventListener('load', () => {
                loadedImgs++
                if (loadedImgs === screenshots.length) {
                    clearTimeout(loadingTimeout)
                    check(screenshots, status)
                }
            })
        }
    })
    if (loadedImgs === screenshots.length) {
        clearTimeout(loadingTimeout)
        check(screenshots, status)
    }
}

if (check_after_group_creation && location.href.endsWith('upload.php')) {
    document.getElementById('upload_table').addEventListener('submit', () => {
        GM_setValue('new', 1)
    })
}

if (location.href.includes('torrents.php?id=') && document.getElementById('groupplatform')) {
    if (GM_getValue('new', null)) {
        main()
        GM_deleteValue('new')
        if (scroll_to_screenshots)
            heading.parentElement.scrollIntoView()
    } else {
        const button = document.createElement('button')
        button.style.marginLeft = '2rem'
        button.textContent = 'Check Resolutions'
        button.onclick = () => {
            main()
            button.remove()
        }
        heading.after(button)
    }
}
