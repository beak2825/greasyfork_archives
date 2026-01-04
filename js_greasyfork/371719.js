// ==UserScript==
// @name          Pixiv Old Manga Viewer
// @namespace     d24193d9-3b5f-43d8-a625-49e32c476534
// @description   Rewrite new style manga view to be more like the old style, uses full size images.
// @version       1.0.19
// @author        ixzkn
// @icon          https://www.pixiv.net/favicon.ico
// @include       https://www.pixiv.net/member_illust.php?mode=*
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/371719/Pixiv%20Old%20Manga%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/371719/Pixiv%20Old%20Manga%20Viewer.meta.js
// ==/UserScript==

(function() {
    // Config: Always just go straight to the manga page (even in medium mode)
    var alwaysLoadManga = false;
    // use original size images or 1200 size
    var useOriginalImageSize = true;

    'use strict';
    document.addEventListener('DOMContentLoaded', function() {
        if(globalInitData == undefined)
        {
            return false;
        }

        function apply(){

            function getProp(obj){
                for (var i in obj){if(obj.hasOwnProperty(i)){return i;}}
            }

            // using Pixiv's own globalInitData, reconstruct all of the full URLs of the
            // manga's images
            function allFullURLs(original){
                let tzoffset = 9; // pixiv's timezone offset
                let baseurl = original ? "https://i.pximg.net/img-original/img/" : "https://i.pximg.net/img-master/img/";
                let filepostfix = original ? "" : "_master1200";

                function pad(n, width, z) {
                  z = z || '0';
                  n = n + '';
                  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
                }

                function fileType(url)
                {
                    return url.substring(url.lastIndexOf("."))
                }
                
                // derive the image list from init data:
                // could also derive from original url
                function pixivOriginalURL(createDate,id,page,url){
                    let d = new Date((new Date(createDate)).getTime() + (3600000*tzoffset));
                    let durl = d.getUTCFullYear() + "/" + pad(d.getUTCMonth()+1,2,"0") + "/" + pad(d.getUTCDate(),2,"0") + "/" + pad(d.getUTCHours(),2,"0") + "/" + pad(d.getUTCMinutes(),2,"0") + "/" + pad(d.getUTCSeconds(),2,"0") + "/";
                    return baseurl + durl + id + "_p" + page + filepostfix + fileType(url);
                }

                var id = getProp(globalInitData.preload.illust);
                var pages = globalInitData.preload.illust[id].pageCount;
                var results = [];
                var urlBase = original ? globalInitData.preload.illust[id].urls.original : globalInitData.preload.illust[id].urls.regular;
                for(var i = 0; i < pages; i++)
                {
                    results.push(pixivOriginalURL(globalInitData.preload.illust[id].uploadDate,id,i,urlBase));
                }
                return results;
            }

            let user = getProp(globalInitData.preload.user);
            var images = allFullURLs(useOriginalImageSize);
            var imagesOrig = allFullURLs(true);
            var result = `<style type="text/css">body{overflow-x:hidden;}</style><div id="base"><div id="back" style="position:fixed;top:1vh;left:1vw;font-size:2em;height:2.5vh;color:rgba(10,10,40,50);">&#x2B05;</div>`;
            // User info:
            result += `<a style="z-index:5;position:fixed;top:2vh;right:1vw;font-weight:bold;display:flex;align-items:center;" href="https://www.pixiv.net/member.php?id=`+user+`">`;
            result += `<img style="width:30px;height:30px;border-radius:30px;margin-top:0.5em;" src="`+globalInitData.preload.user[user].image+`"/>`;
            result += `<span>`+globalInitData.preload.user[user].name+`</span></a><div style="height:2.5vh;width:100vw;"></div>`;
            // Manga images:
            for (var i = 0; i < images.length; i++) {
                result += `<div style="z-index:0;position:relative;height:95vh;width:100vw;">`;
                let href = images[i];
                result += `<img onclick="window.scroll(0,`+((i+1)*document.documentElement.clientHeight)+`);" style="width:100%;height:100%;object-fit:scale-down;object-position:center center;" src="`+href+`"/>`;
                result += `<div class="position" style="position:absolute;right:2vw;top:3vh;background-color:#EEE;border-radius:5px;font-weight:bold;padding:2px;">`+(i+1)+`/`+images.length+` <a style="width:100%;text-align:center;font-weight:bold;display:block;font-size:2em;" href="`+imagesOrig[i]+`">&#10529;</a></div>`;
                result += `</div><div style="width:100vw;height:5vh;"></div>`;
            }
            result += `</div>`;

            let original = document.body.innerHTML;
            let id = getProp(globalInitData.preload.illust);
            document.body.innerHTML = result;
            document.getElementById("back").addEventListener("click",function(e){
                window.location.assign("https://www.pixiv.net/member_illust.php?mode=medium&illust_id="+id);
            });
            let currentOffset = 0;
            document.body.addEventListener("keydown",function(e){
                if(e.key == 'j'){
                    currentOffset++;
                    window.scroll(0,currentOffset*document.documentElement.clientHeight);
                }
                if(e.key == 'k')
                {
                    currentOffset--;
                    window.scroll(0,currentOffset*document.documentElement.clientHeight);
                }
            });
        }

        if(alwaysLoadManga)
        {
            apply();
        }
        else
        {
            if(window.location.search.toString().indexOf("mode=manga") != -1)
            {
                apply();
            }
            else
            {
                var observer = undefined;
                var targetNode = document.getElementById("root");
                if(targetNode == undefined){
                    return false;
                }
                var callback = function(mutationsList) {
                    var search = document.querySelector("article > div > figure a");
                    var search2 = document.querySelector("article > div > figure > div > div > button");
                    if(search != undefined && search2 != undefined)
                    {
                        if(observer){
                            observer.disconnect();
                        }
                        search.addEventListener('click',function(e){
                            apply();
                            e.preventDefault();
                            return false;
                        });
                        search2.addEventListener('click',function(e){
                            apply();
                            e.preventDefault();
                            return false;
                        });
                    }
                };

                var observer = new MutationObserver(callback);
                observer.observe(targetNode, { attributes: true, childList: true, subtree: true });
            }
        }

    }, this);
})();