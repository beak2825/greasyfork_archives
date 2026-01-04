// ==UserScript==
// @name         煎蛋本地收藏
// @namespace    jandan favorite tool
// @version      0.8.1
// @description  收藏煎蛋的帖子，保存在浏览器本地存储中
// @license      MIT
// @author       Chris
// @match        *://jandan.net/*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAz6///M+v//zPr//8z6///M+v//zPr//84Zf//OGX//zhl//84Zf//M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///OGX//zhl//84Zf//OGX//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zhl//84Zf//OGX//zhl//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zM0Nv8zNDb/M+v//zPr//8z6///M+v//zPr//8z6///MzQ2/zM0Nv8z6///M+v//zPr//8z6///M+v//zPr//8zNDb/MzQ2/zPr//8z6///M+v//zPr//8z6///M+v//zM0Nv8zNDb/M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M9n//zPZ//8z2f//M9n//zPr//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M9n//zPZ//8z2f//M9n//wAAAAAAAAAAAAAAADPZ//8z6///M+v//zPr//8z6///M+v//zPr//8z6///M+v//zPZ//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAz2f//M9n//zPZ//8z2f//M9n//zPZ//8z2f//M9n//zPZ//8z2f//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADc14/83NeP/NzXj/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3NeP/NzXj/zc14/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANzXj/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgBwAA4AcAAP4/AAD+PwAA/v8AAA==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493852/%E7%85%8E%E8%9B%8B%E6%9C%AC%E5%9C%B0%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/493852/%E7%85%8E%E8%9B%8B%E6%9C%AC%E5%9C%B0%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==
addCSS('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
addScript('https://cdn.jsdelivr.net/npm/toastify-js');
addStyles();
(function() {
    'use strict';

    // Initialize
    const _ELList = $('.commentlist li');
    const DB_Name = 'jandan';
    let UPDATE_LIST = false;

    // Add favorite button to each item
    _ELList.each(function() {
        const id = $(this).find('.righttext a').text();
        const type = $(this).find('.text small').text();
        const pic = $(this).find('.view_img_link').attr('href');
        const FavoriteBtn = $('<span class="favorite" style="cursor:pointer;">⭐</span>');
        FavoriteBtn.on('click', function() {
            saveId(id, type, pic);
        });
        $(this).find('.righttext').append(FavoriteBtn);
    });

    function saveId(id, type, pic) {
        const Favorite_List = db.get('favorite', {});
        Favorite_List[id] = {
            "time": new Date().getTime(),
            "type": getType(type),
            "pic": pic || '#',
            "remark": ""
        };
        db.save('favorite', Favorite_List);
        UPDATE_LIST = true;
        Toastify({
            text: "收藏成功\n点击添加备注",
            duration: 2000,
            position: "center",
            style: {
                background: "#262626"
            },
            onClick: () => {
                let remark = prompt("输入备注信息");
                if (remark !== null) {
                    Favorite_List[id]["remark"] = remark;
                    db.save('favorite', Favorite_List);
                }
            }
        }).showToast();
    }

    function getType(type) {
      const url = window.location.href;

      const typeMap = {
          'https://jandan.net/ooxx': '随手拍',
          'https://jandan.net/top-ooxx': '随手拍',
          'https://jandan.net/treehole': '树洞',
          'https://jandan.net/top-comments': '树洞',
          'https://jandan.net/top': '无聊图',
          'https://jandan.net/pic': '无聊图',
      };

      return typeMap[url] || extractType(type);
    }

    function extractType(text) {
      const match = text.match(/@([\u4e00-\u9fa5]+)/);
      return match ? match[1] : '3日最佳';
    }

    const db = {
        save(key, value) {
            localStorage.setItem(DB_Name + '-' + key, JSON.stringify(value));
        },
        get(key, defaultValue = {}) {
            try {
                return JSON.parse(localStorage.getItem(DB_Name + '-' + key)) || defaultValue;
            } catch (err) {
                return defaultValue;
            }
        },
    };

    // Event delegation for dynamically added delete buttons
    $(document).on('click', '.deleteFavorite', function() {
        const id = $(this).data('id');
        deleteId(id);
        if(UPDATE_LIST) {
            $('#favoriteList tbody').html(writeList());
            UPDATE_LIST = false;
        }
    });

    // Clear all favorites
    $(document).on('click', '#clearAllFavorites', function() {
        const isConfirmed = confirm("即将清空收藏列表，确认吗？");
        if (isConfirmed) {
            clearAllFavorites();
        }
    });

    function writeList() {
        const Favorite_List = db.get('favorite', {});
        return Object.keys(Favorite_List).map(i => `<tr style="border-block:1px solid #e5e5e5" >
            <td>${new Date(Favorite_List[i].time).toLocaleDateString()}</td>
            <td><a href="${Favorite_List[i].pic}" target="_blank">${Favorite_List[i].type}</a></td>
            <td><a href="https://jandan.net/t/${i.toString()}">${i.toString()}</a></td>
            <td>${Favorite_List[i].remark}</td>
            <td><button class="deleteFavorite" data-id="${i}">❌</button></td>
            </tr>`).join('');
    }

    function deleteId(id) {
        const Favorite_List = db.get('favorite', {});
        delete Favorite_List[id];
        db.save('favorite', Favorite_List);
        UPDATE_LIST = true;
    }

    function clearAllFavorites() {
        db.save('favorite', {});
        UPDATE_LIST = true;
        $('#favoriteList tbody').html('');
    }

    // Prepare favorite list window
    let Favorite_List_Show = false;
    const Favorite_List_Win = $('<div id="favoriteList"><table style="width:100%;border-collapse:collapse;" ><thead><tr><th>日期</th><th>分类</th><th>编号</th><th>备注</th><th><button id="clearAllFavorites" style="cursor:pointer;">🗑️</button></th></tr></thead><tbody>'+ writeList() +'</tbody></table></div>');

    $('body').append('<div id="overlay"></div>');
    $('body').append(Favorite_List_Win);

    // Toggle favorite list display
    const Member_Btn = $('a[href="/member"]');
    const Favorite_List_Btn = $('<a class="nav-link" style="cursor:pointer;" ><i class="i-Favorites"></i>收藏列表</a>');
    Member_Btn.parent().append(Favorite_List_Btn);
    Favorite_List_Btn.on('click', function() {
        if(Favorite_List_Show) {
            $('#favoriteList').hide();
            $('#overlay').hide();
        } else {
            if(UPDATE_LIST) {
                $('#favoriteList tbody').html(writeList());
                UPDATE_LIST = false;
            }
            $('#favoriteList').show();
            $('#overlay').show();
        }
        Favorite_List_Show = !Favorite_List_Show;
    });

    $('#overlay').on('click', function() {
        $(this).hide();
        $('#favoriteList').hide();
        Favorite_List_Show = false;
    });

})();

function addCSS(filename) {
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('link');
    style.href = filename;
    style.type = 'text/css';
    style.rel = 'stylesheet';
    head.append(style);
};

function addScript(filename) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';
    head.append(script);
};
function addStyles() {
    var css = `
        #overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 100;
            display: none;
        }
        #favoriteList {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60%;
            height: 80%;
            overflow: auto;
            background: #ffffff;
            border: 1px solid #e5e5e5;
            z-index: 101;
            display: none;
        }
    `;
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
};