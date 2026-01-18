// ==UserScript==
// @name         kone base64 자동복호화
// @namespace    http://tampermonkey.net/
// @version      1.5.3
// @description   base64코드 자동복호화
// @author       SYJ
// @match        https://arca.live/*
// @match        https://kone.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441706/kone%20base64%20%EC%9E%90%EB%8F%99%EB%B3%B5%ED%98%B8%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/441706/kone%20base64%20%EC%9E%90%EB%8F%99%EB%B3%B5%ED%98%B8%ED%99%94.meta.js
// ==/UserScript==

// 자주 바뀜. 취약한 셀렉터
const SHADOW_ROOT_SELECTOR = "main #post_content";
const ARTICLE_LIST_SELECTOR = 'main .grow.flex .grow.grid'; // 글목록 셀렉터
const ARTICLE_TITLE_SELECTOR = 'main .md\\:items-center'; // 본문에서 글제목 셀렉터
const POST_EDITOR_SELECTOR = '#post_editor'; // 포스트 에디터가 감지될 경우 동작 종료 위함.

const MAX_DECODE_COUNT = 10+1;

window.addEventListener('load', ()=>setTimeout(main, 1000));

async function main(){
    observeUrlChange(renderUI);
    const isAutoMode = await GM_getValue('toggleVal', true);
    if (isAutoMode) {
        observeUrlChange(applyAuto);
        setTimeout(applyManually, 1000);
    }
    else {

        setTimeout(applyManually, 1000);
    }
}

function applyManually() {
    document.body.addEventListener('keydown', function(e){
        if (e.ctrlKey && e.shiftKey && e.altKey && (e.key == 'f' || e.key == 'F')){
            decodeSelectedRange();
        }
    });
    document.body.addEventListener('dblclick', function(e) {
        decodeSelectedRange();
        return;
        console.log('더블클릭 감지! 🎉',e.target,event.composedPath()[0]);
        const el = e.composedPath()[0];
        const nodes = Array.from(el.childNodes).filter(node=>node.nodeType ===Node.TEXT_NODE)
        console.log(nodes)
        for (const node of nodes){
            const original = node.textContent;
            const decodedLink = doDecode(original);
            // console.log(node, original, decodedLink);
            if (original === decodedLink) continue;
            linkifyTextNode(node, decodedLink);
        }
    })
}

function applyAuto() {
    if(document.body.querySelector(POST_EDITOR_SELECTOR)) {return;} // 글수정중엔 변환하지 않음
    const contents = Array.from(document.querySelectorAll(`${ARTICLE_LIST_SELECTOR} :is(${textTagNames})`)); // 글목록
    contents.push(...Array.from(document.querySelectorAll(`${ARTICLE_TITLE_SELECTOR} :is(${textTagNames})`))); // 글본문의 제목


    const mainContents = Array.from(document.querySelector(SHADOW_ROOT_SELECTOR)?.shadowRoot?.querySelectorAll(textTagNames) ?? []); // 글본문
    contents.push(...mainContents);


    console.log('main')
    //mainContents.forEach(console.log)
    for (const tag of contents) {
        const nodes = Array.from(tag.childNodes).filter(node=>node.nodeType ===Node.TEXT_NODE)

        for (const node of nodes){
            const original = node.textContent;
            const decodedLink = doDecode(original);

            console.log(original,'->', decodedLink);
            if (original === decodedLink) continue;
            //console.log(original,'->', decodedLink);
            linkifyTextNode(node, decodedLink);
        }
    }

    console.log('더이상 디코드할 수 없는 목록 :', Array.from(nonBase64Collection));
}

const textTagNames = 'p, span, div, a, li,' +      // 일반 컨테이너
      'h1, h2, h3, h4, h5, h6,' +    // 제목 요소
      'em, strong, u, b, i, small, mark, td, ' +   // 인라인 포맷팅 요소
      'label, button, option, textarea' // 폼/인터페이스 요소

// 텍스트노드에 존재하는 url을 a태그로 바꿈. (url포함 텍스트노드 -> 텍스트노드1 + a태그 + 텍스트노드2)
function linkifyTextNode(Node, text) {
    const urlRegex = /(https?:\/\/[^\s]+)/; // URL 매칭 (https:// 로 시작해서 공백 전까지)
    Node.textContent = text;

    if (!urlRegex.test(text)) { // URL 없으면 텍스트 덮어씌우고 종료
        console.log('url없어서 종료', text)
        return;
    }

    let node = Node;
    while(urlRegex.test(node?.textContent ?? '')){
        const match = urlRegex.exec(node.textContent);

        const url = match[0];
        const start = match.index;
        const urlLen = url.length;

        // "텍스트1 URL 텍스트2" 꼴의 텍스트노드를 세 개로 분리
        // 1) URL 앞부분과 뒤를 분리
        const textNode = document.createTextNode(node.textContent);
        const afterUrlStart = textNode.splitText(start);
        const afterUrlEnd = afterUrlStart.splitText(urlLen);
        const beforeUrlStart = textNode;

        // 2) <a> 요소 생성 후 URL 텍스트 노드 대신 교체. parent
        const a = makeATag(url)
        node.parentNode.replaceChild(a, node);
        node = afterUrlEnd;
        a.before(beforeUrlStart);
        a.after(afterUrlEnd);

    }

}
   function makeATag(link){
        const aTag = document.createElement('a');
        aTag.href = link;
        aTag.textContent = link;
        aTag.target = '_blank';
        aTag.rel = 'noreferrer';
        return aTag;
    }


