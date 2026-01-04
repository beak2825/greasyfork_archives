// ==UserScript==
// @name         arXiv论文下载自动重命名为论文名
// @namespace    ZBigFish
// @version      0.1
// @description  能够直接把下载的文件名默认修改为论文名，并且符合Windows文件命名规范。会在搜索页面以及单个论文界面产生一个下载论文的超链接，点击即可。
// @author       Jianad
// @match        *://arxiv.org/abs/*
// @match        *://arxiv.org/search/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/452507/arXiv%E8%AE%BA%E6%96%87%E4%B8%8B%E8%BD%BD%E8%87%AA%E5%8A%A8%E9%87%8D%E5%91%BD%E5%90%8D%E4%B8%BA%E8%AE%BA%E6%96%87%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/452507/arXiv%E8%AE%BA%E6%96%87%E4%B8%8B%E8%BD%BD%E8%87%AA%E5%8A%A8%E9%87%8D%E5%91%BD%E5%90%8D%E4%B8%BA%E8%AE%BA%E6%96%87%E5%90%8D.meta.js
// ==/UserScript==



(function() {
    'use strict';
    const url = location.pathname,webTitle = document.title
    var downloadName = '',downloadPath = ''
    var papertitle = '',papertime = ''
    if(url.search('/abs/')!=-1){
        papertitle = document.querySelector("#abs > h1").innerText
        downloadPath = document.querySelector("#abs-outer > div.extra-services > div.full-text > ul > li:nth-child(1) > a")+'.pdf'
        papertime = document.querySelector("#abs > div.metatable > table > tbody > tr:nth-child(3) > td.tablecell.arxivid > span > a").innerText.slice(6,10)
        downloadName = renamePaperFile(papertitle,papertime)
        addDownloadButton(downloadPath,downloadName,document.querySelector("#abs-outer > div.extra-services > div.full-text"))
    }
    if(url.search('/search/')!=-1){
        var paperlist = document.querySelectorAll("#main-container > div.content > ol > li")
        for(let paper in paperlist){
            papertitle = paperlist[paper].children[1].innerText
            papertime = paperlist[paper].children[0].innerText.slice(6,10)
            downloadName = renamePaperFile(papertitle,papertime)
            downloadPath = paperlist[paper].children[0].children[0].children[1].children[0].href+'.pdf'
            addDownloadButton(downloadPath,downloadName,paperlist[paper].children[0])
        }
    }

    function addDownloadButton(downloadPath,downloadName,element){
        var button = document.createElement("a"); //创建一个input对象（提示框按钮）
        button.id = "downloadPaper";
        button.textContent = "下载论文（重命名）";
        button.setAttribute("href", downloadPath)
        button.setAttribute("download", downloadName)
        element.append(button);
    }
    function renamePaperFile(name,time){
        var downloadName = name.replace(': ','：')
        downloadName = downloadName.replace(':','：')
        downloadName = downloadName.replace('?','？')
        downloadName = downloadName.replace('/',' OR ')
        downloadName = downloadName.replace('"','“')+'.pdf'
        return '['+time+']'+downloadName
    }
})();