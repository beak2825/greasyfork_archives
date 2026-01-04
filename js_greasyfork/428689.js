// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         스마트에디터ONE MSWord문서(*.docx) 내보내기
// @description  네이버 블로그 스마트에디터ONE의 편집 내용을 MSWord문서(*.docx)로 내보낼 수 있습니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.1.42
// @author       Won Choi
// @connect      naver.com
// @connect      pstatic.net
// @match        *://blog.naver.com/*/postwrite*
// @match        *://blog.naver.com/*Redirect=Write*
// @match        *://blog.naver.com/*Redirect=Update*
// @match        *://blog.naver.com/PostWriteForm*
// @match        *://blog.naver.com/PostUpdateForm*
// @match        *://blog.editor.naver.com/editor*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/polyfill/Object.fromEntries.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-cors.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/naver-blog.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/smart-editor-one.js
// @require      https://cdn.jsdelivr.net/npm/docx@6.0.3/build/index.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuidv4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.js
// @downloadURL https://update.greasyfork.org/scripts/428689/%EC%8A%A4%EB%A7%88%ED%8A%B8%EC%97%90%EB%94%94%ED%84%B0ONE%20MSWord%EB%AC%B8%EC%84%9C%28%2Adocx%29%20%EB%82%B4%EB%B3%B4%EB%82%B4%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/428689/%EC%8A%A4%EB%A7%88%ED%8A%B8%EC%97%90%EB%94%94%ED%84%B0ONE%20MSWord%EB%AC%B8%EC%84%9C%28%2Adocx%29%20%EB%82%B4%EB%B3%B4%EB%82%B4%EA%B8%B0.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
async function transformDocument(content) {
    const container = (children) => {
        const width = { size: 9010, type: docx.WidthType.DXA };
        const borders = {
            top: { size: 1, color: "F6F6F5", style: docx.BorderStyle.DASH_SMALL_GAP },
            bottom: { size: 1, color: "F6F6F5", style: docx.BorderStyle.DASH_SMALL_GAP },
            left: { size: 1, color: "F6F6F5", style: docx.BorderStyle.DASH_SMALL_GAP },
            right: { size: 1, color: "F6F6F5", style: docx.BorderStyle.DASH_SMALL_GAP }
        };
        const col = new docx.TableCell({ width, borders, children });
        const row = new docx.TableRow({ children: [col] });
        return new docx.Table({ columnWidths: [9010], rows: [row] });
    };
    const container_image_blob = async (image) => {
        if(/^data:/.test(image)) {
            const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
                const byteCharacters = atob(b64Data);
                const byteArrays = [];
                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    const slice = byteCharacters.slice(offset, offset + sliceSize);
                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }
                const blob = new Blob(byteArrays, {type: contentType});
                return blob;
            }
            const match = /^data:(?<mime>[\w/\-\.\+]+);(?<encoding>\w+),(?<data>.*)$/.exec(image);
            return b64toBlob(match.groups.data, match.groups.mime);
        }else{
            return GM_xmlhttpRequestCORS(image, { responseType: 'blob' });
        }
    }
    const container_image = async (image, ratio = 1) => {
        const blob = await container_image_blob(image).catch(e=>null);
        if(blob) {
            return new Promise((resolve, reject) => {
                const orl = URL.createObjectURL(blob);
                const img = new Image();
                img.onerror = () => {
                    URL.revokeObjectURL(orl);
                    reject();
                };
                img.onload = () => {
                    const w = Math.floor((img.width || screen.width) * ratio);
                    const h = Math.floor((img.height || screen.height) * ratio);
                    const resp = new docx.Paragraph({ children: [ new docx.ImageRun({ data: blob, transformation: { width: w, height: h } }), ], alignment: docx.AlignmentType.CENTER });
                    URL.revokeObjectURL(orl);
                    resolve(resp);
                }
                img.src = orl;
            });
        } else {
            return new docx.Paragraph({ children: [ new docx.TextRun({ text: `<IMAGE LOAD ERROR: ${image}>` }), ], alignment: docx.AlignmentType.CENTER });
        }
    }
    const newline = new docx.Paragraph({ children: [], });
    const divider = new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, text: '──────────────────────────────────────────', });
    const items = await Promise.map(content.sections, async (item)=>{
        const children = [];
        if(item.type == 'title') {
            const items = _.zip(item.text);
            const convs = await Promise.map(items, async ([ text ]) => {
                return new docx.Paragraph({ children: [ new docx.TextRun({ text, bold: 1, size: 32 }) ] });
            });
            children.push(...convs.flat());
        }
        if(item.type == 'text') {
            const items = _.zip(item.text);
            const convs = await Promise.map(items, async ([ text ]) => {
                return new docx.Paragraph({ children: [ new docx.TextRun({ text }) ] });
            });
            children.push(...convs.flat());
        }
        if(item.type == 'image') {
            const image = await Promise.map(item.image, async (image) => {
                return [
                    await container_image(image),
                ];
            });
            children.push(...image.flat());
            const description = await Promise.map(item.description, async (description) => {
                return [
                    new docx.Paragraph({ children: [ new docx.TextRun({ text: description }) ], alignment: docx.AlignmentType.CENTER, }),
                ];
            });
            children.push(...description.flat());
        }
        if(item.type == 'video') {
            const items = _.zip(item.image, item.title, item.description, item.time);
            const convs = await Promise.map(items, async ([ image, title, description, time ]) => {
                return [
                    await container_image(image),
                    new docx.Paragraph({ children: [ new docx.TextRun({ text: title, bold: 1 }) ] }),
                    new docx.Paragraph({ children: [ new docx.TextRun({ text: time }) ] }),
                    new docx.Paragraph({ children: [ new docx.TextRun({ text: description }) ] }),
                ];
            });
            children.push(...convs.flat());
        }
        if(item.type == 'line') {
            children.push(divider);
        }
        if(item.type == 'sticker') {
            const items = _.zip(item.image, item.title, item.description, item.time);
            const convs = await Promise.map(items, async ([ image, title, description, time ]) => {
                return [
                    await container_image(image),
                ];
            });
            children.push(...convs.flat());
        }
        if(item.type == 'quotation') {
            const items1 = await Promise.map(item.title, async (title) => {
                return [
                    new docx.Paragraph({ children: [ new docx.TextRun({ text: title, bold: 1, size: 22 }) ] }),
                ];
            });
            children.push(...items1.flat());
            const items2 = await Promise.map(item.description, async (description) => {
                return [
                    new docx.Paragraph({ children: [ new docx.TextRun({ text: description }) ] }),
                ];
            });
            children.push(...items2.flat());
        }
        if(item.type == 'places') {
            const image = await Promise.map(item.image, async (image) => {
                return [
                    await container_image(image),
                ];
            });
            children.push(...image.flat());
            const location = await Promise.map(item.location, async (item) => {
                const items = _.zip(item.name, item.addr);
                const convs = await Promise.map(items, async ([ name, addr ]) => {
                    return [
                        new docx.Paragraph({ children: [ new docx.TextRun({ text: `장소: ${name}`, bold: 1 }) ] }),
                        new docx.Paragraph({ children: [ new docx.TextRun({ text: `주소: ${addr}` }) ] }),
                    ];
                });
                return container(convs.flat());
            });
            children.push(...location.flat());
        }
        if(item.type == 'link') {
            const items = _.zip(item.image, item.title, item.description, item.hostname);
            const convs = await Promise.map(items, async ([ image, title, description, hostname ]) => {
                return [
                    await container_image(image),
                    new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [ new docx.TextRun({ text: hostname }) ] }),
                    new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [ new docx.TextRun({ text: title, bold: 1 }) ] }),
                    new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [ new docx.TextRun({ text: description }) ] }),
                ];
            });
            children.push(...convs.flat());
        }
        if(item.type == 'file') {
            const items = _.zip(item.name);
            const convs = await Promise.map(items, async ([ name ]) => {
                return [
                    new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [ new docx.TextRun({ text: `<파일명: ${ name }>` }) ] }),
                ];
            });
            children.push(...convs.flat());
        }
        if(item.type == 'schedule') {
            const items = _.zip(item.title, item.sdate, item.edate, item.image, item.url, item.description);
            const convs = await Promise.map(items, async ([ title, sdate, edate, image, url, description ]) => {
                return [
                    await container_image(image),
                    new docx.Paragraph({ children: [ new docx.TextRun({ text: `이름: ${title}`, bold: 1 }) ] }),
                    new docx.Paragraph({ children: [ new docx.TextRun({ text: `설명: ${description}` }) ] }),
                    new docx.Paragraph({ children: [ new docx.TextRun({ text: `일정: ${sdate} ~ ${edate}` }) ] }),
                    new docx.Paragraph({ children: [ new docx.TextRun({ text: `링크: ${url}` }) ] }),

                ];
            });
            children.push(...convs.flat());
            const location = await Promise.map(item.location, async (item) => {
                const items = _.zip(item.name, item.addr);
                const convs = await Promise.map(items, async ([ name, addr ]) => {
                    return [
                        new docx.Paragraph({ children: [ new docx.TextRun({ text: `장소: ${name}`, bold: 1 }) ] }),
                        new docx.Paragraph({ children: [ new docx.TextRun({ text: `주소: ${addr}` }) ] }),
                    ];
                });
                return convs.flat();
            });
            children.push(container(location.flat()));
        }
        if(item.type == 'table' && item.table) {
            const width = { size: 9010, type: docx.WidthType.DXA };
            const borders = {
                top: { size: 1, color: "0000FF", style: docx.BorderStyle.DASH_SMALL_GAP },
                bottom: { size: 1, color: "0000FF", style: docx.BorderStyle.DASH_SMALL_GAP },
                left: { size: 1, color: "0000FF", style: docx.BorderStyle.DASH_SMALL_GAP },
                right: { size: 1, color: "0000FF", style: docx.BorderStyle.DASH_SMALL_GAP }
            };
            const rows = [];
            const rows_appends = async (items, row) => {
                if(!items) return [];
                const children = await Promise.map(items, async (row) => {
                    const children = await Promise.map(row, async (col) => {
                        const children = await Promise.map(col.content, async (item)=>{
                            if(item.type == 'text') return new docx.Paragraph({ children: [ new docx.TextRun({ text: item.text }) ] });
                            if(item.type == 'image') return container_image(item.image, 0.2);
                        });
                        return new docx.TableCell({ width, borders, children });
                    });
                    return new docx.TableRow({ children });
                });
                return children;
            };
            rows.push(...await rows_appends(item.table.thead));
            rows.push(...await rows_appends(item.table.tbody));
            const table = new docx.Table({ columnWidths: [9010], rows });
            children.push(table);
        }
        if(item.type == 'code') {
            const items = _.zip(item.text);
            const convs = await Promise.map(items, async ([ text ]) => {
                const lines = text.split(/[\r\n]+/g).map(r=>r.trim());
                return [
                    ...lines.map((line) => new docx.Paragraph({ children: [ new docx.TextRun({ text: line }) ] })),
                ];
            });
            children.push(...convs.flat());
        }
        if(item.type == 'formula') {
            const items = _.zip(item.text);
            const convs = await Promise.map(items, async ([ text ]) => {
                return [
                    new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [ new docx.TextRun({ text: `<수식: ${ text }>`, bold: 1 }) ] }),
                ];
            });
            children.push(...convs.flat());
        }
        if(item.type == 'talktalk') {
            const items = _.zip(item.text);
            const convs = await Promise.map(items, async ([ text ]) => {
                return [
                    new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [ new docx.TextRun({ text: `<톡톡: ${ text }>`, bold: 1 }) ] }),
                ];
            });
            children.push(...convs.flat());
        }
        if(item.type == 'material') {
            const items = _.zip(item.image, item.title);
            const convs = await Promise.map(items, async ([ image, title ]) => {
                return [
                    await container_image(image),
                    new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [ new docx.TextRun({ text: title, bold: 1 }) ] }),
                ];
            });
            children.push(...convs.flat());
            const description = await Promise.map(item.description, async (description) => {
                return [
                    new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [ new docx.TextRun({ text: description }) ] }),
                ];
            });
            children.push(...description.flat());
        }
        return children.length && container(children.flat());
    });
    const children = items.filter(v=>!!v).flat();
    const properties = {};
    // metadata
    const head = content.sections.find(o=>o.type == 'title');
    const meta = {};
    meta.subject = content.info.blog.blogDirectoryName;
    meta.creator = meta.lastModifiedBy = content.info.blog.displayNickName;
    meta.title = head ? head.text.join(', ') : '알 수 없는 문서';
    meta.keywords = `naver; blog; post; 네이버; 블로그; 네이버블로그; 포스팅; ${content.info.user.nickname} ;${content.info.user.userId}`;
    meta.description = '개발자 최원의 프로그램을 이용해 저장된 문서입니다.\r\nhttps://tampermonkey.myso.kr/';
    meta.sections = [ { children, properties } ];
    return meta;
}
GM_App(async function main() {
    GM_donation('#viewTypeSelector, #postListBody, #wrap_blog_rabbit, #writeTopArea, #editor_frame', 0);
    GM_addScript('https://cdn.jsdelivr.net/npm/docx@6.0.3/build/index.js');
    GM_addScript('https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js');
    GM_addScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js');
    GM_addScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.js');
    GM_addStyle(`
    .se-utils > ul > li > button { margin-top: 14px !important; }
    .se-util-button-docx::before {
      display: inline-block; width: 37px; height: 37px;
      line-height: 40px; text-align: center; font-size: 16px; color: #666;
      content: '\\1F4BE' !important;
    }
    .se-utils-item-docx-loading .se-util-button-docx::before { animation: spin1 2s infinite linear; }
    .se-utils-item-docx[data-process-keyword-info]::after {
      display: none; position: absolute; z-index: -1; margin:auto; right: 20px; top: -240px; bottom: 0px; margin-bottom: 10px;
      padding: 15px; width: 300px; height: auto; overflow-y: auto; white-space: pre-line;
      border: 1px solid #ddd; border-radius: 8px; background-color: #fff;
      content: attr(data-process-keyword-info); line-height: 1.5rem;
    }
    .se-utils-item-docx[data-process-keyword-info]:hover::after { display: block; }
    `);
    const uri = new URL(location.href), params = Object.fromEntries(uri.searchParams.entries());
    const user = await NB_blogInfo('', 'BlogUserInfo'); if(!user) return;
    const blog = await NB_blogInfo(user.userId, 'BlogInfo'); if(!blog) return;
    async function handler(e) {
        const mnu = document.querySelector('.se-ultils-list');
        if(mnu) {
            const wrp = mnu.querySelector('.se-utils-item.se-utils-item-docx') || document.createElement('li'); wrp.classList.add('se-utils-item', 'se-utils-item-docx'); mnu.prepend(wrp);
            const btn = wrp.querySelector('button') || document.createElement('button'); btn.classList.add('se-util-button', 'se-util-button-docx'); btn.innerHTML = '<span class="se-utils-text">Word 문서로 저장</span>'; wrp.append(btn);
            if(!window.__processing_content) {
                wrp.classList.toggle('se-utils-item-docx-loading', window.__processing_content = true);
                btn.onclick = async function(){
                    const adblocked = await GM_detectAdBlock(v=>v);
                    if(adblocked) {
                        const cfrm = confirm('광고 차단 플러그인이 발견 되었습니다!\n브라우저의 광고 차단 설정을 해제해주세요.\n\n개발자 최원의 모든 프로그램은\n후원 및 광고 수익을 조건으로 무료로 제공됩니다.\n\nhttps://blog.naver.com/cw4196\n후원계좌 : 최원 3333-04-6073417 카카오뱅크');
                        if(cfrm) window.open('https://in.naverpp.com/donation');
                    } else {
                        let imgs, slides;
                        do {
                            const content = document.querySelector('.se-content');
                            content.scrollTo({ top: 0 });
                            content.scrollTo({ top: content.scrollHeight, behavior: 'smooth' });
                            slides = Array.from(content.querySelectorAll('.se-imageGroup-container'));
                            slides.map((el)=>el.style.overflow = 'auto');
                            imgs = Array.from(content.querySelectorAll('img[src^="data:"]'));
                            imgs.map((el)=>el.scrollIntoView());
                            await Promise.delay(1000);
                        } while (imgs.length);
                        slides.map((el)=>el.style.overflow = 'hidden');
                        const data = SE_parse(document, { user, blog });
                        const json = JSON.stringify(data);
                        GM_addScript(`async () => {
                          try {
                            let __transformContent = ${json};
                            let __transformDocument = ${transformDocument};
                            let __transformOpts = await __transformDocument(__transformContent);
                            let __transformDocx = new docx.Document(__transformOpts);
                            let __transformBlob = await docx.Packer.toBlob(__transformDocx);
                            let head = __transformContent.sections.find(o=>o.type == 'title');
                            let name = head ? head.text.join(', ') : '알 수 없는 문서';
                            saveAs(__transformBlob, name+'.docx');
                            console.log("Document created successfully");
                          }catch(e){ console.log(e); }
                        }`);
                    }
                }
                wrp.classList.toggle('se-utils-item-docx-loading', window.__processing_content = false);
            }
        }
    }
    window.addEventListener('keyup', handler, false);
    window.addEventListener('keydown', handler, false);
    window.addEventListener('keypress', handler, false);
    handler();
});