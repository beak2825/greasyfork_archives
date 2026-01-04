// ==UserScript==
// @name         Github、Gitee仓库 图片文件显示工具
// @namespace    http://tampermonkey.net/
// @version      0.32
// @license      HHB
// @antifeature  此脚本只做学习交流，使用此脚本的造成任何后果概不负责
// @description  Github、Gitee代码托管网址，仓库图片文件预览功能，点击小图可直接在新窗口查看并保存文件
// @author       764777472@qq.com
// @match        http*://github.com/*
// @match        http*://gitee.com/*
// @icon         https://gitee.com/static/images/logo-en.svg
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/439800/Github%E3%80%81Gitee%E4%BB%93%E5%BA%93%20%E5%9B%BE%E7%89%87%E6%96%87%E4%BB%B6%E6%98%BE%E7%A4%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/439800/Github%E3%80%81Gitee%E4%BB%93%E5%BA%93%20%E5%9B%BE%E7%89%87%E6%96%87%E4%BB%B6%E6%98%BE%E7%A4%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
function matchSrc(src) {
    //console.log(src)
    var macths = ['.jpg','.png','.gif','.jpeg','.svg','.webp'];
    let result = macths.map(item => {
        //console.log(src.indexOf(item))
        if(~src.indexOf(item)) {
            return true;
        }
        return false;
    });
    let backRes = result.find(val=>{return val == true;}) ? true : false

    return backRes;
};
function loadImgs (){
    if (location.host.indexOf("github.com") !== -1 || location.host.indexOf("gitee.com") !== -1) {
            'use strict';
            var mgsty = location.host.indexOf("gitee.com") !== -1 ? "margin:0 4px;" : "margin:4px 12px 4px 0;";
            var imgStyle = mgsty + "     min-width:  45px;width:  45px; height:  45px;object-fit: contain;cursor: pointer;background:rgba(0,0,0,.1);border-radius: 4px;padding:4px;box-sizing:border-box;transition: all 0.2s;";
            var imgStyleHover = mgsty + "width: 100px; height: 100px;object-fit: contain;cursor: pointer;background:rgba(0,0,0,.1);border-radius: 4px;padding:4px;box-sizing:border-box;transition: all 0.2s;";
            var start = "https://github.com";
            var end = "?raw=true";

            // Github
            if (location.host.indexOf("github.com") !== -1) {
                var arrs = document.getElementsByClassName('Table-module__Box--KyMHK')[0].querySelector('tbody').getElementsByClassName('react-directory-row')

                if(document.getElementsByClassName('vbsNames').length > 0) {
                    return false;
                }
                const tempImgDom = document.createElement("img");
                tempImgDom.style = "position: fixed;top: 0px;right: 0;object-fit: contain;pointer-events: none;display: block;z-index: 99999;width: 50vw;height: 100vh;background: rgba(0, 0, 0, 0.05);display: none;"
                document.querySelector('body').append(tempImgDom);
                //console.log(location.pathname,'目录，图片渲染完成，点击小图可在新窗口查看并保存图片')

                for (var i = 0; i < arrs.length; i++) {

                    if(arrs[i].querySelector(".Link--primary")) {
                        var src = arrs[i].querySelector(".Link--primary").href+end;
                        if(matchSrc(src)) {

                            var spans = arrs[i].querySelector('td.react-directory-row-name-cell-large-screen > div > div > div > div > a').parentNode;
                            spans.style = "display: flex !important;flex-direction: row;align-items: center;";
                            arrs[i].querySelector('td.react-directory-row-name-cell-large-screen > div').style.height = "auto";

                            let imgs = document.createElement("img");
                            imgs.style = imgStyle;
                            imgs.src = src;
                            imgs.className = 'vbsNames';
                            spans.insertBefore(imgs,arrs[i].querySelector('td.react-directory-row-name-cell-large-screen > div > div > div > div > a'))

                            imgs.onload = (ig)=>{
                                imgs.title = "Intrinsic size: "+imgs.naturalWidth + "×"+imgs.naturalHeight + "px";
                            }
                            imgs.onclick = function() {
                                window.open(imgs.src);
                            }
                            imgs.onmouseover = function(event) {
                                let e = event.target;
                                e.style = imgStyleHover;

                                tempImgDom.src = imgs.src;
                                tempImgDom.style.display = 'block';
                            }
                            imgs.onmouseout = function(event) {
                                let e = event.target;
                                e.style = imgStyle;

                                tempImgDom.style.display = 'none';
                            }
                        }
                    }
                }
            }
            // 码云 Gitee
            if (location.host.indexOf("gitee.com") !== -1){
                var arrs1 = document.querySelector('#git-project-content').getElementsByClassName('tree-holder')[0].getElementsByClassName('tree-table')[0].getElementsByClassName('five wide column tree-item-file-name tree-list-item');
                if(document.getElementsByClassName('vbsNames').length > 0) {
                    return false;
                }
                const tempImgDom = document.createElement("img");
                tempImgDom.style = "position: fixed;top: 0px;right: 0;object-fit: contain;pointer-events: none;display: block;z-index: 99999;width: 50vw;height: 100vh;background: rgba(0, 0, 0, 0.05);display: none;"
                document.querySelector('body').append(tempImgDom);
                //console.log(location.pathname,'目录，图片渲染完成，点击小图可在新窗口查看并保存图片')
                for (var j = 0; j < arrs1.length; j++) {
                    let src1 = arrs1[j].getElementsByTagName('a')[0].href.replace('/blob/','/raw/');
                    if(matchSrc(src1)) {
                        let imgs1 = document.createElement("img");
                        imgs1.style = imgStyle;
                        imgs1.src = src1;
                        imgs1.className = 'vbsNames';
                        arrs1[j].insertBefore(imgs1,arrs1[j].getElementsByTagName('a')[0]);
                        //arrs1[j].appendChild(imgs1);
                        imgs1.onload = ()=>{
                            imgs1.title = "Intrinsic size: "+imgs1.naturalWidth + "×"+imgs1.naturalHeight + "px";
                            // let pix = imgs1.naturalWidth / imgs1.naturalHeight;
                            // imgStyleHover.replace('width: 400px; height: 200px;', 'width:300px;height:'+300/pix+'px;')
                        }
                        imgs1.onclick = function() { window.open(src1);}
                        imgs1.parentNode.parentNode.onmouseover = function(event) {
                             //console.log(event)
                            //let e = event.target;
                            //e.style = imgStyleHover;
                            imgs1.style = imgStyleHover;

                            tempImgDom.src = imgs1.src;
                            tempImgDom.style.display = 'block';
                        }
                        imgs1.parentNode.parentNode.onmouseout = function(event) {
                            //let e = event.target;
                            //e.style = imgStyle;
                            imgs1.style = imgStyle;

                             tempImgDom.style.display = 'none';
                        }
                    }
                }
            }
    };
}

window.onLoad = setTimeout(()=>{
        setInterval(()=>{loadImgs();},1000);
},400)