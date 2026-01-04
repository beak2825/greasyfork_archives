// ==UserScript==
// @name         pixelmatorTutorialDownloader
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  download pixcelmator pro tutorial resouces and youtube videos to local disk
// @author       mooring@codernote.club
// @match        https://www.pixelmator.com/tutorials/*
// @match        https://www.pixelmator.com/support/guide/pixelmator-pro/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelmator.com
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462719/pixelmatorTutorialDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/462719/pixelmatorTutorialDownloader.meta.js
// ==/UserScript==

let proxy = '';

function getCategoryInfo(cmd, collect, init){
    let category = document.querySelector('.tutorialsBrowser__categoriesList >.tutorialsBrowser__categoriesItem.is-active').innerText;
    let moreless = document.querySelector('.tutorialsBrowser__mainCategoryMore>.tutorialsBrowser__mainCategoryMoreBtn');
    let commands = [];
    let download = [];
    let html     = [];
    let foldmap  = {};
    if(!moreless.parentElement.classList.contains('is-inactive')){
        moreless.click();
    }
    if(init){
        commands.push(`cls`);
        commands.push(`@set proxy=`); 
        commands.push(`@set proxy=${proxy}`);
        commands.push(`@set pxystr=`)
        commands.push(`@if "%25proxy%25" == "" @echo.>"%25~dp0assets\\proxy.conf"`);
        commands.push(`@if not "%25proxy%25" == "" @echo %25proxy%25>"%25~dp0assets\\proxy.conf"`);
        commands.push(`@if not "%25proxy%25" == "" @set pxystr=--proxy "%25proxy%25"`);
        commands.push(`@set getpage=%25~dp0..\\bin\\getpage.exe`);
        commands.push(`@echo @set down=..\\bin\\yt-dlp --write-thumbnail  --embed-metadata  --cache-dir cache --write-link -f "bv+ba" --progress %25pxystr%25 --no-playlist --restrict-filenames --write-subs --audio-quality 10 --merge-output-format "mp4" --sub-langs "en-US.*,zh-Hans.*" --convert-thumbnails png  --ffmpeg-location ..\\bin ${init?'>':'>>'} %25~dp0${collect||category}_ytb.cmd`);
        html.push(`<!doctype html>`);
        html.push(`<html lang="en-US">`)
        html.push(`<head>`)
        html.push(`<meta charset="utf-8"/>`)
        html.push(`<title>Pixelmator Pro Tutorial</title>`)
        html.push(`<meta name="author" content="mooring@codernote.club"/>`)
        html.push(`<meta name="description" content="Pixelmator Pro Tutorial"/>`)
        html.push(`<meta name="viewport" content="width=device-width, initial-scale=1"/>`)
        html.push(`<style>`);
        html.push(`h2.category {width: 80%;display: block;border-bottom: 1px dodgerblue dotted;margin: 0.5em auto;padding-bottom: 0.5em;}`);
        html.push(`.items {width: 80%;margin: 0 auto;display: flex;flex-wrap: wrap;justify-content:flex-start}`);
        html.push(`.item {width:23.7em;padding:10px}`);
        html.push(`.img {width: 100%;height: 13em;cursor:pointer;position:relative;}`);
        html.push(`.img:before{display:block;width:3em;height:3em;content:"▶️";border-radius:2em;position:absolute;left:8.6em;top:3.8em;font-size:20px;color:white;text-align:center;line-height:3em;padding:0;margin:0;}`);
        html.push(`.title {font-weight:600;cursor:pointer;text-align: center;font-size: 1.2em;padding-bottom: 1em;}`);
        html.push(`img.image-x2 {width: 100%;height: 100%;border-radius: 1em;}`);
        html.push(`</style>`);
        html.push(`<script>`);
        html.push(`function viewVideo(evt,url){ var img=new Image(); img.onerror=function(){window.open(url.replace("video.mp4","index.html"))};img.onload=function(){window.open(url)};img.src=url.replace(".mp4",".png");}`);
        html.push(`</script></head><body>`);
        commands.push(`@echo @echo resource downloader ${init?'>':'>>'} %25~dp0${collect||category}_res.cmd`);
        commands.push(`@echo @title %25cd%25 >> %25~dp0${collect||category}_res.cmd`);
        commands.push(`@echo @title %25cd%25 >> %25~dp0${collect||category}_ytb.cmd`);
    }
    commands.push(`@cd %25~dp0`);
    commands.push(`@if not exist %25~dp0${category} mkdir %25~dp0${category}`);
    commands.push(`@cd %25~dp0${category}`);
    let items = document.querySelectorAll('.tutorialsBrowser__mainCategoryList >.tutorialsBrowser__mainItem');
    items.forEach((item,index)=>{
        let img = item.querySelector('.tutorialsThumbnail__image');
        let lnk = item.querySelector('.tutorialsThumbnail__link').href;
        let tit = item.querySelector('.tutorialsThumbnail__title').innerText;
        let src = 'https:'+img.getAttribute('src').replace(/^https?:/i,'');
        let x2 = 'https:'+img.getAttribute('srcset').replace(/^https?:/i,'');
        let pth = lnk.split('/').slice(-2,-1)[0];
        src = src.split('/');
        x2 = x2.split('/');
        if(!foldmap[pth]){
            foldmap[pth] = 1;
            commands.push(`@if not exist "${pth}\\img" mkdir "${pth}\\img"`);
        }
        if(index == 0){
            html.push(`<h2 class="category">${category}</h2><div class="items">`);
        }
        html.push(`<div class="item">`);
        html.push(`<div class="img" onclick="viewVideo(this,'./${category}/${pth}/video.mp4')">`);
        html.push(`<img src="./${category}/${pth}/img/${x2.slice(-1)[0].split(' ')[0]}" class="image-x2" />`);
        html.push(`</div>`);
        html.push(`<div class="title" onclick="window.open('${lnk}','_blank')">${tit}</div>`);
        html.push(`</div>`);
        let img1 = `${pth}\\img\\${src.slice(-1)[0]}`,
            url1 = `${encodeURI(src.join('/')).replace(/%/g,'%%')}`;
        commands.push(`@rem downloading ${encodeURI(src.join('/'))}`);
        commands.push(`@if not exist "${img1}" @curl -o "${img1}" "${url1}" 2>NUL`);
        let img2 = `${pth}\\img\\${x2.slice(-1)[0].split(' ')[0]}`,
            url2 = `${encodeURI(x2.join('/').split(' ')[0]).replace(/%/g,'%%')}`;
        commands.push(`@rem downloading ${encodeURI(x2.join('/').split(' ')[0])}`);
        commands.push(`@if not exist "${img2}" @curl -o "${img2}" "${url2}" 2>NUL`);
        commands.push(`@%25getpage%25 "${lnk}" "${category}\\${pth}" "${collect||category}"`);
    });
    if(items.length>0){
        html.push(`</div>`);
    }
    commands.push('@cd %25~dp0');
    if(collect){
        return {category, commands, html}
    }else{
        let content = cmd == 'cmd' ? commands.join("\n") : html.join("\n");
        down(cmd, category, content)
    }
}

