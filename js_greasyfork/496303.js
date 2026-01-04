// ==UserScript==
// @name         checkHTMLDiff
// @namespace    http://xxtechec.com/
// @version      1.0
// @description  check HTML Diff
// @author       Wei
// @match        https://www.kb-lcd.com.tw/nimda/nimda_v2/Contract/*
// @match        https://test-lcd.dev.xxtechec.com/nimda/nimda_v2/Contract/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.2.0/diff.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js
// @resource     customCSS https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496303/checkHTMLDiff.user.js
// @updateURL https://update.greasyfork.org/scripts/496303/checkHTMLDiff.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const SECTION_ID_LIST = [
        'ContractInfo',
        'ReplaceContractsChain',
        'Draft',
        'Price',
        'Ship',
        'SalesComment',
        'UploadFile',
        'LeadPictureLog'
    ];
    const SECTION_NAME_MAP = {
        'ContractInfo': '合約資訊',
        'ReplaceContractsChain': '取代鏈資訊',
        'Draft': '商品資訊',
        'Price': '價格資訊',
        'Ship': '出貨資訊',
        'SalesComment': '業務補充說明',
        'UploadFile': '上傳其他檔案',
        'LeadPictureLog': '圖片資料'
    };

    const checkExist = setInterval(() => {
        const elementsExist = SECTION_ID_LIST.every(id => document.querySelector(`#${id}`) && document.querySelector(`#${id}-prev`));
        const DraftContent = document.querySelector('#Draft > div.mb-3.col > div > div.card-body > table > tbody > tr:nth-child(1) > td > div.draft-view > div.tab-content > div.tab-pane');
        const DraftPreContent = document.querySelector('#Draft-prev > div.mb-3.col > div > div.card-body > table > tbody > tr:nth-child(1) > td > div.draft-view > div.tab-content > div.tab-pane');
        if (elementsExist && DraftContent && DraftPreContent) {
            clearInterval(checkExist); // 停止輪詢
            createVueApp();
        }
    }, 100); // 每 100 毫秒檢查一次

    function tidyHTML(rawHtml) {
            // 使用 DOMParser 解析 HTML 字符串
            var parser = new DOMParser();
            var doc = parser.parseFromString(rawHtml, 'text/html');

            // 定義一個函數來格式化 HTML
            function formatHtml(element, level) {
                var indent = '  '.repeat(level);
                var result = '';

                for (var i = 0; i < element.childNodes.length; i++) {
                    var node = element.childNodes[i];

                    if (node.nodeType === Node.TEXT_NODE) {
                        // 處理文本節點
                        var text = node.nodeValue.trim();
                        if (text) {
                            result += indent + text + '\n';
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        // 處理元素節點
                        result += indent + '<' + node.tagName.toLowerCase();

                        for (var j = 0; j < node.attributes.length; j++) {
                            var attr = node.attributes[j];
                            result += ' ' + attr.name + '="' + attr.value + '"';
                        }

                        result += '>\n';
                        result += formatHtml(node, level + 1);
                        result += indent + '</' + node.tagName.toLowerCase() + '>\n';
                    }
                }

                return result;
            }

            // 獲取格式化的 HTML
            var tidyHtml = formatHtml(doc.body, 0);

            // 返回整潔的 HTML 字符串
            return tidyHtml.replace(/<\/?[^>]+(>|$)/g, "").trim();;
        }


    function createVueApp() {
        var root = $(`<div id="app"></div>`);

        $('#nimda').append(root);

        var app = new Vue({
            el: "#app",
            data: {
              contractSectionIds: SECTION_ID_LIST,
              contractSectionObject: SECTION_NAME_MAP,
              DrawerDiv: null,
              CloseBtn: null,
              OpenBtn: null,
              currentSectionsHTML: [],
              preSectionsHTML: [],
            },
            methods: {
                creaetDrawerDiv: function() {
                    // create a div container that can be a drawer from the right side
                    const DrawerDiv = $(`<div class="drawer-container" id="resizable"></div>`);
                    // added css & set drawer resizeable
                    DrawerDiv.css({
                        position: 'fixed',
                        padding: '50px 15px',
                        top: 0,
                        left: 0,
                        width: '50%',
                        height: '100%',
                        background: 'white',
                        borderLeft: '1px solid #ddd',
                        boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.3)',
                        zIndex: 9999,
                        overflow: 'auto',
                        resize: 'horizontal',
                    });

                    // create a button that can close the drawer
                    const CloseButton = $(`<button class="btn btn-danger btn-lg" style="position: fixed; top: 5px; right: 5px; z-index: 9999;">Close</button>`);
                    // append the button to the DrawerDiv
                    DrawerDiv.append(CloseButton);

                    // append the div to the body
                    $('body').append(DrawerDiv);
                    // create a button that can open the drawer
                    const OpenButton = $(`<button class="btn btn-info btn-lg" style="position: fixed; top: 5px; right: 5px; z-index: 9999;">Open Diff Drawer</button>`);
                    // append the button to the body
                    $('body').append(OpenButton);
                    // set DrawerDiv to hide
                    this.DrawerDiv = DrawerDiv;
                    this.OpenBtn = OpenButton;
                    this.CloseBtn = CloseButton;
                    this.DrawerDiv.hide();
                    this.OpenBtn.show();
                     // add click event to the button
                     CloseButton.click(() => {
                        this.DrawerDiv.hide();
                        // show the open button
                        this.OpenBtn.show();
                    });
                    // add click event to the button
                    OpenButton.click(() => {
                        this.DrawerDiv.show();
                        // hide the open button
                        this.OpenBtn.hide();
                    });

                    const resizable = document.getElementById('resizable');
                    resizable.addEventListener('mousedown', initResize);

                    function initResize(e) {
                        window.addEventListener('mousemove', resize);
                        window.addEventListener('mouseup', stopResize);
                    }

                    function resize(e) {
                        resizable.style.width = (e.clientX - resizable.offsetLeft) + 'px';
                        resizable.style.height = (e.clientY - resizable.offsetTop) + 'px';
                    }

                    function stopResize() {
                        window.removeEventListener('mousemove', resize);
                        window.removeEventListener('mouseup', stopResize);
                    }

                },
                diffContent: function({
                    sectionId,
                    preHTML,
                    currentHTML,
                    ContanerDiv
                }) {

                    const diff = Diff.diffLines(preHTML, currentHTML);
                    const diffAddParts = (sectionId,diff, diff.filter(part => part.added));
                    const diffRemoveParts = (sectionId,diff, diff.filter(part => part.removed));
                    const diffPartsCount = diffAddParts.length + diffRemoveParts.length;
                    const cardStyle = diffPartsCount > 0 ? 'warning' : 'light';
                    const diffSection = $(`
                    <div class="card border-${cardStyle}" style="min-height: 150px; max-height: 600px; overflow: auto; margin: 20px 15px; diaplay: flex; flex-direction: column;" >
                       <div class="card-header bg-${cardStyle}" sytle="display: flex;">
                          <div class="title">
                              <div style="font-size: 16px;font-weight: bold;">
                              ${this.contractSectionObject[sectionId]}：與上一版本共有
                                  <span style="color: gray; font-size: 18px;">「${diffPartsCount}」</span>處差異，
                                  <span style="color: green; font-size: 18px;">「${diffAddParts.length}」</span>處新增，
                                  <span style="color: red; font-size: 18px;">「${diffRemoveParts.length}」</span>處刪除
                              </div>
                          </div>
                       </div>
                       <div class="card-body" style="display: flex;">
                         <div id="${sectionId}-diff-section">
                         </div>
                       </div>
                    </div>`);
                    $(`#${sectionId}`).after(diffSection);
                    // append the diffSection to the DrawerDiv
                    ContanerDiv.append(diffSection);

                    // Then get the preElement
                    const preElement = document.getElementById(`${sectionId}-diff-section`); // Remove `#` from the id
                    const codeElement = document.createElement('code');

                    const diffSectionDisplayId = `display-${sectionId}`;
                    codeElement.id = diffSectionDisplayId;

                    // Append codeElement to preElement
                    preElement.appendChild(codeElement);
                    var display = document.getElementById(diffSectionDisplayId);
                    var fragment = document.createDocumentFragment();
                    var color = '';
                    var partItem = null;

                    diff.forEach(function(part, idx){
                        // green for additions, red for deletions
                        // grey for common parts
                        color = part.added ? 'green' : part.removed ? 'red' : 'grey';
                        partItem = document.createElement('div');
                        partItem.style.color = color;
                        partItem.appendChild(document.createTextNode(part.value));
                        fragment.appendChild(partItem);
                    });

                    display.appendChild(fragment);

                },
            },
            mounted() {
                this.creaetDrawerDiv();

                this.contractSectionIds.forEach((sectionId) => {
                    this.currentSectionsHTML.push(tidyHTML($(`#${sectionId}`)[0].innerHTML));
                    this.preSectionsHTML.push(tidyHTML($(`#${sectionId}-prev`)[0].innerHTML));
                });
                this.contractSectionIds.forEach((sectionId, idx) => {
                    this.diffContent({
                        sectionId,
                        currentHTML: this.currentSectionsHTML[idx],
                        preHTML: this.preSectionsHTML[idx],
                        ContanerDiv: this.DrawerDiv,
                    });
                });
            },
        });
    }
})();