// 노드 하나에 존재하는 모든 base64구문을 복원함.
function doDecode(text) {
    ///'use strict';
    let result = text;
    result = dec(/(?!http)[0-9A-Za-z+/]{6,}={0,2}/g, result); //문자열 6회 + '=' 0~2회
    if (text !==result) console.log(`${text}->${result}`)
    return result;

    function dec(reg, text) {
        let result = text;
        const maps = Array.from(result.match(reg) ?? []) // base64 청크
        .map(o=>({before:o, after:decodeNtime(o)})) // base64 to 원본 매핑
        maps.forEach(({before, after})=>{result = result.replace(before, after)}); // 적용

        return result;
    }
}

// 원문으로 가능한 패턴 (한영숫자 + 자주쓰는 특문 + 한자)
// 허용 범위
// 한글                 : \uAC00-\uD7A3
// 히라가나             : \u3040-\u309F
// 카타카나             : \u30A0-\u30FF
// CJK 한자             : \u3400-\u4DBF, \u4E00-\u9FFF, \uF900-\uFAFF
// CJK 구두점·전각 특수문자: \u3000-\u303F
// 전각 괄호             : \uFF08-\uFF09
// 영숫자               : A-Za-z0-9
// 반각 특수문자         : !@#\$%\^&\*\(\)_\-\+=\[\]\{\}\\|;:'",.<>\/\?
const WORD_TEST = /^[ㄱ-ㅎ가-힣A-Za-z0-9!@#\$%\^&\*\(\)_\-\+=\[\]\{\}\\|;:/'",.<>\/\?!@#$%^&*()_+-=`~|\s\uAC00-\uD7A3\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\u3000-\u303F\uFF08-\uFF09]+$/;

const nonBase64Collection = new Set();

function decodeNtime(str) {
    let decoded = str;

    for (let i=0; i<MAX_DECODE_COUNT; i++){
        const old = decoded;
        decoded = decodeOneTime(decoded);
        if (decoded === old) return decoded;
    }

    function decodeOneTime(str) {
        try {
            const decoded = base64DecodeUnicode(str)
            const isBase64 = (str)=>WORD_TEST.test(str);
            if (!isBase64(decoded)) {
                nonBase64Collection.add(str);
                //console.log('[정상 유니코드 범위가 아님]'+JSON.stringify(str)+'->'+JSON.stringify(decoded));
                return str;
            }
            return decoded;
        }
        catch(e) {
            //console.log('[FAIL]',str, e);
            return str; }
    }

    function base64DecodeUnicode(str) {
        const binary = atob(str); // 1) atob으로 디코딩 → 1바이트 문자열
        const bytes = new Uint8Array(
            Array.from(binary, ch => ch.charCodeAt(0)) // 2) 각 문자(=바이트)를 숫자로 뽑아 Uint8Array 생성
        );
        return new TextDecoder('utf-8').decode(bytes); // 3) TextDecoder로 'utf-8' 디코딩
    }

}

// UI

async function renderUI() {
    // 1) 값 로드
    let val = await GM_getValue('toggleVal', true);
    let menuId;

    // 렌더
    render();

    function render() {
        // 메뉴 해제 후 다시 등록
        if (menuId) GM_unregisterMenuCommand(menuId);
        menuId = GM_registerMenuCommand(
            `자동모드 토글 (현재: ${val?'ON':'OFF'})`,
            toggleValue
        );
    }

    async function toggleValue() {
        const newVal = !val;
        await GM_setValue('toggleVal', newVal);
        val = newVal;    // 변수 갱신
        render();        // 메뉴·배지 즉시 갱신
    }
}

const observeUrlChange = (func) => {
    const body = document.querySelector('body');
    const throttled = throttle(func);

    throttled(0);
    const observer = new MutationObserver(mutations => { throttled(100); throttled(1000); throttled(1500); });
    observer.observe(body, { childList: true, subtree: true, characterData:true });


};

function throttle(func) {
let timeoutId = null;
  return function(delay) {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func();
        timeoutId = null;
      }, delay);
    }
  };
}



// ===== Manual decode debug =====
const DEBUG = true; // 필요할 때만 true

function dbg(...args) {
  if (!DEBUG) return;
  console.log('[b64-decode]', ...args);
}

function decodeSelectedRange() {
  const sel = document.querySelector(SHADOW_ROOT_SELECTOR)?.shadowRoot?.getSelection();
  if (!sel || sel.rangeCount === 0) { dbg('rangeCount=0'); return false; }

  const range = sel.getRangeAt(0);

  // ✅ collapsed 믿지 말고 "실제 선택 텍스트"로 판단
  const selectedText = sel.toString(); // sel.toString()도 OK



  const decoded = doDecode(selectedText);
 if (decoded === selectedText) { dbg('no change after decode'); return false; }

  try {
    range.deleteContents();
      const $aTag = makeATag(decoded);
    range.insertNode($aTag);
      console.log($aTag);
    sel.removeAllRanges();


      return true;
  } catch (err) {
    dbg('replace failed', err);
    return false;
  }
}

