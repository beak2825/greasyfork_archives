// ==UserScript==
// @name              ExHentai Viewer
// @namespace         Violentmonkey Scripts
// @description       manage your favorite tags, enhance searching, improve comic page
// @description:zh-CN 管理标签，增强搜索，改进漫画页面
// @match             *://exhentai.org/*
// @match             *://e-hentai.org/*
// @grant             GM_setValue
// @grant             GM_getValue
// @version           1.2.0
// @downloadURL https://update.greasyfork.org/scripts/376340/ExHentai%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/376340/ExHentai%20Viewer.meta.js
// ==/UserScript==
/*
 * To-do:
 *   1. preload images?
 */

const currentVersion = '1.2.0';
const sortFilters = false;
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const create = tag => document.createElement(tag);
let data = {
    custom_filter: GM_getValue('custom_filter', {}),
    script_config: GM_getValue('script_config', {}),
    tag_pref: GM_getValue('tag_pref', { liked_tags: [], disliked_tags: [] })
};

init();

function init() {
    // upgrade and load script config
    loadScriptData();
    // router
    const url = window.location.href;
    if (url.includes('/s/')) {
        // comic page
        EHViewer('s');
    } else if (url.includes('/mpv')) {
        // multi page mode
        EHViewer('mpv');
    } else if (url.includes('/g/')) {
        // gallery page
        handleGallery();
    } else if ($('#searchbox')) {
        // add panel below the searchbox
        handleSearchBox();
    } else if (url.includes('/gallerytorrents.php')) {
        // show magnet link
        showMagnetLink();
    }

    // add EHV setting button
    let ehvSettingBtn = create('div');
    ehvSettingBtn.innerHTML = '<a href="#">EHV Settings</a>';
    ehvSettingBtn.onclick = createSettingPanel;
    $('#nb').append(ehvSettingBtn);
    $('#nb').style.maxWidth = 'max-content';

    // highlight tags
    highlightTags();
}

function loadScriptData() {
    switch (data.script_config.current_version) {
        // don't break, just go through the flow to upgrade script data by version
        case undefined:
        // just install
        default:
            data.script_config.current_version = currentVersion;
            GM_setValue('custom_filter', data.custom_filter);
            GM_setValue('script_config', data.script_config);
    }
}

function changeStyle(css, mode, id = 'ehv-style') {
    let cssEl = $('#' + id);
    if (!cssEl) {
        cssEl = create('style');
        cssEl.type = 'text/css';
        cssEl.id = id;
        document.head.append(cssEl);
    }
    switch (mode) {
        case 'add':
            cssEl.innerHTML += css;
            break;
        case 'replace':
            cssEl.innerHTML = css;
            break;
    }
}

function addBtnContainer() {
    let btnStyle = `
          #ehv-btn-c{
              text-align: center;
              list-style: none;
              position: fixed;
              bottom: 30px;
              right: 30px;
              z-index: 999;
          }
          .ehv-btn {
              line-height: 32px;
              font-size: 16px;
              padding: 2px;
              margin: 5px;
              color: #233;
              position: relative;
              width: 32px;
              height: 32px;
              border: none;
              border-radius: 50%;
              box-shadow: 0 0 3px 0 #0006;
              cursor: pointer;
              user-select: none;
              outline: none;
              background-color: #fff;
              background-repeat: no-repeat;
              background-position: center;
          }
          .ehv-btn:hover{
              box-shadow: 0 0 3px 1px #0005!important;
          }
          .ehv-btn:active {
              top: 1px;
              box-shadow: 0 0 1px 1px #0004!important;
          }`;
    let btnContainer = create('ul');
    btnContainer.id = 'ehv-btn-c';
    document.body.append(btnContainer);
    changeStyle(btnStyle, 'add', 'ehv-btn-c-style');
    return btnContainer;
}

