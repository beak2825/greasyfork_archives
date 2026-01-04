// ==UserScript==
// @name Chugokugo-script to Anki
// @description Convert http://chugokugo-script.net/tango/ for Anki
// @namespace eiou
// @version 1.9
// @grant none
// @match http://chugokugo-script.net/tango/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/380842/Chugokugo-script%20to%20Anki.user.js
// @updateURL https://update.greasyfork.org/scripts/380842/Chugokugo-script%20to%20Anki.meta.js
// ==/UserScript==

const href = location.href.split('/').splice(-2)
const level = href[0]
const speech = href[1].split('.')[0]
const page = level + '-' + speech

const getText = (bunruiBox, classSelector) => $(bunruiBox).find(classSelector)[0].textContent
const getAudioURL = (bunruiBox, classSelector) => $(bunruiBox).eq(0).find(classSelector + '>>source')[0].src
const getAudioFile = (bunruiBox, classSelector) => 'script-' + decodeURI(getAudioURL(bunruiBox, classSelector)).split("/").slice(-1)[0]
const getGrammar = (bunruiBox, classSelector) => $(bunruiBox).find(classSelector)[0].innerHTML.trim().replace(/\t/g, '')

unsafeWindow.anki = $.map($(".divBunruiBox"), function (el) {
    //console.log()
    return {
        id: level + '-' + ('00' + getText(el, '.divBunruiLeft')).slice(-3) + '-' + speech,
        vocZH: getText(el, '.divBunruiC'),
        vocPY: getText(el, '.divBunruiP'),
        vocJP: getText(el, '.divBunruiN'),
        vocAudURL: getAudioURL(el, '.divBunruiA'),
        vocAudFile: getAudioFile(el, '.divBunruiA'),
        exZH: getText(el, '.divBunruiExC'),
        exPY: getText(el, '.divBunruiExP'),
        exJP: getText(el, '.divBunruiExN'),
        exAudURL: getAudioURL(el, '.divBunruiExA'),
        exAudFile: getAudioFile(el, '.divBunruiExA'),
        grammar: getGrammar(el, '.divBunruiExBunpou')
        //Point ???
    }
})

console.log(anki)

const downloadFile = function (dataStr, fileName, mimeType) {
    let dataUri = 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(dataStr);

    let exportFileDefaultName = fileName;

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}


unsafeWindow.downloadAudioList = function () {
    const fileName = 'audioList-' + page + '.txt'
    const mimeType = 'text/plain'
    const data = anki.map(row => row.vocAudURL + '\n' + row.exAudURL)
        .join('\n')
    console.log(data)
    // const data = anki.map(card => card.join('\t')).join('\n')

    downloadFile(data, fileName, mimeType)
}

unsafeWindow.downloadAnkiCSV = function () {
    const fileName = 'anki-' + page + '.txt'
    const mimeType = 'text/csv'
    const data = anki.map(row => {
        return [
            row.id, // id
            row.vocZH, // 覚えたい単語
            '', // 覚えたい単語の画像
            row.vocPY, // 覚えたい単語のピンイン
            '[sound:' + row.vocAudFile + ']', // 覚えたい単語の音声ファイル
            '', // 個人的なつながり
            row.exZH, // 例文
            row.exPY, // 例文のピンイン
            '[sound:' + row.exAudFile + ']', // 例文の音声,
            row.exJP, // 例文の和訳
            '' // Tags
        ].join('\t')
    }).join('\n') + '\n'
    console.log(data)
    // const data = anki.map(card => card.join('\t')).join('\n')

    downloadFile(data, fileName, mimeType)
}

// $(".ulHeaderRight").eq(0)
// .append($('<li><button onclick="downloadAudioList()">音声ファイルをダウンロード</button></li>'))
// .append($('<button onclick="downloadAnkiCSV()">Anki CSV をダウンロード</button>'))

downloadAnkiCSV()

// const levels = ['level1','level2','level3']
// const speeches = ['meishi','doushi','keiyoushi']

// for (let i = 0; i < levels.length; i++) {
//     const lev = levels[i]
//     for (let j = 0; j < speeches.length; j++) {
//         const spch = speeches[j]
//         window.open('http://chugokugo-script.net/tango/' + lev + '/' + spch + '.html', '_blank')
//     }
// }

// levels.map((lev) => {
//     speeches.map((spch) => {
//         window.open('http://chugokugo-script.net/tango/' + lev + '/' + spch + '.html', '_blank')
//     })
// })