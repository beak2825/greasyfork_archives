// ==UserScript==
// @name         Wisdom Interpreter
// @namespace    http://tampermonkey.net/
// @version      2024-06-09-5
// @description  Python Runner for AI, You can use it to run python code in the web
// @author       WuJunkai2004
// @license      MIT
// @match        *://yiyan.baidu.com
// @match        *://tongyi.aliyun.com/qianwen/
// @match        *://gemini.google.com/*
// @match        *://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497449/Wisdom%20Interpreter.user.js
// @updateURL https://update.greasyfork.org/scripts/497449/Wisdom%20Interpreter.meta.js
// ==/UserScript==
function get_site_info(){
    let url = window.location.href;
    let support = [
        {
            'site': 'yiyan',
            'id': '#DIALOGUE_CONTAINER_ID',
            "cmd": "for_baidu;"
        },{
            'site': 'tongyi',
            'id': '#chat-content',
            "cmd": "for_aliyun;"
        },{
            'site': 'gemini',
            'id': '.content-wrapper',
            "cmd": "for_gemini;"
        },{
            "site": "chatgpt.com",
            "id": ".pb-9",
            "cmd": "for_chatgpt;"
        }
    ]
    for(let site of support){
        if(url.includes(site.site)){
            return site;
        }
    }
}

let observer = null;

async function inject_runner(){
    observer = new MutationObserver((mutationsList, mutationObserver) => {
        // insert element
        // debounce
        let last_time = localStorage.getItem('last_time') || null;
        last_time = last_time ? parseInt(last_time) : null;
        if(last_time){
            clearTimeout(last_time);
        }
        // run the code
        last_time = setTimeout(eval(get_site_info().cmd), 2000);
        localStorage.setItem('last_time', last_time);
    }).observe(document.querySelector(get_site_info().id), {
        childList: true,
        subtree: true,
        characterData: true
    });
}

async function inject_stdlib(){
    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/WuJunkai2004/Python-Runner-Plugin@delta/brython_stdlib.js';
    script.onload = inject_runner;
    document.body.appendChild(script);
}

async function inject_brython(){
    if(window.location.href.includes('chatgpt.com')){
        // 注入meta标签
        // <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'nonce-fad90428-621b-47e4-815c-cd1e204b5312' 'sha256-RvbVrdDS11FSnQaULCOgXPA5u0nMP2Im1d2pGiRBGC4=' 'sha256-eMuh8xiwcX72rRYNAGENurQBAcH7kLlAUQcoOri3BIo=' http://localhost:8787">
        let meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        let content = "script-src-elem 'self' 'nonce-642953da-fa5b-45a4-84c7-afc8d603da9a' 'sha256-RvbVrdDS11FSnQaULCOgXPA5u0nMP2Im1d2pGiRBGC4=' 'sha256-eMuh8xiwcX72rRYNAGENurQBAcH7kLlAUQcoOri3BIo=' auth0.openai.com challenges.cloudflare.com chatgpt.com/ces https://*.chatgpt.com https://*.chatgpt.com/ https://*.oaistatic.com https://api.openai.com https://apis.google.com https://chat.openai.com https://chatgpt.com/ https://chatgpt.com/backend-anon https://chatgpt.com/backend-api https://chatgpt.com/graphql https://chatgpt.com/public-api https://chatgpt.com/voice https://docs.google.com https://jidori.g1.internal.services.openai.org https://js.live.net/v7.2/OneDrive.js https://oaistatic.com https://snc.apps.openai.com https://snc.chatgpt.com/backend/se https://tcr9i.chat.openai.com https://tcr9i.chatgpt.com/ https://www-onepick-opensocial.googleusercontent.com wss://*.chatgpt.com wss://*.chatgpt.com/ http://localhost:8787";
        meta.content = content;
        await sleep(1000);
        document.head.appendChild(meta);
    }
    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/WuJunkai2004/Python-Runner-Plugin@delta/brython.min.js';
    script.onload = inject_stdlib;
    document.body.appendChild(script);
}