function addBtn(btn, container) {
    let btnEl = create('li');
    if (btn.icon.startsWith('data:image')) {
        btnEl.style.backgroundImage = "url('" + btn.icon + "')";
    } else {
        btnEl.innerHTML = btn.icon;
    }
    btnEl.classList.add('ehv-btn');
    btnEl.addEventListener(btn.event, btn.cb);
    container.append(btnEl);
    return btnEl;
}

function EHViewer(mode) {
    const host = window.location.host;
    const svgIcons = {
        autofit:
            'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M8 3V5H4V9H2V3H8ZM2 21V15H4V19H8V21H2ZM22 21H16V19H20V15H22V21ZM22 9H20V5H16V3H22V9Z" fill="rgba(120,120,120,1)"></path></svg>',
        zoomIn: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748ZM10 10V7H12V10H15V12H12V15H10V12H7V10H10Z" fill="rgba(120,120,120,1)"></path></svg>',
        zoomOut:
            'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748ZM7 10H15V12H7V10Z" fill="rgba(120,120,120,1)"></path></svg>',
        prevPage:
            'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" fill="rgba(120,120,120,1)"></path></svg>',
        nextPage:
            'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M13.1714 12.0007L8.22168 7.05093L9.63589 5.63672L15.9999 12.0007L9.63589 18.3646L8.22168 16.9504L13.1714 12.0007Z" fill="rgba(120,120,120,1)"></path></svg>',
        reload: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z" fill="rgba(120,120,120,1)"></path></svg>',
        gallery:
            'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M5.82843 6.99955L8.36396 9.53509L6.94975 10.9493L2 5.99955L6.94975 1.0498L8.36396 2.46402L5.82843 4.99955H13C17.4183 4.99955 21 8.58127 21 12.9996C21 17.4178 17.4183 20.9996 13 20.9996H4V18.9996H13C16.3137 18.9996 19 16.3133 19 12.9996C19 9.68584 16.3137 6.99955 13 6.99955H5.82843Z" fill="rgba(120,120,120,1)"></path></svg>'
    };
    let css = '';
    let btnContainer = addBtnContainer();
    let currentScale = 1;
    let autofitEnable = true;

    switch (mode) {
        case 's':
            css += `
                  #i1{
                      width:98%!important;
                      max-width:98%!important;
                      min-width:800px;
                      background-color: inherit!important;
                      border: none!important
                  }
                  #img{
                      max-width:none!important;
                      max-height:none!important;
                      background-color: #4f535b!important;
                      padding: 8px;
                      border: 1px solid #000;
                      border-radius: 2px;
                  }
                  h1, #i2, #i5, #i6, #i7, .ip, .sn{
                      display:none!important;
                  }
                  ::-webkit-scrollbar{
                      display:none;
                  }
                  html{
                      scrollbar-width: none;
                  }`;
            // add btns
            [
                { icon: svgIcons.autofit, event: 'mousedown', cb: autofit },
                { icon: svgIcons.zoomIn, event: 'mousedown', cb: e => zoomer(zoomInS) },
                { icon: svgIcons.zoomOut, event: 'mousedown', cb: e => zoomer(zoomOutS) },
                { icon: svgIcons.prevPage, event: 'click', cb: prevPage },
                { icon: svgIcons.nextPage, event: 'click', cb: nextPage },
                { icon: svgIcons.reload, event: 'click', cb: e => $('#loadfail').click() },
                { icon: svgIcons.gallery, event: 'click', cb: e => $('div.sb>a').click() }
            ].forEach(v => addBtn(v, btnContainer));
            // handle key events
            document.body.addEventListener('keydown', e => {
                switch (e.key) {
                    case '=':
                        zoomInS(0.1);
                        break;
                    case '-':
                        zoomOutS(0.1);
                        break;
                    case ',':
                        window.scroll(0, 0);
                        break;
                    case '.':
                        window.scroll(0, window.innerHeight);
                        break;
                    case '[':
                        window.scrollBy(0, -window.innerHeight * 0.3);
                        break;
                    case ']':
                        window.scrollBy(0, window.innerHeight * 0.3);
                        break;
                }
            });
            // set scale on page load
            setNewPage();
            // set scale on img load
            let observer = new MutationObserver(setNewPage);
            observer.observe($('#i3'), { attributes: false, childList: true, subtree: false });
            break;
        case 'mpv':
            css += '#pane_images_inner>div{margin:auto;}';
            // add btns
            [
                { icon: svgIcons.zoomIn, event: 'mousedown', cb: e => zoomer(zoomInMpv) },
                { icon: svgIcons.zoomOut, event: 'mousedown', cb: e => zoomer(zoomOutMpv) }
            ].forEach(v => addBtn(v, btnContainer));
            document.body.addEventListener('keydown', e => {
                switch (e.key) {
                    case '=':
                        zoomInMpv(0.1);
                        break;
                    case '-':
                        zoomOutMpv(0.1);
                        break;
                }
            });
            break;
    }

    // add style
    if (data.script_config.hide_button) {
        css += `
              #ehv-btn-c{
                  padding: 80px 30px 30px 80px;
                  bottom: 0!important;
                  right: -80px!important;
                  transition-duration: 300ms;
              }
              #ehv-btn-c:hover{
                  padding: 80px 30px 30px 20px!important;
                  right: 0!important;
              }`;
    }
    css += '.ehv-btn{background-color: #44454B!important;}';
    if (host === 'e-hentai.org') {
        // btn color
        css = css.replaceAll('#44454B', '#D3D0D1');
        // page bg & border (for mode 's')
        css = css.replace('#4f535b', '#EDEBDF').replace('1px solid #000', '1px solid #5C0D12');
    }
    changeStyle(css, 'replace', 'ehv-style');

    // === functions ===
    function autofit() {
        autofitEnable = true;
        const img = $('#img');
        const imgRatio = img.height / img.width;
        const windowRatio = window.innerHeight / window.innerWidth;
        if (imgRatio > windowRatio) {
            // img thinner than window
            currentScale = (window.innerHeight - 25) / img.height;
        } else {
            //img wider than window
            currentScale = (window.innerWidth - 25) / img.width;
        }
        window.scrollTo(0, 0);
        zoom4S();
    }
    function zoomer(cb) {
        // long press to trigger continuous scaling(zoomTimeout > zoomInterval)
        let zoomInterval = -1;
        let zoomTimeout = setTimeout(function () {
            zoomInterval = setInterval(cb, 100);
        }, 800);
        document.addEventListener(
            'mouseup',
            e => {
                if (zoomInterval === -1) {
                    cb(0.1);
                    clearTimeout(zoomTimeout);
                } else {
                    clearInterval(zoomInterval);
                }
            },
            { once: true }
        );
    }
    function prevPage() {
        const currentPage = $('.sn>span:first-child').innerText;
        currentPage !== '1' ? $('#prev').click() : alert('This is first page (⊙_⊙)');
    }
    function nextPage() {
        const currentPage = $('.sn span:first-child').innerText;
        const lastPage = $('.sn span:last-child').innerText;
        currentPage !== lastPage ? $('#next').click() : alert('This is last page (⊙ω⊙)');
    }
    function setNewPage() {
        // add page indicator
        let footer = $('#i4 > div:first-child');
        const currentPage = $('.sn span:first-child').innerText;
        const totalPage = $('.sn span:last-child').innerText;
        footer.innerHTML = currentPage + 'P / ' + totalPage + 'P :: ' + footer.innerText + ' :: ';
        // add origin source
        let imgLink = $('#i7>a');
        imgLink ? footer.append(imgLink) : (footer.innerHTML += 'No download');
        if (autofitEnable) {
            autofit();
        } else {
            // inherit the zoom scale of previous page
            zoom4S();
        }
    }
    function zoomInS(pace = 0.02) {
        autofitEnable = false;
        currentScale = 1 + pace;
        zoom4S();
    }
    function zoomOutS(pace = 0.02) {
        autofitEnable = false;
        const img = $('#img');
        currentScale = 1 - pace;
        zoom4S();
    }
    function zoom4S() {
        const img = $('#img');
        // img.style.width = currentScale * 100 + '%';
        img.style.width = img.width * currentScale + 'px';
        img.style.height = 'auto';
    }
    function zoomInMpv(pace = 0.02) {
        const maxWidth = Number($('#pane_images').style.width.replace('px', '')) - 20;
        const originalWidth = Number($('#image_1').style.maxWidth.replace('px', ''));
        currentScale = originalWidth * (1 + pace) < maxWidth ? currentScale + pace : currentScale;
        zoom4Mpv(originalWidth * currentScale);
    }
    function zoomOutMpv(pace = 0.02) {
        const minWidth = 200;
        const originalWidth = Number($('#image_1').style.maxWidth.replace('px', ''));
        currentScale = originalWidth * (currentScale - pace) > minWidth ? currentScale - pace : currentScale;
        zoom4Mpv(originalWidth * currentScale);
    }
    function zoom4Mpv(width) {
        let mpvStyle =
            'img[id^="imgsrc"], div[id^="image"]{width:mpvWidth!important;height:auto!important; max-width:100%!important;min-width:200px!important}"';
        mpvStyle = mpvStyle.replace('mpvWidth', width + 'px');
        changeStyle(mpvStyle, 'replace', 'custom-width');
    }
}

