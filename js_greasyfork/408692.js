// ==UserScript==
// @name         MCBBS Fancybox
// @namespace    https://i.zapic.cc/
// @version      0.1-beta
// @description  Use Fancybox to takeover image zoom in MCBBS
// @author       Zapic
// @match        https://www.mcbbs.net/*
// @require      https://cdn.bootcdn.net/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js
// @run-at       document-body
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/408692/MCBBS%20Fancybox.user.js
// @updateURL https://update.greasyfork.org/scripts/408692/MCBBS%20Fancybox.meta.js
// ==/UserScript==

(async()=> {
    await unsafeWindow.MExt;
    let MExt = unsafeWindow.MExt;
    let $ = MExt.jQuery;
    MExt.exportModule({
        core: () => {
            $('head').append('<link rel="stylesheet" type="text/css" href="https://cdnjs.loli.net/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.css" />');
            let HookImages = () => {
                $(".t_f:not([fancybox-apply])").attr("facybox-apply",'').each((i,post)=>{
                    let ImageCollect = $(post).find("img.zoom[file]");
                    ImageCollect.removeAttr("onclick zoomfile").each((i,Image)=>{
                        let frame = document.createElement('a');
                        let RefImage = Image.cloneNode();
                        RefImage.onload = ()=>{
                            RefImage.style.width = RefImage.style.height = '';
                            RefImage.previousSibling == null ? null : RefImage.previousSibling.remove();
                            RefImage.parentNode.previousElementSibling == null ? null : (RefImage.parentNode.previousElementSibling.localName == "div" ? RefImage.parentNode.previousElementSibling.remove() : null);
                            if (!RefImage.getAttribute('_load')) {
                                RefImage.setAttribute('_load', 1);
                                if (RefImage.getAttribute('lazyloadthumb')) {
                                    thumbImg(RefImage);
                                }
                            }
                        };
                        setTimeout(()=>{RefImage.removeAttribute("_load");},100);
                        frame.href = Image.getAttribute("file");
                        frame.setAttribute("data-fancybox",post.id);
                        frame.appendChild(RefImage);
                        Image.after(frame);
                        Image.remove();
                    });
                });
            };
            $(HookImages);
            unsafeWindow.zoom = (img) =>{
                $.fancybox.open({
                    src  : img.getAttribute("file"),
                    type : 'image'
                });
            };
        },
        "config": [{
            "id": "fancyBox",
            "default": true,
            "name": "Fancybox图片灯箱",
            "desc": "使用Fancybox替换原来的图片放大功能.",
            "type": "check"
        }],
        runcase: ()=>{return MExt.ValueStorage.get("fancyBox");}
    });
})();