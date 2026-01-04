

    // ==UserScript==
    // @name         Forsen emotes on old.reddit.com/r/forsen
    // @namespace    http://tampermonkey.net/
    // @version      0.4.1
    // @description  Forsen
    // @author       Schuhbart
    // @match        https://old.reddit.com/r/forsen/comments/*
    // @icon         https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/4utA9oAccZ.png
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442422/Forsen%20emotes%20on%20oldredditcomrforsen.user.js
// @updateURL https://update.greasyfork.org/scripts/442422/Forsen%20emotes%20on%20oldredditcomrforsen.meta.js
    // ==/UserScript==
     
    (function() {
        const emotes = {
        	":9666:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/cCMLsKHKiY.png",
        	":9669:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/yD65smPJmE.png",
        	":9670:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/K2gAheT6ah.png",
        	":9671:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/GTzgYqWEjv.png",
        	":9672:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/qbKpveDajv.png",
        	":9673:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/QKvdUGc59v.png",
        	":9674:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/vsbrygIsLC.png",
        	":9675:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/EyJFsnenJm.png",
        	":9676:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/If2hw6WKBy.png",
        	":9677:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/34Jeenf2Vk.png",
        	":9678:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/3S7hn7Otl2.png",
        	":9679:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/ghjJMnxROn.png",
        	":9680:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/rQVxSTDTmn.png",
        	":9681:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/bGJMMJRAHp.png",
        	":9682:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/9tda8IBjzh.png",
        	":9683:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/fYZieBOLDf.png",
        	":9684:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/3KKhFk6zS6.png",
        	":9685:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/LcyvcEVLyY.png",
        	":9667:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/ZwqZTFqh42.png",
        	":9668:" : "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/IbxVsEmZ9l.png",
        }
     
        const SMALL = 0
        const BIG = 1
     
        // If size is SMALL: return html code for small image for inline emotes
        // If size is BIG: return html code for big image for emotes that are on a new line by themselves
        function getEmoteImage(code, size=SMALL) {
            console.assert(code in emotes)
            if (size == SMALL) return ` <img src="${emotes[code]}" width="19" height="20" align="top" title="${code.replaceAll(":","")}">`
            else if (size == BIG) return `<img src="${emotes[code]}" width="60" height="60" title="${code.replaceAll(":","")}">`
        }
     
        const elements = document.querySelectorAll("div.comment > div.entry > * div.usertext-body > div > p")
     
        // Regex pattern that checks if a string exclusively consists of emotes or white space
        const string_only_has_emotes = new RegExp(`^(\\s|${Object.keys(emotes).join("|")})*$`)
        const string_has_any_emotes = new RegExp(`(${Object.keys(emotes).join("|")})`)
     
        // In every line, replace emote codes with their images. Needs to be done line by line to determine emote size
        for (let i in elements) {
            let line = elements[i].innerHTML
            if (string_has_any_emotes.test(line)) {
                console.log(`Line has emotes: ${line}`)
                let emote_size = SMALL
                if (string_only_has_emotes.test(line)) {
                    console.log(`Line ${line} only consists of emotes, setting emote size to big`)
                    emote_size = BIG
                }
                for (let emote in emotes) {
                    if (line.includes(emote)) {
                        console.log(`Replacing text in line ${line}`)
                        line = line.replaceAll(emote, getEmoteImage(emote, emote_size))
                        console.log(`Now line is ${line}`)
                    }
                }
            }
            elements[i].innerHTML = line
        }
     
        // Some code for updating the emote urls, I was too lazy to type them in manually so I spent 100x the time writing this LULE
        // To use this go to a comment box on new reddit, add every emote to the comment box once, paste the script into dev console
        // and call getUpdatedEmoteUrls()
        // Overwrite the const emotes = {...} above script with the output and save
        // Might break if reddit layout changes
        function getUpdatedEmoteUrls() {
            let emotes = []
            let str = "const emotes = {\n"
            for (let item of document.getElementsByClassName("public-DraftStyleDefault-block")[0].children) {
                let content = item.children[0]
                let emote_code = content.title
                let url = content.style.backgroundImage.split('"')[1]
                if (emote_code && !emotes.includes(emote_code)) {
                    str += `\t"${emote_code}" : "${url}",\n`
                    emotes.push(emote_code)
                }
            }
            console.log(`${str}}`)
        }
        // getUpdatedEmoteUrls()
    })();