function handleGallery() {
    // add searchbox
    let searchBox = create('form');
    searchBox.innerHTML = `
          <p class="nopm">
              <input type="text" id="f_search" name="f_search" placeholder="Search Keywords" value="" size="60">
              <input type="submit" name="f_apply" value="Search">
          </p>`;
    searchBox.setAttribute(
        'style',
        'display: none; width: 720px; margin: 10px auto; border: 2px ridge black; padding: 10px;'
    );
    searchBox.setAttribute('action', 'https://' + window.location.host + '/');
    searchBox.setAttribute('method', 'get');
    $('.gm').before(searchBox);

    // add btn to show/hide searchbox
    let tbody = $('#taglist > table > tbody');
    tbody.innerHTML += `
          <tr>
              <td class="tc">EHV:</td>
              <td>
                  <div id="ehv-panel-btn" class="gt" style="cursor:pointer">show panel</div>
              </td>
          </tr>`;
    $('#ehv-panel-btn').addEventListener('click', e => {
        const t = e.target;
        if (t.innerText == 'show panel') {
            searchBox.style.display = 'block';
            t.innerText = 'hide panel';
        } else {
            searchBox.style.display = 'none';
            t.innerText = 'show panel';
        }
    });

    // add panel
    setPanel();

    // add gallery tag to searchbox by right-click
    tbody.addEventListener('contextmenu', applyGalleryTag);

    function applyGalleryTag(e) {
        const t = e.target;
        if (t.tagName === 'A') {
            e.preventDefault();
            const searchInput = $('#f_search');
            let tag = t.href.split('/').pop().replaceAll('+', ' ');
            filter = `"${tag}" `;
            // add tailing space
            if (searchInput.value.length > 0 && searchInput.value.endsWith(' ') === false) searchInput.value += ' ';
            searchInput.value.includes(filter)
                ? (searchInput.value = searchInput.value.replace(filter, ''))
                : (searchInput.value += filter);
        }
    }
}

