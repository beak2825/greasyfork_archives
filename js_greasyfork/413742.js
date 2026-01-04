// ==UserScript==
// @name         NLegs.com Improved
// @namespace    http://nlegs.com/
// @version      1.0
// @description  NLegs.com viewer and adblocker
// @author       Jokhakaali
// @match        http://nlegs.com/*
// @match        http://www.nlegs.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/413742/NLegscom%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/413742/NLegscom%20Improved.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(!GM_getValue('downloads')) GM_setValue('downloads', {});
    if(!GM_getValue('favorites')) GM_setValue('favorites', {});

    // remove ad.fly script tag
    var body = document.getElementsByTagName('body')[0];
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const child of mutation.addedNodes) {
                    if (child.src && child.src.includes('adf.ly')) {

                        child.type = 'javascript/blocked';

                        // Firefox has this additional event which prevents scripts from beeing executed
                        const beforeScriptExecuteListener = function (event) {
                            // Prevent only marked scripts from executing
                            if(child.getAttribute('type') === 'javascript/blocked') {
                                event.preventDefault()
                            }
                            child.removeEventListener('beforescriptexecute', beforeScriptExecuteListener)
                        }
                        child.addEventListener('beforescriptexecute', beforeScriptExecuteListener)

                        mutation.target.removeChild(child);

                    }
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(body, config)

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    function getElementsByXpath(path) {
        const res = document.evaluate(path, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        const arr = [];
        var thisNode = res.iterateNext();

        while (thisNode) {
            arr.push(thisNode);
            thisNode = res.iterateNext();
        }
        return arr;
    }

    var urlMatch = /\/([a-z]+)\/(\d{4}\/\d{2}\/\d{2}\/[0-9a-zA-Z]+|\d+)/.exec(window.location.pathname);

    if(!urlMatch) { urlMatch = ['', 'model', '1'] }

    getElementByXpath('/html/body').style = 'background-color:black;';
    //getElementByXpath('/html/body/div').style = 'margin:0;';
    getElementByXpath('/html/body/div/div[1]/div').style = 'background-color:transparent;';
    getElementByXpath('/html/body/div/div[1]/div').innerHTML = '<a style="color:white;" href="http://www.nlegs.com">Home</a>';

    if(urlMatch) {
        var pageType = urlMatch[1];
        var pageId = urlMatch[2];

        if (pageType === 'model') {
            getElementByXpath('/html/body/div/div[2]/div').style = 'background-color:transparent;border:none';
            getElementsByXpath('/html/body/div/div[2]/div').forEach(x => x.style = 'padding:3px;color:white;');
            getElementsByXpath('/html/body/div/div[3]/div/ul/li/a').forEach(x => x.style = 'padding:10px;color:white;background-color:transparent;border:none');
            getElementByXpath('/html/body/div/div[3]/div/ul').style = 'background-color:transparent;border:none';

            getElementsByXpath('/html/body/div/div[2]/div').forEach(x => {
                const [link, title] = x.children;
                const thumbStyle = link.children[0].style['background-image'];
                const imgUrlThumb = /\"(.+)\"/.exec(thumbStyle)[1];
                // console.log(link.href, title.innerHTML, imgUrlThumb);
                GM_setValue('global-' + link.href, [ link.href, title.innerHTML, imgUrlThumb ]);
            });

            const buttonBar = getElementByXpath('/html/body/div/div[1]/div');
            const favoriteButton = document.createElement('a');
            favoriteButton.innerHTML = 'Favorites';
            favoriteButton.style = 'color:white; margin-left:15px;cursor:pointer;user-select:none;text-decoration:none';
            favoriteButton.onclick = () => {
                window.location.hash = '#favorites'
                console.log('favorites');
                const nav = getElementByXpath('/html/body/div/div[3]');
                favoriteButton.style = 'display:none';
                nav.parentNode.removeChild(nav);


                const childList = getElementByXpath('/html/body/div/div[2]');
                childList.innerHTML = '';

                const favorites = GM_getValue('favorites');
                for (const favorite of Object.values(favorites)) {
                    console.log(favorite);
                    const div = document.createElement('div');
                    div.className = 'col-xs-6 col-sm-4 col-md-3 col-lg-2'
                    div.style = 'padding:3px;color:white;';
                    const a = document.createElement('a');
                    div.appendChild(a);
                    a.href = favorite[0];
                    const a_img = document.createElement('div');
                    a_img.className = 'img-div';
                    a_img.style = "background-image:url('" + favorite[2] + "')"
                    a.appendChild(a_img);
                    const span = document.createElement('span');
                    div.appendChild(span);
                    span.className = 'title';
                    span.innerHTML = favorite[1];

                    childList.appendChild(div);
                }
            };
            buttonBar.appendChild(favoriteButton);

            if(window.location.hash == '#favorites') {
                favoriteButton.click();
            }

            document.addEventListener('click', function(event) {
                var isClickInside = getElementByXpath('/html/body/div').contains(event.target);

                if (!isClickInside) {
                    if (event.offsetX > (document.body.offsetWidth * 0.5)) {
                        // click on right side
                        checkKey({keyCode: '39'})
                    } else {
                        // click on left side
                        checkKey({keyCode: '37'})
                    }
                }
            });

            document.onkeydown = checkKey;
            function checkKey(e) {

                e = e || window.event;

                if (e.keyCode == '37') {
                    // left arrow
                    const page = pageId - 0;
                    if (page > 1) {
                        window.location.pathname = '/model/' + (page - 1) + '.html'
                    }
                }
                else if (e.keyCode == '39') {
                    // right arrow
                    const page = pageId - 0;
                    if (page > 1) {
                        window.location.pathname = '/model/' + (page + 1) + '.html'
                    }
                }
                else if (e.keyCode == '8') {
                    // backspace
                    window.history.back();
                }
                else if (e.keyCode == '70') {
                    // 'f' key (export to console)
                    const favorites = Object.values(GM_getValue('favorites'));

                    const strings = [
                        '=== LINKS ONLY ===',
                        '',
                        ...favorites.map(x => x[0]),
                        '',
                        '',
                        '=== JSON ===',
                        '',
                        JSON.stringify(GM_getValue('favorites')),
                        '',
                        '',
                        '=== BOOKMARK ===',
                        '',
                        GM_getValue('bookmark') || '(not set)',
                    ].join('\n');
                    console.log(strings);
                }
                else if (e.keyCode == '66') {
                    // 'b' key (go to bookmark)
                    if (GM_getValue('bookmark')) window.location.href = GM_getValue('bookmark');
                }
                else if (e.keyCode == '78') {
                    // 'n' key (set bookmark)
                    GM_setValue('bookmark', window.location.href);
                    console.log('bookmark set to', window.location.href);
                }
                // else console.log(e.keyCode)

            }
        }

        else if(pageType === 'girls') {
            function sizeChanged(x) {
                console.log(x.matches)
                if (x.matches) {
                    getElementsByXpath('/html/body/div/div[4]/div/div').forEach(x => x.style = 'padding:5px 0 0 0;width:14.28%');
                } else {
                    getElementsByXpath('/html/body/div/div[4]/div/div').forEach(x => x.style = 'padding:5px 0 0 0;');
                }
            }
            var x = window.matchMedia("(min-width: 992px)")
            sizeChanged(x)
            x.addListener(sizeChanged)

            function sizeChanged2(x) {
                console.log(x.matches)
                if (x.matches) {
                    getElementByXpath('/html/body/div').style = 'width:95%;';
                } else {
                    getElementByXpath('/html/body/div').style = '';
                }
            }
            var x2 = window.matchMedia("(min-width: 1300px)")
            sizeChanged2(x2)
            x2.addListener(sizeChanged2)

            const buttonBar = getElementByXpath('/html/body/div/div[1]/div');
            const favoriteButton = document.createElement('a');

            function favorite() {
                const isFavorited = checkFavoriteStatus();

                if(!isFavorited) {
                    console.log(GM_getValue('global-' + window.location.href))
                    const favorites = GM_getValue('favorites');
                    favorites[pageId] = GM_getValue('global-' + window.location.href);
                    GM_setValue('favorites', favorites);
                } else {
                    const favorites = GM_getValue('favorites');
                    delete favorites[pageId];
                    GM_setValue('favorites', favorites);
                }

                checkFavoriteStatus();
            }

            function checkFavoriteStatus() {
                if (GM_getValue('favorites')[pageId]) {
                    favoriteButton.innerHTML = 'Unfavorite';

                    return true;
                } else {
                    favoriteButton.innerHTML = 'Favorite';

                    return false;
                }
            }

            favoriteButton.innerHTML = 'Favorite';
            favoriteButton.style = 'color:white; margin-left:15px;cursor:pointer;user-select:none;text-decoration:none';
            favoriteButton.onclick = favorite;
            checkFavoriteStatus();
            buttonBar.appendChild(favoriteButton);

            getElementByXpath('/html/body/div/div[2]').style = 'display:none';
            getElementByXpath('/html/body/div/div[3]').style = 'display:none';

            getElementByXpath('/html/body/div/div[4]/div').style = 'background-color:transparent;border:none';
            getElementsByXpath('/html/body/div/div[4]/div/div/div').forEach(x => x.style = 'border:none;background-color:transparent;padding:3px;');
            getElementsByXpath('/html/body/div/div[4]/div/div/a').forEach(x => x.style = 'border:none;background-color:transparent;padding:3px;');

            (getElementByXpath('/html/body/div/div[5]') || {}).style = 'display:none';

            document.addEventListener('click', function(event) {
                var isClickInside = getElementByXpath('/html/body/div').contains(event.target);

                if (!isClickInside) {
                    window.history.back();
                }
            });

            const links = getElementsByXpath('/html/body/div/div[4]/div/div/div/a | /html/body/div/div[4]/div/div/a').map(x => {
                const imgStyle = x.children[0].style['background-image'];
                const imgUrlThumb = /\"(.+)\"/.exec(imgStyle)[1];
                const imgUrl = imgUrlThumb
                    .replace('/T', '/')
                    .replace('/thumb/', '/images/')
                // console.log([ x.href, imgUrl, imgUrlThumb ])
                return [ x.href, imgUrl, imgUrlThumb ];
            });
            console.log(links);
            GM_setValue(pageId, links);

            document.onkeydown = checkKey;
            function checkKey(e) {
                e = e || window.event;
                if (e.keyCode == '8') {
                    // backspace
                    window.history.back();
                }

            }
        }

        else if (pageType === 'photo') {
            const links = GM_getValue(pageId);
            var thisIndex = links.findIndex(x => x[0] === window.location.href);
            console.log(thisIndex)

            var indexLabel = document.createElement("p");
            indexLabel.style = "position:fixed;bottom:0;left:0"
            document.body.appendChild(indexLabel);

            let nextLink, prevLink = null;
            function refreshIndex() {
                const text = (thisIndex + 1) + '/' + links.length;
                indexLabel.innerHTML = text;
                document.title = (thisIndex + 1) + '/' + links.length;
            }

            function calcLinks() {
                if(thisIndex > 0) {
                    prevLink = thisIndex - 1;
                } else prevLink = null;
                if(thisIndex < links.length - 1) {
                    nextLink = thisIndex + 1;
                } else nextLink = null;
                refreshIndex();
            }
            calcLinks();

            document.body.style['background-color'] = 'black';

            const container = getElementByXpath('/html/body/div');
            container.style.margin = 0;
            container.style.padding = 0;
            container.style.width = 'calc(100vw - 32px)';

            const layoutDivs = getElementsByXpath('/html/body/div/div');
            layoutDivs[0].style.display = 'none';
            layoutDivs[1].style.display = 'none';
            layoutDivs[3].style.display = 'none';

            layoutDivs[2].style.display = 'flex';
            layoutDivs[2].style['justify-content'] = 'center';
            layoutDivs[2].style['align-items'] = 'center';
            layoutDivs[2].style['min-height'] = '100vh';
            layoutDivs[2].style['background-image'] = 'url("' + links[thisIndex][2] + '")';
            layoutDivs[2].style['background-repeat'] = 'no-repeat';
            layoutDivs[2].style['background-size'] = 'auto 93%';
            layoutDivs[2].style['background-position'] = 'center';

            const imgElement = getElementByXpath('/html/body/div/div[3]/img');

            console.log(imgElement.src, thisIndex + 1, '/', links.length);

            document.addEventListener('click', function(event) {
                var isClickInside = imgElement.contains(event.target);

                if (!isClickInside) {
                    window.history.back();
                } else {
                    if (event.offsetX > (event.target.width * 0.5)) {
                        // click on right side
                        checkKey({keyCode: '39'})
                    } else {
                        // click on left side
                        checkKey({keyCode: '37'})
                    }
                }
            });


            removeThumbnailAfterLoad();

            // default to fit-to-screen
            imgElement.style.width = 'auto';
            imgElement.style.height = 'auto';
            imgElement.style['object-fit'] = 'contain';
            imgElement.style['max-height'] = '100vh';

            document.onkeydown = checkKey;

            function download() {
                return;
                let src = imgElement.src;
                let src_s = src.split('/');
                let fileName = src_s[src_s.length - 1];
                let downloaded = GM_getValue('downloads');

                if(downloaded[fileName]) {
                    return;
                }

                GM_download({
                    url: imgElement.src,
                    name: 'nlegs.com-' + fileName
                });
                downloaded[fileName] = true;
                GM_setValue('downloads', downloaded);
            }

            function removeThumbnailAfterLoad() {
                function _removeIfLoaded() {
                    if (imgElement.complete) {
                        layoutDivs[2].style['background-image'] = 'none';
                    } else {
                        setTimeout(_removeIfLoaded, 100)
                    }
                }
                setTimeout(_removeIfLoaded, 100)
            }

            download();

            function checkKey(e) {

                e = e || window.event;

                if (e.keyCode == '37') {
                    // left arrow
                    if(prevLink !== null) {
                        // window.location.replace(links[prevLink][0]);
                        imgElement.src = '';
                        imgElement.src = links[prevLink][1];
                        layoutDivs[2].style['background-image'] = 'url("' + links[prevLink][2] + '")';
                        download();
                        removeThumbnailAfterLoad();
                        thisIndex--;
                        console.log(links[prevLink][1], thisIndex + 1, '/', links.length);
                        window.history.replaceState(null, '', links[prevLink][0])
                        calcLinks();
                    }
                }
                else if (e.keyCode == '39') {
                    // right arrow
                    if(nextLink !== null) {
                        //window.location.replace(links[nextLink][0]);
                        imgElement.src = '';
                        imgElement.src = links[nextLink][1];
                        layoutDivs[2].style['background-image'] = 'url("' + links[nextLink][2] + '")';
                        download();
                        removeThumbnailAfterLoad();
                        thisIndex++;
                        console.log(links[nextLink][1], thisIndex + 1, '/', links.length);
                        window.history.replaceState(null, '', links[nextLink][0])
                        calcLinks();
                    }
                }

                if (e.keyCode == '49') {
                    console.log('fit to screen');
                    imgElement.style.width = 'auto';
                    imgElement.style.height = 'auto';
                    imgElement.style['object-fit'] = 'contain';
                    imgElement.style['max-height'] = '100vh';
                } else if (parseInt(e.keyCode) > 49 && parseInt(e.keyCode) < 54) {
                    imgElement.style['object-fit'] = 'contain';
                    imgElement.style['max-height'] = 'inherit';
                }

                if (e.keyCode == '50') {
                    console.log('width 100%');
                    imgElement.style.width = '100%';
                    imgElement.style.height = 'auto';
                }
                else if (e.keyCode == '51') {
                    console.log('width 75%');
                    imgElement.style.width = '75%';
                    imgElement.style.height = 'auto';
                }
                else if (e.keyCode == '52') {
                    console.log('width 50%');
                    imgElement.style.width = '50%';
                    imgElement.style.height = 'auto';
                }
                else if (e.keyCode == '53') {
                    console.log('width 35%');
                    imgElement.style.width = '40%';
                    imgElement.style.height = 'auto';
                }
                else if (e.keyCode == '54') {
                    console.log('width 35%');
                    imgElement.style.width = '35%';
                    imgElement.style.height = 'auto';
                }
                else if (e.keyCode == '55') {
                    console.log('width 30%');
                    imgElement.style.width = '30%';
                    imgElement.style.height = 'auto';
                }


                else if (e.keyCode == '8') {
                    // backspace
                    window.history.back();
                }

            }
        }
    }
})();