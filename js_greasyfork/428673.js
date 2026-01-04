// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 오디오 리더
// @description  네이버 블로그의 글을 소리내어 읽어줍니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.10
// @author       Won Choi
// @connect      naver.com
// @match        *://blog.naver.com/PostView*
// @match        *://blog.naver.com/PostList*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-speech-tts.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/naver-blog.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/smart-editor-one.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuidv4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/sprintf/1.1.2/sprintf.min.js
// @downloadURL https://update.greasyfork.org/scripts/428673/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EC%98%A4%EB%94%94%EC%98%A4%20%EB%A6%AC%EB%8D%94.user.js
// @updateURL https://update.greasyfork.org/scripts/428673/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EC%98%A4%EB%94%94%EC%98%A4%20%EB%A6%AC%EB%8D%94.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
    GM_donation('#viewTypeSelector, #postListBody, #wrap_blog_rabbit, #writeTopArea, #editor_frame', 0);
    GM_addStyle(`a._readVoice .ico_spd { display: block; position: absolute; right: 13px; top: 13px; width: 20px; height: 20px; text-align: center; line-height: 20px; font-size:11px; font-weight: bold; }`);
    async function speaker_wheel(event) {
        speaker.disable_autoscroll = true;
        speaker_wheel.timer = clearTimeout(speaker_wheel.timer);
        speaker_wheel.timer = setTimeout(() => speaker.disable_autoscroll = false, 10000);
    }
    async function speaker(section, items, options = {}) {
        options = Object.assign({ offset: 0, delay: 0, format: '%s' }, options);
        if(!section) return;
        if(!items) {
            if(!speaker.disable_autoscroll) section.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
            return await Promise.delay(options.delay);
        }
        if(typeof items === 'string') {
            if(!speaker.disable_autoscroll) section.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
            return await GM_speech(sprintf(options.format, items), options);
        }
        const lines = Array.from(section ? section.querySelectorAll('.se-text-paragraph, .se_textarea') : []).concat([section]);
        for(let item, i = 0; item = items[i]; i++) {
            let idx = i + options.offset;
            let dom = lines[idx] || section;
            if(!speaker.disable_autoscroll) dom.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
            await GM_speech(sprintf(options.format, item), options);
        }
    }
    async function stopper(event) {
        handler.running = false
        if(GM_speechState()) {
            GM_speechReset();
            await GM_speech('글 읽기가 취소되었습니다. 다음에 다시 또 이용해주세요.');
            await GM_speech('네이버 블로그 오디오 리더가 마음에 드셨다면, 개발자 최원을 후원해주세요. 이용해 주셔서 감사합니다.');
        }
    }
    async function starter(event, rate = 1) {
        const ratio = 1 / rate;
        if(!GM_speechState()) {
            handler.running = true;
            const sections = SE_parseNodes(wrapper), se = SE_parse(wrapper);
            for(let item of se.sections) {
                if(GM_speechState()) break;
                const section = sections[item.offset];
                if(item.type == 'title') {
                    await speaker(section, item.text, { rate, offset: 0 });
                }
                if(item.type == 'text') {
                    await speaker(section, item.text, { rate, offset: 0 });
                }
                if(item.type == 'image') {
                    await speaker(section, item.description, { rate, offset: 0, format: '첨부된 이미지에 대한 설명입니다. %s' });
                }

                if(item.type == 'video') {
                    await speaker(section, '첨부된 영상에 대한 설명입니다.', { rate });
                    await speaker(section, item.title, { rate });
                    await speaker(section, item.description, { rate, offset: item.title.length });
                }
                if(item.type == 'line') {
                    await speaker(section, null, { delay: 1500*ratio });
                }
                if(item.type == 'sticker') {
                    await speaker(section);
                }
                if(item.type == 'quotation') {
                    await speaker(section, item.title, { rate });
                    await speaker(section, item.description, { rate, offset: item.title.length });
                }
                if(item.type == 'places') {
                    await speaker(section);
                    for(let location of item.location) {
                        const items = _.zip(location.name, location.addr);
                        for(let item of items) await GM_speech(`첨부된 장소 ${item[0]}의 주소는 ${item[1]}입니다.`, { rate });
                    }
                }
                if(item.type == 'link') {
                    await speaker(section);
                    const items = _.zip(item.title, item.description, item.hostname);
                    for(let item of items) {
                        await GM_speech(`첨부된 웹문서, "${item[0]}"`, { rate });
                    }
                }
                if(item.type == 'file') {
                    await speaker(section);
                    for(let text of item.name) await GM_speech(`${text} 파일이 첨부되어 있습니다.`, { rate });
                }
                if(item.type == 'schedule') {
                    await speaker(section, '네이버 블로그 오디오 리더가 지원하지 않는 일정이 포함되어 있습니다.', { rate, delay: 1500*ratio });
                }
                if(item.type == 'table' && item.table) {
                    await speaker(section, '네이버 블로그 오디오 리더가 지원하지 않는, 표가 포함되어 있습니다.', { rate, delay: 1500*ratio });
                }
                if(item.type == 'code') {
                    await speaker(section, '네이버 블로그 오디오 리더가 지원하지 않는, 코드 내용이 포함되어 있습니다.', { rate, delay: 1500*ratio });
                }
                if(item.type == 'formula') {
                    await speaker(section, '네이버 블로그 오디오 리더가 지원하지 않는, 수식 정보가 포함되어 있습니다.', { rate, delay: 1500*ratio });
                }
                if(item.type == 'talktalk') {
                    await speaker(section, '궁금할 땐 네이버 톡톡하세요!', { rate });
                }
                if(item.type == 'material') {
                    await speaker(section, '네이버 블로그 오디오 리더가 지원하지 않는, 글감 정보가 포함되어 있습니다.', { rate, delay: 1500*ratio });
                }
            }
            if(!GM_speechState()) {
                await GM_speech('이상. 모든 글의 읽기가 완료되었습니다.');
                await GM_speech('네이버 블로그 오디오 리더가 마음에 드셨다면, 개발자 최원을 후원해주세요. 이용해 주셔서 감사합니다.');
                await GM_speechReset();
            }
        }
        GM_speechReset();
        handler.running = false;
    }
    async function handler(event) {
        if(handler.running && event && event.type == 'keydown' && event.keyCode == 27) stopper(event);
        const wrappers = Array.from(document.querySelectorAll('[data-post-editor-version]'));
        wrappers.map((wrapper) => {
            const menu = wrapper.querySelector('.lyr_overflow_menu'); if(!menu) return;
            const menu_append = (type, rate = 1) => {
                const item = menu.querySelector(`a._readVoice.${type}`) || document.createElement('a'); if(item.className) return;
                item.classList.add('_readVoice', type); item.href = '#'; menu.append(item); item.innerHTML = `오디오 블로그 <span class="ico_spd">x${rate.toFixed(1)}</span>`;
                item.onclick = async function(event) { event.preventDefault(); await starter(event, rate); }
            }
            menu_append('x100', 1.0);
            menu_append('x130', 1.3);
            menu_append('x150', 1.5);
        });
    }
    window.addEventListener('keyup', handler, false);
    window.addEventListener('keydown', handler, false);
    window.addEventListener('keypress', handler, false);
    window.addEventListener('click', handler, false);
    window.addEventListener('mousewheel', speaker_wheel, false);
    handler();
});