function handleSearchBox() {
    setPanel();
    const ehvPanel = $('#ehv-panel');
    if (data.script_config.hide_panel) {
        ehvPanel.style.display = 'none';
        const a = create('a');
        a.id = 'ehv-panel-btn';
        a.innerText = '[Show EHV Panel]';
        a.setAttribute('href', '#');
        a.setAttribute('style', 'margin-left: 1em;');
        a.addEventListener('click', function () {
            if (ehvPanel.style.display == 'none') {
                ehvPanel.style.display = 'block';
                a.innerText = '[Hide EHV Panel]';
            } else {
                ehvPanel.style.display = 'none';
                a.innerText = '[Show EHV Panel]';
            }
        });
        $$('#searchbox>form>div')[1].append(a);
    } else {
        $('#ehv-panel-btn') && $('#ehv-panel-btn').remove();
    }
}

function setPanel() {
    const container = $('#f_search').parentNode;
    const searchInput = $('#f_search');

    // set style
    const panelCss = `#ehv-panel > input[type="button"]{ margin: 2px; }`;
    let panelStyle = $('#panel-style');
    if (!panelStyle) {
        panelStyle = create('style');
        panelStyle.id = 'panel-style';
        panelStyle.textContent = panelCss;
        document.head.append(panelStyle);
    }

    let ehvPanel = $('#ehv-panel');

    if (ehvPanel) ehvPanel.remove();

    ehvPanel = document.createElement('div');
    ehvPanel.setAttribute('class', 'nopm');
    ehvPanel.setAttribute('id', 'ehv-panel');
    ehvPanel.setAttribute('style', 'padding-top:8px;');
    container.append(ehvPanel);
    // filter buttons
    for (let key in data.custom_filter) {
        let filterBtn = create('input');
        filterBtn.setAttribute('type', 'button');
        filterBtn.setAttribute('value', key);
        filterBtn.setAttribute('title', data.custom_filter[key].toString());
        filterBtn.addEventListener('click', applyFilter);
        filterBtn.addEventListener('contextmenu', removeFilter);
        if (isExist(data.custom_filter[key])) {
            filterBtn.setAttribute('style', 'filter: invert(20%);');
        } else {
            filterBtn.removeAttribute('style');
        }
        ehvPanel.append(filterBtn);
    }
    //new filter button
    let addFilterBtn = create('input');
    addFilterBtn.setAttribute('type', 'button');
    addFilterBtn.setAttribute('value', '+');
    addFilterBtn.addEventListener('click', addFilter);
    addFilterBtn.addEventListener('contextmenu', ehvSetting);
    ehvPanel.append(addFilterBtn);

    // enhace apply filter button
    const searchBtn = $('#f_search+input');
    searchBtn.addEventListener('contextmenu', newtabSearch);
    searchBtn.title = 'right click to search in new page';

    // === function ===
    function isExist(values) {
        const inputValue = searchInput.value;
        return values.every(v => inputValue.includes(v));
    }
    function applyFilter(e) {
        let t = e.target;
        let key = t.value;
        let values = data.custom_filter[key];

        // add tailing space
        if (searchInput.value.length > 0 && searchInput.value.endsWith(' ') === false) searchInput.value += ' ';

        if (isExist(values)) {
            values.forEach(v => (searchInput.value = searchInput.value.replaceAll(`"${v}" `, '')));
            t.removeAttribute('style');
        } else {
            values.forEach(v => (searchInput.value += `"${v}" `));
            t.setAttribute('style', 'filter: invert(20%);');
        }
    }
    function addFilter() {
        data.custom_filter = GM_getValue('custom_filter', {}); // get latest filter data
        const input = prompt('Add filter like format below', '[tag] or [name@tag] or [name@tag+tag+tag+tag]');
        const filterStr = input ? input.split('@') : '';
        let key, value;
        if (filterStr.length === 2) {
            key = filterStr[0];
            value = filterStr[1].split('+');
            data.custom_filter[key] = value;
        } else if (filterStr.length === 1 && filterStr[0] !== '') {
            key = value = filterStr[0];
            data.custom_filter[key] = [value];
        } else {
            alert('Invalid input...:(');
            return;
        }
        // sort filters by char codepoint
        if (sortFilters === true) {
            const newFilters = {};
            const sortedKeys = Object.keys(data.custom_filter).sort();
            for (let key of sortedKeys) {
                newFilters[key] = data.custom_filter[key];
            }
            data.custom_filter = newFilters;
        }
        GM_setValue('custom_filter', data.custom_filter);
        setPanel();
    }
    function ehvSetting(e) {
        e.preventDefault();
        data.script_config = GM_getValue('script_config', {}); // sync latest config data
        data.script_config.hide_panel = confirm('hide EHV panel by default?');
        data.script_config.hide_button = confirm(
            'hide comic page buttons by default? (hover lower right corner to show)'
        );
        GM_setValue('script_config', data.script_config);
        handleSearchBox();
    }
    function removeFilter(e) {
        e.preventDefault();
        data.custom_filter = GM_getValue('custom_filter', {}); // get latest filter data
        if (confirm('Delete this tag?')) {
            let key = e.target.value;
            delete data.custom_filter[key];
            GM_setValue('custom_filter', data.custom_filter);
            setPanel();
        }
    }
    function newtabSearch(e) {
        e.preventDefault();
        const keyword = e.target.previousElementSibling.value;
        const url = `https://${location.host}/?f_search=${keyword}`;
        open(url);
    }
}

