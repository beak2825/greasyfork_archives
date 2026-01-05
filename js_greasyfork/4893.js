// ==UserScript==
// @name        Muambator SRO Restorator
// @description Adiciona o link de rastreamento SRO dos Correios em cada pacote listado no site do Muambator.
// @namespace   https://github.com/juliao/gmscripts
// @include     *muambator.com.br/pacotes/arquivados/*
// @include     *muambator.com.br/pacotes/entregues/*
// @include     *muambator.com.br/pacotes/pendentes/*
// @include     *muambator.com.br/pacotes/detalhes/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4893/Muambator%20SRO%20Restorator.user.js
// @updateURL https://update.greasyfork.org/scripts/4893/Muambator%20SRO%20Restorator.meta.js
// ==/UserScript==

var allLines, details, linkDetalhes, linkSRO, imgCorreios, imgCorreiosTag, linkSROTag, linkSROBase, URL, trackingNumber;

// Imagem gif do logo dos Correios codificada em base64.
imgCorreios = 'data:image/gif;base64,R0lGODlhIAAZAPcAAP//////zP//mf//Zv//M///AP/M///MzP/Mmf/MZv/MM//MAP+Z//+ZzP+Zmf+ZZv+ZM/+ZAP9m//9mzP9mmf9mZv9mM/9mAP8z//8zzP8zmf8zZv8zM/8zAP8A//8AzP8Amf8AZv8AM/8AAMz//8z/zMz/mcz/Zsz/M8z/AMzM/8zMzMzMmczMZszMM8zMAMyZ/8yZzMyZmcyZZsyZM8yZAMxm/8xmzMxmmcxmZsxmM8xmAMwz/8wzzMwzmcwzZswzM8wzAMwA/8wAzMwAmcwAZswAM8wAAJn//5n/zJn/mZn/Zpn/M5n/AJnM/5nMzJnMmZnMZpnMM5nMAJmZ/5mZzJmZmZmZZpmZM5mZAJlm/5lmzJlmmZlmZplmM5lmAJkz/5kzzJkzmZkzZpkzM5kzAJkA/5kAzJkAmZkAZpkAM5kAAGb//2b/zGb/mWb/Zmb/M2b/AGbM/2bMzGbMmWbMZmbMM2bMAGaZ/2aZzGaZmWaZZmaZM2aZAGZm/2ZmzGZmmWZmZmZmM2ZmAGYz/2YzzGYzmWYzZmYzM2YzAGYA/2YAzGYAmWYAZmYAM2YAADP//zP/zDP/mTP/ZjP/MzP/ADPM/zPMzDPMmTPMZjPMMzPMADOZ/zOZzDOZmTOZZjOZMzOZADNm/zNmzDNmmTNmZjNmMzNmADMz/zMzzDMzmTMzZjMzMzMzADMA/zMAzDMAmTMAZjMAMzMAAAD//wD/zAD/mQD/ZgD/MwD/AADM/wDMzADMmQDMZgDMMwDMAACZ/wCZzACZmQCZZgCZMwCZAABm/wBmzABmmQBmZgBmMwBmAAAz/wAzzAAzmQAzZgAzMwAzAAAA/wAAzAAAmQAAZgAAMwAAAAAUNgAlSAAxWQByzQA8ZACGywBahwBKcgCn+ABvogCEuAB6rACZ1ACOwwCx6gCq5ACj2/zWAfXNA+7GBerABui7B+W4COK0Cd+vCtyrC9mmDNaiDdOdDtGbD8+YEMmOD8yUEMOHEtWEBbl5FMp9DK5qF6VdGf///yH5BAEAAP8ALAAAAAAgABkAAAj/AP8JHEiwoMGDCBMK5MZQm8Ns2bydU0jxH0NuDh9iK3euW8WEFzNi+2bOHLmPIBtm04auZEeUB5811FbOHLpzNj3CLChT27hzwdDdNKlz50BtyNCVC0ZOaElyRY3+Kyeu3NKmOM+dNPjOXTt27NatU0c2nUBw48RVDcZ0KDqD8OB1/Rp2rDqz4MKlrXpV6MSC8uLJnQtWrNl/4ZCN22u1rcF58gLLdecV7AKB4bwh08t46UF6kOMJftfVnTqB274h28xZbbmD+OrNCx2X9DrU3LxpZr1YrcF182LPlgyv3WWL33TvDsf5YDp29fCBjizPKz+pA9O9s2cP9Lx47fL1R9OHXWA6ePi6z2t3r9++feUFqpOX/h09f+735Yv/b51sefi9p99+5aXjDjz9BPhePvngE99z+yg4YHrxzddPfhPaw9+G/wQEADs=';
linkSROBase = 'http://websro.correios.com.br/sro_bin/txect01$.QueryList?P_LINGUA=001&P_TIPO=001&P_COD_UNI=';
imgAltText = 'Abrir o rastreamento do site dos Correios';
URL = window.location.pathname;

// Adiciona o link SRO nos detalhes do pacote atual.
if (/\/pacotes\/detalhes/.test(URL)) {
    trackingNumber = URL.split('/')[3];
    linkSRO = linkSROBase + trackingNumber;
    
    imgCorreiosTag = document.createElement('img');
    imgCorreiosTag.src = imgCorreios;
    imgCorreiosTag.alt = imgAltText;
    imgCorreiosTag.title = imgAltText;
  
    linkSROTag = document.createElement('a');
    linkSROTag.href = linkSRO;
    linkSROTag.target = '_blank';
    linkSROTag.appendChild(imgCorreiosTag);
    
    details = document.evaluate(
        "//*[@id='package_details']/div/div/table/tbody/tr/td[4]/a",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    
    var d = details.snapshotItem(0);
    d.parentNode.insertBefore(linkSROTag, d.parentNode.firstChild);
}
// Adiciona o link SRO na listagem de pacotes.
else {
    allLines = document.evaluate(
        "//table/tbody/tr/td/a[contains(@href, '/pacotes/detalhes/')]",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    for (var i = 0; i < allLines.snapshotLength; i++) {
        linkDetalhes = allLines.snapshotItem(i);
        linkSRO = linkSROBase + linkDetalhes.textContent;

        imgCorreiosTag = document.createElement('img');
        imgCorreiosTag.src = imgCorreios;
        imgCorreiosTag.alt = imgAltText;
        imgCorreiosTag.title = imgAltText;

        linkSROTag = document.createElement('a');
        linkSROTag.href = linkSRO;
        linkSROTag.target = '_blank';
        linkSROTag.appendChild(imgCorreiosTag);

        linkDetalhes.parentNode.insertBefore(linkSROTag, linkDetalhes.parentNode.firstChild);
    }
}