function getGuideCmd(){
    let guides = document.querySelectorAll('.guides-menu a');
    let cmds = [];
    let lproxy = localStorage.getItem('pixelmatorTutorialDownloader_proxy');
    proxy = prompt("Input proxy string like http://127.0.0.1:8899, if no proxy keep it empty", lproxy || '');
    localStorage.setItem('pixelmatorTutorialDownloader_proxy', proxy||'');
    cmds.push(`cls`);
    cmds.push(`@set proxy=`); 
    cmds.push(`@set proxy=${proxy}`);
    cmds.push(`@set pxystr=`)
    cmds.push(`@if "%25proxy%25" == "" @echo.>"%25~dp0assets\\proxy.conf"`);
    cmds.push(`@if not "%25proxy%25" == "" @echo %25proxy%25>"%25~dp0assets\\proxy.conf"`);
    cmds.push(`@if not "%25proxy%25" == "" @set pxystr=--proxy "%25proxy%25"`);
    cmds.push(`@set getpage=%25~dp0..\\bin\\getpage.exe`);
    cmds.push(`@if not exist %25~dp0guide mkdir %25~dp0guide`);
    for(let i=0,il=guides.length; i<il; i++){
        let guide = guides[i];
        let match = guide.getAttribute('href').match(/\/pixelmator-pro\/(\d+)/)
        if(!guide.parentElement.classList.contains('openable') && match){
            cmds.push(`@if not exist "%25~dp0guide\\${match[1]}" mkdir "%25~dp0guide\\${match[1]}\\img"`);
            cmds.push(`@cd %25~dp0guide`);
            cmds.push([
                '@%25getpage%25',
                `"${guide.href}"`,
                `"guide\\${match[1]}"`,
                `"${guide.innerText.replace(/\"/g,'')}"`
            ].join(' '));
        }
    }
    down('cmd', 'Guides', cmds.join("\n"))
}
function down(cmd, category, content){
    let ele = document.createElement('a');
    ele.style.display = 'none';
    ele.setAttribute('href', 'data:text/plain;charset=utf-8,' + content);
    ele.setAttribute('download', category + '.' + cmd);
    document.body.appendChild(ele);
    ele.click();
    document.body.removeChild(ele);
}
function collect(cmd){
    let html     = [];
    let commands = [];
    let cmdfile  = 'Resources';
    let categories = document.querySelectorAll('.tutorialsBrowser__categoriesItem> .tutorialsBrowser__categoriesLink');
    let lproxy = localStorage.getItem('pixelmatorTutorialDownloader_proxy');
    if(cmd=='cmd'){
        proxy = prompt("Input proxy string like http://127.0.0.1:8899, if no proxy keep it empty", lproxy || '');
        localStorage.setItem('pixelmatorTutorialDownloader_proxy', proxy||'');
    }
    for(let i=0,il=categories.length;i<il;i++){
        categories[i].click();
        let source = getCategoryInfo(1, cmdfile, i==0);
        if(source.html.length>0){
            html = html.concat(source.html);
        }
        commands = commands.concat(source.commands);
    }
    html.push('</body></html>')
    down(cmd, cmdfile,(cmd=='cmd'?commands:html).join("\n"));
}

(function() {
    'use strict';
    GM_registerMenuCommand("get All Command", function(evt, keybord){
        collect('cmd');
    });
    GM_registerMenuCommand("get All HTML", function(evt, keybord){
        collect('html');
    });
    GM_registerMenuCommand("get Category Command", function(evt, keybord){
        let lproxy = localStorage.getItem('pixelmatorTutorialDownloader_proxy');
        proxy = prompt("Input proxy string like http://127.0.0.1:8899, if no proxy keep it empty", lproxy || '');
        localStorage.setItem('archiveAssistant_proxy', proxy||'');
        getCategoryInfo('cmd', false, true);
    });
    GM_registerMenuCommand("get Category HTML", function(evt, keybord){
        getCategoryInfo('html', false, true);
    });
    GM_registerMenuCommand("get User Guides", function(evt, keybord){
        getGuideCmd();
    });
})();