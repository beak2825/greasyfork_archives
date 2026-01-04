// ==UserScript==
// @name         PubMed快捷键
// @version      2024.08.08
// @description  高亮Review标签，增加功能按钮，一键收藏PubMed文献到默认收藏夹或导出nbib文件
// @author       SpaceThing
// @license      GPL-3.0-or-later
// @match        https://pubmed.ncbi.nlm.nih.gov/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nih.gov
// @namespace    https://greasyfork.org/users/916402
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488189/PubMed%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/488189/PubMed%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function start() {
        var currentPage = window.location.href;
        if (currentPage.includes("https://pubmed.ncbi.nlm.nih.gov/?term=")) {
            searchPage();
            console.log('PubMed快捷键：搜索页')
        } else if (currentPage.match(/https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/\d+\//)) {
            detailPage();
            console.log('PubMed快捷键：详情页')
        };
    }

    // 创建遮罩层和弹窗
    function createPopup(note, content) {
        // 创建遮罩层
        var overlay = document.createElement('div');
        overlay.className = 'popup-overlay ' + note;
        overlay.style.position = 'fixed';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '10000';
        document.body.appendChild(overlay);
        // 创建弹窗
        var popup = document.createElement('div');
        popup.className = 'notification';
        popup.innerHTML = '<div class="popup-content noty_type__information uswdsTheme"></div>';
        overlay.appendChild(popup);
        if (content) {
            overlay.querySelector('.popup-content').innerHTML = content;
        };
    };

    // 修改弹窗文本
    function changePopup(note, content) {
        var overlay = document.querySelector('.' + note);
        if (overlay) {
            overlay.querySelector('.popup-content').innerHTML = content;
        };
    };

    // 关闭弹窗
    function closePopup(note) {
        var overlay = document.querySelector('.' + note);
        if (overlay) {
            overlay.remove();
        };
    };

    // 点击关闭弹窗
    function clickClose() {
        var overlay = document.querySelector('.popup-overlay');
        if (overlay) {
            overlay.addEventListener('click',
                                     function() {
                if (event.target.classList.contains('popup-overlay')) {
                    var overlay = document.querySelector('.popup-overlay');
                    if (overlay) {
                        overlay.remove();
                    };
                };
            });
        };
    };

    // 切换点击穿透
    function setPointerEvents(element, allowPointerEvents) {
        if (allowPointerEvents) {
            element.style.pointerEvents = 'none';
        } else {
            element.style.pointerEvents = 'auto';
        };
    };

    function searchPage() {
        // 高亮Review标签
        var publicationType = document.querySelectorAll('.publication-type');
        if (publicationType) {
            for (var i = 0; i < publicationType.length; i++) {
                var element = publicationType[i];
                if (element.textContent.trim() == 'Review.') {
                    element.style.backgroundColor = '#20558A';
                    element.style.borderRadius = '0.5rem';
                    element.style.color = 'white';
                    element.style.marginLeft = '20px';
                    element.style.paddingLeft = '5px';
                    element.style.paddingRight = '5px';
                };
            };
        };

        // 创建Filter out review按钮
        var notReview = document.createElement('div');
        notReview.className = 'form-field filters-field';
        notReview.innerHTML = '<div class="form-field filters-field"><div class="actions-bar" style="margin-top: 0px;"><button id="not-review" type="button" class="reset-btn usa-button-outline" style="width: 100%; margin-top: 10px;">Filter Out Review</button></div></div>';
        document.querySelector('.user-filters').insertAdjacentElement('afterend', notReview);
        document.querySelector("#not-review").addEventListener('click', notReviewFunc);

        // Filter out review按钮点击事件
        function notReviewFunc() {
            var currentUrl = window.location.href;
            var urlParams = new URLSearchParams(window.location.search);
            var termValue = urlParams.get('term');
            var notReview = decodeURIComponent(termValue).includes('NOT (Review[Publication Type])');
            if (!notReview) {
                var originalTerm = termValue.replace(/ /g, '+');
                var modifiedTerm = '(' + originalTerm + ')+NOT+(Review[Publication+Type])';
                var newUrl = currentUrl.replace(originalTerm, modifiedTerm);
                window.location.href = newUrl;
            } else {
                // 显示弹窗
                createPopup('notReview', 'All ready filtered out review.');
                // 启用点击穿透
                var overlay = document.querySelector('.popup-overlay');
                setPointerEvents(overlay, true);
                // 禁用点击穿透
                setTimeout(function() {
                    setPointerEvents(overlay, false);
                }, 250);
                setTimeout(function() {
                    closePopup('notReview');
                }, 10000);
                clickClose();
            };
        };
    };

    function detailPage() {
        // 获取默认收藏夹id
        window.haveId = false;
        // 获取nbib文件
        window.haveNbib = false;
        // 获取PMID
        window.pmid = document.querySelector('.current-id').innerText;
        // 获取标题
        window.title = document.querySelector('.heading-title').innerText;
        // 获取年份
        window.year = document.querySelector('#full-view-heading .cit').innerText.match(/\d+(?= )/);
        // 获取期刊
        window.journal = document.querySelector('#full-view-journal-trigger').innerText;
        // 获取作者
        window.authors = formatAuthors(document.querySelectorAll('#full-view-heading .full-name')[0].textContent);
        // 获取csrfmiddlewaretoken
        window.csrfmiddlewaretoken = document.querySelector('input[name=csrfmiddlewaretoken]').value;

        // 设置通用弹窗提示语
        window.loading = 'Loading...';
        window.timeout = 'Timeout, please try again.';
        window.fail = 'An unexpected error occurred, please try again.';
        window.login = 'Please <a href = ' + document.querySelector("#account_login").href + '>log in</a> first.';

        // 获取默认收藏夹id
        getCollections();
        function getCollections() {
            if (!window.haveId) {
                // 获取收藏夹列表
                var xhrCollections = new XMLHttpRequest();
                xhrCollections.open('GET', 'https://pubmed.ncbi.nlm.nih.gov/list-existing-collections/');
                xhrCollections.send();
                xhrCollections.onreadystatechange = function() {
                    if (xhrCollections.readyState == 4) {
                        if (xhrCollections.status == 200) {
                            // 提取默认收藏夹的id
                            var response = xhrCollections.responseText;
                            var json = JSON.parse(response);
                            json.collections.forEach(function(collection) {
                                if (collection.name == "Favorites") {
                                    window.collection_id = collection.id;
                                    window.haveId = true;
                                    window.success = 'New items were added to your collection. <a href="https://www.ncbi.nlm.nih.gov/myncbi/collections/' + window.collection_id + '/">Edit your collection.</a>';
                                    console.log('Successfully retrieved Favorites id');
                                }
                            });
                        } else {
                            // 请求失败，打印错误信息
                            console.log('There has been a problem fetching favorites id');
                        };
                    };
                };
            };
        };

        // 获取nbib文件
        getNbib();
        function getNbib() {
            if (!window.haveNbib) {
                var xhrNbib = new XMLHttpRequest();
                var nbib = 'https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=medline&download=y&id=' + window.pmid;
                xhrNbib.responseType = 'blob';
                xhrNbib.open('GET', nbib);
                xhrNbib.send();
                xhrNbib.onreadystatechange = function() {
                    if (xhrNbib.readyState == 4) {
                        if (xhrNbib.status == 200) {
                            // 储存nbib为blob
                            var blob = xhrNbib.response;
                            window.nibi_blob = window.URL.createObjectURL(blob);
                            var link = document.createElement('a');
                            link.className = 'nbib-link';
                            link.href = window.nibi_blob;
                            link.download = window.year + ', ' + window.authors + ', ' + window.title + '.nbib';
                            document.body.appendChild(link);
                            window.haveNbib = true;
                            console.log('Successfully retrieved nbib');
                        } else {
                            // 请求失败，打印错误信息
                            console.log('There has been a problem fetching nbib');
                            changePopup('nbib', window.fail);
                            setTimeout(function() {
                                closePopup('nbib');
                            }, 10000);
                            clickClose();
                        };
                    };
                };
            };
        };

        // 添加当前文献到默认收藏夹
        function addFavorites() {
            var overlay = document.querySelector('.popup-overlay');
            // 构造请求
            var data = 'article_ids=' + window.pmid + '&csrfmiddlewaretoken=' + window.csrfmiddlewaretoken + '&collection_id=' + window.collection_id;
            // 发送收藏请求
            var xhrFavorites = new XMLHttpRequest();
            xhrFavorites.open('POST', 'https://pubmed.ncbi.nlm.nih.gov/add-to-existing-collection/');
            xhrFavorites.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhrFavorites.send(data);
            // 判断是否收藏成功，并提示任务状态
            xhrFavorites.onreadystatechange = function() {
                if (xhrFavorites.readyState == 4 && xhrFavorites.status == 200) {
                    var response = xhrFavorites.responseText;
                    var answer = '{"collection_id": "' + window.collection_id + '"}';
                    if (response == answer) {
                        changePopup('favorites', window.success);
                        // 禁用点击穿透
                        setTimeout(function() {
                            setPointerEvents(overlay, false);
                        }, 250);
                    } else {
                        changePopup('favorites', window.fail);
                        // 禁用点击穿透
                        setTimeout(function() {
                            setPointerEvents(overlay, false);
                        }, 250);
                    };
                } else {
                    changePopup('favorites', window.fail);
                    // 禁用点击穿透
                    setTimeout(function() {
                        setPointerEvents(overlay, false);
                    }, 250);
                };
                setTimeout(function() {
                    closePopup('favorites');
                }, 10000);
                clickClose();
            };
        }

        // 格式化作者信息
        function formatAuthors(name) {
            // 将名字按空格和连接符分割成数组
            var parts = name.split(/[\s-]+/);
            // 如果只有一个部分，则直接返回
            if (parts.length == 1) {
                return name;
            };
            // 获取最后一个部分作为姓氏
            var lastName = parts.pop();
            // 获取其他部分作为名字，并将它们转换为首字母大写
            var firstName = parts.map(part => part.charAt(0).toUpperCase()).join('');
            return lastName + ' ' + firstName;
        }

        // 创建收藏和nbib按钮
        var place = document.querySelector('.collections-button-container');
        if (place) {
            // 创建收藏按钮
            var favoritesButton = document.createElement('button');
            favoritesButton.className = 'collections-button';
            favoritesButton.setAttribute('id', 'favoritesButton');
            favoritesButton.innerHTML = '<span class="button-label">Favorites</span>';
            place.appendChild(favoritesButton);
            // 创建nbib按钮
            var nbibButton = document.createElement('button');
            nbibButton.className = 'collections-button';
            nbibButton.setAttribute('id', 'nbibButton');
            nbibButton.innerHTML = '<span class="button-label">nbib</span>';
            place.appendChild(nbibButton);
        };
        var inline = document.querySelector('.actions-buttons.inline > .inner-wrap')
        if (inline) {
            // 删除不必要按钮
            inline.querySelector('.citation-button').remove();
            inline.querySelector('.more-actions-button').remove();
            // 创建收藏按钮
            var favoritesButton = document.createElement('button');
            favoritesButton.className = 'citation-button';
            favoritesButton.setAttribute('id', 'favoritesButton-inline');
            favoritesButton.innerHTML = '<span class="button-label">Favorites</span>';
            inline.appendChild(favoritesButton);
            // 创建nbib按钮
            var nbibButton = document.createElement('button');
            nbibButton.className = 'citation-button';
            nbibButton.setAttribute('id', 'nbibButton-inline');
            nbibButton.innerHTML = '<span class="button-label">nbib</span>';
            inline.appendChild(nbibButton);;
        };

        // 收藏按钮点击事件
        function favoritesButtonClick() {
            // 显示弹窗
            createPopup('favorites');
            changePopup('favorites', window.loading);
            // 启用点击穿透
            var overlay = document.querySelector('.popup-overlay');
            setPointerEvents(overlay, true);
            if (!window.haveId) {
                getCollections();
            };
            if (window.haveId) {
                addFavorites();
            } else {
                // 提示登录
                changePopup('favorites', window.login);
                setTimeout(function() {
                    closePopup('favorites');
                }, 10000);
                // 禁用点击穿透
                setTimeout(function() {
                    setPointerEvents(overlay, false);
                }, 250);
                clickClose();
            };
        };

        document.querySelector('#favoritesButton').addEventListener('click', favoritesButtonClick);
        document.querySelector('#favoritesButton-inline').addEventListener('click', favoritesButtonClick);

        // nbib按钮点击事件
        function nbibButtonClick() {
            if (!window.haveNbib) {
                // 显示弹窗
                createPopup('nbib');
                changePopup('nbib', window.loading);
                // 启用点击穿透
                var overlay = document.querySelector('.popup-overlay');
                setPointerEvents(overlay, true);
                getNbib();
                setTimeout(function() {
                    changePopup('nbib', window.timeout);
                    setTimeout(function() {
                        closePopup('nbib');
                    }, 10000);
                }, 3000);
                // 禁用点击穿透
                setTimeout(function() {
                    setPointerEvents(overlay, false);
                }, 250);
                clickClose();
            };
            if (window.haveNbib) {
                var link = document.querySelector('.nbib-link');
                link.click();
            };
        };

        document.querySelector('#nbibButton').addEventListener('click', nbibButtonClick);
        document.querySelector('#nbibButton-inline').addEventListener('click', nbibButtonClick);
    }

    start();
})();