// ==UserScript==
// @name         arXiv论文下载自动重命名为论文名 【功能增强版】| arXiv download pdf auto rename tool
// @namespace    Max
// @version      0.3
// @description  下载arXiv论文并自动重命名，兼容更多arXiv页面
// @author       Max
// @match        *://arxiv.org/abs/*
// @match        *://arxiv.org/search/*
// @match        *://arxiv.org/list/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/475078/arXiv%E8%AE%BA%E6%96%87%E4%B8%8B%E8%BD%BD%E8%87%AA%E5%8A%A8%E9%87%8D%E5%91%BD%E5%90%8D%E4%B8%BA%E8%AE%BA%E6%96%87%E5%90%8D%20%E3%80%90%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%E7%89%88%E3%80%91%7C%20arXiv%20download%20pdf%20auto%20rename%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/475078/arXiv%E8%AE%BA%E6%96%87%E4%B8%8B%E8%BD%BD%E8%87%AA%E5%8A%A8%E9%87%8D%E5%91%BD%E5%90%8D%E4%B8%BA%E8%AE%BA%E6%96%87%E5%90%8D%20%E3%80%90%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%E7%89%88%E3%80%91%7C%20arXiv%20download%20pdf%20auto%20rename%20tool.meta.js
// ==/UserScript==



(function() {
    'use strict';
    const url = location.pathname,webTitle = document.title
    var downloadName = '',downloadPath = ''
    var papertitle = '',papertime = ''
    if(url.search('/abs/')!=-1){
        papertitle = document.querySelector("#abs > h1").innerText
        downloadPath = window.location.href.replace('abs','pdf') + '.pdf' //document.querySelector("#abs-outer > div.extra-services > div.full-text > ul > li:nth-child(1) > a")+'.pdf'
        papertime = window.location.pathname.slice(5,9) //document.querySelector("#abs > div.metatable > table > tbody > tr:nth-child(3) > td.tablecell.arxivid > span > a").innerText.slice(6,10)
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
    if(url.search('/list/')!=-1){
        let paperlist = document.querySelectorAll(".list-identifier")
        for (let i = 0, len = paperlist.length; i < len; i++){
            try {
                let paper = paperlist[i]
                // console.log(paper)
                papertitle = paper.parentNode.nextElementSibling.querySelector('.list-title').innerText
                downloadPath = paper.querySelector('a[title="Download PDF"]').href + '.pdf'
                papertime = downloadPath.split('/').pop().split('.')[0]
                downloadName = renamePaperFile(papertitle,papertime)
                addDownloadButton(downloadPath,downloadName,paper)
            } catch (error) {
                console.warn('AUTO download rename raise warning at : ' + papertitle)
            }
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