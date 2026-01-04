// ==UserScript==
// @name         z-library修改label显示
// @namespace    http://tampermonkey.net/
// @version      2025.12.17
// @description  将文件类型和文件大小显示为彩色标签
// @author       AN drew
// @match        https://*.den101.ru/*
// @run-at       document-end
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/484338/z-library%E4%BF%AE%E6%94%B9label%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/484338/z-library%E4%BF%AE%E6%94%B9label%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==


(function() {
    'use strict';


    GM_addStyle(`
label.size,
z-bookcard::part(size) {
    background: green;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}


label.pdf,
z-bookcard::part(pdf) {
    background: red;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}


label.epub,
z-bookcard::part(epub) {
    background: orange;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}


label.mobi,
z-bookcard::part(mobi) {
    background: blue;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}


label.azw3,
z-bookcard::part(azw3) {
    background: black;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}


label.txt,
z-bookcard::part(txt) {
    background: gray;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}


label.fb2,
z-bookcard::part(fb2) {
    background: #2db7f7;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}


label.chm,
z-bookcard::part(chm) {
    background: brown;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}


label.lit,
z-bookcard::part(lit) {
    background: purple;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}


label.rar,
z-bookcard::part(rar) {
    background: #03eb9e;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}


label.docx,
z-bookcard::part(docx) {
    background: #2975e6;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}


label.lrf,
z-bookcard::part(lrf) {
    background: #005780;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}


label.djvu,
z-bookcard::part(djvu) {
    background: #dd348a;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}


label.rtf,
z-bookcard::part(rtf) {
    background: #c9bf33;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}


label.htm,
z-bookcard::part(htm) {
    background: #e54d26;
    color: white;
    padding: 2px 5px;
    font-weight: bold;
    font-size: 16px;
}
    `);


    /*
    if(window.location.href.indexOf('/s/') > -1)
    {
    */
    if(('.bookProperty.property__file').length>0)
    {
        $('.resItemBox.resItemBoxBooks').each(function(){
            if(!$(this).hasClass('done'))
            {
                let property_file=$(this).find('.bookProperty.property__file .property_value');
                let value= property_file.text();
                let arr=value.split(",");
                let type=arr[0].trim();
                let size=arr[1].trim();
                property_file.html('<label class="'+type.toLowerCase()+'">'+type+'</label>&nbsp;&nbsp;<label class="size">'+size+'</label>');
                $(this).addClass('done')
            }
        });
    }


    let t=setInterval(function(){
        if($('z-bookcard').length>0)
        {
            let s=$('z-bookcard').get(0).shadowRoot;
            if(s!=undefined)
            {
                clearInterval(t);
                $('z-bookcard').each(function(){
                    if(!$(this).hasClass('done'))
                    {
                        let shadowRoot=this.shadowRoot;
                        let property_file= $(shadowRoot).find('.meta.desktop .element').eq(-2);
                        let value=property_file.find('span').text();
                        let arr=value.split(",");
                        let type=arr[0].trim();
                        let size=arr[1].trim();
                        property_file.html('<label part="'+type.toLowerCase()+'">'+type+'</label>&nbsp;&nbsp;<label part="size">'+size+'</label>');
                        $(this).addClass('done')
                    }
                })
            }
        }
    },1000);
    /*
    }
    else if(window.location.href.indexOf('/book/') > -1)
    {
    */
    if(('.bookProperty.property__file').length>0)
    {
        $('.bookDetailsBox').each(function(){
            if(!$(this).hasClass('done'))
            {
                let property_file=$(this).find('.bookProperty.property__file .property_value');
                let value= property_file.text();
                let arr=value.split(",");
                let type=arr[0].trim();
                let size=arr[1].trim();
                property_file.html('<label class="'+type.toLowerCase()+'">'+type+'</label>&nbsp;&nbsp;<label class="size">'+size+'</label>');
                $(this).addClass('done')
            }
        })
    }


    if($('.delimiter').length>0)
        $('.books-mosaic').before($('.delimiter'));
    if($('#booklists_comments').length>0)
        $('.books-mosaic').before($('#booklists_comments'));
    if($('z-comments').length>0)
        $('.books-mosaic').before($('z-comments'));


    GM_addStyle(`
        .toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            width: 200px;
            padding: 15px 25px;
            border-radius: 50px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 1000;
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
            gap: 10px;
        }

        .toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        .toast-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #4CAF50;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }

    `);

    // 创建Toast元素
    function createToastElement() {
        const toast = document.createElement('table');
        toast.className = 'toast';
        toast.innerHTML = `
        <tr>
                <td class="toast-icon">✓</td>
                <td>&nbsp;&nbsp;</td>
                <td>主题正在切换中...</td>
        </tr>
            `;
        document.body.appendChild(toast);
        return toast;
    }

    // 显示Toast通知
    function showToast() {
        // 如果已经存在Toast，先移除它
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // 创建新的Toast元素
        const toast = createToastElement();

        // 使用requestAnimationFrame确保DOM更新后再添加show类
        requestAnimationFrame(() => {
            toast.classList.add('show');

            // 2秒后隐藏Toast
            setTimeout(() => {
                toast.classList.remove('show');

                // 动画结束后移除元素
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 400);
            }, 2000);
        });
    }


    $('.zlibicon-glass').click(function(){


        // 获取自定义元素
        const themesBrowser = document.querySelector('z-themes-browser');


        ZLibraryContextMenu.onClose=function(){}


        $(themesBrowser).attr('onchange','');


        if (themesBrowser) {
            // 访问Shadow Root
            const shadowRoot = themesBrowser.shadowRoot;

            if (shadowRoot) {
                // 获取所有.theme-trigger元素
                const themeTriggers = shadowRoot.querySelectorAll('a.theme-trigger');
                $(themeTriggers).remove('attr', 'href');


                // 遍历所有元素
                themeTriggers.forEach((trigger, index) => {
                    // 阻止所有默认事件（如a标签的跳转）
                    trigger.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });


                    // 为前三个按钮绑定自定义事件
                    if (index < 3) {
                        trigger.addEventListener('click', function() {
                            showToast();

                            // 根据索引设置不同的class
                            if (index === 0) {
                                $('html').attr('class', 'glass');
                                GM_setValue('theme', 'glass');
                                setCookie('prefers_color_scheme', 'glass', 86400 * 365 * 5 * 1000);
                            } else if (index === 1) {
                                $('html').attr('class', 'glass g2');
                                GM_setValue('theme', 'glass g2');
                                setCookie('prefers_color_scheme', 'glass g2', 86400 * 365 * 5 * 1000);
                            } else if (index === 2) {
                                $('html').attr('class', 'glass g3');
                                GM_setValue('theme', 'glass g3');
                                setCookie('prefers_color_scheme', 'glass g3', 86400 * 365 * 5 * 1000)
                            }
                        });
                    }
                });
            }
        }
    })



    $('.zlibicon-light').click(function(){
        showToast();
        $('html').attr('class', 'light');
        GM_setValue('theme', 'light');
        setCookie('prefers_color_scheme', 'light', 86400 * 365 * 5 * 1000);
    });


    $('.zlibicon-dark').click(function(){
        showToast();
        $('html').attr('class', 'dark');
        GM_setValue('theme', 'dark');
        setCookie('prefers_color_scheme', 'dark', 86400 * 365 * 5 * 1000);
    });



    let t2=setInterval(function(){
        if(GM_getValue('theme')!= undefined)
        {
            if($('html').attr('class')!=GM_getValue('theme'))
            {
                $('html').attr('class', GM_getValue('theme'));
            }
        }
    },100)


    $('.books-mosaic').hide();
    $('.color1').hide();
    $('.termsCloud').hide();
    $('.related-booklists-lazy').hide();
    /*
    }
    */
})();