function showMagnetLink() {
    const links = $$('a');
    for (let link of links) {
        if (link.href.endsWith('.torrent')) {
            let magnetLink = create('a');
            let torrentHash = link.href.match(/[\w\d]{40}/)[0];
            magnetLink.href = `magnet:?xt=urn:btih:${torrentHash}&dn=${link.innerText}`;
            magnetLink.innerText = '[MAGNET]';
            link.before(magnetLink);
            let span = create('span');
            span.innerText = ' ';
            link.before(span);
        }
    }
}

function createSettingPanel() {
    // todo:
    // custom filter editor
    // hide ehv search panel by default
    // hide ehv sidebar buttons by default
    console.log('creating ehv setting panel');
    let container = create('div');
    container.innerHTML = `
        <div id="ehv-setting-panel" style="display: flex; flex-direction: column; gap:.5rem; background-color: #CCCE; border-radius: 3px; box-shadow: 0 0 3px 0 #0008; margin: 5rem auto; padding: 1rem; max-width: 50rem;">
            <span style="color:#233; text-align:left; font-size:12px;">liked tags:</span>
            <textarea id="ehv-liked-tags" style="padding: .5em;" placeholder="enter tags you like here, separated by comma"></textarea>
            <span style="color:#233; text-align:left; font-size:12px;">disliked tags:</span>
            <textarea id="ehv-disliked-tags" style="padding: .5em;" placeholder="enter tags you don't like here, separated by comma"></textarea>
            <div style="text-align: right;">
                <button id="ehv-save-btn">save</button>
                <button id="ehv-cancel-btn">cancel</button>
            <div>
        </div>`;
    container.setAttribute(
        'style',
        'background-color: transparent; width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; z-index: 9999'
    );

    const likedTagsInput = container.querySelector('#ehv-liked-tags');
    const dislikedTagsInput = container.querySelector('#ehv-disliked-tags');
    const saveBtn = container.querySelector('#ehv-save-btn');
    const cancelBtn = container.querySelector('#ehv-cancel-btn');

    // get latest tag_pref value
    data.tag_pref = GM_getValue('tag_pref', { liked_tags: [], disliked_tags: [] });

    likedTagsInput.value = data.tag_pref.liked_tags.join(',');
    dislikedTagsInput.value = data.tag_pref.disliked_tags.join(',');

    saveBtn.onclick = () => {
        data.tag_pref.liked_tags = likedTagsInput.value.split(',');
        data.tag_pref.disliked_tags = dislikedTagsInput.value.split(',');
        highlightTags(data);
        GM_setValue('tag_pref', data.tag_pref);
        container.remove();
    };
    cancelBtn.onclick = () => container.remove();

    document.body.append(container);
}

function highlightTags() {
    // highlight tags
    let tagEls = $$('.gt, .gtl');
    const likedTags = data.tag_pref.liked_tags;
    const dislikedTags = data.tag_pref.disliked_tags;

    for (let tagEl of tagEls) {
        let tagStr = tagEl.firstChild.textContent;
        if (likedTags.includes(tagStr)) {
            tagEl.style.backgroundColor = '#CCE8';
            tagEl.class;
        } else if (dislikedTags.includes(tagStr)) {
            tagEl.style.backgroundColor = '#2338';
        } else {
            tagEl.style.backgroundColor = '';
        }
    }
}