async function sleep(ms){
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function get_dialogue_container(){
    let first_time = true;
    let container = null;
    let id = get_site_info().id;
    do{
        container = document.querySelector(id);
        if(first_time != true){
            await sleep(1000);
        } else {
            first_time = false;
        }
    }while(!container);
    return container;
}

function generate_run_svg(size){
    //M3 2 L26 16 L3 30 L5 26 L22 16 L5 6 L5 26 L3 30 Z
    //it is for 32*32
    return `M${size*0.09375} ${size*0.0625} L${size*0.8125} ${size*0.5} L${size*0.09375} ${size*0.9375} L${size*0.15625} ${size*0.8125} L${size*0.6875} ${size*0.5} L${size*0.15625} ${size*0.1875} L${size*0.15625} ${size*0.8125} L${size*0.09375} ${size*0.9375} Z`
}

function for_baidu(){
    console.log('baidu');
    function insert_after(new_node, target_node){
        let parent = target_node.parentNode;
        if(parent.lastChild == target_node){
            parent.appendChild(new_node);
        } else {
            parent.insertBefore(new_node, target_node.nextSibling);
        }
    };
    let code_block = document.querySelectorAll('.language-python');
    for(let code of code_block){
        let is_done = code.getAttribute('is-done') || null;
        if(is_done){
            continue;
        }
        code.setAttribute('is-done', true);
        // add the display block
        let id = Math.random().toString(36).slice(-8);
        let result = code.parentNode.cloneNode(true);
        result.setAttribute('id', id);
        result.querySelectorAll('.code-copy').forEach(element => element.remove());
        result.querySelector('.code-lang').innerText = 'output';
        result.querySelector('tbody').innerHTML = '';
        result.querySelector('tbody').setAttribute('id', id + '_output');
        result.setAttribute('hidden', true);
        insert_after(result, code.parentNode);
        // get the code script
        let tr_list = code.getElementsByTagName('tr');
        let code_text = `def print(*args,sep=' ', end='\\n', file='', flush='', init=False):\n` +
                        '    from browser import document\n' +
                        '    text = "  " + sep.join(list(map(str, args)))\n' +
                        '    if init:\n' +
                        `        document['${id}_output'].innerHTML = ''\n` +
                        '        return\n' +
                        `    document['${id}'].hidden = False\n` +
                        `    document['${id}_output'].innerHTML += text + end\n` +
                        'print(init=True)\n'
        for(let tr of tr_list){
            code_text += tr.innerText.slice(1) + '\n';
        }
        // show the run cpy_button
        let cpy_button = code.getElementsByClassName('code-copy')[0];
        let run_button = cpy_button.cloneNode(true);
        run_button.addEventListener('click', () => {
            console.log(code_text);
            try{
                window.__BRYTHON__.runPythonSource(code_text, id);
            } catch(e) {
                document.getElementById(id + '_output').innerHTML += '\n  Error: 因错误而退出\n';
                document.getElementById(id).hidden = false;
                console.log(e);
            }
        });
        run_button.querySelector('path').setAttribute('d', generate_run_svg(32));
        run_button.getElementsByClassName('code-copy-text')[0].innerText = '运行代码';
        insert_after(run_button, cpy_button);
    }
}


function for_aliyun(){
    function insert_after(new_node, target_node){
        let parent = target_node.parentNode;
        if(parent.lastChild == target_node){
            parent.appendChild(new_node);
        } else {
            parent.insertBefore(new_node, target_node.nextSibling);
        }
    };
    let code_block = document.querySelectorAll('.tongyi-ui-highlighter');
    for(let code of code_block){
        let is_done = code.getAttribute('is-done') || null;
        if(is_done){
            continue;
        }
        code.setAttribute('is-done', true);
        // 排除掉不是python的代码块
        if(code.querySelector('span').innerText !== "Python"){
            continue;
        }
        // 添加显示结果的代码块
        let id = Math.random().toString(36).slice(-8);
        let result = code.parentNode.cloneNode(true);
        result.setAttribute('id', id);
        result.querySelectorAll('.tongyi-ui-highlighter-copy-btn').forEach(element => element.remove());
        result.querySelector('.tongyi-ui-highlighter-lang').innerHTML = 'Output';
        result.querySelector('code').innerHTML = '';
        result.querySelector('code').setAttribute('id', id + '_output');
        result.setAttribute('hidden', true);
        insert_after(result, code.parentNode);
        // get the code script
        let text_list = code.querySelector('code').innerText.split('\n');
        let code_text = `def print(*args,sep=' ', end='\\n', file='', flush='', init=False):\n` +
                        '    from browser import document\n' +
                        '    text = " " + sep.join(list(map(str, args)))\n' +
                        '    if init:\n' +
                        `        document['${id}_output'].innerHTML = ''\n` +
                        '        return\n' +
                        `    document['${id}'].hidden = False\n` +
                        `    document['${id}_output'].innerHTML += text + end\n` +
                        'print(init=True)\n';
        for(let line_id=1; line_id<=text_list.length; line_id++){
            let id_len = line_id.toString().length;
            code_text += text_list[line_id-1].slice(id_len) + '\n';
        }
        // show the run cpy_button
        let cpy_button = code.querySelector('svg');
        let run_button = cpy_button.cloneNode(true);
        run_button.setAttribute('style', 'margin-left: 10px;');
        run_button.querySelector('path').setAttribute('d', generate_run_svg(12));
        run_button.addEventListener('click', () => {
            console.log(code_text);
            try{
                window.__BRYTHON__.runPythonSource(code_text, id);
            } catch(e) {
                document.getElementById(id + '_output').innerHTML += '\n Error: 因错误而退出\n';
                document.getElementById(id).hidden = false;
                console.log(e);
            }
        });
        insert_after(run_button, cpy_button);
        console.log('done');
    }
}

function for_chatgpt(){
    function insert_after(new_node, target_node){
        let parent = target_node.parentNode;
        if(parent.lastChild == target_node){
            parent.appendChild(new_node);
        } else {
            parent.insertBefore(new_node, target_node.nextSibling);
        }
    };
    let code_block = document.querySelectorAll('pre');
    for(let code of code_block){
        let is_done = code.getAttribute('is-done') || null;
        if(is_done){
            continue;
        }
        code.setAttribute('is-done', true);
        // 排除掉不是python的代码块
        if(code.querySelector('span').innerText !== 'python'){
            continue;
        }
        // 添加显示结果的代码块
        let id = Math.random().toString(36).slice(-8);
        let result = code.cloneNode(true);
        result.setAttribute('id', id);
        result.querySelector('span').nextElementSibling.remove()
        result.querySelector('span').innerText = 'output';
        let code_text = `def print(*args,sep=' ', end='\\n', file='', flush='', init=False):\n` +
                        '    from browser import document\n' +
                        '    text = " " + sep.join(list(map(str, args)))\n' +
                        '    if init:\n' +
                        `        document['${id}_output'].innerHTML = ''\n` +
                        '        return\n' +
                        `    document['${id}'].hidden = False\n` +
                        `    document['${id}_output'].innerHTML += text + end\n` +
                        'print(init=True)\n';
        code_text += code.querySelector('code').innerText + '\n';
        result.querySelector('code').innerHTML = '';
        console.log(code_text);
    }
}


(async function() {
    'use strict';
    await get_dialogue_container();
    console.log('Python Runner for AI is running...');
    await inject_brython();
})();