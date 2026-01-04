// ==UserScript==
// @name         Download BrandWatch News List
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Download all URLs of the Veganz Brand Monitoring News List as CSV
// @author       You
// @match        https://app.brandwatch.com/project/1998259164/dashboards/772804
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422737/Download%20BrandWatch%20News%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/422737/Download%20BrandWatch%20News%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class BrandWatchNewsListCSV {

        constructor() {
            this.section = false;
            this.dlBtn = false;
            this.urls = [];
            let i = setInterval((e) => {
                let newsBtn = this.setNewsBtnEvent();
                if(!newsBtn) return;
                clearInterval(i);
            }, 1000);
        }

        setNewsBtnEvent() {
            let tabBtns = document.querySelectorAll('a[data-at="tab-name"]');
            if(tabBtns == undefined) return;
            let newsBtn = false;
            for(let i = 0; i < tabBtns.length; i++) {
                if(tabBtns[i].textContent == 'News') {
                    newsBtn = tabBtns[i];
                    newsBtn.addEventListener('click', (e)=> { this.onNewsBtn(e); });
                    break;
                }
            }
            return newsBtn;
        }

        onNewsBtn(e) {
            if(this.dlBtn) return;
            let tabId = this.getTabIdFromLink(e.srcElement);
            if(!tabId) return false;
            let section = document.querySelector(`section[data-tabcid="${tabId}"]`);
            if(!section) return false;
            this.section = section;
            let i = setInterval((e) => {
                let linkProbe = section.querySelector('article.mentionsComponent a.title');
                if(!linkProbe) return;
                clearInterval(i);
                this.insertDlBtn();
            }, 500);
        }

        getBar() {
            let bar = this.section.querySelector('.componentHeader');
            return bar;
        }

        insertDlBtn() {
            let btn = document.createElement('button');
            btn.classList.add('news-csv-btn', 'customtip', 'button', 'hide-throbber');
            btn.textContent = 'Download URLs';
            let throbber = this.getThrobber();
            btn.appendChild(throbber);
            btn.addEventListener('click', (e) => { this.onDlBtn(e); });
            this.section.insertBefore(btn, this.section.querySelector('.tab-components'));
            this.dlBtn = btn;
            let style = document.createElement('style');
            style.innerHTML = '.news-csv-btn > img {width:16px;height:16px;margin-left:5px;} .hide-throbber > img { display: none; }';
            document.body.appendChild(style);
            return true;
        }

        getTabIdFromLink(link) {
            let tabId = false;
            try { tabId = link.href.match(/.\d*$/g, '')[0]; }
            catch {}
            return tabId;
        }

        onDlBtn() {
            this.disableDlBtn();
            let urls = [];
            let pages = this.getPages();
            let nextBtn = this.getNextPageBtn();
            if(!nextBtn) return;
            this.urls = [];
            this.getUrls();
        }

        getPages() {
            let pages = this.section.querySelectorAll('.pager li:not(.next)');
            if(pages == undefined) return false;
            return pages;
        }

        getNextPageBtn() {
            let nextBtn = this.section.querySelector('.pager > .next');
            return nextBtn;
        }

        getUrls() {
            let i = setInterval((e) => {
                let links = this.section.querySelectorAll('.mentionsTableView a.title');
                if(links == undefined) return;
                links.forEach(link=>{
                    this.urls.push(link.href);
                });
                clearInterval(i);
                let nextBtn = this.getNextPageBtn();
                if(!nextBtn) {
                    this.downloadCSV();
                    return;
                }
                nextBtn.click();
                setTimeout(()=>{
                    this.getUrls();
                }, 500);
            }, 500);
        }

        downloadCSV() {
            this.enableDlBtn();
            if(this.urls.length == 0) return;
            let csvContent = "data:text/csv;charset=utf-8,";
            this.urls.forEach(row => {
                csvContent += row.replace('#', '%23') + "\r\n";
            });
            let encodedUri = encodeURI(csvContent);
            let link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'brandwatch_news_links.csv');
            document.body.appendChild(link);
            link.click();
        }

        disableDlBtn() {
            this.dlBtn.classList.remove('hide-throbber');
            this.dlBtn.disabled = true;
            this.section.querySelector('article.mentionsComponent').style.visibility="hidden";
        }

        enableDlBtn() {
            this.dlBtn.classList.add('hide-throbber');
            this.dlBtn.disabled = false;
            this.section.querySelector('article.mentionsComponent').style.visibility="visible";
        }

        getThrobber() {
            let img = document.createElement('img');
            img.src = 'https://veganz.de/wp-content/uploads/static/throbber.gif';
            img.style.width = '16';
            img.style.height = '16';
            return img;
        }

    }

    new BrandWatchNewsListCSV();
})();
